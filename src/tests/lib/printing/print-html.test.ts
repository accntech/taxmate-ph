import { describe, expect, test } from 'vitest'

import {
	buildPrintHtml,
	escapeHtml,
	markStylesAsPrintOnly,
	replaceLegacyAssetUrls
} from '$lib/printing/html'
import { getPrintProfile } from '$lib/printing/profiles'

describe('print HTML export', () => {
	test('escapes text used in the document title', () => {
		expect(escapeHtml('1601EQ <draft> & copy')).toBe('1601EQ &lt;draft&gt; &amp; copy')
	})

	test('replaces known legacy asset URLs with data URLs', () => {
		const html = '<img src="/legacy/img/header_logo.png">'
		const css = ".x{background-image:url('/legacy/img/frmbg.png')}"
		const assets = {
			'/legacy/img/header_logo.png': 'data:image/png;base64,logo',
			'/legacy/img/frmbg.png': 'data:image/png;base64,bg'
		}

		const result = replaceLegacyAssetUrls(`${html}<style>${css}</style>`, assets)

		expect(result).toContain('src="data:image/png;base64,logo"')
		expect(result).toContain("url('data:image/png;base64,bg')")
	})

	test('marks collected application styles as print-only', () => {
		expect(
			markStylesAsPrintOnly(
				'<style>.screen{display:block}</style>\n' +
					'<style type="text/css" data-vite-dev-id="/src/app.css">@media print{body{margin:0}}</style>'
			)
		).toBe(
			'<style media="print">.screen{display:block}</style>\n' +
				'<style media="print" type="text/css" data-vite-dev-id="/src/app.css">@media print{body{margin:0}}</style>'
		)
	})

	test('leaves already media-scoped styles unchanged', () => {
		expect(markStylesAsPrintOnly('<style media="print">body{margin:0}</style>')).toBe(
			'<style media="print">body{margin:0}</style>'
		)
	})

	test('builds a complete HTML document with the selected paper profile', () => {
		const html = buildPrintHtml({
			title: 'BIR Form 1601EQ',
			profile: getPrintProfile('long'),
			bodyHtml: '<article class="legacy-container">Form</article>',
			styleHtml: '<style>.legacy-container{color:#000}</style>',
			assets: {}
		})

		expect(html).toContain('<!doctype html>')
		expect(html).toContain('<title>BIR Form 1601EQ</title>')
		expect(html).toContain('data-paper-size="long"')
		expect(html).toContain('--pdf-paper-width: 8.5in;')
		expect(html).toContain('--pdf-paper-height: 13in;')
		expect(html).toContain('--legacy-print-scale: 0.82;')
		expect(html).toContain('<body class="pdf-print-rendered">')
		expect(html).toContain('<div class="print-preview-active" data-paper-size="long">')
		expect(html).toContain('.pdf-print-rendered .print-export-root')
		expect(html).toContain('zoom: var(--legacy-print-scale);')
		expect(html).toContain('<style media="print">.legacy-container{color:#000}</style>')
		expect(html).toContain('<article class="legacy-container">Form</article>')
	})

	test('uses the cleaner long-page layout in standalone PDF export', () => {
		const html = buildPrintHtml({
			title: 'BIR Form 1601EQ',
			profile: getPrintProfile('long'),
			bodyHtml:
				'<div class="print-page-header">BIR Form No. 1601EQ</div>' +
				'<article class="legacy-container">Form</article>' +
				'<div class="print-page-footer">eBIRForms Tauri</div>',
			styleHtml: '',
			assets: {}
		})

		expect(html).toContain('.pdf-print-rendered .print-page-header,')
		expect(html).toContain('.pdf-print-rendered .print-page-footer {')
		expect(html).toContain('display: none !important;')
		expect(html).toContain('width: 100%;')
		expect(html).toContain('margin: 0 auto;')
		expect(html).toContain('@media print {')
	})

	test('removes legacy screen backgrounds from the printable PDF surface', () => {
		const html = buildPrintHtml({
			title: 'BIR Form 1601EQ',
			profile: getPrintProfile('long'),
			bodyHtml: '<div class="legacy-bg-strip"><div class="legacy-form-paper">Form</div></div>',
			styleHtml: '<style>.legacy-bg-strip{background-image:url("/legacy/img/frmbg.png")}</style>',
			assets: {}
		})

		expect(html).toContain('.pdf-print-rendered,')
		expect(html).toContain('.pdf-print-rendered .print-preview-active,')
		expect(html).toContain('.pdf-print-rendered .print-export-root,')
		expect(html).toContain('.pdf-print-rendered .legacy-container,')
		expect(html).toContain('.pdf-print-rendered .legacy-wrapper {')
		expect(html).toContain('background: #fff !important;')
		expect(html).toContain('.pdf-print-rendered .legacy-bg-strip {')
		expect(html).toContain('background: none !important;')
		expect(html).toContain('.pdf-print-rendered .legacy-form-paper {')
		expect(html).toContain('background: #fff !important;')
		expect(html).toContain('.pdf-print-rendered .legacy-root-table,')
		expect(html).toContain('.pdf-print-rendered .legacy-root-table *,')
		expect(html).toContain('.pdf-print-rendered .tblForm td,')
		expect(html).toContain('background-image: none !important;')
		expect(html).toContain('.pdf-print-rendered .legacy-radio-dot {')
		expect(html).toContain('background: #000 !important;')
	})

	test('forces the exported print page canvas to white', () => {
		const html = buildPrintHtml({
			title: 'BIR Form 1601EQ',
			profile: getPrintProfile('long'),
			bodyHtml: '<div class="print-export-root">Form</div>',
			styleHtml: '<style>:root{background:#f7f7f4}body{min-height:100vh}</style>',
			assets: {}
		})

		expect(html).toContain('html,')
		expect(html).toContain('body,')
		expect(html).toContain('.pdf-print-rendered,')
		expect(html).toContain('background: #fff !important;')
	})

	test('adds report-style print header and temp file footer', () => {
		const html = buildPrintHtml({
			title: 'BIR Form 1601EQ',
			profile: getPrintProfile('long'),
			bodyHtml: '<div class="print-export-root">Form</div>',
			styleHtml: '',
			assets: {},
			footerDate: '28/05/2026'
		})

		expect(html).toContain('<div class="pdf-report-header" aria-hidden="true">')
		expect(html).toContain('<span>BIR Form No. 1601-EQ</span>')
		expect(html).toContain('<span>Page 1 of 1</span>')
		expect(html).toContain('<div class="pdf-report-footer" aria-hidden="true">')
		expect(html).toContain('<span class="pdf-report-source">__EBIRFORMS_PRINT_SOURCE_URL__</span>')
		expect(html).toContain('<span>28/05/2026</span>')
		expect(html).toContain('--pdf-report-header-space: 0.36in;')
		expect(html).toContain('margin-top: var(--pdf-report-header-space);')
		expect(html).toContain('.pdf-report-header,')
		expect(html).toContain('.pdf-report-header *,')
		expect(html).toContain('.pdf-report-footer,')
		expect(html).toContain('.pdf-report-footer * {')
		expect(html).toContain('visibility: visible !important;')
	})

	test('preserves the Svelte scope class on the print-preview wrapper', () => {
		const html = buildPrintHtml({
			title: 'BIR Form 1601EQ',
			profile: getPrintProfile('long'),
			bodyHtml: '<div class="print-export-root s-abc123">Form</div>',
			styleHtml:
				'<style media="print">.print-preview-active.s-abc123{width:calc(var(--pdf-paper-width) - 1in)}</style>',
			assets: {}
		})

		expect(html).toContain('<div class="print-preview-active s-abc123" data-paper-size="long">')
	})
})
