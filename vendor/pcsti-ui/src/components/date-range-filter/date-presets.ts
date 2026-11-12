export type DatePreset = 'today' | 'yesterday' | 'last7' | 'last30' | 'thisMonth' | 'lastMonth';

export const DATE_PRESETS: { key: DatePreset; label: string }[] = [
	{ key: 'today', label: 'Today' },
	{ key: 'yesterday', label: 'Yesterday' },
	{ key: 'last7', label: 'Last 7 days' },
	{ key: 'last30', label: 'Last 30 days' },
	{ key: 'thisMonth', label: 'This month' },
	{ key: 'lastMonth', label: 'Last month' }
];

type DateRange = {
	from: string;
	to: string;
};

function pad2(value: number): string {
	return value < 10 ? `0${value}` : String(value);
}

function toIsoDate(date: Date): string {
	return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

function startOfLocalDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dayOffset(base: Date, offset: number): Date {
	return new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
}

function getPresetDates(preset: DatePreset, today: Date): { from: Date; to: Date } {
	const ranges: Record<DatePreset, { from: Date; to: Date }> = {
		today: { from: today, to: today },
		yesterday: { from: dayOffset(today, -1), to: dayOffset(today, -1) },
		last7: { from: dayOffset(today, -6), to: today },
		last30: { from: dayOffset(today, -29), to: today },
		thisMonth: { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today },
		lastMonth: {
			from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
			to: new Date(today.getFullYear(), today.getMonth(), 0)
		}
	};
	return ranges[preset];
}

export function getDatePresetRange(preset: DatePreset, baseDate = new Date()): DateRange {
	const { from, to } = getPresetDates(preset, startOfLocalDay(baseDate));
	return { from: toIsoDate(from), to: toIsoDate(to) };
}

export function isValidIsoDate(value: string): boolean {
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (!match) return false;

	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const date = new Date(year, month - 1, day);
	return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function dateRangeChipValue(input: {
	from: string | null | undefined;
	to: string | null | undefined;
	format?: (value: string) => string;
	fromLabel?: string;
	untilLabel?: string;
	separator?: string;
}): string {
	const format = input.format ?? ((value: string) => value);
	const from = input.from ? format(input.from) : '';
	const to = input.to ? format(input.to) : '';
	if (from && to) return input.from === input.to ? from : `${from}${input.separator ?? ' - '}${to}`;
	if (from) return `${input.fromLabel ?? 'from'} ${from}`;
	if (to) return `${input.untilLabel ?? 'until'} ${to}`;
	return '';
}
