---
schema_version: 1
work_item: W003
title: Task board
outcome: A user can create, edit, delete, and move project tasks across Todo, In
  Progress, and Done columns.
kind: feature
priority: 3
depends_on:
  - W002
blockers: []
maturity: ready
approval:
  at: 2026-09-27T23:21:39.292Z
  revision: afae6f28e6634923fe33d765df2d11e8cc25f631029795b5dfb1e582576e30b2
---

# Work Item Specification

## Outcome

A user can create, edit, delete, and move project tasks across Todo, In Progress, and Done columns.

## Problem

Projects can be selected, but they have no task workflow yet. Users need to capture work and see each task's current progress without relying on drag and drop.

## Scope

- Define typed task and status contracts and deterministic task operations in `src/tasks/`.
- Add a task form for create and edit with a required title, optional description, and trimmed-name validation.
- Render a three-column board for Todo, In Progress, and Done for the selected project, including empty columns and per-column counts.
- Start new tasks in Todo and provide a labeled native status control on every task to move it directly to any status.
- Allow task deletion without confirmation and task editing without changing project or status.
- Keep task state in memory in the app shell until W004 adds persistence.
- When a project is deleted, remove all tasks linked to that project in the app shell's aggregate state.
- Adapt the board and forms to narrow screens without page-level horizontal scrolling.

## Non-goals

- Drag-and-drop movement, custom statuses, due dates, priorities, labels, comments, attachments, subtasks, search, sorting, or notifications.
- Task persistence, storage recovery, accounts, collaboration, or synchronization.
- Confirming ordinary task deletion.

## Requirements

1. A user can create a task in the selected project using a non-blank title and optional description.
2. Task titles are trimmed before saving; blank and whitespace-only titles are rejected in create and edit forms.
3. Each new task receives a stable ID, belongs to exactly one project, and starts in Todo.
4. The selected project's tasks are grouped into Todo, In Progress, and Done columns; all columns remain visible when empty.
5. Each status column displays the number of tasks it contains.
6. A user can move any task directly to any of the three statuses using an explicit keyboard and touch accessible control.
7. A user can edit a task title or description without changing its project, ID, or status.
8. A user can delete a task, and it disappears from its column and count immediately.
9. Switching projects shows only that project's tasks.
10. Deleting a project also removes its tasks and does not leave tasks attached to an unavailable project.
11. Task creation and status changes are unavailable when there is no selected project.
12. Empty columns and empty project task boards explain their state, and narrow layouts remain readable and operable.

## Acceptance criteria

- Creating a valid task adds it to Todo for the current project; surrounding whitespace is trimmed from the title.
- Blank or whitespace-only titles show an inline accessible error and do not create or update a task.
- Every selected-project board renders all three labeled columns and each count equals the number of visible tasks in that column.
- Changing a task's status with its labeled control moves it to the target column immediately and updates both affected counts.
- Editing a task preserves its identity, project association, and current status.
- Deleting a task removes it immediately and updates the count.
- Switching between projects shows only tasks associated with the selected project; deleting a project removes its associated tasks.
- On narrow screens the three columns reflow into a usable vertical layout without horizontal page overflow; all forms and status controls work by keyboard.
- `npm run build` completes TypeScript checking and a Vite production build.

## Contracts

- `src/tasks/task.ts` owns `Task`, `TaskStatus`, the canonical status definitions, task input normalization, and named operations such as `createTask`, `updateTask`, `deleteTask`, and `changeTaskStatus`.
- Task UI and focused styles live in `src/tasks/`; expose named components such as `TaskBoard` and `TaskForm`.
- `Task` contains a stable string ID, a project ID, a trimmed title, an optional plain-text description, and one status from the canonical status list.
- The app shell owns aggregate task state and selected project composition; task components receive their project tasks and callbacks as typed props.
- Project deletion removes matching tasks in the app shell. Project and task features do not import each other's internal UI.
- Storage remains outside feature components and is added by W004.

## Data and APIs

`Task` contains `id: string`, `projectId: string`, `title: string`, optional `description: string`, and `status: TaskStatus`. `TaskStatus` is the finite union `todo | in-progress | done`, with one named status definition list supplying user-facing labels. Create accepts the selected project ID and task input; update preserves task ID, project ID, and status; status change accepts only a `TaskStatus` value.

## Edge cases

- Blank titles must not overwrite an existing title during edit.
- Moving a task to its current status leaves exactly one copy in that column and leaves counts unchanged.
- Updating or changing status must not mutate another project's task.
- Deleting the selected project must remove all of its tasks, while tasks in other projects remain intact.
- User-entered descriptions are rendered as text and may contain markup-like content.
- A column with no tasks still shows its heading, count of zero, and empty-state copy.

## Risks

- Task records and project records are held in separate app-shell arrays; keep `projectId` filtering and deletion cleanup in the app shell so feature modules remain independent.
- The board can become overly dense on small screens; stack columns at the approved responsive breakpoint instead of introducing horizontal page scrolling.

## Decisions

- Use a native labeled `<select>` per task for explicit direct status movement. Drag and drop is unnecessary for the MVP and remains optional deferred polish.
- Use Todo, In Progress, and Done as the only statuses, with stable internal values `todo`, `in-progress`, and `done`.
- Keep task state in memory and add reload persistence in W004.

## Gates

- `npm run build` is the deterministic blocking gate for task and review verification.
- Manually check task create/edit/delete, blank-value validation, all status transitions, counts, project isolation and deletion cleanup, keyboard operation, and a narrow viewport in the browser.
