---
outline: deep
---

# Response helpers

Helpers for assembling a `Response` object that ships with sensible defaults — CORS headers, JSON content-type, and (for `200` responses) caching headers tuned for static-feeling API output.

## Importing

```ts
import {
    error,
    json
} from '@basmilius/worker';
```

## `json`

Build a JSON `Response`. The body is `JSON.stringify`'d, the `Content-Type` is set to `application/json` and `Access-Control-Allow-Origin` defaults to `*`. Custom headers can be merged in.

```ts
import { json } from '@basmilius/worker';

return json({ok: true});

return json({items}, {'X-Total-Count': String(total)});

return json({error: 'forbidden'}, {}, 403);
```

When `status === 200`, three extra headers are appended automatically:

| Header          | Value                                                  |
| --------------- | ------------------------------------------------------ |
| `Cache-Control` | `public, max-age=2628000, immutable`                   |
| `Date`          | Current ISO timestamp                                  |
| `Expires`       | One month into the future, derived from the same date  |

If your endpoint returns dynamic data, switch to a non-`200` status (for example `201`) or set `Cache-Control` explicitly via the headers argument to override the defaults.

### Type signature

```ts
declare function json(
    json: object,
    headers?: Record<string, string>,
    status?: number
): Response;
```

## `error`

Build a JSON error response shaped like:

```json
{
    "code": 406,
    "error": "invalid_value",
    "error_description": "Invalid value for parameter date."
}
```

It is a thin wrapper around [`json`](#json) — the body is hard-coded to `{ code, error, error_description }` and the HTTP status defaults to the value you supply.

```ts
import { error } from '@basmilius/worker';

return error(406, 'invalid_value', 'Invalid value for parameter date.', 406);
```

[`createWorker`](/worker/createWorker) calls `error` directly when it catches a known exception, so you rarely need to build error responses by hand. Reach for it when you want to respond with a custom error code outside the built-in mapping.

### Type signature

```ts
declare function error(
    code: number,
    error: string,
    errorDescription: string,
    status: number
): Response;
```

## See also

- [Request helpers](/worker/request)
- [Errors](/worker/error)
- [`createWorker`](/worker/createWorker)
