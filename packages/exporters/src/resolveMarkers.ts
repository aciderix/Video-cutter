import type { ExportContext } from './types.ts';
import { secondsToTimecode } from './types.ts';

/**
 * DaVinci Resolve marker import format (tab-separated).
 * Useful when the user wants to keep the original timeline but jump to cuts.
 */
export function exportResolveMarkers(ctx: ExportContext): string {
  const fps = ctx.source.videoStream?.frameRate ?? 30;
  const header = ['#', 'Marker Name', 'Description', 'In', 'Out', 'Duration', 'Marker Type'];
  const rows: string[][] = [header];

  ctx.regions
    .filter((r) => !r.kept)
    .forEach((r, i) => {
      rows.push([
        String(i + 1),
        `Silence ${i + 1}`,
        '',
        secondsToTimecode(r.start, fps),
        secondsToTimecode(r.end, fps),
        secondsToTimecode(r.end - r.start, fps),
        'Red',
      ]);
    });

  return rows.map((row) => row.join('\t')).join('\n') + '\n';
}
