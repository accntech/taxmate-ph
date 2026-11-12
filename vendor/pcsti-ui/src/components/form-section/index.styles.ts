import * as stylex from "@stylexjs/stylex";

export const formSection = stylex.create({
  root: {
    borderRadius: {
      default: "var(--radius-lg)",
      "@media (width >= 40rem)": "var(--radius-xl)",
    },
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-elev)",
    paddingInline: {
      default: "calc(var(--spacing) * 3.5)",
      "@media (width >= 40rem)": "calc(var(--spacing) * 6)",
    },
    paddingBlock: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 40rem)": "calc(var(--spacing) * 5.5)",
    },
  },
  header: {
    marginBottom: "calc(var(--spacing) * 4)",
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2.5)",
  },
  step: {
    display: "grid",
    width: "calc(var(--spacing) * 5)",
    height: "calc(var(--spacing) * 5)",
    flexShrink: "0",
    placeItems: "center",
    borderRadius: "calc(infinity * 1px)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev-2)",
    fontFamily: "var(--font-mono)",
    fontSize: "10.5px",
    "--sx-font-weight": "var(--font-weight-bold)",
    fontWeight: "var(--font-weight-bold)",
    color: "var(--fg)",
  },
  title: {
    fontSize: "11px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "0.08em",
    letterSpacing: "0.08em",
    color: "var(--fg-subtle)",
    textTransform: "uppercase",
  },
});
