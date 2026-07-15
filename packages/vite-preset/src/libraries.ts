import type { Plugin } from 'vite';
import composeLibrary from './composeLibrary';

type LibraryPlugin = () => Plugin;

export const flux: LibraryPlugin = composeLibrary({
    name: '@flux-ui/components',
    alias: '~flux/components',
    peerDependencies: ['luxon', 'vue']
});

export const fluxApplication: LibraryPlugin = composeLibrary({
    name: '@flux-ui/application',
    alias: '~flux/application',
    peerDependencies: ['luxon', 'vue', 'vue-router']
});

export const fluxFlow: LibraryPlugin = composeLibrary({
    name: '@flux-ui/flow',
    alias: '~flux/flow',
    peerDependencies: ['vue']
});

export const fluxStatistics: LibraryPlugin = composeLibrary({
    name: '@flux-ui/statistics',
    alias: '~flux/statistics',
    peerDependencies: ['echarts', 'lodash-es', 'vue', 'vue-i18n']
});

export const fluxVisuals: LibraryPlugin = composeLibrary({
    name: '@flux-ui/visuals',
    alias: '~flux/visuals',
    peerDependencies: ['vue']
});
