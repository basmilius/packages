import type { Plugin } from 'vue';

export interface AutomationIdOptions {
    enabled?: boolean;
}

const createAutomationId = ({enabled = true}: AutomationIdOptions = {}): Plugin => ({
    install(app): void {
        if (!enabled) {
            return;
        }

        app.mixin({
            mounted(): void {
                const options = this.$options as { __name?: string; name?: string };
                const name = options.__name ?? options.name;
                const el = this.$el as Element | null;

                if (!name || !el || !('setAttribute' in el) || el.hasAttribute('data-aid')) {
                    return;
                }

                el.setAttribute('data-aid', name);
            }
        });

        app.directive('aid', {
            mounted(el: Element, binding): void {
                el.setAttribute('data-aid', String(binding.value));
            },
            updated(el: Element, binding): void {
                el.setAttribute('data-aid', String(binding.value));
            }
        });
    }
});

export default createAutomationId;
