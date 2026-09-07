import {useLayoutEffect,useRef,useState} from 'react'
import './ArticleDiagram.css'
import type {ArticleDiagramData} from './content/articleDiagrams'

function Arrow(){return <svg className="article-diagram-arrow" viewBox="0 0 42 18" aria-hidden="true"><path d="M1 9h35M29 2l8 7-8 7"/></svg>}

export default function ArticleDiagram({diagram}:{diagram:ArticleDiagramData}){
 const bodyRef=useRef<HTMLDivElement>(null),hubRef=useRef<HTMLDivElement>(null),itemRefs=useRef<(HTMLDivElement|null)[]>([])
 const [connectors,setConnectors]=useState<{width:number;height:number;hub:{x1:number;y1:number;x2:number;y2:number}[];cycle?:string}>({width:1,height:1,hub:[]})
 useLayoutEffect(()=>{const body=bodyRef.current;if(!body)return;const update=()=>{
  const host=body.getBoundingClientRect(),items=itemRefs.current.map(el=>el?.getBoundingClientRect()).filter((x):x is DOMRect=>!!x)
  const local=(rect:DOMRect)=>({left:rect.left-host.left,right:rect.right-host.left,top:rect.top-host.top,bottom:rect.bottom-host.top,cx:(rect.left+rect.right)/2-host.left,cy:(rect.top+rect.bottom)/2-host.top})
  const rectangleBoundary=(from:ReturnType<typeof local>,to:ReturnType<typeof local>)=>{const dx=to.cx-from.cx,dy=to.cy-from.cy,rx=(from.right-from.left)/2,ry=(from.bottom-from.top)/2,scale=1/Math.max(Math.abs(dx)/rx,Math.abs(dy)/ry);return{x:from.cx+dx*scale,y:from.cy+dy*scale}}
  const ellipseBoundary=(from:ReturnType<typeof local>,to:ReturnType<typeof local>)=>{const dx=to.cx-from.cx,dy=to.cy-from.cy,rx=(from.right-from.left)/2,ry=(from.bottom-from.top)/2,scale=1/Math.sqrt((dx/rx)**2+(dy/ry)**2);return{x:from.cx+dx*scale,y:from.cy+dy*scale}}
  const hub=hubRef.current?local(hubRef.current.getBoundingClientRect()):undefined
  const hubLines=hub?items.map(rect=>{const item=local(rect),a=ellipseBoundary(hub,item),b=rectangleBoundary(item,hub!);return{x1:a.x,y1:a.y,x2:b.x,y2:b.y}}):[]
  let cycle:string|undefined
  if(diagram.kind==='cycle'&&items.length>1){const first=local(items[0]),last=local(items.at(-1)!),vertical=Math.abs(last.cy-first.cy)>Math.abs(last.cx-first.cx)
   cycle=vertical?`M ${last.right} ${last.cy} C ${host.width-3} ${last.cy}, ${host.width-3} ${first.cy}, ${first.right} ${first.cy}`:`M ${last.cx} ${last.bottom} C ${last.cx} ${host.height-3}, ${first.cx} ${host.height-3}, ${first.cx} ${first.bottom}`}
  setConnectors({width:host.width,height:host.height,hub:hubLines,cycle})
 };update();const observer=new ResizeObserver(update);observer.observe(body);return()=>observer.disconnect()},[diagram])
 return <figure className={`article-diagram article-diagram--${diagram.kind} article-diagram--items-${diagram.items.length}`} data-diagram-id={diagram.id}>
  <header><span>{diagram.status}</span><h3>{diagram.title}</h3></header>
  <div className="article-diagram-body" ref={bodyRef}>
   {diagram.kind==='hub'&&<><svg className="diagram-hub-lines" viewBox={`0 0 ${connectors.width} ${connectors.height}`} preserveAspectRatio="none" aria-hidden="true">{connectors.hub.map((line,index)=><line key={index} {...line}/>)}</svg><div className="diagram-hub" ref={hubRef}>{diagram.id==='P06'?'Handelndes Kind':diagram.id==='P13'?'Standort':diagram.id==='P16'?'Bildungsauftrag':'Zusammenhang'}</div></>}
   {diagram.items.map((item,index)=><div className="diagram-item-wrap" data-item-index={index} key={item.title}>
    <div className="diagram-item" ref={node=>{itemRefs.current[index]=node}}>{item.group&&<small>{item.group}</small>}<strong>{item.title}</strong>{item.detail&&<span>{item.detail}</span>}</div>
    {['flow','cycle','bridge','timeline'].includes(diagram.kind)&&index<diagram.items.length-1&&<Arrow/>}
   </div>)}
   {diagram.kind==='cycle'&&connectors.cycle&&<svg className="diagram-cycle-return" viewBox={`0 0 ${connectors.width} ${connectors.height}`} preserveAspectRatio="none" aria-label="Rückkopplung zum Ausgangspunkt"><defs><marker id={`cycle-arrow-${diagram.id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 2 1 L 9 5 L 2 9"/></marker></defs><path d={connectors.cycle} markerEnd={`url(#cycle-arrow-${diagram.id})`}/></svg>}
  </div>
  <figcaption>{diagram.caption}</figcaption>
 </figure>
}
