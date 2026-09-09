import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
const browser = await chromium.launch({channel:'chrome',headless:true})
for(const width of [1440,390]) for(const reduced of [false,true]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:reduced?'reduce':'no-preference'})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:5182/bildungshaus/#pilot')
 await page.locator('.pilot-house-paper img').evaluate(e=>e.decode())
 const positions=[]
 for(let i=0;i<5;i++){
 await page.locator('.pilot-note').nth(i).evaluate((el,width)=>{
  const r=el.getBoundingClientRect();const art=document.querySelector('.pilot-pinned-art').getBoundingClientRect()
  const line=width<=760?art.height+Math.max(60,(innerHeight-art.height)*.35):innerHeight*.55
  scrollTo({top:scrollY+r.top+r.height/2-line,behavior:'instant'})
 },width)
 await page.waitForFunction(i=>document.querySelectorAll('.pilot-doodle')[i].dataset.active==='true',i)
 await page.waitForTimeout(550)
 const r=await page.locator('.pilot-pinned-art').boundingBox();positions.push(r.y)
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1))
 if(i===2)await page.screenshot({path:`output/qa/pilot-journey-${width}-${reduced}.png`})
 }
 assert(Math.abs(positions[1]-positions[3])<2,`sticky positions ${positions}`)
 if(reduced) assert(await page.locator('.pilot-doodle').first().evaluate(el=>parseFloat(getComputedStyle(el).transitionDuration)<.001))
 assert.deepEqual(errors,[])
 console.log(width,reduced?'reduced':'motion','five steps, pinned image, overflow, errors PASS')
 await page.close()
}
await browser.close()
