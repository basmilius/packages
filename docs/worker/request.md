---
outline: deep
---

# Request helpers

Helpers for reading and validating values from the request URL's query string. Each helper throws an exception that [`createWorker`](/worker/createWorker) translates to a meaningful HTTP error response, so you can keep route handlers free of validation boilerplate.

## Importing

```ts
import {
    queryDate,
    queryInteger,
    queryPosition
} from '@basmilius/worker';
```

## `queryDate`

Read a `yyyy-MM-dd` formatted date from the query string and parse it with Luxon. The default parameter name is `date`.

```ts
import { queryDate } from '@basmilius/worker';

const date = queryDate(req, 'starts_at');
```

| Condition                                  | Result                                                      |
| ------------------------------------------ | ----------------------------------------------------------- |
| Parameter missing                          | Throws [`MissingParameterError`](/worker/error) (`400`)     |
| Parameter present but not `yyyy-MM-dd`     | Throws [`InvalidValueError`](/worker/error) (`406`)         |
| Otherwise                                  | Returns a Luxon `DateTime`                                  |

### Type signature

```ts
declare function queryDate(req: Request, name?: string): DateTime;
```

## `queryInteger`

Read a strictly integer query parameter. Floats, `NaN`, and missing parameters all surface as exceptions.

```ts
import { queryInteger } from '@basmilius/worker';

const limit = queryInteger(req, 'limit');
```

| Condition                                  | Result                                                      |
| ------------------------------------------ | ----------------------------------------------------------- |
| Parameter missing                          | Throws [`MissingParameterError`](/worker/error) (`400`)     |
| Value is `NaN` or non-integer              | Throws [`InvalidValueError`](/worker/error) (`406`)         |
| Otherwise                                  | Returns a `number`                                          |

### Type signature

```ts
declare function queryInteger(req: Request, name: string): number;
```

## `queryPosition`

Read a `latitude` and `longitude` pair from the query string and validate that both are numeric and within their valid ranges (latitude `-90..90`, longitude `-180..180`). Returns a [`Coords`](/worker/types) record.

```ts
import { queryPosition } from '@basmilius/worker';

const coords = queryPosition(req);
console.log(coords.latitude, coords.longitude);
```

| Condition                                                             | Result                                                      |
| --------------------------------------------------------------------- | ----------------------------------------------------------- |
| Either `latitude` or `longitude` missing                              | Throws [`MissingParameterError`](/worker/error) (`400`)     |
| Either value is `NaN`                                                 | Throws [`InvalidValueError`](/worker/error) (`406`)         |
| `latitude < -90` or `latitude > 90`                                   | Throws [`InvalidValueError`](/worker/error) (`406`)         |
| `longitude < -180` or `longitude > 180`                               | Throws [`InvalidValueError`](/worker/error) (`406`)         |
| Otherwise                                                             | Returns `{ latitude, longitude }`                            |

### Type signature

```ts
declare function queryPosition(req: Request): Coords;
```

## See also

- [Response helpers](/worker/response)
- [Errors](/worker/error)
- [`createWorker`](/worker/createWorker)
