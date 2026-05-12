import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src/index.ts', './src/vite.ts'],
    minify: 'dce-only',
    deps: {
        neverBundle: ['vite']
    }
});
