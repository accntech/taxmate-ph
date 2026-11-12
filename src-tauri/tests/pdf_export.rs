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
        suggested_filename: "1601EQ-2026-Q1.pdf".into(),
        output_path: None,
        job_id: None,
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
        job_id: None,
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
        suggested_filename: "1601EQ-2026-Q1.pdf".into(),
        output_path: Some("/tmp/chosen/1601EQ-2026-Q1.pdf".into()),
        job_id: None,
    };

    assert_eq!(
        resolve_output_path(&request),
        std::path::PathBuf::from("/tmp/chosen/1601EQ-2026-Q1.pdf")
    );
}

#[test]
fn resolve_output_path_adds_pdf_extension_to_save_dialog_path() {
    let request = PdfExportRequest {
        form_code: "1601EQ".into(),
        paper_size: "long".into(),
        html: "<!doctype html><html><body>1601EQ</body></html>".into(),
        suggested_filename: "1601EQ-2026-Q1.pdf".into(),
        output_path: Some("/tmp/chosen/1601EQ-2026-Q1".into()),
        job_id: None,
    };

    assert_eq!(
        resolve_output_path(&request),
        std::path::PathBuf::from("/tmp/chosen/1601EQ-2026-Q1.pdf")
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

#[test]
fn accepts_all_selectable_withholding_versions_and_rejects_inactive_templates() {
    for code in [
        "0605",
        "0619E",
        "0619F",
        "1600",
        "1600PTv2018",
        "1600VTv2018",
        "1600WP",
        "1601C",
        "1601Cv2018",
        "1601E",
        "1601EQ",
        "1601F",
        "1601FQ",
        "1602",
        "1602Qv2018",
        "1603",
        "1603Qv2018",
        "1604C",
        "1604CF",
        "1604E",
        "1604Ev2018",
        "1604F",
        "1606",
        "0620",
        "1621",
        "unknown",
    ] {
        let request = PdfExportRequest {
            form_code: code.into(),
            paper_size: "a4".into(),
            html: "<!doctype html><html></html>".into(),
            suggested_filename: "return.pdf".into(),
            output_path: None,
            job_id: None,
        };
        assert_eq!(
            validate_export_request(&request).is_ok(),
            !["0620", "1621", "unknown"].contains(&code),
            "{code}"
        );
    }
}

#[cfg(unix)]
#[test]
fn failed_render_preserves_existing_destination() {
    use std::os::unix::fs::PermissionsExt;
    let root = tempfile::tempdir().unwrap();
    let renderer = root.path().join("renderer");
    std::fs::write(&renderer, "#!/bin/sh\nfor arg in \"$@\"; do\n case \"$arg\" in --print-to-pdf=*) printf partial > \"${arg#--print-to-pdf=}\";; esac\ndone\nexit 1\n").unwrap();
    std::fs::set_permissions(&renderer, std::fs::Permissions::from_mode(0o755)).unwrap();
    let destination = root.path().join("existing.pdf");
    std::fs::write(&destination, "existing document").unwrap();
    std::env::set_var("EBIRFORMS_PDF_RENDERER", &renderer);
    let request: PdfExportRequest = serde_json::from_value(serde_json::json!({
        "formCode": "0605", "paperSize": "long", "html": "<!doctype html><html></html>",
        "suggestedFilename": "failed-render-test.pdf", "outputPath": destination
    }))
    .unwrap();
    let result = tauri::async_runtime::block_on(ebirforms_tauri_lib::pdf_export::export_form_pdf(
        request,
        Default::default(),
    ));
    std::env::remove_var("EBIRFORMS_PDF_RENDERER");
    assert!(result.is_err());
    assert_eq!(
        std::fs::read_to_string(destination).unwrap(),
        "existing document"
    );
}

#[cfg(unix)]
#[test]
fn cancel_stops_running_renderer_and_preserves_destination() {
    use ebirforms_tauri_lib::pdf_export::{render_pdf_export_with_progress, PdfExportJob};
    use std::{
        os::unix::fs::PermissionsExt,
        sync::{Arc, Mutex},
        time::{Duration, Instant},
    };
    let root = tempfile::tempdir().unwrap();
    let renderer = root.path().join("renderer");
    let marker = root.path().join("started");
    let destination = root.path().join("existing.pdf");
    std::fs::write(&destination, "existing document").unwrap();
    std::fs::write(
        &renderer,
        format!(
            "#!/bin/sh\nprintf started > '{}'\nwhile :; do :; done\n",
            marker.display()
        ),
    )
    .unwrap();
    std::fs::set_permissions(&renderer, std::fs::Permissions::from_mode(0o755)).unwrap();
    let request: PdfExportRequest = serde_json::from_value(serde_json::json!({
        "formCode": "0605", "paperSize": "long", "html": "<!doctype html><html></html>",
        "suggestedFilename": "cancel-test.pdf", "outputPath": destination
    }))
    .unwrap();
    let job = Arc::new(PdfExportJob::default());
    let worker_job = job.clone();
    let progress = Arc::new(Mutex::new(Vec::new()));
    let worker_progress = progress.clone();
    let (send, receive) = std::sync::mpsc::channel();
    let worker = std::thread::spawn(move || {
        send.send(render_pdf_export_with_progress(
            request,
            renderer.to_str().unwrap(),
            &worker_job,
            |event| worker_progress.lock().unwrap().push(event.completed_steps),
        ))
        .unwrap();
    });
    let deadline = Instant::now() + Duration::from_secs(5);
    while !marker.exists() && Instant::now() < deadline {
        std::thread::sleep(Duration::from_millis(10));
    }
    let started = marker.exists();
    assert!(job.cancel());
    let result = receive
        .recv_timeout(Duration::from_secs(2))
        .expect("renderer cancellation should finish promptly");
    worker.join().unwrap();
    assert!(
        started,
        "renderer must have been running before cancellation"
    );
    assert_eq!(result.unwrap_err().message, "PDF export canceled.");
    assert_eq!(
        *progress.lock().unwrap(),
        vec![5],
        "accepted cancellation must stop progress events"
    );
    assert_eq!(
        std::fs::read_to_string(destination).unwrap(),
        "existing document"
    );
}

#[test]
fn cancellation_before_render_does_not_start_renderer() {
    use ebirforms_tauri_lib::pdf_export::{render_pdf_export, PdfExportJob};
    let job = PdfExportJob::default();
    assert!(job.cancel());
    let request: PdfExportRequest = serde_json::from_value(serde_json::json!({
        "formCode": "0605", "paperSize": "long", "html": "<!doctype html><html></html>",
        "suggestedFilename": "cancel-before-render.pdf"
    }))
    .unwrap();
    let error = render_pdf_export(request, "/missing/renderer", &job).unwrap_err();
    assert_eq!(error.message, "PDF export canceled.");
}

#[cfg(unix)]
#[test]
fn successful_render_publishes_pdf_and_rejects_late_cancellation() {
    use ebirforms_tauri_lib::pdf_export::{render_pdf_export, PdfExportJob};
    use std::os::unix::fs::PermissionsExt;
    let root = tempfile::tempdir().unwrap();
    let renderer = root.path().join("renderer");
    std::fs::write(&renderer, "#!/bin/sh\nfor arg in \"$@\"; do\n case \"$arg\" in --print-to-pdf=*) printf complete > \"${arg#--print-to-pdf=}\";; esac\ndone\n").unwrap();
    std::fs::set_permissions(&renderer, std::fs::Permissions::from_mode(0o755)).unwrap();
    let destination = root.path().join("existing.pdf");
    std::fs::write(&destination, "existing document").unwrap();
    let request: PdfExportRequest = serde_json::from_value(serde_json::json!({
        "formCode": "0605", "paperSize": "long", "html": "<!doctype html><html></html>",
        "suggestedFilename": "success-test.pdf", "outputPath": destination
    }))
    .unwrap();
    let job = PdfExportJob::default();
    let receipt = render_pdf_export(request, renderer.to_str().unwrap(), &job).unwrap();
    assert_eq!(receipt.path, destination.to_string_lossy());
    assert_eq!(std::fs::read_to_string(destination).unwrap(), "complete");
    assert!(!job.cancel());
}

#[cfg(unix)]
#[test]
fn progress_reports_completed_native_milestones_and_save_completion() {
    use ebirforms_tauri_lib::pdf_export::{render_pdf_export_with_progress, PdfExportJob};
    use std::{os::unix::fs::PermissionsExt, sync::Mutex};
    let root = tempfile::tempdir().unwrap();
    let renderer = root.path().join("renderer");
    std::fs::write(&renderer, "#!/bin/sh\nfor arg in \"$@\"; do\n case \"$arg\" in --print-to-pdf=*) printf complete > \"${arg#--print-to-pdf=}\";; esac\ndone\n").unwrap();
    std::fs::set_permissions(&renderer, std::fs::Permissions::from_mode(0o755)).unwrap();
    let destination = root.path().join("existing.pdf");
    std::fs::write(&destination, "existing document").unwrap();
    let request: PdfExportRequest = serde_json::from_value(serde_json::json!({
        "formCode": "0605", "paperSize": "long", "html": "<!doctype html><html></html>",
        "suggestedFilename": "progress-test.pdf", "outputPath": destination
    }))
    .unwrap();
    let progress = Mutex::new(Vec::new());
    render_pdf_export_with_progress(
        request,
        renderer.to_str().unwrap(),
        &PdfExportJob::default(),
        |event| {
            if event.completed_steps == 6 {
                assert_eq!(
                    std::fs::read_to_string(&destination).unwrap(),
                    "existing document"
                );
            }
            if event.completed_steps == 7 {
                assert_eq!(std::fs::read_to_string(&destination).unwrap(), "complete");
            }
            progress
                .lock()
                .unwrap()
                .push(serde_json::to_value(event).unwrap());
        },
    )
    .unwrap();
    assert_eq!(
        *progress.lock().unwrap(),
        vec![
            serde_json::json!({"completedSteps": 5, "totalSteps": 7, "stage": "Rendering PDF"}),
            serde_json::json!({"completedSteps": 6, "totalSteps": 7, "stage": "Saving PDF"}),
            serde_json::json!({"completedSteps": 7, "totalSteps": 7, "stage": "PDF saved"}),
        ]
    );
}

#[cfg(unix)]
#[test]
fn progress_never_reports_saved_when_destination_copy_fails() {
    use ebirforms_tauri_lib::pdf_export::{render_pdf_export_with_progress, PdfExportJob};
    use std::{os::unix::fs::PermissionsExt, sync::Mutex};
    let root = tempfile::tempdir().unwrap();
    let renderer = root.path().join("renderer");
    std::fs::write(&renderer, "#!/bin/sh\nfor arg in \"$@\"; do\n case \"$arg\" in --print-to-pdf=*) printf complete > \"${arg#--print-to-pdf=}\";; esac\ndone\n").unwrap();
    std::fs::set_permissions(&renderer, std::fs::Permissions::from_mode(0o755)).unwrap();
    let request: PdfExportRequest = serde_json::from_value(serde_json::json!({
        "formCode": "0605", "paperSize": "long", "html": "<!doctype html><html></html>",
        "suggestedFilename": "copy-error-test.pdf", "outputPath": root.path().join("missing/destination.pdf")
    })).unwrap();
    let progress = Mutex::new(Vec::new());
    let result = render_pdf_export_with_progress(
        request,
        renderer.to_str().unwrap(),
        &PdfExportJob::default(),
        |event| {
            progress.lock().unwrap().push(event.completed_steps);
        },
    );
    assert!(result
        .unwrap_err()
        .message
        .starts_with("Could not save PDF:"));
    assert_eq!(*progress.lock().unwrap(), vec![5, 6]);
}
