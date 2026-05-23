use crate::error::{AppError, AppResult};
use crate::ffmpeg::{ffmpeg, ffprobe};
use crate::media::{
    AudioStreamInfo, MediaSource, RawSilenceInterval, SilenceDetectionSettings, VideoStreamInfo,
};
use crate::peaks::extract_peaks;
use regex::Regex;
use serde_json::Value;
use std::path::Path;
use tokio::process::Command;

#[tauri::command]
pub fn path_exists(path: String) -> bool {
    std::path::Path::new(&path).exists()
}

#[tauri::command]
pub async fn analyze_media(path: String) -> AppResult<MediaSource> {
    let p = Path::new(&path);
    if !p.exists() {
        return Err(AppError::UnsupportedMedia(format!("File not found: {path}")));
    }
    let name = p
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or("clip")
        .to_string();

    let ffprobe_bin = ffprobe()?;
    let output = Command::new(&ffprobe_bin)
        .args([
            "-v",
            "error",
            "-show_format",
            "-show_streams",
            "-of",
            "json",
            &path,
        ])
        .output()
        .await?;

    if !output.status.success() {
        return Err(AppError::FfmpegFailed(
            output.status.code().unwrap_or(-1),
            String::from_utf8_lossy(&output.stderr).into_owned(),
        ));
    }

    let probe: Value = serde_json::from_slice(&output.stdout)
        .map_err(|e| AppError::ParseError(format!("ffprobe JSON: {e}")))?;

    let duration = probe
        .get("format")
        .and_then(|f| f.get("duration"))
        .and_then(|d| d.as_str())
        .and_then(|s| s.parse::<f64>().ok())
        .unwrap_or(0.0);

    let mut video_stream = None;
    let mut audio_stream = None;

    if let Some(streams) = probe.get("streams").and_then(|s| s.as_array()) {
        for s in streams {
            match s.get("codec_type").and_then(|t| t.as_str()) {
                Some("video") if video_stream.is_none() => {
                    video_stream = Some(parse_video_stream(s));
                }
                Some("audio") if audio_stream.is_none() => {
                    audio_stream = Some(parse_audio_stream(s));
                }
                _ => {}
            }
        }
    }

    Ok(MediaSource {
        id: format!("src-{}", fxhash(&path)),
        path,
        name,
        duration,
        has_video: video_stream.is_some(),
        has_audio: audio_stream.is_some(),
        video_stream,
        audio_stream,
    })
}

#[tauri::command]
pub async fn detect_silences(
    path: String,
    settings: SilenceDetectionSettings,
) -> AppResult<Vec<RawSilenceInterval>> {
    let ffmpeg_bin = ffmpeg()?;
    let duration_s = (settings.min_silence_duration_ms as f64) / 1000.0;
    let filter = format!(
        "silencedetect=noise={}dB:d={}",
        settings.threshold_db, duration_s
    );

    let output = Command::new(&ffmpeg_bin)
        .args([
            "-nostdin",
            "-hide_banner",
            "-i",
            &path,
            "-af",
            &filter,
            "-f",
            "null",
            "-",
        ])
        .output()
        .await?;

    let stderr = String::from_utf8_lossy(&output.stderr);

    if !output.status.success() {
        // Video-only sources fall through here because `-af` requires audio.
        // FFmpeg's stderr is the source of truth — match the no-audio cases
        // and return an empty interval list instead of bubbling up a generic
        // failure that the UI cannot interpret.
        if no_audio_stream(&stderr) {
            return Ok(Vec::new());
        }
        return Err(AppError::FfmpegFailed(
            output.status.code().unwrap_or(-1),
            stderr.into_owned(),
        ));
    }

    let total_duration = parse_total_duration(&stderr).unwrap_or(f64::INFINITY);
    Ok(parse_silencedetect(&stderr, total_duration))
}

fn no_audio_stream(stderr: &str) -> bool {
    stderr.contains("does not contain any stream")
        || stderr.contains("Stream specifier 'a' in filtergraph description")
        || stderr.contains("Output file does not contain any stream")
        || (stderr.contains("Stream specifier") && stderr.contains("matches no streams"))
}

#[tauri::command]
pub async fn compute_peaks(
    path: String,
    target_bins: u32,
    expected_duration_s: Option<f64>,
) -> AppResult<Vec<f32>> {
    let bins = target_bins.max(64).min(8192) as usize;
    let dur = expected_duration_s.unwrap_or(0.0);
    let path_clone = path.clone();
    tokio::task::spawn_blocking(move || extract_peaks(&path_clone, bins, dur))
        .await
        .map_err(|e| AppError::Decode(format!("join: {e}")))?
}

fn parse_video_stream(s: &Value) -> VideoStreamInfo {
    VideoStreamInfo {
        width: s.get("width").and_then(|v| v.as_u64()).unwrap_or(0) as u32,
        height: s.get("height").and_then(|v| v.as_u64()).unwrap_or(0) as u32,
        frame_rate: parse_rational(s.get("r_frame_rate").and_then(|v| v.as_str())),
        codec: s
            .get("codec_name")
            .and_then(|v| v.as_str())
            .unwrap_or("unknown")
            .to_string(),
        bitrate: s
            .get("bit_rate")
            .and_then(|v| v.as_str())
            .and_then(|s| s.parse::<u64>().ok()),
    }
}

fn parse_audio_stream(s: &Value) -> AudioStreamInfo {
    AudioStreamInfo {
        sample_rate: s
            .get("sample_rate")
            .and_then(|v| v.as_str())
            .and_then(|s| s.parse::<u32>().ok())
            .unwrap_or(0),
        channels: s.get("channels").and_then(|v| v.as_u64()).unwrap_or(0) as u32,
        codec: s
            .get("codec_name")
            .and_then(|v| v.as_str())
            .unwrap_or("unknown")
            .to_string(),
        bitrate: s
            .get("bit_rate")
            .and_then(|v| v.as_str())
            .and_then(|s| s.parse::<u64>().ok()),
    }
}

fn parse_rational(s: Option<&str>) -> f64 {
    s.and_then(|s| {
        let (num, den) = s.split_once('/')?;
        let n: f64 = num.parse().ok()?;
        let d: f64 = den.parse().ok()?;
        if d == 0.0 {
            None
        } else {
            Some(n / d)
        }
    })
    .unwrap_or(0.0)
}

fn parse_total_duration(stderr: &str) -> Option<f64> {
    let re = Regex::new(r"Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)").ok()?;
    let caps = re.captures(stderr)?;
    let h: f64 = caps.get(1)?.as_str().parse().ok()?;
    let m: f64 = caps.get(2)?.as_str().parse().ok()?;
    let s: f64 = caps.get(3)?.as_str().parse().ok()?;
    Some(h * 3600.0 + m * 60.0 + s)
}

fn parse_silencedetect(stderr: &str, total: f64) -> Vec<RawSilenceInterval> {
    let start_re = Regex::new(r"silence_start:\s*(-?\d+(?:\.\d+)?)").unwrap();
    let end_re = Regex::new(r"silence_end:\s*(-?\d+(?:\.\d+)?)").unwrap();
    let starts: Vec<f64> = start_re
        .captures_iter(stderr)
        .filter_map(|c| c.get(1)?.as_str().parse::<f64>().ok())
        .collect();
    let ends: Vec<f64> = end_re
        .captures_iter(stderr)
        .filter_map(|c| c.get(1)?.as_str().parse::<f64>().ok())
        .collect();

    starts
        .into_iter()
        .enumerate()
        .filter_map(|(i, start)| {
            let s = start.max(0.0);
            let e = ends.get(i).copied().unwrap_or(total);
            if e > s {
                Some(RawSilenceInterval { start: s, end: e })
            } else {
                None
            }
        })
        .collect()
}

fn fxhash(s: &str) -> u64 {
    let mut h: u64 = 0xcbf29ce484222325;
    for b in s.as_bytes() {
        h ^= *b as u64;
        h = h.wrapping_mul(0x100000001b3);
    }
    h
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_silencedetect_output() {
        let stderr = "\
        [silencedetect @ 0x1] silence_start: 1.234\n\
        [silencedetect @ 0x1] silence_end: 2.345 | silence_duration: 1.111\n\
        [silencedetect @ 0x1] silence_start: 5.0\n\
        ";
        let out = parse_silencedetect(stderr, 10.0);
        assert_eq!(out.len(), 2);
        assert!((out[0].start - 1.234).abs() < 1e-6);
        assert!((out[0].end - 2.345).abs() < 1e-6);
        assert_eq!(out[1].start, 5.0);
        assert_eq!(out[1].end, 10.0);
    }

    #[test]
    fn parses_duration() {
        let stderr = "  Duration: 00:01:23.45, start: 0.000000, bitrate: 128 kb/s";
        assert!((parse_total_duration(stderr).unwrap() - 83.45).abs() < 1e-6);
    }

    #[test]
    fn parses_rational() {
        assert_eq!(parse_rational(Some("30000/1001")), 30000.0 / 1001.0);
        assert_eq!(parse_rational(Some("0/0")), 0.0);
        assert_eq!(parse_rational(None), 0.0);
    }
}
