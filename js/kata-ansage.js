/* Kata-Ansage: zählt eine Kata auf Japanisch im Rhythmus des Buches (fließend, langsam, Kiai) und zeigt jede Stellung
   auf einer Bodenkarte von oben (Embusen) nach der Fußskizze im Buch.
   Zeitplan, Zählwörter und Karte sind reine Funktionen (auch in der Validierung geprüft), die Ansicht nutzt Sprachausgabe und Wake Lock. */
(function () {
  'use strict';
  const { util } = SK;

  // ---------- Zählwörter ----------
  // Kana für die japanische Stimme, in kurzer Dojo-Aussprache: Wie im gesprochenen Japanisch verschwindet das
  // Schluss-i bzw. -u nach stimmlosen Lauten („Ich“, „Rok“, „Shich“, „Hach“). Das kleine っ lässt die Stimme die Silbe
  // hart abbrechen, statt den Vokal auszusprechen, wie bei geschriebenen Zählrufen (いちっ、にっ …) üblich.
  const KANA = ['', 'いちっ', 'に', 'さん', 'し', 'ご', 'ろくっ', 'しちっ', 'はちっ', 'く'];
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

  // ---------- Ruhige Füße ----------
  // Die Stellungen sind aus den Fußskizzen vermessen und streuen um einige Zentimeter. Ein Fuß, der laut Ablauf stehen
  // bleibt, soll auf der Karte nicht wandern: Bei „Stand bleibt“ übernimmt er Ort und Richtung der vorigen Stellung,
  // bei „Füße bleiben“ den Ort; sonst gilt alles unterhalb der Messstreuung (STILL) als nicht bewegt.
  const STILL = { d: 0.12, deg: 20 };
  const angDiff = (a, b) => Math.abs(((a - b + 540) % 360) - 180);
  const steadyCache = new WeakMap();
  function steadyPoses(a) {
    if (steadyCache.has(a)) return steadyCache.get(a);
    let prev = a.yoi;
    const poses = a.moves.map((m) => {
      const stand = /^(Langsam: )?Stand bleibt/.test(m.h);
      const feet = stand || /^(Langsam: )?Füße bleiben/.test(m.h);
      const f = m.f.map((x, i) => {
        const p = prev.f[i];
        const keepPos = feet || Math.hypot(x[0] - p[0], x[1] - p[1]) < STILL.d;
        const keepDir = keepPos && (stand || angDiff(x[2], p[2]) < STILL.deg);
        return [keepPos ? p[0] : x[0], keepPos ? p[1] : x[1], keepDir ? p[2] : x[2], x[3]];
      });
      prev = Object.assign({}, m, { f });
      return prev;
    });
    steadyCache.set(a, poses);
    return poses;
  }
  SK.ansagePoses = steadyPoses;

  // Liefert alle Ansagen mit Zeitpunkt t (Sekunden ab Start). frame = Name, Rei, Yoi vorab und Naore, Rei am Ende.
  SK.ansageTimeline = function (k, beat, frame) {
    const steps = [];
    let t = 0;
    const a = k.ansage;
    const poses = steadyPoses(a);
    const cmd = (key, extra) => Object.assign({ kind: 'cmd', t }, CMD[key], extra);
    if (frame) {
      steps.push({ kind: 'name', t, kan: '', ro: k.name, kana: a.kana, stance: 'Musubi-dachi', pose: a.rei });
      t += R.name;
      steps.push(cmd('rei', { stance: 'Musubi-dachi', pose: a.rei }));
      t += R.rei;
      steps.push(cmd('yoi', { stance: k.yoi.split(',')[0], note: k.yoi, pose: a.yoi }));
      t += Math.max(R.yoi, beat);
    }
    k.seq.forEach((r) => {
      const n = r[0];
      // gezählt wird wie im Dojo nur bis Ju (10), danach wieder ab Ichi
      steps.push(Object.assign({ kind: 'move', t, n, stance: r[1], tech: r[2], note: r[4] || '', page: r[3], pose: poses[n - 1],
        kiai: k.kiai.includes(n), slow: k.slow.includes(n), cont: k.continuous.some((g) => g.includes(n)) }, count(((n - 1) % 10) + 1)));
      t += n < k.moves ? moveGap(k, n, beat) : R.end * beat;
    });
    if (frame) {
      steps.push(cmd('naore', { stance: k.yoi.split(',')[0], note: k.naore, pose: a.naore }));
      t += R.naore;
      steps.push(cmd('rei', { stance: 'Musubi-dachi', pose: a.end }));
    }
    // vorherige Stellung für Drehung und Fußspuren; vor Bewegung 1 ist das Yoi
    steps.forEach((st, i) => {
      st.prev = i ? steps[i - 1].pose : a.yoi;
      st.say = sayText(st);
    });
    return steps;
  };
  SK.ansageCount = count;
  SK.ansageKata = () => SK.kataOrder.filter((id) => SK.kata[id].ansage);

  // ---------- Bodenkarte (Embusen von oben) ----------
  // Nur die Füße, die sich bewegt haben, bleiben gestrichelt an der alten Stelle – sonst wird die Karte unübersichtlich.
  const U = 250; // Karteneinheiten je halbe Grundlinie
  const P = (x, y) => [Math.round(x * U), Math.round(-y * U)];
  const rad = (d) => ((d - 90) * Math.PI) / 180;
  const pt = (x, y, d, r) => [Math.round(x + Math.cos(rad(d)) * r), Math.round(y + Math.sin(rad(d)) * r)];
  // Spur nur, wenn der Fuß den Platz wechselt oder deutlich auf der Stelle dreht (kleines Ausdrehen der Ferse zählt nicht)
  const moved = (a, b) => a[0] !== b[0] || a[1] !== b[1] || angDiff(a[2], b[2]) >= 45;
  function arrow(x, y, d, cls) {
    const [ax, ay] = pt(x, y, d, 92);
    const [bx, by] = pt(x, y, d, 40);
    const [l1x, l1y] = pt(ax, ay, d + 150, 15);
    const [l2x, l2y] = pt(ax, ay, d - 150, 15);
    return `<path class="${cls}" d="M${bx} ${by} L${ax} ${ay} M${l1x} ${l1y} L${ax} ${ay} L${l2x} ${l2y}"/>`;
  }
  function turnArc(x, y, from, deg) {
    const r = 108;
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
  function bounds(a) {
    const pts = [a.rei, a.yoi, a.naore, a.end].concat(a.moves).flatMap((p) => p.f);
    const xs = pts.map((f) => f[0]).concat(0);
    const ys = pts.map((f) => f[1]).concat(0);
    const m = 0.62;
    return [Math.min(...xs) - m, Math.max(...xs) + m, Math.min(...ys) - 0.42, Math.max(...ys) + 0.55].map((v) => v * U);
  }
  SK.embusenSvg = function (k, pose, prev) {
    const a = k.ansage;
    const [x0, x1, y0, y1] = bounds(a);
    let g = '';
    for (let x = Math.ceil(x0 / 50) * 50; x <= x1; x += 50) g += `M${x} ${-y1} V${-y0}`;
    for (let y = Math.ceil(y0 / 50) * 50; y <= y1; y += 50) g += `M${x0} ${-y} H${x1}`;
    let svg = `<path class="emb-grid" d="${g}"/>`;
    svg += `<path class="emb-line" d="${a.lines.map(([ax, ay, bx, by]) => `M${P(ax, ay).join(' ')} L${P(bx, by).join(' ')}`).join(' ')}"/>`;
    svg += `<text class="emb-txt" x="0" y="${Math.round(-y1 + 30)}" text-anchor="middle">▲ vorne (Shomen)</text>`;
    svg += `<text class="emb-txt" x="0" y="${Math.round(-y0 - 12)}" text-anchor="middle">Start</text>`;
    const side = (i) => (i ? 'R' : 'L');
    if (prev) prev.f.forEach((f, i) => { if (moved(f, pose.f[i])) svg += SK.gfx.foot(...P(f[0], f[1]), f[2], 0, { side: side(i), scale: 1 }); });
    const [cx, cy] = P((pose.f[0][0] + pose.f[1][0]) / 2, (pose.f[0][1] + pose.f[1][1]) / 2);
    if (pose.turn && prev) svg += turnArc(cx, cy, prev.body, pose.turn);
    if (pose.via) {
      const [i, vx, vy, vd] = pose.via;
      const v = P(vx, vy);
      svg += SK.gfx.foot(...v, vd, 0, { side: side(i), scale: 1 }) + viaArrow(P(pose.f[i][0], pose.f[i][1]), v);
    }
    pose.f.forEach((f, i) => { svg += SK.gfx.foot(...P(f[0], f[1]), f[2], f[3], { side: side(i), scale: 1 }); });
    svg += arrow(cx, cy, pose.body, 'emb-body');
    if (pose.look != null) svg += arrow(cx, cy, pose.look, 'emb-look');
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
    const stage = el('section', { class: 'ans-stage', 'aria-live': 'polite' },
      el('div', { class: 'ans-head' }, cKan, el('div', { class: 'ans-head-txt' }, cRo, cPos), chips),
      map, cHint, cTech);
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

    function render(i) {
      const s = steps[i];
      if (!s) return;
      cKan.textContent = s.kan;
      cKan.hidden = !s.kan;
      cRo.textContent = s.ro;
      cPos.textContent = s.kind === 'move' ? `Bewegung ${s.n} von ${k.moves} · ${s.stance}` : `${k.name} · ${s.stance}`;
      chips.innerHTML = '';
      if (s.pose.turn) chips.append(el('span', { class: 'ans-chip turn', text: SK.turnText(s.pose.turn) }));
      if (s.kiai) chips.append(el('span', { class: 'ans-chip kiai', text: 'Kiai' }));
      if (s.slow) chips.append(el('span', { class: 'ans-chip slow', text: 'langsam' }));
      if (s.cont) chips.append(el('span', { class: 'ans-chip cont', text: 'fließend' }));
      stage.classList.toggle('kiai', !!s.kiai);
      map.innerHTML = SK.embusenSvg(k, s.pose, i ? s.prev : null);
      cHint.textContent = s.pose.h;
      cTech.textContent = s.kind === 'move' ? s.tech + (s.note ? ` · ${s.note}` : '') : s.note || '';
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
        el('div', { class: 'ans-legend muted small' }, el('span', { class: 'lg-heavy', text: 'viel Gewicht' }), el('span', { class: 'lg-light', text: 'wenig Gewicht' }), el('span', { class: 'lg-ghost', text: 'Fuß vorher' }), el('span', { class: 'lg-body', text: 'Körper zeigt' }), el('span', { class: 'lg-look', text: 'Blick' }))),
      ...(fsBtn ? [el('div', { class: 'actions' }, fsBtn)] : []),
      el('p', { class: 'muted small' }, 'Mehr zur Kata: ', el('a', { href: `#/wissen/${k.id}-ueberblick`, text: `${k.name} im Kata-Wissen` })),
      el('p', { class: 'src', text: `Ablauf, Kiai, fließende und langsame Bewegungen: ${SK.BOOK_SOURCE}, ab ${SK.bookPages(k.seq[0][3])}. Fußstellungen nach der Embusen-Skizze, ${SK.bookPages(k.ansage.page)}; Drehrichtungen daraus abgeleitet. Das Tempo nennt das Buch nicht – voreingestellt ist das Trainingstempo von 2 s je Bewegung.` })
    );
    buildTrack();
    info();
    tempoInfo();
    render(0);
    ui();
  };
})();
