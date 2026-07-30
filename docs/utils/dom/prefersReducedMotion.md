---
outline: deep
---

# prefersReducedMotion

Reports whether the user asked for reduced motion through the OS or browser via the `prefers-reduced-motion: reduce` media query. Returns `false` on the server or anywhere `window` is unavailable, so it is safe to call during SSR.

## Importing

```ts
import { prefersReducedMotion } from '@basmilius/utils';
```

## Usage

```ts
import { prefersReducedMotion } from '@basmilius/utils';

const duration = prefersReducedMotion() ? 0 : 300;

element.animate(keyframes, { duration });
```

## Returns

`boolean` `true` when the user requested reduced motion, `false` otherwise (including on the server).

## Type signature

```ts
declare function prefersReducedMotion(): boolean;
```

## See also

- [`useSpring`](/common/composable/useSpring)
