import type { DefaultTheme } from 'vitepress';

export const guide: DefaultTheme.SidebarItem[] = [
    {
        text: 'Guide',
        items: [
            {text: 'Introduction', link: '/guide/'},
            {text: 'Getting started', link: '/guide/getting-started'},
            {text: 'Monorepo', link: '/guide/monorepo'},
            {text: 'Conventions', link: '/guide/conventions'},
            {text: 'Contributing', link: '/guide/contributing'}
        ]
    }
];
