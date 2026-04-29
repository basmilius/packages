---
outline: deep
---

# Installation

`@basmilius/worker` targets the Cloudflare Workers runtime and ships as ESM. Install it alongside [Luxon](https://moment.github.io/luxon/), which is used for `DateTime` parsing in [`queryDate`](/worker/request).

::: code-group

```shell [Bun]
bun add @basmilius/worker luxon
```

```shell [npm]
npm install @basmilius/worker luxon
```

```shell [pnpm]
pnpm add @basmilius/worker luxon
```

```shell [yarn]
yarn add @basmilius/worker luxon
```

:::

## Cloudflare Workers context

The package is designed for the Workers runtime — it relies only on the standard `Request` and `Response` globals plus `URL`. You can deploy a worker entry-point by exporting the value returned by [`createWorker`](/worker/createWorker) as the module's default export:

```ts
// src/index.ts
import { createWorker, json } from '@basmilius/worker';

export default createWorker({
    '/api/health': async () => json({ok: true})
});
```

Pair it with a `wrangler.toml` and you are ready to deploy:

```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-09-01"
```

## TypeScript

The package ships its own declarations. Pair it with the official `@cloudflare/workers-types` to get types for bindings such as `D1Database`, `KVNamespace` and `R2Bucket`:

```shell
bun add -d @cloudflare/workers-types
```

```jsonc
// tsconfig.json
{
    "compilerOptions": {
        "types": ["@cloudflare/workers-types"]
    }
}
```

## Requirements

- A bundler that emits ESM modules (Wrangler does this by default)
- A modern runtime providing `Request`, `Response`, `URL` and `setTimeout` — Cloudflare Workers, Bun, Deno
