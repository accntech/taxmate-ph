export { default as BulkActions } from "./index.svelte";

export type BulkActionsRow = {
  id: string;
  inactive: boolean;
};

export type BulkActionsChange<Row extends BulkActionsRow> = {
  ids: string[];
  selectedRows: Row[];
  nextInactive: boolean;
};
