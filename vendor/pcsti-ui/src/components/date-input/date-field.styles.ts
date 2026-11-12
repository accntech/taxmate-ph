import * as stylex from "@stylexjs/stylex";

export const dateField = stylex.create({
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
    letterSpacing: "normal",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
  },
  segment: {
    boxShadow: "none",
    minWidth: 0,
    flexShrink: 0,
    borderWidth: 0,
    borderStyle: "none",
    font: "inherit",
    fontVariantNumeric: "tabular-nums",
    borderRadius: "0.25rem",
    paddingInline: "calc(var(--spacing) * 0.5)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    backgroundColor: {
      default: "transparent",
      ":focus": "var(--accent)",
    },
    color: {
      default: "var(--fg)",
      ":focus": "var(--accent-fg)",
    },
    "::placeholder": { color: "var(--fg-subtle)", opacity: 1 },
  },
  shortSegment: { width: "calc(2ch + var(--spacing))" },
  year: { width: "calc(4ch + var(--spacing))" },
  mutedSegment: {
    color: "var(--fg-subtle)",
  },
  calendarButton: {
    flex: "none",
    cursor: "pointer",
    borderRadius: "var(--radius-sm)",
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    "--sx-outline-style": "none",
    outlineStyle: "none",
  },
  smallCalendarButton: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  mediumCalendarButton: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
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
    transitionProperty: "background-color,border-color,box-shadow",
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
