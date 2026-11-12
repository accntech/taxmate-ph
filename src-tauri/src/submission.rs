use std::{
    env, fs,
    fs::OpenOptions,
    io,
    io::{Read, Seek, SeekFrom, Write},
    path::{Path, PathBuf},
    time::Duration,
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
use tauri::Manager;

#[path = "submission-dispatcher.rs"]
mod dispatcher;

#[path = "submission-transport.rs"]
mod transport;

const CURRENT_VERSION: &str = "7.9.6.0";
const PRIMARY_DISPATCHER_BASE: &str = "http://birgovph.com/";
const BACKUP_DISPATCHER_BASE: &str = "http://ws1.birgovph.com/";
const DISPATCHER_SECRET_PASSWORD_ENV: &str = "EBIRFORMS_DISPATCHER_SECRET_PASSWORD";
const RETURN_COPY_PASSWORD_ENV: &str = "EBIRFORMS_RETURN_COPY_PASSWORD";
const SUBMISSION_LOG_TAIL_BYTES: u64 = 128 * 1024;

#[cfg(test)]
static SUBMISSION_TEST_ENV: std::sync::Mutex<()> = std::sync::Mutex::new(());

#[derive(Clone, Debug, Serialize)]
pub struct SubmissionLog {
    pub path: String,
    pub content: String,
    pub truncated: bool,
}

#[tauri::command]
pub async fn read_submission_log(app: tauri::AppHandle) -> Result<SubmissionLog, String> {
    let root = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    tauri::async_runtime::spawn_blocking(move || read_submission_log_at(&root))
        .await
        .map_err(|error| error.to_string())?
        .map_err(|error| error.to_string())
}

pub fn read_submission_log_at(root: &Path) -> io::Result<SubmissionLog> {
    let path = root.join("logfile").join("submission.log");
    let mut log = SubmissionLog {
        path: path_to_string(&path),
        content: String::new(),
        truncated: false,
    };
    let mut file = match fs::File::open(&path) {
        Ok(file) => file,
        Err(error) if error.kind() == io::ErrorKind::NotFound => return Ok(log),
        Err(error) => return Err(error),
    };
    let length = file.metadata()?.len();
    log.truncated = length > SUBMISSION_LOG_TAIL_BYTES;
    file.seek(SeekFrom::Start(
        length.saturating_sub(SUBMISSION_LOG_TAIL_BYTES),
    ))?;
    let mut bytes = Vec::new();
    // A concurrent submission can append while this snapshot is being read.
    file.take(SUBMISSION_LOG_TAIL_BYTES)
        .read_to_end(&mut bytes)?;
    let start = if log.truncated {
        bytes
            .iter()
            .position(|byte| byte & 0xc0 != 0x80)
            .unwrap_or(bytes.len())
    } else {
        0
    };
    let bytes = &bytes[start..];
    // Avoid showing a broken character if an append is observed mid-codepoint.
    let end = match std::str::from_utf8(bytes) {
        Err(error) if error.error_len().is_none() => error.valid_up_to(),
        _ => bytes.len(),
    };
    log.content = String::from_utf8_lossy(&bytes[..end]).into_owned();
    Ok(log)
}

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
    #[serde(default)]
    pub rdo_xml: Option<String>,
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
    let _active_return = ActiveReturn::acquire(&save_path)?;
    let prepared_xml = update_final_flag(&request.xml, "2");

    // Preserve any legacy submitted copy before a draft or resend overwrites it.
    crate::return_history::load_history(root)?;
    fs::write(&save_path, &prepared_xml)?;
    let prepared_rdo = update_final_flag(request.rdo_xml.as_deref().unwrap_or(&request.xml), "2");
    fs::write(&send_path, &prepared_rdo)?;
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
    let (dispatcher, dispatcher_url) = resolve_dispatcher(&request, &dispatcher_url, &logger)?;
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
    let upload = run_native_sftp(&plan, &logger);
    let submitted = upload.is_ok();
    let exit_code = if submitted { 0 } else { 1 };
    let upload_error = upload.err().map(|error| error.message);
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
        .map(|error| format!(" Upload completed, but history could not be saved: {error}"))
    } else {
        None
    };
    if let Err(error) = fs::write(&save_path, &final_xml) {
        if !submitted {
            return Err(error.into());
        }
        let warning =
            format!(" Upload completed, but the local return copy could not be updated: {error}");
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
                "Return uploaded by SFTP. BIR acknowledgment is still required.{}",
                history_warning.unwrap_or_default()
            )
        } else {
            format!(
                "Return upload failed: {}",
                upload_error.unwrap_or_else(|| "unknown transport error".into())
            )
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
    const PREFIX: &str = "<div>txtFinalFlag=";
    const SUFFIX: &str = "txtFinalFlag=</div>";
    // Raw RDO text may contain the marker in a taxpayer value. Only change the
    // standalone control record; it is serialized after all taxpayer fields.
    let Some(start) = xml.rfind(PREFIX) else {
        return xml.to_string();
    };
    let value_start = start + PREFIX.len();
    let Some(length) = xml[value_start..].find(SUFFIX) else {
        return xml.to_string();
    };
    let value_end = value_start + length;
    if !matches!(&xml[value_start..value_end], "0" | "1" | "2" | "3") {
        return xml.to_string();
    }
    format!("{}{flag}{}", &xml[..value_start], &xml[value_end..])
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
    dispatcher::parse(response)
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

    if request.mode == SubmissionMode::LegacySftp
        && request
            .rdo_xml
            .as_deref()
            .is_none_or(|xml| xml.trim().is_empty())
    {
        return Err(SubmissionError::new(
            "A compatible RDO payload is required for live submission.",
        ));
    }

    Ok(())
}

fn resolve_dispatcher(
    request: &SubmissionRequest,
    primary_url: &str,
    logger: &SubmissionLogger,
) -> Result<(DispatcherSettings, String), SubmissionError> {
    if !request.fetch_dispatcher {
        if let Some(dispatcher) = &request.dispatcher {
            logger.log(format!(
                "dispatcher_source=manual mode={} server_present={} port={}",
                dispatcher.mode,
                !dispatcher.server.is_empty(),
                dispatcher.port
            ));
            return Ok((dispatcher.clone(), primary_url.to_string()));
        }
        let message = "Dispatcher settings are required unless dispatcher fetching is enabled.";
        logger.log(format!("dispatcher_missing {message}"));
        return Err(SubmissionError::with_log_path(message, logger));
    }
    let backup_url = build_dispatcher_url(
        BACKUP_DISPATCHER_BASE,
        &request.tin,
        &request.form_code,
        CURRENT_VERSION,
    );
    dispatcher::resolve_with(primary_url, &backup_url, |url| {
        logger.log(format!("dispatcher_fetch url={url}"));
        let result = fetch_dispatcher(url);
        match &result {
            Ok(settings) => logger.log(format!("dispatcher_result mode={}", settings.mode)),
            Err(error) => logger.log(format!("dispatcher_fetch_error {}", error.message)),
        }
        result
    })
    .map_err(|error| SubmissionError::with_log_path(error.message, logger))
}

fn fetch_dispatcher(url: &str) -> Result<DispatcherSettings, SubmissionError> {
    let response = ureq::AgentBuilder::new()
        .timeout(Duration::from_secs(8))
        .build()
        .get(url)
        .call()
        .map_err(|error| SubmissionError::new(format!("Dispatcher request failed: {error}")))?;
    read_dispatcher_response(response.into_reader())
}

fn read_dispatcher_response(reader: impl Read) -> Result<DispatcherSettings, SubmissionError> {
    let mut response = String::new();
    reader
        .take(16 * 1024 + 1)
        .read_to_string(&mut response)
        .map_err(|_| SubmissionError::new("Could not read dispatcher response."))?;
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
    let mut staging =
        tempfile::NamedTempFile::new_in(path.parent().unwrap_or_else(|| Path::new(".")))?;
    staging.write_all(&encrypted)?;
    staging
        .persist(path)
        .map_err(|error| SubmissionError::from(error.error))?;

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
    if matches!(dispatcher.mode.trim(), "" | "0") {
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
    if port == 0 {
        return Err(SubmissionError::new(
            "Dispatcher port must be greater than zero.",
        ));
    }
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

fn run_native_sftp(
    plan: &SftpUploadPlan,
    logger: &SubmissionLogger,
) -> Result<(), SubmissionError> {
    logger.log(format!(
        "native_sftp_start host={} port={} remote_path={}",
        plan.host, plan.port, plan.remote_path
    ));

    let root = logger
        .path
        .parent()
        .and_then(Path::parent)
        .unwrap_or_else(|| Path::new("."));
    match transport::upload(plan, &root.join("settings/bir-known-hosts")) {
        Ok(()) => {
            logger.log("native_sftp_complete");
            Ok(())
        }
        Err(error) => {
            logger.log(format!("native_sftp_error {}", error.message));
            Err(error)
        }
    }
}

fn legacy_remote_folder(form_code: &str) -> String {
    form_code.trim().to_string()
}

fn zlib_compress(plain: &[u8]) -> Result<Vec<u8>, SubmissionError> {
    // Encrypt.exe's compression enum 3 maps to zlib's best-compression level 9.
    let mut encoder = ZlibEncoder::new(Vec::new(), Compression::best());
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
    // DCPcrypt Init(nil IV) encrypts the zero block before Reset/CBC begins.
    aes_encrypt_block(&cipher, &mut chain);
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
    format!(
        "[{}]",
        chrono::Local::now().to_rfc3339_opts(chrono::SecondsFormat::Secs, false)
    )
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

struct ActiveReturn {
    _file: fs::File,
}

impl Drop for ActiveReturn {
    fn drop(&mut self) {
        // Closing alone can retain a lock while a spawned child has inherited
        // the handle. Release the lease explicitly when this operation ends.
        let _ = self._file.unlock();
    }
}

impl ActiveReturn {
    fn acquire(save_path: &Path) -> Result<Self, SubmissionError> {
        let directory = save_path.parent().unwrap().join(".submission-locks");
        fs::create_dir_all(&directory)?;
        let digest = Sha256::digest(save_path.file_name().unwrap().as_encoded_bytes());
        let name = digest
            .iter()
            .map(|byte| format!("{byte:02x}"))
            .collect::<String>();
        let file = fs::File::options()
            .read(true)
            .write(true)
            .create(true)
            .truncate(false)
            .open(directory.join(name))?;
        file.try_lock().map_err(|_| SubmissionError::new(
            "This return is already being prepared or submitted, or could not be locked. Try again after the current operation finishes."
        ))?;
        Ok(Self { _file: file })
    }
}

#[cfg(test)]
mod compatibility_tests {
    use super::*;

    fn with_synthetic_password(action: impl FnOnce()) {
        let _guard = SUBMISSION_TEST_ENV
            .lock()
            .unwrap_or_else(|e| e.into_inner());
        struct Restore(Option<String>);
        impl Drop for Restore {
            fn drop(&mut self) {
                match &self.0 {
                    Some(value) => env::set_var(RETURN_COPY_PASSWORD_ENV, value),
                    None => env::remove_var(RETURN_COPY_PASSWORD_ENV),
                }
            }
        }
        let _restore = Restore(env::var(RETURN_COPY_PASSWORD_ENV).ok());
        env::set_var(
            RETURN_COPY_PASSWORD_ENV,
            "public synthetic compatibility test",
        );
        action();
    }

    fn unhex(text: &str) -> Vec<u8> {
        text.as_bytes()
            .chunks_exact(2)
            .map(|pair| u8::from_str_radix(std::str::from_utf8(pair).unwrap(), 16).unwrap())
            .collect()
    }

    #[test]
    fn cipher_matches_original_installer_machine_code_vectors() {
        with_synthetic_password(|| {
            let fixture: serde_json::Value = serde_json::from_str(include_str!(
                "../tests/fixtures/submission/native-cipher-vectors.json"
            ))
            .unwrap();
            for vector in fixture["vectors"].as_array().unwrap() {
                let length = vector["length"].as_u64().unwrap() as usize;
                let plain: Vec<u8> = (0..length).map(|i| ((i * 37 + 11) % 256) as u8).collect();
                let actual = dcpcrypt_encrypt(&plain).unwrap();
                let digest = Sha256::digest(&actual)
                    .iter()
                    .map(|byte| format!("{byte:02x}"))
                    .collect::<String>();
                assert_eq!(
                    digest,
                    vector["ciphertext_sha256"].as_str().unwrap(),
                    "original x86 ciphertext for length {length}"
                );
                if let Some(expected) = vector["ciphertext_hex"].as_str() {
                    let original = unhex(expected);
                    assert_eq!(actual, original, "cipher length {length}");
                    assert_eq!(
                        dcpcrypt_decrypt(&original).unwrap(),
                        plain,
                        "original decrypt length {length}"
                    );
                }
            }
        });
    }

    #[test]
    fn reads_independently_compressed_original_cipher_return_copy() {
        with_synthetic_password(|| {
            let fixture: serde_json::Value = serde_json::from_str(include_str!(
                "../tests/fixtures/submission/return-copy-vector.json"
            ))
            .unwrap();
            let actual =
                decrypt_native_return_copy(&unhex(fixture["ciphertext_hex"].as_str().unwrap()))
                    .expect("original cipher output must decrypt and inflate");
            assert_eq!(actual, fixture["plaintext"].as_str().unwrap().as_bytes());
        });
    }

    #[test]
    fn compression_uses_original_enum_three_level_nine_and_zlib_framing() {
        let plain = b"legacy return compression framing test".repeat(100);
        let compressed = zlib_compress(&plain).unwrap();
        assert_eq!(compressed[0], 0x78, "zlib deflate header");
        assert_eq!(
            compressed[1] >> 6,
            3,
            "original enum 3 selects level 9, not compression level 3"
        );
        assert_eq!(zlib_decompress(&compressed).unwrap(), plain);
    }

    #[test]
    fn encrypting_a_return_does_not_overwrite_a_shared_temporary_file() {
        with_synthetic_password(|| {
            let root = tempfile::tempdir().unwrap();
            let sentinel = root.path().join("tmpAES.tmp");
            fs::write(&sentinel, b"unrelated file").unwrap();
            let return_path = root.path().join("return.xml");
            fs::write(&return_path, b"synthetic return").unwrap();
            encrypt_native_return_copy(&return_path).unwrap();
            assert_eq!(
                fs::read(&sentinel).ok().as_deref(),
                Some(b"unrelated file".as_slice())
            );
            assert_eq!(
                decrypt_native_return_copy(&fs::read(return_path).unwrap()).unwrap(),
                b"synthetic return"
            );
        });
    }

    #[test]
    fn an_in_flight_return_cannot_be_overwritten_by_another_preparation() {
        let root = tempfile::tempdir().unwrap();
        let save_dir = root.path().join("savefile");
        fs::create_dir_all(&save_dir).unwrap();
        let path = save_dir.join("return.xml");
        fs::write(&path, b"original in-flight return").unwrap();
        let active = ActiveReturn::acquire(&path).unwrap();
        let request: SubmissionRequest = serde_json::from_value(serde_json::json!({
            "xml":"<div>txtFinalFlag=0txtFinalFlag=</div>",
            "returnFilename":"return.xml", "formCode":"1601EQ", "tin":"123456789",
            "email":"payer@example.com", "mode":"dry_run", "fetchDispatcher":false
        }))
        .unwrap();
        let result = run_submission(root.path(), request);
        assert!(
            result.is_err(),
            "a concurrent command must fail before overwriting this return"
        );
        assert_eq!(fs::read(&path).unwrap(), b"original in-flight return");
        // A process launch can temporarily inherit/duplicate the file handle.
        let inherited_handle = active._file.try_clone().unwrap();
        drop(active);
        assert!(
            ActiveReturn::acquire(&path).is_ok(),
            "dropping the holder releases the OS lock"
        );
        drop(inherited_handle);
    }

    #[test]
    fn oversized_dispatcher_response_is_not_read_into_memory_in_full() {
        let mut body = io::Cursor::new(vec![b' '; 1024 * 1024]);
        assert!(read_dispatcher_response(&mut body).is_err());
        assert!(
            body.position() <= 16 * 1024 + 1,
            "dispatcher reader must stop at its bounded limit"
        );
    }
}
