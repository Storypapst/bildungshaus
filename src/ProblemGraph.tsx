import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, BookOpen, Check, List, Shapes, ChevronDown } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { Content } from './types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import './ProblemGraph.css'
import { Mindmap } from './Mindmap'
import { networkById, networkFindings } from './networkFindings'
export function ProblemGraph({content,selected,onSelect,saved,onSave}:{content:Content;selected:string;onSelect:(id:string)=>void;saved:string[];onSave:(id:string)=>void}) {
 const [perspective,setPerspective]=useState('home'),[networkSelected,setNetworkSelected]=useState(networkFindings[0].id)
 const [list,setList]=useState(()=>matchMedia('(max-width:700px)').matches)
 const [compact,setCompact]=useState(()=>matchMedia('(max-width:1000px)').matches),[mobileOpen,setMobileOpen]=useState(false),[tab,setTab]=useState('overview'),[moreBelow,setMoreBelow]=useState(false)
 const pane=useRef<HTMLElement>(null)
 const paneScroll=useRef<HTMLDivElement>(null),returnFocus=useRef<HTMLElement|null>(null)
 useEffect(()=>{const media=matchMedia('(max-width:1000px)');const change=()=>{setCompact(media.matches);if(!media.matches)setMobileOpen(false)};media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[])
 useEffect(()=>{if(compact)return;const resize=()=>{const el=pane.current;if(el)el.style.setProperty('--pane-top',`${Math.max(24,Math.min(innerHeight-380,el.getBoundingClientRect().top))}px`)};resize();addEventListener('scroll',resize,{passive:true});addEventListener('resize',resize);return()=>{removeEventListener('scroll',resize);removeEventListener('resize',resize)}},[compact,list])
 function updateScrollCue(){const el=paneScroll.current;setMoreBelow(!!el&&el.scrollHeight-el.scrollTop-el.clientHeight>12)}
 useEffect(()=>{const el=paneScroll.current;if(!el)return;const observer=new ResizeObserver(updateScrollCue);observer.observe(el);if(el.firstElementChild)observer.observe(el.firstElementChild);const frame=requestAnimationFrame(updateScrollCue);return()=>{observer.disconnect();cancelAnimationFrame(frame)}},[selected,networkSelected,perspective,list,tab,mobileOpen,compact])
 function choose(id:string){const fromPane=!!document.activeElement?.closest('.graph-detail-tabs');const finding=networkById.get(id);if(finding){setNetworkSelected(id);onSelect(finding.baseNodeId)}else onSelect(id);setTab('overview');if(paneScroll.current)paneScroll.current.scrollTop=0;if(compact){if(!mobileOpen)returnFocus.current=document.activeElement as HTMLElement;setMobileOpen(true)}if(fromPane)requestAnimationFrame(()=>document.querySelector<HTMLElement>(`${compact?'.graph-mobile-dialog':'.graph-detail-pane'} [role=tab]`)?.focus({preventScroll:true}))}
 const networkActive=!list&&perspective==='network'
 const current=networkActive?(networkById.get(networkSelected)??networkFindings[0]):(content.nodes.find(n=>n.id===selected)??content.nodes[0])
 function changePerspective(value:string){setPerspective(value);setTab('overview');if(paneScroll.current)paneScroll.current.scrollTop=0}
 function navigate(event:React.MouseEvent<HTMLAnchorElement>){event.preventDefault();const target=event.currentTarget.hash;setMobileOpen(false);window.location.hash=target}
 function changeTab(value:unknown){setTab(String(value));if(paneScroll.current)paneScroll.current.scrollTop=0}
 function renderPane(inDialog=false){return <>
  <div className="graph-pane-heading" data-finding-id={current.id}>{!inDialog&&<><span className="graph-pane-label">Deine Auswahl · mehr erfahren</span><h3>{current.title}</h3></>}<Badge variant="outline">{current.evidenceStatus}</Badge><span className="sr-only" role="status">Ausgewählt: {current.title}. Erklärung und Quellen verfügbar.</span></div>
  <Tabs value={tab} onValueChange={changeTab} className="graph-detail-tabs">
   <TabsList aria-label="Informationen zur Auswahl"><TabsTrigger value="overview">Überblick</TabsTrigger><TabsTrigger value="sources">Quellen ({current.sources.length})</TabsTrigger></TabsList>
   <div ref={paneScroll} onScroll={updateScrollCue} className="graph-pane-scroll" tabIndex={0} role="region" aria-label="Details zur Auswahl, scrollbar">
    <TabsContent value="overview"><p className="finding-metric">{current.metric}</p><p className="metric-caption">{current.metricLabel}</p><p className="graph-detail-summary">{current.summary}</p><div className="graph-complete-detail">{current.detail.split('\n').filter(Boolean).map((paragraph,i)=><p key={i}>{paragraph}</p>)}</div></TabsContent>
    <TabsContent value="sources">{current.sources.length?<ul className="source-list">{current.sources.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.title} <ArrowUpRight aria-hidden="true"/></a>{s.year&&<p>Bezugsjahr: {s.year}</p>}{s.population&&<p>{s.population}</p>}{s.denominator&&<p>Bezugsgröße: {s.denominator}</p>}{s.location&&<small>Fundstelle: {s.location}</small>}</li>)}</ul>:<p>Dieser Aspekt beschreibt unser Konzept. Die vollständige Synthese erläutert seine Grundlagen und Grenzen.</p>}</TabsContent>
   </div>{moreBelow&&<span className="graph-scroll-cue">Im Fenster weiterlesen <ChevronDown aria-hidden="true"/></span>}
  </Tabs>
  <div className="graph-pane-actions"><a className={buttonVariants({variant:'secondary'})} href={`#lesen/${current.documentId}`} onClick={navigate}>Befund vertiefen <ArrowUpRight data-icon="inline-end"/></a>{!networkActive&&<Button variant="outline" onClick={()=>onSave(current.id)} aria-pressed={saved.includes(current.id)}>{saved.includes(current.id)?<Check/>:<BookOpen/>}{saved.includes(current.id)?'Vorgemerkt':'Fürs Gespräch'}</Button>}</div>
 </>}
 return <div className="graph-workspace">
  <div className="graph-toolbar" aria-label="Ansicht der Zusammenhänge"><div className="flex flex-wrap gap-2"><Button variant={list?'outline':'secondary'} onClick={()=>setList(false)} aria-pressed={!list}><Shapes/>Mindmap</Button><Button variant={list?'secondary':'outline'} onClick={()=>setList(true)} aria-pressed={list}><List/>Alle Themen</Button></div></div>
  <p className="graph-discovery">Wähle einen Knoten. <strong>{compact?'Der Überblick öffnet sich als Fenster.':'Konflikt, Befund und Lösungsansatz stehen direkt rechts.'}</strong></p>
  <div className="graph-split"><div className="graph-map-column">
  <div hidden={list}><Mindmap content={content} selected={networkActive?networkSelected:selected} onSelect={choose} scene={perspective} onSceneChange={changePerspective}/></div>
  {list&&<ul className="graph-topic-list" aria-label="Alle Zusammenhänge">{content.nodes.map(n=><li key={n.id}><button data-node={n.id} aria-pressed={selected===n.id} onClick={()=>choose(n.id)} className={cn(selected===n.id&&'is-selected')}>{n.title}</button></li>)}</ul>}
  </div>
  {compact?<div className="graph-mobile-selection"><span>Ausgewählt: <strong>{current.title}</strong></span><Button onClick={e=>{returnFocus.current=e.currentTarget;setMobileOpen(true)}}>Erklärung öffnen <ArrowUpRight data-icon="inline-end"/></Button></div>:<aside ref={pane} className="graph-finding graph-detail-pane" aria-label="Erklärung zur Auswahl">{renderPane()}</aside>}
  </div>
  {compact&&<Dialog open={mobileOpen} onOpenChange={setMobileOpen}><DialogContent className="graph-mobile-dialog" finalFocus={()=>location.hash.startsWith('#lesen/')?false:returnFocus.current??document.querySelector<HTMLElement>('.graph-mobile-selection button')}><DialogHeader><DialogTitle>{current.title}</DialogTitle><DialogDescription>Überblick und Quellen zur Auswahl.</DialogDescription></DialogHeader>{renderPane(true)}</DialogContent></Dialog>}

 </div>
}
