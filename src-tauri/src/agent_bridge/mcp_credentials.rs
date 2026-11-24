use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
#[cfg(unix)]
use std::os::unix::fs::{MetadataExt, OpenOptionsExt};
use std::{
    fs::{self, OpenOptions},
    io::{self, Read, Write},
    path::Path,
};

pub(super) const TOKEN_FILE: &str = "agent-mcp-token";
const TOKEN_LENGTH: usize = 43;

pub(super) fn load_token(path: &Path) -> io::Result<String> {
    match read_token(path) {
        Ok(token) => return Ok(token),
        Err(error) if error.kind() == io::ErrorKind::NotFound => {}
        Err(error) => return Err(error),
    }

    let directory = path.parent().ok_or(io::ErrorKind::InvalidInput)?;
    fs::create_dir_all(directory)?;
    let mut random = [0; 32];
    getrandom::fill(&mut random).map_err(|error| io::Error::other(error.to_string()))?;
    let token = URL_SAFE_NO_PAD.encode(random);
    // The temporary file has private permissions on Unix and inherits the user's
    // local application data directory ACL on Windows.
    let mut file = tempfile::NamedTempFile::new_in(directory)?;
    file.write_all(token.as_bytes())?;
    file.as_file().sync_all()?;
    match file.persist_noclobber(path) {
        Ok(_) => Ok(token),
        Err(error) if error.error.kind() == io::ErrorKind::AlreadyExists => read_token(path),
        Err(error) => Err(error.error),
    }
}

fn read_token(path: &Path) -> io::Result<String> {
    let mut options = OpenOptions::new();
    options.read(true);
    #[cfg(unix)]
    options.custom_flags(libc::O_NOFOLLOW | libc::O_NONBLOCK);
    let file = options.open(path)?;
    let metadata = file.metadata()?;
    if !metadata.is_file() {
        return Err(io::ErrorKind::InvalidData.into());
    }

    #[cfg(unix)]
    {
        // SAFETY: geteuid reads the current process's effective user ID.
        let user = unsafe { libc::geteuid() };
        if metadata.uid() != user || metadata.mode() & 0o777 != 0o600 {
            return Err(io::Error::new(
                io::ErrorKind::PermissionDenied,
                "MCP token file must belong to the app user and have permissions 0600",
            ));
        }
    }

    let mut token = String::new();
    file.take((TOKEN_LENGTH + 1) as u64)
        .read_to_string(&mut token)?;
    if token.len() != TOKEN_LENGTH || URL_SAFE_NO_PAD.decode(&token).is_err() {
        return Err(io::Error::new(
            io::ErrorKind::InvalidData,
            "Invalid MCP token file",
        ));
    }
    Ok(token)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn creates_and_reuses_an_installation_token() {
        let directory = tempfile::tempdir().unwrap();
        let path = directory.path().join("app-data/agent-mcp-token");
        let token = load_token(&path).unwrap();

        assert_eq!(token.len(), 43);
        assert_eq!(load_token(&path).unwrap(), token);
        assert_eq!(std::fs::read_to_string(&path).unwrap(), token);
        assert_ne!(load_token(&path.with_extension("other")).unwrap(), token);
    }

    #[cfg(unix)]
    #[test]
    fn refuses_credentials_readable_by_other_accounts() {
        use std::{fs, os::unix::fs::PermissionsExt};

        let directory = tempfile::tempdir().unwrap();
        let path = directory.path().join("agent-mcp-token");
        load_token(&path).unwrap();
        assert_eq!(
            fs::metadata(&path).unwrap().permissions().mode() & 0o777,
            0o600
        );
        fs::set_permissions(&path, fs::Permissions::from_mode(0o644)).unwrap();
        assert_eq!(
            load_token(&path).unwrap_err().kind(),
            io::ErrorKind::PermissionDenied
        );
    }
}
