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
done

# 2b) Adaptive-icon foreground (Android 8+). Tauri pastes the icon at full
# bleed, but the launcher crops the outer ~22% so the gradient circle
# overflows the safe zone and the install dialog shows a white square
# behind it. Re-render each density with the icon scaled to 66% of the
# canvas (inside the safe zone) on a transparent background, then point
# the background colour at the app's dark theme so the composite reads
# as "gradient logo on dark backdrop" instead of "logo on white square".
python3 - <<PY
from PIL import Image
from pathlib import Path
ROOT = Path("$ROOT")
src = Image.open("$ICON_SOURCE").convert('RGBA')
content = src.crop(src.getbbox())
densities = {'mdpi': 108, 'hdpi': 162, 'xhdpi': 216, 'xxhdpi': 324, 'xxxhdpi': 432}
SAFE = 0.66
for d, sz in densities.items():
    safe = int(sz * SAFE)
    scale = min(safe / content.width, safe / content.height)
    cw, ch = int(content.width * scale), int(content.height * scale)
    resized = content.resize((cw, ch), Image.LANCZOS)
    canvas = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
    canvas.paste(resized, ((sz - cw) // 2, (sz - ch) // 2), resized)
    for app_root in [ROOT / 'apps' / 'mobile' / 'android', ROOT / 'apps' / 'desktop' / 'src-tauri' / 'gen' / 'android']:
        out = app_root / 'app' / 'src' / 'main' / 'res' / f'mipmap-{d}' / 'ic_launcher_foreground.png'
        if out.parent.is_dir():
            canvas.save(out, 'PNG')
PY

cat > "$ROOT/apps/mobile/android/app/src/main/res/values/ic_launcher_background.xml" <<XML
<?xml version='1.0' encoding='utf-8'?>
<resources>
    <color name="ic_launcher_background">#0F1117</color>
</resources>
XML

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
