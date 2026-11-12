const amountPattern = /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;

/** Preserve invalid text; only remove separators after validating their grouping. */
export function normalizeCurrencyInput(value: string): string | null {
	const candidate = value.trim().replace(/^₱\s*/, '');
	if (!candidate) return value.trim() ? null : '';
	if (!amountPattern.test(candidate)) return null;
	const normalized = candidate.replaceAll(',', '');
	return Number.isFinite(Number(normalized)) ? normalized : null;
}

const formatter = new Intl.NumberFormat('en-PH', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});

export function formatCurrencyInput(value: string): string {
	const normalized = normalizeCurrencyInput(value);
	return normalized === null || normalized === '' ? value : formatter.format(Number(normalized));
}

export function currencyInputError(value: string): string {
	return normalizeCurrencyInput(value) === null ? 'Enter an amount such as 1,234.56, zero or greater.' : '';
}

/** Commit editing without changing invalid or unfinished text. */
export function commitCurrencyInput(value: string): string {
	return normalizeCurrencyInput(value) ?? value;
}
