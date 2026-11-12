import * as stylex from "@stylexjs/stylex";

export const selectedPerson = stylex.create({
  trigger: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (width >= 40rem)": "row",
    },
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border-soft)",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    backgroundColor: {
      default: "var(--bg-input)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    padding: "calc(var(--spacing) * 3.5)",
    textAlign: "left",
    transitionProperty: "background-color,border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    alignItems: {
      default: null,
      "@media (width >= 40rem)": "center",
    },
  },
  compactTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2.5)",
    padding: "calc(var(--spacing) * 2.5)",
  },
  avatar: {
    display: "grid",
    width: "calc(var(--spacing) * 11)",
    height: "calc(var(--spacing) * 11)",
    flex: "none",
    placeItems: "center",
    borderRadius: "calc(infinity * 1px)",
    backgroundColor: "var(--accent-soft)",
    fontSize: "14px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent)",
  },
  compactAvatar: {
    width: "calc(var(--spacing) * 9)",
    height: "calc(var(--spacing) * 9)",
    fontSize: "12px",
  },
  details: {
    minWidth: "0px",
    flex: "1",
  },
  name: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "14px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--fg)",
  },
  compactName: {
    fontSize: "13px",
  },
  description: {
    marginTop: "calc(var(--spacing) * 0.5)",
    fontSize: "12px",
    color: "var(--fg-muted)",
  },
  compactDescription: {
    fontSize: "11px",
  },
  root: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (width >= 40rem)": "row",
    },
    gap: "calc(var(--spacing) * 3)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg-input)",
    padding: "calc(var(--spacing) * 3.5)",
    alignItems: {
      default: null,
      "@media (width >= 40rem)": "center",
    },
  },
  compactRoot: {
    flexDirection: "row",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2.5)",
    padding: "calc(var(--spacing) * 2.5)",
  },
  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "calc(var(--spacing) * 2)",
  },
});
