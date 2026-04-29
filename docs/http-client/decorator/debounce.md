---
outline: deep
---

# @debounce

Method decorator factory that debounces invocations of the decorated method. Wraps the original method with [`debounce` from `@basmilius/utils`](/utils/function/) — every call within the interval restarts the timer, only the trailing call runs.

## Importing

```ts
import { debounce } from '@basmilius/http-client';
```

## Usage

```ts
import { debounce } from '@basmilius/http-client';

class Search {
    @debounce(250)
    public query(term: string): void {
        console.log('searching for', term);
    }
}

const search = new Search();

search.query('a');
search.query('ab');
search.query('abc');
// 250ms later -> 'searching for abc'
```

## Parameters

- `interval: number` — debounce interval in milliseconds.

## What @debounce does

The decorator replaces the method's value descriptor with a debounced version bound to the target:

```ts
export default function (interval: number): Function {
    return (target: object, _: string, descriptor: PropertyDescriptor) => {
        descriptor.value = debounce(descriptor.value, interval, target);
    };
}
```

Every call records its arguments, restarts the timer and discards earlier pending calls. The trailing call runs after `interval` ms of silence.

## Notes

- The decorated method does not return a value to the caller — the original return value is dropped because the call may execute later.
- Use [`@bound()`](/http-client/decorator/bound) together with `@debounce` if you need to detach the debounced method without losing its binding.

## Type signature

```ts
declare function debounce(interval: number): MethodDecorator;
```

## See also

- [`@bound`](/http-client/decorator/bound)
- [`debounce` in `@basmilius/utils`](/utils/function/)
