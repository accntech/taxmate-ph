import { expect, test } from "@playwright/test";
import { seedWorkspace, taxpayerId } from "./fixtures";

test.beforeEach(async ({ page }) => {
  await seedWorkspace(page);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
});

test("ATC rows beyond the original six slots continue in bounded pages without losing amounts", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const base = "/src/lib";
    const definitions = await import(
      `${base}/forms/withholding-definitions.ts`
    );
    const rules = await import(`${base}/forms/withholding-rules.ts`);
    const reports = await import(`${base}/printing/return-report.ts`);
    const catalog = await import(`${base}/forms/index.ts`);
    const definition = definitions.getWithholdingDefinition("1601FQ");
    const values = rules.createWithholdingValues("1601FQ");
    values[definitions.withholdingRowCountKey(definition, "atc")] = "25";
    values[definition.prefix + "optWithheld"] = "Y";
    const atc = definitions.getWithholdingAtcs("1601FQ")[0].code;
    for (let row = 1; row <= 25; row++) {
      values[definition.prefix + `txtAtcCode${row}`] = atc;
      values[definition.prefix + `txtTaxBase${row}`] = String(1000 + row);
    }
    const component = await import(`${base}/forms/printing/form-1601fq-print.svelte`);
    const model = await import(`${base}/printing/withholding-print-model.ts`);
    return {html: await reports.buildReturnReport(catalog.getFormDefinition('1601FQ'),values,'Draft','long'), diagnostics: model.createWithholdingPrintModel('1601FQ',values,component.printBindings).diagnostics};
  });
  expect(result.diagnostics.unmapped).toEqual([]);
  expect(result.diagnostics.pages).toBe(4);
  for (let row = 7; row <= 25; row++) {
    expect(result.diagnostics.attached).toContain(`frm1601FQ:txtTaxBase${row}`);
  }
  await page.setContent(result.html);
  await page.emulateMedia({media:'print'});
  await page.evaluate(() => document.fonts.ready);
  const continuations = page.locator(".withholding-print-continuation");
  await expect(continuations).toHaveCount(2);
  await expect(continuations.nth(0).locator("tbody tr")).toHaveCount(18);
  await expect(continuations.nth(1).locator("tbody tr")).toHaveCount(1);
  for (let row = 1; row <= 25; row++) {
    expect(await page.evaluate(() => document.body.innerText + [...document.querySelectorAll<HTMLInputElement>("input")].map(input => input.value).join("\n"))).toContain(
      String(1000 + row),
    );
  }
});

test("unmapped nonempty return fields block export instead of silently disappearing", async ({
  page,
}) => {
  const error = await page.evaluate(async () => {
    const base = '/src/lib';
    const rules = await import(`${base}/forms/withholding-rules.ts`);
    const component = await import(`${base}/forms/printing/form-0605-print.svelte`);
    const print = await import(`${base}/printing/withholding-print-model.ts`);
    try {
      print.createWithholdingPrintModel('0605', {
        ...rules.createWithholdingValues('0605'),
        'frm0605:txtTax19':'1000.00'
      }, component.printBindings.filter((binding: {id:string}) => binding.id !== 'frm0605:txtTax19'));
      return '';
    } catch (error) { return String(error); }
  });
  expect(error).toContain('unmapped return fields: frm0605:txtTax19');
});

test("revised percentage-tax pages show RDO, TIN and complete year within the original page", async ({
  page,
}) => {
  const result = await page.evaluate(async () => {
    const base = "/src/lib";
    const rules = await import(`${base}/forms/withholding-rules.ts`);
    const reports = await import(`${base}/printing/return-report.ts`);
    const catalog = await import(`${base}/forms/index.ts`);
    const values = rules.createWithholdingValues("1600PTv2018", {
      tin1: "001",
      tin2: "234",
      tin3: "567",
      branchCode: "0008",
      rdoCode: "040",
      taxpayerName: "PRINT TEST COMPANY",
      address: "123 TEST STREET",
      zipCode: "1000",
    });
    values["frm1600PT:txtYear"] = "2025";
    return {html:await reports.buildReturnReport(catalog.getFormDefinition('1600PTv2018'),values,'Draft','letter')};
  });
  const printPage = await page.context().newPage();
  await printPage.setContent(result.html);
  await printPage.emulateMedia({media:'print'});
  await printPage.evaluate(() => document.fonts.ready);
  await expect(printPage.locator("#rdoContainer")).toHaveText("040");
  await expect(printPage.locator("#rdoContainer")).toBeVisible();
  const values = await printPage.evaluate(() =>
    [
      "txtPg1I1Year",
      "txtPg2TinC1",
      "txtPg2TinC2",
      "txtPg2TinC3",
      "txtPg2TinC4",
    ].map((id) => (document.getElementById(`frm1600PT:${id}`) as HTMLInputElement)?.value),
  );
  expect(values).toEqual(["25", "001", "234", "567", "0008"]);
  const overflow = await printPage.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>(".withholding-print-page")].map(
      (sheet) => {
        const paper = sheet.getBoundingClientRect();
        return [
          ...sheet.querySelectorAll<HTMLElement>(".withholding-print-page-content *"),
        ]
          .filter((el) => {
            const rect = el.getBoundingClientRect();
            return (
              rect.width > 0 &&
              (rect.right > paper.right + 1 || rect.bottom > paper.bottom + 1)
            );
          })
          .map((el) => el.id || el.tagName);
      },
    ),
  );
  expect(overflow).toEqual([[], []]);
  await printPage.close();
});

test("final withholding print includes populated source Schedule 3 reference rows", async ({
  page,
}) => {
  const html = await page.evaluate(async () => {
    const base = "/src/lib";
    const rules = await import(`${base}/forms/withholding-rules.ts`);
    const reports = await import(`${base}/printing/return-report.ts`);
    const catalog = await import(`${base}/forms/index.ts`);
    return reports.buildReturnReport(catalog.getFormDefinition('1601FQ'),rules.createWithholdingValues('1601FQ'),'Draft','long');
  });
  await page.setContent(html);
  expect(await page.locator("#tblSched3 tr").count()).toBeGreaterThan(10);
  await expect(page.locator("#tblSched3")).toContainText("WI250");
  await expect(page.locator("#tblSched3")).toContainText("WC250");
  expect(
    await page.locator("#tblSched3 tr").filter({ hasText: "WI250" }).count(),
  ).toBe(1);
});


test('component export escapes long taxpayer text and clips it at the original field boundary', async ({page}) => {
 const name = 'EXAMPLE & PARTNERS <PRINT TEST> PROFESSIONAL SERVICES CORPORATION';
 const html = await page.evaluate(async name => {
  const base='/src/lib';
  const rules=await import(`${base}/forms/withholding-rules.ts`);
  const catalog=await import(`${base}/forms/index.ts`);
  const reports=await import(`${base}/printing/return-report.ts`);
  const values=rules.createWithholdingValues('0605', {taxpayerName:name,address:'123 VERY LONG REGISTERED STREET, BUSINESS DISTRICT',address2:'SAMPLE CITY',lineOfBusiness:'PROFESSIONAL SERVICES',tin1:'001',tin2:'234',tin3:'567',branchCode:'0008',rdoCode:'040',zipCode:'1000'});
  return reports.buildReturnReport(catalog.getFormDefinition('0605'),values,'Draft','letter');
 }, name);
 await page.setContent(html);
 await page.emulateMedia({media:'print'});
 await page.evaluate(() => document.fonts.ready);
 const value=page.locator('[data-field-id="frm0605:txtTaxPayerName"]');
 await expect(value).toHaveValue(name);
 expect(await value.evaluate(el => {
  const input = el as HTMLInputElement;
  const style = getComputedStyle(input);
  const context = document.createElement('canvas').getContext('2d')!;
  context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  const scale = Number(input.closest<HTMLElement>('.withholding-print-page')!.style.getPropertyValue('--withholding-page-scale'));
  const available = input.getBoundingClientRect().width / scale - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
  return context.measureText(input.value).width > available && Math.abs(parseFloat(style.fontSize) * scale * 0.75 - 7.38) < 0.025 && style.textOverflow === 'clip' && style.overflowX === 'clip';
 })).toBe(true);
 expect(html).not.toContain('<PRINT TEST>');
});
