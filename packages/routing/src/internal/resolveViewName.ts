import type { RouteLocationNormalized } from 'vue-router';

// note: Picks the named view a modal should render at `depth`. Prefers the
//  `default` view (returns `undefined` so `VueRouterView` uses its own
//  default name). When the matched record declares no `default` — e.g. a
//  layout registered solely under a named view like `overlay` — falls back
//  to the first declared view so the layout still renders inside the modal.
export default function resolveViewName(route: RouteLocationNormalized, depth: number): string | undefined {
    const record = route.matched[depth];

    if (!record?.components || 'default' in record.components) {
        return undefined;
    }

    const keys = Object.keys(record.components);

    return keys.length > 0 ? keys[0] : undefined;
}
