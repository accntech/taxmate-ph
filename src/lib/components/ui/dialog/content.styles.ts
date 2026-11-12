import * as stylex from "@stylexjs/stylex";

export const dialogContent = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    maxHeight: {
      default: "90dvh",
      "@media (width >= 40rem)": "calc(100dvh - 2rem)",
    },
    flexDirection: "column",
    borderTopLeftRadius: "var(--radius-xl)",
    borderTopRightRadius: "var(--radius-xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    padding: "calc(var(--spacing) * 5)",
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    borderRadius: {
      default: null,
      "@media (width >= 40rem)": "var(--radius-xl)",
    },
  },
  scrollable: {
    overflow: "hidden",
  },
  overflowVisible: {
    overflow: "visible",
  },
  overflowClipped: {
    overflow: "auto",
  },
  closeButton: {
    display: {
      default: "none",
      "@media (width >= 40rem)": "inline-flex",
    },
    width: "calc(var(--spacing) * 6)",
    height: "calc(var(--spacing) * 6)",
  },
  heading: {
    position: "relative",
    flex: "none",
  },
  accentEdge: {
    marginInline: "auto",
    marginBottom: "calc(var(--spacing) * 3)",
    height: "var(--spacing)",
    width: "calc(var(--spacing) * 9)",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "color-mix(in oklab, var(--fg-subtle) 40%, transparent)",
    display: {
      default: null,
      "@media (width >= 40rem)": "none",
    },
  },
});
