<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1601F:j_id201",
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
    "id": "frm1601F:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1601F:AmendedRtn_1",
    "source": "frm1601F:AmendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601F:AmendedRtn_2",
    "source": "frm1601F:AmendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601F:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1601F:TaxWithheld_1",
    "source": "frm1601F:TaxWithheld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601F:TaxWithheld_2",
    "source": "frm1601F:TaxWithheld",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1601F:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1601F:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1601F:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1601F:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1601F:txtRDOCode"
  },
  {
    "id": "frm1601F:txtLineBus",
    "fallback": ""
  },
  {
    "id": "frm1601F:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1601F:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1601F:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1601F:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1601F:CatAgent_P",
    "source": "frm1601F:CatAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1601F:CatAgent_G",
    "source": "frm1601F:CatAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1601F:SpecialTax_1",
    "source": "frm1601F:SpecialTax",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601F:SpecialTax_2",
    "source": "frm1601F:SpecialTax",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601F:drpSpecialTax",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty",
      "3": "Both"
    }
  },
  {
    "id": "frm1601F:txtTax14",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax15",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax16",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax17",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax18",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax19A",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax19B",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax19C",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax19D",
    "fallback": "0.00"
  },
  {
    "id": "frm1601F:txtTax20",
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
    createWithholdingPrintModel("1601F", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1601F"
  aria-label="BIR Form 1601F print preview"
>
  <div
    class="withholding-print-page-content wh-page-1601f-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-fde09a05a8ff" id="wrapper">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-dbfdc079dcc8"
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
                    class="wh-inline-7e7f89d31885"
                  >
                    <tbody
                      ><tr>
                        <td>
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-deb4e9ba1184"
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
                                <td class="wh-inline-50b3c1e97946">
                                  <span class="wh-inline-aec978eca301"
                                    >Monthly Remittance Return of
                                    <br />Final Income Taxes Withheld</span
                                  >
                                </td>
                                <td class="wh-inline-17b28d4523d2">
                                  <span class="wh-inline-429482632af7"
                                    >BIR Form No.<br /></span
                                  >
                                  <span class="wh-inline-c1d61ad77e0f"
                                    >1601-F<br /></span
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-c41245a21ae5">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-eb0eaf0e314f"
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
                                            >For the Month (MM/YYYY)</span
                                          ></td
                                        >
                                      </tr>
                                      <tr>
                                        <td> </td>
                                        <td class="wh-inline-eb9f896c6842">
                                          <span aria-label="j_id201" class="labels wh-print-select" data-field-id="frm1601F:j_id201" data-print-control="select" id="frm1601F:j_id201">{model.text["frm1601F:j_id201"] ?? ""}</span>
                                        </td>
                                        <td class="wh-inline-05bd7d87897a">
                                          <input aria-label="txtYear" class="wh-inline-9f262eec8c33" data-field-id="frm1601F:txtYear" data-print-control="text" data-print-value="" id="frm1601F:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1601F:txtYear"] ?? ""}></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-c82af1f85dea">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-4ceda14630b7"
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
                                            id="frm1601F:j_id217"
                                          >
                                            <div class="wh-inline-5c8a2699196f">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb-dis fieldText1-dis wh-inline-35f2f2bccbeb"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      ><input aria-label="AmendedRtn_1" checked={model.checks["frm1601F:AmendedRtn_1"] ?? false} data-field-id="frm1601F:AmendedRtn_1" data-print-control="radio" disabled id="frm1601F:AmendedRtn_1" type="radio"/><span
                                                        class="wh-inline-766562615de5"
                                                        >Yes</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="AmendedRtn_2" checked={model.checks["frm1601F:AmendedRtn_2"] ?? false} data-field-id="frm1601F:AmendedRtn_2" data-print-control="radio" disabled id="frm1601F:AmendedRtn_2" type="radio"/><span
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
                                <td class="tblFormTd wh-inline-f4674c50c180">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-0dfbcd28e974"
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
                                          ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1601F:txtSheets" data-print-control="text" data-print-value="" id="frm1601F:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1601F:txtSheets"] ?? ""}></td
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
                                    class="wh-inline-311f99493b67"
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
                                            id="frm1601F:j_id252"
                                          >
                                            <div class="wh-inline-5c8a2699196f">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb fieldText1 wh-inline-098c9a8f549f"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      ><input aria-label="TaxWithheld_1" checked={model.checks["frm1601F:TaxWithheld_1"] ?? false} data-field-id="frm1601F:TaxWithheld_1" data-print-control="radio" disabled id="frm1601F:TaxWithheld_1" type="radio"/><span
                                                        class="wh-inline-766562615de5"
                                                        >Yes</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="TaxWithheld_2" checked={model.checks["frm1601F:TaxWithheld_2"] ?? false} data-field-id="frm1601F:TaxWithheld_2" data-print-control="radio" disabled id="frm1601F:TaxWithheld_2" type="radio"/><span
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTdPart">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-935f3d41125b"
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-aa10a2275bb2">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-40dc42f6e837"
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
                                            <input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm1601F:txtTIN1" data-print-control="text" data-print-value="" id="frm1601F:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm1601F:txtTIN1"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm1601F:txtTIN2" data-print-control="text" data-print-value="" id="frm1601F:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm1601F:txtTIN2"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm1601F:txtTIN3" data-print-control="text" data-print-value="" id="frm1601F:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm1601F:txtTIN3"] ?? ""}>
                                            <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm1601F:txtBranchCode" data-print-control="text" data-print-value="" id="frm1601F:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1601F:txtBranchCode"] ?? ""}>
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
                                    class="wh-inline-296168aa17c7"
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
                                <td class="tblFormTd wh-inline-d59f33637537">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-15248feb12f6"
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
                                            <input class="wh-source-size-32" aria-label="txtLineBus" data-field-id="frm1601F:txtLineBus" data-print-control="text" data-print-value="" id="frm1601F:txtLineBus" maxlength="60" readonly size="32" type="text" value={model.text["frm1601F:txtLineBus"] ?? ""}>
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-6269acaae5b6"
                                  >
                                    <tbody
                                      ><tr>
                                        <td>
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-6269acaae5b6"
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
                                            class="wh-inline-6269acaae5b6"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-6b6ee2d44756"
                                                >
                                                </td>
                                                <td
                                                  ><input class="wh-source-size-70" aria-label="txtTaxpayerName" data-field-id="frm1601F:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1601F:txtTaxpayerName" maxlength="50" readonly size="70" type="text" value={model.text["frm1601F:txtTaxpayerName"] ?? ""}></td
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
                                    class="wh-inline-4e53632e3b1b"
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
                                            <input class="wh-source-size-15" aria-label="txtTelNum" data-field-id="frm1601F:txtTelNum" data-print-control="text" data-print-value="" id="frm1601F:txtTelNum" maxlength="20" readonly size="15" type="text" value={model.text["frm1601F:txtTelNum"] ?? ""}>
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-b3d46a399619">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-2b62f4316ce7"
                                  >
                                    <tbody
                                      ><tr>
                                        <td>
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-2b62f4316ce7"
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
                                            class="wh-inline-2b62f4316ce7"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-6b6ee2d44756"
                                                >
                                                </td>
                                                <td
                                                  ><input class="wh-source-size-115" aria-label="txtAddress" data-field-id="frm1601F:txtAddress" data-print-control="text" data-print-value="" id="frm1601F:txtAddress" maxlength="150" readonly size="115" type="text" value={model.text["frm1601F:txtAddress"] ?? ""}></td
                                                >
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td class="tblFormTd wh-inline-626ed1720c9e">
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
                                            <input class="wh-source-size-2" aria-label="txtZipCode" data-field-id="frm1601F:txtZipCode" data-print-control="text" data-print-value="" id="frm1601F:txtZipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1601F:txtZipCode"] ?? ""}>
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-da0ceb3d95b7">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-51dae08f8066"
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
                                              id="frm1601F:j_id392"
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
                                                        ><input aria-label="CatAgent_P" checked={model.checks["frm1601F:CatAgent_P"] ?? false} data-field-id="frm1601F:CatAgent_P" data-print-control="radio" disabled id="frm1601F:CatAgent_P" type="radio"/><span
                                                          class="wh-inline-df8bcce4c703"
                                                          >Private</span
                                                        >
                                                      </td>
                                                      <td
                                                        ><input aria-label="CatAgent_G" checked={model.checks["frm1601F:CatAgent_G"] ?? false} data-field-id="frm1601F:CatAgent_G" data-print-control="radio" disabled id="frm1601F:CatAgent_G" type="radio"/><span
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
                                <td class="tblFormTd wh-inline-b1a9858a2f23">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-1c809f4b380e"
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
                                          <div class="wh-inline-a30033456d9a">
                                            <fieldset
                                              class="iceSelOneRb-dis fieldText1-dis wh-inline-ce3c0fe903e0"
                                              id="frm1601F:j_id398"
                                            >
                                              <div
                                                class="wh-inline-9284f1c636b2"
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  class="iceSelOneRb-dis fieldText1-dis wh-inline-46d4f2462766"
                                                >
                                                  <tbody>
                                                    <tr>
                                                      <td
                                                        ><input aria-label="SpecialTax_1" checked={model.checks["frm1601F:SpecialTax_1"] ?? false} data-field-id="frm1601F:SpecialTax_1" data-print-control="radio" disabled id="frm1601F:SpecialTax_1" type="radio"/><span
                                                          class="wh-inline-766562615de5"
                                                          >Yes</span
                                                        >
                                                      </td>
                                                      <td
                                                        ><input aria-label="SpecialTax_2" checked={model.checks["frm1601F:SpecialTax_2"] ?? false} data-field-id="frm1601F:SpecialTax_2" data-print-control="radio" disabled id="frm1601F:SpecialTax_2" type="radio"/><span
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
                                          <div class="wh-inline-9126384fe65b">
                                            <span
                                              class="iceOutLbl fieldLabel1"
                                              id="frm1601F:j_id401"
                                              >If yes, specify</span
                                            >
                                            <span aria-label="drpSpecialTax" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1601F:drpSpecialTax" data-print-control="select" id="frm1601F:drpSpecialTax">{model.text["frm1601F:drpSpecialTax"] ?? ""}</span>
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTdPart">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-45a1413b1c87"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-36fe9f8cef2e">
                                          <span class="wh-inline-4cf6c17959a7"
                                            >Part II</span
                                          ></td
                                        >
                                        <td class="wh-inline-f8ee3560ed06">
                                          <div class="wh-inline-a30033456d9a">
                                            <span class="wh-inline-6217d6f49f24"
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
                            class="tblForm wh-inline-4564742bfe81"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd wh-inline-3709648fafb2">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-7dcbb8c0d6ef"
                                    id="tblPartIIComputeTax"
                                  >
                                    <thead>
                                      <tr>
                                        <td class="wh-inline-69652284d042"
                                          ><span class="wh-inline-4cf6c17959a7">
                                          </span><span
                                            class="wh-inline-dd2eceacf41a"
                                            >NATURE OF INCOME PAYMENT
                                          </span></td
                                        >
                                        <td class="wh-inline-be93aa044c2c"
                                          ><a id="btnAddATCPartII">ATC </a>
                                        </td>
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
                                    <tbody id="tbodyComputeTax"
                                      >{#each model.atcRows as row, index (row.id)}<tr
                                          ><td class="wh-atc-description"
                                            >{row.description}</td
                                          >{#each row.cells as cell, cellIndex (cell.id)}<td
                                              ><input type="text" readonly aria-label={cell.id} class={["wh-inline-4be03d4e8cf1", "wh-inline-5f326564a568 wh-source-size-17", "wh-inline-437d83d00442", "wh-inline-5f326564a568 wh-source-size-16"][cellIndex]} size={[20, 17, 20, 16][cellIndex]} data-print-control="text" data-print-value data-field-id={cell.id} id={cell.id} value={cell.value} />{#if cellIndex === 2}%{/if}</td
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
                            class="tblForm wh-inline-f7bfa14f4e9e"
                          >
                            <tbody
                              ><tr>
                                <td class="tblFormTd">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-45a1413b1c87"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-3ef6362bb4b4"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            14
                                          </span></td
                                        >
                                        <td class="wh-inline-5fd1350a981f"
                                          ><span class="wh-inline-6d319e71fe1f"
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              >Total Tax Required to be Withheld</span
                                            ></span
                                          >
                                          <span class="wh-inline-97f71f169000"
                                            >based on Regular Rates</span
                                          ></td
                                        >
                                        <td class="wh-inline-7993ddde12b1">
                                          <div class="spacePadder"></div>
                                        </td>
                                        <td class="wh-inline-a963f7da22b0"
                                          ><span class="spacePadder"
                                            ><span
                                              class="wh-inline-4cf6c17959a7"
                                              >14</span
                                            >
                                            <input aria-label="txtTax14" class="wh-inline-f0b59ed3f479 wh-source-size-20" data-field-id="frm1601F:txtTax14" data-print-control="text" data-print-value="" id="frm1601F:txtTax14" maxlength="25" readonly size="20" type="text" value={model.text["frm1601F:txtTax14"] ?? ""}>
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
                                          ><span class="wh-inline-cb3a2164388b">
                                          </span><span
                                            class="wh-inline-97f71f169000"
                                            >Total Tax Required to be Withheld
                                            based on Tax Treaty Rates (from</span
                                          >
                                          <a id="btnAddSchedI">Schedule 1</a>)
                                        </td>
                                        <td>
                                          <div class="spacePadder"></div>
                                        </td>
                                        <td
                                          ><span class="spacePadder"
                                            ><span
                                              class="wh-inline-4cf6c17959a7"
                                              >15</span
                                            >
                                            <input aria-label="txtTax15" class="wh-inline-f0b59ed3f479 wh-source-size-20" data-field-id="frm1601F:txtTax15" data-print-control="text" data-print-value="" id="frm1601F:txtTax15" maxlength="25" readonly size="20" type="text" value={model.text["frm1601F:txtTax15"] ?? ""}>
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
                                          ><span class="wh-inline-cb3a2164388b">
                                          </span><span
                                            class="wh-inline-97f71f169000"
                                            >Total (Sum of Items 14 and 15)</span
                                          ><span class="wh-inline-232ced7b40ab">
                                          </span></td
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
                                            <input aria-label="txtTax16" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601F:txtTax16" data-print-control="text" data-print-value="" id="frm1601F:txtTax16" maxlength="25" readonly size="20" type="text" value={model.text["frm1601F:txtTax16"] ?? ""}>
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            17
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b">
                                          </span><span
                                            class="wh-inline-429482632af7"
                                            >Less : Tax Remitted in Return
                                            Previously Filed, if this is an
                                            amended return</span
                                          ></td
                                        >
                                        <td> </td>
                                        <td
                                          ><span class="spacePadder"
                                            ><span
                                              class="wh-inline-4cf6c17959a7"
                                              >17</span
                                            >
                                            <input aria-label="txtTax17" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601F:txtTax17" data-print-control="text" data-print-value="" id="frm1601F:txtTax17" maxlength="25" readonly size="20" type="text" value={model.text["frm1601F:txtTax17"] ?? ""}>
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            18
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b">
                                          </span><span
                                            class="wh-inline-97f71f169000"
                                            >Tax Still Due (Overremittance)</span
                                          ></td
                                        >
                                        <td> </td>
                                        <td
                                          ><span class="spacePadder"
                                            ><span
                                              class="wh-inline-4cf6c17959a7"
                                              >18</span
                                            >
                                            <input aria-label="txtTax18" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601F:txtTax18" data-print-control="text" data-print-value="" id="frm1601F:txtTax18" maxlength="25" readonly size="20" type="text" value={model.text["frm1601F:txtTax18"] ?? ""}>
                                          </span></td
                                        >
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            19
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
                                          <table class="wh-inline-cbcfd2b89c59">
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
                                          <table class="wh-inline-1144c71ee3bf">
                                            <tbody>
                                              <tr>
                                                <td
                                                  class="wh-inline-e8d6739fc4b5"
                                                >
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                    ><b>19A</b>
                                                    <input aria-label="txtTax19A" class="wh-inline-80ec55322565 wh-source-size-15" data-field-id="frm1601F:txtTax19A" data-print-control="text" data-print-value="" id="frm1601F:txtTax19A" maxlength="25" readonly size="15" type="text" value={model.text["frm1601F:txtTax19A"] ?? ""}>
                                                  </span>
                                                </td>
                                                <td
                                                  class="wh-inline-e8d6739fc4b5"
                                                >
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                    ><b>19B</b>
                                                    <input aria-label="txtTax19B" class="wh-inline-386bb5d6139a wh-source-size-15" data-field-id="frm1601F:txtTax19B" data-print-control="text" data-print-value="" id="frm1601F:txtTax19B" maxlength="25" readonly size="15" type="text" value={model.text["frm1601F:txtTax19B"] ?? ""}>
                                                  </span>
                                                </td>
                                                <td
                                                  class="wh-inline-84a3bc4a33d3"
                                                >
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                    ><b>19C</b>
                                                    <input aria-label="txtTax19C" class="wh-inline-386bb5d6139a wh-source-size-15" data-field-id="frm1601F:txtTax19C" data-print-control="text" data-print-value="" id="frm1601F:txtTax19C" maxlength="25" readonly size="15" type="text" value={model.text["frm1601F:txtTax19C"] ?? ""}>
                                                  </span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                        <td>
                                          <div class="spacePadder">
                                            <span class="wh-inline-4cf6c17959a7"
                                              >19D</span
                                            >
                                            <input aria-label="txtTax19D" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601F:txtTax19D" data-print-control="text" data-print-value="" id="frm1601F:txtTax19D" maxlength="25" readonly size="20" type="text" value={model.text["frm1601F:txtTax19D"] ?? ""}>
                                          </div>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          ><span class="wh-inline-4cf6c17959a7">
                                            20
                                          </span></td
                                        >
                                        <td colspan="2"
                                          ><span class="wh-inline-cb3a2164388b">
                                          </span><span
                                            class="wh-inline-97f71f169000"
                                            >Total Amount Still Du</span
                                          ><span class="wh-inline-429482632af7"
                                            >e/ (Overremittance) (Sum of Items
                                            18 and 19D)</span
                                          ></td
                                        >
                                        <td>
                                          <div class="spacePadder">
                                            <span class="wh-inline-4cf6c17959a7"
                                              >20</span
                                            >
                                            <input aria-label="txtTax20" class="iceInpTxt-dis wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601F:txtTax20" data-print-control="text" data-print-value="" id="frm1601F:txtTax20" maxlength="25" readonly size="20" type="text" value={model.text["frm1601F:txtTax20"] ?? ""}>
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
                          <div class="imgClass wh-inline-38936df28d5a">
                            <table class="wh-inline-e5f769a2157d">
                              <colgroup
                                ><col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-73f83b4aa463" />
                                <col class="wh-inline-1a5329f85423" />
                              </colgroup><tbody
                                ><tr>
                                  <td
                                    class="wh-inline-73554c7a4248"
                                    colspan="5"
                                  >
                                    I declare, under the penalties of perjury,
                                    that this return has been made in good
                                    faith, verified by me, and to the best of my
                                    knowledge and belief,is true and correct,
                                    <br />pursuant to the provisions of the
                                    National Internal Revenue Code, as amended,
                                    and the regulations issued under authority
                                    thereof.<br /></td
                                  >
                                </tr>
                                <tr>
                                  <td colspan="4"
                                    ><b>21</b
                                    >_____________________________________________________________________
                                    <br />President/Vice President/Principal
                                    Officer/Accredited Tax Agent/
                                    <br />Authorized Representative/Taxpayer
                                    <br />(Signature Over Printed Name)</td
                                  >
                                  <td
                                    ><b>22</b>__________________________________
                                    <br />Treasurer/Assistant Treasurer
                                    <br />(Signature Over Printed Name)
                                    <br />
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2"
                                    >__________________________________
                                    <br />Title/Position of Signatory</td
                                  >
                                  <td colspan="2"
                                    >__________________________________
                                    <br />TIN of Signatory</td
                                  >
                                  <td
                                    >__________________________________
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
                                    >__________________________________
                                    <br />TIN of Signatory</td
                                  >
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="imgClass wh-inline-38936df28d5a">
                            <img
                              alt="BIR form identifying mark"
                              class="wh-inline-5dfba9815e30"
                              id="frm1601F:jurat"
                              src="/legacy/img/withholding/original-816b2d6d98e26c06.jpg"
                              width="800"
                            />
                          </div>
                          <div class="imgClass wh-inline-38936df28d5a">
                            <table class="wh-inline-cd019b74deaf">
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
                </div>
              </div>
            </td>
            <td class="wh-inline-3709648fafb2"
              ><img
                alt="BIR form identifying mark"
                id="frm1601F:bcsImg"
                src="/legacy/img/withholding/original-b68774359549f254.jpg"
              /></td
            >
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1601f-2"
    data-source-page="2"
  >
    <div
      class="original-schedule-page wh-inline-df3ac52c00a3"
      id="modalScheduleI"
    >
      <h2 class="wh-inline-b3ecbf6825ae">
        BIR Form 1601-F — {model.taxpayerName} — TIN {model.tin}
      </h2>
      <br />
      <br />
      <div class="modalColumnHeader wh-inline-f89a97a0f7fc">
        <table
          border="1"
          cellpadding="0"
          cellspacing="0"
          class="wh-inline-c6a1710039d5"
        >
          <tbody
            ><tr>
              <td class="modalHeader" colspan="3"
                >Details of Final Tax Based on Tax Treaty Rates</td
              >
            </tr>
          </tbody>
        </table>
        <table
          border="1"
          cellpadding="0"
          cellspacing="0"
          class="wh-inline-c6a1710039d5"
          id="tbllistSchedI"
        >
          <tbody
            ><tr
              ><td class="wh-inline-133f5cdc134f"> </td>
              <td class="wh-inline-a884a4318caf"> Treaty Code </td>
              <td class="wh-inline-6910973341ad"> ATC </td>
              <td class="wh-inline-8df06fc6e857"> Amount of Income Payment </td>
              <td class="wh-inline-12ac8e7d3df7">Tax Rates (%)</td>
              <td class="wh-inline-30313625822d">
                Tax Required To be Withheld
              </td>
            </tr>
          </tbody><tbody id="tbodyllistSchedI"
            >{#each model.treatyRows as row, index (row.id)}<tr
                ><td>{index + 1}</td>{#each row.cells as cell, cellIndex (cell.id)}<td
                    >{#if cellIndex < 2}<span class="labels wh-print-select" data-print-control="select" data-print-value data-field-id={cell.id} id={cell.id}>{cell.value}</span>{:else}<input type="text" readonly aria-label={cell.id} class="wh-inline-a404e77fb442" size={cellIndex === 3 ? 6 : 17} maxlength={cellIndex === 3 ? 10 : 25} data-print-control="text" data-print-value data-field-id={cell.id} id={cell.id} value={cell.value} />{/if}</td
                  >{/each}</tr
              >{/each}</tbody
          >
        </table>
        <table
          border="1"
          cellpadding="0"
          cellspacing="0"
          class="modalColumnHeader wh-inline-c6a1710039d5"
        >
          <tbody
            ><tr>
              <td class="wh-inline-aee1b998e135">Total </td>
              <td class="wh-inline-aee1b998e135">
                <input aria-label="txtDvTotalSchedI" class="wh-inline-0dcbceace26b wh-source-size-17" data-field-id="txtDvTotalSchedI" data-print-control="text" data-print-value="" id="txtDvTotalSchedI" maxlength="20" readonly size="17" type="text" value={model.text["txtDvTotalSchedI"] ?? ""}>
              </td>
            </tr>
            <tr> </tr>
          </tbody>
        </table>
      </div>
      <div class="wh-inline-a30033456d9a">
        <br /><br />
        <br />

        <br /><br /><br />
      </div>
      <br /><br />
    </div>
  </div>
  {#each model.continuations as continuation (continuation.id)}
    <div
      class="withholding-print-page-content wh-continuation-page"
      data-source-page="continuation"
    >
      <section class="original-continuation withholding-print-continuation">
        <h2>BIR Form 1601F — {continuation.title}</h2>
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
                ><td>{row.label}</td>{#each row.cells as cell, cellIndex (cell.id)}<td
                    data-field-id={cell.id}>{cell.value}</td
                  >{/each}</tr
              >{/each}</tbody
          >
        </table>
      </section>
    </div>{/each}
</article>
