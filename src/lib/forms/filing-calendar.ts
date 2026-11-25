export function philippineCalendarDate(now = new Date()): { year: number; month: number; day: number } {
	// Philippine civil time is UTC+08:00, independent of the desktop time zone.
	const manila = new Date(now.getTime() + 8 * 60 * 60 * 1000);
	return { year: manila.getUTCFullYear(), month: manila.getUTCMonth() + 1, day: manila.getUTCDate() };
}
