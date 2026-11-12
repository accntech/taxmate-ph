use std::{
    fs,
    sync::{Mutex, OnceLock},
};

use aes::{
    cipher::{generic_array::GenericArray, BlockEncrypt, KeyInit},
    Aes256,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use ebirforms_tauri_lib::submission::{
    build_dispatcher_url, build_sftp_upload_plan, decrypt_dispatcher_secret,
    decrypt_native_return_copy, email_file_name, encrypt_native_return_copy,
    parse_dispatcher_response, run_submission, update_final_flag, DispatcherSettings,
    SubmissionMode, SubmissionRequest, SubmissionStatus,
};
use pbkdf2::pbkdf2_hmac;
use sha1::Sha1;

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
    let url = build_dispatcher_url(
        "https://dispatcher.example.invalid/",
        "123456789",
        "1601EQ",
        "7.9.6.0",
    );

    assert_eq!(
        url,
        "https://dispatcher.example.invalid/tinDispatcherSFTP.php?t=123456789&f=1601EQ&v=7.9.6.0"
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
fn decrypt_dispatcher_secret_requires_env_password() {
    with_submission_env(None, None, || {
        let cipher_text = dispatcher_cipher_text("sftp.example.test");

        let error = decrypt_dispatcher_secret(&cipher_text).expect_err("missing env password");

        assert!(error
            .message
            .contains("EBIRFORMS_DISPATCHER_SECRET_PASSWORD"));
    });
}

#[test]
fn decrypt_dispatcher_secret_uses_env_password() {
    with_submission_env(Some("test-dispatcher-password"), None, || {
        let cipher_text = dispatcher_cipher_text("sftp.example.test");

        assert_eq!(
            decrypt_dispatcher_secret(&cipher_text).expect("decrypted dispatcher value"),
            "sftp.example.test"
        );
    });
}

#[test]
fn native_return_copy_encryption_round_trips_compressed_xml() {
    with_submission_env(None, Some("test-return-copy-password"), || {
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
    });
}

#[test]
fn native_return_copy_encryption_requires_env_password() {
    with_submission_env(None, None, || {
        let root = tempfile::tempdir().expect("root temp dir");
        let file = root.path().join("return.xml");
        fs::write(&file, "<?xml version='1.0'?>").unwrap();

        let error = encrypt_native_return_copy(&file).expect_err("missing env password");

        assert!(error.message.contains("EBIRFORMS_RETURN_COPY_PASSWORD"));
    });
}

#[test]
fn sftp_upload_plan_decrypts_dispatcher_and_uses_legacy_remote_folder() {
    with_submission_env(Some("test-dispatcher-password"), None, || {
        let local_path = "/tmp/4215391750000-1601EQ-2026Q2#payer@example.com#.xml";
        let dispatcher = DispatcherSettings {
            mode: "2".into(),
            server: dispatcher_cipher_text("sftp.example.test"),
            ssl_port: "990".into(),
            port: "23".into(),
            username: dispatcher_cipher_text("sample-user"),
            password: dispatcher_cipher_text("sample-password"),
        };

        let plan = build_sftp_upload_plan(&dispatcher, "1601EQ", local_path.into())
            .expect("sftp upload plan");

        assert_eq!(plan.host, "sftp.example.test");
        assert_eq!(plan.port, 23);
        assert_eq!(plan.username, "sample-user");
        assert_eq!(plan.password, "sample-password");
        assert_eq!(
            plan.remote_path,
            "/1601EQ/4215391750000-1601EQ-2026Q2#payer@example.com#.xml"
        );
    });
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
fn live_submission_is_rejected_before_writing_or_networking() {
    with_submission_env(
        Some("test-dispatcher-password"),
        Some("test-return-copy-password"),
        || {
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

            let error =
                run_submission(root.path(), request).expect_err("invalid dispatcher should fail");
            assert!(error.message.contains("Live submission is disabled"));
            assert!(!root.path().join("savefile").exists());
        },
    );
}

fn with_submission_env<T>(
    dispatcher_password: Option<&str>,
    return_copy_password: Option<&str>,
    action: impl FnOnce() -> T,
) -> T {
    static ENV_LOCK: OnceLock<Mutex<()>> = OnceLock::new();
    let _guard = ENV_LOCK.get_or_init(|| Mutex::new(())).lock().unwrap();
    let previous_dispatcher = std::env::var("EBIRFORMS_DISPATCHER_SECRET_PASSWORD").ok();
    let previous_return_copy = std::env::var("EBIRFORMS_RETURN_COPY_PASSWORD").ok();

    set_or_remove_env("EBIRFORMS_DISPATCHER_SECRET_PASSWORD", dispatcher_password);
    set_or_remove_env("EBIRFORMS_RETURN_COPY_PASSWORD", return_copy_password);
    let result = action();
    set_or_remove_env(
        "EBIRFORMS_DISPATCHER_SECRET_PASSWORD",
        previous_dispatcher.as_deref(),
    );
    set_or_remove_env(
        "EBIRFORMS_RETURN_COPY_PASSWORD",
        previous_return_copy.as_deref(),
    );

    result
}

fn set_or_remove_env(name: &str, value: Option<&str>) {
    if let Some(value) = value {
        std::env::set_var(name, value);
    } else {
        std::env::remove_var(name);
    }
}

fn dispatcher_cipher_text(plain: &str) -> String {
    let salt = [1_u8; 32];
    let iv = [2_u8; 16];
    let mut key = [0_u8; 32];
    pbkdf2_hmac::<Sha1>(b"test-dispatcher-password", &salt, 100_000, &mut key);

    let mut padded = plain.as_bytes().to_vec();
    let padding_len = 16 - padded.len() % 16;
    padded.extend(std::iter::repeat(padding_len as u8).take(padding_len));

    let cipher = Aes256::new_from_slice(&key).expect("test cipher");
    let mut encrypted = Vec::with_capacity(padded.len());
    let mut previous = iv;

    for chunk in padded.chunks_exact(16) {
        let mut block = [0_u8; 16];
        block.copy_from_slice(chunk);

        for index in 0..16 {
            block[index] ^= previous[index];
        }

        let block_ref = GenericArray::from_mut_slice(&mut block);
        cipher.encrypt_block(block_ref);
        encrypted.extend_from_slice(&block);
        previous = block;
    }

    let mut payload = Vec::with_capacity(salt.len() + iv.len() + encrypted.len());
    payload.extend_from_slice(&salt);
    payload.extend_from_slice(&iv);
    payload.extend_from_slice(&encrypted);

    STANDARD.encode(payload)
}

#[test]
fn mock_mode_is_supported_and_explicitly_simulated() {
    let root = tempfile::tempdir().unwrap();
    let request: SubmissionRequest = serde_json::from_value(serde_json::json!({
        "xml": "<div>txtFinalFlag=0txtFinalFlag=</div>",
        "returnFilename": "1234567890000-0619E-202601.xml", "formCode": "0619E",
        "tin": "123456789", "email": "payer@example.com", "mode": "mock",
        "fetchDispatcher": true
    }))
    .expect("mock mode supported");
    let receipt = run_submission(root.path(), request).unwrap();
    let json = serde_json::to_value(&receipt).unwrap();
    assert_eq!(json["status"], "simulated");
    assert_eq!(receipt.final_flag, "2");
    assert!(json["reference"].as_str().unwrap().starts_with("MOCK-"));
    assert!(receipt.dispatcher_url.is_none());
    assert!(
        ebirforms_tauri_lib::return_history::load_history(root.path())
            .unwrap()
            .is_empty()
    );
}

#[test]
fn live_fetch_is_rejected_and_mock_cannot_overwrite_real_submission() {
    let root = tempfile::tempdir().unwrap();
    let filename = "1234567890000-0619E-202601.xml";
    let save_dir = root.path().join("savefile");
    fs::create_dir_all(&save_dir).unwrap();
    fs::write(save_dir.join(filename), "original-submitted-copy").unwrap();
    for mode in ["legacy_sftp", "mock"] {
        let request: SubmissionRequest = serde_json::from_value(serde_json::json!({
            "xml":"<div>txtFinalFlag=0txtFinalFlag=</div>", "returnFilename":filename,
            "formCode":"0619E", "tin":"123456789", "email":"payer@example.com",
            "mode":mode, "fetchDispatcher":true
        }))
        .unwrap();
        let result = run_submission(root.path(), request);
        if mode == "legacy_sftp" {
            assert!(result
                .unwrap_err()
                .message
                .contains("Live submission is disabled"));
        } else {
            let receipt = result.unwrap();
            assert!(std::path::Path::new(&receipt.save_path)
                .parent()
                .unwrap()
                .parent()
                .unwrap()
                .join("receipt.json")
                .exists());
        }
        assert_eq!(
            fs::read_to_string(save_dir.join(filename)).unwrap(),
            "original-submitted-copy"
        );
    }
}
