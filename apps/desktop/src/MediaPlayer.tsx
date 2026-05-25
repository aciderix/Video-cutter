import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { convertFileSrc } from '@tauri-apps/api/core';
import type { MediaSource, Region } from '@snipvox/core';
import { regionAtTime } from '@snipvox/core';

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

/**
 * The player drives currentTime through a `requestAnimationFrame` loop while
 * playing (smooth ~60 fps playhead) and through one-shot `seeked` events
 * otherwise. The skipSilences logic runs from the same handler so silences
 * are jumped over no matter how the playhead got there.
 *
 * `seek()` sets a short-lived "scrubbing" lock so a stale `timeupdate`
 * arriving after the seek doesn't roll React state back to the pre-seek
 * position — that was the source of the "press play after dragging resumes
 * from the pause point" bug.
 */
export const MediaPlayer = forwardRef<MediaPlayerHandle, Props>(function MediaPlayer(
  { source, regions, skipSilences, onTimeUpdate },
  ref,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const elRef = (): HTMLMediaElement | null => videoRef.current ?? audioRef.current;
  const url = convertFileSrc(source.path);

  const regionsRef = useRef(regions);
  regionsRef.current = regions;
  const skipRef = useRef(skipSilences);
  skipRef.current = skipSilences;
  const onTimeUpdateRef = useRef(onTimeUpdate);
  onTimeUpdateRef.current = onTimeUpdate;
  const scrubbingRef = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      play: () =>
        void elRef()
          ?.play()
          ?.catch(() => {}),
      pause: () => elRef()?.pause(),
      toggle: () => {
        const el = elRef();
        if (!el) return;
        if (el.paused) void el.play().catch(() => {});
        else el.pause();
      },
      seek: (time) => {
        const el = elRef();
        if (!el) return;
        scrubbingRef.current = true;
        onTimeUpdateRef.current?.(time);
        el.currentTime = time;
        const release = () => {
          scrubbingRef.current = false;
          el.removeEventListener('seeked', release);
        };
        el.addEventListener('seeked', release, { once: true });
        setTimeout(() => {
          if (scrubbingRef.current) scrubbingRef.current = false;
        }, 400);
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
    let rafId = 0;
    let unmounted = false;

    const sync = (force: boolean) => {
      const t = el.currentTime;
      if (skipRef.current) {
        const r = regionAtTime(regionsRef.current, t);
        if (r && !r.kept) {
          const target = Math.min(el.duration || r.end, r.end + 0.001);
          if (target > t + 0.001) {
            el.currentTime = target;
            return; // a `seeked` event will follow and call us back
          }
        }
      }
      if (force || !scrubbingRef.current) onTimeUpdateRef.current?.(t);
    };

    const tick = () => {
      if (unmounted) return;
      if (!el.paused) sync(false);
      rafId = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const onPause = () => sync(true);
    const onSeeked = () => sync(true);
    const onTimeUpdateEv = () => {
      if (!el.paused && !rafId) rafId = requestAnimationFrame(tick);
    };

    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('seeked', onSeeked);
    el.addEventListener('timeupdate', onTimeUpdateEv);
    sync(true);
    if (!el.paused) onPlay();

    return () => {
      unmounted = true;
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('seeked', onSeeked);
      el.removeEventListener('timeupdate', onTimeUpdateEv);
    };
  }, [source.path]);

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
