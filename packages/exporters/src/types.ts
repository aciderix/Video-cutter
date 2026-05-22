import type { MediaSource, Region } from '@quietcut/core';

export interface ExportContext {
  source: MediaSource;
  regions: Region[];
  projectName: string;
}

export function secondsToTimecode(seconds: number, frameRate: number): string {
  const totalFrames = Math.round(seconds * frameRate);
  const fps = Math.round(frameRate);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(frames)}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
