import { merge } from 'lodash-es';
import { computed, type Ref } from 'vue';
import { useRoute, type RouteMeta } from 'vue-router';

export default function (): Ref<RouteMeta> {
    const route = useRoute();

    return computed(() => {
        let meta: RouteMeta = {};

        for (let i = route.matched.length - 1; i >= 0; --i) {
            const record = route.matched[i];

            if (!record || typeof record.meta !== 'object') {
                continue;
            }

            let matchMeta = {...record.meta};

            if ('navigation' in meta) {
                const {navigation: _, ...matchMetaWithoutNavigation} = matchMeta;
                matchMeta = matchMetaWithoutNavigation;
            }

            meta = merge(meta, matchMeta);
        }

        return meta;
    });
}
