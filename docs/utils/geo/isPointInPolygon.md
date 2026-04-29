---
outline: deep
---

# isPointInPolygon

Tests whether a 2D point lies inside an arbitrary polygon using the [ray casting algorithm](https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm). The polygon is given as a list of `[x, y]` tuples; it does not need to be explicitly closed.

## Importing

```ts
import { isPointInPolygon } from '@basmilius/utils';
```

## Usage

```ts
import { isPointInPolygon } from '@basmilius/utils';

const square: [number, number][] = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10]
];

isPointInPolygon([5, 5], square);   // => true
isPointInPolygon([15, 5], square);  // => false
```

## Parameters

| Name      | Type                  | Description                                   |
|-----------|-----------------------|-----------------------------------------------|
| `point`   | `[number, number]`    | The point to test as an `[x, y]` tuple.       |
| `polygon` | `[number, number][]`  | The polygon vertices in order.                |

## Returns

`boolean` — `true` when the point lies strictly inside the polygon.

## Type signature

```ts
type Point = [number, number];

declare function isPointInPolygon(point: Point, polygon: Point[]): boolean;
```

## See also

- [`isNorthernHemisphere`](/utils/geo/isNorthernHemisphere)
