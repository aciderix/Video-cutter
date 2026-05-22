import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { writeTextFile } from '@tauri-apps/plugin-fs';
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

export async function writeFile(path: string, contents: string): Promise<void> {
  await writeTextFile(path, contents);
}
