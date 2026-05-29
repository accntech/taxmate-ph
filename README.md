# TaxMate PH

Proof-of-concept cross-platform app for Philippine Bureau of Internal Revenue (BIR)
tools, built with Tauri, SvelteKit, and TypeScript.

This repository explores whether BIR taxpayer utilities that are commonly distributed
as desktop tools can be implemented as a modern cross-platform app for macOS, Windows,
Linux, and Android mobile devices. It is not an official BIR application and is not
ready for production tax filing or regulatory compliance workflows.

## Planned Scope

The proof of concept plans to cover these BIR tool families:

- **eBIRForms**: preparation and electronic filing support for BIR tax returns.
- **VAT RELIEF**: data entry, validation, and file-generation workflows around VAT
  Summary Lists of Sales and Purchases.
- **Alphalist**: data entry and validation workflows for withholding-tax alphalists
  and related BIR submission files.

The initial goal is to validate the technical approach, user experience, local data
handling, file import/export, and cross-platform packaging before treating any workflow
as authoritative across desktop and Android mobile targets.

## BIR Context

- BIR describes eBIRForms as a more convenient way for taxpayers to prepare and file
  tax returns: <https://www.bir.gov.ph/eservices/ebirforms>
- VAT RELIEF is associated with the Reconciliation of Listings for Enforcement and
  the required Summary List of Sales and Summary List of Purchases submissions for VAT
  taxpayers. See Revenue Regulations No. 16-2005 and Revenue Regulations No. 1-2012:
  <https://bir-cdn.bir.gov.ph/BIR/pdf/26116rr16-2005.pdf>
  <https://web-services.bir.gov.ph/annual_reports/annual_report_2012/images/RR%20letters/RR1.pdf>
- BIR references the RELIEF Data Entry and Validation Module as one of the electronic
  services available through eLounge facilities:
  <https://bir-cdn.bir.gov.ph/BIR/pdf/65065RMO%20%2018-2012.pdf>
- BIR's Alphalist Data Entry and Validation Module supports encoding and validating
  prescribed alphalist files. RMC No. 15-2025 notes version 7.4 availability and file
  structure updates:
  <https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2015-2025%20Digest.pdf>

## Development

Install dependencies and run the app with Bun:

```sh
bun install
bun run dev
```

Run checks with:

```sh
bun run check
```
