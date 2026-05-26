import type DtoInstance from './instance';
import { PARENT, PARENT_KEY, PROXY } from './symbols';

export type ProxiedArray = unknown[] & {
    [PARENT]?: DtoInstance<unknown>;
    [PARENT_KEY]?: string;
    [PROXY]: true;
};

export type ProxiedDto = DtoInstance<unknown> & {
    [key: string]: unknown;
}
