import { render } from 'svelte/server';
import { expect, it } from 'vitest';
import ReturnErrors from '$lib/forms/return-errors.svelte';
import type { FormDefinition } from '$lib/forms';
it('directs taxpayer business and classification errors to taxpayer information', () => {
 const definition = { code:'0605', title:'Payment', category:'Withholding Tax', status:'ready', fields:[
  { id:'frm0605:txtLineBus',label:'Line of business',type:'text',profileKey:'lineOfBusiness' },
  { id:'frm0605:txtClassification',label:'Tax classification',type:'select',profileKey:'taxpayerClassification' }
 ] } as FormDefinition;
 const html = render(ReturnErrors,{props:{definition, errors:{'frm0605:txtLineBus':'Required','frm0605:txtClassification':'Required'},taxpayerHref:'/ebirforms/taxpayers/test/edit'}}).body;
 expect(html.match(/href="\/ebirforms\/taxpayers\/test\/edit"/g)).toHaveLength(2);
});
