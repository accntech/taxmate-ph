import * as stylex from "@stylexjs/stylex";
export const dialogSize = stylex.create({
  small: {
    maxWidth: {
      default: null,
      "@media (width >= 40rem)": "var(--container-sm)",
    },
  },
  medium: {
    maxWidth: {
      default: null,
      "@media (width >= 40rem)": "var(--container-md)",
    },
  },
  large: {
    maxWidth: {
      default: null,
      "@media (width >= 40rem)": "var(--container-lg)",
    },
  },
  extraLarge: {
    maxWidth: {
      default: null,
      "@media (width >= 40rem)": "var(--container-2xl)",
    },
  },
});
