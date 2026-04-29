---
outline: deep
---

# @bound

Method decorator factory that binds a method to its owning target the first time the decorator runs. Useful when handlers are passed as callbacks or torn off the instance before invocation.

## Importing

```ts
import { bound } from '@basmilius/http-client';
```

## Usage

```ts
import { bound } from '@basmilius/http-client';

class Counter {
    public value = 0;

    @bound()
    public increment(): void {
        this.value += 1;
    }
}

const counter = new Counter();
const increment = counter.increment;

increment();          // works — `this` is bound
counter.value === 1;
```

## What @bound does

`@bound` is a factory: calling `@bound()` returns a method decorator that mutates the descriptor on the prototype:

```ts
export default function () {
    return (target: object, method: string): void => {
        target[method] = target[method].bind(target);
    };
}
```

Because the binding happens on the prototype's descriptor, the decorator is most useful for instance methods that are commonly torn off (event handlers, lifecycle hooks, callbacks passed to libraries that don't preserve `this`).

## When to prefer arrow functions

If the method never needs to live on the prototype (for example, it captures local state via closure), an arrow class field can be a cleaner solution:

```ts
class Counter {
    public increment = (): void => {
        this.value += 1;
    };
}
```

Use `@bound()` when you want the method to remain on the prototype (so it shows up in `getPrototypeChain` and friends) but still be safely detachable.

## Type signature

```ts
declare function bound(): MethodDecorator;
```

## See also

- [`@debounce`](/http-client/decorator/debounce)
- [`@dto`](/http-client/decorator/dto)
