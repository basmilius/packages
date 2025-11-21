import type { BunPlugin } from 'bun';
import { pathToFileURL } from 'bun';
import { copyFile } from 'node:fs/promises';

export default function (src: string, dest: string): BunPlugin {
    return {
        name: 'copy',

        setup(builder) {
            builder.onEnd(async () => {
                await copyFile(pathToFileURL(src), pathToFileURL(dest));
            });
        }
    };
}
