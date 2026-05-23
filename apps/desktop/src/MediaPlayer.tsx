import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { convertFileSrc } from '@tauri-apps/api/core';
import type { MediaSource, Region } from '@quietcut/core';
import { regionAtTime } from '@quietcut/core';

export interface MediaPlayerHandle {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  isPlaying: () => boolean;
}

interface Props {
  source: MediaSource;
  regions: Region[];
  /** When true, the player auto-seeks past non-kept regions during playback. */
  skipSilences: boolean;
  onTimeUpdate?: (t: number) => void;
}

export const MediaPlayer = forwardRef<MediaPlayerHandle, Props>(function MediaPlayer(
  { source, regions, skipSilences, onTimeUpdate },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const elRef = (): HTMLMediaElement | null => videoRef.current ?? audioRef.current;
  const url = convertFileSrc(source.path);
  // Latest regions stashed in a ref so the timeupdate handler can read them
  // without re-subscribing on every change.
  const regionsRef = useRef(regions);
  regionsRef.current = regions;
  const skipRef = useRef(skipSilences);
  skipRef.current = skipSilences;

  useImperativeHandle(
    ref,
    () => ({
      play: () => void elRef()?.play(),
      pause: () => elRef()?.pause(),
      toggle: () => {
        const el = elRef();
        if (!el) return;
        if (el.paused) void el.play();
        else el.pause();
      },
      seek: (time) => {
        const el = elRef();
        if (el) el.currentTime = time;
      },
      isPlaying: () => {
        const el = elRef();
        return !!el && !el.paused;
      },
    }),
    [],
  );

  useEffect(() => {
    const el = elRef();
    if (!el) return;
    const handler = () => {
      const t = el.currentTime;
      if (skipRef.current) {
        const r = regionAtTime(regionsRef.current, t);
        if (r && !r.kept) {
          // Jump to the end of the silence (= start of the next region).
          // Add a small epsilon so we don't re-trigger on the same boundary.
          const target = Math.min(el.duration || r.end, r.end + 0.001);
          if (target > t) {
            el.currentTime = target;
            return; // onTimeUpdate fires again after the seek
          }
        }
      }
      onTimeUpdate?.(t);
    };
    el.addEventListener('timeupdate', handler);
    return () => el.removeEventListener('timeupdate', handler);
  }, [onTimeUpdate, source.path]);

  if (source.hasVideo) {
    return (
      <video
        ref={videoRef}
        src={url}
        controls
        className="aspect-video w-full max-h-[50vh] rounded bg-black"
        preload="metadata"
      />
    );
  }
  return <audio ref={audioRef} src={url} controls className="w-full" preload="metadata" />;
});
