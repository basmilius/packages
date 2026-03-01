import { toRaw } from 'vue';
import { SERIALIZED_DTO } from '../const';
import { ARGS, NAME } from '../symbols';
import type { SerializedDto } from './types';
import type DtoInstance from '../instance';
import serializeArray from './serializeArray';
import serializeObject from './serializeObject';
import uuid from './uuid';

export default function (obj: DtoInstance<unknown>): SerializedDto {
    obj = toRaw(obj);

    const json = obj.toJSON();

    return [
        SERIALIZED_DTO,
        uuid(),
        obj[NAME],
        serializeObject(json),
        serializeArray(obj[ARGS])
    ];
}
