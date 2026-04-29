---
outline: deep
---

# viewTransition

Wraps the [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). When `document.startViewTransition` is available the helper schedules `fn` inside a transition; otherwise it simply calls `fn()` so your code keeps working in browsers without support.

## Importing

```ts
import { viewTransition } from '@basmilius/utils';
```

## Usage

```ts
import { viewTransition } from '@basmilius/utils';

viewTransition(() => {
    document.documentElement.classList.toggle('dark');
});
```

## Parameters

| Name | Type       | Description                                            |
|------|------------|--------------------------------------------------------|
| `fn` | `Function` | The DOM mutation that should run inside the transition. |

## Returns

`void` — the transition (or fallback) runs synchronously.

## Type signature

```ts
declare function viewTransition(fn: Function): void;
```

## See also

- [`isHtmlElement`](/utils/dom/isHtmlElement)
