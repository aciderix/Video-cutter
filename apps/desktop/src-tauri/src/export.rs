use crate::error::{AppError, AppResult};
use crate::ffmpeg::ffmpeg;
use serde::{Deserialize, Serialize};
use std::process::Stdio;
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
    /// disambiguate concurrent exports.
    pub job_id: String,
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

#[tauri::command]
pub async fn export_cut(
    request: ExportRequest,
    window: tauri::Window,
) -> AppResult<ExportResult> {
    let ffmpeg_bin = ffmpeg()?;

    // Inject -progress + -stats_period after the program name so we get
    // machine-readable progress on stdout, separate from FFmpeg's banner on
    // stderr. The TS exporter must not pre-set these flags.
    let mut args: Vec<String> = vec![
        "-progress".into(),
        "pipe:1".into(),
        "-stats_period".into(),
        "0.2".into(),
    ];
    args.extend(request.args.iter().cloned());

    let mut child = Command::new(&ffmpeg_bin)
        .args(&args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    let stdout = child.stdout.take().ok_or_else(|| {
        AppError::ParseError("ffmpeg: no stdout".into())
    })?;
    let stderr = child.stderr.take().ok_or_else(|| {
        AppError::ParseError("ffmpeg: no stderr".into())
    })?;

    let job_id = request.job_id.clone();
    let expected_us = (request.expected_duration_s * 1_000_000.0).max(1.0);
    let progress_window = window.clone();

    // Drain stdout (progress key=value blocks) on a task.
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
                        job_id: job_id.clone(),
                        out_time_ms: current.out_time_us / 1_000,
                        percent,
                        speed: current.speed,
                    },
                );
                if line.contains("end") {
                    break;
                }
            }
        }
    });

    // Drain stderr into a ring buffer so we can return the last few lines on
    // failure (FFmpeg writes the real error message there).
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

    let status = child.wait().await?;
    let _ = progress_handle.await;
    let stderr_tail = stderr_handle.await.unwrap_or_default();

    if !status.success() {
        return Err(AppError::FfmpegFailed(
            status.code().unwrap_or(-1),
            stderr_tail,
        ));
    }

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
