import { useEffect, useState } from 'react';
import { Pause, Play, Crosshair, ZoomIn, ZoomOut } from 'lucide-react';
import type { MediaPlayerHandle } from './MediaPlayer.tsx';

interface Props {
  player: React.RefObject<MediaPlayerHandle | null>;
  currentTime: number;
  duration: number;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onJumpToPlayhead?: () => void;
}

/**
 * Compact transport bar above the timeline. Mirrors the mobile style:
 * white round play button on the left, mono clock next to it, then a
 * zoom pill (− / Fit / +) on the right. The play-state poll runs every
 * 200 ms — HTMLMediaElement doesn't fire a discrete event after a seek,
 * so listening to play/pause alone misses some transitions.
 */
export function TransportBar({
  player,
  currentTime,
  duration,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onJumpToPlayhead,
}: Props) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaying(player.current?.isPlaying() ?? false);
    }, 200);
    return () => clearInterval(interval);
  }, [player]);

  const toggle = () => player.current?.toggle();

  return (
    <div className="flex items-center gap-3 px-1">
      <button
        type="button"
        onClick={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-950 shadow-md shadow-black/30 hover:bg-zinc-200 active:bg-zinc-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400 transition-colors"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <Pause size={18} fill="currentColor" />
        ) : (
          <Play size={18} fill="currentColor" className="ml-[1px]" />
        )}
      </button>
      <div className="flex flex-col leading-none">
        <span className="font-mono text-sm tabular-nums text-zinc-100">
          {formatTime(currentTime)}
        </span>
        <span className="font-mono text-[10px] text-zinc-500 mt-0.5">/ {formatTime(duration)}</span>
      </div>

      <div className="ml-auto flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900 p-1">
        <button
          onClick={onZoomOut}
          className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-200 active:text-zinc-100 rounded-full"
          aria-label="Zoom out"
        >
          <ZoomOut size={14} />
        </button>
        <button
          onClick={onZoomFit}
          className="px-2 h-7 text-[10px] font-semibold uppercase tracking-wider text-zinc-300 hover:text-white"
          aria-label="Fit zoom to clip"
        >
          ×{zoom.toFixed(1)}
        </button>
        <button
          onClick={onZoomIn}
          className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-200 active:text-zinc-100 rounded-full"
          aria-label="Zoom in"
        >
          <ZoomIn size={14} />
        </button>
        {onJumpToPlayhead && zoom > 1 && (
          <button
            onClick={onJumpToPlayhead}
            className="ml-1 w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-zinc-200 rounded-full"
            aria-label="Center on playhead"
            title="Center on playhead"
          >
            <Crosshair size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

function formatTime(t: number): string {
  if (!isFinite(t) || t < 0) return '0:00.000';
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  return `${m}:${s.toFixed(3).padStart(6, '0')}`;
}
