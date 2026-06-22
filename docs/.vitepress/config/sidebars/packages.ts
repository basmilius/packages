import type { DefaultTheme } from 'vitepress';

export const packages: DefaultTheme.SidebarItem[] = [
    {
        text: 'Packages',
        items: [
            {text: 'Overview', link: '/packages/'}
        ]
    },
    {
        text: 'Vue toolkit',
        collapsed: false,
        items: [
            {text: 'Common', link: '/common/'},
            {text: 'HTTP Client', link: '/http-client/'},
            {text: 'Routing', link: '/routing/'}
        ]
    },
    {
        text: 'Standalone',
        collapsed: false,
        items: [
            {text: 'Utils', link: '/utils/'},
            {text: 'Vite Preset', link: '/vite-preset/'},
            {text: 'Worker', link: '/worker/'}
        ]
    }
];
