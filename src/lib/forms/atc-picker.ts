import { get1601EQATCs, get1601EQATCDescription } from './form-1601-eq/form-1601-eq-atcs';

export function filterATCOptions(category: string, query: string, selected = '') {
	const codes = [...get1601EQATCs(category)];
	if (selected && !codes.includes(selected)) codes.unshift(selected);
	const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
	return codes.map(value => ({ value, description: get1601EQATCDescription(value, category) }))
		.filter(option => terms.every(term => `${option.value} ${option.description}`.toLocaleLowerCase().includes(term)));
}

/** Legacy 1602 Sec. B/C choices from packaged atcCodes.xml records 483–497. */
const legacyInterestOptions = [
  {
    "value": "WI440",
    "label": "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL"
  },
  {
    "value": "WI441",
    "label": "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL"
  },
  {
    "value": "WI442",
    "label": "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-INDIVIDUAL"
  },
  {
    "value": "WC440",
    "label": "ON INTEREST INCOME FROM LONG-TERM DEPOSIT IN THE FORM OF SAVINGS TRUST FUNDS, DEPOSIT SUBSTITUTES WHICH WAS PRE-TERMINATED BY THE HOLDER BEFORE THE 5TH YEAR-CORPORATE"
  },
  {
    "value": "WC161",
    "label": "FT-BANK DEPOSITS(CORPORATE)"
  },
  {
    "value": "WC162",
    "label": "FT-FROM TREASURY BILLS"
  },
  {
    "value": "WC163",
    "label": "FT-DEP. SUBST., TRUST FUND AND SIMILAR ARRANGEMENTS(CORPORATE)"
  },
  {
    "value": "WC170",
    "label": "FINAL WTAX:FOREIGN CURRENCY DEPOSITS(CORPORATE)"
  },
  {
    "value": "WI161",
    "label": "FT-BANK DEPOSITS(INDIVIDUAL)"
  },
  {
    "value": "WI162",
    "label": "FT-FROM TREASURY BILLS"
  },
  {
    "value": "WI163",
    "label": "FT-DEP. SUBST., TRUST FUND AND SIMILAR ARRANGEMENTS(INDIVIDUAL)"
  },
  {
    "value": "WI170",
    "label": "FINAL WTAX:FOREIGN CURRENCY DEPOSITS(INDIVIDUAL)"
  }
];

export function getLegacyInterestATCOptions(category: string) {
 return [
  ...legacyInterestOptions.filter(option => category !== 'G' || ['WI440', 'WI441', 'WI442'].includes(option.value)),
  { value: 'NA', label: 'Not Applicable' }
 ];
}
