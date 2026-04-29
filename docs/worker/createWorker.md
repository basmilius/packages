---
outline: deep
---

# createWorker

Build a Cloudflare Worker entry-point from a flat record of routes. The factory returns an object that satisfies the Workers `ExportedHandler` shape — assign it as your module's default export and the runtime will call `fetch(req, bindings)` for every incoming request.

## Importing

```ts
import { createWorker } from '@basmilius/worker';
```

## Usage

```ts
import {
    createWorker,
    json,
    queryDate,
    queryInteger
} from '@basmilius/worker';

interface Bindings {
    DB: D1Database;
}

export default createWorker<Bindings>({
    '/api/echo': async req => {
        const date = queryDate(req, 'date');

        return json({
            ok: true,
            date: date.toISO()
        });
    },
    '/api/orders': async (req, bindings) => {
        const limit = queryInteger(req, 'limit');
        const result = await bindings.DB
            .prepare('select * from orders limit ?')
            .bind(limit)
            .all();

        return json({items: result.results});
    }
});
```

## Routing

Dispatching is exact-match on `pathname` (everything after the host, before the query string). There is no parameter syntax, regex matching or method-aware routing — keep request handling simple, or build your own dispatcher on top.

If no route matches, the worker returns a `404` JSON body identical to throwing [`NotFoundError`](/worker/error).

```json
{
    "code": 404,
    "error": "not_found",
    "error_description": "The requested endpoint could not be found."
}
```

## Error handling

Routes are awaited inside a `.catch` chain. The factory inspects the rejected value and translates known domain exceptions into JSON error responses; everything else becomes `500 internal_server_error`.

| Thrown                                                              | HTTP status | Error code            |
| ------------------------------------------------------------------- | ----------- | --------------------- |
| [`InvalidValueError`](/worker/error)                                | `406`       | `invalid_value`       |
| [`MissingParameterError`](/worker/error)                            | `400`       | `missing_parameter`   |
| [`NotFoundError`](/worker/error)                                    | `404`       | `not_found`           |
| Anything else                                                       | `500`       | `internal_server_error` |

The error description carries the message you supplied to the exception, so something like `throw new NotFoundError('Order not found.')` becomes a `404` with `error_description: 'Order not found.'`.

## Generic bindings

`createWorker<TBindings>` is generic over the Cloudflare bindings object. Routes receive `bindings: TBindings` as their second argument, so the type flows through directly.

```ts
interface Bindings {
    readonly DB: D1Database;
    readonly KV: KVNamespace;
}

export default createWorker<Bindings>({
    '/api/cached': async (_, bindings) => {
        const value = await bindings.KV.get('hello');
        return json({value});
    }
});
```

## Type signature

```ts
declare const createWorker: <TBindings = unknown>(
    routes: Routes<TBindings>
) => Worker<TBindings>;
```

## See also

- [Request helpers](/worker/request)
- [Response helpers](/worker/response)
- [Errors](/worker/error)
- [Types](/worker/types)
