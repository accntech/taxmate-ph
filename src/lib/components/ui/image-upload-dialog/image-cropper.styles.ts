import * as stylex from "@stylexjs/stylex";

export const imageCropper = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "calc(var(--spacing) * 3)",
  },
  preview: {
    maxHeight: "calc(var(--spacing) * 80)",
    overflow: "hidden",
    borderRadius: "var(--radius-xl)",
    backgroundColor: "color-mix(in oklab, var(--bg-elev) 50%, transparent)",
    "--sx-ring-shadow":
      "var(--sx-ring-inset,) 0 0 0 calc(1px + var(--sx-ring-offset-width)) var(--sx-ring-color, currentcolor)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-ring-color":
      "color-mix(in oklab, var(--border-soft) 10%, transparent)",
  },
  image: {
    display: "block",
    maxWidth: "100%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing)",
  },
  ratio: {
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 2.5)",
    paddingBlock: "var(--spacing)",
    fontSize: "var(--text-xs)",
    lineHeight: "var(--sx-leading, var(--text-xs--line-height))",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    transitionProperty:
      "transform,background-color,color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
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
    scale: {
      default: null,
      ":active": "0.95",
    },
  },
  selectedRatio: {
    backgroundColor: "var(--accent-soft)",
    color: "var(--accent)",
    "--sx-ring-shadow":
      "var(--sx-ring-inset,) 0 0 0 calc(1px + var(--sx-ring-offset-width)) var(--sx-ring-color, currentcolor)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    "--sx-ring-color": "color-mix(in oklab, var(--accent) 25%, transparent)",
    "--sx-ring-inset": "inset",
  },
  unselectedRatio: {
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "color-mix(in oklab, var(--bg-elev) 60%, transparent)",
      },
    },
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-medium)",
    fontWeight: "var(--font-weight-medium)",
    color: {
      default: "var(--fg-muted)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty:
      "transform,background-color,color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
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
    scale: {
      default: null,
      ":active": "0.97",
    },
  },
  backIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  uploadButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    backgroundColor: {
      default: "var(--accent)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--accent-hover)",
      },
    },
    paddingInline: "calc(var(--spacing) * 5)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    color: "var(--accent-fg)",
    "--sx-shadow": {
      default: "var(--shadow-sm)",
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 35%,transparent))",
    },
    boxShadow: {
      default:
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
    transitionProperty: "transform,background-color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "160ms",
    "--sx-duration": "160ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    scale: {
      default: null,
      ":active": "0.97",
    },
  },
  uploadIcon: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
});
