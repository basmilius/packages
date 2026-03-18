export default function (url: string, filename: string): void {
    if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('blob:')) {
        throw new Error(`Unsupported URL scheme for download: ${url}`);
    }

    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}
