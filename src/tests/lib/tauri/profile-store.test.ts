import { describe, expect, test } from 'vitest';

import {
	createProfileStoreClient,
	type SavedTaxpayerProfile,
	type TaxpayerProfileSaveReceipt
} from '$lib/tauri/profile-store';

describe('createProfileStoreClient', () => {
	test('saves taxpayer profiles through the Tauri profile command', async () => {
		const profile: SavedTaxpayerProfile = {
			id: '1234567890000',
			tin1: '123',
			tin2: '456',
			tin3: '789',
			branchCode: '0000',
			rdoCode: '040',
			taxpayerName: 'Sample Taxpayer',
			address: '123 Sample Street',
			address2: 'Barangay Example, Makati City',
			zipCode: '1200',
			contactNumber: '09171234567',
			category: 'P',
			email: 'taxpayer@example.com'
		};
		const receipt: TaxpayerProfileSaveReceipt = {
			profile,
			path: '/tmp/profile/1234567890000.xml'
		};
		const calls: unknown[] = [];
		const client = createProfileStoreClient(async <T>(...args: [string, unknown?, unknown?]) => {
			calls.push(args);

			return receipt as T;
		});

		await expect(client.save(profile)).resolves.toEqual(receipt);
		expect(calls).toEqual([['save_taxpayer_profile', { profile }]]);
	});

	test('loads taxpayer profiles through the Tauri profile command', async () => {
		const profiles: SavedTaxpayerProfile[] = [
			{
				id: '1234567890000',
				tin1: '123',
				tin2: '456',
				tin3: '789',
				branchCode: '0000',
				rdoCode: '040',
				taxpayerName: 'Sample Taxpayer',
				address: '123 Sample Street',
				address2: 'Barangay Example, Makati City',
				zipCode: '1200',
				contactNumber: '09171234567',
				category: 'P',
				email: 'taxpayer@example.com'
			}
		];
		const calls: unknown[] = [];
		const client = createProfileStoreClient(async <T>(...args: [string, unknown?, unknown?]) => {
			calls.push(args);

			return profiles as T;
		});

		await expect(client.load()).resolves.toEqual(profiles);
		expect(calls).toEqual([['list_taxpayer_profiles']]);
	});
});
