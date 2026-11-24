const amountPattern = /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/;

/** Preserve invalid text; only remove separators after validating their grouping. */
export function normalizeCurrencyInput(value: string, allowNegative = false): string | null {
	const candidate = value.trim().replace(/^₱\s*/, '');
	if (!candidate) return value.trim() ? null : '';
	const signed = allowNegative ? candidate.replace(/^\((.*)\)$/, '-$1') : candidate;
	const negative = allowNegative && signed.startsWith('-');
	const unsigned = negative ? signed.slice(1) : signed;
	const magnitude = allowNegative ? unsigned.replace(/^\.(?=\d)/, '0.') : unsigned;
	if (!amountPattern.test(magnitude)) return null;
	const normalized = (negative ? '-' : '') + magnitude.replaceAll(',', '');
	return Number.isFinite(Number(normalized)) ? normalized : null;
}

export type CurrencyDecimals = 0 | 2;

const formatters = {
	0: new Intl.NumberFormat('en-PH', { maximumFractionDigits: 0 }),
	2: new Intl.NumberFormat('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
};

export function roundWholePeso(value: number): number {
	const rounded = Number(value.toFixed(0));
	return rounded === 0 ? 0 : rounded;
}

export function formatCurrencyInput(value: string, decimals: CurrencyDecimals = 2, allowNegative = false): string {
	const normalized = normalizeCurrencyInput(value, allowNegative);
	if (normalized === null || normalized === '') return value;
	const amount = Number(normalized);
	return formatters[decimals].format(decimals === 0 ? roundWholePeso(amount) : amount);
}

export function currencyInputError(value: string, allowNegative = false): string {
	if (normalizeCurrencyInput(value, allowNegative) !== null) return '';
	return allowNegative ? 'Enter an amount such as 1,234.56 or -1,234.56.' : 'Enter an amount such as 1,234.56, zero or greater.';
}

/** Commit editing while preserving blank, invalid and unfinished text. */
export function commitCurrencyInput(value: string, decimals: CurrencyDecimals = 2, allowNegative = false): string {
	const normalized = normalizeCurrencyInput(value, allowNegative);
	if (normalized === null || normalized === '') return normalized ?? value;
	return decimals === 0 ? String(roundWholePeso(Number(normalized))) : normalized;
}
