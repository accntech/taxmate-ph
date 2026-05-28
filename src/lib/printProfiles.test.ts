import { describe, expect, test } from 'vitest'

import { getPrintProfile, printProfiles, type PrintPaperSize } from './printProfiles'

describe('print profiles', () => {
	test('defines the supported paper sizes in UI order', () => {
		expect(printProfiles.map((profile) => profile.size)).toEqual(['letter', 'a4', 'long'])
	})

	test.each([
		['letter', '8.5in', '11in', '0.75'],
		['a4', '210mm', '297mm', '0.74'],
		['long', '8.5in', '13in', '0.82']
	] satisfies [PrintPaperSize, string, string, string][])(
		'maps %s to exact PDF dimensions',
		(size, width, height, scale) => {
			expect(getPrintProfile(size)).toMatchObject({ size, width, height, scale })
		}
	)

	test('falls back to letter for an unknown value', () => {
		expect(getPrintProfile('unknown')).toMatchObject({ size: 'letter' })
	})
})
