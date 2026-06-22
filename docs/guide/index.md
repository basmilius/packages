---
outline: deep
---

# Introduction

Welcome to **Packages** — a collection of six small npm packages that power my personal Vue, TypeScript and Bun projects. Each package is published independently and follows the same engineering conventions: ESM-only, TypeScript-first, minimal dependencies, and built with [Bun](https://bun.sh/).

## What's inside?

- [**Common**](/common/) — Vue composables, store helpers, router helpers and shared error classes used across all my apps.
- [**HTTP Client**](/http-client/) — a typed HTTP client with reactive DTOs, decorators (`@dto`, `@bound`, `@debounce`) and serialisation for nested objects, dates and pagination.
- [**Routing**](/routing/) — a Vue Router wrapper that adds modal and overlay routing on top of `vue-router` 5.
- [**Utils**](/utils/) — 47+ small, focused, tree-shakeable utilities for dates, colours, math, DOM operations and more.
- [**Vite Preset**](/vite-preset/) — an opinionated Vite preset with CSS Modules, library composition and chunk splitting.
- [**Worker**](/worker/) — Cloudflare Worker primitives — typed routing, request helpers and structured error responses.

## Where to start

- New here? Read [Getting started](/guide/getting-started) for installation and a first taste.
- Want the big picture? The [Packages overview](/packages/) shows all six packages and how they depend on each other.
- Coming from one of my projects? Jump straight to the package documentation via the **Packages** menu.
- Curious about how the monorepo is laid out? See [Monorepo](/guide/monorepo).
