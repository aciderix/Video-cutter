import { keptRegions } from '@quietcut/core';
import type { ExportContext } from './types.ts';
import { escapeXml } from './types.ts';

/**
 * FCPXML 1.10 — Final Cut Pro X format.
 * Also imported by DaVinci Resolve and (via plugins) Premiere Pro.
 *
 * Time is expressed as rational fractions (numerator/denominator s) using the
 * sequence frame duration as the time base.
 */
export function exportFCPXML(ctx: ExportContext): string {
  const kept = keptRegions(ctx.regions);
  const fps = ctx.source.videoStream?.frameRate ?? 30;
  const width = ctx.source.videoStream?.width ?? 1920;
  const height = ctx.source.videoStream?.height ?? 1080;
  const frameDuration = formatFrameDuration(fps);
  const assetId = 'r1';
  const formatId = 'r2';

  let timeline = '';
  let recordCursor = 0;
  kept.forEach((region, i) => {
    const offset = formatTime(recordCursor, fps);
    const start = formatTime(region.start, fps);
    const dur = formatTime(region.end - region.start, fps);
    recordCursor += region.end - region.start;
    timeline += `          <asset-clip name="${escapeXml(ctx.source.name)} #${i + 1}" ref="${assetId}" offset="${offset}" start="${start}" duration="${dur}" tcFormat="NDF"/>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="${formatId}" name="FFVideoFormat${width}x${height}p${fps}" frameDuration="${frameDuration}" width="${width}" height="${height}"/>
    <asset id="${assetId}" name="${escapeXml(ctx.source.name)}" src="${escapeXml(toFileUri(ctx.source.path))}" start="0s" duration="${formatTime(ctx.source.duration, fps)}" hasVideo="${ctx.source.hasVideo ? '1' : '0'}" hasAudio="${ctx.source.hasAudio ? '1' : '0'}" format="${formatId}"/>
  </resources>
  <library>
    <event name="${escapeXml(ctx.projectName)}">
      <project name="${escapeXml(ctx.projectName)}">
        <sequence format="${formatId}" tcStart="0s" tcFormat="NDF">
          <spine>
${timeline}          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`;
}

function formatFrameDuration(fps: number): string {
  if (Math.abs(fps - 23.976) < 0.01) return '1001/24000s';
  if (Math.abs(fps - 29.97) < 0.01) return '1001/30000s';
  if (Math.abs(fps - 59.94) < 0.01) return '1001/60000s';
  return `1/${Math.round(fps)}s`;
}

function formatTime(seconds: number, fps: number): string {
  const frames = Math.round(seconds * fps);
  const fpsRound = Math.round(fps);
  return `${frames}/${fpsRound}s`;
}

function toFileUri(path: string): string {
  if (path.startsWith('file://')) return path;
  if (/^[A-Za-z]:[\\/]/.test(path)) {
    return 'file:///' + path.replace(/\\/g, '/');
  }
  return 'file://' + path;
}
