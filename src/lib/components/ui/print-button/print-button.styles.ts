import * as stylex from "@stylexjs/stylex";

export const printButton = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "stretch",
    flexShrink: 0,
    verticalAlign: "middle",
  },
  main: {
    borderRadius: "var(--radius-md) 0 0 var(--radius-md)",
    paddingInlineEnd: "calc(var(--spacing) * 1.5)",
    position: "relative",
    zIndex: { default: null, ":focus-visible": 1 },
  },
  neutral: {
    borderColor: {
      default: "transparent",
      ":focus-visible": "color-mix(in oklch, var(--accent) 60%, var(--border))",
    },
    backgroundColor: {
      default: "var(--bg-elev-2)",
      ":hover": "var(--bg-hover)",
    },
  },
  moreButton: {
    borderRadius: "0 var(--radius-md) var(--radius-md) 0",
    paddingInline: "calc(var(--spacing) * 1.5)",
    minWidth: "1.75rem",
    alignSelf: "stretch",
    position: "relative",
    zIndex: { default: null, ":focus-visible": 1 },
  },
  icon: {
    width: "0.875rem",
    height: "0.875rem",
    flexShrink: 0,
  },
  shortcutHint: {
    color: "currentColor",
    backgroundColor: "color-mix(in oklch, currentColor 20%, transparent)",
  },
  settingsItem: {
    width: "100%",
    justifyContent: "flex-start",
    whiteSpace: "nowrap",
    borderRadius: "var(--radius-sm)",
    fontWeight: 400,
    color: "var(--fg)",
  },
});
