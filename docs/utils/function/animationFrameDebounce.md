---
outline: deep
---

# animationFrameDebounce

Wraps a zero-argument callback so repeated calls collapse into a single call on the next animation frame. Each call cancels the previously scheduled frame, so the callback runs at most once per frame. On the server (where `requestAnimationFrame` is unavailable) it returns a no-op and the callback never runs.

## Importing

```ts
import { animationFrameDebounce } from '@basmilius/utils';
```

## Usage

```ts
import { animationFrameDebounce } from '@basmilius/utils';

const render = animationFrameDebounce(() => {
    element.style.transform = `translateY(${window.scrollY}px)`;
});

window.addEventListener('scroll', render);
// Many scroll events, one layout write per frame.
```

## Parameters

| Name | Type | Description |
|------|------|-------------|
| `fn` | `T` | The zero-argument callback to debounce to a single call per animation frame. |

## Returns

`T` a wrapper with the same signature as `fn`. Calling it schedules `fn` on the next animation frame, cancelling any frame scheduled by an earlier call.

## Type signature

```ts
declare function animationFrameDebounce<T extends () => void | Promise<void>>(fn: T): T;
```

## See also

- [`debounce`](/utils/function/debounce)
- [`useSpring`](/common/composable/useSpring)
