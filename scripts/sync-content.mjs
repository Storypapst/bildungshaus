import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
process.chdir(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const core=process.env.BILDUNGSHAUS_CORE;
if(!core)throw new Error('BILDUNGSHAUS_CORE must point to the routed Core');
const content=JSON.parse(fs.readFileSync(path.join(core,'30 - Product & Delivery/30 - Website Content/website-content.json'),'utf8'));
const items=[...content.papers,{id:'quellen',title:'Quellenregister',path:'40 - Analysis & Evidence/43 - Synthesen/Quellenregister.md'},{id:'original',title:'Die erste Konzeptfassung',path:'10 - Concepts & Arguments/00 Konzeptpapier Das Bildungshaus.md'},{id:'whitepaper',title:'Das Bildungshaus – Konzept',path:'10 - Concepts & Arguments/Whitepaper - Das Bildungshaus.md'},{id:'summary',title:'Executive Summary',path:'30 - Product & Delivery/50 - Presentation/Executive Summary.md'}];
const ids=new Set(items.map(p=>p.id));
if(ids.size!==items.length)throw new Error('Duplicate registered document ID');
// Validate the entire publication before writing any output. A broken registry must fail the build.
for(const p of items){if(!fs.existsSync(path.join(core,p.path)))throw new Error(`Missing registered document ${p.id}: ${p.path}`)}
for(const node of content.nodes){if(!ids.has(node.documentId))throw new Error(`Node ${node.id} references unregistered document ${node.documentId}`)}
const nodeIds=new Set(content.nodes.map(n=>n.id));
for(const edge of content.relations){if(!nodeIds.has(edge.source)||!nodeIds.has(edge.target))throw new Error('Dangling graph relationship')}
const docs=items.map(p=>{
 let body=fs.readFileSync(path.join(core,p.path),'utf8').replace(/^---\n[\s\S]*?\n---\n/,'');
 body=body.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g,(_,target,label)=>{const match=items.find(x=>path.basename(x.path,'.md')===target);return match?`[${label??target}](#lesen/${match.id})`:label??target});
 body=body.replace(/\[([^\]]+)\]\(<?([^)>]+)>?\)/g,(full,label,target)=>{if(/^(https?:|#|mailto:)/.test(target))return full;const resolved=path.normalize(path.join(path.dirname(p.path),decodeURI(target)));const linked=items.find(x=>x.path===resolved);if(linked)return `[${label}](#lesen/${linked.id})`;if(resolved==='40 - Analysis & Evidence/43 - Synthesen/README.md')return `[${label}](#bibliothek)`;return label});
 for(const match of body.matchAll(/\]\(#lesen\/([^\s)]+)\)/g)){if(!ids.has(match[1]))throw new Error(`${p.id} links to unregistered reader document ${match[1]}`)}
 if(p.id!=='original')body=body.replace(/\bWhitepaper\b/g,'Konzept');
 return {id:p.id,title:p.title,body,filename:p.id+'.md'};
});
fs.mkdirSync('public/dokumente',{recursive:true});
for(const doc of docs)fs.writeFileSync('public/dokumente/'+doc.filename,doc.body);
fs.writeFileSync('src/content/content.json',JSON.stringify(content,null,2));
fs.writeFileSync('src/content/documents.json',JSON.stringify(docs,null,2));
console.log('synced documents:',docs.length);
