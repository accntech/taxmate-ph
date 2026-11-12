<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1601c:txtMonth",
    "fallback": "",
    "options": {
      "01": "01 - January",
      "02": "02 - February",
      "03": "03 - March",
      "04": "04 - April",
      "05": "05 - May",
      "06": "06 - June",
      "07": "07 - July",
      "08": "08 - August",
      "09": "09 - September",
      "10": "10 - October",
      "11": "11 - November",
      "12": "12 - December"
    }
  },
  {
    "id": "frm1601c:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1601c:AmendedRtn_1",
    "source": "frm1601c:AmendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:AmendedRtn_2",
    "source": "frm1601c:AmendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601c:TaxWithheld_1",
    "source": "frm1601c:TaxWithheld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:TaxWithheld_2",
    "source": "frm1601c:TaxWithheld",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1601c:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1601c:txtATC",
    "fallback": "WW010"
  },
  {
    "id": "frm1601c:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1601c:txtRDOCode"
  },
  {
    "id": "frm1601c:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAddress2",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1601c:CatAgent_P",
    "source": "frm1601c:CatAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1601c:CatAgent_G",
    "source": "frm1601c:CatAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "txtEmail",
    "fallback": ""
  },
  {
    "id": "frm1601c:SpecialTax_1",
    "source": "frm1601c:SpecialTax",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:SpecialTax_2",
    "source": "frm1601c:SpecialTax",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601c:selTreaty",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty",
      "3": "Both"
    }
  },
  {
    "id": "frm1601c:txtTax14",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax15",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax16",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax17",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax18",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax19",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txt20Other",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtTax20",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax21",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax22",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax23",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax24",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax25",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax26",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax27",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax28",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txt29Other",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtTax29",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax30",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax31",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax32",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax33",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax34",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax35",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax36",
    "fallback": "0.00"
  },
  {
    "id": "txtTaxAgentNo",
    "fallback": ""
  },
  {
    "id": "txtDateIssue",
    "fallback": ""
  },
  {
    "id": "txtDateExpiry",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAgency37",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtNumber37",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtDate37",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAmount37",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAgency38",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtNumber38",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtDate38",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAmount38",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtNumber39",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtDate39",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAmount39",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtParticular40",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAgency40",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtNumber40",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtDate40",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAmount40",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtPg2TIN1",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtPg2TIN2",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtPg2TIN3",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtPg2BranchCode",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtPg2TaxpayerName",
    "fallback": ""
  },
  {
    "id": "chkScheduleDelete0",
    "source": "chkScheduleDelete0",
    "choice": "",
    "checked": false
  },
  {
    "id": "frm1601c:sched1:txtMonthYear0",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtDatePaid0",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtBankCode0",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtNumber0",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtTaxPaid0",
    "fallback": "0.00"
  },
  {
    "id": "chkScheduleDelete1",
    "source": "chkScheduleDelete1",
    "choice": "",
    "checked": false
  },
  {
    "id": "frm1601c:sched1:txtMonthYear1",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtDatePaid1",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtBankCode1",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtNumber1",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtTaxPaid1",
    "fallback": "0.00"
  },
  {
    "id": "chkScheduleDelete2",
    "source": "chkScheduleDelete2",
    "choice": "",
    "checked": false
  },
  {
    "id": "frm1601c:sched1:txtMonthYear2",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtDatePaid2",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtBankCode2",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtNumber2",
    "fallback": ""
  },
  {
    "id": "frm1601c:sched1:txtTaxPaid2",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:sched1:txtShouldTaxDue0",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:sched1:txtAdjustments0",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:sched1:txtShouldTaxDue1",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:sched1:txtAdjustments1",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:sched1:txtShouldTaxDue2",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:sched1:txtAdjustments2",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:sched1:txtTotal1",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1601Cv2018", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1601Cv2018"
  aria-label="BIR Form 1601Cv2018 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1601cv2018-1"
    data-source-page="1"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page1Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-5b58462227a5"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-b2017271a05e">
                      <p>
                        <img
                          alt="BIR form identifying mark"
                          class="wh-inline-5dfba9815e30"
                          src="/legacy/img/withholding/original-6c831e35170ff5f3.png"
                          width="80"
                        />
                      </p>
                    </td>
                    <td>
                      <p>
                        <img
                          alt="BIR form identifying mark"
                          class="wh-inline-5dfba9815e30"
                          height="50px"
                          src="/legacy/img/withholding/original-496a4fcbfde5f354.png"
                          width="210"
                        />
                      </p>
                    </td>
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
                class="wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-e797b9c9ddc0">
                      <span class="wh-inline-429482632af7">BIR Form No.</span>
                      <br /><span class="wh-inline-aec978eca301">1601-C</span>
                      <br /><span class="wh-inline-429482632af7"
                        >January 2018 (ENCS)</span
                      >
                      <br /><span class="wh-inline-ccf4a15a8876">Page 1</span>
                    </td>
                    <td class="wh-inline-62471ef2f05a">
                      <span class="wh-inline-aec978eca301"
                        >Monthly Remittance Return</span
                      >
                      <br /><span class="wh-inline-1b29e9eb50ae"
                        >of Income Taxes Withheld on Compensation</span
                      >
                      <br /><span class="wh-inline-429482632af7"
                        >Enter all required information in CAPITAL LETTERS using
                        BLACK ink. Mark all applicable boxes with an "X". Two
                        copies MUST be filed with the BIR and one held by the
                        Tax Filer.</span
                      >
                    </td>
                    <td class="wh-inline-bef36932d3a7">
                      <p>
                        <img
                          alt="BIR form identifying mark"
                          class="wh-inline-5dfba9815e30"
                          height="75px"
                          src="/legacy/img/withholding/original-869e0a6cdf768d3d.png"
                          width="220"
                        />
                      </p>
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
                class="tblForm wh-inline-54d08581166d"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-90672b3573c1">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-b84aa3b23c1e"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                1
                              </span></td
                            >
                            <td colspan="2"
                              ><span class="wh-inline-cb3a2164388b"
                                >For the Month (MM/YYYY)</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td class="wh-inline-36fe9f8cef2e">
                              <span aria-label="txtMonth" class="iceSelOneMnu fieldSelect1 labels wh-print-select" data-field-id="frm1601c:txtMonth" data-print-control="select" id="frm1601c:txtMonth">{model.text["frm1601c:txtMonth"] ?? ""}</span>
                            </td>
                            <td class="wh-inline-9f262eec8c33">
                              <input aria-label="txtYear" class="wh-inline-fc1877413f42" data-field-id="frm1601c:txtYear" data-print-control="text" data-print-value="" id="frm1601c:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1601c:txtYear"] ?? ""}></td
                            >
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-dbb17c3c8c91">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-4e3ce05ba835"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                2
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >Amended Return?</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <fieldset
                                class="iceSelOneRb-dis fieldText1-dis wh-inline-3276beb56669"
                                id="frm1601c:j_id217"
                              >
                                <div class="wh-inline-5c8a2699196f">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="iceSelOneRb-dis fieldText1-dis wh-inline-2feb0d3fb9e3"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          ><input aria-label="AmendedRtn_1" checked={model.checks["frm1601c:AmendedRtn_1"] ?? false} data-field-id="frm1601c:AmendedRtn_1" data-print-control="radio" disabled id="frm1601c:AmendedRtn_1" type="radio"/><span class="wh-inline-534e2278e92c"
                                            >Yes</span
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="AmendedRtn_2" checked={model.checks["frm1601c:AmendedRtn_2"] ?? false} data-field-id="frm1601c:AmendedRtn_2" data-print-control="radio" disabled id="frm1601c:AmendedRtn_2" type="radio"/><span
                                            class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-534e2278e92c"
                                            >No</span
                                          ></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </fieldset>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-dbb17c3c8c91">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-72d9a09070a8"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                3
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >Any Taxes Withheld?</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <fieldset
                                class="iceSelOneRb fieldText1 wh-inline-3276beb56669"
                                id="frm1601c:j_id252"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="iceSelOneRb fieldText1 wh-inline-2feb0d3fb9e3"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        ><input aria-label="TaxWithheld_1" checked={model.checks["frm1601c:TaxWithheld_1"] ?? false} data-field-id="frm1601c:TaxWithheld_1" data-print-control="radio" disabled id="frm1601c:TaxWithheld_1" type="radio"/><span class="wh-inline-534e2278e92c"
                                          >Yes</span
                                        ></td
                                      >
                                      <td
                                        ><input aria-label="TaxWithheld_2" checked={model.checks["frm1601c:TaxWithheld_2"] ?? false} data-field-id="frm1601c:TaxWithheld_2" data-print-control="radio" disabled id="frm1601c:TaxWithheld_2" type="radio"/><span class="wh-inline-534e2278e92c"
                                          >No</span
                                        ></td
                                      >
                                    </tr>
                                  </tbody>
                                </table>
                              </fieldset>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-f4674c50c180">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-23d8444c5f38"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                4
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >Number of Sheet/s Attached</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td
                              ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1601c:txtSheets" data-print-control="text" data-print-value="" id="frm1601c:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1601c:txtSheets"] ?? ""}></td
                            >
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-8bd197d67f7d">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-c6f791f703b3"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                5
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">ATC</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td
                              ><input aria-label="txtATC" class="iceInpTxt-dis disabled-dis wh-inline-0467954d6d1a wh-source-size-5" data-field-id="frm1601c:txtATC" data-print-control="text" data-print-value="" id="frm1601c:txtATC" maxlength="20" readonly size="5" type="text" value={model.text["frm1601c:txtATC"] ?? ""}></td
                            >
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart wh-inline-261df5a44a38">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-e8b876838349"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >PART I - BACKGROUND INFORMATION</span
                                >
                              </div>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-5391bca72388">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-a0e48ae44494"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-15663751d502">
                                6
                              </span></td
                            >
                            <td>
                              <span class="wh-inline-cb3a2164388b"
                                >Taxpayer Identification Number (TIN)
                              </span>
                              <span class="wh-inline-649b1ec8a1ed">
                                <input class="wh-source-size-3" aria-label="txtTIN1" data-field-id="frm1601c:txtTIN1" data-print-control="text" data-print-value="" id="frm1601c:txtTIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1601c:txtTIN1"] ?? ""}>
                                / 
                                <input class="wh-source-size-3" aria-label="txtTIN2" data-field-id="frm1601c:txtTIN2" data-print-control="text" data-print-value="" id="frm1601c:txtTIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1601c:txtTIN2"] ?? ""}>
                                / 
                                <input class="wh-source-size-3" aria-label="txtTIN3" data-field-id="frm1601c:txtTIN3" data-print-control="text" data-print-value="" id="frm1601c:txtTIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1601c:txtTIN3"] ?? ""}>
                                / 
                                <input class="wh-source-size-5" aria-label="txtBranchCode" data-field-id="frm1601c:txtBranchCode" data-print-control="text" data-print-value="" id="frm1601c:txtBranchCode" maxlength="3" readonly size="5" type="text" value={model.text["frm1601c:txtBranchCode"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-dbb17c3c8c91">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-8c0f3bb17e92"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-d5086c4e2b16"
                              ><span class="wh-inline-15663751d502">
                                7
                              </span><span class="wh-inline-cb3a2164388b"
                                >RDO Code
                              </span></td
                            >
                            <td data-field-id="rdoSelect" id="rdoSelect"
                              >{model.text["rdoSelect"] ?? ""}</td
                            >
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-43d473076878"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-43d473076878"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-6e606d24db7d"
                                      ><span class="wh-inline-4cf6c17959a7">
                                        8
                                      </span></td
                                    >
                                    <td
                                      ><span class="wh-inline-cb3a2164388b"
                                        >Withholding Agent's Name <i
                                          >(Last Name, First Name, Middle Name
                                          for Individual OR Registered Name for
                                          Non-Individual)</i
                                        ></span
                                      ></td
                                    >
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
                                class="wh-inline-43d473076878"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-6b6ee2d44756"> </td>
                                    <td
                                      ><input class="wh-source-size-120" aria-label="txtTaxpayerName" data-field-id="frm1601c:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1601c:txtTaxpayerName" maxlength="50" readonly size="120" type="text" value={model.text["frm1601c:txtTaxpayerName"] ?? ""}></td
                                    >
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-b5bfcb1cc47d" colspan="2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-43d473076878"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-43d473076878"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-6e606d24db7d"
                                      ><span class="wh-inline-4cf6c17959a7">
                                        9
                                      </span></td
                                    >
                                    <td
                                      ><span class="wh-inline-cb3a2164388b"
                                        >Registered Address
                                      </span><span
                                        class="wh-inline-3115fb736f6a"
                                        ><i
                                          >(Indicate complete address. If
                                          branch, indicate the branch address.
                                          If the registered address is different
                                          from the current address, go to the
                                          RDO to update registered address by
                                          using BIR Form No. 1905)</i
                                        ></span
                                      ></td
                                    >
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
                                class="wh-inline-43d473076878"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-6b6ee2d44756"> </td>
                                    <td
                                      ><input class="wh-source-size-120" aria-label="txtAddress" data-field-id="frm1601c:txtAddress" data-print-control="text" data-print-value="" id="frm1601c:txtAddress" maxlength="100" readonly size="120" type="text" value={model.text["frm1601c:txtAddress"] ?? ""}></td
                                    >
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
                    <td class="tblFormTd wh-inline-83f54f89ef65">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-70c0b1b33a96"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6b6ee2d44756"> </td>
                            <td>
                              <input class="wh-source-size-85" aria-label="txtAddress2" data-field-id="frm1601c:txtAddress2" data-print-control="text" data-print-value="" id="frm1601c:txtAddress2" maxlength="50" readonly size="85" type="text" value={model.text["frm1601c:txtAddress2"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-06edca0e8248">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-05bb4cbd4f02"
                      >
                        <tbody
                          ><tr>
                            <td>
                              <span class="wh-inline-4cf6c17959a7">
                                9A
                              </span><span class="wh-inline-cb3a2164388b"
                                >Zip Code</span
                              >
                            </td>
                            <td>
                              <div class="wh-inline-a30033456d9a">
                                <input class="wh-source-size-2" aria-label="txtZipCode" data-field-id="frm1601c:txtZipCode" data-print-control="text" data-print-value="" id="frm1601c:txtZipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1601c:txtZipCode"] ?? ""}>
                              </div>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr
                    ><td class="tblFormTd wh-inline-69652284d042">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-bfc6ca2a827b"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-2e3ce3500fda">
                              <span class="wh-inline-4cf6c17959a7">
                                10
                              </span><span class="wh-inline-cb3a2164388b"
                                >Contact Number</span
                              ></td
                            >
                            <td>
                              <input class="wh-source-size-20" aria-label="txtTelNum" data-field-id="frm1601c:txtTelNum" data-print-control="text" data-print-value="" id="frm1601c:txtTelNum" maxlength="20" readonly size="20" type="text" value={model.text["frm1601c:txtTelNum"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-21f315789b7b">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-df2dda0e3650"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-57becd9072ec">
                              <span class="wh-inline-4cf6c17959a7">
                                11
                              </span><span class="wh-inline-cb3a2164388b"
                                >Category of Withholding Agent</span
                              >
                            </td>
                            <td>
                              <div class="wh-inline-9cb088a595d0">
                                <fieldset
                                  class="iceSelOneRb fieldText1 wh-inline-9c38840ab55a"
                                  id="frm1601c:j_id392"
                                >
                                  <div class="wh-inline-9284f1c636b2">
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="iceSelOneRb fieldText1 wh-inline-5c6dfcb90acd"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            ><input aria-label="CatAgent_P" checked={model.checks["frm1601c:CatAgent_P"] ?? false} data-field-id="frm1601c:CatAgent_P" data-print-control="radio" disabled id="frm1601c:CatAgent_P" type="radio"/><span
                                              class="wh-inline-534e2278e92c"
                                              >Private</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="CatAgent_G" checked={model.checks["frm1601c:CatAgent_G"] ?? false} data-field-id="frm1601c:CatAgent_G" data-print-control="radio" disabled id="frm1601c:CatAgent_G" type="radio"/><span
                                              class="wh-inline-534e2278e92c"
                                              >Government</span
                                            ></td
                                          >
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </fieldset>
                              </div>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr
                    ><td class="tblFormTd">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-43d473076878"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                12
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >Email Address</span
                              ></td
                            >
                            <td class="wh-inline-6b6ee2d44756"> </td>
                            <td
                              ><input class="wh-source-size-90" aria-label="txtEmail" data-field-id="txtEmail" data-print-control="text" data-print-value="" id="txtEmail" maxlength="60" readonly size="90" type="text" value={model.text["txtEmail"] ?? ""}></td
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-3ff0e92e1ada">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-f910d3a5c683"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6b54c08d76b2"
                              ><span class="wh-inline-4cf6c17959a7">
                                13
                              </span><span class="wh-inline-cb3a2164388b"
                                >Are there payees availing of tax relief under <br
                                /> Special Law or International Tax Treaty?</span
                              >
                            </td>
                            <td class="wh-inline-2e3ce3500fda">
                              <div>
                                <fieldset
                                  class="iceSelOneRb-dis fieldText1-dis wh-inline-d4b1b44400ed"
                                  id="frm1601c:j_id398"
                                >
                                  <div class="wh-inline-9284f1c636b2">
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="iceSelOneRb-dis fieldText1-dis wh-inline-2feb2201e019"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            ><input aria-label="SpecialTax_1" checked={model.checks["frm1601c:SpecialTax_1"] ?? false} data-field-id="frm1601c:SpecialTax_1" data-print-control="radio" disabled id="frm1601c:SpecialTax_1" type="radio"/><span
                                              class="wh-inline-534e2278e92c"
                                              >Yes</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="SpecialTax_2" checked={model.checks["frm1601c:SpecialTax_2"] ?? false} data-field-id="frm1601c:SpecialTax_2" data-print-control="radio" disabled id="frm1601c:SpecialTax_2" type="radio"/><span
                                              class="wh-inline-534e2278e92c"
                                              >No</span
                                            ></td
                                          >
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </fieldset>
                              </div>
                            </td>
                            <td class="wh-inline-6b6ee2d44756"> </td>
                            <td class="wh-inline-6b54c08d76b2">
                              <span class="wh-inline-4cf6c17959a7"> 13A </span>
                              <span
                                class="iceOutLbl fieldLabel1"
                                id="frm1601c:j_id401">If yes, specify</span
                              >
                              <span aria-label="selTreaty" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1601c:selTreaty" data-print-control="select" id="frm1601c:selTreaty">{model.text["frm1601c:selTreaty"] ?? ""}</span>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart wh-inline-261df5a44a38">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-e8b876838349"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >PART II - COMPUTATION OF TAX</span
                                >
                              </div>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-0ccf2333a336"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-3ef6362bb4b4"
                              ><span class="wh-inline-4cf6c17959a7">
                                14
                              </span></td
                            >
                            <td class="wh-inline-5fd1350a981f"
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Total Amount of Compensation
                              </span></td
                            >
                            <td class="wh-inline-7993ddde12b1">
                              <div class="spacePadder"></div>
                            </td>
                            <td class="wh-inline-a963f7da22b0">
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">14</span>
                                <input aria-label="txtTax14" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax14" data-print-control="text" data-print-value="" id="frm1601c:txtTax14" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax14"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7"> </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Less: Non-Taxable/Exempt Compensation
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td> </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                15
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Statutory Minimum Wage for Minimum Wage Earners
                                (MWEs)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">15</span>
                                <input aria-label="txtTax15" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax15" data-print-control="text" data-print-value="" id="frm1601c:txtTax15" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax15"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                16
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Holiday Pay, Overtime Pay, Night Shift
                                Differential Pay, Hazard Pay (for MWEs only)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">16</span>
                                <input aria-label="txtTax16" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax16" data-print-control="text" data-print-value="" id="frm1601c:txtTax16" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax16"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                17
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >13th Month Pay and Other Benefits
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">17</span>
                                <input aria-label="txtTax17" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax17" data-print-control="text" data-print-value="" id="frm1601c:txtTax17" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax17"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                18
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >De Minimis Benefits
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">18</span>
                                <input aria-label="txtTax18" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax18" data-print-control="text" data-print-value="" id="frm1601c:txtTax18" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax18"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                19
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >SSS, GSIS, PHIC, HDMF Mandatory Contributions
                                &amp; Union Dues (employee's share only)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">19</span>
                                <input aria-label="txtTax19" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax19" data-print-control="text" data-print-value="" id="frm1601c:txtTax19" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax19"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                20
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Other Non-Taxable Compensation (specify)
                              </span>
                              <input class="wh-source-size-20" aria-label="txt20Other" data-field-id="frm1601c:txt20Other" data-print-control="text" data-print-value="" id="frm1601c:txt20Other" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txt20Other"] ?? ""}>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">20</span>
                                <input aria-label="txtTax20" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax20" data-print-control="text" data-print-value="" id="frm1601c:txtTax20" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax20"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                21
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Total Non-Taxable Compensation (Sum of Items 15
                                to 20)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">21</span>
                                <input aria-label="txtTax21" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax21" data-print-control="text" data-print-value="" id="frm1601c:txtTax21" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax21"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                22
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Total Taxable Compensation (Item 14 Less Item
                                21)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">22</span>
                                <input aria-label="txtTax22" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax22" data-print-control="text" data-print-value="" id="frm1601c:txtTax22" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax22"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                23
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Less: Taxable compensation not subject to
                                withholding tax
                              </span><span class="wh-inline-9ee41e513757"
                                >(for employees, other than MWEs, receiving
                                P250,000 &amp; below for the year)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">23</span>
                                <input aria-label="txtTax23" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax23" data-print-control="text" data-print-value="" id="frm1601c:txtTax23" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax23"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                24
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Net Taxable Compensation (Item 22 Less Item 23)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">24</span>
                                <input aria-label="txtTax24" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax24" data-print-control="text" data-print-value="" id="frm1601c:txtTax24" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax24"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                25
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Total Taxes Withheld
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">25</span>
                                <input aria-label="txtTax25" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax25" data-print-control="text" data-print-value="" id="frm1601c:txtTax25" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax25"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                26
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Add/(Less): Adjustment of Taxes Withheld from
                                Previous Month/s <a
                                  class="xsmallItalic"
                                  id="btnNavigatePage2_1"
                                  >(From Part IV-Schedule 1, Item 4)
                                </a></span
                              >
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">26</span>
                                <input aria-label="txtTax26" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax26" data-print-control="text" data-print-value="" id="frm1601c:txtTax26" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax26"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                27
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Taxes Withheld for Remittance (Sum of Items 25
                                and 26)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">27</span>
                                <input aria-label="txtTax27" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax27" data-print-control="text" data-print-value="" id="frm1601c:txtTax27" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax27"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                28
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Less: Tax Remitted in Return Previously Filed,
                                if this is an amended return
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">28</span>
                                <input aria-label="txtTax28" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax28" data-print-control="text" data-print-value="" id="frm1601c:txtTax28" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax28"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                29
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Other Remittances Made (specify)
                              </span>
                              <input class="wh-source-size-20" aria-label="txt29Other" data-field-id="frm1601c:txt29Other" data-print-control="text" data-print-value="" id="frm1601c:txt29Other" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txt29Other"] ?? ""}>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">29</span>
                                <input aria-label="txtTax29" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax29" data-print-control="text" data-print-value="" id="frm1601c:txtTax29" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax29"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                30
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-97f71f169000"
                                >Total Tax Remittances Made (Sum of Items 28 and
                                29)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">30</span>
                                <input aria-label="txtTax30" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601c:txtTax30" data-print-control="text" data-print-value="" id="frm1601c:txtTax30" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax30"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                31
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-abbd0a6c6086"
                                >Tax Still Due</span
                              ><span class="wh-inline-97f71f169000"
                                >/(Over-remittance) (Item 27 Less Item 30)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">31</span>
                                <input aria-label="txtTax31" class="wh-inline-32c8d87b98f8 wh-source-size-20" data-field-id="frm1601c:txtTax31" data-print-control="text" data-print-value="" id="frm1601c:txtTax31" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax31"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-58a551e6b92e"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-a421a1e65578">
                                      <span class="wh-inline-97f71f169000"
                                        >Add: Penalties
                                      </span>
                                    </td>
                                    <td>
                                      <span class="wh-inline-4cf6c17959a7">
                                        32
                                      </span><span
                                        class="wh-inline-97f71f169000"
                                      >
                                        Surcharge</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">32</span>
                                <input aria-label="txtTax32" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax32" data-print-control="text" data-print-value="" id="frm1601c:txtTax32" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax32"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-58a551e6b92e"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-a421a1e65578"> </td>
                                    <td>
                                      <span class="wh-inline-4cf6c17959a7">
                                        33
                                      </span><span
                                        class="wh-inline-97f71f169000"
                                        >Interest</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">33</span>
                                <input aria-label="txtTax33" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax33" data-print-control="text" data-print-value="" id="frm1601c:txtTax33" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax33"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-58a551e6b92e"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-a421a1e65578"> </td>
                                    <td>
                                      <span class="wh-inline-4cf6c17959a7">
                                        34
                                      </span><span
                                        class="wh-inline-97f71f169000"
                                        >Compromise</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">34</span>
                                <input aria-label="txtTax34" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax34" data-print-control="text" data-print-value="" id="frm1601c:txtTax34" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax34"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-58a551e6b92e"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-a421a1e65578"> </td>
                                    <td>
                                      <span class="wh-inline-4cf6c17959a7">
                                        35
                                      </span><span
                                        class="wh-inline-97f71f169000"
                                        >Total Penalties (Sum of Items 32 to 34)</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">35</span>
                                <input aria-label="txtTax35" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax35" data-print-control="text" data-print-value="" id="frm1601c:txtTax35" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax35"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                36
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-abbd0a6c6086"
                                >TOTAL AMOUNT STILL DUE</span
                              ><span class="wh-inline-97f71f169000"
                                >/(Over-remittance) (Sum of Items 31 and 35)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">36</span>
                                <input aria-label="txtTax36" class="wh-inline-32c8d87b98f8 wh-source-size-20" data-field-id="frm1601c:txtTax36" data-print-control="text" data-print-value="" id="frm1601c:txtTax36" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax36"] ?? ""}>
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
          <tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-5f71bdacb0de"
              >
                <colgroup
                  ><col class="wh-inline-80c99a796975" />
                  <col class="wh-inline-80c99a796975" />
                  <col class="wh-inline-80c99a796975" />
                  <col class="wh-inline-80c99a796975" />
                </colgroup><tbody
                  ><tr>
                    <td class="wh-inline-c9711e4d9b69" colspan="4">
                      I/We declare under the penalties of perjury that this
                      remittance return, and all its attachments, have been made
                      in good faith, verified by me/us, and to the best of
                      my/our knowledge and belief, is true and correct, pursuant
                      to the provisions of the National Internal Revenue Code,
                      as amended, and the regulations issued under authority
                      thereof. Further, I give my consent to the processing of
                      my information as contemplated under the *Data Privacy Act
                      of 2012 (R.A. No. 10173) for legitimate and lawful
                      purposes. (If Authorized Representative, attach
                      authorization letter)<br /></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-c9711e4d9b69" colspan="2"
                      >For Individual:
                      <br /><br /><br /><br />
                    </td>
                    <td class="wh-inline-c9711e4d9b69" colspan="2"
                      >For Non-Individual:
                      <br /><br /><br /><br /></td
                    >
                  </tr>
                  <tr>
                    <td colspan="2"
                      >Signature over Printed Name of Taxpayer/Authorized
                      Representative/Tax Agent<br />
                      (Indicate Title/Designation and TIN)</td
                    >
                    <td colspan="2"
                      >Signature over Printed Name of President/Vice President/ <br
                      />
                      Authorized Officer or Representative/Tax Agent
                      <span class="wh-inline-9ee41e513757"
                        >(Indicate Title/Designation and TIN)</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td colspan="2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-99c25b298521"
                      >
                        <tbody
                          ><tr>
                            <td>
                              Tax Agent Accreditation No./ <br />
                              Attorney's Roll No. (If applicable)
                            </td>
                            <td>
                              <input class="wh-source-size-25" aria-label="txtTaxAgentNo" data-field-id="txtTaxAgentNo" data-print-control="text" data-print-value="" id="txtTaxAgentNo" maxlength="20" readonly size="25" type="text" value={model.text["txtTaxAgentNo"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-eeac0a34dc75"
                      >
                        <tbody
                          ><tr>
                            <td>
                              Date of Issue <br />
                              (MM/DD/YYYY)
                            </td>
                            <td>
                              <input aria-label="txtDateIssue" data-field-id="txtDateIssue" data-print-control="text" data-print-value="" id="txtDateIssue" maxlength="10" readonly type="text" value={model.text["txtDateIssue"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td>
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-eeac0a34dc75"
                      >
                        <tbody
                          ><tr>
                            <td>
                              Date of Expiry <br />
                              (MM/DD/YYYY)
                            </td>
                            <td>
                              <input aria-label="txtDateExpiry" data-field-id="txtDateExpiry" data-print-control="text" data-print-value="" id="txtDateExpiry" maxlength="10" readonly type="text" value={model.text["txtDateExpiry"] ?? ""}>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart wh-inline-261df5a44a38">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-e8b876838349"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >PART III - DETAILS OF PAYMENT</span
                                >
                              </div>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-3709648fafb2">
                      <table
                        border="1"
                        cellpadding="0"
                        cellspacing="0"
                        class="tblForm wh-inline-d3a633a79c9b"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-f99c236f78b6"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >Particulars
                                </span>
                              </div></td
                            >
                            <td class="wh-inline-be7269108542"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >Drawee Bank/Agency
                                </span>
                              </div></td
                            >
                            <td class="wh-inline-f99c236f78b6"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >Number
                                </span>
                              </div></td
                            >
                            <td class="wh-inline-f99c236f78b6"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >Date (MM/DD/YYYY)
                                </span>
                              </div></td
                            >
                            <td class="wh-inline-80c99a796975"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >Amount
                                </span>
                              </div></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                37
                              </span><span class="wh-inline-cb3a2164388b"
                                >Cash/Bank Debit Memo
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency37" data-field-id="frm1601c:txtAgency37" data-print-control="text" data-print-value="" id="frm1601c:txtAgency37" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtAgency37"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber37" data-field-id="frm1601c:txtNumber37" data-print-control="text" data-print-value="" id="frm1601c:txtNumber37" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtNumber37"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate37" data-field-id="frm1601c:txtDate37" data-print-control="text" data-print-value="" id="frm1601c:txtDate37" maxlength="10" readonly size="20" type="text" value={model.text["frm1601c:txtDate37"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount37" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601c:txtAmount37" data-print-control="text" data-print-value="" id="frm1601c:txtAmount37" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtAmount37"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                38
                              </span><span class="wh-inline-cb3a2164388b"
                                >Check
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency38" data-field-id="frm1601c:txtAgency38" data-print-control="text" data-print-value="" id="frm1601c:txtAgency38" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtAgency38"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber38" data-field-id="frm1601c:txtNumber38" data-print-control="text" data-print-value="" id="frm1601c:txtNumber38" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtNumber38"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate38" data-field-id="frm1601c:txtDate38" data-print-control="text" data-print-value="" id="frm1601c:txtDate38" maxlength="10" readonly size="20" type="text" value={model.text["frm1601c:txtDate38"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount38" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601c:txtAmount38" data-print-control="text" data-print-value="" id="frm1601c:txtAmount38" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtAmount38"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td colspan="2"
                              ><span class="wh-inline-4cf6c17959a7">
                                39
                              </span><span class="wh-inline-cb3a2164388b"
                                >Tax Debit Memo
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber39" data-field-id="frm1601c:txtNumber39" data-print-control="text" data-print-value="" id="frm1601c:txtNumber39" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtNumber39"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate39" data-field-id="frm1601c:txtDate39" data-print-control="text" data-print-value="" id="frm1601c:txtDate39" maxlength="10" readonly size="20" type="text" value={model.text["frm1601c:txtDate39"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount39" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601c:txtAmount39" data-print-control="text" data-print-value="" id="frm1601c:txtAmount39" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtAmount39"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td colspan="5"
                              ><span class="wh-inline-4cf6c17959a7">
                                40
                              </span><span class="wh-inline-cb3a2164388b"
                                >Others (specify below)
                              </span></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><input class="wh-source-size-20" aria-label="txtParticular40" data-field-id="frm1601c:txtParticular40" data-print-control="text" data-print-value="" id="frm1601c:txtParticular40" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtParticular40"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency40" data-field-id="frm1601c:txtAgency40" data-print-control="text" data-print-value="" id="frm1601c:txtAgency40" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtAgency40"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber40" data-field-id="frm1601c:txtNumber40" data-print-control="text" data-print-value="" id="frm1601c:txtNumber40" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtNumber40"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate40" data-field-id="frm1601c:txtDate40" data-print-control="text" data-print-value="" id="frm1601c:txtDate40" maxlength="10" readonly size="20" type="text" value={model.text["frm1601c:txtDate40"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount40" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601c:txtAmount40" data-print-control="text" data-print-value="" id="frm1601c:txtAmount40" maxlength="50" readonly size="20" type="text" value={model.text["frm1601c:txtAmount40"] ?? ""}></td
                            >
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
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-a928bad5f915"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-f49182d790a4"
                      >Machine Validation/Revenue Official Receipt Details (If
                      not filed with an Authorized Agent Bank)<br /><br /><br
                      /><br /><br /><br /><br /><br /><br /><br /><br /><br
                      /><br /></td
                    >
                    <td class="wh-inline-6c2b55e5cb8e"
                      >Stamp of Receiving Office/AAB and Date of Receipt (RO's
                      Signature/Bank Teller's Initial)<br /><br /><br /><br
                      /><br /><br /><br /><br /><br /><br /><br /><br /><br
                      /></td
                    >
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <p>
                <span class="wh-inline-b6636c1cf8d9">*NOTE: </span>
                <span class="wh-inline-3639c3547e7c">
                  Please read the BIR Data Privacy Policy found in the BIR
                  website (www.bir.gov.ph) <br />
                </span>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1601cv2018-2"
    data-source-page="2"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page2Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-5b58462227a5"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-e797b9c9ddc0">
                      <span class="wh-inline-429482632af7">BIR Form No.</span>
                      <br /><span class="wh-inline-aec978eca301">1601-C</span>
                      <br /><span class="wh-inline-429482632af7"
                        >January 2018 (ENCS)</span
                      >
                      <br /><span class="wh-inline-ccf4a15a8876">Page 2</span>
                      <br /><br /><br /></td
                    >
                    <td class="wh-inline-62471ef2f05a">
                      <span class="wh-inline-aec978eca301"
                        >Monthly Remittance Return</span
                      >
                      <br /><span class="wh-inline-1b29e9eb50ae"
                        >of Income Taxes Withheld on Compensation</span
                      >
                    </td>
                    <td class="wh-inline-bef36932d3a7">
                      <p>
                        <img
                          alt="BIR form identifying mark"
                          class="wh-inline-5dfba9815e30"
                          height="75px"
                          src="/legacy/img/withholding/original-1251c8f7afff49b6.png"
                          width="220"
                        />
                      </p>
                    </td>
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-69652284d042"
                      ><span class="wh-inline-97f71f169000">TIN</span></td
                    >
                    <td class="wh-inline-21f315789b7b"
                      ><span class="wh-inline-97f71f169000"
                        >Withholding Agent's Name(Last Name for Individual OR
                        Registered Name for Non-Individual)</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>
                      <span class="wh-inline-649b1ec8a1ed">
                        <input class="wh-source-size-3" aria-label="txtPg2TIN1" data-field-id="frm1601c:txtPg2TIN1" data-print-control="text" data-print-value="" id="frm1601c:txtPg2TIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1601c:txtPg2TIN1"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN2" data-field-id="frm1601c:txtPg2TIN2" data-print-control="text" data-print-value="" id="frm1601c:txtPg2TIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1601c:txtPg2TIN2"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN3" data-field-id="frm1601c:txtPg2TIN3" data-print-control="text" data-print-value="" id="frm1601c:txtPg2TIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1601c:txtPg2TIN3"] ?? ""}>
                        <input class="wh-source-size-5" aria-label="txtPg2BranchCode" data-field-id="frm1601c:txtPg2BranchCode" data-print-control="text" data-print-value="" id="frm1601c:txtPg2BranchCode" maxlength="5" readonly size="5" type="text" value={model.text["frm1601c:txtPg2BranchCode"] ?? ""}>
                      </span>
                    </td>
                    <td
                      ><input class="wh-source-size-80" aria-label="txtPg2TaxpayerName" data-field-id="frm1601c:txtPg2TaxpayerName" data-print-control="text" data-print-value="" id="frm1601c:txtPg2TaxpayerName" maxlength="50" readonly size="80" type="text" value={model.text["frm1601c:txtPg2TaxpayerName"] ?? ""}></td
                    >
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart wh-inline-261df5a44a38">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-e8b876838349"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >PART IV - SCHEDULE
                                </span>
                              </div>
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
            <td class="tblFormTdPart wh-inline-261df5a44a38" colspan="4">
              <div>
                <span class="wh-inline-dd2eceacf41a">Schedule I </span><span
                  class="wh-inline-cb3a2164388b"
                  >- Adjustment of Taxes Withheld on Compensation from Previous
                  Months (attach additional sheet/s, if necessary)</span
                >
              </div>
            </td>
          </tr>
          <tr>
            <td class="tblFormTd">
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-5b58462227a5"
              >
                <thead>
                  <tr>
                    <th class="wh-inline-a884a4318caf" colspan="2"
                      ><span class="wh-inline-97f71f169000"
                        >Previous Month/s <br /> (MM/YYYY) <br /> 1
                      </span></th
                    >
                    <th class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-97f71f169000"
                        >Date Paid <br /> (MM/DD/YYYY) <br /> 2
                      </span></th
                    >
                    <th class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-97f71f169000"
                        >Drawee Bank/Bank <br /> Code/Agency <br /> 3
                      </span></th
                    >
                    <th class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-97f71f169000"
                        >Number <br /> 4
                      </span></th
                    >
                    <th class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-97f71f169000"
                        >Tax Paid (Excluding Penalties for the Month) <br /> 5
                      </span></th
                    >
                  </tr>
                </thead>
                <tbody id="tblSched1a">
                  <tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-e197192ea999"
                        ><input aria-label="chkScheduleDelete0" checked={model.checks["chkScheduleDelete0"] ?? false} data-field-id="chkScheduleDelete0" data-print-control="checkbox" disabled id="chkScheduleDelete0" type="checkbox"/></span
                      ></td
                    >
                    <td class="wh-inline-c8e5eef70b90"
                      ><input aria-label="txtMonthYear0" class="wh-inline-80ec55322565 wh-source-size-15" data-field-id="frm1601c:sched1:txtMonthYear0" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtMonthYear0" maxlength="7" readonly size="15" type="text" value={model.text["frm1601c:sched1:txtMonthYear0"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtDatePaid0" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtDatePaid0" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtDatePaid0" maxlength="10" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtDatePaid0"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtBankCode0" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtBankCode0" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtBankCode0" maxlength="20" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtBankCode0"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtNumber0" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtNumber0" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtNumber0" maxlength="20" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtNumber0"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxPaid0" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtTaxPaid0" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtTaxPaid0" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtTaxPaid0"] ?? ""}></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-e197192ea999"
                        ><input aria-label="chkScheduleDelete1" checked={model.checks["chkScheduleDelete1"] ?? false} data-field-id="chkScheduleDelete1" data-print-control="checkbox" disabled id="chkScheduleDelete1" type="checkbox"/></span
                      ></td
                    >
                    <td class="wh-inline-c8e5eef70b90"
                      ><input aria-label="txtMonthYear1" class="wh-inline-80ec55322565 wh-source-size-15" data-field-id="frm1601c:sched1:txtMonthYear1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtMonthYear1" maxlength="7" readonly size="15" type="text" value={model.text["frm1601c:sched1:txtMonthYear1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtDatePaid1" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtDatePaid1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtDatePaid1" maxlength="10" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtDatePaid1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtBankCode1" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtBankCode1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtBankCode1" maxlength="20" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtBankCode1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtNumber1" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtNumber1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtNumber1" maxlength="20" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtNumber1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxPaid1" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtTaxPaid1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtTaxPaid1" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtTaxPaid1"] ?? ""}></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-e197192ea999"
                        ><input aria-label="chkScheduleDelete2" checked={model.checks["chkScheduleDelete2"] ?? false} data-field-id="chkScheduleDelete2" data-print-control="checkbox" disabled id="chkScheduleDelete2" type="checkbox"/></span
                      ></td
                    >
                    <td class="wh-inline-c8e5eef70b90"
                      ><input aria-label="txtMonthYear2" class="wh-inline-80ec55322565 wh-source-size-15" data-field-id="frm1601c:sched1:txtMonthYear2" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtMonthYear2" maxlength="7" readonly size="15" type="text" value={model.text["frm1601c:sched1:txtMonthYear2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtDatePaid2" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtDatePaid2" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtDatePaid2" maxlength="10" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtDatePaid2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtBankCode2" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtBankCode2" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtBankCode2" maxlength="20" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtBankCode2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtNumber2" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtNumber2" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtNumber2" maxlength="20" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtNumber2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxPaid2" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:sched1:txtTaxPaid2" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtTaxPaid2" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:sched1:txtTaxPaid2"] ?? ""}></td
                    >
                  </tr>
                </tbody>
              </table>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-5b58462227a5"
              >
                <thead>
                  <tr>
                    <th class="wh-inline-e533a1ddf024" colspan="2"
                      ><span class="wh-inline-97f71f169000"
                        >Should be Tax Due for the Month <br /> 6
                      </span></th
                    >
                    <th class="wh-inline-e533a1ddf024"
                      ><span class="wh-inline-97f71f169000"
                        >Adjustments <br /> 7=(6 less 5)
                      </span></th
                    >
                  </tr>
                </thead>
                <tbody id="tblSched1b">
                  <tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-e197192ea999">1</span></td
                    >
                    <td class="wh-inline-d6656d6bc545"
                      ><input aria-label="txtShouldTaxDue0" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:sched1:txtShouldTaxDue0" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtShouldTaxDue0" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:sched1:txtShouldTaxDue0"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtAdjustments0" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:sched1:txtAdjustments0" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtAdjustments0" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:sched1:txtAdjustments0"] ?? ""}></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-e197192ea999">2</span></td
                    >
                    <td class="wh-inline-d6656d6bc545"
                      ><input aria-label="txtShouldTaxDue1" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:sched1:txtShouldTaxDue1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtShouldTaxDue1" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:sched1:txtShouldTaxDue1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtAdjustments1" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:sched1:txtAdjustments1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtAdjustments1" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:sched1:txtAdjustments1"] ?? ""}></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-e197192ea999">3</span></td
                    >
                    <td class="wh-inline-d6656d6bc545"
                      ><input aria-label="txtShouldTaxDue2" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:sched1:txtShouldTaxDue2" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtShouldTaxDue2" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:sched1:txtShouldTaxDue2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtAdjustments2" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:sched1:txtAdjustments2" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtAdjustments2" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:sched1:txtAdjustments2"] ?? ""}></td
                    >
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
                class="tblForm wh-inline-76e792f83735"
              >
                <tbody
                  ><tr>
                    <td>
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-5e6598d17fa9"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-a3c7768598e2"
                              ><span class="wh-inline-e197192ea999"> </span></td
                            >
                            <td class="wh-inline-f3567c9654cd"
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-6d319e71fe1f"
                                ><span class="wh-inline-97f71f169000"
                                  >Total Adjustment (Sum of Items 1 to 3) <a
                                    class="xsmallItalic"
                                    id="btnNavigatePage1_1"
                                    >(To Part II, Item 26)
                                  </a></span
                                ></span
                              ></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtTotal1" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:sched1:txtTotal1" data-print-control="text" data-print-value="" id="frm1601c:sched1:txtTotal1" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:sched1:txtTotal1"] ?? ""}></td
                            >
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"> </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <div class="smallSubtitle wh-inline-a30033456d9a">
                Guidelines and Instructions for BIR Form No. 1601-C [January
                2018(ENCS)]
              </div>
              <div class="smallSubtitle wh-inline-a30033456d9a">
                Monthly Remittance Return of Income Taxes Withheld on
                Compensation
              </div>
              <br />
              <table class="wh-inline-5b58462227a5" id="inserted">
                <tbody
                  ><tr>
                    <td class="firstcol">
                      <div class="wh-inline-2ea46c1db204">Who Shall File</div>
                      <p class="wh-inline-73783a20c465">
                        This monthly remittance return shall be filed in
                        triplicate by every withholding agent (WA)/payor
                        required to deduct and withhold taxes on compensation
                        paid to employees.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        If the person required to withhold and pay/remit the tax
                        is a corporation, the return shall be made in the name
                        of the corporation and shall be signed and verified by
                        the president, vice-president, or any authorized
                        officer.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        If the Government of the Philippines or any of its
                        agencies, political subdivisions or instrumentalities,
                        or a government-owned or controlled corporation, is the
                        withholding agent/payor, the return shall be
                        accomplished and signed by the officer or employee
                        having control of disbursement of income payments or
                        other officer or employee appropriately designated for
                        the purpose.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        With respect to a fiduciary, the return shall be made in
                        the name of the individual, estate or trust for which
                        such fiduciary acts and shall be signed and verified by
                        such fiduciary. In case of two or more joint
                        fiduciaries, the return shall be signed and verified by
                        one of such fiduciaries.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        Authorized Representative and Accredited Tax Agent
                        filing, in behalf of the taxpayer, shall also use this
                        return to pay/remit the creditable taxes withheld.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        In the case of hazardous employment, the employer in the
                        private sector shall attach to BIR Form No. 1601-C, for
                        return periods March, June, September and December a
                        copy of the list submitted to the Department of Labor
                        &amp; Employment Regional/Provincial Offices–Operations
                        Division/Unit. The list shall show the names of the
                        Minimum Wage Earners who received the hazard pay, period
                        of employment, amount of hazard pay per month and
                        justification for payment of hazard pay as certified by
                        said DOLE/allied agency that the hazard pay is
                        justifiable. In the same manner, for the aforementioned
                        return periods, employer in the public sector shall
                        attach a copy of Department of Budget and Management
                        (DBM) circular/s or equivalent, as to who are allowed to
                        receive hazard pay.
                      </p>
                      <div class="wh-inline-2ea46c1db204">
                        When and Where to File and Pay/Remit
                      </div>
                      <p class="wh-inline-73783a20c465">
                        The return shall be filed and the tax paid/remitted on
                        or before the tenth (10th) day of the month following
                        the month in which withholding was made except for taxes
                        withheld for December which shall be filed and
                        paid/remitted on or before January 15 of the succeeding
                        year.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        Provided, however, that with respect to non-large and
                        large taxpayers who shall file through the Electronic
                        Filing and Payment System (eFPS), the deadline for
                        electronically filing the return and paying/remitting
                        the taxes due thereon shall be in accordance with the
                        provisions of existing applicable revenue issuances.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        The return shall be filed and the tax paid/remitted with
                        the Authorized Agent Bank (AAB) of the Revenue District
                        Office (RDO) having jurisdiction over the withholding
                        agent's place of business/office. In places where there
                        are no Authorized Agent Banks, the return shall be filed
                        and the tax paid/remitted with the Revenue Collection
                        Officer (RCO) of the RDO having jurisdiction over the
                        WA’s place of business/office, who will issue an
                        Electronic Revenue Official Receipt (eROR) therefor.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        When the return is filed with an AAB, taxpayer must
                        accomplish and submit BIR-prescribed deposit slip, which
                        the bank teller shall machine validate as evidence that
                        payment/remittance was received by the AAB. The AAB
                        receiving the tax return shall stamp mark the word
                        “Received” on the return and also machine validate the
                        return as proof of filing and payment/remittance of the
                        tax by the taxpayer. The machine validation shall
                        reflect the date of payment/remittance, amount
                        paid/remitted and transactions code, the name of the
                        bank, branch code, teller’s code and teller’s initial.
                        Bank debit memo number and date should be indicated in
                        the return for taxpayers paying/remitting under the bank
                        debit system.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        Payment/Remittance may also be made thru the epayment
                        channels of AABs thru either their online facility,
                        credit/debit/prepaid cards, and mobile payments.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        A taxpayer may file a separate return for the head
                        office and for each branch or place of business/office
                        or a consolidated return for the head office and all the
                        branches/offices. In the case of large taxpayers only
                        one consolidated return is required.
                      </p>
                      <div class="wh-inline-2ea46c1db204">Penalties</div>
                      <p class="wh-inline-73783a20c465">
                        There shall be imposed and collected as part of the tax:
                      </p>
                      <ol>
                        <li class="wh-inline-73783a20c465">
                          A surcharge of twenty-five percent (25%) for the
                          following violations:
                        </li>
                        <ol class="indent">
                          <li class="wh-inline-73783a20c465">
                            Failure to file any return and pay the amount of tax
                            or installment due on or before the due date;
                          </li>
                          <li class="wh-inline-73783a20c465">
                            Filing a return with a person or office other than
                            those with whom it is required to be filed, unless
                            otherwise authorized by the Commissioner;
                          </li>
                          <li class="wh-inline-73783a20c465">
                            Failure to pay the full or part of the amount of tax
                            shown on the return, or the full amount of tax due
                            for which no return is required to be filed on or
                            before the due date;
                          </li>
                          <li class="wh-inline-73783a20c465">
                            Failure to pay the deficiency tax within the time
                            prescribed for its payment in the notice of
                            assessment.
                          </li>
                        </ol>
                        <li class="wh-inline-73783a20c465">
                          A surcharge of fifty percent (50%) of the tax or of
                          the deficiency tax, in case any payment has been made
                          before the discovery of the falsity or fraud, for each
                          of the following violations:
                        </li>
                      </ol>
                    </td>
                    <td class="secondcol">
                      <br />
                      <ol class="indent">
                        <li class="wh-inline-73783a20c465">
                          Willful neglect to file the return within the period
                          prescribed by the Code or by rules and regulations; or
                        </li>
                        <li class="wh-inline-73783a20c465">
                          A false or fraudulent return is willfully made.
                        </li>
                      </ol>
                      <ol>
                        <li class="wh-inline-73783a20c465">
                          Interest at the rate of double the legal interest rate
                          for loans or forbearance of any money in the absence
                          of an express stipulation as set by the Bangko Sentral
                          ng Pilipinas from the date prescribed for payment
                          until the amount is fully remitted: Provided, That in
                          no case shall the deficiency and the delinquency
                          interest prescribed under Section 249 Subsections (B)
                          and (C) of the National Internal Revenue Code, as
                          amended, be imposed simultaneously.
                        </li>
                        <li class="wh-inline-73783a20c465">
                          Compromise penalty as provided under applicable rules
                          and regulations.
                        </li>
                      </ol>
                      <div class="wh-inline-2ea46c1db204">
                        Violation of Withholding Tax Provisions
                      </div>
                      <p class="wh-inline-73783a20c465">
                        Any person required to withhold, account for, and
                        pay/remit any tax imposed by the National Internal
                        Revenue Code (NIRC), as amended, or who willfully fails
                        to withhold such tax, or account for and pay/remit such
                        tax, or aids or abets in any manner to evade any such
                        tax or the payment/remittance thereof, shall, in
                        addition to other penalties provided for under the Law,
                        be liable upon conviction to a penalty equal to the
                        total amount of the tax not withheld, or not accounted
                        for and paid/remitted.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        Any person required under the NIRC, as amended, or by
                        rules and regulations promulgated thereunder to
                        pay/remit any tax, make a return, keep any record, or
                        supply correct and accurate information, who willfully
                        fails to pay/remit such tax, make such return, keep such
                        record, or supply such correct and accurate information,
                        or withhold or pay/remit taxes withheld, or refund
                        excess taxes withheld on compensation, at the time or
                        times required by law or rules and regulations shall, in
                        addition to the other penalties provided by law, upon
                        conviction thereof, be punished by a fine of not less
                        than ten thousand pesos (P= 10,000.00) and suffer
                        imprisonment of not less than one (1) year but not more
                        than ten (10) years.
                      </p>
                      <p class="wh-inline-73783a20c465">
                        Every officer or employee of the Government of the
                        Republic of the Philippines or any of its agencies and
                        instrumentalities, its political subdivisions, as well
                        as government-owned or controlled corporations,
                        including the Bangko Sentral ng Pilipinas, who, under
                        the provisions of the NIRC, as amended, or regulations
                        promulgated thereunder, is charged with the duty to
                        deduct and withhold any internal revenue tax and to
                        pay/remit the same in accordance with the provisions of
                        the NIRC, as amended, and other laws and who is found
                        guilty of any offense herein below specified shall, upon
                        conviction of each act or omission, be fined in a sum
                        not less than five thousand pesos (P= 5,000) but not
                        more than fifty thousand pesos (P= 50,000) or imprisoned
                        for a term of not less than six (6) months and one day
                        but not more than two (2) years, or both:
                      </p>
                      <ol class="indent">
                        <li class="wh-inline-73783a20c465">
                          Those who fail or cause the failure to deduct and
                          withhold any internal revenue tax under any of the
                          withholding tax laws and implementing regulations;
                        </li>
                        <li class="wh-inline-73783a20c465">
                          Those who fail or cause the failure to pay/remit taxes
                          deducted and withheld within the time prescribed by
                          law, and implementing regulations; and
                        </li>
                        <li class="wh-inline-73783a20c465">
                          Those who fail or cause the failure to file a return
                          or statement within the time prescribed, or render or
                          furnish a false or fraudulent return or statement
                          required under the withholding tax laws and
                          regulations.
                        </li>
                      </ol>
                      <p class="wh-inline-73783a20c465">
                        If the withholding agent is the Government or any of its
                        agencies, political subdivisions or instrumentalities,
                        or a government-owned or controlled corporation, the
                        employee thereof responsible for the withholding and
                        payment/remittance of tax shall be personally liable for
                        the additions to the tax prescribed by the NIRC, as
                        amended.
                      </p>
                      <div class="wh-inline-2ea46c1db204">
                        Required Attachments:
                      </div>
                      <br />
                      <ol class="indent">
                        <li class="wh-inline-73783a20c465">
                          For Private Sector, copy of the list submitted to the
                          DOLE Regional/Provincial Offices – Operations
                          Division/Unit.
                        </li>
                        <li class="wh-inline-73783a20c465">
                          For Public Sector, copy of Department of Budget and
                          Management (DBM) circular/s or equivalent.
                        </li>
                      </ol>
                      <div class="wh-inline-2ea46c1db204">
                        Note: All background information must be properly filled
                        out.
                      </div>
                      <br />
                      <ul>
                        <li class="wh-inline-73783a20c465">
                          The last 5 digits of the 14-digit TIN refers to the
                          branch code
                        </li>
                        <li class="wh-inline-73783a20c465">
                          All returns filed by an accredited tax agent on behalf
                          of a taxpayer shall bear the following information:
                        </li>
                        <ol class="indent">
                          <li class="wh-inline-73783a20c465">
                            For Individual (CPAs, members of GPPs, and others)
                          </li>
                          <div class="wh-inline-473fbdbc85f2">
                            a.1 Taxpayer Identification Number (TIN); and
                          </div>
                          <div class="wh-inline-473fbdbc85f2">
                            a.2 BIR Accreditation Number, Date of Issue, and
                            Date of Expiry.
                          </div>
                          <li class="wh-inline-73783a20c465">
                            For members of the Philippine Bar (Lawyers)
                          </li>
                          <div class="wh-inline-473fbdbc85f2">
                            b.1 Taxpayer Identification Number (TIN);
                          </div>
                          <div class="wh-inline-473fbdbc85f2">
                            b.2 Attorney’s Roll Number;
                          </div>
                          <div class="wh-inline-473fbdbc85f2">
                            b.3 Mandatory Continuing Legal Education (MCLE)
                            Compliance Number; and
                          </div>
                          <div class="wh-inline-473fbdbc85f2">
                            b.4 BIR Accreditation Number, Date of Issue, and
                            Date of Expiry.
                          </div>
                        </ol>
                      </ul>
                      <br /><br /></td
                    >
                  </tr>
                </tbody>
              </table>
              <br /></td
            >
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
        <h2>BIR Form 1601Cv2018 — {continuation.title}</h2>
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
