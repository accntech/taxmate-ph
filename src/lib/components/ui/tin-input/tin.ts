// Adapted from PCSTI's TIN helper for this app's four-digit branch code.
export function getTinDigits(value: string | null | undefined): string {
	return (value ?? '').replace(/\D/g, '').slice(0, 13);
}

/** Group available digits without completing an unfinished identifier. */
export function formatTinValue(value: string | null | undefined): string {
	const digits = getTinDigits(value);
	return [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9), digits.slice(9)]
		.filter(Boolean).join('-');
}
