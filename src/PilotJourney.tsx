import { useEffect, useRef, useState } from 'react'
import './PilotJourney.css'

const steps = [
  { title: 'Bedarf klären', note: 'Wo hakt es?', body: 'Eine neue Kollegin kommt ins Haus. Sie möchte mitgestalten, kennt aber die Absprachen noch nicht. Das Team hilft zwischen Tür und Angel. Gemeinsam schauen wir: Was braucht sie, und was brauchen die Menschen, die sie begleiten?', detail: 'Neue Kollegin, erfahrene Fachkraft und Leitung kommen zu Wort.' },
  { title: 'Ein Modul auswählen', note: 'Gut ankommen', body: 'Wir nehmen uns die ersten Wochen der Einarbeitung vor. Eine feste Ansprechperson, Zeit zum gemeinsamen Ausprobieren und ein kleiner Wegweiser zu den wichtigsten Absprachen bilden den Anfang.', detail: 'Ein begrenzter Ablauf, den das Team selbst mitgestaltet.' },
  { title: 'Ausgangslage erfassen', note: 'Erst hinschauen', body: 'Welche Fragen tauchen immer wieder auf? Wie oft muss jemand seine Arbeit unterbrechen? Wann fühlt sich die neue Kollegin sicher genug, selbst zu entscheiden? Wir halten den Ausgangspunkt fest, bevor wir etwas verändern.', detail: 'Zeitaufwand, Orientierung und Rückmeldungen gemeinsam festhalten.' },
  { title: 'Im Alltag testen', note: 'Zusammen probieren', body: 'Die Kollegin probiert den Wegweiser im echten Alltag aus. Was fehlt, wird ergänzt. Was niemand braucht, fliegt raus. In kurzen Gesprächen schaut das Team, ob die Hilfe entlastet oder neue Arbeit macht.', detail: 'Kleine Änderungen. Geschützte Lernzeit. Auch aufhören dürfen.' },
  { title: 'Gemeinsam entscheiden', note: 'Was hilft, bleibt', body: 'Findet die Kollegin sich besser zurecht? Kann sie mitentscheiden? Hat die begleitende Fachkraft tatsächlich mehr Zeit? Erst wenn die Beteiligten einen Nutzen sehen, arbeiten wir weiter. Ein zweites Haus prüft dann, was sich übertragen lässt und was es anders braucht.', detail: 'Erfahrungen weitergeben — und am nächsten Ort erneut dazulernen.' },
]

// Deliberately uneven pen strokes: each little drawing follows the current note.
const drawings = [
  <><path d="M21 29 Q13 12 29 10 Q45 10 41 28 Q36 39 23 30 M15 64 Q12 39 28 38 Q42 36 47 61 M57 30 Q47 17 61 15 Q77 12 77 28 Q75 39 60 34 M52 61 Q48 40 65 41 L83 65"/><path className="doodle-accent" d="M45 15 Q41 2 51 4 Q62 6 53 17 L50 21 M50 26 l1 1"/></>,
  <><path d="M21 69 L18 12 L76 9 L79 70 Z M29 25 l8 -1 M45 23 l20 -1 M29 40 l8 1 M45 38 l17 -1 M29 55 l7 -1 M45 53 l22 1"/><path className="doodle-accent" d="M12 29 l9 8 17 -22 M62 61 l9 7 15 -21"/></>,
  <><path d="M29 12 Q5 17 11 43 Q15 63 38 61 Q62 60 62 37 Q63 13 29 12 M34 20 l-1 20 15 6 M14 9 l-6 -5 M60 12 l7 -8 M30 5 l12 -1"/><path className="doodle-accent" d="M67 43 l18 -2 -1 31 -24 1 1 -16 M68 53 l9 -1 M68 61 l8 1"/></>,
  <><path d="M14 40 Q11 10 41 9 Q67 9 69 28 M58 17 l12 14 12 -14 M79 47 Q75 77 48 73 Q22 72 23 57 M12 67 l10 -13 12 12"/><path className="doodle-accent" d="M35 42 l9 9 17 -23"/></>,
  <><path d="M8 37 L25 22 L44 38 M12 35 l1 30 27 1 1 -29 M21 64 l1 -16 10 1 0 16 M58 43 l14 -12 15 14 M61 43 l1 25 24 -2 0 -21"/><path className="doodle-accent" d="M36 17 Q56 4 76 20 M65 8 l12 12 -14 2 M43 50 l13 3 M51 46 l6 7 -7 5"/></>,
]

export default function PilotJourney() {
  const journey = useRef<HTMLDivElement>(null)
  const artwork = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const container = journey.current
      if (!container || !container.getClientRects().length) return
      const mobile = matchMedia('(max-width: 760px)').matches
      const bottom = artwork.current?.getBoundingClientRect().bottom ?? 0
      const line = mobile ? bottom + Math.max(60, (innerHeight - bottom) * .35) : innerHeight * .55
      const notes = [...container.querySelectorAll<HTMLElement>('.pilot-note')]
      let closest = 0, distance = Infinity
      notes.forEach((note, i) => {
        const r = note.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - line)
        if (d < distance) { closest = i; distance = d }
      })
      setActive(closest)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    addEventListener('scroll', schedule, { passive: true })
    addEventListener('resize', schedule)
    update()
    return () => { cancelAnimationFrame(frame); removeEventListener('scroll', schedule); removeEventListener('resize', schedule) }
  }, [])

  return <div className="pilot-journey" ref={journey}>
    <figure className="pilot-pinned-art" ref={artwork}>
      <div className="pilot-house-paper">
        <img src={`${import.meta.env.BASE_URL}images/naechste-schritte-bright-v2.png`} width="1520" height="1035" loading="lazy" alt="Ein Kind und zwei Erwachsene gehen auf einem krummen Weg gemeinsam zu einem kleinen Haus."/>
        <div className="pilot-doodles" aria-hidden="true">
          {steps.map((step, i) => <div key={step.title} className="pilot-doodle" data-active={active === i}>
            <svg viewBox="0 0 96 84" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round">{drawings[i]}</svg>
            <span>{step.note}</span>
          </div>)}
        </div>
      </div>
      <figcaption>Ein Beispiel: neu im Team.</figcaption>
      <div className="pilot-progress" aria-hidden="true">{steps.map((step,i)=><span key={step.title} data-active={i===active}/>)}</div>
    </figure>
    <ol className="pilot-story-notes">
      {steps.map((step,i)=><li key={step.title} className="pilot-note" data-active={active===i}>
        <article className="pilot-note-paper">
          <span className="pilot-note-number" aria-hidden="true">{i+1} / {steps.length}</span>
          <h3>{step.title}</h3><p>{step.body}</p><p className="pilot-note-detail">{step.detail}</p>
        </article>
      </li>)}
    </ol>
  </div>
}
