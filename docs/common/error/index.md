---
outline: deep
---

# Errors

A handful of empty `Error` subclasses used as domain markers across the package. They are thrown by helpers such as [`guarded`](/common/util/guarded) and [`unrefAll`](/common/util/unrefAll), and consumed by composables such as [`useService`](/common/composable/useService) and [`useDataTable`](/common/composable/useDataTable).

## Classes

### `ForbiddenException`

Thrown by [`guarded`](/common/util/guarded) when a request rejects with HTTP `403`. Catch it in a global error handler to redirect users to a "no access" screen, or to surface a permission-denied snackbar.

```ts
import { ForbiddenException } from '@basmilius/common';

try {
    await orders.list(0, 25);
} catch (err) {
    if (err instanceof ForbiddenException) {
        // surface permission denied UI
    }
}
```

### `HandledException`

Thrown by [`guarded`](/common/util/guarded) after the `onError` callback ran. Treat it as a sentinel: the error has already been displayed to the user, so the call site can stop propagating without rethrowing or logging again.

```ts
import { guarded, HandledException } from '@basmilius/common';

const safeList = guarded(orders.list, err => snackbar.show(err.message));

try {
    await safeList(0, 25);
} catch (err) {
    if (err instanceof HandledException) {
        return; // already shown
    }
    throw err;
}
```

### `UnauthorizedException`

Thrown by [`guarded`](/common/util/guarded) when the underlying HTTP client reports an unsanctioned request — typically a missing or expired session. Catch it to trigger a re-authentication flow.

### `UnresolvedDependencyException`

Thrown by [`unrefAll`](/common/util/unrefAll) when one of the unwrapped dependencies is falsy. [`useDataTable`](/common/composable/useDataTable) catches this exception silently, which makes the pattern of "skip the fetch until every dep is ready" trivial: just call `unrefAll(...)` at the top of your fetcher.

```ts
import { unrefAll, useDataTable } from '@basmilius/common';

const filterId = ref<number | null>(null);

useDataTable(async (offset, limit) => {
    const [id] = unrefAll(filterId);
    return await orders.list(offset, limit, {filter: id});
}, [filterId]);
```

## See also

- [`guarded`](/common/util/guarded)
- [`unrefAll`](/common/util/unrefAll)
- [`useService`](/common/composable/useService)
- [`useDataTable`](/common/composable/useDataTable)
