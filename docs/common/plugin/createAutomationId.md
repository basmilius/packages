---
outline: deep
---

# createAutomationId

A Vue plugin that tags rendered elements with a `data-aid` attribute, giving end-to-end and
automation tools stable, human-readable selectors without polluting production markup. It installs a
global mixin that stamps every mounted component's name onto its root element, plus a `v-aid`
directive to set an explicit id where the component name is not specific enough.

Because it walks every component on mount, keep it enabled in development (and staging) only. The
plugin itself does not read any environment flag — you decide via the `enabled` option, typically
`import.meta.env.DEV`.

## Importing

```ts
import { createAutomationId } from '@basmilius/common';
```

## Usage

```ts
import { createApp } from 'vue';
import { createAutomationId } from '@basmilius/common';
import App from './App.vue';

const app = createApp(App);

app.use(createAutomationId({
    enabled: import.meta.env.DEV
}));

app.mount('#app');
```

### Automatic ids

Every mounted component gets its own name (`__name` from `<script setup>`, falling back to a manual
`name` option) written to its root element as `data-aid`, unless the element already has one:

```html
<!-- <UserCard> renders as -->
<div data-aid="UserCard">...</div>
```

### Explicit ids with `v-aid`

Use the directive when you need a specific id, for example to distinguish repeated elements:

```vue
<template>
    <button v-aid="'submit-order'">Order</button>
    <button v-aid="`row-${row.id}`">Edit</button>
</template>
```

The value is coerced with `String(...)` and kept in sync on update.

## Parameters

| Name              | Type      | Default | Description                                                              |
|-------------------|-----------|---------|--------------------------------------------------------------------------|
| `options.enabled` | `boolean` | `true`  | When `false`, the plugin installs nothing (no mixin, no directive).      |

## Returns

A Vue `Plugin` to pass to `app.use(...)`.
