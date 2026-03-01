/**
 * Checks if the two given values are equal using reference equality.
 * DTOs represent entities with identity, so two different DTO instances
 * are never equal even if they hold the same data.
 */
export default function (a: unknown, b: unknown): boolean {
    return a === b;
}
