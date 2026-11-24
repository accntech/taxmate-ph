use super::{handle_request, write_json, AgentRequest, SOCKET_TIMEOUT};
use base64::{engine::general_purpose::STANDARD, Engine};
use hmac::{Hmac, Mac};
use serde::Serialize;
use serde_json::Value;
use sha2::Sha256;
use std::{
    fs::{self, File, OpenOptions, TryLockError},
    io::{self, Read, Write},
    net::{Ipv4Addr, TcpListener, TcpStream},
    path::{Path, PathBuf},
    sync::atomic::AtomicBool,
    time::Instant,
};

pub(super) const ENDPOINT_FILE: &str = "agent-bridge-endpoint.json";
type Secret = [u8; 32];

#[derive(Serialize)]
struct ConnectionSettings {
    port: u16,
    key: String,
}

pub(super) struct Endpoint {
    listener: TcpListener,
    path: PathBuf,
    key: Secret,
    _lock: File,
}

impl Endpoint {
    pub(super) fn bind(path: &Path) -> io::Result<Self> {
        let directory = path.parent().ok_or(io::ErrorKind::InvalidInput)?;
        // Windows puts the endpoint in the current user's LocalAppData directory.
        fs::create_dir_all(directory)?;
        let lock = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .truncate(false)
            .open(path.with_extension("lock"))?;
        lock.try_lock().map_err(|error| match error {
            TryLockError::WouldBlock => io::ErrorKind::AddrInUse.into(),
            TryLockError::Error(error) => error,
        })?;

        let listener = TcpListener::bind((Ipv4Addr::LOCALHOST, 0))?;
        listener.set_nonblocking(true)?;
        let key = random_secret()?;
        write_json(
            path,
            &ConnectionSettings {
                port: listener.local_addr()?.port(),
                key: STANDARD.encode(key),
            },
        )?;

        Ok(Self {
            listener,
            path: path.to_owned(),
            key,
            _lock: lock,
        })
    }

    pub(super) fn accept_and_dispatch(
        &self,
        active: &AtomicBool,
        dispatch: impl FnOnce(&AtomicBool, AgentRequest) -> Value,
    ) -> io::Result<()> {
        let (mut stream, _) = self.listener.accept()?;
        // The listener polls for connections. Each accepted stream uses bounded blocking I/O.
        if stream.set_nonblocking(false).is_ok() && authenticate(&mut stream, &self.key).is_ok() {
            let _ = handle_request(stream, TcpStream::set_read_timeout, |request| {
                dispatch(active, request)
            });
        }
        Ok(())
    }
}

impl Drop for Endpoint {
    fn drop(&mut self) {
        // The lock is still held, so a second app instance cannot publish over this endpoint.
        let _ = fs::remove_file(&self.path);
    }
}

fn random_secret() -> io::Result<Secret> {
    let mut secret = [0; 32];
    getrandom::fill(&mut secret).map_err(|error| io::Error::other(error.to_string()))?;
    Ok(secret)
}

fn proof(key: &Secret, role: &[u8], client_nonce: &Secret, server_nonce: &Secret) -> Hmac<Sha256> {
    let mut mac = Hmac::<Sha256>::new_from_slice(key).expect("valid HMAC key length");
    mac.update(role);
    mac.update(client_nonce);
    mac.update(server_nonce);
    mac
}

fn read_auth_field(stream: &mut TcpStream, deadline: Instant) -> io::Result<Secret> {
    let mut field = [0; 32];
    let mut filled = 0;
    while filled < field.len() {
        let remaining = deadline.saturating_duration_since(Instant::now());
        if remaining.is_zero() {
            return Err(io::ErrorKind::TimedOut.into());
        }
        stream.set_read_timeout(Some(remaining))?;
        match stream.read(&mut field[filled..]) {
            Ok(0) => return Err(io::ErrorKind::UnexpectedEof.into()),
            Ok(count) => filled += count,
            Err(error) if error.kind() == io::ErrorKind::Interrupted => {}
            Err(error) => return Err(error),
        }
    }
    Ok(field)
}

fn authenticate(stream: &mut TcpStream, key: &Secret) -> io::Result<()> {
    stream.set_write_timeout(Some(SOCKET_TIMEOUT))?;
    let deadline = Instant::now() + SOCKET_TIMEOUT;
    let client_nonce = read_auth_field(stream, deadline)?;
    let server_nonce = random_secret()?;
    let server_proof = proof(key, b"server", &client_nonce, &server_nonce).finalize();
    let mut challenge = [0; 64];
    challenge[..32].copy_from_slice(&server_nonce);
    challenge[32..].copy_from_slice(&server_proof.into_bytes());
    stream.write_all(&challenge)?;

    let client_proof = read_auth_field(stream, deadline)?;
    proof(key, b"client", &client_nonce, &server_nonce)
        .verify_slice(&client_proof)
        .map_err(|_| io::ErrorKind::PermissionDenied.into())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::agent_bridge::{spawn_worker, stop_worker, AgentBridge};
    use serde_json::json;

    #[test]
    fn publishes_authenticates_and_clears_the_loopback_endpoint() {
        let directory = tempfile::tempdir().unwrap();
        let path = directory.path().join(ENDPOINT_FILE);
        let bridge = AgentBridge::default();
        let mut runtime = bridge.runtime.lock().unwrap();

        for _ in 0..2 {
            let endpoint = Endpoint::bind(&path).unwrap();
            assert_eq!(
                Endpoint::bind(&path).err().unwrap().kind(),
                io::ErrorKind::AddrInUse
            );
            let settings: Value = serde_json::from_slice(&fs::read(&path).unwrap()).unwrap();
            let port = u16::try_from(settings["port"].as_u64().unwrap()).unwrap();
            let key: Secret = STANDARD
                .decode(settings["key"].as_str().unwrap())
                .unwrap()
                .try_into()
                .unwrap();
            runtime.worker =
                Some(
                    spawn_worker(move |active| {
                        endpoint.accept_and_dispatch(active, |_, request| {
                    assert!(matches!(request, AgentRequest::Query { text, .. } if text == "draft"));
                    json!({ "ok": true })
                })
                    })
                    .unwrap(),
                );

            let connect = || {
                let stream = TcpStream::connect((Ipv4Addr::LOCALHOST, port)).unwrap();
                stream.set_read_timeout(Some(SOCKET_TIMEOUT)).unwrap();
                stream
            };
            let client_nonce = [7; 32];
            let mut unauthorized = connect();
            unauthorized.write_all(&client_nonce).unwrap();
            let mut challenge = [0; 64];
            unauthorized.read_exact(&mut challenge).unwrap();
            unauthorized.write_all(&[0; 32]).unwrap();
            let mut reply = Vec::new();
            unauthorized.read_to_end(&mut reply).unwrap();
            assert!(reply.is_empty());

            let mut client = connect();
            client.write_all(&client_nonce).unwrap();
            client.read_exact(&mut challenge).unwrap();
            let nonce = challenge[..32].try_into().unwrap();
            proof(&key, b"server", &client_nonce, &nonce)
                .verify_slice(&challenge[32..])
                .unwrap();
            client
                .write_all(
                    &proof(&key, b"client", &client_nonce, &nonce)
                        .finalize()
                        .into_bytes(),
                )
                .unwrap();
            client
                .write_all(b"{\"method\":\"query\",\"text\":\"draft\"}\n")
                .unwrap();
            client.read_to_end(&mut reply).unwrap();
            assert_eq!(
                serde_json::from_slice::<Value>(&reply).unwrap(),
                json!({ "ok": true })
            );

            stop_worker(&bridge, &mut runtime);
            assert!(!path.exists());
        }
    }
}
