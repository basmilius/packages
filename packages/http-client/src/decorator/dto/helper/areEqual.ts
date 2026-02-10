import isDto from './isDto';

/**
 * Checks if the two given values are equal.
 * 
 * For non-DTO values, uses reference equality (===).
 * For DTOs, performs a shallow property comparison on their JSON representations.
 * 
 * Note: This is a shallow comparison - nested objects are compared by reference,
 * not by their content. For deep equality of nested DTOs, the objects must share
 * the same references or you should compare their serialized forms.
 * 
 * @param a - First value to compare
 * @param b - Second value to compare
 * @returns true if values are equal, false otherwise
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
    // which is much more efficient for large nested objects.
    // Note: Nested objects/arrays are compared by reference (===), not deeply.
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

        // Shallow comparison - compares property values using ===
        // For nested objects/DTOs, this compares references, not contents
        return keysA.every(key => aJson[key] === bJson[key]);
    } catch (error) {
        // Fallback to JSON.stringify comparison if toJSON fails
        return JSON.stringify(a) === JSON.stringify(b);
    }
}
