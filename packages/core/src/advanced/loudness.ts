/**
 * Loudness normalization presets and the corresponding FFmpeg filter strings.
 * SnipVox uses FFmpeg's `loudnorm` filter which implements EBU R128, the de
 * facto standard for broadcast / streaming targets:
 *
 *  - Spotify, Tidal: -14 LUFS integrated, -1 dBTP
 *  - YouTube: -14 LUFS integrated, -1 dBTP
 *  - Apple Music: -16 LUFS integrated, -1 dBTP
 *  - Podcast (AES): -16 LUFS integrated, -1 dBTP
 *  - Broadcast EBU R128: -23 LUFS integrated, -1 dBTP
 */
export interface LoudnessPreset {
  id: string;
  label: string;
  /** Target integrated loudness in LUFS. */
  i: number;
  /** True-peak ceiling in dBTP (negative). */
  tp: number;
  /** Loudness range in LU. */
  lra: number;
}

export const LOUDNESS_PRESETS: LoudnessPreset[] = [
  { id: 'streaming', label: 'Streaming (-14 LUFS)', i: -14, tp: -1, lra: 11 },
  { id: 'podcast', label: 'Podcast / Apple Music (-16 LUFS)', i: -16, tp: -1, lra: 11 },
  { id: 'broadcast', label: 'EBU R128 (-23 LUFS)', i: -23, tp: -2, lra: 11 },
];

/**
 * Build the FFmpeg `-af loudnorm=...` argument for a single-pass normalization.
 * For best results, callers should run two passes (measure → apply with
 * measured_*=... values), but a single pass is good enough for most editorial
 * use and avoids doubling the export time.
 */
export function loudnessFilterArg(preset: LoudnessPreset, singlePass = true): string {
  const parts = [
    'loudnorm',
    `I=${preset.i}`,
    `TP=${preset.tp}`,
    `LRA=${preset.lra}`,
    'print_format=summary',
  ];
  if (!singlePass) parts.push('linear=true');
  return parts.join(':');
}
