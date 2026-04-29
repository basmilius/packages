---
outline: deep
---

# Helpers

Type guard helpers for the error classes thrown by [`RequestBuilder`](/http-client/http/RequestBuilder). The package also exports a typed `HttpStatusCode` union and a typed `HttpMethod` union — see [`type/index.ts`](https://github.com/basmilius/packages/blob/main/packages/http-client/src/type/index.ts) for the source of truth.

## Importing

```ts
import {
    isRequestAborted,
    isRequestError,
    isUnsanctionedRequest,
    isValidationError
} from '@basmilius/http-client';
```

## Functions

### isRequestAborted

Type guard for `RequestAbortedError` — the error type produced when [`RequestBuilder.autoCancel`](/http-client/http/RequestBuilder#autocancel) cancels an in-flight request.

```ts
declare function isRequestAborted(obj: unknown): obj is RequestAbortedError;
```

### isRequestError

Type guard for [`RequestError`](/http-client/dto/RequestError).

```ts
declare function isRequestError(obj: unknown): obj is RequestError;
```

### isUnsanctionedRequest

Returns `true` for `401` and `403`. Accepts both raw status codes and a `RequestError` instance — the function reads `statusCode` automatically when given an error.

```ts
declare function isUnsanctionedRequest(statusCode: unknown): boolean;
```

```ts
import { isUnsanctionedRequest } from '@basmilius/http-client';

isUnsanctionedRequest(401);          // true
isUnsanctionedRequest(403);          // true
isUnsanctionedRequest(404);          // false
isUnsanctionedRequest(requestError); // reads requestError.statusCode
```

### isValidationError

Type guard for [`ValidationError`](/http-client/dto/ValidationError). Note that `ValidationError` is a structural sibling of `RequestError`, so check this guard first when both branches matter.

```ts
declare function isValidationError(obj: unknown): obj is ValidationError;
```

## Example

```ts
import {
    isRequestAborted,
    isRequestError,
    isUnsanctionedRequest,
    isValidationError
} from '@basmilius/http-client';

try {
    await userService.update(user);
} catch (error) {
    if (isRequestAborted(error)) {
        return;
    }

    if (isValidationError(error)) {
        showFieldErrors(error.errors);
        return;
    }

    if (isRequestError(error)) {
        if (isUnsanctionedRequest(error)) {
            redirectToLogin();
            return;
        }

        showToast(error.errorDescription);
        return;
    }

    throw error;
}
```

## Type aliases

The package re-exports the following type-only aliases at the package root:

- `HttpMethod` — lowercase string union for [`RequestBuilder.method`](/http-client/http/RequestBuilder#method).
- `HttpStatusCode` — typed union of every status code the package recognises.
- `ForeignData` — `Record<string, any>`. Used by [`HttpAdapter`](/http-client/adapter/HttpAdapter) parsers and consumer adapters to describe untyped JSON envelopes.
- `DtoInstance<T>` — public type behind decorated DTO classes.

## See also

- [Error handling guide](/http-client/guide/error-handling)
- [`RequestError`](/http-client/dto/RequestError)
- [`ValidationError`](/http-client/dto/ValidationError)
