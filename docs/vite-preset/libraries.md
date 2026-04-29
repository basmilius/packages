---
outline: deep
---

# Pre-composed libraries

`@basmilius/vite-preset` ships with four `composeLibrary` factories pre-configured for the [Flux](https://github.com/basmilius/flux) ecosystem. Use them when consuming Flux from a workspace.

## Importing

```ts
import { flux, fluxApplication, fluxDashboard, fluxStatistics } from '@basmilius/vite-preset';
```

## Available libraries

| Factory           | Package name              | Alias                |
|-------------------|---------------------------|----------------------|
| `flux`            | `@flux-ui/components`     | `$flux`              |
| `fluxApplication` | `@flux-ui/application`    | `$fluxApplication`   |
| `fluxDashboard`   | `@flux-ui/dashboard`      | `$fluxDashboard`     |
| `fluxStatistics`  | `@flux-ui/statistics`     | `$fluxStatistics`    |

## Usage

```ts
import { defineConfig } from 'vite';
import { flux, fluxApplication, preset } from '@basmilius/vite-preset';

export default defineConfig({
    plugins: [
        preset(),
        flux(),
        fluxApplication()
    ]
});
```

After the first run the host `tsconfig.json` will gain `paths` entries for `$flux/*`, `$fluxApplication/*`, and so on, so you can `import '$flux/button'` directly.

## Roll your own

The factories are thin wrappers around [`composeLibrary`](/vite-preset/composeLibrary). Wrap a workspace package the same way:

```ts
import { composeLibrary } from '@basmilius/vite-preset';

export const myLibrary = composeLibrary({
    name: '@my-org/library',
    alias: '$myLib'
});
```

## See also

- [`composeLibrary`](/vite-preset/composeLibrary) — the underlying factory.
- [`preset`](/vite-preset/preset) — the wider plugin chain.
