/* Bildungshaus weWeit, demo v3. Built by build.py from web/story.js and web/app.js. */
(function(){
"use strict";
/* story.js: page content for the stations, close-ups, phone mocks and image labels.
   All German text comes from texte_v4.md (sections 2, 5, 6, 8, 9). build.py concatenates
   this file with app.js into site/app.js (one IIFE, no inline script on the page).
   Anchors are lists: the first one present in the render wins, missing anchors are skipped.
   Images are logical names; build.py maps them to the newest render (e.g. halle_745_fenster
   falls back to halle_745_oberlicht, halle_915 to halle_800). */

const HERO_LABELS = [
  {a:['eingang', 'kita_entrance'], t:'Eingang an der Ecke'},
  {a:['hochbeete', 'beete'], t:'Hochbeete'},
  {a:['dach', 'kita_roof'], t:'Gründach mit Solar'},
  {a:['schule'], t:'Schule im Obergeschoss'},
  {a:['lab'], t:'Lab'}
];

/* Fach und Cube figure: numbered dots on the close-up, legend below. */
const FACH_FIG = {
  img:['fachwand', 'abholung_faecher'],
  alt:'Das Fach: unten zum Greifen, oben zum Sehen',
  items:[
    {a:['fach_haken'], t:'Haken'},
    {a:['fach_bank'], t:'Sitzbank'},
    {a:['fach_schuh'], t:'Schuhfach'},
    {a:['fach_schrank'], t:'Schränkchen'},
    {a:['fach_mal'], t:'Fach für Gemaltes'},
    {a:['fach_cube', 'mila_cube'], t:'Platz für den Cube'},
    {a:['planwuerfel_tag', 'planwuerfel'], t:'Planwürfel: Kleine sehen ihren Tag'},
    {a:['planwuerfel_woche'], t:'Planwürfel: Große die Woche'},
    {a:['frage'], t:'Nach dem Mittag noch ein Fragezeichen'},
    {a:['gebaerden_cube'], t:'Gebärden-Cube, außen wie die anderen'},
    {a:['mila_fach'], t:'Milas Fach', only:'abholung_faecher'}
  ]
};

const STATIONS = [
 {id:'luft', room:'halle_745', time:'7:45', ort:'Halle', label:'Frische Luft', title:'Frische Luft, bevor alle da sind',
  mila:'Papa Jonas bringt Mila. In der Halle gehen gerade auf beiden Seiten die Fenster weit auf, ein kalter Luftzug zieht durch. Nach vier Minuten schließen sie wieder. Mila hängt ihre Jacke auf und nimmt ihren Fuchs-Cube aus dem Fach.',
  idee:'Querlüften: Fenster auf gegenüberliegenden Seiten gehen gleichzeitig weit auf, von Antrieben bewegt. Das Haus passt die Zeiten ab, etwa wenn die Gruppe draußen ist oder isst. Wie lange ein Raum für einen vollen Luftwechsel braucht, wird einmal gemessen. Danach kümmert sich niemand mehr darum.',
  bisher:'Gelüftet wird, wenn jemand daran denkt, und ein gekipptes Fenster tauscht kaum Luft aus.',
  unsere:'Das selbstgebaute CO₂-Kästchen gibt das Signal, die Fenster öffnen weit und schließen von selbst.',
  nutzen:['Frische Luft, ohne dass der Morgenkreis unterbrochen wird.', 'Ein Gedanke weniger im vollen Vormittag.', 'Die Ampel in der Halle zeigt, dass gelüftet wird.', 'Messbar, ob Infekttage sinken und was Heizung kostet.'],
  varianten:[
   ['Krippe 1–3', 'Lüften, wenn die Gruppe isst oder draußen ist. Kein Zug am Spielteppich.'],
   ['Kita 3–6', 'Kinder dürfen an der Kurbel das Lüften auslösen, wenn das Kästchen Gelb zeigt.'],
   ['Infektwoche', 'Das Haus lüftet öfter. Das liest es aus dem öffentlichen Wochenbericht des Landesamts.'],
   ['So baut man das', 'Im Neubau gibt es Fenster mit eingebauten Antrieben. Bestehende Fenster lassen sich mit Kettenantrieben nachrüsten, die selbst schließen, verriegeln und einen Klemmschutz haben.'],
   ['Raumplan', 'Im Neubau bekommt jeder Gruppenraum Fenster auf zwei Seiten. Im Bestand reicht oft ein Fenster und die offene Tür zu einem Raum mit Fenstern gegenüber.']],
  daten:'CO₂-Wert je Raum, Fensterstellung, Außentemperatur. Keine Personendaten, alles im Haus. Grenzwerte setzt die Leitung nach den Leitwerten des Umweltbundesamts, Zeiten die Lernbegleitung pro Raum.',
  annahme:'Automatisches Querlüften hält das CO₂ im Mittel unter 1.000 ppm und senkt die Infekttage der Gruppe. Messen: CO₂-Verlauf je Raum, Krankheitstage von Gruppe und Team gegen Vorjahr und Vergleichsgruppe, Heizenergie.',
  hots:[
   {a:['fenster1', 'ober1'], l:'Fenster', d:'luft', step:1, hid:['fenster', 'oberlicht']},
   {a:['co2'], l:'CO₂-Kästchen', d:'luft', step:0, hid:['co2'], side:'left'},
   {a:['obelisk_top'], l:'Obelisk', note:'Um acht sitzen hier alle im Kreis. Scroll weiter.', hid:['obelisk']}],
  bubbles:[{a:['mila_head'], t:'Da kommt Wind!'}, {a:['jonas_head'], t:'Gut zum Wachwerden.'}],
  xray:{hub:[.13, .2], items:[
   {n:1, a:['co2'], dir:'in', t:'Das selbstgebaute Kästchen misst CO₂ und meldet es dem Rechner im Haus.'},
   {n:2, hub:true, t:'Der Rechner wählt den Zeitpunkt und öffnet die Fenster auf beiden Seiten.'},
   {n:3, a:['antrieb', 'fenster1', 'ober1'], dir:'out', t:'Die Antriebe schließen und verriegeln von selbst. Bei Stromausfall geht es von Hand.'},
   {a:['fenster0', 'ober0'], dir:'out'}]}},

 {id:'kreis', room:'halle_800', time:'8:00', ort:'Halle', label:'Morgenkreis', title:'Morgenkreis am Obelisken',
  mila:'Alle sitzen um den Obelisken, Maren spielt das Morgenlied. Mila stellt ihren Fuchs-Cube ans Brett und steckt einen gelben Klotz: Kaufladen. Dann schaut sie zu ihrem Fach. Oben dreht sich ihr Planwürfel für den Vormittag auf Gelb.',
  idee:'Der Obelisk ist ein Planungswerkzeug für Kinder. Oben zeigt er den Tag der Gruppe, unten auf Kinderhöhe planen die Kinder mit Klötzen ihren Tag, die Großen die Woche. Planwürfel oben am Fach zeigen das Ergebnis. Für die Lernbegleitung ist er die Einstellzentrale, auch vom Handy.',
  bisher:'Der Plan steht auf einem Zettel oder im Kopf, und Kinder erfahren ihn, wenn er feststeht.',
  unsere:'Kinder planen selbst und sehen, was ihre Freunde vorhaben; die Lernbegleitung sieht am Fragezeichen, wer noch Hilfe braucht.',
  nutzen:['Den Tag planen lernen und sehen, was Freunde vorhaben.', 'Planung in Minuten, morgens die Hände frei.', 'Beim Abholen an den Planwürfeln sehen, was morgen geplant ist.', 'Einarbeitung kürzer, weil das Konzept im Raum steht.'],
  varianten:[
   ['Krippe 1–3', 'Drei Plättchen: Spielen, Essen, Schlafen. Die Planwürfel zeigen nur den Tag der Gruppe.'],
   ['Kita 3–6', 'Drei Farben und ein Fragezeichen. Die Planwürfel zeigen den eigenen Tag, Vorschulkinder sehen die ganze Woche.'],
   ['Schule', 'Lottes Klasse plant die Woche an einem eigenen Obelisken, mit Zeit-Plättchen und Aufgaben.'],
   ['Einstellung', 'Die Lernbegleitung legt fest, wie viele Angebote zur Wahl stehen und ob die Planwürfel laufen.'],
   ['Inklusion', 'Tastbare Plättchen, die beim Antippen ihren Namen sagen. Klotzbrett schräg, unterfahrbar, von beiden Seiten erreichbar. Große Klötze, Symbole nach Unterstützter Kommunikation.']],
  daten:'Der Plan jedes Kindes liegt pseudonym auf dem Rechner im Haus, über die Kennung des Cubes, und ist nur im Raum sichtbar: an den Planwürfeln, nicht in einer App. Für Kinder mit Förderbedarf wird nur die Einstellung gespeichert, etwa große Klötze, keine Diagnose. Maren meldet sich mit ihrem Konto an, um den Gruppenplan zu laden.',
  annahme:'Wer seinen Tag selbst plant und sieht, kommt eher ins Tun, und neue Kolleg:innen werden schneller sicher. Messen: Anteil Planwürfel ohne Fragezeichen nach dem Kreis, Planungszeit pro Tag, Zeit bis neue Kolleg:innen eine Gruppe allein führen.',
  hots:[
   {a:['obelisk_mid'], l:'Obelisk', d:'obelisk', step:0, hid:['obelisk']},
   {a:['board'], l:'Klotzbrett', d:'obelisk', step:2, hid:['klotzbrett']},
   {a:['hoehle'], l:'Lesehöhle', note:'Von Eltern beim Familientag gebaut. Ohne Technik, mit Lichterkette und Bär.', hid:['hoehle'], side:'left'},
   {a:['sanne_ukulele', 'sanne_head'], l:'Maren', note:'Vorbereitet hat Maren am Vortag, unterwegs nur noch verfeinert. Jetzt hat sie die Hände frei für die Ukulele.', hid:['sanne']}],
  bubbles:[{a:['mila_head'], t:'Kaufladen!'}, {a:['sanne_head'], t:'Gelb gewinnt.'}],
  xray:{hub:[.12, .2], items:[
   {n:1, a:['sanne_ukulele', 'sanne_head'], dir:'in', t:'Maren lädt den Plan vom Handy über das Hausnetz hoch.'},
   {n:2, a:['board'], dir:'in', t:'Das Klotzbrett liest die Kennung des Cubes und die Klotzfarbe.'},
   {n:3, a:['planwuerfel', 'plan_light'], dir:'out', t:'Kleine Motoren drehen die Planwürfel. Einstellen lassen sie sich nur am Obelisken, so sind Obelisk und Fächer immer gleich.'}]}},

 {id:'fehlt', room:'halle_915', time:'9:15', ort:'Halle', label:'Wenn jemand fehlt', title:'Wenn jemand fehlt',
  mila:'Hanna ist krank, die Igel haben heute keine zweite Lernbegleiterin. Am Obelisken leuchtet ein neues Plättchen: Große Runde. Bären und Igel spielen zusammen <i>Der Fuchs geht um</i>, in der Halle. Mila zeigt den Igeln die Höhle.',
  idee:'Ausfälle wird es weiter geben. Die Idee ist eine Halbautomatik, die niemanden zum Schreiben zwingt: Fehlt jemand, schlägt der Obelisk aus dem Ideenschatz ein Spiel für eine größere Gruppe vor, und eine Nachricht geht an Eltern, die gelegentlich helfen. Die Leitung bestätigt, der Rest läuft.',
  bisher:'Gruppen werden zusammengelegt, der Vormittag wird überbrückt, und wer einspringt, kennt die Pläne nicht.',
  unsere:'Ein erprobtes Spiel liegt bereit, und ein Vater aus dem Eltern-Pool hilft um zwölf an den Tischen.',
  nutzen:['Ein echtes Angebot statt Überbrücken.', 'Ein Vorschlag liegt bereit, niemand improvisiert allein.', 'Helfen, wenn es passt, ohne Gruppenchat.', 'Ausfall sichtbar, Reaktion in Minuten, Team nicht überlastet.'],
  varianten:[
   ['Krippe 1–3', 'Kein Zusammenlegen. Die Nachricht geht zuerst an Springer:innen, dann an den Eltern-Pool.'],
   ['Kita 3–6', 'Große Runde mit einem Spiel, das Kolleg:innen schon ausprobiert haben.'],
   ['Schule', 'Vertretungsstunde mit vorbereitetem Projekt aus dem Ideenschatz statt Beschäftigungsblatt.'],
   ['Einstellung', 'Die Leitung legt fest, ab wann der Eltern-Pool angefragt wird und wer bestätigt.'],
   ['Inklusion', 'Der Plan schützt zuerst die feste Bezugsperson von Kindern mit erhöhtem Förderbedarf und die Stunden der Fachkraft für Teilhabe und Inklusion.']],
  daten:'Dienstplan, Krankmeldung, Liste der Eltern im Pool. Alles im Haus, Zugriff nur Leitung. Die Nachricht an den Pool nennt Zeit und Aufgabe, nicht die erkrankte Kollegin.',
  annahme:'Ein vorbereiteter Vorschlag und ein Eltern-Pool machen Ausfalltage ruhiger. Messen: Zeit von Krankmeldung bis Lösung, Anteil Ausfalltage mit einem Angebot aus dem Ideenschatz, Eltern-Einsätze, Stimmung im Team an solchen Tagen.',
  hots:[
   {a:['plan_light'], l:'Große Runde', d:'fehlt', step:0, hid:['obelisk']},
   {a:['obelisk_mid'], l:'Eltern-Pool', note:'Eltern tragen sich einmal ein: Montag und Mittwoch könnte ich. Höchstens eine Anfrage pro Woche.', hid:[]}],
  bubbles:[{a:['mila_head'], t:'Ich bin der Fuchs!'}],
  xray:{hub:[.12, .2], ext:{icon:'phone', at:[.88, .1]}, items:[
   {n:1, hub:true, t:'Die Krankmeldung landet im Dienstplan auf dem Rechner im Haus.'},
   {n:2, a:['plan_light'], dir:'out', t:'Der Ideenschatz filtert nach Gruppengröße und Erfahrungen und schlägt ein Spiel vor.'},
   {n:3, ext:true, dir:'out', t:'Die Nachricht an den Eltern-Pool geht verschlüsselt raus, Antworten laufen in den Plan zurück.'}]}},

 {id:'laden', room:'kaufladen', time:'10:00', ort:'Kaufladen', label:'Kaufladen', title:'Einkaufen wie in echt',
  mila:'Defne hat Geburtstag und führt die Kasse. Mila stellt ihren Fuchs-Cube auf die Ablage und legt eine Aubergine aufs rote Fenster. Die Kasse sagt: Aubergine. Eggplant. Und für Defne: Patlıcan. Mila sagt es nach, Defne lacht.',
  idee:'Ein kleiner Laden wie in echt: Gemüseecke mit Mengen, Regal, Kasse. Die Kasse zählt mit und spricht Deutsch und Englisch, die Sprachen des Hauses, auf Wunsch auch die Familiensprache des Kindes. Alles optional, eingestellt mit wenigen Klicks. Der Cube auf der Ablage sagt der Kasse, wer einkauft.',
  bisher:'Etwas Holzobst und eine Kasse gibt es in vielen Gruppen, aber viel Lernpotenzial geht verloren, weil die Objekte nicht reagieren.',
  unsere:'Mehr Ladengefühl, wie Kinder es aus der Realität kennen, und eine Kasse, die mitzählt, spricht und Wörter übersetzt.',
  nutzen:['Wörter in Haus- und Familiensprache, Zählen beim Spielen.', 'Sprachförderung nebenbei, ohne Extra-Stunde.', 'Die Familiensprache wird im Haus gehört.', 'Sprachförderung sichtbar; der Laden als möglicher Bausatz.'],
  varianten:[
   ['Krippe 1–3', 'Nur das Wort, langsam und deutlich. Kein Rückgeld, große Früchte.'],
   ['Kita 3–6', 'Rückgeld zählen. Deutsch und Englisch immer, die Familiensprache, wenn Eltern sie wählen.'],
   ['Schule', 'Echte Preise, Taschengeld rechnen, Einkaufsliste für die Lernküche.'],
   ['Einstellung', 'Ohne Cube spricht die Kasse Deutsch und Englisch. Eltern können die Kennung abwählen. Neue Sprachen kommen per Update, ohne neues Gerät.'],
   ['Inklusion', 'Langsamer sprechen, Wiederholen-Knopf, große Früchte. Hört ein Kind nicht, zeigt sein Cube neben der Kasse die Gebärde zum Wort, und die anderen machen sie nach.']],
  daten:'Eine Kasse, die auf ein Kind eingeht, muss wissen, wer spielt. Der Cube trägt eine pseudonyme Kennung, nur der Rechner im Haus kennt dazu Altersstufe und Sprachen, keinen Namen. Was ein Kind kauft, wird nicht gespeichert. Gezählt werden Nutzung und gesprochene Wörter als Summe. Einstellungen wie langsam oder mit Gebärde legen Bezugsfachkraft und Eltern fest.',
  annahme:'Ein Laden, der spricht und zählt, bringt mehr Wörter und Zahlen ins freie Spiel. Messen: Nutzungszeit pro Woche, gesprochene Wörter je Sprache als Summe, ein kurzer Fragebogen an Familien. Kein Kind wird getestet.',
  hots:[
   {a:['kasse'], l:'Sprechende Kasse', d:'kasse', step:1, hid:['kasse']},
   {a:['ablage', 'kasse'], off:[0, .045], l:'Cube-Ablage', d:'kasse', step:0, hid:['ablage', 'kasse']},
   {a:['briefkasten'], l:'Rezept-Briefkasten', note:'Die Großen malen ein Rezept und werfen es ein. Marek kocht es nächste Woche.', hid:['briefkasten'], side:'left'},
   {a:['kranz'], l:'Geburtstag', note:'Defne wird fünf. Die anderen lernen ihr erstes türkisches Wort: patlıcan.', hid:['kranz']}],
  bubbles:[{a:['speaker'], t:'Aubergine. Eggplant. Patlıcan!'}, {a:['mila_head'], t:'Pat-lı-can!'}],
  xray:{hub:[.88, .2], ext:{icon:'phone', at:[.12, .14]}, items:[
   {n:1, a:['ablage', 'kasse'], dir:'in', t:'Unter der Ablage liest ein Funkleser die Kennung im Cube.'},
   {n:2, a:['scan'], dir:'in', t:'In jeder Holzfrucht steckt ein Chip mit dem Produktcode, eine Kamera gibt es nicht.'},
   {n:3, ext:true, dir:'in', t:'Maren stellt Sprachen und Funktionen am Handy ein.'},
   {a:['speaker'], dir:'out'}]}},

 {id:'waschen', room:'waschraum_1145', time:'11:45', ort:'Waschraum', label:'Händewaschen', title:'Händewaschen mit dem Lichtkäfer',
  mila:'Vor dem Essen geht es in den Waschraum. Mila hält die Hände unter den Hahn, am Becken läuft ein Lichtkäfer seine Runde. Solange er läuft, wird geschäumt. Pling. Maren singt das Lied mit.',
  idee:'Ein Lichtring am Becken macht aus zwanzig Sekunden ein Spiel, das Kinder selbst steuern. Dauer, Lied und Licht stellt die Lernbegleitung ein, in Infektwochen läuft der Käfer länger. Der Seifenspender zählt Drücke als Summe pro Tag.',
  bisher:'Kinder waschen ein paar Sekunden, und das Erinnern ist eine Daueraufgabe.',
  unsere:'Der Käfer läuft genau so lange, wie geschäumt werden soll.',
  nutzen:['Ein Spiel statt einer Ermahnung.', 'Weniger Erinnern, die Zeit am Becken wird ruhiger.', 'Hoffentlich weniger Infekte, die mit nach Hause kommen.', 'Ausfalltage in Infektwellen, Seifenverbrauch als Indikator.'],
  varianten:[
   ['Krippe 1–3', 'Langsamer Käfer, großer bunter Ring, die Lernbegleitung wäscht mit.'],
   ['Kita 3–6', 'Kinder starten den Käfer selbst, das Lied wechselt wöchentlich.'],
   ['Schule', 'Nur Licht, kein Lied.'],
   ['Einstellung', 'Infektwoche mit einem Klick oder aus dem Wochenbericht.'],
   ['Inklusion', 'Ein Becken unterfahrbar, mit Sensorhahn und fest auf nur Licht gestellt, für Kinder, die Geräusche schwer aushalten. Niemand muss sich dafür anmelden.']],
  daten:'Wasser an oder aus, Seifendrücke pro Becken und Tag. Kein Personenbezug, alles im Haus. Die Dauer stellt die Leitung ein. Ein Becken kann fest anders eingestellt sein, etwa nur Licht; dafür braucht es keine Kennung.',
  annahme:'Längeres Händewaschen senkt Infekttage von Gruppe und Team. Die Studienlage ist dünn: Eine Übersichtsarbeit von 2016 sieht Hinweise bei Atemwegsinfekten, bei Magen-Darm uneindeutig. Messen: Seifenverbrauch pro Tag, Krankheitstage in Infektwellen gegen Vorjahr und Vergleichsgruppe.',
  hots:[
   {a:['sink1'], l:'Lichtkäfer-Becken', d:'becken', step:0, hid:['becken']},
   {a:['seife'], l:'Seifenspender', note:'Zählt Drücke als Summe pro Tag. Kein Name, keine Kamera.', hid:['seife'], side:'left'},
   {a:['tuer'], l:'Eigener Raum', note:'Waschraum mit Tür, getrennt von Küche und Essbereich.', hid:['tuer']},
   {a:['lautsprecher'], l:'Lied', note:'So lang wie der Käfer läuft. Lässt sich abschalten.', hid:['lautsprecher']}],
  bubbles:[{a:['sanne_head'], t:'Schaum, Schaum, Schaum!'}, {a:['mila_head'], t:'Pling!'}],
  xray:{hub:[.88, .22], ext:{icon:'cloud', at:[.14, .08]}, items:[
   {n:1, ext:true, dir:'in', t:'Der Rechner im Haus liest einmal pro Woche den öffentlichen Bericht des Landesamts.'},
   {n:2, a:['sink1'], dir:'out', t:'Die Lichtringe starten, sobald Wasser läuft, mit der eingestellten Dauer.'},
   {a:['sink0'], dir:'out'}, {a:['sink2'], dir:'out'},
   {n:3, a:['seife'], dir:'in', t:'Der Seifenspender zählt nur, wie oft gedrückt wird.'}]}},

 {id:'essen', room:'bistro', time:'12:00', ort:'Bistro', label:'Mittagessen', title:'Mittagessen mit Milas Rezept',
  mila:'Heute gibt es Milas Rezept von letzter Woche, dazu eine Soße, die Marek mit den Kindern erfunden hat. Samir deckt mit. Nach dem Essen wirft Mila ihre Holzkugel in die Röhre ganz links: lecker.',
  idee:'Das Kugelbrett ist die Rückmeldung der Kinder zum Essen, anonym und als Summe. Die Zahlen gehören Kindern und Koch: Damit verständigen sie sich auf besseres Essen. Ein Rezept-Assistent schlägt Marek Varianten vor, die zu den gemalten Rezepten passen. Marek entscheidet.',
  bisher:'Das Essen kommt in Kisten, und ob es schmeckt, erfährt die Küche über Reste und Beschwerden.',
  unsere:'Jedes Kind wirft eine Kugel, und aus Wochen von Kugeln entstehen Muster, mit denen Koch und Kinder das Essen verbessern.',
  nutzen:['Essen mitgestalten, eigene Rezepte auf dem Tisch.', 'Weniger Stress am Tisch, ein echtes Gesprächsthema.', 'Wissen, was ankommt, Rezepte zum Nachkochen.', 'Reste und Kosten messbar, Verhandlungsbasis mit dem Caterer.'],
  varianten:[
   ['Krippe 1–3', 'Zwei Röhren, die Lernbegleitung wirft mit dem Kind.'],
   ['Kita 3–6', 'Drei Röhren, freitags Lernküche mit Marek.'],
   ['Schule', 'Lottes Klasse plant mit Marek den Wochenplan, Nährwerte als Rätsel.'],
   ['Einstellung', 'Marek wählt, ob der Assistent Vorschläge macht oder nur Muster zeigt.'],
   ['Inklusion', 'Großer Einwurf auf Sitzhöhe, dazu ein Hebel für Kinder, die nicht werfen können. Die Röhren zählen beides gleich.']],
  daten:'Kugeln je Röhre und Gericht, Reste in Kilogramm. Kein Personenbezug. Marek sieht seine Gruppen, der Träger Summen über alle Häuser.',
  annahme:'Mitbestimmung beim Essen führt zu weniger Resten und besserer Stimmung am Tisch. Messen: Kugelverteilung je Gericht, Reste pro Mahlzeit auf der Waage, Anteil Gerichte aus Kinderrezepten.',
  hots:[
   {a:['daumen'], l:'Kugelbrett', d:'daumen', step:0, hid:['daumen'], side:'left'},
   {a:['rezept'], l:'Milas Rezept', note:'Gemalt am Kaufladen-Tag, eine Woche später gekocht.', hid:['rezept']},
   {a:['durchreiche'], l:'Küche', note:'Eigener Raum mit Durchreiche. Freitags kochen Kinder in der Lernküche mit.', hid:['durchreiche']},
   {a:['marek_pot'], l:'Koch Marek', note:'Vorschläge statt Vorschriften. Was er kocht, entscheidet er.', hid:['marek']}],
  bubbles:[{a:['marek_head'], t:'Heute: Mila-Soße!'}, {a:['mila_head'], t:'Meins!'}],
  xray:{hub:[.5, .07], ext:{icon:'house', at:[.9, .16]}, items:[
   {n:1, a:['daumen'], dir:'in', t:'Die Röhren zählen Kugeln, nicht Kinder.'},
   {n:2, hub:true, t:'Der Rezept-Assistent passt Vorschläge an die gemalten Rezepte an.'},
   {a:['rezept'], dir:'in'},
   {n:3, ext:true, dir:'out', t:'Der Träger bekommt Summen und verhandelt damit mit dem Caterer.'}]}},

 {id:'abholen', room:'abholung', time:'15:30', ort:'Halle', label:'Abholen', title:'Abholen',
  mila:'Papa Jonas holt Mila ab, Lotte kommt die Treppe herunter aus der Schule. Mila stellt ihren Fuchs-Cube zurück ins Fach. Die Planwürfel darüber zeigen schon morgen: Garten.',
  idee:'Abholen ist eine Übergabe in Holz. Fach, Planwürfel und Obelisk zeigen den Tag und den Plan für morgen. In der Eltern-App steht dasselbe plus eine Zeile der Bezugsfachkraft. Eltern stellen ein, was sie bekommen. Wünsche gehen in den Ideenschatz. Niemand schreibt etwas doppelt.',
  bisher:'Zwischen Tür und Angel bleiben zwei Minuten, und abends dokumentiert das Team noch einmal für die Akte.',
  unsere:'Was im Raum in Holz steht, steht einmal in der App, und eine Zeile von Maren dazu.',
  nutzen:['Erzählen können, mit einem Bild vor Augen.', 'Einmal dokumentieren, kürzere Übergabe.', 'Wissen, was war, und Wünsche einbringen.', 'Elternbindung, weniger Dokumentationszeit.'],
  varianten:[
   ['Krippe 1–3', 'Die Lernbegleitung stellt den Cube mit dem Kind zurück ins Fach. Die App zeigt Schlaf und Essen als Symbole.'],
   ['Kita 3–6', 'Das Kind stellt seinen Cube selbst zurück. Eine Zeile pro Tag oder pro Woche.'],
   ['Schule', 'Lotte sieht ihre Woche selbst, Eltern bekommen nur die Woche.'],
   ['Einstellung', 'Benachrichtigung an oder aus. Wunschkasten aus Holz für Familien ohne Smartphone.'],
   ['Inklusion', 'Für Kinder mit wenig Sprache zeigt die Eltern-App den Tag in Bildsymbolen. Zu Hause zeigt das Kind darauf und erzählt. Die App gibt es auch in einfacher Sprache.']],
  daten:'Hier gibt es echten Personenbezug: die Zeile zum eigenen Kind. Sie schreibt und sieht die Bezugsfachkraft, die Leitung nicht. Geht die App über das Internet, sind Inhalte verschlüsselt und pseudonymisiert, der Schlüssel bleibt im Haus. Wann der Cube im Fach steht, wird nicht gespeichert.',
  annahme:'Einmal dokumentieren, in Holz und App, spart dem Team Zeit und bindet Eltern. Messen: Dokumentationszeit pro Woche, Anteil Familien mit Wünschen, Elternzufriedenheit, Empfehlungen und Warteliste.',
  hots:[
   {a:['mila_fach'], l:'Milas Fach', d:'faecher', step:0, hid:['faecher', 'planwuerfel']},
   {a:['jonas_phone'], l:'Eltern-App', d:'faecher', step:1, hid:['jonas'], side:'left'},
   {a:['wunsch'], l:'Wunschkasten', note:'Eine Karte für die nächsten Tage. Sie landet im Ideenschatz, Maren entscheidet.', hid:['wunsch', 'obelisk']}],
  bubbles:[{a:['mila_head'], t:'Wir haben Soße erfunden!'}, {a:['lotte_head'], t:'Zeig mal!'}],
  xray:{hub:[.1, .2], items:[
   {n:1, a:['planwuerfel', 'mila_fach'], t:'Fach und Planwürfel zeigen nur, sie messen nichts.'},
   {n:2, a:['jonas_phone'], dir:'out', t:'Die App ist verschlüsselt, der Schlüssel bleibt im Haus.'},
   {n:3, hub:true, t:'Wünsche aus App und Wunschkasten landen im Ideenschatz.'},
   {a:['wunsch'], dir:'in'}]}}
];

/* After the day: Familientag and the whole house use the same station building blocks. */
const STATIONS_AFTER = [
 {id:'werkstatt', room:'werkstatt', time:'Samstag', ort:'Werkstatt', label:'Familientag', title:'Familientag',
  mila:'Am Samstag löten Familien ihre CO₂-Kästchen. Lotte lötet mit Papa, Mila bemalt das Gehäuse. Ayla fragt, ob das Ding mithört. Maren klappt eines auf: ein Fühler, drei Lämpchen, zwei Batterien.',
  idee:'Datenschutz als Lerninhalt. Wer einen Sensor selbst gebaut hat, kann die Frage nach dem Mithören selbst beantworten. Bauplan und Code sind offen, das Kästchen darf mit nach Hause. Die Werkstatt ist zugleich der Lab-Moment: Hier probieren Team, Familien und Partner Werkzeuge aus, bevor sie in die Gruppenräume kommen.',
  bisher:'Das Gerät kommt fertig und verschlossen vom Hersteller, und die Frage, wer mithört, bleibt offen.',
  unsere:'Familien bauen die Sensoren selbst, und das Kästchen kann nur Grün, Gelb und Rot.',
  nutzen:['Löten lernen, etwas Eigenes im Gruppenraum.', 'Technik, die sie selbst erklären kann.', 'Vertrauen durch Einblick, ein Kästchen fürs Kinderzimmer.', 'Akzeptanz, günstige Hardware, Gemeinschaft.'],
  varianten:[
   ['Krippe 1–3', 'Gehäuse bemalen, Lämpchen testen.'],
   ['Kita 3–6', 'Batterien einsetzen, Kästchen auf die Fensterbank stellen.'],
   ['Schule', 'Lotte lötet den Fühler und stellt die Schwelle für Gelb selbst ein.'],
   ['Optional', 'Lautstärke-Lämpchen für den Gruppenraum. Bausätze für andere Kitas, eingebaut von Familien vor Ort.'],
   ['Inklusion', 'Bauplan in Bildern, Lötkolben mit dickem Griff, Steckverbinder statt Löten für Kinder, denen Feinmotorik schwerfällt.']],
  daten:'Das Kästchen funkt eine Zahl und seine Raumnummer an den Rechner im Haus. Keine Personendaten. Wer gebaut hat, kann es auslesen.',
  annahme:'Wer mitgebaut hat, hat weniger Sorge vor Sensorik im Haus. Messen: Kurzer Fragebogen vor und nach dem Familientag, Teilnahme, Kästchen, die mit nach Hause gehen.',
  hots:[
   {a:['kaestchen'], l:'CO₂-Kästchen', d:'kaestchen', step:0, hid:['kaestchen']},
   {a:['plakat'], l:'Unsere Leitlinie', note:'So wenig Daten wie nötig. Einstellbar. Zuerst im Haus. Wer will, baut mit.', hid:['plakat'], side:'left'},
   {a:['loeten'], l:'Löten', note:'Große Geschwister helfen den Kleinen. Zehn Minuten für die Grundlagen.', hid:['loeten']}],
  bubbles:[{a:['lotte_head'], t:'Fertig gelötet!'}, {a:['ayla_head'], t:'Und das hört nicht mit?'}],
  xray:null},

 {id:'dach', room:'ausblick', time:'Danach', ort:'Das ganze Haus', label:'Unter einem Dach', title:'Unter einem Dach: Kita, Schule, Lab',
  mila:'Mila ist unten in der Kita, Lotte oben in der Schule. Im Lab im Erdgeschoss probieren Maren, Marek und zwei Eltern am Nachmittag eine neue Kasse aus. Alle drei Türen gehen in dieselbe Halle mit dem Obelisken.',
  idee:'Ein Haus, drei Bereiche, eine Haltung. Kita und Schule mit denselben Prinzipien: mitplanen, ausprobieren, messen. Das Lab, in dem Team, Familien und Partner Werkzeuge bauen und testen. Aus dem, was dort trägt, soll eine Software-GmbH Werkzeuge für Träger bauen.',
  bisher:'Kita und Schule sind getrennte Welten mit eigenen Trägern und Abläufen, und der Übergang bricht Beziehungen ab.',
  unsere:'Unter einem Dach lernen Kinder, Lernbegleitung und Familien weiter, und das Lab testet, bevor irgendetwas skaliert.',
  nutzen:['Geschwister und Freunde bleiben, der Übergang hat keinen Bruch.', 'Werkzeuge, die vor Ort entstehen und die sie mitgestalten.', 'Ein Ort für viele Jahre.', 'Auslastung über Altersstufen, Lab als Quelle für Qualität.'],
  varianten:[
   ['Kita', 'Der Tag, den du gerade gesehen hast.'],
   ['Schule', 'Lottes Klasse plant die Woche am Obelisken, bewertet das Essen, lötet die Sensoren.'],
   ['Lab', 'Jeder Versuch hat eine Annahme, eine Messgröße und ein Ergebnis, das im Haus aushängt.'],
   ['Träger-Software', 'Was im Lab trägt, wird zu Werkzeugen für andere Träger. Offener Code.']],
  daten:'Für Schule und Lab gelten dieselben Leitlinien. Das Lab arbeitet mit Summen und Pseudonymen und nur mit Familien, die ausdrücklich mitmachen.',
  annahme:'Ein Haus mit eigenem Lab lernt schneller als getrennte Einrichtungen. Messen: Versuche pro Jahr, Anteil, der bleibt oder verworfen wird, Zeit von Idee bis Test, Anteil Kinder, die im Haus in die Schule wechseln.',
  labels:[
   {a:['kita', 'kita_center'], t:'Kita (EG)', wood:true},
   {a:['schule'], t:'Schule (OG)'},
   {a:['lab'], t:'Lab'},
   {a:['halle'], t:'Halle mit Obelisk'},
   {a:['garten'], t:'Garten'}],
  hots:[], bubbles:[], xray:null,
  ausblick:'Was in der Kita unter Zeitdruck und mit wenig Geld trägt, könnte auch in Pflege, Sozialarbeit und Unternehmen helfen: Teams planen gemeinsam, Technik hilft im Hintergrund, Wirkung wird gemessen.',
  frage:'Wenn KI klüger wird, wie bleiben Menschen <em>neugierig</em>, statt sich klein zu fühlen?'}
];

const NUTZEN_ROLES = ['Kinder', 'Lernbegleitung', 'Eltern', 'Träger'];
const NUTZEN_ICONS = ['kind', 'lern', 'eltern', 'traeger'];

/* Close-ups ("Nahaufnahme"): five steps each, step 5 is "Woran wir merken würden, ob es wirkt".
   img: list of logical image names (first one present wins). ov: overlays on the image. */
const DETAILS = {
 luft:{title:'Fenster und CO₂-Kästchen', steps:[
  {img:['halle_745z_fenster'], t:'7:30 Uhr, die ersten Familien sind da. Das Kästchen auf der Fensterbank springt auf Gelb: über 1.000 ppm.',
   ov:[{pulse:['co2']}, {chip:['co2'], t:'Gelb', cls:'warn', dy:-44}]},
  {img:['halle_745_fenster'], t:'Auf beiden Seiten der Halle gehen die Fenster weit auf. Der Luftzug geht quer durch den Raum.',
   ov:[{pulse:['fenster1', 'antrieb', 'ober1']}, {air:['fenster1', 'ober1_pane', 'ober1']}]},
  {img:['halle_745z_fenster'], t:'Vier Minuten, einmal gemessen für diesen Raum. Dann Grün. Die Fenster schließen und verriegeln.',
   ov:[{chip:['co2'], t:'Grün', cls:'ok', dy:-44}]},
  {img:['halle_745_fenster'], t:'In Infektwochen passiert das öfter. Das Haus liest den Wochenbericht des Landesamts und meldet nichts zurück.',
   ov:[{cloud:['fenster1', 'ober1'], t:'Öffentlicher Wochenbericht'}]},
  {img:['halle_745_fenster'], ev:true, t:'CO₂-Verlauf im Raum und Krankheitstage von Gruppe und Team gegen das Vorjahr. Nie einzelne Kinder.',
   src:['Umweltbundesamt', 'https://www.umweltbundesamt.de/richtig-lueften-in-schulen']}]},
 obelisk:{title:'Der Obelisk', steps:[
  {img:['halle_800_obelisk'], t:'In der Bahn verfeinert Maren den Plan am Handy und notiert kurz, wie das Schnee-Experiment von gestern lief.', ov:[{phone:'plan'}]},
  {img:['halle_800_obelisk'], t:'Oben hängt der Tag als Holzplättchen. Neben dem nächsten leuchtet ein Licht.',
   ov:[{pulse:['tile1']}, {chip:['tile0'], t:'Morgenkreis', side:'left'}, {chip:['tile1'], t:'gleich: Kaufladen', side:'left'}]},
  {img:['halle_800_obelisk'], t:'Unten stellt Mila ihren Cube ans Brett und steckt den gelben Klotz. Gelb heißt Kaufladen, Blau Bauen, Grün Garten.',
   ov:[{pulse:['board']}, {bubble:['mila_head'], t:'Gelb!'}]},
  {img:['halle_800', 'fachwand', 'abholung_faecher', 'halle_800_obelisk'], need:['planwuerfel', 'planwuerfel_tag'], zoom:[['planwuerfel'], 2.2],
   t:'Oben an Milas Fach dreht sich der Planwürfel für den Vormittag auf Gelb. Bei Defne steht ein Fragezeichen. Maren geht zu ihr, Defne sieht Milas Laden und steckt auch Gelb.',
   ov:[{pulse:['planwuerfel', 'planwuerfel_tag']}, {cube:['planwuerfel', 'planwuerfel_tag'], to:'gelb'}, {cube:['planwuerfel_defne', 'frage'], to:'frage'}]},
  {img:['halle_800_obelisk'], ev:true, t:'Planwürfel mit Fragezeichen nach dem Kreis, Planungszeit, wie schnell neue Kolleg:innen sicher sind.'}]},
 fehlt:{title:'Große Runde', steps:[
  {img:['halle_915'], zoom:[['kreis', 'obelisk_mid'], 1.7], t:'7:10 Uhr: Hanna meldet sich krank. Die Leitung bestätigt am Handy: Igel und Bären zusammen.', ov:[]},
  {img:['halle_800_obelisk'], t:'Der Obelisk zeigt Große Runde und den Vorschlag: Der Fuchs geht um, mit Hannas Notiz vom letzten Mal: klappt ab zwanzig Kindern.',
   ov:[{pulse:['plan_light']}, {chip:['plan_light'], t:'Große Runde', side:'left'}]},
  {img:['halle_800_obelisk'], t:'Eine Nachricht geht an den Eltern-Pool: 12 bis 13 Uhr, Hilfe an den Mittagstischen. Samir sagt zu.', ov:[{phone:'pool'}]},
  {img:['bistro'], zoom:[['samir_head', 'sanne_head'], 1.9], t:'Um zwölf deckt Samir mit, Maren hat beide Hände für die Kleinen. Niemand hat eine Nachricht getippt.', ov:[{pulse:['samir_head']}]},
  {img:['halle_915'], ev:true, t:'Wie schnell ein Ausfall gelöst ist, wie oft ein Angebot aus dem Ideenschatz läuft, wie viele Eltern mitmachen.'}]},
 kasse:{title:'Die sprechende Kasse', steps:[
  {img:['kaufladen_kasse'], t:'Mila stellt ihren Cube auf die Ablage. Die Kasse weiß jetzt: 3 bis 6, Deutsch und Englisch.', ov:[{pulse:['ablage', 'mila_cube']}]},
  {img:['kaufladen_kasse'], t:'Die Aubergine kommt aufs rote Fenster. Der Chip in der Holzfrucht wird erkannt.', ov:[{pulse:['scan']}]},
  {img:['kaufladen_kasse'], t:'Aubergine. Eggplant. Am Geburtstag kommt die Familiensprache des Geburtstagskinds dazu: Patlıcan.',
   ov:[{bubble:['speaker'], t:'Aubergine. Eggplant.'}, {bubble:['defne_head'], t:'Patlıcan!', d:.8}]},
  {img:['kaufladen_kasse'], t:'Bezahlt wird mit Holztalern, die Kasse zählt das Rückgeld laut mit.',
   ov:[{pulse:['coins']}, {bubble:['speaker'], t:'zwei, drei Taler zurück!'}]},
  {img:['kaufladen_kasse'], ev:true, t:'Wie oft der Laden genutzt wird und welche neuen Wörter Familien von zu Hause erzählen.'}]},
 becken:{title:'Das Lichtkäfer-Becken', steps:[
  {img:['waschraum_aus_becken'], t:'Zwanzig Sekunden fühlen sich für Dreijährige endlos an, und nebenan wartet das Essen.', ov:[]},
  {img:['waschraum_1145_becken'], t:'Hände unter den Hahn: Der Ring leuchtet, der Käfer startet.', ov:[{ring:'ring1', dur:5}]},
  {img:['waschraum_1145_becken'], t:'Schäumen, solange er läuft. Einmal herum: Pling.', ov:[{ring:'ring1', dur:4, done:true}, {bubble:['sanne_head'], t:'Pling!'}]},
  {img:['waschraum_1145_becken'], t:'Infektwoche in Berlin: Der Käfer braucht 30 statt 20 Sekunden.', ov:[{ring:'ring1', dur:7}, {cloud:['sink1'], t:'Öffentlicher Wochenbericht'}]},
  {img:['waschraum_1145_becken'], ev:true, t:'Seifenverbrauch pro Tag und Krankheitstage der Gruppe in Infektwellen gegen das Vorjahr.',
   src:['Willmott u. a. 2016', 'https://adc.bmj.com/content/101/1/42']}]},
 daumen:{title:'Das Kugelbrett', steps:[
  {img:['bistro_daumen'], t:'Nach dem Essen wirft jedes Kind eine Kugel: Daumen hoch, quer oder runter.', ov:[{pulse:['tube0']}]},
  {img:['bistro_daumen'], t:'Die Röhren zählen Kugeln. Wer welche geworfen hat, weiß niemand.',
   ov:[{chip:['tube0'], t:'lecker', dy:-46}, {chip:['tube1'], t:'geht so', dy:-46}, {chip:['tube2'], t:'anders', dy:-46}]},
  {img:['bistro_daumen'], t:'Nach Wochen sieht Marek: Gemüse kommt an, bei der Soße wollen die Kinder mehr. Der Assistent schlägt drei Soßen vor.', ov:[{paper:'muster'}]},
  {img:['bistro'], zoom:[['marek_head'], 2.0], t:'Freitag erfinden die Kinder mit Marek eine Soße. Heute steht sie auf dem Tisch.', ov:[{bubble:['marek_head'], t:'Heute: Mila-Soße!'}]},
  {img:['bistro_daumen'], ev:true, t:'Kugelverteilung, Reste pro Mahlzeit, Anteil Kinderrezepte. Der Träger sieht Summen, nie Kinder.'}]},
 faecher:{title:'Fach und Eltern-App', steps:[
  {img:['abholung_faecher'], t:'Der Fuchs-Cube ist zurück im Fach. Die Planwürfel zeigen morgen: Garten. Gesteckt hat Mila das nach dem Mittag.', ov:[{pulse:['mila_fach']}]},
  {img:['abholung_faecher'], t:'Papa sieht den Tag der Gruppe und eine Zeile von Maren. Keine Fotos, keine Noten.', ov:[{phone:'eltern'}]},
  {img:['abholung_faecher'], t:'Er tippt: Waffeln backen? Der Wunsch landet im Ideenschatz.', ov:[{phone:'wunsch'}]},
  {img:['abholung_wunsch'], t:'Ayla steckt ihren Wunsch lieber als Karte in den Wunschkasten aus Holz. Lotte kommt aus der Schule im selben Haus.',
   ov:[{pulse:['wunsch']}, {bubble:['ayla_head'], t:'Kostüme nähen?'}]},
  {img:['abholung_wunsch'], ev:true, t:'Dokumentationszeit des Teams, Anteil Familien mit Wünschen, Weiterempfehlungen.'}]},
 kaestchen:{title:'Das CO₂-Kästchen von innen', steps:[
  {img:['werkstatt_kaestchen'], t:'Innen: ein CO₂-Fühler, drei Lämpchen, zwei Batterien, ein Funkmodul fürs Hausnetz.', ov:[{pulse:['sensor']}]},
  {img:['werkstatt_kaestchen'], t:'Keine Kamera, kein Mikrofon. Es sendet eine Zahl und seine Raumnummer.',
   ov:[{pulse:['box0_led', 'led0']}, {chip:['box0', 'led0'], t:'grün', cls:'ok', dy:-42}, {chip:['box1', 'led1'], t:'gelb', cls:'warn', dy:-42}, {chip:['box2', 'led2'], t:'rot', cls:'bad', dy:-42}]},
  {img:['werkstatt_kaestchen'], t:'Das Kästchen darf mit nach Hause, viele messen damit zum ersten Mal die Luft im Kinderzimmer.', ov:[{bubble:['lotte_head'], t:'Das hab ich gebaut!'}]},
  {img:['werkstatt_kaestchen'], t:'Bauplan und Code liegen offen. Wer will, prüft nach oder baut ein zweites.', ov:[]},
  {img:['werkstatt_kaestchen'], ev:true, t:'Ob die Sorge vor Sensorik nach dem Familientag kleiner ist und ob Familien das nächste Werkzeug mitbauen wollen.'}]}
};

/* Phone mocks and the Kugelbrett card (texte_v4: Handy-Mock plan, pool, eltern, wunsch; Karte muster). */
const PHONES = {
 plan:'<h4>Plan für Dienstag</h4><div class="sub">Bären · 14 Kinder</div>'
  + '<div class="row"><b>8:00 Morgenkreis</b>Lied vom Wetter</div>'
  + '<div class="row"><b>10:00 Kaufladen</b>Defne hat Geburtstag, Kasse auch auf Türkisch</div>'
  + '<div class="row"><b>11:45 Händewaschen</b>Infektwoche: 30 s</div>'
  + '<div class="row"><b>Gestern Schnee-Experiment</b>Marens Bewertung: hat gezogen, noch mal mit Salz</div>'
  + '<div><span class="sub">Ideenschatz:</span> <span class="tag pick">Soßen probieren (Kinder)</span> <span class="tag">Vorlesen auf Türkisch (Eltern)</span></div>'
  + '<div class="fine">Maren entscheidet.</div>',
 pool:'<h4>Bären und Igel heute zusammen</h4>'
  + '<div class="row"><b>Hilfe gesucht</b>12 bis 13 Uhr, Mittagstische</div>'
  + '<div><span class="pbtn">Ich komme</span></div>'
  + '<div class="fine">Höchstens eine Anfrage pro Woche.</div>',
 eltern:'<h4>Heute bei den Bären</h4><div class="sub">für Familie Berger</div>'
  + '<div class="row"><b>Morgenkreis</b>Lied vom Wetter</div>'
  + '<div class="row"><b>Kaufladen</b>Defnes Geburtstag, Wörter auf Türkisch</div>'
  + '<div class="row"><b>Mittag</b>Milas Rezept mit neuer Soße</div>'
  + '<div class="row"><b>Notiz von Maren</b>Mila hat beim Einkaufen bis zehn gezählt</div>'
  + '<div class="fine">Keine Fotos, keine Bewertungen. Was du siehst, stellst du selbst ein.</div>',
 wunsch:'<h4>Wunsch für morgen</h4><div class="sub">an den Ideenschatz der Gruppe</div>'
  + '<div class="input">Waffeln backen? Wir bringen das Waffeleisen mit</div>'
  + '<div><span class="pbtn">Senden</span></div>'
  + '<div class="fine">Die Lernbegleitung entscheidet.</div>'
};
const PAPERS = {
 muster:'<h4>Muster der letzten 4 Wochen</h4><ul><li>Gemüse: meist Daumen hoch</li><li>Soße: oft Daumen quer, Kommentar: mehr bitte</li></ul>'
  + '<p><b>Vorschläge</b></p><ul><li>Tomaten-Basilikum</li><li>Joghurt-Kräuter</li><li>Möhren-Ingwer</li></ul>'
  + '<p class="hand">Marek wählt Tomate!</p>'
};

/* app.js: page logic for Bildungshaus weWeit (demo v3). Content lives in story.js; build.py
   concatenates story.js + app.js into site/app.js inside one IIFE. No inline script, no eval:
   the page runs under script-src 'self'. Every anchor and image is optional. */

const SD = (() => { try { return JSON.parse(document.getElementById('scenedata').textContent); } catch (e) { return {}; } })();
SD.rooms = SD.rooms || {}; SD.shots = SD.shots || {};
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const NS = 'http://www.w3.org/2000/svg';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = () => innerWidth <= 860;
const arr = v => v == null ? [] : (Array.isArray(v) ? v : [v]);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rect = n => n.getBoundingClientRect();
function inflate(r, k){ return {left:r.left - k, right:r.right + k, top:r.top - k, bottom:r.bottom + k}; }
function hit(a, b){ return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
function shift(r, dx, dy){ return {left:r.left + dx, right:r.right + dx, top:r.top + dy, bottom:r.bottom + dy}; }
function el(tag, cls, html){ const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function svg(tag, attrs, parent){ const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
function safe(name, fn){ try { return fn(); } catch (e) { console.warn('bildungshaus: ' + name + ' skipped', e); return null; } }
/* first anchor of a list that exists in the render; returns [x, y] in 0..1 or null */
function anchorHit(data, names){
  if (!data || !data.anchors) return null;
  for (const n of arr(names)){ const p = data.anchors[n]; if (Array.isArray(p) && isFinite(p[0]) && isFinite(p[1])) return {p, name:n}; }
  return null;
}
function anchor(data, names){ const h = anchorHit(data, names); return h ? h.p : null; }
function onImage(p, m){ m = m == null ? .015 : m; return !!p && p[0] > m && p[0] < 1 - m && p[1] > m && p[1] < 1 - m; }
function imgData(names, need){
  const all = arr(names).map(n => SD.shots[n] ? {name:n, data:SD.shots[n]} : (SD.rooms[n] ? {name:n, data:SD.rooms[n], room:true} : null)).filter(Boolean);
  if (need){ const w = all.find(I => onImage(anchor(I.data, need), .02)); if (w) return w; }
  return all[0] || null;
}

const ICON = {
 gear:'<svg viewBox="0 0 100 100" aria-hidden="true"><g class="g"><path fill="currentColor" d="m43.203 2.5234h13.598c0.67969 0 1.2422 0.51953 1.3047 1.1836l1.7305 11.613c2.7031 0.76563 5.2773 1.832 7.7344 3.2031l9.4922-7.0273c0.52734-0.39062 1.2539-0.32422 1.7031 0.125l9.6172 9.6133c0.48828 0.48828 0.50781 1.2773 0.058594 1.7891l-6.9648 9.4062c1.3633 2.4414 2.4453 5.0391 3.207 7.7305l11.676 1.7422c0.65234 0.09375 1.1211 0.65625 1.1211 1.293v13.598c0 0.67969-0.51953 1.2383-1.1836 1.3047l-11.613 1.7305c-0.76562 2.7031-1.832 5.2773-3.2031 7.7344l7.0273 9.4922c0.39063 0.52734 0.32422 1.2539-0.125 1.7031l-9.6133 9.6172c-0.48828 0.48828-1.2773 0.50781-1.7891 0.058594l-9.4062-6.9648c-2.4414 1.3633-5.0391 2.4453-7.7305 3.207l-1.7422 11.676c-0.09375 0.65234-0.65625 1.1211-1.293 1.1211h-13.598c-0.67969 0-1.2383-0.51953-1.3047-1.1836l-1.7305-11.613c-2.7031-0.76562-5.2773-1.832-7.7344-3.2031l-9.4922 7.0273c-0.52734 0.39062-1.2539 0.32422-1.7031-0.125l-9.6172-9.6133c-0.48828-0.48828-0.50781-1.2773-0.058594-1.7891l6.9648-9.4062c-1.3633-2.4414-2.4453-5.0391-3.207-7.7305l-11.676-1.7422c-0.65234-0.09375-1.1211-0.65625-1.1211-1.293v-13.598c0-0.67969 0.51953-1.2383 1.1836-1.3047l11.613-1.7305c0.76562-2.7031 1.8359-5.2773 3.207-7.7344l-7.0273-9.4922c-0.39062-0.52734-0.32422-1.2539 0.125-1.7031l9.6133-9.6172c0.48828-0.48828 1.2773-0.50781 1.7891-0.058594l9.4062 6.9648c2.4453-1.3672 5.0391-2.4453 7.7305-3.207l1.7422-11.676c0.09375-0.65234 0.65625-1.1211 1.293-1.1211zm6.7969 28.977c-10.223 0-18.504 8.2812-18.504 18.504s8.2812 18.504 18.504 18.504 18.504-8.2812 18.504-18.504-8.2812-18.504-18.504-18.504z"/></g></svg>',
 cloud:'<svg viewBox="0 0 30 30" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M8 22h15a5 5 0 0 0 .6-10 7 7 0 0 0-13.3-1.6A5.5 5.5 0 0 0 8 22z"/><path fill="none" stroke="currentColor" stroke-width="1.6" d="M11 16h8M11 19h5"/></svg>',
 phone:'<svg viewBox="0 0 30 30" aria-hidden="true"><rect x="9" y="4" width="12" height="22" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 22h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 house:'<svg viewBox="0 0 30 30" aria-hidden="true"><path d="M5 26V12l10-7 10 7v14M3 26h24M12 26v-7h6v7" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
 bulb:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>',
 kind:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5.5 20c.8-4.2 3.3-6.5 6.5-6.5s5.7 2.3 6.5 6.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 lern:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="7" r="3" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 20c.6-3.8 2.8-6 6-6s5.4 2.2 6 6M15 3.5h6.5v6H15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 eltern:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="7.5" r="3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2.5 20c.6-3.6 2.7-5.6 5.5-5.6s4.9 2 5.5 5.6M13.5 15c.9-.6 1.9-.9 3-.9 2.4 0 4.1 1.7 4.6 4.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
 traeger:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V9l6-4 6 4v12M15 12h6v9M2 21h20M7 13h4M7 17h4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 left:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 right:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

/* ================================================================ image tags (hero, house) */
function addTags(parent, data, list){
  const out = [];
  list.forEach(L => {
    const p = anchor(data, L.a); if (!onImage(p, .01)) return;
    const t = el('span', 'tag' + (L.wood ? ' wood' : ''), L.t);
    t.style.left = (p[0]*100) + '%'; t.style.top = (p[1]*100) + '%';
    parent.appendChild(t); out.push(t);
  });
  return out;
}
/* keep tags inside the figure and apart from each other; hide a tag rather than overlap */
function fitTags(fig, tags, obstacles){
  if (!tags.length || !fig.offsetParent) return;
  const fb = rect(fig); const placed = (obstacles || []).slice();
  tags.forEach(t => { t.hidden = false; t.classList.remove('under'); t.style.transform = ''; t.style.removeProperty('--lx'); t.style.removeProperty('--lh'); });
  // top-most anchors first, so a tag never sits on the leader of the tag above it
  const order = tags.map(t => ({t, r:rect(t)})).sort((a, b) => a.r.bottom - b.r.bottom);
  order.forEach(({t, r:r0}) => {
    t.classList.add('under'); const ru = rect(t); t.classList.remove('under');
    const w = r0.right - r0.left, sx = Math.max(0, w/2 - 16);
    const tries = [];
    [[0, false], [-28, false], [0, true], [-56, false], [28, true], [-84, false]].forEach(([dy, under]) => [0, sx, -sx].forEach(dx => tries.push([dx, dy, under])));
    let ok = null;
    for (const [dx0, dy, under] of tries){
      const base = under ? ru : r0;
      let dx = dx0; let r = shift(base, dx, dy);
      if (r.left < fb.left + 4) dx += fb.left + 4 - r.left; else if (r.right > fb.right - 4) dx -= r.right - fb.right + 4;
      r = shift(base, dx, dy);
      if (r.left < fb.left + 2 || r.right > fb.right - 2 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      // the leader line from the tag to its anchor counts as part of the tag
      const ax = (base.left + base.right)/2, len = 14 + Math.abs(dy);
      if (ax < r.left + 8 || ax > r.right - 8) continue;
      const lead = under ? {left:ax - 2, right:ax + 2, top:r.top - len, bottom:r.top} : {left:ax - 2, right:ax + 2, top:r.bottom, bottom:r.bottom + len};
      if (placed.some(q => hit(inflate(q, 4), r) || hit(q, lead))) continue;
      ok = {dx, dy, r, under, lead}; break;
    }
    if (!ok){ t.hidden = true; return; }
    t.classList.toggle('under', ok.under);
    if (ok.dx || ok.dy){
      t.style.transform = `translate(calc(-50% + ${ok.dx}px), calc(${ok.under ? '0%' : '-100%'} + ${ok.dy}px))`;
      t.style.setProperty('--lx', `calc(50% - ${ok.dx}px)`); t.style.setProperty('--lh', (14 + Math.abs(ok.dy)) + 'px');
    }
    placed.push(ok.r, ok.lead);
  });
}

/* ================================================================ hero */
const HERO = {tags:[]};
function buildHero(){
  const fig = $('#hero-fig'); const d = SD.rooms.aussen; if (!fig || !d) return;
  const img = el('img'); img.src = d.img; img.width = d.w; img.height = d.h; img.decoding = 'async';
  img.alt = 'Ein Tag im Bildungshaus weWeit: ' + HERO_LABELS.filter(L => anchor(d, L.a)).map(L => L.t).join(', ');
  fig.appendChild(img);
  HERO.fig = fig; HERO.tags = addTags(fig, d, HERO_LABELS);
}

/* ================================================================ stations */
const ST = [];
function buildStation(s, i){
  const d = SD.rooms[s.room] || null;
  const sec = el('section', 'st-sec'); sec.id = s.id; sec.setAttribute('aria-labelledby', s.id + '-h');
  const wrap = el('div', 'wrap railpad'); const inner = el('div', 'station' + (d ? '' : ' noimg'));
  const head = el('div', 'st-head');
  head.innerHTML = `<p class="kopf"><span class="time">${s.time}</span><span class="ort">${s.ort}</span></p><h2 id="${s.id}-h">${s.title}</h2>`
    + (s.mila ? `<div class="mila"><span class="k">Mila-Moment</span><p>${s.mila}</p></div>` : '');
  const side = el('div', 'st-side');
  if (s.idee) side.appendChild(el('div', 'idee', `<h3 class="k">${ICON.bulb}Die Idee dahinter</h3><p>${s.idee}</p>`));
  if (s.bisher) side.appendChild(el('div', 'compare', `<div class="was"><b>Bisher oft</b><p>${s.bisher}</p></div><div class="neu"><b>Unsere Idee</b><p>${s.unsere}</p></div>`));
  const media = el('div', 'st-media');
  const st = {s, i, sec, inner, head, side, media, d, hots:[], tags:[], open:null, xray:false};
  inner.append(head);
  if (d) safe('figure ' + s.id, () => buildFigure(st));
  if (st.fig) inner.append(media);
  inner.append(side);
  const tools = el('div', 'st-tools');
  // tap points as chips: same targets as the dots on the image, reachable by keyboard
  if (st.hots.length){
    const chips = el('div', 'chips', '<span>Tipp-Punkte</span>');
    st.hots.forEach((o, k) => { const c = el('button', 'chip', `<i></i>${o.h.l}`); c.type = 'button'; c.setAttribute('aria-pressed', 'false'); c.addEventListener('click', () => openDetail(st, k)); chips.appendChild(c); o.chip = c; });
    tools.appendChild(chips);
  }
  if (s.xray && st.fig){
    const xb = el('button', 'xbtn', ICON.gear + '<span>Was steckt dahinter?</span>'); xb.type = 'button'; xb.setAttribute('aria-pressed', 'false');
    const xl = el('ol', 'xlist'); xl.hidden = true; xl.id = s.id + '-x'; xb.setAttribute('aria-controls', xl.id);
    s.xray.items.filter(it => it.n).sort((a, b) => a.n - b.n).forEach(it => {
      const li = el('li', '', `<span>${it.n}</span><div>${it.t}</div>`); li.dataset.n = it.n;
      li.addEventListener('mouseenter', () => markX(st, it.n, true)); li.addEventListener('mouseleave', () => markX(st, it.n, false));
      xl.appendChild(li);
    });
    xb.addEventListener('click', () => toggleXray(st));
    tools.append(xb, xl); st.xbtn = xb; st.xlist = xl;
  }
  if (tools.children.length) (st.fig ? media : side).appendChild(tools);
  const det = el('div', 'detail'); det.hidden = true; st.det = det; inner.appendChild(det);
  const more = el('div', 'st-more');
  if (s.nutzen) more.appendChild(el('div', 'nutzen hy', `<h3 class="blk">Nutzen</h3><ul>${s.nutzen.map((t, j) => `<li><b>${ICON[NUTZEN_ICONS[j]]}${NUTZEN_ROLES[j]}</b><span>${t}</span></li>`).join('')}</ul>`));
  if (s.varianten && s.varianten.length) more.appendChild(buildVariants(s.varianten));
  if (s.daten || s.annahme){
    more.appendChild(el('details', 'more', `<summary><span>Mehr zur Idee</span><small>Daten und Einstellungen · Annahme und Test</small></summary>`
      + `<div class="more-body"><div><h4>Daten und Einstellungen</h4><p>${s.daten}</p></div><div><h4>Annahme und Test</h4><p>${s.annahme}</p></div></div>`));
  }
  if (s.ausblick) more.appendChild(el('div', 'outlook', `<h3 class="blk">Ausblick</h3><p>${s.ausblick}</p><p class="question">${s.frage}</p>`));
  inner.appendChild(more);
  wrap.appendChild(inner); sec.appendChild(wrap);
  ST.push(st);
  return sec;
}

function buildFigure(st){
  const {s, d, i} = st;
  const fig = el('figure', 'room');
  const frame = el('div', 'frame'); const zoomer = el('div', 'zoomer');
  const first = (s.mila || '').replace(/<[^>]+>/g, '').split(/(?<=[.!?])\s/)[0];
  const img = el('img'); img.src = d.img; img.alt = s.title + (first ? ': ' + first : ''); img.width = d.w; img.height = d.h; img.loading = i < 2 ? 'eager' : 'lazy'; img.decoding = 'async';
  const cv = el('canvas'); cv.width = d.mw || 10; cv.height = d.mh || 10;
  const ov = svg('svg', {class:'ov', viewBox:`0 0 ${d.w} ${d.h}`, preserveAspectRatio:'none', 'aria-hidden':'true'});
  const layer = el('div', 'layer');
  zoomer.append(img, cv, ov, layer); frame.appendChild(zoomer); fig.appendChild(frame);
  const tip = el('div', 'tip'); tip.hidden = true; fig.appendChild(tip);
  Object.assign(st, {fig, frame, zoomer, img, cv, ctx:cv.getContext('2d'), ov, layer, tip});
  (s.hots || []).forEach(h => {
    const ah = anchorHit(d, h.a); if (!ah) return;
    let p = ah.p; if (h.off && ah.name !== arr(h.a)[0]) p = [p[0] + h.off[0], p[1] + h.off[1]];
    if (!onImage(p, .02)) return;
    const k = st.hots.length;
    const b = el('button', 'hot', `<i></i><span>${h.l}</span>`); b.type = 'button';
    b.dataset.side = (h.side === 'left' || p[0] > .72) ? 'left' : 'right';
    b.style.left = (p[0]*100) + '%'; b.style.top = (p[1]*100) + '%';
    b.setAttribute('aria-label', h.l + (h.note ? ': Notiz' : ': Nahaufnahme'));
    b.addEventListener('click', e => { e.stopPropagation(); openDetail(st, k); });
    layer.appendChild(b); st.hots.push({h, b, p});
  });
  (s.bubbles || []).forEach((bu, bi) => {
    const p = anchor(d, bu.a); if (!onImage(p, .02)) return;
    const e = el('div', 'bubble' + (bi ? ' second' : ''), bu.t); e.setAttribute('aria-hidden', 'true');
    e.style.left = (p[0]*100) + '%'; e.style.top = (p[1]*100) + '%';
    layer.appendChild(e);
  });
  if (s.labels) st.tags = addTags(layer, d, s.labels);
  st.media.appendChild(fig);
  zoomer.addEventListener('pointermove', e => { if (e.pointerType === 'touch' || st.open) return; hover(st, e); });
  zoomer.addEventListener('pointerleave', () => setHover(st, null));
  zoomer.addEventListener('click', e => { if (st.open) return; const k = hitAt(st, e); if (k != null) openDetail(st, k); });
}

/* ================================================================ swipe variants */
const VARS = [];
function buildVariants(list){
  const box = el('div', 'var hy'); const id = 'v' + (VARS.length + 1);
  box.innerHTML = `<div class="var-head"><h3 class="blk" id="${id}">Varianten zum Wischen</h3><span class="var-count" aria-hidden="true">1 / ${list.length}</span>`
    + `<button type="button" class="var-btn prev" aria-label="Vorherige Variante">${ICON.left}</button><button type="button" class="var-btn next" aria-label="Nächste Variante">${ICON.right}</button></div>`;
  const track = el('div', 'var-track'); track.tabIndex = 0; track.setAttribute('role', 'region'); track.setAttribute('aria-labelledby', id);
  const ul = el('ul');
  list.forEach(([t, x]) => ul.appendChild(el('li', 'vcard' + (t === 'Inklusion' ? ' inkl' : ''), `<b>${t}</b><p>${x}</p>`)));
  track.appendChild(ul); box.appendChild(track);
  const cards = Array.from(ul.children); const prev = $('.prev', box), next = $('.next', box), cnt = $('.var-count', box);
  const base = () => cards[0].offsetLeft;
  const cur = () => { const sl = track.scrollLeft; let k = 0; cards.forEach((c, j) => { if (c.offsetLeft - base() <= sl + 8) k = j; }); return k; };
  const max = () => track.scrollWidth - track.clientWidth;
  const go = k => { k = clamp(k, 0, cards.length - 1); track.scrollTo({left:Math.min(cards[k].offsetLeft - base(), max()), behavior:reduce ? 'auto' : 'smooth'}); };
  const upd = () => {
    const end = track.scrollLeft >= max() - 4;
    cnt.textContent = (end ? cards.length : cur() + 1) + ' / ' + cards.length;
    prev.disabled = track.scrollLeft <= 2; next.disabled = end;
    track.classList.toggle('fade-r', !end); track.classList.toggle('fade-l', track.scrollLeft > 2);
  };
  prev.addEventListener('click', () => go(cur() - 1));
  next.addEventListener('click', () => go(cur() + 1));
  track.addEventListener('keydown', e => {
    const m = {ArrowRight:1, ArrowLeft:-1}[e.key];
    if (m){ e.preventDefault(); go(cur() + m); }
    else if (e.key === 'Home'){ e.preventDefault(); go(0); }
    else if (e.key === 'End'){ e.preventDefault(); go(cards.length - 1); }
  });
  let tk = false; track.addEventListener('scroll', () => { if (tk) return; tk = true; requestAnimationFrame(() => { tk = false; upd(); }); }, {passive:true});
  VARS.push(upd);
  return box;
}

/* Two gears that really mesh: same module m, pitch radii m*N/2, centre distance r1 + r2 plus a
   little backlash. Gear 2 starts half a tooth off along the centre line, so teeth sit in the gaps,
   and turns N1/N2 times as fast in the other direction (durations T and T*N2/N1). Checked offline:
   no overlap over a full mesh cycle. */
function gearPath(cx, cy, N, m, phase){
  const rp = m*N/2, ro = rp + .8*m, rr = rp - .95*m, hole = rp*.4, step = 2*Math.PI/N;
  const pt = (r, a) => (cx + r*Math.cos(a)).toFixed(2) + ' ' + (cy + r*Math.sin(a)).toFixed(2);
  const arc = (r, a0, a1, n) => { const o = []; for (let i = 1; i <= n; i++) o.push(pt(r, a0 + (a1 - a0)*i/n)); return o; };
  let d = 'M' + pt(rr, phase - step/2);
  for (let k = 0; k < N; k++){
    const c = phase + k*step;
    d += ' L' + arc(rr, c - step/2, c - .30*step, 3).join(' L');
    d += ' L' + pt(ro, c - .17*step) + ' L' + arc(ro, c - .17*step, c + .17*step, 4).join(' L');
    d += ' L' + pt(rr, c + .30*step) + ' L' + arc(rr, c + .30*step, c + step/2, 3).join(' L');
  }
  d += ' Z M' + pt(hole, 0) + ' A' + hole + ' ' + hole + ' 0 1 0 ' + pt(hole, Math.PI) + ' A' + hole + ' ' + hole + ' 0 1 0 ' + pt(hole, 0) + ' Z';
  return d;
}
function gearsSVG(){
  const N1 = 12, N2 = 8, m = 3.4, T = 10, th = -38*Math.PI/180;
  const c1 = [40, 57], dist = m*(N1 + N2)/2 + .8, c2 = [c1[0] + dist*Math.cos(th), c1[1] + dist*Math.sin(th)];
  const g = (c, N, ph, cls, t) => `<g class="${cls}" style="transform-origin:${c[0].toFixed(2)}px ${c[1].toFixed(2)}px;animation-duration:${t.toFixed(3)}s"><path fill="currentColor" fill-rule="evenodd" d="${gearPath(c[0], c[1], N, m, ph)}"/></g>`;
  return '<svg class="gears" viewBox="0 0 100 100" aria-hidden="true">' + g(c1, N1, th, 'gw1', T) + g(c2, N2, th + Math.PI + Math.PI/N2, 'gw2', T*N2/N1) + '</svg>';
}
ICON.gears = gearsSVG();

/* ================================================================ x-ray: numbers on the image, texts in the list */
function toggleXray(st, force){
  st.xray = force != null ? force : !st.xray;
  st.xbtn.setAttribute('aria-pressed', String(st.xray)); st.xlist.hidden = !st.xray; st.fig.classList.toggle('xray', st.xray);
  if (st.xray && st.open) closeDetail(st, true);
  drawXray(st); requestLayout();
  if (st.xray) setTimeout(() => {
    // Show the numbered list completely, but never push the top of the picture out of view.
    if (!st.xray) return;
    const f = st.fig.getBoundingClientRect(), l = st.xlist.getBoundingClientRect(), top = 70, bottom = innerHeight - 12;
    const over = l.bottom - bottom;   // > 0: the list is cut off at the bottom
    let dy = 0;
    if (over > 0) dy = Math.min(over, Math.max(0, f.top));            // list first, picture top stays on screen
    else if (f.top < top - 10) dy = Math.max(f.top - top, over);      // move up, but keep the list inside
    if (Math.abs(dy) > 4) scrollToY(scrollY + dy);
  }, 60);
}
function markX(st, n, on){
  st.layer.querySelectorAll(`.xr[data-n="${n}"]`).forEach(e => e.classList.toggle('hl', on));
  if (st.xlist) st.xlist.querySelectorAll(`li[data-n="${n}"]`).forEach(e => e.classList.toggle('hl', on));
}
function drawXray(st){
  if (!st.ov) return;
  st.ov.querySelectorAll('.xr').forEach(n => n.remove());
  st.layer.querySelectorAll('.xr').forEach(n => n.remove());
  if (!st.xray) return;
  const {d, s} = st; const X = s.xray; const W = d.w, H = d.h;
  const fw = st.zoomer.offsetWidth || 1, fh = st.zoomer.offsetHeight || 1;
  const toFrac = f => [clamp(f[0]*fw, 30, fw - 30)/fw, clamp(f[1]*fh, 30, fh - 30)/fh];
  const hub = toFrac(X.hub); const ext = X.ext ? toFrac(X.ext.at) : null;
  const g = svg('g', {class:'xr'}, st.ov);
  const wire = (a, b, out) => {
    const ax = a[0]*W, ay = a[1]*H, bx = b[0]*W, by = b[1]*H; const mx = (ax + bx)/2, my = Math.min(ay, by) - H*.08;
    const dd = `M${ax.toFixed(1)},${ay.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`;
    svg('path', {d:dd, class:'halo'}, g); svg('path', {d:dd, class:'wire' + (out ? ' out' : '')}, g);
  };
  const place = (n, f) => { n.style.left = (f[0]*100) + '%'; n.style.top = (f[1]*100) + '%'; st.layer.appendChild(n); return n; };
  const icons = [], nodes = [];
  let hubN = null, extN = null;
  X.items.forEach(it => {
    if (it.hub){ if (it.n) hubN = it.n; return; }
    if (it.ext){ if (ext) wire(ext, hub, it.dir === 'out'); if (it.n) extN = it.n; return; }
    const p = anchor(d, it.a); if (!onImage(p, 0)) return;
    wire(p, hub, it.dir === 'out');
    if (it.n){ const n = el('div', 'xnode xr', String(it.n)); n.dataset.n = it.n; nodes.push(place(n, p)); }
  });
  const hb = el('div', 'xicon xr xgears', ICON.gears + (hubN ? `<span class="xn">${hubN}</span>` : '')); if (hubN) hb.dataset.n = hubN; icons.push(place(hb, hub));
  if (ext){ const eb = el('div', 'xicon xr', (ICON[X.ext.icon] || ICON.cloud) + (extN ? `<span class="xn">${extN}</span>` : '')); if (extN) eb.dataset.n = extN; icons.push(place(eb, ext)); }
  // numbers never overlap each other or the icons
  const placed = icons.map(n => inflate(rect(n), 2)); const fb = rect(st.fig);
  nodes.forEach(n => {
    const r0 = rect(n);
    const C = [[0,0],[0,-30],[30,0],[-30,0],[0,30],[30,-30],[-30,-30],[30,30],[-30,30],[0,-60],[60,0],[-60,0]];
    for (const [dx, dy] of C){
      const r = shift(r0, dx, dy);
      if (r.left < fb.left + 2 || r.right > fb.right - 2 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      if (placed.some(q => hit(inflate(q, 3), r))) continue;
      if (dx || dy){ n.style.marginLeft = dx + 'px'; n.style.marginTop = dy + 'px'; }
      placed.push(r); return;
    }
    placed.push(r0);
  });
}

/* ================================================================ dots, labels and bubbles never overlap */
function fitStation(st){
  if (!st.fig || !st.fig.offsetParent) return;
  const fb = rect(st.fig);
  st.sec.classList.add('measuring');
  const live = st.sec.classList.contains('live'); if (!live) st.sec.classList.add('live');
  void st.sec.offsetWidth;
  // 1. dots apart from each other (44px tap targets)
  const dots = [];
  st.hots.forEach(o => {
    const b = o.b; b.style.marginLeft = ''; b.style.marginTop = '';
    const r0 = rect(b.querySelector('i'));
    const C = [[0,0],[0,34],[34,0],[-34,0],[0,-34],[30,30],[-30,30],[30,-30],[-30,-30],[0,60]];
    for (const [dx, dy] of C){
      const r = shift(r0, dx, dy); const cx = (r.left + r.right)/2, cy = (r.top + r.bottom)/2;
      if (cx < fb.left + 12 || cx > fb.right - 12 || cy < fb.top + 12 || cy > fb.bottom - 12) continue;
      if (dots.some(q => Math.hypot(q[0] - cx, q[1] - cy) < 40)) continue;
      if (dx || dy){ b.style.marginLeft = (dx - 22) + 'px'; b.style.marginTop = (dy - 22) + 'px'; }
      dots.push([cx, cy]); return;
    }
    dots.push([(r0.left + r0.right)/2, (r0.top + r0.bottom)/2]);
  });
  const dotRects = st.hots.map(o => inflate(rect(o.b.querySelector('i')), 7));
  // 2. labels: right or left of the dot, inside the image, clear of dots and other labels; else hidden
  const labels = [];
  st.hots.forEach((o, k) => {
    const b = o.b; const sp = b.querySelector('span'); b.classList.remove('nolabel');
    if (!sp || getComputedStyle(sp).display === 'none'){ return; }
    const order = b.dataset.side === 'left' ? [true, false] : [false, true];
    let ok = false;
    for (const left of order){
      b.classList.toggle('left', left);
      const r = rect(sp);
      if (r.left < fb.left + 4 || r.right > fb.right - 4 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      if (dotRects.some((q, j) => j !== k && hit(q, r))) continue;
      if (labels.some(q => hit(inflate(q, 3), r))) continue;
      labels.push(r); ok = true; break;
    }
    if (!ok) b.classList.add('nolabel');
  });
  const obs = dotRects.concat(labels);
  // 3. image tags (house labels)
  if (st.tags.length){ fitTags(st.fig, st.tags, obs); st.tags.forEach(t => { if (!t.hidden) obs.push(inflate(rect(t), 3)); }); }
  // 4. speech bubbles: first free spot near the speaker, otherwise hidden
  st.layer.querySelectorAll('.bubble').forEach(n => {
    n.classList.remove('nofit', 'below'); n.style.marginLeft = '0px'; n.style.marginTop = '0px'; n.style.removeProperty('--tail');
    if (getComputedStyle(n).display === 'none') return;
    let r0 = rect(n);
    if (r0.top < fb.top + 4){ n.classList.add('below'); r0 = rect(n); }
    const C = [[0,0],[0,-24],[-80,-12],[80,-12],[-120,6],[120,6],[0,-50],[-60,-44],[60,-44],[0,-80],[-150,-30],[150,-30],[-100,-70],[100,-70],[-190,0],[190,0],[0,-110],[-70,-110],[70,-110],[0,-140],[-90,-140],[90,-140]];
    let best = null;
    for (const [dx0, dy] of C){
      let r = shift(r0, dx0, dy); let dx = dx0;
      if (r.left < fb.left + 4) dx += fb.left + 4 - r.left; else if (r.right > fb.right - 4) dx -= r.right - fb.right + 4;
      r = shift(r0, dx, dy);
      if (r.left < fb.left + 2 || r.right > fb.right - 2 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      if (obs.some(o => hit(o, r))) continue;
      best = [dx, dy, r]; break;
    }
    if (!best){ n.classList.add('nofit'); return; }
    const [dx, dy, r] = best;
    n.style.marginLeft = dx + 'px'; n.style.marginTop = dy + 'px';
    const bw = r0.right - r0.left; n.style.setProperty('--tail', clamp(bw/2 - dx, 16, bw - 16) + 'px');
    obs.push(inflate(r, 4));
  });
  if (!live) st.sec.classList.remove('live');
  void st.sec.offsetWidth; st.sec.classList.remove('measuring');
}

/* ================================================================ hover masks */
function loadMask(st){
  if (st.mask || !st.d.mask || !st.d.colors) return; st.mask = {ready:false};
  const im = new Image();
  im.onload = () => {
    const W = st.d.mw, H = st.d.mh; const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d', {willReadFrequently:true}); x.drawImage(im, 0, 0, W, H);
    const px = x.getImageData(0, 0, W, H).data; const k2h = {}; const hidIdx = {}; const hids = [null];
    Object.keys(st.d.colors).forEach(h => { const [r, g, b] = st.d.colors[h]; const i = hids.length; hids.push(h); hidIdx[h] = i; k2h[(r>>5) + 8*(g>>5) + 64*(b>>6)] = i; });
    const lab = new Uint8Array(W*H);
    for (let p = 0, q = 0; p < lab.length; p++, q += 4){ if (px[q+3] < 128) continue; const i = k2h[(px[q]>>5) + 8*(px[q+1]>>5) + 64*(px[q+2]>>6)]; if (i) lab[p] = i; }
    Object.assign(st.mask, {ready:true, lab, W, H, hids, hidIdx, cache:{}});
  };
  im.src = st.d.mask;
}
function hitAt(st, e){
  const m = st.mask; if (!m || !m.ready) return null;
  const r = st.zoomer.getBoundingClientRect(); const u = (e.clientX - r.left)/r.width, v = (e.clientY - r.top)/r.height;
  if (u < 0 || v < 0 || u >= 1 || v >= 1) return null;
  const hid = m.hids[m.lab[Math.floor(v*m.H)*m.W + Math.floor(u*m.W)]];
  if (!hid) return null;
  const k = st.hots.findIndex(o => arr(o.h.hid).includes(hid)); return k >= 0 ? k : null;
}
function outline(st, hid){
  const m = st.mask; if (m.cache[hid]) return m.cache[hid];
  const k = m.hidIdx[hid], W = m.W, H = m.H, L = m.lab;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const img = x.createImageData(W, H); const d = img.data;
  const t = document.createElement('canvas').getContext('2d'); t.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--spot').trim() || '#c3405d'; t.fillRect(0, 0, 1, 1); const [R, G, B] = t.getImageData(0, 0, 1, 1).data;
  const w = 2;
  for (let y = w; y < H - w; y++) for (let xx = w; xx < W - w; xx++){
    const p = y*W + xx; if (L[p] !== k) continue;
    const edge = L[p-w] !== k || L[p+w] !== k || L[p-w*W] !== k || L[p+w*W] !== k;
    const q = p*4; d[q] = R; d[q+1] = G; d[q+2] = B; d[q+3] = edge ? 255 : 46;
  }
  x.putImageData(img, 0, 0); m.cache[hid] = c; return c;
}
function hover(st, e){ loadMask(st); setHover(st, hitAt(st, e), e); }
function setHover(st, k, e){
  if (!st.fig) return;
  if (k !== st.hk){
    st.hk = k; st.ctx.clearRect(0, 0, st.cv.width, st.cv.height);
    if (k != null && st.mask && st.mask.ready){ const hid = arr(st.hots[k].h.hid).find(h => h in st.mask.hidIdx); if (hid) st.ctx.drawImage(outline(st, hid), 0, 0); }
    st.fig.classList.toggle('hovering', k != null);
  }
  if (k != null && e){
    const r = st.fig.getBoundingClientRect(); const h = st.hots[k].h;
    st.tip.innerHTML = h.l + `<small>${h.note ? 'Notiz' : 'Nahaufnahme'}</small>`;
    st.tip.style.left = (e.clientX - r.left) + 'px'; st.tip.style.top = (e.clientY - r.top) + 'px'; st.tip.hidden = false;
  } else st.tip.hidden = true;
}

/* ================================================================ detail panel ("Nahaufnahme") */
let openSt = null;
function openDetail(st, k){
  clearTimeout(settleT); cancelAnimationFrame(pAnim);
  if (openSt && openSt !== st) closeDetail(openSt, true);
  const o = st.hots[k]; const h = o.h; const D = h.d ? DETAILS[h.d] : null;
  if (!h.note && !D) return;
  st.hots.forEach((x, j) => { x.b.classList.toggle('active', j === k); if (x.chip) x.chip.setAttribute('aria-pressed', String(j === k)); });
  setHover(st, null);
  if (st.xray) toggleXray(st, false);
  zoomTo(st, [o.p[0], o.p[1]], mobile() ? 1.9 : 2.2);
  st.fig.classList.add('zoomed');
  st.open = {k, d:h.d, step:h.step || 0};
  const det = st.det; det.innerHTML = ''; det.hidden = false; det.classList.toggle('is-note', !!h.note);
  det.setAttribute('role', 'region'); det.setAttribute('aria-label', (h.note ? 'Notiz: ' + h.l : 'Nahaufnahme: ' + D.title));
  const head = el('div', 'd-head', `<span class="kicker">${h.note ? 'Notiz' : 'Nahaufnahme'}</span><h3>${h.note ? h.l : D.title}</h3>`);
  const close = el('button', 'd-close', 'Schließen'); close.type = 'button'; close.addEventListener('click', () => closeDetail(st)); head.appendChild(close);
  det.appendChild(head);
  if (h.note){
    det.appendChild(el('div', 'note-body', `<p>${h.note}</p>`));
  } else {
    const body = el('div', 'd-body');
    const stage = el('div', 'd-stage'); const i1 = el('img', 'on'), i2 = el('img', 'off'); i1.alt = ''; i2.alt = '';
    const sv = svg('svg', {class:'ov', viewBox:'0 0 1400 1008', preserveAspectRatio:'none', 'aria-hidden':'true'}); const lay = el('div', 'layer');
    stage.append(i1, i2, sv, lay);
    const steps = el('div', 'd-steps'); const dots = el('ol', 'd-dots'); const extra = el('div', 'd-extra'); const text = el('div', 'd-text'); text.setAttribute('aria-live', 'polite');
    const nav = el('div', 'd-nav', '<button type="button" class="prev">Zurück</button><button type="button" class="next">Weiter</button><button type="button" class="auto" aria-pressed="false">Abspielen</button>');
    D.steps.forEach((s, j) => { const li = el('li'); const b = el('button', '', String(j + 1)); b.type = 'button'; b.setAttribute('aria-label', 'Schritt ' + (j + 1)); b.addEventListener('click', () => showStep(st, j)); li.appendChild(b); dots.appendChild(li); });
    steps.append(dots, extra, text, nav); body.append(stage, steps); det.appendChild(body);
    Object.assign(st.open, {stage, imgs:[i1, i2], sv, lay, dots, extra, text, nav});
    nav.querySelector('.prev').addEventListener('click', () => showStep(st, st.open.step - 1));
    nav.querySelector('.next').addEventListener('click', () => { const n = D.steps.length; showStep(st, st.open.step + 1 < n ? st.open.step + 1 : 0); });
    nav.querySelector('.auto').addEventListener('click', e => toggleAuto(st, e.currentTarget));
    // One handler per panel: det is reused, so assign instead of adding a listener on every open.
    det.onkeydown = e => {
      if (!st.open || !st.open.stage) return;
      if (e.key === 'ArrowRight'){ e.preventDefault(); showStep(st, Math.min(st.open.step + 1, D.steps.length - 1)); }
      if (e.key === 'ArrowLeft'){ e.preventDefault(); showStep(st, Math.max(st.open.step - 1, 0)); }
    };
    showStep(st, st.open.step, true);
  }
  openSt = st;
  requestLayout();
  close.focus({preventScroll:true});
  setTimeout(() => {
    if (!st.open) return;
    const r = det.getBoundingClientRect(); const top = 64, bottom = innerHeight - 12;
    let dy = 0;
    if (r.height > bottom - top || r.top < top) dy = r.top - top;
    else if (r.bottom > bottom) dy = r.bottom - bottom;
    if (Math.abs(dy) > 4) scrollToY(scrollY + dy);
  }, reduce ? 0 : 420);
}
function closeDetail(st, quiet){
  if (!st.open) return;
  clearInterval(st.auto); st.auto = null;
  const k = st.open.k;
  st.open = null; st.det.hidden = true; st.det.innerHTML = '';
  st.hots.forEach(x => { x.b.classList.remove('active'); if (x.chip) x.chip.setAttribute('aria-pressed', 'false'); });
  st.fig.classList.remove('zoomed'); zoomTo(st, null, 1);
  if (openSt === st) openSt = null;
  requestLayout();
  if (!quiet){
    const r = st.fig.getBoundingClientRect(); if (r.top < 60 || r.bottom > innerHeight) scrollToY(scrollY + r.top - 80);
    const o = st.hots[k]; if (o && o.chip) o.chip.focus({preventScroll:true});
  }
}
function zoomTo(st, p, s){
  if (!p || s <= 1){ st.zoomer.style.transform = ''; st.zoomer.style.setProperty('--zs', 1); return; }
  let tx = .5 - p[0]*s, ty = .5 - p[1]*s;
  tx = clamp(tx, 1 - s, 0); ty = clamp(ty, 1 - s, 0);
  st.zoomer.style.transform = `translate(${tx*100}%, ${ty*100}%) scale(${s})`; st.zoomer.style.setProperty('--zs', s);
}
function toggleAuto(st, btn){
  if (st.auto){ clearInterval(st.auto); st.auto = null; btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Abspielen'; return; }
  btn.setAttribute('aria-pressed', 'true'); btn.textContent = 'Pause';
  st.auto = setInterval(() => {
    if (!st.open){ clearInterval(st.auto); return; }
    const n = DETAILS[st.open.d].steps.length;
    if (st.open.step >= n - 1){ clearInterval(st.auto); st.auto = null; btn.setAttribute('aria-pressed', 'false'); btn.textContent = 'Abspielen'; return; }
    showStep(st, st.open.step + 1);
  }, 5600);
}
function showStep(st, j, first){
  const O = st.open; const steps = DETAILS[O.d].steps; j = clamp(j, 0, steps.length - 1); O.step = j;
  const s = steps[j];
  const I = imgData(s.img, s.need) || imgData(st.s.room); if (!I) return;
  const data = I.data, src = data.img;
  let zoom = null;
  if (I.room && s.zoom){ const zp = anchor(data, s.zoom[0]); if (zp) zoom = [zp, s.zoom[1]]; }
  const [a, b] = O.imgs; const curImg = a.classList.contains('on') ? a : b; const nxt = curImg === a ? b : a;
  const apply = im => {
    im.style.objectFit = I.room ? 'contain' : 'cover';
    if (zoom){ im.style.transformOrigin = `${zoom[0][0]*100}% ${zoom[0][1]*100}%`; im.style.transform = `scale(${zoom[1]})`; }
    else { im.style.transform = ''; im.style.transformOrigin = ''; }
  };
  if (first){ curImg.src = src; apply(curImg); }
  else if (curImg.getAttribute('src') !== src){ nxt.src = src; apply(nxt); nxt.classList.replace('off', 'on'); curImg.classList.replace('on', 'off'); }
  else apply(curImg);
  O.sv.setAttribute('viewBox', `0 0 ${data.w} ${data.h}`);
  O.stage.style.aspectRatio = `${data.w}/${data.h}`;
  O.dots.querySelectorAll('button').forEach((bt, k) => { bt.setAttribute('aria-current', String(k === j)); if (k <= j) bt.classList.add('seen'); });
  O.text.innerHTML = (s.ev ? '<span class="ev">Woran wir merken würden, ob es wirkt</span>' : '') + `<p>${s.t}</p>`
    + (s.src ? `<p style="margin-top:8px"><a href="${s.src[1]}">Quelle: ${s.src[0]}</a></p>` : '');
  O.nav.querySelector('.prev').disabled = j === 0;
  O.nav.querySelector('.next').textContent = j === steps.length - 1 ? 'Von vorn' : 'Weiter';
  // overlays
  O.sv.innerHTML = ''; O.lay.innerHTML = ''; O.extra.innerHTML = '';
  const W = data.w, H = data.h;
  const P = names => { const p = anchor(data, names); if (!p) return null; const q = zoom ? [zoom[0][0] + (p[0] - zoom[0][0])*zoom[1], zoom[0][1] + (p[1] - zoom[0][1])*zoom[1]] : p; return onImage(q, 0) ? q : null; };
  const at = (e, p, dx, dy) => { e.style.left = `calc(${p[0]*100}% + ${dx || 0}px)`; e.style.top = `calc(${p[1]*100}% + ${dy || 0}px)`; };
  const inline = mobile();
  (s.ov || []).forEach(o => {
    if (o.pulse){ const p = P(o.pulse); if (p){ const e = el('div', 'pulse'); at(e, p); O.lay.appendChild(e); } }
    else if (o.chip){ const p = P(o.chip); if (p){ const e = el('div', 'dchip' + (o.cls ? ' ' + o.cls : ''), o.t); e.dataset.side = o.side || ''; at(e, p, 0, o.dy); O.lay.appendChild(e); } }
    else if (o.bubble){ const p = P(o.bubble); if (p){ const e = el('div', 'bubble', o.t); at(e, p); if (o.d) e.style.animationDelay = o.d + 's'; O.lay.appendChild(e); } }
    else if (o.phone){ const e = el('div', 'phone', `<div class="scr">${PHONES[o.phone]}</div>`); (inline ? O.extra : O.lay).appendChild(e); }
    else if (o.paper){ const e = el('div', 'paper', PAPERS[o.paper]); (inline ? O.extra : O.lay).appendChild(e); }
    else if (o.cube){ const p = P(o.cube); if (p){ const e = el('div', 'pw' + (o.to === 'frage' ? ' still' : ''), '<i class="a">?</i><i class="b"></i>'); at(e, p, 0, o.dy == null ? -58 : o.dy); O.lay.appendChild(e); } }
    else if (o.air){
      // draught: wavy lines from the window across the room, sized to the image
      const p = P(o.air); if (p){
        const dir = p[0] > .5 ? -1 : 1, wl = W*.07*dir, amp = H*.025, n = 6;
        for (let k = 0; k < 3; k++){
          const x0 = p[0]*W - dir*W*.02, y0 = p[1]*H + (k - .5)*H*.09;
          let d = `M${x0.toFixed(1)},${y0.toFixed(1)}`;
          for (let i = 0; i < n; i++) d += ` q${(wl/4).toFixed(1)},${(-amp).toFixed(1)} ${(wl/2).toFixed(1)},0 t${(wl/2).toFixed(1)},0`;
          const pa = svg('path', {d, class:'wire air'}, O.sv); pa.style.animationDuration = (1.2 + k*.25) + 's';
        }
      }
    }
    else if (o.cloud){
      const p = P(o.cloud); const c = el('div', 'xcloud', `${ICON.cloud}<span>${o.t}</span>`); c.style.left = '4%'; c.style.top = '5%'; O.lay.appendChild(c);
      if (p){ const x = p[0]*W, y = p[1]*H; const cx = .04*W + 90, cy = .05*H + 40; const dd = `M${cx},${cy} Q${(cx + x)/2},${Math.min(cy, y) - 40} ${x},${y}`; svg('path', {d:dd, class:'halo'}, O.sv); svg('path', {d:dd, class:'wire'}, O.sv); }
    }
    else if (o.ring){ const pts = data.paths && data.paths[o.ring]; if (pts && !zoom){ ringAnim(O.sv, pts.map(p => [p[0]*W, p[1]*H]), o.dur || 5, o.done); } }
  });
  requestAnimationFrame(() => resolveStage(O));
}
/* chips, bubbles, the cloud and the Planwürfel stay inside the image and apart; never overlap */
function resolveStage(O, later){
  if (!O || !O.stage || !O.stage.offsetParent) return;
  // measure final sizes: right after a step change restart the pop-in, on later passes just finish it
  $$('.dchip,.bubble,.xcloud,.pw,.phone,.paper', O.lay).forEach(n => { if (later) n.getAnimations().forEach(a => { if (a.animationName !== 'flipA' && a.animationName !== 'flipB') a.finish(); }); else n.style.animation = 'none'; });
  void O.stage.offsetWidth;
  const box = rect(O.stage);
  const placed = $$('.phone,.paper', O.lay).map(n => inflate(rect(n), 4));
  $$('.pulse', O.lay).forEach(n => placed.push(inflate(rect(n), -14)));
  $$('.xcloud,.pw,.dchip,.bubble', O.lay).forEach(n => {
    n.hidden = false; n.style.marginLeft = ''; n.style.marginTop = ''; n.classList.remove('below'); n.style.removeProperty('--tail');
    let r0 = rect(n);
    if (n.classList.contains('bubble') && r0.top < box.top + 4){ n.classList.add('below'); r0 = rect(n); }
    const w = r0.right - r0.left;
    const side = n.dataset.side === 'left' ? -1 : (n.dataset.side === 'right' ? 1 : 0);
    const C = side ? [[side*(w/2 + 40), 0], [side*(w/2 + 40), -30], [side*(w/2 + 40), 30], [-side*(w/2 + 40), 0], [0, -40], [0, 40]]
                   : [[0,0],[0,-30],[0,30],[-60,0],[60,0],[0,-60],[0,60],[-90,-30],[90,-30],[-90,30],[90,30],[0,-90],[0,90],[-140,0],[140,0]];
    let best = null;
    for (const [dx0, dy0] of C){
      let dx = dx0, dy = dy0; let r = shift(r0, dx, dy);
      if (r.left < box.left + 6) dx += box.left + 6 - r.left; else if (r.right > box.right - 6) dx -= r.right - box.right + 6;
      if (r.top < box.top + 4) dy += box.top + 4 - r.top; else if (r.bottom > box.bottom - 4) dy -= r.bottom - box.bottom + 4;
      r = shift(r0, dx, dy);
      if (r.left < box.left + 2 || r.right > box.right - 2 || r.top < box.top + 2 || r.bottom > box.bottom - 2) continue;
      if (placed.some(q => hit(q, r))) continue;
      best = [dx, dy, r]; break;
    }
    if (!best){ n.hidden = true; return; }
    const [dx, dy, r] = best;
    n.style.marginLeft = dx + 'px'; n.style.marginTop = dy + 'px';
    if (n.classList.contains('bubble')) n.style.setProperty('--tail', clamp(w/2 - dx, 16, w - 16) + 'px');
    placed.push(inflate(r, 4));
  });
  if (!later) $$('.dchip,.bubble,.xcloud,.pw,.phone,.paper', O.lay).forEach(n => { n.style.animation = ''; });
}
function ringAnim(sv, pts, dur, done){
  const d = 'M' + pts.map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  const id = 'r' + Math.random().toString(36).slice(2, 7);
  svg('path', {d, fill:'none', stroke:'rgba(40,30,20,.28)', 'stroke-width':20, 'stroke-linecap':'round'}, sv);
  const prog = svg('path', {d, id, fill:'none', stroke:done ? '#2fbf6b' : '#46d27f', 'stroke-width':13, 'stroke-linecap':'round'}, sv);
  const L = prog.getTotalLength(); prog.style.strokeDasharray = L; prog.style.strokeDashoffset = done ? 0 : L;
  if (!done && !reduce){ prog.animate([{strokeDashoffset:L}, {strokeDashoffset:0}], {duration:dur*1000, iterations:Infinity, easing:'linear'}); }
  else if (!done) prog.style.strokeDashoffset = 0;
  const bug = svg('g', {}, sv);
  svg('ellipse', {rx:24, ry:19, fill:'#d8342c', stroke:'#2a1a12', 'stroke-width':3}, bug);
  svg('line', {x1:-22, y1:0, x2:22, y2:0, stroke:'#2a1a12', 'stroke-width':3}, bug);
  svg('circle', {r:10, cx:24, cy:0, fill:'#2a1a12'}, bug);
  [[-9,-9],[-9,9],[7,-10],[7,10]].forEach(([x, y]) => svg('circle', {r:4.5, cx:x, cy:y, fill:'#2a1a12'}, bug));
  if (!reduce && !done){ const am = svg('animateMotion', {dur:dur + 's', repeatCount:'indefinite', rotate:'auto'}, bug); const mp = svg('mpath', {}, am); mp.setAttribute('href', '#' + id); }
  else bug.setAttribute('transform', `translate(${pts[pts.length - 1][0]},${pts[pts.length - 1][1]})`);
}

/* ================================================================ Fach und Cube figure */
const FACH = {};
function buildFach(){
  const I = imgData(FACH_FIG.img); if (!I) return;
  const box = $('#fach-fig'), fig = $('#fach-img'), legend = $('#fach-legend'); if (!box) return;
  const img = el('img'); img.src = I.data.img; img.width = I.data.w; img.height = I.data.h; img.alt = FACH_FIG.alt; img.loading = 'lazy'; img.decoding = 'async';
  fig.appendChild(img);
  let n = 0; const dots = [];
  FACH_FIG.items.forEach(it => {
    if (it.only && it.only !== I.name) return;
    const p = anchor(I.data, it.a); if (!onImage(p, .02)) return;
    n++;
    const dt = el('span', 'fdot', String(n)); dt.setAttribute('aria-hidden', 'true'); dt.style.left = (p[0]*100) + '%'; dt.style.top = (p[1]*100) + '%'; fig.appendChild(dt); dots.push(dt);
    legend.appendChild(el('li', '', `<span aria-hidden="true">${n}</span>${it.t}`));
  });
  if (!n) legend.hidden = true;
  if (n <= 3) box.classList.add('few');
  box.hidden = false;
  FACH.fig = fig; FACH.dots = dots;
}
function fitFach(){
  if (!FACH.fig || !FACH.fig.offsetParent) return;
  const placed = []; const fb = rect(FACH.fig);
  FACH.dots.forEach(d => {
    d.style.marginLeft = ''; d.style.marginTop = ''; const r0 = rect(d); const k = r0.right - r0.left + 3;
    for (const [dx, dy] of [[0,0],[0,-k],[k,0],[-k,0],[0,k],[k,-k],[-k,-k],[k,k],[-k,k],[0,-2*k],[2*k,0],[-2*k,0],[0,2*k]]){
      const r = shift(r0, dx, dy);
      if (r.left < fb.left + 2 || r.right > fb.right - 2 || r.top < fb.top + 2 || r.bottom > fb.bottom - 2) continue;
      if (placed.some(q => hit(inflate(q, 2), r))) continue;
      if (dx || dy){ d.style.marginLeft = dx + 'px'; d.style.marginTop = dy + 'px'; }
      placed.push(r); return;
    }
    placed.push(r0);
  });
}

/* ================================================================ card sets: the whole card opens "Mehr" */
function setupCards(){
  $$('.kcard').forEach(c => {
    const det = $('details.mehr', c); if (!det) return;
    c.classList.add('has-more');
    c.addEventListener('click', e => { if (e.target.closest('a, summary, button, details > div')) return; det.open = !det.open; });
  });
  $$('details').forEach(d => d.addEventListener('toggle', () => requestLayout()));
}

/* ================================================================ Weg einer Idee: stepper */
function setupWeg(){
  const weg = $('#weg'); if (!weg) return;
  const track = $('.weg-track', weg), nav = $('.weg-nav', weg); const nodes = $$('.weg-node', weg), steps = $$('.weg-steps li', weg);
  if (!nodes.length || nodes.length !== steps.length) return;
  weg.classList.add('js'); track.hidden = false; nav.hidden = false;
  const prev = $('.prev', nav), next = $('.next', nav), auto = $('.auto', nav); let cur = 0, timer = null;
  const roleCards = $$('#roles .kcard[data-role]');
  nodes.forEach((n, j) => n.setAttribute('aria-label', 'Schritt ' + (j + 1) + ': ' + n.textContent.trim()));
  const show = i => {
    cur = clamp(i, 0, steps.length - 1);
    nodes.forEach((n, j) => { n.setAttribute('aria-current', j === cur ? 'step' : 'false'); n.classList.toggle('done', j < cur); });
    steps.forEach((s, j) => s.classList.toggle('on', j === cur));
    track.style.setProperty('--k', cur / (steps.length - 1));
    prev.disabled = cur === 0; next.textContent = cur === steps.length - 1 ? 'Von vorn' : 'Weiter';
    const roles = (steps[cur].dataset.roles || '').split(' ');
    roleCards.forEach(c => c.classList.toggle('lit', c.dataset.role.split(' ').some(r => roles.includes(r))));
  };
  const stopAuto = () => { clearInterval(timer); timer = null; auto.setAttribute('aria-pressed', 'false'); auto.textContent = 'Abspielen'; };
  nodes.forEach((n, j) => n.addEventListener('click', () => { stopAuto(); show(j); }));
  prev.addEventListener('click', () => { stopAuto(); show(cur - 1); });
  next.addEventListener('click', () => { stopAuto(); show(cur + 1 < steps.length ? cur + 1 : 0); });
  auto.addEventListener('click', () => {
    if (timer){ stopAuto(); return; }
    auto.setAttribute('aria-pressed', 'true'); auto.textContent = 'Pause';
    if (cur === steps.length - 1) show(0);
    timer = setInterval(() => { if (cur >= steps.length - 1){ stopAuto(); return; } show(cur + 1); }, 5200);
  });
  weg.addEventListener('keydown', e => {
    if (e.target.closest('.weg-track') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')){
      e.preventDefault(); stopAuto(); show(cur + (e.key === 'ArrowRight' ? 1 : -1)); nodes[cur].focus();
    }
  });
  show(0);
}

/* ================================================================ thread */
const flow = $('#flow'), thread = $('#thread');
let TH = null;
function railX(){ return mobile() ? 26 : Math.max(0, (flow.clientWidth - 1180)/2) + 16 + 30; }
function offsetIn(node, anc){ let x = 0, y = 0, n = node; while (n && n !== anc){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return [x, y]; }
function layoutThread(){
  const W = flow.clientWidth, H = flow.scrollHeight; thread.setAttribute('viewBox', `0 0 ${W} ${H}`); thread.style.height = H + 'px';
  const rx = railX(); const pts = []; const knots = [];
  const [, hy] = offsetIn($('#start'), flow); pts.push([rx, hy + 40, 'r']);
  ST.forEach(st => {
    const [, ty] = offsetIn(st.head.querySelector('.time') || st.head, flow);
    let ky = ty + 12;
    if (!st.fig){ knots.push([rx, ky, st]); pts.push([rx, ky, 'r']); return; }
    const [fx, fy] = offsetIn(st.fig, flow); const fw = st.fig.offsetWidth, fh = st.fig.offsetHeight;
    if (!mobile()) ky = Math.min(ky, fy + 10);
    knots.push([rx, ky, st]);
    const pin = anchor(st.d, 'in'), pout = anchor(st.d, ['corner_l', 'out']);
    pts.push([rx, ky, 'r']);
    if (pin && pout){
      pts.push([fx + pin[0]*fw, fy + pin[1]*fh, 'i']);
      pts.push([fx + pout[0]*fw, fy + pout[1]*fh, 'o']); pts.push([rx, fy + pout[1]*fh + (mobile() ? 46 : 80), 'r']);
    }
  });
  const end = $('#ziele'); const [, ey] = offsetIn(end, flow); pts.push([rx, ey + 30, 'r']);
  const d = threadPath(pts);
  thread.innerHTML = '';
  svg('path', {d, class:'route'}, thread); const done = svg('path', {d, class:'done'}, thread);
  const L = done.getTotalLength(); done.style.strokeDasharray = L; done.style.strokeDashoffset = L;
  knots.forEach(([x, y, st]) => { st.knot = svg('circle', {cx:x, cy:y, r:7, class:'knot'}, thread); st.knotY = y; });
  const head = svg('g', {class:'head'}, thread);
  svg('circle', {r:13, style:'fill:var(--card);stroke:var(--thread);stroke-width:2.5'}, head);
  svg('circle', {r:4.2, cx:-11, cy:-3, fill:'#b98a52'}, head); svg('circle', {r:4.2, cx:11, cy:-3, fill:'#b98a52'}, head);
  svg('circle', {r:8.5, fill:'#f3cfac'}, head); svg('path', {d:'M-8.5,-1 a8.5,8.5 0 0 1 17,0 q-8.5,-5 -17,0z', fill:'#b98a52'}, head);
  svg('circle', {r:1.3, cx:-3, cy:1.5, fill:'#2a1d12'}, head); svg('circle', {r:1.3, cx:3, cy:1.5, fill:'#2a1d12'}, head);
  svg('path', {d:'M-2.5,4.5 q2.5,2.2 5,0', fill:'none', stroke:'#8a3b2f', 'stroke-width':1.1, 'stroke-linecap':'round'}, head);
  const samples = []; const step = 10; let maxY = -1e9;
  for (let l = 0; l <= L; l += step){ const p = done.getPointAtLength(l); maxY = Math.max(maxY, p.y); samples.push([l, maxY]); }
  TH = {done, L, samples, head, knots};
  onScroll();
}
function threadPath(p){
  if (p.length < 2) return '';
  const f = v => v.toFixed(1);
  let d = `M${f(p[0][0])},${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++){
    const A = p[i], B = p[i + 1]; const dx = B[0] - A[0], dy = B[1] - A[1];
    if (A[2] === 'r' && B[2] === 'i'){ d += ` C${f(A[0])},${f(A[1] + Math.max(30, dy*0.6))} ${f(B[0] - Math.max(30, Math.abs(dx)*0.7))},${f(B[1])} ${f(B[0])},${f(B[1])}`; }
    else if (A[2] === 'o' && B[2] === 'r'){ d += ` C${f(A[0] - Math.max(24, Math.abs(dx)*0.6))},${f(A[1] + dy*0.15)} ${f(B[0])},${f(B[1] - Math.max(20, dy*0.6))} ${f(B[0])},${f(B[1])}`; }
    else d += ` L${f(B[0])},${f(B[1])}`;
  }
  return d;
}

/* ================================================================ scroll, layout */
let ticking = false, layoutPending = false;
function layoutAll(){
  if (HERO.fig) fitTags(HERO.fig, HERO.tags);
  ST.forEach(st => { safe('fit ' + st.s.id, () => { fitStation(st); if (st.xray) drawXray(st); }); });
  if (openSt && openSt.open && openSt.open.stage) resolveStage(openSt.open, true);
  fitFach();
  VARS.forEach(u => u());
  layoutThread();
}
function requestLayout(){ if (layoutPending) return; layoutPending = true; setTimeout(() => { layoutPending = false; layoutAll(); }, reduce ? 30 : 820); }
function onScroll(){
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    const vh = innerHeight, sy = scrollY;
    ST.forEach(st => {
      if (!st.fig || reduce) return;
      const r = st.fig.getBoundingClientRect(); const top = r.top - (parseFloat(st.frame.dataset.off) || 0);
      const p = clamp((vh - top) / (vh*0.5), 0, 1);
      const off = (1 - p) * 70; st.frame.dataset.off = off;
      st.frame.style.setProperty('--slide', `translateY(${off.toFixed(1)}px) scale(${(0.96 + 0.04*p).toFixed(3)})`);
      st.frame.style.setProperty('--fade', (0.45 + 0.55*p).toFixed(3));
    });
    if (TH){
      const fy = flow.getBoundingClientRect().top + sy; const target = sy + vh*0.58 - fy;
      const S = TH.samples; let lo = 0, hi = S.length - 1;
      while (lo < hi){ const m = (lo + hi + 1) >> 1; if (S[m][1] <= target) lo = m; else hi = m - 1; }
      const len = reduce ? TH.L : S[lo][0];
      TH.done.style.strokeDashoffset = TH.L - len;
      const hp = TH.done.getPointAtLength(len); TH.head.setAttribute('transform', `translate(${hp.x.toFixed(1)},${hp.y.toFixed(1)})`);
      let cur = -1; TH.knots.forEach(([x, y, st], k) => { const on = y <= target + 2; st.knot.classList.toggle('on', on); if (on) cur = k; });
      const st = cur >= 0 ? ST[cur] : null;
      $('#now-t').textContent = st ? st.s.time : ''; $('#now-l').textContent = st ? st.s.label : 'Ein Dienstag im Februar';
    }
    const docH = document.documentElement.scrollHeight - vh; $('#prog').style.width = (docH > 0 ? sy/docH*100 : 0) + '%';
  });
}
addEventListener('scroll', onScroll, {passive:true});
let rw = innerWidth;
addEventListener('resize', () => { if (Math.abs(innerWidth - rw) < 2 && openSt) return; rw = innerWidth; requestLayout(); });

/* ================================================================ Weiter: jump to the next stop */
function scrollToY(y, dur){
  y = clamp(y, 0, document.documentElement.scrollHeight - innerHeight);
  if (reduce){ scrollTo(0, y); return; }
  cancelAnimationFrame(pAnim); const y0 = scrollY, dy = y - y0; const T = dur || clamp(Math.abs(dy)*0.9, 450, 1400); const t0 = performance.now();
  const stepF = t => { const k = clamp((t - t0)/T, 0, 1); const e = k < .5 ? 2*k*k : 1 - Math.pow(-2*k + 2, 2)/2; scrollTo(0, y0 + dy*e); if (k < 1) pAnim = requestAnimationFrame(stepF); };
  pAnim = requestAnimationFrame(stepF);
}
let pAnim = null;
function stationY(st){ if (mobile() && st.head) return docTop(st.head) - 72; const r = (st.fig || st.head).getBoundingClientRect(); return scrollY + r.top - Math.max(70, (innerHeight - r.height)/2); }
// All stops in document order: intro sections, the stations of the day, the sections after the day.
function stops(){
  return [...document.querySelectorAll('#flow > section.sec, #journey > section, #journey2 > section')]
    .filter(e => e.offsetParent !== null)
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
}
// offsetTop ignores the fade-in transforms, so the target does not move while a section animates in.
function docTop(e){ let y = 0; while (e){ y += e.offsetTop; e = e.offsetParent; } return y; }
function stopY(e){ const st = ST.find(x => x.sec === e); return st ? stationY(st) : docTop(e) - (mobile() ? 64 : 76); }
function stopLabel(e){
  const st = ST.find(x => x.sec === e);
  if (st) return [st.s.time, st.s.label].filter(Boolean).join(' ');
  const h = e.querySelector('h2, h3'); return h ? h.textContent.trim() : '';
}
function nextStop(){ const maxY = document.documentElement.scrollHeight - innerHeight; return stops().find(e => Math.min(stopY(e), maxY) > scrollY + 24) || null; }
const ARROW_DOWN = '<path d="M6 11.2 1.4 6.6h3.1V.8h3v5.8h3.1z"/>', ARROW_UP = '<path d="M6 .8l4.6 4.6H7.5v5.8h-3V5.4H1.4z"/>';
function updateNextUI(){
  const n = nextStop(), lbl = n ? stopLabel(n) : '';
  $$('.play').forEach(b => {
    b.setAttribute('aria-label', n ? 'Weiter zu ' + lbl : 'Zurück nach oben');
    b.title = n ? 'Weiter: ' + lbl : 'Nach oben';
    b.querySelector('span').textContent = n ? 'Weiter' : 'Nach oben';
    b.querySelector('svg').innerHTML = n ? ARROW_DOWN : ARROW_UP;
  });
}
let settleT = 0;
function goNext(){
  const n = nextStop(); const y = n ? stopY(n) : 0; scrollToY(y);
  // Sections fade in while we scroll and the layout can still shift a little; correct once at the end.
  clearTimeout(settleT);
  if (n) settleT = setTimeout(() => { const y2 = Math.min(stopY(n), document.documentElement.scrollHeight - innerHeight); if (Math.abs(scrollY - y2) > 8) scrollToY(y2, 300); }, reduce ? 50 : 1550);
}
$$('.play').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); goNext(); }));
let nextRaf = 0;
addEventListener('scroll', () => { if (!nextRaf) nextRaf = requestAnimationFrame(() => { nextRaf = 0; updateNextUI(); }); }, {passive:true});
// Any own scrolling stops the Weiter animation and its late correction.
['wheel', 'touchstart'].forEach(ev => addEventListener(ev, () => { clearTimeout(settleT); cancelAnimationFrame(pAnim); }, {passive:true}));
addEventListener('keydown', e => { if (e.key === 'Escape' && openSt) closeDetail(openSt); });

/* ================================================================ init */
safe('hero', buildHero);
STATIONS.forEach((s, i) => { const sec = safe('station ' + s.id, () => buildStation(s, i)); if (sec) $('#journey').appendChild(sec); });
STATIONS_AFTER.forEach((s, i) => { const sec = safe('station ' + s.id, () => buildStation(s, STATIONS.length + i)); if (sec) $('#journey2').appendChild(sec); });
safe('fach', buildFach);
safe('cards', setupCards);
safe('weg', setupWeg);
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('live'); }), {rootMargin:'0px 0px -25% 0px'});
ST.forEach(st => io.observe(st.sec));
if ('ResizeObserver' in window){ const ro = new ResizeObserver(() => requestLayout()); ro.observe(flow); }
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { requestLayout(); updateNextUI(); });
setTimeout(updateNextUI, 400);
addEventListener('load', () => requestLayout());
layoutThread(); requestLayout();
/* test hook: lets the smoke test wait for the debounced layout */
window.__bhLayout = () => { layoutAll(); return true; };

})();
