use std::fs;

use ebirforms_tauri_lib::submission::{
    build_dispatcher_url, build_sftp_upload_plan, decrypt_dispatcher_secret,
    decrypt_native_return_copy, email_file_name, encrypt_native_return_copy,
    parse_dispatcher_response, run_submission, update_final_flag, DispatcherSettings,
    SubmissionMode, SubmissionRequest, SubmissionStatus,
};

#[test]
fn email_file_name_matches_legacy_hash_format() {
    let file_name = email_file_name("1234567890000-1601EQ-2026Q1.xml", "payer@example.com")
        .expect("valid email file name");

    assert_eq!(
        file_name,
        "1234567890000-1601EQ-2026Q1#payer@example.com#.xml"
    );
}

#[test]
fn email_file_name_rejects_path_like_values() {
    assert!(email_file_name("../return.xml", "payer@example.com").is_err());
    assert!(email_file_name("return.xml", "bad#payer@example.com").is_err());
}

#[test]
fn update_final_flag_rewrites_existing_legacy_record() {
    let xml = "<?xml version='1.0'?><div>txtFinalFlag=0txtFinalFlag=</div><div>x=1x=</div>";

    assert_eq!(
        update_final_flag(xml, "2"),
        "<?xml version='1.0'?><div>txtFinalFlag=2txtFinalFlag=</div><div>x=1x=</div>"
    );
}

#[test]
fn build_dispatcher_url_uses_legacy_query_shape() {
    let url = build_dispatcher_url("http://birgovph.com/", "123456789", "1601EQ", "7.9.6.0");

    assert_eq!(
        url,
        "http://birgovph.com/tinDispatcherSFTP.php?t=123456789&f=1601EQ&v=7.9.6.0"
    );
}

#[test]
fn parse_dispatcher_response_maps_legacy_keys() {
    let settings = parse_dispatcher_response(
		r#"{"mode":"2","server":"sftp.example.test","SSLPort":"990","port":"22","username":"u","password":"p"}"#,
	)
	.expect("dispatcher json");

    assert_eq!(
        settings,
        DispatcherSettings {
            mode: "2".into(),
            server: "sftp.example.test".into(),
            ssl_port: "990".into(),
            port: "22".into(),
            username: "u".into(),
            password: "p".into()
        }
    );
}

#[test]
fn parse_dispatcher_response_accepts_legacy_single_quoted_object() {
    let response = concat!(
        "{'mode':'2', 'server':'sftp.example.test', 'SSLPort':'990', ",
        "'port':'23', 'username':'u', 'password':'p'} "
    );
    let settings = parse_dispatcher_response(response).expect("legacy dispatcher object");

    assert_eq!(
        settings,
        DispatcherSettings {
            mode: "2".into(),
            server: "sftp.example.test".into(),
            ssl_port: "990".into(),
            port: "23".into(),
            username: "u".into(),
            password: "p".into()
        }
    );
}

#[test]
fn decrypt_dispatcher_secret_matches_legacy_ebfsftp() {
    let cipher_text =
        "AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICpfxuKBDDJkXbDSZOg59i6yINTItcWddk8Xo9Y4loPvs=";

    assert_eq!(
        decrypt_dispatcher_secret(cipher_text).expect("decrypted dispatcher value"),
        "sftp.example.test"
    );
}

#[test]
fn native_return_copy_encryption_round_trips_compressed_xml() {
    let root = tempfile::tempdir().expect("root temp dir");
    let file = root.path().join("return.xml");
    let xml = "<?xml version='1.0'?><div>txtFinalFlag=2txtFinalFlag=</div>";
    fs::write(&file, xml).unwrap();

    encrypt_native_return_copy(&file).expect("encrypt return copy");
    let encrypted = fs::read(&file).expect("encrypted file");

    assert_ne!(encrypted, xml.as_bytes());
    assert_eq!(
        decrypt_native_return_copy(&encrypted).expect("decrypt return copy"),
        xml.as_bytes()
    );
}

#[test]
fn sftp_upload_plan_decrypts_dispatcher_and_uses_legacy_remote_folder() {
    let local_path = "/tmp/4215391750000-1601EQ-2026Q2#payer@example.com#.xml";
    let dispatcher = DispatcherSettings {
        mode: "2".into(),
        server: "AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAgICAgICAgICAgICAgICpfxuKBDDJkXbDSZOg59i6yINTItcWddk8Xo9Y4loPvs="
            .into(),
        ssl_port: "990".into(),
        port: "23".into(),
        username: "AwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMEBAQEBAQEBAQEBAQEBAQEUwWPq6ChnjBjKitWTgFgrA=="
            .into(),
        password: "BQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUGBgYGBgYGBgYGBgYGBgYGdo/Tl/0ZvE1Tk/KIX8vDjA=="
            .into(),
    };

    let plan =
        build_sftp_upload_plan(&dispatcher, "1601EQ", local_path.into()).expect("sftp upload plan");

    assert_eq!(plan.host, "sftp.example.test");
    assert_eq!(plan.port, 23);
    assert_eq!(plan.username, "sample-user");
    assert_eq!(plan.password, "sample-password");
    assert_eq!(
        plan.remote_path,
        "/1601EQ/4215391750000-1601EQ-2026Q2#payer@example.com#.xml"
    );
}

#[test]
fn dry_run_writes_savefile_and_email_copy_without_uploading() {
    let root = tempfile::tempdir().expect("temp dir");
    let request = SubmissionRequest {
        xml: "<?xml version='1.0'?><div>txtFinalFlag=0txtFinalFlag=</div>".into(),
        return_filename: "1234567890000-1601EQ-2026Q1.xml".into(),
        form_code: "1601EQ".into(),
        tin: "123456789".into(),
        email: "payer@example.com".into(),
        mode: SubmissionMode::DryRun,
        dispatcher: None,
        fetch_dispatcher: false,
    };

    let result = run_submission(root.path(), request).expect("dry run submission");

    assert_eq!(result.status, SubmissionStatus::Drafted);
    assert_eq!(result.exit_code, None);
    assert!(result
        .save_path
        .ends_with("savefile/1234567890000-1601EQ-2026Q1.xml"));
    assert!(result
        .send_path
        .ends_with("IAF_RDO_Copy/1234567890000-1601EQ-2026Q1#payer@example.com#.xml"));
    assert!(fs::read_to_string(result.save_path)
        .unwrap()
        .contains("txtFinalFlag=2"));
    assert!(fs::read_to_string(result.send_path)
        .unwrap()
        .contains("txtFinalFlag=2"));
}

#[test]
fn invalid_dispatcher_secret_returns_log_path_and_writes_error_log() {
    let root = tempfile::tempdir().expect("root temp dir");
    let request = SubmissionRequest {
        xml: "<?xml version='1.0'?><div>txtFinalFlag=0txtFinalFlag=</div>".into(),
        return_filename: "1234567890000-1601EQ-2026Q1.xml".into(),
        form_code: "1601EQ".into(),
        tin: "123456789".into(),
        email: "payer@example.com".into(),
        mode: SubmissionMode::LegacySftp,
        dispatcher: Some(DispatcherSettings {
            mode: "2".into(),
            server: "encrypted-host".into(),
            ssl_port: "".into(),
            port: "22".into(),
            username: "encrypted-user".into(),
            password: "encrypted-pass".into(),
        }),
        fetch_dispatcher: false,
    };

    let error = run_submission(root.path(), request).expect_err("invalid dispatcher should fail");
    let log_path = error.log_path.expect("log path");
    let log = fs::read_to_string(log_path).expect("submission log");

    assert!(error.message.contains("Dispatcher secret is not base64"));
    assert!(log.contains("submission_start"));
    assert!(log.contains("native_encrypt_complete"));
    assert!(log.contains("native_sftp_plan_error"));
}
