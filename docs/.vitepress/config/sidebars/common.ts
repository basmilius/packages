import type { DefaultTheme } from 'vitepress';

export const common: DefaultTheme.SidebarItem[] = [
    {
        text: 'Common',
        items: [
            {text: 'Introduction', link: '/common/'},
            {text: 'Installation', link: '/common/installation'}
        ]
    },
    {
        text: 'Composables',
        collapsed: false,
        items: [
            {text: 'useClickOutside', link: '/common/composable/useClickOutside'},
            {text: 'useComponentId', link: '/common/composable/useComponentId'},
            {text: 'useCopy', link: '/common/composable/useCopy'},
            {text: 'useDataTable', link: '/common/composable/useDataTable'},
            {text: 'useDebounced', link: '/common/composable/useDebounced'},
            {text: 'useDebouncedRef', link: '/common/composable/useDebouncedRef'},
            {text: 'useDtoForm', link: '/common/composable/useDtoForm'},
            {text: 'useInterval', link: '/common/composable/useInterval'},
            {text: 'useLoaded', link: '/common/composable/useLoaded'},
            {text: 'useLoadedAction', link: '/common/composable/useLoadedAction'},
            {text: 'useLocalFile', link: '/common/composable/useLocalFile'},
            {text: 'useMounted', link: '/common/composable/useMounted'},
            {text: 'useMutationObserver', link: '/common/composable/useMutationObserver'},
            {text: 'usePagination', link: '/common/composable/usePagination'},
            {text: 'usePasswordStrength', link: '/common/composable/usePasswordStrength'},
            {text: 'useResizeObserver', link: '/common/composable/useResizeObserver'},
            {text: 'useService', link: '/common/composable/useService'}
        ]
    },
    {
        text: 'Router helpers',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/common/router/'},
            {text: 'useIsView', link: '/common/router/useIsView'},
            {text: 'useNamedRoute', link: '/common/router/useNamedRoute'},
            {text: 'useNavigate', link: '/common/router/useNavigate'},
            {text: 'useRouteMeta', link: '/common/router/useRouteMeta'},
            {text: 'useRouteNames', link: '/common/router/useRouteNames'},
            {text: 'useRouteParam', link: '/common/router/useRouteParam'},
            {text: 'useRouteView', link: '/common/router/useRouteView'}
        ]
    },
    {
        text: 'Store',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/common/store/'}
        ]
    },
    {
        text: 'Errors',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/common/error/'}
        ]
    },
    {
        text: 'Utilities',
        collapsed: false,
        items: [
            {text: 'Overview', link: '/common/util/'},
            {text: 'emptyNull', link: '/common/util/emptyNull'},
            {text: 'generateColorPalette', link: '/common/util/generateColorPalette'},
            {text: 'guarded', link: '/common/util/guarded'},
            {text: 'onError', link: '/common/util/onError'},
            {text: 'persistentRef', link: '/common/util/persistentRef'},
            {text: 'persistentStringRef', link: '/common/util/persistentStringRef'},
            {text: 'runBefore', link: '/common/util/runBefore'},
            {text: 'unrefAll', link: '/common/util/unrefAll'},
            {text: 'unwrapElement', link: '/common/util/unwrapElement'}
        ]
    }
];
