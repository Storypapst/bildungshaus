import { useEffect, useRef, useState } from 'react'
import { Baby, Users, HeartHandshake, Utensils, Coins, Shapes, MonitorPlay, Wrench, MapPin, GraduationCap, ZoomIn, ZoomOut, Maximize, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { Content } from './types'
import { networkByMapKey } from './networkFindings'

type View = { x:number; y:number; scale:number }
type MapNode = { key:string; id:string; x:number; y:number; title?:string }
const WIDTH=1020,HEIGHT=850,CARD_W=260,CARD_H=132
const icons={kind:Baby,familie:Users,kueche:Utensils,spielraum:Coins,medien:MonitorPlay,technik:Wrench,personal:HeartHandshake,organisation:GraduationCap,leitung:Users,traeger:Home,partizipation:Shapes,passung:MapPin,beziehung:HeartHandshake}
const homeNodes:MapNode[]=[
 ['familie',170,95],['organisation',510,95],['leitung',850,95],
 ['kueche',170,310],['kind',510,310],['partizipation',850,310],
 ['personal',170,525],['beziehung',510,525],['medien',850,525],
 ['passung',170,740],['spielraum',510,740],['technik',850,740],
].map(([id,x,y])=>({key:String(id),id:String(id),x:Number(x),y:Number(y)}))
const networkNodes:MapNode[]=[
 {key:'a-team',id:'organisation',x:165,y:170},
 {key:'a-kitchen',id:'kueche',x:165,y:335},
 {key:'b-team',id:'organisation',x:855,y:170},
 {key:'b-kitchen',id:'kueche',x:855,y:335},
 {key:'change',id:'personal',x:510,y:200},
 {key:'families',id:'familie',x:510,y:445},
 {key:'provider',id:'traeger',x:170,y:700},
 {key:'lab',id:'technik',x:510,y:700},
 {key:'resources',id:'spielraum',x:850,y:700},
]
const networkEdges=[['provider','a-team','Verantwortung für Haus A'],['provider','b-team','Verantwortung für Haus B'],['a-team','change','Wechsel'],['change','b-team','Einarbeitung'],['a-team','a-kitchen','Alltag'],['b-team','b-kitchen','Alltag'],['change','families','Neue Beziehungen'],['a-kitchen','lab','Wissen teilen'],['b-kitchen','lab','Wissen teilen'],['provider','lab','Verantwortung'],['lab','resources','Gemeinsam lernen']]
function isProviderEdge(a:MapNode,b:MapNode){return a.key==='provider'&&(b.key==='a-team'||b.key==='b-team')}
function edgePath(a:MapNode,b:MapNode){if(a.key==='provider'&&b.key==='a-team')return 'M 40 700 L 8 700 L 8 170 L 35 170';if(a.key==='provider'&&b.key==='b-team')return 'M 170 766 L 170 820 L 1005 820 L 1005 170 L 985 170';return `M ${a.x} ${a.y} Q ${(a.x+b.x)/2+30} ${a.y<250&&b.y<250?65:a.y===700&&b.y===700?590:(a.y+b.y)/2-35} ${b.x} ${b.y}`}
function labelY(a:MapNode,b:MapNode){if(a.y<250&&b.y<250)return 90;if(a.key.includes('kitchen')&&b.key==='lab')return 555;if(a.y===700&&b.y===700)return 615;return(a.y+b.y)/2+(a.x===b.x?6:-14)}
function fitted(w:number,h:number):View {const scale=Math.min((w-24)/WIDTH,(h-24)/HEIGHT);return{x:(w-WIDTH*scale)/2,y:(h-HEIGHT*scale)/2,scale}}
export function clampMap(view:View,w:number,h:number):View {
 const min=fitted(w,h).scale,scale=Math.max(min,Math.min(min*2.8,view.scale))
 const clamp=(n:number,total:number,screen:number)=>total<=screen-24?(screen-total)/2:Math.max(screen-total-12,Math.min(12,n))
 return{x:clamp(view.x,WIDTH*scale,w),y:clamp(view.y,HEIGHT*scale,h),scale}
}
export function Mindmap({content,selected,onSelect,scene,onSceneChange}:{content:Content;selected:string;onSelect:(id:string)=>void;scene:string;onSceneChange:(scene:string)=>void}){
 const [view,setView]=useState<View>({x:0,y:0,scale:1})
 const size=useRef({width:0,height:0})
 const frame=useRef<HTMLDivElement>(null),viewRef=useRef(view),keyboard=useRef(false)
 const drag=useRef<{pointer:number;x:number;y:number;origin:View}|null>(null)
 const nodes=scene==='home'?homeNodes:networkNodes
 function setBounded(next:View){const el=frame.current;if(!el)return;const value=clampMap(next,el.clientWidth,el.clientHeight);viewRef.current=value;setView(value)}
 function fit(){const el=frame.current;if(el&&el.clientWidth>0&&el.clientHeight>0){const value=fitted(el.clientWidth,el.clientHeight);viewRef.current=value;setView(value)}}
 useEffect(()=>{const el=frame.current;if(!el)return;const observer=new ResizeObserver(()=>{if(el.clientWidth<1||el.clientHeight<1)return;if(size.current.width!==el.clientWidth||size.current.height!==el.clientHeight){size.current={width:el.clientWidth,height:el.clientHeight};fit()}});observer.observe(el);return()=>observer.disconnect()},[])
 function zoom(factor:number){const el=frame.current;if(!el)return;const v=viewRef.current,min=fitted(el.clientWidth,el.clientHeight).scale,scale=Math.max(min,Math.min(min*2.8,v.scale*factor)),ratio=scale/v.scale;setBounded({x:el.clientWidth/2-(el.clientWidth/2-v.x)*ratio,y:el.clientHeight/2-(el.clientHeight/2-v.y)*ratio,scale})}
 function reveal(n:MapNode){const el=frame.current;if(!el)return;const v=viewRef.current,left=(n.x-CARD_W/2)*v.scale+v.x,right=left+CARD_W*v.scale,top=(n.y-CARD_H/2)*v.scale+v.y,bottom=top+CARD_H*v.scale;setBounded({...v,x:v.x+(left<12?12-left:right>el.clientWidth-12?el.clientWidth-12-right:0),y:v.y+(top<12?12-top:bottom>el.clientHeight-12?el.clientHeight-12-bottom:0)})}
 function release(el:HTMLDivElement,pointer:number){if(el.hasPointerCapture(pointer))el.releasePointerCapture(pointer);drag.current=null}
 const edges=scene==='home'?content.relations.flatMap(r=>{const a=nodes.find(n=>n.id===r.source),b=nodes.find(n=>n.id===r.target);return a&&b?[{a,b,label:r.label,kind:r.kind}]:[]}):networkEdges.map(([a,b,label])=>({a:nodes.find(n=>n.key===a)!,b:nodes.find(n=>n.key===b)!,label,kind:'Modellierte Verbindung'}))
 return <div className="mindmap" onPointerDownCapture={()=>keyboard.current=false} onKeyDownCapture={()=>keyboard.current=true}>
  <Tabs value={scene} onValueChange={value=>{onSceneChange(String(value));fit()}}><TabsList aria-label="Perspektive der Mindmap"><TabsTrigger value="home">Alltag in einem Haus</TabsTrigger><TabsTrigger value="network">Mehrere Häuser & Träger</TabsTrigger></TabsList></Tabs>
  <div className="mindmap-controls"><p>{scene==='home'?'Menschen, Bedürfnisse und Abläufe im selben Haus.':'Was wächst mit mehreren Häusern? Eigene Befunde zu Wissen, Einarbeitung, Küchen und gemeinsamer Organisation.'}</p><div><Button variant="outline" size="icon" aria-label="Verkleinern" onClick={()=>zoom(1/1.25)}><ZoomOut/></Button><Button variant="outline" size="icon" aria-label="Vergrößern" onClick={()=>zoom(1.25)}><ZoomIn/></Button><Button variant="outline" onClick={fit}><Maximize/>Alles zeigen</Button></div></div>
  <p id="mindmap-help" className="mindmap-help">Knoten anklicken. Zum Verschieben die freie Fläche ziehen. Die Seite scrollt wie gewohnt. Tastatur: Tab für Knoten, Pfeiltasten auf der Fläche zum Verschieben, +/− zum Zoomen.</p>
  <div className="mindmap-frame" ref={frame} tabIndex={0} role="region" aria-label="Mindmap erkunden" aria-describedby="mindmap-help"
   onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const v=viewRef.current;setBounded({...v,x:v.x+(e.key==='ArrowLeft'?60:e.key==='ArrowRight'?-60:0),y:v.y+(e.key==='ArrowUp'?60:e.key==='ArrowDown'?-60:0)})}if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25)}if(e.key==='-'){e.preventDefault();zoom(.8)}if(e.key==='Home'){e.preventDefault();fit()}}}
   onPointerDown={e=>{if(e.button!==0||(e.target as HTMLElement).closest('button'))return;keyboard.current=false;if(e.pointerType==='mouse')e.preventDefault();drag.current={pointer:e.pointerId,x:e.clientX,y:e.clientY,origin:viewRef.current};e.currentTarget.setPointerCapture(e.pointerId)}}
   onPointerMove={e=>{const d=drag.current;if(!d||d.pointer!==e.pointerId)return;setBounded({...d.origin,x:d.origin.x+e.clientX-d.x,y:d.origin.y+e.clientY-d.y})}}
   onPointerUp={e=>release(e.currentTarget,e.pointerId)} onPointerCancel={e=>release(e.currentTarget,e.pointerId)} onLostPointerCapture={()=>{drag.current=null}}>
   <div className="mindmap-world" style={{width:WIDTH,height:HEIGHT,transform:`translate(${view.x}px,${view.y}px) scale(${view.scale})`}} data-view={`${view.x},${view.y},${view.scale}`}>
    {scene==='network'&&<><div className="mindmap-house house-a"><span>Ein Haus</span></div><div className="mindmap-house house-b"><span>Weitere Häuser</span></div></>}
    <svg width={WIDTH} height={HEIGHT} aria-hidden="true" className="mindmap-lines">{edges.map(({a,b,label,kind},i)=><g key={i} className={cn(((scene==='network'?'network-'+a.key:a.id)===selected||(scene==='network'?'network-'+b.key:b.id)===selected)&&'active')} data-kind={kind}><title>{label}</title><path d={edgePath(a,b)} data-provider-edge={isProviderEdge(a,b)||undefined}/>{scene==='network'&&!isProviderEdge(a,b)&&<text x={(a.x+b.x)/2} y={labelY(a,b)} textAnchor="middle">{label}</text>}</g>)}</svg>
    {nodes.map(n=>{const data=scene==='network'?networkByMapKey.get(n.key):content.nodes.find(p=>p.id===n.id);if(!data)return null;const Icon=icons[n.id as keyof typeof icons]??Shapes;return <button key={n.key} data-node={data.id} data-map-node={n.key} className={cn('mindmap-node',selected===data.id&&'is-selected')} style={{left:n.x,top:n.y,width:CARD_W,minHeight:CARD_H}} aria-pressed={selected===data.id} onFocus={()=>{if(keyboard.current)reveal(n)}} onClick={()=>onSelect(data.id)}><Icon aria-hidden="true"/><span>{'mapTitle' in data?data.mapTitle:data.title}</span></button>})}
   </div>
  </div>
  <p className="mindmap-model-note">{scene==='home'?'Verbindungen zeigen Zusammenhänge und Gestaltungsannahmen. Ein Zusammenhang allein beweist keine Ursache.':'Die Karte zeigt unsere Entwicklungsfragen. Fiktive Rechnungen sind als Beispiele gekennzeichnet. Mehr Häuser bedeuten nicht automatisch eine höhere Austrittsquote oder eine Ersparnis.'}</p>
 </div>
}
