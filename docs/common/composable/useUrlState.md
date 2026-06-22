---
outline: deep
---

# useUrlState

Two-way sync between reactive state and the URL query string. Give it a map of refs (or a
reactive object), and every change is written to the query via `router.replace`, while every
navigation — back button, deep link, manual edit — flows back into your refs. Values that equal
their initial value are omitted from the URL, so links stay clean.

`useUrlState` reads `useRoute`/`useRouter` from `vue-router`, so it must be called inside a
component that lives under a router.

## Importing

```ts
import { useUrlState } from '@basmilius/common';
```

## Usage

Pass an object of refs. The keys become query parameters; the initial values define both the
default and the serializer to use.

```vue
<script
    setup
    lang="ts">
    import { ref } from 'vue';
    import { useUrlState } from '@basmilius/common';

    const query = ref('');
    const page = ref(1);
    const archived = ref(false);

    // ?query=hello&page=2&archived=1
    useUrlState({ query, page, archived });
</script>
```

The serializer is inferred from each initial value: `number` ↔ decimal string, `boolean` ↔
`'1'`/`'0'`, everything else as a plain string. When a ref holds its default value the parameter
is removed from the URL entirely.

### Prefixing keys

Use `prefix` to namespace the query keys — handy when several views write to the same URL.

```ts
// ?orders_page=2&orders_query=open
useUrlState({ query, page }, { prefix: 'orders' });
```

### Custom serializers

Provide a per-key serializer for shapes the defaults don't cover (dates, comma-separated
arrays, enums).

```ts
import { ref } from 'vue';
import { useUrlState, type UrlStateSerializer } from '@basmilius/common';
import { DateTime } from 'luxon';

const since = ref(DateTime.now());

const isoDate: UrlStateSerializer = {
    toUrl: value => (value instanceof DateTime ? value.toISODate() : null),
    fromUrl: value => DateTime.fromISO(value).toMillis()
};

useUrlState({ since }, { serializers: { since: isoDate } });
```

A serializer's `toUrl` may return `null` to drop the parameter; `fromUrl` receives the raw
string from the query.

## Options

| Option        | Type                                  | Description                                                                 |
|---------------|---------------------------------------|-----------------------------------------------------------------------------|
| `prefix`      | `string`                              | Optional. Prepended (with `_`) to every query key.                          |
| `serializers` | `Record<string, UrlStateSerializer>`  | Optional. Per-key overrides for the inferred serializer.                    |

## Type signature

```ts
type UrlStatePrimitive = string | number | boolean;
type UrlStateValue = UrlStatePrimitive | null | undefined;

type UrlStateSerializer = {
    toUrl(value: unknown): string | null;
    fromUrl(value: string): UrlStateValue;
};

type UrlStateOptions = {
    readonly prefix?: string;
    readonly serializers?: Record<string, UrlStateSerializer>;
};

type UrlStateInput =
    | Record<string, Ref<UrlStateValue>>
    | Record<string, UrlStateValue>;

declare function useUrlState(state: UrlStateInput, options?: UrlStateOptions): void;
```

## See also

- [`persistentRef`](/common/util/persistentRef) — persist state to `localStorage` instead of the URL
- [`useDataTable`](/common/composable/useDataTable) — pairs naturally with URL-synced pagination
- [`@basmilius/routing`](/routing/) — the full modal-aware router these helpers build on
