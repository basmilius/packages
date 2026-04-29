import type { DefaultTheme } from 'vitepress';

export const routing: DefaultTheme.SidebarItem[] = [
    {
        text: 'Routing',
        items: [
            {text: 'Introduction', link: '/routing/'},
            {text: 'Installation', link: '/routing/installation'},
            {text: 'createRouter', link: '/routing/createRouter'},
            {text: 'Types', link: '/routing/types'}
        ]
    },
    {
        text: 'Guides',
        collapsed: false,
        items: [
            {text: 'Modal routing', link: '/routing/guide/modal-routing'},
            {text: 'Slot props', link: '/routing/guide/slot-props'}
        ]
    },
    {
        text: 'Components',
        collapsed: false,
        items: [
            {text: 'ModalRouterView', link: '/routing/component/ModalRouterView'},
            {text: 'RouterLink', link: '/routing/component/RouterLink'},
            {text: 'RouterView', link: '/routing/component/RouterView'}
        ]
    },
    {
        text: 'Composables',
        collapsed: false,
        items: [
            {text: 'useIsView', link: '/routing/composable/useIsView'},
            {text: 'useModalRoute', link: '/routing/composable/useModalRoute'},
            {text: 'useNamedRoute', link: '/routing/composable/useNamedRoute'},
            {text: 'useNavigate', link: '/routing/composable/useNavigate'},
            {text: 'useRoute', link: '/routing/composable/useRoute'},
            {text: 'useRouteMeta', link: '/routing/composable/useRouteMeta'},
            {text: 'useRouteNames', link: '/routing/composable/useRouteNames'},
            {text: 'useRouteParam', link: '/routing/composable/useRouteParam'},
            {text: 'useRouteView', link: '/routing/composable/useRouteView'}
        ]
    }
];
