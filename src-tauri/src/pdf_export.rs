use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex, OnceLock};
use std::time::Duration;

const PRINT_SOURCE_URL_PLACEHOLDER: &str = "__EBIRFORMS_PRINT_SOURCE_URL__";

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfExportRequest {
    pub form_code: String,
    pub paper_size: String,
    pub html: String,
    pub suggested_filename: String,
    pub output_path: Option<String>,
    pub job_id: Option<String>,
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

#[derive(Default)]
struct JobState {
    canceled: bool,
    finished: bool,
}

#[derive(Default)]
pub struct PdfExportJob(Mutex<JobState>);

impl PdfExportJob {
    pub fn cancel(&self) -> bool {
        let mut state = self.0.lock().unwrap_or_else(|error| error.into_inner());
        if state.finished {
            return false;
        }
        state.canceled = true;
        true
    }

    fn check_canceled(&self) -> Result<(), PdfExportError> {
        if self
            .0
            .lock()
            .unwrap_or_else(|error| error.into_inner())
            .canceled
        {
            Err(PdfExportError::new("PDF export canceled."))
        } else {
            Ok(())
        }
    }
}

fn jobs() -> &'static Mutex<HashMap<String, Arc<PdfExportJob>>> {
    static JOBS: OnceLock<Mutex<HashMap<String, Arc<PdfExportJob>>>> = OnceLock::new();
    JOBS.get_or_init(|| Mutex::new(HashMap::new()))
}

#[tauri::command]
pub fn cancel_pdf_export(job_id: String) -> bool {
    jobs()
        .lock()
        .unwrap_or_else(|error| error.into_inner())
        .get(&job_id)
        .map(|job| job.cancel())
        .unwrap_or(false)
}

struct ExportDirectory(std::path::PathBuf);

impl ExportDirectory {
    fn create() -> Result<Self, PdfExportError> {
        static NEXT: AtomicU64 = AtomicU64::new(0);
        loop {
            let path = std::env::temp_dir().join(format!(
                "ebirforms-pdf-{}-{}-{}",
                std::process::id(),
                std::time::SystemTime::now()
                    .duration_since(std::time::UNIX_EPOCH)
                    .unwrap_or_default()
                    .as_nanos(),
                NEXT.fetch_add(1, Ordering::Relaxed)
            ));
            match std::fs::create_dir(&path) {
                Ok(()) => return Ok(Self(path)),
                Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => continue,
                Err(error) => {
                    return Err(PdfExportError::new(format!(
                        "Could not prepare PDF export: {error}"
                    )))
                }
            }
        }
    }
}

impl Drop for ExportDirectory {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfExportProgress {
    pub completed_steps: u8,
    pub total_steps: u8,
    pub stage: String,
}

// Channel itself implements CommandArg rather than Deserialize, so Tauri's
// blanket Option deserialization cannot handle an optional Channel directly.
#[derive(Default)]
pub struct OptionalPdfProgress(Option<tauri::ipc::Channel<PdfExportProgress>>);

impl<'de, R: tauri::Runtime> tauri::ipc::CommandArg<'de, R> for OptionalPdfProgress {
    fn from_command(
        command: tauri::ipc::CommandItem<'de, R>,
    ) -> Result<Self, tauri::ipc::InvokeError> {
        let webview = command.message.webview();
        let id: Option<tauri::ipc::JavaScriptChannelId> = Deserialize::deserialize(command)
            .map_err(|error| tauri::ipc::InvokeError::from(error.to_string()))?;
        Ok(Self(id.map(|id| id.channel_on(webview))))
    }
}

pub fn render_pdf_export(
    request: PdfExportRequest,
    renderer: &str,
    job: &PdfExportJob,
) -> Result<PdfExportReceipt, PdfExportError> {
    render_pdf_export_with_progress(request, renderer, job, |_| {})
}

pub fn render_pdf_export_with_progress(
    request: PdfExportRequest,
    renderer: &str,
    job: &PdfExportJob,
    on_progress: impl Fn(PdfExportProgress),
) -> Result<PdfExportReceipt, PdfExportError> {
    validate_export_request(&request)?;
    job.check_canceled()?;
    let output_path = resolve_output_path(&request);
    let directory = ExportDirectory::create()?;
    let input_path = directory.0.join("return.html");
    let staged_pdf = directory.0.join("return.pdf");
    let input_url = tauri::Url::from_file_path(&input_path)
        .map_err(|_| PdfExportError::new("Could not convert export HTML path to a file URL."))?;
    let html = inject_print_source_url(request.html, input_url.as_str());
    std::fs::write(&input_path, html)
        .map_err(|error| PdfExportError::new(format!("Could not write export HTML: {error}")))?;
    {
        let state = job.0.lock().unwrap_or_else(|error| error.into_inner());
        if state.canceled {
            return Err(PdfExportError::new("PDF export canceled."));
        }
        on_progress(PdfExportProgress {
            completed_steps: 5,
            total_steps: 7,
            stage: "Rendering PDF".into(),
        });
    }
    let log_path = directory.0.join("renderer.log");
    let log_file = std::fs::File::create(&log_path).map_err(|error| {
        PdfExportError::new(format!("Could not prepare PDF renderer log: {error}"))
    })?;
    let args = build_chromium_args(input_url.as_str(), &staged_pdf.to_string_lossy());
    let mut child = std::process::Command::new(renderer)
        .args(args)
        .stdout(std::process::Stdio::null())
        .stderr(log_file)
        .spawn()
        .map_err(|error| PdfExportError::new(format!("Could not start PDF renderer: {error}")))?;
    let status = loop {
        if let Err(error) = job.check_canceled() {
            let _ = child.kill();
            let _ = child.wait();
            return Err(error);
        }
        match child.try_wait() {
            Ok(Some(status)) => break status,
            Ok(None) => std::thread::sleep(Duration::from_millis(20)),
            Err(error) => {
                let _ = child.kill();
                let _ = child.wait();
                return Err(PdfExportError::new(format!(
                    "Could not wait for PDF renderer: {error}"
                )));
            }
        }
    };
    job.check_canceled()?;
    if !status.success() {
        let stderr = std::fs::read_to_string(log_path).unwrap_or_default();
        return Err(PdfExportError::new(format!(
            "PDF renderer exited with {}. {}",
            status,
            stderr.trim()
        )));
    }
    if !staged_pdf.exists() {
        return Err(PdfExportError::new(
            "PDF renderer finished but did not create the output file.",
        ));
    }
    // Cancellation and publication share this lock: an accepted cancellation
    // cannot race with replacing an existing destination.
    let mut state = job.0.lock().unwrap_or_else(|error| error.into_inner());
    if state.canceled {
        return Err(PdfExportError::new("PDF export canceled."));
    }
    on_progress(PdfExportProgress {
        completed_steps: 6,
        total_steps: 7,
        stage: "Saving PDF".into(),
    });
    std::fs::copy(&staged_pdf, &output_path)
        .map_err(|error| PdfExportError::new(format!("Could not save PDF: {error}")))?;
    state.finished = true;
    on_progress(PdfExportProgress {
        completed_steps: 7,
        total_steps: 7,
        stage: "PDF saved".into(),
    });
    Ok(PdfExportReceipt {
        status: "exported".into(),
        paper_size: request.paper_size,
        path: output_path.to_string_lossy().into_owned(),
        message: "PDF exported.".into(),
    })
}

#[tauri::command]
pub async fn export_form_pdf(
    request: PdfExportRequest,
    on_progress: OptionalPdfProgress,
) -> Result<PdfExportReceipt, PdfExportError> {
    validate_export_request(&request)?;
    let job = Arc::new(PdfExportJob::default());
    let job_id = request.job_id.clone();
    if let Some(id) = &job_id {
        let mut registered = jobs().lock().unwrap_or_else(|error| error.into_inner());
        if registered.contains_key(id) {
            return Err(PdfExportError::new(
                "A PDF export with this job ID is already running.",
            ));
        }
        registered.insert(id.clone(), job.clone());
    }
    let result = tauri::async_runtime::spawn_blocking(move || {
        let explicit_renderer = std::env::var("EBIRFORMS_PDF_RENDERER").ok();
        let candidates = chromium_candidates();
        let renderer = find_chromium_renderer(explicit_renderer.as_deref(), &candidates).ok_or_else(|| {
            PdfExportError::new("PDF renderer was not found. Install Chrome, Chromium, or Edge, or set EBIRFORMS_PDF_RENDERER to the browser binary.")
        })?;
        render_pdf_export_with_progress(request, &renderer, &job, |progress| {
            if let Some(channel) = &on_progress.0 {
                let _ = channel.send(progress);
            }
        })
    }).await.map_err(|error| PdfExportError::new(format!("PDF export worker failed: {error}")));
    if let Some(id) = &job_id {
        jobs()
            .lock()
            .unwrap_or_else(|error| error.into_inner())
            .remove(id);
    }
    result?
}
