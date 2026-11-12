import * as stylex from "@stylexjs/stylex";

export const dialogHeader = stylex.create({
  title: {
    margin: "0px",
    fontSize: "15px",
    "--sx-font-weight": "var(--font-weight-semibold)",
    fontWeight: "var(--font-weight-semibold)",
    "--sx-tracking": "var(--tracking-tight)",
    letterSpacing: "var(--tracking-tight)",
    color: "var(--fg)",
  },
  description: {
    fontSize: "13px",
    "--sx-leading": "var(--leading-snug)",
    lineHeight: "var(--leading-snug)",
    textWrap: "wrap",
    color: "var(--fg-subtle)",
  },
  closeButtonSpace: {
    paddingRight: {
      default: null,
      "@media (width >= 40rem)": "calc(var(--spacing) * 9)",
    },
  },
  belowTitle: {
    marginTop: "calc(var(--spacing) * 1.5)",
  },
});
