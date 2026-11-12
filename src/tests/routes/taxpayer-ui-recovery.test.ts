import { render } from 'svelte/server';
import { afterEach, describe, expect, it } from 'vitest';
import TaxpayerList from '../../routes/ebirforms/taxpayers/+page.svelte';
import { ebirformsWorkspace as workspace, initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';

afterEach(() => {
 Object.assign(workspace, { profileLoadState: 'idle', profileLoadError: '', profileLoadErrorDetails: '', hasLoadedProfiles: false });
 workspace.profiles = [{ ...initialProfile }];
});

describe('taxpayer load recovery presentation', () => {
 it('does not present the sample as a saved taxpayer before loading succeeds', () => {
  Object.assign(workspace, { profileLoadState: 'idle' });
  const { body } = render(TaxpayerList);
  expect(body).not.toContain('Sample Taxpayer');
  expect(body).not.toContain('1 saved taxpayer');
 });
 it('shows plain-language failure and Retry without actionable stale rows', () => {
  Object.assign(workspace, { profileLoadState: 'error', profileLoadError: 'Taxpayer profiles could not be loaded. Try again.', profileLoadErrorDetails: 'private diagnostic' });
  const { body } = render(TaxpayerList);
  expect(body).toContain('Retry');
  expect(body).toContain('Taxpayer profiles could not be loaded. Try again.');
  expect(body).not.toContain(`href="/ebirforms/taxpayers/${initialProfile.id}/forms"`);
  expect(body).not.toContain('More actions for Sample Taxpayer');
 });
 it('emphasizes opening forms and groups administrative actions', () => {
  Object.assign(workspace, { profileLoadState: 'loaded' });
  const { body } = render(TaxpayerList);
  const taxpayerLink = body.match(/<a\b[^>]*href="([^"]+)"[^>]*>\s*Sample Taxpayer\s*<\/a>/);
  expect(taxpayerLink?.[1]).toBe(`/ebirforms/taxpayers/${initialProfile.id}/forms`);
  expect(body).toContain('Edit profile for Sample Taxpayer');
  expect(body).toContain('More actions for Sample Taxpayer');
  expect(body).not.toContain('>Archive</button>');
  expect(body).not.toContain('>Delete</button>');
 });
});
