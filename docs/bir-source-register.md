# BIR source register

Reviewed 28 November 2026. The RDO validation list below has been compared with the cited authority. The form rows identify evidence for rebuilding or reviewing TaxMate fields and calculations. A public source link alone does not verify the implementation, grant redistribution rights to artwork, or establish eligibility for electronic filing.

## Revenue district identifiers

The regional-office tables on pages 1–4 of RAO 6-2025 identify 124 districts. Of these, 122 fit the three-character representation used by TaxMate's profile and form validation. Numeric codes are left-padded with zeroes. RAO 1-2026 and RAO 2-2026 rename districts while retaining their codes. RAO 5-2026 changes revenue-region abbreviations. [RAO 6-2025](https://bir-cdn.bir.gov.ph/BIR/pdf/RAO%20No.%206-2025.pdf), [RAO 1-2026](https://bir-cdn.bir.gov.ph/BIR/pdf/RAO%20No.%201-2026.pdf), [RAO 2-2026](https://bir-cdn.bir.gov.ph/BIR/pdf/RAO%20No.%202-2026.pdf), [2026 RAO register](https://www.bir.gov.ph/2026-Revenue-Administrative-Orders?label=2026&type=PAGE).

Two Davao districts have four-character codes, 113A and 113B. TaxMate's three-character taxpayer and spouse profile inputs cannot represent them. Confirm form-specific handling before enabling entry and export. Substituting 113 would discard the district distinction. [RAO 6-2025, page 4](https://bir-cdn.bir.gov.ph/BIR/pdf/RAO%20No.%206-2025.pdf), [RMC 117-2026 Annex 2, page 11](https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%20117-2026%20ANNEX%202-compressed.pdf).

The validator separately retains 16 previously accepted identifiers for compatibility with saved returns and profiles. These are 43A, 43B, 113, 116 through 127, and 132. Their current use requires separate authority covering those offices or periods. The regional list alone cannot settle the status of offices outside regional supervision. [TaxMate RDO validation](../src/lib/profiles/rdo-codes.ts).

## Payment and withholding

| Scope | Public evidence | Verification still needed |
| --- | --- | --- |
| 0605, September 2003 | The [BIR eBIRForms catalogue](https://www.bir.gov.ph/ebirforms) identifies the revision. The [public payment form](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No.%2061-2022%20Annex%20D.pdf) identifies its edition as July 1999. | Verify the September 2003 field and code tables. Reconcile later payment codes and effective periods in [RMC 104-2026](https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%20104-2026%20Digest.pdf), including MA and MC350/MC351, against the applicable payment type. |
| 1601-EQ, January 2018 | Page 1, Part II, items 19–30 of the [public return](https://bir-cdn.bir.gov.ph/local/pdf/1601-EQ%20Jan%202018%20Annex%20A.pdf) give row arithmetic, offsets and penalties. The [eFPS guide](https://efps.bir.gov.ph/efps-war/efpsJobaids.xhtml) indexes published instructions. | Map each TaxMate total, rounding decision and conditional requirement to the printed item and applicable regulation. |
| Expanded withholding codes | [RMO 46-2025 digest](https://bir-cdn.bir.gov.ph/BIR/pdf/RMO%20No.%2046-2025%20Digest.pdf) identifies six codes for top withholding agents paying manufacturers or direct importers of specified vehicles and parts, pharmaceuticals, or fuels, WI/WC 840, 850 and 860. [RMC 36-2026](https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2036-2026.pdf) identifies the software rollout. | Verify each code, income payment, individual/corporate treatment, rate, exceptions and effective period against the underlying regulations. A package rollout date does not establish when a tax rate takes effect. |

The outstanding tables and rules are [0605 tax types](../src/lib/forms/form-0605/tax-types.ts), [withholding definitions](../src/lib/forms/withholding-definitions.ts), [withholding rules](../src/lib/forms/withholding-rules.ts), [the shared ATC picker](../src/lib/forms/atc-picker.ts) and [1601-EQ ATCs](../src/lib/forms/form-1601-eq/form-1601-eq-atcs.ts). Each supported withholding revision needs its own printed return, schedules and applicable issuances.

## Individual income tax

The [BIR revision index](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No.%2055-2021%20Annex%20A.pdf) identifies several historical editions. The eight revisions in [individual-income field metadata](../src/lib/forms/individual-income/templates/fields.json) still require a field-by-field comparison. Taxpayer and spouse ownership, attachment rows and carryovers should be checked against the edition that produced the saved return. Rate periods may change within the lifetime of a printed revision.

| Printed revision | Source and scope |
| --- | --- |
| 1700, June 2013 | [RMC 26-2014](https://bir-cdn.bir.gov.ph/BIR/pdf/RMC_26-2014.pdf) and the revision index identify the edition. Exact page and item verification remains open. |
| 1700, January 2018 | [Public form](https://bir-cdn.bir.gov.ph/local/pdf/1700%20Jan%202018%20ENCS%20v6.pdf), including Part I taxpayer type and registration. |
| 1701, June 2013 | [Public form](https://bir-cdn.bir.gov.ph/BIR/pdf/82202BIR%20Form%201701.pdf), including taxpayer and spouse columns and supporting schedules. |
| 1701, January 2018 | [Public form](https://bir-cdn.bir.gov.ph/local/pdf/1701%20Jan%202018%20final%20with%20rates.pdf) and [mandatory attachment](https://bir-cdn.bir.gov.ph/local/pdf/1701%20Attachment%20Jan%202018%20ENCSv3.pdf) for activity schedules. |
| 1701A, January 2018 | [Public form](https://bir-cdn.bir.gov.ph/local/pdf/1701A%20Jan%202018%20v5%20with%20rates.pdf), including deduction and rate options. |
| 1701-MS, August 2024 | [Public form](https://bir-cdn.bir.gov.ph/BIR/pdf/1701-MS%20August%202024%20Fillable_01.pdf) and [guide](https://bir-cdn.bir.gov.ph/BIR/pdf/1701-MS%20Guide%20August%202024%20ENCS_Final.pdf) for eligible micro and small taxpayers. |
| 1701Q, July 2008 | [Historical guide](https://efps.bir.gov.ph/efps-war/EFPSWeb_war/help/help1701q_v2.html) and revision index. Confirm item mapping for the historical layout. |
| 1701Q, January 2018 | [Public form](https://bir-cdn.bir.gov.ph/local/pdf/1701Q%20Jan%202018%20final%20rev2_copy.pdf) and [RMC 32-2018](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No%2032-2018.pdf) for quarterly income and credits. |

## Corporate income tax

| Revision or variant | Public evidence | Open work |
| --- | --- | --- |
| 1702-EX, MX and RT, June 2013 | The [BIR revision index](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No.%2055-2021%20Annex%20A.pdf) lists all three editions. | Obtain the applicable original public pages and schedules and map their fields individually. |
| 1702-EX, January 2018 | The [BIR revision index](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No.%2055-2021%20Annex%20A.pdf) identifies January 2018 V2 and RMC 134-2019. | Verify the exact EX variant, its item definitions and supporting schedules. |
| 1702-MX, January 2018 | [Form](https://bir-cdn.bir.gov.ph/local/pdf/1702-MX%20Jan%202018%20ENCS%20Final%20with%20OSDv2.pdf) and [Part V attachments](https://bir-cdn.bir.gov.ph/local/pdf/1702-MX%20Attachment%20Jan%202018%20ENCS%20Final4.pdf). | Verify each regime's activity schedules, selectable ATCs and period-specific rate rules. |
| 1702-RT, January 2018 | [Form, page 2, Part IV, items 27–56](https://bir-cdn.bir.gov.ph/local/pdf/1702-RT%20Jan%202018%20ENCS%20Final%20v3.pdf) gives deductions, tax, credits, totals and rounding. | Independently reproduce the arithmetic, including the alternate deduction method, and check applicable rate periods. |
| CREATE-era annual variants | [RMC 50-2021](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No.%2050-2021.pdf) identifies the C variants for affected fiscal year filers. | Verify each variant's schedule and transitional rates for the relevant fiscal period. |
| 1702Q, July 2008, January 2018 and C variant | The [revision index](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No.%2055-2021%20Annex%20A.pdf) identifies editions. The [January 2018 form, page 2](https://bir-cdn.bir.gov.ph/local/pdf/RMC%20No.%203-2020%20Annex%20A%20-%201702Q%202018.pdf) gives the quarterly schedules. | Source the lists for both editions and the C variant, inspect the 2008 return, and check the correction to 1702Qv2018C in [RMC 104-2026](https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%20104-2026%20Digest.pdf). |

Files awaiting independent reconstruction include the page metadata in [exempt](../src/lib/forms/corporate-income/exempt/), [mixed](../src/lib/forms/corporate-income/mixed/) and [regular](../src/lib/forms/corporate-income/regular/), the regular-return arithmetic JSON files, and the [quarterly ATC tables](../src/lib/forms/corporate-income/quarterly/). Before marking a revision ready, record its exact authority, page or item, period, corresponding TaxMate field or rule, and a passing test using synthetic values. An existing regression test can preserve historical behavior without establishing its tax or publication basis.
