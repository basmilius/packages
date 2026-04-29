---
outline: deep
---

# isNorthernHemisphere

Determines whether a country sits in the northern hemisphere by looking up its latitude in the bundled country table.

## Importing

```ts
import { isNorthernHemisphere } from '@basmilius/utils';
```

## Usage

```ts
import { isNorthernHemisphere } from '@basmilius/utils';

isNorthernHemisphere('nl'); // => true
isNorthernHemisphere('au'); // => false
isNorthernHemisphere('zz'); // => null (unknown country)
```

## Parameters

| Name          | Type          | Description                                  |
|---------------|---------------|----------------------------------------------|
| `countryCode` | `CountryCode` | ISO 3166-1 alpha-2 country code (lowercase). |

## Returns

`boolean | null` — `true` for latitudes `>= 0`, `false` for southern hemisphere countries, `null` when the country code is not in the lookup table.

## Type signature

```ts
declare function isNorthernHemisphere(countryCode: CountryCode): boolean | null;
```

## See also

- [`getSeason`](/utils/date/getSeason)
- [`isPointInPolygon`](/utils/geo/isPointInPolygon)
