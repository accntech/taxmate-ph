<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1604f:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1604f:amendedRtn_1",
    "source": "frm1604f:amendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604f:amendedRtn_2",
    "source": "frm1604f:amendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604f:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1604f:tinA",
    "fallback": ""
  },
  {
    "id": "frm1604f:tinB",
    "fallback": ""
  },
  {
    "id": "frm1604f:tinC",
    "fallback": ""
  },
  {
    "id": "frm1604f:branchCode",
    "fallback": ""
  },
  {
    "id": "frm1604f:rdoCode",
    "fallback": ""
  },
  {
    "id": "frm1604f:registeredName",
    "fallback": ""
  },
  {
    "id": "frm1604f:RegisteredAddress",
    "fallback": ""
  },
  {
    "id": "frm1604f:zipCode",
    "fallback": ""
  },
  {
    "id": "frm1604f:categoryAgent_1",
    "source": "frm1604f:categoryAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1604f:categoryAgent_2",
    "source": "frm1604f:categoryAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1604f:privateAgent_1",
    "source": "frm1604f:privateAgent",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604f:privateAgent_2",
    "source": "frm1604f:privateAgent",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604f:telephoneNumber",
    "fallback": ""
  },
  {
    "id": "frm1604f:email",
    "fallback": ""
  },
  {
    "id": "frm1604f:taxRelief_1",
    "source": "frm1604f:taxRelief",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604f:taxRelief_2",
    "source": "frm1604f:taxRelief",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604f:availedTaxRelief",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1Date1",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TRA1",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Date2",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TRA2",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Date3",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TRA3",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Date4",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TRA4",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched1TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched1Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Date1",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TRA1",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Date2",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TRA2",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Date3",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TRA3",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Date4",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TRA4",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched2TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched2Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Date1",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TRA1",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Date2",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TRA2",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Date3",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TRA3",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Date4",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TRA4",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtSched3TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtSched3Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1604f:txtPg2TIN1",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtPg2TIN2",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtPg2TIN3",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtPg2BranchCode",
    "fallback": ""
  },
  {
    "id": "frm1604f:txtPg2TaxpayerName",
    "fallback": ""
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1604F", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1604F"
  aria-label="BIR Form 1604F print preview"
>
  <div
    class="withholding-print-page-content wh-page-1604f-1"
    data-source-page="1"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page1Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-e40b23c7aa3d"
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
      <table
        border="1"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-96b27c8a836c wh-eq-header"
      >
        <tbody
          ><tr>
            <td class="wh-inline-e797b9c9ddc0">
              <span class="wh-inline-429482632af7">BIR Form No.</span>
              <br /><span class="wh-inline-aec978eca301">1604-F</span>
              <br /><span class="wh-inline-429482632af7">January 2018</span>
              <br /><span class="wh-inline-ccf4a15a8876">Page 1</span>
            </td>
            <td class="wh-inline-62471ef2f05a">
              <span class="wh-inline-aec978eca301"
                >Annual Information Return</span
              >
              <br /><span class="wh-inline-efa796cba67a"
                >of Income Payments Subjected to Final Withholding Taxes</span
              >
              <br /><span class="wh-inline-429482632af7"
                >Enter all required information in CAPITAL LETTERS using BLACK
                ink. Mark all applicable boxes with an "X". Two copies MUST be
                filed with the BIR and one held by the Tax Filer.</span
              >
            </td>
            <td class="wh-inline-750980d32d58">
              <p>
                <img
                  alt="BIR form identifying mark"
                  class="wh-inline-5dfba9815e30"
                  height="75px"
                  src="/legacy/img/withholding/original-d0ffdd1dbf69b1a6.jpg"
                  width="220"
                />
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="tblForm wh-inline-02b193bd7728"
      >
        <tbody
          ><tr>
            <td class="tblFormTd wh-inline-007db826741b">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-adb92ed87308"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-6e606d24db7d"
                      ><span class="wh-inline-4cf6c17959a7"> 1 </span></td
                    >
                    <td colspan="2"
                      ><span class="wh-inline-cb3a2164388b"
                        >For the Year (YYYY)
                        <input class="wh-source-size-5" aria-label="txtYear" data-field-id="frm1604f:txtYear" data-print-control="text" data-print-value="" id="frm1604f:txtYear" maxlength="4" readonly size="5" type="text" value={model.text["frm1604f:txtYear"] ?? ""}>
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
                class="wh-inline-8b311397ec9d"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-38eb7c1ab5d2"
                      ><span class="wh-inline-4cf6c17959a7">2</span></td
                    >
                    <td class="wh-inline-1a5329f85423"
                      ><span class="wh-inline-cb3a2164388b"
                        >Amended Return?</span
                      ></td
                    >
                    <td class="wh-inline-21f315789b7b">
                      <fieldset
                        class="iceSelOneRb-dis fieldText1-dis wh-inline-3276beb56669"
                        id="frm1604f:j_id217"
                      >
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="iceSelOneRb-dis fieldText1-dis wh-inline-cf7ad91bd2f7"
                        >
                          <tbody>
                            <tr>
                              <td
                                ><input aria-label="amendedRtn_1" checked={model.checks["frm1604f:amendedRtn_1"] ?? false} data-field-id="frm1604f:amendedRtn_1" data-print-control="radio" disabled id="frm1604f:amendedRtn_1" type="radio"/><span class="wh-inline-cb3a2164388b">Yes</span>
                              </td>
                              <td
                                ><input aria-label="amendedRtn_2" checked={model.checks["frm1604f:amendedRtn_2"] ?? false} data-field-id="frm1604f:amendedRtn_2" data-print-control="radio" disabled id="frm1604f:amendedRtn_2" type="radio"/><span class="wh-inline-cb3a2164388b">No</span
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
                class="wh-inline-e706b7a89077"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-6e606d24db7d"
                      ><span class="wh-inline-4cf6c17959a7"> 3 </span></td
                    >
                    <td
                      ><span class="wh-inline-cb3a2164388b"
                        >No. of Sheets Attached?
                        <input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1604f:txtSheets" data-print-control="text" data-print-value="" id="frm1604f:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1604f:txtSheets"] ?? ""}>
                      </span></td
                    >
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        border="1"
        cellpadding="0"
        cellspacing="0"
        class="tblForm wh-inline-02b193bd7728"
      >
        <tbody
          ><tr>
            <td class="tblFormTdPart">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-e2d7ad1eb5b2"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-2ea09d9b12c3">
                      <span class="wh-inline-7dbd70daabfc"
                        >Part I - Background Information</span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="tblForm wh-inline-fe37f6126e21"
      >
        <tbody
          ><tr>
            <td class="tblFormTd wh-inline-59f6faf86071">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-b1ee23d6d9de"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-6e606d24db7d"
                      ><span class="wh-inline-15663751d502"> 4 </span></td
                    >
                    <td>
                      <span class="wh-inline-cb3a2164388b"
                        >Taxpayer Identification Number (TIN)
                      </span>
                      <span class="wh-inline-649b1ec8a1ed">
                        <input class="wh-source-size-10" aria-label="tinA" data-field-id="frm1604f:tinA" data-print-control="text" data-print-value="" id="frm1604f:tinA" maxlength="3" readonly size="10" type="text" value={model.text["frm1604f:tinA"] ?? ""}>
                        <input class="wh-source-size-10" aria-label="tinB" data-field-id="frm1604f:tinB" data-print-control="text" data-print-value="" id="frm1604f:tinB" maxlength="3" readonly size="10" type="text" value={model.text["frm1604f:tinB"] ?? ""}>
                        <input class="wh-source-size-10" aria-label="tinC" data-field-id="frm1604f:tinC" data-print-control="text" data-print-value="" id="frm1604f:tinC" maxlength="3" readonly size="10" type="text" value={model.text["frm1604f:tinC"] ?? ""}>
                        <input class="wh-source-size-10" aria-label="branchCode" data-field-id="frm1604f:branchCode" data-print-control="text" data-print-value="" id="frm1604f:branchCode" maxlength="3" readonly size="10" type="text" value={model.text["frm1604f:branchCode"] ?? ""}>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td class="tblFormTd wh-inline-26dfa8e923b2">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-9b83695dcbf9"
              >
                <tbody><tr> </tr></tbody>
              </table>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-9b83695dcbf9"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-6e606d24db7d"
                      ><span class="wh-inline-4cf6c17959a7"> 5 </span></td
                    >
                    <td colspan="2"
                      ><span class="wh-inline-cb3a2164388b"
                        >RDO Code  
                        <input class="wh-source-size-1" aria-label="rdoCode" data-field-id="frm1604f:rdoCode" data-print-control="text" data-print-value="" id="frm1604f:rdoCode" maxlength="3" readonly size="1" type="text" value={model.text["frm1604f:rdoCode"] ?? ""}>
                      </span></td
                    >
                  </tr>
                </tbody>
              </table>
            </td></tr
          ></tbody
        >
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-52a07e14be0e"
      >
        <tbody
          ><tr>
            <td class="wh-inline-60fc33614910">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-13fef044298f"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-36fb844716a5"
                      ><span class="wh-inline-4cf6c17959a7"> 6 </span></td
                    >
                    <td
                      ><span class="wh-inline-cb3a2164388b"
                        >Withholding Agent's Name (Last Name, First Name, Middle
                        Name for Individual OR Registered Name for
                        Non-Individual)</span
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
                class="wh-inline-13fef044298f"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-36fb844716a5"> </td>
                    <td
                      ><input class="wh-source-size-125" aria-label="registeredName" data-field-id="frm1604f:registeredName" data-print-control="text" data-print-value="" id="frm1604f:registeredName" maxlength="70" readonly size="125" type="text" value={model.text["frm1604f:registeredName"] ?? ""}></td
                    >
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table class="wh-inline-09fdaa189848">
        <tbody
          ><tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-25b5bd730945"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-05f593e69f44"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-551ace705a2f"
                              ><span class="wh-inline-4cf6c17959a7">
                                7
                              </span><span class="wh-inline-cb3a2164388b"
                                >Registered Address (Indicate complete address.
                                If branch, indicate the branch address. If the
                                registered address is different from the current
                                address, go to the RDO to update registered
                                address by using BIR Form No. 1905)</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td class="wh-inline-36fe9f8cef2e">
                              <span class="wh-inline-649b1ec8a1ed">
                                <input aria-label="RegisteredAddress" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-100" data-field-id="frm1604f:RegisteredAddress" data-print-control="text" data-print-value="" id="frm1604f:RegisteredAddress" maxlength="25" readonly size="100" type="text" value={model.text["frm1604f:RegisteredAddress"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-5b89105c6540">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-40b4f2df6b82"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-ca629fed53a8"
                              ><span class="wh-inline-4cf6c17959a7">
                                7A
                              </span><span class="wh-inline-cb3a2164388b"
                                >ZIP Code</span
                              ></td
                            >
                            <td class="wh-inline-36fe9f8cef2e">
                              <span class="wh-inline-649b1ec8a1ed">
                                <input aria-label="zipCode" class="wh-inline-386bb5d6139a wh-source-size-5" data-field-id="frm1604f:zipCode" data-print-control="text" data-print-value="" id="frm1604f:zipCode" maxlength="6" readonly size="5" type="text" value={model.text["frm1604f:zipCode"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table></td
            >
          </tr>
          <tr>
            <td class="tblFormTd wh-inline-3709648fafb2" colspan="2">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-f0ca793a1b7e"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-4cf6c17959a7"> 8 </span>
                    </td><td class="wh-inline-42854b233a00"
                      ><span class="wh-inline-cb3a2164388b"
                        >Category of Withholding Agent</span
                      ></td
                    >
                    <td class="">
                      <fieldset
                        class="iceSelOneRb-dis fieldText1-dis wh-inline-3e5b87e4cdc1"
                        id="frm1604f:j_id398"
                      >
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="iceSelOneRb-dis fieldText1-dis wh-inline-33b07a1da916"
                        >
                          <tbody>
                            <tr>
                              <td
                                ><input aria-label="categoryAgent_1" checked={model.checks["frm1604f:categoryAgent_1"] ?? false} data-field-id="frm1604f:categoryAgent_1" data-print-control="radio" disabled id="frm1604f:categoryAgent_1" type="radio"/>
                                <span class="wh-inline-cb3a2164388b"
                                  >Private</span
                                >
                              </td>
                              <td
                                ><input aria-label="categoryAgent_2" checked={model.checks["frm1604f:categoryAgent_2"] ?? false} data-field-id="frm1604f:categoryAgent_2" data-print-control="radio" disabled id="frm1604f:categoryAgent_2" type="radio"/>
                                <span class="wh-inline-cb3a2164388b"
                                  >Government</span
                                ></td
                              >
                            </tr>
                          </tbody>
                        </table>
                      </fieldset>
                    </td>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-4cf6c17959a7"> 8A </span>
                    </td><td class="wh-inline-42854b233a00"
                      ><span class="wh-inline-429482632af7">
                        If private, top withholding agent?</span
                      ></td
                    >
                    <td class="wh-inline-21f315789b7b">
                      <fieldset
                        class="iceSelOneRb-dis fieldText1-dis wh-inline-d4b1b44400ed"
                        id="frm1604f:j_id217"
                      >
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="iceSelOneRb-dis fieldText1-dis wh-inline-2feb2201e019"
                        >
                          <tbody>
                            <tr>
                              <td
                                ><input aria-label="privateAgent_1" checked={model.checks["frm1604f:privateAgent_1"] ?? false} data-field-id="frm1604f:privateAgent_1" data-print-control="radio" disabled id="frm1604f:privateAgent_1" type="radio"/><span class="wh-inline-cb3a2164388b">Yes</span>
                              </td>
                              <td
                                ><input aria-label="privateAgent_2" checked={model.checks["frm1604f:privateAgent_2"] ?? false} data-field-id="frm1604f:privateAgent_2" data-print-control="radio" disabled id="frm1604f:privateAgent_2" type="radio"/><span class="wh-inline-cb3a2164388b">No</span
                                ></td
                              >
                            </tr>
                          </tbody>
                        </table>
                      </fieldset>
                    </td>
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"> </td>
                    <td>
                      <span class="wh-inline-cb3a2164388b"> </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="tblForm wh-inline-02b193bd7728"
      >
        <tbody
          ><tr>
            <td class="tblFormTd wh-inline-ee18e890dfc1">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-3a08003d9fc2"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-ca629fed53a8"
                      ><span class="wh-inline-4cf6c17959a7"> 9 </span><span
                        class="wh-inline-cb3a2164388b">Contact Number</span
                      ></td
                    >
                    <td class="wh-inline-36fe9f8cef2e">
                      <span class="wh-inline-649b1ec8a1ed">
                        <input aria-label="telephoneNumber" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-25" data-field-id="frm1604f:telephoneNumber" data-print-control="text" data-print-value="" id="frm1604f:telephoneNumber" maxlength="25" readonly size="25" type="text" value={model.text["frm1604f:telephoneNumber"] ?? ""}>
                      </span>
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
                class="wh-inline-bffe0b5e1095"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-ca629fed53a8"
                      ><span class="wh-inline-4cf6c17959a7"> 10 </span><span
                        class="wh-inline-cb3a2164388b">Email</span
                      ></td
                    >
                    <td class="wh-inline-36fe9f8cef2e">
                      <span class="wh-inline-649b1ec8a1ed">
                        <input aria-label="email" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-25" data-field-id="frm1604f:email" data-print-control="text" data-print-value="" id="frm1604f:email" maxlength="25" readonly size="25" type="text" value={model.text["frm1604f:email"] ?? ""}>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="tblForm wh-inline-02b193bd7728"
      >
        <tbody
          ><tr>
            <td class="tblFormTd wh-inline-3709648fafb2" colspan="2">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-e5d4d4eac38a"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-fb80c902a415"
                      ><span class="wh-inline-4cf6c17959a7"> 11 </span>
                    </td><td class="wh-inline-42854b233a00"
                      ><span class="wh-inline-cb3a2164388b"
                        >Are there payees availing of tax relief under Special
                        Law or International Tax Treaty?</span
                      ></td
                    >
                    <td class="">
                      <fieldset
                        class="iceSelOneRb-dis fieldText1-dis wh-inline-3e5b87e4cdc1"
                        id="frm1604f:j_id398"
                      >
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="iceSelOneRb-dis fieldText1-dis wh-inline-33b07a1da916"
                        >
                          <tbody>
                            <tr>
                              <td
                                ><span class="wh-inline-429482632af7"
                                  ><input aria-label="taxRelief_1" checked={model.checks["frm1604f:taxRelief_1"] ?? false} data-field-id="frm1604f:taxRelief_1" data-print-control="radio" disabled id="frm1604f:taxRelief_1" type="radio"/>
                                  <span class="wh-inline-cb3a2164388b">Yes</span
                                  ></span
                                ></td
                              >
                              <td
                                ><span class="wh-inline-429482632af7">
                                  <input aria-label="taxRelief_2" checked={model.checks["frm1604f:taxRelief_2"] ?? false} data-field-id="frm1604f:taxRelief_2" data-print-control="radio" disabled id="frm1604f:taxRelief_2" type="radio"/>
                                  <span class="wh-inline-cb3a2164388b">No</span>
                                </span></td
                              >
                            </tr>
                          </tbody>
                        </table>
                      </fieldset>
                    </td>
                    <td class="tblFormTd wh-inline-ee18e890dfc1">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-730b1ddfb2c8"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-36fe9f8cef2e"
                              ><span class="wh-inline-4cf6c17959a7">
                                11A
                              </span><span class="wh-inline-cb3a2164388b"
                                >If yes, specify</span
                              ></td
                            >
                            <td class="wh-inline-57becd9072ec">
                              <span class="wh-inline-649b1ec8a1ed">
                                <input aria-label="availedTaxRelief" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-25" data-field-id="frm1604f:availedTaxRelief" data-print-control="text" data-print-value="" id="frm1604f:availedTaxRelief" maxlength="25" readonly size="25" type="text" value={model.text["frm1604f:availedTaxRelief"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table></td
            >
          </tr>
        </tbody>
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="tblForm wh-inline-02b193bd7728"
      >
        <tbody
          ><tr>
            <td class="tblFormTdPart">
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-d64511d57940"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-36fe9f8cef2e">
                      <span class="wh-inline-dd2eceacf41a"> </span></td
                    >
                    <td class="wh-inline-574b29391e25">
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-7dbd70daabfc"
                          >Part II - Summary of Remittances</span
                        >
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="tblFormTd"
              ><table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-76b7da88753b"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-574b29391e25">
                      <span class="wh-inline-dd2eceacf41a"
                        >Schedule 1 - Remittance per BIR Form No. 1601-FQ on
                        Final Taxes Withheld</span
                      ></td
                    >
                    <td class="wh-inline-574b29391e25"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          ><span class="wh-inline-97f71f169000"
                            ><span class="wh-inline-cb3a2164388b"><b></b></span
                            ></span
                          ><span class="wh-inline-6d319e71fe1f"></span></span
                        >
                      </div></td
                    >
                  </tr>
                </tbody>
              </table></td
            >
          </tr>
          <tr>
            <td class="tblFormTd"
              ><table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-ef74251dc06e"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-659bd98a351c"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">QUARTER</span>
                      </div></td
                    >
                    <td class="wh-inline-61083633b64c"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >DATE OF REMITTANCE (MM/DD/YYYY)</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-13857724704e"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TRA/eROR/eAR Number</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-2e3ce3500fda"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TAXES WITHHELD</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-827e7a1ba5cb"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">PENALTIES</span>
                      </div></td
                    >
                    <td class="wh-inline-827e7a1ba5cb"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TOTAL AMOUNT REMITTED</span
                        >
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">1st Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched1Date1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604f:txtSched1Date1" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Date1" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched1Date1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched1TRA1" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched1TRA1" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TRA1" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TRA1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TaxWheld1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1TaxWheld1" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TaxWheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TaxWheld1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1Pen1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1Pen1" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Pen1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1Pen1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TotalAmt1" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched1TotalAmt1" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TotalAmt1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TotalAmt1"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">2nd Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched1Date2" class="iceInpTxt wh-inline-e21ee47d6a9e wh-source-size-13" data-field-id="frm1604f:txtSched1Date2" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Date2" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched1Date2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched1TRA2" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched1TRA2" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TRA2" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TRA2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TaxWheld2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1TaxWheld2" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TaxWheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TaxWheld2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1Pen2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1Pen2" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Pen2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1Pen2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TotalAmt2" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched1TotalAmt2" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TotalAmt2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TotalAmt2"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">3rd Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched1Date3" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched1Date3" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Date3" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched1Date3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched1TRA3" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched1TRA3" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TRA3" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TRA3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TaxWheld3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1TaxWheld3" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TaxWheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TaxWheld3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1Pen3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1Pen3" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Pen3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1Pen3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TotalAmt3" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched1TotalAmt3" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TotalAmt3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TotalAmt3"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">4th Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched1Date4" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched1Date4" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Date4" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched1Date4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched1TRA4" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched1TRA4" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TRA4" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TRA4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TaxWheld4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1TaxWheld4" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TaxWheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TaxWheld4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1Pen4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched1Pen4" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Pen4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1Pen4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TotalAmt4" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched1TotalAmt4" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TotalAmt4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TotalAmt4"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td><span class="wh-inline-429482632af7">TOTAL</span></td>
                    <td><div class="wh-inline-a30033456d9a"></div></td>
                    <td><div class="wh-inline-a30033456d9a"></div></td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1TaxWheldTotal" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched1TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604f:txtSched1TaxWheldTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1TaxWheldTotal"] ?? ""}>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1PenTotal" class="iceInpTxt-dis wh-inline-814fd7bc6f1a wh-source-size-20" data-field-id="frm1604f:txtSched1PenTotal" data-print-control="text" data-print-value="" id="frm1604f:txtSched1PenTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1PenTotal"] ?? ""}>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched1Total" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched1Total" data-print-control="text" data-print-value="" id="frm1604f:txtSched1Total" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched1Total"] ?? ""}>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="tblFormTd"
              ><table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-76b7da88753b"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-574b29391e25">
                      <span class="wh-inline-dd2eceacf41a"
                        >Schedule 2 - Remittance per BIR Form No. 1602Q on
                        Interest Payments</span
                      ></td
                    >
                    <td class="wh-inline-574b29391e25"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          ><span class="wh-inline-97f71f169000"
                            ><span class="wh-inline-cb3a2164388b"><b></b></span
                            ></span
                          ><span class="wh-inline-6d319e71fe1f"></span></span
                        >
                      </div></td
                    >
                  </tr>
                </tbody>
              </table></td
            >
          </tr>
          <tr>
            <td class="tblFormTd"
              ><table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-ef74251dc06e"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-659bd98a351c"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">QUARTER</span>
                      </div></td
                    >
                    <td class="wh-inline-61083633b64c"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >DATE OF REMITTANCE (MM/DD/YYYY)</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-13857724704e"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TRA/eROR/eAR Number</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-2e3ce3500fda"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TAXES WITHHELD</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-827e7a1ba5cb"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">PENALTIES</span>
                      </div></td
                    >
                    <td class="wh-inline-827e7a1ba5cb"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TOTAL AMOUNT REMITTED</span
                        >
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">1st Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched2Date1" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched2Date1" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Date1" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched2Date1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched2TRA1" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched2TRA1" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TRA1" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TRA1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TaxWheld1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2TaxWheld1" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TaxWheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TaxWheld1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2Pen1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2Pen1" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Pen1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2Pen1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TotalAmt1" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched2TotalAmt1" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TotalAmt1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TotalAmt1"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">2nd Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched2Date2" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched2Date2" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Date2" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched2Date2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched2TRA2" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched2TRA2" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TRA2" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TRA2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TaxWheld2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2TaxWheld2" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TaxWheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TaxWheld2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2Pen2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2Pen2" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Pen2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2Pen2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TotalAmt2" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched2TotalAmt2" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TotalAmt2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TotalAmt2"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">3rd Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched2Date3" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched2Date3" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Date3" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched2Date3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched2TRA3" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched2TRA3" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TRA3" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TRA3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TaxWheld3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2TaxWheld3" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TaxWheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TaxWheld3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2Pen3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2Pen3" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Pen3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2Pen3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TotalAmt3" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched2TotalAmt3" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TotalAmt3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TotalAmt3"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">4th Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched2Date4" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched2Date4" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Date4" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched2Date4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched2TRA4" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched2TRA4" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TRA4" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TRA4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TaxWheld4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2TaxWheld4" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TaxWheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TaxWheld4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2Pen4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched2Pen4" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Pen4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2Pen4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TotalAmt4" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched2TotalAmt4" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TotalAmt4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TotalAmt4"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td><span class="wh-inline-429482632af7">TOTAL</span></td>
                    <td><div class="wh-inline-a30033456d9a"></div></td>
                    <td><div class="wh-inline-a30033456d9a"></div></td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2TaxWheldTotal" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched2TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604f:txtSched2TaxWheldTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2TaxWheldTotal"] ?? ""}>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2PenTotal" class="iceInpTxt-dis wh-inline-814fd7bc6f1a wh-source-size-20" data-field-id="frm1604f:txtSched2PenTotal" data-print-control="text" data-print-value="" id="frm1604f:txtSched2PenTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2PenTotal"] ?? ""}>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched2Total" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched2Total" data-print-control="text" data-print-value="" id="frm1604f:txtSched2Total" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched2Total"] ?? ""}>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td class="tblFormTd"
              ><table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-76b7da88753b"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-574b29391e25">
                      <span class="wh-inline-dd2eceacf41a"
                        >Schedule 3 - Remittance per BIR Form No. 1603Q on
                        Fringe Benefits</span
                      ></td
                    >
                    <td class="wh-inline-574b29391e25"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          ><span class="wh-inline-97f71f169000"
                            ><span class="wh-inline-cb3a2164388b"><b></b></span
                            ></span
                          ><span class="wh-inline-6d319e71fe1f"></span></span
                        >
                      </div></td
                    >
                  </tr>
                </tbody>
              </table></td
            >
          </tr>
          <tr>
            <td class="tblFormTd"
              ><table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-ef74251dc06e"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-659bd98a351c"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">QUARTER</span>
                      </div></td
                    >
                    <td class="wh-inline-61083633b64c"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >DATE OF REMITTANCE (MM/DD/YYYY)</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-13857724704e"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TRA/eROR/eAR Number</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-2e3ce3500fda"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TAXES WITHHELD</span
                        >
                      </div></td
                    >
                    <td class="wh-inline-827e7a1ba5cb"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">PENALTIES</span>
                      </div></td
                    >
                    <td class="wh-inline-827e7a1ba5cb"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >TOTAL AMOUNT REMITTED</span
                        >
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">1st Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched3Date1" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched3Date1" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Date1" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched3Date1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched3TRA1" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched3TRA1" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TRA1" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TRA1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TaxWheld1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3TaxWheld1" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TaxWheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TaxWheld1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3Pen1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3Pen1" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Pen1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3Pen1"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TotalAmt1" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched3TotalAmt1" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TotalAmt1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TotalAmt1"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">2nd Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched3Date2" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched3Date2" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Date2" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched3Date2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched3TRA2" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched3TRA2" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TRA2" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TRA2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TaxWheld2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3TaxWheld2" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TaxWheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TaxWheld2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3Pen2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3Pen2" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Pen2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3Pen2"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TotalAmt2" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched3TotalAmt2" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TotalAmt2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TotalAmt2"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">3rd Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched3Date3" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched3Date3" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Date3" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched3Date3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched3TRA3" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched3TRA3" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TRA3" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TRA3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TaxWheld3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3TaxWheld3" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TaxWheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TaxWheld3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3Pen3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3Pen3" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Pen3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3Pen3"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TotalAmt3" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched3TotalAmt3" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TotalAmt3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TotalAmt3"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td
                      ><span class="wh-inline-429482632af7">4th Quarter</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">
                          <input aria-label="txtSched3Date4" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604f:txtSched3Date4" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Date4" maxlength="10" readonly size="13" type="text" value={model.text["frm1604f:txtSched3Date4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-649b1ec8a1ed">
                          <input aria-label="txtSched3TRA4" class="iceInpTxt wh-source-size-20" data-field-id="frm1604f:txtSched3TRA4" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TRA4" maxlength="50" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TRA4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TaxWheld4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3TaxWheld4" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TaxWheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TaxWheld4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3Pen4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604f:txtSched3Pen4" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Pen4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3Pen4"] ?? ""}>
                        </span>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TotalAmt4" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched3TotalAmt4" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TotalAmt4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TotalAmt4"] ?? ""}>
                        </span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td><span class="wh-inline-429482632af7">TOTAL</span></td>
                    <td><div class="wh-inline-a30033456d9a"></div></td>
                    <td><div class="wh-inline-a30033456d9a"></div></td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3TaxWheldTotal" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched3TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604f:txtSched3TaxWheldTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3TaxWheldTotal"] ?? ""}>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3PenTotal" class="iceInpTxt-dis wh-inline-814fd7bc6f1a wh-source-size-20" data-field-id="frm1604f:txtSched3PenTotal" data-print-control="text" data-print-value="" id="frm1604f:txtSched3PenTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3PenTotal"] ?? ""}>
                        </span>
                      </div>
                    </td>
                    <td>
                      <div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-232ced7b40ab">
                          <input aria-label="txtSched3Total" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604f:txtSched3Total" data-print-control="text" data-print-value="" id="frm1604f:txtSched3Total" maxlength="25" readonly size="20" type="text" value={model.text["frm1604f:txtSched3Total"] ?? ""}>
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
      <table
        border="1"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-1496179f2d7d"
      >
        <colgroup
          ><col class="wh-inline-80c99a796975" />
          <col class="wh-inline-80c99a796975" />
          <col class="wh-inline-80c99a796975" />
          <col class="wh-inline-80c99a796975" />
        </colgroup><tbody
          ><tr>
            <td class="wh-inline-9ef178b2fe20" colspan="4">
              I/We declare under the penalties of perjury that this return, and
              all its attachments, has been made in good faith, verified by
              me/us, and to the best of our knowledge and belief, is true and
              correct, pursuant to the provisions of the National Internal
              Revenue Code, as amended, and the regulations issued under
              authority thereof. Further, I/we give my/our consent to the
              processing of my/our information as contemplated under the *Data
              Privacy Act of 2012 (R.A. No. 10173) for legitimate and lawful
              purposes.
              <br /></td
            >
          </tr>
        </tbody>
      </table>
      <table
        border="1"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-61b06adb7789"
      >
        <tbody
          ><tr>
            <td class="wh-inline-04d4f857303d"
              >For Individual:<br /><br /><br /><br /><br /><br /><br /></td
            >
            <td class="wh-inline-04d4f857303d"
              >For Non-Individual:<br /><br /><br /><br /><br /></td
            >
          </tr>
        </tbody>
      </table>
      <table
        border="1"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-26fe619e893a"
      >
        <tbody
          ><tr>
            <td class="wh-inline-04d4f857303d"
              >Signature over Printed Name of Taxpayer/Authorized
              Representative/Tax Agent <em
                >(Indicate Title/Designation and TIN)</em
              >
            </td>
            <td class="wh-inline-04d4f857303d"
              >Signature over Printed Name of President/Vice
              President/Authorized Officer or Representative/Tax Agent <em
                >(Indicate Title/Designation and TIN)</em
              >
            </td>
          </tr>
        </tbody>
      </table>
      <table
        border="1"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-26fe619e893a"
      >
        <tbody
          ><tr>
            <td class="wh-inline-f99c236f78b6"
              >Tax Agent accreditation No./ Attorney's Roll No. <em
                >(If applicable)</em
              >
            </td>
            <td class="wh-inline-42854b233a00"> </td>
            <td class="wh-inline-be93aa044c2c"
              >Date of Issue<em>(MM/DD/YYYY)</em>
            </td>
            <td class="wh-inline-be7269108542"> </td>
            <td class="wh-inline-be93aa044c2c"
              >Date of Expiry<em>(MM/DD/YYYY)</em>
            </td>
            <td class="wh-inline-be7269108542"> </td>
          </tr>
        </tbody>
      </table>
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-61b06adb7789"
      >
        <tbody
          ><tr>
            <td class="wh-inline-afe9c6ec456f"
              >*NOTE: The BIR Data Privacy is in the BIR website
              (www.bir.gov.ph)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1604f-2"
    data-source-page="2"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page2Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-e40b23c7aa3d"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-e40b23c7aa3d"
              >
                <tbody
                  ><tr>
                    <td>
                      <table
                        border="1"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-51312fc9f886 wh-eq-header"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-e797b9c9ddc0">
                              <span class="wh-inline-429482632af7"
                                >BIR Form No.</span
                              >
                              <br /><span class="wh-inline-aec978eca301"
                                >1604-F</span
                              >
                              <br /><span class="wh-inline-429482632af7"
                                >January 2018</span
                              >
                              <br /><span class="wh-inline-ccf4a15a8876"
                                >Page 2</span
                              >
                            </td>
                            <td class="wh-inline-62471ef2f05a">
                              <span class="wh-inline-aec978eca301"
                                >Annual Information Return</span
                              >
                              <br /><span class="wh-inline-efa796cba67a"
                                >of Income Payments Subjected to Final
                                Withholding Taxes</span
                              >
                            </td>
                            <td class="wh-inline-bef36932d3a7">
                              <p>
                                <img
                                  alt="BIR form identifying mark"
                                  class="wh-inline-5dfba9815e30"
                                  height="75px"
                                  src="/legacy/img/withholding/original-d0ffdd1dbf69b1a6.jpg"
                                  width="220"
                                />
                              </p>
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
                class="tblForm wh-inline-e40b23c7aa3d"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-69652284d042"
                      ><span class="wh-inline-abbd0a6c6086">TIN</span></td
                    >
                    <td class="wh-inline-21f315789b7b"
                      ><span class="wh-inline-abbd0a6c6086"
                        >Withholding Agent's Name</span
                      ><span class="wh-inline-97f71f169000"
                        ><i>
                          (Last Name for Individual OR Registered Name for
                          Non-Individual)</i
                        ></span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>
                      <span class="wh-inline-649b1ec8a1ed">
                        <input class="wh-source-size-3" aria-label="txtPg2TIN1" data-field-id="frm1604f:txtPg2TIN1" data-print-control="text" data-print-value="" id="frm1604f:txtPg2TIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1604f:txtPg2TIN1"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN2" data-field-id="frm1604f:txtPg2TIN2" data-print-control="text" data-print-value="" id="frm1604f:txtPg2TIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1604f:txtPg2TIN2"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN3" data-field-id="frm1604f:txtPg2TIN3" data-print-control="text" data-print-value="" id="frm1604f:txtPg2TIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1604f:txtPg2TIN3"] ?? ""}>
                        <input class="wh-source-size-5" aria-label="txtPg2BranchCode" data-field-id="frm1604f:txtPg2BranchCode" data-print-control="text" data-print-value="" id="frm1604f:txtPg2BranchCode" maxlength="5" readonly size="5" type="text" value={model.text["frm1604f:txtPg2BranchCode"] ?? ""}>
                      </span>
                    </td>
                    <td
                      ><input class="wh-source-size-80" aria-label="txtPg2TaxpayerName" data-field-id="frm1604f:txtPg2TaxpayerName" data-print-control="text" data-print-value="" id="frm1604f:txtPg2TaxpayerName" maxlength="50" readonly size="80" type="text" value={model.text["frm1604f:txtPg2TaxpayerName"] ?? ""}></td
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
                class="tblForm wh-inline-e40b23c7aa3d"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart wh-inline-261df5a44a38">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-d64511d57940"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >PART III - Alphabetical List of Payees from
                                  whom Taxes were Withheld</span
                                > (Format Only)
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
                class="tblForm wh-inline-e40b23c7aa3d"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="wh-inline-4cf6c17959a7">
                        <i
                          >Schedule 4 - Alphalist of Payees Subjected to Final
                          Withholding Tax</i
                        ></span
                      ><span class="wh-inline-cb3a2164388b"></span> (Declared and
                      Certified using BIR Form No. 2306)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table class="tblForm wh-inline-da3c66e1a553">
                        <tbody
                          ><tr>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Seq. No.</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-1df8837affd5">TIN</span>
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Name of Payees</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i
                                  >(Last Name, First Name, Middle Name for
                                  Individual OR Registered Name for
                                  Non-Individual)</i
                                ></span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Address of Payees</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >*Status (As to Residence/Nationality)</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b">ATC</span>
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Nature of Income Payment (Refer to BIR Form No.
                                1601-FQ)</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Amount of Income Payment</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Tax Rate</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Amount of Tax Withheld (Not Creditable)</span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(1)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-1df8837affd5">(2)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(3)</span><br
                              />
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(4)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(5)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(6)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(7)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(8)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(9)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b"
                                >(10)=(8x9)</span
                              >
                            </td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td
                              class="tblFormTd wh-inline-75b7803ec210"
                              colspan="7"
                            >
                              <span class="wh-inline-15663751d502">
                                Total Final Withholding Tax</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210">
                              <span class="wh-inline-cb3a2164388b"> </span>
                            </td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="wh-inline-9d418c8d1d48">
                        <i
                          >Schedule 5 - Alphalist of Employees Other than Rank
                          and File Who were Given Fringe Benefits During the
                          Year</i
                        ></span
                      ><span class="wh-inline-98434e82a4a7"></span> (Declared and
                      certified using BIR Form No. 2306)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table class="tblForm wh-inline-da3c66e1a553">
                        <tbody
                          ><tr>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Seq. No.</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-1df8837affd5">TIN</span>
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Name of Employees</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i>(Last Name, First Name, Middle Name)</i
                                ></span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b">ATC</span>
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Nature of Fringe Benefit</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Amount of Fringe Benefit</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Grossed-up Monetary Value</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Tax Rate Amount of Tax Withheld</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i>(Not Creditable)</i></span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(1)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(2)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(3)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(4)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(5)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(6)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(7)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(8)</span>
                            </td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td
                              class="tblFormTd wh-inline-75b7803ec210"
                              colspan="5"
                            >
                              <span class="wh-inline-15663751d502">
                                Total Fringe Benefits Tax</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="tblFormTd">
                      <span class="wh-inline-9d418c8d1d48">
                        <i
                          >Schedule 6 - Alphalist of Other Payees Whose Income
                          Payments are Exempt from Withholding Tax but Subject
                          to Income Tax</i
                        ></span
                      ><span class="wh-inline-98434e82a4a7"></span> (Declared and
                      certified using BIR Form No. 2304)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table class="tblForm wh-inline-da3c66e1a553">
                        <tbody
                          ><tr>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Seq. No.</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-1df8837affd5">TIN</span>
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Name of Payees</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i
                                  >(Last Name, First Name, Middle for Individual
                                  OR Registered Name for Non-Individual)</i
                                ></span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Address of Payees</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b">*Status</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i>(As to Residence/Nationality)</i></span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b">ATC</span>
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Nature of Income Payment</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-4324464362f4">
                              <span class="wh-inline-cb3a2164388b"
                                >Amount of Income Payment</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i>(Not Creditable)</i></span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(1)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(2)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(3)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(4)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(5)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(6)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(7)</span>
                            </td>
                            <td class="tblFormTd wh-inline-689dda0853cb">
                              <span class="wh-inline-cb3a2164388b">(8)</span>
                            </td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td
                              class="tblFormTd wh-inline-75b7803ec210"
                              colspan="7"
                            >
                              <span class="wh-inline-15663751d502">
                                Total Income Payments Exempt from Withholding
                                Tax</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td></tr
                  ><tr> </tr><tr>
                    <td class="tblFormTd wh-inline-a995af938500">
                      <span class="wh-inline-cb3a2164388b"
                        >A - Citizens of the Philippines   B - Resident Alien
                        Individuals    C - Non-Resident Alien Engaged in
                        Business      D - Non-Resident Alien Not Engaged in
                        Business</span
                      ><br />
                      <span class="wh-inline-cb3a2164388b"
                        >E - Domestic Corporation           F - Resident Foreign
                        Corp.          G - Non-Resident Foreign Corp.
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
        <h2>BIR Form 1604F — {continuation.title}</h2>
        <p><span data-print-value="">{model.taxpayerName}</span> · TIN <span data-print-value="">{model.tin}</span></p>
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
