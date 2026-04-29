---
outline: deep
---

# Installation

::: code-group

```shell [Bun]
bun add -d @basmilius/vite-preset
```

```shell [npm]
npm install --save-dev @basmilius/vite-preset
```

```shell [pnpm]
pnpm add -D @basmilius/vite-preset
```

```shell [yarn]
yarn add -D @basmilius/vite-preset
```

:::

## Peer dependency

This package depends on Vite as a peer dependency. Install it alongside if you don't already have it:

```shell
bun add -d vite
```

A modern Vite (`>= 8.0.10`) is required because the preset uses Rolldown-specific options under the hood.

## Usage

In your `vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import { preset } from '@basmilius/vite-preset';

export default defineConfig({
    plugins: [
        preset()
    ]
});
```

For a library build, opt into the library mode and the bundled DTS plugin:

```ts
preset({
    isLibrary: true,
    tsconfigPath: './tsconfig.json'
});
```

See [`preset`](/vite-preset/preset) for all available options.
