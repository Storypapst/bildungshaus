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
