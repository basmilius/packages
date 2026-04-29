---
outline: deep
---

# Quick start

This guide walks you through wiring up `@basmilius/http-client` end-to-end: register a client, define a DTO, write an adapter, expose a service and call it.

## 1. Install

```shell
bun add @basmilius/http-client luxon
```

## 2. Register an HttpClient

The client is a singleton. Register it once at app boot.

```ts
// app/http-client.ts
import { HttpClient } from '@basmilius/http-client';

const client = new HttpClient(null, 'https://api.example.com');
HttpClient.register(client);

export function setAuthToken(token: string | null): void {
    client.authToken = token;
}
```

`HttpClient.register()` stores the instance as the global default. Any [`RequestBuilder`](/http-client/http/RequestBuilder) constructed without an explicit client falls back to it.

## 3. Define a DTO

DTOs are plain classes decorated with `@dto`. Use private fields with a `#` prefix and expose them through getter/setter pairs.

```ts
// dto/UserDto.ts
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

    get fullName(): string {
        return this.#fullName;
    }

    set fullName(value: string) {
        this.#fullName = value;
    }

    #id: string;
    #email: string;
    #fullName: string;

    constructor(id: string, email: string, fullName: string) {
        this.#id = id;
        this.#email = email;
        this.#fullName = fullName;
    }
}
```

::: tip
A `@dto` class cannot extend another `@dto` class. Compose by reference, not by inheritance.
:::

## 4. Define an adapter

Adapters translate raw JSON envelopes (`ForeignData`) into typed DTOs. Decorate the class with `@adapter` so the static-only contract is enforced at runtime.

```ts
// adapter/UserAdapter.ts
import { adapter, type ForeignData } from '@basmilius/http-client';
import { UserDto } from '../dto/UserDto';

@adapter
export class UserAdapter {
    static parseUser(data: ForeignData): UserDto {
        return new UserDto(
            data.id,
            data.email,
            data.full_name
        );
    }
}
```

The static methods are passed by reference to [`runAdapter`](/http-client/http/RequestBuilder#runadapter), [`runArrayAdapter`](/http-client/http/RequestBuilder#runarrayadapter) or [`runPaginatedAdapter`](/http-client/http/RequestBuilder#runpaginatedadapter).

## 5. Write a service

`BaseService` exposes a `protected request(path, client?)` factory. Subclass it per resource group and chain the builder methods explicitly — there is no `.get()` / `.post()` shortcut, you call `.method('get')` / `.method('post')`.

```ts
// service/UserService.ts
import {
    BaseResponse,
    BaseService,
    Paginated,
    QueryString
} from '@basmilius/http-client';
import { UserAdapter } from '../adapter/UserAdapter';
import type { UserDto } from '../dto/UserDto';

export class UserService extends BaseService {
    async get(id: string): Promise<BaseResponse<UserDto>> {
        return await this
            .request(`/users/${id}`)
            .method('get')
            .queryString(QueryString.builder()
                .append('language', 'nl'))
            .bearerToken()
            .runAdapter(UserAdapter.parseUser);
    }

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

    async update(user: UserDto): Promise<BaseResponse<UserDto>> {
        return await this
            .request(`/users/${user.id}`)
            .method('patch')
            .body({email: user.email, full_name: user.fullName})
            .bearerToken()
            .runAdapter(UserAdapter.parseUser);
    }
}
```

`BaseService` has no constructor — instantiate it without arguments.

## 6. Use it

```ts
import { UserService } from './service/UserService';

const userService = new UserService();
const response = await userService.get('user-123');

if (response.ok) {
    console.log(response.data.email);
}
```

`runAdapter` resolves with a [`BaseResponse`](/http-client/http/BaseResponse) that exposes `data`, `statusCode`, `headers` and the underlying `Response`.

## 7. Handle errors

Any non-2xx JSON response that matches the `code` / `error` / `error_description` envelope is thrown as either a [`RequestError`](/http-client/dto/RequestError) or a [`ValidationError`](/http-client/dto/ValidationError). Aborted requests surface as [`RequestAbortedError`](/http-client/http/helpers#isrequestaborted).

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

## Where to next

- Learn the [`@dto` pattern](/http-client/guide/dto-pattern) in depth.
- Handle [errors](/http-client/guide/error-handling) gracefully.
- Browse the full [`RequestBuilder` API](/http-client/http/RequestBuilder).
