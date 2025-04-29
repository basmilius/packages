import { build, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    target: 'browser',
    packages: 'external',
    plugins: [
        dts()
    ]
});
