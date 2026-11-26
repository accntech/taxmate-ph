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
    await expect(elections.getByRole("checkbox", { name: "Other alphanumeric tax code?" })).toBeVisible();
    if (code === "1702MXv2018C") {
      for (const width of [1280, 390]) {
        await page.setViewportSize({ width, height: 900 });
        await page.keyboard.press("Escape");
        await filing.screenshot({ path: info.outputPath(`filing-information-${width}.png`) });
      }
    }
  });
}

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
  ).toBeVisible();
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
    await page.locator(".line-list").filter({ has: page.getByRole("heading", { name: /^Other taxable income \(/ }) }).getByRole("button", { name: "Add item", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "Add item" });
    await dialog.getByRole("textbox", { name: "Description", exact: true }).fill(description);
    await dialog.getByRole("textbox", { name: "Regular rate", exact: true }).fill(amount);
    await dialog.getByRole("button", { name: "Add item", exact: true }).click();
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
