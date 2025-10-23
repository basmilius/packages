import type { DateTime } from 'luxon';

export type CircadianPhase =
    | 'alert'
    | 'focused'
    | 'sleep'
    | 'wind_down';

export default function (date: DateTime): CircadianPhase {
    if (date.hour >= 6 && date.hour < 10) return 'alert';
    if (date.hour >= 10 && date.hour < 18) return 'focused';
    if (date.hour >= 18 && date.hour < 22) return 'wind_down';
    return 'sleep';
}
