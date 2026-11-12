use std::{
    env, fs,
    fs::OpenOptions,
    io,
    io::{Read, Write},
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
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

const DISPATCHER_SECRET_PASSWORD_ENV: &str = "EBIRFORMS_DISPATCHER_SECRET_PASSWORD";
const RETURN_COPY_PASSWORD_ENV: &str = "EBIRFORMS_RETURN_COPY_PASSWORD";

#[derive(Clone, Debug, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum SubmissionMode {
    DryRun,
    Mock,
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
    Simulated,
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
    pub reference: Option<String>,
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

    tauri::async_runtime::spawn_blocking(move || run_submission(&root, request))
        .await
        .map_err(|error| SubmissionError::new(format!("Submission task failed: {error}")))?
}

pub fn run_submission(
    root: &Path,
    request: SubmissionRequest,
) -> Result<SubmissionReceipt, SubmissionError> {
    // Fail closed at the native command boundary, even if an old UI requests live mode.
    if request.mode == SubmissionMode::LegacySftp {
        return Err(SubmissionError::new(
            "Live submission is disabled. Use mock submission for testing.",
        ));
    }
    validate_request(&request)?;
    let email_name = email_file_name(&request.return_filename, &request.email)?;
    let simulated = request.mode == SubmissionMode::Mock;
    let reference = simulated.then(|| {
        static NEXT: std::sync::atomic::AtomicU64 = std::sync::atomic::AtomicU64::new(0);
        format!(
            "MOCK-{}-{}",
            SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap_or_default()
                .as_nanos(),
            NEXT.fetch_add(1, std::sync::atomic::Ordering::Relaxed)
        )
    });
    // Simulations never overwrite real legacy savefiles or enter genuine submission history.
    let output_root = reference
        .as_ref()
        .map(|id| root.join("mock-submissions").join(id))
        .unwrap_or_else(|| root.to_path_buf());
    let logger = SubmissionLogger::new(&output_root)?;
    let save_dir = output_root.join("savefile");
    let rdo_dir = output_root.join("IAF_RDO_Copy");
    fs::create_dir_all(&save_dir)?;
    fs::create_dir_all(&rdo_dir)?;
    let save_path = save_dir.join(&request.return_filename);
    let send_path = rdo_dir.join(email_name);
    let prepared_xml = update_final_flag(&request.xml, "2");
    if !simulated {
        crate::return_history::load_history(root)?;
    }
    fs::write(&save_path, &prepared_xml)?;
    fs::write(&send_path, &prepared_xml)?;
    let receipt = SubmissionReceipt {
        status: if simulated {
            SubmissionStatus::Simulated
        } else {
            SubmissionStatus::Drafted
        },
        final_flag: "2".into(),
        save_path: path_to_string(&save_path),
        send_path: path_to_string(&send_path),
        dispatcher_url: None,
        exit_code: None,
        log_path: Some(logger.path_string()),
        reference,
        message: if simulated {
            "Mock submission accepted locally for testing. Nothing was sent to BIR."
        } else {
            "Dry run prepared local copies without upload."
        }
        .into(),
    };
    if simulated {
        fs::write(
            output_root.join("receipt.json"),
            serde_json::to_vec_pretty(&receipt)
                .map_err(|error| SubmissionError::new(error.to_string()))?,
        )?;
    }
    logger.log(if simulated {
        "mock_submission_complete no_network=true"
    } else {
        "dry_run_complete"
    });
    Ok(receipt)
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
}

fn path_to_string(path: &Path) -> String {
    path.to_string_lossy().into_owned()
}
