use std::fs;

use ebirforms_tauri_lib::profile_store::{
    list_taxpayer_profiles_from_root, save_taxpayer_profile_to_root, TaxpayerProfile,
};

fn sample_profile() -> TaxpayerProfile {
    TaxpayerProfile {
        id: "1234567890000".into(),
        tin1: "123".into(),
        tin2: "456".into(),
        tin3: "789".into(),
        branch_code: "0000".into(),
        rdo_code: "040".into(),
        taxpayer_name: "Sample Taxpayer".into(),
        taxpayer_name2: None,
        taxpayer_name3: None,
        address3: None,
        address: "123 Sample Street".into(),
        address2: "Barangay Example, Makati City".into(),
        zip_code: "1200".into(),
        contact_number: "09171234567".into(),
        category: "P".into(),
        email: "taxpayer@example.com".into(),
        line_of_business: String::new(),
        trade_name: None,
        taxpayer_classification: String::new(),
        taxpayer_type: None,
        psic_code: String::new(),
        taxpayer_size: String::new(),
        psoc_code: None,
        birth_date: None,
        citizenship: None,
        civil_status: None,
        spouse: None,
    }
}

#[test]
fn saves_taxpayer_profile_to_legacy_profile_folder() {
    let root = tempfile::tempdir().expect("temp app data root");
    let saved = save_taxpayer_profile_to_root(root.path(), sample_profile()).expect("save profile");

    assert!(saved.path.ends_with("profile/1234567890000.xml"));

    let xml = fs::read_to_string(saved.path).expect("profile xml");
    assert!(xml.contains("<div>fn=Sample%20Taxpayerfn=</div>"));
    assert!(xml.contains("<div>tin1=123tin1=</div>"));
    assert!(xml.contains("<div>tin4=0000tin4=</div>"));
    assert!(xml.contains("<div>rdo=040rdo=</div>"));
    assert!(xml.contains("<div>addr=123%20Sample%20Streetaddr=</div>"));
    assert!(xml.contains("<div>addr2=Barangay%20Example%2C%20Makati%20Cityaddr2=</div>"));
    assert!(xml.contains("<div>zip=1200zip=</div>"));
    assert!(xml.contains("<div>tel=09171234567tel=</div>"));
    assert!(xml.contains("<div>category=Pcategory=</div>"));
    assert!(xml.contains("<div>email=taxpayer@example.comemail=</div>"));
}

#[test]
fn lists_saved_taxpayer_profiles_from_disk() {
    let root = tempfile::tempdir().expect("temp app data root");
    save_taxpayer_profile_to_root(root.path(), sample_profile()).expect("save profile");

    let profiles = list_taxpayer_profiles_from_root(root.path()).expect("list profiles");

    assert_eq!(profiles, vec![sample_profile()]);
}

#[test]
fn saves_registered_continuations_including_explicit_empty_lines() {
    let root = tempfile::tempdir().expect("temp app data root");
    let mut profile = sample_profile();
    profile.taxpayer_name2 = Some("  Example & Company  ".into());
    profile.taxpayer_name3 = Some(String::new());
    profile.address3 = Some("Suite 3".into());
    save_taxpayer_profile_to_root(root.path(), profile.clone()).expect("save profile");

    profile.taxpayer_name2 = Some("Example & Company".into());
    assert_eq!(
        list_taxpayer_profiles_from_root(root.path()).expect("list profiles"),
        vec![profile]
    );
}

#[test]
fn reloads_email_containing_legacy_field_markers() {
    let root = tempfile::tempdir().expect("temp app data root");
    let mut profile = sample_profile();
    profile.email = "email=lineOfBusiness=taxpayer%41@example.com".into();
    profile.line_of_business = "Accounting".into();
    save_taxpayer_profile_to_root(root.path(), profile.clone()).expect("save profile");

    let profiles = list_taxpayer_profiles_from_root(root.path()).expect("list profiles");

    assert_eq!(profiles, vec![profile]);
}

#[test]
fn retains_business_and_tax_classification_in_profile_xml() {
    let root = tempfile::tempdir().expect("temp app data root");
    let mut data = serde_json::to_value(sample_profile()).expect("profile JSON");
    data["lineOfBusiness"] = serde_json::json!("Accounting & advisory / services");
    data["tradeName"] = serde_json::json!("  Álex & Reyes / Advisory  ");
    data["taxpayerClassification"] = serde_json::json!("N");
    data["psicCode"] = serde_json::json!("0123");
    data["taxpayerSize"] = serde_json::json!("small");
    let profile: TaxpayerProfile = serde_json::from_value(data).expect("new profile");
    save_taxpayer_profile_to_root(root.path(), profile).expect("save profile");
    let loaded = list_taxpayer_profiles_from_root(root.path()).expect("load profile");
    let result = serde_json::to_value(&loaded[0]).expect("loaded JSON");
    assert_eq!(result["lineOfBusiness"], "Accounting & advisory / services");
    assert_eq!(result["tradeName"], "Álex & Reyes / Advisory");
    assert_eq!(result["taxpayerClassification"], "N");
    assert_eq!(result["psicCode"], "0123");
    assert_eq!(result["taxpayerSize"], "small");
}

#[test]
fn loads_legacy_profiles_without_business_or_classification() {
    let root = tempfile::tempdir().expect("temp app data root");
    fs::create_dir(root.path().join("profile")).unwrap();
    fs::write(root.path().join("profile/1234567890000.xml"), "<div>fn=Legacyfn=</div><div>tin1=123tin1=</div>").unwrap();
    let loaded = list_taxpayer_profiles_from_root(root.path()).expect("legacy profile");
    let data = serde_json::to_value(&loaded[0]).unwrap();
    assert_eq!(data["lineOfBusiness"], "");
    assert_eq!(data["taxpayerClassification"], "");
    assert_eq!(data["psicCode"], "");
    assert_eq!(data["taxpayerSize"], "");
    for key in ["birthDate", "citizenship", "civilStatus", "spouse", "psocCode", "taxpayerType", "tradeName"] {
        assert!(data.get(key).is_none(), "{key} is optional in legacy profiles");
    }
}

#[test]
fn saves_individual_taxpayer_type_and_clears_it_for_non_individuals() {
    let root = tempfile::tempdir().unwrap();
    let mut data = serde_json::to_value(sample_profile()).unwrap();
    data["taxpayerClassification"] = serde_json::json!("I");
    for taxpayer_type in ["professional", "estate", "trust", "compensation", "mixed-income"] {
        data["taxpayerType"] = serde_json::json!(taxpayer_type);
        save_taxpayer_profile_to_root(root.path(), serde_json::from_value(data.clone()).unwrap()).unwrap();
        let loaded = list_taxpayer_profiles_from_root(root.path()).unwrap();
        assert_eq!(serde_json::to_value(&loaded[0]).unwrap()["taxpayerType"], taxpayer_type);
    }

    data["taxpayerClassification"] = serde_json::json!("N");
    save_taxpayer_profile_to_root(root.path(), serde_json::from_value(data).unwrap()).unwrap();
    let loaded = list_taxpayer_profiles_from_root(root.path()).unwrap();
    assert!(serde_json::to_value(&loaded[0]).unwrap().get("taxpayerType").is_none());
}

#[test]
fn reloads_optional_taxpayer_and_spouse_identity() {
    let root = tempfile::tempdir().expect("temp app data root");
    let mut data = serde_json::to_value(sample_profile()).expect("profile JSON");
    data["birthDate"] = serde_json::json!("1986-12-08");
    data["citizenship"] = serde_json::json!("Pilipino & Canadian");
    data["civilStatus"] = serde_json::json!("Married");
    data["spouse"] = serde_json::json!({
        "taxpayerName": "Éva Piñon",
        "tin1": "321", "tin2": "654", "tin3": "987",
        "branchCode": "00001", "rdoCode": "17A",
        "birthDate": "1988-04-10", "citizenship": "Pilipino",
        "address": "Phase 2 & Block 1", "address2": "Makati", "zipCode": "1200",
        "contactNumber": "09171234568", "email": "spouse@example.com"
    });
    let profile: TaxpayerProfile = serde_json::from_value(data.clone()).expect("profile from JSON");
    save_taxpayer_profile_to_root(root.path(), profile).expect("save profile");
    let profiles = list_taxpayer_profiles_from_root(root.path()).expect("reload profile");
    let loaded = serde_json::to_value(&profiles[0]).expect("loaded profile JSON");
    for key in ["birthDate", "citizenship", "civilStatus", "spouse"] {
        assert_eq!(loaded[key], data[key], "{key} round trip");
    }
}

#[test]
fn rejects_partial_spouse_tin_before_saving_profile() {
    let root = tempfile::tempdir().expect("temp app data root");
    let mut data = serde_json::to_value(sample_profile()).expect("profile JSON");
    data["spouse"] = serde_json::json!({ "tin1": "321" });
    let profile: TaxpayerProfile = serde_json::from_value(data).expect("profile from JSON");
    let error = save_taxpayer_profile_to_root(root.path(), profile).expect_err("partial spouse TIN");
    assert!(error.message.contains("spouse TIN"));
    assert!(!root.path().join("profile").exists());
}

#[test]
fn saves_and_clears_optional_psoc_code() {
    let root = tempfile::tempdir().unwrap();
    let mut data = serde_json::to_value(sample_profile()).unwrap();
    data["psocCode"] = serde_json::json!("0123");
    let profile = serde_json::from_value(data.clone()).unwrap();
    let saved = save_taxpayer_profile_to_root(root.path(), profile).unwrap();
    assert!(fs::read_to_string(&saved.path)
        .unwrap()
        .contains("<div>taxMatePsocCode=0123taxMatePsocCode=</div>"));
    let loaded = list_taxpayer_profiles_from_root(root.path()).unwrap();
    assert_eq!(serde_json::to_value(&loaded[0]).unwrap()["psocCode"], "0123");

    data["psocCode"] = serde_json::json!(" ");
    let profile = serde_json::from_value(data).unwrap();
    save_taxpayer_profile_to_root(root.path(), profile).unwrap();
    assert!(!fs::read_to_string(&saved.path).unwrap().contains("taxMatePsocCode="));
    let loaded = list_taxpayer_profiles_from_root(root.path()).unwrap();
    assert!(serde_json::to_value(&loaded[0]).unwrap().get("psocCode").is_none());
}

#[test]
fn rejects_invalid_psoc_codes_before_saving_profile() {
    let root = tempfile::tempdir().unwrap();
    for code in ["123", "12345", "12A4"] {
        let mut data = serde_json::to_value(sample_profile()).unwrap();
        data["psocCode"] = serde_json::json!(code);
        let profile = serde_json::from_value(data).unwrap();
        let error = save_taxpayer_profile_to_root(root.path(), profile).unwrap_err();
        assert!(error.message.contains("4-digit PSOC code"));
    }
    assert!(!root.path().join("profile").exists());
}

#[test]
fn preserves_three_digit_taxpayer_and_spouse_branches() {
    let root = tempfile::tempdir().expect("temp app data root");
    let mut data = serde_json::to_value(sample_profile()).unwrap();
    data["branchCode"] = serde_json::json!("007");
    data["spouse"] = serde_json::json!({ "tin1": "321", "tin2": "654", "tin3": "987", "branchCode": "009" });
    let profile: TaxpayerProfile = serde_json::from_value(data).unwrap();
    save_taxpayer_profile_to_root(root.path(), profile.clone()).expect("save three-digit branches");
    assert_eq!(list_taxpayer_profiles_from_root(root.path()).unwrap(), vec![profile]);
}
