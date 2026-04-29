---
outline: deep
---

# copy

A Bun build plugin that copies a single file from `src` to `dest` after the bundle finishes. Handy for shipping a `package.json` or a `README.md` next to the compiled code.

## Importing

```ts
import { copy } from '@basmilius/tools';
```

## Usage

```ts
import { build, copy } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    plugins: [
        copy('package.json', 'dist/package.json'),
        copy('README.md', 'dist/README.md')
    ]
});
```

## Behaviour

- Runs in `onEnd`, so the copy happens after the bundle is fully written.
- Uses `node:fs/promises#copyFile` and `Bun.pathToFileURL` for cross-platform path handling.
- Overwrites the destination if it already exists.

## Parameters

| Name   | Type     | Description                |
|--------|----------|----------------------------|
| `src`  | `string` | The source file path.      |
| `dest` | `string` | The destination file path. |

## Returns

`BunPlugin` — register on the `plugins` array of `Bun.build`.

## Type signature

```ts
declare function copy(src: string, dest: string): BunPlugin;
```

## See also

- [`build`](/tools/build) — the wrapper that runs the plugins.
- [`clean`](/tools/clean) — wipe the destination before copying.
