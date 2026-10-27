/* Kata-Ansage: zählt eine Kata auf Japanisch im Rhythmus des Buches (fließend, langsam, Kiai) und zeigt jede Stellung
   auf einer Bodenkarte von oben (Embusen) nach der Fußskizze im Buch.
   Zeitplan, Zählwörter und Karte sind reine Funktionen (auch in der Validierung geprüft), die Ansicht nutzt Sprachausgabe und Wake Lock. */
(function () {
  'use strict';
  const { util } = SK;

  // ---------- Zählwörter ----------
  // Kana für die japanische Stimme in normaler Schreibweise. Die kurze Dojo-Aussprache („Ich“, „Shich“, „Hach“) lässt
  // sich über die Schreibweise nicht erzwingen – Dehnungszeichen und kleines っ wurden ausprobiert und verworfen.
  const KANA = ['', 'いち', 'に', 'さん', 'し', 'ご', 'ろく', 'しち', 'はち', 'く'];
  const RO = ['', 'Ichi', 'Ni', 'San', 'Shi', 'Go', 'Roku', 'Shichi', 'Hachi', 'Ku'];
  const KAN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  function count(n) {
    if (n < 10) return { kana: KANA[n], ro: RO[n], kan: KAN[n] };
    const t = Math.floor(n / 10);
    const u = n % 10;
    const tens = {
      kana: t === 1 ? 'じゅう' : `${t === 4 ? 'よん' : KANA[t]}じゅう`,
      ro: t === 1 ? 'Ju' : `${t === 4 ? 'Yon' : RO[t]}-ju`,
    };
    return {
      kana: tens.kana + KANA[u],
      ro: tens.ro + (u ? `-${RO[u].toLowerCase()}` : ''),
      kan: `${t > 1 ? KAN[t] : ''}十${KAN[u]}`,
    };
  }
  const CMD = {
    rei: { kan: '礼', ro: 'Rei', kana: 'れい' },
    yoi: { kan: '用意', ro: 'Yoi', kana: 'ようい' },
    naore: { kan: '直れ', ro: 'Naore', kana: 'なおれ' },
  };
  // Gesprochener Text: Kommandos und Zahlen mit Ausrufezeichen (straffere Betonung), beim Kiai folgt „Kiai!“.
  const KIAI = 'きあい！';
  const sayText = (st) => (st.kind === 'name' || (st.kind === 'cmd' && st.ro === 'Rei') ? st.kana : `${st.kana}！`);

  // ---------- Rhythmus ----------
  // beat = Abstand zwischen zwei normalen Bewegungen (Sekunden). Laut Buch fließend verbundene Bewegungen folgen
  // nach einem halben Schlag, langsame Bewegungen dauern 2,5 Schläge, nach einem Kiai bleibt ein halber Schlag Zanshin.
  const R = { cont: 0.5, slow: 2.5, kiai: 1.5, name: 2.2, rei: 2.6, yoi: 2.4, end: 2, naore: 2.6 };
  SK.ansageRhythm = R;

  function moveGap(k, n, beat) {
    if (k.continuous.some((g) => g.includes(n) && g.includes(n + 1))) return R.cont * beat;
    if (k.slow.includes(n)) return R.slow * beat;
    if (k.kiai.includes(n)) return R.kiai * beat;
    return beat;
  }

  // ---------- Ruhige Füße und saubere Stände ----------
  // Die Stellungen sind aus den Fußskizzen vermessen. Jede Skizze ist für sich gezeichnet: Füße, die stehen bleiben, liegen
  // im nächsten Bild oft eine halbe Fußlänge daneben, und die Schritte sind mal gestaucht, mal gestreckt. Daraus wird eine
  // Karte, wie die Kata gemeint ist:
  // 1. Stehende Füße: Laut Fußarbeit (h) bleibt ein Fuß stehen bei „Stand bleibt“ (auch die Richtung), „Füße bleiben“,
  //    „linker Fuß bleibt“, „linkes Bein trägt“ o. Ä. oder wenn nur der andere Fuß als bewegt genannt ist; ohne Angabe gilt
  //    alles unter der Messstreuung (STILL) als nicht bewegt. Ein stehender Fuß hat über alle diese Stellungen genau einen
  //    Platz – auch wenn er sich auf der Stelle dreht.
  // 2. Ausgleich: Jedes Bild darf als Ganzes etwas verrutscht sein. Die Plätze aller Füße und der Versatz jedes Bildes werden
  //    so bestimmt, dass sie insgesamt am besten zu den Skizzen passen (kleinste Fehlerquadrate). Ein Fuß, der in der Skizze
  //    genau auf einer Embusen-Linie steht, bleibt auf ihr; Rei, Yoi, Naore und das Ende liegen fest am Start.
  // 3. Gleichmäßige Stände werden ausgerichtet: Musubi-, Heisoku-, Hachiji- und Kiba-dachi symmetrisch mit Fersen auf einer Linie
  //    (bei Musubi- und Hachiji-dachi liegt die Mitte der Fersen auf der nahen Embusen-Linie, bei Heisoku- und Kiba-dachi die
  //    Fußmitte), bei Zenkutsu- und Kokutsu-dachi zeigt der vordere Fuß genau in Körperrichtung, bei Kokutsu-dachi der hintere quer.
  const STILL = { d: 0.12, deg: 20 };
  const PIN_MAX = 0.6; // weiter versetzt die Skizze einen Fuß nur, wenn er sich wirklich bewegt
  const SNAP = 0.1; // so nah an einer Embusen-Linie wird der Stand auf sie gesetzt
  const ON_LINE = 0.03; // so nah an einer Linie steht ein Fuß in der Skizze „auf“ ihr
  const KOSA_BACK = 0.1; // so weit steht im Kosa-dachi der gekreuzte Fuß hinter dem tragenden
  const KOSA_TURN = 25; // so weit darf er gegen die Körperrichtung verdreht sein
  const NEAR = 0.2; // so nah an einer Linie steht ein gleichmäßiger Stand (Kiba-dachi …) in der Skizze auf ihr
  const HEEL = 0.068; // Fersenmitte hinter der Fußmitte (Karteneinheiten, Fußabdruck in Kartengröße)
  const angDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  const norm = (d) => ((Math.round(d) % 360) + 360) % 360;
  const toe = (d) => [Math.sin((d * Math.PI) / 180), Math.cos((d * Math.PI) / 180)];
  const r2 = (v) => Math.round(v * 100) / 100;
  const mid = (f) => [(f[0][0] + f[1][0]) / 2, (f[0][1] + f[1][1]) / 2];
  const SIDE = ['linke', 'rechte'];
  const re = (s) => new RegExp(s, 'i');
  const STAY = SIDE.map((s) => re(`${s}r Fuß bleibt|${s}s Bein trägt|${s}s Knie bleibt|Gewicht aufs ${s} Bein|Hüfte über den ${s}n Fuß|${s}r Fuß hebt.*wieder ab`));
  const MOVE = SIDE.map((s) => re(`${s}r Fuß (gleitet|schwingt|tritt|setzt|zieht|rückt|stampft|schließt|kreuzt|geht)|${s}r Fuß zum`));
  const BOTH = /beide Füße gleiten|Yori-ashi|Sprung|Tobikomi/i;
  // Linie, auf der ein Punkt liegt: [Achse (0 = x, 1 = y), Wert] oder nichts
  const lineAt = (x, l, tol) => {
    if (l[1] === l[3] && Math.abs(x[1] - l[1]) < tol && x[0] > Math.min(l[0], l[2]) - SNAP && x[0] < Math.max(l[0], l[2]) + SNAP) return [1, l[1]];
    if (l[0] === l[2] && Math.abs(x[0] - l[0]) < tol && x[1] > Math.min(l[1], l[3]) - SNAP && x[1] < Math.max(l[1], l[3]) + SNAP) return [0, l[0]];
    return null;
  };

  // Welche Füße behalten ihren Platz gegenüber der vorigen Stellung? 'stand' = alles bleibt wie vorher
  function pins(h, prev, f, move) {
    if (/^(Langsam: )?Stand bleibt/.test(h)) return 'stand';
    if (/^(Langsam: )?Füße bleiben/.test(h)) return [true, true];
    const d = f.map((x, i) => Math.hypot(x[0] - prev[i][0], x[1] - prev[i][1]));
    const said = [0, 1].map((i) => !BOTH.test(h) && (STAY[i].test(h) || (MOVE[1 - i].test(h) && !MOVE[i].test(h))));
    return [0, 1].map((i) => (said[i] && d[i] < PIN_MAX && prev[i][3] > 0 && f[i][3] > 0) || (move && d[i] < STILL.d));
  }

  // Punkt auf nahe Embusen-Linien setzen
  function snapToLines(m, lines) {
    lines.forEach((l) => {
      const on = lineAt(m, l, SNAP);
      if (on) m[on[0]] = on[1];
    });
    return m;
  }
  // Gleichmäßige Stände: splay = Öffnung je Fuß, gap = fester Abstand der Bezugspunkte, heel = Bezugspunkt Ferse statt Fußmitte
  const SYM = [
    [/musubi/i, { splay: 30, gap: 0.06, heel: true }],
    [/heisoku/i, { splay: 0, gap: 0.1, either: true }],
    [/hachiji/i, { heel: true }],
    [/kiba/i, { splay: 0, either: true }],
  ];
  // Bezugspunkt eines gleichmäßigen Standes: Ferse (heel) oder Fußmitte; bei parallelen Füßen (either) das, was in der
  // Skizze näher an einer Linie liegt – Tekki zeichnet die Füße mit der Mitte, Heian Sandan und Jion mit den Fersen auf der Linie
  const symFwd = (f) => {
    const [s0, s1] = [toe(f[0][2]), toe(f[1][2])];
    const fwd = (Math.atan2(s0[0] + s1[0], s0[1] + s1[1]) * 180) / Math.PI;
    const near = Math.round(fwd / 45) * 45;
    return angDiff(fwd, near) < 15 ? near : fwd;
  };
  function symHeel(o, f, lines) {
    if (!o.either) return o.heel ? HEEL : 0;
    const c = symFwd(f) % 180 ? 0 : 1; // nur Linien quer zur Zehenrichtung zählen
    const gap = (k) => {
      const m = mid(f.map((x) => [x[0] - k * toe(x[2])[0], x[1] - k * toe(x[2])[1]]));
      return Math.min(1, ...lines.map((l) => (l[c] === l[c + 2] ? Math.abs(m[c] - l[c]) : 1)));
    };
    return gap(HEEL) < gap(0) ? HEEL : 0;
  }
  // f: Füße nach dem Ausgleich, pin: Fuß steht wie in der Stellung davor (dreht höchstens auf der Stelle)
  function shape(f, stance, body, pin, lines, heel) {
    const sym = SYM.find(([rx]) => rx.test(stance));
    if (sym) {
      const o = sym[1];
      const fwd = symFwd(f);
      const splay = o.splay != null ? o.splay : Math.round(angDiff(f[0][2], f[1][2]) / 10) * 5;
      const dir = [norm(fwd - splay), norm(fwd + splay)];
      const k = heel != null ? heel : symHeel(o, f, lines);
      const at = (x, d) => [x[0] - k * toe(d)[0], x[1] - k * toe(d)[1]]; // Bezugspunkt eines Fußes
      const anchor = f.map((x, i) => at(x, pin[i] ? dir[i] : x[2]));
      const right = toe(fwd + 90);
      const gap = o.gap != null ? o.gap : Math.abs((anchor[1][0] - anchor[0][0]) * right[0] + (anchor[1][1] - anchor[0][1]) * right[1]);
      if (!pin[0] && !pin[1]) {
        const m = snapToLines([(anchor[0][0] + anchor[1][0]) / 2, (anchor[0][1] + anchor[1][1]) / 2], lines);
        anchor[0] = [m[0] - (right[0] * gap) / 2, m[1] - (right[1] * gap) / 2];
        anchor[1] = [m[0] + (right[0] * gap) / 2, m[1] + (right[1] * gap) / 2];
      } else if (pin[0] !== pin[1]) {
        // um den stehenden Fuß herum aufbauen; liegt der Stand dann knapp neben einer Linie, rückt er ganz darauf –
        // den stehenden Fuß korrigiert steadyRun dann auch in den Stellungen davor, damit er nicht springt.
        // Ein stehender Fuß, der schon genau auf einer Linie steht, bleibt dort (z. B. Heisoku-dachi neben der Mittellinie).
        const i = pin[0] ? 0 : 1;
        const s = i ? -1 : 1;
        anchor[1 - i] = [anchor[i][0] + s * right[0] * gap, anchor[i][1] + s * right[1] * gap];
        const m = [(anchor[0][0] + anchor[1][0]) / 2, (anchor[0][1] + anchor[1][1]) / 2];
        const [mx, my] = snapToLines(m.slice(), lines);
        // (ganz kleine Versätze, etwa weil die Ferse beim Ausdrehen wandert, bleiben – sonst rückten die Stände davor mit)
        const small = (v) => (Math.abs(v) < 0.015 ? 0 : v);
        if (!lines.some((l) => lineAt(f[i], l, 0.005))) anchor.forEach((p) => { p[0] += small(mx - m[0]); p[1] += small(my - m[1]); });
      }
      return f.map((x, i) => (pin[i] && pin[1 - i] ? [x[0], x[1], dir[i], x[3]] : [r2(anchor[i][0] + k * toe(dir[i])[0]), r2(anchor[i][1] + k * toe(dir[i])[1]), dir[i], x[3]]));
    }
    const zen = /zenkutsu/i.test(stance);
    if (!zen && !/kokutsu/i.test(stance)) return f;
    // vorne: bei Zenkutsu-dachi trägt der vordere Fuß mehr, bei Kokutsu-dachi der hintere
    const front = (f[0][3] > f[1][3]) === zen ? 0 : 1;
    return f.map((x, i) => {
      let d = x[2];
      if (i === front && angDiff(d, body) <= 30) d = body;
      if (i !== front && !zen) {
        const across = angDiff(d, body + 90) < angDiff(d, body - 90) ? body + 90 : body - 90;
        if (angDiff(d, across) <= 30) d = across;
      }
      return [x[0], x[1], norm(d), x[3]];
    });
  }

  // Ausgleich (Punkt 2): Unbekannte sind der Platz jedes Fußes, solange er steht (seg), und der Versatz jedes Bildes (off).
  // Gleichungen: Platz + Versatz ≈ Messung; Versatz ≈ 0 (schwach, bei Rei/Yoi/Naore/Ende stark); Fuß auf einer Linie ≈ Linie.
  // Gelöst wird abwechselnd nach Plätzen und Versätzen (Gauß-Seidel), das konvergiert für diese kleinen Systeme schnell.
  const W_OFF = 0.3;
  const W_FRAME = 20;
  const W_LINE = 4;
  const W_SYM = 1; // gleichmäßiger Stand nahe einer Linie – schwächer als ein Fuß, der in der Skizze auf ihr steht
  function balance(raw, seg, nSeg, frame, lines, extra) {
    const pos = Array.from({ length: nSeg }, () => [0, 0]); // je Platz nur die Achse c genutzt, zu der er gehört
    const off = raw.map(() => [0, 0]);
    const onL = raw.map((p, j) => p.f.map((x, i) => lines.map((l) => lineAt(x, l, ON_LINE)).filter(Boolean).concat(extra[j][i])));
    for (let it = 0; it < 400; it++) {
      const sum = pos.map(() => [0, 0]);
      const cnt = pos.map(() => [0, 0]);
      raw.forEach((p, j) => p.f.forEach((x, i) => {
        for (let c = 0; c < 2; c++) { const s = seg[j][i][c]; sum[s][c] += x[c] - off[j][c]; cnt[s][c] += 1; }
        onL[j][i].forEach(([c, v, w = W_LINE]) => { const s = seg[j][i][c]; sum[s][c] += w * v; cnt[s][c] += w; });
      }));
      pos.forEach((q, s) => { for (let c = 0; c < 2; c++) if (cnt[s][c]) q[c] = sum[s][c] / cnt[s][c]; });
      raw.forEach((p, j) => {
        const w = frame[j] ? W_FRAME : W_OFF;
        for (let c = 0; c < 2; c++) off[j][c] = p.f.reduce((t, x, i) => t + x[c] - pos[seg[j][i][c]][c], 0) / (2 + w);
      });
    }
    return { pos, off };
  }

  const steadyCache = new WeakMap();
  function steadyPoses(k) {
    if (steadyCache.has(k)) return steadyCache.get(k);
    const out = steadyRun(k);
    steadyCache.set(k, out);
    return out;
  }
  function steadyRun(k) {
    const a = k.ansage;
    const yoiStance = k.yoi.split(',')[0];
    const raw = [a.rei, a.yoi].concat(a.moves, [a.naore, a.end]);
    const stances = ['Musubi-dachi', yoiStance].concat(k.seq.map((r) => r[1]), [yoiStance, 'Musubi-dachi']);
    const frame = raw.map((p, j) => j < 2 || j >= raw.length - 2);
    // Punkt 1: wer steht? Daraus die Plätze (seg = Nummer des Platzes je Bild, Fuß und Achse x/y)
    const pin = raw.map((p, j) => (j ? pins(p.h, raw[j - 1].f, p.f, !frame[j]) : [false, false]));
    // Yori-ashi: der Stand gleitet nur in eine Richtung – quer dazu bleiben beide Füße, wo sie waren
    const slide = raw.map((p, j) => {
      if (!j || !/Yori-ashi/.test(p.h) || pin[j] === 'stand') return null;
      const d = [0, 1].map((c) => Math.abs(p.f[0][c] - raw[j - 1].f[0][c]) + Math.abs(p.f[1][c] - raw[j - 1].f[1][c]));
      if (Math.min(...d) > 0.3 * Math.max(...d)) return null; // mit Drehung (z. B. Jion 46): kein reines Gleiten
      return d[0] > d[1] ? 1 : 0; // Achse, die gleich bleibt
    });
    let nSeg = 0;
    const seg = [];
    raw.forEach((p, j) => {
      const keep = pin[j] === 'stand' ? [true, true] : pin[j];
      seg.push([0, 1].map((i) => [0, 1].map((c) => (j && (keep[i] || slide[j] === c) ? seg[j - 1][i][c] : nSeg++))));
    });
    const root = Array.from({ length: nSeg }, (v, i) => i);
    const find = (x) => (root[x] === x ? x : (root[x] = find(root[x])));
    // „Fuß rückt/zieht heran“: er gleitet auf der Linie zum anderen Fuß, quer dazu bleibt er (Heian Yondan 8)
    raw.forEach((p, j) => {
      const hm = j && /(linke|rechte)r Fuß (rückt|zieht) (einen halben Schritt )?heran/i.exec(p.h);
      if (!hm || pin[j] === 'stand') return;
      const i = /^l/i.test(hm[1]) ? 0 : 1;
      const q = raw[j - 1].f;
      const ang = Math.abs((Math.atan2(q[1][1] - q[0][1], q[1][0] - q[0][0]) * 180) / Math.PI) % 90;
      if (pin[j][i] || (ang > 20 && ang < 70)) return;
      const c = Math.abs(q[1][0] - q[0][0]) > Math.abs(q[1][1] - q[0][1]) ? 1 : 0; // Achse quer zur Verbindungslinie
      root[find(seg[j][i][c])] = find(seg[j - 1][i][c]);
    });
    // gleichmäßige Stände schon im Ausgleich: beide Füße gleich weit vorne (bei Kiba-dachi quer zur Linie also gleich hoch),
    // und liegt der Stand nahe an einer Linie (bis NEAR), soll sein Bezugspunkt auf ihr liegen
    const extra = raw.map(() => [[], []]);
    const heelAt = raw.map(() => null); // Bezugspunkt je Bild, aus der Skizze bestimmt
    raw.forEach((p, j) => {
      const sym = SYM.find(([rx]) => rx.test(stances[j]));
      if (!sym) return;
      const fwd = symFwd(p.f);
      if (fwd % 90) return;
      const c = fwd % 180 ? 0 : 1; // Achse, auf der beide Füße gleich weit vorne stehen
      root[find(seg[j][0][c])] = find(seg[j][1][c]);
      const k = symHeel(sym[1], p.f, a.lines);
      heelAt[j] = k;
      const back = p.f.map((x) => k * toe(x[2])[c]);
      const m = (p.f[0][c] - back[0] + p.f[1][c] - back[1]) / 2;
      const line = a.lines.find((l) => l[c] === l[c + 2] && Math.abs(m - l[c]) < NEAR);
      if (line) p.f.forEach((x, i) => extra[j][i].push([c, line[c] + back[i], W_SYM]));
    });
    seg.forEach((sj) => sj.forEach((si) => { si[0] = find(si[0]); si[1] = find(si[1]); }));
    const { pos, off } = balance(raw, seg, nSeg, frame, a.lines, extra);
    // Punkt 3 der Reihe nach, Richtungen: ein stehender Fuß behält seine Richtung, wenn er kaum dreht
    const done = [];
    raw.forEach((m, j) => {
      const prev = done[j - 1];
      const held = pin[j] === 'stand' ? [true, true] : pin[j];
      let f = m.f.map((x, i) => {
        const d = held[i] && (pin[j] === 'stand' || angDiff(x[2], prev.f[i][2]) < STILL.deg) ? prev.f[i][2] : x[2];
        return held[i] ? [prev.f[i][0], prev.f[i][1], d, x[3]] : [r2(pos[seg[j][i][0]][0]), r2(pos[seg[j][i][1]][1]), d, x[3]];
      });
      if (pin[j] !== 'stand') {
        f = shape(f, stances[j], m.body, held, a.lines, heelAt[j]);
        // Kosa-dachi (gekreuzter Fuß dahinter; der Kreuzschritt in Tekki heißt nur „Kosa“): der Ballenfuß steht
        // mindestens KOSA_BACK hinter dem tragenden Fuß
        if (/kosa-dachi/i.test(stances[j])) {
          const r = f[0][3] < f[1][3] ? 0 : 1;
          const u = toe(m.body);
          const ahead = (f[r][0] - f[1 - r][0]) * u[0] + (f[r][1] - f[1 - r][1]) * u[1];
          if (!held[r] && ahead > -KOSA_BACK) f[r] = [r2(f[r][0] - u[0] * (ahead + KOSA_BACK)), r2(f[r][1] - u[1] * (ahead + KOSA_BACK))].concat(f[r].slice(2));
          // und zeigt ungefähr nach vorne: höchstens KOSA_TURN gegen die Körperrichtung verdreht
          const turn = ((f[r][2] - m.body + 540) % 360) - 180;
          if (Math.abs(turn) > KOSA_TURN) f[r] = f[r].slice(0, 2).concat(norm(m.body + Math.sign(turn) * KOSA_TURN), f[r][3]);
        }
        // gleichmäßiger Stand hat einen stehenden Fuß versetzt: auch in den Stellungen davor, damit er nicht springt.
        // In einem gleichmäßigen Stand davor rückt der ganze Stand mit (sonst würde er schief), dann auch der andere Fuß
        // in den Stellungen vor diesem Stand.
        held.forEach((on, i) => {
          if (!on) return;
          const [ox, oy] = prev.f[i];
          const dx = f[i][0] - ox;
          const dy = f[i][1] - oy;
          if (!dx && !dy) return;
          const live = { [i]: [ox, oy] };
          for (let q = done.length - 1; q >= 0; q--) {
            const g = done[q].f;
            Object.keys(live).forEach((t) => { if (g[t][0] !== live[t][0] || g[t][1] !== live[t][1]) delete live[t]; });
            if (!Object.keys(live).length) break;
            if (SYM.some(([rx]) => rx.test(stances[q]))) [0, 1].forEach((t) => { if (!live[t]) live[t] = g[t].slice(0, 2); });
            done[q].f = g.map((x, t) => (live[t] ? [r2(x[0] + dx), r2(x[1] + dy)].concat(x.slice(2)) : x));
          }
        });
      }
      const via = m.via && [m.via[0], r2(m.via[1] - off[j][0]), r2(m.via[2] - off[j][1]), m.via[3]];
      done.push(Object.assign({}, m, { f }, via ? { via } : {}));
    });
    const n = done.length;
    return { rei: done[0], yoi: done[1], moves: done.slice(2, n - 2), naore: done[n - 2], end: done[n - 1] };
  }
  SK.ansagePoses = steadyPoses;

  // Liefert alle Ansagen mit Zeitpunkt t (Sekunden ab Start). frame = Name, Rei, Yoi vorab und Naore, Rei am Ende.
  SK.ansageTimeline = function (k, beat, frame) {
    const steps = [];
    let t = 0;
    const a = k.ansage;
    const poses = steadyPoses(k);
    const cmd = (key, extra) => Object.assign({ kind: 'cmd', t }, CMD[key], extra);
    if (frame) {
      steps.push({ kind: 'name', t, kan: '', ro: k.name, kana: a.kana, stance: 'Musubi-dachi', pose: poses.rei });
      t += R.name;
      steps.push(cmd('rei', { stance: 'Musubi-dachi', pose: poses.rei }));
      t += R.rei;
      steps.push(cmd('yoi', { stance: k.yoi.split(',')[0], note: k.yoi, pose: poses.yoi }));
      t += Math.max(R.yoi, beat);
    }
    k.seq.forEach((r) => {
      const n = r[0];
      // gezählt wird wie im Dojo nur bis Ju (10), danach wieder ab Ichi
      steps.push(Object.assign({ kind: 'move', t, n, stance: r[1], tech: r[2], note: r[4] || '', page: r[3], pose: poses.moves[n - 1],
        kiai: k.kiai.includes(n), slow: k.slow.includes(n), cont: k.continuous.some((g) => g.includes(n)) }, count(((n - 1) % 10) + 1)));
      t += n < k.moves ? moveGap(k, n, beat) : R.end * beat;
    });
    if (frame) {
      steps.push(cmd('naore', { stance: k.yoi.split(',')[0], note: k.naore, pose: poses.naore }));
      t += R.naore;
      steps.push(cmd('rei', { stance: 'Musubi-dachi', pose: poses.end }));
    }
    // vorherige Stellung für Drehung und Fußspuren; vor Bewegung 1 ist das Yoi
    steps.forEach((st, i) => {
      st.prev = i ? steps[i - 1].pose : poses.yoi;
      st.say = sayText(st);
    });
    return steps;
  };
  SK.ansageCount = count;
  SK.ansageKata = () => SK.kataOrder.filter((id) => SK.kata[id].ansage);

  // ---------- Bodenkarte (Embusen von oben) ----------
  // Nur die Füße, die sich bewegt haben, bleiben blass an der alten Stelle – sonst wird die Karte unübersichtlich.
  // Gestrichelt (rot) ist ein angehobener Fuß der aktuellen Stellung.
  const U = 250; // Karteneinheiten je halbe Grundlinie
  const P = (x, y) => [Math.round(x * U), Math.round(-y * U)];
  const rad = (d) => ((d - 90) * Math.PI) / 180;
  const pt = (x, y, d, r) => [Math.round(x + Math.cos(rad(d)) * r), Math.round(y + Math.sin(rad(d)) * r)];
  // Spur nur, wenn der Fuß den Platz wechselt – ein Fuß, der auf der Stelle dreht, steht ja noch da
  const moved = (a, b) => a[0] !== b[0] || a[1] !== b[1];
  // Füße als je drei Kreise (Ferse, Mitte, Zehen) – daran weichen Pfeile und Drehbogen aus
  const CLEAR = 20;
  const footDots = (feet) => feet.flatMap(([x, y, r]) => [-26, -6, 14].map((ly) => [x - ly * Math.sin((r * Math.PI) / 180), y + ly * Math.cos((r * Math.PI) / 180), CLEAR]));
  // Pfeil beginnt hinter den Füßen, die in seiner Richtung liegen, damit er sie nicht übermalt
  function arrowStart(x, y, d, dots) {
    const ux = Math.cos(rad(d));
    const uy = Math.sin(rad(d));
    const hits = dots
      .map(([px, py, c]) => [(px - x) * ux + (py - y) * uy, Math.abs((px - x) * uy - (py - y) * ux), c])
      .filter(([, s, c]) => s < c + 8)
      .sort((a, b) => a[0] - b[0]);
    let r0 = 40;
    hits.forEach(([t, , c]) => { if (t + c > r0 && t - c < r0 + 52) r0 = Math.round(t + c); });
    return r0;
  }
  function arrow(x, y, d, cls, r0) {
    const [ax, ay] = pt(x, y, d, r0 + 52);
    const [bx, by] = pt(x, y, d, r0);
    const [l1x, l1y] = pt(ax, ay, d + 150, 15);
    const [l2x, l2y] = pt(ax, ay, d - 150, 15);
    return `<path class="${cls}" d="M${bx} ${by} L${ax} ${ay} M${l1x} ${l1y} L${ax} ${ay} L${l2x} ${l2y}"/>`;
  }
  const arrowDots = (x, y, d, r0) => Array.from({ length: 7 }, (_, j) => [...pt(x, y, d, r0 + j * 9), 12]);
  // Radius des Drehbogens so wählen, dass er an Füßen und Pfeilen vorbei und innerhalb der Karte bleibt (sonst der mit den wenigsten Treffern)
  function arcRadius(x, y, from, deg, dots, box) {
    let best = 108;
    let least = Infinity;
    [108, 92, 125, 78, 145, 64, 165].some((r) => {
      let n = 0;
      for (let a = 0; a <= Math.abs(deg); a += 5) {
        const [qx, qy] = pt(x, y, from + Math.sign(deg) * a, r);
        n += dots.filter(([px, py, c]) => Math.hypot(px - qx, py - qy) < c + 4).length;
        if (qx < box[0] + 10 || qx > box[1] - 10 || qy < -box[3] + 10 || qy > -box[2] - 10) n += 3;
      }
      if (n < least) [best, least] = [r, n];
      return !n;
    });
    return best;
  }
  function turnArc(x, y, from, deg, r) {
    const to = from + deg;
    const [sx, sy] = pt(x, y, from, r);
    const [ex, ey] = pt(x, y, to, r);
    const back = to + (deg > 0 ? -100 : 100);
    const [h1x, h1y] = pt(ex, ey, back - 35, 14);
    const [h2x, h2y] = pt(ex, ey, back + 35, 14);
    return `<path class="emb-turn" d="M${sx} ${sy} A${r} ${r} 0 ${Math.abs(deg) > 180 ? 1 : 0} ${deg > 0 ? 1 : 0} ${ex} ${ey}"/><path class="emb-turn-head" d="M${h1x} ${h1y} L${ex} ${ey} L${h2x} ${h2y}"/>`;
  }
  // Zwischenstellung (via): Fuß zieht heran und kehrt zurück – Doppelpfeil zwischen beiden Stellen
  function viaArrow(a, b) {
    const d = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const [ox, oy] = pt(a[0], a[1], d - 90, 34); // seitlich versetzt, damit der Körperpfeil ihn nicht verdeckt
    const [sx, sy] = pt(ox, oy, d, 4);
    const [ex, ey] = pt(ox, oy, d, len - 4);
    const head = (x, y, dd) => { const [h1x, h1y] = pt(x, y, dd + 150, 14); const [h2x, h2y] = pt(x, y, dd - 150, 14); return `M${h1x} ${h1y} L${x} ${y} L${h2x} ${h2y}`; };
    return `<path class="emb-via" d="M${sx} ${sy} L${ex} ${ey}"/><path class="emb-turn-head" d="${head(ex, ey, d)} ${head(sx, sy, d + 180)}"/>`;
  }
  // Ausschnitt fest je Kata, damit die Karte beim Zählen nicht springt
  function fit(k) {
    const a = steadyPoses(k);
    const pts = [a.rei, a.yoi, a.naore, a.end].concat(a.moves).flatMap((p) => p.f);
    const xs = pts.map((f) => f[0]).concat(0);
    const ys = pts.map((f) => f[1]).concat(0);
    const m = 0.62;
    return [Math.min(...xs) - m, Math.max(...xs) + m, Math.min(...ys) - 0.42, Math.max(...ys) + 0.55].map((v) => v * U);
  }
  // Alle Kata bekommen gleich große Karten (die größte), damit die Füße überall gleich groß erscheinen
  let size = null;
  function bounds(k) {
    if (!size) {
      const all = SK.ansageKata().map((id) => fit(SK.kata[id]));
      size = [Math.max(...all.map((b) => b[1] - b[0])), Math.max(...all.map((b) => b[3] - b[2]))];
    }
    const [x0, x1, y0, y1] = fit(k);
    const dx = (size[0] - (x1 - x0)) / 2;
    const dy = (size[1] - (y1 - y0)) / 2;
    return [x0 - dx, x1 + dx, y0 - dy, y1 + dy];
  }
  SK.embusenSvg = function (k, pose, prev) {
    const a = k.ansage;
    const [x0, x1, y0, y1] = bounds(k);
    let g = '';
    for (let x = Math.ceil(x0 / 50) * 50; x <= x1; x += 50) g += `M${x} ${-y1} V${-y0}`;
    for (let y = Math.ceil(y0 / 50) * 50; y <= y1; y += 50) g += `M${x0} ${-y} H${x1}`;
    let svg = `<path class="emb-grid" d="${g}"/>`;
    svg += `<path class="emb-line" d="${a.lines.map(([ax, ay, bx, by]) => `M${P(ax, ay).join(' ')} L${P(bx, by).join(' ')}`).join(' ')}"/>`;
    svg += `<text class="emb-txt" x="0" y="${Math.round(-y1 + 30)}" text-anchor="middle">▲ vorne (Shomen)</text>`;
    svg += `<text class="emb-txt" x="0" y="${Math.round(-y0 - 12)}" text-anchor="middle">Start</text>`;
    const side = (i) => (i ? 'R' : 'L');
    if (prev) prev.f.forEach((f, i) => { if (moved(f, pose.f[i])) svg += SK.gfx.foot(...P(f[0], f[1]), f[2], 0, { side: side(i), scale: 1, was: true }); });
    const [cx, cy] = P((pose.f[0][0] + pose.f[1][0]) / 2, (pose.f[0][1] + pose.f[1][1]) / 2);
    const dots = footDots(pose.f.map((f) => [...P(f[0], f[1]), f[2]]).concat(pose.via ? [[...P(pose.via[1], pose.via[2]), pose.via[3]]] : []));
    const bodyR = arrowStart(cx, cy, pose.body, dots);
    const lookR = pose.look != null ? arrowStart(cx, cy, pose.look, dots) : 0;
    if (pose.turn && prev) {
      const busy = dots.concat(arrowDots(cx, cy, pose.body, bodyR), pose.look != null ? arrowDots(cx, cy, pose.look, lookR) : []);
      svg += turnArc(cx, cy, prev.body, pose.turn, arcRadius(cx, cy, prev.body, pose.turn, busy, [x0, x1, y0, y1]));
    }
    if (pose.via) {
      const [i, vx, vy, vd] = pose.via;
      const v = P(vx, vy);
      svg += SK.gfx.foot(...v, vd, 0, { side: side(i), scale: 1, was: true }) + viaArrow(P(pose.f[i][0], pose.f[i][1]), v);
    }
    pose.f.forEach((f, i) => { svg += SK.gfx.foot(...P(f[0], f[1]), f[2], f[3], { side: side(i), scale: 1, lift: '#e53935' }); });
    svg += arrow(cx, cy, pose.body, 'emb-body', bodyR);
    if (pose.look != null) svg += arrow(cx, cy, pose.look, 'emb-look', lookR);
    return `<svg class="emb-map" viewBox="${Math.round(x0)} ${Math.round(-y1)} ${Math.round(x1 - x0)} ${Math.round(y1 - y0)}" role="img" aria-label="Fußstellung von oben">${svg}</svg>`;
  };
  // Drehung in Worten: ⅛ bis ¾ links/rechts herum
  SK.turnText = (deg) => `Wendung ${{ 45: '⅛', 90: '¼', 135: '⅜', 180: '½', 225: '⅝', 270: '¾' }[Math.abs(deg)] || `${Math.abs(deg)}°`} ${deg < 0 ? 'links' : 'rechts'} herum`;

  // ---------- Takt ----------
  // Das Buch nennt kein Tempo. Mitte = Training (2 s je Bewegung); langsamer in ganzen Sekunden bis 6 s (3× langsamer),
  // schneller spiegelbildlich bis ⅔ s (3× schneller). Immer mit Name, Rei und Yoi vorab.
  const BEATS = [6, 5, 4, 3, 2, 4 / 3, 1, 0.8, 2 / 3];
  const TRAINING = 4;
  SK.ansageBeats = BEATS;
  const fmtNum = (x) => String(Math.round(x * 10) / 10).replace('.', ',');
  const tempoName = (beat) => (beat === 2 ? 'Training' : beat > 2 ? `${fmtNum(beat / 2)}× langsamer` : `${fmtNum(2 / beat)}× schneller`);
  const TEMPO_KEY = 'shotokan-dojo-ansage-tempo';
  function loadTempo() {
    try {
      const i = Number(localStorage.getItem(TEMPO_KEY));
      if (localStorage.getItem(TEMPO_KEY) !== null && BEATS[i]) return i;
    } catch (e) { /* ohne Speicher */ }
    return TRAINING;
  }
  function saveTempo(i) {
    try {
      localStorage.setItem(TEMPO_KEY, String(i));
    } catch (e) { /* privates Fenster */ }
  }

  // ---------- Sprachausgabe ----------
  // Nur mit japanischer Stimme; fehlt sie, läuft die Ansage stumm (Anzeige und Karte im Takt).
  const tts = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  let voice = null;
  function pickVoice() {
    if (!tts) return;
    // lokale Stimmen zuerst: sie sprechen ohne Netz-Verzögerung und halten den Takt
    voice = tts.getVoices().filter((v) => /^ja/i.test(v.lang)).sort((a, b) => Number(b.localService) - Number(a.localService))[0] || null;
  }
  // Etwas schneller und höher als normal klingt wacher; der Kiai-Ruf noch höher. Mehr lässt die Sprachausgabe nicht zu.
  const TONE = { rate: 1.15, pitch: 1.15 };
  const TONE_KIAI = { rate: 1.1, pitch: 1.35 };
  // Verzögerung zwischen speak() und hörbarem Beginn – wird gemessen und bei den nächsten Ansagen vorgezogen.
  let latency = 0.15;
  const live = new Set(); // Chrome verliert sonst Äußerungen samt onstart durch die Speicherbereinigung
  function utter(text, tone, fast, measure) {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.voice = voice;
    u.rate = tone.rate * fast;
    u.pitch = tone.pitch;
    const t0 = performance.now();
    if (measure) u.onstart = () => {
      const l = (performance.now() - t0) / 1000;
      if (l < 1.5) latency = Math.min(0.8, latency * 0.6 + l * 0.4);
    };
    u.onend = u.onerror = () => live.delete(u);
    live.add(u);
    tts.speak(u);
  }
  // Im schnellen Tempo spricht die Stimme schneller, damit die Zahl in den Takt passt.
  function speak(st, beat) {
    if (!tts || !voice) return;
    const fast = Math.min(1.7, Math.max(1, Math.sqrt(2 / beat)));
    utter(st.say, TONE, fast, true);
    // Kiai als eigene Äußerung direkt nach der Zahl, damit der Ruf eigene Betonung bekommt
    if (st.kiai) utter(KIAI, TONE_KIAI, fast, false);
  }

  // ---------- Ansicht ----------
  SK.viewAnsage = function (app, k) {
    const { el } = util;
    let tempo = loadTempo();
    let steps = SK.ansageTimeline(k, BEATS[tempo], true);
    let idx = 0;
    let running = false;
    let base = 0; // performance.now() in ms, zu dem t = 0 gehört
    let timers = [];
    let lock = null;
    let lockState = 'aus';

    pickVoice();
    if (tts) tts.onvoiceschanged = () => { pickVoice(); info(); };

    // Anzeige
    const cKan = el('span', { class: 'ans-kan' });
    const cRo = el('span', { class: 'ans-ro' });
    const cPos = el('span', { class: 'ans-pos' });
    const chips = el('div', { class: 'ans-chips' });
    const map = el('div', { class: 'ans-map' });
    const cHint = el('div', { class: 'ans-hint' });
    const cTech = el('div', { class: 'ans-tech muted' });
    const head = el('div', { class: 'ans-head' }, cKan, el('div', { class: 'ans-head-txt' }, cRo, cPos), chips);
    const stage = el('section', { class: 'ans-stage', 'aria-live': 'polite' }, head, map, cHint, cTech);
    const track = el('div', { class: 'ans-track', role: 'group', 'aria-label': 'Bewegungen' });
    const playBtn = el('button', { class: 'btn primary ans-play', type: 'button' });
    const prevBtn = el('button', { class: 'btn', type: 'button', 'aria-label': 'Eine Ansage zurück', text: '◀' });
    const nextBtn = el('button', { class: 'btn', type: 'button', 'aria-label': 'Eine Ansage weiter', text: '▶' });
    const fsBtn = document.fullscreenEnabled ? el('button', { class: 'btn', type: 'button', text: 'Vollbild' }) : null;

    // Tempo-Regler: Änderung gilt sofort, eine laufende Ansage zählt ab der aktuellen Bewegung im neuen Takt weiter
    const tempoIn = el('input', { type: 'range', id: 'ans-tempo', min: '0', max: String(BEATS.length - 1), step: '1', value: String(tempo), 'aria-label': 'Tempo' });
    const tempoOut = el('output', { class: 'ans-tempo-out', for: 'ans-tempo' });
    function tempoInfo() {
      const beat = BEATS[tempo];
      tempoOut.textContent = `${tempoName(beat)} · ${fmtNum(beat)} s je Bewegung · Kata etwa ${Math.round(steps[steps.length - 1].t)} s`;
      tempoIn.setAttribute('aria-valuetext', tempoName(beat));
    }
    tempoIn.addEventListener('input', () => {
      tempo = Number(tempoIn.value);
      saveTempo(tempo);
      steps = SK.ansageTimeline(k, BEATS[tempo], true);
      tempoInfo();
      if (running) start(idx);
    });

    // Hinweis nur, wenn etwas fehlt: japanische Stimme oder Bildschirm-an
    const infoOut = el('p', { class: 'muted small ans-info' });
    function info() {
      const msg = [];
      if (!tts || !voice) msg.push(`Keine japanische Stimme ${tts ? 'auf diesem Gerät' : 'in diesem Browser'} – die Ansage läuft stumm. Eine japanische Stimme lässt sich in den Geräteeinstellungen unter Sprachausgabe nachladen.`);
      if (lockState === 'nein') msg.push('Dieser Browser kann die Bildschirmsperre nicht verhindern – bitte die automatische Sperre in den Geräteeinstellungen verlängern.');
      infoOut.textContent = msg.join(' ');
      infoOut.hidden = !msg.length;
    }

    // Texte einer Ansage (ohne Karte und Fortschritt) – auch zum Ausmessen
    function fill(s) {
      cKan.textContent = s.kan;
      cKan.hidden = !s.kan;
      cRo.textContent = s.ro;
      cPos.textContent = s.kind === 'move' ? `Bewegung ${s.n} von ${k.moves} · ${s.stance}` : `${k.name} · ${s.stance}`;
      chips.innerHTML = '';
      if (s.pose.turn) chips.append(el('span', { class: 'ans-chip turn', text: SK.turnText(s.pose.turn) }));
      if (s.kiai) chips.append(el('span', { class: 'ans-chip kiai', text: 'Kiai' }));
      if (s.slow) chips.append(el('span', { class: 'ans-chip slow', text: 'langsam' }));
      if (s.cont) chips.append(el('span', { class: 'ans-chip cont', text: 'fließend' }));
      cHint.textContent = s.pose.h;
      cTech.textContent = s.kind === 'move' ? s.tech + (s.note ? ` · ${s.note}` : '') : s.note || '';
    }
    // Der Kasten soll beim Zählen nicht wachsen und schrumpfen: Kopf, Fußarbeit und Technik bekommen die Höhe der
    // längsten Ansage dieser Kata (bei der aktuellen Breite, daher neu bei Größenänderung und Vollbild).
    const boxes = [head, cHint, cTech];
    function reserve() {
      if (!stage.isConnected) {
        window.removeEventListener('resize', onResize);
        document.removeEventListener('fullscreenchange', onResize);
        return;
      }
      boxes.forEach((b) => { b.style.minHeight = ''; });
      const max = boxes.map(() => 0);
      steps.forEach((s) => {
        fill(s);
        boxes.forEach((b, j) => { max[j] = Math.max(max[j], b.offsetHeight); });
      });
      boxes.forEach((b, j) => { b.style.minHeight = `${max[j]}px`; });
      render(idx);
    }
    let resizeTimer = 0;
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(reserve, 150);
    }
    window.addEventListener('resize', onResize);
    document.addEventListener('fullscreenchange', onResize);

    function render(i) {
      const s = steps[i];
      if (!s) return;
      fill(s);
      stage.classList.toggle('kiai', !!s.kiai);
      map.innerHTML = SK.embusenSvg(k, s.pose, i ? s.prev : null);
      const firstMove = steps.findIndex((x) => x.kind === 'move');
      const cur = s.kind === 'move' ? s.n : i < firstMove ? 0 : Infinity;
      track.querySelectorAll('.ans-dot').forEach((d) => {
        const n = Number(d.dataset.n);
        d.classList.toggle('cur', n === cur);
        d.classList.toggle('done', n < cur);
      });
    }

    function buildTrack() {
      track.innerHTML = '';
      k.seq.forEach((r) => {
        const n = r[0];
        const cls = ['ans-dot', k.kiai.includes(n) && 'kiai', k.slow.includes(n) && 'slow',
          k.continuous.some((g) => g.includes(n) && g.includes(n + 1)) && 'link'].filter(Boolean).join(' ');
        track.append(el('button', { class: cls, type: 'button', 'data-n': n, 'aria-label': `Bewegung ${n}`, text: String(n) }));
      });
    }

    // Ablauf: jede Ansage wird um die gemessene Verzögerung früher gesprochen, die Anzeige wechselt genau im Takt.
    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }
    function schedule(from) {
      clearTimers();
      const now = performance.now();
      for (let i = from; i < steps.length; i++) {
        const at = base + steps[i].t * 1000;
        timers.push(setTimeout(() => speak(steps[i], BEATS[tempo]), Math.max(0, at - latency * 1000 - now)));
        timers.push(setTimeout(() => { idx = i; render(i); }, Math.max(0, at - now)));
      }
      const end = base + (steps[steps.length - 1].t + 1.5) * 1000;
      timers.push(setTimeout(finish, Math.max(0, end - now)));
    }
    function start(from) {
      idx = from;
      if (tts) {
        tts.cancel();
        tts.resume(); // Chrome bleibt sonst nach einer Unterbrechung gelegentlich stumm
      }
      // erste Ansage sofort im Klick (iOS gibt die Sprachausgabe nur nach einer Berührung frei)
      base = performance.now() - steps[from].t * 1000;
      speak(steps[from], BEATS[tempo]);
      render(from);
      // nach einem Sprung folgt die nächste Ansage mit dem normalen Abstand
      if (from + 1 < steps.length) schedule(from + 1);
      else timers.push(setTimeout(finish, 1500));
      running = true;
      stage.scrollIntoView({ block: 'start', behavior: 'smooth' });
      wake(true);
      ui();
    }
    function pause() {
      clearTimers();
      if (tts) tts.cancel();
      running = false;
      ui();
    }
    function finish() {
      clearTimers();
      running = false;
      idx = steps.length - 1;
      wake(false);
      ui();
    }
    function jump(i) {
      i = Math.max(0, Math.min(steps.length - 1, i));
      if (running) start(i);
      else { idx = i; render(i); }
    }
    function ui() {
      playBtn.textContent = running ? '❚❚ Pause' : idx > 0 && idx < steps.length - 1 ? '▶ Weiter zählen' : '▶ Start';
    }

    async function wake(on) {
      if (!on) {
        if (lock) lock.release().catch(() => {});
        lock = null;
        lockState = 'aus';
        return;
      }
      if (lock) return;
      try {
        lock = await navigator.wakeLock.request('screen');
        lock.addEventListener('release', () => { lock = null; });
        lockState = 'an';
      } catch (e) {
        lockState = 'nein';
      }
      info();
    }
    // Beim Wechsel in eine andere App erlischt der Wake Lock – Ansage anhalten, damit der Takt nicht davonläuft.
    function onVisibility() {
      if (document.hidden && running) pause();
    }
    document.addEventListener('visibilitychange', onVisibility);
    function onKey(ev) {
      if (ev.code !== 'Space' || /INPUT|SELECT|TEXTAREA|BUTTON/.test(ev.target.tagName)) return;
      ev.preventDefault();
      playBtn.click();
    }
    document.addEventListener('keydown', onKey);
    SK.ansageCleanup = () => {
      pause();
      wake(false);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('keydown', onKey);
      if (tts) tts.onvoiceschanged = null;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      SK.ansageCleanup = null;
    };

    playBtn.addEventListener('click', () => {
      if (running) pause();
      else start(idx >= steps.length - 1 ? 0 : idx);
    });
    prevBtn.addEventListener('click', () => jump(idx - 1));
    nextBtn.addEventListener('click', () => jump(idx + 1));
    track.addEventListener('click', (ev) => {
      const d = ev.target.closest('.ans-dot');
      if (d) jump(steps.findIndex((s) => s.n === Number(d.dataset.n)));
    });
    if (fsBtn) fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else stage.parentNode.requestFullscreen().catch(() => {});
    });
    app.innerHTML = '';
    app.append(
      el('nav', { class: 'crumbs' }, el('a', { href: '#/ansage', text: 'Üben' }), ' › ', el('span', { text: k.name })),
      el('h1', { text: `${k.name} – Ansage` }),
      el('p', { class: 'muted', text: 'Die App zählt die Kata auf Japanisch im Rhythmus des Buches – wie im Dojo bis Ju und dann wieder ab Ichi. Die Karte zeigt von oben, wo die Füße stehen, wohin der Körper zeigt und wie gedreht wird. Handy hinlegen, Ton an, Start.' }),
      infoOut,
      el('div', { class: 'ans-wrap' }, stage,
        el('div', { class: 'ans-controls' }, prevBtn, playBtn, nextBtn),
        el('div', { class: 'ans-tempo' },
          el('div', { class: 'ans-tempo-row' }, el('span', { class: 'muted small', text: '3× langsamer' }), tempoIn, el('span', { class: 'muted small', text: '3× schneller' })),
          tempoOut),
        track,
        el('div', { class: 'ans-legend muted small' }, el('span', { class: 'lg-kiai', text: 'Kiai' }), el('span', { class: 'lg-slow', text: 'langsam' }), el('span', { class: 'lg-link', text: 'fließend zur nächsten' })),
        el('div', { class: 'ans-legend muted small' }, el('span', { class: 'lg-heavy', text: 'viel Gewicht' }), el('span', { class: 'lg-light', text: 'wenig Gewicht' }), el('span', { class: 'lg-ghost', text: 'Fuß vorher' }), el('span', { class: 'lg-lift', text: 'Fuß angehoben' }), el('span', { class: 'lg-body', text: 'Körper zeigt' }), el('span', { class: 'lg-look', text: 'Blick' }))),
      ...(fsBtn ? [el('div', { class: 'actions' }, fsBtn)] : []),
      el('p', { class: 'muted small' }, 'Mehr zur Kata: ', el('a', { href: `#/wissen/${k.id}-ueberblick`, text: `${k.name} im Kata-Wissen` })),
      el('p', { class: 'src', text: `Ablauf, Kiai, fließende und langsame Bewegungen: ${SK.BOOK_SOURCE}, ab ${SK.bookPages(k.seq[0][3])}. Fußstellungen nach der Embusen-Skizze, ${SK.bookPages(k.ansage.page)}; Drehrichtungen daraus abgeleitet. Das Tempo nennt das Buch nicht – voreingestellt ist das Trainingstempo von 2 s je Bewegung.` })
    );
    buildTrack();
    info();
    tempoInfo();
    render(0);
    reserve();
    if (document.fonts) document.fonts.ready.then(reserve);
    ui();
  };
})();
