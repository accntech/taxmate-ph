export type NumberInputOptions = { min?: number; max?: number; decimal?: boolean };

/** Validate without changing the stored text or rounding the entered value. */
export function numberInputError(value: string, { min, max, decimal = false }: NumberInputOptions = {}): string {
	if (!value) return '';
	const pattern = decimal ? /^-?\d+(?:\.\d+)?$/ : /^-?\d+$/;
	if (!pattern.test(value) || !Number.isFinite(Number(value))) {
		return decimal ? 'Enter a valid number.' : 'Enter a whole number.';
	}
	const number = Number(value);
	if (min !== undefined && number < min) return `Enter a number of ${min} or more.`;
	if (max !== undefined && number > max) return `Enter a number of ${max} or less.`;
	return '';
}
