---
outline: deep
---

# useRouteParam

Returns a `Ref<string | null>` that follows a single route param and falls back to a default whenever the param is missing or empty.

## Importing

```ts
import { useRouteParam } from '@basmilius/routing';
```

## Signature

```ts
declare function useRouteParam(name: string, defaultValue?: string | null): Ref<string | null>;
```

| Argument       | Type             | Description                                                                                                            |
| -------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `name`         | `string`         | Param name to track.                                                                                                   |
| `defaultValue` | `string \| null` | Optional, defaults to `null`. Used whenever the param is missing or evaluates to a falsy string.                      |

## Behaviour

The composable watches the param on [`useRoute`](/routing/composable/useRoute) with `immediate: true`. Every read evaluates `value || defaultValue`, so the fallback applies on initial mount, on subsequent missing values, and on empty-string params.

## Usage

```vue
<script
    setup
    lang="ts">
    import { useRouteParam } from '@basmilius/routing';

    const tab = useRouteParam('tab', 'overview');
</script>

<template>
    <Tab :name="tab"/>
</template>
```

## Notes

- The returned ref is read-only in spirit — the underlying watcher resets the value whenever the route changes. Mutating the ref directly is not propagated back to the URL; use [`useNavigate`](/routing/composable/useNavigate) for that.
- The composable consumes [`useRoute`](/routing/composable/useRoute), so it follows the route override inside background or modal subtrees.

## See also

- [`useRoute`](/routing/composable/useRoute)
- [`useNavigate`](/routing/composable/useNavigate)
