export type BirDispatcherConfig = {
	primaryAddress: string;
	backupAddress: string;
	clientVersion: string;
};

export const defaultBirDispatcherConfig: Readonly<BirDispatcherConfig> = {
	primaryAddress: 'http://birgovph.com/',
	backupAddress: 'http://ws1.birgovph.com/',
	clientVersion: '7.9.6.0'
};

export function isDispatcherAddress(value: unknown): value is string {
	if (typeof value !== 'string' || !/^https?:\/\/[^/\\]/i.test(value) || /[?#]/.test(value)) return false;
	try {
		const url = new URL(value);
		return !url.username && !url.password;
	} catch {
		return false;
	}
}

export function isBirClientVersion(value: unknown): value is string {
	return typeof value === 'string' && /^[0-9]+(?:\.[0-9]+)*$/.test(value);
}
