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
      source: "frm0619F:optAmend",
      choice: "Y",
    },
    {
      id: "optAmend:N",
      source: "frm0619F:optAmend",
      choice: "N",
    },
    {
      id: "optWithheld:Y",
      source: "frm0619F:optWithheld",
      choice: "Y",
    },
    {
      id: "optWithheld:N",
      source: "frm0619F:optWithheld",
      choice: "N",
    },
    {
      id: "txtTaxTypeCode",
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
      source: "frm0619F:optCategory",
      choice: "P",
    },
    {
      id: "optCategory:G",
      source: "frm0619F:optCategory",
      choice: "G",
    },
    {
      id: "txtEmail2",
    },
    {
      id: "txtTax13",
      source: "txtTax13",
      moneyPart: 0,
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
      id: "txtTax17",
      source: "txtTax17",
      moneyPart: 0,
    },
    {
      id: "txtTax18A",
      source: "txtTax18A",
      moneyPart: 0,
    },
    {
      id: "txtTax18B",
      source: "txtTax18B",
      moneyPart: 0,
    },
    {
      id: "txtTax18C",
      source: "txtTax18C",
      moneyPart: 0,
    },
    {
      id: "txtTax18D",
      source: "txtTax18D",
      moneyPart: 0,
    },
    {
      id: "txtTax19",
      source: "txtTax19",
      moneyPart: 0,
    },
    {
      id: "txtTax13_2",
      source: "txtTax13",
      moneyPart: 1,
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
      id: "txtTax17_2",
      source: "txtTax17",
      moneyPart: 1,
    },
    {
      id: "txtTax18A_2",
      source: "txtTax18A",
      moneyPart: 1,
    },
    {
      id: "txtTax18B_2",
      source: "txtTax18B",
      moneyPart: 1,
    },
    {
      id: "txtTax18C_2",
      source: "txtTax18C",
      moneyPart: 1,
    },
    {
      id: "txtTax18D_2",
      source: "txtTax18D",
      moneyPart: 1,
    },
    {
      id: "txtTax19_2",
      source: "txtTax19",
      moneyPart: 1,
    },
  ];
</script>

<script lang="ts">
  import PrintLayout from "./form-0619-layout.svelte";
  import { createWithholdingPrintModel } from "$lib/printing/withholding-print-model";
  let { values }: { values: Record<string, string> } = $props();
  const model = $derived(
    createWithholdingPrintModel("0619F", values, printBindings),
  );
</script>

<article
  class="withholding-print"
  data-form-code="0619F"
  aria-label="BIR Form 0619F print preview"
>
  <div
    class="withholding-print-page-content wh-page-0619f-1"
    data-source-page="1"
  >
    <div class="original-withholding-form wh-inline-a466d2cb556e" id="wrapper">
      <PrintLayout variant="F" />
      <div class="wh-inline-9758e05ec3bc">
        <div class="wh-inline-e40b3abe89f6">
          <span class="smallBold" data-field-id="txtMonth" id="txtMonth"
            >{model.text["txtMonth"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-8bfdf6f684b9">
          <span class="smallBold" data-field-id="txtYear" id="txtYear"
            >{model.text["txtYear"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-9013ea3dcfde">
          <span class="smallBold" data-field-id="txtDueMonth" id="txtDueMonth"
            >{model.text["txtDueMonth"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-6fcecfdd23a4">
          <span class="smallBold" data-field-id="txtDueDay" id="txtDueDay"
            >{model.text["txtDueDay"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-ec88e0617ca3">
          <span class="smallBold" data-field-id="txtDueYear" id="txtDueYear"
            >{model.text["txtDueYear"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-f8f083018c55">
          <span class="smallBold" data-field-id="optAmend:Y" id="optAmend:Y"
            >{model.checks["optAmend:Y"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-dcde5b64f4af">
          <span class="smallBold" data-field-id="optAmend:N" id="optAmend:N"
            >{model.checks["optAmend:N"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-854e42be9371">
          <span
            class="smallBold"
            data-field-id="optWithheld:Y"
            id="optWithheld:Y">{model.checks["optWithheld:Y"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-723b246308cb">
          <span
            class="smallBold"
            data-field-id="optWithheld:N"
            id="optWithheld:N">{model.checks["optWithheld:N"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-5bb1b7bb3c10">
          <span
            class="smallBold"
            data-field-id="txtTaxTypeCode"
            id="txtTaxTypeCode">{model.text["txtTaxTypeCode"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-067070801677">
          <span class="smallBold" data-field-id="txtTIN1" id="txtTIN1"
            >{model.text["txtTIN1"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-8fc1f531ab9c">
          <span class="smallBold" data-field-id="txtTIN2" id="txtTIN2"
            >{model.text["txtTIN2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-dd3ae9300bc7">
          <span class="smallBold" data-field-id="txtTIN3" id="txtTIN3"
            >{model.text["txtTIN3"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-8bfe1d0656ff">
          <span
            class="smallBold"
            data-field-id="txtBranchCode"
            id="txtBranchCode">{model.text["txtBranchCode"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-652b9ad3f4df">
          <span class="smallBold" data-field-id="txtRDOCode" id="txtRDOCode"
            >{model.text["txtRDOCode"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-7007d1ac0548">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtTaxpayerName"
            id="txtTaxpayerName">{model.text["txtTaxpayerName"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-19331bd54964">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtAddress"
            id="txtAddress">{model.text["txtAddress"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-85d414d4acec">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtAddress2"
            id="txtAddress2">{model.text["txtAddress2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-3020a58500c8">
          <span
            class="smallBold wh-inline-ada255f174e2"
            data-field-id="txtZipCode"
            id="txtZipCode">{model.text["txtZipCode"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-07e8d28e7554">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtTelNum"
            id="txtTelNum">{model.text["txtTelNum"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-790036679012">
          <span
            class="smallBold"
            data-field-id="optCategory:P"
            id="optCategory:P">{model.checks["optCategory:P"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-458a17816e6e">
          <span
            class="smallBold"
            data-field-id="optCategory:G"
            id="optCategory:G">{model.checks["optCategory:G"] ? "X" : ""}</span
          >
        </div>
        <div class="wh-inline-54b600f4ee6d">
          <span
            class="smallBold wh-inline-c55158740ab1"
            data-field-id="txtEmail2"
            id="txtEmail2">{model.text["txtEmail2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-7b8bf5431843">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax13"
            id="txtTax13">{model.text["txtTax13"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-face96d540b5">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax14"
            id="txtTax14">{model.text["txtTax14"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-5fa642eccadb">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax15"
            id="txtTax15">{model.text["txtTax15"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-f070e9277c30">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax16"
            id="txtTax16">{model.text["txtTax16"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-b27a4aceb717">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17"
            id="txtTax17">{model.text["txtTax17"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-b7f1cb5046e0">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18A"
            id="txtTax18A">{model.text["txtTax18A"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-0a8bd95fd283">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18B"
            id="txtTax18B">{model.text["txtTax18B"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-fc60edb7cc09">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18C"
            id="txtTax18C">{model.text["txtTax18C"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-e9f73ae702ed">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18D"
            id="txtTax18D">{model.text["txtTax18D"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-7aa7ebe68cc4">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax19"
            id="txtTax19">{model.text["txtTax19"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-ad3f308b8943">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax13_2"
            id="txtTax13_2">{model.text["txtTax13_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-9f1f5c306ad6">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax14_2"
            id="txtTax14_2">{model.text["txtTax14_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-d98b0f8af6c9">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax15_2"
            id="txtTax15_2">{model.text["txtTax15_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-a5ea4a6aba43">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax16_2"
            id="txtTax16_2">{model.text["txtTax16_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-6d25cc337dc1">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax17_2"
            id="txtTax17_2">{model.text["txtTax17_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-68cbdfb95cbb">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18A_2"
            id="txtTax18A_2">{model.text["txtTax18A_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-461578a0b01e">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18B_2"
            id="txtTax18B_2">{model.text["txtTax18B_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-7795c5aa733b">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18C_2"
            id="txtTax18C_2">{model.text["txtTax18C_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-f45c7a8454ba">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax18D_2"
            id="txtTax18D_2">{model.text["txtTax18D_2"] ?? ""}</span
          >
        </div>
        <div class="wh-inline-d5c6c4166d88">
          <span
            class="smallBold wh-inline-dfe44f81819e"
            data-field-id="txtTax19_2"
            id="txtTax19_2">{model.text["txtTax19_2"] ?? ""}</span
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
        <h2>BIR Form 0619F — {continuation.title}</h2>
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
