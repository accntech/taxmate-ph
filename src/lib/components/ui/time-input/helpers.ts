export type DigitSegment = 'hour' | 'minute';
export type Period = 'AM' | 'PM';

export type ParsedTimeValue = {
	hour12: string;
	minute: string;
	period: Period;
};

export type BackspaceBufferResult = {
	shouldRetreat: boolean;
	nextValue: string | null;
};

const autoAdvanceMinimum: Record<DigitSegment, number> = {
	hour: 2,
	minute: 6
};

const periodHourOffset: Record<Period, number> = {
	AM: 0,
	PM: 12
};

export function pad2(value: number): string {
	return String(value).padStart(2, '0');
}

export function digitBufferIsComplete(segment: DigitSegment, buffer: string): boolean {
	return (
		buffer.length >= 2 || (buffer.length === 1 && Number(buffer) >= autoAdvanceMinimum[segment])
	);
}

export function parseTimeValue(value: string | null | undefined): ParsedTimeValue | null {
	const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec((value ?? '').trim());
	if (!match) return null;

	const hour24 = Number(match[1]);
	return {
		hour12: pad2(hour24 % 12 === 0 ? 12 : hour24 % 12),
		minute: match[2],
		period: hour24 >= 12 ? 'PM' : 'AM'
	};
}

export function formatTimeValue(
	hour12: string | null,
	minute: string | null,
	period: Period | null
): string | null {
	if ([hour12, minute, period].includes(null)) return null;

	const hour24 = (Number(hour12) % 12) + periodHourOffset[period!];
	return `${pad2(hour24)}:${pad2(Number(minute))}`;
}

export function backspaceDigitBuffer(buffer: string): BackspaceBufferResult {
	if (buffer.length === 0) return { shouldRetreat: true, nextValue: null };

	const next = buffer.slice(0, -1);
	return { shouldRetreat: false, nextValue: next === '' ? null : next };
}
