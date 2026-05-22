use crate::error::{AppError, AppResult};
use std::path::PathBuf;
use std::sync::OnceLock;

static FFMPEG_PATH: OnceLock<Option<PathBuf>> = OnceLock::new();
static FFPROBE_PATH: OnceLock<Option<PathBuf>> = OnceLock::new();

pub fn ffmpeg() -> AppResult<PathBuf> {
    FFMPEG_PATH
        .get_or_init(|| which::which("ffmpeg").ok())
        .clone()
        .ok_or(AppError::FfmpegMissing)
}

pub fn ffprobe() -> AppResult<PathBuf> {
    FFPROBE_PATH
        .get_or_init(|| which::which("ffprobe").ok())
        .clone()
        .ok_or(AppError::FfmpegMissing)
}
