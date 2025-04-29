import downloadUrl from './downloadUrl';

export default function (blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    downloadUrl(url, filename);
    URL.revokeObjectURL(url);
}
