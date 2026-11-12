use std::{
    env, fs,
    fs::OpenOptions,
    io,
    io::{Read, Write},
    net::TcpStream,
    path::{Path, PathBuf},
    time::{Duration, SystemTime, UNIX_EPOCH},
};

use aes::{
    cipher::{generic_array::GenericArray, BlockDecrypt, BlockEncrypt, KeyInit},
    Aes256,
};
use base64::{engine::general_purpose::STANDARD, Engine};
use flate2::{read::ZlibDecoder, write::ZlibEncoder, Compression};
use pbkdf2::pbkdf2_hmac;
use serde::{Deserialize, Serialize};
use sha1::Sha1;
use sha2::{Digest, Sha256};
use ssh2::Session;
use tauri::Manager;

const CURRENT_VERSION: &str = "7.9.6.0";
const PRIMARY_DISPATCHER_BASE: &str = "http://birgovph.com/";
const BACKUP_DISPATCHER_BASE: &str = "http://ws1.birgovph.com/";
const DISPATCHER_SECRET_PASSWORD_ENV: &str = "EBIRFORMS_DISPATCHER_SECRET_PASSWORD";
const RETURN_COPY_PASSWORD_ENV: &str = "EBIRFORMS_RETURN_COPY_PASSWORD";

#[derive(Clone, Debug, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum SubmissionMode {
    DryRun,
    LegacySftp,
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmissionRequest {
    pub xml: String,
    pub return_filename: String,
    pub form_code: String,
    pub tin: String,
    pub email: String,
    pub mode: SubmissionMode,
    pub dispatcher: Option<DispatcherSettings>,
    pub fetch_dispatcher: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
pub struct DispatcherSettings {
    pub mode: String,
    #[serde(alias = "server")]
    pub server: String,
    #[serde(rename = "sslPort", alias = "SSLPort")]
    pub ssl_port: String,
    pub port: String,
    #[serde(alias = "username")]
    pub username: String,
    #[serde(alias = "password")]
    pub password: String,
}

#[derive(Clone, Debug, Serialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum SubmissionStatus {
    Drafted,
    Submitted,
    Failed,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmissionReceipt {
    pub status: SubmissionStatus,
    pub final_flag: String,
    pub save_path: String,
    pub send_path: String,
    pub dispatcher_url: Option<String>,
    pub exit_code: Option<i32>,
    pub log_path: Option<String>,
    pub message: String,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SftpUploadPlan {
    pub host: String,
    pub port: u16,
    pub username: String,
    pub password: String,
    pub local_path: PathBuf,
    pub remote_path: String,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmissionError {
    pub message: String,
    pub log_path: Option<String>,
}

impl From<io::Error> for SubmissionError {
    fn from(error: io::Error) -> Self {
        Self {
            message: error.to_string(),
            log_path: None,
        }
    }
}

#[tauri::command]
pub async fn submit_return(
    app: tauri::AppHandle,
    request: SubmissionRequest,
) -> Result<SubmissionReceipt, SubmissionError> {
    let root = app
        .path()
        .app_data_dir()
        .map_err(|error| SubmissionError::new(format!("Could not resolve app data: {error}")))?;

    if request.mode == SubmissionMode::LegacySftp {
        // Load deployment secrets at the app boundary; local preparation and
        // the submission engine never read credentials from a developer's .env.
        let _ = dotenvy::dotenv();
    }

    tauri::async_runtime::spawn_blocking(move || run_submission(&root, request))
        .await
        .map_err(|error| SubmissionError::new(format!("Submission task failed: {error}")))?
}

pub fn run_submission(
    root: &Path,
    request: SubmissionRequest,
) -> Result<SubmissionReceipt, SubmissionError> {
    if request.mode == SubmissionMode::LegacySftp && request.form_code != "1601EQ" {
        return Err(SubmissionError::new(
            "Live submission is only available for Form 1601EQ.",
        ));
    }
    let logger = SubmissionLogger::new(root)?;
    logger.log(format!(
        "submission_start mode={:?} form={} tin={} return_filename={}",
        request.mode, request.form_code, request.tin, request.return_filename
    ));

    validate_request(&request)?;

    let save_dir = root.join("savefile");
    let rdo_dir = root.join("IAF_RDO_Copy");
    fs::create_dir_all(&save_dir)?;
    fs::create_dir_all(&rdo_dir)?;

    let email_name = email_file_name(&request.return_filename, &request.email)?;
    let save_path = save_dir.join(&request.return_filename);
    let send_path = rdo_dir.join(email_name);
    let prepared_xml = update_final_flag(&request.xml, "2");

    // Preserve any legacy submitted copy before a draft or resend overwrites it.
    crate::return_history::load_history(root)?;
    fs::write(&save_path, &prepared_xml)?;
    fs::write(&send_path, &prepared_xml)?;
    logger.log(format!(
        "files_prepared save_path={} send_path={}",
        path_to_string(&save_path),
        path_to_string(&send_path)
    ));

    if request.mode == SubmissionMode::DryRun {
        logger.log("dry_run_complete");
        return Ok(SubmissionReceipt {
            status: SubmissionStatus::Drafted,
            final_flag: "2".into(),
            save_path: path_to_string(&save_path),
            send_path: path_to_string(&send_path),
            dispatcher_url: None,
            exit_code: None,
            log_path: Some(logger.path_string()),
            message: "Dry run prepared the savefile and email-named RDO copy without upload."
                .into(),
        });
    }

    let dispatcher_url = build_dispatcher_url(
        PRIMARY_DISPATCHER_BASE,
        &request.tin,
        &request.form_code,
        CURRENT_VERSION,
    );
    let dispatcher = resolve_dispatcher(&request, &dispatcher_url, &logger)?;
    encrypt_native_return_copy(&send_path).map_err(|error| {
        logger.log(format!("native_encrypt_error {}", error.message));
        SubmissionError::with_log_path(error.message, &logger)
    })?;
    logger.log(format!(
        "native_encrypt_complete file={}",
        path_to_string(&send_path)
    ));

    let plan = build_sftp_upload_plan(&dispatcher, &request.form_code, send_path.clone()).map_err(
        |error| {
            logger.log(format!("native_sftp_plan_error {}", error.message));
            SubmissionError::with_log_path(error.message, &logger)
        },
    )?;
    let exit_code = run_native_sftp(&plan, &logger);
    let submitted = exit_code == 0;
    let final_flag = if submitted { "1" } else { "2" };
    let final_xml = update_final_flag(&prepared_xml, final_flag);

    // The remote upload has already succeeded: local history errors must not invite a resend.
    let mut history_warning = if submitted {
        crate::return_history::record_submission(
            root,
            &save_path,
            &final_xml,
            &request.form_code,
            &request.tin,
        )
        .err()
        .map(|error| format!(" Submission succeeded, but history could not be saved: {error}"))
    } else {
        None
    };
    if let Err(error) = fs::write(&save_path, &final_xml) {
        if !submitted {
            return Err(error.into());
        }
        let warning = format!(
            " Submission succeeded, but the local return copy could not be updated: {error}"
        );
        history_warning
            .get_or_insert_with(String::new)
            .push_str(&warning);
    }
    if let Some(warning) = &history_warning {
        logger.log(warning);
    }
    logger.log(format!(
        "submission_complete status={} final_flag={}",
        if submitted { "submitted" } else { "failed" },
        final_flag
    ));

    Ok(SubmissionReceipt {
        status: if submitted {
            SubmissionStatus::Submitted
        } else {
            SubmissionStatus::Failed
        },
        final_flag: final_flag.into(),
        save_path: path_to_string(&save_path),
        send_path: path_to_string(&send_path),
        dispatcher_url: Some(dispatcher_url),
        exit_code: Some(exit_code),
        log_path: Some(logger.path_string()),
        message: if submitted {
            format!(
                "Native SFTP upload reported a successful submission.{}",
                history_warning.unwrap_or_default()
            )
        } else {
            "Native SFTP upload did not report success.".into()
        },
    })
}

pub fn email_file_name(file_name: &str, email: &str) -> Result<String, SubmissionError> {
    if file_name.contains('/') || file_name.contains('\\') || file_name.contains("..") {
        return Err(SubmissionError::new(
            "Return filename must not include a path.",
        ));
    }

    if email.trim().is_empty() || email.contains('#') || email.contains('/') || email.contains('\\')
    {
        return Err(SubmissionError::new(
            "Email address is required and cannot contain path characters.",
        ));
    }

    let Some(stem) = file_name.strip_suffix(".xml") else {
        return Err(SubmissionError::new("Return filename must end with .xml."));
    };

    Ok(format!("{stem}#{email}#.xml"))
}

pub fn update_final_flag(xml: &str, flag: &str) -> String {
    if !xml.contains("txtFinalFlag=") {
        return xml.to_string();
    }

    let mut parts = xml.splitn(3, "txtFinalFlag=");
    let Some(before) = parts.next() else {
        return xml.to_string();
    };
    let Some(_) = parts.next() else {
        return xml.to_string();
    };
    let Some(after) = parts.next() else {
        return xml.to_string();
    };

    format!("{before}txtFinalFlag={flag}txtFinalFlag={after}")
}

pub fn build_dispatcher_url(base: &str, tin: &str, form_code: &str, version: &str) -> String {
    format!(
        "{}tinDispatcherSFTP.php?t={}&f={}&v={}",
        base.trim_end_matches('/').to_string() + "/",
        tin,
        form_code,
        version
    )
}

pub fn parse_dispatcher_response(response: &str) -> Result<DispatcherSettings, SubmissionError> {
    serde_json::from_str(response)
        .or_else(|_| {
            let legacy_json = legacy_js_object_to_json(response)
                .ok_or_else(|| serde_json::Error::io(io::Error::other("not a legacy object")))?;

            serde_json::from_str(&legacy_json)
        })
        .map_err(|error| SubmissionError::new(format!("Invalid dispatcher response: {error}")))
}

fn legacy_js_object_to_json(response: &str) -> Option<String> {
    let trimmed = response.trim();

    if !trimmed.starts_with('{') || !trimmed.ends_with('}') || !trimmed.contains('\'') {
        return None;
    }

    Some(trimmed.replace('\'', "\""))
}

fn validate_request(request: &SubmissionRequest) -> Result<(), SubmissionError> {
    if request.xml.trim().is_empty() {
        return Err(SubmissionError::new("Generated XML is required."));
    }

    if request.return_filename.trim().is_empty() {
        return Err(SubmissionError::new("Return filename is required."));
    }

    if request.form_code.trim().is_empty() {
        return Err(SubmissionError::new("Form code is required."));
    }

    if request.tin.trim().is_empty() {
        return Err(SubmissionError::new("TIN is required."));
    }

    Ok(())
}

fn resolve_dispatcher(
    request: &SubmissionRequest,
    primary_url: &str,
    logger: &SubmissionLogger,
) -> Result<DispatcherSettings, SubmissionError> {
    if !request.fetch_dispatcher {
        if let Some(dispatcher) = &request.dispatcher {
            logger.log(format!(
                "dispatcher_source=manual mode={} server_present={} port={}",
                dispatcher.mode,
                !dispatcher.server.is_empty(),
                dispatcher.port
            ));
            return Ok(dispatcher.clone());
        }

        let message = "Dispatcher settings are required unless dispatcher fetching is enabled.";
        logger.log(format!("dispatcher_missing {message}"));
        return Err(SubmissionError::with_log_path(message, logger));
    }

    logger.log(format!("dispatcher_fetch_primary url={primary_url}"));
    fetch_dispatcher(primary_url).or_else(|primary_error| {
        logger.log(format!(
            "dispatcher_fetch_primary_error {}",
            primary_error.message
        ));
        let backup_url = build_dispatcher_url(
            BACKUP_DISPATCHER_BASE,
            &request.tin,
            &request.form_code,
            CURRENT_VERSION,
        );
        logger.log(format!("dispatcher_fetch_backup url={backup_url}"));

        fetch_dispatcher(&backup_url).map_err(|backup_error| {
            logger.log(format!(
                "dispatcher_fetch_backup_error {}",
                backup_error.message
            ));
            SubmissionError::with_log_path(backup_error.message, logger)
        })
    })
}

fn fetch_dispatcher(url: &str) -> Result<DispatcherSettings, SubmissionError> {
    let response = ureq::AgentBuilder::new()
        .timeout(Duration::from_secs(8))
        .build()
        .get(url)
        .call()
        .map_err(|error| SubmissionError::new(format!("Dispatcher request failed: {error}")))?
        .into_string()
        .map_err(|error| SubmissionError::new(format!("Dispatcher response failed: {error}")))?;

    parse_dispatcher_response(&response)
}

pub fn decrypt_dispatcher_secret(cipher_text: &str) -> Result<String, SubmissionError> {
    let payload = STANDARD.decode(cipher_text.trim()).map_err(|error| {
        SubmissionError::new(format!("Dispatcher secret is not base64: {error}"))
    })?;

    if payload.len() <= 48 || (payload.len() - 48) % 16 != 0 {
        return Err(SubmissionError::new(
            "Dispatcher secret has an invalid encrypted shape.",
        ));
    }

    let salt = &payload[..32];
    let iv = &payload[32..48];
    let cipher_text = &payload[48..];
    let password = secret_from_env(DISPATCHER_SECRET_PASSWORD_ENV, "Dispatcher secret password")?;
    let mut key = [0_u8; 32];
    pbkdf2_hmac::<Sha1>(password.as_bytes(), salt, 100_000, &mut key);

    let plain = aes_256_cbc_decrypt_pkcs7(&key, iv, cipher_text)?;

    String::from_utf8(plain)
        .map_err(|error| SubmissionError::new(format!("Dispatcher secret is not UTF-8: {error}")))
}

pub fn encrypt_native_return_copy(path: &Path) -> Result<(), SubmissionError> {
    let plain = fs::read(path)?;
    let compressed = zlib_compress(&plain)?;
    let encrypted = dcpcrypt_encrypt(&compressed)?;
    let temp_path = path.with_file_name("tmpAES.tmp");

    fs::write(&temp_path, encrypted)?;
    fs::rename(temp_path, path)?;

    Ok(())
}

pub fn decrypt_native_return_copy(encrypted: &[u8]) -> Result<Vec<u8>, SubmissionError> {
    let compressed = dcpcrypt_decrypt(encrypted)?;
    zlib_decompress(&compressed)
}

pub fn build_sftp_upload_plan(
    dispatcher: &DispatcherSettings,
    form_code: &str,
    local_path: PathBuf,
) -> Result<SftpUploadPlan, SubmissionError> {
    if dispatcher.mode.trim() == "0" {
        return Err(SubmissionError::new(
            "Dispatcher reported that SFTP is disabled.",
        ));
    }

    let file_name = local_path
        .file_name()
        .and_then(|file_name| file_name.to_str())
        .ok_or_else(|| SubmissionError::new("Upload file path must include a valid file name."))?
        .to_string();
    let port =
        dispatcher.port.trim().parse::<u16>().map_err(|error| {
            SubmissionError::new(format!("Dispatcher port is invalid: {error}"))
        })?;
    let host = decrypt_dispatcher_secret(&dispatcher.server)?;
    let username = decrypt_dispatcher_secret(&dispatcher.username)?;
    let password = decrypt_dispatcher_secret(&dispatcher.password)?;
    let remote_folder = legacy_remote_folder(form_code);

    Ok(SftpUploadPlan {
        host,
        port,
        username,
        password,
        local_path,
        remote_path: format!("/{remote_folder}/{file_name}"),
    })
}

fn run_native_sftp(plan: &SftpUploadPlan, logger: &SubmissionLogger) -> i32 {
    logger.log(format!(
        "native_sftp_start host={} port={} remote_path={}",
        plan.host, plan.port, plan.remote_path
    ));

    match upload_native_sftp(plan) {
        Ok(()) => {
            logger.log("native_sftp_complete");
            0
        }
        Err(error) => {
            logger.log(format!("native_sftp_error {}", error.message));
            1
        }
    }
}

fn upload_native_sftp(plan: &SftpUploadPlan) -> Result<(), SubmissionError> {
    let tcp = TcpStream::connect((plan.host.as_str(), plan.port))
        .map_err(|error| SubmissionError::new(format!("SFTP connection failed: {error}")))?;
    tcp.set_read_timeout(Some(Duration::from_secs(30)))?;
    tcp.set_write_timeout(Some(Duration::from_secs(30)))?;

    let mut session = Session::new()
        .map_err(|error| SubmissionError::new(format!("SFTP session failed: {error}")))?;
    session.set_tcp_stream(tcp);
    session
        .handshake()
        .map_err(|error| SubmissionError::new(format!("SFTP handshake failed: {error}")))?;
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

    io::copy(&mut local, &mut remote)
        .map_err(|error| SubmissionError::new(format!("SFTP upload failed: {error}")))?;

    Ok(())
}

fn legacy_remote_folder(form_code: &str) -> String {
    form_code.trim().to_string()
}

fn zlib_compress(plain: &[u8]) -> Result<Vec<u8>, SubmissionError> {
    let mut encoder = ZlibEncoder::new(Vec::new(), Compression::new(3));
    encoder.write_all(plain)?;
    encoder
        .finish()
        .map_err(|error| SubmissionError::new(format!("Return copy compression failed: {error}")))
}

fn zlib_decompress(compressed: &[u8]) -> Result<Vec<u8>, SubmissionError> {
    let mut decoder = ZlibDecoder::new(compressed);
    let mut plain = Vec::new();
    decoder.read_to_end(&mut plain).map_err(|error| {
        SubmissionError::new(format!("Return copy decompression failed: {error}"))
    })?;

    Ok(plain)
}

fn dcpcrypt_encrypt(plain: &[u8]) -> Result<Vec<u8>, SubmissionError> {
    dcpcrypt_transform(plain, true)
}

fn dcpcrypt_decrypt(encrypted: &[u8]) -> Result<Vec<u8>, SubmissionError> {
    dcpcrypt_transform(encrypted, false)
}

fn dcpcrypt_transform(input: &[u8], encrypt: bool) -> Result<Vec<u8>, SubmissionError> {
    let password = secret_from_env(RETURN_COPY_PASSWORD_ENV, "Return copy password")?;
    let key = Sha256::digest(password.as_bytes());
    let cipher = Aes256::new_from_slice(&key)
        .map_err(|error| SubmissionError::new(format!("Return copy cipher failed: {error}")))?;
    let mut chain = [0_u8; 16];
    let full_len = input.len() / 16 * 16;
    let mut output = Vec::with_capacity(input.len());

    for chunk in input[..full_len].chunks_exact(16) {
        if encrypt {
            let mut block = [0_u8; 16];
            block.copy_from_slice(chunk);
            xor_block(&mut block, &chain);
            aes_encrypt_block(&cipher, &mut block);
            output.extend_from_slice(&block);
            chain = block;
        } else {
            let mut block = [0_u8; 16];
            block.copy_from_slice(chunk);
            let cipher_block = block;
            aes_decrypt_block(&cipher, &mut block);
            xor_block(&mut block, &chain);
            output.extend_from_slice(&block);
            chain = cipher_block;
        }
    }

    let remainder = &input[full_len..];
    if !remainder.is_empty() {
        let mut stream_block = chain;
        aes_encrypt_block(&cipher, &mut stream_block);
        output.extend(
            remainder
                .iter()
                .zip(stream_block.iter())
                .map(|(left, right)| left ^ right),
        );
    }

    Ok(output)
}

fn secret_from_env(name: &str, label: &str) -> Result<String, SubmissionError> {
    env::var(name).map_err(|_| SubmissionError::new(format!("{label} requires {name} to be set.")))
}

fn aes_256_cbc_decrypt_pkcs7(
    key: &[u8; 32],
    iv: &[u8],
    cipher_text: &[u8],
) -> Result<Vec<u8>, SubmissionError> {
    if iv.len() != 16 || cipher_text.is_empty() || cipher_text.len() % 16 != 0 {
        return Err(SubmissionError::new(
            "AES-CBC payload has an invalid shape.",
        ));
    }

    let cipher = Aes256::new_from_slice(key)
        .map_err(|error| SubmissionError::new(format!("Dispatcher cipher failed: {error}")))?;
    let mut chain = [0_u8; 16];
    chain.copy_from_slice(iv);
    let mut plain = Vec::with_capacity(cipher_text.len());

    for chunk in cipher_text.chunks_exact(16) {
        let mut block = [0_u8; 16];
        block.copy_from_slice(chunk);
        let cipher_block = block;
        aes_decrypt_block(&cipher, &mut block);
        xor_block(&mut block, &chain);
        plain.extend_from_slice(&block);
        chain = cipher_block;
    }

    let padding = plain
        .last()
        .copied()
        .ok_or_else(|| SubmissionError::new("AES-CBC payload is empty."))?;

    if padding == 0 || padding as usize > 16 || padding as usize > plain.len() {
        return Err(SubmissionError::new("AES-CBC padding is invalid."));
    }

    let padding_start = plain.len() - padding as usize;
    if plain[padding_start..].iter().any(|byte| *byte != padding) {
        return Err(SubmissionError::new("AES-CBC padding is invalid."));
    }

    plain.truncate(padding_start);
    Ok(plain)
}

fn aes_encrypt_block(cipher: &Aes256, block: &mut [u8; 16]) {
    let block = GenericArray::from_mut_slice(block);
    cipher.encrypt_block(block);
}

fn aes_decrypt_block(cipher: &Aes256, block: &mut [u8; 16]) {
    let block = GenericArray::from_mut_slice(block);
    cipher.decrypt_block(block);
}

fn xor_block(block: &mut [u8; 16], chain: &[u8; 16]) {
    for index in 0..16 {
        block[index] ^= chain[index];
    }
}

struct SubmissionLogger {
    path: PathBuf,
}

impl SubmissionLogger {
    fn new(root: &Path) -> Result<Self, SubmissionError> {
        let log_dir = root.join("logfile");
        fs::create_dir_all(&log_dir)?;
        let logger = Self {
            path: log_dir.join("submission.log"),
        };
        logger.log("logger_ready");

        Ok(logger)
    }

    fn log(&self, message: impl AsRef<str>) {
        if let Ok(mut file) = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.path)
        {
            let _ = writeln!(file, "{} {}", log_timestamp(), message.as_ref());
        }
    }

    fn path_string(&self) -> String {
        path_to_string(&self.path)
    }
}

fn log_timestamp() -> String {
    let seconds = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs())
        .unwrap_or(0);

    format!("ts={seconds}")
}

impl SubmissionError {
    fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
            log_path: None,
        }
    }

    fn with_log_path(message: impl Into<String>, logger: &SubmissionLogger) -> Self {
        Self {
            message: message.into(),
            log_path: Some(logger.path_string()),
        }
    }
}

fn path_to_string(path: &Path) -> String {
    path.to_string_lossy().into_owned()
}
