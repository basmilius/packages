import type { DefaultTheme } from 'vitepress';

export const vitePreset: DefaultTheme.SidebarItem[] = [
    {
        text: 'Vite Preset',
        items: [
            {text: 'Introduction', link: '/vite-preset/'},
            {text: 'Installation', link: '/vite-preset/installation'}
        ]
    },
    {
        text: 'Configuration',
        collapsed: false,
        items: [
            {text: 'preset', link: '/vite-preset/preset'},
            {text: 'composeLibrary', link: '/vite-preset/composeLibrary'},
            {text: 'advancedAppChunk', link: '/vite-preset/advancedAppChunk'},
            {text: 'advancedLibraryChunk', link: '/vite-preset/advancedLibraryChunk'},
            {text: 'closeBundle', link: '/vite-preset/closeBundle'},
            {text: 'libraries', link: '/vite-preset/libraries'}
        ]
    }
];
