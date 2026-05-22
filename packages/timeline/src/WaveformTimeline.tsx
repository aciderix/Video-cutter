import { useEffect, useRef } from 'react';
import type { Region, Seconds } from '@quietcut/core';
import { downsamplePeaks } from './peaks.ts';

export interface WaveformTimelineProps {
  peaks: Float32Array | null;
  regions: Region[];
  duration: Seconds;
  currentTime: Seconds;
  onSeek?: (time: Seconds) => void;
  height?: number;
}

/**
 * Lightweight Canvas2D waveform. WebGL/PixiJS version comes in Phase 1 once
 * we have real peaks coming from the Rust backend; for now this validates
 * the rendering pipeline end-to-end.
 */
export function WaveformTimeline({
  peaks,
  regions,
  duration,
  currentTime,
  onSeek,
  height = 120,
}: WaveformTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
    canvas.height = Math.max(1, Math.floor(cssHeight * dpr));

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    if (duration > 0) {
      for (const region of regions) {
        if (region.kept) continue;
        const x = (region.start / duration) * cssWidth;
        const w = ((region.end - region.start) / duration) * cssWidth;
        ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
        ctx.fillRect(x, 0, w, cssHeight);
      }
    }

    if (peaks && peaks.length > 0) {
      const { min, max } = downsamplePeaks(peaks, Math.floor(cssWidth));
      const mid = cssHeight / 2;
      ctx.strokeStyle = '#a5b4fc';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < min.length; x++) {
        const top = mid - max[x]! * mid;
        const bottom = mid - min[x]! * mid;
        ctx.moveTo(x + 0.5, top);
        ctx.lineTo(x + 0.5, bottom);
      }
      ctx.stroke();
    }

    if (duration > 0) {
      const px = (currentTime / duration) * cssWidth;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, cssHeight);
      ctx.stroke();
    }
  }, [peaks, regions, duration, currentTime, height]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onSeek || duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, ratio * duration)));
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      role="slider"
      tabIndex={0}
      aria-label="Waveform timeline. Use arrow keys to scrub."
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      style={{ width: '100%', height, display: 'block', cursor: 'pointer' }}
    />
  );
}
