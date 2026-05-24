import { describe, expect, it } from 'vitest';
import type { MediaSource, Region } from '@quietcut/core';
import type { CleanAudioOverlay } from '@quietcut/core';
import {
  FILTER_COMPLEX_SEGMENT_THRESHOLD,
  FORMAT_PRESETS,
  buildFFmpegConcatList,
  buildFFmpegSegmentCommands,
  buildFilterComplexExport,
  buildOverlayExport,
  buildPerRegionExport,
  buildSegmentedExport,
  defaultPresetFor,
  exportEDL,
  exportFCPXML,
  exportOTIO,
  exportResolveMarkers,
  findPreset,
} from './index.ts';
import {
  edlFcmLine,
  isDropFrame,
  secondsToDropFrameTimecode,
  secondsToTimecode,
  toFileUri,
} from './types.ts';

const source: MediaSource = {
  id: 'src1',
  path: '/tmp/clip.mp4',
  name: 'clip.mp4',
  duration: 10,
  hasVideo: true,
  hasAudio: true,
  videoStream: { width: 1920, height: 1080, frameRate: 30, codec: 'h264' },
  audioStream: { sampleRate: 48000, channels: 2, codec: 'aac' },
};

const regions: Region[] = [
  { id: '1', start: 0, end: 2, kept: true, source: 'detected' },
  { id: '2', start: 2, end: 3, kept: false, source: 'detected' },
  { id: '3', start: 3, end: 6, kept: true, source: 'detected' },
  { id: '4', start: 6, end: 7, kept: false, source: 'detected' },
  { id: '5', start: 7, end: 10, kept: true, source: 'detected' },
];

const ctx = { source, regions, projectName: 'Test' };

describe('exporters', () => {
  it('produces a valid CMX 3600 EDL with one event per kept region', () => {
    const edl = exportEDL(ctx);
    expect(edl).toContain('TITLE: Test');
    expect(edl).toContain('FCM: NON-DROP FRAME');
    expect(edl.match(/^001 /m)).toBeTruthy();
    expect(edl.match(/^003 /m)).toBeTruthy();
    expect(edl).not.toMatch(/^004 /m);
  });

  it('produces FCPXML with one asset-clip per kept region', () => {
    const xml = exportFCPXML(ctx);
    expect(xml).toContain('<fcpxml version="1.10">');
    expect((xml.match(/<asset-clip /g) ?? []).length).toBe(3);
    expect(xml).toContain('frameDuration="1/30s"');
  });

  it('produces OTIO JSON with one clip per kept region in each track', () => {
    const json = JSON.parse(exportOTIO(ctx));
    expect(json.OTIO_SCHEMA).toBe('Timeline.1');
    expect(json.tracks.children).toHaveLength(2);
    expect(json.tracks.children[0].children).toHaveLength(3);
  });

  it('produces Resolve markers only for dropped regions', () => {
    const tsv = exportResolveMarkers(ctx);
    const dataLines = tsv.trim().split('\n').slice(1);
    expect(dataLines).toHaveLength(2);
    expect(dataLines[0]).toContain('Silence 1');
  });
});

describe('FFmpeg builders', () => {
  it('builds a filter_complex re-encode command for kept regions', () => {
    const out = buildFilterComplexExport(ctx, { outputPath: '/tmp/out.mp4' });
    expect(out.segmentCount).toBe(3);
    expect(out.outputDurationS).toBe(8);
    const i = out.args.indexOf('-filter_complex');
    expect(i).toBeGreaterThan(0);
    const fc = out.args[i + 1]!;
    expect(fc).toContain('[0:v]trim=start=0.000000:end=2.000000');
    expect(fc).toContain('concat=n=3:v=1:a=1');
    expect(out.args).toContain('libx264');
    expect(out.args).toContain('aac');
    expect(out.args[out.args.length - 1]).toBe('/tmp/out.mp4');
  });

  it('builds per-segment commands and a concat list', () => {
    const cmds = buildFFmpegSegmentCommands(
      { ...ctx, regions },
      { streamCopy: true, outDir: '/tmp', basename: 'clip', extension: '.mp4' },
    );
    expect(cmds).toHaveLength(3);
    expect(cmds[0]?.outputPath).toBe('/tmp/clip_001.mp4');
    expect(cmds[0]?.args).toContain('-c');
    expect(cmds[0]?.args).toContain('copy');
    const list = buildFFmpegConcatList(cmds.map((c) => c.outputPath));
    expect(list).toContain("file '/tmp/clip_001.mp4'");
    expect(list.trim().split('\n')).toHaveLength(3);
  });

  it('builds a segmented export plan with concat list and tmp paths', () => {
    const plan = buildSegmentedExport(ctx, {
      outputPath: '/out/final.mp4',
      tmpDir: '/tmp',
      extension: '.mp4',
      streamCopy: true,
    });
    expect(plan.segments).toHaveLength(3);
    expect(plan.outputDurationS).toBe(8);
    expect(plan.segments[0]?.tmpPath).toMatch(/qc_seg_00001\.mp4$/);
    expect(plan.concatListContent.trim().split('\n')).toHaveLength(3);
    expect(plan.concatArgs).toContain('-f');
    expect(plan.concatArgs).toContain('concat');
    expect(plan.concatArgs[plan.concatArgs.length - 1]).toBe('/out/final.mp4');
  });

  it('escapes single quotes in concat list paths', () => {
    const plan = buildSegmentedExport(
      { ...ctx, source: { ...source, path: "/tmp/dir with 'quote'/clip.mp4" } },
      { outputPath: '/out/o.mp4', tmpDir: "/tmp/won't", extension: '.mp4' },
    );
    expect(plan.concatListContent).toContain("\\'");
  });

  it('has a sensible filter_complex threshold', () => {
    expect(FILTER_COMPLEX_SEGMENT_THRESHOLD).toBeGreaterThan(10);
    expect(FILTER_COMPLEX_SEGMENT_THRESHOLD).toBeLessThan(500);
  });
});

describe('timecode helpers', () => {
  it('flags drop-frame rates', () => {
    expect(isDropFrame(29.97)).toBe(true);
    expect(isDropFrame(59.94)).toBe(true);
    expect(isDropFrame(30)).toBe(false);
    expect(isDropFrame(24)).toBe(false);
    expect(isDropFrame(23.976)).toBe(false);
  });

  it('emits non-drop timecodes at integer rates', () => {
    expect(secondsToTimecode(0, 24)).toBe('00:00:00:00');
    expect(secondsToTimecode(1.5, 30)).toBe('00:00:01:15');
    expect(secondsToTimecode(3600, 24)).toBe('01:00:00:00');
  });

  it('emits drop-frame timecodes with ;', () => {
    // SMPTE 12M: 60 real-time seconds = frame 1798, which displays as
    // 00:00:59;28 in DF (the drops have not yet caught up).
    expect(secondsToDropFrameTimecode(60, 29.97)).toBe('00:00:59;28');
    // 1 hour of 29.97 wall-clock is 107892 frames = "01:00:00;00" in DF.
    expect(secondsToDropFrameTimecode(3600, 29.97)).toBe('01:00:00;00');
  });

  it('EDL FCM line picks drop vs non-drop', () => {
    expect(edlFcmLine(29.97)).toBe('FCM: DROP FRAME');
    expect(edlFcmLine(30)).toBe('FCM: NON-DROP FRAME');
    expect(edlFcmLine(23.976)).toBe('FCM: NON-DROP FRAME');
  });

  it('percent-encodes file URIs', () => {
    expect(toFileUri('/tmp/clip with space.mp4')).toBe('file:///tmp/clip%20with%20space.mp4');
    expect(toFileUri('/tmp/clí?p.mp4')).toBe('file:///tmp/cl%C3%AD%3Fp.mp4');
    expect(toFileUri('C:\\Users\\Test\\clip.mp4')).toBe('file:///C%3A/Users/Test/clip.mp4');
  });
});

describe('FCPXML on NTSC rates', () => {
  const ntscSource = {
    ...source,
    videoStream: { width: 1920, height: 1080, frameRate: 29.97, codec: 'h264' },
  };

  it('declares DF tcFormat and rational 30000-denominator times', () => {
    const xml = exportFCPXML({ source: ntscSource, regions, projectName: 'NTSC' });
    expect(xml).toContain('frameDuration="1001/30000s"');
    expect(xml).toContain('tcFormat="DF"');
    expect(xml).toMatch(/duration="\d+\/30000s"/);
  });
});

describe('EDL on NTSC rates', () => {
  it('uses DROP FRAME FCM and drop-frame timecodes', () => {
    const ntscSource = {
      ...source,
      videoStream: { width: 1920, height: 1080, frameRate: 29.97, codec: 'h264' },
    };
    const edl = exportEDL({ source: ntscSource, regions, projectName: 'NTSC' });
    expect(edl).toContain('FCM: DROP FRAME');
    expect(edl).toMatch(/\d{2}:\d{2}:\d{2};\d{2}/);
  });
});

describe('format presets', () => {
  it('exposes preset ids that exporter helpers consume', () => {
    expect(findPreset('mp4-h264')?.videoCodec).toBe('libx264');
    expect(findPreset('mp3')?.hasVideo).toBe(false);
    expect(findPreset('bogus')).toBeUndefined();
  });

  it('picks an audio preset for audio-only sources', () => {
    expect(defaultPresetFor(false).hasVideo).toBe(false);
    expect(defaultPresetFor(true).hasVideo).toBe(true);
  });

  it('every preset declares a codec and extension', () => {
    for (const p of FORMAT_PRESETS) {
      expect(p.audioCodec).toBeTruthy();
      expect(p.extension.startsWith('.')).toBe(true);
      if (p.hasVideo) expect(p.videoCodec).toBeTruthy();
    }
  });
});

describe('filter_complex export with presets and selection', () => {
  it('uses preset codecs and extra args', () => {
    const preset = findPreset('mp4-h265')!;
    const out = buildFilterComplexExport(ctx, { outputPath: '/tmp/o.mp4', preset });
    expect(out.args).toContain('libx265');
    expect(out.args).toContain('hvc1');
  });

  it('strips video for audio-only presets', () => {
    const preset = findPreset('mp3')!;
    const out = buildFilterComplexExport(ctx, { outputPath: '/tmp/o.mp3', preset });
    expect(out.args).toContain('libmp3lame');
    // Video map flag must not be emitted.
    expect(out.args.join(' ')).not.toContain('-map [v]');
    // Output is audio-only so segment count and duration math stays correct.
    expect(out.segmentCount).toBe(3);
  });

  it('restricts to the selected region ids', () => {
    const selected = new Set(['1', '5']);
    const out = buildFilterComplexExport(ctx, {
      outputPath: '/tmp/o.mp4',
      selectedIds: selected,
    });
    expect(out.segmentCount).toBe(2);
    expect(out.outputDurationS).toBe(5);
  });

  it('throws when nothing is selected', () => {
    expect(() =>
      buildFilterComplexExport(ctx, {
        outputPath: '/tmp/o.mp4',
        selectedIds: new Set(),
      }),
    ).toThrow(/no segments/);
  });
});

describe('buildPerRegionExport', () => {
  it('produces one ffmpeg invocation per selected region', () => {
    const preset = findPreset('mp4-h264')!;
    const plan = buildPerRegionExport(ctx, {
      outputDir: '/tmp',
      basename: 'chapter',
      preset,
    });
    expect(plan.segments).toHaveLength(3);
    expect(plan.segments[0]?.outputPath).toBe('/tmp/chapter_001.mp4');
    expect(plan.segments[0]?.args).toContain('libx264');
    expect(plan.totalDurationS).toBe(8);
  });

  it('honors selectedIds whitelist over kept flag', () => {
    const plan = buildPerRegionExport(ctx, {
      outputDir: '/tmp',
      basename: 'pick',
      extension: '.mp4',
      selectedIds: new Set(['1']), // only first kept region
    });
    expect(plan.segments).toHaveLength(1);
    expect(plan.totalDurationS).toBe(2);
  });

  it('omits video stream for audio-only presets', () => {
    const plan = buildPerRegionExport(ctx, {
      outputDir: '/tmp',
      basename: 'audio',
      preset: findPreset('wav')!,
    });
    expect(plan.segments[0]?.args).toContain('-vn');
    expect(plan.segments[0]?.outputPath.endsWith('.wav')).toBe(true);
  });
});

describe('buildOverlayExport', () => {
  function overlay(
    id: string,
    segments: Array<[number, number, number, number, number]>,
  ): CleanAudioOverlay {
    return {
      id,
      name: `${id}.wav`,
      path: `/tmp/${id}.wav`,
      durationS: 30,
      sampleRate: 48000,
      channels: 1,
      enabled: true,
      globalOffsetS: 0,
      globalConfidence: 0.5,
      segments: segments.map(([cs, ce, rs, re, conf]) => ({
        candidateStartS: cs,
        candidateEndS: ce,
        referenceStartS: rs,
        referenceEndS: re,
        confidence: conf,
      })),
    };
  }

  it('emits one ffmpeg input per overlay and one audio piece per coverage', () => {
    // Reference 10 s, kept regions 0-2 + 3-6 + 7-10.
    // Overlay A covers ref [3.5, 5.5] from its own t=1..3.
    const a = overlay('A', [[1.0, 3.0, 3.5, 5.5, 0.8]]);
    const plan = buildOverlayExport(ctx, {
      outputPath: '/tmp/out.mp4',
      overlays: [a],
    });
    // Two inputs: source + 1 overlay.
    const inputCount = plan.args.filter((a) => a === '-i').length;
    expect(inputCount).toBe(2);
    expect(plan.segmentCount).toBe(3);
    // Region 3-6 splits into source [3, 3.5] / overlay [3.5, 5.5] / source [5.5, 6]
    // → 3 audio pieces, + 1 piece each for region 0-2 and 7-10 = 5 total.
    expect(plan.audioPieces).toBe(5);
    const fc = plan.args[plan.args.indexOf('-filter_complex') + 1]!;
    // Overlay file is input index 1.
    expect(fc).toContain('[1:a]atrim=start=1.000000:end=3.000000');
    // Source-audio fallback piece for [3, 3.5].
    expect(fc).toContain('[0:a]atrim=start=3.000000:end=3.500000');
  });

  it('cleanOnly replaces uncovered audio with anullsrc silence', () => {
    const a = overlay('A', [[1.0, 3.0, 3.5, 5.5, 0.8]]);
    const plan = buildOverlayExport(ctx, {
      outputPath: '/tmp/out.mp4',
      overlays: [a],
      cleanOnly: true,
    });
    const fc = plan.args[plan.args.indexOf('-filter_complex') + 1]!;
    // No source-audio atrim segments at all.
    expect(fc).not.toContain('[0:a]atrim');
    expect(fc).toContain('anullsrc=channel_layout=stereo:sample_rate=48000');
  });

  it('uses higher-confidence overlay when two collide on the same region', () => {
    const a = overlay('A', [[0, 3, 3, 6, 0.4]]);
    const b = overlay('B', [[0, 3, 3, 6, 0.9]]);
    const plan = buildOverlayExport(ctx, {
      outputPath: '/tmp/out.mp4',
      overlays: [a, b],
    });
    const fc = plan.args[plan.args.indexOf('-filter_complex') + 1]!;
    // B wins (higher confidence) → input index 2 (after source + A).
    expect(fc).toContain('[2:a]atrim');
    // A would be input index 1 — verify it does NOT show up.
    expect(fc).not.toMatch(/\[1:a\]atrim=start=0\.000000/);
  });

  it('skips disabled overlays', () => {
    const a = overlay('A', [[1.0, 3.0, 3.5, 5.5, 0.8]]);
    a.enabled = false;
    const plan = buildOverlayExport(ctx, {
      outputPath: '/tmp/out.mp4',
      overlays: [a],
    });
    const inputCount = plan.args.filter((a) => a === '-i').length;
    expect(inputCount).toBe(1); // just the source
    // All audio comes from source.
    expect(plan.audioPieces).toBe(3); // one per kept region, no overlay break
  });
});

describe('OTIO deep clone', () => {
  it('does not share media_reference across V1 and A1', () => {
    const json = JSON.parse(exportOTIO(ctx));
    const v1 = json.tracks.children[0].children[0];
    const a1 = json.tracks.children[1].children[0];
    expect(v1).not.toBe(a1);
    expect(v1.media_reference).not.toBe(a1.media_reference);
  });
});
