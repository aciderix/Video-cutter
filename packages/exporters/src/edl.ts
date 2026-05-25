import { keptRegions } from '@snipvox/core';
import type { ExportContext } from './types.ts';
import { edlFcmLine, resolveOverlayClips, secondsToTimecode } from './types.ts';

/**
 * CMX 3600 EDL — the universal lingua franca of NLEs.
 * Imported by Premiere, Resolve, Avid, Final Cut, Vegas, etc.
 *
 * Reference: https://xmil.biz/EDL-X/CMX3600.pdf
 *
 * Multi-cam is not first-class in CMX 3600 — a single event line is one
 * source per track group. We emit the main cut on V/AA, then one extra
 * event per overlay clip on a dedicated audio track ("A3", "A4", …),
 * along with a comment line documenting the overlay's source file. If
 * the user expects a full multi-cam project they should pick FCPXML or
 * OTIO; we leave a comment to that effect when overlays are dropped.
 */
export function exportEDL(ctx: ExportContext): string {
  const kept = keptRegions(ctx.regions);
  const fps = ctx.source.videoStream?.frameRate ?? 30;
  const reelName = sanitizeReel(ctx.source.name);
  const lines: string[] = [];

  lines.push(`TITLE: ${ctx.projectName}`);
  lines.push(edlFcmLine(fps));
  lines.push('');

  let event = 0;
  let recordCursor = 0;
  kept.forEach((region, i) => {
    event += 1;
    const eventStr = String(event).padStart(3, '0');
    const srcIn = secondsToTimecode(region.start, fps);
    const srcOut = secondsToTimecode(region.end, fps);
    const recIn = secondsToTimecode(recordCursor, fps);
    const duration = region.end - region.start;
    const recOut = secondsToTimecode(recordCursor + duration, fps);
    recordCursor += duration;

    const track = ctx.source.hasVideo ? 'AA/V' : 'AA';
    lines.push(
      `${eventStr}  ${reelName} ${track}    C        ${srcIn} ${srcOut} ${recIn} ${recOut}`,
    );
    lines.push(`* FROM CLIP NAME: ${ctx.source.name} #${i + 1}`);
  });

  const overlays = (ctx.overlays ?? []).filter((o) => o.enabled && o.segments.length > 0);
  if (overlays.length > 0) {
    lines.push('');
    lines.push('* SNIPVOX MULTI-CAM OVERLAYS');
    if (overlays.length > 4) {
      lines.push(
        `* WARNING: ${overlays.length} overlays present; CMX 3600 only supports 4 audio channels. Use FCPXML or OTIO for the full mix.`,
      );
    }
    overlays.slice(0, 4).forEach((overlay, ovIdx) => {
      const ovReel = sanitizeReel(overlay.name);
      const audioTrack = `A${3 + ovIdx}`;
      const clips = resolveOverlayClips(overlay, ctx.regions);
      for (const c of clips) {
        event += 1;
        const eventStr = String(event).padStart(3, '0');
        const srcIn = secondsToTimecode(c.overlayStartS, fps);
        const srcOut = secondsToTimecode(c.overlayStartS + c.durationS, fps);
        const recIn = secondsToTimecode(c.outputStartS, fps);
        const recOut = secondsToTimecode(c.outputStartS + c.durationS, fps);
        lines.push(
          `${eventStr}  ${ovReel} ${audioTrack}      C        ${srcIn} ${srcOut} ${recIn} ${recOut}`,
        );
        lines.push(`* FROM CLIP NAME: ${overlay.name}`);
      }
    });
  }

  return lines.join('\n') + '\n';
}

function sanitizeReel(name: string): string {
  return name
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 8)
    .toUpperCase()
    .padEnd(8, ' ');
}
