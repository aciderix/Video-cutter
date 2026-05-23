# Changelog

All notable changes to Quietcut are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] — Timeline zoom + pan + tap-to-select

### Added

- **Timeline zoom + pan** on desktop and mobile.
  - Pinch zoom on touch screens; Ctrl/Cmd + wheel on desktop. Zoom
    anchors on the cursor / pinch midpoint so you stay focused on
    what matters.
  - Drag the timeline body to pan when zoomed in (gesture survives
    moving off-canvas thanks to global pointer listeners).
  - Plain wheel = horizontal pan on desktop.
  - `+` / `−` keyboard shortcuts when the canvas has focus.
  - Mini-scrollbar overlay at the bottom shows where the viewport
    sits inside the full clip.
- **Tap-to-select-segment**. A single click on a kept region's body
  now seeks to it AND toggles its export selection. Existing checkbox
  workflow in the regions table still works — both stay in sync.
- **Transport bar** above the timeline (desktop + mobile).
  - Play/Pause button with a clear icon.
  - `MM:SS.mmm / MM:SS.mmm` digital clock that tracks the playhead.
  - Zoom −/+/Fit buttons on both platforms (Center button on desktop
    when zoomed, to snap the viewport around the playhead).
- Timeline now exports `clampViewport`, `MIN_ZOOM`, `MAX_ZOOM` for
  consumers that want to validate viewport math.

### Changed

- `onRegionClick` renamed to `onRegionKeptToggle` (double-tap) and
  joined by the new `onRegionExportToggle` (single-tap on a kept
  region body).
- Waveform peaks are now sliced to the visible viewport before
  downsampling — keeps redraw cost bounded as you zoom in.

## [0.3.0] — Preview cuts, export selection, multi-format

### Added

- **Preview cuts**: a checkbox in the source-view header (P shortcut on
  desktop) makes the player auto-seek past non-kept regions during
  playback. Lets you audition the edit without exporting first.
- **Export selection** (separate from "kept"): the regions table grew an
  emerald "Export" checkbox per row. Defaults to "all kept regions
  selected", overrideable per region. "Select all kept" / "Deselect
  all" buttons in the table header. The export panel reads the
  selection and shows N / total + selected duration.
- **Export per segment**: new button writes one file per selected region
  into a user-picked directory (e.g. podcast chapters). Reuses the
  existing per-segment FFmpeg builder.
- **Multi-format export**: 10 presets — MP4 (H.264, H.265), WebM/VP9,
  MOV/ProRes, MKV, MP3, AAC/M4A, Opus, WAV, FLAC. Format select sits
  next to the existing loudness control. Audio-only presets drop the
  video stream automatically.
- **Mobile redesign**: gradient background, sticky bottom action bar with
  safe-area padding, RegionsList with bigger 36 px chips for Kept and
  Export toggles, collapsible Detection panel, header version chip,
  bigger touch targets in the waveform timeline (44 px hit zone on
  coarse pointers).
- **Mobile preview cuts** + audio-only WAV export (no native FFmpeg
  required) wired up to the same selection.

### Changed

- WaveformTimeline boundary handle hit zone widens to 24 px on coarse
  pointers (touch) and stays at 8 px on desktop.
- ExportPanel layout reorganized for clarity: Format + Loudness on one
  row, the preset description tucked underneath.

## [0.2.0] — Audit fixes

### Fixed

- Boundary drag commits to the undo history even when the user releases the
  mouse outside the canvas, switches windows, or alt-tabs away. Pointer
  Events with global window listeners replaced the canvas-scoped `mouseup`
  handler.
- `Ctrl-Z` no longer jumps between sources. Undo/redo walk the history
  stacks for the currently selected source only.
- `setRegions` is a no-op when the array contents are unchanged — the undo
  stack no longer grows on every re-render.
- `detect_silences` returns an empty interval list for video sources with
  no audio track instead of bubbling up a raw FFmpeg failure.
- `filter_complex` exports past 50 segments automatically switch to the
  per-segment + concat-demuxer pipeline. The old path OOMed on very long
  podcasts.
- Drop-frame timecode (SMPTE 12M-1) for 29.97 and 59.94 fps in EDL and
  FCPXML. 23.976 fps uses NDF on a 24000-denominator rational grid.
- `extract_peaks` accepts the known source duration and bins samples
  uniformly across the whole clip. Long files no longer show a tall spike
  at the 10-minute mark.
- `extract_peaks` two-pass fallback (10 ms bucket pre-aggregation) for
  sources whose duration can't be probed up front.
- OTIO V1 / A1 tracks no longer share `media_reference` references.
- `toFileUri` percent-encodes path segments; spaces, unicode, and Windows
  drive paths produce valid `file://` URIs.
- `escapeXml` + `toFileUri` consolidated into `packages/exporters/types.ts`;
  the per-exporter copies that disagreed on encoding are gone.
- Mobile `URL.createObjectURL` is revoked on unmount.
- Batch analyze (open multiple files / re-analyze all) continues past a
  single-file failure and reports the failed files at the end.
- Project file `loadProject` checks every source path with the new
  `path_exists` command and surfaces missing files in the sidebar with a
  "relink" button that swaps the path while keeping the existing regions.
- Statusbar shortcut hint now includes `⌘⇧Z` redo and `←/→` scrub.

### Added

- Pointer-events-based drag with `setPointerCapture` so capture survives
  fast cursor moves.
- New `export_segmented` and `cancel_export` Tauri commands. The Cancel
  button in the export panel sends a flag that the running task polls on
  a 250 ms cadence.
- Optional `timeoutSeconds` on export requests.
- New `buildSegmentedExport` exporter that materializes the two-phase
  cut + concat plan.
- `WaveformTimeline` keyboard handler — `←/→` scrub by 0.5%, `Shift+←/→`
  by 5%, `Home`/`End` jump to start/end. Fulfils the existing `role="slider"`
  ARIA contract.
- Static + overlay canvas layers in `WaveformTimeline`. The playhead tick
  no longer repaints the entire waveform.
- `useShortcuts` ignores `contenteditable`, Radix `role="slider"` thumbs,
  and other typing-or-focusable widgets.
- `useShortcuts` subscribes to `keydown` once; the latest handler map is
  read from a ref so a state update doesn't rebind the listener.
- New `peaksLoadingFor: Set<string>` in the store so UIs can show a
  "loading peaks…" state.
- Mobile app actually uses `vadFromSamples` (RMS VAD with hysteresis)
  instead of the peak detector, matching the README.
- `dirty` flag in the store + "•" suffix on the project name in the
  header.
- `noUnusedLocals` and `noUnusedParameters` in `tsconfig.base`.
- `apps/mobile/src/webAudioExport.ts` — audio-only WAV export using
  Web Audio decode + a JS PCM encoder. Mobile no longer needs a native
  FFmpeg for "audio-only cut" jobs.
- Single-source-of-truth `QUIETCUT_VERSION` in `@quietcut/core`. UI reads
  it; CI checks the package.json / Cargo.toml / tauri.conf.json match.
- Drag-and-drop file open on desktop (HTML5 `ondragover`/`ondrop`).
- Confirmation dialogs (`New project` / `Remove source` when the project
  is dirty).
- Media metadata display in the source view (resolution, fps, codec,
  sample rate, bitrate).
- CI: `cargo test --locked` on Linux; `tauri build` matrix builds Linux /
  macOS / Windows release artifacts on every push.

### Changed

- AppError now serializes as `{ kind, message, details, code? }`. The TS
  bridge exposes `formatBridgeError` so callers don't have to ternary on
  `e instanceof Error`.
- All package versions and the Cargo manifest are pinned to `0.2.0` and
  read from a single shared constant.

## [0.1.0] — Phase 7 complete

Initial public-ish build. Seven phases delivered:

- Phase 0 — pnpm + Turbo monorepo with Tauri 2 desktop and Capacitor 6
  mobile scaffolds. CI smoke tests, MIT license, contributing guide.
- Phase 1 — Real FFmpeg `analyze_media` / `detect_silences` commands.
  Symphonia (pure-Rust) waveform peak extraction. Interactive Canvas2D
  timeline.
- Phase 2 — Manual editing: drag boundaries, split, merge, toggle keep,
  undo/redo, keyboard shortcuts, embedded video player.
- Phase 3 — Direct MP4 export via FFmpeg `filter_complex` with live
  progress events.
- Phase 4 — NLE export: FCPXML, OTIO, EDL, DaVinci Resolve markers.
- Phase 5 — Multi-source projects, batch analyze, `.quietcut` save/load.
- Phase 6 — Mobile app using Web Audio API for on-device silence
  detection (no native FFmpeg dependency). Share sheet integration.
- Phase 7 — RMS-based VAD with hysteresis, EBU R128 loudness presets
  (Streaming, Podcast, Broadcast).
