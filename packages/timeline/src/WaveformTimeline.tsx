import { useEffect, useRef, useState } from 'react';
import type { Region, Seconds } from '@quietcut/core';
import { downsamplePeaks } from './peaks.ts';

export interface WaveformTimelineProps {
  peaks: Float32Array | null;
  regions: Region[];
  duration: Seconds;
  currentTime: Seconds;
  onSeek?: (time: Seconds) => void;
  onBoundaryDrag?: (regionId: string, side: 'start' | 'end', time: Seconds) => void;
  onRegionClick?: (regionId: string) => void;
  height?: number;
}

const HANDLE_PX = 6;

export function WaveformTimeline({
  peaks,
  regions,
  duration,
  currentTime,
  onSeek,
  onBoundaryDrag,
  onRegionClick,
  height = 120,
}: WaveformTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverCursor, setHoverCursor] = useState<'pointer' | 'col-resize'>('pointer');
  const dragRef = useRef<{ regionId: string; side: 'start' | 'end' } | null>(null);

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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    if (duration > 0) {
      for (const region of regions) {
        if (region.kept) continue;
        const x = (region.start / duration) * cssWidth;
        const w = ((region.end - region.start) / duration) * cssWidth;
        ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
        ctx.fillRect(x, 0, w, cssHeight);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
        ctx.fillRect(x, 0, 1, cssHeight);
        ctx.fillRect(x + w - 1, 0, 1, cssHeight);
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

  const pxToTime = (e: React.MouseEvent<HTMLCanvasElement>): { time: Seconds; ratio: number } => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    return { time: Math.max(0, Math.min(duration, ratio * duration)), ratio };
  };

  const hitTestBoundary = (
    e: React.MouseEvent<HTMLCanvasElement>,
  ): { regionId: string; side: 'start' | 'end' } | null => {
    if (duration <= 0) return null;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const pxPerSec = rect.width / duration;
    for (let i = 0; i < regions.length; i++) {
      const r = regions[i]!;
      if (i > 0 && Math.abs(r.start * pxPerSec - px) <= HANDLE_PX) {
        return { regionId: r.id, side: 'start' };
      }
      if (i < regions.length - 1 && Math.abs(r.end * pxPerSec - px) <= HANDLE_PX) {
        return { regionId: r.id, side: 'end' };
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const hit = hitTestBoundary(e);
    if (hit && onBoundaryDrag) {
      dragRef.current = hit;
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragRef.current && onBoundaryDrag) {
      const { time } = pxToTime(e);
      onBoundaryDrag(dragRef.current.regionId, dragRef.current.side, time);
      return;
    }
    setHoverCursor(hitTestBoundary(e) ? 'col-resize' : 'pointer');
  };

  const handleMouseUp = () => {
    dragRef.current = null;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragRef.current) {
      dragRef.current = null;
      return;
    }
    if (hitTestBoundary(e)) return;
    const { time } = pxToTime(e);
    if (e.detail === 2 && onRegionClick && duration > 0) {
      const region = regions.find((r) => time >= r.start && time <= r.end);
      if (region) {
        onRegionClick(region.id);
        return;
      }
    }
    onSeek?.(time);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      role="slider"
      tabIndex={0}
      aria-label="Waveform timeline. Click to seek. Double-click to toggle a region. Drag boundaries to resize."
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      style={{ width: '100%', height, display: 'block', cursor: hoverCursor }}
    />
  );
}
