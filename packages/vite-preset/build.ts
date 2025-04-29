import { build, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    packages: 'external',
    plugins: [
        dts()
    ]
});
