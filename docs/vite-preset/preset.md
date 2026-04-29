---
outline: deep
---

# preset

The main entry point. Returns an array of Vite plugins that configure CSS Modules, optimisation defaults, asset handling, JSON stringification and a `@` source alias. Optionally adds library-asset and DTS plugins for library builds.

## Importing

```ts
import { preset } from '@basmilius/vite-preset';
```

## Usage

### App build

```ts
import { defineConfig } from 'vite';
import { preset } from '@basmilius/vite-preset';

export default defineConfig({
    plugins: [
        preset({
            cssModules: {
                classNames: 'camel',
                prefix: 'app_'
            },
            fileNames: 'hashes'
        })
    ]
});
```

### Library build

```ts
import { defineConfig } from 'vite';
import { preset } from '@basmilius/vite-preset';

export default defineConfig({
    plugins: [
        preset({
            isLibrary: true,
            cssModules: {
                classNames: 'kebab',
                prefix: 'lib_'
            },
            tsconfigPath: './tsconfig.lib.json'
        })
    ]
});
```

## Options

| Option                          | Type                                              | Description                                                                                  |
|---------------------------------|---------------------------------------------------|----------------------------------------------------------------------------------------------|
| `cssModules.classNames`         | `'mangled' \| 'camel' \| 'kebab'`                 | Strategy for generated class names. Default: `'mangled'` (compact hash-style names).         |
| `cssModules.prefix`             | `string`                                          | String prepended to every generated class name.                                              |
| `cssModules.generateScopedName` | `(name, filename, css) => string`                 | Custom override for class name generation. Replaces the built-in strategies.                 |
| `assetFileNames`                | `string`                                          | Pattern for asset file names; only used when `isLibrary: true`. Default: `[contenthash:8].[ext]`. |
| `fileNames`                     | `'hashes' \| 'actual'`                            | App builds: `'hashes'` produces `[hash].js`, `'actual'` keeps the source name.               |
| `isLibrary`                     | `boolean`                                         | Switch to library mode: disables CSS minification, runs `@laynezh/vite-plugin-lib-assets` and `vite-plugin-dts`. |
| `tsconfigPath`                  | `string`                                          | Forwarded to `vite-plugin-dts`. Required for library builds with non-default tsconfig paths. |

## Returns

`Plugin[]` — an array of Vite plugins. Spread or pass directly into `plugins`.

## Type signature

```ts
declare function preset(options?: Options): Plugin[];

type Options = {
    readonly cssModules?: {
        readonly classNames?: 'mangled' | 'camel' | 'kebab';
        readonly generateScopedName?: (name: string, filename: string, css: string) => string;
        readonly prefix?: string;
    };
    readonly assetFileNames?: string;
    readonly fileNames?: 'hashes' | 'actual';
    readonly isLibrary?: boolean;
    readonly tsconfigPath?: string;
};
```

## See also

- [`composeLibrary`](/vite-preset/composeLibrary) — wire workspace packages into a host build.
- [`advancedAppChunk`](/vite-preset/advancedAppChunk) and [`advancedLibraryChunk`](/vite-preset/advancedLibraryChunk) — chunk splitters that pair well with this preset.
- [`closeBundle`](/vite-preset/closeBundle) — exit Node when the bundle finishes.
