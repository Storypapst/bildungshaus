import {chromium} from 'playwright-core';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
const base=process.env.VERIFY_URL??'http://127.0.0.1:5174/bildungshaus/';
const out=process.env.VERIFY_OUT??'output/qa/illustrations-v4';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const report=[];
for(const [profile,width,height,motion] of [['desktop',1440,1000,'no-preference'],['mobile',390,844,'no-preference'],['reduced',1440,900,'reduce']]){
const context=await browser.newContext({viewport:{width,height},reducedMotion:motion});
await context.addInitScript(()=>{Element.prototype.requestPointerLock=()=>{};Element.prototype.setPointerCapture=()=>{};Element.prototype.releasePointerCapture=()=>{}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);await page.evaluate(()=>document.fonts.ready);
// Exercise natural scrolling before section captures, so staggered content is revealed.
for(let y=0;y<await page.evaluate(()=>document.documentElement.scrollHeight);y+=500){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(45)}
await page.waitForTimeout(500);
for(const theme of ['light','dark']){
 if(theme==='dark')await page.getByRole('button',{name:'Dunkles Design'}).click();
 for(const [name,selector] of [['hero','#idee'],['thesis','.everyday'],['kitchen','.kitchen-story'],['economics','#spielraum'],['pilot','#pilot']]){
 const section=page.locator(selector);await section.scrollIntoViewIfNeeded();await section.locator('img').evaluateAll(async imgs=>Promise.all(imgs.map(img=>img.decode())));await page.waitForTimeout(400);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,profile+' '+name+' overflow');
 const images=await section.locator('img').evaluateAll(imgs=>imgs.map(img=>({src:img.currentSrc,loaded:img.complete&&img.naturalWidth>0,alt:img.alt,width:img.getBoundingClientRect().width})));
 assert.ok(images.every(img=>img.loaded&&img.alt&&img.width>0),profile+' '+name+' missing image');
 await section.screenshot({path:`${out}/${profile}-${theme}-${name}.png`});report.push({profile,theme,section:name,images:images.length,errors});
 }
}
await context.close();
}
await browser.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));assert.ok(report.every(x=>x.errors.length===0));console.log('30 illustrated section/theme/viewports passed, every image decoded; no horizontal overflow or browser errors');
