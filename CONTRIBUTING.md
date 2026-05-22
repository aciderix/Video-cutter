# Contributing to Quietcut

Thanks for considering a contribution! Quietcut is a community-driven, MIT-licensed
project.

## Ground rules

- Be respectful. We follow the [Contributor Covenant](./CODE_OF_CONDUCT.md).
- Open an issue before large changes so we can align on direction.
- Keep PRs focused. One concern per PR, with tests when it touches `packages/core`
  or `packages/exporters`.

## Local setup

```sh
git clone https://github.com/aciderix/video-cutter.git
cd video-cutter
pnpm install
pnpm typecheck
pnpm test
```

For the desktop app you'll also need:

- Rust ≥ 1.77 (`rustup toolchain install stable`)
- Tauri prerequisites: https://v2.tauri.app/start/prerequisites/
- FFmpeg in PATH (until the bundled sidecar lands)

## Commit style

Conventional Commits, please:

```
feat(core): support negative-duration regions
fix(exporters): escape ampersands in FCPXML clip names
docs(readme): clarify cross-platform support matrix
```

## Tests

- `packages/core` and `packages/exporters` must keep 100% of their public API
  under test (`pnpm --filter @quietcut/core test`).
- UI changes get a Playwright smoke test if user-visible.

## Code style

Prettier + ESLint run in CI. `pnpm format` before pushing.

## Accessibility

Every UI change must keep keyboard navigation working and AA contrast. Test
with screen readers when you alter timeline or playback controls.
