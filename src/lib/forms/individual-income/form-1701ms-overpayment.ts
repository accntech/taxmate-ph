import { normalizeCurrencyInput } from '$lib/components/ui/currency-input/currency';

type Values = Record<string, string>;

export const overpaymentOptions1701MS = [
	{ choice: 'frm1701MS:txtToBeRefunded', amount: 'frm1701MS:txtToBeRefunded1', sourceValue: '1', label: 'Refund', amountLabel: 'Refund amount' },
	{ choice: 'frm1701MS:txtToBeIssued', amount: 'frm1701MS:txtToBeIssued1', sourceValue: '2', label: 'Tax credit certificate (TCC)', amountLabel: 'Tax credit certificate amount' },
	{ choice: 'frm1701MS:txtToBeCarried', amount: 'frm1701MS:txtToBeCarried1', sourceValue: '3', label: 'Carry over to next year or quarter', amountLabel: 'Carry-over amount' }
] as const;

type Option = typeof overpaymentOptions1701MS[number];

export function is1701MSOverpaymentField(id: string): boolean {
	return overpaymentOptions1701MS.some(option => option.choice === id || option.amount === id);
}

export function is1701MSOverpaymentSelected(option: Option, values: Values): boolean {
	const value = values[option.choice];
	return value === option.sourceValue || ['Y', '1', 'true', 'on'].includes(value);
}

export function has1701MSOverpayment(calculated: Values): boolean {
	return Number(calculated['frm1701MS:txtAggregateAmountPayable30a']?.replaceAll(',', '')) < 0;
}

function allocationCents(value = ''): number {
	return Math.round(Number(normalizeCurrencyInput(value)) * 100);
}

export function get1701MSOverpaymentAllocation(values: Values, calculated: Values) {
	const selected = overpaymentOptions1701MS.filter(option => is1701MSOverpaymentSelected(option, values));
	const balance = (id: string) => Math.round(Number(calculated[id]?.replaceAll(',', '') || 0) * 100);
	const requiredCents = Math.abs(balance('frm1701MS:txtAmountPayableNo27a') + balance('frm1701MS:txtAmountPayableNo27b'));
	const allocatedCents = selected.reduce((sum, option) => sum + allocationCents(values[option.amount]), 0);
	return { selected, requiredCents, allocatedCents };
}

export function clear1701MSOverpayment(): Values {
	return Object.fromEntries(overpaymentOptions1701MS.flatMap(option => [[option.choice, ''], [option.amount, '']]));
}

export function validate1701MSOverpayment(values: Values, calculated: Values): Values {
	if (!has1701MSOverpayment(calculated)) return {};
	const { selected, requiredCents, allocatedCents } = get1701MSOverpaymentAllocation(values, calculated);
	const [refund, certificate] = overpaymentOptions1701MS;
	const errors: Values = {};
	if (!selected.length) {
		errors[refund.choice] = 'Choose how to allocate the overpayment.';
		return errors;
	}
	if (selected.includes(refund) && selected.includes(certificate)) {
		errors[certificate.choice] = 'Choose either a refund or a tax credit certificate.';
	}
	for (const option of selected) {
		const amount = normalizeCurrencyInput(values[option.amount] ?? '');
		if (!amount || Number(amount) <= 0) errors[option.amount] = 'Enter an amount greater than zero.';
		else if (/\.\d{3,}$/.test(amount)) errors[option.amount] = 'Enter no more than two decimal places.';
	}
	if (allocatedCents !== requiredCents) errors[refund.choice] = 'The selected amounts must total the Item 27 overpayment.';
	return errors;
}
