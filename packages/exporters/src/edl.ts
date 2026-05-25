import { keptRegions } from '@snipvox/core';
import type { ExportContext } from './types.ts';
import { edlFcmLine, secondsToTimecode } from './types.ts';

/**
 * CMX 3600 EDL — the universal lingua franca of NLEs.
 * Imported by Premiere, Resolve, Avid, Final Cut, Vegas, etc.
 *
 * Reference: https://xmil.biz/EDL-X/CMX3600.pdf
 */
export function exportEDL(ctx: ExportContext): string {
  const kept = keptRegions(ctx.regions);
  const fps = ctx.source.videoStream?.frameRate ?? 30;
  const reelName = sanitizeReel(ctx.source.name);
  const lines: string[] = [];

  lines.push(`TITLE: ${ctx.projectName}`);
  lines.push(edlFcmLine(fps));
  lines.push('');

  let recordCursor = 0;
  kept.forEach((region, i) => {
    const event = String(i + 1).padStart(3, '0');
    const srcIn = secondsToTimecode(region.start, fps);
    const srcOut = secondsToTimecode(region.end, fps);
    const recIn = secondsToTimecode(recordCursor, fps);
    const duration = region.end - region.start;
    const recOut = secondsToTimecode(recordCursor + duration, fps);
    recordCursor += duration;

    const track = ctx.source.hasVideo ? 'AA/V' : 'AA';
    lines.push(`${event}  ${reelName} ${track}    C        ${srcIn} ${srcOut} ${recIn} ${recOut}`);
    lines.push(`* FROM CLIP NAME: ${ctx.source.name}`);
  });

  return lines.join('\n') + '\n';
}

function sanitizeReel(name: string): string {
  return name
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 8)
    .toUpperCase()
    .padEnd(8, ' ');
}
