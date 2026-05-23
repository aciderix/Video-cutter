import { keptRegions } from '@quietcut/core';
import type { Region } from '@quietcut/core';
import type { ExportContext } from './types.ts';
import type { FormatPreset } from './formats.ts';

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
  /** Format preset — drives codec, container, extra args, video on/off. */
  preset?: FormatPreset;
  /** Legacy raw overrides (kept for callers that pre-date `preset`). */
  videoCodec?: string;
  audioCodec?: string;
  extraArgs?: string[];
  /**
   * If provided, restricts the segments to this whitelist of region ids
   * regardless of the regions' `kept` flag. Lets the UI export a subset of
   * the kept regions without mutating the data model.
   */
  selectedIds?: ReadonlySet<string>;
}

export function buildFilterComplexExport(
  ctx: ExportContext,
  options: FilterComplexOptions,
): FilterComplexExport {
  const segments = pickSegments(ctx.regions, options.selectedIds);
  // hasVideo defaults to the source, but an audio-only preset overrides it.
  const sourceHasVideo = ctx.source.hasVideo;
  const sourceHasAudio = ctx.source.hasAudio;
  const wantVideo = (options.preset?.hasVideo ?? sourceHasVideo) && sourceHasVideo;
  const wantAudio = sourceHasAudio;
  if (segments.length === 0) {
    throw new Error('export: no segments selected');
  }
  if (!wantVideo && !wantAudio) {
    throw new Error('export: nothing to encode (source has no audio or video)');
  }

  const parts: string[] = [];
  const concatInputs: string[] = [];
  segments.forEach((r, i) => {
    const ss = r.start.toFixed(6);
    const ee = r.end.toFixed(6);
    if (wantVideo) {
      parts.push(`[0:v]trim=start=${ss}:end=${ee},setpts=PTS-STARTPTS[v${i}]`);
    }
    if (wantAudio) {
      parts.push(`[0:a]atrim=start=${ss}:end=${ee},asetpts=PTS-STARTPTS[a${i}]`);
    }
    if (wantVideo) concatInputs.push(`[v${i}]`);
    if (wantAudio) concatInputs.push(`[a${i}]`);
  });
  const vFlag = wantVideo ? 1 : 0;
  const aFlag = wantAudio ? 1 : 0;
  parts.push(
    `${concatInputs.join('')}concat=n=${segments.length}:v=${vFlag}:a=${aFlag}` +
      `${wantVideo ? '[v]' : ''}${wantAudio ? '[a]' : ''}`,
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
  const videoCodec = options.preset?.videoCodec ?? options.videoCodec ?? 'libx264';
  const audioCodec = options.preset?.audioCodec ?? options.audioCodec ?? 'aac';
  if (wantVideo) args.push('-map', '[v]', '-c:v', videoCodec);
  if (wantAudio) args.push('-map', '[a]', '-c:a', audioCodec);
  if (options.preset?.extraArgs) args.push(...options.preset.extraArgs);
  if (options.extraArgs) args.push(...options.extraArgs);
  args.push(options.outputPath);

  const outputDurationS = segments.reduce((acc, r) => acc + (r.end - r.start), 0);
  return { args, outputDurationS, segmentCount: segments.length };
}

function pickSegments(regions: Region[], selectedIds?: ReadonlySet<string>): Region[] {
  if (!selectedIds) return keptRegions(regions);
  return regions.filter((r) => selectedIds.has(r.id));
}
