---
outline: deep
---

# useService

Instantiate a service class extending [`BaseService`](/http-client/http/BaseService) and return a proxy whose every method is wrapped with [`guarded`](/common/util/guarded). Additional `wrap` functions can be passed to chain extra decorators (logging, retry, telemetry, ...).

`useService` discovers methods by walking `serviceClass.prototype` with `Object.getOwnPropertyNames` — every prototype property except `constructor` is included.

## Importing

```ts
import { useService } from '@basmilius/common';
```

## Usage

```ts
import { useService } from '@basmilius/common';
import { OrderService } from '@/services/OrderService';

const orders = useService(OrderService);

await orders.list(0, 25);
await orders.get(123);
```

Add custom wrappers — for example, a logger:

```ts
import { useService } from '@basmilius/common';
import { OrderService } from '@/services/OrderService';

const withLogging = (fn: Function) => {
    return async (...args: unknown[]) => {
        console.time(fn.name);
        try {
            return await fn(...args);
        } finally {
            console.timeEnd(fn.name);
        }
    };
};

const orders = useService(OrderService, withLogging);
```

Wrappers are applied left-to-right — the rightmost wrapper ends up as the outermost call. The base [`guarded`](/common/util/guarded) wrapper is always applied first.

## Why guarded by default?

Service methods typically perform HTTP requests and are vulnerable to authorization errors and aborted requests. Wrapping them with `guarded` translates HTTP `403` responses to a [`ForbiddenException`](/common/error/), unsanctioned requests (cancelled / unauthenticated) to an [`UnauthorizedException`](/common/error/), and lets you supply an `onError` callback that converts arbitrary errors into a [`HandledException`](/common/error/) for centralized error UX.

## Type signature

```ts
type ServiceClass<T extends BaseService> = { new(): T; };
type Wrap = (fn: Function) => Function;

declare function useService<T extends BaseService>(
    serviceClass: ServiceClass<T>,
    ...wrap: Wrap[]
): T;
```

## See also

- [`BaseService`](/http-client/http/BaseService)
- [`guarded`](/common/util/guarded)
- [`onError`](/common/util/onError)
- [Errors](/common/error/)
