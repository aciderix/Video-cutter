import type { Region, Seconds, SilenceDetectionSettings } from '../types.ts';

/**
 * Raw silence interval as detected by an analyzer (FFmpeg silencedetect or native).
 */
export interface RawSilenceInterval {
  start: Seconds;
  end: Seconds;
}

/**
 * Turns raw silence intervals into a Region[] covering the full media duration,
 * applying padding and minimum-keep rules. The result is contiguous and
 * non-overlapping: every second of the source falls into exactly one region.
 */
export function buildRegionsFromSilences(
  totalDuration: Seconds,
  silences: RawSilenceInterval[],
  settings: SilenceDetectionSettings,
): Region[] {
  const paddingS = settings.paddingMs / 1000;
  const minKeepS = settings.minKeepDurationMs / 1000;

  const padded = silences
    .map((s) => ({
      start: Math.max(0, s.start + paddingS),
      end: Math.min(totalDuration, s.end - paddingS),
    }))
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start);

  const merged: RawSilenceInterval[] = [];
  for (const s of padded) {
    const last = merged[merged.length - 1];
    if (last && s.start <= last.end) {
      last.end = Math.max(last.end, s.end);
    } else {
      merged.push({ ...s });
    }
  }

  const regions: Region[] = [];
  let cursor: Seconds = 0;
  let idx = 0;

  for (const silence of merged) {
    if (silence.start > cursor) {
      regions.push({
        id: `r${idx++}`,
        start: cursor,
        end: silence.start,
        kept: true,
        source: 'detected',
      });
    }
    regions.push({
      id: `r${idx++}`,
      start: silence.start,
      end: silence.end,
      kept: false,
      source: 'detected',
    });
    cursor = silence.end;
  }

  if (cursor < totalDuration) {
    regions.push({
      id: `r${idx++}`,
      start: cursor,
      end: totalDuration,
      kept: true,
      source: 'detected',
    });
  }

  return enforceMinKeep(regions, minKeepS);
}

function enforceMinKeep(regions: Region[], minKeepS: Seconds): Region[] {
  return regions.map((r) => {
    if (r.kept && r.end - r.start < minKeepS) {
      return { ...r, kept: false };
    }
    return r;
  });
}

/**
 * Returns only the kept regions, ready for export/cut.
 */
export function keptRegions(regions: Region[]): Region[] {
  return regions.filter((r) => r.kept);
}

/**
 * Total duration after cuts.
 */
export function outputDuration(regions: Region[]): Seconds {
  return keptRegions(regions).reduce((acc, r) => acc + (r.end - r.start), 0);
}
