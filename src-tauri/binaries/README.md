# TaxMate PH PDF Renderer

The PDF export command renders with a Chromium-compatible browser. It first checks
`EBIRFORMS_PDF_RENDERER`, then common Chrome, Chromium, and Edge install paths.

The command passes Chromium headless PDF arguments:

- `--headless=new`
- `--disable-gpu`
- `--no-pdf-header-footer`
- `--print-to-pdf=/absolute/path/to/export.pdf`
- `--print-to-pdf-no-header`
- `--run-all-compositor-stages-before-draw`
- `--virtual-time-budget=1000`
- `file:///absolute/path/to/export.html`

The HTML document must:

- define `@page` size and margins
- include background images and colors
- use print CSS for the final layout

If the project later bundles its own renderer sidecar, binaries must follow Tauri
target-triple naming, for example:

- `ebirforms-pdf-renderer-aarch64-apple-darwin`
- `ebirforms-pdf-renderer-x86_64-pc-windows-msvc.exe`
