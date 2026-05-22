use crate::error::{AppError, AppResult};
use crate::media::{MediaSource, RawSilenceInterval, SilenceDetectionSettings};
use std::path::Path;

/// Phase 0 stub: returns a placeholder MediaSource so the UI flow can be
/// exercised end-to-end. Phase 1 replaces this with an `ffprobe -of json`
/// invocation parsed into the full struct.
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

    Ok(MediaSource {
        id: format!("src-{}", fxhash(&path)),
        path,
        name,
        duration: 0.0,
        has_video: false,
        has_audio: false,
        video_stream: None,
        audio_stream: None,
    })
}

/// Phase 0 stub: returns an empty list. Phase 1 will spawn:
///   ffmpeg -i <path> -af silencedetect=noise=<th>dB:d=<dur>s -f null - 2>&1
/// and parse stderr into RawSilenceInterval[].
#[tauri::command]
pub async fn detect_silences(
    path: String,
    settings: SilenceDetectionSettings,
) -> AppResult<Vec<RawSilenceInterval>> {
    let _ = path;
    let _ = settings;
    Ok(Vec::new())
}

fn fxhash(s: &str) -> u64 {
    let mut h: u64 = 0xcbf29ce484222325;
    for b in s.as_bytes() {
        h ^= *b as u64;
        h = h.wrapping_mul(0x100000001b3);
    }
    h
}
