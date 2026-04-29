---
outline: deep
---

# Paginated

Generic DTO that wraps a list of items together with pagination metadata. Produced by [`RequestBuilder.runPaginatedAdapter`](/http-client/http/RequestBuilder#runpaginatedadapter) and [`HttpAdapter.parsePaginatedAdapter`](/http-client/adapter/HttpAdapter#parsepaginatedadapter).

## Importing

```ts
import { Paginated } from '@basmilius/http-client';
```

## Constructor

```ts
new Paginated<T>(items: T[], page: number, pageSize: number, pages: number, total: number)
```

| Argument   | Type     | Description                              |
| ---------- | -------- | ---------------------------------------- |
| `items`    | `T[]`    | The current page of items.               |
| `page`     | `number` | One-based index of the current page.     |
| `pageSize` | `number` | Maximum items per page.                  |
| `pages`    | `number` | Total number of pages available.         |
| `total`    | `number` | Total number of items across every page. |

## Properties

- **`items`** — `T[]`. Read-only. The items on the current page.
- **`page`** — `number`. Read-only. One-based current page index.
- **`pageSize`** — `number`. Read-only. Maximum number of items per page.
- **`pages`** — `number`. Read-only. Total number of pages.
- **`total`** — `number`. Read-only. Total number of items.

## Methods

`Paginated` is decorated with [`@dto`](/http-client/decorator/dto) and inherits `clone()`, `fill()` and `toJSON()`.

## Example

```ts
import {
    BaseResponse,
    BaseService,
    Paginated,
    QueryString
} from '@basmilius/http-client';
import { UserAdapter } from '../adapter/UserAdapter';
import type { UserDto } from '../dto/UserDto';

class UserService extends BaseService {
    async list(offset: number, limit: number): Promise<BaseResponse<Paginated<UserDto>>> {
        return await this
            .request('/users')
            .method('get')
            .queryString(QueryString.builder()
                .append('offset', offset)
                .append('limit', limit))
            .bearerToken()
            .runPaginatedAdapter(UserAdapter.parseUser);
    }
}

const response = await userService.list(0, 25);
const result = response.data;

console.log(result.items.length, '/', result.total);
```

## Expected envelope

The default adapter expects the following JSON shape:

```json
{
    "items": [],
    "page": 1,
    "page_size": 25,
    "pages": 4,
    "total": 87
}
```

## See also

- [`HttpAdapter.parsePaginatedAdapter`](/http-client/adapter/HttpAdapter#parsepaginatedadapter)
- [`RequestBuilder.runPaginatedAdapter`](/http-client/http/RequestBuilder#runpaginatedadapter)
