import { keptRegions } from '@snipvox/core';
import type { CleanAudioOverlay } from '@snipvox/core';
import type { ExportContext } from './types.ts';
import { resolveOverlayClips, toFileUri } from './types.ts';

/**
 * OpenTimelineIO (OTIO) JSON — Pixar's open universal interchange format.
 * Native or plugin support in Resolve, Premiere, Flame, Hiero, Kdenlive, etc.
 *
 * Reference: https://opentimelineio.readthedocs.io/
 *
 * Multi-cam: each enabled overlay becomes an extra Track (Video or Audio
 * depending on `hasVideo`). Overlay clips sit at the cut-timeline offsets
 * computed by `resolveOverlayClips`; gaps between overlay clips are
 * filled with OTIO Gap items so the NLE keeps the absolute positions.
 */
export function exportOTIO(ctx: ExportContext): string {
  const fps = ctx.source.videoStream?.frameRate ?? 30;
  const kept = keptRegions(ctx.regions);
  const outputDuration = kept.reduce((acc, r) => acc + (r.end - r.start), 0);

  const mainClips = kept.map((region, i) => ({
    OTIO_SCHEMA: 'Clip.2',
    name: `${ctx.source.name} #${i + 1}`,
    source_range: rationalRange(region.start, region.end - region.start, fps),
    media_reference: {
      OTIO_SCHEMA: 'ExternalReference.1',
      target_url: toFileUri(ctx.source.path),
      available_range: rationalRange(0, ctx.source.duration, fps),
    },
  }));

  const tracks: Record<string, unknown>[] = [
    {
      OTIO_SCHEMA: 'Track.1',
      name: 'V1',
      kind: 'Video',
      children: mainClips,
    },
  ];

  if (ctx.source.hasAudio) {
    tracks.push({
      OTIO_SCHEMA: 'Track.1',
      name: 'A1',
      kind: 'Audio',
      children: mainClips.map((c) => structuredClone(c)),
    });
  }

  const overlays = (ctx.overlays ?? []).filter((o) => o.enabled && o.segments.length > 0);
  let videoIdx = 1;
  let audioIdx = ctx.source.hasAudio ? 2 : 1;
  for (const overlay of overlays) {
    const isVideo = !!overlay.hasVideo;
    const trackKind = isVideo ? 'Video' : 'Audio';
    const trackName = isVideo ? `V${++videoIdx}` : `A${audioIdx++}`;
    tracks.push(buildOverlayTrack(overlay, trackKind, trackName, ctx.regions, outputDuration, fps));
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

function buildOverlayTrack(
  overlay: CleanAudioOverlay,
  kind: 'Video' | 'Audio',
  name: string,
  regions: ExportContext['regions'],
  outputDuration: number,
  fps: number,
) {
  const clips = resolveOverlayClips(overlay, regions);
  const children: Record<string, unknown>[] = [];
  let cursor = 0;
  for (let i = 0; i < clips.length; i++) {
    const c = clips[i]!;
    if (c.outputStartS > cursor + 1e-6) {
      children.push(buildGap(c.outputStartS - cursor, fps));
    }
    children.push({
      OTIO_SCHEMA: 'Clip.2',
      name: `${overlay.name} #${i + 1}`,
      source_range: rationalRange(c.overlayStartS, c.durationS, fps),
      media_reference: {
        OTIO_SCHEMA: 'ExternalReference.1',
        target_url: toFileUri(overlay.path),
        available_range: rationalRange(0, overlay.durationS, fps),
      },
    });
    cursor = c.outputStartS + c.durationS;
  }
  // Pad the trailing gap so the overlay track matches the timeline length.
  if (cursor < outputDuration - 1e-6) {
    children.push(buildGap(outputDuration - cursor, fps));
  }
  return {
    OTIO_SCHEMA: 'Track.1',
    name,
    kind,
    children,
  };
}

function buildGap(durationS: number, fps: number) {
  return {
    OTIO_SCHEMA: 'Gap.1',
    name: 'Gap',
    source_range: rationalRange(0, durationS, fps),
  };
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
