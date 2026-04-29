---
outline: deep
---

# useIsView

Returns a reactive boolean that tracks whether the current route matches a given record name. Built on top of [`useRouteNames`](/routing/composable/useRouteNames).

## Importing

```ts
import { useIsView } from '@basmilius/routing';
```

## Signature

```ts
declare function useIsView(name: string, loose?: boolean): ComputedRef<boolean>;
```

| Argument | Type      | Description                                                                                                  |
| -------- | --------- | ------------------------------------------------------------------------------------------------------------ |
| `name`   | `string`  | Route record name to test against.                                                                           |
| `loose`  | `boolean` | Optional, defaults to `false`. When `true`, the test is `startsWith` instead of strict equality on names.    |

## Usage

```vue
<script
    setup
    lang="ts">
    import { useIsView } from '@basmilius/routing';

    const isUser = useIsView('user');
    const isUserSection = useIsView('user.', true);
</script>

<template>
    <nav :class="{ 'nav--user': isUser }">...</nav>
</template>
```

`useIsView('user')` matches a route whose matched chain contains a record literally named `user`. `useIsView('user.', true)` matches every nested record (`user.profile`, `user.settings`).

## Notes

- The composable consumes [`useRouteNames`](/routing/composable/useRouteNames) under the hood, so it sees the same route as [`useRoute`](/routing/composable/useRoute) — including the route override applied inside background or modal subtrees.
- Records without a `name` are skipped by `useRouteNames`, so they cannot be matched here.

## See also

- [`useRouteNames`](/routing/composable/useRouteNames)
- [`useRoute`](/routing/composable/useRoute)
