export type DateParts = { y: number; m: number; d: number };

const ISO_SHAPE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function daysInMonth(year: number, month: number): number {
	return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function parseIsoMatch(s: string): DateParts | null {
	const match = ISO_SHAPE.exec(s);
	if (!match) return null;

	return {
		y: Number(match[1]),
		m: Number(match[2]),
		d: Number(match[3])
	};
}

function isValidDatePart({ y, m, d }: DateParts): boolean {
	return m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

export function parseIso(s: string): DateParts | null {
	if (typeof s !== 'string') return null;

	const parts = parseIsoMatch(s);
	if (!parts || !isValidDatePart(parts)) return null;

	return parts;
}

export function formatIso(y: number, m: number, d: number): string {
	return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function firstWeekdayOfMonth(year: number, month: number): number {
	return new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
}

export function addMonths(y: number, m: number, delta: number): { y: number; m: number } {
	const zero = y * 12 + (m - 1) + delta;
	return { y: Math.floor(zero / 12), m: (((zero % 12) + 12) % 12) + 1 };
}

export function addYears(y: number, m: number, delta: number): { y: number; m: number } {
	return { y: y + delta, m };
}

export function isWithin(iso: string, min?: string, max?: string): boolean {
	if (min && iso < min) return false;
	if (max && iso > max) return false;
	return true;
}

export function clampIso(iso: string, min?: string, max?: string): string {
	if (min && iso < min) return min;
	if (max && iso > max) return max;
	return iso;
}
