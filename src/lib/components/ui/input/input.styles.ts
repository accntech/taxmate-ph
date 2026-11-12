import * as stylex from "@stylexjs/stylex";

export type InputSize = "normal" | "compact";

export const input = stylex.create({
  wrapper: {
    display: "flex",
    alignItems: "center",
    borderRadius: "var(--radius-md)",
    borderStyle: "solid",
    borderWidth: "1px",
    backgroundColor: {
      default: "var(--bg-input)",
      ":focus-within": "var(--bg-elev)",
    },
    borderColor: {
      default: "var(--border)",
      ":hover:not(:focus-within)":
        "color-mix(in oklch, var(--fg-subtle) 30%, var(--border))",
      ":focus-within": "var(--field-focus-border, color-mix(in oklch, var(--accent) 60%, var(--border)))",
    },
    boxShadow: {
      default: null,
      ":focus-within":
        "0 0 0 3px var(--field-focus-halo, color-mix(in oklch, var(--accent) 18%, transparent))",
    },
    transitionProperty: "all",
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  normal: {
    minHeight: "2.375rem",
    gap: "0.5rem",
    paddingInline: "0.75rem",
    paddingBlock: "0.375rem",
    fontSize: "13px",
  },
  compact: {
    minHeight: "1.875rem",
    gap: "0.375rem",
    paddingInline: "0.5rem",
    paddingBlock: "0.25rem",
    fontSize: "12.5px",
  },
  invalid: {
    borderColor: {
      default: "var(--field-error-border, color-mix(in oklch, var(--danger) 60%, var(--border)))",
      ":hover:not(:focus-within)":
        "var(--field-error-border, color-mix(in oklch, var(--danger) 60%, var(--border)))",
      ":focus-within": "var(--field-error-border, color-mix(in oklch, var(--danger) 60%, var(--border)))",
    },
    boxShadow: {
      default: "0 0 0 3px var(--field-error-halo, color-mix(in oklch, var(--danger) 12%, transparent))",
      ":focus-within":
        "0 0 0 3px var(--field-error-focus-halo, color-mix(in oklch, var(--danger) 24%, transparent))",
    },
  },
  control: {
    boxShadow: "none",
    color: "var(--fg)",
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    backgroundColor: "transparent",
    outline: "none",
    "::placeholder": { color: "var(--fg-subtle)" },
  },
});
