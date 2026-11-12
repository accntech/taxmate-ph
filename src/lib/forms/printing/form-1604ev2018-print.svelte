<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1604e:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1604e:AmendedRtn_1",
    "source": "frm1604e:AmendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604e:AmendedRtn_2",
    "source": "frm1604e:AmendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604e:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1604e:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtRDOCode",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtWthhldngAgntsNme",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtAddress2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1604e:WthldngAgntCtgry_1",
    "source": "frm1604e:WthldngAgntCtgry",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1604e:WthldngAgntCtgry_2",
    "source": "frm1604e:WthldngAgntCtgry",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1604e:TpWthldngAgnt_1",
    "source": "frm1604e:TpWthldngAgnt",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604e:TpWthldngAgnt_2",
    "source": "frm1604e:TpWthldngAgnt",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1604e:txtTelNum",
    "fallback": ""
  },
  {
    "id": "txtEmail",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1RemDate1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1BankCode1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TRANo1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TaxWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1Penalties1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1TotRemAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1RemDate2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1BankCode2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TRANo2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TaxWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1Penalties2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1TotRemAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1RemDate3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1BankCode3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TRANo3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TaxWithheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1Penalties3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1TotRemAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1RemDate4",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1BankCode4",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TRANo4",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched1TaxWithheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1Penalties4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1TotRemAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1TaxWithheldTtl",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1PenaltiesTtl",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched1TotRemAmtTtl",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate4",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode4",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo4",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate5",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode5",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo5",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate6",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode6",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo6",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate7",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode7",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo7",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate8",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode8",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo8",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate9",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode9",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo9",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate10",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode10",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo10",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate11",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode11",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo11",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2RemDate12",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2BankCode12",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TRANo12",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtSched2TaxWithheld12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2Penalties12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmt12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TaxWithheldTtl",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2PenaltiesTtl",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtSched2TotRemAmtTtl",
    "fallback": "0.00"
  },
  {
    "id": "frm1604e:txtPg2TIN1",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtPg2TIN2",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtPg2TIN3",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtPg2BranchCode",
    "fallback": ""
  },
  {
    "id": "frm1604e:txtPg2TaxpayerName",
    "fallback": ""
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1604Ev2018", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1604Ev2018"
  aria-label="BIR Form 1604Ev2018 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1604ev2018-1"
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
                      <br /><span class="wh-inline-8e2526521e8c">1604-E</span>
                      <br /><span class="wh-inline-429482632af7"
                        >January 2018 (ENCS)</span
                      >
                      <br /><span class="wh-inline-ccf4a15a8876">Page 1</span>
                    </td>
                    <td class="wh-inline-62471ef2f05a">
                      <span class="wh-inline-1b29e9eb50ae"
                        >Annual Information Return</span
                      >
                      <br /><span class="wh-inline-1b29e9eb50ae"
                        >of Creditable Income Taxes Withheld (Expanded)/</span
                      >
                      <br /><span class="wh-inline-1b29e9eb50ae"
                        >Income Payments Exempt from Withholding Tax</span
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
                          src="/legacy/img/withholding/original-d7904eb8e8ef5035.png"
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
                    <td class="tblFormTd wh-inline-da0ceb3d95b7">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-ec12ace9f4bf"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6f7ee51f83d0"
                              ><span class="wh-inline-4cf6c17959a7">
                                1
                              </span></td
                            >
                            <td class="wh-inline-2e3ce3500fda"
                              ><span class="wh-inline-cb3a2164388b"
                                >For the Year (20YY)
                              </span></td
                            >
                            <td class="wh-inline-0961c77489a6">
                              <input aria-label="txtYear" class="wh-inline-9f262eec8c33" data-field-id="frm1604e:txtYear" data-print-control="text" data-print-value="" id="frm1604e:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1604e:txtYear"] ?? ""}></td
                            >
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-da0ceb3d95b7">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-91c922552d14"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6f7ee51f83d0"
                              ><span class="wh-inline-4cf6c17959a7">
                                2
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >Amended Return?</span
                              ></td
                            >
                            <td class="wh-inline-5c688d438f95">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="iceSelOneRb-dis fieldText1-dis wh-inline-bea131ee28b0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      ><input aria-label="AmendedRtn_1" checked={model.checks["frm1604e:AmendedRtn_1"] ?? false} data-field-id="frm1604e:AmendedRtn_1" data-print-control="radio" disabled id="frm1604e:AmendedRtn_1" type="radio"/><span class="wh-inline-534e2278e92c"
                                        >Yes</span
                                      ></td
                                    >
                                    <td
                                      ><input aria-label="AmendedRtn_2" checked={model.checks["frm1604e:AmendedRtn_2"] ?? false} data-field-id="frm1604e:AmendedRtn_2" data-print-control="radio" disabled id="frm1604e:AmendedRtn_2" type="radio"/><span class="wh-inline-534e2278e92c"
                                        >No</span
                                      ></td
                                    >
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-da0ceb3d95b7">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-59d29db7b7e7"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6f7ee51f83d0"
                              ><span class="wh-inline-4cf6c17959a7">
                                3
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >No. of Sheet/s Attached</span
                              ></td
                            >
                            <td
                              ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1604e:txtSheets" data-print-control="text" data-print-value="" id="frm1604e:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1604e:txtSheets"] ?? ""}></td
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
                                4
                              </span></td
                            >
                            <td>
                              <span class="wh-inline-cb3a2164388b"
                                >Taxpayer Identification Number (TIN)
                              </span>
                              <span class="wh-inline-649b1ec8a1ed">
                                <input class="wh-source-size-3" aria-label="txtTIN1" data-field-id="frm1604e:txtTIN1" data-print-control="text" data-print-value="" id="frm1604e:txtTIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1604e:txtTIN1"] ?? ""}>
                                - 
                                <input class="wh-source-size-3" aria-label="txtTIN2" data-field-id="frm1604e:txtTIN2" data-print-control="text" data-print-value="" id="frm1604e:txtTIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1604e:txtTIN2"] ?? ""}>
                                - 
                                <input class="wh-source-size-3" aria-label="txtTIN3" data-field-id="frm1604e:txtTIN3" data-print-control="text" data-print-value="" id="frm1604e:txtTIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1604e:txtTIN3"] ?? ""}>
                                - 
                                <input class="wh-source-size-5" aria-label="txtBranchCode" data-field-id="frm1604e:txtBranchCode" data-print-control="text" data-print-value="" id="frm1604e:txtBranchCode" maxlength="5" readonly size="5" type="text" value={model.text["frm1604e:txtBranchCode"] ?? ""}>
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
                                5
                              </span><span class="wh-inline-cb3a2164388b"
                                >RDO Code
                              </span></td
                            >
                            <td>
                              <input class="wh-source-size-5" aria-label="txtRDOCode" data-field-id="frm1604e:txtRDOCode" data-print-control="text" data-print-value="" id="frm1604e:txtRDOCode" maxlength="5" readonly size="5" type="text" value={model.text["frm1604e:txtRDOCode"] ?? ""}>
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
                                        6
                                      </span></td
                                    >
                                    <td
                                      ><span class="wh-inline-cb3a2164388b"
                                        >Withholding Agent's Name <i
                                          >(Last Name, First name, Middle Name
                                          for Individual OR Registered for
                                          Non-Individual</i
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
                                      ><input class="wh-source-size-120" aria-label="txtWthhldngAgntsNme" data-field-id="frm1604e:txtWthhldngAgntsNme" data-print-control="text" data-print-value="" id="frm1604e:txtWthhldngAgntsNme" maxlength="50" readonly size="120" type="text" value={model.text["frm1604e:txtWthhldngAgntsNme"] ?? ""}></td
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
                                        7
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
                                      ><input class="wh-source-size-120" aria-label="txtAddress" data-field-id="frm1604e:txtAddress" data-print-control="text" data-print-value="" id="frm1604e:txtAddress" maxlength="130" readonly size="120" type="text" value={model.text["frm1604e:txtAddress"] ?? ""}></td
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
                              <input class="wh-source-size-85" aria-label="txtAddress2" data-field-id="frm1604e:txtAddress2" data-print-control="text" data-print-value="" id="frm1604e:txtAddress2" maxlength="20" readonly size="85" type="text" value={model.text["frm1604e:txtAddress2"] ?? ""}>
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
                                7A
                              </span><span class="wh-inline-cb3a2164388b"
                                >Zip Code</span
                              >
                            </td>
                            <td>
                              <div class="wh-inline-a30033456d9a">
                                <input class="wh-source-size-2" aria-label="txtZipCode" data-field-id="frm1604e:txtZipCode" data-print-control="text" data-print-value="" id="frm1604e:txtZipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1604e:txtZipCode"] ?? ""}>
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
                    <td class="tblFormTd wh-inline-212e7bbc2a99">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-3101472a3484"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6f7ee51f83d0"
                              ><span class="wh-inline-4cf6c17959a7">
                                8
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >Category of Withholding Agent</span
                              ></td
                            >
                            <td class="">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="iceSelOneRb-dis fieldText1-dis wh-inline-d29d13ed8dc5"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      ><input aria-label="WthldngAgntCtgry_1" checked={model.checks["frm1604e:WthldngAgntCtgry_1"] ?? false} data-field-id="frm1604e:WthldngAgntCtgry_1" data-print-control="radio" disabled id="frm1604e:WthldngAgntCtgry_1" type="radio"/><span class="wh-inline-534e2278e92c"
                                        >Private</span
                                      ></td
                                    >
                                    <td
                                      ><input aria-label="WthldngAgntCtgry_2" checked={model.checks["frm1604e:WthldngAgntCtgry_2"] ?? false} data-field-id="frm1604e:WthldngAgntCtgry_2" data-print-control="radio" disabled id="frm1604e:WthldngAgntCtgry_2" type="radio"/><span class="wh-inline-534e2278e92c"
                                        >Government</span
                                      ></td
                                    >
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-212e7bbc2a99">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-73799af99d36"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6f7ee51f83d0"
                              ><span class="wh-inline-4cf6c17959a7">
                                8A
                              </span></td
                            >
                            <td
                              ><span class="wh-inline-cb3a2164388b"
                                >If private, top withholding agent?</span
                              ></td
                            >
                            <td class="wh-inline-5c688d438f95">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="iceSelOneRb-dis fieldText1-dis wh-inline-bea131ee28b0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      ><input aria-label="TpWthldngAgnt_1" checked={model.checks["frm1604e:TpWthldngAgnt_1"] ?? false} data-field-id="frm1604e:TpWthldngAgnt_1" data-print-control="radio" disabled id="frm1604e:TpWthldngAgnt_1" type="radio"/><span class="wh-inline-534e2278e92c"
                                        >Yes</span
                                      ></td
                                    >
                                    <td
                                      ><input aria-label="TpWthldngAgnt_2" checked={model.checks["frm1604e:TpWthldngAgnt_2"] ?? false} data-field-id="frm1604e:TpWthldngAgnt_2" data-print-control="radio" disabled id="frm1604e:TpWthldngAgnt_2" type="radio"/><span class="wh-inline-534e2278e92c"
                                        >No</span
                                      ></td
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
                    <td class="tblFormTd wh-inline-42854b233a00">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-a3a638f5d724"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                9
                              </span></td
                            >
                            <td class="wh-inline-d228c04551e8">
                              <span class="wh-inline-cb3a2164388b"
                                >Contact Number
                              </span><span class="wh-inline-3115fb736f6a"
                              ></span>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-6b6ee2d44756"> </td>
                            <td>
                              <input class="wh-source-size-20" aria-label="txtTelNum" data-field-id="frm1604e:txtTelNum" data-print-control="text" data-print-value="" id="frm1604e:txtTelNum" maxlength="20" readonly size="20" type="text" value={model.text["frm1604e:txtTelNum"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td class="tblFormTd wh-inline-296702298558">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-d208a91d4d2c"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-6e606d24db7d"
                              ><span class="wh-inline-4cf6c17959a7">
                                10
                              </span></td
                            >
                            <td class="wh-inline-57becd9072ec">
                              <span class="wh-inline-cb3a2164388b"
                                >Email Address</span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-6b6ee2d44756"> </td>
                            <td>
                              <input class="wh-source-size-78" aria-label="txtEmail" data-field-id="txtEmail" data-print-control="text" data-print-value="" id="txtEmail" maxlength="60" readonly size="78" type="text" value={model.text["txtEmail"] ?? ""}>
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
                                  >PART II - Summary of Remittances</span
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
                      <span class="wh-inline-4cf6c17959a7">
                        <i
                          >Schedule 1 - Remittance per BIR Form No. 1601-EQ
                        </i></span
                      >
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="tblForm wh-inline-6b8e46f64412"
                      >
                        <tbody
                          ><tr
                            ><td class="tblFormTd wh-inline-261df5a44a38"
                              ><table border="1" class="wh-inline-dae250ad5c6b">
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-eb9f896c6842"
                                      ><div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-d9841be1c690"
                                          >Quarter</span
                                        >
                                      </div></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7"
                                      ><div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-d9841be1c690"
                                          >Date of Remittance (MM/DD/YYYY)</span
                                        >
                                      </div></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7"
                                      ><div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-d9841be1c690"
                                          >Drawee Bank/ Bank Code/ Agency</span
                                        >
                                      </div></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7"
                                      ><div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-d9841be1c690"
                                          >TRA/eROR/eAR Number</span
                                        >
                                      </div></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7"
                                      ><div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-d9841be1c690"
                                          >Taxes Withheld</span
                                        >
                                      </div></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7"
                                      ><div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-d9841be1c690"
                                          >Penalties</span
                                        >
                                      </div></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7"
                                      ><div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-d9841be1c690"
                                          >Total Amount Remitted</span
                                        >
                                      </div></td
                                    >
                                  </tr>
                                  <tr>
                                    <td class="wh-inline-eb9f896c6842"
                                      ><span class="wh-inline-97f71f169000"
                                        >1st Quarter</span
                                      ></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1RemDate1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1RemDate1" data-print-control="text" data-print-value="" id="frm1604e:txtSched1RemDate1" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched1RemDate1"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1BankCode1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1BankCode1" data-print-control="text" data-print-value="" id="frm1604e:txtSched1BankCode1" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1BankCode1"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TRANo1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TRANo1" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TRANo1" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TRANo1"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TaxWithheld1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TaxWithheld1" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TaxWithheld1" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TaxWithheld1"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1Penalties1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1Penalties1" data-print-control="text" data-print-value="" id="frm1604e:txtSched1Penalties1" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1Penalties1"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TotRemAmt1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TotRemAmt1" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TotRemAmt1" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TotRemAmt1"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="wh-inline-eb9f896c6842"
                                      ><span class="wh-inline-97f71f169000"
                                        >2nd Quarter</span
                                      ></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1RemDate2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1RemDate2" data-print-control="text" data-print-value="" id="frm1604e:txtSched1RemDate2" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched1RemDate2"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1BankCode2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1BankCode2" data-print-control="text" data-print-value="" id="frm1604e:txtSched1BankCode2" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1BankCode2"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TRANo2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TRANo2" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TRANo2" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TRANo2"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TaxWithheld2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TaxWithheld2" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TaxWithheld2" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TaxWithheld2"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1Penalties2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1Penalties2" data-print-control="text" data-print-value="" id="frm1604e:txtSched1Penalties2" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1Penalties2"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TotRemAmt2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TotRemAmt2" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TotRemAmt2" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TotRemAmt2"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="wh-inline-eb9f896c6842"
                                      ><span class="wh-inline-97f71f169000"
                                        >3rd Quarter</span
                                      ></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1RemDate3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1RemDate3" data-print-control="text" data-print-value="" id="frm1604e:txtSched1RemDate3" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched1RemDate3"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1BankCode3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1BankCode3" data-print-control="text" data-print-value="" id="frm1604e:txtSched1BankCode3" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1BankCode3"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TRANo3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TRANo3" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TRANo3" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TRANo3"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TaxWithheld3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TaxWithheld3" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TaxWithheld3" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TaxWithheld3"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1Penalties3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1Penalties3" data-print-control="text" data-print-value="" id="frm1604e:txtSched1Penalties3" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1Penalties3"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TotRemAmt3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TotRemAmt3" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TotRemAmt3" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TotRemAmt3"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="wh-inline-eb9f896c6842"
                                      ><span class="wh-inline-97f71f169000"
                                        >4th Quarter</span
                                      ></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1RemDate4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1RemDate4" data-print-control="text" data-print-value="" id="frm1604e:txtSched1RemDate4" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched1RemDate4"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1BankCode4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1BankCode4" data-print-control="text" data-print-value="" id="frm1604e:txtSched1BankCode4" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1BankCode4"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TRANo4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TRANo4" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TRANo4" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TRANo4"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TaxWithheld4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TaxWithheld4" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TaxWithheld4" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TaxWithheld4"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1Penalties4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1Penalties4" data-print-control="text" data-print-value="" id="frm1604e:txtSched1Penalties4" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1Penalties4"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TotRemAmt4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TotRemAmt4" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TotRemAmt4" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TotRemAmt4"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="wh-inline-eb9f896c6842"
                                      ><span class="wh-inline-6354cb7131a7"
                                        >TOTAL</span
                                      ></td
                                    >
                                    <td
                                      ><div
                                        class="wh-inline-a30033456d9a"
                                      ></div></td
                                    >
                                    <td
                                      ><div
                                        class="wh-inline-a30033456d9a"
                                      ></div></td
                                    >
                                    <td
                                      ><div
                                        class="wh-inline-a30033456d9a"
                                      ></div></td
                                    >
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TaxWithheldTtl" class="wh-inline-be7b986aabdd wh-source-size-13" data-field-id="frm1604e:txtSched1TaxWithheldTtl" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TaxWithheldTtl" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TaxWithheldTtl"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1PenaltiesTtl" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1PenaltiesTtl" data-print-control="text" data-print-value="" id="frm1604e:txtSched1PenaltiesTtl" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1PenaltiesTtl"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-5eb92f2a45b7">
                                      <input aria-label="txtSched1TotRemAmtTtl" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched1TotRemAmtTtl" data-print-control="text" data-print-value="" id="frm1604e:txtSched1TotRemAmtTtl" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched1TotRemAmtTtl"] ?? ""}>
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
                    <td class="tblFormTd">
                      <span class="wh-inline-4cf6c17959a7">
                        <i
                          >Schedule 2 - Remittance per BIR Form No. 1606
                        </i></span
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-5b58462227a5"
              >
                <tbody
                  ><tr
                    ><td class="tblFormTd"
                      ><table
                        border="1"
                        class="tblFormTdPart wh-inline-fcc59ed50ef8"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-d9841be1c690">Month</span
                                >
                              </div></td
                            >
                            <td class="wh-inline-5eb92f2a45b7"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-d9841be1c690"
                                  >Date of Remittance (MM/DD/YYYY)</span
                                >
                              </div></td
                            >
                            <td class="wh-inline-5eb92f2a45b7"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-d9841be1c690"
                                  >Drawee Bank/ Bank Code/ Agency</span
                                >
                              </div></td
                            >
                            <td class="wh-inline-5eb92f2a45b7"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-d9841be1c690"
                                  >TRA/eROR/eAR Number</span
                                >
                              </div></td
                            >
                            <td class="wh-inline-5eb92f2a45b7"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-d9841be1c690"
                                  >Taxes Withheld</span
                                >
                              </div></td
                            >
                            <td class="wh-inline-5eb92f2a45b7"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-d9841be1c690"
                                  >Penalties</span
                                >
                              </div></td
                            >
                            <td class="wh-inline-5eb92f2a45b7"
                              ><div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-d9841be1c690"
                                  >Total Amount Remitted</span
                                >
                              </div></td
                            >
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab"
                                >January</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate1" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate1" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate1"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode1" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode1" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode1"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo1" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo1" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo1"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld1" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld1" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld1"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties1" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties1" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties1"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt1" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt1" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt1" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt1"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab"
                                >February</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate2" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate2" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate2"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode2" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode2" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode2"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo2" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo2" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo2"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld2" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld2" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld2"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties2" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties2" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties2"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt2" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt2" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt2" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt2"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab">March</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate3" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate3" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate3"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode3" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode3" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode3"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo3" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo3" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo3"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld3" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld3" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld3"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties3" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties3" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties3"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt3" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt3" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt3" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt3"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab">April</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate4" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate4" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate4"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode4" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode4" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode4"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo4" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo4" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo4"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld4" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld4" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld4"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties4" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties4" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties4"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt4" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt4" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt4" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt4"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab">May</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate5" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate5" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate5" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate5"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode5" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode5" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode5" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode5"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo5" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo5" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo5" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo5"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld5" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld5" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld5" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld5"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties5" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties5" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties5" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties5"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt5" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt5" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt5" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt5"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab">June</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate6" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate6" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate6" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate6"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode6" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode6" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode6" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode6"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo6" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo6" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo6" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo6"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld6" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld6" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld6" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld6"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties6" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties6" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties6" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties6"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt6" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt6" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt6" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt6"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab">July</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate7" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate7" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate7" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate7"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode7" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode7" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode7" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode7"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo7" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo7" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo7" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo7"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld7" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld7" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld7" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld7"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties7" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties7" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties7" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties7"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt7" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt7" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt7" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt7"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab">August</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate8" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate8" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate8" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate8"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode8" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode8" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode8" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode8"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo8" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo8" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo8" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo8"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld8" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld8" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld8" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld8"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties8" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties8" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties8" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties8"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt8" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt8" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt8" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt8"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab"
                                >September</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate9" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate9" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate9" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate9"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode9" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode9" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode9" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode9"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo9" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo9" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo9" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo9"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld9" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld9" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld9" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld9"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties9" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties9" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties9" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties9"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt9" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt9" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt9" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt9"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab"
                                >October</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate10" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate10" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate10" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate10"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode10" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode10" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode10" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode10"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo10" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo10" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo10" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo10"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld10" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld10" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld10" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld10"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties10" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties10" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties10" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties10"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt10" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt10" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt10" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt10"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab"
                                >November</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate11" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate11" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate11" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate11"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode11" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode11" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode11" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode11"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo11" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo11" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo11" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo11"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld11" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld11" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld11" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld11"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties11" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties11" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties11" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties11"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt11" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt11" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt11" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt11"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-232ced7b40ab"
                                >December</span
                              ></td
                            >
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2RemDate12" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2RemDate12" data-print-control="text" data-print-value="" id="frm1604e:txtSched2RemDate12" maxlength="10" readonly size="13" type="text" value={model.text["frm1604e:txtSched2RemDate12"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2BankCode12" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2BankCode12" data-print-control="text" data-print-value="" id="frm1604e:txtSched2BankCode12" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2BankCode12"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TRANo12" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TRANo12" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TRANo12" maxlength="50" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TRANo12"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheld12" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheld12" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheld12" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheld12"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2Penalties12" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2Penalties12" data-print-control="text" data-print-value="" id="frm1604e:txtSched2Penalties12" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2Penalties12"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmt12" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmt12" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmt12" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmt12"] ?? ""}>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-eb9f896c6842"
                              ><span class="wh-inline-6354cb7131a7">TOTAL</span
                              ></td
                            >
                            <td><div class="wh-inline-a30033456d9a"></div></td>
                            <td><div class="wh-inline-a30033456d9a"></div></td>
                            <td><div class="wh-inline-a30033456d9a"></div></td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TaxWithheldTtl" class="wh-inline-be7b986aabdd wh-source-size-13" data-field-id="frm1604e:txtSched2TaxWithheldTtl" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TaxWithheldTtl" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TaxWithheldTtl"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2PenaltiesTtl" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2PenaltiesTtl" data-print-control="text" data-print-value="" id="frm1604e:txtSched2PenaltiesTtl" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2PenaltiesTtl"] ?? ""}>
                            </td>
                            <td class="wh-inline-5eb92f2a45b7">
                              <input aria-label="txtSched2TotRemAmtTtl" class="wh-inline-80ec55322565 wh-source-size-13" data-field-id="frm1604e:txtSched2TotRemAmtTtl" data-print-control="text" data-print-value="" id="frm1604e:txtSched2TotRemAmtTtl" maxlength="25" readonly size="13" type="text" value={model.text["frm1604e:txtSched2TotRemAmtTtl"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table></td
                    >
                  </tr></tbody
                >
              </table>
            </td></tr
          ></tbody
        >
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1604ev2018-2"
    data-source-page="2"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="wh-inline-618531a49326" id="Page2Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-b0f12b8a4668"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="1"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-b0f12b8a4668"
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
                            <td class="wh-inline-e797b9c9ddc0">
                              <span class="wh-inline-429482632af7"
                                >BIR Form No.</span
                              >
                              <br /><span class="wh-inline-8e2526521e8c"
                                >1604-E</span
                              >
                              <br /><span class="wh-inline-429482632af7"
                                >January 2018 (ENCS)</span
                              >
                              <br /><span class="wh-inline-ccf4a15a8876"
                                >Page 2</span
                              >
                              <br /><br /><br /></td
                            >
                            <td class="wh-inline-62471ef2f05a">
                              <span class="wh-inline-1b29e9eb50ae"
                                >Annual Information Return</span
                              >
                              <br /><span class="wh-inline-1b29e9eb50ae"
                                >of Creditable Income Taxes Withheld (Expanded)/</span
                              >
                              <br /><span class="wh-inline-1b29e9eb50ae"
                                >Income Payments Exempt from Withholding Tax</span
                              >
                              <br /><span class="wh-inline-429482632af7"
                                >Enter all required information in CAPITAL
                                LETTERS using BLACK ink. Mark all applicable
                                boxes with an "X". Two copies MUST be filed with
                                the BIR and one held by the Tax Filer.</span
                              >
                              <br /><br /></td
                            >
                            <td class="wh-inline-bef36932d3a7">
                              <p>
                                <img
                                  alt="BIR form identifying mark"
                                  class="wh-inline-5dfba9815e30"
                                  height="75px"
                                  src="/legacy/img/withholding/original-29565089a8196ccb.png"
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
                        <input class="wh-source-size-3" aria-label="txtPg2TIN1" data-field-id="frm1604e:txtPg2TIN1" data-print-control="text" data-print-value="" id="frm1604e:txtPg2TIN1" maxlength="3" readonly size="3" type="text" value={model.text["frm1604e:txtPg2TIN1"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN2" data-field-id="frm1604e:txtPg2TIN2" data-print-control="text" data-print-value="" id="frm1604e:txtPg2TIN2" maxlength="3" readonly size="3" type="text" value={model.text["frm1604e:txtPg2TIN2"] ?? ""}>
                        <input class="wh-source-size-3" aria-label="txtPg2TIN3" data-field-id="frm1604e:txtPg2TIN3" data-print-control="text" data-print-value="" id="frm1604e:txtPg2TIN3" maxlength="3" readonly size="3" type="text" value={model.text["frm1604e:txtPg2TIN3"] ?? ""}>
                        <input class="wh-source-size-5" aria-label="txtPg2BranchCode" data-field-id="frm1604e:txtPg2BranchCode" data-print-control="text" data-print-value="" id="frm1604e:txtPg2BranchCode" maxlength="5" readonly size="5" type="text" value={model.text["frm1604e:txtPg2BranchCode"] ?? ""}>
                      </span>
                    </td>
                    <td
                      ><input class="wh-source-size-80" aria-label="txtPg2TaxpayerName" data-field-id="frm1604e:txtPg2TaxpayerName" data-print-control="text" data-print-value="" id="frm1604e:txtPg2TaxpayerName" maxlength="50" readonly size="80" type="text" value={model.text["frm1604e:txtPg2TaxpayerName"] ?? ""}></td
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
                        class="wh-inline-20704450ef5b"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >PART III - Alphabetical List of Payees</span
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
                class="tblForm wh-inline-c4108ed7c7b2"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <span class="wh-inline-4cf6c17959a7">
                        <i
                          >Schedule 3 - Alphalist of Payees Subject to Expanded
                          Withholding Tax</i
                        ></span
                      ><span class="wh-inline-cb3a2164388b"></span> (Declared and
                      Certified using BIR Form No. 2307)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table class="tblForm wh-inline-41061bbc17ac">
                        <tbody
                          ><tr>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">SEQ No.</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-1df8837affd5">TIN</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >Name of Payees</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i
                                  >(Last Name, First Name, Middle Name for
                                  Individual)/(Registered Name for
                                  Non-Individual)</i
                                ></span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">ATC</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >Amount of Income Payment</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >Tax Rate</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >Amount of Tax Withheld</span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">(1)</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">(2)</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">(3)</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">(4)</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">(5)</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">(6)</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >(7) = (5 X 6)</span
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
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
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
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td
                              class="tblFormTd wh-inline-75b7803ec210"
                              colspan="4"
                            >
                              <span class="wh-inline-15663751d502"> TOTAL</span>
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
                    <td class="tblFormTd wh-inline-75b7803ec210">
                      <span class="wh-inline-4cf6c17959a7">
                        <i
                          >Schedule 4 - Alphalist of Other Payees Whose Income
                          Payments are Exempt from Withholding Tax but Subject
                          to Income <br />                     Tax</i
                        ></span
                      ><span class="wh-inline-cb3a2164388b"></span>(Declared and
                      Certified using BIR Form No. 2304)
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table class="tblForm wh-inline-8d4e7e3effd4">
                        <tbody
                          ><tr>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">SEQ No.</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">TIN</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >Name of Payees</span
                              ><br /><span class="wh-inline-cb3a2164388b"
                                ><i
                                  >(Last Name, First Name, Middle Name for
                                  Individual)/(Registered Name for
                                  Non-Individual)</i
                                ></span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b">ATC</span>
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >Nature of Income Payment</span
                              >
                            </td>
                            <td class="tblFormTd wh-inline-76fe47511cca">
                              <span class="wh-inline-cb3a2164388b"
                                >Amount of Income Payment</span
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
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
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
                          </tr>
                          <tr class="wh-inline-7ae6f89077b3">
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                            <td class="tblFormTd wh-inline-75b7803ec210"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr> </tr>
                  <tr>
                    <td>
                      <br />
                      <div class="smallSubtitle wh-inline-a30033456d9a">
                        Guidelines and Instructions for BIR Form No. 1604-E
                        [January 2018(ENCS)]
                      </div>
                      <div class="smallSubtitle wh-inline-a30033456d9a">
                        Annual Information Return of Creditable Income Taxes
                        Withheld (Expanded)/Income Payments Exempt from
                        Withholding Tax
                      </div>
                      <br />
                      <table class="wh-inline-e40b23c7aa3d" id="inserted">
                        <tbody
                          ><tr>
                            <td class="firstcol">
                              <p class="wh-inline-b4d488d004fc">
                                These instructions below are designed to assist
                                withholding agents, or their representatives,
                                with the preparation of their Annual Information
                                Return of Creditable Income Taxes Withheld
                                (Expanded)/Income Payments Exempt from
                                Withholding Tax. If there are questions which
                                are no adequetely covered, please consult the
                                local BIR Office. If there appears to be any
                                discrepancies between these instructions and the
                                applicable laws and regulations, the laws and
                                regulations take precedence.
                              </p>
                              <div class="wh-inline-70a45bcf825c">
                                Who Shall File
                              </div>
                              <p class="wh-inline-b5f79d38e688">
                                This return shall be filed in triplicate by
                                every Withholding Agent (WA)/payor who is either
                                an individual, estate, trust and partnerships,
                                corporation, government agency and
                                instrumentality, government owned and controlled
                                corporation, local government unit and Expanded
                                Withholding Taxes or making payments not subject
                                to withholding tax but subject to income tax.
                              </p>
                              <div class="wh-inline-70a45bcf825c">
                                When and Where to File and Pay/Remit
                              </div>
                              <p class="wh-inline-b5f79d38e688">
                                The return shall be filed on or before March of
                                the following the calendar year in which the
                                income payments subject to expanded withholding
                                taxes or exempt from withholding tax were paid
                                or accrued, whichever comes first.
                              </p>
                              <p class="wh-inline-b5f79d38e688">
                                The return shall be filed thru Offline eBIRForms
                                Package per Revenue Reguilations No. 6-2014, as
                                amended.
                              </p>
                              <p class="wh-inline-b5f79d38e688">
                                A taxpayer may file a separate return for the
                                head office and for each branch or place place
                                of business/office or a consolidated return for
                                the head office and all the branches/offices
                                exept in the case of large taxpayers where only
                                one consolidated return is required
                              </p>
                              <div class="wh-inline-70a45bcf825c">
                                How to Accomplish the Information Return
                              </div>
                              <div class="wh-inline-70a45bcf825c">
                                For Items 1 to 3
                              </div>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 1</span
                                > Indicate the taxable year covered by the return
                                being filed.
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 2</span
                                > Choose "Yes" if the return is one amending previous
                                return filed, "No" if not.
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 3</span
                                > Indicate total number of sheet/s being attached
                                to the return
                              </p>
                              <div class="wh-inline-70a45bcf825c">
                                Part I - Background Information
                              </div>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 4 Taxpayer Identification Number (TIN):</span
                                >
                                Enter TIN. If no TIN, apply for one before filing
                                using Application for Registration [(BIR Form No.
                                1901 for individual taxpayer) or (BIR Form No. 1903
                                for non-individual taxpayer)].
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 5 RDO Code:</span
                                >
                                Enter the appropriate code for the RDO per filed BIR
                                Form No. 1901/1903 and/or Certificate of Registration
                                (BIR Form No. 2303).
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 6 Winthholding Agent's Name:</span
                                >
                                Enter taxpayer's name as it was entered on the registration
                                form and/or certificate of registration.
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 7 Registered Address:</span
                                >
                                Enter registered address as indicated in BIR Form
                                No. 2303. If taxpayer has moved since previous filing
                                and has NOT updated registration, the taxpayer must
                                update his/her/its registration by filing BIR Form
                                No. 1905.
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 7A ZIP Code:</span
                                >
                                Enter the ZIP Code of the address.
                              </p>
                            </td>
                            <td class="secondcol">
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 8 Category of Withholding Agent:</span
                                >
                                Choose Private if the withholding agent is a private
                                individual/non-individual, or government if the withholding
                                agent is the government of the Philippines or any
                                political subdivision, agency or instrumentality.
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 8A Top Withholding Agent:</span
                                >
                                If the withholding agent is private and belong to
                                top withholding agent (i.e. top 5,000 individual,
                                top 20,000 private corporations, TAMP, medium taxpayers,
                                large taxpayers, etc.), tick Yes, if not, tick No.
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 9 Contact Number:</span
                                >
                                Enter the taxpayer's current contact number
                              </p>
                              <p class="wh-inline-d9fa88365308">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Item 10 Email Address:</span
                                >
                                Enter requested information. In case the taxpayer
                                has no email address, leave the space blank.
                              </p>
                              <div class="wh-inline-70a45bcf825c">
                                Penalty for Failure to File Information Returns
                              </div>
                              <p class="wh-inline-b5f79d38e688">
                                In the case of each failure to file an
                                information return, statement or list, or keep
                                any record, or supply any information required
                                by the Code or by the Commissioner on the date
                                prescribed therefor, unless it is shown that
                                such failure is due to reasonable caused and not
                                to willful neglect, there shall, upon notice and
                                demand by the Commissioner, be paid by the
                                person failing to file, keep or supply the same
                                One thousand pesos (P1,000.00) for each such
                                failure. Provided, however, that the aggregate
                                amount imposed for all such failures during a
                                calendar year shall not exceed Twenty-five
                                thousand pesos (P25,000.00).
                              </p>
                              <div class="wh-inline-70a45bcf825c">
                                Note: All background information must be
                                properly filled out.
                              </div>
                              <br />
                              <ul>
                                <li class="wh-inline-b5f79d38e688">
                                  The last 5 digits of the 14-digit TIN refers
                                  to the branch code
                                </li>
                                <li class="wh-inline-b5f79d38e688">
                                  All returns filed by an accredited tax agent
                                  on behalf of a taxpayer shall bear the
                                  following information:
                                </li>
                                <ol class="indent">
                                  <li class="wh-inline-b5f79d38e688">
                                    For Individual (CPAs, members of GPPs, and
                                    others)
                                  </li>
                                  <div class="wh-inline-473fbdbc85f2">
                                    a.1 Taxpayer Identification Number (TIN);
                                    and
                                  </div>
                                  <div class="wh-inline-473fbdbc85f2">
                                    a.2 BIR Accreditation Number, Date of Issue,
                                    and Date of Expiry.
                                  </div>
                                  <li class="wh-inline-b5f79d38e688">
                                    For members of the Philippine Bar (Lawyers)
                                  </li>
                                  <div class="wh-inline-473fbdbc85f2">
                                    b.1 Taxpayer Identification Number (TIN);
                                  </div>
                                  <div class="wh-inline-473fbdbc85f2">
                                    b.2 Attorney’s Roll Number;
                                  </div>
                                  <div class="wh-inline-473fbdbc85f2">
                                    b.3 Mandatory Continuing Legal Education
                                    (MCLE) Compliance Number; and
                                  </div>
                                  <div class="wh-inline-473fbdbc85f2">
                                    b.4 BIR Accreditation Number, Date of Issue,
                                    and Date of Expiry.
                                  </div>
                                </ol>
                              </ul>
                              <p class="wh-inline-39997ba1ea12">
                                <span class="wh-inline-ee2decef4dc8"
                                  >Required Attachments:
                                </span>
                                (Electronically submitted using eFPS or email to esubmission@bir.gov.ph)
                              </p>
                              <ol>
                                <li class="wh-inline-b5f79d38e688">
                                  Acknowledgement Receipt/Validation Successful
                                  message as proof of submission thru electronic
                                  attachment for eFPS or email to
                                  esubmission@bir.gov.ph of the following:
                                </li>
                                <ol class="indent">
                                  <li class="wh-inline-b5f79d38e688">
                                    Alphalist of Payees Subjected to Expanded
                                    Withholding Tax
                                  </li>
                                  <li class="wh-inline-b5f79d38e688">
                                    Alphalist of Other Payees Whose Income
                                    Payments Are Exempt from Withholding Tax but
                                    Subject to Income Tax
                                  </li>
                                </ol>
                                <li class="wh-inline-b5f79d38e688">
                                  Authorization letter, if returns is filed by
                                  an authorized representative.
                                </li>
                              </ol>
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
        <h2>BIR Form 1604Ev2018 — {continuation.title}</h2>
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
