import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import {
  keptRegions,
  type CleanAudioOverlay,
  type MediaSource,
  type Region,
} from '@quietcut/core';
import { buildOverlayExport } from '@quietcut/exporters';

/**
 * ffmpeg.wasm wrapper for the mobile app. Lazily loaded so the ~30 MB core
 * binary only fetches once the user actually triggers an export. Provides
 * the two flows the mobile UI needs: a single concatenated file and one
 * file per selected region.
 *
 * On Android (Capacitor WebView 80+) and modern Chrome / Safari the WASM
 * build runs single-threaded but is fast enough for short clips. For
 * multi-threading (SharedArrayBuffer) we would need COOP/COEP headers, out
 * of scope here.
 */

export type FfmpegProgressFn = (info: { progress: number; time: number }) => void;
export type FfmpegLogFn = (info: { message: string }) => void;

export interface MobileFormatPreset {
  id: string;
  label: string;
  extension: string;
  /** Codec presence drives whether we re-encode video. */
  hasVideo: boolean;
  /** ffmpeg `-c:v` value. Used only when hasVideo is true. */
  videoCodec?: string;
  /** ffmpeg `-c:a` value. */
  audioCodec: string;
  /** Extra arguments appended after the codec selection. */
  extraArgs?: string[];
  description: string;
}

export const MOBILE_FORMAT_PRESETS: MobileFormatPreset[] = [
  // --- Video ---
  {
    id: 'mp4-h264',
    label: 'MP4 (H.264 + AAC)',
    extension: '.mp4',
    hasVideo: true,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    extraArgs: ['-preset', 'ultrafast', '-crf', '23', '-pix_fmt', 'yuv420p'],
    description: 'Universal video output. Re-encodes with ffmpeg.wasm.',
  },
  {
    id: 'webm-vp9',
    label: 'WebM (VP9 + Opus)',
    extension: '.webm',
    hasVideo: true,
    videoCodec: 'libvpx-vp9',
    audioCodec: 'libopus',
    extraArgs: ['-b:v', '0', '-crf', '32'],
    description: 'Web-native. Slower encode than H.264.',
  },
  // --- Audio-only ---
  {
    id: 'mp3',
    label: 'MP3 (192 kbps)',
    extension: '.mp3',
    hasVideo: false,
    audioCodec: 'libmp3lame',
    extraArgs: ['-b:a', '192k'],
    description: 'Lossy, universally compatible.',
  },
  {
    id: 'aac',
    label: 'AAC (M4A, 192 kbps)',
    extension: '.m4a',
    hasVideo: false,
    audioCodec: 'aac',
    extraArgs: ['-b:a', '192k'],
    description: 'Better than MP3 at the same bitrate.',
  },
  {
    id: 'wav',
    label: 'WAV (16-bit PCM)',
    extension: '.wav',
    hasVideo: false,
    audioCodec: 'pcm_s16le',
    description: 'Uncompressed. Use for editing.',
  },
];

export function defaultMobilePreset(hasVideo: boolean): MobileFormatPreset {
  return hasVideo ? MOBILE_FORMAT_PRESETS[0]! : MOBILE_FORMAT_PRESETS[2]!; // mp4-h264 or mp3
}

export function findMobilePreset(id: string): MobileFormatPreset | undefined {
  return MOBILE_FORMAT_PRESETS.find((p) => p.id === id);
}

let ffmpegInstance: FFmpeg | null = null;
let loadingPromise: Promise<FFmpeg> | null = null;

/**
 * Lazy singleton. The CDN-hosted core is cross-origin which means the
 * WebView would normally refuse to import it from a blob — we fetch the
 * .js and .wasm files and re-host them as blob URLs to dodge that.
 */
async function getFfmpeg(onLog?: FfmpegLogFn): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadingPromise) return loadingPromise;
  loadingPromise = (async () => {
    const ff = new FFmpeg();
    if (onLog) ff.on('log', onLog);
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
    await ff.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    ffmpegInstance = ff;
    return ff;
  })();
  return loadingPromise;
}

/** Convert a File / Blob to a Uint8Array. Re-export of fetchFile for callers. */
export const blobToBytes = fetchFile;

/**
 * Cut + concatenate selected regions of `sourceFile` into a single output
 * file using the given preset's codecs. Progress callbacks fire while ffmpeg
 * is running.
 */
export async function exportSingleFile(opts: {
  sourceFile: File;
  regions: Region[];
  selectedIds: ReadonlySet<string>;
  preset: MobileFormatPreset;
  onProgress?: FfmpegProgressFn;
  onLog?: FfmpegLogFn;
}): Promise<{ blob: Blob; filename: string }> {
  const ff = await getFfmpeg(opts.onLog);
  const segments = pickRegions(opts.regions, opts.selectedIds);
  if (segments.length === 0) throw new Error('No segments selected');

  const inputName = 'input.' + extractExt(opts.sourceFile.name);
  await ff.writeFile(inputName, await fetchFile(opts.sourceFile));

  const outputName = 'output' + opts.preset.extension;
  const args = buildFilterComplexArgs(inputName, outputName, segments, opts.preset);

  if (opts.onProgress) ff.on('progress', opts.onProgress);
  await ff.exec(args);
  if (opts.onProgress) ff.off('progress', opts.onProgress);

  const data = await ff.readFile(outputName);
  const bytes =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(typeof data === 'string' ? new TextEncoder().encode(data).buffer : data);
  const filename = baseName(opts.sourceFile.name) + '.cut' + opts.preset.extension;
  await ff.deleteFile(inputName).catch(() => {});
  await ff.deleteFile(outputName).catch(() => {});
  return { blob: new Blob([bytes as BlobPart], { type: mimeFor(opts.preset) }), filename };
}

/**
 * One file per selected region. Each file gets a zero-padded index suffix.
 */
export async function exportPerRegion(opts: {
  sourceFile: File;
  regions: Region[];
  selectedIds: ReadonlySet<string>;
  preset: MobileFormatPreset;
  onProgress?: (info: { index: number; total: number; progress: number }) => void;
  onLog?: FfmpegLogFn;
}): Promise<{ blobs: Blob[]; filenames: string[] }> {
  const ff = await getFfmpeg(opts.onLog);
  const segments = pickRegions(opts.regions, opts.selectedIds);
  if (segments.length === 0) throw new Error('No segments selected');

  const inputName = 'input.' + extractExt(opts.sourceFile.name);
  await ff.writeFile(inputName, await fetchFile(opts.sourceFile));

  const blobs: Blob[] = [];
  const filenames: string[] = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    const padded = String(i + 1).padStart(3, '0');
    const outName = `segment_${padded}${opts.preset.extension}`;
    const args = buildSingleSegmentArgs(inputName, outName, seg, opts.preset);

    const onP = (info: { progress: number; time: number }) => {
      opts.onProgress?.({ index: i, total: segments.length, progress: info.progress });
    };
    ff.on('progress', onP);
    await ff.exec(args);
    ff.off('progress', onP);
    const data = await ff.readFile(outName);
    const bytes =
      data instanceof Uint8Array
        ? data
        : new Uint8Array(typeof data === 'string' ? new TextEncoder().encode(data).buffer : data);
    blobs.push(new Blob([bytes as BlobPart], { type: mimeFor(opts.preset) }));
    filenames.push(`${baseName(opts.sourceFile.name)}_${padded}${opts.preset.extension}`);
    await ff.deleteFile(outName).catch(() => {});
  }
  await ff.deleteFile(inputName).catch(() => {});
  return { blobs, filenames };
}

export interface MobileOverlayInput {
  /** Same id used in OverlayState. */
  id: string;
  /** Display name (kept for debugging). */
  name: string;
  /** In-memory File handle for ffmpeg.wasm to read on export. */
  file: File;
  /** Alignment segments, same shape as CleanAudioOverlay.segments. */
  segments: CleanAudioOverlay['segments'];
  /** Toggled in the UI — disabled overlays are skipped entirely. */
  enabled: boolean;
  /** Decoded duration. */
  durationS: number;
  sampleRate: number;
  channels: number;
  globalOffsetS: number;
  globalConfidence: number;
}

/**
 * Single-file export that uses one or more clean-audio overlays. Mirrors
 * the desktop pipeline: each overlay becomes a separate ffmpeg input,
 * the audio graph is sliced into pieces (overlay where aligned, source
 * or silence elsewhere), then everything is concatenated and re-encoded.
 *
 * Returns the camera-only export path if no overlay is enabled — caller
 * is responsible for routing.
 */
export async function exportSingleFileWithOverlays(opts: {
  sourceFile: File;
  source: MediaSource;
  regions: Region[];
  selectedIds: ReadonlySet<string>;
  preset: MobileFormatPreset;
  overlays: MobileOverlayInput[];
  /** "mix" keeps camera audio where no overlay is aligned. "cleanOnly"
   *  silences those gaps instead. */
  audioMode: 'mix' | 'cleanOnly';
  onProgress?: FfmpegProgressFn;
  onLog?: FfmpegLogFn;
}): Promise<{ blob: Blob; filename: string }> {
  const usableOverlays = opts.overlays.filter(
    (o) => o.enabled && o.segments.length > 0 && o.file,
  );
  if (usableOverlays.length === 0) {
    return exportSingleFile({
      sourceFile: opts.sourceFile,
      regions: opts.regions,
      selectedIds: opts.selectedIds,
      preset: opts.preset,
      onProgress: opts.onProgress,
      onLog: opts.onLog,
    });
  }

  const ff = await getFfmpeg(opts.onLog);
  const sourceInputName = 'input.' + extractExt(opts.sourceFile.name);
  await ff.writeFile(sourceInputName, await fetchFile(opts.sourceFile));

  // Mirror the OverlayExport shape: each overlay is a separate -i with a
  // stable filename inside ffmpeg.wasm's MEMFS.
  const overlayFsNames: string[] = [];
  const overlayPlan: CleanAudioOverlay[] = [];
  for (let i = 0; i < usableOverlays.length; i++) {
    const o = usableOverlays[i]!;
    const ext = extractExt(o.file.name);
    const fsName = `overlay_${i}.${ext}`;
    await ff.writeFile(fsName, await fetchFile(o.file));
    overlayFsNames.push(fsName);
    overlayPlan.push({
      id: o.id,
      name: o.name,
      path: fsName,
      durationS: o.durationS,
      sampleRate: o.sampleRate,
      channels: o.channels,
      segments: o.segments,
      enabled: true,
      globalOffsetS: o.globalOffsetS,
      globalConfidence: o.globalConfidence,
    });
  }

  const outputName = 'output' + opts.preset.extension;
  const plan = buildOverlayExport(
    {
      source: { ...opts.source, path: sourceInputName },
      regions: opts.regions,
      projectName: 'quietcut',
    },
    {
      outputPath: outputName,
      overlays: overlayPlan,
      cleanOnly: opts.audioMode === 'cleanOnly',
      selectedIds: opts.selectedIds,
      preset: {
        id: opts.preset.id,
        label: opts.preset.label,
        extension: opts.preset.extension,
        hasVideo: opts.preset.hasVideo,
        videoCodec: opts.preset.videoCodec,
        audioCodec: opts.preset.audioCodec,
        extraArgs: opts.preset.extraArgs,
        description: opts.preset.description,
      },
    },
  );

  // buildOverlayExport emits `-y -nostdin -hide_banner -i <src> -i <ov0>
  // -i <ov1> -filter_complex … <out>`. ffmpeg.wasm doesn't accept
  // -nostdin / -y (it's headless already), so strip them.
  const args = plan.args.filter((a) => a !== '-y' && a !== '-nostdin' && a !== '-hide_banner');

  if (opts.onProgress) ff.on('progress', opts.onProgress);
  await ff.exec(args);
  if (opts.onProgress) ff.off('progress', opts.onProgress);

  const data = await ff.readFile(outputName);
  const bytes =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(typeof data === 'string' ? new TextEncoder().encode(data).buffer : data);
  const filename = baseName(opts.sourceFile.name) + '.clean' + opts.preset.extension;
  await ff.deleteFile(sourceInputName).catch(() => {});
  await ff.deleteFile(outputName).catch(() => {});
  for (const fs of overlayFsNames) await ff.deleteFile(fs).catch(() => {});
  return { blob: new Blob([bytes as BlobPart], { type: mimeFor(opts.preset) }), filename };
}

function buildFilterComplexArgs(
  inputName: string,
  outputName: string,
  segments: Region[],
  preset: MobileFormatPreset,
): string[] {
  const parts: string[] = [];
  const concatInputs: string[] = [];
  segments.forEach((r, i) => {
    const ss = r.start.toFixed(6);
    const ee = r.end.toFixed(6);
    if (preset.hasVideo) {
      parts.push(`[0:v]trim=start=${ss}:end=${ee},setpts=PTS-STARTPTS[v${i}]`);
      concatInputs.push(`[v${i}]`);
    }
    parts.push(`[0:a]atrim=start=${ss}:end=${ee},asetpts=PTS-STARTPTS[a${i}]`);
    concatInputs.push(`[a${i}]`);
  });
  const vFlag = preset.hasVideo ? 1 : 0;
  parts.push(
    `${concatInputs.join('')}concat=n=${segments.length}:v=${vFlag}:a=1` +
      `${preset.hasVideo ? '[v]' : ''}[a]`,
  );
  const args: string[] = ['-i', inputName, '-filter_complex', parts.join(';')];
  if (preset.hasVideo) args.push('-map', '[v]', '-c:v', preset.videoCodec!);
  args.push('-map', '[a]', '-c:a', preset.audioCodec);
  if (preset.extraArgs) args.push(...preset.extraArgs);
  args.push(outputName);
  return args;
}

function buildSingleSegmentArgs(
  inputName: string,
  outputName: string,
  segment: Region,
  preset: MobileFormatPreset,
): string[] {
  const args: string[] = [
    '-ss',
    segment.start.toFixed(6),
    '-i',
    inputName,
    '-t',
    (segment.end - segment.start).toFixed(6),
  ];
  if (preset.hasVideo) args.push('-c:v', preset.videoCodec!);
  else args.push('-vn');
  args.push('-c:a', preset.audioCodec);
  if (preset.extraArgs) args.push(...preset.extraArgs);
  args.push(outputName);
  return args;
}

function pickRegions(regions: Region[], selectedIds: ReadonlySet<string>): Region[] {
  if (!selectedIds || selectedIds.size === 0) {
    return keptRegions(regions);
  }
  return regions.filter((r) => selectedIds.has(r.id));
}

function baseName(filename: string): string {
  return filename.replace(/\.[^./]+$/, '');
}

function extractExt(filename: string): string {
  const m = filename.match(/\.([^./]+)$/);
  return m ? m[1]! : 'mp4';
}

function mimeFor(preset: MobileFormatPreset): string {
  if (preset.extension === '.mp4') return 'video/mp4';
  if (preset.extension === '.webm') return 'video/webm';
  if (preset.extension === '.mp3') return 'audio/mpeg';
  if (preset.extension === '.m4a') return 'audio/mp4';
  if (preset.extension === '.wav') return 'audio/wav';
  return 'application/octet-stream';
}
