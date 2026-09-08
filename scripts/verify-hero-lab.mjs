import {chromium} from 'playwright-core'
import AxeBuilder from '@axe-core/playwright'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const out='output/qa/hero-lab';await fs.mkdir(out,{recursive:true});const b=await chromium.launch({channel:'chrome',headless:true});const report=[]
for(const width of [1280,390]){const c=await b.newContext({viewport:{width,height:940},reducedMotion:'reduce'}),p=await c.newPage();for(let variant=1;variant<=5;variant++){await p.goto(`http://127.0.0.1:5182/bildungshaus/hero-lab.html?variant=${variant}`);await p.locator('img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${variant}/${width}`);const axe=await new AxeBuilder({page:p}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.failureSummary)})),[]);await p.screenshot({path:`${out}/${variant}-${width}.png`,fullPage:true});report.push({variant,width,violations:0})}await c.close()}
await b.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(report)
