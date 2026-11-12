import { execFileSync } from 'node:child_process';
import { expect, test } from '@playwright/test';
import { seedWorkspace, taxpayerId } from './fixtures';

const codes = ['0605','0619E','0619F','1600','1600PTv2018','1600VTv2018','1600WP','1601C','1601Cv2018','1601E','1601EQ','1601F','1601FQ','1602','1602Qv2018','1603','1603Qv2018','1604C','1604CF','1604E','1604Ev2018','1604F','1606'];
for (const code of codes) {
 test(`${code} normalizes values without uppercasing template text`, async ({page, context}, testInfo) => {
  await seedWorkspace(page);
  await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
  const name='Mixed Case Taxpayer With A Deliberately Overlong Registered Business Name';
  const html=await page.evaluate(async ({code,name})=>{
   const base='/src/lib';
   const catalog=await import(`${base}/forms/index.ts`);
   const source=await import(`${base}/forms/withholding-definitions.ts`);
   const rules=await import(`${base}/forms/withholding-rules.ts`);
   const reports=await import(`${base}/printing/return-report.ts`);
   const profile={tin1:'123',tin2:'456',tin3:'789',branchCode:'0000',rdoCode:'047',taxpayerName:name,address:'28 Narra Street',address2:'Makati City',zipCode:'1209',contactNumber:'0285550148',category:'P',email:'Mixed.Case@Example.COM',lineOfBusiness:'Wholesale Trade And Business Services',taxpayerClassification:'N'};
   const d=source.getWithholdingDefinition(code);
   const values=d?rules.createWithholdingValues(code,profile):(await import(`${base}/ebirforms/ebirforms-workspace.svelte.ts`)).createInitialFormValues(profile);
   return reports.buildReturnReport(catalog.getFormDefinition(code),values,'Draft','long');
  },{code,name});
  const print=await context.newPage();await print.setContent(html);await print.emulateMedia({media:'print'});await print.evaluate(()=>document.fonts.ready);
  const native=print.locator('input:not([type="radio"]):not([type="checkbox"])');
  const textValues=print.locator('input:not([type="radio"]):not([type="checkbox"]), [data-print-value], [data-print-control="select"], [data-field-id]:not(input):not([data-field-id*="opt"]):not([data-field-id*="item"]):not([data-field-id*="Classification"]), .legacy-label-value');
  expect(await textValues.count()).toBeGreaterThan(0);
  const issues=await textValues.evaluateAll(elements=>elements.flatMap(e=>{
   const s=getComputedStyle(e);const frame=e.closest<HTMLElement>('.withholding-print-page');const scale=frame?Number(frame.style.getPropertyValue('--withholding-page-scale')):0.82;
   const points=parseFloat(s.fontSize)*scale*0.75;
   return Math.abs(points-7.38)>0.025||s.textTransform!==( /email/i.test((e as HTMLElement).dataset.fieldId ?? e.id) || e.classList.contains('legacy-email-input') ? 'lowercase' : 'uppercase')||s.textOverflow!=='clip'?[`${e.id}: ${points}pt/${s.textTransform}/${s.textOverflow}`]:[];
  }));
  expect(issues).toEqual([]);
  const emails=print.locator('[data-normalized-print-value]');
  const emailValues=await emails.evaluateAll(elements=>elements.filter(e=>/email/i.test((e as HTMLElement).dataset.fieldId ?? e.id)||e.classList.contains('legacy-email-input')).map(e=>e instanceof HTMLInputElement?e.value:e.textContent));
  const emailForms = ['0619E','0619F','1600PTv2018','1600VTv2018','1601Cv2018','1601EQ','1601FQ','1602Qv2018','1603Qv2018','1604C','1604Ev2018','1604F'];
  expect(emailValues.length).toBe(emailForms.includes(code) ? 1 : 0);
  for(const value of emailValues) expect(value).toBe('mixed.case@example.com');
  const pdf = await print.pdf({path:testInfo.outputPath(`${code}.pdf`),preferCSSPageSize:true,printBackground:true});
  if(emailValues.length) {
   const text = execFileSync('pdftotext',['-','-'],{input:pdf,encoding:'utf8'});
   expect(text).toContain('mixed.case@example.com');
   expect(text).not.toContain('MIXED.CASE@EXAMPLE.COM');
  }
  const root=print.locator('.withholding-print, .legacy-container').first();
  await expect(root).toHaveCSS('text-transform','none');
  const changedLabels=await root.evaluate(element=>{
   const walker=document.createTreeWalker(element,NodeFilter.SHOW_TEXT);const changed:string[]=[];
   while(walker.nextNode()){
    const node=walker.currentNode;const parent=node.parentElement!;
    if(!node.textContent?.trim()||parent.closest('[data-field-id], [data-print-value], [data-normalized-print-value], .legacy-text-mark, script, style'))continue;
    if(getComputedStyle(parent).textTransform!=='none')changed.push(node.textContent.trim().slice(0,50));
   }
   return changed;
  });
  expect(changedLabels).toEqual([]);
  if(await native.count()){
   const original=await native.evaluateAll(elements=>elements.map(e=>(e as HTMLInputElement).value));
   expect(original).toContain(name);
  }
  const controls=print.locator('input[type="radio"], .legacy-radio');
  const radioIssues=await controls.evaluateAll(elements=>elements.flatMap(e=>{const s=getComputedStyle(e),b=e.getBoundingClientRect();return Math.abs(b.width-b.height)>0.1||parseFloat(s.borderTopWidth)!==0||!(e.matches('.legacy-radio')?e:e.parentElement!)?.querySelector('.pdf-radio-vector')?[e.id||e.className]:[];}));
  expect(radioIssues).toEqual([]);
  const borderIssues=await print.locator('#formPaper').evaluateAll(frames=>frames.flatMap(frame=>{
   frame.closest<HTMLElement>('.withholding-print-page-content')!.style.zoom='1';
   const b=frame.getBoundingClientRect();const s=getComputedStyle(frame);const scale=1;const right=b.right-parseFloat(s.borderRightWidth);
   return [...frame.querySelectorAll('table')].filter(t=>{const r=t.getBoundingClientRect();return r.width>b.width*.95&&Math.abs(r.left-b.left)<4*scale&&right-r.right>2*scale;}).map(t=>t.className);
  }));
  expect(borderIssues).toEqual([]);
  await print.close();
 });
}
