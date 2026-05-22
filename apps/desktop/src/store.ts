import { create } from 'zustand';
import type { MediaSource, Region } from '@quietcut/core';

interface QuietcutState {
  source: MediaSource | null;
  regions: Region[];
  peaks: Float32Array | null;
  setSource: (source: MediaSource | null) => void;
  setRegions: (regions: Region[]) => void;
  setPeaks: (peaks: Float32Array | null) => void;
}

export const useStore = create<QuietcutState>((set) => ({
  source: null,
  regions: [],
  peaks: null,
  setSource: (source) => set({ source }),
  setRegions: (regions) => set({ regions }),
  setPeaks: (peaks) => set({ peaks }),
}));
