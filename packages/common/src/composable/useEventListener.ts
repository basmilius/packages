import { type MaybeRefOrGetter, onScopeDispose, watch } from 'vue';
import { type EligibleTarget, unwrapTarget } from '../util';

type EventMap = HTMLElementEventMap & WindowEventMap & DocumentEventMap;
type StopHandle = () => void;

export default function <TType extends keyof EventMap>(target: MaybeRefOrGetter<EligibleTarget | null | undefined>, type: TType | TType[], listener: (evt: EventMap[TType]) => void, options?: boolean | AddEventListenerOptions): StopHandle {
    const types = Array.isArray(type) ? type : [type];

    let cleanup: (() => void) | undefined;

    const stopWatch = watch(() => unwrapTarget(target), element => {
        cleanup?.();
        cleanup = undefined;

        if (!element) {
            return;
        }

        for (const eventType of types) {
            element.addEventListener(eventType, listener as EventListener, options);
        }

        cleanup = () => {
            for (const eventType of types) {
                element.removeEventListener(eventType, listener as EventListener, options);
            }
        };
    }, {immediate: true});

    function stop(): void {
        cleanup?.();
        cleanup = undefined;
        stopWatch();
    }

    onScopeDispose(stop);

    return stop;
}
