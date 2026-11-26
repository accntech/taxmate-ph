import { describe, expect, it } from "vitest";
import { calculateMixed } from "../../../lib/forms/corporate-income/mixed";

const p = "frm1702MX:";
const values = (fields: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(fields).map(([key, value]) => [p + key, value]),
  );

describe("mixed corporate income revisions", () => {
  it("computes CREATE sales, OSD, entered rate, manual MCIT and credits", () => {
    const result = calculateMixed(
      "1702MXv2018C",
      values({
        rdoPg1Pt1I13MethodOfDeduc: "O",
        chkPg1I5ATCR1: "Y",
        txtPg2Sc2Itm1C: "1000000",
        txtPg2Sc2Itm2C: "50000",
        txtPg2Sc2Itm4C: "350000",
        txtPg2Sc2It14C: "25",
        txtPg2Sc2It18C: "5000",
        txtPg2Sc3It24C: "20000",
        txtPg1Pt2I17: "1000",
      }),
    );
    expect(result).toMatchObject(
      values({
        txtPg2Sc2Itm7C: "600000",
        txtPg2Sc2It12C: "240000",
        txtPg2Sc2It13C: "360000",
        txtPg2Sc2It15C: "90000",
        txtPg2Sc2It18C: "5000",
        txtPg1Pt2I21TotalAmount: "71000",
      }),
    );
  });
  it("preserves the revised special-rate base change between 2018 and CREATE", () => {
    const input = values({
      txtPg2Sc2Itm1B: "1000000",
      txtPg2Sc2Itm4B: "400000",
      txtPg3Sc5Itm1B: "100000",
      txtPg2Sc2It14B: "10",
    });
    expect(calculateMixed("1702MXv2018", input)[p + "txtPg2Sc2It15B"]).toBe(
      "50000",
    );
    expect(calculateMixed("1702MXv2018C", input)[p + "txtPg2Sc2It15B"]).toBe(
      "100000",
    );
  });
  it("retains a negative overpayment while charging entered penalties separately", () => {
    const result = calculateMixed(
      "1702MXv2018C",
      values({ txtPg2Sc3It24C: "10000", txtPg1Pt2I17: "500" }),
    );
    expect(result[p + "txtPg1Pt2I16NetTaxPayable"]).toBe("-10000");
    expect(result[p + "txtPg1Pt2I21TotalAmount"]).toBe("500");
  });
  it("selects legacy MCIT over regular liability and aggregates special tax", () => {
    const result = calculateMixed(
      "1702MX",
      values({
        chkPg1I5ATCR1: "Y",
        txtPg4Sc3I1CC: "1000000",
        txtPg5Sc5I1CC: "990000",
        txtPg4Sc3I1CB: "500000",
        txtPg5Sc5I1CB: "100000",
        drpPg3Sc1I11CB: "0.10",
      }),
    );
    expect(result[p + "txtPg3Sc1I12CC"]).toBe("3000");
    expect(result[p + "txtPg3Sc1I15CC"]).toBe("20000");
    expect(result[p + "txtPg1Pt2I20TotalAmount"]).toBe("60000");
  });
});

it("aggregates active special activities and excludes a removed saved activity", () => {
  const input = values({
    rdoPg2I1: "F",
    totalSPAttach: "2",
    totalEXAttach: "0",
    txtPg1SP1ScBI1: "1000000",
    txtPg1SP1ScBI4: "200000",
    txtPg1SP1ScBI13: "5",
    txtPg1SP2ScBI1: "500000",
    txtPg1SP2ScBI4: "100000",
    txtPg1SP2ScBI13: "10",
  });
  const both = calculateMixed("1702MXv2018C", input);
  expect(both[p + "txtPg2Sc2Itm1B"]).toBe("1500000");
  expect(both[p + "txtPg2Sc2It15B"]).toBe("80000");
  const removed = calculateMixed("1702MXv2018C", {
    ...both,
    [p + "totalSPAttach"]: "1",
  });
  expect(removed[p + "txtPg2Sc2Itm1B"]).toBe("1000000");
  expect(removed[p + "txtPg2Sc2It15B"]).toBe("40000");
});

it("rejects NOLCO applications exceeding the loss and requires an activity when selected", async () => {
  const { validateMixed } =
    await import("../../../lib/forms/corporate-income/mixed");
  const draft = values({
    rdoPg2I1: "F",
    totalEXAttach: "0",
    totalSPAttach: "0",
    txtPg3IShed7_4A: "1000",
    txtPg3IShed7_4B: "100",
    txtPg3IShed7_4C: "200",
    txtPg3IShed7_4D: "800",
  });
  expect(validateMixed("1702MXv2018C", draft)).toMatchObject(
    values({
      totalEXAttach: "Add at least one exempt or special-rate activity.",
      txtPg3IShed7_4D:
        "Applied and expired amounts together cannot exceed the available loss.",
    }),
  );
});

it("computes the original 2018 tax relief using the entered regular rate", () => {
  const result = calculateMixed(
    "1702MXv2018",
    values({
      txtPg2Sc2Itm1A: "100000",
      txtPg2Sc2It14C: "30",
      txtPg6Sc6I1CA: "10000",
    }),
  );
  expect(result[p + "txtPg3Sc4Itm1A"]).toBe("27000");
  expect(result[p + "txtPg2Sc4Itm2A"]).toBe("3000");
});

it("requires the activity registration and relief dates for a populated special activity", async () => {
  const { validateMixed } =
    await import("../../../lib/forms/corporate-income/mixed");
  const draft = calculateMixed(
    "1702MXv2018C",
    values({
      rdoPg2I1: "F",
      totalSPAttach: "1",
      txtPg1SP1ScBI1: "1000",
      txtPg1SP1ScBI13: "5",
    }),
  );
  expect(validateMixed("1702MXv2018C", draft)).toMatchObject(
    values({
      txtPg1SP1ScAI1:
        "Enter the investment promotion agency or implementing entity for this activity.",
      txtPg1SP1ScAI2: "Enter the legal basis for this activity.",
      txtPg1SP1ScAI3: "Enter the registered activity or program.",
      txtPg1SP1Pt5ScAIt5: "Enter the effectivity date of the tax relief.",
      txtPg1SP1Pt5ScAIt6: "Enter the expiration date of the tax relief.",
    }),
  );
});

it("keeps profitable activities out of the operating-loss schedule", () => {
  const draft = calculateMixed(
    "1702MXv2018C",
    values({
      rdoPg2I1: "F",
      totalSPAttach: "1",
      txtPg1SP1ScBI1: "1000",
      txtPg1SP1ScBI13: "5",
    }),
  );
  expect(draft[p + "txtPg2SP1ScFI3"]).toBe("0");
});

it("sums the three tax-regime amounts for each legacy other income row", () => {
  const result = calculateMixed("1702MX", values({
    txtPg5Sc4I1CA: "10000",
    txtPg5Sc4I1CB: "20000",
    txtPg5Sc4I1CC: "30000",
    txtPg5Sc4I2CA: "500",
    txtPg5Sc4I2CC: "250",
    txtCtrmodalPg5Sc4I3: "1",
    txtPg5Sc4I3_1Col1: "Other receipt",
    txtPg5Sc4I3_1Col3: "1250",
  }));
  expect(result).toMatchObject(values({
    txtPg5Sc4I1CD: "60000",
    txtPg5Sc4I2CD: "750",
    txtPg5Sc4I3CD: "1250",
    txtPg5Sc4I4CD: "62000",
  }));
});

it("rolls source-named legacy modal details into other taxable income", () => {
  const draft = calculateMixed(
    "1702MX",
    values({
      txtCtrmodalPg5Sc4I3: "2",
      txtPg5Sc4I3_1Col1: "Rental",
      txtPg5Sc4I3_1Col4: "10000",
      txtPg5Sc4I3_2Col1: "Interest",
      txtPg5Sc4I3_2Col4: "20000",
    }),
  );
  expect(draft[p + "txtPg5Sc4I3CC"]).toBe("30000");
  expect(draft[p + "txtPg3Sc1I4CC"]).toBe("30000");
  expect(draft[p + "txtPg1Pt2I16TotalIncome"]).toBe("9000");
});

it("retains source-named per-activity extra deductions and excludes removed detail rows", async () => {
  const valuesWithDetails = values({
    rdoPg2I1: "F",
    totalSPAttach: "1",
    txtSP1CtrPg2MScDI17i: "2",
    txtPg1SP1ScBI1: "1000000",
    txtPg1SP1ScBI13: "10",
    txtPg2SP1ScDI17i_1Col1: "Fees",
    txtPg2SP1ScDI17i_1Col2: "10000",
    txtPg2SP1ScDI17i_2Col1: "Charges",
    txtPg2SP1ScDI17i_2Col2: "20000",
  });
  const result = calculateMixed("1702MXv2018C", valuesWithDetails);
  expect(result[p + "txtPg1SP1ScBI8"]).toBe("30000");
  expect(result[p + "txtPg1SP1ScBI14"]).toBe("97000");
  const reduced = calculateMixed("1702MXv2018C", {
    ...result,
    [p + "txtSP1CtrPg2MScDI17i"]: "1",
  });
  expect(reduced[p + "txtPg1SP1ScBI8"]).toBe("10000");
  const { getCorporateIncomeForm, corporateEditorPages } =
    await import("../../../lib/forms/corporate-income");
  const pages = corporateEditorPages(
    getCorporateIncomeForm("1702MXv2018C")!,
    result,
  );
  expect(
    pages
      .flatMap((page) =>
        page.sections.flatMap((section) =>
          section.rows.flatMap((row) => row.fields),
        ),
      )
      .some((field) => field.id === p + "txtPg2SP1ScDI17i_2Col2"),
  ).toBe(true);
});

it("uses the exact regular and special NOLCO IDs in revised tax computation", () => {
  const result = calculateMixed(
    "1702MXv2018C",
    values({
      txtPg2Sc2Itm1C: "1000000",
      txtPg2Sc2It14C: "25",
      txtPg3IShed7_4A: "100000",
      txtPg3IShed7_4D: "100000",
      txtPg2Sc2Itm1B: "500000",
      txtPg2Sc2It14B: "10",
      txtPg4IShed8_4A: "50000",
      txtPg4IShed8_4D: "50000",
    }),
  );
  expect(result[p + "txtPg2Sc2It10C"]).toBe("100000");
  expect(result[p + "txtPg2Sc2It13C"]).toBe("900000");
  expect(result[p + "txtPg3IShed88D"]).toBe("50000");
  expect(result[p + "txtPg4IShed8_4E"]).toBe("0");
});

it("removes the last detailed entry from its source subtotal", () => {
  const before = calculateMixed(
    "1702MX",
    values({
      txtCtrmodalPg5Sc4I3: "1",
      txtPg5Sc4I3_1Col1: "Income",
      txtPg5Sc4I3_1Col4: "1000",
    }),
  );
  const after = calculateMixed("1702MX", {
    ...before,
    [p + "txtCtrmodalPg5Sc4I3"]: "0",
  });
  expect(after[p + "txtPg5Sc4I3CC"]).toBe("0");
  expect(after[p + "txtPg1Pt2I16TotalIncome"]).toBe("0");
});

it("computes guarded excess MCIT carryovers and their remaining balance", () => {
  const result = calculateMixed(
    "1702MXv2018C",
    values({
      txtPg7Sc9I1CA: "4000",
      txtPg7Sc9I1CB: "10000",
      txtPg7Sc9I1CD: "1000",
      txtPg7Sc9I1CE: "1000",
      txtPg7Sc9I1CF: "2000",
      txtPg7Sc9I2CA: "5000",
      txtPg7Sc9I2CB: "3000",
    }),
  );
  expect(result[p + "txtPg7Sc9I1CC"]).toBe("6000");
  expect(result[p + "txtPg7Sc9I1CG"]).toBe("2000");
  expect(result[p + "txtPg7Sc9I2CC"]).toBe("0");
  expect(result[p + "txtPg2Sc3It23C"]).toBe("2000");
});

describe("June 2013 special-rate eligibility", () => {
  const input = values({
    txtPg4Sc3I1CB: "1000000",
    txtPg5Sc5I1CB: "400000",
    txtPg2Pt4I31CB: "PEZA",
    txtPg2Pt4I34SpecialTaxRate: "5",
    drpPg3Sc1I11CB: "0.05",
  });
  it("uses gross income only when the source five-percent relief conditions apply", () => {
    expect(calculateMixed("1702MX", input)[p + "txtPg3Sc1I12CB"]).toBe("50000");
    expect(
      calculateMixed("1702MX", {
        ...input,
        [p + "txtPg2Pt4I31CB"]: "",
      })[p + "txtPg3Sc1I12CB"],
    ).toBe("30000");
  });
  it("recognizes the source legal basis even when the IPA name is blank", () => {
    const result = calculateMixed("1702MX", {
      ...input,
      [p + "txtPg2Pt4I31CB"]: "",
      [p + "txtPg2Pt4I32CB"]: "R.A. 7916",
      [p + "drpPg3Sc1I11CB"]: "0.1",
    });
    expect(result[p + "drpPg3Sc1I11CB"]).toBe("0.05");
    expect(result[p + "txtPg3Sc1I12CB"]).toBe("50000");
  });
  it("selects thirty-percent net tax for IC030 when regular sales exceed fifty percent and yield higher special tax", () => {
    const result = calculateMixed("1702MX", {
      ...input,
      [p + "chkPg1I5ATCR2"]: "Y",
      [p + "drpPg1I5ATCR2"]: "IC030",
      [p + "txtPg4Sc3I1CC"]: "2000000",
    });
    expect(result[p + "drpPg3Sc1I11CB"]).toBe("0.3");
    expect(result[p + "txtPg3Sc1I12CB"]).toBe("180000");
  });
  it("retains five-percent gross tax for IC031 when it exceeds the thirty-percent net tax comparison", () => {
    const result = calculateMixed("1702MX", {
      ...input,
      [p + "chkPg1I5ATCR2"]: "Y",
      [p + "drpPg1I5ATCR2"]: "IC031",
      [p + "txtPg4Sc3I1CC"]: "2000000",
      [p + "txtPg5Sc5I1CB"]: "980000",
    });
    expect(result[p + "drpPg3Sc1I11CB"]).toBe("0.05");
    expect(result[p + "txtPg3Sc1I12CB"]).toBe("50000");
  });
});

it('preserves legacy SEC identification and clears stale CTC amounts on export', async () => {
  const { getReturnExportValues, validateReturnValues } = await import('$lib/forms/form-runtime');
  const draft = values({
    rdoPg1Pt2I22: 'SEC', txtPg1Pt2I22: 'CS-00123', txtPg1Pt2I23Date: '02/29/2000',
    txtPg1Pt2I24PlaceofIssue: 'Example City', txtPg1Pt2I25AmountCTC: '925'
  });
  expect(getReturnExportValues('1702MX', draft)).toMatchObject({ ...draft, [p + 'txtPg1Pt2I25AmountCTC']: '0' });
  const errors = validateReturnValues('1702MX', draft);
  expect(errors).not.toHaveProperty(p + 'txtPg1Pt2I22');
  expect(errors).not.toHaveProperty(p + 'txtPg1Pt2I23Date');
  expect(validateReturnValues('1702MX', { ...draft, [p + 'txtPg1Pt2I23Date']: '02/29/2001' }))
    .toHaveProperty(p + 'txtPg1Pt2I23Date');
});
