import { useEffect } from 'react';

type Handler = (e: KeyboardEvent) => void;

export interface ShortcutMap {
  /** Toggle play/pause. */
  togglePlay?: Handler;
  /** Jump to next kept segment. */
  nextKept?: Handler;
  /** Jump to previous kept segment. */
  prevKept?: Handler;
  /** Toggle the kept flag of the region under the cursor. */
  toggleRegion?: Handler;
  /** Split the region at the playhead. */
  split?: Handler;
  /** Undo / redo. */
  undo?: Handler;
  redo?: Handler;
}

export function useShortcuts(map: ShortcutMap) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const ctrl = isMac ? e.metaKey : e.ctrlKey;

      if (e.code === 'Space') {
        e.preventDefault();
        map.togglePlay?.(e);
        return;
      }
      if (e.code === 'KeyL') {
        e.preventDefault();
        map.nextKept?.(e);
        return;
      }
      if (e.code === 'KeyJ') {
        e.preventDefault();
        map.prevKept?.(e);
        return;
      }
      if (e.code === 'KeyK') {
        e.preventDefault();
        map.split?.(e);
        return;
      }
      if (e.code === 'KeyD') {
        e.preventDefault();
        map.toggleRegion?.(e);
        return;
      }
      if (ctrl && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        map.undo?.(e);
        return;
      }
      if (ctrl && (e.code === 'KeyY' || (e.code === 'KeyZ' && e.shiftKey))) {
        e.preventDefault();
        map.redo?.(e);
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [map]);
}
