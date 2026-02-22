import { build, clean, copy, dts } from '@basmilius/tools';

await build({
    entrypoints: ['src/index.ts'],
    target: 'browser',
    packages: 'external',
    plugins: [
        clean('dist'),
        copy('src/type/index.ts', 'dist/type.d.ts'),
        dts()
    ]
});
