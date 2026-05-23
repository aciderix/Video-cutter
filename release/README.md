# Quietcut — pre-release artifacts

> ⚠️ Built from `claude/loving-ptolemy-x0AY6` at v0.4.0 (timeline zoom + pan + tap-to-select on top of preview cuts +
> export selection + multi-format).
> Not signed, not notarized. For end-user binaries, prefer GitHub Releases
> once the project ships a tagged version.

## Layout

```
release/
├── web/
│   ├── desktop/                          Vite-built SPA used by Tauri (preview-only)
│   └── mobile/                           Vite-built SPA used by Capacitor (preview-only)
├── desktop/
│   └── linux-x64/
│       ├── quietcut                      9.5 MB stripped LTO binary
│       └── quietcut-0.4.0_amd64.deb      3.3 MB Debian/Ubuntu package
└── mobile/
    └── android/
        └── quietcut-0.4.0-debug.apk      3.9 MB Capacitor debug APK (unsigned)
```

The Linux `.AppImage` (75 MB, bundles GTK / libsoup / webkit) and a signed
release APK are intentionally **not** committed. Rebuild them with the
commands in [Reproducing the build](#reproducing-the-build) below.

## How to run

### Desktop — Linux

The `quietcut` binary expects `ffmpeg` and `ffprobe` to be on `$PATH`. On
Debian/Ubuntu:

```sh
sudo apt-get install -y ffmpeg libwebkit2gtk-4.1-0 libgtk-3-0
./release/desktop/linux-x64/quietcut
```

The `.deb` declares those dependencies, so `sudo apt install -y
./release/desktop/linux-x64/quietcut-0.1.0_amd64.deb` resolves everything in
one step. Once installed, launch from your application menu or `quietcut`
on the command line.

### Mobile — Android

The APK is a **debug** build — Android will refuse to install it without
"Install unknown apps" enabled for your file manager. Either:

```sh
adb install release/mobile/android/quietcut-0.1.0-debug.apk
```

or copy it onto the device, tap it, and accept the unknown-source warning.

For a Play Store release, generate a signed AAB with
`./gradlew bundleRelease` from `apps/mobile/android/`.

### Web bundles

Static SPAs embedded in the Tauri webview and the Capacitor WebView. They
won't work standalone (every meaningful action calls native APIs through
`window.__TAURI__` / `Capacitor.Plugins`), but they're useful for inspecting
the built CSS/JS or for a CDN preview deploy.

## Reproducing the build

```sh
pnpm install

# Desktop bundles (Linux .deb + .AppImage)
pnpm --filter @quietcut/desktop build
cd apps/desktop && pnpm exec tauri build               # full bundles

# Android APK
pnpm --filter @quietcut/mobile build
cd apps/mobile && pnpm exec cap sync android
cd android && ./gradlew assembleDebug                  # debug APK
# or
cd android && ./gradlew bundleRelease                  # signed AAB (needs keystore)
```

Build dependencies on Ubuntu:

```sh
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev libsoup-3.0-dev librsvg2-dev \
  libxdo-dev libssl-dev patchelf openjdk-21-jdk-headless
# + Android SDK platform-34, build-tools 34.0.0
```

## Other platforms

- **macOS** (`.app`, `.dmg`, `.pkg`): run `pnpm exec tauri build` on macOS.
- **Windows** (`.msi`, `.exe`): run `pnpm exec tauri build` on Windows
  with the MSVC toolchain.
- **iOS** (`.ipa`): run `pnpm exec cap sync ios && pnpm exec cap open ios`
  on macOS with Xcode.

CI (`.github/workflows/ci.yml`) covers all four targets and uploads
artifacts on every push.
