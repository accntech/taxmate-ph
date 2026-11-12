import { invoke } from '@tauri-apps/api/core';

export type SubmittedReturn = {
	id: string;
	/** Unix milliseconds; legacy imports use the saved file's modification time. */
	submittedAt: number;
	formCode: string;
	returnPeriod: string;
	taxpayerName: string;
	tin: string;
	amountDue: string;
	amended: boolean;
	savePath: string;
};

export type ReturnHistoryClient = {
	load: () => Promise<SubmittedReturn[]>;
};

export function createReturnHistoryClient(call: typeof invoke = invoke): ReturnHistoryClient {
	return { load: () => call<SubmittedReturn[]>('list_submitted_returns') };
}
