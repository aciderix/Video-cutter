/**
 * Downsample raw PCM samples (or pre-computed peak buckets) to per-pixel
 * min/max envelopes for waveform drawing. Handles both directions:
 *
 *  - **Downsampling** (samples.length > buckets, typical at zoom = 1):
 *    each output bucket aggregates several samples into its min and max.
 *  - **Upsampling** (samples.length < buckets, typical when zooming in past
 *    the source peak resolution): each output bucket reads the closest
 *    source sample via nearest-neighbor lookup. Without this branch the
 *    naive `Math.floor` step math leaves most output buckets empty (start
 *    and end indices coincide) and the waveform visually disappears.
 *
 * For audio peak data (only positive amplitudes coming from
 * `samplesToPeaks` or the Rust `extract_peaks`), `min` mirrors `max` so the
 * caller can draw a centered bar.
 */
export function downsamplePeaks(
  samples: Float32Array,
  buckets: number,
): { min: Float32Array; max: Float32Array } {
  const min = new Float32Array(buckets);
  const max = new Float32Array(buckets);
  if (buckets === 0 || samples.length === 0) return { min, max };

  const peakOnly = isPeakArray(samples);

  if (samples.length >= buckets) {
    // Downsampling: average several source values into each output bucket.
    const step = samples.length / buckets;
    for (let i = 0; i < buckets; i++) {
      const startIdx = Math.floor(i * step);
      const endIdx = Math.min(samples.length, Math.max(startIdx + 1, Math.floor((i + 1) * step)));
      let lo = Infinity;
      let hi = -Infinity;
      for (let j = startIdx; j < endIdx; j++) {
        const v = samples[j]!;
        if (v < lo) lo = v;
        if (v > hi) hi = v;
      }
      const hiSafe = hi === -Infinity ? 0 : hi;
      max[i] = hiSafe;
      min[i] = peakOnly ? -hiSafe : lo === Infinity ? 0 : lo;
    }
    return { min, max };
  }

  // Upsampling: more output pixels than source values. Nearest-neighbor
  // keeps every bucket non-empty, so the waveform stays visible when zoomed.
  for (let i = 0; i < buckets; i++) {
    const srcIdx = Math.min(samples.length - 1, Math.floor((i / buckets) * samples.length));
    const v = samples[srcIdx]!;
    const hi = v >= 0 ? v : 0;
    max[i] = hi;
    min[i] = peakOnly ? -hi : v;
  }
  return { min, max };
}

/**
 * Cheap heuristic: a peak array (all values in [0, 1]) is treated as a
 * positive-only signal so the caller can mirror it for display. Looks at
 * the first 32 samples — peak arrays never contain negative values.
 */
function isPeakArray(samples: Float32Array): boolean {
  const probe = Math.min(samples.length, 32);
  for (let i = 0; i < probe; i++) {
    if (samples[i]! < 0) return false;
  }
  return true;
}
