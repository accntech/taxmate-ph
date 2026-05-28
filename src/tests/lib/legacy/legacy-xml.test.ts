import { describe, expect, test } from 'vitest'
import { parseLegacyXml, serializeLegacyXml } from '$lib/legacy/xml'

const xmlDeclaration = '<?xml version=\'1.0\'?>'
const legacyFooter = 'All Rights Reserved BIR 2012.0'

describe('serializeLegacyXml', () => {
	test('serializes text fields as legacy div records', () => {
		expect(serializeLegacyXml({ txtLastName: 'Santos' })).toBe(
			xmlDeclaration + '<div>txtLastName=SantostxtLastName=</div>' + legacyFooter
		)
	})

	test('serializes boolean and numeric values as text', () => {
		expect(serializeLegacyXml({ chkAmended: true, txtTaxDue: 1234.5 })).toBe(
			xmlDeclaration +
				'<div>chkAmended=truechkAmended=</div>' +
				'<div>txtTaxDue=1234.5txtTaxDue=</div>' +
				legacyFooter
		)
	})

	test('serializes field ids with colons', () => {
		expect(serializeLegacyXml({ 'frm1601EQ:txtTIN1': '123' })).toBe(
			xmlDeclaration +
				'<div>frm1601EQ:txtTIN1=123frm1601EQ:txtTIN1=</div>' +
				legacyFooter
		)
	})

	test('escapes text values', () => {
		expect(serializeLegacyXml({ txtName: 'A & B <C>' })).toBe(
			xmlDeclaration +
				'<div>txtName=A &amp; B &lt;C&gt;txtName=</div>' +
				legacyFooter
		)
	})
})

describe('parseLegacyXml', () => {
	test('parses multiple legacy div records', () => {
		const xml =
			xmlDeclaration +
			'<div>txtLastName=SantostxtLastName=</div>' +
			'<div>txtFirstName=AnatxtFirstName=</div>' +
			legacyFooter

		expect(
			parseLegacyXml(xml)
		).toEqual({
			txtLastName: 'Santos',
			txtFirstName: 'Ana'
		})
	})

	test('parses escaped text values', () => {
		const xml =
			xmlDeclaration +
			'<div>frm1601EQ:txtTIN1=123 &amp; &lt;ok&gt;frm1601EQ:txtTIN1=</div>' +
			legacyFooter

		expect(
			parseLegacyXml(xml)
		).toEqual({
			'frm1601EQ:txtTIN1': '123 & <ok>'
		})
	})
})
