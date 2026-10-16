# Contract between 3D and web for Demo v3 (published at dreambau.com/bildungshaus/demov1/)

Source of truth for all texts: `texte_v4.md` (German). Code comments English, page text German.

## Render names and anchors

Each render writes `renders/<name>.png` and `renders/<name>.json` with projected anchors (existing mechanism via `A(name,x,y,z)`).
Web code must treat every anchor as optional: missing anchor → skip that hotspot/bubble, never crash.

| Render | Kind | Anchors (required → optional) | Notes |
|---|---|---|---|
| `halle_745` | room | `fenster1`, `fenster0`, `co2`, `obelisk_top`, `mila_head`, `mila_cube` | Cross-ventilation: tall windows on two opposite walls, wide open, visible chain drives. No skylights. |
| `halle_745z_fenster` | close-up | `co2`, `fenster1` | Windows closed, CO₂ box shows yellow. |
| `halle_745_fenster` | close-up | `fenster1`, `antrieb` | Window wide open, chain drive visible. |
| `halle_800` | room | `obelisk_mid`, `board`, `hoehle`, `sanne_ukulele`, `mila_head`, `plan_light`, `tile1`, `kurbel`, `mila_cube`, `planwuerfel` | Obelisk: controls (Klotzbrett) at child height at the bottom, displays (tiles) at the top. Fachwand with Planwürfel visible if camera allows. |
| `halle_800_obelisk` | close-up | `board`, `tile1`, `mila_cube` | |
| `halle_915` | room, optional | `obelisk_mid`, `plan_light`, `mila_head`, `kreis` | Two groups (~20 kids) in a big circle playing. If not built, web falls back to `halle_800`. |
| `kaufladen` | room | `kasse`, `scan`, `speaker`, `coins`, `briefkasten`, `kranz`, `mila_head`, `defne_head`, `ablage`, `gemuese` | Real shop feel, vegetable corner. Kasse has a tray where Mila's Fuchs-Cube stands. |
| `kaufladen_kasse` | close-up | `ablage`, `scan`, `coins`, `speaker` | Fuchs-Cube on tray. |
| `waschraum_1145` | room | `sink1`, `ring1`, `seife`, `tuer`, `lautsprecher`, `sanne_head`, `sink_low` | One sink lower, open underneath (wheelchair accessible). |
| `waschraum_aus_becken`, `waschraum_1145_becken` | close-ups | `ring1` | unchanged |
| `bistro` | room | `daumen`, `tube0`, `rezept`, `durchreiche`, `marek_pot`, `marek_head`, `hebel`, `samir_head` | Kugelbrett gets a lever; Samir (parent helper) at the tables. |
| `bistro_daumen` | close-up | `tube0`, `hebel` | |
| `abholung` | room | `mila_fach`, `jonas_phone`, `wunsch`, `mila_head`, `ayla_head`, `planwuerfel`, `lotte_head`, `treppe` | Fachwand with Planwürfel, Lotte comes down a staircase (school upstairs, same house). |
| `abholung_faecher` | close-up | `mila_fach`, `planwuerfel`, `mila_cube` | |
| `abholung_wunsch` | close-up | `wunsch`, `ayla_head` | |
| `fachwand` | NEW close-up | `fach_haken`, `fach_bank`, `fach_schuh`, `fach_schrank`, `fach_mal`, `fach_cube`, `planwuerfel_tag`, `planwuerfel_woche`, `frage`, `gebaerden_cube` | Five children's Fächer side by side (see spec). |
| `werkstatt`, `werkstatt_kaestchen` | room + close-up | unchanged anchors | |
| `aussen` | hero | existing + `schule`, `lab`, `eingang`, `hochbeete`, `dach` | ONE building: Kita ground floor, Schule upper floor, Lab wing on ground floor. Green roof with solar on top. Never two buildings. |
| `ausblick` | room | `kita`, `schule`, `lab`, `halle`, `garten` | Same single house, cut open or iso, labels by anchors. |

ID masks (`<room>_id.png`) are re-rendered for every changed room.

## Object design (3D)

- **Cube (Smart Kiddo Cube):** wooden cube about 8 cm, birch, child's animal as a small painted picture or relief on top (Mila: fox, orange). This replaces every wooden animal figure ("Holztier") in all scenes.
- **Fachwand:** per child: coat hook, small shelf, bench seat, shoe compartment below, small cabinet door, a tray for drawings, a slot where the Cube lives. Above, out of children's reach and readable from a distance: the plan strip with small motorised **Planwürfel**, one per big time of day. Faces: yellow (Kaufladen), blue (Bauen), green (Garten), white with a question mark. Small kids: one row for the day (3–4 cubes). Older kids: a 5×4 grid for the week. In the close-up one child shows a question mark after lunch. One Fach holds a Gebärden-Cube that looks identical from the outside.
- **Obelisk:** controls at child height at the bottom (Klotzbrett with coloured blocks), displays at the top (day tiles, small lights).
- **Windows:** tall casements on opposite walls, opened wide, small chain drives at the top of the frame, no skylights.

## Web output (build.py)

`site/` contains: `index.html` (artifact flavour, no document skeleton), `standalone.html` (full document for own hosting), `app.js` (all logic, no inline script anywhere), `fonts/` (self-hosted woff2 + `fonts.css`), images (`*.webp`), scene data as a non-executing `<script type="application/json" id="scenedata">` block or `scenedata.json` fetched same-origin.
Server CSP at /bildungshaus/: `default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'`. No external requests at all (no Google Fonts, no CDN).
