---
outline: deep
---

# HTTP Client

A typed HTTP client for TypeScript applications. It pairs a thin `fetch` wrapper with a service layer, an adapter pattern for translating raw JSON into typed DTOs, and a `@dto` decorator that turns plain classes into reactive, cloneable, JSON-serialisable shapes.

## Architecture at a glance

The package is built around four collaborating pieces:

- [`HttpClient`](/http-client/http/HttpClient) — owns the base URL and the optional bearer token. Registered once as a singleton via `HttpClient.register()`.
- [`BaseService`](/http-client/http/BaseService) — base class for endpoint groups. Subclasses expose typed methods that hand back a [`RequestBuilder`](/http-client/http/RequestBuilder).
- [Adapters](/http-client/decorator/adapter) — static-only classes decorated with `@adapter` that translate `ForeignData` (snake_case JSON) into typed DTOs.
- [DTOs](/http-client/decorator/dto) — plain classes decorated with `@dto` that become reactive, cloneable and JSON-serialisable.

## Why a singleton client

`HttpClient.register(client)` registers the application-wide client once. Every [`RequestBuilder`](/http-client/http/RequestBuilder) constructed without an explicit client falls back to `HttpClient.instance`. Services therefore have no constructor and need no plumbing — `new MyService()` is enough.

## Why DTOs

A `@dto` class behaves like a Vue ref under the hood. Reads track, writes trigger, and helpers such as [`isDtoDirty`](/http-client/decorator/dto#isdtodirty) and [`markDtoClean`](/http-client/decorator/dto#markdtoclean) make it trivial to drive forms with optimistic updates. Every DTO ships a `clone()`, `fill()` and `toJSON()` method.

DTOs use private fields with a `#` prefix paired with public getter/setter accessors:

```ts
import { dto } from '@basmilius/http-client';

@dto
export class UserDto {
    get id(): string {
        return this.#id;
    }

    set id(value: string) {
        this.#id = value;
    }

    get email(): string {
        return this.#email;
    }

    set email(value: string) {
        this.#email = value;
    }

    #id: string;
    #email: string;

    constructor(id: string, email: string) {
        this.#id = id;
        this.#email = email;
    }
}
```

## Quick example

```ts
import {
    BaseResponse,
    BaseService,
    HttpClient,
    QueryString,
    adapter,
    dto,
    type ForeignData
} from '@basmilius/http-client';

@dto
class UserDto {
    get id(): string {
        return this.#id;
    }

    set id(value: string) {
        this.#id = value;
    }

    get email(): string {
        return this.#email;
    }

    set email(value: string) {
        this.#email = value;
    }

    #id: string;
    #email: string;

    constructor(id: string, email: string) {
        this.#id = id;
        this.#email = email;
    }
}

@adapter
class UserAdapter {
    static parseUser(data: ForeignData): UserDto {
        return new UserDto(data.id, data.email);
    }
}

class UserService extends BaseService {
    async get(id: string): Promise<BaseResponse<UserDto>> {
        return await this
            .request(`/users/${id}`)
            .method('get')
            .queryString(QueryString.builder()
                .append('language', 'nl'))
            .bearerToken()
            .runAdapter(UserAdapter.parseUser);
    }
}

const client = new HttpClient(null, 'https://api.example.com');
HttpClient.register(client);

const userService = new UserService();
const response = await userService.get('user-42');
```

## Where to next

- Follow the [Quick start](/http-client/guide/quickstart) for a minimal end-to-end setup.
- Read the [DTO pattern](/http-client/guide/dto-pattern) guide to understand reactivity, cloning and dirty tracking.
- See [Error handling](/http-client/guide/error-handling) for `RequestError`, `ValidationError` and aborted requests.
- Browse the [Decorators](/http-client/decorator/dto), [DTOs](/http-client/dto/Paginated) and [HTTP](/http-client/http/HttpClient) sections for the full API reference.

## Related packages

- [`@basmilius/common`](/common/) ships [`useService`](/common/composable/useService) and [`useDtoForm`](/common/composable/useDtoForm) — Vue composables that consume the services and DTOs documented here.
