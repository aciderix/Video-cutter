import { describe, expect, it } from 'vitest';
import { alignAudioBuffers, alignWhole, alignSegmented } from './alignTS.ts';
import { computeMfcc, N_COEFFS } from './mfccTS.ts';

const TAU = Math.PI * 2;

/**
 * Synthetic voice with non-repeating formant trajectory. Mirrors the
 * Rust test signal — same hash-driven vowel rotation so MFCC features
 * are sharp at the correct alignment and dull everywhere else.
 */
function voiceSignal(seconds: number, seed: number): Float32Array {
  const n = Math.floor(16_000 * seconds);
  const phase = (seed * 0.7) % TAU;
  const table: [number, number, number][] = [
    [730, 1090, 2440],
    [270, 2290, 3010],
    [300, 870, 2240],
    [530, 1840, 2480],
    [570, 840, 2410],
    [660, 1720, 2410],
    [490, 1350, 1690],
    [640, 1190, 2390],
  ];
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / 16_000;
    const slot = Math.floor(t * 5);
    const idx = ((Math.imul(slot, 2654435761) + seed) >>> 8) % table.length;
    const [f1h, f2h, f3h] = table[idx]!;
    const f0 = 200 + 80 * Math.sin(TAU * 0.6 * t + phase);
    const env = (Math.abs(Math.sin(TAU * 6 * t)) * 0.4 + 0.6) * (1 - (t / seconds) * 0.1);
    const f0w = Math.sin(TAU * f0 * t) * 0.25;
    const f1 = Math.sin(TAU * f1h * t) * 0.4;
    const f2 = Math.sin(TAU * f2h * t) * 0.15;
    const f3 = Math.sin(TAU * f3h * t + phase) * 0.08;
    out[i] = (f0w + f1 + f2 + f3) * env;
  }
  return out;
}

function addNoise(signal: Float32Array, snrDb: number, seed: number): Float32Array {
  const signalPower = signal.reduce((acc, v) => acc + v * v, 0) / signal.length;
  const noisePower = signalPower / Math.pow(10, snrDb / 10);
  const noiseAmp = Math.sqrt(noisePower);
  let s = seed | 0;
  const out = new Float32Array(signal.length);
  for (let i = 0; i < signal.length; i++) {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    const r = (s | 0) / 0x7fffffff;
    out[i] = signal[i]! + r * noiseAmp;
  }
  return out;
}

describe('computeMfcc (TS)', () => {
  it('produces frames × N_COEFFS for a 1 s sine', () => {
    const n = 16_000;
    const buf = new Float32Array(n);
    for (let i = 0; i < n; i++) buf[i] = Math.sin((TAU * 440 * i) / 16_000) * 0.5;
    const m = computeMfcc(buf, 16_000);
    expect(m.nFrames).toBeGreaterThan(50);
    expect(m.frames.length).toBe(m.nFrames * N_COEFFS);
  });

  it('handles silence without producing NaN', () => {
    const buf = new Float32Array(16_000);
    const m = computeMfcc(buf, 16_000);
    for (const v of m.frames) expect(Number.isFinite(v)).toBe(true);
  });

  it('resamples non-16kHz input', () => {
    const n = 48_000;
    const buf = new Float32Array(n);
    for (let i = 0; i < n; i++) buf[i] = Math.sin((TAU * 440 * i) / 48_000) * 0.5;
    const m = computeMfcc(buf, 48_000);
    expect(m.nFrames).toBeGreaterThan(50);
  });
});

describe('alignWhole (TS)', () => {
  it('finds offset of a clean candidate inside a longer reference', async () => {
    const ref = voiceSignal(5, 13);
    const cand = ref.slice(16_000 * 2, 16_000 * 3);
    const report = await alignAudioBuffers(
      { samples: ref, sampleRate: 16_000 },
      { samples: cand, sampleRate: 16_000 },
    );
    expect(Math.abs(report.globalOffsetS - 2)).toBeLessThan(0.2);
    expect(report.globalConfidence).toBeGreaterThan(0.3);
  });

  it('survives noisy reference at 6 dB SNR', async () => {
    const clean = voiceSignal(5, 13);
    const noisy = addNoise(clean, 6, 42);
    const cand = clean.slice(16_000 * 2, 16_000 * 3);
    const report = await alignAudioBuffers(
      { samples: noisy, sampleRate: 16_000 },
      { samples: cand, sampleRate: 16_000 },
    );
    expect(Math.abs(report.globalOffsetS - 2)).toBeLessThan(0.25);
    expect(report.globalConfidence).toBeGreaterThan(0.15);
  });

  it('returns low confidence on unrelated signals', () => {
    const voice = voiceSignal(3, 17);
    const tone = new Float32Array(16_000 * 2);
    for (let i = 0; i < tone.length; i++) tone[i] = Math.sin((TAU * 1000 * i) / 16_000) * 0.4;
    const r = computeMfcc(voice, 16_000);
    const c = computeMfcc(tone, 16_000);
    const report = alignWhole(r, c);
    expect(report.globalConfidence).toBeLessThan(0.4);
  });
});

describe('alignSegmented (TS)', () => {
  it('recovers two out-of-order chunks from the same source', () => {
    const voice = voiceSignal(6, 21);
    const ref = computeMfcc(voice, 16_000);
    const chunkA = voice.slice(16_000 * 3, 16_000 * 4);
    const chunkB = voice.slice(16_000 * 1, 16_000 * 2);
    const cand = new Float32Array(chunkA.length + chunkB.length);
    cand.set(chunkA, 0);
    cand.set(chunkB, chunkA.length);
    const candMfcc = computeMfcc(cand, 16_000);
    const report = alignSegmented(ref, candMfcc, 0.8, 0.1, 0.2);
    expect(report.segments.length).toBeGreaterThanOrEqual(2);
  });
});
