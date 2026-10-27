"""Baut aus den vermessenen Fußskizzen (embusen.py) und einer Zuordnung je Bild die Ansage-Daten einer Kata.

Aufruf: python3 tools/kata-pdf/ansage_build.py tools/kata-pdf/spec/heian-shodan.py
Die Spezifikation ist eine Python-Datei mit:
  PAGES  = [Seite, ...]            Skizzenseiten in Lesereihenfolge
  SKIP   = {(Seite, Bild), ...}     Bilder, die nicht gebraucht werden (z. B. Zwischenbilder)
  FRAMES = [(Name, Zuordnung, Stand, Körper, Extras), ...]  in Reihenfolge rei, yoi, 1 … n, naore, end
     Zuordnung: 'LR' / 'RL' (erkannte Abdrücke von links nach rechts) oder 'L' / 'R' bei nur einem Abdruck;
     'manual', wenn embusen.py das Bild nicht erkannt hat (dann Extras['f'] von Hand vermessen)
     (der andere kommt dann aus Extras['other'] oder bleibt wie im Bild davor).
     Extras: f = [[x, y, Richtung], [x, y, Richtung]] ersetzt die Messung (z. B. bei zusammenliegenden Füßen),
     look, turn, h (Fußarbeit), w = [Gewicht links, Gewicht rechts].
Ausgabe: JavaScript-Objekt für SK.kata[…].ansage (ohne kana/de/page), auf stdout.
"""
import json
import runpy
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parents[2] / "tools" / "out"


def weights(stance: str):
    s = stance.lower()
    left = s.startswith("hidari")
    if "zenkutsu" in s:
        return (0.7, 0.3) if left else (0.3, 0.7)
    if "kokutsu" in s:  # Migi-kokutsu: rechtes Bein ist das hintere, tragende
        return (0.3, 0.7) if not left else (0.7, 0.3)
    if "neko" in s:
        return (0.1, 0.9) if not left else (0.9, 0.1)
    if "kosa" in s:
        return (0.9, 0.1) if left else (0.1, 0.9)
    if "ashi-dachi" in s or "tsuru" in s or "sagi" in s:
        return (1.0, 0.0) if left else (0.0, 1.0)
    return (0.5, 0.5)


def main(spec_path):
    spec = runpy.run_path(spec_path)
    skip = spec.get("SKIP", set())
    frames = []
    for p in spec["PAGES"]:
        for b in json.loads((OUT / f"embusen_{p:03d}.json").read_text()):
            if (p, b["i"]) not in skip:
                frames.append((p, b))
    # Zuordnung 'manual': Bild wurde nicht erkannt, Füße stehen in Extras['f'] (verbraucht kein erkanntes Bild)
    measured = [f for f in spec["FRAMES"] if f[1] != "manual"]
    if len(frames) != len(measured):
        sys.exit(f"{len(frames)} Bilder gefunden, {len(measured)} beschrieben")
    it = iter(frames)
    frames = [(None, {"i": None, "feet": []}) if f[1] == "manual" else next(it) for f in spec["FRAMES"]]
    poses = []
    prev = None
    for (p, b), (name, assign, stance, body, ex) in zip(frames, spec["FRAMES"]):
        feet = b["feet"]
        if "f" in ex:
            f = [list(ex["f"][0]), list(ex["f"][1])]
        else:
            if len(assign) != len(feet):
                sys.exit(f"{name} (S. {p}, Bild {b['i']}): {len(feet)} Abdrücke, Zuordnung {assign!r}")
            got = {s: [feet[k]["x"], feet[k]["y"], feet[k]["dir"]] for k, s in enumerate(assign)}
            for s in "LR":
                if s not in got:
                    got[s] = list(ex["other"]) if "other" in ex else prev[0 if s == "L" else 1][:3]
            f = [got["L"], got["R"]]
        w = ex.get("w", weights(stance))
        f = [[round(a[0], 2), round(a[1], 2), int(a[2]) % 360, w[i]] for i, a in enumerate(f)]
        pose = {"f": f, "body": body}
        for k in ("look", "turn"):
            if k in ex:
                pose[k] = ex[k]
        if "turn" not in pose and poses and name not in ("rei", "end"):
            d = (body - poses[-1][1]["body"] + 540) % 360 - 180
            if d == -180:
                sys.exit(f"{name}: halbe Drehung – Richtung (turn) angeben")
            if d:
                pose["turn"] = d
        pose["h"] = ex.get("h", "")
        poses.append((name, pose))
        prev = f

    def js(pose):
        parts = ["f: [" + ", ".join("[" + ", ".join(f"{v:g}" for v in a) + "]" for a in pose["f"]) + "]", f"body: {pose['body']}"]
        for k in ("look", "turn"):
            if k in pose:
                parts.append(f"{k}: {pose[k]}")
        parts.append("h: " + json.dumps(pose["h"], ensure_ascii=False).replace('"', "'"))
        return "{ " + ", ".join(parts) + " }"

    named = dict(poses)
    moves = [pose for name, pose in poses if name not in ("rei", "yoi", "naore", "end")]
    print(f"      lines: {json.dumps(spec['LINES'])},")
    print(f"      rei: {js(named['rei'])},")
    print(f"      yoi: {js(named['yoi'])},")
    print("      moves: [")
    for m in moves:
        print(f"        {js(m)},")
    print("      ],")
    print(f"      naore: {js(named['naore'])},")
    print(f"      end: {js(named['end'])},")


if __name__ == "__main__":
    main(sys.argv[1])
