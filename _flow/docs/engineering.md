---
schema_version: 1
status: approved
approved_at: "2026-09-27T22:58:59Z"
baseline:
  profile: flow/readability-first@2
  existing_code_policy: not_applicable
---

# Engineering

## Observed system

Greenfield. The repository contains Flow 2.2.0 metadata, the Flow package, and its lockfile. It has no application source, Git repository, frontend tooling, or existing test suite.

## Adoption strategy

Not applicable. There is no existing application architecture to preserve or refactor. Initialize Git to provide Flow's required task commit traceability.

## System shape

Build a client-side single-page application with React, TypeScript, and Vite. Vite owns development and production build entry points. The browser is the runtime; there is no application server, database, account system, or external service. Keep the initial module graph small and use feature-owned behavior with a narrow shared app shell.

## Modules and ownership

- `src/main.tsx` mounts the React application and imports global styles.
- `src/app/` owns the page shell, project selection, and composition of project and task features.
- `src/projects/` owns project types, project form/list UI, project validation, and project-level operations.
- `src/tasks/` owns task/status types, task form and board UI, task validation, and status transitions.
- `src/storage/` owns browser storage reads/writes and conversion/validation of persisted data. It may depend on the project and task data contracts; feature UI must not call browser storage APIs directly.
- `src/styles/` owns global tokens, reset, and responsive layout styles. Component-specific styling stays with its owning feature where practical.
- `index.html`, `vite.config.ts`, and `tsconfig*.json` are build configuration, not locations for product behavior.

Keep project and task records as simple typed data. Do not add global state, routing, or component libraries unless an approved requirement makes them necessary.

## Dependency direction and boundaries

Feature components and deterministic project/task operations use typed data and React. The app shell composes feature UI. The storage boundary alone accesses `window.localStorage`; it exposes typed load/save operations and validates parsed values before returning them. Project and task behavior does not depend on storage mechanics. No feature imports another feature's internal UI or storage implementation; shared data contracts are imported from their owning feature. Avoid a backend and network dependencies for this local-only product.

## Vertical slices and code organization

Organize by capability rather than technical layer. `src/projects/` contains project-facing forms and operations; `src/tasks/` contains task forms, board presentation, and status behavior. `src/app/` composes the selected project with its board. Keep each component, its focused styles, and nearby behavior together; promote only truly shared layout or tokens. Keep public names easy to find, such as `ProjectList`, `ProjectForm`, `TaskBoard`, `TaskForm`, and `changeTaskStatus`.

## Naming and readability conventions

Use TypeScript strict mode. Use kebab-case filenames (`task-board.tsx`, `project-form.tsx`), PascalCase React component names, camelCase functions/variables, and explicit PascalCase domain types (`Project`, `Task`, `TaskStatus`). Keep required fields and status values explicit in types. Use named constants for storage keys and status definitions. Prefer small components and direct data flow; avoid generic helpers, speculative interfaces, and duplicated sources of truth. Use readable CSS class names and semantic HTML.

## Data ownership and persistence

The app owns project and task data in browser local storage. Define typed records with stable string IDs and created/updated timestamps where useful. Persist one versioned app-data document so reads and writes stay coherent. On startup, parse and validate the document; handle missing data as an empty workspace. Keep malformed data from silently overwriting itself and show a recoverable message. Storage is per browser profile/device and is not a backup or sync mechanism.

## Error handling

Validate and trim required project names and task titles at the form boundary and in the owning operation where it prevents invalid records. Catch JSON parse, quota, and storage access errors at the storage boundary and return an explicit result for the UI to explain. Preserve in-memory state if a save fails and tell the user that the change was not persisted. Confirm project deletion before cascading task deletion. Avoid empty catch blocks.

## Testing and verification

Use the production TypeScript/Vite build as the deterministic verification gate. Perform manual acceptance checks in the browser for project and task create/edit/delete, all status transitions, reload persistence, blank-value validation, deletion confirmation, storage failure messaging, keyboard operation, and a narrow viewport. Do not add a test framework or duplicate the UI implementation in tests for this MVP.

## Dependencies and external services

Runtime dependencies: React and React DOM. Development dependencies: Vite, TypeScript, and the React Vite plugin. Do not add a state library, router, component framework, backend, hosted database, analytics, or remote API for the MVP.

## Security and operations

The app handles local, user-entered project data only. Do not render descriptions as HTML. No secrets or personal account data are required. Document the local development and build commands in the repository README. Deployment and cloud backup are outside scope.

## Deterministic gates

Run `npm run build` for task and work-item review verification. This must include TypeScript checking and a Vite production build. Browser acceptance remains a manual review because it checks interactive behavior and responsive layout.

## Deferred complexity

Authentication, cloud persistence, collaboration, routing, advanced task metadata, drag-and-drop, automated browser tests, and deployment remain deferred until product requirements justify them.

## Exceptions

No architecture exceptions are currently approved. A small app shell may hold cross-feature selection and aggregate state; feature-specific rules remain in the owning project or task slice.
