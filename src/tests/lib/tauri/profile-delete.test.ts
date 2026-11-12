import { describe, expect, it } from 'vitest';
import { createProfileStoreClient } from '$lib/tauri/profile-store';

describe('taxpayer profile deletion', () => {
	it('deletes the selected profile through the Tauri boundary', async () => {
		const calls: unknown[] = [];
		const client = createProfileStoreClient(async <T>(...args: [string, unknown?, unknown?]) => {
			calls.push(args);
			return undefined as T;
		});
		expect(client).toHaveProperty('delete');
		await expect(client.delete('1234567890000')).resolves.toBeUndefined();
		expect(calls).toEqual([['delete_taxpayer_profile', { id: '1234567890000' }]]);
	});

	it('propagates a disk failure so the UI does not remove an undeleted profile', async () => {
		const failure = { message: 'Permission denied' };
		const client = createProfileStoreClient(async () => { throw failure; });
		expect(client).toHaveProperty('delete');
		await expect(client.delete('1234567890000')).rejects.toEqual(failure);
	});
});
