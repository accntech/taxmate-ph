<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1602Q:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1602Q:qtr_1",
    "source": "frm1602Q:qtr",
    "choice": "1",
    "checked": false
  },
  {
    "id": "frm1602Q:qtr_2",
    "source": "frm1602Q:qtr",
    "choice": "2",
    "checked": false
  },
  {
    "id": "frm1602Q:qtr_3",
    "source": "frm1602Q:qtr",
    "choice": "3",
    "checked": false
  },
  {
    "id": "frm1602Q:qtr_4",
    "source": "frm1602Q:qtr",
    "choice": "4",
    "checked": false
  },
  {
    "id": "frm1602Q:AmendedRtn1",
    "source": "frm1602Q:AmendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1602Q:AmendedRtn2",
    "source": "frm1602Q:AmendedRtn",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1602Q:OptTaxWithheld1",
    "source": "frm1602Q:OptTaxWithheld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1602Q:OptTaxWithheld2",
    "source": "frm1602Q:OptTaxWithheld",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1602Q:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1602Q:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1602Q:txtRDOCode"
  },
  {
    "id": "frm1602Q:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1602Q:OptCategoryAgent1",
    "source": "frm1602Q:OptCategoryAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1602Q:OptCategoryAgent2",
    "source": "frm1602Q:OptCategoryAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "txtEmail",
    "fallback": ""
  },
  {
    "id": "frm1602Q:OptSpecialTax1",
    "source": "frm1602Q:OptSpecialTax",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1602Q:OptSpecialTax2",
    "source": "frm1602Q:OptSpecialTax",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1602Q:lstSpecialTax",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty",
      "3": "Both"
    }
  },
  {
    "id": "frm1602Q:txt14",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt15",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt16",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt17",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt18",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt19",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt20",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt21",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt22",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt23",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt24",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt25",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt26",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt27",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txt28",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:OverRemittance1",
    "source": "frm1602Q:OverRemittance",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1602Q:OverRemittance2",
    "source": "frm1602Q:OverRemittance",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1602Q:OverRemittance3",
    "source": "frm1602Q:OverRemittance",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1602Q:txtPage2TIN",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtPage2Agent",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtSched1Amount1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate1",
    "source": "frm1602Q:txtSched1TaxRate1"
  },
  {
    "id": "frm1602Q:txtSched1Tax1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate2",
    "source": "frm1602Q:txtSched1TaxRate2"
  },
  {
    "id": "frm1602Q:txtSched1Tax2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount3",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate3",
    "source": "frm1602Q:txtSched1TaxRate3"
  },
  {
    "id": "frm1602Q:txtSched1Tax3",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount4",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate4",
    "source": "frm1602Q:txtSched1TaxRate4"
  },
  {
    "id": "frm1602Q:txtSched1Tax4",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount5",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate5",
    "source": "frm1602Q:txtSched1TaxRate5"
  },
  {
    "id": "frm1602Q:txtSched1Tax5",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount6",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate6",
    "source": "frm1602Q:txtSched1TaxRate6"
  },
  {
    "id": "frm1602Q:txtSched1Tax6",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount7",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate7",
    "source": "frm1602Q:txtSched1TaxRate7"
  },
  {
    "id": "frm1602Q:txtSched1Tax7",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount8",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate8",
    "source": "frm1602Q:txtSched1TaxRate8"
  },
  {
    "id": "frm1602Q:txtSched1Tax8",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount9",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate9",
    "source": "frm1602Q:txtSched1TaxRate9"
  },
  {
    "id": "frm1602Q:txtSched1Tax9",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount10",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate10",
    "source": "frm1602Q:txtSched1TaxRate10"
  },
  {
    "id": "frm1602Q:txtSched1Tax10",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount11",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate11",
    "source": "frm1602Q:txtSched1TaxRate11"
  },
  {
    "id": "frm1602Q:txtSched1Tax11",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount12",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:fntSched1TaxRate12",
    "source": "frm1602Q:txtSched1TaxRate12"
  },
  {
    "id": "frm1602Q:txtSched1Tax12",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount13",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1TaxRate13",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Rate13",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Tax13",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount14",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1TaxRate14",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Rate14",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Tax14",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Amount15",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Tax15",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched1Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched2TreatyCode1",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtSched2ATC1",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtSched2Interest1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched2TaxRate1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched2TaxesWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched2TreatyCode2",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtSched2ATC2",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtSched2Interest2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched2TaxRate2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched2TaxesWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched2Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched3IPA1",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtSched3TotInterest1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched3TaxRate1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched3TaxWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched3IPA2",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtSched3TotInterest2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched3TaxRate2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched3TaxWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtSched3Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1602Q:txtPage3TIN",
    "fallback": ""
  },
  {
    "id": "frm1602Q:txtPage3Agent",
    "fallback": ""
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1602Qv2018", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1602Qv2018"
  aria-label="BIR Form 1602Qv2018 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1602qv2018-1"
    data-source-page="1"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page1">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-02ce50fc59ff"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-c4c090a19808"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-2701e309236f">
                      <img
                        alt="BIR form identifying mark"
                        class="wh-inline-5dfba9815e30"
                        height="25"
                        src="/legacy/img/withholding/original-6c831e35170ff5f3.png"
                        width="80"
                      />
                    </td>
                    <td class="wh-inline-37194e9f4d1b">
                      <img
                        alt="birlogo"
                        class="wh-inline-5dfba9815e30"
                        height="50"
                        src="/legacy/img/withholding/original-496a4fcbfde5f354.png"
                        width="210"
                      />
                    </td>
                    <td class="wh-inline-93957272361c"> </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-699d694f4026"
              >
                <tbody>
                  <tr>
                    <td class="wh-inline-b729759b3aa0">
                      <span class="wh-inline-429482632af7"
                        >BIR Form No.
                        <br />
                      </span>
                      <span class="wh-inline-329eb41f06fd">1602Q </span>
                      <span class="wh-inline-429482632af7">January 2018</span>
                      <br />
                      <span class="wh-inline-429482632af7">
                        <b>Page 1</b>
                      </span>
                    </td>
                    <td class="wh-inline-6be899438162">
                      <span class="wh-inline-aec978eca301"
                        >Quarterly Remittance Return</span
                      >
                      <br />
                      <p class="wh-inline-e2d359fdda59">
                        <span class="wh-inline-9043f09f0f64"
                          >of Final Taxes Withheld on Interest Paid on Deposits
                          and Deposits Substitutes/Trusts/Etc.
                        </span>
                      </p>
                      <span class="wh-inline-429482632af7">
                        <i
                          >Enter all required information in CAPITAL LETTERS
                          using BLACK ink. Mark applicable boxes with an "X".
                          Two copies MUST be filled with the BIR and one held by
                          the Taxpayer.</i
                        >
                      </span>
                    </td>
                    <td class="wh-inline-b41f9158b2dd">
                      <div class="wh-inline-f53335c779da">
                        <img
                          alt="BIR form identifying mark"
                          src="/legacy/img/withholding/original-594ca0bbf6e6779b.png"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-8bd197d67f7d">
                      <span class="item-number">1</span>
                      <span class="wh-inline-cb3a2164388b">For the Year</span>
                    </td>
                    <td class="tblFormTd wh-inline-c41245a21ae5">
                      <span class="item-number">2</span>
                      <span class="wh-inline-cb3a2164388b">Quarter</span>
                    </td>
                    <td class="tblFormTd wh-inline-c0424973a6ea">
                      <span class="item-number">3</span>
                      <span class="wh-inline-cb3a2164388b">Amended Return?</span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-dbb17c3c8c91">
                      <span class="item-number">4</span>
                      <span class="wh-inline-cb3a2164388b"
                        >Any Taxes Withheld</span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-3709648fafb2">
                      <span class="item-number">5</span>
                      <span class="wh-inline-cb3a2164388b"
                        >No. of Sheet/s Attached</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-0469fac9d6d1">
                      <input class="wh-source-size-4" aria-label="txtYear" data-field-id="frm1602Q:txtYear" data-print-control="text" data-print-value="" id="frm1602Q:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1602Q:txtYear"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-2efeb2afe3a4">
                      <input aria-label="qtr_1" checked={model.checks["frm1602Q:qtr_1"] ?? false} data-field-id="frm1602Q:qtr_1" data-print-control="radio" disabled id="frm1602Q:qtr_1" type="radio"/>
                      <span class="wh-inline-766562615de5">1st</span>
                      <input aria-label="qtr_2" checked={model.checks["frm1602Q:qtr_2"] ?? false} data-field-id="frm1602Q:qtr_2" data-print-control="radio" disabled id="frm1602Q:qtr_2" type="radio"/>
                      <span class="wh-inline-766562615de5">2nd</span>
                      <input aria-label="qtr_3" checked={model.checks["frm1602Q:qtr_3"] ?? false} data-field-id="frm1602Q:qtr_3" data-print-control="radio" disabled id="frm1602Q:qtr_3" type="radio"/>
                      <span class="wh-inline-766562615de5">3rd</span>
                      <input aria-label="qtr_4" checked={model.checks["frm1602Q:qtr_4"] ?? false} data-field-id="frm1602Q:qtr_4" data-print-control="radio" disabled id="frm1602Q:qtr_4" type="radio"/>
                      <span class="wh-inline-766562615de5">4th</span>
                    </td>
                    <td class="tblFormTd wh-inline-09fd5b726bbb">
                      <input aria-label="AmendedRtn1" checked={model.checks["frm1602Q:AmendedRtn1"] ?? false} data-field-id="frm1602Q:AmendedRtn1" data-print-control="radio" disabled id="frm1602Q:AmendedRtn1" type="radio"/>
                      <span class="wh-inline-534e2278e92c">Yes</span>
                      <input aria-label="AmendedRtn2" checked={model.checks["frm1602Q:AmendedRtn2"] ?? false} data-field-id="frm1602Q:AmendedRtn2" data-print-control="radio" disabled id="frm1602Q:AmendedRtn2" type="radio"/>
                      <span class="wh-inline-534e2278e92c">No</span>
                    </td>
                    <td class="tblFormTd wh-inline-81aab143fe8c">
                      <input aria-label="OptTaxWithheld1" checked={model.checks["frm1602Q:OptTaxWithheld1"] ?? false} data-field-id="frm1602Q:OptTaxWithheld1" data-print-control="radio" disabled id="frm1602Q:OptTaxWithheld1" type="radio"/>
                      <span class="wh-inline-534e2278e92c">Yes</span>
                      <input aria-label="OptTaxWithheld2" checked={model.checks["frm1602Q:OptTaxWithheld2"] ?? false} data-field-id="frm1602Q:OptTaxWithheld2" data-print-control="radio" disabled id="frm1602Q:OptTaxWithheld2" type="radio"/>
                      <span class="wh-inline-534e2278e92c">No</span>
                    </td>
                    <td class="tblFormTd wh-inline-063d4e3f4f6c">
                      <input aria-label="txtSheets" class="wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1602Q:txtSheets" data-print-control="text" data-print-value="" id="frm1602Q:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1602Q:txtSheets"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart">
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-4cf6c17959a7"
                          >Part I - Background Information</span
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr
                    ><td class="tblFormTd wh-inline-3709648fafb2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-6e306ed065f9"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <span class="item-number">6</span>
                            </td>
                            <td>
                              <span class="wh-inline-cb3a2164388b"
                                >Taxpayer Identification Number (TIN)</span
                              >
                              <span class="wh-inline-bde3eff30629">
                                <input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm1602Q:txtTIN1" data-print-control="text" data-print-value="" id="frm1602Q:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm1602Q:txtTIN1"] ?? ""}>
                                /  
                                <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm1602Q:txtTIN2" data-print-control="text" data-print-value="" id="frm1602Q:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm1602Q:txtTIN2"] ?? ""}>
                                /  
                                <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm1602Q:txtTIN3" data-print-control="text" data-print-value="" id="frm1602Q:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm1602Q:txtTIN3"] ?? ""}>
                                /  
                                <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm1602Q:txtBranchCode" data-print-control="text" data-print-value="" id="frm1602Q:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1602Q:txtBranchCode"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-3709648fafb2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-20ee506482e9"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <span class="item-number">7</span>
                              <span class="wh-inline-cb3a2164388b"
                                >RDO Code</span
                              >
                            </td>
                            <td data-field-id="rdoSelect" id="rdoSelect"
                              >{model.text["rdoSelect"] ?? ""}</td
                            >
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr></tbody
                >
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr
                    ><td class="tblFormTd wh-inline-3709648fafb2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-4c94f61f6b8f"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-4c94f61f6b8f"
                              >
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="item-number">8</span>
                                    </td>
                                    <td>
                                      <span class="wh-inline-cb3a2164388b"
                                        >Withholding Agent's Name (Last Name,
                                        First Name, Middle Name for Individual
                                        OR Registered Name for Non-Individual)</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-4c94f61f6b8f"
                              >
                                <tbody
                                  ><tr>
                                    <td> </td>
                                    <td>
                                      <input class="wh-source-size-100" aria-label="txtTaxpayerName" data-field-id="frm1602Q:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1602Q:txtTaxpayerName" maxlength="70" readonly size="100" type="text" value={model.text["frm1602Q:txtTaxpayerName"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr></tbody
                >
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr
                    ><td class="tblFormTd wh-inline-6d1427d11577">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-9ae2a774779b"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-9ae2a774779b"
                              >
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="item-number">9</span>
                                    </td>
                                    <td class="wh-inline-5d9840c592c8">
                                      <span class="wh-inline-cb3a2164388b">
                                        Registered Address (Indicate complete
                                        address. If branch, indicate the branch
                                        address. If the registered address is
                                        different from the current address, go
                                        to the RDO to updated registered address
                                        by using BIR Form No. 1905)
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-9ae2a774779b"
                              >
                                <tbody
                                  ><tr>
                                    <td> </td>
                                    <td>
                                      <input class="wh-source-size-110" aria-label="txtAddress" data-field-id="frm1602Q:txtAddress" data-print-control="text" data-print-value="" id="frm1602Q:txtAddress" maxlength="150" readonly size="110" type="text" value={model.text["frm1602Q:txtAddress"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-82763230db92">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-5d81f75a7ffa"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-5d81f75a7ffa"
                              >
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="item-number">9A</span>
                                    </td>
                                    <td>
                                      <span class="wh-inline-cb3a2164388b">
                                        Zip Code
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-5d81f75a7ffa"
                              >
                                <tbody
                                  ><tr>
                                    <td> </td>
                                    <td class="wh-inline-4f5c3ea91781">
                                      <input class="wh-source-size-4" aria-label="txtZipCode" data-field-id="frm1602Q:txtZipCode" data-print-control="text" data-print-value="" id="frm1602Q:txtZipCode" maxlength="12" readonly size="4" type="text" value={model.text["frm1602Q:txtZipCode"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr></tbody
                >
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-a62636a4c9d5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="item-number">10</span>
                      <span class="wh-inline-2ca22ce46df2">
                        Contact Number
                      </span>
                      <input class="wh-source-size-20" aria-label="txtTelNum" data-field-id="frm1602Q:txtTelNum" data-print-control="text" data-print-value="" id="frm1602Q:txtTelNum" maxlength="20" readonly size="20" type="text" value={model.text["frm1602Q:txtTelNum"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <span class="item-number">11</span>
                      <span class="wh-inline-2ca22ce46df2">
                        Category of Withholding Agent
                      </span>
                      <input aria-label="OptCategoryAgent1" checked={model.checks["frm1602Q:OptCategoryAgent1"] ?? false} data-field-id="frm1602Q:OptCategoryAgent1" data-print-control="radio" disabled id="frm1602Q:OptCategoryAgent1" type="radio"/>
                      <span class="wh-inline-534e2278e92c">Private</span>
                      <input aria-label="OptCategoryAgent2" checked={model.checks["frm1602Q:OptCategoryAgent2"] ?? false} data-field-id="frm1602Q:OptCategoryAgent2" data-print-control="radio" disabled id="frm1602Q:OptCategoryAgent2" type="radio"/>
                      <span class="wh-inline-534e2278e92c">Government</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr
                    ><td class="tblFormTd">
                      <span class="item-number">12</span>
                      <span class="wh-inline-cb3a2164388b">
                        Email Address
                      </span>
                      <input class="wh-source-size-100" aria-label="txtEmail" data-field-id="txtEmail" data-print-control="text" data-print-value="" id="txtEmail" maxlength="70" readonly size="100" type="text" value={model.text["txtEmail"] ?? ""}>
                    </td>
                  </tr></tbody
                >
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-a62636a4c9d5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-3709648fafb2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-f4dec3c8940b"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <span class="item-number">13</span>
                              <span class="wh-inline-cb3a2164388b">
                                Are there payees availing of tax relief under
                                Special Law or International Tax Treaty?
                              </span>
                            </td>
                            <td>
                              <input aria-label="OptSpecialTax1" checked={model.checks["frm1602Q:OptSpecialTax1"] ?? false} data-field-id="frm1602Q:OptSpecialTax1" data-print-control="radio" disabled id="frm1602Q:OptSpecialTax1" type="radio"/>
                              <span class="wh-inline-534e2278e92c">Yes</span>
                              <input aria-label="OptSpecialTax2" checked={model.checks["frm1602Q:OptSpecialTax2"] ?? false} data-field-id="frm1602Q:OptSpecialTax2" data-print-control="radio" disabled id="frm1602Q:OptSpecialTax2" type="radio"/>
                              <span class="wh-inline-534e2278e92c">No</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-3709648fafb2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-3d2203e78151"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <span class="item-number">13A</span>
                              <span class="wh-inline-cb3a2164388b"
                                >If yes, specify</span
                              >
                              <span aria-label="lstSpecialTax" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1602Q:lstSpecialTax" data-print-control="select" id="frm1602Q:lstSpecialTax">{model.text["frm1602Q:lstSpecialTax"] ?? ""}</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-4c94f61f6b8f"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-62c7b1cc0b82">
                              <span class="wh-inline-4cf6c17959a7"
                                >Part II - Computation of Tax</span
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">14</span>
                      <span class="wh-inline-cb3a2164388b">
                        Taxes Withheld for the Quarter Based on Regular Rates
                        <a id="frm1602Q:txtSched1"
                          ><em>(From Part IV - Schedule 1)</em></a
                        >
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt14" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt14" data-print-control="text" data-print-value="" id="frm1602Q:txt14" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt14"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">15</span>
                      <span class="wh-inline-cb3a2164388b">
                        Taxes Withheld for the Quarter Based on Tax Treaty Rates
                        <a id="frm1602Q:txtSched2"
                          ><em>(From Part IV - Schedule 2)</em></a
                        >
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt15" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt15" data-print-control="text" data-print-value="" id="frm1602Q:txt15" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt15"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">16</span>
                      <span class="wh-inline-cb3a2164388b">
                        Taxes Withheld for the Quarter Based on Preferential
                        Rates
                        <a id="frm1602Q:txtSched3"
                          ><em>(From Part IV - Schedule 3)</em></a
                        >
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt16" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt16" data-print-control="text" data-print-value="" id="frm1602Q:txt16" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt16"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">17</span>
                      <span class="wh-inline-cb3a2164388b">
                        Total Taxes Withheld for the Quarter (Sum of Items 14 to
                        16)
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt17" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt17" data-print-control="text" data-print-value="" id="frm1602Q:txt17" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt17"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">18</span>
                      <span class="wh-inline-cb3a2164388b">
                        Less: Remittances Made: 1
                        <sup>st</sup> Month of the Quarter
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt18" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt18" data-print-control="text" data-print-value="" id="frm1602Q:txt18" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt18"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">19</span>
                      <span class="wh-inline-03a8728904b3">
                        2
                        <sup>nd</sup> Month of the Quarter
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt19" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt19" data-print-control="text" data-print-value="" id="frm1602Q:txt19" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt19"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">20</span>
                      <span class="wh-inline-f0cb0021883b">
                        Tax Remitted in Return Previously Filed, if this is an
                        amended return
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt20" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt20" data-print-control="text" data-print-value="" id="frm1602Q:txt20" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt20"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">21</span>
                      <span class="wh-inline-f0cb0021883b">
                        Over-remittance from Previous Quarter of the same
                        taxable year
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt21" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt21" data-print-control="text" data-print-value="" id="frm1602Q:txt21" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt21"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">22</span>
                      <span class="wh-inline-cb3a2164388b">
                        Total Remittances Made (Sum of Items 18 to 21)
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt22" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt22" data-print-control="text" data-print-value="" id="frm1602Q:txt22" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt22"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">23</span>
                      <span class="wh-inline-cb3a2164388b">
                        <b>Tax Still Due</b> / (Over-remittance) (Item 17 Less Item
                        22)
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt23" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt23" data-print-control="text" data-print-value="" id="frm1602Q:txt23" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt23"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="wh-inline-593a732bee33">Add Penalties:</span>
                      <span class="item-number">24</span>
                      <span class="wh-inline-cb3a2164388b"> Surcharge </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt24" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt24" data-print-control="text" data-print-value="" id="frm1602Q:txt24" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt24"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number wh-inline-aa9adc25c11a">25</span>
                      <span class="wh-inline-cb3a2164388b"> Interest </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt25" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt25" data-print-control="text" data-print-value="" id="frm1602Q:txt25" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt25"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number wh-inline-aa9adc25c11a">26</span>
                      <span class="wh-inline-cb3a2164388b"> Compromise </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt26" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt26" data-print-control="text" data-print-value="" id="frm1602Q:txt26" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt26"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number wh-inline-aa9adc25c11a">27</span>
                      <span class="wh-inline-cb3a2164388b">
                        Total Penalties (Sum of Items 24 to 26)
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt27" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt27" data-print-control="text" data-print-value="" id="frm1602Q:txt27" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt27"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5c648a859fec">
                      <span class="item-number">28</span>
                      <span class="wh-inline-cb3a2164388b">
                        <b>TOTAL AMOUNT STILL DUE</b> / (Over-remittance) (Sum of
                        Items 23 and 27)
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-3e6f569dee25">
                      <input aria-label="txt28" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1602Q:txt28" data-print-control="text" data-print-value="" id="frm1602Q:txt28" maxlength="25" readonly size="20" type="text" value={model.text["frm1602Q:txt28"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-4c94f61f6b8f"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-d12ca8bcfa10">
                              <span class="wh-inline-e2d900ea144f">
                                If over-remittance, mark one (1) box only
                              </span>
                              <input aria-label="OverRemittance1" checked={model.checks["frm1602Q:OverRemittance1"] ?? false} data-field-id="frm1602Q:OverRemittance1" data-print-control="radio" disabled id="frm1602Q:OverRemittance1" type="radio"/>
                              <span class="wh-inline-534e2278e92c"
                                >To be refunded</span
                              >
                            </td>
                            <td class="wh-inline-b9f313c85aab">
                              <input aria-label="OverRemittance2" checked={model.checks["frm1602Q:OverRemittance2"] ?? false} data-field-id="frm1602Q:OverRemittance2" data-print-control="radio" disabled id="frm1602Q:OverRemittance2" type="radio"/>
                              <span class="wh-inline-534e2278e92c"
                                >To be issued Tax Credit Certificate</span
                              >
                            </td>
                            <td class="wh-inline-f8ef15f5a28f">
                              <table class="wh-inline-029ba9e4149b">
                                <tbody
                                  ><tr>
                                    <td>
                                      <input aria-label="OverRemittance3" checked={model.checks["frm1602Q:OverRemittance3"] ?? false} data-field-id="frm1602Q:OverRemittance3" data-print-control="radio" disabled id="frm1602Q:OverRemittance3" type="radio"/>
                                    </td>
                                    <td>
                                      <span class="wh-inline-534e2278e92c">
                                        To be carried over to the next quarter
                                        within the same calendar year (not
                                        applicable for succeeding year)
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-458c61b1bc50">
                      <span class="wh-inline-cb3a2164388b">
                        We declare under the penalties of perjury that this
                        remittance return, and all its attachments, have been
                        made in good faith , verified by us, and to the best of
                        our knowledge and belief, is true and correct, pursuant
                        pursuant to the provisions of the National Internal
                        Revenue Code, as amended, and the regulations issued
                        under authority thereof. (If Authorized Representative,
                        attach authorization letter)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table class="tblForm wh-inline-e5263d19364e">
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-e4e210f9b7af" colspan="5">
                      <div class="wh-inline-62c7b1cc0b82">
                        ___________________________________________________________
                      </div>
                      <div class="wh-inline-62c7b1cc0b82">
                        <span class="wh-inline-cb3a2164388b">
                          Signature over Printed Name of President / Vice
                          President /
                        </span>
                      </div>
                      <div class="wh-inline-62c7b1cc0b82">
                        <span class="wh-inline-cb3a2164388b">
                          Authorized Officer or Representative / Tax Agent
                          (Indicate Title / Designation and TIN)
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table class="tblForm wh-inline-e5263d19364e">
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-edf8a46da083">
                      <span class="wh-inline-cb3a2164388b">
                        Tax Accreditation No./
                        <br /> Attorney's Roll No. (If Applicable)
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-0998070a53d2"> </td>
                    <td class="tblFormTd wh-inline-966154746f0c">
                      <span class="wh-inline-cb3a2164388b">
                        Date of Issue
                        <br /> (MM/DD/YYYY)
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-0aad5949aab4"> </td>
                    <td class="tblFormTd wh-inline-966154746f0c">
                      <span class="wh-inline-cb3a2164388b">
                        Date of Expiry
                        <br /> (MM/DD/YY)
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-0aad5949aab4"> </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-e5263d19364e"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-a83cd8bc6e20">
                      <span class="wh-inline-4cf6c17959a7"
                        >Part III - Details of Payment</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table class="tblForm wh-inline-e5263d19364e">
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-2a73dab8dcf6">
                      <span class="wh-inline-cb3a2164388b">Particulars</span>
                    </td>
                    <td class="tblFormTd wh-inline-72b475cda0b8">
                      <span class="wh-inline-cb3a2164388b"
                        >Drawee Bank / Agency</span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-1a31e2039861">
                      <span class="wh-inline-cb3a2164388b">Number</span>
                    </td>
                    <td class="tblFormTd wh-inline-72b475cda0b8">
                      <span class="wh-inline-cb3a2164388b">Date (MM/DD/YY)</span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-2a73dab8dcf6">
                      <span class="wh-inline-cb3a2164388b">Amount</span>
                    </td>
                  </tr>
                  <tr class="wh-inline-4d65ff6ed898">
                    <td class="tblFormTd">
                      <span class="item-number">29</span>
                      <span class="wh-inline-cb3a2164388b">Cash Bank</span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"> </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"> </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr class="wh-inline-4d65ff6ed898">
                    <td class="tblFormTd">
                      <span class="item-number">30</span>
                      <span class="wh-inline-cb3a2164388b">Check</span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr class="wh-inline-4d65ff6ed898">
                    <td class="tblFormTd" colspan="2">
                      <span class="item-number">31</span>
                      <span class="wh-inline-cb3a2164388b">Tax Debit Memo</span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number">32</span>
                      <span class="wh-inline-cb3a2164388b"
                        >Others (specify below)</span
                      >
                    </td>
                  </tr>
                  <tr class="wh-inline-4d65ff6ed898">
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr class="wh-inline-ac633b451002">
                    <td class="tblFormTd wh-inline-faa045759e22" colspan="4">
                      <span class="wh-inline-cb3a2164388b"
                        >Machine Validation / Revenue Official Receipt Details
                        (if not filed with an Authorized Agent Bank)</span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-faa045759e22">
                      <span class="wh-inline-cb3a2164388b"
                        >Stamp of Receiving Office / AAB and Date of Receipt
                        (RO's Signature / Bank Teller's Initial)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1602qv2018-2"
    data-source-page="2"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page2">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-02ce50fc59ff"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-699d694f4026"
              >
                <tbody>
                  <tr>
                    <td class="wh-inline-b729759b3aa0">
                      <span class="wh-inline-429482632af7"
                        >BIR Form No.
                        <br />
                      </span>
                      <span class="wh-inline-329eb41f06fd">1602Q </span>
                      <span class="wh-inline-429482632af7">January 2018</span>
                      <br />
                      <span class="wh-inline-429482632af7">
                        <b>Page 2</b>
                      </span>
                    </td>
                    <td class="wh-inline-6be899438162">
                      <span class="wh-inline-aec978eca301"
                        >Quarterly Remittance Return</span
                      >
                      <br />
                      <p class="wh-inline-e2d359fdda59">
                        <span class="wh-inline-9043f09f0f64"
                          >of Final Taxes Withheld on Interest Paid on Deposits
                          and Deposits Substitutes/Trusts/Etc.
                        </span>
                      </p>
                    </td>
                    <td class="wh-inline-b41f9158b2dd">
                      <div class="wh-inline-f53335c779da">
                        <img
                          alt="BIR form identifying mark"
                          src="/legacy/img/withholding/original-28c4d3fd6603157d.png"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-e5263d19364e"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-d9f8b596c968">
                      <span class="wh-inline-cb3a2164388b">TIN</span>
                    </td>
                    <td class="tblFormTd wh-inline-72ce62f35dcc">
                      <span class="wh-inline-cb3a2164388b"
                        >Withholding Agent's Name</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <input class="wh-source-size-45" aria-label="txtPage2TIN" data-field-id="frm1602Q:txtPage2TIN" data-print-control="text" data-print-value="" id="frm1602Q:txtPage2TIN" maxlength="70" readonly size="45" type="text" value={model.text["frm1602Q:txtPage2TIN"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input class="wh-source-size-70" aria-label="txtPage2Agent" data-field-id="frm1602Q:txtPage2Agent" data-print-control="text" data-print-value="" id="frm1602Q:txtPage2Agent" maxlength="70" readonly size="70" type="text" value={model.text["frm1602Q:txtPage2Agent"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-4c94f61f6b8f"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-62c7b1cc0b82">
                              <span class="wh-inline-4cf6c17959a7"
                                >Part IV - Details of Taxes Withheld</span
                              >
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="item-number"> Schedule 1 </span>
                      <span class="wh-inline-cb3a2164388b">
                        - Details of Interest Payments and Tax Withheld Based on
                      </span>
                      <span class="wh-inline-dd2eceacf41a">
                        Regular RATES
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd wh-inline-387693afd380">
                      <span class="wh-inline-cb3a2164388b"> ATC </span>
                    </td>
                    <td class="tblFormTd wh-inline-fae77e17261d">
                      <span class="wh-inline-cb3a2164388b">
                        Total Interest / Yield Paid / Accrued / Amount
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-568f68a41aef">
                      <span class="wh-inline-cb3a2164388b"> Tax Rate </span>
                    </td>
                    <td class="tblFormTd wh-inline-ebf57b60f317">
                      <span class="wh-inline-cb3a2164388b">
                        BSP Exchange Rate on the Date of Remittance
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-fae77e17261d">
                      <span class="wh-inline-cb3a2164388b">
                        Taxes Withheld
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number"> Savings Deposit </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 1 </span>
                      <span class="wh-inline-cb3a2164388b"> WI161 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount1" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount1" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount1"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate1"
                        id="frm1602Q:fntSched1TaxRate1"
                        >{model.text["frm1602Q:fntSched1TaxRate1"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax1" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax1" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax1"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 2 </span>
                      <span class="wh-inline-cb3a2164388b"> WC161 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount2" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount2" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount2"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate2"
                        id="frm1602Q:fntSched1TaxRate2"
                        >{model.text["frm1602Q:fntSched1TaxRate2"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax2" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax2" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax2"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number"> Time Deposit </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 3 </span>
                      <span class="wh-inline-cb3a2164388b"> WI161 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount3" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount3" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount3" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount3"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate3"
                        id="frm1602Q:fntSched1TaxRate3"
                        >{model.text["frm1602Q:fntSched1TaxRate3"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax3" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax3" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax3" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax3"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 4 </span>
                      <span class="wh-inline-cb3a2164388b"> WC161 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount4" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount4" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount4" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount4"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate4"
                        id="frm1602Q:fntSched1TaxRate4"
                        >{model.text["frm1602Q:fntSched1TaxRate4"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax4" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax4" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax4" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax4"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number"> Government Securities </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 5 </span>
                      <span class="wh-inline-cb3a2164388b"> WI162 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount5" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount5" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount5" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount5"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate5"
                        id="frm1602Q:fntSched1TaxRate5"
                        >{model.text["frm1602Q:fntSched1TaxRate5"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax5" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax5" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax5" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax5"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 6 </span>
                      <span class="wh-inline-cb3a2164388b"> WC162 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount6" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount6" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount6" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount6"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate6"
                        id="frm1602Q:fntSched1TaxRate6"
                        >{model.text["frm1602Q:fntSched1TaxRate6"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax6" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax6" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax6" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax6"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number">
                        Deposit Substitutes / Others
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 7 </span>
                      <span class="wh-inline-cb3a2164388b"> WI163 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount7" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount7" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount7" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount7"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate7"
                        id="frm1602Q:fntSched1TaxRate7"
                        >{model.text["frm1602Q:fntSched1TaxRate7"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax7" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax7" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax7" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax7"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 8 </span>
                      <span class="wh-inline-cb3a2164388b"> WC163 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount8" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount8" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount8" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount8"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate8"
                        id="frm1602Q:fntSched1TaxRate8"
                        >{model.text["frm1602Q:fntSched1TaxRate8"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax8" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax8" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax8" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax8"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number">
                        Pre-terminated Long-Term Deposits / Investments
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 9 </span>
                      <span class="wh-inline-cb3a2164388b"> WI440 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount9" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount9" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount9" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount9"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate9"
                        id="frm1602Q:fntSched1TaxRate9"
                        >{model.text["frm1602Q:fntSched1TaxRate9"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax9" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax9" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax9" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax9"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 10 </span>
                      <span class="wh-inline-cb3a2164388b"> WI441 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount10" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount10" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount10" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount10"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate10"
                        id="frm1602Q:fntSched1TaxRate10"
                        >{model.text["frm1602Q:fntSched1TaxRate10"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax10" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax10" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax10" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax10"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 11 </span>
                      <span class="wh-inline-cb3a2164388b"> WI442 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount11" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount11" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount11" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount11"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate11"
                        id="frm1602Q:fntSched1TaxRate11"
                        >{model.text["frm1602Q:fntSched1TaxRate11"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax11" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax11" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax11" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax11"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 12 </span>
                      <span class="wh-inline-cb3a2164388b"> WC440 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount12" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount12" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount12" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount12"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span
                        class="wh-inline-cb3a2164388b"
                        data-field-id="frm1602Q:fntSched1TaxRate12"
                        id="frm1602Q:fntSched1TaxRate12"
                        >{model.text["frm1602Q:fntSched1TaxRate12"] ?? ""}</span
                      >
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax12" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax12" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax12" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax12"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number">
                        Foreign Currency Deposit
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 13 </span>
                      <span class="wh-inline-cb3a2164388b"> WI170 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount13" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount13" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount13" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount13"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <input aria-label="txtSched1TaxRate13" class="wh-inline-62c7b1cc0b82 wh-source-size-2" data-field-id="frm1602Q:txtSched1TaxRate13" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1TaxRate13" maxlength="4" readonly size="2" type="text" value={model.text["frm1602Q:txtSched1TaxRate13"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Rate13" class="wh-inline-386bb5d6139a wh-source-size-14" data-field-id="frm1602Q:txtSched1Rate13" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Rate13" maxlength="6" readonly size="14" type="text" value={model.text["frm1602Q:txtSched1Rate13"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax13" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax13" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax13" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax13"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 14 </span>
                      <span class="wh-inline-cb3a2164388b"> WC170 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount14" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount14" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount14" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount14"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <input aria-label="txtSched1TaxRate14" class="wh-inline-62c7b1cc0b82 wh-source-size-2" data-field-id="frm1602Q:txtSched1TaxRate14" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1TaxRate14" maxlength="4" readonly size="2" type="text" value={model.text["frm1602Q:txtSched1TaxRate14"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Rate14" class="wh-inline-386bb5d6139a wh-source-size-14" data-field-id="frm1602Q:txtSched1Rate14" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Rate14" maxlength="6" readonly size="14" type="text" value={model.text["frm1602Q:txtSched1Rate14"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax14" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax14" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax14" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax14"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="5">
                      <span class="item-number">
                        On Amounts Withdrawn from Decent's Deposit Account
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 15 </span>
                      <span class="wh-inline-cb3a2164388b"> WI165 </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Amount15" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Amount15" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Amount15" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Amount15"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span class="wh-inline-cb3a2164388b"> 6% </span>
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Tax15" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Tax15" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Tax15" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Tax15"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="4">
                      <span class="item-number"> 16 </span>
                      <span class="wh-inline-cb3a2164388b">
                        Total Taxes Withheld Based on Regular Rates (Sums of
                        Items 1 to 15) (To Part II, Item 14)
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched1Total" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched1Total" data-print-control="text" data-print-value="" id="frm1602Q:txtSched1Total" readonly size="40" type="text" value={model.text["frm1602Q:txtSched1Total"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="item-number"> Schedule 2 </span>
                      <span class="wh-inline-cb3a2164388b">
                        - Details of Interest Payments and Tax Withheld Based on
                      </span>
                      <span class="wh-inline-68475f995fc0">
                        TAX TREATY RATES
                      </span>
                      <span class="wh-inline-cb3a2164388b">
                        (attach additional sheets /s, if necessary)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-966154746f0c">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty Code
                        <br /> (Refer to Sched 5)
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-44a7722fc2e0">
                      <span class="wh-inline-cb3a2164388b">
                        ATC
                        <br /> (same ATC in Sched 1)
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-3eb187933447">
                      <span class="wh-inline-cb3a2164388b">
                        Total Interest
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-7673236d60c8">
                      <span class="wh-inline-cb3a2164388b">
                        Tax
                        <br /> Rate
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd wh-inline-e2c5573ce81c">
                      <span class="wh-inline-cb3a2164388b">
                        Taxes Withheld
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 1 </span>
                      <input class="wh-source-size-6" aria-label="txtSched2TreatyCode1" data-field-id="frm1602Q:txtSched2TreatyCode1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2TreatyCode1" maxlength="3" readonly size="6" type="text" value={model.text["frm1602Q:txtSched2TreatyCode1"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input class="wh-source-size-14" aria-label="txtSched2ATC1" data-field-id="frm1602Q:txtSched2ATC1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2ATC1" maxlength="5" readonly size="14" type="text" value={model.text["frm1602Q:txtSched2ATC1"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched2Interest1" class="wh-inline-386bb5d6139a wh-source-size-38" data-field-id="frm1602Q:txtSched2Interest1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2Interest1" maxlength="25" readonly size="38" type="text" value={model.text["frm1602Q:txtSched2Interest1"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched2TaxRate1" class="wh-inline-386bb5d6139a wh-source-size-2" data-field-id="frm1602Q:txtSched2TaxRate1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2TaxRate1" maxlength="4" readonly size="2" type="text" value={model.text["frm1602Q:txtSched2TaxRate1"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched2TaxesWithheld1" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched2TaxesWithheld1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2TaxesWithheld1" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched2TaxesWithheld1"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 2 </span>
                      <input class="wh-source-size-6" aria-label="txtSched2TreatyCode2" data-field-id="frm1602Q:txtSched2TreatyCode2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2TreatyCode2" maxlength="3" readonly size="6" type="text" value={model.text["frm1602Q:txtSched2TreatyCode2"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input class="wh-source-size-14" aria-label="txtSched2ATC2" data-field-id="frm1602Q:txtSched2ATC2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2ATC2" maxlength="5" readonly size="14" type="text" value={model.text["frm1602Q:txtSched2ATC2"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched2Interest2" class="wh-inline-386bb5d6139a wh-source-size-38" data-field-id="frm1602Q:txtSched2Interest2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2Interest2" maxlength="25" readonly size="38" type="text" value={model.text["frm1602Q:txtSched2Interest2"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched2TaxRate2" class="wh-inline-386bb5d6139a wh-source-size-2" data-field-id="frm1602Q:txtSched2TaxRate2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2TaxRate2" maxlength="4" readonly size="2" type="text" value={model.text["frm1602Q:txtSched2TaxRate2"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched2TaxesWithheld2" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched2TaxesWithheld2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2TaxesWithheld2" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched2TaxesWithheld2"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="4">
                      <span class="item-number"> 3 </span>
                      <span class="wh-inline-cb3a2164388b">
                        Total Taxes Withheld Based on Tax Treaty Rates (Sums of
                        Items 1 and 2) (To Part II, Item 15)
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched2Total" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched2Total" data-print-control="text" data-print-value="" id="frm1602Q:txtSched2Total" maxlength="25" readonly size="40" type="text" value={model.text["frm1602Q:txtSched2Total"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="item-number"> Schedule 3 </span>
                      <span class="wh-inline-cb3a2164388b">
                        - Details of INterest Payments and Tax Withheld on
                        Taxpayers (TPs) Enjoying
                        <b>PREFERENTIAL RATES</b> (attach additional sheet/s, if necessary)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-6a7b02feefbd">
                      <span class="wh-inline-cb3a2164388b">
                        Investment Promotion
                        <br /> Agency (IPA) Code
                        <br /> (Refer to Sched 6)
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-72b0809b0bb2">
                      <span class="wh-inline-cb3a2164388b"> ATC </span>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span class="wh-inline-cb3a2164388b">
                        Total Interest
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span class="wh-inline-cb3a2164388b">
                        Tax
                        <br /> Rate
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span class="wh-inline-cb3a2164388b">
                        Taxes Withheld
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 1 </span>
                      <input class="wh-source-size-18" aria-label="txtSched3IPA1" data-field-id="frm1602Q:txtSched3IPA1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3IPA1" maxlength="6" readonly size="18" type="text" value={model.text["frm1602Q:txtSched3IPA1"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span class="wh-inline-cb3a2164388b">
                        <b>WC390</b>
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched3TotInterest1" class="wh-inline-386bb5d6139a wh-source-size-38" data-field-id="frm1602Q:txtSched3TotInterest1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3TotInterest1" maxlength="15" readonly size="38" type="text" value={model.text["frm1602Q:txtSched3TotInterest1"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched3TaxRate1" class="wh-inline-386bb5d6139a wh-source-size-2" data-field-id="frm1602Q:txtSched3TaxRate1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3TaxRate1" maxlength="4" readonly size="2" type="text" value={model.text["frm1602Q:txtSched3TaxRate1"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched3TaxWithheld1" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched3TaxWithheld1" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3TaxWithheld1" readonly size="40" type="text" value={model.text["frm1602Q:txtSched3TaxWithheld1"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="item-number"> 2 </span>
                      <input class="wh-source-size-18" aria-label="txtSched3IPA2" data-field-id="frm1602Q:txtSched3IPA2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3IPA2" maxlength="6" readonly size="18" type="text" value={model.text["frm1602Q:txtSched3IPA2"] ?? ""}>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82">
                      <span class="wh-inline-cb3a2164388b">
                        <b>WC390</b>
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched3TotInterest2" class="wh-inline-386bb5d6139a wh-source-size-38" data-field-id="frm1602Q:txtSched3TotInterest2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3TotInterest2" maxlength="15" readonly size="38" type="text" value={model.text["frm1602Q:txtSched3TotInterest2"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched3TaxRate2" class="wh-inline-386bb5d6139a wh-source-size-2" data-field-id="frm1602Q:txtSched3TaxRate2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3TaxRate2" maxlength="4" readonly size="2" type="text" value={model.text["frm1602Q:txtSched3TaxRate2"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched3TaxWithheld2" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched3TaxWithheld2" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3TaxWithheld2" maxlength="15" readonly size="40" type="text" value={model.text["frm1602Q:txtSched3TaxWithheld2"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd" colspan="4">
                      <span class="item-number"> 3 </span>
                      <span class="wh-inline-cb3a2164388b">
                        Total Taxes Withheld on TPs Enjoying Preferential Rates
                        (Sum of Items 1 &amp; 2) (To Part II, Item 16)
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <input aria-label="txtSched3Total" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1602Q:txtSched3Total" data-print-control="text" data-print-value="" id="frm1602Q:txtSched3Total" maxlength="15" readonly size="40" type="text" value={model.text["frm1602Q:txtSched3Total"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="item-number"> Schedule 4 </span>
                      <span class="wh-inline-cb3a2164388b">
                        - Summary of Interest / Yield Paid and Accrued for the
                        Month
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-0d59d8a561e0" rowspan="2">
                      <span class="wh-inline-cb3a2164388b"> Particulars </span>
                    </td>
                    <td class="tblFormTd wh-inline-62c7b1cc0b82" colspan="3">
                      <b>BANKS</b>
                    </td>
                    <td class="tblFormTd wh-inline-0d59d8a561e0" rowspan="2">
                      <span class="wh-inline-cb3a2164388b">
                        Institutions Other Than Banks
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-44a7722fc2e0">
                      <span class="wh-inline-cb3a2164388b">
                        Regular Banking Unit
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-6a7b02feefbd">
                      <span class="wh-inline-cb3a2164388b">
                        Foreign Currency Deposit
                        <br /> Unit
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-44a7722fc2e0">
                      <span class="wh-inline-cb3a2164388b"> Total </span>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-a2554e69d698">
                      <span class="wh-inline-cb3a2164388b">
                        1. On Deposit Liabilities
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b"> Taxable </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b"> Exempt </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-a2554e69d698">
                      <span class="wh-inline-cb3a2164388b">
                        2. On Bills Payables / Borrowed Funds
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b"> Taxable </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b"> Exempt </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-a2554e69d698">
                      <span class="wh-inline-cb3a2164388b">
                        3. Long Term Deposit on Investment
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b">
                        Four (4) years to less than five (5) years
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b">
                        Three (3) years to less than four (4) years
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b">
                        Less than Three (3) years
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b"> Exempt </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-a2554e69d698">
                      <span class="wh-inline-cb3a2164388b"> 4. Others </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b"> Taxable </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-4fee2ff9eec2">
                      <span class="wh-inline-cb3a2164388b"> Exempt </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                  <tr>
                    <td class="tblFormTd wh-inline-a2554e69d698">
                      <span class="wh-inline-cb3a2164388b">
                        Total Interest Expense per Books / FS
                      </span>
                    </td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                    <td class="tblFormTd wh-inline-020b9c4d87ff"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1602qv2018-3"
    data-source-page="3"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page3">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-02ce50fc59ff"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-699d694f4026"
              >
                <tbody>
                  <tr>
                    <td class="wh-inline-b729759b3aa0">
                      <span class="wh-inline-429482632af7"
                        >BIR Form No.
                        <br />
                      </span>
                      <span class="wh-inline-329eb41f06fd">1602Q </span>
                      <span class="wh-inline-429482632af7">January 2018</span>
                      <br />
                      <span class="wh-inline-429482632af7">
                        <b>Page 3</b>
                      </span>
                    </td>
                    <td class="wh-inline-6be899438162">
                      <span class="wh-inline-aec978eca301"
                        >Quarterly Remittance Return</span
                      >
                      <br />
                      <p class="wh-inline-e2d359fdda59">
                        <span class="wh-inline-9043f09f0f64"
                          >of Final Taxes Withheld on Interest Paid on Deposits
                          and Deposits Substitutes/Trusts/Etc.
                        </span>
                      </p>
                    </td>
                    <td class="wh-inline-b41f9158b2dd">
                      <div class="wh-inline-f53335c779da">
                        <img
                          alt="BIR form identifying mark"
                          src="/legacy/img/withholding/original-580a5b376dba7239.png"
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-e5263d19364e"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-d9f8b596c968">
                      <span class="wh-inline-cb3a2164388b">TIN</span>
                    </td>
                    <td class="tblFormTd wh-inline-72ce62f35dcc">
                      <span class="wh-inline-cb3a2164388b"
                        >Withholding Agent's Name</span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <input class="wh-source-size-45" aria-label="txtPage3TIN" data-field-id="frm1602Q:txtPage3TIN" data-print-control="text" data-print-value="" id="frm1602Q:txtPage3TIN" maxlength="70" readonly size="45" type="text" value={model.text["frm1602Q:txtPage3TIN"] ?? ""}>
                    </td>
                    <td class="tblFormTd">
                      <input class="wh-source-size-70" aria-label="txtPage3Agent" data-field-id="frm1602Q:txtPage3Agent" data-print-control="text" data-print-value="" id="frm1602Q:txtPage3Agent" maxlength="70" readonly size="70" type="text" value={model.text["frm1602Q:txtPage3Agent"] ?? ""}>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="item-number"> Schedule 5 </span>
                      <span class="wh-inline-cb3a2164388b">
                        - Tax Treaty Code
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty
                        <br /> Code
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Country </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty
                        <br /> Code
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Country </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty
                        <br /> Code
                        <br /></span
                      >
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Country </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty
                        <br /> Code
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Country </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty
                        <br /> Code
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Country </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty
                        <br /> Code
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Country </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Treaty
                        <br /> Code
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Country </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> AU </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Australia </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> CA </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Canada </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> DE </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Germany </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> JP </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Japan </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> NG </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Nigeria </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> SG </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Singapore </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> UAE </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        United Arab Emirates
                      </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> AT </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Austria </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> CN </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> China </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> HU </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Hungary </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> KR </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Korea </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> NO </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Norway </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> ES </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Spain </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> GB </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        United Kingdom
                      </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> BH </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Bahrain </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> CZ </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Czech Republic
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> IN </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> India </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> KW </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Kuwait </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> PK </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Pakistan </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> SE </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Sweden </span>
                    </td>
                    <td class="tblFormTd" rowspan="2">
                      <span class="wh-inline-cb3a2164388b"> US </span>
                    </td>
                    <td class="tblFormTd" rowspan="2">
                      <span class="wh-inline-cb3a2164388b">
                        United States of
                        <br /> America
                      </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> BD </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Bangladesh </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> DK </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Denmark </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> ID </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Indonesia </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> MY </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Malaysia </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> PL </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Poland </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> CH </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Switzerland </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> BE </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Belgium </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> FI </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Finland </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> IL </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Israel </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> NL </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Netherlands </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> RO </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Romania </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> TH </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Thailand </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> VN </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Vietnam </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> BR </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Brazil </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> FR </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> France </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> IT </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Italy </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> NZ </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> New Zealand </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> RU </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> Russia </span>
                    </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd"> </td>
                    <td class="tblFormTd"> </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="item-number"> Schedule 6 </span>
                      <span class="wh-inline-cb3a2164388b">
                        - Investment Promotion Agency Tabulation
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0792a8a3b1f3"
              >
                <tbody
                  ><tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> APECO </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Aurora Pacific Economic Zone and Freeport Authority
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> CDC </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Clark Development Authority
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> SBMA </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Subic Bay Metropolitan Authority
                      </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> AFAB </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Authority of the Freeport Area of Bataan
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> JHMC </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        John Hay Management Corporation
                      </span>
                    </td>
                    <td class="tblFormTd" rowspan="2">
                      <span class="wh-inline-cb3a2164388b"> TIEZA </span>
                    </td>
                    <td class="tblFormTd" rowspan="2">
                      <span class="wh-inline-cb3a2164388b">
                        Tourism Infrastructure and
                        <br /> Enterprise Zone Authority
                      </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> BCDA </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Bases Conversion and Development Authority
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> PEZA </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Philippine Economic Zone Authority
                      </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> BOI </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Board of Investments
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> PPMC </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Poro Point Management Corporation
                      </span>
                    </td>
                    <td class="tblFormTd" rowspan="2">
                      <span class="wh-inline-cb3a2164388b"> ZCSEZA </span>
                    </td>
                    <td class="tblFormTd" rowspan="2">
                      <span class="wh-inline-cb3a2164388b">
                        Zamboanga City Special
                        <br /> Economic Zone Authority
                      </span>
                    </td>
                  </tr>
                  <tr class="wh-inline-62c7b1cc0b82">
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> CEZA </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Cagayan Economic Zone Authority
                      </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b"> RBOI-ARMM </span>
                    </td>
                    <td class="tblFormTd">
                      <span class="wh-inline-cb3a2164388b">
                        Regional Board of Investment-Autonomous Region of Muslim
                        Mindanao
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>
  </div>
  {#each model.continuations as continuation (continuation.id)}
    <div
      class="withholding-print-page-content wh-continuation-page"
      data-source-page="continuation"
    >
      <section class="original-continuation withholding-print-continuation">
        <h2>BIR Form 1602Qv2018 — {continuation.title}</h2>
        <p>{model.taxpayerName} · TIN {model.tin}</p>
        <table>
          <thead
            ><tr
              ><th scope="col">Item</th
              >{#each continuation.columns as column, index (index)}<th
                  scope="col">{column}</th
                >{/each}</tr
            ></thead
          >
          <tbody
            >{#each continuation.rows as row (row.id)}<tr
                ><td>{row.label}</td>{#each row.cells as cell (cell.id)}<td
                    data-field-id={cell.id}>{cell.value}</td
                  >{/each}</tr
              >{/each}</tbody
          >
        </table>
      </section>
  </div>{/each}
</article>
