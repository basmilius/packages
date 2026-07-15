import { isRequestError, isValidationError } from '@basmilius/http-client';
import type { MergedScopedRegles } from '@regle/core';
import { computed, type ComputedRef, inject, provide, readonly, ref, type Ref, shallowRef } from 'vue';
import { CONTEXT, type ValidationContext } from '../core/context';
import mapServerErrors from '../core/mapServerErrors';
import { useCollectScope } from '../core/scope';
import { rules, type ValidationRules } from '../rules';

export const GLOBAL_ERROR_KEY: unique symbol = Symbol();

export type ValidationErrors = Record<string | symbol, string>;

export interface UseValidation {
    readonly errors: ComputedRef<ValidationErrors>;
    readonly invalid: ComputedRef<boolean>;
    readonly live: Readonly<Ref<boolean>>;
    readonly r$: MergedScopedRegles;
    readonly rules: ValidationRules;
    readonly handleError: (err: unknown) => void;
    readonly reset: () => void;
    readonly validate: () => Promise<boolean>;
    readonly validated: (fn: () => void | Promise<void>, close?: () => void) => Promise<void>;
}

let uid = 0;

function collect(tree: Record<string, unknown>, map: ValidationErrors, prefix?: string): void {
    for (const key in tree) {
        const value = tree[key];

        if (!Array.isArray(value)) {
            if (value && typeof value === 'object') {
                collect(value as Record<string, unknown>, map, prefix ? `${prefix}.${key}` : key);
            }

            continue;
        }

        const message = value.find(entry => typeof entry === 'string');

        if (!message) {
            continue;
        }

        if (key === '$self' && prefix) {
            map[prefix] = message;
        } else {
            map[prefix ? `${prefix}.${key}` : key] = message;
        }
    }
}

export function createValidationContext(isLive: boolean = false): ValidationContext {
    const namespace = `@basmilius/validation:${++uid}`;
    const {r$} = useCollectScope(namespace);

    const serverErrors = shallowRef<ValidationErrors>({});
    const live = readonly(ref(isLive));

    const clientErrors = computed(() => {
        const map: ValidationErrors = {};

        for (const tree of r$.$errors) {
            collect(tree as Record<string, unknown>, map);
        }

        return map;
    });

    const errors = computed<ValidationErrors>(() => ({
        ...clientErrors.value,
        ...serverErrors.value
    }));

    const invalid = computed(() => Reflect.ownKeys(errors.value).length > 0);

    function clearServerError(key: string): void {
        if (!(key in serverErrors.value)) {
            return;
        }

        const map = {...serverErrors.value};
        delete map[key];
        serverErrors.value = map;
    }

    function handleError(err: unknown): void {
        if (!isValidationError(err)) {
            if (isRequestError(err)) {
                serverErrors.value = {
                    [GLOBAL_ERROR_KEY]: err.errorDescription
                };

                return;
            }

            throw err;
        }

        serverErrors.value = mapServerErrors(err.errors);
    }

    function reset(): void {
        r$.$reset();
        serverErrors.value = {};
    }

    async function validate(): Promise<boolean> {
        return (await r$.$validate()).valid;
    }

    async function validated(fn: () => void | Promise<void>, close?: () => void): Promise<void> {
        serverErrors.value = {};

        if (!await validate()) {
            return;
        }

        try {
            await fn();
            close?.();
        } catch (err) {
            handleError(err);
        }
    }

    const context: ValidationContext = {
        errors,
        invalid,
        live,
        namespace,
        r$,
        rules,

        clearServerError,
        handleError,
        reset,
        validate,
        validated
    };

    provide(CONTEXT, context);

    return context;
}

export default function (isLive: boolean = false): UseValidation {
    return inject(CONTEXT, null) ?? createValidationContext(isLive);
}
