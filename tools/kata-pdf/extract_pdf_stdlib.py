"""Extrahiert die OCR-Textebene des Kata-PDFs nur mit der Standardbibliothek.

Ausgabe: tools/out/pdf_text.txt (nicht committen).
"""
import re
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PDF = ROOT / "Karate-do-kata-volume-1.pdf"
OUT = ROOT / "tools" / "out"

data = PDF.read_bytes()
objects: dict[int, bytes] = {}
streams: dict[int, bytes] = {}

OBJ_RE = re.compile(rb"(\d+)\s+(\d+)\s+obj\b")


def inflate(raw: bytes) -> bytes:
    try:
        return zlib.decompress(raw)
    except zlib.error:
        try:
            return zlib.decompressobj().decompress(raw)
        except zlib.error:
            return b""


def load_raw_objects() -> None:
    for m in OBJ_RE.finditer(data):
        num = int(m.group(1))
        start = m.end()
        end = data.find(b"endobj", start)
        body = data[start:end]
        s = body.find(b"stream")
        if s != -1 and body[:s].rstrip().endswith(b">>"):
            head = body[:s]
            st = s + len(b"stream")
            if body[st:st + 2] == b"\r\n":
                st += 2
            elif body[st:st + 1] in (b"\n", b"\r"):
                st += 1
            es = body.rfind(b"endstream")
            raw = body[st:es]
            objects[num] = head
            streams[num] = inflate(raw) if b"FlateDecode" in head else raw
        else:
            objects[num] = body


def load_object_streams() -> None:
    for num, head in list(objects.items()):
        if b"/ObjStm" not in head or num not in streams:
            continue
        content = streams[num]
        n = int(re.search(rb"/N\s+(\d+)", head).group(1))
        first = int(re.search(rb"/First\s+(\d+)", head).group(1))
        nums = list(map(int, content[:first].split()))
        pairs = [(nums[i], nums[i + 1]) for i in range(0, 2 * n, 2)]
        for idx, (onum, off) in enumerate(pairs):
            start = first + off
            end = first + pairs[idx + 1][1] if idx + 1 < len(pairs) else len(content)
            objects.setdefault(onum, content[start:end])


def ref(body: bytes, key: bytes) -> int | None:
    m = re.search(re.escape(key) + rb"\s+(\d+)\s+0\s+R", body)
    return int(m.group(1)) if m else None


def inline_dict(body: bytes, key: bytes) -> bytes | None:
    i = body.find(key)
    if i == -1:
        return None
    j = body.find(b"<<", i)
    if j == -1:
        return None
    depth, k = 0, j
    while k < len(body):
        if body[k:k + 2] == b"<<":
            depth += 1
            k += 2
        elif body[k:k + 2] == b">>":
            depth -= 1
            k += 2
            if depth == 0:
                return body[j:k]
        else:
            k += 1
    return None


def resolve_dict(body: bytes, key: bytes) -> bytes | None:
    r = ref(body, key)
    if r is not None:
        return objects.get(r)
    return inline_dict(body, key)


def parse_cmap(cmap: bytes) -> tuple[dict[int, str], int]:
    mapping: dict[int, str] = {}
    width = 1
    cs = re.search(rb"begincodespacerange\s*<([0-9A-Fa-f]+)>", cmap)
    if cs:
        width = len(cs.group(1)) // 2

    def hexstr(h: bytes) -> str:
        h = h.decode()
        return "".join(chr(int(h[i:i + 4], 16)) for i in range(0, len(h), 4)) if len(h) >= 4 else chr(int(h, 16))

    for block in re.findall(rb"beginbfchar(.*?)endbfchar", cmap, re.S):
        for a, b in re.findall(rb"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>", block):
            mapping[int(a, 16)] = hexstr(b)
    for block in re.findall(rb"beginbfrange(.*?)endbfrange", cmap, re.S):
        for a, b, rest in re.findall(rb"<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(\[[^\]]*\]|<[0-9A-Fa-f]+>)", block):
            lo, hi = int(a, 16), int(b, 16)
            if rest.startswith(b"["):
                for i, h in enumerate(re.findall(rb"<([0-9A-Fa-f]+)>", rest)):
                    mapping[lo + i] = hexstr(h)
            else:
                base = int(rest[1:-1], 16)
                for i in range(hi - lo + 1):
                    mapping[lo + i] = chr(base + i)
    return mapping, width


cmap_cache: dict[int, tuple[dict[int, str], int]] = {}


def font_map(font_obj_num: int) -> tuple[dict[int, str], int]:
    if font_obj_num in cmap_cache:
        return cmap_cache[font_obj_num]
    body = objects.get(font_obj_num, b"")
    tu = ref(body, b"/ToUnicode")
    result = parse_cmap(streams.get(tu, b"")) if tu else ({}, 1)
    cmap_cache[font_obj_num] = result
    return result


def read_literal(s: bytes, i: int) -> tuple[bytes, int]:
    out = bytearray()
    depth = 1
    i += 1
    while i < len(s) and depth:
        c = s[i]
        if c == 0x5C:
            i += 1
            e = s[i:i + 1]
            esc = {b"n": b"\n", b"r": b"\r", b"t": b"\t", b"b": b"\b", b"f": b"\f"}
            if e in esc:
                out += esc[e]
            elif e.isdigit():
                oct_digits = re.match(rb"[0-7]{1,3}", s[i:i + 3]).group(0)
                out.append(int(oct_digits, 8) & 0xFF)
                i += len(oct_digits) - 1
            elif e in (b"\r", b"\n"):
                pass
            else:
                out += e
        elif c == 0x28:
            depth += 1
            out.append(c)
        elif c == 0x29:
            depth -= 1
            if depth:
                out.append(c)
        else:
            out.append(c)
        i += 1
    return bytes(out), i


def decode(raw: bytes, fmap: tuple[dict[int, str], int]) -> str:
    mapping, width = fmap
    if not mapping:
        return raw.decode("latin-1")
    chars = []
    for k in range(0, len(raw), width):
        code = int.from_bytes(raw[k:k + width], "big")
        chars.append(mapping.get(code, "?"))
    return "".join(chars)


TOKEN_RE = re.compile(rb"\(|<[0-9A-Fa-f\s]*>|\[|\]|/[^\s/\[\]()<>]+|[-+]?\d*\.?\d+|[A-Za-z'\"*]+")


def page_text(content: bytes, fonts: dict[bytes, int]) -> str:
    lines: list[str] = []
    cur = ""
    fmap: tuple[dict[int, str], int] = ({}, 1)
    operands: list = []
    i = 0
    while i < len(content):
        m = TOKEN_RE.search(content, i)
        if not m:
            break
        tok = m.group(0)
        if tok == b"(":
            raw, i = read_literal(content, m.start())
            operands.append(("s", raw))
            continue
        i = m.end()
        if tok.startswith(b"<") and tok != b"<<":
            h = re.sub(rb"\s", b"", tok[1:-1])
            operands.append(("s", bytes.fromhex(h.decode() + ("0" if len(h) % 2 else ""))))
        elif tok == b"[":
            operands.append(("[", None))
        elif tok == b"]":
            arr = []
            while operands and operands[-1][0] != "[":
                arr.insert(0, operands.pop())
            if operands:
                operands.pop()
            operands.append(("a", arr))
        elif tok.startswith(b"/"):
            operands.append(("n", tok[1:]))
        elif re.fullmatch(rb"[-+]?\d*\.?\d+", tok):
            operands.append(("num", float(tok)))
        else:
            op = tok
            if op == b"Tf" and len(operands) >= 2 and operands[-2][0] == "n":
                fnum = fonts.get(operands[-2][1])
                fmap = font_map(fnum) if fnum else ({}, 1)
            elif op == b"Tj" and operands and operands[-1][0] == "s":
                cur += decode(operands[-1][1], fmap)
            elif op in (b"'", b'"') and operands and operands[-1][0] == "s":
                lines.append(cur)
                cur = decode(operands[-1][1], fmap)
            elif op == b"TJ" and operands and operands[-1][0] == "a":
                for kind, val in operands[-1][1]:
                    if kind == "s":
                        cur += decode(val, fmap)
                    elif kind == "num" and val < -200:
                        cur += " "
            elif op in (b"Td", b"TD", b"T*", b"Tm", b"ET"):
                if op in (b"Td", b"TD") and len(operands) >= 2 and abs(operands[-1][1]) < 1 and operands[-1][0] == "num":
                    cur += " "
                else:
                    if cur.strip():
                        lines.append(cur)
                    cur = ""
            operands = []
    if cur.strip():
        lines.append(cur)
    return "\n".join(l.strip() for l in lines)


def fonts_for_page(page: bytes) -> dict[bytes, int]:
    res = resolve_dict(page, b"/Resources") or b""
    fdict = resolve_dict(res, b"/Font") or b""
    return {m.group(1): int(m.group(2)) for m in re.finditer(rb"/([^\s/]+)\s+(\d+)\s+0\s+R", fdict)}


def page_contents(page: bytes) -> bytes:
    m = re.search(rb"/Contents\s*\[([^\]]*)\]", page)
    nums = [int(x) for x in re.findall(rb"(\d+)\s+0\s+R", m.group(1))] if m else []
    if not nums:
        r = ref(page, b"/Contents")
        nums = [r] if r else []
    return b"\n".join(streams.get(n, b"") for n in nums)


def ordered_pages() -> list[int]:
    root = next((n for n, b in objects.items() if re.search(rb"/Type\s*/Catalog", b)), None)
    out: list[int] = []

    def walk(n: int) -> None:
        b = objects.get(n, b"")
        if re.search(rb"/Type\s*/Pages", b):
            kids = re.search(rb"/Kids\s*\[([^\]]*)\]", b)
            for k in re.findall(rb"(\d+)\s+0\s+R", kids.group(1)):
                walk(int(k))
        elif re.search(rb"/Type\s*/Page\b", b):
            out.append(n)

    walk(ref(objects[root], b"/Pages"))
    return out


def main() -> None:
    load_raw_objects()
    load_object_streams()
    OUT.mkdir(parents=True, exist_ok=True)
    pages = ordered_pages()
    with open(OUT / "pdf_text.txt", "w", encoding="utf-8") as f:
        for idx, pnum in enumerate(pages, start=1):
            page = objects[pnum]
            f.write(f"\n===== SEITE {idx} =====\n{page_text(page_contents(page), fonts_for_page(page))}\n")
    print("Seiten:", len(pages))


if __name__ == "__main__":
    main()
