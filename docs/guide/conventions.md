---
outline: deep
---

# Conventions

The seven packages share a small but strict set of conventions. They make code review boring (a good thing), keep type emit fast and ensure every export is documented.

## TypeScript

- **`target: "esnext"`** and **`module: "esnext"`** — output is always modern ESM.
- **`strict: true`** plus **`isolatedDeclarations: true`** — every public export needs an explicit return type.
- **`experimentalDecorators: true`** — `@dto`, `@bound`, `@debounce`, `@adapter` rely on stage-2 decorators.
- **JSX** isn't used in any package source.

## Code style

- **4-space indentation** everywhere (`.editorconfig` is the source of truth).
- **`readonly` and `final`** classes preferred where the language permits.
- **Curly braces** are required for all control flow, including single-line early returns:

    ```ts
    if (!user) {
        return null;
    }
    ```

- **No single-letter variable names** other than the canonical `i`, `e`, `x`, `y`.
- **Arrow functions** for callbacks and inline functions. Class methods are regular methods, not arrow-bound, except when you explicitly need `this` to bind.
- **Imports are flat**: classes from the same namespace are grouped on one line: `import { Foo, Bar } from '@scope/pkg'`. Namespaces themselves are never grouped.

## Releases

- Each package is published to npm independently.
- Conventional Commits (`feat:`, `fix:`, `chore:`, …) drive the changelog.
- Tags are package-scoped: `@basmilius/utils@0.0.0` rather than a global version.

## Dependencies

- **Runtime**: keep them minimal. `luxon` for dates, `lodash-es` where the implementation would otherwise be tedious.
- **Dev**: pin to known-good majors; avoid surprise breakage in CI.
- **Peers**: every Vue-related package declares `vue`, `vue-router` and/or `pinia` as peers.

## Documentation

- Every public export is documented under `docs/<package>/`.
- Pure functions get a single page each.
- Vue components use frontmatter `props`, `emits` and `slots` arrays — rendered by the `<FrontmatterDocs/>` orchestrator.
- Decorators are documented with **static code blocks** only — no executable Vue SFCs that import them, because esbuild's transform doesn't understand stage-2 decorators inside `<script setup>`.
