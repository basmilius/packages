---
outline: deep
---

# BaseResponse

Generic wrapper around a `Response` plus the parsed body. Returned by every safe runner on [`RequestBuilder`](/http-client/http/RequestBuilder) (`run`, `runAdapter`, `runArrayAdapter`, `runEmpty`, `runPaginatedAdapter`, `runData`, `runDataKey`).

## Importing

```ts
import { BaseResponse } from '@basmilius/http-client';
```

## Constructor

```ts
new BaseResponse<T>(data: T, response: Response)
```

| Argument   | Type       | Description                                             |
| ---------- | ---------- | ------------------------------------------------------- |
| `data`     | `T`        | The parsed body (typed by the runner that produced it). |
| `response` | `Response` | The underlying Fetch `Response`.                        |

## Properties

- **`data`** — `T`. Read-only. The parsed body.
- **`headers`** — `Headers`. Read-only. Shorthand for `response.headers`.
- **`ok`** — `boolean`. Read-only. `true` when `statusCode` is between `200` and `299` inclusive.
- **`response`** — `Response`. Read-only. The underlying Fetch `Response`.
- **`statusCode`** — `HttpStatusCode`. Read-only. The numeric HTTP status code.

## Example

```ts
const response = await userService.get('user-1');

if (response.ok) {
    console.log(response.data.email);
    console.log(response.headers.get('etag'));
}
```

## Notes

- The `data` field can be `null` for `204` responses or for `401` / `403` responses without a JSON body — see [`RequestBuilder`](/http-client/http/RequestBuilder) for the full mapping.
- `BaseResponse` is a plain class — it is not decorated with `@dto`. Treat it as a snapshot of the response.

## See also

- [`RequestBuilder`](/http-client/http/RequestBuilder) — the runners that produce `BaseResponse` instances.
- [Helpers](/http-client/http/helpers) — type guard reference.
