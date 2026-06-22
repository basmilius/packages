---
outline: deep
---

# Types

`@basmilius/utils` exports two general purpose types that complement the runtime helpers.

## Importing

```ts
import type { Constructor, Descriptors } from '@basmilius/utils';
```

## `Constructor<T>`

A generic constructor signature. Useful when accepting a class reference as a parameter, for example in mixins or factory helpers.

```ts
export type Constructor<T = {}> = new (...args: any[]) => T;
```

### Example

```ts
import type { Constructor } from '@basmilius/utils';

function withTimestamps<TBase extends Constructor>(Base: TBase) {
    return class extends Base {
        createdAt = new Date();
    };
}
```

## `Descriptors`

A record of property descriptors keyed by property name or symbol. Returned by helpers such as [`getPrototypeChain`](/utils/object/getPrototypeChain).

```ts
export type Descriptors = Record<string | symbol, TypedPropertyDescriptor<unknown> | PropertyDescriptor>;
```

### Example

```ts
import type { Descriptors } from '@basmilius/utils';
import { getPrototypeChain } from '@basmilius/utils';

const descriptors: Descriptors = getPrototypeChain(MyClass);
```

## Domain types

The date helpers return narrow string-literal unions rather than bare strings, so you can
exhaustively `switch` on them. They are exported as type-only aliases alongside the function
that produces them.

| Type             | Returned by                                          |
|------------------|------------------------------------------------------|
| `CircadianPhase` | [`getCircadianPhase`](/utils/date/getCircadianPhase) |
| `DayPeriod`      | [`getDayPeriod`](/utils/date/getDayPeriod)           |
| `WorkdayPeriod`  | [`getWorkdayPeriod`](/utils/date/getWorkdayPeriod)   |
| `Season`         | [`getSeason`](/utils/date/getSeason)                 |
| `SeasonMood`     | [`getSeasonalMood`](/utils/date/getSeasonalMood)     |
| `MoonPhase`      | [`getMoonPhase`](/utils/date/getMoonPhase)           |
| `ZodiacSign`     | [`getZodiacSign`](/utils/date/getZodiacSign)         |

```ts
import { getSeason, type Season } from '@basmilius/utils';
import { DateTime } from 'luxon';

const season: Season = getSeason(DateTime.now());
```

`Mulberry32` describes the seeded PRNG returned by [`mulberry32`](/utils/math/mulberry32).

## See also

- [`getPrototypeChain`](/utils/object/getPrototypeChain)
- [`setObjectMethod`](/utils/object/setObjectMethod)
- [`setObjectValue`](/utils/object/setObjectValue)
