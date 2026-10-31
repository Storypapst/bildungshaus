"""Bildungshaus v2 – shared Blender library: materials, primitives, figures, props, light, camera, output.

Cozy wooden-toy style: birch multiplex with visible ply edges, sage green, wool and linen,
soft rounded figures with faces. Every object can carry a hover id ("hid") for the ID mask.
"""

import json
import math
import os
import random
import sys

import bpy  # noqa: E402  (must come first, puts mathutils/bmesh on the path)
import addon_utils
import bmesh
from mathutils import Vector, Euler, Matrix
from bpy_extras.object_utils import world_to_camera_view

R = math.radians
bpy.ops.wm.read_factory_settings(use_empty=True)
addon_utils.enable("cycles")
scene = bpy.context.scene
objects, ANCH, PATHS = [], {}, {}
UP = Vector((0, 0, 1))


# ============================================================== node helpers
class NB:
    """Tiny node-graph builder for material shaders."""

    def __init__(self, m):
        m.use_nodes = True
        self.nt = m.node_tree
        self.N = self.nt.nodes
        self.L = self.nt.links
        self.bsdf = self.N.get("Principled BSDF")

    def _in(self, sock, v):
        if isinstance(v, (int, float)):
            sock.default_value = v
        elif isinstance(v, tuple):
            sock.default_value = (*v, 1) if len(v) == 3 else v
        else:
            self.L.new(v, sock)

    def node(self, kind, **props):
        n = self.N.new(kind)
        for k, v in props.items():
            setattr(n, k, v)
        return n

    def math(self, op, a, b=None, c=None):
        n = self.node("ShaderNodeMath", operation=op)
        self._in(n.inputs[0], a)
        if b is not None:
            self._in(n.inputs[1], b)
        if c is not None:
            self._in(n.inputs[2], c)
        return n.outputs[0]

    def mix(self, fac, a, b):
        n = self.node("ShaderNodeMix", data_type="RGBA")
        self._in(n.inputs[0], fac)
        self._in(n.inputs[6], a)
        self._in(n.inputs[7], b)
        return n.outputs[2]

    def sep(self, vec):
        n = self.node("ShaderNodeSeparateXYZ")
        self.L.new(vec, n.inputs[0])
        return n.outputs

    def coord(self, kind="Object"):
        if not hasattr(self, "_tc"):
            self._tc = self.node("ShaderNodeTexCoord")
        return self._tc.outputs[kind]

    def noise(self, vec, scale=5.0, detail=3.0, rough=0.5):
        n = self.node("ShaderNodeTexNoise")
        self.L.new(vec, n.inputs["Vector"])
        n.inputs["Scale"].default_value = scale
        n.inputs["Detail"].default_value = detail
        n.inputs["Roughness"].default_value = rough
        return n.outputs["Fac"]

    def white(self, w):
        n = self.node("ShaderNodeTexWhiteNoise", noise_dimensions="1D")
        self._in(n.inputs["W"], w)
        return n.outputs["Value"]

    def ramp(self, fac, stops):
        n = self.node("ShaderNodeValToRGB")
        self._in(n.inputs[0], fac)
        el = n.color_ramp.elements
        while len(el) < len(stops):
            el.new(0.5)
        for e, (pos, col) in zip(el, stops):
            e.position = pos
            e.color = (*col, 1)
        return n.outputs[0]

    def color(self, out):
        self.L.new(out, self.bsdf.inputs["Base Color"])


# ============================================================== materials
_M = {}


def mat(color, rough=0.6, emission=None, strength=0.0, sheen=0.0, metal=0.0, coat=0.0, noise=0.0,
        nscale=24.0, alpha=1.0, name="Mat"):
    color = tuple(round(c, 4) for c in color)
    key = (color, rough, emission, strength, sheen, metal, coat, noise, nscale, alpha)
    if key in _M:
        return _M[key]
    m = bpy.data.materials.new(name)
    nb = NB(m)
    b = nb.bsdf
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    b.inputs["Coat Weight"].default_value = coat
    if sheen:
        b.inputs["Sheen Weight"].default_value = sheen
        b.inputs["Sheen Roughness"].default_value = 0.6
    if emission:
        b.inputs["Emission Color"].default_value = (*emission, 1)
        b.inputs["Emission Strength"].default_value = strength
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
    if noise:
        f = nb.noise(nb.coord("Object"), nscale, 3.0)
        lo = tuple(c * (1 - noise) for c in color)
        hi = tuple(min(1, c * (1 + noise)) for c in color)
        nb.color(nb.ramp(f, [(0.25, lo), (0.75, hi)]))
    _M[key] = m
    return m


def fabric(color, sheen=0.7, rough=0.85, noise=0.05):
    return mat(color, rough, sheen=sheen, noise=noise, nscale=60.0, name="Stoff")


BIRCH = (0.89, 0.77, 0.59)
BIRCH_EDGE = (0.93, 0.83, 0.66)
GLUE = (0.62, 0.47, 0.31)


def multiplex(axis, freq=100.0, face=BIRCH, name="Multiplex"):
    """Birch plywood: veneer on the faces, layered stripes on the cut edges.
    axis = thickness axis in object space (X/Y/Z)."""
    key = ("mpx", axis, freq, face)
    if key in _M:
        return _M[key]
    m = bpy.data.materials.new(f"{name}_{axis}")
    nb = NB(m)
    nb.bsdf.inputs["Roughness"].default_value = 0.5
    nb.bsdf.inputs["Coat Weight"].default_value = 0.08
    co = nb.sep(nb.coord("Object"))
    no = nb.sep(nb.coord("Normal"))
    stripe = nb.math("GREATER_THAN", nb.math("FRACT", nb.math("MULTIPLY", co[axis], freq)), 0.7)
    edge = nb.mix(stripe, BIRCH_EDGE, GLUE)
    is_face = nb.math("GREATER_THAN", nb.math("ABSOLUTE", no[axis]), 0.5)
    g = nb.noise(nb.coord("Object"), 9.0, 5.0, 0.55)
    veneer = nb.ramp(g, [(0.3, tuple(c * 0.95 for c in face)), (0.7, tuple(min(1, c * 1.04) for c in face))])
    nb.color(nb.mix(is_face, edge, veneer))
    _M[key] = m
    return m


def planks(c1=(0.80, 0.60, 0.40), c2=(0.72, 0.52, 0.33), width=0.19, length=1.4, seam=(0.45, 0.32, 0.22)):
    """Oak plank floor in object space (boards run along Y)."""
    key = ("planks", c1, c2, width)
    if key in _M:
        return _M[key]
    m = bpy.data.materials.new("Dielen")
    nb = NB(m)
    nb.bsdf.inputs["Roughness"].default_value = 0.45
    nb.bsdf.inputs["Coat Weight"].default_value = 0.15
    co = nb.sep(nb.coord("Object"))
    u = nb.math("DIVIDE", co["X"], width)
    idx = nb.math("FLOOR", u)
    off = nb.math("MULTIPLY", nb.white(idx), length)
    v = nb.math("DIVIDE", nb.math("ADD", co["Y"], off), length)
    seam_x = nb.math("LESS_THAN", nb.math("FRACT", u), 0.035)
    seam_y = nb.math("LESS_THAN", nb.math("FRACT", v), 0.006)
    seam_f = nb.math("MAXIMUM", seam_x, seam_y)
    tone = nb.white(nb.math("ADD", idx, nb.math("MULTIPLY", nb.math("FLOOR", v), 7.31)))
    grain = nb.noise(nb.coord("Object"), 14.0, 4.0, 0.6)
    t2 = nb.math("ADD", nb.math("MULTIPLY", tone, 0.7), nb.math("MULTIPLY", grain, 0.3))
    base = nb.mix(t2, c2, c1)
    nb.color(nb.mix(seam_f, base, seam))
    _M[key] = m
    return m


def tiles(axis_u, color=(0.70, 0.79, 0.70), grout=(0.93, 0.92, 0.88), size=0.15, axis_v="Z"):
    key = ("tiles", axis_u, axis_v, color, size)
    if key in _M:
        return _M[key]
    m = bpy.data.materials.new("Fliesen")
    nb = NB(m)
    nb.bsdf.inputs["Roughness"].default_value = 0.25
    nb.bsdf.inputs["Coat Weight"].default_value = 0.3
    co = nb.sep(nb.coord("Object"))
    gu = nb.math("LESS_THAN", nb.math("FRACT", nb.math("DIVIDE", co[axis_u], size)), 0.06)
    gv = nb.math("LESS_THAN", nb.math("FRACT", nb.math("DIVIDE", co[axis_v], size)), 0.06)
    tone = nb.white(nb.math("ADD", nb.math("FLOOR", nb.math("DIVIDE", co[axis_u], size)),
                            nb.math("MULTIPLY", nb.math("FLOOR", nb.math("DIVIDE", co[axis_v], size)), 13.7)))
    base = nb.mix(tone, tuple(c * 0.96 for c in color), tuple(min(1, c * 1.04) for c in color))
    nb.color(nb.mix(nb.math("MAXIMUM", gu, gv), base, grout))
    _M[key] = m
    return m


def stripes(c1, c2, scale=20.0, axis="Z", ratio=0.5, rough=0.85, sheen=0.5, coord="Object"):
    key = ("stripes", c1, c2, scale, axis, ratio, coord)
    if key in _M:
        return _M[key]
    m = bpy.data.materials.new("Streifen")
    nb = NB(m)
    nb.bsdf.inputs["Roughness"].default_value = rough
    nb.bsdf.inputs["Sheen Weight"].default_value = sheen
    co = nb.sep(nb.coord(coord))
    s = nb.math("GREATER_THAN", nb.math("FRACT", nb.math("MULTIPLY", co[axis], scale)), ratio)
    nb.color(nb.mix(s, c1, c2))
    _M[key] = m
    return m


def garden_glass(day="morgen"):
    """Window pane that shows a soft garden: grass, hedge, trees, sky. Lets the sun through."""
    key = ("garden", day)
    if key in _M:
        return _M[key]
    sky = {"morgen": (0.93, 0.90, 0.84), "mittag": (0.84, 0.92, 0.98), "nachmittag": (0.98, 0.88, 0.74),
           "tag": (0.86, 0.92, 0.97)}[day]
    m = bpy.data.materials.new("Gartenfenster")
    nb = NB(m)
    co = nb.sep(nb.coord("Generated"))
    n = nb.noise(nb.coord("Generated"), 3.2, 2.0, 0.4)
    z = nb.math("ADD", co["Z"], nb.math("MULTIPLY", nb.math("SUBTRACT", n, 0.5), 0.55))
    col = nb.ramp(z, [(0.0, (0.40, 0.58, 0.33)), (0.30, (0.47, 0.64, 0.38)), (0.50, (0.58, 0.72, 0.48)),
                      (0.64, sky), (1.0, sky)])
    nb.color(col)
    nb.L.new(col, nb.bsdf.inputs["Emission Color"])
    nb.bsdf.inputs["Emission Strength"].default_value = 0.85
    nb.bsdf.inputs["Roughness"].default_value = 0.06
    nb.bsdf.inputs["Coat Weight"].default_value = 0.6
    _M[key] = m
    return m


# palette ------------------------------------------------------------------
SAGE = (0.60, 0.69, 0.55)
SAGE_D = (0.45, 0.56, 0.42)
ROSE = (0.88, 0.66, 0.60)
OCHRE = (0.90, 0.69, 0.33)
CLAY = (0.80, 0.50, 0.38)
SKY = (0.58, 0.72, 0.83)
CREAM = (0.96, 0.93, 0.87)
LINEN = (0.90, 0.85, 0.76)
PLUM = (0.62, 0.48, 0.60)
BERRY = (0.80, 0.36, 0.40)
PETROL = (0.30, 0.52, 0.55)
INK = (0.16, 0.12, 0.10)

WALL = mat(CREAM, 0.9, name="Putz")
WALL_SAGE = mat((0.74, 0.80, 0.68), 0.9, name="Putz grün")
WALL_ROSE = mat((0.93, 0.80, 0.74), 0.9, name="Putz rosa")
WOOD = mat((0.82, 0.64, 0.44), 0.5, noise=0.08, name="Holz")
WOOD_D = mat((0.58, 0.40, 0.26), 0.5, noise=0.08, name="Holz dunkel")
OAK = mat((0.74, 0.55, 0.36), 0.5, noise=0.1, name="Eiche")
DARK = mat(INK, 0.4, name="Dunkel")
WHITE = mat((0.95, 0.94, 0.92), 0.5, name="Weiß")
STEEL = mat((0.80, 0.80, 0.80), 0.3, metal=0.7, name="Stahl")
PAPER = mat((0.98, 0.96, 0.92), 0.9, name="Papier")
TERRA = mat((0.80, 0.48, 0.34), 0.75, name="Terrakotta")
LEAF = mat((0.33, 0.52, 0.30), 0.6, noise=0.12, name="Blatt")
LEAF2 = mat((0.45, 0.62, 0.34), 0.6, noise=0.12, name="Blatt hell")
CHEEK = mat((0.96, 0.60, 0.58), 0.6, name="Wange")
MOUTH = mat((0.42, 0.16, 0.14), 0.5, name="Mund")
WARM_LIGHT = mat((1.0, 0.86, 0.62), 0.5, emission=(1.0, 0.80, 0.52), strength=6.0, name="Lampe")

SKINS = [(0.97, 0.81, 0.68), (0.92, 0.72, 0.57), (0.80, 0.58, 0.42), (0.62, 0.41, 0.28), (0.45, 0.29, 0.19)]
HAIR = {"blond": (0.86, 0.67, 0.38), "hell": (0.70, 0.50, 0.28), "braun": (0.40, 0.24, 0.14),
        "dunkel": (0.12, 0.09, 0.07), "rot": (0.68, 0.32, 0.15), "grau": (0.66, 0.63, 0.60)}
CLOTH = [OCHRE, SAGE, ROSE, SKY, CLAY, PLUM, PETROL, BERRY, (0.95, 0.82, 0.45), (0.55, 0.62, 0.78)]


# ============================================================== primitives
def tag(o, hid=None):
    o["hid"] = hid or ""
    objects.append(o)
    return o


def _finish(o, m, hid, smooth=True, name=None):
    if name:
        o.name = name
    if smooth and o.type == "MESH":
        for p in o.data.polygons:
            p.use_smooth = True
    if m is not None:
        o.data.materials.clear()
        o.data.materials.append(m)
    return tag(o, hid)


def _apply_scale(o):
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)


def box(x0, y0, z0, x1, y1, z1, m, hid=None, bev=0.0, seg=3, rot=None, name="box"):
    bpy.ops.mesh.primitive_cube_add(size=1, location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.active_object
    o.scale = (max(abs(x1 - x0), 1e-3), max(abs(y1 - y0), 1e-3), max(abs(z1 - z0), 1e-3))
    _apply_scale(o)
    if rot:
        o.rotation_euler = rot
    if bev:
        md = o.modifiers.new("b", "BEVEL")
        md.width = min(bev, min(o.dimensions) * 0.45)
        md.segments = seg
        md.harden_normals = seg > 1
    _finish(o, m, hid, smooth=bool(bev) and seg > 1, name=name)
    return o


def panel(x0, y0, z0, x1, y1, z1, hid=None, freq=100.0, face=BIRCH, bev=0.004, name="Multiplex", rot=None):
    """Multiplex board; the thinnest dimension gets the ply-edge stripes."""
    dims = {"X": abs(x1 - x0), "Y": abs(y1 - y0), "Z": abs(z1 - z0)}
    axis = min(dims, key=dims.get)
    return box(x0, y0, z0, x1, y1, z1, multiplex(axis, freq, face), hid, bev=bev, seg=1, rot=rot, name=name)


def rbox(x0, y0, z0, x1, y1, z1, m, hid=None, r=0.05, seg=4, rot=None, name="rbox"):
    return box(x0, y0, z0, x1, y1, z1, m, hid, bev=r, seg=seg, rot=rot, name=name)


def cyl(x, y, z0, z1, r, m, hid=None, verts=32, rot=None, sx=1, sy=1, bev=0.0, name="cyl"):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=max(abs(z1 - z0), 1e-3), location=(x, y, (z0 + z1) / 2), vertices=verts)
    o = bpy.context.active_object
    if sx != 1 or sy != 1:
        o.scale = (sx, sy, 1)
        _apply_scale(o)
    if rot:
        o.rotation_euler = rot
    if bev:
        md = o.modifiers.new("b", "BEVEL")
        md.width = bev
        md.segments = 3
        md.limit_method = "ANGLE"
    return _finish(o, m, hid, name=name)


def ball(x, y, z, r, m, hid=None, scale=(1, 1, 1), rot=None, seg=24, name="ball"):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=(x, y, z), segments=seg, ring_count=max(8, seg // 2))
    o = bpy.context.active_object
    o.scale = scale
    if rot:
        o.rotation_euler = rot
    return _finish(o, m, hid, name=name)


def cone(x, y, z, r1, r2, depth, m, hid=None, rot=None, verts=24, name="cone", smooth=True):
    bpy.ops.mesh.primitive_cone_add(radius1=r1, radius2=r2, depth=depth, location=(x, y, z), vertices=verts)
    o = bpy.context.active_object
    if rot:
        o.rotation_euler = rot
    return _finish(o, m, hid, smooth=smooth and verts > 6, name=name)


def torus(x, y, z, R_, r_, m, hid=None, rot=None, seg=40, half=False, name="torus"):
    bpy.ops.mesh.primitive_torus_add(major_radius=R_, minor_radius=r_, location=(0, 0, 0), major_segments=seg, minor_segments=12)
    o = bpy.context.active_object
    if half:
        bm = bmesh.new()
        bm.from_mesh(o.data)
        bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.y < -1e-4], context="VERTS")
        bm.to_mesh(o.data)
        bm.free()
    o.location = (x, y, z)
    if rot:
        o.rotation_euler = rot
    return _finish(o, m, hid, name=name)


def text3d(body, x, y, z, size, m, hid=None, rot=(R(90), 0, 0), extrude=0.004, align="CENTER", name="text"):
    bpy.ops.object.text_add(location=(x, y, z))
    o = bpy.context.active_object
    o.data.body = body
    o.data.size = size
    o.data.extrude = extrude
    o.data.align_x = align
    o.data.align_y = "CENTER"
    o.rotation_euler = rot
    o.data.materials.append(m)
    o.name = name
    return tag(o, hid)


def _orient(o, p0, p1):
    d = Vector(p1) - Vector(p0)
    o.location = (Vector(p0) + Vector(p1)) / 2
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()


def capsule(p0, p1, r, m, hid=None, taper=1.0, flat=1.0, seg=20, name="capsule"):
    """Rounded limb between two points. taper scales the radius at p1, flat squashes the y axis."""
    p0, p1 = Vector(p0), Vector(p1)
    L = (p1 - p0).length
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=seg, v_segments=seg // 2 + 1, radius=r)
    for v in bm.verts:
        if v.co.z > 0:
            v.co.z += L / 2
        else:
            v.co.z -= L / 2
        t = (v.co.z + L / 2 + r) / (L + 2 * r)
        k = 1 + (taper - 1) * max(0.0, min(1.0, t))
        v.co.x *= k
        v.co.y *= k * flat
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    scene.collection.objects.link(o)
    _orient(o, p0, p1)
    return _finish(o, m, hid)


def curve_tube(pts, r, m, hid=None, name="tube", smooth=True):
    cu = bpy.data.curves.new(name, "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = r
    cu.bevel_resolution = 3
    sp = cu.splines.new("BEZIER" if smooth else "POLY")
    if smooth:
        sp.bezier_points.add(len(pts) - 1)
        for bp, p in zip(sp.bezier_points, pts):
            bp.co = p
            bp.handle_left_type = bp.handle_right_type = "AUTO"
    else:
        sp.points.add(len(pts) - 1)
        for i, p in enumerate(pts):
            sp.points[i].co = (*p, 1)
    o = bpy.data.objects.new(name, cu)
    scene.collection.objects.link(o)
    o.data.materials.append(m)
    return tag(o, hid)


def boolean_cut(o, cutter, apply=True):
    md = o.modifiers.new("cut", "BOOLEAN")
    md.operation = "DIFFERENCE"
    md.object = cutter
    md.solver = "EXACT"
    bpy.context.view_layer.objects.active = o
    if apply:
        bpy.ops.object.modifier_apply(modifier="cut")
    bpy.data.objects.remove(cutter, do_unlink=True)
    if cutter in objects:
        objects.remove(cutter)


def A(name, x, y, z):
    ANCH[name] = (x, y, z)


def P(name, pts):
    PATHS[name] = [tuple(p) for p in pts]


def fvec(deg):
    return Vector((math.cos(R(deg)), math.sin(R(deg)), 0))


# ============================================================== figures
DIMS = {
    "toddler": dict(leg=0.15, torso=0.22, r=0.118, head=0.132, arm=0.19, ar=0.036, lr=0.047, foot=0.05),
    "kid": dict(leg=0.24, torso=0.27, r=0.122, head=0.138, arm=0.25, ar=0.037, lr=0.049, foot=0.055),
    "teen": dict(leg=0.40, torso=0.33, r=0.128, head=0.136, arm=0.33, ar=0.039, lr=0.052, foot=0.06),
    "adult": dict(leg=0.70, torso=0.47, r=0.155, head=0.140, arm=0.52, ar=0.045, lr=0.064, foot=0.07),
}


def person(x, y, face_deg, kind="kid", skin=0, hair="braun", style="short", top=OCHRE, bottom=None, shoes=None,
           pose="stand", z=0.0, hid=None, key=None, acc=(), stripe=None, dress=False, look=None, seat=0.32,
           arms=None):
    """Soft toy figure. Returns dict of useful points (head, hands, top).

    pose: stand | walk | wave | reach | wash | hold | point | sit | sitc (on chair, seat height) | kneel
    style: short | bob | pigtails | bun | curly | ponytail | buzz | long | beanie | none
    look: optional world point the face turns towards.
    arms: optional dict {"l": point, "r": point} to override hand targets.
    """
    d = DIMS[kind]
    f = fvec(face_deg)
    s = f.cross(UP).normalized()  # right hand side
    base = Vector((x, y, z))
    skin_m = mat(SKINS[skin], 0.55, sheen=0.2, name="Haut")
    top_m = stripes(top, stripe, 26.0, "Z", 0.55) if stripe else fabric(top)
    bottom = bottom or tuple(c * 0.62 for c in top)
    bot_m = fabric(bottom, 0.5)
    shoes = shoes or (0.35, 0.28, 0.24)
    shoe_m = mat(shoes, 0.45, coat=0.2, name="Schuh")
    hair_m = mat(HAIR.get(hair, (0.4, 0.25, 0.15)), 0.6, sheen=0.3, name="Haar")
    lr, r, L = d["lr"], d["r"], d["leg"]

    # ---- legs and hips
    if pose == "sit":  # cross-legged on the floor
        hip_z = z + lr * 1.15
        for sd in (-1, 1):
            hip = base + s * sd * lr * 1.0 + UP * (hip_z - z)
            knee = base + s * sd * (L * 0.62 + lr) + f * (L * 0.42) + UP * lr
            ankle = base - s * sd * (lr * 0.6) + f * (L * 0.78) + UP * lr * 0.95
            capsule(hip, knee, lr, bot_m, hid, name="Bein")
            capsule(knee, ankle, lr * 0.95, bot_m, hid, name="Bein")
            ball(*(ankle - s * sd * 0.03 + f * 0.01), d["foot"] * 0.9, shoe_m, hid, scale=(1.4, 0.9, 0.75),
                 rot=(0, 0, R(face_deg)), name="Schuh")
    elif pose == "sitc":  # on a chair or stool
        hip_z = z + seat + lr
        for sd in (-1, 1):
            hip = base + s * sd * lr * 1.05 + UP * (hip_z - z)
            knee = hip + f * (L * 0.62)
            ankle = Vector((knee.x, knee.y, z + 0.06)) + f * 0.02
            if ankle.z > knee.z - 0.05:
                ankle = knee + f * 0.12 + UP * -0.06
            capsule(hip, knee, lr, bot_m, hid, name="Bein")
            capsule(knee, ankle, lr * 0.95, bot_m, hid, name="Bein")
            ball(*(ankle + f * 0.035), d["foot"], shoe_m, hid, scale=(1.0, 1.7, 0.75), rot=(0, 0, R(face_deg - 90)), name="Schuh")
    elif pose == "kneel":
        hip_z = z + L * 0.55 + lr
        for sd in (-1, 1):
            hip = base + s * sd * lr * 1.05 + UP * (hip_z - z)
            knee = base + s * sd * lr * 1.1 + f * 0.08 + UP * lr
            foot = knee - f * (L * 0.6)
            capsule(hip, knee, lr, bot_m, hid, name="Bein")
            capsule(knee, foot, lr * 0.95, bot_m, hid, name="Bein")
    else:
        hip_z = z + 0.05 + L
        for sd in (-1, 1):
            stride = 0.0
            if pose == "walk":
                stride = 0.10 * sd
            hip = base + s * sd * lr * 1.05 + UP * (hip_z - z - lr * 0.2)
            ankle = base + s * sd * lr * 1.15 + f * stride + UP * 0.07
            capsule(hip, ankle, lr, bot_m, hid, taper=0.92, name="Bein")
            ball(*(ankle + f * 0.03 + UP * -0.03), d["foot"], shoe_m, hid, scale=(1.0, 1.75, 0.78),
                 rot=(0, 0, R(face_deg - 90)), name="Schuh")

    # ---- torso
    t0 = Vector((x, y, hip_z - lr * 0.2))
    t1 = Vector((x, y, hip_z + d["torso"] - r))
    torso = capsule(t0, t1, r, top_m, hid, taper=0.84, flat=0.86, name="Körper")
    if dress:
        cone(x, y, hip_z + 0.02, r * 1.55, r * 0.9, d["torso"] * 0.55, top_m, hid, verts=28, name="Kleid")
    if "apron" in acc:
        ap = base + f * (r * 0.8) + UP * (hip_z - z + d["torso"] * 0.25)
        rbox(-0.11, -0.015, -d["torso"] * 0.42, 0.11, 0.015, d["torso"] * 0.42, fabric(SAGE), hid, r=0.012,
             rot=(0, 0, R(face_deg - 90)), name="Schürze").location = ap
    neck_z = hip_z + d["torso"] - r * 0.35
    hc = Vector((x, y, neck_z + d["head"] * 0.95))
    hr = d["head"]

    # ---- arms
    sh_z = hip_z + d["torso"] - r * 0.55
    sh = {sd: Vector((x, y, sh_z)) + s * sd * r * 0.88 for sd in (-1, 1)}
    al = d["arm"]
    tg = {}
    for sd in (-1, 1):
        p = sh[sd]
        if pose == "wave" and sd == 1:
            tg[sd] = p + UP * al * 0.85 + s * sd * al * 0.35
        elif pose in ("reach", "hold") or (pose == "point" and sd == 1):
            tg[sd] = p + f * al * 0.85 + UP * (al * 0.15 if pose == "point" else -al * 0.2) + s * -sd * (0.0 if pose == "point" else r * 0.45)
        elif pose == "wash":
            tg[sd] = p + f * al * 0.78 + UP * -al * 0.45 + s * -sd * r * 0.55
        elif pose == "sit":
            tg[sd] = p + f * al * 0.55 + UP * -al * 0.62 + s * sd * al * 0.25
        elif pose == "sitc":
            tg[sd] = p + f * al * 0.7 + UP * -al * 0.35 + s * -sd * r * 0.2
        elif pose == "walk":
            tg[sd] = p + UP * -al * 0.92 + f * -sd * al * 0.25 + s * sd * 0.03
        else:
            tg[sd] = p + UP * -al * 0.95 + s * sd * al * 0.16
    if arms:
        if "l" in arms:
            tg[-1] = Vector(arms["l"])
        if "r" in arms:
            tg[1] = Vector(arms["r"])
    hands = {}
    for sd in (-1, 1):
        dv = tg[sd] - sh[sd]
        if dv.length > al:
            tg[sd] = sh[sd] + dv.normalized() * al
        capsule(sh[sd], tg[sd], d["ar"], top_m, hid, taper=0.92, name="Arm")
        hands[sd] = tg[sd] + (tg[sd] - sh[sd]).normalized() * d["ar"] * 0.9
        ball(*hands[sd], d["ar"] * 1.3, skin_m, hid, name="Hand")

    # ---- head and face
    ball(*hc, hr, skin_m, hid, seg=32, name="Kopf")
    fh = f.copy()
    if look is not None:
        lv = Vector(look) - hc
        lh = Vector((lv.x, lv.y, 0))
        if lh.length > 1e-3:
            fh = lh.normalized()
        pitch = max(-0.45, min(0.45, math.atan2(lv.z, max(lh.length, 1e-3))))
        fh = (fh * math.cos(pitch) + UP * math.sin(pitch)).normalized()
    sh_ = fh.cross(UP).normalized()
    uh = sh_.cross(fh).normalized()
    for sd in (-1, 1):
        e = (fh + sh_ * sd * 0.36 + uh * 0.02).normalized()
        ball(*(hc + e * hr * 0.94), hr * 0.095, DARK, hid, seg=12, scale=(1, 1, 1.18), name="Auge")
        c = (fh + sh_ * sd * 0.64 + uh * -0.30).normalized()
        ball(*(hc + c * hr * 0.9), hr * 0.15, CHEEK, hid, seg=12, scale=(1, 1, 0.8), name="Wange")
    for t in (-1, -0.5, 0, 0.5, 1):
        mv = (fh + sh_ * t * 0.25 + uh * (-0.36 - 0.09 * (1 - t * t))).normalized()
        ball(*(hc + mv * hr * 0.985), hr * 0.032, MOUTH, hid, seg=8, name="Mund")

    # ---- hair
    back = -fh
    if style not in ("none", "beanie"):
        if style == "buzz":
            ball(*(hc + back * hr * 0.12 + UP * hr * 0.08), hr * 1.0, hair_m, hid, scale=(1, 1, 0.92), name="Haar")
        elif style == "curly":
            ball(*(hc + back * hr * 0.14 + UP * hr * 0.1), hr * 1.02, hair_m, hid, seg=24, name="Haar")
            for i in range(44):
                a = random.uniform(0, 2 * math.pi)
                el = random.uniform(-0.25, 1.35)
                dv = (math.cos(el) * (math.cos(a) * fh + math.sin(a) * sh_) + math.sin(el) * UP)
                if dv.dot(fh) > 0.30 and el < 0.75:
                    continue
                ball(*(hc + dv * hr * 1.0), hr * random.uniform(0.30, 0.40), hair_m, hid, seg=12, name="Locke")
        else:
            off_b = 0.13 if style == "short" else 0.16
            ball(*(hc + back * hr * off_b + UP * hr * 0.13), hr * 1.05, hair_m, hid, seg=28,
                 scale=(1, 1, 0.94), name="Haar")
            if style in ("bob", "long", "pigtails", "ponytail", "bun"):
                # side and back volume down to the chin
                for sd in (-1, 1):
                    ball(*(hc + back * hr * 0.35 + sh_ * sd * hr * 0.62 + UP * -hr * 0.25), hr * 0.55, hair_m, hid,
                         seg=16, scale=(1, 1, 1.2), name="Haar")
                ball(*(hc + back * hr * 0.55 + UP * -hr * 0.2), hr * 0.75, hair_m, hid, seg=20, name="Haar")
            if style == "long":
                capsule(hc + back * hr * 0.6 + UP * -hr * 0.2, hc + back * hr * 0.7 + UP * -hr * 1.6, hr * 0.55,
                        hair_m, hid, flat=0.6, name="Haar")
            if style == "pigtails":
                for sd in (-1, 1):
                    p = hc + sh_ * sd * hr * 1.05 + UP * hr * 0.05 + back * hr * 0.25
                    ball(*p, hr * 0.38, hair_m, hid, seg=16, scale=(1, 1, 1.25), name="Zopf")
                    ball(*(p + UP * hr * 0.32 - sh_ * sd * hr * 0.12), hr * 0.12, mat(BERRY, 0.4), hid, seg=10, name="Haargummi")
            if style == "ponytail":
                capsule(hc + back * hr * 0.95 + UP * hr * 0.25, hc + back * hr * 1.35 + UP * -hr * 0.7, hr * 0.28,
                        hair_m, hid, taper=0.7, name="Zopf")
            if style == "bun":
                ball(*(hc + back * hr * 0.55 + UP * hr * 0.9), hr * 0.42, hair_m, hid, seg=16, name="Dutt")
    if style == "beanie" or "beanie" in acc:
        bc = mat(BERRY, 0.9, sheen=0.6)
        ball(*(hc + back * hr * 0.05 + UP * hr * 0.18), hr * 1.07, bc, hid, scale=(1, 1, 0.82), name="Mütze")
        ball(*(hc + UP * hr * 1.12), hr * 0.25, bc, hid, seg=12, name="Bommel")
    top_z = hc.z + hr
    if "glasses" in acc:
        gm = mat((0.25, 0.18, 0.14), 0.4)
        for sd in (-1, 1):
            e = (fh + sh_ * sd * 0.36 + uh * 0.02).normalized()
            torus(*(hc + e * hr * 1.03), hr * 0.17, hr * 0.022, gm, hid,
                  rot=fh.to_track_quat("Z", "Y").to_euler(), seg=20, name="Brille")
    if "crown" in acc:
        gold = mat((0.98, 0.78, 0.28), 0.35, coat=0.4)
        cyl(hc.x, hc.y, top_z - 0.04, top_z + 0.03, hr * 0.78, gold, hid, verts=24, name="Krone")
        for k in range(6):
            a = k * 2 * math.pi / 6
            cone(hc.x + math.cos(a) * hr * 0.74, hc.y + math.sin(a) * hr * 0.74, top_z + 0.06, 0.03, 0.004, 0.07, gold,
                 hid, verts=6, name="Zacke")
        top_z += 0.1
    if "chef" in acc:
        cyl(hc.x, hc.y, top_z - 0.06, top_z + 0.1, hr * 0.82, WHITE, hid, name="Kochmütze")
        ball(hc.x, hc.y, top_z + 0.14, hr * 1.0, WHITE, hid, scale=(1, 1, 0.62), name="Kochmütze")
        top_z += 0.2
    if "backpack" in acc:
        bp = Vector((x, y, hip_z + d["torso"] * 0.45)) - f * (r * 1.15)
        rbox(bp.x - 0.13, bp.y - 0.13, bp.z - 0.17, bp.x + 0.13, bp.y + 0.13, bp.z + 0.15, mat(BERRY, 0.6), hid, r=0.05,
             name="Ranzen")
    if "scarf" in acc:
        torus(x, y, neck_z, r * 0.62, 0.035, fabric(OCHRE), hid, name="Schal")

    # ---- things in hands
    hr_, hl_ = hands[1], hands[-1]
    mid = (hr_ + hl_) / 2
    held = {}
    for a in acc:
        if a == "phone":
            o = rbox(-0.04, -0.006, -0.075, 0.04, 0.006, 0.075, mat((0.15, 0.17, 0.2), 0.3, emission=(0.6, 0.78, 0.95),
                     strength=0.8), hid, r=0.008, name="Handy")
            o.location = hr_ + f * 0.02 + UP * 0.04
            o.rotation_euler = (R(-30), 0, R(face_deg - 90))
            held["phone"] = tuple(o.location)
        elif a == "tablet":
            o = rbox(-0.13, -0.008, -0.095, 0.13, 0.008, 0.095, mat((0.15, 0.17, 0.2), 0.3, emission=(0.6, 0.78, 0.95),
                     strength=0.7), hid, r=0.01, name="Tablet")
            o.location = mid + f * 0.03 + UP * 0.05
            o.rotation_euler = (R(-40), 0, R(face_deg - 90))
            held["tablet"] = tuple(o.location)
        elif a == "ukulele":
            c = mid + f * 0.05
            ball(*c, 0.11, WOOD, hid, scale=(1, 0.45, 1.25), rot=(0, R(55), R(face_deg - 90)), name="Ukulele")
            capsule(c, c + s * 0.32 + UP * 0.12, 0.022, WOOD_D, hid, name="Hals")
            held["ukulele"] = tuple(c)
        elif a == "pot":
            c = mid + f * 0.12
            cyl(c.x, c.y, c.z - 0.1, c.z + 0.08, 0.16, mat(BERRY, 0.35, coat=0.5), hid, name="Topf")
            cyl(c.x, c.y, c.z + 0.06, c.z + 0.075, 0.145, mat((0.85, 0.35, 0.2), 0.5), hid, name="Soße")
            held["pot"] = (c.x, c.y, c.z + 0.1)
        elif a == "basket":
            c = hl_ + UP * -0.1
            cyl(c.x, c.y, c.z - 0.1, c.z + 0.02, 0.11, mat((0.78, 0.6, 0.36), 0.8, noise=0.2, nscale=90), hid, name="Korb")
            torus(c.x, c.y, c.z + 0.1, 0.09, 0.012, WOOD_D, hid, rot=(R(90), 0, R(face_deg)), half=True, name="Henkel")
            for k, col in enumerate([(0.8, 0.12, 0.12), (0.95, 0.75, 0.2), (0.42, 0.24, 0.48)]):
                ball(c.x + (k - 1) * 0.05, c.y, c.z + 0.03, 0.04, mat(col, 0.35), hid, name="Obst")
        elif a == "drawing":
            o = box(-0.13, -0.003, -0.095, 0.13, 0.003, 0.095, PAPER, hid, name="Zeichnung")
            o.location = mid + f * 0.06 + UP * 0.06
            o.rotation_euler = (R(-15), 0, R(face_deg - 90))
            for k, col in enumerate([(0.95, 0.7, 0.2), (0.85, 0.3, 0.25), (0.35, 0.6, 0.35)]):
                b = ball(0, 0, 0, 0.028 + 0.008 * k, mat(col, 0.8), hid, scale=(1.2, 0.2, 1), name="Klecks")
                b.parent = o
                b.location = ((k - 1) * 0.07, -0.006, 0.02 * (k % 2))
            held["drawing"] = tuple(o.location)
        elif a == "mug":
            cyl(hr_.x, hr_.y, hr_.z - 0.04, hr_.z + 0.06, 0.04, mat(SKY, 0.4, coat=0.4), hid, name="Becher")
        elif a == "iron":
            o = capsule(hr_, hr_ + f * 0.16 + UP * -0.1, 0.016, mat(PETROL, 0.5), hid, name="Lötkolben")
            held["iron"] = tuple(hr_ + f * 0.2 + UP * -0.13)
        elif a == "brush":
            capsule(hr_, hr_ + f * 0.1 + UP * -0.08, 0.008, WOOD, hid, name="Pinsel")
        elif a == "fruit":
            ball(*(hr_ + f * 0.03), 0.045, mat((0.42, 0.20, 0.48), 0.3), hid, scale=(1.8, 1, 1), name="Aubergine")
    pts = {"head": tuple(hc), "top": (hc.x, hc.y, top_z + 0.06), "hand_r": tuple(hr_), "hand_l": tuple(hl_),
           "chest": (x + f.x * r, y + f.y * r, hip_z + d["torso"] * 0.5)}
    pts.update(held)
    if key:
        for k, v in pts.items():
            A(f"{key}_{k}", *v)
    return pts


# ============================================================== props
def rug_round(x, y, r, colors, hid=None, z=0.0, name="Teppich"):
    """Braided rug: concentric rings."""
    n = len(colors)
    for i, c in enumerate(colors):
        rr = r * (1 - i / n)
        cyl(x, y, z, z + 0.018 + i * 0.001, rr, fabric(c, 0.5, 0.95, 0.12), hid, verts=72, name=name)
        torus(x, y, z + 0.016 + i * 0.001, rr - 0.012, 0.014, fabric(tuple(v * 0.9 for v in c), 0.5, 0.95), hid,
              seg=72, name=name)


def rug_rect(x0, y0, x1, y1, c1, c2, hid=None, axis="X", scale=4.0, name="Teppich"):
    o = rbox(x0, y0, 0.0, x1, y1, 0.02, stripes(c1, c2, scale, axis, 0.5, 0.95, 0.4), hid, r=0.008, name=name)
    return o


def cushion(x, y, z, w, d, h, color, rot=0.0, hid=None, name="Kissen"):
    o = rbox(-w / 2, -d / 2, -h / 2, w / 2, d / 2, h / 2, fabric(color), hid, r=min(h * 0.45, 0.06), seg=5, name=name)
    o.location = (x, y, z + h / 2)
    o.rotation_euler = (0, 0, R(rot))
    return o


def pouf(x, y, r, color, hid=None):
    return ball(x, y, r * 0.55, r, fabric(color, 0.6, 0.9, 0.08), hid, scale=(1, 1, 0.58), name="Pouf")


BASKET_M = None


def basket(x, y, z, r, h, hid=None, fill=None):
    global BASKET_M
    if BASKET_M is None:
        BASKET_M = stripes((0.80, 0.63, 0.40), (0.68, 0.50, 0.30), 90.0, "Z", 0.5, 0.85, 0.2)
    cyl(x, y, z, z + h, r, BASKET_M, hid, verts=28, name="Korb")
    torus(x, y, z + h, r, 0.012, mat((0.70, 0.52, 0.32), 0.8), hid, seg=28, name="Korbrand")
    if fill == "blocks":
        for k in range(5):
            c = BLOCKC[k % len(BLOCKC)]
            box(x - r * 0.5 + (k % 3) * r * 0.4, y - r * 0.3 + (k // 3) * r * 0.5, z + h - 0.03,
                x - r * 0.5 + (k % 3) * r * 0.4 + 0.07, y - r * 0.3 + (k // 3) * r * 0.5 + 0.07, z + h + 0.04,
                mat(c, 0.5, coat=0.2), hid, bev=0.008, rot=(0, 0, R(k * 23)), name="Klotz")
    elif fill == "wool":
        for k in range(4):
            ball(x + random.uniform(-r, r) * 0.4, y + random.uniform(-r, r) * 0.4, z + h - 0.01, r * 0.35,
                 fabric(random.choice(CLOTH)), hid, seg=14, name="Wolle")
    elif fill == "toys":
        for k in range(3):
            ball(x + random.uniform(-r, r) * 0.4, y + random.uniform(-r, r) * 0.4, z + h, r * 0.3,
                 mat(random.choice(CLOTH), 0.5), hid, seg=14, name="Spielzeug")


BLOCKC = [(0.86, 0.36, 0.30), (0.96, 0.76, 0.30), (0.40, 0.60, 0.80), (0.48, 0.68, 0.42), (0.90, 0.80, 0.62)]


def books(x0, y, z, x1, axis="x", hid=None, depth=0.18, facing=1):
    """Row of books standing on a shelf (along x or y)."""
    cols = [SAGE, ROSE, OCHRE, SKY, CLAY, PLUM, CREAM, PETROL]
    p = x0
    while p < x1 - 0.03:
        w = random.uniform(0.025, 0.045)
        h = random.uniform(0.16, 0.24)
        c = random.choice(cols)
        if axis == "x":
            box(p, y - depth / 2, z, p + w, y + depth / 2, z + h, mat(c, 0.7), hid, bev=0.004, name="Buch")
        else:
            box(y - depth / 2, p, z, y + depth / 2, p + w, z + h, mat(c, 0.7), hid, bev=0.004, name="Buch")
        p += w + 0.004


def rainbow(x, y, z, s=1.0, rot=0.0, hid=None):
    cols = [(0.82, 0.30, 0.28), (0.92, 0.55, 0.28), (0.96, 0.80, 0.34), (0.50, 0.70, 0.40), (0.36, 0.58, 0.78),
            (0.56, 0.44, 0.70)]
    for i, c in enumerate(cols):
        R_ = (0.20 - i * 0.03) * s
        torus(x, y, z, R_, 0.014 * s, mat(c, 0.45, coat=0.3), hid, rot=(R(90), 0, R(rot)), half=True, seg=32,
              name="Regenbogen")


def plant(x, y, z=0.0, s=1.0, pot="terra", hid=None, kind="bush"):
    pm = TERRA if pot == "terra" else (mat((0.80, 0.63, 0.40), 0.85, noise=0.2, nscale=90) if pot == "basket" else
                                       mat(CREAM, 0.5, coat=0.3))
    cyl(x, y, z, z + 0.3 * s, 0.17 * s, pm, hid, verts=28, bev=0.01, name="Topf")
    cyl(x, y, z + 0.27 * s, z + 0.29 * s, 0.15 * s, mat((0.32, 0.22, 0.15), 0.9), hid, verts=24, name="Erde")
    if kind == "bush":
        for k in range(9):
            a = k * 2.4
            rr = random.uniform(0.05, 0.16) * s
            ball(x + math.cos(a) * rr, y + math.sin(a) * rr, z + (0.42 + random.uniform(0, 0.45)) * s,
                 random.uniform(0.13, 0.19) * s, random.choice([LEAF, LEAF2]), hid, scale=(1, 1, 0.85), seg=16,
                 name="Blatt")
    elif kind == "monstera":
        for k in range(8):
            a = k * 2.399
            el = random.uniform(0.35, 0.95)
            ln = random.uniform(0.45, 0.75) * s
            p0 = Vector((x, y, z + 0.28 * s))
            tip = p0 + Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el))) * ln
            curve_tube([tuple(p0), tuple((p0 + tip) / 2 + Vector((0, 0, 0.08 * s))), tuple(tip)], 0.008 * s, LEAF, hid,
                       name="Stiel")
            ball(*tip, 0.15 * s, random.choice([LEAF, LEAF2]), hid, scale=(1.0, 0.65, 0.12),
                 rot=(R(random.uniform(-30, 30)), R(-math.degrees(el) * 0.6), a), seg=18, name="Blatt")
    elif kind == "tree":
        capsule((x, y, z + 0.25 * s), (x, y, z + 1.3 * s), 0.025 * s, WOOD_D, hid, name="Stamm")
        for k in range(14):
            a = k * 2.4
            h = random.uniform(0.9, 1.75)
            rr = random.uniform(0.05, 0.3) * s
            ball(x + math.cos(a) * rr, y + math.sin(a) * rr, z + h * s, random.uniform(0.11, 0.17) * s,
                 random.choice([LEAF, LEAF2]), hid, scale=(1, 0.7, 0.4), rot=(R(30), 0, a), seg=14, name="Blatt")
    elif kind == "hanging":
        for k in range(6):
            a = k * 1.05
            p = Vector((x + math.cos(a) * 0.1 * s, y + math.sin(a) * 0.1 * s, z + 0.28 * s))
            for j in range(random.randint(4, 8)):
                p = p + Vector((math.cos(a) * 0.035, math.sin(a) * 0.035, -0.07)) * s
                ball(*p, 0.045 * s, random.choice([LEAF, LEAF2]), hid, seg=10, scale=(1, 1, 0.6), name="Ranke")
    elif kind == "herb":
        for k in range(7):
            a = k * 2.4
            ball(x + math.cos(a) * 0.06 * s, y + math.sin(a) * 0.06 * s, z + (0.36 + random.uniform(0, 0.12)) * s,
                 0.07 * s, LEAF2, hid, seg=12, name="Kraut")


def drawing(x, y, z, face_deg, w=0.4, h=0.3, hid=None, motif=None, name="Bild"):
    """Child's drawing taped to a wall. motif: sun | house | flower | rainbow | person | scribble."""
    motif = motif or random.choice(["sun", "house", "flower", "rainbow", "person"])
    f = fvec(face_deg)
    s = f.cross(UP).normalized()
    c = Vector((x, y, z))
    rot = (0, 0, R(face_deg - 90))
    o = box(-w / 2, -0.003, -h / 2, w / 2, 0.003, h / 2, PAPER, hid, rot=rot, name=name)
    o.location = c

    def dot(u, v, r, col, sc=(1, 1)):
        p = c + f * 0.005 + s * (u * w) + UP * (v * h)
        ball(*p, r, mat(col, 0.85), hid, seg=12, scale=(sc[0], 0.25, sc[1]), rot=rot, name="Farbe")

    if motif == "sun":
        dot(0.25, 0.22, 0.045, (0.98, 0.78, 0.2))
        for k in range(8):
            a = k * math.pi / 4
            dot(0.25 + math.cos(a) * 0.14, 0.22 + math.sin(a) * 0.2, 0.012, (0.98, 0.7, 0.2))
        dot(-0.2, -0.25, 0.05, (0.45, 0.68, 0.35), (3.0, 0.5))
        dot(-0.1, -0.08, 0.03, (0.85, 0.35, 0.3), (0.7, 1.3))
    elif motif == "house":
        dot(0.0, -0.12, 0.06, (0.85, 0.35, 0.3), (1.3, 1.1))
        dot(0.0, 0.12, 0.05, (0.35, 0.5, 0.75), (1.6, 0.6))
        dot(0.3, 0.3, 0.03, (0.98, 0.78, 0.2))
    elif motif == "flower":
        for k in range(5):
            a = k * 2 * math.pi / 5
            dot(math.cos(a) * 0.1, 0.12 + math.sin(a) * 0.13, 0.03, (0.9, 0.45, 0.6))
        dot(0, 0.12, 0.022, (0.98, 0.8, 0.2))
        dot(0, -0.18, 0.012, (0.4, 0.65, 0.35), (1, 6))
    elif motif == "rainbow":
        for k, col in enumerate([(0.85, 0.3, 0.3), (0.95, 0.75, 0.25), (0.45, 0.68, 0.4), (0.35, 0.55, 0.8)]):
            for j in range(7):
                a = math.pi * j / 6
                dot(math.cos(a) * (0.32 - k * 0.06), -0.2 + math.sin(a) * (0.5 - k * 0.09), 0.016, col)
    else:
        dot(0, 0.18, 0.035, (0.93, 0.75, 0.6))
        dot(0, -0.05, 0.035, (0.35, 0.55, 0.8), (0.9, 1.6))
        dot(-0.3, 0.25, 0.03, (0.98, 0.78, 0.2))
    # tape strips
    for u in (-0.42, 0.42):
        p = c + f * 0.004 + s * (u * w) + UP * (0.46 * h)
        t = box(-0.025, -0.002, -0.012, 0.025, 0.002, 0.012, mat((0.92, 0.80, 0.55), 0.6), hid, rot=(0, R(u * 40), R(face_deg - 90)),
                name="Klebeband")
        t.location = p


def bunting(p0, p1, sag=0.35, colors=None, n=None, hid=None, size=0.13):
    p0, p1 = Vector(p0), Vector(p1)
    colors = colors or [OCHRE, SAGE, ROSE, SKY, CREAM, CLAY]
    L = (p1 - p0).length
    n = n or max(4, int(L / 0.24))
    pts = []
    for i in range(0, 21):
        t = i / 20
        pts.append(tuple(p0.lerp(p1, t) - UP * sag * 4 * t * (1 - t)))
    curve_tube(pts, 0.004, mat((0.9, 0.88, 0.82), 0.8), None, name="Schnur")
    dirv = (p1 - p0).normalized()
    nrm = dirv.cross(UP).normalized()
    for i in range(n):
        t = (i + 0.5) / n
        c = p0.lerp(p1, t) - UP * sag * 4 * t * (1 - t)
        me = bpy.data.meshes.new("Wimpel")
        a = c - dirv * size * 0.45
        b = c + dirv * size * 0.45
        tip = c - UP * size * 1.1 + nrm * 0.01
        me.from_pydata([tuple(a), tuple(b), tuple(tip)], [], [(0, 1, 2)])
        o = bpy.data.objects.new("Wimpel", me)
        scene.collection.objects.link(o)
        sol = o.modifiers.new("s", "SOLIDIFY")
        sol.thickness = 0.004
        o.data.materials.append(fabric(colors[i % len(colors)], 0.4, 0.9, 0.0))
        tag(o, hid)


def lantern(x, y, z, r=0.16, cord_to=None, hid=None):
    ball(x, y, z, r, mat((1.0, 0.94, 0.84), 0.7, emission=(1.0, 0.82, 0.58), strength=2.2), hid, seg=24,
         scale=(1, 1, 0.92), name="Lampion")
    if cord_to is not None:
        curve_tube([(x, y, z + r), cord_to], 0.004, DARK, None, smooth=False, name="Kabel")


def curtain(axis, fixed, a0, a1, z0, z1, color=LINEN, inset=0.06, hid=None):
    n = max(3, int((a1 - a0) / 0.09))
    m = fabric(color, 0.4, 0.95, 0.05)
    for i in range(n):
        a = a0 + (a1 - a0) * (i + 0.5) / n
        off = inset + (0.02 if i % 2 else 0.0)
        if axis == "x":
            cyl(a, fixed - off, z0, z1, (a1 - a0) / n * 0.62, m, hid, verts=12, name="Vorhang")
        else:
            cyl(fixed + off, a, z0, z1, (a1 - a0) / n * 0.62, m, hid, verts=12, name="Vorhang")


def jacket(x, y, z, face_deg, color, hid=None):
    f = fvec(face_deg)
    rbox(-0.13, -0.05, -0.2, 0.13, 0.05, 0.12, fabric(color), hid, r=0.045, rot=(0, 0, R(face_deg - 90)),
         name="Jacke").location = (x + f.x * 0.06, y + f.y * 0.06, z)
    ball(x + f.x * 0.06, y + f.y * 0.06, z + 0.16, 0.07, fabric(color), hid, scale=(1, 0.8, 0.9), name="Kapuze")


def boots(x, y, face_deg, color, hid=None):
    f = fvec(face_deg)
    s = f.cross(UP)
    for sd in (-1, 1):
        p = Vector((x, y, 0)) + s * sd * 0.05
        rbox(p.x - 0.035, p.y - 0.035, 0, p.x + 0.035, p.y + 0.035, 0.17, mat(color, 0.35, coat=0.5), hid, r=0.02,
             name="Stiefel")
        rbox(-0.04, -0.06, 0, 0.04, 0.06, 0.05, mat(color, 0.35, coat=0.5), hid, r=0.02,
             rot=(0, 0, R(face_deg - 90)), name="Stiefel").location = (p.x + f.x * 0.03, p.y + f.y * 0.03, 0.025)


def stool(x, y, h=0.3, color=SAGE, hid=None):
    cyl(x, y, h - 0.04, h, 0.15, mat(color, 0.6, coat=0.2), hid, verts=28, bev=0.012, name="Hocker")
    for k in range(3):
        a = k * 2 * math.pi / 3
        capsule((x + math.cos(a) * 0.09, y + math.sin(a) * 0.09, h - 0.04), (x + math.cos(a) * 0.12, y + math.sin(a) * 0.12, 0.0),
                0.016, WOOD, hid, name="Bein")


def kid_table(x0, y0, x1, y1, h=0.52, hid=None, round_=False):
    if round_:
        cx, cy, r = (x0 + x1) / 2, (y0 + y1) / 2, (x1 - x0) / 2
        cyl(cx, cy, h - 0.035, h, r, multiplex("Z", 100.0), hid, verts=56, name="Tisch")
        cyl(cx, cy, 0, h - 0.035, 0.06, WOOD, hid, name="Fuß")
        cyl(cx, cy, 0, 0.03, r * 0.45, WOOD, hid, name="Fuß")
        return
    panel(x0, y0, h - 0.03, x1, y1, h, hid, name="Tisch")
    for lx, ly in ((x0 + 0.07, y0 + 0.07), (x1 - 0.07, y0 + 0.07), (x0 + 0.07, y1 - 0.07), (x1 - 0.07, y1 - 0.07)):
        cyl(lx, ly, 0, h - 0.03, 0.025, WOOD, hid, name="Bein")


def smiley(x, y, z, face_deg, mood="froh", r=0.075, color=(0.97, 0.80, 0.34), hid=None):
    f = fvec(face_deg)
    s = f.cross(UP).normalized()
    o = cyl(0, 0, -0.012, 0.012, r, mat(color, 0.45, coat=0.3), hid, verts=32, bev=0.004, name="Smiley")
    o.location = (x, y, z)
    o.rotation_euler = (R(90), 0, R(face_deg + 90))
    p = Vector((x, y, z)) + f * 0.013
    for sd in (-1, 1):
        ball(*(p + s * sd * r * 0.33 + UP * r * 0.22), r * 0.11, DARK, hid, seg=10, name="Auge")
    if mood == "frage":
        ball(*(p + UP * -r * 0.4), r * 0.12, DARK, hid, seg=10, name="Mund")
    else:
        for k in range(5):
            t = -1 + k * 0.5
            dz = -r * 0.3 - (r * 0.18 if mood == "froh" else 0.0) * (1 - t * t)
            ball(*(p + s * t * r * 0.42 + UP * dz), r * 0.07, DARK, hid, seg=8, name="Mund")


def animal(x, y, z, face_deg, kind="hase", color=(0.85, 0.70, 0.52), s=1.0, hid=None, soft=False):
    """Small animal figure. soft=True: plush (teddy in the reading cave), never a token."""
    f = fvec(face_deg)
    side = f.cross(UP)
    m = fabric(color, 0.8, 0.9, 0.12) if soft else mat(color, 0.45, coat=0.25)
    ball(x, y, z + 0.05 * s, 0.055 * s, m, hid, scale=(1, 1, 1.1), seg=18, name="Tier")
    hc = Vector((x, y, z + 0.13 * s)) + f * 0.01 * s
    ball(*hc, 0.042 * s, m, hid, seg=18, name="Tier")
    if kind == "hase":
        for sd in (-1, 1):
            ball(*(hc + side * sd * 0.018 * s + UP * 0.06 * s), 0.014 * s, m, hid, scale=(1, 1, 3), seg=10, name="Ohr")
    elif kind == "bär":
        for sd in (-1, 1):
            ball(*(hc + side * sd * 0.03 * s + UP * 0.03 * s), 0.015 * s, m, hid, seg=10, name="Ohr")
    elif kind == "fuchs":
        for sd in (-1, 1):
            cone(*(hc + side * sd * 0.022 * s + UP * 0.045 * s), 0.014 * s, 0.0, 0.035 * s, m, hid, verts=8, name="Ohr")
    for sd in (-1, 1):
        ball(*(hc + f * 0.038 * s + side * sd * 0.014 * s + UP * 0.006 * s), 0.0055 * s, DARK, hid, seg=8, name="Auge")


# ============================================================== Smart Kiddo Cube
FOX = (0.93, 0.45, 0.12)
CUBE_ANIMALS = {"fuchs": FOX, "hase": (0.93, 0.78, 0.76), "bär": (0.62, 0.42, 0.27), "igel": (0.70, 0.52, 0.36),
                "katze": (0.62, 0.62, 0.66), "eule": (0.72, 0.55, 0.36), "ente": (0.98, 0.82, 0.25)}


def _basis(r, u, n):
    """Euler rotation whose local x/y/z axes are r/u/n."""
    return Matrix((tuple(r), tuple(u), tuple(n))).transposed().to_euler()


def relief(c, n, u, kind="fuchs", color=None, s=1.0, hid=None):
    """Small painted animal head as a low relief on a surface.

    c: centre on the surface, n: outward normal, u: picture 'up' (ears side). s=1: head radius 2.4 cm."""
    c, n, u = Vector(c), Vector(n).normalized(), Vector(u).normalized()
    r = u.cross(n).normalized()
    rot = _basis(r, u, n)
    color = color or CUBE_ANIMALS.get(kind, FOX)
    m = mat(color, 0.5, coat=0.2)
    white = mat((0.97, 0.95, 0.90), 0.5)

    def P(a, b, h):
        return c + r * a * s + u * b * s + n * h * s

    def B(a, b, h, rad, mm, sc=(1, 1, 1), seg=16):
        return ball(*P(a, b, h), rad * s, mm, hid, scale=sc, rot=rot, seg=seg, name="Tierbild")

    def ear(a, b, h, d_u, d_n, length, rad, mm, sharp=True):
        d = (u * d_u + n * d_n).normalized()
        p0 = P(a, b, h)
        if sharp:
            o = cone(*(p0 + d * length * s * 0.5), rad * s, 0.0008, length * s, mm, hid, verts=10, name="Ohr")
            o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
        else:
            capsule(p0, p0 + d * length * s, rad * s, mm, hid, flat=0.55, seg=12, name="Ohr")

    def eyes(b=0.0, h=0.0125, gap=0.0095, rad=0.0032):
        for sd in (-1, 1):
            B(sd * gap, b, h, rad, DARK, seg=10)

    if kind == "fuchs":
        B(0, 0.0, 0.004, 0.024, m, (1.0, 0.86, 0.42), 20)
        for sd in (-1, 1):
            ear(sd * 0.014, 0.014, 0.006, 0.55, 0.85, 0.026, 0.009, m)
            ear(sd * 0.014, 0.016, 0.009, 0.55, 0.85, 0.012, 0.004, DARK)
        B(0, -0.013, 0.008, 0.012, white, (1.15, 0.95, 0.6))
        B(0, -0.024, 0.011, 0.0042, DARK, seg=10)
        eyes(0.002)
    elif kind == "hase":
        B(0, -0.002, 0.004, 0.022, m, (0.95, 0.95, 0.45), 20)
        for sd in (-1, 1):
            ear(sd * 0.008, 0.012, 0.008, 0.45, 0.9, 0.03, 0.0065, m, sharp=False)
        B(0, -0.014, 0.010, 0.009, white, (1.2, 0.9, 0.6))
        B(0, -0.018, 0.013, 0.0035, mat((0.9, 0.45, 0.5), 0.4), seg=10)
        eyes(0.0)
    elif kind == "bär":
        B(0, 0.0, 0.004, 0.024, m, (1.0, 0.95, 0.42), 20)
        for sd in (-1, 1):
            B(sd * 0.018, 0.015, 0.01, 0.008, m, (1, 1, 0.8), 12)
        B(0, -0.011, 0.01, 0.0105, mat((0.86, 0.70, 0.52), 0.5), (1.2, 0.9, 0.55))
        B(0, -0.018, 0.013, 0.0042, DARK, seg=10)
        eyes(0.004)
    elif kind == "igel":
        B(0, 0.003, 0.004, 0.023, mat((0.36, 0.26, 0.18), 0.7), (1.0, 0.95, 0.45), 20)
        for k in range(9):
            a = math.pi * (0.1 + 0.8 * k / 8)
            ear(math.cos(a) * 0.016, 0.006 + math.sin(a) * 0.012, 0.008, 0.6, 0.8, 0.014, 0.004,
                mat((0.30, 0.22, 0.16), 0.7))
        B(0, -0.010, 0.009, 0.013, m, (1.0, 1.2, 0.55))
        B(0, -0.024, 0.011, 0.0038, DARK, seg=10)
        eyes(-0.008, 0.015, 0.0075)
    elif kind == "katze":
        B(0, 0.0, 0.004, 0.023, m, (1.0, 0.9, 0.42), 20)
        for sd in (-1, 1):
            ear(sd * 0.014, 0.012, 0.006, 0.25, 0.97, 0.018, 0.009, m)
        B(0, -0.012, 0.009, 0.009, white, (1.3, 0.8, 0.6))
        B(0, -0.012, 0.013, 0.0035, mat((0.9, 0.45, 0.5), 0.4), seg=10)
        eyes(0.003, 0.0125, 0.0095, 0.0036)
    elif kind == "eule":
        B(0, 0.0, 0.004, 0.024, m, (1.0, 1.0, 0.42), 20)
        for sd in (-1, 1):
            B(sd * 0.0095, 0.0, 0.010, 0.0085, white, (1, 1, 0.5), 14)
            B(sd * 0.0095, -0.001, 0.0135, 0.0042, DARK, seg=10)
            ear(sd * 0.016, 0.016, 0.006, 0.5, 0.86, 0.016, 0.006, m)
        B(0, -0.011, 0.012, 0.004, mat(OCHRE, 0.4), (1, 1.4, 1), 10)
    elif kind == "ente":
        B(0, 0.002, 0.004, 0.022, m, (1.0, 1.0, 0.45), 20)
        B(0, -0.018, 0.009, 0.010, mat((0.95, 0.50, 0.15), 0.4), (1.3, 0.9, 0.45))
        eyes(0.004)
    else:
        B(0, 0, 0.004, 0.022, m, (1, 1, 0.45), 16)
        eyes(0.0)


def kiddo_cube(x, y, z, animal="fuchs", color=None, hid=None, gebaerden=False, face=-90, s=0.08):
    """Smart Kiddo Cube: birch cube (~8 cm) with the child's animal as a relief on top.

    gebaerden=True: same cube outside, plus a tiny dark screen on the front face and a small listening light.
    face: direction the animal (and the screen) looks to. z is the bottom of the cube. Returns useful points."""
    f = fvec(face)
    rbox(x - s / 2, y - s / 2, z, x + s / 2, y + s / 2, z + s, mat((0.88, 0.74, 0.54), 0.5, noise=0.07, nscale=40.0,
         coat=0.15, name="Birke"), hid, r=s * 0.1, seg=3, name="Cube")
    top = Vector((x, y, z + s))
    relief(top, UP, -f, animal, color, s / 0.08, hid)
    pts = {"top": tuple(top + UP * 0.015), "centre": (x, y, z + s / 2)}
    if gebaerden:
        side = (-f).cross(UP).normalized()
        fc = Vector((x, y, z + s * 0.56)) + f * (s / 2)
        scr = rbox(-s * 0.27, -0.0015, -s * 0.2, s * 0.27, 0.0015, s * 0.2,
                   mat((0.07, 0.09, 0.11), 0.15, emission=(0.35, 0.55, 0.75), strength=0.35, coat=0.8), hid,
                   r=0.003, rot=(0, 0, R(face - 90)), name="Bildschirm")
        scr.location = fc + f * 0.0012
        # a tiny hand on the screen (the sign being shown)
        ball(*(fc + f * 0.0032 + UP * 0.002), s * 0.07, mat((0.95, 0.82, 0.62), 0.4, emission=(1.0, 0.85, 0.65),
             strength=1.2), hid, scale=(0.8, 0.3, 1.0), rot=(0, 0, R(face - 90)), seg=10, name="Gebärde")
        ball(*(fc + f * 0.0032 + UP * 0.012 + side * 0.004), s * 0.025, mat((0.95, 0.82, 0.62), 0.4,
             emission=(1.0, 0.85, 0.65), strength=1.2), hid, scale=(0.8, 0.3, 1.6), rot=(0, 0, R(face - 90)), seg=8,
             name="Gebärde")
        lp = Vector((x, y, z + s * 0.2)) + f * (s / 2 + 0.001) + side * (s * 0.3)
        ball(*lp, s * 0.045, mat((0.5, 1.0, 0.6), 0.3, emission=(0.4, 1.0, 0.55), strength=9.0), hid, seg=10,
             name="Zuhör-Licht")
        pts["screen"] = tuple(fc)
        pts["light"] = tuple(lp)
    return pts


# ============================================================== room shell
SLAB = 0.32


def room_base(W, D, floor_m=None, base_m=None, margin=0.0):
    """Diorama base: a slab of multiplex (ply layers visible at the cut) with the floor on top."""
    base_m = base_m or multiplex("Z", 22.0)
    box(-0.2 - margin, -margin, -SLAB, W + margin, D + 0.2 + margin, -0.02, base_m, bev=0.006, seg=1, name="Sockel")
    box(-0.2 - margin, -margin, -0.02, W + margin, D + 0.2 + margin, 0.0, floor_m or planks(), name="Boden")


def wall(axis, fixed, a0, a1, h=2.75, t=0.18, openings=(), m=None, hid=None, glass=None, frame_m=None, sill=True,
         cap=True, backdrop=True):
    """Wall along x (axis='x', occupying y=fixed..fixed+t) or along y (axis='y', x=fixed-t..fixed).
    openings: (a0, a1, z0, z1, kind) with kind window | door | open | hatch."""
    m = m or WALL
    frame_m = frame_m or multiplex("X" if axis == "y" else "Y", 100.0)
    ops = sorted(openings)
    cur = a0

    def piece(b0, b1, z0, z1):
        if b1 - b0 < 1e-4 or z1 - z0 < 1e-4:
            return
        if axis == "x":
            box(b0, fixed, z0, b1, fixed + t, z1, m, hid, name="Wand")
        else:
            box(fixed - t, b0, z0, fixed, b1, z1, m, hid, name="Wand")

    def frame_box(b0, b1, c0, c1, depth_out=0.012):
        if axis == "x":
            panel(b0, fixed - depth_out, c0, b1, fixed + t + depth_out, c1, None, name="Rahmen")
        else:
            panel(fixed - t - depth_out, b0, c0, fixed + depth_out, b1, c1, None, name="Rahmen")


    def opening(o0, o1, z0, z1, kind):
        fw = 0.055
        if kind in ("window", "door", "open", "hatch"):
            frame_box(o0, o1, z1 - fw, z1)
            lo = z0 + fw if z0 > 0.05 else z0
            frame_box(o0, o0 + fw, lo, z1 - fw)
            frame_box(o1 - fw, o1, lo, z1 - fw)
            if z0 > 0.05:
                frame_box(o0, o1, z0, z0 + fw)
        if kind == "door" and backdrop:
            cm = mat((0.72, 0.66, 0.58), 0.9, name="Flur")
            if axis == "x":
                box(o0 + fw, fixed + t - 0.02, 0, o1 - fw, fixed + t - 0.005, z1, cm, None, name="Flur")
            else:
                box(fixed - t + 0.005, o0 + fw, 0, fixed - t + 0.02, o1 - fw, z1, cm, None, name="Flur")
        if kind in ("window", "open") and (kind == "window" or backdrop):
            gm = glass or garden_glass()
            if kind == "window":
                mid = fixed + t / 2 if axis == "x" else fixed - t / 2
            else:
                mid = fixed + t - 0.012 if axis == "x" else fixed - t + 0.012
            if axis == "x":
                g = box(o0 + fw, mid - 0.01, z0 + fw, o1 - fw, mid + 0.01, z1 - fw, gm, None, name="Glas")
            else:
                g = box(mid - 0.01, o0 + fw, z0 + fw, mid + 0.01, o1 - fw, z1 - fw, gm, None, name="Glas")
            g.visible_shadow = False
            if kind == "window" and sill and z0 > 0.1:
                if axis == "x":
                    panel(o0 - 0.06, fixed - 0.2, z0 - 0.035, o1 + 0.06, fixed + 0.02, z0, None, name="Fensterbank")
                else:
                    panel(fixed - 0.02, o0 - 0.06, z0 - 0.035, fixed + 0.2, o1 + 0.06, z0, None, name="Fensterbank")

    spans = {}
    for (o0, o1, z0, z1, kind) in ops:
        spans.setdefault((o0, o1), []).append((z0, z1, kind))
    for (o0, o1) in sorted(spans):
        piece(cur, o0, 0, h)
        zs = sorted(spans[(o0, o1)])
        zc = 0.0
        for (z0, z1, kind) in zs:
            piece(o0, o1, zc, z0)
            zc = z1
        piece(o0, o1, zc, h)
        for (z0, z1, kind) in zs:
            opening(o0, o1, z0, z1, kind)
        cur = max(cur, o1)
    piece(cur, a1, 0, h)
    if cap:  # multiplex cap on the cut wall: reads like a model
        if axis == "x":
            panel(a0, fixed - 0.005, h, a1, fixed + t + 0.005, h + 0.03, None, freq=60.0, name="Wandkappe")
        else:
            panel(fixed - t - 0.005, a0, h + 0.002, fixed + 0.005, a1, h + 0.032, None, freq=60.0, name="Wandkappe")


def wainscot(axis, fixed, a0, a1, h=1.1, skip=(), hid=None, ledge=True, grid=1.22, t=0.018):
    """Multiplex panelling on the room side of a wall, with joints and a ledge on top."""
    spans = [(a0, a1)]
    for s0, s1 in skip:
        new = []
        for b0, b1 in spans:
            if s1 <= b0 or s0 >= b1:
                new.append((b0, b1))
                continue
            if s0 > b0:
                new.append((b0, s0))
            if s1 < b1:
                new.append((s1, b1))
        spans = new
    for b0, b1 in spans:
        p = b0
        while p < b1 - 0.02:
            q = min(b1, p + grid)
            if axis == "x":
                panel(p + 0.003, fixed - t, 0.0, q - 0.003, fixed, h, hid, name="Wandpaneel")
            else:
                panel(fixed, p + 0.003, 0.0, fixed + t, q - 0.003, h, hid, name="Wandpaneel")
            p = q
        if ledge:
            if axis == "x":
                panel(b0, fixed - 0.09, h, b1, fixed, h + 0.022, hid, name="Bilderleiste")
            else:
                panel(fixed, b0, h, fixed + 0.09, b1, h + 0.022, hid, name="Bilderleiste")


def shelf(axis, fixed, a0, a1, h=0.9, depth=0.36, rows=2, hid=None, fill=True, back=True):
    """Low open multiplex shelf standing against a wall (room side). Returns shelf-top z."""
    t = 0.022
    n = max(1, int((a1 - a0) / 0.45))
    cell = (a1 - a0) / n

    def P_(u0, u1, d0, d1, z0, z1):
        if axis == "x":
            panel(u0, fixed - d1, z0, u1, fixed - d0, z1, hid, name="Regal")
        else:
            panel(fixed + d0, u0, z0, fixed + d1, u1, z1, hid, name="Regal")

    for r in range(rows + 1):
        z = r * (h - t) / rows
        P_(a0, a1, 0, depth, z, z + t)
    for k in range(n + 1):
        u = a0 + k * cell
        P_(u - t / 2 if k else u, u + t / 2 if k < n else u, 0, depth, 0, h)
    if back:
        P_(a0, a1, 0, 0.012, 0, h)
    if fill:
        for r in range(rows):
            z = r * (h - t) / rows + t
            for k in range(n):
                u0, u1 = a0 + k * cell + 0.03, a0 + (k + 1) * cell - 0.03
                um = (u0 + u1) / 2
                kind = random.choice(["basket", "books", "books", "basket", "rainbow", "blocks"])
                dm = depth / 2
                if axis == "x":
                    cx, cy = um, fixed - dm
                else:
                    cx, cy = fixed + dm, um
                if kind == "basket":
                    basket(cx, cy, z, min(cell, depth) * 0.36, (h - t) / rows * 0.55, hid,
                           fill=random.choice(["wool", "toys", "blocks", None]))
                elif kind == "books":
                    if axis == "x":
                        books(u0, fixed - dm, z, u1, "x", hid, depth * 0.6)
                    else:
                        books(u0, fixed + dm, z, u1, "y", hid, depth * 0.6)
                elif kind == "rainbow" and (h - t) / rows > 0.22:
                    rainbow(cx, cy, z, 0.85, 0 if axis == "x" else 90, hid)
                elif kind == "blocks":
                    for j in range(4):
                        c = BLOCKC[j % len(BLOCKC)]
                        box(cx - 0.12 + j * 0.065, cy - 0.04, z, cx - 0.07 + j * 0.065, cy + 0.04, z + 0.05 + (j % 2) * 0.05,
                            mat(c, 0.5, coat=0.2), hid, bev=0.006, name="Klotz")
    return h


# ============================================================== light & camera
cam = None


def light(time="morgen", sun_az=None, sun_el=None, strength=None, world=None, fill=None, target=(3, 3, 1)):
    world = float(os.environ.get("BH_WORLD", "0.3")) if world is None else world
    fill = float(os.environ.get("BH_FILL", "0.6")) if fill is None else fill
    sun_mul = float(os.environ.get("BH_SUN", "1.3"))
    cfg = {
        "morgen": dict(az=128, el=24, e=4.2, col=(1.0, 0.82, 0.62), w=(0.98, 0.92, 0.86)),
        "vormittag": dict(az=118, el=34, e=4.2, col=(1.0, 0.90, 0.76), w=(0.97, 0.94, 0.90)),
        "mittag": dict(az=105, el=46, e=4.0, col=(1.0, 0.95, 0.88), w=(0.96, 0.95, 0.93)),
        "nachmittag": dict(az=150, el=20, e=4.4, col=(1.0, 0.74, 0.50), w=(0.98, 0.88, 0.80)),
        "tag": dict(az=120, el=38, e=3.8, col=(1.0, 0.94, 0.86), w=(0.95, 0.95, 0.96)),
        "aussen": dict(az=-35, el=36, e=4.4, col=(1.0, 0.92, 0.82), w=(0.88, 0.92, 0.97)),
    }[time]
    az = R(sun_az if sun_az is not None else cfg["az"])
    el = R(sun_el if sun_el is not None else cfg["el"])
    sd = bpy.data.lights.new("Sonne", "SUN")
    sd.energy = (strength or cfg["e"]) * sun_mul
    sd.angle = R(4)
    sd.color = cfg["col"]
    sun = bpy.data.objects.new("Sonne", sd)
    scene.collection.objects.link(sun)
    dv = Vector((-math.cos(el) * math.cos(az), -math.cos(el) * math.sin(az), -math.sin(el)))
    sun.rotation_euler = dv.to_track_quat("-Z", "Y").to_euler()
    w = bpy.data.worlds.new("Welt")
    w.use_nodes = True
    bg = w.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (*cfg["w"], 1)
    bg.inputs["Strength"].default_value = world
    scene.world = w
    if fill:
        fd = bpy.data.lights.new("Fill", "AREA")
        fd.energy = 900 * fill
        fd.size = 8
        fd.color = (1.0, 0.92, 0.84)
        fo = bpy.data.objects.new("Fill", fd)
        scene.collection.objects.link(fo)
        tgt = Vector(target)
        fo.location = tgt + Vector((7, -7, 6))
        fo.rotation_euler = (tgt - fo.location).to_track_quat("-Z", "Y").to_euler()
        fo.visible_camera = False
    return sun


def iso_camera(target, ortho, rx=57, rz=42, aspect=0.8, res=1600):
    global cam
    cd = bpy.data.cameras.new("Iso")
    cd.type = "ORTHO"
    cd.ortho_scale = ortho
    cd.clip_end = 600
    cam = bpy.data.objects.new("Iso", cd)
    scene.collection.objects.link(cam)
    cam.rotation_euler = (R(rx), 0, R(rz))
    dv = cam.rotation_euler.to_matrix() @ Vector((0, 0, -1))
    cam.location = Vector(target) - dv * 150
    scene.camera = cam
    scene.render.resolution_x = res
    scene.render.resolution_y = int(res * aspect)
    return cam


def persp_camera(loc, target, lens=50, fstop=2.8, aspect=0.72, res=1400, focus=None):
    global cam
    cd = bpy.data.cameras.new("Nah")
    cd.lens = lens
    cd.clip_start = 0.02
    cd.clip_end = 200
    cam = bpy.data.objects.new("Nah", cd)
    scene.collection.objects.link(cam)
    cam.location = loc
    cam.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    if fstop:
        cd.dof.use_dof = True
        cd.dof.aperture_fstop = fstop
        cd.dof.focus_distance = focus or (Vector(target) - Vector(loc)).length
    scene.camera = cam
    scene.render.resolution_x = res
    scene.render.resolution_y = int(res * aspect)
    return cam


# ============================================================== output
def finish(args, name, opaque=False, exposure=-0.3):
    bpy.context.view_layer.update()

    def proj(p):
        co = world_to_camera_view(scene, cam, Vector(p))
        return [round(co.x, 4), round(1 - co.y, 4)]

    os.makedirs(args.out, exist_ok=True)
    hids = sorted({o.get("hid", "") for o in objects if o.get("hid")})
    id_colors = {h: ((k % 8) * 32 + 16, ((k // 8) % 8) * 32 + 16, ((k // 64) % 4) * 64 + 32) for k, h in enumerate(hids, start=1)}
    meta = {"name": name, "res": [scene.render.resolution_x, scene.render.resolution_y],
            "anchors": {k: proj(v) for k, v in ANCH.items()},
            "paths": {k: [proj(p) for p in pts] for k, pts in PATHS.items()},
            "colors": id_colors}
    with open(os.path.join(args.out, f"{name}.json"), "w") as f:
        json.dump(meta, f, indent=1)
    if os.environ.get("BH_ANCHORS_ONLY"):
        print("ANCHORS", name)
        return
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.render.film_transparent = not opaque
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.resolution_percentage = 100
    if args.pas == "id":
        def lin(c):
            c = c / 255.0
            return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
        hold = bpy.data.materials.new("hold")
        hold.use_nodes = True
        nt = hold.node_tree
        for n in list(nt.nodes):
            nt.nodes.remove(n)
        out = nt.nodes.new("ShaderNodeOutputMaterial")
        nt.links.new(nt.nodes.new("ShaderNodeHoldout").outputs[0], out.inputs[0])
        flat = {}
        for h, (r, g, b) in id_colors.items():
            m = bpy.data.materials.new("id_" + h)
            m.use_nodes = True
            nt = m.node_tree
            for n in list(nt.nodes):
                nt.nodes.remove(n)
            out = nt.nodes.new("ShaderNodeOutputMaterial")
            em = nt.nodes.new("ShaderNodeEmission")
            em.inputs["Color"].default_value = (lin(r), lin(g), lin(b), 1)
            nt.links.new(em.outputs[0], out.inputs[0])
            flat[h] = m
        for o in bpy.data.objects:
            if o.type not in ("MESH", "CURVE", "FONT"):
                continue
            h = o.get("hid", "")
            o.data.materials.clear()
            o.data.materials.append(flat.get(h, hold))
            o.visible_shadow = True
        w = bpy.data.worlds.new("w")
        w.use_nodes = True
        w.node_tree.nodes["Background"].inputs["Strength"].default_value = 0
        scene.world = w
        for ob in list(bpy.data.objects):
            if ob.type == "LIGHT":
                bpy.data.objects.remove(ob, do_unlink=True)
        if cam.data.type != "ORTHO":
            cam.data.dof.use_dof = False
        scene.render.film_transparent = True
        scene.cycles.samples = 1
        scene.cycles.use_denoising = False
        scene.cycles.max_bounces = 0
        scene.cycles.filter_width = 0.01
        scene.cycles.pixel_filter_type = "BOX"
        scene.render.dither_intensity = 0
        scene.view_settings.view_transform = "Standard"
        scene.view_settings.look = "None"
        scene.render.filepath = os.path.join(args.out, f"{name}_id.png")
    else:
        scene.cycles.samples = args.samples
        scene.cycles.use_denoising = True
        scene.cycles.max_bounces = 6
        scene.cycles.transparent_max_bounces = 4
        vt = os.environ.get("BH_VT", "Khronos PBR Neutral")
        scene.view_settings.view_transform = vt
        if vt == "AgX":
            scene.view_settings.look = os.environ.get("BH_LOOK", "AgX - Punchy")
        scene.view_settings.exposure = exposure + float(os.environ.get("BH_EXP", "0"))
        scene.render.filepath = os.path.join(args.out, f"{name}.png")
    if getattr(args, "save_blend", False) or getattr(args, "blend_only", False):
        bpy.ops.wm.save_as_mainfile(filepath=os.path.join(args.out, f"{name}.blend"))
        if getattr(args, "blend_only", False):
            print("SAVED", os.path.join(args.out, f"{name}.blend"))
            return
    bpy.ops.render.render(write_still=True)
    print("RENDERED", scene.render.filepath)


def fit_iso(points, margin=0.035):
    """Re-center and scale the current ortho camera so all points fit."""
    bpy.context.view_layer.update()
    cs = [world_to_camera_view(scene, cam, Vector(p)) for p in points]
    x0, x1 = min(c.x for c in cs), max(c.x for c in cs)
    y0, y1 = min(c.y for c in cs), max(c.y for c in cs)
    aspect = scene.render.resolution_y / scene.render.resolution_x
    sx = (x1 - x0) / (1 - 2 * margin)
    sy = (y1 - y0) / (1 - 2 * margin)
    k = max(sx, sy)
    # shift camera in its own plane to the centre of the points
    mw = cam.matrix_world
    right = mw.to_3x3() @ Vector((1, 0, 0))
    up = mw.to_3x3() @ Vector((0, 1, 0))
    o = cam.data.ortho_scale
    cx, cy = (x0 + x1) / 2 - 0.5, (y0 + y1) / 2 - 0.5
    cam.location = cam.location + right * cx * o + up * cy * o * aspect
    cam.data.ortho_scale = o * k
    bpy.context.view_layer.update()


def box_corners(x0, y0, z0, x1, y1, z1):
    return [(x, y, z) for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)]


def camera_only(o):
    """Visible to the camera only (ceilings for close-ups)."""
    o.visible_shadow = False
    o.visible_diffuse = False
    o.visible_glossy = False
    o.visible_transmission = False
    o.visible_volume_scatter = False
    return o


def glassy(color=(0.85, 0.93, 0.96), rough=0.04):
    key = ("glassy", color, rough)
    if key in _M:
        return _M[key]
    m = bpy.data.materials.new("Glas klar")
    nb = NB(m)
    nb.bsdf.inputs["Base Color"].default_value = (*color, 1)
    nb.bsdf.inputs["Transmission Weight"].default_value = 1.0
    nb.bsdf.inputs["Roughness"].default_value = rough
    nb.bsdf.inputs["IOR"].default_value = 1.2
    _M[key] = m
    return m


def mirror():
    return mat((0.92, 0.94, 0.95), 0.03, metal=1.0, name="Spiegel")


def pegboard(color=BIRCH):
    key = ("peg", color)
    if key in _M:
        return _M[key]
    m = bpy.data.materials.new("Lochwand")
    nb = NB(m)
    co = nb.sep(nb.coord("Object"))
    u = nb.math("SUBTRACT", nb.math("FRACT", nb.math("MULTIPLY", co["X"], 12.0)), 0.5)
    v = nb.math("SUBTRACT", nb.math("FRACT", nb.math("MULTIPLY", co["Z"], 12.0)), 0.5)
    d = nb.math("SQRT", nb.math("ADD", nb.math("MULTIPLY", u, u), nb.math("MULTIPLY", v, v)))
    hole = nb.math("LESS_THAN", d, 0.16)
    nb.color(nb.mix(hole, color, (0.35, 0.26, 0.18)))
    nb.bsdf.inputs["Roughness"].default_value = 0.55
    _M[key] = m
    return m
