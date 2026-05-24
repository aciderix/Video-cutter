import { describe, expect, it } from 'vitest';
import {
  coveredReferenceDurationS,
  findOverlayAtReferenceTime,
  overlayGaps,
  referenceToOverlayTime,
  resolveOverlaps,
  type CleanAudioOverlay,
} from './index.ts';

function overlay(
  id: string,
  segments: Array<[number, number, number, number, number]>,
): CleanAudioOverlay {
  return {
    id,
    name: id + '.wav',
    path: `/tmp/${id}.wav`,
    durationS: 60,
    sampleRate: 48000,
    channels: 1,
    enabled: true,
    globalOffsetS: 0,
    globalConfidence: 0.5,
    segments: segments.map(([cs, ce, rs, re, conf]) => ({
      candidateStartS: cs,
      candidateEndS: ce,
      referenceStartS: rs,
      referenceEndS: re,
      confidence: conf,
    })),
  };
}

describe('findOverlayAtReferenceTime', () => {
  const o = overlay('A', [
    [0, 5, 10, 15, 0.8],
    [5, 8, 30, 33, 0.6],
  ]);

  it('finds the segment covering a reference time', () => {
    const seg = findOverlayAtReferenceTime(o, 12);
    expect(seg?.candidateStartS).toBe(0);
  });

  it('returns null outside any segment', () => {
    expect(findOverlayAtReferenceTime(o, 20)).toBeNull();
  });
});

describe('referenceToOverlayTime', () => {
  const o = overlay('A', [[0, 10, 5, 15, 0.9]]);

  it('maps a reference time to an overlay-local time', () => {
    expect(referenceToOverlayTime(o, 7)).toBeCloseTo(2);
    expect(referenceToOverlayTime(o, 5)).toBeCloseTo(0);
    expect(referenceToOverlayTime(o, 15)).toBeCloseTo(10);
  });

  it('returns null off-segment', () => {
    expect(referenceToOverlayTime(o, 2)).toBeNull();
    expect(referenceToOverlayTime(o, 100)).toBeNull();
  });
});

describe('coveredReferenceDurationS', () => {
  it('sums segment lengths on the reference timeline', () => {
    const o = overlay('A', [
      [0, 5, 10, 15, 0.9],
      [5, 8, 30, 33, 0.5],
    ]);
    expect(coveredReferenceDurationS(o)).toBe(8);
  });
});

describe('overlayGaps', () => {
  it('returns the single gap covering everything when no segments', () => {
    const o = overlay('A', []);
    expect(overlayGaps(o, 30)).toEqual([{ startS: 0, endS: 30 }]);
  });

  it('finds the gaps around segments', () => {
    const o = overlay('A', [
      [0, 5, 10, 15, 0.9],
      [5, 10, 20, 25, 0.8],
    ]);
    expect(overlayGaps(o, 30)).toEqual([
      { startS: 0, endS: 10 },
      { startS: 15, endS: 20 },
      { startS: 25, endS: 30 },
    ]);
  });

  it('collapses touching segments', () => {
    const o = overlay('A', [
      [0, 5, 10, 15, 0.9],
      [5, 10, 15, 20, 0.8],
    ]);
    expect(overlayGaps(o, 30)).toEqual([
      { startS: 0, endS: 10 },
      { startS: 20, endS: 30 },
    ]);
  });
});

describe('resolveOverlaps', () => {
  it('picks the higher-confidence overlay where two compete', () => {
    const a = overlay('A', [[0, 10, 0, 10, 0.4]]);
    const b = overlay('B', [[0, 10, 5, 15, 0.9]]);
    const resolved = resolveOverlaps([a, b], 20);
    // Reference 0..5 → A (only A there).
    // Reference 5..10 → B (higher confidence beats A).
    // Reference 10..15 → B only.
    const ids = resolved.map((r) => `${r.overlayId}:${r.referenceStartS}-${r.referenceEndS}`);
    expect(ids).toContain('A:0-5');
    expect(ids).toContain('B:5-15');
    // No overlap → no A segment past time 5.
    expect(ids.some((id) => id.startsWith('A:5'))).toBe(false);
  });

  it('skips disabled overlays', () => {
    const a = overlay('A', [[0, 10, 0, 10, 0.9]]);
    a.enabled = false;
    expect(resolveOverlaps([a], 20)).toEqual([]);
  });

  it('handles three non-overlapping overlays in order', () => {
    const a = overlay('A', [[0, 5, 0, 5, 0.9]]);
    const b = overlay('B', [[0, 5, 6, 11, 0.9]]);
    const c = overlay('C', [[0, 5, 12, 17, 0.9]]);
    const resolved = resolveOverlaps([a, b, c], 20);
    expect(resolved).toHaveLength(3);
    expect(resolved[0]?.overlayId).toBe('A');
    expect(resolved[1]?.overlayId).toBe('B');
    expect(resolved[2]?.overlayId).toBe('C');
  });

  it('preserves candidate-time mapping after a resolve', () => {
    const a = overlay('A', [[0, 10, 5, 15, 0.5]]);
    const b = overlay('B', [[0, 10, 8, 18, 0.9]]);
    const resolved = resolveOverlaps([a, b], 20);
    // For ref [5, 8] A wins → candidate [0, 3].
    const aSeg = resolved.find((r) => r.overlayId === 'A');
    expect(aSeg?.candidateStartS).toBeCloseTo(0);
    expect(aSeg?.candidateEndS).toBeCloseTo(3);
    // For ref [8, 18] B wins → candidate [0, 10].
    const bSeg = resolved.find((r) => r.overlayId === 'B');
    expect(bSeg?.candidateStartS).toBeCloseTo(0);
    expect(bSeg?.candidateEndS).toBeCloseTo(10);
  });
});
