import * as stylex from "@stylexjs/stylex";

export const personDialog = stylex.create({
  searchInput: {
    width: "100%",
  },
  match: {
    backgroundColor: "var(--accent-soft)",
    color: "inherit",
  },
  searchRow: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 3)",
  },
  search: {
    width: "100%",
  },
  listFrame: {
    overflow: "hidden",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
  },
  emptyMessage: {
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 6)",
    textAlign: "center",
    fontSize: "12.5px",
    color: "var(--fg-subtle)",
  },
  results: {
    maxHeight: "calc(var(--spacing) * 96)",
  },
  option: {
    display: "flex",
    width: "100%",
    height: "100%",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: {
      default: "var(--border-soft)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    textAlign: "left",
    transitionProperty: "background-color,border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
      ":focus-visible": "var(--bg-hover)",
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "inset 0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
  avatar: {
    display: "grid",
    width: "calc(var(--spacing) * 8)",
    height: "calc(var(--spacing) * 8)",
    flex: "none",
    placeItems: "center",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent-soft)",
    fontSize: "12px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent)",
  },
  details: {
    minWidth: "0px",
    flex: "1",
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--fg)",
  },
  description: {
    marginTop: "calc(var(--spacing) * 0.5)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "11.5px",
    color: "var(--fg-muted)",
  },
});
