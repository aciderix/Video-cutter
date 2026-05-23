import { useEffect, useRef } from 'react';

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
  /** Toggle "preview cuts" (skip silences during playback). */
  togglePreview?: Handler;
}

/**
 * Subscribe once. The latest map is stashed in a ref so the event listener
 * never has to be removed/re-added (the previous version rebound at every
 * timeupdate tick ≈ 4 Hz).
 */
export function useShortcuts(map: ShortcutMap) {
  const mapRef = useRef(map);
  mapRef.current = map;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (shouldSkipShortcut(e.target)) return;
      const isMac = navigator.platform.toLowerCase().includes('mac');
      const ctrl = isMac ? e.metaKey : e.ctrlKey;
      const m = mapRef.current;

      if (e.code === 'Space') {
        e.preventDefault();
        m.togglePlay?.(e);
        return;
      }
      if (e.code === 'KeyL') {
        e.preventDefault();
        m.nextKept?.(e);
        return;
      }
      if (e.code === 'KeyJ') {
        e.preventDefault();
        m.prevKept?.(e);
        return;
      }
      if (e.code === 'KeyK') {
        e.preventDefault();
        m.split?.(e);
        return;
      }
      if (e.code === 'KeyD') {
        e.preventDefault();
        m.toggleRegion?.(e);
        return;
      }
      if (e.code === 'KeyP') {
        e.preventDefault();
        m.togglePreview?.(e);
        return;
      }
      if (ctrl && e.code === 'KeyZ' && !e.shiftKey) {
        e.preventDefault();
        m.undo?.(e);
        return;
      }
      if (ctrl && (e.code === 'KeyY' || (e.code === 'KeyZ' && e.shiftKey))) {
        e.preventDefault();
        m.redo?.(e);
        return;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
}

/**
 * Suppress global shortcuts when the user is interacting with a typing or
 * focusable widget. We check:
 *   - INPUT/TEXTAREA/SELECT — obvious typing surfaces
 *   - contentEditable — rich-text editors
 *   - role="slider" / role="spinbutton" / role="textbox" — Radix and
 *     headless-UI widgets often render as <span> + ARIA roles, so the
 *     tagName check alone misses them
 *   - role="combobox"/"listbox"/"menu" — open dropdowns
 */
function shouldSkipShortcut(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return true;
  if (target.isContentEditable) return true;
  const role = target.getAttribute('role');
  if (role) {
    if (['slider', 'spinbutton', 'textbox', 'combobox', 'listbox', 'menu'].includes(role)) {
      return true;
    }
  }
  return false;
}
