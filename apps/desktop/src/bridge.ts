import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import type { MediaSource, SilenceDetectionSettings } from '@quietcut/core';
import type { RawSilenceInterval } from '@quietcut/core';

export async function pickMediaFiles(): Promise<string[]> {
  const result = await open({
    multiple: true,
    filters: [
      {
        name: 'Media',
        extensions: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg'],
      },
    ],
  });
  if (!result) return [];
  return Array.isArray(result) ? result : [result];
}

export async function analyzeMedia(path: string): Promise<MediaSource> {
  return await invoke<MediaSource>('analyze_media', { path });
}

export async function runSilenceDetection(
  path: string,
  settings: SilenceDetectionSettings,
): Promise<RawSilenceInterval[]> {
  return await invoke<RawSilenceInterval[]>('detect_silences', { path, settings });
}

export async function computePeaks(path: string, targetBins = 2048): Promise<Float32Array> {
  const peaks = await invoke<number[]>('compute_peaks', { path, targetBins });
  return Float32Array.from(peaks);
}

export interface ExportRequest {
  args: string[];
  expectedDurationS: number;
  jobId: string;
}

export interface ExportResult {
  jobId: string;
  stderrTail: string;
}

export async function runExportCut(request: ExportRequest): Promise<ExportResult> {
  return await invoke<ExportResult>('export_cut', { request });
}

export interface SegmentedExportRequest {
  segments: string[][];
  concatArgs: string[];
  concatListPath: string;
  concatListContent: string;
  tmpPaths: string[];
  expectedDurationS: number;
  jobId: string;
  timeoutSeconds?: number;
}

export async function runExportSegmented(request: SegmentedExportRequest): Promise<ExportResult> {
  return await invoke<ExportResult>('export_segmented', { request });
}

export async function cancelExport(jobId: string): Promise<boolean> {
  return await invoke<boolean>('cancel_export', { jobId });
}

export async function tempDir(): Promise<string> {
  const path = await import('@tauri-apps/api/path');
  return await path.tempDir();
}

export async function writeFile(path: string, contents: string): Promise<void> {
  await writeTextFile(path, contents);
}

export async function readFile(path: string): Promise<string> {
  return await readTextFile(path);
}
