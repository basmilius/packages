---
outline: deep

cards:
    exports:
        -   title: preset
            code: true
            details: 'The main Vite plugin chain (CSS modules, minification, naming).'
            link: /vite-preset/preset
        -   title: composeLibrary
            code: true
            details: 'Wire a workspace package into the host build.'
            link: /vite-preset/composeLibrary
        -   title: advancedAppChunk
            code: true
            details: 'Chunk splitter that groups files by src/ paths.'
            link: /vite-preset/advancedAppChunk
        -   title: advancedLibraryChunk
            code: true
            details: 'Chunk splitter that groups files by node_modules/ paths.'
            link: /vite-preset/advancedLibraryChunk
        -   title: closeBundle
            code: true
            details: 'Exit the Node process when the bundle finishes (CI).'
            link: /vite-preset/closeBundle
        -   title: Pre-composed libraries
            details: 'flux, fluxApplication, fluxDashboard, fluxStatistics, fluxVisuals.'
            link: /vite-preset/libraries
---

# Vite Preset

An opinionated [Vite](https://vitejs.dev/) preset that bundles the configuration patterns used across personal projects: CSS Modules with mangled / camel / kebab class names, lightning-fast minification, library composition for monorepos, and chunking strategies for both apps and libraries.

## Exports

<LinkCards group="exports"/>

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
