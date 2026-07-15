import Vue from 'unplugin-vue/rolldown';
import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src/index.ts'],
    minify: true,
    plugins: [Vue({isProduction: true})],
    dts: {vue: true}
});
