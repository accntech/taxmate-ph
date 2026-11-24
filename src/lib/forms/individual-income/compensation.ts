import { isValidPsocCode } from '../../profiles/profile';

/** Exact computation IDs from the packaged 1700 templates. */
type Values = Record<string, string>;
const p = 'frm1700:';
export const legacy1700FirstYear = 2013;
export const legacy1700LastYear = 2017;

export function legacy1700IncomeSourceChecked(id: string, value: string | undefined): boolean {
    return ['Y', '1', 'true', 'on'].includes(value ?? '') || (id === p + 'SourceOfIncome_2' && value === 'N');
}
function numeric(value: string | undefined): number {
    const clean = (value ?? '').replaceAll(',', '').trim().replace(/^\((.*)\)$/, '-$1');
    if (!/^-?(?:\d+(?:\.\d*)?|\.\d+)$/.test(clean))
        return 0;
    const valueNumber = Number(clean);
    return Number.isFinite(valueNumber) ? valueNumber : 0;
}
const whole = (value: number) => Number(value.toFixed(0));
const peso = (value: number) => value.toFixed(2);
function legacyChecked(values: Values, group: string, id: string): boolean {
    return values[p + group] === p + id || values[p + group] === id;
}
/** Resolve saved legacy claims deterministically without duplicating a child deduction. */
export function legacy1700DependentClaim(values: Values): 'taxpayer' | 'spouse' | undefined {
    if (legacyChecked(values, 'rdoPg1Pt1I14ClaimingAdditionalExemptions', 'rdoPg1Pt1I14YesInd'))
        return 'taxpayer';
    if (legacyChecked(values, 'rdoPg1Pt1I3JointFiling', 'rdoPg1Pt1I3JointFilingYes') &&
        legacyChecked(values, 'rdoPg1Pt1I21SpouseClaimAdditionalExemption', 'rdoPg1Pt1I21SpouseClaimAdditionalExemptionYes'))
        return 'spouse';
    return undefined;
}
export function isLegacy1700ContactValid(value: string): boolean {
    const contact = value.trim();
    return /^\d{7,20}$/.test(contact) && /[1-9]/.test(contact);
}
function legacy1700DependentCount(values: Values): number {
    return [1, 2, 3, 4].filter(row => values[p + `txtPg4T2FirstName${row}`]?.trim() && values[p + `txtPg4T2LastName${row}`]?.trim()).length;
}
export function jointRevised(v: Values): boolean {
    return v[p + 'rdoPg1I15CivilStatus'] === 'Married' && v[p + 'rdoPg1I16SpouseHasIncome'] === 'Yes' && v[p + 'rdoPg1I17FilingStatus'] === 'Joint';
}

export const revised1700EmployerRows = [1, 2, 3, 4];

export function revised1700EmployerAssignment(values: Values, row: number): string {
    return values[p + `rdoPg2I${row}PartVIEmployee`] || (jointRevised(values) ? '' : 'Taxpayer');
}

export function revised1700EmployerHasEntry(values: Values, row: number): boolean {
    const identity = ['Name1', 'Name2', 'TIN1', 'TIN2', 'TIN3', 'BranchCode'];
    const amounts = [`c_${row}REG`, `d_${row}CIFR`, `e_${row}TW`];
    return identity.some(part => values[p + `txtPg2I${row}PartVIEmployer${part}`]?.trim()) ||
        amounts.some(part => {
            const value = values[p + `txtPg2ISched1${part}`]?.trim();
            return Boolean(value && !/^0+(?:\.0+)?$/.test(value));
        });
}

export function revised1700FieldApplies(id: string, values: Values): boolean {
    const field = id.replace(/^frm1700:/, '');
    if (field === 'txtPg1I13ForeignTaxNumber') return values[p + 'rdoPg1I12ForeignTaxCredits'] === 'Yes';
    if (field === 'txtPg1I25SpouseForeignTaxNumber')
        return jointRevised(values) && values[p + 'rdoPg1I24SpouseForeignTaxCredits'] === 'Yes';
    const employerIncome = field.match(/^txtPg2ISched1([cd])_([1-4])(?:REG|CIFR)$/);
    if (employerIncome) {
        const person = revised1700EmployerAssignment(values, Number(employerIncome[2]));
        const type = person === 'Taxpayer' ? values[p + 'rdoPg1I6TaxpayerType'] :
            person === 'Spouse' ? values[p + 'rdoPg1I20SpouseTaxpayerType'] : '';
        return !type || employerIncome[1] === (type === 'NRANETB' ? 'd' : 'c');
    }
    const description = field.match(/^txtPg2I(45|49|51)Desc$/);
    if (description) return ['A', 'B'].some(column => revised1700FieldApplies(`txtPg2I${description[1]}${column}`, values));
    if (/^txtPg2ISched1[cde]_5B/.test(field)) return jointRevised(values);
    const columnField = field.match(/^txtPg([12])I(\d+)([AB])$/);
    if (!columnField) return true;
    const [, page, item, column] = columnField;
    if (column === 'B' && !jointRevised(values)) return false;
    if (page !== '2') return true;
    if (item === '55') return values[p + 'rdoPg1I2Amended'] === 'Yes';
    if (item === '56') {
        const claim = column === 'A' ? 'rdoPg1I12ForeignTaxCredits' : 'rdoPg1I24SpouseForeignTaxCredits';
        return values[p + claim] === 'Yes';
    }
    const number = Number(item);
    if (number < 42 || number > 53) return true;
    const taxpayerType = values[p + (column === 'A' ? 'rdoPg1I6TaxpayerType' : 'rdoPg1I20SpouseTaxpayerType')];
    return !taxpayerType || (taxpayerType === 'NRANETB' ? number >= 48 : number <= 47);
}
function graduated(income: number, year: number): number {
    const thresholds = [8000000, 2000000, 800000, 400000, 250000, 0];
    const rates = year >= 2023 ? [.35, .30, .25, .20, .15, 0] : [.35, .32, .30, .25, .20, 0];
    const bases = year >= 2023 ? [2202500, 402500, 102500, 22500, 0, 0] : [2410000, 490000, 130000, 30000, 0, 0];
    const bracket = thresholds.findIndex(threshold => income >= threshold);
    return bracket < 0 ? 0 : whole(bases[bracket] + (income - thresholds[bracket]) * rates[bracket]);
}
function legacyTax(income: number): number {
    const thresholds = [500000, 250000, 140000, 70000, 30000, 10000, 0];
    const bases = [125000, 50000, 22500, 8500, 2500, 500, 0];
    const rates = [.32, .30, .25, .20, .15, .10, .05];
    const bracket = thresholds.findIndex(threshold => income >= threshold);
    return bracket < 0 ? 0 : Math.round(bases[bracket] + (income - thresholds[bracket]) * rates[bracket]);
}
export function compensationAmountField(code: string): string {
    return p + (code === '1700' ? 'txtPg1Pt2I31' : 'txtPg1I36');
}
export function calculateCompensation(code: string, values: Values): Values {
    return code === '1700' ? calculateLegacy(values) : calculateRevised(values);
}
function calculateRevised(values: Values): Values {
    const result: Values = { ...values, 'frm1700:txtPg1I3ATC': 'II011' };
    const n = (name: string) => numeric(result[p + name]);
    const set = (name: string, value: number) => { result[p + name] = peso(value); return value; };
    const joint = jointRevised(values);
    for (const column of ['A', 'B']) {
        const enabled = column === 'A' || joint;
        const person = column === 'A' ? 'Taxpayer' : 'Spouse';
        let regular = 0, flat = 0, withheld = 0;
        for (const row of revised1700EmployerRows) {
            if (revised1700EmployerAssignment(values, row) !== person || !enabled)
                continue;
            const regularField = `txtPg2ISched1c_${row}REG`;
            const flatField = `txtPg2ISched1d_${row}CIFR`;
            if (revised1700FieldApplies(regularField, values)) regular += n(regularField);
            if (revised1700FieldApplies(flatField, values)) flat += n(flatField);
            withheld += n(`txtPg2ISched1e_${row}TW`);
        }
        set(`txtPg2ISched1c_5${column}REG`, whole(regular));
        set(`txtPg2ISched1d_5${column}CIFR`, whole(flat));
        set(`txtPg2ISched1e_5${column}TW`, whole(withheld));
        set(`txtPg2I42${column}`, whole(regular));
        set(`txtPg2I48${column}`, whole(flat));
        set(`txtPg2I54${column}`, whole(withheld));
        const input = (item: number, page = 2) => {
            const field = `txtPg${page}I${item}${column}`;
            return revised1700FieldApplies(field, values) ? n(field) : 0;
        };
        set(`txtPg2I44${column}`, input(42) - whole(input(43)));
        set(`txtPg2I46${column}`, whole(input(44) + input(45)));
        set(`txtPg2I47${column}`, graduated(input(46), n('txtPg1I1Year')));
        set(`txtPg2I50${column}`, whole(input(48) - input(49)));
        set(`txtPg2I52${column}`, whole(input(50) + input(51)));
        set(`txtPg2I53${column}`, whole(input(52) * .25));
        const type = values[p + (column === 'A' ? 'rdoPg1I6TaxpayerType' : 'rdoPg1I20SpouseTaxpayerType')];
        const tax = enabled ? n(`txtPg2I${type === 'NRANETB' ? 53 : 47}${column}`) : 0;
        const credits = set(`txtPg2I58${column}`, whole(input(54) + input(55) + input(56) + input(57)));
        const net = set(`txtPg2I59${column}`, tax - credits);
        set(`txtPg1I26${column}`, tax);
        set(`txtPg1I27${column}`, credits);
        set(`txtPg1I28${column}`, whole(net));
        const payable = set(`txtPg1I30${column}`, whole(net - input(29, 1)));
        const penalties = set(`txtPg1I34${column}`, whole(input(31, 1) + input(32, 1) + input(33, 1)));
        set(`txtPg1I35${column}`, payable < 0 && penalties > 0 ? penalties : payable + penalties);
    }
    set('txtPg1I36', n('txtPg1I35A') + n('txtPg1I35B'));
    return result;
}
function calculateLegacy(values: Values): Values {
    const result = { ...values };
    const n = (name: string) => Math.trunc(numeric(result[p + name]));
    const set = (name: string, value: number) => { result[p + name] = peso(value); return value; };
    const joint = legacyChecked(values, 'rdoPg1Pt1I3JointFiling', 'rdoPg1Pt1I3JointFilingYes');
    if (values[p + 'rdoPg1Pt1I13CivilStatusInd']) {
        set('txtPg2Pt4I8C1', 50000);
        set('txtPg2Pt4I8C2', joint && legacyChecked(values, 'rdoPg1Pt1I13CivilStatusInd', 'rdoPg1Pt1I13MarriedInd') ? 50000 : 0);
    }
    const claimant = legacy1700DependentClaim(values);
    const dependentCount = legacy1700DependentCount(values);
    result[p + 'txtPg1Pt1I15QualifyDependent'] = String(claimant === 'taxpayer' ? dependentCount : 0);
    result[p + 'txtPg1Pt1I22SpouseQualifiedDependentChildren'] = String(claimant === 'spouse' ? dependentCount : 0);
    let taxpayerIncome = 0, taxpayerWithheld = 0, spouseIncome = 0, spouseWithheld = 0;
    for (const key of Object.keys(values)) {
        const match = key.match(/^frm1700:rdoPg2Pt4I(\d+)Employer$/);
        if (!match)
            continue;
        const row = match[1];
        if (legacyChecked(values, `rdoPg2Pt4I${row}Employer`, `rdoPg2Pt4I${row}TaxFiler`)) {
            taxpayerIncome += n(`txtPg2Pt4I${row}ComIncomeC1`);
            taxpayerWithheld += n(`txtPg2Pt4I${row}TaxWithholdC2`);
        }
        else if (joint && legacyChecked(values, `rdoPg2Pt4I${row}Employer`, `rdoPg2Pt4I${row}Spouse`)) {
            spouseIncome += n(`txtPg2Pt4I${row}ComIncomeC1`);
            spouseWithheld += n(`txtPg2Pt4I${row}TaxWithholdC2`);
        }
    }
    set('txtPg2Pt4I4AC1', taxpayerIncome);
    set('txtPg2Pt4I4AC2', taxpayerWithheld);
    set('txtPg2Pt4I4BC1', spouseIncome);
    set('txtPg2Pt4I4BC2', spouseWithheld);
    for (const column of ['1', '2']) {
        const enabled = column === '1' || joint;
        const income = column === '1' ? taxpayerIncome : spouseIncome;
        const withholding = column === '1' ? taxpayerWithheld : spouseWithheld;
        const item = (line: number) => enabled ? n(`txtPg2Pt4I${line}C${column}`) : 0;
        set(`txtPg2Pt4I6C${column}`, income - item(5));
        const dependentField = column === '1' ? 'txtPg1Pt1I15QualifyDependent' : 'txtPg1Pt1I22SpouseQualifiedDependentChildren';
        const claiming = claimant === (column === '1' ? 'taxpayer' : 'spouse');
        set(`txtPg2Pt4I9C${column}`, claiming ? Math.min(4, Math.max(0, n(dependentField))) * 25000 : 0);
        set(`txtPg2Pt4I10C${column}`, item(7) + item(8) + item(9));
        set(`txtPg2Pt4I11C${column}`, item(6) - item(10));
        set(`txtPg2Pt4I13C${column}`, item(11) + item(12));
        set(`txtPg2Pt4I14C${column}`, enabled ? legacyTax(item(13)) : 0);
        set(`txtPg2Pt4I15C${column}`, withholding);
        set(`txtPg2Pt4I19C${column}`, item(15) + item(16) + item(17) + item(18));
        set(`txtPg2Pt4I20C${column}`, item(14) - item(19));
    }
    set('txtPg2Pt4I21', n('txtPg2Pt4I20C1') + n('txtPg2Pt4I20C2'));
    const net = set('txtPg2Pt4I23', n('txtPg2Pt4I21') - n('txtPg2Pt4I22'));
    const penalties = set('txtPg2Pt4I27', n('txtPg2Pt4I24') + n('txtPg2Pt4I25') + n('txtPg2Pt4I26'));
    set('txtPg2Pt4I28', net + penalties);
    set('txtPg1Pt2I23FilerTaxDue', n('txtPg2Pt4I14C1'));
    set('txtPg1Pt2I24SpouseTaxDue', n('txtPg2Pt4I14C2'));
    set('txtPg1Pt2I25TotalIncomeTaxDue', n('txtPg2Pt4I14C1') + n('txtPg2Pt4I14C2'));
    set('txtPg1Pt2I26TaxFilersTaxCredit', n('txtPg2Pt4I19C1'));
    set('txtPg1Pt2I27SpouseTaxCredit', n('txtPg2Pt4I19C2'));
    set('txtPg1Pt2I28NetTaxPayable', n('txtPg2Pt4I21'));
    set('txtPg1Pt2I29', n('txtPg2Pt4I22'));
    set('txtPg1Pt2I30', penalties);
    set('txtPg1Pt2I31', net < 0 && penalties > 0 ? penalties : net + penalties);
    const supplemental = Object.keys(values).filter(key => /^frm1700:txtPg3Pt5I[1-6]FinalTaxWithheld$|^frm1700:txtPg3Pt5I(?:11|17|20)C[12]$/.test(key));
    set('txtPg3Pt5I21TotTaxWithheldPaid', supplemental.reduce((sum, key) => sum + Math.trunc(numeric(values[key])), 0));
    const exemptIncome = ['1', '2', '3', '7A', '7B', '9A', '9B'];
    set('txtPg3Pt5BI10TotalIncome', exemptIncome.reduce((sum, item) => sum + n(`txtPg3Pt5BI${item}`), 0));
    return result;
}
function parseSourceDate(value: string): Date | undefined {
    const parts = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!parts)
        return undefined;
    const [, month, day, year] = parts.map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : undefined;
}
function validDate(value: string): boolean {
    const date = parseSourceDate(value);
    return date !== undefined && date.getTime() <= Date.now();
}
export function validateCompensation(code: string, values: Values): Values {
    const errors: Values = {};
    const revised = code !== '1700';
    const get = (name: string) => values[p + name]?.trim() ?? '';
    const require = (name: string, label: string) => { if (!get(name))
        errors[p + name] = `Enter ${label}.`; };
    const error = (name: string, message: string) => { errors[p + name] = message; };
    const date = (name: string, label: string, required = true) => {
        if (required || get(name)) {
            if (!validDate(get(name)))
                error(name, `Enter a valid ${label} date in MM/DD/YYYY format.`);
        }
    };
    const tin = (names: string[], label: string) => {
        for (const name of names)
            if (!/^\d{3}$/.test(get(name)))
                error(name, `Enter three digits for ${label}.`);
    };
    const branch = (name: string) => { if (!/^\d{3,5}$/.test(get(name)))
        error(name, 'Enter a branch code containing three to five digits.'); };
    const yearId = revised ? 'txtPg1I1Year' : 'txtYear';
    const enteredYear = get(yearId);
    const normalizedYear = !revised && /^\d{2}$/.test(enteredYear) ? '20' + enteredYear : enteredYear;
    const year = Number(normalizedYear);
    if (!/^\d{4}$/.test(normalizedYear) || year < (revised ? 2018 : legacy1700FirstYear) || year > (revised ? new Date().getFullYear() : legacy1700LastYear))
        error(yearId, revised ? 'Enter a filing year from 2018 through the current year.' : `Enter a filing year from ${legacy1700FirstYear} to ${legacy1700LastYear}.`);
    if (revised) {
        for (const [id, label] of [['txtPg1I3ATC', 'Item 3 ATC'], ['txtRDOCode', 'Item 5 RDO code'], ['rdoPg1I6TaxpayerType', 'Item 6 taxpayer type'], ['txtPg1I7TaxpayerName', 'Item 7 taxpayer name'], ['txtPg1I8Address', 'Item 8 registered address'], ['txtPg1I8AZipCode', 'Item 8A ZIP code'], ['txtPg1I11Citizenship', 'Item 11 citizenship'], ['rdoPg1I15CivilStatus', 'Item 15 civil status']])
            require(id, label);
        tin(['txtPg1I4TIN1', 'txtPg1I4TIN2', 'txtPg1I4TIN3'], 'Item 4 TIN');
        branch('txtPg1I4BranchCode');
        date('txtPg1I9BirthDate', 'Item 9 birth');
        if (get('rdoPg1I15CivilStatus') === 'Married') {
            require('rdoPg1I16SpouseHasIncome', 'Item 16 spouse income choice');
            if (get('rdoPg1I16SpouseHasIncome') === 'Yes')
                require('rdoPg1I17FilingStatus', 'Item 17 filing status');
        }
        if (jointRevised(values)) {
            tin(['txtPg1I18STIN1', 'txtPg1I18STIN2', 'txtPg1I18STIN3'], 'Item 18 spouse TIN');
            branch('txtPg1I18SBranchCode');
            require('txtSpouseRDOCode', 'Item 19 spouse RDO code');
            require('rdoPg1I20SpouseTaxpayerType', 'Item 20 spouse taxpayer type');
            require('txtPg1I21SpouseName', 'Item 21 spouse name');
        }
        const calculated = calculateRevised(values);
        for (const column of ['A', ...(jointRevised(values) ? ['B'] : [])]) {
            const deferred = numeric(get(`txtPg1I29${column}`));
            const tax = numeric(calculated[p + `txtPg1I26${column}`]);
            const net = numeric(calculated[p + `txtPg1I28${column}`]);
            if (deferred < 0 || deferred > Math.max(0, Math.min(tax * .5, net)))
                error(`txtPg1I29${column}`, 'Deferred payment cannot exceed 50% of tax due or the remaining tax payable.');
        }
        for (const row of revised1700EmployerRows) {
            const assignmentId = `rdoPg2I${row}PartVIEmployee`;
            const assignment = revised1700EmployerAssignment(values, row);
            const name1 = `txtPg2I${row}PartVIEmployerName1`, name2 = `txtPg2I${row}PartVIEmployerName2`;
            if (!get(assignmentId) && !revised1700EmployerHasEntry(values, row))
                continue;
            if (!['Taxpayer', 'Spouse'].includes(assignment))
                error(assignmentId, 'Select Taxpayer or Spouse for the employer row.');
            if (assignment === 'Spouse' && !jointRevised(values)) {
                error(`rdoPg2I${row}PartVIEmployee`, 'Spouse employer rows require a joint return.');
                continue;
            }
            if (!get(name1) && !get(name2))
                error(name1, `Enter the employer name for Part VI Item ${row}A.`);
            tin([1, 2, 3].map(part => `txtPg2I${row}PartVIEmployerTIN${part}`), `Part VI Item ${row}B employer TIN`);
            branch(`txtPg2I${row}PartVIEmployerBranchCode`);
            const regime = assignment === 'Spouse' ? get('rdoPg1I20SpouseTaxpayerType') : get('rdoPg1I6TaxpayerType');
            const incomeId = `txtPg2ISched1${regime === 'NRANETB' ? 'd' : 'c'}_${row}${regime === 'NRANETB' ? 'CIFR' : 'REG'}`;
            if (numeric(get(incomeId)) <= 0)
                error(incomeId, 'Compensation income for the selected employee must be greater than zero.');
        }
    }
    else {
        for (const [id, label] of [['rdoPg1Pt1I3JointFiling', 'Item 3 joint filing choice'], ['txtPg1Pt1I6RDOCode', 'Item 6 RDO code'], ['txtPg1Pt1I8TaxFilerLastName', 'Item 8 taxpayer last name'], ['txtPg1Pt1I11EmailAddress', 'Item 11 email'], ['txtPg1Pt1I12ContactNo', 'Item 12 contact number'], ['rdoPg1Pt1I13CivilStatusInd', 'Item 13 civil status'], ['rdoPg1Pt1I14ClaimingAdditionalExemptions', 'Item 14 exemption choice']])
            require(id, label);
        if (!isValidPsocCode(get('txtPg1Pt1I7Psoc')))
            error('txtPg1Pt1I7Psoc', 'Enter a four-digit PSOC code in taxpayer information.');
        if (get('txtPg1Pt1I12ContactNo') && !isLegacy1700ContactValid(get('txtPg1Pt1I12ContactNo')))
            error('txtPg1Pt1I12ContactNo', 'Enter 7 to 20 contact-number digits, including at least one nonzero digit.');
        if (!['SourceOfIncome_1', 'SourceOfIncome_2'].some(id => legacy1700IncomeSourceChecked(p + id, get(id))))
            error('SourceOfIncome_1', 'Select Item 4 source of income.');
        tin(['txtPg1Pt1I5TIN1', 'txtPg1Pt1I5TIN2', 'txtPg1Pt1I5TIN3'], 'Item 5 TIN');
        branch('txtPg1Pt1I5BranchCode');
        if (![1, 2, 3].some(part => get(`txtPg1Pt1I9Address${part}`)))
            error('txtPg1Pt1I9Address1', 'Enter Item 9 registered address.');
        date('txtPg1Pt1I10DOB', 'Item 10 birth');
        const pagesFiled = get('txtPg1Pt2NumberofPagesFiled');
        if (pagesFiled && !/^\d{1,2}$/.test(pagesFiled))
            error('txtPg1Pt2NumberofPagesFiled', 'Enter a whole number from 0 to 99 for pages filed.');
        const identification = values.GovorCTC;
        if (identification === 'Gov' || identification === 'CTC') {
            const certificate = identification === 'CTC';
            const label = certificate ? 'CTC number' : 'government ID number';
            require('txtPg1Pt2I32GovID', `Item 32 ${label}`);
            const limit = certificate ? 8 : 17;
            if (get('txtPg1Pt2I32GovID').length > limit)
                error('txtPg1Pt2I32GovID', `Item 32 ${label} must contain at most ${limit} characters.`);
            date('txtPg1P23I33DateofIssue', 'Item 33 issue');
            require('txtPg1Pt2I35PlaceofIssue', 'Item 35 place of issue');
            if (certificate && !/^\d+(?:\.\d{1,2})?$/.test(get('txtPg1Pt2I34Amount').replaceAll(',', '')))
                error('txtPg1Pt2I34Amount', 'Enter a valid Item 34 CTC amount.');
        } else {
            errors.GovorCTC = 'Select an identification type.';
        }
        if (['Y', 'true', '1', 'on'].includes(get('txtPg1Pt1I9AddressChangedInd'))) {
            for (const [part, label] of [
                ['SubdivisionVillage', 'subdivision or village'], ['Barangay', 'barangay'],
                ['MunicipalityCity', 'municipality or city'], ['Province', 'province'], ['ZipCde', 'ZIP code']
            ]) require(`txtPg4T1${part}`, label);
            if (get('txtPg4T1ZipCde') && !/^\d{4}$/.test(get('txtPg4T1ZipCde')))
                error('txtPg4T1ZipCde', 'Enter a four-digit ZIP code.');
        }
        const interest = numeric(get('txtPg3Pt5I1AAFM'));
        const exemptInterest = numeric(get('txtPg3Pt5I1Exempt'));
        const interestWithholdingId = 'txtPg3Pt5I1FinalTaxWithheld';
        const interestWithholding = numeric(get(interestWithholdingId));
        if (interest > 0 && interestWithholding <= 0)
            error(interestWithholdingId, 'Enter final tax withheld greater than zero for taxable interest.');
        if (interest <= 0 && exemptInterest > 0 && interestWithholding !== 0)
            error(interestWithholdingId, 'Clear final tax withheld when reporting only exempt interest.');
        for (const column of ['1', '2']) {
            const id = `txtPg3Pt5I14C${column}`;
            if (get(id) && !/^\d{1,12}$/.test(get(id)))
                error(id, 'Enter a nonnegative whole number of shares with up to 12 digits.');
            const issueDateId = `txtPg3Pt5I15DateofIssueC${column}`;
            const issueDate = get(issueDateId);
            if (issueDate) {
                const parsed = parseSourceDate(issueDate);
                if (!parsed)
                    error(issueDateId, 'Enter a valid stock certificate issue date in MM/DD/YYYY format.');
                else if (parsed.getTime() > Date.now())
                    error(issueDateId, 'The stock certificate issue date cannot be in the future.');
            }
        }
        const joint = legacyChecked(values, 'rdoPg1Pt1I3JointFiling', 'rdoPg1Pt1I3JointFilingYes');
        if (joint) {
            for (const name of ['LastName', 'FirstName', 'MiddleName'])
                require(`txtPg1Pt1I16TaxSpouse${name}`, 'Item 16 spouse name');
            tin(['txtPg1Pt1I17SpouseTIN1', 'txtPg1Pt1I17SpouseTIN2', 'txtPg1Pt1I17SpouseTIN3'], 'Item 17 spouse TIN');
            branch('txtPg1Pt1I17SpouseBranchCode');
            date('txtPg1Pt1I19SpouseDOB', 'Item 19 spouse birth');
            require('txtPg1Pt1I20SpouseEmailAddress', 'Item 20 spouse email');
        }
        for (const column of ['1', '2']) {
            const id = `txtPg2Pt4I7C${column}`, amount = numeric(get(id));
            if (amount < 0 || amount > 2400 || amount % 200 !== 0)
                error(id, 'Hospitalization insurance cannot exceed 2,400 and must be divisible by 200.');
        }
        const taxpayerClaim = legacyChecked(values, 'rdoPg1Pt1I14ClaimingAdditionalExemptions', 'rdoPg1Pt1I14YesInd');
        const spouseClaim = legacyChecked(values, 'rdoPg1Pt1I21SpouseClaimAdditionalExemption', 'rdoPg1Pt1I21SpouseClaimAdditionalExemptionYes');
        if (joint && taxpayerClaim && spouseClaim)
            error('rdoPg1Pt1I21SpouseClaimAdditionalExemption', 'Only one claimant can claim the qualified dependent children. Select No for the other spouse.');
        const claiming = Boolean(legacy1700DependentClaim(values));
        for (let row = 1; row <= 4; row++) {
            const last = `txtPg4T2LastName${row}`, first = `txtPg4T2FirstName${row}`, dob = `txtPg4T2DependentDOB${row}`;
            const incapacity = get(`rdoP4T2MarkIfIncapacitated${row}`);
            const incapacitated = ['Y', 'true', '1', 'on'].includes(incapacity);
            const populated = get(last) || get(first) || get(`txtPg4T2MiddleName${row}`) || get(dob) || incapacitated;
            if (claiming && (populated || row === 1)) {
                require(last, 'dependent last name');
                require(first, 'dependent first name');
                date(dob, 'dependent birth');
                const born = get(dob).split('/').map(Number);
                const age = year - born[2];
                if (validDate(get(dob))) {
                    if (age > 21 && !incapacitated)
                        error(dob, 'A dependent older than 21 must be mentally or physically incapacitated.');
                    if (!incapacitated && validDate(get('txtPg1Pt1I10DOB')) && new Date(born[2], born[0] - 1, born[1]) < new Date(get('txtPg1Pt1I10DOB')))
                        error(dob, 'A dependent cannot be older than the taxpayer unless incapacitated.');
                    if (born[2] > year)
                        error(dob, 'A dependent birth year cannot be after the filing year.');
                }
            }
        }
        const employerRows = Object.keys(values).flatMap(key => {
            const match = key.match(/^frm1700:(?:txt|rdo)Pg2Pt4I(\d+)(?:Employer|NameOfEmployer|EMPTIN[123]|EMPTINBranchCode|ComIncomeC1|TaxWithholdC2)$/);
            return match ? [Number(match[1])] : [];
        });
        for (const row of new Set([1, 2, 3, ...employerRows])) {
            const assignment = `rdoPg2Pt4I${row}Employer`;
            const assigned = get(assignment);
            const identity = ['NameOfEmployer', 'EMPTIN1', 'EMPTIN2', 'EMPTIN3', 'EMPTINBranchCode'].some(part => get(`txtPg2Pt4I${row}${part}`));
            const money = ['ComIncomeC1', 'TaxWithholdC2'].some(part => {
                const amount = get(`txtPg2Pt4I${row}${part}`).replaceAll(',', '');
                return amount && !/^(?:0+(?:\.0*)?|\.0+)$/.test(amount);
            });
            if (!assigned && !identity && !money && row !== 1)
                continue;
            if (!assigned)
                error(assignment, 'Select Taxpayer or Spouse for the employer row.');
            else if (!joint && legacyChecked(values, assignment, `rdoPg2Pt4I${row}Spouse`))
                error(assignment, 'Spouse employer rows require a joint return.');
            require(`txtPg2Pt4I${row}NameOfEmployer`, `Page 2 Item ${row} employer name`);
            tin([1, 2, 3].map(part => `txtPg2Pt4I${row}EMPTIN${part}`), `Page 2 Item ${row} employer TIN`);
            branch(`txtPg2Pt4I${row}EMPTINBranchCode`);
        }
        const calculated = calculateLegacy(values), deferred = numeric(get('txtPg2Pt4I22'));
        const due = numeric(calculated[p + 'txtPg1Pt2I25TotalIncomeTaxDue']), net = numeric(calculated[p + 'txtPg2Pt4I21']);
        if (deferred < 0 || deferred > Math.max(0, Math.min(due * .5, net)) || (deferred > 0 && due < 2000))
            error('txtPg2Pt4I22', 'Deferred payment requires tax due of at least 2,000 and cannot exceed 50% of tax due or remaining payable.');
        if ((numeric(get('txtPg2Pt4I18C1')) || numeric(get('txtPg2Pt4I18C2'))) && !get('txtPg2Pt4I18TC'))
            error('txtPg2Pt4I18TC', 'Enter the Item 18 other payment description.');
    }
    return errors;
}
