---
outline: deep
---

# HttpClient

Owns the base URL, the optional bearer token and a `dataField` toggle that controls whether responses are unwrapped from a `data` envelope. `HttpClient` follows a singleton pattern: register one instance at app boot and every [`RequestBuilder`](/http-client/http/RequestBuilder) constructed without an explicit client falls back to it.

## Importing

```ts
import { HttpClient } from '@basmilius/http-client';
```

## Constructor

```ts
new HttpClient(authToken: string | null, baseUrl: string, dataField?: boolean)
```

| Argument    | Type             | Description                                                                                          |
| ----------- | ---------------- | ---------------------------------------------------------------------------------------------------- |
| `authToken` | `string \| null` | Initial bearer token. May be replaced via the `authToken` setter.                                    |
| `baseUrl`   | `string`         | Base URL prepended to every request path.                                                            |
| `dataField` | `boolean`        | When `true`, `RequestBuilder` unwraps `{ data: ... }` envelopes from JSON responses. Defaults to `false`. |

## Instance properties

- **`authToken`** — `string \| null`. Read/write. Used by [`RequestBuilder.bearerToken`](/http-client/http/RequestBuilder#bearertoken) when no explicit token is passed.
- **`baseUrl`** — `string`. Read-only.
- **`dataField`** — `boolean`. Read-only. When `true`, the safe runners on `RequestBuilder` unwrap `data.data` from JSON envelopes.

## Static members

### instance

Returns the registered global instance. Throws when no client has been registered.

```ts
static get instance(): HttpClient;
```

```ts
const client = HttpClient.instance;
```

The error message reads:

> There is currently no HttpClient instance registered. Register one using the HttpClient.register() function.

### register

Registers an `HttpClient` as the global default. Subsequent `HttpClient.instance` reads return the registered client; a `RequestBuilder` constructed without an explicit `client` argument falls back to it.

```ts
static register(client: HttpClient): void;
```

## Example

```ts
import { HttpClient } from '@basmilius/http-client';

const client = new HttpClient(null, 'https://api.example.com');
HttpClient.register(client);

// later, after sign-in
client.authToken = 'eyJhbGciOi...';
```

## Replacing the global

Calling `HttpClient.register` again replaces the global. Mixing two clients in the same runtime is safe as long as services pass an explicit `HttpClient` to `request(path, client)`.

```ts
const adminClient = new HttpClient(adminToken, 'https://admin.api.example.com');

class AdminService extends BaseService {
    async settings() {
        return await this
            .request('/settings', adminClient)
            .method('get')
            .bearerToken()
            .run();
    }
}
```

## The `dataField` envelope

Some backends wrap every JSON response inside a `data` field:

```json
{ "data": { "id": "user-1", "email": "a@example.com" } }
```

Set `dataField` to `true` so that the safe runners on [`RequestBuilder`](/http-client/http/RequestBuilder) unwrap it automatically:

```ts
const client = new HttpClient(null, 'https://api.example.com', true);
HttpClient.register(client);
```

When `dataField` is `false` (the default), the response body is passed through verbatim.

## Notes

- `HttpClient` does not perform any requests itself — it is consumed by [`RequestBuilder`](/http-client/http/RequestBuilder).
- Call `HttpClient.register()` exactly once at app boot. Services have no constructor and rely on `HttpClient.instance` being available.

## See also

- [`BaseService`](/http-client/http/BaseService)
- [`RequestBuilder`](/http-client/http/RequestBuilder)
