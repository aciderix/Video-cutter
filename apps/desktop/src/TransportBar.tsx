import { useEffect, useState } from 'react';
import { Button } from '@quietcut/ui';
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
 * Compact transport bar above the timeline. Play/pause + a tiny digital
 * clock + zoom controls. Polls the player every 200 ms to reflect the
 * paused state (HTMLMediaElement doesn't fire a 'paused' event after
 * a seek, so listening to that alone misses cases).
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
    <div className="flex items-center gap-2 px-1">
      <button
        type="button"
        onClick={toggle}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow shadow-indigo-950 hover:bg-indigo-500 active:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <PauseIcon className="h-4 w-4" />
        ) : (
          <PlayIcon className="h-4 w-4 translate-x-[1px]" />
        )}
      </button>
      <code className="text-xs text-zinc-400 font-mono tabular-nums">
        {formatTime(currentTime)} / {formatTime(duration)}
      </code>
      <div className="ml-auto flex items-center gap-1.5 text-xs text-zinc-400">
        <span className="font-mono tabular-nums">×{zoom.toFixed(1)}</span>
        <Button variant="ghost" size="sm" onClick={onZoomOut} aria-label="Zoom out">
          −
        </Button>
        <Button variant="ghost" size="sm" onClick={onZoomIn} aria-label="Zoom in">
          +
        </Button>
        <Button variant="ghost" size="sm" onClick={onZoomFit} aria-label="Fit zoom to clip">
          Fit
        </Button>
        {onJumpToPlayhead && zoom > 1 && (
          <Button variant="ghost" size="sm" onClick={onJumpToPlayhead}>
            Center
          </Button>
        )}
      </div>
    </div>
  );
}

function formatTime(t: number): string {
  if (!isFinite(t) || t < 0) return '0:00.000';
  const m = Math.floor(t / 60);
  const s = t - m * 60;
  const padded = s.toFixed(3).padStart(6, '0');
  return `${m}:${padded}`;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
