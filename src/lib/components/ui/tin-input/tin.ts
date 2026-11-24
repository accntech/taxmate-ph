// Normalize TINs with a five-digit branch code.
export function getTinDigits(value: string | null | undefined): string {
	return (value ?? '').replace(/\D/g, '').slice(0, 14);
}

/** Group available digits without completing an unfinished identifier. */
export function formatTinValue(value: string | null | undefined): string {
	const digits = getTinDigits(value);
	return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9), digits.slice(9)]
		.filter(Boolean).join('-');
}

/** Preserve the positions of explicitly delimited segments from a saved draft. */
export function splitTinSegments(value: string): string[] {
	if (value.includes('-')) {
		const segments = value.split('-');
		return [3, 3, 3, 5].map((length, index) => getTinDigits(segments[index]).slice(0, length));
	}
	const digits = getTinDigits(value);
	return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9), digits.slice(9)];
}
