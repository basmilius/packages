export default function (): boolean {
    return globalThis.window?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}
