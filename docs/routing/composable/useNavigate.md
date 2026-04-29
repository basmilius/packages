---
outline: deep
---

# useNavigate

Returns a small navigation API (`navigate`, `push`, `replace`) backed by the active router. Optionally accepts middleware that wraps the underlying navigate function — useful for confirmation prompts, telemetry or per-call guards.

## Importing

```ts
import { useNavigate } from '@basmilius/routing';
```

## Signature

```ts
declare function useNavigate(...wrap: Wrap[]): {
    navigate(to: To, replace?: boolean): Promise<NavigationFailure | void | undefined>;
    push(to: To): Promise<NavigationFailure | void | undefined>;
    replace(to: To): Promise<NavigationFailure | void | undefined>;
};

type To = Omit<RouteLocationRaw, 'replace'>;
type Navigate = (to: To, replace?: boolean) => Promise<NavigationFailure | void | undefined>;
type Wrap = (fn: Navigate) => Navigate;
```

`replace` is intentionally stripped from `To` — pass it as the second argument to `navigate` (or call `replace` directly).

## Usage

```vue
<script
    setup
    lang="ts">
    import { useNavigate } from '@basmilius/routing';

    const { push, replace, navigate } = useNavigate();

    function openUser(id: number): void {
        push({ path: `/users/${id}`, modal: true });
    }

    function permalinkUser(id: number): void {
        replace({ path: `/users/${id}` });
    }

    function go(to: { path: string }, replace = false): Promise<unknown> {
        return navigate(to, replace);
    }
</script>
```

## Wrapping the navigate function

Pass any number of `Wrap` functions to compose middleware. Each receives the next `Navigate` and returns a replacement.

```ts
import { useNavigate } from '@basmilius/routing';

const confirmExit: Wrap = (next) => async (to, replace) => {
    if (form.isDirty && !confirm('Discard unsaved changes?')) {
        return;
    }

    return next(to, replace);
};

const { push } = useNavigate(confirmExit);
```

Wraps run in registration order — the first wrap is the outermost layer.

## See also

- [`useRoute`](/routing/composable/useRoute)
- [`RouterLink`](/routing/component/RouterLink)
