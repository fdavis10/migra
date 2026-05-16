"""English service copy (titles, card text, full body, detail patches) for API and seed."""

from __future__ import annotations

import json
import re
from pathlib import Path

_ROOT = Path(__file__).resolve().parent
_MANIFEST_PATH = _ROOT / "service_en_manifest.json"
_BODIES_DIR = _ROOT / "en_service_en"


def _load_manifest() -> dict:
    if not _MANIFEST_PATH.is_file():
        return {}
    return json.loads(_MANIFEST_PATH.read_text(encoding="utf-8"))


def _body(slug: str) -> str:
    p = _BODIES_DIR / f"{slug}.txt"
    if not p.is_file():
        return ""
    return p.read_text(encoding="utf-8").strip()


def _looks_like_heading(line: str) -> bool:
    """Single-line section title (ALL CAPS blocks in en_service_en/*.txt)."""
    s = line.strip()
    if not s or "\n" in s:
        return False
    if len(s) < 4 or len(s) > 180:
        return False
    if s.endswith((".", "?", "!")):
        return False
    letters = [c for c in s if c.isalpha()]
    if len(letters) < 4:
        return False
    ratio = sum(1 for c in letters if c.isupper()) / len(letters)
    # Allow a few lowercase letters (e.g. “Resident” in curly quotes).
    if ratio >= 0.55:
        return True
    lower = sum(1 for c in s if c.islower())
    return lower <= 8 and len(s) < 140 and s[0].isupper()


def _strip_semicolon_list_line(s: str) -> str:
    s = s.rstrip()
    if s.endswith(";") or s.endswith("."):
        return s[:-1].strip()
    return s.strip()


def _lines_are_semicolon_style_list(lines: list[str]) -> bool:
    """Items separated by `;` at EOL; last item may end with `.` (common in en_service_en)."""
    if len(lines) < 2:
        return False
    for ln in lines[:-1]:
        if not ln.endswith(";"):
            return False
    return lines[-1].endswith((".", ";"))


def _semicolon_style_list_items(lines: list[str]) -> list[str]:
    return [_strip_semicolon_list_line(x) for x in lines]


def _try_colon_then_semicolon_list(out: list[dict], lines: list[str]) -> bool:
    if not lines or len(lines) < 2:
        return False
    head = lines[0].strip()
    rest = [ln.strip() for ln in lines[1:] if ln.strip()]
    if not head.endswith(":") or not rest:
        return False
    if not _lines_are_semicolon_style_list(rest):
        return False
    out.append({"type": "paragraph", "text": head})
    out.append({"type": "list", "ordered": False, "items": _semicolon_style_list_items(rest)})
    return True


def _try_colon_then_ordered_period_list(out: list[dict], lines: list[str]) -> bool:
    if not lines or len(lines) < 2:
        return False
    head = lines[0].strip()
    rest = [ln.strip() for ln in lines[1:] if ln.strip()]
    if not head.endswith(":") or len(rest) < 2:
        return False
    if not all(r.endswith(".") and len(r) < 220 for r in rest):
        return False
    out.append({"type": "paragraph", "text": head})
    out.append({"type": "list", "ordered": True, "items": [r[:-1].strip() for r in rest]})
    return True


def _try_plain_semicolon_list(out: list[dict], lines: list[str]) -> bool:
    if len(lines) < 2:
        return False
    if not _lines_are_semicolon_style_list(lines):
        return False
    out.append({"type": "list", "ordered": False, "items": _semicolon_style_list_items(lines)})
    return True


def _lines_semicolon_list_items(body: str) -> list[str] | None:
    lines = [ln.strip() for ln in body.split("\n") if ln.strip()]
    if not _lines_are_semicolon_style_list(lines):
        return None
    return _semicolon_style_list_items(lines)


def _lines_ordered_period_list_items(body: str) -> list[str] | None:
    lines = [ln.strip() for ln in body.split("\n") if ln.strip()]
    if len(lines) < 2 or not all(x.endswith(".") and len(x) < 220 for x in lines):
        return None
    return [x[:-1].strip() for x in lines]


def _emit_lines_block_single(out: list[dict], chunk: str) -> None:
    """Process one slice that does not contain blank-line paragraph breaks."""
    chunk = chunk.strip()
    if not chunk:
        return
    lines = [ln.strip() for ln in chunk.split("\n") if ln.strip()]

    if len(lines) >= 2 and _looks_like_heading(lines[0]):
        out.append({"type": "heading", "text": lines[0], "level": 2})
        lines = lines[1:]
        if not lines:
            return
        chunk = "\n".join(lines)
        lines = [ln.strip() for ln in chunk.split("\n") if ln.strip()]

    if _try_colon_then_semicolon_list(out, lines):
        return
    if _try_colon_then_ordered_period_list(out, lines):
        return
    if _try_plain_semicolon_list(out, lines):
        return

    out.append({"type": "paragraph", "text": chunk})


def _emit_lines_block(out: list[dict], chunk: str) -> None:
    """Turn one top-level \\n\\n-separated chunk into blocks."""
    chunk = chunk.strip()
    if not chunk:
        return
    inner = [p.strip() for p in re.split(r"\n{2,}", chunk) if p.strip()]
    if (
        len(inner) == 2
        and inner[0].endswith(":")
        and not _looks_like_heading(inner[0])
    ):
        semi = _lines_semicolon_list_items(inner[1])
        if semi is not None:
            out.append({"type": "paragraph", "text": inner[0]})
            out.append({"type": "list", "ordered": False, "items": semi})
            return
        ord_items = _lines_ordered_period_list_items(inner[1])
        if ord_items is not None:
            out.append({"type": "paragraph", "text": inner[0]})
            out.append({"type": "list", "ordered": True, "items": ord_items})
            return
    if len(inner) > 1:
        for part in inner:
            _emit_lines_block_single(out, part)
        return
    _emit_lines_block_single(out, chunk)


def body_to_content_sections(text: str) -> list[dict]:
    """
    Convert en_service_en/*.txt layout into Service.detail content_sections
    (same block types as Russian: heading, paragraph, list).
    """
    raw = (text or "").strip()
    if not raw:
        return []
    out: list[dict] = []
    blocks = [b.strip() for b in re.split(r"\n{2,}", raw) if b.strip()]
    i = 0
    while i < len(blocks):
        block = blocks[i]
        lines = [ln.strip() for ln in block.split("\n") if ln.strip()]
        if len(lines) == 1 and lines[0].startswith("## "):
            out.append({"type": "heading", "text": lines[0][3:].strip(), "level": 2})
            i += 1
            continue
        if len(lines) == 1 and _looks_like_heading(lines[0]):
            out.append({"type": "heading", "text": lines[0], "level": 2})
            i += 1
            continue
        # Lead-in ending with ":" and list in the next \\n\\n-separated block (common in *.txt).
        if (
            i + 1 < len(blocks)
            and len(lines) == 1
            and lines[0].endswith(":")
            and not _looks_like_heading(lines[0])
        ):
            nxt = blocks[i + 1]
            semi = _lines_semicolon_list_items(nxt)
            if semi is not None:
                out.append({"type": "paragraph", "text": lines[0]})
                out.append({"type": "list", "ordered": False, "items": semi})
                i += 2
                continue
            ord_items = _lines_ordered_period_list_items(nxt)
            if ord_items is not None:
                out.append({"type": "paragraph", "text": lines[0]})
                out.append({"type": "list", "ordered": True, "items": ord_items})
                i += 2
                continue
        _emit_lines_block(out, block)
        i += 1
    return out


def build_service_text_en() -> dict[str, dict]:
    """Fields for Service model update (seed_english_locale)."""
    out: dict[str, dict] = {}
    for slug, meta in _load_manifest().items():
        body = _body(slug) or (meta.get("full_desc_en") or "")
        out[slug] = {
            "title_en": meta.get("title_en", ""),
            "short_desc_en": meta.get("short_desc_en", ""),
            "full_desc_en": body,
            "price_note_en": meta.get("price_note_en", ""),
        }
    return out


def build_detail_en_patches() -> dict[str, dict]:
    """
    Merge into DETAIL_EN_PIECES: why_choose + content_sections parsed from en body files
    (same rich layout as Russian detail).
    """
    patches: dict[str, dict] = {}
    for slug, meta in _load_manifest().items():
        body = _body(slug)
        if not body:
            wc = meta.get("why_choose")
            if isinstance(wc, list) and len(wc) > 0:
                patches[slug] = {"why_choose": wc}
            continue
        sections = body_to_content_sections(body)
        if not sections:
            continue
        patch: dict = {"content_sections": sections}
        wc = meta.get("why_choose")
        if isinstance(wc, list) and len(wc) > 0:
            patch["why_choose"] = wc
        patches[slug] = patch
    return patches


# Backwards-compatible name for imports
def build_detail_why_choose_patches() -> dict[str, dict]:
    return build_detail_en_patches()
