import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Slider } from '@quietcut/ui';
import { WaveformTimeline, clampViewport, MAX_ZOOM, MIN_ZOOM } from '@quietcut/timeline';
import {
  DEFAULT_DETECTION,
  QUIETCUT_VERSION,
  buildRegionsFromSilences,
  outputDuration,
  samplesToPeaks,
  toggleKept,
  vadFromSamples,
  type MediaSource,
  type Region,
  type SilenceDetectionSettings,
} from '@quietcut/core';
import { exportEDL, exportFCPXML, exportOTIO, exportResolveMarkers } from '@quietcut/exporters';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {
  MOBILE_FORMAT_PRESETS,
  defaultMobilePreset,
  exportPerRegion,
  exportSingleFile,
  findMobilePreset,
} from './ffmpegMobile.ts';

type NleFormat = 'fcpxml' | 'otio' | 'edl' | 'resolve';
const NLE: Record<NleFormat, { label: string; ext: string; build: typeof exportEDL }> = {
  fcpxml: { label: 'FCPXML', ext: 'fcpxml', build: exportFCPXML },
  otio: { label: 'OTIO', ext: 'otio', build: exportOTIO },
  edl: { label: 'EDL', ext: 'edl', build: exportEDL },
  resolve: { label: 'Markers', ext: 'txt', build: exportResolveMarkers },
};

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
  const [showSettings, setShowSettings] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [showExport, setShowExport] = useState(true);
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

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [objectUrl]);

  // Snap to a sensible format when the source video/audio nature changes.
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
  const selectedDuration = useMemo(
    () => selectedRegions.reduce((acc, r) => acc + (r.end - r.start), 0),
    [selectedRegions],
  );

  useEffect(() => {
    const el = player();
    if (!el) return;
    const handler = () => {
      const t = el.currentTime;
      if (skipSilences) {
        const r = regions.find((reg) => t >= reg.start && t <= reg.end);
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

  useEffect(() => {
    const interval = setInterval(() => setPlaying(!!player() && !player()!.paused), 200);
    return () => clearInterval(interval);
  }, []);

  const togglePlay = () => {
    const el = player();
    if (!el) return;
    if (el.paused) void el.play();
    else el.pause();
  };

  const onViewportChange = (z: number, off: number) => {
    if (!source) return;
    const c = clampViewport(z, off, source.duration);
    setZoom(c.zoom);
    setViewOffset(c.offset);
  };
  const zoomIn = () => {
    if (!source) return;
    const next = Math.min(MAX_ZOOM, zoom * 1.6);
    setZoom(next);
  };
  const zoomOut = () => {
    if (!source) return;
    const next = Math.max(MIN_ZOOM, zoom / 1.6);
    setZoom(next);
  };
  const zoomFit = () => {
    setZoom(1);
    setViewOffset(0);
  };

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
        const wave = samplesToPeaks(mono, 2048);

        setSource(src);
        setSourceFile(file);
        setRegions(regs);
        setPeaks(wave);
        setCurrentTime(0);
        setSelectedIds(null);
        setZoom(1);
        setViewOffset(0);
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
      setError('Nothing selected. Tap a kept region in the timeline to add it.');
      return;
    }
    const preset = findMobilePreset(formatId) ?? defaultMobilePreset(source.hasVideo);
    setError(null);
    setStatus(null);
    setBusy(true);
    setProgress({ pct: 0, label: 'Loading ffmpeg.wasm (first run downloads ~30 MB)…' });

    try {
      if (exportMode === 'single') {
        const { blob, filename } = await exportSingleFile({
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
        const msg = await writeAndShare(blob, filename, `Quietcut — ${filename}`);
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
          await writeAndShare(blobs[i]!, filenames[i]!, `Quietcut — ${filenames[i]}`);
        }
        setStatus(`Wrote ${blobs.length} files (shared individually)`);
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

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void analyze(f);
    e.target.value = '';
  };

  const onSeek = (t: number) => {
    setCurrentTime(t);
    const el = player();
    if (el) el.currentTime = t;
  };

  const onRegionKeptToggle = (id: string) => setRegions((r) => toggleKept(r, id));

  const groupedFormats = useMemo(
    () => ({
      video: MOBILE_FORMAT_PRESETS.filter((p) => p.hasVideo && source?.hasVideo),
      audio: MOBILE_FORMAT_PRESETS.filter((p) => !p.hasVideo),
    }),
    [source?.hasVideo],
  );

  const keptOut = outputDuration(regions);

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md px-4 pt-[env(safe-area-inset-top)] pb-3">
        <div>
          <h1 className="text-base font-semibold tracking-tight bg-gradient-to-r from-indigo-300 to-emerald-300 bg-clip-text text-transparent">
            Quietcut
          </h1>
          <p className="text-[10px] text-zinc-500">v{QUIETCUT_VERSION}</p>
        </div>
        <label className="cursor-pointer rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm shadow-indigo-950 active:bg-indigo-500">
          {source ? 'New file' : 'Open file'}
          <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
        </label>
      </header>
      <main className="flex flex-1 flex-col gap-3 overflow-auto p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        {status && (
          <p className="rounded bg-emerald-950/40 px-3 py-2 text-xs text-emerald-300 border border-emerald-900/50">
            {status}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="rounded-md bg-rose-950 px-3 py-2 text-xs text-rose-200 border border-rose-900"
          >
            {error}
          </p>
        )}
        {!source && (
          <div className="m-auto flex flex-col items-center gap-5 text-center px-2">
            <div className="text-6xl drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]">🎬</div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Pick a file</h2>
              <p className="max-w-xs text-sm text-zinc-400">
                On-device silence detection. Cut, preview, and export to MP4 / MP3 / WAV — or hand
                off to an NLE via the share sheet.
              </p>
            </div>
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-indigo-950 active:bg-indigo-500">
                {busy ? 'Loading…' : 'Choose a video or audio file'}
              </span>
              <input type="file" accept="video/*,audio/*" className="hidden" onChange={onFile} />
            </label>
          </div>
        )}
        {source && (
          <>
            <Card>
              <p className="truncate text-sm font-medium" title={source.name}>
                {source.name}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                {source.duration.toFixed(1)}s · {regions.filter((r) => !r.kept).length} silences ·
                output {keptOut.toFixed(1)}s
              </p>
            </Card>
            {objectUrl && source.hasVideo && (
              <video
                ref={videoRef}
                src={objectUrl}
                playsInline
                className="aspect-video w-full rounded-lg bg-black shadow-xl shadow-black/40"
                preload="metadata"
              />
            )}
            {objectUrl && !source.hasVideo && (
              <audio ref={audioRef} src={objectUrl} className="w-full" preload="metadata" />
            )}
            <Card padding="p-2">
              <div className="flex items-center gap-2 px-1">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-600 text-white shadow shadow-indigo-950 active:bg-indigo-500"
                  aria-label={playing ? 'Pause' : 'Play'}
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <code className="text-[11px] text-zinc-400 font-mono tabular-nums">
                  {fmtTime(currentTime)} / {fmtTime(source.duration)}
                </code>
                <div className="ml-auto flex items-center gap-1 text-xs">
                  <span className="font-mono tabular-nums text-zinc-500">×{zoom.toFixed(1)}</span>
                  <button
                    onClick={zoomOut}
                    className="h-9 w-9 rounded-lg bg-zinc-800 active:bg-zinc-700 text-zinc-200"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <button
                    onClick={zoomIn}
                    className="h-9 w-9 rounded-lg bg-zinc-800 active:bg-zinc-700 text-zinc-200"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <button
                    onClick={zoomFit}
                    className="h-9 px-2.5 rounded-lg bg-zinc-800 text-[11px] text-zinc-200 active:bg-zinc-700"
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
                playheadMode="centered"
                onRegionKeptToggle={onRegionKeptToggle}
                onRegionExportToggle={toggleRegionSelection}
                selectedExportIds={effectiveSelected}
                height={140}
              />
              <p className="px-1 mt-1 text-[10px] text-zinc-500 leading-relaxed">
                Drag waveform to scrub · Tap a region to toggle keep/silence · Long-press to
                add/remove from export · Pinch to zoom
              </p>
            </Card>
            <label className="flex items-center justify-between gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-3 text-sm">
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
            <Accordion
              title="Export"
              meta={`${selectedRegions.length} · ${selectedDuration.toFixed(1)}s`}
              open={showExport}
              onToggle={() => setShowExport((s) => !s)}
            >
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setExportMode('single')}
                    className={`rounded-lg py-3 text-sm font-medium border ${
                      exportMode === 'single'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 active:bg-zinc-800'
                    }`}
                  >
                    📦 Single file
                  </button>
                  <button
                    onClick={() => setExportMode('perSegment')}
                    className={`rounded-lg py-3 text-sm font-medium border ${
                      exportMode === 'perSegment'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 active:bg-zinc-800'
                    }`}
                  >
                    🗂 {selectedRegions.length} files
                  </button>
                </div>
                <label className="block text-xs text-zinc-400">
                  Format
                  <select
                    value={formatId}
                    onChange={(e) => setFormatId(e.target.value)}
                    disabled={busy}
                    className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200"
                  >
                    {groupedFormats.video.length > 0 && (
                      <optgroup label="Video">
                        {groupedFormats.video.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Audio">
                      {groupedFormats.audio.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </label>
                <p className="text-[10px] text-zinc-500">
                  {findMobilePreset(formatId)?.description}
                </p>
                <Button
                  size="lg"
                  className="w-full"
                  onClick={doExport}
                  disabled={busy || selectedRegions.length === 0}
                >
                  {busy
                    ? `Exporting… ${progress?.pct.toFixed(0) ?? 0}%`
                    : exportMode === 'single'
                      ? `Export single ${findMobilePreset(formatId)?.extension.slice(1).toUpperCase()}`
                      : `Export ${selectedRegions.length} files`}
                </Button>
                {progress && busy && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className="h-full bg-indigo-500 transition-all"
                        style={{ width: `${progress.pct}%` }}
                      />
                    </div>
                    {progress.label && (
                      <p className="text-[10px] text-zinc-500">{progress.label}</p>
                    )}
                  </div>
                )}
                <div className="border-t border-zinc-800 pt-3">
                  <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-500">
                    Hand off to an NLE
                  </p>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(Object.keys(NLE) as NleFormat[]).map((fmt) => (
                      <Button
                        key={fmt}
                        size="sm"
                        variant="ghost"
                        onClick={() => shareNle(fmt)}
                        disabled={busy || selectedRegions.length === 0}
                        className="text-xs"
                      >
                        {NLE[fmt].label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </Accordion>
            <Accordion
              title="Detection"
              meta={`${settings.thresholdDb} dB · ${settings.minSilenceDurationMs}ms`}
              open={showSettings}
              onToggle={() => setShowSettings((s) => !s)}
            >
              <div className="space-y-4 pt-2">
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
            </Accordion>
            <Accordion
              title="Regions"
              meta={`${regions.length} · ${regions.filter((r) => r.kept).length} kept`}
              open={showRegions}
              onToggle={() => setShowRegions((s) => !s)}
            >
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
            </Accordion>
          </>
        )}
      </main>
    </div>
  );
}

function Card({ children, padding = 'p-3' }: { children: React.ReactNode; padding?: string }) {
  return (
    <div className={`rounded-lg border border-zinc-800 bg-zinc-900/60 ${padding} shadow-sm`}>
      {children}
    </div>
  );
}

function Accordion({
  title,
  meta,
  open,
  onToggle,
  children,
}: {
  title: string;
  meta?: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/60">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-3 text-sm font-medium"
      >
        <span>
          {title}
          {meta && <span className="ml-2 text-xs text-zinc-500">{meta}</span>}
        </span>
        <span className="text-zinc-500">{open ? '▼' : '▶'}</span>
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
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
    <div>
      <div className="flex items-center justify-between border-t border-zinc-800 px-1 py-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-zinc-400">Selection</span>
        <div className="flex gap-2">
          <button className="text-indigo-300 active:text-indigo-200" onClick={onSelectAll}>
            All kept
          </button>
          <span className="text-zinc-700">·</span>
          <button className="text-zinc-400 active:text-zinc-200" onClick={onClearSelection}>
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
              className={`flex items-center gap-2 py-2.5 ${
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
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium ${
                  r.kept ? 'bg-indigo-600/30 text-indigo-200' : 'bg-zinc-800 text-zinc-500'
                }`}
                aria-label={r.kept ? 'Mark as silence' : 'Mark as kept'}
              >
                {r.kept ? '✓' : '✕'}
              </button>
              <button
                onClick={() => onSelectToggle(r.id)}
                disabled={!r.kept}
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-medium ${
                  selected ? 'bg-emerald-600/30 text-emerald-200' : 'bg-zinc-800 text-zinc-500'
                } disabled:opacity-30`}
                aria-label={selected ? 'Exclude from export' : 'Include in export'}
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

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 translate-x-[1px]" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
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
