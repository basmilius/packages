export default function emptyNull(str: string | undefined | null): string | null {
    return str || null;
}
