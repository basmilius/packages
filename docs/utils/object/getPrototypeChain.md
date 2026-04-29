---
outline: deep
---

# getPrototypeChain

Walks up the prototype chain of a class and collects all property descriptors that define a `get` or `set` accessor. The `constructor`, `clone` and `toJSON` keys are skipped, and the walk stops at the first prototype with no `name` (which is `Object`'s prototype).

This is the helper that powers DTO-style libraries that want to mirror computed properties from a class hierarchy.

## Importing

```ts
import { getPrototypeChain } from '@basmilius/utils';
import type { Descriptors } from '@basmilius/utils';
```

## Usage

```ts
import { getPrototypeChain } from '@basmilius/utils';

class User {
    constructor(public firstName: string, public lastName: string) {
    }

    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}

const descriptors = getPrototypeChain(User);
// => { fullName: { get: [Function], set: undefined, enumerable: ..., configurable: ... } }
```

## Parameters

| Name  | Type       | Description                       |
|-------|------------|-----------------------------------|
| `obj` | `Function` | The class constructor to inspect. |

## Returns

`Descriptors` — a record of accessor descriptors keyed by property name.

## Type signature

```ts
type Descriptors = Record<string | symbol, TypedPropertyDescriptor<unknown> | PropertyDescriptor>;

declare function getPrototypeChain(obj: Function): Descriptors;
```

## See also

- [`setObjectMethod`](/utils/object/setObjectMethod)
- [`setObjectValue`](/utils/object/setObjectValue)
- [`Descriptors` type](/utils/types#descriptors)
