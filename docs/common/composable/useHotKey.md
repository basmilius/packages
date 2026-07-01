---
outline: deep
---

<script setup lang="ts">
    import UseHotKeyGlobal from './examples/UseHotKeyGlobal.vue';
</script>

# useHotKey

Bind one or more keyboard shortcuts to a single handler. A shortcut is a string such as `'s'`, `'mod+s'` or `'mod+shift+k'`; the `mod` token resolves to `⌘` on macOS and `Ctrl` everywhere else, so a single shortcut covers both platforms. Listens on `window` by default, or on a scoped target. Built on top of [`useEventListener`](/common/composable/useEventListener), so the listener is detached automatically when the component scope is disposed; a `stop` function is returned to detach manually.

## Demo

::: example
example=./examples/UseHotKey.vue
:::

## Importing

```ts
import { useHotKey } from '@basmilius/common';
```

## Usage

```vue
<script setup lang="ts">
    import { useHotKey } from '@basmilius/common';

    useHotKey('mod+s', evt => {
        console.log('save', evt);
    });

    useHotKey(['mod+k', 'mod+shift+k'], () => {
        console.log('open command palette');
    });
</script>
```

Pass a single shortcut or an array of shortcuts that all trigger the same handler. By default the handler is bound to `window`, which is convenient for app-wide shortcuts. Provide a `target` — a template ref, raw `HTMLElement`, `window` or `document` — to scope the shortcut to a specific element.

```vue
<script setup lang="ts">
    import { useTemplateRef } from 'vue';
    import { useHotKey } from '@basmilius/common';

    const dialog = useTemplateRef<HTMLDialogElement>('dialog');

    useHotKey('Escape', close, {target: dialog});
</script>
```

### Modifiers and keys

Combine tokens with `+`. Recognised modifiers are `ctrl`, `meta` (aliases `cmd`/`command`), `shift`, `alt` (aliases `option`/`opt`) and `mod` (`⌘` on macOS, `Ctrl` elsewhere). Modifiers must match exactly, so `'s'` only fires for a bare `S` and never for `⌘S`. Keys are matched case-insensitively against `KeyboardEvent.key`, with aliases for common keys: `esc`, `space`, `up`/`down`/`left`/`right`, `enter`/`return`, `del` and `plus`.

Punctuation, symbol and digit keys already carry their shifted character in `KeyboardEvent.key` — `?` is Shift + `/` — so the Shift state is ignored for them unless you write `shift` explicitly. That means `'?'` matches without spelling it out as `'shift+?'`. Letter keys are matched case-insensitively, so Shift stays a meaningful modifier for them: `'mod+d'` and `'mod+shift+d'` are distinct shortcuts.

### Options

```ts
const stop = useHotKey('mod+s', save, {
    enabled: isEditing,
    preventDefault: true
});

stop();
```

- `target` — where to listen; defaults to `window`.
- `enabled` — a ref or getter to toggle the shortcut without detaching the listener.
- `event` — `'keydown'` (default) or `'keyup'`.
- `preventDefault` — calls `evt.preventDefault()` on a match (default `true`), so `⌘S` won't open the browser save dialog.
- `stopPropagation` — calls `evt.stopPropagation()` on a match (default `false`).
- `ignoreWhileTyping` — ignores matches while an `<input>`, `<textarea>`, `<select>` or contenteditable element is focused (default `true`). Shortcuts that include `ctrl`, `meta` or `mod` keep firing so combinations like `⌘S` still work in a form field.
- `repeat` — fire repeatedly while the key is held down (default `false`).

### Global shortcuts and typing

A shortcut bound to `window` works regardless of which element is focused, which is exactly what you want for app-wide shortcuts. `ignoreWhileTyping` keeps a bare key such as `k` from firing while the user is typing in a form field, and `enabled` lets you switch the shortcut on and off reactively. Try pressing <kbd>K</kbd> below — both on the page and inside the input — and toggle the checkbox:

<ClientOnly>
    <UseHotKeyGlobal/>
</ClientOnly>

```vue
<script setup lang="ts">
    import { ref } from 'vue';
    import { useHotKey } from '@basmilius/common';

    const enabled = ref(true);
    const presses = ref(0);

    useHotKey('k', () => {
        presses.value++;
    }, {
        enabled,
        preventDefault: false
    });
</script>
```

`preventDefault` is set to `false` here so typing the letter `k` elsewhere keeps working; leave it on its default for modifier shortcuts like `⌘S` where you do want to suppress the browser's own action.

### Repeating while held

By default a shortcut fires once per key press, even when the key stays down. Set `repeat` to `true` to keep firing on the browser's auto-repeat — handy for steppers, nudging a value or moving through a list. Click the panel to focus it, then hold <kbd>↑</kbd> and <kbd>↓</kbd> to compare:

::: example
example=./examples/UseHotKeyRepeat.vue
:::

```vue
<script setup lang="ts">
    import { ref } from 'vue';
    import { useHotKey } from '@basmilius/common';

    const value = ref(0);

    useHotKey('up', () => value.value++, {repeat: true});
    useHotKey('down', () => value.value--, {repeat: true});
</script>
```

## Type signature

```ts
type EligibleTarget = HTMLElement | ComponentPublicInstance | Window | Document;

type UseHotKeyOptions = {
    readonly target?: MaybeRefOrGetter<EligibleTarget | null | undefined>;
    readonly enabled?: MaybeRefOrGetter<boolean>;
    readonly event?: 'keydown' | 'keyup';
    readonly preventDefault?: boolean;
    readonly stopPropagation?: boolean;
    readonly ignoreWhileTyping?: boolean;
    readonly repeat?: boolean;
};

declare function useHotKey(
    shortcuts: string | string[],
    handler: (evt: KeyboardEvent) => void,
    options?: UseHotKeyOptions
): () => void;
```

## See also

- [`useEventListener`](/common/composable/useEventListener)
- [`useClickOutside`](/common/composable/useClickOutside)
- [`unwrapTarget`](/common/util/unwrapTarget)
