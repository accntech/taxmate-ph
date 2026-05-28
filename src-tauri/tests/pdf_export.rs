use ebirforms_tauri_lib::pdf_export::{
    build_chromium_args, find_chromium_renderer, inject_print_source_url, resolve_output_path,
    validate_export_request, PdfExportRequest,
};

#[test]
fn validate_export_request_accepts_1601eq_long_html() {
    let request = PdfExportRequest {
        form_code: "1601EQ".into(),
        paper_size: "long".into(),
        html: "<!doctype html><html><body>1601EQ</body></html>".into(),
        suggested_filename: "1601EQ-long.pdf".into(),
        output_path: None,
    };

    assert!(validate_export_request(&request).is_ok());
}

#[test]
fn validate_export_request_rejects_unsupported_paper_size() {
    let request = PdfExportRequest {
        form_code: "1601EQ".into(),
        paper_size: "legal".into(),
        html: "<!doctype html><html><body>1601EQ</body></html>".into(),
        suggested_filename: "1601EQ.pdf".into(),
        output_path: None,
    };

    let error = validate_export_request(&request).expect_err("invalid paper size");

    assert!(error.message.contains("Unsupported paper size"));
}

#[test]
fn resolve_output_path_uses_save_dialog_path_when_present() {
    let request = PdfExportRequest {
        form_code: "1601EQ".into(),
        paper_size: "long".into(),
        html: "<!doctype html><html><body>1601EQ</body></html>".into(),
        suggested_filename: "1601EQ-long.pdf".into(),
        output_path: Some("/tmp/chosen/1601EQ-long.pdf".into()),
    };

    assert_eq!(
        resolve_output_path(&request),
        std::path::PathBuf::from("/tmp/chosen/1601EQ-long.pdf")
    );
}

#[test]
fn resolve_output_path_adds_pdf_extension_to_save_dialog_path() {
    let request = PdfExportRequest {
        form_code: "1601EQ".into(),
        paper_size: "long".into(),
        html: "<!doctype html><html><body>1601EQ</body></html>".into(),
        suggested_filename: "1601EQ-long.pdf".into(),
        output_path: Some("/tmp/chosen/1601EQ-long".into()),
    };

    assert_eq!(
        resolve_output_path(&request),
        std::path::PathBuf::from("/tmp/chosen/1601EQ-long.pdf")
    );
}

#[test]
fn build_chromium_args_uses_headless_pdf_export() {
    let args = build_chromium_args("file:///tmp/1601eq.html", "/tmp/1601eq.pdf");

    assert_eq!(
        args,
        vec![
            "--headless=new",
            "--disable-gpu",
            "--no-pdf-header-footer",
            "--print-to-pdf=/tmp/1601eq.pdf",
            "--print-to-pdf-no-header",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=1000",
            "file:///tmp/1601eq.html"
        ]
    );
}

#[test]
fn inject_print_source_url_replaces_footer_placeholder_with_file_url() {
    let html =
        "<!doctype html><html><body>__EBIRFORMS_PRINT_SOURCE_URL__</body></html>".to_string();

    assert_eq!(
        inject_print_source_url(html, "file:///tmp/1601EQ-long.html"),
        "<!doctype html><html><body>file:///tmp/1601EQ-long.html</body></html>"
    );
}

#[test]
fn find_chromium_renderer_prefers_explicit_env_path() {
    let renderer = find_chromium_renderer(Some("/custom/chrome"), &[]);

    assert_eq!(renderer, Some("/custom/chrome".into()));
}

#[test]
fn find_chromium_renderer_uses_first_existing_candidate() {
    let root = tempfile::tempdir().expect("temp dir");
    let missing = root.path().join("missing-chrome");
    let existing = root.path().join("chrome");
    std::fs::write(&existing, "").expect("chrome placeholder");

    let renderer = find_chromium_renderer(
        None,
        &[
            missing.to_string_lossy().into_owned(),
            existing.to_string_lossy().into_owned(),
        ],
    );

    assert_eq!(renderer, Some(existing.to_string_lossy().into_owned()));
}
