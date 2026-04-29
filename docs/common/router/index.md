---
outline: deep
---

# Router helpers

Small, focused composables that build on top of `vue-router`. Each helper covers a single concern — reading a parameter, exposing the route meta, scoping a navigation function — and is independent of the others.

## Helpers

- [`useIsView`](/common/router/useIsView) — match the active route against a name with strict or loose comparison
- [`useNamedRoute`](/common/router/useNamedRoute) — provide a depth key for named `<router-view>` and expose the matched route record
- [`useNavigate`](/common/router/useNavigate) — composable wrapper around `router.push` / `router.replace` with support for chained wrappers
- [`useRouteMeta`](/common/router/useRouteMeta) — merge the meta of every matched record into a single object
- [`useRouteNames`](/common/router/useRouteNames) — list the names of every matched record from outermost to innermost
- [`useRouteParam`](/common/router/useRouteParam) — read a single route parameter with a fallback default
- [`useRouteView`](/common/router/useRouteView) — return the component matched by a named view, or `null`

## Looking for more?

[`@basmilius/routing`](/routing/) builds on the same primitives and adds higher-level features such as named modal routing, nested layouts and view scopes. If you need anything beyond these direct wrappers, start there.
