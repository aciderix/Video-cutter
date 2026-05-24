import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { save, open as openDialog, confirm } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import { Button, Slider } from '@quietcut/ui';
import { WaveformTimeline } from '@quietcut/timeline';
import {
  PROJECT_FILE_EXTENSION,
  QUIETCUT_VERSION,
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
  pickSingleMediaFile,
  analyzeMedia,
  runSilenceDetection,
  computePeaks,
  writeFile,
  readFile,
  pathExists,
  formatBridgeError,
} from './bridge.ts';
import type { CleanAudioOverlay } from '@quietcut/core';
import { MediaPlayer, type MediaPlayerHandle } from './MediaPlayer.tsx';
import { ExportPanel } from './ExportPanel.tsx';
import { OverlaysSection } from './OverlaysSection.tsx';
import { OverlayStrip } from './OverlayStrip.tsx';
import { TransportBar } from './TransportBar.tsx';
import { useShortcuts } from './shortcuts.ts';
import { clampViewport, MAX_ZOOM, MIN_ZOOM } from '@quietcut/timeline';

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
  const dirty = useStore((s) => s.dirty);
  const skipSilences = useStore((s) => s.skipSilences);
  const exportSelectionBySource = useStore((s) => s.exportSelectionBySource);
  const overlaysBySource = useStore((s) => s.overlaysBySource);
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
  const overlays = useMemo(
    () => (currentSourceId ? (overlaysBySource[currentSourceId] ?? []) : []),
    [overlaysBySource, currentSourceId],
  );
  /** Selection used by ExportPanel and RegionsList. Falls back to "all kept"
   * when the user has not explicitly toggled anything yet. */
  const effectiveSelection = useMemo<Set<string>>(() => {
    if (!currentSourceId) return new Set<string>();
    const explicit = exportSelectionBySource[currentSourceId];
    if (explicit) return explicit;
    return new Set(regions.filter((r) => r.kept).map((r) => r.id));
  }, [exportSelectionBySource, currentSourceId, regions]);

  const [busy, setBusy] = useState(false);
  const [batchProgress, setBatchProgress] = useState<{ index: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<MediaPlayerHandle>(null);
  const [zoom, setZoom] = useState(1);
  const [viewOffset, setViewOffset] = useState(0);
  useEffect(() => {
    // Reset viewport when switching sources.
    setZoom(1);
    setViewOffset(0);
  }, [currentSourceId]);
  const onViewportChange = useCallback(
    (newZoom: number, newOffset: number) => {
      if (!source) return;
      const clamped = clampViewport(newZoom, newOffset, source.duration);
      setZoom(clamped.zoom);
      setViewOffset(clamped.offset);
    },
    [source],
  );
  const zoomIn = useCallback(() => {
    if (!source) return;
    const next = Math.min(MAX_ZOOM, zoom * 1.5);
    const span = source.duration / next;
    const focus = currentTime;
    setZoom(next);
    setViewOffset(Math.max(0, Math.min(source.duration - span, focus - span / 2)));
  }, [zoom, source, currentTime]);
  const zoomOut = useCallback(() => {
    if (!source) return;
    const next = Math.max(MIN_ZOOM, zoom / 1.5);
    const span = source.duration / next;
    setZoom(next);
    setViewOffset(Math.max(0, Math.min(source.duration - span, viewOffset)));
  }, [zoom, source, viewOffset]);
  const zoomFit = useCallback(() => {
    setZoom(1);
    setViewOffset(0);
  }, []);
  const centerOnPlayhead = useCallback(() => {
    if (!source) return;
    const span = source.duration / zoom;
    setViewOffset(Math.max(0, Math.min(source.duration - span, currentTime - span / 2)));
  }, [source, zoom, currentTime]);
  // Snapshot of regions captured at the start of a boundary drag. Promoted
  // to the history stack on pointerup.
  const dragSnapshotRef = useRef<Region[] | null>(null);
  const [missingPaths, setMissingPaths] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = new Set<string>();
      for (const s of sources) {
        const exists = await pathExists(s.path).catch(() => false);
        if (!exists) result.add(s.id);
      }
      if (!cancelled) setMissingPaths(result);
    })();
    return () => {
      cancelled = true;
    };
  }, [sources]);

  const analyzeOne = useCallback(
    async (path: string, currentSettings: SilenceDetectionSettings): Promise<MediaSource> => {
      const src = await analyzeMedia(path);
      store.getState().addSource(src);
      store.getState().setPeaksLoading(src.id, true);
      const [silences, wavePeaks] = await Promise.all([
        runSilenceDetection(src.path, currentSettings),
        computePeaks(src.path, 2048, src.duration).catch(() => null),
      ]);
      store
        .getState()
        .setRegionsFor(src.id, buildRegionsFromSilences(src.duration, silences, currentSettings));
      if (wavePeaks) store.getState().setPeaksFor(src.id, wavePeaks);
      store.getState().setPeaksLoading(src.id, false);
      return src;
    },
    [store],
  );

  const openFiles = async () => {
    setError(null);
    const paths = await pickMediaFiles();
    if (paths.length === 0) return;
    setBusy(true);
    setBatchProgress({ index: 0, total: paths.length });
    const currentSettings = store.getState().detectionSettings;
    const failures: string[] = [];
    for (let i = 0; i < paths.length; i++) {
      setBatchProgress({ index: i, total: paths.length });
      try {
        await analyzeOne(paths[i]!, currentSettings);
      } catch (e) {
        failures.push(`${paths[i]}: ${formatBridgeError(e)}`);
      }
    }
    store.getState().resetHistory();
    setBatchProgress(null);
    setBusy(false);
    if (failures.length > 0) {
      setError(`Failed: ${failures.length}/${paths.length}\n${failures.join('\n')}`);
    }
  };

  const reanalyzeAll = useCallback(async () => {
    setBusy(true);
    setError(null);
    const list = store.getState().sources;
    const s = store.getState().detectionSettings;
    const failures: string[] = [];
    for (let i = 0; i < list.length; i++) {
      setBatchProgress({ index: i, total: list.length });
      const src = list[i]!;
      try {
        const silences = await runSilenceDetection(src.path, s);
        store.getState().setRegionsFor(src.id, buildRegionsFromSilences(src.duration, silences, s));
      } catch (e) {
        failures.push(`${src.name}: ${formatBridgeError(e)}`);
      }
    }
    store.getState().resetHistory();
    setBatchProgress(null);
    setBusy(false);
    if (failures.length > 0) {
      setError(`Failed: ${failures.length}/${list.length}\n${failures.join('\n')}`);
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
    store.getState().markClean();
  };

  const saveProject = async () => {
    if (!projectPath) return saveProjectAs();
    await writeFile(projectPath, serializeProject(store.getState().toProjectFile()));
    store.getState().markClean();
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
      // Then re-fetch peaks + flag missing sources.
      const missing: string[] = [];
      for (const src of project.sources) {
        if (await pathExists(src.path)) {
          const peaks = await computePeaks(src.path, 2048, src.duration).catch(() => null);
          if (peaks) store.getState().setPeaksFor(src.id, peaks);
        } else {
          missing.push(src.name);
        }
      }
      if (missing.length > 0) {
        setError(`Missing source files (use Relink in the sidebar): ${missing.join(', ')}`);
      }
    } catch (e) {
      setError(`Failed to load project: ${formatBridgeError(e)}`);
    }
  };

  const relinkSource = useCallback(
    async (id: string) => {
      const path = await pickSingleMediaFile();
      if (!path) return;
      try {
        const replacement = await analyzeMedia(path);
        store.getState().relinkSource(id, replacement);
        const peaks = await computePeaks(path, 2048, replacement.duration).catch(() => null);
        if (peaks) store.getState().setPeaksFor(id, peaks);
        setError(null);
      } catch (e) {
        setError(`Relink failed: ${formatBridgeError(e)}`);
      }
    },
    [store],
  );

  const newProject = async () => {
    if (store.getState().dirty) {
      const ok = await confirm('Discard unsaved changes and start a new project?', {
        title: 'New project',
        kind: 'warning',
      });
      if (!ok) return;
    }
    store.getState().resetProject();
  };

  const removeSourceWithConfirm = async (id: string) => {
    const s = store.getState().sources.find((x) => x.id === id);
    if (!s) return;
    const ok = await confirm(`Remove ${s.name} from the project? Regions will be lost.`, {
      title: 'Remove source',
      kind: 'warning',
    });
    if (!ok) return;
    store.getState().removeSource(id);
  };

  const handleDroppedPaths = useCallback(
    async (paths: string[]) => {
      const mediaPaths = paths.filter((p) =>
        /\.(mp4|mov|mkv|webm|avi|mp3|wav|flac|m4a|aac|ogg|quietcut)$/i.test(p),
      );
      if (mediaPaths.length === 0) return;
      const projectPath = mediaPaths.find((p) => p.endsWith('.quietcut'));
      if (projectPath) {
        try {
          const raw = await readFile(projectPath);
          store.getState().loadProject(parseProject(raw), projectPath);
        } catch (e) {
          setError(`Failed to load project: ${formatBridgeError(e)}`);
        }
        return;
      }
      const currentSettings = store.getState().detectionSettings;
      setBusy(true);
      setBatchProgress({ index: 0, total: mediaPaths.length });
      const failures: string[] = [];
      for (let i = 0; i < mediaPaths.length; i++) {
        setBatchProgress({ index: i, total: mediaPaths.length });
        try {
          await analyzeOne(mediaPaths[i]!, currentSettings);
        } catch (e) {
          failures.push(`${mediaPaths[i]}: ${formatBridgeError(e)}`);
        }
      }
      setBatchProgress(null);
      setBusy(false);
      if (failures.length > 0) {
        setError(failures.join('\n'));
      }
    },
    [analyzeOne, store],
  );

  useEffect(() => {
    const unlisten = listen<{ paths: string[] }>('tauri://drag-drop', (e) => {
      void handleDroppedPaths(e.payload.paths ?? []);
    });
    return () => {
      void unlisten.then((f) => f());
    };
  }, [handleDroppedPaths]);

  const onSeek = useCallback(
    (t: number) => {
      store.getState().setCurrentTime(t);
      playerRef.current?.seek(t);
    },
    [store],
  );

  const onBoundaryDrag = useCallback(
    (id: string, side: 'start' | 'end', time: number) => {
      const current = store.getState();
      if (dragSnapshotRef.current === null && current.currentSourceId) {
        dragSnapshotRef.current = current.regionsBySource[current.currentSourceId] ?? [];
      }
      const live = current.currentSourceId
        ? (current.regionsBySource[current.currentSourceId] ?? [])
        : [];
      current.setRegions(moveBoundary(live, id, side, time), { history: false });
    },
    [store],
  );

  const onBoundaryRelease = useCallback(() => {
    const snapshot = dragSnapshotRef.current;
    dragSnapshotRef.current = null;
    if (!snapshot) return;
    const current = store.getState();
    const sid = current.currentSourceId;
    if (!sid) return;
    // Push the pre-drag snapshot to history without disturbing the current
    // (post-drag) regions array.
    current.pushHistorySnapshot(sid, snapshot);
  }, [store]);

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
      togglePreview: () => store.getState().setSkipSilences(!store.getState().skipSilences),
    }),
    [regions, currentTime, onSeek, store],
  );
  useShortcuts(shortcuts);

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100">
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
        projectDirty={dirty}
      />
      <main className="flex flex-1 min-h-0">
        <Sidebar
          sources={sources}
          currentSourceId={currentSourceId}
          missingPaths={missingPaths}
          settings={settings}
          batchProgress={batchProgress}
          onSelectSource={(id) => store.getState().selectSource(id)}
          onRemoveSource={removeSourceWithConfirm}
          onRelinkSource={relinkSource}
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
              skipSilences={skipSilences}
              onToggleSkipSilences={() => store.getState().setSkipSilences(!skipSilences)}
              selectedIds={effectiveSelection}
              onToggleSelection={(id) =>
                source && store.getState().toggleExportSelection(source.id, id)
              }
              onSelectAllKept={() => {
                if (!source) return;
                store
                  .getState()
                  .setExportSelection(
                    source.id,
                    new Set(regions.filter((r) => r.kept).map((r) => r.id)),
                  );
              }}
              onClearSelection={() => {
                if (!source) return;
                store.getState().setExportSelection(source.id, new Set());
              }}
              onTimeUpdate={(t) => store.getState().setCurrentTime(t)}
              onSeek={onSeek}
              onBoundaryDrag={onBoundaryDrag}
              onBoundaryRelease={onBoundaryRelease}
              onRegionToggle={onRegionToggle}
              onMerge={(id) => store.getState().setRegions(mergeRight(regions, id))}
              zoom={zoom}
              viewOffset={viewOffset}
              onViewportChange={onViewportChange}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onZoomFit={zoomFit}
              onCenterPlayhead={centerOnPlayhead}
              overlays={overlays}
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
        <span className="ml-3 text-xs text-zinc-500">v{QUIETCUT_VERSION}</span>
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
      <span className="ml-auto">
        Space play · J/L skip · K split · D toggle · P preview · ⌘Z undo · ⌘⇧Z redo · ←/→ scrub
      </span>
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
  skipSilences,
  onToggleSkipSilences,
  selectedIds,
  onToggleSelection,
  onSelectAllKept,
  onClearSelection,
  onTimeUpdate,
  onSeek,
  onBoundaryDrag,
  onBoundaryRelease,
  onRegionToggle,
  onMerge,
  zoom,
  viewOffset,
  onViewportChange,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onCenterPlayhead,
  overlays,
}: {
  source: MediaSource;
  regions: Region[];
  peaks: Float32Array | null;
  currentTime: number;
  busy: boolean;
  projectName: string;
  playerRef: React.RefObject<MediaPlayerHandle | null>;
  skipSilences: boolean;
  onToggleSkipSilences: () => void;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAllKept: () => void;
  onClearSelection: () => void;
  onTimeUpdate: (t: number) => void;
  onSeek: (t: number) => void;
  onBoundaryDrag: (id: string, side: 'start' | 'end', t: number) => void;
  onBoundaryRelease: () => void;
  onRegionToggle: (id: string) => void;
  onMerge: (id: string) => void;
  zoom: number;
  viewOffset: number;
  onViewportChange: (zoom: number, offset: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomFit: () => void;
  onCenterPlayhead: () => void;
  overlays: CleanAudioOverlay[];
}) {
  const savedSeconds = source.duration - outputDuration(regions);
  return (
    <div className="flex flex-col gap-4 min-h-0">
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-medium">{source.name}</h2>
          <p className="text-sm text-zinc-400">
            {source.duration.toFixed(1)}s · {regions.filter((r) => !r.kept).length} silences · save{' '}
            {savedSeconds.toFixed(1)}s
          </p>
          <MediaInfo source={source} />
        </div>
        <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={skipSilences}
            onChange={onToggleSkipSilences}
            className="h-4 w-4 accent-indigo-500"
          />
          <span>
            Preview cuts <span className="text-zinc-500">(skip silences during playback)</span>
          </span>
        </label>
      </div>
      <MediaPlayer
        ref={playerRef}
        source={source}
        regions={regions}
        skipSilences={skipSilences}
        onTimeUpdate={onTimeUpdate}
      />
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-2 space-y-2">
        <TransportBar
          player={playerRef}
          currentTime={currentTime}
          duration={source.duration}
          zoom={zoom}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          onZoomFit={onZoomFit}
          onJumpToPlayhead={onCenterPlayhead}
        />
        <WaveformTimeline
          peaks={peaks}
          regions={regions}
          duration={source.duration}
          currentTime={currentTime}
          zoom={zoom}
          offset={viewOffset}
          onZoomChange={onViewportChange}
          onSeek={onSeek}
          onBoundaryDrag={onBoundaryDrag}
          onBoundaryDragEnd={onBoundaryRelease}
          onRegionKeptToggle={onRegionToggle}
          onRegionExportToggle={onToggleSelection}
          selectedExportIds={selectedIds}
        />
        <OverlayStrip
          overlays={overlays}
          duration={source.duration}
          zoom={zoom}
          viewOffset={viewOffset}
        />
      </div>
      <OverlaysSection source={source} overlays={overlays} />
      <ExportPanel
        source={source}
        regions={regions}
        projectName={projectName}
        selectedIds={selectedIds}
      />
      <RegionsList
        regions={regions}
        currentTime={currentTime}
        selectedIds={selectedIds}
        onSeek={onSeek}
        onToggle={onRegionToggle}
        onToggleSelection={onToggleSelection}
        onSelectAllKept={onSelectAllKept}
        onClearSelection={onClearSelection}
        onMerge={onMerge}
      />
      {busy && <p className="text-sm text-zinc-400">Analyzing…</p>}
    </div>
  );
}

function MediaInfo({ source }: { source: MediaSource }) {
  const parts: string[] = [];
  if (source.videoStream) {
    parts.push(
      `${source.videoStream.width}×${source.videoStream.height}`,
      `${source.videoStream.frameRate.toFixed(2)} fps`,
      source.videoStream.codec.toUpperCase(),
    );
    if (source.videoStream.bitrate) {
      parts.push(`${Math.round(source.videoStream.bitrate / 1000)} kbps`);
    }
  }
  if (source.audioStream) {
    parts.push(
      `${(source.audioStream.sampleRate / 1000).toFixed(1)} kHz`,
      `${source.audioStream.channels}ch`,
      source.audioStream.codec.toUpperCase(),
    );
  }
  if (parts.length === 0) return null;
  return (
    <p className="mt-1 text-xs text-zinc-500" title="Source media metadata">
      {parts.join(' · ')}
    </p>
  );
}

function RegionsList({
  regions,
  currentTime,
  selectedIds,
  onSeek,
  onToggle,
  onToggleSelection,
  onSelectAllKept,
  onClearSelection,
  onMerge,
}: {
  regions: Region[];
  currentTime: number;
  selectedIds: Set<string>;
  onSeek: (t: number) => void;
  onToggle: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onSelectAllKept: () => void;
  onClearSelection: () => void;
  onMerge: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-zinc-800">
      <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2 text-xs">
        <span className="font-semibold uppercase tracking-wider text-zinc-400">Regions</span>
        <div className="flex gap-2">
          <button
            className="text-zinc-400 hover:text-zinc-200"
            onClick={onSelectAllKept}
            title="Select all kept regions for export"
          >
            Select all kept
          </button>
          <span className="text-zinc-700">·</span>
          <button
            className="text-zinc-400 hover:text-zinc-200"
            onClick={onClearSelection}
            title="Clear the export selection"
          >
            Deselect all
          </button>
        </div>
      </div>
      <div className="overflow-auto max-h-64">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-900 text-left text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Start</th>
              <th className="px-3 py-2">End</th>
              <th className="px-3 py-2">Length</th>
              <th
                className="px-3 py-2"
                title="Keep this region in the edit (J/L navigates kept regions)"
              >
                Kept
              </th>
              <th className="px-3 py-2" title="Include this kept region in the export">
                Export
              </th>
              <th className="px-3 py-2">Source</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {regions.map((r, i) => {
              const active = currentTime >= r.start && currentTime <= r.end;
              const selected = selectedIds.has(r.id);
              return (
                <tr
                  key={r.id}
                  className={`border-t border-zinc-800 ${
                    active ? 'bg-indigo-600/15' : !r.kept ? 'opacity-60' : ''
                  }`}
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
                      className="h-4 w-4 accent-indigo-500"
                    />
                  </td>
                  <td className="px-3 py-1.5">
                    <input
                      type="checkbox"
                      checked={selected}
                      disabled={!r.kept}
                      onChange={() => onToggleSelection(r.id)}
                      aria-label={`Include region ${i + 1} in export`}
                      className="h-4 w-4 accent-emerald-500 disabled:opacity-30"
                      title={
                        r.kept ? 'Include in the next export' : 'Mark this region as kept first'
                      }
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
    </div>
  );
}

function Sidebar({
  sources,
  currentSourceId,
  missingPaths,
  settings,
  batchProgress,
  onSelectSource,
  onRemoveSource,
  onRelinkSource,
  onSettingsChange,
  onReanalyzeAll,
  onAddFiles,
  disabled,
}: {
  sources: MediaSource[];
  currentSourceId: string | null;
  missingPaths: Set<string>;
  settings: SilenceDetectionSettings;
  batchProgress: { index: number; total: number } | null;
  onSelectSource: (id: string) => void;
  onRemoveSource: (id: string) => void;
  onRelinkSource: (id: string) => void;
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
              const missing = missingPaths.has(s.id);
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
                    title={missing ? `Missing: ${s.path}` : s.path}
                  >
                    <span className={missing ? 'text-rose-300' : ''}>
                      {missing ? '⚠ ' : ''}
                      {s.name}
                    </span>
                  </button>
                  {missing && (
                    <button
                      className="ml-2 text-xs text-amber-300 hover:text-amber-200"
                      onClick={() => onRelinkSource(s.id)}
                    >
                      relink
                    </button>
                  )}
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
