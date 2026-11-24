import type { IncomeForm } from '.';
import { legacy1700ScheduleLayout } from './legacy-1700-layout';
import { legacy1701FieldKind, legacy1701ScheduleLayout } from './legacy-1701-layout';
import { annual2013EditorLayout } from './annual-2013-editor-layout';
import { legacy1701Filing } from './annual';
import { revisedIncomeFieldKind, revisedIncomeScheduleLayout } from './revised-income-layout';
import { overpaymentOptions1701MS } from './form-1701ms-overpayment';
import fieldData from './templates/fields.json';

export type IncomeEditorField = {
	id: string;
	item?: string;
	person?: 'taxpayer' | 'spouse';
	rowKey?: string;
	optionalSection?: boolean;
	rowHeading?: string;
	subheading?: string;
	column?: string;
	shortLabel?: string;
	transaction?: 'A' | 'B';
	amountColumn?: 'exempt' | 'amount' | 'withheld';
	label: string;
	kind: string;
	section: string;
	page: string;
	options: string[];
	maxLength: number | null;
	choiceLabels: Record<string, string | undefined>;
};

const fieldLabels: Record<string, string> = {
	'frm1701:txtPg1Pt1I11Month': '11 Date of birth',
	'frm1701:ddlPg4Pt7I99Month': '99 Spouse date of birth',
	'frm1701:rdoPg4Pt7I105Itemized': '105 Spouse method of deduction',
	'frm1701:rdoPg4Pt7I106CashAccOth': '106 Spouse accounting method',
	'frm1701:txtPg4Pt7I106Others': '106 Other accounting method',
	'frm1701:rdoPg4Pt7I107YesNo': '107 Spouse has exempt income?',
	'frm1701:rdoPg4Pt7I108YesNo': '108 Spouse has income subject to a special rate?',
	'frm1701:rdoPg4Pt7I109CompensationATC': '109 Spouse alphanumeric tax code (ATC)',
	'frm1701:rdoPg4Pt7I110YesNo': '110 Spouse claiming additional exemptions?',
	'frm1701:rdoPg2I4ATC': '4 Spouse alphanumeric tax code (ATC)',
	'frm1701:rdoPg2I8ForeignTaxCredits': '8 Spouse claiming foreign tax credits?',
	'frm1701:rdoPg2I10IncomeExempt': '10 Spouse has exempt income?',
	'frm1701:rdoPg2I11IncomeSpecial': '11 Spouse has income subject to a special rate?',
	'frm1701:rdoPg2I12TaxRate': '12 Spouse tax rate',
	'frm1701:rdoPg2I12AMethodDeduction': '12A Spouse method of deduction',
	'frm1701q:txtSheets': '4 Number of sheets attached',
	'frm1700:txtPg1Pt1I7Psoc': '7 Occupation code (PSOC)',
	'frm1700:txtPg1Pt1I9AddressChangedInd': '9 Registered address changed',
	'frm1700:txtPg1Pt2NumberofPagesFiled': 'Number of pages filed',
	'GovorCTC': 'Identification type',
	'frm1700:txtPg1Pt2I32GovID': '32 Identification number',
	'frm1700:txtPg1P23I33DateofIssue': '33 Date of issue',
	'frm1700:txtPg1Pt2I34Amount': '34 CTC amount',
	'frm1700:txtPg1Pt2I35PlaceofIssue': '35 Place of issue',
	'frm1700:txtPg1I1Year': '1 Filing year',
	'frm1700:rdoPg1I2Amended': '2 Amended return?',
	'frm1700:txtPg1I3ATC': '3 Alphanumeric tax code (ATC)',
	'frm1700:rdoPg1I6TaxpayerType': '6 Taxpayer type',
	'frm1700:txtPg1I9BirthDate': '9 Date of birth',
	'frm1700:txtPg1I11Citizenship': '11 Citizenship',
	'frm1700:rdoPg1I12ForeignTaxCredits': '12 Claiming foreign tax credits?',
	'frm1700:txtPg1I13ForeignTaxNumber': '13 Foreign tax number',
	'frm1700:rdoPg1I15CivilStatus': '15 Civil status',
	'frm1700:rdoPg1I16SpouseHasIncome': '16 Spouse has income?',
	'frm1700:rdoPg1I17FilingStatus': '17 Filing status',
	'frm1700:txtPg1I18STIN1': '18 Spouse TIN, first three digits',
	'frm1700:txtPg1I18STIN2': '18 Spouse TIN, middle three digits',
	'frm1700:txtPg1I18STIN3': '18 Spouse TIN, last three digits',
	'frm1700:txtPg1I18SBranchCode': '18 Spouse branch code',
	'frm1700:txtSpouseRDOCode': '19 Spouse RDO code',
	'frm1700:rdoPg1I20SpouseTaxpayerType': '20 Spouse taxpayer type',
	'frm1700:txtPg1I21SpouseName': '21 Spouse’s full name',
	'frm1700:txtPg1I22TSpouseTelNum': '22 Spouse contact number',
	'frm1700:txtPg1I23SpouseCitizenship': '23 Spouse citizenship',
	'frm1700:rdoPg1I24SpouseForeignTaxCredits': '24 Spouse claiming foreign tax credits?',
	'frm1700:txtPg1I25SpouseForeignTaxNumber': '25 Spouse foreign tax number',
	'frm1700:AmendedRtn': '2 Amended return?',
	'frm1700:rdoPg1Pt1I3JointFiling': '3 Joint return?',
	'frm1700:SourceOfIncome_1': '4 Compensation income (II011)',
	'frm1700:SourceOfIncome_2': '4 Other income (II041)',
	'frm1700:rdoPg1Pt1I13CivilStatusInd': '13 Civil status',
	'frm1700:rdoPg1Pt1I14ClaimingAdditionalExemptions': '14 Claiming additional exemptions?',
	'frm1700:rdoPg1Pt1I21SpouseClaimAdditionalExemption': '21 Spouse claiming additional exemptions?',
	'frm1700:txtPg1Pt1I15QualifyDependent': '15 Qualified dependent children',
	'frm1700:txtPg1Pt1I22SpouseQualifiedDependentChildren': '22 Spouse’s qualified dependent children',
	'frm1701:ddlPg1I1Month': '1 Filing month',
	'frm1701:txtPg1I1Month': '1 Filing month',
	'frm1701:rdoPg1I2Ammend': '2 Amended return?',
	'frm1701:rdoPg1I2Amended': '2 Amended return?',
	'frm1701:rdoPg1I3ShortPeriod': '3 Short period return?',
	'frm1701:rdoPg1Pt1I4ATC': '4 Alphanumeric tax code (ATC)',
	'frm1701:rdoPg1I7ATC': '7 Alphanumeric tax code (ATC)',
	'frm1701:rdoPg1I13ForeignTaxCredits': '13 Claiming foreign tax credits?',
	'frm1701:rdoPg1I16CivilStatus': '16 Civil status',
	'frm1701:rdoPg1I17SpouseIncome': '17 Spouse has income?',
	'frm1701:rdoPg1I18FilingStatus': '18 Filing status',
	'frm1701:rdoPg1I19IncomeExempt': '19 Exempt income?',
	'frm1701:rdoPg1I20IncomeSpecial': '20 Income subject to a special rate?',
	'frm1701:rdoPg1I21TaxRate': '21 Tax rate',
	'frm1701:rdoPg1I21AMethodDeduction': '21A Method of deduction',
	'frm1701:rdoPg1Pt1I7Type': '7 Taxpayer type',
	'frm1701:txtPg1Pt1I9TradeName': '9 Trade name',
	'frm1701:rdoPg1Pt1I14Status': '14 Civil status',
	'frm1701:rdoPg1Pt1I15Income': '15 Spouse has income?',
	'frm1701:rdoPg1Pt1I16FilingStatus': '16 Filing status',
	'frm1701:rdoPg1Pt1I20Deduction': '20 Method of deduction',
	'frm1701:rdoPg1Pt1I21Accounting': '21 Accounting method',
	'frm1701:rdoPg1Pt1I22IncomeExempt': '22 Exempt income?',
	'frm1701:rdoPg1Pt1I23IncomeSpecial': '23 Income subject to a special rate?',
	'frm1701:rdoPg1Pt1I24Claiming': '24 Claiming additional exemptions?',
	'frm1701A:txtMonth': '1 Filing month',
	'frm1701A:optAmendedReturn': '2 Amended return?',
	'frm1701A:optShortPeriod': '3 Short period return?',
	'frm1701A:txtTIN1': '4 TIN, first three digits',
	'frm1701A:txtRDOCode': '5 RDO code',
	'frm1701A:optTaxType': '6 Taxpayer type',
	'frm1701A:txtTaxpayerName': '8 Taxpayer name',
	'frm1701A:txtAddress': '9 Registered address',
	'frm1701A:txtBirthDate': '10 Date of birth',
	'frm1701A:txtCitizenship': '12 Citizenship',
	'frm1701A:optForeignTaxCredits': '13 Claiming foreign tax credits?',
	'frm1701A:txtForeignTaxNumber': '14 Foreign tax number',
	'frm1701A:txtTelNum': '15 Contact number',
	'frm1701A:optSpouseIncome': '17 Spouse has income?',
	'frm1701A:optFilingStatus': '18 Filing status',
	'frm1701MS:txtMonthNo1': '1 Filing month',
	'frm1701MS:txtAmended': '2 Amended return?',
	'frm1701MS:txtReturnPeriod': '3 Short period return?',
	'frm1701MS:civilStatus': '4 Civil status',
	'frm1701MS:txtIfMarried': '5 Filing status',
	'frm1701MS:txtTaxpayerNo8a': '8 Taxpayer name',
	'frm1701MS:txtTaxpayerNo8b': '8 Spouse name',
	'frm1701MS:sourceOfIncomeTaxpayer': '11 Taxpayer income source',
	'frm1701MS:sourceOfIncomeSpouse': '11 Spouse income source',
	'frm1701MS:txtTaxpayerNo12a': '12 Taxpayer tax regime',
	'frm1701MS:txtTaxpayerNo12b': '12 Spouse tax regime',
	'methodOfDeductionMain': '17 Taxpayer method of deduction',
	'methodOfDeductionStandard': '17 Spouse method of deduction',
	'frm1701q:AmendedRtn': '3 Amended return?',
	'frm1701q:optTaxpayerType': '6 Taxpayer type',
	'frm1701q:optATC': '7 Alphanumeric tax code (ATC)',
	'frm1701q:optForeignTaxCredits': 'Claiming foreign tax credits?',
	'frm1701A:txt36A': '36A Sales, revenues, receipts and fees',
	'frm1701A:txt36B': '36B Sales, revenues, receipts and fees',
	'frm1701A:txt39A': '39A Optional standard deduction',
	'frm1701A:txt45A': '45A Total taxable income',
	'frm1701A:txt46A': '46A Income tax due',
	'frm1701A:optATC': '7 Alphanumeric tax code (ATC)',
	'frm1701A:optTaxRate': '19 Income tax rate',
	'frm1701A:optCivilStatus': '16 Civil status',
	'frm1701q:DateQuarter': '2 Quarter',
	'frm1701q:optTaxRate': 'Income tax rate',
	'frm1701q:optMethodOfDeduction': 'Method of deduction'
};

// Labels recovered from the exact v7.9.6.2 source rows, excluding value cells.
const sourceRowLabels: Record<string, Record<string, string>> = {
  "1700": {
    "frm1700:txtPg1Pt1I6RDOCode": "RDO Code",
    "frm1700:txtPg1Pt2I31": "TOTAL AMOUNT PAYABLE Upon Filing (Overpayment) (Item 28 Less Item 29 Add Item 30)",
    "frm1700:txtPg2Pt4I22": "Less: Portion of Tax Payable Allowed for 2nd Installment to be paid on or before July 15 (To Part II Item 29) (Not more than 50% of the sum of Items 14A & 14B)",
    "frm1700:txtPg3Pt5BI8A": "Other Exempt Income/Receipts Under Sec. 32 (B) of the Tax Code, as amended (Specify)",
    "frm1700:txtPg3Pt5BI8B": "Other Exempt Income/Receipts Under Sec. 32 (B) of the Tax Code, as amended (Specify)"
  },
  "1700v2018": {
    "frm1700:txtPg1I29A": "Less: Portion of Tax Payable Allowed for 2nd Installment to be paid on or before October 15 (50% or less of Item 26) (applicable only to employee subject to regular IT rates)",
    "frm1700:txtPg1I29B": "Less: Portion of Tax Payable Allowed for 2nd Installment to be paid on or before October 15 (50% or less of Item 26) (applicable only to employee subject to regular IT rates)"
  },
  "1701": {
    "frm1701:txtPg1Pt2I29PortionTax": "29 Less: Portion of Tax Payable Allowed for 2 nd Installment to be paid on or before July 15 (Not More Than 50% of Item 26)",
    "frm1701:txtPg1Pt2I32TotalUponFiling": "32 TOTAL AMOUNT PAYABLE Upon Filing (Overpayment) (Sum of Items 30 & 31)",
    "frm1701:txtPg2Pt4I61OSDC1": "61 Optional Standard Deductions (OSD) (40% of Item 52 Total Sales/Receipts/Revenues/Fees) (NOTE: If all income is subject ONLY to Regular Income Tax Regime)",
    "frm1701:txtPg2Pt4I61OSDC2": "61 Optional Standard Deductions (OSD) (40% of Item 52 Total Sales/Receipts/Revenues/Fees) (NOTE: If all income is subject ONLY to Regular Income Tax Regime)",
    "frm1701:txtPg2Pt4I65LessExcessC1": "65 Less: Excess Deductions, if any (From Item 49) OR the Total Deductions, if there is no compensation income (From Item 47)",
    "frm1701:txtPg2Pt4I65LessExcessC2": "65 Less: Excess Deductions, if any (From Item 49) OR the Total Deductions, if there is no compensation income (From Item 47)",
    "frm1701:txtPg2Pt4I67TaxDueRegularC1": "67 TAX DUE-REGULAR [Refer to Tax Table (Graduated Income Tax Rates) below]",
    "frm1701:txtPg2Pt4I67TaxDueRegularC2": "67 TAX DUE-REGULAR [Refer to Tax Table (Graduated Income Tax Rates) below]",
    "frm1701:txtPg3Pt5I72TotalIncomeTaxC1": "72 TOTAL INCOME TAX DUE (Overpayment) (Sum of Items 68 & 71) (To Item 26)",
    "frm1701:txtPg3Pt5I72TotalIncomeTaxC2": "72 TOTAL INCOME TAX DUE (Overpayment) (Sum of Items 68 & 71) (To Item 26)",
    "frm1701:txtPg3Pt5I78NetTaxForTaxFiler": "78 NET TAX PAYABLE (OVERPAYMENT) FOR TAX FILER and SPOUSE (Sum of Items 77A & 77B)",
    "frm1701:txtPg3Pt5I79LessPortion": "79 Less: Portion of Tax Payable Allowed for 2 nd Installment to be paid on or before July 15 (Not More Than 50% of the Sum of Items 72A & 72B) (To Item 29)",
    "frm1701:txtPg3Pt5I85TotalAmount": "85 TOTAL AMOUNT PAYABLE UPON FILING (OVERPAYMENT) (Sum of Items 80 & 84) (To Item 32)",
    "frm1701:txtPg3Pt5I86RegularC1": "86 Regular Income Tax Otherwise Due (Sum of Items 66 & 58 X applicable Tax Rate per Tax Table)",
    "frm1701:txtPg3Pt5I86RegularC2": "86 Regular Income Tax Otherwise Due (Sum of Items 66 & 58 X applicable Tax Rate per Tax Table)",
    "frm1701:txtPg3Pt5I94TotalTax": "94 Total Tax Relief Availment of Tax Filer & Spouse (Sum of Items 93A & 93B)",
    "frm1701:txtPg12Pt9I2OtherC1": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I2OtherC2": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I2OtherC3": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I2OtherC4": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I2OtherC5": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I2OtherC6": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I2OtherC7": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I2OtherC8": "2 Other Income from Operations not subject to Final Tax (From Part IV Item 51A/51B-Regular) (From Schedule B Item 2A/2B-Special/Exempt)",
    "frm1701:txtPg12Pt9I16LessExcessC1": "16 Less: Excess Deductions, if any OR the Total Deductions, if there is no compensation income (From Part IV Item 65A/65B)",
    "frm1701:txtPg12Pt9I16LessExcessC4": "16 Less: Excess Deductions, if any OR the Total Deductions, if there is no compensation income (From Part IV Item 65A/65B)",
    "frm1701:txtPg12Pt9I16LessExcessC5": "16 Less: Excess Deductions, if any OR the Total Deductions, if there is no compensation income (From Part IV Item 65A/65B)",
    "frm1701:txtPg12Pt9I16LessExcessC8": "16 Less: Excess Deductions, if any OR the Total Deductions, if there is no compensation income (From Part IV Item 65A/65B)",
    "frm1701:txtPg12Pt9I18TotalIncomeC1": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I18TotalIncomeC2": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I18TotalIncomeC3": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I18TotalIncomeC4": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I18TotalIncomeC5": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I18TotalIncomeC6": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I18TotalIncomeC7": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I18TotalIncomeC8": "18 TOTAL INCOME TAX DUE REGULAR (From Part V Item 68A/68B) SPECIAL (Item 17B/17F X applicable Special Rate) EXEMPT (Item 7C/7G X 0%)",
    "frm1701:txtPg12Pt9I21TaxReliefC1": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)",
    "frm1701:txtPg12Pt9I21TaxReliefC2": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)",
    "frm1701:txtPg12Pt9I21TaxReliefC3": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)",
    "frm1701:txtPg12Pt9I21TaxReliefC4": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)",
    "frm1701:txtPg12Pt9I21TaxReliefC5": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)",
    "frm1701:txtPg12Pt9I21TaxReliefC6": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)",
    "frm1701:txtPg12Pt9I21TaxReliefC7": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)",
    "frm1701:txtPg12Pt9I21TaxReliefC8": "21 Total Tax Relief Availment - REGULAR (From Part VI Item 90A/90B) - SPECIAL (From Schedule C1 Item 8A/8B) (To Part VI Item 91A/91B) - EXEMPT (From Schedule C2 Item 11A/11B) (To Part VI Item 92A/92B)"
  },
  "1701v2018": {
    "frm1701:txtPg1I4TIN1": "Taxpayer Identification Number (TIN)",
    "frm1701:txtPg1I4TIN2": "Taxpayer Identification Number (TIN)",
    "frm1701:txtPg1I4TIN3": "Taxpayer Identification Number (TIN)",
    "frm1701:txtPg1I4BranchCode": "Taxpayer Identification Number (TIN)",
    "frm1701:txtPg2I1TIN1": "Spouse's Taxpayer Identification Number (TIN)",
    "frm1701:txtPg2I1TIN2": "Spouse's Taxpayer Identification Number (TIN)",
    "frm1701:txtPg2I1TIN3": "Spouse's Taxpayer Identification Number (TIN)",
    "frm1701:txtPg2I1BranchCode": "Spouse's Taxpayer Identification Number (TIN)",
    "frm1701:txtPg2IShed3_25A": "Total Tax Due-Compensation and Business Income (under graduated rates)(Item 24 x Applicable Tax Rate based on Tax Table below) (To Part VI Item 1)",
    "frm1701:txtPg2IShed3_25B": "Total Tax Due-Compensation and Business Income (under graduated rates)(Item 24 x Applicable Tax Rate based on Tax Table below) (To Part VI Item 1)",
    "frm1701:txtPg4IPart8_2A": "Tax Relief on Special Allowable Itemized Deductions (Part X Item7B and/or Item 7F X applicable regular income tax rate)",
    "frm1701:txtPg4IPart8_2B": "Tax Relief on Special Allowable Itemized Deductions (Part X Item7B and/or Item 7F X applicable regular income tax rate)",
    "frm1701:txtPg4IPart8_9A": "Tax Relief on Special Allowable Itemized Deductions (Part X Item7A and/or Item 7E X applicable regular income tax rate)",
    "frm1701:txtPg4IPart8_9B": "Tax Relief on Special Allowable Itemized Deductions (Part X Item7A and/or Item 7E X applicable regular income tax rate)",
    "frm1701:txtPg1mI1ASchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI1BSchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI1CSchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI1DSchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI1ESchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI1FSchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI1GSchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI1HSchdB": "1 Sales/Revenues/Receipts/Fees ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 1A/1B) ( REGULAR: From Part V Sched 3.A Item 8A/8B)",
    "frm1701:txtPg1mI2ASchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI2BSchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI2CSchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI2DSchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI2ESchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI2FSchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI2GSchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI2HSchdB": "2 Less: Sales Retunrs, Allowances & Discounts ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 2A/2B) ( REGULAR: From Part V Sched 3.A Item 9A/9B)",
    "frm1701:txtPg1mI4ASchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)",
    "frm1701:txtPg1mI4BSchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)",
    "frm1701:txtPg1mI4CSchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)",
    "frm1701:txtPg1mI4DSchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)",
    "frm1701:txtPg1mI4ESchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)",
    "frm1701:txtPg1mI4FSchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)",
    "frm1701:txtPg1mI4GSchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)",
    "frm1701:txtPg1mI4HSchdB": "4 Less: Cost of Sales/Services ( EXEMPT/SPECIAL: If letter B of instructions above is marked, from All of Part XI Schedule B Item 4A/4B) ( REGULAR: From Part V Sched 3.A Item 11A/11B)"
  },
  "1701A": {
    "frm1701A:txt20A": "Tax Due (Either from Part IV.A Item 46 OR Part IV.B Item 56)",
    "frm1701A:txt20B": "Tax Due (Either from Part IV.A Item 46 OR Part IV.B Item 56)",
    "frm1701A:txt21A": "Less: Total Tax Credits/Payments (From Part IV.C Item 64)",
    "frm1701A:txt21B": "Less: Total Tax Credits/Payments (From Part IV.C Item 64)",
    "frm1701A:txt22A": "Tax Payable/(Overpayment) (Item 20 Less Item 21) (From Part IV Item 65)",
    "frm1701A:txt22B": "Tax Payable/(Overpayment) (Item 20 Less Item 21) (From Part IV Item 65)",
    "frm1701A:txt23A": "Less: Portion of Tax Payable Allowed for 2nd Installment to be paid on or before October 15 (50% or less of Item 20)",
    "frm1701A:txt23B": "Less: Portion of Tax Payable Allowed for 2nd Installment to be paid on or before October 15 (50% or less of Item 20)",
    "frm1701A:txt24A": "Amount of Tax Required to be Paid upon Filing/(Overpayment) (Item 22 Less Item 23)",
    "frm1701A:txt24B": "Amount of Tax Required to be Paid upon Filing/(Overpayment) (Item 22 Less Item 23)",
    "frm1701A:txt25A": "Add: Penalties 25 Surcharge",
    "frm1701A:txt25B": "Add: Penalties 25 Surcharge",
    "frm1701A:txt26A": "26 Interest",
    "frm1701A:txt26B": "26 Interest",
    "frm1701A:txt27A": "27 Compromise",
    "frm1701A:txt27B": "27 Compromise",
    "frm1701A:txt28A": "Total Penalties (Sum of Items 25 to 27)",
    "frm1701A:txt28B": "Total Penalties (Sum of Items 25 to 27)",
    "frm1701A:txt29A": "Total Amount Payable/(Overpayment) (Sum of Items 24 and 28)",
    "frm1701A:txt29B": "Total Amount Payable/(Overpayment) (Sum of Items 24 and 28)",
    "frm1701A:txt36A": "Sales/Revenues/Receipts/Fees",
    "frm1701A:txt36B": "Sales/Revenues/Receipts/Fees",
    "frm1701A:txt37A": "Less: Sales Returns, Allowances and Discounts",
    "frm1701A:txt37B": "Less: Sales Returns, Allowances and Discounts",
    "frm1701A:txt38A": "Net Sales/Revenues/Receipts/Fees (Item 36 Less Item 37)",
    "frm1701A:txt38B": "Net Sales/Revenues/Receipts/Fees (Item 36 Less Item 37)",
    "frm1701A:txt39A": "Less: Allowable Deduction - Optional Standard Deduction (OSD) (40% of Item 38)",
    "frm1701A:txt39B": "Less: Allowable Deduction - Optional Standard Deduction (OSD) (40% of Item 38)",
    "frm1701A:txt40A": "Net Income (Item 38 Less Item 39)",
    "frm1701A:txt40B": "Net Income (Item 38 Less Item 39)",
    "frm1701A:txt43A": "Amount Received/Share in income by a Partner from General Professional Partnership (GPP)",
    "frm1701A:txt43B": "Amount Received/Share in income by a Partner from General Professional Partnership (GPP)",
    "frm1701A:txt44A": "Total Other Income (Sum of Items 41 to 43)",
    "frm1701A:txt44B": "Total Other Income (Sum of Items 41 to 43)",
    "frm1701A:txt45A": "Total Taxable Income (Sum of Items 40 and 44)",
    "frm1701A:txt45B": "Total Taxable Income (Sum of Items 40 and 44)",
    "frm1701A:txt46A": "TAX DUE (Item 45 x Applicable Tax Rate based on Tax Table below) (To Part II - Item 20)",
    "frm1701A:txt46B": "TAX DUE (Item 45 x Applicable Tax Rate based on Tax Table below) (To Part II - Item 20)",
    "frm1701A:txt47A": "Sales/Revenues/Receipts/Fees",
    "frm1701A:txt47B": "Sales/Revenues/Receipts/Fees",
    "frm1701A:txt48A": "Less: Sales Returns, Allowances and Discounts",
    "frm1701A:txt48B": "Less: Sales Returns, Allowances and Discounts",
    "frm1701A:txt49A": "Net Sales/Revenues/Receipts/Fees (Item 47 Less Item 48)",
    "frm1701A:txt49B": "Net Sales/Revenues/Receipts/Fees (Item 47 Less Item 48)",
    "frm1701A:txt52A": "Total Other Non-operating Income (Sum of Items 50 and 51)",
    "frm1701A:txt52B": "Total Other Non-operating Income (Sum of Items 50 and 51)",
    "frm1701A:txt53A": "Total Taxable Income (Sum of Items 49 and 52)",
    "frm1701A:txt53B": "Total Taxable Income (Sum of Items 49 and 52)",
    "frm1701A:txt54A": "Less: Allowable reduction from gross sales/receipts and other non-operating income of PURELY self-employed individuals and/or professionals in the amount of P 250,000",
    "frm1701A:txt54B": "Less: Allowable reduction from gross sales/receipts and other non-operating income of PURELY self-employed individuals and/or professionals in the amount of P 250,000",
    "frm1701A:txt55A": "Taxable Income/(Loss) (Item 53 Less Item 54)",
    "frm1701A:txt55B": "Taxable Income/(Loss) (Item 53 Less Item 54)",
    "frm1701A:txt56A": "TAX DUE (Item 55 x 8% Income Tax Rate) (To Part II - Item 20)",
    "frm1701A:txt56B": "TAX DUE (Item 55 x 8% Income Tax Rate) (To Part II - Item 20)",
    "frm1701A:txt57A": "Prior Year's Excess Credits",
    "frm1701A:txt57B": "Prior Year's Excess Credits",
    "frm1701A:txt58A": "Tax Payments for the First Three (3) Quarters",
    "frm1701A:txt58B": "Tax Payments for the First Three (3) Quarters",
    "frm1701A:txt59A": "Creditable Tax Withheld for the First Three (3) Quarters",
    "frm1701A:txt59B": "Creditable Tax Withheld for the First Three (3) Quarters",
    "frm1701A:txt60A": "Creditable Tax Withheld per BIR Form No. 2307 for the 4th Quarter",
    "frm1701A:txt60B": "Creditable Tax Withheld per BIR Form No. 2307 for the 4th Quarter",
    "frm1701A:txt61A": "Tax Paid in Return Previously Filed, if this is an Amended Return",
    "frm1701A:txt61B": "Tax Paid in Return Previously Filed, if this is an Amended Return",
    "frm1701A:txt62A": "Foreign Tax Credits, if applicable",
    "frm1701A:txt62B": "Foreign Tax Credits, if applicable",
    "frm1701A:txt63A": "Other Tax Credits/Payments (specify)",
    "frm1701A:txt63B": "Other Tax Credits/Payments (specify)",
    "frm1701A:txt64A": "Total Tax Credits/Payments (Sum of Items 57 to 63) (To Item 21)",
    "frm1701A:txt64B": "Total Tax Credits/Payments (Sum of Items 57 to 63) (To Item 21)",
    "frm1701A:txt65A": "Net Taxable/(Overpayment) (Item 46 OR 56 Less Item 64) (To Part II - Item 22)",
    "frm1701A:txt65B": "Net Taxable/(Overpayment) (Item 46 OR 56 Less Item 64) (To Part II - Item 22)"
  },
  "1701MS": {},
  "1701Qv2018": {
    "frm1701q:txtTIN1": "Taxpayer Identification Number (TIN)",
    "frm1701q:txtTIN2": "Taxpayer Identification Number (TIN)",
    "frm1701q:txtTIN3": "Taxpayer Identification Number (TIN)",
    "frm1701q:txtBranchCode": "Taxpayer Identification Number (TIN)",
    "frm1701q:txtSpouseTIN1": "Spouse's TIN",
    "frm1701q:txtSpouseTIN2": "Spouse's TIN",
    "frm1701q:txtSpouseTIN3": "Spouse's TIN",
    "frm1701q:txtSpouseBranchCode": "Spouse's TIN",
    "frm1701q:txt26A": "Tax Due (From Part V, Schedule 1-Item 46 OR Schedule II-Item 54)",
    "frm1701q:txt26B": "Tax Due (From Part V, Schedule 1-Item 46 OR Schedule II-Item 54)",
    "frm1701q:txt27A": "Less: Tax Credits/Payments (From Part V, Schedule III-Item 62)",
    "frm1701q:txt27B": "Less: Tax Credits/Payments (From Part V, Schedule III-Item 62)",
    "frm1701q:txt28A": "Tax Payable/(Overpayment) (Item 26 Less Item 27) (From Part V, Item 63)",
    "frm1701q:txt28B": "Tax Payable/(Overpayment) (Item 26 Less Item 27) (From Part V, Item 63)",
    "frm1701q:txt29A": "Add: Total Penalties (From Part V, Schedule IV-Item 67)",
    "frm1701q:txt29B": "Add: Total Penalties (From Part V, Schedule IV-Item 67)",
    "frm1701q:txt30A": "Total Amount Payable/(Overpayment) (Sum of Items 28 and 29) (From Part V, Item 68)",
    "frm1701q:txt30B": "Total Amount Payable/(Overpayment) (Sum of Items 28 and 29) (From Part V, Item 68)",
    "frm1701q:txt36A": "Sales/Revenues/Receipts/Fees (net of sales returns, allowances and discounts)",
    "frm1701q:txt36B": "Sales/Revenues/Receipts/Fees (net of sales returns, allowances and discounts)",
    "frm1701q:txt37A": "Less: Cost of Sales/Services (applicable only if availing Itemized Deductions)",
    "frm1701q:txt37B": "Less: Cost of Sales/Services (applicable only if availing Itemized Deductions)",
    "frm1701q:txt38A": "Gross Income/(Loss) from Operation (Item 36 Less Item 37)",
    "frm1701q:txt38B": "Gross Income/(Loss) from Operation (Item 36 Less Item 37)",
    "frm1701q:txt39A": "39 Total Allowable Itemized Deductions",
    "frm1701q:txt39B": "39 Total Allowable Itemized Deductions",
    "frm1701q:txt40A": "40 Optional Standard Deduction (OSD) (40% of Item 36)",
    "frm1701q:txt40B": "40 Optional Standard Deduction (OSD) (40% of Item 36)",
    "frm1701q:txt41A": "Net Income/(Loss) This Quarter (Item 38 Less Either Item 39 OR 40)",
    "frm1701q:txt41B": "Net Income/(Loss) This Quarter (Item 38 Less Either Item 39 OR 40)",
    "frm1701q:txt42A": "Add: Taxable Income/(Loss) Previous Quarter/s",
    "frm1701q:txt42B": "Add: Taxable Income/(Loss) Previous Quarter/s",
    "frm1701q:txt43A": "43 Non-Operating Income (specify)",
    "frm1701q:txt43B": "43 Non-Operating Income (specify)",
    "frm1701q:txt44A": "44 Amount Received/Share in Income by a Partner from General Professional Partnership (GPP)",
    "frm1701q:txt44B": "44 Amount Received/Share in Income by a Partner from General Professional Partnership (GPP)",
    "frm1701q:txt45A": "Total Taxable Income/(Loss) To Date (Sum of Items 41 to 44)",
    "frm1701q:txt45B": "Total Taxable Income/(Loss) To Date (Sum of Items 41 to 44)",
    "frm1701q:txt46A": "Tax due on item 45 at the graduated rates for the filing year (to Part III, Item 26)",
    "frm1701q:txt46B": "Tax due on item 45 at the graduated rates for the filing year (to Part III, Item 26)",
    "frm1701q:txt47A": "Sales/Revenues/Receipts/Fees (net of sales returns, allowances and discounts)",
    "frm1701q:txt47B": "Sales/Revenues/Receipts/Fees (net of sales returns, allowances and discounts)",
    "frm1701q:txt48A": "Add: Non-Operating Income (specify)",
    "frm1701q:txt48B": "Add: Non-Operating Income (specify)",
    "frm1701q:txt49A": "Total Income for the quarter (Sum of Items 47 and 48)",
    "frm1701q:txt49B": "Total Income for the quarter (Sum of Items 47 and 48)",
    "frm1701q:txt50A": "Add: Total Taxable Income/(Loss) Previous Quarter (Item 51 of previous quarter)",
    "frm1701q:txt50B": "Add: Total Taxable Income/(Loss) Previous Quarter (Item 51 of previous quarter)",
    "frm1701q:txt51A": "Cumulative Taxable Income/(Loss) as of This Quarter (Sum of Items 49 and 50)",
    "frm1701q:txt51B": "Cumulative Taxable Income/(Loss) as of This Quarter (Sum of Items 49 and 50)",
    "frm1701q:txt52A": "Less: Allowable reduction from gross sales/receipts and other non-operating income of purely self-employed individuals and/or professionals in the amount of P250,000",
    "frm1701q:txt52B": "Less: Allowable reduction from gross sales/receipts and other non-operating income of purely self-employed individuals and/or professionals in the amount of P250,000",
    "frm1701q:txt53A": "Taxable Income/(Loss) To Date (Items 51 Less Item 52)",
    "frm1701q:txt53B": "Taxable Income/(Loss) To Date (Items 51 Less Item 52)",
    "frm1701q:txt54A": "Tax Due (Item 53 x 8% Tax Rate) (To Part III, Item 26)",
    "frm1701q:txt54B": "Tax Due (Item 53 x 8% Tax Rate) (To Part III, Item 26)",
    "frm1701q:txt55A": "Prior Year's Excess Credits",
    "frm1701q:txt55B": "Prior Year's Excess Credits",
    "frm1701q:txt56A": "Tax Payment/s for the Previous Quarter/s",
    "frm1701q:txt56B": "Tax Payment/s for the Previous Quarter/s",
    "frm1701q:txt57A": "Creditable Tax Withheld for the Previous Quarter/s",
    "frm1701q:txt57B": "Creditable Tax Withheld for the Previous Quarter/s",
    "frm1701q:txt58A": "Creditable Tax Withheld per BIR Form No. 2307 for this Quarter",
    "frm1701q:txt58B": "Creditable Tax Withheld per BIR Form No. 2307 for this Quarter",
    "frm1701q:txt59A": "Tax Paid in Return Previously Filed, if this is an Amended Return",
    "frm1701q:txt59B": "Tax Paid in Return Previously Filed, if this is an Amended Return",
    "frm1701q:txt60A": "Foreign Tax Credits, if applicable",
    "frm1701q:txt60B": "Foreign Tax Credits, if applicable",
    "frm1701q:txt61A": "Other Tax Credits/Payments (specify)",
    "frm1701q:txt61B": "Other Tax Credits/Payments (specify)",
    "frm1701q:txt62A": "Total Tax Credits/Payments (Sum of Items 55 to 61) (To Part III, Item 27)",
    "frm1701q:txt62B": "Total Tax Credits/Payments (Sum of Items 55 to 61) (To Part III, Item 27)",
    "frm1701q:txt63A": "Tax Payable/(Overpayment) (Item 46 or 54, Less Item 62) (To Part III, Item 28)",
    "frm1701q:txt63B": "Tax Payable/(Overpayment) (Item 46 or 54, Less Item 62) (To Part III, Item 28)",
    "frm1701q:txt64A": "Surcharge",
    "frm1701q:txt64B": "Surcharge",
    "frm1701q:txt65A": "Interest",
    "frm1701q:txt65B": "Interest",
    "frm1701q:txt66A": "Compromise",
    "frm1701q:txt66B": "Compromise",
    "frm1701q:txt67A": "Total Penalties (Sum of Items 64 to 66) (To Part III, Item 29)",
    "frm1701q:txt67B": "Total Penalties (Sum of Items 64 to 66) (To Part III, Item 29)",
    "frm1701q:txt68A": "Total Amount Payable/(Overpayment) (Sum of Items 63 and 67) (To Part III, Item 30)",
    "frm1701q:txt68B": "Total Amount Payable/(Overpayment) (Sum of Items 63 and 67) (To Part III, Item 30)"
  }
};

const revisionLabels: Record<string, Record<string, string>> = {
	'1701A': {
		'frm1701A:txtSpouseTIN1': '66 Spouse TIN, first three digits', 'frm1701A:txtSpouseTIN2': '66 Spouse TIN, middle three digits',
		'frm1701A:txtSpouseTIN3': '66 Spouse TIN, last three digits', 'frm1701A:txtSpouseBranchCode': '66 Spouse branch code',
		'frm1701A:txtSpouseRDOCode': '67 Spouse RDO code', 'frm1701A:optSpouseTaxType': '68 Spouse taxpayer type',
		'frm1701A:optSpouseATC': '69 Spouse alphanumeric tax code (ATC)', 'frm1701A:txtSpouseName': '70 Spouse name',
		'frm1701A:optSpouseFTC': '73 Spouse claiming foreign tax credits?', 'frm1701A:optSpouseTaxRate': '75 Spouse income tax rate',
		'frm1701A:txtTIN2': '4 TIN, middle three digits', 'frm1701A:txtTIN3': '4 TIN, last three digits',
		'frm1701A:txtBranchCode': '4 Branch code', 'frm1701A:txtAddress2': '9 Registered address, line 2',
		'frm1701A:txt41Desc': '41 Other income description', 'frm1701A:txt41A': '41 Other income', 'frm1701A:txt41B': '41 Other income',
		'frm1701A:txt42Desc': '42 Other income description', 'frm1701A:txt42A': '42 Other income', 'frm1701A:txt42B': '42 Other income',
		'frm1701A:txt50Desc': '50 Other non-operating income description', 'frm1701A:txt50A': '50 Other non-operating income', 'frm1701A:txt50B': '50 Other non-operating income',
		'frm1701A:txt51Desc': '51 Other non-operating income description', 'frm1701A:txt51A': '51 Other non-operating income', 'frm1701A:txt51B': '51 Other non-operating income'
	},
	'1701MS': {
		'frm1701MS:txtTaxDueSpeciala': '17 Tax due under special, preferential or exempt rate',
		'frm1701MS:txtTaxDueSpecialb': '17 Tax due under special, preferential or exempt rate',
		'frm1701MS:TotalTaxDueCompensationATP': '18A Total tax due under special, preferential or exempt rate',
		'frm1701MS:TotalTaxDueCompensationASP': '18A Total tax due under special, preferential or exempt rate',
		'frm1701MS:TotalTaxDueCompensationBTP': '18B Total tax due under graduated rates',
		'frm1701MS:TotalTaxDueCompensationBSP': '18B Total tax due under graduated rates',
		'frm1701MS:txtLess22A': '22 Allowable reduction for purely self-employed individuals',
		'frm1701MS:txtLess22B': '22 Allowable reduction for purely self-employed individuals',
		'frm1701MS:totalTaxReliefAvailmentA': '1 Total tax relief availment',
		'frm1701MS:totalTaxReliefAvailmentB': '1 Total tax relief availment',
		'taxCodeDropdown': '18 Taxpayer alphanumeric tax code (ATC)',
		'taxCodeDropdownSpouse': '18 Spouse alphanumeric tax code (ATC)'
	},
	'1700': {
		'frm1700:txtPg2Pt4I12': '12 Source of other taxable income',
		'frm1700:txtPg2Pt4I12C1': '12 Other taxable income', 'frm1700:txtPg2Pt4I12C2': '12 Other taxable income',
		'frm1700:txtPg1Pt1I8TaxFilerLastName': '8 Last name',
		'frm1700:txtPg1Pt1I8TaxFilerFirstName': '8 First name',
		'frm1700:txtPg1Pt1I8TaxFilerMiddleName': '8 Middle name',
		'frm1700:txtPg1Pt1I10DOB': '10 Date of birth',
		'frm1700:txtPg1Pt1I16TaxSpouseLastName': '16 Spouse last name',
		'frm1700:txtPg1Pt1I16TaxSpouseFirstName': '16 Spouse first name',
		'frm1700:txtPg1Pt1I16TaxSpouseMiddleName': '16 Spouse middle name',
		'frm1700:txtPg1Pt1I18SpouseContactNumber': '18 Spouse contact number',
		'frm1700:txtPg1Pt1I19SpouseDOB': '19 Spouse date of birth',
		'frm1700:txtPg1Pt1I20SpouseEmailAddress': '20 Spouse email address',
		'frm1700:txtPg1Pt2I31': '31 Total amount payable upon filing'
	},
	'1700v2018': {
		'frm1700:txtPg1I29A': '29 Portion of tax payable allowed for second installment',
		'frm1700:txtPg1I29B': '29 Portion of tax payable allowed for second installment'
	},
	'1701': {
		'frm1701:txtPg1Pt1I8TaxFiler': '8 Last name',
		'frm1701:txtPg1Pt1I8TaxFilerFirstName': '8 First name',
		'frm1701:txtPg1Pt1I8TaxFilerMiddleName': '8 Middle name',
		'frm1701:txtPg1Pt1I11Month': '11 Date of birth',
		'frm1701:txtPg1Pt2I29PortionTax': '29 Portion of tax payable allowed for second installment',
		'frm1701:txtPg1Pt2I32TotalUponFiling': '32 Total amount payable upon filing'
	},
	'1701v2018': {
		'frm1701:txtPg1I10BirthDate': '10 Date of birth',
		'frm1701:txtPg1I12Citizenship': '12 Citizenship',
		'frm1701:txtPg1I14ForeignTaxNumber': '14 Foreign tax number'
	},
	'1701Q': {
		'frm1701q:txt5TIN1': '5 TIN, first three digits', 'frm1701q:txt5TIN2': '5 TIN, middle three digits',
		'frm1701q:txt5TIN3': '5 TIN, last three digits', 'frm1701q:txt5BranchCode': '5 Branch code',
		'frm1701q:txt7TIN1': '7 Spouse TIN, first three digits', 'frm1701q:txt7TIN2': '7 Spouse TIN, middle three digits',
		'frm1701q:txt7TIN3': '7 Spouse TIN, last three digits', 'frm1701q:txt7BranchCode': '7 Spouse branch code',
		'frm1701q:txtTaxPayername': '9 Taxpayer name', 'frm1701q:txtSpousename': '10 Spouse name',
		'frm1701q:txt11Address': '11 Registered address', 'frm1701q:txt12Address': '12 Spouse registered address',
		'frm1701q:txt13BirthMonth': '13 Birth month', 'frm1701q:txt13BirthDay': '13 Birth day',
		'frm1701q:txt13BirthYear': '13 Birth year', 'frm1701q:txt14zip': '14 ZIP code',
		'frm1701q:txt15Telno': '15 Contact number', 'frm1701q:txt16BirthMonth': '16 Spouse birth month',
		'frm1701q:txt16BirthDay': '16 Spouse birth day', 'frm1701q:txt16BirthYear': '16 Spouse birth year',
		'frm1701q:j_id217': '25 Are you availing of tax relief under special law or an international tax treaty?',
		'frm1701q:txtTaxRelief25': '25 Tax relief type',
		'frm1701q:txt17': '17 Spouse ZIP code', 'frm1701q:txt18Telno': '18 Spouse contact number',
		'frm1701q:txt19': '19 Line of business or occupation', 'frm1701q:txt21': '21 Spouse line of business or occupation',
		'frm1701q:optATC20': '20 Alphanumeric tax code (ATC)', 'frm1701q:optATC22': '22 Spouse alphanumeric tax code (ATC)'
	},
	'1701Qv2018': {
		'frm1701q:txtTIN1': '5 TIN, first three digits', 'frm1701q:txtTIN2': '5 TIN, middle three digits',
		'frm1701q:txtTIN3': '5 TIN, last three digits', 'frm1701q:txtBranchCode': '5 Branch code',
		'frm1701q:optTaxpayerType': '7 Taxpayer type', 'frm1701q:optATC': '8 Alphanumeric tax code (ATC)',
		'frm1701q:txtTaxpayerName': '9 Taxpayer name', 'frm1701q:txtAddress': '10 Registered address',
		'frm1701q:txtAddress2': '10 Registered address, line 2', 'frm1701q:txtBirthMonth': '11 Birth month',
		'frm1701q:txtBirthDay': '11 Birth day', 'frm1701q:txtBirthYear': '11 Birth year',
		'txtEmail': '12 Email address', 'frm1701q:txtCitizenship': '13 Citizenship',
		'frm1701q:optForeignTaxCredits': '15 Claiming foreign tax credits?',
		'frm1701q:txtForeignTaxNumber': '14 Foreign tax number', 'frm1701q:optTaxRate': '16 Income tax rate',
		'frm1701q:optMethodOfDeduction': '16A Method of deduction',
		'frm1701q:txtSpouseTIN1': '17 Spouse TIN, first three digits', 'frm1701q:txtSpouseTIN2': '17 Spouse TIN, middle three digits',
		'frm1701q:txtSpouseTIN3': '17 Spouse TIN, last three digits', 'frm1701q:txtSpouseBranchCode': '17 Spouse branch code',
		'frm1701q:optSpouseType_1': '19 Spouse taxpayer type', 'frm1701q:optSpouseType_2': '19 Spouse taxpayer type',
		'frm1701q:optSpouseType_3': '19 Spouse taxpayer type', 'frm1701q:optSpouseATC': '20 Spouse alphanumeric tax code (ATC)',
		'frm1701q:txtSpouseName': '21 Spouse name', 'frm1701q:txtSpouseCitizenship': '22 Spouse citizenship',
		'frm1701q:optSpouseForeignTaxCred': '24 Spouse claiming foreign tax credits?',
		'frm1701q:txtSpouseForeignTaxNum': '23 Spouse foreign tax number',
		'frm1701q:optSpouseTaxRate': '25 Spouse income tax rate', 'frm1701q:optSpouseMethod': '25A Spouse method of deduction'
	}
};

function readableFieldLabel(field: IncomeEditorField): string {
	let text = field.id.split(':').at(-1) ?? '';
	text = text.replace(/^(?:txt|rdo|opt|hdn|ddl|chk)/i, '')
		.replace(/^Pg\d+(?:m)?(?:Pt\d+)?(?:Sc|Shed|Sched)?[A-Z0-9_]*?I\d+/, '')
		.replace(/^Pg\d+(?:m)?(?:Pt\d+)?(?:Sc|Shed|Sched)\d+_?/, '')
		.replace(/^Pg\d+(?:Pt\d+)?/, '')
		.replace(/C\d+$/, '')
		.replace(/([a-z])([A-Z])/g, '$1 $2')
		.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
		.replace(/[_]+/g, ' ')
		.replace(/\bNo\d+[ab]?\b/gi, '')
		.replace(/\s+/g, ' ').trim();
	const names: Record<string, string> = {
		CI: 'Compensation income', TW: 'Tax withheld', TIN1: 'TIN, first three digits',
		TIN2: 'TIN, middle three digits', TIN3: 'TIN, last three digits',
		DOB: 'Date of birth', Psoc: 'PSOC code'
	};
	if (names[text]) return names[text];
	if (!text || /^\d+[A-Z]?$/i.test(text)) {
		if (/Amortizations/.test(field.id)) return 'Amortization description';
		if (/Description|Desc/.test(field.id)) return 'Description';
		if (/Amount|Income|Cost|Deduct|[AB]$/.test(field.id)) return 'Amount';
		return 'Details';
	}
	return text.replace(/^\d+[A-Z]?\s*/, '').replace(/\bSc\d+\b/g, 'Schedule').trim() || 'Details';
}

function sourceLabel(form: IncomeForm, field: IncomeEditorField, initial: string): string {
	const specified = revisionLabels[form.code]?.[field.id];
	if (specified) return specified;
	const weak = /Pg\d|\bSc\d|^\d+[AB]?\s*(?:·\s*(?:Taxpayer|Spouse))?$/i.test(initial);
	if (!weak) return initial;
	const source = sourceRowLabels[form.code]?.[field.id];
	return source || readableFieldLabel(field);
}

function fieldCoordinates(form: IncomeForm, field: IncomeEditorField, label: string): Pick<IncomeEditorField, 'item' | 'person' | 'rowKey'> {
	const name = field.id.split(':').at(-1)!;
	let item = label.match(/^(\d+[A-Z]?)(?=\s|$)/)?.[1] ??
		name.match(/(?:^txt|I|No)(\d+)(?=[A-Za-z_]|$)/)?.[1] ??
		name.match(/^txt(?:Particular|Agency|Number|Date|Amount)(\d+)$/)?.[1];
	let person: IncomeEditorField['person'];
	const amountPerson = field.kind === 'money' && name.match(/(?:I|txt)(\d+)([AB])(?:TaxDue|TaxPayable|TotalAmtPyble)?$/);
	if (amountPerson) {
		item = amountPerson[1];
		person = amountPerson[2] === 'A' ? 'taxpayer' : 'spouse';
	}
	const historicalColumn = name.match(/C([12])$/);
	if (field.kind === 'money' && historicalColumn) person = historicalColumn[1] === '1' ? 'taxpayer' : 'spouse';
	if (form.code === '1701Q') {
		const credit = name.match(/^txt(38|40)([A-N])$/);
		if (credit) {
			const offset = credit[2].charCodeAt(0) - 65;
			const first = String.fromCharCode(65 + offset - offset % 2);
			const second = String.fromCharCode(first.charCodeAt(0) + 1);
			item = `${credit[1]}${first}/${second}`;
			person = offset % 2 === 0 ? 'taxpayer' : 'spouse';
		}
	}
	if (form.code === '1701MS') {
		const personSuffix = name.match(/(?:No\d+|Income|Credits|Payments|No\d+[a-zA-Z]*)([ab])$/);
		if (personSuffix || /^(?:txtGross|txtLessNonTaxable|txtTaxRate|txtTaxDueSpecial)[ab]$/.test(name)) person = name.endsWith('b') ? 'spouse' : 'taxpayer';
		if (/SP$/.test(name)) person = 'spouse';
		if (/TP$/.test(name)) person = 'taxpayer';
		if (/^txtLess22[AB]$|^totalTaxReliefAvailment[AB]$/.test(name)) person = name.endsWith('B') ? 'spouse' : 'taxpayer';
		if (/Spouse|Standard/.test(name) || /(?:No8|No12|RDOCode|Email|TelNum10)b$/.test(name)) person = 'spouse';
		if (/Main$/.test(name)) person = 'taxpayer';
		const penalty = name.match(/^(txtSurchangeNo28|txtInterestNo28|txtCompromise28|txtTotalPenaltiesNo28)[ab]$/);
		if (penalty) {
			item = ({ txtSurchangeNo28: '28A', txtInterestNo28: '28B', txtCompromise28: '28C', txtTotalPenaltiesNo28: '28D' } as Record<string, string>)[penalty[1]];
			person = name.endsWith('b') ? 'spouse' : 'taxpayer';
		}
	}
	if (/Spouse|STIN|SBranchCode/.test(name) && !name.endsWith('TaxpayerSpouse')) person = 'spouse';
	const employer = name.match(/(?:Pg2I|Sched1[cde]_)(\d+)(?:PartVI|REG|CIFR|TW)/);
	let phase = '';
	if (employer && /Schedule 1 · Employer/.test(field.section)) {
		item = employer[1];
		phase = /PartVIEmployer|Sched1[cde]_/.test(name) ? ':details' : ':person';
	}
	const scope = `${field.page}:${field.section}`;
	return { item, person, rowKey: item ? `${scope}:${item}${phase}` : `${scope}:${field.id}` };
}

export function incomeEditorRows(fields: IncomeEditorField[]): { key: string; item?: string; fields: IncomeEditorField[] }[] {
	const rows: { key: string; item?: string; fields: IncomeEditorField[] }[] = [];
	const byKey = new Map<string, typeof rows[number]>();
	for (const field of fields) {
		const key = field.rowKey ?? `${field.page}:${field.section}:${field.item ?? field.id}`;
		let row = byKey.get(key);
		if (!row) {
			row = { key, item: field.item, fields: [] };
			rows.push(row);
			byKey.set(key, row);
		}
		row.fields.push(field);
	}
	return rows;
}

export function incomeEditorRowGroups(fields: IncomeEditorField[]) {
	const groups: { columns: string[]; rows: ReturnType<typeof incomeEditorRows> }[] = [];
	for (const row of incomeEditorRows(fields)) {
		const columns = [...new Set(row.fields.flatMap(field => field.column ? [field.column] : []))];
		const previous = groups.at(-1);
		const sameColumns = previous && (columns.length === 0
			? previous.columns.length === 0
			: previous.columns.length > 0 && (columns.every(column => previous.columns.includes(column)) ||
				previous.columns.every(column => columns.includes(column))));
		if (sameColumns) {
			previous.rows.push(row);
			if (columns.length > previous.columns.length) previous.columns = columns;
		} else {
			groups.push({ columns, rows: [row] });
		}
	}
	return groups;
}

const identityLabels: Record<string, string> = {
	tin1: 'TIN, first three digits', tin2: 'TIN, middle three digits', tin3: 'TIN, last three digits',
	branchCode: 'Branch code', rdoCode: 'RDO code', taxpayerName: 'Taxpayer name',
	address: 'Registered address', address2: 'Registered address, line 2', zipCode: 'ZIP code',
	contactNumber: 'Contact number', email: 'Email address'
};

export const annual1701ASchedules = {
	'IV.A · Graduated income tax': 46,
	'IV.B · 8% income tax': 56,
	'IV.C · Tax credits and payments': 65
} as const;

export const annual1701AScheduleLabels: Record<string, string> = {
	36: 'Sales, revenue, receipts or fees', 37: 'Less: Returns, allowances and discounts', 38: 'Net sales, revenue, receipts or fees',
	39: 'Optional standard deduction', 40: 'Net income', 41: 'Other income', 42: 'Other income',
	43: 'Share of income from a general professional partnership', 44: 'Total other income', 45: 'Total taxable income', 46: 'Tax due',
	47: 'Sales, revenue, receipts or fees', 48: 'Less: Returns, allowances and discounts', 49: 'Net sales, revenue, receipts or fees',
	50: 'Other non-operating income', 51: 'Other non-operating income', 52: 'Total other non-operating income',
	53: 'Total taxable income', 54: '₱250,000 reduction for purely self-employed filers', 55: 'Taxable income or loss', 56: 'Tax due',
	57: 'Prior year’s excess credits', 58: 'Tax paid for the first three quarters', 59: 'Creditable tax withheld for the first three quarters',
	60: 'Fourth-quarter creditable tax withheld per Form 2307', 61: 'Tax paid on the previously filed return', 62: 'Foreign tax credits',
	63: 'Other tax credits or payments', 64: 'Total tax credits and payments', 65: 'Net tax payable or overpayment'
};

export const legacyQuarterlyComputation = 'Part II · Computation of Tax';
const legacyQuarterlyAmountLabels: Record<string, string> = {
	26: 'Sales, revenues, receipts or fees',
	27: 'Amount received by a partner from a general professional partnership, excluding loans',
	28: 'Total sales and partnership income',
	29: 'Less: Cost of sales or services',
	30: 'Gross income from operations',
	31: 'Add: Other income',
	32: 'Total gross income',
	33: 'Less: Deductions',
	34: 'Taxable income this quarter',
	35: 'Add: Taxable income from previous quarters',
	36: 'Taxable income to date',
	37: 'Tax due',
	'38A/B': "Prior years' excess credits",
	'38C/D': 'Tax payments for previous quarters',
	'38E/F': 'Creditable tax withheld for previous quarters',
	'38G/H': 'Creditable tax withheld this quarter per BIR Form 2307',
	'38I/J': 'Tax paid on the previously filed return, if amended',
	'38K/L': 'Other payments made (attach proof of payment, BIR Form 0605)',
	'38M/N': 'Total tax credits and payments',
	39: 'Tax payable or overpayment',
	'40A/B': 'Surcharge',
	'40C/D': 'Interest',
	'40E/F': 'Compromise',
	'40G/H': 'Total penalties',
	41: 'Total amount payable or overpayment',
	'41C': 'Aggregate amount payable or overpayment'
};

const revised1700ComputationLabels: Record<string, string> = {
	42: 'Gross compensation income', 43: 'Less: Non-taxable or exempt compensation',
	44: 'Gross taxable compensation', 45: 'Add: Other taxable non-business or non-professional income',
	46: 'Total taxable income', 47: 'Tax due at graduated rates',
	48: 'Gross compensation income', 49: 'Less: Non-taxable or exempt compensation',
	50: 'Gross taxable compensation', 51: 'Add: Other taxable income',
	52: 'Total taxable income', 53: 'Tax due at the 25% flat rate',
	54: 'Tax withheld per Form 2316', 55: 'Tax paid on the previously filed return (amended returns)',
	56: 'Foreign tax credits', 57: 'Other tax credits or payments',
	58: 'Total tax credits and payments', 59: 'Net tax payable or overpayment'
};
const revised1700ComputationSections: Record<string, string> = {
	'Part V.A': 'Part V.A · Graduated rates',
	'Part V.B': 'Part V.B · 25% flat rate for nonresident aliens not engaged in trade or business',
	'Part V.C': 'Part V.C · Tax credits and payments'
};

const legacy1700SummaryAmount = /^frm1700:txtPg1Pt2I(?:2[3-9]|3[01])(?:[A-Z]|$)/;
const msAllocationAmounts = new Set<string>(overpaymentOptions1701MS.map(option => option.amount));

export function incomeEditorFields(form: IncomeForm): IncomeEditorField[] {
	const identities = new Map(Object.entries(form.identity).map(([key, id]) => [id, identityLabels[key]]));
	return (fieldData[form.code as keyof typeof fieldData] as IncomeEditorField[]).map(sourceField => {
		const field = { ...sourceField, kind: form.code === '1701' ? legacy1701FieldKind(sourceField) : revisedIncomeFieldKind(form.code, sourceField) };
		if (form.code === '1700' && (legacy1700SummaryAmount.test(field.id) || field.id === 'frm1700:txtPg1Pt2I34Amount')) field.kind = 'money';
		if (form.code === '1701MS' && msAllocationAmounts.has(field.id)) field.kind = 'money';
		let label = sourceLabel(form, field, fieldLabels[field.id] || field.label);
		const identityLabel = identities.get(field.id);
		if (identityLabel) {
			const number = label.match(/^\d+[A-Z]?\b/)?.[0] ??
				field.id.match(/I(\d+)(?=[A-Z])/)?.[1];
			label = number ? `${number} ${identityLabel}` : identityLabel;
		}
		const employer = field.id.match(/^frm1700:(?:txt|rdo)Pg2I(\d+)PartVI(.*)$/);
		const employerAmount = field.id.match(/^frm1700:txtPg2ISched1([cde])_(\d+)(?:REG|CIFR|TW)$/);
		const employerTotal = field.id.match(/^frm1700:txtPg2ISched1([cde])_5([AB])(?:REG|CIFR|TW)$/);
		if (form.code === '1700v2018') {
			const amountItem = field.id.match(/^frm1700:txtPg2I(\d+)[AB]$/)?.[1];
			if (amountItem && revised1700ComputationLabels[amountItem]) label = `${amountItem} ${revised1700ComputationLabels[amountItem]}`;
			const descriptionItem = field.id.match(/^frm1700:txtPg2I(45|49|51|57)Desc$/)?.[1];
			const descriptions: Record<string, string> = {
				45: 'Other taxable non-business or non-professional income description',
				49: 'Non-taxable or exempt compensation description',
				51: 'Other taxable income description', 57: 'Credit or payment description'
			};
			if (descriptionItem) label = `${descriptionItem} ${descriptions[descriptionItem]}`;
		}
		if (employer) {
			const [, row, name] = employer;
			const description = {
				Employee: 'Income earner', EmployerName1: 'Employer name', EmployerName2: 'Name continuation (optional)',
				EmployerTIN1: 'Employer TIN, first three digits', EmployerTIN2: 'Employer TIN, middle three digits',
				EmployerTIN3: 'Employer TIN, last three digits', EmployerBranchCode: 'Employer branch code'
			}[name];
			if (description) label = `${row} ${description}`;
		}
		if (employerAmount) label = `${employerAmount[2]}${employerAmount[1].toUpperCase()} ${{ c: 'Graduated-rate compensation', d: '25%-rate compensation', e: 'Tax withheld' }[employerAmount[1]]}`;
		if (form.code === '1701A' && field.id === 'txtEmail') label = '11 Email address';
		if (form.code === '1701v2018' && field.id === 'txtEmail') label = '11 Email address';
		if (field.id === form.year && !fieldLabels[field.id]) label = '1 Filing year';
		const row = employer?.[1] ?? employerAmount?.[2];
		let section = row ? `Schedule 1 · Employer ${row}` : field.section;
		if (form.code === '1700v2018') section = revised1700ComputationSections[section.split(' - ')[0]] ?? section;
		if (form.code === '1701Q' && section === 'Part II') section = legacyQuarterlyComputation;
		if (form.code === '1701A' && field.page === '2') {
			const scheduleItem = /^frm1701A:txt(\d{2})(?:[AB]|Desc)$/.exec(field.id)?.[1];
			if (scheduleItem) {
				section = Object.entries(annual1701ASchedules).find(([, lastItem]) => Number(scheduleItem) <= lastItem)?.[0] ?? section;
			}
		}
		const coordinates = fieldCoordinates(form, { ...field, section }, label);
		if (section === legacyQuarterlyComputation && coordinates.item) {
			label = legacyQuarterlyAmountLabels[coordinates.item] ?? label;
		}
		if (coordinates.item && !/^\d+[A-Z]?(?=\s|$)/.test(label)) label = `${coordinates.item} ${label}`;
		if (coordinates.person && !new RegExp(coordinates.person, 'i').test(label)) label += ` · ${coordinates.person === 'taxpayer' ? 'Taxpayer' : 'Spouse'}`;
		const optionalEmployer = form.code === '1700v2018' && !!row && Number(row) > 1;
		const result = { ...field, label, section, ...coordinates, optionalSection: optionalEmployer || field.optionalSection, maxLength: field.id === form.year ? 4 : field.maxLength };
		if (employerTotal) return {
			...result,
			label: `5${employerTotal[2]} ${{ c: 'Graduated-rate compensation', d: '25%-rate compensation', e: 'Tax withheld' }[employerTotal[1]]}`,
			rowHeading: employerTotal[2] === 'A' ? 'Taxpayer totals' : 'Spouse totals'
		};
		if (form.code === '1701') {
			const historical = { ...result, ...legacy1701ScheduleLayout(result) };
			return { ...historical, ...annual2013EditorLayout(historical) };
		}
		if (form.code === '1701v2018' || form.code === '1701MS') return { ...result, ...revisedIncomeScheduleLayout(form.code, result) };
		return form.code === '1700' && field.page !== '1' ? { ...result, ...legacy1700ScheduleLayout(result) } : result;
	}).sort((left, right) => {
		if (!['1700v2018', '1701v2018'].includes(form.code) || left.page !== '2' || right.page !== '2') return 0;
		const leftRow = left.section.match(/^Schedule 1 · Employer (\d+)$/);
		const rightRow = right.section.match(/^Schedule 1 · Employer (\d+)$/);
		if (leftRow && rightRow) return Number(leftRow[1]) - Number(rightRow[1]);
		if (leftRow) return /Sched1[cde]_5|IShed1c_3/.test(right.id) || (form.code === '1701v2018' && right.section.startsWith('Schedule ')) ? -1 : 1;
		if (rightRow) return /Sched1[cde]_5|IShed1c_3/.test(left.id) || (form.code === '1701v2018' && left.section.startsWith('Schedule ')) ? 1 : -1;
		return 0;
	});
}

export function incomeEditorPageTitle(form: IncomeForm, page: string): string {
	if (form.code === '1701Q' && page === '1') return 'Taxpayer details and tax computation';
	if (page === '1') return 'Taxpayer details and return summary';
	if (form.code === '1700') return ({ '2': 'Employers and tax computation', '3': 'Supplemental income', '4': 'Address and dependents' } as Record<string, string>)[page];
	if (page.endsWith('TYPE')) return `Activity schedule ${parseInt(page)}`;
	if (page.endsWith('m')) return `Consolidation ${parseInt(page)}`;
	if (form.code === '1700v2018') return 'Employer details and tax computation';
	if (form.code === '1701' && /^\d+$/.test(page)) return [
		'', '', 'Regular income tax computation', 'Income tax and tax relief', 'Spouse and signatory information',
		'Compensation, sales and trading costs', 'Manufacturing costs and deductions', 'Ordinary deductions continued', 'Special deductions and loss carryover',
		'Tax credits and balance sheet', 'Book-to-tax reconciliation', 'Final-tax and exempt income', 'Consolidated income tax by regime'
	][Number(page)] ?? `Return schedules · Page ${page}`;
	if (form.code === '1701v2018') return ({
		'2': 'Spouse and taxable income', '3': 'Deductions and operating losses', '4': 'Tax credits and reconciliation'
	} as Record<string, string>)[page] ?? `Return schedules · Page ${page}`;
	if (form.code === '1701A' || form.code === '1701Qv2018' || form.code === '1701MS') return 'Schedules and tax computation';
	return `Return schedules · Page ${page}`;
}

export function incomeChoiceLabel(field: IncomeEditorField, value: string, index: number): string {
	const label = field.choiceLabels[value];
	if (field.id === 'frm1701q:txtTaxRelief25' && value === '0') return 'Select tax relief type';
	if (field.id === legacy1701Filing.overpayment) {
		return ['Refund', 'Tax credit certificate (TCC)', 'Carry over to next year or quarter'][index] ?? value;
	}
	if (field.id === legacy1701Filing.type) return value === legacy1701Filing.certificate ? 'Community tax certificate (CTC)' : 'Government-issued ID';
	if (field.id === 'frm1701:rdoPg1Pt1I7Type' && value === 'Single') return 'Sole proprietor';
	if (/^frm1701:rdo(?:Pg1Pt1I20Deduction|Pg4Pt7I105Itemized|(?:Pg1I21|Pg2I12)AMethodDeduction)$/.test(field.id)) {
		if (value === 'OSD') return '40% Optional Standard Deduction (OSD)';
		if (value === 'Itemized') return 'Itemized deductions';
	}
	if (field.id === 'frm1701:rdoPg1Pt1I15Income') return value === 'WithIncome' ? 'Yes' : 'No';
	if (/^frm1701:rdoPg5Sc1I[1-4]TaxpayerSpouse$/.test(field.id)) return value === '2' ? 'Spouse' : 'Taxpayer';
	if (/^frm1701:ddlPg11Sc12AI12KindPSCSC[12]$/.test(field.id)) {
		return ({ PS: 'Preferred shares', CS: 'Common shares' } as Record<string, string>)[value] ?? value;
	}
	if (/^frm1701:rdo(?:Pg1Pt1I21Accounting|Pg4Pt7I106CashAccOth)$/.test(field.id) && value === 'Others') return 'Other (specify)';
	if (/^frm1701:rdo(?:Pg1Pt1I14Status|Pg1I16CivilStatus)$/.test(field.id) && value === 'Widow') return 'Widowed';
	if (field.id === 'frm1701:rdoPg1m') {
		return ['One exempt or special-rate activity', 'Two or more exempt or special-rate activities'][index] ?? value;
	}
	if (field.id === 'frm1701:rdoPg1Overpayment') {
		return ({ Refund: 'Refund', TCC: 'Tax credit certificate (TCC)', CarryOver: 'Carry over to next year or quarter' } as Record<string, string>)[value] ?? value;
	}
	if (/^methodOfDeduction(?:Main|Standard)$/.test(field.id)) return value.startsWith('osd') ? 'Optional standard deduction (OSD)' : 'Itemized deductions';
	if (/^frm1700:rdoPg1Pt1I(?:3JointFiling|14ClaimingAdditionalExemptions|21SpouseClaimAdditionalExemption)$/.test(field.id)) {
		return /Yes(?:Ind)?$/.test(value) ? 'Yes' : 'No';
	}
	if (field.id === 'GovorCTC') return value === 'CTC' ? 'Community tax certificate (CTC)' : 'Government-issued ID';
	if (/Month(?:No1)?$/.test(field.id) && /^\d{2}$/.test(value)) {
		const month = Number(value);
		return month ? new Intl.DateTimeFormat('en-PH', { month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2025, month - 1))) : 'Select month';
	}
	if (field.id === 'frm1701MS:txtIfMarried') return ({ '1': 'Jointly', '2': 'Separately', '3': 'Spouse has no income' } as Record<string, string>)[value] ?? value;
	if (/^frm1701MS:sourceOfIncome(?:Taxpayer|Spouse)$/.test(field.id)) {
		return ({ '1': 'Income from business', '2': 'Mixed income', '3': 'Income from profession', '4': 'Compensation income' } as Record<string, string>)[value] ?? value;
	}
	if (/^frm1701q:optATC(?:20|22)$/.test(field.id)) {
		return ({ II011: 'Compensation (II011)', II012: 'Business (II012)', II013: 'Mixed income (II013)' } as Record<string, string>)[value] ?? value;
	}
	if (/^frm1701MS:txtTaxpayerNo12[ab]$/.test(field.id)) return ({ '2': 'Graduated rates', '3': '8% rate', '4': 'Exempt', '5': 'Preferential rate' } as Record<string, string>)[value] ?? value;
	if (/DateQuarter$/.test(field.id)) return ['First quarter', 'Second quarter', 'Third quarter'][index] ?? value;
	if (/^frm1700:rdoPg1I(6|20)/.test(field.id)) return value === 'Employee' ? 'Employee (regular rates)' : 'Nonresident alien (25%)';
	if (/opt(?:Spouse)?TaxRate$/.test(field.id) && ['G', 'E'].includes(value)) return value === 'G' ? 'Graduated rates' : '8% rate';
	if (/TaxRate$/.test(field.id) && ['Graduated', 'Percentage'].includes(value)) {
		return value === 'Graduated' ? 'Graduated rates' : '8% of gross sales or receipts';
	}
	if (label && label !== value && !label.includes(':')) return label;
	if (value === 'Y' || value === 'N') return value === 'Y' ? 'Yes' : 'No';
	if (value.includes(':')) return value.split(':').at(-1)!.replace(/^.*?I\d+/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
	return value;
}
