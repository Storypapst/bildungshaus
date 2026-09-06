import { useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { Field, FieldGroup, FieldLabel, FieldDescription } from '@/components/ui/field'
export function Economics(){
 const [houses,setHouses]=useState(8),[kids,setKids]=useState(80),[rate,setRate]=useState(5)
 const amount=houses*kids*4269.94*rate/100
 const money=new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR',maximumFractionDigits:0})
 return <div className="economics-layout">
 <FieldGroup>
  <Field><FieldLabel>Einrichtungen: {houses}</FieldLabel><Slider aria-label="Anzahl Einrichtungen" value={[houses]} onValueChange={v=>setHouses(Array.isArray(v)?v[0]:v)} min={1} max={30} step={1}/></Field>
  <Field><FieldLabel>Kinder je Einrichtung: {kids}</FieldLabel><Slider aria-label="Kinder je Einrichtung" value={[kids]} onValueChange={v=>setKids(Array.isArray(v)?v[0]:v)} min={20} max={200} step={10}/></Field>
  <Field><FieldLabel>Angenommener frei werdender Anteil: {rate} %</FieldLabel><Slider aria-label="Angenommener frei werdender Anteil" value={[rate]} onValueChange={v=>setRate(Array.isArray(v)?v[0]:v)} min={0} max={10} step={0.5}/><FieldDescription>Eine frei gewählte Annahme, keine gemessene Einsparung.</FieldDescription></Field>
 </FieldGroup>
 <div className="economics-result"><span>Möglicher Bruttospielraum pro Jahr</span><output aria-live="polite">{money.format(amount)}</output><p>{houses} × {kids} × 4.269,94 € × {rate} %</p><p>Grundlage: Berliner RV-Tag-Sachkosten für Ganztag/Teilzeit, je Kind und Jahr ab August 2026. Einschließlich Verpflegung.</p><p>Davon gehen zusätzliche Betriebs-, Einführungs- und Begleitkosten ab. Ob Mittel tatsächlich frei und für Qualität eingesetzt werden können, prüft der Pilot.</p><a href="#lesen/P08">Berechnungsgrundlage und Grenzen</a></div>
 </div>
}
