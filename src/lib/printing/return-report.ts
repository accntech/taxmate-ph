import { mount, tick, unmount } from 'svelte';
import type { FormDefinition } from '$lib/forms';
import Form1601EQPrint from '$lib/forms/form-1601-eq-print.svelte';
import { calculate1601EQ } from '$lib/forms/form-1601-eq-rules';
import { buildPrintHtml } from './html';
import legacyStyles from './form-1601-eq-print.css?raw';
import { getPrintProfile, type PrintPaperSize } from './profiles';

/** Render the original BIR form layout from the selected saved return. */
export async function buildReturnReport(definition: FormDefinition, values: Record<string, string>, status: string, paperSize: PrintPaperSize): Promise<string> {
	const target = document.createElement('div');
	target.hidden = true;
	document.body.append(target);
	const component = mount(Form1601EQPrint, { target, props: { values: calculate1601EQ(values) } });
	try {
		await tick();
		// Input values are DOM properties; persist them in the exported HTML.
		for (const input of target.querySelectorAll('input')) {
			input.setAttribute('value', input.value);
		}
		const assets = Object.fromEntries(await Promise.all(
			['/legacy/img/frmbg.png', '/legacy/img/1601EQ_BarCode/1601EQ_p1.png'].map(async url => {
				const response = await fetch(url);
				if (!response.ok) throw new Error(`Could not load print asset ${url}`);
				const blob = await response.blob();
				const dataUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(String(reader.result));
					reader.onerror = () => reject(reader.error);
					reader.readAsDataURL(blob);
				});
				return [url, dataUrl];
			})
		));
		const watermark = status === 'Draft' ? '<div class="pdf-draft-watermark" aria-hidden="true">DRAFT</div>' : '';
		return buildPrintHtml({
			title: `BIR Form ${definition.code}`,
			profile: getPrintProfile(paperSize),
			bodyHtml: `<div class="print-export-root">${target.innerHTML}${watermark}</div>`,
			styleHtml: `<style>${legacyStyles}</style>`,
			assets
		});
	} finally {
		await unmount(component);
		target.remove();
	}
}
