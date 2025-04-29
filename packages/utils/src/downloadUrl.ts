export default function (url: string, filename: string): void {
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}
