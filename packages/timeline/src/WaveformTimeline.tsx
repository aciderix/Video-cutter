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
  onBoundaryDragEnd?: () => void;
  onRegionClick?: (regionId: string) => void;
  height?: number;
}

const HANDLE_PX = 8;

export function WaveformTimeline({
  peaks,
  regions,
  duration,
  currentTime,
  onSeek,
  onBoundaryDrag,
  onBoundaryDragEnd,
  onRegionClick,
  height = 120,
}: WaveformTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [hoverCursor, setHoverCursor] = useState<'pointer' | 'col-resize'>('pointer');
  const dragRef = useRef<{
    regionId: string;
    side: 'start' | 'end';
    didMove: boolean;
  } | null>(null);
  const justDraggedRef = useRef(false);

  // --- Static layer: waveform peaks + region tinting + boundary handles ---
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
  }, [peaks, regions, duration, height]);

  // --- Overlay layer: playhead only. Re-renders every currentTime tick. ---
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = overlay.clientWidth;
    const cssHeight = overlay.clientHeight;
    overlay.width = Math.max(1, Math.floor(cssWidth * dpr));
    overlay.height = Math.max(1, Math.floor(cssHeight * dpr));

    const ctx = overlay.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (duration > 0) {
      const px = (currentTime / duration) * cssWidth;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, cssHeight);
      ctx.stroke();
    }
  }, [currentTime, duration]);

  const pxToTimeFromClient = (clientX: number): Seconds => {
    const canvas = canvasRef.current;
    if (!canvas || duration <= 0) return 0;
    const rect = canvas.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(duration, ratio * duration));
  };

  const hitTestBoundary = (clientX: number): { regionId: string; side: 'start' | 'end' } | null => {
    const canvas = canvasRef.current;
    if (!canvas || duration <= 0) return null;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
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

  // Global pointer listeners while dragging, so the user can release outside
  // the canvas (or even the window) without losing the commit.
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!dragRef.current || !onBoundaryDrag) return;
      dragRef.current.didMove = true;
      onBoundaryDrag(dragRef.current.regionId, dragRef.current.side, pxToTimeFromClient(e.clientX));
    };
    const finish = () => {
      if (!dragRef.current) return;
      const didMove = dragRef.current.didMove;
      dragRef.current = null;
      if (didMove) {
        justDraggedRef.current = true;
        onBoundaryDragEnd?.();
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
    window.addEventListener('blur', finish);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      window.removeEventListener('blur', finish);
    };
  }, [onBoundaryDrag, onBoundaryDragEnd, duration, regions]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const hit = hitTestBoundary(e.clientX);
    if (hit && onBoundaryDrag) {
      dragRef.current = { ...hit, didMove: false };
      (e.currentTarget as HTMLCanvasElement).setPointerCapture?.(e.pointerId);
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (dragRef.current) return;
    setHoverCursor(hitTestBoundary(e.clientX) ? 'col-resize' : 'pointer');
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (justDraggedRef.current) {
      justDraggedRef.current = false;
      return;
    }
    if (hitTestBoundary(e.clientX)) return;
    const time = pxToTimeFromClient(e.clientX);
    if (e.detail === 2 && onRegionClick && duration > 0) {
      const region = regions.find((r) => time >= r.start && time <= r.end);
      if (region) {
        onRegionClick(region.id);
        return;
      }
    }
    onSeek?.(time);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (!onSeek || duration <= 0) return;
    const step = e.shiftKey ? duration / 20 : duration / 200;
    if (e.code === 'ArrowLeft') {
      e.preventDefault();
      onSeek(Math.max(0, currentTime - step));
    } else if (e.code === 'ArrowRight') {
      e.preventDefault();
      onSeek(Math.min(duration, currentTime + step));
    } else if (e.code === 'Home') {
      e.preventDefault();
      onSeek(0);
    } else if (e.code === 'End') {
      e.preventDefault();
      onSeek(duration);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
        aria-label="Waveform timeline. Click to seek, double-click a region to toggle, drag boundaries to resize, arrow keys to scrub."
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        style={{ width: '100%', height, display: 'block', cursor: hoverCursor }}
      />
      <canvas
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
