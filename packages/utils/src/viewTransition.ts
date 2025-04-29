export default function (fn: Function): void {
    if ('startViewTransition' in document) {
        (document.startViewTransition as Function)(fn);
    } else {
        fn();
    }
}
