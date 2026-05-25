/**
 * Single source of truth for the human-facing app version. Update here when
 * you bump package.json / Cargo.toml / tauri.conf.json; CI's `version:check`
 * task verifies they all agree.
 */
export const SNIPVOX_VERSION = '0.8.0' as const;
