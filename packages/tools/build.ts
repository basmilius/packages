import { build, dts } from './src';

await build({
    entrypoints: ['src/index.ts'],
    packages: 'external',
    plugins: [
        dts()
    ]
});
