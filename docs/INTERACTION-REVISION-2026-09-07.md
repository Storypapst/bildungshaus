# Interaktion: Auswahl und Erklärung bleiben zusammen

Auftrag: ausdrückliche Revision durch Frank vom 7. September 2026. Die bestehende redaktionelle Scroll-Erzählung bleibt erhalten. Der Nutzer hat das Whiteboard positiv bewertet, aber die darunter stehende Detailansicht übersehen und die lange Linkliste als erschlagend beschrieben.

## Umsetzung

- Desktop über 1000 px: links das Whiteboard bzw. die Themenliste, rechts eine begrenzte Lesefläche. Titel, Status und nächste Aktion bleiben sichtbar. Die Höhe passt sich dem verfügbaren Viewport an, ohne beim Auswählen die Seite programmatisch zu verschieben.
- Kleine Viewports: Die Auswahl öffnet einen zugänglichen Dialog. Schließen und Escape führen den Fokus zur Auswahl zurück. Ein sichtbarer Knopf öffnet die letzte Auswahl erneut.
- Drei horizontale Tabs: Überblick, Verbindungen mit Anzahl, Quellen mit Anzahl. Lange Inhalte scrollen innerhalb des Fensters; eine dynamische Anzeige kennzeichnet weitere Inhalte. Auf Desktop bleibt die Karte beim Lesen sichtbar.
- „Mehr erfahren“ an den Knoten und ein Satz über der Karte erklären das Verhalten vor dem ersten Klick. Die Seitenbewegung bleibt normal; Kartenverschiebung ist weiterhin ausdrücklich einzuschalten.
- Die vorhandene ausführliche Befundansicht führt in den vollständigen Artikel. Artikelrückkehr bewahrt Knotenauswahl sowie Verschiebung und Zoom. Alle 13 Knoten und ihre Quellen bleiben erhalten.
- shadcn/Base UI Tabs wurden über die vorhandene CLI ergänzt. Dialog und Slider nutzen weiterhin die vorhandenen Komponenten; zusätzliche Styles sind auf die beiden Arbeitsflächen begrenzt.
- Der inaktive Sliderbereich ist sichtbar und erscheint nicht mehr deaktiviert. Die Griffe sind größer; ein klarer Fokusrahmen ergänzt die Tastaturbedienung.

## Nachweis

`scripts/verify-graph-split.mjs` prüft alle 13 Knoten auf Desktop und Mobil, jeweils hell und dunkel: Auswahl → Tabs → Befund → Artikel → zurück. Zusätzlich: unmittelbare Sichtbarkeit von Titel und Folgeaktion, Scrollen innerhalb der Detailfläche, Tastatur/Fokus/Escape, Kartenverschiebung/Zoom, normales Seitenscrollen und echte berechnete Sliderkontraste. `scripts/verify-graph.mjs` ist der kompatible Einstieg dafür. Das übergreifende `scripts/verify.mjs` wurde an den mobilen Dialog und den neuen Auftakt angepasst.

Messung am lokalen Chrome-Stand: Inaktiver Track 5,30:1 hell und 7,62:1 dunkel gegen den angrenzenden Abschnitt; aktive Fläche 7,38:1 / 8,14:1; Griffkante gegen Griff 8,27:1 / 10,01:1. Diese Zahlen gelten für die aktuellen Theme-Tokens, nicht für beliebige neue Farbvarianten.

Screenshots und maschinenlesbarer Bericht: `output/qa/graph-split/`. Echte Mobilhardware ist separat zu prüfen; Chrome-Emulation ist kein iPhone-Nachweis. Veröffentlichung und Prüfung der veröffentlichten Dateien erfolgen durch den Hauptagenten nach Integration der neuen Bilder.

## Abgeschlossenes lokales Ergebnis

- 52 von 52 vollständigen Klickwegen bestanden (13 Knoten × Desktop/Mobil × hell/dunkel).
- Zusätzliche Prüfungen bestanden: Beziehungswechsel setzt den Fokus auf den neuen Überblick; Escape und Schließen stellen den Auslöserfokus wieder her; Tab erreicht keine Bedienelemente der Hintergrundseite. Base UI verwendet dafür eigene unsichtbare Fokusgrenzen.
- Mausziehen, Tastaturverschiebung/Zoom, normales Seitenscrollen und intern begrenztes Weiterlesen bestanden. Auswahl und Kartenposition bleiben nach dem Artikel erhalten.
- Gesamtlauf `scripts/verify.mjs`: Desktop 1440×1000, Mobil 390×844, kompakt 360×640 und Reduced Motion 1440×900 bestanden, einschließlich Download, Rechner, Modulen und hellem/dunklem Design. Keine JavaScript-Fehler, HTTP-Fehler oder gefundenen WCAG-A/AA-Verstöße. Ergebnis: `output/qa/illustrated-full/report.json`.
- TypeScript bestanden; Lint ohne Fehler. Die vorhandenen Engine-Warnungen und die übliche Fast-Refresh-Warnung der generierten shadcn-Komponenten bleiben.

Visuell inspiziert: `desktop-light-overview.png`, `mobile-light-overview.png`, `mobile-light-connections.png`, `mobile-dark-connections.png` und `desktop-light-sliders.png` im Graph-Prüfordner. Das Desktopbild zeigt Karte und zugehörige Erklärung gemeinsam; die mobilen Verbindungen bleiben innerhalb des Dialogs. Kein Commit und kein Deployment durch diesen Teilauftrag.
