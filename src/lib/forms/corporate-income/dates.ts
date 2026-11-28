import { formatIso, parseIso } from '$lib/components/ui/date-input/date-arithmetic';

export function corporateDateIso(value: string): string | undefined {
	const source = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value);
	const iso = source ? formatIso(Number(source[3]), Number(source[1]), Number(source[2])) : value;
	return parseIso(iso) ? iso : undefined;
}
