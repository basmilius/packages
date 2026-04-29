---
outline: deep
---

# dts

A Bun build plugin that emits TypeScript declaration files via [oxc-transform](https://oxc.rs/)'s `isolatedDeclaration` API. The plugin walks every `.ts` source file once during `onLoad`, produces a sibling `.d.ts` next to the compiled module, and is significantly faster than running `tsc` for type emit.

## Importing

```ts
import { dts } from '@basmilius/tools';
```

## Usage

```ts
import { build, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    root: 'src',
    outdir: 'dist',
    plugins: [
        dts()
    ]
});
```

A file at `src/util/format.ts` will produce `dist/util/format.d.ts`.

## Requirements

- The build must define both `root` and `outdir`. Without those, the plugin logs a warning and skips emit.
- Source files must be compatible with [`isolatedDeclarations`](https://www.typescriptlang.org/tsconfig#isolatedDeclarations). All exports must have explicit return types and inferred types must be resolvable per-file.

## Behaviour

- Tracks visited paths in a `Set` so each file is processed once per build.
- Reads each `.ts` file via `Bun.file().text()`.
- Calls `isolatedDeclaration(path, source)` from `oxc-transform`.
- Writes the result to the same path, with `src/` swapped for `dist/` and `.ts` swapped for `.d.ts`.

## Returns

`BunPlugin` — pass into `Bun.build`'s `plugins` array.

## Type signature

```ts
declare function dts(): BunPlugin;
```

## See also

- [`build`](/tools/build) — the wrapper that runs the plugins.
- [`clean`](/tools/clean) — clear the output directory before generating declarations.
