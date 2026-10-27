/* Kata-Ansage: zählt eine Kata auf Japanisch im Rhythmus des Buches (fließend, langsam, Kiai) und zeigt jede Stellung
   auf einer Bodenkarte von oben (Embusen) nach der Fußskizze im Buch.
   Zeitplan, Zählwörter und Karte sind reine Funktionen (auch in der Validierung geprüft), die Ansicht nutzt Sprachausgabe und Wake Lock. */
(function () {
  'use strict';
  const { util } = SK;

  // ---------- Zählwörter ----------
  // Kana für eine japanische Stimme, Lautschrift für eine deutsche (falls keine japanische vorhanden ist).
  const KANA = ['', 'いち', 'に', 'さん', 'し', 'ご', 'ろく', 'しち', 'はち', 'く'];
  const RO = ['', 'Ichi', 'Ni', 'San', 'Shi', 'Go', 'Roku', 'Shichi', 'Hachi', 'Ku'];
  const DE = ['', 'itschi', 'ni', 'sann', 'schi', 'go', 'roku', 'schitschi', 'hatschi', 'ku'];
  const KAN = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  function count(n) {
    if (n < 10) return { kana: KANA[n], ro: RO[n], de: DE[n], kan: KAN[n] };
    const t = Math.floor(n / 10);
    const u = n % 10;
    const tens = {
      kana: t === 1 ? 'じゅう' : `${t === 4 ? 'よん' : KANA[t]}じゅう`,
      ro: t === 1 ? 'Ju' : `${t === 4 ? 'Yon' : RO[t]}-ju`,
      de: t === 1 ? 'dschuu' : `${t === 4 ? 'jonn' : DE[t]} dschuu`,
    };
    return {
      kana: tens.kana + KANA[u],
      ro: tens.ro + (u ? `-${RO[u].toLowerCase()}` : ''),
      de: tens.de + (u ? ` ${DE[u]}` : ''),
      kan: `${t > 1 ? KAN[t] : ''}十${KAN[u]}`,
    };
  }
  const CMD = {
    rei: { kan: '礼', ro: 'Rei', kana: 'れい', de: 'reh' },
    yoi: { kan: '用意', ro: 'Yoi', kana: 'ようい', de: 'jooi' },
    naore: { kan: '直れ', ro: 'Naore', kana: 'なおれ', de: 'na ore' },
  };

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
      steps.push({ kind: 'name', t, kan: '', ro: k.name, kana: a.kana, de: a.de, stance: 'Musubi-dachi', pose: a.rei });
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
    steps.forEach((st, i) => { st.prev = i ? steps[i - 1].pose : a.yoi; });
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
    pose.f.forEach((f, i) => { svg += SK.gfx.foot(...P(f[0], f[1]), f[2], f[3], { side: side(i), scale: 1 }); });
    svg += arrow(cx, cy, pose.body, 'emb-body');
    if (pose.look != null) svg += arrow(cx, cy, pose.look, 'emb-look');
    return `<svg class="emb-map" viewBox="${Math.round(x0)} ${Math.round(-y1)} ${Math.round(x1 - x0)} ${Math.round(y1 - y0)}" role="img" aria-label="Fußstellung von oben">${svg}</svg>`;
  };
  // Drehung in Worten: ⅛ bis ¾ links/rechts herum
  SK.turnText = (deg) => `Wendung ${{ 45: '⅛', 90: '¼', 135: '⅜', 180: '½', 225: '⅝', 270: '¾' }[Math.abs(deg)] || `${Math.abs(deg)}°`} ${deg < 0 ? 'links' : 'rechts'} herum`;

  // ---------- Einstellungen (nur dieses Gerät) ----------
  const PREF_KEY = 'shotokan-dojo-ansage';
  const TEMPI = [['lernen', 'Lernen', 3], ['training', 'Training', 2], ['pruefung', 'Prüfung', 1.5]];
  function loadPrefs() {
    const p = { beat: 2, frame: true, voice: 'auto' };
    try {
      Object.assign(p, JSON.parse(localStorage.getItem(PREF_KEY) || '{}'));
    } catch (e) { /* ohne gespeicherte Einstellungen */ }
    p.beat = Math.min(4, Math.max(1, Number(p.beat) || 2));
    return p;
  }
  function savePrefs(p) {
    try {
      localStorage.setItem(PREF_KEY, JSON.stringify(p));
    } catch (e) { /* privates Fenster */ }
  }

  // ---------- Sprachausgabe ----------
  const tts = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  const voices = { ja: null, de: null };
  function pickVoices() {
    if (!tts) return;
    const all = tts.getVoices();
    // lokale Stimmen zuerst: sie sprechen ohne Netz-Verzögerung und halten den Takt
    const best = (re) => all.filter((v) => re.test(v.lang)).sort((a, b) => Number(b.localService) - Number(a.localService))[0] || null;
    voices.ja = best(/^ja/i);
    voices.de = best(/^de/i);
  }
  // Verzögerung zwischen speak() und hörbarem Beginn – wird gemessen und bei den nächsten Ansagen vorgezogen.
  let latency = 0.15;
  const live = new Set(); // Chrome verliert sonst Äußerungen samt onstart durch die Speicherbereinigung
  function speak(word, prefs, rate) {
    if (!tts) return click();
    const ja = prefs.voice !== 'de' && voices.ja;
    const u = new SpeechSynthesisUtterance(ja ? word.kana : word.de);
    u.lang = ja ? 'ja-JP' : 'de-DE';
    const v = ja ? voices.ja : voices.de;
    if (v) u.voice = v;
    u.rate = rate || 1.1;
    const t0 = performance.now();
    u.onstart = () => {
      const l = (performance.now() - t0) / 1000;
      if (l < 1.5) latency = Math.min(0.8, latency * 0.6 + l * 0.4);
    };
    u.onend = u.onerror = () => live.delete(u);
    live.add(u);
    tts.speak(u);
  }
  // Ersatz ohne Sprachausgabe: kurzer Holzton im Takt
  let audio = null;
  function click() {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator();
      const g = audio.createGain();
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.4, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);
      o.connect(g).connect(audio.destination);
      o.start();
      o.stop(audio.currentTime + 0.13);
    } catch (e) { /* kein Ton möglich */ }
  }

  // ---------- Ansicht ----------
  SK.viewAnsage = function (app, k) {
    const { el } = util;
    const prefs = loadPrefs();
    let steps = SK.ansageTimeline(k, prefs.beat, prefs.frame);
    let idx = 0;
    let running = false;
    let base = 0; // performance.now() in ms, zu dem t = 0 gehört
    let timers = [];
    let lock = null;
    let lockState = 'aus';

    pickVoices();
    if (tts) tts.onvoiceschanged = () => { pickVoices(); voiceInfo(); };

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
    const resetBtn = el('button', { class: 'btn', type: 'button', text: 'Von vorn' });
    const fsBtn = document.fullscreenEnabled ? el('button', { class: 'btn', type: 'button', text: 'Vollbild' }) : null;

    // Einstellungen
    const tempoBtns = TEMPI.map(([id, label, beat]) => el('button', { class: 'chip ans-tempo', type: 'button', 'data-beat': beat, text: label }));
    const beatIn = el('input', { type: 'range', id: 'ans-beat', min: '1', max: '4', step: '0.1', value: String(prefs.beat) });
    const beatOut = el('span', { class: 'ans-beat-out' });
    const frameIn = el('input', { type: 'checkbox', id: 'ans-frame' });
    frameIn.checked = prefs.frame;
    const voiceSel = el('select', { id: 'ans-voice' },
      el('option', { value: 'auto', text: 'Japanische Stimme (wenn vorhanden)' }),
      el('option', { value: 'de', text: 'Deutsche Stimme mit Lautschrift' }));
    voiceSel.value = prefs.voice === 'de' ? 'de' : 'auto';
    const voiceOut = el('p', { class: 'muted small' });
    const lockOut = el('p', { class: 'muted small' });
    const testBtn = el('button', { class: 'btn', type: 'button', text: 'Stimme testen: Ichi, Ni, San' });

    function voiceInfo() {
      if (!tts) voiceOut.textContent = 'Dieser Browser hat keine Sprachausgabe – statt der Zahlen ertönt ein Klick im Takt.';
      else if (voiceSel.value === 'de' || !voices.ja) {
        voiceOut.textContent = `${voices.ja || voiceSel.value === 'de' ? '' : 'Keine japanische Stimme auf diesem Gerät. '}Gezählt wird mit ${voices.de ? voices.de.name : 'der deutschen Standardstimme'} in Lautschrift („itschi, ni, sann“). Eine japanische Stimme lässt sich in den Geräteeinstellungen unter Sprachausgabe nachladen.`;
      } else voiceOut.textContent = `Gezählt wird mit ${voices.ja.name} (Japanisch).`;
    }
    function lockInfo() {
      lockOut.textContent = {
        aus: 'Bildschirm: bleibt während der Ansage an (wird beim Start eingeschaltet).',
        an: 'Bildschirm bleibt an ✓',
        nein: 'Dieser Browser kann die Bildschirmsperre nicht verhindern – bitte die automatische Sperre in den Geräteeinstellungen verlängern.',
      }[lockState];
    }
    function tempoInfo() {
      beatOut.textContent = `${prefs.beat.toFixed(1).replace('.', ',')} s pro Bewegung · ganze Kata etwa ${Math.round(steps[steps.length - 1].t)} s`;
      tempoBtns.forEach((b) => b.classList.toggle('placed', Number(b.dataset.beat) === prefs.beat));
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
        timers.push(setTimeout(() => speak(steps[i], prefs), Math.max(0, at - latency * 1000 - now)));
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
      speak(steps[from], prefs);
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
        lockInfo();
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
      lockInfo();
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

    function rebuild() {
      const was = running;
      pause();
      steps = SK.ansageTimeline(k, prefs.beat, prefs.frame);
      idx = 0;
      savePrefs(prefs);
      tempoInfo();
      render(0);
      if (was) wake(false);
      ui();
    }

    playBtn.addEventListener('click', () => {
      if (running) pause();
      else start(idx >= steps.length - 1 ? 0 : idx);
    });
    prevBtn.addEventListener('click', () => jump(idx - 1));
    nextBtn.addEventListener('click', () => jump(idx + 1));
    resetBtn.addEventListener('click', () => { pause(); wake(false); idx = 0; render(0); ui(); });
    track.addEventListener('click', (ev) => {
      const d = ev.target.closest('.ans-dot');
      if (d) jump(steps.findIndex((s) => s.n === Number(d.dataset.n)));
    });
    if (fsBtn) fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else stage.parentNode.requestFullscreen().catch(() => {});
    });
    tempoBtns.forEach((b) => b.addEventListener('click', () => {
      prefs.beat = Number(b.dataset.beat);
      beatIn.value = String(prefs.beat);
      rebuild();
    }));
    beatIn.addEventListener('input', () => { prefs.beat = Number(beatIn.value); rebuild(); });
    frameIn.addEventListener('change', () => { prefs.frame = frameIn.checked; rebuild(); });
    voiceSel.addEventListener('change', () => { prefs.voice = voiceSel.value; savePrefs(prefs); voiceInfo(); });
    testBtn.addEventListener('click', () => {
      if (tts) tts.cancel();
      [1, 2, 3].forEach((n, i) => setTimeout(() => speak(count(n), prefs), i * prefs.beat * 1000));
    });

    app.innerHTML = '';
    app.append(
      el('nav', { class: 'crumbs' }, el('a', { href: '#/ansage', text: 'Üben' }), ' › ', el('span', { text: k.name })),
      el('h1', { text: `${k.name} – Ansage` }),
      el('p', { class: 'muted', text: 'Die App zählt die Kata auf Japanisch im Rhythmus des Buches – wie im Dojo bis Ju und dann wieder ab Ichi. Die Karte zeigt von oben, wo die Füße stehen, wohin der Körper zeigt und wie gedreht wird. Handy hinlegen, Ton an, Start.' }),
      el('div', { class: 'ans-wrap' }, stage,
        el('div', { class: 'ans-controls' }, prevBtn, playBtn, nextBtn),
        track,
        el('div', { class: 'ans-legend muted small' }, el('span', { class: 'lg-kiai', text: 'Kiai' }), el('span', { class: 'lg-slow', text: 'langsam' }), el('span', { class: 'lg-link', text: 'fließend zur nächsten' })),
        el('div', { class: 'ans-legend muted small' }, el('span', { class: 'lg-heavy', text: 'viel Gewicht' }), el('span', { class: 'lg-light', text: 'wenig Gewicht' }), el('span', { class: 'lg-ghost', text: 'Fuß vorher' }), el('span', { class: 'lg-body', text: 'Körper zeigt' }), el('span', { class: 'lg-look', text: 'Blick' }))),
      el('div', { class: 'actions' }, resetBtn, fsBtn),
      el('section', { class: 'card ans-settings' },
        el('h2', { text: 'Einstellungen' }),
        el('div', { class: 'ans-row' }, el('span', { class: 'ans-lbl', text: 'Tempo' }), el('div', { class: 'ans-tempi' }, tempoBtns)),
        el('label', { class: 'ans-row', for: 'ans-beat' }, el('span', { class: 'ans-lbl', text: 'Feinregler' }), beatIn),
        beatOut,
        el('label', { class: 'ans-check' }, frameIn, ' Name, Rei und Yoi vorab, Naore und Rei am Ende ansagen'),
        el('label', { class: 'ans-row', for: 'ans-voice' }, el('span', { class: 'ans-lbl', text: 'Stimme' }), voiceSel),
        voiceOut,
        el('div', { class: 'actions' }, testBtn),
        lockOut),
      el('p', { class: 'muted small' }, 'Mehr zur Kata: ', el('a', { href: `#/wissen/${k.id}-ueberblick`, text: `${k.name} im Kata-Wissen` })),
      el('p', { class: 'src', text: `Ablauf, Kiai, fließende und langsame Bewegungen: ${SK.BOOK_SOURCE}, ab ${SK.bookPages(k.seq[0][3])}. Fußstellungen nach der Embusen-Skizze, ${SK.bookPages(k.ansage.page)}; Drehrichtungen daraus abgeleitet. Das Tempo nennt das Buch nicht – es ist frei einstellbar.` })
    );
    buildTrack();
    voiceInfo();
    lockInfo();
    tempoInfo();
    render(0);
    ui();
  };
})();
