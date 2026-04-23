import { merge } from 'lodash-es';
import { computed, type ComputedRef, unref } from 'vue';
import type { RouteMeta } from 'vue-router';
import useRoute from './useRoute';

export default function (): ComputedRef<RouteMeta> {
    const route = useRoute();

    return computed(() => {
        const matched = unref(route).matched;
        let meta: RouteMeta = {};

        for (let i = matched.length - 1; i >= 0; --i) {
            const record = matched[i];

            if (!record || typeof record.meta !== 'object') {
                continue;
            }

            let matchMeta = {...record.meta};

            if ('navigation' in meta) {
                const {navigation: _navigation, ...matchMetaWithoutNavigation} = matchMeta;
                matchMeta = matchMetaWithoutNavigation;
            }

            meta = merge(meta, matchMeta);
        }

        return meta;
    });
}
