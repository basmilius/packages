---
outline: deep
---

# QueryString

Thin fluent wrapper around `URLSearchParams` that is friendly to nullable, boolean and numeric values. Use it via [`RequestBuilder.queryString`](/http-client/http/RequestBuilder#querystring) or build one manually with `QueryString.builder()`.

## Importing

```ts
import { QueryString } from '@basmilius/http-client';
```

## Static factory

### builder

Returns a fresh `QueryString` instance.

```ts
static builder(): QueryString;
```

## Instance methods

### append

Appends a value under `name`. Skips `null` and `undefined` (but keeps `false`). Numbers are stringified in base 10, booleans become `'true'` / `'false'`.

```ts
append(name: string, value: boolean | number | string | null): QueryString;
```

### appendArray

Appends every value in `values` under the same `name`. Returns the builder unchanged when `values` is `null` or `undefined`.

```ts
appendArray(name: string, values: Array<boolean | number | string | null> | null): QueryString;
```

### delete

Removes every entry stored under `name`.

```ts
delete(name: string): QueryString;
```

### get

Returns the first value stored under `name` or `null` when absent.

```ts
get(name: string): string | null;
```

### getAll

Returns every value stored under `name`.

```ts
getAll(name: string): string[];
```

### has

Returns `true` when at least one value is stored under `name`.

```ts
has(name: string): boolean;
```

### set

Stores a single value under `name`, replacing previous values. Same null-handling as [`append`](#append).

```ts
set(name: string, value: boolean | number | string | null): QueryString;
```

### build

Materialises the builder as a query string (without the leading `?`).

```ts
build(): string;
```

## Example

```ts
import { QueryString } from '@basmilius/http-client';

const qs = QueryString.builder()
    .append('language', 'nl')
    .append('offset', 0)
    .append('limit', 25)
    .appendArray('tags', ['vue', 'typescript']);

return await this
    .request('/search')
    .method('get')
    .queryString(qs)
    .bearerToken()
    .run();
```

## Null-handling

- `null` and `undefined` are skipped silently — pass them straight through without filtering at the call site.
- `false` is encoded as `'false'`. Use `null` if you mean "do not include".
- Empty strings are skipped.

## See also

- [`RequestBuilder.queryString`](/http-client/http/RequestBuilder#querystring)
