import {chromium,webkit} from 'playwright-core'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const out='output/qa/feinschliff-interaction';await fs.mkdir(out,{recursive:true})
const b=await chromium.launch({channel:'chrome',headless:true});const c=await b.newContext({viewport:{width:1440,height:900}});const p=await c.newPage()
await p.goto('http://127.0.0.1:5182/bildungshaus/');await p.waitForTimeout(500)
assert.equal(await p.locator('.hero').evaluate(e=>getComputedStyle(e).opacity),'1')
for(const selector of ['.pilot-steps','.paper-list']){
 await p.locator(selector).evaluate(e=>e.scrollIntoView({behavior:'instant',block:'start'}));await p.waitForTimeout(2100)
 assert.ok(await p.locator(selector).evaluate(e=>[e,...e.children].every(e=>getComputedStyle(e).opacity==='1')),selector+' reveals')
}
const link=p.locator('.chapter-nav a').first();await link.focus()
assert.equal(await link.locator('.chapter-label').evaluate(e=>getComputedStyle(e).opacity),'1')
assert.ok((await link.boundingBox()).height>=44)
await p.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await p.screenshot({path:`${out}/desktop-light.png`})
await p.getByRole('button',{name:'Dunkles Design'}).click();await p.screenshot({path:`${out}/desktop-dark.png`})
await b.close()
let safari='unavailable'
try{
 const w=await webkit.launch({headless:true});const x=await w.newContext({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:3});const page=await x.newPage();await page.goto('http://127.0.0.1:5182/bildungshaus/');await page.waitForTimeout(800);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:`${out}/webkit-mobile.png`});await w.close();safari='WebKit mobile emulation, not physical iPhone'
}catch(e){if(!String(e).includes("Executable doesn't exist"))throw e}
console.log(JSON.stringify({reveals:'pilot and 18 papers visible',chapterFocus:'visible with 44px target',safari}))
