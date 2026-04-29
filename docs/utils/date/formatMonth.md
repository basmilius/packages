---
outline: deep
---

# formatMonth

Formats the month of a Luxon `DateTime` as a long localized name.

## Importing

```ts
import { formatMonth } from '@basmilius/utils';
```

## Usage

```ts
import { formatMonth } from '@basmilius/utils';
import { DateTime } from 'luxon';

formatMonth(DateTime.fromISO('2026-04-29'));
// => 'April' (en-US)
// => 'april' (nl-NL)
```

## Parameters

| Name       | Type       | Description                          |
|------------|------------|--------------------------------------|
| `dateTime` | `DateTime` | The Luxon `DateTime` to format.      |

## Returns

`string` — the long month name formatted with `month: 'long'`.

## Type signature

```ts
declare function formatMonth(dateTime: DateTime): string;
```

## See also

- [`formatMonthYear`](/utils/date/formatMonthYear)
- [`formatDate`](/utils/date/formatDate)
