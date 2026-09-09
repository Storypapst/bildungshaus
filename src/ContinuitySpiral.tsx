import './ContinuitySpiral.css'
const steps=[
 ['Eine vertraute Person geht','Beziehungen, Erfahrung und Absprachen fehlen im Alltag.'],
 ['Einarbeitung braucht Begleitung','Das verbleibende Team übernimmt zusätzlich und arbeitet neue Menschen ein.'],
 ['Zeit und Aufmerksamkeit fehlen','Für Kinder, Austausch und gutes Einüben bleibt weniger Raum.'],
 ['Wirksamkeit wird schwerer erlebbar','Menschen können ihrem eigenen Anspruch seltener gerecht werden.'],
 ['Motivation und Bindung können sinken','Anhaltende Überlastung kann Frust und den Wunsch zu gehen verstärken.'],
 ['Weitere Menschen gehen','Die Arbeit verteilt sich auf noch weniger Schultern. Die nächste Einarbeitung beginnt.'],
]
function Arrow(){return <svg className="spiral-arrow" viewBox="0 0 50 24" aria-hidden="true"><path d="M2 13 Q14 9 24 12 T44 11 M34 3 L45 11 L35 21 M4 15 Q20 11 42 13"/></svg>}
export default function ContinuitySpiral(){return <figure className="reader-visual continuity-spiral" data-reader-visual="continuity"><figcaption>Wenn ein Wechsel den nächsten begünstigt</figcaption><p className="spiral-intro">Eine mögliche Abwärtsspirale: Nicht das Können der Menschen wird plötzlich kleiner. Die Bedingungen, es einzusetzen und weiterzugeben, werden schwieriger.</p>
 <ol className="spiral-chain" aria-label="Mögliche Rückkopplung zwischen Personalwechsel und Belastung">{steps.map(([title,text],i)=><li key={title}><span className="spiral-number">{i+1}</span><h3>{title}</h3><p>{text}</p>{i<5&&<Arrow/>}</li>)}</ol>
 <div className="spiral-return"><svg viewBox="0 0 90 42" aria-hidden="true"><path d="M85 5 Q91 30 64 31 L24 33 Q3 31 9 12 M2 20 L9 10 L18 21 M24 36 Q57 33 71 34"/></svg><p><strong>Zurück zur Einarbeitung – mit weniger Reserven.</strong>Wenn neue Abgänge schneller kommen, als das Team Stabilität gewinnt, kann sich die Belastung verstärken.</p></div>
 <div className="spiral-consequences"><p className="spiral-branch-label">↓ Wenn Personal dauerhaft fehlt, kann daraus auch werden:</p><ol aria-label="Mögliche Folgen für den Betrieb"><li><h3>Weniger betreubare Kinder</h3><p>Gruppen oder Öffnungszeiten müssen eingeschränkt werden. Familien brauchen andere Lösungen.</p><Arrow/></li><li><h3>Weniger wirtschaftlicher Spielraum</h3><p>Geringere Belegung kann Einnahmen mindern, während viele Kosten weiterlaufen.</p><Arrow/></li><li><h3>Der Betrieb wird gefährdet</h3><p>Bleibt eine tragfähige Lösung aus, kann im äußersten Fall eine Schließung folgen.</p></li></ol></div>
 <p className="spiral-exit"><strong>Hier wollen wir ansetzen:</strong> Begleitung und Lernzeit schützen, Mitsprache ermöglichen und Erfahrungswissen gemeinsam erhalten – bevor der nächste Wechsel alles wieder auf Anfang setzt.</p>
 <p className="reader-visual-note">Schematische Wirkungsannahme, keine zwangsläufige Entwicklung. Personalgewinnung, Unterstützung durch den Träger, Finanzierung und örtliche Nachfrage können den Verlauf verändern. Die Grafik beziffert kein Risiko und belegt noch keine Wirkung unseres Ansatzes.</p></figure>}
