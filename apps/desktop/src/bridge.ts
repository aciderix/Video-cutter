import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
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
