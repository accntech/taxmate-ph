//! Durable working-copy snapshots. A missing snapshot is distinct from an empty one,
//! allowing the frontend to import its old localStorage data without overwriting it.
use rusqlite::{Connection, OptionalExtension};
use serde::Deserialize;
use serde_json::Value;
use std::{
    collections::{HashMap, HashSet},
    path::Path,
    time::Duration,
};
use tauri::Manager;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct Snapshot {
    version: u32,
    returns: Vec<WorkingReturn>,
    archived_taxpayer_ids: Vec<String>,
}
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
struct WorkingReturn {
    id: String,
    taxpayer_id: String,
    form_code: String,
    return_period: String,
    status: String,
    updated_at: u64,
    values: HashMap<String, String>,
    final_flag: String,
    archived: Option<bool>,
}
fn validate(data: &Value) -> Result<(), String> {
    let parsed: Snapshot = serde_json::from_value(data.clone())
        .map_err(|e| format!("Invalid saved form data: {e}"))?;
    if parsed.version != 1 {
        return Err("Unsupported saved form data version.".into());
    }
    let mut ids = HashSet::new();
    for row in parsed.returns {
        if row.id.trim().is_empty()
            || row.taxpayer_id.trim().is_empty()
            || row.form_code.trim().is_empty()
            || !ids.insert(row.id)
        {
            return Err("Saved forms require unique IDs, taxpayer IDs and form codes.".into());
        }
        if ![
            "Draft",
            "Final",
            "Submitted",
            "For resubmission",
            "Simulated",
        ]
        .contains(&row.status.as_str())
        {
            return Err("Invalid saved form status.".into());
        }
        // Raw draft values and unknown form codes are intentionally retained verbatim.
        let _ = (
            row.return_period,
            row.updated_at,
            row.values,
            row.final_flag,
            row.archived,
        );
    }
    let _ = parsed.archived_taxpayer_ids;
    Ok(())
}
fn connect(root: &Path) -> Result<Connection, String> {
    std::fs::create_dir_all(root).map_err(|e| e.to_string())?;
    let connection = Connection::open(root.join("returns.sqlite3")).map_err(|e| e.to_string())?;
    connection
        .busy_timeout(Duration::from_secs(5))
        .map_err(|e| e.to_string())?;
    connection.execute_batch("CREATE TABLE IF NOT EXISTS working_return_snapshot (id INTEGER PRIMARY KEY CHECK(id = 1), data TEXT NOT NULL);").map_err(|e| e.to_string())?;
    Ok(connection)
}
pub fn load_from_root(root: &Path) -> Result<Option<Value>, String> {
    let connection = connect(root)?;
    let text: Option<String> = connection
        .query_row(
            "SELECT data FROM working_return_snapshot WHERE id = 1",
            [],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| e.to_string())?;
    text.map(|text| {
        let data: Value = serde_json::from_str(&text)
            .map_err(|e| format!("Saved form database is invalid: {e}"))?;
        validate(&data)?;
        Ok(data)
    })
    .transpose()
}
pub fn save_to_root(root: &Path, data: Value) -> Result<(), String> {
    validate(&data)?;
    let mut connection = connect(root)?;
    let transaction = connection.transaction().map_err(|e| e.to_string())?;
    transaction.execute("INSERT INTO working_return_snapshot(id, data) VALUES(1, ?1) ON CONFLICT(id) DO UPDATE SET data = excluded.data", [data.to_string()]).map_err(|e| e.to_string())?;
    transaction.commit().map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn load_working_returns(app: tauri::AppHandle) -> Result<Option<Value>, String> {
    let root = app.path().app_data_dir().map_err(|e| e.to_string())?;
    tauri::async_runtime::spawn_blocking(move || load_from_root(&root))
        .await
        .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn save_working_returns(app: tauri::AppHandle, data: Value) -> Result<(), String> {
    let root = app.path().app_data_dir().map_err(|e| e.to_string())?;
    tauri::async_runtime::spawn_blocking(move || save_to_root(&root, data))
        .await
        .map_err(|e| e.to_string())?
}
