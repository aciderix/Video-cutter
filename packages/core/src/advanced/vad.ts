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
 *  2. Apply hysteresis: a "speech" frame becomes "silence" only after the
 *     RMS stays below `thresholdDb - hysteresisDb` for `holdoutMs`. This
 *     prevents flickering on syllable gaps.
 *  3. Merge silence runs shorter than `minSilenceDurationMs`.
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
  const upThreshold = Math.pow(10, settings.thresholdDb / 20);
  const downThreshold = Math.pow(10, (settings.thresholdDb - hysteresisDb) / 20);

  const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
  const holdoutWindows = Math.max(1, Math.round(holdoutMs / windowMs));

  let isSilent = true;
  let silentStart = 0;
  let lastVoiceFrame = 0;
  const rawIntervals: RawSilenceInterval[] = [];

  for (let i = 0; i < samples.length; i += windowSize) {
    const end = Math.min(i + windowSize, samples.length);
    let sumSq = 0;
    for (let j = i; j < end; j++) {
      const v = samples[j]!;
      sumSq += v * v;
    }
    const rms = Math.sqrt(sumSq / (end - i));
    const frameSilent = isSilent ? rms < upThreshold : rms < downThreshold;

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
