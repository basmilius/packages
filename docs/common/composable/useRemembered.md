---
outline: deep
---

# useRemembered

A `ref` whose value is persisted to `localStorage` under `key` (optionally namespaced with a `prefix`) and restored on the next load. Serialization defaults to `JSON.stringify` and `JSON.parse`, both overridable through the options. On the server it is a plain, ephemeral `ref(initialValue)`: the composable guards on `document`, so touching storage never happens outside the browser. Reads and writes are best-effort, so a full or unavailable storage is swallowed rather than thrown.

## Importing

```ts
import { useRemembered } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useRemembered } from '@basmilius/common';

    const theme = useRemembered('theme', 'light');
    const filters = useRemembered('table:filters', {search: '', page: 1}, {
        prefix: 'app:'
    });
</script>

<template>
    <select v-model="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</template>
```

The stored value is read once on init and falls back to `initialValue` when the key is missing or cannot be parsed. Every subsequent change writes back to `localStorage`.

## Options

| Field         | Type                    | Default          | Description                                            |
|---------------|-------------------------|------------------|--------------------------------------------------------|
| `prefix`      | `string`                | `''`             | Prepended to `key` to form the storage key.            |
| `serialize`   | `(value: T) => string`  | `JSON.stringify` | Turns the value into the string written to storage.    |
| `deserialize` | `(value: string) => T`  | `JSON.parse`     | Turns the stored string back into the value.           |

## Type signature

```ts
type UseRememberedOptions<T> = {
    readonly prefix?: string;
    deserialize?(value: string): T;
    serialize?(value: T): string;
};

declare function useRemembered<T>(
    key: string,
    initialValue: T,
    options?: UseRememberedOptions<T>
): Ref<T>;
```
