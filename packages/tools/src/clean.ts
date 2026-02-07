import type { BunPlugin } from 'bun';
import { exists, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

export default function (dir: string): BunPlugin {
    return {
        name: 'clean',

        async setup() {
            const path = resolve(dir);

            if (!await exists(path)) {
                return;
            }

            await rm(dir, {
                recursive: true
            });
        }
    };
}
