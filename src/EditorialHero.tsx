import {ArrowRight} from 'lucide-react'
import {buttonVariants} from './components/ui/button'
import '@fontsource/kalam/latin-400.css'
import './EditorialHero.css'
export default function EditorialHero(){return <section id="idee" className="editorial-hero">
 <h1>Was Kinder stärkt,<br/><span>stärkt auch Erwachsene.</span></h1>
 <div className="editorial-art"><picture><source media="(max-width:700px)" srcSet={`${import.meta.env.BASE_URL}images/hero-collage-mobile-v7.png`}/><img src={`${import.meta.env.BASE_URL}images/hero-collage-desktop-v7.png`} width="1536" height="1024" fetchPriority="high" alt="Kinder und Erwachsene tragen gemeinsam einen langen blauen Ast auf einem schiefen Weg zum Bildungshaus. Eine bunte Kreidezeichnung mit aufgeklebtem Zettel."/></picture><blockquote><p>Wenn du schnell gehen willst,<br/>geh alleine.</p><p>Wenn du weit gehen willst,<br/>geh gemeinsam.</p></blockquote><a className="editorial-source" href={`${import.meta.env.BASE_URL}#lesen/quellen`}>Oft als afrikanisches Sprichwort überliefert</a></div>
 <div className="editorial-copy"><p>Verlässliche Beziehungen. Etwas selbst entscheiden. Erleben, dass der eigene Beitrag zählt. Das brauchen Kinder, Fachkräfte und Eltern.</p><p>Im Bildungshaus weWeit gestalten wir den Alltag gemeinsam: ausprobieren, Rückmeldung geben und verändern, was nicht funktioniert.</p><a className={buttonVariants({variant:'secondary',size:'lg'})} href={`${import.meta.env.BASE_URL}#problem`}>Die Idee entdecken <ArrowRight aria-hidden="true"/></a><small>Wir beginnen mit der Kita.<br/>Und denken Krippe, Hort und Schule mit.</small></div>
 </section>}
