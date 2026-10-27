"""OCR fuer alle Scan-Seiten des Kata-PDFs (PyMuPDF + RapidOCR). Ergebnis: tools/out/pdf_ocr.txt.

Die Scans werden direkt aus dem PDF gelesen (scans.py), weil das normale Rendern Teile der Seiten abschneidet.
"""
import sys
from pathlib import Path

import cv2
from rapidocr_onnxruntime import RapidOCR

sys.path.insert(0, str(Path(__file__).resolve().parent))
from scans import ROOT, open_pdf, page_image  # noqa: E402

OUT = ROOT / "tools" / "out"
IMG = OUT / "scan"


def ocr_lines(engine: RapidOCR, img, half_width: float) -> list[str]:
    result, _ = engine(img)
    if not result:
        return []
    boxes = []
    for box, text, _score in result:
        x = min(p[0] for p in box)
        y = min(p[1] for p in box)
        boxes.append((0 if x < half_width else 1, y, x, text))
    # Doppelseiten: erst linke, dann rechte Spalte, jeweils von oben nach unten
    boxes.sort()
    return [b[3] for b in boxes]


def main() -> None:
    IMG.mkdir(parents=True, exist_ok=True)
    doc = open_pdf()
    engine = RapidOCR()
    with open(OUT / "pdf_ocr.txt", "w", encoding="utf-8") as f:
        for i in range(1, len(doc) + 1):
            img = page_image(doc, i, gray=False)
            cv2.imwrite(str(IMG / f"s{i:03d}.png"), img)
            lines = ocr_lines(engine, img, img.shape[1] / 2)
            f.write(f"\n===== SEITE {i} =====\n" + "\n".join(lines) + "\n")
            f.flush()
            print(i, len(lines), flush=True)


if __name__ == "__main__":
    main()
