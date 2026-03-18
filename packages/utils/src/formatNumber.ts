export default function (value: number, decimals: number = 0): string {
    const locale = typeof navigator !== 'undefined' ? navigator.language : 'nl-NL';

    const formatter = new Intl.NumberFormat(locale, {
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
    });

    return formatter.format(value);
}
