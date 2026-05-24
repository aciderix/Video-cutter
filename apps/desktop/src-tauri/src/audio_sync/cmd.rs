//! Tauri command surface: align a clean audio clip against a reference
//! source. The heavy work runs on a blocking thread so the UI thread
//! stays responsive even for hour-long references.

use crate::audio_sync::{align_segmented, align_whole, compute_mfcc, decode_to_mono, AlignmentReport};
use crate::error::{AppError, AppResult};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AlignClipRequest {
    /// Path to the long "reference" track (typically the camera audio
    /// extracted from a video file).
    pub reference_path: String,
    /// Path to the short "candidate" clean clip we want to place.
    pub candidate_path: String,
    /// Alignment strategy. "whole" = single global offset.
    /// "segmented" = chunk-by-chunk (handles out-of-order takes).
    #[serde(default = "default_mode")]
    pub mode: String,
    /// Segment size in seconds (segmented mode only). Default 5 s.
    #[serde(default)]
    pub chunk_seconds: Option<f32>,
    /// Minimum confidence to keep a segment (segmented mode only).
    /// Default 0.2.
    #[serde(default)]
    pub min_confidence: Option<f32>,
}

fn default_mode() -> String {
    "whole".into()
}

#[tauri::command]
pub async fn align_clip(request: AlignClipRequest) -> AppResult<AlignmentReport> {
    tokio::task::spawn_blocking(move || align_blocking(request))
        .await
        .map_err(|e| AppError::Decode(format!("align join: {e}")))?
}

/// Exposed for integration tests; the Tauri command uses this through
/// `spawn_blocking`.
pub fn align_blocking(req: AlignClipRequest) -> AppResult<AlignmentReport> {
    let (ref_samples, ref_sr) = decode_to_mono(&req.reference_path, None, None)?;
    if ref_samples.is_empty() {
        return Err(AppError::Decode("reference has no audio".into()));
    }
    let (cand_samples, cand_sr) = decode_to_mono(&req.candidate_path, None, None)?;
    if cand_samples.is_empty() {
        return Err(AppError::Decode("candidate has no audio".into()));
    }
    let ref_mfcc = compute_mfcc(&ref_samples, ref_sr);
    let cand_mfcc = compute_mfcc(&cand_samples, cand_sr);

    let report = match req.mode.as_str() {
        "segmented" => align_segmented(
            &ref_mfcc,
            &cand_mfcc,
            req.chunk_seconds.unwrap_or(5.0),
            0.5,
            req.min_confidence.unwrap_or(0.2),
        ),
        _ => align_whole(&ref_mfcc, &cand_mfcc),
    };
    Ok(report)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::Path;

    /// End-to-end: decode → MFCC → DTW on real audio files. Tests the
    /// full alignment pipeline against the test.wav fixture (tone +
    /// silence + tone) and a 1-s head clip derived from it.
    /// Skipped if either fixture is missing.
    #[test]
    fn align_clip_finds_head_offset() {
        let ref_path = "/tmp/test.wav";
        let cand_path = "/tmp/test.head.wav";
        if !Path::new(ref_path).exists() || !Path::new(cand_path).exists() {
            eprintln!("skipping: fixtures missing");
            return;
        }
        let report = align_blocking(AlignClipRequest {
            reference_path: ref_path.into(),
            candidate_path: cand_path.into(),
            mode: "whole".into(),
            chunk_seconds: None,
            min_confidence: None,
        })
        .unwrap();
        // The head clip covers t=0..1 of the reference, so the global
        // offset should land within the first ~150 ms.
        assert!(
            report.global_offset_s < 0.2,
            "expected offset ≈ 0, got {}",
            report.global_offset_s
        );
    }
}
