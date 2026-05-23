import type { Region } from '@quietcut/core';
import { keptRegions } from '@quietcut/core';

/**
 * Mobile MP4 re-encode requires a native FFmpeg, which we don't ship in this
 * build (FFmpegKit / capacitor-ffmpeg would add ~30 MB to the APK and a
 * platform-specific maintenance burden). The mobile flow therefore offers:
 *
 *  1. NLE export — works for every source, hands off to the editor app via
 *     the OS share sheet. See App.tsx -> shareNle.
 *  2. Audio-only WAV export — implemented here. Decodes the audio with Web
 *     Audio, concatenates the kept regions in JS, encodes a 16-bit PCM WAV.
 *     Fast, predictable, no native deps. Video tracks are dropped.
 *
 * Anything more (video re-encode with the cuts baked in) needs to wait until
 * we either bundle FFmpegKit or ship a WASM ffmpeg lite build.
 */
export async function exportAudioWav(
  samples: Float32Array,
  sampleRate: number,
  regions: Region[],
): Promise<Blob> {
  const kept = keptRegions(regions);
  if (kept.length === 0) throw new Error('No kept regions to export');

  let totalSamples = 0;
  const slices: Float32Array[] = [];
  for (const r of kept) {
    const startSample = Math.max(0, Math.floor(r.start * sampleRate));
    const endSample = Math.min(samples.length, Math.floor(r.end * sampleRate));
    if (endSample <= startSample) continue;
    const slice = samples.subarray(startSample, endSample);
    slices.push(slice);
    totalSamples += slice.length;
  }

  // Concatenate, then encode to 16-bit PCM WAV.
  const merged = new Float32Array(totalSamples);
  let offset = 0;
  for (const s of slices) {
    merged.set(s, offset);
    offset += s.length;
  }
  return floatToWavBlob(merged, sampleRate);
}

function floatToWavBlob(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]!));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }
  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, str: string): void {
  for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
}
