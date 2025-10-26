import type { DateTime } from 'luxon';

export type MoonPhase =
    | 'new_moon'
    | 'waxing_crescent'
    | 'first_quarter'
    | 'waxing_gibbous'
    | 'full_moon'
    | 'waning_gibbous'
    | 'last_quarter'
    | 'waning_crescent';

export default function (date: DateTime): MoonPhase {
    // Conway’s algorithm
    let r = date.year % 100;
    r %= 19;
    if (r > 9) r -= 19;

    r = ((r * 11) % 30) + date.month + date.day;

    if (date.month < 3) r += 2;
    if (date.year < 2000) r -= 4;
    else r -= 8.3;

    r = Math.floor(r + 0.5) % 30;

    const age = r < 0 ? r + 30 : r;
    const phase = age / 29.530588853;

    if (phase < 0.03 || phase > 0.97) return 'new_moon';
    if (phase < 0.22) return 'waxing_crescent';
    if (phase < 0.28) return 'first_quarter';
    if (phase < 0.47) return 'waxing_gibbous';
    if (phase < 0.53) return 'full_moon';
    if (phase < 0.72) return 'waning_gibbous';
    if (phase < 0.78) return 'last_quarter';
    return 'waning_crescent';
}
