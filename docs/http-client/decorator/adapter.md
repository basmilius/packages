---
outline: deep
---

# @adapter

Class decorator that prevents the decorated class from being instantiated. It is a pure marker for static-only utility classes — typically the parsers that translate raw JSON envelopes (`ForeignData`) into typed DTOs.

## Importing

```ts
import { adapter } from '@basmilius/http-client';
```

## Usage

```ts
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

UserAdapter.parseUser(payload); // ok
new UserAdapter();              // throws Error
```

## What @adapter does

The decorator returns a subclass of the target whose constructor throws:

```ts
export default function <T extends Constructor>(Parent: T): T {
    return class extends Parent {
        constructor(...args: any[]) {
            throw new Error('@adapter: cannot create instance of class.');
        }
    } as T;
}
```

Static methods are inherited unchanged, so call sites continue to use the class name. Because the constructor always throws, `new MyAdapter()` becomes a runtime error that surfaces immediately during development.

## Why static-only

Adapter classes act as namespaces for parser functions. They do not own any state, and an instance would be a programming error. Decorating them with `@adapter` formalises that contract:

- Static methods can be passed by reference to [`runAdapter`](/http-client/http/RequestBuilder#runadapter), [`runArrayAdapter`](/http-client/http/RequestBuilder#runarrayadapter) and [`runPaginatedAdapter`](/http-client/http/RequestBuilder#runpaginatedadapter).
- Adapter methods can call into other adapters statically (e.g. `DateTimeAdapter.parseDateTime(data.created_on)`).
- The class name remains available at runtime, which is helpful for stack traces and tooling.

## Composition

Adapters compose through plain function calls. A common pattern is a small `optional` helper that short-circuits on `null` / `undefined`:

```ts
// util/optional.ts
export default function <T, U>(value: U, adapterFn: (value: U) => T): T {
    if (value === undefined || value === null) {
        return null as T;
    }
    return adapterFn(value);
}
```

```ts
@adapter
export class AuthAdapter {
    static parseUserToken(data: ForeignData): UserTokenDto {
        return new UserTokenDto(
            data.token,
            data.type,
            DateTimeAdapter.parseDateTime(data.created_on),
            DateTimeAdapter.parseDateTime(data.expires_on),
            optional(data.user, AuthAdapter.parseUser)
        );
    }

    static parseUser(data: ForeignData): UserDto {
        return new UserDto(
            data.id,
            data.email,
            data.full_name,
            optional(data.picture, FileSystemAdapter.parsePicture)
        );
    }
}
```

`optional` is a consumer-side convention rather than part of the package — it pairs naturally with the adapter pattern.

## Type signature

```ts
declare function adapter<T extends Constructor>(Parent: T): T;
```

## See also

- [`HttpAdapter`](/http-client/adapter/HttpAdapter) — the canonical example shipped with the package.
- [`@dto`](/http-client/decorator/dto) — the other class-level decorator in the package.
- [`runAdapter`](/http-client/http/RequestBuilder#runadapter) — feeds a parsed JSON body through an adapter method.
