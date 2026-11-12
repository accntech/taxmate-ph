import * as stylex from "@stylexjs/stylex";

export const topbar = stylex.create({
  root: {
    position: "sticky",
    top: "0px",
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 3.5)",
    borderBottomStyle: "solid",
    borderBottomWidth: "1px",
    borderColor: "var(--border-soft)",
    backgroundColor: "var(--bg)",
    paddingInline: {
      default: "calc(var(--spacing) * 4)",
      "@media (width >= 64rem)": "calc(var(--spacing) * 7)",
    },
    paddingBlock: "calc(var(--spacing) * 3)",
    "--sx-backdrop-blur": "blur(8px)",

    backdropFilter:
      "var(--sx-backdrop-blur,) var(--sx-backdrop-brightness,) var(--sx-backdrop-contrast,) var(--sx-backdrop-grayscale,) var(--sx-backdrop-hue-rotate,) var(--sx-backdrop-invert,) var(--sx-backdrop-opacity,) var(--sx-backdrop-saturate,) var(--sx-backdrop-sepia,)",
  },
  menuIcon: {
    width: "calc(var(--spacing) * 5)",
    height: "calc(var(--spacing) * 5)",
  },
  breadcrumbs: {
    display: {
      default: "none",
      "@media (width >= 48rem)": "flex",
    },
    minWidth: "0px",
    flex: "1",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
    fontSize: "13px",
    color: "var(--fg-muted)",
  },
  separator: {
    color: "var(--fg-subtle)",
  },
  link: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderRadius: "var(--radius-sm)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    color: {
      default: "var(--fg-subtle)",
      ":last-child": "var(--fg)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "color,border-color,box-shadow",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "120ms",
    "--sx-duration": "120ms",
    "--sx-ease": "var(--ease-out)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "--sx-font-weight": {
      default: null,
      ":last-child": "var(--font-weight-medium)",
    },
    fontWeight: {
      default: null,
      ":last-child": "var(--font-weight-medium)",
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
  },
  currentPage: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: {
      default: "var(--fg-subtle)",
      ":last-child": "var(--fg)",
    },
    "--sx-font-weight": {
      default: null,
      ":last-child": "var(--font-weight-medium)",
    },
    fontWeight: {
      default: null,
      ":last-child": "var(--font-weight-medium)",
    },
  },
  actions: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
  },
});
