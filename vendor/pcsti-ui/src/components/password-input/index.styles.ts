import * as stylex from "@stylexjs/stylex";

export const passwordInput = stylex.create({
  lockIcon: {
    width: "calc(var(--spacing) * 3.75)",
    height: "calc(var(--spacing) * 3.75)",
    flex: "none",
    color: "var(--fg-subtle)",
  },
  toggleButton: {
    display: "grid",
    width: "calc(var(--spacing) * 6)",
    height: "calc(var(--spacing) * 6)",
    placeItems: "center",
    borderRadius: "var(--radius-sm)",
    color: {
      default: "var(--fg-subtle)",
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--fg)",
      },
    },
    transitionProperty: "transform,background-color,color",
    transitionTimingFunction: "var(--ease-out)",
    transitionDuration: "120ms",
    "--sx-duration": "120ms",
    "--sx-ease": "var(--ease-out)",
    backgroundColor: {
      default: null,
      "@media (hover: hover)": {
        default: null,
        ":hover": "var(--bg-hover)",
      },
    },
    "--sx-scale-x": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-y": {
      default: null,
      ":active": "97%",
    },
    "--sx-scale-z": {
      default: null,
      ":active": "97%",
    },
    scale: {
      default: null,
      ":active": "var(--sx-scale-x) var(--sx-scale-y)",
    },
  },
  toggleIcon: {
    width: "calc(var(--spacing) * 3.75)",
    height: "calc(var(--spacing) * 3.75)",
  },
});
