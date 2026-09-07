# V6: eigene Befunde für die Mehrhäuseransicht

Neun eigenständige Layer-Befunde ersetzen die mehrfach verwendeten Hausbefunde. Daten: `src/content/network-findings.json`; typisierte Zuordnung: `src/networkFindings.ts`. Jeder Befund besitzt eigene ID, Kartenbezeichnung, Titel, Kennzahl bzw. Argument, Text, Quellen und eine vorhandene Artikel-ID. Es werden keine neuen empirischen Wirkungen behauptet.

Der ausgewählte Netzwerkbefund wird in `ProblemGraph` getrennt vom bestehenden Hausknoten verwaltet. `Mindmap` erhält die kontrollierte Perspektive und die dazu passende Auswahl. Dadurch markieren Team-/Küchenargumente nicht mehr beide früher gleichnamigen Karten. Ein Leser-Rücksprung erhält Perspektive, eigenen Befund und Ausschnitt. Die ursprünglichen 13 Hausknoten und ihre Bookmarks bleiben erhalten. Netzwerkbefunde verwenden keine fälschlich gemeinsam gespeicherten Haus-Bookmarks; ihre Hauptaktion führt in die zugehörige Synthese.

Inhalt: Wissen weitergeben, Einarbeitungszeit, absolute Austritte bei gleicher Quote, gemeinsame Rezeptqualität, Beschaffung, verlässliche Übergänge, Koordination, Wissenspflege im Lab und Netto-Nutzen. Die Beispiele 20/100 Beschäftigte bei angenommenen 5 %, fünf Neueinstiege mit zwölf Begleitstunden und n×(n−1)/2 mögliche Hauspaare sind sichtbar fiktiv. Gemeinsamkeit allein ist keine zugesicherte Einsparung.

Quellen und Nenner sind separat im Core dokumentiert: `40 - Analysis & Evidence/41 - Audit/V6 - Mehrhaeuserperspektive - Befundabgleich.md`. Vorhandene Synthesen P03, P08, P10, P12 und P15 wurden verwendet; DGE-Standard und BeKi-Bericht wurden zusätzlich direkt geöffnet.

Prüfung gegen Production-Preview: 88/88 Wege bestanden (13 Hausbefunde + 9 Netzwerkbefunde, jeweils Desktop/Mobil und hell/dunkel). Der Test prüft eigene Texte, Quellenzahl, Reader-ID, genau eine ausgewählte Karte und Rückkehr zur Perspektive. Native Pointer Capture, Touchgeste, Zoom, extreme Ziehstrecken und vollständige Karten-/Kantenlabels bestehen weiterhin. Build/TypeScript bestanden, Lint ohne Fehler. Report und Screenshots: `output/qa/mindmap-v6/`. Echte Mobilhardware wurde nicht geprüft; Veröffentlichung folgt durch den Hauptagenten.
