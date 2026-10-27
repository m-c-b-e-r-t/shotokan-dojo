# Kata-PDF auswerten

Python-Skripte, mit denen der Text aus „Karate-Do Kata Vol. 1“ (JKA) für die Kata-Daten in `data/kata-*.js` gewonnen wurde. Für den Betrieb der App werden sie nicht gebraucht.

Voraussetzung: das PDF als `Karate-do-kata-volume-1.pdf` im Hauptordner des Repos. Alle Ausgaben landen in `tools/out/`. PDF und `tools/out/` sind urheberrechtlich geschützt bzw. daraus abgeleitet, per `.gitignore` ausgeschlossen und dürfen nie committet werden.

| Skript | Zweck | Abhängigkeiten |
|---|---|---|
| `extract_pdf_stdlib.py` | OCR-Textebene des PDFs nach `tools/out/pdf_text.txt` | nur Standardbibliothek |
| `scans.py` | liest die eingebetteten Scan-Bilder (Hilfsmodul für die übrigen Skripte) | `pymupdf`, `opencv-python` |
| `ocr_pdf.py` | OCR aller Scan-Seiten nach `tools/out/pdf_ocr.txt` | `pymupdf`, `rapidocr_onnxruntime` |
| `embusen.py` | vermisst die Fußskizzen: je Bild Linienfigur und Fußabdrücke (Lage, Zehenrichtung) nach `tools/out/embusen_SEITE.json`, dazu ein Kontrollbild | `pymupdf`, `opencv-python` |
| `ansage_build.py` | baut aus den Messwerten und einer Zuordnung je Kata (`spec/*.py`: linker/rechter Fuß, Körperrichtung, Drehung, Fußarbeit) den Ansage-Block | – |
| `ansage_insert.py` | trägt den Ansage-Block in `data/kata-*.js` ein (ersetzt einen vorhandenen) | – |
| `summarize_kata.py` | kompakte Bewegungsübersicht je Kata (`tools/out/kata_summary.txt`) | – |
| `endstellungen.py` | je Seite Bewegungsnummern und Sätze zu Endstellungen | – (nutzt `summarize_kata.py`) |

Reihenfolge: `extract_pdf_stdlib.py` → ggf. `ocr_pdf.py` → `summarize_kata.py` / `endstellungen.py`.
Für die Kata-Ansage: `embusen.py SEITE…` → `ansage_build.py spec/KATA.py > tools/out/KATA.js` → `ansage_insert.py data/kata-….js KATA-ID KANA LAUTSCHRIFT SEITE tools/out/KATA.js`.

Achtung: Im PDF liegt jedes Scan-Bild verschoben auf der Seite; beim normalen Rendern (Viewer, `page.get_pixmap`) fehlt deshalb ein großer Teil. Immer über `scans.py` lesen. Aufruf aus dem Hauptordner, z. B. `python3 tools/kata-pdf/extract_pdf_stdlib.py`.
