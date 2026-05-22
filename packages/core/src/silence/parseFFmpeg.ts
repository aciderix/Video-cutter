import type { RawSilenceInterval } from './index.ts';

/**
 * Parse the stderr output of `ffmpeg -af silencedetect=...` into raw intervals.
 *
 * FFmpeg emits lines like:
 *   [silencedetect @ 0x...] silence_start: 12.345
 *   [silencedetect @ 0x...] silence_end: 13.987 | silence_duration: 1.642
 *
 * If the file ends while silent, no silence_end line is emitted; callers must
 * pass `totalDuration` to close the last interval.
 */
export function parseSilenceDetect(stderr: string, totalDuration: number): RawSilenceInterval[] {
  const startRe = /silence_start:\s*(-?\d+(?:\.\d+)?)/g;
  const endRe = /silence_end:\s*(-?\d+(?:\.\d+)?)/g;

  const starts: number[] = [];
  const ends: number[] = [];

  let m: RegExpExecArray | null;
  while ((m = startRe.exec(stderr)) !== null) starts.push(Number(m[1]));
  while ((m = endRe.exec(stderr)) !== null) ends.push(Number(m[1]));

  const intervals: RawSilenceInterval[] = [];
  for (let i = 0; i < starts.length; i++) {
    const start = Math.max(0, starts[i]!);
    const end = i < ends.length ? ends[i]! : totalDuration;
    if (end > start) intervals.push({ start, end });
  }
  return intervals;
}
