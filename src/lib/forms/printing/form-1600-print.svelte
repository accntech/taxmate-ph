<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1600:j_id201",
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
    "id": "frm1600:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1600:j_id217:_1",
    "source": "frm1600:j_id217",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600:j_id217:_2",
    "source": "frm1600:j_id217",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1600:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1600:j_id252:_1",
    "source": "frm1600:j_id252",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600:j_id252:_2",
    "source": "frm1600:j_id252",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1600:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1600:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1600:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1600:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1600:txtRDOCode"
  },
  {
    "id": "frm1600:txtLineBus",
    "fallback": ""
  },
  {
    "id": "frm1600:txtPayerName",
    "fallback": ""
  },
  {
    "id": "frm1600:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1600:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1600:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1600:j_id392:_1",
    "source": "frm1600:j_id392",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1600:j_id392:_2",
    "source": "frm1600:j_id392",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1600:rdTreaty:_1",
    "source": "frm1600:rdTreaty",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600:rdTreaty:_2",
    "source": "frm1600:rdTreaty",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1600:selTreaty",
    "fallback": "",
    "options": {
      "0": "-",
      "1": "Special Law"
    }
  },
  {
    "id": "frm1600:txtTax14",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:txtTax15",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:txtTax16",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:txtTax17A",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:txtTax17B",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:txtTax17C",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:txtTax17D",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:txtTax18",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin1",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname1",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:1",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment1",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount1",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent1",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin2",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname2",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:2",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment2",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount2",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent2",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin3",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname3",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:3",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment3",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount3",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent3",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin4",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname4",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:4",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment4",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount4",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent4",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin5",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname5",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:5",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment5",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount5",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent5",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin6",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname6",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:6",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment6",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount6",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent6",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld6",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin7",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname7",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:7",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment7",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount7",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent7",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld7",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin8",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname8",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:8",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment8",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount8",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent8",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld8",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin9",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname9",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:9",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment9",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount9",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent9",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld9",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:txtTin10",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtFullname10",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:drpAtcCode:10",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:naturePayment10",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:amount10",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:txtRatePercent10",
    "fallback": ""
  },
  {
    "id": "frm1600:dtSched:taxWithheld10",
    "fallback": "0.00"
  },
  {
    "id": "frm1600:dtSched:TotaltaxWithheld",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1600", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1600"
  aria-label="BIR Form 1600 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1600-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-83df383ff3c7" id="wrapper">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-03cbb4deea31"
      >
        <tbody
          ><tr
            ><td>
              <div id="formPaper">
                <div id="mainContent">
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="wh-inline-1f4b83a347a2"
                  >
                    <tbody
                      ><tr>
                        <td>
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-4d8730e8a1e5"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-c94d939e61dc">
                                  <p>
                                    <img
                                      alt="birlogo"
                                      class="wh-inline-0c0d8c42d652"
                                      height="49"
                                      src="/legacy/img/withholding/original-1d5df704be8f0f62.gif"
                                      width="51"
                                    />
                                  </p>
                                  <p></p>
                                  <p></p></td
                                >
                                <td class="wh-inline-0ce8da9bfb65">
                                  <span class="wh-inline-429482632af7"
                                    >Republika ng Pilipinas
                                    <br />Kagawaran ng Pananalapi
                                    <br />Kawanihan ng Rentas Internas</span
                                  >
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-aec978eca301"
                                    >Monthly Remittance Return of<br
                                    />Value-Added Tax and Other<br />Percentage
                                    Taxes Withheld</span
                                  >
                                </td>
                                <td class="wh-inline-17b28d4523d2">
                                  <span class="wh-inline-429482632af7"
                                    >BIR Form No.<br /></span
                                  >
                                  <span class="wh-inline-c1d61ad77e0f"
                                    >1600<br /></span
                                  >
                                  <span class="wh-inline-429482632af7"
                                    >September 2005 (ENCS)</span
                                  >
                                </td></tr
                              >
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-93e1d868f34b" colspan="4"
                                  ><div class="wh-inline-9cb088a595d0">
                                    <span class="wh-inline-232ced7b40ab"
                                      >Under RAs 1051, 7649, 8241, 8424 and 9337</span
                                    >
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td class="tblFormTd wh-inline-b83cf8b4d281">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-81ce0868c031"
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
                                          <span aria-label="j_id201" class="iceSelOneMnu fieldSelect1 labels wh-print-select" data-field-id="frm1600:j_id201" data-print-control="select" id="frm1600:j_id201">{model.text["frm1600:j_id201"] ?? ""}</span>
                                          <input class="wh-source-size-4" aria-label="txtYear" data-field-id="frm1600:txtYear" data-print-control="text" data-print-value="" id="frm1600:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1600:txtYear"] ?? ""}>
                                        </td>
                                        <td> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-2df4abdee0e4">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-ccf48194ef5e"
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
                                            id="frm1600:j_id217"
                                          >
                                            <div class="wh-inline-9284f1c636b2">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb-dis fieldText1-dis wh-inline-ff315a0771e7"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      ><input aria-label="_1" checked={model.checks["frm1600:j_id217:_1"] ?? false} data-field-id="frm1600:j_id217:_1" data-print-control="radio" disabled id="frm1600:j_id217:_1" type="radio"/><span
                                                        class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
                                                        >Yes</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="_2" checked={model.checks["frm1600:j_id217:_2"] ?? false} data-field-id="frm1600:j_id217:_2" data-print-control="radio" disabled id="frm1600:j_id217:_2" type="radio"/><span
                                                        class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
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
                                <td class="tblFormTd wh-inline-8ee7c2ceb529">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-efff380e4e28"
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
                                          ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1600:txtSheets" data-print-control="text" data-print-value="" id="frm1600:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1600:txtSheets"] ?? ""}></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-ed0d81a9c3ab">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-b5f491b24973"
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
                                            id="frm1600:j_id252"
                                          >
                                            <div class="wh-inline-9284f1c636b2">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb fieldText1 wh-inline-c9eced488256"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      ><input aria-label="_1" checked={model.checks["frm1600:j_id252:_1"] ?? false} data-field-id="frm1600:j_id252:_1" data-print-control="radio" disabled id="frm1600:j_id252:_1" type="radio"/><span
                                                        class="wh-inline-766562615de5"
                                                        >Yes</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="_2" checked={model.checks["frm1600:j_id252:_2"] ?? false} data-field-id="frm1600:j_id252:_2" data-print-control="radio" disabled id="frm1600:j_id252:_2" type="radio"/><span
                                                        class="wh-inline-766562615de5"
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTdPart">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-03cbf689415f"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-2bf0f868d38c">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >Part I</span
                                          ></td
                                        >
                                        <td class="wh-inline-79f7ff9a20ed">
                                          <div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-6217d6f49f24"
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-58b9a1c49c91">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-4b99755e832c"
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
                                            <input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm1600:txtTIN1" data-print-control="text" data-print-value="" id="frm1600:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm1600:txtTIN1"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm1600:txtTIN2" data-print-control="text" data-print-value="" id="frm1600:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm1600:txtTIN2"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm1600:txtTIN3" data-print-control="text" data-print-value="" id="frm1600:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm1600:txtTIN3"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm1600:txtBranchCode" data-print-control="text" data-print-value="" id="frm1600:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1600:txtBranchCode"] ?? ""}>
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-b210dc6fd110">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-b852b61a4ac3"
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
                                <td class="tblFormTd wh-inline-d13a02fbb17a">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-6afbbe8d27c3"
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
                                            <input class="wh-source-size-20" aria-label="txtLineBus" data-field-id="frm1600:txtLineBus" data-print-control="text" data-print-value="" id="frm1600:txtLineBus" maxlength="60" readonly size="20" type="text" value={model.text["frm1600:txtLineBus"] ?? ""}>
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-b7208bb06ad3"
                                  >
                                    <tbody
                                      ><tr>
                                        <td>
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-b7208bb06ad3"
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
                                            class="wh-inline-b7208bb06ad3"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-6b6ee2d44756"
                                                >
                                                </td>
                                                <td
                                                  ><input class="wh-source-size-70" aria-label="txtPayerName" data-field-id="frm1600:txtPayerName" data-print-control="text" data-print-value="" id="frm1600:txtPayerName" maxlength="50" readonly size="70" type="text" value={model.text["frm1600:txtPayerName"] ?? ""}></td
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
                                    class="wh-inline-c9c460faffc3"
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
                                            <input class="wh-source-size-15" aria-label="txtTelNum" data-field-id="frm1600:txtTelNum" data-print-control="text" data-print-value="" id="frm1600:txtTelNum" maxlength="20" readonly size="15" type="text" value={model.text["frm1600:txtTelNum"] ?? ""}>
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-b7208bb06ad3"
                                  >
                                    <tbody
                                      ><tr>
                                        <td>
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-b7208bb06ad3"
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
                                            class="wh-inline-b7208bb06ad3"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-6b6ee2d44756"
                                                >
                                                </td>
                                                <td
                                                  ><input class="wh-source-size-70" aria-label="txtAddress" data-field-id="frm1600:txtAddress" data-print-control="text" data-print-value="" id="frm1600:txtAddress" maxlength="150" readonly size="70" type="text" value={model.text["frm1600:txtAddress"] ?? ""}></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
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
                                    class="wh-inline-c9c460faffc3"
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
                                            <input class="wh-source-size-12" aria-label="txtZipCode" data-field-id="frm1600:txtZipCode" data-print-control="text" data-print-value="" id="frm1600:txtZipCode" maxlength="12" readonly size="12" type="text" value={model.text["frm1600:txtZipCode"] ?? ""}>
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
                            class="tblForm wh-inline-27daa57e7ac5"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-bf74ab1c33c3">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-97ed72a3d145"
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
                                              class="iceSelOneRb fieldText1 wh-inline-4dffa5c2f8e5"
                                              id="frm1600:j_id392"
                                            >
                                              <div
                                                class="wh-inline-9284f1c636b2"
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  class="iceSelOneRb fieldText1 wh-inline-b63aacdca7b1"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        ><input aria-label="_1" checked={model.checks["frm1600:j_id392:_1"] ?? false} data-field-id="frm1600:j_id392:_1" data-print-control="radio" disabled id="frm1600:j_id392:_1" type="radio"/><span
                                                          class="iceSelOneRb fieldText1 wh-inline-df8bcce4c703"
                                                          >Private</span
                                                        >
                                                      </td>
                                                      <td
                                                        ><input aria-label="_2" checked={model.checks["frm1600:j_id392:_2"] ?? false} data-field-id="frm1600:j_id392:_2" data-print-control="radio" disabled id="frm1600:j_id392:_2" type="radio"/><span
                                                          class="iceSelOneRb fieldText1 wh-inline-df8bcce4c703"
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
                                <td class="tblFormTd wh-inline-d206ab5dfe1d">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-f2eb31bbad03"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6ebe5801530e"
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
                                        <td>
                                          <div class="wh-inline-3abed13f42d0">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="iceSelOneRb-dis fieldText1-dis wh-inline-46d4f2462766"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="_1" checked={model.checks["frm1600:rdTreaty:_1"] ?? false} data-field-id="frm1600:rdTreaty:_1" data-print-control="radio" disabled id="frm1600:rdTreaty:_1" type="radio"/><span
                                                      class="wh-inline-766562615de5"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="_2" checked={model.checks["frm1600:rdTreaty:_2"] ?? false} data-field-id="frm1600:rdTreaty:_2" data-print-control="radio" disabled id="frm1600:rdTreaty:_2" type="radio"/><span
                                                      class="wh-inline-766562615de5"
                                                      >No</span
                                                    ></td
                                                  >
                                                </tr>
                                              </tbody>
                                            </table>
                                          </div>
                                          <div class="wh-inline-9126384fe65b">
                                            If yes, specify
                                            <span aria-label="selTreaty" class="labels wh-print-select wh-inline-3276beb56669" data-field-id="frm1600:selTreaty" data-print-control="select" id="frm1600:selTreaty">{model.text["frm1600:selTreaty"] ?? ""}</span>
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-3709648fafb2">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-3af4e1f85162"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-605548cec216">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >Part II</span
                                          ></td
                                        >
                                        <td class="wh-inline-605548cec216">
                                          <span class="wh-inline-03a84e47fc53"
                                            >Computation of Tax</span
                                          ></td
                                        >
                                        <td>
                                          <a id="btnAddATCPartII">ATC</a>
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-3709648fafb2">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-a5c437edf74d"
                                    id="tblPartIIComputeTax"
                                  >
                                    <thead>
                                      <tr>
                                        <td
                                          class="padder1Em wh-inline-69652284d042"
                                          ><span class="wh-inline-dd2eceacf41a"
                                            >NATURE OF INCOME PAYMENT
                                          </span></td
                                        >
                                        <td class="wh-inline-be93aa044c2c"
                                          ><span class="wh-inline-dd2eceacf41a"
                                            >ATC</span
                                          ></td
                                        >
                                        <td class="wh-inline-b551f937d48b"
                                          ><span class="wh-inline-dd2eceacf41a"
                                            >TAX BASE</span
                                          ></td
                                        >
                                        <td class="wh-inline-8f448794e90d"
                                          ><span class="wh-inline-dd2eceacf41a"
                                            >TAX RATE</span
                                          ></td
                                        >
                                        <td class="wh-inline-f99c236f78b6"
                                          ><span class="wh-inline-dd2eceacf41a"
                                            >TAX REQUIRED TO <br /> BE WITHHELD</span
                                          ></td
                                        >
                                      </tr>
                                    </thead>
                                    <tbody
                                      class="modalContent"
                                      id="tbodyComputeTax"
                                      >{#each model.atcRows as row, index (row.id)}<tr
                                          ><td class="wh-atc-description"
                                            >{row.description}</td
                                          >{#each row.cells as cell, cellIndex (cell.id)}<td
                                              ><input type="text" readonly aria-label={cell.id} class={["wh-inline-4be03d4e8cf1", "wh-inline-5f326564a568 wh-source-size-20", "wh-inline-437d83d00442", "wh-inline-5f326564a568 wh-source-size-20"][cellIndex]} size={[20, 20, 20, 20][cellIndex]} data-print-control="text" data-print-value data-field-id={cell.id} id={cell.id} value={cell.value} />{#if cellIndex === 2}%{/if}</td
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
                            class="tblForm wh-inline-1f4b83a347a2"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-9b05923994ab"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-ddeef09a9a23"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            14
                                          </span></td
                                        >
                                        <td class="wh-inline-8217b972bd3b"
                                          ><span class="wh-inline-cb3a2164388b">
                                          </span><span
                                            class="wh-inline-97f71f169000"
                                            >Total Tax Required to be Withheld
                                            and Remitted</span
                                          ></td
                                        >
                                        <td class="wh-inline-f7c49be501ad">
                                          <div class="spacePadder"></div>
                                        </td>
                                        <td class="wh-inline-c8494597e7b2"
                                          ><span class="spacePadder"
                                            ><span
                                              class="wh-inline-4cf6c17959a7"
                                              >14</span
                                            >
                                            <input aria-label="txtTax14" class="wh-inline-339ab0a6f191 wh-source-size-20" data-field-id="frm1600:txtTax14" data-print-control="text" data-print-value="" id="frm1600:txtTax14" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:txtTax14"] ?? ""}>
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            15
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
                                            ><span
                                              class="wh-inline-4cf6c17959a7"
                                              >15</span
                                            >
                                            <input aria-label="txtTax15" class="wh-inline-8cc7a2448d17 wh-source-size-20" data-field-id="frm1600:txtTax15" data-print-control="text" data-print-value="" id="frm1600:txtTax15" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:txtTax15"] ?? ""}>
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            16
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-97f71f169000"
                                            >Tax Still Due / (Overremittance)</span
                                          ></td
                                        >
                                        <td>
                                          <div class="spacePadder"></div>
                                        </td>
                                        <td
                                          ><span class="spacePadder"
                                            ><span
                                              class="wh-inline-4cf6c17959a7"
                                              >16</span
                                            >
                                            <input aria-label="txtTax16" class="wh-inline-451791d184f7 wh-source-size-20" data-field-id="frm1600:txtTax16" data-print-control="text" data-print-value="" id="frm1600:txtTax16" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:txtTax16"] ?? ""}>
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            17
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
                                          <table class="wh-inline-759632d9d0a4">
                                            <tbody>
                                              <tr>
                                                <td
                                                  class="wh-inline-e8d6739fc4b5"
                                                  ><span
                                                    class="wh-inline-429482632af7"
                                                    >Surcharge</span
                                                  ></td
                                                >
                                                <td
                                                  class="wh-inline-f7c8874e989f"
                                                  ><span
                                                    class="wh-inline-429482632af7"
                                                    >Interest</span
                                                  ></td
                                                >
                                                <td
                                                  class="wh-inline-84a3bc4a33d3"
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
                                          <table class="wh-inline-114e37a08397">
                                            <tbody>
                                              <tr>
                                                <td
                                                  class="wh-inline-e8d6739fc4b5"
                                                >
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                    ><b>17A</b>
                                                    <input aria-label="txtTax17A" class="wh-inline-80ec55322565 wh-source-size-15" data-field-id="frm1600:txtTax17A" data-print-control="text" data-print-value="" id="frm1600:txtTax17A" maxlength="25" readonly size="15" type="text" value={model.text["frm1600:txtTax17A"] ?? ""}>
                                                  </span>
                                                </td>
                                                <td
                                                  class="wh-inline-e8d6739fc4b5"
                                                >
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                    ><b>17B</b>
                                                    <input aria-label="txtTax17B" class="wh-inline-386bb5d6139a wh-source-size-15" data-field-id="frm1600:txtTax17B" data-print-control="text" data-print-value="" id="frm1600:txtTax17B" maxlength="25" readonly size="15" type="text" value={model.text["frm1600:txtTax17B"] ?? ""}>
                                                  </span>
                                                </td>
                                                <td
                                                  class="wh-inline-84a3bc4a33d3"
                                                >
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                    ><b>17C</b>
                                                    <input aria-label="txtTax17C" class="wh-inline-386bb5d6139a wh-source-size-15" data-field-id="frm1600:txtTax17C" data-print-control="text" data-print-value="" id="frm1600:txtTax17C" maxlength="25" readonly size="15" type="text" value={model.text["frm1600:txtTax17C"] ?? ""}>
                                                  </span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                        <td>
                                          <div class="spacePadder">
                                            <span class="wh-inline-4cf6c17959a7"
                                              >17D</span
                                            >
                                            <input aria-label="txtTax17D" class="wh-inline-451791d184f7 wh-source-size-20" data-field-id="frm1600:txtTax17D" data-print-control="text" data-print-value="" id="frm1600:txtTax17D" maxlength="15" readonly size="20" type="text" value={model.text["frm1600:txtTax17D"] ?? ""}>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            18
                                          </span></td
                                        >
                                        <td colspan="2"
                                          ><span class="wh-inline-cb3a2164388b">
                                          </span><span
                                            class="wh-inline-97f71f169000"
                                            >Total Amount Still
                                            Due/(Overremittance) (Sum of items
                                            16 &amp; 17D)</span
                                          ></td
                                        >
                                        <td>
                                          <div class="spacePadder">
                                            <span class="wh-inline-4cf6c17959a7"
                                              >18</span
                                            >
                                            <input aria-label="txtTax18" class="iceInpTxt-dis wh-inline-451791d184f7 wh-source-size-20" data-field-id="frm1600:txtTax18" data-print-control="text" data-print-value="" id="frm1600:txtTax18" maxlength="15" readonly size="20" type="text" value={model.text["frm1600:txtTax18"] ?? ""}>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td> </td>
                                        <td colspan="2"
                                          ><span class="wh-inline-97f71f169000"
                                            >For late filers with
                                            overremittance, extend amount of
                                            Penalties (Item 17D to 18)</span
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
                            class="tblForm wh-inline-fc8bcc9b917b"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-3709648fafb2">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="tblForm wh-inline-a5c437edf74d"
                                    id="tblScheduleII"
                                  >
                                    <tbody
                                      ><tr>
                                        <td colspan="2"> Schedule II </td>
                                        <td
                                          class="wh-inline-a30033456d9a"
                                          colspan="6"
                                        >
                                          ALPHABETICAL LIST OF PAYEES FROM WHOM
                                          TAXES WERE WITHHELD <br />(Attach
                                          additional sheet/s if necessary)</td
                                        >
                                      </tr>
                                      <tr>
                                        <td> </td>
                                        <td
                                          class="wh-inline-69491e56fcbe"
                                          colspan="2"
                                          ><span class="wh-inline-97f71f169000"
                                            >PAYEE DETAILS</span
                                          ></td
                                        >
                                        <td class="wh-inline-a30033456d9a">
                                        </td>
                                        <td
                                          class="wh-inline-69491e56fcbe"
                                          colspan="4"
                                          ><span class="wh-inline-97f71f169000"
                                            >INCOME PAYMENT/TAX WITHHELD DETAILS</span
                                          ></td
                                        >
                                      </tr>
                                      <tr
                                        ><td class="wh-inline-60ff86cf3b60"
                                          ><span class="wh-inline-97f71f169000"
                                            >(1) <br /> SEQ <br />NO.
                                          </span>
                                        </td>
                                        <td class="wh-inline-60ff86cf3b60">
                                          <span class="wh-inline-97f71f169000"
                                            >(2) TIN</span
                                          >
                                        </td>
                                        <td class="wh-inline-3709648fafb2">
                                          <span class="wh-inline-97f71f169000">
                                            (3) INDIVIDUAL/ CORPORATION (LAST
                                            NAME, FIRST NAME, MIDDLE NAME FOR
                                            INDIVIDUALS OR REGISTERED NAME FOR
                                            NON-INDIVIDUALS)
                                          </span>
                                        </td>
                                        <td> </td>
                                        <td class="wh-inline-60ff86cf3b60"
                                          ><span class="wh-inline-97f71f169000"
                                            >(4) ATC</span
                                          ></td
                                        >
                                        <td class="wh-inline-60ff86cf3b60"
                                          ><span class="wh-inline-97f71f169000"
                                            >(5) NATURE OF PAYMENT</span
                                          ></td
                                        >
                                        <td class="wh-inline-60ff86cf3b60"
                                          ><span class="wh-inline-97f71f169000"
                                            >(6) AMOUNT</span
                                          >
                                        </td>
                                        <td class="wh-inline-60ff86cf3b60"
                                          ><span class="wh-inline-97f71f169000"
                                            >(7) TAX RATE(%)
                                          </span></td
                                        >
                                        <td class="wh-inline-60ff86cf3b60">
                                          <span class="wh-inline-97f71f169000"
                                            >(8) TAX REQUIRED TO BE WITHHELD
                                          </span>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td class="wh-inline-df13d838da54">1</td
                                        >
                                        <td class="wh-inline-245aee045aae"
                                          ><input aria-label="txtTin1" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin1" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin1" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin1"] ?? ""}></td
                                        >
                                        <td class="wh-inline-4db315f9cbed"
                                          ><input aria-label="txtFullname1" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname1" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname1" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname1"] ?? ""}></td
                                        >
                                        <td class="wh-inline-8f788499dc44"
                                          ><a id="frm1600:dtSched:btnATCcode1"
                                            >ATC</a
                                          ></td
                                        >
                                        <td class="wh-inline-8f448794e90d"
                                          ><input aria-label="1" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:1" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:1" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:1"] ?? ""}></td
                                        >
                                        <td class="wh-inline-111db8d93b5f"
                                          ><input aria-label="naturePayment1" data-field-id="frm1600:dtSched:naturePayment1" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment1" readonly type="text" value={model.text["frm1600:dtSched:naturePayment1"] ?? ""}></td
                                        >
                                        <td class="wh-inline-14ba891a513d"
                                          ><input aria-label="amount1" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount1" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount1" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount1"] ?? ""}></td
                                        >
                                        <td class="wh-inline-8f788499dc44"
                                          ><input aria-label="txtRatePercent1" class="wh-inline-9a14657ecd80" data-field-id="frm1600:dtSched:txtRatePercent1" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent1" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent1"] ?? ""}></td
                                        >
                                        <td class="wh-inline-111db8d93b5f">
                                          <input aria-label="taxWithheld1" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld1" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld1"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>2</td>
                                        <td
                                          ><input aria-label="txtTin2" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin2" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin2" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin2"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname2" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname2" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname2" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname2"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode2"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="2" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:2" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:2" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:2"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment2" data-field-id="frm1600:dtSched:naturePayment2" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment2" readonly type="text" value={model.text["frm1600:dtSched:naturePayment2"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount2" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount2" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount2" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount2"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent2" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent2" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent2" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent2"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld2" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld2" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld2"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>3</td>
                                        <td
                                          ><input aria-label="txtTin3" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin3" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin3" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin3"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname3" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname3" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname3" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname3"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode3"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="3" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:3" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:3" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:3"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment3" data-field-id="frm1600:dtSched:naturePayment3" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment3" readonly type="text" value={model.text["frm1600:dtSched:naturePayment3"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount3" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount3" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount3" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount3"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent3" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent3" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent3" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent3"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld3" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld3" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld3"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>4</td>
                                        <td
                                          ><input aria-label="txtTin4" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin4" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin4" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin4"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname4" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname4" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname4" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname4"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode4"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="4" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:4" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:4" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:4"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment4" data-field-id="frm1600:dtSched:naturePayment4" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment4" readonly type="text" value={model.text["frm1600:dtSched:naturePayment4"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount4" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount4" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount4" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount4"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent4" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent4" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent4" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent4"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld4" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld4" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld4"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>5</td>
                                        <td
                                          ><input aria-label="txtTin5" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin5" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin5" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin5"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname5" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname5" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname5" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname5"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode5"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="5" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:5" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:5" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:5"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment5" data-field-id="frm1600:dtSched:naturePayment5" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment5" readonly type="text" value={model.text["frm1600:dtSched:naturePayment5"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount5" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount5" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount5" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount5"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent5" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent5" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent5" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent5"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld5" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld5" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld5" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld5"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>6</td>
                                        <td
                                          ><input aria-label="txtTin6" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin6" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin6" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin6"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname6" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname6" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname6" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname6"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode6"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="6" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:6" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:6" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:6"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment6" data-field-id="frm1600:dtSched:naturePayment6" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment6" readonly type="text" value={model.text["frm1600:dtSched:naturePayment6"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount6" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount6" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount6" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount6"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent6" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent6" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent6" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent6"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld6" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld6" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld6" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld6"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>7</td>
                                        <td
                                          ><input aria-label="txtTin7" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin7" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin7" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin7"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname7" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname7" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname7" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname7"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode7"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="7" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:7" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:7" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:7"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment7" data-field-id="frm1600:dtSched:naturePayment7" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment7" readonly type="text" value={model.text["frm1600:dtSched:naturePayment7"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount7" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount7" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount7" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount7"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent7" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent7" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent7" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent7"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld7" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld7" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld7" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld7"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>8</td>
                                        <td
                                          ><input aria-label="txtTin8" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin8" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin8" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin8"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname8" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname8" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname8" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname8"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode8"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="8" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:8" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:8" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:8"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment8" data-field-id="frm1600:dtSched:naturePayment8" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment8" readonly type="text" value={model.text["frm1600:dtSched:naturePayment8"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount8" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount8" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount8" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount8"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent8" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent8" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent8" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent8"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld8" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld8" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld8" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld8"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>9</td>
                                        <td
                                          ><input aria-label="txtTin9" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin9" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin9" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin9"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname9" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname9" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname9" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname9"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode9"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="9" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:9" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:9" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:9"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment9" data-field-id="frm1600:dtSched:naturePayment9" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment9" readonly type="text" value={model.text["frm1600:dtSched:naturePayment9"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount9" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount9" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount9" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount9"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent9" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent9" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent9" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent9"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld9" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld9" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld9" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld9"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td>10</td>
                                        <td
                                          ><input aria-label="txtTin10" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtTin10" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtTin10" maxlength="14" readonly type="text" value={model.text["frm1600:dtSched:txtTin10"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtFullname10" class="wh-inline-81ef67fbe949" data-field-id="frm1600:dtSched:txtFullname10" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtFullname10" maxlength="50" readonly type="text" value={model.text["frm1600:dtSched:txtFullname10"] ?? ""}></td
                                        >
                                        <td
                                          ><a id="frm1600:dtSched:btnATCcode10"
                                            >ATC</a
                                          ></td
                                        >
                                        <td
                                          ><input aria-label="10" class="wh-inline-810a2209b92c" data-field-id="frm1600:dtSched:drpAtcCode:10" data-print-control="text" data-print-value="" id="frm1600:dtSched:drpAtcCode:10" readonly type="text" value={model.text["frm1600:dtSched:drpAtcCode:10"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="naturePayment10" data-field-id="frm1600:dtSched:naturePayment10" data-print-control="text" data-print-value="" id="frm1600:dtSched:naturePayment10" readonly type="text" value={model.text["frm1600:dtSched:naturePayment10"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="amount10" class="wh-inline-8f8becd47f5e wh-source-size-20" data-field-id="frm1600:dtSched:amount10" data-print-control="text" data-print-value="" id="frm1600:dtSched:amount10" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:amount10"] ?? ""}></td
                                        >
                                        <td
                                          ><input aria-label="txtRatePercent10" class="wh-inline-75c4e5907460" data-field-id="frm1600:dtSched:txtRatePercent10" data-print-control="text" data-print-value="" id="frm1600:dtSched:txtRatePercent10" readonly type="text" value={model.text["frm1600:dtSched:txtRatePercent10"] ?? ""}></td
                                        >
                                        <td>
                                          <input aria-label="taxWithheld10" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:taxWithheld10" data-print-control="text" data-print-value="" id="frm1600:dtSched:taxWithheld10" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:taxWithheld10"] ?? ""}></td
                                        >
                                      </tr>
                                      <tr>
                                        <td colspan="2">Total</td>
                                        <td colspan="6"></td>
                                        <td
                                          ><input aria-label="TotaltaxWithheld" class="wh-inline-01618ce8c78b wh-source-size-20" data-field-id="frm1600:dtSched:TotaltaxWithheld" data-print-control="text" data-print-value="" id="frm1600:dtSched:TotaltaxWithheld" maxlength="25" readonly size="20" type="text" value={model.text["frm1600:dtSched:TotaltaxWithheld"] ?? ""}>
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
                          <div class="imgClass wh-inline-27f58bf86d3b">
                            <table class="wh-inline-b5fa6c040199">
                              <colgroup
                                ><col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-1a5329f85423" />
                              </colgroup><tbody
                                ><tr>
                                  <td colspan="5"
                                    >I declare, under the penalties of perjury,
                                    that this return has been made in good
                                    faith, verified by me, and to the best of my
                                    knowledge, and belief,
                                    <br />is true and correct, pursuant to the
                                    provisions of the National Internal Revenue
                                    Code, as amended, and the regulations issued
                                    under authority thereof.<br /></td
                                  >
                                </tr>
                                <tr>
                                  <td colspan="4"
                                    ><b>19</b
                                    >_____________________________________________________________________
                                    <br />President/Vice President/Principal
                                    Officer/Accredited Tax Agent/
                                    <br />Authorized Representative/Taxpayer
                                    <br />(Signature Over Printed Name)</td
                                  >
                                  <td
                                    ><b>20</b>_____________________________
                                    <br />Treasurer/Assistant Treasurer
                                    <br />(Signature Over Printed Name)
                                    <br />
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2"
                                    >______________________________
                                    <br />Title/Position of Signatory</td
                                  >
                                  <td colspan="2"
                                    >______________________________
                                    <br />TIN of Signatory</td
                                  >
                                  <td
                                    >______________________________
                                    <br />Title/Position of Signatory</td
                                  >
                                </tr>
                                <tr>
                                  <td colspan="2"
                                    >______________________________________
                                    <br />Tax Agent Acc. No./ Atty's Roll No.
                                    (If Applicable)</td
                                  >
                                  <td
                                    >______________
                                    <br />Date of Issuance</td
                                  >
                                  <td
                                    >______________
                                    <br />Date of Expiry</td
                                  >
                                  <td
                                    >______________________________
                                    <br />TIN of Signatory</td
                                  >
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="imgClass wh-inline-27f58bf86d3b">
                            <img
                              alt="BIR form identifying mark"
                              class="wh-inline-5dfba9815e30"
                              id="frm1600:jurat"
                              src="/legacy/img/withholding/original-26bb358d5895ab7a.jpg"
                              width="983"
                            />
                          </div>
                          <div class="imgClass wh-inline-686f65fb70d5">
                            <table class="wh-inline-cbdf6b4521c4">
                              <tbody
                                ><tr>
                                  <td
                                    >Machine Validation/Revenue Official Receipt
                                    Details (If not filed with an Authorized
                                    Agent Bank)<br /><br /><br /><br /><br /><br
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
                  <div class="wh-inline-73d40ed9cb75" id="DummyTxt"></div>
                </div>
              </div>
            </td>
            <td class="wh-inline-3709648fafb2"
              ><img
                alt="BIR form identifying mark"
                id="frm1600:bcsImg"
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
        <h2>BIR Form 1600 — {continuation.title}</h2>
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
