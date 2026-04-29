---
outline: deep
---

# runBefore

Build a function decorator that runs a side effect before invoking the wrapped function. Useful as a wrapper for [`useNavigate`](/common/router/useNavigate) or [`useService`](/common/composable/useService) when you need to reset analytics, focus, scroll positions or other transient state on every call.

## Importing

```ts
import { runBefore } from '@basmilius/common';
```

## Usage

```ts
import { runBefore, useNavigate } from '@basmilius/common';

const trackNavigation = runBefore<(fn: any) => any>(() => {
    console.log('navigation start');
});

const {push} = useNavigate(trackNavigation);
```

The factory returns a wrapper that, given a function, returns a new function which calls `before()` first and then forwards the arguments to the original.

## Type signature

```ts
declare function runBefore<T extends Function>(before: () => void): T;
```

## See also

- [`useNavigate`](/common/router/useNavigate)
- [`useService`](/common/composable/useService)
