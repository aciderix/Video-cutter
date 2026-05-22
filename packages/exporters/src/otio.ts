import { keptRegions } from '@quietcut/core';
import type { ExportContext } from './types.ts';

/**
 * OpenTimelineIO (OTIO) JSON — Pixar's open universal interchange format.
 * Native or plugin support in Resolve, Premiere, Flame, Hiero, Kdenlive, etc.
 *
 * Reference: https://opentimelineio.readthedocs.io/
 */
export function exportOTIO(ctx: ExportContext): string {
  const fps = ctx.source.videoStream?.frameRate ?? 30;
  const kept = keptRegions(ctx.regions);

  const clips = kept.map((region, i) => ({
    OTIO_SCHEMA: 'Clip.2',
    name: `${ctx.source.name} #${i + 1}`,
    source_range: rationalRange(region.start, region.end - region.start, fps),
    media_reference: {
      OTIO_SCHEMA: 'ExternalReference.1',
      target_url: toFileUri(ctx.source.path),
      available_range: rationalRange(0, ctx.source.duration, fps),
    },
  }));

  const tracks = [
    {
      OTIO_SCHEMA: 'Track.1',
      name: 'V1',
      kind: 'Video',
      children: clips,
    },
  ];

  if (ctx.source.hasAudio) {
    tracks.push({
      OTIO_SCHEMA: 'Track.1',
      name: 'A1',
      kind: 'Audio',
      children: clips.map((c) => ({ ...c })),
    });
  }

  const timeline = {
    OTIO_SCHEMA: 'Timeline.1',
    name: ctx.projectName,
    global_start_time: rationalTime(0, fps),
    tracks: {
      OTIO_SCHEMA: 'Stack.1',
      name: 'tracks',
      children: tracks,
    },
  };

  return JSON.stringify(timeline, null, 2);
}

function rationalTime(seconds: number, fps: number) {
  return {
    OTIO_SCHEMA: 'RationalTime.1',
    rate: fps,
    value: seconds * fps,
  };
}

function rationalRange(start: number, duration: number, fps: number) {
  return {
    OTIO_SCHEMA: 'TimeRange.1',
    start_time: rationalTime(start, fps),
    duration: rationalTime(duration, fps),
  };
}

function toFileUri(path: string): string {
  if (path.startsWith('file://')) return path;
  if (/^[A-Za-z]:[\\/]/.test(path)) {
    return 'file:///' + path.replace(/\\/g, '/');
  }
  return 'file://' + path;
}
