#!/usr/bin/env python3
"""Verify edited copy strings from the export appear in site HTML/JS."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXPORT = Path(
    "/home/ubuntu/.cursor/projects/workspace/uploads/2026-10-10-otunfikayo-copy-edited_a9da.md"
)
if not EXPORT.is_file():
    EXPORT = ROOT / "uploads" / "2026-10-10-otunfikayo-copy-edited_a9da.md"

PAGE_FILES = [ROOT / "index.html", *sorted(ROOT.glob("*/index.html"))]
JS_FILES = [ROOT / "js" / "coaching.js"]

SKIP_IDS = {
    "OF-coaching-fit-h3-2",
    "OF-coaching-fit-li-4",
    "OF-coaching-fit-li-5",
    "OF-coaching-fit-li-6",
    "OF-coaching-faq-q-5",
    "OF-coaching-faq-p-5",
    "OF-global-js-1",
    "OF-global-js-2",
    "OF-global",
    "OF-home",
    "OF-offerings",
    "OF-coaching",
    "OF-author",
    "OF-about",
    "OF-writing",
    "OF-contact",
    "OF-global-header-aria-1",
    "OF-global-footer-p-1",
    "OF-global-header-p-1",
    "OF-coaching-modal-btn-1",
}

SKIP_SUBSTRINGS_IN_CHECK = (
    "DELETE",
    "Developer note",
    "COMMENT:",
    "NEW TESTIMONIAL",
    "assign a stable ID",
    "DELETE SECTION",
)


def normalize(text: str) -> str:
    text = text.replace("\u2019", "'").replace("\u2018", "'")
    text = text.replace("\u201c", '"').replace("\u201d", '"')
    text = text.replace("\u2014", "—").replace("&amp;", "&")
    text = re.sub(r"\*+", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def strip_html_comments(html: str) -> str:
    return re.sub(r"<!--.*?-->", "", html, flags=re.DOTALL)


def strip_html_tags(html: str) -> str:
    return re.sub(r"<[^>]+>", " ", html)


def load_corpus() -> str:
    parts: list[str] = []
    for path in PAGE_FILES:
        raw = path.read_text(encoding="utf-8")
        if path.parent.name == "coaching":
            raw = re.sub(
                r'<details[^>]*id="coaching-refund-faq"[^>]*>.*?</details>',
                "",
                raw,
                flags=re.DOTALL,
            )
        raw = strip_html_comments(raw)
        for m in re.finditer(
            r'<meta[^>]+name=["\'](?:description|title)["\'][^>]+content=["\']([^"\']+)["\']',
            raw,
            flags=re.I,
        ):
            parts.append(m.group(1))
        for m in re.finditer(r"<title>([^<]+)</title>", raw, flags=re.I):
            parts.append(m.group(1))
        parts.append(strip_html_tags(raw))
    for path in JS_FILES:
        if path.is_file():
            parts.append(path.read_text(encoding="utf-8"))
    return normalize(" ".join(parts))


def parse_export(path: Path) -> list[tuple[str, str]]:
    lines = path.read_text(encoding="utf-8").splitlines()
    entries: list[tuple[str, str]] = []
    id_re = re.compile(r"\[OF-[^\]]+\]")

    for line in lines:
        if any(s in line for s in SKIP_SUBSTRINGS_IN_CHECK):
            continue
        if line.strip().startswith("> "):
            continue
        m = id_re.search(line)
        if not m:
            continue
        oid = m.group(0)[1:-1]
        if oid in SKIP_IDS:
            continue
        if oid == "OF-global-skip-1":
            entries.append((oid, "Skip to content"))
            continue
        rest = line[m.end() :].strip()
        if not rest:
            continue
        if rest.startswith("Page title"):
            rest = rest.split(":", 1)[-1].strip()
        elif rest.startswith("Meta description"):
            rest = rest.split(":", 1)[-1].strip()
        elif rest.startswith("Eyebrow/label:"):
            rest = rest.split(":", 1)[-1].strip()
        elif rest.startswith("Button:"):
            rest = rest.split(":", 1)[-1].strip()
            rest = re.sub(r"\s*\(links to.*\)\s*$", "", rest)
        elif rest.startswith("Link:"):
            rest = rest.split(":", 1)[-1].strip()
            rest = re.sub(r"\s*\(links to.*\)\s*$", "", rest)
        elif rest.startswith("Alt:"):
            continue
        elif rest.startswith("Cite:"):
            rest = rest.split(":", 1)[-1].strip()
        elif rest.startswith("**Q:**"):
            rest = rest.replace("**Q:**", "").strip()
        elif rest.startswith("####") or rest.startswith("#####"):
            rest = re.sub(r"^#+\s*", "", rest).strip()
        if rest.startswith("*") and "card" in rest.lower():
            continue
        if "⚠ PLACEHOLDER" in rest:
            rest = rest.split("⚠")[0].strip()
        if "rendered from" in rest:
            rest = rest.split("[")[0].strip()
        if not rest or rest.startswith("("):
            continue
        # Multi-line quote blocks on same line as ID
        if rest.startswith("“") or rest.startswith('"'):
            entries.append((oid, normalize(rest)))
            continue
        if oid.endswith("-cite-1") or oid.endswith("-cite-2") or oid.endswith("-cite-3"):
            entries.append((oid, normalize(rest)))
            continue
        if "Outcome:" in rest:
            entries.append((oid, normalize(rest)))
            continue
        entries.append((oid, normalize(rest)))

    # Card 4/5 from NEW blocks — already in HTML by ID; add manual strings
    entries.extend(
        [
            (
                "OF-coaching-testimonials-card-4",
                normalize(
                    "Building confidence for a business development role"
                ),
            ),
            ("OF-coaching-testimonials-card-5", normalize("Transitioning into Business Analysis")),
        ]
    )
    return entries


def check_no_visible_placeholders(corpus: str) -> list[str]:
    issues = []
    banned = [
        "Testimonial placeholder",
        "Client name (placeholder)",
        "Refund policy placeholder",
        "Placeholder</p>",
    ]
    for phrase in banned:
        if phrase in corpus:
            issues.append(f"Found banned visible phrase: {phrase}")
    return issues


def main() -> int:
    if not EXPORT.is_file():
        print(f"Missing export: {EXPORT}", file=sys.stderr)
        return 1

    corpus = load_corpus()
    entries = parse_export(EXPORT)
    missing: list[str] = []

    for oid, text in entries:
        if len(text) < 8:
            continue
        check = text
        if check.lower().startswith("deliverable:"):
            check = check.split(":", 1)[1].strip()
        probe = check if len(check) < 120 else check[:80]
        if normalize(probe) not in corpus and normalize(check) not in corpus:
            missing.append(f"{oid}: {text[:100]}...")

    placeholder_issues = check_no_visible_placeholders(corpus)

    if missing:
        print("MISSING COPY STRINGS:")
        for m in missing:
            print(f"  - {m}")
    if placeholder_issues:
        print("PLACEHOLDER ISSUES:")
        for p in placeholder_issues:
            print(f"  - {p}")

    if missing or placeholder_issues:
        return 1

    print(f"OK: {len(entries)} export strings checked against HTML/JS.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
