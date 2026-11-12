import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve('src/lib');
const read = (path: string) => readFileSync(resolve(root, path), 'utf8');
const codes = ['0605','0619E','0619F','1600','1600PTv2018','1600VTv2018','1600WP','1601C','1601Cv2018','1601E','1601F','1601FQ','1602','1602Qv2018','1603','1603Qv2018','1604C','1604CF','1604E','1604Ev2018','1604F','1606'];

describe('withholding component print architecture', () => {
 it('uses one component export path instead of importing the HTML renderer', () => {
  const exporter = read('printing/return-report.ts');
  expect(exporter).not.toContain('withholding-template');
  expect(exporter).toContain('withholding-print-registry');
  expect(exporter).not.toMatch(/createElement\(['"]iframe|\.write\(|DOMParser|import\.meta\.glob/);
 });
 it('ships22 real form-specific Svelte components with declarative bindings', () => {
  for (const code of codes) {
   const path = `forms/printing/form-${code.toLowerCase()}-print.svelte`;
   expect(existsSync(resolve(root,path)), path).toBe(true);
   if (!existsSync(resolve(root,path))) continue;
   const component = read(path);
   expect(component, path).toContain('values');
   expect(component, path).toMatch(/<table|<img|<Print/);
   expect(component, path).not.toMatch(/\{@html|innerHTML|outerHTML|DOMParser|\.write\(|createElement\(/);
   expect(component, path).not.toMatch(/EXAMPLE WITHHOLDING COMPANY|09171234567|9876543210000|02\/28\/2025/);
   expect(component, path).not.toMatch(/\sstyle=/);
   expect(component, path).not.toContain('src="data:image/');
   expect(existsSync(resolve(root,path.replace('.svelte','.css'))), `${code} colocated CSS`).toBe(true);
  }
 });
 it('keeps shared styling and explicit per-form overrides outside component markup', () => {
  const path = resolve(root,'printing/withholding-print-registry.ts');
  expect(existsSync(path)).toBe(true);
  if (!existsSync(path)) return;
  const registry = readFileSync(path,'utf8');
  expect(registry).toContain('withholding-print.css');
  expect(registry).toContain('form-1601-eq-print');
  for (const code of codes) expect(registry).toContain(`form-${code.toLowerCase()}-print`);
  expect(existsSync(resolve(root,'forms/printing/withholding-print.css'))).toBe(true);
 });
 it('removes obsolete runtime templates, renderer and extractor', () => {
  expect(existsSync(resolve(root,'printing/withholding-template.ts'))).toBe(false);
  expect(existsSync(resolve(root,'printing/form-1601-eq-print.css'))).toBe(false);
  expect(existsSync(resolve(root,'forms/printing/form-1601-eq-print.css'))).toBe(true);
  expect(existsSync(resolve(root,'forms/printing/form-1601-eq-print.svelte'))).toBe(true);
  expect(existsSync(resolve(root,'printing/withholding-template-extract.py'))).toBe(false);
  const directory = resolve(root,'printing/withholding-templates');
  expect(existsSync(directory) ? readdirSync(directory).filter(file=>file.endsWith('.html')) : []).toEqual([]);
 });
});
