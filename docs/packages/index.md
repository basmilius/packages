---
outline: deep

cards:
    -   title: Common
        details: 'Vue 3 composables, Pinia store helpers, router helpers and shared error classes.'
        link: /common/
    -   title: HTTP Client
        details: 'A typed HTTP client with reactive DTOs, decorators and serialization.'
        link: /http-client/
    -   title: Routing
        details: 'A vue-router wrapper that adds modal, overlay and slide-over routing.'
        link: /routing/
    -   title: Utils
        details: '47+ tree-shakeable utilities for dates, colors, math, DOM and geo.'
        link: /utils/
    -   title: Vite Preset
        details: 'An opinionated Vite preset with CSS modules, library composition and chunking.'
        link: /vite-preset/
    -   title: Worker
        details: 'Cloudflare Worker primitives — typed routing, request helpers and errors.'
        link: /worker/
---

# Packages

Six independently published `@basmilius/*` packages. Each one solves a single concern, ships
as ESM-only TypeScript, and can be installed on its own — there is no meta-package to pull in.

<LinkCards/>

## How they fit together

Three packages form a small Vue toolkit; the other three are standalone tools you can drop
into any project. Only two internal dependencies exist between them:

```
common ──▶ http-client ──▶ utils
   └───────────────────────▶ utils
```

- **[`common`](/common/)** depends on **[`http-client`](/http-client/)** (for the data-oriented
  composables) and on **[`utils`](/utils/)**.
- **[`http-client`](/http-client/)** depends on **[`utils`](/utils/)**.
- **[`routing`](/routing/)**, **[`vite-preset`](/vite-preset/)** and **[`worker`](/worker/)**
  are fully standalone.

::: tip Tree-shakeable by design
Installing `common` pulls in `http-client` and `utils` automatically, but every package is
side-effect-free and tree-shakeable — you only ship the symbols you import.
:::

## Peer dependencies

Packages declare their framework dependencies as peers, so you control the exact versions.

| Package         | Peer dependencies          |
| --------------- | -------------------------- |
| `common`        | `vue`, `vue-router`, `pinia` (`http-client` optional) |
| `http-client`   | `vue`                      |
| `routing`       | `vue`, `vue-router`        |
| `utils`         | `luxon`                    |
| `vite-preset`   | `vite`                     |
| `worker`        | `luxon`                    |

## Where to start

- New to the ecosystem? Begin with the [Guide](/guide/) for installation and conventions.
- Building a Vue app? Start with [Common](/common/) and add [HTTP Client](/http-client/) and
  [Routing](/routing/) as needed.
- Just need a helper? [Utils](/utils/) is standalone and tree-shakeable.
