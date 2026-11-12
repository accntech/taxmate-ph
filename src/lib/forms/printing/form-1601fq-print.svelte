<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1601FQ:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:OptQuarter1",
    "source": "frm1601FQ:OptQuarter",
    "choice": "1",
    "checked": false
  },
  {
    "id": "frm1601FQ:OptQuarter2",
    "source": "frm1601FQ:OptQuarter",
    "choice": "2",
    "checked": false
  },
  {
    "id": "frm1601FQ:OptQuarter3",
    "source": "frm1601FQ:OptQuarter",
    "choice": "3",
    "checked": false
  },
  {
    "id": "frm1601FQ:OptQuarter4",
    "source": "frm1601FQ:OptQuarter",
    "choice": "4",
    "checked": false
  },
  {
    "id": "frm1601FQ:AmendedRtn_1",
    "source": "frm1601FQ:AmendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601FQ:AmendedRtn_2",
    "source": "frm1601FQ:AmendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601FQ:TaxWithheld_1",
    "source": "frm1601FQ:TaxWithheld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601FQ:TaxWithheld_2",
    "source": "frm1601FQ:TaxWithheld",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1601FQ:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1601FQ:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1601FQ:txtRDOCode"
  },
  {
    "id": "frm1601FQ:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAddress2",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:CatAgent_P",
    "source": "frm1601FQ:CatAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1601FQ:CatAgent_G",
    "source": "frm1601FQ:CatAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "txtEmail",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:SpecialTax_1",
    "source": "frm1601FQ:SpecialTax",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601FQ:SpecialTax_2",
    "source": "frm1601FQ:SpecialTax",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601FQ:drpSpecialTax",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty",
      "3": "Both"
    }
  },
  {
    "id": "frm1601FQ:txtTotalOtherTax",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtTax20",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax21",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax22",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax23",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax24",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax25",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax26",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax27",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax28",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax29",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax30",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax31",
    "fallback": "0.00"
  },
  {
    "id": "frm1601FQ:txtTax32",
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
    "id": "frm1601FQ:txtAgency33",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtNumber33",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtDate33",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAmount33",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAgency34",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtNumber34",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtDate34",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAmount34",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAgency35",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtNumber35",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtDate35",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAmount35",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtParticular36",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAgency36",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtNumber36",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtDate36",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtAmount36",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtPg2TIN1",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtPg2TIN2",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtPg2TIN3",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtPg2BranchCode",
    "fallback": ""
  },
  {
    "id": "frm1601FQ:txtPg2TaxpayerName",
    "fallback": ""
  },
  {
    "id": "drpTreatyCode0",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA - Not Applicable"
    }
  },
  {
    "id": "drpATCCode0",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA"
    }
  },
  {
    "id": "txtNatIncPayment0",
    "fallback": "-"
  },
  {
    "id": "txtAmtIncomePay0",
    "fallback": "0.00"
  },
  {
    "id": "txtRate0",
    "fallback": "0.00"
  },
  {
    "id": "txtReqWithheld0",
    "fallback": "0.00"
  },
  {
    "id": "drpTreatyCode1",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA - Not Applicable"
    }
  },
  {
    "id": "drpATCCode1",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA"
    }
  },
  {
    "id": "txtNatIncPayment1",
    "fallback": "-"
  },
  {
    "id": "txtAmtIncomePay1",
    "fallback": "0.00"
  },
  {
    "id": "txtRate1",
    "fallback": "0.00"
  },
  {
    "id": "txtReqWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "drpTreatyCode2",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA - Not Applicable"
    }
  },
  {
    "id": "drpATCCode2",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA"
    }
  },
  {
    "id": "txtNatIncPayment2",
    "fallback": "-"
  },
  {
    "id": "txtAmtIncomePay2",
    "fallback": "0.00"
  },
  {
    "id": "txtRate2",
    "fallback": "0.00"
  },
  {
    "id": "txtReqWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "drpTreatyCode3",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA - Not Applicable"
    }
  },
  {
    "id": "drpATCCode3",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA"
    }
  },
  {
    "id": "txtNatIncPayment3",
    "fallback": "-"
  },
  {
    "id": "txtAmtIncomePay3",
    "fallback": "0.00"
  },
  {
    "id": "txtRate3",
    "fallback": "0.00"
  },
  {
    "id": "txtReqWithheld3",
    "fallback": "0.00"
  },
  {
    "id": "drpTreatyCode4",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA - Not Applicable"
    }
  },
  {
    "id": "drpATCCode4",
    "fallback": "",
    "options": {
      "-": "-",
      "NA": "NA"
    }
  },
  {
    "id": "txtNatIncPayment4",
    "fallback": "-"
  },
  {
    "id": "txtAmtIncomePay4",
    "fallback": "0.00"
  },
  {
    "id": "txtRate4",
    "fallback": "0.00"
  },
  {
    "id": "txtReqWithheld4",
    "fallback": "0.00"
  },
  {
    "id": "txtDvTotalSchedI",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1601FQ", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1601FQ"
  aria-label="BIR Form 1601FQ print preview"
>
  <div
    class="withholding-print-page-content wh-page-1601fq-1"
    data-source-page="1"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page1Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-f6011ec5724f"
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
                      <br /><span class="wh-inline-aec978eca301">1601-FQ</span>
                      <br /><span class="wh-inline-429482632af7"
                        >January 2018</span
                      >
                      <br /><span class="wh-inline-ccf4a15a8876">Page 1</span>
                    </td>
                    <td class="wh-inline-62471ef2f05a">
                      <span class="wh-inline-aec978eca301"
                        >Quarterly Remittance Return</span
                      >
                      <br /><span class="wh-inline-1b29e9eb50ae"
                        >of Final Income Taxes Withheld</span
                      >
                      <br /><span class="wh-inline-429482632af7"
                        >Enter all required information in CAPITAL LETTERS using
                        BLACK ink. Mark all applicable boxes with an "X". Two
                        copies MUST be filed with the BIR and one held by the
                        Taxpayer.</span
                      >
                    </td>
                    <td class="wh-inline-bef36932d3a7">
                      <p>
                        <img
                          alt="BIR form identifying mark"
                          class="wh-inline-5dfba9815e30"
                          height="75px"
                          src="/legacy/img/withholding/original-2def78adfb729a7b.png"
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
                              <input aria-label="txtYear" class="wh-inline-9f262eec8c33" data-field-id="frm1601FQ:txtYear" data-print-control="text" data-print-value="" id="frm1601FQ:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1601FQ:txtYear"] ?? ""}></td
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
                                        <input aria-label="OptQuarter1" checked={model.checks["frm1601FQ:OptQuarter1"] ?? false} data-field-id="frm1601FQ:OptQuarter1" data-print-control="radio" disabled id="frm1601FQ:OptQuarter1" type="radio"/>
                                        <span class="wh-inline-9a358e750e5e"
                                          >1st</span
                                        >
                                      </td>
                                      <td class="wh-inline-a30033456d9a">
                                        <input aria-label="OptQuarter2" checked={model.checks["frm1601FQ:OptQuarter2"] ?? false} data-field-id="frm1601FQ:OptQuarter2" data-print-control="radio" disabled id="frm1601FQ:OptQuarter2" type="radio"/>
                                        <span class="wh-inline-9a358e750e5e"
                                          >2nd</span
                                        >
                                      </td>
                                      <td class="wh-inline-a30033456d9a">
                                        <input aria-label="OptQuarter3" checked={model.checks["frm1601FQ:OptQuarter3"] ?? false} data-field-id="frm1601FQ:OptQuarter3" data-print-control="radio" disabled id="frm1601FQ:OptQuarter3" type="radio"/>
                                        <span class="wh-inline-9a358e750e5e"
                                          >3rd</span
                                        >
                                      </td>
                                      <td class="wh-inline-a30033456d9a">
                                        <input aria-label="OptQuarter4" checked={model.checks["frm1601FQ:OptQuarter4"] ?? false} data-field-id="frm1601FQ:OptQuarter4" data-print-control="radio" disabled id="frm1601FQ:OptQuarter4" type="radio"/>
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
                                id="frm1601FQ:j_id217"
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
                                          ><input aria-label="AmendedRtn_1" checked={model.checks["frm1601FQ:AmendedRtn_1"] ?? false} data-field-id="frm1601FQ:AmendedRtn_1" data-print-control="radio" disabled id="frm1601FQ:AmendedRtn_1" type="radio"/><span class="wh-inline-766562615de5"
                                            >Yes</span
                                          >
                                        </td>
                                        <td
                                          ><input aria-label="AmendedRtn_2" checked={model.checks["frm1601FQ:AmendedRtn_2"] ?? false} data-field-id="frm1601FQ:AmendedRtn_2" data-print-control="radio" disabled id="frm1601FQ:AmendedRtn_2" type="radio"/><span class="wh-inline-766562615de5"
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
                                id="frm1601FQ:j_id252"
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
                                          ><input aria-label="TaxWithheld_1" checked={model.checks["frm1601FQ:TaxWithheld_1"] ?? false} data-field-id="frm1601FQ:TaxWithheld_1" data-print-control="radio" disabled id="frm1601FQ:TaxWithheld_1" type="radio"/><span class="wh-inline-766562615de5"
                                            >Yes</span
                                          >
                                        </td>
                                        <td
                                          ><input aria-label="TaxWithheld_2" checked={model.checks["frm1601FQ:TaxWithheld_2"] ?? false} data-field-id="frm1601FQ:TaxWithheld_2" data-print-control="radio" disabled id="frm1601FQ:TaxWithheld_2" type="radio"/><span class="wh-inline-766562615de5"
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
                              ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1601FQ:txtSheets" data-print-control="text" data-print-value="" id="frm1601FQ:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1601FQ:txtSheets"] ?? ""}></td
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
                    <td class="tblFormTdPart">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-bb35e3936eff"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
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
                                <input class="wh-source-size-3" aria-label="txtTIN1" data-field-id="frm1601FQ:txtTIN1" data-print-control="text" data-print-value="" id="frm1601FQ:txtTIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1601FQ:txtTIN1"] ?? ""}>
                                <input class="wh-source-size-3" aria-label="txtTIN2" data-field-id="frm1601FQ:txtTIN2" data-print-control="text" data-print-value="" id="frm1601FQ:txtTIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1601FQ:txtTIN2"] ?? ""}>
                                <input class="wh-source-size-3" aria-label="txtTIN3" data-field-id="frm1601FQ:txtTIN3" data-print-control="text" data-print-value="" id="frm1601FQ:txtTIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1601FQ:txtTIN3"] ?? ""}>
                                <input class="wh-source-size-3" aria-label="txtBranchCode" data-field-id="frm1601FQ:txtBranchCode" data-print-control="text" data-print-value="" id="frm1601FQ:txtBranchCode" maxlength="5" readonly size="3" type="text" value={model.text["frm1601FQ:txtBranchCode"] ?? ""}>
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
                                          for Individuals OR Registered Name for
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
                                      ><input class="wh-source-size-120" aria-label="txtTaxpayerName" data-field-id="frm1601FQ:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1601FQ:txtTaxpayerName" maxlength="50" readonly size="120" type="text" value={model.text["frm1601FQ:txtTaxpayerName"] ?? ""}></td
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
                                        ><b>Registered Address </b><i
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
                                      ><input class="wh-source-size-120" aria-label="txtAddress" data-field-id="frm1601FQ:txtAddress" data-print-control="text" data-print-value="" id="frm1601FQ:txtAddress" maxlength="100" readonly size="120" type="text" value={model.text["frm1601FQ:txtAddress"] ?? ""}></td
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
                              <input class="wh-source-size-85" aria-label="txtAddress2" data-field-id="frm1601FQ:txtAddress2" data-print-control="text" data-print-value="" id="frm1601FQ:txtAddress2" maxlength="50" readonly size="85" type="text" value={model.text["frm1601FQ:txtAddress2"] ?? ""}>
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
                                <input class="wh-source-size-2" aria-label="txtZipCode" data-field-id="frm1601FQ:txtZipCode" data-print-control="text" data-print-value="" id="frm1601FQ:txtZipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1601FQ:txtZipCode"] ?? ""}>
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
                            <td class="wh-inline-ca035724ca76">
                              <span class="wh-inline-4cf6c17959a7">
                                10
                              </span><span class="wh-inline-cb3a2164388b"
                                >Contact Number</span
                              ></td
                            >
                            <td>
                              <div class="wh-inline-9cb088a595d0">
                                <input class="wh-source-size-25" aria-label="txtTelNum" data-field-id="frm1601FQ:txtTelNum" data-print-control="text" data-print-value="" id="frm1601FQ:txtTelNum" maxlength="20" readonly size="25" type="text" value={model.text["frm1601FQ:txtTelNum"] ?? ""}>
                              </div>
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
                                  id="frm1601FQ:j_id392"
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
                                            ><input aria-label="CatAgent_P" checked={model.checks["frm1601FQ:CatAgent_P"] ?? false} data-field-id="frm1601FQ:CatAgent_P" data-print-control="radio" disabled id="frm1601FQ:CatAgent_P" type="radio"/><span
                                              class="wh-inline-df8bcce4c703"
                                              >Private</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="CatAgent_G" checked={model.checks["frm1601FQ:CatAgent_G"] ?? false} data-field-id="frm1601FQ:CatAgent_G" data-print-control="radio" disabled id="frm1601FQ:CatAgent_G" type="radio"/><span
                                              class="wh-inline-df8bcce4c703"
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
                                  id="frm1601FQ:j_id398"
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
                                            ><input aria-label="SpecialTax_1" checked={model.checks["frm1601FQ:SpecialTax_1"] ?? false} data-field-id="frm1601FQ:SpecialTax_1" data-print-control="radio" disabled id="frm1601FQ:SpecialTax_1" type="radio"/><span
                                              class="wh-inline-766562615de5"
                                              >Yes</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="SpecialTax_2" checked={model.checks["frm1601FQ:SpecialTax_2"] ?? false} data-field-id="frm1601FQ:SpecialTax_2" data-print-control="radio" disabled id="frm1601FQ:SpecialTax_2" type="radio"/><span
                                              class="wh-inline-766562615de5"
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
                                id="frm1601FQ:j_id401">If yes, specify</span
                              >
                              <span aria-label="drpSpecialTax" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1601FQ:drpSpecialTax" data-print-control="select" id="frm1601FQ:drpSpecialTax">{model.text["frm1601FQ:drpSpecialTax"] ?? ""}</span>
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
                    <td class="tblFormTdPart">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-da58e71a5f8a"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-f8ee3560ed06">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >Part II -Computation of Tax
                                </span><span class="wh-inline-cb3a2164388b">
                                  (attach additional sheet/s, if necessary)
                                </span>
                              </div>
                            </td>
                            <td></td>
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
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-b11c34ac1cde"
                        id="tblPartIIComputeTax"
                      >
                        <thead>
                          <tr>
                            <td class="wh-inline-4b1a3a45f831"> </td>
                            <td class="wh-inline-be93aa044c2c"
                              ><div class="wh-inline-a30033456d9a">
                                <a id="btnAddATCPartII">ATC </a>
                              </div></td
                            >
                            <td class="wh-inline-228a2614ab68"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >TAX BASE</span
                                ><span class="wh-inline-cb3a2164388b"
                                  ><i> (Consolidated for the Quarter)</i></span
                                >
                              </div></td
                            >
                            <td class="wh-inline-8f448794e90d"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >TAX RATE</span
                                >
                              </div></td
                            >
                            <td class="wh-inline-42854b233a00"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-dd2eceacf41a"
                                  >TAX WITHHELD
                                </span><br /><span
                                  class="wh-inline-cb3a2164388b"
                                  ><i> (Consolidated for the Quarter)</i></span
                                ><br />
                              </div></td
                            >
                          </tr>
                        </thead>
                        <tbody id="tbodyComputeTax"
                          >{#each model.atcRows as row, index (row.id)}<tr
                              ><td>{index + 14}</td
                              >{#each row.cells as cell, cellIndex (cell.id)}<td class={{ "wh-atc-rate-cell": cellIndex === 2 }}
                                  ><input type="text" readonly aria-label={cell.id} class={["wh-inline-905008530ca9 wh-source-size-20", "wh-inline-c915a67cb4c4", "wh-inline-8ed7df1a5ff8", "wh-inline-c915a67cb4c4"][cellIndex]} size={[20, 20, 20, 20][cellIndex]} data-print-control="text" data-print-value data-field-id={cell.id} id={cell.id} value={cell.value} />{#if cellIndex === 2}<span class="wh-inline-4cf6c17959a7">&nbsp;%&nbsp;</span>{/if}</td
                                >{/each}</tr
                            >{/each}</tbody
                        >
                        <tfoot id="tfootComputeTax">
                          <tr>
                            <td colspan="5">
                              <div
                                class="wh-inline-9993df54d511"
                                id="lblOtherTax"
                              >
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-da58e71a5f8a"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-6e2d216c2146"
                                        ><span
                                          ><span class="wh-inline-dd2eceacf41a"
                                            ><a id="btnOtherTax"
                                              >Other Selected ATC</a
                                            ></span
                                          ></span
                                        ></td
                                      >
                                      <td
                                        ><input aria-label="txtTotalOtherTax" class="wh-inline-7aed302a3801" data-field-id="frm1601FQ:txtTotalOtherTax" data-print-control="text" data-print-value="" id="frm1601FQ:txtTotalOtherTax" readonly type="text" value={model.text["frm1601FQ:txtTotalOtherTax"] ?? ""}></td
                                      >
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        </tfoot>
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
                                20
                              </span></td
                            >
                            <td class="wh-inline-5fd1350a981f"
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-6d319e71fe1f"
                                ><span class="wh-inline-97f71f169000"
                                  >Taxes Withheld for the Quarter
                                </span><span class="wh-inline-97f71f169000"
                                  >based on Regular Rates (Sum of items 14 to
                                  19)</span
                                ></span
                              ></td
                            >
                            <td class="wh-inline-7993ddde12b1">
                              <div class="spacePadder"></div>
                            </td>
                            <td class="wh-inline-a963f7da22b0">
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">20</span>
                                <input aria-label="txtTax20" class="wh-inline-f0b59ed3f479 wh-source-size-20" data-field-id="frm1601FQ:txtTax20" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax20" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax20"] ?? ""}>
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
                                >Taxes Withheld for the Quarter Based on Tax
                                Treaty Rates
                              </span>
                              <a id="btnAddSchedI"
                                ><span class="wh-inline-97f71f169000"
                                  >(from Part IV - Schedule 1)</span
                                ></a
                              >
                            </td>
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">21</span>
                                <input aria-label="txtTax21" class="wh-inline-f0b59ed3f479 wh-source-size-20" data-field-id="frm1601FQ:txtTax21" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax21" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax21"] ?? ""}>
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
                              ><span class="wh-inline-6d319e71fe1f"
                                ><span class="wh-inline-97f71f169000"
                                  >Total Taxes Withheld for the Quarter (Sum of
                                  Items 20 and 21)</span
                                ></span
                              ></td
                            >
                            <td>
                              <div class="spacePadder"></div>
                            </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">22</span>
                                <input aria-label="txtTax22" class="wh-inline-f0b59ed3f479 wh-source-size-20" data-field-id="frm1601FQ:txtTax22" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax22" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax22"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                23
                              </span></td
                            >
                            <td>
                              <table class="wh-inline-d1c1fe2c92f6">
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-36fb844716a5"
                                      ><span class="wh-inline-429482632af7"
                                        >Less :
                                      </span></td
                                    >
                                    <td class="wh-inline-36fe9f8cef2e"
                                      ><span class="wh-inline-429482632af7"
                                        >Remittances Made:
                                      </span></td
                                    >
                                    <td
                                      ><span class="wh-inline-429482632af7"
                                        >1st month of the Quarter</span
                                      ></td
                                    >
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">23</span>
                                <input aria-label="txtTax23" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601FQ:txtTax23" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax23" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax23"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                24
                              </span></td
                            >
                            <td>
                              <table class="wh-inline-d1c1fe2c92f6">
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-36fb844716a5"> </td>
                                    <td class="wh-inline-36fe9f8cef2e"
                                      ><span class="wh-inline-429482632af7">
                                      </span></td
                                    >
                                    <td
                                      ><span class="wh-inline-429482632af7">
                                        2nd month of the Quarter</span
                                      ></td
                                    >
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">24</span>
                                <input aria-label="txtTax24" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601FQ:txtTax24" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax24" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax24"] ?? ""}>
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
                              </span><span class="wh-inline-429482632af7"
                                >Tax Remitted in Return Previously Filed, if
                                this is an amended return</span
                              ></td
                            >
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">25</span>
                                <input aria-label="txtTax25" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601FQ:txtTax25" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax25" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax25"] ?? ""}>
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
                              </span><span class="wh-inline-429482632af7"
                                >Total Remittances made (Sum of items 23 to 25)</span
                              ></td
                            >
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">26</span>
                                <input aria-label="txtTax26" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601FQ:txtTax26" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax26" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax26"] ?? ""}>
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
                                >Tax Still Due (Over-remittance) (Item 22 less
                                item 26)</span
                              ></td
                            >
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">27</span>
                                <input aria-label="txtTax27" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601FQ:txtTax27" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax27" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax27"] ?? ""}>
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
                                class="wh-inline-d1c1fe2c92f6"
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
                                        28
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
                                <span class="wh-inline-4cf6c17959a7">28</span>
                                <input aria-label="txtTax28" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601FQ:txtTax28" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax28" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax28"] ?? ""}>
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
                                class="wh-inline-d1c1fe2c92f6"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-a421a1e65578"> </td>
                                    <td>
                                      <span class="wh-inline-4cf6c17959a7">
                                        29
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
                                <span class="wh-inline-4cf6c17959a7">29</span>
                                <input aria-label="txtTax29" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601FQ:txtTax29" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax29" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax29"] ?? ""}>
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
                                class="wh-inline-d1c1fe2c92f6"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-a421a1e65578"> </td>
                                    <td>
                                      <span class="wh-inline-4cf6c17959a7">
                                        30
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
                                <span class="wh-inline-4cf6c17959a7">30</span>
                                <input aria-label="txtTax30" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601FQ:txtTax30" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax30" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax30"] ?? ""}>
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
                                class="wh-inline-d1c1fe2c92f6"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-a421a1e65578"> </td>
                                    <td>
                                      <span class="wh-inline-4cf6c17959a7">
                                        31
                                      </span><span
                                        class="wh-inline-97f71f169000"
                                        >Total Penalties (Sum of Items 28 to 30)</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td> </td>
                            <td>
                              <span class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">31</span>
                                <input aria-label="txtTax31" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601FQ:txtTax31" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax31" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax31"] ?? ""}>
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                32
                              </span></td
                            >
                            <td colspan="2"
                              ><span class="wh-inline-cb3a2164388b">
                              </span><span class="wh-inline-abbd0a6c6086"
                                >TOTAL AMOUNT STILL DUE</span
                              ><span class="wh-inline-429482632af7"
                                >/ (Over-remittance) (Sum of Items 27 and 31)</span
                              ></td
                            >
                            <td>
                              <div class="spacePadder">
                                <span class="wh-inline-4cf6c17959a7">32</span>
                                <input aria-label="txtTax32" class="iceInpTxt-dis wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601FQ:txtTax32" data-print-control="text" data-print-value="" id="frm1601FQ:txtTax32" maxlength="25" readonly size="20" type="text" value={model.text["frm1601FQ:txtTax32"] ?? ""}>
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
                      I/We declare, under the penalties of perjury that this
                      remittance return, and all its attachments, have been made
                      in good faith, verified by me/us, and to the best of
                      my/our knowledge and belief, is true and correct, pursuant
                      to the provisions of the National Internal Revenue Code,
                      as amended, and the regulations issued under authority
                      thereof. Further, I/we give my/our consent to the
                      processing of my/our information as contemplated under the
                      *Data Privacy Act of 2012 (R.A. No. 10173) for legitimate
                      and lawful purposes. <i
                        >(If Authorized Representative, attach authorization
                        letter)</i
                      ><br /></td
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
                      Authorized Officer or Representative/Tax Agent (Indicate Title/Designation
                      and TIN)</td
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
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-e81baf8dca25"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >Part III -Details of Payment</span
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
                                33
                              </span><span class="wh-inline-cb3a2164388b"
                                >Cash/Bank Debit Memo
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency33" data-field-id="frm1601FQ:txtAgency33" data-print-control="text" data-print-value="" id="frm1601FQ:txtAgency33" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAgency33"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber33" data-field-id="frm1601FQ:txtNumber33" data-print-control="text" data-print-value="" id="frm1601FQ:txtNumber33" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtNumber33"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate33" data-field-id="frm1601FQ:txtDate33" data-print-control="text" data-print-value="" id="frm1601FQ:txtDate33" maxlength="10" readonly size="20" type="text" value={model.text["frm1601FQ:txtDate33"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount33" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601FQ:txtAmount33" data-print-control="text" data-print-value="" id="frm1601FQ:txtAmount33" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAmount33"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                34
                              </span><span class="wh-inline-cb3a2164388b"
                                >Check
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency34" data-field-id="frm1601FQ:txtAgency34" data-print-control="text" data-print-value="" id="frm1601FQ:txtAgency34" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAgency34"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber34" data-field-id="frm1601FQ:txtNumber34" data-print-control="text" data-print-value="" id="frm1601FQ:txtNumber34" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtNumber34"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate34" data-field-id="frm1601FQ:txtDate34" data-print-control="text" data-print-value="" id="frm1601FQ:txtDate34" maxlength="10" readonly size="20" type="text" value={model.text["frm1601FQ:txtDate34"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount34" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601FQ:txtAmount34" data-print-control="text" data-print-value="" id="frm1601FQ:txtAmount34" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAmount34"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><span class="wh-inline-4cf6c17959a7">
                                35
                              </span><span class="wh-inline-cb3a2164388b"
                                >Tax Debit Memo
                              </span></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency35" data-field-id="frm1601FQ:txtAgency35" data-print-control="text" data-print-value="" id="frm1601FQ:txtAgency35" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAgency35"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber35" data-field-id="frm1601FQ:txtNumber35" data-print-control="text" data-print-value="" id="frm1601FQ:txtNumber35" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtNumber35"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate35" data-field-id="frm1601FQ:txtDate35" data-print-control="text" data-print-value="" id="frm1601FQ:txtDate35" maxlength="10" readonly size="20" type="text" value={model.text["frm1601FQ:txtDate35"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount35" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601FQ:txtAmount35" data-print-control="text" data-print-value="" id="frm1601FQ:txtAmount35" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAmount35"] ?? ""}></td
                            >
                          </tr>
                          <tr>
                            <td colspan="5"
                              ><span class="wh-inline-4cf6c17959a7">
                                36
                              </span><span class="wh-inline-cb3a2164388b"
                                >Others (specify below)
                              </span></td
                            >
                          </tr>
                          <tr>
                            <td
                              ><input class="wh-source-size-20" aria-label="txtParticular36" data-field-id="frm1601FQ:txtParticular36" data-print-control="text" data-print-value="" id="frm1601FQ:txtParticular36" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtParticular36"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtAgency36" data-field-id="frm1601FQ:txtAgency36" data-print-control="text" data-print-value="" id="frm1601FQ:txtAgency36" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAgency36"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtNumber36" data-field-id="frm1601FQ:txtNumber36" data-print-control="text" data-print-value="" id="frm1601FQ:txtNumber36" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtNumber36"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input class="wh-source-size-20" aria-label="txtDate36" data-field-id="frm1601FQ:txtDate36" data-print-control="text" data-print-value="" id="frm1601FQ:txtDate36" maxlength="10" readonly size="20" type="text" value={model.text["frm1601FQ:txtDate36"] ?? ""}></td
                            >
                            <td class="wh-inline-a30033456d9a"
                              ><input aria-label="txtAmount36" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1601FQ:txtAmount36" data-print-control="text" data-print-value="" id="frm1601FQ:txtAmount36" maxlength="50" readonly size="20" type="text" value={model.text["frm1601FQ:txtAmount36"] ?? ""}></td
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
            <td class="wh-inline-e5d90b1e0737" colspan="4"
              >NOTE: *Please read the BIR Data Privacy Policy found in the BIR
              website (www.bir.gov.ph) <br /></td
            >
          </tr>
        </tbody>
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1601fq-2"
    data-source-page="2"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-d2fe8e8a7302" id="Page2Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-f6011ec5724f"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-063b72dc3584 wh-eq-header"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-e797b9c9ddc0">
                      <span class="wh-inline-429482632af7">BIR Form No.</span>
                      <br /><span class="wh-inline-aec978eca301">1601-FQ</span>
                      <br /><span class="wh-inline-429482632af7"
                        >January 2018</span
                      >
                      <br /><span class="wh-inline-ccf4a15a8876">Page 2</span>
                      <br /><br /></td
                    >
                    <td class="wh-inline-62471ef2f05a">
                      <span class="wh-inline-aec978eca301"
                        >Quarterly Remittance Return</span
                      >
                      <br /><span class="wh-inline-1b29e9eb50ae"
                        >of Final Income Taxes Withheld</span
                      >
                    </td>
                    <td class="wh-inline-bef36932d3a7">
                      <p>
                        <img
                          alt="BIR form identifying mark"
                          class="wh-inline-5dfba9815e30"
                          height="75px"
                          src="/legacy/img/withholding/original-cc3df6afa528ca19.png"
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
                        Registered Name for Non-individual)</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td>
                      <span class="wh-inline-649b1ec8a1ed">
                        <input class="wh-source-size-3" aria-label="txtPg2TIN1" data-field-id="frm1601FQ:txtPg2TIN1" data-print-control="text" data-print-value="" id="frm1601FQ:txtPg2TIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1601FQ:txtPg2TIN1"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN2" data-field-id="frm1601FQ:txtPg2TIN2" data-print-control="text" data-print-value="" id="frm1601FQ:txtPg2TIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1601FQ:txtPg2TIN2"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN3" data-field-id="frm1601FQ:txtPg2TIN3" data-print-control="text" data-print-value="" id="frm1601FQ:txtPg2TIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1601FQ:txtPg2TIN3"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2BranchCode" data-field-id="frm1601FQ:txtPg2BranchCode" data-print-control="text" data-print-value="" id="frm1601FQ:txtPg2BranchCode" maxlength="5" readonly size="3" type="text" value={model.text["frm1601FQ:txtPg2BranchCode"] ?? ""}>
                      </span>
                    </td>
                    <td
                      ><input class="wh-source-size-80" aria-label="txtPg2TaxpayerName" data-field-id="frm1601FQ:txtPg2TaxpayerName" data-print-control="text" data-print-value="" id="frm1601FQ:txtPg2TaxpayerName" maxlength="50" readonly size="80" type="text" value={model.text["frm1601FQ:txtPg2TaxpayerName"] ?? ""}></td
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTdPart">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-e81baf8dca25"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >Part IV - Schedules</span
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
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td
                      ><span class="wh-inline-dd2eceacf41a"
                        >Schedule 1 - Details of Final Tax Based on Tax Treaty
                        Rates
                      </span></td
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
                class="tblForm wh-inline-5b58462227a5"
                id="tbllistSchedI"
              >
                <tbody
                  ><tr
                    ><td class="wh-inline-133f5cdc134f"
                      ><span class="wh-inline-97f71f169000"
                        >Seq. No. <br /> (A)
                      </span></td
                    >
                    <td class="wh-inline-30313625822d"
                      ><span class="wh-inline-97f71f169000"
                        >Treaty Code/Country <br /> (B) <br /></span
                      ></td
                    >
                    <td class="wh-inline-12ac8e7d3df7"
                      ><span class="wh-inline-97f71f169000">
                        ATC <br /> (C)
                      </span></td
                    >
                    <td class="wh-inline-31cf45d4f8e9"
                      ><span class="wh-inline-97f71f169000">
                        Nature of Income Payment <br /> (Refer to Schedule 3)
                        <br />
                        (D) <br /></span
                      ></td
                    >
                    <td class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-97f71f169000">
                        Amount of Income Payment<br /> (E)
                      </span></td
                    >
                    <td class="wh-inline-12ac8e7d3df7"
                      ><span class="wh-inline-97f71f169000">
                        Tax Rates <br /> (F)
                      </span></td
                    >
                    <td class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-97f71f169000">
                        Amount of Tax Withheld <br /> (not creditable) <br /> (G)
                        = (E x F)
                      </span></td
                    >
                  </tr>
                </tbody><tbody id="tbodyllistSchedI">
                  <tr>
                    <td class="wh-inline-df13d838da54">1</td>
                    <td class="wh-inline-f02913f03c60">
                      <span aria-label="drpTreatyCode0" class="labels wh-print-select wh-inline-aadf76029491" data-field-id="drpTreatyCode0" data-print-control="select" id="drpTreatyCode0">{model.text["drpTreatyCode0"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-a87772ea93a3">
                      <span aria-label="drpATCCode0" class="labels wh-print-select wh-inline-1bee1923cd56" data-field-id="drpATCCode0" data-print-control="select" id="drpATCCode0">{model.text["drpATCCode0"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-80c99a796975"
                      ><input aria-label="txtNatIncPayment0" class="wh-inline-9a9a3fb03665" data-field-id="txtNatIncPayment0" data-print-control="text" data-print-value="" id="txtNatIncPayment0" readonly size="20" type="text" value={model.text["txtNatIncPayment0"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtAmtIncomePay0" class="wh-inline-0c3cc0c26807" data-field-id="txtAmtIncomePay0" data-print-control="text" data-print-value="" id="txtAmtIncomePay0" maxlength="25" readonly size="17" type="text" value={model.text["txtAmtIncomePay0"] ?? ""}>
                    </td>
                    <td class="wh-inline-38eb7c1ab5d2"
                      ><input aria-label="txtRate0" class="wh-inline-67c03b88e511" data-field-id="txtRate0" data-print-control="text" data-print-value="" id="txtRate0" maxlength="10" readonly size="6" type="text" value={model.text["txtRate0"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtReqWithheld0" class="wh-inline-c87756d3532d" data-field-id="txtReqWithheld0" data-print-control="text" data-print-value="" id="txtReqWithheld0" maxlength="25" readonly size="17" type="text" value={model.text["txtReqWithheld0"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="wh-inline-df13d838da54">2</td>
                    <td class="wh-inline-f02913f03c60">
                      <span aria-label="drpTreatyCode1" class="labels wh-print-select wh-inline-aadf76029491" data-field-id="drpTreatyCode1" data-print-control="select" id="drpTreatyCode1">{model.text["drpTreatyCode1"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-a87772ea93a3">
                      <span aria-label="drpATCCode1" class="labels wh-print-select wh-inline-1bee1923cd56" data-field-id="drpATCCode1" data-print-control="select" id="drpATCCode1">{model.text["drpATCCode1"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-80c99a796975"
                      ><input aria-label="txtNatIncPayment1" class="wh-inline-9a9a3fb03665" data-field-id="txtNatIncPayment1" data-print-control="text" data-print-value="" id="txtNatIncPayment1" readonly size="20" type="text" value={model.text["txtNatIncPayment1"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtAmtIncomePay1" class="wh-inline-0c3cc0c26807" data-field-id="txtAmtIncomePay1" data-print-control="text" data-print-value="" id="txtAmtIncomePay1" maxlength="25" readonly size="17" type="text" value={model.text["txtAmtIncomePay1"] ?? ""}>
                    </td>
                    <td class="wh-inline-38eb7c1ab5d2"
                      ><input aria-label="txtRate1" class="wh-inline-67c03b88e511" data-field-id="txtRate1" data-print-control="text" data-print-value="" id="txtRate1" maxlength="10" readonly size="6" type="text" value={model.text["txtRate1"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtReqWithheld1" class="wh-inline-c87756d3532d" data-field-id="txtReqWithheld1" data-print-control="text" data-print-value="" id="txtReqWithheld1" maxlength="25" readonly size="17" type="text" value={model.text["txtReqWithheld1"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="wh-inline-df13d838da54">3</td>
                    <td class="wh-inline-f02913f03c60">
                      <span aria-label="drpTreatyCode2" class="labels wh-print-select wh-inline-aadf76029491" data-field-id="drpTreatyCode2" data-print-control="select" id="drpTreatyCode2">{model.text["drpTreatyCode2"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-a87772ea93a3">
                      <span aria-label="drpATCCode2" class="labels wh-print-select wh-inline-1bee1923cd56" data-field-id="drpATCCode2" data-print-control="select" id="drpATCCode2">{model.text["drpATCCode2"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-80c99a796975"
                      ><input aria-label="txtNatIncPayment2" class="wh-inline-9a9a3fb03665" data-field-id="txtNatIncPayment2" data-print-control="text" data-print-value="" id="txtNatIncPayment2" readonly size="20" type="text" value={model.text["txtNatIncPayment2"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtAmtIncomePay2" class="wh-inline-0c3cc0c26807" data-field-id="txtAmtIncomePay2" data-print-control="text" data-print-value="" id="txtAmtIncomePay2" maxlength="25" readonly size="17" type="text" value={model.text["txtAmtIncomePay2"] ?? ""}>
                    </td>
                    <td class="wh-inline-38eb7c1ab5d2"
                      ><input aria-label="txtRate2" class="wh-inline-67c03b88e511" data-field-id="txtRate2" data-print-control="text" data-print-value="" id="txtRate2" maxlength="10" readonly size="6" type="text" value={model.text["txtRate2"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtReqWithheld2" class="wh-inline-c87756d3532d" data-field-id="txtReqWithheld2" data-print-control="text" data-print-value="" id="txtReqWithheld2" maxlength="25" readonly size="17" type="text" value={model.text["txtReqWithheld2"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="wh-inline-df13d838da54">4</td>
                    <td class="wh-inline-f02913f03c60">
                      <span aria-label="drpTreatyCode3" class="labels wh-print-select wh-inline-aadf76029491" data-field-id="drpTreatyCode3" data-print-control="select" id="drpTreatyCode3">{model.text["drpTreatyCode3"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-a87772ea93a3">
                      <span aria-label="drpATCCode3" class="labels wh-print-select wh-inline-1bee1923cd56" data-field-id="drpATCCode3" data-print-control="select" id="drpATCCode3">{model.text["drpATCCode3"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-80c99a796975"
                      ><input aria-label="txtNatIncPayment3" class="wh-inline-9a9a3fb03665" data-field-id="txtNatIncPayment3" data-print-control="text" data-print-value="" id="txtNatIncPayment3" readonly size="20" type="text" value={model.text["txtNatIncPayment3"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtAmtIncomePay3" class="wh-inline-0c3cc0c26807" data-field-id="txtAmtIncomePay3" data-print-control="text" data-print-value="" id="txtAmtIncomePay3" maxlength="25" readonly size="17" type="text" value={model.text["txtAmtIncomePay3"] ?? ""}>
                    </td>
                    <td class="wh-inline-38eb7c1ab5d2"
                      ><input aria-label="txtRate3" class="wh-inline-67c03b88e511" data-field-id="txtRate3" data-print-control="text" data-print-value="" id="txtRate3" maxlength="10" readonly size="6" type="text" value={model.text["txtRate3"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtReqWithheld3" class="wh-inline-c87756d3532d" data-field-id="txtReqWithheld3" data-print-control="text" data-print-value="" id="txtReqWithheld3" maxlength="25" readonly size="17" type="text" value={model.text["txtReqWithheld3"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td class="wh-inline-df13d838da54">5</td>
                    <td class="wh-inline-f02913f03c60">
                      <span aria-label="drpTreatyCode4" class="labels wh-print-select wh-inline-aadf76029491" data-field-id="drpTreatyCode4" data-print-control="select" id="drpTreatyCode4">{model.text["drpTreatyCode4"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-a87772ea93a3">
                      <span aria-label="drpATCCode4" class="labels wh-print-select wh-inline-1bee1923cd56" data-field-id="drpATCCode4" data-print-control="select" id="drpATCCode4">{model.text["drpATCCode4"] ?? ""}</span>
                    </td>
                    <td class="wh-inline-80c99a796975"
                      ><input aria-label="txtNatIncPayment4" class="wh-inline-9a9a3fb03665" data-field-id="txtNatIncPayment4" data-print-control="text" data-print-value="" id="txtNatIncPayment4" readonly size="20" type="text" value={model.text["txtNatIncPayment4"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtAmtIncomePay4" class="wh-inline-0c3cc0c26807" data-field-id="txtAmtIncomePay4" data-print-control="text" data-print-value="" id="txtAmtIncomePay4" maxlength="25" readonly size="17" type="text" value={model.text["txtAmtIncomePay4"] ?? ""}>
                    </td>
                    <td class="wh-inline-38eb7c1ab5d2"
                      ><input aria-label="txtRate4" class="wh-inline-67c03b88e511" data-field-id="txtRate4" data-print-control="text" data-print-value="" id="txtRate4" maxlength="10" readonly size="6" type="text" value={model.text["txtRate4"] ?? ""}>
                    </td>
                    <td class="wh-inline-f99c236f78b6"
                      ><input aria-label="txtReqWithheld4" class="wh-inline-c87756d3532d" data-field-id="txtReqWithheld4" data-print-control="text" data-print-value="" id="txtReqWithheld4" maxlength="25" readonly size="17" type="text" value={model.text["txtReqWithheld4"] ?? ""}>
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
                    <td class="wh-inline-5c35ba7f5016"
                      ><span class="wh-inline-abbd0a6c6086"
                        >Total Taxes Withheld
                      </span><span class="wh-inline-97f71f169000"
                        >(Sum of Items 1 to 5)(To Part II Item 21) <span
                        ></span></span
                      ></td
                    >
                    <td class="wh-inline-aee1b998e135">
                      <input aria-label="txtDvTotalSchedI" class="wh-inline-0dcbceace26b wh-source-size-17" data-field-id="txtDvTotalSchedI" data-print-control="text" data-print-value="" id="txtDvTotalSchedI" maxlength="20" readonly size="17" type="text" value={model.text["txtDvTotalSchedI"] ?? ""}>
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
                    <td class="tblForm" colspan="2"
                      ><span class="wh-inline-dd2eceacf41a"
                        >Schedule 2 - Tax Treaty Code</span
                      ></td
                    >
                  </tr>
                </tbody>
              </table>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-07c9d026e2cf"
                      ><span class="wh-inline-abbd0a6c6086">Treaty Code</span
                      ></td
                    >
                    <td class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-abbd0a6c6086">Country</span></td
                    >
                    <td class="wh-inline-07c9d026e2cf"
                      ><span class="wh-inline-abbd0a6c6086">Treaty Code</span
                      ></td
                    >
                    <td class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-abbd0a6c6086">Country</span></td
                    >
                    <td class="wh-inline-07c9d026e2cf"
                      ><span class="wh-inline-abbd0a6c6086">Treaty Code</span
                      ></td
                    >
                    <td class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-abbd0a6c6086">Country</span></td
                    >
                    <td class="wh-inline-07c9d026e2cf"
                      ><span class="wh-inline-abbd0a6c6086">Treaty Code</span
                      ></td
                    >
                    <td class="wh-inline-a884a4318caf"
                      ><span class="wh-inline-abbd0a6c6086">Country</span></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">AU</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        Australia</span
                      ></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">FI</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Finland</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">KW</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Kuwait</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">SG</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        Singapore</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">AT</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Austria</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">FR</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> France</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">MY</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Malaysia</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">ES</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Spain</span></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">BH</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Bahrain</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">DE</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Germany</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">NL</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        Netherlands</span
                      ></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">SE</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Sweden</span></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">BD</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        Bangladesh</span
                      ></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">HU</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Hungary</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">NZ</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        New Zealand</span
                      ></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">CH</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        Switzerland</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">BE</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Belgium</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">IN</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> India</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">NG</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Nigeria</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">TH</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Thailand</span></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">BR</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Brazil</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">ID</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        Indonesia</span
                      ></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">NO</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Norway</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">UAE</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        United Arab Emirates</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">CA</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Canada</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">IL</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Israel</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">PK</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Pakistan</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">GB</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        United Kingdom</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">CN</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> China</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">IT</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Italy</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">PL</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Poland</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">US</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        United States of America</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">CZ</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">
                        Czech Republic</span
                      ></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">JP</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Japan</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">RO</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Romania</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">VN</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Vietnam</span></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">DK</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Denmark</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">KR</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Korea</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">RU</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000"> Russia</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">BN</span></td
                    >
                    <td class="wh-inline-a30033456d9a"
                      ><span class="wh-inline-97f71f169000">Brunei</span></td
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
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="tblForm" colspan="2"
                      ><span class="wh-inline-dd2eceacf41a"
                        >Schedule 3 - Nature of Income Payment</span
                      ></td
                    >
                  </tr>
                </tbody>
              </table>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr>
                    <td class="wh-inline-f474e7569d07"
                      ><span class="wh-inline-dd2eceacf41a">
                        Particulars</span
                      ></td
                    >
                    <td class="wh-inline-2306a1a9dc96"
                      ><span class="wh-inline-dd2eceacf41a">Tax Rate</span></td
                    >
                    <td class="wh-inline-36fe9f8cef2e" colspan="2">
                      <table
                        border="1"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-b74193ed7b54"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-7b6943ad525c" colspan="2"
                              ><span class="wh-inline-dd2eceacf41a">ATC</span
                              ></td
                            >
                          </tr>
                          <tr>
                            <td class="wh-inline-f7adc27b9a8a"
                              ><span class="wh-inline-dd2eceacf41a"
                                >Individual</span
                              ></td
                            >
                            <td class="wh-inline-f7adc27b9a8a"
                              ><span class="wh-inline-dd2eceacf41a"
                                >Corporate</span
                              ></td
                            >
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody><tbody id="tblSched3"
                  >{#each model.referenceRows as row (row.id)}<tr
                      ><td class="wh-reference-description"
                        >{row.description}</td
                      ><td>{row.rate}</td><td class="wh-text-center"
                        >{row.individual}</td
                      ><td class="wh-text-center">{row.corporate}</td></tr
                    >{/each}</tbody
                >
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
        <h2>BIR Form 1601FQ — {continuation.title}</h2>
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
