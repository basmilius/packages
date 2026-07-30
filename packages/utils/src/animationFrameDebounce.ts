export default function <T extends () => void | Promise<void>>(fn: T): T {
    // Without rAF there is no frame to paint, so the callback is dropped rather
    // than run: every caller is scheduling DOM work that must not happen on the
    // server.
    if (typeof requestAnimationFrame === 'undefined') {
        return (() => {
        }) as T;
    }

    let animationFrame = 0;

    return (() => {
        cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(fn);
    }) as T;
}
