---
schema_version: 1
work_item: W001
title: Application foundation
outcome: The app starts as a responsive, accessible workspace shell ready for
  project and task workflows.
kind: technical
priority: 1
depends_on: []
blockers: []
maturity: ready
approval:
  at: 2026-09-27T23:00:49.095Z
  revision: 4e6375c4372b93f33612ae8769df710badaa32bed3f2604fea93e6ee7e5cd4fa
---

# Work Item Specification

## Outcome

The app starts as a responsive, accessible workspace shell ready for project and task workflows.

## Problem

The repository has no application source or frontend tooling. The project needs a working client-side foundation that follows the approved React, TypeScript, and Vite architecture and provides a clear, operable starting point for the project and task features.

## Scope

- Initialize the React, TypeScript, and Vite application using the approved runtime and development dependencies.
- Add the HTML entry point and `src/main.tsx` mount, a small `src/app/` shell, global styles under `src/styles/`, and the required TypeScript and Vite configuration.
- Enable TypeScript strict mode and configure the production build to check types before bundling.
- Present a responsive, semantic workspace shell with the Flowboard working title and a useful initial empty-workspace message.
- Document local install, development, and production build commands in the repository README.

## Non-goals

- Implementing project or task behavior, forms, status transitions, or browser persistence.
- Adding a router, state library, component framework, backend, remote service, or test framework.
- Selecting a fixed brand identity beyond the Flowboard working title.

## Requirements

1. The project starts locally using the documented development command.
2. The initial screen mounts through the React entry point and presents a meaningful workspace shell rather than a blank page.
3. The shell uses semantic landmarks and headings, remains understandable at narrow viewport widths, and has visible keyboard focus for any interactive element it contains.
4. TypeScript strict mode is enabled, and `npm run build` performs TypeScript checking and a Vite production build.
5. The dependency set matches the engineering contract: React and React DOM at runtime; Vite, TypeScript, and the React Vite plugin for development.
6. The README documents install, development, and build commands.

## Acceptance criteria

- Running the documented install and development commands opens the app locally without runtime errors.
- The initial page shows the Flowboard workspace heading and empty-workspace guidance in a semantic main region.
- At narrow viewport widths, the shell remains readable without horizontal page overflow; keyboard focus is visible on any control present.
- `npm run build` exits successfully only after TypeScript checking and production bundling both complete.
- README commands match the package scripts and dependencies present in the repository.

## Contracts

- `src/main.tsx` mounts the React app and imports global styles.
- `src/app/` owns the page shell and composition point for future project and task features.
- `src/styles/` owns global reset, tokens, and responsive shell styles; feature styles remain with their feature in later work-items.
- `index.html`, `vite.config.ts`, and `tsconfig*.json` are build configuration only and contain no product behavior.
- Use kebab-case filenames, PascalCase React components, semantic HTML, named imports, and strict TypeScript as defined by the engineering contract.

## Data and APIs

This foundation has no domain data, browser storage, network calls, or public application API. Future features will introduce their typed contracts in their owning directories.

## Edge cases

- A narrow viewport must not make the initial shell unusable or cause page-level horizontal overflow.
- Missing browser storage support must not affect this shell because persistence is outside this work-item.
- The production build must fail on TypeScript errors instead of silently emitting an unchecked bundle.

## Risks

- A generated starter template may include unnecessary demo assets or dependencies; remove them so the repository matches the approved small module graph.
- Vite's default build does not necessarily enforce type checking; wire the build script to run the TypeScript compiler before bundling.

## Decisions

- Use the approved React, TypeScript, and Vite stack and directory ownership without further architecture changes.
- Keep the first shell intentionally small so project and task capabilities can be added as vertical slices.

## Gates

- `npm run build` is the deterministic blocking gate for this work-item. It checks TypeScript and produces a Vite production bundle.
- Browser checks for initial rendering, narrow layout, and keyboard focus are part of review; no automated test framework is introduced.
