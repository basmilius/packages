---
outline: deep
---

# persistentRef

A `Ref<T | null>` that mirrors `localStorage`. The initial value is hydrated from `localStorage` if a serialized value exists, and any subsequent change is written back. Setting the ref to `null` or `undefined` removes the key.

## Importing

```ts
import { persistentRef } from '@basmilius/common';
```

## Usage

```ts
import { persistentRef } from '@basmilius/common';

interface Settings {
    theme: 'light' | 'dark';
    density: 'comfortable' | 'compact';
}

const settings = persistentRef<Settings>('settings', {
    theme: 'light',
    density: 'comfortable'
});

settings.value = {theme: 'dark', density: 'compact'};
```

By default values are serialized with `JSON.stringify` and parsed back with `JSON.parse`. If `JSON.parse` throws (corrupted storage), the key is removed and the ref falls back to `defaultValue`.

Pass custom serializer / deserializer functions to handle non-JSON shapes — see [`persistentStringRef`](/common/util/persistentStringRef) for a worked example.

The watcher uses `{ deep: true }`, so mutating nested properties (`settings.value.theme = 'dark'`) is enough to trigger a write.

## Parameters

| Name           | Type                  | Description                                                                          |
|----------------|-----------------------|--------------------------------------------------------------------------------------|
| `key`          | `string`              | The `localStorage` key to read from and write back to.                               |
| `defaultValue` | `T`                   | Value used when the key is missing or its stored value fails to parse.               |
| `serialize`    | `Serializer<T>`       | Optional. Converts the value to a string. Defaults to `JSON.stringify`.              |
| `deserialize`  | `Deserializer<T>`     | Optional. Parses the stored string back into `T`. Defaults to `JSON.parse`.          |

## Type signature

```ts
type Deserializer<T> = (value: string) => T;
type Serializer<T> = (value: T) => string;

declare function persistentRef<T>(
    key: string,
    defaultValue: T,
    serialize?: Serializer<T>,
    deserialize?: Deserializer<T>
): Ref<T | null>;
```

## See also

- [`persistentStringRef`](/common/util/persistentStringRef)
