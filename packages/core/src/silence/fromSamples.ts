import type { SilenceDetectionSettings } from '../types.ts';
import type { RawSilenceInterval } from './index.ts';

/**
 * Pure-JS silence detection from a Float32Array of mono samples. Used by the
 * mobile app (Web Audio API decode → samples here) so we don't need FFmpeg
 * bundled inside the WebView.
 *
 * Algorithm: walk a sliding window of `windowMs` ms, compute the RMS energy
 * of the window, convert to dB. A window is silent when its RMS sits below
 * the threshold. Consecutive silent windows totalling at least
 * `minSilenceDurationMs` produce one interval. We don't apply padding /
 * min-keep here — that's downstream in `buildRegionsFromSilences`.
 *
 * When `noiseGateMode === 'auto'` (the default), the threshold is replaced
 * by the 10th-percentile RMS of the signal plus `autoMarginDb`. This
 * adapts to steady background noise (hiss, fan, white noise) so a take
 * recorded in a non-treated room still gets its real pauses detected
 * even when the user-supplied dB threshold sits below the floor.
 */
export function silenceFromSamples(
  samples: Float32Array,
  sampleRate: number,
  settings: SilenceDetectionSettings,
  windowMs = 20,
): RawSilenceInterval[] {
  if (samples.length === 0 || sampleRate <= 0) return [];
  const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const minSilenceFrames = Math.ceil(settings.minSilenceDurationMs / windowMs);

  // First pass: window RMS levels (reused for both the noise-floor stat
  // and the silent-vs-loud decision).
  const nWindows = Math.ceil(samples.length / windowSize);
  const rms = new Float32Array(nWindows);
  for (let w = 0; w < nWindows; w++) {
    const i = w * windowSize;
    const end = Math.min(i + windowSize, samples.length);
    let sumSq = 0;
    for (let j = i; j < end; j++) {
      const v = samples[j]!;
      sumSq += v * v;
    }
    rms[w] = Math.sqrt(sumSq / Math.max(1, end - i));
  }

  let threshold = Math.pow(10, settings.thresholdDb / 20);
  if ((settings.noiseGateMode ?? 'fixed') === 'auto') {
    const floor = percentile(rms, 0.1);
    const margin = Math.pow(10, (settings.autoMarginDb ?? 6) / 20);
    const autoThreshold = floor * margin;
    threshold = Math.max(threshold, autoThreshold);
  }

  const intervals: RawSilenceInterval[] = [];
  let silentFrames = 0;
  let silentStartFrame: number | null = null;

  for (let w = 0; w < nWindows; w++) {
    const i = w * windowSize;
    if (rms[w]! < threshold) {
      if (silentStartFrame === null) silentStartFrame = i;
      silentFrames++;
    } else {
      if (silentStartFrame !== null && silentFrames >= minSilenceFrames) {
        intervals.push({
          start: silentStartFrame / sampleRate,
          end: (silentStartFrame + silentFrames * windowSize) / sampleRate,
        });
      }
      silentStartFrame = null;
      silentFrames = 0;
    }
  }
  if (silentStartFrame !== null && silentFrames >= minSilenceFrames) {
    intervals.push({
      start: silentStartFrame / sampleRate,
      end: Math.min(samples.length, silentStartFrame + silentFrames * windowSize) / sampleRate,
    });
  }
  return intervals;
}

/**
 * Compute the noise floor of a buffer in dB FS — same 10th-percentile RMS
 * the auto mode uses, but exposed so the UI can show the user what the
 * detector inferred and let them dial the margin from there.
 */
export function estimateNoiseFloorDb(
  samples: Float32Array,
  sampleRate: number,
  windowMs = 20,
): number {
  if (samples.length === 0) return -Infinity;
  const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const nWindows = Math.ceil(samples.length / windowSize);
  const rms = new Float32Array(nWindows);
  for (let w = 0; w < nWindows; w++) {
    const i = w * windowSize;
    const end = Math.min(i + windowSize, samples.length);
    let sumSq = 0;
    for (let j = i; j < end; j++) {
      const v = samples[j]!;
      sumSq += v * v;
    }
    rms[w] = Math.sqrt(sumSq / Math.max(1, end - i));
  }
  const p = percentile(rms, 0.1);
  return p > 0 ? 20 * Math.log10(p) : -Infinity;
}

function percentile(values: Float32Array, q: number): number {
  if (values.length === 0) return 0;
  const sorted = new Float32Array(values).sort();
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))));
  return sorted[idx]!;
}

/**
 * Downsample a Float32Array of samples into N peak bins, matching the format
 * the Rust backend produces. Used by the mobile waveform.
 */
export function samplesToPeaks(samples: Float32Array, bins: number): Float32Array {
  const out = new Float32Array(bins);
  if (samples.length === 0) return out;
  const perBin = samples.length / bins;
  for (let b = 0; b < bins; b++) {
    const start = Math.floor(b * perBin);
    const end = Math.min(samples.length, Math.floor((b + 1) * perBin));
    let peak = 0;
    for (let i = start; i < end; i++) {
      const v = Math.abs(samples[i]!);
      if (v > peak) peak = v;
    }
    out[b] = peak;
  }
  return out;
}
