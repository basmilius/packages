const DANGEROUS_PROTOCOLS = /^(?:javascript|vbscript|data):/i;
const IGNORED_CHARACTERS = /[\s\p{Cc}\p{Cf}]/gu;

export default function (url: string | null | undefined): boolean {
    if (!url) {
        return false;
    }

    // The scheme is tested without the characters a browser ignores, so it cannot
    // hide behind them as in "java\tscript:alert(1)". The url itself is left
    // alone: a space inside a path or a query is legitimate and the browser
    // encodes it.
    return DANGEROUS_PROTOCOLS.test(url.replace(IGNORED_CHARACTERS, ''));
}
