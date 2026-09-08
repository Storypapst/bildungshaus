import { useEffect, useRef, useState } from 'react'

/** Cancel and resume from the visible number when a slider moves again. */
export function useAnimatedAmount(target: number) {
 const [display,setDisplay]=useState(target)
 const current=useRef(target)
 useEffect(()=>{
  const preference=matchMedia('(prefers-reduced-motion: reduce)')
  let frame=0
  const commit=(value:number)=>{current.current=value;setDisplay(value)}
  const onPreference=()=>{if(preference.matches){cancelAnimationFrame(frame);commit(target)}}
  preference.addEventListener('change',onPreference)
  if(preference.matches) commit(target)
  else {
   const from=current.current,start=performance.now()
   const tick=(now:number)=>{
    const progress=Math.min(1,(now-start)/300)
    commit(from+(target-from)*(1-Math.pow(1-progress,3)))
    if(progress<1) frame=requestAnimationFrame(tick)
   }
   frame=requestAnimationFrame(tick)
  }
  return ()=>{cancelAnimationFrame(frame);preference.removeEventListener('change',onPreference)}
 },[target])
 return display
}
