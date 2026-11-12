import * as stylex from '@stylexjs/stylex';

export const returnErrors = stylex.create({
  summary: {
    borderRadius: "0.375rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "color-mix(in oklab, var(--danger) 30%, transparent)",
    backgroundColor: "var(--danger-soft)",
    padding: "0.75rem",
    fontSize: "0.875rem",
    lineHeight: "calc(1.25 / 0.875)",
    color: "var(--fg)"
  },
  heading: {
    fontWeight: 500
  },
  list: {
    marginTop: "0.5rem",
    listStyleType: "disc",
    display: "grid",
    rowGap: "0.25rem",
    paddingLeft: "1.25rem"
  },
  link: {
    borderRadius: "0.25rem",
    textDecorationLine: "underline",
    textUnderlineOffset: "4px",
    outlineWidth: {
      default: null,
      ":focus-visible": "2px"
    },
    outlineStyle: {
      default: null,
      ":focus-visible": "solid"
    },
    outlineOffset: {
      default: null,
      ":focus-visible": "2px"
    },
    outlineColor: {
      default: null,
      ":focus-visible": "var(--accent)"
    }
  }
});
