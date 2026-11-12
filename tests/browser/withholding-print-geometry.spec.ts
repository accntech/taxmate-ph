import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

async function printForm(page: Page, code: string, paper = 'long', hostile = false, status = 'Draft', name = 'PRINT GEOMETRY TEST', overrides: Record<string, string> = {}) {
	await seedWorkspace(page);
	await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
	const html = await page.evaluate(async ({ code, paper, hostile, status, name, overrides }) => {
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
		Object.assign(values, overrides);
		return reports.buildReturnReport(catalog.getFormDefinition(code), values, status, paper);
	}, { code, paper, hostile, status, name, overrides });
	const result = await page.context().newPage();
	await result.setContent(html);
	await result.emulateMedia({ media: 'print' });
	await result.evaluate(() => document.fonts.ready);
	return result;
}

test('legacy title zero-width hint remains auto and ATC values use uniform typography', async ({ page }) => {
	const print = await printForm(page, '1600');
	const title = print.locator('span').filter({ hasText: /^Monthly Remittance Return of[\s\S]*Percentage[\s\S]*Taxes Withheld$/ });
	const width = await title.locator('..').evaluate(element => parseFloat(getComputedStyle(element).width));
	// Original title cell is 598px. Converting width="0" to CSS width:0px reduced it to 247px.
	expect(width).toBeGreaterThan(550);
	await expect(title).toHaveCSS('font-size', '24px');
	const amount = print.locator('[id="frm1600:txtTaxBase1"]');
	const font = await amount.evaluate(element => ({ size: parseFloat(getComputedStyle(element).fontSize), height: getComputedStyle(element).lineHeight, scale: Number(element.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale')) }));
	// Entered amounts use the shared value size instead of the table label size.
	expect(font.size * font.scale * 0.75).toBeCloseTo(7.38, 2);
	expect(parseFloat(font.height)).toBeGreaterThan(12);
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
	await expect(month).toHaveCSS('font-size', '12px');
	const tin = print.locator('[id="frm0605:txtTIN1"]');
	await expect(tin).not.toHaveAttribute('data-fitted-print-value', '');
	await expect(tin).toHaveCSS('font-size', '12px');
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

test('0605 Letter retains EQ profile scale and uniform PDF value typography', async ({page}) => {
	const print = await printForm(page, '0605', 'letter');

	const scale = await print.locator('.withholding-print-page').first().evaluate(element => Number((element as HTMLElement).style.getPropertyValue('--withholding-page-scale')));
	expect(scale).toBeCloseTo(0.75, 5);
	const pdf = await print.pdf({path:'/tmp/withholding-native0605-letter.pdf', preferCSSPageSize: true, printBackground: true});
	const sizes = JSON.parse(execFileSync('python3', ['-c', 'import sys,io,json,pdfplumber\nwith pdfplumber.open(io.BytesIO(sys.stdin.buffer.read())) as pdf: print(json.dumps([w["size"] for w in pdf.pages[0].extract_words(extra_attrs=["size"]) if w["text"] in ("PRINT", "001")]))'], {input:pdf}).toString());
	expect(sizes.length).toBeGreaterThanOrEqual(2);
	for (const size of sizes) expect(size).toBeCloseTo(7.38, 2);
	await print.close();
});


test('0605 clipping preserves source boxes and font size for overflow', async ({page}) => {
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
	expect(normal.font * 0.75 * 0.75).toBeCloseTo(7.38, 2);
	expect(long.fitted).toBe(false);
	expect(long.font).toBe(normal.font);
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

for (const paper of ['long', 'letter', 'a4']) {
 test(`0605 ${paper} uses uniform clipped values and matching year-ended borders`, async ({ page }, testInfo) => {
  const name = 'HARBORVIEW TRADING AND SERVICES CORPORATION WITH A DELIBERATELY OVERLONG REGISTERED NAME';
  const print = await printForm(page, '0605', paper, false, 'Draft', name);
  const values = print.locator('[data-print-value], [data-print-control="select"], #rdoSelect');
  const sizes = await values.evaluateAll(elements => elements.map(e => parseFloat(getComputedStyle(e).fontSize) * Number(e.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale')) * 0.75));
  for (const size of sizes) expect(size).toBeCloseTo(7.38, 2);
  const field = print.locator('[id="frm0605:txtTaxPayerName"]');
  await expect(field).toHaveValue(name);
  await expect(field).not.toHaveAttribute('data-fitted-print-value', '');
  await expect(field).toHaveCSS('overflow-x', 'clip');
  await expect(field).toHaveCSS('text-overflow', 'clip');
  const borders = await print.locator('[id="frm0605:itemYearEndMonth"], [id="frm0605:txtYearEnded"], [id="frm0605:txtDueDateMonth"]').evaluateAll(elements => {
   elements[0].closest<HTMLElement>('.withholding-print-page-content')!.style.zoom = '1';
   return elements.map(e => {const s=getComputedStyle(e);return [s.borderTopWidth,s.borderTopStyle,s.borderTopColor,s.height];});
  });
  expect(borders[0]).toEqual(borders[1]);
  expect(borders[1]).toEqual(borders[2]);
  // Restore export scaling after measurement.
  await print.locator('.withholding-print-page-content').evaluate(e => (e as HTMLElement).style.removeProperty('zoom'));
  const pdf = await print.pdf({ path: testInfo.outputPath(`0605-${paper}-overflow.pdf`), preferCSSPageSize: true, printBackground: true });
  expect(execFileSync('pdfinfo', ['-'], { input: pdf }).toString().match(/^Pages:\s+(\d+)/m)?.[1]).toBe('1');
  await print.close();
 });
}

test('0605 prints black radio dots and joins full-width sections to the right frame', async ({page}) => {
 const print = await printForm(page, '0605');
 const checked=print.locator('input[type="radio"]:checked').first();
 await expect(checked).toHaveCSS('appearance','none');
 await expect(checked).toHaveCSS('border-radius','50%');
 const gaps=await print.locator('#formPaper').evaluate(frame=>{
  frame.closest<HTMLElement>('.withholding-print-page-content')!.style.zoom='1';
  const right=frame.getBoundingClientRect().right-parseFloat(getComputedStyle(frame).borderRightWidth);
  return [...frame.querySelectorAll('table')].filter(t=>t.getBoundingClientRect().width>=800).map(t=>({section:t.className,gap:right-t.getBoundingClientRect().right})).filter(t=>Math.abs(t.gap)>1);
 });
 expect(gaps).toEqual([]);
 await print.locator('.withholding-print-page-content').evaluate(e => (e as HTMLElement).style.removeProperty('zoom'));
 const pdf = await print.pdf({preferCSSPageSize:true, printBackground:true});
 const gridRules = Number(execFileSync('python3', ['-c', 'import sys,io,pdfplumber\nwith pdfplumber.open(io.BytesIO(sys.stdin.buffer.read())) as pdf: print(sum(1 for r in pdf.pages[0].rects if r.get("non_stroking_color") and all(abs(c-2/3)<0.01 for c in r["non_stroking_color"])))'], {input:pdf}).toString());
 expect(gridRules, 'the original gray table grid remains painted in the PDF').toBeGreaterThan(40);
 await print.close();
});

test('0605 uppercases entered values while preserving template case', async ({page}) => {
 const print = await printForm(page, '0605', 'long', false, 'Draft', 'Mixed Case Taxpayer');
 await expect(print.locator('[data-form-code="0605"]')).toHaveCSS('text-transform','none');
 await expect(print.locator('[id="frm0605:txtTaxPayerName"]')).toHaveCSS('text-transform','uppercase');
 await expect(print.getByText('Payment Form', {exact:true})).toHaveCSS('text-transform','none');
 await expect(print.locator('img[id="frm0605_2:jurat"]')).toHaveCount(1);
 await print.close();
});

test('0605 radio rings and selected centers use circular vector shapes', async ({page}) => {
 const print=await printForm(page,'0605');
 const radio=print.locator('input[type="radio"]:checked').first();
 const geometry=await radio.evaluate(e=>{const s=getComputedStyle(e),b=e.getBoundingClientRect();return {width:b.width,height:b.height,image:s.backgroundImage};});
 expect(geometry.width).toBeCloseTo(geometry.height,5);
 await expect(radio.locator('..').locator('.pdf-radio-vector circle')).toHaveCount(2);
 const empty=print.locator('input[type="radio"]:not(:checked)').first();
 await expect(empty.locator('..').locator('.pdf-radio-vector circle')).toHaveCount(1);
 await print.close();
});

for (const paper of ['letter', 'a4', 'long']) {
	test(`1601E ${paper} select values fit vertically and footer sections reach the frame`, async ({ page }, testInfo) => {
		const print = await printForm(page, '1601E', paper);
		const fields = await print.locator('[id="frm1601E:j_id201"], [id="frm1601E:j_id402"], [id="frm1601E:txtYear"]').evaluateAll(elements => elements.map(element => {
			const style = getComputedStyle(element);
			return { id: element.id, height: parseFloat(style.height), boxSizing: style.boxSizing,
				available: element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
				font: parseFloat(style.fontSize) };
		}));
		for (const field of fields.filter(field => field.id !== 'frm1601E:txtYear')) {
			expect(field.available, `${field.id} must contain a full line of text`).toBeGreaterThanOrEqual(field.font);
			expect(field.height).toBeCloseTo(fields.find(field => field.id === 'frm1601E:txtYear')!.height, 0);
		}
		const sections = await print.locator('.imgClass').evaluateAll(elements => elements.map(element => {
			const frame = element.closest('#formPaper')!;
			const scale = Number(element.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale'));
			const right = frame.getBoundingClientRect().right - parseFloat(getComputedStyle(frame).borderRightWidth) * scale;
			return { wrapper: (right - element.getBoundingClientRect().right) / scale,
				content: (right - element.firstElementChild!.getBoundingClientRect().right) / scale };
		}));
		for (const section of sections) {
			expect(Math.abs(section.wrapper)).toBeLessThan(2);
			expect(Math.abs(section.content)).toBeLessThan(2);
		}
		const pdf = await print.pdf({ preferCSSPageSize: true, printBackground: true });
		writeFileSync(testInfo.outputPath('1601e.pdf'), pdf);
		const png = execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-r', '140', '-png', '-'], { input: pdf });
		writeFileSync(testInfo.outputPath('1601e.png'), png);
		await testInfo.attach('1601e', { path: testInfo.outputPath('1601e.png'), contentType: 'image/png' });
		await print.close();
	});
}

for (const paper of ['letter', 'a4', 'long']) {
test(`1600PT ${paper} header follows the EQ column proportions without wrapping the form number`, async ({ page }, testInfo) => {
	const eq = await printForm(page, '1601EQ', paper);
	const proportions = await eq.locator('.legacy-form-header > tbody > tr > td').evaluateAll(cells => cells.map(cell => cell.getBoundingClientRect().width / cell.parentElement!.getBoundingClientRect().width));
	await eq.close();
	const print = await printForm(page, '1600PTv2018', paper);
	for (const header of await print.locator('table.FormHeader').all()) {
		const geometry = await header.evaluate(table => {
			const cells = [...table.querySelectorAll(':scope > tbody > tr > td')];
			const number = cells[0].querySelector('.FormHeader1')!;
			const range = document.createRange();
			range.selectNodeContents(number);
			const barcode = cells[2].querySelector('img')!;
			const caption = cells[2].querySelector('span')!;
			return { proportions: cells.map(cell => cell.getBoundingClientRect().width / table.getBoundingClientRect().width),
				numberLines: range.getClientRects().length, barcodeBottom: barcode.getBoundingClientRect().bottom, captionTop: caption.getBoundingClientRect().top };
		});
		expect(geometry.numberLines).toBe(1);
		geometry.proportions.forEach((width, index) => expect(Math.abs(width - proportions[index]), JSON.stringify({ actual: geometry.proportions, eq: proportions })).toBeLessThan(0.025));
		expect(geometry.captionTop).toBeGreaterThanOrEqual(geometry.barcodeBottom - 1);
	}
	const pdf = await print.pdf({ path: testInfo.outputPath('1600pt.pdf'), preferCSSPageSize: true, printBackground: true });
	writeFileSync(testInfo.outputPath('1600pt-page2.png'), execFileSync('pdftoppm', ['-f', '2', '-singlefile', '-r', '140', '-png', '-'], { input: pdf }));
	writeFileSync(testInfo.outputPath('1600pt.png'), execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-r', '140', '-png', '-'], { input: pdf }));
	await print.close();
});

test(`1600PT ${paper} standalone fields fill their cells and section borders reach the frame`, async ({ page }) => {
	const print = await printForm(page, '1600PTv2018', paper);
	const issues = await print.locator('#formPaper').evaluateAll(frames => frames.flatMap(frame => {
		frame.closest<HTMLElement>('.withholding-print-page-content')!.style.zoom = '1';
		const issues: string[] = [];
		for (const input of frame.querySelectorAll('input[data-print-control="text"]')) {
			const cell = input.parentElement!;
			if (cell.tagName !== 'TD' || cell.children.length !== 1 || ![...cell.childNodes].every(node => node === input || !node.textContent?.trim())) continue;
			const style = getComputedStyle(cell);
			const available = cell.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
			const gap = available - input.getBoundingClientRect().width;
			if (Math.abs(gap) > 2) issues.push(`${input.id}: field gap ${gap}`);
		}
		const right = frame.getBoundingClientRect().right - parseFloat(getComputedStyle(frame).borderRightWidth);
		for (const table of frame.querySelectorAll('table')) {
			const box = table.getBoundingClientRect();
			if (box.width < frame.clientWidth * 0.95 || Math.abs(box.left - frame.getBoundingClientRect().left) > 8) continue;
			if (Math.abs(right - box.right) > 2) issues.push(`${table.className}: section gap ${right - box.right}`);
		}
		return issues;
	}));
	expect(issues).toEqual([]);
	await print.close();
});

test(`1600PT ${paper} tax amount column stays aligned and all fields have full text height`, async ({ page }) => {
	const print = await printForm(page, '1600PTv2018', paper);
	const amounts = await print.locator('.ContentRight > input').evaluateAll(inputs => inputs.map(input => input.getBoundingClientRect().left));
	expect(Math.max(...amounts) - Math.min(...amounts)).toBeLessThan(1);
	const amountGaps = await print.locator('.ContentRight > input').evaluateAll(inputs => inputs.map(input => input.parentElement!.getBoundingClientRect().right - input.getBoundingClientRect().right));
	for (const gap of amountGaps) expect(gap).toBeLessThan(1);
	const emailGap = await print.locator('[id="frm1600PT:txtPg1Pt1I11Email"]').evaluate(input => input.parentElement!.getBoundingClientRect().right - input.getBoundingClientRect().right);
	expect(emailGap).toBeLessThan(2);
	const heights = await print.locator('input[data-print-control="text"]').evaluateAll(inputs => inputs.map(input => input.getBoundingClientRect().height / Number(input.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale'))));
	for (const height of heights.filter(height => height > 0)) expect(height).toBeGreaterThanOrEqual(18.5);
	await print.close();
});

}

for (const paper of ['letter', 'a4', 'long']) {
	test(`1601C ${paper} encloses every section and renders full-height select values`, async ({ page }, testInfo) => {
		const print = await printForm(page, '1601C', paper);
		const outside = await print.locator('.withholding-print-page-content:not(.wh-continuation-page) [data-field-id]').evaluateAll(fields => fields.filter(field => !field.closest('#formPaper')).map(field => field.id));
		expect(outside).toEqual([]);
		for (const field of await print.locator('.wh-print-select').all()) {
			const metrics = await field.evaluate(element => ({ available: element.clientHeight, font: parseFloat(getComputedStyle(element).fontSize) }));
			expect(metrics.available).toBeGreaterThanOrEqual(metrics.font);
		}
		const gaps = await print.locator('#formPaper').evaluate(frame => {
			frame.closest<HTMLElement>('.withholding-print-page-content')!.style.zoom = '1';
			const right = frame.getBoundingClientRect().right - parseFloat(getComputedStyle(frame).borderRightWidth);
			return [...frame.querySelectorAll<HTMLElement>('.wh-inline-96a4c96170f9, #tblSched1, #tblSched2, .imgClass')].map(element => ({ section: element.id || element.className, gap: right - element.getBoundingClientRect().right }));
		});
		for (const section of gaps) expect(Math.abs(section.gap), section.section).toBeLessThan(2);
		// Reload the same report because the geometry check temporarily removes its print scale.
		await print.close();
		const rendered = await printForm(page, '1601C', paper);
		const pdf = await rendered.pdf({ path: testInfo.outputPath('1601c.pdf'), preferCSSPageSize: true, printBackground: true });
		expect(execFileSync('pdfinfo', ['-'], { input: pdf }).toString().match(/^Pages:\s+(\d+)/m)?.[1]).toBe('1');
		writeFileSync(testInfo.outputPath('1601c.png'), execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-r', '140', '-png', '-'], { input: pdf }));
		await rendered.close();
	});
}

for (const [code, id] of [['1601E', 'frm1601E:j_id402'], ['1601C', 'frm1601c:selTreaty'], ['1603', 'frm1603:lstTaxTreaty']]) {
	for (const value of ['', '1']) {
		test(`${code} tax relief specification keeps a usable width for ${value ? 'selected' : 'blank'} values`, async ({ page }, testInfo) => {
			const print = await printForm(page, code, 'long', false, 'Draft', 'PRINT GEOMETRY TEST', { [id]: value, ...(code === '1601E' ? { 'frm1601E:optRelief': value ? 'Y' : 'N' } : {}) });
			const field = print.locator(`[id="${id}"]`);
			const width = await field.evaluate(element => element.getBoundingClientRect().width / Number(element.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale')));
			expect(width).toBeGreaterThanOrEqual(159);
			if (code === '1603') {
				const gap = await print.locator('.wh-inline-74e905a72558').evaluate(table => {
					const labels = table.querySelectorAll('.wh-inline-429482632af7');
					const scale = Number(table.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale'));
					return (labels[1].getBoundingClientRect().left - labels[0].getBoundingClientRect().right) / scale;
				});
				expect(gap).toBeGreaterThanOrEqual(11.5);
				expect(gap).toBeLessThanOrEqual(24);
				await print.screenshot({ path: testInfo.outputPath('1603-tax-relief.png'), fullPage: true });
			}
			if (value) await expect(field).not.toHaveText('');
			await print.close();
		});
	}
}

for (const code of printCodes.filter(code => !['1601EQ', '0619E', '0619F'].includes(code))) {
	test(`${code} all original sections stay inside their frame and select text is legible`, async ({ page }) => {
		const print = await printForm(page, code);
		const issues = await print.locator('.withholding-print-page-content:not(.wh-continuation-page)').evaluateAll(pages => pages.flatMap(page => {
			const issues: string[] = [];
			for (const field of page.querySelectorAll<HTMLElement>('[data-field-id], .imgClass')) {
				if (field.getBoundingClientRect().width && !field.closest('#formPaper')) issues.push(`outside frame: ${field.id || field.className}`);
			}
			for (const field of page.querySelectorAll<HTMLElement>('.wh-print-select')) {
				if (!field.getBoundingClientRect().width) continue;
				const style = getComputedStyle(field);
				if (field.clientHeight < parseFloat(style.fontSize)) issues.push(`select clips vertically: ${field.id}`);
				const scale = Number(page.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale'));
				if (/(?:selTreaty|lstTaxTreaty|lstSpecialTax|drpSpecialTax|SpecialLawSelect|j_id402)$/i.test(field.id) && field.getBoundingClientRect().width / scale < 100) issues.push(`select collapsed: ${field.id}`);
			}
			(page as HTMLElement).style.zoom = '1';
			for (const frame of page.querySelectorAll<HTMLElement>('#formPaper')) {
				const box = frame.getBoundingClientRect();
				const scale = 1;
				const border = parseFloat(getComputedStyle(frame).borderRightWidth) * scale;
				const width = box.width - border * 2;
				for (const section of frame.querySelectorAll('table')) {
					const bounds = section.getBoundingClientRect();
					if (bounds.width < width * 0.9 || section.parentElement!.getBoundingClientRect().width < width * 0.95 || Math.abs(bounds.left - box.left - border) > scale * 2) continue;
					const gap = (box.right - border - bounds.right) / scale;
					if (gap > 2) issues.push(`section stops short: ${section.className} (${gap.toFixed(1)}px)`);
				}
			}
			return issues;
		}));
		expect(issues).toEqual([]);
		await print.close();
	});
}

for (const code of ['1601F', '1601FQ']) {
	test(`${code} treaty schedule select boxes fill their allotted cells`, async ({ page }) => {
		const print = await printForm(page, code);
		const gaps = await print.locator('[data-source-page="2"] .wh-print-select').evaluateAll(fields => fields.filter(field => field.getBoundingClientRect().width).map(field => {
			const cell = field.parentElement!;
			const style = getComputedStyle(cell);
			return { id: field.id, gap: cell.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - field.getBoundingClientRect().width / Number(field.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale')) };
		}));
		expect(gaps.length).toBeGreaterThan(0);
		for (const field of gaps) expect(Math.abs(field.gap), field.id).toBeLessThan(2);
		await print.close();
	});
}

for (const paper of ['letter', 'a4', 'long']) {
for (const code of printCodes.filter(code => !['1601EQ', '0619E', '0619F'].includes(code))) {
	test(`${code} ${paper} source headers keep readable columns like EQ`, async ({ page }, testInfo) => {
		const print = await printForm(page, code, paper);
		const issues = await print.locator('.withholding-print-page-content:not(.wh-continuation-page)').evaluateAll(pages => pages.flatMap(page => {
			const issues: string[] = [];
			for (const header of page.querySelectorAll('table.wh-eq-header')) {
				const cells = header.querySelectorAll(':scope > tbody > tr:first-child > td');
				if (cells.length !== 3 || !cells[0].textContent?.includes('BIR Form No.') || !cells[2].querySelector('img')) issues.push('header grid applied to a body table');
			}
			const labels = [...page.querySelectorAll('span')].filter(element => [...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && /BIR Form No\./.test(node.textContent ?? '')));
			for (const label of labels) {
				const cell = label.closest('td');
				const row = cell?.parentElement;
				if (!cell || row?.tagName !== 'TR' || row.children.length < 3 || row.children.length > 4) continue;
				const cells = [...row.children];
				const number = [...cell.querySelectorAll('span')].find(element => /^\d{4}(?:[- ]?[A-Z]{1,3})?\s*$/.test(element.textContent?.trim() ?? ''));
				if (number) {
					const range = document.createRange(); range.selectNodeContents(number);
					if (range.getBoundingClientRect().height > parseFloat(getComputedStyle(number).fontSize) * 1.7) issues.push(`form number wraps: ${number.textContent}`);
				}
				for (const headerCell of cells) {
					const bounds = headerCell.getBoundingClientRect();
					const walker = document.createTreeWalker(headerCell, NodeFilter.SHOW_TEXT);
					let text: Node | null;
					while ((text = walker.nextNode())) {
						if (!text.textContent?.trim()) continue;
						const range = document.createRange(); range.selectNodeContents(text);
						if ([...range.getClientRects()].some(box => box.left < bounds.left - 1 || box.right > bounds.right + 1)) issues.push(`header text crosses its column: ${text.textContent.trim().slice(0, 50)}`);
					}
				}
				if (cells.length !== 3 || cells[0] !== cell || !cells[2].querySelector('img')) continue;
				const proportions = cells.map(cell => cell.getBoundingClientRect().width / row.getBoundingClientRect().width);
				[0.175, 0.565, 0.26].forEach((expected, index) => {
					if (Math.abs(proportions[index] - expected) > 0.035) issues.push(`header column ${index + 1}: ${(proportions[index] * 100).toFixed(1)}%`);
				});
				const barcode = cells[2].querySelector('img')!;
				const image = barcode.getBoundingClientRect();
				const box = cells[2].getBoundingClientRect();
				if (image.right > box.right + 1) issues.push('barcode crosses its cell');
				for (const caption of cells[2].querySelectorAll('span')) {
					if (caption.textContent?.trim() && caption.getBoundingClientRect().top < image.bottom - 1) issues.push('barcode caption sits beside its image');
				}
			}
			return issues;
		}));
		expect(issues).toEqual([]);
		const pdf = await print.pdf({ path: testInfo.outputPath(`${code}-headers.pdf`), preferCSSPageSize: true, printBackground: true });
		if (paper === 'long') writeFileSync(testInfo.outputPath(`${code}-header.png`), execFileSync('pdftoppm', ['-f', '1', '-singlefile', '-r', '140', '-x', '0', '-y', '90', '-W', '1300', '-H', '380', '-png', '-'], { input: pdf }));
		await print.close();
	});
}

}

for (const [code, pageCount] of Object.entries({
	'1600PTv2018': 2, '1600VTv2018': 2, '1601Cv2018': 2, '1601F': 2,
	'1601FQ': 2, '1602': 2, '1602Qv2018': 3, '1603Qv2018': 2,
	'1604Ev2018': 2, '1604F': 2
})) {
	for (const paper of ['letter', 'a4', 'long']) {
		test(`${code} ${paper} PDF pages have matching side margins`, async ({ page }, testInfo) => {
			const print = await printForm(page, code, paper);
			const margins = await print.locator('#formPaper').evaluateAll(frames => frames.map(frame => {
				const box = frame.getBoundingClientRect();
				const sheet = frame.closest('.withholding-print-page')!.getBoundingClientRect();
				return { left: box.left - sheet.left, right: sheet.right - box.right };
			}));
			await print.pdf({ path: testInfo.outputPath(`${code}.pdf`), preferCSSPageSize: true, printBackground: true });
			const pdfPath = testInfo.outputPath(`${code}.pdf`);
			expect(execFileSync('pdfinfo', [pdfPath]).toString().match(/^Pages:\s+(\d+)/m)?.[1]).toBe(String(pageCount));
			const overflow = await print.locator('.withholding-print-page').evaluateAll(frames => frames.flatMap(frame => {
				const sheet = frame.getBoundingClientRect();
				const header = frame.querySelector('.withholding-page-header')!.getBoundingClientRect();
				const footer = frame.querySelector('.withholding-page-footer')!.getBoundingClientRect();
				return [...frame.querySelectorAll('.withholding-print-page-content, .withholding-print-page-content *')].filter(element => {
					const box = element.getBoundingClientRect();
					return box.width > 0 && box.height > 0 && (box.left < sheet.left - 1 || box.right > sheet.right + 1 || box.top < header.bottom || box.bottom > footer.top);
				}).map(element => element.id || element.className);
			}));
			expect(overflow).toEqual([]);
			expect(margins).toHaveLength(pageCount);
			expect(Math.max(...margins.map(box => box.left)) - Math.min(...margins.map(box => box.left)), JSON.stringify(margins)).toBeLessThan(1);
			expect(Math.max(...margins.map(box => box.right)) - Math.min(...margins.map(box => box.right)), JSON.stringify(margins)).toBeLessThan(1);
			await print.close();
		});
	}
}
