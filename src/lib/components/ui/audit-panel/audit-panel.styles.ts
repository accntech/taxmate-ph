import * as stylex from "@stylexjs/stylex";

export const auditPanel = stylex.create({
  loadingPanel: {
    borderRadius: "var(--radius-xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev)",
    padding: "calc(var(--spacing) * 4)",
  },
  loadingHeader: {
    marginBottom: "calc(var(--spacing) * 4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  loadingTitle: {
    width: "calc(var(--spacing) * 16)",
  },
  loadingRows: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 3)",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2.5)",
  },
  loadingLabel: {
    width: "calc(1 / 3 * 100%)",
  },
  loadingValue: {
    width: "calc(1 / 2 * 100%)",
  },
  errorPanel: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius-xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--danger-soft)",
    backgroundColor: "color-mix(in oklab, var(--danger-soft) 30%, transparent)",
    padding: "calc(var(--spacing) * 4)",
    fontSize: "var(--text-sm)",
    lineHeight: "var(--sx-leading, var(--text-sm--line-height))",
    color: "var(--danger)",
  },
  errorSummary: {
    display: "flex",
    alignItems: "flex-start",
    gap: "calc(var(--spacing) * 2)",
  },
  errorIcon: {
    marginTop: "calc(var(--spacing) * 0.5)",
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
    flex: "none",
  },
  errorCopy: {
    flex: "1",
  },
  errorTitle: {
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
  },
  errorMessage: {
    marginTop: "var(--spacing)",
    fontSize: "12px",
    color: "var(--fg-muted)",
  },
  retryButton: {
    fontSize: "11.5px",
  },
  retryIcon: {
    width: "calc(var(--spacing) * 3.25)",
    height: "calc(var(--spacing) * 3.25)",
  },
});
