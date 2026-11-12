import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { seedWorkspace, taxpayerId } from './fixtures';

async function exportForm(page: Page, code: string) {
 await seedWorkspace(page);
 await page.goto(`/ebirforms/taxpayers/${taxpayerId}/forms`);
 const html=await page.evaluate(async code=>{
  const base='/src/lib';
  const catalog=await import(`${base}/forms/index.ts`);
  const rules=await import(`${base}/forms/withholding-rules.ts`);
  const reports=await import(`${base}/printing/return-report.ts`);
  const values=rules.createWithholdingValues(code,{tin1:'123',tin2:'456',tin3:'789',branchCode:'0000',rdoCode:'047',taxpayerName:'Sample Trading Corporation',address:'28 Narra Street',address2:'Makati City',zipCode:'1209',contactNumber:'0285550148',category:'P',email:'sample@example.com',lineOfBusiness:'Wholesale Trade',taxpayerClassification:'N'});
  return reports.buildReturnReport(catalog.getFormDefinition(code),values,'Draft','long');
 },code);
 const print=await page.context().newPage();await print.setContent(html);await print.emulateMedia({media:'print'});await print.evaluate(()=>document.fonts.ready);
 return print;
}

for(const code of ['1600PTv2018','1600VTv2018']) {
 test(`${code} PDF reference table headers align with body columns`,async({page},testInfo)=>{
  const print=await exportForm(page,code);
  const pdf=await print.pdf({path:testInfo.outputPath(`${code}.pdf`),preferCSSPageSize:true,printBackground:true});
  const metrics=JSON.parse(execFileSync('python3',['-c',`import sys,fitz,json
p=fitz.open(stream=sys.stdin.buffer.read(),filetype='pdf')[1]
a=p.search_for('Table 1')[0]
h=[r for r in p.search_for('TAX RATE') if r.y0>a.y1][0]
c=[r for r in p.search_for('ATC') if abs(r.y0-h.y0)<3][0]
b=p.search_for('WB 030')[0] if p.search_for('WB 030') else p.search_for('WV010')[0]
rates=[r for r in p.search_for('3%')+p.search_for('5%') if abs(r.y0-b.y0)<3]
r=rates[0]
print(json.dumps({'rateHeader':(h.x0+h.x1)/2,'rateBody':(r.x0+r.x1)/2,'atcHeader':(c.x0+c.x1)/2,'atcBody':(b.x0+b.x1)/2}))`],{input:pdf}).toString());
  expect(Math.abs(metrics.rateHeader-metrics.rateBody)).toBeLessThan(2);
  expect(Math.abs(metrics.atcHeader-metrics.atcBody)).toBeLessThan(2);
  await print.close();
 });
}

for(const code of ['1600','1600WP','1601C','1601E','1601F','1602','1603','1606']) {
 test(`${code} PDF payment strip reaches the inner right frame`,async({page},testInfo)=>{
  const print=await exportForm(page,code);
  const pdf=await print.pdf({path:testInfo.outputPath(`${code}.pdf`),preferCSSPageSize:true,printBackground:true});
  const metrics=JSON.parse(execFileSync('python3',['-c',`import sys,fitz,json
p=fitz.open(stream=sys.stdin.buffer.read(),filetype='pdf')[0]
frames=[d['rect'] for d in p.get_drawings() if d['type']=='s' and d['color']==(0,0,0) and d['rect'].width>400 and d['rect'].height>250]
f=max(frames,key=lambda r:r.width*r.height)
images=[r for im in p.get_images() for r in p.get_image_rects(im[0]) if r.width>300 and 20<r.height<200]
i=max(images,key=lambda r:r.y0)
print(json.dumps({'frameRight':f.x1,'paymentRight':i.x1,'gap':f.x1-i.x1}))`],{input:pdf}).toString());
  expect(Math.abs(metrics.gap)).toBeLessThan(2);
  await print.close();
 });
}
