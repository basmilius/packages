import type { BunPlugin } from 'bun';
import { file, pathToFileURL, write } from 'bun';
import { isolatedDeclaration } from 'oxc-transform';

export default function (): BunPlugin {
    const visited = new Set<string>();

    return {
        name: 'oxc-transform-dts',

        setup(builder) {
            if (!builder.config.root || !builder.config.outdir) {
                console.warn('✘ No types generated, osx-transform-dts requires both a root and outdir.');
                return;
            }

            const rootPath = pathToFileURL(builder.config.root).pathname;
            const outPath = pathToFileURL(builder.config.outdir).pathname;

            builder.onStart(() => {
                visited.clear();
            });

            builder.onLoad({filter: /\.ts$/}, async args => {
                if (args.path.startsWith(rootPath) && !visited.has(args.path)) {
                    visited.add(args.path);

                    const {code} = await isolatedDeclaration(
                        args.path,
                        await file(args.path).text()
                    );

                    await write(
                        args.path
                            .replace(new RegExp(`^${rootPath}`), outPath)
                            .replace(/\.ts$/, '.d.ts'),
                        code
                    );
                }

                return undefined;
            });
        }
    };
}
