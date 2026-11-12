<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm0605:itemFiscalStartMonth:_1",
    "source": "frm0605:itemFiscalStartMonth",
    "choice": "C",
    "checked": false
  },
  {
    "id": "frm0605:itemFiscalStartMonth:_2",
    "source": "frm0605:itemFiscalStartMonth",
    "choice": "F",
    "checked": false
  },
  {
    "id": "itemQuarter_1",
    "source": "itemQuarter",
    "choice": "1",
    "checked": false
  },
  {
    "id": "itemQuarter_2",
    "source": "itemQuarter",
    "choice": "2",
    "checked": false
  },
  {
    "id": "itemQuarter_3",
    "source": "itemQuarter",
    "choice": "3",
    "checked": false
  },
  {
    "id": "itemQuarter_4",
    "source": "itemQuarter",
    "choice": "4",
    "checked": false
  },
  {
    "id": "frm0605:txtDueDateMonth",
    "fallback": ""
  },
  {
    "id": "frm0605:txtDueDateDay",
    "fallback": ""
  },
  {
    "id": "frm0605:txtDueDateYear",
    "fallback": ""
  },
  {
    "id": "frm0605:txtNoOfSheets",
    "fallback": "0"
  },
  {
    "id": "txtATCCode",
    "fallback": ""
  },
  {
    "id": "frm0605:itemYearEndMonth",
    "fallback": "",
    "options": {
      "00": "",
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
    "id": "frm0605:txtYearEnded",
    "fallback": ""
  },
  {
    "id": "frm0605:txtReturnPeriodMonth",
    "fallback": ""
  },
  {
    "id": "frm0605:txtReturnPeriodDay",
    "fallback": ""
  },
  {
    "id": "frm0605:txtReturnPeriodYear",
    "fallback": ""
  },
  {
    "id": "txtTaxTypeCode",
    "fallback": ""
  },
  {
    "id": "frm0605:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm0605:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm0605:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm0605:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm0605:txtRDOCode"
  },
  {
    "id": "frm0605:txtClassification:_1",
    "source": "frm0605:txtClassification",
    "choice": "I",
    "checked": false
  },
  {
    "id": "frm0605:txtClassification:_2",
    "source": "frm0605:txtClassification",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm0605:txtLineBus",
    "fallback": ""
  },
  {
    "id": "frm0605:txtTaxPayerName",
    "fallback": ""
  },
  {
    "id": "frm0605:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm0605:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm0605:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm0605:itemModeOfPayment:_1",
    "source": "frm0605:itemModeOfPayment",
    "choice": "1",
    "checked": false
  },
  {
    "id": "frm0605:txtNumOfInstallment",
    "fallback": ""
  },
  {
    "id": "frm0605:itemModeOfPayment:_2",
    "source": "frm0605:itemModeOfPayment",
    "choice": "2",
    "checked": false
  },
  {
    "id": "frm0605:itemModeOfPayment:_3",
    "source": "frm0605:itemModeOfPayment",
    "choice": "3",
    "checked": false
  },
  {
    "id": "frm0605:itemMannerOfPayment:_1",
    "source": "frm0605:itemMannerOfPayment",
    "choice": "1",
    "checked": false
  },
  {
    "id": "frm0605:itemMannerOfPayment:_2",
    "source": "frm0605:itemMannerOfPayment",
    "choice": "5",
    "checked": false
  },
  {
    "id": "frm0605:itemMannerOfPayment:_3",
    "source": "frm0605:itemMannerOfPayment",
    "choice": "2",
    "checked": false
  },
  {
    "id": "frm0605:itemMannerOfPayment:_4",
    "source": "frm0605:itemMannerOfPayment",
    "choice": "3",
    "checked": false
  },
  {
    "id": "frm0605:itemMannerOfPayment:_5",
    "source": "frm0605:itemMannerOfPayment",
    "choice": "4",
    "checked": false
  },
  {
    "id": "frm0605:txtOthersName",
    "fallback": ""
  },
  {
    "id": "frm0605:itemMannerOfPaymentB:_1",
    "source": "frm0605:itemMannerOfPayment",
    "choice": "6",
    "checked": false
  },
  {
    "id": "frm0605:itemMannerOfPaymentB:_2",
    "source": "frm0605:itemMannerOfPayment",
    "choice": "7",
    "checked": false
  },
  {
    "id": "frm0605:txtTax19",
    "fallback": "0.00"
  },
  {
    "id": "frm0605:txtTax20A",
    "fallback": "0.00"
  },
  {
    "id": "frm0605:txtTax20B",
    "fallback": "0.00"
  },
  {
    "id": "frm0605:txtTax20C",
    "fallback": "0.00"
  },
  {
    "id": "frm0605:txtTax20D",
    "fallback": "0.00"
  },
  {
    "id": "frm0605:txtTax21",
    "fallback": "0.00"
  },
  {
    "id": "frm0605:itemApprovedYN:_1",
    "source": "frm0605:itemApprovedYN",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm0605:itemApprovedYN:_2",
    "source": "frm0605:itemApprovedYN",
    "choice": "N",
    "checked": false
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("0605", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="0605"
  aria-label="BIR Form 0605 print preview"
>
  <div
    class="withholding-print-page-content wh-page-0605-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-b38870ecbc94" id="wrapper">
      <div id="formPaper">
        <div id="Content">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="wh-inline-38ab657e77ab"
          >
            <tbody
              ><tr>
                <td>
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="wh-inline-01cec045ddd7"
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
                        </td>
                        <td class="wh-inline-0ce8da9bfb65">
                          <span class="wh-inline-429482632af7"
                            >Republika ng Pilipinas
                            <br />Kagawaran ng Pananalapi
                            <br />Kawanihan ng Rentas Internas</span
                          >
                        </td>
                        <td class="wh-inline-a30033456d9a">
                          <span class="wh-inline-aec978eca301"
                            >Payment Form</span
                          >
                        </td>
                        <td class="wh-inline-17b28d4523d2">
                          <span class="wh-inline-429482632af7"
                            >BIR Form No.<br /></span
                          >
                          <span class="wh-inline-c1d61ad77e0f">0605<br /></span>
                          <span class="wh-inline-429482632af7"
                            >September 2003(ENCS)</span
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
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-ef950a3add3e">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-49a632584055"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                    1
                                  </span></td
                                >
                                <td class="wh-inline-964c0ba7507f"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >For the 
                                    <input aria-label="_1" checked={model.checks["frm0605:itemFiscalStartMonth:_1"] ?? false} data-field-id="frm0605:itemFiscalStartMonth:_1" data-print-control="radio" disabled id="frm0605:itemFiscalStartMonth:_1" type="radio"/>
                                    Calendar
                                    <input aria-label="_2" checked={model.checks["frm0605:itemFiscalStartMonth:_2"] ?? false} data-field-id="frm0605:itemFiscalStartMonth:_2" data-print-control="radio" disabled id="frm0605:itemFiscalStartMonth:_2" type="radio"/>
                                    Fiscal
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td
                          class="tblFormTd wh-inline-ed0d81a9c3ab"
                          rowspan="2"
                        >
                          <table class="wh-inline-7661e32ac496">
                            <tbody
                              ><tr>
                                <td class="wh-inline-bb52c6ba08b5"
                                  ><table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-10114f25d032"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-65d1fb1d72a7"
                                          ><span class="wh-inline-15663751d502">
                                            3
                                          </span></td
                                        >
                                        <td class="wh-inline-964c0ba7507f"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Quarter</span
                                          ></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table></td
                                >
                              </tr>
                              <tr>
                                <td class=""
                                  ><table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="iceSelOneRb wh-inline-3b4c2d4a78e8"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-b72ac1d7021d"
                                          ><input aria-label="itemQuarter_1" checked={model.checks["itemQuarter_1"] ?? false} data-field-id="itemQuarter_1" data-print-control="radio" disabled id="itemQuarter_1" type="radio"/>
                                          1st</td
                                        >
                                        <td class="wh-inline-b72ac1d7021d"
                                          ><input aria-label="itemQuarter_2" checked={model.checks["itemQuarter_2"] ?? false} data-field-id="itemQuarter_2" data-print-control="radio" disabled id="itemQuarter_2" type="radio"/>
                                          2nd</td
                                        >
                                        <td class="wh-inline-b72ac1d7021d"
                                          ><input aria-label="itemQuarter_3" checked={model.checks["itemQuarter_3"] ?? false} data-field-id="itemQuarter_3" data-print-control="radio" disabled id="itemQuarter_3" type="radio"/>
                                          3rd</td
                                        >
                                        <td class="wh-inline-b72ac1d7021d">
                                          <input aria-label="itemQuarter_4" checked={model.checks["itemQuarter_4"] ?? false} data-field-id="itemQuarter_4" data-print-control="radio" disabled id="itemQuarter_4" type="radio"/>
                                          4th</td
                                        ></tr
                                      >
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <span class="normal">
                            <span
                              class="fieldNumber1 iceOutLbl"
                              id="frm0605:j_id149"
                            ></span>
                          </span>
                        </td>
                        <td
                          class="tblFormTd wh-inline-3eaf4f0a1ce1"
                          rowspan="2"
                        >
                          <table class="wh-inline-2f3b11f5278b">
                            <tbody
                              ><tr>
                                <td class="wh-inline-2e3ce3500fda"
                                  ><table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-c900897be20a"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-65d1fb1d72a7"
                                          ><span class="wh-inline-15663751d502">
                                            4
                                          </span></td
                                        >
                                        <td class="wh-inline-964c0ba7507f"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Due Date (MM/DD/YYYY)
                                          </span></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table></td
                                >
                              </tr>
                              <tr>
                                <td class=""
                                  ><input aria-label="txtDueDateMonth" class="wh-inline-8f8becd47f5e wh-source-size-2" data-field-id="frm0605:txtDueDateMonth" data-print-control="text" data-print-value="" id="frm0605:txtDueDateMonth" maxlength="2" readonly size="2" type="text" value={model.text["frm0605:txtDueDateMonth"] ?? ""}>
                                  <input aria-label="txtDueDateDay" class="wh-inline-8f8becd47f5e wh-source-size-2" data-field-id="frm0605:txtDueDateDay" data-print-control="text" data-print-value="" id="frm0605:txtDueDateDay" maxlength="2" readonly size="2" type="text" value={model.text["frm0605:txtDueDateDay"] ?? ""}>
                                  <input aria-label="txtDueDateYear" class="wh-inline-8f8becd47f5e wh-source-size-3" data-field-id="frm0605:txtDueDateYear" data-print-control="text" data-print-value="" id="frm0605:txtDueDateYear" maxlength="4" readonly size="3" type="text" value={model.text["frm0605:txtDueDateYear"] ?? ""}></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-7e8103b99397" rowspan="2"
                          ><span class="normal">
                            <span
                              class="iceOutLbl fieldLabel1"
                              id="frm0605:j_id150"
                            ></span>
                          </span>
                          <table class="wh-inline-f29ed0e42d59">
                            <tbody
                              ><tr>
                                <td class=""
                                  ><table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-317c888451ae"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-65d1fb1d72a7"
                                          ><span class="wh-inline-15663751d502">
                                            5
                                          </span></td
                                        >
                                        <td class="wh-inline-964c0ba7507f"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >No. of Sheets Attached
                                          </span></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><input aria-label="txtNoOfSheets" class="wh-inline-55aaececa9cb wh-source-size-4" data-field-id="frm0605:txtNoOfSheets" data-print-control="text" data-print-value="" id="frm0605:txtNoOfSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm0605:txtNoOfSheets"] ?? ""}></td
                                >
                              </tr>
                            </tbody>
                          </table>
                          <p class="normal"></p></td
                        >
                        <td class="tblFormTd wh-inline-4b8569995bbc" rowspan="2"
                          ><span class="normal">
                            <span
                              class="iceOutLbl fieldNumber1"
                              id="frm0605:j_id149"
                            ></span>
                          </span>
                          <table class="wh-inline-898cdf83b7e0">
                            <tbody
                              ><tr>
                                <td class="wh-inline-657443cf7441"
                                  ><table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-9f51b5ae89ed"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-65d1fb1d72a7"
                                          ><span class="wh-inline-15663751d502">
                                            6
                                          </span></td
                                        >
                                        <td class="wh-inline-964c0ba7507f"
                                          ><span class="wh-inline-cb3a2164388b"
                                          ></span><a id="btnATC">ATC </a></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="top">
                                    <input class="wh-source-size-8" aria-label="txtATCCode" data-field-id="txtATCCode" data-print-control="text" data-print-value="" id="txtATCCode" readonly size="8" type="text" value={model.text["txtATCCode"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table>
                          <span class="iceOutLbl fieldLabel1"></span></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd wh-inline-3709648fafb2"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-49a632584055"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                    2
                                  </span></td
                                >
                                <td class="wh-inline-964c0ba7507f"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Year Ended (MM/YYYY)
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table>
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-49a632584055"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-6e606d24db7d"
                                  ><span class="wh-inline-15663751d502">
                                  </span></td
                                >
                                <td class="wh-inline-db59ed46fd41"
                                  ><span class="top">
                                    <span aria-label="itemYearEndMonth" class="iceSelOneMnu labels wh-print-select" data-field-id="frm0605:itemYearEndMonth" data-print-control="select" id="frm0605:itemYearEndMonth">{model.text["frm0605:itemYearEndMonth"] ?? ""}</span>
                                    <input aria-label="txtYearEnded" class="wh-inline-8f8becd47f5e wh-source-size-4" data-field-id="frm0605:txtYearEnded" data-print-control="text" data-print-value="" id="frm0605:txtYearEnded" maxlength="4" readonly size="4" type="text" value={model.text["frm0605:txtYearEnded"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table>
                          <span class="top"> </span>
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
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-98d6931e3b45">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-cfa4b7a4b827"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                    7
                                  </span></td
                                >
                                <td class="wh-inline-a4784c5cdc9e"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Return Period (MM / DD / YYYY)
                                  </span></td
                                >
                                <td class="wh-inline-03670adab5f5"
                                  ><span class="normal">
                                    <input aria-label="txtReturnPeriodMonth" class="iceInpTxt input wh-inline-55aaececa9cb wh-source-size-4" data-field-id="frm0605:txtReturnPeriodMonth" data-print-control="text" data-print-value="" id="frm0605:txtReturnPeriodMonth" maxlength="2" readonly size="4" type="text" value={model.text["frm0605:txtReturnPeriodMonth"] ?? ""}>
                                  </span><span class="normal">
                                    <input aria-label="txtReturnPeriodDay" class="iceInpTxt input wh-inline-55aaececa9cb wh-source-size-4" data-field-id="frm0605:txtReturnPeriodDay" data-print-control="text" data-print-value="" id="frm0605:txtReturnPeriodDay" maxlength="2" readonly size="4" type="text" value={model.text["frm0605:txtReturnPeriodDay"] ?? ""}>
                                  </span><span class="normal">
                                    <input aria-label="txtReturnPeriodYear" class="iceInpTxt input wh-inline-55aaececa9cb wh-source-size-6" data-field-id="frm0605:txtReturnPeriodYear" data-print-control="text" data-print-value="" id="frm0605:txtReturnPeriodYear" maxlength="4" readonly size="6" type="text" value={model.text["frm0605:txtReturnPeriodYear"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-98d6931e3b45">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-824e66f3141b"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                    8
                                  </span></td
                                >
                                <td class="wh-inline-3681a9c6a94c"
                                  ><span class="wh-inline-cb3a2164388b"
                                  ></span><a id="btnTaxType">Tax Type </a>
                                </td>
                                <td class="wh-inline-36fe9f8cef2e"
                                  ><input class="wh-source-size-15" aria-label="txtTaxTypeCode" data-field-id="txtTaxTypeCode" data-print-control="text" data-print-value="" id="txtTaxTypeCode" readonly size="15" type="text" value={model.text["txtTaxTypeCode"] ?? ""}>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="tblFormTdPart" colspan="2">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-2264c6225ee9"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-a9a49871d4b4">
                                  <span class="wh-inline-4cf6c17959a7"
                                    >Part I</span
                                  ></td
                                >
                                <td class="wh-inline-7bf30bb5349d">
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
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-3709648fafb2"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-50273fce9da3"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                    9
                                  </span></td
                                >
                                <td class="wh-inline-976e685b31ea"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Taxpayer Identification No.
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-3709648fafb2"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-189eaa382ae9"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-54122f538c2b"
                                  ><span class="wh-inline-15663751d502">
                                    10
                                  </span></td
                                >
                                <td class="wh-inline-83843f726b34"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >RDO Code
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-3709648fafb2">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-7cb9fe065ea4"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                    11
                                  </span></td
                                >
                                <td class="wh-inline-964c0ba7507f"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Taxpayer Classification
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-3709648fafb2"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-0d1a769f053e"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                    12
                                  </span></td
                                >
                                <td class="wh-inline-25ac3279fc22"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Line of Business/Occupation</span
                                  ></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr><tr
                        ><td class="tblFormTd wh-inline-01da6bde6165"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-50273fce9da3"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                  </span></td
                                >
                                <td class="wh-inline-3476ba68144e"
                                  ><input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm0605:txtTIN1" data-print-control="text" data-print-value="" id="frm0605:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm0605:txtTIN1"] ?? ""}>
                                  <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm0605:txtTIN2" data-print-control="text" data-print-value="" id="frm0605:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm0605:txtTIN2"] ?? ""}>
                                  <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm0605:txtTIN3" data-print-control="text" data-print-value="" id="frm0605:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm0605:txtTIN3"] ?? ""}>
                                  <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm0605:txtBranchCode" data-print-control="text" data-print-value="" id="frm0605:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm0605:txtBranchCode"] ?? ""}></td
                                >
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-4824a1798887"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-b1a30f46ae36"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                  </span></td
                                >
                                <td
                                  class="wh-inline-d228c04551e8"
                                  data-field-id="rdoSelect"
                                  id="rdoSelect"
                                  >{model.text["rdoSelect"] ?? ""}</td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-d4928a7f8919"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-77427320c709"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-fa24451011d2"
                                  ><span class="wh-inline-15663751d502">
                                  </span></td
                                >
                                <td class="wh-inline-0eb27a30e41c"
                                  ><input aria-label="_1" checked={model.checks["frm0605:txtClassification:_1"] ?? false} data-field-id="frm0605:txtClassification:_1" data-print-control="radio" disabled id="frm0605:txtClassification:_1" type="radio"/>
                                  I</td
                                >
                                <td class="wh-inline-5c688d438f95"
                                  ><input aria-label="_2" checked={model.checks["frm0605:txtClassification:_2"] ?? false} data-field-id="frm0605:txtClassification:_2" data-print-control="radio" disabled id="frm0605:txtClassification:_2" type="radio"/>
                                  N</td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-f245124561f0"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-0d1a769f053e"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-65d1fb1d72a7"
                                  ><span class="wh-inline-15663751d502">
                                  </span></td
                                >
                                <td class="wh-inline-2e3ce3500fda"
                                  ><span class="normal">
                                    <input class="wh-source-size-20" aria-label="txtLineBus" data-field-id="frm0605:txtLineBus" data-print-control="text" data-print-value="" id="frm0605:txtLineBus" readonly size="20" type="text" value={model.text["frm0605:txtLineBus"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
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
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-95dc9d5302c5">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-4d29abb00fca"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-4d29abb00fca"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            13
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Taxpayer's Name (Last Name, First
                                            Name, Middle Name for Individuals)
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
                                    class="wh-inline-4d29abb00fca"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6b6ee2d44756">
                                        </td>
                                        <td
                                          ><span class="normal">
                                            <input class="wh-source-size-65" aria-label="txtTaxPayerName" data-field-id="frm0605:txtTaxPayerName" data-print-control="text" data-print-value="" id="frm0605:txtTaxPayerName" maxlength="75" readonly size="65" type="text" value={model.text["frm0605:txtTaxPayerName"] ?? ""}>
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
                        <td class="tblFormTd wh-inline-f245124561f0">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-9d15bde4f832"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-889200ed2728"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    14
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Telephone Number</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td class="wh-inline-6e7a6059caa6">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="top">
                                      <input class="wh-source-size-10" aria-label="txtTelNum" data-field-id="frm0605:txtTelNum" data-print-control="text" data-print-value="" id="frm0605:txtTelNum" readonly size="10" type="text" value={model.text["frm0605:txtTelNum"] ?? ""}>
                                    </span>
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
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-95dc9d5302c5">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-cd3f5976d010"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-cd3f5976d010"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            15
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b"
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
                                    class="wh-inline-d5838ea16f48"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6b6ee2d44756">
                                        </td>
                                        <td class="wh-inline-e67ef209fac1"
                                          ><span class="normal">
                                            <input class="wh-source-size-65" aria-label="txtAddress" data-field-id="frm0605:txtAddress" data-print-control="text" data-print-value="" id="frm0605:txtAddress" readonly size="65" type="text" value={model.text["frm0605:txtAddress"] ?? ""}>
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
                        <td class="tblFormTd wh-inline-0f4b31378c23">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-ac4eb5815902"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-775605493a7e"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    16
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Zip Code</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td class="wh-inline-70bbc446c6ce">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="normal">
                                      <input class="wh-source-size-7" aria-label="txtZipCode" data-field-id="frm0605:txtZipCode" data-print-control="text" data-print-value="" id="frm0605:txtZipCode" readonly size="7" type="text" value={model.text["frm0605:txtZipCode"] ?? ""}>
                                    </span>
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
                    class="tblForm wh-inline-43c814b36dae"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-33d1692df6bb" colspan="2"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-9d4db8e4b3de"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-54122f538c2b"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    17
                                  </span></td
                                >
                                <td class="wh-inline-d6ca16ed26bf"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Manner of Payment
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-3709648fafb2"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-66f814ee94ba"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-54122f538c2b"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    18
                                  </span></td
                                >
                                <td class="wh-inline-5254b838b673"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Type of Payment
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd wh-inline-58c9a35a6d8b"
                          >Voluntary Payment</td
                        >
                        <td class="tblFormTd wh-inline-ba04e44c776c"
                          >Per Audit/Delinquent Account</td
                        >
                        <td class="tblFormTd wh-inline-96a186557281" rowspan="2"
                          ><div class="wh-inline-9cb088a595d0">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="iceSelOneRb wh-inline-5335d1803398"
                            >
                              <tbody
                                ><tr>
                                  <td
                                    ><input aria-label="_1" checked={model.checks["frm0605:itemModeOfPayment:_1"] ?? false} data-field-id="frm0605:itemModeOfPayment:_1" data-print-control="radio" disabled id="frm0605:itemModeOfPayment:_1" type="radio"/>
                                    <span class="iceSelOneRb style3"
                                      >Installment</span
                                    ></td
                                  >
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="wh-inline-9cb088a595d0">
                            <input class="wh-source-size-4" aria-label="txtNumOfInstallment" data-field-id="frm0605:txtNumOfInstallment" data-print-control="text" data-print-value="" id="frm0605:txtNumOfInstallment" maxlength="2" readonly size="4" type="text" value={model.text["frm0605:txtNumOfInstallment"] ?? ""}>
                            <span id="frm0605:j_id298">No. of Installment</span>
                          </div>
                          <div class="wh-inline-9cb088a595d0">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="iceSelOneRb wh-inline-cd53d51cd2a2"
                            >
                              <tbody
                                ><tr>
                                  <td class="wh-inline-d5ccb9f048f0"
                                    ><input aria-label="_2" checked={model.checks["frm0605:itemModeOfPayment:_2"] ?? false} data-field-id="frm0605:itemModeOfPayment:_2" data-print-control="radio" disabled id="frm0605:itemModeOfPayment:_2" type="radio"/>
                                    <span class="iceSelOneRb style3"
                                      >Partial Payment</span
                                    ></td
                                  >
                                </tr>
                                <tr>
                                  <td
                                    ><input aria-label="_3" checked={model.checks["frm0605:itemModeOfPayment:_3"] ?? false} data-field-id="frm0605:itemModeOfPayment:_3" data-print-control="radio" disabled id="frm0605:itemModeOfPayment:_3" type="radio"/>
                                    <span class="iceSelOneRb style3"
                                      >Full Payment</span
                                    >
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd wh-inline-da61f9fa0ca6">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-ecd943ba92ef"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-79fcb0fab1e9"
                                  ><input aria-label="_1" checked={model.checks["frm0605:itemMannerOfPayment:_1"] ?? false} data-field-id="frm0605:itemMannerOfPayment:_1" data-print-control="radio" disabled id="frm0605:itemMannerOfPayment:_1" type="radio"/>
                                  <span class="iceSelOneRb style2"
                                    >Self-Assessment</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><input aria-label="_2" checked={model.checks["frm0605:itemMannerOfPayment:_2"] ?? false} data-field-id="frm0605:itemMannerOfPayment:_2" data-print-control="radio" disabled id="frm0605:itemMannerOfPayment:_2" type="radio"/>
                                  <span class="iceSelOneRb style2"
                                    >Penalties</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><input aria-label="_3" checked={model.checks["frm0605:itemMannerOfPayment:_3"] ?? false} data-field-id="frm0605:itemMannerOfPayment:_3" data-print-control="radio" disabled id="frm0605:itemMannerOfPayment:_3" type="radio"/>
                                  <span class="iceSelOneRb style2"
                                    >Tax Deposit/Advance Payment</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><input aria-label="_4" checked={model.checks["frm0605:itemMannerOfPayment:_4"] ?? false} data-field-id="frm0605:itemMannerOfPayment:_4" data-print-control="radio" disabled id="frm0605:itemMannerOfPayment:_4" type="radio"/>
                                  <span class="iceSelOneRb style2"
                                    >Income Tax Second Installment(Individual)</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><input aria-label="_5" checked={model.checks["frm0605:itemMannerOfPayment:_5"] ?? false} data-field-id="frm0605:itemMannerOfPayment:_5" data-print-control="radio" disabled id="frm0605:itemMannerOfPayment:_5" type="radio"/>
                                  <span class="iceSelOneRb style2"
                                    >Others(Specify)</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><input class="wh-source-size-30" aria-label="txtOthersName" data-field-id="frm0605:txtOthersName" data-print-control="text" data-print-value="" id="frm0605:txtOthersName" maxlength="60" readonly size="30" type="text" value={model.text["frm0605:txtOthersName"] ?? ""}>
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
                            class="iceSelOneRb wh-inline-7193cb83216c"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-abe04a7290a8"
                                  ><input aria-label="_1" checked={model.checks["frm0605:itemMannerOfPaymentB:_1"] ?? false} data-field-id="frm0605:itemMannerOfPaymentB:_1" data-print-control="radio" disabled id="frm0605:itemMannerOfPaymentB:_1" type="radio"/>
                                  <span class="iceSelOneRb style2"
                                    >Preliminary/Final Assess/Deficiency Tax</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><input aria-label="_2" checked={model.checks["frm0605:itemMannerOfPaymentB:_2"] ?? false} data-field-id="frm0605:itemMannerOfPaymentB:_2" data-print-control="radio" disabled id="frm0605:itemMannerOfPaymentB:_2" type="radio"/>
                                  <span class="iceSelOneRb style2"
                                    >Accounts Receivable/Delinquent Account</span
                                  ></td
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
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTdPart">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-7b70192016f2"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-47f27697dacc">
                                  <span class="wh-inline-4cf6c17959a7"
                                    >Part II</span
                                  ></td
                                >
                                <td class="wh-inline-91f961623baa">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-6217d6f49f24"
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
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-039f43351894"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-f1068357c025"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    19
                                  </span></td
                                >
                                <td class="wh-inline-f67e009bd6b7"
                                  ><span class="wh-inline-cb3a2164388b">
                                    Basic Tax/Deposit/Advance Payment
                                  </span></td
                                >
                                <td class="wh-inline-e49ff48f86a8">
                                  <div class="spacePadder"></div>
                                </td>
                                <td class="wh-inline-aa8b5ba8f93f"
                                  ><span class="spacePadder"
                                    ><span class="wh-inline-4cf6c17959a7"
                                      >19</span
                                    >
                                    <input aria-label="txtTax19" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm0605:txtTax19" data-print-control="text" data-print-value="" id="frm0605:txtTax19" maxlength="17" readonly size="20" type="text" value={model.text["frm0605:txtTax19"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-4cf6c17959a7">
                                    20
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
                                  <table class="wh-inline-80d09c75525e">
                                    <tbody>
                                      <tr>
                                        <td class="wh-inline-e8d6739fc4b5"
                                          ><span class="wh-inline-429482632af7"
                                            >Surcharge</span
                                          ></td
                                        >
                                        <td class="wh-inline-f7c8874e989f"
                                          ><span class="wh-inline-429482632af7"
                                            >Interest</span
                                          ></td
                                        >
                                        <td class="wh-inline-84a3bc4a33d3"
                                          ><span class="wh-inline-429482632af7"
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
                                  <table class="wh-inline-8922fb1531b1">
                                    <tbody>
                                      <tr>
                                        <td class="wh-inline-0230f4d0bc66">
                                          <span class="wh-inline-649b1ec8a1ed"
                                            ><b>20A</b>
                                            <input aria-label="txtTax20A" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm0605:txtTax20A" data-print-control="text" data-print-value="" id="frm0605:txtTax20A" maxlength="17" readonly size="20" type="text" value={model.text["frm0605:txtTax20A"] ?? ""}>
                                          </span>
                                        </td>
                                        <td class="wh-inline-bae72bc39f43">
                                          <span class="wh-inline-649b1ec8a1ed"
                                            ><b>20B</b>
                                            <input aria-label="txtTax20B" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm0605:txtTax20B" data-print-control="text" data-print-value="" id="frm0605:txtTax20B" maxlength="17" readonly size="20" type="text" value={model.text["frm0605:txtTax20B"] ?? ""}>
                                          </span>
                                        </td>
                                        <td class="wh-inline-bae72bc39f43">
                                          <span class="wh-inline-649b1ec8a1ed"
                                            ><b>20C</b>
                                            <input aria-label="txtTax20C" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm0605:txtTax20C" data-print-control="text" data-print-value="" id="frm0605:txtTax20C" maxlength="17" readonly size="20" type="text" value={model.text["frm0605:txtTax20C"] ?? ""}>
                                          </span>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td>
                                  <div class="spacePadder">
                                    <span class="wh-inline-4cf6c17959a7"
                                      >20D</span
                                    >
                                    <input aria-label="txtTax20D" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm0605:txtTax20D" data-print-control="text" data-print-value="" id="frm0605:txtTax20D" maxlength="25" readonly size="20" type="text" value={model.text["frm0605:txtTax20D"] ?? ""}>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-4cf6c17959a7">
                                    21
                                  </span></td
                                >
                                <td colspan="2"
                                  ><span class="wh-inline-cb3a2164388b">
                                    Total Amount Payable(Sum of Items 19 &amp;
                                    20D)</span
                                  ></td
                                >
                                <td>
                                  <div class="spacePadder">
                                    <span class="wh-inline-4cf6c17959a7"
                                      >21</span
                                    >
                                    <input aria-label="txtTax21" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm0605:txtTax21" data-print-control="text" data-print-value="" id="frm0605:txtTax21" maxlength="25" readonly size="20" type="text" value={model.text["frm0605:txtTax21"] ?? ""}>
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
                    class="tblForm wh-inline-868be37391c9"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd">
                          <div class="wh-inline-a30033456d9a">
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="iceSelOneRb-dis wh-inline-c55d7695fe70"
                            >
                              <tbody
                                ><tr>
                                  <td
                                    ><input aria-label="_1" checked={model.checks["frm0605:itemApprovedYN:_1"] ?? false} data-field-id="frm0605:itemApprovedYN:_1" data-print-control="radio" disabled id="frm0605:itemApprovedYN:_1" type="radio"/>
                                    <span class="iceSelOneRb-dis-dis"
                                      >Pre-approved by Investigating Office</span
                                    ></td
                                  >
                                  <td
                                    ><input aria-label="_2" checked={model.checks["frm0605:itemApprovedYN:_2"] ?? false} data-field-id="frm0605:itemApprovedYN:_2" data-print-control="radio" disabled id="frm0605:itemApprovedYN:_2" type="radio"/>
                                    <span class="iceSelOneRb-dis-dis"
                                      >Not approved by Investigating Office</span
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
              <tr>
                <td>
                  <div class="imgClass wh-inline-16749982e556">
                    <table class="wh-inline-c00332d11782">
                      <colgroup
                        ><col class="wh-inline-69652284d042" />
                        <col class="wh-inline-be7269108542" />
                        <col class="wh-inline-80c99a796975" />
                        <col class="wh-inline-f99c236f78b6" />
                      </colgroup><tbody
                        ><tr>
                          <td colspan="2"
                            ><b>For Voluntary Payment</b>
                            <br />
                            <br />
                            <br />I declare, under the penalties of perjury,
                            that this document has been
                            <br />made in good faith, verified by me, and to the
                            best of my knowledge and
                            <br />belief, is true and correct, pursuant to the
                            provisions of National
                            <br />Internal Revenue Code, as amended, and the
                            regulations issued under
                            <br />authority thereof.</td
                          >
                          <td class="wh-inline-02c6c5e8e0da"
                            >For Payment of Deficiency Taxes
                            <br />--
                            <br />From Audit/Investigation/
                            <br />Deliquent Account
                            <br />
                            <br />
                            <br />
                            <div class="wh-inline-d30be09fdb95">
                              APPROVED BY:
                            </div>
                            <br />
                          </td>
                          <td class="wh-inline-02c6c5e8e0da"
                            >Stamp of Receiving
                            <br />Office
                            <br />and Date of Receipt
                            <br />
                            <br />
                            <br />
                            <br />
                            <br />
                          </td>
                        </tr>
                        <tr>
                          <td
                            ><br /><b>22A</b
                            >__________________________________________
                            <br /><span class="wh-inline-5d6dbfb86dc0"
                              >Signature over Printed Name of
                              Taxpayer/Authorized Representative</span
                            ></td
                          >
                          <td
                            ><br />________________
                            <br /><span class="wh-inline-5d6dbfb86dc0"
                              >Title/Position of Signatory</span
                            ></td
                          >
                          <td class="wh-inline-02c6c5e8e0da"
                            ><b>22B</b>____________________
                            <br /><span class="wh-inline-5d6dbfb86dc0"
                              >Signature Over Printed Name of
                              <br />Head of Office</span
                            ></td
                          >
                          <td class="wh-inline-02c6c5e8e0da">
                            <br />
                            <br />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="imgClass wh-inline-16749982e556">
                    <img
                      alt="BIR form identifying mark"
                      class="wh-inline-5dfba9815e30"
                      id="frm0605_2:jurat"
                      src="/legacy/img/withholding/original-835c69413368f3b0.jpg"
                      width="830"
                    />
                  </div>
                  <div class="imgClass wh-inline-16749982e556">
                    <table class="wh-inline-9bdcb5cfc112">
                      <tbody
                        ><tr>
                          <td
                            >Machine Validation/Revenue Official Receipt Details
                            (If not filed with the bank)<br /><br /><br /><br
                            /><br /></td
                          >
                        </tr>
                        <tr>
                          <td class="wh-inline-163ebcb5ea49"
                            ><span class="wh-inline-5d6dbfb86dc0"
                              >Taxpayer Classification:    I - Individual    N -
                              Non-Individual</span
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
        <h2>BIR Form 0605 — {continuation.title}</h2>
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
