import { useState } from 'react'
import { ArrowUpRight, BookOpen, Check } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Content, Problem } from './types'

export function ProblemGraph({ content, selected, onSelect, saved, onSave }: {content:Content; selected:string;onSelect:(id:string)=>void;saved:string[];onSave:(id:string)=>void}) {
 const [detail,setDetail]=useState<Problem|null>(null)
 const current=content.nodes.find(n=>n.id===selected)??content.nodes[0]
 const neighbors=new Set(content.relations.filter(r=>r.source===selected||r.target===selected).flatMap(r=>[r.source,r.target]))
 const positions=content.nodes.map((_,i)=>{const a=-Math.PI/2+i*2*Math.PI/content.nodes.length;return {x:50+34*Math.cos(a),y:50+36*Math.sin(a)}})
 return <div className="graph-layout">
  <div className="graph-map" aria-label="Zusammenhänge der Problemanalyse">
   <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="graph-lines">
    {content.relations.map((r,i)=>{const a=positions[content.nodes.findIndex(n=>n.id===r.source)],b=positions[content.nodes.findIndex(n=>n.id===r.target)]; if(!a||!b)return null; return <path key={i} d={`M ${a.x} ${a.y} Q ${50+(i%2?7:-7)} ${50+(i%3?4:-4)} ${b.x} ${b.y}`} className={cn('graph-edge',(r.source===selected||r.target===selected)&&'is-active')} />})}
   </svg>
   <div className="graph-center" aria-hidden="true">Der Alltag<br/><strong>eines Kindes</strong></div>
   {content.nodes.map((n,i)=><button key={n.id} className={cn('graph-node',selected===n.id&&'is-selected',neighbors.has(n.id)&&'is-related')} style={{left:`${positions[i].x}%`,top:`${positions[i].y}%`}} aria-pressed={selected===n.id} onClick={()=>onSelect(n.id)}><span>{n.title}</span><ArrowUpRight aria-hidden="true"/></button>)}
  </div>
  <aside className="graph-finding" aria-live="polite" aria-atomic="true">
   <Badge variant="outline">{current.evidenceStatus}</Badge>
   <h3>{current.title}</h3>
   <p className="finding-metric">{current.metric}</p>
   <p className="metric-caption">{current.metricLabel}</p>
   <Separator/>
   <p>{current.summary}</p>
   <div className="flex flex-wrap gap-2">
    <Button onClick={()=>setDetail(current)}>Befund vertiefen <ArrowUpRight data-icon="inline-end"/></Button>
    <Button variant="outline" onClick={()=>onSave(current.id)} aria-pressed={saved.includes(current.id)}>{saved.includes(current.id)?<Check data-icon="inline-start"/>:<BookOpen data-icon="inline-start"/>}{saved.includes(current.id)?'Vorgemerkt':'Fürs Gespräch'}</Button>
   </div>
   <p className="graph-relation-label">Verknüpft mit</p>
   <ul className="related-list">{content.relations.filter(r=>r.source===selected||r.target===selected).map((r,i)=><li key={i}>{r.label}</li>)}</ul>
  </aside>
  <Dialog open={!!detail} onOpenChange={open=>!open&&setDetail(null)}>
   <DialogContent className="max-h-[88dvh] overflow-y-auto sm:max-w-2xl">
    <DialogHeader><DialogTitle>{detail?.title}</DialogTitle><DialogDescription>{detail?.metric} · {detail?.metricLabel}</DialogDescription></DialogHeader>
    <div className="detail-prose">{detail?.detail.split('\n').filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>
    <h4>Quellen zum Nachlesen</h4>
    <ul className="source-list">{detail?.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} <ArrowUpRight aria-hidden="true"/></a></li>)}</ul>
    <a className={buttonVariants({variant:'secondary'})} href={`#lesen/${detail?.relatedPaper?.match(/P\d+/)?.[0]??detail?.relatedPaper}`} onClick={()=>setDetail(null)}>Ausführliche Synthese lesen</a>
   </DialogContent>
  </Dialog>
 </div>
}
