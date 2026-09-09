import{chromium}from'playwright-core';import assert from'node:assert/strict';
const b=await chromium.launch({channel:'chrome'});
for(const width of[1440,390]){
 const p=await b.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 await p.goto('http://127.0.0.1:5182/bildungshaus/#umfrage');
 await p.getByRole('link',{name:'Fragebögen beantworten',exact:true}).click();
 await p.locator('#kontakt iframe').scrollIntoViewIfNeeded();
 const f=p.frameLocator('#kontakt iframe');
 await f.getByRole('checkbox').check();
 // Formbricks mounts its client runtime after painting the first question.
 await p.waitForTimeout(500);
 await f.getByRole('button',{name:'Pretest beginnen',exact:true}).click();
 await f.getByText('Denken Sie an die letzten vier Wochen: Was gelang in der Betreuung gut, und was machte sie schwierig?',{exact:true}).waitFor();
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.locator('#kontakt').screenshot({path:`output/qa/survey-footer-question-${width}.png`});
 console.log(width,'one-click CTA, consent and first question visible; no overflow PASS');
 await p.close();
}
await b.close();
