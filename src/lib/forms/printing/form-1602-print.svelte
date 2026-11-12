<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1602:MonthEnd",
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
    "id": "frm1602:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1602:AmendedRtn1",
    "source": "frm1602:AmendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1602:AmendedRtn2",
    "source": "frm1602:AmendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1602:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1602:OptTaxWithheld1",
    "source": "frm1602:OptTaxWithheld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1602:OptTaxWithheld2",
    "source": "frm1602:OptTaxWithheld",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1602:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1602:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1602:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1602:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1602:txtRDOCode"
  },
  {
    "id": "frm1602:txtLineBus",
    "fallback": ""
  },
  {
    "id": "frm1602:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1602:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1602:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1602:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1602:OptCategoryAgent1",
    "source": "frm1602:OptCategoryAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1602:OptCategoryAgent2",
    "source": "frm1602:OptCategoryAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1602:OptSpecialTax1",
    "source": "frm1602:OptSpecialTax",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1602:OptSpecialTax2",
    "source": "frm1602:OptSpecialTax",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1602:lstSpecialTax",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty",
      "3": "Both"
    }
  },
  {
    "id": "frm1602:txtATC14",
    "fallback": "WI161"
  },
  {
    "id": "frm1602:txt14A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt14B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt14C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC15",
    "fallback": "WC161"
  },
  {
    "id": "frm1602:txt15A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt15B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt15C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC16",
    "fallback": "WI161"
  },
  {
    "id": "frm1602:txt16A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt16B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt16C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC17",
    "fallback": "WC161"
  },
  {
    "id": "frm1602:txt17A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt17B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt17C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC18",
    "fallback": "WI163"
  },
  {
    "id": "frm1602:txt18A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt18B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt18C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC19",
    "fallback": "WC163"
  },
  {
    "id": "frm1602:txt19A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt19B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt19C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC20",
    "fallback": "WI162"
  },
  {
    "id": "frm1602:txt20A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt20B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt20C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC21",
    "fallback": "WC162"
  },
  {
    "id": "frm1602:txt21A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt21B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt21C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC22",
    "fallback": "WI440"
  },
  {
    "id": "frm1602:txt22A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt22B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt22C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC22B",
    "fallback": "WI441"
  },
  {
    "id": "frm1602:txt22D",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt22E",
    "fallback": "12.00%"
  },
  {
    "id": "frm1602:txt22F",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC22C",
    "fallback": "WI442"
  },
  {
    "id": "frm1602:txt22G",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt22H",
    "fallback": "5.00%"
  },
  {
    "id": "frm1602:txt22I",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC23",
    "fallback": "WC440"
  },
  {
    "id": "frm1602:txt23A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt23B",
    "fallback": "20.00%"
  },
  {
    "id": "frm1602:txt23C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC24",
    "fallback": "WI170"
  },
  {
    "id": "frm1602:txt24A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt24B",
    "fallback": "15.00%"
  },
  {
    "id": "frm1602:txt24C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt24D",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtATC25",
    "fallback": "WC170"
  },
  {
    "id": "frm1602:txt25A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt25B",
    "fallback": "15.00%"
  },
  {
    "id": "frm1602:txt25C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt25D",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt26",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt27",
    "fallback": ""
  },
  {
    "id": "frm1602:txt27A",
    "fallback": ""
  },
  {
    "id": "frm1602:txt27B",
    "fallback": ""
  },
  {
    "id": "frm1602:txt27C",
    "fallback": ""
  },
  {
    "id": "frm1602:txt27D",
    "fallback": ""
  },
  {
    "id": "frm1602:txt28",
    "fallback": ""
  },
  {
    "id": "frm1602:txt28A",
    "fallback": ""
  },
  {
    "id": "frm1602:txt28B",
    "fallback": ""
  },
  {
    "id": "frm1602:txt28C",
    "fallback": ""
  },
  {
    "id": "frm1602:txt28D",
    "fallback": ""
  },
  {
    "id": "frm1602:txt29",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt30",
    "fallback": ""
  },
  {
    "id": "frm1602:txt30A",
    "fallback": ""
  },
  {
    "id": "frm1602:txt30B",
    "fallback": ""
  },
  {
    "id": "frm1602:txt30C",
    "fallback": ""
  },
  {
    "id": "frm1602:txt30D",
    "fallback": ""
  },
  {
    "id": "frm1602:txt31",
    "fallback": ""
  },
  {
    "id": "frm1602:txt31A",
    "fallback": ""
  },
  {
    "id": "frm1602:txt31B",
    "fallback": ""
  },
  {
    "id": "frm1602:txt31C",
    "fallback": ""
  },
  {
    "id": "frm1602:txt31D",
    "fallback": ""
  },
  {
    "id": "frm1602:txt32",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt33",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt34",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt35",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt36A",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt36B",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt36C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt36D",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txt37",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal1C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst1",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal2C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst2",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg3",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign3",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal3C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst3",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg4",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign4",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal4C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst4",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg5",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign5",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal5C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst5",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg6",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign6",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal6C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst6",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg7",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign7",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal7C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst7",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg8",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign8",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal8C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst8",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg9",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign9",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal9C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst9",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtReg10",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtForeign10",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotal10C",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtInst10",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotalA",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotalB",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotalC",
    "fallback": "0.00"
  },
  {
    "id": "frm1602:txtTotalD",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1602", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1602"
  aria-label="BIR Form 1602 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1602-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-261d4bddbba0" id="wrapper">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-cce80e921797"
      >
        <tbody
          ><tr
            ><td>
              <div id="formPaper">
                <div id="mainContent">
                  <br />
                  <div class="wh-inline-5e54d36688f3">
                    <img
                      alt="BIR form identifying mark"
                      class="wh-inline-5dfba9815e30"
                      height="86"
                      id="frm1602:header"
                      src="/legacy/img/withholding/original-f49004d827e2ff22.jpg"
                      width="780"
                    />
                  </div>
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
                            class="tblForm wh-inline-0792a8a3b1f3"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-7b33a69f16d7">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-fb3b554d5acf"
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
                                        <td>
                                          <span aria-label="MonthEnd" class="labels wh-print-select" data-field-id="frm1602:MonthEnd" data-print-control="select" id="frm1602:MonthEnd">{model.text["frm1602:MonthEnd"] ?? ""}</span>
                                          <input class="wh-source-size-4" aria-label="txtYear" data-field-id="frm1602:txtYear" data-print-control="text" data-print-value="" id="frm1602:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1602:txtYear"] ?? ""}>
                                        </td>
                                        <td> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-a31e268fc0ed">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-e3240b0d8fd4"
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
                                          <div class="wh-inline-5c8a2699196f">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="wh-inline-b3797a316b64"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="AmendedRtn1" checked={model.checks["frm1602:AmendedRtn1"] ?? false} data-field-id="frm1602:AmendedRtn1" data-print-control="radio" disabled id="frm1602:AmendedRtn1" type="radio"/><span
                                                      class="wh-inline-534e2278e92c"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="AmendedRtn2" checked={model.checks["frm1602:AmendedRtn2"] ?? false} data-field-id="frm1602:AmendedRtn2" data-print-control="radio" disabled id="frm1602:AmendedRtn2" type="radio"/><span
                                                      class="wh-inline-534e2278e92c"
                                                      >No</span
                                                    ></td
                                                  >
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-37a54156c6bf">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-10924938c746"
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
                                            >No. of Sheets Attached?</span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td> </td>
                                        <td
                                          ><input aria-label="txtSheets" class="wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1602:txtSheets" data-print-control="text" data-print-value="" id="frm1602:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1602:txtSheets"] ?? ""}></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-c7b7a70e84bf">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-c578f1aa2c22"
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
                                          <div class="wh-inline-5c8a2699196f">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="wh-inline-029318d8c751"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="OptTaxWithheld1" checked={model.checks["frm1602:OptTaxWithheld1"] ?? false} data-field-id="frm1602:OptTaxWithheld1" data-print-control="radio" disabled id="frm1602:OptTaxWithheld1" type="radio"/><span
                                                      class="wh-inline-534e2278e92c"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="OptTaxWithheld2" checked={model.checks["frm1602:OptTaxWithheld2"] ?? false} data-field-id="frm1602:OptTaxWithheld2" data-print-control="radio" disabled id="frm1602:OptTaxWithheld2" type="radio"/><span
                                                      class="wh-inline-534e2278e92c"
                                                      >No</span
                                                    ></td
                                                  >
                                                </tr>
                                              </tbody>
                                            </table>
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
                            class="tblForm wh-inline-0792a8a3b1f3"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTdPart">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-aae34c231968"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-3d4505193e62">
                                          <span class="wh-inline-dd2eceacf41a"
                                            >Part I</span
                                          ></td
                                        >
                                        <td class="wh-inline-6d422eb26fd9">
                                          <div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-7dbd70daabfc"
                                              >Background Information</span
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
                            class="tblForm wh-inline-d8a445e53bcd"
                          >
                            <tbody
                              ><tr
                                ><td class="tblFormTd wh-inline-19411c35714f">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-f548f1499298"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-15663751d502">
                                            5
                                          </span></td
                                        >
                                        <td>
                                          <span class="wh-inline-cb3a2164388b"
                                            >TIN
                                          </span>
                                          <span class="wh-inline-649b1ec8a1ed">
                                            <input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm1602:txtTIN1" data-print-control="text" data-print-value="" id="frm1602:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm1602:txtTIN1"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm1602:txtTIN2" data-print-control="text" data-print-value="" id="frm1602:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm1602:txtTIN2"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm1602:txtTIN3" data-print-control="text" data-print-value="" id="frm1602:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm1602:txtTIN3"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm1602:txtBranchCode" data-print-control="text" data-print-value="" id="frm1602:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1602:txtBranchCode"] ?? ""}>
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-2361a4600399">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-bdb59a3007a8"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-15663751d502">
                                            6
                                          </span><span
                                            class="wh-inline-cb3a2164388b"
                                            >RDO Code
                                          </span></td
                                        >
                                        <td
                                          data-field-id="rdoSelect"
                                          id="rdoSelect"
                                          >{model.text["rdoSelect"] ?? ""}</td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-ee18e890dfc1">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-6faf4bc5e775"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-15663751d502">
                                            7
                                          </span></td
                                        >
                                        <td>
                                          <span class="wh-inline-cb3a2164388b"
                                            >Line of Business/Occupation
                                          </span>
                                          <span class="wh-inline-649b1ec8a1ed">
                                            <input class="wh-source-size-31" aria-label="txtLineBus" data-field-id="frm1602:txtLineBus" data-print-control="text" data-print-value="" id="frm1602:txtLineBus" maxlength="60" readonly size="31" type="text" value={model.text["frm1602:txtLineBus"] ?? ""}>
                                          </span>
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
                                ><td class="tblFormTd wh-inline-b5bfcb1cc47d">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-6cc0b14501bd"
                                  >
                                    <tbody
                                      ><tr>
                                        <td>
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-6cc0b14501bd"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-6e606d24db7d"
                                                  ><span
                                                    class="wh-inline-4cf6c17959a7"
                                                  >
                                                    8
                                                  </span></td
                                                >
                                                <td
                                                  ><span
                                                    class="wh-inline-cb3a2164388b"
                                                    >Withholding Agent's Name
                                                    (Last Name, First Name,
                                                    Middle Name for Individuals)
                                                    /(Registered Name for
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
                                            class="wh-inline-6cc0b14501bd"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-6b6ee2d44756"
                                                >
                                                </td>
                                                <td
                                                  ><input class="wh-source-size-70" aria-label="txtTaxpayerName" data-field-id="frm1602:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1602:txtTaxpayerName" maxlength="70" readonly size="70" type="text" value={model.text["frm1602:txtTaxpayerName"] ?? ""}></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-b41f9158b2dd">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-a402e871c23b"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-7777c2f5e271"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            9
                                          </span><span
                                            class="wh-inline-cb3a2164388b"
                                            >Telephone Number</span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>
                                          <div class="wh-inline-a30033456d9a">
                                            <input class="wh-source-size-15" aria-label="txtTelNum" data-field-id="frm1602:txtTelNum" data-print-control="text" data-print-value="" id="frm1602:txtTelNum" maxlength="20" readonly size="15" type="text" value={model.text["frm1602:txtTelNum"] ?? ""}>
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
                            class="tblForm wh-inline-0792a8a3b1f3"
                          >
                            <tbody
                              ><tr
                                ><td class="tblFormTd wh-inline-c664df06286c">
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
                                                <td
                                                  class="wh-inline-6e606d24db7d"
                                                  ><span
                                                    class="wh-inline-4cf6c17959a7"
                                                  >
                                                    10
                                                  </span></td
                                                >
                                                <td
                                                  ><span
                                                    class="wh-inline-cb3a2164388b"
                                                    >Registered Address</span
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
                                            class="wh-inline-9ae2a774779b"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-6b6ee2d44756"
                                                >
                                                </td>
                                                <td
                                                  ><input class="wh-source-size-110" aria-label="txtAddress" data-field-id="frm1602:txtAddress" data-print-control="text" data-print-value="" id="frm1602:txtAddress" maxlength="150" readonly size="110" type="text" value={model.text["frm1602:txtAddress"] ?? ""}></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-96e21ef12eea">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-a481b3c71127"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-7777c2f5e271"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            11
                                          </span><span
                                            class="wh-inline-cb3a2164388b"
                                            >Zip Code</span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>
                                          <div class="wh-inline-a30033456d9a">
                                            <input class="wh-source-size-2" aria-label="txtZipCode" data-field-id="frm1602:txtZipCode" data-print-control="text" data-print-value="" id="frm1602:txtZipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1602:txtZipCode"] ?? ""}>
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
                            class="tblForm wh-inline-a62636a4c9d5"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-d252709062fc">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-5258d1db24e3"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-457aefb99927"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            12
                                          </span><span
                                            class="wh-inline-cb3a2164388b"
                                            >Category of Withholding Agent</span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>
                                          <div class="wh-inline-a30033456d9a">
                                            <fieldset
                                              class="wh-inline-57aef9050ffa"
                                              id="frm1602:j_id392"
                                            >
                                              <div
                                                class="wh-inline-5c8a2699196f"
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  class="wh-inline-b63aacdca7b1"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        ><input aria-label="OptCategoryAgent1" checked={model.checks["frm1602:OptCategoryAgent1"] ?? false} data-field-id="frm1602:OptCategoryAgent1" data-print-control="radio" disabled id="frm1602:OptCategoryAgent1" type="radio"/><span
                                                          class="wh-inline-534e2278e92c"
                                                          >Private</span
                                                        >
                                                      </td>
                                                      <td
                                                        ><input aria-label="OptCategoryAgent2" checked={model.checks["frm1602:OptCategoryAgent2"] ?? false} data-field-id="frm1602:OptCategoryAgent2" data-print-control="radio" disabled id="frm1602:OptCategoryAgent2" type="radio"/><span
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
                                <td class="tblFormTd wh-inline-b425dbcde2f7">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-96e02113eae9"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-cd46dc456c46"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            13
                                          </span><span
                                            class="wh-inline-cb3a2164388b"
                                            >Are there payees availing of tax
                                            relief under Special Law or
                                            International Tax Treaty?</span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td class="wh-inline-cd46dc456c46">
                                          <div class="wh-inline-9cb088a595d0">
                                            <fieldset
                                              class="wh-inline-515aa0d5dec5"
                                              id="frm1602:j_id398"
                                            >
                                              <div
                                                class="wh-inline-f77e37038764"
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  class="wh-inline-25e9882ec0fe"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        ><input aria-label="OptSpecialTax1" checked={model.checks["frm1602:OptSpecialTax1"] ?? false} data-field-id="frm1602:OptSpecialTax1" data-print-control="radio" disabled id="frm1602:OptSpecialTax1" type="radio"/><span
                                                          class="wh-inline-534e2278e92c"
                                                          >Yes</span
                                                        >
                                                      </td>
                                                      <td
                                                        ><input aria-label="OptSpecialTax2" checked={model.checks["frm1602:OptSpecialTax2"] ?? false} data-field-id="frm1602:OptSpecialTax2" data-print-control="radio" disabled id="frm1602:OptSpecialTax2" type="radio"/><span
                                                          class="wh-inline-534e2278e92c"
                                                          >No</span
                                                        ></td
                                                      >
                                                      <td>
                                                        <span
                                                          id="frm1602:j_id401"
                                                        >
                                                          If yes, specify</span
                                                        >
                                                        <span aria-label="lstSpecialTax" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1602:lstSpecialTax" data-print-control="select" id="frm1602:lstSpecialTax">{model.text["frm1602:lstSpecialTax"] ?? ""}</span>
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
                                    class="wh-inline-67af951bd1df"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-f5675d6f19b7">
                                          <span class="wh-inline-dd2eceacf41a"
                                            >Part II</span
                                          ></td
                                        >
                                        <td class="wh-inline-7c966751d8c4">
                                          <div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-7dbd70daabfc"
                                              >Computation of Tax</span
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
                            class="tblForm wh-inline-c8576a0abf73"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-76e792f83735"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-3ef6362bb4b4"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-cb3a2164388b"
                                                >A.</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-90dea7b38b6a"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-cb3a2164388b"
                                                >Details of Interest Payments
                                                and Tax Withheld Based on
                                                Regular Rates</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-76e792f83735"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-4bb8433cc747">
                                        </td>
                                        <td class="wh-inline-52a96afa91b3"
                                          ><span class="wh-inline-97f71f169000"
                                            >Particulars</span
                                          ></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><span class="wh-inline-97f71f169000"
                                            >ATC</span
                                          ></td
                                        >
                                        <td class="wh-inline-4bb8433cc747">
                                        </td>
                                        <td class="wh-inline-31351037be2f"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Total Interest/Yield Paid/Accrued</span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-4bb8433cc747">
                                        </td>
                                        <td class="wh-inline-d45d04df69ba"
                                          ><span class="wh-inline-97f71f169000"
                                            >Tax Rate</span
                                          ></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><span class="wh-inline-97f71f169000"
                                            >BSP Exchange Rate <br />
                                            on the date of remittance</span
                                          ></td
                                        >
                                        <td class="wh-inline-5623894625dd"
                                          ><span class="wh-inline-97f71f169000">
                                            Tax Required to be Withheld</span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >14</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Individual</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC14" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC14" data-print-control="text" data-print-value="" id="frm1602:txtATC14" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC14"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >14A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                          <div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt14A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt14A" data-print-control="text" data-print-value="" id="frm1602:txt14A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt14A"] ?? ""}>
                                          </div></td
                                        ><td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >14B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt14B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt14B" data-print-control="text" data-print-value="" id="frm1602:txt14B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt14B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                              ><b>14C</b></span
                                            ></span
                                          >
                                          <input aria-label="txt14C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt14C" data-print-control="text" data-print-value="" id="frm1602:txt14C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt14C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >15</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Corporation</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC15" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC15" data-print-control="text" data-print-value="" id="frm1602:txtATC15" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC15"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >15A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt15A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt15A" data-print-control="text" data-print-value="" id="frm1602:txt15A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt15A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >15B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt15B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt15B" data-print-control="text" data-print-value="" id="frm1602:txt15B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt15B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                              ><b>15C</b></span
                                            ></span
                                          >
                                          <input aria-label="txt15C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt15C" data-print-control="text" data-print-value="" id="frm1602:txt15C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt15C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td colspan="11"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b> Time Deposit</b></span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >16</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Individual</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC16" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC16" data-print-control="text" data-print-value="" id="frm1602:txtATC16" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC16"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >16A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt16A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt16A" data-print-control="text" data-print-value="" id="frm1602:txt16A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt16A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >16B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt16B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt16B" data-print-control="text" data-print-value="" id="frm1602:txt16B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt16B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-232ced7b40ab"
                                            ><b>16C</b></span
                                          >
                                          <input aria-label="txt16C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt16C" data-print-control="text" data-print-value="" id="frm1602:txt16C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt16C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >17</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Corporation</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC17" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC17" data-print-control="text" data-print-value="" id="frm1602:txtATC17" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC17"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >17A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt17A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt17A" data-print-control="text" data-print-value="" id="frm1602:txt17A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt17A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >17B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt17B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt17B" data-print-control="text" data-print-value="" id="frm1602:txt17B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt17B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-232ced7b40ab"
                                            ><b>17C</b></span
                                          >
                                          <input aria-label="txt17C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt17C" data-print-control="text" data-print-value="" id="frm1602:txt17C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt17C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td colspan="11"
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div>
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              ><b>Deposit Substitute/Others</b
                                              ></span
                                            >
                                          </div></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >18</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Individual</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC18" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC18" data-print-control="text" data-print-value="" id="frm1602:txtATC18" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC18"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-232ced7b40ab"
                                            ><b>18A</b></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt18A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt18A" data-print-control="text" data-print-value="" id="frm1602:txt18A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt18A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-232ced7b40ab"
                                            ><b>18B</b></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt18B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt18B" data-print-control="text" data-print-value="" id="frm1602:txt18B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt18B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                              ><b>18C</b></span
                                            ></span
                                          >
                                          <input aria-label="txt18C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt18C" data-print-control="text" data-print-value="" id="frm1602:txt18C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt18C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >19</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Corporation</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC19" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC19" data-print-control="text" data-print-value="" id="frm1602:txtATC19" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC19"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >19A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt19A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt19A" data-print-control="text" data-print-value="" id="frm1602:txt19A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt19A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >19B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt19B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt19B" data-print-control="text" data-print-value="" id="frm1602:txt19B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt19B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >19C</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt19C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt19C" data-print-control="text" data-print-value="" id="frm1602:txt19C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt19C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td colspan="11"
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div>
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              ><b>Government Securities</b
                                              ></span
                                            >
                                          </div></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >20</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Individual</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC20" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC20" data-print-control="text" data-print-value="" id="frm1602:txtATC20" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC20"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >20A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt20A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt20A" data-print-control="text" data-print-value="" id="frm1602:txt20A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt20A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >20B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt20B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt20B" data-print-control="text" data-print-value="" id="frm1602:txt20B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt20B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >20C</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt20C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt20C" data-print-control="text" data-print-value="" id="frm1602:txt20C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt20C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >21</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Corporation</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC21" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC21" data-print-control="text" data-print-value="" id="frm1602:txtATC21" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC21"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >21A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt21A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt21A" data-print-control="text" data-print-value="" id="frm1602:txt21A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt21A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >21B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt21B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt21B" data-print-control="text" data-print-value="" id="frm1602:txt21B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt21B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                              ><b>21C</b></span
                                            ></span
                                          >
                                          <input aria-label="txt21C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt21C" data-print-control="text" data-print-value="" id="frm1602:txt21C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt21C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td colspan="11"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                >Preterminated Long-term
                                                Deposits/Investments</b
                                              ></span
                                            >
                                          </div></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >22</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Individual</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC22" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC22" data-print-control="text" data-print-value="" id="frm1602:txtATC22" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC22"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                              ><b>22A</b></span
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt22A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt22A" data-print-control="text" data-print-value="" id="frm1602:txt22A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt22A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt22B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt22B" data-print-control="text" data-print-value="" id="frm1602:txt22B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt22B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22C</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt22C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt22C" data-print-control="text" data-print-value="" id="frm1602:txt22C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt22C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"></td>
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC22B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC22B" data-print-control="text" data-print-value="" id="frm1602:txtATC22B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC22B"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22D</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt22D" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt22D" data-print-control="text" data-print-value="" id="frm1602:txt22D" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt22D"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22E</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt22E" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt22E" data-print-control="text" data-print-value="" id="frm1602:txt22E" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt22E"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22F</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt22F" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt22F" data-print-control="text" data-print-value="" id="frm1602:txt22F" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt22F"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"></td>
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC22C" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC22C" data-print-control="text" data-print-value="" id="frm1602:txtATC22C" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC22C"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22G</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt22G" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt22G" data-print-control="text" data-print-value="" id="frm1602:txt22G" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt22G"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22H</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt22H" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt22H" data-print-control="text" data-print-value="" id="frm1602:txt22H" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt22H"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >22I
                                              </span></b
                                            ></span
                                          >
                                          <input aria-label="txt22I" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt22I" data-print-control="text" data-print-value="" id="frm1602:txt22I" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt22I"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >23</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Corporation</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC23" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC23" data-print-control="text" data-print-value="" id="frm1602:txtATC23" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC23"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >23A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt23A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt23A" data-print-control="text" data-print-value="" id="frm1602:txt23A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt23A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >23B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt23B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt23B" data-print-control="text" data-print-value="" id="frm1602:txt23B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt23B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                        >
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >23C</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt23C" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt23C" data-print-control="text" data-print-value="" id="frm1602:txt23C" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt23C"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td colspan="11"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              ><b>Foreign Currency Deposit</b
                                              ></span
                                            >
                                          </div></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >24</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Individual</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC24" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC24" data-print-control="text" data-print-value="" id="frm1602:txtATC24" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC24"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >24A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt24A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt24A" data-print-control="text" data-print-value="" id="frm1602:txt24A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt24A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >24B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt24B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt24B" data-print-control="text" data-print-value="" id="frm1602:txt24B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt24B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >24C
                                                  <input aria-label="txt24C" class="wh-inline-8d34e592c9dd wh-source-size-10" data-field-id="frm1602:txt24C" data-print-control="text" data-print-value="" id="frm1602:txt24C" maxlength="25" readonly size="10" type="text" value={model.text["frm1602:txt24C"] ?? ""}>
                                                </span></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >24D</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt24D" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt24D" data-print-control="text" data-print-value="" id="frm1602:txt24D" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt24D"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >25</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              >Corporation</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><input aria-label="txtATC25" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txtATC25" data-print-control="text" data-print-value="" id="frm1602:txtATC25" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txtATC25"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >25A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt25A" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt25A" data-print-control="text" data-print-value="" id="frm1602:txt25A" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt25A"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >25B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt25B" class="wh-inline-899167ead8a0 wh-source-size-7" data-field-id="frm1602:txt25B" data-print-control="text" data-print-value="" id="frm1602:txt25B" maxlength="5" readonly size="7" type="text" value={model.text["frm1602:txt25B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >25C</span
                                                ><span
                                                  class="wh-inline-97f71f169000"
                                                  ><b
                                                    ><span
                                                      class="wh-inline-6d319e71fe1f"
                                                    >
                                                      <input aria-label="txt25C" class="wh-inline-8d34e592c9dd wh-source-size-10" data-field-id="frm1602:txt25C" data-print-control="text" data-print-value="" id="frm1602:txt25C" maxlength="25" readonly size="10" type="text" value={model.text["frm1602:txt25C"] ?? ""}>
                                                    </span></b
                                                  ></span
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                >
                                                </span></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >25D</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt25D" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt25D" data-print-control="text" data-print-value="" id="frm1602:txt25D" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt25D"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >26</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="9"
                                        >
                                          <div class="wh-inline-9cb088a595d0">
                                            <span
                                              class="wh-inline-97f71f169000"
                                            >
                                              Total Tax Required to be Withheld
                                              Based on Regular Rates (Sum of
                                              Items 14C to 22C, F, I, 23C, 24D,
                                              25D)</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >26</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt26" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt26" data-print-control="text" data-print-value="" id="frm1602:txt26" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt26"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                  >B.</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="10"
                                        >
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                >Details of Interest Payment and
                                                Tax Withheld Based on Tax Treaty
                                                Rates</b
                                              ></span
                                            >
                                          </div></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Treaty Code</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><span class="wh-inline-97f71f169000"
                                            >ATC</span
                                          ></td
                                        >
                                        <td> </td>
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Total Interest</span
                                            >
                                          </div></td
                                        >
                                        <td> </td>
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Tax Rate</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Tax Required to be Withheld</span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><b>27</b></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                          <div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt27" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt27" data-print-control="text" data-print-value="" id="frm1602:txt27" maxlength="2" readonly size="5" type="text" value={model.text["frm1602:txt27"] ?? ""}>
                                          </div></td
                                        >
                                        <td class="wh-inline-dbffcadc9c4a"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >27A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-6eaafb4418a0"
                                          ><input aria-label="txt27A" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt27A" data-print-control="text" data-print-value="" id="frm1602:txt27A" maxlength="5" readonly size="5" type="text" value={model.text["frm1602:txt27A"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >27B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt27B" class="wh-inline-a2ee037606c1 wh-source-size-15" data-field-id="frm1602:txt27B" data-print-control="text" data-print-value="" id="frm1602:txt27B" maxlength="15" readonly size="15" type="text" value={model.text["frm1602:txt27B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >27C</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                          <div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt27C" class="wh-inline-a2ee037606c1 wh-source-size-3" data-field-id="frm1602:txt27C" data-print-control="text" data-print-value="" id="frm1602:txt27C" maxlength="3" readonly size="3" type="text" value={model.text["frm1602:txt27C"] ?? ""}>
                                            <span class="wh-inline-cb3a2164388b"
                                              >%</span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-6eaafb4418a0"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >27D</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-0fb026fca545"
                                          ><input aria-label="txt27D" class="wh-inline-a2ee037606c1 wh-source-size-10" data-field-id="frm1602:txt27D" data-print-control="text" data-print-value="" id="frm1602:txt27D" maxlength="12" readonly size="10" type="text" value={model.text["frm1602:txt27D"] ?? ""}></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >28</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                          <div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt28" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt28" data-print-control="text" data-print-value="" id="frm1602:txt28" maxlength="2" readonly size="5" type="text" value={model.text["frm1602:txt28"] ?? ""}>
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >28A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><input aria-label="txt28A" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt28A" data-print-control="text" data-print-value="" id="frm1602:txt28A" maxlength="5" readonly size="5" type="text" value={model.text["frm1602:txt28A"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >28B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt28B" class="wh-inline-a2ee037606c1 wh-source-size-15" data-field-id="frm1602:txt28B" data-print-control="text" data-print-value="" id="frm1602:txt28B" maxlength="15" readonly size="15" type="text" value={model.text["frm1602:txt28B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >28C</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                          <div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt28C" class="wh-inline-a2ee037606c1 wh-source-size-3" data-field-id="frm1602:txt28C" data-print-control="text" data-print-value="" id="frm1602:txt28C" maxlength="3" readonly size="3" type="text" value={model.text["frm1602:txt28C"] ?? ""}>
                                            <span class="wh-inline-cb3a2164388b"
                                              >%</span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >28D</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><input aria-label="txt28D" class="wh-inline-a2ee037606c1 wh-source-size-10" data-field-id="frm1602:txt28D" data-print-control="text" data-print-value="" id="frm1602:txt28D" maxlength="12" readonly size="10" type="text" value={model.text["frm1602:txt28D"] ?? ""}></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-6d319e71fe1f"
                                              ><b
                                                ><span
                                                  class="wh-inline-511fb66ceecf"
                                                  >29</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="9"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-6d319e71fe1f"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  ><span
                                                    class="wh-inline-97f71f169000"
                                                    >Total Tax Required to be
                                                    Withheld Based on Tax Treaty
                                                    Rates (Sum of Items 27D to
                                                    28D)</span
                                                  ></span
                                                >
                                              </b></span
                                            > <a id="btnSectionB">Section B </a>
                                          </div>
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >29</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt29" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt29" data-print-control="text" data-print-value="" id="frm1602:txt29" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt29"] ?? ""}>
                                          <span class="wh-inline-6d319e71fe1f">
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                  >C.</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="10"
                                        >
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                >Details of Interest Payment to
                                                Taxpayers enjoying Preferential
                                                Rates (i.e. PEZA Registered
                                                Enterprises)</b
                                              ></span
                                            >
                                          </div>
                                          <div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Treaty Code</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><span class="wh-inline-97f71f169000"
                                            >ATC</span
                                          ></td
                                        >
                                        <td> </td>
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Total Interest</span
                                            >
                                          </div></td
                                        >
                                        <td> </td>
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Tax Rate</span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="2"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              >Tax Required to be Withheld</span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >30</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                          <div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt30" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt30" data-print-control="text" data-print-value="" id="frm1602:txt30" maxlength="2" readonly size="5" type="text" value={model.text["frm1602:txt30"] ?? ""}>
                                          </div></td
                                        >
                                        <td class="wh-inline-dbffcadc9c4a"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >30A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-6eaafb4418a0"
                                          ><input aria-label="txt30A" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt30A" data-print-control="text" data-print-value="" id="frm1602:txt30A" maxlength="5" readonly size="5" type="text" value={model.text["frm1602:txt30A"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >30B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt30B" class="wh-inline-a2ee037606c1 wh-source-size-15" data-field-id="frm1602:txt30B" data-print-control="text" data-print-value="" id="frm1602:txt30B" maxlength="15" readonly size="15" type="text" value={model.text["frm1602:txt30B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >30C</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt30C" class="wh-inline-a2ee037606c1 wh-source-size-3" data-field-id="frm1602:txt30C" data-print-control="text" data-print-value="" id="frm1602:txt30C" maxlength="6" readonly size="3" type="text" value={model.text["frm1602:txt30C"] ?? ""}>
                                            <span class="wh-inline-cb3a2164388b"
                                              >%</span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-6eaafb4418a0"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >30D</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-0fb026fca545"
                                          ><input aria-label="txt30D" class="wh-inline-a2ee037606c1 wh-source-size-10" data-field-id="frm1602:txt30D" data-print-control="text" data-print-value="" id="frm1602:txt30D" maxlength="12" readonly size="10" type="text" value={model.text["frm1602:txt30D"] ?? ""}></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >31</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                          <div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt31" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt31" data-print-control="text" data-print-value="" id="frm1602:txt31" maxlength="2" readonly size="5" type="text" value={model.text["frm1602:txt31"] ?? ""}>
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >31A</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><input aria-label="txt31A" class="wh-inline-a2ee037606c1 wh-source-size-5" data-field-id="frm1602:txt31A" data-print-control="text" data-print-value="" id="frm1602:txt31A" maxlength="5" readonly size="5" type="text" value={model.text["frm1602:txt31A"] ?? ""}></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >31B</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-9cb088a595d0">
                                            <input aria-label="txt31B" class="wh-inline-a2ee037606c1 wh-source-size-15" data-field-id="frm1602:txt31B" data-print-control="text" data-print-value="" id="frm1602:txt31B" maxlength="15" readonly size="15" type="text" value={model.text["frm1602:txt31B"] ?? ""}>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >31C</span
                                              ></b
                                            ></span
                                          ></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <input aria-label="txt31C" class="wh-inline-a2ee037606c1 wh-source-size-3" data-field-id="frm1602:txt31C" data-print-control="text" data-print-value="" id="frm1602:txt31C" maxlength="6" readonly size="3" type="text" value={model.text["frm1602:txt31C"] ?? ""}>
                                            <span class="wh-inline-cb3a2164388b"
                                              >%</span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >31D</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c"
                                          ><input aria-label="txt31D" class="wh-inline-a2ee037606c1 wh-source-size-10" data-field-id="frm1602:txt31D" data-print-control="text" data-print-value="" id="frm1602:txt31D" maxlength="12" readonly size="10" type="text" value={model.text["frm1602:txt31D"] ?? ""}></td
                                        >
                                        <td class="wh-inline-bd4c5b120d8c">
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  >32</span
                                                ></b
                                              ></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="9"
                                        >
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-6d319e71fe1f"
                                              ><b
                                                ><span
                                                  class="wh-inline-6d319e71fe1f"
                                                  ><span
                                                    class="wh-inline-97f71f169000"
                                                    >Total Tax Required to be
                                                    Withheld Based on
                                                    Preferential Rates (Sum of
                                                    Items 30D to 31D)</span
                                                  ></span
                                                >
                                              </b>
                                            </span>
                                            <a id="btnSectionC">Section C</a>
                                          </div>
                                        </td>
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >32</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt32" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt32" data-print-control="text" data-print-value="" id="frm1602:txt32" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt32"] ?? ""}>
                                          <span class="wh-inline-6d319e71fe1f">
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><b>33</b></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="9"
                                        >
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><span
                                                class="wh-inline-cb3a2164388b"
                                                >Total (Sum of Items 26, 29
                                                &amp; 32)</span
                                              ></span
                                            >
                                          </div>
                                          <div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >33</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt33" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt33" data-print-control="text" data-print-value="" id="frm1602:txt33" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt33"] ?? ""}>
                                          <span class="wh-inline-6d319e71fe1f">
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><b>34</b></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="9"
                                        >
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><span
                                                class="wh-inline-cb3a2164388b"
                                                >Less : Tax Remitted In Return
                                                Previously Filed, if this is an
                                                Amended Return</span
                                              ></span
                                            >
                                          </div>
                                          <div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >34</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt34" class="wh-inline-8d34e592c9dd wh-source-size-16" data-field-id="frm1602:txt34" data-print-control="text" data-print-value="" id="frm1602:txt34" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt34"] ?? ""}>
                                          <span class="wh-inline-6d319e71fe1f">
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><b>35</b></span
                                            >
                                          </div></td
                                        >
                                        <td
                                          class="wh-inline-bd4c5b120d8c"
                                          colspan="9"
                                        >
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><span
                                                class="wh-inline-cb3a2164388b"
                                                >Tax Still Due/(Overremittance)</span
                                              ></span
                                            >
                                          </div>
                                          <div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >35</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt35" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt35" data-print-control="text" data-print-value="" id="frm1602:txt35" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt35"] ?? ""}>
                                          <span class="wh-inline-6d319e71fe1f">
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td colspan="10"
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div>
                                          <div class="wh-inline-9cb088a595d0">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="wh-inline-ff387f3fe73f"
                                            >
                                              <tbody
                                                ><tr>
                                                  <td
                                                    class="wh-inline-09f8b48ee243"
                                                    ><span
                                                      class="wh-inline-6d319e71fe1f"
                                                      ><b
                                                        ><span
                                                          class="wh-inline-511fb66ceecf"
                                                          >36</span
                                                        ></b
                                                      ></span
                                                    >
                                                    <span
                                                      class="wh-inline-6d319e71fe1f"
                                                      ><span
                                                        class="wh-inline-cb3a2164388b"
                                                        ><span
                                                          class="wh-inline-511fb66ceecf"
                                                          >Add: Penalties</span
                                                        ></span
                                                      ></span
                                                    ></td
                                                  >
                                                  <td
                                                    class="wh-inline-9f6aeb57750c"
                                                    ><div
                                                      class="wh-inline-a30033456d9a"
                                                    >
                                                      <span
                                                        class="wh-inline-97f71f169000"
                                                        >Surcharge</span
                                                      >
                                                    </div></td
                                                  >
                                                  <td
                                                    class="wh-inline-80c99a796975"
                                                    ><div
                                                      class="wh-inline-a30033456d9a"
                                                    >
                                                      <span
                                                        class="wh-inline-97f71f169000"
                                                        >Interest</span
                                                      >
                                                    </div></td
                                                  >
                                                  <td
                                                    class="wh-inline-4ed773e4ebb0"
                                                    ><div
                                                      class="wh-inline-a30033456d9a"
                                                    >
                                                      <span
                                                        class="wh-inline-97f71f169000"
                                                        >Compromise</span
                                                      >
                                                    </div></td
                                                  >
                                                </tr>
                                                <tr>
                                                  <td
                                                    class="wh-inline-09f8b48ee243"
                                                  >
                                                  </td>
                                                  <td
                                                    class="wh-inline-f26654323d67"
                                                    ><div
                                                      class="wh-inline-a30033456d9a"
                                                    >
                                                      <span
                                                        class="wh-inline-6d319e71fe1f"
                                                        ><b
                                                          ><span
                                                            class="wh-inline-511fb66ceecf"
                                                            >36A</span
                                                          ></b
                                                        >
                                                        <input aria-label="txt36A" class="wh-inline-8d34e592c9dd wh-source-size-15" data-field-id="frm1602:txt36A" data-print-control="text" data-print-value="" id="frm1602:txt36A" maxlength="25" readonly size="15" type="text" value={model.text["frm1602:txt36A"] ?? ""}>
                                                      </span>
                                                    </div>
                                                  </td>
                                                  <td
                                                    class="wh-inline-efa0cd7bdf9f"
                                                    ><div
                                                      class="wh-inline-a30033456d9a"
                                                    >
                                                      <span
                                                        class="wh-inline-6d319e71fe1f"
                                                        ><b
                                                          ><span
                                                            class="wh-inline-511fb66ceecf"
                                                            >36B</span
                                                          ></b
                                                        ></span
                                                      >
                                                      <span
                                                        class="wh-inline-cb3a2164388b"
                                                      >
                                                        <input aria-label="txt36B" class="wh-inline-8d34e592c9dd wh-source-size-15" data-field-id="frm1602:txt36B" data-print-control="text" data-print-value="" id="frm1602:txt36B" maxlength="25" readonly size="15" type="text" value={model.text["frm1602:txt36B"] ?? ""}>
                                                      </span>
                                                    </div></td
                                                  >
                                                  <td
                                                    class="wh-inline-79b217b8a25a"
                                                    ><div
                                                      class="wh-inline-a30033456d9a"
                                                    >
                                                      <span
                                                        class="wh-inline-6d319e71fe1f"
                                                        ><b
                                                          ><span
                                                            class="wh-inline-511fb66ceecf"
                                                            >36C</span
                                                          ></b
                                                        ></span
                                                      >
                                                      <span
                                                        class="wh-inline-cb3a2164388b"
                                                      >
                                                        <input aria-label="txt36C" class="wh-inline-8d34e592c9dd wh-source-size-15" data-field-id="frm1602:txt36C" data-print-control="text" data-print-value="" id="frm1602:txt36C" maxlength="25" readonly size="15" type="text" value={model.text["frm1602:txt36C"] ?? ""}>
                                                      </span>
                                                    </div></td
                                                  >
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >36D</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt36D" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt36D" data-print-control="text" data-print-value="" id="frm1602:txt36D" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt36D"] ?? ""}>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td colspan="10"
                                          ><div
                                            class="wh-inline-a30033456d9a"
                                          ></div>
                                          <div class="wh-inline-9cb088a595d0">
                                            <span class="wh-inline-232ced7b40ab"
                                              ><b>37</b></span
                                            >
                                            <span class="wh-inline-97f71f169000"
                                              >Total Amount Still
                                              Due/(Overremittance) (Sum of Items
                                              35 &amp; 36D)</span
                                            >
                                            <span
                                              class="wh-inline-232ced7b40ab"
                                            >
                                            </span>
                                          </div>
                                          <div
                                            class="wh-inline-a30033456d9a"
                                          ></div></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-6d319e71fe1f"
                                                >37</span
                                              ></b
                                            ></span
                                          >
                                          <input aria-label="txt37" class="wh-inline-a2ee037606c1 wh-source-size-16" data-field-id="frm1602:txt37" data-print-control="text" data-print-value="" id="frm1602:txt37" maxlength="25" readonly size="16" type="text" value={model.text["frm1602:txt37"] ?? ""}>
                                          <span class="wh-inline-6d319e71fe1f">
                                          </span></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                  <div class="imgClass wh-inline-4817332da3ff">
                                    <table class="wh-inline-2cb8f6929cbe">
                                      <tbody
                                        ><tr>
                                          <td colspan="2"
                                            >I declare, under the penalties of
                                            perjury, that this return has been
                                            made in good faith, verified by me,
                                            and to the best of my knowledge and
                                            belief,
                                            <br />is true and correct, pursuant
                                            to the provisions of the National
                                            Internal Revenue Code, as amended,
                                            and the regulations issued under
                                            authority thereof.</td
                                          >
                                        </tr>
                                        <tr>
                                          <td
                                            ><b>38</b
                                            >__________________________________________
                                            <br />Signature over Printed Name of
                                            Taxpayer/
                                            <br />Taxpayer Authorized
                                            Representative</td
                                          >
                                          <td
                                            ><b>39</b
                                            >__________________________________________
                                            <br />Title/Position of the
                                            Signatory
                                            <br />
                                          </td>
                                        </tr>
                                        <tr>
                                          <td
                                            >__________________________________________
                                            <br />TIN of Tax Agent (if
                                            applicable)<br /></td
                                          >
                                          <td
                                            >__________________________________________
                                            <br />Tax Agent Accreditation No.
                                            (if applicable)<br /></td
                                          >
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div class="imgClass wh-inline-4817332da3ff">
                                    <img
                                      alt="BIR form identifying mark"
                                      class="wh-inline-5dfba9815e30"
                                      id="frm1602:jurat"
                                      src="/legacy/img/withholding/original-7713769eea6cc196.jpg"
                                      width="784"
                                    />
                                  </div>
                                  <div class="imgClass wh-inline-4817332da3ff">
                                    <table class="wh-inline-446e9434da04">
                                      <tbody
                                        ><tr>
                                          <td
                                            >Machine Validation/Revenue Official
                                            Receipt Details (If not filed with
                                            the bank)<br /><br /><br /><br /><br
                                            /><br /><br /><br /><br /></td
                                          >
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
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
              <br class="wh-inline-46067d4310d6" />
              <br /></td
            >
            <td class="wh-inline-3709648fafb2"
              ><img
                alt="BIR form identifying mark"
                id="frm1602:bcsImg"
                src="/legacy/img/withholding/original-b68774359549f254.jpg"
              /></td
            >
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1602-2"
    data-source-page="2"
  >
    <div class="wh-inline-e8ed64de3156" id="sched1Div1602">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-b1890878648f"
      >
        <tbody
          ><tr>
            <td class="wh-inline-b6bb3eceb96b" colspan="2">
              <hr class="wh-inline-5dfba9815e30" />
            </td>
          </tr>
          <tr>
            <td class="wh-inline-2d8e0b13e82f"
              ><span class="wh-inline-97f71f169000"
                ><b><span class="wh-inline-cb3a2164388b">Schedule 1</span></b
                ></span
              ></td
            >
            <td class="wh-inline-e610c83f76b7"
              ><span class="wh-inline-97f71f169000"
                ><b
                  ><span class="wh-inline-cb3a2164388b"
                    >Summary of Interest/Yield Paid and Accrued for the Month</span
                  ></b
                ></span
              ></td
            >
          </tr>
          <tr>
            <td class="wh-inline-b6bb3eceb96b" colspan="2">
              <hr class="wh-inline-5dfba9815e30" />
            </td>
          </tr>
          <tr>
            <td colspan="2"
              ><table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-b1890878648f"
              >
                <tbody
                  ><tr>
                    <td colspan="2" rowspan="2"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          ><b>PARTICULARS</b></span
                        >
                      </div></td
                    >
                    <td colspan="3"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"><b>BANKS</b></span>
                      </div></td
                    >
                    <td class="wh-inline-eb9f896c6842" rowspan="2"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          ><b
                            >Institutions<br />
                            Other than Banks<br /></b
                          ></span
                        >
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-5c688d438f95"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >Regular<br />
                          Banking Unit<br /></span
                        >
                      </div></td
                    >
                    <td class="wh-inline-0c4ea62542fe"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000"
                          >Foreign Currency<br />
                          Deposit Unit<br /></span
                        >
                      </div></td
                    >
                    <td class="wh-inline-020751d90ce2"
                      ><div class="wh-inline-a30033456d9a">
                        <span class="wh-inline-97f71f169000">Total</span>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td colspan="6"
                      ><span class="wh-inline-97f71f169000">1 On</span>
                      <span class="wh-inline-97f71f169000"
                        >Deposit Liabilities</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td class="wh-inline-149f36d2e133"> </td>
                    <td class="wh-inline-3476ba68144e"
                      ><span class="wh-inline-97f71f169000">Taxable</span></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg1" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg1" data-print-control="text" data-print-value="" id="frm1602:txtReg1" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg1"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign1" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign1" data-print-control="text" data-print-value="" id="frm1602:txtForeign1" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign1"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal1C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal1C" data-print-control="text" data-print-value="" id="frm1602:txtTotal1C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal1C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst1" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst1" data-print-control="text" data-print-value="" id="frm1602:txtInst1" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst1"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td><span class="wh-inline-97f71f169000">Exempt</span></td>
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg2" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg2" data-print-control="text" data-print-value="" id="frm1602:txtReg2" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg2"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign2" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign2" data-print-control="text" data-print-value="" id="frm1602:txtForeign2" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign2"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal2C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal2C" data-print-control="text" data-print-value="" id="frm1602:txtTotal2C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal2C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst2" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst2" data-print-control="text" data-print-value="" id="frm1602:txtInst2" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst2"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td colspan="6"
                      ><span class="wh-inline-97f71f169000">2 On</span>
                      <span class="wh-inline-97f71f169000"
                        >Bills Payables/Borrowed Funds</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td><span class="wh-inline-97f71f169000">Taxable</span></td>
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg3" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg3" data-print-control="text" data-print-value="" id="frm1602:txtReg3" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg3"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign3" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign3" data-print-control="text" data-print-value="" id="frm1602:txtForeign3" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign3"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal3C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal3C" data-print-control="text" data-print-value="" id="frm1602:txtTotal3C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal3C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst3" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst3" data-print-control="text" data-print-value="" id="frm1602:txtInst3" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst3"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td><span class="wh-inline-97f71f169000">Exempt</span></td>
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg4" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg4" data-print-control="text" data-print-value="" id="frm1602:txtReg4" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg4"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign4" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign4" data-print-control="text" data-print-value="" id="frm1602:txtForeign4" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign4"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal4C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal4C" data-print-control="text" data-print-value="" id="frm1602:txtTotal4C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal4C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst4" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst4" data-print-control="text" data-print-value="" id="frm1602:txtInst4" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst4"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td colspan="6"
                      ><span class="wh-inline-97f71f169000">3 Long</span>
                      <span class="wh-inline-97f71f169000"
                        >Term Deposit on Investment</span
                      ></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td
                      ><span class="wh-inline-97f71f169000"
                        >Four (4) years to less than five (5) years</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg5" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg5" data-print-control="text" data-print-value="" id="frm1602:txtReg5" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg5"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign5" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign5" data-print-control="text" data-print-value="" id="frm1602:txtForeign5" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign5"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal5C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal5C" data-print-control="text" data-print-value="" id="frm1602:txtTotal5C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal5C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst5" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst5" data-print-control="text" data-print-value="" id="frm1602:txtInst5" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst5"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td
                      ><span class="wh-inline-97f71f169000"
                        >Three (3) years to less than four (4) years</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg6" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg6" data-print-control="text" data-print-value="" id="frm1602:txtReg6" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg6"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign6" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign6" data-print-control="text" data-print-value="" id="frm1602:txtForeign6" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign6"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal6C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal6C" data-print-control="text" data-print-value="" id="frm1602:txtTotal6C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal6C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst6" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst6" data-print-control="text" data-print-value="" id="frm1602:txtInst6" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst6"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td
                      ><span class="wh-inline-97f71f169000"
                        >Less than threee (3) years</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg7" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg7" data-print-control="text" data-print-value="" id="frm1602:txtReg7" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg7"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign7" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign7" data-print-control="text" data-print-value="" id="frm1602:txtForeign7" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign7"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal7C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal7C" data-print-control="text" data-print-value="" id="frm1602:txtTotal7C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal7C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst7" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst7" data-print-control="text" data-print-value="" id="frm1602:txtInst7" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst7"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td><span class="wh-inline-97f71f169000">Exempt</span></td>
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg8" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg8" data-print-control="text" data-print-value="" id="frm1602:txtReg8" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg8"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign8" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign8" data-print-control="text" data-print-value="" id="frm1602:txtForeign8" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign8"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal8C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal8C" data-print-control="text" data-print-value="" id="frm1602:txtTotal8C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal8C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst8" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst8" data-print-control="text" data-print-value="" id="frm1602:txtInst8" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst8"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td colspan="6"
                      ><span class="wh-inline-97f71f169000">4 Others</span></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td><span class="wh-inline-97f71f169000">Taxable</span></td>
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg9" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg9" data-print-control="text" data-print-value="" id="frm1602:txtReg9" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg9"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign9" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign9" data-print-control="text" data-print-value="" id="frm1602:txtForeign9" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign9"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal9C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal9C" data-print-control="text" data-print-value="" id="frm1602:txtTotal9C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal9C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst9" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst9" data-print-control="text" data-print-value="" id="frm1602:txtInst9" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst9"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td> </td>
                    <td><span class="wh-inline-97f71f169000">Exempt</span></td>
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtReg10" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtReg10" data-print-control="text" data-print-value="" id="frm1602:txtReg10" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtReg10"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtForeign10" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtForeign10" data-print-control="text" data-print-value="" id="frm1602:txtForeign10" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtForeign10"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotal10C" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotal10C" data-print-control="text" data-print-value="" id="frm1602:txtTotal10C" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotal10C"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtInst10" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1602:txtInst10" data-print-control="text" data-print-value="" id="frm1602:txtInst10" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtInst10"] ?? ""}>
                      </div></td
                    >
                  </tr>
                  <tr>
                    <td colspan="2"
                      ><span class="wh-inline-97f71f169000"
                        >Total Interest Expense per Books/FS</span
                      ></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotalA" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotalA" data-print-control="text" data-print-value="" id="frm1602:txtTotalA" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotalA"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotalB" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotalB" data-print-control="text" data-print-value="" id="frm1602:txtTotalB" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotalB"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotalC" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotalC" data-print-control="text" data-print-value="" id="frm1602:txtTotalC" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotalC"] ?? ""}>
                      </div></td
                    >
                    <td
                      ><div class="wh-inline-a30033456d9a">
                        <input aria-label="txtTotalD" class="wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1602:txtTotalD" data-print-control="text" data-print-value="" id="frm1602:txtTotalD" maxlength="25" readonly size="17" type="text" value={model.text["frm1602:txtTotalD"] ?? ""}>
                      </div></td
                    >
                  </tr>
                </tbody>
              </table></td
            >
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  {#each model.continuations as continuation (continuation.id)}
    <div
      class="withholding-print-page-content wh-continuation-page"
      data-source-page="continuation"
    >
      <section class="original-continuation withholding-print-continuation">
        <h2>BIR Form 1602 — {continuation.title}</h2>
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
