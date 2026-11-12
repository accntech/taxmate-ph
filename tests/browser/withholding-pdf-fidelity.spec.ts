import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { seedWorkspace, taxpayerId } from './fixtures';

const codes = ['0605','0619E','0619F','1600','1600PTv2018','1600VTv2018','1600WP','1601C','1601Cv2018','1601E','1601EQ','1601F','1601FQ','1602','1602Qv2018','1603','1603Qv2018','1604C','1604CF','1604E','1604Ev2018','1604F','1606'];
const papers = ['long', 'letter', 'a4'] as const;
const outputRoot = path.resolve('docs/verification/withholding-pdfs');

for (const code of codes) {
 test(`${code} preserves its original form on each supported paper`, async ({ page, context }) => {
  test.setTimeout(90000);
  await seedWorkspace(page);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const result = await page.evaluate(async code => {
   const browserModuleRoot = '/src/lib';
   const catalog = await import(`${browserModuleRoot}/forms/index.ts`);
   const source = await import(`${browserModuleRoot}/forms/withholding-definitions.ts`);
   const rules = await import(`${browserModuleRoot}/forms/withholding-rules.ts`);
   const reports = await import(`${browserModuleRoot}/printing/return-report.ts`);
   const profile = { id:'0012345670008',tin1:'001',tin2:'234',tin3:'567',branchCode:'0008',rdoCode:'040',taxpayerName:'EXAMPLE WITHHOLDING COMPANY',address:'123 SAMPLE STREET',address2:'SAMPLE CITY',zipCode:'1000',contactNumber:'09171234567',category:'P',email:'example@example.com',lineOfBusiness:'PROFESSIONAL SERVICES',taxpayerClassification:'N' as const };
   const definition = catalog.getFormDefinition(code)!;
   const sourceDefinition = source.getWithholdingDefinition(code);
   let values: Record<string,string>;
   if (!sourceDefinition) {
    const workspace = await import(`${browserModuleRoot}/ebirforms/ebirforms-workspace.svelte.ts`);
    values = { ...workspace.createInitialFormValues(profile),'frm1601EQ:txtYear':'2025','frm1601EQ:optQuarter':'Q2','frm1601EQ:optTaxesWithheld':'Y','frm1601EQ:optAmendedReturn':'Y','frm1601EQ:txtATC13':'WI120','frm1601EQ:txtTaxBase13':'100000','frm1601EQ:txtRemittanceFirstMonth':'500','frm1601EQ:txtSurcharge':'10' };
   } else {
    values = rules.createWithholdingValues(code, profile);
    const year = String(sourceDefinition.maxYear ?? 2025);
    const populate = (field: typeof sourceDefinition.sections[number]['fields'][number]) => {
     if (field.readonly || field.profileKey) return;
     if (field.type === 'date') values[field.id] = `${year}-02-28`;
     else if (field.type === 'select') values[field.id] = field.id.endsWith('optCategory') ? 'P' : /optAmend|optWithheld/.test(field.id) ? 'Y' : field.options?.find((option: {value:string})=>option.value==='N')?.value ?? field.options?.[0]?.value ?? '';
     else if (field.type === 'money') values[field.id] = /surcharge|interest|compromise|penalt/i.test(field.label) ? '10.00' : '1000.00';
     else if (field.type === 'number') values[field.id] = /year/i.test(field.label) ? year : /exchange|conversion/i.test(field.label) ? '56' : '1';
     else values[field.id] = /email/i.test(field.label) ? 'example@example.com' : /TIN/i.test(field.label) ? '9876543210000' : /RDO/i.test(field.label) ? '040' : /ATC/i.test(field.label) ? source.getWithholdingAtcs(code,'P')[0]?.code ?? 'WI161' : /Treaty code/i.test(field.label) ? 'US' : 'SAMPLE';
    };
    for (const section of sourceDefinition.sections) for (const field of section.fields) populate(field);
    for (const schedule of sourceDefinition.schedules) for (const field of schedule.rows[0]?.fields ?? []) populate(field);
    values[sourceDefinition.yearField] = year;
    if (sourceDefinition.monthField) values[sourceDefinition.monthField] = '02';
    if (sourceDefinition.quarterField) values[sourceDefinition.quarterField] = 'Q2';
    for (const field of source.withholdingFields(sourceDefinition, values)) {
     if (field.showWhen && values[field.showWhen.field] !== field.showWhen.value && !field.readonly) values[field.id] = '';
    }
    values = rules.calculateWithholding(code, values);
   }
   const rendered = await Promise.all(['long','letter','a4'].map(async paper => [paper, await reports.buildReturnReport(definition,values,'Draft',paper as 'long'|'letter'|'a4')]));
   const component = sourceDefinition ? await import(`${browserModuleRoot}/forms/printing/form-${code.toLowerCase()}-print.svelte`) : null;
   const diagnostics = component ? (await import(`${browserModuleRoot}/printing/withholding-print-model.ts`)).createWithholdingPrintModel(code, values, component.printBindings).diagnostics : null;
   return {values, diagnostics, rendered:Object.fromEntries(rendered)};
  }, code);
  await mkdir(path.join(outputRoot,code), {recursive:true});
  await writeFile(path.join(outputRoot,code,'values.json'),JSON.stringify(result.values,null,2));
  await writeFile(path.join(outputRoot,code,'diagnostics.json'),JSON.stringify(result.diagnostics,null,2));
  if (result.diagnostics) {
   expect(result.diagnostics.unmapped, `${code} source mappings`).toEqual([]);
   expect(result.diagnostics.attached, `${code} first-row values belong on the original form`).toEqual([]);
  }
  const metrics: Record<string,unknown> = {};
  for (const paper of papers) {
   const html = result.rendered[paper];
   expect(html.includes('EXAMPLE WITHHOLDING COMPANY'), `${code}/${paper} taxpayer`).toBe(true);
   expect(html.includes('data:image/'), `${code}/${paper} original assets`).toBe(true);
   expect(/<script\b|\son(?:click|load|change|blur|keypress)\s*=|<object\b|<iframe\b/i.test(html), `${code}/${paper} inert markup`).toBe(false);
   // Every form uses its compiled print component.
   if (code !== '1601EQ') expect(html.includes(`data-form-code="${code}"`), `${code}/${paper} compiled form component`).toBe(true);
   const printPage = await context.newPage();
   const external: string[] = [];
   printPage.on('request', request => {if (/^https?:/i.test(request.url())) external.push(request.url());});
   await printPage.setContent(html.replaceAll('__EBIRFORMS_PRINT_SOURCE_URL__','Local layout verification'));
   await printPage.emulateMedia({media:'print'});
   await printPage.evaluate(() => document.fonts.ready);
   if (code !== '1601EQ') {
    const count = result.diagnostics!.pages;
    const frames = printPage.locator('.withholding-print-page');
    await expect(frames).toHaveCount(count);
    for (let index = 0; index < count; index++) {
     await expect(frames.nth(index).locator('.withholding-page-header')).toBeVisible();
     await expect(frames.nth(index).locator('.withholding-page-header')).toContainText(`Page ${index + 1} of ${count}`);
     await expect(frames.nth(index).locator('.withholding-page-footer')).toBeVisible();
     await expect(frames.nth(index).locator('.pdf-report-source')).toHaveText('Local layout verification');
     await expect(frames.nth(index).locator('.withholding-print-draft')).toHaveCount(1);
    }
   }
   await writeFile(path.join(outputRoot,code,`${paper}.html`),html);
   await printPage.pdf({path:path.join(outputRoot,code,`${paper}.pdf`),preferCSSPageSize:true,printBackground:true});
   metrics[paper] = await printPage.evaluate(() => ({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,images:[...document.images].map(image=>({complete:image.complete,width:image.naturalWidth})),text:document.body.innerText}));
   const info = execFileSync('pdfinfo', [path.join(outputRoot,code,`${paper}.pdf`)], {encoding:'utf8'});
   expect(Number(info.match(/^Pages:\s+(\d+)/m)?.[1]), `${code}/${paper} physical pages`).toBe(result.diagnostics?.pages ?? 1);
   const images = await printPage.evaluate(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
   expect(images, `${code}/${paper} embedded assets`).toBe(true);
   expect(external).toEqual([]);
   await printPage.close();
  }
  await writeFile(path.join(outputRoot,code,'metrics.json'),JSON.stringify(metrics,null,2));
 });
}
