import fs from 'node:fs/promises'
import path from 'node:path'
import assert from 'node:assert/strict'
async function walk(dir){const out=[];for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())out.push(...await walk(p));else out.push(p)}return out}
const violations=[]
for(const file of (await walk('src')).filter(f=>f.endsWith('.css')&&!f.endsWith('styles/tokens.css')&&!f.endsWith('/App.css'))){
 const text=await fs.readFile(file,'utf8')
 for(const match of text.matchAll(/#[\da-f]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch)\(/gi))violations.push(`${file}: ${match[0]}`)
}
assert.deepEqual(violations,[],'Application colors belong in styles/tokens.css; generated artwork and vendor styles are outside this contract')
console.log('All active application CSS color literals are centralized')
