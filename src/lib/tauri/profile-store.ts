import { invoke } from '@tauri-apps/api/core';

import type { TaxpayerProfile } from '$lib/profiles/profile';

export type SavedTaxpayerProfile = TaxpayerProfile;

export type TaxpayerProfileSaveReceipt = {
	profile: SavedTaxpayerProfile;
	path: string;
};

export type ProfileStoreError = {
	message: string;
};

export type ProfileStoreClient = {
	save: (profile: SavedTaxpayerProfile) => Promise<TaxpayerProfileSaveReceipt>;
	load: () => Promise<SavedTaxpayerProfile[]>;
	delete: (id: string) => Promise<void>;
};

export function createProfileStoreClient(
	call: typeof invoke = invoke
): ProfileStoreClient {
	return {
		save: (profile) => call<TaxpayerProfileSaveReceipt>('save_taxpayer_profile', { profile }),
		load: () => call<SavedTaxpayerProfile[]>('list_taxpayer_profiles'),
		delete: (id) => call<void>('delete_taxpayer_profile', { id })
	};
}

export function formatProfileStoreError(error: unknown): string {
	if (isProfileStoreError(error)) {
		return error.message;
	}

	if (error instanceof Error) {
		return error.message;
	}

	return String(error);
}

function isProfileStoreError(error: unknown): error is ProfileStoreError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as { message: unknown }).message === 'string'
	);
}
