import type { Region, Seconds } from '../types.ts';

/**
 * Region edit operations — pure functions, callers manage the undo stack.
 * All helpers preserve the timeline invariant: regions are contiguous,
 * non-overlapping, sorted by start, and cover [0, totalDuration].
 */

export function toggleKept(regions: Region[], id: string): Region[] {
  return regions.map((r) => (r.id === id ? { ...r, kept: !r.kept } : r));
}

/**
 * Move a region boundary while keeping neighbours intact (no gaps, no overlaps).
 * `side='start'` moves the left edge of the target and the right edge of the
 * previous region together; `side='end'` mirrors that on the right.
 *
 * Boundary is clamped so that the moving region and its neighbour both keep at
 * least `minSliverS` of duration.
 */
export function moveBoundary(
  regions: Region[],
  id: string,
  side: 'start' | 'end',
  newTime: Seconds,
  minSliverS: Seconds = 0.05,
): Region[] {
  const idx = regions.findIndex((r) => r.id === id);
  if (idx === -1) return regions;
  const target = regions[idx]!;

  if (side === 'start') {
    if (idx === 0) return regions;
    const prev = regions[idx - 1]!;
    const min = prev.start + minSliverS;
    const max = target.end - minSliverS;
    const t = Math.max(min, Math.min(max, newTime));
    const next = [...regions];
    next[idx - 1] = { ...prev, end: t };
    next[idx] = { ...target, start: t };
    return next;
  } else {
    if (idx === regions.length - 1) return regions;
    const nxt = regions[idx + 1]!;
    const min = target.start + minSliverS;
    const max = nxt.end - minSliverS;
    const t = Math.max(min, Math.min(max, newTime));
    const next = [...regions];
    next[idx] = { ...target, end: t };
    next[idx + 1] = { ...nxt, start: t };
    return next;
  }
}

/**
 * Split the region containing `time` at that point. The right half inherits
 * the kept flag. Returns the original array if `time` is on a boundary.
 */
export function splitAt(regions: Region[], time: Seconds, idGen: () => string): Region[] {
  const idx = regions.findIndex((r) => time > r.start && time < r.end);
  if (idx === -1) return regions;
  const r = regions[idx]!;
  const left: Region = { ...r, end: time };
  const right: Region = {
    id: idGen(),
    start: time,
    end: r.end,
    kept: r.kept,
    source: 'manual',
  };
  return [...regions.slice(0, idx), left, right, ...regions.slice(idx + 1)];
}

/**
 * Merge a region with the one to its right. Resulting region inherits `kept`
 * from the *left* region (the conceptual base) so that "remove this boundary"
 * means "extend my piece across the next one".
 */
export function mergeRight(regions: Region[], id: string): Region[] {
  const idx = regions.findIndex((r) => r.id === id);
  if (idx === -1 || idx === regions.length - 1) return regions;
  const left = regions[idx]!;
  const right = regions[idx + 1]!;
  const merged: Region = { ...left, end: right.end, source: 'manual' };
  return [...regions.slice(0, idx), merged, ...regions.slice(idx + 2)];
}

export function regionAtTime(regions: Region[], time: Seconds): Region | null {
  return regions.find((r) => time >= r.start && time <= r.end) ?? null;
}

/**
 * Snap a media time onto the kept-only timeline. Used to step through silences:
 * given a current source time, jump to the start of the next kept region.
 */
export function nextKeptStart(regions: Region[], time: Seconds): Seconds | null {
  for (const r of regions) {
    if (r.kept && r.start > time + 1e-3) return r.start;
  }
  return null;
}

export function prevKeptStart(regions: Region[], time: Seconds): Seconds | null {
  // If we're inside a kept region, jump to the previous one — not the start
  // of the current one. This matches how J/L behave in most editors.
  let last: Seconds | null = null;
  for (const r of regions) {
    if (!r.kept) continue;
    if (r.end >= time - 1e-3) break;
    last = r.start;
  }
  return last;
}
