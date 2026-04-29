---
outline: deep
---

# Constants

`@basmilius/utils` exports a few small constants that are used throughout the codebase. They are typed as literal types (`as const`) so they remain narrow when used in unions or template literals.

## Importing

```ts
import { CHECK, CROSS, MDASH, NDASH, NOOP } from '@basmilius/utils';
```

## `CHECK`

A heavy check mark glyph used for boolean indicators in tables and CLIs.

```ts
const CHECK = '✔';
```

## `CROSS`

A heavy cross glyph, the visual counterpart of [`CHECK`](#check).

```ts
const CROSS = '✘';
```

## `MDASH`

The em dash — wider than [`NDASH`](#ndash). Useful for joining clauses or filling empty cells.

```ts
const MDASH = '—';
```

## `NDASH`

The en dash – typically used for ranges (for example `2024–2025`).

```ts
const NDASH = '–';
```

## `NOOP`

A no-op function that swallows all arguments and returns `undefined`. Handy as a safe default for optional callbacks.

```ts
const NOOP: Function = () => void 0;
```

## Usage

```ts
import { CHECK, CROSS, MDASH, NOOP } from '@basmilius/utils';

const status = (ok: boolean): string => ok ? CHECK : CROSS;

const range = `2024 ${MDASH} 2025`;

function createWidget(onClose: () => void = NOOP): void {
    // onClose is always callable.
}
```
