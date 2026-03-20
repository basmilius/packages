<a href="https://bas.dev" target="_blank" rel="noopener">
	<img src="https://bmcdn.nl/assets/branding/logo.svg" alt="Bas-logo" height="48"/>
</a>

---

# Packages

This repository contains the source code for various Bun packages that I use in personal projects.

## 📦 Registry

- Common is available under `@basmilius/common`.
- Tools is available under `@basmilius/tools`.
- Utils is available under `@basmilius/utils`.
- Vite preset is available under `@basmilius/vite-preset`.
- HTTP client is available under `@basmilius/http-client`.
- Cloudflare worker primitives is available under `@basmilius/worker`.

## ⭐️ Prerequisites

- Bun >= 1.3.11

## 🚀 Getting started

- Run `bun install` to install dependencies.
- Follow the instructions in each package.

## 🪵 Git

All commit messages and branches will be in English.

### Branches

- **Main** — Contains the latest stable release.
- **Feature branches** — Any feature should have its own feature branch. Once complete, the branch should be merged into _main_ and the feature branch should be deleted.
- **Bugfix branches** — When a bug is found, it should be fixed within a bugfix branch. Once complete, the branch should be merged into _main_ and the bugfix branch should be deleted.

### Commit messages

Commit messages are bound to the following templates:

- `<type>: <message> `
- `<type>(<feature>): <message>`
- `<type>(<feature>): <message> [<issue-number>]`
