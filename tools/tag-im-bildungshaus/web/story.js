/* story.js: page content for the stations, close-ups and phone mocks of the Kita page v5.
   All German text comes from texte_v5.md (sections 2 and 3, verbatim). build.py concatenates
   this file with app.js into site/app.js (one IIFE, no inline script on the page).
   Render names and anchors follow CONTRACT_v5.md. Anchors are lists: the first one present in
   the render wins, missing anchors are skipped (some lists name the v3 anchor of the fallback
   render second, e.g. sanne_head for Maren). Images are logical names; build.py maps them to the
   v5 render, to a fallback render while it is missing, or to a placeholder. 'ki:<name>' is a
   KI image from site/ki/ (bildprompts_v5.md), with a placeholder while it is missing.
   Tap points: st = stages they belong to (default: every stage that has the anchor). */

const HERO_LABELS = [
  {a:['eingang'], t:'Grüner Vorraum'},
  {a:['dach'], t:'Gründach mit Solar'},
  {a:['og'], t:'Gruppen und Teamraum oben'},
  {a:['lab'], t:'Lab'},
  {a:['schule'], t:'Schule nebenan'}
];

/* KI images have no render JSON: fixed points for the thread, tap points and bubbles. */
const KI_ANCHORS = {
  ubahn:{in:[.44, .97], out:[.56, .97], handy:[.5, .52], fakt:[.2, .34], maren_head:[.46, .3]}
};
const KI_PH = {ubahn:'Bild folgt: Maren in der U-Bahn'};

const STATIONS = [
 {id:'ubahn', time:'7:10', ort:'U-Bahn', label:'U-Bahn', title:'Zwei Minuten, um anzukommen',
  stages:[{ki:'ubahn'}],
  moment:'Maren sitzt in der U8 und schaut kurz aufs Handy. Bei den Bären fehlt niemand. Eine Kollegin aus einem anderen Haus hat ein Soßen-Rezept in den Ideenschatz gelegt, mit einem Satz, wie es lief. Maren steckt das Handy weg.',
  idee:'Vorbereitung soll nicht im Pendelweg passieren, sondern als bezahlte Zeit im Haus, mit fertigem Material. Der kurze Blick am Morgen zeigt nur, ob etwas Besonderes ansteht, und eine Idee, auf die man sich freuen kann.',
  bisher:'Teams sind sehr unterschiedlich ausgebildet, Vorbereitung passiert abends oder gar nicht, und gute Ideen bleiben bei der Kollegin, die sie hatte.',
  unsere:'Erprobte Ideen kommen fertig mit Material und Erfahrung, und die Vorbereitung hat ihren festen Platz im Dienstplan.',
  nutzen:['Eine Lernbegleiterin, die vorbereitet und entspannt ankommt.', 'Weniger Abendarbeit, gute Ideen anderer griffbereit.', 'Mehr Angebote, die schon anderswo funktioniert haben.', 'Einarbeitung schneller, Wissen bleibt im Haus.'],
  varianten:[
   ['Neue Kollegin', 'Sie sieht zu jeder Idee, wie sie bei anderen lief, und wird schneller sicher in der Gruppe.', 'var-ubahn-1-neue-kollegin'],
   ['Teilzeit', 'Wer gestern nicht da war, liest drei Zeilen statt einer Übergabe zwischen Tür und Angel.', 'var-ubahn-2-teilzeit'],
   ['Ohne Handy', 'Dieselben Zeilen hängen im Teamraum an der Tafel. Niemand muss ein privates Gerät nutzen.', 'var-ubahn-3-ohne-handy'],
   ['Schule', 'Lehrkräfte finden Projekte aus dem Ideenschatz, erprobt in anderen Klassen, mit Material.', 'var-ubahn-4-schule']],
  daten:'Dienstplan der Gruppe und Ideen aus dem Ideenschatz. Keine Daten zu Kindern auf dem Handy. Benachrichtigungen schaltet Maren selbst ab, außerhalb der Dienstzeit sind sie aus.',
  annahme:'Fertige, erprobte Ideen und feste Vorbereitungszeit senken Abendarbeit und machen neue Kolleg:innen schneller sicher. Messen: Vorbereitungszeit außerhalb des Dienstes, Zeit bis zur eigenständigen Gruppenführung, Zufriedenheit im Team.',
  hots:[
   {a:['handy'], l:'Handy', d:'morgen'},
   {a:['fakt'], l:'Fakt', note:'2017 hatten 41 Prozent der Kita-Teams mehr als acht von zehn Beschäftigten mit Erzieher-Abschluss, 2023 nur 32 Prozent.', side:'left'}],
  bubbles:[{a:['maren_head'], t:'Soßen? Klingt gut.'}],
  xray:{hub:[.86, .18], ext:{icon:'house', at:[.14, .14]}, items:[
   {n:1, ext:true, dir:'in', t:'Der Ideenschatz sammelt Ideen mit Material und Erfahrungen, nach Altersgruppe und Gruppengröße.'},
   {n:2, hub:true, t:'Der Dienstplan reserviert Vorbereitungszeit, bevor die Kinder kommen.'},
   {n:3, a:['handy'], dir:'out', t:'Die App zeigt außerhalb der Dienstzeit nichts an, wenn Maren das so einstellt.'}]}},

 {id:'luft', time:'7:45', ort:'Piazza', label:'Frische Luft', title:'Frische Luft, bevor die Kinder kommen',
  stages:[{room:'piazza_745', ph:'Piazza am Morgen'}],
  moment:'Maren schließt auf. Im selben Moment gehen auf beiden Seiten der Piazza die Fenster weit auf, ein kalter Zug geht durch. Nach vier Minuten schließen sie. Als Mila um acht kommt, ist die Luft frisch und warm.',
  idee:'Querlüften: Fenster auf gegenüberliegenden Seiten gehen gleichzeitig weit auf, von Antrieben bewegt. Das Haus lüftet, wenn keine Kinder im Raum sind: beim Aufschließen, beim Essen, draußen. Auf den Fensterbrettern steht deshalb nichts.',
  bisher:'Gelüftet wird, wenn jemand daran denkt, und ein gekipptes Fenster tauscht kaum Luft aus.',
  unsere:'Das selbstgebaute CO₂-Kästchen gibt das Signal, die Fenster öffnen weit und schließen von selbst.',
  nutzen:['Frische Luft ohne Zug im Morgenkreis.', 'Ein Gedanke weniger im vollen Vormittag.', 'Die Ampel in der Piazza zeigt, dass gelüftet wird.', 'Messbar, ob Infekttage sinken und was Heizung kostet.'],
  varianten:[
   ['Krippe 1–3', 'Gelüftet wird nur, wenn die Gruppe draußen ist oder isst. Kein Zug am Spielteppich.', 'var-luft-1-krippe'],
   ['Tagsüber', 'Die Großen dürfen das Lüften an der Kurbel auslösen, wenn das Kästchen Gelb zeigt.', 'var-luft-2-tagsueber'],
   ['Infektwoche', 'Das Haus lüftet öfter. Das liest es aus dem öffentlichen Wochenbericht des Landesamts.', 'var-luft-3-infektwoche'],
   ['So baut man das', 'Im Neubau Fenster mit eingebauten Antrieben. Bestehende Fenster lassen sich mit Kettenantrieben mit Klemmschutz nachrüsten.', 'var-luft-4-so-baut-man-das'],
   ['Raumplan', 'Fensterbretter bleiben frei. Pflanzen wohnen im grünen Vorraum, wo sie Licht haben und nichts herunterfällt.', 'var-luft-5-raumplan']],
  daten:'CO₂-Wert je Raum, Fensterstellung, Außentemperatur. Keine Personendaten, alles im Haus. Grenzwerte setzt die Leitung nach den Leitwerten des Umweltbundesamts, Zeiten die Lernbegleitung pro Raum.',
  annahme:'Automatisches Querlüften hält das CO₂ im Mittel unter 1.000 ppm und senkt die Infekttage. Messen: CO₂-Verlauf je Raum, Krankheitstage von Gruppe und Team gegen Vorjahr und Vergleichsgruppe, Heizenergie.',
  hots:[
   {a:['fenster_r', 'fenster1'], l:'Fenster', d:'luft', step:1, hid:['fenster']},
   {a:['co2'], l:'CO₂-Kästchen', d:'luft', step:0, hid:['co2'], side:'left'},
   {a:['fenster_l', 'fenster0'], l:'Fensterbrett', note:'Leer, mit Absicht. Ein Fenster, das von selbst aufgeht, würde den Kaktus herunterwerfen. Er wohnt jetzt im Vorraum.', hid:['fensterbrett']},
   {a:['hubel'], l:'Hubel', note:'Um acht sitzen hier alle im Kreis. Scroll weiter.', hid:['hubel']}],
  bubbles:[{a:['maren_head', 'sanne_head'], t:'Brr. Und gleich gemütlich.'}],
  xray:{hub:[.13, .2], items:[
   {n:1, a:['co2'], dir:'in', t:'Das selbstgebaute Kästchen misst CO₂ und meldet es dem Rechner im Haus.'},
   {n:2, a:['maren_head'], dir:'in', t:'Das Aufschließen ist das Zeichen: Jetzt ist niemand im Raum, jetzt wird gelüftet.'},
   {n:3, a:['antrieb', 'fenster_r', 'fenster1'], dir:'out', t:'Die Antriebe schließen und verriegeln von selbst. Bei Stromausfall geht es von Hand.'},
   {a:['fenster_l', 'fenster0'], dir:'out'}]}},

 {id:'kreis', time:'8:00', ort:'Vorraum und Piazza', label:'Ankommen', title:'Ankommen und Morgenkreis',
  stages:[{room:'vorraum_800', l:'Vorraum', ph:'Grüner Vorraum'}, {room:'piazza_800', l:'Piazza', ph:'Piazza im Morgenkreis'}],
  moment:'Im Vorraum zieht Mila die Stiefel aus und stellt sie ins Fach unter der Bank. In der Piazza hängt sie ihre Jacke in den Schrank und nimmt ihren Fuchs-Cube mit. Im Kreis legt sie ihn in eine Mulde beim Kaufladen. Oben an ihrem Schrank dreht sich der Planwürfel.',
  idee:'Ankommen ist ein Ort, kein Gedränge. Der Dreck bleibt im Vorraum, die Sachen verschwinden hinter Türen, der Plan steht sichtbar am Schrank. Ordnung wird so ein gemeinsames Gut: Wer jeden Tag ein bisschen Ordnung hält, räumt weniger auf. Ordnung und Planen gehören zusammen.',
  bisher:'Die Garderobe ist eine Ecke mit Jackenbergen und Matschhosen am Boden, und Eltern ziehen dort an und aus, ohne vom Tag etwas mitzubekommen.',
  unsere:'Ein ruhiger Schrank mit einem Fach pro Kind, eine Tafel für die Gruppe und ein Hubel, an dem die Kinder ihren Tag selbst wählen.',
  nutzen:['Eigener Platz, den Tag selbst wählen, Ordnung als eigenes Ding.', 'Weniger Suchen nach Mützen, Plan steht ohne Aushang.', 'Beim Anziehen sehen, was war und was kommt.', 'Weniger Verschleiß und Reinigung, ein Raum, der Konzept zeigt.'],
  varianten:[
   ['Krippe 1–3', 'Drei große Bildwürfel, die Lernbegleitung legt den Cube mit dem Kind in die Mulde. Planwürfel zeigen den Tag der Gruppe.', 'var-hubel-1-krippe'],
   ['Kita 3–6', 'Jedes Kind wählt selbst. Voll ist voll, das sieht jeder. Vorschulkinder sehen am Schrank die ganze Woche.', 'var-hubel-2-kita'],
   ['Schule', 'Lottes Klasse plant die Woche an einer Tafel mit Zeit-Plättchen und Aufgaben.', 'var-hubel-3-schule'],
   ['Einstellung', 'Maren legt fest, wie viele Angebote es gibt und wie viele Plätze jedes hat. Der Hubel rollt für Feste an die Wand.', 'var-hubel-4-einstellung'],
   ['Inklusion', 'Bildwürfel, die beim Antippen ihren Namen sagen. Der Hubel ist so niedrig, dass Kinder im Rollstuhl die Mulden von der Seite erreichen.', 'var-hubel-5-inklusion']],
  daten:'Die Wahl jedes Kindes liegt pseudonym auf dem Rechner im Haus, über die Kennung des Cubes, und ist nur im Raum sichtbar, an den Planwürfeln. Gelesen wird der Cube nur in der Mulde. Um Mitternacht ist die Wahl gelöscht.',
  annahme:'Wer seinen Tag selbst wählt und sieht, kommt eher ins Tun, und ein geordneter Ankommensort spart allen Zeit. Messen: Kinder ohne Wahl nach dem Kreis, Zeit fürs An- und Ausziehen, verlorene Sachen pro Monat, Elternzufriedenheit.',
  hots:[
   {a:['bank'], st:[0], l:'Schuhbank', note:'Schuhe aus im Vorraum. Der Gitterrost fängt den Dreck, bevor er in die Piazza kommt.', hid:['bank'], side:'left'},
   {a:['haken'], st:[0], l:'Matschsachen', note:'Nasse Hosen bleiben hier. Der Schrank in der Piazza bleibt sauber.', hid:['haken']},
   {a:['schrank_mila', 'mila_fach'], st:[1], l:'Garderobenschrank', d:'schrank', hid:['schrank', 'faecher']},
   {a:['tafel'], st:[1], l:'Tafel', d:'schrank', step:3, hid:['tafel']},
   {a:['hubel_top'], st:[1], l:'Hubel', d:'hubel', hid:['hubel']},
   {a:['knopf_klein'], st:[1], l:'Kleine Knöpfe', note:'Unten auf Krabbelhöhe. Sie lassen nur ein Licht leuchten und verstellen nichts.', hid:['knoepfe']}],
  bubbles:[{a:['mila_head'], st:[1], t:'Kaufladen!'}, {a:['defne_head'], st:[1], t:'Ich auch!'}],
  xray:{stage:1, hub:[.12, .2], items:[
   {n:1, a:['mulde', 'hubel_top'], dir:'in', t:'In jedem Cube steckt ein Chip ohne Batterie. Gelesen wird er nur in der Mulde, weil das Kind ihn bewusst hineinlegt.'},
   {n:2, a:['planwuerfel'], dir:'out', t:'Der Hubel schickt die Wahl an den Schrank des Kindes. Kleine Motoren drehen die Planwürfel, so sind Hubel und Schrank immer gleich.'},
   {n:3, a:['knopf_klein', 'hubel_top'], t:'Die weichen Polster hängen an Klett und lassen sich abwaschen und tauschen. Die Rollen lassen sich feststellen.'}]}},

 {id:'laden', time:'10:00', ort:'Kaufladen', label:'Kaufladen', title:'Einkaufen wie in echt',
  stages:[{room:'kaufladen', ph:'Kaufladen'}],
  moment:'Defne hat Geburtstag und führt die Kasse. Mila stellt ihren Fuchs-Cube auf die Ablage und legt eine Aubergine aufs rote Fenster. Die Kasse sagt: Aubergine. Eggplant. Und für Defne: Patlıcan. Mila sagt es nach, Defne lacht.',
  idee:'Ein kleiner Laden wie in echt: Gemüseecke, Regal, Kasse. Die Kasse zählt mit und spricht Deutsch und Englisch, die Sprachen des Hauses, auf Wunsch auch die Familiensprache des Kindes. Alles optional, eingestellt mit wenigen Klicks. Der Cube auf der Ablage sagt der Kasse, wer einkauft.',
  bisher:'Etwas Holzobst und eine Kasse gibt es in vielen Gruppen, aber viel Lernpotenzial geht verloren, weil die Dinge nicht reagieren.',
  unsere:'Mehr Ladengefühl und eine Kasse, die mitzählt, spricht und Wörter übersetzt.',
  nutzen:['Wörter in Haus- und Familiensprache, Zählen beim Spielen.', 'Sprachförderung nebenbei, ohne Extra-Stunde.', 'Die Familiensprache wird im Haus gehört.', 'Sprachförderung sichtbar, der Laden als möglicher Bausatz.'],
  varianten:[
   ['Krippe 1–3', 'Nur das Wort, langsam und deutlich. Kein Rückgeld, große Früchte.', 'var-laden-1-krippe'],
   ['Kita 3–6', 'Rückgeld zählen. Deutsch und Englisch immer, die Familiensprache, wenn Eltern sie wählen.', 'var-laden-2-kita'],
   ['Schule', 'Echte Preise, Taschengeld rechnen, Einkaufsliste für die Soßen am Mittag.', 'var-laden-3-schule'],
   ['Einstellung', 'Ohne Cube spricht die Kasse Deutsch und Englisch. Eltern können die Kennung abwählen.', 'var-laden-4-einstellung'],
   ['Inklusion', 'Hört ein Kind nicht, zeigt sein Cube neben der Kasse die Gebärde zum Wort, und die anderen machen sie nach.', 'var-laden-5-inklusion']],
  daten:'Eine Kasse, die auf ein Kind eingeht, muss wissen, wer spielt. Der Cube trägt eine pseudonyme Kennung, nur der Rechner im Haus kennt dazu Altersstufe und Sprachen, keinen Namen. Was ein Kind kauft, wird nicht gespeichert.',
  annahme:'Ein Laden, der spricht und zählt, bringt mehr Wörter und Zahlen ins freie Spiel. Messen: Nutzungszeit pro Woche, gesprochene Wörter je Sprache als Summe, ein kurzer Fragebogen an Familien. Kein Kind wird getestet.',
  hots:[
   {a:['kasse'], l:'Sprechende Kasse', d:'kasse', hid:['kasse']},
   {a:['kranz'], l:'Geburtstag', note:'Defne wird fünf. Die anderen lernen ihr erstes türkisches Wort: patlıcan.', hid:['kranz']},
   {a:['schrankwand'], l:'Schrankwand', note:'Sieht aus wie eine Holzwand. Was dahinter steckt, zeigt sich um Viertel nach elf.', hid:['schrankwand']}],
  bubbles:[{a:['speaker'], t:'Aubergine. Eggplant. Patlıcan!'}, {a:['mila_head'], t:'Pat-lı-can!'}],
  xray:{hub:[.88, .2], ext:{icon:'phone', at:[.12, .14]}, items:[
   {n:1, a:['ablage', 'kasse'], dir:'in', t:'Unter der Ablage liest ein Funkleser die Kennung im Cube.'},
   {n:2, a:['scan'], dir:'in', t:'In jeder Holzfrucht steckt ein Chip mit dem Produktcode, eine Kamera gibt es nicht.'},
   {n:3, ext:true, dir:'in', t:'Maren stellt Sprachen und Funktionen am Handy ein.'},
   {a:['speaker'], dir:'out'}]}},

 {id:'waschen', time:'11:00', ort:'Waschraum', label:'Händewaschen', title:'Händewaschen vor dem Kochen',
  stages:[{room:'waschraum_1145', ph:'Waschraum'}],
  moment:'Bevor gekocht wird, geht es in den Waschraum. Mila hält die Hände unter den Hahn, am Becken läuft ein Lichtkäfer seine Runde. Solange er läuft, wird geschäumt. Pling. Maren singt das Lied mit.',
  idee:'Ein Lichtring am Becken macht aus zwanzig Sekunden ein Spiel, das Kinder selbst steuern. Dauer, Lied und Licht stellt die Lernbegleitung ein, in Infektwochen läuft der Käfer länger. Der Seifenspender zählt Drücke als Summe pro Tag.',
  bisher:'Kinder waschen ein paar Sekunden, und das Erinnern ist eine Daueraufgabe.',
  unsere:'Der Käfer läuft genau so lange, wie geschäumt werden soll.',
  nutzen:['Ein Spiel statt einer Ermahnung.', 'Weniger Erinnern, die Zeit am Becken wird ruhiger.', 'Hoffentlich weniger Infekte, die mit nach Hause kommen.', 'Ausfalltage in Infektwellen, Seifenverbrauch als Indikator.'],
  varianten:[
   ['Krippe 1–3', 'Langsamer Käfer, großer bunter Ring, die Lernbegleitung wäscht mit.', 'var-wasch-1-krippe'],
   ['Kita 3–6', 'Kinder starten den Käfer selbst, das Lied wechselt wöchentlich.', 'var-wasch-2-kita'],
   ['Schule', 'Nur Licht, kein Lied.', 'var-wasch-3-schule'],
   ['Inklusion', 'Ein Becken unterfahrbar, mit Sensorhahn und fest auf nur Licht gestellt, für Kinder, die Geräusche schwer aushalten.', 'var-wasch-4-inklusion']],
  daten:'Wasser an oder aus, Seifendrücke pro Becken und Tag. Kein Personenbezug, alles im Haus. Ein Becken kann fest anders eingestellt sein, etwa nur Licht; dafür braucht es keine Kennung.',
  annahme:'Längeres Händewaschen senkt Infekttage. Die Studienlage ist dünn: Eine Übersichtsarbeit von 2016 sieht Hinweise bei Atemwegsinfekten, bei Magen-Darm uneindeutig. Messen: Seifenverbrauch pro Tag, Krankheitstage in Infektwellen gegen Vorjahr und Vergleichsgruppe.',
  hots:[
   {a:['sink1'], l:'Lichtkäfer-Becken', d:'becken', hid:['becken']},
   {a:['seife'], l:'Seifenspender', note:'Zählt Drücke als Summe pro Tag. Kein Name, keine Kamera.', hid:['seife'], side:'left'},
   {a:['lautsprecher'], l:'Lied', note:'So lang wie der Käfer läuft. Lässt sich abschalten.', hid:['lautsprecher']}],
  bubbles:[{a:['maren_head', 'sanne_head'], t:'Schaum, Schaum, Schaum!'}, {a:['mila_head'], t:'Pling!'}],
  xray:{hub:[.88, .22], ext:{icon:'cloud', at:[.14, .08]}, items:[
   {n:1, ext:true, dir:'in', t:'Der Rechner im Haus liest einmal pro Woche den öffentlichen Bericht des Landesamts.'},
   {n:2, a:['sink1'], dir:'out', t:'Die Lichtringe starten, sobald Wasser läuft, mit der eingestellten Dauer.'},
   {a:['sink0'], dir:'out'}, {a:['sink2'], dir:'out'},
   {n:3, a:['seife'], dir:'in', t:'Der Seifenspender zählt nur, wie oft gedrückt wird.'}]}},

 {id:'kueche', time:'11:15', ort:'Kaufladen', label:'Küche', title:'Der Laden wird Küche',
  stages:[{room:'kaufladen', l:'Laden', ph:'Kaufladen'}, {room:'kaufladen_umbau', l:'Umräumen', ph:'Der Laden klappt in die Wand'}, {room:'kaufladen_kochen', l:'Kochen', ph:'Die Tischinsel'}],
  moment:'Um Viertel nach elf klappt der Laden in die Wand. Mila und Defne ziehen mit Maren die großen Tischplatten heraus, klick, klick, und in der Mitte steht eine Insel. Dann rühren sie Tomatensoße zu den Nudeln, die der Caterer gebracht hat.',
  idee:'Ein Raum, viele Nutzungen. Eine Schrankwand vom Boden bis zur Decke nimmt Laden, Spiele und Tischplatten auf, unten frei für Kinder, oben mit Zahlenschloss. Das Grundessen kommt geliefert, die Soßen machen die Kinder selbst, nach erprobten Rezepten.',
  bisher:'Das Essen kommt fertig in Kisten, Kinder sehen nie, wie es entsteht, und gekocht wird selten, weil Platz und Sicherheit fehlen.',
  unsere:'Der Raum wird in Minuten zur Küche, mit einer Insel, an deren Mitte nur Erwachsene kommen.',
  nutzen:['Selbst kochen, riechen, abschmecken, die eigene Soße essen.', 'Erprobte Rezepte mit Allergien, ein Raum, der mitdenkt.', 'Kinder, die zu Hause mitkochen wollen.', 'Weniger Fläche pro Nutzung, weniger Reste.'],
  varianten:[
   ['Krippe 1–3', 'Kein Herd. Joghurt mit Kräutern aus dem Vorraum rühren, jedes Kind seine kleine Schüssel.', 'var-kueche-1-krippe'],
   ['Kita 3–6', 'Tomatensoße mit Maren. Abmessen mit Löffeln, schneiden mit Kindermessern unter Aufsicht.', 'var-kueche-2-kita'],
   ['Schule', 'Lottes Klasse kocht eine ganze Mahlzeit und rechnet die Mengen für die Gruppe hoch.', 'var-kueche-3-schule'],
   ['Einstellung', 'Maren wählt, welche Rezepte nur kalt gehen. Die Kochplatte wohnt oben hinter dem Zahlenschloss.', 'var-kueche-4-einstellung'],
   ['Inklusion', 'Eine Inselplatte ist unterfahrbar. Rezepte gibt es als Bildfolge, Schritt für Schritt.', 'var-kueche-5-inklusion']],
  daten:'Unverträglichkeiten der Gruppe kennt Maren ohnehin. Sie liegen im Haus, sichtbar nur für die Lernbegleitung der Gruppe, und sind Gesundheitsdaten. Das Rezept zeigt nur, wie viele Portionen ohne welche Zutat nötig sind. Rezepte und Erfahrungen gehören dem Ideenschatz.',
  annahme:'Kinder, die ihre Soße selbst machen, essen mehr und lassen weniger übrig, und ein wandelbarer Raum ersetzt einen eigenen Speiseraum. Messen: Reste pro Mahlzeit in den Behältern des Caterers, Zeit fürs Umräumen, Unfälle an der Insel, die null bleiben sollen.',
  hots:[
   {a:['schrankwand'], l:'Schrankwand', d:'kueche', hid:['schrankwand']},
   {a:['hoehle'], l:'Versteckhöhle', note:'Eine runde Höhle in der Schrankwand. Ein Raum mit viel Stauraum muss nicht steril sein.', hid:['hoehle'], side:'left'},
   {a:['schloss'], l:'Zahlenschloss', d:'kueche', step:1, hid:['schloss']},
   {a:['verbinder'], l:'Tischinsel', d:'kueche', step:2, hid:['insel']},
   {a:['maren_head'], st:[2], l:'Rezept', d:'kueche', step:3, hid:['maren']},
   {a:['wagen'], l:'Essen', note:'Nudeln, Reis und Gemüse bringt ein Caterer. Die Soßen kommen nicht mit, die machen die Kinder.', hid:['wagen']}],
  bubbles:[{a:['mila_head'], st:[2], t:'Mehr Basilikum!'}, {a:['maren_head'], st:[2], t:'Erst riechen.'}],
  xray:{stage:2, hub:[.88, .2], ext:{icon:'house', at:[.12, .14]}, items:[
   {n:1, a:['kochplatte'], t:'Die Kochplatte steht in der Mitte der Insel, sechs Platten groß. Kleine Arme kommen nicht hin.'},
   {n:2, ext:true, dir:'in', t:'Rezepte kommen aus dem Ideenschatz: erprobt, mit Notizen. Eine KI sucht passende und rechnet Mengen um, sie erfindet keine.'},
   {n:3, a:['schloss', 'kochplatte'], t:'Die Kochplatte ist eine kleine Induktionsplatte. Nur Erwachsene schalten sie ein.'}]}},

 {id:'garten', time:'14:00', ort:'Grüner Vorraum', label:'Kräutergarten', title:'Der Kräutergarten',
  stages:[{room:'vorraum_1400', ph:'Grüner Vorraum am Nachmittag'}],
  moment:'Nach der Ruhezeit gehen Mila und drei andere in den Vorraum. Beim Basilikum leuchtet der Stab blau: Durst. Mila gießt. Bei den Tomaten hängt ein Plättchen auf Rot: reif. Maren schneidet mit ihr zwei ab, für die Soße morgen.',
  idee:'Ein Raum, der sonst vernachlässigt ist, wird grün. Kräuter und Tomaten wachsen unter Pflanzenlicht, auch im Februar. Einfache Anzeigen machen Gießen und Ernten für Vierjährige verständlich. Nachts leuchtet das Licht mit gespeichertem Strom vom Solardach.',
  bisher:'Der Eingang ist eine Schmutzecke, Pflanzen gehen im Winter ein, und woher Kräuter kommen, sehen Kinder selten.',
  unsere:'Der Vorraum wird Kräutergarten, und was wächst, landet in der Soße der Kinder.',
  nutzen:['Sehen, wie Essen wächst, Verantwortung für etwas Lebendiges.', 'Ein Naturangebot im Winter, ohne nach draußen zu müssen.', 'Ein grüner Eingang statt einer Schmutzecke.', 'Ungenutzte Fläche wird Lernort, Solarstrom wird vor Ort genutzt.'],
  varianten:[
   ['Krippe 1–3', 'Riechen und tasten. Jedes Kind hat eine eigene Pflanze in Griffhöhe.', 'var-garten-1-krippe'],
   ['Kita 3–6', 'Gießen nach dem Stab, ernten nach dem Plättchen, Kräuter für die nächste Soße.', 'var-garten-2-kita'],
   ['Schule', 'Lottes Klasse misst, wie viel Licht und Strom die Pflanzen brauchen, und vergleicht mit dem Ertrag des Dachs.', 'var-garten-3-schule'],
   ['So baut man das', 'Regale mit Pflanzenlicht, Feuchtefühler und ein kleiner Speicher. Im Bestand reicht ein Fenster und eine Lampe.', 'var-garten-4-so-baut-man-das'],
   ['Inklusion', 'Beete auf zwei Höhen, eines unterfahrbar. Die Gießkanne hat einen großen Griff und Striche für die Menge.', 'var-garten-5-inklusion']],
  daten:'Erdfeuchte je Topf, Licht, Ladestand des Speichers. Nichts über Kinder. Wann das Licht läuft, stellt die Lernbegleitung ein, der Rechner im Haus nutzt dafür Überschuss vom Dach.',
  annahme:'Ein Kräutergarten im Vorraum versorgt die Soßen der Gruppe regelmäßig, und Kinder, die mitgießen, probieren mehr Kräuter. Messen: Ernte pro Monat, Anteil Soßen mit eigenen Kräutern, Strom für das Licht gegen Solarertrag.',
  hots:[
   {a:['stab'], l:'Durst-Stab', d:'garten', hid:['stab']},
   {a:['reif'], l:'Reif-Plättchen', d:'garten', step:2, hid:['tomate']},
   {a:['kaktus'], l:'Kaktus', note:'Vom Fensterbrett der Piazza. Sein Stab leuchtet fast nie. Warum? Er speichert Wasser.', hid:['kaktus']},
   {a:['licht'], l:'Pflanzenlicht', d:'garten', step:3, hid:['licht'], side:'left'}],
  bubbles:[{a:['mila_head'], t:'Der hat Durst!'}, {a:['maren_head'], t:'Riech mal.'}],
  // Point 3 is a calculation still to be researched (texte_v5 3.7): rows only, no invented numbers.
  xray:{hub:[.88, .2], ext:{icon:'sun', at:[.12, .12]}, items:[
   {n:1, a:['stab'], t:'Feuchtefühler in der Erde schalten die Lämpchen in den Stäben.'},
   {n:2, ext:true, dir:'in', t:'Ein Speicher im Haus nimmt tagsüber Überschuss vom Solardach auf, der Rechner im Haus schaltet damit nachts das Licht.'},
   {a:['licht'], dir:'out'},
   {n:3, calc:['Pflanzenlampen pro Nacht', 'Solarüberschuss im Februar', 'Solarüberschuss im Sommer', 'Portionen Soße aus den Regalen pro Monat']}]}},

 {id:'abholen', time:'15:30', ort:'Piazza', label:'Abholen', title:'Abholen',
  stages:[{room:'abholung', ph:'Piazza beim Abholen'}],
  moment:'Papa Jonas holt Mila ab, Lotte kommt von nebenan aus der Schule dazu. Mila stellt ihren Fuchs-Cube zurück in die Nische am Schrank. Die Planwürfel darüber zeigen schon morgen: Bauen. An der Tafel klebt ein Plättchen: Soße gekocht.',
  idee:'Abholen ist eine Übergabe in Holz. Schrank, Planwürfel und Tafel zeigen den Tag und den Plan für morgen. In der Eltern-App steht dasselbe plus eine Zeile der Bezugsfachkraft. Eltern stellen ein, was sie bekommen. Wünsche gehen in den Ideenschatz.',
  bisher:'Zwischen Tür und Angel bleiben zwei Minuten, und abends dokumentiert das Team noch einmal für die Akte.',
  unsere:'Was im Raum in Holz steht, steht einmal in der App, und eine Zeile von Maren dazu.',
  nutzen:['Erzählen können, mit einem Bild vor Augen.', 'Einmal dokumentieren, kürzere Übergabe.', 'Wissen, was war, und Wünsche einbringen.', 'Elternbindung, weniger Dokumentationszeit.'],
  varianten:[
   ['Krippe 1–3', 'Die Lernbegleitung stellt den Cube mit dem Kind zurück. Die App zeigt Schlaf und Essen als Symbole.', 'var-abholen-1-krippe'],
   ['Kita 3–6', 'Das Kind stellt seinen Cube selbst zurück und zeigt den Eltern an der Tafel, was war.', 'var-abholen-2-kita'],
   ['Schule', 'Lotte sieht ihre Woche selbst, Eltern bekommen nur die Woche.', 'var-abholen-3-schule'],
   ['Einstellung', 'Benachrichtigung an oder aus. Wunschkasten aus Holz für Familien ohne Smartphone.', 'var-abholen-4-einstellung'],
   ['Inklusion', 'Für Kinder mit wenig Sprache zeigt die App den Tag in Bildsymbolen. Zu Hause zeigt das Kind darauf und erzählt.', 'var-abholen-5-inklusion']],
  daten:'Hier gibt es echten Personenbezug: die Zeile zum eigenen Kind. Sie schreibt und sieht die Bezugsfachkraft, die Leitung nicht. Geht die App über das Internet, sind Inhalte verschlüsselt und pseudonymisiert, der Schlüssel bleibt im Haus.',
  annahme:'Einmal dokumentieren, in Holz und App, spart dem Team Zeit und bindet Eltern. Messen: Dokumentationszeit pro Woche, Anteil Familien mit Wünschen, Elternzufriedenheit, Empfehlungen und Warteliste.',
  hots:[
   {a:['mila_fach'], l:'Milas Schrank', d:'abholen', hid:['schrank', 'faecher', 'planwuerfel']},
   {a:['jonas_phone'], l:'Eltern-App', d:'abholen', step:1, hid:['jonas'], side:'left'},
   {a:['wunsch'], l:'Wunschkasten', note:'Eine Karte für die nächsten Tage. Sie landet im Ideenschatz, Maren entscheidet.', hid:['wunsch']}],
  bubbles:[{a:['mila_head'], t:'Ich hab Soße gemacht!'}, {a:['lotte_head'], t:'Zeig mal!'}],
  xray:{hub:[.1, .2], items:[
   {n:1, a:['planwuerfel', 'mila_fach'], dir:'out', t:'Schrank und Planwürfel zeigen nur, sie messen nichts.'},
   {n:2, a:['jonas_phone'], dir:'out', t:'Die App ist verschlüsselt, der Schlüssel bleibt im Haus.'},
   {n:3, hub:true, t:'Wünsche aus App und Wunschkasten landen im Ideenschatz.'},
   {a:['wunsch'], dir:'in'}]}},

 {id:'notiz', time:'16:15', ort:'Piazza', label:'Marens Notiz', title:'Drei Minuten statt Abendarbeit',
  stages:[{room:'piazza_1615', ph:'Piazza am Abend'}], phone:'notiz',
  moment:'Die letzten Kinder sind abgeholt. Maren lehnt an der Tafel und spricht drei Minuten ins Handy: wie das Soßenkochen lief, was die Kinder dabei gelernt haben, was sie nächstes Mal anders machen würde. Dann zwei Nachfragen, zwei kurze Antworten. Fertig.',
  idee:'Rückmeldung zum Essen kommt von einer Erwachsenen, die einordnen kann, nicht von Kindern, die bewerten sollen. Maren spricht ein, der Rechner im Haus schreibt mit, gliedert und fragt nach. Daraus wird ein Eintrag im Ideenschatz, den andere Gruppen nutzen.',
  bisher:'Dokumentiert wird abends am Schreibtisch, oft doppelt, und was eine Kollegin gelernt hat, erfährt sonst niemand.',
  unsere:'Drei Minuten Sprechen ersetzen das Schreiben, und die Erfahrung geht nicht verloren.',
  nutzen:['Ideen, die beim nächsten Mal besser laufen.', 'Feierabend statt Abenddokumentation, eigene Erfahrung zählt.', 'Rezepte und Ideen, die erprobt sind.', 'Wissen wandert zwischen Gruppen und Häusern.'],
  varianten:[
   ['Neue Kollegin', 'Die Nachfragen helfen beim Nachdenken: Was hat geklappt, was war schwierig?', 'var-notiz-1-neue-kollegin'],
   ['Woche statt Tag', 'Wer möchte, spricht einmal pro Woche ein, gesammelt über mehrere Angebote.', 'var-notiz-2-woche'],
   ['Schule', 'Lehrkräfte sprechen nach einem Projekt ein, die Klasse liest die Zusammenfassung mit.', 'var-notiz-3-schule'],
   ['Einstellung', 'Nachfragen an oder aus. Die Aufnahme ist gelöscht, sobald der Text steht.', 'var-notiz-4-einstellung']],
  daten:'Marens Stimme und der Text. Die Aufnahme wird im Haus verschriftlicht und danach gelöscht. Der Eintrag beschreibt die Gruppe, keine einzelnen Kinder. Was Maren zu einem Kind sagt, landet nur bei der Bezugsfachkraft.',
  annahme:'Einsprechen statt Schreiben spart Dokumentationszeit und bringt mehr Erfahrungen in den Ideenschatz. Messen: Dokumentationszeit pro Woche, Einträge im Ideenschatz pro Gruppe, wie oft Einträge anderswo genutzt werden.',
  hots:[{a:['maren_head', 'sanne_head'], l:'Sprachnotiz', d:'notiz', hid:['maren', 'sanne']}],
  bubbles:[{a:['maren_head', 'sanne_head'], t:'Nächstes Mal weniger Knoblauch.'}],
  xray:{hub:[.12, .2], ext:{icon:'house', at:[.88, .14]}, items:[
   {n:1, a:['maren_head', 'sanne_head'], dir:'in', t:'Ein Sprachmodell auf dem Rechner im Haus schreibt mit. Die Aufnahme verlässt das Haus nicht.'},
   {n:2, hub:true, t:'Ein zweiter Schritt gliedert den Text und stellt Nachfragen, wo etwas fehlt.'},
   {n:3, ext:true, dir:'out', t:'Maren liest gegen und gibt frei. Ohne Freigabe geht nichts in den Ideenschatz.'}]}}
];

const NUTZEN_ROLES = ['Kinder', 'Lernbegleitung', 'Eltern', 'Träger'];
const NUTZEN_ICONS = ['kind', 'lern', 'eltern', 'traeger'];

/* Close-ups ("Nahaufnahme"): five steps each, step 5 is "Woran wir merken würden, ob es wirkt".
   img: list of logical image names (first real one wins, need: prefer one showing that anchor).
   ov: overlays on the image. A chip with at:[x, y] still shows when its anchor is missing. */
const DETAILS = {
 morgen:{title:'Der Blick am Morgen', steps:[
  {img:['ki:ubahn'], t:'Zwei Zeilen: Bären vollzählig. Neu im Ideenschatz: Tomatensoße mit Kindern, aus dem Haus Wittenau.', ov:[{phone:'morgen'}]},
  {img:['ki:ubahn'], t:'Die Idee kommt mit Zutatenliste, Ablauf und dem Satz der Kollegin: Die Kinder wollten alle rühren, nehmt zwei Schüsseln.',
   ov:[{chip:['handy'], at:[.5, .5], t:'erprobt in 3 Gruppen', dy:-44}]},
  {img:['ki:ubahn'], t:'Vorbereitet wird im Haus. Maren hat dafür Zeit im Dienstplan.', ov:[{chip:['handy'], at:[.5, .5], t:'7:30 Teamtisch', dy:-44}]},
  {img:['ki:ubahn'], t:'Mehr steht nicht drin. Der Rest des Weges gehört ihr.', ov:[{phone:'aus'}]},
  {img:['ki:ubahn'], ev:true, t:'Abendarbeit des Teams, Zeit bis neue Kolleg:innen sicher sind, wie oft Ideen anderer Häuser genutzt werden.'}]},
 luft:{title:'Fenster und CO₂-Kästchen', steps:[
  {img:['piazza_745z_fenster'], t:'Über Nacht stand die Luft. Das Kästchen zeigt Gelb: über 1.000 ppm.',
   ov:[{pulse:['co2']}, {chip:['co2'], t:'Gelb', cls:'warn', dy:-44}]},
  {img:['piazza_745_fenster'], t:'Maren schließt auf, der Rechner im Haus öffnet die Fenster auf beiden Seiten weit.',
   ov:[{pulse:['fenster_r', 'fenster1', 'antrieb']}, {air:['fenster_r', 'fenster1']}]},
  {img:['piazza_745z_fenster'], t:'Vier Minuten, einmal gemessen für diesen Raum. Dann Grün. Die Fenster schließen und verriegeln.',
   ov:[{chip:['co2'], t:'Grün', cls:'ok', dy:-44}]},
  {img:['piazza_745_fenster'], t:'In Infektwochen lüftet das Haus öfter. Es liest den Wochenbericht des Landesamts und meldet nichts zurück.',
   ov:[{cloud:['fenster_r', 'fenster1'], t:'Öffentlicher Wochenbericht'}]},
  {img:['piazza_745_fenster'], ev:true, t:'CO₂-Verlauf im Raum und Krankheitstage von Gruppe und Team gegen das Vorjahr. Nie einzelne Kinder.',
   src:['Umweltbundesamt', 'https://www.umweltbundesamt.de/richtig-lueften-in-schulen']}]},
 schrank:{title:'Der Garderobenschrank', steps:[
  {img:['piazza_800_schrank'], t:'Von außen nur ruhige Holzfronten. Keine Jacken, keine Matschhosen, kein Schuhberg, auch im Februar.', ov:[]},
  {img:['schrank_offen'], t:'Milas Tür geht auf, innen wird es hell. Ein hohes Fach für Jacke, Mütze und Schal, darunter ein belüftetes Trockenfach.',
   ov:[{pulse:['fach_hoch']}, {pulse:['trockenfach']}]},
  {img:['schrank_offen'], t:'Unten die Schublade mit Wechselkleidung, ein Symbol an der Tür zeigt den Eltern, wenn etwas fehlt. Oben ein kleines Schatzfach für Zettel und Mitgebrachtes.',
   ov:[{pulse:['schublade']}, {chip:['schublade'], t:'auffüllen', dy:-44}, {pulse:['schatzfach']}]},
  {img:['piazza_800_schrank'], need:['tafel'], t:'Neben dem Schrank die Magnettafel der Gruppe: was war, was kommt. Eltern sehen es beim Anziehen, ohne Bildschirm.',
   ov:[{pulse:['tafel']}]},
  {img:['piazza_800_schrank'], ev:true, t:'Zeit fürs An- und Ausziehen, verlorene Sachen, wie oft Eltern an der Tafel ins Gespräch kommen.'}]},
 hubel:{title:'Der Hubel', steps:[
  {img:['piazza_800_hubel'], t:'Vor dem Kreis stellt Maren am iPhone drei Angebote ein und wie viele Plätze jedes hat.', ov:[{phone:'angebote'}]},
  {img:['piazza_800_hubel'], t:'Auf dem Hubel drehen sich drei Bildwürfel: Kaufladen, Bauen, Malen. Jedes Angebot hat so viele Mulden wie Plätze.', ov:[{pulse:['bildwuerfel']}]},
  {img:['piazza_800_hubel'], t:'Mila legt ihren Fuchs-Cube in eine freie Mulde beim Kaufladen. Defne findet keine freie mehr und wählt Malen.',
   ov:[{pulse:['mulde']}, {bubble:['mila_head', 'mila_cube'], t:'Kaufladen!'}]},
  {img:['piazza_800_schrank', 'piazza_800'], need:['planwuerfel'], zoom:[['planwuerfel'], 2.2],
   t:'Oben an Milas Schrank dreht sich der Planwürfel für den Vormittag auf Kaufladen. Danach nimmt sie ihren Cube wieder mit.',
   ov:[{pulse:['planwuerfel']}, {cube:['planwuerfel'], to:'gelb'}]},
  {img:['piazza_800_hubel'], ev:true, t:'Kinder ohne Wahl nach dem Kreis, wie oft Angebote voll sind, wie lange der Kreis dauert.'}]},
 kasse:{title:'Die sprechende Kasse', steps:[
  {img:['kaufladen_kasse'], t:'Mila stellt ihren Cube auf die Ablage. Die Kasse weiß jetzt: 3 bis 6, Deutsch und Englisch.', ov:[{pulse:['ablage', 'mila_cube']}]},
  {img:['kaufladen_kasse'], t:'Die Aubergine kommt aufs rote Fenster. Der Chip in der Holzfrucht wird erkannt.', ov:[{pulse:['scan']}]},
  {img:['kaufladen_kasse'], t:'Aubergine. Eggplant. Am Geburtstag kommt die Familiensprache des Geburtstagskinds dazu: Patlıcan.',
   ov:[{bubble:['speaker'], t:'Aubergine. Eggplant.'}, {bubble:['defne_head'], t:'Patlıcan!', d:.8}]},
  {img:['kaufladen_kasse'], t:'Bezahlt wird mit Holztalern, die Kasse zählt das Rückgeld laut mit.',
   ov:[{pulse:['coins']}, {bubble:['speaker'], t:'zwei Taler zurück!'}]},
  {img:['kaufladen_kasse'], ev:true, t:'Wie oft der Laden genutzt wird und welche neuen Wörter Familien von zu Hause erzählen.'}]},
 becken:{title:'Das Lichtkäfer-Becken', steps:[
  {img:['waschraum_aus_becken'], t:'Zwanzig Sekunden fühlen sich für Dreijährige endlos an, und nebenan wartet das Kochen.', ov:[]},
  {img:['waschraum_1145_becken'], t:'Hände unter den Hahn: Der Ring leuchtet, der Käfer startet.', ov:[{ring:'ring1', dur:5}]},
  {img:['waschraum_1145_becken'], t:'Schäumen, solange er läuft. Einmal herum: Pling.', ov:[{ring:'ring1', dur:4, done:true}, {bubble:['maren_head', 'sanne_head'], t:'Pling!'}]},
  {img:['waschraum_1145_becken'], t:'Infektwoche in Berlin: Der Käfer braucht 30 statt 20 Sekunden.', ov:[{ring:'ring1', dur:7}, {cloud:['sink1'], t:'Öffentlicher Wochenbericht'}]},
  {img:['waschraum_1145_becken'], ev:true, t:'Seifenverbrauch pro Tag und Krankheitstage der Gruppe in Infektwellen gegen das Vorjahr.',
   src:['Willmott u. a. 2016', 'https://adc.bmj.com/content/101/1/42']}]},
 kueche:{title:'Ein Raum, der Küche kann', steps:[
  {img:['kaufladen_umbau'], t:'Die Wand ist ganz aus Holz, vom Boden bis zur Decke. Unten Spiele und der Laden, frei für Kinder.', ov:[{pulse:['schrankwand']}]},
  {img:['schrankwand_offen'], t:'Oben, außer Reichweite, ein Fach mit Zahlenschloss: Kochplatte, Messer, Reiniger. Den Code kennen nur Erwachsene.', ov:[{pulse:['schloss']}]},
  {img:['kaufladen_kochen', 'kaufladen_umbau'], need:['verbinder'], t:'Die Tischplatten stehen nebeneinander in der Wand. Herausziehen, Beine ausklappen, verbinden. Die Verbinder rasten hörbar ein, die Insel steht fest.',
   ov:[{pulse:['verbinder']}, {chip:['verbinder'], t:'klick', dy:-44}]},
  {img:['kaufladen_kochen'], t:'Maren öffnet das Rezept der Kollegin aus dem Ideenschatz. Für die zwei Kinder, die keine Milch vertragen, rechnet es zwei Portionen ohne Käse.', ov:[{phone:'rezept'}]},
  {img:['kaufladen_kochen'], ev:true, t:'Reste pro Mahlzeit, Zeit fürs Umräumen, wie viele Kinder mitrühren, Unfälle an der Insel.'}]},
 garten:{title:'Der Kräutergarten', steps:[
  {img:['vorraum_1400'], t:'Zwei Wände voller Kräuter und Tomaten. Draußen liegt Schnee, drinnen ist es grün.', ov:[{pulse:['regal']}]},
  {img:['vorraum_1400'], t:'In jedem Topf steckt ein Holzstab. Blau heißt Durst, aus heißt gut. Die Gießkanne hat Striche für klein und groß.',
   ov:[{pulse:['stab']}, {chip:['stab'], t:'blau', cls:'blue', dy:-44}]},
  {img:['vorraum_1400'], t:'Am Tomatenstrauch hängt ein Plättchen. Maren dreht es auf Rot, wenn geerntet werden kann.',
   ov:[{pulse:['reif']}, {chip:['reif'], t:'reif', cls:'bad', dy:-44}]},
  {img:['vorraum_nacht'], t:'Nachts leuchtet das Pflanzenlicht. Der Strom kommt vom Dach und wurde tagsüber gespeichert.', ov:[{pulse:['licht']}]},
  {img:['vorraum_1400'], ev:true, t:'Ernte pro Monat, wie oft eigene Kräuter in der Soße landen, Strom für Licht gegen Ertrag des Dachs.'}]},
 abholen:{title:'Schrank und Eltern-App', steps:[
  {img:['abholung_faecher'], t:'Der Fuchs-Cube ist zurück in der Nische. Die Planwürfel zeigen morgen: Bauen.', ov:[{pulse:['planwuerfel']}]},
  {img:['abholung_faecher'], t:'Papa sieht den Tag der Gruppe und eine Zeile von Maren. Keine Fotos, keine Noten.', ov:[{phone:'eltern'}]},
  {img:['abholung_faecher'], t:'Er tippt: Waffeln backen? Der Wunsch landet im Ideenschatz.', ov:[{phone:'wunsch'}]},
  {img:['abholung_wunsch'], t:'Ayla steckt ihren Wunsch lieber als Karte in den Wunschkasten aus Holz.',
   ov:[{pulse:['wunsch']}, {bubble:['ayla_head'], t:'Kostüme nähen?'}]},
  {img:['abholung_wunsch'], ev:true, t:'Dokumentationszeit des Teams, Anteil Familien mit Wünschen, Weiterempfehlungen.'}]},
 notiz:{title:'Marens Notiz', steps:[
  {img:['piazza_1615'], t:'Maren spricht frei, drei Minuten. Kein Formular.', ov:[{phone:'notiz_rec'}]},
  {img:['piazza_1615'], t:'Der Text kommt geordnet zurück: was lief, was die Kinder gelernt haben, was beim nächsten Mal.', ov:[{phone:'notiz_text'}]},
  {img:['piazza_1615'], t:'Zwei Nachfragen. Maren antwortet mit einem Satz.', ov:[{phone:'notiz_fragen'}]},
  {img:['piazza_1615'], t:'Der Eintrag hängt am Rezept der Kollegin. Die nächste Gruppe liest beides.', ov:[{chip:['tafel', 'maren_head', 'sanne_head'], at:[.5, .45], t:'im Ideenschatz', dy:-44}]},
  {img:['piazza_1615'], ev:true, t:'Dokumentationszeit, Einträge pro Gruppe, wie oft Erfahrungen in anderen Gruppen wieder auftauchen.'}]}
};

/* Phone mocks (texte_v5: Handy-Mock morgen, angebote, rezept, eltern, wunsch, notiz). */
const MIC = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5.5" y="1.5" width="5" height="8.5" rx="2.5" fill="currentColor"/><path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';
const WAVE = '<div class="wave" aria-hidden="true">' + [5, 9, 14, 8, 17, 11, 6, 13, 18, 10, 7, 15, 12, 8, 16, 9, 5, 11, 14, 7].map(h => `<i style="height:${h * 5}%"></i>`).join('') + '</div>';
const NOTIZ_ROWS = '<div class="row"><b>Was lief</b>Alle wollten rühren, zwei Schüsseln haben gereicht</div>'
  + '<div class="row"><b>Gelernt</b>Abmessen mit Löffeln, Basilikum und tomato auf Englisch</div>'
  + '<div class="row"><b>Nächstes Mal</b>weniger Knoblauch, Kräuter aus dem Vorraum</div>';
const NOTIZ_FRAGEN = '<div class="row q"><b>Nachfrage 1</b>Soll das Rezept für andere Gruppen sichtbar sein? <span class="ans">Ja</span></div>'
  + `<div class="row q"><b>Nachfrage 2</b>Was hat mit der Portion ohne Milch geklappt? <span class="ans mic">${MIC}Antwort einsprechen</span></div>`;
const PHONES = {
 morgen:'<h4>Dienstag</h4><div class="sub">Bären · vollzählig</div>'
  + '<div class="row"><b>Neu im Ideenschatz</b>Tomatensoße mit Kindern, erprobt in 3 Gruppen</div>'
  + '<div class="row"><b>Notiz der Kollegin</b>Alle wollten rühren, zwei Schüsseln nehmen</div>'
  + '<div class="fine">Vorbereitung 7:30 am Teamtisch.</div>',
 aus:'',
 angebote:'<h4>Dienstag</h4><div class="sub">Bären · Vormittag</div>'
  + '<div class="row sw"><i class="y"></i><b>Kaufladen</b>5 Plätze</div>'
  + '<div class="row sw"><i class="b"></i><b>Bauen</b>6 Plätze</div>'
  + '<div class="row sw"><i class="r"></i><b>Malen</b>6 Plätze</div>'
  + '<div><span class="pbtn">Auf den Hubel</span></div>'
  + '<div class="fine">Die Kinder wählen im Kreis.</div>',
 rezept:'<h4>Tomatensoße mit Kindern</h4><div class="sub">aus dem Ideenschatz, Haus Wittenau</div>'
  + '<div class="row"><b>14 Portionen</b>davon 2 ohne Milch</div>'
  + '<div class="row"><b>Zutaten mit Mengen</b><span class="skel"></span><span class="skel s"></span><span class="skel"></span></div>'
  + '<div class="row"><b>Notiz der Kollegin</b>Basilikum erst am Ende</div>'
  + '<div class="fine">Unverträglichkeiten aus der Gruppenliste, nur für die Lernbegleitung sichtbar.</div>',
 eltern:'<h4>Bei den Bären</h4><div class="sub">für Familie Berger</div>'
  + '<div class="row"><b>Morgenkreis</b>Mila hat Kaufladen gewählt</div>'
  + '<div class="row"><b>Kaufladen</b>Defnes Geburtstag, Wörter auf Türkisch</div>'
  + '<div class="row"><b>Mittag</b>Tomatensoße selbst gemacht, Basilikum aus dem Vorraum</div>'
  + '<div class="row"><b>Notiz von Maren</b>Mila hat beim Abmessen bis zehn gezählt</div>'
  + '<div class="fine">Keine Fotos, keine Bewertungen. Was du siehst, stellst du selbst ein.</div>',
 wunsch:'<h4>Wunsch für die nächsten Tage</h4><div class="sub">an den Ideenschatz der Gruppe</div>'
  + '<div class="input">Waffeln backen? Wir bringen das Waffeleisen mit</div>'
  + '<div><span class="pbtn">Senden</span></div>'
  + '<div class="fine">Die Lernbegleitung entscheidet.</div>',
 notiz:'<h4>Sprachnotiz 3:12</h4><div class="sub">Bären · Tomatensoße</div>' + NOTIZ_ROWS + NOTIZ_FRAGEN
  + '<div><span class="pbtn">Freigeben</span></div>',
 notiz_rec:'<h4>Sprachnotiz 3:12</h4><div class="sub">Bären · Tomatensoße</div>'
  + `<div class="rec"><span class="dot"></span>3:12</div>${WAVE}<div class="recmic">${MIC}</div>`,
 notiz_text:'<h4>Sprachnotiz 3:12</h4><div class="sub">Bären · Tomatensoße</div>' + NOTIZ_ROWS,
 notiz_fragen:'<h4>Sprachnotiz 3:12</h4><div class="sub">Bären · Tomatensoße</div>' + NOTIZ_FRAGEN
  + '<div><span class="pbtn">Freigeben</span></div>'
};
