# Architecture

## High-level

Quietcut is a TypeScript-first cross-platform application. A single React
codebase drives two native shells:

- **Desktop** — Tauri 2. Rust handles the heavy lifting (FFmpeg invocation,
  waveform decoding via Symphonia, multi-threaded processing) and exposes
  typed commands over Tauri's IPC.
- **Mobile** — Capacitor 6. JavaScript talks to native plugins
  (`@capacitor/filesystem`, FFmpegKit) for the same operations.

Everything portable lives in `packages/`:

- `@quietcut/core` — domain types, silence math, project file format.
- `@quietcut/exporters` — pure-TS generators for EDL, FCPXML, OTIO, Resolve
  markers and FFmpeg command planners.
- `@quietcut/timeline` — Canvas/WebGL waveform component.
- `@quietcut/ui` — accessible Radix-based primitives shared by both apps.

## Data model

A project is a list of `MediaSource`s, each with an array of `Region`s.
Regions tile the source duration without overlap. `kept = false` means the
region is silenced and will not appear in the export.

```
0s ─────────── 2s ─── 3s ─── 6s ──── 7s ─── 10s
[ kept ........ ][ cut ][ kept ][ cut ][ kept ]
```

This single representation drives both direct export (FFmpeg concat of kept
regions) and NLE export (every kept region becomes a clip on the timeline).

## Silence detection pipeline

```
file ─┬─► ffprobe (analyze_media)      ──► MediaSource
      │
      └─► ffmpeg -af silencedetect      ──► stderr text
              │
              ▼
         parseSilenceDetect             ──► RawSilenceInterval[]
              │
              ▼
         buildRegionsFromSilences       ──► Region[]
```

The TypeScript layer never sees raw audio samples for detection — that work
stays in FFmpeg, which is heavily SIMD-optimized. The Rust layer is only
involved when we extract peaks for the waveform display.

## Why Tauri over Electron

- **Size**: ~10 MB installer vs 150+ MB
- **Memory**: native WebView, no bundled Chromium
- **Speed**: Rust for processing, near-zero IPC overhead
- **Security**: explicit capability model rather than "anything goes"

## Why Capacitor over React Native

- **Reuse**: identical UI code with the desktop app — no Yoga vs flexbox
  differences, no parallel component library to maintain.
- **Web preview**: the mobile UI runs in a browser for fast iteration.
- **Plugin parity**: most native features we need (filesystem, share,
  FFmpegKit) have first-class Capacitor plugins.

## Export strategies

| Mode        | Codec       | Speed              | Use case                              |
| ----------- | ----------- | ------------------ | ------------------------------------- |
| Stream copy | original    | seconds            | Fastest; only when source is mp4-safe |
| Re-encode   | H.264 + AAC | minutes            | Mixed sources, format conversion      |
| Per-segment | either      | seconds-to-minutes | Batch / podcast chapters              |
| NLE export  | —           | instant            | Hand off to Resolve/Premiere/FCP      |
