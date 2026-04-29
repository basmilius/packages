---
outline: deep
---

# Vite Preset

An opinionated [Vite](https://vitejs.dev/) preset that bundles the configuration patterns used across personal projects: CSS Modules with mangled / camel / kebab class names, lightning-fast minification, library composition for monorepos, and chunking strategies for both apps and libraries.

## Exports

- [`preset`](/vite-preset/preset) — the main Vite plugin chain.
- [`composeLibrary`](/vite-preset/composeLibrary) — produces a Vite plugin that wires a workspace package into the host build.
- [`advancedAppChunk`](/vite-preset/advancedAppChunk) — chunk splitter that groups files by `src/` paths.
- [`advancedLibraryChunk`](/vite-preset/advancedLibraryChunk) — chunk splitter that groups files by `node_modules/` paths.
- [`closeBundle`](/vite-preset/closeBundle) — exits the Node process when the bundle finishes (useful in CI).
- [Pre-composed libraries](/vite-preset/libraries) — `flux`, `fluxApplication`, `fluxDashboard`, `fluxStatistics`.

## Quick example

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import { preset, flux } from '@basmilius/vite-preset';

export default defineConfig({
    plugins: [
        preset({
            cssModules: {
                classNames: 'camel',
                prefix: 'app_'
            },
            fileNames: 'hashes'
        }),
        flux()
    ]
});
```
