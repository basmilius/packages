import { build, clean, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    packages: 'external',
    plugins: [
        clean('dist'),
        dts()
    ]
});
