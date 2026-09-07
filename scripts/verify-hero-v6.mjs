import {chromium} from 'playwright-core';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.VERIFY_URL??'http://127.0.0.1:5174/bildungshaus/';
const out=process.env.VERIFY_OUT??'output/qa/hero-v6';
await fs.mkdir(out,{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});const report=[];
for(const [profile,width,height] of [['desktop',1440,1000],['tablet',820,1180],['mobile',390,844],['compact',360,640]]){
 const c=await b.newContext({viewport:{width,height},reducedMotion:'reduce'});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base,{waitUntil:'networkidle'});await p.locator('.hero-art img').evaluate(e=>e.decode());
 const iconHref=await p.locator('link[rel="icon"]').getAttribute('href');assert.ok(iconHref.endsWith('weweit-favicon.svg'));const icon=await c.request.get(new URL(iconHref,base).href);assert.equal(icon.status(),200);assert.ok((await icon.text()).includes('Bildungshaus weWeit'));
 for(const theme of ['light','dark']){
  if(theme==='dark')await p.getByRole('button',{name:'Dunkles Design'}).click();
  await p.locator('#idee').scrollIntoViewIfNeeded();await p.waitForTimeout(200);
  const clauses=await p.locator('.shared-proverb>span').evaluateAll(es=>es.map(e=>({text:e.textContent,font:getComputedStyle(e).fontSize,color:getComputedStyle(e).color})));
  assert.equal(clauses.length,2);assert.equal(clauses[0].font,clauses[1].font);assert.equal(clauses[0].color,clauses[1].color);
  assert.match(clauses[0].text,/schnell.*alleine/);assert.match(clauses[1].text,/weit.*gemeinsam/);
  assert.match(await p.locator('.hero-copy').innerText(),/Kinder, Fachkräfte und Eltern/);
  assert.ok((await p.locator('.hero-art img').getAttribute('src')).endsWith('gemeinsam-weiter-v6.webp'));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const alpha=await p.locator('.hero-art img').evaluate(e=>{const canvas=document.createElement('canvas');canvas.width=e.naturalWidth;canvas.height=e.naturalHeight;const x=canvas.getContext('2d');x.drawImage(e,0,0);return x.getImageData(0,0,1,1).data[3]});assert.equal(alpha,0,'transparent image corner');
  const axe=await new AxeBuilder({page:p}).include('#idee').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[]);
  await p.locator('#idee').screenshot({path:`${out}/${profile}-${theme}.png`});report.push({profile,theme,clauses,alpha,axe:[],errors});
 }
 assert.deepEqual(errors,[]);await c.close();
}
await b.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({heroStates:report.length,errors:[]}));
