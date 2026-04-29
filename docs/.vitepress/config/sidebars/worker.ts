import type { DefaultTheme } from 'vitepress';

export const worker: DefaultTheme.SidebarItem[] = [
    {
        text: 'Worker',
        items: [
            {text: 'Introduction', link: '/worker/'},
            {text: 'Installation', link: '/worker/installation'},
            {text: 'createWorker', link: '/worker/createWorker'},
            {text: 'Types', link: '/worker/types'}
        ]
    },
    {
        text: 'Helpers',
        collapsed: false,
        items: [
            {text: 'Request helpers', link: '/worker/request'},
            {text: 'Response helpers', link: '/worker/response'},
            {text: 'Errors', link: '/worker/error'}
        ]
    }
];
