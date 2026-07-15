import { DEFAULT_CONSTRAINTS, DEFAULT_MESSAGES } from './defaults';

export type TranslateFunction = (key: string, params?: Record<string, unknown>) => string;

export interface ValidationOptions {
    readonly constraints?: Readonly<Record<string, string>>;
    readonly t?: TranslateFunction;
}

interface ValidationConfig {
    constraints: Readonly<Record<string, string>>;
    t: TranslateFunction | null;
}

const config: ValidationConfig = {
    constraints: DEFAULT_CONSTRAINTS,
    t: null
};

export function configureValidation(options: ValidationOptions = {}): void {
    if (options.constraints) {
        config.constraints = {...DEFAULT_CONSTRAINTS, ...options.constraints};
    }

    if (options.t) {
        config.t = options.t;
    }
}

export function resolveConstraint(code: string): string {
    return config.constraints[code] ?? code;
}

export function translate(key: string, params: Record<string, unknown> = {}): string {
    if (config.t) {
        return config.t(key, params);
    }

    const message = DEFAULT_MESSAGES[key];

    if (!message) {
        return key;
    }

    return message.replace(/\{(\w+)}/g, (match, name: string) => name in params ? String(params[name]) : match);
}
