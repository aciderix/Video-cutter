import { describe, expect, it } from 'vitest';
import { samplesToPeaks, silenceFromSamples } from './fromSamples.ts';

function loud(seconds: number, sampleRate: number, amp = 0.5): Float32Array {
  const n = Math.round(seconds * sampleRate);
  const buf = new Float32Array(n);
  for (let i = 0; i < n; i++) buf[i] = amp * Math.sin((2 * Math.PI * 440 * i) / sampleRate);
  return buf;
}

function silent(seconds: number, sampleRate: number): Float32Array {
  return new Float32Array(Math.round(seconds * sampleRate));
}

function concat(buffers: Float32Array[]): Float32Array {
  const total = buffers.reduce((acc, b) => acc + b.length, 0);
  const out = new Float32Array(total);
  let o = 0;
  for (const b of buffers) {
    out.set(b, o);
    o += b.length;
  }
  return out;
}

describe('silenceFromSamples', () => {
  const sr = 16_000;
  const settings = {
    thresholdDb: -30,
    minSilenceDurationMs: 300,
    paddingMs: 0,
    minKeepDurationMs: 0,
  };

  it('detects one silence in tone/silence/tone', () => {
    const buf = concat([loud(1, sr), silent(1, sr), loud(1, sr)]);
    const out = silenceFromSamples(buf, sr, settings);
    expect(out).toHaveLength(1);
    expect(out[0]?.start).toBeGreaterThanOrEqual(0.95);
    expect(out[0]?.start).toBeLessThanOrEqual(1.05);
    expect(out[0]?.end).toBeGreaterThanOrEqual(1.95);
    expect(out[0]?.end).toBeLessThanOrEqual(2.05);
  });

  it('ignores silences shorter than the minimum', () => {
    // 100 ms of silence between tones — below 300 ms threshold.
    const buf = concat([loud(1, sr), silent(0.1, sr), loud(1, sr)]);
    expect(silenceFromSamples(buf, sr, settings)).toHaveLength(0);
  });

  it('closes a trailing silent region', () => {
    const buf = concat([loud(1, sr), silent(1, sr)]);
    const out = silenceFromSamples(buf, sr, settings);
    expect(out).toHaveLength(1);
    expect(out[0]?.end).toBeGreaterThanOrEqual(1.95);
  });

  it('returns empty for empty input', () => {
    expect(silenceFromSamples(new Float32Array(0), sr, settings)).toEqual([]);
  });
});

describe('samplesToPeaks', () => {
  it('returns the requested number of bins', () => {
    const buf = loud(1, 16_000);
    expect(samplesToPeaks(buf, 200).length).toBe(200);
  });

  it('puts non-zero values for a loud input', () => {
    const buf = loud(1, 16_000, 0.8);
    const peaks = samplesToPeaks(buf, 100);
    expect(Math.max(...peaks)).toBeGreaterThan(0.5);
  });
});
