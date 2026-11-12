<script module lang="ts">
import type { PrintBinding } from "$lib/printing/withholding-print-model";
export const printBindings: readonly PrintBinding[] = [
  {
    "id": "frm1604cf:txtYear",
    "fallback": ""
  },
  {
    "id": "frm1604cf:amendedRtn_1",
    "source": "frm1604cf:amendedRtn",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604cf:amendedRtn_2",
    "source": "frm1604cf:amendedRtn",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604cf:txtSheets",
    "fallback": "0"
  },
  {
    "id": "frm1604cf:tinA",
    "fallback": ""
  },
  {
    "id": "frm1604cf:tinB",
    "fallback": ""
  },
  {
    "id": "frm1604cf:tinC",
    "fallback": ""
  },
  {
    "id": "frm1604cf:branchCode",
    "fallback": ""
  },
  {
    "id": "rdoSelect",
    "key": "frm1604cf:txtRDOCode"
  },
  {
    "id": "frm1604cf:description",
    "fallback": ""
  },
  {
    "id": "frm1604cf:registeredName",
    "fallback": ""
  },
  {
    "id": "frm1604cf:telephoneNumber",
    "fallback": ""
  },
  {
    "id": "frm1604cf:registeredAddress",
    "fallback": ""
  },
  {
    "id": "frm1604cf:zipCode",
    "fallback": ""
  },
  {
    "id": "frm1604cf:releasedOfFunds_1",
    "source": "frm1604cf:releasedOfFunds",
    "choice": "Y",
    "checked": false
  },
  {
    "id": "frm1604cf:releasedOfFunds_2",
    "source": "frm1604cf:releasedOfFunds",
    "choice": "N",
    "checked": true
  },
  {
    "id": "frm1604cf:txtRefMonth",
    "fallback": "",
    "options": {
      "00": "",
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
    "id": "frm1604cf:txtRefDate",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtRefYear",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txt12",
    "fallback": ""
  },
  {
    "id": "frm1604cf:select13",
    "fallback": "",
    "options": {
      "00": "",
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
    "id": "frm1604cf:categoryAgent_1",
    "source": "frm1604cf:categoryAgent",
    "choice": "P",
    "checked": false
  },
  {
    "id": "frm1604cf:categoryAgent_2",
    "source": "frm1604cf:categoryAgent",
    "choice": "G",
    "checked": false
  },
  {
    "id": "frm1604cf:txtSched1Date1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date5",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal5",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date6",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal6",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date7",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal7",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date8",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal8",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date9",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal9",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date10",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal10",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date11",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal11",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Date12",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1BankVal12",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched1TaxWheld12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Adj12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Pen12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TotalAmt12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1AdjTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched1Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date5",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal5",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date6",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal6",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date7",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal7",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date8",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal8",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date9",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal9",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date10",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal10",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date11",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal11",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Date12",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2BankVal12",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched2TaxWheld12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Pen12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TotalAmt12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched2Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date5",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal5",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt5",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date6",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal6",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt6",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date7",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal7",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt7",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date8",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal8",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt8",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date9",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal9",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt9",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date10",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal10",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt10",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date11",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal11",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt11",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Date12",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3BankVal12",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched3TaxWheld12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Pen12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TotalAmt12",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched3Total",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Date1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4BankVal1",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4TaxWheld1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Pen1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4TotalAmt1",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Date2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4BankVal2",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4TaxWheld2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Pen2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4TotalAmt2",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Date3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4BankVal3",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4TaxWheld3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Pen3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4TotalAmt3",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Date4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4BankVal4",
    "fallback": ""
  },
  {
    "id": "frm1604cf:txtSched4TaxWheld4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Pen4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4TotalAmt4",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4TaxWheldTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4PenTotal",
    "fallback": "0.00"
  },
  {
    "id": "frm1604cf:txtSched4Total",
    "fallback": "0.00"
  }
];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("1604CF", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="1604CF"
  aria-label="BIR Form 1604CF print preview"
>
  <div
    class="withholding-print-page-content wh-page-1604cf-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-1c3f32c4364c" id="wrapper">
      <div id="formPaper">
        <div id="mainContent">
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            class="wh-inline-326fc4820d8f"
          >
            <tbody
              ><tr>
                <td>
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="wh-inline-eaa388e3b68a"
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
                        <td class="wh-inline-2940ef0daad0">
                          <span class="wh-inline-429482632af7"
                            >Republika ng Pilipinas
                            <br />Kagawaran ng Pananalapi
                            <br />Kawanihan ng Rentas
                            <br />Internas</span
                          >
                        </td>
                        <td class="wh-inline-a30033456d9a">
                          <span class="wh-inline-efa796cba67a">
                            Annual Information Return<br />
                            of Income Taxes Withheld on<br />
                            Compensation and Final Withholding Taxes
                          </span>
                        </td>
                        <td class="wh-inline-9b7f7f671c60">
                          <span class="wh-inline-429482632af7"
                            >BIR Form No.<br /></span
                          >
                          <span class="wh-inline-5a0d0110f5a9"
                            >1604-CF<br /></span
                          >
                          <span class="wh-inline-429482632af7"
                            >July 2008(ENCS)</span
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-007db826741b">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-183aa7df47ed"
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
                                    >For the Year (YYYY)
                                    <input class="wh-source-size-5" aria-label="txtYear" data-field-id="frm1604cf:txtYear" data-print-control="text" data-print-value="" id="frm1604cf:txtYear" maxlength="4" readonly size="5" type="text" value={model.text["frm1604cf:txtYear"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-5890baff3197">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-0b1c5d170ebf"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-38eb7c1ab5d2"
                                  ><span class="wh-inline-4cf6c17959a7">2</span
                                  ></td
                                >
                                <td class="wh-inline-1a5329f85423"
                                  ><span class="wh-inline-cb3a2164388b"
                                    >Amended Return?</span
                                  ></td
                                >
                                <td class="wh-inline-21f315789b7b">
                                  <fieldset
                                    class="iceSelOneRb-dis fieldText1-dis wh-inline-3276beb56669"
                                    id="frm1604cf:j_id217"
                                  >
                                    <table
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      class="iceSelOneRb-dis fieldText1-dis wh-inline-cde08151d231"
                                    >
                                      <tbody>
                                        <tr>
                                          <td
                                            ><input aria-label="amendedRtn_1" checked={model.checks["frm1604cf:amendedRtn_1"] ?? false} data-field-id="frm1604cf:amendedRtn_1" data-print-control="radio" disabled id="frm1604cf:amendedRtn_1" type="radio"/><span
                                              class="wh-inline-cb3a2164388b"
                                              >Yes</span
                                            >
                                          </td>
                                          <td
                                            ><input aria-label="amendedRtn_2" checked={model.checks["frm1604cf:amendedRtn_2"] ?? false} data-field-id="frm1604cf:amendedRtn_2" data-print-control="radio" disabled id="frm1604cf:amendedRtn_2" type="radio"/><span
                                              class="wh-inline-cb3a2164388b"
                                              >No</span
                                            ></td
                                          >
                                        </tr>
                                      </tbody>
                                    </table>
                                  </fieldset>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-2ed31d8be076">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-2aebbc259fe8"
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
                                    >No. of Sheets Attached?
                                    <input aria-label="txtSheets" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-4" data-field-id="frm1604cf:txtSheets" data-print-control="text" data-print-value="" id="frm1604cf:txtSheets" maxlength="2" readonly size="4" type="text" value={model.text["frm1604cf:txtSheets"] ?? ""}>
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
              </tr>
              <tr>
                <td>
                  <table
                    border="1"
                    cellpadding="0"
                    cellspacing="0"
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTdPart">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-d2ab23440b9b"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-ae5bb6dc1201"
                                  ><span class="wh-inline-dd2eceacf41a"
                                    >Part I</span
                                  ></td
                                >
                                <td class="wh-inline-2ea09d9b12c3">
                                  <span class="wh-inline-7dbd70daabfc"
                                    >Background Information</span
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
              <tr>
                <td>
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-007db826741b">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-a4c1124eac28"
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
                                    >TIN
                                  </span>
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input class="wh-source-size-2" aria-label="tinA" data-field-id="frm1604cf:tinA" data-print-control="text" data-print-value="" id="frm1604cf:tinA" maxlength="3" readonly size="2" type="text" value={model.text["frm1604cf:tinA"] ?? ""}>
                                    <input class="wh-source-size-2" aria-label="tinB" data-field-id="frm1604cf:tinB" data-print-control="text" data-print-value="" id="frm1604cf:tinB" maxlength="3" readonly size="2" type="text" value={model.text["frm1604cf:tinB"] ?? ""}>
                                    <input class="wh-source-size-2" aria-label="tinC" data-field-id="frm1604cf:tinC" data-print-control="text" data-print-value="" id="frm1604cf:tinC" maxlength="3" readonly size="2" type="text" value={model.text["frm1604cf:tinC"] ?? ""}>
                                    <input class="wh-source-size-2" aria-label="branchCode" data-field-id="frm1604cf:branchCode" data-print-control="text" data-print-value="" id="frm1604cf:branchCode" maxlength="5" readonly size="2" type="text" value={model.text["frm1604cf:branchCode"] ?? ""}>
                                  </span>
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
                            class="wh-inline-f51a34e6a157"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-6e606d24db7d"
                                  ><span class="wh-inline-15663751d502">
                                    5
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >RDO Code
                                  </span></td
                                >
                                <td data-field-id="rdoSelect" id="rdoSelect"
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
                            class="wh-inline-2895bf9fc44c"
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
                                    >Line of Business/Occupation
                                  </span>
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input class="wh-source-size-20" aria-label="description" data-field-id="frm1604cf:description" data-print-control="text" data-print-value="" id="frm1604cf:description" maxlength="30" readonly size="20" type="text" value={model.text["frm1604cf:description"] ?? ""}>
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-e4184a0e1cb3">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-158afaf3d404"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-8ee9b0356bbd">
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-322725339a93"
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
                                            >Taxpayer's Name (Last Name, First
                                            Name, Middle Name for
                                            Individuals)/(Registered Name for
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
                                    class="wh-inline-322725339a93"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6b6ee2d44756">
                                        </td>
                                        <td
                                          ><input class="wh-source-size-70" aria-label="registeredName" data-field-id="frm1604cf:registeredName" data-print-control="text" data-print-value="" id="frm1604cf:registeredName" maxlength="70" readonly size="70" type="text" value={model.text["frm1604cf:registeredName"] ?? ""}></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-f2d58f96db5c">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-48f3cfcfcc42"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-7777c2f5e271"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    8
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Telephone Number</span
                                  ></td
                                >
                              </tr>
                              <tr>
                                <td>
                                  <div class="wh-inline-a30033456d9a">
                                    <input class="wh-source-size-15" aria-label="telephoneNumber" data-field-id="frm1604cf:telephoneNumber" data-print-control="text" data-print-value="" id="frm1604cf:telephoneNumber" maxlength="20" readonly size="15" type="text" value={model.text["frm1604cf:telephoneNumber"] ?? ""}>
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-dd1e19e75217">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-15fcf86bdc29"
                          >
                            <tbody
                              ><tr>
                                <td>
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    class="wh-inline-15fcf86bdc29"
                                  >
                                    <tbody
                                      ><tr>
                                        <td class="wh-inline-6e606d24db7d"
                                          ><span class="wh-inline-4cf6c17959a7">
                                            9
                                          </span></td
                                        >
                                        <td
                                          ><span class="wh-inline-cb3a2164388b"
                                            >Registered Address</span
                                          ></td
                                        >
                                        <td
                                          ><input class="wh-source-size-70" aria-label="registeredAddress" data-field-id="frm1604cf:registeredAddress" data-print-control="text" data-print-value="" id="frm1604cf:registeredAddress" maxlength="70" readonly size="70" type="text" value={model.text["frm1604cf:registeredAddress"] ?? ""}></td
                                        >
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-e27cc78d192a">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-d74bda6ec0e4"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-04d4f857303d"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    10
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Zip Code</span
                                  ></td
                                >
                                <td>
                                  <div class="wh-inline-9cb088a595d0">
                                    <input class="wh-source-size-12" aria-label="zipCode" data-field-id="frm1604cf:zipCode" data-print-control="text" data-print-value="" id="frm1604cf:zipCode" maxlength="12" readonly size="12" type="text" value={model.text["frm1604cf:zipCode"] ?? ""}>
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
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-e0cb9eb047fd"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-dd8759b400e4">
                                  <span class="wh-inline-4cf6c17959a7">
                                    11
                                  </span>
                                  <span class="wh-inline-cb3a2164388b"
                                    >In case of overwithholding/overremittance
                                    after the year-end adjustment on
                                    compensation,<br />
                                           have you released the refunds to your employees?</span
                                  >
                                </td>
                                <td class="wh-inline-6e88730cdd56">
                                  <span class="wh-inline-429482632af7"
                                    >If yes, specify the date of refund
                                    (mm/dd/yyyy)</span
                                  >
                                </td>
                              </tr>
                              <tr>
                                <td class="wh-inline-a30033456d9a">
                                  <fieldset
                                    class="iceSelOneRb-dis fieldText1-dis wh-inline-ce3c0fe903e0"
                                    id="frm1604cf:j_id398"
                                  >
                                    <div class="wh-inline-5c8a2699196f">
                                      <div class="wh-inline-9cb088a595d0"></div>
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="iceSelOneRb-dis fieldText1-dis wh-inline-c064c0c9f0c6"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              ><span
                                                class="wh-inline-429482632af7"
                                              >
                                                <input aria-label="releasedOfFunds_1" checked={model.checks["frm1604cf:releasedOfFunds_1"] ?? false} data-field-id="frm1604cf:releasedOfFunds_1" data-print-control="radio" disabled id="frm1604cf:releasedOfFunds_1" type="radio"/>
                                                <span
                                                  class="wh-inline-cb3a2164388b"
                                                  >Yes</span
                                                >
                                              </span></td
                                            >
                                            <td
                                              ><span
                                                class="wh-inline-429482632af7"
                                              >
                                                <input aria-label="releasedOfFunds_2" checked={model.checks["frm1604cf:releasedOfFunds_2"] ?? false} data-field-id="frm1604cf:releasedOfFunds_2" data-print-control="radio" disabled id="frm1604cf:releasedOfFunds_2" type="radio"/>
                                                <span
                                                  class="wh-inline-cb3a2164388b"
                                                  >No</span
                                                >
                                              </span></td
                                            >
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </fieldset>
                                </td>
                                <td>
                                  <span class="wh-inline-cb3a2164388b">
                                    <span aria-label="txtRefMonth" class="iceSelOneMnu-dis labels wh-print-select" data-field-id="frm1604cf:txtRefMonth" data-print-control="select" id="frm1604cf:txtRefMonth">{model.text["frm1604cf:txtRefMonth"] ?? ""}</span>
                                    <input aria-label="txtRefDate" class="iceInpTxt-dis wh-source-size-2" data-field-id="frm1604cf:txtRefDate" data-print-control="text" data-print-value="" id="frm1604cf:txtRefDate" maxlength="2" readonly size="2" type="text" value={model.text["frm1604cf:txtRefDate"] ?? ""}>
                                    <input aria-label="txtRefYear" class="iceInpTxt-dis wh-source-size-4" data-field-id="frm1604cf:txtRefYear" data-print-control="text" data-print-value="" id="frm1604cf:txtRefYear" maxlength="4" readonly size="4" type="text" value={model.text["frm1604cf:txtRefYear"] ?? ""}>
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd wh-inline-a79ec93d35c6">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-8a372e493435"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-ca629fed53a8"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    12
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Total Amount of Overremittance on Tax
                                    Withheld under Compensation
                                  </span></td
                                >
                                <td class="wh-inline-36fe9f8cef2e">
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txt12" class="iceInpTxt-dis wh-inline-386bb5d6139a wh-source-size-17" data-field-id="frm1604cf:txt12" data-print-control="text" data-print-value="" id="frm1604cf:txt12" maxlength="17" readonly size="17" type="text" value={model.text["frm1604cf:txt12"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        <td class="tblFormTd wh-inline-27f64aadb38f"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-6a9a28c8e0c7"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-e48c3e299fc0"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    13
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Month of First Crediting of Overremittance</span
                                  ></td
                                >
                                <td class="wh-inline-69652284d042"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <span aria-label="select13" class="iceSelOneMnu-dis labels wh-print-select" data-field-id="frm1604cf:select13" data-print-control="select" id="frm1604cf:select13">{model.text["frm1604cf:select13"] ?? ""}</span>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                        <td class="tblFormTd wh-inline-5890baff3197">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-87f81dfb2995"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-04d4f857303d"
                                  ><span class="wh-inline-4cf6c17959a7">
                                    14
                                  </span><span class="wh-inline-cb3a2164388b"
                                    >Category of Withholding Agent</span
                                  ></td
                                >
                                <td class="wh-inline-04d4f857303d">
                                  <div class="wh-inline-a30033456d9a">
                                    <fieldset
                                      class="wh-inline-0e0ac6cf250a"
                                      id="frm1604cf:j_id392"
                                    >
                                      <div class="wh-inline-69074f3d5ca3">
                                        <table
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="wh-inline-ae32e3de46e4"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                ><input aria-label="categoryAgent_1" checked={model.checks["frm1604cf:categoryAgent_1"] ?? false} data-field-id="frm1604cf:categoryAgent_1" data-print-control="radio" disabled id="frm1604cf:categoryAgent_1" type="radio"/>
                                                <span
                                                  class="wh-inline-cb3a2164388b"
                                                  >Private</span
                                                >
                                              </td>
                                              <td
                                                ><input aria-label="categoryAgent_2" checked={model.checks["frm1604cf:categoryAgent_2"] ?? false} data-field-id="frm1604cf:categoryAgent_2" data-print-control="radio" disabled id="frm1604cf:categoryAgent_2" type="radio"/>
                                                <span
                                                  class="wh-inline-cb3a2164388b"
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTdPart">
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-81ec95f53f2d"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-36fe9f8cef2e">
                                  <span class="wh-inline-dd2eceacf41a"
                                    >Part II</span
                                  ></td
                                >
                                <td class="wh-inline-574b29391e25">
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-7dbd70daabfc"
                                      >S u m m a r y   o f   R e m i t t a n c e
                                      s</span
                                    >
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="tblFormTdPart"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-81ec95f53f2d"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-36fe9f8cef2e">
                                  <span class="wh-inline-dd2eceacf41a"
                                    >Schedule 1</span
                                  ></td
                                >
                                <td class="wh-inline-574b29391e25"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      ><span class="wh-inline-cb3a2164388b"
                                        ><b
                                          >R e m i t t a n c e   p e r   B I R  
                                          F o r m   N o.   1 6 0 1 - C</b
                                        ></span
                                      ></span
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
                    class="tblForm wh-inline-f3eac4dbb036"
                  >
                    <tbody
                      ><tr>
                        <td class="tblFormTd"
                          ><table
                            border="1"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-605e5fd35839"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-be93aa044c2c"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >MONTH</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-be7269108542"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >DATE OF REMITTANCE</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-be7269108542"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >NAME OF BANK/BANK CODE/ROR NO., IF ANY</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-be7269108542"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TAXES WITHHELD</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-be7269108542"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >ADJUSTMENT</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-be7269108542"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >PENALTIES</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-be7269108542"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TOTAL AMOUNT REMITTED</span
                                    >
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JAN</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date1" class="iceInpTxt wh-inline-5e9ac384546b wh-source-size-12" data-field-id="frm1604cf:txtSched1Date1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date1" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date1"] ?? ""}>
                                  </span>
                                </td>
                                <td class="wh-inline-a30033456d9a">
                                  <span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal1" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal1" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal1"] ?? ""}>
                                  </span>
                                </td>
                                <td>
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld1" class="iceInpTxt wh-inline-bbdc0f6b7eb9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld1"] ?? ""}>
                                  </span>
                                </td>
                                <td>
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj1" class="iceInpTxt wh-inline-bbdc0f6b7eb9 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj1"] ?? ""}>
                                  </span></td
                                >
                                <td>
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen1" class="iceInpTxt wh-inline-bbdc0f6b7eb9 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen1"] ?? ""}>
                                  </span>
                                </td>
                                <td>
                                  <span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt1" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt1"] ?? ""}>
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >FEB</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date2" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-12" data-field-id="frm1604cf:txtSched1Date2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date2" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date2"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal2" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal2" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal2"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld2"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj2"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen2"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt2" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt2"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAR</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date3" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-12" data-field-id="frm1604cf:txtSched1Date3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date3" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date3"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal3" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal3" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal3"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld3"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj3"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen3"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt3" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt3"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >APR</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date4" class="iceInpTxt wh-inline-e903ccf22225 wh-source-size-12" data-field-id="frm1604cf:txtSched1Date4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date4" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date4"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal4" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal4" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal4"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld4" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld4"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj4" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj4"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen4" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen4"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt4" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt4"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAY</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date5" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date5" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date5"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal5" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal5" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal5"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld5" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld5"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj5" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj5"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen5" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen5"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt5" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt5"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUN</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date6" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date6" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date6"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal6" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal6" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal6"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld6" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld6"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj6" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj6"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen6" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen6"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt6" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt6"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUL</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date7" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date7" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date7"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal7" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal7" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal7"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld7" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld7"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj7" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj7"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen7" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen7"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt7" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt7"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >AUG</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date8" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date8" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date8"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal8" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal8" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal8"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld8" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld8"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj8" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj8"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen8" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen8"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt8" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt8"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >SEP</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date9" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date9" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date9"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal9" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal9" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal9"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld9" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld9"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj9" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj9"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen9" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen9"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt9" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt9"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >OCT</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date10" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date10" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date10"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal10" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal10" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal10"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld10" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld10"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj10" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj10"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen10" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen10"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt10" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt10"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >NOV</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date11" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date11" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date11"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal11" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal11" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal11"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld11" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld11"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj11" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj11"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen11" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen11"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt11" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt11"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >DEC</span
                                  ></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-97f71f169000">
                                    <input aria-label="txtSched1Date12" class="iceInpTxt wh-inline-314f6f644eaa wh-source-size-12" data-field-id="frm1604cf:txtSched1Date12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Date12" maxlength="10" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1Date12"] ?? ""}>
                                  </span></td
                                >
                                <td class="wh-inline-a30033456d9a"
                                  ><span class="wh-inline-649b1ec8a1ed">
                                    <input aria-label="txtSched1BankVal12" class="iceInpTxt wh-source-size-12" data-field-id="frm1604cf:txtSched1BankVal12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1BankVal12" maxlength="50" readonly size="12" type="text" value={model.text["frm1604cf:txtSched1BankVal12"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TaxWheld12" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheld12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheld12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheld12"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Adj12" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Adj12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Adj12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Adj12"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Pen12" class="iceInpTxt wh-inline-d039ea43e5f3 wh-source-size-20" data-field-id="frm1604cf:txtSched1Pen12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Pen12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Pen12"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1TotalAmt12" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TotalAmt12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TotalAmt12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TotalAmt12"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >TOTAL</span
                                  ></td
                                >
                                <td> </td>
                                <td> </td>
                                <td
                                  ><span class="wh-inline-3f9f0065d1a9">
                                    <input aria-label="txtSched1TaxWheldTotal" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1TaxWheldTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1TaxWheldTotal"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1AdjTotal" class="iceInpTxt-dis wh-inline-f74eb3a71b30 wh-source-size-20" data-field-id="frm1604cf:txtSched1AdjTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1AdjTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1AdjTotal"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1PenTotal" class="iceInpTxt-dis wh-inline-f74eb3a71b30 wh-source-size-20" data-field-id="frm1604cf:txtSched1PenTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1PenTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1PenTotal"] ?? ""}>
                                  </span></td
                                >
                                <td
                                  ><span class="wh-inline-232ced7b40ab">
                                    <input aria-label="txtSched1Total" class="iceInpTxt-dis wh-inline-3a5c0b4b50e9 wh-source-size-20" data-field-id="frm1604cf:txtSched1Total" data-print-control="text" data-print-value="" id="frm1604cf:txtSched1Total" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched1Total"] ?? ""}>
                                  </span></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-cf754d2a0594"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-36fe9f8cef2e">
                                  <span class="wh-inline-dd2eceacf41a"
                                    >Schedule 2</span
                                  ></td
                                >
                                <td class="wh-inline-574b29391e25"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      ><span class="wh-inline-97f71f169000"
                                        ><span class="wh-inline-cb3a2164388b"
                                          ><b
                                            >R e m i t t a n c e   p e r   B I
                                            R   F o r m   N o.   1 6 0 1 - F</b
                                          ></span
                                        ></span
                                      ><span class="wh-inline-6d319e71fe1f"
                                      ></span></span
                                    >
                                  </div></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd"
                          ><table
                            border="1"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-605e5fd35839"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-be93aa044c2c"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >MONTH</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >DATE OF REMITTANCE</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >NAME OF BANK/BANK CODE/ROR NO., IF ANY</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TAXES WITHHELD</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >PENALTIES</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TOTAL AMOUNT REMITTED</span
                                    >
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JAN</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date1" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date1" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal1" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal1" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt1" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >FEB</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date2" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date2" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal2" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal2" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt2" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date3" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date3" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal3" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal3" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt3" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >APR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date4" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date4" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal4" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal4" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt4" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAY</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date5" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date5" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal5" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal5" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld5" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen5" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt5" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUN</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date6" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date6" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal6" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal6" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld6" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen6" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt6" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUL</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date7" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date7" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal7" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal7" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld7" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen7" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt7" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >AUG</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date8" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date8" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal8" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal8" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld8" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen8" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt8" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >SEP</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date9" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date9" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal9" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal9" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld9" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen9" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt9" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >OCT</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date10" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date10" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal10" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal10" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld10" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen10" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt10" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >NOV</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date11" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date11" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal11" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal11" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld11" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen11" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt11" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >DEC</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched2Date12" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-14" data-field-id="frm1604cf:txtSched2Date12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Date12" maxlength="10" readonly size="14" type="text" value={model.text["frm1604cf:txtSched2Date12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched2BankVal12" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched2BankVal12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2BankVal12" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2BankVal12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TaxWheld12" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheld12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheld12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheld12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Pen12" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched2Pen12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Pen12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Pen12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2TotalAmt12" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TotalAmt12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TotalAmt12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TotalAmt12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
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
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-b06b2843c8f8">
                                      <input aria-label="txtSched2TaxWheldTotal" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2TaxWheldTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2TaxWheldTotal"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2PenTotal" class="iceInpTxt-dis wh-inline-814fd7bc6f1a wh-source-size-20" data-field-id="frm1604cf:txtSched2PenTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2PenTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2PenTotal"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched2Total" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched2Total" data-print-control="text" data-print-value="" id="frm1604cf:txtSched2Total" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched2Total"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-81ec95f53f2d"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-36fe9f8cef2e">
                                  <span class="wh-inline-dd2eceacf41a"
                                    >Schedule 3</span
                                  ></td
                                >
                                <td class="wh-inline-52ca25a48a95"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      ><span class="wh-inline-97f71f169000"
                                        ><span class="wh-inline-97f71f169000"
                                          ><span class="wh-inline-cb3a2164388b"
                                            ><b
                                              >R e m i t t a n c e   p e r   B I
                                              R   F o r m   N o.   1 6 0 2</b
                                            ></span
                                          ></span
                                        ><span class="wh-inline-6d319e71fe1f"
                                        ></span></span
                                      ><span class="wh-inline-6d319e71fe1f"
                                      ></span></span
                                    >
                                  </div></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd"
                          ><table
                            border="1"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-605e5fd35839"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-be93aa044c2c"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >MONTH</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >DATE OF REMITTANCE</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >NAME OF BANK/BANK CODE/ROR NO., IF ANY</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TAXES WITHHELD</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >PENALTIES</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-4db315f9cbed"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TOTAL AMOUNT REMITTED</span
                                    >
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JAN</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date1" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date1" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal1" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal1" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt1" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >FEB</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date2" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date2" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal2" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal2" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt2" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date3" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date3" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal3" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal3" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt3" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >APR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date4" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date4" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal4" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal4" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt4" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >MAY</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date5" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date5" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal5" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal5" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld5" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen5" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt5" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt5" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt5" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt5"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUN</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date6" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date6" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal6" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal6" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld6" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen6" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt6" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt6" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt6" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt6"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >JUL</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date7" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date7" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal7" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal7" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld7" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen7" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt7" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt7" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt7" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt7"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >AUG</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date8" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date8" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal8" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal8" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld8" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen8" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt8" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt8" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt8" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt8"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >SEP</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date9" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date9" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal9" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal9" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld9" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen9" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt9" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt9" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt9" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt9"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >OCT</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date10" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date10" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal10" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal10" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld10" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen10" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt10" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt10" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt10" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt10"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >NOV</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date11" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date11" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal11" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal11" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld11" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen11" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt11" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt11" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt11" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt11"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >DEC</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched3Date12" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched3Date12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Date12" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched3Date12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched3BankVal12" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched3BankVal12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3BankVal12" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3BankVal12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheld12" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheld12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheld12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheld12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Pen12" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched3Pen12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Pen12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Pen12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TotalAmt12" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TotalAmt12" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TotalAmt12" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TotalAmt12"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
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
                                <td>
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3TaxWheldTotal" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3TaxWheldTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3TaxWheldTotal"] ?? ""}>
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3PenTotal" class="iceInpTxt-dis wh-inline-814fd7bc6f1a wh-source-size-20" data-field-id="frm1604cf:txtSched3PenTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3PenTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3PenTotal"] ?? ""}>
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched3Total" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched3Total" data-print-control="text" data-print-value="" id="frm1604cf:txtSched3Total" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched3Total"] ?? ""}>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td class="tblFormTd"
                          ><table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-81ec95f53f2d"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-36fe9f8cef2e">
                                  <span class="wh-inline-dd2eceacf41a"
                                    >Schedule 4</span
                                  ></td
                                >
                                <td class="wh-inline-52ca25a48a95"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      ><span class="wh-inline-97f71f169000"
                                        ><span class="wh-inline-97f71f169000"
                                          ><span class="wh-inline-97f71f169000"
                                            ><span
                                              class="wh-inline-cb3a2164388b"
                                              ><b
                                                >R e m i t t a n c e   p e r   B
                                                I R   F o r m   N o.   1 6 0 3</b
                                              ></span
                                            ></span
                                          ><span class="wh-inline-6d319e71fe1f"
                                          ></span></span
                                        ><span class="wh-inline-6d319e71fe1f"
                                        ></span></span
                                      ><span class="wh-inline-6d319e71fe1f"
                                      ></span></span
                                    >
                                  </div></td
                                >
                              </tr>
                            </tbody>
                          </table></td
                        >
                      </tr>
                      <tr>
                        <td class="tblFormTd"
                          ><table
                            border="1"
                            cellpadding="0"
                            cellspacing="0"
                            class="wh-inline-ad69cf1449f4"
                          >
                            <tbody
                              ><tr>
                                <td class="wh-inline-659bd98a351c"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >QUARTER</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-804fbba4d96f"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >DATE OF REMITTANCE</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-5254b838b673"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >NAME OF BANK/BANK CODE/ROR NO., IF ANY</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-3eb7d6ae40ca"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TAXES WITHHELD</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-827e7a1ba5cb"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >PENALTIES</span
                                    >
                                  </div></td
                                >
                                <td class="wh-inline-827e7a1ba5cb"
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000"
                                      >TOTAL AMOUNT REMITTED</span
                                    >
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >1ST QTR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched4Date1" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched4Date1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Date1" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched4Date1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched4BankVal1" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched4BankVal1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4BankVal1" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4BankVal1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TaxWheld1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4TaxWheld1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TaxWheld1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TaxWheld1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4Pen1" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4Pen1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Pen1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4Pen1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TotalAmt1" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched4TotalAmt1" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TotalAmt1" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TotalAmt1"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >2ND QTR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched4Date2" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched4Date2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Date2" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched4Date2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched4BankVal2" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched4BankVal2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4BankVal2" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4BankVal2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TaxWheld2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4TaxWheld2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TaxWheld2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TaxWheld2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4Pen2" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4Pen2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Pen2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4Pen2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TotalAmt2" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched4TotalAmt2" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TotalAmt2" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TotalAmt2"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >3RD QTR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched4Date3" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched4Date3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Date3" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched4Date3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched4BankVal3" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched4BankVal3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4BankVal3" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4BankVal3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TaxWheld3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4TaxWheld3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TaxWheld3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TaxWheld3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4Pen3" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4Pen3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Pen3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4Pen3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TotalAmt3" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched4TotalAmt3" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TotalAmt3" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TotalAmt3"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
                                    >4TH QTR</span
                                  ></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-97f71f169000">
                                      <input aria-label="txtSched4Date4" class="iceInpTxt wh-inline-44a37b9dfcd5 wh-source-size-13" data-field-id="frm1604cf:txtSched4Date4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Date4" maxlength="10" readonly size="13" type="text" value={model.text["frm1604cf:txtSched4Date4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-649b1ec8a1ed">
                                      <input aria-label="txtSched4BankVal4" class="iceInpTxt wh-source-size-20" data-field-id="frm1604cf:txtSched4BankVal4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4BankVal4" maxlength="50" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4BankVal4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TaxWheld4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4TaxWheld4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TaxWheld4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TaxWheld4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4Pen4" class="iceInpTxt wh-inline-98db7d6e7b28 wh-source-size-20" data-field-id="frm1604cf:txtSched4Pen4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Pen4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4Pen4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                                <td
                                  ><div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TotalAmt4" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched4TotalAmt4" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TotalAmt4" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TotalAmt4"] ?? ""}>
                                    </span>
                                  </div></td
                                >
                              </tr>
                              <tr>
                                <td
                                  ><span class="wh-inline-429482632af7"
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
                                <td>
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4TaxWheldTotal" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched4TaxWheldTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4TaxWheldTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4TaxWheldTotal"] ?? ""}>
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4PenTotal" class="iceInpTxt-dis wh-inline-814fd7bc6f1a wh-source-size-20" data-field-id="frm1604cf:txtSched4PenTotal" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4PenTotal" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4PenTotal"] ?? ""}>
                                    </span>
                                  </div>
                                </td>
                                <td>
                                  <div class="wh-inline-a30033456d9a">
                                    <span class="wh-inline-232ced7b40ab">
                                      <input aria-label="txtSched4Total" class="iceInpTxt-dis wh-inline-c73f761e34af wh-source-size-20" data-field-id="frm1604cf:txtSched4Total" data-print-control="text" data-print-value="" id="frm1604cf:txtSched4Total" maxlength="25" readonly size="20" type="text" value={model.text["frm1604cf:txtSched4Total"] ?? ""}>
                                    </span>
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
                  <div class="imgClass wh-inline-99a93d625634">
                    <br />
                    <table class="wh-inline-559974f42c24">
                      <colgroup
                        ><col class="wh-inline-be7269108542" />
                        <col class="wh-inline-be7269108542" />
                        <col class="wh-inline-be7269108542" />
                        <col class="wh-inline-be7269108542" />
                        <col class="wh-inline-f99c236f78b6" />
                        <col class="wh-inline-f99c236f78b6" />
                      </colgroup><tbody
                        ><tr>
                          <td colspan="5"
                            >We declare, under the penalties of perjury, that
                            this return has been made in good faith, verified by
                            us, and to the best of our knowledge and belief,
                            <br />is true and correct, pursuant to the
                            provisions of the National Internal Revenue Code, as
                            amended, and the regulations issued under authority
                            thereof.</td
                          >
                          <td class="wh-inline-02c6c5e8e0da"
                            >Stamp of Receiving Office and
                            <br />Date of Receipt<br /></td
                          >
                        </tr>
                        <tr>
                          <td colspan="4"
                            ><b>15</b
                            >______________________________________________________________
                            <br />President/Vice President/Principal
                            Officer/Accredited Tax
                            <br />Agent/Authorized Representative/Taxpayer
                            <br />(Signature over printed Name)</td
                          >
                          <td
                            ><b>16</b>___________________________
                            <br />Treasurer/Asst. Treasurer
                            <br />(Signature over printed Name)
                            <br />
                          </td>
                          <td class="wh-inline-02c6c5e8e0da" rowspan="3"> </td>
                        </tr>
                        <tr>
                          <td colspan="2"
                            >_____________________________________________
                            <br />Title/Position of Signatory</td
                          >
                          <td colspan="2"
                            >_____________________________________________
                            <br />TIN of Signatory
                            <br /></td
                          >
                          <td
                            >___________________________
                            <br />Title/Position of the Signatory</td
                          >
                        </tr>
                        <tr>
                          <td colspan="2"
                            >_____________________________________________
                            <br />Tax Agent Acc. No./ Atty's Roll No. (If
                            Applicable)</td
                          >
                          <td
                            >_________________
                            <br />Date of Issuance</td
                          >
                          <td
                            >_________________
                            <br />Date of Expiry</td
                          >
                          <td
                            >___________________________
                            <br />TIN of Signatory</td
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
        <h2>BIR Form 1604CF — {continuation.title}</h2>
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
