import { describe, expect, it } from 'vitest';
import {
	buildProfileFilename,
	buildReturnFilename,
	normalizeTinNumber,
	normalizeTinParts,
	upsertTaxpayerProfile
} from './profile';

describe('profile helpers', () => {
	it('normalizes TIN parts into the legacy taxpayer id', () => {
		expect(
			normalizeTinParts({
				tin1: '123',
				tin2: '456',
				tin3: '789',
				branchCode: '0000'
			})
		).toBe('1234567890000');
	});

	it('normalizes dispatcher TIN without the branch code', () => {
		expect(
			normalizeTinNumber({
				tin1: '421',
				tin2: '539',
				tin3: '175'
			})
		).toBe('421539175');
	});

	it('builds the legacy profile filename from taxpayer id fields', () => {
		expect(
			buildProfileFilename({
				tin1: '123',
				tin2: '456',
				tin3: '789',
				branchCode: '0000'
			})
		).toBe('1234567890000.xml');
	});

	it('builds a return filename using the legacy form and return period format', () => {
		expect(
			buildReturnFilename({
				tin1: '123',
				tin2: '456',
				tin3: '789',
				branchCode: '0000',
				formCode: '1601EQ',
				returnPeriod: '2026Q1'
			})
		).toBe('1234567890000-1601EQ-2026Q1.xml');
	});

	it('adds a taxpayer profile using the normalized tin as its stable id', () => {
		const profiles = upsertTaxpayerProfile([], {
			tin1: '123',
			tin2: '456',
			tin3: '789',
			branchCode: '0000',
			rdoCode: '040',
			taxpayerName: 'Sample Taxpayer',
			email: 'taxpayer@example.com'
		});

		expect(profiles).toEqual([
			{
				id: '1234567890000',
				tin1: '123',
				tin2: '456',
				tin3: '789',
				branchCode: '0000',
				rdoCode: '040',
				taxpayerName: 'Sample Taxpayer',
				email: 'taxpayer@example.com'
			}
		]);
	});

	it('updates an existing taxpayer profile instead of duplicating the same tin', () => {
		const existing = upsertTaxpayerProfile([], {
			tin1: '123',
			tin2: '456',
			tin3: '789',
			branchCode: '0000',
			rdoCode: '040',
			taxpayerName: 'Old Name',
			email: 'old@example.com'
		});

		const profiles = upsertTaxpayerProfile(existing, {
			tin1: '123',
			tin2: '456',
			tin3: '789',
			branchCode: '0000',
			rdoCode: '040',
			taxpayerName: 'Updated Name',
			email: 'updated@example.com'
		});

		expect(profiles).toHaveLength(1);
		expect(profiles[0].taxpayerName).toBe('Updated Name');
		expect(profiles[0].email).toBe('updated@example.com');
	});
});
