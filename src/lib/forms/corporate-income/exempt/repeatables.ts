import type {
  CorporateField,
  CorporatePage,
  CorporateRow,
  CorporateSection,
  CorporateValues,
} from "../types";

const prefix = "frm1702EX:";
const id = (name: string) => prefix + name;
const number = (values: CorporateValues, field: string) =>
  Number(
    (values[field] ?? "").replaceAll(",", "").replace(/^\((.+)\)$/, "-$1"),
  ) || 0;
const allRows = (pages: CorporatePage[]) =>
  pages.flatMap((page) => page.sections.flatMap((section) => section.rows));

type OrdinaryGroup = { key: string; label: string; amountColumn: number };
const ordinaryGroups: OrdinaryGroup[] = [
  { key: "Pg4S3I3", label: "Other taxable income", amountColumn: 2 },
  { key: "Pg4S4I4", label: "Other amortization", amountColumn: 2 },
  {
    key: "Pg5S4I39",
    label: "Other ordinary allowable deductions",
    amountColumn: 2,
  },
  { key: "Pg5S5I4", label: "Special allowable deductions", amountColumn: 3 },
  { key: "Pg5S6I3", label: "Reconciliation additions", amountColumn: 2 },
  {
    key: "Pg5S6I6",
    label: "Reconciliation income exclusions",
    amountColumn: 2,
  },
  {
    key: "Pg5S6I8",
    label: "Reconciliation special deductions",
    amountColumn: 2,
  },
];
type SupplementalGroup = {
  key: string;
  label: string;
  schedule: number;
  first: number;
  last: number;
  amountStem: string;
};
const supplementalGroups: SupplementalGroup[] = [
  {
    key: "Pg7S9Pt2",
    label: "Real properties subject to final tax",
    schedule: 9,
    first: 5,
    last: 9,
    amountStem: "txtPg7Sc9I9FinalTaxC_",
  },
  {
    key: "Pg7S9Pt3",
    label: "Shares of stock subject to final tax",
    schedule: 9,
    first: 10,
    last: 15,
    amountStem: "txtPg7Sc9I15FinalTaxC_",
  },
  {
    key: "Pg7S9Pt4",
    label: "Other income subject to final tax",
    schedule: 9,
    first: 16,
    last: 18,
    amountStem: "txtPg7Sc9I18FinalTaxC_",
  },
  {
    key: "Pg7S9Pt5",
    label: "Exempt properties received",
    schedule: 10,
    first: 2,
    last: 5,
    amountStem: "txtPg7Sc10I5ActualAmountC_",
  },
  {
    key: "Pg7S9Pt6",
    label: "Other exempt income",
    schedule: 10,
    first: 6,
    last: 7,
    amountStem: "txtPg7Sc10I7ActualAmountC_",
  },
];
const prizesKey = "Pg7S9Pt1";
const countId = (key: string) => key + "PopLength";
const count = (values: CorporateValues, key: string) =>
  Math.max(0, Math.min(99, Math.floor(number(values, countId(key)))));
const ordinaryRow = (pages: CorporatePage[], group: OrdinaryGroup) =>
  allRows(pages).find((row) =>
    row.fields.some((field) => field.id === id("txt" + group.key + "Col1")),
  );
const ordinaryFields = (row: CorporateRow, group: OrdinaryGroup) =>
  row.fields.filter((field) =>
    new RegExp("^" + id("txt" + group.key) + "Col\\d$").test(field.id),
  );
function supplementalRows(
  pages: CorporatePage[],
  group: SupplementalGroup,
): CorporateRow[] {
  const pattern = new RegExp(
    `^${prefix}txtPg7Sc${group.schedule}I(\\d+).*C[12]$`,
  );
  return allRows(pages).filter((row) =>
    row.fields.some((field) => {
      const match = field.id.match(pattern);
      return (
        match &&
        Number(match[1]) >= group.first &&
        Number(match[1]) <= group.last
      );
    }),
  );
}
function ordinaryDetails(
  group: OrdinaryGroup,
  row: CorporateRow,
  values: CorporateValues,
): CorporateRow[] {
  return Array.from({ length: count(values, group.key) }, (_, index) => ({
    item: `${row.item ?? ""}.${index + 1}`,
    entry: { group: countId(group.key), index },
    label: `${group.label} ${index + 1}`,
    fields: ordinaryFields(row, group).map((field) => ({
      ...field,
      id: field.id.replace(/Col(\d)$/, `_${index + 1}Col$1`),
      readonly: false,
      label:
        field.kind === "money"
          ? "Amount"
          : field.id.endsWith("Col2") && group.amountColumn === 3
            ? "Legal basis"
            : "Description",
    })),
  }));
}
function supplementalDetails(
  pages: CorporatePage[],
  group: SupplementalGroup,
  values: CorporateValues,
): CorporateRow[] {
  return Array.from({ length: count(values, group.key) }, (_, index) =>
    supplementalRows(pages, group).map((row) => ({
      ...row,
      entry: { group: countId(group.key), index },
      label: `${row.label.replace(/\s+/g, " ")} – entries ${index * 2 + 3} and ${index * 2 + 4}`,
      fields: row.fields
        .filter((field) => /C[12]$/.test(field.id))
        .map((field) => ({
          ...field,
          id: field.id.replace(
            /C([12])$/,
            (_, column) => "C_" + (index * 2 + 2 + Number(column)),
          ),
          readonly: false,
          ...(field.kind === "select"
            ? { defaultValue: field.defaultValue ?? field.options?.[0]?.value }
            : {}),
        })),
    })),
  ).flat();
}
function prizeRow(pages: CorporatePage[]): CorporateRow | undefined {
  return allRows(pages).find((row) =>
    row.fields.some((field) => field.id === id("txtPg7Sc9I4PrizesC3")),
  );
}
function prizeDetails(values: CorporateValues): CorporateRow[] {
  return Array.from({ length: count(values, prizesKey) }, (_, index) => ({
    item: `4.${index + 1}`,
    entry: { group: countId(prizesKey), index },
    label: `Prizes and winnings ${index + 1}`,
    fields: [
      {
        id: id(`txtPg7S9Pt1_${index + 1}Col1`),
        kind: "text",
        label: "Description",
        maxLength: 20,
      },
      {
        id: id(`txtPg7S9Pt1_${index + 1}Col2`),
        kind: "money",
        label: "Actual amount exempt",
        maxLength: 12,
      },
      {
        id: id(`txtPg7S9Pt1_${index + 1}Col3`),
        kind: "money",
        label: "Actual amount taxable",
        maxLength: 12,
      },
      {
        id: id(`txtPg7S9Pt1_${index + 1}Col4`),
        kind: "money",
        label: "Final tax withheld / paid",
        maxLength: 12,
      },
    ],
  }));
}
const countField = (key: string, label: string, fixed = false): CorporateField => ({
  id: countId(key),
  kind: "integer",
  label,
  repeatable: { label, limit: 99, fixed },
  defaultValue: "0",
  maxLength: 2,
});

/** Source hidden PopLength values are exposed as entry counts in the editor. */
export function exemptRepeatablePages(pages: CorporatePage[]): CorporatePage[] {
  const result = structuredClone(pages);
  for (const group of ordinaryGroups) {
    const row = ordinaryRow(result, group);
    if (row && !row.fields.some((field) => field.id === countId(group.key))) {
      const counter = countField(group.key, group.label, group.key === "Pg4S3I3" || group.key === "Pg4S4I4");
      counter.repeatable!.rollup = true;
      row.fields.push(counter);
    }
  }
  for (const row of allRows(result)) {
    if (row.fields.some((field) => /^frm1702EX:txtPg4S3I[123]Col1$/.test(field.id))) row.list = "Other taxable income";
    if (row.fields.some((field) => /^frm1702EX:txtPg4S4I[234]Col1$/.test(field.id))) row.list = "Amortization";
    if (row.list) for (const field of row.fields) {
      if (field.kind === "text") field.label = "Description";
      if (field.kind === "money") field.label = "Amount";
    }
  }
  for (const group of supplementalGroups) {
    const row = supplementalRows(result, group).at(-1);
    if (row && !row.fields.some((field) => field.id === countId(group.key)))
      row.fields.push(countField(group.key, group.label));
  }
  const prizes = prizeRow(result);
  if (prizes && !prizes.fields.some((field) => field.id === countId(prizesKey)))
    prizes.fields.push(
      countField(prizesKey, "Additional prizes and winnings"),
    );
  return result;
}

export function expandExemptPages(
  pages: CorporatePage[],
  values: CorporateValues,
): CorporatePage[] {
  const result = structuredClone(pages);
  for (const page of result)
    for (const section of page.sections) {
      section.rows = section.rows.flatMap((row) => {
        const ordinary = ordinaryGroups.find((group) =>
          row.fields.some((field) => field.id === countId(group.key)),
        );
        if (ordinary && count(values, ordinary.key) > 0) {
          return [
            {
              ...row,
              fields: row.fields.map((field) =>
                field.id === countId(ordinary.key)
                  ? field
                  : { ...field, readonly: true },
              ),
            },
            ...ordinaryDetails(ordinary, row, values),
          ];
        }
        const supplemental = supplementalGroups.find((group) =>
          row.fields.some((field) => field.id === countId(group.key)),
        );
        if (supplemental)
          return [row, ...supplementalDetails(pages, supplemental, values)];
        if (row.fields.some((field) => field.id === countId(prizesKey)))
          return [row, ...prizeDetails(values)];
        return [row];
      });
    }
  return result;
}

export function exemptContinuations(
  pages: CorporatePage[],
  values: CorporateValues,
): CorporateSection[] {
  const sections: CorporateSection[] = [];
  for (const group of ordinaryGroups) {
    const row = ordinaryRow(pages, group);
    if (row && count(values, group.key) > 0)
      sections.push({
        title: group.label,
        rows: ordinaryDetails(group, row, values),
      });
  }
  for (const group of supplementalGroups) {
    if (count(values, group.key) > 0)
      sections.push({
        title: group.label,
        rows: supplementalDetails(pages, group, values),
      });
  }
  if (count(values, prizesKey) > 0)
    sections.push({
      title: "Additional prizes and winnings",
      rows: prizeDetails(values),
    });
  return sections;
}

/** Roll up only source ordinary-detail summaries before the fixed schedule equations run. */
export function rollupExemptDetails(
  pages: CorporatePage[],
  input: CorporateValues,
): CorporateValues {
  const values = { ...input };
  for (const group of ordinaryGroups) {
    const row = ordinaryRow(pages, group);
    if (!row) continue;
    const length = count(values, group.key);
    const base = ordinaryFields(row, group);
    const pattern = new RegExp(`^${id("txt" + group.key)}_(\\d+)Col\\d$`);
    const existing = Object.keys(values).filter((field) => pattern.test(field));
    if (length > 0) {
      if (!Object.hasOwn(values, id("txt" + group.key + "_1Col1"))) {
        for (const field of base) {
          const detail = field.id.replace(/Col(\d)$/, "_1Col$1");
          if (values[detail] === undefined)
            values[detail] = values[field.id] ?? "";
        }
      }
      for (const field of base) {
        const column = field.id.match(/Col(\d)$/)![1];
        const detailIds = Array.from({ length }, (_, index) =>
          id(`txt${group.key}_${index + 1}Col${column}`),
        );
        values[field.id] =
          field.kind === "money"
            ? String(
                detailIds.reduce((sum, key) => sum + number(values, key), 0),
              )
            : length === 1 || (group.amountColumn === 3 && column === "2")
              ? (values[detailIds[0]] ?? "")
              : "OTHERS";
      }
    } else if (
      existing.length &&
      // Cleared continuation fields can remain in the open draft while
      // the user adds a new standard item in the summary slot.
      existing.some((field) => values[field]?.trim())
    ) {
      for (const field of base)
        values[field.id] = field.kind === "money" ? "0" : "";
    }
    for (const field of existing)
      if (Number(field.match(pattern)![1]) > length) delete values[field];
  }
  // Counts are the saved source authority for supplemental pairs, so removed records cannot leak into totals or annexes.
  for (const group of supplementalGroups) {
    const stemPattern = new RegExp(
      `^${prefix}(?:txtPg7Sc${group.schedule}I|ddPg7S9I)(\\d+).*C_(\\d+)$`,
    );
    for (const field of Object.keys(values)) {
      const match = field.match(stemPattern);
      if (
        match &&
        Number(match[1]) >= group.first &&
        Number(match[1]) <= group.last &&
        Number(match[2]) > 2 + 2 * count(values, group.key)
      )
        delete values[field];
    }
  }
  for (const field of Object.keys(values)) {
    const match = field.match(/^frm1702EX:txtPg7S9Pt1_(\d+)Col\d$/);
    if (match && Number(match[1]) > count(values, prizesKey))
      delete values[field];
  }
  return values;
}

export function exemptAdditionalFinalTax(values: CorporateValues): number {
  const prizes = Array.from({ length: count(values, prizesKey) }, (_, index) =>
    number(values, id(`txtPg7S9Pt1_${index + 1}Col4`)),
  ).reduce((sum, amount) => sum + amount, 0);
  return supplementalGroups
    .filter((group) => group.schedule === 9)
    .reduce((sum, group) => sum + supplementalAmount(group, values), prizes);
}
export function exemptAdditionalExemptIncome(values: CorporateValues): number {
  return supplementalGroups
    .filter((group) => group.schedule === 10)
    .reduce((sum, group) => sum + supplementalAmount(group, values), 0);
}
function supplementalAmount(
  group: SupplementalGroup,
  values: CorporateValues,
): number {
  return Array.from({ length: count(values, group.key) * 2 }, (_, index) =>
    number(values, id(group.amountStem + (index + 3))),
  ).reduce((sum, amount) => sum + amount, 0);
}

export function validateExemptDetails(
  pages: CorporatePage[],
  values: CorporateValues,
): CorporateValues {
  const errors: CorporateValues = {};
  for (const key of [
    ...ordinaryGroups.map((group) => group.key),
    ...supplementalGroups.map((group) => group.key),
    prizesKey,
  ]) {
    const raw = values[countId(key)];
    if (raw && (!/^\d+$/.test(raw) || Number(raw) > 99))
      errors[countId(key)] = "Enter a number of entries from 0 to 99.";
  }
  for (const section of exemptContinuations(pages, values)) {
    for (const row of section.rows) {
      const entered = row.fields.some(
        (field) => field.kind === "money" && number(values, field.id) !== 0,
      );
      for (const field of row.fields) {
        if (
          field.kind === "money" &&
          values[field.id] &&
          !Number.isFinite(
            Number(
              values[field.id].replaceAll(",", "").replace(/^\((.+)\)$/, "-$1"),
            ),
          )
        )
          errors[field.id] = "Enter a valid amount.";
        if (entered && field.kind === "text" && !values[field.id]?.trim())
          errors[field.id] = "Complete the details for the entered amount.";
      }
    }
  }
  for (const group of supplementalGroups) {
    const rows = supplementalDetails(pages, group, values);
    for (let index = 3; index <= 2 + 2 * count(values, group.key); index++) {
      const fields = rows
        .flatMap((row) => row.fields)
        .filter((field) => field.id.endsWith("C_" + index));
      if (
        !fields.some(
          (field) => field.kind === "money" && number(values, field.id) !== 0,
        )
      )
        continue;
      for (const field of fields)
        if (
          (field.kind === "text" || field.kind === "date") &&
          !values[field.id]?.trim()
        )
          errors[field.id] = "Complete the details for the entered amount.";
    }
  }
  return errors;
}
