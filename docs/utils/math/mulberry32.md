---
outline: deep
---

# mulberry32

Creates a [Mulberry32](https://gist.github.com/tommyettinger/46a3d667d04dab1bd6cba2f4eba0a47c) seeded pseudo random number generator. Mulberry32 is a tiny, fast PRNG with a 2^32 period — perfect for tests, deterministic procedural generation and reproducible animations.

The returned object exposes `next`, `nextBetween` and `fork`. Because the generator is fully seeded, the same seed always produces the same sequence. Use `mulberry32` whenever you need reproducible randomness — never for cryptographic purposes.

## Importing

```ts
import { mulberry32 } from '@basmilius/utils';
import type { Mulberry32 } from '@basmilius/utils';
```

## Usage

```ts
import { mulberry32 } from '@basmilius/utils';

const random = mulberry32(42);

random.next();              // => deterministic 0..1 value
random.nextBetween(10, 20); // => deterministic 10..20 value

// Fork to derive an independent stream that does not advance the parent.
const branch = random.fork();
branch.next();
```

## Parameters

| Name   | Type     | Description                          |
|--------|----------|--------------------------------------|
| `seed` | `number` | Initial 32-bit unsigned integer seed. |

## Returns

`Mulberry32` — an object with the following methods:

| Method                        | Returns      | Description                                                            |
|-------------------------------|--------------|------------------------------------------------------------------------|
| `next()`                      | `number`     | The next pseudo random value in `[0, 1)`.                              |
| `nextBetween(from, to)`       | `number`     | The next value scaled to `[from, to)`.                                 |
| `fork()`                      | `Mulberry32` | A new generator seeded from the current stream.                        |

## Type signature

```ts
type Mulberry32 = {
    fork(): Mulberry32;
    next(): number;
    nextBetween(min: number, max: number): number;
};

declare function mulberry32(seed: number): Mulberry32;
```

## See also

- [`generateStepTicks`](/utils/math/generateStepTicks)
- [`roundStep`](/utils/math/roundStep)
