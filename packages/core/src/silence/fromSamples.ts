import type { SilenceDetectionSettings } from '../types.ts';
import type { RawSilenceInterval } from './index.ts';

/**
 * Pure-JS silence detection from a Float32Array of mono samples. Used by the
 * mobile app (Web Audio API decode → samples here) so we don't need FFmpeg
 * bundled inside the WebView.
 *
 * Algorithm: walk a sliding window of `windowMs` ms, compute peak amplitude,
 * convert to dB. A frame is silent when its peak < threshold. Consecutive
 * silent frames totalling at least `minSilenceDurationMs` produce one
 * interval. We don't apply padding/min-keep here — that's done downstream by
 * `buildRegionsFromSilences`, matching the FFmpeg parser.
 */
export function silenceFromSamples(
  samples: Float32Array,
  sampleRate: number,
  settings: SilenceDetectionSettings,
  windowMs = 20,
): RawSilenceInterval[] {
  if (samples.length === 0 || sampleRate <= 0) return [];
  const threshold = Math.pow(10, settings.thresholdDb / 20);
  const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const minSilenceFrames = Math.ceil(settings.minSilenceDurationMs / windowMs);

  const intervals: RawSilenceInterval[] = [];
  let silentFrames = 0;
  let silentStartFrame: number | null = null;

  for (let i = 0; i < samples.length; i += windowSize) {
    const end = Math.min(i + windowSize, samples.length);
    let peak = 0;
    for (let j = i; j < end; j++) {
      const v = Math.abs(samples[j]!);
      if (v > peak) peak = v;
    }
    if (peak < threshold) {
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
