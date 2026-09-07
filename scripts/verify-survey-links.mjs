import {chromium} from 'playwright-core';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import AxeBuilder from '@axe-core/playwright';
const base=process.env.VERIFY_URL??'http://127.0.0.1:4193/bildungshaus/';
const out=process.env.VERIFY_OUT??'output/qa/survey-links';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const report=[];
for(const [label,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const c=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),p=await c.newPage();
 await p.goto(base+'#umfrage');
 for(const theme of ['light','dark']){
  if(theme==='dark')await p.getByRole('button',{name:'Dunkles Design'}).click();
  await p.getByRole('button',{name:'Fragebögen ausprobieren',exact:true}).click();
  const d=p.getByRole('dialog');await d.waitFor();await p.waitForTimeout(200);
  assert.match(await d.innerText(),/nur erfundene Testangaben/);
  const links=d.getByRole('link');assert.equal(await links.count(),5);
  assert.ok(await d.evaluate(e=>e.scrollWidth<=e.clientWidth));
  assert.ok(await d.locator('h2').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)<=32));
  await p.screenshot({path:`${out}/${label}-${theme}.png`});
  const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>v.id),[]);
  const targets=[];
  if(label==='desktop'&&theme==='light'&&process.env.VERIFY_TARGETS==='1'){
   for(let i=0;i<5;i++){
    const a=links.nth(i);const href=await a.getAttribute('href');
    const popupPromise=p.waitForEvent('popup');await a.click();const tab=await popupPromise;
    await tab.waitForLoadState('domcontentloaded');await tab.waitForTimeout(1600);
    const text=await tab.locator('body').innerText();assert.ok(text.length>80);assert.match(text,/PRETEST/i);assert.ok(!/404|survey not found|Umfrage nicht gefunden/i.test(text));
    assert.ok(tab.url().startsWith(href));targets.push({name:await a.innerText(),url:tab.url(),pretest:true});
    await tab.screenshot({path:`${out}/target-${i+1}.png`});await tab.close();
   }
  }
  report.push({label,theme,links:5,axe:[],targets});await p.keyboard.press('Escape');
 }
 await c.close();
}
await browser.close();await fs.writeFile(out+'/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
