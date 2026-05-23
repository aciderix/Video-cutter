import type { ExportContext } from './types.ts';
import { planSegments, type SegmentPlan } from './ffmpeg.ts';

/**
 * Single-file export plan that scales to thousands of kept regions. The
 * filter_complex builder produces O(N) filter nodes which FFmpeg's parser
 * cannot handle past a few hundred segments — at that scale we switch to a
 * two-phase plan: cut each kept region into a temporary segment, then
 * concat-demux them into the final file.
 *
 * Phase A — one ffmpeg invocation per kept region:
 *   ffmpeg -ss START -i src -t DUR -c copy seg_NNN.ext
 * Phase B — one final ffmpeg invocation:
 *   ffmpeg -f concat -safe 0 -i list.txt -c copy out.ext
 *
 * Stream-copy is preferred (instant, no quality loss) but requires the
 * source to be keyframe-aligned. Callers can flip `forceReencode: true` to
 * accept the slower but always-correct path.
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
  /** Default: true; falls back to libx264/aac when false. */
  streamCopy?: boolean;
}

export function buildSegmentedExport(
  ctx: ExportContext,
  options: SegmentedExportOptions,
): SegmentedExportPlan {
  const plans = planSegments(ctx);
  if (plans.length === 0) {
    throw new Error('export: no kept regions');
  }
  const streamCopy = options.streamCopy ?? true;
  const segments = plans.map((segment) => {
    const padded = String(segment.index + 1).padStart(5, '0');
    const tmpPath = `${options.tmpDir}/qc_seg_${padded}${options.extension}`;
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
      ...(streamCopy
        ? ['-c', 'copy', '-avoid_negative_ts', 'make_zero']
        : ['-c:v', 'libx264', '-c:a', 'aac', '-preset', 'veryfast', '-crf', '20']),
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

function escape(path: string): string {
  return path.replace(/'/g, `'\\''`);
}

/**
 * Heuristic threshold above which `filter_complex` becomes risky. Empirical:
 * FFmpeg 6 starts OOM-ing around 800-1000 filter nodes on a 2 GB process.
 * Each kept region adds 2 nodes (trim + atrim), so 50 segments → ~100 nodes
 * which is fine, but 500 segments → ~1000 which is not. We pick 50 as the
 * crossover because the per-segment path's overhead is dominated by ffmpeg
 * startup cost (~100 ms × N) — for 50 segments that's 5 s before concat,
 * comparable to a filter_complex re-encode of equivalent length.
 */
export const FILTER_COMPLEX_SEGMENT_THRESHOLD = 50;
