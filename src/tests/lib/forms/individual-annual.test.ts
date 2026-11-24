import { describe, expect, it } from "vitest";

import * as annual from "../../../lib/forms/individual-income/annual";
import {
  calculate1701A,
  calculate1701MS,
  validate1701A,
  validate1701MS,
} from "../../../lib/forms/individual-income/annual-short";
const p = "frm1701:";
const revised = (year: string) => ({
  [p + "txtPg1I1Year"]: year,
  [p + "rdoPg1I21TaxRate"]: "Graduated",
  [p + "rdoPg1I21AMethodDeduction"]: "OSD",
  [p + "txtPg2IShed3_8A"]: "1666666.67",
});

describe("individual annual income computations", () => {
  it("uses the 2018 and 2023 graduated tables independently", () => {
    expect(
      annual.calculateAnnual("1701v2018", revised("2022"))[
        p + "txtPg1I22ATaxDue"
      ],
    ).toBe("190000.00");
    expect(
      annual.calculateAnnual("1701v2018", revised("2023"))[
        p + "txtPg1I22ATaxDue"
      ],
    ).toBe("152500.00");
  });
  it("uses net sales for OSD and combines compensation income", () => {
    const values = {
      ...revised("2025"),
      [p + "txtPg2IShed3_8A"]: "1200000",
      [p + "txtPg2IShed3_9A"]: "200000",
      [p + "txtPg2IShed3_11A"]: "300000",
      [p + "txtPg2IShed2_4A"]: "500000",
      [p + "txtPg2IShed2_5A"]: "100000",
    };
    const result = annual.calculateAnnual("1701v2018", values);
    expect(result[p + "txtPg2IShed3_17A"]).toBe("400000.00");
    expect(result[p + "txtPg2IShed3_24A"]).toBe("1000000.00");
    expect(result[p + "txtPg1I22ATaxDue"]).toBe("152500.00");
    expect(Object.hasOwn(values, p + "txtPg2IShed3_17A")).toBe(false);
  });
  it("clears eight percent tax at zero income after credits and aggregates spouses", () => {
    const result = annual.calculateAnnual("1701v2018", {
      [p + "txtPg1I1Year"]: "2025",
      [p + "rdoPg1I21TaxRate"]: "Percentage",
      [p + "txtPg3IShed3_26A"]: "250000",
      [p + "txtPg3IShed3_29A"]: "250000",
      [p + "txtPg3IShed3_31A"]: "1000",
      [p + "txtPg4IPart7_1A"]: "500",
      [p + "txtPg1I27A"]: "50",
    });
    expect(result[p + "txtPg3IShed3_31A"]).toBe("0.00");
    expect(result[p + "txtPg1I32AggregateAmtPyble"]).toBe("50.00");
  });
  it("retains the legacy rate and excludes business losses from compensation", () => {
    const result = annual.calculateAnnual("1701", {
      [p + "rdoPg1Pt1I20Deduction"]: "Itemized",
      [p + "txtPg2Pt4I41GrossCompensationC1"]: "1000000",
      [p + "txtPg2Pt4I50NetSalesC1"]: "100",
      [p + "txtPg2Pt4I57OrdinaryC1"]: "1000",
    });
    expect(result[p + "txtPg2Pt4I62TaxableIncomeC1"]).toBe("-900.00");
    expect(result[p + "txtPg1Pt2I26IncomeTax"]).toBe("285000.00");
  });
  it("rejects excessive deferral and eight percent deduction", () => {
    const errors = annual.validateAnnual("1701v2018", {
      ...revised("2025"),
      [p + "rdoPg1I21TaxRate"]: "Percentage",
      [p + "txtPg1I25A"]: "100000",
      [p + "txtPg3IShed3_29A"]: "250001",
    });
    expect(errors[p + "txtPg1I25A"]).toMatch(/50%/);
    expect(errors[p + "txtPg3IShed3_29A"]).toMatch(/250,000/);
  });
  it("requires foreign tax number conditionally and rejects pre-2018 year", () => {
    const errors = annual.validateAnnual("1701v2018", {
      [p + "txtPg1I1Year"]: "2017",
      [p + "rdoPg1I13ForeignTaxCredits"]: "Yes",
    });
    expect(errors[p + "txtPg1I1Year"]).toMatch(/2018/);
    expect(errors[p + "txtPg1I14ForeignTaxNumber"]).toBeTruthy();
  });
  it("maps the exact summary amount fields", () => {
    expect(annual.annualAmountField("1701")).toBe(
      p + "txtPg1Pt2I32TotalUponFiling",
    );
    expect(annual.annualAmountField("1701v2018")).toBe(
      p + "txtPg1I32AggregateAmtPyble",
    );
  });
  it("flows legacy employer rows and business sales to the tax summary", () => {
    const result = annual.calculateAnnual("1701", {
      [p + "rdoPg1Pt1I20Deduction"]: "Itemized",
      [p + "rdoPg5Sc1I1TaxpayerSpouse"]: "1",
      [p + "txtPg5Sc1I1ComIncomeC2"]: "500000",
      [p + "txtPg5Sc1I1TaxWithheldC3"]: "80000",
      [p + "txtPg5Sc2I1TaxPayerC1"]: "600000",
      [p + "txtPg5Sc2I2TaxPayerC1"]: "400000",
      [p + "txtPg5Sc2I4TaxPayerC1"]: "100000",
    });
    expect(result[p + "txtPg2Pt4I41GrossCompensationC1"]).toBe("500000.00");
    expect(result[p + "txtPg2Pt4I50NetSalesC1"]).toBe("900000.00");
    expect(result[p + "txtPg1Pt2I27LessTotalTax"]).toBe("80000.00");
    expect(result[p + "txtPg1Pt2I32TotalUponFiling"]).toBe("333000.00");
  });
  it("requires a rate election for revised business income", () => {
    const errors = annual.validateAnnual("1701v2018", {
      [p + "txtPg1I1Year"]: "2025",
      [p + "rdoPg1I6TaxpayerTypeS"]: "true",
    });
    expect(errors[p + "rdoPg1I21TaxRate"]).toBeTruthy();
  });

  it("carries the revised special credit from Part VII to Part VIII", () => {
    const result = annual.calculateAnnual("1701v2018", {
      [p + "rdoPg1I20IncomeSpecial"]: "Yes",
      [p + "txtPg4IPart7_8A"]: "300",
      [p + "txtPg4IPart8_1A"]: "1000",
      [p + "txtPg4IPart8_4A"]: "250",
    });
    expect(result[p + "txtPg4IPart8_6A"]).toBe("300.00");
    expect(result[p + "txtPg4IPart8_7A"]).toBe("1050.00");
  });

  it("recognizes the revised editor's native checkbox value", () => {
    const values = {
      ...revised("2025"),
      [p + "rdoPg1I6TaxpayerTypeC"]: "Y",
      [p + "txtPg2IShed2_4A"]: "500000",
    };
    expect(annual.calculateAnnual("1701v2018", values)[p + "txtPg1I22ATaxDue"]).toBe("42500.00");
    expect(annual.validateAnnual("1701v2018", values)[p + "rdoPg1I6TaxpayerTypeS"]).toBeUndefined();
  });

  it("omits retained revised spouse amounts and validation on a separate return", () => {
    const values = {
      ...revised("2025"),
      [p + "rdoPg1I18FilingStatus"]: "Separate",
      [p + "rdoPg2I12TaxRate"]: "Percentage",
      [p + "txtPg3IShed3_26B"]: "3500000",
      [p + "txtPg1I25B"]: "100",
    };
    const result = annual.calculateAnnual("1701v2018", values);
    expect(result[p + "txtPg1I32AggregateAmtPyble"]).toBe(result[p + "txtPg1I31ATotalAmtPyble"]);
    expect(result[p + "txtPg1I31BTotalAmtPyble"]).toBe("0.00");
    expect(result[p + "txtPg3IShed3_26B"]).toBe("3500000");
    expect(annual.validateAnnual("1701v2018", values)[p + "txtPg3IShed3_26B"]).toBeUndefined();
    expect(annual.validateAnnual("1701v2018", values)[p + "txtPg1I25B"]).toBeUndefined();
  });

  it("omits retained legacy spouse credits and tax on a separate return", () => {
    const values = {
      [p + "rdoPg1Pt1I16FilingStatus"]: "Separate",
      [p + "txtPg2Pt4I41GrossCompensationC1"]: "100000",
      [p + "txtPg2Pt4I41GrossCompensationC2"]: "500000",
      [p + "txtPg9Sc9I5SpouseC2"]: "50000",
    };
    const result = annual.calculateAnnual("1701", values);
    expect(result[p + "txtPg1Pt2I26IncomeTax"]).toBe("14500.00");
    expect(result[p + "txtPg1Pt2I27LessTotalTax"]).toBe("0.00");
    expect(result[p + "txtPg2Pt4I41GrossCompensationC2"]).toBe("500000");
  });

  it("computes legacy itemized cost schedules and the personal exemption", () => {
    const result = annual.calculateAnnual("1701", {
      [p + "rdoPg1Pt1I7Type"]: "Single",
      [p + "rdoPg1Pt1I20Deduction"]: "Itemized",
      [p + "txtPg5Sc2I1TaxPayerC1"]: "1000000",
      [p + "txtPg5Sc4AI1TaxPayerC1"]: "100000",
      [p + "txtPg5Sc4AI2TaxPayerC1"]: "300000",
      [p + "txtPg5Sc4AI4TaxPayerC1"]: "50000",
    });
    expect(result[p + "txtPg2Pt4I53LessCostSalesC1"]).toBe("350000.00");
    expect(result[p + "txtPg2Pt4I45PersonalExempC1"]).toBe("50000.00");
    expect(result[p + "txtPg2Pt4I66TotalTaxableC1"]).toBe("600000.00");
    expect(result[p + "txtPg1Pt2I26IncomeTax"]).toBe("157000.00");
  });
  it("keeps a compensation-only spouse out of the business calculation", () => {
    const result = annual.calculateAnnual("1701v2018", {
      [p + "txtPg1I1Year"]: "2025",
      [p + "rdoPg1I18FilingStatus"]: "Joint",
      [p + "rdoPg2I3SpouseTypeC"]: "true",
      [p + "txtPg2IShed2_4B"]: "1000000",
      [p + "txtPg2IShed3_8B"]: "500000",
    });
    expect(result[p + "txtPg1I22BTaxDue"]).toBe("152500.00");
  });
  it("rejects impossible birth dates and incomplete joint spouse details", () => {
    const errors = annual.validateAnnual("1701v2018", {
      [p + "txtPg1I1Year"]: "2025",
      [p + "txtPg1I10BirthDate"]: "02/30/1990",
      [p + "rdoPg1I18FilingStatus"]: "Joint",
    });
    expect(errors[p + "txtPg1I10BirthDate"]).toBeTruthy();
    expect(errors[p + "txtPg2I5SpouseName"]).toBeTruthy();
  });
  it("accepts the legacy printed two-digit year", () => {
    expect(
      annual.validateAnnual("1701", { [p + "txtPg1I1Year"]: "17" })[
        p + "txtPg1I1Year"
      ],
    ).toBeUndefined();
  });

  it("rejects an impossible 1701 June 2013 filer birth date", () => {
    const errors = annual.validateAnnual("1701", {
      [p + "txtPg1I1Year"]: "17",
      [p + "txtPg1Pt1I11Month"]: "02/30/1990",
    });
    expect(errors[p + "txtPg1Pt1I11Month"]).toMatch(/valid birth date/i);
  });
});

describe("short annual income returns", () => {
  it("omits the retained 1701A foreign credit when the election is No", () => {
    const result = calculate1701A({
      "frm1701A:txtYear": "2025",
      "frm1701A:txt36A": "1000000",
      "frm1701A:optForeignTaxCredits": "N",
      "frm1701A:txt62A": "2000",
    });
    expect(result["frm1701A:txt64A"]).toBe("0.00");
    expect(result["frm1701A:txt62A"]).toBe("2000");
  });
  it("enforces 1701A's printed second-installment limit", () => {
    const errors = validate1701A({
      "frm1701A:txtYear": "2025",
      "frm1701A:txt36A": "1000000",
      "frm1701A:txt23A": "31251",
    });
    expect(errors["frm1701A:txt23A"]).toMatch(/50%/);
  });

  it("fills 1701-MS schedule item 18B from the same amount reported in Part II", () => {
    const result = calculate1701MS({
      "frm1701MS:txtTaxpayerNo12a": "2",
      "frm1701MS:txtSalesRevenueNo5a": "1000000",
      methodOfDeductionMain: "osd",
    });
    expect(result["frm1701MS:TotalTaxDueCompensationBTP"]).toBe("62500.00");
    expect(result["frm1701MS:txtIncomeTaxRegularNo22a"]).toBe("62500.00");
  });

  it("applies the 1701-MS automatic 8% deduction to pure business income only", () => {
    const values = {
      "frm1701MS:txtTaxpayerNo12a": "3",
      "frm1701MS:txtSalesRevenuesFeesANo19a": "500000",
    };
    expect(calculate1701MS({ ...values, taxCodeDropdown: "II015" })["frm1701MS:txtTaxDueBusinessIncome24A"]).toBe("20000.00");
    const mixed = calculate1701MS({ ...values, taxCodeDropdown: "II016", "frm1701MS:txtLess22A": "250000" });
    expect(mixed["frm1701MS:txtLess22A"]).toBe("0.00");
    expect(mixed["frm1701MS:txtTaxDueBusinessIncome24A"]).toBe("40000.00");
  });

  it("derives each 1701-MS ATC from the income source and tax regime", () => {
    const result = calculate1701MS({
      "frm1701MS:sourceOfIncomeTaxpayer": "3",
      "frm1701MS:txtTaxpayerNo12a": "3",
      "frm1701MS:txtIfMarried": "1",
      "frm1701MS:sourceOfIncomeSpouse": "4",
      "frm1701MS:txtTaxpayerNo12b": "2",
      taxCodeDropdown: "II016",
    });
    expect(result.taxCodeDropdown).toBe("II017");
    expect(result.taxCodeDropdownSpouse).toBe("II011");
    expect(result["frm1701MS:txtLess22A"]).toBe("250000.00");
  });

  it("does not offset a 1701-MS spouse's payable amount with the other spouse's overpayment", () => {
    const result = calculate1701MS({
      "frm1701MS:txtIfMarried": "1",
      "frm1701MS:txtTaxpayerNo12a": "2",
      "frm1701MS:txtSalesRevenueNo5a": "400000",
      "frm1701MS:txtTaxpayerNo12b": "2",
      "frm1701MS:txtCreditableTaxNo3b": "5000",
    });
    expect(result["frm1701MS:txtAggregateAmountPayable30a"]).toBe("22500.00");
  });

  it("rejects a combined 1701-MS refund and tax credit certificate", () => {
    const errors = validate1701MS({
      "frm1701MS:txtCreditableTaxNo3a": "1000",
      "frm1701MS:txtToBeRefunded": "Y",
      "frm1701MS:txtToBeRefunded1": "500",
      "frm1701MS:txtToBeIssued": "Y",
      "frm1701MS:txtToBeIssued1": "500",
    });
    expect(errors["frm1701MS:txtToBeIssued"]).toMatch(/refund/i);
  });

  it("caps the 1701-MS second installment at the outstanding balance and half of tax due", () => {
    const values = {
      "frm1701MS:txtTaxpayerNo12a": "2",
      "frm1701MS:txtSalesRevenueNo5a": "1000000",
      methodOfDeductionMain: "osd",
    };
    expect(validate1701MS({ ...values, "frm1701MS:txtTaxDueAllowedNo26a": "31251" })["frm1701MS:txtTaxDueAllowedNo26a"]).toBeTruthy();
    const reduced = validate1701MS({ ...values, "frm1701MS:txtCreditableTaxNo3a": "62500", "frm1701MS:txtTaxDueAllowedNo26a": "1" });
    expect(reduced["frm1701MS:txtTaxDueAllowedNo26a"]).toBeTruthy();
  });

  it("rejects combined 1701-MS receipts above the bundled 8% eligibility threshold", () => {
    const errors = validate1701MS({
      "frm1701MS:txtTaxpayerNo12a": "3",
      "frm1701MS:txtSalesRevenuesFeesANo19a": "2900000",
      "frm1701MS:txtOtherNonOperatingIncomeNo20a": "100001",
    });
    expect(errors["frm1701MS:txtSalesRevenuesFeesANo19a"]).toMatch(/3,000,000/);
  });

  it("checks the 1701-MS tax relief dates against the end of the filing period", () => {
    const errors = validate1701MS({
      "frm1701MS:txtYearNo1": "2025",
      "frm1701MS:txtMonthNo1": "06",
      "frm1701MS:txtTaxpayerNo12a": "5",
      "frm1701MS:txtTaxpayerNo16a": "07/01/2025",
      "frm1701MS:txtTaxpayerNo16a1": "06/29/2025",
    });
    expect(errors["frm1701MS:txtTaxpayerNo16a"]).toMatch(/before the filing period ends/i);
    expect(errors["frm1701MS:txtTaxpayerNo16a1"]).toMatch(/on or after the filing period ends/i);
  });
});
