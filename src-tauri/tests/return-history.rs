use ebirforms_tauri_lib::return_history::{load_history, record_submission};
use std::fs;

fn xml(flag: &str) -> String {
    [
        ("txtFinalFlag", flag),
        ("frm1601EQ:txtYear", "2026"),
        ("frm1601EQ:optQuarter", "Q1"),
        ("frm1601EQ:txtTaxpayerName", "A &amp; B"),
        ("frm1601EQ:txtTotalAmountDue", "1,234.50"),
        ("frm1601EQ:optAmendedReturn", "Y"),
    ]
    .iter()
    .map(|(k, v)| format!("<div>{k}={v}{k}=</div>"))
    .collect()
}

#[test]
fn repeated_submissions_survive_reload_with_distinct_ids() {
    let root = tempfile::tempdir().unwrap();
    let path = root.path().join("savefile/1234567890000-1601EQ-2026Q1.xml");
    record_submission(root.path(), &path, &xml("1"), "1601EQ", "1234567890000").unwrap();
    record_submission(root.path(), &path, &xml("1"), "1601EQ", "1234567890000").unwrap();
    let rows = load_history(root.path()).unwrap();
    assert_eq!(rows.len(), 2);
    assert_ne!(rows[0].id, rows[1].id);
    assert_eq!(rows[0].taxpayer_name, "A & B");
    assert_eq!(rows[0].return_period, "2026Q1");
    assert_eq!(rows[0].amount_due, "1,234.50");
    assert!(rows[0].amended);
    assert!(rows[0].submitted_at > 0);
}

#[test]
fn imports_only_submitted_legacy_returns_once_and_retains_them_after_overwrite() {
    let root = tempfile::tempdir().unwrap();
    let dir = root.path().join("savefile");
    fs::create_dir_all(&dir).unwrap();
    let path = dir.join("1234567890000-1601EQ-2026Q1.xml");
    fs::write(&path, xml("1")).unwrap();
    fs::write(dir.join("1234567890000-1601EQ-2026Q2.xml"), xml("2")).unwrap();
    assert_eq!(load_history(root.path()).unwrap().len(), 1);
    assert_eq!(load_history(root.path()).unwrap().len(), 1);
    fs::write(&path, xml("0")).unwrap();
    assert_eq!(load_history(root.path()).unwrap().len(), 1);
}

#[test]
fn rejects_non_submitted_records() {
    let root = tempfile::tempdir().unwrap();
    assert!(record_submission(
        root.path(),
        &root.path().join("draft.xml"),
        &xml("2"),
        "1601EQ",
        "123"
    )
    .is_err());
    assert!(load_history(root.path()).unwrap().is_empty());
}

#[test]
fn dry_run_preserves_prior_submission_without_adding_history() {
    use ebirforms_tauri_lib::submission::{run_submission, SubmissionMode, SubmissionRequest};
    let root = tempfile::tempdir().unwrap();
    let dir = root.path().join("savefile");
    fs::create_dir_all(&dir).unwrap();
    let filename = "1234567890000-1601EQ-2026Q1.xml";
    fs::write(dir.join(filename), xml("1")).unwrap();
    run_submission(
        root.path(),
        SubmissionRequest {
            xml: xml("0"),
            rdo_xml: None,
            return_filename: filename.into(),
            form_code: "1601EQ".into(),
            tin: "123456789".into(),
            email: "test@example.com".into(),
            mode: SubmissionMode::DryRun,
            dispatcher: None,
            fetch_dispatcher: false,
        },
    )
    .unwrap();
    assert_eq!(load_history(root.path()).unwrap().len(), 1);
    assert!(fs::read_to_string(dir.join(filename))
        .unwrap()
        .contains("txtFinalFlag=2"));
}

#[test]
fn imports_actual_legacy_radio_fields_and_amount_due() {
    let root = tempfile::tempdir().unwrap();
    let dir = root.path().join("savefile");
    fs::create_dir_all(&dir).unwrap();
    let xml: String = [
        ("txtFinalFlag", "1"),
        ("frm1601EQ:txtYear", "2025"),
        ("frm1601EQ:optQuarter:3", "true"),
        ("frm1601EQ:optAmend:Y", "true"),
        ("frm1601EQ:txtTax30", "1,234.50"),
        ("frm1601EQ:txtTaxpayerName", "Legacy Company"),
    ]
    .iter()
    .map(|(k, v)| format!("<div>{k}={v}{k}=</div>"))
    .collect();
    fs::write(dir.join("1234567890000-1601EQ-2025Q3V1.xml"), xml).unwrap();
    let rows = load_history(root.path()).unwrap();
    assert_eq!(rows[0].return_period, "2025Q3");
    assert_eq!(rows[0].amount_due, "1,234.50");
    assert!(rows[0].amended);
    assert_eq!(rows[0].taxpayer_name, "Legacy Company");
}

#[test]
fn new_submissions_keep_branch_code_even_when_dispatcher_uses_nine_digit_tin() {
    let root = tempfile::tempdir().unwrap();
    let path = root.path().join("savefile/1234567890123-1601EQ-2026Q1.xml");
    record_submission(root.path(), &path, &xml("1"), "1601EQ", "123456789").unwrap();
    assert_eq!(load_history(root.path()).unwrap()[0].tin, "1234567890123");
}
