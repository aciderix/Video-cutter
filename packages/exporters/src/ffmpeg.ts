import { keptRegions } from '@snipvox/core';
import type { ExportContext } from './types.ts';

/**
 * FFmpeg concat-demuxer list. Stream-copy when the source codec is mp4-safe,
 * which makes export almost instantaneous regardless of clip duration.
 *
 * Each kept region becomes a temporary cut segment, then concat is invoked:
 *   ffmpeg -f concat -safe 0 -i list.txt -c copy out.mp4
 */
export interface SegmentPlan {
  index: number;
  start: number;
  end: number;
  duration: number;
}

export function planSegments(ctx: ExportContext): SegmentPlan[] {
  return keptRegions(ctx.regions).map((r, i) => ({
    index: i,
    start: r.start,
    end: r.end,
    duration: r.end - r.start,
  }));
}

/**
 * Build the FFmpeg concat list file content. Paths must be absolute or
 * relative to the list file and escaped per the concat demuxer rules.
 */
export function buildFFmpegConcatList(segmentPaths: string[]): string {
  return segmentPaths.map((p) => `file '${escapeConcatPath(p)}'`).join('\n') + '\n';
}

/**
 * Build the per-segment FFmpeg commands for the "one file per kept region"
 * export mode. Uses keyframe-accurate seeking (-ss before -i + -c copy when
 * codec-safe, otherwise re-encode).
 */
export function buildFFmpegSegmentCommands(
  ctx: ExportContext,
  options: { streamCopy: boolean; outDir: string; basename: string; extension: string },
): { segment: SegmentPlan; args: string[]; outputPath: string }[] {
  const plans = planSegments(ctx);
  return plans.map((segment) => {
    const padded = String(segment.index + 1).padStart(3, '0');
    const outputPath = `${options.outDir}/${options.basename}_${padded}${options.extension}`;
    const args = [
      '-y',
      '-ss',
      segment.start.toFixed(3),
      '-i',
      ctx.source.path,
      '-t',
      segment.duration.toFixed(3),
      ...(options.streamCopy ? ['-c', 'copy'] : ['-c:v', 'libx264', '-c:a', 'aac']),
      outputPath,
    ];
    return { segment, args, outputPath };
  });
}

function escapeConcatPath(path: string): string {
  return path.replace(/'/g, `'\\''`);
}
