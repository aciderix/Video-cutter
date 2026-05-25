# SnipVox branding assets

Drop the master images here, then run `pnpm branding:sync` (defined in
`apps/mobile/package.json` and `apps/desktop/package.json`) to regenerate
every platform-specific size.

Expected files (override the placeholders shipped in this folder):

- `snipvox-icon.png` — square master, ideally **1024 × 1024**, transparent
  background. Used to generate Android mipmaps, iOS AppIcon set, Tauri icon
  set, and the web favicon.
- `snipvox-wordmark.png` — landscape "SnipVox" wordmark with transparent
  background. Shown in the empty-state on both apps and on the web bundle's
  index.html.

Until you replace them, the SVG placeholders next to this README are loaded
at build time so the app still renders something coherent.
