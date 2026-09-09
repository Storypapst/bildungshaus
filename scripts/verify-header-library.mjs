import {chromium} from 'playwright-core'
import assert from 'node:assert/strict'
const browser=await chromium.launch({channel:'chrome',headless:true})
for(const width of [1440,390]){
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'})
 if(width===1440){
 await page.goto('http://127.0.0.1:5182/bildungshaus/#bibliothek')
 await page.locator('#bibliothek').waitFor()
 // The old hash can remain at the library while the person scrolls to the header.
 await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}))
 await page.locator('.masthead').getByRole('link',{name:'Konzept',exact:true}).click()
 await page.locator('.longform').waitFor()
 await page.locator('.masthead').getByRole('link',{name:'Zum Nachlesen',exact:true}).click()
 await page.waitForFunction(()=>Math.abs(document.getElementById('bibliothek').getBoundingClientRect().top)<50)
 assert.equal(await page.locator('.reader').count(),0)
 await page.locator('#bibliothek').getByRole('link',{name:'Das Konzept',exact:true}).click()
 }else await page.goto('http://127.0.0.1:5182/bildungshaus/#lesen/whitepaper')
 await page.locator('[data-artwork=concept] img').evaluate(e=>e.decode())
 assert.equal(await page.locator('[data-reader-visual]').count(),13)
 await page.screenshot({path:`output/qa/concept-banner-${width}.png`})
 await page.locator('[data-reader-visual=organisation]').screenshot({path:`output/qa/concept-organisation-${width}.png`})
 console.log(width,width===1440?'single-click header destination and concept PASS':'mobile concept PASS')
 await page.close()
}
await browser.close()
