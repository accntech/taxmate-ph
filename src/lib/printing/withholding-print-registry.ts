import type { Component } from 'svelte';
import sharedStyles from '../forms/printing/withholding-print.css?raw';

export type WithholdingPrintComponent = Component<{ values: Record<string, string> }>;
type ComponentModule = { default: WithholdingPrintComponent };
type StyleModule = { default: string };

/** Each selectable version owns a compiled Svelte component and an explicit CSS override. */
const components: Record<string, () => Promise<ComponentModule>> = {
 '1601EQ': () => import('../forms/printing/form-1601-eq-print.svelte'),
 '0605': () => import('../forms/printing/form-0605-print.svelte'),
 '0619E': () => import('../forms/printing/form-0619e-print.svelte'),
 '0619F': () => import('../forms/printing/form-0619f-print.svelte'),
 '1600': () => import('../forms/printing/form-1600-print.svelte'),
 '1600PTv2018': () => import('../forms/printing/form-1600ptv2018-print.svelte'),
 '1600VTv2018': () => import('../forms/printing/form-1600vtv2018-print.svelte'),
 '1600WP': () => import('../forms/printing/form-1600wp-print.svelte'),
 '1601C': () => import('../forms/printing/form-1601c-print.svelte'),
 '1601Cv2018': () => import('../forms/printing/form-1601cv2018-print.svelte'),
 '1601E': () => import('../forms/printing/form-1601e-print.svelte'),
 '1601F': () => import('../forms/printing/form-1601f-print.svelte'),
 '1601FQ': () => import('../forms/printing/form-1601fq-print.svelte'),
 '1602': () => import('../forms/printing/form-1602-print.svelte'),
 '1602Qv2018': () => import('../forms/printing/form-1602qv2018-print.svelte'),
 '1603': () => import('../forms/printing/form-1603-print.svelte'),
 '1603Qv2018': () => import('../forms/printing/form-1603qv2018-print.svelte'),
 '1604C': () => import('../forms/printing/form-1604c-print.svelte'),
 '1604CF': () => import('../forms/printing/form-1604cf-print.svelte'),
 '1604E': () => import('../forms/printing/form-1604e-print.svelte'),
 '1604Ev2018': () => import('../forms/printing/form-1604ev2018-print.svelte'),
 '1604F': () => import('../forms/printing/form-1604f-print.svelte'),
 '1606': () => import('../forms/printing/form-1606-print.svelte'),
};

const overrides: Record<string, () => Promise<StyleModule>> = {
 '1601EQ': () => import('../forms/printing/form-1601-eq-print.css?raw'),
 '0605': () => import('../forms/printing/form-0605-print.css?raw'),
 '0619E': () => import('../forms/printing/form-0619e-print.css?raw'),
 '0619F': () => import('../forms/printing/form-0619f-print.css?raw'),
 '1600': () => import('../forms/printing/form-1600-print.css?raw'),
 '1600PTv2018': () => import('../forms/printing/form-1600ptv2018-print.css?raw'),
 '1600VTv2018': () => import('../forms/printing/form-1600vtv2018-print.css?raw'),
 '1600WP': () => import('../forms/printing/form-1600wp-print.css?raw'),
 '1601C': () => import('../forms/printing/form-1601c-print.css?raw'),
 '1601Cv2018': () => import('../forms/printing/form-1601cv2018-print.css?raw'),
 '1601E': () => import('../forms/printing/form-1601e-print.css?raw'),
 '1601F': () => import('../forms/printing/form-1601f-print.css?raw'),
 '1601FQ': () => import('../forms/printing/form-1601fq-print.css?raw'),
 '1602': () => import('../forms/printing/form-1602-print.css?raw'),
 '1602Qv2018': () => import('../forms/printing/form-1602qv2018-print.css?raw'),
 '1603': () => import('../forms/printing/form-1603-print.css?raw'),
 '1603Qv2018': () => import('../forms/printing/form-1603qv2018-print.css?raw'),
 '1604C': () => import('../forms/printing/form-1604c-print.css?raw'),
 '1604CF': () => import('../forms/printing/form-1604cf-print.css?raw'),
 '1604E': () => import('../forms/printing/form-1604e-print.css?raw'),
 '1604Ev2018': () => import('../forms/printing/form-1604ev2018-print.css?raw'),
 '1604F': () => import('../forms/printing/form-1604f-print.css?raw'),
 '1606': () => import('../forms/printing/form-1606-print.css?raw'),
};

export async function getWithholdingPrintComponent(code: string): Promise<WithholdingPrintComponent> {
 const load = components[code];
 if (!load) throw new Error(`No print component is available for ${code}.`);
 return (await load()).default;
}

export async function getWithholdingPrintStyles(code: string): Promise<string> {
 const load = overrides[code];
 if (!load) throw new Error(`No print stylesheet is available for ${code}.`);
 return `${sharedStyles}\n${(await load()).default}`;
}
