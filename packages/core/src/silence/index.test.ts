import { describe, expect, it } from 'vitest';
import { buildRegionsFromSilences, keptRegions, outputDuration } from './index.ts';
import { parseSilenceDetect } from './parseFFmpeg.ts';

const settings = {
  thresholdDb: -30,
  minSilenceDurationMs: 500,
  paddingMs: 0,
  minKeepDurationMs: 0,
};

describe('buildRegionsFromSilences', () => {
  it('produces alternating kept/dropped regions covering the full duration', () => {
    const regions = buildRegionsFromSilences(
      10,
      [
        { start: 2, end: 3 },
        { start: 6, end: 7 },
      ],
      settings,
    );

    expect(regions.map((r) => [r.start, r.end, r.kept])).toEqual([
      [0, 2, true],
      [2, 3, false],
      [3, 6, true],
      [6, 7, false],
      [7, 10, true],
    ]);
  });

  it('returns a single kept region when there is no silence', () => {
    const regions = buildRegionsFromSilences(10, [], settings);
    expect(regions).toEqual([expect.objectContaining({ start: 0, end: 10, kept: true })]);
  });

  it('merges overlapping silences after padding', () => {
    const regions = buildRegionsFromSilences(
      10,
      [
        { start: 2, end: 4 },
        { start: 3, end: 5 },
      ],
      settings,
    );
    const dropped = regions.filter((r) => !r.kept);
    expect(dropped).toHaveLength(1);
    expect(dropped[0]).toMatchObject({ start: 2, end: 5 });
  });

  it('applies padding to shrink silence intervals', () => {
    const regions = buildRegionsFromSilences(10, [{ start: 2, end: 5 }], {
      ...settings,
      paddingMs: 200,
    });
    const dropped = regions.find((r) => !r.kept)!;
    expect(dropped.start).toBeCloseTo(2.2);
    expect(dropped.end).toBeCloseTo(4.8);
  });
});

describe('outputDuration', () => {
  it('sums kept region durations', () => {
    const regions = buildRegionsFromSilences(10, [{ start: 2, end: 5 }], settings);
    expect(outputDuration(regions)).toBeCloseTo(7);
    expect(keptRegions(regions)).toHaveLength(2);
  });
});

describe('parseSilenceDetect', () => {
  it('parses ffmpeg silencedetect output', () => {
    const stderr = `
[silencedetect @ 0x1] silence_start: 1.234
[silencedetect @ 0x1] silence_end: 2.345 | silence_duration: 1.111
[silencedetect @ 0x1] silence_start: 5.0
[silencedetect @ 0x1] silence_end: 6.5 | silence_duration: 1.5
`;
    expect(parseSilenceDetect(stderr, 10)).toEqual([
      { start: 1.234, end: 2.345 },
      { start: 5.0, end: 6.5 },
    ]);
  });

  it('closes a trailing silence using totalDuration', () => {
    const stderr = `[silencedetect @ 0x1] silence_start: 8.0`;
    expect(parseSilenceDetect(stderr, 10)).toEqual([{ start: 8.0, end: 10 }]);
  });
});
