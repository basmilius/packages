import { type Component, computed, defineComponent, h, type PropType, type VNodeChild } from 'vue';
import { type RouteLocationRaw, useLink, useRouter } from 'vue-router';

type AriaCurrentValue = 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';

const RouterLink: Component = defineComponent({
    name: 'RouterLink',
    props: {
        to: {
            type: [String, Object] as PropType<RouteLocationRaw>,
            required: true
        },
        replace: {
            type: Boolean,
            default: false
        },
        activeClass: {
            type: String,
            default: 'router-link-active'
        },
        exactActiveClass: {
            type: String,
            default: 'router-link-exact-active'
        },
        ariaCurrentValue: {
            type: String as PropType<AriaCurrentValue>,
            default: 'page'
        },
        custom: {
            type: Boolean,
            default: false
        },
        modal: {
            type: [Boolean, Number] as PropType<boolean | number>,
            default: false
        }
    },
    setup(props, {slots}) {
        const router = useRouter();

        const linkProps = computed(() => ({
            to: props.to,
            replace: props.replace
        }));

        const link = useLink(linkProps.value);

        // note: The `modal` prop is truthy for `true` and any number
        //  (including 0, which means "open as modal, render deepest only").
        //  Using an explicit `=== false` check elsewhere avoids the 0
        //  pitfall. `modalFlag()` normalises the prop into the same shape
        //  patchRouter expects on `RouteLocationOptions.modal`.
        function modalFlag(): boolean | number {
            return typeof props.modal === 'number' ? props.modal : props.modal === true;
        }

        function isModalRequested(): boolean {
            return props.modal === true || typeof props.modal === 'number';
        }

        async function navigate(event?: MouseEvent): Promise<void> {
            if (isModalRequested()) {
                if (event) {
                    // note: Let modifier clicks / non-primary buttons fall
                    //  through so middle-click and ctrl+click still open the
                    //  URL in a new tab without entering modal mode. Each
                    //  modal route must be a valid standalone page.
                    if (event.defaultPrevented) {
                        return;
                    }

                    if (event.button !== undefined && event.button !== 0) {
                        return;
                    }

                    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
                        return;
                    }

                    event.preventDefault();
                }

                const flag = modalFlag();
                const target: RouteLocationRaw = typeof props.to === 'string'
                    ? {path: props.to, modal: flag}
                    : {...props.to, modal: flag};

                if (props.replace) {
                    await router.replace(target);
                } else {
                    await router.push(target);
                }

                return;
            }

            await link.navigate(event);
        }

        return (): VNodeChild => {
            const slotProps = {
                href: link.href.value,
                route: link.route.value,
                navigate,
                isActive: link.isActive.value,
                isExactActive: link.isExactActive.value
            };

            const children = slots.default?.(slotProps);

            if (props.custom) {
                return children;
            }

            return h('a', {
                href: link.href.value,
                'aria-current': link.isExactActive.value ? props.ariaCurrentValue : undefined,
                class: {
                    [props.activeClass]: link.isActive.value,
                    [props.exactActiveClass]: link.isExactActive.value
                },
                onClick: navigate
            }, children);
        };
    }
});

export default RouterLink;
