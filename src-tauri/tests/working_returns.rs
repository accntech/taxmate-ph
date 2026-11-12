use ebirforms_tauri_lib::working_returns::{load_from_root, save_to_root};
use serde_json::json;

fn data() -> serde_json::Value {
    json!({"version":1,"returns":[{"id":"return-1","taxpayerId":"1234567890000","formCode":"0619E","returnPeriod":"202601","status":"Draft","updatedAt":1,"values":{"amount":"unfinished.","name":"A & B"},"finalFlag":"0"}],"archivedTaxpayerIds":["archived-profile"]})
}
#[test]
fn distinguishes_unmigrated_database_and_round_trips_raw_draft_values() {
    let root = tempfile::tempdir().unwrap();
    assert_eq!(load_from_root(root.path()).unwrap(), None);
    save_to_root(root.path(), data()).unwrap();
    assert_eq!(load_from_root(root.path()).unwrap(), Some(data()));
    assert!(std::fs::read(root.path().join("returns.sqlite3"))
        .unwrap()
        .starts_with(b"SQLite format 3"));
}
#[test]
fn rejects_bad_snapshot_without_losing_previous_records() {
    let root = tempfile::tempdir().unwrap();
    save_to_root(root.path(), data()).unwrap();
    let mut invalid = data();
    invalid["returns"][0]["values"]["amount"] = json!(42);
    assert!(save_to_root(root.path(), invalid).is_err());
    let mut duplicate = data();
    duplicate["returns"]
        .as_array_mut()
        .unwrap()
        .push(data()["returns"][0].clone());
    assert!(save_to_root(root.path(), duplicate).is_err());
    assert_eq!(load_from_root(root.path()).unwrap(), Some(data()));
}
#[test]
fn retains_unknown_form_versions_and_simulated_status_for_compatibility() {
    let root = tempfile::tempdir().unwrap();
    let mut snapshot = data();
    snapshot["returns"][0]["formCode"] = json!("future-form");
    snapshot["returns"][0]["status"] = json!("Simulated");
    save_to_root(root.path(), snapshot.clone()).unwrap();
    assert_eq!(load_from_root(root.path()).unwrap(), Some(snapshot));
}
