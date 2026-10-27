"""Fügt einen mit ansage_build.py erzeugten Ansage-Block in die Kata-Daten ein (ersetzt einen vorhandenen).

Aufruf: python3 tools/kata-pdf/ansage_insert.py data/kata-heian.js heian-shodan KANA LAUTSCHRIFT SEITE BLOCKDATEI
"""
import re
import sys
from pathlib import Path


def main(path, kid, kana, de, page, block_file):
    src = Path(path).read_text(encoding="utf-8")
    start = src.index(f"SK.kata['{kid}'] = {{")
    nxt = src.find("SK.kata['", start + 10)
    end = nxt if nxt > 0 else len(src)
    part = src[start:end]
    block = Path(block_file).read_text(encoding="utf-8").rstrip()
    new = (
        "    // Kata-Ansage: Bodenkarte nach der Fußskizze im Buch (vermessen mit tools/kata-pdf/embusen.py).\n"
        "    // f = [linker Fuß, rechter Fuß] mit [x, y, Zehenrichtung (0 = vorne, im Uhrzeigersinn), Gewicht]; body = Körperrichtung,\n"
        "    // look = Blick, falls zur Seite; turn = Drehung in Grad (negativ = links herum); h = Fußarbeit.\n"
        f"    ansage: {{\n      kana: '{kana}',\n      de: '{de}',\n      page: {page},\n{block}\n    }},\n"
    )
    m = re.search(r"\n(    // Kata-Ansage[^\n]*\n(    //[^\n]*\n)*)?    ansage: \{\n.*?\n    \},\n", part, re.S)
    if m:
        part = part[:m.start() + 1] + new + part[m.end():]
    else:
        i = part.index("\n", part.index("id: ")) + 1
        part = part[:i] + new + part[i:]
    Path(path).write_text(src[:start] + part + src[end:], encoding="utf-8")


if __name__ == "__main__":
    main(*sys.argv[1:7])
