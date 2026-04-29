---
outline: deep
---

# setObjectMethod

Installs a function on a class' `prototype`, effectively adding a method to every instance of that class. Useful for plugin-style augmentation.

## Importing

```ts
import { setObjectMethod } from '@basmilius/utils';
```

## Usage

```ts
import { setObjectMethod } from '@basmilius/utils';

class Greeter {
    constructor(public name: string) {
    }
}

setObjectMethod(Greeter, 'greet', function (this: Greeter): string {
    return `Hello, ${this.name}`;
});

new Greeter('Ada').greet(); // => 'Hello, Ada'
```

## Parameters

| Name  | Type       | Description                                  |
|-------|------------|----------------------------------------------|
| `obj` | `Function` | The class constructor.                       |
| `key` | `string`   | The method name to assign on the prototype.  |
| `fn`  | `Function` | The function to install.                     |

## Returns

`void` — mutates the class' prototype in place.

## Type signature

```ts
declare function setObjectMethod(obj: Function, key: string, fn: Function): void;
```

## See also

- [`setObjectValue`](/utils/object/setObjectValue)
- [`getPrototypeChain`](/utils/object/getPrototypeChain)
