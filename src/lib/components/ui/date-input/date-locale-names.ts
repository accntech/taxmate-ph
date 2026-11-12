const monthNameCache = new Map<string, string[]>();
const weekdayNameCache = new Map<string, string[]>();

function cachedNames(cache: Map<string, string[]>, key: string, build: () => string[]): string[] {
	const cached = cache.get(key);
	if (cached) return cached;

	const names = build();
	cache.set(key, names);
	return names;
}

function buildMonthNames(locale: string): string[] {
	const fmt = new Intl.DateTimeFormat(locale, { month: 'long' });
	return Array.from({ length: 12 }, (_, m) => fmt.format(new Date(Date.UTC(2024, m, 1))));
}

function buildWeekdayNames(locale: string, weekStartsOn: 0 | 1): string[] {
	const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
	const base = Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.UTC(2024, 0, 7 + i))));
	return weekStartsOn === 0 ? base : [...base.slice(1), base[0]];
}

export function monthNames(locale: string): string[] {
	return cachedNames(monthNameCache, locale, () => buildMonthNames(locale));
}

export function weekdayNames(locale: string, weekStartsOn: 0 | 1): string[] {
	return cachedNames(weekdayNameCache, `${locale}:${weekStartsOn}`, () =>
		buildWeekdayNames(locale, weekStartsOn)
	);
}
