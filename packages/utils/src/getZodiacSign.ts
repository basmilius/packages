import type { DateTime } from 'luxon';

export type ZodiacSign =
    | 'aquarius'
    | 'aries'
    | 'cancer'
    | 'capricorn'
    | 'gemini'
    | 'leo'
    | 'libra'
    | 'pisces'
    | 'sagittarius'
    | 'scorpio'
    | 'taurus'
    | 'virgo';

export default function (date: DateTime): ZodiacSign {
    if ((date.month === 3 && date.day >= 21) || (date.month === 4 && date.day <= 19)) return 'aries';
    if ((date.month === 4 && date.day >= 20) || (date.month === 5 && date.day <= 20)) return 'taurus';
    if ((date.month === 5 && date.day >= 21) || (date.month === 6 && date.day <= 20)) return 'gemini';
    if ((date.month === 6 && date.day >= 21) || (date.month === 7 && date.day <= 22)) return 'cancer';
    if ((date.month === 7 && date.day >= 23) || (date.month === 8 && date.day <= 22)) return 'leo';
    if ((date.month === 8 && date.day >= 23) || (date.month === 9 && date.day <= 22)) return 'virgo';
    if ((date.month === 9 && date.day >= 23) || (date.month === 10 && date.day <= 22)) return 'libra';
    if ((date.month === 10 && date.day >= 23) || (date.month === 11 && date.day <= 21)) return 'scorpio';
    if ((date.month === 11 && date.day >= 22) || (date.month === 12 && date.day <= 21)) return 'sagittarius';
    if ((date.month === 12 && date.day >= 22) || (date.month === 1 && date.day <= 19)) return 'capricorn';
    if ((date.month === 1 && date.day >= 20) || (date.month === 2 && date.day <= 18)) return 'aquarius';
    return 'pisces';
}
