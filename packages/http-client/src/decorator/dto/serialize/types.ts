import type { SERIALIZED_DATETIME, SERIALIZED_DTO } from '../const';

export type SerializedDateTime = [typeof SERIALIZED_DATETIME, string];
export type SerializedDto = [typeof SERIALIZED_DTO, string, string, Record<string, unknown>, any[]];
export type Serialized = boolean | number | string | Record<string, unknown> | SerializedDateTime | SerializedDto | Serialized[];
