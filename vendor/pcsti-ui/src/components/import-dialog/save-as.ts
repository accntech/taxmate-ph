type Producer = () => Promise<Uint8Array | ArrayBuffer | Blob>;

export const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export async function saveAs(
	filename: string,
	mimeType: string,
	_description: string,
	produce: Producer
): Promise<boolean> {
	const blob = toBlob(await produce(), mimeType);
	saveBlob(blob, filename);
	return true;
}

export function saveBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 0);
}

function toBlob(data: Uint8Array | ArrayBuffer | Blob, mimeType: string): Blob {
	if (data instanceof Blob) return data;
	if (data instanceof Uint8Array) {
		const out = new ArrayBuffer(data.byteLength);
		new Uint8Array(out).set(data);
		return new Blob([out], { type: mimeType });
	}
	return new Blob([data], { type: mimeType });
}
