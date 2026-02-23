import { converter, formatHex } from 'culori';

type Shade =
    | 25
    | 50
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | 800
    | 900
    | 950;

const toOklch = converter('oklch');

const SHADES: Shade[] = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

const POSITION: Record<Shade, number> = {
    25: 0.00,
    50: 0.05,
    100: 0.10,
    200: 0.20,
    300: 0.35,
    400: 0.48,
    500: 0.55,
    600: 0.65,
    700: 0.75,
    800: 0.85,
    900: 0.93,
    950: 0.98
};

function clamp(v: number, min = 0, max = 1): number {
    return Math.min(max, Math.max(min, v));
}

export default function (baseHex: string, prefix = 'color'): Record<string, string> {
    const base = toOklch(baseHex);

    if (!base || base.mode !== 'oklch') {
        throw new Error('Invalid color');
    }

    const palette: Record<string, string> = {};

    for (const shade of SHADES) {
        const p = POSITION[shade];

        let l =
            shade < 500
                ? base.l + (1 - base.l) * (1 - p / POSITION[500])
                : base.l * (1 - (p - POSITION[500]) / (1 - POSITION[500]));

        l = clamp(l);

        const distanceFrom500 = Math.abs(p - POSITION[500]);
        const chromaFalloff = 1 - distanceFrom500 * 1.4;

        const c = (base.c ?? 0) * clamp(chromaFalloff, 0.2, 1);

        palette[`--${prefix}-${shade}`] = formatHex({
            mode: 'oklch',
            l,
            c,
            h: base.h
        });
    }

    return palette;
}

// Tailwind Like
// import { converter, formatHex } from 'culori';
// import { clamp } from 'lodash-es';
//
// type Shade =
//     | 25 | 50 | 100 | 200 | 300 | 400
//     | 500 | 600 | 700 | 800 | 900 | 950;
//
// const toOklch = converter('oklch');
//
// const SHADES: Shade[] = [
//     25, 50, 100, 200, 300, 400,
//     500,
//     600, 700, 800, 900, 950
// ];
//
// // Perceptual lightness curve (similar to Tailwind gray)
// const LIGHTNESS_CURVE: Record<Shade, number> = {
//     25: 0.99,
//     50: 0.96,
//     100: 0.92,
//     200: 0.86,
//     300: 0.78,
//     400: 0.66,
//     500: 0.55,
//     600: 0.44,
//     700: 0.33,
//     800: 0.23,
//     900: 0.15,
//     950: 0.08
// };
//
// export default function (baseHex: string, prefix = 'color', maxChroma = 0.08) {
//     const base = toOklch(baseHex);
//
//     if (!base || base.mode !== 'oklch') {
//         throw new Error('Invalid color');
//     }
//
//     const palette: Record<string, string> = {};
//
//     for (const shade of SHADES) {
//         let l = LIGHTNESS_CURVE[shade];
//
//         const distanceFromMiddle = Math.abs(shade === 500 ? 0 : (shade - 500) / 450);
//         const c = clamp((base.c ?? 0) * maxChroma * (1 - distanceFromMiddle), 0, 1);
//
//         palette[`--${prefix}-${shade}`] = formatHex({
//             mode: 'oklch',
//             l,
//             c,
//             h: base.h
//         });
//     }
//
//     return palette;
// }

