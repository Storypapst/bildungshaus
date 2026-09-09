import './PeopleMap.css'
import PilotJourney from './PilotJourney'
import SurveyFooter from './SurveyFooter'
import EditorialHero from './EditorialHero'
import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, Moon, Sun } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { ProblemGraph } from './ProblemGraph'
import { Economics } from './Economics'
import './IllustratedStory.css'
import './HeroV6.css'
import {LearningStory,KitchenStory,QualityCycle,SurveyInvitation} from './NarrativeSections'
const Reader=lazy(()=>import('./Reader'))
import rawContent from './content/content.json'
import type { Content } from './types'

const content=rawContent as Content
const image=(name:string)=>`${import.meta.env.BASE_URL}images/${name}`
const chapters=[['idee','Die Idee'],['problem','Zusammenhänge'],['ansatz','Unser Ansatz'],['module','Die Module'],['spielraum','Tragfähigkeit'],['pilot','Der Pilot'],['bibliothek','Zum Nachlesen']]
const moduleDetails:Record<string,string>={
 beziehungen:'Gemeinsam mit Familien gestalten wir den Übergang. Eine feste Bezugsperson begleitet; das Tempo orientiert sich am Kind. Teams reflektieren, wie Kontinuität auch bei Ausfällen möglich bleibt.',
 team:'Eine neue Kollegin weiß, wen sie fragen kann. Ein erfahrener Kollege hat Zeit, Wissen weiterzugeben. Kurze Reflexion und klare Zuständigkeiten machen aus einem Konzept einen gemeinsamen Alltag.',
 beteiligung:'Was entscheidet ein Kind selbst, wobei wird gemeinsam entschieden, und wo tragen Erwachsene Verantwortung? Diese Grenzen werden verständlich und im Alltag erkennbar. Rückmeldungen führen zu einer sichtbaren Antwort.',
 raeume:'Übersichtliche, veränderbare Räume laden zum Forschen ein. Rückzug und Begegnung haben gleichermaßen Platz. Materialien und Einbauten werden mit den Menschen erprobt, die sie jeden Tag benutzen.',
 sprache:'Unser Konzept sieht zweisprachigen Alltag durch verlässliche Bezugspersonen vor. Deutsch/Spanisch oder Deutsch/Englisch sind Optionen; die Entscheidung hängt von Familien und verfügbaren Fachkräften ab.',
 essen:'Ein gutes Mittagessen verbindet Ernährung, Mitbestimmung und ruhige Abläufe. Ein erstes Modul kann vom Speiseplan über Rückmeldungen bis zur Bestellung reichen. Eine eigene Großküche setzt es nicht voraus.',
 medien:'Eine Bildergeschichte selbst erzählen, über Werbung sprechen, gemeinsam Pausen vereinbaren: Medienbildung greift Erfahrungen der Kinder auf. Sie schafft eigene Gestaltungsmöglichkeiten und braucht keinen täglichen Bildschirm. Kinderwerkzeuge und die Software für das Team haben unterschiedliche Aufgaben.',
 werkzeuge:'Hilfreiche Werkzeuge entstehen aus einem konkreten Arbeitsproblem. Sie werden klein erprobt und dürfen wieder verschwinden, wenn sie keine Entlastung bringen. Fachliche Verantwortung bleibt bei Menschen.'
}
export default function App(){
 const root=useRef<HTMLDivElement>(null)
 const [hash,setHash]=useState(location.hash),[active,setActive]=useState('idee'),[selected,setSelected]=useState('kind')
 const [dark,setDark]=useState(false)
 const mounted=useRef(false),explicitSection=useRef(false)
 const readerOrigin=useRef<{hash:string;y:number|null;fromGraph:boolean}>({hash:'#bibliothek',y:null,fromGraph:false}),previousHash=useRef(location.hash),restore=useRef(false)
 const [readerContext,setReaderContext]=useState({hash:'#bibliothek',fromGraph:false})
 const isReader=hash.startsWith('#lesen/')
 useEffect(()=>{const change=()=>{const next=location.hash;if(next.startsWith('#lesen/')&&!previousHash.current.startsWith('#lesen/')){const graph=document.getElementById('problem');readerOrigin.current={hash:previousHash.current||'#idee',y:window.scrollY,fromGraph:!!graph&&graph.getBoundingClientRect().top<200&&graph.getBoundingClientRect().bottom>100};setReaderContext({hash:readerOrigin.current.hash,fromGraph:readerOrigin.current.fromGraph})}if(!next.startsWith('#lesen/')&&previousHash.current.startsWith('#lesen/'))restore.current=!explicitSection.current&&next===readerOrigin.current.hash;previousHash.current=next;setHash(next);if(next.startsWith('#lesen/'))window.scrollTo(0,0)};addEventListener('hashchange',change);return()=>removeEventListener('hashchange',change)},[])
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark)},[dark])
 // Restore after the presentation becomes measurable, before the browser paints it.
 // Deferring this to rAF briefly exposes the top of the page and lets a second
 // interaction race the pending restoration (including a direct-reader return).
 useLayoutEffect(()=>{if(isReader)return;explicitSection.current=false;if(restore.current&&readerOrigin.current.y!==null){restore.current=false;window.scrollTo({top:readerOrigin.current.y,behavior:'instant'})}else document.getElementById(hash.slice(1))?.scrollIntoView({behavior:'instant'})},[hash,isReader])
 useEffect(()=>{if(!root.current||mounted.current)return;mounted.current=true;const script=document.createElement('script');script.src=`${import.meta.env.BASE_URL}engine/scrollcraft.js`;script.onload=()=>{if(root.current)window.ScrollCraft.mount(root.current)};document.body.append(script)},[])
 useEffect(()=>{if(isReader)return;const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:'-15% 0px -55% 0px'});root.current?.querySelectorAll('section[id]').forEach(e=>observer.observe(e));return()=>observer.disconnect()},[isReader])


 useEffect(()=>{
  if(isReader)return
  let frame=0
  const update=()=>{
   frame=0
   const section=document.getElementById('ansatz')?.getBoundingClientRect()
   root.current?.querySelectorAll<HTMLElement>('.chapter-nav a').forEach(link=>{
    const rect=link.getBoundingClientRect(),center=rect.top+rect.height/2
    link.dataset.overDark=String(!!section&&center>=section.top&&center<=section.bottom)
   })
  }
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule)
  const observer=new ResizeObserver(schedule)
  if(root.current)observer.observe(root.current)
  schedule()
  return()=>{removeEventListener('scroll',schedule);removeEventListener('resize',schedule);observer.disconnect();cancelAnimationFrame(frame)}
 },[isReader])

 return <>
 <a className="skip-link" href={isReader?'#leseinhalt':'#idee'}>Zum Inhalt</a>
 <header className="masthead"><a href="#idee" className="wordmark">bildungshaus weWeit<span className="brand-dot" aria-hidden="true"/></a><nav aria-label="Hauptnavigation"><a href="#lesen/whitepaper">Konzept</a><a href="#bibliothek" onClick={()=>{explicitSection.current=isReader}}>Zum Nachlesen</a><Button variant="ghost" size="icon" aria-label={dark?'Helles Design':'Dunkles Design'} onClick={()=>setDark(!dark)}>{dark?<Sun/>:<Moon/>}</Button></nav></header>
 {isReader&&<div id="leseinhalt"><Suspense fallback={<main className="reader" aria-busy="true">Dokument wird geladen …</main>}><Reader id={hash.slice(7)} returnHash={readerContext.hash} fromGraph={readerContext.fromGraph} selected={selected}/></Suspense></div>}
 <div ref={root} hidden={isReader}>
 <nav className="chapter-nav" aria-label="Kapitel">{chapters.map(([id,title])=><a key={id} href={`#${id}`} className={cn(active===id&&'active')} aria-current={active===id?'location':undefined}><span className="chapter-dot"/><span className="chapter-label">{title}</span></a>)}</nav>
 <main>
 <EditorialHero/>
 <section className="everyday section-pad" data-sc-act="flow"><div className="page-width everyday-layout"><div className="everyday-intro"><h2>Qualität beginnt<br/>bei der Betreuung.</h2><div className="everyday-copy"><p>Ein Kind will etwas zeigen. Die Fachkraft ist schon wieder für eine andere Gruppe zuständig. Ein neues Teammitglied sucht Orientierung. Solche Situationen führen zu unserer Frage: Wie muss Betreuung gestaltet sein, damit Beziehung, Beteiligung und gemeinsames Lernen im Alltag gelingen?</p><p>Unsere These: Pädagogische Klarheit, verlässliche Beziehungen und echte Gestaltungsspielräume verbessern die Bedingungen für Kinder und Erwachsene. Hohe Fluktuation und Ausfälle können Folgen belastender Bedingungen sein. Sie können diese anschließend weiter verschärfen.</p><p>Geld setzt reale Grenzen. Zugleich wollen wir verstehen, warum Betreuung unter vergleichbaren Bedingungen unterschiedlich gut gelingt. Wir vergleichen konkrete Praxis, statt jede Schwierigkeit vorschnell auf einen einzigen Grund zurückzuführen.</p></div></div><ol className="thesis-chain" data-sc-in data-sc-stagger="60" aria-label="Unsere zu prüfende Wirkungskette"><li><img src={image('zusammenarbeit.jpg')} width="1254" height="1254" loading="lazy" alt="Ein Kind und zwei Erwachsene bauen gemeinsam mit schiefen Klötzen."/><span>Betreuung und Zusammenarbeit gestalten</span></li><li><img src={image('mitwirkung.jpg')} width="1254" height="1254" loading="lazy" alt="Eine erwachsene Person hört einem Kind zu, das seine Zeichnung zeigt."/><span>Beziehung und Mitwirkung ermöglichen</span></li><li><img src={image('vertrauen.jpg')} width="1254" height="1254" loading="lazy" alt="Ein Kind und eine vertraute Person gehen Hand in Hand."/><span>Kontinuität und Vertrauen stärken</span></li><li><img src={image('qualitaet.jpg')} width="1254" height="1254" loading="lazy" alt="Kind und Erwachsene kümmern sich gemeinsam um eine kleine Pflanze."/><span>Qualität und Tragfähigkeit gemeinsam prüfen</span></li></ol><p className="mechanism-note">Eine zu prüfende Wirkungskette. Instabilität kann auf Arbeitsbedingungen und Betreuung zurückwirken. <a href="#lesen/P12">Ausfälle und Wechsel genauer unterscheiden.</a></p></div></section>
 <section id="problem" data-sc-act="flow" className="problem-section section-pad"><div className="page-width"><div className="section-heading"><div><h2>Ein Kind.<br/>Viele Beziehungen.</h2></div><p>Wenn jemand geht, müssen andere Wissen weitergeben und Beziehungen neu aufbauen. Wähle eine Perspektive: Was bedeutet das für ein Kind, das Team oder mehrere Häuser eines Trägers?</p></div><ProblemGraph content={content} selected={selected} onSelect={setSelected}/><p className="graph-note">Die Linien zeigen, wer zusammenarbeitet, was Studien beobachten und was wir ausprobieren wollen. Nicht jede Verbindung bedeutet, dass das eine das andere verursacht.</p></div></section>
 <LearningStory content={content}/>
 <KitchenStory/>
 <section id="module" data-sc-act="flow" className="modules section-pad page-width"><div className="module-aside"><p className="eyebrow">Pädagogik und Entwicklung</p><h2>Mit der Kita anfangen.<br/>Weiter denken.</h2><p>Reggio inspiriert uns: Kinder stellen Fragen, gestalten ihre Umgebung und lernen mit anderen. Verlässliche Beziehungen geben ihnen dafür Sicherheit. Unser Lab erweitert diesen Blick auf die ganze Organisation: Auch Erwachsene brauchen Zeit zum Forschen, Mitentscheiden und Lernen.</p><p>Die Module gehören deshalb zusammen. Ein anderes Raumkonzept verändert die Zusammenarbeit. Mitbestimmung verändert das Essen. Gute Einarbeitung hilft, diese Veränderungen im Alltag zu tragen.</p><div className="education-path" aria-label="Unsere langfristige Perspektive"><span>Krippe &amp; Kita<small>Hier beginnen wir</small></span><ArrowRight aria-hidden="true"/><span>Hort &amp; Schule<small>Darauf wollen wir aufbauen</small></span></div><p>Wie Kinder als Erwachsene leben werden, können wir nicht zuverlässig vorhersagen. Wir wollen deshalb Orte schaffen, an denen Menschen Orientierung finden, Veränderungen erproben und Erfahrungen mit anderen teilen.</p><a className="module-concept-link" href="#lesen/P06">Was wir aus den pädagogischen Ansätzen verbinden <ArrowUpRight aria-hidden="true"/></a></div><div className="module-details"><Accordion defaultValue={['beziehungen']} className="module-accordion">{content.modules.map(m=><AccordionItem value={m.id} key={m.id}><AccordionTrigger>{m.title}</AccordionTrigger><AccordionContent><p>{m.body}</p><p>{moduleDetails[m.id]}</p></AccordionContent></AccordionItem>)}</Accordion><img src={image('wachsen-punk.jpg')} width="1254" height="1254" loading="lazy" alt="Wilde Buntstiftkritzelei zweier Pflanzen, die in verschiedene Richtungen wachsen" className="module-growth-art"/></div></section>
 <section id="spielraum" data-sc-act="flow" className="section-pad economic-section"><div className="page-width"><div className="economic-heading"><h2>Was frei wird,<br/>soll Qualität stärken.</h2><p>Schon kleine Spielräume können über mehrere Häuser viel ausmachen. Rechne selbst.</p></div><div className="economic-calculator"><Badge variant="outline">Rechenbeispiel · keine gemessene Einsparung</Badge><Economics/></div><QualityCycle/><Separator/><div className="business-model"><h3>Wie die gemeinsame Arbeit finanziert werden kann</h3><p>Begleitung bei der Einführung, Qualifizierung und erprobte Module mit laufender Weiterentwicklung. Umfang und Preise entstehen mit Pilotpartnern. Wiederkehrende Erlöse setzen nachgewiesenen Nutzen und echte Zahlungsbereitschaft voraus.</p><a href="#lesen/P08">Finanzierung genauer betrachten <ArrowUpRight aria-hidden="true"/></a></div></div></section>
 <section id="pilot" data-sc-act="flow" className="pilot section-pad page-width"><div className="pilot-header"><div><p className="eyebrow">Roadmap</p><h2>Mit einem Haus lernen.<br/>Den nächsten Schritt prüfen.</h2></div><p>Wir beginnen mit einem Ablauf in einer Kita. Gemeinsam vereinbaren wir, wer mitarbeitet, wie viel Zeit zur Verfügung steht und woran wir eine Verbesserung erkennen.</p></div><PilotJourney/><SurveyInvitation/></section>
 <section data-sc-act="flow" className="people-section section-pad"><div className="page-width"><p className="eyebrow">Vom eigenen Haus zu weiteren Einrichtungen</p><div className="people-grid"><div><h2>Ein eigener Ort.<br/>Offen für andere.</h2><p>Unsere Vision ist ein durchgängiger Bildungsweg: von der Krippe über die Kita und den Hort bis zur Schule. Reggio-inspirierte Pädagogik, verlässliche Beziehungen, teiloffene Räume und zweisprachiger Alltag bilden den Zusammenhang. Der erste erprobte Kita-Baustein schafft die Grundlage für weitere Schritte.</p><figure className="people-learning-map"><img src={`${import.meta.env.BASE_URL}images/bildungswege-landkarte-v2.png`} width="1254" height="1254" loading="lazy" alt="Kugelschreiber-Landkarte: Jeder Ort ist selbst ein Lernort. Blaue Kreispfeile an Kita, Krippe, Hort und Schule zeigen lokale Versuche. Orange Pfeile in beide Richtungen und kleine Erfahrungszettel verbinden die Häuser: Jedes gibt Wissen weiter und lernt von den anderen."/><figcaption>Jedes Haus erprobt selbst. Was es dabei lernt, hilft anderen Häusern – deren Erfahrungen fließen wieder zurück.</figcaption></figure></div><div className="people-practice"><dl className="team-list"><div><dt>Praxis</dt><dd>Ein gemeinnütziger Träger erprobt das Konzept langfristig in eigenen Einrichtungen als Reallabore. Ein erster Partnerpilot kann den Einstieg vorbereiten.</dd></div><div><dt>Entwicklung</dt><dd>Das Lab verbindet Fachwissen, Werkzeuge, Qualifizierung und Begleitung.</dd></div><div><dt>Weitergabe</dt><dd>Freie Träger, öffentliche Einrichtungen und Eigenbetriebe sind mögliche spätere Nutzer erprobter Module. Eine Zusammenarbeit ist damit noch nicht vereinbart.</dd></div></dl><a href="#lesen/original">Wie Pädagogik, Räume und Bildungsweg zusammengehören <ArrowUpRight aria-hidden="true"/></a></div></div><p className="structure-note">Für den Aufbau sind ein gemeinnütziger Träger, ein wirtschaftliches Lab und perspektivisch eine Stiftung vorgesehen. Die konkrete Struktur und passende Partnerschaften werden mit den nächsten Entwicklungsschritten geklärt.</p><svg className="people-crayon-divider" viewBox="0 0 1000 52" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M8 28 L31 25 49 30 72 26 98 29 121 23 148 27 175 25 199 30 226 27 252 31 279 25 304 29 330 24 357 27 383 23 410 28 438 25 465 30 488 24 516 28 539 22 564 27 589 25 612 31 638 26 664 29 688 23 714 27 739 25 766 30 792 24 817 28 842 23 867 27 892 24 917 29 943 25 969 28 990 24"/><path d="M17 31 L45 28 76 31 110 27 146 30 183 28 219 32 254 29 288 31 323 27 359 30 395 26 432 30 471 28 504 31 544 26 578 30 616 28 652 32 687 27 724 30 762 28 799 31 834 26 871 30 909 27 949 31 983 28"/><path d="M449 29 C457 28 465 21 467 15 C471 4 483 7 482 17 C481 27 466 35 459 31 C454 26 468 24 486 28 L514 26"/></svg></div></section>
 <section id="bibliothek" data-sc-act="flow" className="library section-pad page-width"><div className="section-heading"><div><p className="eyebrow">Konzept und Hintergründe</p><h2>Warum wir das<br/>so angehen.</h2></div><a className={buttonVariants({variant:'secondary',size:'lg'})} href="#lesen/whitepaper"><BookOpen data-icon="inline-start"/>Das Konzept</a></div><figure className="library-panorama"><img src={image('library-lab-wide-v1.png')} width="2172" height="724" loading="lazy" alt="Schematische Kritzelei: Ein kleines Lab erprobt und verbessert eine Idee. Gezeichnete Pfeile tragen die Erfahrungen zu weiteren Bildungshäusern; ein Rückweg bringt deren Erfahrungen wieder ins Lab."/></figure><div className="library-feature"><a href="#lesen/summary">Konzept in Kürze <ArrowUpRight aria-hidden="true"/></a><span>Der Überblick für ein erstes Gespräch.</span></div><div className="paper-list" data-sc-in data-sc-stagger="60">{content.papers.map(p=><a href={`#lesen/${p.id}`} key={p.id}><span className="paper-id">{p.id}</span><div><h3>{p.title}</h3><p>{p.summary}</p></div><ArrowUpRight aria-hidden="true"/></a>)}</div></section>
 <SurveyFooter/>
 </main></div></>
}
