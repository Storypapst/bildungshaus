"""Bildungshaus v2 – rooms and close-up shots.

  python3 rooms.py --scene halle --variant 800 [--shot room|obelisk|...] [--pass beauty|id] --out renders
"""

import argparse
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lib import *  # noqa: F401,F403

ap = argparse.ArgumentParser()
ap.add_argument("--scene", required=True)
ap.add_argument("--variant", default="")
ap.add_argument("--shot", default="room")
ap.add_argument("--pass", dest="pas", default="beauty", choices=["beauty", "id"])
ap.add_argument("--out", default="renders")
ap.add_argument("--res", type=int, default=0)
ap.add_argument("--samples", type=int, default=40)
ap.add_argument("--save-blend", action="store_true")
args = ap.parse_args(sys.argv[1:])
SCENE, VAR, SHOT = args.scene, args.variant, args.shot
random.seed(sum(ord(c) for c in SCENE) * 7 + 3)
CAM = -48  # facing direction that looks at the camera

CAST = {
    "mila": dict(kind="kid", skin=0, hair="hell", style="pigtails", top=OCHRE, stripe=CREAM, bottom=(0.42, 0.50, 0.66),
                 shoes=BERRY),
    "defne": dict(kind="kid", skin=2, hair="dunkel", style="ponytail", top=BERRY, dress=True, shoes=(0.95, 0.80, 0.45)),
    "sanne": dict(kind="adult", skin=0, hair="rot", style="bun", top=PETROL, bottom=(0.32, 0.33, 0.40)),
    "marek": dict(kind="adult", skin=3, hair="dunkel", style="buzz", top=(0.95, 0.95, 0.93), bottom=(0.30, 0.30, 0.32),
                  acc=("chef", "apron")),
    "jonas": dict(kind="adult", skin=1, hair="blond", style="short", top=(0.33, 0.40, 0.56), bottom=(0.55, 0.50, 0.42),
                  acc=("glasses",)),
    "lotte": dict(kind="teen", skin=0, hair="hell", style="long", top=SAGE, stripe=(0.85, 0.90, 0.80),
                  bottom=(0.35, 0.40, 0.55), acc=("backpack",)),
    "ayla": dict(kind="adult", skin=2, hair="dunkel", style="long", top=ROSE, bottom=(0.35, 0.33, 0.38)),
    "samir": dict(kind="adult", skin=3, hair="dunkel", style="short", top=(0.46, 0.60, 0.44), bottom=(0.30, 0.31, 0.36)),
}
KIDS = [
    dict(skin=3, hair="dunkel", style="curly", top=SAGE),
    dict(skin=1, hair="braun", style="bob", top=ROSE, dress=True),
    dict(skin=0, hair="blond", style="short", top=SKY, stripe=CREAM),
    dict(skin=4, hair="dunkel", style="curly", top=OCHRE),
    dict(skin=2, hair="dunkel", style="bun", top=PLUM),
    dict(skin=0, hair="rot", style="short", top=CLAY),
    dict(skin=1, hair="braun", style="pigtails", top=PETROL, stripe=(0.80, 0.88, 0.88)),
    dict(skin=2, hair="braun", style="short", top=(0.95, 0.82, 0.45)),
    dict(skin=3, hair="dunkel", style="bob", top=SKY),
    dict(skin=0, hair="hell", style="curly", top=BERRY, stripe=CREAM),
]


def who(name, x, y, face, pose="stand", hid=None, acc=(), **kw):
    c = dict(CAST[name])
    a = tuple(c.pop("acc", ())) + tuple(acc)
    c.update(kw)
    return person(x, y, face, pose=pose, hid=hid or name, key=name, acc=a, **c)


def kid(i, x, y, face, pose="stand", hid=None, acc=(), key=None, **kw):
    c = dict(KIDS[i % len(KIDS)])
    c.update(kw)
    return person(x, y, face, "kid", pose=pose, hid=hid, acc=acc, key=key, **c)


# ================================================================ obelisk
PICTO = ["kreis", "laden", "waschen", "essen", "garten"]


def picto(kind, c, n, hid):
    """Burned/painted pictogram on a round tile. c: centre, n: outward normal."""
    s = n.cross(UP).normalized()
    p = c + n * 0.014
    if kind == "kreis":
        for k in range(6):
            a = k * math.pi / 3
            ball(*(p + s * math.cos(a) * 0.045 + UP * math.sin(a) * 0.045), 0.014, mat(BLOCKC[k % 4], 0.5), hid, seg=10)
    elif kind == "laden":
        ball(*p, 0.042, mat((0.82, 0.18, 0.15), 0.4, coat=0.4), hid, scale=(1, 0.5, 0.95), seg=16)
        ball(*(p + UP * 0.045 + s * 0.015), 0.013, LEAF2, hid, scale=(1.6, 0.4, 0.8), seg=10)
    elif kind == "waschen":
        ball(*(p + UP * -0.012), 0.034, mat((0.36, 0.62, 0.86), 0.3, coat=0.5), hid, scale=(1, 0.5, 1), seg=16)
        cone(*(p + UP * 0.03), 0.028, 0.0, 0.05, mat((0.36, 0.62, 0.86), 0.3, coat=0.5), hid, verts=16)
    elif kind == "essen":
        ball(*(p + UP * -0.005), 0.04, mat(CREAM, 0.4), hid, scale=(1.2, 0.5, 0.6), seg=16)
        ball(*(p + UP * 0.012), 0.032, mat(OCHRE, 0.6), hid, scale=(1.2, 0.55, 0.25), seg=12)
    elif kind == "garten":
        capsule(p + UP * -0.05, p + UP * 0.0, 0.008, WOOD_D, hid)
        ball(*(p + UP * 0.018), 0.036, LEAF2, hid, scale=(1, 0.5, 1), seg=14)


def obelisk(cx, cy, s=1.0, hid="obelisk", board=True, lit=1, wish=True):
    w, t = 0.72 * s, 0.035 * s
    z0, z1 = 0.09 * s, 2.05 * s
    panel(cx - 0.48 * s, cy - 0.48 * s, 0, cx + 0.48 * s, cy + 0.48 * s, z0, hid, name="Sockel")
    panel(cx - w / 2, cy - w / 2, z0, cx + w / 2, cy - w / 2 + t, z1, hid, name="Obelisk")
    panel(cx - w / 2, cy + w / 2 - t, z0, cx + w / 2, cy + w / 2, z1, hid, name="Obelisk")
    panel(cx + w / 2 - t, cy - w / 2 + t, z0, cx + w / 2, cy + w / 2 - t, z1, hid, name="Obelisk")
    panel(cx - w / 2, cy - w / 2 + t, z0, cx - w / 2 + t, cy + w / 2 - t, z1, hid, name="Obelisk")
    panel(cx - w / 2 - 0.02, cy - w / 2 - 0.02, z1, cx + w / 2 + 0.02, cy + w / 2 + 0.02, z1 + 0.03 * s, hid, name="Deckel")
    cone(cx, cy, z1 + 0.03 * s + 0.21 * s, (w / 2 + 0.02) * 1.414, 0.015, 0.42 * s, multiplex("Z", 100.0), hid,
         rot=(0, 0, R(45)), verts=4, name="Spitze")
    ball(cx, cy, z1 + 0.5 * s, 0.05 * s, mat(OCHRE, 0.4, coat=0.4), hid, name="Kugel")
    # south face, top part: the day plan as five round tiles with small lights (display above, controls below)
    n = Vector((0, -1, 0))
    fy = cy - w / 2
    box(cx - 0.012 * s, fy - 0.02 * s, 1.08 * s, cx + 0.012 * s, fy, 2.0 * s, WOOD_D, hid, name="Leiste")
    for i, zz in enumerate([1.92, 1.73, 1.54, 1.35, 1.16]):
        z = zz * s
        tc = Vector((cx, fy - 0.036 * s, z))
        o = cyl(0, 0, -0.0125 * s, 0.0125 * s, 0.085 * s, multiplex("Z", 100.0), hid, verts=40, name="Plättchen")
        o.location = tc
        o.rotation_euler = (R(90), 0, 0)
        picto(PICTO[i], tc + n * 0.0, n, hid)
        lp = Vector((cx - 0.15 * s, fy - 0.01, z))
        torus(*lp, 0.022 * s, 0.007 * s, WOOD_D, hid, rot=(R(90), 0, 0), seg=20, name="Lichtring")
        on = i == lit
        ball(*(lp + n * 0.004), 0.016 * s, mat((1.0, 0.85, 0.5), 0.3, emission=(1.0, 0.75, 0.35),
                                              strength=14.0 if on else 0.6), hid, seg=12, name="Lichtpunkt")
        if i == 0:
            A("plan_light", *lp)
        A(f"tile{i}", *tc)
    # east face: small speaker up top, wish box for parents in the middle, crank for the airing at child height
    ex = cx + w / 2
    for k in range(7):
        a = k * 2 * math.pi / 7
        ball(ex + 0.004, cy + math.cos(a) * 0.035 * s, 1.72 * s + math.sin(a) * 0.035 * s, 0.009 * s, DARK, hid, seg=8,
             name="Lautsprecher")
    ball(ex + 0.004, cy, 1.72 * s, 0.009 * s, DARK, hid, seg=8, name="Lautsprecher")
    A("speaker", ex, cy, 1.72 * s)
    ky = cy - 0.2 * s
    cyl(ex + 0.006 * s, ky, 0.62 * s - 0.05 * s, 0.62 * s + 0.05 * s, 0.05 * s, multiplex("X", 100.0), hid, verts=24,
        rot=(0, R(90), 0), name="Kurbelscheibe").location = (ex + 0.006 * s, ky, 0.62 * s)
    capsule((ex, ky, 0.62 * s), (ex + 0.08 * s, ky, 0.62 * s), 0.015 * s, WOOD_D, hid, name="Kurbel")
    capsule((ex + 0.08 * s, ky, 0.62 * s), (ex + 0.08 * s, ky, 0.52 * s), 0.013 * s, WOOD_D, hid, name="Kurbel")
    ball(ex + 0.1 * s, ky, 0.51 * s, 0.03 * s, mat(BERRY, 0.4, coat=0.4), hid, name="Kurbelknauf")
    A("kurbel", ex + 0.08 * s, ky, 0.58 * s)
    if wish:
        wy = cy + 0.15 * s
        panel(ex, wy - 0.17 * s, 0.88 * s, ex + 0.12 * s, wy + 0.17 * s, 1.14 * s, hid, name="Wunschkasten")
        box(ex + 0.118 * s, wy - 0.11 * s, 1.08 * s, ex + 0.125 * s, wy + 0.11 * s, 1.095 * s, DARK, hid, name="Schlitz")
        # heart pictogram
        for sd in (-1, 1):
            ball(ex + 0.124 * s, wy + sd * 0.018 * s, 0.99 * s, 0.022 * s, mat(BERRY, 0.4), hid, scale=(0.4, 1, 1), seg=12)
        cone(ex + 0.124 * s, wy, 0.965 * s, 0.035 * s, 0.0, 0.04 * s, mat(BERRY, 0.4), hid, rot=(R(180), 0, 0), verts=16)
        panel(ex, wy - 0.15 * s, 0.7 * s, ex + 0.1 * s, wy + 0.15 * s, 0.72 * s, hid, name="Kartenablage")
        for k in range(4):
            box(ex + 0.02 * s, wy - 0.12 * s + k * 0.065 * s, 0.72 * s, ex + 0.08 * s, wy - 0.07 * s + k * 0.065 * s,
                0.8 * s, mat([CREAM, ROSE, SKY, (0.95, 0.85, 0.55)][k], 0.8), hid, name="Wunschkarte")
        A("wunsch", ex + 0.1 * s, wy, 1.02 * s)
    A("obelisk_top", cx, cy, z1 + 0.6 * s)
    A("obelisk_mid", cx, fy, 1.15 * s)
    A("obelisk_base", cx, cy, 0.1)
    if board:
        bd = board if isinstance(board, dict) else {}
        klotzbrett(cx, fy, s, cube=bd if bd.get("animal") else None,
                   blocks=bd.get("blocks", ("y", "b", "g", None, None, None)))


BLOCK_COLS = [(0.96, 0.76, 0.30), (0.40, 0.60, 0.80), (0.48, 0.68, 0.42)]


def klotzbrett(bx, fy, s=1.0, hid="klotzbrett", blocks=("y", "b", "g", None, None, None), cube=None):
    """Planning board at child height, fixed to the obelisk's south face (fy): sloped, open underneath,
    reachable from both sides. Six hollows for coloured blocks and a cube spot (reader) at the right end.
    cube: optional dict(animal=..., color=..., key=...) for a cube standing on the reader spot."""
    tilt = R(17)
    dep, wid = 0.34 * s, 1.04 * s
    zb = 0.45 * s                                         # board height at its middle
    by = fy - (dep / 2) * math.cos(tilt) - 0.012 * s      # board centre (y)
    nrm = Vector((0, -math.sin(tilt), math.cos(tilt)))
    tv = Vector((0, math.cos(tilt), math.sin(tilt)))
    rot = (tilt, 0, 0)

    def on_board(u, v, h=0.0):
        """Point on the sloped board: u along x, v up the slope (towards the obelisk), h above the surface."""
        return Vector((bx + u, by, zb)) + tv * v + nrm * (0.02 * s + h)

    # two brackets from the obelisk face, nothing on the floor: wheelchairs and knees fit underneath
    for sd in (-1, 1):
        bxp = bx + sd * 0.3 * s
        p0 = on_board(sd * 0.3 * s, dep / 2 * 0.98, -0.042 * s)
        p1 = on_board(sd * 0.3 * s, -dep / 2 * 0.75, -0.042 * s)
        p2 = Vector((bxp, fy - 0.004, zb - 0.27 * s))
        p0.y = min(p0.y, fy - 0.004)
        me = bpy.data.meshes.new("Konsole")
        me.from_pydata([tuple(p0), tuple(p1), tuple(p2)], [], [(0, 1, 2)])
        o = bpy.data.objects.new("Konsole", me)
        scene.collection.objects.link(o)
        sol = o.modifiers.new("s", "SOLIDIFY")
        sol.thickness = 0.022 * s
        sol.offset = 0.0
        o.data.materials.append(multiplex("X", 100.0))
        tag(o, hid)
    pl = panel(-wid / 2, -dep / 2, -0.02 * s, wid / 2, dep / 2, 0.02 * s, hid, name="Klotzbrett")
    pl.location = (bx, by, zb)
    pl.rotation_euler = rot
    # a raised lip on the low (front) edge so blocks cannot slide off
    lip = panel(-wid / 2, -0.011 * s, -0.022 * s, wid / 2, 0.011 * s, 0.022 * s, hid, name="Kante")
    lip.location = on_board(0, -dep / 2 + 0.011 * s, 0.0)
    lip.rotation_euler = rot
    cols = {"y": BLOCK_COLS[0], "b": BLOCK_COLS[1], "g": BLOCK_COLS[2]}
    for i in range(6):
        u = (i - 3.0) * 0.128 * s - 0.02 * s
        o = box(-0.05 * s, -0.05 * s, -0.003, 0.05 * s, 0.05 * s, 0.003, mat((0.55, 0.40, 0.27), 0.7), hid, name="Mulde")
        o.location = on_board(u, 0.01 * s, -0.002)
        o.rotation_euler = rot
        c = blocks[i] if i < len(blocks) else None
        if c:
            b = box(-0.045 * s, -0.045 * s, 0, 0.045 * s, 0.045 * s, 0.09 * s, mat(cols[c], 0.45, coat=0.3), hid,
                    bev=0.01, name="Klotz")
            b.location = on_board(u, 0.01 * s, -0.004)
            b.rotation_euler = rot
    # cube spot: a light ring the cube stands on, right end of the board
    cp = on_board(0.41 * s, 0.01 * s, 0.0)
    o = cyl(0, 0, -0.003, 0.003, 0.058 * s, mat((0.62, 0.46, 0.30), 0.6), hid, verts=32, name="Cube-Platz")
    o.location = cp
    o.rotation_euler = rot
    t = torus(0, 0, 0, 0.058 * s, 0.006 * s, mat((1.0, 0.85, 0.5), 0.3, emission=(1.0, 0.78, 0.4),
              strength=6.0 if cube else 0.8), hid, seg=32, name="Cube-Ring")
    t.location = cp
    t.rotation_euler = rot
    A("board", *(on_board(-0.1 * s, 0.0, 0.05 * s)))
    A("board_free", *(on_board(0.0, 0.0, 0.03 * s)))
    A("cube_spot", *cp)
    if cube:
        mark = len(objects)
        kiddo_cube(0, 0, 0.003, cube.get("animal", "fuchs"), cube.get("color"), cube.get("hid", "mila"), face=-90,
                   s=0.08 * s)
        place_group(objects[mark:], cp, Matrix.Rotation(tilt, 4, "X"))
        A(cube.get("key", "mila_cube"), *(cp + nrm * 0.06 * s))
    basket(bx + 0.8 * s, fy - 0.32 * s, 0, 0.15 * s, 0.18 * s, hid, fill="blocks")
    return on_board


def place_group(objs, loc, rot4=None):
    """Move objects that were built around the origin to loc, optionally rotated (4x4 matrix)."""
    bpy.context.view_layer.update()
    m = Matrix.Translation(Vector(loc)) @ (rot4 or Matrix.Identity(4))
    for o in objs:
        if o.parent is None:
            o.matrix_world = m @ o.matrix_world


# ================================================================ Fach, Planwürfel, Fachwand
class Wall:
    """Local frame on a wall: u along the wall (to the right when facing it), d out into the room, z up.
    axis='x': wall along x at y=at (room at y < at), u from u0 towards +x.
    axis='y': wall along y at x=at (room at x > at), u from u0 towards +y."""

    def __init__(self, axis, at, u0=0.0):
        self.axis, self.at, self.u0 = axis, at, u0
        self.face = -90 if axis == "x" else 0
        self.n = Vector((0, -1, 0)) if axis == "x" else Vector((1, 0, 0))
        self.t = Vector((1, 0, 0)) if axis == "x" else Vector((0, 1, 0))

    def p(self, u, d, z):
        if self.axis == "x":
            return Vector((self.u0 + u, self.at - d, z))
        return Vector((self.at + d, self.u0 + u, z))

    def bx(self, u0, d0, z0, u1, d1, z1):
        a, b = self.p(u0, d0, z0), self.p(u1, d1, z1)
        return (a.x, a.y, a.z, b.x, b.y, b.z)

    def text_rot(self):
        return (R(90), 0, R(self.face + 90))


PW_COL = {"y": (0.97, 0.74, 0.16), "b": (0.28, 0.54, 0.88), "g": (0.40, 0.72, 0.30), "?": (0.97, 0.96, 0.93)}


def planwuerfel(F, uc, zc, rows, size=0.05, gap=0.01, hid="planwuerfel", cover=True):
    """Plan strip with small motorised turning cubes, one per big time of day.

    rows: list of strings, top row first; each char y/b/g/? is the face shown (yellow Kaufladen, blue Bauen,
    green Garten, white with question mark). One row = the day, 4 rows x 5 columns = the week.
    Returns dict: centre, cells (row, col) -> world point of the cube face, frage -> first '?' cell."""
    nr, nc = len(rows), max(len(r) for r in rows)
    W_ = nc * size + (nc - 1) * gap
    H_ = nr * size + (nr - 1) * gap
    m = 0.022
    u0, u1 = uc - W_ / 2 - m, uc + W_ / 2 + m
    z0, z1 = zc - H_ / 2 - m, zc + H_ / 2 + m
    dep = size + 0.03
    panel(*F.bx(u0, 0.0, z0, u1, 0.014, z1), hid, name="Planleiste")
    panel(*F.bx(u0, 0.014, z1 - 0.016, u1, dep, z1), hid, name="Planleiste")
    panel(*F.bx(u0, 0.014, z0, u1, dep - 0.008, z0 + 0.016), hid, name="Planleiste")
    for uu in (u0, u1 - 0.014):
        panel(*F.bx(uu, 0.014, z0 + 0.016, uu + 0.014, dep, z1 - 0.016), hid, name="Planleiste")
    out = {"centre": tuple(F.p(uc, dep, zc)), "cells": {}, "frage": None}
    for i, row in enumerate(rows):
        for j, ch in enumerate(row):
            u = uc - W_ / 2 + size / 2 + j * (size + gap)
            z = zc + H_ / 2 - size / 2 - i * (size + gap)
            d0 = dep - 0.016 - size
            b = rbox(*F.bx(u - size / 2, d0, z - size / 2, u + size / 2, d0 + size, z + size / 2),
                     mat(PW_COL[ch], 0.4, coat=0.35), hid, r=size * 0.12, seg=3, name="Planwürfel")
            face_pt = F.p(u, d0 + size, z)
            out["cells"][(i, j)] = tuple(face_pt)
            if ch == "?":
                text3d("?", *(face_pt + F.n * 0.0013 + Vector((0, 0, -size * 0.03))), size * 0.78, mat((0.25, 0.20, 0.18), 0.5),
                       hid, rot=F.text_rot(), extrude=0.0012, name="Fragezeichen")
                if out["frage"] is None:
                    out["frage"] = tuple(face_pt)
    return out


SHOE_COLS = [BERRY, SKY, OCHRE, SAGE, ROSE, PETROL, CLAY, PLUM]


def fach(F, a, w, kid, hid="faecher", h_top=1.36, depth=0.36, plan_z=None):
    """One child's Fach (garderobe), u from a to a+w on wall frame F.

    kid: dict(animal, color, plan=[rows], cube: True | False | 'gebaerden', jacket: colour or None,
              shoes: colour or None, drawing: bool, name: str or None, size: cube size)
    Bottom to top: shoe compartment, bench, hook with jacket and the cube slot, shelf, drawing tray,
    small cabinet. Above, out of reach: the Planwürfel strip."""
    t = 0.018
    uc = a + w / 2
    out = {}
    # back panel and the floor of the shoe compartment
    panel(*F.bx(a, 0.0, 0.0, a + w, 0.012, h_top), hid, name="Fach Rückwand")
    panel(*F.bx(a + t / 2, 0.012, 0.0, a + w - t / 2, depth - 0.02, 0.035), hid, name="Sockel")
    # bench seat
    panel(*F.bx(a, 0.012, 0.25, a + w, depth + 0.01, 0.282), hid, name="Sitzbank")
    out["bank"] = tuple(F.p(uc, depth * 0.6, 0.29))
    out["schuh"] = tuple(F.p(uc, depth * 0.6, 0.12))
    shoes = kid.get("shoes")
    if shoes:
        sm = mat(shoes, 0.35, coat=0.5)
        for sd in (-1, 1):
            u = uc + sd * 0.055
            rbox(*F.bx(u - 0.035, 0.06, 0.035, u + 0.035, 0.2, 0.09), sm, hid, r=0.02, name="Schuh")
            if kid.get("boots"):
                rbox(*F.bx(u - 0.033, 0.06, 0.035, u + 0.033, 0.13, 0.22), sm, hid, r=0.02, name="Stiefel")
    # hook rail with one hook and the jacket
    panel(*F.bx(a + t / 2, 0.012, 0.83, a + w - t / 2, 0.032, 0.89), hid, name="Hakenleiste")
    hp = F.p(uc, 0.032, 0.865)
    capsule(hp, F.p(uc, 0.085, 0.885), 0.009, WOOD_D, hid, name="Haken")
    ball(*F.p(uc, 0.088, 0.89), 0.016, mat(OCHRE, 0.4, coat=0.4), hid, name="Haken")
    out["haken"] = tuple(F.p(uc, 0.085, 0.885))
    if kid.get("jacket"):
        jc = kid["jacket"]
        jm = fabric(jc)
        body = F.p(uc, 0.07, 0.69)
        rbox(-0.12, -0.045, -0.17, 0.12, 0.045, 0.13, jm, hid, r=0.04, rot=(0, 0, R(F.face - 90)),
             name="Jacke").location = body
        ball(*F.p(uc, 0.07, 0.855), 0.065, jm, hid, scale=(1, 0.75, 0.85), rot=(0, 0, R(F.face - 90)), name="Kapuze")
        for sd in (-1, 1):
            capsule(F.p(uc + sd * 0.1, 0.07, 0.8), F.p(uc + sd * 0.13, 0.08, 0.56), 0.032, jm, hid, name="Ärmel")
    # cube slot: a small raised spot on the bench, back right corner of the niche, with a reader light
    s0, s1 = a + w - t / 2 - 0.125, a + w - t / 2
    panel(*F.bx(s0, 0.09, 0.282, s1, 0.26, 0.318), hid, name="Cube-Platz")
    box(*F.bx(s0 + 0.02, 0.26, 0.293, s1 - 0.02, 0.263, 0.305), mat((1.0, 0.85, 0.5), 0.3, emission=(1.0, 0.8, 0.45),
        strength=5.0 if kid.get("cube") else 0.3), hid, name="Cube-Licht")
    cu = (s0 + s1) / 2
    out["cube_slot"] = tuple(F.p(cu, 0.175, 0.36))
    if kid.get("cube"):
        cs = kid.get("size", 0.08)
        cp = F.p(cu, 0.175, 0.318)
        pts = kiddo_cube(cp.x, cp.y, cp.z, kid.get("animal", "hase"), kid.get("color"), hid,
                         gebaerden=kid["cube"] == "gebaerden", face=F.face, s=cs)
        out["cube"] = pts["centre"]
    # shelf, drawing tray, small cabinet
    panel(*F.bx(a + t / 2, 0.012, 0.95, a + w - t / 2, 0.30, 0.968), hid, name="Ablage")
    panel(*F.bx(a + t / 2, 0.012, 1.045, a + w - t / 2, 0.30, 1.063), hid, name="Malfach")
    out["mal"] = tuple(F.p(uc, 0.28, 1.0))
    if kid.get("drawing", True):
        for k in range(2):
            o = box(-0.13, -0.11, -0.0015, 0.13, 0.11, 0.0015, PAPER, hid, name="Gemaltes")
            o.location = F.p(uc - 0.01 + k * 0.02, 0.24 + k * 0.025, 0.972 + k * 0.004)
            o.rotation_euler = (0, 0, R(F.face + 90 + (k * 7 - 3)))
        ball(*F.p(uc + 0.02, 0.33, 0.9775), 0.028, mat(random.choice([(0.95, 0.7, 0.2), (0.86, 0.3, 0.25), (0.35, 0.6, 0.35)]), 0.8),
             hid, scale=(1.4, 1.0, 0.12), seg=12, name="Farbe")
    door = panel(*F.bx(a + t / 2 + 0.006, 0.296, 1.07, a + w - t / 2 - 0.006, 0.314, 1.325), hid, name="Schränkchen")
    out["schrank"] = tuple(F.p(uc, 0.314, 1.2))
    ball(*F.p(a + w - t / 2 - 0.045, 0.322, 1.2), 0.014, mat(kid.get("color") or OCHRE, 0.4, coat=0.4), hid, name="Knauf")
    relief(F.p(uc - 0.02, 0.314, 1.215), F.n, UP, kid.get("animal", "hase"), kid.get("color"), 0.95, hid)
    if kid.get("name"):
        text3d(kid["name"], *F.p(uc - 0.02, 0.3155, 1.115), 0.036, mat(BERRY, 0.5), hid, rot=F.text_rot(),
               extrude=0.0012, name="Name")
    panel(*F.bx(a + t / 2, 0.012, 1.325, a + w - t / 2, 0.33, h_top - 0.004), hid, name="Fach Deckel")
    # Planwürfel strip above, out of the children's reach
    rows = kid.get("plan")
    if rows:
        size = 0.06 if len(rows) == 1 else 0.04
        gap = 0.012 if len(rows) == 1 else 0.006
        H_ = len(rows) * size + (len(rows) - 1) * gap + 0.044
        pw = planwuerfel(F, uc, (plan_z if plan_z else h_top + 0.002) + H_ / 2, rows, size, gap)
        out["plan"] = pw["centre"]
        out["frage"] = pw["frage"]
        out["cells"] = pw["cells"]
    return out


def fachwand(F, a0, kids, w=0.42, hid="faecher", depth=0.36, plan_z=None):
    """Row of Fächer with shared dividers. Returns a list of per-Fach point dicts."""
    t = 0.018
    res = []
    for k, kid in enumerate(kids):
        res.append(fach(F, a0 + k * w, w, kid, hid, depth=depth, plan_z=plan_z))
    for k in range(len(kids) + 1):
        u = a0 + k * w
        panel(*F.bx(u - t / 2, 0.012, 0.0, u + t / 2, depth, 1.36), hid, name="Fach Seite")
    return res


def co2box(x, y, z, face=-90, led="green", hid="co2", s=1.0, key="co2", lit=12.0):
    """Hand-painted wooden box with three LEDs (green, yellow, red); only one is lit."""
    f = fvec(face)
    side = f.cross(UP)
    body = rbox(-0.09 * s, -0.055 * s, 0, 0.09 * s, 0.055 * s, 0.12 * s, mat((0.36, 0.60, 0.70), 0.55, coat=0.2), hid,
                r=0.012 * s, rot=(0, 0, R(face - 90)), name="Kästchen")
    body.location = (x, y, z)
    front = Vector((x, y, z)) + f * 0.057 * s
    colors = {"green": (0.3, 1.0, 0.45), "yellow": (1.0, 0.8, 0.2), "red": (1.0, 0.25, 0.2)}
    for k, (nm, c) in enumerate(colors.items()):
        on = nm == led
        ball(*(front + side * (k - 1) * 0.045 * s + UP * 0.08 * s), 0.014 * s,
             mat(c, 0.3, emission=c, strength=lit if on else 0.15), hid, seg=12, name="LED")
    for k in range(5):
        ball(*(front + side * (-0.06 + k * 0.03) * s + UP * 0.03 * s), 0.008 * s,
             mat([(0.98, 0.88, 0.45), (0.95, 0.6, 0.6), CREAM][k % 3], 0.5), hid, seg=8, name="Punkt")
    A(key, x, y, z + 0.13 * s)


def oberlicht(x0, x1, y, z0, z1, open_=True, hid="oberlicht", key="ober"):
    """Tilting transom pane on the room side of a wall at y (room at y < wall), with a small motor box."""
    w = x1 - x0 - 0.11
    h = z1 - z0 - 0.08
    ang = R(24) if open_ else 0.0
    hinge = Vector(((x0 + x1) / 2, y, z0 + 0.04))
    pane = box(-w / 2, -0.012, -h / 2, w / 2, 0.012, h / 2, garden_glass(), hid, name="Oberlicht")
    pane.rotation_euler = (ang, 0, 0)
    pane.location = hinge + Vector((0, -math.sin(ang) * h / 2, math.cos(ang) * h / 2))
    pane.visible_shadow = False
    top = hinge + Vector((0, -math.sin(ang) * h, math.cos(ang) * h))
    for sd in (-1, 1):
        fr = box(-0.02, -0.02, -h / 2, 0.02, 0.02, h / 2, WOOD, hid, name="Flügelrahmen")
        fr.rotation_euler = (ang, 0, 0)
        fr.location = pane.location + Vector((sd * w / 2, 0, 0))
    mb = Vector(((x0 + x1) / 2, y - 0.07, z1 + 0.06))
    panel(mb.x - 0.17, mb.y - 0.05, mb.z - 0.05, mb.x + 0.17, mb.y + 0.05, mb.z + 0.05, hid, name="Motor")
    capsule(mb + Vector((0, -0.02, -0.05)), top + Vector((0, -0.01, 0)), 0.008, STEEL, hid, name="Kettenarm")
    A(key, mb.x, mb.y, mb.z)
    A(key + "_pane", *(pane.location))


CHAIN = mat((0.42, 0.43, 0.45), 0.3, metal=0.8, name="Kette")


def casement(fixed, o0, o1, z0, z1, angle=0.0, double=True, hid="fenster", key=None, drive_key=None,
             drive_side="-y", t=0.18):
    """Tall casement window in an x-wall occupying y = fixed..fixed+t. The sashes swing towards -y
    (into the room for a north wall, outwards for a south wall). angle 0 = closed, 80 = wide open.
    Small chain drives sit at the top of the frame; drive_side is the face of the wall they are mounted on."""
    fw = 0.055
    n = 2 if double else 1
    sw = (o1 - o0 - 2 * fw) / n
    sh = z1 - z0 - 2 * fw
    open_ = angle > 1
    glass = mat((0.86, 0.93, 0.95), 0.04, coat=0.6, alpha=0.16, name="Glas offen") if open_ else garden_glass()
    frame_m = multiplex("X", 100.0)
    hy = fixed + 0.035
    res = {}
    dz = (fixed - 0.045, fixed) if drive_side == "-y" else (fixed + t, fixed + t + 0.045)
    for k in range(n):
        left = k == 0
        hx = o0 + fw if left else o1 - fw
        a = -angle if left else 180 + angle
        mark = len(objects)
        bw = 0.05
        for (x0, x1, za, zb) in ((0, sw, 0, bw), (0, sw, sh - bw, sh), (0, bw, bw, sh - bw), (sw - bw, sw, bw, sh - bw)):
            panel(x0, -0.028, za, x1, 0.028, zb, hid, name="Flügel")
        g = box(bw, -0.006, bw, sw - bw, 0.006, sh - bw, glass, hid, name="Flügelglas")
        g.visible_shadow = False
        hs = -1 if drive_side == "-y" else 1
        capsule((sw - 0.03, hs * 0.035, sh * 0.48), (sw - 0.03, hs * 0.075, sh * 0.48), 0.009, STEEL, hid, name="Griff")
        capsule((sw - 0.03, hs * 0.075, sh * 0.48), (sw - 0.03, hs * 0.075, sh * 0.40), 0.008, STEEL, hid, name="Griff")
        rot = Matrix.Rotation(R(a), 4, "Z")
        place_group(objects[mark:], (hx, hy, z0 + fw), rot)
        free_top = Vector((hx, hy, z0 + fw)) + (rot.to_3x3() @ Vector((sw - 0.03, 0, sh - 0.03)))
        free_mid = Vector((hx, hy, z0 + fw)) + (rot.to_3x3() @ Vector((sw * 0.6, -0.03, sh * 0.5)))
        # chain drive: a small housing on the wall above the opening, near the closing edge of the sash
        cx_ = hx + (sw - 0.04) * (1 if left else -1)
        hx0, hx1 = (cx_ - 0.30, cx_ - 0.02) if left else (cx_ + 0.02, cx_ + 0.30)
        rbox(hx0, dz[0], z1 + 0.008, hx1, dz[1], z1 + 0.062, mat((0.50, 0.52, 0.55), 0.35, metal=0.5), hid, r=0.008,
             name="Kettenantrieb")
        cyl(0, 0, -0.004, 0.004, 0.012, DARK, hid, verts=16, rot=(R(90), 0, 0), name="LED").location = (
            hx0 + 0.03 if left else hx1 - 0.03, dz[0] - 0.003 if drive_side == "-y" else dz[1] + 0.003, z1 + 0.033)
        outlet = Vector((cx_ - 0.035 if left else cx_ + 0.035, (dz[0] + dz[1]) / 2, z1 + 0.012))
        if open_:
            tgt = free_top + Vector((0, 0, 0.012))
            # the chain: a row of small links from the housing to the top of the sash
            L = (tgt - outlet).length
            nl = max(4, int(L / 0.022))
            for j in range(nl + 1):
                p = outlet.lerp(tgt, j / nl)
                ball(*p, 0.0105, CHAIN, hid, seg=8, scale=(1, 1, 0.7), name="Kette")
            capsule(outlet, tgt, 0.005, CHAIN, hid, name="Kette")
        res[f"sash{k}"] = tuple(free_mid)
        res[f"drive{k}"] = ((hx0 + hx1) / 2, (dz[0] + dz[1]) / 2, z1 + 0.033)
    if key:
        A(key, *res["sash1" if double else "sash0"])
    if drive_key:
        A(drive_key, *res["drive1" if double else "drive0"])
    return res


def hoehle(x0, y0, y1, depth=1.1, h=1.25, hid="hoehle"):
    """Reading cave of multiplex against a west wall, round opening to +x."""
    x1 = x0 + depth
    panel(x0, y0, h, x1 + 0.02, y1, h + 0.035, hid, name="Höhle Dach")
    panel(x0, y0, 0, x1, y0 + 0.035, h, hid, name="Höhle Seite")
    panel(x0, y1 - 0.035, 0, x1, y1, h, hid, name="Höhle Seite")
    front = panel(x1 - 0.035, y0, 0, x1, y1, h, hid, name="Höhle Front")
    yc, zc = (y0 + y1) / 2, 0.62
    cut = cyl(x1 - 0.02, yc, -0.2, 0.2, 0.42, WOOD, None, verts=64, rot=(0, R(90), 0))
    cut.location = (x1 - 0.02, yc, zc)
    boolean_cut(front, cut)
    cushion((x0 + x1) / 2, yc, 0, depth - 0.15, y1 - y0 - 0.15, 0.12, SAGE, hid=hid)
    cushion((x0 + x1) / 2 - 0.2, yc + 0.25, 0.12, 0.35, 0.35, 0.12, ROSE, 15, hid=hid)
    for k in range(14):
        a = k * 2 * math.pi / 14
        ball(x1 + 0.012, yc + math.cos(a) * 0.45, zc + math.sin(a) * 0.45, 0.014,
             mat((1.0, 0.9, 0.6), 0.3, emission=(1.0, 0.82, 0.5), strength=8.0), hid, seg=8, name="Lichterkette")
    animal(x0 + 0.5, yc - 0.1, 0.12, 0, "bär", (0.72, 0.52, 0.36), s=2.6, hid=hid, soft=True)
    # flag on top
    capsule((x1 - 0.2, y1 - 0.2, h + 0.03), (x1 - 0.2, y1 - 0.2, h + 0.55), 0.01, WOOD_D, hid)
    me = bpy.data.meshes.new("Fahne")
    me.from_pydata([(x1 - 0.2, y1 - 0.2, h + 0.55), (x1 - 0.2, y1 - 0.2, h + 0.38), (x1 - 0.2, y1 - 0.48, h + 0.465)], [], [(0, 1, 2)])
    fo = bpy.data.objects.new("Fahne", me)
    scene.collection.objects.link(fo)
    fo.modifiers.new("s", "SOLIDIFY").thickness = 0.005
    fo.data.materials.append(fabric(OCHRE))
    tag(fo, hid)
    A("hoehle", x0 + 0.55, y0 - 0.01, 0.8)


# ================================================================ scenes
HALL_KIDS = {
    "745": [dict(name="Mila", animal="fuchs", plan=["???"], cube=False, jacket=OCHRE, shoes=BERRY, boots=True),
            dict(name="Defne", animal="katze", plan=["???"], cube=True, jacket=None, shoes=None),
            dict(name="Emil", animal="eule", plan=["?????", "?????", "?????", "?????"], cube=True, jacket=None, shoes=None)],
    "800": [dict(name="Mila", animal="fuchs", plan=["y??"], cube=False, jacket=OCHRE, shoes=BERRY, boots=True),
            dict(name="Defne", animal="katze", plan=["???"], cube=True, jacket=BERRY, shoes=(0.95, 0.80, 0.45), boots=True),
            dict(name="Emil", animal="eule", plan=["bgy??", "gby??", "ygb??", "bbg??"], cube=True, jacket=SAGE,
                 shoes=SAGE, boots=True)],
}


def build_halle(v):
    W, D, H = 5.8, 4.8, 2.6
    room_base(W, D)
    open_ = v == "745"
    # cross ventilation: tall casements on the north wall and on the south wall (front left corner piece)
    wins = [(0.6, 2.2), (3.0, 4.6)]
    z0w, z1w = 0.5, 2.36
    wall("x", D, 0.0, W, h=H, openings=[(a, b, z0w, z1w, "open") for a, b in wins])
    wall("y", 0.0, 0.0, D + 0.18, h=H, openings=[(0.4, 1.35, 0.0, 2.1, "door")], m=WALL_SAGE)
    ang = 80 if open_ else 0
    for i, (a, b) in enumerate(wins):
        casement(D, a, b, z0w, z1w, ang, key="fenster1" if i == 1 else None, drive_key="antrieb" if i == 1 else None)
        dsh = 0.1 if i == 0 else 0.2
        panel(a - 0.06, D - dsh, z0w - 0.035, b + 0.06, D + 0.02, z0w, None, name="Fensterbank")
    # south side: a wall piece at the front left corner with its own tall casement (seen from outside)
    sx0, sx1 = 0.0, 1.45
    wall("x", 0.02, sx0, sx1, h=H, openings=[(0.3, 1.2, z0w, z1w, "open")], backdrop=False)
    lm = larch("X")
    for (x0, x1, za, zb) in ((sx0, 0.3, 0, H), (1.2, sx1, 0, H), (0.3, 1.2, 0, z0w), (0.3, 1.2, z1w, H)):
        box(x0, 0.0, za, x1, 0.02, zb, lm, None, name="Fassade")
    casement(0.02, 0.3, 1.2, z0w, z1w, 62 if open_ else 0, double=False, key="fenster0", drive_side="+y")
    wainscot("x", D, 0.0, W, h=1.0, skip=wins)
    for a, b in wins:
        wainscot("x", D, a, b, h=z0w - 0.04, ledge=False)
    wainscot("y", 0.0, 0.0, D, h=1.0, skip=[(0.4, 1.35), (1.6, 2.86)])
    # bench with cushions under the first window
    panel(0.65, D - 0.42, 0.0, 2.15, D - 0.02, 0.36, "bank", name="Bank")
    cushion(1.03, D - 0.22, 0.36, 0.66, 0.36, 0.1, SAGE, 0, "bank")
    cushion(1.75, D - 0.22, 0.36, 0.66, 0.36, 0.1, ROSE, 0, "bank")
    cushion(1.4, D - 0.19, 0.46, 0.34, 0.12, 0.28, OCHRE, 0, "bank")
    books(0.75, D - 0.25, 0.0, 1.35, "x", None, 0.2)
    plant(0.95, D - 0.05, z0w, 0.5, kind="herb")
    plant(1.85, D - 0.05, z0w, 0.45, pot="cream", kind="herb")
    co2box(4.1, D - 0.1, z0w, face=-90, led="yellow" if v in ("745", "745z") else "green", lit=3.5)
    plant(3.55, D - 0.1, z0w, 0.55, kind="bush")
    plant(5.4, D - 0.42, 0, 1.4, pot="basket", kind="monstera")
    plant(4.95, D - 0.08, 1.0, 0.55, pot="cream", kind="hanging")
    # west wall: three of the children's Fächer with their Planwürfel, reading cave
    kids_cfg = HALL_KIDS["745" if v in ("745", "745z") else "800"]
    if v == "915":
        kids_cfg = [dict(k, plan=["y" + k["plan"][0][1:]] if len(k["plan"]) == 1 else k["plan"]) for k in kids_cfg]
    res = fachwand(Wall("y", 0.0, 1.6), 0.0, kids_cfg, w=0.42)
    A("mila_fach", *res[0]["schrank"])
    A("planwuerfel", *res[0]["plan"])
    A("planwuerfel_defne", *res[1]["plan"])
    drawing(2.6, D - 0.005, 1.55, -90, 0.34, 0.26, motif="sun", hid="bilder")
    drawing(2.6, D - 0.005, 1.17, -90, 0.3, 0.24, motif="house", hid="bilder")
    hoehle(0.02, 3.15, D - 0.02)
    bunting((0.03, 1.5, 2.42), (2.6, D - 0.02, 2.42), sag=0.3)
    # play corner at the front right
    rug_rect(4.2, 0.35, 5.5, 1.35, (0.86, 0.78, 0.64), (0.78, 0.70, 0.56), "spielecke", "Y", 6.0)
    for k in range(5):
        box(4.55 - 0.06, 0.8 - 0.06, 0.02 + k * 0.12, 4.55 + 0.06, 0.8 + 0.06, 0.14 + k * 0.12,
            mat(BLOCKC[k % 4], 0.45, coat=0.3), "spielecke", bev=0.01, rot=(0, 0, R(k * 19)), name="Turm")
    for k in range(4):
        rbox(4.95 + k * 0.17, 0.55, 0.02, 5.1 + k * 0.17, 0.65, 0.1, mat([BERRY, SKY, OCHRE, SAGE][k], 0.45, coat=0.3),
             "spielecke", r=0.02, name="Zug")
    rainbow(5.15, 1.05, 0.02, 0.9, 30, "spielecke")
    # obelisk on a braided rug
    cx, cy = 3.05, 2.25
    rug_round(cx, cy, 1.6, [CLAY, ROSE, OCHRE, SAGE, CREAM, ROSE, SAGE], hid="teppich")
    if v == "800":
        obelisk(cx, cy, lit=1, board=dict(animal="fuchs", key="mila_cube", blocks=(None, None, None, None, None, "y")))
        ring = [8, 40, 100, 132, 168, 200, 232, 262]
        for k, a in enumerate(ring):
            p = Vector((cx, cy, 0)) + fvec(a) * 1.2
            pouf(p.x, p.y, 0.19, [SAGE, ROSE, OCHRE, SKY][k % 4], "kinder")
            kid(k, p.x, p.y, a + 180, "sit", hid="kinder", look=(cx, cy, 1.0), z=0.1)
        p = Vector((cx, cy, 0)) + fvec(70) * 1.3
        stool(p.x, p.y, 0.32, OCHRE, "sanne")
        who("sanne", p.x, p.y, 70 + 180, "sitc", seat=0.32, acc=("ukulele",), look=(cx + 0.2, cy - 0.9, 0.6))
        mp = Vector((cx + 0.25, cy - 0.86, 0))
        who("mila", mp.x, mp.y, 96, "reach", look=(cx + 0.3, cy - 0.6, 0.5), arms={"r": (cx + 0.24, cy - 0.64, 0.55)})
    elif v == "915":
        # Hanna is ill: Bären and Igel play together in one big circle ("Der Fuchs geht um"); tile 0 (circle) is lit
        obelisk(cx, cy, lit=0, board=dict(blocks=("y", None, "y", "b", None, "g")))
        n_k, rr = 19, 1.62
        for k in range(n_k):
            a = 272 + k * 360 / (n_k + 1) + 360 / (n_k + 1)
            p = Vector((cx, cy, 0)) + fvec(a) * rr
            kid(k + (k // 10) * 3, p.x, p.y, a + 180, "sit", hid="kinder", look=(cx, cy, 0.6))
        A("kreis", *(Vector((cx, cy, 0)) + fvec(-45) * rr + Vector((0, 0, 0.45))))
        mp = Vector((cx, cy, 0)) + fvec(272) * (rr + 0.33)
        pm = who("mila", mp.x, mp.y, 182, "walk", look=(mp.x - 0.5, mp.y + 0.3, 0.5))
        hr_ = Vector(pm["hand_r"])
        rbox(hr_.x - 0.02, hr_.y - 0.09, hr_.z - 0.2, hr_.x + 0.02, hr_.y + 0.04, hr_.z - 0.01, fabric(BERRY), "mila", r=0.015,
             name="Tuch")
        sp = Vector((cx + 1.45, cy + 1.25, 0))
        who("sanne", sp.x, sp.y, -135, "wave", look=(cx, cy - 1.4, 0.6))
    else:
        obelisk(cx, cy, lit=0, board=dict(blocks=(None,) * 6))
        sp = Vector((cx + 0.85, cy - 0.75, 0))
        who("sanne", sp.x, sp.y, CAM + 20, "hold", acc=("phone",), look=(sp.x + 0.25, sp.y - 0.3, 1.0))
        jp, mp = Vector((1.5, 0.95, 0)), Vector((1.55, 1.38, 0))
        meet = Vector((1.65, 1.17, 0.72))
        who("jonas", jp.x, jp.y, -5, "walk", arms={"l": meet}, look=(cx, cy, 1.5))
        hold = Vector((mp.x + 0.2, mp.y + 0.1, 0.4))
        pm = who("mila", mp.x, mp.y, 5, "walk", arms={"r": meet, "l": hold}, look=(hold.x + 0.2, hold.y - 0.2, 0.5),
                 acc=("beanie",))
        hl = Vector(pm["hand_l"])
        kiddo_cube(hl.x + 0.035, hl.y - 0.01, hl.z + 0.012, "fuchs", None, "mila", face=CAM)
        A("mila_cube", hl.x + 0.035, hl.y - 0.01, hl.z + 0.06)
    A("in", 0.25, 0.85, 0.0)
    A("out", W - 0.1, 0.25, 0.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, H + 0.05)
    shots = {
        "obelisk": dict(loc=(cx + 1.05, cy - 2.25, 0.98), target=(cx + 0.12, cy - 0.45, 1.16), lens=25, fstop=4.5),
        "fenster": dict(loc=(5.05, D - 2.05, 1.22), target=(3.55, D - 0.25, 1.42), lens=24, fstop=6.0),
    }
    return dict(W=W, D=D, time="morgen", pts=pts, shots=shots, target=(W / 2, D / 2, 1))


# ---- appended into rooms.py (kept separate for editing) ----


def tile_wall(axis, fixed, a0, a1, h=1.3, color=(0.70, 0.79, 0.70), hid=None):
    if axis == "x":
        box(a0, fixed - 0.012, 0, a1, fixed, h, tiles("X", color), hid, name="Fliesen")
        panel(a0, fixed - 0.05, h, a1, fixed, h + 0.02, hid, name="Fliesenkante")
    else:
        box(fixed, a0, 0, fixed + 0.012, a1, h, tiles("Y", color), hid, name="Fliesen")
        panel(fixed, a0, h, fixed + 0.05, a1, h + 0.02, hid, name="Fliesenkante")


def hinged(o, hx, hy, z0, w, h, angle_deg):
    """Place a centred panel so that its left edge sits on the hinge (hx, hy, z0)."""
    a = R(angle_deg)
    o.rotation_euler = (0, 0, a)
    o.location = (hx + math.cos(a) * w / 2, hy + math.sin(a) * w / 2, z0 + h / 2)
    bpy.context.view_layer.update()
    return o


def door_leaf(hx, hy, width, angle, hid=None, porthole=True, sign=None, axis="y"):
    """Multiplex door leaf hinged at (hx, hy). axis='y': door in a west wall, angle 0 = closed towards +y."""
    o = panel(-width / 2, -0.02, -1.025, width / 2, 0.02, 1.025, hid, name="Tür")
    base = 90 if axis == "y" else 0
    hinged(o, hx, hy, 0.0, width, 2.05, base + angle)
    mw = o.matrix_world
    n = (mw.to_3x3() @ Vector((0, 1, 0))).normalized()
    if porthole:
        c = mw @ Vector((0, 0, 0.42))
        for sd in (-1, 1):
            torus(*(c + n * sd * 0.022), 0.13, 0.018, WOOD_D, hid, rot=n.to_track_quat("Z", "Y").to_euler(), seg=32, name="Bullauge")
        g = cyl(0, 0, -0.024, 0.024, 0.12, garden_glass(), hid, verts=32, name="Bullauge Glas")
        g.location = c
        g.rotation_euler = n.to_track_quat("Z", "Y").to_euler()
        g.visible_shadow = False
    k = mw @ Vector((width * 0.38, 0, -0.025))
    for sd in (-1, 1):
        ball(*(k + n * sd * 0.04), 0.03, mat(OCHRE, 0.4, coat=0.4), hid, name="Knauf")
    return o


def fruit(kind, x, y, z, hid=None):
    if kind == "kirsche":
        for sd in (-1, 1):
            ball(x + sd * 0.022, y, z, 0.026, mat((0.74, 0.07, 0.12), 0.3, coat=0.5), hid, seg=12, name="Kirsche")
        curve_tube([(x - 0.022, y, z + 0.02), (x, y, z + 0.07), (x + 0.022, y, z + 0.02)], 0.003, LEAF, hid, name="Stiel")
    elif kind == "aubergine":
        ball(x, y, z, 0.045, mat((0.30, 0.11, 0.36), 0.25, coat=0.6), hid, scale=(2.1, 1, 1), name="Aubergine")
        cone(x + 0.095, y, z, 0.03, 0.01, 0.045, LEAF, hid, rot=(0, R(90), 0), verts=8, name="Stiel")
    elif kind == "apfel":
        col = random.choice([(0.80, 0.14, 0.12), (0.62, 0.78, 0.28), (0.88, 0.32, 0.18)])
        ball(x, y, z, 0.045, mat(col, 0.35, coat=0.4), hid, seg=16, name="Apfel")
    elif kind == "zitrone":
        ball(x, y, z, 0.04, mat((0.98, 0.84, 0.20), 0.4, coat=0.3), hid, scale=(1.3, 1, 1), seg=16, name="Zitrone")
    elif kind == "karotte":
        cone(x, y, z, 0.026, 0.004, 0.16, mat((0.95, 0.50, 0.12), 0.5), hid, rot=(0, R(90), R(random.uniform(-20, 20))),
             verts=10, name="Karotte")
    elif kind == "paprika":
        col = random.choice([(0.85, 0.14, 0.10), (0.98, 0.76, 0.10), (0.35, 0.62, 0.22)])
        ball(x, y, z, 0.05, mat(col, 0.3, coat=0.5), hid, scale=(1, 1, 1.1), seg=16, name="Paprika")
    elif kind == "brot":
        ball(x, y, z, 0.07, mat((0.78, 0.52, 0.26), 0.7, noise=0.1), hid, scale=(1.6, 1, 0.75), seg=16, name="Brot")
    elif kind == "tomate":
        ball(x, y, z, 0.04, mat((0.86, 0.16, 0.10), 0.3, coat=0.5), hid, scale=(1, 1, 0.85), seg=16, name="Tomate")
    elif kind == "gurke":
        capsule((x - 0.06, y, z), (x + 0.06, y, z), 0.025, mat((0.25, 0.48, 0.20), 0.35, coat=0.4), hid, name="Gurke")
    elif kind == "salat":
        for k in range(6):
            a = k * 1.05
            ball(x + math.cos(a) * 0.03, y + math.sin(a) * 0.03, z + 0.01, 0.045, mat((0.50, 0.74, 0.32), 0.6, noise=0.15), hid,
                 scale=(1, 1, 0.7), seg=12, name="Salat")
        ball(x, y, z + 0.03, 0.04, mat((0.62, 0.82, 0.40), 0.6), hid, seg=12, name="Salat")
    elif kind == "kartoffel":
        ball(x, y, z - 0.01, 0.032, mat((0.76, 0.58, 0.36), 0.8, noise=0.2), hid, scale=(1.25, 1, 0.85), seg=12, name="Kartoffel")
    elif kind == "kuerbis":
        for k in range(6):
            a = k * math.pi / 3
            ball(x + math.cos(a) * 0.025, y + math.sin(a) * 0.025, z + 0.02, 0.05, mat((0.95, 0.55, 0.14), 0.45, coat=0.3), hid,
                 scale=(0.8, 0.8, 0.85), seg=14, name="Kürbis")
        cyl(x, y, z + 0.065, z + 0.095, 0.009, LEAF, hid, verts=8, name="Stiel")


def crate(x0, y0, x1, y1, z, kind, hid=None, n=None, tilt=0.0):
    panel(x0, y0, z, x1, y1, z + 0.02, hid, name="Kiste")
    for (a0, b0, a1, b1) in ((x0, y0, x1, y0 + 0.015), (x0, y1 - 0.015, x1, y1), (x0, y0, x0 + 0.015, y1), (x1 - 0.015, y0, x1, y1)):
        panel(a0, b0, z, a1, b1, z + 0.1, hid, name="Kiste")
    step = 0.06 if kind == "kirsche" else (0.07 if kind == "kartoffel" else
                                           (0.14 if kind in ("aubergine", "brot", "gurke", "salat", "kuerbis") else 0.095))
    nx = max(1, int((x1 - x0 - 0.03) / step))
    ny = max(1, int((y1 - y0 - 0.03) / step))
    c = 0
    for i in range(nx):
        for j in range(ny):
            if n is not None and c >= n:
                return
            fx = x0 + 0.015 + (x1 - x0 - 0.03) * (i + 0.5) / nx + random.uniform(-0.008, 0.008)
            fy = y0 + 0.015 + (y1 - y0 - 0.03) * (j + 0.5) / ny + random.uniform(-0.008, 0.008)
            fruit(kind, fx, fy, z + 0.07, hid)
            c += 1


def bowl(x, y, z, r=0.08, food=(0.93, 0.62, 0.25), hid=None, color=CREAM):
    cyl(x, y, z, z + r * 0.6, r, mat(color, 0.35, coat=0.4), hid, verts=28, bev=0.008, name="Schale")
    if food:
        cyl(x, y, z + r * 0.45, z + r * 0.62, r * 0.85, mat(food, 0.7, noise=0.15), hid, verts=24, name="Essen")
        for k in range(4):
            ball(x + random.uniform(-r, r) * 0.45, y + random.uniform(-r, r) * 0.45, z + r * 0.65, r * 0.16,
                 mat(random.choice([(0.35, 0.65, 0.30), (0.86, 0.2, 0.15), (0.95, 0.7, 0.2)]), 0.6), hid, seg=8)


def cup(x, y, z, color=SKY, hid=None):
    cyl(x, y, z, z + 0.08, 0.035, mat(color, 0.4, coat=0.4), hid, verts=20, name="Becher")


# ================================================================ Kaufladen 10:00
def build_kaufladen(v):
    W, D, H = 5.6, 4.8, 2.6
    room_base(W, D)
    wall("x", D, 0.0, W, h=H, openings=[(3.5, 5.1, 0.55, 1.98, "window")])
    wall("y", 0.0, 0.0, D + 0.18, h=H, openings=[(0.4, 1.3, 0.0, 2.1, "door")], m=WALL_ROSE)
    wainscot("x", D, 0.0, W, h=1.0, skip=[(3.5, 5.1)])
    wainscot("x", D, 3.5, 5.1, h=0.5, ledge=False)
    wainscot("y", 0.0, 0.0, D, h=1.0, skip=[(0.4, 1.3)])
    # recipe letterbox to the kitchen, next to the door
    bx, by, bz = 0.02, 1.75, 1.05
    panel(bx, by - 0.2, bz - 0.17, bx + 0.14, by + 0.2, bz + 0.17, "briefkasten", name="Rezept-Briefkasten")
    box(bx + 0.138, by - 0.12, bz + 0.08, bx + 0.146, by + 0.12, bz + 0.1, DARK, "briefkasten", name="Schlitz")
    cyl(bx + 0.15, by, bz - 0.06, bz - 0.0, 0.06, mat(BERRY, 0.4, coat=0.3), "briefkasten", verts=20,
        rot=(0, R(90), 0), name="Topf-Symbol").location = (bx + 0.15, by, bz - 0.04)
    text3d("Rezepte für die Küche", bx + 0.15, by, bz + 0.27, 0.05, DARK, "briefkasten", rot=(R(90), 0, R(90)), name="Schild")
    panel(bx, by - 0.26, bz + 0.22, bx + 0.02, by + 0.26, bz + 0.32, "briefkasten", name="Schildbrett")
    A("briefkasten", bx + 0.15, by, bz + 0.1)
    # shop stall: counter, shelves of crates, awning, sign
    x0, x1, cy0, cy1 = 0.45, 2.95, 2.85, 3.3
    panel(x0, cy0, 0, x1, cy0 + 0.02, 0.62, "laden", name="Theke Front")
    panel(x0, cy0, 0.62, x1, cy1, 0.65, "laden", name="Theke")
    panel(x0, cy0, 0, x0 + 0.02, cy1, 0.62, "laden", name="Theke Seite")
    panel(x1 - 0.02, cy0, 0, x1, cy1, 0.62, "laden", name="Theke Seite")
    for k, col in enumerate([SAGE, CREAM, SAGE, CREAM, SAGE]):
        box(x0 + 0.08 + k * 0.49, cy0 - 0.004, 0.08, x0 + 0.45 + k * 0.49, cy0, 0.54, mat(col, 0.7), "laden", name="Thekenfeld")
    for xp in (x0 + 0.05, x1 - 0.05):
        panel(xp - 0.03, cy0 + 0.05, 0.65, xp + 0.03, cy0 + 0.11, 1.9, "laden", name="Pfosten")
    panel(x0, cy0 + 0.04, 1.86, x1, cy0 + 0.12, 1.92, "laden", name="Balken")
    aw = rbox(-(x1 - x0) / 2 - 0.1, -0.42, -0.012, (x1 - x0) / 2 + 0.1, 0.42, 0.012, stripes(SAGE, CREAM, 6.0, "X", 0.5),
              "laden", r=0.008, name="Markise")
    aw.location = ((x0 + x1) / 2, cy0 - 0.12, 1.78)
    aw.rotation_euler = (R(-24), 0, 0)
    for k in range(13):
        xx = x0 - 0.08 + k * (x1 - x0 + 0.16) / 12
        o = cyl(0, 0, -0.006, 0.006, 0.075, mat(SAGE if k % 2 == 0 else CREAM, 0.8, sheen=0.5), "laden", verts=20, name="Bogen")
        o.location = (xx, cy0 - 0.12 - 0.42 * math.cos(R(24)), 1.78 - 0.42 * math.sin(R(24)) - 0.01)
        o.rotation_euler = (R(90 - 24), 0, 0)
    panel((x0 + x1) / 2 - 0.7, cy0 + 0.06, 1.95, (x0 + x1) / 2 + 0.7, cy0 + 0.1, 2.3, "laden", name="Schild")
    text3d("Kaufladen", (x0 + x1) / 2, cy0 + 0.055, 2.125, 0.17, mat(BERRY, 0.5), "laden", extrude=0.006, name="Schrift")
    # shelves of crates against the north wall
    for t_, (zz, dy) in enumerate([(0.0, 0.0), (0.42, 0.12), (0.84, 0.24)]):
        panel(0.35, D - 0.5 + dy, zz + 0.3, 3.05, D - 0.02, zz + 0.33, "regal", name="Kistenregal")
    for xp in (0.37, 1.7, 3.03):
        panel(xp - 0.02, D - 0.5, 0, xp + 0.02, D - 0.02, 1.2, "regal", name="Kistenregal")
    kinds = [("apfel", "zitrone"), ("paprika", "karotte"), ("brot", "tomate")]
    for t_, (zz, dy) in enumerate([(0.0, 0.0), (0.42, 0.12), (0.84, 0.24)]):
        for j, xr in enumerate([(0.45, 1.6), (1.8, 2.95)]):
            crate(xr[0], D - 0.46 + dy, xr[1], D - 0.08, zz + 0.33, kinds[t_][j], "regal")
    # counter goods: 5 aubergines, 20 cherries, the till
    crate(0.55, 2.9, 1.05, 3.24, 0.65, "aubergine", "laden", n=5)
    bowl(1.35, 3.07, 0.65, 0.13, None, "laden", (0.95, 0.94, 0.9))
    for k in range(20):
        a = k * 2.39
        rr = 0.03 + 0.07 * math.sqrt(k / 20)
        fruit("kirsche", 1.35 + math.cos(a) * rr, 3.07 + math.sin(a) * rr, 0.72 + 0.02 * (k % 3), "laden")
    tray = kasse(2.3, 3.07, 0.65)
    kiddo_cube(tray[0], tray[1], tray[2], "fuchs", None, "mila", face=-100)
    A("mila_cube", tray[0], tray[1], tray[2] + 0.06)
    # people
    who("defne", 2.72, 3.68, -105, "stand", hid="defne", acc=("crown",), look=(2.0, 2.4, 0.8))
    who("mila", 2.05, 2.42, 95, "reach", hid="mila", acc=("fruit",), look=(2.3, 3.07, 0.75),
        arms={"r": (2.18, 2.88, 0.72)})
    kid(2, 2.75, 2.05, 125, "stand", hid="kinder", acc=("basket",), look=(2.3, 3.0, 0.8))
    # drawing table with birthday ring
    tx, ty = 4.0, 1.55
    kid_table(tx - 0.5, ty - 0.5, tx + 0.5, ty + 0.5, 0.5, "maltisch", round_=True)
    for k, (dx, dy, ang) in enumerate([(-0.15, -0.1, 20), (0.18, 0.12, -30)]):
        o = box(-0.14, -0.1, 0, 0.14, 0.1, 0.004, PAPER, "maltisch", name="Papier")
        o.location = (tx + dx, ty + dy, 0.5)
        o.rotation_euler = (0, 0, R(ang))
        for j, col in enumerate([(0.86, 0.2, 0.15), (0.95, 0.75, 0.2), (0.35, 0.62, 0.3)]):
            ball(tx + dx + (j - 1) * 0.05, ty + dy + 0.01 * j, 0.506, 0.025, mat(col, 0.8), "maltisch", scale=(1.3, 1, 0.15))
    cyl(tx + 0.25, ty - 0.2, 0.5, 0.6, 0.04, mat(SKY, 0.5), "maltisch", name="Stiftebecher")
    for k in range(6):
        capsule((tx + 0.25 + math.cos(k) * 0.02, ty - 0.2 + math.sin(k) * 0.02, 0.55),
                (tx + 0.25 + math.cos(k) * 0.035, ty - 0.2 + math.sin(k) * 0.035, 0.68), 0.006,
                mat(CLOTH[k], 0.5), "maltisch", name="Stift")
    # Geburtstagskranz with candles and a 5
    torus(tx - 0.1, ty + 0.25, 0.53, 0.14, 0.03, WOOD, "kranz", seg=36, name="Kranz")
    for k in range(5):
        a = k * 2 * math.pi / 5
        px, py = tx - 0.1 + math.cos(a) * 0.14, ty + 0.25 + math.sin(a) * 0.14
        cyl(px, py, 0.55, 0.66, 0.012, mat(CREAM, 0.6), "kranz", verts=12, name="Kerze")
        ball(px, py, 0.68, 0.013, mat((1, 0.8, 0.4), 0.3, emission=(1.0, 0.7, 0.3), strength=20.0), "kranz", scale=(1, 1, 1.6),
             seg=10, name="Flamme")
    text3d("5", tx - 0.1, ty + 0.25, 0.62, 0.12, mat(OCHRE, 0.4, coat=0.4), "kranz", rot=(R(90), 0, R(-40)), extrude=0.012)
    A("kranz", tx - 0.1, ty + 0.25, 0.7)
    stool(tx - 0.62, ty - 0.35, 0.3, ROSE, "maltisch")
    kid(4, tx - 0.62, ty - 0.35, 30, "sitc", hid="maltisch", seat=0.3, look=(tx - 0.15, ty - 0.1, 0.5), acc=("brush",))
    stool(tx + 0.55, ty + 0.5, 0.3, SKY, "maltisch")
    kid(7, tx + 0.55, ty + 0.5, 220, "sitc", hid="maltisch", seat=0.3, look=(tx + 0.18, ty + 0.12, 0.5))
    who("ayla", tx + 0.7, ty - 0.45, 150, "kneel", hid="ayla", look=(tx - 0.4, ty - 0.3, 0.6))
    # window side
    plant(3.8, D - 0.1, 0.55, 0.55, kind="herb")
    plant(4.8, D - 0.1, 0.55, 0.55, pot="cream", kind="bush")
    gemuesestand(3.45, 3.62, 4.65)
    # a child's shopping basket, ready to go
    bm = mat(SAGE, 0.5, coat=0.2)
    bx_, by_ = 3.2, 3.25
    box(bx_ - 0.14, by_ - 0.1, 0.0, bx_ + 0.14, by_ + 0.1, 0.012, bm, "gemuese", name="Einkaufskorb")
    for (a0, b0, a1, b1) in ((-0.14, -0.1, 0.14, -0.09), (-0.14, 0.09, 0.14, 0.1), (-0.14, -0.09, -0.13, 0.09), (0.13, -0.09, 0.14, 0.09)):
        box(bx_ + a0, by_ + b0, 0.0, bx_ + a1, by_ + b1, 0.12, bm, "gemuese", name="Einkaufskorb")
    torus(bx_, by_, 0.12, 0.13, 0.009, mat(OCHRE, 0.5), "gemuese", rot=(R(90), 0, 0), half=True, name="Henkel")
    fruit("apfel", bx_ - 0.06, by_, 0.055, "gemuese")
    fruit("karotte", bx_ + 0.04, by_ - 0.02, 0.05, "gemuese")
    fruit("tomate", bx_ + 0.07, by_ + 0.04, 0.05, "gemuese")
    bunting((0.03, 2.2, 2.4), (0.03, D - 0.05, 2.4), sag=0.18, colors=[OCHRE, BERRY, SKY, SAGE])
    bunting((0.3, D - 0.02, 2.42), (3.3, D - 0.02, 2.42), sag=0.22, colors=[ROSE, OCHRE, SAGE, SKY])
    for k, (yy, mo) in enumerate([(2.6, "rainbow"), (3.15, "person")]):
        drawing(0.005, yy, 1.45, 0, 0.36, 0.28, motif=mo, hid="bilder")
    A("in", 0.25, 0.85, 0.0)
    A("out", W - 0.1, 0.25, 0.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, H + 0.05)
    shots = {"kasse": dict(loc=(3.05, 1.85, 1.22), target=(2.3, 3.3, 0.84), lens=34, fstop=3.5)}
    return dict(W=W, D=D, time="vormittag", pts=pts, shots=shots, target=(W / 2, D / 2, 1))


def gemuesestand(x0, y0, x1, hid="gemuese"):
    """Stepped vegetable stand like at the market: three tiers of crates, price tags, a scale and paper bags.
    Front edge at y0, rising towards +y."""
    tiers = [(0.0, 0.30, 0.26), (0.30, 0.52, 0.46), (0.52, 0.72, 0.66)]
    kinds = [["tomate", "gurke", "paprika"], ["karotte", "salat", "kartoffel"], ["kuerbis", "aubergine", "zitrone"]]
    n = 3
    cw = (x1 - x0) / n
    for t_, (d0, d1, z) in enumerate(tiers):
        zp = tiers[t_ - 1][2] if t_ else 0.0
        panel(x0 + 0.02, y0 + d0, z - 0.03, x1 - 0.02, y0 + d1, z, hid, name="Stufe")
        panel(x0 + 0.02, y0 + d0, zp, x1 - 0.02, y0 + d0 + 0.02, z - 0.03, hid, name="Stufe Front")
        for j in range(n):
            ca, cb = x0 + j * cw + 0.02, x0 + (j + 1) * cw - 0.02
            crate(ca, y0 + d0 + 0.03, cb, y0 + d1 - 0.02, z, kinds[t_][j], hid)
            # price tag on a stick
            tg = Vector(((ca + cb) / 2 + 0.06, y0 + d0 + 0.05, z + 0.17))
            capsule(tg + Vector((0, 0, -0.1)), tg, 0.003, WOOD, hid, name="Stab")
            panel(tg.x - 0.04, tg.y - 0.003, tg.z - 0.012, tg.x + 0.04, tg.y + 0.003, tg.z + 0.035, hid, face=(0.97, 0.95, 0.9),
                  name="Preisschild")
            text3d(str((j + t_) % 3 + 1), tg.x, tg.y - 0.0045, tg.z + 0.012, 0.035, mat(BERRY, 0.5), hid, extrude=0.001,
                   name="Preis")
    for xp in (x0 + 0.01, x1 - 0.01):
        panel(xp - 0.01, y0, 0, xp + 0.01, y0 + 0.72, 0.70, hid, name="Seitenwange")
    # sign board on two posts behind the top tier
    for xp in (x0 + 0.01, x1 - 0.01):
        cyl(xp, y0 + 0.74, 0.0, 1.3, 0.018, WOOD, hid, verts=12, name="Pfosten")
    panel(x0 - 0.01, y0 + 0.72, 1.08, x1 + 0.01, y0 + 0.725, 1.3, hid, name="Schild")
    text3d("Gemüse", (x0 + x1) / 2, y0 + 0.717, 1.19, 0.12, mat(SAGE_D, 0.5), hid, extrude=0.004, name="Schrift")
    # kitchen scale and paper bags on the side
    sx, sy = x1 + 0.22, y0 + 0.2
    panel(x1 + 0.05, y0 + 0.02, 0, x1 + 0.4, y0 + 0.42, 0.55, hid, name="Waagentisch")
    rbox(sx - 0.1, sy - 0.08, 0.55, sx + 0.1, sy + 0.08, 0.63, mat(SAGE, 0.4, coat=0.3), hid, r=0.02, name="Waage")
    cyl(sx, sy, 0.63, 0.66, 0.012, STEEL, hid, verts=12, name="Waage")
    cyl(sx, sy, 0.66, 0.70, 0.11, mat((0.85, 0.85, 0.82), 0.25, metal=0.6), hid, verts=32, bev=0.01, name="Waagschale")
    cyl(sx, sy - 0.081, 0.59, 0.6, 0.035, mat(CREAM, 0.4), hid, verts=24, rot=(R(90), 0, 0), name="Skala").location = (sx, sy - 0.081, 0.59)
    for k in range(3):
        o = rbox(-0.06, -0.035, 0, 0.06, 0.035, 0.16, mat((0.80, 0.66, 0.46), 0.9), hid, r=0.008, name="Papiertüte")
        o.location = (x1 + 0.13 + k * 0.03, y0 + 0.36, 0.55 + k * 0.003)
        o.rotation_euler = (0, 0, R(k * 12))
    A("gemuese", (x0 + x1) / 2, y0 + 0.35, 0.75)


def kasse(x, y, z, hid="kasse"):
    """Wooden scanner till: speaker grille towards the customer, scan window on top, coin tray."""
    rbox(x - 0.2, y - 0.14, z, x + 0.2, y + 0.14, z + 0.12, multiplex("Z", 100.0), hid, r=0.015, name="Kasse")
    top = rbox(-0.17, -0.11, -0.03, 0.17, 0.11, 0.03, multiplex("Z", 100.0), hid, r=0.012, name="Kassenkopf")
    top.location = (x + 0.02, y + 0.03, z + 0.16)
    top.rotation_euler = (R(-22), 0, 0)
    # speaker grille (front)
    for k in range(19):
        a = k * 2.39
        rr = 0.045 * math.sqrt(k / 19)
        ball(x - 0.1 + math.cos(a) * rr, y - 0.142, z + 0.065 + math.sin(a) * rr, 0.006, DARK, hid, seg=8, name="Lautsprecher")
    torus(x - 0.1, y - 0.142, z + 0.065, 0.055, 0.007, WOOD_D, hid, rot=(R(90), 0, 0), seg=28, name="Lautsprecherring")
    A("speaker", x - 0.1, y - 0.15, z + 0.065)
    # scan window
    sc = box(-0.08, -0.05, -0.004, 0.08, 0.05, 0.004, mat((0.8, 0.15, 0.12), 0.2, emission=(1.0, 0.2, 0.15), strength=3.0),
             hid, name="Scanfenster")
    sc.location = (x + 0.04, y + 0.0, z + 0.195)
    sc.rotation_euler = (R(-22), 0, 0)
    A("scan", x + 0.04, y, z + 0.2)
    # coin tray with wooden coins
    panel(x + 0.08, y - 0.2, z, x + 0.32, y - 0.06, z + 0.03, hid, name="Münzschale")
    for k in range(7):
        cyl(x + 0.11 + (k % 4) * 0.05, y - 0.17 + (k // 4) * 0.055, z + 0.03, z + 0.042, 0.02, mat(OCHRE, 0.45, coat=0.3), hid,
            verts=16, name="Taler")
    A("coins", x + 0.2, y - 0.13, z + 0.04)
    ball(x + 0.28, y + 0.1, z + 0.03, 0.03, mat((0.9, 0.75, 0.35), 0.25, metal=0.8), hid, scale=(1, 1, 0.6), name="Klingel")
    A("kasse", x, y, z + 0.2)
    # cube tray on the customer side: a reader under the tray recognises the cube standing on it
    ax, ay = x - 0.33, y - 0.09
    panel(ax - 0.085, ay - 0.085, z, ax + 0.085, ay + 0.085, z + 0.022, hid, name="Ablage")
    for (a0, b0, a1, b1) in ((ax - 0.085, ay - 0.085, ax + 0.085, ay - 0.072), (ax - 0.085, ay + 0.072, ax + 0.085, ay + 0.085),
                             (ax - 0.085, ay - 0.072, ax - 0.072, ay + 0.072), (ax + 0.072, ay - 0.072, ax + 0.085, ay + 0.072)):
        panel(a0, b0, z + 0.022, a1, b1, z + 0.034, hid, name="Ablage Rand")
    box(ax - 0.05, ay - 0.0865, z + 0.006, ax + 0.05, ay - 0.0855, z + 0.016, mat((1.0, 0.85, 0.5), 0.3, emission=(1.0, 0.8, 0.45),
        strength=6.0), hid, name="Ablage Licht")
    A("ablage", ax, ay, z + 0.06)
    return (ax, ay, z + 0.022)


# ================================================================ Waschraum 11:45
def build_waschraum(v):
    W, D, H = 4.6, 4.0, 2.6
    on = v != "aus"
    room_base(W, D, floor_m=tiles("X", (0.74, 0.66, 0.54), (0.86, 0.82, 0.74), 0.3, axis_v="Y"))
    wall("x", D, 0.0, W, h=H, openings=[(1.0, 2.3, 1.6, 2.2, "window")], sill=False)
    wall("y", 0.0, 0.0, D + 0.18, h=H, openings=[(0.35, 1.25, 0.0, 2.1, "door")], m=WALL_SAGE)
    tile_wall("x", D, 0.0, W, 1.3)
    tile_wall("y", 0.0, 0.0, 0.35, 1.3)
    tile_wall("y", 0.0, 1.25, D, 1.3)
    door_leaf(0.0, 1.25, 0.9, -65, "tuer", axis="y")
    A("tuer", 0.05, 0.8, 1.3)
    panel(0.02, 0.4, 2.15, 0.06, 1.2, 2.4, "tuer", name="Türschild")
    text3d("Waschraum", 0.065, 0.8, 2.275, 0.09, DARK, "tuer", rot=(R(90), 0, R(90)))
    # counter with four sinks
    cx0, cx1, cxs = 0.35, 3.0, 2.3
    top_m = mat((0.95, 0.94, 0.91), 0.35, coat=0.3)
    panel(cx0, D - 0.52, 0, cxs, D - 0.5, 0.52, "becken", name="Waschtisch Front")
    panel(cxs - 0.02, D - 0.5, 0, cxs, D - 0.01, 0.52, "becken", name="Waschtisch Seite")
    box(cx0, D - 0.52, 0.52, cxs, D - 0.01, 0.56, top_m, "becken", bev=0.01, name="Waschtisch")
    # one sink lower and open underneath: knees and wheelchairs fit, siphon flat against the wall
    box(cxs + 0.012, D - 0.52, 0.44, cx1, D - 0.01, 0.48, top_m, "becken", bev=0.01, name="Waschtisch tief")
    for bxp in (cxs + 0.1, cx1 - 0.1):
        capsule((bxp, D - 0.012, 0.22), (bxp, D - 0.44, 0.43), 0.012, STEEL, "becken", name="Konsole")
        capsule((bxp, D - 0.012, 0.43), (bxp, D - 0.46, 0.43), 0.012, STEEL, "becken", name="Konsole")
    curve_tube([(2.63, D - 0.27, 0.44), (2.63, D - 0.27, 0.36), (2.63, D - 0.1, 0.33), (2.63, D - 0.012, 0.33)], 0.018, STEEL,
               "becken", name="Siphon")
    sinks = [0.68, 1.33, 1.98, 2.63]
    ring_cols = [(0.35, 0.85, 0.75), (0.95, 0.75, 0.30), (0.55, 0.70, 0.98), (0.95, 0.55, 0.65)]
    for i, sx in enumerate(sinks):
        sy = D - 0.27
        dz = -0.08 if i == 3 else 0.0
        ball(sx, sy, 0.565 + dz, 0.17, mat((0.97, 0.97, 0.96), 0.2, coat=0.6), "becken", scale=(1, 0.85, 0.32), seg=32, name="Becken")
        ball(sx, sy, 0.575 + dz, 0.14, mat((0.88, 0.89, 0.9), 0.25), "becken", scale=(1, 0.85, 0.28), seg=32, name="Becken innen")
        c = ring_cols[i]
        torus(sx, sy, 0.575 + dz, 0.185, 0.012, mat(c, 0.3, emission=c, strength=7.0 if on else 0.0), "becken", seg=48, name="Lichtring")
        if on:
            ang = R(40 + i * 75)
            for j in range(4):
                a2 = ang - j * 0.25
                ball(sx + math.cos(a2) * 0.185, sy + math.sin(a2) * 0.185 * 0.85, 0.585 + dz, 0.018 - j * 0.003,
                     mat((1, 1, 0.9), 0.2, emission=(1.0, 0.98, 0.85), strength=30.0 - j * 7), "becken", seg=10, name="Lichtkäfer")
        if i == 3:  # sensor tap, low and short
            curve_tube([(sx, D - 0.03, 0.54 + dz), (sx, D - 0.05, 0.66 + dz), (sx, D - 0.16, 0.67 + dz), (sx, D - 0.18, 0.62 + dz)],
                       0.014, STEEL, "becken", name="Hahn")
            ball(sx, D - 0.05, 0.6 + dz, 0.012, mat((0.3, 0.3, 0.32), 0.3, emission=(0.4, 0.8, 1.0), strength=2.0), "becken", seg=10,
                 name="Sensor")
        else:
            curve_tube([(sx, D - 0.03, 0.62), (sx, D - 0.05, 0.75), (sx, D - 0.18, 0.76), (sx, D - 0.2, 0.69)], 0.014, STEEL, "becken",
                       name="Hahn")
        A(f"sink{i}", sx, sy, 0.6 + dz)
        P(f"ring{i}", [(sx + math.cos(t * math.pi / 18) * 0.185, sy + math.sin(t * math.pi / 18) * 0.185 * 0.85, 0.585 + dz)
                       for t in range(37)])
    A("sink_low", 2.63, D - 0.3, 0.5)
    for sx in (1.0, 2.2):
        cyl(sx, D - 0.1, 0.56, 0.72, 0.04, mat(SAGE_D, 0.4, coat=0.3), "seife", verts=24, name="Seifenspender")
        capsule((sx, D - 0.1, 0.72), (sx, D - 0.16, 0.76), 0.012, WHITE, "seife", name="Pumpe")
    A("seife", 1.0, D - 0.1, 0.75)
    # mirror strip, speaker
    panel(cx0 + 0.05, D - 0.04, 0.82, cx1 - 0.05, D - 0.01, 1.4, "spiegel", name="Spiegelrahmen")
    box(cx0 + 0.1, D - 0.045, 0.87, cx1 - 0.1, D - 0.04, 1.35, mirror(), "spiegel", name="Spiegel")
    for k in range(13):
        a = k * 2.39
        rr = 0.05 * math.sqrt(k / 13)
        ball(3.2 + math.cos(a) * rr, D - 0.012, 1.05 + math.sin(a) * rr, 0.007, DARK, "lautsprecher", seg=8)
    torus(3.2, D - 0.01, 1.05, 0.065, 0.01, WOOD_D, "lautsprecher", rot=(R(90), 0, 0), seg=28)
    A("lautsprecher", 3.2, D - 0.01, 1.05)
    # towel hooks with picture symbols
    for k in range(6):
        yy = 1.65 + k * 0.36
        panel(0.0, yy - 0.06, 0.95, 0.03, yy + 0.06, 1.07, "handtuch", name="Haken")
        # painted picture badges (the same animals as on the children's cubes), no figures
        badge = cyl(0, 0, -0.006, 0.006, 0.05, multiplex("X", 100.0), "handtuch", verts=28, rot=(0, R(90), 0), name="Bildschild")
        badge.location = (0.036, yy, 1.16)
        relief((0.042, yy, 1.16), (1, 0, 0), UP, ["igel", "hase", "ente", "bär", "katze", "fuchs"][k], None, 1.05, "handtuch")
        rbox(0.03, yy - 0.14, 0.45, 0.07, yy + 0.14, 0.95, fabric(CLOTH[(k * 3) % len(CLOTH)], 0.6, 0.95, 0.1), "handtuch",
             r=0.02, name="Handtuch")
    # toilets behind low partitions
    for xp in (3.25, 3.92):
        panel(xp - 0.015, D - 1.05, 0.12, xp + 0.015, D, 1.2, "toilette", name="Trennwand")
    panel(W - 0.03, D - 1.05, 0.12, W, D, 1.2, "toilette", name="Trennwand")
    for k, (xa, xb) in enumerate([(3.27, 3.9), (3.94, W - 0.03)]):
        dw = xb - xa - 0.04
        d = panel(-dw / 2, -0.015, -0.475, dw / 2, 0.015, 0.475, "toilette", name="Halbtür")
        hinged(d, xa + 0.02, D - 1.05, 0.15, dw, 0.95, 25 if k == 0 else 0)
        tx = (xa + xb) / 2
        cyl(tx, D - 0.32, 0, 0.26, 0.13, WHITE, "toilette", verts=28, bev=0.02, name="Toilette")
        torus(tx, D - 0.34, 0.27, 0.12, 0.025, mat(SAGE, 0.4, coat=0.3), "toilette", seg=28, name="Brille")
        rbox(tx - 0.16, D - 0.12, 0.25, tx + 0.16, D - 0.02, 0.55, WHITE, "toilette", r=0.02, name="Spülkasten")
    smiley(3.6, D - 1.07, 1.02, -90, "froh", 0.05, hid="toilette")
    # step stool
    panel(2.9, 2.45, 0, 3.25, 2.75, 0.18, "becken", name="Tritt")
    # people: kids washing hands, Sanne singing
    for k, sx in enumerate(sinks[:3]):
        if k == 1:
            who("mila", sx, D - 0.78, 90, "wash", hid="mila", look=(sx, D - 0.2, 0.62))
        else:
            kid(k * 3 + 1, sx, D - 0.8, 90, "wash", hid="kinder", look=(sx, D - 0.2, 0.62))
    kid(5, 0.55, 2.35, 175, "reach", hid="kinder", arms={"r": (0.12, 2.37, 0.85), "l": (0.14, 2.3, 0.78)})
    who("sanne", 2.25, 2.2, 110, "kneel", hid="sanne", look=(1.33, D - 0.6, 0.7))
    plant(3.95, 0.4, 0, 0.8, kind="bush")
    plant(1.65, D - 0.1, 1.6, 0.45, pot="cream", kind="herb")
    A("in", 0.25, 0.8, 0.0)
    A("out", W - 0.1, 0.25, 0.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, H + 0.05)
    shots = {"becken": dict(loc=(1.8, D - 1.25, 1.38), target=(1.33, D - 0.27, 0.58), lens=34, fstop=3.5)}
    return dict(W=W, D=D, time="mittag", pts=pts, shots=shots, target=(W / 2, D / 2, 1))


# ================================================================ Bistro 12:00
def build_bistro(v):
    W, D, H = 6.0, 5.0, 2.6
    room_base(W, D)
    wall("x", D, 0.0, W, h=H, openings=[(2.0, 3.6, 0.9, 1.65, "hatch"), (4.4, 5.3, 0.0, 2.1, "door")])
    wall("y", 0.0, 0.0, D + 0.18, h=H, openings=[(0.4, 1.3, 0.0, 2.1, "door"), (1.9, 3.5, 0.6, 1.95, "window")], m=WALL_SAGE)
    wainscot("x", D, 0.0, W, h=0.9, skip=[(2.0, 3.6), (4.4, 5.3)])
    wainscot("x", D, 2.0, 3.6, h=0.88, ledge=False)
    wainscot("y", 0.0, 0.0, D, h=0.9, skip=[(0.4, 1.3), (1.9, 3.5)])
    wainscot("y", 0.0, 1.9, 3.5, h=0.58, ledge=False)
    # the kitchen behind the pass is its own room: closed niche with steel back, door with sign
    panel(2.0, D - 0.25, 0.86, 3.6, D + 0.02, 0.9, "durchreiche", name="Durchreiche")
    box(2.0, D + 0.15, 0.9, 3.6, D + 0.17, 1.65, STEEL, "durchreiche", name="Küche Rückwand")
    for k, col in enumerate([BERRY, (0.85, 0.85, 0.85), SAGE_D]):
        cyl(2.4 + k * 0.4, D + 0.07, 0.9, 1.02, 0.07, mat(col, 0.35, coat=0.4, metal=0.3 if k == 1 else 0), "durchreiche", name="Topf")
    sh = box(2.04, D + 0.07, 1.45, 3.56, D + 0.11, 1.62, multiplex("Y", 100.0), "durchreiche", name="Rollladen")
    A("durchreiche", 2.8, D - 0.1, 1.15)
    door_leaf(5.3, D, 0.9, 180, "kuechentuer", axis="x")
    panel(4.5, D - 0.03, 2.15, 5.2, D, 2.4, "kuechentuer", name="Schild")
    text3d("Küche", 4.85, D - 0.035, 2.275, 0.11, DARK, "kuechentuer")
    # recipe of the week, framed
    panel(1.15, D - 0.03, 1.15, 1.75, D, 1.62, "rezept", name="Rahmen")
    box(1.2, D - 0.035, 1.2, 1.7, D - 0.03, 1.57, PAPER, "rezept", name="Rezeptbild")
    for j, (dx, dz, col, sc) in enumerate([(-0.12, 0.05, (0.95, 0.75, 0.25), (2.2, 0.6)), (0.0, -0.06, (0.86, 0.2, 0.15), (1, 1)),
                                           (0.12, 0.05, (0.35, 0.62, 0.3), (1, 1)), (0.0, 0.1, (0.86, 0.45, 0.2), (2.6, 0.4))]):
        ball(1.45 + dx, D - 0.04, 1.385 + dz, 0.04, mat(col, 0.8), "rezept", scale=(sc[0], 0.2, sc[1]))
    text3d("Milas Rezept", 1.45, D - 0.04, 1.11, 0.045, DARK, "rezept")
    A("rezept", 1.45, D - 0.04, 1.4)
    # ball board ("Daumenbrett") on the west wall: drop a wooden ball into one of three tubes
    by0, by1 = 3.85, 4.75
    panel(0.0, by0, 0.22, 0.035, by1, 1.02, "daumen", name="Kugelbrett")
    tube_cols = [(0.45, 0.72, 0.38), (0.96, 0.78, 0.30), (0.92, 0.50, 0.30)]
    counts = [11, 6, 3]
    for k in range(3):
        yy = by0 + 0.17 + k * 0.28
        cyl(0.1, yy, 0.27, 0.8, 0.055, glassy(), "daumen", verts=24, name="Röhre")
        for j in range(counts[k]):
            ball(0.1, yy, 0.31 + j * 0.045, 0.024, mat(tube_cols[k], 0.4, coat=0.4), "daumen", seg=12, name="Kugel")
        panel(0.035, yy - 0.09, 0.82, 0.08, yy + 0.09, 0.98, "daumen", name="Einwurf")
        thumb_icon(0.083, yy, 0.9, k)
        A(f"tube{k}", 0.1, yy, 0.9)
    panel(0.035, by0 + 0.05, 0.2, 0.3, by1 - 0.05, 0.23, "daumen", name="Ablage")
    bowl(0.2, by0 + 0.1, 0.23, 0.09, None, "daumen", CREAM)
    for j in range(6):
        ball(0.2 + random.uniform(-0.04, 0.04), by0 + 0.1 + random.uniform(-0.04, 0.04), 0.29, 0.022, WOOD, "daumen", seg=12)
    A("daumen", 0.08, (by0 + by1) / 2, 0.9)
    # lever box next to the board, at seat height: for children who cannot throw; the tubes count both the same
    lx0, ly0, ly1 = 0.035, by1 + 0.03, by1 + 0.22
    panel(lx0, ly0, 0.36, lx0 + 0.16, ly1, 0.6, "daumen", name="Hebelkasten")
    for k, col in enumerate(tube_cols):
        ball(lx0 + 0.162, ly0 + 0.04 + k * 0.055, 0.56, 0.016, mat(col, 0.4, coat=0.4), "daumen", scale=(0.5, 1, 1), seg=12,
             name="Wahlknopf")
    pv = Vector((lx0 + 0.16, (ly0 + ly1) / 2, 0.44))
    capsule(pv, pv + Vector((0.2, -0.02, 0.12)), 0.014, WOOD_D, "daumen", name="Hebel")
    ball(*(pv + Vector((0.21, -0.02, 0.125))), 0.04, mat(BERRY, 0.4, coat=0.4), "daumen", name="Hebelknauf")
    cyl(0, 0, -0.01, 0.01, 0.03, STEEL, "daumen", verts=16, rot=(0, R(90), 0), name="Drehpunkt").location = pv
    curve_tube([(lx0 + 0.08, (ly0 + ly1) / 2, 0.6), (lx0 + 0.08, (ly0 + ly1) / 2, 0.98), (0.1, by1 - 0.08, 1.0)], 0.016,
               glassy(), "daumen", name="Kugelbahn")
    A("hebel", *(pv + Vector((0.21, -0.02, 0.125))))
    kid(8, 0.4, by0 - 0.05, 150, "reach", hid="kinder", look=(0.1, by0 + 0.17, 0.9),
        arms={"r": (0.16, by0 + 0.1, 0.86), "l": (0.32, by0 + 0.05, 0.45)})
    # tables with lunch
    for (tx0, ty0, tx1, ty1, n) in ((1.0, 1.55, 2.9, 2.3, 3), (3.3, 1.55, 5.2, 2.3, 3)):
        kid_table(tx0, ty0, tx1, ty1, 0.5, "tisch")
        for k in range(n):
            sx = tx0 + (tx1 - tx0) * (k + 0.5) / n
            for side, (sy, face) in enumerate(((ty0 - 0.3, 90), (ty1 + 0.3, -90))):
                stool(sx, sy, 0.3, CLOTH[(k + side * 3) % len(CLOTH)], "tisch")
                bowl(sx, (ty0 + 0.17) if side == 0 else (ty1 - 0.17), 0.5, 0.08, (0.92, 0.66, 0.30), "tisch")
                cup(sx + 0.13, (ty0 + 0.14) if side == 0 else (ty1 - 0.14), 0.5, CLOTH[(k + 2) % len(CLOTH)], "tisch")
        cyl((tx0 + tx1) / 2, (ty0 + ty1) / 2, 0.5, 0.62, 0.05, glassy((0.9, 0.95, 0.9)), "tisch", name="Vase")
        for j in range(5):
            ball((tx0 + tx1) / 2 + math.cos(j * 1.25) * 0.05, (ty0 + ty1) / 2 + math.sin(j * 1.25) * 0.05, 0.7, 0.025,
                 mat([OCHRE, ROSE, CREAM][j % 3], 0.6), "tisch", seg=10, name="Blume")
        cyl(tx0 + 0.35, (ty0 + ty1) / 2, 0.5, 0.66, 0.07, mat(CREAM, 0.4, coat=0.4), "tisch", name="Krug")
    seats = [(1.32, 1.25, 90), (1.95, 1.25, 90), (2.58, 1.25, 90), (1.32, 2.6, -90), (2.58, 2.6, -90),
             (3.62, 1.25, 90), (4.88, 1.25, 90), (3.62, 2.6, -90), (4.25, 2.6, -90)]
    for k, (sx, sy, face) in enumerate(seats):
        if (sx, sy) == (1.95, 2.6):
            continue
        kid(k, sx, sy, face, "sitc", hid="kinder", seat=0.3, look=(sx + 0.3, (1.55 + 2.3) / 2, 0.55))
    who("mila", 1.95, 2.6, -90, "sitc", hid="mila", seat=0.3, look=(4.3, 3.2, 1.2))
    # Samir from the parents' pool helps at the tables today
    ps = who("samir", 0.66, 1.93, 2, "hold", hid="samir", look=(1.5, 1.9, 0.6))
    mid = (Vector(ps["hand_r"]) + Vector(ps["hand_l"])) / 2
    cyl(mid.x + 0.08, mid.y, mid.z - 0.08, mid.z + 0.1, 0.07, mat(CREAM, 0.4, coat=0.4), "samir", name="Krug")
    stool(4.25, 1.25, 0.3, OCHRE, "sanne")
    who("sanne", 4.25, 1.25, 90, "sitc", hid="sanne", seat=0.3, look=(4.6, 3.3, 1.3))
    who("marek", 4.55, 3.25, -125, "hold", hid="marek", acc=("pot",), look=(3.5, 2.2, 0.6))
    plant(5.5, 0.5, 0, 1.2, pot="basket", kind="monstera")
    plant(5.5, 4.55, 0, 0.9, kind="bush")
    bunting((0.03, 1.6, 2.42), (2.3, D - 0.02, 2.42), sag=0.3)
    A("in", 0.25, 0.85, 0.0)
    A("out", W - 0.1, 0.25, 0.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, H + 0.05)
    shots = {"daumen": dict(loc=(1.4, 4.0, 0.98), target=(0.1, 4.3, 0.66), lens=32, fstop=3.5)}
    return dict(W=W, D=D, time="mittag", pts=pts, shots=shots, target=(W / 2, D / 2, 1))


def thumb_icon(x, y, z, k):
    """Thumb up / sideways / down, carved and painted, facing +x."""
    col = [(0.45, 0.72, 0.38), (0.96, 0.78, 0.30), (0.92, 0.50, 0.30)][k]
    m = mat(col, 0.45, coat=0.3)
    ball(x + 0.004, y, z - 0.01, 0.035, m, "daumen", scale=(0.35, 1, 0.8), seg=16)
    rot = {0: 0, 1: -90, 2: 180}[k]
    a = R(rot)
    dz, dy = math.cos(a) * 0.045, math.sin(a) * 0.045
    capsule((x + 0.006, y, z), (x + 0.006, y + dy, z + dz), 0.013, m, "daumen")


# ================================================================ Abholung 15:30
ABH_KIDS = [
    dict(name="Ben", animal="hase", plan=["gyb"], cube=True, jacket=SKY, shoes=BERRY, boots=True),
    dict(name="Mila", animal="fuchs", plan=["ggb"], cube=True, jacket=OCHRE, shoes=BERRY),
    dict(name="Defne", animal="katze", plan=["yg?"], cube=True, jacket=None, shoes=(0.95, 0.80, 0.45)),
    dict(name="Jonte", animal="bär", plan=["bbg"], cube=True, jacket=CLAY, shoes=SAGE, boots=True),
    dict(name="Paula", animal="ente", plan=["gyy"], cube=True, jacket=None, shoes=ROSE),
    dict(name="Emil", animal="eule", plan=["bgygg", "gbybg", "ygbbg", "bbgyg"], cube=True, jacket=SAGE, shoes=SAGE,
         boots=True),
    dict(name="Lina", animal="igel", plan=["gybgg", "ybgyg", "bgyyg", "ygbgg"], cube="gebaerden", jacket=PLUM,
         shoes=PETROL, boots=True),
]


def stair(x0, x1, y0, y1, H, hid="treppe", rise=0.2):
    """Straight multiplex stair along a west wall (x0 = wall), rising towards +y up to height H."""
    n = int(round(H / rise))
    go = (y1 - y0) / n
    # closed side panel on the room side, stepped on top
    pts = [(y0, 0.0)]
    for i in range(n):
        pts += [(y0 + i * go, (i + 1) * rise), (y0 + (i + 1) * go, (i + 1) * rise)]
    pts += [(y1, 0.0)]
    me = bpy.data.meshes.new("Wange")
    me.from_pydata([(x1 - 0.01, yy, zz) for yy, zz in pts], [], [list(range(len(pts)))])
    o = bpy.data.objects.new("Wange", me)
    scene.collection.objects.link(o)
    sol = o.modifiers.new("s", "SOLIDIFY")
    sol.thickness = 0.03
    sol.offset = 0.0
    o.data.materials.append(multiplex("X", 100.0))
    tag(o, hid)
    for i in range(n):
        ya = y0 + i * go
        z = (i + 1) * rise
        panel(x0 + 0.01, ya - 0.025, z - 0.035, x1 - 0.025, ya + go, z, hid, name="Stufe")
        box(x0 + 0.01, ya - 0.004, z - rise, x1 - 0.026, ya, z - 0.035, multiplex("Z", 100.0, face=(0.93, 0.86, 0.72)), hid,
            name="Setzstufe")
    # handrail on posts along the open side, a low second rail for small hands, a wall rail
    rail_m = mat((0.80, 0.62, 0.42), 0.45, coat=0.3, name="Handlauf")
    # rails stop where they reach the cut height of the walls
    def rail_end(hh):
        return y0 + go * 0.5 + (H - 0.02 - rise - hh) / rise * go
    for i in range(0, n + 1, 3):
        yy = y0 + i * go + go * 0.5
        zz = (i + 1) * rise
        if zz + 0.85 > H:
            break
        cyl(x1 - 0.06, yy, zz, zz + 0.85, 0.022, rail_m, hid, verts=16, name="Pfosten")
    for hh, r_, xx, nm in ((0.85, 0.025, x1 - 0.06, "Handlauf"), (0.5, 0.018, x1 - 0.06, "Kinderhandlauf"),
                           (0.7, 0.02, x0 + 0.05, "Wandhandlauf")):
        ye = rail_end(hh)
        curve_tube([(xx, y0 + go * 0.5, rise + hh), (xx, ye, H - 0.02)], r_, rail_m, hid, smooth=False, name=nm)
    # sign above: the school is upstairs
    sy = y0 + (y1 - y0) * 0.38
    sz = (sy - y0) / go * rise + 1.25
    panel(x0, sy - 0.32, sz, x0 + 0.02, sy + 0.32, sz + 0.2, hid, name="Schild")
    text3d("Schule", x0 + 0.025, sy - 0.06, sz + 0.1, 0.1, mat(PETROL, 0.5), hid, rot=(R(90), 0, R(90)), extrude=0.004)
    cone(x0 + 0.03, sy + 0.22, sz + 0.1, 0.045, 0.0, 0.08, mat(PETROL, 0.5), hid, rot=(0, 0, 0), verts=3, name="Pfeil")
    A("treppe", (x0 + x1) / 2, (y0 + y1) / 2, (y1 - y0) / 2 / go * rise + 0.5)
    A("schule_schild", x0 + 0.03, sy, sz + 0.1)


def build_abholung(v):
    W, D, H = 6.0, 4.8, 2.6
    room_base(W, D)
    wall("x", D, 0.0, W, h=H, openings=[(4.1, 5.5, 0.6, 2.0, "window")])
    wall("y", 0.0, 0.0, D + 0.18, h=H, openings=[(0.35, 1.55, 0.0, 2.2, "window")], m=WALL_ROSE, sill=False)
    box(-0.12, 1.25, 0.95, -0.05, 1.28, 1.25, STEEL, "tuer", name="Türgriff") if False else None
    capsule((0.02, 1.4, 0.8), (0.02, 1.4, 1.35), 0.015, STEEL, "tuer", name="Türgriff")
    rug_rect(0.05, 0.45, 0.9, 1.45, (0.55, 0.45, 0.35), (0.5, 0.4, 0.3), "tuer", "Y", 10.0)
    A("tuer", 0.0, 0.95, 1.1)
    wainscot("x", D, 0.0, W, h=1.0, skip=[(4.1, 5.5)])
    wainscot("x", D, 4.1, 5.5, h=0.55, ledge=False)
    wainscot("y", 0.0, 0.0, D, h=1.0, skip=[(0.35, 1.55), (1.7, D)])
    # staircase along the west wall: the school is upstairs in the same house
    stair(0.0, 0.95, 1.75, D, H)
    # Fachwand along the north wall: one Fach per child, Planwürfel on top show tomorrow's plan
    F = Wall("x", D, 0.0)
    a0, w = 1.2, 0.4
    res = fachwand(F, a0, ABH_KIDS, w)
    m = res[1]
    A("mila_fach", *F.p(a0 + 1.5 * w, 0.2, 0.85))
    A("mila_cube", *m["cube"])
    A("planwuerfel", *m["plan"])
    A("faecher", *F.p(a0 + 3.5 * w, 0.3, 1.0))
    # obelisk, smaller, with the wish box facing east
    ox, oy = 4.75, 2.45
    rug_round(ox, oy, 1.2, [CLAY, ROSE, OCHRE, SAGE, CREAM], hid="teppich")
    obelisk(ox, oy, 0.86, lit=4, board=dict(blocks=("g", None, "b", None, "y", None)))
    wy = oy + 0.15 * 0.86
    who("ayla", ox + 0.95, wy + 0.05, 178, "reach", hid="ayla", look=(ox + 0.4, wy, 0.95), arms={"r": (ox + 0.46, wy - 0.02, 0.94)})
    kid(9, ox + 1.0, oy - 0.5, 160, "stand", hid="kinder", look=(ox, oy, 1.0))
    # Papa Jonas with the phone, Mila puts her Fuchs-Cube back, Lotte comes down the stairs
    who("jonas", 1.22, 3.82, CAM + 18, "hold", hid="jonas", acc=("phone",), look=(1.4, 3.6, 0.95))
    # Mila has put her cube back and looks up at her Planwürfel: tomorrow is Garten
    pl = Vector(m["plan"])
    who("mila", 2.23, D - 0.56, 132, "point", hid="mila", look=(pl.x, pl.y, pl.z),
        arms={"r": (2.06, D - 0.42, 0.72)})
    go = (D - 1.75) / 13
    who("lotte", 0.47, 1.75 + 3.5 * go, -60, "wave", hid="lotte", z=4 * 0.2, look=(2.0, 2.4, 1.2))
    who("sanne", 3.3, 3.8, 85, "kneel", hid="sanne", look=(3.3, 4.2, 0.6))
    person(3.32, 4.22, -95, "toddler", skin=3, hair="dunkel", style="curly", top=SKY, hid="kinder", look=(3.3, 3.75, 0.9))
    plant(5.6, 0.45, 0, 1.25, pot="basket", kind="monstera")
    plant(4.4, D - 0.1, 0.6, 0.55, kind="herb")
    bunting((0.03, 1.8, 2.42), (2.6, D - 0.02, 2.42), sag=0.3)
    A("in", 0.25, 0.95, 0.0)
    A("out", W - 0.1, 0.25, 0.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, H + 0.05)
    shots = {"faecher": dict(loc=(2.12, D - 1.42, 1.16), target=(1.82, D - 0.12, 0.9), lens=24, fstop=4.0),
             "wunsch": dict(loc=(ox + 1.75, oy - 1.55, 1.2), target=(ox + 0.35, oy + 0.1, 0.95), lens=36, fstop=3.5)}
    return dict(W=W, D=D, time="nachmittag", pts=pts, shots=shots, target=(W / 2, D / 2, 1))


# ================================================================ Werkstatt Samstag
def open_co2box(x, y, z, hid="kaestchen"):
    """Opened box: sensor board, three LEDs, battery holder – nothing else."""
    m = mat((0.92, 0.60, 0.40), 0.55, coat=0.2)
    t = 0.012
    box(x - 0.1, y - 0.065, z, x + 0.1, y + 0.065, z + t, m, hid, name="Boden")
    for (a0, b0, a1, b1) in ((x - 0.1, y - 0.065, x + 0.1, y - 0.065 + t), (x - 0.1, y + 0.065 - t, x + 0.1, y + 0.065),
                             (x - 0.1, y - 0.065 + t, x - 0.1 + t, y + 0.065 - t), (x + 0.1 - t, y - 0.065 + t, x + 0.1, y + 0.065 - t)):
        box(a0, b0, z + t, a1, b1, z + 0.09, m, hid, name="Wand")
    box(x - 0.08, y - 0.045, z + t, x + 0.03, y + 0.045, z + t + 0.004, mat((0.15, 0.45, 0.25), 0.4), hid, name="Platine")
    box(x - 0.055, y - 0.02, z + t + 0.004, x - 0.015, y + 0.02, z + t + 0.03, mat((0.95, 0.95, 0.93), 0.4), hid, name="Sensor")
    for k in range(4):
        box(x - 0.05 + k * 0.009, y - 0.021, z + t + 0.03, x - 0.046 + k * 0.009, y + 0.021, z + t + 0.031, DARK, hid)
    for k, c in enumerate([(0.3, 1.0, 0.45), (1.0, 0.8, 0.2), (1.0, 0.25, 0.2)]):
        ball(x + 0.0 + k * 0.0, y - 0.03 + k * 0.03, z + t + 0.015, 0.007, mat(c, 0.3, emission=c, strength=4.0 if k == 0 else 0.1),
             hid, seg=10, name="LED")
        A(f"led{k}", x, y - 0.03 + k * 0.03, z + t + 0.02)
    for k in range(2):
        cyl(x + 0.065, y - 0.02 + k * 0.04, z + t + 0.012, z + t + 0.014, 0.012, mat((0.2, 0.2, 0.22), 0.4), hid,
            rot=(R(90), 0, R(90)), name="Batterie").location = (x + 0.065, y - 0.02 + k * 0.04, z + t + 0.014)
    curve_tube([(x + 0.03, y, z + t + 0.006), (x + 0.045, y + 0.01, z + t + 0.02), (x + 0.055, y + 0.02, z + t + 0.014)], 0.0025,
               mat((0.85, 0.2, 0.15), 0.4), hid)
    A("sensor", x - 0.035, y, z + t + 0.03)
    A("batterie", x + 0.065, y, z + t + 0.02)
    lid = box(-0.1, -0.065, 0, 0.1, 0.065, t, m, hid, name="Deckel")
    lid.location = (x + 0.0, y + 0.13, z + 0.03)
    lid.rotation_euler = (R(-70), 0, 0)


def build_werkstatt(v):
    W, D, H = 6.0, 4.8, 2.6
    room_base(W, D)
    wall("x", D, 0.0, W, h=H, openings=[(4.1, 5.5, 0.7, 2.05, "window")])
    wall("y", 0.0, 0.0, D + 0.18, h=H, openings=[(0.4, 1.3, 0.0, 2.1, "door")], m=WALL_SAGE)
    wainscot("y", 0.0, 0.0, D, h=1.0, skip=[(0.4, 1.3)])
    box(0.3, D - 0.03, 0.85, 3.8, D, 2.1, pegboard(), "lochwand", name="Lochwand")
    tools = [("hammer", 0.6), ("saege", 1.2), ("zange", 1.85), ("schrauber", 2.3), ("meter", 2.8), ("pinsel", 3.35)]
    for kind, xp in tools:
        if kind == "hammer":
            capsule((xp, D - 0.05, 1.2), (xp, D - 0.05, 1.6), 0.018, WOOD, "lochwand")
            rbox(xp - 0.08, D - 0.08, 1.6, xp + 0.08, D - 0.03, 1.66, STEEL, "lochwand", r=0.01)
        elif kind == "saege":
            box(xp - 0.25, D - 0.05, 1.25, xp + 0.15, D - 0.045, 1.42, STEEL, "lochwand", name="Säge")
            rbox(xp + 0.15, D - 0.07, 1.25, xp + 0.27, D - 0.03, 1.45, mat(BERRY, 0.4), "lochwand", r=0.02)
        elif kind == "zange":
            for sd in (-1, 1):
                capsule((xp, D - 0.05, 1.45), (xp + sd * 0.05, D - 0.05, 1.2), 0.012, mat(SKY, 0.4), "lochwand")
        elif kind == "schrauber":
            for k in range(3):
                capsule((xp + k * 0.07, D - 0.05, 1.3), (xp + k * 0.07, D - 0.05, 1.5), 0.015,
                        mat([OCHRE, BERRY, SAGE][k], 0.4), "lochwand")
        elif kind == "meter":
            cyl(xp, D - 0.06, 1.35, 1.45, 0.06, mat(OCHRE, 0.4), "lochwand", rot=(R(90), 0, 0)).location = (xp, D - 0.06, 1.4)
        elif kind == "pinsel":
            for k in range(3):
                capsule((xp + k * 0.06, D - 0.05, 1.25), (xp + k * 0.06, D - 0.05, 1.5), 0.01, WOOD, "lochwand")
    shelf("x", D, 0.3, 3.8, h=0.75, rows=2, hid="regal", fill=False)
    for k in range(10):
        box(0.45 + k * 0.33, D - 0.3, 0.385, 0.6 + k * 0.33, D - 0.08, 0.385 + random.uniform(0.05, 0.25),
            multiplex("X", 100.0), "regal", bev=0.003, name="Reststück")
    # poster
    panel(0.0, 2.2, 1.25, 0.02, 3.75, 2.05, "plakat", name="Plakat")
    box(0.02, 2.25, 1.3, 0.025, 3.7, 2.0, PAPER, "plakat", name="Plakatpapier")
    text3d("Wir messen den Raum,", 0.03, 2.97, 1.78, 0.11, DARK, "plakat", rot=(R(90), 0, R(90)))
    text3d("nicht das Kind.", 0.03, 2.97, 1.6, 0.11, mat(BERRY, 0.5), "plakat", rot=(R(90), 0, R(90)))
    for k, c in enumerate([(0.3, 0.8, 0.4), (0.95, 0.75, 0.2), (0.9, 0.3, 0.25)]):
        ball(0.03, 2.75 + k * 0.22, 1.42, 0.05, mat(c, 0.5), "plakat", scale=(0.3, 1, 1))
    A("plakat", 0.03, 2.97, 1.65)
    # workbench
    bx0, by0, bx1, by1, bh = 1.5, 2.0, 4.0, 2.85, 0.78
    box(bx0, by0, bh - 0.06, bx1, by1, bh, OAK, "werkbank", bev=0.008, name="Werkbank")
    for lx, ly in ((bx0 + 0.1, by0 + 0.1), (bx1 - 0.1, by0 + 0.1), (bx0 + 0.1, by1 - 0.1), (bx1 - 0.1, by1 - 0.1)):
        box(lx - 0.04, ly - 0.04, 0, lx + 0.04, ly + 0.04, bh - 0.06, OAK, "werkbank", name="Bein")
    panel(bx0 + 0.1, by0 + 0.08, 0.2, bx1 - 0.1, by1 - 0.08, 0.23, "werkbank", name="Ablage")
    # soldering station, boards, finished boxes
    rbox(2.1, 2.55, bh, 2.35, 2.75, bh + 0.08, mat((0.25, 0.27, 0.3), 0.4), "loeten", r=0.01, name="Lötstation")
    curve_tube([(2.2, 2.55, bh + 0.04), (2.35, 2.4, bh + 0.02), (2.45, 2.3, bh + 0.05)], 0.006, DARK, "loeten")
    for k in range(3):
        box(2.5 + k * 0.12, 2.2, bh, 2.6 + k * 0.12, 2.28, bh + 0.004, mat((0.15, 0.45, 0.25), 0.4), "loeten", name="Platine")
    A("loeten", 2.35, 2.45, bh + 0.05)
    for k, led in enumerate(["green", "yellow", "red"]):
        co2box(3.15 + k * 0.24, 2.6, bh, face=-90, led=led, hid="kaestchen", s=0.95, key=f"box{k}")
    open_co2box(2.95, 2.25, bh)
    A("kaestchen", 3.0, 2.3, bh + 0.1)
    cyl(1.8, 2.6, bh, bh + 0.1, 0.04, mat(SKY, 0.4, coat=0.4), "werkbank", name="Becher")
    # people around the bench
    who("lotte", 2.45, 3.15, -95, "reach", hid="lotte", acc=("iron",), look=(2.55, 2.3, bh))
    who("jonas", 3.1, 3.25, -110, "point", hid="jonas", look=(2.6, 2.3, bh))
    who("ayla", 1.95, 1.55, 70, "reach", hid="ayla", look=(2.2, 2.4, bh))
    # low painting table for the little ones
    tx, ty = 4.75, 1.3
    kid_table(tx - 0.55, ty - 0.35, tx + 0.55, ty + 0.35, 0.5, "maltisch")
    for k, (c, led) in enumerate([(ROSE, "green"), (SKY, "green"), (OCHRE, "yellow")]):
        rbox(tx - 0.35 + k * 0.32, ty - 0.07, 0.5, tx - 0.17 + k * 0.32, ty + 0.06, 0.62, mat(c, 0.55, coat=0.2), "maltisch",
             r=0.012, name="Gehäuse")
    for k in range(4):
        cyl(tx - 0.4 + k * 0.12, ty + 0.22, 0.5, 0.56, 0.03, mat(CLOTH[k], 0.5, coat=0.4), "maltisch", name="Farbtopf")
    who("mila", tx - 0.35, ty - 0.62, 75, "reach", hid="mila", acc=("brush",), look=(tx - 0.3, ty, 0.55))
    kid(0, tx + 0.45, ty - 0.65, 110, "reach", hid="kinder", look=(tx + 0.3, ty, 0.55))
    # coffee and cake
    kid_table(4.6, 3.75, 5.6, 4.45, 0.75, "kaffee")
    cyl(5.0, 4.1, 0.75, 0.85, 0.15, mat((0.55, 0.32, 0.2), 0.6), "kaffee", verts=32, name="Kuchen")
    cyl(5.0, 4.1, 0.85, 0.87, 0.155, mat(CREAM, 0.5), "kaffee", verts=32, name="Guss")
    for k in range(4):
        cup(4.75 + k * 0.17, 3.9, 0.75, CLOTH[k], "kaffee")
    cyl(5.35, 4.25, 0.75, 0.97, 0.06, mat(PETROL, 0.3, coat=0.5), "kaffee", name="Kanne")
    plant(5.65, 0.45, 0, 1.2, pot="terra", kind="tree")
    bunting((0.03, 0.4, 2.42), (3.0, D - 0.02, 2.42), sag=0.35)
    A("in", 0.25, 0.85, 0.0)
    A("out", W - 0.1, 0.25, 0.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, H + 0.05)
    shots = {"kaestchen": dict(loc=(3.12, 1.72, 1.28), target=(2.98, 2.3, 0.8), lens=40, fstop=3.5)}
    return dict(W=W, D=D, time="tag", pts=pts, shots=shots, target=(W / 2, D / 2, 1))


# ================================================================ outside
GRASS = None


def grass_m():
    return mat((0.50, 0.66, 0.36), 0.9, noise=0.14, nscale=6.0, name="Wiese")


def larch(axis):
    return stripes((0.74, 0.52, 0.32), (0.62, 0.42, 0.25), 8.0, axis, 0.55, 0.6, 0.0)


def tree(x, y, h=3.0, r=1.2, apples=False, hid=None, s=1.0):
    capsule((x, y, 0), (x, y, h * 0.65), 0.1 * s, WOOD_D, hid, taper=0.7, name="Stamm")
    for k in range(16):
        a = k * 2.399
        el = random.uniform(-0.3, 1.0)
        d = Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el)))
        c = Vector((x, y, h)) + d * r * 0.55
        ball(*c, r * random.uniform(0.42, 0.58), random.choice([LEAF, LEAF2, mat((0.40, 0.58, 0.30), 0.7, noise=0.15)]),
             hid, seg=16, name="Krone")
    if apples:
        for k in range(22):
            a = k * 2.399
            el = random.uniform(-0.5, 0.8)
            d = Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el)))
            ball(*(Vector((x, y, h)) + d * r * 1.02), 0.07 * s, mat((0.82, 0.15, 0.12), 0.35, coat=0.4), hid, seg=10, name="Apfel")


def balance_bike(x, y, face, color=BERRY, hid=None):
    f = fvec(face)
    s = f.cross(UP)
    for sd in (-1, 1):
        c = Vector((x, y, 0.15)) + f * sd * 0.28
        torus(*c, 0.13, 0.03, DARK, hid, rot=(R(90), 0, R(face)), seg=24, name="Rad")
    capsule(Vector((x, y, 0.15)) - f * 0.28, Vector((x, y, 0.36)) + f * 0.18, 0.025, mat(color, 0.4, coat=0.4), hid)
    capsule(Vector((x, y, 0.15)) + f * 0.28, Vector((x, y, 0.5)) + f * 0.22, 0.02, mat(color, 0.4, coat=0.4), hid)
    capsule(Vector((x, y, 0.5)) + f * 0.22 - s * 0.14, Vector((x, y, 0.5)) + f * 0.22 + s * 0.14, 0.02, DARK, hid)
    rbox(-0.1, -0.05, -0.02, 0.1, 0.05, 0.02, mat((0.2, 0.18, 0.16), 0.5), hid, r=0.015,
         rot=(0, 0, R(face))).location = Vector((x, y, 0.4)) - f * 0.05


def build_aussen(v):
    W, D = 15.0, 12.0
    room_base(W, D, floor_m=grass_m())
    # path to the corner entrance
    box(10.4, 0.0, 0.0, 11.5, 6.4, 0.015, tiles("X", (0.86, 0.80, 0.70), (0.7, 0.65, 0.58), 0.4, axis_v="Y"), "weg", name="Weg")
    box(10.0, 6.4, 0.0, 11.5, 8.4, 0.015, tiles("X", (0.86, 0.80, 0.70), (0.7, 0.65, 0.58), 0.4, axis_v="Y"), "weg", name="Weg")
    # ONE house: Kita on the ground floor, Schule upstairs, the Lab as a one-storey wing, the hall behind the corner
    bx0, by0, bx1, by1, bh = 0.6, 6.6, 10.0, 11.8, 6.4
    hx0, hx1, hd, hh = 8.35, 9.95, 1.7, 3.0          # hall bay open to the south (seen through its glass front)
    body = mat((0.78, 0.60, 0.42), 0.7)
    box(bx0, by0, 0, hx0, by1, bh, body, "haus", name="Haus")
    box(hx1, by0, 0, bx1, by1, bh, body, "haus", name="Haus")
    box(hx0, by0 + hd, 0, hx1, by1, bh, body, "haus", name="Haus")
    box(hx0, by0, hh, hx1, by0 + hd, bh, body, "haus", name="Haus")
    box(bx0, by0 - 0.03, 0, hx0, by0, bh, larch("X"), "haus", name="Fassade Süd")
    box(hx1, by0 - 0.03, 0, bx1, by0, bh, larch("X"), "haus", name="Fassade Süd")
    box(hx0, by0 - 0.03, hh, hx1, by0, bh, larch("X"), "haus", name="Fassade Süd")
    box(bx1, by0, 0, bx1 + 0.03, by1, bh, larch("Y"), "haus", name="Fassade Ost")
    glow = mat((1.0, 0.86, 0.62), 0.4, emission=(1.0, 0.78, 0.50), strength=3.0, name="Fensterlicht")
    sage_frame = mat(SAGE_D, 0.5, name="Rahmen Schule")
    for fl, (zl, zh) in enumerate(((0.45, 2.7), (3.75, 5.75))):
        fm = None if fl == 0 else sage_frame
        for xw in (1.1, 3.6, 6.1):
            box(xw, by0 - 0.06, zl, xw + 2.1, by0 - 0.02, zh, glow, "haus", name="Fenster")
            for (a0, a1, c0, c1) in ((xw - 0.07, xw + 2.17, zh, zh + 0.08), (xw - 0.07, xw + 2.17, zl - 0.08, zl),
                                     (xw - 0.07, xw, zl, zh), (xw + 2.1, xw + 2.17, zl, zh), (xw + 1.02, xw + 1.08, zl, zh)):
                if fm:
                    box(a0, by0 - 0.09, c0, a1, by0 - 0.02, c1, fm, "haus", name="Rahmen")
                else:
                    panel(a0, by0 - 0.09, c0, a1, by0 - 0.02, c1, "haus", name="Rahmen")
        for yw in (8.8, 10.4):
            if fl == 0 and yw > 8.6:
                continue  # ground floor east side is covered by the Lab wing
            box(bx1 + 0.02, yw, zl, bx1 + 0.06, yw + 1.1, zh, glow, "haus", name="Fenster")
            for (a0, a1, c0, c1) in ((yw - 0.07, yw + 1.17, zh, zh + 0.08), (yw - 0.07, yw + 1.17, zl - 0.08, zl),
                                     (yw - 0.07, yw, zl, zh), (yw + 1.1, yw + 1.17, zl, zh)):
                if fm:
                    box(bx1 + 0.02, a0, c0, bx1 + 0.09, a1, c1, fm, "haus", name="Rahmen")
                else:
                    panel(bx1 + 0.02, a0, c0, bx1 + 0.09, a1, c1, "haus", name="Rahmen")
    # a band between the floors and the school's name upstairs
    panel(bx0 - 0.05, by0 - 0.1, 3.12, bx1 + 0.1, by0 - 0.0, 3.3, "haus", freq=40.0, name="Geschossband")
    panel(bx1, by0, 3.12, bx1 + 0.1, by1, 3.3, "haus", freq=40.0, name="Geschossband")
    text3d("Schule", 4.65, by0 - 0.1, 6.06, 0.44, mat(PETROL, 0.5), "haus", extrude=0.014, name="Schrift Schule")
    # kids' drawings in the ground floor windows
    for k, xw in enumerate((1.4, 2.3, 3.9, 6.6, 7.4)):
        box(xw, by0 - 0.07, 1.4, xw + 0.45, by0 - 0.065, 1.75, PAPER, "haus", name="Bild im Fenster")
        ball(xw + 0.22, by0 - 0.075, 1.58, 0.08, mat(CLOTH[k], 0.8), "haus", scale=(1, 0.2, 1))
    # the hall behind a glass front: floor, rug and the obelisk, the heart of the house
    box(hx0, by0, 0.0, hx1, by0 + hd, 0.04, planks(), "halle", name="Hallenboden")
    box(hx0 + 0.01, by0 + hd - 0.02, 0.04, hx1 - 0.01, by0 + hd, hh, mat((0.70, 0.78, 0.64), 0.8), "halle", name="Hallenwand")
    for xx in (hx0, hx1 - 0.02):
        box(xx, by0, 0.04, xx + 0.02, by0 + hd, hh, mat((0.93, 0.86, 0.76), 0.8), "halle", name="Hallenwand")
    box(hx0, by0, hh - 0.02, hx1, by0 + hd, hh, mat(CREAM, 0.8), "halle", name="Hallendecke")
    cyl((hx0 + hx1) / 2, by0 + 0.95, 0.04, 0.06, 0.62, fabric(ROSE, 0.5, 0.95, 0.12), "halle", verts=48, name="Teppich")
    ox_, oy_ = (hx0 + hx1) / 2, by0 + 0.95
    panel(ox_ - 0.2, oy_ - 0.2, 0.06, ox_ + 0.2, oy_ + 0.2, 1.75, "halle", name="Obelisk")
    cone(ox_, oy_, 1.92, 0.3, 0.01, 0.34, multiplex("Z", 100.0), "halle", rot=(0, 0, R(45)), verts=4, name="Spitze")
    for k, c in enumerate([(0.96, 0.76, 0.30), (0.82, 0.18, 0.15), (0.36, 0.62, 0.86), (0.48, 0.68, 0.42)]):
        cyl(0, 0, -0.006, 0.006, 0.06, mat(c, 0.45, emission=c, strength=0.6), "halle", verts=20, rot=(R(90), 0, 0),
            name="Plättchen").location = (ox_, oy_ - 0.206, 1.62 - k * 0.15)
    lantern(ox_ + 0.45, oy_ + 0.3, hh - 0.35, 0.12)
    kid(4, ox_ - 0.45, oy_ - 0.35, 60, "sit", hid="halle", z=0.06, look=(ox_, oy_, 1.0))
    kid(7, ox_ + 0.48, oy_ - 0.4, 120, "sit", hid="halle", z=0.06, look=(ox_, oy_, 1.0))
    post_m = mat((0.90, 0.78, 0.58), 0.5, noise=0.05, name="Pfosten")
    for xx in (hx0 + 0.02, (hx0 + hx1) / 2 - 0.025, hx1 - 0.07):
        box(xx, by0 - 0.09, 0.0, xx + 0.05, by0 - 0.02, hh - 0.08, post_m, "halle", name="Pfosten")
    box(hx0, by0 - 0.09, hh - 0.08, hx1, by0 - 0.02, hh, post_m, "halle", name="Riegel")
    A("halle", ox_, by0 + 0.3, 1.5)
    # corner entrance on the east side with canopy and sign
    box(bx1 + 0.02, 6.85, 0, bx1 + 0.06, 8.05, 2.3, glassy((0.85, 0.9, 0.85)), "eingang", name="Glastür")
    box(bx1 + 0.01, 6.85, 0, bx1 + 0.05, 8.05, 2.3, glow, "eingang", name="Eingang Licht")
    for (a0, a1, c0, c1) in ((6.78, 8.12, 2.3, 2.38), (6.78, 6.85, 0, 2.3), (8.05, 8.12, 0, 2.3), (7.42, 7.48, 0, 2.3)):
        panel(bx1 + 0.02, a0, c0, bx1 + 0.1, a1, c1, "eingang", name="Rahmen")
    panel(bx1, 6.3, 2.6, bx1 + 1.6, 8.7, 2.78, "eingang", name="Vordach")
    for yy in (6.4, 8.5):
        capsule((bx1 + 1.5, yy, 0), (bx1 + 1.5, yy, 2.6), 0.05, WOOD, "eingang")
    text3d("Bildungshaus", bx1 + 1.62, 7.45, 2.69, 0.16, mat(CREAM, 0.5), "eingang", rot=(R(90), 0, R(90)), extrude=0.01)
    A("kita_entrance", bx1 + 0.3, 7.45, 1.5)
    A("eingang", bx1 + 0.3, 7.45, 1.4)
    # the Lab: a one-storey wing next to the entrance, big workshop windows, green roof with solar
    lx0, ly0, lx1, ly1, lh = bx1, 8.7, 13.4, by1, 3.3
    box(lx0, ly0, 0, lx1, ly1, lh, body, "lab", name="Lab")
    box(lx0, ly0 - 0.03, 0, lx1, ly0, lh, larch("X"), "lab", name="Fassade Lab")
    box(lx1, ly0, 0, lx1 + 0.03, ly1, lh, larch("Y"), "lab", name="Fassade Lab")
    labglow = mat((0.92, 0.95, 0.96), 0.3, emission=(0.88, 0.94, 0.98), strength=2.2, name="Lablicht")
    for (xa, xb) in ((10.35, 11.75), (11.95, 13.05)):
        box(xa, ly0 - 0.06, 0.5, xb, ly0 - 0.02, 2.55, labglow, "lab", name="Fenster")
        for (a0, a1, c0, c1) in ((xa - 0.07, xb + 0.07, 2.55, 2.63), (xa - 0.07, xb + 0.07, 0.42, 0.5), (xa - 0.07, xa, 0.5, 2.55),
                                 (xb, xb + 0.07, 0.5, 2.55), ((xa + xb) / 2 - 0.03, (xa + xb) / 2 + 0.03, 0.5, 2.55)):
            panel(a0, ly0 - 0.09, c0, a1, ly0 - 0.02, c1, "lab", name="Rahmen")
    for (ya, yb) in ((9.1, 10.3), (10.55, 11.5)):
        box(lx1 + 0.02, ya, 0.5, lx1 + 0.06, yb, 2.55, labglow, "lab", name="Fenster")
        for (a0, a1, c0, c1) in ((ya - 0.07, yb + 0.07, 2.55, 2.63), (ya - 0.07, yb + 0.07, 0.42, 0.5), (ya - 0.07, ya, 0.5, 2.55),
                                 (yb, yb + 0.07, 0.5, 2.55)):
            panel(lx1 + 0.02, a0, c0, lx1 + 0.09, a1, c1, "lab", name="Rahmen")
    text3d("Lab", (lx0 + lx1) / 2 + 0.2, ly0 - 0.1, 2.96, 0.42, mat(PETROL, 0.5), "lab", extrude=0.014, name="Schrift Lab")
    panel(lx0 - 0.1, ly0 - 0.1, lh, lx1 + 0.1, ly1 + 0.1, lh + 0.2, "lab", freq=40.0, name="Dachrand")
    box(lx0 + 0.1, ly0 + 0.1, lh + 0.2, lx1 - 0.1, ly1 - 0.1, lh + 0.26, mat((0.55, 0.62, 0.36), 0.9, noise=0.25, nscale=4.0),
        "lab", name="Gründach")
    for j in range(2):
        p = box(-0.75, -0.48, -0.02, 0.75, 0.48, 0.02, mat((0.18, 0.25, 0.38), 0.25, coat=0.6), "lab", name="Solar")
        p.location = (10.95 + j * 1.65, 10.6, lh + 0.55)
        p.rotation_euler = (R(-25), 0, 0)
    A("lab", (lx0 + lx1) / 2 + 0.2, ly0 - 0.05, 1.6)
    panel(12.0, 8.15, 0.0, 13.2, 8.5, 0.42, "lab", name="Bank")
    # green roof with a parapet and solar panels
    panel(bx0 - 0.1, by0 - 0.1, bh, bx1 + 0.1, by1 + 0.1, bh + 0.25, "haus", freq=40.0, name="Dachrand")
    box(bx0 + 0.1, by0 + 0.1, bh + 0.25, bx1 - 0.1, by1 - 0.1, bh + 0.32, mat((0.55, 0.62, 0.36), 0.9, noise=0.25, nscale=4.0),
        "haus", name="Gründach")
    for k in range(3):
        for j in range(4):
            p = box(-0.8, -0.5, -0.02, 0.8, 0.5, 0.02, mat((0.18, 0.25, 0.38), 0.25, coat=0.6), "haus", name="Solar")
            p.location = (2.0 + j * 2.0, 8.6 + k * 1.15, bh + 0.65)
            p.rotation_euler = (R(-25), 0, 0)
    for k in range(10):
        ball(random.uniform(1, 9.5), random.uniform(7, 11.4), bh + 0.32, random.uniform(0.15, 0.3),
             mat(random.choice([(0.85, 0.75, 0.4), (0.75, 0.5, 0.55), (0.6, 0.7, 0.4)]), 0.9), "haus", scale=(1, 1, 0.4), seg=12)
    A("dach", 5.3, 9.2, bh + 0.6)
    A("schule", 4.65, by0 - 0.05, 4.75)
    A("kita", 4.65, by0 - 0.05, 1.6)
    # garden: sandbox, apple tree, raised beds, play tower, fence
    for (a0, b0, a1, b1) in ((1.5, 2.0, 4.0, 2.2), (1.5, 3.8, 4.0, 4.0), (1.5, 2.0, 1.7, 4.0), (3.8, 2.0, 4.0, 4.0)):
        panel(a0, b0, 0, a1, b1, 0.3, "sandkasten", name="Sandkasten")
    box(1.7, 2.2, 0, 3.8, 3.8, 0.22, mat((0.92, 0.82, 0.62), 0.95, noise=0.15, nscale=30), "sandkasten", name="Sand")
    cyl(2.2, 3.3, 0.22, 0.42, 0.1, mat(BERRY, 0.4, coat=0.4), "sandkasten", name="Eimer")
    kid(0, 2.4, 2.8, 30, "sit", hid="kinder", z=0.22, look=(3.0, 3.1, 0.3))
    kid(6, 3.2, 3.35, -120, "sit", hid="kinder", z=0.22, look=(2.6, 2.9, 0.4), acc=("beanie",))
    tree(6.6, 3.6, 3.1, 1.25, apples=True, hid="baum")
    A("baum", 6.6, 3.6, 3.4)
    for (a0, a1) in ((1.0, 3.0), (3.4, 5.4)):
        panel(a0, 5.0, 0, a1, 5.8, 0.5, "beete", name="Hochbeet")
        box(a0 + 0.05, 5.05, 0.4, a1 - 0.05, 5.75, 0.48, mat((0.32, 0.22, 0.15), 0.9), "beete", name="Erde")
        for k in range(6):
            px = a0 + 0.2 + k * (a1 - a0 - 0.4) / 5
            ball(px, 5.4, 0.6, 0.13, random.choice([LEAF, LEAF2]), "beete", seg=12, scale=(1, 1, 0.8))
            if k % 2:
                ball(px + 0.06, 5.25, 0.62, 0.045, mat((0.86, 0.16, 0.1), 0.35, coat=0.4), "beete", seg=10)
    ball(5.0, 5.4, 0.58, 0.16, mat((0.92, 0.52, 0.15), 0.5), "beete", scale=(1.1, 1.1, 0.8), seg=16, name="Kürbis")
    A("beete", 3.2, 5.4, 0.7)
    A("hochbeete", 3.2, 5.4, 0.7)
    tx, ty = 13.0, 3.0
    for (px, py) in ((tx - 0.6, ty - 0.6), (tx + 0.6, ty - 0.6), (tx - 0.6, ty + 0.6), (tx + 0.6, ty + 0.6)):
        box(px - 0.05, py - 0.05, 0, px + 0.05, py + 0.05, 2.4, OAK, "turm", name="Pfosten")
    panel(tx - 0.65, ty - 0.65, 1.2, tx + 0.65, ty + 0.65, 1.25, "turm", name="Podest")
    cone(tx, ty, 2.65, 1.0, 0.02, 0.6, mat(BERRY, 0.6), "turm", rot=(0, 0, R(45)), verts=4, name="Dach", smooth=False)
    sl = box(-0.25, 0, -0.02, 0.25, 2.2, 0.02, STEEL, "turm", name="Rutsche")
    sl.location = (tx, ty - 0.65 - 1.0, 0.62)
    sl.rotation_euler = (R(-33), 0, 0)
    sl.location = (tx, ty - 0.65 - 0.92, 0.6)
    kid(3, tx, ty, -60, "wave", hid="kinder", z=1.25, look=(11, 2, 1))
    for x in [i * 0.16 for i in range(int(9.9 / 0.16))]:
        box(x, 0.06, 0, x + 0.07, 0.1, 0.75, mat((0.93, 0.9, 0.84), 0.6), "zaun", name="Latte")
    for x in [i * 0.16 + 11.7 for i in range(int(3.2 / 0.16))]:
        box(x, 0.06, 0, x + 0.07, 0.1, 0.75, mat((0.93, 0.9, 0.84), 0.6), "zaun", name="Latte")
    for y in [i * 0.16 for i in range(int(6.5 / 0.16))]:
        box(0.06 - 0.2, y, 0, 0.1 - 0.2, y + 0.07, 0.75, mat((0.93, 0.9, 0.84), 0.6), "zaun", name="Latte")
    for (a0, a1) in ((0.0, 9.9), (11.7, 14.9)):
        box(a0, 0.03, 0.25, a1, 0.06, 0.32, mat((0.93, 0.9, 0.84), 0.6), "zaun")
        box(a0, 0.03, 0.55, a1, 0.06, 0.62, mat((0.93, 0.9, 0.84), 0.6), "zaun")
    for k in range(9):
        ball(0.25 + random.uniform(0, 0.3), 0.7 + k * 0.62, 0.45, random.uniform(0.35, 0.5), random.choice([LEAF, LEAF2]), "zaun",
             seg=14)
    for k, c in enumerate([BERRY, SKY, OCHRE]):
        balance_bike(12.0 + k * 0.45, 6.9 + k * 0.1, 80, c, "eingang")
    # Papa and Mila on the way in, Sanne waves at the door
    meet = Vector((11.08, 3.5, 0.72))
    who("jonas", 11.25, 3.35, 85, "walk", hid="jonas", arms={"l": meet}, look=(10.5, 7.5, 1.6))
    who("mila", 10.85, 3.45, 85, "walk", hid="mila", arms={"r": meet}, look=(10.5, 7.5, 1.2), acc=("beanie",))
    who("sanne", 10.55, 8.0, -50, "wave", hid="sanne", look=(11, 3.4, 1.0))
    plant(9.4, 6.2, 0, 1.0, pot="terra", kind="bush")
    tree(14.45, 10.9, 3.5, 0.95, hid="baum2")
    A("kita_window", 4.6, by0 - 0.05, 1.6)
    A("kita_roof", 5.3, 9.2, bh + 0.5)
    A("in", 11.0, 0.3, 0.0)
    A("out", 10.3, 7.4, 0.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, 0.3) + box_corners(bx0, by0, 0, bx1 + 1.7, by1, bh + 1.0) + [(14.45, 10.9, 4.6)]
    return dict(W=W, D=D, time="aussen", pts=pts, shots={}, target=(W / 2, D / 2, 1), aspect=0.8)


def build_ausblick(v):
    W, D = 30.0, 22.0
    random.seed(11)
    room_base(W, D, floor_m=grass_m(), base_m=multiplex("Z", 8.0))
    road = mat((0.80, 0.78, 0.74), 0.9, name="Straße")
    box(-0.2, 13.0, 0.0, W, 15.8, 0.03, road, None, name="Straße")
    box(20.2, 0.0, 0.0, 23.0, D + 0.2, 0.031, road, None, name="Straße")
    walk = mat((0.88, 0.85, 0.80), 0.9, name="Gehweg")
    box(-0.2, 12.2, 0.0, 20.2, 13.0, 0.04, walk, None, name="Gehweg")
    box(19.4, 0.0, 0.0, 20.2, 12.2, 0.04, walk, None, name="Gehweg")
    box(14.2, 0.0, 0.0, 15.0, 5.0, 0.035, walk, "garten", name="Weg")

    def house(x0, y0, x1, y1, h, color, hid, win=(0.97, 0.94, 0.86), floors=None, roof=None):
        box(x0, y0, 0, x1, y1, h, mat(color, 0.75), hid, name="Haus")
        fl = floors or max(1, int(h / 3.2))
        for f in range(fl):
            z = 0.9 + f * (h - 0.6) / fl
            box(x0 + 0.4, y0 - 0.02, z, x1 - 0.4, y0, z + 1.2, stripes(win, color, 0.9, "X", 0.45, 0.5, 0.0), hid, name="Fenster")
            box(x1, y0 + 0.4, z, x1 + 0.02, y1 - 0.4, z + 1.2, stripes(win, color, 0.9, "Y", 0.45, 0.5, 0.0), hid, name="Fenster")
        if roof:
            box(x0 + 0.2, y0 + 0.2, h, x1 - 0.2, y1 - 0.2, h + 0.15, mat(roof, 0.9, noise=0.2, nscale=3.0), hid, name="Dach")

    # the Bildungshaus: ONE house. Kita on the ground floor, Schule upstairs, the Lab as a wing, the hall at the corner
    hx0, hy0, hx1, hy1, hh = 4.0, 5.0, 15.0, 10.5, 6.4
    box(hx0, hy0, 0, hx1, hy1, hh, larch("X"), "haus", name="Haus")
    box(hx1, hy0, 0, hx1 + 0.03, hy1, hh, larch("Y"), "haus", name="Haus")
    glow = mat((1.0, 0.86, 0.62), 0.4, emission=(1.0, 0.80, 0.55), strength=1.4)
    glow_s = mat((0.96, 0.92, 0.80), 0.4, emission=(0.95, 0.90, 0.78), strength=1.2)
    for fl, (zl, zh) in enumerate(((0.5, 2.6), (3.7, 5.7))):
        gm = glow if fl == 0 else glow_s
        for xw in (4.6, 7.1, 9.6):
            box(xw, hy0 - 0.03, zl, xw + 2.0, hy0, zh, gm, "kita" if fl == 0 else "schule", name="Fenster")
        for yw in (6.0, 8.2):
            box(hx1 + 0.03, yw, zl, hx1 + 0.06, yw + 1.4, zh, gm, "kita" if fl == 0 else "schule", name="Fenster")
        if fl == 1:
            box(12.1, hy0 - 0.03, zl, 14.1, hy0, zh, gm, "schule", name="Fenster")
    # the hall: tall glass front at the corner, behind it the obelisk
    box(12.0, hy0 - 0.05, 0.05, 14.4, hy0 - 0.02, 3.0, mat((0.98, 0.90, 0.70), 0.3, emission=(1.0, 0.84, 0.55), strength=2.2),
        "halle", name="Hallenfenster")
    for xx in (12.0, 12.8, 13.6, 14.35):
        box(xx, hy0 - 0.08, 0.0, xx + 0.07, hy0 - 0.03, 3.05, mat(BIRCH, 0.5), "halle", name="Pfosten")
    panel(11.9, hy0 - 1.4, 3.05, 14.6, hy0 - 0.02, 3.2, "halle", freq=30.0, name="Vordach")
    box(4.0, hy0 - 0.12, 3.05, 11.9, hy0 - 0.03, 3.25, mat(BIRCH, 0.5), "haus", name="Geschossband")
    box(4.0, 5.0, 6.4, 15.0, 10.5, 6.6, mat((0.55, 0.62, 0.36), 0.9, noise=0.25, nscale=3.0), "haus", name="Gründach")
    for k in range(2):
        for j in range(4):
            sp = box(-0.9, -0.55, -0.02, 0.9, 0.55, 0.02, mat((0.18, 0.25, 0.38), 0.25, coat=0.6), "haus", name="Solar")
            sp.location = (5.6 + j * 2.4, 7.4 + k * 1.6, 7.0)
            sp.rotation_euler = (R(-25), 0, 0)
    # the Lab wing, one storey, east of the corner
    lx0, ly0, lx1, ly1, lh = 15.0, 6.6, 17.6, 10.5, 3.4
    box(lx0, ly0, 0, lx1, ly1, lh, larch("X"), "lab", name="Lab")
    box(lx1, ly0, 0, lx1 + 0.03, ly1, lh, larch("Y"), "lab", name="Lab")
    labglow = mat((0.92, 0.95, 0.96), 0.3, emission=(0.88, 0.94, 0.98), strength=1.6, name="Lablicht")
    box(15.4, ly0 - 0.03, 0.5, 17.2, ly0, 2.7, labglow, "lab", name="Fenster")
    box(lx1 + 0.03, 7.0, 0.5, lx1 + 0.06, 10.1, 2.7, labglow, "lab", name="Fenster")
    box(lx0, ly0, lh, lx1, ly1, lh + 0.2, mat((0.55, 0.62, 0.36), 0.9, noise=0.25, nscale=3.0), "lab", name="Gründach")
    sp = box(-0.8, -0.5, -0.02, 0.8, 0.5, 0.02, mat((0.18, 0.25, 0.38), 0.25, coat=0.6), "lab", name="Solar")
    sp.location = (16.3, 9.2, lh + 0.55)
    sp.rotation_euler = (R(-25), 0, 0)
    # garden in front: apple tree, raised beds, sandbox, fence
    tree(9.5, 2.4, 3.0, 1.2, apples=True, hid="garten")
    for (a0, b0) in ((5.0, 1.5), (6.4, 1.5), (5.0, 3.0)):
        panel(a0, b0, 0, a0 + 1.0, b0 + 0.6, 0.45, "garten")
        box(a0 + 0.05, b0 + 0.05, 0.4, a0 + 0.95, b0 + 0.55, 0.47, mat((0.40, 0.55, 0.30), 0.9, noise=0.3), "garten")
    for (a0, b0, a1, b1) in ((11.5, 1.2, 13.5, 1.4), (11.5, 3.0, 13.5, 3.2), (11.5, 1.2, 11.7, 3.2), (13.3, 1.2, 13.5, 3.2)):
        panel(a0, b0, 0, a1, b1, 0.3, "garten")
    box(11.7, 1.4, 0, 13.3, 3.0, 0.22, mat((0.92, 0.82, 0.62), 0.95, noise=0.15, nscale=30), "garten", name="Sand")
    for x in [i * 0.4 for i in range(int(19.0 / 0.4))]:
        if 13.9 < x < 15.1:
            continue
        box(x + 0.2, 0.25, 0, x + 0.3, 0.32, 0.9, mat((0.93, 0.9, 0.84), 0.6), "garten", name="Latte")
    for (a0, a1) in ((0.2, 14.1), (15.2, 19.3)):
        box(a0, 0.22, 0.4, a1, 0.25, 0.5, mat((0.93, 0.9, 0.84), 0.6), "garten", name="Zaun")
    text3d("Schule", 8.6, hy0 - 0.06, 6.08, 0.56, mat(PETROL, 0.5), "schule", extrude=0.02, name="Schrift Schule")
    text3d("Lab", 16.3, ly0 - 0.06, 2.95, 0.5, mat(PETROL, 0.5), "lab", extrude=0.02, name="Schrift Lab")
    A("kita", 6.8, hy0, 1.6)
    A("schule", 8.6, hy0, 4.8)
    A("lab", 16.3, ly0, 1.7)
    A("halle", 13.2, hy0 - 0.05, 1.5)
    A("garten", 8.0, 2.4, 0.6)
    A("kita_center", 9.5, 7.7, 6.6)
    A("schule_center", 9.5, 7.7, 6.6)
    # the neighbourhood: housing behind the street, a care home and offices across the road (where the idea could go next)
    pastel = [(0.93, 0.85, 0.72), (0.86, 0.78, 0.70), (0.80, 0.84, 0.78), (0.90, 0.80, 0.76), (0.84, 0.86, 0.88)]
    for k, (x0, y0, x1, y1, h) in enumerate([(1.0, 16.6, 7.5, 21.6, 10.0), (8.5, 16.6, 13.5, 21.6, 8.5),
                                            (14.5, 16.6, 19.5, 21.6, 11.0)]):
        house(x0, y0, x1, y1, h, pastel[k % len(pastel)], "wohnen", roof=(0.55, 0.62, 0.38) if k % 2 == 0 else (0.62, 0.6, 0.58))
    A("wohnen", 10.5, 19.0, 9.5)
    house(23.8, 16.6, 29.6, 21.6, 9.0, (0.90, 0.88, 0.82), "arbeit", win=(0.98, 0.92, 0.80), roof=(0.55, 0.62, 0.36))
    house(23.8, 4.0, 29.6, 12.0, 10.0, (0.80, 0.85, 0.88), "arbeit", win=(0.70, 0.82, 0.92), roof=(0.55, 0.62, 0.36))
    A("arbeit_center", 26.7, 8.0, 10.5)
    A("pflege", 26.7, 19.0, 9.5)
    A("buero", 26.7, 8.0, 10.5)
    # street trees: behind the house and along the far side, never in front of the house
    for x in (1.5, 4.5, 7.5, 10.5):
        tree(x, 16.1, random.uniform(3.8, 4.6), random.uniform(1.1, 1.4), hid=None)
    for y in (14.6, 18.0, 21.0):
        tree(23.4, y, random.uniform(3.8, 4.6), random.uniform(1.0, 1.3), hid=None)
    tree(2.2, 11.6, 4.2, 1.3, hid=None)
    tree(18.6, 11.8, 3.8, 1.1, hid=None)
    # Lotte on her way into the house (school upstairs), a few people on the way to work
    who("lotte", 14.6, 2.4, 95, "walk", hid="lotte")
    for k, (px, py, f) in enumerate([(19.8, 3.0, 90), (19.7, 9.5, -90), (16.0, 12.6, 0), (6.0, 12.5, 180)]):
        person(px, py, f, "adult", skin=k % 5, hair=random.choice(list(HAIR)), style=random.choice(["short", "bun", "long", "buzz"]),
               top=CLOTH[k + 2], pose="walk")
    P("weg", [(9.5, 2.4, 0.1), (14.6, 1.8, 0.1), (14.6, 4.9, 0.1)])
    P("wachstum", [(15.5, 8.0, 7.2), (21.5, 13.0, 11.0), (26.7, 9.0, 10.6)])
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, 0.3) + box_corners(23.8, 4.0, 0, 29.6, 12.0, 10.4) + \
        box_corners(1.0, 16.6, 0, 19.5, 21.6, 11.2)
    return dict(W=W, D=D, time="aussen", pts=pts, shots={}, target=(W / 2, D / 2, 4), aspect=0.75, rx=52)


# ================================================================ Fachwand close-up (Fach und Cube)
FACH_KIDS = [
    dict(name="Ben", animal="hase", plan=["gby"], cube=True, jacket=SKY, shoes=BERRY, boots=True),
    dict(name="Mila", animal="fuchs", plan=["ygb"], cube=True, jacket=OCHRE, shoes=BERRY),
    dict(name="Defne", animal="katze", plan=["y?b"], cube=True, jacket=BERRY, shoes=(0.95, 0.80, 0.45), boots=True),
    dict(name="Emil", animal="eule", plan=["ygbyg", "bygbg", "gbybb", "yggby"], cube=True, jacket=None, shoes=SAGE),
    dict(name="Lina", animal="igel", plan=["gybgy", "ybgyb", "bgyy?", "ygbgy"], cube="gebaerden", jacket=PLUM,
         shoes=PETROL, boots=True),
]


def build_fachwand(v):
    W, D, H = 3.0, 2.2, 2.6
    room_base(W, D)
    wall("x", D, 0.0, W, h=H)
    wall("y", 0.0, 0.0, D + 0.18, h=H, m=WALL_ROSE)
    wall("y", W + 0.18, -0.2, D + 0.18, h=H, openings=[(0.5, 1.6, 0.6, 2.0, "window")], m=WALL_SAGE, cap=False)
    wainscot("y", 0.0, 0.0, D, h=1.0)
    F = Wall("x", D, 0.0)
    a0, w = 0.4, 0.42
    res = fachwand(F, a0, FACH_KIDS, w)
    m = res[1]
    A("fach_haken", *m["haken"])
    A("fach_bank", *m["bank"])
    A("fach_schuh", *m["schuh"])
    A("fach_schrank", *m["schrank"])
    A("fach_mal", *m["mal"])
    A("fach_cube", *m["cube"])
    A("mila_fach", *m["schrank"])
    A("mila_cube", *m["cube"])
    A("planwuerfel_tag", *m["plan"])
    A("planwuerfel_woche", *res[3]["plan"])
    A("frage", *res[2]["frage"])
    A("gebaerden_cube", *res[4]["cube"])
    # a drawing gallery and a plant next to the Fächer
    drawing(a0 + 5 * w + 0.32, D - 0.005, 1.45, -90, 0.34, 0.26, motif="sun", hid="bilder")
    drawing(a0 + 5 * w + 0.32, D - 0.005, 1.08, -90, 0.3, 0.24, motif="flower", hid="bilder")
    plant(a0 + 5 * w + 0.35, D - 0.3, 0, 0.9, pot="basket", kind="bush")
    rug_rect(0.45, D - 1.25, 2.4, D - 0.5, (0.86, 0.78, 0.64), (0.78, 0.70, 0.56), "teppich", "X", 5.0)
    pts = box_corners(-0.2, 0, -SLAB, W, D + 0.2, H + 0.05)
    shots = {"nah": dict(loc=(1.1, D - 2.2, 1.28), target=(1.5, D - 0.2, 0.8), lens=27, fstop=5.6, name="fachwand")}
    return dict(W=W, D=D, time="vormittag", pts=pts, shots=shots, target=(W / 2, D / 2, 1))


BUILDERS = {"halle": build_halle, "kaufladen": build_kaufladen, "waschraum": build_waschraum, "bistro": build_bistro,
            "abholung": build_abholung, "werkstatt": build_werkstatt, "aussen": build_aussen, "ausblick": build_ausblick,
            "fachwand": build_fachwand}

# ================================================================ run
cfg = BUILDERS[SCENE](VAR)
A("corner_l", -0.2, 0.0, -0.12)
light(cfg["time"], target=cfg["target"], **cfg.get("light", {}))
name = SCENE + (f"_{VAR}" if VAR else "")
if SHOT == "room":
    iso_camera(cfg["target"], 10, rx=cfg.get("rx", 57), aspect=cfg.get("aspect", 0.8), res=args.res or 1600)
    fit_iso(cfg["pts"], 0.03)
    finish(args, name, opaque=False, exposure=cfg.get("exposure", -0.3))
else:
    sh = cfg["shots"][SHOT]
    Hc = 2.6
    ceil = panel(-0.2, -0.5, Hc + 0.04, cfg["W"] + 0.5, cfg["D"] + 0.2, Hc + 0.07, None, name="Decke")
    camera_only(ceil)
    for (a, b) in ((-0.2, 0.0), (cfg["W"], cfg["W"] + 0.2)):
        pass
    persp_camera(sh["loc"], sh["target"], sh.get("lens", 45), sh.get("fstop", 3.2), aspect=sh.get("aspect", 0.72),
                 res=args.res or 1400, focus=sh.get("focus"))
    finish(args, sh.get("name", f"{name}_{SHOT}"), opaque=True, exposure=cfg.get("exposure", -0.3) + sh.get("ev", 0.0))
