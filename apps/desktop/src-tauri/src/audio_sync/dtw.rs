//! Dynamic Time Warping cost computation between two MFCC sequences.
//!
//! For alignment we don't actually need the warping path — only the
//! minimum accumulated cost. We use a banded DTW with the Sakoe-Chiba
//! constraint so the cost stays O(N × band) instead of O(N²). For two
//! sequences of similar duration that's already enough.

use crate::audio_sync::mfcc::N_COEFFS;

/// Cosine distance between two MFCC frames. Lower = more similar.
/// Range: [0, 2]. Used because amplitude scaling between mic types
/// shifts MFCC[0] heavily — we want the angle between feature vectors,
/// not their absolute magnitude.
pub fn frame_distance(a: &[f32], b: &[f32]) -> f32 {
    debug_assert_eq!(a.len(), N_COEFFS);
    debug_assert_eq!(b.len(), N_COEFFS);
    let mut dot = 0.0;
    let mut na = 0.0;
    let mut nb = 0.0;
    for i in 0..N_COEFFS {
        dot += a[i] * b[i];
        na += a[i] * a[i];
        nb += b[i] * b[i];
    }
    let denom = (na * nb).sqrt();
    if denom < 1e-12 {
        return 1.0;
    }
    1.0 - dot / denom
}

/// Compute the DTW cost between two MFCC sub-sequences.
///   - `query`: short clip (e.g. a clean audio segment), all rows used
///   - `reference`: long clip (e.g. the camera audio), one window at a
///     time — see [`sliding_dtw_cost`] for the helper that drives this.
///
/// Returns the average distance per query frame, so the value is
/// comparable across query lengths.
pub fn dtw_distance(query: &[f32], reference: &[f32], band: usize) -> f32 {
    let n_q = query.len() / N_COEFFS;
    let n_r = reference.len() / N_COEFFS;
    if n_q == 0 || n_r == 0 {
        return f32::INFINITY;
    }
    // The classic O(N²) table is fine because we always feed it small
    // windows. For a 10-s query against a 30-min reference we'll call
    // this thousands of times with n_q ≈ 1000 and n_r ≈ 1000.
    let band = band.max(1);
    let mut prev = vec![f32::INFINITY; n_r];
    let mut cur = vec![f32::INFINITY; n_r];

    {
        let q0 = &query[0..N_COEFFS];
        let lo = 0usize;
        let hi = band.min(n_r - 1);
        for j in lo..=hi {
            let r = &reference[j * N_COEFFS..(j + 1) * N_COEFFS];
            let d = frame_distance(q0, r);
            cur[j] = if j == 0 { d } else { cur[j - 1] + d };
        }
    }
    std::mem::swap(&mut prev, &mut cur);

    for i in 1..n_q {
        for v in cur.iter_mut() {
            *v = f32::INFINITY;
        }
        let lo = if i > band { i - band } else { 0 };
        let hi = (i + band).min(n_r - 1);
        let q = &query[i * N_COEFFS..(i + 1) * N_COEFFS];
        for j in lo..=hi {
            let r = &reference[j * N_COEFFS..(j + 1) * N_COEFFS];
            let d = frame_distance(q, r);
            let from_diag = if j > 0 { prev[j - 1] } else { f32::INFINITY };
            let from_left = if j > 0 { cur[j - 1] } else { f32::INFINITY };
            let from_top = prev[j];
            let best = from_diag.min(from_left).min(from_top);
            cur[j] = if best.is_finite() { best + d } else { d };
        }
        std::mem::swap(&mut prev, &mut cur);
    }

    let last = (n_q + band).min(n_r) - 1;
    let lo = if n_q > band + 1 { n_q - band - 1 } else { 0 };
    let mut min_cost = f32::INFINITY;
    for j in lo..=last {
        if prev[j] < min_cost {
            min_cost = prev[j];
        }
    }
    min_cost / n_q as f32
}

/// Slide the query MFCC across the reference and return the offset
/// (in reference frames) that minimises the DTW cost. Steps `hop`
/// reference frames between candidate positions — typical hop = 5
/// (50 ms) for fine-grained search.
pub struct SlideResult {
    pub best_frame: usize,
    pub best_cost: f32,
    /// Cost of a random alignment (90th percentile of probes). Used to
    /// compute a confidence score: `1 - best_cost / random_cost`.
    pub baseline_cost: f32,
}

pub fn sliding_dtw_cost(
    query: &[f32],
    reference: &[f32],
    query_frames: usize,
    reference_frames: usize,
    hop: usize,
    band: usize,
) -> SlideResult {
    if query_frames == 0 || reference_frames == 0 || reference_frames < query_frames {
        return SlideResult {
            best_frame: 0,
            best_cost: f32::INFINITY,
            baseline_cost: f32::INFINITY,
        };
    }
    let hop = hop.max(1);
    let max_start = reference_frames - query_frames;
    let mut best_frame = 0usize;
    let mut best_cost = f32::INFINITY;
    let mut probes: Vec<f32> = Vec::new();

    let mut start = 0usize;
    while start <= max_start {
        let window_start = start * N_COEFFS;
        let window_end = (start + query_frames) * N_COEFFS;
        let cost = dtw_distance(query, &reference[window_start..window_end], band);
        probes.push(cost);
        if cost < best_cost {
            best_cost = cost;
            best_frame = start;
        }
        start += hop;
    }

    // Median probe cost as the "random alignment" baseline. We pick the
    // median (50th percentile) rather than the 90th because we want a
    // value that reflects what a typical wrong offset looks like, not
    // the very worst case — that makes the confidence ratio sharper
    // when the best alignment is much better than the rest.
    let baseline_cost = {
        let mut sorted = probes.clone();
        sorted.sort_by(|a, b| a.partial_cmp(b).unwrap());
        let idx = sorted.len() / 2;
        sorted.get(idx.min(sorted.len().saturating_sub(1))).copied().unwrap_or(f32::INFINITY)
    };

    SlideResult { best_frame, best_cost, baseline_cost }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::audio_sync::mfcc::compute_mfcc;
    use std::f32::consts::TAU;

    fn voice_signal(seconds: f32, seed: u32) -> Vec<f32> {
        // Stack a few harmonics + a slow envelope so MFCC has structure.
        let n = (16_000.0 * seconds) as usize;
        let phase = (seed as f32 * 0.7) % TAU;
        (0..n)
            .map(|i| {
                let t = i as f32 / 16_000.0;
                let env = (TAU * 1.5 * t + phase).sin() * 0.3 + 0.7;
                let f1 = (TAU * 220.0 * t).sin() * 0.4;
                let f2 = (TAU * 660.0 * t).sin() * 0.2;
                let f3 = (TAU * 1200.0 * t + phase).sin() * 0.1;
                (f1 + f2 + f3) * env
            })
            .collect()
    }

    #[test]
    fn dtw_finds_self_alignment() {
        // The query IS the reference: best alignment should be at frame 0
        // with very small cost.
        let v = voice_signal(2.0, 7);
        let m = compute_mfcc(&v, 16_000);
        let r = sliding_dtw_cost(&m.frames, &m.frames, m.n_frames, m.n_frames, 5, 50);
        assert_eq!(r.best_frame, 0);
        assert!(r.best_cost < 0.05, "self-alignment cost was {}", r.best_cost);
    }

    #[test]
    fn dtw_finds_offset_in_longer_signal() {
        // Build a 5 s reference and pull 1 s out of the middle as query.
        let r = voice_signal(5.0, 11);
        let q: Vec<f32> = r[16_000 * 2..16_000 * 3].to_vec();
        let rm = compute_mfcc(&r, 16_000);
        let qm = compute_mfcc(&q, 16_000);
        let result = sliding_dtw_cost(&qm.frames, &rm.frames, qm.n_frames, rm.n_frames, 1, 30);
        // The query starts at frame ≈ 200 in the reference (2 s × 100 fps).
        let frame_time = result.best_frame as f32 * rm.hop_seconds;
        assert!(
            (frame_time - 2.0).abs() < 0.15,
            "expected offset ≈ 2.0 s, got {} (frame {})",
            frame_time,
            result.best_frame
        );
        assert!(result.best_cost < result.baseline_cost * 0.6);
    }
}
