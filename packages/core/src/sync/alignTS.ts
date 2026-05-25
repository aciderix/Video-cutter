/**
 * Pure-TS audio-sync engine — mirrors the Rust `audio_sync` module so
 * mobile (no Symphonia, no rustfft) gets the same alignment quality.
 * Decoding is the caller's job: pass a mono Float32Array + sample rate.
 *
 * Public API matches the Tauri command shape: `alignWhole` /
 * `alignSegmented` return an AlignmentReport with the same field names
 * (camelCase already, no serde to remap).
 */

import { computeMfcc, type MfccSequence, N_COEFFS } from './mfccTS.ts';
import type { AlignedSegment } from './index.ts';

export interface AlignmentReport {
  segments: AlignedSegment[];
  globalOffsetS: number;
  globalConfidence: number;
}

export interface AlignClipOptions {
  /** "whole" = single global offset, "segmented" = chunk by chunk. */
  mode?: 'whole' | 'segmented';
  /** Segmented mode only. Default 5 s. */
  chunkSeconds?: number;
  /** Segmented mode only. Default 0.2. */
  minConfidence?: number;
  /**
   * Called with a 0..1 ratio at meaningful checkpoints (MFCC encode +
   * each sliding-window probe). Lets the UI render a progress bar
   * instead of an indeterminate spinner.
   */
  onProgress?: (ratio: number) => void;
}

/**
 * Async variant of the alignment pipeline. Yields to the event loop
 * between MFCC encoding and DTW probing so the WebView stays
 * responsive on mobile, and emits progress so the caller can drive a
 * real progress bar.
 */
export async function alignAudioBuffers(
  reference: { samples: Float32Array; sampleRate: number },
  candidate: { samples: Float32Array; sampleRate: number },
  options: AlignClipOptions = {},
): Promise<AlignmentReport> {
  const { onProgress } = options;
  if (reference.samples.length === 0 || candidate.samples.length === 0) {
    onProgress?.(1);
    return { segments: [], globalOffsetS: 0, globalConfidence: 0 };
  }
  onProgress?.(0);
  const refMfcc = computeMfcc(reference.samples, reference.sampleRate);
  onProgress?.(0.2);
  await tick();
  const candMfcc = computeMfcc(candidate.samples, candidate.sampleRate);
  onProgress?.(0.35);
  await tick();
  const report =
    options.mode === 'segmented'
      ? await alignSegmentedAsync(
          refMfcc,
          candMfcc,
          options.chunkSeconds ?? 5,
          0.5,
          options.minConfidence ?? 0.2,
          (r) => onProgress?.(0.35 + r * 0.65),
        )
      : await alignWholeAsync(refMfcc, candMfcc, (r) => onProgress?.(0.35 + r * 0.65));
  onProgress?.(1);
  return report;
}

export function alignWhole(reference: MfccSequence, candidate: MfccSequence): AlignmentReport {
  if (candidate.nFrames === 0 || reference.nFrames === 0) {
    return { segments: [], globalOffsetS: 0, globalConfidence: 0 };
  }
  const r = coarseToFineSlide(reference, candidate, 0, candidate.nFrames);
  return resultFromSlide(r, reference.hopSeconds, candidate);
}

export function alignSegmented(
  reference: MfccSequence,
  candidate: MfccSequence,
  chunkSeconds: number,
  overlapSeconds: number,
  minConfidence: number,
): AlignmentReport {
  return runSegmented(reference, candidate, chunkSeconds, overlapSeconds, minConfidence);
}

// --- Async-aware implementations ----------------------------------------

async function alignWholeAsync(
  reference: MfccSequence,
  candidate: MfccSequence,
  onProgress?: (ratio: number) => void,
): Promise<AlignmentReport> {
  if (candidate.nFrames === 0 || reference.nFrames === 0) {
    onProgress?.(1);
    return { segments: [], globalOffsetS: 0, globalConfidence: 0 };
  }
  const r = await coarseToFineSlideAsync(reference, candidate, 0, candidate.nFrames, onProgress);
  return resultFromSlide(r, reference.hopSeconds, candidate);
}

async function alignSegmentedAsync(
  reference: MfccSequence,
  candidate: MfccSequence,
  chunkSeconds: number,
  overlapSeconds: number,
  minConfidence: number,
  onProgress?: (ratio: number) => void,
): Promise<AlignmentReport> {
  if (candidate.nFrames === 0 || reference.nFrames === 0) {
    onProgress?.(1);
    return { segments: [], globalOffsetS: 0, globalConfidence: 0 };
  }
  const rawChunkFrames = Math.round(chunkSeconds / candidate.hopSeconds);
  const chunkFrames = Math.max(10, Math.min(rawChunkFrames, candidate.nFrames));
  const overlapFrames = Math.round(overlapSeconds / candidate.hopSeconds);
  const step = Math.max(chunkFrames - overlapFrames, 1);
  const starts = chunkStarts(candidate.nFrames, chunkFrames, step);

  const probes: ChunkProbe[] = [];
  let bestGlobal: SlideResult | null = null;

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i]!;
    const r = coarseToFineSlide(reference, candidate, start, chunkFrames);
    const confidence = confidenceFromCosts(r.bestCost, r.baselineCost);
    const candStart = start * candidate.hopSeconds;
    const candEnd = (start + chunkFrames) * candidate.hopSeconds;
    const refStart = r.bestFrame * reference.hopSeconds;
    probes.push({
      candStart,
      candEnd,
      refStart,
      refEnd: refStart + (candEnd - candStart),
      offset: refStart - candStart,
      confidence,
    });
    if (!bestGlobal || r.bestCost < bestGlobal.bestCost) bestGlobal = r;
    onProgress?.((i + 1) / starts.length);
    await tick();
  }

  const segments = probesToSegments(probes, minConfidence, candidate.hopSeconds * 20);
  const merged = mergeConsecutive(segments, candidate.hopSeconds * 20);
  const [globalOffsetS, globalConfidence] = bestGlobal
    ? [
        bestGlobal.bestFrame * reference.hopSeconds,
        confidenceFromCosts(bestGlobal.bestCost, bestGlobal.baselineCost),
      ]
    : [0, 0];

  return { segments: merged, globalOffsetS, globalConfidence };
}

function runSegmented(
  reference: MfccSequence,
  candidate: MfccSequence,
  chunkSeconds: number,
  overlapSeconds: number,
  minConfidence: number,
): AlignmentReport {
  if (candidate.nFrames === 0 || reference.nFrames === 0) {
    return { segments: [], globalOffsetS: 0, globalConfidence: 0 };
  }
  const rawChunkFrames = Math.round(chunkSeconds / candidate.hopSeconds);
  const chunkFrames = Math.max(10, Math.min(rawChunkFrames, candidate.nFrames));
  const overlapFrames = Math.round(overlapSeconds / candidate.hopSeconds);
  const step = Math.max(chunkFrames - overlapFrames, 1);
  const starts = chunkStarts(candidate.nFrames, chunkFrames, step);

  const probes: ChunkProbe[] = [];
  let bestGlobal: SlideResult | null = null;
  for (const start of starts) {
    const r = coarseToFineSlide(reference, candidate, start, chunkFrames);
    const confidence = confidenceFromCosts(r.bestCost, r.baselineCost);
    const candStart = start * candidate.hopSeconds;
    const candEnd = (start + chunkFrames) * candidate.hopSeconds;
    const refStart = r.bestFrame * reference.hopSeconds;
    probes.push({
      candStart,
      candEnd,
      refStart,
      refEnd: refStart + (candEnd - candStart),
      offset: refStart - candStart,
      confidence,
    });
    if (!bestGlobal || r.bestCost < bestGlobal.bestCost) bestGlobal = r;
  }

  const segments = probesToSegments(probes, minConfidence, candidate.hopSeconds * 20);
  const merged = mergeConsecutive(segments, candidate.hopSeconds * 20);
  const [globalOffsetS, globalConfidence] = bestGlobal
    ? [
        bestGlobal.bestFrame * reference.hopSeconds,
        confidenceFromCosts(bestGlobal.bestCost, bestGlobal.baselineCost),
      ]
    : [0, 0];

  return { segments: merged, globalOffsetS, globalConfidence };
}

/**
 * Position the chunk window across the whole candidate. Mirrors the
 * straightforward `start += step` walk but explicitly tacks on a tail
 * probe at `nFrames - chunkFrames` so the last <chunkSeconds worth of
 * candidate audio always gets scored. Without it the last ~half-chunk
 * was silently dropped and would show up as a single missing word at
 * the end of the take.
 */
function chunkStarts(nFrames: number, chunkFrames: number, step: number): number[] {
  if (nFrames < chunkFrames) return [];
  const starts: number[] = [];
  for (let s = 0; s + chunkFrames <= nFrames; s += step) starts.push(s);
  const tail = nFrames - chunkFrames;
  if (tail >= 0 && (starts.length === 0 || starts[starts.length - 1]! < tail)) {
    starts.push(tail);
  }
  return starts;
}

function resultFromSlide(
  r: SlideResult,
  refHopSeconds: number,
  candidate: MfccSequence,
): AlignmentReport {
  const confidence = confidenceFromCosts(r.bestCost, r.baselineCost);
  const offsetS = r.bestFrame * refHopSeconds;
  const candidateDuration = candidate.nFrames * candidate.hopSeconds;
  return {
    segments: [
      {
        candidateStartS: 0,
        candidateEndS: candidateDuration,
        referenceStartS: offsetS,
        referenceEndS: offsetS + candidateDuration,
        confidence,
      },
    ],
    globalOffsetS: offsetS,
    globalConfidence: confidence,
  };
}

// --- Chunk-level probe handling ------------------------------------------

interface ChunkProbe {
  candStart: number;
  candEnd: number;
  refStart: number;
  refEnd: number;
  /** ref - cand origin. Probes within a continuous take share this. */
  offset: number;
  confidence: number;
}

/**
 * Two-pass acceptance over the raw chunk probes. The first pass keeps
 * every probe whose own confidence clears the threshold. The second
 * pass walks the list iteratively and accepts low-confidence probes
 * whose offset agrees with the nearest accepted neighbor (drift below
 * `driftToleranceS`). This bridges single weak chunks — typically the
 * ones over breath / fricative-heavy segments — that otherwise show up
 * as missing words in the played-back clean track.
 */
function probesToSegments(
  probes: ChunkProbe[],
  minConfidence: number,
  driftToleranceS: number,
): AlignedSegment[] {
  if (probes.length === 0) return [];
  const accepted = new Array<boolean>(probes.length).fill(false);
  for (let i = 0; i < probes.length; i++) {
    if (probes[i]!.confidence >= minConfidence) accepted[i] = true;
  }
  // Pass A — natural bridge: low-confidence probes whose own MFCC offset
  // already agrees with the nearest accepted neighbors get accepted as
  // they are. Run to a fixed point so chains propagate from both ends.
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < probes.length; i++) {
      if (accepted[i]) continue;
      const offsetHere = probes[i]!.offset;
      const prevIdx = findAcceptedBefore(accepted, i);
      const nextIdx = findAcceptedAfter(accepted, i);
      const refs: number[] = [];
      if (prevIdx >= 0) refs.push(probes[prevIdx]!.offset);
      if (nextIdx >= 0) refs.push(probes[nextIdx]!.offset);
      if (refs.length === 0) continue;
      const mean = refs.reduce((s, v) => s + v, 0) / refs.length;
      if (Math.abs(offsetHere - mean) <= driftToleranceS) {
        accepted[i] = true;
        changed = true;
      }
    }
  }
  // Pass B — force bridge: any rejected probe sandwiched between two
  // accepted neighbors gets pulled to the neighbor mean offset and
  // accepted. This handles chunks where the MFCC happened to be too
  // weak or ambiguous to localize on its own (silent intake, breath,
  // background fricative), but where we know from both sides what the
  // take's offset must be. The clean audio inside the chunk plays at
  // the interpolated time so we don't lose the words it covers.
  for (let i = 0; i < probes.length; i++) {
    if (accepted[i]) continue;
    const prevIdx = findAcceptedBefore(accepted, i);
    const nextIdx = findAcceptedAfter(accepted, i);
    if (prevIdx < 0 || nextIdx < 0) continue;
    const prev = probes[prevIdx]!;
    const next = probes[nextIdx]!;
    if (Math.abs(prev.offset - next.offset) > driftToleranceS * 3) continue;
    const mean = (prev.offset + next.offset) / 2;
    const p = probes[i]!;
    p.refStart = p.candStart + mean;
    p.refEnd = p.candEnd + mean;
    p.offset = mean;
    p.confidence = Math.min(prev.confidence, next.confidence) * 0.5;
    accepted[i] = true;
  }

  const out: AlignedSegment[] = [];
  for (let i = 0; i < probes.length; i++) {
    if (!accepted[i]) continue;
    const p = probes[i]!;
    out.push({
      candidateStartS: p.candStart,
      candidateEndS: p.candEnd,
      referenceStartS: p.refStart,
      referenceEndS: p.refEnd,
      confidence: p.confidence,
    });
  }
  return out;
}

function findAcceptedBefore(accepted: boolean[], i: number): number {
  for (let k = i - 1; k >= 0; k--) if (accepted[k]) return k;
  return -1;
}

function findAcceptedAfter(accepted: boolean[], i: number): number {
  for (let k = i + 1; k < accepted.length; k++) if (accepted[k]) return k;
  return -1;
}

// --- Sliding-window search (coarse-to-fine) ------------------------------

/**
 * Two-pass sliding window: a coarse pass with a wide stride covers the
 * full reference, then a fine pass with stride 1 refines around the
 * best coarse probe. Cuts the number of DTW evaluations by 5-10× on
 * long references while preserving frame-accurate offsets.
 */
function coarseToFineSlide(
  reference: MfccSequence,
  candidate: MfccSequence,
  candStartFrame: number,
  candLengthFrames: number,
): SlideResult {
  if (
    candidate.nFrames === 0 ||
    reference.nFrames === 0 ||
    reference.nFrames < candLengthFrames
  ) {
    return { bestFrame: 0, bestCost: Infinity, baselineCost: Infinity };
  }
  const band = Math.max(Math.floor(candLengthFrames / 8), 8);
  const coarseHop = Math.max(Math.floor(candLengthFrames / 24), 4);
  const coarse = slidingDtwCost(
    reference,
    candidate,
    candStartFrame,
    candLengthFrames,
    coarseHop,
    band,
    0,
    reference.nFrames - candLengthFrames,
  );
  if (coarseHop <= 1) return coarse;
  const fineLo = Math.max(0, coarse.bestFrame - coarseHop);
  const fineHi = Math.min(reference.nFrames - candLengthFrames, coarse.bestFrame + coarseHop);
  const fine = slidingDtwCost(
    reference,
    candidate,
    candStartFrame,
    candLengthFrames,
    1,
    band,
    fineLo,
    fineHi,
  );
  return {
    bestFrame: fine.bestCost <= coarse.bestCost ? fine.bestFrame : coarse.bestFrame,
    bestCost: Math.min(fine.bestCost, coarse.bestCost),
    baselineCost: coarse.baselineCost,
  };
}

async function coarseToFineSlideAsync(
  reference: MfccSequence,
  candidate: MfccSequence,
  candStartFrame: number,
  candLengthFrames: number,
  onProgress?: (ratio: number) => void,
): Promise<SlideResult> {
  const r = coarseToFineSlide(reference, candidate, candStartFrame, candLengthFrames);
  onProgress?.(1);
  await tick();
  return r;
}

// --- DTW internals -------------------------------------------------------

interface SlideResult {
  bestFrame: number;
  bestCost: number;
  baselineCost: number;
}

function slidingDtwCost(
  reference: MfccSequence,
  candidate: MfccSequence,
  candStartFrame: number,
  candLengthFrames: number,
  hop: number,
  band: number,
  searchLo: number,
  searchHi: number,
): SlideResult {
  const queryFrames = candLengthFrames;
  if (queryFrames === 0 || reference.nFrames < queryFrames) {
    return { bestFrame: 0, bestCost: Infinity, baselineCost: Infinity };
  }
  const stepHop = Math.max(hop, 1);
  let bestFrame = searchLo;
  let bestCost = Infinity;
  const probes: number[] = [];
  const queryFramesView = candidate.frames.subarray(
    candStartFrame * N_COEFFS,
    (candStartFrame + queryFrames) * N_COEFFS,
  );
  const queryNorms = candidate.norms.subarray(candStartFrame, candStartFrame + queryFrames);

  for (let start = searchLo; start <= searchHi; start += stepHop) {
    const refView = reference.frames.subarray(
      start * N_COEFFS,
      (start + queryFrames) * N_COEFFS,
    );
    const refNorms = reference.norms.subarray(start, start + queryFrames);
    const cost = dtwDistance(queryFramesView, refView, queryNorms, refNorms, band);
    probes.push(cost);
    if (cost < bestCost) {
      bestCost = cost;
      bestFrame = start;
    }
  }

  const sorted = probes.slice().sort((a, b) => a - b);
  const baselineCost =
    sorted[Math.min(Math.floor(sorted.length / 2), sorted.length - 1)] ?? Infinity;
  return { bestFrame, bestCost, baselineCost };
}

function dtwDistance(
  query: Float32Array,
  reference: Float32Array,
  queryNorms: Float32Array,
  referenceNorms: Float32Array,
  band: number,
): number {
  const nQ = query.length / N_COEFFS;
  const nR = reference.length / N_COEFFS;
  if (nQ === 0 || nR === 0) return Infinity;
  const bandClamped = Math.max(band, 1);

  let prev = new Float32Array(nR);
  let cur = new Float32Array(nR);
  prev.fill(Infinity);
  cur.fill(Infinity);

  {
    const q0 = query.subarray(0, N_COEFFS);
    const q0n = queryNorms[0]!;
    const hi = Math.min(bandClamped, nR - 1);
    for (let j = 0; j <= hi; j++) {
      const r = reference.subarray(j * N_COEFFS, (j + 1) * N_COEFFS);
      const d = frameDistance(q0, r, q0n, referenceNorms[j]!);
      cur[j] = j === 0 ? d : cur[j - 1]! + d;
    }
  }
  [prev, cur] = [cur, prev];

  for (let i = 1; i < nQ; i++) {
    cur.fill(Infinity);
    const lo = i > bandClamped ? i - bandClamped : 0;
    const hi = Math.min(i + bandClamped, nR - 1);
    const q = query.subarray(i * N_COEFFS, (i + 1) * N_COEFFS);
    const qn = queryNorms[i]!;
    for (let j = lo; j <= hi; j++) {
      const r = reference.subarray(j * N_COEFFS, (j + 1) * N_COEFFS);
      const d = frameDistance(q, r, qn, referenceNorms[j]!);
      const fromDiag = j > 0 ? prev[j - 1]! : Infinity;
      const fromLeft = j > 0 ? cur[j - 1]! : Infinity;
      const fromTop = prev[j]!;
      const best = Math.min(fromDiag, fromLeft, fromTop);
      cur[j] = isFinite(best) ? best + d : d;
    }
    [prev, cur] = [cur, prev];
  }

  const last = Math.min(nQ + bandClamped, nR) - 1;
  const lo = nQ > bandClamped + 1 ? nQ - bandClamped - 1 : 0;
  let minCost = Infinity;
  for (let j = lo; j <= last; j++) {
    if (prev[j]! < minCost) minCost = prev[j]!;
  }
  return minCost / nQ;
}

function frameDistance(
  a: Float32Array,
  b: Float32Array,
  aNorm: number,
  bNorm: number,
): number {
  const denom = aNorm * bNorm;
  if (denom < 1e-12) return 1;
  let dot = 0;
  for (let i = 0; i < N_COEFFS; i++) {
    dot += a[i]! * b[i]!;
  }
  return 1 - dot / denom;
}

function confidenceFromCosts(best: number, baseline: number): number {
  if (!isFinite(best) || !isFinite(baseline) || baseline <= 0) return 0;
  return Math.max(0, Math.min(1, 1 - best / baseline));
}

function mergeConsecutive(segs: AlignedSegment[], toleranceS: number): AlignedSegment[] {
  if (segs.length === 0) return segs;
  const sorted = segs.slice().sort((a, b) => a.candidateStartS - b.candidateStartS);
  const out: AlignedSegment[] = [];
  for (const s of sorted) {
    const last = out[out.length - 1];
    if (last) {
      // Signed gap so the standard chunk overlap (negative gap) counts as
      // touching. Math.abs was rejecting every consecutive chunk pair
      // because alignSegmented intentionally overlaps by ~0.5 s.
      const candGap = s.candidateStartS - last.candidateEndS;
      const refOffsetLast = last.referenceStartS - last.candidateStartS;
      const refOffsetNow = s.referenceStartS - s.candidateStartS;
      const drift = Math.abs(refOffsetNow - refOffsetLast);
      if (candGap <= toleranceS && drift <= toleranceS) {
        last.candidateEndS = Math.max(last.candidateEndS, s.candidateEndS);
        last.referenceEndS = Math.max(last.referenceEndS, s.referenceEndS);
        last.confidence = Math.min(last.confidence, s.confidence);
        continue;
      }
    }
    out.push({ ...s });
  }
  return out;
}

function tick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}
