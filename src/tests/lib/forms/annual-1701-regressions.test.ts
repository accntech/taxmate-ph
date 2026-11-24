import { describe, expect, it } from "vitest";
import { calculateAnnual, validateAnnual } from "../../../lib/forms/individual-income/annual";
import { getReturnExportValues } from "../../../lib/forms/form-runtime";

const p = "frm1701:";
const values = (fields: Record<string, string>) =>
  Object.fromEntries(Object.entries(fields).map(([name, value]) => [p + name, value]));

describe("Form 1701 filing transitions", () => {
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
    expect(overpaid[p + "txtPg1Pt2I37AmountIfCTC"]).toBe("125.50");
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
