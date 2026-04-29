---
outline: deep
---

# Data

`@basmilius/utils` ships with a small set of internal data files used by the public helpers — most notably `countries`, which powers [`isNorthernHemisphere`](/utils/geo/isNorthernHemisphere) and [`getSeason`](/utils/date/getSeason).

These data tables currently live in `packages/utils/src/data/` and are not part of the public package exports. They are subject to change without a major version bump.

If you have a use case that would benefit from a stable export of this data, please open an issue on [GitHub](https://github.com/basmilius/packages).

## What lives here today

- `countries.ts` — ISO 3166-1 alpha-2 country code to `[name, latitude, longitude]` tuple.

## Public surface

The data is exposed indirectly through the typed helpers it powers:

- [`getSeason`](/utils/date/getSeason) accepts a `CountryCode`.
- [`isNorthernHemisphere`](/utils/geo/isNorthernHemisphere) accepts a `CountryCode`.
