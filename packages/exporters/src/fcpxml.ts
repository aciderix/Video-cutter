import { keptRegions } from '@snipvox/core';
import type { CleanAudioOverlay } from '@snipvox/core';
import type { ExportContext } from './types.ts';
import { escapeXml, isDropFrame, resolveOverlayClips, toFileUri } from './types.ts';

/**
 * FCPXML 1.10 — Final Cut Pro X format.
 * Also imported by DaVinci Resolve and (via plugins) Premiere Pro.
 *
 * Time is expressed as rational fractions (numerator/denominator s) using the
 * sequence frame duration as the time base.
 *
 * Multi-cam overlays (lavalier / B-cam audio + video) ride on connected
 * clips attached to the main spine. Audio-only overlays land on negative
 * lanes (-1, -2, …), video-bearing overlays on positive lanes (1, 2, …).
 */
export function exportFCPXML(ctx: ExportContext): string {
  const fps = ctx.source.videoStream?.frameRate ?? 30;
  const width = ctx.source.videoStream?.width ?? 1920;
  const height = ctx.source.videoStream?.height ?? 1080;
  const frameDuration = formatFrameDuration(fps);
  const formatId = 'r0';
  const mainAssetId = 'r1';

  const overlays = (ctx.overlays ?? []).filter((o) => o.enabled && o.segments.length > 0);
  // Stable per-overlay asset id starting at r2 so existing single-source
  // consumers see no diff when no overlays are present.
  const overlayAssetIds = new Map<string, string>();
  overlays.forEach((o, i) => overlayAssetIds.set(o.id, `r${i + 2}`));

  // Spine = the kept cuts of the main camera, back-to-back.
  const kept = keptRegions(ctx.regions);
  const spineLines: string[] = [];
  let recordCursor = 0;
  kept.forEach((region, i) => {
    const offset = formatTime(recordCursor, fps);
    const start = formatTime(region.start, fps);
    const dur = formatTime(region.end - region.start, fps);
    recordCursor += region.end - region.start;
    spineLines.push(
      `          <asset-clip name="${escapeXml(ctx.source.name)} #${i + 1}" ref="${mainAssetId}" offset="${offset}" start="${start}" duration="${dur}" tcFormat="${isDropFrame(fps) ? 'DF' : 'NDF'}"/>`,
    );
  });

  // Connected overlay clips. Each overlay gets a single lane; multiple
  // aligned segments stack on that lane sequentially. Lanes are signed to
  // tell FCP where to place the strip: positive = above the spine
  // (picture-in-picture style), negative = below (extra audio).
  let videoLane = 0;
  let audioLane = 0;
  const overlayClipLines: string[] = [];
  for (const overlay of overlays) {
    const ref = overlayAssetIds.get(overlay.id)!;
    const lane = overlay.hasVideo ? ++videoLane : -++audioLane;
    const clips = resolveOverlayClips(overlay, ctx.regions);
    for (let i = 0; i < clips.length; i++) {
      const c = clips[i]!;
      overlayClipLines.push(
        `          <asset-clip name="${escapeXml(overlay.name)} #${i + 1}" lane="${lane}" ref="${ref}" offset="${formatTime(c.outputStartS, fps)}" start="${formatTime(c.overlayStartS, fps)}" duration="${formatTime(c.durationS, fps)}" tcFormat="${isDropFrame(fps) ? 'DF' : 'NDF'}"/>`,
      );
    }
  }

  const overlayAssets = overlays
    .map((o) => formatOverlayAsset(o, overlayAssetIds.get(o.id)!, formatId, fps))
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="${formatId}" name="FFVideoFormat${width}x${height}p${fps}" frameDuration="${frameDuration}" width="${width}" height="${height}"/>
    <asset id="${mainAssetId}" name="${escapeXml(ctx.source.name)}" src="${escapeXml(toFileUri(ctx.source.path))}" start="0s" duration="${formatTime(ctx.source.duration, fps)}" hasVideo="${ctx.source.hasVideo ? '1' : '0'}" hasAudio="${ctx.source.hasAudio ? '1' : '0'}" format="${formatId}"/>${overlayAssets ? '\n' + overlayAssets : ''}
  </resources>
  <library>
    <event name="${escapeXml(ctx.projectName)}">
      <project name="${escapeXml(ctx.projectName)}">
        <sequence format="${formatId}" tcStart="0s" tcFormat="${isDropFrame(fps) ? 'DF' : 'NDF'}">
          <spine>
${spineLines.join('\n')}${overlayClipLines.length > 0 ? '\n' + overlayClipLines.join('\n') : ''}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>
`;
}

function formatOverlayAsset(
  overlay: CleanAudioOverlay,
  assetId: string,
  formatId: string,
  fps: number,
): string {
  const hasVideo = overlay.hasVideo ? '1' : '0';
  // Every overlay we resolve here carries a decoded audio stream by
  // construction (alignment runs on samples), so hasAudio is always 1.
  return `    <asset id="${assetId}" name="${escapeXml(overlay.name)}" src="${escapeXml(toFileUri(overlay.path))}" start="0s" duration="${formatTime(overlay.durationS, fps)}" hasVideo="${hasVideo}" hasAudio="1" format="${formatId}"/>`;
}

function formatFrameDuration(fps: number): string {
  if (Math.abs(fps - 23.976) < 0.01) return '1001/24000s';
  if (Math.abs(fps - 29.97) < 0.01) return '1001/30000s';
  if (Math.abs(fps - 59.94) < 0.01) return '1001/60000s';
  return `1/${Math.round(fps)}s`;
}

function formatTime(seconds: number, fps: number): string {
  // FCPXML "rational" time: use a denominator that matches the declared
  // frameDuration so 29.97 / 23.976 sequences stay aligned. The numerator
  // is then `seconds * denominator` rounded to the nearest integer.
  if (Math.abs(fps - 23.976) < 0.01) {
    const num = Math.round(seconds * 24000);
    return `${num}/24000s`;
  }
  if (Math.abs(fps - 29.97) < 0.01) {
    const num = Math.round(seconds * 30000);
    return `${num}/30000s`;
  }
  if (Math.abs(fps - 59.94) < 0.01) {
    const num = Math.round(seconds * 60000);
    return `${num}/60000s`;
  }
  const fpsRound = Math.round(fps);
  const frames = Math.round(seconds * fpsRound);
  return `${frames}/${fpsRound}s`;
}
