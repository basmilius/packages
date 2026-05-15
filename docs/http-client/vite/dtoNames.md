---
outline: deep
---

# dtoNames

A Vite plugin that preserves the original class names of `@dto`-decorated classes through minification. Without it, production builds collapse class names to short identifiers (`t`, `e`, …) and the global DTO class map keyed by `clazz.name` breaks — [`deserialize`](/http-client/decorator/dto#deserialize) can no longer reconstruct instances.

## Importing

```ts
import { dtoNames } from '@basmilius/http-client/vite';
```

## Usage

Add the plugin to your `vite.config.ts`. It runs in the `pre` phase so it sees both authored source and the output of TypeScript's legacy decorator transform.

```ts
import { defineConfig } from 'vite';
import { dtoNames } from '@basmilius/http-client/vite';

export default defineConfig({
    plugins: [
        dtoNames()
    ]
});
```

For a different decorator name — for example a custom alias — pass the `decorator` option:

```ts
dtoNames({
    decorator: 'entity'
});
```

## Why this exists

The `@dto` decorator registers each class in a global map keyed by `clazz.name`:

```ts
DTO_CLASS_MAP[clazz.name] = proxied;
```

[`deserialize`](/http-client/decorator/dto#deserialize) and [`cloneDto`](/http-client/decorator/dto#clonedto) look up classes by that exact name. Minifiers (esbuild, terser, oxc) rename identifiers by default, so `clazz.name` in a production bundle is no longer `UserDto` but something like `t`. Persisted DTOs (e.g. in `localStorage`) suddenly fail to hydrate, and `instanceof` checks via the internal `NAME` symbol mismatch.

`dtoNames` patches each decorated class to pin its `name` property to the authored identifier via `Object.defineProperty`, so the minifier can mangle the class binding without touching the runtime name string.

## What it transforms

The plugin matches two shapes — the authored TypeScript source and the output of the legacy decorator transform — and injects a `name` override into each one.

**Authored source.** A class statement preceded by `@dto`:

```ts

@dto
export class UserDto { /* … */
}
```

becomes:

```ts

@dto
export class UserDto {
    static {
        Object.defineProperty(this, 'name', {value: 'UserDto', configurable: true});
    }
    /* … */
}
```

**Compiled (legacy `__decorate`) output.** The pattern emitted by TypeScript with `experimentalDecorators`:

```js
UserDto = __decorate([dto], UserDto);
```

is rewritten to:

```js
Object.defineProperty(UserDto, 'name', {value: 'UserDto', configurable: true}), UserDto = __decorate([dto], UserDto);
```

Either rewrite makes `UserDto.name === 'UserDto'` stable under any subsequent minification pass.

## Options

| Option      | Type                      | Description                                                                                                             |
|-------------|---------------------------|-------------------------------------------------------------------------------------------------------------------------|
| `decorator` | `string`                  | Decorator identifier to match. Default: `'dto'`. Change this when re-exporting `@dto` under a different name.           |
| `filter`    | `(id: string) => boolean` | Predicate that decides which module ids are transformed. Default: any `.js`/`.jsx`/`.ts`/`.tsx` (and `.m*`/`.c*`) file. |

## Returns

`Plugin` — a single Vite plugin. Add it to the `plugins` array.

## Type signature

```ts
declare function dtoNames(options?: Options): Plugin;

type Options = {
    readonly decorator?: string;
    readonly filter?: (id: string) => boolean;
};
```

## See also

- [`@dto`](/http-client/decorator/dto) — the decorator whose class names this plugin preserves.
- [`serialize` / `deserialize`](/http-client/decorator/dto#serialize) — the helpers that rely on `clazz.name` for round-tripping.
- [DTO pattern guide](/http-client/guide/dto-pattern) — practical walkthrough.
