import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { writeTextFile, readTextFile } from '@tauri-apps/plugin-fs';
import type { MediaSource, SilenceDetectionSettings } from '@snipvox/core';
import type { RawSilenceInterval } from '@snipvox/core';

export type AppErrorKind =
  | 'ffmpegMissing'
  | 'ffmpegRun'
  | 'ffmpegFailed'
  | 'parseError'
  | 'unsupportedMedia'
  | 'decode';

export interface AppError {
  kind: AppErrorKind;
  message: string;
  details: string;
  code?: number;
}

export function isAppError(value: unknown): value is AppError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    typeof (value as { kind: unknown }).kind === 'string'
  );
}

export function formatBridgeError(value: unknown): string {
  if (isAppError(value)) {
    if (value.details && value.details !== value.message) {
      return `${value.message}\n${value.details}`;
    }
    return value.message;
  }
  if (value instanceof Error) return value.message;
  return String(value);
}

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

export async function computePeaks(
  path: string,
  targetBins = 2048,
  expectedDurationS?: number,
): Promise<Float32Array> {
  const peaks = await invoke<number[]>('compute_peaks', {
    path,
    targetBins,
    expectedDurationS,
  });
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

export async function pathExists(path: string): Promise<boolean> {
  return await invoke<boolean>('path_exists', { path });
}

export interface AlignedSegment {
  candidateStartS: number;
  candidateEndS: number;
  referenceStartS: number;
  referenceEndS: number;
  /** 0..1 — higher = more confident this segment really lines up here. */
  confidence: number;
}

export interface AlignmentReport {
  segments: AlignedSegment[];
  globalOffsetS: number;
  globalConfidence: number;
}

export interface AlignClipRequest {
  referencePath: string;
  candidatePath: string;
  /** "whole" (default) for a single global offset, "segmented" for
   * chunk-by-chunk matching of out-of-order takes. */
  mode?: 'whole' | 'segmented';
  chunkSeconds?: number;
  minConfidence?: number;
}

export async function alignClip(request: AlignClipRequest): Promise<AlignmentReport> {
  return await invoke<AlignmentReport>('align_clip', { request });
}

export async function pickDirectory(): Promise<string | null> {
  const result = await open({ directory: true, multiple: false });
  if (!result) return null;
  return Array.isArray(result) ? (result[0] ?? null) : result;
}

export async function pickSingleMediaFile(): Promise<string | null> {
  const result = await open({
    multiple: false,
    filters: [
      {
        name: 'Media',
        extensions: ['mp4', 'mov', 'mkv', 'webm', 'avi', 'mp3', 'wav', 'flac', 'm4a', 'aac', 'ogg'],
      },
    ],
  });
  if (!result) return null;
  return Array.isArray(result) ? (result[0] ?? null) : result;
}
