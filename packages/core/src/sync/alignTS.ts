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
}

/**
 * Align a candidate audio buffer against a reference. Both are mono
 * Float32Arrays at any sample rate; MFCC resamples internally. This
 * is the top-level entry point mobile / browser callers use.
 */
export function alignAudioBuffers(
  reference: { samples: Float32Array; sampleRate: number },
  candidate: { samples: Float32Array; sampleRate: number },
  options: AlignClipOptions = {},
): AlignmentReport {
  if (reference.samples.length === 0 || candidate.samples.length === 0) {
    return { segments: [], globalOffsetS: 0, globalConfidence: 0 };
  }
  const refMfcc = computeMfcc(reference.samples, reference.sampleRate);
  const candMfcc = computeMfcc(candidate.samples, candidate.sampleRate);
  if (options.mode === 'segmented') {
    return alignSegmented(
      refMfcc,
      candMfcc,
      options.chunkSeconds ?? 5,
      0.5,
      options.minConfidence ?? 0.2,
    );
  }
  return alignWhole(refMfcc, candMfcc);
}

export function alignWhole(reference: MfccSequence, candidate: MfccSequence): AlignmentReport {
  if (candidate.nFrames === 0 || reference.nFrames === 0) {
    return { segments: [], globalOffsetS: 0, globalConfidence: 0 };
  }
  const band = Math.max(Math.floor(candidate.nFrames / 10), 10);
  const hop = Math.max(Math.floor(candidate.nFrames / 50), 1);
  const r = slidingDtwCost(
    candidate.frames,
    reference.frames,
    candidate.nFrames,
    reference.nFrames,
    hop,
    band,
  );
  const confidence = confidenceFromCosts(r.bestCost, r.baselineCost);
  const offsetS = r.bestFrame * reference.hopSeconds;
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

export function alignSegmented(
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

  const segments: AlignedSegment[] = [];
  let bestGlobal: SlideResult | null = null;

  let start = 0;
  while (start + chunkFrames <= candidate.nFrames) {
    const end = start + chunkFrames;
    const slice = candidate.frames.subarray(start * N_COEFFS, end * N_COEFFS);
    const band = Math.max(Math.floor(chunkFrames / 8), 8);
    const hop = Math.max(Math.floor(chunkFrames / 40), 1);
    const r = slidingDtwCost(slice, reference.frames, chunkFrames, reference.nFrames, hop, band);
    const confidence = confidenceFromCosts(r.bestCost, r.baselineCost);
    if (confidence >= minConfidence) {
      const candStart = start * candidate.hopSeconds;
      const candEnd = end * candidate.hopSeconds;
      const refStart = r.bestFrame * reference.hopSeconds;
      const refEnd = refStart + (candEnd - candStart);
      segments.push({
        candidateStartS: candStart,
        candidateEndS: candEnd,
        referenceStartS: refStart,
        referenceEndS: refEnd,
        confidence,
      });
    }
    if (!bestGlobal || r.bestCost < bestGlobal.bestCost) bestGlobal = r;
    start += step;
  }

  const merged = mergeConsecutive(segments, candidate.hopSeconds * 2);
  const [globalOffsetS, globalConfidence] = bestGlobal
    ? [
        bestGlobal.bestFrame * reference.hopSeconds,
        confidenceFromCosts(bestGlobal.bestCost, bestGlobal.baselineCost),
      ]
    : [0, 0];

  return { segments: merged, globalOffsetS, globalConfidence };
}

// --- DTW internals -------------------------------------------------------

interface SlideResult {
  bestFrame: number;
  bestCost: number;
  baselineCost: number;
}

function slidingDtwCost(
  query: Float32Array,
  reference: Float32Array,
  queryFrames: number,
  referenceFrames: number,
  hop: number,
  band: number,
): SlideResult {
  if (queryFrames === 0 || referenceFrames === 0 || referenceFrames < queryFrames) {
    return { bestFrame: 0, bestCost: Infinity, baselineCost: Infinity };
  }
  const stepHop = Math.max(hop, 1);
  const maxStart = referenceFrames - queryFrames;
  let bestFrame = 0;
  let bestCost = Infinity;
  const probes: number[] = [];

  for (let start = 0; start <= maxStart; start += stepHop) {
    const window = reference.subarray(start * N_COEFFS, (start + queryFrames) * N_COEFFS);
    const cost = dtwDistance(query, window, band);
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

function dtwDistance(query: Float32Array, reference: Float32Array, band: number): number {
  const nQ = query.length / N_COEFFS;
  const nR = reference.length / N_COEFFS;
  if (nQ === 0 || nR === 0) return Infinity;
  const bandClamped = Math.max(band, 1);

  let prev = new Float32Array(nR);
  let cur = new Float32Array(nR);
  prev.fill(Infinity);
  cur.fill(Infinity);

  // First row
  {
    const q0 = query.subarray(0, N_COEFFS);
    const hi = Math.min(bandClamped, nR - 1);
    for (let j = 0; j <= hi; j++) {
      const r = reference.subarray(j * N_COEFFS, (j + 1) * N_COEFFS);
      const d = frameDistance(q0, r);
      cur[j] = j === 0 ? d : cur[j - 1]! + d;
    }
  }
  [prev, cur] = [cur, prev];

  for (let i = 1; i < nQ; i++) {
    cur.fill(Infinity);
    const lo = i > bandClamped ? i - bandClamped : 0;
    const hi = Math.min(i + bandClamped, nR - 1);
    const q = query.subarray(i * N_COEFFS, (i + 1) * N_COEFFS);
    for (let j = lo; j <= hi; j++) {
      const r = reference.subarray(j * N_COEFFS, (j + 1) * N_COEFFS);
      const d = frameDistance(q, r);
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

function frameDistance(a: Float32Array, b: Float32Array): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < N_COEFFS; i++) {
    dot += a[i]! * b[i]!;
    na += a[i]! * a[i]!;
    nb += b[i]! * b[i]!;
  }
  const denom = Math.sqrt(na * nb);
  if (denom < 1e-12) return 1;
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
      const candGap = Math.abs(s.candidateStartS - last.candidateEndS);
      const refOffsetLast = last.referenceStartS - last.candidateStartS;
      const refOffsetNow = s.referenceStartS - s.candidateStartS;
      const drift = Math.abs(refOffsetNow - refOffsetLast);
      if (candGap <= toleranceS && drift <= toleranceS) {
        last.candidateEndS = s.candidateEndS;
        last.referenceEndS = s.referenceEndS;
        last.confidence = Math.min(last.confidence, s.confidence);
        continue;
      }
    }
    out.push({ ...s });
  }
  return out;
}
