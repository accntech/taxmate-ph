# Installer submission compatibility fixtures

These fixtures use public synthetic keys and taxpayer values. They contain no
production passphrases, SFTP credentials, or real taxpayer returns.

`native-cipher-vectors.json` records ciphertext from the supplied `Encrypt.exe`
machine code, SHA-256
`429337f44f84b93cd1095df48c8f3265e5ede7c646d1b48d9b80f4f92de74d2c`.
The original x86 Init (`0x429d10`) and EncryptCBC (`0x429f00`) routines were replayed
in Unicorn 2.1.4 with the original Rijndael VMT at `0x434020`. Windows APIs and
network access were not used. The input pattern is `(index * 37 + 11) % 256` and
the key is SHA-256 of `public synthetic compatibility test`.

The eleven lengths cover empty input, partial and complete AES blocks, multiple
blocks, and the original stream's 8192-byte boundary. Larger vectors retain a
ciphertext SHA-256 instead of the entire hex output. Tests compare the app's
cipher output with these recorded original-instruction results, rather than
deriving expected ciphertext using the implementation under test.

`return-copy-vector.json` contains synthetic legacy pseudo-XML compressed with
Python zlib level 9 and encrypted with the same original cipher replay. It checks
that the app can decrypt and inflate independently produced return bytes. It is
not a complete capture of the Windows file/compression wrapper; different zlib
implementations can emit different valid deflate streams.

The original `TCompressionStream` constructor at `0x426940` maps compression enum
3 to zlib level 9, with zlib framing. Original cipher initialization encrypts a
zero block to form the initial IV; CBC has no padding, and a final partial block
is XORed with AES of the chaining state.

Frontend payload fixtures under `src/tests/lib/legacy/fixtures` record output
from replaying the original 1601-EQ `saveEncryptedProfile` serializer. Upload
records use original control IDs and raw values; escaped logical-field savefiles
remain separate. Windows ANSI encoding is not established; UTF-8 is retained and
non-ASCII BIR acceptance remains unverified.

The ordinary Rust suite runs offline helper/compatibility tests. The five
loopback tests are explicitly invoked with the interpreter and command described
in [sftp-tests.md](sftp-tests.md). They include a full submission-engine test with
manual synthetic dispatcher settings, so no dispatcher request is made.

Production trust uses OpenSSH known-host entries in app data at
`settings/bir-known-hosts`. Provision the dispatcher's upload-host public key from
a trusted source. For nondefault ports OpenSSH entries use `[hostname]:port`.
No production server key or acknowledgment endpoint is inferred from the
installer's accept-any-key uploader. TCP and I/O operations have timeouts; DNS
resolution follows the operating system resolver.
