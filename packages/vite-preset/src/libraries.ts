import type { Plugin } from 'vite';
import composeLibrary from './composeLibrary';

type LibraryPlugin = () => Plugin;

export const flux: LibraryPlugin = composeLibrary({
    name: '@flux-ui/components',
    alias: '$flux'
});

export const fluxApplication: LibraryPlugin = composeLibrary({
    name: '@flux-ui/application',
    alias: '$fluxApplication'
});

export const fluxDashboard: LibraryPlugin = composeLibrary({
    name: '@flux-ui/dashboard',
    alias: '$fluxDashboard'
});

export const fluxStatistics: LibraryPlugin = composeLibrary({
    name: '@flux-ui/statistics',
    alias: '$fluxStatistics'
});
