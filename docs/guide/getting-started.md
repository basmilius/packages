---
outline: deep
---

# Getting started

This guide walks you through installing one or more `@basmilius/*` packages into a fresh Vue 3 + Vite project.

## Prerequisites

- Node.js `>= 23` or [Bun](https://bun.sh/) `>= 1.3.11`.
- A Vue 3.6+ project, ideally scaffolded with `bun create vite`.
- TypeScript with `experimentalDecorators` enabled if you plan to use [`@basmilius/http-client`](/http-client/).

## Install your first package

Most consumers start with [`@basmilius/utils`](/utils/) — it has no peer dependencies and works in any TypeScript project.

::: code-group

```shell [Bun]
bun add @basmilius/utils
```

```shell [npm]
npm install @basmilius/utils
```

```shell [pnpm]
pnpm add @basmilius/utils
```

```shell [yarn]
yarn add @basmilius/utils
```

:::

```ts
import { formatDate, hexToRGB } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatDate(DateTime.now()); // localised date string
hexToRGB('#0070f3');         // { r: 0, g: 112, b: 243 }
```

## Common stack

For a Vue 3 SPA that also talks to an HTTP API, the typical install is:

::: code-group

```shell [Bun]
bun add @basmilius/common @basmilius/http-client @basmilius/routing @basmilius/utils
```

```shell [npm]
npm install @basmilius/common @basmilius/http-client @basmilius/routing @basmilius/utils
```

:::

You'll also want the peers:

```shell
bun add vue vue-router pinia luxon
```

## TypeScript configuration

Several packages — most notably `@basmilius/http-client` — rely on stage-2 decorators. Make sure your `tsconfig.json` opts in:

```json
{
    "compilerOptions": {
        "target": "esnext",
        "module": "esnext",
        "moduleResolution": "bundler",
        "strict": true,
        "experimentalDecorators": true,
        "useDefineForClassFields": true,
        "isolatedDeclarations": true
    }
}
```

`isolatedDeclarations` is recommended but optional — it produces faster `.d.ts` emit when paired with [`@basmilius/tools`](/tools/).

## Next steps

- Read each package's **Introduction** page (in the sidebar) for a high-level overview.
- Try the [HTTP client quick start](/http-client/guide/quickstart).
- See [Modal routing](/routing/guide/modal-routing) for a richer UX pattern.
