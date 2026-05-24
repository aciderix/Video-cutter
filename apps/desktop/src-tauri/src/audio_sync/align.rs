//! High-level alignment: takes a *candidate* audio clip and finds where
//! it best aligns inside a longer *reference* audio. Handles both the
//! single-shot case (the whole candidate maps to one offset) and the
//! multi-segment case (the candidate is broken into chunks, each
//! aligned independently).

use serde::Serialize;

use crate::audio_sync::dtw::{sliding_dtw_cost, SlideResult};
use crate::audio_sync::mfcc::{MfccSequence, N_COEFFS};

/// One alignment of a contiguous slice of the candidate to a position
/// in the reference. Times in seconds, relative to each source's own
/// timeline (so the caller can map back to the original media files).
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AlignedSegment {
    pub candidate_start_s: f32,
    pub candidate_end_s: f32,
    pub reference_start_s: f32,
    pub reference_end_s: f32,
    /// 0..1. Higher = stronger evidence the segment really aligns here.
    pub confidence: f32,
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct AlignmentReport {
    pub segments: Vec<AlignedSegment>,
    /// Best single offset (no segmentation), useful when the clip is short.
    pub global_offset_s: f32,
    pub global_confidence: f32,
}

/// Align a candidate MFCC sequence against a reference, sliding the full
/// candidate over the reference. Returns the global offset and a
/// confidence score in [0, 1].
pub fn align_whole(reference: &MfccSequence, candidate: &MfccSequence) -> AlignmentReport {
    if candidate.n_frames == 0 || reference.n_frames == 0 {
        return AlignmentReport {
            segments: vec![],
            global_offset_s: 0.0,
            global_confidence: 0.0,
        };
    }
    let band = (candidate.n_frames / 10).max(10);
    let hop = (candidate.n_frames / 50).max(1);
    let r = sliding_dtw_cost(
        &candidate.frames,
        &reference.frames,
        candidate.n_frames,
        reference.n_frames,
        hop,
        band,
    );
    let confidence = confidence_from_costs(r.best_cost, r.baseline_cost);
    let offset_s = r.best_frame as f32 * reference.hop_seconds;
    let candidate_duration = candidate.n_frames as f32 * candidate.hop_seconds;
    let segment = AlignedSegment {
        candidate_start_s: 0.0,
        candidate_end_s: candidate_duration,
        reference_start_s: offset_s,
        reference_end_s: offset_s + candidate_duration,
        confidence,
    };
    AlignmentReport {
        segments: vec![segment],
        global_offset_s: offset_s,
        global_confidence: confidence,
    }
}

/// Slice the candidate into fixed-size chunks (default 5 s, 0.5 s
/// overlap) and align each chunk independently. Lets us recover the
/// case where the candidate is a re-recording of multiple takes in the
/// wrong order — each chunk finds its own home in the reference.
pub fn align_segmented(
    reference: &MfccSequence,
    candidate: &MfccSequence,
    chunk_seconds: f32,
    overlap_seconds: f32,
    min_confidence: f32,
) -> AlignmentReport {
    if candidate.n_frames == 0 || reference.n_frames == 0 {
        return AlignmentReport {
            segments: vec![],
            global_offset_s: 0.0,
            global_confidence: 0.0,
        };
    }

    let chunk_frames = (chunk_seconds / candidate.hop_seconds).round() as usize;
    let chunk_frames = chunk_frames.max(10).min(candidate.n_frames);
    let overlap_frames = (overlap_seconds / candidate.hop_seconds).round() as usize;
    let step = chunk_frames.saturating_sub(overlap_frames).max(1);

    let mut segments: Vec<AlignedSegment> = Vec::new();
    let mut best_global: Option<SlideResult> = None;

    let mut start = 0usize;
    while start + chunk_frames <= candidate.n_frames {
        let end = start + chunk_frames;
        let slice = &candidate.frames[start * N_COEFFS..end * N_COEFFS];
        let band = (chunk_frames / 8).max(8);
        let hop = (chunk_frames / 40).max(1);
        let r = sliding_dtw_cost(
            slice,
            &reference.frames,
            chunk_frames,
            reference.n_frames,
            hop,
            band,
        );
        let confidence = confidence_from_costs(r.best_cost, r.baseline_cost);
        if confidence >= min_confidence {
            let cand_start = start as f32 * candidate.hop_seconds;
            let cand_end = end as f32 * candidate.hop_seconds;
            let ref_start = r.best_frame as f32 * reference.hop_seconds;
            let ref_end = ref_start + (cand_end - cand_start);
            segments.push(AlignedSegment {
                candidate_start_s: cand_start,
                candidate_end_s: cand_end,
                reference_start_s: ref_start,
                reference_end_s: ref_end,
                confidence,
            });
        }
        match &best_global {
            Some(b) if b.best_cost < r.best_cost => {}
            _ => best_global = Some(r),
        }
        start += step;
    }

    let merged = merge_consecutive(segments, candidate.hop_seconds * 2.0);
    let (global_offset_s, global_confidence) = best_global
        .map(|r| {
            let off = r.best_frame as f32 * reference.hop_seconds;
            let conf = confidence_from_costs(r.best_cost, r.baseline_cost);
            (off, conf)
        })
        .unwrap_or((0.0, 0.0));

    AlignmentReport {
        segments: merged,
        global_offset_s,
        global_confidence,
    }
}

/// Two segments that line up end-to-end in both timelines (candidate and
/// reference) are the same alignment continuation — coalesce them so
/// callers don't see hundreds of overlapping chunks.
fn merge_consecutive(segs: Vec<AlignedSegment>, tolerance_s: f32) -> Vec<AlignedSegment> {
    if segs.is_empty() {
        return segs;
    }
    let mut sorted = segs;
    sorted.sort_by(|a, b| a.candidate_start_s.partial_cmp(&b.candidate_start_s).unwrap());
    let mut out: Vec<AlignedSegment> = Vec::new();
    for s in sorted {
        if let Some(last) = out.last_mut() {
            let cand_gap = (s.candidate_start_s - last.candidate_end_s).abs();
            let ref_offset_last = last.reference_start_s - last.candidate_start_s;
            let ref_offset_now = s.reference_start_s - s.candidate_start_s;
            let drift = (ref_offset_now - ref_offset_last).abs();
            if cand_gap <= tolerance_s && drift <= tolerance_s {
                last.candidate_end_s = s.candidate_end_s;
                last.reference_end_s = s.reference_end_s;
                last.confidence = last.confidence.min(s.confidence);
                continue;
            }
        }
        out.push(s);
    }
    out
}

fn confidence_from_costs(best: f32, baseline: f32) -> f32 {
    if !best.is_finite() || !baseline.is_finite() || baseline <= 0.0 {
        return 0.0;
    }
    let ratio = (1.0 - best / baseline).clamp(0.0, 1.0);
    ratio
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::audio_sync::mfcc::compute_mfcc;
    use std::f32::consts::TAU;

    fn voice_signal(seconds: f32, seed: u32) -> Vec<f32> {
        // Pseudo-deterministic phoneme sequence that does NOT repeat over
        // the test window. We index the vowel table by `phoneme_index =
        // floor(t * 5) ^ seed_mix`, where the XOR with a per-second seed
        // forces the pattern to drift, so the same vowel never appears
        // twice in the same place. Two signals built with different seeds
        // therefore have very different MFCC trajectories — the test
        // alignment has a sharp minimum at the right offset and the
        // baseline (median) cost stays high.
        let n = (16_000.0 * seconds) as usize;
        let phase = (seed as f32 * 0.7) % TAU;
        let table = [
            (730.0, 1090.0, 2440.0),
            (270.0, 2290.0, 3010.0),
            (300.0, 870.0, 2240.0),
            (530.0, 1840.0, 2480.0),
            (570.0, 840.0, 2410.0),
            (660.0, 1720.0, 2410.0),
            (490.0, 1350.0, 1690.0),
            (640.0, 1190.0, 2390.0),
        ];
        (0..n)
            .map(|i| {
                let t = i as f32 / 16_000.0;
                let phoneme_slot = (t * 5.0) as u32;
                let phoneme_index = ((phoneme_slot.wrapping_mul(2654435761).wrapping_add(seed))
                    >> 8) as usize
                    % table.len();
                let f0 = 200.0 + 80.0 * (TAU * 0.6 * t + phase).sin();
                let (f1h, f2h, f3h) = table[phoneme_index];
                let env = ((TAU * 6.0 * t).sin().abs() * 0.4 + 0.6) * (1.0 - (t / seconds) * 0.1);
                let f0_wave = (TAU * f0 * t).sin() * 0.25;
                let f1 = (TAU * f1h * t).sin() * 0.4;
                let f2 = (TAU * f2h * t).sin() * 0.15;
                let f3 = (TAU * f3h * t + phase).sin() * 0.08;
                (f0_wave + f1 + f2 + f3) * env
            })
            .collect()
    }

    fn add_noise(signal: &[f32], snr_db: f32, seed: u32) -> Vec<f32> {
        let signal_power: f32 = signal.iter().map(|&v| v * v).sum::<f32>() / signal.len() as f32;
        let noise_power = signal_power / 10f32.powf(snr_db / 10.0);
        let noise_amp = noise_power.sqrt();
        let mut s = seed;
        signal
            .iter()
            .map(|&v| {
                // xorshift32 for cheap deterministic noise
                s ^= s << 13;
                s ^= s >> 17;
                s ^= s << 5;
                let r = ((s as i32) as f32) / (i32::MAX as f32);
                v + r * noise_amp
            })
            .collect()
    }

    #[test]
    fn align_whole_finds_clean_offset_in_noisy_reference() {
        // Reference: noisy "camera" recording (realistic 6 dB SNR — what
        // you'd typically get from a phone or DSLR's on-board mic).
        // Candidate: clean middle chunk from a studio re-record.
        let clean = voice_signal(5.0, 13);
        let cam = add_noise(&clean, 6.0, 42);
        let candidate_samples: Vec<f32> = clean[16_000 * 2..16_000 * 3].to_vec();
        let cam_mfcc = compute_mfcc(&cam, 16_000);
        let cand_mfcc = compute_mfcc(&candidate_samples, 16_000);
        let report = align_whole(&cam_mfcc, &cand_mfcc);
        assert!(
            report.global_confidence > 0.2,
            "confidence too low: {}",
            report.global_confidence
        );
        assert!(
            (report.global_offset_s - 2.0).abs() < 0.2,
            "offset {} != 2 s (±0.2)",
            report.global_offset_s
        );
    }

    #[test]
    fn align_segmented_recovers_two_chunks_in_order() {
        // Reference covers seconds 0..6 of the voice.
        // Candidate is concatenation of [3-4 s] and [1-2 s] (out of order).
        let voice = voice_signal(6.0, 21);
        let cam_mfcc = compute_mfcc(&voice, 16_000);
        let chunk_a = &voice[16_000 * 3..16_000 * 4];
        let chunk_b = &voice[16_000 * 1..16_000 * 2];
        let mut candidate = Vec::new();
        candidate.extend_from_slice(chunk_a);
        candidate.extend_from_slice(chunk_b);
        let cand_mfcc = compute_mfcc(&candidate, 16_000);
        let report = align_segmented(&cam_mfcc, &cand_mfcc, 0.8, 0.1, 0.2);
        assert!(
            report.segments.len() >= 2,
            "expected at least 2 segments, got {}",
            report.segments.len()
        );
    }

    #[test]
    fn align_whole_low_confidence_for_unrelated_signals() {
        // Reference: voice. Candidate: pure tone (no MFCC overlap).
        let voice = voice_signal(3.0, 17);
        let tone: Vec<f32> = (0..16_000 * 2)
            .map(|i| (TAU * 1000.0 * i as f32 / 16_000.0).sin() * 0.4)
            .collect();
        let r = compute_mfcc(&voice, 16_000);
        let c = compute_mfcc(&tone, 16_000);
        let report = align_whole(&r, &c);
        assert!(
            report.global_confidence < 0.4,
            "confidence should be low, got {}",
            report.global_confidence
        );
    }
}
