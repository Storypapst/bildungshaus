import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, Download } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import type { Document } from './types'
import rawDocs from './content/documents.json'
const docs=rawDocs as Document[]
export default function Reader({id}:{id:string}){
 const doc=docs.find(d=>d.id===id)
 if(!doc)return <main className="reader"><h1>Dokument nicht gefunden</h1><a href="#bibliothek">Zur Bibliothek</a></main>
 return <main className="reader"><nav className="reader-nav"><a href="#bibliothek"><ArrowLeft aria-hidden="true"/>Zur Präsentation</a><a className={buttonVariants({variant:'outline'})} href={`${import.meta.env.BASE_URL}dokumente/${doc.filename}`} download><Download data-icon="inline-start"/>Markdown laden</a></nav><article className="longform"><Markdown remarkPlugins={[remarkGfm]} components={{a:({href,children})=><a href={href} target={href?.startsWith('http')?'_blank':undefined} rel="noreferrer">{children}</a>}}>{doc.body}</Markdown></article><a href="#bibliothek">Alle Synthesen</a></main>
}
