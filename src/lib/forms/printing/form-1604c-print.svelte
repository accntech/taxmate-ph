<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1604c:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1604c:amendedRtn_1",
    "source": "frm1604c:amendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604c:amendedRtn_2",
    "source": "frm1604c:amendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604c:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1604c:tinA",
    "fallback": ""
  },
  {
    "id": "frm1604c:tinB",
    "fallback": ""
  },
  {
    "id": "frm1604c:tinC",
    "fallback": ""
  },
  {
    "id": "frm1604c:branchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1604c:txtRDOCode"
  },
  {
    "id": "frm1604c:registeredName",
    "fallback": ""
  },
  {
    "id": "frm1604c:registeredAddress",
    "fallback": ""
  },
  {
    "id": "frm1604c:zipCode",
    "fallback": ""
  },
  {
    "id": "frm1604c:categoryAgent_1",
    "source": "frm1604c:categoryAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1604c:categoryAgent_2",
    "source": "frm1604c:categoryAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1604c:topAgent_1",
    "source": "frm1604c:topAgent",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604c:topAgent_2",
    "source": "frm1604c:topAgent",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604c:telephoneNumber",
    "fallback": ""
  },
  {
    "id": "txtEmail",
    "fallback": ""
  },
  {
    "id": "frm1604c:releasedOfFunds_1",
    "source": "frm1604c:releasedOfFunds",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604c:releasedOfFunds_2",
    "source": "frm1604c:releasedOfFunds",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604c:txtRefMonth",
    "fallback": "",
    "options": {
      "00": "",
      "01": "01",
      "02": "02",
      "03": "03",
      "04": "04",
      "05": "05",
      "06": "06",
      "07": "07",
      "08": "08",
      "09": "09",
      "10": "10",
      "11": "11",
      "12": "12"
    }
  },
  {
    "id": "frm1604c:txtRefDate",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtRefYear",
    "fallback": ""
  },
  {
    "id": "frm1604c:txt12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:select13",
    "fallback": "",
    "options": {
      "00": "",
      "01": "01",
      "02": "02",
      "03": "03",
      "04": "04",
      "05": "05",
      "06": "06",
      "07": "07",
      "08": "08",
      "09": "09",
      "10": "10",
      "11": "11",
      "12": "12"
    }
  },
  {
    "id": "frm1604c:txtSched1Date1",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal1",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra1",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date2",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal2",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra2",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date3",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal3",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra3",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date4",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal4",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra4",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date5",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal5",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra5",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date6",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal6",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra6",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date7",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal7",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra7",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date8",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal8",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra8",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date9",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal9",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra9",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date10",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal10",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra10",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date11",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal11",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra11",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Date12",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1BankVal12",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtTra12",
    "fallback": ""
  },
  {
    "id": "frm1604c:txtSched1TaxWheld12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Adj12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Pen12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1TotalAmt12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1AdjTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604c:txtSched1Total",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1604C", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1604C"
  aria-label="BIR Form 1604C print preview"
>
  <div
    class="withholding-print-page-content wh-page-1604c-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-1c3f32c4364c" id="wrapper">
      <div id="formPaper">
        <div id="mainContent">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="wh-inline-326fc4820d8f"
          >
            <tbody
              ><tr>
                <td>
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="wh-inline-79658623c369"
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
                    class="wh-inline-79658623c369"
                  >
                    <tbody
                      ><tr>
                        <td class="wh-inline-e797b9c9ddc0">
                          <span class="wh-inline-429482632af7"
                            >BIR Form No.</span
                          >
                          <br /><span class="wh-inline-aec978eca301"
                            >1604-C</span
                          >
                          <br /><span class="wh-inline-429482632af7"
                            >January 2018</span
                          >
                          <br /><span class="wh-inline-ccf4a15a8876"
                            >Page 1</span
                          >
                        </td>
                        <td class="wh-inline-62471ef2f05a">
                          <span class="wh-inline-aec978eca301">
                            Annual Information Return<br />
                            of Income Taxes Withheld on Compensation
                          </span>
                          <br /><span class="wh-inline-429482632af7"
                            >Enter all required information in CAPITAL LETTERS
                            using BLACK ink. Mark all applicable boxes with<br
                            />an "X". Two copies MUST be filed with the BIR and
                            one held by the Taxpayer.<br /></span
                          >
                        </td>
                        <td class="wh-inline-bef36932d3a7">
                          <p>
                            <img
                              alt="BIR form identifying mark"
                              class="wh-inline-5dfba9815e30"
                              height="75px"
                              src="/legacy/img/withholding/original-0be0a4db0aeba522.png"
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-007db826741b">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-183aa7df47ed"
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
                                    >For the Year (YYYY)
                                    <input class="wh-source-size-5" aria-label="txtYear" data-field-id="frm1604c:txtYear" data-print-control="text" data-print-value="" id="frm1604c:txtYear" maxlength="4" readonly size="5" type="text" value={model.text["frm1604c:txtYear"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-5890baff3197">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-0b1c5d170ebf"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-38eb7c1ab5d2"
                                  ><span class="wh-inline-4cf6c17959a7">2</span
                                  ></td
                                >
                                <td class="wh-inline-1a5329f85423"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Amended Return?</span
                                  ></td
                                >
                                <td class="wh-inline-21f315789b7b">
                                  <fieldset
                                    class="iceSelOneRb-dis fieldText1-dis wh-inline-3276beb56669"
                                    id="frm1604c:j_id217"
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="iceSelOneRb-dis fieldText1-dis wh-inline-cde08151d231"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            ><input aria-label="amendedRtn_1" checked={model.checks["frm1604c:amendedRtn_1"] ?? false} data-field-id="frm1604c:amendedRtn_1" data-print-control="radio" disabled id="frm1604c:amendedRtn_1" type="radio"/><span
                                              class="wh-inline-cb3a2164388b"
                                              >Yes</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="amendedRtn_2" checked={model.checks["frm1604c:amendedRtn_2"] ?? false} data-field-id="frm1604c:amendedRtn_2" data-print-control="radio" disabled id="frm1604c:amendedRtn_2" type="radio"/><span
                                              class="wh-inline-cb3a2164388b"
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
                        <td class="tblFormTd wh-inline-2ed31d8be076">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-2aebbc259fe8"
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
                                    >No. of Sheets Attached
                                    <input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1604c:txtSheets" data-print-control="text" data-print-value="" id="frm1604c:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1604c:txtSheets"] ?? ""}>
                                  </span></td
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
                    class="tblForm wh-inline-101c52ee640b"
                  >
                    <tbody
                      ><tr><td class="tblFormTdPart"></td></tr>
                      <tr>
                        <td class="tblFormTdPart">
                          <div class="wh-inline-a30033456d9a">
                            <span class="wh-inline-97f71f169000">
                              <b>Part I - Background Information</b></span
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-dd1e19e75217">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-faaad7f8460d"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-6e606d24db7d"
                                  ><span class="wh-inline-15663751d502">
                                    4
                                  </span></td
                                >
                                <td>
                                  <span class="wh-inline-cb3a2164388b"
                                    >Taxpayer Identification Number (TIN)
                                  </span>
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input class="wh-source-size-2" aria-label="tinA" data-field-id="frm1604c:tinA" data-print-control="text" data-print-value="" id="frm1604c:tinA" maxlength="3" readonly size="2" type="text" value={model.text["frm1604c:tinA"] ?? ""}>
                                    <input class="wh-source-size-2" aria-label="tinB" data-field-id="frm1604c:tinB" data-print-control="text" data-print-value="" id="frm1604c:tinB" maxlength="3" readonly size="2" type="text" value={model.text["frm1604c:tinB"] ?? ""}>
                                    <input class="wh-source-size-2" aria-label="tinC" data-field-id="frm1604c:tinC" data-print-control="text" data-print-value="" id="frm1604c:tinC" maxlength="3" readonly size="2" type="text" value={model.text["frm1604c:tinC"] ?? ""}>
                                    <input class="wh-source-size-2" aria-label="branchCode" data-field-id="frm1604c:branchCode" data-print-control="text" data-print-value="" id="frm1604c:branchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1604c:branchCode"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-007db826741b">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-d74bda6ec0e4"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-d5086c4e2b16"
                                  ><span class="wh-inline-15663751d502">
                                    5
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-27659ec34293">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-dcf4578f1758"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-8ee9b0356bbd">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-cf754d2a0594"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            6
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Withholding Agent's Name (Last
                                            Name, First Name, Middle Name for
                                            Individuals OR Registered Name for
                                            Non-Individuals)</span
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
                                    class="wh-inline-cf754d2a0594"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-92a868b58274">
                                        </td>
                                        <td
                                          ><input class="wh-source-size-125" aria-label="registeredName" data-field-id="frm1604c:registeredName" data-print-control="text" data-print-value="" id="frm1604c:registeredName" maxlength="70" readonly size="125" type="text" value={model.text["frm1604c:registeredName"] ?? ""}></td
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-dd1e19e75217">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-15fcf86bdc29"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-15fcf86bdc29"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            7
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Registered Address (Indicate
                                            complete address. If branch,
                                            indicate the branch address. If the
                                            registered address is different form
                                            the current address, go to the RDO
                                            to update registered address by
                                            using BIR Form No. 1905)</span
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
                                    class="wh-inline-15fcf86bdc29"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-92a868b58274">
                                        </td>
                                        <td
                                          ><input class="wh-source-size-85" aria-label="registeredAddress" data-field-id="frm1604c:registeredAddress" data-print-control="text" data-print-value="" id="frm1604c:registeredAddress" maxlength="150" readonly size="85" type="text" value={model.text["frm1604c:registeredAddress"] ?? ""}></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-e27cc78d192a">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-d74bda6ec0e4"
                          >
                            <tbody
                              ><tr>
                                <td
                                  ><span class="wh-inline-4cf6c17959a7">
                                    7A
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Zip Code</span
                                  ></td
                                >
                                <td>
                                  <div class="wh-inline-9cb088a595d0">
                                    <input class="wh-source-size-12" aria-label="zipCode" data-field-id="frm1604c:zipCode" data-print-control="text" data-print-value="" id="frm1604c:zipCode" maxlength="12" readonly size="12" type="text" value={model.text["frm1604c:zipCode"] ?? ""}>
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-8339e723f6fb">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-6472a62cf042"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-6472a62cf042"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-57becd9072ec">
                                          <span class="wh-inline-4cf6c17959a7">
                                            8
                                          </span>
                                          <span class="wh-inline-cb3a2164388b"
                                            >Category of Withholding Agent</span
                                          >
                                        </td>
                                        <td>
                                          <div class="wh-inline-a30033456d9a">
                                            <fieldset
                                              class="wh-inline-3276beb56669"
                                              id="frm1604c:j_id392"
                                            >
                                              <div
                                                class="wh-inline-69074f3d5ca3"
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  class="wh-inline-2caa7af17aa4"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        ><input aria-label="categoryAgent_1" checked={model.checks["frm1604c:categoryAgent_1"] ?? false} data-field-id="frm1604c:categoryAgent_1" data-print-control="radio" disabled id="frm1604c:categoryAgent_1" type="radio"/>
                                                        <span
                                                          class="wh-inline-cb3a2164388b"
                                                          >Private</span
                                                        >
                                                      </td>
                                                      <td
                                                        ><input aria-label="categoryAgent_2" checked={model.checks["frm1604c:categoryAgent_2"] ?? false} data-field-id="frm1604c:categoryAgent_2" data-print-control="radio" disabled id="frm1604c:categoryAgent_2" type="radio"/>
                                                        <span
                                                          class="wh-inline-cb3a2164388b"
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
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-892deb538fda">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-1ff0d3e4ade3"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-8f788499dc44"
                                  ><span class="wh-inline-4cf6c17959a7">8A</span
                                  ></td
                                >
                                <td class="wh-inline-b78b0a434cc3"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >If private, top withholding agent?</span
                                  ></td
                                >
                                <td class="wh-inline-04d4f857303d">
                                  <fieldset
                                    class="iceSelOneRb-dis fieldText1-dis wh-inline-3276beb56669"
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="iceSelOneRb-dis fieldText1-dis wh-inline-db846a8ca40f"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            ><input aria-label="topAgent_1" checked={model.checks["frm1604c:topAgent_1"] ?? false} data-field-id="frm1604c:topAgent_1" data-print-control="radio" disabled id="frm1604c:topAgent_1" type="radio"/><span
                                              class="wh-inline-cb3a2164388b"
                                              >Yes</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="topAgent_2" checked={model.checks["frm1604c:topAgent_2"] ?? false} data-field-id="frm1604c:topAgent_2" data-print-control="radio" disabled id="frm1604c:topAgent_2" type="radio"/><span
                                              class="wh-inline-cb3a2164388b"
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-ee18e890dfc1">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-ce4c277b9d6c"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-ce4c277b9d6c"
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
                                            >Contact Number</span
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
                                    class="wh-inline-ce4c277b9d6c"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-92a868b58274">
                                        </td>
                                        <td
                                          ><input aria-label="telephoneNumber" data-field-id="frm1604c:telephoneNumber" data-print-control="text" data-print-value="" id="frm1604c:telephoneNumber" readonly type="text" value={model.text["frm1604c:telephoneNumber"] ?? ""}></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-ee18e890dfc1">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-003b018b736f"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-d9a7f9a011a9"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            10
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Email Address</span
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
                                    class="wh-inline-d9a7f9a011a9"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-92a868b58274">
                                        </td>
                                        <td>
                                          <input aria-label="txtEmail" class="emailClass wh-source-size-98" data-field-id="txtEmail" data-print-control="text" data-print-value="" id="txtEmail" readonly size="98" type="text" value={model.text["txtEmail"] ?? ""}>
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-8339e723f6fb">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-6472a62cf042"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-6472a62cf042"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-8c0d062b5bd9">
                                          <span class="wh-inline-4cf6c17959a7">
                                            11
                                          </span>
                                        </td>
                                        <td class="wh-inline-7c23c461658f">
                                          <span class="wh-inline-cb3a2164388b"
                                            >In case of
                                            overwithholding/overremittance after
                                            the year-end adjustment on
                                            compensation, have you released the
                                            refunds to your employees?</span
                                          >
                                        </td>
                                        <td>
                                          <div class="wh-inline-a30033456d9a">
                                            <fieldset
                                              class="wh-inline-3276beb56669"
                                              id="frm1604c:j_id392"
                                            >
                                              <div
                                                class="wh-inline-69074f3d5ca3"
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  class="wh-inline-2341cf743652"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td>
                                                        <span
                                                          class="wh-inline-429482632af7"
                                                        >
                                                          <input aria-label="releasedOfFunds_1" checked={model.checks["frm1604c:releasedOfFunds_1"] ?? false} data-field-id="frm1604c:releasedOfFunds_1" data-print-control="radio" disabled id="frm1604c:releasedOfFunds_1" type="radio"/>
                                                          <span
                                                            class="wh-inline-cb3a2164388b"
                                                            >Yes</span
                                                          >
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span
                                                          class="wh-inline-429482632af7"
                                                        >
                                                          <input aria-label="releasedOfFunds_2" checked={model.checks["frm1604c:releasedOfFunds_2"] ?? false} data-field-id="frm1604c:releasedOfFunds_2" data-print-control="radio" disabled id="frm1604c:releasedOfFunds_2" type="radio"/>
                                                          <span
                                                            class="wh-inline-cb3a2164388b"
                                                            >No</span
                                                          >
                                                        </span>
                                                      </td>
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
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-892deb538fda">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-1ff0d3e4ade3"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-8f788499dc44"
                                  ><span class="wh-inline-4cf6c17959a7"
                                    >11A</span
                                  ></td
                                >
                                <td class="wh-inline-b78b0a434cc3"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >If yes, specify the date of refund
                                    (mm/dd/yyyy)</span
                                  ></td
                                >
                                <td class="wh-inline-04d4f857303d">
                                  <span class="wh-inline-cb3a2164388b">
                                    <span aria-label="txtRefMonth" class="iceSelOneMnu-dis labels wh-print-select" data-field-id="frm1604c:txtRefMonth" data-print-control="select" id="frm1604c:txtRefMonth">{model.text["frm1604c:txtRefMonth"] ?? ""}</span>
                                    <input aria-label="txtRefDate" class="iceInpTxt-dis wh-source-size-2" data-field-id="frm1604c:txtRefDate" data-print-control="text" data-print-value="" id="frm1604c:txtRefDate" maxlength="2" readonly size="2" type="text" value={model.text["frm1604c:txtRefDate"] ?? ""}>
                                    <input aria-label="txtRefYear" class="iceInpTxt-dis wh-source-size-4" data-field-id="frm1604c:txtRefYear" data-print-control="text" data-print-value="" id="frm1604c:txtRefYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1604c:txtRefYear"] ?? ""}>
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
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-8339e723f6fb">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-6472a62cf042"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-6472a62cf042"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-8c0d062b5bd9">
                                          <span class="wh-inline-4cf6c17959a7">
                                            12
                                          </span>
                                        </td>
                                        <td>
                                          <span class="wh-inline-cb3a2164388b"
                                            >Total Amount of Overremittance on
                                            Tax Withheld under Compensation
                                          </span>
                                        </td>
                                        <td>
                                          <span class="wh-inline-649b1ec8a1ed">
                                            <input aria-label="txt12" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-17" data-field-id="frm1604c:txt12" data-print-control="text" data-print-value="" id="frm1604c:txt12" maxlength="17" readonly size="17" type="text" value={model.text["frm1604c:txt12"] ?? ""}>
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
                        <td class="tblFormTd wh-inline-3709648fafb2">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-1ff0d3e4ade3"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-e48c3e299fc0"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    13
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Month of First Crediting of Overremittance
                                    (MM)</span
                                  ></td
                                >
                                <td class="wh-inline-69652284d042">
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <span aria-label="select13" class="iceSelOneMnu-dis labels wh-print-select" data-field-id="frm1604c:select13" data-print-control="select" id="frm1604c:select13">{model.text["frm1604c:select13"] ?? ""}</span>
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
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="tblForm wh-inline-101c52ee640b"
                  >
                    <tbody
                      ><tr><td class="tblFormTdPart"></td></tr>
                      <tr>
                        <td class="tblFormTdPart">
                          <div class="wh-inline-a30033456d9a">
                            <span class="wh-inline-97f71f169000">
                              <b
                                >Part II - Summary of Remittances per BIR Form
                                No. 1601-C</b
                              ></span
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd">
                          <table
                            border="1"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-605e5fd35839"
                            id="tblPt2"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-2bf0f868d38c">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >MONTH</span
                                    >
                                  </div>
                                </td>
                                <td class="wh-inline-96a5fafc8620">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >DATE OF REMITTANCE (MM/DD/YYYY)</span
                                    >
                                  </div>
                                </td>
                                <td class="wh-inline-96a5fafc8620">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >DRAWEE BANK/ BANK CODE/ AGENCY</span
                                    >
                                  </div>
                                </td>
                                <td class="wh-inline-96a5fafc8620">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TRA/eROR/eAR NUMBER</span
                                    >
                                  </div>
                                </td>
                                <td class="wh-inline-96a5fafc8620">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TAXES WITHHELD</span
                                    >
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JAN</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date1" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtSched1Date1" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date1" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date1"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal1" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal1" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal1" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal1"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra1" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra1" data-print-control="text" data-print-value="" id="frm1604c:txtTra1" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra1"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld1" class="iceInpTxt wh-inline-65ab22397fb5 wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld1" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld1" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld1"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >FEB</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date2" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtSched1Date2" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date2" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date2"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal2" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal2" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal2" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal2"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra2" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra2" data-print-control="text" data-print-value="" id="frm1604c:txtTra2" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra2"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld2" class="iceInpTxt wh-inline-65ab22397fb5 wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld2" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld2" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld2"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAR</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date3" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtSched1Date3" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date3" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date3"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal3" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal3" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal3" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal3"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra3" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra3" data-print-control="text" data-print-value="" id="frm1604c:txtTra3" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra3"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld3" class="iceInpTxt wh-inline-fb583c33805e wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld3" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld3" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld3"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >APR</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date4" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtSched1Date4" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date4" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date4"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal4" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal4" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal4" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal4"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra4" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra4" data-print-control="text" data-print-value="" id="frm1604c:txtTra4" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra4"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld4" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld4" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld4" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld4"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAY</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date5" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date5" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date5" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date5"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal5" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal5" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal5" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal5"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra5" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra5" data-print-control="text" data-print-value="" id="frm1604c:txtTra5" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra5"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld5" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld5" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld5" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld5"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUN</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date6" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date6" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date6" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date6"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal6" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal6" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal6" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal6"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra6" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra6" data-print-control="text" data-print-value="" id="frm1604c:txtTra6" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra6"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld6" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld6" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld6" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld6"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUL</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date7" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date7" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date7" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date7"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal7" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal7" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal7" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal7"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra7" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra7" data-print-control="text" data-print-value="" id="frm1604c:txtTra7" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra7"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld7" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld7" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld7" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld7"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >AUG</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date8" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date8" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date8" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date8"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal8" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal8" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal8" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal8"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra8" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra8" data-print-control="text" data-print-value="" id="frm1604c:txtTra8" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra8"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld8" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld8" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld8" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld8"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >SEP</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date9" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date9" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date9" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date9"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal9" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal9" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal9" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal9"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra9" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra9" data-print-control="text" data-print-value="" id="frm1604c:txtTra9" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra9"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld9" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld9" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld9" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld9"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >OCT</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date10" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date10" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date10" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date10"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal10" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal10" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal10" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal10"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra10" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra10" data-print-control="text" data-print-value="" id="frm1604c:txtTra10" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra10"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld10" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld10" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld10" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld10"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >NOV</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date11" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date11" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date11" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date11"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal11" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal11" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal11" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal11"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra11" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra11" data-print-control="text" data-print-value="" id="frm1604c:txtTra11" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra11"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld11" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld11" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld11" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld11"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >DEC</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date12" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-25" data-field-id="frm1604c:txtSched1Date12" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Date12" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtSched1Date12"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal12" class="iceInpTxt wh-source-size-25" data-field-id="frm1604c:txtSched1BankVal12" data-print-control="text" data-print-value="" id="frm1604c:txtSched1BankVal12" maxlength="50" readonly size="25" type="text" value={model.text["frm1604c:txtSched1BankVal12"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtTra12" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-25" data-field-id="frm1604c:txtTra12" data-print-control="text" data-print-value="" id="frm1604c:txtTra12" maxlength="10" readonly size="25" type="text" value={model.text["frm1604c:txtTra12"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld12" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheld12" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheld12" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheld12"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >TOTAL</span
                                  ></td
                                >
                                <td> </td>
                                <td> </td>
                                <td> </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheldTotal" class="iceInpTxt-dis wh-inline-66176b40dd0c wh-source-size-25" data-field-id="frm1604c:txtSched1TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TaxWheldTotal" maxlength="25" readonly size="25" type="text" value={model.text["frm1604c:txtSched1TaxWheldTotal"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="tblFormTd">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-cf754d2a0594"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <span class="wh-inline-dd2eceacf41a"
                                    >Continuation of Part II</span
                                  ></td
                                >
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="tblFormTd">
                          <table
                            border="1"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-605e5fd35839"
                            id="tblPt2_1"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-be93aa044c2c"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >MONTH</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-42854b233a00"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >ADJUSTMENT</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-42854b233a00"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >PENALTIES</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-42854b233a00"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TOTAL AMOUNT REMITTED</span
                                    >
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JAN</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj1" class="iceInpTxt wh-inline-2f8afa906b5b wh-source-size-40" data-field-id="frm1604c:txtSched1Adj1" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj1" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj1"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen1" class="iceInpTxt wh-inline-4a2c350afaf3 wh-source-size-40" data-field-id="frm1604c:txtSched1Pen1" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen1" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen1"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt1" class="iceInpTxt-dis wh-inline-78f25bb9b8fc wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt1" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt1" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt1"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >FEB</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj2" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj2" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj2" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj2"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen2" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen2" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen2" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen2"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt2" class="iceInpTxt-dis wh-inline-66176b40dd0c wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt2" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt2" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt2"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAR</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj3" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj3" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj3" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj3"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen3" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen3" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen3" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen3"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt3" class="iceInpTxt-dis wh-inline-66176b40dd0c wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt3" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt3" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt3"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >APR</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj4" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj4" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj4" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj4"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen4" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen4" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen4" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen4"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt4" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt4" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt4" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt4"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAY</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj5" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj5" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj5" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj5"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen5" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen5" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen5" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen5"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt5" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt5" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt5" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt5"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUN</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj6" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj6" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj6" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj6"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen6" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen6" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen6" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen6"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt6" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt6" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt6" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt6"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUL</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj7" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj7" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj7" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj7"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen7" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen7" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen7" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen7"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt7" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt7" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt7" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt7"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >AUG</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj8" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj8" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj8" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj8"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen8" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen8" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen8" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen8"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt8" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt8" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt8" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt8"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >SEP</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj9" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj9" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj9" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj9"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen9" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen9" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen9" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen9"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt9" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt9" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt9" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt9"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >OCT</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj10" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj10" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj10" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj10"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen10" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen10" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen10" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen10"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt10" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt10" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt10" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt10"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >NOV</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj11" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj11" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj11" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj11"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen11" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen11" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen11" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen11"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt11" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt11" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt11" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt11"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >DEC</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj12" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Adj12" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Adj12" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Adj12"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen12" class="iceInpTxt wh-inline-73a2d4ef258f wh-source-size-40" data-field-id="frm1604c:txtSched1Pen12" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Pen12" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Pen12"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt12" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1TotalAmt12" data-print-control="text" data-print-value="" id="frm1604c:txtSched1TotalAmt12" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1TotalAmt12"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >TOTAL</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1AdjTotal" class="iceInpTxt-dis wh-inline-66176b40dd0c wh-source-size-40" data-field-id="frm1604c:txtSched1AdjTotal" data-print-control="text" data-print-value="" id="frm1604c:txtSched1AdjTotal" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1AdjTotal"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1PenTotal" class="iceInpTxt-dis wh-inline-66176b40dd0c wh-source-size-40" data-field-id="frm1604c:txtSched1PenTotal" data-print-control="text" data-print-value="" id="frm1604c:txtSched1PenTotal" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1PenTotal"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Total" class="iceInpTxt-dis wh-inline-1f6fb462b274 wh-source-size-40" data-field-id="frm1604c:txtSched1Total" data-print-control="text" data-print-value="" id="frm1604c:txtSched1Total" maxlength="25" readonly size="40" type="text" value={model.text["frm1604c:txtSched1Total"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="imgClass wh-inline-99a93d625634">
                    <table
                      border="1"
                      cellpadding="0"
                      cellspacing="0"
                      class="wh-inline-2ee7cc988ada"
                    >
                      <tbody
                        ><tr>
                          <td class="wh-inline-22e9fe9f49b0" colspan="2"
                            >I/We declare, under the penalties of perjury that
                            this return, and all its attachments, has been made
                            in good faith, verified by me/us, and to the best of
                            my/our knowledge and belief, is true and correct,
                            pursuant to the provisions of the National Internal
                            Revenue Code, as amended, and the regulations issued
                            under authority thereof. Further I/We give my/our
                            consent to the processing of my/our information as
                            contemplated under the *Data Privacy Act of 2012
                            (R.A. No. 10173) for legitimate and lawful purposes.
                          </td>
                        </tr>
                        <tr class="wh-inline-22480bed8775">
                          <td class="wh-inline-04d4f857303d">
                            For Individual:</td
                          >
                          <td class="wh-inline-04d4f857303d">
                            For Non-Individual:</td
                          >
                        </tr>
                        <tr class="wh-inline-62c7b1cc0b82">
                          <td
                            >Signature over Printed Name of Taxpayer/Authorized
                            Representative/Tax Agent<br />
                            <i>(Indicate Title/Designation and TIN)</i>
                          </td>
                          <td
                            >Signature over Printed Name of President/Vice
                            Preident/Authorized Officer or Representative/Tax
                            Agent<br />
                            <i>(Indicate Title/Designation and TIN)</i>
                          </td>
                        </tr>
                        <tr> </tr></tbody
                      >
                    </table>
                    <table
                      border="1"
                      cellpadding="0"
                      cellspacing="0"
                      class="wh-inline-49c7ab4b686d"
                    >
                      <tbody
                        ><tr
                          ><td class="wh-inline-245aee045aae"
                            >Tax Agent Accreditation No./ Attorney’s Roll No. <i
                              >(if applicable)</i
                            ></td
                          >
                          <td class="wh-inline-f99c236f78b6"></td>
                          <td class="wh-inline-2bf0f868d38c"
                            >Date of Issue <br /><i>(MM/DD/YYYY)</i></td
                          >
                          <td class="wh-inline-f99c236f78b6"></td>
                          <td class="wh-inline-2bf0f868d38c"
                            >Date of Expiry <br /><i>(MM/DD/YYYY)</i></td
                          >
                          <td class="wh-inline-f99c236f78b6"></td>
                        </tr></tbody
                      >
                    </table>
                  </div></td
                ></tr
              >
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
  {#each model.continuations as continuation (continuation.id)}
    <div
      class="withholding-print-page-content wh-continuation-page"
      data-source-page="continuation"
    >
      <section class="original-continuation withholding-print-continuation">
        <h2>BIR Form 1604C — {continuation.title}</h2>
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
