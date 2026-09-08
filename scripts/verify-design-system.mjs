import {chromium} from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const out='output/qa/feinschliff-tokens';await fs.mkdir(out,{recursive:true})
const b=await chromium.launch({channel:'chrome',headless:true});const report=[]
for(const width of [1440,390]){
 const context=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'});const p=await context.newPage()
 await p.goto('http://127.0.0.1:5182/bildungshaus/design-system.html');await p.waitForTimeout(600)
 for(const theme of ['light','dark']){
  if(theme==='dark')await p.getByRole('button',{name:'Dunkles Design'}).click()
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false)
  const buttons=await p.locator('.ui-button').evaluateAll(es=>es.map(e=>({text:e.textContent,height:e.getBoundingClientRect().height,overflow:e.scrollWidth>e.clientWidth+2})))
  assert.ok(buttons.every(e=>e.height>=44&&!e.overflow),JSON.stringify(buttons))
  const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)})),[])
  await p.screenshot({path:`${out}/${width}-${theme}.png`,fullPage:true})
  report.push({width,theme,buttons,violations:axe.violations.length})
 }
 const slider=p.getByRole('slider',{name:'Anzahl Einrichtungen'});await slider.focus();await p.keyboard.press('ArrowRight');await p.waitForTimeout(30)
 assert.match(await p.locator('output').innerText(),/153.718/)
 await p.emulateMedia({reducedMotion:'no-preference'});await slider.focus();await p.keyboard.press('ArrowRight');await p.keyboard.press('ArrowRight');await p.waitForTimeout(400)
 assert.match(await p.locator('output').innerText(),/187.877/)
 await context.close()
}
await b.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log('Token library: four layouts, accessible controls, reduced and rapid calculator updates passed')
