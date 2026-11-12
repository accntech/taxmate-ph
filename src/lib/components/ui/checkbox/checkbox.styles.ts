import * as stylex from "@stylexjs/stylex";

export const checkbox = stylex.create({
  small: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  medium: {
    width: "calc(var(--spacing) * 4)",
    height: "calc(var(--spacing) * 4)",
  },
  checked: {
    borderColor: "var(--accent)",
    backgroundColor: "var(--accent)",
  },
  unchecked: {
    borderColor: "var(--border)",
    backgroundColor: "var(--bg)",
  },
  checkIcon: {
    color: "var(--accent-fg)",
  },
  smallIcon: {
    width: "calc(var(--spacing) * 2.5)",
    height: "calc(var(--spacing) * 2.5)",
  },
  mediumIcon: {
    width: "calc(var(--spacing) * 3)",
    height: "calc(var(--spacing) * 3)",
  },
  root: {
    display: "inline-flex",
    flex: "none",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "3px",
    borderStyle: "solid",
    borderWidth: "1px",
    transitionProperty: "background-color,border-color,box-shadow",
    transitionTimingFunction:
      "var(--sx-ease, var(--default-transition-timing-function))",
    transitionDuration:
      "var(--sx-duration, var(--default-transition-duration))",
    borderColor: {
      default: null,
      ":is(:where(.peer):focus-visible ~ *)":
        "color-mix(in oklch,var(--accent) 60%,var(--border))",
    },
    "--sx-shadow": {
      default: null,
      ":is(:where(.peer):focus-visible ~ *)":
        "0 0 0 3px var(--sx-shadow-color, color-mix(in oklch,var(--accent) 18%,transparent))",
    },
    boxShadow: {
      default: null,
      ":is(:where(.peer):focus-visible ~ *)":
        "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
    },
  },
});
