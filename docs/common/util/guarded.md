---
outline: deep
---

# guarded

Wrap a function with global error handling so HTTP-aware exceptions are translated to typed domain exceptions and any other error is funneled through a single `onError` hook. Don't combine `guarded` with `try`/`catch` at the call site — let the global handler in your app deal with the typed exceptions.

## Importing

```ts
import { guarded } from '@basmilius/common';
```

## Usage

```ts
import { guarded, useService } from '@basmilius/common';
import { OrderService } from '@/services/OrderService';

const {getOrder} = useService(OrderService);

const safeGetOrder = guarded(getOrder);
const loggedGetOrder = guarded(getOrder, err => console.error(err));
```

`guarded` understands the request-error and unsanctioned-request markers from [`@basmilius/http-client`](/http-client/) and translates them as follows:

| Trigger                                                            | Throws                                                            |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `isRequestError(err) && err.statusCode === 403`                    | [`ForbiddenException`](/common/error/)                            |
| `isUnsanctionedRequest(err)`                                       | [`UnauthorizedException`](/common/error/)                         |
| Any other error, when `onError` is provided                        | [`HandledException`](/common/error/) (after invoking `onError`)   |
| Any other error, without `onError`                                 | The original error is re-thrown                                   |

If a function is already guarded — `guarded` marks the wrapper with an internal symbol — the helper unwraps the original before re-wrapping so you never get double error-handling on the same call.

## Used by

- [`useService`](/common/composable/useService) — wraps every service method by default
- [`onError`](/common/util/onError) — partially-applies `guarded` with a captured `onError` callback

## Type signature

```ts
declare function guarded<T extends Function>(fn: T): T;
declare function guarded<T extends Function>(
    fn: T,
    onError: (err: Error) => void
): T;
```

## See also

- [`onError`](/common/util/onError)
- [`useService`](/common/composable/useService)
- [Errors](/common/error/)
