---
schema_version: 1
status: approved
approved_at: "2026-09-27T22:34:11Z"
---

# Product Requirements

## Purpose

Flowboard gives one person a lightweight place to organize project work and see what is waiting, underway, or finished. The MVP helps users create projects, add tasks, move tasks through three statuses, and return to their work later in the same browser.

## Users

The MVP serves an individual who wants a simple project task board. It does not support shared team use.

## Scope

- Project list and project creation, editing, deletion, and selection.
- Each project has a required name, optional description, and stable identity.
- Task creation, editing, and deletion within a project. Each task has a required title, optional description, stable identity, one project, and one status.
- A three-column board for Todo, In Progress, and Done. New tasks start in Todo. A task may move directly to any status.
- All tasks appear in their status column, with empty columns and per-column counts visible.
- Explicit status controls provide keyboard and touch access; drag and drop is optional polish.
- Data persists in the same browser across reloads. It is not synced across devices or browsers.
- Clear empty states invite users to create their first project or task.
- Project deletion confirms before removing the project and its tasks.
- Responsive layout and keyboard access, including visible focus, readable contrast, and labels for icon-only controls.

## Requirements

1. A user can create a project using a non-blank name and optional description.
2. A user can select a project and create, edit, or delete tasks within it using a non-blank title and optional description.
3. New tasks begin in Todo; users can move any task to Todo, In Progress, or Done and see it in the new column immediately.
4. The board groups every task by status, shows all three columns, and shows task counts.
5. A user can rename or delete a project. Deleting a project clearly warns that its tasks will also be removed and requires confirmation.
6. Projects and tasks remain available after reload in the same browser.
7. Blank required values are rejected after trimming surrounding whitespace.
8. If browser storage is unavailable or contains malformed data, the app avoids silently discarding the current session and provides a clear recovery message where possible.
9. Empty and narrow-screen states remain understandable and operable. Moving tasks does not depend on drag and drop.

## Constraints

- Single-user and local-only. No account, authentication, cloud sync, collaboration, roles, or permissions.
- No due dates, priorities, labels, comments, attachments, subtasks, search, notifications, multiple boards, custom statuses, analytics, or external integrations.
- No deployment target was requested; deliver a local-running MVP in this repository.
- The repository currently contains Flow metadata and its package but no app source or Git repository. Engineering will select a small web stack and initialize Git as needed for Flow task traceability.

## Non-goals

- Following a user across devices or browsers.
- Supporting multiple people editing or viewing the same projects.
- Requiring a fixed project name or visual brand; Flowboard is a working name.
- Making drag and drop the only way to change task status.
