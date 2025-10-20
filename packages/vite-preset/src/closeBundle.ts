import type { Plugin } from 'vite';

export default (): Plugin => ({
    name: '@basmilius/vite-preset/close-bundle',

    closeBundle() {
        process.exit(0);
    }
});
