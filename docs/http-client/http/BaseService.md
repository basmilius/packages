---
outline: deep
---

# BaseService

Base class for endpoint groups. Subclasses expose typed methods that hand back a [`RequestBuilder`](/http-client/http/RequestBuilder) configured for a single endpoint.

`BaseService` has **no constructor**. Instantiate subclasses without arguments — every request reaches for [`HttpClient.instance`](/http-client/http/HttpClient#instance) at the moment a [`RequestBuilder`](/http-client/http/RequestBuilder) is created, unless an explicit client is passed.

## Importing

```ts
import { BaseService } from '@basmilius/http-client';
```

## Source

```ts
export default class BaseService {
    protected request(path: string, client?: HttpClient): RequestBuilder {
        return new RequestBuilder(path, client);
    }
}
```

## Methods

### request

Protected factory that returns a fresh [`RequestBuilder`](/http-client/http/RequestBuilder) for the given path.

```ts
protected request(path: string, client?: HttpClient): RequestBuilder;
```

| Argument | Type         | Description                                                                                         |
| -------- | ------------ | --------------------------------------------------------------------------------------------------- |
| `path`   | `string`     | Path appended to the client's base URL.                                                             |
| `client` | `HttpClient` | Optional. Falls back to [`HttpClient.instance`](/http-client/http/HttpClient#instance) when omitted. |

## Subclassing

The convention is one service per resource group. Methods describe what the endpoint returns and rely on the builder API to compose query strings, bodies and pagination logic. Use `.method('get' | 'post' | 'put' | 'patch' | 'delete')` explicitly — there is no shorthand.

```ts
import {
    BaseResponse,
    BaseService,
    Paginated,
    QueryString
} from '@basmilius/http-client';
import { BuyerAdapter } from '../adapter/BuyerAdapter';
import type { BuyerDto } from '../dto/BuyerDto';

export class MerchantBuyersService extends BaseService {
    async list(merchantId: string, offset: number, limit: number): Promise<BaseResponse<Paginated<BuyerDto>>> {
        return await this
            .request(`/merchants/${merchantId}/buyers`)
            .method('get')
            .queryString(QueryString.builder()
                .append('language', 'nl')
                .append('offset', offset)
                .append('limit', limit))
            .bearerToken()
            .runPaginatedAdapter(BuyerAdapter.parseBuyer);
    }

    async create(merchantId: string, payload: object): Promise<BaseResponse<BuyerDto>> {
        return await this
            .request(`/merchants/${merchantId}/buyers`)
            .method('post')
            .body(payload)
            .bearerToken()
            .runAdapter(BuyerAdapter.parseBuyer);
    }

    async delete(merchantId: string, buyerId: string): Promise<BaseResponse<never>> {
        return await this
            .request(`/merchants/${merchantId}/buyers/${buyerId}`)
            .method('delete')
            .bearerToken()
            .runEmpty();
    }
}
```

Instantiate without arguments:

```ts
const buyers = new MerchantBuyersService();
const response = await buyers.list(merchantId, 0, 25);
```

## Per-call client overrides

Pass an explicit `HttpClient` when a single call needs to target a different host or token (for example, to talk to a public endpoint while the rest of the service uses an authenticated client):

```ts
class PublicService extends BaseService {
    async config(client: HttpClient) {
        return await this
            .request('/config', client)
            .method('get')
            .run();
    }
}
```

## See also

- [`HttpClient`](/http-client/http/HttpClient) — the singleton client a builder talks to.
- [`RequestBuilder`](/http-client/http/RequestBuilder) — every fluent method available on a request.
- [`useService`](/common/composable/useService) — Vue composable in `@basmilius/common` that manages a service call's loading and error state.
