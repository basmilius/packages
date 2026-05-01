import type { Plugin } from 'vite';
import composeLibrary from './composeLibrary';

type LibraryPlugin = () => Plugin;

export const flux: LibraryPlugin = composeLibrary({
    name: '@flux-ui/components',
    alias: '~flux',
    peerDependencies: ['luxon', 'vue']
});

export const fluxApplication: LibraryPlugin = composeLibrary({
    name: '@flux-ui/application',
    alias: '~flux/application',
    peerDependencies: ['luxon', 'vue', 'vue-router']
});

export const fluxDashboard: LibraryPlugin = composeLibrary({
    name: '@flux-ui/dashboard',
    alias: '~flux/dashboard',
    peerDependencies: ['luxon', 'vue']
});

export const fluxStatistics: LibraryPlugin = composeLibrary({
    name: '@flux-ui/statistics',
    alias: '~flux/statistics',
    peerDependencies: ['apexcharts', 'lodash-es', 'vue', 'vue-i18n', 'vue3-apexcharts']
});
