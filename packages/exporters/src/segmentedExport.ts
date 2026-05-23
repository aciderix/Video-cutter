import type { Region } from '@quietcut/core';
import { keptRegions } from '@quietcut/core';
import type { ExportContext } from './types.ts';
import type { FormatPreset } from './formats.ts';
import { planSegments, type SegmentPlan } from './ffmpeg.ts';

/**
 * Single-file export plan that scales to thousands of kept regions. The
 * filter_complex builder produces O(N) filter nodes which FFmpeg's parser
 * cannot handle past a few hundred segments — at that scale we switch to a
 * two-phase plan: cut each kept region into a temporary segment, then
 * concat-demux them into the final file.
 */
export interface SegmentedExportPlan {
  segments: { segment: SegmentPlan; args: string[]; tmpPath: string }[];
  concatListContent: string;
  concatListPath: string;
  concatArgs: string[];
  outputPath: string;
  outputDurationS: number;
  streamCopy: boolean;
}

export interface SegmentedExportOptions {
  outputPath: string;
  tmpDir: string;
  /** File extension for both temp segments and the output (e.g. ".mp4"). */
  extension: string;
  /** Format preset — drives codec selection when streamCopy is false. */
  preset?: FormatPreset;
  /** Default: true; falls back to libx264/aac when false. */
  streamCopy?: boolean;
  /** Whitelist of region ids to include (defaults to all kept regions). */
  selectedIds?: ReadonlySet<string>;
}

export function buildSegmentedExport(
  ctx: ExportContext,
  options: SegmentedExportOptions,
): SegmentedExportPlan {
  const filtered = pickSegments(ctx.regions, options.selectedIds);
  const plans = filtered.map((r, index) => ({
    index,
    start: r.start,
    end: r.end,
    duration: r.end - r.start,
  })) as SegmentPlan[];
  if (plans.length === 0) {
    throw new Error('export: no segments selected');
  }
  const streamCopy = options.streamCopy ?? true;
  const wantVideo = (options.preset?.hasVideo ?? ctx.source.hasVideo) && ctx.source.hasVideo;
  const videoCodec = options.preset?.videoCodec ?? 'libx264';
  const audioCodec = options.preset?.audioCodec ?? 'aac';
  const presetExtra = options.preset?.extraArgs ?? [];

  const segments = plans.map((segment) => {
    const padded = String(segment.index + 1).padStart(5, '0');
    const tmpPath = `${options.tmpDir}/qc_seg_${padded}${options.extension}`;
    const encodeArgs = streamCopy
      ? ['-c', 'copy', '-avoid_negative_ts', 'make_zero']
      : wantVideo
        ? ['-c:v', videoCodec, '-c:a', audioCodec, ...presetExtra]
        : ['-vn', '-c:a', audioCodec, ...presetExtra];
    const args = [
      '-y',
      '-nostdin',
      '-hide_banner',
      '-ss',
      segment.start.toFixed(6),
      '-i',
      ctx.source.path,
      '-t',
      segment.duration.toFixed(6),
      ...encodeArgs,
      tmpPath,
    ];
    return { segment, args, tmpPath };
  });

  const concatListPath = `${options.tmpDir}/qc_concat.txt`;
  const concatListContent = segments.map((s) => `file '${escape(s.tmpPath)}'`).join('\n') + '\n';
  const concatArgs = [
    '-y',
    '-nostdin',
    '-hide_banner',
    '-f',
    'concat',
    '-safe',
    '0',
    '-i',
    concatListPath,
    '-c',
    'copy',
    options.outputPath,
  ];

  const outputDurationS = plans.reduce((acc, p) => acc + p.duration, 0);

  return {
    segments,
    concatListContent,
    concatListPath,
    concatArgs,
    outputPath: options.outputPath,
    outputDurationS,
    streamCopy,
  };
}

/**
 * Plan for "export each selected region as its own file". Returns one
 * FFmpeg invocation per region — the UI runs them sequentially through the
 * Tauri command and accumulates progress.
 */
export interface PerRegionExportPlan {
  segments: {
    region: Region;
    index: number;
    args: string[];
    outputPath: string;
    durationS: number;
  }[];
  totalDurationS: number;
}

export interface PerRegionExportOptions {
  outputDir: string;
  basename: string;
  /** Format preset for each segment. */
  preset?: FormatPreset;
  /** Extension fallback if preset is missing. */
  extension?: string;
  selectedIds?: ReadonlySet<string>;
  streamCopy?: boolean;
}

export function buildPerRegionExport(
  ctx: ExportContext,
  options: PerRegionExportOptions,
): PerRegionExportPlan {
  const filtered = pickSegments(ctx.regions, options.selectedIds);
  if (filtered.length === 0) {
    throw new Error('export: no regions selected');
  }
  const ext = options.preset?.extension ?? options.extension ?? '.mp4';
  const wantVideo = (options.preset?.hasVideo ?? ctx.source.hasVideo) && ctx.source.hasVideo;
  const videoCodec = options.preset?.videoCodec ?? 'libx264';
  const audioCodec = options.preset?.audioCodec ?? 'aac';
  const presetExtra = options.preset?.extraArgs ?? [];
  const streamCopy = options.streamCopy ?? false;

  const segments = filtered.map((region, index) => {
    const padded = String(index + 1).padStart(3, '0');
    const outputPath = `${options.outputDir}/${options.basename}_${padded}${ext}`;
    const encodeArgs = streamCopy
      ? ['-c', 'copy', '-avoid_negative_ts', 'make_zero']
      : wantVideo
        ? ['-c:v', videoCodec, '-c:a', audioCodec, ...presetExtra]
        : ['-vn', '-c:a', audioCodec, ...presetExtra];
    const duration = region.end - region.start;
    const args = [
      '-y',
      '-nostdin',
      '-hide_banner',
      '-ss',
      region.start.toFixed(6),
      '-i',
      ctx.source.path,
      '-t',
      duration.toFixed(6),
      ...encodeArgs,
      outputPath,
    ];
    return { region, index, args, outputPath, durationS: duration };
  });

  return {
    segments,
    totalDurationS: segments.reduce((acc, s) => acc + s.durationS, 0),
  };
}

function pickSegments(regions: Region[], selectedIds?: ReadonlySet<string>): Region[] {
  if (!selectedIds) return keptRegions(regions);
  return regions.filter((r) => selectedIds.has(r.id));
}

// keep unused import surfaced — planSegments stays exported for callers that
// want to plan kept regions directly. Without this `noUnusedLocals` complains.
void planSegments;

function escape(path: string): string {
  return path.replace(/'/g, `'\\''`);
}

/**
 * Heuristic threshold above which `filter_complex` becomes risky. Empirical:
 * FFmpeg 6 starts OOM-ing around 800-1000 filter nodes on a 2 GB process.
 */
export const FILTER_COMPLEX_SEGMENT_THRESHOLD = 50;
