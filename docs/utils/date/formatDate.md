---
outline: deep
---

# formatDate

Formats a Luxon `DateTime` as a long, locale-aware date with year, month and day.

## Importing

```ts
import { formatDate } from '@basmilius/utils';
```

## Usage

```ts
import { formatDate } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatDate(DateTime.fromISO('2026-04-29'));
// => 'April 29, 2026' (en-US)
// => '29 april 2026'  (nl-NL)
```

## Parameters

| Name       | Type       | Description                          |
|------------|------------|--------------------------------------|
| `dateTime` | `DateTime` | The Luxon `DateTime` to format.      |

## Returns

`string` — the date formatted according to the `DateTime`'s locale, using `year: 'numeric'`, `month: 'long'`, `day: 'numeric'`.

## Type signature

```ts
declare function formatDate(dateTime: DateTime): string;
```

## See also

- [`formatDateFull`](/utils/date/formatDateFull)
- [`formatDateTime`](/utils/date/formatDateTime)
- [`formatMonth`](/utils/date/formatMonth)
- [`formatMonthYear`](/utils/date/formatMonthYear)
- [`formatTime`](/utils/date/formatTime)
