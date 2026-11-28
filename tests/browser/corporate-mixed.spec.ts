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
    const mcitElection = elections.getByRole("checkbox", { name: /Subject to minimum corporate income tax/ });
    await expect(mcitElection).toBeVisible();
    const otherName = code === "1702MX" ? "Select another ATC" : "Other alphanumeric tax code?";
    const picker = elections.getByRole("combobox", { name: "Alphanumeric tax code (ATC)" });
    const heading = elections.getByRole("heading", { name: "Alphanumeric tax code (ATC)", exact: true });
    await expect(picker).toBeVisible();
    await expect(elections.getByRole("checkbox", { name: otherName, exact: true })).toBeVisible();
    await expect(heading).toBeVisible();
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.keyboard.press("Escape");
      const [title, mcit, other, atc] = await Promise.all([
        heading, elections.getByText(/Subject to minimum corporate income tax/),
        elections.getByText(otherName, { exact: true }), picker
      ].map(locator => locator.boundingBox()));
      expect(title!.y).toBeLessThan(mcit!.y);
      expect(mcit!.y + mcit!.height).toBeLessThanOrEqual(other!.y);
      expect(other!.y + other!.height).toBeLessThanOrEqual(atc!.y);
      expect(atc!.x).toBeGreaterThan(title!.x);
      expect(atc!.x + atc!.width).toBeLessThanOrEqual(width);
      if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === "1") {
        await filing.screenshot({
          path: info.outputPath(`${code}-filing-information-${width}.png`), animations: "disabled",
          style: ".eq-action-bar { visibility: hidden }"
        });
      }
    }
    if (code !== "1702MX") {
      await expect(picker).toHaveText("IC010");
      await expect(picker).toBeEnabled();
      const required = heading.getByText("*", { exact: true });
      await expect(required).toBeVisible();
      await mcitElection.check();
      await expect(required).toHaveCount(0);
      await mcitElection.uncheck();
      await expect(required).toBeVisible();
      await expect(picker).toHaveText("IC010");
    }
  });
}

for (const code of ["1702MXv2018", "1702MXv2018C"]) {
  test(`${code} groups activity deductions, opens the next lines and transfers their totals`, async ({ page }, info) => {
    await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, [{
      id: "attachment-deductions", taxpayerId, formCode: code, returnPeriod: "2025",
      status: "Draft", updatedAt: 1794441600000, finalFlag: "0",
      values: {
        "frm1702MX:rdoPg2I1": "F", "frm1702MX:totalSPAttach": "1",
        "frm1702MX:txtPg2SP1ScDI22": "75",
        "frm1702MX:txtPg2SP1ScDI24": "0.00"
      }
    }]);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/${code}?return=attachment-deductions`);
    await goToReturnPage(page, 6);

    const ordinary = page.getByRole("region", { name: /^Schedule D.*Continuation/ });
    const special = page.getByRole("region", { name: /^Schedule E/ });
    const row = (section: typeof ordinary, item: string) => section.locator(`[data-corporate-item="${item}"]`);
    const ordinaryFirst = row(ordinary, "17d");
    const ordinaryNext = row(ordinary, "17e");
    const specialFirst = row(special, "1");
    const specialNext = row(special, "2");
    const amount = (entry: typeof ordinary) => entry.getByRole("textbox", { name: "Amount", exact: true });
    const fill = async (entry: typeof ordinary, field: string, value: string) => {
      const input = entry.getByRole("textbox", { name: field, exact: true });
      await input.fill(value);
      await input.blur();
    };

    await expect(ordinary.getByRole("heading", { name: /17.*Others.*Withholding Tax/ })).toBeVisible();
    await expect(ordinaryNext.getByRole("textbox", { name: "Description" })).toBeDisabled();
    await expect(amount(ordinaryNext)).toBeDisabled();
    await expect(amount(row(ordinary, "17f"))).toHaveValue("75");
    await expect(amount(row(ordinary, "17f"))).toBeEnabled();
    await expect(amount(row(ordinary, "17h"))).toBeDisabled();
    await fill(ordinaryFirst, "Description", "Office supplies");
    await expect(amount(ordinaryNext)).toBeDisabled();
    await fill(ordinaryFirst, "Amount", "1200");
    await expect(amount(ordinaryNext)).toBeEnabled();
    await fill(ordinaryNext, "Description", "Courier fees");
    await fill(ordinaryNext, "Amount", "200");

    await expect(amount(specialNext)).toBeDisabled();
    await fill(specialFirst, "Description", "Training deduction");
    await expect(amount(specialNext)).toBeDisabled();
    await fill(specialFirst, "Legal basis", "Sample basis");
    await expect(amount(specialNext)).toBeEnabled();
    await fill(specialFirst, "Amount", "800");
    await fill(specialNext, "Description", "Research deduction");
    await fill(specialNext, "Legal basis", "Sample basis");
    await fill(specialNext, "Amount", "100");

    for (const [schedule, button, entry, hasBasis] of [
      [ordinary, "Add ordinary deduction", "Additional ordinary expense", false],
      [special, "Add special deduction", "Additional special expense", true]
    ] as const) {
      await schedule.getByRole("button", { name: button, exact: true }).click();
      const drawer = page.getByRole("dialog");
      await fill(drawer, "Description", entry);
      if (hasBasis) await fill(drawer, "Legal basis", "Sample basis");
      await fill(drawer, "Amount", "25");
      await drawer.getByRole("button", { name: "Add item", exact: true }).click();
      await expect(drawer).toBeHidden();
      await expect(schedule.getByRole("button", { name: entry })).toBeVisible();
    }

    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      await page.keyboard.press("Escape");
      const fields = specialNext.getByRole("textbox");
      await expect(fields).toHaveCount(3);
      const [description, legalBasis, specialAmount] = await Promise.all(
        [0, 1, 2].map(index => fields.nth(index).boundingBox())
      );
      if (width === 1440) {
        expect(description!.y).toBe(legalBasis!.y);
        expect(legalBasis!.y).toBe(specialAmount!.y);
      } else {
        expect(description!.y + description!.height).toBeLessThan(legalBasis!.y);
        expect(legalBasis!.y + legalBasis!.height).toBeLessThan(specialAmount!.y);
      }
      if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === "1") {
        for (const [schedule, name] of [[ordinary, "D"], [special, "E"]] as const)
          await schedule.screenshot({
            path: info.outputPath(`${code}-schedule-${name}-${width}.png`),
            animations: "disabled", style: ".eq-action-bar, .window-titlebar, .skip-link { visibility: hidden }"
          });
      }
    }

    for (const [schedule, item, total] of [[ordinary, "8", "1,500"], [special, "9", "925"]] as const) {
      await schedule.getByRole("button", { name: new RegExp(`^To .*Schedule B, Item ${item}$`) }).click();
      await expect(page.locator(id(`txtPg1SP1ScBI${item}`))).toBeFocused();
      await expect(page.locator(id(`txtPg1SP1ScBI${item}`))).toHaveText(total);
      await goToReturnPage(page, 6);
    }

    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    await page.getByRole("link", { name: "Edit", exact: true }).click();
    await goToReturnPage(page, 6);
    await expect(amount(ordinaryNext)).toHaveValue("200");
    await expect(amount(specialNext)).toHaveValue("100");
  });
}

test("June 2013 activity Schedules F and G edit descriptions inline and carry their totals to Schedule B", async ({ page }) => {
  const list = `/ebirforms/taxpayers/${taxpayerId}/forms`;
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, [{
    id: "legacy-activity-deductions", taxpayerId, formCode: "1702MX", returnPeriod: "2025",
    status: "Draft", updatedAt: 1794441600000, finalFlag: "0",
    values: {
      "frm1702MX:chkPg2Pt4I30MoreThanOne": "Y", "frm1702MX:totalEXAttach": "1",
      "frm1702MX:txtPg1I2YearEnd": "2025", "frm1702MX:ddlPg1I2Date": "12"
    }
  }]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${list}/1702MX?return=legacy-activity-deductions`);
  await expect(page.getByRole("navigation", { name: "Return pages" })).toBeVisible();
  await goToReturnPage(page, 12);
  const income = page.getByRole("region", { name: /^Schedule F / });
  const amortization = page.getByRole("region", { name: /^Schedule G / });
  const ordinaryDescription = page.locator(id("txtPg3EX1ScGI2other"));
  const ordinaryAmount = page.locator(id("txtPg3EX1ScGI2C1"));
  const first = income.getByRole("group", { name: "Item 1", exact: true });
  const nextDescription = page.locator(id("txtPg3EX1ScFI2other"));
  const firstDescription = first.getByRole("textbox", { name: "Description", exact: true });
  await expect(firstDescription).toHaveAttribute("maxlength", "45");
  await expect(nextDescription).toBeDisabled();
  await income.getByRole("button", { name: "Add item", exact: true }).click();
  const drawer = page.getByRole("dialog", { name: "Add item", exact: true });
  await expect(drawer.getByRole("textbox", { name: "Description", exact: true })).toBeEnabled({ timeout: 1500 });
  await expect(drawer.getByRole("textbox", { name: "Amount", exact: true })).toBeEnabled();
  await drawer.getByRole("button", { name: "Cancel", exact: true }).click();
  await firstDescription.fill("Interest income");
  await expect(nextDescription).toBeEnabled();
  await firstDescription.clear();
  await expect(nextDescription).toBeDisabled();
  await firstDescription.fill("Interest income");
  const firstAmount = first.getByRole("textbox", { name: "Amount", exact: true });
  await firstAmount.fill("275");
  await firstAmount.blur();
  await expect(income.locator(id("txtPg3EX1ScFI4C1"))).toHaveText("275");
  await expect(amortization.getByRole("heading", { name: "Amortizations", exact: true })).toBeVisible();
  await ordinaryDescription.fill("Leasehold amortization");
  await ordinaryAmount.fill("400");
  await ordinaryAmount.blur();

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const [description, amount] = await Promise.all([ordinaryDescription.boundingBox(), ordinaryAmount.boundingBox()]);
    expect(description && amount).toBeTruthy();
    if (width === 1440) {
      expect(Math.abs(description!.y - amount!.y)).toBeLessThan(3);
      expect(description!.x + description!.width).toBeLessThan(amount!.x);
    } else {
      expect(description!.y + description!.height).toBeLessThan(amount!.y);
      expect(amount!.x + amount!.width).toBeLessThanOrEqual(width);
    }
  }

  await goToReturnPage(page, 13);
  const continuation = page.getByRole("region", { name: /^Schedule G / });
  const continuationDescription = continuation.getByRole("group", { name: "Item 36", exact: true })
    .getByRole("textbox", { name: "Description", exact: true });
  await continuationDescription.fill("Equipment inspection");
  const continuationAmount = continuation.locator(id("txtPg4EX1ScGI36C1"));
  await continuationAmount.fill("25");
  await continuationAmount.blur();
  await expect(continuation.locator(id("txtPg4EX1ScGI40"))).toHaveText("425");
  await continuation.getByRole("button", { name: /To .*Schedule B, Item 6/ }).click();
  await expect(page.locator(id("txtPg1EX1ScBI6"))).toHaveText("425");
  await expect(page.locator(id("txtPg1EX1ScBI4"))).toHaveText("275");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await goToReturnPage(page, 12);
  await expect(firstDescription).toHaveValue("Interest income");
  await expect(ordinaryDescription).toHaveValue("Leasehold amortization");
  await goToReturnPage(page, 13);
  await expect(continuationDescription).toHaveValue("Equipment inspection");
});

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

test("1702-MX CREATE keeps the year-end control compact", async ({ page }) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MXv2018C?new=true`);
  const filing = page.getByRole("region", { name: "Taxpayer and filing information", exact: true });
  const period = filing.getByRole("group", { name: "Year ended", exact: true });
  const month = period.getByRole("spinbutton", { name: "Month", exact: true });
  const year = period.getByRole("spinbutton", { name: "Year", exact: true });
  const picker = period.getByRole("button", { name: "Choose month and year", exact: true });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.keyboard.press("Escape");
    await expect(period).toBeVisible({ timeout: 15000 });
    await expect.poll(async () => {
      const left = (await month.boundingBox())!;
      const middle = (await year.boundingBox())!;
      const right = (await picker.boundingBox())!;
      return {
        compact: right.x + right.width - left.x <= 192,
        ordered: left.x < middle.x && middle.x < right.x,
        aligned: Math.abs(left.y + left.height / 2 - right.y - right.height / 2) <= 2,
      };
    }, { message: `filing period controls at ${width}px` }).toEqual({
      compact: true, ordered: true, aligned: true,
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

test("June 2013 page 6 uses the section headings for Items 39O and 4D", async ({ page }, info) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MX?new=true`);
  const editor = page.locator(".corporate-editor");
  await expect(editor).toBeVisible({ timeout: 15000 });
  await goToReturnPage(page, 6);
  for (const width of [1440, 1200, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.keyboard.press("Escape");
    for (const item of ["39o", "4d"]) {
      const row = editor.locator(`[data-corporate-item="${item}"]`);
      await expect(row.locator(".paper-item-number")).toHaveText(item.toUpperCase());
      await expect(row.getByRole("textbox", { name: "Exempt", exact: true })).toBeVisible();
      const geometry = await row.evaluate(element => {
        const header = element.closest(".corporate-section")!.querySelector(".corporate-columns")!;
        const amounts = element.querySelector(".inline-entry-amounts")!;
        const labels = [...amounts.querySelectorAll("label, .value-label")];
        const offsets = [...header.children].map((heading, index) => {
          const range = document.createRange();
          range.selectNodeContents(heading);
          const value = amounts.children[index].querySelector("input, output")!;
          return Math.abs(range.getBoundingClientRect().right - value.getBoundingClientRect().right);
        });
        return {
          hasHeader: header.getBoundingClientRect().width > 0,
          widths: labels.map(label => label.getBoundingClientRect().width),
          offsets,
        };
      });
      expect(geometry.hasHeader).toBe(width !== 390);
      expect(geometry.widths).toHaveLength(4);
      if (width === 390) {
        expect(Math.min(...geometry.widths)).toBeGreaterThan(1);
      } else {
        expect(Math.max(...geometry.widths)).toBeLessThanOrEqual(1);
        expect(Math.max(...geometry.offsets)).toBeLessThanOrEqual(1);
      }
    }
    if (width !== 1200) {
      await editor.screenshot({
        path: info.outputPath(`page-6-deductions-${width}.png`),
        animations: "disabled",
        style: '.eq-action-bar, .window-titlebar, a[href="#main-content"] { display: none !important; }',
      });
    }
  }
});

test("January 2018 keeps its schedule columns and activity actions in context", async ({ page }, info) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 444, height: 1000 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MXv2018?new=true`);
  const editor = page.locator(".corporate-editor");
  await expect(editor).toBeVisible({ timeout: 15000 });
  await page.keyboard.press("Escape");
  for (const index of [2, 3, 4]) {
    await goToReturnPage(page, index);
    await expect(editor.locator(".corporate-columns:visible")).toHaveCount(0);
    await expect.poll(() => editor.evaluate(element => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);
  }
  await goToReturnPage(page, 2);
  const election = page.getByRole("region", { name: "Part IV - Schedules" });
  await election.getByRole("radio", { name: "Two or more activities or projects" }).check();
  await expect(election.getByRole("button", { name: "Add special-rate activity" })).toBeVisible();
  await election.getByRole("radio", { name: "One activity or project", exact: true }).check();
  await expect(election.getByRole("button", { name: "Add special-rate activity" })).toHaveCount(0);
  await goToReturnPage(page, 3);
  for (const item of ["17D", "17E", "17F", "17G", "17H"]) {
    const deduction = editor.locator(`[data-corporate-item="${item}"]`);
    await expect(deduction.locator(".paper-item-number")).toHaveText(item);
    await expect(deduction.getByRole("textbox", { name: "Description", exact: true })).toBeVisible();
    await expect(deduction.getByRole("status", { name: "Exempt", exact: true })).toBeVisible();
  }
  const row = editor.locator('[data-corporate-item="17D"]');
  await row.getByRole("textbox", { name: "Description", exact: true }).fill("Other services");
  for (const [regime, amount] of [["Exempt", "100"], ["Special rate", "200"], ["Regular rate", "300"]]) {
    const amountControl = row.getByRole("textbox", { name: regime, exact: true });
    await amountControl.fill(amount);
    await amountControl.blur();
  }
  await expect(row.getByRole("status", { name: "Total", exact: true })).toHaveText("600");
  await expect(page.locator(id("txtPg3Sc5Itm18D"))).toHaveText("600");
  await goToReturnPage(page, 2);
  await expect(page.locator(id("txtPg2Sc2Itm8D"))).toHaveText("600");
  await goToReturnPage(page, 3);
  await page.setViewportSize({ width: 1440, height: 1000 });
  const section = row.locator("xpath=ancestor::section[1]");
  await expect(section.locator(".corporate-columns")).toBeVisible();
  await expect.poll(() => row.locator(".inline-entry-amounts label").first().evaluate(label => label.getBoundingClientRect().width)).toBeLessThanOrEqual(1);
  await section.screenshot({ path: info.outputPath("2018-schedule-5-desktop.png"), animations: "disabled",
    style: '.eq-action-bar, .window-titlebar, a[href="#main-content"] { display: none !important; }' });
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.keyboard.press("Escape");
    for (const index of [2, 3, 4]) {
      await goToReturnPage(page, index);
      await editor.screenshot({ path: info.outputPath(`2018-page-${index}-${width}.png`), animations: "disabled",
        style: '.eq-action-bar, .window-titlebar, a[href="#main-content"] { display: none !important; }' });
    }
  }
});

test("January 2018 aligns added Item 17I deductions with the Schedule 5 headings", async ({ page }, info) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, []);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms/1702MXv2018?new=true`);
  await expect(page.locator(".corporate-editor")).toBeVisible({ timeout: 15000 });
  await goToReturnPage(page, 3);
  const schedule = page.getByRole("region", { name: /^Schedule 5 .*Ordinary Allowable Itemized Deductions/ });
  const list = schedule.locator(".line-list").filter({ has: page.getByRole("heading", { name: /^Other Ordinary Allowable Deductions/ }) });
  await list.getByRole("button", { name: "Add item", exact: true }).click();
  const drawer = page.getByRole("dialog");
  await drawer.getByRole("textbox", { name: "Description", exact: true }).fill("Other services");
  await drawer.getByRole("textbox", { name: "Special rate", exact: true }).fill("16000");
  await drawer.getByRole("button", { name: "Add item", exact: true }).click();
  const entry = list.getByRole("listitem");
  await expect(entry).toContainText("17I");
  await expect(entry.getByRole("button", { name: "Other services", exact: true })).toBeVisible();
  await expect(entry.locator(".entry-amount").last()).toContainText("16,000");
  for (const width of [1440, 1200, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.keyboard.press("Escape");
    const geometry = await entry.evaluate(element => {
      const headings = [...element.closest(".corporate-section")!.querySelectorAll(".corporate-columns > span")];
      const labels = [...element.querySelectorAll(".entry-amount-label")];
      const values = [...element.querySelectorAll(".entry-amount > .font-mono")];
      return {
        desktop: headings[0].getBoundingClientRect().width > 0,
        labelWidths: labels.map(label => label.getBoundingClientRect().width),
        offsets: headings.map((heading, index) => {
          const text = document.createRange();
          text.selectNodeContents(heading);
          return Math.abs(text.getBoundingClientRect().right - values[index].getBoundingClientRect().right);
        }),
      };
    });
    expect(geometry.desktop).toBe(width !== 390);
    if (geometry.desktop) {
      expect(Math.max(...geometry.labelWidths)).toBeLessThanOrEqual(1);
      expect(Math.max(...geometry.offsets)).toBeLessThanOrEqual(1);
    } else {
      expect(Math.min(...geometry.labelWidths)).toBeGreaterThan(1);
    }
    if (width !== 1200) {
      await schedule.screenshot({ path: info.outputPath(`item-17i-${width}.png`), animations: "disabled",
        style: '.eq-action-bar, .window-titlebar, a[href="#main-content"] { display: none !important; }' });
    }
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
