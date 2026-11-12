import { render } from 'svelte/server';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
const { route } = vi.hoisted(() => ({ route: { url: new URL('http://localhost/ebirforms/taxpayers'), get params() { const parts = this.url.pathname.split('/'); return { id: parts[3], formCode: parts[5] }; } } }));
vi.mock('$app/state', () => ({ page: route }));
import Layout from '../../routes/+layout.svelte';
const children = createRawSnippet(() => ({ render: () => '<div>Page content</div>' }));

describe('contextual preparation guidance', () => {
 it('keeps the taxpayer directory focused on selecting a taxpayer', () => {
  route.url = new URL('http://localhost/ebirforms/taxpayers');
  const { body } = render(Layout, { props: { children } });
  expect(body).not.toContain('aria-label="eBIRForms preparation steps"');
  expect(body).toContain('Workspaces');
  expect(body).toContain('Settings');
 });
 it('omits the sidebar preparation guide when working on a return', () => {
  route.url = new URL('http://localhost/ebirforms/taxpayers/1234567890000/forms/1601EQ');
  const { body } = render(Layout, { props: { children } });
  expect(body).not.toContain('aria-label="eBIRForms preparation steps"');
 });
});

describe('topbar breadcrumbs', () => {
 function breadcrumbs(path: string) {
  route.url = new URL(`http://localhost${path}`);
  const { body } = render(Layout, { props: { children } });
  return [...body.matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)].at(-1)?.[1] ?? '';
 }
 it('links the returns page to its taxpayer and directory without suite branding', () => {
  const nav = breadcrumbs('/ebirforms/taxpayers/1234567890000/forms');
  expect(nav).toContain('href="/ebirforms/taxpayers"');
  expect(nav).toContain('href="/ebirforms/taxpayers/1234567890000"');
  expect(nav).toContain('aria-current="page"');
  expect(nav).toContain('Tax Returns');
  expect(nav).not.toContain('TaxMate');
  expect(nav).not.toContain('href="/ebirforms/taxpayers/1234567890000/forms"');
 });
 it('links a return editor back to Tax Returns', () => {
  const nav = breadcrumbs('/ebirforms/taxpayers/1234567890000/forms/1601EQ');
  expect(nav).toContain('href="/ebirforms/taxpayers/1234567890000/forms"');
  expect(nav).toContain('BIR Form 1601EQ');
 });
 it.each([
  ['/ebirforms/taxpayers', 'eBIRForms'],
  ['/ebirforms/taxpayers/new', 'New taxpayer'],
  ['/ebirforms/taxpayers/1234567890000/edit', 'Edit taxpayer'],
  ['/settings', 'Settings'],
  ['/', 'Suite']
 ])('identifies the current page at %s', (path, label) => {
  const nav = breadcrumbs(path);
  expect(nav).toContain(label);
  expect(nav).toContain('aria-current="page"');
  expect(nav).not.toContain('TaxMate');
 });
});
