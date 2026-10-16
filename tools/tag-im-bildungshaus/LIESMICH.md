# Ein Tag im Bildungshaus – Demo v3

Statische Website als Scroll-Reise durch einen Kita-Tag mit Mila (4). Kein Server-Code nötig.
Alle Texte stammen aus `texte_v4.md`. Bildnamen und Ankerpunkte zwischen 3D und Website legt
`CONTRACT_v3.md` fest.

## Was wo steht

- `texte_v4.md`: freigegebene Textebene (Abschnitte 0–12 sind die Seite, 13 Quellen, 14 Backlog,
  15 Abgleich, 16 offene Fragen).
- `lib.py`: Blender-Bibliothek mit Multiplex-Material, Figuren, Möbeln, Licht, Kamera und
  `kiddo_cube()` für den Smart Kiddo Cube.
- `rooms.py`: die Räume, die Fachwand, die Kameras der Nahaufnahmen.
- `render_v3.sh`: rendert alle Räume, Nahaufnahmen und Hover-Masken. Läuft im Hintergrund weiter,
  setzt nach Abbruch fort und schreibt am Ende `renders/V3_DONE` (CPU, etwa 2 bis 3 Stunden auf
  2 Kernen). `contact_v3.py` macht ein Kontaktblatt aller Renderings.
- `web/template.html`: Seitengerüst und Stile, ohne Skript.
- `web/story.js`: Texte der Stationen, Nahaufnahmen und Handy-Ansichten.
- `web/app.js`: Ablauf der Seite (Faden, Tipp-Punkte, Sprechblasen, Nahaufnahmen, Technik-Blick,
  Wisch-Karten, Weiter-Knopf).
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

## Ausgabe

`site/` enthält `index.html` (für die Veröffentlichung als Claude-Seite, ohne eigenes HTML-Gerüst),
`standalone.html` (vollständiges Dokument für den eigenen Server), `app.js`, `fonts/`, die
WebP-Bilder und die Hover-Masken. Alle Pfade sind relativ, der Ordner funktioniert unter jeder
Adresse. Kein Inline-Skript, keine externen Anfragen: läuft unter der CSP von
`dreambau.com/bildungshaus/`.
