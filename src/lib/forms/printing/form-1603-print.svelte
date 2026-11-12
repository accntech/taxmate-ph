<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1603:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1603:optQrtr:_1",
    "source": "frm1603:optQrtr",
    "choice": "1",
    "checked": false
  },
  {
    "id": "frm1603:optQrtr:_2",
    "source": "frm1603:optQrtr",
    "choice": "2",
    "checked": false
  },
  {
    "id": "frm1603:optQrtr:_3",
    "source": "frm1603:optQrtr",
    "choice": "3",
    "checked": false
  },
  {
    "id": "frm1603:optQrtr:_4",
    "source": "frm1603:optQrtr",
    "choice": "4",
    "checked": false
  },
  {
    "id": "frm1603:chk1st",
    "source": "frm1603:chk1st",
    "choice": "",
    "checked": false
  },
  {
    "id": "frm1603:txtMonth1",
    "fallback": ""
  },
  {
    "id": "frm1603:chk2nd",
    "source": "frm1603:chk2nd",
    "choice": "",
    "checked": false
  },
  {
    "id": "frm1603:txtMonth2",
    "fallback": ""
  },
  {
    "id": "frm1603:chk3rd",
    "source": "frm1603:chk3rd",
    "choice": "",
    "checked": false
  },
  {
    "id": "frm1603:txtMonth3",
    "fallback": ""
  },
  {
    "id": "frm1603:j_id217:_1",
    "source": "frm1603:j_id217",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1603:j_id217:_2",
    "source": "frm1603:j_id217",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1603:j_id252:_1",
    "source": "frm1603:j_id252",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1603:j_id252:_2",
    "source": "frm1603:j_id252",
    "choice": "N",
    "checked": false
  },
  {
    "id": "frm1603:tinPart1",
    "fallback": ""
  },
  {
    "id": "frm1603:tinPart2",
    "fallback": ""
  },
  {
    "id": "frm1603:tinPart3",
    "fallback": ""
  },
  {
    "id": "frm1603:branchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1603:txtRDOCode"
  },
  {
    "id": "frm1603:description",
    "fallback": ""
  },
  {
    "id": "frm1603:registeredName",
    "fallback": ""
  },
  {
    "id": "frm1603:telephoneNumber",
    "fallback": ""
  },
  {
    "id": "frm1603:registeredAddress",
    "fallback": ""
  },
  {
    "id": "frm1603:zipCode",
    "fallback": ""
  },
  {
    "id": "frm1603:j_id392:_1",
    "source": "frm1603:j_id392",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1603:j_id392:_2",
    "source": "frm1603:j_id392",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1603:j_id398:_1",
    "source": "frm1603:j_id398",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1603:j_id398:_2",
    "source": "frm1603:j_id398",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1603:lstTaxTreaty",
    "fallback": "",
    "options": {
      "0": "",
      "1": "Special Rate",
      "2": "International Tax Treaty",
      "3": "Both"
    }
  },
  {
    "id": "frm1603:txtFringe320",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtBase320",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtReq320",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtFringe330",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtBase330",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtReq330",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtFringe360",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtBase360",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txtReq360",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt18A",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt18B",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt19",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt20",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt21A",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt21B",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt21C",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt21D",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:txt22",
    "fallback": "0.00"
  },
  {
    "id": "frm1603:optOver:_1",
    "source": "frm1603:optOver",
    "choice": "R",
    "checked": false
  },
  {
    "id": "frm1603:optOver:_2",
    "source": "frm1603:optOver",
    "choice": "T",
    "checked": false
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1603", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1603"
  aria-label="BIR Form 1603 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1603-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-cbc1b88bc8ec" id="wrapper">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-9946dc8a5c75"
      >
        <tbody
          ><tr
            ><td>
              <div id="formPaper">
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
                              <td class="wh-inline-881a8932a400">
                                <span class="wh-inline-429482632af7"
                                  >Republika ng Pilipinas
                                  <br />Kagawaran ng Pananalapi
                                  <br />Kawanihan ng Rentas Internas</span
                                >
                              </td>
                              <td class="wh-inline-a30033456d9a">
                                <span class="wh-inline-1b29e9eb50ae"
                                  >Quarterly Remittance<br />Return of Final
                                  Income<br />Taxes Withheld</span
                                >
                              </td>
                              <td class="wh-inline-5426e9cced92">
                                <span class="wh-inline-429482632af7"
                                  >BIR Form No.<br /></span
                                >
                                <span class="wh-inline-c1d61ad77e0f"
                                  >1603<br /></span
                                >
                                <span class="wh-inline-429482632af7"
                                  >November 2004 (ENCS)</span
                                ></td
                              >
                            </tr>
                            <tr>
                              <td class="wh-inline-3709648fafb2" colspan="5"
                                ><span class="style2"
                                  ><span class="wh-inline-511fb66ceecf">
                                    On Fringe Benefits Paid to Employees Other
                                    than Rank and File</span
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
                          class="tblForm wh-inline-791ae3b18231"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-a6023a404506">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-4a7070b00734"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-a8a3ae802b40"
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab"
                                            ><b> 1 </b></span
                                          >
                                        </div></td
                                      >
                                      <td colspan="2"
                                        ><span class="wh-inline-97f71f169000"
                                          >For the Year</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td class="wh-inline-6e606d24db7d"> </td>
                                      <td class="wh-inline-737abec21598"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-97f71f169000"
                                            >(YYYY)</span
                                          >
                                        </div></td
                                      >
                                      <td class="wh-inline-6f50dcf312f9"
                                        ><span class="wh-inline-511fb66ceecf"
                                          ><span class="wh-inline-6d319e71fe1f">
                                            <input aria-label="txtYear" class="iceInpTxt inputNumeric wh-inline-c43829adf46f wh-source-size-4" data-field-id="frm1603:txtYear" data-print-control="text" data-print-value="" id="frm1603:txtYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1603:txtYear"] ?? ""}>
                                          </span></span
                                        >
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-74556bec4dca">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-aee8358c3f12"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-75267fed25f1"
                                        ><span class="wh-inline-97f71f169000"
                                          ><b
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                            >
                                              2
                                            </span></b
                                          ></span
                                        ></td
                                      >
                                      <td
                                        class="wh-inline-dbfea0e04609"
                                        colspan="8"
                                        ><span class="wh-inline-97f71f169000"
                                          >Quarter</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td class="wh-inline-4b1a3a45f831"
                                        ><div
                                          class="wh-inline-a30033456d9a"
                                        ></div></td
                                      >
                                      <td>
                                        <fieldset
                                          class="iceSelOneRb wh-inline-3d20d8008334"
                                          id="frm1603:optQrtr"
                                        >
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            class="iceSelOneRb wh-inline-cd650df3a253"
                                          >
                                            <tbody
                                              ><tr>
                                                <td
                                                  class=""
                                                >
                                                  <input aria-label="_1" checked={model.checks["frm1603:optQrtr:_1"] ?? false} data-field-id="frm1603:optQrtr:_1" data-print-control="radio" disabled id="frm1603:optQrtr:_1" type="radio"/>
                                                  <span class="iceSelOneRb"
                                                    >1st</span
                                                  >
                                                </td>
                                                <td>
                                                  <input aria-label="_2" checked={model.checks["frm1603:optQrtr:_2"] ?? false} data-field-id="frm1603:optQrtr:_2" data-print-control="radio" disabled id="frm1603:optQrtr:_2" type="radio"/>
                                                  <span class="iceSelOneRb"
                                                    >2nd</span
                                                  >
                                                </td>
                                                <td>
                                                  <input aria-label="_3" checked={model.checks["frm1603:optQrtr:_3"] ?? false} data-field-id="frm1603:optQrtr:_3" data-print-control="radio" disabled id="frm1603:optQrtr:_3" type="radio"/>
                                                  <span class="iceSelOneRb"
                                                    >3rd</span
                                                  >
                                                </td>
                                                <td>
                                                  <input aria-label="_4" checked={model.checks["frm1603:optQrtr:_4"] ?? false} data-field-id="frm1603:optQrtr:_4" data-print-control="radio" disabled id="frm1603:optQrtr:_4" type="radio"/>
                                                  <span class="iceSelOneRb"
                                                    >4th</span
                                                  >
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </fieldset>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-7c17fe368b59">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-4cba8d15f1d3"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-a9720bf42afc"
                                        ><span class="wh-inline-97f71f169000"
                                          ><b
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                              >3</span
                                            ></b
                                          ></span
                                        ></td
                                      >
                                      <td
                                        class="wh-inline-5209fce61e6f"
                                        colspan="6"
                                        ><span class="wh-inline-97f71f169000"
                                          >Months Reflected</span
                                        ></td
                                      >
                                    </tr>
                                    <tr class="wh-inline-5e3b47639e33">
                                      <td class="wh-inline-8f448794e90d"
                                        ><span class="wh-inline-232ced7b40ab">
                                        </span></td
                                      >
                                      <td class="wh-inline-43c46b7a9819"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="chk1st" checked={model.checks["frm1603:chk1st"] ?? false} class="iceSelBoolChkbx" data-field-id="frm1603:chk1st" data-print-control="checkbox" disabled id="frm1603:chk1st" type="checkbox"/>
                                          </span>
                                        </div>
                                      </td>
                                      <td class="wh-inline-c8e5eef70b90"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtMonth1" class="iceInpTxt-dis disabled-dis wh-inline-899167ead8a0 wh-source-size-4" data-field-id="frm1603:txtMonth1" data-print-control="text" data-print-value="" id="frm1603:txtMonth1" maxlength="3" readonly size="4" type="text" value={model.text["frm1603:txtMonth1"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td class="wh-inline-48b8b0602e87"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="chk2nd" checked={model.checks["frm1603:chk2nd"] ?? false} class="iceSelBoolChkbx" data-field-id="frm1603:chk2nd" data-print-control="checkbox" disabled id="frm1603:chk2nd" type="checkbox"/>
                                          </span>
                                        </div>
                                      </td>
                                      <td class="wh-inline-1a0484f09aae"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtMonth2" class="iceInpTxt-dis disabled-dis wh-inline-899167ead8a0 wh-source-size-4" data-field-id="frm1603:txtMonth2" data-print-control="text" data-print-value="" id="frm1603:txtMonth2" maxlength="3" readonly size="4" type="text" value={model.text["frm1603:txtMonth2"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td class="wh-inline-43c46b7a9819"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="chk3rd" checked={model.checks["frm1603:chk3rd"] ?? false} class="iceSelBoolChkbx" data-field-id="frm1603:chk3rd" data-print-control="checkbox" disabled id="frm1603:chk3rd" type="checkbox"/>
                                          </span>
                                        </div>
                                      </td>
                                      <td class="wh-inline-4ec57101ba17"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtMonth3" class="iceInpTxt-dis disabled-dis wh-inline-899167ead8a0 wh-source-size-4" data-field-id="frm1603:txtMonth3" data-print-control="text" data-print-value="" id="frm1603:txtMonth3" maxlength="3" readonly size="4" type="text" value={model.text["frm1603:txtMonth3"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-e05fc1c6c6b2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-46ab90d390f1"
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
                                          >Amended Return?</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td> </td>
                                      <td>
                                        <fieldset
                                          class="iceSelOneRb-dis fieldText1-dis wh-inline-3276beb56669"
                                          id="frm1603:j_id217"
                                        >
                                          <div class="wh-inline-5c8a2699196f">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="iceSelOneRb-dis fieldText1-dis wh-inline-15ca265a7b7c"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    ><input aria-label="_1" checked={model.checks["frm1603:j_id217:_1"] ?? false} data-field-id="frm1603:j_id217:_1" data-print-control="radio" disabled id="frm1603:j_id217:_1" type="radio"/>
                                                    <span
                                                      class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td>
                                                    <input aria-label="_2" checked={model.checks["frm1603:j_id217:_2"] ?? false} data-field-id="frm1603:j_id217:_2" data-print-control="radio" disabled id="frm1603:j_id217:_2" type="radio"/>
                                                    <span
                                                      class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
                                                      >No</span
                                                    >
                                                  </td>
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
                              <td class="tblFormTd wh-inline-240810bef5c2">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-1da3d0148a3d"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-6f7ee51f83d0"
                                        ><span class="wh-inline-4cf6c17959a7">
                                          5
                                        </span></td
                                      >
                                      <td class="wh-inline-df24732ef8c0"
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
                                          id="frm1603:j_id252"
                                        >
                                          <div class="wh-inline-5c8a2699196f">
                                            <table
                                              border="0"
                                              cellpadding="0"
                                              cellspacing="0"
                                              class="iceSelOneRb fieldText1 wh-inline-efd47b94c15b"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td>
                                                    <input aria-label="_1" checked={model.checks["frm1603:j_id252:_1"] ?? false} data-field-id="frm1603:j_id252:_1" data-print-control="radio" disabled id="frm1603:j_id252:_1" type="radio"/>
                                                    <span
                                                      class="wh-inline-766562615de5"
                                                      >Yes</span
                                                    >
                                                  </td>
                                                  <td>
                                                    <input aria-label="_2" checked={model.checks["frm1603:j_id252:_2"] ?? false} data-field-id="frm1603:j_id252:_2" data-print-control="radio" disabled id="frm1603:j_id252:_2" type="radio"/>
                                                    <span
                                                      class="wh-inline-766562615de5"
                                                      >No</span
                                                    >
                                                  </td>
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
                                  class="wh-inline-ec425143363a"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-4adca4f46dc2">
                                        <span class="wh-inline-4cf6c17959a7"
                                          >Part I</span
                                        ></td
                                      >
                                      <td class="wh-inline-a476e4ba7a96">
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
                          class="tblForm wh-inline-d26ae0e8e671"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-c41245a21ae5">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-546211152471"
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
                                          >TIN
                                        </span>
                                        <span class="wh-inline-649b1ec8a1ed">
                                          <input class="wh-source-size-2" aria-label="tinPart1" data-field-id="frm1603:tinPart1" data-print-control="text" data-print-value="" id="frm1603:tinPart1" maxlength="3" readonly size="2" type="text" value={model.text["frm1603:tinPart1"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="tinPart2" data-field-id="frm1603:tinPart2" data-print-control="text" data-print-value="" id="frm1603:tinPart2" maxlength="3" readonly size="2" type="text" value={model.text["frm1603:tinPart2"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="tinPart3" data-field-id="frm1603:tinPart3" data-print-control="text" data-print-value="" id="frm1603:tinPart3" maxlength="3" readonly size="2" type="text" value={model.text["frm1603:tinPart3"] ?? ""}>
                                          <input class="wh-source-size-2" aria-label="branchCode" data-field-id="frm1603:branchCode" data-print-control="text" data-print-value="" id="frm1603:branchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1603:branchCode"] ?? ""}>
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
                                  class="wh-inline-cc413f0c18b3"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-6e606d24db7d"
                                        ><span class="wh-inline-15663751d502">
                                          7
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
                                  class="wh-inline-c09fa6ac2b30"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-6e606d24db7d"
                                        ><span class="wh-inline-15663751d502">
                                          8
                                        </span></td
                                      >
                                      <td>
                                        <span class="wh-inline-cb3a2164388b"
                                          >Line of Business/Occupation
                                        </span>
                                        <span class="wh-inline-649b1ec8a1ed">
                                          <input class="wh-source-size-29" aria-label="description" data-field-id="frm1603:description" data-print-control="text" data-print-value="" id="frm1603:description" maxlength="60" readonly size="29" type="text" value={model.text["frm1603:description"] ?? ""}>
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
                              <td class="tblFormTd wh-inline-f7113e10bd0c">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-c7e43ef7f17f"
                                >
                                  <tbody
                                    ><tr>
                                      <td>
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-c7e43ef7f17f"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-6e606d24db7d"
                                                ><span
                                                  class="wh-inline-4cf6c17959a7"
                                                >
                                                  9
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
                                          class="wh-inline-c7e43ef7f17f"
                                        >
                                          <tbody
                                            ><tr>
                                              <td
                                                class="wh-inline-6b6ee2d44756"
                                              >
                                              </td>
                                              <td
                                                ><input class="wh-source-size-70" aria-label="registeredName" data-field-id="frm1603:registeredName" data-print-control="text" data-print-value="" id="frm1603:registeredName" maxlength="70" readonly size="70" type="text" value={model.text["frm1603:registeredName"] ?? ""}></td
                                              >
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                              <td class="tblFormTd wh-inline-f8ef2a9a67a7">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-2aea83bd6128"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-7777c2f5e271"
                                        ><span class="wh-inline-4cf6c17959a7">
                                          10
                                        </span><span
                                          class="wh-inline-cb3a2164388b"
                                          >Telephone Number</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <input class="wh-source-size-15" aria-label="telephoneNumber" data-field-id="frm1603:telephoneNumber" data-print-control="text" data-print-value="" id="frm1603:telephoneNumber" maxlength="20" readonly size="15" type="text" value={model.text["frm1603:telephoneNumber"] ?? ""}>
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
                              <td class="tblFormTd wh-inline-b3d46a399619">
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
                                                  11
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
                                                ><input class="wh-source-size-105" aria-label="registeredAddress" data-field-id="frm1603:registeredAddress" data-print-control="text" data-print-value="" id="frm1603:registeredAddress" maxlength="150" readonly size="105" type="text" value={model.text["frm1603:registeredAddress"] ?? ""}></td
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
                                  class="wh-inline-823b63b4afea"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-25ac3279fc22"
                                        ><span class="wh-inline-4cf6c17959a7">
                                          12
                                        </span><span
                                          class="wh-inline-cb3a2164388b"
                                          >Zip Code</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <input class="wh-source-size-2" aria-label="zipCode" data-field-id="frm1603:zipCode" data-print-control="text" data-print-value="" id="frm1603:zipCode" maxlength="12" readonly size="2" type="text" value={model.text["frm1603:zipCode"] ?? ""}>
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
                              <td class="tblFormTd wh-inline-152739a142c9">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-71fed1e3e1b2"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-457aefb99927"
                                        ><span class="wh-inline-4cf6c17959a7">
                                          13
                                        </span><span
                                          class="wh-inline-cb3a2164388b"
                                          >Category of Withholding Agent</span
                                        >
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <fieldset
                                            class="iceSelOneRb fieldText1 wh-inline-4dffa5c2f8e5"
                                            id="frm1603:j_id392"
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
                                                      ><input aria-label="_1" checked={model.checks["frm1603:j_id392:_1"] ?? false} data-field-id="frm1603:j_id392:_1" data-print-control="radio" disabled id="frm1603:j_id392:_1" type="radio"/><span
                                                        class="iceSelOneRb fieldText1 wh-inline-df8bcce4c703"
                                                        >Private</span
                                                      >
                                                    </td>
                                                    <td
                                                      ><input aria-label="_2" checked={model.checks["frm1603:j_id392:_2"] ?? false} data-field-id="frm1603:j_id392:_2" data-print-control="radio" disabled id="frm1603:j_id392:_2" type="radio"/><span
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
                              <td class="tblFormTd wh-inline-6c48a8c4c00c">
                                <table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-837074e05123"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-38074465994a"
                                        ><span class="wh-inline-4cf6c17959a7">
                                          14
                                        </span><span
                                          class="wh-inline-cb3a2164388b"
                                          >Are there payees availing of tax
                                          relief under Special Law or
                                          International Tax Treaty?</span
                                        >
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="wh-inline-3709648fafb2">
                                        <div class="wh-inline-a30033456d9a">
                                          <div class="wh-inline-5c8a2699196f">
                                            <div class="wh-inline-a30033456d9a">
                                              <table
                                                border="0"
                                                cellpadding="0"
                                                cellspacing="0"
                                                class="iceSelOneRb-dis fieldText1-dis wh-inline-74e905a72558"
                                              >
                                                <tbody>
                                                  <tr>
                                                    <td>
                                                      <div
                                                        class="wh-inline-55aaececa9cb"
                                                      >
                                                        <span
                                                          class="wh-inline-429482632af7"
                                                        >
                                                          <input aria-label="_1" checked={model.checks["frm1603:j_id398:_1"] ?? false} data-field-id="frm1603:j_id398:_1" data-print-control="radio" disabled id="frm1603:j_id398:_1" type="radio"/>
                                                          <span
                                                            class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
                                                            >Yes</span
                                                          >
                                                        </span>
                                                      </div>
                                                    </td>
                                                    <td>
                                                      <div
                                                        class="wh-inline-9cb088a595d0"
                                                      >
                                                        <span
                                                          class="wh-inline-429482632af7"
                                                        >
                                                          <input aria-label="_2" checked={model.checks["frm1603:j_id398:_2"] ?? false} data-field-id="frm1603:j_id398:_2" data-print-control="radio" disabled id="frm1603:j_id398:_2" type="radio"/>
                                                          <span
                                                            class="iceSelOneRb-dis fieldText1-dis-dis wh-inline-766562615de5"
                                                            >No</span
                                                          >
                                                        </span>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </div>
                                          </div>
                                        </div>
                                        <div
                                          class="wh-inline-9cb088a595d0"
                                        ></div>
                                        <div class="wh-inline-a30033456d9a">
                                          <span
                                            class="iceOutLbl wh-inline-3d20d8008334"
                                            id="frm1603:j_id414"
                                            >If yes, specify</span
                                          >
                                          <span aria-label="lstTaxTreaty" class="iceSelOneMnu-dis input-dis labels wh-print-select wh-inline-74d8577534e5" data-field-id="frm1603:lstTaxTreaty" data-print-control="select" id="frm1603:lstTaxTreaty">{model.text["frm1603:lstTaxTreaty"] ?? ""}</span>
                                        </div>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                class="tblFormTd wh-inline-3709648fafb2"
                                colspan="2"
                                ><table
                                  border="0"
                                  cellpadding="0"
                                  cellspacing="0"
                                  class="wh-inline-988aaf28bba8"
                                >
                                  <tbody
                                    ><tr>
                                      <td class="wh-inline-36fe9f8cef2e">
                                        <span class="wh-inline-4cf6c17959a7"
                                          >Part II</span
                                        ></td
                                      >
                                      <td class="wh-inline-65eb8ad153b2"
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-6217d6f49f24"
                                            >Computation of Tax</span
                                          >
                                        </div></td
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
                          class="tblForm wh-inline-5a315681b67d"
                        >
                          <tbody
                            ><tr>
                              <td class="tblFormTd wh-inline-40631c44673c">
                                <table
                                  border="0"
                                  class="wh-inline-7db8c5603719"
                                >
                                  <tbody
                                    ><tr>
                                      <td class=""
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-6d319e71fe1f"
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              >Recipients</span
                                            ></span
                                          >
                                        </div></td
                                      >
                                      <td
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >ATC</span
                                          >
                                        </div></td
                                      >
                                      <td>
                                        <p class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >Monetary Value of Fringe Benefit</span
                                          >
                                        </p></td
                                      >
                                      <td
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >Percentage Divisor</span
                                          >
                                        </div>
                                        <div
                                          class="wh-inline-a30033456d9a"
                                        ></div></td
                                      >
                                      <td
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >Tax Base Grossed-up Monetary Value</span
                                          >
                                        </div>
                                        <div
                                          class="wh-inline-a30033456d9a"
                                        ></div></td
                                      >
                                      <td
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >Tax Rate</span
                                          >
                                        </div>
                                        <div
                                          class="wh-inline-a30033456d9a"
                                        ></div></td
                                      >
                                      <td
                                        ><div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >Tax Required To Be Withheld</span
                                          >
                                        </div>
                                        <div
                                          class="wh-inline-a30033456d9a"
                                        ></div></td
                                      >
                                    </tr>
                                    <tr>
                                      <td class="wh-inline-40b982c4db4f"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-232ced7b40ab"
                                              >
                                                15</span
                                              ></b
                                            > Alien &amp; Filipino employed &amp;
                                            occupying the same position as those of
                                            aliens employed in selected multinational
                                            companies</span
                                          >
                                        </div></td
                                      >
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >WF 320</span
                                          >
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtFringe320" class="wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1603:txtFringe320" data-print-control="text" data-print-value="" id="frm1603:txtFringe320" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtFringe320"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >85%</span
                                          >
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtBase320" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txtBase320" data-print-control="text" data-print-value="" id="frm1603:txtBase320" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtBase320"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td class="wh-inline-79ed02e83dd1">
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >15%</span
                                          >
                                        </div>
                                      </td>
                                      <td class="wh-inline-7536fb09166b">
                                        <span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txtReq320" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txtReq320" data-print-control="text" data-print-value="" id="frm1603:txtReq320" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtReq320"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td class="wh-inline-40b982c4db4f"
                                        ><div class="wh-inline-9cb088a595d0">
                                          <span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-232ced7b40ab"
                                              >
                                                16</span
                                              ></b
                                            > Non-resident Alien not Engaged in Trade
                                            or Business</span
                                          >
                                        </div></td
                                      >
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >WF 330</span
                                          >
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtFringe330" class="iceInpTxt inputNumeric wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1603:txtFringe330" data-print-control="text" data-print-value="" id="frm1603:txtFringe330" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtFringe330"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >75%</span
                                          >
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtBase330" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txtBase330" data-print-control="text" data-print-value="" id="frm1603:txtBase330" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtBase330"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >25%</span
                                          >
                                        </div>
                                      </td>
                                      <td>
                                        <span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txtReq330" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txtReq330" data-print-control="text" data-print-value="" id="frm1603:txtReq330" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtReq330"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <span class="wh-inline-97f71f169000"
                                          ><b
                                            ><span
                                              class="wh-inline-232ced7b40ab"
                                            >
                                              17</span
                                            ></b
                                          > In General, for Citizen, Resident Alien
                                          and Non-Resident Alien Engaged in Trade
                                          or Business Within the Philippines</span
                                        >
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >WF 360</span
                                          >
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtFringe360" class="iceInpTxt inputNumeric wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1603:txtFringe360" data-print-control="text" data-print-value="" id="frm1603:txtFringe360" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtFringe360"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >65%
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txtBase360" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txtBase360" data-print-control="text" data-print-value="" id="frm1603:txtBase360" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtBase360"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-97f71f169000"
                                            >35%</span
                                          >
                                        </div>
                                      </td>
                                      <td>
                                        <span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txtReq360" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txtReq360" data-print-control="text" data-print-value="" id="frm1603:txtReq360" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txtReq360"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        ><b>
                                          <span class="wh-inline-6d319e71fe1f"
                                          ></span></b
                                        >
                                        <span class="wh-inline-97f71f169000"
                                          ><b
                                            ><span
                                              class="wh-inline-232ced7b40ab"
                                            >
                                              18</span
                                            ></b
                                          > Total</span
                                        ></td
                                      >
                                      <td
                                        ><div class="wh-inline-a30033456d9a">
                                          <b
                                            ><span
                                              class="wh-inline-232ced7b40ab"
                                              >18A</span
                                            ></b
                                          >
                                        </div></td
                                      >
                                      <td>
                                        <div class="wh-inline-a30033456d9a">
                                          <span class="wh-inline-232ced7b40ab">
                                            <input aria-label="txt18A" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txt18A" data-print-control="text" data-print-value="" id="frm1603:txt18A" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt18A"] ?? ""}>
                                          </span>
                                        </div>
                                      </td>
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
                                        ><div class="wh-inline-55aaececa9cb">
                                          <span class="wh-inline-6d319e71fe1f"
                                            ><span
                                              class="wh-inline-511fb66ceecf"
                                            >
                                              <b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                  >18B</span
                                                ><span
                                                  class="wh-inline-97f71f169000"
                                                  ><b
                                                    ><span
                                                      class="wh-inline-232ced7b40ab"
                                                    >
                                                    </span></b
                                                  ></span
                                                ></b
                                              ></span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ></span
                                          >
                                        </div></td
                                      >
                                      <td>
                                        <span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txt18B" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txt18B" data-print-control="text" data-print-value="" id="frm1603:txt18B" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt18B"] ?? ""}>
                                        </span>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td colspan="5"
                                        ><span class="wh-inline-97f71f169000"
                                          ><b
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ><span
                                              class="wh-inline-232ced7b40ab"
                                              >19</span
                                            ></b
                                          >     Less:  Taxes Remitted in Return
                                          previously filed, if this is an
                                          Amended Return</span
                                        ></td
                                      >
                                      <td
                                        ><div class="wh-inline-55aaececa9cb">
                                          <b
                                            ><span
                                              class="wh-inline-232ced7b40ab"
                                              >19</span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ></b
                                          >
                                        </div></td
                                      >
                                      <td
                                        ><span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txt19" class="iceInpTxt-dis inputNumeric-dis wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1603:txt19" data-print-control="text" data-print-value="" id="frm1603:txt19" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt19"] ?? ""}>
                                        </span></td
                                      >
                                    </tr>
                                    <tr>
                                      <td colspan="5"
                                        ><span class="wh-inline-97f71f169000"
                                          ><span class="wh-inline-97f71f169000"
                                            ><b
                                              ><span
                                                class="wh-inline-232ced7b40ab"
                                              >
                                              </span></b
                                            ></span
                                          ><span class="wh-inline-6d319e71fe1f"
                                            ><b>20</b></span
                                          >      Tax Still Due / (Overremittance)</span
                                        ></td
                                      >
                                      <td
                                        ><div class="wh-inline-55aaececa9cb">
                                          <b
                                            ><span
                                              class="wh-inline-232ced7b40ab"
                                              >20</span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ></b
                                          >
                                        </div></td
                                      >
                                      <td
                                        ><span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txt20" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txt20" data-print-control="text" data-print-value="" id="frm1603:txt20" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt20"] ?? ""}>
                                        </span></td
                                      >
                                    </tr>
                                    <tr>
                                      <td colspan="5"
                                        ><span class="wh-inline-97f71f169000"
                                          ><b
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                            >
                                              21</span
                                            >
                                          </b> Add:  Penalties</span
                                        >
                                        <span class="wh-inline-97f71f169000">
                                        </span>
                                        <span class="wh-inline-97f71f169000">
                                        </span>
                                        <span class="wh-inline-97f71f169000">
                                        </span>
                                      </td>
                                      <td> </td>
                                      <td> </td>
                                    </tr>
                                    <tr>
                                      <td colspan="5">
                                        <span class="wh-inline-97f71f169000">
                                          <b>
                                            <span
                                              class="wh-inline-6d319e71fe1f"
                                            >
                                              <table
                                                class="wh-inline-df0109d2cd01"
                                              >
                                                <tbody
                                                  ><tr>
                                                    <td
                                                      class="wh-inline-f3567c9654cd"
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
                                                      class="wh-inline-f3567c9654cd"
                                                      ><div
                                                        class="wh-inline-a30033456d9a"
                                                      >
                                                        <span
                                                          class="wh-inline-97f71f169000"
                                                        >
                                                          Interest</span
                                                        >
                                                      </div></td
                                                    >
                                                    <td
                                                      class="wh-inline-f3567c9654cd"
                                                      ><div
                                                        class="wh-inline-a30033456d9a"
                                                      >
                                                        <span
                                                          class="wh-inline-97f71f169000"
                                                        >
                                                          Compromise</span
                                                        >
                                                      </div></td
                                                    >
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      ><b
                                                        ><span
                                                          class="wh-inline-232ced7b40ab"
                                                          >21A</span
                                                        >
                                                        <span
                                                          class="wh-inline-6d319e71fe1f"
                                                        >
                                                          <span
                                                            class="wh-inline-511fb66ceecf"
                                                          >
                                                            <span
                                                              class="wh-inline-6d319e71fe1f"
                                                            >
                                                              <input aria-label="txt21A" class="iceInpTxt-dis disabledNumeric-dis wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1603:txt21A" data-print-control="text" data-print-value="" id="frm1603:txt21A" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt21A"] ?? ""}>
                                                            </span></span
                                                          ></span
                                                        ></b
                                                      ></td
                                                    >
                                                    <td
                                                      ><b
                                                        ><span
                                                          class="wh-inline-232ced7b40ab"
                                                          >21B</span
                                                        >
                                                      </b>
                                                      <span
                                                        class="wh-inline-232ced7b40ab"
                                                      >
                                                        <input aria-label="txt21B" class="iceInpTxt-dis disabledNumeric-dis wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1603:txt21B" data-print-control="text" data-print-value="" id="frm1603:txt21B" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt21B"] ?? ""}>
                                                      </span></td
                                                    >
                                                    <td
                                                      ><b
                                                        ><span
                                                          class="wh-inline-232ced7b40ab"
                                                          >21C</span
                                                        ></b
                                                      >
                                                      <span
                                                        class="wh-inline-232ced7b40ab"
                                                      >
                                                        <input aria-label="txt21C" class="iceInpTxt-dis disabledNumeric-dis wh-inline-8d34e592c9dd wh-source-size-17" data-field-id="frm1603:txt21C" data-print-control="text" data-print-value="" id="frm1603:txt21C" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt21C"] ?? ""}>
                                                      </span></td
                                                    >
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </span>
                                          </b>
                                        </span>
                                      </td>
                                      <td
                                        ><div class="wh-inline-55aaececa9cb">
                                          <b
                                            ><span
                                              class="wh-inline-232ced7b40ab"
                                              >21D</span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ></b
                                          >
                                        </div></td
                                      >
                                      <td
                                        ><span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txt21D" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txt21D" data-print-control="text" data-print-value="" id="frm1603:txt21D" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt21D"] ?? ""}>
                                        </span></td
                                      >
                                    </tr>
                                    <tr>
                                      <td colspan="5"
                                        ><span class="wh-inline-97f71f169000"
                                          ><b
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                            >
                                              22</span
                                            ></b
                                          >     Total Amount Still Due /
                                          (Overremittance)</span
                                        ></td
                                      >
                                      <td
                                        ><div class="wh-inline-55aaececa9cb">
                                          <span class="wh-inline-97f71f169000"
                                            ><span
                                              class="wh-inline-6d319e71fe1f"
                                              ><b>22</b></span
                                            ><span
                                              class="wh-inline-97f71f169000"
                                              ><b
                                                ><span
                                                  class="wh-inline-232ced7b40ab"
                                                >
                                                </span></b
                                              ></span
                                            ><b
                                              ><span
                                                class="wh-inline-232ced7b40ab"
                                              >
                                              </span></b
                                            ></span
                                          >
                                        </div></td
                                      >
                                      <td
                                        ><span class="wh-inline-232ced7b40ab">
                                          <input aria-label="txt22" class="iceInpTxt-dis disabledNumeric-dis wh-inline-a2ee037606c1 wh-source-size-17" data-field-id="frm1603:txt22" data-print-control="text" data-print-value="" id="frm1603:txt22" maxlength="25" readonly size="17" type="text" value={model.text["frm1603:txt22"] ?? ""}>
                                        </span></td
                                      >
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  border="0"
                                  class="wh-inline-684511716502"
                                >
                                  <tbody
                                    ><tr>
                                      <td colspan="8"
                                        ><span class="wh-inline-97f71f169000">
                                          For late filers with overremittance,
                                          extend amount of penalties (Item 21D
                                          to 22)</span
                                        ></td
                                      >
                                    </tr>
                                    <tr>
                                      <td colspan="2"
                                        ><span class="style2"
                                          >If overremittance, mark one box only:</span
                                        ></td
                                      >
                                      <td colspan="2"
                                        ><input aria-label="_1" checked={model.checks["frm1603:optOver:_1"] ?? false} data-field-id="frm1603:optOver:_1" data-print-control="radio" disabled id="frm1603:optOver:_1" type="radio"/>
                                        <span class="iceSelOneRb-dis-dis"
                                          >To be Refunded</span
                                        ></td
                                      >
                                      <td colspan="4"
                                        ><input aria-label="_2" checked={model.checks["frm1603:optOver:_2"] ?? false} data-field-id="frm1603:optOver:_2" data-print-control="radio" disabled id="frm1603:optOver:_2" type="radio"/>
                                        To be Issued a Tax Credit Certificate
                                        <div
                                          class="wh-inline-a30033456d9a"
                                        ></div></td
                                      >
                                    </tr>
                                  </tbody>
                                </table>
                                <table
                                  border="0"
                                  class="wh-inline-684511716502"
                                >
                                  <tbody
                                    ><tr>
                                      <td
                                        ><div
                                          class="tblFormTdPart wh-inline-a30033456d9a"
                                        >
                                          <b></b>
                                        </div></td
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
                        <div class="imgClass wh-inline-8d29b33adb02">
                          <table class="wh-inline-4ae8ac90baf8">
                            <tbody
                              ><tr>
                                <td colspan="2"
                                  >I/We declare, under the penalties of perjury,
                                  that this return has been made in good faith,
                                  verified by me/us, and to the best of my/our
                                  knowledge and belief,
                                  <br />is true and correct, pursuant to the
                                  provisions of the National Internal Revenue
                                  Code, as amended, and the regulations issued
                                  under authority thereof.</td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><b>23</b
                                  >______________________________________________
                                  <br />President/Vice President/Principal
                                  Officer/Accredited Tax
                                  <br />Agent/Authorized Representative/Taxpayer
                                  <br />(Signature over printed Name)</td
                                >
                                <td
                                  ><b>24</b
                                  >______________________________________________
                                  <br />Treasurer/Asst. Treasurer
                                  <br />(Signature over printed Name)
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  >______________________________________________
                                  <br />Title/Position of the Signatory
                                  <br />
                                </td>
                                <td
                                  >______________________________________________
                                  <br />Title/Position of the Signatory
                                  <br />
                                </td>
                              </tr>
                              <tr>
                                <td
                                  >______________________________________________
                                  <br />TIN of Tax Agent (if applicable)</td
                                >
                                <td
                                  >______________________________________________
                                  <br />Tax Agent Accreditation No. (if
                                  applicable)</td
                                >
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div class="imgClass wh-inline-8d29b33adb02">
                          <img
                            alt="BIR form identifying mark"
                            class="wh-inline-5dfba9815e30"
                            id="frm1603:jurat"
                            src="/legacy/img/withholding/original-3ae42fa2a95c1b8a.jpg"
                            width="740"
                          />
                        </div>
                        <div class="imgClass wh-inline-8d29b33adb02">
                          <table class="wh-inline-ea46c8e8187c">
                            <tbody
                              ><tr>
                                <td
                                  >Machine Validation/Revenue Official Receipt
                                  Details (If not filed with the bank)<br /><br
                                  /><br /><br /><br /><br /><br /><br /><br
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
                <div class="wh-inline-73d40ed9cb75" id="DummyTxt"></div>
              </div>
            </td>
            <td class="wh-inline-3709648fafb2"
              ><img
                alt="BIR form identifying mark"
                class="wh-inline-5dfba9815e30"
                id="frm1603:bcsImg"
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
        <h2>BIR Form 1603 — {continuation.title}</h2>
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
