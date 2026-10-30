"""Build the Bildungshaus weWeit scroll journey (Kita page v5) from the Blender renders.

Usage: python3 build.py [RENDER_DIR] [KI_DIR]     (env BH_SITE overrides the output folder)

Writes site/:
  index.html       artifact flavour (no document skeleton)
  standalone.html  full document for own hosting
  app.js           web/story.js + web/app.js in one IIFE (the page has no inline script: CSP script-src 'self')
  fonts/           self-hosted woff2 + fonts.css + licences
  *.webp, *_id.png images and hover masks
  ki/*.webp        KI images (U-Bahn, variant cards), if a KI folder exists
All paths are relative, so the folder works under any URL prefix.

Render names follow CONTRACT_v5.md. Every render is optional:
  - While a v5 render is missing, FALLBACK names an older render that stands in for it
    (piazza_800 -> halle_800, ...). The fallback keeps its own anchors, so some tap points are missing.
  - With neither, the page shows a placeholder figure ("Rendering folgt") of the right aspect ratio.
  - A render missing in RENDER_DIR is also looked up in RENDER_DIR/v2_backup.
New renders are picked up automatically on the next build with the same command.

KI images: PNG/JPG/WebP files in KI_DIR (default: RENDER_DIR/ki, else the folder ki/ next to
RENDER_DIR) are converted to WebP in site/ki/ (variant cards max 900 px wide, ubahn max 1600 px).
The page only references files listed in the scene data, so missing images never cause a 404.
"""

import hashlib
import json
import os
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "renders"
KI_ARG = Path(sys.argv[2]) if len(sys.argv) > 2 else None
SITE = Path(os.environ.get("BH_SITE", ROOT / "site"))
WEB = ROOT / "web"

# v5 render names (CONTRACT_v5.md). Logical name -> renders that may stand in while it is missing.
# The v5 name itself is always tried first; the fallback is used ONLY while the v5 render is missing.
ROOMS = ["aussen", "piazza_745", "vorraum_800", "piazza_800", "kaufladen", "kaufladen_umbau",
         "kaufladen_kochen", "waschraum_1145", "vorraum_1400", "abholung", "piazza_1615"]
SHOTS = ["piazza_745z_fenster", "piazza_745_fenster", "piazza_800_hubel", "piazza_800_schrank",
         "schrank_offen", "kaufladen_kasse", "schrankwand_offen", "vorraum_nacht",
         "waschraum_aus_becken", "waschraum_1145_becken", "abholung_faecher", "abholung_wunsch"]
FALLBACK = {
    "piazza_745": ["halle_745"],
    "piazza_745z_fenster": ["halle_745z_fenster", "halle_745z_oberlicht"],
    "piazza_745_fenster": ["halle_745_fenster", "halle_745_oberlicht"],
    "piazza_800": ["halle_800"],
    "piazza_800_hubel": ["halle_800_obelisk"],
    "piazza_800_schrank": ["fachwand"],
    "schrank_offen": ["fachwand"],
    "piazza_1615": ["abholung"],
    # vorraum_*, kaufladen_umbau, kaufladen_kochen, schrankwand_offen: placeholder until rendered
}
# Placeholder size while nothing is rendered: rooms like the alpha-cropped v3 rooms, close-ups 1400 x 1008.
PH_ROOM = (1420, 1214)
PH_SHOT = (1400, 1008)
KI_MAXW = {"ubahn": 1600}
KI_MAXW_DEFAULT = 900
KI_EXT = {".png", ".jpg", ".jpeg", ".webp"}


def grade(im, sat=1.12, con=1.05):
    rgb = im.convert("RGB")
    rgb = ImageEnhance.Color(rgb).enhance(sat)
    rgb = ImageEnhance.Contrast(rgb).enhance(con)
    if im.mode == "RGBA":
        out = rgb.convert("RGBA")
        out.putalpha(im.getchannel("A"))
        return out
    return rgb


def crop_alpha(im, pad=8):
    """Trim transparent margins so the diorama fills its box; returns image and crop box (normalized)."""
    bb = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()
    if not bb:
        return im, (0, 0, 1, 1)
    x0, y0, x1, y1 = max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad)
    return im.crop((x0, y0, x1, y1)), (x0 / im.width, y0 / im.height, x1 / im.width, y1 / im.height)


def remap(pt, box):
    x0, y0, x1, y1 = box
    return [round((pt[0] - x0) / (x1 - x0), 4), round((pt[1] - y0) / (y1 - y0), 4)]


def load(name):
    """Find a complete render (PNG + JSON, both readable) in SRC, else in SRC/v2_backup."""
    for d in (SRC, SRC / "v2_backup"):
        png, js = d / f"{name}.png", d / f"{name}.json"
        if not (png.exists() and js.exists()):
            continue
        try:
            meta = json.loads(js.read_text())
            im = Image.open(png)
            im.load()
        except Exception as e:  # half-written file while the 3D batch runs
            print(f"  skip {d.name}/{name}: {e}")
            continue
        return d, meta, im
    return None


def busted(rel):
    """file name plus a short content hash, so browsers reload re-rendered images (the server ignores the query)."""
    return f"{rel}?v={hashlib.sha1((SITE / rel).read_bytes()).hexdigest()[:8]}"


def fresh(out, src):
    """True if the output image exists and is newer than its source (skip re-encoding)."""
    if os.environ.get("BH_FORCE"):
        return False
    return out.exists() and out.stat().st_mtime >= src.stat().st_mtime


def build_room(name, d, meta, im):
    im, box = crop_alpha(im.convert("RGBA"))
    if not fresh(SITE / f"{name}.webp", d / f"{name}.png"):
        grade(im, 1.14, 1.05).save(SITE / f"{name}.webp", "WEBP", quality=84, method=6)
    pts = lambda v: isinstance(v, (list, tuple)) and len(v) >= 2
    entry = {"img": busted(f"{name}.webp"), "w": im.width, "h": im.height, "src": name,
             "anchors": {k: remap(v, box) for k, v in meta.get("anchors", {}).items() if pts(v)},
             "paths": {k: [remap(p, box) for p in v] for k, v in meta.get("paths", {}).items()},
             "colors": meta.get("colors", {})}
    mask = d / f"{name}_id.png"
    if mask.exists():
        try:
            mk = Image.open(mask).convert("RGBA")
            W, H = mk.size
            mk = mk.crop((round(box[0] * W), round(box[1] * H), round(box[2] * W), round(box[3] * H)))
            if not fresh(SITE / f"{name}_id.png", mask):
                mk.save(SITE / f"{name}_id.png", optimize=True)
            entry["mask"] = busted(f"{name}_id.png")
            entry["mw"], entry["mh"] = mk.size
        except Exception as e:
            print(f"  mask {name}: {e}")
    return entry


def build_shot(name, d, meta, im):
    im = im.convert("RGB")
    if not fresh(SITE / f"{name}.webp", d / f"{name}.png"):
        grade(im, 1.12, 1.05).save(SITE / f"{name}.webp", "WEBP", quality=82, method=6)
    ok = lambda v: isinstance(v, (list, tuple)) and len(v) >= 2 and -0.05 < v[0] < 1.05 and -0.05 < v[1] < 1.05
    return {"img": busted(f"{name}.webp"), "w": im.width, "h": im.height, "src": name,
            "anchors": {k: v for k, v in meta.get("anchors", {}).items() if ok(v)},
            "paths": meta.get("paths", {})}


def collect(names, builder, ph, report):
    out, done = {}, {}
    for logical in names:
        for cand in [logical] + FALLBACK.get(logical, []):
            if cand in done:
                entry = done[cand]
            else:
                found = load(cand)
                if not found:
                    continue
                d, meta, im = found
                entry = builder(cand, d, meta, im)
                if d != SRC:
                    report.append(f"{cand}: from {d.name}")
                done[cand] = entry
            out[logical] = entry
            if cand != logical:
                report.append(f"{logical}: fallback {cand}")
            break
        else:
            # nothing rendered yet: the page draws a placeholder of this size
            out[logical] = {"ph": True, "w": ph[0], "h": ph[1], "src": None}
            report.append(f"{logical}: placeholder")
    return out


def ki_source():
    if KI_ARG:
        return KI_ARG if KI_ARG.is_dir() else None
    for d in (SRC / "ki", SRC.parent / "ki"):
        if d.is_dir() and any(f.suffix.lower() in KI_EXT for f in d.iterdir()):
            return d
    return None


def build_ki(report):
    """Convert KI images to WebP in site/ki/ and list what exists (name -> img, w, h)."""
    out_dir = SITE / "ki"
    src = ki_source()
    if src:
        out_dir.mkdir(parents=True, exist_ok=True)
        names = set()
        # prefer PNG over JPG over WebP when several files share a name
        for f in sorted(src.iterdir(), key=lambda p: (p.stem, [".png", ".jpg", ".jpeg", ".webp"].index(p.suffix.lower()) if p.suffix.lower() in KI_EXT else 9)):
            if not f.is_file() or f.suffix.lower() not in KI_EXT or f.stem in names:
                continue
            names.add(f.stem)
            target = out_dir / f"{f.stem}.webp"
            if fresh(target, f):
                continue
            try:
                im = Image.open(f)
                im.load()
                alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
                im = im.convert("RGBA" if alpha else "RGB")
                maxw = KI_MAXW.get(f.stem, KI_MAXW_DEFAULT)
                if im.width > maxw:
                    im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
                im.save(target, "WEBP", quality=82, method=6)
            except Exception as e:
                print(f"  ki {f.name}: {e}")
        # drop WebPs whose source is gone
        for f in out_dir.glob("*.webp"):
            if f.stem not in names:
                f.unlink()
        report.append(f"ki: {len(names)} image(s) from {src}")
    ki = {}
    if out_dir.is_dir():
        for f in sorted(out_dir.glob("*.webp")):
            try:
                with Image.open(f) as im:
                    w, h = im.size
            except Exception as e:
                print(f"  ki {f.name}: {e}")
                continue
            ki[f.stem] = {"img": busted(f"ki/{f.name}"), "w": w, "h": h}
    return ki


def main():
    SITE.mkdir(parents=True, exist_ok=True)
    report = []
    data = {"rooms": collect(ROOMS, build_room, PH_ROOM, report),
            "shots": collect(SHOTS, build_shot, PH_SHOT, report),
            "ki": build_ki(report)}

    js = WEB / "story.js", WEB / "app.js"
    app = '/* Bildungshaus weWeit, Kita page v5. Built by build.py from web/story.js and web/app.js. */\n(function(){\n"use strict";\n' \
          + "\n".join(p.read_text(encoding="utf-8") for p in js) + "\n})();\n"
    (SITE / "app.js").write_text(app, encoding="utf-8")

    fonts = SITE / "fonts"
    fonts.mkdir(exist_ok=True)
    for f in (WEB / "fonts").iterdir():
        if f.suffix in (".woff2", ".css", ".txt"):
            shutil.copy2(f, fonts / f.name)

    ver = hashlib.sha1((app + (WEB / "fonts" / "fonts.css").read_text()).encode()).hexdigest()[:8]
    html = (WEB / "template.html").read_text(encoding="utf-8").replace("__V__", ver)
    html = html.replace("__SCENEDATA__", json.dumps(data, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/"))
    (SITE / "index.html").write_text(html, encoding="utf-8")
    standalone = ('<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n'
                  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
                  '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}'
                  'body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n</head>\n<body>\n' + html + '\n</body>\n</html>\n')
    (SITE / "standalone.html").write_text(standalone, encoding="utf-8")

    # drop images from earlier builds that the page no longer references
    used = {e[k].split("?")[0] for g in (data["rooms"], data["shots"]) for e in g.values() for k in ("img", "mask") if k in e}
    for f in SITE.iterdir():
        if f.is_file() and (f.suffix == ".webp" or f.name.endswith("_id.png")) and f.name not in used:
            f.unlink()

    total = sum(p.stat().st_size for p in SITE.rglob("*") if p.is_file())
    for line in report:
        print("  " + line)
    print("built", SITE / "index.html", f"{total / 1e6:.1f} MB total, version {ver}")


if __name__ == "__main__":
    main()
