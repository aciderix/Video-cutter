import { describe, expect, it } from 'vitest';
import type { Region } from '../types.ts';
import {
  mergeRight,
  moveBoundary,
  nextKeptStart,
  prevKeptStart,
  regionAtTime,
  splitAt,
  toggleKept,
} from './index.ts';

const make = (start: number, end: number, kept: boolean, id?: string): Region => ({
  id: id ?? `r${start}`,
  start,
  end,
  kept,
  source: 'detected',
});

describe('toggleKept', () => {
  it('flips the kept flag on the matching id', () => {
    const out = toggleKept([make(0, 1, true, 'a'), make(1, 2, false, 'b')], 'b');
    expect(out[1]?.kept).toBe(true);
    expect(out[0]?.kept).toBe(true);
  });
});

describe('moveBoundary', () => {
  const regions = [make(0, 2, true, 'a'), make(2, 5, false, 'b'), make(5, 10, true, 'c')];

  it('moves the start of a middle region and shrinks the previous one', () => {
    const out = moveBoundary(regions, 'b', 'start', 3);
    expect(out[0]?.end).toBe(3);
    expect(out[1]?.start).toBe(3);
    expect(out[1]?.end).toBe(5);
  });

  it('clamps within neighbour bounds', () => {
    const out = moveBoundary(regions, 'b', 'start', -10);
    expect(out[1]?.start).toBeCloseTo(0.05);
  });

  it('cannot move the very first start', () => {
    const out = moveBoundary(regions, 'a', 'start', 3);
    expect(out).toEqual(regions);
  });
});

describe('splitAt', () => {
  it('splits the region containing the time and marks the right half manual', () => {
    let n = 0;
    const out = splitAt([make(0, 10, true, 'a')], 4, () => `m${n++}`);
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ start: 0, end: 4 });
    expect(out[1]).toMatchObject({ start: 4, end: 10, source: 'manual' });
  });

  it('is a no-op on an exact boundary', () => {
    const r = [make(0, 5, true, 'a'), make(5, 10, true, 'b')];
    expect(splitAt(r, 5, () => 'x')).toEqual(r);
  });
});

describe('mergeRight', () => {
  it('merges the region with its right neighbour', () => {
    const out = mergeRight(
      [make(0, 2, true, 'a'), make(2, 5, false, 'b'), make(5, 10, true, 'c')],
      'a',
    );
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ start: 0, end: 5, kept: true, source: 'manual' });
  });
});

describe('navigation', () => {
  const regions = [
    make(0, 2, true),
    make(2, 5, false),
    make(5, 7, true),
    make(7, 8, false),
    make(8, 10, true),
  ];

  it('finds region at time', () => {
    expect(regionAtTime(regions, 3)?.start).toBe(2);
  });

  it('jumps to next kept start', () => {
    expect(nextKeptStart(regions, 1)).toBe(5);
    expect(nextKeptStart(regions, 6)).toBe(8);
    expect(nextKeptStart(regions, 9)).toBeNull();
  });

  it('jumps to previous kept start', () => {
    expect(prevKeptStart(regions, 6)).toBe(0);
    expect(prevKeptStart(regions, 9)).toBe(5);
    expect(prevKeptStart(regions, 0)).toBeNull();
  });
});
