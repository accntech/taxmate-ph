import * as stylex from "@stylexjs/stylex";
export const toastPresentation = stylex.create({
  root: {
    pointerEvents: "auto",
    position: "relative",
    display: "grid",
    width: "100%",
    maxWidth: "calc(var(--spacing) * 96)",
    gridTemplateColumns: "3.5rem minmax(0,1fr) 2.75rem",
    alignItems: "flex-start",
    overflow: "hidden",
    borderRadius: "var(--radius-xl)",
    borderStyle: "solid",
    borderWidth: "1px",
    backgroundColor: "var(--bg-elev)",
    color: "var(--fg)",
    "--sx-shadow": "var(--shadow-md)",
    boxShadow:
      "var(--sx-inset-shadow), var(--sx-inset-ring-shadow), var(--sx-ring-offset-shadow), var(--sx-ring-shadow), var(--sx-shadow)",
  },
  success: {
    borderColor: "var(--success)",
  },
  info: {
    borderColor: "var(--info)",
  },
  warning: {
    borderColor: "var(--warn)",
  },
  error: {
    borderColor: "var(--danger)",
  },
});
