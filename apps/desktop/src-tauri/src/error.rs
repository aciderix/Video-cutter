use serde::{Serialize, Serializer};

#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error("FFmpeg is not available on this system. Install it or wait for the bundled sidecar.")]
    FfmpegMissing,

    #[error("Failed to run FFmpeg: {0}")]
    FfmpegRun(#[from] std::io::Error),

    #[error("FFmpeg exited with status {0}: {1}")]
    FfmpegFailed(i32, String),

    #[error("Could not parse FFmpeg output: {0}")]
    ParseError(String),

    #[error("Unsupported media: {0}")]
    UnsupportedMedia(String),

    #[error("Audio decoding failed: {0}")]
    Decode(String),
}

/// Serialized shape that crosses the Tauri bridge as a JS object instead of a
/// flat string. The frontend can `switch (err.kind)` on the discriminant and
/// surface different UI (e.g. a "Install FFmpeg" prompt for `ffmpegMissing`,
/// a stderr-tail viewer for `ffmpegFailed`).
impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        use serde::ser::SerializeMap;
        let mut map = s.serialize_map(Some(3))?;
        let (kind, code, details) = match self {
            AppError::FfmpegMissing => ("ffmpegMissing", None, String::new()),
            AppError::FfmpegRun(e) => ("ffmpegRun", None, e.to_string()),
            AppError::FfmpegFailed(c, msg) => ("ffmpegFailed", Some(*c), msg.clone()),
            AppError::ParseError(msg) => ("parseError", None, msg.clone()),
            AppError::UnsupportedMedia(msg) => ("unsupportedMedia", None, msg.clone()),
            AppError::Decode(msg) => ("decode", None, msg.clone()),
        };
        map.serialize_entry("kind", kind)?;
        map.serialize_entry("message", &self.to_string())?;
        map.serialize_entry("details", &details)?;
        if let Some(c) = code {
            map.serialize_entry("code", &c)?;
        }
        map.end()
    }
}

pub type AppResult<T> = Result<T, AppError>;
