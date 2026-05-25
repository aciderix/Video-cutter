import { create } from 'zustand';
import type {
  CleanAudioOverlay,
  MediaSource,
  ProjectFile,
  Region,
  SilenceDetectionSettings,
} from '@snipvox/core';
import { DEFAULT_DETECTION, createEmptyProject } from '@snipvox/core';

interface RegionsSnapshot {
  sourceId: string;
  regions: Region[];
}

interface SnipVoxState {
  sources: MediaSource[];
  currentSourceId: string | null;
  regionsBySource: Record<string, Region[]>;
  peaksBySource: Record<string, Float32Array>;
  /** Set of source ids that currently have a peaks computation in flight. */
  peaksLoadingFor: Set<string>;
  detectionSettings: SilenceDetectionSettings;
  currentTime: number;
  past: RegionsSnapshot[];
  future: RegionsSnapshot[];
  projectPath: string | null;
  projectName: string;
  /** True when there are unsaved mutations since the last save/load. */
  dirty: boolean;
  /** Skip non-kept regions during playback. */
  skipSilences: boolean;
  /** Per-source: which kept region ids are checked for export. When a
   * source has no entry here, the default is "all kept regions selected". */
  exportSelectionBySource: Record<string, Set<string>>;
  /** Clean-audio overlays attached to each source id. Each overlay carries
   * its own segments mapping into the reference timeline. */
  overlaysBySource: Record<string, CleanAudioOverlay[]>;
  /** Set of overlay ids currently being aligned (used for spinner UI). */
  aligningOverlays: Set<string>;

  // Sources
  addSource: (source: MediaSource) => void;
  removeSource: (id: string) => void;
  selectSource: (id: string | null) => void;
  /** Replace one source while keeping its id (used when relinking a missing
   * file: the new MediaSource carries the new path/duration but inherits the
   * old id so regionsBySource lookups keep working). */
  relinkSource: (id: string, replacement: MediaSource) => void;

  // Regions / peaks
  setRegions: (regions: Region[], opts?: { history?: boolean }) => void;
  setRegionsFor: (sourceId: string, regions: Region[]) => void;
  /** Push an explicit snapshot onto the history stack. Used to commit
   * boundary drags whose intermediate moves were done with history:false. */
  pushHistorySnapshot: (sourceId: string, regions: Region[]) => void;
  setPeaks: (peaks: Float32Array | null) => void;
  setPeaksFor: (sourceId: string, peaks: Float32Array) => void;
  setPeaksLoading: (sourceId: string, loading: boolean) => void;

  // Misc
  setCurrentTime: (t: number) => void;
  setDetectionSettings: (s: SilenceDetectionSettings) => void;

  // History
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;

  // Clean audio overlays
  addOverlay: (sourceId: string, overlay: CleanAudioOverlay) => void;
  removeOverlay: (sourceId: string, overlayId: string) => void;
  updateOverlay: (sourceId: string, overlayId: string, patch: Partial<CleanAudioOverlay>) => void;
  setAligning: (overlayId: string, aligning: boolean) => void;

  // Preview / export selection
  setSkipSilences: (skip: boolean) => void;
  /** Toggle one region in the export selection. */
  toggleExportSelection: (sourceId: string, regionId: string) => void;
  /** Replace the selection wholesale (e.g. "select all kept"). */
  setExportSelection: (sourceId: string, ids: Set<string>) => void;
  /** Read the effective selection: explicit set if present, otherwise all
   * kept region ids. Lets callers stay agnostic of the default. */
  effectiveExportSelection: (sourceId: string) => Set<string>;

  // Project file
  setProjectPath: (path: string | null) => void;
  setProjectName: (name: string) => void;
  loadProject: (project: ProjectFile, path: string | null) => void;
  toProjectFile: () => ProjectFile;
  resetProject: () => void;
  markClean: () => void;
}

const HISTORY_LIMIT = 100;

export const useStore = create<SnipVoxState>((set, get) => ({
  sources: [],
  currentSourceId: null,
  regionsBySource: {},
  peaksBySource: {},
  peaksLoadingFor: new Set<string>(),
  detectionSettings: { ...DEFAULT_DETECTION },
  currentTime: 0,
  past: [],
  future: [],
  projectPath: null,
  projectName: 'Untitled',
  dirty: false,
  skipSilences: false,
  exportSelectionBySource: {},
  overlaysBySource: {},
  aligningOverlays: new Set<string>(),

  addSource: (source) => {
    const { sources } = get();
    if (sources.some((s) => s.id === source.id)) {
      set({ currentSourceId: source.id, currentTime: 0 });
      return;
    }
    set({
      sources: [...sources, source],
      currentSourceId: source.id,
      currentTime: 0,
      dirty: true,
    });
  },

  removeSource: (id) => {
    const { sources, regionsBySource, peaksBySource, currentSourceId, overlaysBySource } = get();
    const rest = sources.filter((s) => s.id !== id);
    const newRegions = { ...regionsBySource };
    delete newRegions[id];
    const newPeaks = { ...peaksBySource };
    delete newPeaks[id];
    const newOverlays = { ...overlaysBySource };
    delete newOverlays[id];
    set({
      sources: rest,
      regionsBySource: newRegions,
      peaksBySource: newPeaks,
      overlaysBySource: newOverlays,
      currentSourceId: currentSourceId === id ? (rest[0]?.id ?? null) : currentSourceId,
      dirty: true,
    });
  },

  selectSource: (id) => set({ currentSourceId: id, currentTime: 0 }),

  relinkSource: (id, replacement) => {
    const { sources } = get();
    const next = sources.map((s) => (s.id === id ? { ...replacement, id } : s));
    set({ sources: next });
  },

  setRegions: (regions, opts = { history: true }) => {
    const { currentSourceId, regionsBySource, past } = get();
    if (!currentSourceId) return;
    const prev = regionsBySource[currentSourceId] ?? [];
    if (prev === regions) return; // reference-equality short-circuit
    if (opts.history) {
      // Only snapshot if the regions actually changed by value.
      const changed = prev.length !== regions.length || prev.some((r, i) => r !== regions[i]);
      if (!changed) {
        set({ regionsBySource: { ...regionsBySource, [currentSourceId]: regions } });
        return;
      }
      const newPast = [...past, { sourceId: currentSourceId, regions: prev }].slice(-HISTORY_LIMIT);
      set({
        regionsBySource: { ...regionsBySource, [currentSourceId]: regions },
        past: newPast,
        future: [],
        dirty: true,
      });
    } else {
      set({
        regionsBySource: { ...regionsBySource, [currentSourceId]: regions },
        dirty: true,
      });
    }
  },

  setRegionsFor: (sourceId, regions) => {
    set({ regionsBySource: { ...get().regionsBySource, [sourceId]: regions } });
  },

  pushHistorySnapshot: (sourceId, regions) => {
    const { past, regionsBySource } = get();
    const current = regionsBySource[sourceId] ?? [];
    if (current === regions) return;
    const changed = current.length !== regions.length || current.some((r, i) => r !== regions[i]);
    if (!changed) return;
    const newPast = [...past, { sourceId, regions }].slice(-HISTORY_LIMIT);
    set({ past: newPast, future: [], dirty: true });
  },

  setPeaks: (peaks) => {
    const { currentSourceId, peaksBySource } = get();
    if (!currentSourceId) return;
    const copy = { ...peaksBySource };
    if (peaks) copy[currentSourceId] = peaks;
    else delete copy[currentSourceId];
    set({ peaksBySource: copy });
  },

  setPeaksFor: (sourceId, peaks) => {
    set({ peaksBySource: { ...get().peaksBySource, [sourceId]: peaks } });
  },

  setPeaksLoading: (sourceId, loading) => {
    const next = new Set(get().peaksLoadingFor);
    if (loading) next.add(sourceId);
    else next.delete(sourceId);
    set({ peaksLoadingFor: next });
  },

  setCurrentTime: (currentTime) => set({ currentTime }),
  setDetectionSettings: (detectionSettings) => set({ detectionSettings }),

  undo: () => {
    const { past, regionsBySource, future, currentSourceId } = get();
    if (!currentSourceId) return;
    // Walk back the most recent snapshot for the *current* source.
    let i = past.length - 1;
    while (i >= 0 && past[i]!.sourceId !== currentSourceId) i--;
    if (i < 0) return;
    const prev = past[i]!;
    const currentRegions = regionsBySource[currentSourceId] ?? [];
    const newPast = past.filter((_, j) => j !== i);
    set({
      regionsBySource: { ...regionsBySource, [currentSourceId]: prev.regions },
      past: newPast,
      future: [{ sourceId: currentSourceId, regions: currentRegions }, ...future],
    });
  },

  redo: () => {
    const { future, regionsBySource, past, currentSourceId } = get();
    if (!currentSourceId) return;
    const i = future.findIndex((snap) => snap.sourceId === currentSourceId);
    if (i < 0) return;
    const next = future[i]!;
    const currentRegions = regionsBySource[currentSourceId] ?? [];
    const newFuture = future.filter((_, j) => j !== i);
    set({
      regionsBySource: { ...regionsBySource, [currentSourceId]: next.regions },
      future: newFuture,
      past: [...past, { sourceId: currentSourceId, regions: currentRegions }],
    });
  },

  resetHistory: () => set({ past: [], future: [] }),

  addOverlay: (sourceId, overlay) => {
    const map = { ...get().overlaysBySource };
    const list = [...(map[sourceId] ?? [])];
    const existing = list.findIndex((o) => o.id === overlay.id);
    if (existing >= 0) list[existing] = overlay;
    else list.push(overlay);
    map[sourceId] = list;
    set({ overlaysBySource: map, dirty: true });
  },

  removeOverlay: (sourceId, overlayId) => {
    const map = { ...get().overlaysBySource };
    const list = (map[sourceId] ?? []).filter((o) => o.id !== overlayId);
    map[sourceId] = list;
    set({ overlaysBySource: map, dirty: true });
  },

  updateOverlay: (sourceId, overlayId, patch) => {
    const map = { ...get().overlaysBySource };
    const list = (map[sourceId] ?? []).map((o) => (o.id === overlayId ? { ...o, ...patch } : o));
    map[sourceId] = list;
    set({ overlaysBySource: map, dirty: true });
  },

  setAligning: (overlayId, aligning) => {
    const next = new Set(get().aligningOverlays);
    if (aligning) next.add(overlayId);
    else next.delete(overlayId);
    set({ aligningOverlays: next });
  },

  setSkipSilences: (skipSilences) => set({ skipSilences }),

  toggleExportSelection: (sourceId, regionId) => {
    const { exportSelectionBySource, regionsBySource } = get();
    const current = exportSelectionBySource[sourceId];
    let next: Set<string>;
    if (!current) {
      // Start from "all kept" so toggling means "deselect this one".
      const regions = regionsBySource[sourceId] ?? [];
      next = new Set(regions.filter((r) => r.kept).map((r) => r.id));
    } else {
      next = new Set(current);
    }
    if (next.has(regionId)) next.delete(regionId);
    else next.add(regionId);
    set({
      exportSelectionBySource: { ...exportSelectionBySource, [sourceId]: next },
    });
  },

  setExportSelection: (sourceId, ids) => {
    set({
      exportSelectionBySource: {
        ...get().exportSelectionBySource,
        [sourceId]: new Set(ids),
      },
    });
  },

  effectiveExportSelection: (sourceId) => {
    const { exportSelectionBySource, regionsBySource } = get();
    const explicit = exportSelectionBySource[sourceId];
    if (explicit) return explicit;
    const regions = regionsBySource[sourceId] ?? [];
    return new Set(regions.filter((r) => r.kept).map((r) => r.id));
  },

  setProjectPath: (projectPath) => set({ projectPath }),
  setProjectName: (projectName) => set({ projectName }),

  loadProject: (project, path) => {
    set({
      sources: project.sources,
      regionsBySource: project.regionsBySource,
      peaksBySource: {},
      currentSourceId: project.sources[0]?.id ?? null,
      detectionSettings: project.detectionSettings,
      currentTime: 0,
      past: [],
      future: [],
      projectPath: path,
      projectName: project.name,
      dirty: false,
      exportSelectionBySource: {},
      overlaysBySource: project.overlaysBySource ?? {},
      aligningOverlays: new Set<string>(),
    });
  },

  toProjectFile: () => {
    const { sources, regionsBySource, detectionSettings, projectName, overlaysBySource } = get();
    const base = createEmptyProject(projectName);
    return {
      ...base,
      updatedAt: new Date().toISOString(),
      sources,
      regionsBySource,
      detectionSettings,
      overlaysBySource,
    };
  },

  resetProject: () => {
    const empty = createEmptyProject();
    set({
      sources: empty.sources,
      currentSourceId: null,
      regionsBySource: empty.regionsBySource,
      peaksBySource: {},
      detectionSettings: empty.detectionSettings,
      currentTime: 0,
      past: [],
      future: [],
      projectPath: null,
      projectName: empty.name,
      dirty: false,
      exportSelectionBySource: {},
      overlaysBySource: {},
      aligningOverlays: new Set<string>(),
    });
  },

  markClean: () => set({ dirty: false }),
}));
