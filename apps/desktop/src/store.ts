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
    if (opts.history) {
      const prev = regionsBySource[currentSourceId] ?? [];
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
    const { past, regionsBySource, future } = get();
    const prev = past[past.length - 1];
    if (!prev) return;
    const currentRegions = regionsBySource[prev.sourceId] ?? [];
    set({
      regionsBySource: { ...regionsBySource, [prev.sourceId]: prev.regions },
      past: past.slice(0, -1),
      future: [{ sourceId: prev.sourceId, regions: currentRegions }, ...future],
      currentSourceId: prev.sourceId,
    });
  },

  redo: () => {
    const { future, regionsBySource, past } = get();
    const next = future[0];
    if (!next) return;
    const currentRegions = regionsBySource[next.sourceId] ?? [];
    set({
      regionsBySource: { ...regionsBySource, [next.sourceId]: next.regions },
      future: future.slice(1),
      past: [...past, { sourceId: next.sourceId, regions: currentRegions }],
      currentSourceId: next.sourceId,
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
