import { create } from 'zustand';
import type { MediaSource, ProjectFile, Region, SilenceDetectionSettings } from '@quietcut/core';
import { DEFAULT_DETECTION } from '@quietcut/core';

interface RegionsSnapshot {
  sourceId: string;
  regions: Region[];
}

interface QuietcutState {
  sources: MediaSource[];
  currentSourceId: string | null;
  regionsBySource: Record<string, Region[]>;
  peaksBySource: Record<string, Float32Array>;
  detectionSettings: SilenceDetectionSettings;
  currentTime: number;
  past: RegionsSnapshot[];
  future: RegionsSnapshot[];
  projectPath: string | null;
  projectName: string;

  // Derived selectors
  source: () => MediaSource | null;
  regions: () => Region[];
  peaks: () => Float32Array | null;

  // Sources
  addSource: (source: MediaSource) => void;
  removeSource: (id: string) => void;
  selectSource: (id: string | null) => void;

  // Regions / peaks
  setRegions: (regions: Region[], opts?: { history?: boolean }) => void;
  setRegionsFor: (sourceId: string, regions: Region[]) => void;
  /** Push an explicit snapshot onto the history stack. Used to commit
   * boundary drags whose intermediate moves were done with history:false. */
  pushHistorySnapshot: (sourceId: string, regions: Region[]) => void;
  setPeaks: (peaks: Float32Array | null) => void;
  setPeaksFor: (sourceId: string, peaks: Float32Array) => void;

  // Misc
  setCurrentTime: (t: number) => void;
  setDetectionSettings: (s: SilenceDetectionSettings) => void;

  // History
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;

  // Project file
  setProjectPath: (path: string | null) => void;
  setProjectName: (name: string) => void;
  loadProject: (project: ProjectFile, path: string | null) => void;
  toProjectFile: () => ProjectFile;
  resetProject: () => void;
}

const HISTORY_LIMIT = 100;

export const useStore = create<QuietcutState>((set, get) => ({
  sources: [],
  currentSourceId: null,
  regionsBySource: {},
  peaksBySource: {},
  detectionSettings: { ...DEFAULT_DETECTION },
  currentTime: 0,
  past: [],
  future: [],
  projectPath: null,
  projectName: 'Untitled',

  source: () => {
    const { sources, currentSourceId } = get();
    return sources.find((s) => s.id === currentSourceId) ?? null;
  },
  regions: () => {
    const { regionsBySource, currentSourceId } = get();
    return currentSourceId ? (regionsBySource[currentSourceId] ?? []) : [];
  },
  peaks: () => {
    const { peaksBySource, currentSourceId } = get();
    return currentSourceId ? (peaksBySource[currentSourceId] ?? null) : null;
  },

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
    });
  },

  removeSource: (id) => {
    const { sources, regionsBySource, peaksBySource, currentSourceId } = get();
    const rest = sources.filter((s) => s.id !== id);
    const newRegions = { ...regionsBySource };
    delete newRegions[id];
    const newPeaks = { ...peaksBySource };
    delete newPeaks[id];
    set({
      sources: rest,
      regionsBySource: newRegions,
      peaksBySource: newPeaks,
      currentSourceId: currentSourceId === id ? (rest[0]?.id ?? null) : currentSourceId,
    });
  },

  selectSource: (id) => set({ currentSourceId: id, currentTime: 0 }),

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
      });
    } else {
      set({ regionsBySource: { ...regionsBySource, [currentSourceId]: regions } });
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
    set({ past: newPast, future: [] });
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
    });
  },

  toProjectFile: () => {
    const { sources, regionsBySource, detectionSettings, projectName } = get();
    const now = new Date().toISOString();
    return {
      version: 1,
      name: projectName,
      createdAt: now,
      updatedAt: now,
      sources,
      regionsBySource,
      detectionSettings,
    };
  },

  resetProject: () => {
    set({
      sources: [],
      currentSourceId: null,
      regionsBySource: {},
      peaksBySource: {},
      detectionSettings: { ...DEFAULT_DETECTION },
      currentTime: 0,
      past: [],
      future: [],
      projectPath: null,
      projectName: 'Untitled',
    });
  },
}));
