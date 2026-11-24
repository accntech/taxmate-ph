use ebirforms_tauri_lib::working_returns::{delete_drafts_from_root, load_from_root, save_to_root};
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

#[test]
fn bulk_deletion_rechecks_current_owner_status_and_archive_state() {
    let root = tempfile::tempdir().unwrap();
    let mut snapshot = data();
    let draft = snapshot["returns"][0].clone();
    let taxpayer = draft["taxpayerId"].as_str().unwrap();
    let mut confirmed_ids = vec!["return-1".to_owned()];
    for id in ["second", "moved", "finalized", "archived", "submitted"] {
        let mut row = draft.clone();
        row["id"] = json!(id);
        snapshot["returns"].as_array_mut().unwrap().push(row);
        confirmed_ids.push(id.to_owned());
    }
    save_to_root(root.path(), snapshot.clone()).unwrap();

    let returns = snapshot["returns"].as_array_mut().unwrap();
    returns[2]["taxpayerId"] = json!("different-taxpayer");
    returns[3]["status"] = json!("Final");
    returns[4]["archived"] = json!(true);
    returns[5]["status"] = json!("Submitted");
    let mut new_draft = draft.clone();
    new_draft["id"] = json!("new-draft");
    new_draft["unknownLegacyField"] = json!("kept");
    returns.push(new_draft);
    save_to_root(root.path(), snapshot.clone()).unwrap();

    let result = delete_drafts_from_root(root.path(), taxpayer, &confirmed_ids).unwrap();
    let expected_ids = vec!["return-1", "second"];
    assert_eq!(result.deleted_ids, expected_ids);
    snapshot["returns"].as_array_mut().unwrap().drain(..2);
    assert_eq!(result.data, snapshot);
    assert_eq!(load_from_root(root.path()).unwrap(), Some(snapshot.clone()));

    let retry = delete_drafts_from_root(root.path(), taxpayer, &confirmed_ids).unwrap();
    assert!(retry.deleted_ids.is_empty());
    assert_eq!(retry.data, snapshot);
}

#[test]
fn bulk_deletion_leaves_the_snapshot_intact_if_the_write_fails() {
    let root = tempfile::tempdir().unwrap();
    save_to_root(root.path(), data()).unwrap();
    let connection = rusqlite::Connection::open(root.path().join("returns.sqlite3")).unwrap();
    connection
        .execute_batch(
            "CREATE TRIGGER fail_bulk_delete BEFORE UPDATE ON working_return_snapshot
         BEGIN SELECT RAISE(ABORT, 'simulated write failure'); END;",
        )
        .unwrap();
    let result = delete_drafts_from_root(root.path(), "1234567890000", &["return-1".to_owned()]);
    assert!(result.unwrap_err().contains("simulated write failure"));
    assert_eq!(load_from_root(root.path()).unwrap(), Some(data()));
}
