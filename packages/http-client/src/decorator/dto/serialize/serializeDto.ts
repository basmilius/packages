import { toRaw } from 'vue';
import { ARGS, NAME } from '../symbols';
import { MAGIC_DTO, type SerializedDto } from './types';
import type DtoInstance from '../instance';
import serializeArray from './serializeArray';
import serializeObject from './serializeObject';
import uuid from './uuid';

/**
 * Serializes a DTO instance to an array format for transmission or storage.
 * The format includes a magic marker, UUID, class name, properties, and constructor arguments.
 */
export default function (obj: DtoInstance<unknown>): SerializedDto {
    obj = toRaw(obj);

    const json = obj.toJSON();

    return [
        MAGIC_DTO,
        uuid(),
        obj[NAME],
        serializeObject(json),
        serializeArray(obj[ARGS])
    ];
}
