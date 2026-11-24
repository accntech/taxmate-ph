import { describe, expect, it } from 'vitest';
import { calculateCompensation, validateCompensation, compensationAmountField, legacy1700DependentClaim, isLegacy1700ContactValid } from '$lib/forms/individual-income/compensation';
const prefix = 'frm1700:';
const values = (v: Record<string, string>) => Object.fromEntries(Object.entries(v).map(([k, value]) => [prefix + k, value]));
const employer = { rdoPg1I6TaxpayerType: 'Employee', rdoPg2I1PartVIEmployee: 'Taxpayer', txtPg2ISched1c_1REG: '1000000', txtPg2ISched1e_1TW: '140000' };
describe('compensation annual income tax', () => {
    it('computes the 2023 onward schedule and transfers credits into the final amount', () => {
        const result = calculateCompensation('1700v2018', values({ ...employer, txtPg1I1Year: '2024' }));
        expect(result[prefix + 'txtPg2I47A']).toBe('152500.00');
        expect(result[prefix + 'txtPg1I36']).toBe('12500.00');
    });
    it('uses the earlier TRAIN table through 2022', () => {
        const result = calculateCompensation('1700v2018', values({ ...employer, txtPg1I1Year: '2022' }));
        expect(result[prefix + 'txtPg2I47A']).toBe('190000.00');
    });
    it('applies the 25 percent path to nonresident aliens not engaged in trade or business', () => {
        const result = calculateCompensation('1700v2018', values({ txtPg1I1Year: '2024', rdoPg1I6TaxpayerType: 'NRANETB', rdoPg2I1PartVIEmployee: 'Taxpayer', txtPg2ISched1d_1CIFR: '400000', txtPg2ISched1e_1TW: '90000' }));
        expect(result[prefix + 'txtPg2I53A']).toBe('100000.00');
        expect(result[prefix + 'txtPg1I36']).toBe('10000.00');
    });
    it('preserves negative overpayments and uses penalties alone when supplied', () => {
        const draft = values({ ...employer, txtPg1I1Year: '2024', txtPg2ISched1e_1TW: '160000' });
        expect(calculateCompensation('1700v2018', draft)[prefix + 'txtPg1I36']).toBe('-7500.00');
        expect(calculateCompensation('1700v2018', { ...draft, [prefix + 'txtPg1I31A']: '500' })[prefix + 'txtPg1I36']).toBe('500.00');
    });
    it('excludes retained spouse schedules from separately filed returns', () => {
        const draft = values({ ...employer, txtPg1I1Year: '2024', rdoPg1I15CivilStatus: 'Married', rdoPg1I16SpouseHasIncome: 'Yes', rdoPg1I17FilingStatus: 'Separate', rdoPg1I20SpouseTaxpayerType: 'Employee', rdoPg2I2PartVIEmployee: 'Spouse', txtPg2ISched1c_2REG: '1000000' });
        expect(calculateCompensation('1700v2018', draft)[prefix + 'txtPg1I36']).toBe('12500.00');
    });
    it('validates the deferred-payment limit by item', () => {
        const draft = calculateCompensation('1700v2018', values({ ...employer, txtPg1I1Year: '2024', txtPg1I29A: '80000' }));
        expect(validateCompensation('1700v2018', draft)[prefix + 'txtPg1I29A']).toMatch(/50%|remaining/i);
    });
    it('only credits revised Form 1700 for an amended return or claimed foreign tax', () => {
        const draft = values({ ...employer, txtPg1I1Year: '2024', txtPg2I55A: '5000', txtPg2I56A: '3000' });
        const total = prefix + 'txtPg2I58A';
        expect(calculateCompensation('1700v2018', draft)[total]).toBe('140000.00');
        expect(calculateCompensation('1700v2018', {
            ...draft, [prefix + 'rdoPg1I2Amended']: 'Yes', [prefix + 'rdoPg1I12ForeignTaxCredits']: 'Yes'
        })[total]).toBe('148000.00');
    });
    it('assigns an unselected employer to the taxpayer only outside a joint return', () => {
        const input = values({ txtPg1I1Year: '2024', rdoPg1I6TaxpayerType: 'Employee', txtPg2ISched1c_1REG: '1000000', txtPg2ISched1d_1CIFR: '250000' });
        expect(validateCompensation('1700v2018', input)[prefix + 'rdoPg2I1PartVIEmployee']).toBeUndefined();
        expect(calculateCompensation('1700v2018', input)[prefix + 'txtPg2ISched1c_5AREG']).toBe('1000000.00');
        expect(calculateCompensation('1700v2018', input)[prefix + 'txtPg2ISched1d_5ACIFR']).toBe('0.00');
        const joint = { ...input, ...values({ rdoPg1I15CivilStatus: 'Married', rdoPg1I16SpouseHasIncome: 'Yes', rdoPg1I17FilingStatus: 'Joint' }) };
        expect(validateCompensation('1700v2018', joint)[prefix + 'rdoPg2I1PartVIEmployee']).toMatch(/select/i);
        expect(calculateCompensation('1700v2018', joint)[prefix + 'txtPg2ISched1c_5AREG']).toBe('0.00');
    });
    it('requires spouse identity when married filing jointly', () => {
        const errors = validateCompensation('1700v2018', values({ rdoPg1I15CivilStatus: 'Married', rdoPg1I16SpouseHasIncome: 'Yes', rdoPg1I17FilingStatus: 'Joint' }));
        expect(errors[prefix + 'txtPg1I18STIN1']).toBeTruthy();
        expect(errors[prefix + 'txtPg1I21SpouseName']).toBeTruthy();
    });
    it('rejects invalid calendar birth dates', () => {
        expect(validateCompensation('1700v2018', values({ txtPg1I9BirthDate: '02/30/2000' }))[prefix + 'txtPg1I9BirthDate']).toMatch(/date/i);
    });
    it('computes legacy employer income after exemptions with pre-TRAIN rates', () => {
        const draft = values({ txtYear: '2017', rdoPg2Pt4I1Employer: prefix + 'rdoPg2Pt4I1TaxFiler', txtPg2Pt4I1ComIncomeC1: '1000000', txtPg2Pt4I1TaxWithholdC2: '200000', txtPg2Pt4I8C1: '50000' });
        const result = calculateCompensation('1700', draft);
        expect(result[prefix + 'txtPg2Pt4I13C1']).toBe('950000.00');
        expect(result[prefix + 'txtPg2Pt4I14C1']).toBe('269000.00');
        expect(result[compensationAmountField('1700')]).toBe('69000.00');
        expect(draft[prefix + 'txtPg2Pt4I14C1']).toBeUndefined();
    });
    it('validates hospitalization limits while ignoring stale derived dependent counts', () => {
        const errors = validateCompensation('1700', values({ txtPg2Pt4I7C1: '2500', txtPg1Pt1I15QualifyDependent: '5' }));
        expect(errors[prefix + 'txtPg2Pt4I7C1']).toBeTruthy();
        expect(errors[prefix + 'txtPg1Pt1I15QualifyDependent']).toBeUndefined();
    });
    it('derives the legacy 50,000 basic exemption from civil status', () => {
        const result = calculateCompensation('1700', values({ rdoPg1Pt1I13CivilStatusInd: prefix + 'rdoPg1Pt1I13SingleInd', rdoPg2Pt4I1Employer: prefix + 'rdoPg2Pt4I1TaxFiler', txtPg2Pt4I1ComIncomeC1: '1000000' }));
        expect(result[prefix + 'txtPg2Pt4I8C1']).toBe('50000.00');
        expect(result[prefix + 'txtPg2Pt4I14C1']).toBe('269000.00');
    });
    it('sums the legacy supplemental final-tax-withheld schedule', () => {
        const result = calculateCompensation('1700', values({ txtPg3Pt5I1FinalTaxWithheld: '100', txtPg3Pt5I2FinalTaxWithheld: '200', txtPg3Pt5I11C1: '300' }));
        expect(result[prefix + 'txtPg3Pt5I21TotTaxWithheldPaid']).toBe('600.00');
    });
    it('calculates the legacy exempt-income total from the page 3 schedule', () => {
        const result = calculateCompensation('1700', values({
            txtPg3Pt5BI1: '100', txtPg3Pt5BI2: '25', txtPg3Pt5BI3: '1000',
            txtPg3Pt5BI7B: '500', txtPg3Pt5BI9A: '200', txtPg3Pt5BI10TotalIncome: '1'
        }));
        expect(result[prefix + 'txtPg3Pt5BI10TotalIncome']).toBe('1825.00');
    });
    it('accepts the legacy two-digit filing-year control', () => {
        const errors = validateCompensation('1700', values({ txtYear: '17' }));
        expect(errors[prefix + 'txtYear']).toBeUndefined();
    });

    it('requires the legacy ID amount only for a community tax certificate', () => {
        const fields = values({ txtPg1Pt2I32GovID: '123456789', txtPg1P23I33DateofIssue: '02/19/2017', txtPg1Pt2I35PlaceofIssue: 'Makati' });
        const amount = prefix + 'txtPg1Pt2I34Amount';
        expect(validateCompensation('1700', fields).GovorCTC).toBeTruthy();
        expect(validateCompensation('1700', { ...fields, GovorCTC: 'Gov' })[amount]).toBeUndefined();
        const errors = validateCompensation('1700', { ...fields, GovorCTC: 'CTC' });
        expect(errors[amount]).toBeTruthy();
        expect(errors[prefix + 'txtPg1Pt2I32GovID']).toMatch(/8 characters/);
    });
    it('requires the legacy change-of-address schedule when the filer marks an address change', () => {
        const zip = prefix + 'txtPg4T1ZipCde';
        expect(validateCompensation('1700', {})[zip]).toBeUndefined();
        expect(validateCompensation('1700', values({ txtPg1Pt1I9AddressChangedInd: 'Y' }))[zip]).toBeTruthy();
    });

});


describe('legacy 1700 dependent claims and contact', () => {
    const child = { txtPg4T2LastName1: 'CHILD', txtPg4T2FirstName1: 'ONE', txtPg4T2DependentDOB1: '01/01/2010' };
    const taxpayerClaim = { rdoPg1Pt1I14ClaimingAdditionalExemptions: prefix + 'rdoPg1Pt1I14YesInd' };
    const jointSpouseClaim = { rdoPg1Pt1I3JointFiling: prefix + 'rdoPg1Pt1I3JointFilingYes', rdoPg1Pt1I21SpouseClaimAdditionalExemption: prefix + 'rdoPg1Pt1I21SpouseClaimAdditionalExemptionYes' };
    it('exposes the claimant and accepts local landline and mobile contact digits', () => {
        expect(legacy1700DependentClaim(values(taxpayerClaim))).toBe('taxpayer');
        expect(legacy1700DependentClaim(values(jointSpouseClaim))).toBe('spouse');
        expect(legacy1700DependentClaim({})).toBeUndefined();
        expect(isLegacy1700ContactValid('1234567')).toBe(true);
        expect(isLegacy1700ContactValid(' 09951234567 ')).toBe(true);
        expect(isLegacy1700ContactValid('000')).toBe(false);
        expect(isLegacy1700ContactValid('00000000000')).toBe(false);
    });
    it('derives qualified counts from named children and replaces stale manual counts', () => {
        const result = calculateCompensation('1700', values({ ...child, ...taxpayerClaim, txtPg1Pt1I15QualifyDependent: '4', txtPg1Pt1I22SpouseQualifiedDependentChildren: '4', txtPg4T2LastName2: 'INCOMPLETE' }));
        expect(result[prefix + 'txtPg1Pt1I15QualifyDependent']).toBe('1');
        expect(result[prefix + 'txtPg1Pt1I22SpouseQualifiedDependentChildren']).toBe('0');
        expect(result[prefix + 'txtPg2Pt4I9C1']).toBe('25000.00');
    });
    it('grants a conflicting saved claim to the taxpayer once and reports the conflict', () => {
        const draft = values({ ...child, ...taxpayerClaim, ...jointSpouseClaim, txtPg1Pt1I15QualifyDependent: '4', txtPg1Pt1I22SpouseQualifiedDependentChildren: '4' });
        const result = calculateCompensation('1700', draft);
        expect(result[prefix + 'txtPg2Pt4I9C1']).toBe('25000.00');
        expect(result[prefix + 'txtPg2Pt4I9C2']).toBe('0.00');
        expect(validateCompensation('1700', draft)[prefix + 'rdoPg1Pt1I21SpouseClaimAdditionalExemption']).toMatch(/only one|one claimant/i);
    });
    it('derives a spouse claim only for joint returns', () => {
        const result = calculateCompensation('1700', values({ ...child, ...jointSpouseClaim }));
        expect(result[prefix + 'txtPg1Pt1I22SpouseQualifiedDependentChildren']).toBe('1');
        expect(result[prefix + 'txtPg2Pt4I9C2']).toBe('25000.00');
        const separate = calculateCompensation('1700', values({ ...child, ...jointSpouseClaim, rdoPg1Pt1I3JointFiling: prefix + 'rdoPg1Pt1I3JointFilingNo' }));
        expect(separate[prefix + 'txtPg2Pt4I9C2']).toBe('0.00');
    });
    it('rejects a child born after the filing year and an older nonincapacitated child', () => {
        const draft = values({ ...child, ...taxpayerClaim, txtYear: '17', txtPg1Pt1I10DOB: '01/01/1980', txtPg4T2DependentDOB1: '01/01/2018' });
        expect(validateCompensation('1700', draft)[prefix + 'txtPg4T2DependentDOB1']).toMatch(/filing year/i);
        draft[prefix + 'txtPg4T2DependentDOB1'] = '01/01/1979';
        expect(validateCompensation('1700', draft)[prefix + 'txtPg4T2DependentDOB1']).toMatch(/older than the taxpayer/i);
        draft[prefix + 'rdoP4T2MarkIfIncapacitated1'] = 'Y';
        expect(validateCompensation('1700', draft)[prefix + 'txtPg4T2DependentDOB1']).toBeUndefined();
    });
    it('rejects legacy contact values that cannot fit the packaged numeric control', () => {
        for (const contact of ['abc', '+639123456789', '123456789012345678901', '000', '00000000000', '123456'])
            expect(validateCompensation('1700', values({ txtPg1Pt1I12ContactNo: contact }))[prefix + 'txtPg1Pt1I12ContactNo']).toMatch(/digits/i);
        expect(validateCompensation('1700', values({ txtPg1Pt1I12ContactNo: '09951234567' }))[prefix + 'txtPg1Pt1I12ContactNo']).toBeUndefined();
    });
});


describe('inactive legacy dependent drafts', () => {
    it('keeps incomplete children without blocking a return with no active claim', () => {
        const draft = values({ rdoPg1Pt1I14ClaimingAdditionalExemptions: prefix + 'rdoPg1Pt1I14NoInd', txtPg4T2LastName1: 'RETAINED' });
        const errors = validateCompensation('1700', draft);
        expect(errors[prefix + 'txtPg4T2FirstName1']).toBeUndefined();
        expect(errors[prefix + 'txtPg4T2DependentDOB1']).toBeUndefined();
        expect(calculateCompensation('1700', draft)[prefix + 'txtPg4T2LastName1']).toBe('RETAINED');
    });
    it('ignores a retained spouse Yes on separately filed returns', () => {
        const errors = validateCompensation('1700', values({ rdoPg1Pt1I3JointFiling: prefix + 'rdoPg1Pt1I3JointFilingNo', rdoPg1Pt1I14ClaimingAdditionalExemptions: prefix + 'rdoPg1Pt1I14YesInd', rdoPg1Pt1I21SpouseClaimAdditionalExemption: prefix + 'rdoPg1Pt1I21SpouseClaimAdditionalExemptionYes' }));
        expect(errors[prefix + 'rdoPg1Pt1I21SpouseClaimAdditionalExemption']).toBeUndefined();
    });
});


describe('active legacy dependent row completeness', () => {
    const active = values({ rdoPg1Pt1I14ClaimingAdditionalExemptions: prefix + 'rdoPg1Pt1I14YesInd', txtPg4T2LastName1: 'CHILD', txtPg4T2FirstName1: 'ONE', txtPg4T2DependentDOB1: '01/01/2010' });
    it('requires names and birth date for any actual populated dependent row', () => {
        for (const [field, value] of [['txtPg4T2DependentDOB2', '01/01/2011'], ['txtPg4T2MiddleName2', 'MIDDLE'], ['rdoP4T2MarkIfIncapacitated2', 'Y']]) {
            const errors = validateCompensation('1700', { ...active, [prefix + field]: value });
            expect(errors[prefix + 'txtPg4T2LastName2']).toBeTruthy();
            expect(errors[prefix + 'txtPg4T2FirstName2']).toBeTruthy();
            if (field !== 'txtPg4T2DependentDOB2') expect(errors[prefix + 'txtPg4T2DependentDOB2']).toBeTruthy();
        }
    });
    it('does not consider unchecked incapacity or whitespace an additional child', () => {
        for (const unchecked of ['', 'N', 'false', '0']) {
            const errors = validateCompensation('1700', { ...active, [prefix + 'rdoP4T2MarkIfIncapacitated2']: unchecked, [prefix + 'txtPg4T2MiddleName2']: '  ' });
            expect(errors[prefix + 'txtPg4T2LastName2']).toBeUndefined();
            expect(errors[prefix + 'txtPg4T2DependentDOB2']).toBeUndefined();
        }
    });
    it('validates the June 2013 filing years and recognizes the packaged Other income checkbox value', () => {
        for (const year of ['2012', '2018']) {
            expect(validateCompensation('1700', values({ txtYear: year }))[prefix + 'txtYear']).toContain('2013 to 2017');
        }
        const errors = validateCompensation('1700', values({ txtYear: '2013', SourceOfIncome_2: 'N' }));
        expect(errors[prefix + 'txtYear']).toBeUndefined();
        expect(errors[prefix + 'SourceOfIncome_1']).toBeUndefined();
        expect(validateCompensation('1700', values({ SourceOfIncome_1: 'N' }))[prefix + 'SourceOfIncome_1']).toBeTruthy();
    });

});


describe('legacy employer assignment and incomplete optional rows', () => {
    it('rejects a retained spouse employer on a separate return without deleting its amounts', () => {
        const draft = values({ rdoPg1Pt1I3JointFiling: prefix + 'rdoPg1Pt1I3JointFilingNo', rdoPg2Pt4I2Employer: prefix + 'rdoPg2Pt4I2Spouse', txtPg2Pt4I2ComIncomeC1: '1000000' });
        expect(validateCompensation('1700', draft)[prefix + 'rdoPg2Pt4I2Employer']).toMatch(/joint return/i);
        expect(calculateCompensation('1700', draft)[prefix + 'txtPg2Pt4I2ComIncomeC1']).toBe('1000000');
        expect(validateCompensation('1700', { ...draft, [prefix + 'rdoPg1Pt1I3JointFiling']: prefix + 'rdoPg1Pt1I3JointFilingYes' })[prefix + 'rdoPg2Pt4I2Employer']).toBeUndefined();
    });
    it('requires completion when an optional employer contains any identity detail', () => {
        for (const field of ['txtPg2Pt4I2NameOfEmployer', 'txtPg2Pt4I2EMPTIN1', 'txtPg2Pt4I2EMPTIN2', 'txtPg2Pt4I2EMPTIN3', 'txtPg2Pt4I2EMPTINBranchCode']) {
            const errors = validateCompensation('1700', values({ [field]: '123' }));
            expect(errors[prefix + 'rdoPg2Pt4I2Employer']).toBeUndefined();
            expect(errors[prefix + 'txtPg2Pt4I2EMPTIN3']).toBe(field.endsWith('EMPTIN3') ? undefined : 'Enter three digits for Page 2 Item 2 employer TIN.');
            const jointErrors = validateCompensation('1700', values({ [field]: '123', rdoPg1Pt1I3JointFiling: 'rdoPg1Pt1I3JointFilingYes' }));
            expect(jointErrors[prefix + 'rdoPg2Pt4I2Employer']).toMatch(/select taxpayer or spouse/i);
        }
    });
    it('assigns compensation and withholding from a populated separate-return row to the taxpayer', () => {
        const draft = values({ txtPg2Pt4I2ComIncomeC1: '420000', txtPg2Pt4I2TaxWithholdC2: '18000', txtPg2Pt4I3ComIncomeC1: '0.00' });
        const result = calculateCompensation('1700', draft);
        expect(result[prefix + 'rdoPg2Pt4I2Employer']).toBe(prefix + 'rdoPg2Pt4I2TaxFiler');
        expect(result[prefix + 'txtPg2Pt4I4AC1']).toBe('420000.00');
        expect(result[prefix + 'txtPg2Pt4I4AC2']).toBe('18000.00');
        expect(result[prefix + 'rdoPg2Pt4I3Employer']).toBeUndefined();
    });
    it('does not activate optional employers from default zero amounts and whitespace', () => {
        const errors = validateCompensation('1700', values({ txtPg2Pt4I2ComIncomeC1: '0.00', txtPg2Pt4I2TaxWithholdC2: '0', txtPg2Pt4I2NameOfEmployer: '  ' }));
        expect(errors[prefix + 'rdoPg2Pt4I2Employer']).toBeUndefined();
        expect(errors[prefix + 'txtPg2Pt4I2NameOfEmployer']).toBeUndefined();
    });
});


describe('legacy schedule numeric controls', () => {
    it('validates four ZIP digits only when reporting a changed address', () => {
        for (const zip of ['abc', '123', '12345']) {
            expect(validateCompensation('1700', values({ txtPg1Pt1I9AddressChangedInd: 'Y', txtPg4T1ZipCde: zip }))[prefix + 'txtPg4T1ZipCde']).toBeTruthy();
            expect(validateCompensation('1700', values({ txtPg4T1ZipCde: zip }))[prefix + 'txtPg4T1ZipCde']).toBeUndefined();
        }
        expect(validateCompensation('1700', values({ txtPg1Pt1I9AddressChangedInd: 'Y', txtPg4T1ZipCde: '0123' }))[prefix + 'txtPg4T1ZipCde']).toBeUndefined();
    });
    it('accepts blank or up to twelve share-count digits and rejects other input', () => {
        for (const suffix of ['C1', 'C2']) {
            const field = prefix + 'txtPg3Pt5I14' + suffix;
            for (const count of ['abc', '-1', '1.5', '1234567890123'])
                expect(validateCompensation('1700', { [field]: count })[field]).toBeTruthy();
            for (const count of ['', '0', '123456789012'])
                expect(validateCompensation('1700', { [field]: count })[field]).toBeUndefined();
        }
    });
});

describe('legacy 1700 page 3 validation', () => {
    const withholding = prefix + 'txtPg3Pt5I1FinalTaxWithheld';

    it('requires positive final tax withheld when interest has a taxable amount', () => {
        const draft = values({ txtPg3Pt5I1AAFM: '1,200.00', txtPg3Pt5I1Exempt: '200' });
        expect(validateCompensation('1700', draft)[withholding]).toMatch(/greater than zero/i);
        expect(validateCompensation('1700', { ...draft, [withholding]: '0.00' })[withholding]).toMatch(/greater than zero/i);
        expect(validateCompensation('1700', { ...draft, [withholding]: '240' })[withholding]).toBeUndefined();
    });

    it('reports withholding entered against exempt-only interest without changing the draft', () => {
        const draft = values({ txtPg3Pt5I1Exempt: '200', txtPg3Pt5I1AAFM: '0.00', txtPg3Pt5I1FinalTaxWithheld: '40' });
        expect(validateCompensation('1700', draft)[withholding]).toMatch(/exempt/i);
        expect(draft[withholding]).toBe('40');
        expect(validateCompensation('1700', { ...draft, [withholding]: '0.00' })[withholding]).toBeUndefined();
    });

    it('validates each optional stock certificate issue date when it is entered', () => {
        for (const column of [1, 2]) {
            const field = prefix + `txtPg3Pt5I15DateofIssueC${column}`;
            expect(validateCompensation('1700', {})[field]).toBeUndefined();
            expect(validateCompensation('1700', { [field]: '02/29/2016' })[field]).toBeUndefined();
            expect(validateCompensation('1700', { [field]: '02/29/2017' })[field]).toMatch(/valid.*date/i);
            expect(validateCompensation('1700', { [field]: `01/01/${new Date().getFullYear() + 1}` })[field]).toMatch(/future/i);
        }
    });
});
