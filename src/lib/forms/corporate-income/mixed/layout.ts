import type {
  CorporateField,
  CorporatePage,
  CorporateRow,
  CorporateSection,
} from "../types";

import { legacyMixedSpecialRate } from "./atc";

const p = "frm1702MX:";
const finalWithholdingColumns = [
  "Exempt",
  "Actual amount / fair market value / net capital gains",
  "Final tax withheld / paid",
];

function refineLegacyMixedSection(section: CorporateSection) {
  if (section.title.startsWith("Schedule 13 -")) {
    section.columns = finalWithholdingColumns;
  }
  for (const row of section.rows) {
    const first = row.fields[0].id.slice(p.length);
    if (/^txtPg2Pt5I4[0-4]$/.test(first)) {
      row.fields[0].column = 4;
      row.fields[0].label = row.label;
    } else if (first === "txtPg3Sc1I11CA") {
      const [exempt, regular] = row.fields;
      row.label = "Applicable income tax rate";
      row.fields = [
        { ...exempt, column: 1, kind: "percent", label: "Exempt", defaultValue: "0", readonly: true },
        { id: legacyMixedSpecialRate, column: 2, kind: "select", label: "Special rate", defaultValue: "0" },
        { ...regular, column: 3, kind: "percent", label: "Regular rate", readonly: true },
      ];
    } else if (first === "txtPg8Sc11I16") {
      row.label = "Total Equity (Sum of Items 13 to 15)";
      row.fields[0].label = row.label;
    } else if (/^txtPg9Sc13I[1-4]CA$/.test(first)) {
      row.fields.forEach((field, index) => {
        field.column = index + 1;
        field.label = finalWithholdingColumns[index];
      });
    } else if (first === "drpPg9Sc13I10CA-1") {
      for (const field of row.fields) {
        field.label = field.kind === "select" ? "Stock kind (PS/CS)" : "Stock certificate series no.";
      }
    }
  }
}
const lossLabels: Record<string, string> = {
  Year: "Year incurred",
  A: "Net operating loss",
  B: "Applied in previous years",
  C: "Expired",
  D: "Applied this year",
  E: "Remaining balance",
};
const mcitLabels: Record<string, string> = {
  "": "Year incurred",
  CA: "Normal income tax as adjusted",
  CB: "MCIT",
  CC: "Excess MCIT over normal income tax",
  CD: "Applied in previous years",
  CE: "Expired",
  CF: "Applied this year",
  CG: "Remaining balance",
};
function lossField(field: CorporateField) {
  return field.id
    .slice(p.length)
    .match(/^txtPg[34]IShed([78])_([4-7])(Year|[A-E])$/);
}

function refineRevisedOrdinaryDeductions(code: string, section: CorporateSection) {
  if (!section.title.startsWith("Schedule 5")) return;

  for (const row of section.rows) {
    const id = row.fields[0].id.slice(p.length);
    const named = id.match(/^txtPg3Sc5Itm17([a-c])A$/);
    if (named) {
      row.item = `17${named[1].toUpperCase()}`;
      row.label = row.label.replace(/^[a-c]\.\s*/, "");
    }
  }

  for (const suffix of "defgh") {
    const descriptionId = p + `txtPg3Sc5It17${suffix}`;
    const descriptionIndex = section.rows.findIndex(row => row.fields[0].id === descriptionId);
    if (descriptionIndex < 0) continue;
    const description = section.rows[descriptionIndex];
    const letter = suffix.toUpperCase();

    if (code === "1702MXv2018C") {
      description.label = `${letter}.`;
      description.fields[0].label = description.label;
      continue;
    }

    const amountId = p + `txtPg3Sc5Itm17${suffix}A`;
    const amountIndex = section.rows.findIndex(row => row.fields[0].id === amountId);
    if (amountIndex < 0) continue;
    const amounts = section.rows[amountIndex];
    section.rows[amountIndex] = {
      ...amounts,
      item: `17${letter}`,
      label: "Other ordinary allowable deduction",
      fields: [
        { ...description.fields[0], label: "Description" },
        ...amounts.fields.map(field => ({
          ...field, column: undefined, readonly: field.id.endsWith("D"),
        })),
      ],
    };
    section.rows.splice(descriptionIndex, 1);
  }
}

export function refineMixedPages(
  code: string,
  pages: CorporatePage[],
): CorporatePage[] {
  for (const page of pages) {
    const allFields = page.sections.flatMap((section) =>
      section.rows.flatMap((row) => row.fields),
    );
    const sections: CorporateSection[] = [];
    for (const section of page.sections) {
      let current = { ...section, rows: [] as CorporateRow[] };
      const emittedLosses = new Set<string>();
      const emittedMcit = new Set<string>();
      for (const sourceRow of section.rows) {
        const first = sourceRow.fields[0].id.slice(p.length);
        if (first === "chkPg1I5ATCR1") {
          const otherAtc = section.rows.find(
            (row) => row.fields[0].id === p + "drpPg1I5ATCR2",
          );
          current.rows.push({
            ...sourceRow,
            label: "Alphanumeric tax code (ATC)",
            fields: code === "1702MX" && otherAtc
              ? [...sourceRow.fields, { ...otherAtc.fields[1], label: "Select another ATC" }, otherAtc.fields[0]]
              : [...sourceRow.fields, ...(otherAtc?.fields ?? [])],
          });
          continue;
        }
        if (first === "drpPg1I5ATCR2") continue;
        if (code === "1702MX" && first === "txtPg1Pt1I13MainLine") {
          const [business, psic] = sourceRow.fields;
          current.rows.push(
            { ...sourceRow, fields: [business] },
            { item: "14", label: "PSIC code", fields: [{ ...psic, label: "PSIC code" }] },
          );
          continue;
        }
        if (/^radPg8Sc12/.test(first)) {
          if (current.rows.length) sections.push(current);
          current = {
            title: "Schedule 12 – Stockholders, Partners and Members",
            rows: [],
          };
        }
        const stakeholder = first.match(/^txtPg8Sc12I(\d+)C1$/);
        if (stakeholder) {
          sourceRow.item = stakeholder[1];
          sourceRow.label = `Stockholder, partner or member ${stakeholder[1]}`;
          for (const field of sourceRow.fields) {
            const name = field.id.slice(p.length);
            field.readonly = false;
            const tin = name.match(/C2tin([1-4])$/);
            field.label = tin
              ? {
                  "1": "TIN, first three digits",
                  "2": "TIN, second three digits",
                  "3": "TIN, third three digits",
                  "4": "Branch code",
                }[tin[1]]
              : name.endsWith("C1")
                ? "Registered name"
                : name.endsWith("C3")
                  ? "Capital contribution"
                  : "Percentage of ownership";
            if (name.endsWith("C4")) field.kind = "percent";
          }
        }
        for (const field of sourceRow.fields) {
          if (/^radPg8Sc12/.test(field.id.slice(p.length))) {
            field.kind = "checkbox";
            field.options = undefined;
            field.label = field.id.endsWith("stockholder")
              ? "Stockholders"
              : field.id.endsWith("partner")
                ? "Partners"
                : "Members";
          }
        }
        const loss = lossField(sourceRow.fields[0]);
        if (loss) {
          const key = loss[1] + "_" + loss[2];
          if (emittedLosses.has(key)) continue;
          emittedLosses.add(key);
          const fields = allFields.filter((field) => {
            const match = lossField(field);
            return match && match[1] === loss[1] && match[2] === loss[2];
          });
          fields.sort(
            (a, b) =>
              ["Year", "A", "B", "C", "D", "E"].indexOf(lossField(a)![3]) -
              ["Year", "A", "B", "C", "D", "E"].indexOf(lossField(b)![3]),
          );
          for (const field of fields) {
            const column = lossField(field)![3];
            field.kind = column === "Year" ? "integer" : "money";
            field.label = lossLabels[column];
            field.readonly = column === "E" || loss[2] === "7";
          }
          current.rows.push({
            item: loss[2],
            label:
              loss[1] === "7"
                ? "Regular-rate loss carryover"
                : "Special-rate loss carryover",
            fields,
          });
          continue;
        }
        const mcit = first.match(/^txtPg7Sc9I([1-3])(C[A-G])?$/);
        if (mcit) {
          if (emittedMcit.has(mcit[1])) continue;
          emittedMcit.add(mcit[1]);
          const fields = allFields.filter((field) =>
            new RegExp(`^${p}txtPg7Sc9I${mcit[1]}(?:C[A-G])?$`).test(field.id),
          );
          fields.sort(
            (a, b) =>
              ["", "CA", "CB", "CC", "CD", "CE", "CF", "CG"].indexOf(
                a.id.slice((p + `txtPg7Sc9I${mcit[1]}`).length),
              ) -
              ["", "CA", "CB", "CC", "CD", "CE", "CF", "CG"].indexOf(
                b.id.slice((p + `txtPg7Sc9I${mcit[1]}`).length),
              ),
          );
          for (const field of fields) {
            const column = field.id.slice((p + `txtPg7Sc9I${mcit[1]}`).length);
            field.label = mcitLabels[column];
            field.column = undefined;
            current.columns = undefined;
            field.kind = column ? "money" : "integer";
            field.readonly = ["CC", "CG"].includes(column);
          }
          current.rows.push({
            item: mcit[1],
            label: "Excess MCIT carryover",
            fields,
          });
          continue;
        }
        current.rows.push(sourceRow);
      }
      if (current.rows.length) sections.push(current);
    }
    if (code !== "1702MX") {
      for (const section of sections) {
        refineRevisedOrdinaryDeductions(code, section);
        for (const item of [2, 5, 7]) {
          const base = p + `txtPg4Sc10Itm${item}`;
          const matches = section.rows
            .flatMap((row) => row.fields)
            .filter((field) =>
              new RegExp("^" + base + "[ABCD]?$").test(field.id),
            );
          if (!matches.length) continue;
          const first = section.rows.findIndex((row) =>
            row.fields.some((field) => matches.includes(field)),
          );
          const merged: CorporateRow = {
            item: String(item),
            label:
              item === 2
                ? "Reconciliation addition"
                : item === 5
                  ? "Income exclusion"
                  : "Reconciliation deduction",
            fields: matches
              .sort(
                (a, b) => a.id.length - b.id.length || a.id.localeCompare(b.id),
              )
              .map((field) => ({
                ...field,
                column: undefined,
                readonly: field.id.endsWith("D"),
                label:
                  field.id === base
                    ? "Description"
                    : {
                        A: "Exempt",
                        B: "Special rate",
                        C: "Regular rate",
                        D: "Total",
                      }[field.id.slice(-1) as "A" | "B" | "C" | "D"],
              })),
          };
          section.rows = section.rows.flatMap((row, index) => {
            const remaining = row.fields.filter(
              (field) => !matches.includes(field),
            );
            return [
              ...(index === first ? [merged] : []),
              ...(remaining.length ? [{ ...row, fields: remaining }] : []),
            ];
          });
        }
      }
    }
    if (code === "1702MX") sections.forEach(refineLegacyMixedSection);
    page.sections = sections;
  }
  return pages;
}
