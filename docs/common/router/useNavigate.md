---
outline: deep
---

# useNavigate

A composable wrapper around `router.push` and `router.replace` that lets you compose extra behaviour on top of navigation — analytics, confirmations, transition coordination — without scattering `router` calls across components.

## Importing

```ts
import { useNavigate } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useNavigate } from '@basmilius/common';

    const {
        navigate,
        push,
        replace
    } = useNavigate();

    function openOrder(id: number): void {
        push({name: 'orders.detail', params: {id}});
    }
</script>
```

`push` is shorthand for `navigate(to)`, `replace` is shorthand for `navigate(to, true)`. The underlying call returns a `Promise<NavigationFailure | void | undefined>` so you can chain off it.

### Composing wrappers

Pass any number of `Wrap` functions to layer behaviour on top of the base navigator. Each wrapper receives the previous navigator and returns a new one.

```ts
import { useNavigate } from '@basmilius/common';

const withConfirm = (next: typeof import('vue-router').useRouter['push']) => {
    return async (to: any, replace?: boolean) => {
        if (!confirm('Are you sure?')) {
            return;
        }
        return next(to, replace);
    };
};

const {push} = useNavigate(withConfirm);
```

## Type signature

```ts
type To = Omit<RouteLocationRaw, 'replace'>;
type Result = NavigationFailure | void | undefined;
type Navigate = (to: To, replace?: boolean) => Promise<Result>;
type Wrap = (fn: Navigate) => Navigate;

declare function useNavigate(...wrap: Wrap[]): {
    navigate(to: To, replace?: boolean): Promise<Result>;
    push(to: To): Promise<Result>;
    replace(to: To): Promise<Result>;
};
```
