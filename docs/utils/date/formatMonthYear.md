---
outline: deep
---

# formatMonthYear

Formats the month and year of a Luxon `DateTime` as a long localized string.

## Importing

```ts
import { formatMonthYear } from '@basmilius/utils';
```

## Usage

```ts
import { formatMonthYear } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatMonthYear(DateTime.fromISO('2026-04-29'));
// => 'April 2026' (en-US)
// => 'april 2026' (nl-NL)
```

## Parameters

| Name       | Type       | Description                          |
|------------|------------|--------------------------------------|
| `dateTime` | `DateTime` | The Luxon `DateTime` to format.      |

## Returns

`string` — formatted with `month: 'long'`, `year: 'numeric'`.

## Type signature

```ts
declare function formatMonthYear(dateTime: DateTime): string;
```

## See also

- [`formatMonth`](/utils/date/formatMonth)
- [`formatDate`](/utils/date/formatDate)
