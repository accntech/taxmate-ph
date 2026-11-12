<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1600VT:txtPg1I1Month",
    "fallback": "",
    "options": {
      "00": "00",
      "01": "01",
      "02": "02",
      "03": "03",
      "04": "04",
      "05": "05",
      "06": "06",
      "07": "07",
      "08": "08",
      "09": "09",
      "10": "10",
      "11": "11",
      "12": "12"
    }
  },
  {
    "id": "frm1600VT:txtPg1I1Year",
    "fallback": ""
  },
  {
    "id": "frm1600VT:rdoPg1I2AmendedYes",
    "source": "frm1600VT:rdoPg1I2Amended",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600VT:rdoPg1I2AmendedNo",
    "source": "frm1600VT:rdoPg1I2Amended",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1600VT:rdoPg1I3TaxWithheldYes",
    "source": "frm1600VT:rdoPg1I3TaxWithheld",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600VT:rdoPg1I3TaxWithheldNo",
    "source": "frm1600VT:rdoPg1I3TaxWithheld",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1600VT:txtPg1I4NoOfSheets",
    "fallback": "0"
  },
  {
    "id": "frm1600VT:txtPg1TIN1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1TIN2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1TIN3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1TIN4",
    "fallback": ""
  },
  {
    "id": "BranchMask",
    "fallback": "00000"
  },
  {
    "id": "frm1600VT:txtPg1I6RDO",
    "fallback": ""
  },
  {
    "id": "rdoContainer",
    "key": "frm1600VT:txtRDOCode"
  },
  {
    "id": "frm1600VT:txtPg1Pt1I7WithholdingAgentsName",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt1I8RegisteredAddress",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt1I8RegisteredAddress2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txPg1I8ZipCode",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt1I9ContactNumber",
    "fallback": ""
  },
  {
    "id": "frm1600VT:rdoPg1I10CategoryofWthholdAgentPriv",
    "source": "frm1600VT:rdoPg1I10CategoryofWthholdAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1600VT:rdoPg1I10CategoryofWthholdAgentGovt",
    "source": "frm1600VT:rdoPg1I10CategoryofWthholdAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1600VT:txtPg1Pt1I11Email",
    "fallback": ""
  },
  {
    "id": "frm1600VT:rdoPg1I12TaxReliefYes",
    "source": "frm1600VT:rdoPg1I12TaxRelief",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1600VT:rdoPg1I12TaxReliefNo",
    "source": "frm1600VT:rdoPg1I12TaxRelief",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1600VT:txtPg1Pt1I12TaxReliefSpec",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtTotalOtherTax",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I18TotTaxWithheld",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I19TaxRemittedInRtrn",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I20OthrPymntsMade",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I21TotTaxPymntsMade",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I22TaxStillDueOverremit",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I23Surcharge",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I24Interest",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I25Compromise",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I26TotPenalties",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1P2I27TotAmtStillDueOverremit",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:txtPg1Pt4Indiv",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt4NonIndiv",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt4TaxAcredNo",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt4DateOfIssue",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt4DateOfExpiry",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I28CashC1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I28CashC2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I28Date",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I28CashC3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I29CheckC1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I29CheckC2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I29Date",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I29CheckC3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I30TaxDebitC2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I30Date",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I30TaxDebitC3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I31OthersC1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I31OthersC2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I31OthersC3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I31Date",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg1Pt3I31OthersC4",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg2TinC1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg2TinC2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg2TinC3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:txtPg2TinC4",
    "fallback": ""
  },
  {
    "id": "BrachMask2",
    "fallback": "0000"
  },
  {
    "id": "frm1600VT:txtPg2RegisteredName",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1SeqNo1",
    "fallback": "1"
  },
  {
    "id": "frm1600VT:Pg2Sc1TIN1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1Name1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1ATC1",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfIncPmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1TaxRate1",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfTxWthhld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1SeqNo2",
    "fallback": "2"
  },
  {
    "id": "frm1600VT:Pg2Sc1TIN2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1Name2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1ATC2",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfIncPmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1TaxRate2",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfTxWthhld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1SeqNo3",
    "fallback": "3"
  },
  {
    "id": "frm1600VT:Pg2Sc1TIN3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1Name3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1ATC3",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfIncPmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1TaxRate3",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfTxWthhld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1SeqNo4",
    "fallback": "4"
  },
  {
    "id": "frm1600VT:Pg2Sc1TIN4",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1Name4",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1ATC4",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfIncPmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1TaxRate4",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfTxWthhld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1SeqNo5",
    "fallback": "5"
  },
  {
    "id": "frm1600VT:Pg2Sc1TIN5",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1Name5",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1ATC5",
    "fallback": ""
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfIncPmt5",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1TaxRate5",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1AmtOfTxWthhld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1600VT:Pg2Sc1TotTxWthhldAndRmtted",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1600VTv2018", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1600VTv2018"
  aria-label="BIR Form 1600VTv2018 print preview"
>
  <div
    class="withholding-print-page-content wh-page-1600vtv2018-1"
    data-source-page="1"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="noCellSpace wh-inline-9da1723ee825" id="Page1Content">
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        class="wh-inline-0ee3c4c4ed4a"
      >
        <tbody
          ><tr>
            <td>
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                class="wh-inline-6ff764e548dd"
              >
                <tbody
                  ><tr>
                    <td>
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="wh-inline-cc956925421b"
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
                class="FormHeader wh-inline-0ee3c4c4ed4a wh-eq-header"
              >
                <tbody
                  ><tr>
                    <td>
                      <span class="FormHeader2">BIR Form No.<br /> </span><span
                        class="FormHeader1 wh-inline-68475f995fc0">1600-VT</span
                      ><br />
                      <span class="FormHeader2">January 2018</span>
                      <br />
                      <span class="FormHeader2 wh-inline-68475f995fc0"
                        >Page 1</span
                      >
                    </td>
                    <td class="wh-inline-c1768be119e1">
                      <span class="FormHeader1 wh-inline-68475f995fc0"
                        >Monthly Remittance Return</span
                      ><br />
                      <span class="FormHeader1 wh-inline-68475f995fc0"
                        >of Value-Added Tax Withheld</span
                      ><br />
                      <span class="FormHeader3 wh-inline-0fab5438359f"
                        >Enter all required information in CAPITAL LETTERS using
                        BLACK ink. Mark applicable boxes with an "X".<br />
                        Two copies MUST be filled with the BIR and one held by the
                        Taxpayer.</span
                      >
                    </td>
                    <td>
                      <img
                        alt="barcode"
                        class="wh-inline-5fb46f7e6008"
                        src="/legacy/img/withholding/original-dd735c7ce12f3a92.png"
                      />
                      <span class="xsmallBold"> 1600-VT 01/18 P1</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table
                cellpadding="0"
                cellspacing="0"
                class="tblForm wh-inline-0ee3c4c4ed4a"
              >
                <tbody
                  ><tr>
                    <td class="RowSubTable wh-inline-3709648fafb2" colspan="4">
                      <table class="RowSubTable wh-inline-81a195c0a6e8">
                        <tbody
                          ><tr>
                            <td class="RowSubTable wh-inline-3709648fafb2">
                              <table class="RowSubTable wh-inline-0def080095fd">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">1</span>
                                      <span class="xsmall"
                                        >For the month    (MM/20YY)</span
                                      >
                                    </td>
                                    <td colspan="3">
                                      <span aria-label="txtPg1I1Month" class="labels wh-print-select" data-field-id="frm1600VT:txtPg1I1Month" data-print-control="select" id="frm1600VT:txtPg1I1Month">{model.text["frm1600VT:txtPg1I1Month"] ?? ""}</span>
                                      <span class="small wh-inline-242d94fd65cf"
                                        >/20</span
                                      >
                                      <input class="wh-source-size-1" aria-label="txtPg1I1Year" data-field-id="frm1600VT:txtPg1I1Year" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1I1Year" maxlength="2" readonly size="1" type="text" value={model.text["frm1600VT:txtPg1I1Year"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td class="RowSubTable wh-inline-3709648fafb2">
                              <table class="RowSubTable wh-inline-0e31c555dba9">
                                <tbody
                                  ><tr>
                                    <td class="Content" colspan="2">
                                      <span class="ContentBold">2</span>
                                      <span class="xsmall">Amended Return?</span
                                      >
                                      <input aria-label="rdoPg1I2AmendedYes" checked={model.checks["frm1600VT:rdoPg1I2AmendedYes"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I2AmendedYes" data-print-control="radio" disabled id="frm1600VT:rdoPg1I2AmendedYes" type="radio"/>
                                      Yes
                                      <input aria-label="rdoPg1I2AmendedNo" checked={model.checks["frm1600VT:rdoPg1I2AmendedNo"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I2AmendedNo" data-print-control="radio" disabled id="frm1600VT:rdoPg1I2AmendedNo" type="radio"/>
                                      No
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td class="RowSubTable wh-inline-3709648fafb2">
                              <table class="RowSubTable wh-inline-8ae05f97f646">
                                <tbody
                                  ><tr>
                                    <td class="Content" colspan="2">
                                      <span class="ContentBold">3</span>
                                      <span class="xsmall"
                                        >Any Tax Withheld?</span
                                      >
                                      <input aria-label="rdoPg1I3TaxWithheldYes" checked={model.checks["frm1600VT:rdoPg1I3TaxWithheldYes"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I3TaxWithheldYes" data-print-control="radio" disabled id="frm1600VT:rdoPg1I3TaxWithheldYes" type="radio"/>

                                      Yes
                                      <input aria-label="rdoPg1I3TaxWithheldNo" checked={model.checks["frm1600VT:rdoPg1I3TaxWithheldNo"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I3TaxWithheldNo" data-print-control="radio" disabled id="frm1600VT:rdoPg1I3TaxWithheldNo" type="radio"/>
                                      No
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td class="RowSubTable wh-inline-3709648fafb2">
                              <table class="RowSubTable wh-inline-56cca1e64ebc">
                                <tbody
                                  ><tr>
                                    <td class="Content">
                                      <span class="ContentBold">4</span>
                                      <span class="xsmall"
                                        >Number of     Sheet/s Attached</span
                                      >
                                    </td>
                                    <td class="wh-inline-a30033456d9a">
                                      <input aria-label="txtPg1I4NoOfSheets" class="wh-inline-62c7b1cc0b82 wh-source-size-1" data-field-id="frm1600VT:txtPg1I4NoOfSheets" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1I4NoOfSheets" maxlength="2" readonly size="1" type="text" value={model.text["frm1600VT:txtPg1I4NoOfSheets"] ?? ""}>
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
                    <td class="tblFormTdPart wh-inline-261df5a44a38">
                      <table class="ContentHeader wh-inline-6cf195dfe548">
                        <tbody
                          ><tr>
                            <td class="wh-inline-afe9c6ec456f">
                              <div class="wh-inline-a30033456d9a">
                                <span class="wh-inline-4cf6c17959a7"
                                  >Part I - Background Information
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="RowSubTable" colspan="5">
                      <span class="ContentBold">5</span>
                      <span class="small"
                        >Taxpayer Identification Number (TIN)</span
                      >
                      <input class="wh-source-size-4" aria-label="txtPg1TIN1" data-field-id="frm1600VT:txtPg1TIN1" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1TIN1" readonly size="4" value={model.text["frm1600VT:txtPg1TIN1"] ?? ""}>
                      <span class="xlarge">-</span>
                      <input class="wh-source-size-4" aria-label="txtPg1TIN2" data-field-id="frm1600VT:txtPg1TIN2" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1TIN2" readonly size="4" value={model.text["frm1600VT:txtPg1TIN2"] ?? ""}>
                      <span class="xlarge">-</span>
                      <input class="wh-source-size-4" aria-label="txtPg1TIN3" data-field-id="frm1600VT:txtPg1TIN3" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1TIN3" readonly size="4" value={model.text["frm1600VT:txtPg1TIN3"] ?? ""}>
                      <span class="xlarge">-</span>
                      <input class="wh-source-size-4" aria-label="txtPg1TIN4" data-field-id="frm1600VT:txtPg1TIN4" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1TIN4" readonly size="4" value={model.text["frm1600VT:txtPg1TIN4"] ?? ""}>
                      <span class="wh-inline-5d0c6b19a115">
                        <input class="wh-source-size-4" aria-label="BranchMask" data-field-id="BranchMask" data-print-control="text" data-print-value="" id="BranchMask" readonly size="4" value={model.text["BranchMask"] ?? ""}/>
                      </span>

                      <span class="ContentBold">6</span>
                      <span class="small">RDO Code</span>
                      <input aria-label="txtPg1I6RDO" class="wh-inline-5d0c6b19a115" data-field-id="frm1600VT:txtPg1I6RDO" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1I6RDO" readonly type="text" value={model.text["frm1600VT:txtPg1I6RDO"] ?? ""}/>
                      <div
                        class="wh-inline-a9f3ac8032a0"
                        data-field-id="rdoContainer"
                        id="rdoContainer"
                      >
                        {model.text["rdoContainer"] ?? ""}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td class="RowSubTable" colspan="5">
                      <table class="RowSubTable wh-inline-81a195c0a6e8">
                        <tbody
                          ><tr>
                            <td>
                              <span class="ContentBold">7</span>
                              <span class="small">Withholding Agent's Name</span
                              >
                              <span class="xsmallItalic"
                                >(Last Name, First Name, Middle Name for
                                Individuals OR Registered Name for
                                Non-Individuals)</span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input aria-label="txtPg1Pt1I7WithholdingAgentsName" class="wh-inline-81ac1b266f21" data-field-id="frm1600VT:txtPg1Pt1I7WithholdingAgentsName" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt1I7WithholdingAgentsName" maxlength="60" readonly type="text" value={model.text["frm1600VT:txtPg1Pt1I7WithholdingAgentsName"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="RowSubTable" colspan="1">
                      <table class="RowSubTable wh-inline-81a195c0a6e8">
                        <tbody
                          ><tr>
                            <td>
                              <span class="ContentBold">8</span>
                              <span class="small">Registered Address</span>
                              <span class="xxsmallItalic wh-inline-3115fb736f6a"
                                >(Indicate complete address. If branch, indicate
                                the branch address. If the registered address is
                                different from the current address, go to the
                                RDO to update registered address by using BIR
                                Form No. 1905)</span
                              >
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input aria-label="txtPg1Pt1I8RegisteredAddress" class="wh-inline-81ac1b266f21" data-field-id="frm1600VT:txtPg1Pt1I8RegisteredAddress" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt1I8RegisteredAddress" maxlength="80" readonly type="text" value={model.text["frm1600VT:txtPg1Pt1I8RegisteredAddress"] ?? ""}>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="1">
                      <table class="wh-inline-dba48f7afc33">
                        <tbody><tr> </tr></tbody>
                      </table>
                      <table class="wh-inline-3a11ec522262">
                        <tbody
                          ><tr>
                            <td class="RowSubTable wh-inline-50b3c1e97946">
                              <input aria-label="txtPg1Pt1I8RegisteredAddress2" class="wh-inline-7744d51241f9" data-field-id="frm1600VT:txtPg1Pt1I8RegisteredAddress2" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt1I8RegisteredAddress2" maxlength="80" readonly type="text" value={model.text["frm1600VT:txtPg1Pt1I8RegisteredAddress2"] ?? ""}>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-0ac5a156bb02"
                              ></table>
                            </td>
                            <td
                              class="RowSubTable wh-inline-afe9c6ec456f"
                              colspan="3"
                            >
                              <table class="RowSubTable wh-inline-f59ca94c60a8">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold"> 8A</span>
                                      <span class="small">Zip code</span>
                                    </td>
                                    <td class="wh-inline-a65f895db221">
                                      <input aria-label="txPg1I8ZipCode" class="wh-inline-62c7b1cc0b82" data-field-id="frm1600VT:txPg1I8ZipCode" data-print-control="text" data-print-value="" id="frm1600VT:txPg1I8ZipCode" readonly size="4 " type="text" value={model.text["frm1600VT:txPg1I8ZipCode"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td></tr
                  >
                  <tr>
                    <td colspan="1">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="tblForm wh-inline-3a11ec522262"
                      >
                        <tbody
                          ><tr>
                            <td
                              class="RowSubTable wh-inline-d5519c22ddc2"
                              colspan="1"
                            >
                              <table class="RowSubTable wh-inline-fc448a2aafec">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">9</span>
                                      <span class="small">Contact Number</span>
                                    </td>
                                    <td>
                                      <input class="wh-source-size-40" aria-label="txtPg1Pt1I9ContactNumber" data-field-id="frm1600VT:txtPg1Pt1I9ContactNumber" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt1I9ContactNumber" maxlength="25" readonly size="40" value={model.text["frm1600VT:txtPg1Pt1I9ContactNumber"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td class="RowSubTable wh-inline-212e7bbc2a99">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-28830c9012f3"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-3ac4f0189ca6">
                                      <span class="ContentBold">10</span>
                                      <span class="small"
                                        >Category of Withholding Agent</span
                                      >
                                    </td>
                                    <td class="wh-inline-ffed82f78ef3">
                                      <input aria-label="rdoPg1I10CategoryofWthholdAgentPriv" checked={model.checks["frm1600VT:rdoPg1I10CategoryofWthholdAgentPriv"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I10CategoryofWthholdAgentPriv" data-print-control="radio" disabled id="frm1600VT:rdoPg1I10CategoryofWthholdAgentPriv" type="radio"/>
                                      Private   
                                      <input aria-label="rdoPg1I10CategoryofWthholdAgentGovt" checked={model.checks["frm1600VT:rdoPg1I10CategoryofWthholdAgentGovt"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I10CategoryofWthholdAgentGovt" data-print-control="radio" disabled id="frm1600VT:rdoPg1I10CategoryofWthholdAgentGovt" type="radio"/>
                                      Government
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
                    <td colspan="1">
                      <span class="ContentBold">11</span>
                      <span class="small">Email Address </span>
                      <input aria-label="txtPg1Pt1I11Email" class="wh-inline-90385b1c10b8 wh-source-size-112" data-field-id="frm1600VT:txtPg1Pt1I11Email" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt1I11Email" maxlength="112" readonly size="112" value={model.text["frm1600VT:txtPg1Pt1I11Email"] ?? ""}>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="1">
                      <table
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        class="tblForm wh-inline-3a11ec522262"
                      >
                        <tbody
                          ><tr>
                            <td class="RowSubTable wh-inline-5cf47916efc5">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-a5f179410c13"
                              >
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-6b54c08d76b2">
                                      <span class="ContentBold">12</span>
                                      <span class="small"
                                        >Are you availing of tax relief under
                                             Special Law or International Tax
                                        Treaty?</span
                                      >
                                    </td>
                                    <td class="wh-inline-a5f485bd3adc">
                                      <input aria-label="rdoPg1I12TaxReliefYes" checked={model.checks["frm1600VT:rdoPg1I12TaxReliefYes"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I12TaxReliefYes" data-print-control="radio" disabled id="frm1600VT:rdoPg1I12TaxReliefYes" type="radio"/>
                                      Yes   
                                      <input aria-label="rdoPg1I12TaxReliefNo" checked={model.checks["frm1600VT:rdoPg1I12TaxReliefNo"] ?? false} class="styled" data-field-id="frm1600VT:rdoPg1I12TaxReliefNo" data-print-control="radio" disabled id="frm1600VT:rdoPg1I12TaxReliefNo" type="radio"/>
                                      No
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                            <td
                              class="RowSubTable wh-inline-c036e6f5ab93"
                              colspan="1"
                            >
                              <table class="RowSubTable wh-inline-4d67f00c66d5">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">12A</span>
                                      <span class="small">If Yes, specify</span>
                                    </td>
                                    <td>
                                      <input class="wh-source-size-45" aria-label="txtPg1Pt1I12TaxReliefSpec" data-field-id="frm1600VT:txtPg1Pt1I12TaxReliefSpec" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt1I12TaxReliefSpec" maxlength="100" readonly size="45" value={model.text["frm1600VT:txtPg1Pt1I12TaxReliefSpec"] ?? ""}>
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
                    <td class="RowSubTable" colspan="5">
                      <table class="RowSubTable wh-inline-81a195c0a6e8">
                        <tbody
                          ><tr>
                            <td class="tblFormTdPart wh-inline-261df5a44a38">
                              <table class="RowSubTable wh-inline-6f8940345139">
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-afe9c6ec456f">
                                      <div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-4cf6c17959a7"
                                          >PART II - Computation of Tax</span
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
                        class="tblForm wh-inline-3a11ec522262"
                      >
                        <tbody
                          ><tr>
                            <td class="tblFormTd wh-inline-3709648fafb2">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="wh-inline-bf86e2b2ab3e"
                                id="tblPartIIComputeTax"
                              >
                                <thead>
                                  <tr>
                                    <td class="wh-inline-a884a4318caf"
                                      ><span class="wh-inline-e2d359fdda59"
                                        ><a id="btnAddATCPartII">ATC</a></span
                                      ></td
                                    >
                                    <td class="wh-inline-c79c3d5ac5e4"
                                      ><span class="wh-inline-e2d359fdda59"
                                        >Tax base
                                      </span></td
                                    >
                                    <td class="wh-inline-a884a4318caf"
                                      ><span class="wh-inline-e2d359fdda59"
                                        >Tax Rate</span
                                      ></td
                                    >
                                    <td class="wh-inline-c79c3d5ac5e4"
                                      ><span class="wh-inline-dd2eceacf41a"
                                        >Tax Withheld</span
                                      ></td
                                    >
                                  </tr>
                                </thead>
                                <tbody id="tbodyComputeTax"
                                  >{#each model.atcRows as row, index (row.id)}<tr
                                      >{#each row.cells as cell, cellIndex (cell.id)}<td
                                          >{#if cellIndex === 0}{index + 13}
                                          {/if}<input type="text" readonly aria-label={cell.id} class={["wh-inline-905008530ca9 wh-source-size-20", "wh-inline-505b613e7130", "wh-inline-905008530ca9 wh-source-size-20", "wh-inline-6ba3f1fb8968"][cellIndex]} size={[20, 20, 20, 20][cellIndex]} data-print-control="text" data-print-value data-field-id={cell.id} id={cell.id} value={cell.value} />{#if cellIndex === 2}%{/if}</td
                                        >{/each}</tr
                                    >{/each}</tbody
                                >
                                <tfoot id="tfootComputeTax">
                                  <tr>
                                    <td colspan="4">
                                      <div
                                        class="wh-inline-9993df54d511"
                                        id="lblOtherTax"
                                      >
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-298c56dc6254"
                                        >
                                          <tbody
                                            ><tr>
                                              <td class="wh-inline-d28ea6934f79"
                                                ><span
                                                  ><span
                                                    class="wh-inline-dd2eceacf41a"
                                                    ><a id="btnOtherTax"
                                                      >Other Selected ATC</a
                                                    ></span
                                                  ></span
                                                ></td
                                              >
                                              <td
                                                ><input aria-label="txtTotalOtherTax" class="wh-inline-3cb524aa7aee" data-field-id="frm1600VT:txtTotalOtherTax" data-print-control="text" data-print-value="" id="frm1600VT:txtTotalOtherTax" readonly type="text" value={model.text["frm1600VT:txtTotalOtherTax"] ?? ""}></td
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
                      <table class="wh-inline-81a195c0a6e8">
                        <tbody
                          ><tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">18</span>
                                      <span>Total Taxes Withheld</span>
                                      <span class="xsmallItalic"
                                        >(Sum of Items 13 to 17)</span
                                      >
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I18TotTaxWithheld" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I18TotTaxWithheld" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I18TotTaxWithheld" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I18TotTaxWithheld"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">19</span>
                                      <span
                                        >Less: Taxes Remitted in Return
                                        Previously Filed, if this is an Amended
                                        Return</span
                                      >
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I19TaxRemittedInRtrn" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I19TaxRemittedInRtrn" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I19TaxRemittedInRtrn" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I19TaxRemittedInRtrn"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">20</span>
                                      <span>Other Payments Made</span>
                                      <span class="xsmallItalic"
                                        >(attach proof)</span
                                      >
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I20OthrPymntsMade" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I20OthrPymntsMade" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I20OthrPymntsMade" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I20OthrPymntsMade"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">21</span>
                                      <span>Total Tax Payments Made</span>
                                      <span class="xsmallItalic"
                                        >(Sum of Items 19 &amp; 20)</span
                                      >
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I21TotTaxPymntsMade" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I21TotTaxPymntsMade" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I21TotTaxPymntsMade" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I21TotTaxPymntsMade"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">22</span>
                                      <span class="ContentBold"
                                        >Tax Still Due</span
                                      >/(Overremittance)
                                      <span class="xsmallItalic"
                                        >(Item 18 Less Item 21)</span
                                      >
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I22TaxStillDueOverremit" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I22TaxStillDueOverremit" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I22TaxStillDueOverremit" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I22TaxStillDueOverremit"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      Add: Penalties      
                                      <span class="ContentBold">23</span>
                                      <span>Surcharge</span>
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I23Surcharge" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I23Surcharge" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I23Surcharge" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I23Surcharge"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">24</span>
                                      <span>Interest</span>
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I24Interest" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I24Interest" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I24Interest" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I24Interest"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">25</span>
                                      <span>Compromise</span>
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I25Compromise" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I25Compromise" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I25Compromise" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I25Compromise"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">26</span>
                                      <span>Total Penalties</span>
                                      <span class="xsmallItalic"
                                        >(Sum of Items 23 to 25)</span
                                      >
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I26TotPenalties" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I26TotPenalties" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I26TotPenalties" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I26TotPenalties"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="ContentBold">27</span>
                                      <span class="ContentBold"
                                        >TOTAL AMOUNT STILL DUE</span
                                      >/(Overremittance)
                                      <span class="xsmallItalic"
                                        >(Sum of Items 22 and 26)</span
                                      >
                                    </td>
                                    <td class="ContentRight">
                                      <input aria-label="txtPg1P2I27TotAmtStillDueOverremit" class="wh-inline-386bb5d6139a wh-source-size-40" data-field-id="frm1600VT:txtPg1P2I27TotAmtStillDueOverremit" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1P2I27TotAmtStillDueOverremit" maxlength="20" readonly size="40" type="text" value={model.text["frm1600VT:txtPg1P2I27TotAmtStillDueOverremit"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <table class="wh-inline-81a195c0a6e8">
                        <tbody
                          ><tr>
                            <td class="tblFormTd" colspan="3">
                              <table class="wh-inline-028e56601406">
                                <tbody
                                  ><tr>
                                    <td colspan="3"
                                      ><span class="wh-inline-97f71f169000">
                                        If overremittance, apply for tax refund
                                        using BIR Form No. 1914 (Application for
                                        Tax Credits / Refunds).</span
                                      ></td
                                    >
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="4">
                              <table
                                class="RowSubTableBorder wh-inline-32a05c30a1d2"
                              >
                                <tbody
                                  ><tr>
                                    <td class="BorderTD" colspan="4">
                                      <span class="xxsmall"
                                        >I/We declare under the penalties of
                                        perjury that this return and all its
                                        attachments, have been made in good
                                        faith, verified by me/us, and to the
                                        best of my/our knowledge and belief, is
                                        true and correct, pursuant to the
                                        provisions of the National Internal
                                        Revenue Code, as amended, and the
                                        regulations issued under authority
                                        thereof. Furthur, I/we give my/our
                                        consent to the processing of my/our
                                        information as contemplated under the
                                        "Data Privacy Act of 2012 (R.A. No.
                                        10173) for legitimate and lawful
                                        purposes.</span
                                      >
                                      <span class="xxsmallItalic"
                                        >(If Authorized Representative, attach
                                        authorization letter)</span
                                      >
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="wh-inline-df06e86bdad2">
                                      <span class="xsmall">For Individual:</span
                                      >
                                      <input aria-label="txtPg1Pt4Indiv" class="wh-inline-b05a6885cb8b" data-field-id="frm1600VT:txtPg1Pt4Indiv" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt4Indiv" maxlength="255" readonly type="text" value={model.text["frm1600VT:txtPg1Pt4Indiv"] ?? ""}>
                                    </td>
                                    <td class="wh-inline-df06e86bdad2">
                                      <span class="xsmall"
                                        >For Non-Individual:</span
                                      >
                                      <input aria-label="txtPg1Pt4NonIndiv" class="wh-inline-b05a6885cb8b" data-field-id="frm1600VT:txtPg1Pt4NonIndiv" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt4NonIndiv" maxlength="255" readonly type="text" value={model.text["frm1600VT:txtPg1Pt4NonIndiv"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td class="BorderTD wh-inline-63e94b63113d">
                                      <span class="xsmall"
                                        >Signature over Printed Name of
                                        Taxpayer/Authorized Representative/Tax
                                        Agent</span
                                      >
                                      <span class="xxsmall"
                                        >(Indicate Title/Designation and TIN)</span
                                      >
                                    </td>
                                    <td class="BorderTD wh-inline-63e94b63113d">
                                      <span class="xsmall"
                                        >Signature over Printed Name of
                                        President/Vice President/Authorized
                                        Officer or Representative/Tax Agent</span
                                      >
                                      <span class="xxsmall"
                                        >(Indicate Title/Designation and TIN)</span
                                      >
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="3">
                              <table
                                class="RowSubTableBorder wh-inline-32a05c30a1d2"
                              >
                                <tbody
                                  ><tr>
                                    <td>
                                      <span class="xxsmall"
                                        >Tax Agent Accrediation No. /Attorney's
                                        Roll No. (if applicable)</span
                                      >
                                      <input class="wh-source-size-15" aria-label="txtPg1Pt4TaxAcredNo" data-field-id="frm1600VT:txtPg1Pt4TaxAcredNo" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt4TaxAcredNo" maxlength="255" readonly size="15" type="text" value={model.text["frm1600VT:txtPg1Pt4TaxAcredNo"] ?? ""}>
                                    </td>
                                    <td>
                                      <span class="xxsmall"
                                        >Date of Issue (DD/MM/YYYY/)</span
                                      >
                                      <input class="wh-source-size-15" aria-label="txtPg1Pt4DateOfIssue" data-field-id="frm1600VT:txtPg1Pt4DateOfIssue" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt4DateOfIssue" maxlength="255" readonly size="15" type="text" value={model.text["frm1600VT:txtPg1Pt4DateOfIssue"] ?? ""}>
                                    </td>
                                    <td>
                                      <span class="xxsmall"
                                        >Date of Expiry (DD/MM/YYYY/)</span
                                      >
                                      <input class="wh-source-size-15" aria-label="txtPg1Pt4DateOfExpiry" data-field-id="frm1600VT:txtPg1Pt4DateOfExpiry" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt4DateOfExpiry" maxlength="255" readonly size="15" type="text" value={model.text["frm1600VT:txtPg1Pt4DateOfExpiry"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td class="RowSubTable" colspan="5">
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td
                                      class="tblFormTdPart wh-inline-261df5a44a38"
                                      colspan="5"
                                    >
                                      <div class="wh-inline-a30033456d9a">
                                        <span class="wh-inline-4cf6c17959a7"
                                          >Part III - Details of Payment
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      class="wh-inline-228b4610be59"
                                      colspan="1"
                                    >
                                      <span class="smallBold">Particulars</span>
                                    </td>
                                    <td
                                      class="wh-inline-ad3a1cce95f6"
                                      colspan="1"
                                    >
                                      <span class="xxsmallBold"
                                        >Drawee Bank/<br />
                                        Agency</span
                                      >
                                    </td>
                                    <td
                                      class="wh-inline-228b4610be59"
                                      colspan="1"
                                    >
                                      <span class="smallBold">Number</span>
                                    </td>
                                    <td
                                      class="wh-inline-edf8a46da083"
                                      colspan="1"
                                    >
                                      <span class="smallBold">Date</span>
                                      <span class="smallItalic"
                                        >(MM/DD/YYYY)</span
                                      >
                                    </td>
                                    <td
                                      class="wh-inline-edf8a46da083"
                                      colspan="1"
                                    >
                                      <span class="smallBold">Amount</span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <span class="smallBold">28</span>
                                      <span class="xsmall"
                                        >Cash/Bank Debit Memo</span
                                      >
                                    </td>
                                    <td
                                      class="wh-inline-f7d5f529256d"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I28CashC1" class="wh-inline-7d7091035e0a" data-field-id="frm1600VT:txtPg1Pt3I28CashC1" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I28CashC1" maxlength="8" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I28CashC1"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I28CashC2" class="wh-inline-0c3cc0c26807" data-field-id="frm1600VT:txtPg1Pt3I28CashC2" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I28CashC2" maxlength="16" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I28CashC2"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-d1fc33d7f2e6"
                                      colspan="1"
                                    >
                                      <input class="wh-source-size-20" aria-label="txtPg1Pt3I28Date" data-field-id="frm1600VT:txtPg1Pt3I28Date" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I28Date" maxlength="10" readonly size="20" type="text" value={model.text["frm1600VT:txtPg1Pt3I28Date"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-5a985e56a3d5"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I28CashC3" class="wh-inline-4a6e4644cae0" data-field-id="frm1600VT:txtPg1Pt3I28CashC3" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I28CashC3" maxlength="20" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I28CashC3"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <span class="smallBold">29</span>
                                      <span class="small">Check</span>
                                    </td>
                                    <td
                                      class="wh-inline-f7d5f529256d"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I29CheckC1" class="wh-inline-7d7091035e0a" data-field-id="frm1600VT:txtPg1Pt3I29CheckC1" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I29CheckC1" maxlength="8" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I29CheckC1"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I29CheckC2" class="wh-inline-0c3cc0c26807" data-field-id="frm1600VT:txtPg1Pt3I29CheckC2" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I29CheckC2" maxlength="16" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I29CheckC2"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-ff74cda14f25"
                                      colspan="1"
                                    >
                                      <input class="wh-source-size-20" aria-label="txtPg1Pt3I29Date" data-field-id="frm1600VT:txtPg1Pt3I29Date" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I29Date" maxlength="10" readonly size="20" type="text" value={model.text["frm1600VT:txtPg1Pt3I29Date"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-5a985e56a3d5"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I29CheckC3" class="wh-inline-4a6e4644cae0" data-field-id="frm1600VT:txtPg1Pt3I29CheckC3" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I29CheckC3" maxlength="20" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I29CheckC3"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <span class="smallBold">30</span>
                                      <span class="small">Tax Debit Memo</span>
                                    </td>
                                    <td
                                      class="wh-inline-f7d5f529256d"
                                      colspan="1"
                                    >
                                    </td>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I30TaxDebitC2" class="wh-inline-0c3cc0c26807" data-field-id="frm1600VT:txtPg1Pt3I30TaxDebitC2" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I30TaxDebitC2" maxlength="16" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I30TaxDebitC2"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-d1fc33d7f2e6"
                                      colspan="1"
                                    >
                                      <input class="wh-source-size-20" aria-label="txtPg1Pt3I30Date" data-field-id="frm1600VT:txtPg1Pt3I30Date" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I30Date" maxlength="10" readonly size="20" type="text" value={model.text["frm1600VT:txtPg1Pt3I30Date"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-5a985e56a3d5"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I30TaxDebitC3" class="wh-inline-4a6e4644cae0" data-field-id="frm1600VT:txtPg1Pt3I30TaxDebitC3" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I30TaxDebitC3" maxlength="20" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I30TaxDebitC3"] ?? ""}>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td colspan="5">
                                      <span class="smallBold">31</span>
                                      <span class="small">Others</span>
                                      <span class="xsmallItalic">
                                        (specify)</span
                                      >
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I31OthersC1" class="wh-inline-7d7091035e0a" data-field-id="frm1600VT:txtPg1Pt3I31OthersC1" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I31OthersC1" maxlength="10" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I31OthersC1"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-f7d5f529256d"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I31OthersC2" class="wh-inline-7d7091035e0a" data-field-id="frm1600VT:txtPg1Pt3I31OthersC2" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I31OthersC2" maxlength="8" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I31OthersC2"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-62d30f373b1e"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I31OthersC3" class="wh-inline-0c3cc0c26807" data-field-id="frm1600VT:txtPg1Pt3I31OthersC3" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I31OthersC3" maxlength="16" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I31OthersC3"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-d1fc33d7f2e6"
                                      colspan="1"
                                    >
                                      <input class="wh-source-size-20" aria-label="txtPg1Pt3I31Date" data-field-id="frm1600VT:txtPg1Pt3I31Date" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I31Date" maxlength="10" readonly size="20" type="text" value={model.text["frm1600VT:txtPg1Pt3I31Date"] ?? ""}>
                                    </td>
                                    <td
                                      class="wh-inline-5a985e56a3d5"
                                      colspan="1"
                                    >
                                      <input aria-label="txtPg1Pt3I31OthersC4" class="wh-inline-4a6e4644cae0" data-field-id="frm1600VT:txtPg1Pt3I31OthersC4" data-print-control="text" data-print-value="" id="frm1600VT:txtPg1Pt3I31OthersC4" maxlength="20" readonly type="text" value={model.text["frm1600VT:txtPg1Pt3I31OthersC4"] ?? ""}>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table class="RowSubTable wh-inline-32a05c30a1d2">
                                <tbody
                                  ><tr>
                                    <td class="wh-inline-120dc535697f">
                                      <table
                                        class="RowSubTable wh-inline-9e4fa37ad723"
                                      >
                                        <tbody
                                          ><tr>
                                            <td>
                                              <span class="xsmall"
                                                >Machine Validation / Revenue
                                                Official Receipt Details</span
                                              >
                                              <span class="xsmallItalic"
                                                >(if not filed with an
                                                Authorized Agent Bank)</span
                                              >
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                    <td class="wh-inline-e2c5573ce81c">
                                      <table
                                        class="RowSubTable wh-inline-928454b7fcc8"
                                      >
                                        <tbody
                                          ><tr>
                                            <td>
                                              <span class="xsmallItalic"
                                                >Stamp of Receiving Office/AAB
                                                and Date of Receipt<br />
                                                (RO's Signature/Bank Teller's Initial)</span
                                              >
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
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      </div>
  </div>
  <div
    class="withholding-print-page-content wh-page-1600vtv2018-2"
    data-source-page="2"
  >
    <div id="formPaper" data-source-form-frame>
    <div class="noCellSpace wh-inline-41b262cb38b5" id="Page2Content">
      <div class="SubPageDiv">
        <table class="FormHeader wh-inline-0ee3c4c4ed4a wh-eq-header">
          <tbody
            ><tr>
              <td>
                <span class="FormHeader2">BIR Form No.<br /></span>
                <span class="FormHeader1 wh-inline-68475f995fc0">1600-VT</span
                ><br />
                <span class="FormHeader2">January 2018</span>
                <span class="FormHeader2 wh-inline-68475f995fc0">Page 2</span>
              </td>
              <td class="wh-inline-dcd19df6c0d0">
                <span class="FormHeader1 wh-inline-68475f995fc0"
                  >Monthly Remittance Returns</span
                >
                <span class="FormHeader1 wh-inline-68475f995fc0"
                  >of Value-Added Tax Withheld</span
                >
              </td>
              <td>
                <img
                  alt="barcode"
                  class="wh-inline-5fb46f7e6008"
                  src="/legacy/img/withholding/original-065b90f1c3d98561.png"
                />
                <span class="xsmall"
                  ><br />
                                                       1600-VT 01/18 P2</span
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <table class="tblForm wh-inline-5de3708b1c06">
        <tbody
          ><tr>
            <td>
              <div class="SubPageDiv">
                <table class="RowSubTable, tblForm wh-inline-0ee3c4c4ed4a">
                  <tbody
                    ><tr>
                      <td class="style1">
                        <span class="smallBold">TIN</span>
                      </td>
                      <td class="style2 wh-inline-73554c7a4248">
                        <span class="smallBold">Withholding Agent's Name</span>
                      </td>
                    </tr>
                    <tr>
                      <td class="wh-inline-d9f8b596c968">
                        <input class="wh-source-size-4" aria-label="txtPg2TinC1" data-field-id="frm1600VT:txtPg2TinC1" data-print-control="text" data-print-value="" id="frm1600VT:txtPg2TinC1" maxlength="3" readonly size="4" type="text" value={model.text["frm1600VT:txtPg2TinC1"] ?? ""}>
                        <input class="wh-source-size-4" aria-label="txtPg2TinC2" data-field-id="frm1600VT:txtPg2TinC2" data-print-control="text" data-print-value="" id="frm1600VT:txtPg2TinC2" maxlength="3" readonly size="4" type="text" value={model.text["frm1600VT:txtPg2TinC2"] ?? ""}>
                        <input class="wh-source-size-4" aria-label="txtPg2TinC3" data-field-id="frm1600VT:txtPg2TinC3" data-print-control="text" data-print-value="" id="frm1600VT:txtPg2TinC3" maxlength="3" readonly size="4" type="text" value={model.text["frm1600VT:txtPg2TinC3"] ?? ""}>
                        <span class="wh-inline-5d0c6b19a115">
                          <input class="wh-source-size-4" aria-label="txtPg2TinC4" data-field-id="frm1600VT:txtPg2TinC4" data-print-control="text" data-print-value="" id="frm1600VT:txtPg2TinC4" maxlength="4" readonly size="4" type="text" value={model.text["frm1600VT:txtPg2TinC4"] ?? ""}/>
                        </span>
                        <input class="wh-source-size-4" aria-label="BrachMask2" data-field-id="BrachMask2" data-print-control="text" data-print-value="" id="BrachMask2" readonly size="4" value={model.text["BrachMask2"] ?? ""}>
                      </td>
                      <td class="wh-inline-dce2145c66a2">
                        <input aria-label="txtPg2RegisteredName" class="wh-inline-d9dd516c9cca" data-field-id="frm1600VT:txtPg2RegisteredName" data-print-control="text" data-print-value="" id="frm1600VT:txtPg2RegisteredName" readonly type="text" value={model.text["frm1600VT:txtPg2RegisteredName"] ?? ""}>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div id="Part4to5">
                <div class="SubPageDiv">
                  <table class="RowSubTable wh-inline-c983fe83f7f4">
                    <tbody
                      ><tr>
                        <td
                          class="tblFormTdPart wh-inline-8a0f413f23c4"
                          colspan="1"
                        >
                          <span class="smallBold">
                            Schedule 1 - Monthly Alphalist of Payees from Whom
                            Taxes were Withheld</span
                          >
                          <span class="xxsmallItalic"
                            >(format only) (Submit in electronic attachment for
                            eFPS or email to                     
                                                                     
                                                                     
                                                                     
                                                
                                              esubmission@bir.gov.ph)</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="RowSubTable, tblForm wh-inline-0ee3c4c4ed4a">
                    <tbody
                      ><tr>
                        <td class="wh-inline-4266f877fcdf">
                          <span class="xsmall">Seq. No.(1)</span>
                        </td>
                        <td class="wh-inline-59a79503c2dd">
                          <span class="xsmall">TIN(2)</span>
                        </td>
                        <td class="wh-inline-364aebeb93e3">
                          <span class="xxsmall"
                            >Name of Payees(Last Name, First Name, Middle Name
                            for Individual)/(Registered Name for Non-Individual)</span
                          >
                          <span class="xsmall">(3)</span>
                        </td>
                        <td class="wh-inline-3bba595850ee">
                          <span class="xsmall">ATC(4)</span>
                        </td>
                        <td class="wh-inline-8e50afe5e647">
                          <span class="xsmall">Amount of IncomePayment(5)</span>
                        </td>
                        <td class="wh-inline-0ac3ce967520">
                          <span class="xsmall">Tax Rate(6)</span>
                        </td>
                        <td class="wh-inline-65c583c3e0a8">
                          <span class="xsmall"
                            >Amount of Tax Withheld(7) = (5x6)</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-078faed31491">
                    <tbody
                      ><tr>
                        <td class="wh-inline-fb577bdea42f">
                          <input aria-label="Pg2Sc1SeqNo1" class="wh-inline-fd4b3b73717a" data-field-id="frm1600VT:Pg2Sc1SeqNo1" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1SeqNo1" maxlength="20" readonly type="text" value={model.text["frm1600VT:Pg2Sc1SeqNo1"] ?? ""}>
                        </td>
                        <td class="wh-inline-aa4cf70b8b5c">
                          <input aria-label="Pg2Sc1TIN1" class="wh-inline-3e000522285a" data-field-id="frm1600VT:Pg2Sc1TIN1" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TIN1" maxlength="14" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TIN1"] ?? ""}>
                        </td>
                        <td class="wh-inline-c951f648577b">
                          <input aria-label="Pg2Sc1Name1" class="wh-inline-596e862fad34" data-field-id="frm1600VT:Pg2Sc1Name1" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1Name1" maxlength="40" readonly type="text" value={model.text["frm1600VT:Pg2Sc1Name1"] ?? ""}>
                        </td>
                        <td class="wh-inline-020f4e97bcda">
                          <input aria-label="Pg2Sc1ATC1" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1ATC1" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1ATC1" maxlength="5" readonly type="text" value={model.text["frm1600VT:Pg2Sc1ATC1"] ?? ""}>
                        </td>
                        <td class="wh-inline-9cf38611e7dd">
                          <input aria-label="Pg2Sc1AmtOfIncPmt1" class="wh-inline-6e1aa182bce1" data-field-id="frm1600VT:Pg2Sc1AmtOfIncPmt1" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfIncPmt1" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfIncPmt1"] ?? ""}>
                        </td>
                        <td class="wh-inline-d854b698a2e2">
                          <input aria-label="Pg2Sc1TaxRate1" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1TaxRate1" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TaxRate1" maxlength="6" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TaxRate1"] ?? ""}>
                        </td>
                        <td class="wh-inline-c9afbbf77ef8">
                          <input aria-label="Pg2Sc1AmtOfTxWthhld1" class="wh-inline-02de42c343bb" data-field-id="frm1600VT:Pg2Sc1AmtOfTxWthhld1" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfTxWthhld1" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfTxWthhld1"] ?? ""}>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-078faed31491">
                    <tbody
                      ><tr>
                        <td class="wh-inline-fb577bdea42f">
                          <input aria-label="Pg2Sc1SeqNo2" class="wh-inline-fd4b3b73717a" data-field-id="frm1600VT:Pg2Sc1SeqNo2" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1SeqNo2" maxlength="20" readonly type="text" value={model.text["frm1600VT:Pg2Sc1SeqNo2"] ?? ""}>
                        </td>
                        <td class="wh-inline-aa4cf70b8b5c">
                          <input aria-label="Pg2Sc1TIN2" class="wh-inline-3e000522285a" data-field-id="frm1600VT:Pg2Sc1TIN2" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TIN2" maxlength="14" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TIN2"] ?? ""}>
                        </td>
                        <td class="wh-inline-c951f648577b">
                          <input aria-label="Pg2Sc1Name2" class="wh-inline-596e862fad34" data-field-id="frm1600VT:Pg2Sc1Name2" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1Name2" maxlength="40" readonly type="text" value={model.text["frm1600VT:Pg2Sc1Name2"] ?? ""}>
                        </td>
                        <td class="wh-inline-020f4e97bcda">
                          <input aria-label="Pg2Sc1ATC2" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1ATC2" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1ATC2" maxlength="5" readonly type="text" value={model.text["frm1600VT:Pg2Sc1ATC2"] ?? ""}>
                        </td>
                        <td class="wh-inline-9cf38611e7dd">
                          <input aria-label="Pg2Sc1AmtOfIncPmt2" class="wh-inline-6e1aa182bce1" data-field-id="frm1600VT:Pg2Sc1AmtOfIncPmt2" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfIncPmt2" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfIncPmt2"] ?? ""}>
                        </td>
                        <td class="wh-inline-d854b698a2e2">
                          <input aria-label="Pg2Sc1TaxRate2" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1TaxRate2" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TaxRate2" maxlength="6" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TaxRate2"] ?? ""}>
                        </td>
                        <td class="wh-inline-c9afbbf77ef8">
                          <input aria-label="Pg2Sc1AmtOfTxWthhld2" class="wh-inline-02de42c343bb" data-field-id="frm1600VT:Pg2Sc1AmtOfTxWthhld2" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfTxWthhld2" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfTxWthhld2"] ?? ""}>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-078faed31491">
                    <tbody
                      ><tr>
                        <td class="wh-inline-fb577bdea42f">
                          <input aria-label="Pg2Sc1SeqNo3" class="wh-inline-fd4b3b73717a" data-field-id="frm1600VT:Pg2Sc1SeqNo3" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1SeqNo3" maxlength="20" readonly type="text" value={model.text["frm1600VT:Pg2Sc1SeqNo3"] ?? ""}>
                        </td>
                        <td class="wh-inline-aa4cf70b8b5c">
                          <input aria-label="Pg2Sc1TIN3" class="wh-inline-3e000522285a" data-field-id="frm1600VT:Pg2Sc1TIN3" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TIN3" maxlength="14" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TIN3"] ?? ""}>
                        </td>
                        <td class="wh-inline-c951f648577b">
                          <input aria-label="Pg2Sc1Name3" class="wh-inline-596e862fad34" data-field-id="frm1600VT:Pg2Sc1Name3" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1Name3" maxlength="40" readonly type="text" value={model.text["frm1600VT:Pg2Sc1Name3"] ?? ""}>
                        </td>
                        <td class="wh-inline-020f4e97bcda">
                          <input aria-label="Pg2Sc1ATC3" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1ATC3" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1ATC3" maxlength="5" readonly type="text" value={model.text["frm1600VT:Pg2Sc1ATC3"] ?? ""}>
                        </td>
                        <td class="wh-inline-9cf38611e7dd">
                          <input aria-label="Pg2Sc1AmtOfIncPmt3" class="wh-inline-6e1aa182bce1" data-field-id="frm1600VT:Pg2Sc1AmtOfIncPmt3" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfIncPmt3" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfIncPmt3"] ?? ""}>
                        </td>
                        <td class="wh-inline-d854b698a2e2">
                          <input aria-label="Pg2Sc1TaxRate3" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1TaxRate3" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TaxRate3" maxlength="6" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TaxRate3"] ?? ""}>
                        </td>
                        <td class="wh-inline-c9afbbf77ef8">
                          <input aria-label="Pg2Sc1AmtOfTxWthhld3" class="wh-inline-02de42c343bb" data-field-id="frm1600VT:Pg2Sc1AmtOfTxWthhld3" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfTxWthhld3" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfTxWthhld3"] ?? ""}>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-078faed31491">
                    <tbody
                      ><tr>
                        <td class="wh-inline-fb577bdea42f">
                          <input aria-label="Pg2Sc1SeqNo4" class="wh-inline-fd4b3b73717a" data-field-id="frm1600VT:Pg2Sc1SeqNo4" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1SeqNo4" maxlength="20" readonly type="text" value={model.text["frm1600VT:Pg2Sc1SeqNo4"] ?? ""}>
                        </td>
                        <td class="wh-inline-aa4cf70b8b5c">
                          <input aria-label="Pg2Sc1TIN4" class="wh-inline-3e000522285a" data-field-id="frm1600VT:Pg2Sc1TIN4" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TIN4" maxlength="14" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TIN4"] ?? ""}>
                        </td>
                        <td class="wh-inline-c951f648577b">
                          <input aria-label="Pg2Sc1Name4" class="wh-inline-596e862fad34" data-field-id="frm1600VT:Pg2Sc1Name4" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1Name4" maxlength="40" readonly type="text" value={model.text["frm1600VT:Pg2Sc1Name4"] ?? ""}>
                        </td>
                        <td class="wh-inline-020f4e97bcda">
                          <input aria-label="Pg2Sc1ATC4" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1ATC4" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1ATC4" maxlength="5" readonly type="text" value={model.text["frm1600VT:Pg2Sc1ATC4"] ?? ""}>
                        </td>
                        <td class="wh-inline-9cf38611e7dd">
                          <input aria-label="Pg2Sc1AmtOfIncPmt4" class="wh-inline-6e1aa182bce1" data-field-id="frm1600VT:Pg2Sc1AmtOfIncPmt4" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfIncPmt4" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfIncPmt4"] ?? ""}>
                        </td>
                        <td class="wh-inline-d854b698a2e2">
                          <input aria-label="Pg2Sc1TaxRate4" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1TaxRate4" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TaxRate4" maxlength="6" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TaxRate4"] ?? ""}>
                        </td>
                        <td class="wh-inline-c9afbbf77ef8">
                          <input aria-label="Pg2Sc1AmtOfTxWthhld4" class="wh-inline-02de42c343bb" data-field-id="frm1600VT:Pg2Sc1AmtOfTxWthhld4" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfTxWthhld4" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfTxWthhld4"] ?? ""}>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-078faed31491">
                    <tbody
                      ><tr>
                        <td class="wh-inline-fb577bdea42f">
                          <input aria-label="Pg2Sc1SeqNo5" class="wh-inline-fd4b3b73717a" data-field-id="frm1600VT:Pg2Sc1SeqNo5" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1SeqNo5" maxlength="20" readonly type="text" value={model.text["frm1600VT:Pg2Sc1SeqNo5"] ?? ""}>
                        </td>
                        <td class="wh-inline-aa4cf70b8b5c">
                          <input aria-label="Pg2Sc1TIN5" class="wh-inline-3e000522285a" data-field-id="frm1600VT:Pg2Sc1TIN5" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TIN5" maxlength="15" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TIN5"] ?? ""}>
                        </td>
                        <td class="wh-inline-c951f648577b">
                          <input aria-label="Pg2Sc1Name5" class="wh-inline-596e862fad34" data-field-id="frm1600VT:Pg2Sc1Name5" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1Name5" maxlength="40" readonly type="text" value={model.text["frm1600VT:Pg2Sc1Name5"] ?? ""}>
                        </td>
                        <td class="wh-inline-020f4e97bcda">
                          <input aria-label="Pg2Sc1ATC5" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1ATC5" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1ATC5" maxlength="5" readonly type="text" value={model.text["frm1600VT:Pg2Sc1ATC5"] ?? ""}>
                        </td>
                        <td class="wh-inline-9cf38611e7dd">
                          <input aria-label="Pg2Sc1AmtOfIncPmt5" class="wh-inline-6e1aa182bce1" data-field-id="frm1600VT:Pg2Sc1AmtOfIncPmt5" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfIncPmt5" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfIncPmt5"] ?? ""}>
                        </td>
                        <td class="wh-inline-d854b698a2e2">
                          <input aria-label="Pg2Sc1TaxRate5" class="wh-inline-6d37e5352466" data-field-id="frm1600VT:Pg2Sc1TaxRate5" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TaxRate5" maxlength="6" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TaxRate5"] ?? ""}>
                        </td>
                        <td class="wh-inline-c9afbbf77ef8">
                          <input aria-label="Pg2Sc1AmtOfTxWthhld5" class="wh-inline-02de42c343bb" data-field-id="frm1600VT:Pg2Sc1AmtOfTxWthhld5" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1AmtOfTxWthhld5" maxlength="25" readonly type="text" value={model.text["frm1600VT:Pg2Sc1AmtOfTxWthhld5"] ?? ""}>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-85a533a5c7b6">
                    <tbody
                      ><tr>
                        <td class="wh-inline-5c648a859fec">
                          <span class="smallBold"
                            >Total Taxes Withheld and Remitted
                          </span>
                        </td>
                        <td class="wh-inline-c9afbbf77ef8">
                          <input aria-label="Pg2Sc1TotTxWthhldAndRmtted" class="wh-inline-3e000522285a" data-field-id="frm1600VT:Pg2Sc1TotTxWthhldAndRmtted" data-print-control="text" data-print-value="" id="frm1600VT:Pg2Sc1TotTxWthhldAndRmtted" maxlength="20" readonly type="text" value={model.text["frm1600VT:Pg2Sc1TotTxWthhldAndRmtted"] ?? ""}>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-27372ac1cdef">
                    <tbody
                      ><tr>
                        <td class="wh-inline-61027cd49082">
                          <span class="smallBold"
                            >Table 1 – Alphanumeric Tax Code (ATC)</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-c9283bc11c55 wh-atc-reference-table">
                    <tbody
                      ><tr>
                        <td class="wh-inline-59165a617646">
                          <span class="smallBold">NATURE OF PAYMENT</span>
                        </td>
                        <td class="wh-inline-da525f58f306">
                          <span class="smallBold">TAX RATE</span>
                        </td>
                        <td class="wh-inline-da525f58f306">
                          <span class="smallBold">ATC</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-cbc7ea467ab5 wh-atc-reference-table">
                    <tbody
                      ><tr>
                        <td class="wh-inline-66aa48377825">
                          <span class="small">
                            APPLICABLE TO GOVERNMENT WITHHOLDING AGENTS ONLY:</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-e830b922a6d9 wh-atc-reference-table">
                    <tbody
                      ><tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            VAT Withholding on Purchase of Goods</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">5%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV010</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            VAT Withholding on Purchase of Services</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">5%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV020</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-724c3b7bb1dc wh-atc-reference-table">
                    <tbody
                      ><tr>
                        <td class="wh-inline-66aa48377825">
                          <span class="small">
                            APPLICABLE TO BOTH GOVERNMENT AND PRIVATE
                            WITHHOLDING AGENTS:</span
                          >
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <table class="wh-inline-0ee3c4c4ed4a wh-atc-reference-table">
                    <tbody
                      ><tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            Final Withholding VAT on Payments for lease or use
                            of properties or property rights owned by non-
                               residents (Government Withholding Agent)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV040</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            Final Withholding VAT on Payments for lease or use
                            of properties or property rights owned by non-
                               residents (Private Withholding Agent)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV050</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            Final Withholding VAT on Other Services rendered in
                            the Philippines by non-residents (Government
                               Withholding Agent)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV060</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            Final Withholding VAT on Other Services rendered in
                            the Philippines by non-residents (Private
                               Withholding Agent)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV070</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            VAT Withholding on Purchases of Goods (with waiver
                            of privilege to claim input tax credit) (creditable)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV012</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            VAT Withholding on Purchases of Goods (with waiver
                            of privilege to claim input tax credit) (final)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV014</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            VAT Withholding on Purchases of Services (with
                            waiver of privilege to claim input tax credit)
                               (creditable)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV022</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="wh-inline-d26ef6cd6b3a">
                          <span class="wh-inline-a35fe996bbb7">
                            VAT Withholding on Purchases of Services (with
                            waiver of privilege to claim input tax credit)
                            (final)</span
                          >
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">12%</span>
                        </td>
                        <td class="wh-inline-746476aeae5d">
                          <span class="small">WV024</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
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
        <h2>BIR Form 1600VTv2018 — {continuation.title}</h2>
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
