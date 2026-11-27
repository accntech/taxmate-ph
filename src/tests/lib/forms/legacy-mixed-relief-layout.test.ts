import { expect, it } from "vitest";
import {
  mixedForms,
  validateMixed,
} from "../../../lib/forms/corporate-income/mixed";

const p = "frm1702MX:";

it("keeps the legacy attachment identity strip separate from the relief date controls", () => {
  const form = mixedForms.find(({ code }) => code === "1702MX")!;
  const page = form.attachmentGroups![0].templatePages[0];
  const [identity, profile, , relief] = page.sections;

  expect(identity.columns).toBeUndefined();
  const dates = profile.rows.filter(({ item }) => item === "5" || item === "6");
  expect(dates.map(({ fields }) => fields.map(({ label }) => label))).toEqual([
    ["Relief from month (MM)", "Relief from year (YY)"],
    ["Relief to month (MM)", "Relief to year (YY)"],
  ]);
  expect(relief.rows.find(({ item }) => item === "4")?.label).toContain("Schedule B Item 12");
});

it("reports invalid saved legacy activity months while preserving valid segments and blank draft values", () => {
  const values = {
    [p + "chkPg2Pt4I30MoreThanOne"]: "Y",
    [p + "totalEXAttach"]: "1",
    [p + "totalSPAttach"]: "1",
    [p + "txtPg1EX1ScAI5month"]: "13",
    [p + "txtPg1EX1ScAI6month"]: "00",
    [p + "txtPg1SP1ScAI5month"]: "01",
    [p + "txtPg1SP1ScAI6month"]: "12",
  };

  const errors = validateMixed("1702MX", values);
  expect(errors[p + "txtPg1EX1ScAI5month"]).toBe("Enter a month from 01 to 12.");
  expect(errors[p + "txtPg1EX1ScAI6month"]).toBe("Enter a month from 01 to 12.");
  expect(errors[p + "txtPg1SP1ScAI5month"]).toBeUndefined();
  expect(errors[p + "txtPg1SP1ScAI6month"]).toBeUndefined();
  expect(validateMixed("1702MX", { ...values, [p + "txtPg1EX1ScAI5month"]: "" })[p + "txtPg1EX1ScAI5month"]).toBeUndefined();
});
