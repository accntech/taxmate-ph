import { beforeEach, describe, expect, it, vi } from 'vitest';
const { submit } = vi.hoisted(() => ({ submit: vi.fn() }));
vi.mock('$lib/tauri/submission', () => ({
 createSubmissionClient: () => submit,
 formatSubmissionError: (e: unknown) => String(e)
}));
import { ebirformsWorkspace as workspace, createInitialFormValues, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';

describe('return validation at filing boundaries', () => {
 beforeEach(async () => {
  submit.mockReset();
  workspace.formValues = createInitialFormValues(initialProfile);
  workspace.finalFlag = '0';
 });
 it('does not mark an incomplete return final', async () => {
  workspace.formValues['frm1601EQ:txtYear'] = '';
  await workspace.markFinalCopy();
  expect(workspace.finalFlag).toBe('0');
 });
 it('does not send an incomplete return to the submission client', async () => {
  workspace.formValues['frm1601EQ:txtYear'] = '';
  await workspace.submitCurrentReturn();
  expect(submit).not.toHaveBeenCalled();
  expect(workspace.statusMessage).toContain('Correct');
 });
 it('rejects taxes withheld Yes with no ATC even when all displayed withholding amounts are zero', async () => {
  workspace.formValues = createInitialFormValues({
   ...initialProfile, address: '123 Example Street', zipCode: '0123', contactNumber: '09171234567'
  });
  workspace.formValues['frm1601EQ:txtYear'] = '2025';
  expect(workspace.formValues['frm1601EQ:txtTotalTaxesWithheld']).toBe('0.00');
  await workspace.markFinalCopy();
  expect(workspace.finalFlag).toBe('0');
  expect(workspace.validationErrors).toEqual({
   'frm1601EQ:txtATC13': 'Add at least one ATC for taxes withheld.'
  });
  await workspace.submitCurrentReturn();
  expect(submit).not.toHaveBeenCalled();
  expect(workspace.validationErrors['frm1601EQ:txtATC13']).toBeTruthy();
 });
 it('preserves unfinished monetary input when saving a draft', async () => {
  submit.mockResolvedValue({status:'drafted', finalFlag:'2', message:'Draft saved'});
  workspace.formValues['frm1601EQ:txtRemittanceFirstMonth'] = '12.';
  await workspace.saveDraft();
  expect(submit.mock.calls[0][0].xml).toContain('txtRemittanceFirstMonth=12.');
 });
 it('can validate for Save without clearing ATC draft entries when taxes withheld is No', async () => {
  workspace.formValues = createInitialFormValues({
   ...initialProfile, address: '123 Example Street', zipCode: '0123', contactNumber: '09171234567'
  });
  Object.assign(workspace.formValues, {
   'frm1601EQ:txtYear': '2025', 'frm1601EQ:optTaxesWithheld': 'N',
   'frm1601EQ:txtATC13': 'WI120', 'frm1601EQ:txtTaxBase13': '100000'
  });
  const before = { ...workspace.formValues };
  expect(workspace.validateReturn({ applyCalculations: false })).toBe(true);
  expect(workspace.formValues).toEqual(before);
 });
 it('still allows saving incomplete work as a draft', async () => {
  submit.mockResolvedValue({status:'drafted', finalFlag:'2', message:'Draft saved'});
  workspace.formValues['frm1601EQ:txtYear'] = '';
  await workspace.saveDraft();
  expect(submit).toHaveBeenCalledOnce();
  expect(submit.mock.calls[0][0].mode).toBe('dry_run');
 });
});
