"""OCR aller Scan-Seiten mit Lage jeder Zeile (für einzelskizzen.py: Überschriften der Bewegungen und Text dazu).

Ergebnis: tools/out/ocr_boxes.json = {Seite: [[x, y, Text], …]} in Bildpunkten des Scans auf Breite 1757.
"""
import json
import sys
from pathlib import Path

from rapidocr_onnxruntime import RapidOCR

sys.path.insert(0, str(Path(__file__).resolve().parent))
from scans import ROOT, open_pdf, page_image  # noqa: E402

OUT = ROOT / "tools" / "out"
WIDTH = 1757


def main(first=1, last=176):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "ocr_boxes.json"
    res = json.loads(path.read_text()) if path.exists() else {}
    doc = open_pdf()
    engine = RapidOCR()
    for p in range(first, last + 1):
        if str(p) in res:
            continue
        img = page_image(doc, p, gray=False)
        k = WIDTH / img.shape[1]
        found, _ = engine(img)
        res[str(p)] = [[round(min(q[0] for q in box) * k), round(min(q[1] for q in box) * k), text] for box, text, _ in (found or [])]
        path.write_text(json.dumps(res))
        print(p, len(res[str(p)]), flush=True)


if __name__ == "__main__":
    main(*[int(a) for a in sys.argv[1:]])
