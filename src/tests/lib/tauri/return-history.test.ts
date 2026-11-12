import { expect, test } from 'vitest';
import { createReturnHistoryClient } from '$lib/tauri/return-history';

test('loads persisted submitted returns through the history command', async () => {
	const calls: string[] = [];
	const rows = [{ id: 'submission-1', formCode: '1601EQ' }];
	const client = createReturnHistoryClient(async <T>(command: string) => {
		calls.push(command);
		return rows as T;
	});
	await expect(client.load()).resolves.toEqual(rows);
	expect(calls).toEqual(['list_submitted_returns']);
});
