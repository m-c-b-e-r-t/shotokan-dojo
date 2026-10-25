/* SVG-Grafiken: Stände (Draufsicht), Körperwaffen, Stufen, Bewegungsrichtungen, Trefferzonen. */
(function () {
  'use strict';
  const esc = (s) => SK.util.esc(s);
  const RED = '#b71c1c';
  const MID = '#e53935';
  const LIGHT = '#ef9a9a';
  const HL = '#d32f2f';
  const INK = '#37474f';
  const SKIN_D = '#cdb6a4';
  const GHOST = '#90a4ae';
  const GH_LINE = '#78909c';
  const BG = '#fafafa';
  const ARR = '#8e1b1b';
  // Figuren im Skizzen-Stil: weiße, schattierte Formen mit Bleistift-Kontur
  const PEN = '#2b2b2b';
  const F_GI = '#fcfcfb';
  const F_SKIN = '#f6eee7';
  const F_FAR = '#e7e7e6';
  const F_FAR_SKIN = '#e2dbd4';
  const F_ACT = '#d3e6f7';
  const FONT = 'font-family="system-ui, Segoe UI, Roboto, sans-serif"';
  const CAP = 'fill="none" stroke-linecap="round" stroke-linejoin="round"';

  // ANIM: SMIL-Animation statt Ausgangsstellung (tl = Zeitleiste der zuletzt gezeichneten Figur)
  const mode = { anim: false, tl: null, view: null };
  const r1 = (v) => Math.round(v * 10) / 10;
  const lerp = (a, b, t) => [r1(a[0] + (b[0] - a[0]) * t), r1(a[1] + (b[1] - a[1]) * t)];
  // Zeitleiste für K Schlüsselbilder: kurz halten, zügig bewegen, Endstellung halten
  function timeline(K, impact) {
    const st = Math.min(0.18, 0.5 / Math.max(1, K - 1));
    const kt = [0, 0.2];
    for (let i = 1; i < K; i++) kt.push(r1((0.2 + i * st) * 1000) / 1000);
    kt.push(1);
    const sp = kt.slice(1).map(() => '.45 0 .2 1').join(';');
    const dur = K > 3 ? 3.2 : 2.6;
    return {
      K,
      dur,
      impact: kt[1 + (impact == null ? K - 1 : impact)],
      attr: `dur="${dur}s" repeatCount="indefinite" keyTimes="${kt.join(';')}" calcMode="spline" keySplines="${sp}"`,
      expand: (fr) => {
        const f = fr.slice();
        while (f.length < K) f.push(f[f.length - 1]);
        return [f[0]].concat(f, [f[K - 1]]);
      },
    };
  }
  const animEl = (attr, vals, tl) => `<animate attributeName="${attr}" values="${vals.join(';')}" ${tl.attr}/>`;
  const animTf = (type, vals, tl) => `<animateTransform attributeName="transform" type="${type}" values="${vals.join(';')}" ${tl.attr}/>`;
  const fadeLoop = (tl) => `<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.04;.95;1" dur="${tl.dur}s" repeatCount="indefinite"/>`;
  function flash(x, y, tl) {
    const t = tl.impact;
    const kt = [0, Math.max(0.01, t - 0.01), t, Math.min(0.97, t + 0.1), Math.min(0.98, t + 0.15), 1].map((v) => r1(v * 1000) / 1000);
    return `<circle cx="${x}" cy="${y}" r="7" fill="${HL}" stroke="#fff" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="${kt.join(';')}" dur="${tl.dur}s" repeatCount="indefinite"/></circle>`;
  }
  // Fuß, der sich über Schlüsselbilder [x, y, Drehung] bewegt
  function movingFoot(frames, w, o, tl) {
    const f = tl.expand(frames);
    return `<g>${animTf('translate', f.map(([x, y]) => `${x} ${y}`), tl)}<g>${animTf('rotate', f.map((v) => `${v[2]} 0 0`), tl)}${foot(0, 0, 0, w, o)}</g></g>`;
  }
  function withMode(m, fn) {
    const prev = mode.anim;
    mode.anim = m.anim;
    try {
      return fn();
    } finally {
      mode.anim = prev;
    }
  }

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
    const mx = (x) => (mirrored ? 200 - x : x);
    const txt = (x, y, t, a, extra) => `<text x="${x}" y="${y}" font-size="9.5" text-anchor="${a || 'middle'}" fill="#546e7a" ${FONT}${extra || ''}>${t}</text>`;
    let dims = '';
    if (s.feet.length === 2) {
      const [a, b] = s.feet;
      const [y1, y2] = [a[1], b[1]].sort((p, q) => p - q);
      const [x1, x2] = [mx(a[0]), mx(b[0])].sort((p, q) => p - q);
      if (y2 - y1 >= 12) dims += `<path d="M184 ${y1} V${y2} M179 ${y1} H189 M179 ${y2} H189" stroke="#546e7a" stroke-width="1.2"/>${txt(194, (y1 + y2) / 2, 'Länge', 'middle', ` transform="rotate(-90 194 ${(y1 + y2) / 2})"`)}`;
      if (x2 - x1 >= 30) dims += `<path d="M${x1} 200 H${x2} M${x1} 195 V205 M${x2} 195 V205" stroke="#546e7a" stroke-width="1.2"/>${txt((x1 + x2) / 2, 214, 'Breite')}`;
    }
    // Gewicht als Prozentzahl neben dem Fuß (bei quer gedrehtem Fuß weiter außen)
    const pct = s.knee
      ? ''
      : s.feet
        .map(([x, y, r, w]) => {
          const X = mx(x);
          const off = 13 + Math.abs(Math.sin((r * Math.PI) / 180)) * 20;
          const right = X >= 100;
          const col = !w ? GHOST : w >= 0.6 ? RED : w >= 0.4 ? MID : '#e57373';
          return `<text x="${r1(right ? X + off : X - off)}" y="${y + 4}" font-size="${w ? 12 : 9.5}" font-weight="700" text-anchor="${right ? 'start' : 'end'}" fill="${col}" ${FONT}>${w ? `${Math.round(w * 100)} %` : 'angehoben'}</text>`;
        })
        .join('');
    const ball = s.feet.some((f) => f[5]);
    const legend = ball ? `${txt(8, 14, 'gestrichelt =', 'start')}${txt(8, 25, 'nur Ballen', 'start')}` : '';
    return `<svg viewBox="0 0 200 224" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="222" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="M100 40 V196" stroke="#cfd8dc" stroke-dasharray="4 4"/>
      <path d="M100 8 l-7 11 h14 z" fill="#78909c"/><text x="100" y="31" font-size="10" text-anchor="middle" fill="#78909c" ${FONT}>vorne</text>
      ${legend}${body}${dims}${pct}</svg>`;
  }

  /* Seitenansicht je Stand (Blick nach rechts): Knöchel und Zehen je Bein, d = Absenken der Hüfte; Knie ergibt sich aus der Beinlänge.
     Grundform wie im Fußbild: links = vorderes/namensgebendes Bein, seitlich hinten (far). */
  const STANCE_SIDE = {
    musubi: { d: 0, L: [[112, 228], [126, 232]], R: [[106, 228], [120, 232]] },
    heisoku: { d: 0, L: [[110, 228], [128, 232]], R: [[108, 228], [126, 232]] },
    hachiji: { d: 0, L: [[114, 228], [130, 232]], R: [[104, 228], [120, 232]] },
    zenkutsu: { d: 34, L: [[146, 228], [166, 232]], R: [[24, 228], [42, 232]] },
    ashizenkutsu: { d: 8, L: [[138, 228], [158, 232]], R: [[64, 226], [82, 232]] },
    kokutsu: { d: 30, L: [[184, 228], [200, 232]], R: [[102, 228], [110, 233], [122, 186]], arms: 'shuto', plumb: true },
    kiba: { d: 24, L: [[112, 228], [130, 232]], R: [[116, 228], [134, 232]] },
    kosa: { d: 22, L: [[132, 228], [152, 232]], R: [[96, 220], [112, 232]] },
    ashidachi: { d: 4, L: [[112, 228], [130, 232]], R: [[132, 190], [150, 194]] },
    hizakutsu: { d: 14, L: [[150, 228], [170, 232]], R: [[42, 226], [60, 232]] },
    renoji: { d: 10, L: [[148, 228], [166, 232]], R: [[100, 228], [108, 232]] },
    teiji: { d: 8, L: [[142, 228], [160, 232]], R: [[104, 228], [112, 232]] },
    fudo: { d: 20, L: [[150, 228], [168, 232]], R: [[54, 228], [72, 232]] },
    neko: { d: 24, L: [[144, 222], [158, 232]], R: [[106, 228], [122, 232]] },
    sanchin: { d: 10, L: [[130, 228], [148, 232]], R: [[94, 228], [112, 232]] },
    hangetsu: { d: 16, L: [[140, 228], [158, 232]], R: [[72, 228], [90, 232]] },
    orishiki: { d: 50, L: [[146, 228], [164, 232]], R: [[52, 228], [40, 232]] },
  };
  // Knie aus Hüfte und Knöchel (Oberschenkel 60, Schienbein 56), immer nach vorne gebeugt
  function knee(h, a) {
    const T = 60;
    const S = 56;
    const dx = a[0] - h[0];
    const dy = a[1] - h[1];
    const D = Math.hypot(dx, dy);
    if (D >= T + S) return lerp(h, a, T / (T + S));
    const ang = Math.acos((T * T + D * D - S * S) / (2 * T * D));
    const base = Math.atan2(dy, dx);
    const c = [base - ang, base + ang].map((t) => [r1(h[0] + Math.cos(t) * T), r1(h[1] + Math.sin(t) * T)]);
    return c[0][0] > c[1][0] ? c[0] : c[1];
  }
  // Natürliche Stände zeigen statt der Seitenansicht eine Vorderansicht (rechtes Bein im Bild links)
  const frontLeg = (p, foot) => ({ p, foot, w: 15, under: true });
  const STANCE_FRONT = {
    musubi: { hands: 'open', legs: [frontLeg([[102, 118], [102, 176], [103, 228]], [92, 236]), frontLeg([[118, 118], [118, 176], [117, 228]], [128, 236])] },
    heisoku: { hands: 'open', legs: [frontLeg([[102, 118], [102, 176], [103, 228]], [103, 238]), frontLeg([[118, 118], [118, 176], [117, 228]], [117, 238])] },
    hachiji: { hands: 'yoi', legs: [frontLeg([[102, 118], [94, 176], [88, 228]], [80, 236]), frontLeg([[118, 118], [126, 176], [132, 228]], [140, 236])] },
    kiba: { d: 36, hands: 'hips', legs: [frontLeg([[100, 154], [60, 186], [58, 228]], [58, 238]), frontLeg([[120, 154], [160, 186], [162, 228]], [162, 238])] },
  };
  function stanceFrontSvg(key, title) {
    const f = STANCE_FRONT[key];
    const d = f.d || 0;
    const dn = (pts) => pts.map(([x, y]) => [x, y + d]);
    const arms = {
      open: [arm([[93, 62], [88, 96], [90, 128]], 'open'), arm([[127, 62], [132, 96], [130, 128]], 'open')],
      yoi: [arm([[93, 62], [90, 96], [100, 124]]), arm([[127, 62], [130, 96], [120, 124]])],
      hips: [arm(dn([[93, 62], [84, 94], [92, 110]])), arm(dn([[127, 62], [136, 94], [128, 110]]))],
    }[f.hands];
    const spec = { head: [110, 32 + d], view: 'front', torso: dn(FRONT.torso), belt: dn(FRONT.belt), parts: f.legs.concat(arms) };
    return `<svg viewBox="0 0 200 224" role="img" aria-label="${esc(title)} – von vorne" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="222" rx="12" fill="#fafafa" stroke="#ddd"/>
      <g transform="translate(16 -2) scale(.84)"><path d="M20 238 H200" stroke="#cfd8dc" stroke-width="2"/>${person(spec)}</g>
      <text x="100" y="217" font-size="9.5" text-anchor="middle" fill="#78909c" ${FONT}>von vorne</text></svg>`;
  }
  function stanceSideSvg(key, mirrored, opts) {
    const title = (opts && opts.title) || (STANCES[key] && STANCES[key].name);
    if (STANCE_FRONT[key]) return stanceFrontSvg(key, title);
    const g = STANCE_SIDE[key];
    if (!g) return '';
    const d = g.d;
    // optional drittes Element: Knie fest vorgegeben (z. B. nach außen zeigend, seitlich verkürzt)
    const lg = ([ankle, toe, kn], isFar) => {
      const h = [isFar ? 106 : 110, 116 + d];
      return { p: [h, kn || knee(h, ankle), ankle], foot: toe, w: 15, far: isFar };
    };
    // Shuto-uke: vordere Hand (Seite des vorderen Beins) als Handkante vorne, hintere vor dem Solarplexus
    const arms = g.arms === 'shuto'
      ? [Object.assign(arm([[112, 62 + d], [142, 70 + d], [164, 52 + d]], 'open'), { far: !mirrored }), Object.assign(arm([[112, 62 + d], [122, 94 + d], [142, 90 + d]], 'open'), { far: !!mirrored })]
      : [Object.assign(arm([[112, 62 + d], [100, 92 + d], [110, 104 + d]]), { far: true }), arm([[112, 62 + d], [102, 92 + d], [114, 104 + d]])];
    const spec = {
      head: [114, 30 + d], view: 'side', trunk: [[112, 52 + d], [108, 116 + d]],
      parts: arms.concat([lg(g.L, !mirrored), lg(g.R, !!mirrored)]),
    };
    const plumb = g.plumb ? `<path d="M106 ${120 + d} V232" stroke="${HL}" stroke-width="2.5" stroke-dasharray="5 4" opacity=".8"/><circle cx="106" cy="${116 + d}" r="4" fill="${HL}"/>` : '';
    return `<svg viewBox="0 0 200 224" role="img" aria-label="${esc(title)} – seitlich" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="222" rx="12" fill="#fafafa" stroke="#ddd"/>
      <text x="190" y="18" font-size="10" text-anchor="end" fill="#78909c" ${FONT}>vorne →</text>
      <g transform="translate(14 4) scale(.86)"><path d="M20 232 H215" stroke="#cfd8dc" stroke-width="2"/>${person(spec)}${plumb}</g>
      <text x="100" y="216" font-size="9.5" text-anchor="middle" fill="#78909c" ${FONT}>seitlich</text></svg>`;
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
    for (const [re, key, how] of rules) {
      if (!re.test(name)) continue;
      // Grundform: linker Fuß vorne. Kokutsu ist nach dem hinteren Bein benannt, Orishiki nach dem knienden (rechten) Bein.
      let mirrored = false;
      if (how === 'front') mirrored = side === 'R';
      if (how === 'back') mirrored = side === 'L';
      if (how === 'name') mirrored = side === 'L';
      return { key, mirrored };
    }
    return null;
  }

  function stanceFor(name, opts) {
    const k = stanceKey(name);
    return k ? stanceSvg(k.key, k.mirrored, Object.assign({ title: name }, opts)) : '';
  }

  // key: 'st:<stand>[:m]', 'mv:<bewegung>', 'tc:<technik>', 'wp:<waffe>'
  function byKey(key) {
    const [kind, k, m] = key.split(':');
    if (kind === 'st') return stanceSvg(k, m === 'm');
    if (kind === 'mv') return MOVES[k]();
    if (kind === 'tc') return SK.gfx.TECH[k]();
    if (kind === 'wp') return WEAPONS[k]();
    return '';
  }
  const animCache = new Map();
  function animSvg(key) {
    if (!animCache.has(key)) {
      const svg = /^(mv|tc):/.test(key) ? withMode({ anim: true }, () => byKey(key)) : '';
      animCache.set(key, svg.includes('<animate') ? stripTags(svg) : null);
    }
    return animCache.get(key);
  }
  const hasAnim = (key) => !!key && !!animSvg(key);
  // Quizbild: ohne Beschriftungen, die die Antwort verraten könnten
  const plainSvg = (fn) => stripTags(fn());
  // Grafik mit Knöpfen: Stände Fußbild ↔ Seitenansicht, Bewegungen ▶ Animation
  function box(key, svg) {
    if (!key) return svg;
    const [kind, k, m] = key.split(':');
    const side = kind === 'st' ? stanceSideSvg(k, m === 'm') : '';
    const anim = hasAnim(key);
    if (!side && !anim) return svg;
    const btn = (act, t) => `<button type="button" class="gfx-btn" data-act="${act}" data-label="${t}" aria-pressed="false">${t}</button>`;
    return `<div class="gfx-box" data-gfx="${esc(key)}"><div class="gfx-view">${svg}</div>${side ? `<div class="gfx-view" hidden>${side}</div>` : ''}${anim ? '<div class="gfx-view gfx-anim" hidden></div>' : ''}<div class="gfx-tools">${side ? btn('side', STANCE_FRONT[k] ? 'Vorderansicht' : 'Seitenansicht') : ''}${anim ? btn('anim', '▶ Bewegung') : ''}</div></div>`;
  }

  function figure(svg, caption, note, key) {
    return `<figure class="gfx">${box(key, svg)}<figcaption><b>${esc(caption)}</b>${note ? `<br>${esc(note)}` : ''}</figcaption></figure>`;
  }

  function stanceFigure(key, mirrored, caption) {
    const s = STANCES[key];
    return figure(stanceSvg(key, mirrored), caption || s.name, s.note, `st:${key}${mirrored ? ':m' : ''}`);
  }

  /* ---------- Figuren: Karateka im Gi (Gliedmaßen = Punktlisten) ---------- */
  const path = (pts) => 'M' + pts.map((p) => p.join(' ')).join(' L');
  const same = (a, b) => a[0] === b[0] && a[1] === b[1];
  // Skizzen-Look ohne SVG-Filter (Filter machen das Scrollen langsam):
  // Schlagschatten und zarte Zweitlinie als versetzte Kopien der Kontur,
  // Schattenseite als dunklere Fläche unter einer schmaleren, nach links oben versetzten hellen Fläche
  const SHADE = { [F_GI]: '#dcdcda', [F_SKIN]: '#e3d3c5', [F_FAR]: '#cbcbca', [F_FAR_SKIN]: '#cfc4b9', [F_ACT]: '#a9c6e0' };
  const under = (ink) => `<g opacity=".1" transform="translate(1.4 1.8)">${ink}</g>` + (mode.tl ? '' : `<g opacity=".3" transform="translate(.9 -.8)">${ink}</g>`);
  const lit = (draw, col) => draw(SHADE[col] || col, 0) + `<g transform="translate(-1 -1)">${draw(col, -3)}</g>`;
  function outlined(d, w, col) {
    const st = (c, ww) => `<path d="${d}" stroke="${c}" stroke-width="${ww}" ${CAP}/>`;
    return under(st(PEN, w + 2.4)) + st(PEN, w + 2.4) + lit((c, dw) => st(c, w + dw), col);
  }
  // Hilfslinien wie in Zeichenvorlagen: Gliedachsen über die Gelenke hinaus verlängert
  function guides(pts) {
    let s = '';
    for (let i = 0; i < pts.length - 1; i++) {
      const [a, b] = [pts[i], pts[i + 1]];
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const ux = (b[0] - a[0]) / l;
      const uy = (b[1] - a[1]) / l;
      s += `M${r1(a[0] - ux * 6)} ${r1(a[1] - uy * 6)} L${r1(b[0] + ux * 8)} ${r1(b[1] + uy * 8)}`;
    }
    return `<path d="${s}" stroke="${PEN}" stroke-width=".6" fill="none" opacity=".3"/>`;
  }
  // Ärmel/Hosenbein endet vor Hand bzw. Knöchel; Oberarm/Oberschenkel breiter als Unterarm/Schienbein
  function geo(p, ft, leg) {
    const n = p.length;
    const end = p[n - 1];
    const cuff = lerp(p[n - 2], end, leg ? 0.86 : 0.7);
    const cloth = p.slice(0, n - 1).concat([cuff]);
    return { segs: cloth.slice(1).map((q, i) => [cloth[i], q]), skin: leg ? [cuff, end, ft] : [cuff, end], end, prev: p[n - 2] };
  }
  // Glied als geschlossene, sich verjüngende Form (ws = Breite je Punkt). Gleicher Befehlsaufbau
  // für jede Stellung, damit SMIL die Form zwischen Schlüsselbildern überblenden kann.
  function taper(pts, ws) {
    const n = pts.length;
    const dir = (a, b) => {
      const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return l < 0.01 ? null : [(b[0] - a[0]) / l, (b[1] - a[1]) / l];
    };
    const ds = [];
    for (let i = 0; i < n - 1; i++) ds.push(dir(pts[i], pts[i + 1]));
    for (let i = 0; i < ds.length; i++) ds[i] = ds[i] || ds[i - 1] || ds.find(Boolean) || [0, 1];
    const at = (p, v, k) => `${r1(p[0] + v[0] * k)} ${r1(p[1] + v[1] * k)}`;
    const L = [];
    const R = [];
    pts.forEach((p, i) => {
      const r = ws[i] / 2;
      const d0 = ds[Math.max(0, i - 1)];
      const d1 = ds[Math.min(ds.length - 1, i)];
      const n0 = [-d0[1], d0[0]];
      const n1 = [-d1[1], d1[0]];
      if (i === 0 || i === n - 1) {
        const nn = i === 0 ? n1 : n0;
        L.push([`L${at(p, nn, r)}`]);
        R.push([`L${at(p, nn, -r)}`]);
        return;
      }
      // Gelenk: außen abgerundet (Q über den Gehrungspunkt), innen ein Gehrungspunkt (begrenzt)
      const m = [n0[0] + n1[0], n0[1] + n1[1]];
      const ml = Math.hypot(m[0], m[1]) || 1;
      const cos = Math.max(0.55, ml / 2);
      const mv = [m[0] / ml, m[1] / ml];
      const left = d0[0] * d1[1] - d0[1] * d1[0] < 0;
      const outer = (s) => `L${at(p, s > 0 ? n0 : [-n0[0], -n0[1]], r)} Q${at(p, s > 0 ? mv : [-mv[0], -mv[1]], r / cos)} ${at(p, s > 0 ? n1 : [-n1[0], -n1[1]], r)}`;
      const inner = (s) => {
        const q = at(p, s > 0 ? mv : [-mv[0], -mv[1]], Math.min(r / cos, r * 1.4));
        return `L${q} Q${q} ${q}`;
      };
      L.push([left ? outer(1) : inner(1)]);
      R.push([left ? inner(-1) : outer(-1)]);
    });
    const cap = (p, d, rA, rB, nn, k) => `Q${at([p[0] + nn[0] * rA, p[1] + nn[1] * rA], d, k)} ${at(p, d, k)} Q${at([p[0] - nn[0] * rB, p[1] - nn[1] * rB], d, k)} ${at(p, nn, -rB)}`;
    const dl = ds[ds.length - 1];
    const df = ds[0];
    const rl = ws[n - 1] / 2;
    const rf = ws[0] / 2;
    const endCap = cap(pts[n - 1], dl, rl, rl, [-dl[1], dl[0]], rl);
    const back = R.slice().reverse().map((x, i) => (i === 0 ? '' : x[0].replace(/^L(\S+ \S+) Q(\S+ \S+) (\S+ \S+)$/, 'L$3 Q$2 $1')));
    // Rückweg: Gelenkpunkte rechts in umgekehrter Reihenfolge
    const nb = [-df[1], df[0]];
    const startCap = `Q${at([pts[0][0] - nb[0] * rf, pts[0][1] - nb[1] * rf], df, -rf)} ${at(pts[0], df, -rf)} Q${at([pts[0][0] + nb[0] * rf, pts[0][1] + nb[1] * rf], df, -rf)} ${at(pts[0], nb, rf)}`;
    return 'M' + L.map((x) => x[0]).join(' ').slice(1) + ' ' + endCap + ' ' + back.filter(Boolean).join(' ') + ' L' + at(pts[0], nb, -rf) + ' ' + startCap + 'Z';
  }
  const shapeA = (vals, col, extra, tl) => `<path d="${vals[0]}" fill="${col}"${extra || ''}>${vals.length > 1 ? animEl('d', vals, tl) : ''}</path>`;
  const inkA = (vals, w, col, extra, tl) => `<path d="${vals[0]}" fill="${col}" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"${extra || ''}>${vals.length > 1 ? animEl('d', vals, tl) : ''}</path>`;
  function handA(geos, kind, c, tl) {
    const open = kind === 'open' || kind === 'vopen';
    const pos = geos.map((g) => {
      const [x, y] = g.end;
      if (!open) return [x, y, 0];
      const a = Math.atan2(y - g.prev[1], x - g.prev[0]);
      const off = kind === 'vopen' ? 3 : 6;
      return [r1(x + Math.cos(a) * off), r1(y + Math.sin(a) * off), r1((a * 180) / Math.PI + (kind === 'vopen' ? 90 : 0))];
    });
    const P = tl && pos.length > 1 ? tl.expand(pos) : [pos[0]];
    const [cx, cy, deg] = P[0];
    const st = c.ghost ? ` stroke="${c.line}" stroke-width="1.5" stroke-dasharray="3 2"` : ` stroke="${PEN}" stroke-width="1.3"`;
    const an = P.length > 1 ? animEl('cx', P.map((v) => v[0]), tl) + animEl('cy', P.map((v) => v[1]), tl) : '';
    let el;
    if (open) {
      const rot = P.length > 1 ? animTf('rotate', P.map((v) => `${v[2]} ${v[0]} ${v[1]}`), tl) : '';
      el = `<ellipse cx="${cx}" cy="${cy}" rx="10" ry="5.5" transform="rotate(${deg} ${cx} ${cy})" fill="${c.skin}"${st}>${an}${rot}</ellipse>`;
    } else {
      el = `<circle cx="${cx}" cy="${cy}" r="7" fill="${c.skin}"${st}>${an}</circle>`;
      // Fingerglieder der Faust (nur im Standbild)
      if (!c.ghost && P.length === 1) el += `<path d="M${cx - 3.5} ${cy - 3.5} q1.5 3.5 0 7 M${cx} ${cy - 4.5} q1.5 4.5 0 9 M${cx + 3.5} ${cy - 3.5} q1.5 3.5 0 7" stroke="${PEN}" stroke-width=".7" fill="none" opacity=".55"/>`;
    }
    return el;
  }
  // look: 'ghost' = gestrichelter Umriss, 'act' = bewegtes Glied (zartblau)
  // Breiten: Schulter/Hüfte breit, zum Handgelenk/Knöchel schmaler
  function widths(n, a, b) {
    return Array.from({ length: n }, (_, i) => r1(a + ((b - a) * i) / Math.max(1, n - 1)));
  }
  function limb(frames, p, tl, look) {
    const leg = !!p.foot;
    const geos = frames.map((f) => geo(f.p, f.foot, leg));
    const nc = geos[0].segs.length + 1;
    const wc = leg ? widths(nc, p.w + 5, p.w - 1) : widths(nc, p.w + 5.5, p.w + 1.5);
    const wsk = leg ? [p.w * 0.66, p.w * 0.58, p.w * 0.5] : [p.w - 1.5, p.w - 3];
    const cl = (g) => [g.segs[0][0]].concat(g.segs.map((sg) => sg[1]));
    const vals = (fn) => {
      const v = geos.map(fn);
      return tl && v.length > 1 ? tl.expand(v) : [v[0]];
    };
    const shrink = (ws, k) => ws.map((w) => Math.max(1, w + k));
    const sk = (k) => vals((g) => taper(g.skin, shrink(wsk, k)));
    const gc = (k) => vals((g) => taper(cl(g), shrink(wc, k)));
    const ghost = look === 'ghost';
    const gi = ghost ? BG : look === 'act' ? F_ACT : p.far ? F_FAR : F_GI;
    const skin = ghost ? BG : p.far ? F_FAR_SKIN : F_SKIN;
    const hand = p.end ? handA(geos, p.end, { skin, line: GH_LINE, ghost }, tl) : '';
    if (ghost) {
      const dash = ` stroke="${GH_LINE}" stroke-width="1.5" stroke-dasharray="5 3"`;
      return shapeA(sk(0), skin, dash, tl) + shapeA(gc(0), gi, dash, tl) + hand;
    }
    const lit2 = (v0, v1, col) => shapeA(v0, SHADE[col] || col, '', tl) + `<g transform="translate(-1 -1)">${shapeA(v1, col, '', tl)}</g>`;
    const ink = inkA(sk(0), 2.4, PEN, '', tl) + inkA(gc(0), 2.4, PEN, '', tl);
    const near = !p.far && !tl && mode.view !== 'top';
    return `${under(ink)}${inkA(sk(0), 2.4, PEN, '', tl)}${lit2(sk(0), sk(-3), skin)}${inkA(gc(0), 2.4, PEN, '', tl)}${lit2(gc(0), gc(-3), gi)}${hand}${near ? guides(frames[0].p) : ''}`;
  }
  function head([x, y], view) {
    if (view === 'top') return `<circle cx="${x}" cy="${y}" r="13" fill="#5b5b5b" stroke="${PEN}" stroke-width="1.3"/>`;
    const tilt = view === 'side' ? 12 : 0;
    const axis = view === 'side' ? 'M-16 1 H14 M3 -18 Q8 0 3 18' : 'M0 -19 V19 M-16 1 H16';
    const egg = (rx, ry, extra) => `<ellipse rx="${rx}" ry="${ry}" transform="rotate(${tilt})" ${extra}/>`;
    const line = egg(12, 14.5, `fill="none" stroke="${PEN}" stroke-width="2.6"`);
    return `<g transform="translate(${x} ${y})">${under(line)}${line}${egg(12, 14.5, `fill="${SHADE[F_GI]}"`)}<g transform="translate(-1 -1)">${egg(10.5, 13, `fill="${F_GI}"`)}</g><path d="${axis}" stroke="${PEN}" stroke-width=".5" fill="none" opacity=".3"/></g>`;
  }
  // Hals, Jacke mit Revers, Kopf, Gürtel (seitlich quer zum Rumpf); von oben nur Schultern und Kopf
  function body(s) {
    const top = s.view === 'top';
    const neck = (a) => (s.head && !top ? outlined(path([s.head, a]), 10, F_SKIN) : '');
    let out = '';
    let belt = '';
    if (s.torso) {
      const m = lerp(s.torso[0], s.torso[1], 0.5);
      const d = path(s.torso) + 'Z';
      const poly = (c, w) => `<path d="${d}" fill="${c}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`;
      out += neck(m) + under(poly(PEN, 10.4)) + poly(PEN, 10.4) + lit((c, dw) => poly(c, 8 + dw), F_GI);
      if (!top) {
        const [bl, br] = [s.torso[3], s.torso[2]];
        out += `<path d="M${m[0] - 7} ${m[1] - 3} L${m[0]} ${m[1] + 16} L${m[0] + 7} ${m[1] - 3}Z" fill="${F_SKIN}" stroke="${PEN}" stroke-width=".8"/><path d="M${m[0] - 7} ${m[1] - 3} L${m[0] + 5} ${m[1] + 34} M${m[0] + 7} ${m[1] - 3} L${m[0]} ${m[1] + 16}" stroke="${PEN}" stroke-width="1" fill="none" opacity=".75"/>`;
        out += `<path d="M${bl[0] + 5} ${bl[1] - 26} q5 6 3 18 M${br[0] - 5} ${br[1] - 24} q-4 7 -2 16" stroke="${PEN}" stroke-width=".7" fill="none" opacity=".4"/>`;
      }
    }
    if (s.trunk) {
      const [a, b] = s.trunk;
      const w = s.trunkW || 26;
      out += (top ? '' : neck(a)) + outlined(path(s.trunk), w, F_GI);
      if (!top) {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const dx = (b[0] - a[0]) / len;
        const dy = (b[1] - a[1]) / len;
        const pt = (o, u, v) => `${r1(o[0] + dy * u + dx * v)} ${r1(o[1] - dx * u + dy * v)}`;
        out += `<path d="M${pt(a, 3, -6)} L${pt(a, 11, -4)} L${pt(a, 7, 10)}Z" fill="${F_SKIN}"/><path d="M${pt(a, 11, -4)} L${pt(a, 4, 32)}" stroke="${PEN}" stroke-width="1" fill="none" opacity=".75"/>`;
        const m = lerp(a, b, 0.86);
        const h = w / 2 + 1;
        belt = `<path d="M${pt(m, -h, 0)} L${pt(m, h, 0)}" stroke="#1d1d1d" stroke-width="6"/><path d="M${pt(m, h - 4, 0)} L${pt(m, h - 1, 13)}" stroke="#1d1d1d" stroke-width="3" stroke-linecap="round"/>`;
      }
    }
    if (s.belt) {
      const [[x1, y1], [x2, y2]] = s.belt;
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      belt = `<path d="${path(s.belt)}" stroke="#1d1d1d" stroke-width="6"/><rect x="${mx - 4}" y="${my - 4}" width="8" height="8" rx="2" fill="#111"/><path d="M${mx - 2} ${my} l-5 14 M${mx + 2} ${my} l5 14" stroke="#1d1d1d" stroke-width="3" stroke-linecap="round"/>`;
    }
    return out + (s.head ? head(s.head, s.view) : '') + belt;
  }
  // Ausgangsstellung (ghost) gehört zum Glied mit gleichem Ansatzpunkt bzw. gleichem k.
  // Animation: ghost/from → via → Endstellung oder explizite seq [[Punkte, Fuß], …]
  function person(s) {
    const ps = s.parts || [];
    const pairs = new Map();
    ps.filter((g) => g.ghost).forEach((g) => {
      const c = ps.filter((p) => !p.ghost && !p.far && !!p.foot === !!g.foot && (g.k ? p.k === g.k : same(p.p[0], g.p[0])));
      if (c.length) pairs.set(c[c.length - 1], g);
    });
    const framesOf = (p) => {
      const endF = { p: p.p, foot: p.foot };
      if (!mode.anim) return [endF];
      if (p.seq) return p.seq.map(([q, f]) => ({ p: q, foot: f }));
      const g = pairs.get(p);
      const start = g ? { p: g.p, foot: g.foot } : p.from ? { p: p.from, foot: p.fromFoot || p.foot } : null;
      if (!start) return [endF];
      return [start].concat((p.via || []).map(([q, f]) => ({ p: q, foot: f || p.foot })), [endF]);
    };
    const live = ps.filter((p) => !p.ghost);
    const fr = new Map(live.map((p) => [p, framesOf(p)]));
    const K = Math.max(1, ...live.map((p) => fr.get(p).length));
    const imp = live.find((p) => p.impact != null);
    const tl = mode.anim && K > 1 ? timeline(K, imp ? imp.impact : null) : null;
    mode.tl = tl;
    mode.view = s.view;
    const draw = (p) => limb(fr.get(p), p, tl, pairs.has(p) || p.act ? 'act' : '');
    const pick = (f) => live.filter(f).map(draw).join('');
    const ghosts = mode.anim ? '' : ps.filter((p) => p.ghost).map((p) => `<g opacity=".7">${limb([{ p: p.p, foot: p.foot }], p, null, 'ghost')}</g>`).join('');
    return pick((p) => p.far) + pick((p) => p.under && !p.far) + body(s) + pick((p) => !p.far && !p.under) + ghosts;
  }

  const DEFS = `<defs><marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${ARR}"/></marker></defs>`;
  // Pfeile, Treffpunkte und Beschriftungen sind markiert, damit Animation/Quizbild sie nachträglich anpassen können
  function arrow(d, dashed, both) {
    return `<g data-arrow="1"><path d="${d}" stroke="#fff" stroke-width="7" ${CAP} opacity=".9"/><path d="${d}" stroke="${ARR}" stroke-width="3.2" ${CAP}${dashed ? ' stroke-dasharray="7 5"' : ''}${both ? ' marker-start="url(#ah)"' : ''} marker-end="url(#ah)"/></g>`;
  }
  function tag(x, y, text, tx, ty, anchor) {
    return `<g data-tag="1"><path d="M${x} ${y} L${tx} ${ty - 4}" stroke="${HL}" stroke-width="1.3"/><text x="${tx}" y="${ty + (ty < y ? -2 : 8)}" font-size="10" font-weight="700" text-anchor="${anchor || 'middle'}" fill="#b71c1c" ${FONT}>${esc(text)}</text></g>`;
  }
  const stripTags = (svg) => svg.replace(/<g data-tag="1">[\s\S]*?<\/g>/g, '');
  const hitDot = (x, y) => `<circle data-hit="${x} ${y}" cx="${x}" cy="${y}" r="6" fill="${HL}" stroke="#fff" stroke-width="2"/>`;
  function hit(x, y, label, tx, ty, anchor) {
    return hitDot(x, y) + (label ? tag(x, y, label, tx, ty, anchor) : '');
  }
  const ground = (w, y) => `<path d="M14 ${y} H${w - 14}" stroke="#cfd8dc" stroke-width="2"/>`;
  function frame(w, h, label, inner, lines, o) {
    const opt = o || {};
    const cap = (lines || []).map((t, i, a) => `<text x="${w / 2}" y="${h - 10 - (a.length - 1 - i) * 13}" font-size="10.5" text-anchor="middle" fill="#455a64" ${FONT}>${esc(t)}</text>`).join('');
    const legend = opt.ghost && !mode.anim ? `<text x="12" y="17" font-size="9" fill="#78909c" ${FONT}>gestrichelt = Ausgang · blau = Bewegung</text>` : '';
    const front = opt.top ? `<path d="M${w - 22} 8 l-6 10 h12 z" fill="#78909c"/><text x="${w - 22}" y="28" font-size="9" text-anchor="middle" fill="#78909c" ${FONT}>vorne</text>` : '';
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${DEFS}<rect x="1" y="1" width="${w - 2}" height="${h - 2}" rx="12" fill="#fafafa" stroke="#ddd"/>${legend}${front}${inner}${cap}</svg>`;
  }
  function scene(label, w, spec, extra, lines, o) {
    const opt = Object.assign({ ghost: true }, o);
    let fig = person(spec);
    const tl = mode.tl;
    mode.tl = null;
    if (tl) fig = `<g>${fadeLoop(tl)}${fig}</g>`;
    let rest = `${opt.pre || ''}\u0000${extra}`;
    if (mode.anim) rest = rest.replace(/<circle data-hit="([\d.-]+) ([\d.-]+)"[^>]*\/>/g, (_, x, y) => (tl ? flash(x, y, tl) : '')).replace(/<g data-arrow="1">/g, '<g data-arrow="1" opacity=".25">');
    const [pre, ex] = rest.split('\u0000');
    const inner = `<g transform="translate(0 24)">${opt.top ? '' : ground(w, 238)}${pre}${fig}${ex}</g>`;
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
  // Großansichten: jede Fläche einzeln im Skizzen-Stil – Schattenseite (helle Fläche nach links oben
  // versetzt, auf die Form beschnitten), Bleistift-Kontur, zarte Zweitlinie. k = Maßstab der Gruppe.
  let clipN = 0;
  function solid(el, fill, k) {
    const f = k || 1;
    const id = `skc${++clipN}`;
    const at = (a) => el.replace(/\/>$/, ` ${a}/>`);
    const w = r1(1.7 / f * 10) / 10;
    const o = (v) => r1((v / f) * 100) / 100;
    return `<clipPath id="${id}">${el}</clipPath>` +
      `<g opacity=".1" transform="translate(${o(1.6)} ${o(2)})">${at(`fill="${PEN}" stroke="${PEN}" stroke-width="${w}"`)}</g>` +
      `<g opacity=".3" transform="translate(${o(1)} ${o(-0.9)})">${at(`fill="none" stroke="${PEN}" stroke-width="${w}"`)}</g>` +
      at(`fill="${SHADE[fill] || fill}"`) +
      `<g clip-path="url(#${id})"><g transform="translate(${o(-5)} ${o(-4)})">${at(`fill="${fill}"`)}</g></g>` +
      at(`fill="none" stroke="${PEN}" stroke-width="${w}" stroke-linejoin="round"`);
  }
  const solids = (els, fill, k) => els.match(/<[^>]+\/>/g).map((e) => solid(e, fill, k)).join('');
  function fist(hl) {
    const h = (k, shape) => (hl === k ? shape : '');
    // Frontansicht: rechte Faust, Blick auf die Knöchel – Zeigefinger im Bild rechts, kleiner Finger links
    const knuckles = [0, 1, 2, 3].map((i) => `<rect x="${-34 + i * 17}" y="-22" width="17" height="24" rx="8"/>`).join('');
    const frontView = `<g transform="translate(110 246) scale(1.3)">${solids(`<rect x="-34" y="-22" width="68" height="44" rx="12"/>${knuckles}<rect x="-14" y="4" width="44" height="14" rx="7"/>`, F_SKIN, 1.3)}
      ${h('seiken', `<rect x="0" y="-22" width="34" height="24" rx="8" ${HLF}/>`)}${h('uraken', `<rect x="0" y="-27" width="34" height="8" rx="4" ${HLF}/>`)}${h('tettsui', `<rect x="-39" y="-20" width="9" height="40" rx="4.5" ${HLF}/>`)}</g>`;
    const labels = {
      seiken: tag(188, 104, 'Knöchel von Zeige- und Mittelfinger', 210, 162, 'end'),
      uraken: tag(152, 104, 'Faustrücken (Knöchel)', 152, 162),
      tettsui: tag(128, 154, 'Kleinfingerseite der Faust', 128, 162),
    };
    return `<svg viewBox="0 0 220 300" role="img" aria-label="Faust" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="218" height="298" rx="12" fill="#fafafa" stroke="#ddd"/>
      ${caption(110, 16, 'rechte Faust von oben (Handrücken)')}
      <g transform="translate(0 22)">
      ${solid('<path d="M42 62 Q60 60 78 56 L78 116 Q60 112 42 108 Z"/>', F_SKIN)}${solid('<path d="M6 50 H44 V118 H6"/>', F_GI)}
      ${solids('<rect x="140" y="38" width="44" height="22" rx="11"/><rect x="140" y="60" width="46" height="22" rx="11"/><rect x="140" y="82" width="44" height="21" rx="10.5"/><rect x="138" y="103" width="38" height="19" rx="9.5"/>', F_SKIN)}
      ${solid('<path d="M74 46 Q76 36 96 36 L152 36 Q160 36 160 46 L160 116 Q160 126 150 126 L96 126 Q76 126 74 114 Z"/>', F_SKIN)}
      ${solid('<path d="M96 38 Q112 22 152 26 Q172 28 176 38 Q166 44 146 42 Q120 42 100 46 Z"/>', F_SKIN)}
      <g fill="${SKIN_D}"><ellipse cx="158" cy="49" rx="5" ry="7"/><ellipse cx="160" cy="71" rx="5" ry="7"/><ellipse cx="159" cy="92" rx="4.5" ry="6.5"/><ellipse cx="155" cy="112" rx="4" ry="6"/></g>
      ${h('seiken', `<rect x="179" y="38" width="11" height="44" rx="5.5" ${HLF}/>`)}
      ${h('uraken', `<ellipse cx="152" cy="60" rx="13" ry="22" ${HLF}/>`)}
      ${h('tettsui', `<rect x="80" y="121" width="96" height="11" rx="5.5" ${HLF}/>`)}
      </g>
      ${labels[hl] || ''}
      <path d="M14 180 H206" stroke="#e0e0e0"/>
      ${caption(110, 198, 'von vorne (Blick auf die Knöchel)')}
      ${frontView}
    </svg>`;
  }
  const HAND = 'M70,104 L70,39 Q70,30 79,30 Q88,30 88,39 L88,31 Q88,22 97,22 Q106,22 106,31 L106,37 Q106,28 114.5,28 Q123,28 123,37 L123,53 Q123,44 130.5,44 Q138,44 138,53 L138,112 Q140,148 132,170 L132,198 L82,198 L82,172 Q70,150 70,128 Z';
  function hand(hl) {
    const back = hl === 'haishu';
    const h = (k, shape) => (hl === k ? shape : '');
    const detail = back
      ? `<g fill="#fbe3d2" stroke="${SKIN_D}" stroke-width="1"><rect x="73" y="32" width="12" height="10" rx="5"/><rect x="91" y="24" width="12" height="10" rx="5"/><rect x="109" y="30" width="11" height="10" rx="5"/><rect x="126" y="46" width="9" height="9" rx="4"/></g><path d="M74 104 q5 -4 10 0 M92 102 q5 -4 10 0 M110 103 q5 -4 10 0 M126 106 q4 -3 8 0" stroke="${SKIN_D}" stroke-width="2" fill="none"/>`
      : `<path d="M72 62 h14 M90 56 h14 M108 60 h13 M125 72 h11 M72 84 h14 M90 80 h14 M108 82 h13 M125 90 h11 M80 120 Q104 112 132 118 M78 136 Q96 130 110 150" stroke="${SKIN_D}" stroke-width="1.5" fill="none"/>`;
    let body = `${solid('<path d="M74,160 Q54,150 48,124 Q44,106 54,104 Q63,103 65,118 Q68,134 74,138 Z"/>', F_SKIN)}${solid(`<path d="${HAND}"/>`, F_SKIN)}
      <path d="M88 39 V100 M106 37 V100 M123 53 V102" fill="none" stroke="${PEN}" stroke-width="1.3"/>${detail}${back ? `<path d="${HAND}" fill="${HL}" opacity=".35"/>` : ''}
      ${solid('<path d="M76 192 H138 V224 H76 Z"/>', F_GI)}`;
    if (back) body = `<g transform="translate(208 0) scale(-1 1)">${body}</g>`;
    return `<svg viewBox="0 0 208 246" role="img" aria-label="Offene Hand" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="206" height="244" rx="12" fill="#fafafa" stroke="#ddd"/>
      ${body}
      ${h('shuto', `<path d="M139 106 Q141 146 133 170" stroke-width="10" ${HLS}/>`)}
      ${h('haito', `<path d="M70 96 L70 124" stroke-width="10" ${HLS}/>`)}
      ${h('nukite', `<g ${HLF}><ellipse cx="79" cy="35" rx="9" ry="7"/><ellipse cx="97" cy="27" rx="9" ry="7"/><ellipse cx="114.5" cy="33" rx="8.5" ry="7"/><ellipse cx="130.5" cy="49" rx="7.5" ry="7"/></g>`)}
      ${h('teisho', `<ellipse cx="104" cy="166" rx="27" ry="11" ${HLF}/>`)}
      ${{ shuto: tag(141, 140, 'Handkante', 204, 128, 'end'), haito: tag(68, 98, 'Innenkante', 8, 80, 'start'), nukite: tag(132, 46, 'Fingerspitzen', 204, 30, 'end'), teisho: tag(128, 170, 'Handballen', 204, 186, 'end'), haishu: tag(124, 80, 'Handrücken', 202, 64, 'end') }[hl] || ''}
      ${caption(104, 238, back ? 'linke Hand, Rückseite' : 'linke Hand, Innenfläche')}
    </svg>`;
  }
  const FOOTSIDE = 'M46,26 L82,26 L84,66 Q92,82 118,90 Q150,98 176,104 Q190,106 200,100 Q210,98 210,108 Q209,120 194,124 L64,126 Q38,126 36,106 Q35,88 46,74 Z';
  function footSide(hl) {
    const h = (k, shape) => (hl === k ? shape : '');
    const labels = {
      koshi: tag(184, 118, 'Fußballen', 222, 66, 'end'),
      kakato: tag(38, 110, 'Ferse', 6, 92, 'start'),
      haisoku: tag(130, 92, 'Fußrücken (Spann)', 166, 60),
      sokuto: tag(120, 130, 'Fußkante (außen)', 120, 140),
    };
    // zweite Ansicht: Sohle von unten (große Zehe unten) bzw. Fußrücken von oben (große Zehe oben)
    const top = hl === 'haisoku';
    const hl2 = {
      koshi: `<path d="${BALL}" ${HLF}/>`,
      kakato: `<ellipse cx="0" cy="17" rx="7.5" ry="7.5" ${HLF}/>`,
      sokuto: `<path d="M-1,25 C-7,25 -9.5,20 -9.5,12 C-9.5,4 -12,-5 -12,-12" stroke-width="3.4" ${HLS}/>`,
      haisoku: `<ellipse cx="0" cy="0" rx="8" ry="11" ${HLF}/>`,
    }[hl] || '';
    const second = `<g transform="translate(104 244) rotate(90) scale(${top ? '-2.4 2.4' : '2.4'})">${solid(`<path d="${SOLE}"/>`, F_SKIN, 2.4)}${solids(TOES, F_SKIN, 2.4)}${hl2}</g>`;
    return `<svg viewBox="0 0 230 300" role="img" aria-label="Fuß" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="228" height="298" rx="12" fill="#fafafa" stroke="#ddd"/>
      ${solid(`<path d="${FOOTSIDE}"/>`, F_SKIN)}
      <circle cx="70" cy="76" r="6" fill="${SKIN_D}"/>
      <path d="M188 105 q3 9 0 18 M198 102 q3 9 0 19" stroke="${SKIN_D}" stroke-width="1.5" fill="none"/>
      ${solid('<path d="M40 6 H90 V36 H40 Z"/>', F_GI)}
      ${h('koshi', `<ellipse cx="182" cy="123" rx="16" ry="6" ${HLF}/>`)}
      ${h('kakato', `<ellipse cx="45" cy="113" rx="12" ry="12" ${HLF}/>`)}
      ${h('haisoku', `<path d="M86 70 Q94 84 118 91 Q150 99 176 105" stroke-width="9" ${HLS}/>`)}
      ${h('sokuto', `<path d="M52 126 L176 125" stroke-width="8" ${HLS}/>`)}
      ${labels[hl] || ''}
      ${caption(115, 166, 'rechter Fuß von außen (Zehen rechts)')}
      <path d="M14 176 H216" stroke="#e0e0e0"/>
      ${second}
      ${caption(115, 290, top ? 'rechter Fuß von oben' : 'rechter Fuß von unten (Sohle)')}
    </svg>`;
  }
  function bentLimb(kind) {
    const o = { ghost: false };
    if (kind === 'zenwan') {
      return scene('Arm', 220, front([HIKITE_L, arm([[93, 62], [86, 102], [76, 60]])]), `<path d="M86 96 L78 66" stroke-width="13" ${HLS}/>` + tag(76, 80, 'Unterarm', 14, 40, 'start'), ['von vorne'], o);
    }
    if (kind === 'hiji') {
      return scene('Arm', 240, Object.assign({}, SIDE, {
        parts: [
          Object.assign(arm([[112, 62], [104, 94], [116, 106]]), { far: true }),
          { p: [[106, 116], [72, 172], [38, 226]], w: 15, foot: [56, 232], far: true },
          { p: [[110, 116], [142, 168], [138, 228]], w: 15, foot: [158, 232] },
          arm([[112, 62], [152, 72], [120, 80]]),
        ]
      }), `<circle cx="161" cy="72" r="10" ${HLF}/>` + tag(166, 64, 'Ellbogen', 226, 38, 'end'), ['seitlich: Schlag nach vorne'], o);
    }
    return scene('Bein', 240, Object.assign({}, SIDE, {
      parts: [
        Object.assign(arm([[112, 62], [132, 84], [146, 98]]), { far: true }),
        { p: [[106, 116], [104, 176], [100, 228]], w: 15, foot: [118, 232], far: true },
        arm([[112, 62], [138, 80], [150, 96]]),
        { p: [[108, 116], [152, 94], [126, 146]], w: 15, foot: [118, 160] },
      ]
    }), `<circle cx="161" cy="90" r="11" ${HLF}/>` + tag(168, 82, 'Knie', 222, 52, 'end'), ['seitlich: Sto\u00df nach oben'], o);
  }
  const WEAPONS = {
    seiken: () => fist('seiken'), uraken: () => fist('uraken'), tettsui: () => fist('tettsui'),
    shuto: () => hand('shuto'), haito: () => hand('haito'), nukite: () => hand('nukite'), teisho: () => hand('teisho'), haishu: () => hand('haishu'),
    koshi: () => footSide('koshi'), kakato: () => footSide('kakato'), haisoku: () => footSide('haisoku'), sokuto: () => footSide('sokuto'),
    hiji: () => bentLimb('hiji'), hiza: () => bentLimb('hiza'), zenwan: () => bentLimb('zenwan'),
  };

  /* ---------- Bewegungen: Endstellung + gestrichelte Ausgangsstellung + Pfeil ---------- */
  const FRONT_CAP = ['von vorne · rechter Arm (im Bild links)'];
  // from = Startstellung der Gegenhand (nur für die Animation)
  const block = (label, end, start, d, hikiteFrom) => () => scene(label, 220, front([Object.assign({}, HIKITE_L, { from: hikiteFrom }), arm(end), ghost(arm(start))]), arrow(d), FRONT_CAP);
  const SIDE = { head: [114, 30], view: 'side', trunk: [[112, 52], [108, 116]] };
  const kick = (stand, chamber, ext) => ({ p: ext[0], foot: ext[1], w: 15, seq: [stand, chamber, ext, chamber, stand], impact: 2 });
  function oiZuki() {
    const tl = mode.anim ? timeline(2) : null;
    const step = tl ? movingFoot([[70, 212, 0], [70, 104, 0]], 0.7, { side: 'L' }, tl) : foot(70, 104, 0, 0.7, { side: 'L' }) + foot(70, 212, 0, 0, { side: 'L' }) + arrow('M70 188 L70 140', true);
    const spec = {
      head: [110, 150], view: 'top', trunk: [[80, 152], [140, 152]], trunkW: 20,
      parts: [Object.assign(arm([[82, 152], [94, 106], [104, 62]]), { from: [[82, 152], [78, 168], [84, 180]] }), Object.assign(arm([[138, 152], [146, 172]]), { from: [[138, 152], [132, 108]] })],
    };
    return scene('Oi-zuki', 220, spec, '', ['von oben: Schritt nach vorne –', 'Faust auf der Seite des vorderen Fußes'], { top: true, pre: foot(138, 196, 25, 0.3, { side: 'R' }) + step });
  }
  // Draufsicht: Hüfte dreht von schräg (Hanmi) nach frontal
  function gyakuZuki() {
    const HS = [[83, 123], [137, 177]];
    const HE = [[72, 150], [148, 150]];
    const bar = (d, extra, an) => `<path d="${d}" stroke="${HL}" stroke-width="7" stroke-linecap="round"${extra}>${an || ''}</path>`;
    let hip;
    if (mode.anim) {
      const tl = timeline(2);
      hip = bar(path(HS), '', animEl('d', tl.expand([path(HS), path(HE)]), tl));
    } else {
      hip = bar(path(HS), ' stroke-dasharray="2 9" opacity=".7"') + bar(path(HE), '') + `<text x="12" y="-7" font-size="9" fill="#78909c" ${FONT}>gepunktet = Hüfte vorher (Hanmi)</text>`;
    }
    const spec = {
      head: [110, 150], view: 'top',
      parts: [Object.assign(arm([[140, 150], [128, 106], [112, 64]]), { from: [[134, 170], [146, 184], [138, 196]] }), Object.assign(arm([[80, 150], [74, 164], [80, 176]]), { from: [[86, 126], [80, 96], [76, 66]] })],
    };
    const extra = arrow('M143 183 A46 46 0 0 0 156 150') + `<text x="164" y="162" font-size="12" font-weight="700" fill="#c62828" ${FONT}>45°</text><text x="66" y="154" font-size="10" font-weight="700" text-anchor="end" fill="#b71c1c" ${FONT}>Hüfte</text>`;
    return scene('Gyaku-zuki', 220, spec, extra, ['von oben: Hüfte dreht von schräg nach', 'frontal – Faust der Gegenseite'], { top: true, ghost: false, pre: foot(70, 104, 0, 0.7, { side: 'L' }) + foot(138, 196, 25, 0.3, { side: 'R' }) + hip });
  }
  const MOVES = {
    'age-uke': block('Age-uke', [[93, 62], [74, 26], [126, 6]], [[93, 62], [84, 94], [92, 110]], 'M100 104 C104 76 110 44 120 20', [[127, 62], [122, 40], [100, 30]]),
    'gedan-barai': block('Gedan-barai', [[93, 62], [80, 100], [70, 138]], [[93, 62], [108, 86], [128, 48]], 'M130 58 C124 100 96 130 64 150', [[127, 62], [124, 96], [110, 126]]),
    'soto-uke': block('Soto-uke', [[93, 62], [98, 102], [104, 58]], [[93, 62], [64, 70], [62, 34]], 'M56 46 C60 80 86 86 102 74', [[127, 62], [118, 86], [110, 92]]),
    'uchi-uke': block('Uchi-uke', [[93, 62], [86, 102], [76, 60]], [[93, 62], [108, 98], [128, 108]], 'M126 100 C106 120 80 108 74 74', [[127, 62], [118, 86], [110, 92]]),
    'mae-geri': () =>
      scene('Mae-geri', 240, Object.assign({}, SIDE, {
        parts: [
          Object.assign(arm([[112, 62], [128, 90], [142, 80]]), { far: true }),
          { p: [[108, 116], [104, 176], [100, 228]], w: 15, foot: [118, 232], far: true },
          arm([[112, 62], [104, 96], [118, 106]]),
          kick([[[108, 116], [112, 176], [114, 228]], [132, 232]], [[[108, 116], [146, 100], [136, 152]], [150, 158]], [[[108, 116], [152, 116], [194, 112]], [199, 96]]),
          ghost({ p: [[108, 116], [146, 100], [136, 152]], w: 15, foot: [150, 158] }),
        ]
      }), arrow('M152 166 C176 160 192 140 196 122') + hit(201, 100, 'Fußballen', 222, 66, 'end'), ['seitlich: Knie hochziehen, Unterschenkel', 'nach vorne schnappen – Fußballen trifft']),
    'yoko-geri': () =>
      scene('Yoko-geri', 240, {
        head: [96, 40], view: 'front', torso: [[80, 62], [114, 56], [121, 118], [97, 122]], belt: [[97, 115], [121, 112]], parts: [
          { p: [[101, 120], [95, 178], [91, 228]], w: 15, foot: [85, 234], under: true },
          arm([[82, 66], [66, 96], [84, 100]]),
          arm([[112, 62], [134, 84], [118, 96]]),
          kick([[[117, 118], [124, 176], [129, 228]], [135, 234]], [[[117, 118], [150, 102], [128, 150]], [122, 158]], [[[117, 118], [162, 114], [206, 108]], [208, 122]]),
          ghost({ p: [[117, 118], [150, 102], [128, 150]], w: 15, foot: [122, 158] }),
        ]
      }, arrow('M126 164 C162 162 190 144 202 128') + hit(215, 115, 'Fußkante', 226, 84, 'end'), ['von vorne: Knie hochziehen, Bein zur Seite', 'strecken – Fußkante trifft']),
    'mawashi-geri': () =>
      scene('Mawashi-geri', 220, {
        head: [108, 134], view: 'top', trunk: [[78, 142], [140, 128]], trunkW: 20, parts: [
          { p: [[124, 140], [134, 100], [118, 64]], w: 15, foot: [112, 52], under: true, via: [[[[124, 140], [168, 104], [150, 72]], [142, 62]]] },
          ghost({ p: [[124, 140], [176, 136], [166, 176]], w: 15, foot: [156, 184] }),
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
          kick([[[112, 118], [120, 176], [116, 228]], [134, 232]], [[[112, 118], [134, 148], [108, 166]], [100, 176]], [[[112, 118], [72, 116], [30, 112]], [32, 128]]),
          ghost({ p: [[112, 118], [134, 148], [108, 166]], w: 15, foot: [100, 176] }),
        ]
      }, arrow('M100 186 C70 186 46 162 36 138') + hit(24, 112, 'Ferse', 18, 80, 'start'), ['seitlich: Knie anziehen, Ferse stößt', 'in gerader Linie nach hinten']),
    'mikazuki-geri': () =>
      scene('Mikazuki-geri', 220, Object.assign({}, FRONT, {
        parts: [
          { p: [[118, 118], [124, 176], [129, 228]], w: 15, foot: [135, 234], under: true },
          HIKITE_R,
          arm([[127, 62], [156, 74], [176, 80]], 'open'),
          { p: [[102, 118], [142, 112], [166, 94]], w: 15, foot: [170, 80], via: [[[[102, 118], [72, 150], [80, 190]], [70, 196]], [[[102, 118], [110, 120], [130, 104]], [130, 90]]] },
          ghost(LEG_R),
        ]
      }), arrow('M78 222 C36 176 46 104 100 90 C124 84 142 84 156 90') + hit(177, 86, 'Fußsohle', 206, 52, 'end'), ['von vorne (wie Heian Godan 15): Fuß schwingt', 'im Bogen von außen nach innen in die Hand']),
    'oi-zuki': oiZuki,
    'gyaku-zuki': gyakuZuki,
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

  SK.gfx = { STANCES, STANCE_SIDE, stanceSvg, stanceSideSvg, stanceFor, stanceKey, stanceFigure, figure, box, byKey, animSvg, hasAnim, plainSvg, levels, WEAPONS, MOVES, targets, dataUri };
  // Bausatz für weitere Technik-Grafiken (js/graphics-tech.js)
  SK.gfx.kit = { person, scene, frame, arm, ghost, front, FRONT, SIDE, LEG_R, LEG_L, HIKITE_R, HIKITE_L, arrow, hit, tag, foot, movingFoot, timeline, animEl, animTf, mode, path, FONT, HL, HLF, HLS, INK, GHOST, ARR };
})();
