export { default as ImportDialog } from "./import-dialog.svelte";
export { saveAs, saveBlob, XLSX_MIME } from "./save-as";

export type ImportDialogFileInput = {
  buffer: Uint8Array;
  filename: string;
};

export type ImportDialogTemplateResult = {
  buffer: BlobPart;
  filename: string;
};

export type ImportDialogPreview = {
  totalRows: number;
  errors: { rowNumber: number; field: string; message: string }[];
  willCreate: number;
  willSkipDuplicate: number;
  canImport: boolean;
};

export type ImportDialogSummary = {
  filename: string;
  log: BlobPart;
  created: number;
  skippedDuplicates: number;
};

export type ImportDialogCommitResult<
  Preview extends ImportDialogPreview = ImportDialogPreview,
  Summary extends ImportDialogSummary = ImportDialogSummary,
> =
  | { kind: "committed"; summary: Summary }
  | { kind: "invalid"; preview: Preview };
