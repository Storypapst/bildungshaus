# V6 Reader-Rücksprung: erster sichtbarer Zustand

## Ursache und minimale Änderung

Die Präsentation bleibt unter dem Reader montiert und wird mit `hidden` ausgeblendet. Beim Zurückkehren wurde sie zunächst sichtbar, während die Scrollposition erst in einem `requestAnimationFrame` aus einem passiven Effect wiederhergestellt wurde. Dadurch war kurz eine falsche Position messbar und sichtbar.

Die öffentliche Mindmap-Prüfung reproduzierte dies im dunklen Desktop-Profil: Der Rahmen lag bei der ersten Messung bei `y=2638.546875`; die unmittelbar danach gemessene Karte „Erfahrung weitergeben“ lag nach dem Rücksprung bei `y=345.18218994140625`. Die Kartenansicht blieb unverändert (`12,33,0.7176470588235294`). Es handelte sich um einen verspäteten Seitensprung zwischen Messungen, nicht um ein geometrisch abgeschnittenes Kartenlabel.

`App.tsx` stellt jetzt die gespeicherte Position bzw. den direkten Zielanker im `useLayoutEffect` wieder her: nach dem DOM-Wechsel, aber vor dem ersten sichtbaren Frame. Mindmap-Geometrie, Inhalte, Reader und Hero wurden dafür nicht verändert.

## Gezielte Regression

`scripts/verify-reader-return.mjs` beobachtet mit einem MutationObserver den ersten messbaren Zustand beim Entfernen von `hidden`, ohne eine Wartezeit einzubauen. Der öffentliche Stand vor dem Fix scheiterte damit reproduzierbar beim direkten Whitepaper-Rücksprung: `scrollY=0`, Bibliothek `top=12324.5`.

Lokal nach dem Fix bestanden alle vier Profile (Desktop/Mobil, normale/reduzierte Bewegung):

- Direkt aufgerufenes Whitepaper → Bibliothek im ersten Zustand bei 31,5 bzw. 32,1 px.
- Unbekanntes Dokument → Bibliothek ebenso im ersten Zustand.
- Native Anker zur Idee und zur Problemanalyse funktionieren weiterhin.
- Je drei Graph → Reader → Graph-Rundwege: Ausgangsposition beim Hashwechsel und erster Rücksprungzustand identisch; auch über die nächsten zwei Frames kein nachträglicher Sprung.
- Keine Browserfehler.

Zusätzlich unverändert bestanden: `verify-mindmap.mjs` mit allen 88 Haus-/Mehrhäuser-Rundwegen in vier Profilen, nativer Pointer-Capture, Pan/Zoom und Axe; `verify-documents.mjs` mit 22 Dokumenten, Downloads und Axe. Produktionsbuild erfolgreich. Artefakte: `output/qa/reader-return-v6/report.json`, `output/qa/mindmap-v6-return-fix/`, `output/qa/documents-v6-return-fix/`.

Der Fix ist lokal verifiziert; erneute öffentliche Prüfung erfolgt nach Deployment durch den koordinierenden Agenten.
