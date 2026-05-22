import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { convertFileSrc } from '@tauri-apps/api/core';
import type { MediaSource } from '@quietcut/core';

export interface MediaPlayerHandle {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (time: number) => void;
  isPlaying: () => boolean;
}

interface Props {
  source: MediaSource;
  onTimeUpdate?: (t: number) => void;
}

export const MediaPlayer = forwardRef<MediaPlayerHandle, Props>(function MediaPlayer(
  { source, onTimeUpdate },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const elRef = (): HTMLMediaElement | null => videoRef.current ?? audioRef.current;
  const url = convertFileSrc(source.path);

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
    if (!el || !onTimeUpdate) return;
    const handler = () => onTimeUpdate(el.currentTime);
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
