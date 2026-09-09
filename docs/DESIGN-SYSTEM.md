# weWeit Designsystem

Diese Datei ist der Einstieg zur gemeinsamen Gestaltung. Die interaktive
[Designbibliothek lokal öffnen](http://127.0.0.1:5182/bildungshaus/design-system.html)
verwendet denselben Code wie die Website. Sie wird mit dem unten beschriebenen
Entwicklungsserver gestartet; GitHub zeigt hier die Dokumentation und Quelldateien.

## Dateien im Repository

| Bestandteil | Quelle |
| --- | --- |
| Interaktive Bibliothek | [DesignSystem.tsx](../src/DesignSystem.tsx) · [HTML-Einstieg](../design-system.html) |
| Farben, Abstände und Rollen | [tokens.css](../src/styles/tokens.css) |
| Bibliothekslayout | [library.css](../src/styles/library.css) |
| Gemeinsame Bedienelemente | [components/ui](../src/components/ui) |
| Illustrationen | [public/images](../public/images) |
| Browserprüfung | [verify-design-system.mjs](../scripts/verify-design-system.mjs) |

## Visuelle Sprache

Outfit trägt die Lesetexte, Kalam die handschriftlichen Hinweise. Ruhige Flächen
lassen den Inhalt und die Zeichnungen wirken. Illustrationen dürfen naiv, schief
und unterschiedlich kräftig gezeichnet sein: Buntstift, Kugelschreiber, Klebeband
und unregelmäßige Zettel gehören zur Gestaltung. Sie erklären konkrete Situationen
und Zusammenhänge. Text bleibt als lesbarer HTML-Inhalt zugänglich; kleine
Bilddetails ersetzen keine notwendige Erklärung.

Mobil wird die Anordnung an die Leserichtung angepasst: Zettel und Schritte
folgen untereinander, statt einen großen Desktop-Kreis unlesbar klein zu skalieren.

## Farbgrundlage

Die Farbquelle ist [Amber Slate](https://21st.dev/community/themes/editor?from=amber-slate). Die tatsächlich gerenderten Referenzfarben wurden im Browser verglichen. Outfit und der Radius von 0,5 rem bleiben erhalten.

## Eine Quelle für Farben

`src/styles/tokens.css` enthält drei Ebenen:

1. `--palette-*`: feste Ausgangsfarben. Markenorange `#df6035`, Marineblau `#2f4b79` (dunkel `#284167`), neutrale Grauflächen.
2. Rollen: `--background`, `--card`, `--foreground`, `--primary`, `--secondary`, `--strong-ink`, `--control-border`. Komponenten verwenden diese Rollen, keine eigenen Hexwerte.
3. Komponentenentscheidungen: `--control-height`, `--control-padding`, `--elevation-*`, `--motion-*`, `--slider-track`, `--result-shadow`.

`--brand-orange` bleibt die Originalfarbe. `--primary` ist der dunklere Aktionston `#c44e28`: Das im Artefakt vorgeschlagene `#c9532c` erreichte im Browser mit Weiß nur 4,41:1. Kleine weiße Buttontexte brauchen mindestens 4,5:1. Sekundärtexte und Bedienelementränder sind ebenfalls für ihre tatsächlichen Flächen angepasst. Dekorative Ränder dürfen dezenter bleiben.

Hell/Dunkel werden ausschließlich über `.dark` und die zentralen Rollen umgeschaltet. Illustrationen und die unveränderte ScrollCraft-Vendorpalette sind keine UI-Tokens; die aktiven ScrollCraft-Rollen werden zentral auf unsere Rollen abgebildet.

## Komponentenbibliothek öffnen

```sh
npm run dev -- --host 127.0.0.1 --port 5182
```

- Website: http://127.0.0.1:5182/bildungshaus/
- Bibliothek: http://127.0.0.1:5182/bildungshaus/design-system.html

Die Bibliothek verwendet echte Buttons und den echten Rechner. Sie bietet Hell/Dunkel, lange Beschriftungen, deaktivierte Aktionen und drei Oberflächenebenen. Der zusätzliche HTML-Einstieg ist nur im Entwicklungsserver verfügbar und nicht Teil des normalen Produktionsbuilds.

Buttons und als Buttons gestaltete Links verwenden `buttonVariants`. Keine lokalen Farb-, Höhen- oder Hover-Korrekturen anlegen. Mindmap-Knoten sind räumliche Navigation und behalten ihre eigene Geometrie; deren Farben und Schatten verwenden dieselben Tokens.

## Prüfen

```sh
npm run build
npm run lint
node scripts/verify-token-contract.mjs
node scripts/verify-design-system.mjs
node scripts/verify-refinements.mjs
```

Die beiden neuen Browserprüfungen erwarten den obigen Entwicklungsserver. Die Tokenprüfung kontrolliert Umbrüche, Mindesthöhe, Axe-Kontraste und Rechnerwerte bei reduzierter Bewegung und schnellen Änderungen. Die zweite prüft Reveal, Kapitel-Fokus und eine mobile WebKit-Darstellung, sofern WebKit lokal verfügbar ist. Screenshots liegen unter `output/qa/feinschliff-*` und werden nicht eingecheckt.
