import type { CorporateField, CorporatePage, CorporateRow, CorporateValues } from "../types";
import { mixedNumber } from "./calculation";

const prefix = "frm1702MX:";

function deductionRow(item: string, fields: CorporateField[], labels: string[]): CorporateRow {
  return {
    item,
    label: `Item ${item}`,
    layout: "deduction",
    fields: fields.map((field, index) => ({
      ...field,
      label: labels[index],
      kind: index === fields.length - 1 ? "money" : "text",
      readonly: false,
    })),
  };
}

export function layoutMixedAttachmentDeductions(page: CorporatePage): void {
  const ordinaryStart = prefix + "txtPg2AttMScDI9";
  const sectionIndex = page.sections.findIndex(section =>
    section.rows.some(row => row.fields[0].id === ordinaryStart),
  );
  if (sectionIndex === -1) return;

  const identification = page.sections[sectionIndex];
  const firstOrdinaryRow = identification.rows.findIndex(row => row.fields[0].id === ordinaryStart);
  const ordinaryRows = identification.rows.splice(firstOrdinaryRow);
  identification.title = "Return identification";

  for (const [index, letter] of [..."abc"].entries()) {
    const row = ordinaryRows.find(row => row.fields[0].id === prefix + `txtPg2AttMScDI${17 + index}`);
    if (!row) continue;
    row.item = `17${letter}`;
    row.label = row.label.replace(/^[abc]\s+/, "");
    row.fields[0].label = row.label;
    if (letter === "a") row.heading = "17 Others (Deductions Subject to Withholding Tax and Other Expenses)";
  }

  for (const [index, letter] of [..."defgh"].entries()) {
    const suffix = 20 + index;
    const amountIndex = ordinaryRows.findIndex(row => row.fields[0].id === prefix + `txtPg2AttMScDI${suffix}`);
    const descriptionIndex = ordinaryRows.findIndex(row => row.fields[0].id === prefix + `txtPg2AttMDesc${suffix}`);
    if (amountIndex === -1 || descriptionIndex === -1) continue;
    const amount = ordinaryRows[amountIndex].fields[0];
    const description = ordinaryRows[descriptionIndex].fields[0];
    ordinaryRows[amountIndex] = deductionRow(`17${letter}`, [description, amount], ["Description", "Amount"]);
    ordinaryRows.splice(descriptionIndex, 1);
  }

  page.sections.splice(sectionIndex + 1, 0, {
    title: "Schedule D – Ordinary Allowable Itemized Deductions (Continuation)",
    rows: ordinaryRows,
  });
  const special = page.sections.find(section => section.title.startsWith("Schedule E"));
  if (special) {
    special.rows = special.rows.map(row => {
      const item = /^frm1702MX:txtPg4AttMScHI([1-3])C1$/.exec(row.fields[0].id)?.[1];
      return item ? deductionRow(item, row.fields, ["Description", "Legal basis", "Amount"]) : row;
    });
  }
}

export function layoutLegacyMixedAttachmentDeductions(pages: CorporatePage[]): void {
  for (const page of pages) for (const section of page.sections) {
    section.rows = section.rows.map(row => {
      const special = /^frm1702MX:txtPg4AttMScHI([1-3])C1$/.exec(row.fields[0].id)?.[1];
      if (special) return deductionRow(special, row.fields, ["Description", "Legal basis", "Amount"]);
      const item = /^frm1702MX:txtPg(?:3AttMScFI([1-3])|3AttMScGI([2-4])|4AttMScGI(3[6-9]))other$/.exec(row.fields[0].id);
      if (!item) return row;
      const [, income, amortization, ordinary] = item;
      return {
        ...deductionRow(income ?? amortization ?? ordinary, row.fields, ["Description", "Amount"]),
        heading: amortization === "2" ? "Amortizations" : ordinary === "36" ? "Other Ordinary Allowable Deductions" : undefined,
      };
    });
  }
}

export function setMixedAttachmentDeductionAvailability(
  pages: CorporatePage[], values: CorporateValues, descriptionUnlocks = false,
): void {
  for (const page of pages) for (const section of page.sections) {
    let previousComplete = true;
    for (const row of section.rows) {
      if (row.layout !== "deduction" || (descriptionUnlocks && row.fields.some(field => field.repeatable))) continue;
      const [description, secondField] = row.fields;
      const hasDescription = Boolean(values[description.id]?.trim());
      const hasAmount = mixedNumber(values[row.fields.at(-1)!.id]) !== 0;
      const special = row.fields.length === 3;
      const hasLegalBasis = special && Boolean(values[secondField.id]?.trim());

      // Older drafts can contain later entries even when a preceding row is incomplete.
      row.disabled = !previousComplete && !hasDescription && !hasAmount && !hasLegalBasis;
      previousComplete = hasDescription && (special ? hasLegalBasis : descriptionUnlocks || hasAmount);
    }
  }
}
