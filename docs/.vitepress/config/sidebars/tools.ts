import type { DefaultTheme } from 'vitepress';

export const tools: DefaultTheme.SidebarItem[] = [
    {
        text: 'Tools',
        items: [
            {text: 'Introduction', link: '/tools/'},
            {text: 'Installation', link: '/tools/installation'}
        ]
    },
    {
        text: 'Functions',
        collapsed: false,
        items: [
            {text: 'build', link: '/tools/build'},
            {text: 'clean', link: '/tools/clean'},
            {text: 'copy', link: '/tools/copy'},
            {text: 'dts', link: '/tools/dts'}
        ]
    }
];
