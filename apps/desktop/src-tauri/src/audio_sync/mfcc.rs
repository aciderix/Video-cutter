//! MFCC (Mel-Frequency Cepstral Coefficients) feature extraction.
//!
//! Pipeline (standard for ASR / speaker ID / audio fingerprinting):
//!   1. Pre-emphasis           (high-pass filter, alpha ≈ 0.97)
//!   2. Framing                (25 ms windows, 10 ms hop)
//!   3. Hamming window
//!   4. FFT                    (real → complex)
//!   5. Power spectrum         (|X|² / N)
//!   6. Mel filterbank         (26 triangular filters, 80–8000 Hz)
//!   7. log
//!   8. DCT-II                 (decorrelates; keep first 13 coefficients)
//!
//! Two clips of the same voice yield similar MFCC sequences even when
//! recorded on different microphones — the cepstral envelope captures
//! phonetic content rather than mic coloration.

use std::f32::consts::PI;

use rustfft::num_complex::Complex32;
use rustfft::FftPlanner;

pub const TARGET_SAMPLE_RATE: u32 = 16_000;
pub const FRAME_LENGTH_MS: f32 = 25.0;
pub const HOP_LENGTH_MS: f32 = 10.0;
pub const N_MELS: usize = 26;
pub const N_COEFFS: usize = 13;
pub const MEL_LOW_HZ: f32 = 80.0;
pub const MEL_HIGH_HZ: f32 = 8_000.0;

/// One MFCC feature vector per frame.
pub struct MfccSequence {
    /// row-major: frames × N_COEFFS
    pub frames: Vec<f32>,
    pub n_frames: usize,
    pub hop_seconds: f32,
}

impl MfccSequence {
    pub fn coeffs(&self, frame_idx: usize) -> &[f32] {
        let start = frame_idx * N_COEFFS;
        &self.frames[start..start + N_COEFFS]
    }
}

pub fn compute_mfcc(samples: &[f32], sample_rate: u32) -> MfccSequence {
    if samples.is_empty() {
        return MfccSequence {
            frames: Vec::new(),
            n_frames: 0,
            hop_seconds: HOP_LENGTH_MS / 1000.0,
        };
    }

    let resampled = if sample_rate == TARGET_SAMPLE_RATE {
        samples.to_vec()
    } else {
        resample_linear(samples, sample_rate, TARGET_SAMPLE_RATE)
    };
    let preemph = preemphasis(&resampled, 0.97);

    let frame_len = (TARGET_SAMPLE_RATE as f32 * FRAME_LENGTH_MS / 1000.0).round() as usize;
    let hop_len = (TARGET_SAMPLE_RATE as f32 * HOP_LENGTH_MS / 1000.0).round() as usize;
    let n_fft = next_pow2(frame_len);

    if preemph.len() < frame_len {
        return MfccSequence {
            frames: Vec::new(),
            n_frames: 0,
            hop_seconds: HOP_LENGTH_MS / 1000.0,
        };
    }

    let n_frames = 1 + (preemph.len() - frame_len) / hop_len;
    let mut planner = FftPlanner::<f32>::new();
    let fft = planner.plan_fft_forward(n_fft);
    let hamming = hamming_window(frame_len);
    let mel_filters = build_mel_filterbank(n_fft, TARGET_SAMPLE_RATE, N_MELS);
    let dct = build_dct_matrix(N_MELS, N_COEFFS);

    let mut out = Vec::with_capacity(n_frames * N_COEFFS);
    let mut frame_buf = vec![Complex32::new(0.0, 0.0); n_fft];
    let mut power = vec![0.0f32; n_fft / 2 + 1];
    let mut mel = vec![0.0f32; N_MELS];

    for f in 0..n_frames {
        let start = f * hop_len;
        for i in 0..n_fft {
            if i < frame_len {
                let v = preemph[start + i] * hamming[i];
                frame_buf[i] = Complex32::new(v, 0.0);
            } else {
                frame_buf[i] = Complex32::new(0.0, 0.0);
            }
        }
        fft.process(&mut frame_buf);
        for k in 0..power.len() {
            let c = frame_buf[k];
            power[k] = (c.re * c.re + c.im * c.im) / n_fft as f32;
        }
        apply_mel_filters(&power, &mel_filters, &mut mel);
        for m in mel.iter_mut() {
            *m = (m.max(1e-10)).ln();
        }
        for c in 0..N_COEFFS {
            let row = &dct[c * N_MELS..(c + 1) * N_MELS];
            let mut s = 0.0;
            for m in 0..N_MELS {
                s += row[m] * mel[m];
            }
            out.push(s);
        }
    }

    MfccSequence {
        frames: out,
        n_frames,
        hop_seconds: HOP_LENGTH_MS / 1000.0,
    }
}

fn preemphasis(samples: &[f32], alpha: f32) -> Vec<f32> {
    if samples.is_empty() {
        return Vec::new();
    }
    let mut out = Vec::with_capacity(samples.len());
    out.push(samples[0]);
    for i in 1..samples.len() {
        out.push(samples[i] - alpha * samples[i - 1]);
    }
    out
}

fn hamming_window(n: usize) -> Vec<f32> {
    (0..n)
        .map(|i| 0.54 - 0.46 * (2.0 * PI * i as f32 / (n - 1) as f32).cos())
        .collect()
}

fn next_pow2(n: usize) -> usize {
    let mut p = 1;
    while p < n {
        p <<= 1;
    }
    p
}

fn build_mel_filterbank(n_fft: usize, sample_rate: u32, n_mels: usize) -> Vec<f32> {
    let n_bins = n_fft / 2 + 1;
    let mel_low = hz_to_mel(MEL_LOW_HZ);
    let mel_high = hz_to_mel(MEL_HIGH_HZ.min(sample_rate as f32 / 2.0));
    let mel_points: Vec<f32> = (0..n_mels + 2)
        .map(|i| mel_low + (mel_high - mel_low) * i as f32 / (n_mels + 1) as f32)
        .collect();
    let hz_points: Vec<f32> = mel_points.iter().map(|&m| mel_to_hz(m)).collect();
    let bin_points: Vec<usize> = hz_points
        .iter()
        .map(|&hz| ((n_fft as f32 + 1.0) * hz / sample_rate as f32).floor() as usize)
        .collect();

    let mut filters = vec![0.0f32; n_mels * n_bins];
    for m in 1..=n_mels {
        let f_m_minus = bin_points[m - 1];
        let f_m = bin_points[m];
        let f_m_plus = bin_points[m + 1];
        for k in f_m_minus..f_m {
            let denom = (f_m - f_m_minus).max(1);
            filters[(m - 1) * n_bins + k] = (k - f_m_minus) as f32 / denom as f32;
        }
        for k in f_m..f_m_plus {
            let denom = (f_m_plus - f_m).max(1);
            filters[(m - 1) * n_bins + k] = (f_m_plus - k) as f32 / denom as f32;
        }
    }
    filters
}

fn apply_mel_filters(power: &[f32], filters: &[f32], out: &mut [f32]) {
    let n_bins = power.len();
    for m in 0..out.len() {
        let row = &filters[m * n_bins..(m + 1) * n_bins];
        let mut s = 0.0;
        for k in 0..n_bins {
            s += row[k] * power[k];
        }
        out[m] = s;
    }
}

fn hz_to_mel(hz: f32) -> f32 {
    2595.0 * (1.0 + hz / 700.0).log10()
}

fn mel_to_hz(mel: f32) -> f32 {
    700.0 * (10f32.powf(mel / 2595.0) - 1.0)
}

fn build_dct_matrix(n_mels: usize, n_coeffs: usize) -> Vec<f32> {
    let mut mat = Vec::with_capacity(n_coeffs * n_mels);
    let scale_first = (1.0 / n_mels as f32).sqrt();
    let scale_other = (2.0 / n_mels as f32).sqrt();
    for k in 0..n_coeffs {
        let scale = if k == 0 { scale_first } else { scale_other };
        for n in 0..n_mels {
            let v = scale * (PI / n_mels as f32 * (n as f32 + 0.5) * k as f32).cos();
            mat.push(v);
        }
    }
    mat
}

fn resample_linear(samples: &[f32], src_rate: u32, dst_rate: u32) -> Vec<f32> {
    if src_rate == dst_rate || samples.is_empty() {
        return samples.to_vec();
    }
    let ratio = src_rate as f64 / dst_rate as f64;
    let out_len = ((samples.len() as f64) / ratio).floor() as usize;
    let mut out = Vec::with_capacity(out_len);
    for i in 0..out_len {
        let src_pos = i as f64 * ratio;
        let idx = src_pos.floor() as usize;
        let frac = (src_pos - idx as f64) as f32;
        let a = samples[idx];
        let b = if idx + 1 < samples.len() { samples[idx + 1] } else { a };
        out.push(a + (b - a) * frac);
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::f32::consts::TAU;

    fn sine(freq: f32, secs: f32, sr: u32) -> Vec<f32> {
        let n = (sr as f32 * secs) as usize;
        (0..n).map(|i| (TAU * freq * i as f32 / sr as f32).sin() * 0.5).collect()
    }

    #[test]
    fn mfcc_shape_matches_samples() {
        let s = sine(440.0, 1.0, 16_000);
        let m = compute_mfcc(&s, 16_000);
        assert!(m.n_frames > 50, "expected ~98 frames, got {}", m.n_frames);
        assert_eq!(m.frames.len(), m.n_frames * N_COEFFS);
    }

    #[test]
    fn mfcc_zero_signal_finite() {
        let s = vec![0.0f32; 16_000];
        let m = compute_mfcc(&s, 16_000);
        for &v in &m.frames {
            assert!(v.is_finite(), "MFCC of silence should be finite, got {v}");
        }
    }

    #[test]
    fn mfcc_handles_other_sample_rates() {
        let s = sine(440.0, 1.0, 48_000);
        let m = compute_mfcc(&s, 48_000);
        assert!(m.n_frames > 50);
        assert_eq!(m.frames.len(), m.n_frames * N_COEFFS);
    }

    #[test]
    fn mfcc_invariant_to_amplitude_scale() {
        // Two signals with same timbre but different amplitudes should
        // produce identical MFCC[1..] (only MFCC[0] tracks energy).
        let n = 16_000;
        let s1: Vec<f32> = (0..n)
            .map(|i| {
                let t = i as f32 / 16_000.0;
                (TAU * 200.0 * t).sin() * 0.4 + (TAU * 600.0 * t).sin() * 0.2
            })
            .collect();
        let s2: Vec<f32> = s1.iter().map(|&v| v * 0.5).collect();
        let m1 = compute_mfcc(&s1, 16_000);
        let m2 = compute_mfcc(&s2, 16_000);
        assert_eq!(m1.n_frames, m2.n_frames);

        let mut diff = 0.0f32;
        for f in 0..m1.n_frames {
            for c in 1..N_COEFFS {
                diff += (m1.coeffs(f)[c] - m2.coeffs(f)[c]).abs();
            }
        }
        let avg = diff / (m1.n_frames as f32 * (N_COEFFS - 1) as f32);
        assert!(avg < 0.1, "amplitude-only diff should leave MFCC[1..] ≈ invariant, got {avg}");
    }
}
