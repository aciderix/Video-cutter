import { describe, expect, it } from 'vitest';
import type { MediaSource, Region } from '@quietcut/core';
import {
  buildFFmpegConcatList,
  buildFFmpegSegmentCommands,
  buildFilterComplexExport,
  exportEDL,
  exportFCPXML,
  exportOTIO,
  exportResolveMarkers,
} from './index.ts';

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
});
