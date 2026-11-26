import { describe, expect, it } from "vitest";
import { calculateMixed } from "../../../lib/forms/corporate-income/mixed";

const fields = (values: Record<string, string>) =>
  Object.fromEntries(Object.entries(values).map(([key, value]) => [`frm1702MX:${key}`, value]));

const populated = fields({
  chkPg1I5ATCR1: "Y",
  txtPg2Pt4I34SpecialTaxRate: "10",
  drpPg3Sc1I11CB: "0.1",
  txtPg3Sc1I11CA: "1",
  txtPg3Sc1I11CC: "7",
  txtPg4Sc3I1CA: "100000",
  txtPg4Sc3I1CB: "200000",
  txtPg4Sc3I1CC: "300000",
  txtPg4Sc3AI1CA: "10000",
  txtPg4Sc3AI1CB: "20000",
  txtPg4Sc3AI1CC: "30000",
  txtPg5Sc4I1CA: "1000",
  txtPg5Sc4I1CB: "2000",
  txtPg5Sc4I1CC: "3000",
  txtPg5Sc5I1CA: "11000",
  txtPg5Sc5I1CB: "22000",
  txtPg5Sc5I1CC: "33000",
  txtPg6Sc6I1CA: "1000",
  txtPg6Sc6I1CB: "2000",
  txtPg6Sc6I1CC: "3000",
  txtPg6Sc7AI5CA: "4000",
  txtPg6Sc7AI5CD: "4000",
  txtPg3Sc1I13CB: "800",
  txtPg7Sc8I10CB: "2000",
  txtPg6Sc8I1CA: "250",
  txtPg6Sc8I1CC: "3500",
  txtPg2Pt5I40: "750",
});

describe("June 2013 Form 1702-MX schedules", () => {
  it("totals sales, costs, expenses, and tax credits across regimes on pages 4 through 7", () => {
    expect(calculateMixed("1702MX", populated)).toMatchObject(fields({
      txtPg4Sc3I1CD: "600000",
      txtPg4Sc3I6CD: "600000",
      txtPg4Sc3AI5CD: "60000",
      txtPg4Sc3CI27CD: "60000",
      txtPg5Sc4I4CD: "6000",
      txtPg5Sc5I1CD: "66000",
      txtPg6Sc5I40CD: "66000",
      txtPg6Sc6I5CD: "6000",
      txtPg6Sc8I1CD: "3750",
      txtPg7Sc8I13CD: "5750",
    }));
  });

  it("counts the reported financial statement income, additions and exclusions in Schedule 10", () => {
    const result = calculateMixed("1702MX", fields({
      txtPg7Sc10I1CA: "10000",
      txtPg7Sc10I1CC: "20000",
      txtPg7Sc10I2CC: "5000",
      txtPg7Sc10I5CA: "700",
      txtPg7Sc10I7CC: "300",
    }));
    expect(result).toMatchObject(fields({
      txtPg7Sc10I4CD: "35000",
      txtPg7Sc10I9CD: "1000",
      txtPg7Sc10I10CD: "34000",
    }));
  });

  it("computes Schedule 1 total amounts across the three regimes", () => {
    expect(calculateMixed("1702MX", populated)).toMatchObject(fields({
      txtPg3Sc1I1CD: "600000",
      txtPg3Sc1I2CD: "60000",
      txtPg3Sc1I3CD: "540000",
      txtPg3Sc1I4CD: "6000",
      txtPg3Sc1I5CD: "546000",
      txtPg3Sc1I6CD: "66000",
      txtPg3Sc1I7CD: "6000",
      txtPg3Sc1I8CD: "4000",
      txtPg3Sc1I9CD: "76000",
      txtPg3Sc1I10CD: "470000",
      txtPg3Sc1I11CA: "0",
      txtPg3Sc1I11CC: "30.0",
      txtPg3Sc1I12CD: "85700",
      txtPg3Sc1I13CD: "800",
      txtPg3Sc1I14CD: "84900",
      txtPg3Sc1I15CD: "5460",
      txtPg3Sc1I16CD: "84900",
    }));
  });

  it("carries the ordinary tax comparison through Schedule 2 relief", () => {
    expect(calculateMixed("1702MX", populated)).toMatchObject(fields({
      txtPg3Sc2I1CA: "23700",
      txtPg3Sc2I1CB: "47400",
      txtPg3Sc2I1CC: "0",
      txtPg3Sc2I1CD: "71100",
      txtPg3Sc2I2CD: "1800",
      txtPg3Sc2I3CD: "72900",
      txtPg3Sc2I4CD: "15000",
      txtPg3Sc2I5CD: "57900",
      txtPg3Sc2I6CD: "2000",
      txtPg3Sc2I7CD: "59900",
    }));
  });

  it("carries tax due and credits to Part V before applying penalties", () => {
    expect(calculateMixed("1702MX", populated)).toMatchObject(fields({
      txtPg2Pt5I37CB: "15000",
      txtPg2Pt5I37CC: "69900",
      txtPg2Pt5I37CD: "84900",
      txtPg2Pt5I38CD: "5750",
      txtPg2Pt5I39CD: "79150",
      txtPg2Pt5I43: "750",
      txtPg2Pt5I44: "79900",
      txtPg1Pt2I20TotalAmount: "79900",
    }));
  });

  it("uses Page 2's entered special rate in a draft without a Schedule 1 selection", () => {
    const result = calculateMixed("1702MX", fields({
      txtPg2Pt4I34SpecialTaxRate: "12.5",
      txtPg4Sc3I1CB: "1000",
    }));
    expect(result).toMatchObject(fields({
      drpPg3Sc1I11CB: "0.125",
      txtPg3Sc1I12CB: "125",
    }));
  });

  it("preserves a saved eligible ATC rate and replaces it after the election is withdrawn", () => {
    const result = calculateMixed("1702MX", fields({
      chkPg1I5ATCR2: "Y",
      drpPg1I5ATCR2: "IC030",
      txtPg2Pt4I34SpecialTaxRate: "5",
      drpPg3Sc1I11CB: "0.10",
      txtPg4Sc3I1CB: "1000",
    }));
    expect(result["frm1702MX:drpPg3Sc1I11CB"]).toBe("0.1");
    const withdrawn = calculateMixed("1702MX", {
      ...result,
      ...fields({ chkPg1I5ATCR2: "N", drpPg1I5ATCR2: "" }),
    });
    expect(withdrawn).toMatchObject(fields({
      drpPg3Sc1I11CB: "0.05",
      txtPg3Sc1I12CB: "50",
    }));
  });

  it("keeps the main special rate available when only exempt activities exist", () => {
    const result = calculateMixed("1702MX", fields({
      chkPg2Pt4I30MoreThanOne: "Y",
      totalEXAttach: "1",
      totalSPAttach: "0",
      txtPg2EX1ScDI1: "1000",
      txtPg2Pt4I34SpecialTaxRate: "10",
    }));
    expect(result).toMatchObject(fields({
      drpPg3Sc1I11CB: "0.1",
      txtPg3Sc1I1CD: "1000",
    }));
  });

  it("includes active attachment costs, other income and NOLCO in Schedule 1", () => {
    const result = calculateMixed("1702MX", fields({
      chkPg2Pt4I30MoreThanOne: "Y",
      totalSPAttach: "1",
      txtPg1SP1ScBI11: "10",
      txtPg2SP1ScDI1: "1000",
      txtPg2SP1ScE1I1: "200",
      txtPg3SP1ScFI1C1: "30",
      txtPg3SP1ScGI1: "50",
      txtPg4SP1ScIAI5CA: "40",
      txtPg4SP1ScIAI5CD: "40",
    }));
    expect(result).toMatchObject(fields({
      txtPg3Sc1I1CD: "1000",
      txtPg3Sc1I2CD: "200",
      txtPg3Sc1I4CD: "30",
      txtPg3Sc1I8CD: "40",
      txtPg3Sc1I10CD: "740",
      txtPg3Sc1I12CB: "74",
    }));
  });

  it("adds base and active supplemental final tax amounts into Schedule 13 Item 19", () => {
    const result = calculateMixed("1702MX", fields({
      txtPg9Sc13I1CA: "9000",
      txtPg9Sc13I1CC: "10",
      txtPg9Sc13I2CC: "20",
      txtPg9Sc13I3CC: "30",
      txtPg9Sc13I4CC: "40",
      txtPg9Sc13I9CA: "50",
      txtPg9Sc13I15CB: "60",
      txtPg9Sc13I18CA: "70",
      txtCtrmodalPg9Sc13I: "1",
      txtCtrmodalPg9Sc13II: "1",
      txtCtrmodalPg9Sc13III: "1",
      txtCtrmodalPg9Sc13IV: "1",
      "txtPg9Sc13I4CC-1": "80",
      "txtPg9Sc13I9CA-1": "90",
      "txtPg9Sc13I15CB-1": "100",
      "txtPg9Sc13I18CB-1": "110",
      "txtPg9Sc13I18CB-2": "9000",
    }));
    expect(result["frm1702MX:txtPg9Sc13I19"]).toBe("660");
  });

  it("adds base and active supplemental exempt amounts into Schedule 14 Item 8", () => {
    const result = calculateMixed("1702MX", fields({
      txtPg9Sc14I1: "100",
      txtPg9Sc14I5CA: "200",
      txtPg9Sc14I5CB: "300",
      txtPg9Sc14I7CA: "400",
      txtPg9Sc14I7CB: "500",
      txtCtrmodalPg9Sc14I: "1",
      txtCtrmodalPg9Sc14II: "1",
      "txtPg9Sc14I5CB-1": "600",
      "txtPg9Sc14I7CA-1": "700",
      "txtPg9Sc14I5CB-2": "9000",
    }));
    expect(result["frm1702MX:txtPg9Sc14I8"]).toBe("2800");
  });
});
