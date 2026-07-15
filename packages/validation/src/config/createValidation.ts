import { RegleVuePlugin } from '@regle/core';
import type { App, Plugin } from 'vue';
import { configureValidation, type ValidationOptions } from './state';

export default function (options: ValidationOptions = {}): Plugin {
    return {
        install(app: App): void {
            configureValidation(options);
            app.use(RegleVuePlugin);
        }
    };
}
