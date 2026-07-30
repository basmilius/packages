export default async function (text: string): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(text);

        return true;
    } catch {
        // The browser rejects the write outside a user gesture and on an insecure
        // origin, so a caller only confirms the copy when this resolves to true.
        return false;
    }
}
