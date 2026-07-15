---
outline: deep
---

# createValidation

A Vue plugin that configures the package once for the whole application: the translate function used for every rule message and, optionally, additional backend constraint mappings. Without configuration, all messages fall back to built-in English texts.

## Importing

```ts
import { createValidation } from '@basmilius/validation';
```

## Usage

```ts
import { createValidation } from '@basmilius/validation';
import { createApp } from 'vue';
import { i18n } from '@/app/i18n';

const app = createApp(App);

app.use(i18n);
app.use(createValidation({
    t: (key, params) => i18n.global.t(key, params ?? {})
}));
```

The translate function receives keys like `validator.minLength` together with named parameters such as `{min: 3}`. Because it is called every time a message renders, locale switches through a reactive i18n instance are picked up automatically.

## Type signature

```ts
declare function createValidation(options?: ValidationOptions): Plugin;

interface ValidationOptions {
    readonly constraints?: Readonly<Record<string, string>>;
    readonly t?: TranslateFunction;
}

type TranslateFunction = (key: string, params?: Record<string, unknown>) => string;
```

## See also

- [configureValidation](/validation/config/configureValidation)
- [Server errors](/validation/server-errors)
