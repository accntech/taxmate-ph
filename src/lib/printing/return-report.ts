import { mount, tick, unmount } from 'svelte';
import type { FormDefinition } from '$lib/forms';
import { calculateReturn } from '$lib/forms/form-runtime';
import { arimoFontFaceCss } from './arimo-font';
import { buildPrintHtml, formatReportFormNumber, PRINT_SOURCE_URL_PLACEHOLDER } from './html';
import { getWithholdingPrintComponent, getWithholdingPrintStyles } from './withholding-print-registry';
import { getPrintProfile, type PrintPaperSize } from './profiles';

async function dataUrl(url: string): Promise<string> {
	if (url.startsWith('data:')) return url;
	if (!url.startsWith('/legacy/')) throw new Error(`Print asset must be bundled locally: ${url}`);
	const response = await fetch(url);
	if (!response.ok) throw new Error(`Could not load print asset ${url}`);
	const blob = await response.blob();
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error);
		reader.readAsDataURL(blob);
	});
}

async function embedAssets(surface: HTMLElement, styles: string): Promise<{ assets: Record<string, string>; styles: string }> {
	const sources = new Set<string>();
	for (const image of surface.querySelectorAll<HTMLImageElement>('img[src]')) sources.add(image.getAttribute('src')!);
	for (const match of styles.matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g)) sources.add(match[2]);
	const assets: Record<string, string> = Object.fromEntries(await Promise.all([...sources].filter(source => !source.startsWith('data:')).map(async source => [source, await dataUrl(source)] as const)));
	for (const image of surface.querySelectorAll<HTMLImageElement>('img[src]')) {
		const source = image.getAttribute('src')!;
		if (assets[source]) image.setAttribute('src', assets[source]);
	}
	return { assets, styles: Object.entries(assets).reduce((css, [source, embedded]) => css.replaceAll(source, embedded), styles) };
}

async function waitForLayout(surface: HTMLElement): Promise<void> {
	await document.fonts.ready;
	await Promise.all([...surface.querySelectorAll('img')].map(image => image.complete ? Promise.resolve() : new Promise<void>((resolve, reject) => {
		image.onload = () => resolve();
		image.onerror = () => reject(new Error('A bundled print image could not be decoded.'));
	})));
	await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
}

function snapshotControls(surface: HTMLElement): void {
	for (const input of surface.querySelectorAll('input')) {
		input.setAttribute('value', input.value);
		if (input.checked) input.setAttribute('checked', '');
		else input.removeAttribute('checked');
	}
	for (const select of surface.querySelectorAll('select')) {
		for (const option of select.options) {
			if (option.selected) option.setAttribute('selected', '');
			else option.removeAttribute('selected');
		}
	}
	for (const textarea of surface.querySelectorAll('textarea')) textarea.textContent = textarea.value;
}

/** Enclose fixed source tables, including the border restored from printme(). */
function fitSourceFrames(surface: HTMLElement): void {
	for (const frame of surface.querySelectorAll<HTMLElement>('#formPaper')) {
		for (let attempt = 0; attempt < 6; attempt++) {
			const bounds = frame.getBoundingClientRect();
			const border = parseFloat(getComputedStyle(frame).borderRightWidth);
			const tables = [...frame.querySelectorAll('table')].map(table => table.getBoundingClientRect()).filter(table => table.width > 0);
			const right = Math.max(bounds.right - border, ...tables.map(table => table.right));
			if (right <= bounds.right - border + 0.5) break;
			// Measure fixed source layout, never the length of populated values.
			const width = Math.ceil(right - bounds.left + border + 0.5);
			frame.style.width = `${width}px`;
			frame.style.minWidth = `${width}px`;
		}
		const box = frame.getBoundingClientRect();
		const right = box.right - parseFloat(getComputedStyle(frame).borderRightWidth);
		if ([...frame.querySelectorAll('table')].some(table => table.getBoundingClientRect().right > right + 1)) {
			throw new Error('The source print frame does not enclose its fixed tables.');
		}
	}
}

/** Fit already rendered vector text; the form's CSS keeps its original cell geometry. */
function fitValues(surface: HTMLElement): void {
	const context = document.createElement('canvas').getContext('2d');
	if (!context) throw new Error('Print text measurement is unavailable.');
	for (const value of surface.querySelectorAll<HTMLElement>('[data-print-value]:not([data-print-multiline])')) {
		const bounds = value.getBoundingClientRect();
		const text = value instanceof HTMLInputElement || value instanceof HTMLTextAreaElement ? value.value : value.textContent;
		if (bounds.width && (value instanceof HTMLInputElement || value instanceof HTMLTextAreaElement)) {
			// Native size-based controls derive their box from font metrics, including
			// device-pixel rounding under zoom. Keep the source box for every value.
			value.style.boxSizing = 'border-box';
			value.style.width = `${bounds.width}px`;
			value.style.height = `${bounds.height}px`;
		}
		if (!bounds.width || !text) continue;
		const style = getComputedStyle(value);
		const size = parseFloat(style.fontSize);
		context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
		const width = context.measureText(text).width;
		const available = Math.max(bounds.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth), 1);
		if (width > available && Number.isFinite(size)) {

			value.dataset.fittedPrintValue = '';
			value.style.setProperty('--withholding-value-font-size', `${size * available / width}px`);
		}
	}
}

function fitPages(surface: HTMLElement, paperSize: PrintPaperSize, status: string, title: string): void {
	const profile = getPrintProfile(paperSize);
	const toPixels = (length: string): number => parseFloat(length) * (length.endsWith('mm') ? 96 / 25.4 : 96);
	const margins = profile.margin.split(/\s+/).map(toPixels);
	const width = toPixels(profile.width) - 2 * (margins[1] ?? margins[0]);
	const height = toPixels(profile.height) - 2 * margins[0] - 0.5;
	const chromeBand = 0.36 * 96;
	const contentHeight = height - chromeBand * 2;
	const footerDate = new Intl.DateTimeFormat('en-GB').format(new Date());
	const pages = [...surface.querySelectorAll<HTMLElement>('.withholding-print-page-content')];
	for (const [index, page] of pages.entries()) {
		const bounds = page.getBoundingClientRect();
		const children = [...page.querySelectorAll<HTMLElement>('*')].map(child => child.getBoundingClientRect()).filter(child => child.width > 0);
		const sourceWidth = Math.max(bounds.width, page.scrollWidth, ...children.map(child => child.right - bounds.left), 1);
		const sourceHeight = Math.max(bounds.height, page.scrollHeight, ...children.map(child => child.bottom - bounds.top), 1);
		const frame = document.createElement('section');
		frame.className = 'withholding-print-page';
		frame.dataset.sourcePage = page.dataset.sourcePage;
		frame.style.setProperty('--withholding-page-width', `${width}px`);
		frame.style.setProperty('--withholding-page-height', `${height}px`);
		frame.style.setProperty('--withholding-chrome-band', `${chromeBand}px`);
		frame.style.setProperty('--withholding-source-width', `${sourceWidth}px`);
		frame.style.setProperty('--withholding-page-scale', String(Math.min(width / sourceWidth, contentHeight / sourceHeight, Number(profile.scale))));
		page.before(frame);
		frame.append(page);
		for (const [kind, left, right] of [
			['header', formatReportFormNumber(title), `Page ${index + 1} of ${pages.length}`],
			['footer', PRINT_SOURCE_URL_PLACEHOLDER, footerDate]
		]) {
			const chrome = document.createElement('div');
			chrome.className = `pdf-report-${kind} withholding-page-${kind}`;
			chrome.setAttribute('aria-hidden', 'true');
			const start = document.createElement('span');
			start.textContent = left;
			if (kind === 'footer') start.className = 'pdf-report-source';
			const end = document.createElement('span');
			end.textContent = right;
			chrome.append(start, end);
			frame.append(chrome);
		}
		// Layout zoom can change table row rounding and line wrapping. Fit the
		// final mounted geometry, rather than assuming scaled source dimensions.
		for (let attempt = 0; attempt < 6; attempt++) {
			const box = page.getBoundingClientRect();
			const descendants = [...page.querySelectorAll<HTMLElement>('*')].map(child => child.getBoundingClientRect()).filter(child => child.width > 0);
			const actualWidth = Math.max(box.width, ...descendants.map(child => child.right - box.left));
			const actualHeight = Math.max(box.height, ...descendants.map(child => child.bottom - box.top));
			const correction = Math.min((width - 0.5) / actualWidth, (contentHeight - 0.5) / actualHeight, 1);
			if (correction >= 1) break;
			const scale = Number(frame.style.getPropertyValue('--withholding-page-scale'));
			frame.style.setProperty('--withholding-page-scale', String(scale * correction));
		}
		const fitted = page.getBoundingClientRect();
		const fittedChildren = [...page.querySelectorAll<HTMLElement>('*')].map(child => child.getBoundingClientRect()).filter(child => child.width > 0);
		if (Math.max(fitted.width, ...fittedChildren.map(child => child.right - fitted.left)) > width + 1 ||
			Math.max(fitted.height, ...fittedChildren.map(child => child.bottom - fitted.top)) > contentHeight + 1) {
			throw new Error(`${title}, page ${index + 1}: print layout exceeds the reserved page content area.`);
		}
		if (status === 'Draft') {
			const watermark = document.createElement('div');
			watermark.className = 'withholding-print-draft';
			watermark.setAttribute('aria-hidden', 'true');
			watermark.textContent = 'DRAFT';
			frame.append(watermark);
		}
	}
	if (!pages.length && status === 'Draft') {
		const watermark = document.createElement('div');
		watermark.className = 'pdf-draft-watermark';
		watermark.setAttribute('aria-hidden', 'true');
		watermark.textContent = 'DRAFT';
		surface.append(watermark);
	}
}

/** Export every return through its compiled Svelte print component and external CSS. */
export async function buildReturnReport(definition: FormDefinition, values: Record<string, string>, status: string, paperSize: PrintPaperSize, onProgress?: (completedSteps: number, stage: string) => void): Promise<string> {
	const [PrintComponent, styles] = await Promise.all([getWithholdingPrintComponent(definition.code), getWithholdingPrintStyles(definition.code)]);
	onProgress?.(1, 'Embedding print assets');
	const fontStyle = document.createElement('style');
	fontStyle.textContent = arimoFontFaceCss;
	document.head.append(fontStyle);
	const host = document.createElement('div');
	host.className = 'withholding-render-host';
	const sheetStyle = document.createElement('style');
	sheetStyle.textContent = `.print-measure-surface { all: initial; display: block; font: 12px Arial, Helvetica, sans-serif; line-height: normal; letter-spacing: normal; }\n${arimoFontFaceCss}\n${styles}`;
	const surface = document.createElement('div');
	surface.className = 'print-measure-surface';
	// Measure with the same standalone cascade as the exported document. Application
	// resets must not influence the source form's table and text geometry.
	host.style.cssText = 'position:fixed;left:-100000px;top:0;width:1200px;visibility:hidden;pointer-events:none';
	const root = host.attachShadow({ mode: 'open' });
	root.append(sheetStyle, surface);
	document.body.append(host);
	let component: ReturnType<typeof mount> | undefined;
	try {
		component = mount(PrintComponent, { target: surface, props: { values: calculateReturn(definition.code, values) } });
		await tick();
		const embedded = await embedAssets(surface, styles);
		onProgress?.(2, 'Laying out pages');
		sheetStyle.textContent = `.print-measure-surface { all: initial; display: block; font: 12px Arial, Helvetica, sans-serif; line-height: normal; letter-spacing: normal; }\n${arimoFontFaceCss}\n${embedded.styles}`;
		await document.fonts.load('12px Arimo');
		await waitForLayout(surface);
		onProgress?.(3, 'Preparing document');
		snapshotControls(surface);
		fitSourceFrames(surface);
		fitValues(surface);
		fitPages(surface, paperSize, status, `BIR Form ${definition.code}`);
		const profile = getPrintProfile(paperSize);
		return buildPrintHtml({
			title: `BIR Form ${definition.code}`,
			profile: definition.code === '1601EQ' ? profile : { ...profile, scale: '1' },
			bodyHtml: `<div class="print-export-root">${surface.innerHTML}</div>`,
			styleHtml: `<style>${embedded.styles}</style>`,
			assets: embedded.assets
		});
	} finally {
		try {
			if (component) await unmount(component);
		} finally {
			host.remove();
			fontStyle.remove();
		}
	}
}
