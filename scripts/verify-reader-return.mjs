import { chromium } from 'playwright-core'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
const base = process.env.VERIFY_URL ?? 'http://127.0.0.1:4198/bildungshaus/'
const out = process.env.VERIFY_OUT ?? 'output/qa/reader-return'
await fs.mkdir(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true })
const results = []
// Observe the first measurable presentation state, before any pending animation
// frame can hide a return-position race. Do not add a sleep before this assertion.
async function observeReturn(page) {
 await page.evaluate(() => {
  const presentation = document.getElementById('idee').parentElement.parentElement
  window.__firstReturn = null
  const observer = new MutationObserver(() => {
   if (!presentation.hidden) {
    window.__firstReturn = { y: scrollY, libraryTop: document.getElementById('bibliothek').getBoundingClientRect().top }
    observer.disconnect()
   }
  })
  observer.observe(presentation, { attributes: true, attributeFilter: ['hidden'] })
 })
}
for (const mobile of [false, true]) for (const reducedMotion of ['reduce', 'no-preference']) {
 const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }, reducedMotion })
 await context.addInitScript(() => {
  addEventListener('hashchange', () => {
   if (location.hash.startsWith('#lesen/')) window.__readerEntryY = scrollY
  })
 })
 const page = await context.newPage()
 const errors = []; page.on('pageerror', error => errors.push(error.message))
 await page.goto(base + '?direct=return-check#lesen/whitepaper')
 await page.locator('.longform').waitFor()
 await observeReturn(page)
 await page.getByRole('link', { name: 'Zur Präsentation', exact: true }).click()
 await page.locator('#bibliothek').waitFor({ state: 'visible' })
 const direct = await page.evaluate(() => window.__firstReturn)
 assert.ok(direct && Math.abs(direct.libraryTop) < 100, `First direct-reader return paint: ${JSON.stringify(direct)}`)
 await page.goto(base + '#lesen/unknown')
 await page.getByRole('heading', { name: 'Dokument nicht gefunden' }).waitFor()
 await observeReturn(page)
 await page.getByRole('link', { name: 'Zur Bibliothek', exact: true }).click()
 await page.locator('#bibliothek').waitFor({ state: 'visible' })
 const unknown = await page.evaluate(() => window.__firstReturn)
 assert.ok(unknown && Math.abs(unknown.libraryTop) < 100, `Unknown-reader library return: ${JSON.stringify(unknown)}`)
 // Native anchor navigation remains usable after leaving a reader.
 await page.locator('.masthead .wordmark').click()
 await page.waitForFunction(() => Math.abs(document.getElementById('idee').getBoundingClientRect().top) < 100)
 await page.locator('.hero-copy a[href="#problem"]').click()
 await page.getByRole('button', { name: 'Alle Themen', exact: true }).click()
 const returns = []
 for (const id of ['kind', 'personal', 'technik']) {
  await page.locator(`.graph-topic-list [data-node="${id}"]`).click()
  const action = page.getByRole('link', { name: 'Befund vertiefen', exact: true })
  // Scrolling the action into view mirrors a real click's preconditions and
  // captures the position that the reader must restore, including mobile locks.
  await action.scrollIntoViewIfNeeded()
  await action.click()
  await page.locator('.longform').waitFor()
  const before = await page.evaluate(() => window.__readerEntryY)
  await observeReturn(page)
  await page.locator('.reader-nav a').first().click()
  await page.locator(`.graph-topic-list [data-node="${id}"][aria-pressed=true]`).waitFor()
  const first = await page.evaluate(() => window.__firstReturn)
  assert.ok(first && Math.abs(first.y - before) < 2, `First graph return paint ${mobile}/${reducedMotion}/${id}: ${JSON.stringify({before,first})}`)
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  assert.ok(Math.abs(await page.evaluate(() => scrollY) - before) < 2, 'Return must not jump on the next frame')
  returns.push({ id, before, first: first.y })
 }
 assert.deepEqual(errors, [])
 results.push({ mobile, reducedMotion, direct, unknown, returns, errors })
 await context.close()
}
await browser.close()
await fs.writeFile(`${out}/report.json`, JSON.stringify(results, null, 2))
console.log(JSON.stringify(results, null, 2))
