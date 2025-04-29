export default function (elm: unknown): elm is HTMLElement {
    if (!globalThis.document) {
        return false;
    }

    return elm instanceof HTMLElement;
}
