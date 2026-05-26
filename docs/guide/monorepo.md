---
outline: deep
---

# Monorepo layout

**Packages** is a [Bun](https://bun.sh/) workspace. The seven packages live under `packages/*`, and the documentation site lives in `docs/`.

```
basmilius-packages/
    packages/
        common/
        http-client/
        routing/
        tools/
        utils/
        vite-preset/
        worker/
    docs/
        .vitepress/
        index.md
        ...
    bunfig.toml
    package.json
    wrangler.toml
```

## Package dependencies

Some packages depend on each other, others are entirely standalone:

```
common  ──► http-client ──► utils
common  ──► utils
routing                                  (peer: vue, vue-router)
tools                                    (build-only, no runtime deps)
utils                                    (luxon)
vite-preset                              (peer: vite)
worker                                   (luxon, Cloudflare-only)
```

`common` is the only package that pulls in others as runtime dependencies. The rest are independent and can be installed individually.

## Building

Every package builds with `tsdown`-style scripts.

```shell
bun --cwd packages/tools build
bun --cwd packages/utils build
bun --cwd packages/vite-preset build
bun --cwd packages/http-client build
bun --cwd packages/routing build
bun --cwd packages/common build
bun --cwd packages/worker build
```

Run all of them with:

```shell
bun -F './packages/*' build
```

## Workspace tooling

| File           | Purpose                                                                       |
|----------------|-------------------------------------------------------------------------------|
| `bunfig.toml`  | Sets `linker = "isolated"` so workspace packages aren't hoisted.              |
| `wrangler.toml`| Configures the Cloudflare Worker that serves this documentation site.         |
| `tsconfig.json`| Per-package TypeScript config; consult each package for specifics.            |

## Local development against this monorepo

Clone the repo, install once at the root, and run the docs site locally:

```shell
git clone https://github.com/basmilius/packages.git
cd packages
bun install
bun docs:dev
```

The docs Vite config aliases each `@basmilius/<name>` import directly to the package's `src/index.ts`, so any changes to a package are reflected in the docs without a rebuild.
