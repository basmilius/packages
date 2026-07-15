import type { Plugin } from 'vue';
import { configureValidation, type ValidationOptions } from './state';

export default function (options: ValidationOptions = {}): Plugin {
    return {
        install(): void {
            configureValidation(options);
        }
    };
}
