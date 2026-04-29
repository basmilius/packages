---
outline: deep
---

# Errors

Domain exceptions used by [`createWorker`](/worker/createWorker) to translate failures into structured HTTP responses. All three classes extend `Error`, accept a constructor argument, and produce a useful `message` automatically.

## Importing

```ts
import {
    InvalidValueError,
    MissingParameterError,
    NotFoundError
} from '@basmilius/worker';
```

## HTTP status mapping

`createWorker` recognises every class on this page. The error response uses the exception's `message` as `error_description`.

| Class                        | HTTP status | Error code            |
| ---------------------------- | ----------- | --------------------- |
| `MissingParameterError`      | `400`       | `missing_parameter`   |
| `NotFoundError`              | `404`       | `not_found`           |
| `InvalidValueError`          | `406`       | `invalid_value`       |
| _(any other thrown value)_   | `500`       | `internal_server_error` |

## `MissingParameterError`

Signal that a required query parameter (or other input) is absent. The constructor takes the parameter name and produces the message `"Missing required parameter <name>."`.

```ts
import { MissingParameterError } from '@basmilius/worker';

throw new MissingParameterError('date');
// -> "Missing required parameter date."
```

Thrown automatically by [`queryDate`](/worker/request#querydate), [`queryInteger`](/worker/request#queryinteger) and [`queryPosition`](/worker/request#queryposition).

### Type signature

```ts
declare class MissingParameterError extends Error {
    constructor(param: string);
}
```

## `InvalidValueError`

Signal that an input was present but malformed. The constructor takes the parameter name and produces the message `"Invalid value for parameter <name>."`.

```ts
import { InvalidValueError } from '@basmilius/worker';

throw new InvalidValueError('latitude');
// -> "Invalid value for parameter latitude."
```

Thrown automatically by [`queryDate`](/worker/request#querydate), [`queryInteger`](/worker/request#queryinteger) and [`queryPosition`](/worker/request#queryposition).

### Type signature

```ts
declare class InvalidValueError extends Error {
    constructor(param: string);
}
```

## `NotFoundError`

Signal that a requested resource does not exist. Unlike the other two errors, this one takes a free-form message that becomes the user-visible `error_description`.

```ts
import { NotFoundError } from '@basmilius/worker';

throw new NotFoundError('Order not found.');
```

### Type signature

```ts
declare class NotFoundError extends Error {
    constructor(message: string);
}
```

## See also

- [`createWorker`](/worker/createWorker)
- [Request helpers](/worker/request)
- [Response helpers](/worker/response)
