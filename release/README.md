# Quietcut — pre-release artifacts

> ⚠️ Built from `claude/loving-ptolemy-x0AY6` at Phase 1. Not signed, not
> notarized, not stable. For end-user binaries, prefer GitHub Releases once
> the project ships a v0.1.

## Layout

```
release/
├── web/
│   ├── desktop/   Vite-built bundle for the Tauri webview (preview-only)
│   └── mobile/    Vite-built bundle for Capacitor (preview-only)
└── desktop/
    └── linux-x64/
        ├── quietcut                       (9.4 MB) stripped, LTO release binary
        └── Quietcut_0.0.1_amd64.deb       (3.2 MB) Debian/Ubuntu package
```

The Linux `.AppImage` (75 MB) is intentionally **not** committed — it bundles
GTK, libsoup, glib, and webkit. Rebuild it with the command in
[Reproducing the build](#reproducing-the-build) below. Long-term, signed
release binaries will live on
[GitHub Releases](https://github.com/aciderix/Video-cutter/releases), not in
the repository.

## How to run

### Desktop — Linux

The `quietcut` binary expects `ffmpeg` and `ffprobe` to be on `$PATH`. On
Debian/Ubuntu:

```sh
sudo apt-get install -y ffmpeg
./release/desktop/linux-x64/quietcut
```

The `.AppImage` bundles the GUI dependencies but not FFmpeg — install it
separately. Same for the `.deb`.

### Web bundles

These are the static SPAs that get embedded in the Tauri webview and the
Capacitor WebView. They will not work standalone (every meaningful action
calls a native command via `window.__TAURI__` / `Capacitor.Plugins`), but
they're useful for inspecting the built CSS/JS and for CDN preview deploys.

## Reproducing the build

```sh
pnpm install
pnpm --filter @quietcut/desktop build      # web bundle
pnpm exec tauri build --no-bundle          # Linux binary only
pnpm exec tauri build                      # full bundles (.AppImage, .deb)
```

Build dependencies on Ubuntu:

```sh
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev libsoup-3.0-dev librsvg2-dev \
  libxdo-dev libssl-dev patchelf
```

## Other platforms

macOS (`.app`, `.dmg`) and Windows (`.msi`, `.exe`) builds happen in CI —
see `.github/workflows/ci.yml`. Run the matching `tauri build` invocation on
the target host to reproduce locally.
