"""Listet je PDF-Seite die Bewegungsnummern und alle 'should be executed/formed'-Sätze (Endstellungen)."""
import re
from pathlib import Path

from summarize_kata import ORD

OUT = Path(__file__).resolve().parents[2] / "tools" / "out"
texts = {}
for name in ("pdf_text.txt", "pdf_ocr.txt"):
    raw = (OUT / name).read_text(encoding="utf-8")
    parts = re.split(r"\n===== SEITE (\d+) =====\n", raw)
    for i in range(1, len(parts), 2):
        p = int(parts[i])
        if len(parts[i + 1].strip()) > 200:
            texts.setdefault(p, parts[i + 1])

ORD_RE = re.compile(r"(" + "|".join(sorted(map(re.escape, ORD), key=len, reverse=True)) + r")\s*\n?\s*MOVEMENT")
END_RE = re.compile(r"([A-Z][A-Z0-9_\-~\s\.]{6,}?)\s*should\s*be\s*(?:executed|formed)", re.S)

lines = []
for p in sorted(texts):
    body = texts[p]
    moves = sorted({ORD[m.group(1).replace(" ", "")] for m in ORD_RE.finditer(body.replace("-\n", "-"))})
    ends = [" ".join(m.group(1).split()) for m in END_RE.finditer(body)]
    if moves or ends:
        lines.append(f"S.{p} Bew. {moves}")
        lines += [f"    -> {e}" for e in ends]
(OUT / "endstellungen.txt").write_text("\n".join(lines), encoding="utf-8")
print(len(lines))
