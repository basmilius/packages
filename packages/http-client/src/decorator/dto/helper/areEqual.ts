/**
 * Checks if the two given values are equal. When both values are a
 * dto, the check is done by firstly converthing them to JSON.
 */
export default function (a: unknown, b: unknown): boolean {
    if (a === b) {
        return true;
    }

    return a === b;
}
