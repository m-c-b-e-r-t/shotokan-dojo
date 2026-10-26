"""OCR fuer PDF-Seiten ohne Textebene (PyMuPDF + RapidOCR). Haengt Ergebnis an tools/out/ an."""
from pathlib import Path

import fitz
from rapidocr_onnxruntime import RapidOCR

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "Karate-do-kata-volume-1.pdf"
OUT = ROOT / "tools" / "out"
IMG = OUT / "pages"


def ocr_lines(engine: RapidOCR, png: bytes, half_width: float) -> list[str]:
    result, _ = engine(png)
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
    doc = fitz.open(str(PDF))
    engine = RapidOCR()
    with open(OUT / "pdf_ocr.txt", "w", encoding="utf-8") as f:
        for i, page in enumerate(doc, start=1):
            if len(page.get_text().strip()) > 200:
                continue
            pix = page.get_pixmap(dpi=200)
            png = pix.tobytes("png")
            (IMG / f"s{i:03d}.png").write_bytes(png)
            lines = ocr_lines(engine, png, pix.width / 2)
            f.write(f"\n===== SEITE {i} =====\n" + "\n".join(lines) + "\n")
            f.flush()
            print(i, len(lines), flush=True)


if __name__ == "__main__":
    main()
