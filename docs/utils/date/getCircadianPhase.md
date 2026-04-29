---
outline: deep
---

# getCircadianPhase

Returns a coarse circadian phase label for a `DateTime`. Intended for UIs that adapt to the user's biological rhythm — for example dimming colors during `wind_down` or `sleep`.

## Importing

```ts
import { getCircadianPhase } from '@basmilius/utils';
import type { CircadianPhase } from '@basmilius/utils';
```

## Usage

```ts
import { getCircadianPhase } from '@basmilius/utils';
import { DateTime } from 'luxon';

getCircadianPhase(DateTime.fromObject({ hour: 8 }));  // => 'alert'
getCircadianPhase(DateTime.fromObject({ hour: 14 })); // => 'focused'
getCircadianPhase(DateTime.fromObject({ hour: 20 })); // => 'wind_down'
getCircadianPhase(DateTime.fromObject({ hour: 2 }));  // => 'sleep'
```

## Parameters

| Name   | Type       | Description                       |
|--------|------------|-----------------------------------|
| `date` | `DateTime` | The moment to classify.           |

## Returns

`CircadianPhase` — one of:

- `'alert'` for hours 6 through 9.
- `'focused'` for hours 10 through 17.
- `'wind_down'` for hours 18 through 21.
- `'sleep'` for all other hours.

## Type signature

```ts
type CircadianPhase = 'alert' | 'focused' | 'sleep' | 'wind_down';

declare function getCircadianPhase(date: DateTime): CircadianPhase;
```

## See also

- [`getDayPeriod`](/utils/date/getDayPeriod)
- [`getWorkdayPeriod`](/utils/date/getWorkdayPeriod)
