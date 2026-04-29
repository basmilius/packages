---
outline: deep
---

# Contributing

Pull requests are welcome. The packages are personal and opinionated, so it pays to open an issue before doing significant work — but small fixes, doc improvements and additional tests are always appreciated.

## Local setup

```shell
git clone https://github.com/basmilius/packages.git
cd packages
bun install
```

Bun is required (`>= 1.3.11`); `npm` and `pnpm` should also work as installers, but builds and the docs site are scripted around `bun --cwd <pkg> build`.

## Building

Build a single package:

```shell
bun --cwd packages/utils build
```

Build everything in dependency order:

```shell
./build.sh
```

## Documentation

Run the docs site locally:

```shell
bun docs:dev
```

The site auto-reloads on changes to either the docs or any package source — the Vite config aliases each `@basmilius/<name>` import directly to the workspace `src/index.ts`.

Build a static export of the docs:

```shell
bun docs:build
```

The output lives at `docs/.vitepress/dist`.

## Pull requests

- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, …).
- Keep changes focused — one logical change per PR.
- Add or update documentation under `docs/<package>/` whenever you change a public export.
- Add or update tests if the package has a test suite.
- Don't bump versions or edit changelogs in the PR — releases are scripted.

## CI

Two GitHub Actions workflows run on every PR:

- **Package build** — checks every package compiles cleanly.
- **Docs PR preview** — deploys the docs to a Cloudflare preview URL via `wrangler versions upload --tag pr-<num>`. The deployment URL is posted as a check on the PR.

A successful release (created via the GitHub Releases UI) triggers `docs-released.yml`, which re-deploys the docs to `packages.bas.dev`.

## Asking for help

Open an issue at [github.com/basmilius/packages/issues](https://github.com/basmilius/packages/issues) or start a discussion under the same repo. Please include the smallest reproducible example you can — the maintainer is one person, and concrete repros get fixed first.
