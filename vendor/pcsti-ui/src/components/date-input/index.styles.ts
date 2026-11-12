import * as stylex from "@stylexjs/stylex";

export const dateInput = stylex.create({
  root: {
    position: "relative",
  },
  calendar: {
    position: "fixed",
    zIndex: 100,
    borderRadius: "var(--radius-lg)",
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor: "var(--border)",
    backgroundColor: "var(--bg-elev)",
    "--sx-shadow": "var(--shadow-lg)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  above: {
    transformOrigin: "0 100%",
  },
  below: {
    transformOrigin: "0 0",
  },
});
