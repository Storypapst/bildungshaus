import {chromium} from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'

const base=process.env.VERIFY_URL??'http://127.0.0.1:4175/bildungshaus/'
const out=process.env.VERIFY_OUT??'output/qa/article-diagrams'
const ids=Array.from({length:18},(_,index)=>`P${String(index+1).padStart(2,'0')}`)
const representative=new Set(['P01','P02','P05','P06','P11','P14','P16','P18'])
await fs.mkdir(out,{recursive:true})
const browser=await chromium.launch({channel:'chrome',headless:true})
const errors=[],axe=[]

for(const viewport of [{name:'desktop',width:1440,height:1000},{name:'mobile',width:390,height:844}]){
 const context=await browser.newContext({viewport,reducedMotion:'reduce'}),page=await context.newPage()
 page.on('pageerror',error=>errors.push(error.message))
 for(const id of ids){
  await page.goto(`${base}#lesen/${id}`)
  const figure=page.locator(`[data-diagram-id="${id}"]`)
  await figure.waitFor()
  assert.equal(await figure.count(),1)
  assert.ok((await figure.locator('.diagram-item').count())>=3)
  assert.ok((await figure.locator('figcaption').innerText()).length>30)
  assert.ok((await figure.locator('h3').innerText()).length>10)
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
  if(representative.has(id))await figure.screenshot({path:`${out}/${id}-${viewport.name}.png`})
 }
 await context.close()
}

const darkContext=await browser.newContext({viewport:{width:1100,height:900},reducedMotion:'reduce'}),darkPage=await darkContext.newPage()
darkPage.on('pageerror',error=>errors.push(error.message))
for(const id of ids){
 await darkPage.goto(`${base}#lesen/${id}`)
 if(!await darkPage.locator('html').evaluate(element=>element.classList.contains('dark')))await darkPage.getByRole('button',{name:'Dunkles Design'}).click()
 await darkPage.locator('html.dark').waitFor()
 const figure=darkPage.locator(`[data-diagram-id="${id}"]`)
 assert.equal(await darkPage.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)
 if(['P01','P06','P16'].includes(id)){
  const result=await new AxeBuilder({page:darkPage}).include(`[data-diagram-id="${id}"]`).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()
  axe.push({id,violations:result.violations.map(violation=>violation.id)})
  await figure.screenshot({path:`${out}/${id}-dark.png`})
 }
}
await darkContext.close()

const graphContext=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),graphPage=await graphContext.newPage()
await graphPage.goto(`${base}#problem`)
await graphPage.getByRole('link',{name:/Befund vertiefen/}).click()
const backLabel=await graphPage.locator('.reader-nav>a').first().innerText()
assert.match(backLabel,/^Zur Auswahl(?:: .+)?$/)
assert.doesNotMatch(backLabel,/undefined/)
await graphContext.close()
await browser.close()

const report={diagrams:ids,viewports:['desktop','mobile'],dark:ids,axe,graphReaderBackLabel:backLabel,errors}
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2))
console.log(JSON.stringify({diagrams:ids.length,viewports:report.viewports,dark:ids.length,axe,graphReaderBackLabel:backLabel,errors}))
if(errors.length||axe.some(result=>result.violations.length))process.exitCode=1
