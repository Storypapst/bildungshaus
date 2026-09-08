# Bildungshaus weWeit – interaktive Präsentation

React/TypeScript-Präsentation mit shadcn/ui, Scroll Craft und Amber-Slate-Farben.
Die redaktionelle Quelle ist der geroutete Bildungshaus Core. Originalkonzept und
chronologische Eingaben bleiben dort unverändert. Dieses Repository enthält daraus
abgeleitete Veröffentlichungstexte, keine vertraulichen Umfrageantworten.

## Auf einem anderen Computer bearbeiten

Voraussetzungen: Git und Node.js 22.12 oder neuer. Das Repository ist der
bearbeitbare Website-Code inklusive Bilder, Lesedokumente und Designbibliothek.

```sh
git clone https://github.com/Storypapst/bildungshaus.git
cd bildungshaus
npm ci
npm run dev -- --host 127.0.0.1 --port 5182
```

Danach im Browser öffnen:

- Website: http://127.0.0.1:5182/bildungshaus/
- Designbibliothek: http://127.0.0.1:5182/bildungshaus/design-system.html
- Hero-Entwurf: http://127.0.0.1:5182/bildungshaus/hero-lab.html

Den geklonten Ordner in VS Code, Cursor oder einem anderen Editor öffnen.
Weitere Änderungen mit Git übertragen; `node_modules` und die laufende Vorschau
werden auf jedem Computer separat erzeugt. Die Vorschau braucht keinen Zugriff
auf Google Drive oder den Server.

## Wo liegt was?

| Ordner | Inhalt |
| --- | --- |
| `src/` | React-Komponenten, Interaktionen und Gestaltung |
| `src/styles/` | Gemeinsame Farb- und Gestaltungstokens |
| `src/content/` | Eingebundene Lesetexte, Quellen und Mindmap-Inhalte |
| `public/images/` | Illustrationen und Bilddateien |
| `public/dokumente/` | PDF-Downloads |
| `docs/` | Designentscheidungen und Prüfberichte |
| `scripts/` | Prüfungen, Inhaltssynchronisation und PDF-Erzeugung |
| `ops/` | Manuell auszuführende Deployment- und Rollback-Werkzeuge |

Die vollständigen Arbeitsdokumente, Transkripte und Originalquellen bleiben im
Google-Drive-Core „06 - Bildungshaus CC“. Hier liegen die für die Website
aufbereiteten Inhalte. Umfragedaten und Zugangsdaten gehören nicht in dieses
öffentliche Repository.

## Prüfen und Inhalte aktualisieren

```sh
npm run build
npm run lint
node scripts/verify-token-contract.mjs
```

Browserprüfungen in `scripts/verify-*.mjs` erwarten eine laufende lokale Vorschau
und installiertes Google Chrome. Die Anwendung verwendet den Basispfad
`/bildungshaus/`. Für die optionale Inhaltssynchronisation zeigt
`BILDUNGSHAUS_CORE` auf den maschinenlokal aufgelösten Drive-Core:

```sh
BILDUNGSHAUS_CORE="<routed core>" node scripts/sync-content.mjs
npm run build
```

Ein Git-Push veröffentlicht die Website nicht. Deployment erfolgt separat und
manuell gemäß `ops/README.md`. Die Designbibliothek und das Hero-Lab sind lokale
Entwurfsseiten.

## Inhalt und Verhalten

- Beziehungsnetz mit 13 Knoten, Akteuren und typisierten Verbindungen; Quellen mit Jahr, Population, Bezugsgröße und Fundstelle.
- Zweistufige Vertiefung: Befund-Dialog und ausführliche Research-Synthese.
- 18 Synthesen, Whitepaper, Executive Summary, Quellenregister und unveränderte Baseline: 22 Lesedokumente.
- Rechenbeispiel aus dem Berliner Sachkostensatz. Der frei werdende Anteil ist eine veränderbare Annahme.
- Gesprächszettel aus vorgemerkten Themen; Speicherung ausschließlich im Browser.
- Lokale Outfit-Schrift, keine Analytics und keine Drittanbieter-Schriftanfragen.
- Hell/Dunkel, native Scrollnavigation, Tastatur, reduzierte Bewegung.

## Herkunft der Gestaltung

Scroll Craft: https://github.com/nateherkai/scroll-craft (MIT; Engine unverändert).
shadcn/ui: https://ui.shadcn.com (Komponenten über CLI, Base UI).
Farbvorgabe: https://21st.dev/@serafimcloud/themes/amber-slate, ergänzt um
kontraststarke Text- und Interaktionsfarben. Bilddateien beziehungen-punk-v2, haus-punk und wachsen-punk
wurden mit dem integrierten Bildgenerierungswerkzeug nach Nutzerbrief erzeugt.
Frühere ordentliche Entwürfe sind nicht Bestandteil der Veröffentlichung.

Der erste Entwurf ist als redaktionelles Arbeitsheft gestaltet: Kapitel im
Dokumentfluss, eine offene Graphfläche und ein persönlicher Gesprächszettel am
Ende. Keine erzwungenen Scroll-Pausen. Siehe docs/BRIEF.md und docs/VERIFICATION.md.
