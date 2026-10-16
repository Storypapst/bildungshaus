"""Contact sheet of the v3 renders: python3 contact_v3.py renders"""
import os
import sys
from PIL import Image, ImageDraw, ImageFont

D = sys.argv[1] if len(sys.argv) > 1 else "renders"
NAMES = ["aussen", "halle_745", "halle_745z_fenster", "halle_745_fenster", "halle_800", "halle_800_obelisk", "halle_915",
         "kaufladen", "kaufladen_kasse", "waschraum_1145", "waschraum_aus_becken", "waschraum_1145_becken", "bistro",
         "bistro_daumen", "abholung", "abholung_faecher", "abholung_wunsch", "fachwand", "werkstatt", "werkstatt_kaestchen",
         "ausblick"]
TW, TH, COLS = 480, 384, 4
names = [n for n in NAMES if os.path.exists(os.path.join(D, n + ".png"))]
rows = (len(names) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * TW, rows * (TH + 28)), (246, 241, 232))
dr = ImageDraw.Draw(sheet)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
except OSError:
    font = ImageFont.load_default()
for i, n in enumerate(names):
    im = Image.open(os.path.join(D, n + ".png")).convert("RGBA")
    im.thumbnail((TW - 8, TH - 8))
    bg = Image.new("RGBA", im.size, (246, 241, 232, 255))
    bg.alpha_composite(im)
    x, y = (i % COLS) * TW, (i // COLS) * (TH + 28)
    sheet.paste(bg.convert("RGB"), (x + (TW - im.width) // 2, y + (TH - im.height) // 2))
    dr.text((x + 8, y + TH + 4), n, fill=(60, 45, 35), font=font)
out = os.path.join(D, "contact_v3.png")
sheet.save(out)
print(out, len(names), "renders")
