import isDto from './isDto';

/**
 * Checks if the two given values are equal. When both values are a
 * dto, the check is done by comparing their JSON representations efficiently.
 * Uses reference equality as a fast path, then shallow comparison of properties.
 */
export default function (a: unknown, b: unknown): boolean {
    // Fast path: reference equality
    if (a === b) {
        return true;
    }

    // If either is not a DTO, use standard equality
    if (!isDto(a) || !isDto(b)) {
        return a === b;
    }

    // For DTOs, perform shallow property comparison instead of full JSON.stringify
    // which is much more efficient for large nested objects
    try {
        const aJson = a.toJSON?.() ?? a;
        const bJson = b.toJSON?.() ?? b;
        
        if (typeof aJson !== 'object' || typeof bJson !== 'object' || aJson === null || bJson === null) {
            return aJson === bJson;
        }

        const keysA = Object.keys(aJson);
        const keysB = Object.keys(bJson);

        if (keysA.length !== keysB.length) {
            return false;
        }

        // Shallow comparison - if all top-level properties are equal, objects are equal
        return keysA.every(key => aJson[key] === bJson[key]);
    } catch (error) {
        // Fallback to JSON.stringify comparison if toJSON fails
        return JSON.stringify(a) === JSON.stringify(b);
    }
}
