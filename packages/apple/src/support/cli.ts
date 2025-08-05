import { createInterface } from 'node:readline';

const stdin = createInterface({
    input: process.stdin,
    output: process.stdout
});

export function prompt(message: string): Promise<string> {
    return new Promise<string>(resolve => stdin.question(`${message}: `, resolve));
}
