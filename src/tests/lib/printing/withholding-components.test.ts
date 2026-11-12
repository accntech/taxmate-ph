import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { Component } from 'svelte';
import { withholdingDefinitions } from '$lib/forms/withholding-definitions';
import { createWithholdingValues } from '$lib/forms/withholding-rules';
import { initialProfile } from '$lib/ebirforms/ebirforms-workspace.svelte';

const components = import.meta.glob('$lib/forms/printing/form-*-print.svelte', { eager:true }) as Record<string,{default:Component<{values:Record<string,string>}>}>;

describe('compiled withholding print components', () => {
 for (const definition of withholdingDefinitions) {
  it(`${definition.code} binds and escapes taxpayer values through Svelte`, () => {
   const entry=Object.entries(components).find(([path])=>path.endsWith(`/form-${definition.code.toLowerCase()}-print.svelte`));
   expect(entry).toBeDefined();
   const values=createWithholdingValues(definition.code, {...initialProfile,taxpayerName:'R&D <PRINT TEST> COMPANY'});
   const html=render(entry![1].default,{props:{values}}).body;
   expect(html).toContain(`data-form-code="${definition.code}"`);
   expect(html).toContain('R&amp;D &lt;PRINT TEST> COMPANY');
   expect(html).not.toContain('<PRINT TEST>');
   expect(html).not.toMatch(/<script\b|<iframe\b|\son\w+=|(?:src|href)="https?:/i);
   expect(html).toContain('withholding-print-page-content');
  });
 }
});
