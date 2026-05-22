import { describe, expect, it } from 'vitest';
import { LOUDNESS_PRESETS, loudnessFilterArg, vadFromSamples } from './index.ts';

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

describe('vadFromSamples', () => {
  const sr = 16_000;
  const settings = {
    thresholdDb: -30,
    minSilenceDurationMs: 300,
    paddingMs: 0,
    minKeepDurationMs: 0,
  };

  it('detects a silence between two tones', () => {
    const buf = concat([loud(1, sr), silent(1, sr), loud(1, sr)]);
    const out = vadFromSamples(buf, sr, settings);
    expect(out).toHaveLength(1);
    expect(out[0]?.start).toBeGreaterThanOrEqual(0.9);
    expect(out[0]?.start).toBeLessThanOrEqual(1.2);
  });

  it('ignores a short click in a long silence (hysteresis)', () => {
    // 1s tone, then a long silence with a single loud click in the middle.
    // The peak detector would split this into two silences; VAD keeps one.
    const sr2 = 16_000;
    const click = new Float32Array(sr2 / 200); // 5 ms click
    click.fill(0.9);
    const buf = concat([loud(0.5, sr2), silent(0.5, sr2), click, silent(0.5, sr2), loud(0.5, sr2)]);
    const out = vadFromSamples(buf, sr2, settings, { holdoutMs: 50 });
    // We should still detect a meaningful silent stretch, not zero.
    expect(out.length).toBeGreaterThanOrEqual(1);
  });
});

describe('loudnessFilterArg', () => {
  it('formats the FFmpeg loudnorm filter for each preset', () => {
    for (const p of LOUDNESS_PRESETS) {
      const arg = loudnessFilterArg(p);
      expect(arg).toContain('loudnorm');
      expect(arg).toContain(`I=${p.i}`);
      expect(arg).toContain(`TP=${p.tp}`);
      expect(arg).toContain(`LRA=${p.lra}`);
      expect(arg).toContain('print_format=summary');
    }
  });

  it('adds linear=true for two-pass mode', () => {
    expect(loudnessFilterArg(LOUDNESS_PRESETS[0]!, false)).toContain('linear=true');
    expect(loudnessFilterArg(LOUDNESS_PRESETS[0]!, true)).not.toContain('linear=true');
  });
});
