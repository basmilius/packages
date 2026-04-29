---
outline: deep
---

# Worker

A tiny, opinionated routing primitive for [Cloudflare Workers](https://developers.cloudflare.com/workers/). The package gives you a typed `createWorker(routes)` factory plus a handful of helpers for parsing query parameters, building JSON responses and signalling validation errors.

There are no plugins, no middleware system and no router DSL. Routes are a flat object keyed by `pathname`, and the framework's job is to dispatch the request, catch domain exceptions, and translate them into the correct HTTP status.

## Categories

- [Installation](/worker/installation)
- [`createWorker`](/worker/createWorker) — the entry-point factory
- [Request helpers](/worker/request) — `queryDate`, `queryInteger`, `queryPosition`
- [Response helpers](/worker/response) — `json`, `error`
- [Errors](/worker/error) — `InvalidValueError`, `MissingParameterError`, `NotFoundError`
- [Types](/worker/types) — `Routes<TBindings>`, `Worker<TBindings>`, `Coords`

## Quick example

```ts
import {
    createWorker,
    json,
    queryDate
} from '@basmilius/worker';

interface Bindings {
    DB: D1Database;
}

export default createWorker<Bindings>({
    '/api/echo': async (req, bindings) => {
        const date = queryDate(req, 'date');

        return json({
            ok: true,
            date: date.toISO()
        });
    }
});
```

## Error mapping at a glance

| Thrown                                                              | HTTP status | Error code            |
| ------------------------------------------------------------------- | ----------- | --------------------- |
| [`InvalidValueError`](/worker/error)                                | `406`       | `invalid_value`       |
| [`MissingParameterError`](/worker/error)                            | `400`       | `missing_parameter`   |
| [`NotFoundError`](/worker/error)                                    | `404`       | `not_found`           |
| Anything else                                                       | `500`       | `internal_server_error` |
