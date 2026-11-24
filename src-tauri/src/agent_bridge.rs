use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    fs::{self, File, OpenOptions},
    io::{self, Read, Write},
    os::fd::AsRawFd,
    os::unix::{
        fs::{DirBuilderExt, FileTypeExt, MetadataExt, OpenOptionsExt, PermissionsExt},
        net::{UnixListener, UnixStream},
    },
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicBool, AtomicU64, Ordering},
        mpsc, Arc, Mutex,
    },
    thread::{self, JoinHandle},
    time::{Duration, Instant},
};
use tauri::{AppHandle, Emitter, EventTarget, Manager, State, WebviewWindow};

const PREFERENCE_FILE: &str = "agent-bridge.json";
const SOCKET_ENV: &str = "TAXMATE_UI_AGENT_SOCKET";
const REQUEST_EVENT: &str = "taxmate-ui-agent-request";
const MAX_REQUEST_BYTES: usize = 16 * 1024;
const MAX_RESPONSE_BYTES: usize = 128 * 1024;
const SOCKET_TIMEOUT: Duration = Duration::from_secs(2);
const WEBVIEW_TIMEOUT: Duration = Duration::from_secs(8);

#[derive(Clone, Deserialize, Serialize)]
#[serde(tag = "method", rename_all = "lowercase", deny_unknown_fields)]
enum AgentRequest {
    Query {
        text: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        offset: Option<u32>,
    },
    Act {
        target: String,
        action: String,
        #[serde(skip_serializing_if = "Option::is_none")]
        args: Option<serde_json::Map<String, Value>>,
    },
}

#[derive(Clone, Serialize)]
struct WebviewRequest {
    id: String,
    request: AgentRequest,
}

struct PendingReply {
    id: String,
    sender: mpsc::Sender<Value>,
}

#[derive(Default)]
pub struct AgentBridge {
    runtime: Mutex<BridgeRuntime>,
    pending: Mutex<Option<PendingReply>>,
    next_request_id: AtomicU64,
}

#[derive(Default)]
struct BridgeRuntime {
    enabled: bool,
    worker: Option<BridgeWorker>,
    error: Option<String>,
}

struct BridgeWorker {
    active: Arc<AtomicBool>,
    thread: JoinHandle<()>,
}

#[derive(Serialize)]
pub struct AgentStatus {
    enabled: bool,
    running: bool,
    error: Option<String>,
}

impl BridgeRuntime {
    fn status(&self) -> AgentStatus {
        let running = self
            .worker
            .as_ref()
            .is_some_and(|worker| !worker.thread.is_finished());
        AgentStatus {
            enabled: self.enabled,
            running,
            error: self.error.clone().or_else(|| {
                (self.enabled && !running).then(|| "The local agent bridge stopped.".into())
            }),
        }
    }
}

#[derive(Debug)]
struct SocketFile {
    path: PathBuf,
    device: u64,
    inode: u64,
    _lock: File,
}

impl Drop for SocketFile {
    fn drop(&mut self) {
        if let Ok(metadata) = fs::symlink_metadata(&self.path) {
            if metadata.dev() == self.device && metadata.ino() == self.inode {
                let _ = fs::remove_file(&self.path);
            }
        }
    }
}

fn error_response(message: &str) -> Value {
    json!({ "ok": false, "error": message })
}

fn read_request(stream: &mut UnixStream) -> io::Result<AgentRequest> {
    let deadline = Instant::now() + SOCKET_TIMEOUT;
    let mut buffer = [0; 4096];
    let mut request = Vec::new();

    loop {
        let remaining = deadline.saturating_duration_since(Instant::now());
        if remaining.is_zero() {
            return Err(io::ErrorKind::TimedOut.into());
        }
        stream.set_read_timeout(Some(remaining))?;
        let bytes = stream.read(&mut buffer)?;
        if bytes == 0 {
            return Err(io::ErrorKind::UnexpectedEof.into());
        }
        let chunk = &buffer[..bytes];
        let newline = chunk.iter().position(|&byte| byte == b'\n');
        let data = &chunk[..newline.unwrap_or(bytes)];
        if request.len() + data.len() > MAX_REQUEST_BYTES {
            return Err(io::ErrorKind::InvalidData.into());
        }
        request.extend_from_slice(data);
        if newline.is_some() {
            return serde_json::from_slice(&request).map_err(io::Error::other);
        }
    }
}

fn handle_request(
    mut stream: UnixStream,
    dispatch: impl FnOnce(AgentRequest) -> Value,
) -> io::Result<()> {
    stream.set_write_timeout(Some(SOCKET_TIMEOUT))?;
    let response = match read_request(&mut stream) {
        Ok(request) => dispatch(request),
        Err(_) => error_response("Invalid UI agent request"),
    };
    let mut message = serde_json::to_vec(&response)?;
    if message.len() > MAX_RESPONSE_BYTES {
        message = serde_json::to_vec(&error_response("UI agent response is too large"))?;
    }
    message.push(b'\n');
    stream.write_all(&message)
}

fn bind_socket(path: &Path) -> io::Result<(UnixListener, SocketFile)> {
    let parent = path
        .parent()
        .filter(|_| path.is_absolute())
        .ok_or_else(|| {
            io::Error::new(io::ErrorKind::InvalidInput, "Socket path must be absolute")
        })?;
    let metadata = fs::symlink_metadata(parent)?;
    // SAFETY: geteuid reads the effective process user ID and takes no arguments.
    let uid = unsafe { libc::geteuid() };
    if !metadata.is_dir() || metadata.uid() != uid || metadata.mode() & 0o777 != 0o700 {
        return Err(io::Error::new(
            io::ErrorKind::PermissionDenied,
            "Socket directory must be owned by the app user with permissions 0700",
        ));
    }

    let lock = OpenOptions::new()
        .read(true)
        .write(true)
        .create(true)
        .mode(0o600)
        .custom_flags(libc::O_NOFOLLOW)
        .open(path.with_extension("lock"))?;
    // SAFETY: the descriptor stays open for the lifetime of this socket.
    if unsafe { libc::flock(lock.as_raw_fd(), libc::LOCK_EX | libc::LOCK_NB) } != 0 {
        let error = io::Error::last_os_error();
        return Err(if error.kind() == io::ErrorKind::WouldBlock {
            io::ErrorKind::AddrInUse.into()
        } else {
            error
        });
    }
    match fs::symlink_metadata(path) {
        Ok(existing) if existing.file_type().is_socket() && existing.uid() == uid => {
            match UnixStream::connect(path) {
                Ok(_) => return Err(io::ErrorKind::AddrInUse.into()),
                Err(error) if error.kind() == io::ErrorKind::ConnectionRefused => {
                    let current = fs::symlink_metadata(path)?;
                    if current.dev() != existing.dev() || current.ino() != existing.ino() {
                        return Err(io::ErrorKind::AddrInUse.into());
                    }
                    fs::remove_file(path)?;
                }
                Err(error) => return Err(error),
            }
        }
        Ok(_) => return Err(io::ErrorKind::AddrInUse.into()),
        Err(error) if error.kind() == io::ErrorKind::NotFound => {}
        Err(error) => return Err(error),
    }

    let listener = UnixListener::bind(path)?;
    let metadata = fs::symlink_metadata(path)?;
    let socket = SocketFile {
        path: path.to_owned(),
        device: metadata.dev(),
        inode: metadata.ino(),
        _lock: lock,
    };
    fs::set_permissions(path, fs::Permissions::from_mode(0o600))?;
    Ok((listener, socket))
}

fn development_socket() -> Option<PathBuf> {
    if cfg!(dev) {
        std::env::var_os(SOCKET_ENV).map(PathBuf::from)
    } else {
        None
    }
}

fn socket_path(app: &AppHandle) -> io::Result<PathBuf> {
    if let Some(path) = development_socket() {
        return Ok(path);
    }
    let directory = app
        .path()
        .home_dir()
        .map_err(io::Error::other)?
        .join(".codex/taxmate-ui");
    fs::DirBuilder::new()
        .recursive(true)
        .mode(0o700)
        .create(&directory)?;
    Ok(directory.join("agent.sock"))
}

fn preference_path(app: &AppHandle) -> io::Result<PathBuf> {
    Ok(app
        .path()
        .app_config_dir()
        .map_err(io::Error::other)?
        .join(PREFERENCE_FILE))
}

fn read_preference(path: &Path) -> io::Result<Option<bool>> {
    match fs::read(path) {
        Ok(bytes) => serde_json::from_slice(&bytes)
            .map(Some)
            .map_err(io::Error::other),
        Err(error) if error.kind() == io::ErrorKind::NotFound => Ok(None),
        Err(error) => Err(error),
    }
}

fn write_preference(path: &Path, enabled: bool) -> io::Result<()> {
    let directory = path.parent().ok_or(io::ErrorKind::InvalidInput)?;
    fs::DirBuilder::new()
        .recursive(true)
        .mode(0o700)
        .create(directory)?;
    let mut temporary = tempfile::NamedTempFile::new_in(directory)?;
    serde_json::to_writer(temporary.as_file_mut(), &enabled).map_err(io::Error::other)?;
    temporary.as_file().sync_all()?;
    temporary.persist(path).map_err(|error| error.error)?;
    Ok(())
}

fn start_worker(
    path: &Path,
    dispatch: impl Fn(&AtomicBool, AgentRequest) -> Value + Send + 'static,
) -> io::Result<BridgeWorker> {
    let (listener, socket) = bind_socket(path)?;
    listener.set_nonblocking(true)?;
    let active = Arc::new(AtomicBool::new(true));
    let worker_active = Arc::clone(&active);
    let thread = thread::Builder::new()
        .name("taxmate-ui-agent".into())
        .spawn(move || {
            let _socket = socket;
            while worker_active.load(Ordering::Acquire) {
                match listener.accept() {
                    Ok((stream, _)) => {
                        let _ = handle_request(stream, |request| dispatch(&worker_active, request));
                    }
                    Err(error) if error.kind() == io::ErrorKind::Interrupted => continue,
                    Err(error) if error.kind() == io::ErrorKind::WouldBlock => {
                        thread::park_timeout(Duration::from_millis(30));
                    }
                    Err(error) => {
                        eprintln!("TaxMate UI agent listener stopped: {error}");
                        break;
                    }
                }
            }
        })?;
    Ok(BridgeWorker { active, thread })
}

fn stop_worker(bridge: &AgentBridge, runtime: &mut BridgeRuntime) {
    if let Some(worker) = runtime.worker.take() {
        worker.active.store(false, Ordering::Release);
        drop(bridge.pending.lock().unwrap().take());
        worker.thread.thread().unpark();
        let _ = worker.thread.join();
    }
}

fn apply_enabled(
    app: &AppHandle,
    bridge: &AgentBridge,
    runtime: &mut BridgeRuntime,
    enabled: bool,
) {
    runtime.enabled = enabled;
    runtime.error = None;
    if enabled && runtime.status().running {
        return;
    }
    stop_worker(bridge, runtime);
    if enabled {
        let app = app.clone();
        match socket_path(&app).and_then(|path| {
            start_worker(&path, move |active, request| {
                request_webview(&app, active, request)
            })
        }) {
            Ok(worker) => runtime.worker = Some(worker),
            Err(error) => {
                runtime.error = Some(format!("Could not start the local agent bridge: {error}"))
            }
        }
    }
}

pub fn start(app: &AppHandle) {
    let bridge = app.state::<AgentBridge>();
    let mut runtime = bridge.runtime.lock().unwrap();
    match preference_path(app).and_then(|path| read_preference(&path)) {
        Ok(saved) => apply_enabled(
            app,
            &bridge,
            &mut runtime,
            saved.unwrap_or_else(|| development_socket().is_some()),
        ),
        Err(error) => {
            runtime.error = Some(format!(
                "Could not read the agent bridge preference: {error}"
            ))
        }
    }
}

pub fn stop(app: &AppHandle) {
    let bridge = app.state::<AgentBridge>();
    let mut runtime = bridge.runtime.lock().unwrap();
    stop_worker(&bridge, &mut runtime);
}

fn request_webview(app: &AppHandle, active: &AtomicBool, request: AgentRequest) -> Value {
    let bridge = app.state::<AgentBridge>();
    let (sender, receiver) = mpsc::channel();
    let id = bridge
        .next_request_id
        .fetch_add(1, Ordering::Relaxed)
        .to_string();
    let emitted = {
        let mut pending = bridge.pending.lock().unwrap();
        if !active.load(Ordering::Acquire) {
            return error_response("The local agent bridge is disabled.");
        }
        *pending = Some(PendingReply {
            id: id.clone(),
            sender,
        });
        app.emit_to(
            EventTarget::webview_window("main"),
            REQUEST_EVENT,
            WebviewRequest { id, request },
        )
    };
    let response = match emitted {
        Ok(()) => receiver.recv_timeout(WEBVIEW_TIMEOUT).unwrap_or_else(|_| {
            error_response("TaxMate UI did not answer in time. Check the app before retrying.")
        }),
        Err(_) => error_response("TaxMate's main webview is unavailable"),
    };
    drop(bridge.pending.lock().unwrap().take());
    response
}

#[tauri::command]
pub fn taxmate_ui_agent_status(
    window: WebviewWindow,
    bridge: State<'_, AgentBridge>,
) -> Result<AgentStatus, &'static str> {
    if window.label() != "main" {
        return Err("Only the main window can access the agent bridge");
    }
    Ok(bridge.runtime.lock().unwrap().status())
}

#[tauri::command]
pub async fn taxmate_ui_agent_set_enabled(
    window: WebviewWindow,
    enabled: bool,
) -> Result<AgentStatus, String> {
    if window.label() != "main" {
        return Err("Only the main window can configure the agent bridge".into());
    }
    let app = window.app_handle().clone();
    tauri::async_runtime::spawn_blocking(move || {
        let bridge = app.state::<AgentBridge>();
        let mut runtime = bridge.runtime.lock().unwrap();
        preference_path(&app)
            .and_then(|path| write_preference(&path, enabled))
            .map_err(|error| format!("Could not save the agent bridge preference: {error}"))?;
        apply_enabled(&app, &bridge, &mut runtime, enabled);
        Ok(runtime.status())
    })
    .await
    .map_err(|error| error.to_string())?
}

#[tauri::command]
pub fn taxmate_ui_agent_reply(
    window: WebviewWindow,
    bridge: State<'_, AgentBridge>,
    id: String,
    response: Value,
) -> Result<(), &'static str> {
    if window.label() != "main" {
        return Err("Only the main webview can reply to the UI agent");
    }

    let mut pending = bridge.pending.lock().unwrap();
    if pending.as_ref().is_none_or(|request| request.id != id) {
        return Err("No matching UI agent request");
    }

    let valid = match response.get("ok").and_then(Value::as_bool) {
        Some(true) => response.get("result").is_some(),
        Some(false) => response.get("error").is_some_and(Value::is_string),
        None => false,
    };
    let response = if valid {
        response
    } else {
        error_response("Invalid response from TaxMate UI")
    };
    pending
        .take()
        .unwrap()
        .sender
        .send(response)
        .map_err(|_| "UI agent request has expired")
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::{
        fs,
        io::Read,
        os::unix::fs::{DirBuilderExt, PermissionsExt},
        thread,
    };

    fn exchange(
        request: &str,
        dispatch: impl FnOnce(AgentRequest) -> Value + Send + 'static,
    ) -> Value {
        let (mut client, server) = UnixStream::pair().unwrap();
        let worker = thread::spawn(|| handle_request(server, dispatch).unwrap());
        client.write_all(request.as_bytes()).unwrap();
        let mut reply = String::new();
        client.read_to_string(&mut reply).unwrap();
        worker.join().unwrap();
        serde_json::from_str(&reply).unwrap()
    }

    #[test]
    fn relays_a_valid_request_and_returns_its_response() {
        let reply = exchange(
            concat!(r#"{"method":"query","text":"Create return"}"#, "\n"),
            |request| {
                assert!(matches!(
                    request,
                    AgentRequest::Query { text, offset: None } if text == "Create return"
                ));
                json!({"ok": true, "result": []})
            },
        );
        assert_eq!(reply, json!({"ok": true, "result": []}));
    }

    #[test]
    fn relays_a_paginated_query() {
        let reply = exchange(
            concat!(r#"{"method":"query","text":"Draft","offset":20}"#, "\n"),
            |request| {
                assert!(matches!(
                    request,
                    AgentRequest::Query { text, offset: Some(20) } if text == "Draft"
                ));
                json!({"ok": true, "result": []})
            },
        );
        assert_eq!(reply, json!({"ok": true, "result": []}));
    }

    #[test]
    fn rejects_an_unrecognized_request_before_dispatch() {
        let reply = exchange("{\"method\":\"eval\"}\n", |_| {
            panic!("invalid request was dispatched")
        });
        assert_eq!(
            reply,
            json!({"ok": false, "error": "Invalid UI agent request"})
        );
    }

    #[test]
    fn preference_starts_unset_and_persists_on_and_off() {
        let directory = tempfile::tempdir().unwrap();
        let preference = directory.path().join(PREFERENCE_FILE);
        assert_eq!(read_preference(&preference).unwrap(), None);
        write_preference(&preference, true).unwrap();
        assert_eq!(read_preference(&preference).unwrap(), Some(true));
        write_preference(&preference, false).unwrap();
        assert_eq!(read_preference(&preference).unwrap(), Some(false));

        fs::write(&preference, "invalid").unwrap();
        assert!(read_preference(&preference).is_err());
    }

    #[test]
    fn stops_and_restarts_the_socket_listener() {
        let directory = tempfile::Builder::new()
            .prefix("tm-stop-")
            .permissions(fs::Permissions::from_mode(0o700))
            .tempdir_in("/tmp")
            .unwrap();
        let path = directory.path().join("agent.sock");
        let bridge = AgentBridge::default();
        let mut runtime = bridge.runtime.lock().unwrap();

        for _ in 0..2 {
            runtime.worker = Some(start_worker(&path, |_, _| json!({"ok": true})).unwrap());
            let mut client = UnixStream::connect(&path).unwrap();
            client.set_read_timeout(Some(SOCKET_TIMEOUT)).unwrap();
            client
                .write_all(concat!(r#"{"method":"query","text":""}"#, "\n").as_bytes())
                .unwrap();
            let mut reply = String::new();
            client.read_to_string(&mut reply).unwrap();
            assert_eq!(
                serde_json::from_str::<Value>(&reply).unwrap(),
                json!({"ok": true})
            );

            stop_worker(&bridge, &mut runtime);
            assert!(!path.exists());
            assert!(UnixStream::connect(&path).is_err());
        }
    }

    #[test]
    fn reclaims_a_stale_socket_but_preserves_ordinary_files() {
        let parent = tempfile::Builder::new()
            .prefix("tm-stale-")
            .permissions(fs::Permissions::from_mode(0o700))
            .tempdir_in("/tmp")
            .unwrap();
        let path = parent.path().join("agent.sock");
        drop(UnixListener::bind(&path).unwrap());

        let (listener, socket) = bind_socket(&path).unwrap();
        assert!(UnixStream::connect(&path).is_ok());
        drop(listener);
        drop(socket);

        fs::write(&path, "preserve").unwrap();
        assert!(bind_socket(&path).is_err());
        assert_eq!(fs::read_to_string(&path).unwrap(), "preserve");
    }

    #[test]
    fn requires_a_private_parent_and_keeps_an_existing_endpoint() {
        let parent = tempfile::Builder::new()
            .prefix("tm-test-")
            .permissions(fs::Permissions::from_mode(0o700))
            .tempdir_in("/tmp")
            .unwrap();
        let shared = parent.path().join("shared");
        fs::DirBuilder::new().mode(0o755).create(&shared).unwrap();
        assert_eq!(
            bind_socket(&shared.join("agent.sock")).unwrap_err().kind(),
            io::ErrorKind::PermissionDenied
        );
        let socket_path = parent.path().join("agent.sock");
        let (_listener, socket) = bind_socket(&socket_path).unwrap();
        assert_eq!(
            fs::metadata(&socket_path).unwrap().permissions().mode() & 0o777,
            0o600
        );
        assert_eq!(
            bind_socket(&socket_path).unwrap_err().kind(),
            io::ErrorKind::AddrInUse
        );
        assert!(UnixStream::connect(socket_path).is_ok());
        drop(socket);
        assert!(!parent.path().join("agent.sock").exists());
    }
}
