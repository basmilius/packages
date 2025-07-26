import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import type { Plugin, UserConfig } from 'vite';
import { searchForWorkspaceRoot } from 'vite';

type ComposePlugin = () => Plugin;
type PathGenerator = (name: string) => string;

type Options = {
    readonly name: string;
    readonly alias: string;
    readonly sourcesPathGenerator?: PathGenerator;
    readonly tsAliasPathGenerator?: PathGenerator;
};

const TSCONFIG_FILES = ['tsconfig.app.json', 'tsconfig.json'] as const;
const WORKING_DIR = process.cwd();
const WORKSPACE_ROOT = searchForWorkspaceRoot(WORKING_DIR);
const WORKSPACE_NODE_MODULES = join(relative(WORKING_DIR, WORKSPACE_ROOT), 'node_modules');

const defaultSourcesPathGenerator: PathGenerator = name => resolve(WORKING_DIR, `${WORKSPACE_NODE_MODULES}/${name}/src`);
const defaultTsAliasPathGenerator: PathGenerator = name => `${WORKSPACE_NODE_MODULES}/${name}/src/*`;

export default (options: Options): ComposePlugin => {
    const sourcesPathGenerator = options.sourcesPathGenerator ?? defaultSourcesPathGenerator;
    const tsAliasPathGenerator = options.tsAliasPathGenerator ?? defaultTsAliasPathGenerator;

    const src = sourcesPathGenerator(options.name);

    return (): Plugin => ({
        name: options.name,

        config: (): UserConfig => ({
            optimizeDeps: {
                exclude: [options.name]
            },
            resolve: {
                alias: {
                    [options.name]: src,
                    [options.alias]: src
                }
            },
            server: {
                fs: {
                    allow: [src]
                }
            }
        }),

        configResolved(config): void {
            let tsconfigPath: string;

            for (const file of TSCONFIG_FILES) {
                if (existsSync(join(config.root, file))) {
                    tsconfigPath = join(config.root, file);
                    break;
                }
            }

            if (!tsconfigPath) {
                config.logger.error(`[${options.name}] A tsconfig.json is required for this library. Please create one.`);
                process.exit(1);
            }

            const key = `${options.alias}/*`;
            const tsconfigData = readFileSync(tsconfigPath, {encoding: 'utf-8'});
            const tsconfig = JSON.parse(tsconfigData);
            tsconfig.compilerOptions.paths ??= {};

            if (key in tsconfig.compilerOptions.paths) {
                return;
            }

            tsconfig.compilerOptions.paths[key] = [tsAliasPathGenerator(options.name)];

            writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 4), {encoding: 'utf-8'});
        }
    });
};
