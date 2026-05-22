import { useCallback, useMemo, useRef, useState } from 'react';
import { save, open as openDialog } from '@tauri-apps/plugin-dialog';
import { Button, Slider } from '@quietcut/ui';
import { WaveformTimeline } from '@quietcut/timeline';
import {
  PROJECT_FILE_EXTENSION,
  buildRegionsFromSilences,
  mergeRight,
  moveBoundary,
  nextKeptStart,
  outputDuration,
  parseProject,
  prevKeptStart,
  regionAtTime,
  serializeProject,
  splitAt,
  toggleKept,
  type MediaSource,
  type Region,
  type SilenceDetectionSettings,
} from '@quietcut/core';
import { useStore } from './store.ts';
import {
  pickMediaFiles,
  analyzeMedia,
  runSilenceDetection,
  computePeaks,
  writeFile,
  readFile,
} from './bridge.ts';
import { MediaPlayer, type MediaPlayerHandle } from './MediaPlayer.tsx';
import { ExportPanel } from './ExportPanel.tsx';
import { useShortcuts } from './shortcuts.ts';

let idCounter = 0;
const nextId = () => `m${Date.now().toString(36)}-${idCounter++}`;

export function App() {
  const sources = useStore((s) => s.sources);
  const currentSourceId = useStore((s) => s.currentSourceId);
  const regionsBySource = useStore((s) => s.regionsBySource);
  const peaksBySource = useStore((s) => s.peaksBySource);
  const currentTime = useStore((s) => s.currentTime);
  const past = useStore((s) => s.past);
  const future = useStore((s) => s.future);
  const settings = useStore((s) => s.detectionSettings);
  const projectName = useStore((s) => s.projectName);
  const projectPath = useStore((s) => s.projectPath);
  const store = useStore;

  const source = useMemo(
    () => sources.find((s) => s.id === currentSourceId) ?? null,
    [sources, currentSourceId],
  );
  const regions = useMemo(
    () => (currentSourceId ? (regionsBySource[currentSourceId] ?? []) : []),
    [regionsBySource, currentSourceId],
  );
  const peaks = useMemo(
    () => (currentSourceId ? (peaksBySource[currentSourceId] ?? null) : null),
    [peaksBySource, currentSourceId],
  );

  const [busy, setBusy] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ index: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<MediaPlayerHandle>(null);

  const analyzeOne = useCallback(
    async (path: string, currentSettings: SilenceDetectionSettings): Promise<MediaSource> => {
      const src = await analyzeMedia(path);
      store.getState().addSource(src);
      const [silences, wavePeaks] = await Promise.all([
        runSilenceDetection(src.path, currentSettings),
        computePeaks(src.path, 2048).catch(() => null),
      ]);
      store
        .getState()
        .setRegionsFor(src.id, buildRegionsFromSilences(src.duration, silences, currentSettings));
      if (wavePeaks) store.getState().setPeaksFor(src.id, wavePeaks);
      return src;
    },
    [store],
  );

  const openFiles = async () => {
    setError(null);
    try {
      const paths = await pickMediaFiles();
      if (paths.length === 0) return;
      setBusy(true);
      setBatchProgress({ index: 0, total: paths.length });
      const currentSettings = store.getState().detectionSettings;
      for (let i = 0; i < paths.length; i++) {
        setBatchProgress({ index: i, total: paths.length });
        await analyzeOne(paths[i]!, currentSettings);
      }
      store.getState().resetHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBatchProgress(null);
      setBusy(false);
    }
  };

  const reanalyzeAll = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const list = store.getState().sources;
      const s = store.getState().detectionSettings;
      for (let i = 0; i < list.length; i++) {
        setBatchProgress({ index: i, total: list.length });
        const src = list[i]!;
        const silences = await runSilenceDetection(src.path, s);
        store.getState().setRegionsFor(src.id, buildRegionsFromSilences(src.duration, silences, s));
      }
      store.getState().resetHistory();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBatchProgress(null);
      setBusy(false);
    }
  }, [store]);

  const saveProjectAs = async () => {
    const path = await save({
      defaultPath: `${projectName}${PROJECT_FILE_EXTENSION}`,
      filters: [{ name: 'Quietcut project', extensions: ['quietcut'] }],
    });
    if (!path) return;
    await writeFile(path, serializeProject(store.getState().toProjectFile()));
    store.getState().setProjectPath(path);
  };

  const saveProject = async () => {
    if (!projectPath) return saveProjectAs();
    await writeFile(projectPath, serializeProject(store.getState().toProjectFile()));
  };

  const loadProject = async () => {
    const picked = await openDialog({
      multiple: false,
      filters: [{ name: 'Quietcut project', extensions: ['quietcut'] }],
    });
    const path = Array.isArray(picked) ? picked[0] : picked;
    if (!path) return;
    try {
      const raw = await readFile(path);
      const project = parseProject(raw);
      store.getState().loadProject(project, path);
    } catch (e) {
      setError(`Failed to load project: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const newProject = () => store.getState().resetProject();

  const onSeek = useCallback(
    (t: number) => {
      store.getState().setCurrentTime(t);
      playerRef.current?.seek(t);
    },
    [store],
  );

  const onBoundaryDrag = useCallback(
    (id: string, side: 'start' | 'end', time: number) => {
      store.getState().setRegions(moveBoundary(regions, id, side, time), { history: false });
    },
    [regions, store],
  );

  const onBoundaryRelease = useCallback(() => {
    store.getState().setRegions([...regions]);
  }, [regions, store]);

  const onRegionToggle = useCallback(
    (id: string) => store.getState().setRegions(toggleKept(regions, id)),
    [regions, store],
  );

  const onSettingsChange = useCallback(
    (s: SilenceDetectionSettings) => store.getState().setDetectionSettings(s),
    [store],
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
      split: () => store.getState().setRegions(splitAt(regions, currentTime, nextId)),
      toggleRegion: () => {
        const r = regionAtTime(regions, currentTime);
        if (r) store.getState().setRegions(toggleKept(regions, r.id));
      },
      undo: () => store.getState().undo(),
      redo: () => store.getState().redo(),
    }),
    [regions, currentTime, onSeek, store],
  );
  useShortcuts(shortcuts);

  return (
    <div className="flex h-full flex-col bg-zinc-950 text-zinc-100">
      <Header
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onUndo={() => store.getState().undo()}
        onRedo={() => store.getState().redo()}
        onNewProject={newProject}
        onLoadProject={loadProject}
        onSaveProject={saveProject}
        onSaveProjectAs={saveProjectAs}
        projectName={projectName}
        projectDirty={false}
      />
      <main className="flex flex-1 min-h-0">
        <Sidebar
          sources={sources}
          currentSourceId={currentSourceId}
          settings={settings}
          batchProgress={batchProgress}
          onSelectSource={(id) => store.getState().selectSource(id)}
          onRemoveSource={(id) => store.getState().removeSource(id)}
          onSettingsChange={onSettingsChange}
          onReanalyzeAll={reanalyzeAll}
          onAddFiles={openFiles}
          disabled={busy}
        />
        <section className="flex flex-1 min-w-0 flex-col p-6 overflow-auto">
          {!source ? (
            <EmptyState onOpen={openFiles} onLoad={loadProject} busy={busy} />
          ) : (
            <SourceView
              source={source}
              regions={regions}
              peaks={peaks}
              currentTime={currentTime}
              busy={busy}
              projectName={projectName}
              playerRef={playerRef}
              onTimeUpdate={(t) => store.getState().setCurrentTime(t)}
              onSeek={onSeek}
              onBoundaryDrag={onBoundaryDrag}
              onBoundaryRelease={onBoundaryRelease}
              onRegionToggle={onRegionToggle}
              onMerge={(id) => store.getState().setRegions(mergeRight(regions, id))}
            />
          )}
          {error && (
            <p role="alert" className="mt-4 rounded-md bg-rose-950 px-4 py-2 text-rose-200">
              {error}
            </p>
          )}
        </section>
      </main>
      <Statusbar regions={regions} duration={source?.duration ?? 0} sourceCount={sources.length} />
    </div>
  );
}

function Header({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onNewProject,
  onLoadProject,
  onSaveProject,
  onSaveProjectAs,
  projectName,
  projectDirty,
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onNewProject: () => void;
  onLoadProject: () => void;
  onSaveProject: () => void;
  onSaveProjectAs: () => void;
  projectName: string;
  projectDirty: boolean;
}) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-3">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold tracking-tight">Quietcut</h1>
        <span className="text-xs text-zinc-500">
          {projectName}
          {projectDirty ? ' •' : ''}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={onNewProject}>
          New
        </Button>
        <Button variant="ghost" size="sm" onClick={onLoadProject}>
          Open
        </Button>
        <Button variant="ghost" size="sm" onClick={onSaveProject}>
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={onSaveProjectAs}>
          Save as…
        </Button>
        <div className="mx-2 h-5 w-px bg-zinc-800" />
        <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo}>
          Undo
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo}>
          Redo
        </Button>
        <span className="ml-3 text-xs text-zinc-500">v0.1.0 — Phase 7 advanced</span>
      </div>
    </header>
  );
}

function Statusbar({
  regions,
  duration,
  sourceCount,
}: {
  regions: Region[];
  duration: number;
  sourceCount: number;
}) {
  const kept = outputDuration(regions);
  const drops = regions.filter((r) => !r.kept).length;
  return (
    <footer className="border-t border-zinc-800 px-6 py-2 text-xs text-zinc-500 flex gap-6">
      <span>
        {sourceCount} source{sourceCount === 1 ? '' : 's'}
      </span>
      <span>Source: {duration.toFixed(2)}s</span>
      <span>Output: {kept.toFixed(2)}s</span>
      <span>Removed: {(duration - kept).toFixed(2)}s</span>
      <span>{drops} cuts</span>
      <span className="ml-auto">Space play · J/L skip · K split · D toggle · ⌘Z undo</span>
    </footer>
  );
}

function EmptyState({
  onOpen,
  onLoad,
  busy,
}: {
  onOpen: () => void;
  onLoad: () => void;
  busy: boolean;
}) {
  return (
    <div className="m-auto flex flex-col items-center gap-4 text-center">
      <h2 className="text-2xl font-medium">Open files or a project</h2>
      <p className="max-w-md text-zinc-400">
        Quietcut detects silences automatically and lets you export the trimmed result or send it to
        your favorite editor.
      </p>
      <div className="flex gap-2">
        <Button size="lg" onClick={onOpen} disabled={busy}>
          {busy ? 'Loading…' : 'Choose file(s)'}
        </Button>
        <Button size="lg" variant="secondary" onClick={onLoad} disabled={busy}>
          Open project…
        </Button>
      </div>
    </div>
  );
}

function SourceView({
  source,
  regions,
  peaks,
  currentTime,
  busy,
  projectName,
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
  projectName: string;
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
      <ExportPanel source={source} regions={regions} projectName={projectName} />
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
  sources,
  currentSourceId,
  settings,
  batchProgress,
  onSelectSource,
  onRemoveSource,
  onSettingsChange,
  onReanalyzeAll,
  onAddFiles,
  disabled,
}: {
  sources: MediaSource[];
  currentSourceId: string | null;
  settings: SilenceDetectionSettings;
  batchProgress: { index: number; total: number } | null;
  onSelectSource: (id: string) => void;
  onRemoveSource: (id: string) => void;
  onSettingsChange: (s: SilenceDetectionSettings) => void;
  onReanalyzeAll: () => void;
  onAddFiles: () => void;
  disabled: boolean;
}) {
  return (
    <aside className="flex w-72 shrink-0 flex-col border-r border-zinc-800 overflow-auto">
      <div className="border-b border-zinc-800 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Sources</h3>
          <Button size="sm" variant="ghost" onClick={onAddFiles} disabled={disabled}>
            + Add
          </Button>
        </div>
        {sources.length === 0 ? (
          <p className="text-xs text-zinc-500">No sources yet.</p>
        ) : (
          <ul className="space-y-1">
            {sources.map((s) => {
              const active = s.id === currentSourceId;
              return (
                <li
                  key={s.id}
                  className={`group flex items-center justify-between rounded px-2 py-1 text-sm ${
                    active ? 'bg-indigo-600/20 text-indigo-200' : 'hover:bg-zinc-800/60'
                  }`}
                >
                  <button
                    className="truncate text-left flex-1 min-w-0"
                    onClick={() => onSelectSource(s.id)}
                    title={s.path}
                  >
                    {s.name}
                  </button>
                  <button
                    className="ml-2 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400"
                    onClick={() => onRemoveSource(s.id)}
                    aria-label={`Remove ${s.name}`}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {batchProgress && (
          <p className="mt-2 text-xs text-zinc-400">
            Analyzing {batchProgress.index + 1}/{batchProgress.total}…
          </p>
        )}
      </div>
      <div className="p-4">
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
        <Button
          className="mt-6 w-full"
          onClick={onReanalyzeAll}
          disabled={disabled || sources.length === 0}
        >
          Re-analyze all
        </Button>
      </div>
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
