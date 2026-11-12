use serde::{Deserialize, Serialize};
use std::path::Path;

const PRINT_SOURCE_URL_PLACEHOLDER: &str = "__EBIRFORMS_PRINT_SOURCE_URL__";

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfExportRequest {
    pub form_code: String,
    pub paper_size: String,
    pub html: String,
    pub suggested_filename: String,
    pub output_path: Option<String>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfExportReceipt {
    pub status: String,
    pub paper_size: String,
    pub path: String,
    pub message: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfExportError {
    pub message: String,
    pub log_path: Option<String>,
}

impl PdfExportError {
    pub fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            log_path: None,
        }
    }
}

pub fn validate_export_request(request: &PdfExportRequest) -> Result<(), PdfExportError> {
    if !matches!(
        request.form_code.as_str(),
        "0605"
            | "0619E"
            | "0619F"
            | "1600"
            | "1600PTv2018"
            | "1600VTv2018"
            | "1600WP"
            | "1601C"
            | "1601Cv2018"
            | "1601E"
            | "1601EQ"
            | "1601F"
            | "1601FQ"
            | "1602"
            | "1602Qv2018"
            | "1603"
            | "1603Qv2018"
            | "1604C"
            | "1604CF"
            | "1604E"
            | "1604Ev2018"
            | "1604F"
            | "1606"
    ) {
        return Err(PdfExportError::new(format!(
            "Unsupported form code: {}",
            request.form_code
        )));
    }

    if !matches!(request.paper_size.as_str(), "letter" | "a4" | "long") {
        return Err(PdfExportError::new(format!(
            "Unsupported paper size: {}",
            request.paper_size
        )));
    }

    if !request.html.trim_start().starts_with("<!doctype html>") {
        return Err(PdfExportError::new(
            "PDF export requires a complete HTML document.",
        ));
    }

    if request.suggested_filename.contains('/') || request.suggested_filename.contains('\\') {
        return Err(PdfExportError::new(
            "Suggested PDF filename must not contain path separators.",
        ));
    }

    Ok(())
}

pub fn build_chromium_args(input_url: &str, output_pdf: &str) -> Vec<String> {
    vec![
        "--headless=new".into(),
        "--disable-gpu".into(),
        "--no-pdf-header-footer".into(),
        format!("--print-to-pdf={output_pdf}"),
        "--print-to-pdf-no-header".into(),
        "--run-all-compositor-stages-before-draw".into(),
        "--virtual-time-budget=1000".into(),
        input_url.into(),
    ]
}

pub fn inject_print_source_url(html: String, input_url: &str) -> String {
    html.replace(PRINT_SOURCE_URL_PLACEHOLDER, input_url)
}

pub fn find_chromium_renderer(
    explicit_renderer: Option<&str>,
    candidates: &[String],
) -> Option<String> {
    if let Some(renderer) = explicit_renderer.filter(|value| !value.trim().is_empty()) {
        return Some(renderer.into());
    }

    candidates
        .iter()
        .find(|candidate| Path::new(candidate.as_str()).exists())
        .cloned()
}

pub fn resolve_output_path(request: &PdfExportRequest) -> std::path::PathBuf {
    let mut output_path = request
        .output_path
        .as_ref()
        .filter(|path| !path.trim().is_empty())
        .map(std::path::PathBuf::from)
        .unwrap_or_else(|| std::env::temp_dir().join(&request.suggested_filename));

    if output_path
        .extension()
        .and_then(|extension| extension.to_str())
        .map(|extension| !extension.eq_ignore_ascii_case("pdf"))
        .unwrap_or(true)
    {
        output_path.set_extension("pdf");
    }

    output_path
}

fn chromium_candidates() -> Vec<String> {
    let mut candidates = vec![
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome".into(),
        "/Applications/Chromium.app/Contents/MacOS/Chromium".into(),
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge".into(),
        "/usr/bin/google-chrome".into(),
        "/usr/bin/chromium".into(),
        "/usr/bin/chromium-browser".into(),
        "/usr/bin/microsoft-edge".into(),
    ];

    if let Ok(program_files) = std::env::var("PROGRAMFILES") {
        candidates.push(format!(
            "{program_files}\\Google\\Chrome\\Application\\chrome.exe"
        ));
        candidates.push(format!(
            "{program_files}\\Microsoft\\Edge\\Application\\msedge.exe"
        ));
    }

    if let Ok(program_files_x86) = std::env::var("PROGRAMFILES(X86)") {
        candidates.push(format!(
            "{program_files_x86}\\Google\\Chrome\\Application\\chrome.exe"
        ));
        candidates.push(format!(
            "{program_files_x86}\\Microsoft\\Edge\\Application\\msedge.exe"
        ));
    }

    candidates
}

#[tauri::command]
pub async fn export_form_pdf(
    request: PdfExportRequest,
) -> Result<PdfExportReceipt, PdfExportError> {
    validate_export_request(&request)?;

    let output_path = resolve_output_path(&request);
    let input_path = std::env::temp_dir()
        .join(&request.suggested_filename)
        .with_extension("html");

    let input_url = tauri::Url::from_file_path(&input_path)
        .map_err(|_| PdfExportError::new("Could not convert export HTML path to a file URL."))?;
    let html = inject_print_source_url(request.html, input_url.as_str());

    std::fs::write(&input_path, html)
        .map_err(|error| PdfExportError::new(format!("Could not write export HTML: {error}")))?;

    let args = build_chromium_args(input_url.as_str(), &output_path.to_string_lossy());

    let explicit_renderer = std::env::var("EBIRFORMS_PDF_RENDERER").ok();
    let candidates = chromium_candidates();
    let renderer = find_chromium_renderer(explicit_renderer.as_deref(), &candidates).ok_or_else(|| {
        PdfExportError::new(
            "PDF renderer was not found. Install Chrome, Chromium, or Edge, or set EBIRFORMS_PDF_RENDERER to the browser binary.",
        )
    })?;

    let output = std::process::Command::new(renderer)
        .args(args)
        .output()
        .map_err(|error| PdfExportError::new(format!("Could not start PDF renderer: {error}")))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(PdfExportError::new(format!(
            "PDF renderer exited with {}. {}",
            output.status,
            stderr.trim()
        )));
    }

    if !output_path.exists() {
        return Err(PdfExportError::new(
            "PDF renderer finished but did not create the output file.",
        ));
    }

    Ok(PdfExportReceipt {
        status: "exported".into(),
        paper_size: request.paper_size,
        path: output_path.to_string_lossy().into_owned(),
        message: "PDF exported.".into(),
    })
}
