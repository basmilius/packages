---
outline: deep
---

# Types

`@basmilius/utils` exports two general purpose types that complement the runtime helpers.

## Importing

```ts
import type { Constructor, Descriptors } from '@basmilius/utils';
```

## `Constructor<T>`

A generic constructor signature. Useful when accepting a class reference as a parameter, for example in mixins or factory helpers.

```ts
export type Constructor<T = {}> = new (...args: any[]) => T;
```

### Example

```ts
import type { Constructor } from '@basmilius/utils';

function withTimestamps<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        createdAt = new Date();
    };
}
```

## `Descriptors`

A record of property descriptors keyed by property name or symbol. Returned by helpers such as [`getPrototypeChain`](/utils/object/getPrototypeChain).

```ts
export type Descriptors = Record<string | symbol, TypedPropertyDescriptor<unknown> | PropertyDescriptor>;
```

### Example

```ts
import type { Descriptors } from '@basmilius/utils';
import { getPrototypeChain } from '@basmilius/utils';

const descriptors: Descriptors = getPrototypeChain(MyClass);
```

## See also

- [`getPrototypeChain`](/utils/object/getPrototypeChain)
- [`setObjectMethod`](/utils/object/setObjectMethod)
- [`setObjectValue`](/utils/object/setObjectValue)
