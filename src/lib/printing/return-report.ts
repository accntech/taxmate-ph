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
		frame.style.setProperty('--print-frame-border-width', getComputedStyle(frame).borderRightWidth);
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
	// Original pages in a return share a physical frame; continuation tables retain their own layout.
	const sourceFrames = [...surface.querySelectorAll<HTMLElement>('.withholding-print-page-content:not(.wh-continuation-page) #formPaper')];
	if (sourceFrames.length < 2) return;
	const commonWidth = Math.max(0, ...sourceFrames.map(frame => frame.getBoundingClientRect().width));
	for (const frame of sourceFrames) {
		const box = frame.getBoundingClientRect();
		const border = parseFloat(getComputedStyle(frame).borderRightWidth);
		const sections = [...frame.querySelectorAll<HTMLElement>('table')].filter(table => {
			const bounds = table.getBoundingClientRect();
			return bounds.width >= (box.width - border * 2) * 0.95 &&
				Math.abs(bounds.left - box.left - border) <= 2 &&
				table.parentElement!.getBoundingClientRect().width >= (box.width - border * 2) * 0.95;
		});
		if (commonWidth > box.width + 1) {
			for (const section of sections) {
				if (section.parentElement !== frame) section.parentElement!.style.setProperty('width', '100%', 'important');
				section.style.setProperty('width', '100%', 'important');
				section.style.removeProperty('max-width');
			}
		}
		frame.style.width = `${commonWidth}px`;
		frame.style.minWidth = `${commonWidth}px`;
	}
}

/** Freeze source field geometry before applying consistent value typography. */
function fitValues(surface: HTMLElement): void {
 const candidates = [...surface.querySelectorAll<HTMLElement>(
  'input:not([type="radio"]):not([type="checkbox"]), textarea, [data-print-value], [data-print-control="select"], [data-field-id], .legacy-label-value'
 )].filter(value => !value.matches('[type="radio"], [type="checkbox"], .wh-print-check') &&
  !(/:([YNGPF]|Q[1-4])$/.test(value.dataset.fieldId ?? '') && !value.hasAttribute('data-print-value')));
 const boxes = candidates.map(value => {
  const box = value.getBoundingClientRect();
  const style = getComputedStyle(value);
  const parent = value.parentElement!;
  const parentBox = parent.getBoundingClientRect();
  const parentStyle = getComputedStyle(parent);
  const native = value instanceof HTMLInputElement || value instanceof HTMLTextAreaElement;
  const cell = value.tagName === 'TD';
  // Positioned OCR fields must stay within their original fixed wrapper.
  const available = Math.max(0, parentBox.right - box.left - parseFloat(parentStyle.paddingRight));
  const constrained = !native && !cell && parentStyle.display !== 'inline' && available > 0;
  const onlyValue = parent.children.length === 1 && [...parent.childNodes].every(node => node === value || !node.textContent?.trim());
  const fieldWidth = constrained && onlyValue ? available : box.width;
  return { value, box, style, native, cell, available, width: constrained ? Math.min(fieldWidth || available, available) : box.width };
 });
 for (const { value, box, style, native, cell, available, width } of boxes) {
  value.dataset.normalizedPrintValue = '';
  if (width > 0 && !cell) {
   const headingValue = value.hasAttribute('data-print-value') && !value.dataset.fieldId && !native;
   value.style.width = headingValue ? 'auto' : `${width}px`;
   if (headingValue) value.style.maxWidth = `${available}px`;
   value.style.boxSizing = 'border-box';
   if (native) value.style.height = `${box.height}px`;
   else {
    value.style.display = 'inline-block';
    value.style.verticalAlign = 'top';
   }
  }
  // Isolate values embedded directly in table cells from table intrinsic sizing.
  if (cell && width > 0) {
   const text = document.createElement('span');
   text.style.cssText = `display:block;width:${Math.max(width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth), 0)}px;max-width:100%;overflow:hidden;text-overflow:clip;white-space:nowrap`;
   text.append(...value.childNodes);
   value.append(text);
  }
  value.style.setProperty('line-height', style.lineHeight === 'normal' ? '14.4px' : style.lineHeight, 'important');
  value.style.setProperty('font-size', '12px', 'important');
  value.style.setProperty('font-family', 'Arial, Helvetica, sans-serif', 'important');
  value.style.setProperty('font-weight', '400', 'important');
  const email = /email/i.test(value.dataset.fieldId ?? value.id) || value.classList.contains('legacy-email-input');
  value.style.setProperty('text-transform', email ? 'lowercase' : 'uppercase', 'important');
  value.style.setProperty('white-space', 'nowrap', 'important');
  value.style.setProperty('overflow', native ? 'clip' : 'hidden', 'important');
  value.style.setProperty('text-overflow', 'clip', 'important');
  if (native || value.matches('[data-print-control="select"]')) {
   const reference = surface.querySelector<HTMLInputElement>('input:not([type="radio"]):not([type="checkbox"])');
   const thickness = reference && reference.getBoundingClientRect().height <= 16 ? 1 : 2;
   value.style.setProperty('border', `${thickness}px inset rgb(118, 118, 118)`);
   value.style.setProperty('border-radius', '0');
  }
 }
}

/** Inline SVG preserves circular paths when Chromium rounds fractional print viewports. */
function normalizeRadioControls(surface: HTMLElement): void {
 const ns = 'http://www.w3.org/2000/svg';
 for (const control of surface.querySelectorAll<HTMLElement>('input[type="radio"], .legacy-radio')) {
  const checked = control instanceof HTMLInputElement ? control.checked : control.classList.contains('legacy-radio-selected');
  let host = control;
  if (control instanceof HTMLInputElement) {
   host = document.createElement('span');
   host.className = 'pdf-radio-control';
   const style = getComputedStyle(control);
   host.style.cssText = `display:inline-block;position:relative;width:13px;height:13px;vertical-align:middle;margin:${style.margin};padding:0;border:0`;
   control.before(host);
   host.append(control);
   control.style.setProperty('position', 'absolute', 'important');
   control.style.setProperty('inset', '0', 'important');
   control.style.setProperty('margin', '0', 'important');
   control.style.setProperty('opacity', '0', 'important');
  }
  host.style.setProperty('background', 'none', 'important');
  host.style.setProperty('border', '0', 'important');
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 14 14');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('pdf-radio-vector');
  svg.style.cssText = 'position:absolute;inset:0;display:block;width:100%;height:100%;overflow:visible;pointer-events:none';
  const ring = document.createElementNS(ns, 'circle');
  for (const [name, value] of Object.entries({ cx: '7', cy: '7', r: '6', fill: 'white', stroke: 'black', 'stroke-width': '1' })) ring.setAttribute(name, value);
  svg.append(ring);
  if (checked) {
   const dot = document.createElementNS(ns, 'circle');
   for (const [name, value] of Object.entries({ cx: '7', cy: '7', r: '3.5', fill: 'black' })) dot.setAttribute(name, value);
   svg.append(dot);
  }
  host.append(svg);
 }
}

/** Compensate page fitting so all entered values retain a 7.38pt printed size. */
function setPrintedValueSize(surface: HTMLElement, paperSize: PrintPaperSize): void {
 const targetPixels = 7.38 / 0.75;
 for (const value of surface.querySelectorAll<HTMLElement>('[data-normalized-print-value]')) {
  const frame = value.closest<HTMLElement>('.withholding-print-page');
  const scale = frame ? Number(frame.style.getPropertyValue('--withholding-page-scale')) : Number(getPrintProfile(paperSize).scale);
  value.style.setProperty('font-size', `${targetPixels / scale}px`, 'important');
 }
}

/** Join only the near-full-width sections to their original frame's inner edge. */
function alignSourceSections(surface: HTMLElement): void {
 for (const frame of surface.querySelectorAll<HTMLElement>('#formPaper')) {
  const bounds = frame.getBoundingClientRect();
  const border = parseFloat(getComputedStyle(frame).borderRightWidth);
  const right = bounds.right - border;
  const sections = [...frame.querySelectorAll<HTMLElement>('table, .imgClass > img')].map(element => ({ element, box: element.getBoundingClientRect(), parent: element.parentElement!.getBoundingClientRect() }));
  for (const { element, box, parent } of sections) {
   if (box.width >= (bounds.width - border * 2) * 0.95 &&
    Math.abs(box.left - bounds.left - border) <= 2 &&
    parent.width >= (bounds.width - border * 2) * 0.95 && right - box.right > 1) {
    const container = element.parentElement!;
    if (right - parent.right > 2) {
     container.style.setProperty('width', `${right - parent.left}px`, 'important');
     container.style.boxSizing = 'border-box';
    }
    const inset = right - parent.right;
    const width = inset > 0.5 && inset <= 2 &&
     (right - box.right > 2 || element.style.width.startsWith('calc('))
     ? 'calc(100% + 1px)' : '100%';
    element.style.setProperty('width', width, 'important');
    element.style.removeProperty('max-width');
   }
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
	// Use the most constrained original page's fit throughout the return.
	const sourcePages = [...surface.querySelectorAll<HTMLElement>('.withholding-print-page:has(.withholding-print-page-content:not(.wh-continuation-page) #formPaper)')];
	if (sourcePages.length > 1) {
		let commonScale = Math.min(...sourcePages.map(frame => Number(frame.style.getPropertyValue('--withholding-page-scale'))));
		const layouts = sourcePages.map(frame => {
			frame.style.setProperty('--withholding-page-scale', String(commonScale));
			const content = frame.querySelector<HTMLElement>('.withholding-print-page-content')!;
			const box = content.getBoundingClientRect();
			const paper = frame.querySelector<HTMLElement>('#formPaper')!.getBoundingClientRect();
			const center = (paper.left + paper.right) / 2;
			const bounds = [box, ...[...content.querySelectorAll('*')].map(child => child.getBoundingClientRect()).filter(child => child.width > 0)];
			// Reserve wrapper overflow on both sides of the visible frame so moving
			// the complete layout cannot clip an ancestor table or its border.
			const radius = Math.max(...bounds.flatMap(child => [center - child.left, child.right - center])) / commonScale;
			return { frame, content, center: (center - box.left) / commonScale, radius };
		});
		commonScale = Math.min(commonScale, ...layouts.map(layout => (width - 0.5) / (2 * layout.radius)));
		for (const { frame, content, center } of layouts) {
			frame.style.setProperty('--withholding-page-scale', String(commonScale));
			content.style.left = `${width / (2 * commonScale) - center}px`;
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
		fitValues(surface);
		normalizeRadioControls(surface);
		for (let pass = 0; pass < 3; pass++) {
			fitSourceFrames(surface);
			alignSourceSections(surface);
		}
		fitSourceFrames(surface);
		fitPages(surface, paperSize, status, `BIR Form ${definition.code}`);
		setPrintedValueSize(surface, paperSize);
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
