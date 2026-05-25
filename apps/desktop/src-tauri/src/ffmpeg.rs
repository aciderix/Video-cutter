use crate::error::{AppError, AppResult};
use std::path::PathBuf;
use std::sync::OnceLock;

static FFMPEG_PATH: OnceLock<Option<PathBuf>> = OnceLock::new();
static FFPROBE_PATH: OnceLock<Option<PathBuf>> = OnceLock::new();

pub fn ffmpeg() -> AppResult<PathBuf> {
    FFMPEG_PATH
        .get_or_init(|| locate_binary("ffmpeg"))
        .clone()
        .ok_or(AppError::FfmpegMissing)
}

pub fn ffprobe() -> AppResult<PathBuf> {
    FFPROBE_PATH
        .get_or_init(|| locate_binary("ffprobe"))
        .clone()
        .ok_or(AppError::FfmpegMissing)
}

/// Prefer the Tauri sidecar shipped next to the app binary (`externalBin`
/// in tauri.conf.json copies `binaries/<name>-<triple>[.exe]` into the
/// bundle as `<name>[.exe]` adjacent to the host executable). Fall back
/// to the system PATH so users with a global FFmpeg still get picked up.
fn locate_binary(name: &str) -> Option<PathBuf> {
    let exe_name = if cfg!(windows) {
        format!("{name}.exe")
    } else {
        name.to_string()
    };
    if let Ok(exe) = std::env::current_exe() {
        // Try the immediate exe directory + the macOS app-bundle Resources
        // layout (../Resources, used when the binary lives in
        // Contents/MacOS while sidecars land in Contents/Resources).
        let mut candidates: Vec<PathBuf> = Vec::new();
        if let Some(parent) = exe.parent() {
            candidates.push(parent.join(&exe_name));
            candidates.push(parent.join("../Resources").join(&exe_name));
        }
        for c in candidates {
            if c.is_file() {
                return Some(c);
            }
        }
    }
    which::which(name).ok()
}
