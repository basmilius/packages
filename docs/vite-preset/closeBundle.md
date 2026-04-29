---
outline: deep
---

# closeBundle

A tiny Vite plugin that calls `process.exit(0)` when the bundle finishes. Useful for short-lived CI builds where lingering watchers or async handles would otherwise keep Node alive.

## Importing

```ts
import { closeBundle } from '@basmilius/vite-preset';
```

## Usage

```ts
import { defineConfig } from 'vite';
import { closeBundle, preset } from '@basmilius/vite-preset';

export default defineConfig({
    plugins: [
        preset({ isLibrary: true }),
        closeBundle()
    ]
});
```

The plugin only fires during `vite build` (the `closeBundle` Rollup hook is not called in `vite dev`).

## Returns

`Plugin` — a Vite plugin you can register on the `plugins` array.

## Type signature

```ts
declare function closeBundle(): Plugin;
```

## See also

- [`preset`](/vite-preset/preset) — the wider plugin chain.
