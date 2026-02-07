import { build, clean, dts } from './src';

await build({
    entrypoints: ['src/index.ts'],
    packages: 'external',
    plugins: [
        clean('dist'),
        dts()
    ]
});
