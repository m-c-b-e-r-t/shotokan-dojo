"""Erzeugt aus tools/out/pdf_text.txt eine kompakte Bewegungsuebersicht je Kata (nicht committen)."""
import re
from pathlib import Path

OUT = Path(__file__).resolve().parent / "out"
text = (OUT / "pdf_text.txt").read_text(encoding="utf-8")

UNITS = ["", "FIRST", "SECOND", "THIRD", "FOURTH", "FIFTH", "SIXTH", "SEVENTH", "EIGHTH", "NINTH"]
TEENS = {10: "TENTH", 11: "ELEVENTH", 12: "TWELFTH", 13: "THIRTEENTH", 14: "FOURTEENTH", 15: "FIFTEENTH",
         16: "SIXTEENTH", 17: "SEVENTEENTH", 18: "EIGHTEENTH", 19: "NINETEENTH"}
TENS = {2: "TWENTY", 3: "THIRTY", 4: "FORTY", 5: "FIFTY", 6: "SIXTY", 7: "SEVENTY"}
TENS_TH = {2: "TWENTIETH", 3: "THIRTIETH", 4: "FORTIETH", 5: "FIFTIETH", 6: "SIXTIETH", 7: "SEVENTIETH"}


def ordinal(n: int) -> str:
    if n < 10:
        return UNITS[n]
    if n < 20:
        return TEENS[n]
    t, u = divmod(n, 10)
    return TENS_TH[t] if u == 0 else f"{TENS[t]}-{UNITS[u]}"


ORD = {ordinal(n): n for n in range(1, 80)}
ORD_RE = re.compile(r"\b(" + "|".join(sorted(map(re.escape, ORD), key=len, reverse=True)) + r")\s*\n?\s*MOVEMENT")
KATA_RE = re.compile(r"\((\d+)\s*move\s*\n?\s*ments?\)", re.I)

pages = re.split(r"\n===== SEITE (\d+) =====\n", text)
out_lines: list[str] = []
for i in range(1, len(pages), 2):
    pnum, body = int(pages[i]), pages[i + 1]
    km = KATA_RE.search(body)
    if km:
        out_lines.append(f"\n######## NEUE KATA (S.{pnum}) {body[:km.start()].strip()[:40]!r} ({km.group(1)} Bewegungen)")
    for m in ORD_RE.finditer(body):
        n = ORD[m.group(1)]
        rest = body[m.end():].split("\n")
        head = []
        for line in rest[:8]:
            s = line.strip()
            if not s:
                continue
            letters = re.sub(r"[^A-Za-z]", "", s)
            if letters and sum(c.isupper() for c in letters) / len(letters) > 0.8:
                head.append(s)
            else:
                break
        out_lines.append(f"S.{pnum} #{n}: {' | '.join(head)}")
    for pm in re.finditer(r"((?:Meaning |Reference )?Point|Note)s?\s*:(.*?)(?=\n\s*\n|\n[A-Z0-9 \-]{6,}\n|$)", body, re.S):
        snippet = " ".join(pm.group(2).split())
        out_lines.append(f"   S.{pnum} [{pm.group(1)}] {snippet[:400]}")

(OUT / "kata_summary.txt").write_text("\n".join(out_lines), encoding="utf-8")
print(len(out_lines), "Zeilen")
