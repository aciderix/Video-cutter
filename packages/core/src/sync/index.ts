/**
 * Multi-source audio sync data model. A project optionally pairs a primary
 * MediaSource (the "reference" — typically a camera capture with on-board
 * mic) with one or more clean audio overlays. Each overlay carries its own
 * set of AlignedSegments mapping its internal timeline to ranges on the
 * reference timeline.
 *
 * The store keeps the data model platform-agnostic; the Rust backend fills
 * in segments via the `align_clip` command on desktop, while the pure-TS
 * port in alignTS.ts does the same job inside the WebView on mobile.
 */
import type { Seconds } from '../types.ts';

export { alignAudioBuffers, alignWhole, alignSegmented } from './alignTS.ts';
export type { AlignmentReport, AlignClipOptions } from './alignTS.ts';
export { computeMfcc, N_COEFFS } from './mfccTS.ts';
export type { MfccSequence } from './mfccTS.ts';

export interface AlignedSegment {
  /** Range inside the overlay's own audio (seconds). */
  candidateStartS: Seconds;
  candidateEndS: Seconds;
  /** Where that range lands on the reference timeline (seconds). */
  referenceStartS: Seconds;
  referenceEndS: Seconds;
  /** 0..1 — higher = stronger evidence the alignment is real. */
  confidence: number;
}

export interface CleanAudioOverlay {
  /** Stable id, used by the store as the key for this overlay. */
  id: string;
  /** Display name (usually the file's basename). */
  name: string;
  /** Filesystem path. */
  path: string;
  /** Source duration in seconds (decoded from the file). */
  durationS: Seconds;
  /** Sample rate of the source (Hz). Stored for project file portability. */
  sampleRate: number;
  /** Channel count of the source. */
  channels: number;
  /** Per-segment alignment to the reference's timeline. May be empty if
   *  the user added the overlay but hasn't run alignment yet. */
  segments: AlignedSegment[];
  /** Global offset estimate from `align_whole` (fallback when segmented
   *  alignment returns nothing). Seconds. */
  globalOffsetS: Seconds;
  /** Worst-case confidence used to flag "shaky" alignments in the UI. */
  globalConfidence: number;
  /** When false, the overlay is loaded but ignored during export. */
  enabled: boolean;
}

/**
 * Given a position on the reference timeline, find the overlay segment
 * (if any) that maps to it. Used by the player + exporter to decide which
 * audio track should sound at time `t`.
 */
export function findOverlayAtReferenceTime(
  overlay: CleanAudioOverlay,
  referenceTime: Seconds,
): AlignedSegment | null {
  for (const seg of overlay.segments) {
    if (referenceTime >= seg.referenceStartS && referenceTime <= seg.referenceEndS) {
      return seg;
    }
  }
  return null;
}

/**
 * Convert a reference-timeline time into the overlay's own time. Returns
 * null if no segment covers the reference time.
 */
export function referenceToOverlayTime(
  overlay: CleanAudioOverlay,
  referenceTime: Seconds,
): Seconds | null {
  const seg = findOverlayAtReferenceTime(overlay, referenceTime);
  if (!seg) return null;
  return seg.candidateStartS + (referenceTime - seg.referenceStartS);
}

/**
 * Total reference-time duration that an overlay actually covers (sum of
 * segments). Used in the UI to show "X seconds of clean audio aligned".
 */
export function coveredReferenceDurationS(overlay: CleanAudioOverlay): Seconds {
  return overlay.segments.reduce((acc, seg) => acc + (seg.referenceEndS - seg.referenceStartS), 0);
}

/**
 * Walk the segments sorted by reference time and return the gaps where no
 * overlay segment is active (between 0 and `referenceDuration`). The
 * exporter feeds these to a fallback (camera audio, silence, or another
 * overlay) depending on user choice.
 */
export function overlayGaps(
  overlay: CleanAudioOverlay,
  referenceDuration: Seconds,
): { startS: Seconds; endS: Seconds }[] {
  if (overlay.segments.length === 0) {
    return [{ startS: 0, endS: referenceDuration }];
  }
  const sorted = [...overlay.segments].sort((a, b) => a.referenceStartS - b.referenceStartS);
  const gaps: { startS: Seconds; endS: Seconds }[] = [];
  let cursor: Seconds = 0;
  for (const seg of sorted) {
    if (seg.referenceStartS > cursor) {
      gaps.push({ startS: cursor, endS: seg.referenceStartS });
    }
    cursor = Math.max(cursor, seg.referenceEndS);
  }
  if (cursor < referenceDuration) {
    gaps.push({ startS: cursor, endS: referenceDuration });
  }
  return gaps;
}

/**
 * Merge overlapping or touching segments from multiple overlays into a
 * single non-overlapping per-overlay layout, picking the highest-confidence
 * segment when two overlays cover the same range. Useful when the user
 * loads several clean takes that partially overlap on the reference.
 */
export interface ResolvedSegment {
  overlayId: string;
  referenceStartS: Seconds;
  referenceEndS: Seconds;
  candidateStartS: Seconds;
  candidateEndS: Seconds;
}

export function resolveOverlaps(
  overlays: CleanAudioOverlay[],
  referenceDuration: Seconds,
): ResolvedSegment[] {
  const candidates: (ResolvedSegment & { confidence: number })[] = [];
  for (const overlay of overlays) {
    if (!overlay.enabled) continue;
    for (const seg of overlay.segments) {
      candidates.push({
        overlayId: overlay.id,
        referenceStartS: Math.max(0, seg.referenceStartS),
        referenceEndS: Math.min(referenceDuration, seg.referenceEndS),
        candidateStartS: seg.candidateStartS,
        candidateEndS: seg.candidateEndS,
        confidence: seg.confidence,
      });
    }
  }
  if (candidates.length === 0) return [];
  // Sweep the timeline; when several segments cover the same time, the
  // one with the highest confidence wins.
  candidates.sort((a, b) => a.referenceStartS - b.referenceStartS);
  const events: { time: Seconds; idx: number; kind: 'start' | 'end' }[] = [];
  candidates.forEach((c, i) => {
    events.push({ time: c.referenceStartS, idx: i, kind: 'start' });
    events.push({ time: c.referenceEndS, idx: i, kind: 'end' });
  });
  events.sort((a, b) => a.time - b.time || (a.kind === 'start' ? -1 : 1));

  const active = new Set<number>();
  const out: ResolvedSegment[] = [];
  let prevTime: Seconds | null = null;
  for (const ev of events) {
    if (prevTime !== null && ev.time > prevTime && active.size > 0) {
      // Pick winner for [prevTime, ev.time].
      let winner = -1;
      let bestConf = -1;
      for (const i of active) {
        if (candidates[i]!.confidence > bestConf) {
          bestConf = candidates[i]!.confidence;
          winner = i;
        }
      }
      if (winner >= 0) {
        const c = candidates[winner]!;
        const localStart = c.candidateStartS + (prevTime - c.referenceStartS);
        const localEnd = c.candidateStartS + (ev.time - c.referenceStartS);
        out.push({
          overlayId: c.overlayId,
          referenceStartS: prevTime,
          referenceEndS: ev.time,
          candidateStartS: localStart,
          candidateEndS: localEnd,
        });
      }
    }
    if (ev.kind === 'start') active.add(ev.idx);
    else active.delete(ev.idx);
    prevTime = ev.time;
  }
  return mergeContiguous(out);
}

/** Merge adjacent ResolvedSegments that come from the same overlay and
 * line up end-to-end in the candidate timeline (no gaps). */
function mergeContiguous(segs: ResolvedSegment[]): ResolvedSegment[] {
  if (segs.length === 0) return segs;
  const out: ResolvedSegment[] = [];
  for (const s of segs) {
    const last = out[out.length - 1];
    if (
      last &&
      last.overlayId === s.overlayId &&
      Math.abs(last.referenceEndS - s.referenceStartS) < 1e-3 &&
      Math.abs(last.candidateEndS - s.candidateStartS) < 1e-3
    ) {
      last.referenceEndS = s.referenceEndS;
      last.candidateEndS = s.candidateEndS;
    } else {
      out.push({ ...s });
    }
  }
  return out;
}
