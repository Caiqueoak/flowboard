---
schema_version: 1
work_item: W004
title: Local persistence and recovery
outcome: Projects and tasks survive reloads, and storage failures or malformed
  data produce recoverable feedback without silent data loss.
kind: feature
priority: 4
depends_on:
  - W003
blockers: []
maturity: ready
approval:
  at: 2026-09-27T23:34:57.325Z
  revision: cd0848316aad44245927b4fbd031793b24dab720f5bbee7390f9fb48e8575ef1
---

# Work Item Specification

## Outcome

Projects and tasks survive reloads, and storage failures or malformed data produce recoverable feedback without silent data loss.

## Problem

Project and task state currently exists only in React memory. Reloading loses the workspace, and users need clear behavior when browser storage is unavailable or contains data this app cannot safely read.

## Scope

- Define one versioned app-data document containing project and task arrays in `src/storage/`.
- Add typed storage-boundary operations to load, validate, save, and explicitly reset the document using `window.localStorage`.
- Validate stored JSON structure, record fields, unique IDs, known task statuses, and task-to-project references before exposing data to the app.
- Load valid data into the app shell on startup and select the first project when one is available.
- Save app state changes after project or task changes while keeping the in-memory state visible if a save fails.
- Show a clear status message when storage is unavailable or a save fails.
- Preserve malformed or unsupported data without overwriting it; show a recovery message and require explicit confirmation before resetting it.
- Keep all browser storage access inside `src/storage/`; UI features continue to use typed project and task data only.

## Non-goals

- Cloud backup, synchronization, export/import, accounts, or cross-browser recovery.
- Migrating legacy unversioned data; no prior app data format exists.
- Automatic repair or partial recovery of malformed records.
- Adding a backend, database, or storage library.

## Requirements

1. A project and its tasks remain available after reloading the same browser profile.
2. Projects and tasks are saved together as one versioned document so reads and writes stay coherent.
3. Missing stored data loads as an empty workspace.
4. Stored data is parsed and fully validated before it is used; unknown versions, malformed JSON, invalid records, duplicate IDs, unknown statuses, or dangling project references are treated as unreadable data.
5. Unreadable data is not overwritten or removed automatically, and the app explains that it was left untouched.
6. Resetting unreadable data requires a clear confirmation and only resets the Flowboard storage key.
7. If storage reads or writes fail, the app remains usable in memory where possible and clearly says the current changes may not survive reload.
8. A failed save does not roll back or discard the current in-memory project or task state.
9. Only `src/storage/` accesses `window.localStorage`; feature components never call browser storage APIs directly.

## Acceptance criteria

- Create or edit projects and tasks, reload the page, and confirm their data, task statuses, and project associations are restored.
- With no saved document, the app starts with the normal empty workspace.
- Invalid JSON, unsupported schema version, invalid data shape, duplicate IDs, invalid task status, or tasks referencing missing projects produce a recovery message and leave the stored document unchanged.
- The recovery action names the effect, asks for explicit confirmation, and removes only the Flowboard data key when confirmed; canceling leaves stored data untouched.
- Simulated read or save failure leaves current in-memory changes visible and displays a clear message that persistence failed.
- After a successful explicit reset, the app returns to an editable empty workspace and can save new data.
- `npm run build` completes TypeScript checking and a Vite production build.

## Contracts

- `src/storage/workspace-storage.ts` owns the storage key, schema version, app-data document type, persisted-data validation, and typed load/save/reset results.
- The document is `{ version: 1, projects: Project[], tasks: Task[] }` and is stored under a named Flowboard local-storage key.
- Storage operations may import the public `Project` and `Task` contracts, but project/task feature modules do not import storage.
- The app shell owns loading state, project/task state, selected project, status feedback, and calls typed storage operations after changes.
- Storage results distinguish missing data, valid data, malformed/unsupported data, and access/write failures. No raw parsed value is returned before full validation.
- Reset removes only the Flowboard key and is callable only after the UI's explicit user confirmation.

## Data and APIs

`AppData` contains a literal schema version and arrays of current `Project` and `Task` records. `loadWorkspace()` returns a discriminated result for `missing`, `loaded`, `malformed`, or `unavailable`. `saveWorkspace(data)` returns success or a clear failure result. `resetWorkspace()` returns success or failure without throwing storage exceptions into the UI.

## Edge cases

- Access to `window.localStorage` itself may throw before `getItem` or `setItem` is called.
- JSON may parse but contain wrong versions, missing arrays, invalid or blank fields, duplicate IDs, invalid status values, or tasks with no matching project.
- Quota or policy errors during save must leave current React state available and explain that it was not persisted.
- Reset may itself fail; in that case retain the malformed-data lock and report the failure without claiming data was removed.
- Deleting a project must save the already-approved cascade deletion of its tasks in the same app-data document.
- Empty descriptions and an empty workspace must remain valid data.

## Risks

- Writing before startup loading completes could overwrite previously saved data with the initial empty state; gate persistence until the load decision finishes.
- Permissive validation could allow malformed records to corrupt later UI operations; validate the complete document, including ID uniqueness and task ownership, before loading.
- Aggressive validation could reject safe optional values; validate fields against the approved domain contracts and allow absent optional descriptions.

## Decisions

- Use a single schema-versioned JSON document in `localStorage` with no migration path because there is no existing app data format.
- Treat malformed or unsupported saved data as read-only recovery state until the user confirms reset; do not merge it with an empty in-memory workspace.
- When storage is unavailable, keep the UI usable in memory and show that changes are temporary or failed to persist.

## Gates

- `npm run build` is the deterministic blocking gate for task and review verification.
- Manually check reload persistence, missing-data startup, malformed and unsupported data recovery, read/write failure behavior, explicit reset/cancel, keyboard use, and a narrow viewport in the browser.
