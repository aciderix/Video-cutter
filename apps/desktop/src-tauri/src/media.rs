use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VideoStreamInfo {
    pub width: u32,
    pub height: u32,
    pub frame_rate: f64,
    pub codec: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bitrate: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AudioStreamInfo {
    pub sample_rate: u32,
    pub channels: u32,
    pub codec: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bitrate: Option<u64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MediaSource {
    pub id: String,
    pub path: String,
    pub name: String,
    pub duration: f64,
    pub has_video: bool,
    pub has_audio: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub video_stream: Option<VideoStreamInfo>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub audio_stream: Option<AudioStreamInfo>,
}

/// Mirror of the TS SilenceDetectionSettings. The Rust backend only uses
/// `threshold_db` and `min_silence_duration_ms` (the two FFmpeg
/// `silencedetect=noise:d` parameters). `padding_ms` and
/// `min_keep_duration_ms` are post-processing knobs applied JS-side by
/// `buildRegionsFromSilences`; they're kept here so a single TS-typed
/// settings object can be passed through `invoke` without re-mapping.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SilenceDetectionSettings {
    pub threshold_db: f64,
    pub min_silence_duration_ms: u32,
    #[allow(dead_code)]
    pub padding_ms: u32,
    #[allow(dead_code)]
    pub min_keep_duration_ms: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RawSilenceInterval {
    pub start: f64,
    pub end: f64,
}
