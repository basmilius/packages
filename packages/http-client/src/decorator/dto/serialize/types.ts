/**
 * Magic numbers used for serialization type identification.
 * These hex values are chosen to be unlikely to conflict with regular data.
 */

/**
 * Magic marker for serialized DTO objects.
 * Value: 0xBF1 (3057 in decimal)
 * Format: [MAGIC_DTO, uuid, className, properties, constructorArgs]
 */
export const MAGIC_DTO = 0xBF1;

/**
 * Magic marker for serialized Luxon DateTime objects.
 * Value: 0xBF2 (3058 in decimal)
 * Format: [MAGIC_DATETIME, isoString]
 */
export const MAGIC_DATETIME = 0xBF2;

/**
 * Type definition for serialized DateTime objects.
 * Array format: [magic marker, ISO 8601 string]
 */
export type SerializedDateTime = [typeof MAGIC_DATETIME, string];

/**
 * Type definition for serialized DTO objects.
 * Array format: [magic marker, uuid, class name, properties, constructor args]
 */
export type SerializedDto = [typeof MAGIC_DTO, string, string, Record<string, unknown>, any[]];

/**
 * Union type for all possible serialized values.
 */
export type Serialized = boolean | number | string | Record<string, unknown> | SerializedDateTime | SerializedDto | Serialized[];
