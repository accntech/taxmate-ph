<script
  lang="ts"
  generics="Preview extends ImportDialogPreview, Summary extends ImportDialogSummary"
>
  import { Icon as SolarIcon } from "../icon";

  import { glyphs } from "../../icons";

  import { importDialog } from "./index.styles";

  import * as stylex from "@stylexjs/stylex";
  import { Button } from "../button";
  import type {
    ImportDialogCommitResult,
    ImportDialogFileInput,
    ImportDialogPreview,
    ImportDialogSummary,
    ImportDialogTemplateResult,
  } from "./index";
  import { Dialog } from "../dialog";
  import { toast } from "../toaster";
  import { saveBlob, XLSX_MIME } from "./save-as";

  type Props = {
    open: boolean;
    title: string;
    duplicateNote: string;
    formatImportLabel: (count: number) => string;
    downloadImportTemplate: () => Promise<ImportDialogTemplateResult>;
    previewImport: (input: ImportDialogFileInput) => Promise<Preview>;
    commitImport: (
      input: ImportDialogFileInput,
    ) => Promise<ImportDialogCommitResult<Preview, Summary>>;
  };

  let {
    open = $bindable(false),
    title,
    duplicateNote,
    formatImportLabel,
    downloadImportTemplate,
    previewImport,
    commitImport,
  }: Props = $props();

  type Stage = "chooser" | "previewing" | "preview" | "committing" | "success";
  let stage = $state<Stage>("chooser");
  let file = $state<File | null>(null);
  let preview = $state<Preview | null>(null);
  let summary = $state<Summary | null>(null);
  let templateDownloading = $state(false);
  let fileInput = $state<HTMLInputElement | null>(null);
  let dragging = $state(false);
  let operationVersion = 0;

  function reset() {
    operationVersion += 1;
    stage = "chooser";
    file = null;
    preview = null;
    summary = null;
    dragging = false;
    if (fileInput) fileInput.value = "";
  }

  function handleOpenChange(next: boolean) {
    if (!next) reset();
  }

  function closeDialog() {
    handleOpenChange(false);
    open = false;
  }

  async function handleTemplateDownload() {
    if (templateDownloading) return;
    templateDownloading = true;
    try {
      const r = await downloadImportTemplate();
      saveBlob(new Blob([r.buffer], { type: XLSX_MIME }), r.filename);
    } catch {
      toast.danger("Could not download template.");
    } finally {
      templateDownloading = false;
    }
  }

  function isSpreadsheetFile(f: File): boolean {
    const name = f.name.toLowerCase();
    return name.endsWith(".xlsx") || name.endsWith(".xls");
  }

  async function ingestFile(f: File) {
    if (!isSpreadsheetFile(f)) {
      toast.info("Pick an .xlsx or .xls file.");
      if (fileInput) fileInput.value = "";
      return;
    }
    const version = operationVersion;
    file = f;
    stage = "previewing";
    try {
      const buffer = new Uint8Array(await f.arrayBuffer());
      const nextPreview = await previewImport({ buffer, filename: f.name });
      if (!open || version !== operationVersion) return;
      preview = nextPreview;
      stage = "preview";
    } catch {
      if (!open || version !== operationVersion) return;
      toast.danger("Could not read spreadsheet.");
      reset();
    }
  }

  async function handleFileChange(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const nextFile = input.files?.[0];
    if (!nextFile) return;
    await ingestFile(nextFile);
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragging = true;
  }

  function handleDragLeave() {
    dragging = false;
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragging = false;
    const nextFile = e.dataTransfer?.files?.[0];
    if (!nextFile) return;
    await ingestFile(nextFile);
  }

  function openFilePicker() {
    fileInput?.click();
  }

  function applyCommitResult(
    result: ImportDialogCommitResult<Preview, Summary>,
  ) {
    if (result.kind === "committed") {
      summary = result.summary;
      stage = "success";
      return;
    }
    preview = result.preview;
    stage = "preview";
    toast.info(
      "Spreadsheet has new issues since preview. Review and try again.",
    );
  }

  async function runCommit(currentFile: File) {
    const version = operationVersion;
    stage = "committing";
    try {
      const buffer = new Uint8Array(await currentFile.arrayBuffer());
      const result = await commitImport({ buffer, filename: currentFile.name });
      if (!open || version !== operationVersion) return;
      applyCommitResult(result);
    } catch {
      if (!open || version !== operationVersion) return;
      toast.danger("Could not import. Try again.");
      stage = "preview";
    }
  }

  async function handleCommit() {
    const currentFile = file;
    if (!currentFile) return;
    if (!preview?.canImport) return;
    await runCommit(currentFile);
  }

  function handleLogDownload() {
    if (!summary) return;
    saveBlob(new Blob([summary.log], { type: "text/plain" }), summary.filename);
  }

  function handlePickAnother() {
    preview = null;
    file = null;
    if (fileInput) fileInput.value = "";
    stage = "chooser";
  }
</script>

<Dialog bind:open size="lg" {title} onOpenChange={handleOpenChange}>
  <input
    bind:this={fileInput}
    type="file"
    accept=".xlsx,.xls"
    class={[stylex.attrs(importDialog.fileInput).class]}
    onchange={handleFileChange}
    aria-hidden="true"
    tabindex="-1"
  />

  {#if stage === "chooser"}
    <div class={[stylex.attrs(importDialog.stage).class]}>
      <Button
        type="button"
        size="normal"
        variant="outlined"
        onclick={openFilePicker}
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        sx={[importDialog.dropzone, dragging ? importDialog.dragging : null]}
        aria-label="Choose .xlsx or .xls file"
      >
        <span
          data-icon
          class={[stylex.attrs([importDialog.uploadIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.uploadSquare} /></span
        >
        <span class={[stylex.attrs(importDialog.title).class]}>
          {dragging ? "Drop to import" : "Choose .xlsx or .xls file"}
        </span>
        <span class={[stylex.attrs(importDialog.hint).class]}
          >or drag and drop here</span
        >
      </Button>

      <div class={[stylex.attrs(importDialog.templateRow).class]}>
        <Button
          type="button"
          size="compact"
          variant="ghost"
          onclick={handleTemplateDownload}
          disabled={templateDownloading}
          sx={importDialog.templateButton}
        >
          {#if templateDownloading}
            <span
              class={[stylex.attrs(importDialog.templateSpinner).class]}
              aria-hidden="true"
            ></span>
            <span>Downloading template...</span>
          {:else}
            <span
              data-icon
              class={[stylex.attrs([importDialog.actionIcon]).class]}
              aria-hidden="true"><SolarIcon icon={glyphs.download} /></span
            >
            <span>Download blank template</span>
          {/if}
        </Button>
        <span class={[stylex.attrs(importDialog.duplicateNote).class]}
          >{duplicateNote}</span
        >
      </div>
    </div>
  {:else if stage === "previewing"}
    <div class={[stylex.attrs(importDialog.pending).class]}>
      <span
        class={[stylex.attrs(importDialog.spinner).class]}
        aria-hidden="true"
      ></span>
      <span>Reading {file?.name}...</span>
    </div>
  {:else if stage === "preview" && preview}
    <div class={[stylex.attrs(importDialog.stage).class]}>
      <div class={[stylex.attrs(importDialog.fileSummary).class]}>
        <span
          data-icon
          class={[stylex.attrs([importDialog.fileIcon]).class]}
          aria-hidden="true"><SolarIcon icon={glyphs.document} /></span
        >
        <span class={[stylex.attrs(importDialog.filename).class]}
          >{file?.name}</span
        >
        <span class={[stylex.attrs(importDialog.rowCount).class]}>
          {preview.totalRows} row{preview.totalRows === 1 ? "" : "s"}
        </span>
      </div>

      {#if preview.errors.length > 0}
        <div class={[stylex.attrs(importDialog.errors).class]}>
          <div class={[stylex.attrs(importDialog.errorCount).class]}>
            {preview.errors.length} error{preview.errors.length === 1
              ? ""
              : "s"}
          </div>
          <ul
            class={[stylex.attrs(importDialog.errorList).class, "error-list"]}
          >
            {#each preview.errors as e (e.rowNumber + ":" + e.field + ":" + e.message)}
              <li class={[stylex.attrs(importDialog.errorRow).class]}>
                <span class={[stylex.attrs(importDialog.errorRowNumber).class]}>
                  Row {e.rowNumber}
                </span>
                <span class={[stylex.attrs(importDialog.errorField).class]}>
                  {e.field}
                </span>
                <span class={[stylex.attrs(importDialog.errorMessage).class]}
                  >{e.message}</span
                >
              </li>
            {/each}
          </ul>
        </div>
      {:else if preview.willCreate === 0}
        <div class={[stylex.attrs(importDialog.duplicateNotice).class]}>
          Nothing new to import - all {preview.willSkipDuplicate} row{preview.willSkipDuplicate ===
          1
            ? ""
            : "s"} already exist.
        </div>
      {:else}
        <div class={[stylex.attrs(importDialog.stats).class]}>
          <div class={[stylex.attrs(importDialog.stat).class]}>
            <div class={[stylex.attrs(importDialog.statLabel).class]}>
              Will create
            </div>
            <div class={[stylex.attrs(importDialog.createdCount).class]}>
              {preview.willCreate}
            </div>
          </div>
          <div class={[stylex.attrs(importDialog.stat).class]}>
            <div class={[stylex.attrs(importDialog.statLabel).class]}>
              Skip duplicate
            </div>
            <div class={[stylex.attrs(importDialog.duplicateCount).class]}>
              {preview.willSkipDuplicate}
            </div>
          </div>
        </div>
      {/if}

      <div class={[stylex.attrs(importDialog.previewActions).class]}>
        <Button
          type="button"
          size="normal"
          variant="outlined"
          onclick={handlePickAnother}
        >
          Pick another
        </Button>
        <Button
          type="button"
          size="normal"
          variant="accent-soft"
          onclick={handleCommit}
          disabled={!preview.canImport}
        >
          <span
            data-icon
            class={[stylex.attrs([importDialog.actionIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.upload} /></span
          >
          <span>{formatImportLabel(preview.willCreate)}</span>
        </Button>
      </div>
    </div>
  {:else if stage === "committing"}
    <div class={[stylex.attrs(importDialog.pending).class]}>
      <span
        class={[stylex.attrs(importDialog.spinner).class]}
        aria-hidden="true"
      ></span>
      <span>Importing...</span>
    </div>
  {:else if stage === "success" && summary}
    <div class={[stylex.attrs(importDialog.success).class]}>
      <div class={[stylex.attrs(importDialog.successSummary).class]}>
        <span
          class={[stylex.attrs(importDialog.successBadge).class]}
          aria-hidden="true"
        >
          <span
            data-icon
            class={[stylex.attrs([importDialog.successIcon]).class]}
            ><SolarIcon icon={glyphs.doubleCheck} /></span
          >
        </span>
        <div class={[stylex.attrs(importDialog.successCopy).class]}>
          <div class={[stylex.attrs(importDialog.title).class]}>
            Import complete
          </div>
          <div class={[stylex.attrs(importDialog.successFilename).class]}>
            {summary.filename}
          </div>
        </div>
      </div>

      <div class={[stylex.attrs(importDialog.stats).class]}>
        <div class={[stylex.attrs(importDialog.stat).class]}>
          <div class={[stylex.attrs(importDialog.statLabel).class]}>
            Created
          </div>
          <div class={[stylex.attrs(importDialog.createdCount).class]}>
            {summary.created}
          </div>
        </div>
        <div class={[stylex.attrs(importDialog.stat).class]}>
          <div class={[stylex.attrs(importDialog.statLabel).class]}>
            Skipped
          </div>
          <div class={[stylex.attrs(importDialog.duplicateCount).class]}>
            {summary.skippedDuplicates}
          </div>
        </div>
      </div>

      <div class={[stylex.attrs(importDialog.successActions).class]}>
        <Button
          type="button"
          size="normal"
          variant="outlined"
          onclick={handleLogDownload}
        >
          <span
            data-icon
            class={[stylex.attrs([importDialog.actionIcon]).class]}
            aria-hidden="true"><SolarIcon icon={glyphs.document} /></span
          >
          <span>Download log</span>
        </Button>
        <Button
          type="button"
          size="normal"
          variant="accent-soft"
          onclick={closeDialog}
        >
          Done
        </Button>
      </div>
    </div>
  {/if}
</Dialog>

<style>
  @layer overrides {
    :where(.error-list > :global(:not(:last-child))) {
      --sx-divide-y-reverse: 0;
      border-bottom-style: var(--sx-border-style);
      border-top-style: var(--sx-border-style);
      border-top-width: calc(1px * var(--sx-divide-y-reverse));
      border-bottom-width: calc(1px * calc(1 - var(--sx-divide-y-reverse)));
      border-color: color-mix(in oklch, var(--danger) 18%, var(--border-soft));
    }
  }
</style>
