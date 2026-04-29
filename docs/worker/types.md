---
outline: deep
---

# Types

Shared TypeScript types exposed by `@basmilius/worker`. Most users only need `Routes<TBindings>` for the routes object passed to [`createWorker`](/worker/createWorker), but the rest are exported in case you want to author your own helpers.

## Importing

```ts
import type {
    Coords,
    Route,
    Routes,
    Worker
} from '@basmilius/worker';
```

## `Worker<TBindings>`

The shape returned by [`createWorker`](/worker/createWorker). Mirrors the Cloudflare Workers `ExportedHandler` interface as far as `fetch` is concerned, so the value is suitable as a module's default export.

```ts
type Worker<TBindings = unknown> = {
    fetch(req: Request, bindings: TBindings): Promise<Response>;
};
```

## `Route<TBindings>`

A single route handler. Receives the incoming `Request` and the worker's bindings, and resolves to a `Response`.

```ts
type Route<TBindings = unknown> = (
    req: Request,
    bindings?: TBindings
) => Promise<Response>;
```

## `Routes<TBindings>`

A flat record mapping a `pathname` (the part after the host and before the query string) to a [`Route<TBindings>`](#route-tbindings).

```ts
type Routes<TBindings = unknown> = Record<string, Route<TBindings>>;
```

Use it to declare your routes outside the `createWorker` call when you want to split them across files:

```ts
import { createWorker, json, type Routes } from '@basmilius/worker';

interface Bindings {
    DB: D1Database;
}

const routes: Routes<Bindings> = {
    '/api/health': async () => json({ok: true}),
    '/api/orders': async (_, bindings) => {
        // ...
        return json({items: []});
    }
};

export default createWorker<Bindings>(routes);
```

## `Coords`

Latitude / longitude pair returned by [`queryPosition`](/worker/request#queryposition).

```ts
type Coords = {
    readonly latitude: number;
    readonly longitude: number;
};
```

## See also

- [`createWorker`](/worker/createWorker)
- [Request helpers](/worker/request)
