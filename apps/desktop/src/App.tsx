import { useCallback, useMemo, useRef, useState } from 'react';
import { Button, Slider } from '@quietcut/ui';
import { WaveformTimeline } from '@quietcut/timeline';
import {
  DEFAULT_DETECTION,
  buildRegionsFromSilences,
  mergeRight,
  moveBoundary,
  nextKeptStart,
  outputDuration,
  prevKeptStart,
  regionAtTime,
  splitAt,
  toggleKept,
  type MediaSource,
  type Region,
  type SilenceDetectionSettings,
} from '@quietcut/core';
import { useStore } from './store.ts';
import { pickMediaFiles, analyzeMedia, runSilenceDetection, computePeaks } from './bridge.ts';
import { MediaPlayer, type MediaPlayerHandle } from './MediaPlayer.tsx';
import { useShortcuts } from './shortcuts.ts';

let idCounter = 0;
const nextId = () => `m${Date.now().toString(36)}-${idCounter++}`;

export function App() {
  const source = useStore((s) => s.source);
  const regions = useStore((s) => s.regions);
  const peaks = useStore((s) => s.peaks);
  const currentTime = useStore((s) => s.currentTime);
  const past = useStore((s) => s.past);
  const future = useStore((s) => s.future);
  const setSource = useStore((s) => s.setSource);
  const setRegions = useStore((s) => s.setRegions);
  const setPeaks = useStore((s) => s.setPeaks);
  const setCurrentTime = useStore((s) => s.setCurrentTime);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const resetHistory = useStore((s) => s.resetHistory);

  const [settings, setSettings] = useState<SilenceDetectionSettings>(DEFAULT_DETECTION);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<MediaPlayerHandle>(null);

  const open = async () => {
    setError(null);
    try {
      const paths = await pickMediaFiles();
      if (paths.length === 0) return;
      setBusy(true);
      setPeaks(null);
      resetHistory();
      const src = await analyzeMedia(paths[0]!);
      setSource(src);
      const [silences, wavePeaks] = await Promise.all([
        runSilenceDetection(src.path, settings),
        computePeaks(src.path, 2048).catch(() => null),
      ]);
      setRegions(buildRegionsFromSilences(src.duration, silences, settings), { history: false });
      resetHistory();
      if (wavePeaks) setPeaks(wavePeaks);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const reanalyze = useCallback(async () => {
    if (!source) return;
    setBusy(true);
    setError(null);
    try {
      const silences = await runSilenceDetection(source.path, settings);
      setRegions(buildRegionsFromSilences(source.duration, silences, settings));
      if (!peaks) {
        const wavePeaks = await computePeaks(source.path, 2048).catch(() => null);
        if (wavePeaks) setPeaks(wavePeaks);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [source, settings, peaks, setRegions, setPeaks]);

  const onSeek = useCallback(
    (t: number) => {
      setCurrentTime(t);
      playerRef.current?.seek(t);
    },
    [setCurrentTime],
  );

  const onBoundaryDrag = useCallback(
    (id: string, side: 'start' | 'end', time: number) => {
      setRegions(moveBoundary(regions, id, side, time), { history: false });
    },
    [regions, setRegions],
  );

  const onBoundaryRelease = useCallback(() => {
    // Promote the in-flight drag to a history checkpoint.
    setRegions([...regions]);
  }, [regions, setRegions]);

  const onRegionToggle = useCallback(
    (id: string) => setRegions(toggleKept(regions, id)),
    [regions, setRegions],
  );

  const shortcuts = useMemo(
    () => ({
      togglePlay: () => playerRef.current?.toggle(),
      nextKept: () => {
        const t = nextKeptStart(regions, currentTime);
        if (t != null) onSeek(t);
      },
      prevKept: () => {
        const t = prevKeptStart(regions, currentTime);
        if (t != null) onSeek(t);
      },
      split: () => setRegions(splitAt(regions, currentTime, nextId)),
      toggleRegion: () => {
        const r = regionAtTime(regions, currentTime);
        if (r) setRegions(toggleKept(regions, r.id));
      },
      undo,
      redo,
    }),
    [regions, currentTime, onSeek, setRegions, undo, redo],
  );
  useShortcuts(shortcuts);

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      <Header canUndo={past.length > 0} canRedo={future.length > 0} onUndo={undo} onRedo={redo} />
      <main className="flex flex-1 min-h-0">
        <Sidebar
          settings={settings}
          onSettingsChange={setSettings}
          onReanalyze={reanalyze}
          disabled={busy || !source}
        />
        <section className="flex flex-1 min-w-0 flex-col p-6">
          {!source ? (
            <EmptyState onOpen={open} busy={busy} />
          ) : (
            <SourceView
              source={source}
              regions={regions}
              peaks={peaks}
              currentTime={currentTime}
              busy={busy}
              playerRef={playerRef}
              onTimeUpdate={setCurrentTime}
              onSeek={onSeek}
              onBoundaryDrag={onBoundaryDrag}
              onBoundaryRelease={onBoundaryRelease}
              onRegionToggle={onRegionToggle}
              onMerge={(id) => setRegions(mergeRight(regions, id))}
            />
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-md bg-rose-950 px-4 py-2 text-rose-200">
              {error}
            </p>
          )}
        </section>
      </main>
      <Statusbar regions={regions} duration={source?.duration ?? 0} />
    </div>
  );
}

function Header({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
      <h1 className="text-lg font-semibold tracking-tight">Quietcut</h1>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo}>
          Redo
        </Button>
        <span className="ml-3 text-xs text-zinc-500">v0.0.3 — Phase 2 editor</span>
      </div>
    </header>
  );
}

function Statusbar({ regions, duration }: { regions: Region[]; duration: number }) {
  const kept = outputDuration(regions);
  const drops = regions.filter((r) => !r.kept).length;
  return (
    <footer className="border-t border-zinc-800 px-6 py-2 text-xs text-zinc-500 flex gap-6">
      <span>Source: {duration.toFixed(2)}s</span>
      <span>Output: {kept.toFixed(2)}s</span>
      <span>Removed: {(duration - kept).toFixed(2)}s</span>
      <span>{drops} cuts</span>
      <span className="ml-auto">Space play · J/L skip silence · K split · D toggle · ⌘Z undo</span>
    </footer>
  );
}

function EmptyState({ onOpen, busy }: { onOpen: () => void; busy: boolean }) {
  return (
    <div className="m-auto flex flex-col items-center gap-4 text-center">
      <h2 className="text-2xl font-medium">Open a video or audio file</h2>
      <p className="max-w-md text-zinc-400">
        Quietcut detects silences automatically and lets you export the trimmed result or send it to
        your favorite editor.
      </p>
      <Button size="lg" onClick={onOpen} disabled={busy}>
        {busy ? 'Loading…' : 'Choose file(s)'}
      </Button>
    </div>
  );
}

function SourceView({
  source,
  regions,
  peaks,
  currentTime,
  busy,
  playerRef,
  onTimeUpdate,
  onSeek,
  onBoundaryDrag,
  onBoundaryRelease,
  onRegionToggle,
  onMerge,
}: {
  source: MediaSource;
  regions: Region[];
  peaks: Float32Array | null;
  currentTime: number;
  busy: boolean;
  playerRef: React.RefObject<MediaPlayerHandle | null>;
  onTimeUpdate: (t: number) => void;
  onSeek: (t: number) => void;
  onBoundaryDrag: (id: string, side: 'start' | 'end', t: number) => void;
  onBoundaryRelease: () => void;
  onRegionToggle: (id: string) => void;
  onMerge: (id: string) => void;
}) {
  const savedSeconds = source.duration - outputDuration(regions);
  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-lg font-medium">{source.name}</h2>
          <p className="text-sm text-zinc-400">
            {source.duration.toFixed(1)}s · {regions.filter((r) => !r.kept).length} silences · save{' '}
            {savedSeconds.toFixed(1)}s
          </p>
        </div>
      </div>
      <MediaPlayer ref={playerRef} source={source} onTimeUpdate={onTimeUpdate} />
      <div
        className="rounded-lg border border-zinc-800 bg-zinc-900 p-2"
        onMouseUp={onBoundaryRelease}
      >
        <WaveformTimeline
          peaks={peaks}
          regions={regions}
          duration={source.duration}
          currentTime={currentTime}
          onSeek={onSeek}
          onBoundaryDrag={onBoundaryDrag}
          onRegionClick={onRegionToggle}
        />
      </div>
      <RegionsList
        regions={regions}
        currentTime={currentTime}
        onSeek={onSeek}
        onToggle={onRegionToggle}
        onMerge={onMerge}
      />
      {busy && <p className="text-sm text-zinc-400">Analyzing…</p>}
    </div>
  );
}

function RegionsList({
  regions,
  currentTime,
  onSeek,
  onToggle,
  onMerge,
}: {
  regions: Region[];
  currentTime: number;
  onSeek: (t: number) => void;
  onToggle: (id: string) => void;
  onMerge: (id: string) => void;
}) {
  return (
    <div className="overflow-auto max-h-64 rounded-lg border border-zinc-800">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-zinc-900 text-left text-xs uppercase text-zinc-500">
          <tr>
            <th className="px-3 py-2">#</th>
            <th className="px-3 py-2">Start</th>
            <th className="px-3 py-2">End</th>
            <th className="px-3 py-2">Length</th>
            <th className="px-3 py-2">Kept</th>
            <th className="px-3 py-2">Source</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {regions.map((r, i) => {
            const active = currentTime >= r.start && currentTime <= r.end;
            return (
              <tr
                key={r.id}
                className={`border-t border-zinc-800 ${active ? 'bg-zinc-800/60' : ''}`}
              >
                <td className="px-3 py-1.5 text-zinc-500">{i + 1}</td>
                <td className="px-3 py-1.5">
                  <button className="hover:text-indigo-300" onClick={() => onSeek(r.start)}>
                    {r.start.toFixed(2)}
                  </button>
                </td>
                <td className="px-3 py-1.5">{r.end.toFixed(2)}</td>
                <td className="px-3 py-1.5 text-zinc-400">{(r.end - r.start).toFixed(2)}s</td>
                <td className="px-3 py-1.5">
                  <input
                    type="checkbox"
                    checked={r.kept}
                    onChange={() => onToggle(r.id)}
                    aria-label={`Keep region ${i + 1}`}
                  />
                </td>
                <td className="px-3 py-1.5 text-zinc-500">{r.source}</td>
                <td className="px-3 py-1.5 text-right">
                  {i < regions.length - 1 && (
                    <button
                      className="text-xs text-zinc-400 hover:text-zinc-200"
                      onClick={() => onMerge(r.id)}
                      title="Merge with next region"
                    >
                      merge →
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Sidebar({
  settings,
  onSettingsChange,
  onReanalyze,
  disabled,
}: {
  settings: SilenceDetectionSettings;
  onSettingsChange: (s: SilenceDetectionSettings) => void;
  onReanalyze: () => void;
  disabled: boolean;
}) {
  return (
    <aside className="w-72 shrink-0 border-r border-zinc-800 p-6 overflow-auto">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-400">
        Detection
      </h3>
      <div className="space-y-5">
        <Field label={`Threshold: ${settings.thresholdDb} dB`}>
          <Slider
            ariaLabel="Silence threshold in decibels"
            value={settings.thresholdDb}
            onValueChange={(v) => onSettingsChange({ ...settings, thresholdDb: v })}
            min={-60}
            max={-10}
            step={1}
          />
        </Field>
        <Field label={`Min silence: ${settings.minSilenceDurationMs} ms`}>
          <Slider
            ariaLabel="Minimum silence duration"
            value={settings.minSilenceDurationMs}
            onValueChange={(v) => onSettingsChange({ ...settings, minSilenceDurationMs: v })}
            min={100}
            max={3000}
            step={50}
          />
        </Field>
        <Field label={`Padding: ${settings.paddingMs} ms`}>
          <Slider
            ariaLabel="Padding around speech"
            value={settings.paddingMs}
            onValueChange={(v) => onSettingsChange({ ...settings, paddingMs: v })}
            min={0}
            max={500}
            step={10}
          />
        </Field>
      </div>
      <Button className="mt-6 w-full" onClick={onReanalyze} disabled={disabled}>
        Re-analyze
      </Button>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-zinc-300">{label}</span>
      {children}
    </label>
  );
}
