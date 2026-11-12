use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    collections::HashMap,
    fs,
    io::{self, Write},
    path::Path,
    sync::atomic::{AtomicU64, Ordering},
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::Manager;

#[derive(Clone, Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SubmittedReturn {
    pub id: String,
    /// Unix milliseconds. Imported legacy returns use the saved file's modification time.
    pub submitted_at: u64,
    pub form_code: String,
    pub return_period: String,
    pub taxpayer_name: String,
    pub tin: String,
    pub amount_due: String,
    pub amended: bool,
    pub save_path: String,
}

#[tauri::command]
pub async fn list_submitted_returns(app: tauri::AppHandle) -> Result<Vec<SubmittedReturn>, String> {
    let root = app
        .path()
        .app_data_dir()
        .map_err(|error| error.to_string())?;
    tauri::async_runtime::spawn_blocking(move || {
        load_history(&root).map_err(|error| error.to_string())
    })
    .await
    .map_err(|error| error.to_string())?
}

fn milliseconds(time: SystemTime) -> u64 {
    time.duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}

fn fields(xml: &str) -> HashMap<String, String> {
    let mut result = HashMap::new();
    for part in xml.split("<div>").skip(1) {
        let Some((record, _)) = part.split_once("</div>") else {
            continue;
        };
        let Some((key, rest)) = record.split_once('=') else {
            continue;
        };
        let Some(value) = rest.strip_suffix(&format!("{key}=")) else {
            continue;
        };
        result.insert(
            key.to_string(),
            value
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("&quot;", "\"")
                .replace("&apos;", "'")
                .replace("&amp;", "&"),
        );
    }
    result
}

fn metadata(
    path: &Path,
    xml: &str,
    form_code: &str,
    tin: &str,
    id: String,
    submitted_at: u64,
) -> io::Result<SubmittedReturn> {
    let values = fields(xml);
    if values.get("txtFinalFlag").map(String::as_str) != Some("1") {
        return Err(io::Error::other(
            "Only submitted returns belong in history.",
        ));
    }
    let field = |name: &str| {
        values
            .get(&format!("frm{form_code}:{name}"))
            .cloned()
            .unwrap_or_default()
    };
    let mut quarter = field("optQuarter");
    if quarter.is_empty() {
        quarter = (1..=4)
            .find(|number| field(&format!("optQuarter:{number}")) == "true")
            .map(|number| format!("Q{number}"))
            .unwrap_or_default();
    }
    let period = format!("{}{}", field("txtYear"), quarter);
    let filename_period = path
        .file_stem()
        .and_then(|s| s.to_str())
        .and_then(|s| s.split('-').nth(2))
        .unwrap_or_default()
        .split('V')
        .next()
        .unwrap_or_default();
    Ok(SubmittedReturn {
        id,
        submitted_at,
        form_code: form_code.into(),
        return_period: if quarter.is_empty() || field("txtYear").is_empty() {
            filename_period.into()
        } else {
            period
        },
        taxpayer_name: field("txtTaxpayerName"),
        tin: path
            .file_stem()
            .and_then(|s| s.to_str())
            .and_then(|s| s.split('-').next())
            .filter(|value| value.len() == 13 && value.bytes().all(|byte| byte.is_ascii_digit()))
            .unwrap_or(tin)
            .into(),
        amount_due: if field("txtTotalAmountDue").is_empty() {
            field("txtTax30")
        } else {
            field("txtTotalAmountDue")
        },
        amended: field("optAmendedReturn") == "Y" || field("optAmend:Y") == "true",
        save_path: path.to_string_lossy().into_owned(),
    })
}

fn persist(root: &Path, row: &SubmittedReturn) -> io::Result<()> {
    let dir = root.join("submitted-returns");
    fs::create_dir_all(&dir)?;
    let target = dir.join(format!("{}.json", row.id));
    // Separate staging names ensure readers never observe a partially written record.
    let staging = dir.join(format!("{}.{}.tmp", row.id, unique_id()));
    let mut file = fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&staging)?;
    let result = (|| {
        file.write_all(&serde_json::to_vec(row)?)?;
        file.sync_all()?;
        // Hard links publish atomically without replacing a previous immutable record.
        match fs::hard_link(&staging, &target) {
            Ok(()) => Ok(()),
            Err(error) if error.kind() == io::ErrorKind::AlreadyExists => Ok(()),
            Err(error) => Err(error),
        }
    })();
    let _ = fs::remove_file(staging);
    result
}

fn unique_id() -> String {
    static SEQUENCE: AtomicU64 = AtomicU64::new(0);
    format!(
        "{}-{}-{}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_nanos(),
        std::process::id(),
        SEQUENCE.fetch_add(1, Ordering::Relaxed)
    )
}

pub fn record_submission(
    root: &Path,
    path: &Path,
    xml: &str,
    form_code: &str,
    tin: &str,
) -> io::Result<()> {
    let row = metadata(
        path,
        xml,
        form_code,
        tin,
        unique_id(),
        milliseconds(SystemTime::now()),
    )?;
    persist(root, &row)
}

pub fn load_history(root: &Path) -> io::Result<Vec<SubmittedReturn>> {
    let dir = root.join("submitted-returns");
    fs::create_dir_all(&dir)?;
    let mut rows = Vec::<SubmittedReturn>::new();
    for entry in fs::read_dir(&dir)? {
        let path = entry?.path();
        if path.extension().and_then(|s| s.to_str()) == Some("json") {
            rows.push(serde_json::from_slice(&fs::read(path)?)?);
        }
    }
    let saved = root.join("savefile");
    if saved.is_dir() {
        for entry in fs::read_dir(saved)? {
            let entry = entry?;
            if !entry.file_type()?.is_file() {
                continue;
            }
            let path = entry.path();
            if path.extension().and_then(|s| s.to_str()) != Some("xml")
                || rows
                    .iter()
                    .any(|row| row.save_path == path.to_string_lossy())
            {
                continue;
            }
            let xml = fs::read_to_string(&path)?;
            let name = path
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or_default();
            let mut parts = name.split('-');
            let tin = parts.next().unwrap_or_default();
            let Some(form_code) = parts.next() else {
                continue;
            };
            let id = format!(
                "legacy-{:x}",
                Sha256::digest(path.to_string_lossy().as_bytes())
            );
            let time = milliseconds(entry.metadata()?.modified()?);
            if let Ok(row) = metadata(&path, &xml, form_code, tin, id, time) {
                persist(root, &row)?;
                rows.push(row);
            }
        }
    }
    rows.sort_by(|a, b| {
        b.submitted_at
            .cmp(&a.submitted_at)
            .then_with(|| b.id.cmp(&a.id))
    });
    Ok(rows)
}
