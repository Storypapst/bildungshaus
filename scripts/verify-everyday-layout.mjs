import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const out='output/qa/everyday-repair';await fs.mkdir(out,{recursive:true});const b=await chromium.launch({channel:'chrome',headless:true});const report=[]
for(const width of [1440,1100,800,390]){
 const c=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await c.newPage();await p.goto('http://127.0.0.1:5182/bildungshaus/');await p.locator('.everyday').scrollIntoViewIfNeeded();await p.locator('.everyday img').evaluateAll(es=>Promise.all(es.map(e=>e.decode())))
 const layout=await p.locator('.everyday').evaluate(e=>{const root=e.querySelector('.page-width').getBoundingClientRect();const copy=e.querySelector('.everyday-copy').getBoundingClientRect();return{root:root.width,copy:copy.width,cards:[...e.querySelectorAll('.thesis-chain li')].map(e=>({width:e.getBoundingClientRect().width,overflow:e.querySelector('span').scrollWidth>e.querySelector('span').clientWidth+1})),overflow:document.documentElement.scrollWidth>innerWidth}})
 console.log(width,JSON.stringify(layout));assert.equal(layout.overflow,false);assert.ok(layout.copy>=Math.min(300,layout.root));assert.ok(layout.cards.every(c=>c.width>=140&&!c.overflow));
 for(const theme of ['light','dark']){if(theme==='dark')await p.getByRole('button',{name:'Dunkles Design'}).click();await p.locator('.everyday').screenshot({path:`${out}/${width}-${theme}.png`});assert.equal(await p.locator('.kitchen-story').evaluate(e=>getComputedStyle(e,'::before').content),'none')}
 report.push({width,...layout});await c.close()
}await b.close();await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report))
