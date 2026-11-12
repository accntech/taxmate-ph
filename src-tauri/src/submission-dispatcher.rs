use super::{DispatcherSettings, SubmissionError};
use std::collections::BTreeMap;

// The installer accepts object literals, but its eval must never be reproduced.
// Parse a bounded, data-only scalar subset; require the entire input to be data.
const MAX_RESPONSE_BYTES: usize = 16 * 1024;

pub(super) fn parse(response: &str) -> Result<DispatcherSettings, SubmissionError> {
    if response.len() > MAX_RESPONSE_BYTES {
        return Err(invalid());
    }
    let mut reader = Reader {
        chars: response.chars().peekable(),
    };
    reader.expect('{')?;
    let mut fields = BTreeMap::new();
    if !reader.take('}') {
        loop {
            reader.space();
            let key = match reader.chars.peek() {
                Some('\'' | '"') => reader.string()?,
                _ => reader.identifier()?,
            };
            reader.expect(':')?;
            let value = reader.scalar()?;
            if fields.insert(key, value).is_some() {
                return Err(invalid());
            }
            if reader.take('}') {
                break;
            }
            reader.expect(',')?;
            if reader.take('}') {
                break;
            }
        }
    }
    reader.space();
    if reader.chars.next().is_some() {
        return Err(invalid());
    }
    if fields.contains_key("SSLPort") && fields.contains_key("sslPort") {
        return Err(invalid());
    }
    let mut field = |name: &str| fields.remove(name).flatten().unwrap_or_default();
    let mut settings = DispatcherSettings {
        mode: field("mode"),
        server: field("server"),
        ssl_port: field("SSLPort"),
        port: field("port"),
        username: field("username"),
        password: field("password"),
    };
    if settings.ssl_port.is_empty() {
        settings.ssl_port = field("sslPort");
    }
    if !is_open(&settings) {
        settings.mode = "0".into();
        return Ok(settings);
    }
    if settings.server.trim().is_empty()
        || settings.username.trim().is_empty()
        || settings.password.trim().is_empty()
        || settings
            .port
            .parse::<u16>()
            .ok()
            .filter(|p| *p > 0)
            .is_none()
    {
        return Err(SubmissionError::new(
            "Dispatcher returned incomplete or invalid connection settings.",
        ));
    }
    Ok(settings)
}

fn invalid() -> SubmissionError {
    // Never include the response: it contains connection credentials.
    SubmissionError::new("Invalid dispatcher response: expected a data-only object literal.")
}

fn is_open(settings: &DispatcherSettings) -> bool {
    !matches!(settings.mode.trim(), "" | "0")
}

pub(super) fn resolve_with(
    primary_url: &str,
    backup_url: &str,
    mut fetch: impl FnMut(&str) -> Result<DispatcherSettings, SubmissionError>,
) -> Result<(DispatcherSettings, String), SubmissionError> {
    if let Ok(settings) = fetch(primary_url) {
        if is_open(&settings) {
            return Ok((settings, primary_url.to_owned()));
        }
    }
    let settings = fetch(backup_url)?;
    if !is_open(&settings) {
        return Err(SubmissionError::new(
            "BIR online filing is currently closed or unavailable.",
        ));
    }
    Ok((settings, backup_url.to_owned()))
}

struct Reader<'a> {
    chars: std::iter::Peekable<std::str::Chars<'a>>,
}

impl Reader<'_> {
    fn space(&mut self) {
        while self.chars.peek().is_some_and(|c| c.is_ascii_whitespace()) {
            self.chars.next();
        }
    }
    fn take(&mut self, expected: char) -> bool {
        self.space();
        if self.chars.peek() == Some(&expected) {
            self.chars.next();
            true
        } else {
            false
        }
    }
    fn expect(&mut self, expected: char) -> Result<(), SubmissionError> {
        if self.take(expected) {
            Ok(())
        } else {
            Err(invalid())
        }
    }
    fn identifier(&mut self) -> Result<String, SubmissionError> {
        let first = self.chars.next().ok_or_else(invalid)?;
        if !(first.is_ascii_alphabetic() || matches!(first, '_' | '$')) {
            return Err(invalid());
        }
        let mut result = String::from(first);
        while self
            .chars
            .peek()
            .is_some_and(|c| c.is_ascii_alphanumeric() || matches!(c, '_' | '$'))
        {
            result.push(self.chars.next().unwrap());
        }
        Ok(result)
    }
    fn scalar(&mut self) -> Result<Option<String>, SubmissionError> {
        self.space();
        if matches!(self.chars.peek(), Some('\'' | '"')) {
            return self.string().map(Some);
        }
        let mut token = String::new();
        while self
            .chars
            .peek()
            .is_some_and(|c| !c.is_ascii_whitespace() && !matches!(c, ',' | '}'))
        {
            token.push(self.chars.next().unwrap());
        }
        if token == "null" {
            return Ok(None);
        }
        let value: serde_json::Number = serde_json::from_str(&token).map_err(|_| invalid())?;
        Ok(Some(value.to_string()))
    }
    fn string(&mut self) -> Result<String, SubmissionError> {
        let quote = self.chars.next().ok_or_else(invalid)?;
        let mut result = String::new();
        loop {
            let c = self.chars.next().ok_or_else(invalid)?;
            if c == quote {
                return Ok(result);
            }
            if c < ' ' {
                return Err(invalid());
            }
            if c != '\\' {
                result.push(c);
                continue;
            }
            result.push(match self.chars.next().ok_or_else(invalid)? {
                '\'' => '\'',
                '"' => '"',
                '\\' => '\\',
                '/' => '/',
                'b' => '\u{0008}',
                'f' => '\u{000c}',
                'n' => '\n',
                'r' => '\r',
                't' => '\t',
                'u' => {
                    let high = self.hex_quad()?;
                    let codepoint = if (0xd800..=0xdbff).contains(&high) {
                        if self.chars.next() != Some('\\') || self.chars.next() != Some('u') {
                            return Err(invalid());
                        }
                        let low = self.hex_quad()?;
                        if !(0xdc00..=0xdfff).contains(&low) {
                            return Err(invalid());
                        }
                        0x10000 + ((high - 0xd800) << 10) + low - 0xdc00
                    } else {
                        high
                    };
                    char::from_u32(codepoint).ok_or_else(invalid)?
                }
                _ => return Err(invalid()),
            });
        }
    }
    fn hex_quad(&mut self) -> Result<u32, SubmissionError> {
        let mut value = 0;
        for _ in 0..4 {
            value = value * 16
                + self
                    .chars
                    .next()
                    .and_then(|c| c.to_digit(16))
                    .ok_or_else(invalid)?;
        }
        Ok(value)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn open() -> DispatcherSettings {
        DispatcherSettings {
            mode: "2".into(),
            server: "host.test".into(),
            ssl_port: "990".into(),
            port: "22".into(),
            username: "u".into(),
            password: "p".into(),
        }
    }

    #[test]
    fn parses_literal_numeric_fields_and_trailing_comma() {
        let s = parse("{mode:2,server:'host.test',SSLPort:990,port:22,username:'u',password:'p',}")
            .unwrap();
        assert_eq!(s, open());
    }

    #[test]
    fn preserves_apostrophes_and_escapes() {
        let s = parse(r#"{"mode":"2","server":"host.test","sslPort":"990","port":"22","username":"O'Brien","password":"p\\word\u0021"}"#).unwrap();
        assert_eq!(s.username, "O'Brien");
        assert_eq!(s.password, "p\\word!");
        let s = parse(r#"{'mode':'2','server':'host.test','sslPort':'990','port':'22','username':'O\'Brien','password':'p\\word\u0021'}"#).unwrap();
        assert_eq!(s.username, "O'Brien");
        assert_eq!(s.password, "p\\word!");
    }

    #[test]
    fn accepts_partial_closed_responses() {
        for value in ["{}", "{mode:null}", "{mode:0}", "{mode:'0',server:null}"] {
            let s = parse(value).unwrap();
            assert_eq!(s.mode, "0");
        }
    }

    #[test]
    fn rejects_expressions_and_executable_suffixes() {
        for value in [
            "{mode:run()}",
            "{mode:2+1}",
            "{mode:'0'};run()",
            "({mode:'0'})",
            "{mode:'0',x:()=>1}",
            "{mode:'0',x:{}}",
            "{mode:'0',x:true}",
        ] {
            assert!(
                parse(value).is_err(),
                "accepted executable or unsupported input"
            );
        }
    }

    #[test]
    fn handles_unicode_strings_and_rejects_ambiguous_or_malformed_data() {
        let s = parse(r#"{mode:'0',username:'\uD83D\uDE00'}"#).unwrap();
        assert_eq!(s.username, "😀");
        for value in [
            "{mode:'0',mode:'2'}",
            "{mode:'0',SSLPort:990,sslPort:22}",
            r#"{mode:'0',password:'\uD800'}"#,
            r#"{mode:'0',password:'\uDC00'}"#,
            r#"{mode:'0',password:'\x20'}"#,
            "{mode:'0',password:'unterminated}",
            "{mode:'0',port:01}",
            "{mode:'0',port:NaN}",
        ] {
            assert!(parse(value).is_err());
        }
        let error = parse("{password:'synthetic-secret',mode:run()}").unwrap_err();
        assert!(!error.message.contains("synthetic-secret"));
    }

    #[test]
    fn rejects_incomplete_open_and_invalid_ports() {
        for value in [
            r#"{"mode":"2","server":"","sslPort":"990","port":"22","username":"u","password":"p"}"#,
            r#"{"mode":"2","server":"host.test","sslPort":"990","port":"65536","username":"u","password":"p"}"#,
        ] {
            assert!(parse(value).is_err());
        }
    }

    #[test]
    fn closed_primary_uses_backup_once_and_reports_backup_url() {
        let mut requests = Vec::new();
        let (_, url) = resolve_with("primary", "backup", |url| {
            requests.push(url.to_owned());
            let mut s = open();
            if url == "primary" {
                s.mode = "0".into();
            }
            Ok(s)
        })
        .unwrap();
        assert_eq!(url, "backup");
        assert_eq!(requests, ["primary", "backup"]);
    }

    #[test]
    fn both_closed_fail_without_extra_retry() {
        let mut calls = 0;
        assert!(resolve_with("primary", "backup", |_| {
            calls += 1;
            let mut s = open();
            s.mode.clear();
            Ok(s)
        })
        .is_err());
        assert_eq!(calls, 2);
    }

    #[test]
    fn open_primary_skips_backup() {
        let mut calls = 0;
        let (_, url) = resolve_with("primary", "backup", |_| {
            calls += 1;
            Ok(open())
        })
        .unwrap();
        assert_eq!(calls, 1);
        assert_eq!(url, "primary");
    }

    #[test]
    fn failed_primary_uses_backup_and_failed_backup_is_final() {
        let mut calls = 0;
        let result = resolve_with("primary", "backup", |_| {
            calls += 1;
            Err(SubmissionError::new("offline"))
        });
        assert!(result.is_err());
        assert_eq!(calls, 2);
        let (_, url) = resolve_with("primary", "backup", |url| {
            if url == "primary" {
                Err(SubmissionError::new("offline"))
            } else {
                Ok(open())
            }
        })
        .unwrap();
        assert_eq!(url, "backup");
    }

    #[test]
    fn rejects_oversized_response() {
        let value = format!("{{\"mode\":\"0\",\"server\":\"{}\",\"sslPort\":\"990\",\"port\":\"22\",\"username\":\"u\",\"password\":\"p\"}}", "x".repeat(65536));
        assert!(parse(&value).is_err());
    }
}
