import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';import {spawnSync} from 'node:child_process';
const core=process.env.BILDUNGSHAUS_CORE;if(!core)throw new Error('Set BILDUNGSHAUS_CORE');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'bildungshaus-sync-'));
try{
 const contentPath='30 - Product & Delivery/30 - Website Content/website-content.json',content=JSON.parse(fs.readFileSync(path.join(core,contentPath),'utf8'));
 fs.mkdirSync(path.dirname(path.join(temp,contentPath)),{recursive:true});fs.writeFileSync(path.join(temp,contentPath),JSON.stringify(content));
 const missing=content.papers.at(-1);for(const doc of content.papers.slice(0,-1)){const dest=path.join(temp,doc.path);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.symlinkSync(path.join(core,doc.path),dest)}
 const before=fs.readFileSync('src/content/documents.json');const result=spawnSync(process.execPath,['scripts/sync-content.mjs'],{env:{...process.env,BILDUNGSHAUS_CORE:temp},encoding:'utf8'});
 assert.notEqual(result.status,0);assert.ok(result.stderr.includes(`Missing registered document ${missing.id}`));assert.deepEqual(fs.readFileSync('src/content/documents.json'),before,'Failure must not publish a partial set');console.log('Missing registered document rejected; generated publication unchanged.');
}finally{fs.rmSync(temp,{recursive:true,force:true})}
