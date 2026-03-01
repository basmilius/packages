import isDto from './isDto';

/**
 * Checks if the two given values are equal. When both values are a
 * dto, the check is done by firstly converthing them to JSON.
 */
export default function (a: unknown, b: unknown): boolean {
    if (a === b) {
        return true;
    }

    if (!isDto(a) || !isDto(b)) {
        return a === b;
    }

    const aJson = a.toJSON();
    const bJson = b.toJSON();

    if (typeof aJson !== 'object' || typeof bJson !== 'object' || aJson === null || bJson === null) {
        return aJson === bJson;
    }

    return equal(aJson, bJson);
}

function equal(a: object, b: object): boolean {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) {
        return false;
    }

    return aKeys.every(key => {
        if (a[key] === b[key]) {
            return true;
        }

        if (typeof a[key] === 'object' && typeof b[key] === 'object') {
            return equal(a[key], b[key]);
        }

        return false;
    });
}
