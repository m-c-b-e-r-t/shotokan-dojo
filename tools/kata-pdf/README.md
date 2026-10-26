# Kata-PDF auswerten

Python-Skripte, mit denen der Text aus „Karate-Do Kata Vol. 1“ (JKA) für die Kata-Daten in `data/kata-*.js` gewonnen wurde. Für den Betrieb der App werden sie nicht gebraucht.

Voraussetzung: das PDF als `Karate-do-kata-volume-1.pdf` im Hauptordner des Repos. Alle Ausgaben landen in `tools/out/`. PDF und `tools/out/` sind urheberrechtlich geschützt bzw. daraus abgeleitet, per `.gitignore` ausgeschlossen und dürfen nie committet werden.

| Skript | Zweck | Abhängigkeiten |
|---|---|---|
| `extract_pdf_stdlib.py` | OCR-Textebene des PDFs nach `tools/out/pdf_text.txt` | nur Standardbibliothek |
| `ocr_pdf.py` | OCR für Seiten ohne Textebene, hängt an `tools/out/` an | `pymupdf`, `rapidocr_onnxruntime` |
| `summarize_kata.py` | kompakte Bewegungsübersicht je Kata (`tools/out/kata_summary.txt`) | – |
| `endstellungen.py` | je Seite Bewegungsnummern und Sätze zu Endstellungen | – (nutzt `summarize_kata.py`) |

Reihenfolge: `extract_pdf_stdlib.py` → ggf. `ocr_pdf.py` → `summarize_kata.py` / `endstellungen.py`. Aufruf aus dem Hauptordner, z. B. `python3 tools/kata-pdf/extract_pdf_stdlib.py`.
