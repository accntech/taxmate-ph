import { describe, expect, it } from "vitest";
import { corporateEditorPages, getCorporateIncomeForm } from "$lib/forms/corporate-income";

const prefix = "frm1702MX:";
const reportedTypes = [
  ["A", "Janitorial and Messengerial Services"],
  ["B", "Professional Fees"],
  ["C", "Security Services"],
] as const;
const otherTypes = ["D", "E", "F", "G", "H"] as const;

function schedule5(code: string) {
  const form = getCorporateIncomeForm(code)!;
  const section = corporateEditorPages(form, {})[2].sections.find(section => section.title.startsWith("Schedule 5"));
  return section!.rows;
}

describe("January 2018 Form 1702-MX Schedule 5", () => {
  it.each(["1702MXv2018", "1702MXv2018C"])("uses uppercase item identifiers for named deductions in %s", code => {
    const rows = schedule5(code);
    for (const [suffix, label] of reportedTypes) {
      expect(rows.find(row => row.item === `17${suffix}`)).toMatchObject({
        label,
        fields: [{ id: prefix + `txtPg3Sc5Itm17${suffix.toLowerCase()}A` },
          { label: "Special rate" }, { label: "Regular rate" }, { label: "Total", readonly: true }],
      });
    }
  });

  it("keeps each custom deduction description with its read-only amounts and preserves the source order", () => {
    const rows = schedule5("1702MXv2018");
    const deductions = rows.slice(rows.findIndex(row => row.item === "17C") + 1);
    expect(deductions.slice(0, 5).map(row => row.item)).toEqual(otherTypes.map(suffix => `17${suffix}`));
    for (const [index, suffix] of otherTypes.entries()) {
      const row = deductions[index];
      const sourceSuffix = suffix.toLowerCase();
      expect(row.fields.map(field => ({
        id: field.id,
        label: field.label,
        readonly: !!field.readonly,
        column: field.column,
      }))).toEqual([
        { id: prefix + `txtPg3Sc5It17${sourceSuffix}`, label: "Description", readonly: false, column: undefined },
        ...["Exempt", "Special rate", "Regular rate", "Total"].map((label, columnIndex) => ({
          id: prefix + `txtPg3Sc5Itm17${sourceSuffix}${"ABCD"[columnIndex]}`,
          label,
          readonly: true,
          column: undefined,
        })),
      ]);
    }
    expect(deductions.some(row => row.label.startsWith("Schedule 4"))).toBe(false);
    expect(deductions[5].item).toBe("17i");
    expect(deductions[6].label).toContain("Sum of Items 1 to 17I");
  });

  it("keeps CREATE custom descriptions and amounts separate with uppercase description prefixes", () => {
    const rows = schedule5("1702MXv2018C");
    for (const suffix of otherTypes) {
      const lower = suffix.toLowerCase();
      expect(rows.find(row => row.fields[0].id === prefix + `txtPg3Sc5It17${lower}`)).toMatchObject({
        label: `${suffix}.`,
        fields: [{ label: `${suffix}.` }],
      });
      expect(rows.find(row => row.fields[0].id === prefix + `txtPg3Sc5Itm17${lower}A`)?.fields).toHaveLength(4);
    }
  });
});

it("unlocks January 2018 custom regime amounts after a description without unlocking totals or attachment rollups", () => {
  const form = getCorporateIncomeForm("1702MXv2018")!;
  const description = prefix + "txtPg3Sc5It17d";
  const fields = (values: Record<string, string>) => corporateEditorPages(form, values)[2].sections
    .flatMap(section => section.rows).find(row => row.item === "17D")!.fields.slice(1);
  const described = { [description]: "Professional services" };
  expect(fields({}).map(field => !!field.readonly)).toEqual([true, true, true, true]);
  expect(fields(described).map(field => !!field.readonly)).toEqual([false, false, false, true]);
  expect(fields({
    ...described,
    [prefix + "rdoPg2I1"]: "F",
    [prefix + "totalSPAttach"]: "1",
  }).map(field => !!field.readonly)).toEqual([true, true, true, true]);
});
