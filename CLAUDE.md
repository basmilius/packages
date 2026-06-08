# CLAUDE.md

Bun monorepo with six independently published `@basmilius/*` packages plus a VitePress docs site. Read `.editorconfig` before writing code (4-space indent, source of truth).

## Packages (`packages/*`)

| Package       | npm                      | Purpose                                                                                                     |
|---------------|--------------------------|-------------------------------------------------------------------------------------------------------------|
| `common`      | `@basmilius/common`      | Vue composables, Pinia store helpers, router helpers, error classes                                         |
| `http-client` | `@basmilius/http-client` | Typed HTTP client with reactive DTOs, decorators (`@dto`/`@bound`/`@debounce`/`@adapter`) and serialization |
| `routing`     | `@basmilius/routing`     | `vue-router` wrapper with modal/overlay/slide-over routing                                                  |
| `utils`       | `@basmilius/utils`       | Standalone utilities (date, color, math, DOM, geo) — tree-shakeable                                         |
| `vite-preset` | `@basmilius/vite-preset` | Opinionated Vite/Vue preset: CSS modules, library composition, chunk splitting                              |
| `worker`      | `@basmilius/worker`      | Cloudflare Worker primitives: routing, request helpers, structured errors                                   |

**Dependencies:** `common` → `http-client` → `utils`, and `common` → `utils`. The rest are standalone. `common`/`http-client`/`routing` have Vue peers (`vue`, `vue-router`, `pinia`); `utils`/`worker` peer `luxon`; `vite-preset` peers `vite`.

## Commands

```shell
bun install                         # root, isolated linker (bunfig.toml)
bun -F './packages/*' build         # build all packages
bun --cwd packages/<name> build     # build a single package
bun docs:dev                        # docs locally (aliases every @basmilius/* to src/index.ts)
bun docs:build                      # static docs → docs/.vitepress/dist
```

- Per-package build = `tsgo --noEmit && tsdown`: first type-check via the TypeScript native preview (`@typescript/native-preview`), then bundle with tsdown.
- **No test suite** present; no test runner configured.
- Never start a dev server yourself; ask for one.

## Conventions

- `target`/`module` = `esnext`, `moduleResolution: bundler`, `strict` + `isolatedDeclarations` (every public export needs an explicit return type), `experimentalDecorators` (DTO decorators).
- No JSX in source. Prefer `readonly`/`final` where possible. Always use curly braces, including early returns. Flat imports: classes from the same namespace on one line.
- Class top-level methods are never arrow functions; arrow functions for callbacks/inline.
- Every public export gets a docs page under `docs/<package>/`. Document decorators with static code blocks only (esbuild doesn't understand stage-2 decorators inside `<script setup>`).

## Gotchas

- **`routing/src/index.ts`**: re-exports all of `vue-router` via `export *`, then deliberately overrides `createRouter`/`RouterView`/etc. with its own versions (named exports shadow the star export). The `import './augmentations'` is a side-effect import registering the `declare module 'vue-router'` augmentations — do not remove it.
- **`http-client`**: consumers must enable `experimentalDecorators`.

## Releases

Versions sit at `0.0.0` with `workspace:*` deps; **never bump manually**. The `released.yml` workflow rewrites both via `sed` with the release tag and publishes each package separately to npm. A GitHub Release also deploys the docs to Cloudflare (`packages.bas.dev`). Conventional Commits, in English.
