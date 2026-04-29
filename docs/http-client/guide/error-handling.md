---
outline: deep
---

# Error handling

Every safe runner on [`RequestBuilder`](/http-client/http/RequestBuilder) (`run`, `runAdapter`, `runArrayAdapter`, `runPaginatedAdapter`, `runEmpty`, `runData`, `runDataKey`, `runStatusCode`) feeds the response through a single normaliser. The normaliser maps the most common failure modes onto three error classes.

## Failure modes

| Source                                              | Thrown as                                                       |
| --------------------------------------------------- | --------------------------------------------------------------- |
| JSON body with `code`, `error`, `error_description` | [`RequestError`](/http-client/dto/RequestError)                 |
| Same envelope plus a nested `errors` map            | [`ValidationError`](/http-client/dto/ValidationError)           |
| Non-JSON body on a non-2xx response                 | `RequestError` with code `-1` and key `not_a_json_response`     |
| Aborted request (e.g. via `autoCancel`)             | [`RequestAbortedError`](/http-client/http/helpers#isrequestaborted) |

`401` and `403` responses without a JSON envelope resolve with `BaseResponse(null, response)` rather than throwing, so authentication redirects can be handled at the call site.

## Type guards

The package ships predicate helpers so consumers do not need to compare classes manually:

```ts
import {
    isRequestAborted,
    isRequestError,
    isUnsanctionedRequest,
    isValidationError
} from '@basmilius/http-client';
```

- `isRequestError(value)` — narrows to `RequestError`.
- `isValidationError(value)` — narrows to `ValidationError`. Note that `ValidationError` is a structural sibling of `RequestError`, so check for it first when both branches matter.
- `isRequestAborted(value)` — narrows to `RequestAbortedError`.
- `isUnsanctionedRequest(value)` — `true` for status codes `401` and `403`. Accepts both `RequestError` instances (reads `statusCode`) and raw status codes.

## Recommended pattern

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

## Validation errors

`ValidationError.errors` is a recursive map. Nested objects (for example, `address.street`) appear as nested `ValidationError` instances under their key. Use `errors[field].errorDescription` for leaf messages and recurse into `errors[field].errors` for nested forms.

```ts
import { ValidationError } from '@basmilius/http-client';

function flatten(prefix: string, error: ValidationError, into: Record<string, string>): void {
    if (error.errorDescription) {
        into[prefix || error.error] = error.errorDescription;
    }

    for (const key in error.errors) {
        flatten(prefix ? `${prefix}.${key}` : key, error.errors[key], into);
    }
}
```

## Aborting requests

`RequestBuilder.autoCancel(symbol)` registers an in-flight request under a shared identifier. The next request issued with the same identifier aborts the previous one, which surfaces a `RequestAbortedError` to the awaiter. This is the canonical way to make a search-as-you-type endpoint behave.

```ts
import { QueryString } from '@basmilius/http-client';

const SEARCH_TOKEN = Symbol('search');

await this
    .request('/search')
    .method('get')
    .queryString(QueryString.builder()
        .set('q', term))
    .autoCancel(SEARCH_TOKEN)
    .runArrayAdapter(SearchAdapter.parseResult);
```

For finer control, pass an `AbortSignal` directly via `.signal(controller.signal)` and abort it manually.

## Network failures

`fetch` itself can reject with `TypeError` for offline / DNS errors. Those are not wrapped — let them bubble up, or wrap them at the service boundary if you need a single error shape.

## Related

- [`RequestError`](/http-client/dto/RequestError)
- [`ValidationError`](/http-client/dto/ValidationError)
- [`HttpAdapter`](/http-client/adapter/HttpAdapter) — the parser used to materialise both error types from a JSON envelope.
- [Helpers](/http-client/http/helpers) — type guard reference.
