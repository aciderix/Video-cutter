import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Slider } from '@quietcut/ui';
import { WaveformTimeline, clampViewport, MAX_ZOOM, MIN_ZOOM } from '@quietcut/timeline';
import {
  DEFAULT_DETECTION,
  QUIETCUT_VERSION,
  buildRegionsFromSilences,
  outputDuration,
  regionAtTime,
  samplesToPeaks,
  toggleKept,
  vadFromSamples,
  type MediaSource,
  type Region,
  type SilenceDetectionSettings,
} from '@quietcut/core';
import {
  buildFilterComplexExport,
  exportEDL,
  exportFCPXML,
  exportOTIO,
  exportResolveMarkers,
} from '@quietcut/exporters';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { exportAudioWav } from './webAudioExport.ts';

type NleFormat = 'fcpxml' | 'otio' | 'edl' | 'resolve';

const NLE: Record<NleFormat, { label: string; ext: string; build: typeof exportEDL }> = {
  fcpxml: { label: 'FCPXML', ext: 'fcpxml', build: exportFCPXML },
  otio: { label: 'OTIO', ext: 'otio', build: exportOTIO },
  edl: { label: 'EDL', ext: 'edl', build: exportEDL },
  resolve: { label: 'Markers', ext: 'txt', build: exportResolveMarkers },
};

export function App() {
  const [source, setSource] = useState<MediaSource | null>(null);
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
  const [showSettings, setShowSettings] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [viewOffset, setViewOffset] = useState(0);
  const [playing, setPlaying] = useState(false);
  const samplesRef = useRef<Float32Array | null>(null);
  const sampleRateRef = useRef<number>(48_000);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const player = (): HTMLMediaElement | null => videoRef.current ?? audioRef.current;

  // Revoke any leftover object URL on unmount.
  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  /** Effective selection — default = all kept regions. */
  const effectiveSelected = useMemo<Set<string>>(() => {
    if (selectedIds) return selectedIds;
    return new Set(regions.filter((r) => r.kept).map((r) => r.id));
  }, [selectedIds, regions]);

  // --- Player time-update + skip-silences ---
  useEffect(() => {
    const el = videoRef.current ?? audioRef.current;
    if (!el) return;
    const handler = () => {
      const t = el.currentTime;
      if (skipSilences) {
        const r = regionAtTime(regions, t);
        if (r && !r.kept) {
          const target = Math.min(el.duration || r.end, r.end + 0.001);
          if (target > t) {
            el.currentTime = target;
            return;
          }
        }
      }
      setCurrentTime(t);
    };
    el.addEventListener('timeupdate', handler);
    return () => el.removeEventListener('timeupdate', handler);
  }, [regions, skipSilences, objectUrl]);

  const analyze = useCallback(
    async (file: File) => {
      setError(null);
      setStatus(`Loading ${file.name}…`);
      setBusy(true);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const ctx = new (
          window.AudioContext ||
          (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!
        )();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
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
        const wave = samplesToPeaks(mono, 1024);

        setSource(src);
        setRegions(regs);
        setPeaks(wave);
        setCurrentTime(0);
        setSelectedIds(null); // reset to "all kept" default
        setZoom(1);
        setViewOffset(0);

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

  // Track playing state for the bottom transport bar.
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaying(!!player() && !player()!.paused);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    const el = player();
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const onViewportChange = (newZoom: number, newOffset: number) => {
    if (!source) return;
    const clamped = clampViewport(newZoom, newOffset, source.duration);
    setZoom(clamped.zoom);
    setViewOffset(clamped.offset);
  };

  const zoomIn = () => {
    if (!source) return;
    const next = Math.min(MAX_ZOOM, zoom * 1.6);
    const span = source.duration / next;
    setZoom(next);
    setViewOffset(Math.max(0, Math.min(source.duration - span, currentTime - span / 2)));
  };
  const zoomOut = () => {
    if (!source) return;
    const next = Math.max(MIN_ZOOM, zoom / 1.6);
    const span = source.duration / next;
    setZoom(next);
    setViewOffset(Math.max(0, Math.min(source.duration - span, viewOffset)));
  };
  const zoomFit = () => {
    setZoom(1);
    setViewOffset(0);
  };

  const toggleRegionSelection = (id: string) => {
    const next = new Set(effectiveSelected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // --- Audio-only WAV export (works on-device, no native FFmpeg needed) ---
  const exportWav = async () => {
    if (!source || !samplesRef.current) return;
    setError(null);
    setBusy(true);
    setStatus('Encoding WAV…');
    try {
      const filteredRegions = regions.map((r) => ({
        ...r,
        kept: effectiveSelected.has(r.id),
      }));
      const blob = await exportAudioWav(samplesRef.current, sampleRateRef.current, filteredRegions);
      const filename = `${source.name.replace(/\.[^./]+$/, '')}.cut.wav`;
      const dataUrl = await blobToDataUrl(blob);
      const written = await Filesystem.writeFile({
        path: filename,
        data: dataUrl.split(',')[1] ?? '',
        directory: Directory.Cache,
      });
      try {
        await Share.share({
          title: `Quietcut — ${filename}`,
          text: 'Cut audio export',
          url: written.uri,
          dialogTitle: `Share ${filename}`,
        });
        setStatus(`Shared ${filename}`);
      } catch {
        setStatus(`Saved to ${written.uri}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
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
          title: `Quietcut — ${def.label}`,
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

  const copyFfmpegCmd = () => {
    if (!source) return;
    try {
      const plan = buildFilterComplexExport(
        { source, regions, projectName: source.name },
        { outputPath: 'output.mp4', selectedIds: effectiveSelected },
      );
      const cmd = ['ffmpeg', ...plan.args].join(' ');
      navigator.clipboard?.writeText(cmd).catch(() => {});
      setStatus(`FFmpeg command copied (${plan.segmentCount} segments)`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void analyze(f);
    e.target.value = '';
  };

  const onSeek = (t: number) => {
    setCurrentTime(t);
    const el = videoRef.current ?? audioRef.current;
    if (el) el.currentTime = t;
  };

  const onRegionKeptToggle = (id: string) => setRegions((r) => toggleKept(r, id));

  const keptOut = outputDuration(regions);
  const selectedDuration = useMemo(
    () =>
      regions
        .filter((r) => effectiveSelected.has(r.id))
        .reduce((acc, r) => acc + (r.end - r.start), 0),
    [regions, effectiveSelected],
  );

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur px-4 pt-[env(safe-area-inset-top)] pb-3">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Quietcut</h1>
          <p className="text-[10px] text-zinc-500">v{QUIETCUT_VERSION}</p>
        </div>
        <label className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white active:bg-indigo-500">
          Open file
          <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
        </label>
      </header>
      <main className="flex flex-1 flex-col gap-3 overflow-auto p-4 pb-[calc(env(safe-area-inset-bottom)+5rem)]">
        {status && (
          <p className="rounded bg-emerald-950/40 px-2 py-1 text-xs text-emerald-300">{status}</p>
        )}
        {error && (
          <p role="alert" className="rounded-md bg-rose-950 px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        )}
        {!source && (
          <div className="m-auto flex flex-col items-center gap-4 text-center">
            <div className="text-5xl">🎬</div>
            <h2 className="text-lg font-medium">Pick a video or audio file</h2>
            <p className="max-w-xs text-sm text-zinc-400">
              On-device silence detection — no network, no upload. Exports an FCPXML / OTIO / EDL /
              Markers file via the OS share sheet, plus an audio-only WAV cut.
            </p>
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-medium text-white active:bg-indigo-500">
                {busy ? 'Loading…' : 'Choose file'}
              </span>
              <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
            </label>
          </div>
        )}
        {source && (
          <>
            <div className="rounded-lg bg-zinc-900/60 p-3">
              <p className="truncate text-sm font-medium" title={source.name}>
                {source.name}
              </p>
              <p className="text-xs text-zinc-500">
                {source.duration.toFixed(1)}s · {regions.filter((r) => !r.kept).length} silences ·
                output {keptOut.toFixed(1)}s
              </p>
            </div>
            {objectUrl && source.hasVideo && (
              <video
                ref={videoRef}
                src={objectUrl}
                controls
                playsInline
                className="aspect-video w-full rounded-lg bg-black shadow-lg shadow-black/40"
                preload="metadata"
              />
            )}
            {objectUrl && !source.hasVideo && (
              <audio
                ref={audioRef}
                src={objectUrl}
                controls
                className="w-full"
                preload="metadata"
              />
            )}
            <label className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm">
              <span>
                Preview cuts <span className="text-xs text-zinc-500">(skip silences)</span>
              </span>
              <input
                type="checkbox"
                checked={skipSilences}
                onChange={() => setSkipSilences(!skipSilences)}
                className="h-5 w-5 accent-indigo-500"
              />
            </label>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 space-y-2">
              <div className="flex items-center gap-2 px-1">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow shadow-indigo-950 active:bg-indigo-500"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? (
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 translate-x-[1px]"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <code className="text-xs text-zinc-400 font-mono tabular-nums">
                  {fmtTime(currentTime)} / {fmtTime(source.duration)}
                </code>
                <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
                  <span className="font-mono tabular-nums">×{zoom.toFixed(1)}</span>
                  <button
                    onClick={zoomOut}
                    className="h-9 w-9 rounded bg-zinc-800 active:bg-zinc-700"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <button
                    onClick={zoomIn}
                    className="h-9 w-9 rounded bg-zinc-800 active:bg-zinc-700"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <button
                    onClick={zoomFit}
                    className="h-9 px-2 rounded bg-zinc-800 text-[10px] active:bg-zinc-700"
                    aria-label="Fit zoom"
                  >
                    Fit
                  </button>
                </div>
              </div>
              <WaveformTimeline
                peaks={peaks}
                regions={regions}
                duration={source.duration}
                currentTime={currentTime}
                zoom={zoom}
                offset={viewOffset}
                onZoomChange={onViewportChange}
                onSeek={onSeek}
                onRegionKeptToggle={onRegionKeptToggle}
                onRegionExportToggle={toggleRegionSelection}
                selectedExportIds={effectiveSelected}
                height={110}
              />
              <p className="px-1 text-[10px] text-zinc-500">
                Tap a kept segment to add/remove it from the export. Pinch to zoom, drag to pan.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800 bg-zinc-900">
              <button
                onClick={() => setShowSettings((s) => !s)}
                className="flex w-full items-center justify-between px-3 py-3 text-sm font-medium"
              >
                <span>Detection</span>
                <span className="text-xs text-zinc-500">{showSettings ? '▼' : '▶'}</span>
              </button>
              {showSettings && (
                <div className="space-y-4 px-3 pb-4">
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
                  <Button size="sm" onClick={reanalyze} className="w-full">
                    Re-analyze
                  </Button>
                </div>
              )}
            </div>
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
          </>
        )}
      </main>
      {source && (
        <nav className="sticky bottom-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500">
            {effectiveSelected.size} selected · {selectedDuration.toFixed(1)}s
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button size="md" onClick={exportWav} disabled={busy || effectiveSelected.size === 0}>
              Export WAV
            </Button>
            <Button
              size="md"
              variant="secondary"
              onClick={copyFfmpegCmd}
              disabled={busy || effectiveSelected.size === 0}
            >
              Copy FFmpeg cmd
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.keys(NLE) as NleFormat[]).map((fmt) => (
              <Button
                key={fmt}
                size="sm"
                variant="ghost"
                onClick={() => shareNle(fmt)}
                disabled={busy || effectiveSelected.size === 0}
                className="text-xs"
              >
                {NLE[fmt].label}
              </Button>
            ))}
          </div>
        </nav>
      )}
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
    <div className="rounded-lg border border-zinc-800 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-zinc-400">Regions</span>
        <div className="flex gap-2">
          <button className="text-indigo-300" onClick={onSelectAll}>
            All
          </button>
          <span className="text-zinc-700">·</span>
          <button className="text-zinc-400" onClick={onClearSelection}>
            None
          </button>
        </div>
      </div>
      <ul className="divide-y divide-zinc-800 max-h-72 overflow-auto">
        {regions.map((r, i) => {
          const active = currentTime >= r.start && currentTime <= r.end;
          const selected = selectedIds.has(r.id);
          return (
            <li
              key={r.id}
              className={`flex items-center gap-2 px-3 py-3 ${
                active ? 'bg-indigo-600/15' : !r.kept ? 'opacity-60' : ''
              }`}
            >
              <button
                className="flex-1 min-w-0 text-left"
                onClick={() => onSeek(r.start)}
                aria-label={`Seek to region ${i + 1}`}
              >
                <div className="text-sm">
                  {fmtTime(r.start)} → {fmtTime(r.end)}
                </div>
                <div className="text-[10px] text-zinc-500">
                  {(r.end - r.start).toFixed(2)}s · {r.source}
                </div>
              </button>
              <button
                onClick={() => onKeptToggle(r.id)}
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs ${
                  r.kept ? 'bg-indigo-600/30 text-indigo-200' : 'bg-zinc-800 text-zinc-500'
                }`}
                aria-label={r.kept ? 'Mark as silence' : 'Mark as kept'}
                title={r.kept ? 'Keep' : 'Silence'}
              >
                {r.kept ? '✓' : '✕'}
              </button>
              <button
                onClick={() => onSelectToggle(r.id)}
                disabled={!r.kept}
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs ${
                  selected ? 'bg-emerald-600/30 text-emerald-200' : 'bg-zinc-800 text-zinc-500'
                } disabled:opacity-30`}
                aria-label={selected ? 'Exclude from export' : 'Include in export'}
                title={selected ? 'In export' : 'Skip in export'}
              >
                {selected ? '⤓' : '·'}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-zinc-400">{label}</span>
      {children}
    </label>
  );
}

function fmtTime(s: number): string {
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
