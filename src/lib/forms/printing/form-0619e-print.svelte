<script module lang="ts">
  import type { PrintBinding } from "$lib/printing/withholding-print-model";
  export const printBindings: readonly PrintBinding[] = [
    {
      id: "txtMonth",
    },
    {
      id: "txtYear",
    },
    {
      id: "txtDueMonth",
    },
    {
      id: "txtDueDay",
    },
    {
      id: "txtDueYear",
    },
    {
      id: "optAmend:Y",
      source: "frm0619E:optAmend",
      choice: "Y",
    },
    {
      id: "optAmend:N",
      source: "frm0619E:optAmend",
      choice: "N",
    },
    {
      id: "optWithheld:Y",
      source: "frm0619E:optWithheld",
      choice: "Y",
    },
    {
      id: "optWithheld:N",
      source: "frm0619E:optWithheld",
      choice: "N",
    },
    {
      id: "txtTIN1",
    },
    {
      id: "txtTIN2",
    },
    {
      id: "txtTIN3",
    },
    {
      id: "txtBranchCode",
    },
    {
      id: "txtRDOCode",
    },
    {
      id: "txtTaxpayerName",
    },
    {
      id: "txtAddress",
    },
    {
      id: "txtAddress2",
    },
    {
      id: "txtZipCode",
    },
    {
      id: "txtTelNum",
    },
    {
      id: "optCategory:P",
      source: "frm0619E:optCategory",
      choice: "P",
    },
    {
      id: "optCategory:G",
      source: "frm0619E:optCategory",
      choice: "G",
    },
    {
      id: "txtEmail2",
    },
    {
      id: "txtTax14",
      source: "txtTax14",
      moneyPart: 0,
    },
    {
      id: "txtTax15",
      source: "txtTax15",
      moneyPart: 0,
    },
    {
      id: "txtTax16",
      source: "txtTax16",
      moneyPart: 0,
    },
    {
      id: "txtTax17A",
      source: "txtTax17A",
      moneyPart: 0,
    },
    {
      id: "txtTax17B",
      source: "txtTax17B",
      moneyPart: 0,
    },
    {
      id: "txtTax17C",
      source: "txtTax17C",
      moneyPart: 0,
    },
    {
      id: "txtTax17D",
      source: "txtTax17D",
      moneyPart: 0,
    },
    {
      id: "txtTax18",
      source: "txtTax18",
      moneyPart: 0,
    },
    {
      id: "txtTax14_2",
      source: "txtTax14",
      moneyPart: 1,
    },
    {
      id: "txtTax15_2",
      source: "txtTax15",
      moneyPart: 1,
    },
    {
      id: "txtTax16_2",
      source: "txtTax16",
      moneyPart: 1,
    },
    {
      id: "txtTax17A_2",
      source: "txtTax17A",
      moneyPart: 1,
    },
    {
      id: "txtTax17B_2",
      source: "txtTax17B",
      moneyPart: 1,
    },
    {
      id: "txtTax17C_2",
      source: "txtTax17C",
      moneyPart: 1,
    },
    {
      id: "txtTax17D_2",
      source: "txtTax17D",
      moneyPart: 1,
    },
    {
      id: "txtTax18_2",
      source: "txtTax18",
      moneyPart: 1,
    },
  ];
</script>

<script lang="ts">
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("0619E", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="0619E"
  aria-label="BIR Form 0619E print preview"
>
  <div
    class="withholding-print-page-content wh-page-0619e-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-a466d2cb556e" id="wrapper">
      <img
        alt="BIR form identifying mark"
        class="wh-inline-e8a41a47c07d"
        src="/legacy/img/withholding/original-0892cf9ac6a65a9c.png"
      />
      <div class="wh-inline-9758e05ec3bc">
        <div class="wh-inline-0363fb7b37ef">
          <span class="smallBold" data-field-id="txtMonth" id="txtMonth"
            >{model.text["txtMonth"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-86aabc747a09">
          <span class="smallBold" data-field-id="txtYear" id="txtYear"
            >{model.text["txtYear"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-92c08ed665b1">
          <span class="smallBold" data-field-id="txtDueMonth" id="txtDueMonth"
            >{model.text["txtDueMonth"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-6f8fec512627">
          <span class="smallBold" data-field-id="txtDueDay" id="txtDueDay"
            >{model.text["txtDueDay"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-abb6a733ca9a">
          <span class="smallBold" data-field-id="txtDueYear" id="txtDueYear"
            >{model.text["txtDueYear"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-b7937826ffc2">
          <span class="smallBold" data-field-id="optAmend:Y" id="optAmend:Y"
            >{model.checks["optAmend:Y"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-b03cd3412b0a">
          <span class="smallBold" data-field-id="optAmend:N" id="optAmend:N"
            >{model.checks["optAmend:N"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-75a2764ed414">
          <span
            class="smallBold"
            data-field-id="optWithheld:Y"
            id="optWithheld:Y">{model.checks["optWithheld:Y"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-16dc406391cd">
          <span
            class="smallBold"
            data-field-id="optWithheld:N"
            id="optWithheld:N">{model.checks["optWithheld:N"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-734fa79076e6">
          <span class="smallBold" data-field-id="txtTIN1" id="txtTIN1"
            >{model.text["txtTIN1"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-423a56619657">
          <span class="smallBold" data-field-id="txtTIN2" id="txtTIN2"
            >{model.text["txtTIN2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-ba043954421e">
          <span class="smallBold" data-field-id="txtTIN3" id="txtTIN3"
            >{model.text["txtTIN3"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-9cd6f79ba3b2">
          <span
            class="smallBold"
            data-field-id="txtBranchCode"
            id="txtBranchCode">{model.text["txtBranchCode"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-efcc2e49b578">
          <span class="smallBold" data-field-id="txtRDOCode" id="txtRDOCode"
            >{model.text["txtRDOCode"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-279c1fce34a0">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtTaxpayerName"
            id="txtTaxpayerName">{model.text["txtTaxpayerName"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-74ee40aca143">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtAddress"
            id="txtAddress">{model.text["txtAddress"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-1418eebac2ab">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtAddress2"
            id="txtAddress2">{model.text["txtAddress2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-a3d8534f6147">
          <span
            class="smallBold wh-inline-ada255f174e2"
            data-field-id="txtZipCode"
            id="txtZipCode">{model.text["txtZipCode"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-19477ee53784">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtTelNum"
            id="txtTelNum">{model.text["txtTelNum"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-ed9ba5922c51">
          <span
            class="smallBold"
            data-field-id="optCategory:P"
            id="optCategory:P">{model.checks["optCategory:P"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-68e2f359873a">
          <span
            class="smallBold"
            data-field-id="optCategory:G"
            id="optCategory:G">{model.checks["optCategory:G"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-2f87e15ed1db">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtEmail2"
            id="txtEmail2">{model.text["txtEmail2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-b9bdcb59a87d">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax14"
            id="txtTax14">{model.text["txtTax14"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-ae2c9bfaa87e">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax15"
            id="txtTax15">{model.text["txtTax15"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-91239aeba7a0">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax16"
            id="txtTax16">{model.text["txtTax16"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-2abcf754479a">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17A"
            id="txtTax17A">{model.text["txtTax17A"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-04181f810532">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17B"
            id="txtTax17B">{model.text["txtTax17B"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-564e9b63d138">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17C"
            id="txtTax17C">{model.text["txtTax17C"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-d598bca49a32">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17D"
            id="txtTax17D">{model.text["txtTax17D"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-effc02042e8c">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18"
            id="txtTax18">{model.text["txtTax18"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-0cc4cdde7652">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax14_2"
            id="txtTax14_2">{model.text["txtTax14_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-25ec9a667602">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax15_2"
            id="txtTax15_2">{model.text["txtTax15_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-89037914616e">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax16_2"
            id="txtTax16_2">{model.text["txtTax16_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-950b0c8950a3">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17A_2"
            id="txtTax17A_2">{model.text["txtTax17A_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-65ffb8e06b2c">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17B_2"
            id="txtTax17B_2">{model.text["txtTax17B_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-e8bd2cb2fd72">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17C_2"
            id="txtTax17C_2">{model.text["txtTax17C_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-a236c6e5f1d1">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17D_2"
            id="txtTax17D_2">{model.text["txtTax17D_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-2621a3f4d6ac">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18_2"
            id="txtTax18_2">{model.text["txtTax18_2"] ?? ""}</span
          >
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
        <h2>BIR Form 0619E — {continuation.title}</h2>
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
