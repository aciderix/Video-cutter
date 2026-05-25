# SnipVox

> Ultra-fast, open-source silence remover for video and audio. Free forever.

SnipVox detects silences in your media files and lets you cut them out instantly,
or hand off the edit to your favorite NLE (DaVinci Resolve, Premiere Pro, Final
Cut Pro, Kdenlive, and more) via universal interchange formats.

## Status

✅ **All 7 phases shipped.** Desktop (Linux/macOS/Windows via Tauri) and
mobile (Android/iOS via Capacitor) builds run end-to-end:

- FFmpeg-based silence detection on desktop, Web Audio + RMS-VAD on mobile
- Symphonia (pure-Rust) waveform peak extraction on desktop, downsampled
  Web Audio peaks on mobile
- Interactive Canvas2D timeline with drag-to-resize boundaries
- Manual editing (split, merge, toggle) with undo/redo
- Direct MP4 export via FFmpeg `filter_complex` with live progress
- NLE export to FCPXML, OpenTimelineIO, EDL, and Resolve markers
- Multi-source projects with `.snipvox` JSON save/load
- EBU R128 loudness normalization presets (Streaming, Podcast, Broadcast)

## Why another video editor?

Existing tools either lock you into a subscription, force a cloud upload, work
on one platform, or stop at a single export format. SnipVox runs locally, ships
on every major platform, and exports to every NLE worth its salt.

|                           | SnipVox | Descript | Auphonic | AutoCut       |
| ------------------------- | -------- | -------- | -------- | ------------- |
| Local processing          | ✅       | ❌       | ❌       | ✅            |
| Free                      | ✅       | ❌       | ❌       | ❌            |
| Open source               | ✅       | ❌       | ❌       | ❌            |
| Cross-platform            | ✅       | partial  | web only | Premiere only |
| Mobile                    | ✅       | ❌       | ❌       | ❌            |
| NLE export (XML/OTIO/EDL) | ✅       | partial  | ❌       | ❌            |

## Architecture

```
apps/
  desktop/      Tauri 2 (Rust + React) — Windows, macOS, Linux
  mobile/       Capacitor 6 (React)    — iOS, Android
packages/
  core/         Pure-TS domain logic (regions, silence math, project file)
  exporters/    FCPXML, OTIO, EDL, Resolve markers, FFmpeg command builders
  timeline/     Waveform / region timeline (Canvas, WebGL later)
  ui/           Shared accessible UI components (Radix + Tailwind)
```

The heavy lifting is delegated to platform-native backends:

- **Desktop**: FFmpeg sidecar + Symphonia (Rust) for waveform extraction
- **Mobile**: FFmpegKit for the same operations

The TypeScript layer stays portable: every export format is generated in pure
TS and works identically on every platform.

## Roadmap

- **Phase 0 — Foundation** ✅ Mono-repo, Tauri/Capacitor scaffolds, CI
- **Phase 1 — Core audio** ✅ waveform + silence detection + interactive timeline
- **Phase 2 — Manual editing** ✅ drag/add/remove regions, undo/redo, shortcuts
- **Phase 3 — Direct export** ✅ FFmpeg filter_complex, live progress events
- **Phase 4 — NLE export** ✅ FCPXML, OTIO, EDL, Resolve markers
- **Phase 5 — Multi-file / projects** ✅ batch processing, save/load `.snipvox`
- **Phase 6 — Mobile** ✅ Web-Audio-based detection, share sheet, no native FFmpeg
- **Phase 7 — Advanced** ✅ RMS VAD with hysteresis, EBU R128 loudness presets

## Development

Requires Node ≥ 20, pnpm ≥ 9, Rust ≥ 1.77 (for desktop), and FFmpeg in PATH
(or the bundled sidecar once it lands in Phase 1).

```sh
pnpm install

# Desktop (Tauri)
pnpm desktop:dev

# Mobile (web preview)
pnpm mobile:dev

# Mobile (native)
pnpm --filter @snipvox/mobile cap:android
pnpm --filter @snipvox/mobile cap:ios

# Tests + typecheck
pnpm test
pnpm typecheck
```

## Contributing

SnipVox is MIT licensed and welcomes contributions. See
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines and
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for a deeper technical tour.

## License

MIT — see [`LICENSE`](./LICENSE).
