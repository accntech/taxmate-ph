<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1603Q:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1603Q:optQuarter1",
    "source": "frm1603Q:optQuarter",
    "choice": "1",
    "checked": false
  },
  {
    "id": "frm1603Q:optQuarter2",
    "source": "frm1603Q:optQuarter",
    "choice": "2",
    "checked": false
  },
  {
    "id": "frm1603Q:optQuarter3",
    "source": "frm1603Q:optQuarter",
    "choice": "3",
    "checked": false
  },
  {
    "id": "frm1603Q:optQuarter4",
    "source": "frm1603Q:optQuarter",
    "choice": "4",
    "checked": false
  },
  {
    "id": "frm1603Q:AmendedRtn_1",
    "source": "frm1603Q:AmendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1603Q:AmendedRtn_2",
    "source": "frm1603Q:AmendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1603Q:TaxWithheld_1",
    "source": "frm1603Q:TaxWithheld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1603Q:TaxWithheld_2",
    "source": "frm1603Q:TaxWithheld",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1603Q:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1603Q:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1603Q:txtRDOCode"
  },
  {
    "id": "frm1603Q:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAddress2",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1603Q:CatAgent_P",
    "source": "frm1603Q:CatAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1603Q:CatAgent_G",
    "source": "frm1603Q:CatAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "txtEmail",
    "fallback": ""
  },
  {
    "id": "frm1603Q:SpecialTax_1",
    "source": "frm1603Q:SpecialTax",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1603Q:SpecialTax_2",
    "source": "frm1603Q:SpecialTax",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1603Q:selTreaty",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty",
      "3": "Both"
    }
  },
  {
    "id": "frm1603Q:txtTax14",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax15",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txt16Other",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtTax16",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax17",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax18",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax19",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax20",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax21",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax22",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:txtTax23",
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
    "id": "frm1603Q:txtAgency24",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtNumber24",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtDate24",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAmount24",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAgency25",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtNumber25",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtDate25",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAmount25",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtNumber26",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtDate26",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAmount26",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtParticular27",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAgency27",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtNumber27",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtDate27",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtAmount27",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtPg2TIN1",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtPg2TIN2",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtPg2TIN3",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtPg2BranchCode",
    "fallback": ""
  },
  {
    "id": "frm1603Q:txtPg2TaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1603Q:Sched1:txtATC1",
    "fallback": "WF360"
  },
  {
    "id": "frm1603Q:Sched1:txtValue1",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:Sched1:txtATC2",
    "fallback": "WF330"
  },
  {
    "id": "frm1603Q:Sched1:txtValue2",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:Sched1:txtDivisor1",
    "fallback": ""
  },
  {
    "id": "frm1603Q:Sched1:txtTaxBase1",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:Sched1:txtTaxRate1",
    "fallback": ""
  },
  {
    "id": "frm1603Q:Sched1:txtTaxWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:Sched1:txtDivisor2",
    "fallback": ""
  },
  {
    "id": "frm1603Q:Sched1:txtTaxBase2",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:Sched1:txtTaxRate2",
    "fallback": ""
  },
  {
    "id": "frm1603Q:Sched1:txtTaxWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1603Q:Sched1:txtTotalTax",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1603Qv2018", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1603Qv2018"
  aria-label="BIR Form 1603Qv2018 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1603qv2018-1"
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
                class="wh-inline-5b58462227a5 wh-eq-header"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-e797b9c9ddc0">
                      <span class="wh-inline-429482632af7">BIR Form No.</span>
                      <br /><span class="wh-inline-aec978eca301">1603Q</span>
                      <br /><span class="wh-inline-429482632af7"
                        >January 2018 (ENCS)</span
                      >
                      <br /><span class="wh-inline-ccf4a15a8876">Page 1</span>
                    </td>
                    <td class="wh-inline-62471ef2f05a">
                      <span class="wh-inline-aec978eca301"
                        >Quarterly Remittance Return</span
                      >
                      <br /><span class="wh-inline-efa796cba67a"
                        >of Final Income Taxes Withheld on Fringe Benefits</span
                      >
                      <br /><span class="wh-inline-efa796cba67a"
                        >Paid to Employees Other Than Rank and File</span
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
                          src="/legacy/img/withholding/original-e2e443cdd698b6af.png"
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-1d72f5736894">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-68a448d3e079"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6f7ee51f83d0"
                              ><span class="wh-inline-4cf6c17959a7">
                                1
                              </span></td
                            >
                            <td colspan="3"
                              ><span class="wh-inline-cb3a2164388b"
                                >For the Year</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td class="wh-inline-05bd7d87897a">
                              <input aria-label="txtYear" class="wh-inline-9f262eec8c33" data-field-id="frm1603Q:txtYear" data-print-control="text" data-print-value="" id="frm1603Q:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1603Q:txtYear"] ?? ""}></td
                            >
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-ba2fb280cf60">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-63c2659a640d"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-995e8ec20ba3"
                              ><span class="wh-inline-3d3a68672c3c">
                                2
                              </span></td
                            >
                            <td class="wh-inline-4269a0a19e19"
                              ><span class="wh-inline-cb3a2164388b"
                                >Quarter</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td colspan="2">
                              <div class="wh-inline-69074f3d5ca3">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-91256d152acd"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-a30033456d9a">
                                        <input aria-label="optQuarter1" checked={model.checks["frm1603Q:optQuarter1"] ?? false} data-field-id="frm1603Q:optQuarter1" data-print-control="radio" disabled id="frm1603Q:optQuarter1" type="radio"/>
                                        <span class="wh-inline-9a358e750e5e"
                                          >1st</span
                                        >
                                      </td>
                                      <td class="wh-inline-a30033456d9a">
                                        <input aria-label="optQuarter2" checked={model.checks["frm1603Q:optQuarter2"] ?? false} data-field-id="frm1603Q:optQuarter2" data-print-control="radio" disabled id="frm1603Q:optQuarter2" type="radio"/>
                                        <span class="wh-inline-9a358e750e5e"
                                          >2nd</span
                                        >
                                      </td>
                                      <td class="wh-inline-a30033456d9a">
                                        <input aria-label="optQuarter3" checked={model.checks["frm1603Q:optQuarter3"] ?? false} data-field-id="frm1603Q:optQuarter3" data-print-control="radio" disabled id="frm1603Q:optQuarter3" type="radio"/>
                                        <span class="wh-inline-9a358e750e5e"
                                          >3rd</span
                                        >
                                      </td>
                                      <td class="wh-inline-a30033456d9a">
                                        <input aria-label="optQuarter4" checked={model.checks["frm1603Q:optQuarter4"] ?? false} data-field-id="frm1603Q:optQuarter4" data-print-control="radio" disabled id="frm1603Q:optQuarter4" type="radio"/>
                                        <span class="wh-inline-9a358e750e5e"
                                          >4th</span
                                        >
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-c82af1f85dea">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-9da5eda05c5c"
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
                                >Amended Return?</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <fieldset
                                class="iceSelOneRb-dis fieldText1-dis wh-inline-3276beb56669"
                                id="frm1603Q:j_id217"
                              >
                                <div class="wh-inline-5c8a2699196f">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="iceSelOneRb-dis fieldText1-dis wh-inline-5dfff06c2211"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          ><input aria-label="AmendedRtn_1" checked={model.checks["frm1603Q:AmendedRtn_1"] ?? false} data-field-id="frm1603Q:AmendedRtn_1" data-print-control="radio" disabled id="frm1603Q:AmendedRtn_1" type="radio"/><span class="wh-inline-534e2278e92c"
                                            >Yes</span
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="AmendedRtn_2" checked={model.checks["frm1603Q:AmendedRtn_2"] ?? false} data-field-id="frm1603Q:AmendedRtn_2" data-print-control="radio" disabled id="frm1603Q:AmendedRtn_2" type="radio"/><span class="wh-inline-534e2278e92c"
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
                    <td class="tblFormTd wh-inline-f4674c50c180">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-f5a531cab8e0"
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
                                >Any Taxes Withheld?</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td>
                              <fieldset
                                class="iceSelOneRb fieldText1 wh-inline-3276beb56669"
                                id="frm1603Q:j_id252"
                              >
                                <div class="wh-inline-5c8a2699196f">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="iceSelOneRb fieldText1 wh-inline-c7d7af7b2822"
                                  >
                                    <tbody>
                                      <tr>
                                        <td
                                          ><input aria-label="TaxWithheld_1" checked={model.checks["frm1603Q:TaxWithheld_1"] ?? false} data-field-id="frm1603Q:TaxWithheld_1" data-print-control="radio" disabled id="frm1603Q:TaxWithheld_1" type="radio"/><span class="wh-inline-534e2278e92c"
                                            >Yes</span
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="TaxWithheld_2" checked={model.checks["frm1603Q:TaxWithheld_2"] ?? false} data-field-id="frm1603Q:TaxWithheld_2" data-print-control="radio" disabled id="frm1603Q:TaxWithheld_2" type="radio"/><span class="wh-inline-534e2278e92c"
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
                    <td class="tblFormTd wh-inline-c82af1f85dea">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-0b40b7ad6526"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                5
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >No. of Sheet/s Attached</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td> </td>
                            <td
                              ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1603Q:txtSheets" data-print-control="text" data-print-value="" id="frm1603Q:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1603Q:txtSheets"] ?? ""}></td
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
                                <input class="wh-source-size-3" aria-label="txtTIN1" data-field-id="frm1603Q:txtTIN1" data-print-control="text" data-print-value="" id="frm1603Q:txtTIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1603Q:txtTIN1"] ?? ""}>
                                / 
                                <input class="wh-source-size-3" aria-label="txtTIN2" data-field-id="frm1603Q:txtTIN2" data-print-control="text" data-print-value="" id="frm1603Q:txtTIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1603Q:txtTIN2"] ?? ""}>
                                / 
                                <input class="wh-source-size-3" aria-label="txtTIN3" data-field-id="frm1603Q:txtTIN3" data-print-control="text" data-print-value="" id="frm1603Q:txtTIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1603Q:txtTIN3"] ?? ""}>
                                / 
                                <input class="wh-source-size-5" aria-label="txtBranchCode" data-field-id="frm1603Q:txtBranchCode" data-print-control="text" data-print-value="" id="frm1603Q:txtBranchCode" maxlength="5" readonly size="5" type="text" value={model.text["frm1603Q:txtBranchCode"] ?? ""}>
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
                                      ><input class="wh-source-size-120" aria-label="txtTaxpayerName" data-field-id="frm1603Q:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1603Q:txtTaxpayerName" maxlength="50" readonly size="120" type="text" value={model.text["frm1603Q:txtTaxpayerName"] ?? ""}></td
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
                                      ><input class="wh-source-size-120" aria-label="txtAddress" data-field-id="frm1603Q:txtAddress" data-print-control="text" data-print-value="" id="frm1603Q:txtAddress" maxlength="100" readonly size="120" type="text" value={model.text["frm1603Q:txtAddress"] ?? ""}></td
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
                              <input class="wh-source-size-85" aria-label="txtAddress2" data-field-id="frm1603Q:txtAddress2" data-print-control="text" data-print-value="" id="frm1603Q:txtAddress2" maxlength="50" readonly size="85" type="text" value={model.text["frm1603Q:txtAddress2"] ?? ""}>
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
                                <input class="wh-source-size-2" aria-label="txtZipCode" data-field-id="frm1603Q:txtZipCode" data-print-control="text" data-print-value="" id="frm1603Q:txtZipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1603Q:txtZipCode"] ?? ""}>
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
                              <input class="wh-source-size-20" aria-label="txtTelNum" data-field-id="frm1603Q:txtTelNum" data-print-control="text" data-print-value="" id="frm1603Q:txtTelNum" maxlength="20" readonly size="20" type="text" value={model.text["frm1603Q:txtTelNum"] ?? ""}>
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
                                  id="frm1603Q:j_id392"
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
                                            ><input aria-label="CatAgent_P" checked={model.checks["frm1603Q:CatAgent_P"] ?? false} data-field-id="frm1603Q:CatAgent_P" data-print-control="radio" disabled id="frm1603Q:CatAgent_P" type="radio"/><span
                                              class="wh-inline-534e2278e92c"
                                              >Private</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="CatAgent_G" checked={model.checks["frm1603Q:CatAgent_G"] ?? false} data-field-id="frm1603Q:CatAgent_G" data-print-control="radio" disabled id="frm1603Q:CatAgent_G" type="radio"/><span
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
                                  id="frm1603Q:j_id398"
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
                                            ><input aria-label="SpecialTax_1" checked={model.checks["frm1603Q:SpecialTax_1"] ?? false} data-field-id="frm1603Q:SpecialTax_1" data-print-control="radio" disabled id="frm1603Q:SpecialTax_1" type="radio"/><span
                                              class="wh-inline-534e2278e92c"
                                              >Yes</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="SpecialTax_2" checked={model.checks["frm1603Q:SpecialTax_2"] ?? false} data-field-id="frm1603Q:SpecialTax_2" data-print-control="radio" disabled id="frm1603Q:SpecialTax_2" type="radio"/><span
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
                                id="frm1603Q:j_id401">If yes, specify</span
                              >
                              <span aria-label="selTreaty" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1603Q:selTreaty" data-print-control="select" id="frm1603Q:selTreaty">{model.text["frm1603Q:selTreaty"] ?? ""}</span>
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
                              </span><span class="wh-inline-6d319e71fe1f"
                                ><span class="wh-inline-97f71f169000"
                                  >Total Taxes Withheld <a
                                    class="xsmallItalic"
                                    id="btnNavigatePage2_1"
                                    >(From Part IV-Schedule 1)
                                  </a></span
                                ></span
                              ></td
                            >
                            <td class="wh-inline-7993ddde12b1">
                              <div class="spacePadder"></div>
                            </td>
                            <td class="wh-inline-a963f7da22b0">
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">14</span>
                                <input aria-label="txtTax14" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1603Q:txtTax14" data-print-control="text" data-print-value="" id="frm1603Q:txtTax14" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax14"] ?? ""}>
                              </span>
                            </td>
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
                                >Less: Tax Remitted in Return Previously Filed,
                                if this is an amended return
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">15</span>
                                <input aria-label="txtTax15" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1603Q:txtTax15" data-print-control="text" data-print-value="" id="frm1603Q:txtTax15" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax15"] ?? ""}>
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
                                >Other Remittances Made (specify)
                              </span>
                              <input class="wh-source-size-20" aria-label="txt16Other" data-field-id="frm1603Q:txt16Other" data-print-control="text" data-print-value="" id="frm1603Q:txt16Other" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txt16Other"] ?? ""}>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">16</span>
                                <input aria-label="txtTax16" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1603Q:txtTax16" data-print-control="text" data-print-value="" id="frm1603Q:txtTax16" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax16"] ?? ""}>
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
                                >Total Remittances Made (Sum of Items 15 and 16)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">17</span>
                                <input aria-label="txtTax17" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1603Q:txtTax17" data-print-control="text" data-print-value="" id="frm1603Q:txtTax17" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax17"] ?? ""}>
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
                              </span><span class="wh-inline-abbd0a6c6086"
                                >Tax Still Due</span
                              ><span class="wh-inline-97f71f169000"
                                >/(Over-remittance) (Item 14 Less Item 17)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">18</span>
                                <input aria-label="txtTax18" class="wh-inline-32c8d87b98f8 wh-source-size-20" data-field-id="frm1603Q:txtTax18" data-print-control="text" data-print-value="" id="frm1603Q:txtTax18" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax18"] ?? ""}>
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
                                        19
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
                                <span class="wh-inline-4cf6c17959a7">19</span>
                                <input aria-label="txtTax19" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1603Q:txtTax19" data-print-control="text" data-print-value="" id="frm1603Q:txtTax19" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax19"] ?? ""}>
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
                                        20
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
                                <span class="wh-inline-4cf6c17959a7">20</span>
                                <input aria-label="txtTax20" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1603Q:txtTax20" data-print-control="text" data-print-value="" id="frm1603Q:txtTax20" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax20"] ?? ""}>
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
                                        21
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
                                <span class="wh-inline-4cf6c17959a7">21</span>
                                <input aria-label="txtTax21" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1603Q:txtTax21" data-print-control="text" data-print-value="" id="frm1603Q:txtTax21" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax21"] ?? ""}>
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
                                        22
                                      </span><span
                                        class="wh-inline-97f71f169000"
                                        >Total Penalties (Sum of Items 19 to 21)</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">22</span>
                                <input aria-label="txtTax22" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1603Q:txtTax22" data-print-control="text" data-print-value="" id="frm1603Q:txtTax22" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax22"] ?? ""}>
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
                              </span><span class="wh-inline-abbd0a6c6086"
                                >TOTAL AMOUNT STILL DUE
                              </span><span class="wh-inline-97f71f169000">
                                (Sum of Items 18 and 22)
                              </span>
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td
                              ><span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">23</span>
                                <input aria-label="txtTax23" class="wh-inline-32c8d87b98f8 wh-source-size-20" data-field-id="frm1603Q:txtTax23" data-print-control="text" data-print-value="" id="frm1603Q:txtTax23" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:txtTax23"] ?? ""}>
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
                                24
                              </span><span class="wh-inline-cb3a2164388b"
                                >Cash/Bank Debit Memo
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency24" data-field-id="frm1603Q:txtAgency24" data-print-control="text" data-print-value="" id="frm1603Q:txtAgency24" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtAgency24"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber24" data-field-id="frm1603Q:txtNumber24" data-print-control="text" data-print-value="" id="frm1603Q:txtNumber24" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtNumber24"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate24" data-field-id="frm1603Q:txtDate24" data-print-control="text" data-print-value="" id="frm1603Q:txtDate24" maxlength="10" readonly size="20" type="text" value={model.text["frm1603Q:txtDate24"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount24" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1603Q:txtAmount24" data-print-control="text" data-print-value="" id="frm1603Q:txtAmount24" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtAmount24"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                25
                              </span><span class="wh-inline-cb3a2164388b"
                                >Check
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency25" data-field-id="frm1603Q:txtAgency25" data-print-control="text" data-print-value="" id="frm1603Q:txtAgency25" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtAgency25"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber25" data-field-id="frm1603Q:txtNumber25" data-print-control="text" data-print-value="" id="frm1603Q:txtNumber25" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtNumber25"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate25" data-field-id="frm1603Q:txtDate25" data-print-control="text" data-print-value="" id="frm1603Q:txtDate25" maxlength="10" readonly size="20" type="text" value={model.text["frm1603Q:txtDate25"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount25" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1603Q:txtAmount25" data-print-control="text" data-print-value="" id="frm1603Q:txtAmount25" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtAmount25"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td colspan="2"
                              ><span class="wh-inline-4cf6c17959a7">
                                26
                              </span><span class="wh-inline-cb3a2164388b"
                                >Tax Debit Memo
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber26" data-field-id="frm1603Q:txtNumber26" data-print-control="text" data-print-value="" id="frm1603Q:txtNumber26" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtNumber26"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate26" data-field-id="frm1603Q:txtDate26" data-print-control="text" data-print-value="" id="frm1603Q:txtDate26" maxlength="10" readonly size="20" type="text" value={model.text["frm1603Q:txtDate26"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount26" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1603Q:txtAmount26" data-print-control="text" data-print-value="" id="frm1603Q:txtAmount26" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtAmount26"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td colspan="5"
                              ><span class="wh-inline-4cf6c17959a7">
                                27
                              </span><span class="wh-inline-cb3a2164388b"
                                >Others (specify below)
                              </span></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><input class="wh-source-size-20" aria-label="txtParticular27" data-field-id="frm1603Q:txtParticular27" data-print-control="text" data-print-value="" id="frm1603Q:txtParticular27" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtParticular27"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency27" data-field-id="frm1603Q:txtAgency27" data-print-control="text" data-print-value="" id="frm1603Q:txtAgency27" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtAgency27"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber27" data-field-id="frm1603Q:txtNumber27" data-print-control="text" data-print-value="" id="frm1603Q:txtNumber27" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtNumber27"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate27" data-field-id="frm1603Q:txtDate27" data-print-control="text" data-print-value="" id="frm1603Q:txtDate27" maxlength="10" readonly size="20" type="text" value={model.text["frm1603Q:txtDate27"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount27" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1603Q:txtAmount27" data-print-control="text" data-print-value="" id="frm1603Q:txtAmount27" maxlength="50" readonly size="20" type="text" value={model.text["frm1603Q:txtAmount27"] ?? ""}></td
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
        </tbody>
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1603qv2018-2"
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
                class="wh-inline-5b58462227a5 wh-eq-header"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-e797b9c9ddc0">
                      <span class="wh-inline-429482632af7">BIR Form No.</span>
                      <br /><span class="wh-inline-aec978eca301">1603Q</span>
                      <br /><span class="wh-inline-429482632af7"
                        >January 2018 (ENCS)</span
                      >
                      <br /><span class="wh-inline-ccf4a15a8876">Page 2</span>
                      <br /><br /></td
                    >
                    <td class="wh-inline-62471ef2f05a">
                      <span class="wh-inline-aec978eca301"
                        >Quarterly Remittance Return</span
                      >
                      <br /><span class="wh-inline-efa796cba67a"
                        >of Final Income Taxes Withheld on Fringe Benefits</span
                      >
                      <br /><span class="wh-inline-efa796cba67a"
                        >Paid to Employees Other Than Rank and File</span
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
                          src="/legacy/img/withholding/original-bd12294a96ae23a8.png"
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
                        >Withholding Agent's Name (Last Name for Individual OR
                        Registered Name for Non-Individual)</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>
                      <span class="wh-inline-649b1ec8a1ed">
                        <input class="wh-source-size-3" aria-label="txtPg2TIN1" data-field-id="frm1603Q:txtPg2TIN1" data-print-control="text" data-print-value="" id="frm1603Q:txtPg2TIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1603Q:txtPg2TIN1"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN2" data-field-id="frm1603Q:txtPg2TIN2" data-print-control="text" data-print-value="" id="frm1603Q:txtPg2TIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1603Q:txtPg2TIN2"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN3" data-field-id="frm1603Q:txtPg2TIN3" data-print-control="text" data-print-value="" id="frm1603Q:txtPg2TIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1603Q:txtPg2TIN3"] ?? ""}>
                        <input class="wh-source-size-5" aria-label="txtPg2BranchCode" data-field-id="frm1603Q:txtPg2BranchCode" data-print-control="text" data-print-value="" id="frm1603Q:txtPg2BranchCode" maxlength="5" readonly size="5" type="text" value={model.text["frm1603Q:txtPg2BranchCode"] ?? ""}>
                      </span>
                    </td>
                    <td
                      ><input class="wh-source-size-80" aria-label="txtPg2TaxpayerName" data-field-id="frm1603Q:txtPg2TaxpayerName" data-print-control="text" data-print-value="" id="frm1603Q:txtPg2TaxpayerName" maxlength="50" readonly size="80" type="text" value={model.text["frm1603Q:txtPg2TaxpayerName"] ?? ""}></td
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
                                  >PART IV - DETAILS OF TAXES WITHHELD
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
                  class="wh-inline-cb3a2164388b">- Computation of Tax</span
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
                    <th class="wh-inline-9d2e9fe2a9b5" colspan="2"
                      ><span class="wh-inline-97f71f169000"
                        >Recipients <br /> (A)
                      </span></th
                    >
                    <th class="wh-inline-e4007bd969ef"
                      ><span class="wh-inline-97f71f169000">ATC <br /> (B)</span
                      ></th
                    >
                    <th class="wh-inline-52ecddfa9be2"
                      ><span class="wh-inline-97f71f169000"
                        >Monetary Value of Fringe Benefit <br /> (C)</span
                      ></th
                    >
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="wh-inline-120fd5b3ccda"
                      ><span class="wh-inline-e197192ea999"> 1 </span></td
                    >
                    <td
                      ><span class="wh-inline-97f71f169000"
                        >In General, for Citizen, Resident Alien and
                        Non-Resident Alien Engaged in Trade or Business Within
                        the Philippines
                      </span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtATC1" class="iceInpTxt-dis disabled-dis wh-source-size-5" data-field-id="frm1603Q:Sched1:txtATC1" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtATC1" maxlength="20" readonly size="5" type="text" value={model.text["frm1603Q:Sched1:txtATC1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtValue1" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1603Q:Sched1:txtValue1" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtValue1" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:Sched1:txtValue1"] ?? ""}></td
                    >
                  </tr>
                  <tr>
                    <td><span class="wh-inline-e197192ea999"> 2 </span></td>
                    <td
                      ><span class="wh-inline-97f71f169000"
                        >Non-Resident Alien Not Engaged in Trade or Business
                        Within the Philippines
                      </span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtATC2" class="iceInpTxt-dis disabled-dis wh-source-size-5" data-field-id="frm1603Q:Sched1:txtATC2" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtATC2" maxlength="20" readonly size="5" type="text" value={model.text["frm1603Q:Sched1:txtATC2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtValue2" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1603Q:Sched1:txtValue2" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtValue2" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:Sched1:txtValue2"] ?? ""}></td
                    >
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
                  >(continuation)
                </span>
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
                    <th class="wh-inline-364f5ebb7c9d" colspan="2"
                      ><span class="wh-inline-97f71f169000"
                        >Percentage Divisor <br /> (D)
                      </span></th
                    >
                    <th class="wh-inline-279f5d2e7f15"
                      ><span class="wh-inline-97f71f169000"
                        >Tax Base Grossed-up Monetary Value <br /> (E)
                      </span></th
                    >
                    <th class="wh-inline-7b6943ad525c"
                      ><span class="wh-inline-97f71f169000"
                        >Tax Rate <br /> (F)</span
                      ></th
                    >
                    <th class="wh-inline-52ecddfa9be2"
                      ><span class="wh-inline-97f71f169000"
                        >Taxes Withheld <br /> (G) = (E x F)</span
                      ></th
                    >
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="wh-inline-120fd5b3ccda"
                      ><span class="wh-inline-e197192ea999"> 1</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtDivisor1" class="iceInpTxt-dis disabled-dis wh-inline-386bb5d6139a wh-source-size-5" data-field-id="frm1603Q:Sched1:txtDivisor1" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtDivisor1" maxlength="20" readonly size="5" type="text" value={model.text["frm1603Q:Sched1:txtDivisor1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxBase1" class="iceInpTxt-dis disabled-dis wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1603Q:Sched1:txtTaxBase1" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtTaxBase1" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:Sched1:txtTaxBase1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxRate1" class="iceInpTxt-dis disabled-dis wh-inline-386bb5d6139a wh-source-size-5" data-field-id="frm1603Q:Sched1:txtTaxRate1" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtTaxRate1" maxlength="20" readonly size="5" type="text" value={model.text["frm1603Q:Sched1:txtTaxRate1"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxWithheld1" class="wh-inline-812e4c336b04 wh-source-size-20" data-field-id="frm1603Q:Sched1:txtTaxWithheld1" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtTaxWithheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:Sched1:txtTaxWithheld1"] ?? ""}></td
                    >
                  </tr>
                  <tr>
                    <td><span class="wh-inline-e197192ea999"> 2</span></td>
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtDivisor2" class="iceInpTxt-dis disabled-dis wh-inline-386bb5d6139a wh-source-size-5" data-field-id="frm1603Q:Sched1:txtDivisor2" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtDivisor2" maxlength="20" readonly size="5" type="text" value={model.text["frm1603Q:Sched1:txtDivisor2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxBase2" class="iceInpTxt-dis disabled-dis wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1603Q:Sched1:txtTaxBase2" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtTaxBase2" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:Sched1:txtTaxBase2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxRate2" class="iceInpTxt-dis disabled-dis wh-inline-386bb5d6139a wh-source-size-5" data-field-id="frm1603Q:Sched1:txtTaxRate2" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtTaxRate2" maxlength="20" readonly size="5" type="text" value={model.text["frm1603Q:Sched1:txtTaxRate2"] ?? ""}></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTaxWithheld2" class="wh-inline-812e4c336b04 wh-source-size-20" data-field-id="frm1603Q:Sched1:txtTaxWithheld2" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtTaxWithheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:Sched1:txtTaxWithheld2"] ?? ""}></td
                    >
                  </tr>
                  <tr>
                    <td colspan="4"
                      ><span class="wh-inline-161b14a25c74">
                        3 Total Taxes Withheld
                      </span><span class="wh-inline-97f71f169000"
                        >(Sum of Items 1 and 2) <a
                          class="xsmallItalic"
                          id="btnNavigatePage1_1"
                          >(To Part II, Item 14)
                        </a>
                      </span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><input aria-label="txtTotalTax" class="wh-inline-812e4c336b04 wh-source-size-20" data-field-id="frm1603Q:Sched1:txtTotalTax" data-print-control="text" data-print-value="" id="frm1603Q:Sched1:txtTotalTax" maxlength="25" readonly size="20" type="text" value={model.text["frm1603Q:Sched1:txtTotalTax"] ?? ""}></td
                    >
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <div class="smallSubtitle wh-inline-a30033456d9a">
                Guidelines and Instructions for BIR Form No. 1603Q [January
                2018(ENCS)]
              </div>
              <div class="smallSubtitle wh-inline-a30033456d9a">
                Quarterly Remittance Return of Final Income Taxes Withheld
              </div>
              <div class="smallSubtitle wh-inline-a30033456d9a">
                on Fringe Benefits Paid to Employees Other Than Rank and File
              </div>
              <br />
              <table class="wh-inline-5b58462227a5" id="inserted">
                <tbody
                  ><tr>
                    <td class="firstcol">
                      <div class="wh-inline-2ea46c1db204">Who Shall File</div>
                      <p class="wh-inline-73783a20c465">
                        This quarterly withholding tax remittance return shall
                        be filed in triplicate by every withholding agent
                        (WA)/payor required to deduct and withhold taxes on
                        fringe benefits furnished or granted to employees other
                        than rank and file employees subject to Final
                        Withholding Taxes.
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
                        return to pay/remit the final taxes withheld.
                      </p>
                      <div class="wh-inline-2ea46c1db204">
                        When and Where to File and Pay/Remit
                      </div>
                      <p class="wh-inline-73783a20c465">
                        The quarterly withholding tax remittance return shall be
                        filed and the tax paid/remitted not later than the last
                        day of the month following the close of the quarter
                        during which withholding was made.
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
                      <div class="wh-inline-2ea46c1db204">
                        Fringe Benefit Defined
                      </div>
                      <p class="wh-inline-73783a20c465">
                        Fringe Benefit means any good, service or other benefit
                        furnished or granted by an employer in cash or in kind,
                        in addition to basic salaries to employees (except rank
                        and file employees) such as, but not limited to the
                        following:
                      </p>
                      <table class="wh-inline-c8eaeb601339">
                        <tbody
                          ><tr>
                            <td>
                              <ol class="indent">
                                <li class="wh-inline-73783a20c465">Housing;</li>
                                <li class="wh-inline-73783a20c465">
                                  Expense Account;
                                </li>
                                <li class="wh-inline-73783a20c465">
                                  Vehicle of any kind;
                                </li>
                                <li class="wh-inline-73783a20c465">
                                  Household personnel, such as maid, driver and
                                  others;
                                </li>
                                <li class="wh-inline-73783a20c465">
                                  Interest on loan at less than market rate to
                                  the extent of the difference between the
                                  market rate and actual rate granted;
                                </li>
                                <li class="wh-inline-73783a20c465">
                                  Expenses for foreign travel;
                                </li>
                                <li class="wh-inline-73783a20c465">
                                  Holiday and vacation expenses;
                                </li>
                              </ol>
                            </td>
                            <td>
                              <ol class="indent">
                                <li class="wh-inline-73783a20c465">
                                  Membership fees, dues and others expense borne
                                  by the employer for the employees in social
                                  and athletic clubs or other similar
                                  organizations;
                                </li>
                                <li class="wh-inline-73783a20c465">
                                  Educational assistance to the employee or his
                                  dependents; and
                                </li>
                                <li class="wh-inline-73783a20c465">
                                  Life or health insurance and other non-life
                                  insurance premiums or similar amounts in
                                  excess of what the law allows.
                                </li>
                              </ol>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="wh-inline-2ea46c1db204">ATC and Tax Rate</div>
                      <p class="wh-inline-73783a20c465">
                        The fringe benefit tax shall be imposed at the following
                        rates:
                      </p>
                      <table class="wh-inline-c8eaeb601339">
                        <thead>
                          <tr>
                            <th>ATC</th>
                            <th>Recipient</th>
                            <th>Tax Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="wh-inline-73783a20c465">WF360</td>
                            <td class="wh-inline-73783a20c465"
                              >In General, for Citizen, Resident Alien and
                              Non-Resident Alien Engaged in Trade or Business
                              Within the Philippines</td
                            >
                            <td class="wh-inline-73783a20c465">35%</td>
                          </tr>
                          <tr>
                            <td class="wh-inline-73783a20c465">WF330</td>
                            <td class="wh-inline-73783a20c465"
                              >Non-Resident Alien Not Engaged in Trade or
                              Business Within the Phils.</td
                            >
                            <td class="wh-inline-73783a20c465">25%</td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="wh-inline-2ea46c1db204">
                        Computation of Tax
                      </div>
                      <p class="wh-inline-73783a20c465">
                        The final withholding tax on fringe benefit shall be
                        computed based on the taxable grossed-up monetary value
                        multiplied by the applicable tax rate. The grossed-up
                        monetary value of the fringe benefit shall be determined
                        by dividing the monetary value of the fringe benefit as
                        provided in Revenue Regulations No. 3-98, as amended, by
                        the percentage divisor in accordance with the following
                        schedule:
                      </p>
                      <table class="wh-inline-c8eaeb601339">
                        <thead>
                          <tr>
                            <th>Recipient</th>
                            <th>Tax Rate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="wh-inline-73783a20c465"
                              >In General, for Citizen, Resident Alien and
                              Non-Resident Alien Engaged in Trade or Business
                              Within the Philippines</td
                            >
                            <td class="wh-inline-73783a20c465">65%</td>
                          </tr>
                          <tr>
                            <td class="wh-inline-73783a20c465"
                              >Non-Resident Alien Not Engaged in Trade or
                              Business Within the Philippines</td
                            >
                            <td class="wh-inline-73783a20c465">75%</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="secondcol">
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
                            Failure to file any return and pay/remit the amount
                            of tax or installment due on or before the due date;
                          </li>
                          <li class="wh-inline-73783a20c465">
                            Filing a return with a person or office other than
                            those with whom it is required to be filed, unless
                            otherwise authorized by the Commissioner;
                          </li>
                          <li class="wh-inline-73783a20c465">
                            Failure to pay/remit the full or part of the amount
                            of tax shown on the return, or the full amount of
                            tax due for which no return is required to be filed
                            on or before the due date;
                          </li>
                          <li class="wh-inline-73783a20c465">
                            Failure to pay/remit the deficiency tax within the
                            time prescribed for its payment/remittance in the
                            notice of assessment.
                          </li>
                        </ol>
                        <li class="wh-inline-73783a20c465">
                          A surcharge of fifty percent (50%) of the tax or of
                          the deficiency tax, in case any payment/remittance has
                          been made before the discovery of the falsity or
                          fraud, for each of the following violations:
                        </li>
                      </ol>
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
                          ng Pilipinas from the date prescribed for
                          payment/remittance until the amount is fully
                          paid/remitted: Provided, That in no case shall the
                          deficiency and the delinquency interest prescribed
                          under Section 249 Subsections (B) and (C) of the
                          National Internal Revenue Code, as amended, be imposed
                          simultaneously.
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
                      <br /></td
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
        <h2>BIR Form 1603Qv2018 — {continuation.title}</h2>
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
