import { useEffect, useRef, useState } from 'react';
import type { Region, Seconds } from '@quietcut/core';
import { downsamplePeaks } from './peaks.ts';

export interface WaveformTimelineProps {
  peaks: Float32Array | null;
  regions: Region[];
  duration: Seconds;
  currentTime: Seconds;
  /** Viewport zoom factor. 1 = whole clip, 4 = ¼ of the clip visible, etc. */
  zoom?: number;
  /** Start time (seconds) of the current viewport. */
  offset?: Seconds;
  onZoomChange?: (zoom: number, offset: Seconds) => void;
  onSeek?: (time: Seconds) => void;
  onBoundaryDrag?: (regionId: string, side: 'start' | 'end', time: Seconds) => void;
  onBoundaryDragEnd?: () => void;
  /** Double-click handler on a region (toggle kept). */
  onRegionKeptToggle?: (regionId: string) => void;
  /** Single-click on a kept region body — used to toggle export selection. */
  onRegionExportToggle?: (regionId: string) => void;
  /** Region ids that are currently selected for export (visual highlight). */
  selectedExportIds?: ReadonlySet<string>;
  height?: number;
}

/**
 * Boundary hit zones — bumped on coarse pointers (touch) to match the
 * 44 px iOS / 48 dp Android touch target guidance.
 */
const HANDLE_PX_DESKTOP = 8;
const HANDLE_PX_TOUCH = 24;
const isCoarsePointer = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(pointer: coarse)').matches;
const handlePx = (): number => (isCoarsePointer() ? HANDLE_PX_TOUCH : HANDLE_PX_DESKTOP);
const MIN_ZOOM = 1;
const MAX_ZOOM = 200;
/** Pixels the pointer must move before we consider it a drag (vs a tap). */
const TAP_THRESHOLD_PX = 6;

interface BoundaryDragState {
  kind: 'boundary';
  regionId: string;
  side: 'start' | 'end';
  didMove: boolean;
}
interface PanDragState {
  kind: 'pan';
  startClientX: number;
  startOffset: Seconds;
  moved: boolean;
}
interface PinchState {
  kind: 'pinch';
  startDistance: number;
  startZoom: number;
  startOffset: Seconds;
  /** Time under the midpoint between the two pointers when the pinch started. */
  anchorTime: Seconds;
}
type GestureState = BoundaryDragState | PanDragState | PinchState | null;

export function WaveformTimeline({
  peaks,
  regions,
  duration,
  currentTime,
  zoom = 1,
  offset = 0,
  onZoomChange,
  onSeek,
  onBoundaryDrag,
  onBoundaryDragEnd,
  onRegionKeptToggle,
  onRegionExportToggle,
  selectedExportIds,
  height = 120,
}: WaveformTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const [hoverCursor, setHoverCursor] = useState<'pointer' | 'col-resize' | 'grab' | 'grabbing'>(
    'pointer',
  );
  const gestureRef = useRef<GestureState>(null);
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const justGesturedRef = useRef(false);

  const safeZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  const viewSpan = duration / safeZoom;
  const safeOffset = Math.max(0, Math.min(Math.max(0, duration - viewSpan), offset));
  const viewEnd = safeOffset + viewSpan;

  /** Helper: convert client x to time, taking the current viewport into account. */
  const pxToTime = (clientX: number): Seconds => {
    const canvas = canvasRef.current;
    if (!canvas || duration <= 0) return 0;
    const rect = canvas.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(duration, safeOffset + ratio * viewSpan));
  };

  // --- Static layer: waveform + region tinting + export-selection halos ---
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

    // Background
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const timeToX = (t: Seconds): number => ((t - safeOffset) / viewSpan) * cssWidth;

    if (duration > 0) {
      // Silence regions tinted rose, kept regions get an emerald halo when selected.
      for (const region of regions) {
        if (region.end < safeOffset || region.start > viewEnd) continue;
        const x = timeToX(region.start);
        const w = timeToX(region.end) - x;
        if (!region.kept) {
          ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
          ctx.fillRect(x, 0, w, cssHeight);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
          ctx.fillRect(x, 0, 1, cssHeight);
          ctx.fillRect(x + w - 1, 0, 1, cssHeight);
        } else if (selectedExportIds?.has(region.id)) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.16)';
          ctx.fillRect(x, 0, w, cssHeight);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.85)';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, 1, w - 2, cssHeight - 2);
        }
      }
    }

    // Waveform peaks: draw only the visible window.
    if (peaks && peaks.length > 0 && duration > 0) {
      const totalBins = peaks.length;
      const startBin = Math.max(0, Math.floor((safeOffset / duration) * totalBins));
      const endBin = Math.min(totalBins, Math.ceil((viewEnd / duration) * totalBins));
      const visible = peaks.subarray(startBin, endBin);
      const { min, max } = downsamplePeaks(visible, Math.floor(cssWidth));
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
  }, [
    peaks,
    regions,
    duration,
    height,
    safeZoom,
    safeOffset,
    viewSpan,
    viewEnd,
    selectedExportIds,
  ]);

  // --- Overlay layer: playhead + viewport scrollbar minimap ---
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

    if (duration > 0 && currentTime >= safeOffset && currentTime <= viewEnd) {
      const px = ((currentTime - safeOffset) / viewSpan) * cssWidth;
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, cssHeight);
      ctx.stroke();
    }

    // Mini-scrollbar at the bottom when zoomed
    if (safeZoom > 1 && duration > 0) {
      const trackY = cssHeight - 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(0, trackY, cssWidth, 3);
      const tx = (safeOffset / duration) * cssWidth;
      const tw = (viewSpan / duration) * cssWidth;
      ctx.fillStyle = 'rgba(165, 180, 252, 0.7)';
      ctx.fillRect(tx, trackY, Math.max(8, tw), 3);
    }
  }, [currentTime, duration, safeZoom, safeOffset, viewSpan, viewEnd]);

  const hitTestBoundary = (clientX: number): { regionId: string; side: 'start' | 'end' } | null => {
    const canvas = canvasRef.current;
    if (!canvas || duration <= 0) return null;
    const rect = canvas.getBoundingClientRect();
    const px = clientX - rect.left;
    const pxPerSec = rect.width / viewSpan;
    for (let i = 0; i < regions.length; i++) {
      const r = regions[i]!;
      if (r.end < safeOffset || r.start > viewEnd) continue;
      if (i > 0 && Math.abs((r.start - safeOffset) * pxPerSec - px) <= handlePx()) {
        return { regionId: r.id, side: 'start' };
      }
      if (i < regions.length - 1 && Math.abs((r.end - safeOffset) * pxPerSec - px) <= handlePx()) {
        return { regionId: r.id, side: 'end' };
      }
    }
    return null;
  };

  const regionAtClient = (clientX: number): Region | null => {
    const t = pxToTime(clientX);
    return regions.find((r) => t >= r.start && t <= r.end) ?? null;
  };

  // --- Global pointer listeners (drag survives off-canvas releases) ---
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const gesture = gestureRef.current;

      // Pinch zoom while two pointers are tracked.
      if (activePointers.current.size === 2 && onZoomChange) {
        const pts = [...activePointers.current.values()];
        const distance = Math.abs(pts[0]!.x - pts[1]!.x);
        if (!gesture || gesture.kind !== 'pinch') {
          const mid = (pts[0]!.x + pts[1]!.x) / 2;
          gestureRef.current = {
            kind: 'pinch',
            startDistance: distance || 1,
            startZoom: safeZoom,
            startOffset: safeOffset,
            anchorTime: pxToTime(mid),
          };
          return;
        }
        const ratio = distance / gesture.startDistance;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, gesture.startZoom * ratio));
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const midX = (pts[0]!.x + pts[1]!.x) / 2;
        const midRatio = (midX - rect.left) / rect.width;
        const newViewSpan = duration / newZoom;
        const newOffset = Math.max(
          0,
          Math.min(duration - newViewSpan, gesture.anchorTime - midRatio * newViewSpan),
        );
        onZoomChange(newZoom, newOffset);
        return;
      }

      if (!gesture) return;
      if (gesture.kind === 'boundary' && onBoundaryDrag) {
        gesture.didMove = true;
        onBoundaryDrag(gesture.regionId, gesture.side, pxToTime(e.clientX));
      } else if (gesture.kind === 'pan' && onZoomChange) {
        const dxPx = e.clientX - gesture.startClientX;
        if (Math.abs(dxPx) > TAP_THRESHOLD_PX) gesture.moved = true;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dx = (dxPx / rect.width) * viewSpan;
        const next = Math.max(0, Math.min(duration - viewSpan, gesture.startOffset - dx));
        onZoomChange(safeZoom, next);
      }
    };

    const finish = (e: PointerEvent) => {
      activePointers.current.delete(e.pointerId);
      if (activePointers.current.size < 2 && gestureRef.current?.kind === 'pinch') {
        gestureRef.current = null;
      }
      const gesture = gestureRef.current;
      if (!gesture) return;
      if (gesture.kind === 'boundary' && gesture.didMove) {
        justGesturedRef.current = true;
        onBoundaryDragEnd?.();
      } else if (gesture.kind === 'pan' && gesture.moved) {
        justGesturedRef.current = true;
      }
      gestureRef.current = null;
    };

    const cancel = () => {
      activePointers.current.clear();
      gestureRef.current = null;
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', cancel);
    window.addEventListener('blur', cancel);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', cancel);
      window.removeEventListener('blur', cancel);
    };
  }, [onBoundaryDrag, onBoundaryDragEnd, onZoomChange, duration, viewSpan, safeOffset, safeZoom]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size >= 2) {
      // Pinch start handled in pointermove.
      return;
    }
    const hit = hitTestBoundary(e.clientX);
    if (hit && onBoundaryDrag) {
      gestureRef.current = { kind: 'boundary', ...hit, didMove: false };
      e.currentTarget.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      setHoverCursor('grabbing');
      return;
    }
    // Default: start a pan that promotes to a tap on release.
    gestureRef.current = {
      kind: 'pan',
      startClientX: e.clientX,
      startOffset: safeOffset,
      moved: false,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setHoverCursor('grabbing');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gestureRef.current) return;
    if (hitTestBoundary(e.clientX)) setHoverCursor('col-resize');
    else setHoverCursor(safeZoom > 1 ? 'grab' : 'pointer');
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (justGesturedRef.current) {
      justGesturedRef.current = false;
      return;
    }
    if (hitTestBoundary(e.clientX)) return;
    if (e.detail === 2 && onRegionKeptToggle) {
      const region = regionAtClient(e.clientX);
      if (region) {
        onRegionKeptToggle(region.id);
        return;
      }
    }
    const t = pxToTime(e.clientX);
    onSeek?.(t);
    // Single tap on a kept region also toggles the export selection.
    const region = regionAtClient(e.clientX);
    if (region && region.kept && onRegionExportToggle) {
      onRegionExportToggle(region.id);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    if (duration <= 0) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const focus = safeOffset + ratio * viewSpan;
    if (e.ctrlKey || e.metaKey) {
      // Ctrl+wheel: zoom around the cursor.
      const factor = Math.exp(-e.deltaY * 0.0015);
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, safeZoom * factor));
      const newViewSpan = duration / newZoom;
      const newOffset = Math.max(0, Math.min(duration - newViewSpan, focus - ratio * newViewSpan));
      onZoomChange?.(newZoom, newOffset);
    } else {
      // Plain wheel: horizontal pan (only meaningful when zoomed in).
      if (safeZoom <= 1) return;
      const dx = (e.deltaY + e.deltaX) * (viewSpan / rect.width);
      const newOffset = Math.max(0, Math.min(duration - viewSpan, safeOffset + dx));
      onZoomChange?.(safeZoom, newOffset);
    }
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
    } else if ((e.key === '+' || e.code === 'Equal') && onZoomChange) {
      e.preventDefault();
      onZoomChange(Math.min(MAX_ZOOM, safeZoom * 1.5), safeOffset);
    } else if ((e.key === '-' || e.code === 'Minus') && onZoomChange) {
      e.preventDefault();
      const next = Math.max(MIN_ZOOM, safeZoom / 1.5);
      const newViewSpan = duration / next;
      onZoomChange(next, Math.max(0, Math.min(duration - newViewSpan, safeOffset)));
    }
  };

  return (
    <div
      style={{ position: 'relative', width: '100%', height, touchAction: 'none' }}
      onWheelCapture={(e) => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        role="slider"
        tabIndex={0}
        aria-label="Waveform timeline. Tap a kept region to add it to the export, double-tap to toggle keep, drag to pan, pinch or Ctrl+wheel to zoom."
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        style={{
          width: '100%',
          height,
          display: 'block',
          cursor: hoverCursor,
          touchAction: 'none',
        }}
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

/** Helper for callers: clamp a zoom + offset pair to the legal viewport. */
export function clampViewport(
  zoom: number,
  offset: Seconds,
  duration: Seconds,
): { zoom: number; offset: Seconds } {
  const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  const span = duration / z;
  return { zoom: z, offset: Math.max(0, Math.min(Math.max(0, duration - span), offset)) };
}

export { MIN_ZOOM, MAX_ZOOM };
