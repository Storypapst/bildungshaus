# Umsetzung des Artefakts: weWeit Feinschliff

Quelle: https://claude.ai/code/artifact/9dc0ecf8-63c6-4f78-94c1-60ef7f410e74
Stand: 8. September 2026. Ausschließlich lokale Änderungen; kein Push und kein Deployment.

| Punkt | Umsetzung |
| --- | --- |
| A1 Reveal | 14 px / 620 ms der vorhandenen Engine erhalten. Wirkungskette, Roadmap und Bibliothek werden als Stagger-Gruppen beobachtet (60 ms). Der behauptete globale Abschalt-Override existiert im aktuellen Code nicht. Reduced Motion bleibt sofort sichtbar; Hero bleibt ohne Eintrittshürde. |
| A2 Rechner | 300-ms-Animation, bei neuer Eingabe ab dem sichtbaren Wert neu starten; Reduced Motion sofort. Screenreader erhalten nur den Zielwert. Ergebnisfläche angehoben, Slidergriff 20 px mit vergrößerter Trefferfläche. Berechnung unverändert. |
| A3 Buttons | Gemeinsame Komponente und Rollen; mindestens 44 px, 18 px Innenabstand, 15 px Schrift, 8 px Radius, umbrechende Beschriftungen. Hover nur für passende Zeiger, sichtbarer Tastaturfokus. Alte Download-Sondergestaltung entfernt. |
| A4 Orange | Originales Markenorange bleibt; eigener geprüfter dunklerer Aktionston. Keine pauschale Übernahme des unzureichenden Kontrastwerts aus dem Artefakt. |
| A5 Beschriftungen | Zusammenfassung: „Konzept in Kürze“. Pilotlink: „Pilot ansehen“. Download bleibt „Gesprächszettel laden“. Das Merken eines Knotens heißt „Für Gespräch vormerken“, weil es noch keinen Download auslöst. |
| A6 Tiefe | Drei zentrale Schattenstufen, dezente Karten- und Detailtiefe. Keine Transform-Änderung an der räumlichen Mindmap. |
| A7 Übergänge | 120-px-Verläufe von der jeweils vorherigen Fläche an den Farbwechseln. Hero- und Roadmap-Bildüberstand auf Desktop, 4 % Körnung im Lab. Auf schmalen Geräten kein Überstand. |
| A8 Browser | Auswahl, Scrollbar, Eingabefarbe und Fokus aus Tokens. |
| A9 Kapitel | 8-px-Punkte, aktive 20-px-Markierung, 44-px-Ziele; beschrifteter Hover und Tastaturfokus. Mobil weiterhin ausgeblendet. |
| A10 Redaktion | Redundante Eyebrows reduziert, Roadmap ausdrücklich erhalten; Lab-Ziffern entfernt, Forschungskennungen erhalten; zwei unnötige Gedankenstriche geglättet. Keine Forschungsargumente umgeschrieben. |
| A11 Prüfung | Build, Lint und Browserprüfungen lokal. Physisches iPhone bleibt eine gesonderte Geräteprüfung; keine Freigabe dafür behauptet. |

Die Gestaltung wurde an den aktuellen Dateien geprüft. Veraltete Diagnosen und feste Buttonhöhen aus dem Artefakt wurden nicht blind übernommen. Inhalte, Bilder, Rechnerannahmen und Fragebogen-Zieladressen bleiben bestehen.

## Lokales Prüfergebnis

- Produktionsbuild erfolgreich; Lint ohne Fehler, 13 vorhandene Warnungen (Vendor / Fast Refresh).
- Story-Prüfung: Desktop, 390 px, 360 px; Hell/Dunkel, Lab-Animation und Pretest-Dialog bestanden, keine Axe-Verstöße.
- Mindmap: beide Perspektiven, insgesamt 88 geprüfte Verbindungspfade über vier Darstellungen; keine Browserfehler.
- 18 Diagramme in Desktop/Mobil und nochmals 18 in Dunkel; drei repräsentative Leseransichten ohne Axe-Verstöße, Rücksprung zur Kind-Auswahl bestanden.
- Designbibliothek: vier Darstellungen, vollständige Buttontexte, mindestens 44 px Höhe, keine Axe-Verstöße; Rechner bei schnellen Eingaben und reduzierter Bewegung korrekt.
- Roadmap und alle 18 Forschungslinks erscheinen nach Eintritt; Kapitelbeschriftung per Tastatur sichtbar.
- Aktive Anwendungs-CSS enthält außerhalb der Token-Datei keine Farbliterale.
- Lokales WebKit nicht installiert. Safari und physisches iPhone sind ausdrücklich noch ungeprüft.

Prüfartefakte: `output/qa/feinschliff-story`, `feinschliff-diagrams`, `feinschliff-mindmap`, `feinschliff-tokens`, `feinschliff-interaction`.

## Korrektur nach Rückmeldung zur Vorschau

Der frühere Entwicklungsserver auf Port 5182 war beendet. Die Vorschau wird nun als vom Testprozess unabhängiger lokaler Prozess gestartet (weiterhin nur 127.0.0.1). Sie wurde im Codex-Browser sichtbar geöffnet und als Ergebnis-Tab behalten. Keine Veröffentlichung.

Beim erneuten direkten Vergleich fehlten noch Teile der Claude-Vorschläge: Einstieg der Wirkungskette, Button-Schatten und Lichtkante, vollständige Übergänge aus der vorherigen Sektionsfarbe, Lab-Körnung und Roadmap-Bildüberstand. Diese sind ergänzt. Der orangefarbene Schimmer am Rechner ist durch einen gerichteten, zurückhaltenden Schatten ersetzt. Aktive Kapitelmarkierung jetzt in Marine mit animiertem Label.

## Gestalterische Korrektur nach den Screenshots

Die abgehakten Punkte waren keine ausreichende visuelle Abnahme. Das alte `.everyday-grid` hatte nach dem Entfernen eines Labels nur noch ein Kind; der gesamte Inhalt stand damit in der schmalen ersten Spalte. Ersetzt durch eine explizite Überschrift-/Text-Anordnung mit einer bildfüllenden Reihe darunter, mobil zwei Zeichnungen pro Reihe. Neue Prüfung umfasst 1440, 1100, 800 und 390 Pixel, Hell/Dunkel und tatsächlichen Textüberlauf.

Die beanstandeten flächigen Verläufe, zusätzliche Körnung und erzwungene Bildüberstände wurden entfernt. Zeichnungen stehen wieder frei, ohne zusätzliche Kartenkästen. A6 und A7 im Artefakt deshalb wieder unmarkiert; die bisherige Hakenliste ist ausdrücklich keine vollständige Designfreigabe. Keine Veröffentlichung.
