---
outline: deep
---

# isToday

Checks whether a `DateTime` falls on the same calendar day as a reference `DateTime`. The reference is passed in explicitly so the function stays pure and easy to unit test.

## Importing

```ts
import { isToday } from '@basmilius/utils';
```

## Usage

```ts
import { isToday } from '@basmilius/utils';
import { DateTime } from 'luxon';

const today = DateTime.now();

isToday(today, today);                        // => true
isToday(today.minus({ days: 1 }), today);     // => false
isToday(today.set({ hour: 23 }), today);      // => true (same calendar day)
```

## Parameters

| Name       | Type       | Description                                    |
|------------|------------|------------------------------------------------|
| `dateTime` | `DateTime` | The date to test.                              |
| `today`    | `DateTime` | The reference "today" `DateTime`.              |

## Returns

`boolean` — `true` when both moments share the same year, month and day.

## Type signature

```ts
declare function isToday(dateTime: DateTime, today: DateTime): boolean;
```

## See also

- [`formatDate`](/utils/date/formatDate)
