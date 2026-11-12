# 1601EQ RDO compatibility fixture

`1601eq-rdo.xml` is the output of the supplied January 2018
`BIR-Form1601EQ.hta` function `saveEncryptedProfile(true)` (lines 1913–1999),
replayed with synthetic form controls and in-memory stubs for filesystem,
encryption, and unrelated UI functions. No installer executable was launched and
no network or BIR service was accessed.

`1601eq-rdo.json` records the original HTA/ATC-file SHA-256 identities, synthetic
logical app values, original DOM controls and values supplied to the replay, and
original `#xmlFormat` whitespace. The RDO serializer itself was taken unchanged
from the installer; its output was not produced by the app serializer under test.

The control sequence follows `frmMain` in the original HTA, including the RDO
select created by `getRdo`, six ATC rows created by `populateAtcPart2`, and the
private-category checkbox list created by `changedrpATCList`. `originalAtcCodes`
records the original category-specific order from the first `atcCount` entries in
`resources/xml/atcCodes.xml`. The current app catalogue is checked against it.
Values use an amended Q2 private return, one ATC, and synthetic special-character
text. Modal username/secret fields and the export-drive selector remain empty.

To reproduce, load the recorded controls as `frmMain.elements`, return recorded
`xmlFormat` and `All Rights Reserved BIR 2012.` from the corresponding DOM nodes,
make `saveXML` return true, capture `CreateTextFile().write`, and stub `EncryptFile`
and UI disabling. Then invoke the original function with `true`. The result is
plaintext immediately before compression and encryption.

This fixture verifies logical records and JavaScript string serialization. It
does not establish the original Windows ANSI encoding or BIR acceptance. The
app deliberately retains UTF-8 rather than guessing a lossy Windows codepage.
