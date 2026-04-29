---
outline: deep
---

# advancedAppChunk

Builds an `AdvancedChunk` configuration that groups source modules into a named chunk based on `src/` paths. Pair with Rolldown's `advancedChunks.groups` option to split application code into named bundles.

## Importing

```ts
import { advancedAppChunk } from '@basmilius/vite-preset';
```

## Usage

```ts
import { defineConfig } from 'vite';
import { advancedAppChunk } from '@basmilius/vite-preset';

export default defineConfig({
    build: {
        rolldownOptions: {
            advancedChunks: {
                groups: [
                    advancedAppChunk('forms', ['form/Input', 'form/Select', 'form/Textarea']),
                    advancedAppChunk('charts', ['chart/Bar', 'chart/Line', 'chart/Pie'])
                ]
            }
        }
    }
});
```

The matcher returns `true` when a module id contains `/src/<moduleId>` for any of the configured ids.

## Parameters

| Name        | Type       | Description                                              |
|-------------|------------|----------------------------------------------------------|
| `name`      | `string`   | The chunk name to emit.                                  |
| `moduleIds` | `string[]` | Path fragments that, prefixed with `/src/`, match files. |

## Returns

```ts
type AdvancedChunk = {
    readonly name: string;
    readonly test: (moduleId: string) => boolean;
};
```

## Type signature

```ts
declare function advancedAppChunk(name: string, moduleIds: string[]): AdvancedChunk;
```

## See also

- [`advancedLibraryChunk`](/vite-preset/advancedLibraryChunk) — the same idea for `node_modules/` paths.
