import './ReaderArtwork.css'
const artworks={
 concept:{alt:'Handgezeichneter Einblick in ein Bildungshaus: In der Mitte bauen Kind und Erwachsene am gemeinsamen Tisch. Küche, Atelier und Wege zu weiteren Häusern gehören zum selben Alltag.',style:'Tusche und Gouache'},
 fingerpaint:{alt:'Große und kleine Handabdrücke begegnen sich in einer unregelmäßigen Fingerfarben-Malerei.',style:'Fingerfarben'},
 kitchen:{alt:'Ein gezeichnetes Wimmelbild zeigt Küche und Mittagstisch: Ein Koch hört einem Kind zu, während andere Menschen vorbereiten, liefern und gemeinsam lernen.',style:'Wimmelbild'},
 continuity:{alt:'Eine einfache, krakelige Bleistiftskizze: Zwei Frauen zeigen einander ein aufgeschlagenes Heft, ein Kind greift danach.',style:'Bleistiftskizze'},
 participation:{alt:'In einer Scherenschnitt-Collage legt ein Kind ein eigenes Papierstück auf einen gemeinsamen Tisch. Erwachsene gestalten mit.',style:'Papiercollage'},
 place:{alt:'Ein aquarellierter Stadtplan zeigt ein Bildungshaus mit offenem Hof zwischen Wohnungen, Wegen und Orten des Alltags.',style:'Aquarell'},
 learning:{alt:'Auf kariertem Skizzenpapier erproben ein Kind und ein Erwachsener gemeinsam eine Brücke aus Bauklötzen. Frühere Versuche und Werkzeuge liegen daneben.',style:'Werkstattskizze'},
 media:{alt:'Eine Kohle- und Kreidezeichnung zeigt ein Kind und einen Erwachsenen beim Gestalten eines Schattentheaters. Ein Tablet liegt am Rand.',style:'Kohle und Kreide'},
 resources:{alt:'Ein zweifarbiger Linoldruck zeigt Hände, die ein gemeinsames Haus weiterbauen. Wege verbinden es mit anderen Häusern.',style:'Linoldruck'},
}
type ArtworkKey=keyof typeof artworks
export const readerArtworkMap:Record<string,ArtworkKey>={P01:'continuity',P02:'learning',P03:'resources',P04:'participation',P05:'fingerpaint',P06:'learning',P07:'place',P08:'resources',P09:'learning',P10:'kitchen',P11:'participation',P12:'continuity',P13:'place',P14:'fingerpaint',P15:'learning',P16:'resources',P17:'participation',P18:'media',whitepaper:'concept'}
export default function ReaderArtwork({id}:{id:string}){const key=readerArtworkMap[id];if(!key)return null;const art=artworks[key];return <figure className={`reader-artwork reader-artwork--${key}`} data-artwork={key}><img src={`${import.meta.env.BASE_URL}images/deep-dive-${key}-${key==='continuity'?'v2':'v1'}.png`} width="2172" height="724" fetchPriority="high" alt={art.alt}/></figure>}
