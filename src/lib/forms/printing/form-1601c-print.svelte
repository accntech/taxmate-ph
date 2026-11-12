<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1601c:j_id201",
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
    "fallback": "2017"
  },
  {
    "id": "frm1601c:j_id217:_1",
    "source": "frm1601c:j_id217",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:j_id217:_2",
    "source": "frm1601c:j_id217",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601c:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1601c:j_id252:_1",
    "source": "frm1601c:j_id252",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:j_id252:_2",
    "source": "frm1601c:j_id252",
    "choice": "N",
    "checked": false
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
    "id": "frm1601c:txtLineBus",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtPayerName",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1601c:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1601c:CategoryAgent_1",
    "source": "frm1601c:j_id392",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1601c:CategoryAgent_2",
    "source": "frm1601c:j_id392",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1601c:j_id398:_1",
    "source": "frm1601c:j_id398",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:j_id398:_2",
    "source": "frm1601c:j_id398",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601c:selTreaty",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty"
    }
  },
  {
    "id": "frm1601c:txtATC",
    "fallback": "WW010"
  },
  {
    "id": "frm1601c:txtTax15",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax16A",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax16B",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax16C",
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
    "id": "frm1601c:txtTax20",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax21A",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax21B",
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
    "id": "frm1601c:txtTax24A",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax24B",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax24C",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax24D",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax25",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:SelMonthYear1_1",
    "source": "frm1601c:SectionA:SelMonthYear1_1",
    "choice": "M",
    "checked": false
  },
  {
    "id": "frm1601c:SectionA:SelMonthYear1_2",
    "source": "frm1601c:SectionA:SelMonthYear1_1",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:SectionA:TxtMonthYearRadio1",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtDatePaidRadio1",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtRORNoRadio1",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtBankCodeRadio1",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:SelMonthYear2_1",
    "source": "frm1601c:SectionA:SelMonthYear2",
    "choice": "M",
    "checked": false
  },
  {
    "id": "frm1601c:SectionA:SelMonthYear2_2",
    "source": "frm1601c:SectionA:SelMonthYear2",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:SectionA:TxtMonthYearRadio2",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtDatePaidRadio2",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtRORNoRadio2",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtBankCodeRadio2",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:SelMonthYear3_1",
    "source": "frm1601c:SectionA:SelMonthYear3",
    "choice": "M",
    "checked": false
  },
  {
    "id": "frm1601c:SectionA:SelMonthYear3_2",
    "source": "frm1601c:SectionA:SelMonthYear3",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601c:SectionA:TxtMonthYearRadio3",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtDatePaidRadio3",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtRORNoRadio3",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtBankCodeRadio3",
    "fallback": ""
  },
  {
    "id": "frm1601c:SectionA:TxtTaxPaidRadio1",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtShouldTaxDueRadio1",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtCurrentYearRadio1",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtFromYearEndRadio1",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtTaxPaidRadio2",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtShouldTaxDueRadio2",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtCurrentYearRadio2",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtFromYearEndRadio2",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtTaxPaidRadio3",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtShouldTaxDueRadio3",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtCurrentYearRadio3",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:SectionA:TxtFromYearEndRadio3",
    "fallback": "0.00"
  },
  {
    "id": "frm1601c:txtTax26",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1601C", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1601C"
  aria-label="BIR Form 1601C print preview"
>
  <div
    class="withholding-print-page-content wh-page-1601c-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-cbc1b88bc8ec" id="wrapper">
      <div id="formPaper">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-9383a0774137"
      >
        <tbody
          ><tr
            ><td>
              <div class="compensation-main-section">
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="wh-inline-a9c35cd8fd89"
                >
                  <tbody
                    ><tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="wh-inline-7f590d12237d"
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
                                  <br />Kawanihan ng Rentas Internas
                                </span></td
                              >
                              <td class="wh-inline-a30033456d9a">
                                <span class="wh-inline-1b29e9eb50ae"
                                  >Monthly Remittance Return<br />of Income
                                  Taxes Withheld<br />on Compensation</span
                                >
                              </td>
                              <td class="wh-inline-17b28d4523d2">
                                <span class="wh-inline-429482632af7"
                                  >BIR Form No.<br /></span
                                >
                                <span class="wh-inline-c1d61ad77e0f"
                                  >1601-C<br /></span
                                >
                                <span class="wh-inline-429482632af7"
                                  >July 2008 (ENCS)</span
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
                          class="tblForm wh-inline-5a315681b67d"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-c41245a21ae5">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-940c582bb61f"
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
                                        <span aria-label="j_id201" class="iceSelOneMnu fieldSelect1 labels wh-print-select" data-field-id="frm1601c:j_id201" data-print-control="select" id="frm1601c:j_id201">{model.text["frm1601c:j_id201"] ?? ""}</span>
                                      </td>
                                      <td class="wh-inline-9f262eec8c33">
                                        <input aria-label="txtYear" class="wh-inline-fc1877413f42" data-field-id="frm1601c:txtYear" data-print-control="text" data-print-value="" id="frm1601c:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1601c:txtYear"] ?? ""}></td
                                      >
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-a48711e589f6">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-73aade977344"
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
                                              class="iceSelOneRb-dis fieldText1-dis wh-inline-44a79f13a368"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="_1" checked={model.checks["frm1601c:j_id217:_1"] ?? false} data-field-id="frm1601c:j_id217:_1" data-print-control="radio" disabled id="frm1601c:j_id217:_1" type="radio"/><span
                                                      class="wh-inline-766562615de5"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="_2" checked={model.checks["frm1601c:j_id217:_2"] ?? false} data-field-id="frm1601c:j_id217:_2" data-print-control="radio" disabled id="frm1601c:j_id217:_2" type="radio"/><span
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
                              <td class="tblFormTd wh-inline-a0823b7087e7">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-5da5f25c0f36"
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
                                        ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1601c:txtSheets" data-print-control="text" data-print-value="" id="frm1601c:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1601c:txtSheets"] ?? ""}></td
                                      >
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-37a54156c6bf">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-e2e223b8e80b"
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
                                          id="frm1601c:j_id252"
                                        >
                                          <div class="wh-inline-5c8a2699196f">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="iceSelOneRb fieldText1 wh-inline-158b30732091"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="_1" checked={model.checks["frm1601c:j_id252:_1"] ?? false} data-field-id="frm1601c:j_id252:_1" data-print-control="radio" disabled id="frm1601c:j_id252:_1" type="radio"/><span
                                                      class="wh-inline-766562615de5"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="_2" checked={model.checks["frm1601c:j_id252:_2"] ?? false} data-field-id="frm1601c:j_id252:_2" data-print-control="radio" disabled id="frm1601c:j_id252:_2" type="radio"/><span
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
                          class="tblForm wh-inline-5a315681b67d"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTdPart">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-a20f6284965f"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-2bf0f868d38c">
                                        <span class="wh-inline-dd2eceacf41a"
                                          >Part I</span
                                        ></td
                                      >
                                      <td class="wh-inline-79f7ff9a20ed">
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
                          class="tblForm wh-inline-5a315681b67d"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-aa10a2275bb2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-a573e5f44cba"
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
                                          <input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm1601c:txtTIN1" data-print-control="text" data-print-value="" id="frm1601c:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm1601c:txtTIN1"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm1601c:txtTIN2" data-print-control="text" data-print-value="" id="frm1601c:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm1601c:txtTIN2"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm1601c:txtTIN3" data-print-control="text" data-print-value="" id="frm1601c:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm1601c:txtTIN3"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm1601c:txtBranchCode" data-print-control="text" data-print-value="" id="frm1601c:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1601c:txtBranchCode"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-3969ec6c4131">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-b5a0fd318e35"
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
                              <td class="tblFormTd wh-inline-be7cb68d622e">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-e05286ce4759"
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
                                          <input aria-label="txtLineBus" class="iceInpTxt-dis disabled-dis wh-source-size-27" data-field-id="frm1601c:txtLineBus" data-print-control="text" data-print-value="" id="frm1601c:txtLineBus" maxlength="60" readonly size="27" type="text" value={model.text["frm1601c:txtLineBus"] ?? ""}>
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
                          class="tblForm wh-inline-5a315681b67d"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-56c4a5cf6322"
                                >
                                  <tbody
                                    ><tr>
                                      <td>
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-56c4a5cf6322"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-6e606d24db7d"
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
                                          class="wh-inline-56c4a5cf6322"
                                        >
                                          <tbody
                                            ><tr>
                                              <td
                                                class="wh-inline-6b6ee2d44756"
                                              >
                                              </td>
                                              <td
                                                ><input class="wh-source-size-70" aria-label="txtPayerName" data-field-id="frm1601c:txtPayerName" data-print-control="text" data-print-value="" id="frm1601c:txtPayerName" maxlength="50" readonly size="70" type="text" value={model.text["frm1601c:txtPayerName"] ?? ""}></td
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
                                  class="wh-inline-240d48b0a85c"
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
                                          <input class="wh-source-size-15" aria-label="txtTelNum" data-field-id="frm1601c:txtTelNum" data-print-control="text" data-print-value="" id="frm1601c:txtTelNum" maxlength="20" readonly size="15" type="text" value={model.text["frm1601c:txtTelNum"] ?? ""}>
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
                          class="tblForm wh-inline-5a315681b67d"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-c664df06286c">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-49d1cfe972d7"
                                >
                                  <tbody
                                    ><tr>
                                      <td>
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-49d1cfe972d7"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-6e606d24db7d"
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
                                          class="wh-inline-49d1cfe972d7"
                                        >
                                          <tbody
                                            ><tr>
                                              <td
                                                class="wh-inline-6b6ee2d44756"
                                              >
                                              </td>
                                              <td
                                                ><input class="wh-source-size-105" aria-label="txtAddress" data-field-id="frm1601c:txtAddress" data-print-control="text" data-print-value="" id="frm1601c:txtAddress" maxlength="150" readonly size="105" type="text" value={model.text["frm1601c:txtAddress"] ?? ""}></td
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
                          class="tblForm wh-inline-791ae3b18231"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-d252709062fc">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-9098d99e9cce"
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
                                            id="frm1601c:j_id392"
                                          >
                                            <div class="wh-inline-5c8a2699196f">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb fieldText1 wh-inline-b63aacdca7b1"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      ><input aria-label="CategoryAgent_1" checked={model.checks["frm1601c:CategoryAgent_1"] ?? false} data-field-id="frm1601c:CategoryAgent_1" data-print-control="radio" disabled id="frm1601c:CategoryAgent_1" type="radio"/><span
                                                        class="wh-inline-df8bcce4c703"
                                                        >Private</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="CategoryAgent_2" checked={model.checks["frm1601c:CategoryAgent_2"] ?? false} data-field-id="frm1601c:CategoryAgent_2" data-print-control="radio" disabled id="frm1601c:CategoryAgent_2" type="radio"/><span
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
                              <td class="tblFormTd wh-inline-b425dbcde2f7">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-cb7eec0c523c"
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
                                        <div
                                          class="wh-inline-0f5c389acf29"
                                          id="frm1601c:j_id398"
                                        >
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-46d4f2462766"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  ><input aria-label="_1" checked={model.checks["frm1601c:j_id398:_1"] ?? false} data-field-id="frm1601c:j_id398:_1" data-print-control="radio" disabled id="frm1601c:j_id398:_1" type="radio"/><span
                                                    class="wh-inline-766562615de5"
                                                    >Yes</span
                                                  >
                                                </td>
                                                <td
                                                  ><input aria-label="_2" checked={model.checks["frm1601c:j_id398:_2"] ?? false} data-field-id="frm1601c:j_id398:_2" data-print-control="radio" disabled id="frm1601c:j_id398:_2" type="radio"/>
                                                  <span
                                                    class="wh-inline-766562615de5"
                                                    >No</span
                                                  ></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                          <span
                                            class="iceOutLbl fieldLabel1"
                                            id="frm1601c:j_id401"
                                            >If yes, specify</span
                                          >
                                          <span aria-label="selTreaty" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1601c:selTreaty" data-print-control="select" id="frm1601c:selTreaty">{model.text["frm1601c:selTreaty"] ?? ""}</span>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-d252709062fc">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-15f78107a525"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-7777c2f5e271"
                                        ><span class="wh-inline-4cf6c17959a7">
                                          14
                                        </span><span
                                          class="wh-inline-cb3a2164388b"
                                          >ATC</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <input aria-label="txtATC" class="iceInpTxt-dis disabled-dis wh-inline-0467954d6d1a wh-source-size-15" data-field-id="frm1601c:txtATC" data-print-control="text" data-print-value="" id="frm1601c:txtATC" maxlength="20" readonly size="15" type="text" value={model.text["frm1601c:txtATC"] ?? ""}>
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
                          class="tblForm wh-inline-5a315681b67d"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTdPart">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-a20f6284965f"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-36fe9f8cef2e">
                                        <span class="wh-inline-dd2eceacf41a"
                                          >Part II</span
                                        ></td
                                      >
                                      <td class="wh-inline-f8ee3560ed06">
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
                          class="tblForm wh-inline-96a4c96170f9"
                        >
                          <colgroup
                            ><col class="wh-inline-ddeef09a9a23" /><col
                              class="wh-inline-8217b972bd3b"
                            /><col class="wh-inline-f7c49be501ad" /><col
                              class="wh-inline-c8494597e7b2"
                            /></colgroup
                          >
                          <tbody
                            ><tr>
                              <td class="tblFormTd" colspan="4">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-1c938c99ea38"
                                >
                                  <colgroup
                                    ><col class="wh-inline-ddeef09a9a23" /><col
                                      class="wh-inline-8217b972bd3b"
                                    /><col class="wh-inline-f7c49be501ad" /><col
                                      class="wh-inline-c8494597e7b2"
                                    /></colgroup
                                  >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-ddeef09a9a23"> </td>
                                      <td class="wh-inline-37a94ab1ea1d"
                                        >Particulars</td
                                      >
                                      <td class="wh-inline-96397d5cc209"
                                        >Amount of Compensation</td
                                      >
                                      <td class="wh-inline-306370275106"
                                        >Tax Due</td
                                      >
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-4cf6c17959a7">
                                          15
                                        </span></td
                                      >
                                      <td
                                        ><span class="wh-inline-cb3a2164388b">
                                          Total Amount of Compensation
                                        </span></td
                                      >
                                      <td>
                                        <div class="spacePadder">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >15</span
                                          >
                                          <input aria-label="txtTax15" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax15" data-print-control="text" data-print-value="" id="frm1601c:txtTax15" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax15"] ?? ""}>
                                        </div>
                                      </td>
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-4cf6c17959a7">
                                          16
                                        </span></td
                                      >
                                      <td
                                        ><span class="wh-inline-cb3a2164388b">
                                          Less: Non Taxable Compensation</span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-75deb5086702"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-f1068357c025"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  >16A
                                                </span></td
                                              >
                                              <td class="wh-inline-79eb31517fd2"
                                                ><span
                                                  class="wh-inline-429482632af7"
                                                  >Statutory Minimum Wage (MWEs)</span
                                                ><span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><span class="spacePadder">
                                                  </span>
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table></td
                                      >
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-57715f801672"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-65d1fb1d72a7"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  >16A</span
                                                ></td
                                              >
                                              <td class="wh-inline-9775858d4284"
                                                ><span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><span class="spacePadder">
                                                    <input aria-label="txtTax16A" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax16A" data-print-control="text" data-print-value="" id="frm1601c:txtTax16A" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax16A"] ?? ""}>
                                                  </span>
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table></td
                                      >
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-75deb5086702"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-f1068357c025"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  >16B
                                                </span></td
                                              >
                                              <td class="wh-inline-79eb31517fd2"
                                                ><span
                                                  class="wh-inline-429482632af7"
                                                  >Holiday Pay, Overtime Pay,
                                                  Night Shift, Differential Pay,
                                                  Hazard Pay (Minimum Wage
                                                  Earner)</span
                                                ></td
                                              >
                                            </tr>
                                          </tbody>
                                        </table></td
                                      >
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-57715f801672"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-65d1fb1d72a7"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  >16B</span
                                                ></td
                                              >
                                              <td class="wh-inline-9775858d4284"
                                                ><span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><span class="spacePadder">
                                                    <input aria-label="txtTax16B" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax16B" data-print-control="text" data-print-value="" id="frm1601c:txtTax16B" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax16B"] ?? ""}>
                                                  </span>
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <span class="spacePadder"> </span></td
                                      >
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-75deb5086702"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-f1068357c025"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  >16C
                                                </span></td
                                              >
                                              <td class="wh-inline-79eb31517fd2"
                                                ><span
                                                  class="wh-inline-429482632af7"
                                                  >Other Non-Taxable
                                                  Compensation</span
                                                ><span
                                                  class="wh-inline-649b1ec8a1ed"
                                                >
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table></td
                                      >
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-57715f801672"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-65d1fb1d72a7"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  >16C</span
                                                ></td
                                              >
                                              <td class="wh-inline-9775858d4284"
                                                ><span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><span class="spacePadder">
                                                    <input aria-label="txtTax16C" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax16C" data-print-control="text" data-print-value="" id="frm1601c:txtTax16C" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax16C"] ?? ""}>
                                                  </span>
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <span class="spacePadder"> </span></td
                                      >
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-4cf6c17959a7">
                                          17
                                        </span></td
                                      >
                                      <td
                                        ><span class="wh-inline-cb3a2164388b">
                                          Taxable Compensation</span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >17</span
                                          >
                                          <input aria-label="txtTax17" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax17" data-print-control="text" data-print-value="" id="frm1601c:txtTax17" maxlength="21" readonly size="20" type="text" value={model.text["frm1601c:txtTax17"] ?? ""}>
                                        </div>
                                      </td>
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td
                                        ><span class="wh-inline-4cf6c17959a7">
                                          18
                                        </span></td
                                      >
                                      <td
                                        ><span class="wh-inline-cb3a2164388b">
                                          Tax Required to be Withheld</span
                                        ></td
                                      >
                                      <td> </td>
                                      <td>
                                        <div class="spacePadder">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >18</span
                                          >
                                          <input aria-label="txtTax18" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax18" data-print-control="text" data-print-value="" id="frm1601c:txtTax18" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax18"] ?? ""}>
                                        </div>
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
                                          Add/Less: Adjustment (from Item 25 of
                                          Section A)</span
                                        ></td
                                      >
                                      <td> </td>
                                      <td>
                                        <div class="spacePadder">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >19</span
                                          >
                                          <input aria-label="txtTax19" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax19" data-print-control="text" data-print-value="" id="frm1601c:txtTax19" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax19"] ?? ""}>
                                        </div>
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
                                          Tax Required to be Withheld for
                                          Remittance</span
                                        ></td
                                      >
                                      <td> </td>
                                      <td>
                                        <div class="spacePadder">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >20</span
                                          >
                                          <input aria-label="txtTax20" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax20" data-print-control="text" data-print-value="" id="frm1601c:txtTax20" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax20"] ?? ""}>
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
                                          Less: Tax Remitted In Return
                                          Previously Filed, if this is an
                                          amended return</span
                                        ></td
                                      >
                                      <td>
                                        <span class="spacePadder">
                                          <span class="wh-inline-15663751d502"
                                            >21A
                                          </span>
                                          <span class="wh-inline-649b1ec8a1ed">
                                            <input aria-label="txtTax21A" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax21A" data-print-control="text" data-print-value="" id="frm1601c:txtTax21A" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax21A"] ?? ""}>
                                          </span>
                                        </span></td
                                      >
                                    </tr></tbody
                                  >
                                </table></td
                              >
                            </tr>
                            <tr>
                              <td> </td>
                              <td colspan="2"
                                ><span class="wh-inline-429482632af7"
                                  >Other Payments Made (please attach proof of
                                  payment BIR Form No. 0605)</span
                                ></td
                              >
                              <td
                                ><span class="spacePadder">
                                  <span class="wh-inline-15663751d502">21B</span
                                  >
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtTax21B" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601c:txtTax21B" data-print-control="text" data-print-value="" id="frm1601c:txtTax21B" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax21B"] ?? ""}>
                                  </span>
                                </span></td
                              >
                            </tr>
                            <tr>
                              <td
                                ><span class="wh-inline-4cf6c17959a7">
                                  22
                                </span></td
                              >
                              <td colspan="2"
                                ><span class="wh-inline-429482632af7"
                                  >Total Tax Payments Made (Sum of Item Nos. 21A
                                  &amp; 21B)</span
                                ></td
                              >
                              <td
                                ><span class="spacePadder"
                                  ><span class="wh-inline-4cf6c17959a7">22</span
                                  >
                                  <input aria-label="txtTax22" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax22" data-print-control="text" data-print-value="" id="frm1601c:txtTax22" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax22"] ?? ""}>
                                </span></td
                              >
                            </tr>
                            <tr>
                              <td
                                ><span class="wh-inline-4cf6c17959a7">
                                  23
                                </span></td
                              >
                              <td colspan="2"
                                ><span class="wh-inline-cb3a2164388b">
                                  Tax Still Due/(Overremittance) (Item No. 20
                                  less item No. 22)</span
                                ></td
                              >
                              <td>
                                <div class="spacePadder">
                                  <span class="wh-inline-4cf6c17959a7">23</span>
                                  <input aria-label="txtTax23" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax23" data-print-control="text" data-print-value="" id="frm1601c:txtTax23" maxlength="25" readonly size="20" type="text" value={model.text["frm1601c:txtTax23"] ?? ""}>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                ><span class="wh-inline-4cf6c17959a7">
                                  24
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
                                <table class="wh-inline-8f6d039a8851">
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
                                <table
                                  border="0"
                                  class="wh-inline-f8248f6faf25"
                                >
                                  <tbody>
                                    <tr>
                                      <td class="wh-inline-84a3bc4a33d3">
                                        <span class="wh-inline-649b1ec8a1ed"
                                          ><b>24A</b>
                                          <input aria-label="txtTax24A" class="wh-inline-80ec55322565 wh-source-size-16" data-field-id="frm1601c:txtTax24A" data-print-control="text" data-print-value="" id="frm1601c:txtTax24A" maxlength="21" readonly size="16" type="text" value={model.text["frm1601c:txtTax24A"] ?? ""}>
                                        </span>
                                      </td>
                                      <td class="wh-inline-84a3bc4a33d3">
                                        <span class="wh-inline-649b1ec8a1ed"
                                          ><b>24B</b>
                                          <input aria-label="txtTax24B" class="wh-inline-386bb5d6139a wh-source-size-16" data-field-id="frm1601c:txtTax24B" data-print-control="text" data-print-value="" id="frm1601c:txtTax24B" maxlength="21" readonly size="16" type="text" value={model.text["frm1601c:txtTax24B"] ?? ""}>
                                        </span>
                                      </td>
                                      <td class="wh-inline-84a3bc4a33d3">
                                        <span class="wh-inline-649b1ec8a1ed"
                                          ><b>24C</b>
                                          <input aria-label="txtTax24C" class="wh-inline-386bb5d6139a wh-source-size-16" data-field-id="frm1601c:txtTax24C" data-print-control="text" data-print-value="" id="frm1601c:txtTax24C" maxlength="21" readonly size="16" type="text" value={model.text["frm1601c:txtTax24C"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td>
                                <div class="spacePadder">
                                  <span class="wh-inline-4cf6c17959a7">24D</span
                                  >
                                  <input aria-label="txtTax24D" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax24D" data-print-control="text" data-print-value="" id="frm1601c:txtTax24D" maxlength="21" readonly size="20" type="text" value={model.text["frm1601c:txtTax24D"] ?? ""}>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td
                                ><span class="wh-inline-4cf6c17959a7">
                                  25
                                </span></td
                              >
                              <td colspan="2"
                                ><span class="wh-inline-cb3a2164388b">
                                  Tax Amount Still Due/(Overremittance)</span
                                ></td
                              >
                              <td>
                                <div class="spacePadder">
                                  <span class="wh-inline-4cf6c17959a7">25</span>
                                  <input aria-label="txtTax25" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax25" data-print-control="text" data-print-value="" id="frm1601c:txtTax25" maxlength="21" readonly size="20" type="text" value={model.text["frm1601c:txtTax25"] ?? ""}>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div></td
            >
          </tr>
          <tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-651d1d4392b4"
                id="tblSched1"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-fe426a3054a4">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-5714969ae5fa"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-0840e3546057">
                              <span
                                class="wh-inline-36e99cec43d4"
                                id="frm1601c:j_id643">Section A</span
                              >
                              <a id="btnSectionAMore">more... </a>
                            </td>
                            <td class="wh-inline-fe426a3054a4">
                              <div class="wh-inline-6a51db3ec915">
                                <span class="wh-inline-dd2eceacf41a"
                                  >Adjustment of Taxes Withheld on Compensation
                                  For Previous Months</span
                                >
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-037da777ddf3" colspan="2">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-5714969ae5fa"
                              >
                                <thead>
                                  <tr>
                                    <th
                                      class="iceDatTblColHdr1 dataPaginatorTableColHdr1 dataPaginatorTableHdr wh-inline-8335891538d7"
                                      >Monthly/Yearly</th
                                    >
                                    <th
                                      class="iceDatTblColHdr1 dataPaginatorTableColHdr1 dataPaginatorTableHdr wh-inline-25b7190f8988"
                                      >Previous Month(s)/Year(1) (MM/YYYY)</th
                                    >
                                    <th
                                      class="iceDatTblColHdr1 dataPaginatorTableColHdr1 dataPaginatorTableHdr wh-inline-83a821f95875"
                                      >Date Paid (2) (MM/DD/YYYY)</th
                                    >
                                    <th
                                      class="iceDatTblColHdr1 dataPaginatorTableColHdr1 dataPaginatorTableHdr wh-inline-fd4064106e22"
                                      >Bank Validation/ROR No. (3)</th
                                    >
                                    <th
                                      class="iceDatTblColHdr1 dataPaginatorTableColHdr1 dataPaginatorTableHdr wh-inline-8a47a40b4c42"
                                      >Bank Code (4)</th
                                    >
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      <fieldset
                                        id="frm1601c:sectionBegin:0:j_id654"
                                      >
                                        <div class="wh-inline-a30033456d9a">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-3863ea2e194a"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  ><input aria-label="SelMonthYear1_1" checked={model.checks["frm1601c:SectionA:SelMonthYear1_1"] ?? false} data-field-id="frm1601c:SectionA:SelMonthYear1_1" data-print-control="radio" disabled id="frm1601c:SectionA:SelMonthYear1_1" type="radio"/></td
                                                >
                                                <td
                                                  ><input aria-label="SelMonthYear1_2" checked={model.checks["frm1601c:SectionA:SelMonthYear1_2"] ?? false} data-field-id="frm1601c:SectionA:SelMonthYear1_2" data-print-control="radio" disabled id="frm1601c:SectionA:SelMonthYear1_2" type="radio"/></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </fieldset>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtMonthYearRadio1" class="wh-inline-80ec55322565 wh-source-size-10" data-field-id="frm1601c:SectionA:TxtMonthYearRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtMonthYearRadio1" maxlength="7" readonly size="10" type="text" value={model.text["frm1601c:SectionA:TxtMonthYearRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtDatePaidRadio1" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtDatePaidRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtDatePaidRadio1" maxlength="10" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtDatePaidRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtRORNoRadio1" class="wh-inline-80ec55322565 wh-source-size-18" data-field-id="frm1601c:SectionA:TxtRORNoRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtRORNoRadio1" maxlength="20" readonly size="18" type="text" value={model.text["frm1601c:SectionA:TxtRORNoRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtBankCodeRadio1" class="wh-inline-80ec55322565 wh-source-size-18" data-field-id="frm1601c:SectionA:TxtBankCodeRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtBankCodeRadio1" maxlength="6" readonly size="18" type="text" value={model.text["frm1601c:SectionA:TxtBankCodeRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <fieldset
                                        id="frm1601c:sectionBegin:0:j_id654"
                                      >
                                        <div class="wh-inline-a30033456d9a">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-3863ea2e194a"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  ><input aria-label="SelMonthYear2_1" checked={model.checks["frm1601c:SectionA:SelMonthYear2_1"] ?? false} data-field-id="frm1601c:SectionA:SelMonthYear2_1" data-print-control="radio" disabled id="frm1601c:SectionA:SelMonthYear2_1" type="radio"/></td
                                                >
                                                <td
                                                  ><input aria-label="SelMonthYear2_2" checked={model.checks["frm1601c:SectionA:SelMonthYear2_2"] ?? false} data-field-id="frm1601c:SectionA:SelMonthYear2_2" data-print-control="radio" disabled id="frm1601c:SectionA:SelMonthYear2_2" type="radio"/></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </fieldset>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtMonthYearRadio2" class="wh-inline-80ec55322565 wh-source-size-10" data-field-id="frm1601c:SectionA:TxtMonthYearRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtMonthYearRadio2" maxlength="7" readonly size="10" type="text" value={model.text["frm1601c:SectionA:TxtMonthYearRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtDatePaidRadio2" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtDatePaidRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtDatePaidRadio2" maxlength="10" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtDatePaidRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtRORNoRadio2" class="wh-inline-80ec55322565 wh-source-size-18" data-field-id="frm1601c:SectionA:TxtRORNoRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtRORNoRadio2" maxlength="20" readonly size="18" type="text" value={model.text["frm1601c:SectionA:TxtRORNoRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtBankCodeRadio2" class="wh-inline-80ec55322565 wh-source-size-18" data-field-id="frm1601c:SectionA:TxtBankCodeRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtBankCodeRadio2" maxlength="6" readonly size="18" type="text" value={model.text["frm1601c:SectionA:TxtBankCodeRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <fieldset
                                        class="iceSelOneRb fieldText1"
                                        id="frm1601c:sectionBegin:0:j_id654"
                                      >
                                        <div class="wh-inline-a30033456d9a">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="iceSelOneRb fieldText1 wh-inline-3863ea2e194a"
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  ><input aria-label="SelMonthYear3_1" checked={model.checks["frm1601c:SectionA:SelMonthYear3_1"] ?? false} data-field-id="frm1601c:SectionA:SelMonthYear3_1" data-print-control="radio" disabled id="frm1601c:SectionA:SelMonthYear3_1" type="radio"/></td
                                                >
                                                <td
                                                  ><input aria-label="SelMonthYear3_2" checked={model.checks["frm1601c:SectionA:SelMonthYear3_2"] ?? false} data-field-id="frm1601c:SectionA:SelMonthYear3_2" data-print-control="radio" disabled id="frm1601c:SectionA:SelMonthYear3_2" type="radio"/></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                        </div>
                                      </fieldset>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtMonthYearRadio3" class="wh-inline-80ec55322565 wh-source-size-10" data-field-id="frm1601c:SectionA:TxtMonthYearRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtMonthYearRadio3" maxlength="7" readonly size="10" type="text" value={model.text["frm1601c:SectionA:TxtMonthYearRadio3"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtDatePaidRadio3" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtDatePaidRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtDatePaidRadio3" maxlength="10" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtDatePaidRadio3"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtRORNoRadio3" class="wh-inline-80ec55322565 wh-source-size-18" data-field-id="frm1601c:SectionA:TxtRORNoRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtRORNoRadio3" maxlength="20" readonly size="18" type="text" value={model.text["frm1601c:SectionA:TxtRORNoRadio3"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtBankCodeRadio3" class="wh-inline-80ec55322565 wh-source-size-18" data-field-id="frm1601c:SectionA:TxtBankCodeRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtBankCodeRadio3" maxlength="6" readonly size="18" type="text" value={model.text["frm1601c:SectionA:TxtBankCodeRadio3"] ?? ""}>
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
                class="tblForm wh-inline-651d1d4392b4"
                id="tblSched2"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd wh-inline-edf1cbc15eb2">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-e94d29b872a3"
                      >
                        <tbody
                          ><tr>
                            <td class="wh-inline-2a72b65c5646" colspan="2">
                              <span class="wh-inline-649b1ec8a1ed">
                                <span
                                  class="iceOutLbl fieldLabel1 wh-inline-36e99cec43d4"
                                  id="frm1601c:j_id680"
                                  >Section A Continuation</span
                                ></span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td class="wh-inline-037da777ddf3" colspan="2">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-ad96f0f4cd0a"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-d4e264dc31d0"
                                      >T<span id="frm1601c:sectionCont:j_id685"
                                        >ax Paid(Excluding Penalties) for the
                                        Month/Year (5)</span
                                      ></td
                                    >
                                    <td class="wh-inline-d4e264dc31d0"
                                      ><span id="frm1601c:sectionCont:j_id688"
                                        >Should Be Tax Due for the Month Year
                                        (6)</span
                                      ></td
                                    >
                                    <td class="wh-inline-d4e264dc31d0"
                                      ><span id="frm1601c:sectionCont:j_id691"
                                        >From Current Year (7a)</span
                                      ></td
                                    >
                                    <td class="wh-inline-84addb55691b"
                                      ><span id="frm1601c:sectionCont:j_id694"
                                        >From Year-End Adjustment of the
                                        Immediately Preceding Year (7b)</span
                                      ></td
                                    >
                                  </tr>
                                  <tr>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtTaxPaidRadio1" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtTaxPaidRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtTaxPaidRadio1" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtTaxPaidRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtShouldTaxDueRadio1" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtShouldTaxDueRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtShouldTaxDueRadio1" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtShouldTaxDueRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtCurrentYearRadio1" class="wh-inline-4e484176e7ea wh-source-size-21" data-field-id="frm1601c:SectionA:TxtCurrentYearRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtCurrentYearRadio1" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtCurrentYearRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtFromYearEndRadio1" class="wh-inline-4e484176e7ea wh-source-size-21" data-field-id="frm1601c:SectionA:TxtFromYearEndRadio1" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtFromYearEndRadio1" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtFromYearEndRadio1"] ?? ""}>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtTaxPaidRadio2" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtTaxPaidRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtTaxPaidRadio2" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtTaxPaidRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtShouldTaxDueRadio2" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtShouldTaxDueRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtShouldTaxDueRadio2" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtShouldTaxDueRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtCurrentYearRadio2" class="wh-inline-4e484176e7ea wh-source-size-21" data-field-id="frm1601c:SectionA:TxtCurrentYearRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtCurrentYearRadio2" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtCurrentYearRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtFromYearEndRadio2" class="wh-inline-4e484176e7ea wh-source-size-21" data-field-id="frm1601c:SectionA:TxtFromYearEndRadio2" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtFromYearEndRadio2" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtFromYearEndRadio2"] ?? ""}>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtTaxPaidRadio3" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtTaxPaidRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtTaxPaidRadio3" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtTaxPaidRadio3"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtShouldTaxDueRadio3" class="wh-inline-80ec55322565 wh-source-size-21" data-field-id="frm1601c:SectionA:TxtShouldTaxDueRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtShouldTaxDueRadio3" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtShouldTaxDueRadio3"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtCurrentYearRadio3" class="wh-inline-4e484176e7ea wh-source-size-21" data-field-id="frm1601c:SectionA:TxtCurrentYearRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtCurrentYearRadio3" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtCurrentYearRadio3"] ?? ""}>
                                      </div>
                                    </td>
                                    <td>
                                      <div class="wh-inline-a30033456d9a">
                                        <input aria-label="TxtFromYearEndRadio3" class="wh-inline-4e484176e7ea wh-source-size-21" data-field-id="frm1601c:SectionA:TxtFromYearEndRadio3" data-print-control="text" data-print-value="" id="frm1601c:SectionA:TxtFromYearEndRadio3" maxlength="25" readonly size="21" type="text" value={model.text["frm1601c:SectionA:TxtFromYearEndRadio3"] ?? ""}>
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
                class="tblForm wh-inline-5714969ae5fa"
              >
                <tbody
                  ><tr>
                    <td class="tblFormTd">
                      <table border="0" class="wh-inline-31b448824b2a">
                        <tbody>
                          <tr>
                            <td class="wh-inline-55aaececa9cb" colspan="2">
                              <span
                                class="iceOutLbl fieldLabel1 wh-inline-32760dcebc79"
                                id="frm1601c:j_id702"
                                >26 Total (7a plus 7B) (To Item 19)</span
                              >
                            </td>
                            <td class="wh-inline-04ef5b6900c9">
                              <span class="wh-inline-649b1ec8a1ed"> </span>
                            </td>
                            <td class="wh-inline-586856f05e9b">
                              <span class="wh-inline-649b1ec8a1ed">
                                <input aria-label="txtTax26" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601c:txtTax26" data-print-control="text" data-print-value="" id="frm1601c:txtTax26" maxlength="15" readonly size="20" type="text" value={model.text["frm1601c:txtTax26"] ?? ""}>
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
              <div class="imgClass wh-inline-8d29b33adb02">
                <table class="wh-inline-e3a70b609836">
                  <colgroup
                    ><col class="wh-inline-73f83b4aa463" />
                    <col class="wh-inline-73f83b4aa463" />
                    <col class="wh-inline-73f83b4aa463" />
                    <col class="wh-inline-73f83b4aa463" />
                    <col class="wh-inline-1a5329f85423" />
                  </colgroup><tbody
                    ><tr>
                      <td colspan="5"
                        >We declare, under the penalties of perjury, that this
                        return has been made in good faith, verified by us, and
                        to the best of our knowledge and belief,
                        <br />is true and correct, pursuant to the provisions of
                        the National Internal Revenue Code, as amended, and the
                        regulations issued under authority thereof.<br /></td
                      >
                    </tr>
                    <tr>
                      <td colspan="4"
                        ><b>27</b
                        >_____________________________________________________________________
                        <br />President/Vice President/Principal
                        Officer/Accredited Tax Agent/
                        <br />Authorized Representative/Taxpayer
                        <br />(Signature Over Printed Name)</td
                      >
                      <td
                        ><b>28</b>_____________________________
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
                        <br />Tax Agent Acc. No./ Atty's Roll No. (If
                        Applicable)</td
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
              <div class="imgClass wh-inline-8d29b33adb02">
                <img
                  alt="BIR form identifying mark"
                  class="wh-inline-5dfba9815e30"
                  id="frm1601C:jurat"
                  src="/legacy/img/withholding/original-f9fe9556dc4e574d.jpg"
                  width="740"
                />
              </div>
              <div class="imgClass wh-inline-8f61cf6f3776">
                <table class="wh-inline-ea611ca1e85f">
                  <tbody
                    ><tr>
                      <td
                        >Machine Validation/Revenue Official Receipt Details (If
                        not filed with the bank)<br /><br /><br /><br /><br
                        /></td
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
  {#each model.continuations as continuation (continuation.id)}
    <div
      class="withholding-print-page-content wh-continuation-page"
      data-source-page="continuation"
    >
      <section class="original-continuation withholding-print-continuation">
        <h2>BIR Form 1601C — {continuation.title}</h2>
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
