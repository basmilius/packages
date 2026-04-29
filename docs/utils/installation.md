---
outline: deep
---

# Installation

`@basmilius/utils` ships as ESM only and has [Luxon](https://moment.github.io/luxon/) as its single runtime dependency. Install it with the package manager of your choice.

::: code-group

```shell [Bun]
bun add @basmilius/utils luxon
```

```shell [npm]
npm install @basmilius/utils luxon
```

```shell [pnpm]
pnpm add @basmilius/utils luxon
```

```shell [yarn]
yarn add @basmilius/utils luxon
```

:::

## Importing

All utilities are named exports from the package root. The package is fully tree-shakeable, so only the helpers you reference end up in your bundle.

```ts
import { formatDate, hexToRGB, mulberry32 } from '@basmilius/utils';
```

Type-only imports are available for the typed return values that some helpers expose, such as `Mulberry32`, `MoonPhase`, `Season`, `ZodiacSign`, `DayPeriod`, `WorkdayPeriod`, `CircadianPhase` and `SeasonMood`.

```ts
import type { MoonPhase, Season, ZodiacSign } from '@basmilius/utils';
```

## TypeScript

The package is written in TypeScript and ships its own declarations. No additional `@types/*` package is required.

## Requirements

- Node.js 20+ or Bun 1.x
- A modern bundler that understands native ESM (Vite, Rollup, esbuild, oxc, ...).
- DOM-related helpers such as [`viewTransition`](/utils/dom/viewTransition), [`downloadBlob`](/utils/dom/downloadBlob) and [`printHtml`](/utils/dom/printHtml) require a browser environment.
