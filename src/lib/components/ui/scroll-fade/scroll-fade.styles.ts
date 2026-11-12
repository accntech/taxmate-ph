import * as stylex from "@stylexjs/stylex";

export const fade = stylex.create({
  arrow: {
    display: "block",
    flexShrink: 0,
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    color: "var(--fg-subtle)",
  },
});
