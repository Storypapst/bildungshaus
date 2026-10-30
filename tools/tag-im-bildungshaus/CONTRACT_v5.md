# Contract between 3D and web for the Kita page v5

Source of truth for all page text: `texte_v5.md` (German). Decisions: section 7 of `texte_v5.md` and the project doc `claude/entscheidungen-kita-v5.md`.
Code comments in English, page text in German.

## Render names and anchors

Every render writes `renders/<name>.png` and `renders/<name>.json` with projected anchors via `A(name, x, y, z)`.
Every room render also defines `A("in", ...)` and `A("out", ...)` on the floor where the thread enters and leaves the picture (as in v3).
Web code must treat every anchor as optional: missing anchor means skip that hotspot or bubble, never crash.
Every room render also gets an ID mask `<name>_id.png` (`--pass id`), so hover groups (`hid=`) must be meaningful.

| Render | Kind | Scene / variant / shot | Anchors |
|---|---|---|---|
| `aussen` | hero | aussen | `eingang`, `dach`, `og`, `lab`, `schule` (+ keep existing ones) |
| `piazza_745` | room | piazza 745 | `fenster_l`, `fenster_r`, `co2`, `hubel`, `maren_head`, `in`, `out` |
| `piazza_745z_fenster` | close-up | piazza 745z fenster | `co2`, `fenster_r` |
| `piazza_745_fenster` | close-up | piazza 745 fenster | `fenster_r`, `antrieb` |
| `vorraum_800` | room | vorraum 800 | `bank`, `schuhfach`, `haken`, `regal`, `rost`, `tuer_piazza`, `mila_head`, `jonas_head`, `in`, `out` |
| `piazza_800` | room | piazza 800 | `schrank_mila`, `planwuerfel`, `tafel`, `hubel_top`, `mulde`, `knopf_klein`, `mila_head`, `maren_head`, `defne_head`, `in`, `out` |
| `piazza_800_hubel` | close-up | piazza 800 hubel | `mulde`, `bildwuerfel`, `mila_cube`, `knopf_klein`, `rolle` |
| `piazza_800_schrank` | close-up | piazza 800 schrank | `schrank_mila`, `planwuerfel`, `tafel` |
| `schrank_offen` | close-up | piazza 800 offen | `fach_hoch`, `trockenfach`, `schublade`, `schatzfach`, `cube_nische`, `licht` |
| `kaufladen` | room | kaufladen | `kasse`, `scan`, `speaker`, `coins`, `kranz`, `ablage`, `schrankwand`, `hoehle`, `mila_head`, `defne_head`, `in`, `out` |
| `kaufladen_kasse` | close-up | kaufladen - kasse | `ablage`, `scan`, `coins`, `speaker` |
| `kaufladen_umbau` | room | kaufladen umbau | `schrankwand`, `platten`, `hoehle`, `mila_head`, `maren_head`, `in`, `out` |
| `schrankwand_offen` | close-up | kaufladen umbau offen | `schloss`, `kochplatte`, `platten` |
| `kaufladen_kochen` | room | kaufladen kochen | `verbinder`, `kochplatte`, `schuessel`, `wagen`, `hoehle`, `schloss`, `schrankwand`, `mila_head`, `maren_head`, `in`, `out` |
| `vorraum_1400` | room | vorraum 1400 | `regal`, `stab`, `reif`, `kaktus`, `licht`, `mila_head`, `maren_head`, `in`, `out` |
| `vorraum_nacht` | close-up | vorraum nacht licht | `licht`, `regal` |
| `waschraum_1145` (+ `waschraum_aus_becken`, `waschraum_1145_becken`) | room + close-ups | unchanged | unchanged |
| `abholung` | room | abholung | `mila_fach`, `planwuerfel`, `tafel`, `jonas_phone`, `wunsch`, `mila_head`, `lotte_head`, `ayla_head`, `in`, `out` |
| `abholung_faecher` | close-up | abholung - faecher | `mila_fach`, `planwuerfel`, `mila_cube` |
| `abholung_wunsch` | close-up | abholung - wunsch | `wunsch`, `ayla_head` |
| `piazza_1615` | room | piazza 1615 | `maren_head`, `tafel`, `in`, `out` |

Dropped from the page: `halle_*`, `bistro*`, `werkstatt*`, `ausblick`, `fachwand`. Keep their code; just do not render them in the v5 batch.

## Object design (3D)

- **Style:** as in v3. Light birch multiplex with visible ply edges, pastel palette (SAGE, ROSE, OCHRE, SKY, CREAM), peg-doll figures, soft daylight. Calm and tidy, never sterile.
- **Plausibility rules (checked by a vision review before anything goes to Frank):** nothing on windowsills of windows that open automatically; nothing dangerous within children's reach (hot plate, knives, cleaning agents only in the locked top compartment or in adult hands); shoes only in the green entrance room, never in the Piazza; jackets and mud trousers never lying around; every object that the text mentions is visible where the text says; figures do not intersect furniture; February outside (bare trees or light snow where the outside is visible), warm inside.
- **Hubel (replaces the obelisk):** low round wooden hump, about 0.45 m high, about 1.2 m diameter, birch with a soft padded rim (sage or rose fabric, Velcro look), on small lockable castors (visible on close look). Top: three small picture cubes (about 0.12 m) that show the three offers (Kaufladen, Bauen, Malen; simple icons in yellow, blue, rose), and round hollows (Mulden) for the children's cubes: as many hollows per offer as there are places (e.g. 5, 6, 6). Lower on the side, at crawling height: a few small round buttons with little lights, for toddlers. It must not block the view across the circle.
- **Garderobenschrank (Piazza):** a row of tall children's wardrobe cabinets with calm closed birch fronts (one door per child), a small open cube niche in each front at child height (the child's Smart Kiddo Cube stands there), and above, out of reach and readable from a distance, the motorised **Planwürfel** (as in v3: one per big time of day; faces yellow Kaufladen, blue Bauen, rose Malen or green Garten, white with question mark). Beside it a large **magnet board** with wooden picture tiles for the day and the week of the group plus one short handwritten line (no readable text needed, scribble).
- **Schrank offen (close-up):** Mila's door open, warm light inside: tall compartment with jacket, hat, scarf on hooks; below a ventilated drying compartment (slots); a drawer at the bottom with change clothes and a small symbol; a small treasure compartment at the top for notes and a toy from home; the cube niche.
- **Green entrance room (Vorraum):** small room before the Piazza. Benches with shoe compartments below (one per child, boots inside), a dirt-catching grid mat at the outside door, hooks for wet mud trousers and rain jackets, two walls of plywood plant shelves with warm grow lights, herbs and tomato plants, the cactus from the Piazza windowsill. Door to the Piazza. Outside door with a glass panel, February outside.
- **Kaufladen with Schrankwand:** the existing shop room plus a full-height wall cabinet in birch multiplex along one wall, calm fronts, with a round hideout cave (Versteckhöhle) built into it at child height (soft cushion inside). Lower part free for children (games, the shop folds in here), top part with a small combination lock (compartment for the induction hot plate, knives, cleaning agents). A compartment where large table tops stand upright side by side.
  - `umbau`: the shop shelf and till have disappeared into the lower cabinet; Maren and two children pull out large table tops.
  - `kochen`: six table tops connected into one island in the middle of the room (folding legs, visible connectors), a small induction hot plate in the very centre of the island where small arms cannot reach, children stirring in bowls at the edge, Maren at the hot plate, a caterer trolley with closed food containers (pasta, rice, vegetables). Basil and tomatoes on the island.
- **Kräutergarten (vorraum 1400):** same entrance room, children watering and harvesting with Maren; in each pot a wooden stick with a small lamp (some glowing soft blue = thirsty); a small wooden tag on the tomato plant turned to red = ripe. `nacht`: no people, dark outside, grow lights glowing warm, a small battery box on the wall.
- **Abholung (Piazza):** in front of the Garderobenschrank, Papa Jonas and Mila, Lotte (14) coming in through the door from the entrance room, Ayla at the wooden wish box.
- **Piazza 745:** no children. Maren at the door with a key, windows on both sides wide open, windowsills empty. **Piazza 1615:** no children, Maren at the magnet board with her phone, evening light.
- **Hero (aussen):** the Kita house with an upper floor (more groups and a team room), the Lab as an annex, green roof with solar. The school is a separate, large, plain building at the edge of the frame, cut off by the frame. February is not required in the hero.

## Web output (build.py)

Unchanged from v3: `site/` with `index.html`, `standalone.html`, `app.js`, `fonts/`, `*.webp`, ID masks. No inline script, no external requests. CSP at /bildungshaus/: `default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'`.
KI images (U-Bahn, variant cards) are optional files `ki/<name>.webp`; if missing, the page shows a styled placeholder.
