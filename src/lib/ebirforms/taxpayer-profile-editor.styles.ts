import * as stylex from '@stylexjs/stylex';

export const profileEditor = stylex.create({
  backLink: {
    width: "fit-content"
  },
  loadError: {
    marginTop: "0.5rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--fg-muted)"
  },
  tin: {
    fontFamily: "var(--font-mono)"
  }
});
