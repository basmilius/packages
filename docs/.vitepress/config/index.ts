import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';
import examplePlugin from 'vitepress-plugin-example';
import renderPlugin from 'vitepress-plugin-render';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import { nav } from './nav';
import { sidebar } from './sidebars';

const here = fileURLToPath(new URL('.', import.meta.url));
const repo = resolve(here, '../../..');

const alias = {
    '@basmilius/common': resolve(repo, 'packages/common/src/index.ts'),
    '@basmilius/http-client': resolve(repo, 'packages/http-client/src/index.ts'),
    '@basmilius/routing': resolve(repo, 'packages/routing/src/index.ts'),
    '@basmilius/utils': resolve(repo, 'packages/utils/src/index.ts'),
    '@basmilius/tools': resolve(repo, 'packages/tools/src/index.ts'),
    '@basmilius/vite-preset': resolve(repo, 'packages/vite-preset/src/index.ts'),
    '@basmilius/worker': resolve(repo, 'packages/worker/src/index.ts')
};

export default defineConfig({
    title: 'Packages',
    titleTemplate: ':title — Packages',
    description: 'Documentation for the @basmilius monorepo: common, http-client, routing, utils, tools, vite-preset and worker.',
    cleanUrls: true,
    lastUpdated: true,
    sitemap: {
        hostname: 'https://packages.bas.dev'
    },
    head: [
        ['link', {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'}],
        ['link', {rel: 'stylesheet', href: 'https://font.bmcdn.nl/css2?family=inter-variable|jetbrains-mono'}],
        ['meta', {property: 'og:type', content: 'website'}],
        ['meta', {property: 'og:url', content: 'https://packages.bas.dev/'}]
    ],
    markdown: {
        config(md) {
            md.use(examplePlugin);
            md.use(renderPlugin);
            md.use(groupIconMdPlugin);
        }
    },
    vite: {
        resolve: {
            alias
        },
        plugins: [
            groupIconVitePlugin() as any
        ],
        ssr: {
            noExternal: [
                '@basmilius/common',
                '@basmilius/http-client',
                '@basmilius/routing',
                '@basmilius/utils'
            ]
        }
    },
    themeConfig: {
        logo: '/logo.svg',
        nav,
        sidebar,
        search: {
            provider: 'local',
            options: {
                detailedView: true
            }
        },
        socialLinks: [
            {icon: 'github', link: 'https://github.com/basmilius/packages'}
        ],
        editLink: {
            pattern: 'https://github.com/basmilius/packages/edit/main/docs/:path',
            text: 'Edit this page on GitHub'
        },
        footer: {
            message: 'Released under the <a href="https://github.com/basmilius/packages/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2024–present <a href="https://github.com/basmilius">Bas Milius</a>'
        },
        outline: {
            level: [2, 3]
        }
    }
});
