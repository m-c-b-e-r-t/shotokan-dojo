/* SVG-Grafiken: Stände (Draufsicht), Körperwaffen, Stufen, Bewegungsrichtungen, Trefferzonen. */
(function () {
  'use strict';
  const esc = (s) => SK.util.esc(s);
  const RED = '#b71c1c';
  const MID = '#e53935';
  const LIGHT = '#ef9a9a';
  const HL = '#ff6f00';
  const INK = '#37474f';
  const SKIN = '#f2c9a6';
  const SKIN_D = '#d9a57f';
  const GI = '#ffffff';
  const FAR = '#e3e8ec';
  const GHOST = '#90a4ae';
  const ARR = '#d32f2f';
  const FONT = 'font-family="system-ui, Segoe UI, Roboto, sans-serif"';
  const CAP = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';

  /* ---------- Fußabdruck: linker Fuß, Zehen oben (rechter Fuß = gespiegelt) ---------- */
  const SOLE = 'M0,26 C-7,26 -9.5,20 -9.5,12 C-9.5,4 -12,-5 -12,-12 C-12,-19.5 -6,-23 1,-23 C8,-23 13,-19.5 13,-12.5 C13,-6 7.5,-1 6.5,7 C5.5,15 7,26 0,26Z';
  const BALL = 'M-11.6,-5 C-12,-8 -12,-10 -12,-12 C-12,-19.5 -6,-23 1,-23 C8,-23 13,-19.5 13,-12.5 C13,-9.5 12,-7 10.5,-5Z';
  const TOES = '<ellipse cx="8.2" cy="-28.5" rx="4.4" ry="5.4"/><ellipse cx="1.8" cy="-30" rx="2.8" ry="3.4"/><ellipse cx="-3.2" cy="-29" rx="2.6" ry="3.2"/><ellipse cx="-7.6" cy="-27" rx="2.4" ry="2.9"/><ellipse cx="-11" cy="-23.8" rx="2.1" ry="2.5"/>';
  const FS = 0.8;

  function foot(x, y, r, w, o) {
    const opt = o || {};
    const sc = opt.scale || FS;
    const t = `translate(${x} ${y}) rotate(${r}) scale(${opt.side === 'R' ? -sc : sc} ${sc})`;
    if (!w) return `<g transform="${t}" fill="none" stroke="${GHOST}" stroke-width="1.8" stroke-dasharray="3 2.5"><path d="${SOLE}"/>${TOES}</g>`;
    const fill = w >= 0.6 ? RED : w >= 0.4 ? MID : LIGHT;
    if (opt.ball) return `<g transform="${t}"><path d="${SOLE}" fill="none" stroke="${fill}" stroke-width="1.8" stroke-dasharray="3 2.5"/><g fill="${fill}"><path d="${BALL}"/>${TOES}</g></g>`;
    return `<g transform="${t}" fill="${fill}"><path d="${SOLE}"/>${TOES}</g>`;
  }

  // Grundform: linker Fuß ist der namensgebende/vordere; Migi wird gespiegelt. Fuß = [x, y, Drehung, Gewicht, Seite, nur Ballen]
  const STANCES = {
    musubi: { name: 'Musubi-dachi', feet: [[92, 116, -25, 0.5, 'L'], [108, 116, 25, 0.5, 'R']], note: 'Fersen zusammen, Fußspitzen V-förmig geöffnet' },
    heisoku: { name: 'Heisoku-dachi', feet: [[89.5, 116, 0, 0.5, 'L'], [110.5, 116, 0, 0.5, 'R']], note: 'Füße geschlossen und parallel' },
    hachiji: { name: 'Hachiji-dachi', feet: [[68, 116, -15, 0.5, 'L'], [132, 116, 15, 0.5, 'R']], note: 'Füße etwa schulterbreit, Spitzen leicht nach außen (Shizentai)' },
    zenkutsu: { name: 'Zenkutsu-dachi', feet: [[72, 62, 0, 0.7, 'L'], [128, 160, 25, 0.3, 'R']], note: 'Vorderes Knie gebeugt, hinteres Bein gestreckt – Gewicht überwiegend vorne' },
    ashizenkutsu: { name: 'Ashi-zenkutsu', feet: [[80, 80, 0, 0.7, 'L'], [120, 146, 20, 0.3, 'R']], note: 'Kürzer und schmaler als Zenkutsu-dachi (z. B. in Gyaku-hanmi)' },
    kokutsu: { name: 'Kokutsu-dachi', feet: [[100, 64, 0, 0.3, 'L'], [118, 158, 90, 0.7, 'R']], note: 'Gewicht überwiegend hinten, hinterer Fuß quer, vorderer Fuß berührt leicht den Boden' },
    kiba: { name: 'Kiba-dachi', feet: [[46, 116, 0, 0.5, 'L'], [154, 116, 0, 0.5, 'R']], note: 'Reiterstand: breit, Füße parallel, Gewicht gleich verteilt' },
    kosa: { name: 'Kosa-dachi', feet: [[106, 84, 0, 0.9, 'L'], [88, 136, 10, 0.1, 'R', true]], note: 'Kreuzstand: hinterer Fuß kreuzt hinter die Ferse des vorderen und steht nur auf dem Ballen' },
    ashidachi: { name: 'Ashi-dachi (Einbeinstand)', feet: [[92, 112, 0, 1, 'L'], [114, 96, 10, 0, 'R']], note: 'Stand auf einem Bein, das andere Bein ist angehoben (gestrichelt)' },
    hizakutsu: { name: 'Hizakutsu', feet: [[72, 70, -35, 0.7, 'L'], [128, 152, -15, 0.3, 'R']], note: 'Knie gebeugt, beide Fußspitzen schräg zur Seite – Technik in andere Richtung als der Zenkutsu-dachi' },
    renoji: { name: 'Renoji-dachi', feet: [[100, 82, 0, 0.4, 'L'], [118, 148, 90, 0.6, 'R']], note: 'L-förmiger Stand' },
    teiji: { name: 'Teiji-dachi', feet: [[100, 72, 0, 0.5, 'L'], [100, 150, 90, 0.5, 'R']], note: 'T-förmiger Stand' },
    fudo: { name: 'Fudo-dachi', feet: [[76, 62, 0, 0.5, 'L'], [126, 158, 45, 0.5, 'R']], note: '„Unbeweglicher“ Stand: beide Knie gebeugt, Gewicht ausgeglichen' },
    neko: { name: 'Neko-ashi-dachi', feet: [[100, 80, 0, 0.1, 'L', true], [110, 148, 30, 0.9, 'R']], note: 'Katzenfußstand: vorderer Fuß nur auf dem Ballen, fast das gesamte Gewicht hinten' },
    sanchin: { name: 'Sanchin-dachi', feet: [[86, 86, 25, 0.5, 'L'], [120, 140, -15, 0.5, 'R']], note: 'Sanduhrstand: Fußspitzen und Knie nach innen' },
    hangetsu: { name: 'Hangetsu-dachi', feet: [[72, 72, 25, 0.5, 'L'], [130, 156, -25, 0.5, 'R']], note: 'Halbmondstand: länger und breiter als Sanchin-dachi' },
    orishiki: { name: 'Orishiki (Knien)', feet: [[82, 78, 0, 0.5, 'L']], knee: [118, 128], note: 'Knien auf einem Bein, das andere Knie ist aufgestellt' },
  };

  function stanceSvg(key, mirrored, opts) {
    const s = STANCES[key];
    if (!s) return '';
    const o = opts || {};
    let body = s.feet.map(([x, y, r, w, side, ball]) => foot(x, y, r, w, { side, ball })).join('');
    if (s.knee) {
      const [kx, ky] = s.knee;
      body += `<rect x="${kx - 10}" y="${ky}" width="20" height="50" rx="10" fill="${LIGHT}"/><circle cx="${kx}" cy="${ky}" r="12" fill="${RED}"/>`;
    }
    if (mirrored) body = `<g transform="translate(200 0) scale(-1 1)">${body}</g>`;
    const title = o.title || s.name;
    if (o.mini) {
      return `<svg class="mini-stance" viewBox="28 30 144 156" role="img" aria-label="${esc(title)}">${body}</svg>`;
    }
    let grid = '';
    for (let i = 20; i <= 180; i += 20) grid += `M${i} 40 V200 M20 ${i + 20} H180 `;
    const key2 = (x, fill, dash, t) => `<rect x="${x}" y="208" width="9" height="9" rx="2" fill="${fill}"${dash ? ` stroke="${GHOST}" stroke-dasharray="2 1.5"` : ''}/><text x="${x + 12}" y="216" font-size="8.5" fill="#607d8b" ${FONT}>${t}</text>`;
    return `<svg viewBox="0 0 200 224" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="222" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="${grid}" stroke="#eceff1" stroke-width="1"/>
      <path d="M100 8 l-7 11 h14 z" fill="#78909c"/><text x="100" y="31" font-size="10" text-anchor="middle" fill="#78909c" ${FONT}>vorne</text>
      ${body}
      ${key2(14, RED, false, 'viel Gewicht')}${key2(88, LIGHT, false, 'wenig')}${key2(130, 'none', true, 'angehoben')}</svg>`;
  }

  /* Ordnet einen Standnamen (wie im Kata-Buch) einer Grafik zu. */
  function stanceKey(name) {
    const side = /^Migi\b/.test(name) ? 'R' : /^Hidari\b/.test(name) ? 'L' : null;
    const rules = [
      [/Musubi/, 'musubi', null],
      [/Heisoku/, 'heisoku', null],
      [/Hachiji/, 'hachiji', null],
      [/Kiba-dachi/, 'kiba', null],
      [/Orishiki/, 'orishiki', 'name'],
      [/Ashi-zenkutsu/, 'ashizenkutsu', 'front'],
      [/Zenkutsu-dachi/, 'zenkutsu', 'front'],
      [/Kokutsu-dachi/, 'kokutsu', 'back'],
      [/Kosa/, 'kosa', 'front'],
      [/Renoji/, 'renoji', 'front'],
      [/Fudo-dachi/, 'fudo', 'front'],
      [/Hizakutsu/, 'hizakutsu', 'front'],
      [/Ashi-dachi/, 'ashidachi', 'front'],
      [/Neko-ashi/, 'neko', 'front'],
      [/Sanchin/, 'sanchin', 'front'],
      [/Hangetsu/, 'hangetsu', 'front'],
      [/Teiji/, 'teiji', 'front'],
    ];
    for (const [re, key, mode] of rules) {
      if (!re.test(name)) continue;
      // Grundform: linker Fuß vorne. Kokutsu ist nach dem hinteren Bein benannt, Orishiki nach dem knienden (rechten) Bein.
      let mirrored = false;
      if (mode === 'front') mirrored = side === 'R';
      if (mode === 'back') mirrored = side === 'L';
      if (mode === 'name') mirrored = side === 'L';
      return { key, mirrored };
    }
    return null;
  }

  function stanceFor(name, opts) {
    const k = stanceKey(name);
    return k ? stanceSvg(k.key, k.mirrored, Object.assign({ title: name }, opts)) : '';
  }

  function figure(svg, caption, note) {
    return `<figure class="gfx">${svg}<figcaption><b>${esc(caption)}</b>${note ? `<br>${esc(note)}` : ''}</figcaption></figure>`;
  }

  function stanceFigure(key, mirrored, caption) {
    const s = STANCES[key];
    return figure(stanceSvg(key, mirrored), caption || s.name, s.note);
  }

  /* ---------- Figuren: Karateka im Gi (Gliedmaßen = Punktlisten) ---------- */
  const path = (pts) => 'M' + pts.map((p) => p.join(' ')).join(' L');
  function outlined(d, w, col) {
    return `<path d="${d}" stroke="${INK}" stroke-width="${w + 3}" ${CAP}/><path d="${d}" stroke="${col}" stroke-width="${w}" ${CAP}/>`;
  }
  function handEnd(pts, kind, ghost) {
    const [x, y] = pts[pts.length - 1];
    const fill = ghost ? GHOST : SKIN;
    const line = ghost ? '' : ` stroke="${INK}" stroke-width="1.5"`;
    if (kind === 'open' || kind === 'vopen') {
      const [px, py] = pts[pts.length - 2];
      const a = Math.atan2(y - py, x - px);
      const off = kind === 'vopen' ? 3 : 6;
      const cx = (x + Math.cos(a) * off).toFixed(1);
      const cy = (y + Math.sin(a) * off).toFixed(1);
      const deg = (a * 180) / Math.PI + (kind === 'vopen' ? 90 : 0);
      return `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="5.5" transform="rotate(${deg.toFixed(1)} ${cx} ${cy})" fill="${fill}"${line}/>`;
    }
    return `<circle cx="${x}" cy="${y}" r="7" fill="${fill}"${line}/>`;
  }
  function part(p) {
    const last = p.p[p.p.length - 1];
    if (p.ghost) {
      let s = `<path d="${path(p.p)}" stroke="${GHOST}" stroke-width="${p.w}" ${CAP}/>`;
      if (p.foot) s += `<path d="${path([last, p.foot])}" stroke="${GHOST}" stroke-width="${Math.round(p.w * 0.65)}" ${CAP}/>`;
      if (p.end) s += handEnd(p.p, p.end, true);
      return `<g opacity=".45">${s}</g>`;
    }
    let s = outlined(path(p.p), p.w, p.far ? FAR : GI);
    if (p.foot) s += outlined(path([last, p.foot]), Math.round(p.w * 0.65), SKIN);
    if (p.end) s += handEnd(p.p, p.end, false);
    return s;
  }
  function head([x, y], view) {
    if (view === 'top') return `<circle cx="${x}" cy="${y}" r="13" fill="#4e342e" stroke="${INK}" stroke-width="1.5"/>`;
    const hair = view === 'side' ? 'M-13,2 A13,13 0 0 1 12,-6 Q3,-9 -2,-2 Q-5,4 -13,2Z' : 'M-12.5,-3 A13,13 0 0 1 12.5,-3 Q6,-9 0,-8 Q-6,-9 -12.5,-3Z';
    return `<g transform="translate(${x} ${y})"><circle r="13" fill="${SKIN}" stroke="${INK}" stroke-width="1.5"/><path d="${hair}" fill="#4e342e"/></g>`;
  }
  // Reihenfolge: hinten (far) – unter dem Rumpf (under) – Rumpf/Kopf/Gürtel – vorne – Ausgangsstellung (ghost) halbtransparent darüber
  function person(s) {
    const ps = s.parts || [];
    const pick = (f) => ps.filter(f).map(part).join('');
    let torso = '';
    if (s.torso) {
      const d = path(s.torso) + 'Z';
      torso = `<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="11" stroke-linejoin="round"/><path d="${d}" fill="${GI}" stroke="${GI}" stroke-width="8" stroke-linejoin="round"/>`;
    }
    if (s.trunk) torso = outlined(path(s.trunk), s.trunkW || 26, GI);
    let belt = '';
    if (s.belt) {
      const [[x1, y1], [x2, y2]] = s.belt;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      belt = `<path d="${path(s.belt)}" stroke="#212121" stroke-width="6"/><path d="M${mx - 2} ${my} l-5 14 M${mx + 2} ${my} l5 14" stroke="#212121" stroke-width="3" stroke-linecap="round"/>`;
    }
    return (
      pick((p) => p.far && !p.ghost) +
      pick((p) => p.under && !p.far && !p.ghost) +
      torso +
      (s.head ? head(s.head, s.view) : '') +
      belt +
      pick((p) => !p.far && !p.under && !p.ghost) +
      pick((p) => p.ghost)
    );
  }

  const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${ARR}"/></marker></defs>`;
  function arrow(d, dashed, both) {
    return `<path d="${d}" stroke="#fff" stroke-width="7" ${CAP} opacity=".9"/><path d="${d}" stroke="${ARR}" stroke-width="3.2" ${CAP}${dashed ? ' stroke-dasharray="7 5"' : ''}${both ? ' marker-start="url(#ah)"' : ''} marker-end="url(#ah)"/>`;
  }
  const hit = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="${HL}" stroke="#fff" stroke-width="2"/>`;
  const ground = (w, y) => `<path d="M14 ${y} H${w - 14}" stroke="#cfd8dc" stroke-width="2"/>`;
  function frame(w, h, label, inner, lines, o) {
    const opt = o || {};
    const cap = (lines || []).map((t, i, a) => `<text x="${w / 2}" y="${h - 10 - (a.length - 1 - i) * 13}" font-size="10.5" text-anchor="middle" fill="#455a64" ${FONT}>${esc(t)}</text>`).join('');
    const legend = opt.ghost ? `<text x="12" y="17" font-size="9" fill="#78909c" ${FONT}>grau = Ausgangsstellung</text>` : '';
    const front = opt.top ? `<path d="M${w - 22} 8 l-6 10 h12 z" fill="#78909c"/><text x="${w - 22}" y="28" font-size="9" text-anchor="middle" fill="#78909c" ${FONT}>vorne</text>` : '';
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${DEFS}<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="#fafafa" stroke="#ddd"/>${legend}${front}${inner}${cap}</svg>`;
  }
  function scene(label, w, spec, extra, lines, o) {
    const opt = Object.assign({ ghost: true }, o);
    const inner = `<g transform="translate(0 24)">${opt.top ? '' : ground(w, 238)}${opt.pre || ''}${person(spec)}${extra}</g>`;
    return frame(w, lines && lines.length > 1 ? 300 : 290, label, inner, lines, opt);
  }

  // Grundfigur von vorne (rechte Körperseite = im Bild links)
  const FRONT = { head: [110, 32], view: 'front', torso: [[93, 56], [127, 56], [122, 118], [98, 118]], belt: [[96, 112], [124, 112]] };
  const LEG_R = { p: [[102, 118], [95, 176], [89, 228]], w: 15, foot: [83, 234], under: true };
  const LEG_L = { p: [[118, 118], [125, 176], [131, 228]], w: 15, foot: [137, 234], under: true };
  const arm = (p, end) => ({ p, w: 10, end: end || 'fist' });
  const HIKITE_R = arm([[93, 62], [84, 94], [92, 110]]);
  const HIKITE_L = arm([[127, 62], [136, 94], [128, 110]]);
  const ghost = (p) => Object.assign({}, p, { ghost: true, under: false, far: false });
  const front = (parts) => Object.assign({}, FRONT, { parts: [LEG_R, LEG_L].concat(parts) });

  /* ---------- Stufen Jodan / Chudan / Gedan ---------- */
  function levels() {
    const fig = person(front([arm([[93, 62], [86, 96], [94, 128]]), arm([[127, 62], [134, 96], [126, 128]])]));
    const band = (y1, y2, col, t, sub) =>
      `<rect x="44" y="${y1}" width="132" height="${y2 - y1}" fill="${col}" opacity=".55"/><text x="184" y="${(y1 + y2) / 2}" font-size="13" font-weight="700" fill="#333" ${FONT}>${t}</text><text x="184" y="${(y1 + y2) / 2 + 13}" font-size="9.5" fill="#555" ${FONT}>${sub}</text>`;
    return `<svg viewBox="0 0 250 270" role="img" aria-label="Jodan, Chudan, Gedan" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="248" height="268" rx="12" fill="#fafafa" stroke="#ddd"/>
      <g transform="translate(0 16)">${band(8, 56, '#ef9a9a', 'Jodan', 'Gesicht')}${band(56, 112, '#ffcc80', 'Chudan', 'Brust')}${band(112, 160, '#a5d6a7', 'Gedan', 'Unterbauch')}${fig}</g></svg>`;
  }

  /* ---------- Körperwaffen ---------- */
  const HLF = `fill="${HL}" opacity=".85"`;
  const HLS = `stroke="${HL}" stroke-linecap="round" fill="none" opacity=".85"`;
  const caption = (x, y, t) => `<text x="${x}" y="${y}" font-size="10.5" text-anchor="middle" fill="#455a64" ${FONT}>${t}</text>`;
  function fist(hl) {
    const h = (k, shape) => (hl === k ? shape : '');
    return `<svg viewBox="0 0 220 160" role="img" aria-label="Faust" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="218" height="158" rx="12" fill="#fafafa" stroke="#ddd"/>
      <g stroke="${INK}" stroke-width="2" stroke-linejoin="round">
        <path d="M42 62 Q60 60 78 56 L78 116 Q60 112 42 108 Z" fill="${SKIN}"/>
        <path d="M6 50 H44 V118 H6" fill="${GI}"/>
        <g fill="${SKIN}"><rect x="140" y="38" width="44" height="22" rx="11"/><rect x="140" y="60" width="46" height="22" rx="11"/><rect x="140" y="82" width="44" height="21" rx="10.5"/><rect x="138" y="103" width="38" height="19" rx="9.5"/></g>
        <path d="M74 46 Q76 36 96 36 L152 36 Q160 36 160 46 L160 116 Q160 126 150 126 L96 126 Q76 126 74 114 Z" fill="${SKIN}"/>
        <path d="M96 38 Q112 22 152 26 Q172 28 176 38 Q166 44 146 42 Q120 42 100 46 Z" fill="${SKIN}"/>
      </g>
      <g fill="${SKIN_D}"><ellipse cx="158" cy="49" rx="5" ry="7"/><ellipse cx="160" cy="71" rx="5" ry="7"/><ellipse cx="159" cy="92" rx="4.5" ry="6.5"/><ellipse cx="155" cy="112" rx="4" ry="6"/></g>
      ${h('seiken', `<rect x="179" y="38" width="11" height="44" rx="5.5" ${HLF}/>`)}
      ${h('uraken', `<ellipse cx="152" cy="60" rx="13" ry="22" ${HLF}/>`)}
      ${h('tettsui', `<rect x="80" y="121" width="96" height="11" rx="5.5" ${HLF}/>`)}
      ${caption(110, 150, 'rechte Faust von oben (Handrücken)')}
    </svg>`;
  }
  const HAND = 'M70,104 L70,39 Q70,30 79,30 Q88,30 88,39 L88,31 Q88,22 97,22 Q106,22 106,31 L106,37 Q106,28 114.5,28 Q123,28 123,37 L123,53 Q123,44 130.5,44 Q138,44 138,53 L138,112 Q140,148 132,170 L132,198 L82,198 L82,172 Q70,150 70,128 Z';
  function hand(hl) {
    const back = hl === 'haishu';
    const h = (k, shape) => (hl === k ? shape : '');
    const detail = back
      ? `<g fill="#fbe3d2" stroke="${SKIN_D}" stroke-width="1"><rect x="73" y="32" width="12" height="10" rx="5"/><rect x="91" y="24" width="12" height="10" rx="5"/><rect x="109" y="30" width="11" height="10" rx="5"/><rect x="126" y="46" width="9" height="9" rx="4"/></g><path d="M74 104 q5 -4 10 0 M92 102 q5 -4 10 0 M110 103 q5 -4 10 0 M126 106 q4 -3 8 0" stroke="${SKIN_D}" stroke-width="2" fill="none"/>`
      : `<path d="M72 62 h14 M90 56 h14 M108 60 h13 M125 72 h11 M72 84 h14 M90 80 h14 M108 82 h13 M125 90 h11 M80 120 Q104 112 132 118 M78 136 Q96 130 110 150" stroke="${SKIN_D}" stroke-width="1.5" fill="none"/>`;
    let body = `<g stroke="${INK}" stroke-width="2" stroke-linejoin="round">
        <path d="M74,160 Q54,150 48,124 Q44,106 54,104 Q63,103 65,118 Q68,134 74,138 Z" fill="${SKIN}"/>
        <path d="${HAND}" fill="${SKIN}"/>
        <path d="M88 39 V100 M106 37 V100 M123 53 V102" fill="none" stroke-width="1.5"/>
      </g>${detail}${back ? `<path d="${HAND}" fill="${HL}" opacity=".35"/>` : ''}
      <path d="M76 192 H138 V224 H76 Z" fill="${GI}" stroke="${INK}" stroke-width="2"/>`;
    if (back) body = `<g transform="translate(208 0) scale(-1 1)">${body}</g>`;
    return `<svg viewBox="0 0 208 246" role="img" aria-label="Offene Hand" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="206" height="244" rx="12" fill="#fafafa" stroke="#ddd"/>
      ${body}
      ${h('shuto', `<path d="M139 106 Q141 146 133 170" stroke-width="10" ${HLS}/>`)}
      ${h('haito', `<path d="M70 96 L70 124" stroke-width="10" ${HLS}/>`)}
      ${h('nukite', `<g ${HLF}><ellipse cx="79" cy="35" rx="9" ry="7"/><ellipse cx="97" cy="27" rx="9" ry="7"/><ellipse cx="114.5" cy="33" rx="8.5" ry="7"/><ellipse cx="130.5" cy="49" rx="7.5" ry="7"/></g>`)}
      ${h('teisho', `<ellipse cx="104" cy="166" rx="27" ry="11" ${HLF}/>`)}
      ${caption(104, 238, back ? 'linke Hand, Rückseite' : 'linke Hand, Innenfläche')}
    </svg>`;
  }
  const FOOTSIDE = 'M46,26 L82,26 L84,66 Q92,82 118,90 Q150,98 176,104 Q190,106 200,100 Q210,98 210,108 Q209,120 194,124 L64,126 Q38,126 36,106 Q35,88 46,74 Z';
  function footSide(hl) {
    const h = (k, shape) => (hl === k ? shape : '');
    return `<svg viewBox="0 0 230 160" role="img" aria-label="Fuß" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="228" height="158" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="${FOOTSIDE}" fill="${SKIN}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="70" cy="76" r="6" fill="${SKIN_D}"/>
      <path d="M188 105 q3 9 0 18 M198 102 q3 9 0 19" stroke="${SKIN_D}" stroke-width="1.5" fill="none"/>
      <path d="M40 6 H90 V36 H40 Z" fill="${GI}" stroke="${INK}" stroke-width="2"/>
      ${h('koshi', `<ellipse cx="182" cy="123" rx="16" ry="6" ${HLF}/>`)}
      ${h('kakato', `<ellipse cx="45" cy="113" rx="12" ry="12" ${HLF}/>`)}
      ${h('haisoku', `<path d="M86 70 Q94 84 118 91 Q150 99 176 105" stroke-width="9" ${HLS}/>`)}
      ${h('sokuto', `<path d="M52 126 L176 125" stroke-width="8" ${HLS}/>`)}
      ${caption(115, 150, 'rechter Fuß von außen (Zehen rechts)')}
    </svg>`;
  }
  function bentLimb(kind) {
    const o = { ghost: false };
    if (kind === 'zenwan') {
      return scene('Arm', 220, front([HIKITE_L, arm([[93, 62], [86, 102], [76, 60]])]), `<path d="M86 96 L78 66" stroke-width="13" ${HLS}/>`, ['von vorne'], o);
    }
    if (kind === 'hiji') {
      return scene('Arm', 240, Object.assign({}, SIDE, {
        parts: [
          Object.assign(arm([[112, 62], [104, 94], [116, 106]]), { far: true }),
          { p: [[106, 116], [72, 172], [38, 226]], w: 15, foot: [56, 232], far: true },
          { p: [[110, 116], [142, 168], [138, 228]], w: 15, foot: [158, 232] },
          arm([[112, 62], [152, 72], [120, 80]]),
        ]
      }), `<circle cx="161" cy="72" r="10" ${HLF}/>`, ['seitlich: Schlag nach vorne'], o);
    }
    return scene('Bein', 240, Object.assign({}, SIDE, {
      parts: [
        Object.assign(arm([[112, 62], [132, 84], [146, 98]]), { far: true }),
        { p: [[106, 116], [104, 176], [100, 228]], w: 15, foot: [118, 232], far: true },
        arm([[112, 62], [138, 80], [150, 96]]),
        { p: [[108, 116], [152, 94], [126, 146]], w: 15, foot: [118, 160] },
      ]
    }), `<circle cx="161" cy="90" r="11" ${HLF}/>`, ['seitlich: Sto\u00df nach oben'], o);
  }
  const WEAPONS = {
    seiken: () => fist('seiken'), uraken: () => fist('uraken'), tettsui: () => fist('tettsui'),
    shuto: () => hand('shuto'), haito: () => hand('haito'), nukite: () => hand('nukite'), teisho: () => hand('teisho'), haishu: () => hand('haishu'),
    koshi: () => footSide('koshi'), kakato: () => footSide('kakato'), haisoku: () => footSide('haisoku'), sokuto: () => footSide('sokuto'),
    hiji: () => bentLimb('hiji'), hiza: () => bentLimb('hiza'), zenwan: () => bentLimb('zenwan'),
  };

  /* ---------- Bewegungen: Endstellung + graue Ausgangsstellung + Pfeil ---------- */
  const FRONT_CAP = ['von vorne · rechter Arm (im Bild links)'];
  const block = (label, end, start, d) => () => scene(label, 220, front([HIKITE_L, arm(end), ghost(arm(start))]), arrow(d), FRONT_CAP);
  const SIDE = { head: [114, 30], view: 'side', trunk: [[112, 52], [108, 116]] };
  function punch(gyaku) {
    const pre =
      foot(70, 104, 0, 0.7, { side: 'L' }) +
      foot(138, 196, 25, 0.3, { side: 'R' }) +
      (gyaku ? '' : foot(70, 212, 0, 0, { side: 'L' }) + arrow('M70 188 L70 140', true));
    const spec = gyaku
      ? { head: [112, 150], view: 'top', trunk: [[84, 158], [140, 140]], trunkW: 20, parts: [arm([[138, 142], [124, 102], [112, 62]]), arm([[86, 158], [80, 178]]), ghost(arm([[138, 142], [148, 164]]))] }
      : { head: [110, 150], view: 'top', trunk: [[80, 152], [140, 152]], trunkW: 20, parts: [arm([[82, 152], [94, 106], [104, 62]]), arm([[138, 152], [146, 172]])] };
    const d = gyaku ? 'M158 158 C154 118 136 86 120 68' : '';
    const lines = gyaku ? ['von oben: Faust der Gegenseite –', 'Hüfte und Schultern drehen ein'] : ['von oben: Schritt nach vorne –', 'Faust auf der Seite des vorderen Fußes'];
    return scene(gyaku ? 'Gyaku-zuki' : 'Oi-zuki', 220, spec, d ? arrow(d) : '', lines, { top: true, pre });
  }
  const MOVES = {
    'age-uke': block('Age-uke', [[93, 62], [74, 26], [126, 6]], [[93, 62], [84, 94], [92, 110]], 'M100 104 C104 76 110 44 120 20'),
    'gedan-barai': block('Gedan-barai', [[93, 62], [80, 100], [70, 138]], [[93, 62], [108, 86], [128, 48]], 'M130 58 C124 100 96 130 64 150'),
    'soto-uke': block('Soto-uke', [[93, 62], [98, 102], [104, 58]], [[93, 62], [64, 70], [62, 34]], 'M56 46 C60 80 86 86 102 74'),
    'uchi-uke': block('Uchi-uke', [[93, 62], [86, 102], [76, 60]], [[93, 62], [108, 98], [128, 108]], 'M126 100 C106 120 80 108 74 74'),
    'mae-geri': () =>
      scene('Mae-geri', 240, Object.assign({}, SIDE, {
        parts: [
          Object.assign(arm([[112, 62], [128, 90], [142, 80]]), { far: true }),
          { p: [[108, 116], [104, 176], [100, 228]], w: 15, foot: [118, 232], far: true },
          arm([[112, 62], [104, 96], [118, 106]]),
          { p: [[108, 116], [152, 116], [194, 112]], w: 15, foot: [199, 96] },
          ghost({ p: [[108, 116], [146, 100], [136, 152]], w: 15, foot: [150, 158] }),
        ]
      }), arrow('M152 166 C176 160 192 140 196 122') + hit(201, 100), ['seitlich: Knie hochziehen, Unterschenkel', 'nach vorne schnappen – Fußballen trifft']),
    'yoko-geri': () =>
      scene('Yoko-geri', 240, {
        head: [96, 40], view: 'front', torso: [[80, 62], [114, 56], [121, 118], [97, 122]], belt: [[97, 115], [121, 112]], parts: [
          { p: [[101, 120], [95, 178], [91, 228]], w: 15, foot: [85, 234], under: true },
          arm([[82, 66], [66, 96], [84, 100]]),
          arm([[112, 62], [134, 84], [118, 96]]),
          { p: [[117, 118], [162, 114], [206, 108]], w: 15, foot: [208, 122] },
          ghost({ p: [[117, 118], [150, 102], [128, 150]], w: 15, foot: [122, 158] }),
        ]
      }, arrow('M126 164 C162 162 190 144 202 128') + hit(215, 115), ['von vorne: Knie hochziehen, Bein zur Seite', 'strecken – Fußkante trifft']),
    'mawashi-geri': () =>
      scene('Mawashi-geri', 220, {
        head: [108, 134], view: 'top', trunk: [[78, 142], [140, 128]], trunkW: 20, parts: [
          { p: [[124, 140], [134, 100], [118, 64]], w: 15, foot: [112, 52], under: true },
          ghost({ p: [[126, 140], [176, 136], [166, 176]], w: 15, foot: [156, 184] }),
        ]
      }, arrow('M172 188 C214 150 198 74 128 56') + hit(112, 50), ['von oben: Bein schwingt seitlich', 'im Halbkreis nach vorne zum Ziel'], {
        top: true,
        pre: `${foot(96, 172, -70, 1, { side: 'L' })}<circle cx="110" cy="40" r="11" fill="none" stroke="#78909c" stroke-width="2" stroke-dasharray="4 3"/><text x="128" y="38" font-size="9" fill="#78909c" ${FONT}>Ziel</text>`,
      }),
    'ushiro-geri': () =>
      scene('Ushiro-geri', 240, {
        head: [150, 50], view: 'side', trunk: [[142, 70], [114, 118]], parts: [
          Object.assign(arm([[140, 76], [160, 98], [170, 82]]), { far: true }),
          { p: [[116, 118], [126, 176], [120, 228]], w: 15, foot: [138, 232], far: true },
          arm([[140, 76], [150, 106], [162, 96]]),
          { p: [[112, 118], [72, 116], [30, 112]], w: 15, foot: [32, 128] },
          ghost({ p: [[112, 118], [134, 148], [108, 166]], w: 15, foot: [100, 176] }),
        ]
      }, arrow('M100 186 C70 186 46 162 36 138') + hit(24, 112), ['seitlich: Knie anziehen, Ferse stößt', 'in gerader Linie nach hinten']),
    'mikazuki-geri': () =>
      scene('Mikazuki-geri', 220, Object.assign({}, FRONT, {
        parts: [
          { p: [[118, 118], [124, 176], [129, 228]], w: 15, foot: [135, 234], under: true },
          HIKITE_R,
          arm([[127, 62], [156, 74], [176, 80]], 'open'),
          { p: [[102, 118], [142, 112], [166, 94]], w: 15, foot: [170, 80] },
          ghost(LEG_R),
        ]
      }), arrow('M78 222 C36 176 46 104 100 90 C124 84 142 84 156 90') + hit(177, 86), ['von vorne (wie Heian Godan 15): Fuß schwingt', 'im Bogen von außen nach innen in die Hand']),
    'oi-zuki': () => punch(false),
    'gyaku-zuki': () => punch(true),
  };

  /* ---------- Trefferzonen (nach Anhang des JKA-Kata-Buchs) ---------- */
  function targets() {
    const fig = person(front([arm([[93, 62], [80, 98], [76, 134]]), arm([[127, 62], [140, 98], [144, 134]])]));
    const pts = [
      [100, 28, 'Kasumi (Schläfe)', 'l'], [110, 38, 'Jinchu', 'r'], [110, 44, 'Mikazuki (Kinn)', 'l'],
      [110, 78, 'Suigetsu', 'r'], [120, 92, 'Denko', 'r'], [100, 102, 'Inazuma', 'l'],
      [110, 129, 'Myojo', 'r'], [97, 156, 'Daitai', 'l'], [125, 176, 'Hiza', 'r'],
    ];
    const marks = pts
      .map(([x, y, t, side]) => {
        const tx = side === 'r' ? 166 : 54;
        const anchor = side === 'r' ? 'start' : 'end';
        return `<path d="M${x} ${y} L${side === 'r' ? tx - 4 : tx + 4} ${y}" stroke="#90a4ae"/><circle cx="${x}" cy="${y}" r="4.5" fill="${HL}" stroke="#fff" stroke-width="1.5"/><text x="${tx}" y="${y + 4}" font-size="11" text-anchor="${anchor}" ${FONT} fill="#333">${esc(t)}</text>`;
      })
      .join('');
    return `<svg viewBox="-44 0 300 270" role="img" aria-label="Trefferzonen" xmlns="http://www.w3.org/2000/svg">
      <rect x="-43" y="1" width="298" height="268" rx="12" fill="#fafafa" stroke="#ddd"/>
      <g transform="translate(0 16)">${fig}${marks}</g></svg>`;
  }

  function dataUri(svg) {
    const s = svg.includes('xmlns=') ? svg : svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
  }

  SK.gfx = { STANCES, stanceSvg, stanceFor, stanceKey, stanceFigure, figure, levels, WEAPONS, MOVES, targets, dataUri };
  // Bausatz für weitere Technik-Grafiken (js/graphics-tech.js)
  SK.gfx.kit = { person, scene, frame, arm, ghost, front, FRONT, SIDE, LEG_R, LEG_L, HIKITE_R, HIKITE_L, arrow, hit, foot, FONT, HL, HLF, HLS, INK, GHOST, ARR };
})();
