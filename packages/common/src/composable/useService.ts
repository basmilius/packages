import type { BaseService } from '@basmilius/http-client';
import { guarded } from '../util';

type ServiceClass<T extends BaseService> = { new(): T; };
type Wrap = (fn: Function) => Function;

export default function <T extends BaseService>(serviceClass: ServiceClass<T>, ...wrap: Wrap[]): T {
    const service = new serviceClass;
    const methods = Object.getOwnPropertyNames(serviceClass.prototype)
        .filter(m => m !== 'constructor');

    const functions: Record<string, Function> = {};

    for (let method of methods) {
        functions[method] = guarded((service as any)[method].bind(service));
        wrap.forEach(w => functions[method] = w(functions[method]!));
    }

    return functions as unknown as T;
}
