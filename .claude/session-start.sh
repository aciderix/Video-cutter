#!/usr/bin/env bash
# Session bootstrap for Claude Code on the web.
# Installs Node deps (pnpm) and warms the workspace so that typecheck/test/build
# commands are ready to run immediately.

set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  echo "[session-start] Installing pnpm..."
  npm install -g pnpm@9 >/dev/null 2>&1 || echo "[session-start] WARN: pnpm install failed"
fi

if [ -f package.json ]; then
  echo "[session-start] Installing workspace dependencies..."
  pnpm install --prefer-offline --silent 2>&1 | tail -5 || echo "[session-start] WARN: pnpm install failed"
fi

echo "[session-start] Ready."
