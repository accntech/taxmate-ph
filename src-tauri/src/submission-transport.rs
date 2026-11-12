use super::{SftpUploadPlan, SubmissionError};
use ssh2::{CheckResult, KnownHostFileKind, Session};
use std::{
    fs, io,
    net::{TcpStream, ToSocketAddrs},
    path::Path,
    time::{Duration, Instant},
};

const CONNECT_TIMEOUT: Duration = Duration::from_secs(8);
const IO_TIMEOUT: Duration = Duration::from_secs(30);

/// Upload only after a pre-provisioned OpenSSH key authenticates this host and port.
/// A successful result includes the server's acceptance of the remote CLOSE request.
pub(super) fn upload(
    plan: &SftpUploadPlan,
    known_hosts_path: &Path,
) -> Result<(), SubmissionError> {
    let addresses = (plan.host.as_str(), plan.port)
        .to_socket_addrs()
        .map_err(|error| {
            SubmissionError::new(format!("SFTP address resolution failed: {error}"))
        })?;
    let deadline = Instant::now() + CONNECT_TIMEOUT;
    let mut connection = None;
    let mut last_error = None;
    for address in addresses {
        let Some(remaining) = deadline.checked_duration_since(Instant::now()) else {
            break;
        };
        match TcpStream::connect_timeout(&address, remaining) {
            Ok(tcp) => {
                connection = Some(tcp);
                break;
            }
            Err(error) => last_error = Some(error),
        }
    }
    let tcp = connection.ok_or_else(|| {
        SubmissionError::new(format!(
            "SFTP connection failed: {}",
            last_error
                .map(|error| error.to_string())
                .unwrap_or_else(|| "no address connected before the timeout".into())
        ))
    })?;
    tcp.set_read_timeout(Some(IO_TIMEOUT))?;
    tcp.set_write_timeout(Some(IO_TIMEOUT))?;
    let mut session = Session::new()
        .map_err(|error| SubmissionError::new(format!("SFTP session failed: {error}")))?;
    session.set_timeout(IO_TIMEOUT.as_millis() as u32);
    session.set_tcp_stream(tcp);
    session
        .handshake()
        .map_err(|error| SubmissionError::new(format!("SFTP handshake failed: {error}")))?;
    verify_host(&session, plan, known_hosts_path)?;
    session
        .userauth_password(&plan.username, &plan.password)
        .map_err(|error| SubmissionError::new(format!("SFTP authentication failed: {error}")))?;
    if !session.authenticated() {
        return Err(SubmissionError::new("SFTP authentication was rejected."));
    }
    let sftp = session
        .sftp()
        .map_err(|error| SubmissionError::new(format!("SFTP channel failed: {error}")))?;
    let mut local = fs::File::open(&plan.local_path)?;
    let mut remote = sftp
        .create(Path::new(&plan.remote_path))
        .map_err(|error| SubmissionError::new(format!("SFTP upload create failed: {error}")))?;
    let copied = io::copy(&mut local, &mut remote)
        .map_err(|error| SubmissionError::new(format!("SFTP upload failed: {error}")));
    // Close even after a local read/write failure. Drop alone discards close errors.
    let closed = remote
        .close()
        .map_err(|error| SubmissionError::new(format!("SFTP upload close failed: {error}")));
    copied?;
    closed?;
    Ok(())
}

fn verify_host(
    session: &Session,
    plan: &SftpUploadPlan,
    path: &Path,
) -> Result<(), SubmissionError> {
    let (key, _) = session
        .host_key()
        .ok_or_else(|| SubmissionError::new("SFTP server did not present a host key."))?;
    let mut known = session.known_hosts().map_err(|error| {
        SubmissionError::new(format!("SFTP known-host verification failed: {error}"))
    })?;
    known.read_file(path, KnownHostFileKind::OpenSSH).map_err(|_| SubmissionError::new(format!(
        "SFTP server key is not trusted. Provision its verified OpenSSH key in {} before sending.", path.display()
    )))?;
    match known.check_port(&plan.host, plan.port, key) {
        CheckResult::Match => Ok(()),
        CheckResult::NotFound => Err(SubmissionError::new(format!(
            "SFTP server key is not trusted. Provision its verified OpenSSH key in {} before sending.", path.display()
        ))),
        CheckResult::Mismatch => Err(SubmissionError::new(
            "SFTP server host key changed. Refusing authentication and upload. Verify the server key before updating known hosts."
        )),
        CheckResult::Failure => Err(SubmissionError::new("SFTP server host-key verification failed.")),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{
        io::{BufRead, BufReader},
        process::{Child, Command, Stdio},
    };

    struct Server {
        child: Child,
        root: tempfile::TempDir,
        port: u16,
        key_type: String,
        key: String,
    }

    impl Drop for Server {
        fn drop(&mut self) {
            let _ = self.child.kill();
            let _ = self.child.wait();
        }
    }

    impl Server {
        fn start(fail_close: bool) -> Self {
            let python = std::env::var("EBIRFORMS_LOCAL_SFTP_TEST_PYTHON")
                .expect("Set EBIRFORMS_LOCAL_SFTP_TEST_PYTHON to Python with fixture requirements installed");
            let root = tempfile::tempdir().unwrap();
            let mut child = Command::new(python)
                .arg(concat!(
                    env!("CARGO_MANIFEST_DIR"),
                    "/tests/fixtures/submission/sftp-server.py"
                ))
                .arg(root.path().join("result.json"))
                .arg(if fail_close { "fail-close" } else { "success" })
                .stdout(Stdio::piped())
                .stderr(Stdio::null())
                .spawn()
                .unwrap();
            let mut line = String::new();
            BufReader::new(child.stdout.take().unwrap())
                .read_line(&mut line)
                .unwrap();
            let ready: serde_json::Value = serde_json::from_str(&line).expect(
                "SFTP fixture did not start; install its requirements in the selected interpreter",
            );
            Self {
                child,
                root,
                port: ready["port"].as_u64().unwrap() as u16,
                key_type: ready["key_type"].as_str().unwrap().into(),
                key: ready["key"].as_str().unwrap().into(),
            }
        }

        fn plan(&self, payload: &[u8]) -> SftpUploadPlan {
            let local_path = self.root.path().join("return.xml");
            fs::write(&local_path, payload).unwrap();
            SftpUploadPlan {
                host: "127.0.0.1".into(),
                port: self.port,
                username: "fixture-user".into(),
                password: "fixture-password".into(),
                local_path,
                remote_path: "/1601EQ/12345678900000-1601EQ-2026Q1#fixture@example.invalid#.xml"
                    .into(),
            }
        }

        fn trust(&self, key: &str) -> std::path::PathBuf {
            let file = self.root.path().join("known_hosts");
            fs::write(
                &file,
                format!("[127.0.0.1]:{} {} {}\n", self.port, self.key_type, key),
            )
            .unwrap();
            file
        }

        fn result(&mut self) -> serde_json::Value {
            self.child.wait().unwrap();
            serde_json::from_slice(&fs::read(self.root.path().join("result.json")).unwrap())
                .unwrap()
        }
    }

    #[test]
    #[ignore = "requires loopback fixture Python; see tests/fixtures/submission/sftp-tests.md"]
    fn loopback_sftp_transfers_binary_bytes_and_original_remote_path() {
        let mut server = Server::start(false);
        let payload = [0, 255, 13, 10, 128, 42];
        let plan = server.plan(&payload);
        upload(&plan, &server.trust(&server.key)).unwrap();
        let result = server.result();
        assert_eq!(result["auth_attempts"], 1);
        assert_eq!(result["uploads"][&plan.remote_path], "00ff0d0a802a");
    }

    #[test]
    #[ignore = "requires loopback fixture Python; see tests/fixtures/submission/sftp-tests.md"]
    fn loopback_sftp_refuses_unknown_key_before_password_authentication() {
        let mut server = Server::start(false);
        let known = server.trust("");
        fs::write(&known, "").unwrap();
        let error = upload(&server.plan(b"must not send"), &known).unwrap_err();
        assert!(error.message.contains("not trusted"));
        assert_eq!(server.result()["auth_attempts"], 0);
    }

    #[test]
    #[ignore = "requires loopback fixture Python; see tests/fixtures/submission/sftp-tests.md"]
    fn loopback_sftp_refuses_changed_key_before_password_authentication() {
        let mut server = Server::start(false);
        let other = Server::start(false);
        let error = upload(&server.plan(b"must not send"), &server.trust(&other.key)).unwrap_err();
        assert!(error.message.contains("changed"));
        assert_eq!(server.result()["auth_attempts"], 0);
    }

    #[test]
    #[ignore = "requires loopback fixture Python; see tests/fixtures/submission/sftp-tests.md"]
    fn loopback_sftp_close_rejection_is_a_failed_upload() {
        let mut server = Server::start(true);
        let error = upload(
            &server.plan(b"written but not finalized"),
            &server.trust(&server.key),
        )
        .unwrap_err();
        assert!(error.message.contains("close"));
        assert_eq!(server.result()["auth_attempts"], 1);
    }

    #[test]
    #[ignore = "requires loopback fixture Python; see tests/fixtures/submission/sftp-tests.md"]
    fn loopback_submission_pipeline_keeps_raw_rdo_and_tracks_only_completed_uploads() {
        let _environment = super::super::SUBMISSION_TEST_ENV
            .lock()
            .unwrap_or_else(|error| error.into_inner());
        use super::super::{
            decrypt_native_return_copy, run_submission, DispatcherSettings, SubmissionMode,
            SubmissionRequest, SubmissionStatus,
        };
        use aes::{
            cipher::{generic_array::GenericArray, BlockEncrypt, KeyInit},
            Aes256,
        };
        use base64::{engine::general_purpose::STANDARD, Engine};

        const DISPATCH_PASS: &str = "public synthetic dispatcher test";
        const RETURN_PASS: &str = "public synthetic compatibility test";
        struct RestoreEnvironment([(&'static str, Option<std::ffi::OsString>); 2]);
        impl Drop for RestoreEnvironment {
            fn drop(&mut self) {
                for (name, value) in &self.0 {
                    match value {
                        Some(value) => std::env::set_var(name, value),
                        None => std::env::remove_var(name),
                    }
                }
            }
        }
        let names = [
            "EBIRFORMS_DISPATCHER_SECRET_PASSWORD",
            "EBIRFORMS_RETURN_COPY_PASSWORD",
        ];
        let _restore = RestoreEnvironment(names.map(|name| (name, std::env::var_os(name))));
        std::env::set_var(names[0], DISPATCH_PASS);
        std::env::set_var(names[1], RETURN_PASS);

        // A synthetic instance of the independently verified dispatcher envelope.
        let encrypt_dispatcher = |plain: &str| {
            let salt = [7_u8; 32];
            let iv = [9_u8; 16];
            let mut key = [0_u8; 32];
            pbkdf2::pbkdf2_hmac::<sha1::Sha1>(DISPATCH_PASS.as_bytes(), &salt, 100_000, &mut key);
            let cipher = Aes256::new_from_slice(&key).unwrap();
            let mut padded = plain.as_bytes().to_vec();
            let padding = 16 - padded.len() % 16;
            padded.extend(std::iter::repeat_n(padding as u8, padding));
            let mut envelope = salt.to_vec();
            envelope.extend_from_slice(&iv);
            let mut previous = iv;
            for chunk in padded.chunks_exact(16) {
                let mut block = [0_u8; 16];
                for (index, byte) in chunk.iter().enumerate() {
                    block[index] = byte ^ previous[index];
                }
                cipher.encrypt_block(GenericArray::from_mut_slice(&mut block));
                envelope.extend_from_slice(&block);
                previous = block;
            }
            STANDARD.encode(envelope)
        };
        let escaped_xml = concat!(
            "<?xml version='1.0'?>",
            "<div>frm1601EQ:txtTaxpayerName=ACME &amp; COfrm1601EQ:txtTaxpayerName=</div>",
            "<div>frm1601EQ:txtYear=2026frm1601EQ:txtYear=</div>",
            "<div>frm1601EQ:optQuarter=Q1frm1601EQ:optQuarter=</div>",
            "<div>txtFinalFlag=0txtFinalFlag=</div>All Rights Reserved BIR 2012.0"
        );
        let raw_rdo = concat!(
            "<?xml version='1.0'?> ",
            "<div>frm1601EQ:txtTaxpayerName=ACME & COfrm1601EQ:txtTaxpayerName=</div> ",
            "<div>frm1601EQ:txtYear=2026frm1601EQ:txtYear=</div> ",
            "<div>frm1601EQ:optQuarter:1=truefrm1601EQ:optQuarter:1=</div> ",
            "<div>txtFinalFlag=0txtFinalFlag=</div> All Rights Reserved BIR 2012.0"
        );
        let expected_rdo =
            raw_rdo.replace("txtFinalFlag=0txtFinalFlag=", "txtFinalFlag=2txtFinalFlag=");
        for fail_close in [false, true] {
            let mut server = Server::start(fail_close);
            let settings = server.root.path().join("settings");
            fs::create_dir_all(&settings).unwrap();
            fs::copy(server.trust(&server.key), settings.join("bir-known-hosts")).unwrap();
            let request = SubmissionRequest {
                xml: escaped_xml.into(),
                rdo_xml: Some(raw_rdo.into()),
                return_filename: "12345678900000-1601EQ-2026Q1.xml".into(),
                form_code: "1601EQ".into(),
                tin: "123456789".into(),
                email: "fixture@example.invalid".into(),
                mode: SubmissionMode::LegacySftp,
                dispatcher: Some(DispatcherSettings {
                    mode: "2".into(),
                    server: encrypt_dispatcher("127.0.0.1"),
                    ssl_port: String::new(),
                    port: server.port.to_string(),
                    username: encrypt_dispatcher("fixture-user"),
                    password: encrypt_dispatcher("fixture-password"),
                }),
                fetch_dispatcher: false,
            };
            let receipt = run_submission(server.root.path(), request).unwrap();
            let result = server.result();
            assert_eq!(result["auth_attempts"], 1);
            let remote_path = "/1601EQ/12345678900000-1601EQ-2026Q1#fixture@example.invalid#.xml";
            let hex = result["uploads"][remote_path].as_str().unwrap();
            let uploaded = (0..hex.len())
                .step_by(2)
                .map(|index| u8::from_str_radix(&hex[index..index + 2], 16).unwrap())
                .collect::<Vec<_>>();
            assert_eq!(
                decrypt_native_return_copy(&uploaded).unwrap(),
                expected_rdo.as_bytes()
            );
            assert_eq!(fs::read(&receipt.send_path).unwrap(), uploaded);
            let saved = fs::read_to_string(&receipt.save_path).unwrap();
            assert!(saved.contains("ACME &amp; CO"));
            assert!(!saved.contains("ACME & CO"));
            let history = crate::return_history::load_history(server.root.path()).unwrap();
            if fail_close {
                assert_eq!(receipt.status, SubmissionStatus::Failed);
                assert!(
                    receipt.message.contains("close"),
                    "failure receipt must expose the failed upload stage"
                );
                assert_eq!(receipt.exit_code, Some(1));
                assert_eq!(receipt.final_flag, "2");
                assert!(saved.contains("txtFinalFlag=2txtFinalFlag="));
                assert!(history.is_empty());
            } else {
                assert_eq!(receipt.status, SubmissionStatus::Submitted);
                assert_eq!(receipt.exit_code, Some(0));
                assert_eq!(receipt.final_flag, "1");
                assert!(saved.contains("txtFinalFlag=1txtFinalFlag="));
                assert!(receipt
                    .message
                    .contains("BIR acknowledgment is still required"));
                assert_eq!(history.len(), 1);
                assert_eq!(history[0].taxpayer_name, "ACME & CO");
                assert_eq!(history[0].return_period, "2026Q1");
            }
        }
    }
}
