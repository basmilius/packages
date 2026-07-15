---
outline: deep
---

# Installation

`@basmilius/validation` ships as ESM and expects to live next to a Vue 3 application that uses [Flux](https://flux-ui.dev) for its form components. Regle is bundled as a regular dependency; Vue and Flux are peer dependencies. Luxon is an optional peer that is only needed when the [`afterDate`](/validation/rule/afterDate) rule is used.

::: code-group

```shell [Bun]
bun add @basmilius/validation vue @flux-ui/components
```

```shell [npm]
npm install @basmilius/validation vue @flux-ui/components
```

```shell [pnpm]
pnpm add @basmilius/validation vue @flux-ui/components
```

```shell [yarn]
yarn add @basmilius/validation vue @flux-ui/components
```

:::

## Peer dependencies

| Peer                 | Version           | Required |
|----------------------|-------------------|----------|
| `vue`                | `^3.6.0-beta.17`  | Yes      |
| `@flux-ui/components`| `^3.5.0`          | Yes      |
| `luxon`              | `^3.7.2`          | Only for `afterDate` |

## Wiring up i18n

Out of the box every rule produces an English message. To localize messages, register the plugin with your own translate function; see [`createValidation`](/validation/config/createValidation):

```ts
import { createValidation } from '@basmilius/validation';
import { createApp } from 'vue';

const app = createApp(App);

app.use(createValidation({
    t: (key, params) => i18n.global.t(key, params ?? {})
}));
```

Message keys follow the `validator.*` convention, e.g. `validator.required` and `validator.minLength` with a `{min}` parameter. The full list, including a ready-to-paste YAML block for your locale files, lives on the [Message keys](/validation/message-keys) page.
