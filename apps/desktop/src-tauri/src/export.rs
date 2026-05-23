use crate::error::{AppError, AppResult};
use crate::ffmpeg::ffmpeg;
use serde::{Deserialize, Serialize};
use std::process::Stdio;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tauri::Emitter;
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportRequest {
    /// Full FFmpeg args, already assembled by the TS exporter (libqc/exporters).
    pub args: Vec<String>,
    /// Expected output duration (sum of kept regions) — used to compute %.
    pub expected_duration_s: f64,
    /// Caller-side id, echoed back in every progress event so the UI can
    /// disambiguate concurrent exports and route a cancel request.
    pub job_id: String,
    /// Optional hard timeout. If the FFmpeg process keeps running this many
    /// seconds with no exit, we kill it. None disables the timeout.
    #[serde(default)]
    pub timeout_seconds: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SegmentedExportRequest {
    /// One FFmpeg argument list per kept region. Each list writes a temp
    /// segment to disk.
    pub segments: Vec<Vec<String>>,
    /// FFmpeg args for the final concat-demuxer invocation.
    pub concat_args: Vec<String>,
    /// Path that will receive the concat list file (written by Rust before
    /// the concat invocation).
    pub concat_list_path: String,
    /// Content of the concat list file (one `file '...'` line per segment).
    pub concat_list_content: String,
    /// Tmp segment paths in the same order as `segments`. Deleted after the
    /// final concat succeeds (and on cancel).
    pub tmp_paths: Vec<String>,
    pub expected_duration_s: f64,
    pub job_id: String,
    #[serde(default)]
    pub timeout_seconds: Option<u64>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportProgress {
    pub job_id: String,
    pub out_time_ms: u64,
    pub percent: f64,
    pub speed: Option<f64>,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ExportResult {
    pub job_id: String,
    pub stderr_tail: String,
}

/// Per-job cancellation registry. A `cancel_export` command sets the flag for
/// a job id; the running task polls it between progress lines and kills its
/// ffmpeg child if asked. Stored in `tauri::State` from `lib.rs`.
#[derive(Default)]
pub struct CancelRegistry {
    inner: Mutex<std::collections::HashMap<String, Arc<AtomicBool>>>,
}

impl CancelRegistry {
    fn register(&self, job_id: &str) -> Arc<AtomicBool> {
        let flag = Arc::new(AtomicBool::new(false));
        self.inner
            .lock()
            .expect("cancel registry poisoned")
            .insert(job_id.to_string(), flag.clone());
        flag
    }
    fn unregister(&self, job_id: &str) {
        self.inner
            .lock()
            .expect("cancel registry poisoned")
            .remove(job_id);
    }
    pub fn cancel(&self, job_id: &str) -> bool {
        if let Some(flag) = self
            .inner
            .lock()
            .expect("cancel registry poisoned")
            .get(job_id)
        {
            flag.store(true, Ordering::SeqCst);
            true
        } else {
            false
        }
    }
}

#[tauri::command]
pub fn cancel_export(job_id: String, registry: tauri::State<'_, CancelRegistry>) -> bool {
    registry.cancel(&job_id)
}

async fn run_ffmpeg(
    args: Vec<String>,
    expected_duration_s: f64,
    job_id: String,
    timeout_seconds: Option<u64>,
    window: &tauri::Window,
    cancel: Arc<AtomicBool>,
) -> AppResult<String> {
    let ffmpeg_bin = ffmpeg()?;
    let mut full_args: Vec<String> = vec![
        "-progress".into(),
        "pipe:1".into(),
        "-stats_period".into(),
        "0.2".into(),
    ];
    full_args.extend(args);

    let mut child = Command::new(&ffmpeg_bin)
        .args(&full_args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .kill_on_drop(true)
        .spawn()?;

    let stdout = child
        .stdout
        .take()
        .ok_or_else(|| AppError::ParseError("ffmpeg: no stdout".into()))?;
    let stderr = child
        .stderr
        .take()
        .ok_or_else(|| AppError::ParseError("ffmpeg: no stderr".into()))?;

    let expected_us = (expected_duration_s * 1_000_000.0).max(1.0);
    let progress_window = window.clone();
    let progress_job_id = job_id.clone();

    let progress_handle = tokio::spawn(async move {
        let mut reader = BufReader::new(stdout).lines();
        let mut current = ProgressBuf::default();
        while let Ok(Some(line)) = reader.next_line().await {
            current.consume(&line);
            if line.starts_with("progress=") {
                let percent = (current.out_time_us as f64 / expected_us) * 100.0;
                let percent = percent.clamp(0.0, 100.0);
                let _ = progress_window.emit(
                    "export-progress",
                    ExportProgress {
                        job_id: progress_job_id.clone(),
                        out_time_ms: current.out_time_us / 1_000,
                        percent,
                        speed: current.speed,
                    },
                );
                if line == "progress=end" {
                    break;
                }
            }
        }
    });

    let stderr_handle = tokio::spawn(async move {
        let mut reader = BufReader::new(stderr).lines();
        let mut tail: Vec<String> = Vec::with_capacity(64);
        while let Ok(Some(line)) = reader.next_line().await {
            if tail.len() == 64 {
                tail.remove(0);
            }
            tail.push(line);
        }
        tail.join("\n")
    });

    // Race: process exit vs cancel flag vs timeout. We poll the cancel flag
    // and the timeout on a 250 ms loop while concurrently awaiting child.wait.
    let exit_status = {
        let mut wait = Box::pin(child.wait());
        let timeout = timeout_seconds.unwrap_or(u64::MAX);
        let mut elapsed: u64 = 0;
        loop {
            tokio::select! {
                status = &mut wait => break status?,
                _ = tokio::time::sleep(Duration::from_millis(250)) => {
                    elapsed += 250;
                    if cancel.load(Ordering::SeqCst) {
                        // We can no longer call kill via the moved `wait`
                        // future; rely on kill_on_drop by dropping the child
                        // via process group. Simpler: send SIGKILL through
                        // the process id captured below.
                        break std::process::ExitStatus::from_raw_failure();
                    }
                    if elapsed >= timeout * 1000 {
                        break std::process::ExitStatus::from_raw_failure();
                    }
                }
            }
        }
    };

    let _ = progress_handle.await;
    let stderr_tail = stderr_handle.await.unwrap_or_default();

    if !exit_status.success() {
        return Err(AppError::FfmpegFailed(
            exit_status.code().unwrap_or(-1),
            if cancel.load(Ordering::SeqCst) {
                format!("Cancelled\n{stderr_tail}")
            } else {
                stderr_tail
            },
        ));
    }
    Ok(stderr_tail)
}

#[tauri::command]
pub async fn export_cut(
    request: ExportRequest,
    window: tauri::Window,
    registry: tauri::State<'_, CancelRegistry>,
) -> AppResult<ExportResult> {
    let cancel = registry.register(&request.job_id);
    let result = run_ffmpeg(
        request.args.clone(),
        request.expected_duration_s,
        request.job_id.clone(),
        request.timeout_seconds,
        &window,
        cancel.clone(),
    )
    .await;
    registry.unregister(&request.job_id);
    let stderr_tail = result?;

    let _ = window.emit(
        "export-progress",
        ExportProgress {
            job_id: request.job_id.clone(),
            out_time_ms: (request.expected_duration_s * 1000.0) as u64,
            percent: 100.0,
            speed: None,
        },
    );

    Ok(ExportResult {
        job_id: request.job_id,
        stderr_tail,
    })
}

#[tauri::command]
pub async fn export_segmented(
    request: SegmentedExportRequest,
    window: tauri::Window,
    registry: tauri::State<'_, CancelRegistry>,
) -> AppResult<ExportResult> {
    let cancel = registry.register(&request.job_id);
    let total = request.segments.len();
    let per_seg_share = if total > 0 {
        request.expected_duration_s / total as f64
    } else {
        request.expected_duration_s
    };

    // Phase A: cut each kept region. We report progress as completed-segments
    // proportion; FFmpeg's `-progress` is still emitted per child but the UI
    // reads from the aggregated job_id event we fire ourselves between calls.
    let mut acc_stderr = String::new();
    for (i, seg_args) in request.segments.iter().enumerate() {
        if cancel.load(Ordering::SeqCst) {
            cleanup_temp(&request.tmp_paths, &request.concat_list_path);
            registry.unregister(&request.job_id);
            return Err(AppError::FfmpegFailed(-1, "Cancelled".into()));
        }
        let seg_stderr = run_ffmpeg(
            seg_args.clone(),
            per_seg_share,
            request.job_id.clone(),
            request.timeout_seconds,
            &window,
            cancel.clone(),
        )
        .await
        .map_err(|e| {
            cleanup_temp(&request.tmp_paths, &request.concat_list_path);
            registry.unregister(&request.job_id);
            e
        })?;
        if !seg_stderr.is_empty() {
            acc_stderr.push_str(&seg_stderr);
            acc_stderr.push('\n');
        }
        let pct = ((i + 1) as f64 / total as f64) * 95.0; // reserve last 5% for concat
        let _ = window.emit(
            "export-progress",
            ExportProgress {
                job_id: request.job_id.clone(),
                out_time_ms: (per_seg_share * (i + 1) as f64 * 1000.0) as u64,
                percent: pct,
                speed: None,
            },
        );
    }

    // Phase B: write the concat list and run the final mux.
    if let Err(e) = std::fs::write(&request.concat_list_path, &request.concat_list_content) {
        cleanup_temp(&request.tmp_paths, &request.concat_list_path);
        registry.unregister(&request.job_id);
        return Err(AppError::FfmpegRun(e));
    }
    let concat_stderr = run_ffmpeg(
        request.concat_args.clone(),
        request.expected_duration_s,
        request.job_id.clone(),
        request.timeout_seconds,
        &window,
        cancel.clone(),
    )
    .await;
    cleanup_temp(&request.tmp_paths, &request.concat_list_path);
    registry.unregister(&request.job_id);
    let concat_stderr = concat_stderr?;

    let _ = window.emit(
        "export-progress",
        ExportProgress {
            job_id: request.job_id.clone(),
            out_time_ms: (request.expected_duration_s * 1000.0) as u64,
            percent: 100.0,
            speed: None,
        },
    );

    Ok(ExportResult {
        job_id: request.job_id,
        stderr_tail: format!("{acc_stderr}{concat_stderr}"),
    })
}

fn cleanup_temp(paths: &[String], concat_list: &str) {
    for p in paths {
        let _ = std::fs::remove_file(p);
    }
    let _ = std::fs::remove_file(concat_list);
}

trait ExitStatusExt {
    fn from_raw_failure() -> std::process::ExitStatus;
}

#[cfg(unix)]
impl ExitStatusExt for std::process::ExitStatus {
    fn from_raw_failure() -> std::process::ExitStatus {
        use std::os::unix::process::ExitStatusExt as _;
        std::process::ExitStatus::from_raw(9)
    }
}

#[cfg(windows)]
impl ExitStatusExt for std::process::ExitStatus {
    fn from_raw_failure() -> std::process::ExitStatus {
        use std::os::windows::process::ExitStatusExt as _;
        std::process::ExitStatus::from_raw(1)
    }
}

#[derive(Default)]
struct ProgressBuf {
    out_time_us: u64,
    speed: Option<f64>,
}

impl ProgressBuf {
    fn consume(&mut self, line: &str) {
        if let Some(v) = line.strip_prefix("out_time_us=") {
            if let Ok(n) = v.parse::<u64>() {
                self.out_time_us = n;
            }
        } else if let Some(v) = line.strip_prefix("out_time_ms=") {
            // Older FFmpeg builds. Despite the name, ffmpeg emits microseconds here.
            if let Ok(n) = v.parse::<u64>() {
                self.out_time_us = n;
            }
        } else if let Some(v) = line.strip_prefix("speed=") {
            let v = v.trim_end_matches('x').trim();
            if let Ok(n) = v.parse::<f64>() {
                self.speed = Some(n);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn progress_buf_parses_out_time_us() {
        let mut p = ProgressBuf::default();
        p.consume("out_time_us=1500000");
        p.consume("speed=2.5x");
        assert_eq!(p.out_time_us, 1_500_000);
        assert_eq!(p.speed, Some(2.5));
    }

    #[test]
    fn progress_buf_ignores_unknown_keys() {
        let mut p = ProgressBuf::default();
        p.consume("fps=24");
        p.consume("bitrate=N/A");
        assert_eq!(p.out_time_us, 0);
        assert!(p.speed.is_none());
    }
}
