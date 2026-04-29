---
outline: deep
---

# DTO pattern

The `@dto` decorator turns a plain class into a reactive, cloneable, JSON-serialisable shape. It is the canonical way to model both request payloads and response bodies in this package.

## Anatomy of a DTO

A DTO uses private fields with a `#` prefix and exposes them through getter/setter pairs. The `@dto` decorator wires reactivity, cloning and serialisation onto the prototype.

```ts
import { dto } from '@basmilius/http-client';
import type { DateTime } from 'luxon';
import type { PictureDto } from './PictureDto';

@dto
export class EventDto {
    get id(): string {
        return this.#id;
    }

    set id(value: string) {
        this.#id = value;
    }

    get startsOn(): DateTime {
        return this.#startsOn;
    }

    set startsOn(value: DateTime) {
        this.#startsOn = value;
    }

    get headerFile(): PictureDto | null {
        return this.#headerFile;
    }

    set headerFile(value: PictureDto | null) {
        this.#headerFile = value;
    }

    #id: string;
    #startsOn: DateTime;
    #headerFile: PictureDto | null;

    constructor(id: string, startsOn: DateTime, headerFile: PictureDto | null) {
        this.#id = id;
        this.#startsOn = startsOn;
        this.#headerFile = headerFile;
    }
}
```

Behind the scenes the decorator:

- Records every property descriptor on the prototype so `clone()` and `fill()` know which keys to copy.
- Wraps the class in a Proxy whose `construct` trap returns a `customRef` that proxies the real instance — every read tracks, every write triggers.
- Registers the class in a global map keyed by `clazz.name` so [`deserialize`](/http-client/decorator/dto#deserialize) can re-hydrate instances by name.
- Adds `clone()`, `fill()` and `toJSON()` to the prototype.

## Why getter/setter pairs

DTOs use private fields with explicit getter/setter pairs because:

- The fields stay encapsulated — they cannot be reassigned directly from the outside, only through the setter that runs through the reactive proxy.
- The accessors live on the prototype, which means `getPrototypeChain` picks them up and the decorator can iterate every property descriptor to drive `clone()` / `fill()` / `toJSON()`.
- Constructor arguments are the canonical "shape" of the DTO. `clone()` re-runs the constructor with the original args, so private fields are filled even when the consumer never calls a setter.

::: warning
Avoid the `public name = ''` shorthand. Bare class fields skip the property descriptor on the prototype and the DTO machinery has nothing to wire reactivity to.
:::

## Reactivity

`@dto` instances react with `customRef` — exactly like a Vue ref but addressable as a regular object. They work inside `computed`, `watch` and templates without manual `.value`.

```ts
import { watch } from 'vue';

const event = new EventDto('event-1', startsOn, null);

watch(() => event.id, (next) => {
    console.log('event id changed', next);
});

event.id = 'event-2';
```

## Cloning

Every DTO ships a `clone()` method. The clone re-runs the constructor with the original arguments and copies every settable property.

```ts
const original = new UserDto('user-1', 'a@example.com', 'Alice');
const draft = original.clone();
draft.fullName = 'Alice II';

console.log(original.fullName); // 'Alice'
console.log(draft.fullName);    // 'Alice II'
```

Use [`cloneDto`](/http-client/decorator/dto#clonedto) when you have a value of unknown shape — it asserts the value is a DTO before calling `clone()`.

## Filling from a payload

`fill()` copies values from a record onto the DTO using its descriptor map. Nested DTOs are filled recursively.

```ts
const user = new UserDto('user-1', 'a@example.com', 'Alice');
user.fill({email: 'b@example.com', fullName: 'Alice II'});
```

`fill()` ignores unknown keys and properties without a setter, so it is safe to feed it raw JSON from an API. In practice, prefer routing JSON through a typed [adapter](/http-client/decorator/adapter) — `fill()` is most useful for in-memory updates from form state.

## Serialisation

`toJSON()` produces a plain object using the descriptor map. Combined with [`serialize`](/http-client/decorator/dto#serialize) and [`deserialize`](/http-client/decorator/dto#deserialize) you can transport DTOs through `localStorage`, history state or `postMessage` boundaries:

```ts
import { serialize, deserialize } from '@basmilius/http-client';

const json = serialize(user);
const restored = deserialize(json) as UserDto;
```

`serialize` retains nested DTOs, Luxon `DateTime` values, arrays and plain objects. `deserialize` rebuilds DTO instances by their class name from the global DTO class map, so the originating class must be imported (and therefore registered) in the consuming runtime.

## Dirty tracking

Forms typically need to know whether something changed. The `@dto` machinery tracks a per-instance `DIRTY` flag that flips on the first write and propagates up through `PARENT` references.

```ts
import {
    isDtoClean,
    isDtoDirty,
    markDtoClean,
    executeIfDtoDirtyAndMarkClean
} from '@basmilius/http-client';

const user = new UserDto('user-1', 'a@example.com', 'Alice');

isDtoDirty(user); // false

user.fullName = 'Alice II';
isDtoDirty(user); // true

await executeIfDtoDirtyAndMarkClean(user, async (dirty) => {
    await userService.update(dirty);
});

isDtoClean(user); // true
```

## Adapter integration

Adapters are the recommended boundary between raw JSON and DTOs. They keep mapping logic out of services and away from the DTO constructor.

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
```

A common pattern is to wrap nullable nested adapters in an `optional` helper:

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
export class UserAdapter {
    static parseUser(data: ForeignData): UserDto {
        return new UserDto(
            data.id,
            data.email,
            data.full_name,
            optional(data.picture, PictureAdapter.parsePicture)
        );
    }
}
```

`optional` and friends are not part of `@basmilius/http-client` — they are conventions consumers tend to copy alongside the adapter pattern.

## Limitations

- A `@dto` class cannot extend another `@dto` class. The decorator throws an error during validation when a parent class also has a `NAME` symbol on its prototype.
- Properties without a getter/setter pair are invisible to `clone()`, `fill()` and `toJSON()`.
- Avoid using the decorator directly inside `<script setup>`. Define the class in a dedicated `.ts` file and import it.

## Related helpers

- [`assertDto`](/http-client/decorator/dto#assertdto) — narrow `unknown` to a DTO instance.
- [`isDto`](/http-client/decorator/dto#isdto) — type guard variant.
- [`cloneDto`](/http-client/decorator/dto#clonedto) — clone with built-in assertion.

## Vue integration

[`@basmilius/common`](/common/) provides composables that build directly on top of DTOs:

- [`useDtoForm`](/common/composable/useDtoForm) — drives a clone-based form lifecycle.
- [`useService`](/common/composable/useService) — request scaffolding around a `BaseService` method.
