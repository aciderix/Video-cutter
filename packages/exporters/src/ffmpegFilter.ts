import { keptRegions } from '@quietcut/core';
import type { ExportContext } from './types.ts';

/**
 * Single-pass FFmpeg invocation that trims, concatenates, and re-encodes the
 * kept regions into one output file. Slower than stream-copy but works with
 * any source (no codec-compat check, no GOP alignment).
 *
 *   ffmpeg -i src \
 *     -filter_complex "[0:v]trim=0:1[v0];[0:a]atrim=0:1[a0];...; \
 *                      [v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
 *     -map "[v]" -map "[a]" -c:v libx264 -c:a aac out.mp4
 */
export interface FilterComplexExport {
  args: string[];
  /** Total output duration the export will produce — useful for % progress. */
  outputDurationS: number;
  /** Number of kept segments emitted. */
  segmentCount: number;
}

export interface FilterComplexOptions {
  outputPath: string;
  /** Re-encode video codec (default libx264). Use 'libx264'/'libx265'/'copy' etc. */
  videoCodec?: string;
  /** Re-encode audio codec (default aac). */
  audioCodec?: string;
  /** Extra args appended after -map but before output (e.g. ['-crf', '18']). */
  extraArgs?: string[];
}

export function buildFilterComplexExport(
  ctx: ExportContext,
  options: FilterComplexOptions,
): FilterComplexExport {
  const kept = keptRegions(ctx.regions);
  const hasVideo = ctx.source.hasVideo;
  const hasAudio = ctx.source.hasAudio;
  if (kept.length === 0) {
    throw new Error('export: no kept regions');
  }
  if (!hasVideo && !hasAudio) {
    throw new Error('export: source has neither audio nor video');
  }

  const parts: string[] = [];
  const concatInputs: string[] = [];
  kept.forEach((r, i) => {
    const ss = r.start.toFixed(6);
    const ee = r.end.toFixed(6);
    if (hasVideo) {
      parts.push(`[0:v]trim=start=${ss}:end=${ee},setpts=PTS-STARTPTS[v${i}]`);
    }
    if (hasAudio) {
      parts.push(`[0:a]atrim=start=${ss}:end=${ee},asetpts=PTS-STARTPTS[a${i}]`);
    }
    if (hasVideo) concatInputs.push(`[v${i}]`);
    if (hasAudio) concatInputs.push(`[a${i}]`);
  });
  const vFlag = hasVideo ? 1 : 0;
  const aFlag = hasAudio ? 1 : 0;
  parts.push(
    `${concatInputs.join('')}concat=n=${kept.length}:v=${vFlag}:a=${aFlag}` +
      `${hasVideo ? '[v]' : ''}${hasAudio ? '[a]' : ''}`,
  );

  const args: string[] = [
    '-y',
    '-nostdin',
    '-hide_banner',
    '-i',
    ctx.source.path,
    '-filter_complex',
    parts.join(';'),
  ];
  if (hasVideo) args.push('-map', '[v]', '-c:v', options.videoCodec ?? 'libx264');
  if (hasAudio) args.push('-map', '[a]', '-c:a', options.audioCodec ?? 'aac');
  if (options.extraArgs) args.push(...options.extraArgs);
  args.push(options.outputPath);

  const outputDurationS = kept.reduce((acc, r) => acc + (r.end - r.start), 0);
  return { args, outputDurationS, segmentCount: kept.length };
}
