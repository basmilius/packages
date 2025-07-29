export type Constructor<T = {}> = new (...args: any[]) => T;
export type Descriptors = Record<string | symbol, TypedPropertyDescriptor<unknown> | PropertyDescriptor>;
