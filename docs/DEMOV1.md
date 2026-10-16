# Demo v1: „Ein Tag im Bildungshaus“

Adresse: `https://dreambau.com/bildungshaus/demov1/`

Eine Scroll-Reise durch einen erfundenen Kita-Tag mit Mila (4) in isometrischen 3D-Räumen. Sie veranschaulicht Hypothesen, wie Technik leise im Hintergrund Zeit fürs Soziale schaffen könnte. Das Haus gibt es noch nicht; die Seite sagt das selbst.

## Was im Repo liegt

- `public/demov1/`: die fertige statische Seite. Vite kopiert sie unverändert nach `dist/demov1/`. Kein React, kein Build-Schritt für diese Seite.
- `tools/tag-im-bildungshaus/`: die Quellen. Blender-Skripte (`lib.py`, `rooms.py`, `render_v3.sh`), Web-Quellen (`web/`), `build.py`, die freigegebene Textebene `texte_v4.md` und `CONTRACT_v3.md` (Bildnamen und Ankerpunkte). Anleitung in `LIESMICH.md`. Die Roh-Renderings (PNG) liegen nicht im Repo; `render_v3.sh` erzeugt sie neu.
- `ops/nginx.conf`: `location = /bildungshaus/demov1` leitet mit 308 auf die Adresse mit Schrägstrich um, ohne den internen Port 8080.

## Warum es unter der bestehenden CSP läuft

Unter `/bildungshaus/` gelten `script-src 'self'` und `font-src 'self'` ohne externe Hosts. Die Seite hat deshalb kein Inline-Skript und keine `on…`-Attribute, alle Logik steckt in `app.js`, die Szenendaten in einem nicht ausführbaren `<script type="application/json">`-Block. Schriften (Bricolage Grotesque, Atkinson Hyperlegible, Caveat, OFL) liegen in `fonts/`. Inline-Stile sind durch `style-src 'unsafe-inline'` bereits erlaubt. Es gibt keine Anfrage an fremde Hosts.

## Aktualisieren

```sh
cd tools/tag-im-bildungshaus
python3 build.py renders          # braucht die Renderings in renders/
rm -rf ../../public/demov1 && mkdir ../../public/demov1
cp -r site/. ../../public/demov1/ && rm ../../public/demov1/standalone.html
cp site/standalone.html ../../public/demov1/index.html
```

Danach wie jede Release: `npm run build`, `python3 ops/deploy.py --release <neu>` (lokale Prüfung), nach Startsignal `--apply` (siehe `ops/README.md`).

## Abnahme nach dem Deploy

- `/bildungshaus/demov1` leitet auf `https://dreambau.com/bildungshaus/demov1/` um, ohne `:8080`.
- Seite lädt ohne CSP-Meldungen in der Konsole; Schriften und Bilder kommen von `dreambau.com`.
- Weiter-Knopf, Tipp-Punkte, Nahaufnahmen, Technik-Blick und Wisch-Karten funktionieren am Desktop und am Handy (390 px), ohne seitliches Scrollen.
- `/bildungshaus/` (bestehende Präsentation) ist unverändert.
