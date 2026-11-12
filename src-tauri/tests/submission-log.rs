use chrono::{DateTime, Local};
use ebirforms_tauri_lib::submission::{
    read_submission_log_at, run_submission, SubmissionMode, SubmissionRequest,
};
use std::fs;

#[test]
fn every_submission_log_entry_has_a_readable_local_datetime_with_offset() {
    let root = tempfile::tempdir().unwrap();
    let before = Local::now().timestamp();
    run_submission(
        root.path(),
        SubmissionRequest {
            xml: "<div>txtFinalFlag=0txtFinalFlag=</div>".into(),
            return_filename: "1234567890000-1601EQ-2026Q1.xml".into(),
            form_code: "1601EQ".into(),
            tin: "123456789".into(),
            email: "payer@example.com".into(),
            mode: SubmissionMode::DryRun,
            dispatcher: None,
            fetch_dispatcher: false,
        },
    )
    .unwrap();
    let after = Local::now().timestamp();
    let log = read_submission_log_at(root.path()).unwrap();
    let entries: Vec<_> = log.content.lines().collect();
    assert_eq!(entries.len(), 4);
    for entry in entries {
        let (timestamp, message) = entry.split_once("] ").expect("bracketed datetime prefix");
        let timestamp = timestamp
            .strip_prefix('[')
            .expect("opening datetime bracket");
        let parsed = DateTime::parse_from_rfc3339(timestamp).expect("valid RFC3339 datetime");
        assert!(parsed.timestamp() >= before && parsed.timestamp() <= after);
        assert_eq!(parsed.offset(), Local::now().offset());
        assert!(!message.is_empty());
        assert!(
            !timestamp.ends_with('Z'),
            "local time includes explicit UTC offset"
        );
    }
}

#[test]
fn missing_log_returns_empty_content_without_creating_files() {
    let root = tempfile::tempdir().unwrap();
    let log = read_submission_log_at(root.path()).unwrap();
    assert_eq!(
        log.path,
        root.path().join("logfile/submission.log").to_string_lossy()
    );
    assert_eq!(log.content, "");
    assert!(!log.truncated);
    assert!(!root.path().join("logfile").exists());
}

#[test]
fn existing_log_preserves_content_and_returns_its_path() {
    let root = tempfile::tempdir().unwrap();
    fs::create_dir(root.path().join("logfile")).unwrap();
    let path = root.path().join("logfile/submission.log");
    let content = "ts=1 submission_start\nts=2 native_sftp_complete\n";
    fs::write(&path, content).unwrap();
    let log = read_submission_log_at(root.path()).unwrap();
    assert_eq!(log.path, path.to_string_lossy());
    assert_eq!(log.content, content);
    assert!(!log.truncated);
}

#[test]
fn large_log_returns_only_a_bounded_utf8_tail() {
    let root = tempfile::tempdir().unwrap();
    fs::create_dir(root.path().join("logfile")).unwrap();
    let path = root.path().join("logfile/submission.log");
    // Cut in the middle of a multibyte character when reading the last 128 KiB.
    let content = format!("{}é{}", "x".repeat(128 * 1024), "y".repeat(128 * 1024 - 1));
    fs::write(path, content).unwrap();
    let log = read_submission_log_at(root.path()).unwrap();
    assert!(log.truncated);
    assert!(log.content.len() <= 128 * 1024);
    assert!(!log.content.contains('\u{fffd}'));
    assert_eq!(log.content, "y".repeat(128 * 1024 - 1));
}

#[test]
fn filesystem_errors_are_reported_instead_of_an_empty_log() {
    let root = tempfile::tempdir().unwrap();
    fs::write(root.path().join("logfile"), "not a directory").unwrap();
    assert!(read_submission_log_at(root.path()).is_err());
}

#[test]
fn exact_limit_is_not_truncated() {
    let root = tempfile::tempdir().unwrap();
    fs::create_dir(root.path().join("logfile")).unwrap();
    let content = "x".repeat(128 * 1024);
    fs::write(root.path().join("logfile/submission.log"), &content).unwrap();
    let log = read_submission_log_at(root.path()).unwrap();
    assert_eq!(log.content, content);
    assert!(!log.truncated);
}

#[test]
fn incomplete_trailing_utf8_character_is_omitted() {
    let root = tempfile::tempdir().unwrap();
    fs::create_dir(root.path().join("logfile")).unwrap();
    fs::write(
        root.path().join("logfile/submission.log"),
        b"stage\n\xe2\x82",
    )
    .unwrap();
    let log = read_submission_log_at(root.path()).unwrap();
    assert_eq!(log.content, "stage\n");
}
