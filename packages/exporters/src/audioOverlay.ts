import { keptRegions } from '@quietcut/core';
import type { CleanAudioOverlay, Region } from '@quietcut/core';
import { resolveOverlaps } from '@quietcut/core';
import type { ExportContext } from './types.ts';
import type { FormatPreset } from './formats.ts';

/**
 * Build a single-pass FFmpeg filter_complex command that cuts the source
 * down to the kept regions AND replaces the camera audio with the
 * highest-confidence clean overlay wherever one is aligned. Regions (or
 * sub-ranges of regions) that no overlay covers fall back to the source
 * audio — or, if `cleanOnly` is true, are filled with silence.
 *
 * Compared to `buildFilterComplexExport`, the difference is the audio
 * graph: instead of just `atrim`+`concat` on `[0:a]`, we pick the right
 * input (camera or overlay file) for each piece of each kept region.
 *
 *   ffmpeg -i cam.mp4 -i clean.wav \
 *     -filter_complex "<trim chains>; <concat>" \
 *     -map "[v]" -map "[a]" -c:v ... -c:a ... out.mp4
 */
export interface OverlayExportPlan {
  args: string[];
  outputDurationS: number;
  segmentCount: number;
  /** Number of distinct audio sub-pieces (regions × overlay coverage). */
  audioPieces: number;
}

export interface OverlayExportOptions {
  outputPath: string;
  /** Overlays attached to the source, in store order. */
  overlays: CleanAudioOverlay[];
  /** If true, ranges without overlay coverage are silenced instead of
   *  falling back to the camera audio. */
  cleanOnly?: boolean;
  /** Optional whitelist of kept-region ids to include. */
  selectedIds?: ReadonlySet<string>;
  /** Format preset — drives codec + extra args. */
  preset?: FormatPreset;
  /** Extra args appended after -map but before output. */
  extraArgs?: string[];
}

export function buildOverlayExport(
  ctx: ExportContext,
  options: OverlayExportOptions,
): OverlayExportPlan {
  const segments = pickSegments(ctx.regions, options.selectedIds);
  if (segments.length === 0) {
    throw new Error('export: no segments selected');
  }
  const wantVideo = (options.preset?.hasVideo ?? ctx.source.hasVideo) && ctx.source.hasVideo;

  // Each enabled overlay is a separate FFmpeg input (`-i path`). Index 0
  // is always the reference source.
  const enabledOverlays = options.overlays.filter((o) => o.enabled);
  const overlayInputIndex: Record<string, number> = {};
  enabledOverlays.forEach((o, i) => {
    overlayInputIndex[o.id] = i + 1; // 0 is the source
  });

  const resolved = resolveOverlaps(enabledOverlays, ctx.source.duration);
  const cleanOnly = options.cleanOnly ?? false;

  const filterParts: string[] = [];
  const videoConcat: string[] = [];
  const audioConcat: string[] = [];
  let audioLabel = 0;

  segments.forEach((region, regionIdx) => {
    const rStart = region.start;
    const rEnd = region.end;
    if (wantVideo) {
      filterParts.push(
        `[0:v]trim=start=${rStart.toFixed(6)}:end=${rEnd.toFixed(6)},setpts=PTS-STARTPTS[v${regionIdx}]`,
      );
      videoConcat.push(`[v${regionIdx}]`);
    }

    const pieces = audioPiecesForRegion(rStart, rEnd, resolved, cleanOnly);
    for (const piece of pieces) {
      const label = `a${audioLabel++}`;
      if (piece.kind === 'overlay') {
        const inputIdx = overlayInputIndex[piece.overlayId]!;
        filterParts.push(
          `[${inputIdx}:a]atrim=start=${piece.candidateStartS.toFixed(6)}:end=${piece.candidateEndS.toFixed(6)},asetpts=PTS-STARTPTS[${label}]`,
        );
      } else if (piece.kind === 'source') {
        filterParts.push(
          `[0:a]atrim=start=${piece.refStartS.toFixed(6)}:end=${piece.refEndS.toFixed(6)},asetpts=PTS-STARTPTS[${label}]`,
        );
      } else {
        const dur = piece.refEndS - piece.refStartS;
        filterParts.push(
          `anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=${dur.toFixed(6)},asetpts=PTS-STARTPTS[${label}]`,
        );
      }
      audioConcat.push(`[${label}]`);
    }
  });

  const totalAudioPieces = audioConcat.length;
  if (totalAudioPieces === 0) {
    throw new Error('export: no audio pieces — verify selection and overlays');
  }
  filterParts.push(`${audioConcat.join('')}concat=n=${totalAudioPieces}:v=0:a=1[a]`);
  if (wantVideo) {
    filterParts.push(`${videoConcat.join('')}concat=n=${segments.length}:v=1:a=0[v]`);
  }

  const args: string[] = ['-y', '-nostdin', '-hide_banner', '-i', ctx.source.path];
  for (const o of enabledOverlays) {
    args.push('-i', o.path);
  }
  args.push('-filter_complex', filterParts.join(';'));

  const videoCodec = options.preset?.videoCodec ?? 'libx264';
  const audioCodec = options.preset?.audioCodec ?? 'aac';
  if (wantVideo) args.push('-map', '[v]', '-c:v', videoCodec);
  args.push('-map', '[a]', '-c:a', audioCodec);
  if (options.preset?.extraArgs) args.push(...options.preset.extraArgs);
  if (options.extraArgs) args.push(...options.extraArgs);
  args.push(options.outputPath);

  const outputDurationS = segments.reduce((acc, r) => acc + (r.end - r.start), 0);
  return {
    args,
    outputDurationS,
    segmentCount: segments.length,
    audioPieces: totalAudioPieces,
  };
}

/** Break a kept region [rStart, rEnd] into pieces — one per overlay
 * coverage stretch, with source-audio (or silence) filling the gaps. */
type AudioPiece =
  | {
      kind: 'overlay';
      overlayId: string;
      candidateStartS: number;
      candidateEndS: number;
      refStartS: number;
      refEndS: number;
    }
  | { kind: 'source'; refStartS: number; refEndS: number }
  | { kind: 'silence'; refStartS: number; refEndS: number };

function audioPiecesForRegion(
  rStart: number,
  rEnd: number,
  resolved: ReturnType<typeof resolveOverlaps>,
  cleanOnly: boolean,
): AudioPiece[] {
  const overlaps = resolved
    .filter((s) => s.referenceStartS < rEnd && s.referenceEndS > rStart)
    .sort((a, b) => a.referenceStartS - b.referenceStartS);

  const fillKind: 'source' | 'silence' = cleanOnly ? 'silence' : 'source';
  const pieces: AudioPiece[] = [];
  let cursor = rStart;
  for (const seg of overlaps) {
    const segStart = Math.max(rStart, seg.referenceStartS);
    const segEnd = Math.min(rEnd, seg.referenceEndS);
    if (segStart > cursor) {
      pieces.push({ kind: fillKind, refStartS: cursor, refEndS: segStart });
    }
    const candStart = seg.candidateStartS + (segStart - seg.referenceStartS);
    const candEnd = seg.candidateStartS + (segEnd - seg.referenceStartS);
    pieces.push({
      kind: 'overlay',
      overlayId: seg.overlayId,
      candidateStartS: candStart,
      candidateEndS: candEnd,
      refStartS: segStart,
      refEndS: segEnd,
    });
    cursor = segEnd;
  }
  if (cursor < rEnd) {
    pieces.push({ kind: fillKind, refStartS: cursor, refEndS: rEnd });
  }
  return pieces;
}

function pickSegments(regions: Region[], selectedIds?: ReadonlySet<string>): Region[] {
  if (!selectedIds) return keptRegions(regions);
  return regions.filter((r) => selectedIds.has(r.id));
}
