import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { goToReturnPage, seedWorkspace, taxpayerId } from "./fixtures";

const id = (field: string) => `[id="frm1702MX:${field}"]`;

for (const code of ["1702MX", "1702MXv2018", "1702MXv2018C"]) {
  test(`${code} keeps all ATC elections under one Item 5`, async ({ page }, info) => {
    await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`);
    const filing = page.getByRole("region", { name: "Taxpayer and filing information", exact: true });
    const elections = filing.locator('[data-corporate-item="5"]');
    await expect(elections).toHaveCount(1, { timeout: 15000 });
    await expect(elections.getByRole("checkbox", { name: /Subject to minimum corporate income tax/ })).toBeVisible();
    await expect(elections.getByRole("combobox", { name: "Alphanumeric tax code (ATC)" })).toBeVisible();
    await expect(elections.getByRole("checkbox", { name: code === "1702MX" ? "Select another ATC" : "Other alphanumeric tax code?" })).toBeVisible();
    if (code === "1702MXv2018C") {
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.keyboard.press("Escape");
        await filing.screenshot({ path: info.outputPath(`filing-information-${width}.png`) });
      }
    }
  });
}

test("June 2013 groups the ATC elections and enables the picker only when elected", async ({ page }) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  const item = page.getByRole("region", { name: "Taxpayer and filing information" })
    .locator('[data-corporate-item="5"]');
  const picker = item.getByRole("combobox", { name: "Alphanumeric tax code (ATC)" });
  const election = item.getByRole("checkbox", { name: "Select another ATC" });
  const mcit = item.getByRole("checkbox", { name: /minimum corporate income tax/i });
  await expect(picker).toBeDisabled({ timeout: 15000 });
  await expect(picker).toHaveText("Choose ATC");
  await mcit.check();
  await election.check();
  await expect(picker).toBeEnabled();
  await picker.click();
  await page.getByRole("option", { name: /IC030/ }).click();
  await expect(item.getByText(/Proprietary Educational Institutions/)).toBeVisible();
  await election.uncheck();
  await expect(picker).toBeDisabled();
  await expect(mcit).toBeChecked();
  await election.check();
  await expect(picker).toHaveText("Choose ATC");
});

test("June 2013 gives business information its own row and names the fixed deduction", async ({ page }, info) => {
  await seedWorkspace(page, "light", "loaded", {
    taxpayerClassification: "N", lineOfBusiness: "Book publishing and distribution", psicCode: "01121"
  }, []);
  await page.setViewportSize({ width: 1280, height: 960 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  const business = page.locator('[data-corporate-item="13"]');
  const psic = page.locator('[data-corporate-item="14"]');
  const deduction = page.locator('[data-corporate-item="15"]');
  await expect(business.getByText("Book publishing and distribution")).toBeVisible({ timeout: 15000 });
  await expect(business.getByRole("textbox")).toHaveCount(0);
  const code = psic.getByRole("status", { name: "PSIC code" });
  await expect(psic.locator(".paper-item-number")).toHaveText("14");
  await expect(code).toHaveText("0112");
  await expect(psic.getByRole("combobox")).toHaveCount(0);
  await expect(deduction.getByText("Itemized deductions", { exact: true })).toBeVisible();
  await expect(deduction.getByRole("radio")).toHaveCount(0);
  const email = (await page.locator('[data-corporate-item="12"]').boundingBox())!;
  const description = (await business.boundingBox())!;
  const classification = (await psic.boundingBox())!;
  expect(description.y).toBeGreaterThan(email.y);
  expect(Math.abs(description.y - classification.y)).toBeLessThan(1);
  expect(description.width).toBeGreaterThan(classification.width);
  const item5 = page.getByRole("region", { name: "Taxpayer and filing information" })
    .locator('[data-corporate-item="5"]');
  const background = page.getByRole("region", { name: "Part I - Background Information" });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 960 });
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Close sidebar" })).toBeHidden();
    const editor = page.locator(".corporate-editor");
    await expect.poll(() => editor.evaluate(el => el.scrollWidth - el.clientWidth),
      { message: `June 2013 cover at ${width}px` }).toBeLessThanOrEqual(1);
    for (const [section, title] of [[item5, "atc"], [background, "background"]] as const) {
      await section.screenshot({
        path: info.outputPath(`1702mx-${title}-${width}.png`), animations: "disabled",
        style: ".eq-action-bar { visibility: hidden }"
      });
    }
  }
});

test("June 2013 preserves business information and elections through reopening and print", async ({ page, context }, info) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  const business = page.getByRole("textbox", { name: "Main line of business", exact: true });
  const psic = page.getByRole("combobox", { name: "PSIC code" });
  const election = page.getByRole("checkbox", { name: "Select another ATC" });
  const picker = page.getByRole("combobox", { name: "Alphanumeric tax code (ATC)" });
  await business.fill("Book publishing");
  await business.press("End");
  await business.pressSequentially(" and distribution");
  await expect(psic).toContainText("Choose industry");
  await psic.click();
  const search = page.getByPlaceholder("Search code or industry");
  await search.fill("0112");
  await expect(page.getByRole("option", { name: /Growing of paddy rice/ })).toBeVisible();
  await search.fill("paddy rice");
  const industry = page.getByRole("option", { name: /Growing of paddy rice/ });
  await expect(industry).toBeVisible();
  await page.screenshot({ path: info.outputPath("1702mx-psic-search.png"), animations: "disabled" });
  await industry.click();
  await election.check();
  await picker.click();
  await page.getByRole("option", { name: /IC010/ }).click();
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await expect(business).toHaveValue("Book publishing and distribution");
  await expect(psic).toHaveText("0112");
  await expect(election).toBeChecked();
  await expect(picker).toHaveText("IC010");

  const html = await page.evaluate(async () => {
    const record = JSON.parse(localStorage.getItem("ebirforms-created-returns-v1")!).returns[0];
    const base = "/src/lib";
    const { getFormDefinition } = await import(`${base}/forms/index.ts`);
    const { getReturnExportValues } = await import(`${base}/forms/form-runtime.ts`);
    const { buildReturnReport } = await import(`${base}/printing/return-report.ts`);
    return buildReturnReport(getFormDefinition(record.formCode),
      getReturnExportValues(record.formCode, record.values), "Draft", "legal");
  });
  const paper = await context.newPage();
  await paper.setContent(html);
  await paper.emulateMedia({ media: "print" });
  const firstPage = paper.locator(".withholding-print-page").first();
  await expect(firstPage.locator(id("txtPg1Pt1I13MainLine"))).toHaveValue("Book publishing and distribution");
  await expect(firstPage.locator(id("txtPg1Pt1I14PSICCode"))).toHaveValue("0112");
  await expect(firstPage.locator(id("rdoPg1Pt1I15MethodofDeduction"))).toBeChecked();
  await expect(firstPage.locator(id("chkPg1I5ATCR2"))).toBeChecked();
  const pdf = await paper.pdf({
    path: info.outputPath("1702mx-june-2013.pdf"), preferCSSPageSize: true, printBackground: true
  });
  const cover = execFileSync("pdftotext", ["-f", "1", "-l", "1", "-layout", "-", "-"], { input: pdf }).toString();
  expect(cover).toContain("Itemized Deductions");
  expect(cover).toContain("BOOK PUBLISHING AND DISTRIBUTION");
});

test("1702-MX CREATE keeps year-end month and year together in compact columns", async ({ page }) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MXv2018C?new=true`);
  const filing = page.getByRole("region", { name: "Taxpayer and filing information", exact: true });
  const month = filing.getByRole("combobox", { name: "Year-end month", exact: true });
  const year = filing.getByRole("textbox", { name: "Year ended", exact: true });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.keyboard.press("Escape");
    await expect(month).toBeVisible({ timeout: 15000 });
    await expect.poll(async () => {
      const left = (await month.boundingBox())!;
      const right = (await year.locator("..").boundingBox())!;
      return {
        compact: left.width <= 160,
        separated: left.x + left.width < right.x,
        aligned: Math.abs(left.y - right.y) < 1,
      };
    }, { message: `filing period controls at ${width}px` }).toEqual({
      compact: true, separated: true, aligned: true,
    });
  }
});

for (const code of ["1702MXv2018", "1702MXv2018C"]) {
  test(`${code} keeps each special activity separate through add, remove and reopen`, async ({
    page,
  }, info) => {
    await seedWorkspace(
      page,
      "light",
      "loaded",
      { taxpayerClassification: "N" },
      [],
    );
    await page.goto(
      `/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`,
    );
    await expect(
      page.getByRole("navigation", { name: "Return pages" }),
    ).toBeVisible();
    await goToReturnPage(page, 2);
    await page.locator(id("rdoPg2I1-F")).check();
    await page
      .getByRole("button", { name: "Add special-rate activity", exact: true })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "Special-rate activity 1 · Mandatory attachment 1",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(id("rdoPg1SP1TaxRegime"))).toHaveText(
      "Special Rate",
    );
    await page.locator(id("txtPg1SP1ScBI1")).fill("1000000");
    await page.locator(id("txtPg1SP1ScBI4")).fill("200000");
    await page.locator(id("txtPg1SP1ScBI13")).fill("5");
    await page.locator(id("txtPg1SP1ScBI13")).blur();
    await expect(page.locator(id("txtPg1SP1ScBI14"))).toHaveText("40,000");
    await page.screenshot({
      path: info.outputPath(`${code}-activity-desktop.png`),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 920 });
    await page.keyboard.press("Escape");
    await page.screenshot({
      path: info.outputPath(`${code}-activity-narrow.png`),
      fullPage: true,
    });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page
      .getByRole("button", { name: "Add special-rate activity", exact: true })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "Special-rate activity 2 · Mandatory attachment 1",
        exact: true,
      }),
    ).toBeVisible();
    await expect(page.locator(id("rdoPg1SP2TaxRegime"))).toHaveText(
      "Special Rate",
    );
    await page.locator(id("txtPg1SP2ScBI1")).fill("500000");
    await page.locator(id("txtPg1SP2ScBI4")).fill("100000");
    await page.locator(id("txtPg1SP2ScBI13")).fill("10");
    await page.locator(id("txtPg1SP2ScBI13")).blur();
    await goToReturnPage(page, 2);
    const sales = page.locator('[data-reference-target="frm1702MX:txtPg1SP2ScBI1"]');
    await expect(sales).toHaveText(/From Special-rate activity 2.*Schedule B, Item 1/);
    await sales.click();
    await expect(page.locator(id("txtPg1SP2ScBI1"))).toBeFocused();
    await goToReturnPage(page, 1);
    await expect(page.locator(id("txtPg1Pt2I14TotalIncome"))).toHaveText(
      "80,000",
    );
    await page
      .getByRole("button", {
        name: "Remove last special-rate activity",
        exact: true,
      })
      .click();
    await goToReturnPage(page, 1);
    await expect(page.locator(id("txtPg1Pt2I14TotalIncome"))).toHaveText(
      "40,000",
    );
    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    const record = await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("ebirforms-created-returns-v1")!)
          .returns[0],
    );
    expect(record.values["frm1702MX:totalSPAttach"]).toBe("1");
    await page.getByRole("link", { name: "Edit", exact: true }).click();
    await goToReturnPage(page, 5);
    await expect(page.locator(id("txtPg1SP1ScBI1"))).toHaveValue("1,000,000");
    await expect(page.locator(id("txtPg1SP1ScBI14"))).toHaveText("40,000");
  });
}

test("June 2013 carries an activity sales schedule into the main return", async ({
  page,
}, info) => {
  await seedWorkspace(
    page,
    "light",
    "loaded",
    { taxpayerClassification: "N" },
    [],
  );
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  await expect(
    page.getByRole("navigation", { name: "Return pages" }),
  ).toBeVisible({ timeout: 15000 });
  await goToReturnPage(page, 2);
  await page.locator(id("chkPg2Pt4I30MoreThanOne")).check();
  await page
    .getByRole("button", { name: "Add special-rate activity", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Special-rate activity 1 · Mandatory attachment 1",
      exact: true,
    }),
  ).toBeVisible();
  await page.locator(id("txtPg1SP1ScBI11")).fill("10");
  await page.locator(id("txtPg1SP1ScBI11")).blur();
  await goToReturnPage(page, 11);
  await page.locator(id("txtPg2SP1ScDI1")).fill("1000000");
  await page.locator(id("txtPg2SP1ScDI1")).blur();
  await goToReturnPage(page, 12);
  await page.locator(id("txtPg3SP1ScGI1")).fill("200000");
  await page.locator(id("txtPg3SP1ScGI1")).blur();
  await goToReturnPage(page, 10);
  await expect(page.locator(id("txtPg1SP1ScBI12"))).toHaveText("80,000");
  await page.screenshot({
    path: info.outputPath("1702MX-activity-desktop.png"),
    fullPage: true,
  });
  await goToReturnPage(page, 1);
  await expect(page.locator(id("txtPg1Pt2I16TotalIncome"))).toHaveText(
    "80,000",
  );
});

test("CREATE prints populated special activity schedules and their consolidated liability", async ({
  page,
  context,
}, info) => {
  await page.route("**/__mixed-paper", (route) =>
    route.fulfill({ contentType: "text/html", body: "<!doctype html>" }),
  );
  await page.goto("/__mixed-paper");
  const html = await page.evaluate(async () => {
    const base = "/src/lib";
    const { getFormDefinition } = await import(`${base}/forms/index.ts`);
    const { createInitialFormValues } = await import(
      `${base}/ebirforms/ebirforms-workspace.svelte.ts`
    );
    const { getReturnExportValues } = await import(
      `${base}/forms/form-runtime.ts`
    );
    const { buildReturnReport } = await import(
      `${base}/printing/return-report.ts`
    );
    const profile = {
      id: "00123456700008",
      tin1: "001",
      tin2: "234",
      tin3: "567",
      branchCode: "00008",
      rdoCode: "047",
      taxpayerName: "SAMPLE LEDGER CORPORATION",
      address: "42 Narra Street",
      address2: "Test City",
      zipCode: "1000",
      contactNumber: "0285550148",
      email: "corp@example.test",
      taxpayerClassification: "N",
      category: "P",
    };
    const values = getReturnExportValues("1702MXv2018C", {
      ...createInitialFormValues(profile, "1702MXv2018C"),
      "frm1702MX:rdoPg2I1": "F",
      "frm1702MX:totalSPAttach": "1",
      "frm1702MX:txtPg1SP1ScAI1": "PEZA",
      "frm1702MX:txtPg1SP1ScAI2": "RA7916",
      "frm1702MX:txtPg1SP1ScAI3": "PROJECT A",
      "frm1702MX:txtPg1SP1ScBI1": "1000000",
      "frm1702MX:txtPg1SP1ScBI4": "200000",
      "frm1702MX:txtPg1SP1ScBI13": "5",
    });
    return buildReturnReport(
      getFormDefinition("1702MXv2018C"),
      values,
      "Draft",
      "legal",
    );
  });
  const paper = await context.newPage();
  await paper.setContent(html);
  await paper.emulateMedia({ media: "print" });
  await expect(paper.locator(".withholding-print-page")).toHaveCount(6);
  await expect
    .poll(() =>
      paper
        .locator('[data-corporate-field="frm1702MX:txtPg1SP1ScBI14"]')
        .evaluate((node) =>
          node instanceof HTMLInputElement ? node.value : node.textContent,
        ),
    )
    .toMatch(/40,000/);
  const pdf = await paper.pdf({
    path: info.outputPath("1702MXv2018C-populated-activity.pdf"),
    preferCSSPageSize: true,
    printBackground: true,
  });
  const text = execFileSync("pdftotext", ["-layout", "-", "-"], {
    input: pdf,
  }).toString();
  expect(text).toContain("PEZA");
  expect(text).toContain("PROJECT A");
  expect(text).toMatch(/40,000/);
});

test("June 2013 keeps schedule links, activity actions and narrow income labels in context", async ({ page }) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  const editor = page.locator(".corporate-editor");
  await expect(editor).toBeVisible({ timeout: 15000 });
  await goToReturnPage(page, 2);
  const relief = page.getByRole("region", { name: "Part IV - Basis of Tax Relief" });
  await relief.getByRole("checkbox", { name: "More than one activity or project?" }).check();
  await expect(relief.getByRole("button", { name: "Add special-rate activity" })).toBeVisible();

  await goToReturnPage(page, 4);
  await page.getByRole("button", { name: "Services" }).click();
  await expect(page.getByRole("heading", { name: /Schedule 3C - Cost of Services/ })).toBeFocused();
  await goToReturnPage(page, 5);
  await page.getByRole("button", { name: "Continue Schedule 5 on page 6" }).click();
  await expect(page.getByRole("heading", { name: /Schedule 5 .*Continued/ })).toBeFocused();

  await page.setViewportSize({ width: 390, height: 960 });
  await page.keyboard.press("Escape");
  await goToReturnPage(page, 9);
  const interests = editor.locator('[data-corporate-item="1"]').filter({ hasText: "Interests" });
  await expect(interests.getByText("Interests", { exact: true })).toBeVisible();
});

test("June 2013 puts the relief headers after Item 30 and adapts its attachment actions", async ({ page }, info) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  await expect(page.locator(".corporate-editor")).toBeVisible({ timeout: 15000 });
  await goToReturnPage(page, 2);
  const relief = page.getByRole("region", { name: "Part IV - Basis of Tax Relief" });
  const item30 = relief.locator('[data-corporate-item="30"]');
  const item31 = relief.locator('[data-corporate-item="31"]');
  const election = item30.getByRole("checkbox");
  const headings = relief.locator(".corporate-columns");
  const activityActions = item30.getByRole("region", { name: "Activity attachments" });
  const addExempt = activityActions.getByRole("button", { name: "Add exempt activity" });
  const addSpecial = activityActions.getByRole("button", { name: "Add special-rate activity" });

  for (const checked of [false, true]) {
    await election.setChecked(checked);
    const [row, header, details] = await Promise.all([item30.boundingBox(), headings.boundingBox(), item31.boundingBox()]);
    expect(header!.y).toBeGreaterThanOrEqual(row!.y + row!.height - 1);
    expect(details!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1);
    for (const index of [0, 1, 2]) {
      const headerColumn = await headings.locator("span").nth(index).boundingBox();
      const control = await item31.locator(".amount-control").nth(index).boundingBox();
      expect(Math.abs(headerColumn!.x - control!.x)).toBeLessThanOrEqual(1);
    }
  }
  const wide = await Promise.all([addExempt.boundingBox(), addSpecial.boundingBox()]);
  expect(Math.abs(wide[0]!.y - wide[1]!.y)).toBeLessThanOrEqual(1);
  const screenshots = {
    animations: "disabled",
    style: '.eq-action-bar, .window-titlebar, a[href="#main-content"] { display: none !important; }',
  } as const;
  await relief.screenshot({ ...screenshots, path: info.outputPath("item-30-desktop.png") });

  const payable = page.getByRole("region", { name: /^Part V - Computation of Amount Payable/ });
  const due = payable.locator('[data-corporate-item="37"]');
  for (const width of [1000, 460, 444, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.keyboard.press("Escape");
    for (const item of [35, 36]) {
      const row = relief.locator(`[data-corporate-item="${item}"]`);
      const dates = row.locator('[data-slot="date-input"] [role="group"]');
      await expect(dates).toHaveCount(3);
      const bounds = await row.boundingBox();
      const [first, second, third] = await Promise.all([0, 1, 2].map(index => dates.nth(index).boundingBox()));
      for (const date of [first!, second!, third!]) expect(date.x + date.width).toBeLessThan(bounds!.x + bounds!.width);
      for (const [before, after] of [[first!, second!], [second!, third!]]) {
        expect(before.x + before.width <= after.x || before.y + before.height <= after.y).toBe(true);
      }
    }
    if (width <= 460) {
      await expect(payable.locator(".corporate-columns")).toBeHidden();
      const amounts = due.locator(".amount-control");
      const [exemptAmount, specialAmount] = await Promise.all([amounts.nth(0).boundingBox(), amounts.nth(1).boundingBox()]);
      expect(specialAmount!.y).toBeGreaterThan(exemptAmount!.y);
      expect(Math.abs(exemptAmount!.x - specialAmount!.x)).toBeLessThanOrEqual(1);
    }
    if (width === 444) {
      await relief.screenshot({ ...screenshots, path: info.outputPath("relief-small-window.png") });
      await payable.screenshot({ ...screenshots, path: info.outputPath("payable-small-window.png") });
    }
  }
  await expect(headings).toBeHidden();
  await expect(item31.getByText("Special tax relief under regular rate", { exact: true })).toBeVisible();
  const [exempt, special, actions] = await Promise.all([addExempt.boundingBox(), addSpecial.boundingBox(), activityActions.boundingBox()]);
  expect(special!.y).toBeGreaterThan(exempt!.y);
  expect(Math.abs(exempt!.width - special!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(exempt!.width - actions!.width)).toBeLessThanOrEqual(1);
  await expect.poll(() => relief.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  await item30.screenshot({ ...screenshots, path: info.outputPath("item-30-narrow.png") });
  await election.uncheck();
  await expect(addSpecial).toHaveCount(0);
});

test("June 2013 keeps regime labels and amounts together on pages 3 to 9 in a small window", async ({ page }) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 444, height: 1000 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  const editor = page.locator(".corporate-editor");
  await expect(editor).toBeVisible({ timeout: 15000 });
  await page.keyboard.press("Escape");
  for (const index of [3, 4, 5, 6, 7, 8, 9]) {
    await goToReturnPage(page, index);
    await expect(editor.locator(".corporate-columns:visible"), `page ${index} has no separate regime header`).toHaveCount(0);
    const columns = await editor.locator(".grouped-amounts .amount-controls").evaluateAll(groups => groups.map(group =>
      [...group.children].filter(cell => cell.childElementCount).map(cell => cell.getBoundingClientRect().left)
    ));
    for (const positions of columns) expect(Math.max(...positions) - Math.min(...positions)).toBeLessThanOrEqual(1);
    await expect.poll(() => editor.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  }
});

test("June 2013 numeric headings align to their amount columns", async ({ page }, info) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  const editor = page.locator(".corporate-editor");
  await expect(editor).toBeVisible({ timeout: 15000 });
  // Compare the end of the heading text with the value edge inside each cell.
  for (const width of [1440, 1200]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.keyboard.press("Escape");
    let checked = 0;
    for (const index of [2, 3, 4, 5, 6, 7, 9]) {
      await goToReturnPage(page, index);
      const alignments = await editor.locator(".corporate-section").evaluateAll(sections =>
        sections.filter(section => !section.classList.contains("relief-basis")).flatMap(section => {
          const headers = [...section.querySelectorAll(".corporate-columns > span")];
          if (!headers.length || !headers[0].getBoundingClientRect().width) return [];
          const cells = [...section.querySelectorAll(".grouped-amounts .amount-controls")].map(row => [...row.children])
            .find(row => row.length === headers.length && row.every(cell => cell.querySelector("input, output")));
          if (!cells) return [];
          return headers.map((heading, column) => {
            const text = document.createRange();
            text.selectNodeContents(heading);
            const value = cells[column].querySelector("input, output")!;
            return {
              label: heading.textContent,
              difference: Math.abs(text.getBoundingClientRect().right - value.getBoundingClientRect().right),
            };
          });
        }),
      );
      expect(alignments.length, `page ${index} at ${width}px`).toBeGreaterThan(0);
      for (const { label, difference } of alignments) {
        expect(difference, `page ${index} at ${width}px · ${label}`).toBeLessThanOrEqual(1);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(30);
    await goToReturnPage(page, 2);
    await page.getByRole("region", { name: /^Part V - Computation of Amount Payable/ }).screenshot({
      path: info.outputPath(`payable-headers-${width}.png`),
      animations: "disabled",
      style: '.eq-action-bar, .window-titlebar, a[href="#main-content"] { display: none !important; }',
    });
  }
});

test("June 2013 amount columns show all digits of a twelve-digit sale", async ({ page }) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  await expect(page.locator(".corporate-editor")).toBeVisible({ timeout: 15000 });
  await goToReturnPage(page, 4);
  const sale = page.locator(id("txtPg4Sc3I1CC"));
  await sale.fill("123456789012");
  await sale.blur();
  await expect(sale).toHaveValue("123,456,789,012");
  for (const width of [1440, 1200, 1000, 700, 444, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.keyboard.press("Escape");
    await expect.poll(() => sale.evaluate(input => input.scrollWidth - input.clientWidth)).toBeLessThanOrEqual(1);
  }
});

test("legacy source detail rows update the subtotal and disappear when removed", async ({
  page,
}) => {
  await seedWorkspace(
    page,
    "light",
    "loaded",
    { taxpayerClassification: "N" },
    [],
  );
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  await expect(
    page.getByRole("navigation", { name: "Return pages" }),
  ).toBeVisible();
  await goToReturnPage(page, 5);
  for (const [entry, description, amount] of [[1, "Rental", "10000"], [2, "Interest", "20000"]] as const) {
    await page.locator(".line-list").filter({ has: page.getByRole("heading", { name: /^Other taxable income \(/ }) }).getByRole("button", { name: "Add income item", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Add income item" });
    await dialog.getByRole("textbox", { name: "Description", exact: true }).fill(description);
    await dialog.getByRole("textbox", { name: "Regular rate", exact: true }).fill(amount);
    await dialog.getByRole("button", { name: "Add income item", exact: true }).click();
  }
  await expect(page.locator(id("txtPg5Sc4I4CD"))).toHaveText("30,000");
  await goToReturnPage(page, 1);
  await expect(page.locator(id("txtPg1Pt2I16TotalIncome"))).toHaveText("9,000");
  await goToReturnPage(page, 5);
  const income = page.getByRole("list", { name: "Other taxable income line items" });
  await income.getByRole("button", { name: "Rental", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete item", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(income.getByText("Interest")).toBeVisible();
  await income.getByRole("button", { name: "Interest", exact: true }).click();
  await page.getByRole("dialog").getByRole("button", { name: "Delete item", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(income).toHaveCount(0);
  await goToReturnPage(page, 1);
  await expect(page.locator(id("txtPg1Pt2I16TotalIncome"))).toHaveText("0");
});

for (const [code, count] of [
  ["1702MX", 9],
  ["1702MXv2018", 4],
  ["1702MXv2018C", 4],
] as const) {
  test(`${code} keeps source schedule labels and controls readable at desktop and narrow widths`, async ({
    page,
  }, info) => {
    test.setTimeout(90000);
    await seedWorkspace(
      page,
      "light",
      "loaded",
      { taxpayerClassification: "N" },
      [],
    );
    await page.goto(
      `/ebirforms/taxpayers/${taxpayerId}/forms/${code}?new=true`,
    );
    await expect(
      page.getByRole("navigation", { name: "Return pages" }),
    ).toBeVisible();
    for (let index = 1; index <= count; index += 1) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await goToReturnPage(page, index);
      await page.screenshot({
        path: info.outputPath(`${code}-page-${index}-desktop.png`),
        fullPage: true,
      });
      await page.setViewportSize({ width: 390, height: 920 });
      await page.keyboard.press("Escape");
      await page.screenshot({
        path: info.outputPath(`${code}-page-${index}-narrow.png`),
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  });
}
