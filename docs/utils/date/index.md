---
outline: deep
---

# Date & time

Helpers around [Luxon `DateTime`](https://moment.github.io/luxon/api-docs/index.html#datetime) for locale-aware formatting and time-of-day classifications such as day periods, seasons, moon phases and zodiac signs.

All formatters honour the user's locale via `DateTime.toLocaleString` and the classification helpers expose narrow string-literal return types you can use in your own type unions.

## Formatting

- [`formatDate`](/utils/date/formatDate) — long localized date (year, month, day).
- [`formatDateFull`](/utils/date/formatDateFull) — weekday + day + month, no year.
- [`formatDateTime`](/utils/date/formatDateTime) — long date with `HH:mm` time.
- [`formatMonth`](/utils/date/formatMonth) — long month name.
- [`formatMonthYear`](/utils/date/formatMonthYear) — long month name + year.
- [`formatTime`](/utils/date/formatTime) — `HH:mm` time only.

## Periods

- [`getCircadianPhase`](/utils/date/getCircadianPhase) — biological rhythm phase (alert, focused, sleep, wind down).
- [`getDayPeriod`](/utils/date/getDayPeriod) — coarse part of the day (morning, afternoon, evening, night).
- [`getDayPeriodRange`](/utils/date/getDayPeriodRange) — start and end `DateTime` for a day period.
- [`getWorkdayPeriod`](/utils/date/getWorkdayPeriod) — work, break or off based on weekday and hour.

## Calendar & nature

- [`getMoonPhase`](/utils/date/getMoonPhase) — moon phase for a date using Conway's algorithm.
- [`getSeason`](/utils/date/getSeason) — season for a country and date (hemisphere aware).
- [`getSeasonalMood`](/utils/date/getSeasonalMood) — mood label derived from a season.
- [`getZodiacSign`](/utils/date/getZodiacSign) — Western zodiac sign for a birth date.

## Predicates

- [`isToday`](/utils/date/isToday) — checks whether a `DateTime` refers to the same calendar day as a reference.
