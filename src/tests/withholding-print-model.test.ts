import { describe, expect, it } from "vitest";
import { originalFieldValue } from "../lib/printing/withholding-print-model";

describe("withholding print model", () => {
  it('keeps the1606 multiple-property question independent of habitual business', () => {
    for (const [multiple, habitual] of [['N','Y'],['Y','N']]) {
      const values={'frm1606:j_id394':multiple,'frm1606:Habitual':habitual};
      expect(originalFieldValue('1606','frm1606:j_id394',values)).toEqual({key:'frm1606:j_id394',value:multiple});
      expect(originalFieldValue('1606','frm1606:SpecialLaw',values)).toEqual({key:'frm1606:Habitual',value:habitual});
    }
  });
  it("maps original identity aliases and the quarter radio values", () => {
    expect(
      originalFieldValue("1603", "frm1603:registeredName", {
        "frm1603:txtTaxpayerName": "TEST NAME",
      }),
    ).toEqual({ key: "frm1603:txtTaxpayerName", value: "TEST NAME" });
    expect(
      originalFieldValue("1601FQ", "frm1601FQ:OptQuarter", {
        "frm1601FQ:optQuarter": "Q2",
      }),
    ).toEqual({ key: "frm1601FQ:optQuarter", value: "2" });
  });
  it("uses source radio codes for payment and real-property overremittance", () => {
    expect(
      originalFieldValue("0605", "frm0605:itemFiscalStartMonth", {
        "frm0605:itemFiscalStartMonth": "Fiscal",
      })?.value,
    ).toBe("F");
    expect(
      originalFieldValue("0605", "frm0605:itemModeOfPayment", {
        "frm0605:itemModeOfPayment": "Full payment",
      })?.value,
    ).toBe("3");
    expect(
      originalFieldValue("1606", "frm1606:opt37", {
        "frm1606:overpaymentOption": "Refund",
      })?.value,
    ).toBe("R");
  });
  it("maps split calendar dates and seller TIN segments without losing leading zeroes", () => {
    expect(
      originalFieldValue("0619E", "txtDueDay", {
        "frm0619E:dueDate": "2025-02-09",
      })?.value,
    ).toBe("09");
    expect(
      originalFieldValue("1606", "frm1606:txtTINS1", {
        "frm1606:sellerTin": "001-234-567-0008",
      })?.value,
    ).toBe("001");
    expect(
      originalFieldValue("1606", "frm1606:txtBranchCodeS", {
        "frm1606:sellerTin": "001-234-567-0008",
      })?.value,
    ).toBe("0008");
  });
  it("puts a compensation adjustment in the selected period column only", () => {
    const values = {
      "frm1601c:sched1:periodType0": "Y",
      "frm1601c:sched1:txtAdjustments0": "25.00",
    };
    expect(
      originalFieldValue(
        "1601C",
        "frm1601c:SectionA:TxtCurrentYearRadio1",
        values,
      )?.value,
    ).toBe("");
    expect(
      originalFieldValue(
        "1601C",
        "frm1601c:SectionA:TxtFromYearEndRadio1",
        values,
      )?.value,
    ).toBe("25.00");
  });
});
