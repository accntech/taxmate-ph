import { describe, expect, it } from 'vitest';
import {
	buildProfileFilename,
	buildReturnFilename,
	formatTinInput,
	buildTaxpayerProfileFormValues,
	normalizeTinNumber,
	normalizeTinParts,
	parseTinInput,
	upsertTaxpayerProfile
} from '$lib/profiles/profile';

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

	it('parses one mixed TIN input into taxpayer id parts', () => {
		expect(parseTinInput('421-539-175-0007')).toEqual({
			tin1: '421',
			tin2: '539',
			tin3: '175',
			branchCode: '0007'
		});
	});

	it('formats taxpayer id parts as one readable TIN input', () => {
		expect(
			formatTinInput({
				tin1: '421',
				tin2: '539',
				tin3: '175',
				branchCode: '0007'
			})
		).toBe('421-539-175-0007');
	});

	it('builds the profile filename from taxpayer id fields', () => {
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
			address: '123 Sample Street',
			address2: 'Barangay Example, Makati City',
			zipCode: '1200',
			contactNumber: '09171234567',
			category: 'P',
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
				address: '123 Sample Street',
				address2: 'Barangay Example, Makati City',
				zipCode: '1200',
				contactNumber: '09171234567',
				category: 'P',
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
			address: '',
			address2: '',
			zipCode: '',
			contactNumber: '',
			category: 'P',
			email: 'old@example.com'
		});

		const profiles = upsertTaxpayerProfile(existing, {
			tin1: '123',
			tin2: '456',
			tin3: '789',
			branchCode: '0000',
			rdoCode: '040',
			taxpayerName: 'Updated Name',
			address: '456 Updated Avenue',
			address2: 'Unit 7',
			zipCode: '1229',
			contactNumber: '028888888',
			category: 'G',
			email: 'updated@example.com'
		});

		expect(profiles).toHaveLength(1);
		expect(profiles[0].taxpayerName).toBe('Updated Name');
		expect(profiles[0].address).toBe('456 Updated Avenue');
		expect(profiles[0].category).toBe('G');
		expect(profiles[0].email).toBe('updated@example.com');
	});

	it('maps taxpayer profile fields to the 1601EQ taxpayer section', () => {
		expect(
			buildTaxpayerProfileFormValues({
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
			})
		).toEqual({
			'frm1601EQ:txtTIN1': '123',
			'frm1601EQ:txtTIN2': '456',
			'frm1601EQ:txtTIN3': '789',
			'frm1601EQ:txtBranchCode': '0000',
			'frm1601EQ:txtRDOCode': '040',
			'frm1601EQ:txtTaxpayerName': 'Sample Taxpayer',
			'frm1601EQ:txtAddress': '123 Sample Street',
			'frm1601EQ:txtAddress2': 'Barangay Example, Makati City',
			'frm1601EQ:txtZipCode': '1200',
			'frm1601EQ:txtTelNum': '09171234567',
			'frm1601EQ:optCategory': 'P',
			txtEmail: 'taxpayer@example.com'
		});
	});
});
