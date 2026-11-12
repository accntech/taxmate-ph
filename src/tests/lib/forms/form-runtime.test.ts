import { expect, it } from 'vitest';
import { getReturnAmount } from '$lib/forms/form-runtime';
it('does not misrepresent annual remittances as an amount due', () => {
 expect(getReturnAmount('1604C', { 'frm1604c:txtSched1Total': '10000.00' })).toBeUndefined();
 expect(getReturnAmount('0619E', { 'frm0619E:txtTax18': '8300.00' })).toBe('8300.00');
});
