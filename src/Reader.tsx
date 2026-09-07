import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Download, ArrowUpRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { Document,Content } from './types'
import rawDocs from './content/documents.json'
import rawContent from './content/content.json'
import ArticleDiagram from './ArticleDiagram'
import {articleDiagrams} from './content/articleDiagrams'
const docs=rawDocs as Document[],content=rawContent as Content
export default function Reader({id,returnHash='#bibliothek',fromGraph=false,selected}:{id:string;returnHash?:string;fromGraph?:boolean;selected:string}){
 const doc=docs.find(d=>d.id===id)
 if(!doc)return <main className="reader"><h1>Dokument nicht gefunden</h1><a href="#bibliothek">Zur Bibliothek</a></main>
 const isConcept=doc.id==='whitepaper',downloadFilename=isConcept?'konzept.pdf':doc.filename
 const diagram=articleDiagrams[doc.id]
 const current=content.nodes.find(n=>n.id===selected),connected=content.relations.filter(r=>r.source===selected||r.target===selected).flatMap(r=>[r.source,r.target])
 const related=content.nodes.filter(n=>connected.includes(n.id)&&n.id!==selected&&n.documentId!==id)
 return <main className="reader"><nav className="reader-nav"><a href={returnHash}><ArrowLeft aria-hidden="true"/>{fromGraph?(current?.title?`Zur Auswahl: ${current.title}`:'Zur Auswahl'):'Zur Präsentation'}</a><a className={`${buttonVariants({variant:'outline'})}${isConcept?' concept-download':''}`} href={`${import.meta.env.BASE_URL}dokumente/${downloadFilename}`} download={isConcept?'Bildungshaus-weWeit-Konzept.pdf':undefined}><Download data-icon="inline-start"/>{isConcept?'Konzept herunterladen':'Markdown laden'}</a></nav><article className="longform"><Markdown remarkPlugins={[remarkGfm]} components={{a:({href,children})=><a href={href} target={href?.startsWith('http')?'_blank':undefined} rel="noreferrer">{children}</a>,h2:({children})=><><h2>{children}</h2>{diagram&&String(children)===diagram.afterHeading&&<ArticleDiagram diagram={diagram}/>}</>}}>{doc.body}</Markdown></article>{fromGraph&&related.length>0&&<aside className="reader-related"><h2>Angrenzende Gedanken</h2><ul>{related.map(n=><li key={n.id}><a href={`#lesen/${n.documentId}`}>{n.title} <ArrowUpRight aria-hidden="true"/></a><p>{n.summary}</p></li>)}</ul></aside>}<a href="#bibliothek">Alle Synthesen</a></main>
}
