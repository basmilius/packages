import type { Season } from './getSeason';

export type SeasonMood =
    | 'cozy'
    | 'energetic'
    | 'fresh'
    | 'warm';

export default function (season: Season): SeasonMood {
    switch (season) {
        case 'spring':
            return 'fresh';

        case 'summer':
            return 'energetic';

        case 'autumn':
            return 'cozy';

        case 'winter':
            return 'warm';
    }
}
