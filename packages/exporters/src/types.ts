import type { MediaSource, Region } from '@snipvox/core';

export interface ExportContext {
  source: MediaSource;
  regions: Region[];
  projectName: string;
}

/**
 * Returns true when the given frame rate is one of the SMPTE drop-frame
 * variants (~29.97 or ~59.94). Drop-frame timecodes skip 2 frame numbers
 * at the start of every minute except every 10th to keep wall-clock
 * timecodes accurate on NTSC-derived rates.
 */
export function isDropFrame(frameRate: number): boolean {
  // Epsilon must be smaller than 0.03 so that exact 30 fps is *not* matched
  // against 29.97. The actual rate of NTSC is 30000/1001 ≈ 29.9700299700,
  // 0.005 covers any reasonable floating-point drift.
  return Math.abs(frameRate - 29.97) < 0.005 || Math.abs(frameRate - 59.94) < 0.005;
}

/**
 * Convert seconds to a SMPTE timecode. Picks the drop-frame separator (";")
 * for ~29.97/~59.94 sources and applies the SMPTE 12M-1 drop pattern. For
 * everything else (24, 25, 30, 50, 60, 23.976 — which uses NDF timecode by
 * convention) returns non-drop "HH:MM:SS:FF" with a "." second separator.
 */
export function secondsToTimecode(seconds: number, frameRate: number): string {
  if (isDropFrame(frameRate)) {
    return secondsToDropFrameTimecode(seconds, frameRate);
  }
  const fps = effectiveFps(frameRate);
  const totalFrames = Math.round(seconds * frameRate);
  const frames = totalFrames % fps;
  const totalSeconds = Math.floor(totalFrames / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600);
  return `${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(frames)}`;
}

/** Drop-frame timecode (SMPTE 12M-1) for 29.97 and 59.94. */
export function secondsToDropFrameTimecode(seconds: number, frameRate: number): string {
  const fps = effectiveFps(frameRate);
  const dropFrames = fps === 60 ? 4 : 2; // 29.97 drops 2, 59.94 drops 4
  let frameNumber = Math.round(seconds * frameRate);

  // Apply drop-frame correction.
  const framesPerTenMinutes = Math.round(frameRate * 60 * 10);
  const framesPerMinute = fps * 60 - dropFrames;
  const d = Math.floor(frameNumber / framesPerTenMinutes);
  const m = frameNumber % framesPerTenMinutes;
  if (m > dropFrames) {
    frameNumber += dropFrames * 9 * d + dropFrames * Math.floor((m - dropFrames) / framesPerMinute);
  } else {
    frameNumber += dropFrames * 9 * d;
  }

  const frames = frameNumber % fps;
  const totalSeconds = Math.floor(frameNumber / fps);
  const ss = totalSeconds % 60;
  const mm = Math.floor(totalSeconds / 60) % 60;
  const hh = Math.floor(totalSeconds / 3600) % 24;
  return `${pad(hh)}:${pad(mm)}:${pad(ss)};${pad(frames)}`;
}

/** FCM line for EDL: NTSC-rate timelines are DROP FRAME, others NON-DROP. */
export function edlFcmLine(frameRate: number): string {
  return isDropFrame(frameRate) ? 'FCM: DROP FRAME' : 'FCM: NON-DROP FRAME';
}

/**
 * The effective frame counter for the timecode grid. 29.97 uses a 30-grid
 * with drop-frames; 23.976 uses a 24-grid (NDF by convention).
 */
function effectiveFps(frameRate: number): number {
  if (Math.abs(frameRate - 23.976) < 0.005) return 24;
  if (Math.abs(frameRate - 29.97) < 0.005) return 30;
  if (Math.abs(frameRate - 59.94) < 0.005) return 60;
  return Math.round(frameRate);
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

/**
 * Convert a filesystem path into a `file://` URI with percent-encoded
 * segments. Required for FCPXML and OTIO consumers that reject unencoded
 * spaces / unicode.
 */
export function toFileUri(path: string): string {
  // Normalize Windows path separators while preserving the leading drive.
  const normalized = path.replace(/\\/g, '/');
  // Split by "/" so we percent-encode each segment but keep separators.
  const encoded = normalized
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/');
  return normalized.startsWith('/') ? `file://${encoded}` : `file:///${encoded}`;
}
