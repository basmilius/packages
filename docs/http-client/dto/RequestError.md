---
outline: deep
---

# RequestError

DTO that represents a structured backend error. Thrown by every safe runner on [`RequestBuilder`](/http-client/http/RequestBuilder) when the response carries a `code` / `error` / `error_description` envelope without nested validation errors.

## Importing

```ts
import { RequestError } from '@basmilius/http-client';
```

## Constructor

```ts
new RequestError(code: number, error: string, errorDescription: string, statusCode: HttpStatusCode)
```

| Argument           | Type             | Description                                  |
| ------------------ | ---------------- | -------------------------------------------- |
| `code`             | `number`         | Application-specific numeric code.           |
| `error`            | `string`         | Machine-readable error key.                  |
| `errorDescription` | `string`         | Human-readable description.                  |
| `statusCode`       | `HttpStatusCode` | The HTTP status code returned by the server. |

## Properties

- **`code`** — `number`. Read-only.
- **`error`** — `string`. Read-only.
- **`errorDescription`** — `string`. Read-only.
- **`statusCode`** — `HttpStatusCode`. Read-only.

## Methods

`RequestError` is decorated with [`@dto`](/http-client/decorator/dto) and inherits `clone()`, `fill()` and `toJSON()`.

## When it is thrown

`RequestBuilder` throws a `RequestError` when:

- The response is JSON and matches the `code` / `error` / `error_description` envelope (without `errors`).
- The response is non-JSON and the status is not `2xx` (a synthetic `code: -1, error: 'not_a_json_response'` is constructed).
- [`RequestBuilder.fetchBlob`](/http-client/http/RequestBuilder#fetchblob) receives a non-200 response.

## Example

```ts
import { isRequestError, isUnsanctionedRequest } from '@basmilius/http-client';

try {
    await userService.delete(id);
} catch (error) {
    if (!isRequestError(error)) {
        throw error;
    }

    if (isUnsanctionedRequest(error)) {
        redirectToLogin();
        return;
    }

    showToast(error.errorDescription);
}
```

## See also

- [`ValidationError`](/http-client/dto/ValidationError) — for validation failures.
- [`HttpAdapter.parseRequestError`](/http-client/adapter/HttpAdapter#parserequesterror)
- [Error handling guide](/http-client/guide/error-handling)
- [`isRequestError`](/http-client/http/helpers#isrequesterror)
