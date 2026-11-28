import { expect, test } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { goToReturnPage, seedWorkspace, taxpayerId } from "./fixtures";
import { printSavedReturn } from "./helpers/return-pdf";

const prefix = "frm1702MX:";
const forms = `/ebirforms/taxpayers/${taxpayerId}/forms`;
const id = (field: string) => `[id="${prefix}${field}"]`;

test("June 2013 1702MX sequences Schedule H entries and follows their Schedule B total", async ({ page }, info) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, [{
    id: "activity-review", taxpayerId, formCode: "1702MX", returnPeriod: "2025-12",
    status: "Draft", updatedAt: 1794441600000, finalFlag: "0",
    values: {
      [prefix + "chkPg2Pt4I30MoreThanOne"]: "Y", [prefix + "totalEXAttach"]: "1",
      [prefix + "txtPg1I2YearEnd"]: "2025", [prefix + "ddlPg1I2Date"]: "12"
    }
  }]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${forms}/1702MX?return=activity-review`);
  await expect(page.getByRole("navigation", { name: "Return pages" })).toBeVisible();
  await goToReturnPage(page, 13);
  const schedule = page.getByRole("region", { name: /^Schedule H / });
  const first = schedule.getByRole("group", { name: "Item 1", exact: true });
  const second = schedule.getByRole("group", { name: "Item 2", exact: true });
  const third = schedule.getByRole("group", { name: "Item 3", exact: true });
  const desc = (row: typeof first) => row.getByRole("textbox", { name: "Description", exact: true });
  const basis = (row: typeof first) => row.getByRole("textbox", { name: "Legal basis", exact: true });
  const amount = (row: typeof first) => row.getByRole("textbox", { name: "Amount", exact: true });

  await expect(amount(second)).toBeDisabled();
  await desc(first).fill("Training expense");
  await expect(amount(second)).toBeDisabled();
  await basis(first).fill("Sample rule");
  await expect(amount(second)).toBeEnabled();
  await amount(first).fill("150");
  await desc(second).fill("Research expense");
  await basis(second).fill("Sample basis");
  await expect(amount(third)).toBeEnabled();
  await amount(second).fill("250");
  await amount(second).blur();
  await basis(first).clear();
  await expect(amount(second)).toBeEnabled();
  await expect(amount(second)).toHaveValue("250");
  await basis(first).fill("Sample rule");

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    const [description, legal, money] = await Promise.all([desc(second), basis(second), amount(second)].map(control => control.boundingBox()));
    if (width === 1440) {
      expect(Math.abs(legal!.y - description!.y)).toBeLessThan(2);
      expect(Math.abs(money!.y - description!.y)).toBeLessThan(2);
    } else {
      expect(description!.y + description!.height).toBeLessThan(legal!.y);
      expect(legal!.y + legal!.height).toBeLessThan(money!.y);
      expect(money!.x + money!.width).toBeLessThanOrEqual(width);
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }

  await schedule.getByRole("button", { name: "Add item", exact: true }).click();
  const drawer = page.getByRole("dialog");
  await expect(drawer.getByRole("textbox", { name: "Amount", exact: true })).toBeEnabled();
  await drawer.getByRole("button", { name: "Cancel", exact: true }).click();
  await schedule.getByRole("button", { name: /To .*Schedule B, Item 7/ }).click();
  await expect(page.locator(id("txtPg1EX1ScBI7"))).toBeFocused();
  await expect(page.locator(id("txtPg1EX1ScBI7"))).toHaveText("400");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  if (process.env.EBIRFORMS_CAPTURE_TEST_PDFS === "1") {
    await mkdir(info.outputDir, { recursive: true });
    const path = info.outputPath("1702mx-attachment.pdf");
    const print = await printSavedReturn(page, "1702MX", path);
    await expect(print.locator(".withholding-print-page")).toHaveCount(13);
    const attachment = execFileSync("pdftotext", ["-f", "13", "-l", "13", "-layout", path, "-"], { encoding: "utf8" });
    expect(attachment).toMatch(/research expense[^\n]*250/i);
    await print.close();
    await page.getByRole("dialog", { name: "Open generated PDF?" }).getByRole("button", { name: "Not now", exact: true }).click();
  }
  await page.getByRole("link", { name: "Edit", exact: true }).click();
  await goToReturnPage(page, 13);
  await expect(desc(second)).toHaveValue("Research expense");
  await expect(amount(second)).toHaveValue("250");
});

test("June 2013 1702MX labels tax relief dates and navigates between attachment tax totals", async ({ page }) => {
  await seedWorkspace(page, "light", "loaded", { taxpayerClassification: "N" }, [{
    id: "special-review", taxpayerId, formCode: "1702MX", returnPeriod: "2025-12",
    status: "Draft", updatedAt: 1794441600000, finalFlag: "0",
    values: {
      [prefix + "chkPg2Pt4I30MoreThanOne"]: "Y", [prefix + "totalEXAttach"]: "1", [prefix + "totalSPAttach"]: "1",
      [prefix + "txtPg1I2YearEnd"]: "2025", [prefix + "ddlPg1I2Date"]: "12",
      [prefix + "txtPg2SP1ScDI1"]: "200000", [prefix + "txtPg2SP1ScE1I1"]: "50000",
      [prefix + "txtPg1SP1ScBI11"]: "5"
    }
  }]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${forms}/1702MX?return=special-review`);
  await expect(page.getByRole("navigation", { name: "Return pages" })).toBeVisible({ timeout: 20_000 });
  await goToReturnPage(page, 14);
  const identification = page.getByRole("region", { name: "Tax return", exact: true });
  await expect(identification.getByText("Regular rate", { exact: true })).toHaveCount(0);
  const from = page.getByRole("group", { name: "Relief from", exact: true });
  const to = page.getByRole("group", { name: "Relief to", exact: true });
  const fromMonth = from.getByRole("spinbutton", { name: "Month", exact: true });
  const fromYear = from.getByRole("spinbutton", { name: "Year", exact: true });
  const toMonth = to.getByRole("spinbutton", { name: "Month", exact: true });
  const toYear = to.getByRole("spinbutton", { name: "Year", exact: true });
  await fromMonth.fill("02");
  await fromYear.fill("00");
  await fromYear.blur();
  await expect(fromMonth).toHaveValue("02");
  await expect(fromYear).toHaveValue("00");
  await fromYear.fill("24");
  await toMonth.fill("09");
  await toYear.fill("28");
  await toYear.blur();
  await expect(fromYear).toHaveValue("24");
  await expect(toMonth).toHaveValue("09");
  await expect(toYear).toHaveValue("28");
  const taxRelief = page.getByRole("region", { name: /^Schedule C / });
  await expect(taxRelief.locator('[data-corporate-item="4"] .amount-caption')).toContainText("Less: Income Tax Due (Schedule B Item 12)");
  await taxRelief.getByRole("button", { name: /From .*Schedule B, Item 12/ }).click();
  await expect(page.locator(id("txtPg1SP1ScBI12"))).toBeFocused();
  await expect(page.locator(id("txtPg1SP1ScBI12"))).toHaveText("7,500");

  for (const [section, item, calculated] of [["D", 1, "200,000"], ["E3", 2, "50,000"]] as const) {
    await goToReturnPage(page, 15);
    const region = page.getByRole("region", { name: new RegExp(`^Schedule ${section} `) });
    await region.getByRole("button", { name: new RegExp(`To .*Schedule B, Item ${item}$`) }).click();
    const target = page.locator(id(`txtPg1SP1ScBI${item}`));
    await expect(target).toBeFocused();
    await expect(target).toHaveText(calculated);
  }
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("ebirforms-created-returns-v1")!).returns
    .find((record: { id: string }) => record.id === "special-review"));
  expect(saved.values).toMatchObject({
    [prefix + "txtPg1SP1ScAI5month"]: "02", [prefix + "txtPg1SP1ScAI5year"]: "24",
    [prefix + "txtPg1SP1ScAI6month"]: "09", [prefix + "txtPg1SP1ScAI6year"]: "28"
  });
});
