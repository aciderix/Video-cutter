/**
 * Downsample raw PCM samples to per-pixel min/max peaks for waveform drawing.
 * The Rust side delivers samples as Float32 mono; this picks the extremes of
 * each bucket so the visualization stays visually faithful even when zooming
 * out to thousands of samples per pixel.
 */
export function downsamplePeaks(
  samples: Float32Array,
  buckets: number,
): { min: Float32Array; max: Float32Array } {
  const min = new Float32Array(buckets);
  const max = new Float32Array(buckets);
  if (buckets === 0 || samples.length === 0) return { min, max };

  const step = samples.length / buckets;
  for (let i = 0; i < buckets; i++) {
    const startIdx = Math.floor(i * step);
    const endIdx = Math.min(samples.length, Math.floor((i + 1) * step));
    let lo = Infinity;
    let hi = -Infinity;
    for (let j = startIdx; j < endIdx; j++) {
      const v = samples[j]!;
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    min[i] = lo === Infinity ? 0 : lo;
    max[i] = hi === -Infinity ? 0 : hi;
  }
  return { min, max };
}
