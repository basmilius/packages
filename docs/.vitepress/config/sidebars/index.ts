import type { DefaultTheme } from 'vitepress';
import { common } from './common';
import { guide } from './guide';
import { httpClient } from './http-client';
import { routing } from './routing';
import { utils } from './utils';
import { vitePreset } from './vite-preset';
import { worker } from './worker';

export const sidebar: DefaultTheme.SidebarMulti = {
    '/guide/': guide,
    '/common/': common,
    '/http-client/': httpClient,
    '/routing/': routing,
    '/utils/': utils,
    '/vite-preset/': vitePreset,
    '/worker/': worker
};
