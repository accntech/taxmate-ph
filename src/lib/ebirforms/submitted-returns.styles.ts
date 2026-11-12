import * as stylex from '@stylexjs/stylex';

export const submittedReturns = stylex.create({
  root: {
    display: "grid",
    minWidth: 0,
    gap: "1rem"
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "0.75rem"
  },
  heading: {
    fontSize: "1rem",
    lineHeight: 1.5,
    fontWeight: 600,
    color: "var(--fg)"
  },
  description: {
    marginTop: "0.25rem",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  search: {
    display: "flex",
    alignItems: "flex-end",
    gap: "0.5rem"
  },
  error: {
    borderRadius: "0.375rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "color-mix(in oklab, var(--danger) 30%, transparent)",
    backgroundColor: "var(--danger-soft)",
    padding: "1rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--fg)"
  },
  retry: {
    marginTop: "0.5rem"
  },
  loading: {
    padding: "1.5rem",
    textAlign: "center",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--fg-muted)"
  },
  empty: {
    borderRadius: "0.375rem",
    borderWidth: "1px",
    borderStyle: "dashed",
    borderColor: "var(--border)",
    paddingInline: "1rem",
    paddingBlock: "2.5rem",
    textAlign: "center"
  },
  emptyHeading: {
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    fontWeight: 500,
    color: "var(--fg)"
  },
  tableFrame: {
    minWidth: 0,
    overflow: "hidden",
    borderRadius: "0.375rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--border)"
  },
  table: {
    width: "100%",
    textAlign: "left",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)"
  },
  caption: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: 0
  },
  tableHeading: {
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev-2)",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  amountHeading: {
    textAlign: "right"
  },
  row: {
    borderBottomWidth: {
      default: "1px",
      ":last-child": 0
    },
    borderBottomStyle: "solid",
    borderColor: "var(--border-soft)",
    backgroundColor: {
      default: null,
      ":hover": "var(--bg-hover)"
    }
  },
  date: {
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  taxpayer: {
    display: "block",
    fontWeight: 500,
    color: "var(--fg)"
  },
  tin: {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-muted)"
  },
  formCode: {
    fontWeight: 500,
    color: "var(--fg)"
  },
  period: {
    marginLeft: "0.5rem",
    color: "var(--fg-muted)"
  },
  returnType: {
    color: "var(--fg-muted)"
  },
  amount: {
    textAlign: "right",
    fontWeight: 500,
    fontVariantNumeric: "tabular-nums",
    color: "var(--fg)"
  },
  disclaimer: {
    fontSize: "0.75rem",
    lineHeight: "calc(1 / 0.75)",
    color: "var(--fg-subtle)"
  }
});
