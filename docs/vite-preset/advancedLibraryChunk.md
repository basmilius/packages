---
outline: deep
---

# advancedLibraryChunk

Builds an `AdvancedChunk` configuration that groups vendor modules into a named chunk based on `node_modules/` paths. Pair with Rolldown's `advancedChunks.groups` option to bundle related dependencies together.

## Importing

```ts
import { advancedLibraryChunk } from '@basmilius/vite-preset';
```

## Usage

```ts
import { defineConfig } from 'vite';
import { advancedLibraryChunk } from '@basmilius/vite-preset';

export default defineConfig({
    build: {
        rolldownOptions: {
            advancedChunks: {
                groups: [
                    advancedLibraryChunk('vue', ['vue', 'vue-router', 'pinia']),
                    advancedLibraryChunk('charting', ['echarts', 'd3'])
                ]
            }
        }
    }
});
```

The matcher returns `true` when a module id contains `/node_modules/<moduleId>/` for any of the configured ids.

## Parameters

| Name        | Type       | Description                                                       |
|-------------|------------|-------------------------------------------------------------------|
| `name`      | `string`   | The chunk name to emit.                                           |
| `moduleIds` | `string[]` | Package names that, wrapped in `/node_modules/<name>/`, match.    |

## Returns

```ts
type AdvancedChunk = {
    readonly name: string;
    readonly test: (moduleId: string) => boolean;
};
```

## Type signature

```ts
declare function advancedLibraryChunk(name: string, moduleIds: string[]): AdvancedChunk;
```

## See also

- [`advancedAppChunk`](/vite-preset/advancedAppChunk) — the equivalent for source code in `src/`.
