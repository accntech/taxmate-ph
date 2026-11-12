import * as stylex from "@stylexjs/stylex";

export const textarea = stylex.create({
  root: {
    width: "100%",
    resize: "vertical",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: {
      default: "var(--border)",
      ":focus-visible": "var(--field-focus-border, color-mix(in oklch,var(--accent) 60%,var(--border)))",
      ':is([data-invalid="true"])':
        "var(--field-error-border, color-mix(in oklch,var(--danger) 60%,var(--border))) !important",
      ":hover:not(:focus-visible)":
        "color-mix(in oklch,var(--fg-subtle) 30%,var(--border))",
    },
    backgroundColor: {
      default: "var(--bg-input)",
      ":focus-visible": "var(--bg-elev)",
    },
    color: "var(--fg)",
    transitionProperty: "all",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    "--sx-outline-style": "none",
    outlineStyle: "none",
    "::placeholder": {
      color: "var(--fg-subtle)",
    },
    "--sx-shadow": {
      default: null,
      ":focus-visible":
        "0 0 0 3px var(--sx-shadow-color, var(--field-focus-halo, color-mix(in oklch,var(--accent) 18%,transparent)))",
      ':is([data-invalid="true"])':
        "0 0 0 3px var(--sx-shadow-color, var(--field-error-halo, color-mix(in oklch,var(--danger) 12%,transparent))) !important",
      ':is([data-invalid="true"]):focus-visible':
        "0 0 0 3px var(--sx-shadow-color, var(--field-error-focus-halo, color-mix(in oklch,var(--danger) 24%,transparent))) !important",
    },
    boxShadow: {
      default: null,
      ":focus-visible":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
      ':is([data-invalid="true"])':
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow) !important",
    },
  },
  normal: {
    minHeight: "calc(var(--spacing) * 24)",
    paddingInline: "calc(var(--spacing) * 3)",
    paddingBlock: "calc(var(--spacing) * 2)",
    fontSize: "13px",
  },
  compact: {
    minHeight: "calc(var(--spacing) * 18)",
    paddingInline: "calc(var(--spacing) * 2)",
    paddingBlock: "calc(var(--spacing) * 1.5)",
    fontSize: "12.5px",
  },
});
