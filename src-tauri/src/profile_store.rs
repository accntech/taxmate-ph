use std::{
    fs, io,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct TaxpayerProfile {
    pub id: String,
    pub tin1: String,
    pub tin2: String,
    pub tin3: String,
    pub branch_code: String,
    pub rdo_code: String,
    pub taxpayer_name: String,
    pub address: String,
    pub address2: String,
    pub zip_code: String,
    pub contact_number: String,
    pub category: String,
    pub email: String,
}

#[derive(Clone, Debug, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct TaxpayerProfileSaveReceipt {
    pub profile: TaxpayerProfile,
    pub path: String,
}

#[derive(Clone, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ProfileStoreError {
    pub message: String,
}

impl From<io::Error> for ProfileStoreError {
    fn from(error: io::Error) -> Self {
        Self {
            message: error.to_string(),
        }
    }
}

#[tauri::command]
pub async fn save_taxpayer_profile(
    app: tauri::AppHandle,
    profile: TaxpayerProfile,
) -> Result<TaxpayerProfileSaveReceipt, ProfileStoreError> {
    let root = app
        .path()
        .app_data_dir()
        .map_err(|error| ProfileStoreError::new(format!("Could not resolve app data: {error}")))?;

    tauri::async_runtime::spawn_blocking(move || save_taxpayer_profile_to_root(&root, profile))
        .await
        .map_err(|error| ProfileStoreError::new(format!("Profile save task failed: {error}")))?
}

#[tauri::command]
pub async fn list_taxpayer_profiles(
    app: tauri::AppHandle,
) -> Result<Vec<TaxpayerProfile>, ProfileStoreError> {
    let root = app
        .path()
        .app_data_dir()
        .map_err(|error| ProfileStoreError::new(format!("Could not resolve app data: {error}")))?;

    tauri::async_runtime::spawn_blocking(move || list_taxpayer_profiles_from_root(&root))
        .await
        .map_err(|error| ProfileStoreError::new(format!("Profile load task failed: {error}")))?
}

#[tauri::command]
pub async fn delete_taxpayer_profile(
    app: tauri::AppHandle,
    id: String,
) -> Result<(), ProfileStoreError> {
    let root = app
        .path()
        .app_data_dir()
        .map_err(|error| ProfileStoreError::new(format!("Could not resolve app data: {error}")))?;

    tauri::async_runtime::spawn_blocking(move || delete_taxpayer_profile_from_root(&root, &id))
        .await
        .map_err(|error| ProfileStoreError::new(format!("Profile delete task failed: {error}")))?
}

/// Delete only the taxpayer profile. Saved returns and submission history are retained.
pub fn delete_taxpayer_profile_from_root(
    root: &Path,
    id: &str,
) -> Result<(), ProfileStoreError> {
    // Legacy profiles may have shorter or longer branch codes. Keep their exact
    // numeric filename instead of padding or truncating it to the current format.
    if id.is_empty() || !id.bytes().all(|byte| byte.is_ascii_digit()) {
        return Err(ProfileStoreError::new(
            "Taxpayer profile id must contain only digits.",
        ));
    }

    fs::remove_file(root.join("profile").join(format!("{id}.xml"))).map_err(|error| {
        ProfileStoreError::new(format!("Could not delete taxpayer profile: {error}"))
    })
}

pub fn save_taxpayer_profile_to_root(
    root: &Path,
    profile: TaxpayerProfile,
) -> Result<TaxpayerProfileSaveReceipt, ProfileStoreError> {
    validate_profile(&profile)?;

    let profile_dir = root.join("profile");
    fs::create_dir_all(&profile_dir)?;

    let path = profile_dir.join(format!("{}.xml", profile.id));
    fs::write(&path, serialize_profile_xml(&profile))?;

    Ok(TaxpayerProfileSaveReceipt {
        profile,
        path: path_to_string(&path),
    })
}

pub fn list_taxpayer_profiles_from_root(
    root: &Path,
) -> Result<Vec<TaxpayerProfile>, ProfileStoreError> {
    let profile_dir = root.join("profile");

    if !profile_dir.exists() {
        return Ok(Vec::new());
    }

    let mut profiles = Vec::new();

    for entry in fs::read_dir(profile_dir)? {
        let entry = entry?;
        let path = entry.path();

        if path.extension().and_then(|value| value.to_str()) != Some("xml") {
            continue;
        }

        let id = path
            .file_stem()
            .and_then(|value| value.to_str())
            .ok_or_else(|| ProfileStoreError::new("Invalid taxpayer profile filename."))?;
        let xml = fs::read_to_string(&path)?;
        let mut profile = parse_profile_xml(&xml)?;
        // Stored TIN fields can be incomplete or differ from the filename.
        // Use the file's identity so actions target the profile that was loaded.
        profile.id = id.to_string();
        profiles.push(profile);
    }

    profiles.sort_by(|left, right| left.id.cmp(&right.id));

    Ok(profiles)
}

fn validate_profile(profile: &TaxpayerProfile) -> Result<(), ProfileStoreError> {
    if profile.id.trim().is_empty() {
        return Err(ProfileStoreError::new("Taxpayer profile id is required."));
    }

    if profile.id.contains('/') || profile.id.contains('\\') || profile.id.contains("..") {
        return Err(ProfileStoreError::new(
            "Taxpayer profile id must not include a path.",
        ));
    }

    Ok(())
}

fn serialize_profile_xml(profile: &TaxpayerProfile) -> String {
    [
        "<?xml version='1.0'?>".to_string(),
        "<div>".to_string(),
        field_xml("fn", &escape_legacy_value(&profile.taxpayer_name)),
        field_xml("tin1", &profile.tin1),
        field_xml("tin2", &profile.tin2),
        field_xml("tin3", &profile.tin3),
        field_xml("tin4", &profile.branch_code),
        field_xml("rdo", &profile.rdo_code),
        field_xml("addr", &escape_legacy_value(&profile.address)),
        field_xml("addr2", &escape_legacy_value(&profile.address2)),
        field_xml("zip", &profile.zip_code),
        field_xml("tel", &profile.contact_number),
        field_xml("category", &profile.category),
        field_xml("email", &profile.email),
        "</div>".to_string(),
    ]
    .join("\n")
}

fn field_xml(key: &str, value: &str) -> String {
    format!("<div>{key}={value}{key}=</div>")
}

fn parse_profile_xml(xml: &str) -> Result<TaxpayerProfile, ProfileStoreError> {
    let tin1 = read_field(xml, "tin1");
    let tin2 = read_field(xml, "tin2");
    let tin3 = read_field(xml, "tin3");
    let branch_code = read_field(xml, "tin4");

    Ok(TaxpayerProfile {
        id: format!("{tin1}{tin2}{tin3}{branch_code}"),
        tin1,
        tin2,
        tin3,
        branch_code,
        rdo_code: read_field(xml, "rdo"),
        taxpayer_name: unescape_legacy_value(&read_field(xml, "fn"))?,
        address: unescape_legacy_value(&read_field(xml, "addr"))?,
        address2: unescape_legacy_value(&read_field(xml, "addr2"))?,
        zip_code: read_field(xml, "zip"),
        contact_number: read_field(xml, "tel"),
        category: read_field(xml, "category"),
        email: read_field(xml, "email"),
    })
}

fn read_field(xml: &str, key: &str) -> String {
    let marker = format!("{key}=");
    let mut parts = xml.splitn(3, &marker);
    let Some(_) = parts.next() else {
        return String::new();
    };
    let Some(value) = parts.next() else {
        return String::new();
    };

    value.to_string()
}

fn escape_legacy_value(value: &str) -> String {
    let mut escaped = String::new();

    for byte in value.as_bytes() {
        match byte {
            b'A'..=b'Z'
            | b'a'..=b'z'
            | b'0'..=b'9'
            | b'@'
            | b'*'
            | b'_'
            | b'+'
            | b'-'
            | b'.'
            | b'/' => escaped.push(*byte as char),
            _ => escaped.push_str(&format!("%{byte:02X}")),
        }
    }

    escaped
}

fn unescape_legacy_value(value: &str) -> Result<String, ProfileStoreError> {
    let bytes = value.as_bytes();
    let mut decoded = Vec::new();
    let mut index = 0;

    while index < bytes.len() {
        if bytes[index] == b'%' && index + 2 < bytes.len() {
            let hex = std::str::from_utf8(&bytes[index + 1..index + 3]).map_err(|error| {
                ProfileStoreError::new(format!("Invalid profile value: {error}"))
            })?;
            let byte = u8::from_str_radix(hex, 16).map_err(|error| {
                ProfileStoreError::new(format!("Invalid profile value: {error}"))
            })?;
            decoded.push(byte);
            index += 3;
        } else {
            decoded.push(bytes[index]);
            index += 1;
        }
    }

    String::from_utf8(decoded)
        .map_err(|error| ProfileStoreError::new(format!("Invalid profile value: {error}")))
}

fn path_to_string(path: &PathBuf) -> String {
    path.to_string_lossy().into_owned()
}

impl ProfileStoreError {
    fn new(message: impl Into<String>) -> Self {
        Self {
            message: message.into(),
        }
    }
}
