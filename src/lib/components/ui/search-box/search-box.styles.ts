import * as stylex from "@stylexjs/stylex";

export const searchBox = stylex.create({
  input: {
    width: {
      default: "calc(var(--spacing) * 64)",
      "@media (width < 48rem)": "auto",
    },
    maxWidth: "100%",
    minWidth: {
      default: null,
      "@media (width < 48rem)": "0px",
    },
  },
  root: {
    maxWidth: "100%",
  },
  searchIcon: {
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
    flex: "none",
    color: "var(--fg-subtle)",
  },
  clearIcon: {
    display: "block",
    width: "calc(var(--spacing) * 3.5)",
    height: "calc(var(--spacing) * 3.5)",
  },
  clearButton: {
    flex: "none",
    opacity: {
      default: "50%",
      "@media (hover: hover)": {
        default: null,
        ":hover": "100%",
      },
      ":focus-visible": "100%",
    },
    width: "calc(var(--spacing) * 5) !important",
    height: "calc(var(--spacing) * 5) !important",
    borderRadius: "calc(infinity * 1px) !important",
  },
});
