---
outline: deep
---

# clean

A Bun build plugin that removes a directory before bundling starts. Useful for clearing the `dist/` folder so stale artefacts don't leak into the new build.

## Importing

```ts
import { clean } from '@basmilius/tools';
```

## Usage

```ts
import { build, clean } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    plugins: [
        clean('dist')
    ]
});
```

The plugin runs in `setup()`, so the directory is removed once at the start of the build, not on every load.

## Behaviour

- Resolves the path against the current working directory.
- If the directory does not exist, the plugin is a no-op.
- Removes recursively (`rm -rf` semantics) using `node:fs/promises`.

## Parameters

| Name  | Type     | Description                          |
|-------|----------|--------------------------------------|
| `dir` | `string` | The directory to remove (relative or absolute). |

## Returns

`BunPlugin` — pass directly to `Bun.build` via the `plugins` array.

## Type signature

```ts
declare function clean(dir: string): BunPlugin;
```

## See also

- [`build`](/tools/build) — the wrapper that runs the plugins.
- [`copy`](/tools/copy) — write auxiliary files into the freshly cleaned directory.
