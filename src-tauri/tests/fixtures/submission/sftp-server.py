"""One-connection loopback SFTP oracle. Synthetic credentials only; never contacts BIR."""
import json
from pathlib import Path, PurePosixPath
import socket
import sys
import time

import paramiko
from paramiko.sftp import CMD_CLOSE

result_path = Path(sys.argv[1])
fail_close = sys.argv[2] == "fail-close"
result = {"auth_attempts": 0, "uploads": {}}


def save_result():
    result_path.write_text(json.dumps(result))


class Auth(paramiko.ServerInterface):
    def check_auth_password(self, username, password):
        result["auth_attempts"] += 1
        save_result()
        if username == "fixture-user" and password == "fixture-password":
            return paramiko.AUTH_SUCCESSFUL
        return paramiko.AUTH_FAILED

    def get_allowed_auths(self, username):
        return "password"

    def check_channel_request(self, kind, chanid):
        return paramiko.OPEN_SUCCEEDED if kind == "session" else paramiko.OPEN_FAILED_ADMINISTRATIVELY_PROHIBITED


class Handle(paramiko.SFTPHandle):
    def __init__(self, path):
        super().__init__()
        self.path = path
        self.data = bytearray()

    def write(self, offset, data):
        end = offset + len(data)
        if end > len(self.data):
            self.data.extend(bytes(end - len(self.data)))
        self.data[offset:end] = data
        result["uploads"][self.path] = self.data.hex()
        save_result()
        return paramiko.SFTP_OK


class Files(paramiko.SFTPServerInterface):
    def open(self, path, flags, attr):
        parts = PurePosixPath(path).parts
        if len(parts) != 3 or parts[1] != "1601EQ" or ".." in parts:
            return paramiko.SFTP_PERMISSION_DENIED
        return Handle(path)


class Sftp(paramiko.SFTPServer):
    def _process(self, command, request_number, message):
        if fail_close and command == CMD_CLOSE:
            handle = message.get_binary()
            if handle in self.file_table:
                self.file_table.pop(handle).close()
                self._send_status(request_number, paramiko.SFTP_FAILURE, "fixture rejected close")
                return
        return super()._process(command, request_number, message)


key = paramiko.RSAKey.generate(2048)
listener = socket.socket()
listener.bind(("127.0.0.1", 0))
listener.listen(1)
listener.settimeout(15)
save_result()
print(json.dumps({"port": listener.getsockname()[1], "key_type": key.get_name(), "key": key.get_base64()}), flush=True)
transport = None
try:
    client, _ = listener.accept()
    transport = paramiko.Transport(client)
    transport.add_server_key(key)
    transport.set_subsystem_handler("sftp", Sftp, Files)
    transport.start_server(server=Auth())
    deadline = time.monotonic() + 15
    while transport.is_active() and time.monotonic() < deadline:
        time.sleep(0.01)
except (EOFError, OSError, paramiko.SSHException):
    pass
finally:
    if transport is not None:
        transport.close()
    listener.close()
    save_result()
