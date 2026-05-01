---
outline: deep
---

# composeLibrary

Builds a Vite plugin that wires a workspace library (e.g. `@flux-ui/components`) into the host build. The returned plugin aliases the package name and a short `$alias` to the library's `src/`, ensures the source path is allowed in `server.fs.allow`, excludes the package from `optimizeDeps`, and writes a matching `paths` entry into the host `tsconfig.json`.

## Importing

```ts
import { composeLibrary } from '@basmilius/vite-preset';
```

## Usage

```ts
// vite-presets.ts
import { composeLibrary } from '@basmilius/vite-preset';

export const myLibrary = composeLibrary({
    name: '@my-org/library',
    alias: '$myLib'
});
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { preset } from '@basmilius/vite-preset';
import { myLibrary } from './vite-presets';

export default defineConfig({
    plugins: [
        preset(),
        myLibrary()
    ]
});
```

After the first `vite dev`/`vite build` the host `tsconfig.json` will gain:

```json
{
    "compilerOptions": {
        "paths": {
            "$myLib/*": ["node_modules/@my-org/library/src/*"]
        }
    }
}
```

## Options

| Option                       | Type                                            | Description                                                                                     |
|------------------------------|-------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `name`                       | `string`                                        | The npm package name to alias. Required.                                                        |
| `alias`                      | `string`                                        | A short alias such as `~flux`. The plugin aliases both `name` and `name/*` and `alias` and `alias/*`. Required. |
| `autoConfigureTsconfig`      | `boolean`                                       | When `false`, only logs a warning instead of writing to `tsconfig.json`. Default: `true`.       |
| `isolated`                   | `false`                                         | Set to `false` to resolve the package via the workspace root `node_modules` (Bun's isolated linker). |
| `sourcesPathGenerator`       | `(name) => string`                              | Override how the absolute source path is computed.                                              |
| `tsAliasPathGenerator`       | `(name) => string`                              | Override how the path written to tsconfig is computed.                                          |

## Returns

`() => Plugin` — calling the returned factory yields a Vite plugin to register.

## Type signature

```ts
declare function composeLibrary(options: Options): () => Plugin;

type Options = {
    readonly alias: string;
    readonly autoConfigureTsconfig?: boolean;
    readonly isolated?: false;
    readonly name: string;
    readonly sourcesPathGenerator?: (name: string) => string;
    readonly tsAliasPathGenerator?: (name: string) => string;
};
```

## See also

- [`libraries`](/vite-preset/libraries) — pre-composed Flux libraries.
- [`preset`](/vite-preset/preset) — the wider plugin chain you typically pair this with.
