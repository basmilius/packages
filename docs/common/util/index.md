---
outline: deep
---

# Utilities

Small standalone helpers used across the package. Each one is a single function with a focused responsibility.

## Helpers

- [`emptyNull`](/common/util/emptyNull) — collapse empty / falsy strings to `null`
- [`generateColorPalette`](/common/util/generateColorPalette) — turn a base hex color into a CSS-variable shade scale via OKLCH
- [`guarded`](/common/util/guarded) — wrap a function with global error handling for HTTP-aware exceptions
- [`onError`](/common/util/onError) — partially-applied [`guarded`](/common/util/guarded) factory that captures an `onError` callback up front
- [`persistentRef`](/common/util/persistentRef) — `Ref<T>` that mirrors `localStorage` with a custom serializer
- [`persistentStringRef`](/common/util/persistentStringRef) — string-flavoured [`persistentRef`](/common/util/persistentRef) with sane defaults for nullable text values
- [`runBefore`](/common/util/runBefore) — decorator that runs a side effect before invoking the wrapped function
- [`unrefAll`](/common/util/unrefAll) — unref many dependencies at once and throw [`UnresolvedDependencyException`](/common/error/) on falsy values
- [`unwrapElement`](/common/util/unwrapElement) — resolve a ref to either an `HTMLElement` or `null`, with `ComponentPublicInstance` support

## See also

- [Errors](/common/error/) — exceptions thrown by these utilities
- [Composables](/common/composable/useClickOutside) — most of these utilities power the composables in the package
