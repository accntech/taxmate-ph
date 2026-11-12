import * as stylex from "@stylexjs/stylex";

export const timeInput = stylex.create({
  small: {
    minHeight: "calc(var(--spacing) * 7.5)",
    gap: "calc(var(--spacing) * 1.5)",
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "var(--spacing)",
    fontSize: "12.5px",
  },
  medium: {
    minHeight: "calc(var(--spacing) * 9.5)",
    gap: "calc(var(--spacing) * 2)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
  },
  segments: {
    display: "flex",
    minWidth: "0px",
    flex: "1",
    alignItems: "center",
    gap: "var(--spacing)",
    fontFamily: "var(--font-mono)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  digit: {
    boxShadow: "none",
    borderRadius: "0.25rem",
    paddingInline: "calc(var(--spacing) * 0.5)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      ":focus": "var(--accent)",
    },
    color: {
      default: null,
      ":focus": "var(--accent-fg)",
    },
  },
  placeholder: {
    color: "var(--fg-subtle)",
  },
  filled: {
    color: "var(--fg)",
  },
  period: {
    boxShadow: "none",
    marginLeft: "var(--spacing)",
    borderRadius: "0.25rem",
    paddingInline: "calc(var(--spacing) * 0.5)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: null,
      ":focus": "var(--accent)",
    },
    color: {
      default: null,
      ":focus": "var(--accent-fg)",
    },
  },
  root: {
    display: "flex",
    alignItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-within": "color-mix(in oklch,var(--accent) 60%,var(--border))",
      ":hover:not(:focus-within)":
        "color-mix(in oklch,var(--fg-subtle) 30%,var(--border))",
      ':is([data-invalid="true"])':
        "color-mix(in oklch,var(--danger) 60%,var(--border)) !important",
    },
    backgroundColor: {
      default: "var(--bg-input)",
      ":focus-within": "var(--bg-elev)",
    },
    transitionProperty: "all",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-shadow": {
      default: null,
      ":focus-within":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
      ':is([data-invalid="true"])':
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--danger) 12%,transparent)) !important",
    },
    boxShadow: {
      default: null,
      ":focus-within":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ':is([data-invalid="true"])':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow) !important",
    },
  },
});
