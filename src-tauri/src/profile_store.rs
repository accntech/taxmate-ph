use std::{
    fs, io,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Clone, Debug, Default, Deserialize, Serialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct TaxpayerSpouse {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub taxpayer_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tin1: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tin2: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tin3: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branch_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rdo_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub birth_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub citizenship: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub address: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub address2: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub zip_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub contact_number: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
}

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
    #[serde(default)]
    pub line_of_business: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trade_name: Option<String>,
    #[serde(default)]
    pub taxpayer_classification: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub taxpayer_type: Option<String>,
    #[serde(default)]
    pub psic_code: String,
    #[serde(default)]
    pub taxpayer_size: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub psoc_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub birth_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub citizenship: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub civil_status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub spouse: Option<TaxpayerSpouse>,
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
    mut profile: TaxpayerProfile,
) -> Result<TaxpayerProfileSaveReceipt, ProfileStoreError> {
    normalize_income_details(&mut profile);
    validate_profile(&profile)?;

    let profile_dir = root.join("profile");
    fs::create_dir_all(&profile_dir)?;

    let path = profile_dir.join(format!("{}.xml", profile.id));
    fs::write(&path, serialize_profile_xml(&profile)?)?;

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

    if !["", "I", "N"].contains(&profile.taxpayer_classification.as_str()) {
        return Err(ProfileStoreError::new("Choose Individual or Non-individual."));
    }
    if let Some(taxpayer_type) = &profile.taxpayer_type {
        if !["compensation", "single-proprietor", "professional", "mixed-income", "estate", "trust"]
            .contains(&taxpayer_type.as_str())
        {
            return Err(ProfileStoreError::new("Choose a supported taxpayer type."));
        }
    }
    if let Some(status) = &profile.civil_status {
        if !["Single", "Married", "Separated", "Widowed"].contains(&status.as_str()) {
            return Err(ProfileStoreError::new("Choose a supported civil status."));
        }
    }
    validate_birth_date(profile.birth_date.as_deref(), "taxpayer")?;
    if profile.psoc_code.as_ref().is_some_and(|code| !is_ascii_digits(code, 4)) {
        return Err(ProfileStoreError::new("Enter a 4-digit PSOC code."));
    }

    if let Some(spouse) = &profile.spouse {
        validate_birth_date(spouse.birth_date.as_deref(), "spouse")?;
        let tin = [
            spouse.tin1.as_deref().unwrap_or_default(),
            spouse.tin2.as_deref().unwrap_or_default(),
            spouse.tin3.as_deref().unwrap_or_default(),
        ];
        let branch = spouse.branch_code.as_deref().unwrap_or_default();
        if tin.iter().any(|part| !part.is_empty()) || !branch.is_empty() {
            let valid_tin = tin.iter().all(|part| is_ascii_digits(part, 3));
            let valid_branch = (3..=5).contains(&branch.len())
                && branch.bytes().all(|byte| byte.is_ascii_digit());
            if !valid_tin || !valid_branch {
                return Err(ProfileStoreError::new(
                    "Enter 9 spouse TIN digits and a 3- to 5-digit branch code.",
                ));
            }
            if tin == ["000", "000", "000"] {
                return Err(ProfileStoreError::new("Spouse TIN cannot be all zeros."));
            }
        }
        if spouse.zip_code.as_ref().is_some_and(|zip| !is_ascii_digits(zip, 4)) {
            return Err(ProfileStoreError::new("Enter a 4-digit spouse ZIP code."));
        }
    }

    Ok(())
}

fn is_ascii_digits(value: &str, length: usize) -> bool {
    value.len() == length && value.bytes().all(|byte| byte.is_ascii_digit())
}

fn validate_birth_date(value: Option<&str>, person: &str) -> Result<(), ProfileStoreError> {
    if let Some(value) = value {
        let valid = chrono::NaiveDate::parse_from_str(value, "%Y-%m-%d")
            .is_ok_and(|date| {
                date.format("%Y-%m-%d").to_string() == value
                    && !value.starts_with("0000-")
                    && date <= chrono::Local::now().date_naive()
            });
        if !valid {
            return Err(ProfileStoreError::new(format!(
                "Enter a valid {person} birth date on or before today."
            )));
        }
    }
    Ok(())
}

fn normalize_income_details(profile: &mut TaxpayerProfile) {
    fn trim(field: &mut Option<String>) {
        *field = field.take().and_then(|value| {
            let value = value.trim();
            (!value.is_empty()).then(|| value.to_owned())
        });
    }

    trim(&mut profile.birth_date);
    trim(&mut profile.trade_name);
    trim(&mut profile.psoc_code);
    trim(&mut profile.citizenship);
    trim(&mut profile.civil_status);
    if profile.taxpayer_classification == "I" {
        trim(&mut profile.taxpayer_type);
    } else {
        profile.taxpayer_type = None;
    }
    if let Some(spouse) = &mut profile.spouse {
        for field in [
            &mut spouse.taxpayer_name,
            &mut spouse.tin1,
            &mut spouse.tin2,
            &mut spouse.tin3,
            &mut spouse.branch_code,
            &mut spouse.rdo_code,
            &mut spouse.birth_date,
            &mut spouse.citizenship,
            &mut spouse.address,
            &mut spouse.address2,
            &mut spouse.zip_code,
            &mut spouse.contact_number,
            &mut spouse.email,
        ] {
            trim(field);
        }
        if let Some(email) = &mut spouse.email {
            *email = email.to_lowercase();
        }
        if let Some(rdo) = &mut spouse.rdo_code {
            rdo.make_ascii_uppercase();
        }
        if *spouse == TaxpayerSpouse::default() {
            profile.spouse = None;
        }
    }
}

fn serialize_profile_xml(profile: &TaxpayerProfile) -> Result<String, ProfileStoreError> {
    let mut fields = vec![
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
        field_xml("lineOfBusiness", &escape_legacy_value(&profile.line_of_business)),
        field_xml("taxpayerClassification", &profile.taxpayer_classification),
        field_xml("psicCode", &escape_legacy_value(&profile.psic_code)),
        field_xml("taxpayerSize", &escape_legacy_value(&profile.taxpayer_size)),
    ];
    for (key, value) in [
        ("taxMateBirthDate", profile.birth_date.as_deref()),
        ("taxMateTradeName", profile.trade_name.as_deref()),
        ("taxMatePsocCode", profile.psoc_code.as_deref()),
        ("taxMateCitizenship", profile.citizenship.as_deref()),
        ("taxMateCivilStatus", profile.civil_status.as_deref()),
        ("taxMateTaxpayerType", profile.taxpayer_type.as_deref()),
    ] {
        if let Some(value) = value {
            fields.push(field_xml(key, &escape_legacy_value(value)));
        }
    }
    if let Some(spouse) = &profile.spouse {
        let value = serde_json::to_string(spouse).map_err(|error| {
            ProfileStoreError::new(format!("Could not save spouse details: {error}"))
        })?;
        fields.push(field_xml("taxMateSpouse", &escape_legacy_value(&value)));
    }
    fields.push("</div>".to_string());
    Ok(fields.join("\n"))
}

fn field_xml(key: &str, value: &str) -> String {
    format!("<div>{key}={value}{key}=</div>")
}

fn parse_profile_xml(xml: &str) -> Result<TaxpayerProfile, ProfileStoreError> {
    let tin1 = read_field(xml, "tin1");
    let tin2 = read_field(xml, "tin2");
    let tin3 = read_field(xml, "tin3");
    let branch_code = read_field(xml, "tin4");
    let spouse = read_app_profile_field(xml, "taxMateSpouse")?
        .map(|value| {
            serde_json::from_str(&value).map_err(|error| {
                ProfileStoreError::new(format!("Could not load spouse details: {error}"))
            })
        })
        .transpose()?;

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
        line_of_business: unescape_legacy_value(&read_field(xml, "lineOfBusiness"))?,
        trade_name: read_app_profile_field(xml, "taxMateTradeName")?,
        taxpayer_classification: read_field(xml, "taxpayerClassification"),
        taxpayer_type: read_app_profile_field(xml, "taxMateTaxpayerType")?,
        psic_code: unescape_legacy_value(&read_field(xml, "psicCode"))?,
        taxpayer_size: unescape_legacy_value(&read_field(xml, "taxpayerSize"))?,
        birth_date: read_app_profile_field(xml, "taxMateBirthDate")?,
        psoc_code: read_app_profile_field(xml, "taxMatePsocCode")?,
        citizenship: read_app_profile_field(xml, "taxMateCitizenship")?,
        civil_status: read_app_profile_field(xml, "taxMateCivilStatus")?,
        spouse,
    })
}

fn read_app_profile_field(xml: &str, key: &str) -> Result<Option<String>, ProfileStoreError> {
    // TaxMate fields always use the wrapper. Restrict the search so legacy
    // values containing a similarly named marker cannot become profile data.
    xml.split_once(&format!("<div>{key}="))
        .and_then(|(_, field)| field.split_once(&format!("{key}=</div>")))
        .map(|(value, _)| unescape_legacy_value(value))
        .transpose()
}

fn read_field(xml: &str, key: &str) -> String {
    let marker = format!("{key}=");
    // Field values can contain a marker such as "email=" as literal text.
    if let Some((_, field)) = xml.split_once(&format!("<div>{marker}")) {
        if let Some((value, _)) = field.split_once(&format!("{marker}</div>")) {
            return value.to_string();
        }
    }

    // Accept legacy files that use the original delimiters without the div wrapper.
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
