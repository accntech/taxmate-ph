import * as stylex from "@stylexjs/stylex";

export const numberInput = stylex.create({
  control: {
    boxShadow: "none",
    minWidth: "0px",
    flex: "1",
    appearance: "textfield",
    backgroundColor: "transparent",
    fontFamily: "var(--font-mono)",
    color: "var(--fg)",
    "--sx-numeric-spacing": "tabular-nums",
    fontVariantNumeric:
      "var(--sx-ordinal,) var(--sx-slashed-zero,) var(--sx-numeric-figure,) var(--sx-numeric-spacing,) var(--sx-numeric-fraction,)",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "::placeholder": {
      color: "var(--fg-subtle)",
    },
  },
  trailing: {
    pointerEvents: "none",
    flex: "none",
    color: "var(--fg-muted)",
    userSelect: "none",
  },
  root: {
    display: "flex",
    minHeight: "calc(var(--spacing) * 9.5)",
    alignItems: "center",
    gap: "calc(var(--spacing) * 2)",
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
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "13px",
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
      ':is([data-invalid="true"]:focus-within)':
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--danger) 24%,transparent)) !important",
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
