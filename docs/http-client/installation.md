---
outline: deep
---

# Installation

`@basmilius/http-client` is published as ESM only. It uses [Luxon](https://moment.github.io/luxon/) for date (de)serialisation inside the DTO machinery and the bundled `HttpAdapter`.

::: code-group

```shell [Bun]
bun add @basmilius/http-client luxon
```

```shell [npm]
npm install @basmilius/http-client luxon
```

```shell [pnpm]
pnpm add @basmilius/http-client luxon
```

```shell [yarn]
yarn add @basmilius/http-client luxon
```

:::

## Peer dependencies

- `luxon` ^3.x

## TypeScript configuration

DTOs rely on legacy decorator metadata. Enable both flags in your `tsconfig.json` (or the equivalent in your bundler):

```json
{
    "compilerOptions": {
        "experimentalDecorators": true,
        "useDefineForClassFields": false
    }
}
```

Decorator code blocks shown in this documentation are static examples. Avoid using the `@dto`, `@adapter`, `@bound` or `@debounce` decorators directly inside Vue Single File Components — most SFC pipelines (esbuild based) do not support legacy decorators in `<script>` blocks. Define decorated classes in dedicated `.ts` files and import them.

## Register the client

The client is a singleton. Register it once at app boot and every service in your codebase will use it.

```ts
// app/http-client.ts
import { HttpClient } from '@basmilius/http-client';

const client = new HttpClient(null, 'https://api.example.com');
HttpClient.register(client);

export function setAuthToken(token: string | null): void {
    client.authToken = token;
}
```

`HttpClient.instance` returns the registered client and throws when none is registered. A [`RequestBuilder`](/http-client/http/RequestBuilder) constructed without an explicit client falls back to `HttpClient.instance`.

## Importing

All public symbols are named exports from the package root:

```ts
import {
    BaseResponse,
    BaseService,
    HttpClient,
    QueryString,
    RequestBuilder,
    RequestAbortedError,
    BlobResponse,
    Paginated,
    RequestError,
    ValidationError,
    HttpAdapter,
    adapter,
    bound,
    debounce,
    dto,
    assertDto,
    cloneDto,
    isDto,
    isDtoClean,
    isDtoDirty,
    markDtoClean,
    markDtoDirty,
    executeIfDtoDirtyAndMarkClean,
    serialize,
    deserialize,
    isRequestAborted,
    isRequestError,
    isUnsanctionedRequest,
    isValidationError
} from '@basmilius/http-client';
```

Type-only imports are available for `DtoInstance`, `HttpMethod`, `HttpStatusCode` and `ForeignData`:

```ts
import type {
    DtoInstance,
    ForeignData,
    HttpMethod,
    HttpStatusCode
} from '@basmilius/http-client';
```

## Requirements

- Node.js 20+ or Bun 1.x for build pipelines.
- A modern bundler that understands native ESM (Vite, Rollup, esbuild, oxc).
- A runtime that exposes the global `fetch`, `Headers`, `URLSearchParams` and `AbortController` APIs (modern browsers, Node 20+, Bun, Workers).
