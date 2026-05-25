import { useEffect, useRef, useState } from 'react';
import type { Region, Seconds } from '@snipvox/core';
import { downsamplePeaks } from './peaks.ts';

export type PlayheadMode = 'free' | 'centered';

export interface WaveformTimelineProps {
  peaks: Float32Array | null;
  regions: Region[];
  duration: Seconds;
  currentTime: Seconds;
  /** Viewport zoom factor. 1 = whole clip, 4 = ¼ of the clip visible. */
  zoom?: number;
  /** Start time (seconds) of the current viewport. */
  offset?: Seconds;
  onZoomChange?: (zoom: number, offset: Seconds) => void;
  /**
   * Playhead behaviour:
   *  - 'free' (desktop default): the playhead moves through a fixed waveform.
   *    Tap to seek. Drag the body to pan when zoomed.
   *  - 'centered' (mobile): the playhead is pinned to the canvas centre and
   *    the waveform slides under it. Drag = scrub `currentTime`. Pinch zoom
   *    anchors on the playhead.
   */
  playheadMode?: PlayheadMode;
  onSeek?: (time: Seconds) => void;
  onBoundaryDrag?: (regionId: string, side: 'start' | 'end', time: Seconds) => void;
  onBoundaryDragEnd?: () => void;
  /** Tap on a region toggles its kept flag (works on both modes). */
  onRegionKeptToggle?: (regionId: string) => void;
  /** Optional: long-press on a region toggles the export selection. */
  onRegionExportToggle?: (regionId: string) => void;
  /** Region ids currently selected for export (drawn with an emerald halo). */
  selectedExportIds?: ReadonlySet<string>;
  height?: number;
}

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
/** Time before a press becomes a "long press" — used to toggle export. */
const LONG_PRESS_MS = 500;

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
  startCurrentTime: Seconds;
  moved: boolean;
}
interface PinchState {
  kind: 'pinch';
  startDistance: number;
  startZoom: number;
  startOffset: Seconds;
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
  playheadMode = 'free',
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
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressFired = useRef(false);

  const safeZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  const viewSpan = duration / safeZoom;
  // When the whole timeline already fits in the viewport there's nothing to
  // slide under a fixed playhead — fall back to a free-mode playhead that
  // tracks the actual currentTime, otherwise the cursor looks frozen and
  // dragging reads as a reversed scrub.
  const fullyVisible = duration > 0 && viewSpan >= duration - 1e-3;
  const effectiveCentered = playheadMode === 'centered' && !fullyVisible;
  const computedOffset = effectiveCentered
    ? clampOffset(currentTime - viewSpan / 2, duration, viewSpan)
    : clampOffset(offset, duration, viewSpan);
  const safeOffset = computedOffset;
  const viewEnd = safeOffset + viewSpan;

  /** Convert a clientX pixel to a media time, taking the viewport into account. */
  const pxToTime = (clientX: number): Seconds => {
    const canvas = canvasRef.current;
    if (!canvas || duration <= 0) return 0;
    const rect = canvas.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(duration, safeOffset + ratio * viewSpan));
  };

  // --- Static layer: tinted regions + filled mirrored waveform -------------
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

    // Background: subtle vertical gradient for depth.
    const bgGradient = ctx.createLinearGradient(0, 0, 0, cssHeight);
    bgGradient.addColorStop(0, '#0f1117');
    bgGradient.addColorStop(0.5, '#171a23');
    bgGradient.addColorStop(1, '#0f1117');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    // Faint mid-line so the waveform has a reference axis.
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.fillRect(0, Math.floor(cssHeight / 2), cssWidth, 1);

    const timeToX = (t: Seconds): number => ((t - safeOffset) / viewSpan) * cssWidth;

    if (duration > 0) {
      for (const region of regions) {
        if (region.end < safeOffset || region.start > viewEnd) continue;
        const x = timeToX(region.start);
        const w = timeToX(region.end) - x;
        if (!region.kept) {
          // Silence: warm rose tint with subtle vertical gradient.
          const g = ctx.createLinearGradient(0, 0, 0, cssHeight);
          g.addColorStop(0, 'rgba(244, 63, 94, 0.18)');
          g.addColorStop(0.5, 'rgba(244, 63, 94, 0.28)');
          g.addColorStop(1, 'rgba(244, 63, 94, 0.18)');
          ctx.fillStyle = g;
          ctx.fillRect(x, 0, w, cssHeight);
          ctx.fillStyle = 'rgba(244, 63, 94, 0.6)';
          ctx.fillRect(x, 0, 1, cssHeight);
          ctx.fillRect(x + w - 1, 0, 1, cssHeight);
        } else if (selectedExportIds?.has(region.id)) {
          // Kept + selected for export: emerald halo with a soft border.
          const g = ctx.createLinearGradient(0, 0, 0, cssHeight);
          g.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
          g.addColorStop(0.5, 'rgba(16, 185, 129, 0.22)');
          g.addColorStop(1, 'rgba(16, 185, 129, 0.12)');
          ctx.fillStyle = g;
          ctx.fillRect(x, 0, w, cssHeight);
          ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 0.75, 0.75, w - 1.5, cssHeight - 1.5);
        }
      }
    }

    // Waveform: filled bars mirrored around the centre with a vertical
    // gradient. The Audacity-style envelope feels more "alive" than the
    // 1 px lines we used before, and stays visible when zoomed in thanks
    // to the upsampling branch in `downsamplePeaks`.
    if (peaks && peaks.length > 0 && duration > 0) {
      const totalBins = peaks.length;
      const startBin = Math.max(0, Math.floor((safeOffset / duration) * totalBins));
      const endBin = Math.min(totalBins, Math.ceil((viewEnd / duration) * totalBins));
      const visible = peaks.subarray(startBin, endBin);
      const { min, max } = downsamplePeaks(visible, Math.floor(cssWidth));
      const mid = cssHeight / 2;
      const innerHeight = mid - 2;

      const grad = ctx.createLinearGradient(0, 0, 0, cssHeight);
      grad.addColorStop(0, '#c7d2fe');
      grad.addColorStop(0.5, '#6366f1');
      grad.addColorStop(1, '#c7d2fe');

      ctx.fillStyle = grad;
      // 1 px bars with hairline transparent gap on hi-DPI so it looks crisp.
      for (let x = 0; x < min.length; x++) {
        const peakUp = Math.abs(max[x]!);
        const peakDown = Math.abs(min[x]!);
        const hUp = Math.max(0.5, peakUp * innerHeight);
        const hDown = Math.max(0.5, peakDown * innerHeight);
        ctx.fillRect(x, mid - hUp, 1, hUp + hDown);
      }

      // Soft glow underneath, only visible if the canvas is big enough.
      ctx.shadowColor = 'rgba(99, 102, 241, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(165, 180, 252, 0.0)';
      ctx.fillRect(0, mid - 0.5, cssWidth, 1);
      ctx.shadowBlur = 0;
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

  // --- Overlay layer: playhead + scrollbar mini ---------------------------
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
      const px = effectiveCentered
        ? cssWidth / 2
        : currentTime >= safeOffset && currentTime <= viewEnd
          ? ((currentTime - safeOffset) / viewSpan) * cssWidth
          : -10;
      if (px >= 0) {
        // Triangular handle at the top for tactile feel, then a vertical line.
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(px - 5, 0);
        ctx.lineTo(px + 5, 0);
        ctx.lineTo(px, 8);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, cssHeight);
        ctx.stroke();
      }
    }

    if (safeZoom > 1 && duration > 0) {
      const trackY = cssHeight - 4;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.fillRect(0, trackY, cssWidth, 3);
      const tx = (safeOffset / duration) * cssWidth;
      const tw = (viewSpan / duration) * cssWidth;
      ctx.fillStyle = 'rgba(165, 180, 252, 0.7)';
      ctx.fillRect(tx, trackY, Math.max(8, tw), 3);
    }
  }, [currentTime, duration, safeZoom, safeOffset, viewSpan, viewEnd, effectiveCentered]);

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

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // --- Global pointer listeners ---
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const gesture = gestureRef.current;

      if (activePointers.current.size === 2 && onZoomChange) {
        const pts = [...activePointers.current.values()];
        const distance = Math.abs(pts[0]!.x - pts[1]!.x);
        if (!gesture || gesture.kind !== 'pinch') {
          const mid = (pts[0]!.x + pts[1]!.x) / 2;
          const anchorTime = effectiveCentered ? currentTime : pxToTime(mid);
          gestureRef.current = {
            kind: 'pinch',
            startDistance: distance || 1,
            startZoom: safeZoom,
            startOffset: safeOffset,
            anchorTime,
          };
          cancelLongPress();
          return;
        }
        const ratio = distance / gesture.startDistance;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, gesture.startZoom * ratio));
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const midX = (pts[0]!.x + pts[1]!.x) / 2;
        const midRatio = effectiveCentered ? 0.5 : (midX - rect.left) / rect.width;
        const newViewSpan = duration / newZoom;
        const newOffset = effectiveCentered
          ? 0 // centered mode recomputes offset on each render
          : Math.max(
              0,
              Math.min(duration - newViewSpan, gesture.anchorTime - midRatio * newViewSpan),
            );
        onZoomChange(newZoom, newOffset);
        return;
      }

      if (!gesture) return;
      cancelLongPress();
      if (gesture.kind === 'boundary' && onBoundaryDrag) {
        gesture.didMove = true;
        onBoundaryDrag(gesture.regionId, gesture.side, pxToTime(e.clientX));
      } else if (gesture.kind === 'pan') {
        const dxPx = e.clientX - gesture.startClientX;
        if (Math.abs(dxPx) > TAP_THRESHOLD_PX) gesture.moved = true;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dt = (dxPx / rect.width) * viewSpan;
        if (effectiveCentered && onSeek) {
          // Dragging the waveform under the fixed playhead = scrubbing.
          const target = Math.max(0, Math.min(duration, gesture.startCurrentTime - dt));
          onSeek(target);
        } else if (playheadMode === 'centered' && onSeek) {
          // Fully-visible centered fallback: nothing to pan, so scrub the
          // playhead directly to where the finger is.
          onSeek(pxToTime(e.clientX));
        } else if (onZoomChange) {
          const next = Math.max(0, Math.min(duration - viewSpan, gesture.startOffset - dt));
          onZoomChange(safeZoom, next);
        }
      }
    };

    const finish = (e: PointerEvent) => {
      activePointers.current.delete(e.pointerId);
      if (activePointers.current.size < 2 && gestureRef.current?.kind === 'pinch') {
        gestureRef.current = null;
      }
      cancelLongPress();
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
      cancelLongPress();
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
  }, [
    onBoundaryDrag,
    onBoundaryDragEnd,
    onZoomChange,
    onSeek,
    duration,
    viewSpan,
    safeOffset,
    safeZoom,
    currentTime,
    playheadMode,
    effectiveCentered,
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (activePointers.current.size >= 2) return;

    const hit = hitTestBoundary(e.clientX);
    if (hit && onBoundaryDrag) {
      gestureRef.current = { kind: 'boundary', ...hit, didMove: false };
      e.currentTarget.setPointerCapture?.(e.pointerId);
      e.preventDefault();
      setHoverCursor('grabbing');
      return;
    }
    gestureRef.current = {
      kind: 'pan',
      startClientX: e.clientX,
      startOffset: safeOffset,
      startCurrentTime: currentTime,
      moved: false,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setHoverCursor('grabbing');

    // Long-press → export-selection toggle. Cancelled as soon as the user
    // actually drags (see onPointerMove).
    longPressFired.current = false;
    if (onRegionExportToggle) {
      const clientX = e.clientX;
      cancelLongPress();
      longPressTimer.current = setTimeout(() => {
        const region = regionAtClient(clientX);
        if (region && region.kept) {
          longPressFired.current = true;
          onRegionExportToggle(region.id);
        }
      }, LONG_PRESS_MS);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gestureRef.current) return;
    if (hitTestBoundary(e.clientX)) setHoverCursor('col-resize');
    else if (effectiveCentered) setHoverCursor('grab');
    else setHoverCursor(safeZoom > 1 ? 'grab' : 'pointer');
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (justGesturedRef.current || longPressFired.current) {
      justGesturedRef.current = false;
      longPressFired.current = false;
      return;
    }
    if (hitTestBoundary(e.clientX)) return;
    const t = pxToTime(e.clientX);
    // Free mode (incl. centered fallback at full visibility): tap seeks.
    // Centered mode with a zoomed-in viewport: drag handles the seek, so a
    // tap acts purely as the kept-toggle.
    if (!effectiveCentered) onSeek?.(t);
    const region = regionAtClient(e.clientX);
    if (region && onRegionKeptToggle) {
      onRegionKeptToggle(region.id);
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
      const factor = Math.exp(-e.deltaY * 0.0015);
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, safeZoom * factor));
      const newViewSpan = duration / newZoom;
      const newOffset = Math.max(0, Math.min(duration - newViewSpan, focus - ratio * newViewSpan));
      onZoomChange?.(newZoom, newOffset);
    } else {
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
    <div style={{ position: 'relative', width: '100%', height, touchAction: 'none' }}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
        role="slider"
        tabIndex={0}
        aria-label={
          playheadMode === 'centered'
            ? 'Waveform timeline. Drag horizontally to scrub. Tap a region to toggle it. Pinch to zoom.'
            : 'Waveform timeline. Tap to seek and toggle the region under the cursor. Drag the body to pan. Pinch or Ctrl+wheel to zoom.'
        }
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
        style={{ position: 'absolute', inset: 0, width: '100%', height, pointerEvents: 'none' }}
      />
    </div>
  );
}

function clampOffset(offset: Seconds, duration: Seconds, viewSpan: Seconds): Seconds {
  return Math.max(0, Math.min(Math.max(0, duration - viewSpan), offset));
}

export function clampViewport(
  zoom: number,
  offset: Seconds,
  duration: Seconds,
): { zoom: number; offset: Seconds } {
  const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
  const span = duration / z;
  return { zoom: z, offset: clampOffset(offset, duration, span) };
}

export { MIN_ZOOM, MAX_ZOOM };
