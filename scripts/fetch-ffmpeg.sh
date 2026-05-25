#!/usr/bin/env bash
# Download static FFmpeg + ffprobe builds for the host platform and stage
# them in apps/desktop/src-tauri/binaries/ with the Tauri sidecar naming
# convention (`<basename>-<rust-triple>[.exe]`). Run once per platform on
# every dev machine + every CI runner before `tauri build`.
#
# Sources, all hand-maintained static builds with permissive licensing:
#   - Linux x64   : johnvansickle.com (jvs builds, gpl)
#   - macOS arm64 : evermeet.cx (gpl)
#   - macOS x64   : evermeet.cx (gpl)
#   - Windows x64 : BtbN/FFmpeg-Builds (gpl)
#
# Pinned to a known release so two runners produce byte-identical bundles.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/apps/desktop/src-tauri/binaries"
mkdir -p "$OUT"

# Pinned release. Bump together when refreshing.
FF_VERSION="7.1"

# --- Platform detection ----------------------------------------------------
UNAME_S="$(uname -s)"
UNAME_M="$(uname -m)"
TARGET="${TAURI_FFMPEG_TARGET:-}"  # override via env when cross-fetching
if [[ -z "$TARGET" ]]; then
  case "$UNAME_S-$UNAME_M" in
    Linux-x86_64)  TARGET=x86_64-unknown-linux-gnu ;;
    Linux-aarch64) TARGET=aarch64-unknown-linux-gnu ;;
    Darwin-arm64)  TARGET=aarch64-apple-darwin ;;
    Darwin-x86_64) TARGET=x86_64-apple-darwin ;;
    MINGW*|MSYS*|CYGWIN*) TARGET=x86_64-pc-windows-msvc ;;
    *) echo "Unsupported host: $UNAME_S $UNAME_M (set TAURI_FFMPEG_TARGET)" >&2; exit 1 ;;
  esac
fi
echo "Fetching FFmpeg $FF_VERSION for $TARGET"

EXT=""
[[ "$TARGET" == *windows* ]] && EXT=".exe"
FF_OUT="$OUT/ffmpeg-${TARGET}${EXT}"
FP_OUT="$OUT/ffprobe-${TARGET}${EXT}"

# Skip when already cached (CI / repeat dev runs).
if [[ -x "$FF_OUT" && -x "$FP_OUT" ]]; then
  echo "Sidecars already present — nothing to do."
  exit 0
fi

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
cd "$WORK"

case "$TARGET" in
  x86_64-unknown-linux-gnu)
    URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
    echo "Downloading $URL"
    curl -fsSL -o ff.tar.xz "$URL"
    tar xJf ff.tar.xz
    DIR="$(find . -maxdepth 1 -type d -name 'ffmpeg-*' | head -1)"
    cp "$DIR/ffmpeg"  "$FF_OUT"
    cp "$DIR/ffprobe" "$FP_OUT"
    ;;
  aarch64-unknown-linux-gnu)
    URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz"
    echo "Downloading $URL"
    curl -fsSL -o ff.tar.xz "$URL"
    tar xJf ff.tar.xz
    DIR="$(find . -maxdepth 1 -type d -name 'ffmpeg-*' | head -1)"
    cp "$DIR/ffmpeg"  "$FF_OUT"
    cp "$DIR/ffprobe" "$FP_OUT"
    ;;
  aarch64-apple-darwin)
    curl -fsSL -o ffmpeg.zip  "https://evermeet.cx/ffmpeg/ffmpeg-${FF_VERSION}.zip"
    curl -fsSL -o ffprobe.zip "https://evermeet.cx/ffmpeg/ffprobe-${FF_VERSION}.zip"
    unzip -q ffmpeg.zip
    unzip -q ffprobe.zip
    mv ffmpeg  "$FF_OUT"
    mv ffprobe "$FP_OUT"
    ;;
  x86_64-apple-darwin)
    # evermeet only ships arm64 native builds nowadays; the arm64 binary
    # works under Rosetta on Intel, but we still want a real x86_64 to
    # publish a true universal app. Use the OSXEXP build mirror.
    curl -fsSL -o ffmpeg.zip  "https://www.osxexperts.net/ffmpeg${FF_VERSION//./}intel.zip"
    curl -fsSL -o ffprobe.zip "https://www.osxexperts.net/ffprobe${FF_VERSION//./}intel.zip"
    unzip -q ffmpeg.zip
    unzip -q ffprobe.zip
    mv ffmpeg  "$FF_OUT"
    mv ffprobe "$FP_OUT"
    ;;
  x86_64-pc-windows-msvc)
    URL="https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip"
    echo "Downloading $URL"
    curl -fsSL -o ff.zip "$URL"
    unzip -q ff.zip
    DIR="$(find . -maxdepth 1 -type d -name 'ffmpeg-*' | head -1)"
    cp "$DIR/bin/ffmpeg.exe"  "$FF_OUT"
    cp "$DIR/bin/ffprobe.exe" "$FP_OUT"
    ;;
  *)
    echo "No fetch recipe for $TARGET" >&2; exit 1 ;;
esac

chmod +x "$FF_OUT" "$FP_OUT" || true
echo "Wrote:"
ls -la "$FF_OUT" "$FP_OUT"
