import type { DateTime } from 'luxon';
import { type CountryCode } from './data/countries';
import isNorthernHemisphere from './isNorthernHemisphere';

export type Season =
    | 'autumn'
    | 'spring'
    | 'summer'
    | 'winter';

const NORTHERN_SEASONS: Record<Season, number[]> = {
    autumn: [9, 10, 11],
    spring: [3, 4, 5],
    summer: [6, 7, 8],
    winter: [12, 1, 2]
};

const SOUTHERN_SEASONS: Record<Season, number[]> = {
    autumn: [3, 4, 5],
    spring: [9, 10, 11],
    summer: [12, 1, 2],
    winter: [6, 7, 8]
};

export default function (countryCode: CountryCode, date: DateTime): Season | null {
    const isNorthern = isNorthernHemisphere(countryCode);
    const month = date.month;
    const seasons = isNorthern ? NORTHERN_SEASONS : SOUTHERN_SEASONS;

    for (const season of ['autumn', 'spring', 'summer', 'winter'] as Season[]) {
        if (seasons[season].includes(month)) {
            return season;
        }
    }

    return null;
}
