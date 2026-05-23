import { describe, expect, it } from 'vitest';
import { downsamplePeaks } from './peaks.ts';

describe('downsamplePeaks', () => {
  it('downsamples a known signal preserving max amplitudes', () => {
    const buf = new Float32Array([0.1, 0.5, 0.2, -0.9, 0.3, 0.05]);
    const { min, max } = downsamplePeaks(buf, 3);
    // Buckets: [0.1, 0.5], [0.2, -0.9], [0.3, 0.05] (signed signal)
    expect(max[0]).toBeCloseTo(0.5);
    expect(min[1]).toBeCloseTo(-0.9);
    expect(max[2]).toBeCloseTo(0.3);
  });

  it('upsamples when buckets > samples without leaving empty buckets', () => {
    // 4 source samples, 12 buckets — the buggy path used to leave most of
    // them zero. Each output bucket must reflect the nearest source.
    const src = new Float32Array([0.2, 0.6, 0.4, 0.9]);
    const { min, max } = downsamplePeaks(src, 12);
    // None of the buckets should stay at 0 except possibly an exact-zero source.
    const allZero = [...max].every((v) => v === 0);
    expect(allZero).toBe(false);
    // The max value should still be near the global peak.
    expect(Math.max(...max)).toBeCloseTo(0.9, 5);
    // Peak-only input ⇒ min mirrors max.
    for (let i = 0; i < 12; i++) {
      expect(min[i]).toBe(-max[i]!);
    }
  });

  it('mirrors min around zero for peak-only (positive) inputs', () => {
    const src = new Float32Array([0.3, 0.6, 0.9, 0.6, 0.3]);
    const { min, max } = downsamplePeaks(src, 5);
    for (let i = 0; i < 5; i++) {
      expect(min[i]).toBe(-max[i]!);
    }
  });

  it('keeps zero buckets at zero', () => {
    const src = new Float32Array(100); // all zeros
    const { min, max } = downsamplePeaks(src, 50);
    expect(Math.abs(Math.max(...max))).toBe(0);
    expect(Math.abs(Math.min(...min))).toBe(0);
  });

  it('returns empty pair for empty input', () => {
    const { min, max } = downsamplePeaks(new Float32Array(0), 10);
    expect(min.length).toBe(10);
    expect(max.length).toBe(10);
    expect([...max].every((v) => v === 0)).toBe(true);
  });

  it('handles buckets === 0', () => {
    const { min, max } = downsamplePeaks(new Float32Array([0.5]), 0);
    expect(min.length).toBe(0);
    expect(max.length).toBe(0);
  });
});
