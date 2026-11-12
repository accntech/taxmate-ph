# Local SFTP compatibility tests

The fixture starts a one-connection SSH/SFTP server on `127.0.0.1` with an ephemeral port and generated RSA host key. It uses synthetic credentials and captures uploaded bytes in a temporary directory. It never contacts BIR or modifies SSH services or user credentials.

Create an isolated Python environment and run the transport tests explicitly:

```sh
python3 -m venv /tmp/ebirforms-sftp-compat-venv
/tmp/ebirforms-sftp-compat-venv/bin/python -m pip install -r src-tauri/tests/fixtures/submission/sftp-requirements.txt
EBIRFORMS_LOCAL_SFTP_TEST_PYTHON=/tmp/ebirforms-sftp-compat-venv/bin/python cargo test --manifest-path src-tauri/Cargo.toml --lib submission::transport::tests -- --ignored --test-threads=1
```

The tests check binary transfer and the installer-compatible remote path, rejection of unknown/changed host keys before password authentication, and propagation of a server's rejected file CLOSE. An integrated `run_submission` test exercises both successful and rejected-CLOSE transfers with synthetic encrypted dispatcher settings: captured upload bytes decrypt to the explicit raw RDO payload, saved XML retains entity escaping, and only a completed upload receives final flag 1 and a history entry. The Python dependency is intentionally outside the Rust production runtime; the tests are ignored by the ordinary test command until this interpreter is supplied.

Production upload requires an OpenSSH known-hosts file at the path provided by the submission engine (`settings/bir-known-hosts` under app data). Provision the key through a trusted source. Unknown keys and changed keys are rejected without sending credentials or return data. The implementation does not trust a key merely because the server presented it, and does not write or replace trust entries.
