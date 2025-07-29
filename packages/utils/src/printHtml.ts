export default async function (html: string): Promise<void> {
    const frame = document.createElement('iframe');
    frame.style.position = 'fixed';
    frame.style.top = '-100dvh';
    frame.style.left = '-100dvw';
    frame.style.width = '1px';
    frame.style.height = '1px';

    document.body.appendChild(frame);

    const doc = frame.contentDocument ?? frame.contentWindow?.document;

    if (!doc) {
        document.body.removeChild(frame);
        throw new Error('Cannot print, no access to the framed document.');
    }

    doc.documentElement.innerHTML = html;

    const images: HTMLImageElement[] = Array.from(doc.getElementsByTagName('img'));
    await Promise.all(images.map(image => new Promise(resolve => {
        if (image.complete) {
            resolve(undefined);
        } else {
            image.addEventListener('load', resolve, {passive: true});
            image.addEventListener('error', resolve, {passive: true});
        }
    })));

    frame.contentWindow?.print();

    setTimeout(() => {
        document.body.removeChild(frame);
    }, 1000);
}
