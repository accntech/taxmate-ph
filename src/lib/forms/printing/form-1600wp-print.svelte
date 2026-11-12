<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1600WP:DateWithholdingMonth",
    "fallback": ""
  },
  {
    "id": "frm1600WP:DateWithholdingDay",
    "fallback": ""
  },
  {
    "id": "frm1600WP:DateWithholdingYear",
    "fallback": ""
  },
  {
    "id": "frm1600WP:DateWithholdingToMonth",
    "fallback": ""
  },
  {
    "id": "frm1600WP:DateWithholdingToDay",
    "fallback": ""
  },
  {
    "id": "frm1600WP:DateWithholdingToYear",
    "fallback": ""
  },
  {
    "id": "frm1600WP:AmendedReturn_1",
    "source": "frm1600WP:AmendedReturn1",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600WP:AmendedReturn_2",
    "source": "frm1600WP:AmendedReturn1",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1600WP:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1600WP:AnyTaxHeld_1",
    "source": "frm1600WP:AnyTaxHeld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600WP:AnyTaxHeld_2",
    "source": "frm1600WP:AnyTaxHeld",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1600WP:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1600WP:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1600WP:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1600WP:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1600WP:txtRDOCode"
  },
  {
    "id": "frm1600WP:CategoryAgent_P",
    "source": "frm1600WP:CategoryAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1600WP:CategoryAgent_G",
    "source": "frm1600WP:CategoryAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1600WP:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1600WP:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1600WP:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1600WP:SpecialLaw_1",
    "source": "frm1600WP:SpecialLaw",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600WP:SpecialLaw_2",
    "source": "frm1600WP:SpecialLaw",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1600WP:SpecialLawSelect",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax\nTreaty"
    }
  },
  {
    "id": "frm1600WP:txtTax12",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:txtTax13",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:txtTax14",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:txtTax15A",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:txtTax15B",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:txtTax15C",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:txtTax15D",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:txtTax16",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin1",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname1",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode1",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment1",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount1",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent1",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin2",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname2",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode2",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment2",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount2",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent2",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin3",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname3",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode3",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment3",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount3",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent3",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin4",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname4",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode4",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment4",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount4",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent4",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin5",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname5",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode5",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment5",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount5",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent5",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin6",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname6",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode6",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment6",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount6",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent6",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld6",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin7",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname7",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode7",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment7",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount7",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent7",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld7",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin8",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname8",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode8",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment8",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount8",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent8",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld8",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin9",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname9",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode9",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment9",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount9",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent9",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld9",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:txtTin10",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtFullname10",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:drpAtcCode10",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:naturePayment10",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:amount10",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:txtRatePercent10",
    "fallback": ""
  },
  {
    "id": "frm1600WP:dtSched:taxWithheld10",
    "fallback": "0.00"
  },
  {
    "id": "frm1600WP:dtSched:TotaltaxWithheld",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1600WP", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1600WP"
  aria-label="BIR Form 1600WP print preview"
>
  <div
    class="withholding-print-page-content wh-page-1600wp-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-5bbf640ad348" id="wrapper">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-3d107ba1562e"
      >
        <tbody
          ><tr
            ><td>
              <div id="formPaper">
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="wh-inline-aa50be150721"
                >
                  <tbody>
                    <tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="wh-inline-e44e98fb6eb8"
                        >
                          <tbody
                            ><tr>
                              <td class="wh-inline-c94d939e61dc"
                                ><p>
                                  <img
                                    alt="birlogo"
                                    class="wh-inline-0c0d8c42d652"
                                    height="49"
                                    src="/legacy/img/withholding/original-1d5df704be8f0f62.gif"
                                    width="51"
                                  />
                                </p></td
                              >
                              <td class="wh-inline-0ce8da9bfb65">
                                <span class="wh-inline-429482632af7"
                                  >Republika ng Pilipinas
                                  <br />Kagawaran ng Pananalapi
                                  <br />Kawanihan ng Rentas Internas</span
                                >
                              </td>
                              <td class="wh-inline-e3d8c3c0e17b">
                                <span class="wh-inline-1b29e9eb50ae"
                                  >Remittance Return of Percentage<br />Tax on
                                  Winnings and Prizes<br />Withheld by Race
                                  Track Operators</span
                                >
                              </td>
                              <td class="wh-inline-17b28d4523d2">
                                <span class="wh-inline-429482632af7"
                                  >BIR Form No.<br /></span
                                >
                                <span class="wh-inline-c1d61ad77e0f"
                                  >1600-WP<br /></span
                                >
                                <span class="wh-inline-429482632af7"
                                  >January 2010 (ENCS)</span
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTd wh-inline-d4928a7f8919">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-1f558151beea"
                                >
                                  <tbody class="wh-inline-afe9c6ec456f">
                                    <tr>
                                      <td
                                        ><span class="wh-inline-3d3a68672c3c">
                                          1
                                        </span></td
                                      >
                                      <td colspan="2"
                                        ><span class="wh-inline-cb3a2164388b"
                                          >Date of Withholding (MM/DD/YYYY)</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td class="wh-inline-6e7a6059caa6">
                                        From <input class="wh-source-size-1" aria-label="DateWithholdingMonth" data-field-id="frm1600WP:DateWithholdingMonth" data-print-control="text" data-print-value="" id="frm1600WP:DateWithholdingMonth" maxlength="2" readonly size="1" type="text" value={model.text["frm1600WP:DateWithholdingMonth"] ?? ""}>
                                        <input class="wh-source-size-1" aria-label="DateWithholdingDay" data-field-id="frm1600WP:DateWithholdingDay" data-print-control="text" data-print-value="" id="frm1600WP:DateWithholdingDay" maxlength="2" readonly size="1" type="text" value={model.text["frm1600WP:DateWithholdingDay"] ?? ""}>
                                        <input class="wh-source-size-2" aria-label="DateWithholdingYear" data-field-id="frm1600WP:DateWithholdingYear" data-print-control="text" data-print-value="" id="frm1600WP:DateWithholdingYear" maxlength="4" readonly size="2" type="text" value={model.text["frm1600WP:DateWithholdingYear"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-6e7a6059caa6">
                                        To  <input class="wh-source-size-1" aria-label="DateWithholdingToMonth" data-field-id="frm1600WP:DateWithholdingToMonth" data-print-control="text" data-print-value="" id="frm1600WP:DateWithholdingToMonth" maxlength="2" readonly size="1" type="text" value={model.text["frm1600WP:DateWithholdingToMonth"] ?? ""}>
                                        <input class="wh-source-size-1" aria-label="DateWithholdingToDay" data-field-id="frm1600WP:DateWithholdingToDay" data-print-control="text" data-print-value="" id="frm1600WP:DateWithholdingToDay" maxlength="2" readonly size="1" type="text" value={model.text["frm1600WP:DateWithholdingToDay"] ?? ""}>
                                        <input class="wh-source-size-2" aria-label="DateWithholdingToYear" data-field-id="frm1600WP:DateWithholdingToYear" data-print-control="text" data-print-value="" id="frm1600WP:DateWithholdingToYear" maxlength="4" readonly size="2" type="text" value={model.text["frm1600WP:DateWithholdingToYear"] ?? ""}>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-2b9773fff6d4">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-12b3b55370ba"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-6e606d24db7d"
                                        ><span class="wh-inline-3d3a68672c3c">
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
                                          id="frm1600WP:j_id217"
                                        >
                                          <div class="wh-inline-21bb1b004c5b">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="iceSelOneRb-dis fieldText1-dis wh-inline-2ddf33eef4c7"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="AmendedReturn_1" checked={model.checks["frm1600WP:AmendedReturn_1"] ?? false} data-field-id="frm1600WP:AmendedReturn_1" data-print-control="radio" disabled id="frm1600WP:AmendedReturn_1" type="radio"/><span
                                                      class="wh-inline-29f23e97af51"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="AmendedReturn_2" checked={model.checks["frm1600WP:AmendedReturn_2"] ?? false} data-field-id="frm1600WP:AmendedReturn_2" data-print-control="radio" disabled id="frm1600WP:AmendedReturn_2" type="radio"/><span
                                                      class="wh-inline-29f23e97af51"
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
                              <td class="tblFormTd wh-inline-d7e46796d3a1">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-f7e2aaae83a3"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-6e606d24db7d"
                                        ><span class="wh-inline-3d3a68672c3c">
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
                                        ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1600WP:txtSheets" data-print-control="text" data-print-value="" id="frm1600WP:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1600WP:txtSheets"] ?? ""}></td
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
                                  class="wh-inline-bd4f7a148968"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-6e606d24db7d"
                                        ><span class="wh-inline-3d3a68672c3c">
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
                                          id="frm1600WP:j_id252"
                                        >
                                          <div class="wh-inline-21bb1b004c5b">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="wh-inline-aa490163b861"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="AnyTaxHeld_1" checked={model.checks["frm1600WP:AnyTaxHeld_1"] ?? false} data-field-id="frm1600WP:AnyTaxHeld_1" data-print-control="radio" disabled id="frm1600WP:AnyTaxHeld_1" type="radio"/><span
                                                      class="wh-inline-29f23e97af51"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="AnyTaxHeld_2" checked={model.checks["frm1600WP:AnyTaxHeld_2"] ?? false} data-field-id="frm1600WP:AnyTaxHeld_2" data-print-control="radio" disabled id="frm1600WP:AnyTaxHeld_2" type="radio"/><span
                                                      class="wh-inline-29f23e97af51"
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTdPart">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-a0c744a6c827"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-2bf0f868d38c">
                                        <span class="wh-inline-3d3a68672c3c"
                                          >Part I</span
                                        ></td
                                      >
                                      <td class="wh-inline-79f7ff9a20ed">
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-ea31ef5fe7a0"
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTd wh-inline-6c48a8c4c00c">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-caafc407c73c"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-6e606d24db7d"
                                        ><span class="wh-inline-3d3a68672c3c">
                                          5
                                        </span></td
                                      >
                                      <td>
                                        <span class="wh-inline-cb3a2164388b"
                                          >TIN
                                        </span>
                                        <span class="wh-inline-649b1ec8a1ed">
                                          <input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm1600WP:txtTIN1" data-print-control="text" data-print-value="" id="frm1600WP:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm1600WP:txtTIN1"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm1600WP:txtTIN2" data-print-control="text" data-print-value="" id="frm1600WP:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm1600WP:txtTIN2"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm1600WP:txtTIN3" data-print-control="text" data-print-value="" id="frm1600WP:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm1600WP:txtTIN3"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm1600WP:txtBranchCode" data-print-control="text" data-print-value="" id="frm1600WP:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1600WP:txtBranchCode"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-960fafcbc7b8">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-908f92456cca"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-6e606d24db7d"
                                        ><span class="wh-inline-3d3a68672c3c">
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
                              <td class="tblFormTd wh-inline-28106dbdf62d">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-fef9e50104ea"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-37ea6041f531"
                                        ><span class="wh-inline-3d3a68672c3c">
                                          7
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
                                            class="iceSelOneRb fieldText1 wh-inline-3c077a66fcca"
                                            id="frm1600WP:j_id392"
                                          >
                                            <div class="wh-inline-21bb1b004c5b">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb fieldText1 wh-inline-b63aacdca7b1"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      ><input aria-label="CategoryAgent_P" checked={model.checks["frm1600WP:CategoryAgent_P"] ?? false} data-field-id="frm1600WP:CategoryAgent_P" data-print-control="radio" disabled id="frm1600WP:CategoryAgent_P" type="radio"/>
                                                      <span
                                                        class="wh-inline-e8056ff2b0b8"
                                                        >Private</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="CategoryAgent_G" checked={model.checks["frm1600WP:CategoryAgent_G"] ?? false} data-field-id="frm1600WP:CategoryAgent_G" data-print-control="radio" disabled id="frm1600WP:CategoryAgent_G" type="radio"/>
                                                      <span
                                                        class="wh-inline-e8056ff2b0b8"
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
                    </tr>
                    <tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-2979dea04683"
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-2979dea04683"
                                        >
                                          <tbody>
                                            <tr>
                                              <td class="wh-inline-6e606d24db7d"
                                                ><span
                                                  class="wh-inline-3d3a68672c3c"
                                                >
                                                  8
                                                </span></td
                                              >
                                              <td
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                  >Withholding Agent's Name
                                                  (Last Name, First Name, Middle
                                                  Name for Individuals)
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
                                          class="wh-inline-2979dea04683"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                class="wh-inline-6b6ee2d44756"
                                              >
                                              </td>
                                              <td
                                                ><input class="wh-source-size-70" aria-label="txtTaxpayerName" data-field-id="frm1600WP:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1600WP:txtTaxpayerName" maxlength="50" readonly size="70" type="text" value={model.text["frm1600WP:txtTaxpayerName"] ?? ""}></td
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTd wh-inline-365c0e9ad52e">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-13c2a30034a7"
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-13c2a30034a7"
                                        >
                                          <tbody>
                                            <tr>
                                              <td class="wh-inline-6e606d24db7d"
                                                ><span
                                                  class="wh-inline-3d3a68672c3c"
                                                >
                                                  9
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
                                          class="wh-inline-13c2a30034a7"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                class="wh-inline-6b6ee2d44756"
                                              >
                                              </td>
                                              <td
                                                ><input class="wh-source-size-130" aria-label="txtAddress" data-field-id="frm1600WP:txtAddress" data-print-control="text" data-print-value="" id="frm1600WP:txtAddress" maxlength="150" readonly size="130" type="text" value={model.text["frm1600WP:txtAddress"] ?? ""}></td
                                              >
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-4f51266b1d19">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-9557bad074d8"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-7777c2f5e271"
                                        ><span class="wh-inline-3d3a68672c3c">
                                          10
                                        </span><span
                                          class="wh-inline-cb3a2164388b"
                                          >Zip Code</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <input class="wh-source-size-12" aria-label="txtZipCode" data-field-id="frm1600WP:txtZipCode" data-print-control="text" data-print-value="" id="frm1600WP:txtZipCode" maxlength="12" readonly size="12" type="text" value={model.text["frm1600WP:txtZipCode"] ?? ""}>
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTd wh-inline-adc2f0ddcdae">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-2dd1fd822e01"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-6ebe5801530e"
                                        ><span class="wh-inline-3d3a68672c3c">
                                          11
                                        </span><span
                                          class="wh-inline-cb3a2164388b"
                                          >Are there payees availing of tax
                                          relief under Special Law or
                                          International Tax Treaty?</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="wh-inline-21bb1b004c5b">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="iceSelOneRb-dis fieldText1-dis wh-inline-2979dea04683"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  ><input aria-label="SpecialLaw_1" checked={model.checks["frm1600WP:SpecialLaw_1"] ?? false} data-field-id="frm1600WP:SpecialLaw_1" data-print-control="radio" disabled id="frm1600WP:SpecialLaw_1" type="radio"/><span
                                                    class="wh-inline-29f23e97af51"
                                                    >Yes</span
                                                  >
                                                </td>
                                                <td
                                                  ><input aria-label="SpecialLaw_2" checked={model.checks["frm1600WP:SpecialLaw_2"] ?? false} data-field-id="frm1600WP:SpecialLaw_2" data-print-control="radio" disabled id="frm1600WP:SpecialLaw_2" type="radio"/><span
                                                    class="wh-inline-29f23e97af51"
                                                    >No</span
                                                  ></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                        <div class="wh-inline-9126384fe65b">
                                          If yes, specify
                                          <span aria-label="SpecialLawSelect" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1600WP:SpecialLawSelect" data-print-control="select" id="frm1600WP:SpecialLawSelect">{model.text["frm1600WP:SpecialLawSelect"] ?? ""}</span>
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTdPart">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-a0c744a6c827"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-36fe9f8cef2e">
                                        <span class="wh-inline-3d3a68672c3c"
                                          >Part II</span
                                        ></td
                                      >
                                      <td class="wh-inline-f8ee3560ed06">
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-ea31ef5fe7a0"
                                            >Computation of Tax</span
                                          >
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTd wh-inline-3709648fafb2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-340bc6ad9f21"
                                  id="tblPartIIComputeTax"
                                >
                                  <thead>
                                    <tr>
                                      <td class="wh-inline-69652284d042"
                                        ><span class="wh-inline-26daa3b07341"
                                          >NATURE OF INCOME PAYMENT
                                        </span></td
                                      >
                                      <td class="wh-inline-e07e030c9d3c"
                                        ><a id="btnAddATCPartII">ATC </a>
                                      </td>
                                      <td class="wh-inline-80c99a796975"
                                        ><span class="wh-inline-26daa3b07341"
                                          >TAX BASE</span
                                        ></td
                                      >
                                      <td class="wh-inline-8f448794e90d"
                                        ><span class="wh-inline-26daa3b07341"
                                          >TAX RATE</span
                                        ></td
                                      >
                                      <td class="wh-inline-80c99a796975"
                                        ><span class="wh-inline-26daa3b07341"
                                          >TAX REQUIRED TO <br />
                                          BE WITHHELD</span
                                        ></td
                                      >
                                    </tr>
                                  </thead>
                                  <tbody id="tbodyComputeTax"
                                    >{#each model.atcRows as row, index (row.id)}<tr
                                        ><td class="wh-atc-description"
                                          >{row.description}</td
                                        >{#each row.cells as cell, cellIndex (cell.id)}<td
                                            ><input type="text" readonly aria-label={cell.id} class={["wh-inline-4be03d4e8cf1", "wh-inline-5f326564a568 wh-source-size-25", "wh-inline-437d83d00442", "wh-inline-5f326564a568 wh-source-size-25"][cellIndex]} size={[20, 25, 20, 25][cellIndex]} data-print-control="text" data-print-value data-field-id={cell.id} id={cell.id} value={cell.value} />{#if cellIndex === 2}%{/if}</td
                                          >{/each}</tr
                                      >{/each}</tbody
                                  >
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody>
                            <tr>
                              <td class="tblFormTd">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-fd28291f0a1a"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-3ef6362bb4b4"
                                        ><span class="wh-inline-3d3a68672c3c">
                                          12
                                        </span></td
                                      >
                                      <td class="wh-inline-9d92617c41f2"
                                        ><span class="wh-inline-cb3a2164388b">
                                        </span><span
                                          class="wh-inline-97f71f169000"
                                          >Tax Required to be Withheld and
                                          Remitted</span
                                        ></td
                                      >
                                      <td class="wh-inline-f969c88ca4eb">
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td class="wh-inline-4988e20c99f1"
                                        ><span class="spacePadder"
                                          ><span class="wh-inline-3d3a68672c3c"
                                            >12</span
                                          >
                                          <input aria-label="txtTax12" class="wh-inline-812e4c336b04 wh-source-size-20" data-field-id="frm1600WP:txtTax12" data-print-control="text" data-print-value="" id="frm1600WP:txtTax12" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax12"] ?? ""}>
                                        </span></td
                                      >
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-3d3a68672c3c">
                                          13
                                        </span></td
                                      >
                                      <td
                                        ><span class="wh-inline-97f71f169000">
                                          Less: Tax Remitted in Return
                                          Previously Filed, if this is an
                                          amended return</span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td
                                        ><span class="spacePadder"
                                          ><span class="wh-inline-3d3a68672c3c"
                                            >13</span
                                          >
                                          <input aria-label="txtTax13" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1600WP:txtTax13" data-print-control="text" data-print-value="" id="frm1600WP:txtTax13" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax13"] ?? ""}>
                                        </span></td
                                      >
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-3d3a68672c3c">
                                          14
                                        </span></td
                                      >
                                      <td
                                        ><span class="wh-inline-cb3a2164388b">
                                          T</span
                                        ><span class="wh-inline-97f71f169000"
                                          >ax Still Due / (Overremittance)</span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td
                                        ><span class="spacePadder"
                                          ><span class="wh-inline-3d3a68672c3c"
                                            >14</span
                                          >
                                          <input aria-label="txtTax14" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1600WP:txtTax14" data-print-control="text" data-print-value="" id="frm1600WP:txtTax14" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax14"] ?? ""}>
                                        </span></td
                                      >
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-3d3a68672c3c">
                                          15
                                        </span></td
                                      >
                                      <td colspan="2"
                                        ><span class="wh-inline-cb3a2164388b">
                                          Add: Penalties</span
                                        ></td
                                      >
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td colspan="2">
                                        <table class="wh-inline-adc822afedc4">
                                          <tbody>
                                            <tr>
                                              <td class="wh-inline-e8d6739fc4b5"
                                                ><span
                                                  class="wh-inline-429482632af7"
                                                  >Surcharge</span
                                                ></td
                                              >
                                              <td class="wh-inline-f7c8874e989f"
                                                ><span
                                                  class="wh-inline-429482632af7"
                                                  >Interest</span
                                                ></td
                                              >
                                              <td class="wh-inline-84a3bc4a33d3"
                                                ><span
                                                  class="wh-inline-429482632af7"
                                                  >Compromise</span
                                                ></td
                                              >
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td colspan="2">
                                        <table class="wh-inline-aef865ccebac">
                                          <tbody>
                                            <tr>
                                              <td
                                                class="wh-inline-7e87013db7e8"
                                              >
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><b>15A</b>
                                                  <input aria-label="txtTax15A" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1600WP:txtTax15A" data-print-control="text" data-print-value="" id="frm1600WP:txtTax15A" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax15A"] ?? ""}>
                                                </span>
                                              </td>
                                              <td
                                                class="wh-inline-bae72bc39f43"
                                              >
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><b>15B</b>
                                                  <input aria-label="txtTax15B" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1600WP:txtTax15B" data-print-control="text" data-print-value="" id="frm1600WP:txtTax15B" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax15B"] ?? ""}>
                                                </span>
                                              </td>
                                              <td
                                                class="wh-inline-bae72bc39f43"
                                              >
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><b>15C</b>
                                                  <input aria-label="txtTax15C" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1600WP:txtTax15C" data-print-control="text" data-print-value="" id="frm1600WP:txtTax15C" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax15C"] ?? ""}>
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td>
                                        <div class="spacePadder">
                                          <span class="wh-inline-3d3a68672c3c"
                                            >15D</span
                                          >
                                          <input aria-label="txtTax15D" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1600WP:txtTax15D" data-print-control="text" data-print-value="" id="frm1600WP:txtTax15D" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax15D"] ?? ""}>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-3d3a68672c3c">
                                          16
                                        </span></td
                                      >
                                      <td colspan="2"
                                        ><span class="wh-inline-97f71f169000"
                                          >Total Amount Still
                                          Due/(Overremittance) (Sum of items
                                          14&amp; 15D)</span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder">
                                          <span class="wh-inline-3d3a68672c3c"
                                            >16</span
                                          >
                                          <input aria-label="txtTax16" class="iceInpTxt-dis wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1600WP:txtTax16" data-print-control="text" data-print-value="" id="frm1600WP:txtTax16" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:txtTax16"] ?? ""}>
                                        </div>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td colspan="2"
                                        ><span class="wh-inline-97f71f169000"
                                          >For late filers with overremittance,
                                          extend amount of Penalties (Item 15D
                                          to 16)</span
                                        ></td
                                      >
                                      <td> </td>
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
                          class="tblForm wh-inline-f67ab6bb1f60"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-3709648fafb2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="tblForm wh-inline-fd28291f0a1a"
                                  id="tblScheduleII"
                                >
                                  <tbody
                                    ><tr>
                                      <td colspan="2"> Schedule 1.1 </td>
                                      <td
                                        class="wh-inline-a30033456d9a"
                                        colspan="6"
                                      >
                                        ALPHABETICAL LIST OF PAYEES FROM WHOM
                                        TAXES WERE WITHHELD <br />
                                        (Attach additional sheet/s if necessary)
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        class="wh-inline-c8344f7aea68"
                                        colspan="3"
                                        ><span class="wh-inline-97f71f169000"
                                          >PAYEE DETAILS</span
                                        ></td
                                      >
                                      <td class="wh-inline-62c7b1cc0b82"> </td>
                                      <td
                                        class="wh-inline-c8344f7aea68"
                                        colspan="4"
                                        ><span class="wh-inline-97f71f169000"
                                          >INCOME PAYMENT/TAX WITHHELD DETAILS</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td class="wh-inline-a83cd8bc6e20"
                                        ><span class="wh-inline-97f71f169000"
                                          >(1) <br />
                                          SEQ <br />
                                          NO.
                                        </span>
                                      </td>
                                      <td class="wh-inline-a83cd8bc6e20">
                                        <span class="wh-inline-97f71f169000"
                                          >(2) TIN</span
                                        >
                                      </td>
                                      <td class="wh-inline-3709648fafb2"
                                        ><span class="wh-inline-97f71f169000"
                                          >(3) INDIVIDUAL/ CORPORATION (LAST
                                          NAME, FIRST NAME, MIDDLE NAME FOR
                                          INDIVIDUALS OR REGISTERED NAME FOR
                                          NON-INDIVIDUALS)</span
                                        >
                                      </td>
                                      <td> </td>
                                      <td class="wh-inline-a83cd8bc6e20"
                                        ><span class="wh-inline-97f71f169000"
                                          >(4) ATC</span
                                        ></td
                                      >
                                      <td class="wh-inline-a83cd8bc6e20"
                                        ><span class="wh-inline-97f71f169000"
                                          >(5) NATURE OF PAYMENT</span
                                        ></td
                                      >
                                      <td class="wh-inline-a83cd8bc6e20"
                                        ><span class="wh-inline-97f71f169000"
                                          >(6) AMOUNT</span
                                        >
                                      </td>
                                      <td class="wh-inline-a83cd8bc6e20"
                                        ><span class="wh-inline-97f71f169000"
                                          >(7) TAX RATE(%)
                                        </span></td
                                      >
                                      <td class="wh-inline-a83cd8bc6e20">
                                        <span class="wh-inline-97f71f169000"
                                          >(8) TAX REQUIRED TO BE WITHHELD
                                        </span>
                                      </td>
                                      <td></td>
                                    </tr>
                                    <tr>
                                      <td class="wh-inline-df13d838da54">1</td>
                                      <td class="wh-inline-73f83b4aa463">
                                        <input aria-label="txtTin1" data-field-id="frm1600WP:dtSched:txtTin1" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin1" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin1"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-73f83b4aa463">
                                        <input aria-label="txtFullname1" data-field-id="frm1600WP:dtSched:txtFullname1" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname1" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname1"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-8f788499dc44">
                                        <a id="frm1600WP:dtSched:btnATCcode1"
                                          >ATC
                                        </a>
                                      </td>
                                      <td class="wh-inline-ae5bb6dc1201">
                                        <input aria-label="drpAtcCode1" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode1" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode1" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode1"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-111db8d93b5f">
                                        <input aria-label="naturePayment1" data-field-id="frm1600WP:dtSched:naturePayment1" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment1" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment1"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-be7269108542">
                                        <input aria-label="amount1" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount1" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount1" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount1"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-4bb8433cc747">
                                        <input aria-label="txtRatePercent1" class="wh-inline-3f694d7c9783" data-field-id="frm1600WP:dtSched:txtRatePercent1" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent1" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent1"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-be7269108542">
                                        <input aria-label="taxWithheld1" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld1" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld1"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>
                                        <input aria-label="txtTin2" data-field-id="frm1600WP:dtSched:txtTin2" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin2" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin2"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname2" data-field-id="frm1600WP:dtSched:txtFullname2" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname2" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname2"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode2"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode2" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode2" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode2" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode2"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment2" data-field-id="frm1600WP:dtSched:naturePayment2" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment2" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment2"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount2" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount2" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount2" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount2"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent2" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent2" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent2" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent2"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld2" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld2" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld2"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>3</td>
                                      <td>
                                        <input aria-label="txtTin3" data-field-id="frm1600WP:dtSched:txtTin3" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin3" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin3"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname3" data-field-id="frm1600WP:dtSched:txtFullname3" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname3" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname3"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode3"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode3" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode3" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode3" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode3"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment3" data-field-id="frm1600WP:dtSched:naturePayment3" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment3" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment3"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount3" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount3" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount3" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount3"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent3" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent3" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent3" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent3"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld3" class="wh-inline-812e4c336b04 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld3" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld3"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>4</td>
                                      <td>
                                        <input aria-label="txtTin4" data-field-id="frm1600WP:dtSched:txtTin4" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin4" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin4"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname4" data-field-id="frm1600WP:dtSched:txtFullname4" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname4" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname4"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode4"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode4" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode4" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode4" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode4"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment4" data-field-id="frm1600WP:dtSched:naturePayment4" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment4" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment4"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount4" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount4" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount4" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount4"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent4" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent4" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent4" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent4"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld4" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld4" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld4"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>5</td>
                                      <td>
                                        <input aria-label="txtTin5" data-field-id="frm1600WP:dtSched:txtTin5" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin5" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin5"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname5" data-field-id="frm1600WP:dtSched:txtFullname5" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname5" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname5"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode5"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode5" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode5" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode5" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode5"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment5" data-field-id="frm1600WP:dtSched:naturePayment5" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment5" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment5"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount5" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount5" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount5" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount5"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent5" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent5" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent5" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent5"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld5" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld5" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld5" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld5"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>6</td>
                                      <td>
                                        <input aria-label="txtTin6" data-field-id="frm1600WP:dtSched:txtTin6" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin6" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin6"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname6" data-field-id="frm1600WP:dtSched:txtFullname6" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname6" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname6"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode6"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode6" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode6" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode6" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode6"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment6" data-field-id="frm1600WP:dtSched:naturePayment6" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment6" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment6"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount6" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount6" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount6" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount6"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent6" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent6" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent6" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent6"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld6" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld6" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld6" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld6"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>7</td>
                                      <td>
                                        <input aria-label="txtTin7" data-field-id="frm1600WP:dtSched:txtTin7" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin7" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin7"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname7" data-field-id="frm1600WP:dtSched:txtFullname7" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname7" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname7"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode7"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode7" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode7" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode7" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode7"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment7" data-field-id="frm1600WP:dtSched:naturePayment7" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment7" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment7"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount7" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount7" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount7" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount7"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent7" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent7" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent7" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent7"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld7" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld7" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld7" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld7"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>8</td>
                                      <td>
                                        <input aria-label="txtTin8" data-field-id="frm1600WP:dtSched:txtTin8" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin8" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin8"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname8" data-field-id="frm1600WP:dtSched:txtFullname8" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname8" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname8"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode8"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode8" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode8" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode8" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode8"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment8" data-field-id="frm1600WP:dtSched:naturePayment8" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment8" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment8"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount8" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount8" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount8" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount8"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent8" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent8" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent8" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent8"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld8" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld8" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld8" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld8"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>9</td>
                                      <td>
                                        <input aria-label="txtTin9" data-field-id="frm1600WP:dtSched:txtTin9" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin9" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin9"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname9" data-field-id="frm1600WP:dtSched:txtFullname9" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname9" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname9"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode9"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode9" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode9" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode9" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode9"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment9" data-field-id="frm1600WP:dtSched:naturePayment9" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment9" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment9"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount9" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount9" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount9" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount9"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent9" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent9" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent9" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent9"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld9" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld9" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld9" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld9"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td>10</td>
                                      <td>
                                        <input aria-label="txtTin10" data-field-id="frm1600WP:dtSched:txtTin10" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtTin10" maxlength="14" readonly type="text" value={model.text["frm1600WP:dtSched:txtTin10"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtFullname10" data-field-id="frm1600WP:dtSched:txtFullname10" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtFullname10" maxlength="50" readonly type="text" value={model.text["frm1600WP:dtSched:txtFullname10"] ?? ""}>
                                      </td>
                                      <td>
                                        <a id="frm1600WP:dtSched:btnATCcode10"
                                          >ATC
                                        </a>
                                      </td>
                                      <td>
                                        <input aria-label="drpAtcCode10" class="wh-inline-810a2209b92c" data-field-id="frm1600WP:dtSched:drpAtcCode10" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:drpAtcCode10" readonly type="text" value={model.text["frm1600WP:dtSched:drpAtcCode10"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="naturePayment10" data-field-id="frm1600WP:dtSched:naturePayment10" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:naturePayment10" readonly type="text" value={model.text["frm1600WP:dtSched:naturePayment10"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="amount10" class="wh-inline-386bb5d6139a" data-field-id="frm1600WP:dtSched:amount10" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:amount10" maxlength="17" readonly type="text" value={model.text["frm1600WP:dtSched:amount10"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="txtRatePercent10" class="wh-inline-e8a15c9bf15f" data-field-id="frm1600WP:dtSched:txtRatePercent10" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:txtRatePercent10" readonly type="text" value={model.text["frm1600WP:dtSched:txtRatePercent10"] ?? ""}>
                                      </td>
                                      <td>
                                        <input aria-label="taxWithheld10" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:taxWithheld10" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:taxWithheld10" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:taxWithheld10"] ?? ""}>
                                      </td>
                                      <td class="wh-inline-fb80c902a415"> </td>
                                    </tr>
                                    <tr>
                                      <td colspan="2">Total</td>
                                      <td colspan="6"></td>
                                      <td colspan="2">
                                        <input aria-label="TotaltaxWithheld" class="wh-inline-55bf030b8201 wh-source-size-20" data-field-id="frm1600WP:dtSched:TotaltaxWithheld" data-print-control="text" data-print-value="" id="frm1600WP:dtSched:TotaltaxWithheld" maxlength="25" readonly size="20" type="text" value={model.text["frm1600WP:dtSched:TotaltaxWithheld"] ?? ""}>
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
                        <div class="imgClass wh-inline-55bf5a126da7">
                          <table class="wh-inline-f229be09c47e">
                            <tbody
                              ><tr>
                                <td colspan="7"
                                  >I declare, under the penalties of perjury
                                  that this return has been made in good faith,
                                  verified by me, and to the best of my
                                  knowledge and belief,
                                  <br />is true and correct, pursuant to the
                                  provisions of the National Internal Revenue
                                  Code, as amended, and the regulations issued
                                  under authority thereof.
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td colspan="3"
                                  ><b>17</b
                                  >________________________________________________
                                  <br />Taxpayer/Authorized
                                  Representative/Accredited Tax Agent
                                  <br />
                                </td>
                                <td colspan="2"
                                  >________________________
                                  <br />Title/Position of Signatory
                                  <br />
                                </td>
                                <td colspan="2"
                                  >________________________
                                  <br />TIN of Signatory
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td colspan="3"
                                  >________________________________________________
                                  <br />Tax Agent Acc. No./Atty's Roll No. (if
                                  applicable)
                                  <br />
                                </td>
                                <td colspan="2"
                                  >________________________
                                  <br />Date of Issuance
                                  <br />
                                </td>
                                <td colspan="2"
                                  >________________________
                                  <br />Date of Expiry
                                  <br />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div class="imgClass wh-inline-55bf5a126da7">
                          <img
                            alt="BIR form identifying mark"
                            class="wh-inline-5dfba9815e30"
                            id="frm1600WP:jurat"
                            src="/legacy/img/withholding/original-914aadd56852f9bc.jpg"
                            width="990"
                          />
                        </div>
                        <div class="imgClass wh-inline-4b279d6b28a6">
                          <table class="wh-inline-b5912745581b">
                            <tbody
                              ><tr>
                                <td
                                  >Machine Validation/Revenue Official Receipt
                                  Details (If not filed with the bank)<br /><br
                                  /><br /><br /><br /></td
                                >
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
            <td class="wh-inline-3709648fafb2"
              ><img
                alt="BIR form identifying mark"
                class="wh-inline-5dfba9815e30"
                id="frm1600WP:bcsImg"
                src="/legacy/img/withholding/original-b68774359549f254.jpg"
              /></td
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
        <h2>BIR Form 1600WP — {continuation.title}</h2>
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
