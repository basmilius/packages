---
outline: deep
---

# build

Wraps `Bun.build` with library-friendly defaults: ESM output, minified, linked sourcemaps, no splitting, Node target. Logs a friendly success or failure message and exits with code `1` on errors.

## Importing

```ts
import { build } from '@basmilius/tools';
```

## Usage

```ts
import { build, clean, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    plugins: [
        clean('dist'),
        dts()
    ]
});
```

## Defaults

The function only requires `entrypoints`. Any field below can still be overridden by passing it explicitly.

| Field        | Default      | Description                                   |
|--------------|--------------|-----------------------------------------------|
| `root`       | `'src'`      | Source root used when resolving entrypoints.  |
| `outdir`     | `'dist'`     | Output directory.                             |
| `minify`     | `true`       | Produce a minified bundle.                    |
| `sourcemap`  | `'linked'`   | Emit linked sourcemaps next to outputs.       |
| `splitting`  | `false`      | Disable code splitting (libraries usually do).|
| `format`     | `'esm'`      | ESM-only output (`.mjs`).                     |
| `target`     | `'node'`     | Node-compatible runtime target.               |

## Parameters

| Name      | Type                                                              | Description                              |
|-----------|-------------------------------------------------------------------|------------------------------------------|
| `config`  | `Partial<BuildConfig> & Pick<BuildConfig, 'entrypoints'>`         | Partial Bun build config; `entrypoints` is required. |

## Returns

`Promise<void>` — resolves once the build finishes successfully, or exits the process with code `1` on failure.

## Type signature

```ts
declare function build(
    config: Partial<BuildConfig> & Pick<BuildConfig, 'entrypoints'>
): Promise<void>;
```

## See also

- [`clean`](/tools/clean) — clear `dist/` before bundling.
- [`copy`](/tools/copy) — copy auxiliary files into `dist/`.
- [`dts`](/tools/dts) — emit declaration files alongside the bundle.
