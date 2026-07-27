from pathlib import Path
import shutil
from tempfile import TemporaryDirectory

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_PDF = OUTPUT_DIR / "Elina_Razina_Resume_EN.pdf"
PUBLIC_PDF = ROOT / "public" / "Elina_Razina_Resume_EN.pdf"
SOURCE_PDF = ROOT / "Elina_Razina_Resume.pdf"

PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN_X = 17 * mm
MARGIN_TOP = 15 * mm
MARGIN_BOTTOM = 17 * mm

INK = colors.HexColor("#1B1B1F")
MUTED = colors.HexColor("#6E6B70")
SOFT = colors.HexColor("#AAA5A0")
LINE = colors.HexColor("#DED9D0")
ACCENT = colors.HexColor("#F5823D")
ACCENT_SOFT = colors.HexColor("#FFF1E8")
WHITE = colors.white


def register_fonts():
    regular = Path("/System/Library/Fonts/Supplemental/Arial.ttf")
    bold = Path("/System/Library/Fonts/Supplemental/Arial Bold.ttf")
    italic = Path("/System/Library/Fonts/Supplemental/Arial Italic.ttf")

    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("ResumeSans", str(regular)))
        pdfmetrics.registerFont(TTFont("ResumeSans-Bold", str(bold)))
        if italic.exists():
            pdfmetrics.registerFont(TTFont("ResumeSans-Italic", str(italic)))
        else:
            pdfmetrics.registerFont(TTFont("ResumeSans-Italic", str(regular)))
        return "ResumeSans", "ResumeSans-Bold", "ResumeSans-Italic"

    return "Helvetica", "Helvetica-Bold", "Helvetica-Oblique"


FONT, FONT_BOLD, FONT_ITALIC = register_fonts()
styles = getSampleStyleSheet()

body = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName=FONT,
    fontSize=8.9,
    leading=11.4,
    textColor=INK,
    spaceAfter=3.2,
)
body_compact = ParagraphStyle(
    "BodyCompact",
    parent=body,
    fontSize=8.5,
    leading=10.7,
    spaceAfter=2.2,
)
small = ParagraphStyle(
    "Small",
    parent=body,
    fontSize=7.7,
    leading=9.6,
    textColor=MUTED,
    spaceAfter=2,
)
contact = ParagraphStyle(
    "Contact",
    parent=small,
    fontSize=8.1,
    leading=10.8,
    textColor=INK,
)
name_style = ParagraphStyle(
    "Name",
    parent=styles["Title"],
    fontName=FONT_BOLD,
    fontSize=25,
    leading=27,
    textColor=INK,
    spaceAfter=3,
)
headline = ParagraphStyle(
    "Headline",
    parent=body,
    fontName=FONT_BOLD,
    fontSize=12.5,
    leading=15,
    textColor=ACCENT,
    spaceAfter=5,
)
section_style = ParagraphStyle(
    "Section",
    parent=styles["Heading2"],
    fontName=FONT_BOLD,
    fontSize=12.2,
    leading=14.5,
    textColor=INK,
    spaceBefore=4,
    spaceAfter=3.5,
    keepWithNext=True,
)
company_style = ParagraphStyle(
    "Company",
    parent=body,
    fontName=FONT_BOLD,
    fontSize=11.2,
    leading=13.5,
    spaceAfter=1,
)
role_style = ParagraphStyle(
    "Role",
    parent=body,
    fontName=FONT_BOLD,
    fontSize=9.8,
    leading=12,
    textColor=ACCENT,
    spaceAfter=1.5,
)
date_style = ParagraphStyle(
    "Date",
    parent=small,
    fontName=FONT_BOLD,
    fontSize=7.8,
    leading=9.5,
    textColor=MUTED,
)
label_style = ParagraphStyle(
    "Label",
    parent=body,
    fontName=FONT_BOLD,
    fontSize=8.7,
    leading=10.8,
    textColor=INK,
    spaceBefore=2,
    spaceAfter=2,
)
bullet_style = ParagraphStyle(
    "Bullet",
    parent=body_compact,
    leftIndent=10,
    firstLineIndent=-6,
    bulletIndent=2,
    spaceAfter=2.3,
)
tag_style = ParagraphStyle(
    "Tag",
    parent=small,
    fontName=FONT_BOLD,
    fontSize=7.2,
    leading=8.8,
    alignment=TA_CENTER,
    textColor=INK,
)
footer_style = ParagraphStyle(
    "Footer",
    parent=small,
    fontSize=7.2,
    alignment=TA_CENTER,
    textColor=SOFT,
)


def p(text, style=body):
    return Paragraph(text, style)


def bullet(text):
    return Paragraph(f"- {text}", bullet_style)


def section(title):
    return [
        Spacer(1, 3),
        Paragraph(title.upper(), section_style),
        HRFlowable(
            width="100%",
            thickness=0.7,
            color=LINE,
            spaceBefore=0,
            spaceAfter=5,
        ),
    ]


def job_header(dates, duration, company, role, location=None):
    company_text = company
    if location:
        company_text += f'<br/><font name="{FONT}" size="8" color="#6E6B70">{location}</font>'

    right = [
        Paragraph(company_text, company_style),
        Paragraph(role, role_style),
    ]
    left = [
        Paragraph(dates, date_style),
        Paragraph(duration, small),
    ]
    table = Table(
        [[left, right]],
        colWidths=[35 * mm, PAGE_WIDTH - 2 * MARGIN_X - 35 * mm],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 7),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
            ]
        )
    )
    return table


def label(text):
    return Paragraph(text, label_style)


def project(title, description, items):
    flow = [
        Paragraph(title, label_style),
        Paragraph(description, body_compact),
    ]
    flow.extend(bullet(item) for item in items)
    flow.append(Spacer(1, 2))
    return flow


def draw_page(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN_X, 11.5 * mm, PAGE_WIDTH - MARGIN_X, 11.5 * mm)
    footer = Paragraph(
        f"Elina Razina  |  Frontend Developer  |  Page {doc.page}",
        footer_style,
    )
    width, height = footer.wrap(PAGE_WIDTH - 2 * MARGIN_X, 7 * mm)
    footer.drawOn(canvas, MARGIN_X, 5.5 * mm)
    canvas.restoreState()


def extract_source_photo(target_dir):
    reader = PdfReader(str(SOURCE_PDF))
    images = list(reader.pages[0].images)
    if not images:
        raise ValueError("No profile photo found in the source resume")

    profile_image = max(images, key=lambda item: len(item.data))
    suffix = Path(profile_image.name).suffix or ".png"
    photo_path = Path(target_dir) / f"resume-photo{suffix}"
    photo_path.write_bytes(profile_image.data)
    return photo_path


def header_block(photo_path):
    photo = Image(str(photo_path), width=30 * mm, height=30 * mm)
    details = [
        Paragraph("Elina Razina", name_style),
        Paragraph("Frontend Developer (React, TypeScript, MobX)", headline),
        Paragraph(
            '<link href="tel:+79112548531" color="#1B1B1F">+7 (911) 254-85-31</link>'
            '  |  <link href="mailto:razina_elina@mail.ru" color="#1B1B1F">razina_elina@mail.ru</link>'
            '  |  Telegram: <link href="https://t.me/Elina_Razina" color="#1B1B1F">@Elina_Razina</link>',
            contact,
        ),
        Paragraph(
            'MAX: <link href="https://max.ru/u/f9LHodD0cOKFGLDCQ1alx_ttaB8rTE_2M3b-uardY3H0HpIAzQYinmfzHr8" color="#1B1B1F">'
            "max.ru/u/f9LHodD0cOKFGLDCQ1alx_ttaB8rTE_2M3b-uardY3H0HpIAzQYinmfzHr8</link>",
            small,
        ),
        Paragraph(
            "Saint Petersburg, Russia  |  Russian citizenship and work authorization"
            "  |  Remote  |  Open to occasional business trips",
            small,
        ),
    ]
    table = Table(
        [[photo, details]],
        colWidths=[33 * mm, PAGE_WIDTH - 2 * MARGIN_X - 33 * mm],
        hAlign="LEFT",
    )
    table.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 8),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return table


def build_story(photo_path):
    story = [header_block(photo_path), Spacer(1, 7)]

    story.extend(section("Professional profile"))
    story.append(
        p(
            "Frontend Developer with 9+ years of experience building and evolving complex "
            "single-page applications, including BIM, BI, and enterprise systems with "
            "high load and sophisticated domain logic."
        )
    )
    story.append(
        p(
            "I specialize in React 18+ and TypeScript, client-side architecture, scalable "
            "interfaces, performance optimization, RBAC, and gradual modernization of "
            "legacy code without interrupting product development."
        )
    )

    story.extend(section("Experience"))
    story.append(
        job_header(
            "Jan 2025 - Present",
            "1 yr 7 mos",
            "Freelance",
            "Mentor / Frontend Developer",
            "Remote",
        )
    )
    story.extend(
        [
            bullet("Mentor junior frontend developers in JavaScript, TypeScript, and React."),
            bullet("Publish a professional engineering blog."),
            bullet("Build web applications and websites with React, TypeScript, and Next.js."),
            Spacer(1, 4),
        ]
    )

    story.append(
        job_header(
            "Dec 2022 - Jul 2024",
            "1 yr 8 mos",
            "Samolet (Top-3 real estate developer in Russia)",
            "Senior Frontend Developer (React, TypeScript, MobX)",
            "Moscow / Remote",
        )
    )
    story.append(
        p(
            "<b>Project:</b> A web application for construction automation that makes the "
            "entire construction process transparent."
        )
    )
    story.append(
        p(
            "<b>Methodology:</b> Scrum, two-week sprints. Distributed team of 2 frontend "
            "developers, 7 backend developers, 1 designer, 2 QA engineers, a Product "
            "Manager, and a Scrum Master."
        )
    )
    story.extend(
        [
            label("Responsibilities"),
            bullet("Developed new features, reusable UI Kit components, business logic, and API integrations."),
            bullet("Enhanced the UI Kit and built new components with Ant Design and Storybook from Figma designs."),
            bullet("Performed project-level and cross-team code reviews."),
            bullet("Participated in daily stand-ups, planning, grooming, and retrospectives."),
            bullet("Mentored junior frontend developers and contributed to architecture decisions."),
            bullet("Resolved production defects and improved application stability."),
            label("Key achievements"),
            bullet("Redesigned the full application, updating more than 1,000 components and related logic."),
            bullet("Improved overall application performance."),
            bullet("Optimized complex data tables by introducing virtualization."),
            p(
                "<b>Stack:</b> React, TypeScript, MobX, styled-components, Ant Design, "
                "Samolet UI Kit, microfrontends, Module Federation, Webpack, Storybook, "
                "GitLab, Docker, CI/CD.",
                body_compact,
            ),
        ]
    )

    story.append(PageBreak())
    story.extend(section("Experience - DataArt"))
    story.append(
        job_header(
            "Jun 2019 - Nov 2022",
            "3 yrs 6 mos",
            "DataArt (International software engineering company)",
            "Frontend Developer (React, TypeScript, MobX, Redux)",
            "Remote - projects for clients in the US and Europe",
        )
    )
    story.extend(
        project(
            "Project 1: FinTech - Personal finance management",
            "An application for monitoring personal finances.",
            [
                "Designed the client-side architecture for authentication, transaction categorization, and PHP-based budget analytics.",
                "Integrated third-party banking REST APIs and synchronized complex application state.",
                "Built interactive expense charts and data visualizations with Chart.js.",
            ],
        )
    )
    story.extend(
        project(
            "Project 2: HRTech - Corporate ERP system",
            "Built an MVP from the ground up with employee profiles, project management, and a recruiting funnel.",
            [
                "Made core architecture decisions, including a modular structure and custom data hooks.",
                "Introduced strict TypeScript and ESLint rules, reducing production defects by 40%.",
            ],
        )
    )
    story.extend(
        project(
            "Project 3: CEO Dashboard - Internal analytics",
            "Developed an admin panel with data-heavy tables, dashboards, and role-based access control (RBAC).",
            [
                "Reduced initial load time by 50% through dynamic imports and caching.",
            ],
        )
    )
    story.extend(
        project(
            "Project 4: E-commerce - Food delivery service",
            "Implemented the complete customer journey: catalog, cart, checkout, and order tracking.",
            [
                "Built a fully responsive, mobile-first interface using SCSS and BEM.",
                "Implemented form validation and a multi-step checkout with React Hook Form.",
            ],
        )
    )
    story.extend(
        project(
            "Project 5: Meeting room booking system",
            "Developed an SPA for managing resources across a university campus.",
            [
                "Integrated REST APIs and implemented real-time availability.",
            ],
        )
    )

    story.extend(section("Earlier experience"))
    story.append(
        job_header(
            "Jun 2018 - Jun 2019",
            "1 yr 1 mo",
            "MTS (Russia's largest telecommunications operator)",
            "Frontend Developer (Angular, TypeScript, JavaScript)",
            "Russia",
        )
    )
    story.extend(
        [
            bullet(
                "Migrated a CRM and Service Desk SPA from AngularJS to Angular while "
                "maintaining uninterrupted operation for more than 2,000 support agents."
            ),
            bullet(
                "Developed a subscriber account with analytics modules for call, internet, "
                "and SMS usage."
            ),
            bullet("Integrated MTS Bank services, including payment widgets and balance data."),
            bullet("Set up CI/CD with Jenkins and automated build and deployment workflows."),
            bullet("Conducted code reviews for a six-person team and mentored two interns."),
            bullet("Reduced page load time by 35% after the migration."),
            Spacer(1, 5),
        ]
    )
    story.append(
        job_header(
            "Feb 2017 - May 2018",
            "1 yr 4 mos",
            "Technosila (Consumer electronics retail chain)",
            "Frontend Developer",
            "Saint Petersburg, Russia",
        )
    )
    story.extend(
        [
            bullet("Developed an online store with product catalog, cart, and banking API integrations."),
            bullet("Built responsive landing and promotional pages from Figma designs with pixel-perfect accuracy."),
            bullet("Created cross-browser HTML email campaigns."),
            bullet("Participated in code reviews and frontend architecture discussions."),
        ]
    )

    story.append(PageBreak())
    story.extend(section("Education"))
    education = Table(
        [
            [
                Paragraph("2018<br/><font color='#6E6B70'>Master's degree</font>", date_style),
                Paragraph(
                    f'<font name="{FONT_BOLD}">Peter the Great St. Petersburg Polytechnic University</font>'
                    "<br/>Innovation Studies, Applied Informatics",
                    body,
                ),
            ]
        ],
        colWidths=[35 * mm, PAGE_WIDTH - 2 * MARGIN_X - 35 * mm],
        hAlign="LEFT",
    )
    education.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (0, 0), 7),
                ("RIGHTPADDING", (1, 0), (1, 0), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    story.append(education)

    story.extend(section("Professional development"))
    story.append(p("<b>React, 2022</b> - Result University"))

    story.extend(section("Languages"))
    story.append(p("<b>Russian:</b> Native  |  <b>English:</b> C1 Advanced  |  <b>German:</b> A2 Elementary"))

    story.extend(section("Core competencies"))
    competencies = [
        "Frontend architecture: React, state management, API layer, modular structure",
        "Complex interfaces: data tables, forms, analytics, and billing modules",
        "Performance optimization: rendering, state, and network interactions",
        "RBAC implementation and UI-level access management",
        "Legacy code refactoring while preserving product stability",
        "Cross-functional Agile collaboration with analytics, backend, and QA teams",
    ]
    story.extend(bullet(item) for item in competencies)

    story.extend(section("Technical skills"))
    skills = [
        "React",
        "TypeScript",
        "JavaScript",
        "Redux",
        "MobX",
        "Next.js",
        "SPA",
        "REST API",
        "Webpack",
        "Vite",
        "HTML",
        "CSS3",
        "SCSS",
        "styled-components",
        "Ant Design",
        "Tailwind CSS",
        "Material UI",
        "Figma",
        "Storybook",
        "React Hook Form",
        "Chart.js",
        "Microfrontends",
        "Module Federation",
        "Docker",
        "Git",
        "GitLab CI",
        "Jenkins",
        "CI/CD",
        "Jest",
        "ESLint",
        "Code Review",
        "Scrum",
        "i18n",
        "a11y",
        "Performance optimization",
        "Cursor",
        "Claude Code",
    ]
    tag_rows = []
    row = []
    for skill in skills:
        row.append(Paragraph(skill, tag_style))
        if len(row) == 4:
            tag_rows.append(row)
            row = []
    if row:
        row.extend([""] * (4 - len(row)))
        tag_rows.append(row)
    tags = Table(
        tag_rows,
        colWidths=[(PAGE_WIDTH - 2 * MARGIN_X - 9) / 4] * 4,
        hAlign="LEFT",
    )
    tags.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), ACCENT_SOFT),
                ("BOX", (0, 0), (-1, -1), 0.4, WHITE),
                ("INNERGRID", (0, 0), (-1, -1), 2, WHITE),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 3),
                ("RIGHTPADDING", (0, 0), (-1, -1), 3),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(tags)

    story.extend(section("Additional information"))
    story.append(
        KeepTogether(
            [
                label("Recommendation"),
                p("Vladislav Mironov - Project Manager, Samolet"),
                Spacer(1, 3),
                label("Project access and NDA"),
                p(
                    "Most of my commercial projects are enterprise applications with "
                    "restricted access and are protected by NDAs. I cannot publish their "
                    "source code or production interfaces. Instead, I provide interactive "
                    "demo projects that demonstrate my frontend architecture, React, "
                    "TypeScript, state management, complex UI, accessibility, and "
                    "performance optimization skills."
                ),
                p(
                    "<b>Interactive demo:</b> "
                    '<link href="https://erazina.github.io/app/" '
                    'color="#F5823D">erazina.github.io/app/</link>'
                ),
                Spacer(1, 3),
                label("About me"),
                p(
                    "I have worked on enterprise products where UI stability, state "
                    "management, RBAC, high data density, and gradual modernization of "
                    "legacy code were critical. I am comfortable owning frontend "
                    "architecture, building complex interfaces, optimizing performance, "
                    "reviewing code, and mentoring engineers."
                ),
                p(
                    "<b>Primary stack:</b> React (Hooks), TypeScript, JavaScript, REST API, "
                    "MobX, Webpack, Vite, Jest, CI/CD, Docker, and Git."
                ),
                p(
                    "<b>Contact:</b> Telegram "
                    '<link href="https://t.me/Elina_Razina" color="#F5823D">@Elina_Razina</link>'
                ),
            ]
        )
    )
    return story


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_PDF.parent.mkdir(parents=True, exist_ok=True)

    frame = Frame(
        MARGIN_X,
        MARGIN_BOTTOM,
        PAGE_WIDTH - 2 * MARGIN_X,
        PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM,
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    template = PageTemplate(id="resume", frames=[frame], onPage=draw_page)
    document = BaseDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        title="Elina Razina - Frontend Developer Resume",
        author="Elina Razina",
        subject="Frontend Developer Resume",
        creator="Elina Razina Portfolio",
        leftMargin=MARGIN_X,
        rightMargin=MARGIN_X,
        topMargin=MARGIN_TOP,
        bottomMargin=MARGIN_BOTTOM,
    )
    document.addPageTemplates([template])
    with TemporaryDirectory(prefix="resume-en-") as temp_dir:
        photo_path = extract_source_photo(temp_dir)
        document.build(build_story(photo_path))
    shutil.copy2(OUTPUT_PDF, PUBLIC_PDF)
    print(f"Generated {OUTPUT_PDF}")
    print(f"Copied to {PUBLIC_PDF}")


if __name__ == "__main__":
    main()
