import type { RouteLocationNormalized } from 'vue-router';

const PARAM_PATTERN = /:([A-Za-z0-9_]+)/g;

// note: Identity of the view rendered at `depth`: its matched record plus the
//  params that record's path consumes. `route.fullPath` cannot serve as that
//  identity, because it changes for every descendant route as well.
export default function resolveViewKey(route: RouteLocationNormalized, depth: number): string {
    const record = route.matched[depth];

    if (!record) {
        return '';
    }

    let key = record.path;

    for (const [, name] of record.path.matchAll(PARAM_PATTERN)) {
        const value = route.params[name];

        key += `|${Array.isArray(value) ? value.join(',') : value ?? ''}`;
    }

    return key;
}
