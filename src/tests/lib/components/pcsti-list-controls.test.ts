import { render } from 'svelte/server';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Menu from '$lib/components/ui/menu/menu.svelte';
import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
import DensityToggle from '$lib/components/ui/density-toggle/density-toggle.svelte';
import ListSortHeader from '$lib/components/ui/list-sort-header/list-sort-header.svelte';
import ListColumnsMenu from '$lib/components/ui/list-columns-menu/list-columns-menu.svelte';

const trigger = createRawSnippet<[{ open: boolean }]>(() => ({ render: () => '<span>More actions</span>' }));
const content = createRawSnippet<[{ close: () => void }]>(() => ({ render: () => '<button type="button" role="menuitem">Archive taxpayer</button>' }));

describe('ported PCSTI list controls', () => {
 it('keeps menu actions hidden until the menu is opened', () => {
  const closed = render(Menu, { props: { label: 'Taxpayer actions', trigger, content } }).body;
  expect(closed).toContain('aria-label="Taxpayer actions"');
  expect(closed).toContain('aria-expanded="false"');
  expect(closed).not.toContain('Archive taxpayer');
  const opened = render(Menu, { props: { label: 'Taxpayer actions', open: true, trigger, content } }).body;
  expect(opened).toContain('aria-expanded="true"');
  expect(opened).toContain('role="menu"');
  expect(opened).toContain('Archive taxpayer');
 });
 it('represents density with labelled pressed buttons and SVG glyphs', () => {
  const { body } = render(DensityToggle, { props: { value: 'compact', onchange: () => {} } });
  expect(body).toContain('aria-label="Row density"');
  expect(body).toMatch(/aria-label="Compact rows" aria-pressed="true"/);
  expect(body).toMatch(/aria-label="Comfortable rows" aria-pressed="false"/);
  expect(body).toContain('<svg');
 });
 it('announces the current sort direction on the column header', () => {
  const props = { label: 'Taxpayer', column: 'name', currentSort: 'name', dir: 'desc' as const, onclick: () => {} };
  expect(render(ListSortHeader, { props }).body).toContain('aria-sort="descending"');
  expect(render(ListSortHeader, { props: { ...props, currentSort: 'tin' } }).body).toContain('aria-sort="none"');
 });
 it('uses a decorative checkbox without adding a second interactive control', () => {
  const { body } = render(Checkbox, { props: { checked: true } });
  expect(body).toContain('aria-hidden="true"');
  expect(body).toContain('<svg');
  expect(body).not.toContain('<input');
  expect(body).not.toContain('role="checkbox"');
 });
 it('provides the columns trigger without exposing closed menu options', () => {
  const { body } = render(ListColumnsMenu, { props: { items: [{key:'name',label:'Taxpayer',fixed:true}], hiddenColumns: [], onchange: () => {} } });
  expect(body).toContain('aria-label="Columns"');
  expect(body).toContain('aria-expanded="false"');
  expect(body).not.toContain('role="menuitemcheckbox"');
 });
});
