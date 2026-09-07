# Mindmap: direkte Inhalte und begrenzte Bedienung

Nutzerkorrektur: Die Karte sprang bei Bedienung weg, Texte liefen über den Kartenrand; der Überblick enthielt weniger als die erst nach einem weiteren Klick erreichbare Befundansicht. Die Struktur sollte zudem mehrere Häuser eines Trägers abbilden.

## Geändert

- Neue isolierte Komponente `src/Mindmap.tsx`, unveränderte öffentliche `ProblemGraph`-Props.
- Zwei feste Perspektiven: Alltag in einem Haus (12 Karten) und mehrere Häuser eines Trägers (9 Karten). Alle 13 redaktionellen Themen sind zusätzlich direkt über „Alle Themen“ erreichbar.
- Die zweite Perspektive zeigt zwei ausdrücklich beispielhafte Häuser mit je Team und Küche, Wechsel/Einarbeitung, Kinder/Familien, einen Träger, das gemeinsame Lab und gemeinsame Mittel. Zwei durchgezogene Linien verbinden den Träger ausdrücklich mit beiden Teams. Modell und Tatsachenbehauptung sind getrennt bezeichnet.
- Direktes Ziehen ohne Aktivierungsmodus, begrenzter Zoom, feste Pan-Grenzen und „Alles zeigen“. Ein Mausklick auf eine Karte verändert weder Zoom noch Seitenposition. Nur Tastaturfokus kann eine außerhalb des gezoomten Ausschnitts liegende Karte behutsam in Sicht bringen.
- `overflow: clip` verhindert, dass der Browser zusätzlich zur bewusst gesteuerten Transformation noch eine native Scrollposition im Kartenfenster aufbaut. Pointer Capture wird normal verwendet und freigegeben. Leere/ausgeblendete Container setzen den Zoom nicht auf Null zurück; Leser-Rückkehr erhält den vorherigen Ausschnitt.
- Karten haben eine ausreichende Textbreite und umbrechbare Beschriftung. Netzwerk-Kantenlabels liegen außerhalb der Karten.
- Rechts bzw. im mobilen Dialog stehen das komplette `node.detail`, Kurzbefund und Quellen unmittelbar. Es gibt nur noch Überblick und Quellen. „Befund vertiefen“ öffnet direkt den vollständigen Artikel; der dazwischengeschaltete Befunddialog entfällt.

## Prüfverfahren und Grenzen

`scripts/verify-mindmap.mjs` läuft gegen den gebauten Production-Preview. Es ersetzt keine Pointer-APIs: `gotpointercapture` und `lostpointercapture` werden lediglich beobachtet. Die Tests prüfen alle 13 Artikelpfade in vier Ansichten, beide Perspektiven, vollständige Karten im Fit-Modus, Textüberlauf, von Karten verdeckte Kantenlabels, unveränderte Position bei Pointerklick, Ziehstrecken bis ±3000/2200 px, endliche Transformationswerte, verbleibende sichtbare Karten, native Scrollposition 0/0, Tastatur, Zoom und Rückkehr aus dem Leser. Zusätzlich werden auf dem mobilen Chrome-Profil echte Touch-Input-Ereignisse ausgelöst. Das ist keine Prüfung auf physischer Mobilhardware.

Die im Nutzerscreenshot komplett weiße Browserseite wurde in dieser Form nicht reproduziert. Die zuvor vorhandenen unbeschränkten Verschiebungen, automatischen Fokus-Zoomänderungen und native Scrollmöglichkeit des Clipping-Containers sind konkrete entfernte Fehlerquellen. Eine Behauptung über einen bestimmten Browserprozess-Absturz lässt sich aus dem Screenshot nicht ableiten.

Nachweise liegen in `output/qa/mindmap/` (Screenshots und Bericht) sowie `output/qa/v5-full/report.json` (übergreifender Nutzerfluss). Der kompatible Einstieg `scripts/verify-graph.mjs` führt über `verify-graph-split.mjs` zur aktuellen Mindmap-Prüfung.

Kein Deployment oder Commit durch diesen Teilauftrag. Der Hauptagent prüft die veröffentlichten Dateien nach Integration.

## Finaler lokaler Stand

Production-Preview: 52/52 direkte Artikelpfade bestanden; beide Ebenen in Desktop/Mobil und hell/dunkel geprüft. Alle Karten vollständig im Fit-Modus, keine Textüberläufe, keine von Karten verdeckten Kantenbeschriftungen. 8 native Capture/Release-Paare je Desktop-Profil und 9 je Mobil-Profil einschließlich Touchgeste. Keine JavaScript- oder Graph-WCAG-A/AA-Fehler.

Der übergreifende Produktionslauf bestand mit Desktop 1440×1000, Mobil 390×844, kompakt 360×640 und Reduced Motion 1440×900; jeweils keine HTTP-/JavaScript-/axe-Fehler in heller und dunkler Darstellung. Build und TypeScript bestanden. Lint hat keine Fehler; Engine- und Fast-Refresh-Warnungen bleiben.
