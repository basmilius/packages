export default function (url: string): void {
    if (window.location !== window.parent.location) {
        window.open(url, '_top');
    } else {
        window.location.href = url;
    }
}
