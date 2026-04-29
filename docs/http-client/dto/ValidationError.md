---
outline: deep
---

# ValidationError

DTO that represents a structured validation failure. Thrown by every safe runner on [`RequestBuilder`](/http-client/http/RequestBuilder) when the response carries a `code` / `error` / `error_description` envelope plus a nested `errors` object.

`ValidationError` is structurally similar to [`RequestError`](/http-client/dto/RequestError) but does not extend it — it is a separate DTO with its own `errors` and `params` fields.

## Importing

```ts
import { ValidationError } from '@basmilius/http-client';
```

## Constructor

```ts
new ValidationError(
    code: number,
    error: string,
    errorDescription: string,
    errors: Record<string, ValidationError>,
    params: Record<string, string | number | boolean>
)
```

| Argument           | Type                                            | Description                                          |
| ------------------ | ----------------------------------------------- | ---------------------------------------------------- |
| `code`             | `number`                                        | Application-specific numeric code.                   |
| `error`            | `string`                                        | Machine-readable error key.                          |
| `errorDescription` | `string`                                        | Human-readable description.                          |
| `errors`           | `Record<string, ValidationError>`               | Per-field validation errors, possibly nested.        |
| `params`           | `Record<string, string \| number \| boolean>`   | Parameters used by the description (for templating). |

## Properties

- **`code`** — `number`. Read-only.
- **`error`** — `string`. Read-only.
- **`errorDescription`** — `string`. Read-only.
- **`errors`** — `Record<string, ValidationError>`. Read-only. Each entry is itself a `ValidationError` so trees of nested forms (`address.street`, `address.city`) can be rendered without manual reshaping.
- **`params`** — `Record<string, string | number | boolean>`. Read-only. Useful for substitutions in i18n strings.

## Methods

`ValidationError` is decorated with [`@dto`](/http-client/decorator/dto) and inherits `clone()`, `fill()` and `toJSON()`.

## Walking the error tree

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

## Example

```ts
import { isValidationError } from '@basmilius/http-client';

try {
    await userService.create(form);
} catch (error) {
    if (isValidationError(error)) {
        for (const field in error.errors) {
            console.warn(field, error.errors[field].errorDescription);
        }

        return;
    }

    throw error;
}
```

## See also

- [`RequestError`](/http-client/dto/RequestError) — non-validation failures.
- [`HttpAdapter.parseValidationError`](/http-client/adapter/HttpAdapter#parsevalidationerror)
- [Error handling guide](/http-client/guide/error-handling)
- [`isValidationError`](/http-client/http/helpers#isvalidationerror)
