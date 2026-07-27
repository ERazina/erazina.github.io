from io import BytesIO
from pathlib import Path
import shutil

from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, NumberObject, RectangleObject
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
SOURCE_PDF = ROOT / "Elina_Razina_Resume.pdf"
OUTPUT_PDF = ROOT / "output" / "pdf" / "Elina_Razina_Resume_RU.pdf"
PUBLIC_PDF = ROOT / "public" / "Elina_Razina_Resume_RU.pdf"
DEMO_URL = "https://erazina.github.io/app/"

ACCENT = colors.HexColor("#F5823D")
ACCENT_SOFT = colors.HexColor("#FFF4EC")
INK = colors.HexColor("#242126")
MUTED = colors.HexColor("#5F5A60")


def register_fonts():
    regular = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
    bold = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")

    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("ResumeRu", str(regular)))
        pdfmetrics.registerFont(TTFont("ResumeRu-Bold", str(bold)))
        return "ResumeRu", "ResumeRu-Bold"

    return "Helvetica", "Helvetica-Bold"


FONT, FONT_BOLD = register_fonts()


def build_overlay(width, height):
    packet = BytesIO()
    overlay = canvas.Canvas(packet, pagesize=(width, height))

    x = 59
    y = 78
    box_width = width - 118
    box_height = 120
    padding = 16

    overlay.setFillColor(ACCENT_SOFT)
    overlay.setStrokeColor(colors.HexColor("#F3C4A6"))
    overlay.setLineWidth(0.8)
    overlay.roundRect(x, y, box_width, box_height, 10, fill=1, stroke=1)

    overlay.setFillColor(ACCENT)
    overlay.roundRect(x, y, 4, box_height, 2, fill=1, stroke=0)

    overlay.setFillColor(INK)
    overlay.setFont(FONT_BOLD, 11.2)
    overlay.drawString(x + padding, y + box_height - 23, "Enterprise-проекты и NDA")

    body_style = ParagraphStyle(
        "NdaBody",
        fontName=FONT,
        fontSize=8.2,
        leading=10.5,
        textColor=MUTED,
        alignment=TA_LEFT,
    )
    body = Paragraph(
        "Большинство моих коммерческих проектов - enterprise-приложения с "
        "закрытым доступом, защищённые NDA. Я не могу публиковать их исходный "
        "код и рабочие интерфейсы, поэтому показываю интерактивные demo-проекты, "
        "демонстрирующие мои навыки.",
        body_style,
    )
    body_width = box_width - 2 * padding
    body.wrapOn(overlay, body_width, 50)
    body.drawOn(overlay, x + padding, y + 45)

    overlay.setFillColor(ACCENT)
    overlay.setFont(FONT_BOLD, 8.5)
    link_x = x + padding
    link_y = y + 18
    overlay.drawString(link_x, link_y, "Demo-проект: erazina.github.io/app/")
    overlay.save()

    packet.seek(0)
    return PdfReader(packet), RectangleObject(
        [link_x, link_y - 3, link_x + 190, link_y + 10]
    )


def main():
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)

    reader = PdfReader(SOURCE_PDF)
    writer = PdfWriter()
    last_page_number = len(reader.pages) - 1

    for page_number, page in enumerate(reader.pages):
        if page_number == last_page_number:
            width = float(page.mediabox.width)
            height = float(page.mediabox.height)
            overlay_reader, link_rect = build_overlay(width, height)
            page.merge_page(overlay_reader.pages[0])
        writer.add_page(page)

    writer.add_metadata(
        {
            "/Title": "Элина Разина - резюме Frontend-разработчика",
            "/Author": "Элина Разина",
            "/Subject": "Резюме Frontend-разработчика",
        }
    )
    writer.add_uri(
        last_page_number,
        DEMO_URL,
        link_rect,
        border=ArrayObject([NumberObject(0), NumberObject(0), NumberObject(0)]),
    )

    with OUTPUT_PDF.open("wb") as output:
        writer.write(output)

    shutil.copy2(OUTPUT_PDF, PUBLIC_PDF)
    print(f"Generated {OUTPUT_PDF}")
    print(f"Copied to {PUBLIC_PDF}")


if __name__ == "__main__":
    main()
