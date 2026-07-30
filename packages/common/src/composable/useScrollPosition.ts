import { type MaybeRefOrGetter, onMounted, type Ref, ref, watch } from 'vue';
import { type EligibleTarget, unwrapTarget } from '../util';
import useEventListener from './useEventListener';

type ScrollPosition = {
    readonly x: Ref<number>;
    readonly y: Ref<number>;
};

export default function (target?: MaybeRefOrGetter<EligibleTarget | null | undefined>): ScrollPosition {
    const x = ref(0);
    const y = ref(0);

    if (typeof document === 'undefined') {
        return {x, y};
    }

    const resolved = target ?? ref(document);

    function update(): void {
        const element = unwrapTarget(resolved);

        if (!element) {
            return;
        }

        if (element instanceof Window) {
            x.value = element.scrollX;
            y.value = element.scrollY;
        } else if (element instanceof Document) {
            x.value = element.scrollingElement?.scrollLeft ?? 0;
            y.value = element.scrollingElement?.scrollTop ?? 0;
        } else {
            x.value = element.scrollLeft;
            y.value = element.scrollTop;
        }
    }

    useEventListener(resolved, 'scroll', update, {passive: true});

    // Reading during setup would put the restored scroll offset into a component
    // that is still hydrating from a server render at 0. The watcher stays for a
    // target that only arrives later.
    onMounted(update);

    watch(() => unwrapTarget(resolved), update);

    return {x, y};
}
