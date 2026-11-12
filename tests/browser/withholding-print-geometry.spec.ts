import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

async function printForm(page: Page, code: string, paper = 'long', hostile = false, status = 'Draft', name = 'PRINT GEOMETRY TEST') {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	const html = await page.evaluate(async ({ code, paper, hostile, status, name }) => {
		if (hostile) { const style = document.createElement('style'); style.textContent = '* { line-height: 3 !important; letter-spacing: 8px !important; } table { border-spacing: 30px !important; }'; document.head.append(style); }
		const base = '/src/lib';
		const catalog = await import(`${base}/forms/index.ts`);
		const definitions = await import(`${base}/forms/withholding-definitions.ts`);
		const rules = await import(`${base}/forms/withholding-rules.ts`);
		const reports = await import(`${base}/printing/return-report.ts`);
		const values = code === '1601EQ' ? {} : rules.createWithholdingValues(code, {
			tin1: '001', tin2: '234', tin3: '567', branchCode: '0008', rdoCode: '040',
			taxpayerName: name, lineOfBusiness: 'PROFESSIONAL SERVICES', taxpayerClassification: 'I', address: '123 TEST STREET', address2: '',
			zipCode: '1000', contactNumber: '09171234567', category: 'P', email: 'test@example.com'
		});
		const definition = definitions.getWithholdingDefinition(code)!;
		if (code === '0605') Object.assign(values, {
			'frm0605:itemFiscalStartMonth': 'Calendar', 'frm0605:txtYearEnded': '2026', 'frm0605:itemYearEndMonth': '12',
			'frm0605:dueDate': '2026-06-30', 'frm0605:date': '2026-06-30', 'frm0605:txtATCCode': 'MC200',
			'frm0605:txtTaxTypeCode': 'MC', 'frm0605:txtTax19': '400.00', 'frm0605:itemModeOfPayment': 'Full payment'
		});
		if (code === '1600' || code === '1601FQ') Object.assign(values, {
			[definition.prefix + 'optWithheld']: 'Y',
			[definition.prefix + 'txtAtcCode1']: definitions.getWithholdingAtcs(code, 'P')[0].code,
			[definition.prefix + 'txtTaxBase1']: '1000.00'
		});
		return reports.buildReturnReport(catalog.getFormDefinition(code), values, status, paper);
	}, { code, paper, hostile, status, name });
	const result = await page.context().newPage();
	await result.setContent(html);
	await result.emulateMedia({ media: 'print' });
	await result.evaluate(() => document.fonts.ready);
	return result;
}

test('legacy title zero-width hint remains auto and ATC values retain native-input typography', async ({ page }) => {
	const print = await printForm(page, '1600');
	const title = print.locator('span').filter({ hasText: /^Monthly Remittance Return of[\s\S]*Percentage[\s\S]*Taxes Withheld$/ });
	const width = await title.locator('..').evaluate(element => parseFloat(getComputedStyle(element).width));
	// Original title cell is 598px. Converting width="0" to CSS width:0px reduced it to 247px.
	expect(width).toBeGreaterThan(550);
	await expect(title).toHaveCSS('font-size', '24px');
	const amount = print.locator('[id="frm1600:txtTaxBase1"]');
	const font = await amount.evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), height: getComputedStyle(element).lineHeight }));
	// The source native input retains its UA font instead of inheriting the table's 7px text.
	expect(font.size).toBeCloseTo(13.3333, 3);
	expect(font.height).toBe('normal');
	await print.close();
});

test('payment heading and original form number remain separate header columns', async ({ page }) => {
	const print = await printForm(page, '0605');
	const title = await print.getByText('Payment Form', { exact: true }).boundingBox();
	const number = await print.locator('span').filter({ hasText: /^0605$/ }).boundingBox();
	expect(title).not.toBeNull();
	expect(number).not.toBeNull();
	expect(number!.x - title!.x - title!.width).toBeGreaterThan(80);
	await print.close();
});

for (const code of ['1600PTv2018', '1600VTv2018']) {
	test(`${code} A4 exports exactly its two original pages without blank sheets`, async ({ page }) => {
		const print = await printForm(page, code, 'a4');
		await expect(print.locator('.withholding-print-page')).toHaveCount(2);
		await expect(print.locator('.withholding-print-page > .pdf-report-header')).toHaveCount(2);
		await expect(print.locator('.withholding-print-page > .pdf-report-header').first()).toBeVisible();
		await expect(print.locator('.withholding-print-page > .pdf-report-header').first()).toHaveCSS('font-size', '16px');
		await expect(print.locator('.withholding-print-page > .pdf-report-footer').first()).toHaveCSS('font-family', '"Times New Roman", Times, serif');
		await expect(print.locator('.withholding-print-page > .pdf-report-header').nth(1)).toContainText('Page 2 of 2');
		await expect(print.locator('.withholding-print-page > .pdf-report-footer').first()).toContainText('__EBIRFORMS_PRINT_SOURCE_URL__');
		await expect(print.locator('.withholding-print')).toHaveCSS('padding', '0px');
		const pdf = await print.pdf({ preferCSSPageSize: true, printBackground: true });
		const info = execFileSync('pdfinfo', ['-'], { input: pdf }).toString();
		expect(info.match(/^Pages:\s+(\d+)/m)?.[1]).toBe('2');
		await print.close();
	});
}


test('export measurement is isolated from hostile application styles', async ({ page }) => {
	const clean = await printForm(page, '1600PTv2018', 'letter');
	const expected = await clean.locator('.withholding-print-page').evaluateAll(frames => frames.map(frame => frame.getAttribute('style')));
	await clean.close();
	const hostile = await printForm(page, '1600PTv2018', 'letter', true);
	expect(await hostile.locator('.withholding-print-page').evaluateAll(frames => frames.map(frame => frame.getAttribute('style')))).toEqual(expected);
	const overflow = await hostile.locator('.withholding-print-page').evaluateAll(frames => frames.map(frame => {
		const bounds = frame.getBoundingClientRect();
		return [...frame.querySelectorAll('.withholding-print-page-content *')].filter(element => {
			const box = element.getBoundingClientRect();
			return box.width > 0 && (box.right > bounds.right + 1 || box.bottom > bounds.bottom + 1);
		}).map(element => element.id || element.tagName);
	}));
	expect(overflow).toEqual([[], []]);
	await hostile.close();
});

test('draft watermarks match EQ typography and disappear on finalized output', async ({ page }) => {
	const properties = ['fontFamily', 'fontSize', 'fontWeight', 'color', 'letterSpacing', 'lineHeight', 'transform', 'zIndex'] as const;
	const eq = await printForm(page, '1601EQ', 'letter');
	const expected = await eq.locator('.pdf-draft-watermark').evaluate((element, properties) => Object.fromEntries(properties.map(key => [key, getComputedStyle(element)[key as keyof CSSStyleDeclaration]])), properties);
	await eq.close();
	const draft = await printForm(page, '1600PTv2018', 'letter');
	await expect(draft.locator('.withholding-print-draft')).toHaveCount(2);
	const actual = await draft.locator('.withholding-print-draft').first().evaluate((element, properties) => Object.fromEntries(properties.map(key => [key, getComputedStyle(element)[key as keyof CSSStyleDeclaration]])), properties);
	// Translation depends on the rendered text box; the rotation basis remains identical.
	expect({...actual, transform: undefined}).toEqual({...expected, transform: undefined});
	expect(String(actual.transform).split(',').slice(0,4)).toEqual(String(expected.transform).split(',').slice(0,4));
	await draft.close();
	const finalized = await printForm(page, '1600PTv2018', 'letter', false, 'Finalized');
	await expect(finalized.locator('.withholding-print-draft')).toHaveCount(0);
	await finalized.close();
});


for (const [code, bottomText] of [['1601Cv2018', '37Cash/Bank Debit Memo'], ['1602Qv2018', 'Tax Debit Memo'], ['1601FQ', 'Tax Debit Memo'], ['1602', 'Machine Validation/Revenue Official Receipt Details'], ['1604F', 'Signature over Printed Name of President/Vice']]) {
	for (const paper of ['letter', 'a4', 'long']) {
		test(`${code} ${paper} includes source-bottom payment rows in the physical PDF`, async ({page}) => {
			const print = await printForm(page, code, paper);
			const pdf = await print.pdf({preferCSSPageSize: true, printBackground: true});
			const text = execFileSync('pdftotext', ['-f', '1', '-l', '1', '-', '-'], {input: pdf}).toString();
			expect(text).toContain(bottomText);
			if (code !== '1602' && code !== '1604F') expect(text).toContain('Stamp of');
			else if (code === '1602') expect(text).toContain('Tax Agent Accreditation No.');
			const bounds = await print.locator('.withholding-print-page').evaluateAll(frames => frames.map(frame => {
				const header = frame.querySelector('.withholding-page-header')!.getBoundingClientRect();
				const footer = frame.querySelector('.withholding-page-footer')!.getBoundingClientRect();
				const content = frame.querySelector('.withholding-print-page-content')!.getBoundingClientRect();
				return {top:content.top, bottom:content.bottom, header:header.bottom, footer:footer.top};
			}));
			expect(bounds.filter(box => box.top < box.header || box.bottom > box.footer)).toEqual([]);
			await print.close();
		});
	}
}

test('legacy compensation section labels print in black', async ({page}) => {
	const print = await printForm(page, '1601C');
	await expect(print.locator('[id="frm1601c:j_id643"]')).toHaveCSS('color', 'rgb(0, 0, 0)');
	await expect(print.locator('[id="frm1601c:j_id680"]')).toHaveCSS('color', 'rgb(0, 0, 0)');
	await print.close();
});


for (const [code, prefix] of [['1600PTv2018', 'frm1600PT:'], ['1600VTv2018', 'frm1600VT:']]) {
	test(`${code} preserves the original separate RDO column`, async ({page}) => {
		const print = await printForm(page, code);
		const tin = await print.locator(`[id="${prefix}txtPg1TIN4"]`).boundingBox();
		const rdo = await print.locator('#rdoContainer').boundingBox();
		// The original 54 nonbreaking spaces placed the RDO value ~271 source pixels after TIN.
		const scale = await print.locator('.withholding-print-page').first().evaluate(element => Number((element as HTMLElement).style.getPropertyValue('--withholding-page-scale')));
		const originalGap = (rdo!.x - tin!.x - tin!.width) / scale;
		expect(originalGap).toBeGreaterThan(260);
		expect(originalGap).toBeLessThan(285);
		await print.close();
	});
}

test('0605 preserves source native field boxes, radios and printed outer frame', async ({page}) => {
	const print = await printForm(page, '0605');
	const month = print.locator('[id="frm0605:txtDueDateMonth"]');
	await expect(month).toHaveAttribute('data-print-control', 'text');
	await expect(month).toHaveAttribute('size', '2');
	await expect(month).toHaveCSS('border-top-style', 'inset');
	const border = await month.evaluate(element => {
		const content = element.closest<HTMLElement>('.withholding-print-page-content')!; const previous = content.style.zoom;
		content.style.zoom = '1';
		const result = getComputedStyle(element).borderTopWidth; content.style.zoom = previous; return result;
	});
	expect(border).toBe('2px');
	await expect(month).toHaveCSS('font-size', '13.3333px');
	const tin = print.locator('[id="frm0605:txtTIN1"]');
	await expect(tin).not.toHaveAttribute('data-fitted-print-value', '');
	await expect(tin).toHaveCSS('font-size', '13.3333px');
	const tinWidth = await tin.evaluate(element => element.getBoundingClientRect().width / Number(element.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale')));
	expect(tinWidth).toBeCloseTo(46, 1);
	for (const [id, expected] of [['frm0605:txtTaxPayerName', 416], ['frm0605:txtTax19', 151]] as const) {
		const width = await print.locator(`[id="${id}"]`).evaluate(element => element.getBoundingClientRect().width / Number(element.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale')));
		expect(width).toBeCloseTo(expected, 1);
	}
	const radio = print.locator('[id="frm0605:itemFiscalStartMonth:_1"]');
	await expect(radio).toHaveAttribute('type', 'radio');
	await expect(radio).toBeDisabled();
	const frameBorder = await print.locator('#formPaper').evaluate(element => {
		const content = element.closest<HTMLElement>('.withholding-print-page-content')!; const previous = content.style.zoom;
		content.style.zoom = '1'; const result = getComputedStyle(element).borderTopWidth; content.style.zoom = previous; return result;
	});
	expect(frameBorder).toBe('3px');
	await expect(print.locator('#formPaper')).toHaveCSS('border-top-color', 'rgb(0, 0, 0)');
	const frameOverflow = await print.locator('#formPaper').evaluate(element => {
		const box = element.getBoundingClientRect();
		return [...element.querySelectorAll('table')].filter(table => table.getBoundingClientRect().right > box.right + 0.5).length;
	});
	expect(frameOverflow).toBe(0);
	await print.close();
});

test('0605 Letter retains EQ profile scale and native PDF value typography', async ({page}) => {
	const print = await printForm(page, '0605', 'letter');

	const scale = await print.locator('.withholding-print-page').first().evaluate(element => Number((element as HTMLElement).style.getPropertyValue('--withholding-page-scale')));
	expect(scale).toBeCloseTo(0.75, 5);
	const pdf = await print.pdf({path:'/tmp/withholding-native0605-letter.pdf', preferCSSPageSize: true, printBackground: true});
	const sizes = JSON.parse(execFileSync('python3', ['-c', 'import sys,io,json,pdfplumber\nwith pdfplumber.open(io.BytesIO(sys.stdin.buffer.read())) as pdf: print(json.dumps([w["size"] for w in pdf.pages[0].extract_words(extra_attrs=["size"]) if w["text"] in ("PRINT", "001")]))'], {input:pdf}).toString());
	expect(sizes.length).toBeGreaterThanOrEqual(2);
	for (const size of sizes) expect(size).toBeCloseTo(7.5, 1);
	await print.close();
});


test('0605 text fitting preserves source boxes and changes font only for overflow', async ({page}) => {
	const measure = async (name: string) => {
		const print = await printForm(page, '0605', 'letter', false, 'Draft', name);
		const value = print.locator('[id="frm0605:txtTaxPayerName"]');
		await expect(value).toHaveValue(name);
		const box = await value.evaluate(element => {
			const frame = element.closest<HTMLElement>('.withholding-print-page')!;
			const scale = Number(frame.style.getPropertyValue('--withholding-page-scale'));
			const style = getComputedStyle(element);
			return {width:element.getBoundingClientRect().width / scale, height:element.getBoundingClientRect().height / scale, font:parseFloat(style.fontSize), fitted:element.hasAttribute('data-fitted-print-value')};
		});
		await print.close();
		return box;
	};
	const normal = await measure('PRINT GEOMETRY TEST');
	const long = await measure('EXAMPLE & PARTNERS <PRINT TEST> PROFESSIONAL SERVICES CORPORATION');
	expect(normal.fitted).toBe(false);
	expect(normal.font).toBeCloseTo(13.3333, 3);
	expect(long.fitted).toBe(true);
	expect(long.font).toBeLessThan(normal.font);
	expect(long.width).toBeCloseTo(normal.width, 1);
	expect(long.height).toBeCloseTo(normal.height, 1);
});

const framedLegacyCodes = new Set(['1600', '1600WP', '1601E', '1601F', '1603', '1606']);
const restoredFrameCodes = new Set(['1601FQ', '1601Cv2018', '1600PTv2018', '1600VTv2018', '1602Qv2018', '1603Qv2018', '1604Ev2018', '1604F']);
const printCodes = ['1601EQ', '0605', '0619E', '0619F', '1600', '1600PTv2018', '1600VTv2018', '1600WP', '1601C', '1601Cv2018', '1601E', '1601F', '1601FQ', '1602', '1602Qv2018', '1603', '1603Qv2018', '1604C', '1604CF', '1604E', '1604Ev2018', '1604F', '1606'];

for (const code of printCodes) {
	test(`${code} source frames contain their tables on all three papers`, async ({page}, testInfo) => {
		for (const paper of ['letter', 'a4', 'long']) {
			const print = await printForm(page, code, paper);
			const issues = await print.locator('#formPaper').evaluateAll(frames => frames.flatMap(frame => {
				const box = frame.getBoundingClientRect();
				const issues: string[] = [];
				const parent = frame.parentElement!;
				if (parent.tagName === 'TD' && box.right > parent.getBoundingClientRect().right + 1) issues.push('frame crosses parent cell into adjacent cell paint');
				for (const table of frame.querySelectorAll('table')) {
					const child = table.getBoundingClientRect();
					if (child.width && (child.left < box.left - 1 || child.right > box.right + 1)) issues.push(`table crosses source frame: ${table.className} ${child.left},${child.right} vs ${box.left},${box.right}`);
				}
				return issues;
			}));
			if (restoredFrameCodes.has(code)) {
				await expect(print.locator('[data-source-form-frame]')).toHaveCount(await print.locator('.withholding-print-page-content:not(.wh-continuation-page)').count());
			}
			if (framedLegacyCodes.has(code) || restoredFrameCodes.has(code)) {
				const boxes = await print.locator('#formPaper').evaluateAll(frames => frames.map(element => { const box = element.getBoundingClientRect(); const sheet = element.closest('.withholding-print-page')!.getBoundingClientRect(); return {x:box.x,y:box.y-sheet.y,width:box.width,height:box.height}; }));
				const pdf = await print.pdf({preferCSSPageSize:true, printBackground:true});
				for (const [index, box] of boxes.entries()) {
				const png = execFileSync('pdftoppm', ['-f', String(index+1), '-singlefile', '-r', '96', '-png', '-'], {input:pdf, timeout:10000});
				const imagePath = testInfo.outputPath(`${code}-${paper}-page${index+1}-frame.png`);
				writeFileSync(imagePath, png);
				await testInfo.attach(`${code}-${paper}-page${index+1}-frame`, {path:imagePath,contentType:'image/png'});
				const marginX = paper === 'a4' ? 10 * 96 / 25.4 : 0.45 * 96;
				const marginY = paper === 'a4' ? 12 * 96 / 25.4 : 0.55 * 96;
				const area = {x:box!.x + box!.width + marginX, top:box!.y + box!.height * 0.2 + marginY, bottom:box!.y + box!.height * 0.8 + marginY};
				const coverage = Number(execFileSync('python3', ['-c', 'import sys,io,json,math\nfrom PIL import Image\nim=Image.open(sys.argv[1]).convert("RGB")\na=json.loads(sys.argv[2]); ys=range(math.ceil(a["top"]),math.floor(a["bottom"]))\nprint(max(sum(max(im.getpixel((x,y)))<160 for y in ys)/len(ys) for x in range(math.floor(a["x"])-3,math.floor(a["x"])+2)))', imagePath, JSON.stringify(area)], {timeout:10000}).toString());
				expect(coverage, `${code} ${paper} page${index+1}: physical PDF right frame edge must remain visible`).toBeGreaterThan(0.95);
				}
			}
			expect(issues, `${code} ${paper}`).toEqual([]);
			await print.close();
		}
	});
}

for (const paper of ['letter', 'a4', 'long']) {
	test(`1604Ev2018 ${paper} guideline hanging labels stay inside their source columns`, async ({page}) => {
		const print = await printForm(page, '1604Ev2018', paper);
		const paragraphs = print.locator('#inserted p').filter({hasText:/^\s*(Item \d|Required Attachments)/});
		expect(await paragraphs.count()).toBeGreaterThanOrEqual(12);
		const overflow = await paragraphs.evaluateAll(elements => elements.flatMap(element => {
			const column = element.closest('td')!.getBoundingClientRect();
			const range = document.createRange(); range.selectNodeContents(element);
			return [...range.getClientRects()].filter(rect => rect.width > 0 && (rect.left < column.left + 1 || rect.right > column.right - 1)).map(() => element.textContent!.trim().slice(0,45));
		}));
		expect(overflow).toEqual([]);
		await print.close();
	});
}


for (const paper of ['letter', 'a4', 'long']) {
	test(`1601FQ ${paper} keeps each rate and percent unit on the same line`, async ({page}) => {
		const print = await printForm(page, '1601FQ', paper);
		const cells = print.locator('.wh-atc-rate-cell');
		expect(await cells.count()).toBeGreaterThan(0);
		const wrapped = await cells.evaluateAll(elements => elements.filter(element => {
			const input = element.querySelector('input')!.getBoundingClientRect();
			const unit = element.querySelector('span')!.getBoundingClientRect();
			return unit.left < input.right - 1 || unit.top >= input.bottom;
		}).length);
		expect(wrapped).toBe(0);
		await print.close();
	});
}
