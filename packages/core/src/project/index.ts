import type { ProjectFile } from '../types.ts';
import { DEFAULT_DETECTION } from '../types.ts';

export const PROJECT_FILE_EXTENSION = '.quietcut';
export const PROJECT_FILE_VERSION = 1 as const;

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
  };
}

export function serializeProject(project: ProjectFile): string {
  return JSON.stringify({ ...project, updatedAt: new Date().toISOString() }, null, 2);
}

export function parseProject(raw: string): ProjectFile {
  const parsed = JSON.parse(raw) as ProjectFile;
  if (parsed.version !== PROJECT_FILE_VERSION) {
    throw new Error(
      `Unsupported project version ${parsed.version}. Expected ${PROJECT_FILE_VERSION}.`,
    );
  }
  return parsed;
}
