import type { SilenceDetectionSettings } from '../types.ts';
import type { RawSilenceInterval } from '../silence/index.ts';

/**
 * RMS-based voice activity detection. Compared to the peak detector in
 * silenceFromSamples, this one is much less sensitive to short clicks and
 * mouth noises that exceed the threshold for one or two samples — they get
 * smoothed out by the RMS window. Recommended default for speech.
 *
 * Algorithm:
 *  1. Slide a `windowMs` window, compute RMS in dBFS for each window.
 *  2. When `settings.noiseGateMode === 'auto'`, derive the threshold from
 *     the 10th-percentile RMS of the take plus `autoMarginDb`. Robust to
 *     steady hiss / white noise / fan floors that sit above the user's
 *     fixed dB knob.
 *  3. Apply hysteresis: a "speech" frame becomes "silence" only after the
 *     RMS stays below `threshold - hysteresisDb` for `holdoutMs`. This
 *     prevents flickering on syllable gaps.
 *  4. Merge silence runs shorter than `minSilenceDurationMs`.
 */
export interface VadOptions {
  windowMs?: number;
  hysteresisDb?: number;
  holdoutMs?: number;
}

export function vadFromSamples(
  samples: Float32Array,
  sampleRate: number,
  settings: SilenceDetectionSettings,
  opts: VadOptions = {},
): RawSilenceInterval[] {
  if (samples.length === 0 || sampleRate <= 0) return [];
  const windowMs = opts.windowMs ?? 30;
  const hysteresisDb = opts.hysteresisDb ?? 6;
  const holdoutMs = opts.holdoutMs ?? 120;
  const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const holdoutWindows = Math.max(1, Math.round(holdoutMs / windowMs));

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

  // Threshold derivation: auto = noise floor + margin, fixed = user dial.
  // In auto mode we still respect the dial as a hard floor so a user can
  // raise the gate by hand if the auto floor lands too low. The down
  // threshold (hysteresis) sits a couple of dB above the noise floor so
  // the algorithm can actually transition back to silence between words
  // — using the regular hysteresisDb would put it at or below the floor
  // on hissy material and freeze the state machine in "voice" forever.
  let upThreshold = Math.pow(10, settings.thresholdDb / 20);
  let downThreshold = upThreshold * Math.pow(10, -hysteresisDb / 20);
  if ((settings.noiseGateMode ?? 'fixed') === 'auto') {
    const sorted = new Float32Array(rms).sort();
    const floor = sorted[Math.min(sorted.length - 1, Math.floor(0.1 * (sorted.length - 1)))]!;
    const margin = Math.pow(10, (settings.autoMarginDb ?? 6) / 20);
    const auto = floor * margin;
    upThreshold = Math.max(upThreshold, auto);
    // 2 dB above the noise floor — leaves enough headroom that pure
    // noise windows count as silent, while real speech (typically 10+ dB
    // above floor) never accidentally trips it.
    downThreshold = floor * Math.pow(10, 2 / 20);
  }

  let isSilent = true;
  let silentStart = 0;
  let lastVoiceFrame = 0;
  const rawIntervals: RawSilenceInterval[] = [];

  for (let w = 0; w < nWindows; w++) {
    const i = w * windowSize;
    const frameSilent = isSilent ? rms[w]! < upThreshold : rms[w]! < downThreshold;

    if (frameSilent) {
      if (!isSilent) {
        // Voice → silence transition, but apply holdout: we only commit if
        // we've been quiet for at least N consecutive windows.
        const elapsedFrames = (i - lastVoiceFrame) / windowSize;
        if (elapsedFrames >= holdoutWindows) {
          isSilent = true;
          silentStart = lastVoiceFrame;
        }
      }
    } else {
      if (isSilent && silentStart < i) {
        const silenceMs = ((i - silentStart) / sampleRate) * 1000;
        if (silenceMs >= settings.minSilenceDurationMs) {
          rawIntervals.push({
            start: silentStart / sampleRate,
            end: i / sampleRate,
          });
        }
      }
      isSilent = false;
      lastVoiceFrame = i;
    }
  }

  if (isSilent && silentStart < samples.length) {
    const silenceMs = ((samples.length - silentStart) / sampleRate) * 1000;
    if (silenceMs >= settings.minSilenceDurationMs) {
      rawIntervals.push({
        start: silentStart / sampleRate,
        end: samples.length / sampleRate,
      });
    }
  }

  return rawIntervals;
}
