---
outline: deep
---

# @dto

Class decorator that adds reactivity, cloning, filling and serialization to a class. The full reference for the decorator and the helper functions that operate on DTO instances lives on this page.

## Importing

```ts
import { dto } from '@basmilius/http-client';
```

## Usage

DTOs use private fields with a `#` prefix and expose them through getter/setter pairs.

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

const user = new UserDto('user-1', 'a@example.com');
const clone = user.clone();
const json = user.toJSON();
```

## What @dto does

- Walks the prototype chain via [`getPrototypeChain`](/utils/object/) and freezes the descriptor map on the prototype under a private symbol.
- Stores the property names and the class name on the prototype so the helpers can introspect every instance.
- Replaces the class with a `Proxy`. The proxy's `construct` trap returns a `customRef` that proxies the real instance — every property read tracks, every write triggers.
- Registers the class in a global `DTO_CLASS_MAP` keyed by `clazz.name`. [`deserialize`](#deserialize) uses this map to re-hydrate instances by name.
- Adds `clone()`, `fill()` and `toJSON()` to the prototype.
- Overrides `Symbol.hasInstance` so `instance instanceof Clazz` matches via the internal `[NAME]` symbol — proxied instances still pass the check.
- Validates that the parent class is not also decorated with `@dto`, throwing during decoration when the constraint is violated.

## Limitations

- A `@dto` class cannot extend another `@dto` class. The decorator throws an error during validation when a parent class also has a `NAME` symbol on its prototype.
- Properties without a getter/setter pair are invisible to `clone()`, `fill()` and `toJSON()`. Always model fields as private (`#field`) plus matching accessors.
- Do not use the decorator inline inside Vue Single File Components — most SFC pipelines (esbuild) do not support legacy decorators in `<script>` blocks. Define the class in a `.ts` file and import it.

## Type signature

```ts
declare function dto<T extends Constructor>(clazz: T): T;
```

## Helpers

The package exposes a set of helper functions that act on DTO instances. They are exported alongside `dto` from the package root.

```ts
import {
    assertDto,
    cloneDto,
    deserialize,
    executeIfDtoDirtyAndMarkClean,
    isDto,
    isDtoClean,
    isDtoDirty,
    markDtoClean,
    markDtoDirty,
    serialize
} from '@basmilius/http-client';
```

### assertDto

Asserts that a value is a DTO instance. Throws when it is not.

```ts
declare function assertDto(obj: unknown): asserts obj is DtoInstance<never>;
```

```ts
import { assertDto } from '@basmilius/http-client';

function rename(maybeUser: unknown, name: string): void {
    assertDto(maybeUser);
    (maybeUser as UserDto).fullName = name;
}
```

The error message is `@dto assert given object is not a class decorated with @Dto.`

### cloneDto

Clones a DTO. Wraps `instance.clone()` with a built-in [`assertDto`](#assertdto) so the input is checked at runtime.

```ts
declare function cloneDto<T>(obj: T): T;
```

```ts
import { cloneDto } from '@basmilius/http-client';

const draft = cloneDto(user);
```

### isDto

Type guard predicate for DTO instances. Tests for the presence of the internal `NAME` symbol on the prototype.

```ts
declare function isDto(obj: unknown): obj is DtoInstance<unknown>;
```

```ts
if (isDto(value)) {
    value.fill(payload);
}
```

### isDtoClean

Returns `true` when the DTO has not been modified since the last [`markDtoClean`](#markdtoclean) (or its construction). Asserts the input is a DTO.

```ts
declare function isDtoClean(obj: unknown): boolean;
```

### isDtoDirty

Returns `true` when the DTO has been modified since the last [`markDtoClean`](#markdtoclean). Asserts the input is a DTO.

```ts
declare function isDtoDirty(obj: unknown): boolean;
```

### markDtoClean

Marks a DTO clean and recurses into its tracked children, marking each dirty descendant clean as well. Triggers reactivity for the dirty flag, so reactive consumers re-render.

```ts
declare function markDtoClean(obj: unknown): void;
```

### markDtoDirty

Marks a DTO dirty and propagates upwards through the `PARENT` chain — child writes always mark their containing DTO dirty too.

```ts
declare function markDtoDirty(obj: unknown, key?: string | number): void;
```

The internal write traps already call `markDtoDirty` for you, so the helper is mostly useful when synthesising changes from outside the proxy boundary.

### executeIfDtoDirtyAndMarkClean

Asynchronous helper that runs `fn` only when the DTO is dirty and marks it clean once `fn` resolves. Common at the boundary between a form and its persistence layer.

```ts
declare function executeIfDtoDirtyAndMarkClean<T, R = void>(
    obj: T,
    fn: (dto: T & DtoInstance<T>) => Promise<R>
): Promise<void>;
```

```ts
await executeIfDtoDirtyAndMarkClean(user, async (dirty) => {
    await userService.update(dirty);
});
```

If the DTO is clean, `fn` is not called and the helper resolves immediately.

### serialize

Serialises a value (DTO, plain object, array, primitive, Luxon `DateTime`) to a JSON string. Each DTO is tagged with its class name and constructor arguments, so [`deserialize`](#deserialize) can reconstruct the exact graph.

```ts
declare function serialize(obj: unknown): string;
```

```ts
import { serialize } from '@basmilius/http-client';

const json = serialize(user);
localStorage.setItem('user', json);
```

### deserialize

Restores a value previously produced by [`serialize`](#serialize). DTOs are recreated by looking up their class name in the global DTO map, so the originating class must be imported (and therefore registered) in the consuming runtime.

```ts
declare function deserialize(serialized: string): unknown;
```

```ts
import { deserialize } from '@basmilius/http-client';
import { UserDto } from './dto/UserDto';

const restored = deserialize(localStorage.getItem('user') ?? '') as UserDto;
```

When a DTO references the same nested instance multiple times, `deserialize` keeps a per-call cache keyed by the per-instance UUID minted by `serialize`, so the restored graph preserves identity.

## See also

- [DTO pattern guide](/http-client/guide/dto-pattern) — practical walkthrough.
- [`Paginated`](/http-client/dto/Paginated), [`BlobResponse`](/http-client/dto/BlobResponse), [`RequestError`](/http-client/dto/RequestError), [`ValidationError`](/http-client/dto/ValidationError) — the DTOs that ship with the package.
- [`useDtoForm`](/common/composable/useDtoForm) — Vue composable in `@basmilius/common` that drives a DTO through a clone-based form lifecycle.
