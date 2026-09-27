---
schema_version: 1
work_item: W002
title: Project management
outcome: A user can create, select, rename, and confirm deletion of projects
  with required-name validation.
kind: feature
priority: 2
depends_on:
  - W001
blockers: []
maturity: ready
approval:
  at: 2026-09-27T23:10:27.791Z
  revision: 03bd527fc58441aab635924d9351247889335054fd06bba96ff8fa643a03a1d6
---

# Work Item Specification

## Outcome

A user can create, select, rename, and confirm deletion of projects with required-name validation.

## Problem

The workspace shell currently has no project data or controls. Users need a clear way to create and choose the projects that will own their tasks.

## Scope

- Define the typed `Project` record and project operations in `src/projects/`.
- Add a project list with clear empty state, project selection, and visible create, edit, and delete controls.
- Add labeled create and edit forms with a required project name and optional description.
- Trim surrounding whitespace from names and reject names that are blank after trimming, with a specific inline error associated with the name field.
- Ask for confirmation before project deletion and explain that project tasks will also be removed.
- Compose project state and selection in the app shell; update the selected project when a project is renamed or deleted.
- Keep project state in memory for this work-item. Browser persistence and recovery are delivered by W004.
- Add focused styles next to project UI and update global layout only where needed to fit project management into the shell.

## Non-goals

- Task creation, task display, status transitions, or task persistence.
- Browser reload persistence, storage error handling, cross-device sync, accounts, or collaboration.
- Search, sorting controls, project colors, or additional project metadata.

## Requirements

1. A user can create a project with a non-blank name and optional description.
2. Project names are trimmed before saving; whitespace-only names are rejected and the project is not created or renamed.
3. A user can select any listed project and can tell which project is selected.
4. A user can rename a project without changing its stable identity or selection.
5. A user can delete a project only after confirming a warning that its tasks will also be removed.
6. Canceling project deletion leaves the project in the list and selected state unchanged.
7. Deleting the selected project selects a remaining project when one exists; otherwise the workspace returns to its project empty state.
8. Empty workspace guidance provides an explicit way to create the first project.
9. Project controls work with keyboard and touch, have visible focus, and use semantic labels and buttons.
10. Project UI remains readable and operable at narrow viewport widths.

## Acceptance criteria

- A project form opens from a visible create control, and submitting a valid name adds the project to the list and selects it.
- Names with leading or trailing whitespace are stored trimmed; blank and whitespace-only submissions show an inline error and do not create or update a project.
- Selecting a different project updates the selected indicator and project heading immediately.
- Editing a project updates its displayed name and description while retaining its ID.
- Deletion displays a confirmation message mentioning associated tasks. Cancel preserves the project; confirm removes it and applies the selection fallback described above.
- With no projects, the workspace explains how to create one; at narrow widths the project list and form remain usable without page-level horizontal scrolling.
- `npm run build` completes TypeScript checking and a Vite production build.

## Contracts

- `src/projects/project.ts` owns the `Project` type and deterministic project create, update, and delete operations.
- Project UI, validation, and focused styles live in `src/projects/`; expose named components such as `ProjectList` and `ProjectForm`.
- `src/app/` owns the project collection and selected project ID and composes project UI with the workspace shell.
- Project operations accept and return typed values and do not read browser storage or import app-shell internals.
- The project ID is a stable string identity. Names are stored trimmed; descriptions are optional plain text and are never rendered as HTML.
- Project state is in memory until W004 adds the approved storage boundary.

## Data and APIs

`Project` contains `id: string`, `name: string`, and an optional `description: string`. The app shell supplies a project collection and selection callbacks to project UI. Creating a project assigns a stable ID; updating retains that ID.

## Edge cases

- Submitting whitespace-only name in either create or edit mode must leave the existing project data untouched and keep the form recoverable.
- A project may have an empty description; empty descriptions should not create visually noisy placeholder copy in the list.
- Deleting the selected project when several exist must not leave a dangling selected ID.
- Canceling deletion must not mutate project data or selection.
- User-entered descriptions may contain markup-like text and must render as text.

## Risks

- Keeping project state only in React means a reload loses it until W004; make this boundary explicit in the implementation and avoid implying persistence is already available.
- Project selection and project mutation state belong to the app shell, while project-specific rules stay in `src/projects/`; avoid moving those rules into generic shared helpers.

## Decisions

- Use a visible project list and inline forms rather than adding routing or a component library.
- Use the browser's native confirmation prompt for the destructive action so confirmation remains explicit without introducing modal focus-management complexity.
- Keep this feature's state in memory and add persistence in the already planned W004 outcome.

## Gates

- `npm run build` is the deterministic blocking gate for task and review verification.
- Manually check project create/select/edit/delete, whitespace validation, deletion cancel/confirm, keyboard operation, and a narrow viewport in the browser.
