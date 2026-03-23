import { resolve } from 'node:path';
import { camelCase, kebabCase } from 'change-case';
import { patchCssModules } from 'vite-css-modules';
import type { Plugin } from 'vite';
import { searchForWorkspaceRoot } from 'vite';
import className from 'css-class-generator';
import libAssets from '@laynezh/vite-plugin-lib-assets';
import libDts from 'vite-plugin-dts';

type Options = {
    readonly cssModules?: {
        readonly classNames?: 'mangled' | 'camel' | 'kebab';
        readonly generateScopedName?: (name: string, filename: string, css: string) => string;
        readonly prefix?: string;
    };
    readonly assetFileNames?: string;
    readonly fileNames?: 'hashes' | 'actual';
    readonly isLibrary?: boolean;
    readonly tsconfigPath?: string;
};

const preset = (options: Options): Plugin => {
    const visitedClasses: string[] = [];

    function generateScopedName(name: string): string {
        if (name.startsWith('i__const_')) {
            name = name.substring(9);
            name = name.substring(0, name.length - 2);
        }

        const prefix = options.cssModules?.prefix ?? '';

        if (options.cssModules?.classNames === 'camel') {
            return prefix + camelCase(name);
        }

        if (options.cssModules?.classNames === 'kebab') {
            return prefix + kebabCase(name);
        }

        if (visitedClasses.includes(name)) {
            return prefix + className(visitedClasses.indexOf(name));
        }
    
        return prefix + className(visitedClasses.push(name) - 1);
    }

    return {
        name: '@basmilius/vite-preset',

        config: () => ({
            build: {
                assetsInlineLimit: 0,
                cssMinify: options.isLibrary ? false : 'lightningcss',
                minify: options.isLibrary ? false : 'oxc',
                rolldownOptions: {
                    output: {
                        assetFileNames: options.fileNames === 'actual' || options.isLibrary ? undefined : '[hash].[ext]',
                        chunkFileNames: options.fileNames === 'actual' || options.isLibrary ? undefined : '[hash].js',
                        entryFileNames: options.fileNames === 'actual' || options.isLibrary ? undefined : '[hash].js',
                        minifyInternalExports: true
                    }
                }
            },
            css: {
                preprocessorMaxWorkers: true,
                preprocessorOptions: {
                    scss: {
                        api: 'modern-compiler'
                    }
                },
                modules: {
                    generateScopedName: options.cssModules?.generateScopedName ?? generateScopedName
                }
            },
            json: {
                stringify: true
            },
            resolve: {
                alias: {
                    '@': resolve(process.cwd(), './src')
                },
                extensions: [
                    '.js',
                    '.ts',
                    '.json',
                    '.vue'
                ]
            },
            server: {
                fs: {
                    allow: [
                        searchForWorkspaceRoot(process.cwd())
                    ]
                }
            }
        })
    };
};

export default (options: Options = {}): Plugin[] => {
    const plugins: Plugin[] = [
        patchCssModules() as unknown as Plugin,
        preset(options)
    ];

    if (options.isLibrary) {
        plugins.push(libAssets({
            limit: 0,
            name: options.assetFileNames ?? '[contenthash:8].[ext]'
        }) as unknown as Plugin);

        plugins.push(libDts({
            cleanVueFileName: false,
            copyDtsFiles: true,
            staticImport: true,
            tsconfigPath: options.tsconfigPath
        }) as unknown as Plugin);
    }

    return plugins;
};
