import { describe, expect, it } from 'vitest';
import {
  PROJECT_FILE_VERSION,
  createEmptyProject,
  parseProject,
  serializeProject,
} from './index.ts';

describe('project file', () => {
  it('creates an empty v2 project', () => {
    const p = createEmptyProject('Demo');
    expect(p.version).toBe(2);
    expect(p.name).toBe('Demo');
    expect(p.sources).toEqual([]);
    expect(p.overlaysBySource).toEqual({});
  });

  it('round-trips a v2 project', () => {
    const p = createEmptyProject('Demo');
    p.overlaysBySource = {
      src1: [
        {
          id: 'ov1',
          name: 'clean.wav',
          path: '/tmp/clean.wav',
          durationS: 10,
          sampleRate: 48000,
          channels: 1,
          enabled: true,
          globalOffsetS: 2.5,
          globalConfidence: 0.7,
          segments: [
            {
              candidateStartS: 0,
              candidateEndS: 5,
              referenceStartS: 2.5,
              referenceEndS: 7.5,
              confidence: 0.7,
            },
          ],
        },
      ],
    };
    const json = serializeProject(p);
    const back = parseProject(json);
    expect(back.overlaysBySource?.src1).toHaveLength(1);
    expect(back.overlaysBySource?.src1?.[0]?.path).toBe('/tmp/clean.wav');
    expect(back.overlaysBySource?.src1?.[0]?.segments[0]?.confidence).toBeCloseTo(0.7);
  });

  it('migrates v1 files to v2 by adding empty overlays map', () => {
    const v1 = {
      version: 1,
      name: 'Old',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      sources: [],
      regionsBySource: {},
      detectionSettings: {
        thresholdDb: -30,
        minSilenceDurationMs: 500,
        paddingMs: 100,
        minKeepDurationMs: 100,
      },
    };
    const parsed = parseProject(JSON.stringify(v1));
    expect(parsed.version).toBe(PROJECT_FILE_VERSION);
    expect(parsed.overlaysBySource).toEqual({});
  });

  it('rejects unknown versions', () => {
    const future = { version: 99, name: 'x' };
    expect(() => parseProject(JSON.stringify(future))).toThrow(/Unsupported project version/);
  });
});
