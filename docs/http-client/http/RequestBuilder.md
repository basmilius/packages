---
outline: deep
---

# RequestBuilder

Fluent builder for a single request. Constructed by [`BaseService.request`](/http-client/http/BaseService#request) — or directly when fine-grained control is required. Every chain method returns the builder so calls can be chained; every runner returns a `Promise`.

The builder seeds itself with `{ cache: 'no-cache', method: 'GET' }` and falls back to [`HttpClient.instance`](/http-client/http/HttpClient#instance) when no client is passed.

## Importing

```ts
import { RequestBuilder } from '@basmilius/http-client';
```

## Constructor

```ts
new RequestBuilder(path: string, client?: HttpClient)
```

| Argument | Type         | Description                                                                                          |
| -------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| `path`   | `string`     | Path appended to the client's base URL.                                                              |
| `client` | `HttpClient` | Optional. Defaults to [`HttpClient.instance`](/http-client/http/HttpClient#instance) when omitted.   |

## Properties

- **`client`** — `HttpClient`. Read-only. The client used when the request runs.
- **`options`** — `RequestInit`. Read-only. The mutable `RequestInit` populated by the fluent setters.
- **`path`** — `string`. Read/write.
- **`query`** — `QueryString | null`. Read/write.

## Configuration methods

Each configuration method returns the builder, so they can be chained. Method order does not matter; the runner is always last.

### method

Sets the HTTP method. Accepts a lowercase `HttpMethod` (`'connect' | 'delete' | 'get' | 'head' | 'options' | 'patch' | 'post' | 'put' | 'trace'`) and uppercases it internally.

```ts
method(method: HttpMethod): RequestBuilder;
```

`.method()` is the only way to set the verb — there is no `.get()` / `.post()` shortcut.

```ts
this
    .request('/users')
    .method('post')
    .body(payload)
    .bearerToken()
    .run();
```

### body

Sets the body. The behaviour depends on the type:

- `FormData` is passed through verbatim and `Content-Type` is **not** set, so the browser computes the multipart boundary.
- `Array` and plain `object` values are JSON-stringified and tagged as `application/json`.
- Anything else is used as-is with the supplied `contentType` (default `application/octet-stream`).

```ts
body(
    body: BodyInit | FormData | object | null,
    contentType?: string | null
): RequestBuilder;
```

```ts
this.request('/files').method('post').body(formData);
this.request('/users').method('post').body({email: 'a@example.com'});
```

### header

Sets a single header.

```ts
header(name: string, value: string): RequestBuilder;
```

### bearerToken

Sets an `Authorization: Bearer ...` header. When `token` is omitted the client's `authToken` is used; if neither is available, an existing `Authorization` header is removed.

```ts
bearerToken(token?: string): RequestBuilder;
```

```ts
this.request('/me').method('get').bearerToken().run();
this.request('/me').method('get').bearerToken(customToken).run();
```

### queryString

Attaches a [`QueryString`](/http-client/http/QueryString) to be appended at execution time.

```ts
queryString(queryString: QueryString): RequestBuilder;
```

```ts
this
    .request('/users')
    .method('get')
    .queryString(QueryString.builder()
        .append('offset', 0)
        .append('limit', 25))
    .run();
```

### signal

Attaches an `AbortSignal` to the request. Pass `null` to detach.

```ts
signal(signal: AbortSignal | null): RequestBuilder;
```

### autoCancel

Registers the request under a shared identifier. The next request issued with the same identifier aborts the previous one (which surfaces as a [`RequestAbortedError`](/http-client/http/helpers#isrequestaborted)).

```ts
autoCancel(identifier: symbol): RequestBuilder;
```

```ts
const SEARCH_TOKEN = Symbol('search');

this
    .request('/search')
    .method('get')
    .queryString(QueryString.builder().set('q', term))
    .autoCancel(SEARCH_TOKEN)
    .runArrayAdapter(SearchAdapter.parseResult);
```

## Runners

The runners execute the configured request and resolve with shaped output. The "safe" runners (`run`, `runAdapter`, `runArrayAdapter`, `runPaginatedAdapter`, `runEmpty`, `runData`, `runDataKey`, `runStatusCode`) feed the response through a single normaliser that maps JSON error envelopes onto [`RequestError`](/http-client/dto/RequestError) / [`ValidationError`](/http-client/dto/ValidationError).

### fetch

Convenience runner that returns the parsed JSON body. No error normalisation, no `BaseResponse` wrapper — for trusted endpoints only.

```ts
fetch<TResult>(): Promise<TResult>;
```

### fetchBlob

Resolves with a [`BlobResponse`](/http-client/dto/BlobResponse) containing the body and a filename derived from the `Content-Disposition` header. Throws a [`RequestError`](/http-client/dto/RequestError) when the status is not `200`.

```ts
fetchBlob(): Promise<BlobResponse>;
```

### run

Executes the request and resolves with `BaseResponse<TResult>`. Maps JSON envelopes to [`RequestError`](/http-client/dto/RequestError) / [`ValidationError`](/http-client/dto/ValidationError). Returns `BaseResponse(null, response)` for `204` responses and unauthenticated responses without a JSON body.

```ts
run<TResult extends {}>(): Promise<BaseResponse<TResult>>;
```

### runAdapter

Same as [`run`](#run) but feeds the parsed `data` through `adapterMethod` before wrapping it in a `BaseResponse`. Use when the response shape needs to be mapped onto a DTO.

```ts
runAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<TResult>>;
```

```ts
this
    .request(`/users/${id}`)
    .method('get')
    .bearerToken()
    .runAdapter(UserAdapter.parseUser);
```

### runArrayAdapter

Convenience over [`runAdapter`](#runadapter) for endpoints that return arrays. Maps every item through `adapterMethod`.

```ts
runArrayAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<TResult[]>>;
```

### runPaginatedAdapter

Wraps [`HttpAdapter.parsePaginatedAdapter`](/http-client/adapter/HttpAdapter#parsepaginatedadapter), so the resolved data is a [`Paginated<TResult>`](/http-client/dto/Paginated) DTO.

```ts
runPaginatedAdapter<TResult extends {}>(adapterMethod: (item: object) => TResult): Promise<BaseResponse<Paginated<TResult>>>;
```

### runEmpty

Runs the request and discards the body, resolving with `BaseResponse<never>`. Suitable for `204` responses or fire-and-forget endpoints.

```ts
runEmpty(): Promise<BaseResponse<never>>;
```

### runData

Returns `BaseResponse<TResult>` with `data` typed as the caller specifies. Useful when the JSON shape is already correct and no adaptation is needed.

```ts
runData<TResult>(): Promise<BaseResponse<TResult>>;
```

### runDataKey

Returns `BaseResponse<TResult[TKey]>` — extracts a single key from the parsed body.

```ts
runDataKey<TResult extends object, TKey extends keyof TResult = keyof TResult>(key: TKey): Promise<BaseResponse<TResult[TKey]>>;
```

### runStatusCode

Resolves with the HTTP status code. The body is read but discarded by the runner.

```ts
runStatusCode(): Promise<HttpStatusCode>;
```

## Example

```ts
import {
    BaseResponse,
    BaseService,
    QueryString
} from '@basmilius/http-client';
import { UserAdapter } from '../adapter/UserAdapter';
import type { UserDto } from '../dto/UserDto';

const SEARCH_TOKEN = Symbol('user-search');

class UserService extends BaseService {
    async search(term: string): Promise<BaseResponse<UserDto[]>> {
        return await this
            .request('/users/search')
            .method('get')
            .queryString(QueryString.builder()
                .set('q', term))
            .autoCancel(SEARCH_TOKEN)
            .bearerToken()
            .runArrayAdapter(UserAdapter.parseUser);
    }
}
```

## Notes

- The `data` field on the resolved `BaseResponse` can be `null` for `204` responses or `401` / `403` responses without a JSON body.
- `runAdapter` and friends throw a synthetic `RequestError(-1, 'not_a_json_response', ..., status)` when the response is not JSON and the status is not `2xx`.
- When the registered `HttpClient` was constructed with `dataField: true`, the runners unwrap `data.data` from the JSON envelope before invoking the adapter.

## See also

- [`HttpClient`](/http-client/http/HttpClient)
- [`BaseService`](/http-client/http/BaseService)
- [`BaseResponse`](/http-client/http/BaseResponse)
- [`QueryString`](/http-client/http/QueryString)
- [`HttpAdapter`](/http-client/adapter/HttpAdapter)
- [Helpers](/http-client/http/helpers)
