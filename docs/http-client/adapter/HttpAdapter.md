---
outline: deep
---

# HttpAdapter

A static class with the parsers used internally by [`RequestBuilder`](/http-client/http/RequestBuilder) to translate the standard error / pagination envelopes into DTOs. The class is decorated with [`@adapter`](/http-client/decorator/adapter), so attempting to instantiate it throws.

## Importing

```ts
import { HttpAdapter } from '@basmilius/http-client';
```

## Methods

All methods are static.

### parsePaginatedAdapter

Maps a paginated payload onto a [`Paginated<T>`](/http-client/dto/Paginated) DTO.

```ts
static parsePaginatedAdapter<T>(
    data: ForeignData,
    adapterMethod: (item: object) => T
): Paginated<T>;
```

Expected envelope:

```json
{
    "items": [],
    "page": 1,
    "page_size": 25,
    "pages": 4,
    "total": 87
}
```

`adapterMethod` receives every entry in `items` and returns the materialised model. [`runPaginatedAdapter`](/http-client/http/RequestBuilder#runpaginatedadapter) calls this method for you.

### parseFileNameFromContentDispositionHeader

Extracts a filename from a `Content-Disposition` header. Falls back to a timestamp string of the form `download-yyyy-MM-dd HH-mm-ss` when the header is absent or malformed. Strips quotes and replaces `/` and `:` with `-` for filesystem safety.

```ts
static parseFileNameFromContentDispositionHeader(header: string): string;
```

### parseRequestError

Materialises a [`RequestError`](/http-client/dto/RequestError) from a JSON error envelope:

```json
{ "code": 1234, "error": "not_found", "error_description": "User not found." }
```

```ts
static parseRequestError(data: ForeignData, statusCode: HttpStatusCode): RequestError;
```

### parseValidationError

Recursively materialises a [`ValidationError`](/http-client/dto/ValidationError) — every nested key becomes a nested `ValidationError` so error trees can be rendered as-is.

```ts
static parseValidationError(data: ForeignData): ValidationError;
```

## Custom adapters

`HttpAdapter` is intentionally small. For backend formats that diverge from the conventions above, write a domain-specific adapter and pass its method to [`runAdapter`](/http-client/http/RequestBuilder#runadapter):

```ts
import { adapter, type ForeignData } from '@basmilius/http-client';
import { WidgetDto } from '../dto/WidgetDto';

@adapter
export class WidgetAdapter {
    static parseWidget(data: ForeignData): WidgetDto {
        return new WidgetDto(data.id, data.label);
    }
}

class WidgetService extends BaseService {
    async list() {
        return await this
            .request('/widgets')
            .method('get')
            .bearerToken()
            .runArrayAdapter(WidgetAdapter.parseWidget);
    }
}
```

## See also

- [`@adapter`](/http-client/decorator/adapter)
- [`RequestBuilder`](/http-client/http/RequestBuilder)
- [`RequestError`](/http-client/dto/RequestError)
- [`ValidationError`](/http-client/dto/ValidationError)
- [`Paginated`](/http-client/dto/Paginated)
