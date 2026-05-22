import { create } from 'zustand';
import type { MediaSource, Region } from '@quietcut/core';

interface RegionsSnapshot {
  regions: Region[];
}

interface QuietcutState {
  source: MediaSource | null;
  regions: Region[];
  peaks: Float32Array | null;
  currentTime: number;
  past: RegionsSnapshot[];
  future: RegionsSnapshot[];

  setSource: (source: MediaSource | null) => void;
  setRegions: (regions: Region[], opts?: { history?: boolean }) => void;
  setPeaks: (peaks: Float32Array | null) => void;
  setCurrentTime: (t: number) => void;
  undo: () => void;
  redo: () => void;
  resetHistory: () => void;
}

const HISTORY_LIMIT = 100;

export const useStore = create<QuietcutState>((set, get) => ({
  source: null,
  regions: [],
  peaks: null,
  currentTime: 0,
  past: [],
  future: [],

  setSource: (source) => set({ source }),

  setRegions: (regions, opts = { history: true }) => {
    if (opts.history) {
      const past = [...get().past, { regions: get().regions }].slice(-HISTORY_LIMIT);
      set({ regions, past, future: [] });
    } else {
      set({ regions });
    }
  },

  setPeaks: (peaks) => set({ peaks }),
  setCurrentTime: (currentTime) => set({ currentTime }),

  undo: () => {
    const { past, regions } = get();
    const prev = past[past.length - 1];
    if (!prev) return;
    set({
      regions: prev.regions,
      past: past.slice(0, -1),
      future: [{ regions }, ...get().future],
    });
  },

  redo: () => {
    const { future, regions } = get();
    const next = future[0];
    if (!next) return;
    set({
      regions: next.regions,
      future: future.slice(1),
      past: [...get().past, { regions }],
    });
  },

  resetHistory: () => set({ past: [], future: [] }),
}));
