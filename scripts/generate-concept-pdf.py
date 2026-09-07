#!/usr/bin/env python3
"""Build the public Bildungshaus concept PDF from the canonical Core document."""

from __future__ import annotations

import html
import os
import re
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

ROOT = Path(__file__).resolve().parents[1]
CORE = Path(os.environ.get("BILDUNGSHAUS_CORE", ""))
SOURCE = CORE / "10 - Concepts & Arguments/Whitepaper - Das Bildungshaus.md"
OUTPUT = ROOT / "public/dokumente/konzept.pdf"
IMAGES = ROOT / "public/images"

AMBER = colors.HexColor("#C46C2B")
AMBER_LIGHT = colors.HexColor("#F2DFC4")
SLATE = colors.HexColor("#25313A")
SLATE_SOFT = colors.HexColor("#607078")
PAPER = colors.HexColor("#FBF7EF")


def register_fonts() -> None:
    base = Path("/System/Library/Fonts/Supplemental")
    fonts = {
        "Body": base / "Georgia.ttf",
        "BodyItalic": base / "Georgia Italic.ttf",
        "BodyBold": base / "Georgia Bold.ttf",
        "Display": base / "Avenir Next.ttc",
    }
    # Avenir Next is a TTC that ReportLab can read by subfont index.
    pdfmetrics.registerFont(TTFont("Body", str(fonts["Body"])))
    pdfmetrics.registerFont(TTFont("BodyItalic", str(fonts["BodyItalic"])))
    pdfmetrics.registerFont(TTFont("BodyBold", str(fonts["BodyBold"])))
    try:
        pdfmetrics.registerFont(TTFont("Display", str(fonts["Display"]), subfontIndex=0))
    except Exception:
        pdfmetrics.registerFont(TTFont("Display", str(base / "Arial.ttf")))


def link_target(target: str) -> str:
    if target.startswith(("http://", "https://", "mailto:")):
        return target
    match = re.search(r"/(P\d{2})\s+-", target)
    if match:
        return f"https://dreambau.com/bildungshaus/#lesen/{match.group(1)}"
    if target.endswith("Synthesen/README.md"):
        return "https://dreambau.com/bildungshaus/#bibliothek"
    if target.endswith("Synthesen/Quellenregister.md"):
        return "https://dreambau.com/bildungshaus/#lesen/quellen"
    return "https://dreambau.com/bildungshaus/"


def inline_markup(text: str) -> str:
    tokens: list[str] = []

    def keep(value: str) -> str:
        tokens.append(value)
        return f"@@TOKEN{len(tokens)-1}@@"

    def replace_link(match: re.Match[str]) -> str:
        label, target = match.group(1), match.group(2).strip("<>")
        href = html.escape(link_target(target), quote=True)
        return keep(f'<link href="{href}" color="#A45520"><u>{html.escape(label)}</u></link>')

    text = re.sub(r"\[([^\]]+)\]\((<[^>]+>|[^)]+)\)", replace_link, text)
    escaped = html.escape(text)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", escaped)
    escaped = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", escaped)
    for index, token in enumerate(tokens):
        escaped = escaped.replace(f"@@TOKEN{index}@@", token)
    return escaped


def crop_image(path: Path, width: float, height: float) -> Image:
    with PILImage.open(path) as source:
        ratio = max(width / source.width, height / source.height)
        scaled = (int(source.width * ratio), int(source.height * ratio))
        source = source.resize(scaled, PILImage.Resampling.LANCZOS)
        left = (source.width - width) / 2
        top = (source.height - height) / 2
        source = source.crop((left, top, left + width, top + height)).convert("RGB")
        temp = ROOT / "tmp/pdfs/concept-cover.jpg"
        temp.parent.mkdir(parents=True, exist_ok=True)
        source.save(temp, quality=90)
    return Image(str(temp), width=width, height=height)


def illustration(path: Path, width: float = 58 * mm) -> Image:
    with PILImage.open(path) as source:
        source.thumbnail((900, 900), PILImage.Resampling.LANCZOS)
        source = source.convert("RGB")
        temp = ROOT / f"tmp/pdfs/{path.stem}.jpg"
        temp.parent.mkdir(parents=True, exist_ok=True)
        source.save(temp, quality=84, optimize=True)
        height = width * source.height / source.width
    return Image(str(temp), width=width, height=height)


def styles():
    sample = getSampleStyleSheet()
    return {
        "body": ParagraphStyle("Body", parent=sample["BodyText"], fontName="Body", fontSize=9.6, leading=15.2, textColor=SLATE, spaceAfter=4.5 * mm, splitLongWords=True, allowWidows=0, allowOrphans=0),
        "h2": ParagraphStyle("H2", parent=sample["Heading2"], fontName="Display", fontSize=20, leading=24, textColor=SLATE, spaceBefore=8 * mm, spaceAfter=4 * mm, keepWithNext=True),
        "lead": ParagraphStyle("Lead", parent=sample["BodyText"], fontName="BodyBold", fontSize=11.2, leading=17, textColor=SLATE, spaceAfter=6 * mm),
        "kicker": ParagraphStyle("Kicker", parent=sample["BodyText"], fontName="Display", fontSize=8, leading=10, textColor=AMBER, tracking=1.2, spaceAfter=3 * mm),
        "caption": ParagraphStyle("Caption", parent=sample["BodyText"], fontName="BodyItalic", fontSize=7.8, leading=10, textColor=SLATE_SOFT, spaceBefore=1.5 * mm, spaceAfter=5 * mm),
        "cover_brand": ParagraphStyle("CoverBrand", parent=sample["Title"], fontName="Display", fontSize=14, leading=17, textColor=AMBER, alignment=TA_CENTER, spaceAfter=13 * mm),
        "cover_title": ParagraphStyle("CoverTitle", parent=sample["Title"], fontName="Display", fontSize=38, leading=43, textColor=SLATE, alignment=TA_CENTER, spaceAfter=7 * mm),
        "cover_sub": ParagraphStyle("CoverSub", parent=sample["BodyText"], fontName="BodyItalic", fontSize=15, leading=22, textColor=SLATE_SOFT, alignment=TA_CENTER),
    }


def draw_cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setFillColor(AMBER)
    canvas.rect(0, A4[1] - 9 * mm, A4[0], 9 * mm, fill=1, stroke=0)
    canvas.restoreState()


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(PAPER)
    canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
    canvas.setStrokeColor(AMBER_LIGHT)
    canvas.line(24 * mm, 16 * mm, A4[0] - 24 * mm, 16 * mm)
    canvas.setFont("Display", 7.5)
    canvas.setFillColor(SLATE_SOFT)
    canvas.drawString(24 * mm, 10.5 * mm, "Bildungshaus weWeit · Konzept")
    canvas.drawRightString(A4[0] - 24 * mm, 10.5 * mm, str(doc.page - 1))
    canvas.restoreState()


def parse_content(markdown: str, style) -> list:
    markdown = re.sub(r"^---\n[\s\S]*?\n---\n", "", markdown).strip()
    lines = markdown.splitlines()
    story: list = []
    paragraph: list[str] = []
    illustrations = {
        "4.": ("mitwirkung.png", "Mitwirkung wird sichtbar, wenn auf ein Anliegen eine nachvollziehbare Folge entsteht."),
        "7.": ("kueche-gemeinsam.png", "Am Mittagstisch treffen Pädagogik, Alltag, Fachlichkeit und Wirtschaftlichkeit zusammen."),
        "9.": ("lernen-weitergeben.png", "Aus einem erprobten Ablauf wird erst mit dokumentierten Voraussetzungen ein übertragbarer Baustein."),
    }

    def flush():
        if not paragraph:
            return
        value = " ".join(p.strip() for p in paragraph)
        paragraph.clear()
        if value:
            target_style = style["lead"] if not any(isinstance(x, Paragraph) for x in story) else style["body"]
            story.append(Paragraph(inline_markup(value), target_style))

    for line in lines:
        if line.startswith("# "):
            continue
        if line.startswith("## "):
            flush()
            title = line[3:].strip()
            story.append(Paragraph(inline_markup(title), style["h2"]))
            for prefix, (filename, caption) in illustrations.items():
                if title.startswith(prefix):
                    art = illustration(IMAGES / filename)
                    story.append(KeepTogether([art, Paragraph(caption, style["caption"])]))
                    break
        elif line.strip() == "---":
            flush()
            story.append(Spacer(1, 4 * mm))
        elif not line.strip():
            flush()
        else:
            paragraph.append(line)
    flush()
    return story


def main() -> None:
    if not CORE or not SOURCE.is_file():
        raise SystemExit("Set BILDUNGSHAUS_CORE to the routed Bildungshaus Core")
    register_fonts()
    style = styles()
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    page = PageTemplate("content", [Frame(24 * mm, 21 * mm, A4[0] - 48 * mm, A4[1] - 39 * mm, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=draw_page)
    cover = PageTemplate("cover", [Frame(27 * mm, 19 * mm, A4[0] - 54 * mm, A4[1] - 36 * mm, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=draw_cover)
    doc = BaseDocTemplate(str(OUTPUT), pagesize=A4, pageTemplates=[cover, page], title="Bildungshaus weWeit - Konzept", author="Bildungshaus weWeit", subject="Konzept", creator="Bildungshaus weWeit")
    art = crop_image(IMAGES / "gemeinsam-bildungshaus.png", 118 * mm, 78 * mm)
    story = [
        Spacer(1, 17 * mm),
        Paragraph("Bildungshaus weWeit", style["cover_brand"]),
        Paragraph("Konzept", style["cover_title"]),
        Paragraph("Gute Betreuung beginnt bei ihrem Alltag.", style["cover_sub"]),
        Spacer(1, 19 * mm),
        art,
        Spacer(1, 15 * mm),
        Paragraph("Stand · 7. September 2026", style["kicker"]),
        Paragraph("Zusammenhängende Argumentation mit Forschungsgrundlagen, Vertiefungen und offenen Untersuchungsfragen. Alle farbig markierten Verweise sind anklickbar.", style["caption"]),
        NextPageTemplate("content"),
        PageBreak(),
    ]
    story.extend(parse_content(SOURCE.read_text(encoding="utf-8"), style))
    doc.build(story)
    print(f"generated {OUTPUT}")


if __name__ == "__main__":
    main()
