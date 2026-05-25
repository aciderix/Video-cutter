/**
 * Core domain types shared across desktop, mobile, and exporters.
 *
 * Time is always represented in seconds (floating-point) at the API level.
 * Frame-accurate operations convert via the clip's frame rate.
 */

export type Seconds = number;
export type Hertz = number;
export type Decibels = number;

export interface MediaSource {
  id: string;
  path: string;
  name: string;
  duration: Seconds;
  hasVideo: boolean;
  hasAudio: boolean;
  videoStream?: VideoStreamInfo;
  audioStream?: AudioStreamInfo;
}

export interface VideoStreamInfo {
  width: number;
  height: number;
  frameRate: number;
  codec: string;
  bitrate?: number;
}

export interface AudioStreamInfo {
  sampleRate: Hertz;
  channels: number;
  codec: string;
  bitrate?: number;
}

/**
 * A region in the source media. `kept = true` means it survives the cut.
 * Detected silences start as `kept = false`; user can toggle any region.
 */
export interface Region {
  id: string;
  start: Seconds;
  end: Seconds;
  kept: boolean;
  source: 'detected' | 'manual';
  label?: string;
}

export interface SilenceDetectionSettings {
  thresholdDb: Decibels;
  minSilenceDurationMs: number;
  paddingMs: number;
  minKeepDurationMs: number;
  /** When 'auto', `thresholdDb` is overridden at detection time by the
   *  signal's 10th-percentile RMS plus `autoMarginDb`. Robust against
   *  steady background hiss / white noise. */
  noiseGateMode?: 'fixed' | 'auto';
  /** Margin above the auto-detected noise floor. Default +6 dB. */
  autoMarginDb?: Decibels;
}

export const DEFAULT_DETECTION: SilenceDetectionSettings = {
  thresholdDb: -30,
  minSilenceDurationMs: 500,
  paddingMs: 100,
  minKeepDurationMs: 100,
  noiseGateMode: 'auto',
  autoMarginDb: 6,
};

export interface ProjectFile {
  /** Schema version. v1 = sources + regions + settings. v2 adds
   *  `overlaysBySource` so the loader can migrate forward. */
  version: 1 | 2;
  name: string;
  createdAt: string;
  updatedAt: string;
  sources: MediaSource[];
  regionsBySource: Record<string, Region[]>;
  detectionSettings: SilenceDetectionSettings;
  /** v2+: clean audio overlays attached to each source id. Optional so
   *  the same struct stays compatible with v1 files. */
  overlaysBySource?: Record<string, import('./sync/index.ts').CleanAudioOverlay[]>;
}
