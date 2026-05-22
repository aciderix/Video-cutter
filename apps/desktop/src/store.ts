import { create } from 'zustand';
import type { MediaSource, Region } from '@quietcut/core';

interface QuietcutState {
  source: MediaSource | null;
  regions: Region[];
  setSource: (source: MediaSource | null) => void;
  setRegions: (regions: Region[]) => void;
}

export const useStore = create<QuietcutState>((set) => ({
  source: null,
  regions: [],
  setSource: (source) => set({ source }),
  setRegions: (regions) => set({ regions }),
}));
