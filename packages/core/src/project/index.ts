import type { ProjectFile } from '../types.ts';
import { DEFAULT_DETECTION } from '../types.ts';

export const PROJECT_FILE_EXTENSION = '.snipvox';
export const PROJECT_FILE_VERSION = 2 as const;

export function createEmptyProject(name = 'Untitled'): ProjectFile {
  const now = new Date().toISOString();
  return {
    version: PROJECT_FILE_VERSION,
    name,
    createdAt: now,
    updatedAt: now,
    sources: [],
    regionsBySource: {},
    detectionSettings: { ...DEFAULT_DETECTION },
    overlaysBySource: {},
  };
}

export function serializeProject(project: ProjectFile): string {
  const upgraded: ProjectFile = {
    ...project,
    version: PROJECT_FILE_VERSION,
    overlaysBySource: project.overlaysBySource ?? {},
    updatedAt: new Date().toISOString(),
  };
  return JSON.stringify(upgraded, null, 2);
}

/**
 * Parse a `.snipvox` JSON file and forward-migrate old versions. v1
 * project files have no overlays — we synthesize the empty map so the
 * rest of the app can stay version-agnostic.
 */
export function parseProject(raw: string): ProjectFile {
  const parsed = JSON.parse(raw) as ProjectFile;
  if (parsed.version === 1) {
    return {
      ...parsed,
      version: PROJECT_FILE_VERSION,
      overlaysBySource: {},
    };
  }
  if (parsed.version === 2) {
    return {
      ...parsed,
      overlaysBySource: parsed.overlaysBySource ?? {},
    };
  }
  throw new Error(`Unsupported project version ${parsed.version}.`);
}
