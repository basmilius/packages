import { isReactive, isRef, nextTick, ref, type Ref, toRefs, unref, watch } from 'vue';
import { type LocationQuery, useRoute, useRouter } from 'vue-router';

export type UrlStatePrimitive = string | number | boolean;
export type UrlStateValue = UrlStatePrimitive | null | undefined;

export type UrlStateSerializer = {
    toUrl(value: unknown): string | null;
    fromUrl(value: string): UrlStateValue;
};

export type UrlStateOptions = {
    readonly prefix?: string;
    readonly serializers?: Record<string, UrlStateSerializer>;
};

export type UrlStateInput =
    | Record<string, Ref<UrlStateValue>>
    | Record<string, UrlStateValue>;

function pickSerializer(initial: UrlStateValue): UrlStateSerializer {
    if (typeof initial === 'number') {
        return {
            toUrl(value: unknown): string | null {
                if (typeof value !== 'number' || Number.isNaN(value)) {
                    return null;
                }

                return String(value);
            },
            fromUrl(value: string): UrlStateValue {
                const parsed = Number(value);

                return Number.isNaN(parsed) ? null : parsed;
            }
        };
    }

    if (typeof initial === 'boolean') {
        return {
            toUrl(value: unknown): string | null {
                if (typeof value !== 'boolean') {
                    return null;
                }

                return value ? '1' : '0';
            },
            fromUrl(value: string): UrlStateValue {
                return value === '1' || value === 'true';
            }
        };
    }

    return {
        toUrl(value: unknown): string | null {
            if (typeof value !== 'string' || value.length === 0) {
                return null;
            }

            return value;
        },
        fromUrl(value: string): UrlStateValue {
            return value;
        }
    };
}

function normalizeInput(state: UrlStateInput): Record<string, Ref<UrlStateValue>> {
    if (isReactive(state)) {
        return toRefs(state) as Record<string, Ref<UrlStateValue>>;
    }

    const result: Record<string, Ref<UrlStateValue>> = {};

    for (const [key, value] of Object.entries(state)) {
        result[key] = (isRef(value) ? value : ref(value)) as Ref<UrlStateValue>;
    }

    return result;
}

export default function useUrlState(state: UrlStateInput, options: UrlStateOptions = {}): void {
    const route = useRoute();
    const router = useRouter();

    const refs = normalizeInput(state);
    const stateKeys = Object.keys(refs);
    const prefix = options.prefix ? `${options.prefix}_` : '';

    const urlKeys: Record<string, string> = {};
    const defaults: Record<string, UrlStateValue> = {};
    const serializers: Record<string, UrlStateSerializer> = {};

    for (const key of stateKeys) {
        const initial = unref(refs[key]);

        urlKeys[key] = `${prefix}${key}`;
        defaults[key] = initial;
        serializers[key] = options.serializers?.[key] ?? pickSerializer(initial);
    }

    let isSyncingFromUrl = false;

    function readUrlValue(query: LocationQuery, urlKey: string): string | null {
        const raw = query[urlKey];

        if (typeof raw !== 'string' || raw.length === 0) {
            return null;
        }

        return raw;
    }

    function applyQueryToState(query: LocationQuery): void {
        for (const key of stateKeys) {
            const raw = readUrlValue(query, urlKeys[key]);
            const next = raw === null
                ? defaults[key]
                : serializers[key].fromUrl(raw);

            if (refs[key].value !== next) {
                refs[key].value = next;
            }
        }
    }

    applyQueryToState(route.query);

    watch(stateKeys.map(key => refs[key]), () => {
        if (isSyncingFromUrl) {
            return;
        }

        const next: LocationQuery = {...route.query};
        let changed = false;

        for (const key of stateKeys) {
            const urlKey = urlKeys[key];
            const value = unref(refs[key]);
            const isDefault = value === defaults[key];
            const serialized = isDefault ? null : serializers[key].toUrl(value);

            if (serialized === null) {
                if (urlKey in next) {
                    delete next[urlKey];
                    changed = true;
                }
            } else if (next[urlKey] !== serialized) {
                next[urlKey] = serialized;
                changed = true;
            }
        }

        if (changed) {
            router.replace({query: next});
        }
    });

    watch(() => route.query, async query => {
        isSyncingFromUrl = true;
        applyQueryToState(query);
        await nextTick();
        isSyncingFromUrl = false;
    });
}
