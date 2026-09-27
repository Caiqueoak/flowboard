import type { Project } from '../projects/project';
import { TASK_STATUSES, type Task } from '../tasks/task';

const STORAGE_KEY = 'flowboard.workspace.v1';
export const APP_DATA_VERSION = 1;

export type AppData = {
  version: typeof APP_DATA_VERSION;
  projects: Project[];
  tasks: Task[];
};

export type WorkspaceLoadResult =
  | { status: 'missing' }
  | { status: 'loaded'; data: AppData }
  | { status: 'malformed' }
  | { status: 'unavailable' };

export type WorkspaceSaveResult = { ok: true } | { ok: false };

export function loadWorkspace(): WorkspaceLoadResult {
  let serializedData: string | null;

  try {
    serializedData = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return { status: 'unavailable' };
  }

  if (serializedData === null) return { status: 'missing' };

  try {
    const data: unknown = JSON.parse(serializedData);
    if (!isAppData(data)) return { status: 'malformed' };
    return { status: 'loaded', data };
  } catch {
    return { status: 'malformed' };
  }
}

export function saveWorkspace(data: AppData): WorkspaceSaveResult {
  if (!isAppData(data)) return { ok: false };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export function resetWorkspace(): WorkspaceSaveResult {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

function isAppData(value: unknown): value is AppData {
  if (!isRecord(value) || value.version !== APP_DATA_VERSION) return false;
  if (!Array.isArray(value.projects) || !Array.isArray(value.tasks)) return false;

  const projectIds = new Set<string>();
  for (const project of value.projects) {
    if (!isProject(project) || projectIds.has(project.id)) return false;
    projectIds.add(project.id);
  }

  const taskIds = new Set<string>();
  for (const task of value.tasks) {
    if (!isTask(task) || taskIds.has(task.id) || !projectIds.has(task.projectId)) {
      return false;
    }
    taskIds.add(task.id);
  }

  return true;
}

function isProject(value: unknown): value is Project {
  return (
    isRecord(value) &&
    isNonBlankString(value.id) &&
    isTrimmedNonBlankString(value.name) &&
    isOptionalTrimmedText(value.description)
  );
}

function isTask(value: unknown): value is Task {
  return (
    isRecord(value) &&
    isNonBlankString(value.id) &&
    isNonBlankString(value.projectId) &&
    isTrimmedNonBlankString(value.title) &&
    TASK_STATUSES.some((status) => status.value === value.status) &&
    isOptionalTrimmedText(value.description)
  );
}

function isNonBlankString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isTrimmedNonBlankString(value: unknown): value is string {
  return isNonBlankString(value) && value === value.trim();
}

function isOptionalTrimmedText(value: unknown): value is string | undefined {
  return value === undefined || (typeof value === 'string' && value === value.trim());
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
