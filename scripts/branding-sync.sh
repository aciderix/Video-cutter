#!/usr/bin/env bash
# Re-derive every platform-specific icon + wordmark variant from the
# master files in /branding. Drop the originals there (or replace the
# SVG placeholders) and run this script.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BRAND="$ROOT/branding"

# Prefer PNG over SVG when both are present.
if [[ -f "$BRAND/snipvox-icon.png" ]]; then
  ICON_SOURCE="$BRAND/snipvox-icon.png"
elif [[ -f "$BRAND/snipvox-icon.svg" ]]; then
  command -v rsvg-convert >/dev/null || { echo "rsvg-convert needed for SVG masters"; exit 1; }
  rsvg-convert -w 1024 -h 1024 "$BRAND/snipvox-icon.svg" -o "$BRAND/snipvox-icon-1024.png"
  ICON_SOURCE="$BRAND/snipvox-icon-1024.png"
else
  echo "No master icon at $BRAND/snipvox-icon.{png,svg}"; exit 1
fi
echo "Using master icon: $ICON_SOURCE"

if [[ -f "$BRAND/snipvox-wordmark.png" ]]; then
  WORDMARK_SOURCE="$BRAND/snipvox-wordmark.png"
  WORDMARK_EXT=png
elif [[ -f "$BRAND/snipvox-wordmark.svg" ]]; then
  WORDMARK_SOURCE="$BRAND/snipvox-wordmark.svg"
  WORDMARK_EXT=svg
else
  echo "No master wordmark at $BRAND/snipvox-wordmark.{png,svg}"; exit 1
fi

# 1) Tauri (desktop) — generates icons/ + Tauri's own Android mipmaps.
cd "$ROOT/apps/desktop"
pnpm exec tauri icon "$ICON_SOURCE"

# 2) Capacitor (mobile) — copy from Tauri's Android output.
for d in hdpi mdpi xhdpi xxhdpi xxxhdpi; do
  cp "$ROOT/apps/desktop/src-tauri/icons/android/mipmap-$d/ic_launcher.png" \
     "$ROOT/apps/mobile/android/app/src/main/res/mipmap-$d/ic_launcher.png"
  cp "$ROOT/apps/desktop/src-tauri/icons/android/mipmap-$d/ic_launcher_round.png" \
     "$ROOT/apps/mobile/android/app/src/main/res/mipmap-$d/ic_launcher_round.png"
  cp "$ROOT/apps/desktop/src-tauri/icons/android/mipmap-$d/ic_launcher_foreground.png" \
     "$ROOT/apps/mobile/android/app/src/main/res/mipmap-$d/ic_launcher_foreground.png"
done

# 3) Web bundles (Vite public/) — favicon + wordmark.
cp "$ICON_SOURCE" "$ROOT/apps/mobile/public/snipvox-icon.png"
cp "$ICON_SOURCE" "$ROOT/apps/desktop/public/snipvox-icon.png"
cp "$WORDMARK_SOURCE" "$ROOT/apps/mobile/public/snipvox-wordmark.$WORDMARK_EXT"
cp "$WORDMARK_SOURCE" "$ROOT/apps/desktop/public/snipvox-wordmark.$WORDMARK_EXT"

# Also keep the SVG fallbacks in place so the <img src="/snipvox-wordmark.svg">
# in the empty state keeps resolving when only a PNG was provided.
[[ -f "$BRAND/snipvox-icon.svg" ]] && cp "$BRAND/snipvox-icon.svg" "$ROOT/apps/mobile/public/" && cp "$BRAND/snipvox-icon.svg" "$ROOT/apps/desktop/public/"
[[ -f "$BRAND/snipvox-wordmark.svg" ]] && cp "$BRAND/snipvox-wordmark.svg" "$ROOT/apps/mobile/public/" && cp "$BRAND/snipvox-wordmark.svg" "$ROOT/apps/desktop/public/"

echo "Branding refreshed."
