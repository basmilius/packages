import type { DefaultTheme } from 'vitepress';

export const nav: DefaultTheme.NavItem[] = [
    {
        text: 'Guide',
        link: '/guide/',
        activeMatch: '^/guide/'
    },
    {
        text: 'Packages',
        activeMatch: '^/(packages|common|http-client|routing|utils|vite-preset|worker)/',
        items: [
            {text: 'Overview', link: '/packages/'},
            {
                text: 'Vue toolkit',
                items: [
                    {text: 'Common', link: '/common/'},
                    {text: 'HTTP Client', link: '/http-client/'},
                    {text: 'Routing', link: '/routing/'}
                ]
            },
            {
                text: 'Standalone',
                items: [
                    {text: 'Utils', link: '/utils/'},
                    {text: 'Vite Preset', link: '/vite-preset/'},
                    {text: 'Worker', link: '/worker/'}
                ]
            }
        ]
    },
    {
        text: 'Links',
        items: [
            {text: 'GitHub', link: 'https://github.com/basmilius/packages'},
            {text: 'NPM', link: 'https://www.npmjs.com/org/basmilius'}
        ]
    }
];
