import { type CountryCode, getCountry } from './data/countries';

export default function (countryCode: CountryCode): boolean | null {
    const country = getCountry(countryCode);

    if (!country) {
        return null;
    }

    const [, latitude] = country;

    return latitude >= 0;
}
