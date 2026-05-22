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
}

impl Serialize for AppError {
    fn serialize<S: Serializer>(&self, s: S) -> Result<S::Ok, S::Error> {
        s.serialize_str(&self.to_string())
    }
}

pub type AppResult<T> = Result<T, AppError>;
