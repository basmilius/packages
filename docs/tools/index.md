---
outline: deep
---

# Tools

Small build primitives for libraries powered by [Bun](https://bun.sh/) and [oxc-transform](https://oxc.rs/). The package exposes four functions that compose into a single `bun build` script.

## Functions

- [`build`](/tools/build) — wraps `Bun.build` with sensible library defaults (ESM, minify, sourcemaps).
- [`clean`](/tools/clean) — Bun plugin that removes a directory before bundling.
- [`copy`](/tools/copy) — Bun plugin that copies a file after bundling.
- [`dts`](/tools/dts) — Bun plugin that emits `.d.ts` files via `oxc-transform`'s isolated declarations.

## Quick example

```ts
// build.ts
import { build, clean, copy, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    plugins: [
        clean('dist'),
        dts(),
        copy('package.json', 'dist/package.json')
    ]
});
```

Run with `bun build.ts`.
