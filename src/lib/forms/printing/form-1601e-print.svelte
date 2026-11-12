<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1601E:j_id201",
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
    "id": "frm1601E:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1601E:j_id217:_1",
    "source": "frm1601E:j_id217",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601E:j_id217:_2",
    "source": "frm1601E:j_id217",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601E:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1601E:j_id252:_1",
    "source": "frm1601E:j_id252",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601E:j_id252:_2",
    "source": "frm1601E:j_id252",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1601E:txtTIN1",
    "fallback": ""
  },
  {
    "id": "frm1601E:txtTIN2",
    "fallback": ""
  },
  {
    "id": "frm1601E:txtTIN3",
    "fallback": ""
  },
  {
    "id": "frm1601E:txtBranchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1601E:txtRDOCode"
  },
  {
    "id": "frm1601E:txtLineBus",
    "fallback": ""
  },
  {
    "id": "frm1601E:txtTaxpayerName",
    "fallback": ""
  },
  {
    "id": "frm1601E:txtTelNum",
    "fallback": ""
  },
  {
    "id": "frm1601E:txtAddress",
    "fallback": ""
  },
  {
    "id": "frm1601E:txtZipCode",
    "fallback": ""
  },
  {
    "id": "frm1601E:j_id392:_1",
    "source": "frm1601E:j_id392",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1601E:j_id392:_2",
    "source": "frm1601E:j_id392",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1601E:j_id398:_1",
    "source": "frm1601E:j_id398",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1601E:j_id398:_2",
    "source": "frm1601E:j_id398",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1601E:j_id402",
    "fallback": "",
    "options": {
      "": "-",
      "1": "Special Law"
    }
  },
  {
    "id": "frm1601E:txtTax14",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax15A",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax15B",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax15C",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax16",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax17A",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax17B",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax17C",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax17D",
    "fallback": "0.00"
  },
  {
    "id": "frm1601E:txtTax18",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1601E", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1601E"
  aria-label="BIR Form 1601E print preview"
>
  <div
    class="withholding-print-page-content wh-page-1601e-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-b38870ecbc94" id="wrapper">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-75e3d8d2c7d5"
      >
        <tbody
          ><tr
            ><td>
              <div id="formPaper">
                <table
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  class="wh-inline-5c60ab4be580"
                >
                  <tbody
                    ><tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          class="wh-inline-6c82b0893f63"
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
                              <td class="wh-inline-e3d8c3c0e17b">
                                <span class="wh-inline-aec978eca301"
                                  >Monthly Remittance Return
                                  <br />of Creditable Income Taxes
                                  <br />Withheld (Expanded)</span
                                >
                              </td>
                              <td class="wh-inline-17b28d4523d2">
                                <span class="wh-inline-429482632af7"
                                  >BIR Form No.<br /></span
                                >
                                <span class="wh-inline-c1d61ad77e0f"
                                  >1601-E<br /></span
                                >
                                <span class="wh-inline-429482632af7"
                                  >September 2007 (ENCS)</span
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-c41245a21ae5">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-159312b54293"
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
                                      <td colspan="2">
                                        <span aria-label="j_id201" class="iceSelOneMnu fieldSelect1 labels wh-print-select" data-field-id="frm1601E:j_id201" data-print-control="select" id="frm1601E:j_id201">{model.text["frm1601E:j_id201"] ?? ""}</span>
                                        <input class="wh-source-size-4" aria-label="txtYear" data-field-id="frm1601E:txtYear" data-print-control="text" data-print-value="" id="frm1601E:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1601E:txtYear"] ?? ""}>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-5fce8bee3551">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-d91500b90e56"
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
                                          id="frm1601E:j_id217"
                                        >
                                          <div class="wh-inline-5c8a2699196f">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="iceSelOneRb-dis fieldText1-dis wh-inline-93a0742b428e"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="_1" checked={model.checks["frm1601E:j_id217:_1"] ?? false} data-field-id="frm1601E:j_id217:_1" data-print-control="radio" disabled id="frm1601E:j_id217:_1" type="radio"/><span
                                                      class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-534e2278e92c"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="_2" checked={model.checks["frm1601E:j_id217:_2"] ?? false} data-field-id="frm1601E:j_id217:_2" data-print-control="radio" disabled id="frm1601E:j_id217:_2" type="radio"/><span
                                                      class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-534e2278e92c"
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
                              <td class="tblFormTd wh-inline-3eaf4f0a1ce1">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-7b135d092a30"
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
                                        ><input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1601E:txtSheets" data-print-control="text" data-print-value="" id="frm1601E:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1601E:txtSheets"] ?? ""}></td
                                      >
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-007fa36b2cdf">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-c388eda3e448"
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
                                          id="frm1601E:j_id252"
                                        >
                                          <div class="wh-inline-5c8a2699196f">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="iceSelOneRb fieldText1 wh-inline-bcad206ef63f"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="_1" checked={model.checks["frm1601E:j_id252:_1"] ?? false} data-field-id="frm1601E:j_id252:_1" data-print-control="radio" disabled id="frm1601E:j_id252:_1" type="radio"/><span
                                                      class="wh-inline-534e2278e92c"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td
                                                    ><input aria-label="_2" checked={model.checks["frm1601E:j_id252:_2"] ?? false} data-field-id="frm1601E:j_id252:_2" data-print-control="radio" disabled id="frm1601E:j_id252:_2" type="radio"/><span
                                                      class="wh-inline-534e2278e92c"
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTdPart">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-4f505b340f0a"
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-aa10a2275bb2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-396f8f20b50d"
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
                                          <input class="wh-source-size-2" aria-label="txtTIN1" data-field-id="frm1601E:txtTIN1" data-print-control="text" data-print-value="" id="frm1601E:txtTIN1" maxlength="3" readonly size="2" type="text" value={model.text["frm1601E:txtTIN1"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtTIN2" data-field-id="frm1601E:txtTIN2" data-print-control="text" data-print-value="" id="frm1601E:txtTIN2" maxlength="3" readonly size="2" type="text" value={model.text["frm1601E:txtTIN2"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtTIN3" data-field-id="frm1601E:txtTIN3" data-print-control="text" data-print-value="" id="frm1601E:txtTIN3" maxlength="3" readonly size="2" type="text" value={model.text["frm1601E:txtTIN3"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="txtBranchCode" data-field-id="frm1601E:txtBranchCode" data-print-control="text" data-print-value="" id="frm1601E:txtBranchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1601E:txtBranchCode"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-1dd506c15bc6">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-9e128d4bcca7"
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
                                  class="wh-inline-4ddc26590042"
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
                                          <input aria-label="txtLineBus" class="iceInpTxt-dis disabled-dis wh-source-size-35" data-field-id="frm1601E:txtLineBus" data-print-control="text" data-print-value="" id="frm1601E:txtLineBus" maxlength="60" readonly size="35" type="text" value={model.text["frm1601E:txtLineBus"] ?? ""}>
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-b5bfcb1cc47d">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-1f874c622f9a"
                                >
                                  <tbody
                                    ><tr>
                                      <td>
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-1f874c622f9a"
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
                                          class="wh-inline-1f874c622f9a"
                                        >
                                          <tbody
                                            ><tr>
                                              <td
                                                class="wh-inline-6b6ee2d44756"
                                              >
                                              </td>
                                              <td
                                                ><input class="wh-source-size-70" aria-label="txtTaxpayerName" data-field-id="frm1601E:txtTaxpayerName" data-print-control="text" data-print-value="" id="frm1601E:txtTaxpayerName" maxlength="50" readonly size="70" type="text" value={model.text["frm1601E:txtTaxpayerName"] ?? ""}></td
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
                                  class="wh-inline-104585876044"
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
                                          <input aria-label="txtTelNum" class="iceInpTxt-dis disabled-dis wh-source-size-15" data-field-id="frm1601E:txtTelNum" data-print-control="text" data-print-value="" id="frm1601E:txtTelNum" maxlength="20" readonly size="15" type="text" value={model.text["frm1601E:txtTelNum"] ?? ""}>
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-0f512c429668">
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
                                          class="wh-inline-43d473076878"
                                        >
                                          <tbody
                                            ><tr>
                                              <td
                                                class="wh-inline-6b6ee2d44756"
                                              >
                                              </td>
                                              <td
                                                ><input aria-label="txtAddress" class="iceInpTxt-dis disabled-dis wh-source-size-120" data-field-id="frm1601E:txtAddress" data-print-control="text" data-print-value="" id="frm1601E:txtAddress" maxlength="150" readonly size="120" type="text" value={model.text["frm1601E:txtAddress"] ?? ""}></td
                                              >
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-50d96ba3188d">
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
                                          <input class="wh-source-size-2" aria-label="txtZipCode" data-field-id="frm1601E:txtZipCode" data-print-control="text" data-print-value="" id="frm1601E:txtZipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1601E:txtZipCode"] ?? ""}>
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
                          class="tblForm wh-inline-40fd67592ae4"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-da0ceb3d95b7">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-704508775a37"
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
                                            id="frm1601E:j_id392"
                                          >
                                            <div class="wh-inline-9284f1c636b2">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb fieldText1 wh-inline-b63aacdca7b1"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td
                                                      ><input aria-label="_1" checked={model.checks["frm1601E:j_id392:_1"] ?? false} data-field-id="frm1601E:j_id392:_1" data-print-control="radio" disabled id="frm1601E:j_id392:_1" type="radio"/><span
                                                        class="iceSelOneRb fieldText1 wh-inline-df8bcce4c703"
                                                        >Private</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="_2" checked={model.checks["frm1601E:j_id392:_2"] ?? false} data-field-id="frm1601E:j_id392:_2" data-print-control="radio" disabled id="frm1601E:j_id392:_2" type="radio"/><span
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
                              <td class="tblFormTd wh-inline-b1a9858a2f23">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-b18160fe6d66"
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
                                        <span class="wh-inline-429482632af7">
                                          <div class="wh-inline-a30033456d9a">
                                            <fieldset
                                              class="iceSelOneRb-dis fieldText1-dis wh-inline-ce3c0fe903e0"
                                              id="frm1601E:j_id398"
                                            >
                                              <div
                                                class="wh-inline-5c8a2699196f"
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
                                                        ><input aria-label="_1" checked={model.checks["frm1601E:j_id398:_1"] ?? false} data-field-id="frm1601E:j_id398:_1" data-print-control="radio" disabled id="frm1601E:j_id398:_1" type="radio"/><span
                                                          class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
                                                          >Yes</span
                                                        >
                                                      </td>
                                                      <td
                                                        ><input aria-label="_2" checked={model.checks["frm1601E:j_id398:_2"] ?? false} data-field-id="frm1601E:j_id398:_2" data-print-control="radio" disabled id="frm1601E:j_id398:_2" type="radio"/><span
                                                          class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
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
                                              id="frm1601E:j_id401"
                                              >If yes, specify</span
                                            >
                                            <span aria-label="j_id402" class="labels wh-print-select wh-inline-9d10a8435a5a" data-field-id="frm1601E:j_id402" data-print-control="select" id="frm1601E:j_id402">{model.text["frm1601E:j_id402"] ?? ""}</span>
                                          </div>
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-3709648fafb2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-07018d192b89"
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
                                      <td><a id="btnAddATCPartII">ATC </a> </td>
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-3709648fafb2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-355e0fa9c5b8"
                                  id="tblPartIIComputeTax"
                                >
                                  <thead>
                                    <tr>
                                      <td class="wh-inline-683ec4bd13f5"
                                        ><span class="wh-inline-dd2eceacf41a"
                                          >NATURE OF INCOME PAYMENT</span
                                        ></td
                                      >
                                      <td class="wh-inline-be93aa044c2c"
                                        ><span class="wh-inline-dd2eceacf41a"
                                          >ATC</span
                                        ></td
                                      >
                                      <td class="wh-inline-4db315f9cbed"
                                        ><span class="wh-inline-dd2eceacf41a"
                                          >TAX BASE</span
                                        ></td
                                      >
                                      <td class="wh-inline-8f448794e90d"
                                        ><span class="wh-inline-dd2eceacf41a"
                                          >TAX RATE</span
                                        ></td
                                      >
                                      <td class="wh-inline-4db315f9cbed"
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
                                            ><input type="text" readonly aria-label={cell.id} class={["wh-inline-9f5361787a63", "wh-inline-5f326564a568 wh-source-size-17", "wh-inline-187d147c4b71", "wh-inline-5f326564a568 wh-source-size-17"][cellIndex]} size={[20, 17, 20, 17][cellIndex]} data-print-control="text" data-print-value data-field-id={cell.id} id={cell.id} value={cell.value} />{#if cellIndex === 2}%{/if}</td
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
                          class="tblForm wh-inline-0648bc6d8751"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-5bdbad96a4d2"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-3ef6362bb4b4"
                                        ><span class="wh-inline-4cf6c17959a7">
                                          14
                                        </span></td
                                      >
                                      <td class="wh-inline-459a00a42ce1"
                                        ><span class="wh-inline-cb3a2164388b">
                                          Total Tax Required to be Withheld and
                                          Remitted
                                        </span></td
                                      >
                                      <td class="wh-inline-278d050dde50">
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td class="wh-inline-cb6f46a059ec"
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-45510ee8664e"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-a23372185fc8"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  ><span
                                                    class="wh-inline-4cf6c17959a7"
                                                  >
                                                    14</span
                                                  >
                                                </span></td
                                              >
                                              <td
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                >
                                                  <input aria-label="txtTax14" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601E:txtTax14" data-print-control="text" data-print-value="" id="frm1601E:txtTax14" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax14"] ?? ""}>
                                                </span><span
                                                  class="wh-inline-649b1ec8a1ed"
                                                >
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
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
                                        </span><span
                                          class="wh-inline-232ced7b40ab"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Less : Tax Credits/Payments</span
                                          ></span
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
                                        ><span class="wh-inline-4cf6c17959a7">
                                          15A
                                        </span><span
                                          class="wh-inline-232ced7b40ab"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Tax Remitted in Return Previously
                                            Filed, if this is an amended return</span
                                          ></span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-45510ee8664e"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-a23372185fc8"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  ><span
                                                    class="wh-inline-4cf6c17959a7"
                                                  >
                                                    15A</span
                                                  >
                                                </span></td
                                              >
                                              <td
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                >
                                                  <input aria-label="txtTax15A" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601E:txtTax15A" data-print-control="text" data-print-value="" id="frm1601E:txtTax15A" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax15A"] ?? ""}>
                                                </span>
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                >
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td
                                        ><span class="wh-inline-4cf6c17959a7">
                                          15B
                                        </span><span
                                          class="wh-inline-232ced7b40ab"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Advance Payments Made (please
                                            attach proof of payment - BIR Form
                                            No. 0605)</span
                                          ></span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-45510ee8664e"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-a23372185fc8"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  ><span
                                                    class="wh-inline-4cf6c17959a7"
                                                  >
                                                    15B</span
                                                  >
                                                </span></td
                                              >
                                              <td
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                >
                                                  <input aria-label="txtTax15B" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601E:txtTax15B" data-print-control="text" data-print-value="" id="frm1601E:txtTax15B" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax15B"] ?? ""}>
                                                </span>
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                >
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table></td
                                      >
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td
                                        ><span class="wh-inline-4cf6c17959a7">
                                          15C
                                        </span><span
                                          class="wh-inline-232ced7b40ab"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Total Tax Credits/Payments (Sum of
                                            Items 15A and 15B)</span
                                          ></span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td
                                        ><table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-45510ee8664e"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-a23372185fc8"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  ><span
                                                    class="wh-inline-4cf6c17959a7"
                                                  >
                                                    15C</span
                                                  >
                                                </span></td
                                              >
                                              <td
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                >
                                                  <input aria-label="txtTax15C" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601E:txtTax15C" data-print-control="text" data-print-value="" id="frm1601E:txtTax15C" maxlength="15" readonly size="20" type="text" value={model.text["frm1601E:txtTax15C"] ?? ""}>
                                                </span>
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                >
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
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
                                        </span><span
                                          class="wh-inline-232ced7b40ab"
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Tax Still Due/(Overremittance)
                                          </span><span
                                            class="wh-inline-232ced7b40ab"
                                            ><span
                                              class="wh-inline-cb3a2164388b"
                                            >
                                              (Item 14 less Item 15C)</span
                                            ></span
                                          ></span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder"></div>
                                      </td>
                                      <td>
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-45510ee8664e"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-a23372185fc8"
                                                ><span
                                                  class="wh-inline-15663751d502"
                                                  ><span
                                                    class="wh-inline-4cf6c17959a7"
                                                  >
                                                    16</span
                                                  >
                                                </span></td
                                              >
                                              <td
                                                ><span
                                                  class="wh-inline-cb3a2164388b"
                                                >
                                                  <input aria-label="txtTax16" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601E:txtTax16" data-print-control="text" data-print-value="" id="frm1601E:txtTax16" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax16"] ?? ""}>
                                                </span>
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                >
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
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
                                        <table class="wh-inline-3b16ed7872bb">
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
                                        <table class="wh-inline-28461531652f">
                                          <tbody>
                                            <tr>
                                              <td
                                                class="wh-inline-bae72bc39f43"
                                              >
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><b>17A</b>
                                                  <input aria-label="txtTax17A" class="wh-inline-80ec55322565 wh-source-size-20" data-field-id="frm1601E:txtTax17A" data-print-control="text" data-print-value="" id="frm1601E:txtTax17A" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax17A"] ?? ""}>
                                                </span>
                                              </td>
                                              <td
                                                class="wh-inline-bae72bc39f43"
                                              >
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><b>17B</b>
                                                  <input aria-label="txtTax17B" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601E:txtTax17B" data-print-control="text" data-print-value="" id="frm1601E:txtTax17B" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax17B"] ?? ""}>
                                                </span>
                                              </td>
                                              <td
                                                class="wh-inline-0541bb58118f"
                                              >
                                                <span
                                                  class="wh-inline-649b1ec8a1ed"
                                                  ><b>17C</b>
                                                  <input aria-label="txtTax17C" class="wh-inline-386bb5d6139a wh-source-size-20" data-field-id="frm1601E:txtTax17C" data-print-control="text" data-print-value="" id="frm1601E:txtTax17C" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax17C"] ?? ""}>
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td>
                                        <div class="spacePadder">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-45510ee8664e"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-a23372185fc8"
                                                  ><span
                                                    class="wh-inline-15663751d502"
                                                    ><span
                                                      class="wh-inline-4cf6c17959a7"
                                                    >
                                                      <span
                                                        class="wh-inline-4cf6c17959a7"
                                                        >17D</span
                                                      ></span
                                                    >
                                                  </span></td
                                                >
                                                <td
                                                  ><span
                                                    class="wh-inline-cb3a2164388b"
                                                  >
                                                    <input aria-label="txtTax17D" class="wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601E:txtTax17D" data-print-control="text" data-print-value="" id="frm1601E:txtTax17D" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax17D"] ?? ""}>
                                                  </span>
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                  >
                                                  </span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
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
                                          class="wh-inline-429482632af7"
                                          >Total Amount Still
                                          Due/(Overremittance) (Sum of Items 16
                                          &amp; 17D)</span
                                        ></td
                                      >
                                      <td>
                                        <div class="spacePadder">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="wh-inline-45510ee8664e"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class="wh-inline-a23372185fc8"
                                                  ><span
                                                    class="wh-inline-15663751d502"
                                                    ><span
                                                      class="wh-inline-4cf6c17959a7"
                                                    >
                                                      <span
                                                        class="wh-inline-4cf6c17959a7"
                                                        >18</span
                                                      ></span
                                                    >
                                                  </span></td
                                                >
                                                <td
                                                  ><span
                                                    class="wh-inline-cb3a2164388b"
                                                  >
                                                    <input aria-label="txtTax18" class="iceInpTxt-dis wh-inline-4e484176e7ea wh-source-size-20" data-field-id="frm1601E:txtTax18" data-print-control="text" data-print-value="" id="frm1601E:txtTax18" maxlength="25" readonly size="20" type="text" value={model.text["frm1601E:txtTax18"] ?? ""}>
                                                  </span>
                                                  <span
                                                    class="wh-inline-649b1ec8a1ed"
                                                  >
                                                  </span>
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
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div class="imgClass wh-inline-16749982e556">
                          <table class="wh-inline-cf4c0d3e4bca">
                            <colgroup
                              ><col class="wh-inline-73f83b4aa463" />
                              <col class="wh-inline-73f83b4aa463" />
                              <col class="wh-inline-73f83b4aa463" />
                              <col class="wh-inline-73f83b4aa463" />
                              <col class="wh-inline-1a5329f85423" />
                            </colgroup><tbody
                              ><tr>
                                <td colspan="5"
                                  >We declare, under the penalties of perjury,
                                  that this return has been made in good faith,
                                  verified by me/us, and to the best of my/our
                                  knowledge, and
                                  <br /> belief, is true and correct, pursuant
                                  to the provisions of the National Internal
                                  Revenue Code, as amended, and the regulations
                                  issued under authority thereof.
                                  <br />
                                </td>
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
                                  >____________________________________
                                  <br />Title/Position of Signatory
                                  <br />
                                </td>
                                <td colspan="2"
                                  >____________________________________
                                  <br />TIN of Signatory
                                  <br />
                                </td>
                                <td
                                  >______________________________
                                  <br />Title/Position of Signatory
                                  <br />
                                </td>
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
                        <div class="imgClass wh-inline-16749982e556">
                          <img
                            alt="BIR form identifying mark"
                            class="wh-inline-5dfba9815e30"
                            id="frm1601E:jurat"
                            src="/legacy/img/withholding/original-7488026308d82906.jpg"
                            width="830"
                          />
                        </div>
                        <div class="imgClass wh-inline-16749982e556">
                          <table class="wh-inline-9bdcb5cfc112">
                            <tbody
                              ><tr>
                                <td
                                  >Machine Validation/Revenue Official Receipt
                                  Details (If not filed with an Authorized Agent
                                  Bank)<br /><br /><br /><br /><br /></td
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
            </td>
            <td class="wh-inline-3709648fafb2"
              ><img
                alt="BIR form identifying mark"
                id="frm1601E:bcsImg"
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
        <h2>BIR Form 1601E — {continuation.title}</h2>
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
