import type { DefaultTheme } from 'vitepress';

export const utils: DefaultTheme.SidebarItem[] = [
    {
        text: 'Utils',
        items: [
            {text: 'Introduction', link: '/utils/'},
            {text: 'Installation', link: '/utils/installation'},
            {text: 'Constants', link: '/utils/constants'},
            {text: 'Types', link: '/utils/types'}
        ]
    },
    {
        text: 'Date & time',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/utils/date/'},
            {text: 'formatDate', link: '/utils/date/formatDate'},
            {text: 'formatDateFull', link: '/utils/date/formatDateFull'},
            {text: 'formatDateTime', link: '/utils/date/formatDateTime'},
            {text: 'formatMonth', link: '/utils/date/formatMonth'},
            {text: 'formatMonthYear', link: '/utils/date/formatMonthYear'},
            {text: 'formatTime', link: '/utils/date/formatTime'},
            {text: 'getCircadianPhase', link: '/utils/date/getCircadianPhase'},
            {text: 'getDayPeriod', link: '/utils/date/getDayPeriod'},
            {text: 'getDayPeriodRange', link: '/utils/date/getDayPeriodRange'},
            {text: 'getMoonPhase', link: '/utils/date/getMoonPhase'},
            {text: 'getSeason', link: '/utils/date/getSeason'},
            {text: 'getSeasonalMood', link: '/utils/date/getSeasonalMood'},
            {text: 'getWorkdayPeriod', link: '/utils/date/getWorkdayPeriod'},
            {text: 'getZodiacSign', link: '/utils/date/getZodiacSign'},
            {text: 'isToday', link: '/utils/date/isToday'}
        ]
    },
    {
        text: 'Color',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/utils/color/'},
            {text: 'hexToRGB', link: '/utils/color/hexToRGB'},
            {text: 'hslToHSV', link: '/utils/color/hslToHSV'},
            {text: 'hslToRGB', link: '/utils/color/hslToRGB'},
            {text: 'hsvToHSL', link: '/utils/color/hsvToHSL'},
            {text: 'hsvToRGB', link: '/utils/color/hsvToRGB'},
            {text: 'hueToRGB', link: '/utils/color/hueToRGB'},
            {text: 'rgbToHEX', link: '/utils/color/rgbToHEX'},
            {text: 'rgbToHSL', link: '/utils/color/rgbToHSL'},
            {text: 'rgbToHSV', link: '/utils/color/rgbToHSV'}
        ]
    },
    {
        text: 'Math & numbers',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/utils/math/'},
            {text: 'clampWithStepPrecision', link: '/utils/math/clampWithStepPrecision'},
            {text: 'countDecimals', link: '/utils/math/countDecimals'},
            {text: 'formatNumber', link: '/utils/math/formatNumber'},
            {text: 'formatPercentage', link: '/utils/math/formatPercentage'},
            {text: 'generateStepTicks', link: '/utils/math/generateStepTicks'},
            {text: 'mulberry32', link: '/utils/math/mulberry32'},
            {text: 'roundStep', link: '/utils/math/roundStep'}
        ]
    },
    {
        text: 'DOM & browser',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/utils/dom/'},
            {text: 'downloadBlob', link: '/utils/dom/downloadBlob'},
            {text: 'downloadString', link: '/utils/dom/downloadString'},
            {text: 'downloadUrl', link: '/utils/dom/downloadUrl'},
            {text: 'isHtmlElement', link: '/utils/dom/isHtmlElement'},
            {text: 'openUrl', link: '/utils/dom/openUrl'},
            {text: 'printHtml', link: '/utils/dom/printHtml'},
            {text: 'viewTransition', link: '/utils/dom/viewTransition'}
        ]
    },
    {
        text: 'Geo',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/utils/geo/'},
            {text: 'isNorthernHemisphere', link: '/utils/geo/isNorthernHemisphere'},
            {text: 'isPointInPolygon', link: '/utils/geo/isPointInPolygon'}
        ]
    },
    {
        text: 'Object',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/utils/object/'},
            {text: 'getPrototypeChain', link: '/utils/object/getPrototypeChain'},
            {text: 'setObjectMethod', link: '/utils/object/setObjectMethod'},
            {text: 'setObjectValue', link: '/utils/object/setObjectValue'}
        ]
    },
    {
        text: 'Function',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/utils/function/'},
            {text: 'debounce', link: '/utils/function/debounce'},
            {text: 'waitFor', link: '/utils/function/waitFor'}
        ]
    }
];
