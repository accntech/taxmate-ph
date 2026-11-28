import { describe, expect, it } from "vitest";
import { annualFieldApplies, calculateAnnual, validateAnnual } from "../../../lib/forms/individual-income/annual";
import { getReturnExportValues, validateReturnValues } from "../../../lib/forms/form-runtime";
import { getIndividualIncomeForm } from "../../../lib/forms/individual-income";
import { incomeEditorFields } from "../../../lib/forms/individual-income/editor-layout";
import { validate1701ScheduleRow } from "../../../lib/forms/individual-income/annual-1701-schedule-validation";

const p = "frm1701:";
const values = (fields: Record<string, string>) =>
  Object.fromEntries(Object.entries(fields).map(([name, value]) => [p + name, value]));

describe("Legacy individual return page counts", () => {
  const compensationCount = "frm1700:txtPg1Pt2NumberofPagesFiled";
  const annualCount = p + "txtPg1Pt2I33PagesFilled";

  it("calculates four pages for 1700 even with an invalid saved count", () => {
    const draft = { [compensationCount]: "invalid" };
    expect(getReturnExportValues("1700", draft)[compensationCount]).toBe("4");
    expect(validateReturnValues("1700", draft)[compensationCount]).toBeUndefined();
  });

  it("counts the five activity pages only when applicable to 1701", () => {
    const draft = values({ txtPg1Pt2I33PagesFilled: "99", rdoPg4Pt7I107YesNo: "Yes" });
    expect(getReturnExportValues("1701", draft)[annualCount]).toBe("12");
    expect(getReturnExportValues("1701", { ...draft, [p + "rdoPg1Pt1I16FilingStatus"]: "Joint" })[annualCount]).toBe("17");
    expect(getReturnExportValues("1701", { ...draft, [p + "rdoPg1Pt1I22IncomeExempt"]: "Yes" })[annualCount]).toBe("17");
  });
});

describe("Form 1701 filing transitions", () => {
  it("clears a January refund when Item 26 stops being negative and requires a fresh choice when it returns", () => {
    const code = "1701v2018";
    const choice = p + "rdoPg1Overpayment";
    const credit = p + "txtPg4IPart7_1A";
    const paid = values({ txtPg4IPart7_1A: "500", rdoPg1Overpayment: "Refund" });
    expect(getReturnExportValues(code, paid)[choice]).toBe("Refund");
    const cleared = calculateAnnual(code, { ...paid, [credit]: "0" });
    expect(cleared[choice]).toBe("");
    expect(annualFieldApplies(code, choice, cleared)).toBe(false);
    expect(getReturnExportValues(code, { ...cleared, [choice]: "Refund" })).not.toHaveProperty(choice);
    const overpaidAgain = { ...cleared, [credit]: "500" };
    expect(validateAnnual(code, overpaidAgain)[choice]).toBeTruthy();
    expect(calculateAnnual(code, overpaidAgain)[choice]).toBe("");
  });

  it("enables a joint January disposition for a spouse's negative Item 26 even when Item 32 is positive", () => {
    const code = "1701v2018";
    const choice = p + "rdoPg1Overpayment";
    const draft = values({
      rdoPg1I16CivilStatus: "Married", rdoPg1I17SpouseIncome: "Yes", rdoPg1I18FilingStatus: "Joint",
      txtPg4IPart7_1B: "500", txtPg1I27A: "800",
    });
    const joint = calculateAnnual(code, draft);
    expect(joint[p + "txtPg1I26B"]).toBe("-500.00");
    expect(joint[p + "txtPg1I32AggregateAmtPyble"]).toBe("300.00");
    expect(annualFieldApplies(code, choice, joint)).toBe(true);
    expect(validateAnnual(code, draft)[choice]).toBeUndefined();
    expect(getReturnExportValues(code, { ...draft, [choice]: "TCC" })[choice]).toBe("TCC");
    const separate = calculateAnnual(code, { ...draft, [p + "rdoPg1I18FilingStatus"]: "Separate", [choice]: "TCC" });
    expect(annualFieldApplies(code, choice, separate)).toBe(false);
    expect(separate[choice]).toBe("");
  });

  it.each(["txtPg3Pt5I79LessPortion", "txtPg1Pt2I29PortionTax"])(
    "reports an excess installment from %s at the editable Item 79",
    (field) => {
      const draft = values({ txtPg1I1Year: "2017", [field]: "12500" });
      const errors = validateAnnual("1701", draft);
      expect(errors[p + "txtPg3Pt5I79LessPortion"]).toBe("Deferred tax cannot exceed 50% of Item 26.");
      expect(errors[p + "txtPg1Pt2I29PortionTax"]).toBeUndefined();
      expect(Number(calculateAnnual("1701", draft)[p + "txtPg1Pt2I29PortionTax"])).toBe(12500);
    },
  );

  it("uses the calculated current-year loss when validating an application", () => {
    const code = "1701v2018";
    const scheduleFields = incomeEditorFields(getIndividualIncomeForm(code)!)
      .filter(field => field.id.startsWith(p + "txtPg3IShed6_7"));
    const draft = values({
      txtPg1I1Year: "2025",
      txtPg2IShed3_8A: "900",
      txtPg3IShed4_1A: "1500",
      txtPg3IShed6_7A: "1200",
      txtPg3IShed6_7D: "700",
    });
    expect(validate1701ScheduleRow({
      code, fields: scheduleFields, scheduleFields, values: draft, calculated: calculateAnnual(code, draft), adding: false,
    })).toEqual(values({
      txtPg3IShed6_7D: "Applied and expired amounts together cannot exceed the net operating loss.",
    }));
  });

  it("exports January operating losses separately for each filer and retains sparse draft amounts", () => {
    const joint = values({
      rdoPg1I16CivilStatus: "Married",
      rdoPg1I17SpouseIncome: "Yes",
      rdoPg1I18FilingStatus: "Joint",
      rdoPg1I7ATC: "II012",
      rdoPg2I4ATC: "II012",
      txtPg2IShed3_8A: "1000",
      txtPg2IShed3_9A: "100",
      txtPg3IShed4_1A: "1500",
      txtPg2IShed3_8B: "1200",
      txtPg3IShed4_1B: "1000",
      txtPg3IShed6_7D: "100",
    });
    const exported = getReturnExportValues("1701v2018", joint);
    expect(exported).toMatchObject(values({
      txtPg3IShed6_1A: "900.00",
      txtPg3IShed6_2A: "1500.00",
      txtPg3IShed6_3A: "-600.00",
      txtPg3IShed6_7A: "600.00",
      txtPg3IShed6_7E: "500.00",
      txtPg3IShed6_8D: "100.00",
      txtPg3IShed6_3B: "200.00",
      txtPg4IShed6_12A: "0.00",
    }));

    const sparse = calculateAnnual("1701v2018", values({ txtPg3IShed6_7A: "250" }));
    expect(sparse[p + "txtPg3IShed6_7A"]).toBe("250");
    expect(sparse[p + "txtPg3IShed6_7E"]).toBe("250.00");
  });

  it("exports only the active identification fields and an applicable overpayment choice", () => {
    const data = values({
      rdoPg1I34CTCGovID: p + "rdoPg1I34GovID", txtPg1Pt2I34CTC: "ID00012",
      txtPg1Pt2I35Month: "02/29/2016", txtPg1Pt2I36PlaceOfIssue: "MAKATI",
      txtPg1Pt2I37AmountIfCTC: "125.50", rdoPg1Pt2Overpayment: p + "rdoPg1Pt2OverpaymentRefunded"
    });
    const original = getReturnExportValues("1701", data);
    expect(original[p + "txtPg1Pt2I34CTC"]).toBe("ID00012");
    expect(original).not.toHaveProperty(p + "txtPg1Pt2I37AmountIfCTC");
    expect(original).not.toHaveProperty(p + "rdoPg1Pt2Overpayment");
    const overpaid = getReturnExportValues("1701", { ...data, ...values({
      rdoPg1I34CTCGovID: p + "rdoPg1I34CTC", txtPg1Pt2I34CTC: "00123456", txtPg9Sc9I1TaxPayerC1: "500"
    }) });
    expect(overpaid[p + "txtPg1Pt2I37AmountIfCTC"]).toBe("126");
    expect(overpaid[p + "rdoPg1Pt2Overpayment"]).toBe(p + "rdoPg1Pt2OverpaymentRefunded");
  });

  it("requires the legacy filing choice only when a married taxpayer has an earning spouse", () => {
    const married = values({ rdoPg1Pt1I14Status: "Married" });
    expect(validateAnnual("1701", married)[p + "rdoPg1Pt1I15Income"]).toBeTruthy();
    const withIncome = { ...married, [p + "rdoPg1Pt1I15Income"]: "WithIncome" };
    expect(validateAnnual("1701", withIncome)[p + "rdoPg1Pt1I16FilingStatus"]).toBeTruthy();
    const joint = { ...withIncome, [p + "rdoPg1Pt1I16FilingStatus"]: "Joint" };
    expect(validateAnnual("1701", joint)[p + "txtPg4Pt7I95SpouseTIN1"]).toBeTruthy();
    expect(validateAnnual("1701", joint)[p + "txtPg4Pt7I97SpouseName"]).toBeTruthy();

    const withoutIncome = { ...joint, [p + "rdoPg1Pt1I15Income"]: "WithNoIncome" };
    expect(validateAnnual("1701", withoutIncome)[p + "rdoPg1Pt1I16FilingStatus"]).toBeUndefined();
    expect(validateAnnual("1701", withoutIncome)[p + "txtPg4Pt7I95SpouseTIN1"]).toBeUndefined();
  });

  it("reconciles all nine legacy Schedule 9 rows and excludes a prior payment on an original return", () => {
    const draft = values({
      rdoPg1I2Ammend: "Yes",
      txtPg9Sc9I6TaxPayerC1: "1200",
      txtPg9Sc9I9TaxPayerC1: "150",
    });
    const amended = calculateAnnual("1701", draft);
    expect(amended[p + "txtPg9Sc9I10TaxPayerC1"]).toBe("1350.00");
    expect(amended[p + "txtPg1Pt2I27LessTotalTax"]).toBe("1350.00");

    const original = { ...draft, [p + "rdoPg1I2Ammend"]: "No" };
    const calculated = calculateAnnual("1701", original);
    expect(calculated[p + "txtPg9Sc9I10TaxPayerC1"]).toBe("150.00");
    expect(calculated[p + "txtPg1Pt2I27LessTotalTax"]).toBe("150.00");
    expect(calculated[p + "txtPg9Sc9I6TaxPayerC1"]).toBe("1200");
    expect(getReturnExportValues("1701", original)).not.toHaveProperty(p + "txtPg9Sc9I6TaxPayerC1");
  });

  it("uses the sole legacy earner and keeps a joint employer unassigned until chosen", () => {
    const draft = values({
      rdoPg1Pt1I4ATC: "Mixed",
      rdoPg1Pt1I7Type: "Single",
      txtPg5Sc1I1ComIncomeC2: "500000",
      txtPg5Sc1I1TaxWithheldC3: "80000",
    });
    const single = calculateAnnual("1701", draft);
    expect(single[p + "txtPg5Sc1I5ATotalComIncome"]).toBe("500000.00");
    expect(single[p + "txtPg2Pt4I41GrossCompensationC1"]).toBe("500000.00");
    expect(single[p + "txtPg1Pt2I32TotalUponFiling"]).toBe("30000.00");
    expect(getReturnExportValues("1701", draft)[p + "rdoPg5Sc1I1TaxpayerSpouse"]).toBe("1");

    const joint = {
      ...draft,
      ...values({ rdoPg1Pt1I14Status: "Married", rdoPg1Pt1I15Income: "WithIncome", rdoPg1Pt1I16FilingStatus: "Joint" }),
    };
    expect(validateAnnual("1701", joint)[p + "rdoPg5Sc1I1TaxpayerSpouse"]).toMatch(/select/i);
    const spouse = calculateAnnual("1701", { ...joint, [p + "rdoPg5Sc1I1TaxpayerSpouse"]: "2" });
    expect(spouse[p + "txtPg5Sc1I5BTotalComIncome"]).toBe("500000.00");
    expect(spouse[p + "txtPg5Sc1I5ATotalComIncome"]).toBe("0.00");
  });

  it("excludes retained revised credits and special tax when the elections turn off", () => {
    const draft = values({
      txtPg1I1Year: "2025",
      rdoPg1I2Amended: "Yes",
      rdoPg1I13ForeignTaxCredits: "Yes",
      rdoPg1I19IncomeExempt: "No",
      rdoPg1I20IncomeSpecial: "Yes",
      txtPg4IPart7_6A: "1200",
      txtPg4IPart7_7A: "600",
      txtPg4IPart7_8A: "300",
      txtPg4ISc6_2A: "2200",
      txtPg4ISc6_3A: "200",
      txtPg4IPart8_1A: "2000",
    });
    const optedIn = calculateAnnual("1701v2018", draft);
    expect(optedIn[p + "txtPg4IPart7_10A"]).toBe("2100.00");
    expect(optedIn[p + "txtPg1I22ATaxDue"]).toBe("2000.00");

    const original = {
      ...draft,
      ...values({ rdoPg1I2Amended: "No", rdoPg1I13ForeignTaxCredits: "No", rdoPg1I20IncomeSpecial: "No" }),
    };
    const calculated = calculateAnnual("1701v2018", original);
    expect(calculated[p + "txtPg4IPart7_6A"]).toBe("1200");
    expect(calculated[p + "txtPg4IPart7_10A"]).toBe("0.00");
    expect(calculated[p + "txtPg4IPart8_7A"]).toBe("0.00");
    expect(calculated[p + "txtPg1I22ATaxDue"]).toBe("0.00");
    const print = getReturnExportValues("1701v2018", original);
    for (const field of ["txtPg4IPart7_6A", "txtPg4IPart7_7A", "txtPg4IPart7_8A", "txtPg4ISc6_2A", "txtPg4IPart8_1A"])
      expect(print).not.toHaveProperty(p + field);
  });

  it("derives the revised rate from the ATC and excludes inactive compensation and deduction amounts", () => {
    const draft = values({
      txtPg1I1Year: "2025",
      rdoPg1I7ATC: "II015",
      rdoPg1I21TaxRate: "Graduated",
      rdoPg1I21AMethodDeduction: "OSD",
      txtPg2IShed2_4A: "500000",
      txtPg2IShed3_8A: "1000000",
      txtPg3IShed5_1Amt: "250",
      txtPg3IShed3_26A: "1000000",
      txtPg3IShed3_29A: "250000",
      txtPg4IPart7_5A: "20000",
    });
    const eightPercent = calculateAnnual("1701v2018", draft);
    expect(eightPercent[p + "rdoPg1I21TaxRate"]).toBe("Percentage");
    expect(eightPercent[p + "txtPg1I22ATaxDue"]).toBe("60000.00");
    expect(eightPercent[p + "txtPg2IShed2_4A"]).toBe("500000");
    const print = getReturnExportValues("1701v2018", draft);
    expect(print).not.toHaveProperty(p + "txtPg2IShed3_8A");
    expect(print).not.toHaveProperty(p + "rdoPg1I21AMethodDeduction");
    expect(print).not.toHaveProperty(p + "txtPg4IPart7_5A");
    expect(print).not.toHaveProperty(p + "txtPg3IShed5_1Amt");
    expect(validateAnnual("1701v2018", draft)[p + "txtPg3IShed5_1Desc"]).toBeUndefined();

    const graduated = { ...draft, ...values({ rdoPg1I7ATC: "II012", rdoPg1I21TaxRate: "Percentage", txtPg3IShed3_29A: "250001" }) };
    expect(calculateAnnual("1701v2018", graduated)[p + "txtPg1I22ATaxDue"]).toBe("62500.00");
    expect(validateAnnual("1701v2018", graduated)[p + "txtPg3IShed3_29A"]).toBeUndefined();

    const mixed = { ...draft, ...values({ rdoPg1I7ATC: "II016" }) };
    expect(calculateAnnual("1701v2018", mixed)[p + "txtPg1I22ATaxDue"]).toBe("122500.00");
    expect(getReturnExportValues("1701v2018", mixed)).not.toHaveProperty(p + "txtPg3IShed3_29A");
  });
});
