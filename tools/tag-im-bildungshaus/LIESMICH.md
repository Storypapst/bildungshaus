# Ein Tag im Bildungshaus – Kita-Seite v5

Statische Website als Scroll-Reise durch einen Kita-Tag mit Mila (4) und Maren. Kein Server-Code nötig.
Alle Texte stammen aus `texte_v5.md`. Bildnamen und Ankerpunkte zwischen 3D und Website legt
`CONTRACT_v5.md` fest, die Dateinamen der KI-Bilder `bildprompts_v5.md`.

## Was wo steht

- `texte_v4.md`: freigegebene Textebene (Abschnitte 0–12 sind die Seite, 13 Quellen, 14 Backlog,
  15 Abgleich, 16 offene Fragen).
- `lib.py`: Blender-Bibliothek mit Multiplex-Material, Figuren, Möbeln, Licht, Kamera und
  `kiddo_cube()` für den Smart Kiddo Cube.
- `rooms.py`: die Räume, die Fachwand, die Kameras der Nahaufnahmen.
- `render_v3.sh`: rendert alle Räume, Nahaufnahmen und Hover-Masken. Läuft im Hintergrund weiter,
  setzt nach Abbruch fort und schreibt am Ende `renders/V3_DONE` (CPU, etwa 2 bis 3 Stunden auf
  2 Kernen). `contact_v3.py` macht ein Kontaktblatt aller Renderings.
- `web/template.html`: Seitengerüst, Kacheln mit den Hintergründen, Pop-up-Fenster und Stile, ohne Skript.
- `web/story.js`: Texte der Stationen, Nahaufnahmen und Handy-Ansichten.
- `web/app.js`: Ablauf der Seite (Faden, Bildwechsel unter dem Bild, Tipp-Punkte, Notizen, Sprechblasen,
  Nahaufnahmen, Technik-Blick und Kacheln im Pop-up, Wisch-Karten mit Bild, Weiter-Knopf).
- `web/fonts/`: selbst gehostete Schriften (Bricolage Grotesque, Atkinson Hyperlegible, Caveat)
  mit Lizenzen.
- `build.py`: macht aus den Renderings die Website in `site/`.

## Neu bauen

```
pip install bpy pillow
export PYTHONHASHSEED=0
setsid nohup ./render_v3.sh > renders/v3_batch.log 2>&1 &   # fertig, wenn renders/V3_DONE existiert
python3 build.py renders
```

Einen Raum oder eine Nahaufnahme einzeln neu rendern:

```
python3 rooms.py --scene kaufladen --out renders --res 1600 --samples 40
python3 rooms.py --scene kaufladen --shot kasse --out renders --res 1400 --samples 24
python3 rooms.py --scene kaufladen --pass id --out renders --res 800
python3 rooms.py --scene fachwand --shot nah --out renders --res 1400 --samples 24
```

Jedes Rendering schreibt eine JSON-Datei mit projizierten Ankerpunkten. Darauf sitzen
Tipp-Punkte, Sprechblasen, Technik-Linien und der Faden, auch nach Änderungen am Raum.

## Fehlende Bilder, Ersatzbilder und KI-Bilder (v5)

```
python3 build.py renders [KI-ORDNER]
```

- Jedes Rendering ist optional. Fehlt ein v5-Rendering, nimmt `build.py` solange ein älteres
  (`FALLBACK` in `build.py`, etwa `piazza_800` → `halle_800`). Es behält seine eigenen Anker, darum
  fehlen dann einzelne Tipp-Punkte. Gibt es auch kein älteres, zeigt die Seite einen Platzhalter
  „Rendering folgt“ im richtigen Seitenverhältnis. Liegt das v5-Rendering im Ordner, wird es beim
  nächsten Bauen ohne weitere Änderung genommen.
- KI-Bilder (U-Bahn und Varianten-Karten, Namen aus `bildprompts_v5.md`) liegen als PNG, JPG oder
  WebP in `renders/ki/`, in `ki/` neben dem Renderordner oder im Ordner aus dem zweiten Argument.
  `build.py` macht daraus `site/ki/*.webp` (Karten höchstens 900 px breit, `ubahn` 1600 px).
  Fehlt eines, zeigt die Seite einen Platzhalter „Bild folgt“. Die Seite lädt nur Dateien, die
  `build.py` gefunden hat, also nie eine 404.

## Ausgabe

`site/` enthält `index.html` (für die Veröffentlichung als Claude-Seite, ohne eigenes HTML-Gerüst),
`standalone.html` (vollständiges Dokument für den eigenen Server), `app.js`, `fonts/`, die
WebP-Bilder und die Hover-Masken. Alle Pfade sind relativ, der Ordner funktioniert unter jeder
Adresse. Kein Inline-Skript, keine externen Anfragen: läuft unter der CSP von
`dreambau.com/bildungshaus/`.
