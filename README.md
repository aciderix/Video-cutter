# Quietcut

> Ultra-fast, open-source silence remover for video and audio. Free forever.

Quietcut detects silences in your media files and lets you cut them out instantly,
or hand off the edit to your favorite NLE (DaVinci Resolve, Premiere Pro, Final
Cut Pro, Kdenlive, and more) via universal interchange formats.

## Status

🚧 **Phase 1 — Core audio.** Silence detection (FFmpeg `silencedetect`),
waveform peak extraction (Symphonia, pure-Rust audio decoding), and the
interactive Canvas2D timeline are wired end-to-end on desktop. Mobile native
integration, manual editing, and exports land in upcoming phases.

## Why another video editor?

Existing tools either lock you into a subscription, force a cloud upload, work
on one platform, or stop at a single export format. Quietcut runs locally, ships
on every major platform, and exports to every NLE worth its salt.

|                           | Quietcut | Descript | Auphonic | AutoCut       |
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
- **Phase 2 — Manual editing** drag/add/remove regions, undo/redo, shortcuts
- **Phase 3 — Direct export** FFmpeg cut/concat, single or per-segment files
- **Phase 4 — NLE export** FCPXML, OTIO, EDL, Premiere XML, Resolve markers
- **Phase 5 — Multi-file / projects** batch processing, save/load
- **Phase 6 — Mobile polish** touch gestures, share extension, background tasks
- **Phase 7 — Advanced** VAD (Silero), loudness normalization, speed ramps,
  filler-word detection

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
pnpm --filter @quietcut/mobile cap:android
pnpm --filter @quietcut/mobile cap:ios

# Tests + typecheck
pnpm test
pnpm typecheck
```

## Contributing

Quietcut is MIT licensed and welcomes contributions. See
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for guidelines and
[`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for a deeper technical tour.

## License

MIT — see [`LICENSE`](./LICENSE).
