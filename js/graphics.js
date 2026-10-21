/* SVG-Grafiken: Stände (Draufsicht), Körperwaffen, Stufen, Bewegungsrichtungen, Trefferzonen. */
(function () {
  'use strict';
  const esc = (s) => SK.util.esc(s);
  const RED = '#b71c1c';
  const LIGHT = '#e57373';
  const HL = '#ff6f00';

  function foot(x, y, r, w, scale) {
    const lifted = w === 0;
    const fill = lifted ? 'none' : w > 0.5 ? RED : LIGHT;
    const stroke = lifted ? ` stroke="${LIGHT}" stroke-width="2" stroke-dasharray="4 3"` : '';
    return `<g transform="translate(${x} ${y}) rotate(${r}) scale(${scale || 1})"><path d="M0,-30 C9,-30 12,-18 11,-4 C10,10 8,22 0,24 C-8,22 -10,10 -11,-4 C-12,-18 -9,-30 0,-30Z" fill="${fill}"${stroke}/></g>`;
  }

  // Alle Stände in „linker“ Grundform (linker Fuß ist der namensgebende/vordere); Migi wird gespiegelt.
  const STANCES = {
    musubi: { name: 'Musubi-dachi', feet: [[92, 116, -25, 0.5], [108, 116, 25, 0.5]], note: 'Fersen zusammen, Fußspitzen V-förmig geöffnet' },
    heisoku: { name: 'Heisoku-dachi', feet: [[88, 112, 0, 0.5], [112, 112, 0, 0.5]], note: 'Füße geschlossen und parallel' },
    hachiji: { name: 'Hachiji-dachi', feet: [[66, 112, -15, 0.5], [134, 112, 15, 0.5]], note: 'Füße etwa schulterbreit, Spitzen leicht nach außen (Shizentai)' },
    zenkutsu: { name: 'Zenkutsu-dachi', feet: [[76, 62, 0, 0.7], [124, 160, 25, 0.3]], note: 'Vorderes Knie gebeugt, hinteres Bein gestreckt – Gewicht überwiegend vorne' },
    ashizenkutsu: { name: 'Ashi-zenkutsu', feet: [[80, 82, 0, 0.7], [120, 146, 20, 0.3]], note: 'Kürzer und schmaler als Zenkutsu-dachi (z. B. in Gyaku-hanmi)' },
    kokutsu: { name: 'Kokutsu-dachi', feet: [[96, 64, 0, 0.3], [104, 156, 90, 0.7]], note: 'Gewicht überwiegend hinten, hinterer Fuß quer, vorderer Fuß berührt leicht den Boden' },
    kiba: { name: 'Kiba-dachi', feet: [[48, 112, 0, 0.5], [152, 112, 0, 0.5]], note: 'Reiterstand: breit, Füße parallel, Gewicht gleich verteilt' },
    kosa: { name: 'Kosa-dachi', feet: [[96, 86, 0, 0.9], [114, 138, 30, 0.1]], note: 'Kreuzstand: hinterer Fuß steht hinter der Ferse des vorderen, Beine gekreuzt' },
    ashidachi: { name: 'Ashi-dachi (Einbeinstand)', feet: [[90, 112, 0, 1], [112, 98, 10, 0]], note: 'Stand auf einem Bein, das andere Bein ist angehoben (gestrichelt)' },
    hizakutsu: { name: 'Hizakutsu', feet: [[72, 70, -35, 0.7], [128, 152, -15, 0.3]], note: 'Knie gebeugt, beide Fußspitzen schräg zur Seite – Technik in andere Richtung als der Zenkutsu-dachi' },
    renoji: { name: 'Renoji-dachi', feet: [[100, 80, 0, 0.4], [100, 146, 90, 0.6]], note: 'L-förmiger Stand' },
    teiji: { name: 'Teiji-dachi', feet: [[112, 70, 0, 0.5], [100, 150, 90, 0.5]], note: 'T-förmiger Stand' },
    fudo: { name: 'Fudo-dachi', feet: [[80, 64, 0, 0.5], [122, 156, 45, 0.5]], note: '„Unbeweglicher“ Stand: beide Knie gebeugt, Gewicht ausgeglichen' },
    neko: { name: 'Neko-ashi-dachi', feet: [[100, 76, 0, 0.1], [108, 148, 35, 0.9]], note: 'Katzenfußstand: fast das gesamte Gewicht auf dem hinteren Bein' },
    sanchin: { name: 'Sanchin-dachi', feet: [[84, 84, 20, 0.5], [118, 140, -15, 0.5]], note: 'Sanduhrstand: Fußspitzen und Knie nach innen' },
    hangetsu: { name: 'Hangetsu-dachi', feet: [[74, 72, 25, 0.5], [128, 152, -25, 0.5]], note: 'Halbmondstand: länger und breiter als Sanchin-dachi' },
    orishiki: { name: 'Orishiki (Knien)', feet: [[84, 80, 0, 0.5]], knee: [118, 132], note: 'Knien auf einem Bein, das andere Knie ist aufgestellt' },
  };

  function stanceSvg(key, mirrored, opts) {
    const s = STANCES[key];
    if (!s) return '';
    const o = opts || {};
    let body = s.feet.map((f) => foot(...f)).join('');
    if (s.knee) {
      body += `<rect x="${s.knee[0] - 10}" y="${s.knee[1]}" width="20" height="46" rx="9" fill="${LIGHT}"/><circle cx="${s.knee[0]}" cy="${s.knee[1]}" r="12" fill="${RED}"/>`;
    }
    if (mirrored) body = `<g transform="translate(200 0) scale(-1 1)">${body}</g>`;
    const title = o.title || s.name;
    if (o.mini) {
      return `<svg class="mini-stance" viewBox="30 30 140 150" role="img" aria-label="${esc(title)}">${body}</svg>`;
    }
    return `<svg viewBox="0 0 200 200" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="198" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="M100 8 l-8 12 h16 z" fill="#555"/><text x="100" y="34" font-size="11" text-anchor="middle" fill="#555" font-family="sans-serif">vorne</text>
      ${body}</svg>`;
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

  /* ---------- Stufen Jodan / Chudan / Gedan ---------- */
  function levels() {
    return `<svg viewBox="0 0 240 260" role="img" aria-label="Jodan, Chudan, Gedan" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="238" height="258" rx="12" fill="#fafafa" stroke="#ddd"/>
      <rect x="40" y="14" width="110" height="50" fill="#ef9a9a" opacity=".55"/>
      <rect x="40" y="66" width="110" height="58" fill="#ffcc80" opacity=".55"/>
      <rect x="40" y="126" width="110" height="40" fill="#a5d6a7" opacity=".55"/>
      <g fill="none" stroke="#333" stroke-width="5" stroke-linecap="round">
        <circle cx="95" cy="38" r="18" fill="#fff"/>
        <path d="M95 56 V150 M95 72 L62 120 M95 72 L128 120 M95 150 L72 238 M95 150 L118 238"/>
      </g>
      <g font-family="sans-serif" font-size="14" font-weight="700" fill="#333">
        <text x="158" y="44">Jodan</text><text x="158" y="100">Chudan</text><text x="158" y="152">Gedan</text>
      </g>
      <g font-family="sans-serif" font-size="10" fill="#555">
        <text x="158" y="58">Gesicht</text><text x="158" y="114">Brust</text><text x="158" y="166">Unterbauch</text>
      </g></svg>`;
  }

  /* ---------- Körperwaffen ---------- */
  const BODY = '#f3d9c4';
  const LINE = '#8d6e63';
  function fist(hl) {
    const h = (k, shape) => (hl === k ? shape.replace('/>', ` fill="${HL}" opacity=".9"/>`) : '');
    return `<svg viewBox="0 0 200 150" role="img" aria-label="Faust" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="148" rx="12" fill="#fafafa" stroke="#ddd"/>
      <rect x="10" y="58" width="50" height="34" fill="${BODY}" stroke="${LINE}" stroke-width="2"/>
      <rect x="50" y="34" width="100" height="82" rx="20" fill="${BODY}" stroke="${LINE}" stroke-width="2"/>
      <path d="M62 40 q30 -16 52 0" fill="none" stroke="${LINE}" stroke-width="2"/>
      <g fill="${LINE}"><circle cx="138" cy="50" r="4"/><circle cx="141" cy="68" r="4"/><circle cx="141" cy="86" r="4"/><circle cx="138" cy="103" r="4"/></g>
      ${h('seiken', '<rect x="146" y="40" width="12" height="40" rx="5"/>')}
      ${h('uraken', '<ellipse cx="128" cy="62" rx="16" ry="20"/>')}
      ${h('tettsui', '<rect x="66" y="110" width="74" height="12" rx="6"/>')}
      <text x="100" y="140" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">Faust (Handrücken, Daumen oben)</text>
    </svg>`;
  }
  function hand(hl) {
    const h = (k, shape) => (hl === k ? shape.replace('/>', ` fill="${HL}" opacity=".9"/>`) : '');
    return `<svg viewBox="0 0 200 200" role="img" aria-label="Offene Hand" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="198" rx="12" fill="#fafafa" stroke="#ddd"/>
      <g fill="${BODY}" stroke="${LINE}" stroke-width="2">
        <rect x="80" y="20" width="16" height="66" rx="8"/><rect x="98" y="14" width="16" height="72" rx="8"/>
        <rect x="116" y="20" width="16" height="66" rx="8"/><rect x="134" y="32" width="14" height="56" rx="7"/>
        <rect x="78" y="78" width="72" height="80" rx="16"/>
        <rect x="58" y="92" width="16" height="50" rx="8" transform="rotate(-35 66 117)"/>
        <rect x="90" y="156" width="48" height="24" fill="${BODY}"/>
      </g>
      ${h('shuto', '<rect x="144" y="84" width="10" height="70" rx="5"/>')}
      ${h('haito', '<rect x="72" y="70" width="10" height="26" rx="5"/>')}
      ${h('nukite', '<rect x="80" y="12" width="68" height="14" rx="7"/>')}
      ${h('teisho', '<rect x="84" y="136" width="60" height="20" rx="10"/>')}
      ${hl === 'haishu' ? `<rect x="76" y="12" width="78" height="148" rx="16" fill="none" stroke="${HL}" stroke-width="4" stroke-dasharray="6 4"/><text x="40" y="40" font-size="11" fill="${HL}" font-family="sans-serif">Rückseite</text>` : ''}
      <text x="100" y="196" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">rechte Hand, Innenfläche</text>
    </svg>`;
  }
  function footSide(hl) {
    const h = (k, shape) => (hl === k ? shape.replace('/>', ` fill="${HL}" opacity=".9"/>`) : '');
    return `<svg viewBox="0 0 220 140" role="img" aria-label="Fuß" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="218" height="138" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="M40 14 h34 v50 q10 18 50 26 q50 6 70 16 q8 6 0 14 h-160 q-8 -2 -8 -14 q0 -16 14 -22 z" fill="${BODY}" stroke="${LINE}" stroke-width="2"/>
      ${h('koshi', '<ellipse cx="158" cy="118" rx="20" ry="7"/>')}
      ${h('kakato', '<ellipse cx="40" cy="112" rx="16" ry="10"/>')}
      ${h('haisoku', '<path d="M80 68 q10 16 46 24 q40 6 56 12 l-4 8 q-20 -6 -56 -12 q-36 -8 -48 -26 z"/>')}
      ${h('sokuto', '<rect x="30" y="114" width="120" height="8" rx="4"/>')}
      <text x="110" y="134" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">Fuß von der Seite (Zehen rechts)</text>
    </svg>`;
  }
  function limb(kind) {
    const isArm = kind === 'hiji' || kind === 'zenwan';
    const path = isArm ? 'M30 50 L110 70 L170 30' : 'M60 20 L110 90 L70 150';
    const hl = kind === 'zenwan' ? `<path d="M116 66 L166 34" stroke="${HL}" stroke-width="20" stroke-linecap="round" opacity=".85"/>` : `<circle cx="110" cy="${isArm ? 70 : 90}" r="16" fill="${HL}" opacity=".9"/>`;
    return `<svg viewBox="0 0 200 170" role="img" aria-label="${isArm ? 'Arm' : 'Bein'}" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="198" height="168" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="${path}" fill="none" stroke="${BODY}" stroke-width="26" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${path}" fill="none" stroke="${LINE}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>
      ${hl}<text x="100" y="164" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">${isArm ? 'gebeugter Arm' : 'gebeugtes Bein'}</text></svg>`;
  }
  const WEAPONS = {
    seiken: () => fist('seiken'), uraken: () => fist('uraken'), tettsui: () => fist('tettsui'),
    shuto: () => hand('shuto'), haito: () => hand('haito'), nukite: () => hand('nukite'), teisho: () => hand('teisho'), haishu: () => hand('haishu'),
    koshi: () => footSide('koshi'), kakato: () => footSide('kakato'), haisoku: () => footSide('haisoku'), sokuto: () => footSide('sokuto'),
    hiji: () => limb('hiji'), hiza: () => limb('hiza'), zenwan: () => limb('zenwan'),
  };

  /* ---------- Bewegungsrichtungen ---------- */
  const ARROW = '<defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#c62828"/></marker></defs>';
  function frontFigure(path, label) {
    return `<svg viewBox="0 0 220 230" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${ARROW}
      <rect x="1" y="1" width="218" height="228" rx="12" fill="#fafafa" stroke="#ddd"/>
      <g fill="none" stroke="#9e9e9e" stroke-width="5" stroke-linecap="round"><circle cx="110" cy="40" r="18" fill="#fff"/><path d="M110 58 V150 M80 76 H140 M110 150 L88 222 M110 150 L132 222"/></g>
      <path d="${path}" fill="none" stroke="#c62828" stroke-width="4" marker-end="url(#ah)"/>
      <text x="110" y="226" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">Ansicht von vorne, rechter Arm</text></svg>`;
  }
  function topFigure(path, label, note) {
    return `<svg viewBox="0 0 220 220" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg">${ARROW}
      <rect x="1" y="1" width="218" height="218" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="M110 10 l-7 11 h14 z" fill="#555"/><text x="110" y="32" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">vorne</text>
      <ellipse cx="110" cy="118" rx="38" ry="18" fill="#e0e0e0"/><circle cx="110" cy="118" r="12" fill="#bdbdbd"/>
      <path d="${path}" fill="none" stroke="#c62828" stroke-width="4" marker-end="url(#ah)"/>
      <text x="110" y="212" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">${esc(note || 'Draufsicht, rechtes Bein')}</text></svg>`;
  }
  function punch(gyaku) {
    const from = gyaku ? 132 : 88;
    return `<svg viewBox="0 0 220 220" role="img" aria-label="${gyaku ? 'Gyaku-zuki' : 'Oi-zuki'}" xmlns="http://www.w3.org/2000/svg">${ARROW}
      <rect x="1" y="1" width="218" height="218" rx="12" fill="#fafafa" stroke="#ddd"/>
      <path d="M110 10 l-7 11 h14 z" fill="#555"/><text x="110" y="32" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">vorne</text>
      ${foot(86, 92, 0, 0.7, 0.8)}${foot(134, 172, 25, 0.3, 0.8)}
      <path d="M84 128 L136 120" stroke="#9e9e9e" stroke-width="8" stroke-linecap="round"/>
      <path d="M${from} 122 L${gyaku ? 116 : 100} 44" fill="none" stroke="#c62828" stroke-width="4" marker-end="url(#ah)"/>
      <text x="110" y="210" font-size="10" text-anchor="middle" fill="#555" font-family="sans-serif">linker Fuß vorne – Stoß mit ${gyaku ? 'rechter' : 'linker'} Faust</text></svg>`;
  }
  const MOVES = {
    'age-uke': () => frontFigure('M120 110 Q132 70 128 22', 'Age-uke'),
    'gedan-barai': () => frontFigure('M90 80 Q140 120 170 186', 'Gedan-barai'),
    'soto-uke': () => frontFigure('M182 70 Q160 104 118 100', 'Soto-uke'),
    'uchi-uke': () => frontFigure('M100 128 Q140 120 166 72', 'Uchi-uke'),
    'mae-geri': () => topFigure('M122 104 L122 42', 'Mae-geri'),
    'yoko-geri': () => topFigure('M146 118 L204 118', 'Yoko-geri'),
    'mawashi-geri': () => topFigure('M150 138 Q196 110 170 66 Q150 44 118 44', 'Mawashi-geri'),
    'ushiro-geri': () => topFigure('M122 136 L122 196', 'Ushiro-geri'),
    'mikazuki-geri': () => topFigure('M176 92 Q130 30 86 72', 'Mikazuki-geri'),
    'oi-zuki': () => punch(false),
    'gyaku-zuki': () => punch(true),
  };

  /* ---------- Trefferzonen (nach Anhang des JKA-Kata-Buchs) ---------- */
  function targets() {
    const pts = [
      [96, 30, 'Kasumi (Schläfe)', 'l'], [110, 46, 'Jinchu', 'r'], [110, 60, 'Mikazuki (Kinn)', 'l'],
      [110, 104, 'Suigetsu', 'r'], [128, 118, 'Denko', 'r'], [92, 132, 'Inazuma', 'l'],
      [110, 158, 'Myojo', 'r'], [96, 196, 'Daitai', 'l'], [126, 232, 'Hiza', 'r'],
    ];
    const marks = pts
      .map(([x, y, t, side]) => {
        const tx = side === 'r' ? 176 : 44;
        const anchor = side === 'r' ? 'start' : 'end';
        return `<circle cx="${x}" cy="${y}" r="5" fill="${HL}"/><path d="M${x} ${y} L${side === 'r' ? tx - 4 : tx + 4} ${y}" stroke="#999"/><text x="${tx}" y="${y + 4}" font-size="11" text-anchor="${anchor}" font-family="sans-serif" fill="#333">${esc(t)}</text>`;
      })
      .join('');
    return `<svg viewBox="0 0 260 290" role="img" aria-label="Trefferzonen" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="258" height="288" rx="12" fill="#fafafa" stroke="#ddd"/>
      <g fill="${BODY}" stroke="${LINE}" stroke-width="2">
        <ellipse cx="110" cy="42" rx="20" ry="24"/><rect x="80" y="70" width="60" height="100" rx="18"/>
        <rect x="56" y="74" width="18" height="90" rx="9"/><rect x="146" y="74" width="18" height="90" rx="9"/>
        <rect x="84" y="166" width="22" height="110" rx="10"/><rect x="114" y="166" width="22" height="110" rx="10"/>
      </g>${marks}</svg>`;
  }

  function dataUri(svg) {
    const s = svg.includes('xmlns=') ? svg : svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`;
  }

  SK.gfx = { STANCES, stanceSvg, stanceFor, stanceKey, stanceFigure, figure, levels, WEAPONS, MOVES, targets, dataUri };
})();
