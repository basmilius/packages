---
outline: deep

props:
    -   name: to
        description: The target route. Same shape as vue-router's RouterLink.
        type: 'string | RouteLocationRaw'
    -   name: replace
        description: Replace the current history entry instead of pushing a new one.
        type: boolean
        default: 'false'
        optional: true
    -   name: activeClass
        description: Class applied to the rendered anchor when the route is active.
        type: string
        default: "'router-link-active'"
        optional: true
    -   name: exactActiveClass
        description: Class applied to the rendered anchor when the route is exactly active.
        type: string
        default: "'router-link-exact-active'"
        optional: true
    -   name: ariaCurrentValue
        description: Value used for aria-current when the link is exactly active.
        type: "'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false'"
        default: "'page'"
        optional: true
    -   name: custom
        description: Render only the slot content; the component does not emit its own anchor.
        type: boolean
        default: 'false'
        optional: true
    -   name: modal
        description: Open the target route as a modal. true / 0 opens the deepest record only; a positive number N includes N parent records.
        type: 'boolean | number'
        default: 'false'
        optional: true

slots:
    -   name: default
        description: Slot props are href, route, navigate, isActive and isExactActive.
        type:
            href: 'string'
            route: 'RouteLocation'
            navigate: '(event?: MouseEvent) => Promise<void>'
            isActive: 'boolean'
            isExactActive: 'boolean'
---

# RouterLink

Drop-in replacement for `vue-router`'s `RouterLink`. Adds a `modal` prop so links can open the target route as a modal without bespoke click handlers.

## Importing

```ts
import { RouterLink } from '@basmilius/routing';
```

## Usage

```vue
<template>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink :to="{ path: '/users/42' }" modal>Open user (modal)</RouterLink>
    <RouterLink :to="{ path: '/users/42' }" :modal="1">Open user with parent layout (modal)</RouterLink>
</template>

<script
    setup
    lang="ts">
    import { RouterLink } from '@basmilius/routing';
</script>
```

<FrontmatterDocs/>

## Modal navigation

`modal` is forwarded to `router.push` (or `router.replace` when `replace` is also set) as `RouteLocationOptions.modal`:

- `false` (default) — vanilla navigation.
- `true` / `0` — open as a modal, render only the deepest matched record.
- `<number>` — open as a modal, include `<number>` parent records above the deepest one.

Modifier-clicks (cmd, ctrl, alt, shift, middle-click) skip the modal handling so that the URL still opens in a new tab. Modal routes must therefore be valid stand-alone URLs.

## Custom rendering

Set `custom` to opt out of the default `<a>` rendering and render arbitrary children using the slot props:

```vue
<RouterLink
    v-slot="{ href, navigate, isActive }"
    :to="{ name: 'edit' }"
    custom>
    <button
        :class="{ active: isActive }"
        :data-href="href"
        @click="navigate">
        Edit
    </button>
</RouterLink>
```

## See also

- [`useNavigate`](/routing/composable/useNavigate)
- [`RouterView`](/routing/component/RouterView)
- [`ModalRouterView`](/routing/component/ModalRouterView)
- [Modal routing guide](/routing/guide/modal-routing)
