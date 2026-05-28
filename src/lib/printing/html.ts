import type { PrintProfile } from './profiles'

export type PrintHtmlInput = {
	title: string
	profile: PrintProfile
	bodyHtml: string
	styleHtml: string
	assets: Record<string, string>
	footerDate?: string
}

export const PRINT_SOURCE_URL_PLACEHOLDER = '__EBIRFORMS_PRINT_SOURCE_URL__'

export function escapeHtml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;')
}

export function replaceLegacyAssetUrls(html: string, assets: Record<string, string>): string {
	return Object.entries(assets).reduce((result, [url, dataUrl]) => {
		return result.replaceAll(url, dataUrl)
	}, html)
}

export function markStylesAsPrintOnly(styleHtml: string): string {
	return styleHtml.replace(/<style(?![^>]*\bmedia=)([^>]*)>/gi, '<style media="print"$1>')
}

export function findSvelteScopeClass(html: string): string {
	return html.match(/\bs-[A-Za-z0-9_-]+\b/)?.[0] ?? ''
}

export function formatReportFormNumber(title: string): string {
	const formNumber = title.replace(/\b1601EQ\b/, '1601-EQ')

	return formNumber.replace(/^BIR Form\s+/, 'BIR Form No. ')
}

export function buildPrintHtml(input: PrintHtmlInput): string {
	const scopeClass = findSvelteScopeClass(input.bodyHtml)
	const previewClass = ['print-preview-active', scopeClass].filter(Boolean).join(' ')
	const formNumber = formatReportFormNumber(input.title)
	const footerDate =
		input.footerDate ?? new Intl.DateTimeFormat('en-GB').format(new Date())
	const documentHtml = `<!doctype html>
<html lang="en" data-paper-size="${input.profile.size}">
<head>
	<meta charset="utf-8">
	<title>${escapeHtml(input.title)}</title>
	<style>
		:root {
			--pdf-paper-width: ${input.profile.width};
			--pdf-paper-height: ${input.profile.height};
			--pdf-paper-margin: ${input.profile.margin};
			--legacy-print-scale: ${input.profile.scale};
		}

		html,
		body {
			margin: 0;
			padding: 0;
			background: #fff;
		}

		* {
			-webkit-print-color-adjust: exact;
			print-color-adjust: exact;
		}

		@media print {
			@page {
				size: ${input.profile.width} ${input.profile.height};
				margin: ${input.profile.margin};
			}

			.pdf-print-rendered {
				--pdf-report-header-space: 0.36in;
				width: 100%;
				min-height: 100%;
				color: #000;
				font-family: Arial, Helvetica, sans-serif;
				font-size: 12px;
			}

			.pdf-print-rendered .print-export-root {
				display: block;
				position: static;
				width: 100%;
				margin: 0;
				overflow: visible;
			}

			.pdf-print-rendered .print-preview-active {
				margin-top: var(--pdf-report-header-space);
			}

			.pdf-print-rendered .print-page-header,
			.pdf-print-rendered .print-page-footer {
				display: none !important;
			}

			.pdf-print-rendered .legacy-container {
				position: static;
				width: 100%;
				height: auto;
				overflow: visible;
				break-after: avoid;
				break-inside: avoid;
				page-break-after: avoid;
				page-break-inside: avoid;
			}

			.pdf-print-rendered .legacy-wrapper {
				position: relative;
				width: 8.3in;
				max-width: 8.3in;
				margin: 0 auto;
				zoom: var(--legacy-print-scale);
			}

			.pdf-report-header,
			.pdf-report-footer {
				display: flex;
				position: fixed;
				left: 0.45in;
				right: 0.45in;
				justify-content: space-between;
				color: #000;
				font-family: 'Times New Roman', Times, serif;
				font-size: 12pt;
				line-height: 1;
				z-index: 20;
			}

			.pdf-report-header {
				top: 0.08in;
			}

			.pdf-report-footer {
				bottom: 0.08in;
				gap: 0.2in;
			}

			.pdf-report-source {
				display: block;
				min-width: 0;
				max-width: calc(100% - 1.2in);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	</style>
	${markStylesAsPrintOnly(input.styleHtml)}
	<style media="print">
		html,
		body,
		.pdf-print-rendered,
		.pdf-print-rendered .print-preview-active,
		.pdf-print-rendered .print-export-root,
		.pdf-print-rendered .legacy-container,
		.pdf-print-rendered .legacy-wrapper {
			background: #fff !important;
		}

		.pdf-print-rendered .legacy-bg-strip {
			background: none !important;
		}

		.pdf-print-rendered .legacy-form-paper {
			background: #fff !important;
		}

		.pdf-print-rendered .legacy-root-table,
		.pdf-print-rendered .legacy-root-table *,
		.pdf-print-rendered .tblForm,
		.pdf-print-rendered .tblForm td,
		.pdf-print-rendered .tblForm th {
			background: #fff !important;
			background-image: none !important;
		}

		.pdf-print-rendered .legacy-radio-dot {
			background: #000 !important;
		}

		.pdf-report-header,
		.pdf-report-header *,
		.pdf-report-footer,
		.pdf-report-footer * {
			visibility: visible !important;
		}
	</style>
</head>
<body class="pdf-print-rendered">
	<div class="pdf-report-header" aria-hidden="true">
		<span>${escapeHtml(formNumber)}</span>
		<span>Page 1 of 1</span>
	</div>
	<div class="${previewClass}" data-paper-size="${input.profile.size}">
		${input.bodyHtml}
	</div>
	<div class="pdf-report-footer" aria-hidden="true">
		<span class="pdf-report-source">${PRINT_SOURCE_URL_PLACEHOLDER}</span>
		<span>${escapeHtml(footerDate)}</span>
	</div>
</body>
</html>`

	return replaceLegacyAssetUrls(documentHtml, input.assets)
}
