import { useEffect, useRef } from 'react';
import type { CleanAudioOverlay } from '@snipvox/core';
import { resolveOverlaps } from '@snipvox/core';

interface Props {
  overlays: CleanAudioOverlay[];
  duration: number;
  /** Zoom + offset shared with the main timeline so the strip lines up
   * pixel-for-pixel under the waveform. */
  zoom: number;
  viewOffset: number;
  height?: number;
}

/**
 * One-pixel-tall band under the waveform that paints where each
 * overlay's segments live on the reference timeline. Higher-confidence
 * overlays win on collisions thanks to `resolveOverlaps`. Colour rotates
 * deterministically per overlay id so two takes get distinct hues.
 */
export function OverlayStrip({ overlays, duration, zoom, viewOffset, height = 20 }: Props) {
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
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    ctx.fillStyle = '#0c0d12';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    if (duration <= 0 || overlays.length === 0) {
      ctx.fillStyle = 'rgba(160,160,180,0.4)';
      ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('Clean audio overlays appear here once aligned.', 8, cssHeight - 6);
      return;
    }

    const viewSpan = duration / Math.max(1, zoom);
    const viewEnd = viewOffset + viewSpan;
    const timeToX = (t: number): number => ((t - viewOffset) / viewSpan) * cssWidth;

    const colors: Record<string, string> = {};
    const palette = ['#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#22d3ee'];
    overlays.forEach((o, i) => {
      colors[o.id] = palette[i % palette.length]!;
    });

    const resolved = resolveOverlaps(overlays, duration);
    for (const seg of resolved) {
      if (seg.referenceEndS < viewOffset || seg.referenceStartS > viewEnd) continue;
      const x = timeToX(seg.referenceStartS);
      const w = Math.max(1, timeToX(seg.referenceEndS) - x);
      const c = colors[seg.overlayId] ?? '#34d399';
      ctx.fillStyle = c + '40'; // RGBA-ish alpha by hex byte
      ctx.fillRect(x, 2, w, cssHeight - 4);
      ctx.fillStyle = c;
      ctx.fillRect(x, 2, w, 2);
    }
  }, [overlays, duration, zoom, viewOffset, height]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Clean audio overlay segments"
      style={{ width: '100%', height, display: 'block' }}
    />
  );
}
