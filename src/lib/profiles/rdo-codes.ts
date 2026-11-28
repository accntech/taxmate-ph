// Regional districts in RAO 6-2025, pages 1–4, in revenue-region order.
// TaxMate currently accepts three-character identifiers. See docs/bir-source-register.md.
const regionalDistrictCodes = [
	'001', '002', '003', '004', '005', '006',
	'007', '008', '009', '010', '011', '012',
	'013', '014', '015', '016',
	'17A', '17B', '018', '019', '020', '21A', '21B', '21C', '022', '23A', '23B',
	'024', '25A', '25B', '026', '027',
	'029', '030', '031', '032', '033', '034', '036',
	'028', '038', '039', '040',
	'041', '042', '043', '045', '046',
	'047', '048', '049', '050',
	'044', '051', '052', '53A', '53B',
	'035', '037', '54A', '54B', '058', '059', '063',
	'055', '056', '057', '060', '061', '062',
	'064', '065', '066', '067', '068', '069', '070',
	'071', '072', '073', '074', '075',
	'076', '077', '078', '079',
	'080', '081', '082', '083', '084',
	'085', '086', '087', '088', '089', '090',
	'091', '092', '93A', '93B', '094', '095', '096',
	'097', '098', '099', '100', '101', '102',
	'103', '104', '105', '106',
	'107', '108', '109', '110', '111',
	'112', '114', '115',
];

// Preserve other identifiers accepted in saved TaxMate profiles and returns.
const compatibilityCodes = [
	'113', '116', '117', '118', '119', '120', '121', '122',
	'123', '124', '125', '126', '127', '132', '43A', '43B'
];

const acceptedCodes: ReadonlySet<string> = new Set([...regionalDistrictCodes, ...compatibilityCodes]);

export function isPackagedRdoCode(code: string): boolean {
	return acceptedCodes.has(code);
}
