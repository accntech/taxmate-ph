export type CurrencyBounds = {
	min?: number;
	max?: number;
};

const emptyCurrencyValues = new Set(['', '-', '.']);

export function parseCurrencyValue(value: string): number | null {
	const cleaned = value.replace(/[^\d.\-]/g, '');
	if (emptyCurrencyValues.has(cleaned)) return null;

	const parsed = Number(cleaned);
	return Number.isFinite(parsed) ? parsed : null;
}

export function clampCurrencyValue(value: number, { min, max }: CurrencyBounds): number {
	if (min !== undefined && value < min) return min;
	if (max !== undefined && value > max) return max;
	return value;
}
