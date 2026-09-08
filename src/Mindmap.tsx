import { useEffect, useRef, useState } from 'react'
import { Baby, Users, HeartHandshake, Utensils, Coins, Shapes, MonitorPlay, Wrench, MapPin, GraduationCap, ZoomIn, ZoomOut, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import '@fontsource/kalam/latin-400.css'
import { cn } from '@/lib/utils'
import type { Content } from './types'
import { networkByMapKey } from './networkFindings'

type View = { x:number; y:number; scale:number }
type MapNode = { key:string; id:string; x:number; y:number; title?:string }
const WIDTH=1120,HEIGHT=1340,CARD_W=250,CARD_H=250
const icons={kind:Baby,familie:Users,kueche:Utensils,spielraum:Coins,medien:MonitorPlay,technik:Wrench,personal:HeartHandshake,organisation:GraduationCap,leitung:Users,traeger:Home,partizipation:Shapes,passung:MapPin,beziehung:HeartHandshake}
const homeNodes:MapNode[]=[
 ['familie',160,160],['organisation',560,160],['leitung',960,160],
 ['kueche',160,500],['kind',560,500],['partizipation',960,500],
 ['personal',160,840],['beziehung',560,840],['medien',960,840],
 ['passung',160,1180],['spielraum',560,1180],['technik',960,1180],
].map(([id,x,y])=>({key:String(id),id:String(id),x:Number(x),y:Number(y)}))
const networkNodes:MapNode[]=[
 {key:'a-team',id:'organisation',x:160,y:190},
 {key:'a-kitchen',id:'kueche',x:160,y:510},
 {key:'b-team',id:'organisation',x:960,y:190},
 {key:'b-kitchen',id:'kueche',x:960,y:510},
 {key:'change',id:'personal',x:560,y:260},
 {key:'families',id:'familie',x:560,y:630},
 {key:'provider',id:'traeger',x:160,y:1020},
 {key:'lab',id:'technik',x:560,y:1020},
 {key:'resources',id:'spielraum',x:960,y:1020},
]
const networkEdges=[['provider','a-team','Verantwortung für Haus A'],['provider','b-team','Verantwortung für Haus B'],['a-team','change','Wechsel'],['change','b-team','Einarbeitung'],['a-team','a-kitchen','Alltag'],['b-team','b-kitchen','Alltag'],['change','families','Neue Beziehungen'],['a-kitchen','lab','Wissen teilen'],['b-kitchen','lab','Wissen teilen'],['provider','lab','Verantwortung'],['lab','resources','Gemeinsam lernen']]
function isProviderEdge(a:MapNode,b:MapNode){return a.key==='provider'&&(b.key==='a-team'||b.key==='b-team')}
function edgePath(a:MapNode,b:MapNode){
 if(isProviderEdge(a,b)&&b.key==='b-team')return `M ${a.x} ${a.y+108} C ${a.x-8} 1270,${a.x+12} 1300,${a.x+80} 1300 L 1070 1300 Q 1108 1300,1108 1260 L 1108 ${b.y+30} Q 1108 ${b.y},${b.x+110} ${b.y}`;
 if(isProviderEdge(a,b)){const lane=b.key==='a-team'?12:1108;return `M ${a.x-110} ${a.y} C ${lane} ${a.y+30},${lane} ${a.y},${lane} ${a.y-80} L ${lane} ${b.y} Q ${lane} ${b.y-10},${b.x+(b.key==='a-team'?-110:110)} ${b.y}`}
 const dx=b.x-a.x,dy=b.y-a.y,ratio=Math.min(110/(Math.abs(dx)||1),105/(Math.abs(dy)||1));
 const sx=a.x+dx*ratio,sy=a.y+dy*ratio,ex=b.x-dx*ratio,ey=b.y-dy*ratio;
 return `M ${sx} ${sy} C ${sx+dx*.28+12} ${sy+dy*.22-10},${ex-dx*.28-12} ${ey-dy*.22+10},${ex} ${ey}`
}
function fitted(w:number,h:number):View {const scale=Math.min((w-24)/WIDTH,(h-24)/HEIGHT);return{x:(w-WIDTH*scale)/2,y:(h-HEIGHT*scale)/2,scale}}
export function clampMap(view:View,w:number,h:number):View {
 const min=fitted(w,h).scale,scale=Math.max(min,Math.min(min*2.8,view.scale))
 const clamp=(n:number,total:number,screen:number)=>total<=screen-24?(screen-total)/2:Math.max(screen-total-12,Math.min(12,n))
 return{x:clamp(view.x,WIDTH*scale,w),y:clamp(view.y,HEIGHT*scale,h),scale}
}
export function Mindmap({content,selected,onSelect,scene}:{content:Content;selected:string;onSelect:(id:string)=>void;scene:string}){
 const [view,setView]=useState<View>({x:0,y:0,scale:1})
 const size=useRef({width:0,height:0})
 const frame=useRef<HTMLDivElement>(null),viewRef=useRef(view),keyboard=useRef(false)
 const drag=useRef<{pointer:number;x:number;y:number;origin:View}|null>(null)
 const nodes=scene==='home'?homeNodes:networkNodes
 function setBounded(next:View){const el=frame.current;if(!el)return;const value=clampMap(next,el.clientWidth,el.clientHeight);viewRef.current=value;setView(value)}
 function fit(){const el=frame.current;if(el&&el.clientWidth>0&&el.clientHeight>0){const base=fitted(el.clientWidth,el.clientHeight);const scale=el.clientWidth<600?base.scale*2:base.scale;const value={scale,x:(el.clientWidth-WIDTH*scale)/2,y:(el.clientHeight-HEIGHT*scale)/2};viewRef.current=value;setView(value)}}
 useEffect(()=>{const el=frame.current;if(!el)return;const observer=new ResizeObserver(()=>{if(el.clientWidth<1||el.clientHeight<1)return;if(size.current.width!==el.clientWidth||size.current.height!==el.clientHeight){size.current={width:el.clientWidth,height:el.clientHeight};fit()}});observer.observe(el);return()=>observer.disconnect()},[])
 function zoom(factor:number){const el=frame.current;if(!el)return;const v=viewRef.current,min=fitted(el.clientWidth,el.clientHeight).scale,scale=Math.max(min,Math.min(min*2.8,v.scale*factor)),ratio=scale/v.scale;setBounded({x:el.clientWidth/2-(el.clientWidth/2-v.x)*ratio,y:el.clientHeight/2-(el.clientHeight/2-v.y)*ratio,scale})}
 function reveal(n:MapNode){const el=frame.current;if(!el)return;const v=viewRef.current,left=(n.x-CARD_W/2)*v.scale+v.x,right=left+CARD_W*v.scale,top=(n.y-CARD_H/2)*v.scale+v.y,bottom=top+CARD_H*v.scale;setBounded({...v,x:v.x+(left<12?12-left:right>el.clientWidth-12?el.clientWidth-12-right:0),y:v.y+(top<12?12-top:bottom>el.clientHeight-12?el.clientHeight-12-bottom:0)})}
 function release(el:HTMLDivElement,pointer:number){if(el.hasPointerCapture(pointer))el.releasePointerCapture(pointer);drag.current=null}
 const edges=scene==='home'?content.relations.flatMap(r=>{const a=nodes.find(n=>n.id===r.source),b=nodes.find(n=>n.id===r.target);return a&&b?[{a,b,label:r.label,kind:r.kind}]:[]}):networkEdges.map(([a,b,label])=>({a:nodes.find(n=>n.key===a)!,b:nodes.find(n=>n.key===b)!,label,kind:'Modellierte Verbindung'}))
 return <div className="mindmap" data-scene={scene} onPointerDownCapture={()=>keyboard.current=false} onKeyDownCapture={()=>keyboard.current=true}>
  <h3 className="canvas-title">{scene==='home'?'Im Alltag eines Hauses':'Mehrere Häuser. Geteilte Verantwortung.'}</h3>
  <div className="mindmap-controls"><p>{scene==='home'?'Wo Beziehungen im Alltag tragen – und was ein Personalwechsel verändert.':'Skalierung: Mehr Häuser brauchen mehr Abstimmung. Welche Arbeit wiederholt sich, welches Wissen geht verloren und was lässt sich gemeinsam nutzen?'}</p><div><Button variant="outline" size="icon" aria-label="Verkleinern" onClick={()=>zoom(1/1.25)}><ZoomOut/></Button><Button variant="outline" size="icon" aria-label="Vergrößern" onClick={()=>zoom(1.25)}><ZoomIn/></Button></div></div>
  <p id={`mindmap-help-${scene}`} className="mindmap-help">Knoten anklicken. Zum Verschieben die freie Fläche ziehen. Die Seite scrollt wie gewohnt. Tastatur: Tab für Knoten, Pfeiltasten auf der Fläche zum Verschieben, +/− zum Zoomen.</p>
  <div className="mindmap-frame" ref={frame} tabIndex={0} role="region" aria-label={scene==='home'?'Alltag im Haus erkunden':'Mehrere Häuser erkunden'} aria-describedby={`mindmap-help-${scene}`}
   onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();const v=viewRef.current;setBounded({...v,x:v.x+(e.key==='ArrowLeft'?60:e.key==='ArrowRight'?-60:0),y:v.y+(e.key==='ArrowUp'?60:e.key==='ArrowDown'?-60:0)})}if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25)}if(e.key==='-'){e.preventDefault();zoom(.8)}if(e.key==='Home'){e.preventDefault();fit()}}}
   onPointerDown={e=>{if(e.button!==0||(e.target as HTMLElement).closest('button'))return;keyboard.current=false;if(e.pointerType==='mouse')e.preventDefault();drag.current={pointer:e.pointerId,x:e.clientX,y:e.clientY,origin:viewRef.current};e.currentTarget.setPointerCapture(e.pointerId)}}
   onPointerMove={e=>{const d=drag.current;if(!d||d.pointer!==e.pointerId)return;setBounded({...d.origin,x:d.origin.x+e.clientX-d.x,y:d.origin.y+e.clientY-d.y})}}
   onPointerUp={e=>release(e.currentTarget,e.pointerId)} onPointerCancel={e=>release(e.currentTarget,e.pointerId)} onLostPointerCapture={()=>{drag.current=null}}>
   <div className="mindmap-world" style={{width:WIDTH,height:HEIGHT,transform:`translate(${view.x}px,${view.y}px) scale(${view.scale})`}} data-view={`${view.x},${view.y},${view.scale}`}>
    {scene==='network'&&<><div className="mindmap-house house-a"><span>Ein Haus</span></div><div className="mindmap-house house-b"><span>Weitere Häuser</span></div></>}
    <svg width={WIDTH} height={HEIGHT} aria-hidden="true" className="mindmap-lines"><defs><filter id={`pencil-${scene}`} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="2.8" xChannelSelector="R" yChannelSelector="G"/></filter></defs><g filter={`url(#pencil-${scene})`}>{edges.map(({a,b,label,kind},i)=><g key={`${scene}-${i}-${selected}`} className={cn(((scene==='network'?'network-'+a.key:a.id)===selected||(scene==='network'?'network-'+b.key:b.id)===selected)&&'active')} data-kind={kind}><title>{label}</title><path className="marker-understroke" d={edgePath(a,b)} pathLength={1}/><path className="marker-stroke" pathLength={1} d={edgePath(a,b)} data-provider-edge={isProviderEdge(a,b)||undefined}/></g>)}</g></svg>
    {nodes.map((n,index)=>{const data=scene==='network'?networkByMapKey.get(n.key):content.nodes.find(p=>p.id===n.id);if(!data)return null;const Icon=icons[n.id as keyof typeof icons]??Shapes;return <button key={n.key} data-paper={[0,1,2,2,0,1,1,2,0,0,2,1][index%12]} data-node={data.id} data-map-node={n.key} className={cn('mindmap-node',selected===data.id&&'is-selected')} style={{left:n.x,top:n.y,width:CARD_W,minHeight:CARD_H,rotate:`${[-3,2,-1,3,-2,1][index%6]}deg`}} aria-pressed={selected===data.id} onFocus={()=>{if(keyboard.current)reveal(n)}} onClick={()=>onSelect(data.id)}><Icon aria-hidden="true"/><span>{'mapTitle' in data?data.mapTitle:data.title}</span></button>})}
   </div>
  </div>
  <p className="mindmap-model-note">{scene==='home'?'Verbindungen zeigen Zusammenhänge und Gestaltungsannahmen. Ein Zusammenhang allein beweist keine Ursache.':'Die Karte zeigt unsere Entwicklungsfragen. Fiktive Rechnungen sind als Beispiele gekennzeichnet. Mehr Häuser bedeuten nicht automatisch eine höhere Austrittsquote oder eine Ersparnis.'}</p>
 </div>
}
