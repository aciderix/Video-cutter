import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Slider } from '@snipvox/ui';
import { WaveformTimeline, clampViewport, MAX_ZOOM, MIN_ZOOM } from '@snipvox/timeline';
import {
  DEFAULT_DETECTION,
  alignAudioBuffers,
  buildRegionsFromSilences,
  coveredReferenceDurationS,
  estimateNoiseFloorDb,
  outputDuration,
  resolveOverlaps,
  samplesToPeaks,
  toggleKept,
  vadFromSamples,
  type CleanAudioOverlay,
  type MediaSource,
  type Region,
  type SilenceDetectionSettings,
} from '@snipvox/core';
import {
  buildOverlayExport,
  exportEDL,
  exportFCPXML,
  exportOTIO,
  exportResolveMarkers,
} from '@snipvox/exporters';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {
  MOBILE_FORMAT_PRESETS,
  defaultMobilePreset,
  exportPerRegion,
  exportSingleFile,
  exportSingleFileWithOverlays,
  findMobilePreset,
} from './ffmpegMobile.ts';
import {
  Check,
  Download,
  FileAudio,
  Layers,
  ListVideo,
  Loader2,
  Pause,
  Play,
  Plus,
  RotateCw,
  Settings2,
  SquarePlay,
  Trash2,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

type NleFormat = 'fcpxml' | 'otio' | 'edl' | 'resolve';
const NLE: Record<NleFormat, { label: string; ext: string; build: typeof exportEDL }> = {
  fcpxml: { label: 'FCPXML', ext: 'fcpxml', build: exportFCPXML },
  otio: { label: 'OTIO', ext: 'otio', build: exportOTIO },
  edl: { label: 'EDL', ext: 'edl', build: exportEDL },
  resolve: { label: 'Markers', ext: 'txt', build: exportResolveMarkers },
};

type TabId = 'export' | 'settings' | 'sync' | 'regions';
type AudioMode = 'camera' | 'mix' | 'cleanOnly';

interface OverlayState extends CleanAudioOverlay {
  /** Cached mono samples so re-align doesn't re-decode. */
  cachedSamples?: Float32Array;
  /** Sample rate of the cached samples (post-decode, normally 16 kHz). */
  cachedSampleRate?: number;
  /** Full-quality decoded buffer for in-app preview through Web Audio. */
  cachedAudioBuffer?: AudioBuffer;
  /** Downsampled |amplitude| peaks for the stacked waveform strip. */
  peaks?: Float32Array;
  /** In-memory File handle for ffmpeg.wasm to read on export. */
  file?: File;
}

// Module-scoped Web Audio context used both for overlay decoding and
// for routing the camera audio + scheduling overlay playback. Lazy so
// we don't create one on mount (iOS suspends it until user gesture).
let _previewCtx: AudioContext | null = null;
function getPreviewContext(): AudioContext {
  if (!_previewCtx) {
    const AC =
      window.AudioContext ||
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!;
    _previewCtx = new AC();
  }
  return _previewCtx;
}

export function App() {
  const [source, setSource] = useState<MediaSource | null>(null);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [peaks, setPeaks] = useState<Float32Array | null>(null);
  const [settings, setSettings] = useState<SilenceDetectionSettings>(DEFAULT_DETECTION);
  const [currentTime, setCurrentTime] = useState(0);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [skipSilences, setSkipSilences] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string> | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('export');
  const [overlays, setOverlays] = useState<OverlayState[]>([]);
  const [aligningId, setAligningId] = useState<string | null>(null);
  const [alignProgress, setAlignProgress] = useState(0);
  const [audioMode, setAudioMode] = useState<AudioMode>('mix');

  const timelineHeight = 110;
  const [zoom, setZoom] = useState(1);
  const [viewOffset, setViewOffset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [formatId, setFormatId] = useState<string>('mp4-h264');
  const [exportMode, setExportMode] = useState<'single' | 'perSegment'>('single');
  const [progress, setProgress] = useState<{ pct: number; label?: string } | null>(null);

  const samplesRef = useRef<Float32Array | null>(null);
  const sampleRateRef = useRef<number>(48_000);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const player = (): HTMLMediaElement | null => videoRef.current ?? audioRef.current;

  const regionsRef = useRef(regions);
  regionsRef.current = regions;
  const skipSilencesRef = useRef(skipSilences);
  skipSilencesRef.current = skipSilences;
  const scrubbingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  useEffect(() => {
    if (!source) return;
    const current = findMobilePreset(formatId);
    if (!current || (current.hasVideo && !source.hasVideo)) {
      setFormatId(defaultMobilePreset(source.hasVideo).id);
    }
  }, [source, formatId]);

  const effectiveSelected = useMemo<Set<string>>(() => {
    if (selectedIds) return selectedIds;
    return new Set(regions.filter((r) => r.kept).map((r) => r.id));
  }, [selectedIds, regions]);

  const selectedRegions = useMemo(
    () => regions.filter((r) => effectiveSelected.has(r.id)),
    [regions, effectiveSelected],
  );

  const usableOverlays = useMemo(
    () => overlays.filter((o) => o.enabled && o.segments.length > 0),
    [overlays],
  );

  // RAF-driven playhead, scrubbingRef lock, skipSilences. Same shape as
  // desktop — see MediaPlayer.tsx for the reasoning.
  useEffect(() => {
    const el = player();
    if (!el) return;
    let rafId = 0;
    let unmounted = false;

    const sync = (force: boolean) => {
      const t = el.currentTime;
      if (skipSilencesRef.current) {
        const r = regionsRef.current.find((reg) => t >= reg.start && t <= reg.end);
        if (r && !r.kept) {
          const target = Math.min(el.duration || r.end, r.end + 0.001);
          if (target > t + 0.001) {
            el.currentTime = target;
            return;
          }
        }
      }
      if (force || !scrubbingRef.current) setCurrentTime(t);
    };

    const tick = () => {
      if (unmounted) return;
      if (!el.paused) sync(false);
      rafId = requestAnimationFrame(tick);
    };

    const onPlay = () => {
      setPlaying(true);
      if (!rafId) rafId = requestAnimationFrame(tick);
    };
    const onPause = () => {
      setPlaying(false);
      sync(true);
    };
    const onSeeked = () => sync(true);
    const onTimeUpdate = () => {
      if (!el.paused && !rafId) rafId = requestAnimationFrame(tick);
    };

    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('seeked', onSeeked);
    el.addEventListener('timeupdate', onTimeUpdate);
    sync(true);
    if (!el.paused) onPlay();

    return () => {
      unmounted = true;
      if (rafId) cancelAnimationFrame(rafId);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('seeked', onSeeked);
      el.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, [objectUrl]);

  const togglePlay = () => {
    const el = player();
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  };

  // --- Preview audio mixer ----------------------------------------------
  // Routes the <video>/<audio> element through Web Audio so the camera
  // gain can be ducked or muted, and schedules BufferSources for each
  // aligned overlay slice so the user actually hears the clean track
  // during playback. The graph attaches lazily on first non-camera mode
  // because createMediaElementSource is one-way (no native fallback).
  const previewAttachedRef = useRef(false);
  const cameraGainRef = useRef<GainNode | null>(null);
  const previewSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const attachPreviewGraph = useCallback(() => {
    if (previewAttachedRef.current) return;
    const media = player();
    if (!media) return;
    const ctx = getPreviewContext();
    try {
      const src = ctx.createMediaElementSource(media);
      const gain = ctx.createGain();
      gain.gain.value = 1;
      src.connect(gain).connect(ctx.destination);
      cameraGainRef.current = gain;
      previewAttachedRef.current = true;
    } catch {
      // Already attached or unsupported — keep native playback.
    }
  }, []);

  const cancelOverlaySources = useCallback(() => {
    for (const s of previewSourcesRef.current) {
      try {
        s.stop();
      } catch {
        /* already stopped */
      }
      try {
        s.disconnect();
      } catch {
        /* ignore */
      }
    }
    previewSourcesRef.current = [];
  }, []);

  const reschedulePreview = useCallback(() => {
    const media = player();
    if (!media || !source) return;
    cancelOverlaySources();

    if (audioMode === 'camera' || usableOverlays.length === 0) {
      const g = cameraGainRef.current;
      if (g) {
        const t = getPreviewContext().currentTime;
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(1, t);
      }
      return;
    }

    attachPreviewGraph();
    const ctx = getPreviewContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const g = cameraGainRef.current;
    if (!g) return;

    const t0 = ctx.currentTime;
    const m0 = media.currentTime;
    const RAMP = 0.008; // 8 ms fade to avoid zipper noise at duck edges.
    const uncoveredVal = audioMode === 'cleanOnly' ? 0 : 1;

    g.gain.cancelScheduledValues(t0);
    g.gain.setValueAtTime(uncoveredVal, t0);

    if (media.paused) return;

    const segs = resolveOverlaps(usableOverlays, source.duration).sort(
      (a, b) => a.referenceStartS - b.referenceStartS,
    );

    // Build a union of covered reference intervals so back-to-back or
    // overlapping segments produce one continuous duck instead of a
    // flicker between 0 and 1 at every micro-boundary.
    const covered: Array<[number, number]> = [];
    for (const s of segs) {
      const last = covered[covered.length - 1];
      if (last && s.referenceStartS <= last[1] + 0.01) {
        last[1] = Math.max(last[1], s.referenceEndS);
      } else {
        covered.push([s.referenceStartS, s.referenceEndS]);
      }
    }

    if (audioMode === 'mix') {
      for (const [refS, refE] of covered) {
        if (refE <= m0) continue;
        const startCtx = t0 + Math.max(0, refS - m0);
        const endCtx = t0 + Math.max(0, refE - m0);
        g.gain.setValueAtTime(uncoveredVal, Math.max(t0, startCtx - RAMP));
        g.gain.linearRampToValueAtTime(0, startCtx);
        g.gain.setValueAtTime(0, Math.max(startCtx, endCtx - RAMP));
        g.gain.linearRampToValueAtTime(uncoveredVal, endCtx);
      }
    }

    for (const seg of segs) {
      if (seg.referenceEndS <= m0) continue;
      const overlay = usableOverlays.find((o) => o.id === seg.overlayId);
      const buf = overlay?.cachedAudioBuffer;
      if (!buf) continue;
      const refStart = Math.max(seg.referenceStartS, m0);
      const offsetInSeg = refStart - seg.referenceStartS;
      const candStart = Math.max(0, Math.min(buf.duration, seg.candidateStartS + offsetInSeg));
      const segDur = seg.referenceEndS - refStart;
      const dur = Math.max(0, Math.min(segDur, buf.duration - candStart));
      if (dur <= 0) continue;
      const startInCtx = t0 + Math.max(0, seg.referenceStartS - m0);
      const node = ctx.createBufferSource();
      node.buffer = buf;
      node.connect(ctx.destination);
      try {
        node.start(startInCtx, candStart, dur);
      } catch {
        continue;
      }
      previewSourcesRef.current.push(node);
    }
  }, [audioMode, usableOverlays, source, attachPreviewGraph, cancelOverlaySources]);

  useEffect(() => {
    const media = player();
    if (!media) return;
    const onPlay = () => reschedulePreview();
    const onPause = () => cancelOverlaySources();
    const onSeeked = () => {
      if (!media.paused) reschedulePreview();
    };
    const onEnded = () => cancelOverlaySources();

    media.addEventListener('play', onPlay);
    media.addEventListener('pause', onPause);
    media.addEventListener('seeked', onSeeked);
    media.addEventListener('ended', onEnded);
    reschedulePreview();

    return () => {
      media.removeEventListener('play', onPlay);
      media.removeEventListener('pause', onPause);
      media.removeEventListener('seeked', onSeeked);
      media.removeEventListener('ended', onEnded);
      cancelOverlaySources();
    };
  }, [reschedulePreview, cancelOverlaySources, objectUrl]);

  const onViewportChange = (z: number, off: number) => {
    if (!source) return;
    const c = clampViewport(z, off, source.duration);
    setZoom(c.zoom);
    setViewOffset(c.offset);
  };
  const zoomIn = () => source && setZoom(Math.min(MAX_ZOOM, zoom * 1.6));
  const zoomOut = () => source && setZoom(Math.max(MIN_ZOOM, zoom / 1.6));
  const zoomFit = () => {
    setZoom(1);
    setViewOffset(0);
  };

  /**
   * Decode + analyze a freshly opened media file. Requests a 16 kHz
   * AudioContext when the browser supports it — drops mobile RAM
   * usage 3× compared to 48 kHz and prevents iOS OOM crashes on long
   * clips. Falls back to the default rate if Safari refuses.
   */
  const analyze = useCallback(
    async (file: File) => {
      setError(null);
      setStatus('Loading…');
      setBusy(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const AudioCtx =
          window.AudioContext ||
          (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!;
        let ctx: AudioContext;
        try {
          ctx = new AudioCtx({ sampleRate: 16_000 });
        } catch {
          ctx = new AudioCtx();
        }
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        const mono = new Float32Array(audioBuffer.length);
        for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
          const data = audioBuffer.getChannelData(ch);
          for (let i = 0; i < data.length; i++) mono[i]! += data[i]! / audioBuffer.numberOfChannels;
        }
        samplesRef.current = mono;
        sampleRateRef.current = audioBuffer.sampleRate;
        void ctx.close();

        const src: MediaSource = {
          id: `m-${Date.now()}`,
          path: file.name,
          name: file.name,
          duration: audioBuffer.duration,
          hasVideo: file.type.startsWith('video/'),
          hasAudio: true,
          audioStream: {
            sampleRate: audioBuffer.sampleRate,
            channels: audioBuffer.numberOfChannels,
            codec: 'web-audio',
          },
        };

        const intervals = vadFromSamples(mono, audioBuffer.sampleRate, settings);
        const regs = buildRegionsFromSilences(audioBuffer.duration, intervals, settings);
        const wave = samplesToPeaks(mono, 2048);

        setSource(src);
        setSourceFile(file);
        setRegions(regs);
        setPeaks(wave);
        setCurrentTime(0);
        setSelectedIds(null);
        setZoom(1);
        setViewOffset(0);
        setOverlays([]);
        setFormatId(defaultMobilePreset(src.hasVideo).id);

        if (objectUrl) URL.revokeObjectURL(objectUrl);
        setObjectUrl(URL.createObjectURL(file));
        setStatus(`${regs.filter((r) => !r.kept).length} silences found`);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setBusy(false);
      }
    },
    [settings, objectUrl],
  );

  const reanalyze = useCallback(() => {
    const samples = samplesRef.current;
    const sr = sampleRateRef.current;
    if (!samples || !source) return;
    const intervals = vadFromSamples(samples, sr, settings);
    setRegions(buildRegionsFromSilences(source.duration, intervals, settings));
    setSelectedIds(null);
  }, [settings, source]);

  const toggleRegionSelection = (id: string) => {
    const next = new Set(effectiveSelected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // --- Overlays + alignment -----------------------------------------

  /**
   * Decode an overlay file with Web Audio and run the TS MFCC + DTW
   * alignment against the master source. Runs synchronously on the JS
   * thread (no Web Worker for now — the FFT is fast enough for the
   * 30-second-class clips users usually paste in).
   */
  const addOverlay = async (file: File) => {
    if (!source || !samplesRef.current) return;
    setError(null);
    setStatus(`Decoding ${file.name}…`);
    setBusy(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const ctx = getPreviewContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const mono = new Float32Array(audioBuffer.length);
      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const data = audioBuffer.getChannelData(ch);
        for (let i = 0; i < data.length; i++) mono[i]! += data[i]! / audioBuffer.numberOfChannels;
      }
      const overlaySr = audioBuffer.sampleRate;

      const id = `ov-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
      const overlayPeaks = samplesToPeaks(mono, 1024);
      const draft: OverlayState = {
        id,
        name: file.name,
        path: file.name,
        durationS: audioBuffer.duration,
        sampleRate: overlaySr,
        channels: audioBuffer.numberOfChannels,
        segments: [],
        globalOffsetS: 0,
        globalConfidence: 0,
        enabled: true,
        cachedSamples: mono,
        cachedSampleRate: overlaySr,
        cachedAudioBuffer: audioBuffer,
        peaks: overlayPeaks,
        file,
      };
      setOverlays((prev) => [...prev, draft]);
      setAligningId(id);
      setAlignProgress(0);
      setStatus('Aligning…');

      // Run alignment off the next tick so the spinner has a chance
      // to render before we go heads-down.
      await new Promise((r) => setTimeout(r, 16));
      const report = await alignAudioBuffers(
        { samples: samplesRef.current, sampleRate: sampleRateRef.current },
        { samples: mono, sampleRate: overlaySr },
        {
          mode: 'segmented',
          chunkSeconds: 5,
          minConfidence: 0.2,
          onProgress: (ratio) => setAlignProgress(ratio),
        },
      );

      setOverlays((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                segments: report.segments,
                globalOffsetS: report.globalOffsetS,
                globalConfidence: report.globalConfidence,
              }
            : o,
        ),
      );
      setStatus(
        report.segments.length === 0
          ? `No alignment found for ${file.name}`
          : `${report.segments.length} aligned segment(s) (${(report.globalConfidence * 100).toFixed(0)}% conf)`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setAligningId(null);
      setAlignProgress(0);
      setBusy(false);
    }
  };

  const removeOverlay = (id: string) => setOverlays((prev) => prev.filter((o) => o.id !== id));
  const toggleOverlay = (id: string) =>
    setOverlays((prev) => prev.map((o) => (o.id === id ? { ...o, enabled: !o.enabled } : o)));

  const realignOverlay = async (id: string) => {
    if (!source || !samplesRef.current) return;
    const o = overlays.find((x) => x.id === id);
    if (!o || !o.cachedSamples || !o.cachedSampleRate) return;
    setAligningId(id);
    setAlignProgress(0);
    setStatus('Re-aligning…');
    try {
      await new Promise((r) => setTimeout(r, 16));
      const report = await alignAudioBuffers(
        { samples: samplesRef.current, sampleRate: sampleRateRef.current },
        { samples: o.cachedSamples, sampleRate: o.cachedSampleRate },
        {
          mode: 'segmented',
          chunkSeconds: 5,
          minConfidence: 0.2,
          onProgress: (ratio) => setAlignProgress(ratio),
        },
      );
      setOverlays((prev) =>
        prev.map((x) =>
          x.id === id
            ? {
                ...x,
                segments: report.segments,
                globalOffsetS: report.globalOffsetS,
                globalConfidence: report.globalConfidence,
              }
            : x,
        ),
      );
      setStatus(`${report.segments.length} aligned segment(s)`);
    } finally {
      setAligningId(null);
      setAlignProgress(0);
    }
  };

  const writeAndShare = async (blob: Blob, filename: string, title: string): Promise<string> => {
    const dataUrl = await blobToDataUrl(blob);
    const written = await Filesystem.writeFile({
      path: filename,
      data: dataUrl.split(',')[1] ?? '',
      directory: Directory.Cache,
    });
    try {
      await Share.share({
        title,
        text: title,
        url: written.uri,
        dialogTitle: `Share ${filename}`,
      });
      return `Shared ${filename}`;
    } catch {
      return `Saved to ${written.uri}`;
    }
  };

  const doExport = async () => {
    if (!source || !sourceFile) return;
    if (selectedRegions.length === 0) {
      setError('Nothing selected. Tap a region in the timeline to add it.');
      return;
    }
    const preset = findMobilePreset(formatId) ?? defaultMobilePreset(source.hasVideo);
    setError(null);
    setStatus(null);
    setBusy(true);
    setProgress({ pct: 0, label: 'Loading ffmpeg.wasm…' });

    try {
      if (exportMode === 'single') {
        const useOverlays =
          audioMode !== 'camera' &&
          usableOverlays.length > 0 &&
          usableOverlays.every((o) => o.file);
        const { blob, filename } = useOverlays
          ? await exportSingleFileWithOverlays({
              sourceFile,
              source,
              regions,
              selectedIds: effectiveSelected,
              preset,
              overlays: usableOverlays.map((o) => ({
                id: o.id,
                name: o.name,
                file: o.file!,
                segments: o.segments,
                enabled: o.enabled,
                durationS: o.durationS,
                sampleRate: o.sampleRate,
                channels: o.channels,
                globalOffsetS: o.globalOffsetS,
                globalConfidence: o.globalConfidence,
              })),
              audioMode: audioMode === 'cleanOnly' ? 'cleanOnly' : 'mix',
              onProgress: ({ progress, time }) => {
                setProgress({
                  pct: Math.max(0, Math.min(100, progress * 100)),
                  label: `Mixing… ${(time / 1_000_000).toFixed(1)}s`,
                });
              },
            })
          : await exportSingleFile({
              sourceFile,
              regions,
              selectedIds: effectiveSelected,
              preset,
              onProgress: ({ progress, time }) => {
                setProgress({
                  pct: Math.max(0, Math.min(100, progress * 100)),
                  label: `Encoding… ${(time / 1_000_000).toFixed(1)}s`,
                });
              },
            });
        const msg = await writeAndShare(blob, filename, `SnipVox — ${filename}`);
        setStatus(msg);
      } else {
        const { blobs, filenames } = await exportPerRegion({
          sourceFile,
          regions,
          selectedIds: effectiveSelected,
          preset,
          onProgress: ({ index, total, progress }) => {
            const overall = ((index + Math.min(1, progress)) / total) * 100;
            setProgress({ pct: overall, label: `Segment ${index + 1}/${total}` });
          },
        });
        for (let i = 0; i < blobs.length; i++) {
          await writeAndShare(blobs[i]!, filenames[i]!, `SnipVox — ${filenames[i]}`);
        }
        setStatus(`Wrote ${blobs.length} files`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  const shareNle = async (fmt: NleFormat) => {
    if (!source) return;
    setError(null);
    try {
      const def = NLE[fmt];
      const filteredRegions = regions.map((r) => ({
        ...r,
        kept: effectiveSelected.has(r.id),
      }));
      const content = def.build({ source, regions: filteredRegions, projectName: source.name });
      const filename = `${source.name.replace(/\.[^./]+$/, '')}.${def.ext}`;
      const written = await Filesystem.writeFile({
        path: filename,
        data: content,
        directory: Directory.Cache,
        encoding: Encoding.UTF8,
      });
      try {
        await Share.share({
          title: `SnipVox — ${def.label}`,
          text: `${def.label} export`,
          url: written.uri,
          dialogTitle: `Share ${filename}`,
        });
        setStatus(`Shared ${filename}`);
      } catch {
        setStatus(`Saved to ${written.uri}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void analyze(f);
    e.target.value = '';
  };

  const onOverlayFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void addOverlay(f);
    e.target.value = '';
  };

  const onSeek = useCallback((t: number) => {
    scrubbingRef.current = true;
    setCurrentTime(t);
    const el = player();
    if (!el) {
      scrubbingRef.current = false;
      return;
    }
    el.currentTime = t;
    const release = () => {
      scrubbingRef.current = false;
      el.removeEventListener('seeked', release);
    };
    el.addEventListener('seeked', release, { once: true });
    setTimeout(() => {
      if (scrubbingRef.current) scrubbingRef.current = false;
    }, 400);
  }, []);

  const clearSource = () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    setSource(null);
    setSourceFile(null);
    setObjectUrl(null);
    setStatus(null);
    setError(null);
    setOverlays([]);
  };

  const onRegionKeptToggle = (id: string) => setRegions((r) => toggleKept(r, id));

  const keptOut = outputDuration(regions);

  // --- Render -------------------------------------------------------

  return (
    <div className="min-h-dvh flex flex-col bg-zinc-950 font-sans text-zinc-100 selection:bg-indigo-500/30">
      <header
        style={{
          height: 'calc(env(safe-area-inset-top) + 56px)',
          paddingTop: 'env(safe-area-inset-top)',
        }}
        className="sticky top-0 z-50 flex items-center justify-between px-4 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900/50"
      >
        <div className="flex items-center gap-2">
          {source && (
            <button
              onClick={clearSource}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-zinc-900 text-zinc-400 hover:text-white"
              aria-label="Close file"
            >
              <X size={18} />
            </button>
          )}
          <div>
            <h1 className="text-base font-semibold tracking-tight bg-gradient-to-br from-indigo-300 to-emerald-300 bg-clip-text text-transparent leading-none">
              SnipVox
            </h1>
            {source && (
              <p
                className="text-[10px] text-zinc-500 font-mono truncate max-w-[160px]"
                title={source.name}
              >
                {source.name}
              </p>
            )}
          </div>
        </div>
        {!source ? (
          <label className="cursor-pointer bg-white text-zinc-950 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-zinc-200 transition-colors">
            Open File
            <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
          </label>
        ) : (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>{keptOut.toFixed(1)}s</span>
          </div>
        )}
      </header>

      {source ? (
        <div className="flex-1 flex flex-col w-full relative">
          {/* Player + Timeline */}
          <div className="flex flex-col w-full">
            <div className="flex-1 min-h-[30vh] bg-black relative flex justify-center shrink-0 border-b border-zinc-900/50">
              {source.hasVideo ? (
                <video
                  ref={videoRef}
                  src={objectUrl || undefined}
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain"
                  preload="metadata"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-zinc-700 bg-zinc-900/40">
                  <FileAudio size={40} className="mb-2 opacity-50" />
                  <audio ref={audioRef} src={objectUrl || undefined} preload="metadata" />
                </div>
              )}
            </div>

            <div className="flex-none flex flex-col bg-zinc-950 border-b border-zinc-900/50 shadow-sm relative z-10">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-900/30">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-indigo-950 shadow-md active:bg-zinc-200 transition-colors"
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
                      <Pause size={18} fill="currentColor" />
                    ) : (
                      <Play size={18} fill="currentColor" className="ml-1" />
                    )}
                  </button>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm leading-none">{fmtTime(currentTime)}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      / {fmtTime(source.duration)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-zinc-900 rounded-full p-1 border border-zinc-800">
                  <button
                    onClick={zoomOut}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 active:text-zinc-200 rounded-full"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={zoomFit}
                    className="w-8 text-center text-[10px] font-semibold text-zinc-300 font-mono uppercase tracking-wider active:text-white"
                  >
                    Fit
                  </button>
                  <button
                    onClick={zoomIn}
                    className="w-7 h-7 flex items-center justify-center text-zinc-400 active:text-zinc-200 rounded-full"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>
              </div>

              <div className="w-full relative" style={{ height: timelineHeight }}>
                <WaveformTimeline
                  peaks={peaks}
                  regions={regions}
                  duration={source.duration}
                  currentTime={currentTime}
                  zoom={zoom}
                  offset={viewOffset}
                  onZoomChange={onViewportChange}
                  onSeek={onSeek}
                  playheadMode="centered"
                  onRegionKeptToggle={onRegionKeptToggle}
                  onRegionExportToggle={toggleRegionSelection}
                  selectedExportIds={effectiveSelected}
                  height={timelineHeight}
                />
              </div>

              {/* Stacked clean-track waveforms beneath the camera audio. */}
              {usableOverlays.length > 0 && (
                <>
                  <OverlayWaveformStack
                    overlays={usableOverlays}
                    duration={source.duration}
                    zoom={zoom}
                    viewOffset={viewOffset}
                    onToggle={toggleOverlay}
                  />
                  <div className="flex flex-col gap-1.5 px-3 py-2 bg-zinc-900/50 border-t border-zinc-900/60">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 shrink-0">
                        Listen
                      </span>
                      <div className="flex gap-1 flex-1 min-w-0 overflow-x-auto no-scrollbar">
                        {(['camera', 'mix', 'cleanOnly'] as AudioMode[]).map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setAudioMode(m)}
                            className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold transition-colors ${
                              audioMode === m
                                ? 'bg-white text-zinc-950'
                                : 'bg-zinc-900 text-zinc-400 active:bg-zinc-800 border border-zinc-800'
                            }`}
                          >
                            {m === 'camera'
                              ? 'Camera (raw)'
                              : m === 'mix'
                                ? 'Mix (export preview)'
                                : 'Clean only'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <p className="text-[9px] text-zinc-500 leading-snug pl-[42px]">
                      {audioMode === 'camera'
                        ? 'Raw camera audio. Overlays are ignored.'
                        : audioMode === 'mix'
                          ? 'Clean track where aligned, camera fills the gaps — what the export will sound like.'
                          : 'Only the aligned clean track plays. Silence elsewhere.'}
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/40">
                <span className="text-[10px] text-zinc-500">
                  Pinch zoom · Drag to scrub · Tap region
                </span>
                <label className="flex items-center gap-2 text-[11px] text-zinc-400 cursor-pointer">
                  <span>Skip silences</span>
                  <input
                    type="checkbox"
                    checked={skipSilences}
                    onChange={() => setSkipSilences(!skipSilences)}
                    className="accent-indigo-500 w-3.5 h-3.5 rounded-sm"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Bottom panels */}
          <div className="flex flex-col bg-zinc-950 pb-[calc(env(safe-area-inset-bottom)+2rem)] flex-1">
            <div
              style={{ top: 'calc(env(safe-area-inset-top) + 56px)' }}
              className="sticky z-40 bg-zinc-950/90 backdrop-blur-md flex px-4 pt-4 pb-3 gap-2 overflow-x-auto no-scrollbar border-b border-zinc-900/50 shadow-sm"
            >
              <TabButton
                id="export"
                icon={<Download size={14} />}
                label="Export"
                active={activeTab}
                set={setActiveTab}
              />
              <TabButton
                id="settings"
                icon={<Settings2 size={14} />}
                label="Detect"
                active={activeTab}
                set={setActiveTab}
              />
              <TabButton
                id="sync"
                icon={<Layers size={14} />}
                label={`Tracks${overlays.length ? ` (${overlays.length})` : ''}`}
                active={activeTab}
                set={setActiveTab}
              />
              <TabButton
                id="regions"
                icon={<ListVideo size={14} />}
                label={`Regions (${regions.filter((r) => r.kept).length})`}
                active={activeTab}
                set={setActiveTab}
              />
            </div>

            <div className="flex-1 px-4 py-6">
              {(status || error) && (
                <div
                  className={`mb-4 overflow-hidden text-[11px] font-mono rounded-lg border leading-relaxed ${
                    error
                      ? 'bg-rose-950/50 border-rose-900 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-900 text-emerald-300'
                  }`}
                >
                  <div className="px-3 py-2">
                    {error || (aligningId ? `${status} ${(alignProgress * 100).toFixed(0)}%` : status)}
                  </div>
                  {aligningId && !error && (
                    <div className="h-0.5 w-full bg-emerald-900/40">
                      <div
                        className="h-full bg-emerald-400 transition-[width] duration-150 ease-out"
                        style={{ width: `${alignProgress * 100}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'export' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <ModeCard
                      active={exportMode === 'single'}
                      onClick={() => setExportMode('single')}
                      icon={<SquarePlay size={18} />}
                      label="Single file"
                    />
                    <ModeCard
                      active={exportMode === 'perSegment'}
                      onClick={() => setExportMode('perSegment')}
                      icon={<ListVideo size={18} />}
                      label={`${selectedRegions.length} segments`}
                    />
                  </div>

                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3">
                    <label className="block text-[11px] text-zinc-500 mb-1.5 uppercase tracking-wider font-semibold">
                      Format
                    </label>
                    <select
                      value={formatId}
                      onChange={(e) => setFormatId(e.target.value)}
                      disabled={busy}
                      className="w-full appearance-none bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                      {MOBILE_FORMAT_PRESETS.filter((p) => !p.hasVideo || source.hasVideo).map(
                        (p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ),
                      )}
                    </select>
                    <p className="text-[10px] text-zinc-400 mt-2">
                      {findMobilePreset(formatId)?.description}
                    </p>
                  </div>

                  {usableOverlays.length > 0 && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3">
                      <label className="block text-[11px] text-zinc-500 mb-1.5 uppercase tracking-wider font-semibold">
                        Audio source
                      </label>
                      <select
                        value={audioMode}
                        onChange={(e) => setAudioMode(e.target.value as AudioMode)}
                        disabled={busy}
                        className="w-full appearance-none bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="camera">Camera audio (ignore overlays)</option>
                        <option value="mix">Mix: clean where aligned, camera elsewhere</option>
                        <option value="cleanOnly">Clean only (silence where unaligned)</option>
                      </select>
                      <p className="text-[10px] text-zinc-400 mt-2">
                        {usableOverlays.length} aligned overlay
                        {usableOverlays.length === 1 ? '' : 's'} ready ·{' '}
                        {audioMode === 'camera'
                          ? 'overlays ignored'
                          : audioMode === 'cleanOnly'
                            ? 'silence in gaps'
                            : 'camera fills gaps'}
                      </p>
                    </div>
                  )}

                  <Button
                    size="lg"
                    className="w-full relative overflow-hidden bg-white text-zinc-950 hover:bg-zinc-200"
                    onClick={doExport}
                    disabled={busy || selectedRegions.length === 0}
                  >
                    {busy ? (
                      <div className="absolute inset-0 bg-indigo-500/20">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-300"
                          style={{ width: `${progress?.pct || 0}%` }}
                        />
                      </div>
                    ) : null}
                    <span className="relative z-10 flex items-center gap-2 font-semibold">
                      <Download size={16} />
                      {busy
                        ? `Exporting ${progress?.pct.toFixed(0) ?? 0}%`
                        : `Save ${exportMode === 'single' ? 'video' : `${selectedRegions.length} clips`}`}
                    </span>
                  </Button>

                  <div className="pt-4">
                    <label className="block text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-semibold">
                      NLE handoff
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(Object.keys(NLE) as NleFormat[]).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => shareNle(fmt)}
                          disabled={busy || selectedRegions.length === 0}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg py-2 text-[10px] font-medium text-zinc-300 active:bg-zinc-800 disabled:opacity-50 transition-colors"
                        >
                          {NLE[fmt].label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suppress an unused-warning while the mobile overlay path
                   *  is wired through ffmpeg.wasm — kept for future use. */}
                  {false && <span>{buildOverlayExport.name}</span>}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-200">Auto noise gate</p>
                        <p className="text-[10px] text-zinc-500 leading-snug mt-0.5">
                          Calibrates the threshold on the take's noise floor — robust
                          against hiss / white noise / fan.
                          {samplesRef.current && sampleRateRef.current ? (
                            <>
                              {' '}Floor ≈{' '}
                              {estimateNoiseFloorDb(samplesRef.current, sampleRateRef.current).toFixed(
                                1,
                              )}{' '}
                              dB
                            </>
                          ) : null}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSettings({
                            ...settings,
                            noiseGateMode:
                              (settings.noiseGateMode ?? 'auto') === 'auto' ? 'fixed' : 'auto',
                          })
                        }
                        className={`shrink-0 h-6 w-11 rounded-full border transition-colors relative ${
                          (settings.noiseGateMode ?? 'auto') === 'auto'
                            ? 'bg-emerald-500 border-emerald-400'
                            : 'bg-zinc-800 border-zinc-700'
                        }`}
                        aria-label="Toggle auto noise gate"
                      >
                        <span
                          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
                            (settings.noiseGateMode ?? 'auto') === 'auto' ? 'left-5' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    {(settings.noiseGateMode ?? 'auto') === 'auto' ? (
                      <Field label={`Auto margin +${settings.autoMarginDb ?? 6} dB`}>
                        <Slider
                          ariaLabel="Auto margin"
                          value={settings.autoMarginDb ?? 6}
                          onValueChange={(v) => setSettings({ ...settings, autoMarginDb: v })}
                          min={0}
                          max={18}
                          step={1}
                        />
                      </Field>
                    ) : (
                      <Field label={`Threshold ${settings.thresholdDb} dB`}>
                        <Slider
                          ariaLabel="Threshold"
                          value={settings.thresholdDb}
                          onValueChange={(v) => setSettings({ ...settings, thresholdDb: v })}
                          min={-60}
                          max={-10}
                          step={1}
                        />
                      </Field>
                    )}
                    <Field label={`Min silence ${settings.minSilenceDurationMs} ms`}>
                      <Slider
                        ariaLabel="Min silence"
                        value={settings.minSilenceDurationMs}
                        onValueChange={(v) => setSettings({ ...settings, minSilenceDurationMs: v })}
                        min={100}
                        max={3000}
                        step={50}
                      />
                    </Field>
                    <Field label={`Padding ${settings.paddingMs} ms`}>
                      <Slider
                        ariaLabel="Padding"
                        value={settings.paddingMs}
                        onValueChange={(v) => setSettings({ ...settings, paddingMs: v })}
                        min={0}
                        max={500}
                        step={10}
                      />
                    </Field>
                    <Button size="md" onClick={reanalyze} className="w-full mt-2">
                      Re-analyze audio
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === 'sync' && (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-zinc-200">Clean audio sync</h3>
                        <p className="text-[10px] text-zinc-500 leading-relaxed mt-0.5">
                          Add a lavalier / studio recording — SnipVox aligns it onto the camera
                          audio with MFCC + DTW.
                        </p>
                      </div>
                      <label className="cursor-pointer bg-white text-zinc-950 px-3 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                        <Plus size={12} /> Add
                        <input
                          type="file"
                          accept="audio/*,video/*"
                          className="hidden"
                          onChange={onOverlayFile}
                          disabled={busy || !!aligningId}
                        />
                      </label>
                    </div>

                    {overlays.length === 0 ? (
                      <p className="text-[11px] text-zinc-500 px-1 py-2">
                        No overlays yet. Tap “Add” to load a clean voice take.
                      </p>
                    ) : (
                      <ul className="divide-y divide-zinc-800/60">
                        {overlays.map((o) => {
                          const covered = coveredReferenceDurationS(o);
                          const aligning = aligningId === o.id;
                          return (
                            <li key={o.id} className="flex flex-col gap-1 py-2.5">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={o.enabled}
                                  onChange={() => toggleOverlay(o.id)}
                                  className="h-4 w-4 accent-emerald-500"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="truncate text-sm">{o.name}</p>
                                  <p className="text-[10px] text-zinc-500">
                                    {o.durationS.toFixed(1)}s source ·{' '}
                                    {aligning ? (
                                      <span className="text-amber-300 inline-flex items-center gap-1">
                                        <Loader2 size={9} className="animate-spin" />
                                        aligning {(alignProgress * 100).toFixed(0)}%
                                      </span>
                                    ) : o.segments.length === 0 ? (
                                      <span className="text-zinc-500">not aligned</span>
                                    ) : (
                                      <>
                                        {o.segments.length} seg · {covered.toFixed(1)}s ·{' '}
                                        <span
                                          className={
                                            o.globalConfidence > 0.5
                                              ? 'text-emerald-400'
                                              : o.globalConfidence > 0.25
                                                ? 'text-amber-400'
                                                : 'text-rose-400'
                                          }
                                        >
                                          {(o.globalConfidence * 100).toFixed(0)}%
                                        </span>
                                      </>
                                    )}
                                  </p>
                                </div>
                                <button
                                  onClick={() => realignOverlay(o.id)}
                                  disabled={aligning}
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-400 active:text-zinc-200 disabled:opacity-30"
                                  aria-label="Re-run alignment"
                                >
                                  <RotateCw size={14} />
                                </button>
                                <button
                                  onClick={() => removeOverlay(o.id)}
                                  className="h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-rose-400"
                                  aria-label={`Remove ${o.name}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                              {aligning && (
                                <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
                                  <div
                                    className="h-full bg-amber-400 transition-[width] duration-150 ease-out"
                                    style={{ width: `${alignProgress * 100}%` }}
                                  />
                                </div>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'regions' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <RegionsListMobile
                    regions={regions}
                    currentTime={currentTime}
                    selectedIds={effectiveSelected}
                    onSeek={onSeek}
                    onKeptToggle={onRegionKeptToggle}
                    onSelectToggle={toggleRegionSelection}
                    onSelectAll={() =>
                      setSelectedIds(new Set(regions.filter((r) => r.kept).map((r) => r.id)))
                    }
                    onClearSelection={() => setSelectedIds(new Set())}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
          <img
            src="/snipvox-wordmark.png"
            alt="SnipVox"
            className="h-32 w-auto max-w-[80%] mb-6 drop-shadow-[0_0_40px_rgba(99,102,241,0.35)]"
          />
          <h2 className="text-3xl font-semibold mb-3 tracking-tight text-white">
            Cut silences fast.
          </h2>
          <p className="text-zinc-400 text-sm max-w-xs mb-8 leading-relaxed">
            Import a file. SnipVox detects the silent gaps so you can export a clean clip — and it
            can also align a clean voice track onto your camera audio.
          </p>
          <label className="cursor-pointer">
            <span className="inline-flex items-center gap-2 justify-center rounded-2xl bg-white px-8 py-4 text-[15px] font-semibold text-zinc-950 shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-all">
              <Upload size={18} />
              Choose media
            </span>
            <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
          </label>
          {busy && (
            <div className="mt-6 text-xs text-indigo-400 animate-pulse font-mono tracking-widest uppercase">
              Analyzing…
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({
  id,
  icon,
  label,
  active,
  set,
}: {
  id: TabId;
  icon: React.ReactNode;
  label: string;
  active: TabId;
  set: (id: TabId) => void;
}) {
  const isActive = active === id;
  return (
    <button
      onClick={() => set(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
        isActive
          ? 'bg-indigo-600 outline outline-2 outline-offset-2 outline-indigo-500/50 text-white'
          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function ModeCard({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl py-3 px-3 text-xs font-semibold border flex flex-col items-center gap-1.5 transition-colors ${
        active
          ? 'bg-indigo-600/10 text-indigo-300 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
          : 'bg-zinc-900 text-zinc-400 border-zinc-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

const OVERLAY_PALETTE = ['#34d399', '#60a5fa', '#fbbf24', '#f472b6', '#a78bfa', '#22d3ee'];
const OVERLAY_ROW_HEIGHT = 34;

/**
 * Stacked mini-waveform per overlay rendered under the camera-audio
 * timeline. Each row shows the actual clean-track peaks placed where
 * the alignment maps them onto the reference timeline; unaligned
 * stretches stay transparent so the user can see which slices ffmpeg
 * will use on export. Tap a row to mute/unmute that track.
 */
function OverlayWaveformStack({
  overlays,
  duration,
  zoom,
  viewOffset,
  onToggle,
}: {
  overlays: OverlayState[];
  duration: number;
  zoom: number;
  viewOffset: number;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="bg-zinc-950/70 border-t border-zinc-900/60">
      {overlays.map((o, i) => (
        <OverlayWaveformRow
          key={o.id}
          overlay={o}
          color={OVERLAY_PALETTE[i % OVERLAY_PALETTE.length]!}
          duration={duration}
          zoom={zoom}
          viewOffset={viewOffset}
          onToggle={() => onToggle(o.id)}
        />
      ))}
    </div>
  );
}

function OverlayWaveformRow({
  overlay,
  color,
  duration,
  zoom,
  viewOffset,
  onToggle,
}: {
  overlay: OverlayState;
  color: string;
  duration: number;
  zoom: number;
  viewOffset: number;
  onToggle: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.floor(w * dpr));
    canvas.height = Math.max(1, Math.floor(h * dpr));
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (duration <= 0) return;

    const viewSpan = duration / Math.max(1, zoom);
    const viewEnd = viewOffset + viewSpan;
    const timeToX = (t: number) => ((t - viewOffset) / viewSpan) * w;
    const mid = h / 2;
    const muted = !overlay.enabled;

    // Background: subtle row separator.
    ctx.fillStyle = muted ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.03)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0, h - 1, w, 1);

    const peaks = overlay.peaks;
    if (!peaks || peaks.length === 0 || overlay.durationS <= 0) return;
    const totalBins = peaks.length;
    const segs = resolveOverlaps([overlay], duration);

    const fill = muted ? color + '30' : color + 'cc';
    ctx.fillStyle = fill;
    for (const s of segs) {
      if (s.referenceEndS < viewOffset || s.referenceStartS > viewEnd) continue;
      const x0 = timeToX(s.referenceStartS);
      const x1 = timeToX(s.referenceEndS);
      const segW = Math.max(1, x1 - x0);
      const candDur = s.candidateEndS - s.candidateStartS;
      if (candDur <= 0) continue;
      // Number of waveform bars to draw across this segment — one per
      // device pixel keeps detail crisp at any zoom.
      const bars = Math.max(2, Math.floor(segW));
      for (let b = 0; b < bars; b++) {
        const t = b / bars;
        const candT = s.candidateStartS + t * candDur;
        const binIdx = Math.min(totalBins - 1, Math.floor((candT / overlay.durationS) * totalBins));
        const amp = Math.min(1, peaks[binIdx] ?? 0);
        const barH = Math.max(1, amp * (h - 4));
        const x = x0 + b;
        ctx.fillRect(x, mid - barH / 2, 1, barH);
      }
      // Left/right border ticks so the user can read the segment edges.
      ctx.fillStyle = muted ? color + '50' : color;
      ctx.fillRect(x0, 1, 1, h - 2);
      ctx.fillRect(x0 + segW - 1, 1, 1, h - 2);
      ctx.fillStyle = fill;
    }
  }, [overlay, color, duration, zoom, viewOffset]);
  return (
    <div
      className="relative"
      style={{ height: OVERLAY_ROW_HEIGHT }}
      onClick={onToggle}
      role="button"
      tabIndex={0}
      aria-label={overlay.enabled ? `Mute ${overlay.name}` : `Unmute ${overlay.name}`}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      <span
        className={`absolute top-1 left-1 rounded px-1 py-0.5 text-[8px] font-semibold uppercase tracking-wider pointer-events-none ${
          overlay.enabled ? 'text-zinc-900' : 'text-zinc-300'
        }`}
        style={{ background: overlay.enabled ? color : 'rgba(0,0,0,0.55)' }}
      >
        {overlay.enabled ? 'ON' : 'OFF'}
      </span>
    </div>
  );
}

function RegionsListMobile({
  regions,
  currentTime,
  selectedIds,
  onSeek,
  onKeptToggle,
  onSelectToggle,
  onSelectAll,
  onClearSelection,
}: {
  regions: Region[];
  currentTime: number;
  selectedIds: Set<string>;
  onSeek: (t: number) => void;
  onKeptToggle: (id: string) => void;
  onSelectToggle: (id: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm mb-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
        <span>Segments</span>
        <div className="flex gap-3">
          <button className="text-indigo-400 active:text-indigo-300" onClick={onSelectAll}>
            Select all
          </button>
          <span className="text-zinc-700">|</span>
          <button className="text-zinc-400 active:text-zinc-300" onClick={onClearSelection}>
            None
          </button>
        </div>
      </div>
      <ul className="divide-y divide-zinc-800/60 w-full">
        {regions.map((r, i) => {
          const active = currentTime >= r.start && currentTime <= r.end;
          const selected = selectedIds.has(r.id);
          return (
            <li
              key={r.id}
              className={`flex items-center gap-3 px-3 py-3 transition-colors ${
                active
                  ? 'bg-indigo-600/10'
                  : !r.kept
                    ? 'bg-zinc-950/40 opacity-70'
                    : 'bg-transparent'
              }`}
            >
              <button
                className="flex-1 min-w-0 text-left flex flex-col items-start gap-0.5"
                onClick={() => onSeek(r.start)}
                aria-label={`Seek to region ${i + 1}`}
              >
                <div className="text-[13px] font-mono text-zinc-200">
                  {fmtTime(r.start)} <span className="text-zinc-600">→</span> {fmtTime(r.end)}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {(r.end - r.start).toFixed(2)}s · {r.source.toUpperCase()}
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onKeptToggle(r.id)}
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
                    r.kept
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                  }`}
                  aria-label={r.kept ? 'Mark as silence' : 'Mark as kept'}
                >
                  {r.kept ? <Check size={14} /> : <X size={14} />}
                </button>
                <button
                  onClick={() => onSelectToggle(r.id)}
                  disabled={!r.kept}
                  className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium border transition-colors ${
                    selected
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      : 'bg-zinc-900 text-zinc-600 border-zinc-800'
                  } disabled:opacity-20`}
                  aria-label={selected ? 'Exclude from export' : 'Include in export'}
                >
                  {selected ? (
                    <Check size={14} />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block w-full">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function fmtTime(s: number): string {
  if (!isFinite(s) || s < 0) return '0:00.00';
  const m = Math.floor(s / 60);
  const rem = s - m * 60;
  return `${m}:${rem.toFixed(2).padStart(5, '0')}`;
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
