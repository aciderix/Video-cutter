/**
 * Output format presets that drive the FFmpeg builders. Each preset declares
 * its container, codecs, file extension, and whether it carries video. The
 * exporter picks the right ffmpeg flags from the codec name and decides
 * whether to map the source's video stream (audio-only formats strip it).
 */
export interface FormatPreset {
  id: string;
  label: string;
  /** Output file extension, with the leading dot. */
  extension: string;
  /** Carries video (false for audio-only formats). */
  hasVideo: boolean;
  /** FFmpeg video codec name. Ignored when hasVideo=false. */
  videoCodec?: string;
  /** FFmpeg audio codec name. */
  audioCodec: string;
  /** Extra ffmpeg args appended after the codec selection. */
  extraArgs?: string[];
  /** Short helper text for the UI. */
  description: string;
}

export const FORMAT_PRESETS: FormatPreset[] = [
  // --- Video ---
  {
    id: 'mp4-h264',
    label: 'MP4 (H.264 + AAC)',
    extension: '.mp4',
    hasVideo: true,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    extraArgs: ['-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p'],
    description: 'Universal. Plays everywhere. Default choice.',
  },
  {
    id: 'mp4-h265',
    label: 'MP4 (H.265 / HEVC + AAC)',
    extension: '.mp4',
    hasVideo: true,
    videoCodec: 'libx265',
    audioCodec: 'aac',
    extraArgs: ['-preset', 'medium', '-crf', '24', '-tag:v', 'hvc1'],
    description: 'Smaller files at the same quality. Slower encode.',
  },
  {
    id: 'webm-vp9',
    label: 'WebM (VP9 + Opus)',
    extension: '.webm',
    hasVideo: true,
    videoCodec: 'libvpx-vp9',
    audioCodec: 'libopus',
    extraArgs: ['-b:v', '0', '-crf', '32', '-row-mt', '1'],
    description: 'Open standard, web-friendly. Slowest encode.',
  },
  {
    id: 'mov-prores',
    label: 'MOV (ProRes 422 + PCM)',
    extension: '.mov',
    hasVideo: true,
    videoCodec: 'prores_ks',
    audioCodec: 'pcm_s16le',
    extraArgs: ['-profile:v', '3'], // HQ
    description: 'Editing-friendly intermediate. Big files.',
  },
  {
    id: 'mkv-h264',
    label: 'MKV (H.264 + AAC)',
    extension: '.mkv',
    hasVideo: true,
    videoCodec: 'libx264',
    audioCodec: 'aac',
    extraArgs: ['-preset', 'veryfast', '-crf', '20'],
    description: 'Same as MP4 but in the Matroska container.',
  },
  // --- Audio-only ---
  {
    id: 'mp3',
    label: 'MP3 (192 kbps)',
    extension: '.mp3',
    hasVideo: false,
    audioCodec: 'libmp3lame',
    extraArgs: ['-b:a', '192k'],
    description: 'Lossy. Universal compatibility.',
  },
  {
    id: 'aac',
    label: 'AAC (M4A, 192 kbps)',
    extension: '.m4a',
    hasVideo: false,
    audioCodec: 'aac',
    extraArgs: ['-b:a', '192k'],
    description: 'Lossy. Better quality than MP3 at the same bitrate.',
  },
  {
    id: 'opus',
    label: 'Opus (OGG, 128 kbps)',
    extension: '.ogg',
    hasVideo: false,
    audioCodec: 'libopus',
    extraArgs: ['-b:a', '128k'],
    description: 'Lossy, open. Best quality per byte on voice.',
  },
  {
    id: 'wav',
    label: 'WAV (16-bit PCM)',
    extension: '.wav',
    hasVideo: false,
    audioCodec: 'pcm_s16le',
    description: 'Uncompressed. Use for editorial.',
  },
  {
    id: 'flac',
    label: 'FLAC',
    extension: '.flac',
    hasVideo: false,
    audioCodec: 'flac',
    description: 'Lossless, compressed. Archive-grade.',
  },
];

export function findPreset(id: string): FormatPreset | undefined {
  return FORMAT_PRESETS.find((p) => p.id === id);
}

export function defaultPresetFor(hasVideo: boolean): FormatPreset {
  return hasVideo ? FORMAT_PRESETS[0]! : FORMAT_PRESETS[6]!; // mp4-h264 or aac
}
