import { build, clean, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    target: 'browser',
    external: [
        '@basmilius/http-client',
        '@basmilius/utils',
        '@flux-ui/components',
        '@flux-ui/internals',
        'pinia',
        'vue',
        'vue-router'
    ],
    plugins: [
        clean('./dist'),
        dts()
    ]
});
