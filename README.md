# Bildungshaus Wurzelwald – interaktive Präsentation

React/TypeScript-Präsentation mit shadcn/ui, Scroll Craft und Amber-Slate-Farben.
Die redaktionelle Quelle ist der geroutete Bildungshaus Core. Originalkonzept und
chronologische Eingaben bleiben dort unverändert. Dieses Repository enthält daraus
abgeleitete Veröffentlichungstexte, keine vertraulichen Umfrageantworten.

## Development

```sh
npm ci
npm run dev
npm run build
npm run lint
node scripts/verify.mjs
```

Die Anwendung verwendet den Basispfad `/bildungshaus/`. `BILDUNGSHAUS_CORE` zeigt
auf den maschinenlokal aufgelösten Core. Aktualisierung der Veröffentlichung:

```sh
BILDUNGSHAUS_CORE="<routed core>" node scripts/sync-content.mjs
npm run build
```

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
