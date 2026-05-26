export default function () {
    return (target: any, method: string): void => {
        target[method] = target[method].bind(target);
    };
}
