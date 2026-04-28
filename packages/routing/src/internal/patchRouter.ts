import { unref } from 'vue';
import type { HistoryState, NavigationFailure, RouteLocationOptions, RouteLocationRaw, Router } from 'vue-router';
import { readModalState, writeModalState } from './modalState';

type Navigate = (to: RouteLocationRaw) => Promise<NavigationFailure | void | undefined>;

export type OriginalNav = {
    readonly push: Navigate;
    readonly replace: Navigate;
};

function withState(to: RouteLocationRaw, state: HistoryState): RouteLocationRaw {
    if (typeof to === 'string') {
        return {path: to, state};
    }

    return {...to, state};
}

function injectState(to: RouteLocationRaw, backgroundPath: string | null, depth: number = 0): RouteLocationRaw {
    const base = typeof to === 'string' ? null : (to.state ?? null);

    return withState(to, writeModalState(base, backgroundPath, depth));
}

function readModalFlag(flag: boolean | number | undefined): {open: boolean; depth: number; explicitClose: boolean} {
    if (flag === true) {
        return {open: true, depth: 0, explicitClose: false};
    }

    if (flag === false) {
        return {open: false, depth: 0, explicitClose: true};
    }

    if (typeof flag === 'number') {
        return {open: true, depth: Math.max(0, flag), explicitClose: false};
    }

    return {open: false, depth: 0, explicitClose: false};
}

export default function patchRouter(router: Router): OriginalNav {
    const origPush: Navigate = router.push.bind(router);
    const origReplace: Navigate = router.replace.bind(router);

    function transform(to: RouteLocationRaw): RouteLocationRaw {
        const wantsModal = typeof to === 'string' ? undefined : (to as RouteLocationOptions).modal;
        const flag = readModalFlag(wantsModal);
        const current = readModalState();

        // note: Explicit `modal: true` / `<number>` opens on top of the
        //  current route. Already-open modals reuse the existing background.
        if (flag.open) {
            const backgroundPath = current?.backgroundPath ?? unref(router.currentRoute).fullPath;

            return injectState(to, backgroundPath, flag.depth);
        }

        // note: Explicit `modal: false` exits the modal entirely.
        if (flag.explicitClose) {
            return injectState(to, null);
        }

        // note: Implicit navigation from within a modal. Keep the modal open
        //  when the target shares the root-matched record (sibling within
        //  the same modal tree), otherwise exit. Depth carries across.
        if (current !== null) {
            const resolved = router.resolve(to);
            const currentRoot = unref(router.currentRoute).matched[0]?.path;
            const nextRoot = resolved.matched[0]?.path;
            const sameRoot = !!currentRoot && currentRoot === nextRoot;

            return sameRoot ? injectState(to, current.backgroundPath, current.depth) : injectState(to, null);
        }

        return to;
    }

    router.push = async (to) => await origPush(transform(to));
    router.replace = async (to) => await origReplace(transform(to));

    return {
        push: origPush,
        replace: origReplace
    };
}
