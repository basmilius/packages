import downloadBlob from './downloadBlob';

export default function (data: string, filename: string, type: string): void {
    const blob = new Blob([data], {type});
    downloadBlob(blob, filename);
}
