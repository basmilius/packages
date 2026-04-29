---
outline: deep
---

# onError

Partially-applied [`guarded`](/common/util/guarded) factory: bind an `onError` callback up front and reuse the resulting decorator across many service methods or composables.

## Importing

```ts
import { onError } from '@basmilius/common';
```

## Usage

```ts
import { onError, useService } from '@basmilius/common';
import { OrderService } from '@/services/OrderService';
import { snackbar } from '@/lib/snackbar';

const handle = onError<(fn: Function) => Function>(err => {
    snackbar.error(err.message);
});

const orders = useService(OrderService, handle);
```

Because the factory returns a wrapper compatible with `useService`'s `Wrap` signature, you can pass it as one of the `wrap` arguments. Internally it delegates to `guarded(fn, onError)`, so any wrapped function gains the same behaviour — `403` becomes [`ForbiddenException`](/common/error/), unsanctioned requests become [`UnauthorizedException`](/common/error/), and arbitrary errors trigger your callback before being rethrown as [`HandledException`](/common/error/).

## Type signature

```ts
declare function onError<T extends Function>(
    onError: (err: Error) => void
): T;
```

## See also

- [`guarded`](/common/util/guarded)
- [`useService`](/common/composable/useService)
- [Errors](/common/error/)
