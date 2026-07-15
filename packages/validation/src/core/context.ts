import type { InjectionKey } from 'vue';
import type { UseValidation } from '../composable/useValidation';

export interface ValidationContext extends UseValidation {
    readonly namespace: string;
    readonly clearServerError: (key: string) => void;
}

export const CONTEXT: InjectionKey<ValidationContext> = Symbol() as InjectionKey<ValidationContext>;
