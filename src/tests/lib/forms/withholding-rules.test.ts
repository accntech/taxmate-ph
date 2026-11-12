import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  calculateWithholding,
  createWithholdingValues,
  validateWithholding,
  withholdingReturnPeriod,
} from "$lib/forms/withholding-rules";
import {
  getWithholdingDefinition,
  withholdingDefinitions,
  withholdingFields,
  withholdingSchedules,
  withholdingRowCountKey,
} from "$lib/forms/withholding-definitions";

const calculate = (code: string, v: Record<string, string>) => {
  const p = getWithholdingDefinition(code)!.prefix;
  return calculateWithholding(
    code,
    Object.fromEntries(Object.entries(v).map(([k, v]) => [p + k, v])),
  );
};
const total = (code: string, v: Record<string, string>) =>
  calculate(code, v)[getWithholdingDefinition(code)!.totalField];
describe("packaged withholding arithmetic", () => {
  it("adds manually entered basic tax and penalties on 0605", () =>
    expect(
      total("0605", {
        txtTax19: "10000",
        txtTax20A: "500",
        txtTax20B: "200",
        txtTax20C: "100",
      }),
    ).toBe("10800.00"));
  it("keeps remittance inputs separate from tax-base calculations", () => {
    expect(
      total("0619E", { txtTax14: "10000", txtTax15: "2000", txtTax17A: "300" }),
    ).toBe("8300.00");
    expect(
      total("0619F", {
        txtTax13: "7000",
        txtTax14: "3000",
        txtTax16: "2000",
        txtTax18A: "300",
      }),
    ).toBe("8300.00");
  });
  it("derives ATC tax from the packaged rate rather than an altered rate field", () => {
    const r = calculate("1601E", {
      optCategory: "P",
      optWithheld: "Y",
      txtAtcCode1: "WI120",
      txtTaxBase1: "100000",
      txtTaxRate1: "99",
      txtTax15A: "500",
      txtTax17A: "100",
    });
    expect(r["frm1601E:txtTaxbeWithHeld1"]).toBe("2000.00");
    expect(r["frm1601E:txtTax18"]).toBe("1600.00");
  });
  it("retains positive penalties when PT/VT tax is overremitted", () => {
    for (const code of ["1600PTv2018", "1600VTv2018"])
      expect(
        total(code, {
          txtPg1P2I19TaxRemittedInRtrn: "500",
          txtPg1P2I23Surcharge: "100",
        }),
      ).toBe("100.00");
  });
  it("uses entered compensation withholding and schedule adjustments", () => {
    expect(
      total("1601C", {
        txtTax18: "10000",
        "sched1:txtShouldTaxDue0": "700",
        "sched1:txtTaxPaid0": "200",
        txtTax21A: "2000",
        txtTax24A: "100",
      }),
    ).toBe("8600.00");
    expect(
      total("1601Cv2018", {
        txtTax25: "10000",
        "sched1:txtShouldTaxDue0": "700",
        "sched1:txtTaxPaid0": "200",
        txtTax28: "2000",
        txtTax32: "100",
      }),
    ).toBe("8600.00");
  });
  it("grosses up benefits and sums both revised fringe regimes", () => {
    expect(
      total("1603", { txtFringe360: "65000", txt19: "5000", txt21A: "100" }),
    ).toBe("30100.00");
    expect(
      total("1603Qv2018", {
        "Sched1:txtValue1": "65000",
        "Sched1:txtValue2": "75000",
      }),
    ).toBe("60000.00");
  });
  it("applies the 2025 Q3 foreign-interest rate boundary without erasing input", () => {
    const before = calculate("1602Qv2018", {
      txtYear: "2025",
      optQuarter: "Q2",
      txtSched1Amount13: "1000",
      txtSched1Rate13: "56",
    });
    const after = calculate("1602Qv2018", {
      txtYear: "2025",
      optQuarter: "Q3",
      txtSched1Amount13: "1000",
      txtSched1Rate13: "56",
    });
    expect(before["frm1602Q:txt28"]).toBe("8400.00");
    expect(after["frm1602Q:txt28"]).toBe("11200.00");
    expect(after["frm1602Q:txtSched1Amount13"]).toBe("1000");
  });
  it("reconciles annual remittances while allowing zero penalties", () => {
    const r = calculate("1604Ev2018", {
      txtSched1TaxWithheld1: "1000",
      txtSched1TaxWithheld2: "2000",
      txtSched1TaxWithheld3: "3000",
      txtSched1TaxWithheld4: "4000",
      txtSched1Penalties2: "50",
      txtSched1Penalties4: "100",
    });
    expect(r["frm1604e:txtSched1TotRemAmtTtl"]).toBe("10150.00");
    expect(
      total("1604C", {
        txtSched1TaxWheld1: "1000",
        txtSched1Pen1: "50",
        txtSched1Adj1: "-100",
        txtSched1Adj2: "-20",
      }),
    ).toBe("950.00");
  });
  it("selects the transaction-specific real property tax base", () => {
    expect(
      total("1606", {
        transactionType: "Cash sale",
        txtGross: "1000000",
        txtFMVLand: "1200000",
        txtTaxRate: "5",
        txtLess: "10000",
        txtSurcharge: "100",
      }),
    ).toBe("50100.00");
    expect(
      calculate("1606", {
        transactionType: "Installment sale",
        txtGross: "1000000",
        txtInstallment: "50000",
        txtTaxRate: "5",
      })["frm1606:txtTax"],
    ).toBe("50000.00");
  });
  it("preserves editable draft text and overwrites computed totals", () => {
    const r = calculate("0619E", { txtTax14: "12.", txtTax18: "999999" });
    expect(r["frm0619E:txtTax14"]).toBe("12.");
    expect(r["frm0619E:txtTax18"]).toBe("12.00");
  });
});
describe("final-copy validation and definitions", () => {
  it("rejects incomplete identity and invalid numeric input", () => {
    const e = validateWithholding("0619E", {
      "frm0619E:txtTax14": "not money",
    });
    expect(e["frm0619E:txtTIN1"]).toBeTruthy();
    expect(e["frm0619E:txtTax14"]).toBeTruthy();
  });
  it("enforces legacy/revised years and completed quarterly periods", () => {
    expect(
      validateWithholding("1601C", { "frm1601c:txtYear": "2020" })[
        "frm1601c:txtYear"
      ],
    ).toBeTruthy();
    expect(
      validateWithholding(
        "1601FQ",
        { "frm1601FQ:txtYear": "2026", "frm1601FQ:optQuarter": "Q4" },
        new Date(2026, 10, 12),
      )["frm1601FQ:optQuarter"],
    ).toBeTruthy();
  });
  it("rejects a partially completed annual remittance row", () => {
    const e = validateWithholding("1604Ev2018", {
      "frm1604e:txtSched1TaxWithheld1": "1000",
    });
    expect(e["frm1604e:txtSched1RemDate1"]).toBeTruthy();
    expect(e["frm1604e:txtSched1BankCode1"]).toBeTruthy();
  });
  it("uses stable period keys without depending on current date", () => {
    expect(
      withholdingReturnPeriod("0619E", {
        "frm0619E:txtYear": "2025",
        "frm0619E:txtMonth": "02",
      }),
    ).toBe("202502");
    expect(
      withholdingReturnPeriod("1601FQ", {
        "frm1601FQ:txtYear": "2025",
        "frm1601FQ:optQuarter": "Q2",
      }),
    ).toBe("2025Q2");
  });
  it("initializes every field and gives every form unique renderable IDs", () => {
    expect(withholdingDefinitions).toHaveLength(22);
    for (const d of withholdingDefinitions) {
      const fields = withholdingFields(d);
      expect(new Set(fields.map((f) => f.id)).size, d.code).toBe(fields.length);
      const v = createWithholdingValues(d.code);
      expect(v[d.totalField], d.code).toBe("0.00");
      for (const f of fields) expect(v[f.id], f.id).toBeDefined();
    }
  });
});

describe("source field fidelity", () => {
  it("0605 has taxpayer classification without an agent-category field", () =>
    expect(
      withholdingFields(getWithholdingDefinition("0605")!).some(
        (f) => f.profileKey === "category",
      ),
    ).toBe(false));
  it("1603 requires the covered months and 1606 exposes ATC and installments", () => {
    const fringe = withholdingFields(getWithholdingDefinition("1603")!);
    expect(fringe.some((f) => f.id === "frm1603:monthsCovered")).toBe(true);
    const transfer = withholdingFields(getWithholdingDefinition("1606")!);
    expect(transfer.some((f) => f.id === "frm1606:atc")).toBe(true);
    expect(transfer.some((f) => f.id === "frm1606:txtAmount")).toBe(true);
  });
  it("compares complete valuation pairs rather than mixing land and improvement maxima", () => {
    const r = calculate("1606", {
      txtFMVLand: "1000",
      txtFMVImprovements: "100",
      txtFMVZonal: "900",
      txtFMVBIR: "150",
    });
    expect(r["frm1606:txtFMVLI"]).toBe("1100.00");
  });
});

describe("additional ATC rows", () => {
  it("calculates and validates rows beyond the initial form allocation", () => {
    const d = getWithholdingDefinition("1601E")!;
    const values = {
      ...createWithholdingValues("1601E"),
      [withholdingRowCountKey(d, "atc")]: "11",
      "frm1601E:optWithheld": "Y",
      "frm1601E:optCategory": "P",
      "frm1601E:txtAtcCode11": "WI120",
      "frm1601E:txtTaxBase11": "100000",
    };
    expect(
      withholdingSchedules(d, values).find((s) => s.id === "atc")!.rows,
    ).toHaveLength(11);
    expect(calculateWithholding("1601E", values)["frm1601E:txtTax14"]).toBe(
      "2000.00",
    );
    expect(
      validateWithholding("1601E", {
        ...values,
        "frm1601E:txtTaxBase11": "bad",
      })["frm1601E:txtTaxBase11"],
    ).toBeTruthy();
  });
});

describe("source rate selection and conditional validation", () => {
  it("allows PG ATCs for both categories on revised VAT withholding", () => {
    for (const optCategory of ["P", "G"])
      expect(
        total("1600VTv2018", {
          optCategory,
          optWithheld: "Y",
          txtAtcCode1: "WV110",
          txtTaxBase1: "100000",
        }),
      ).toBe("12000.00");
  });
  it("rejects impossible treaty percentages and simultaneous 0619F tax types", () => {
    expect(
      validateWithholding("1601FQ", { "frm1601FQ:treaty:1:rate": "101" })[
        "frm1601FQ:treaty:1:rate"
      ],
    ).toBeTruthy();
    expect(
      validateWithholding("0619F", {
        "frm0619F:txtTaxTypeCode": "WB",
        "frm0619F:txtTax14": "100",
      })["frm0619F:txtTax14"],
    ).toBeTruthy();
  });
  it("rejects malformed grouping in final-copy money values", () =>
    expect(
      validateWithholding("0619E", { "frm0619E:txtTax14": "1,,2" })[
        "frm0619E:txtTax14"
      ],
    ).toBeTruthy());
});

describe("source-specific validation boundaries", () => {
  it("uses the packaged FQ March exception and does not impose it on interest/fringe forms", () => {
    expect(
      validateWithholding(
        "1601FQ",
        { "frm1601FQ:txtYear": "2026", "frm1601FQ:optQuarter": "Q1" },
        new Date(2026, 2, 12),
      )["frm1601FQ:optQuarter"],
    ).toBeUndefined();
    expect(
      validateWithholding(
        "1602Qv2018",
        { "frm1602Q:txtYear": "2026", "frm1602Q:optQuarter": "Q4" },
        new Date(2026, 10, 12),
      )["frm1602Q:optQuarter"],
    ).toBeUndefined();
  });
  it("rejects unrecognised deposit-interest treaty/ATC codes", () => {
    const e = validateWithholding("1602Qv2018", {
      "frm1602Q:txtSched2TreatyCode1": "XX",
      "frm1602Q:txtSched2ATC1": "BOGUS",
      "frm1602Q:txtSched2Interest1": "100",
      "frm1602Q:txtSched2TaxRate1": "10",
    });
    expect(e["frm1602Q:txtSched2TreatyCode1"]).toBeTruthy();
    expect(e["frm1602Q:txtSched2ATC1"]).toBeTruthy();
  });
  it("requires refund amount and month for compensation annual refunds", () => {
    const e = validateWithholding("1604C", { "frm1604c:releasedOfFunds": "Y" });
    expect(e["frm1604c:txt12"]).toBeTruthy();
    expect(e["frm1604c:select13"]).toBeTruthy();
  });
  it("allows penalty-only annual remittance rows where no positive-tax rule exists", () => {
    const e = validateWithholding("1604C", {
      "frm1604c:txtSched1Date1": "2025-02-10",
      "frm1604c:txtSched1BankVal1": "bank",
      "frm1604c:txtTra1": "ref",
      "frm1604c:txtSched1Pen1": "50",
    });
    expect(e["frm1604c:txtSched1TaxWheld1"]).toBeUndefined();
  });
});

describe("necessary fields and remittance conditions", () => {
  it("does not add contact/ZIP fields or a duplicate classification to the property return", () => {
    const fields = withholdingFields(getWithholdingDefinition("1606")!);
    expect(
      fields.some(
        (f) =>
          f.profileKey === "zipCode" ||
          f.profileKey === "contactNumber" ||
          f.id === "frm1606:sellerClassification",
      ),
    ).toBe(false);
  });
  it("retains the legacy compensation current-year/year-end distinction without fixed six rows", () => {
    const d = getWithholdingDefinition("1601C")!;
    const schedule = d.schedules.find((s) => s.id === "adjustments")!;
    expect(schedule.rows).toHaveLength(3);
    expect(schedule.repeatable).toBe(true);
    expect(
      schedule.rows[0].fields.some(
        (f) => f.id === "frm1601c:sched1:periodType0",
      ),
    ).toBe(true);
  });
  it("rejects prior-return remittance without the amended flag while preserving drafts", () => {
    const values = { "frm0619E:optAmend": "N", "frm0619E:txtTax15": "100" };
    expect(
      validateWithholding("0619E", values)["frm0619E:txtTax15"],
    ).toBeTruthy();
    expect(calculateWithholding("0619E", values)["frm0619E:txtTax15"]).toBe(
      "100",
    );
  });
  it("requires investigating-office approval choice for assessed 0605 payment", () => {
    expect(
      validateWithholding("0605", {
        "frm0605:itemMannerOfPayment":
          "Preliminary/final assessment / deficiency",
      })["frm0605:itemApprovedYN"],
    ).toBeTruthy();
  });
});

describe("taxpayer-owned information", () => {
  it("prefills business and classification from the selected taxpayer", () => {
    const profile = {
      id: "1234567890000",
      tin1: "123",
      tin2: "456",
      tin3: "789",
      branchCode: "0000",
      rdoCode: "040",
      taxpayerName: "Example",
      address: "Test address",
      address2: "",
      zipCode: "1000",
      contactNumber: "1234567",
      category: "P",
      email: "test@example.com",
      lineOfBusiness: "Consultancy",
      taxpayerClassification: "I" as const,
    };
    const values = createWithholdingValues("0605", profile);
    expect(values["frm0605:txtLineBus"]).toBe("Consultancy");
    expect(values["frm0605:txtClassification"]).toBe("I");
    expect(
      withholdingFields(getWithholdingDefinition("0605")!).find(
        (f) => f.id === "frm0605:txtLineBus",
      )!.profileKey,
    ).toBe("lineOfBusiness");
  });
  it("initializes older profiles with empty strings for newly added information", () => {
    const profile = {
      id: "1234567890000",
      tin1: "123",
      tin2: "456",
      tin3: "789",
      branchCode: "0000",
      rdoCode: "040",
      taxpayerName: "Example",
      address: "Test address",
      address2: "",
      zipCode: "1000",
      contactNumber: "1234567",
      category: "P",
      email: "test@example.com",
    };
    const values = createWithholdingValues("0605", profile);
    expect(values["frm0605:txtLineBus"]).toBe("");
    expect(values["frm0605:txtClassification"]).toBe("");
  });
});

it("rejects entered withholding when the return says no tax was withheld", () => {
  expect(
    validateWithholding("0619E", {
      "frm0619E:optWithheld": "N",
      "frm0619E:txtTax14": "100",
    })["frm0619E:optWithheld"],
  ).toBeTruthy();
});

it("validates the packaged investment promotion agency codes", () => {
  expect(
    validateWithholding("1602Qv2018", { "frm1602Q:txtSched3IPA1": "UNKNOWN" })[
      "frm1602Q:txtSched3IPA1"
    ],
  ).toBeTruthy();
  expect(
    validateWithholding("1602Qv2018", { "frm1602Q:txtSched3IPA1": "PEZA" })[
      "frm1602Q:txtSched3IPA1"
    ],
  ).toBeUndefined();
});

describe("source-backed legacy schedule fields", () => {
  it("does not add receipt columns absent from legacy annual source schedules", () => {
    for (const code of ["1604CF", "1604E"]) {
      const source = JSON.parse(
        readFileSync(
          `docs/research/ebirforms-v7.9.6.0/evidence/${code}.json`,
          "utf8",
        ),
      );
      const sourceIds = source.controls.map(
        (control: { attributes: { id?: string } }) => control.attributes.id,
      );
      for (const field of withholdingFields(getWithholdingDefinition(code)!)) {
        if (/txtSched/.test(field.id))
          expect(sourceIds, field.id).toContain(field.id);
      }
      expect(
        withholdingFields(getWithholdingDefinition(code)!).some((f) =>
          /Reference/.test(f.id),
        ),
      ).toBe(false);
    }
    expect(
      withholdingFields(getWithholdingDefinition("1603")!).some((f) =>
        f.id.endsWith(":txtSheets"),
      ),
    ).toBe(false);
    expect(
      withholdingFields(getWithholdingDefinition("1604C")!).some((f) =>
        /txtTra1$/.test(f.id),
      ),
    ).toBe(true);
  });
  it("calculates special-law N/A rows only with the source relief flag", () => {
    for (const code of ["1600", "1601E"]) {
      const d = getWithholdingDefinition(code)!;
      const values = {
        ...createWithholdingValues(code),
        [d.prefix + "optRelief"]: "Y",
        [d.prefix + "txtAtcCode1"]: "N/A",
        [d.prefix + "txtTaxBase1"]: "10000",
        [d.prefix + "txtTaxRate1"]: "3.125",
        [d.prefix + "optWithheld"]: "Y",
      };
      expect(
        calculateWithholding(code, values)[d.prefix + "txtTaxbeWithHeld1"],
      ).toBe("312.50");
      expect(
        validateWithholding(code, values)[d.prefix + "txtTaxRate1"],
      ).toBeUndefined();
      expect(
        withholdingFields(d, values).find(
          (f) => f.id === d.prefix + "txtTaxRate1",
        )?.readonly,
      ).toBe(false);
      expect(
        validateWithholding(code, { ...values, [d.prefix + "optRelief"]: "N" })[
          d.prefix + "txtAtcCode1"
        ],
      ).toBeDefined();
    }
  });
});

describe("annual compensation adjustment totals", () => {
  it.each(["1604C", "1604CF"])(
    "sums all signed monthly adjustments for %s",
    (code) => {
      const d = getWithholdingDefinition(code)!;
      const values = {
        ...createWithholdingValues(code),
        [d.prefix + "txtSched1TaxWheld1"]: "1000",
        [d.prefix + "txtSched1Adj1"]: "1000",
        [d.prefix + "txtSched1Pen1"]: "10",
      };
      const first = calculateWithholding(code, values);
      expect(first[d.prefix + "txtSched1AdjTotal"]).toBe("1000.00");
      expect(first[d.prefix + "txtSched1TotalAmt1"]).toBe("2010.00");
      const result = calculateWithholding(code, {
        ...values,
        [d.prefix + "txtSched1Adj12"]: "-250.25",
      });
      expect(result[d.prefix + "txtSched1AdjTotal"]).toBe("749.75");
      expect(result[d.prefix + "txtSched1TaxWheldTotal"]).toBe("1000.00");
      expect(result[d.prefix + "txtSched1PenTotal"]).toBe("10.00");
      expect(result[d.prefix + "txtSched1Total"]).toBe("2010.00");
      const totals = d.schedules.find((s) => s.id === "remittances-1")!.totals!;
      expect(
        totals.find((f) => f.id === d.prefix + "txtSched1AdjTotal")?.readonly,
      ).toBe(true);
      expect(totals.at(-1)?.id).toBe(d.prefix + "txtSched1Total");
    },
  );
});

describe("1606 multiple-property declaration", () => {
  it("keeps original Item 18 optional and independent of habitual-selling status", () => {
    const code = "1606";
    const d = getWithholdingDefinition(code)!;
    const field = withholdingFields(d).find((f) => f.id === "frm1606:j_id394");
    expect(field).toBeDefined();
    expect(field?.required).not.toBe(true);
    expect(field?.options?.map((option) => option.value)).toEqual(["Y", "N"]);
    const initial = createWithholdingValues(code);
    expect(initial["frm1606:j_id394"]).toBe("");
    expect(
      validateWithholding(code, initial)["frm1606:j_id394"],
    ).toBeUndefined();
    for (const [multiple, habitual] of [
      ["Y", "N"],
      ["N", "Y"],
    ]) {
      const values = {
        ...initial,
        "frm1606:j_id394": multiple,
        "frm1606:Habitual": habitual,
      };
      const computed = calculateWithholding(code, values);
      expect(computed["frm1606:j_id394"]).toBe(multiple);
      expect(computed["frm1606:Habitual"]).toBe(habitual);
      expect(
        validateWithholding(code, values)["frm1606:j_id394"],
      ).toBeUndefined();
    }
    expect(
      validateWithholding(code, { ...initial, "frm1606:j_id394": "unknown" })[
        "frm1606:j_id394"
      ],
    ).toBeDefined();
  });
});
