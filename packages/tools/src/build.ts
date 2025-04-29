import type { BuildConfig } from 'bun';
import { build } from 'bun';

export default async function (config: Partial<BuildConfig> & Pick<BuildConfig, 'entrypoints'>) {
    try {
        config.root ??= 'src';
        config.outdir ??= 'dist';
        config.minify ??= true;
        config.sourcemap ??= 'linked';
        config.splitting ??= false;
        config.format ??= 'esm';
        config.target ??= 'node';

        await build(config);

        console.log('✔ Build complete!');
    } catch (err) {
        console.error('✘ Build failed!');
        console.error(err);
        process.exit(1);
    }
}
