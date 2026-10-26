/* Kata-Ansage: zählt eine Kata auf Japanisch im Rhythmus des Buches (fließend, langsam, Kiai) und zeigt Stand und Technik groß.
   Zeitplan und Zählwörter sind reine Funktionen (auch in der Validierung geprüft), die Ansicht nutzt Sprachausgabe und Wake Lock. */
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

  // Liefert alle Ansagen mit Zeitpunkt t (Sekunden ab Start). frame = Name, Rei, Yoi vorab und Naore, Rei am Ende.
  SK.ansageTimeline = function (k, beat, frame) {
    const steps = [];
    let t = 0;
    const cmd = (key, extra) => Object.assign({ kind: 'cmd', t }, CMD[key], extra);
    if (frame) {
      steps.push({ kind: 'name', t, kan: '', ro: k.name, kana: k.ansage.kana, de: k.ansage.de, stance: 'Musubi-dachi' });
      t += R.name;
      steps.push(cmd('rei', { stance: 'Musubi-dachi', note: 'Verbeugung' }));
      t += R.rei;
      steps.push(cmd('yoi', { stance: k.yoi.split(',')[0], note: k.yoi }));
      t += Math.max(R.yoi, beat);
    }
    k.seq.forEach((r) => {
      const n = r[0];
      steps.push(Object.assign({ kind: 'move', t, n, stance: r[1], tech: r[2], note: r[4] || '', page: r[3],
        kiai: k.kiai.includes(n), slow: k.slow.includes(n), cont: k.continuous.some((g) => g.includes(n)) }, count(n)));
      t += n < k.moves ? moveGap(k, n, beat) : R.end * beat;
    });
    if (frame) {
      steps.push(cmd('naore', { stance: k.yoi.split(',')[0], note: k.naore }));
      t += R.naore;
      steps.push(cmd('rei', { stance: 'Musubi-dachi', note: 'Verbeugung, Ende der Kata' }));
    }
    return steps;
  };
  SK.ansageCount = count;
  SK.ansageKata = () => SK.kataOrder.filter((id) => SK.kata[id].ansage);

  // ---------- Bild zur Technik ----------
  // Nur wenn die ganze Technik einer vorhandenen Grafik entspricht; Grafiken von vorne zeigen den rechten Arm.
  const TECH_GFX = {
    'Uchi-uke': ['mv:uchi-uke', true], 'Soto-uke': ['mv:soto-uke', true], 'Age-uke': ['mv:age-uke', true],
    'Gedan-barai': ['mv:gedan-barai', true], 'Oi-zuki': ['mv:oi-zuki', false], 'Gyaku-zuki': ['mv:gyaku-zuki', false],
    'Morote-uke': ['tc:morote-uke', true], 'Furi-enpi': ['tc:furi-enpi', true], 'Shuto Chudan-uke': ['tc:shuto-uke', true],
  };
  function techGfx(tech) {
    if (/\+/.test(tech)) return null;
    const words = tech.split(' ');
    const name = words.filter((w) => !/^(Hidari|Migi|Sokumen|Jodan|Chudan|Gedan)$/.test(w)).join(' ');
    const hit = TECH_GFX[name];
    if (!hit) return null;
    // ohne Beschriftung („rechter Arm“), da das Bild für links gespiegelt wird
    const svg = SK.gfx.plainSvg(() => SK.gfx.byKey(hit[0])).replace(/<text[\s\S]*?<\/text>/g, '');
    return { svg, mirror: hit[1] && words[0] === 'Hidari' };
  }

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
    const picA = el('div', { class: 'ans-pic' });
    const picB = el('div', { class: 'ans-pic' });
    const cStance = el('div', { class: 'ans-stance' });
    const cTech = el('div', { class: 'ans-tech' });
    const cNote = el('div', { class: 'ans-note muted' });
    const cNext = el('div', { class: 'ans-next muted small' });
    const stage = el('section', { class: 'ans-stage', 'aria-live': 'polite' },
      el('div', { class: 'ans-head' }, cKan, el('div', { class: 'ans-head-txt' }, cRo, cPos), chips),
      el('div', { class: 'ans-pics' }, picA, picB),
      cStance, cTech, cNote, cNext);
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
      cPos.textContent = s.kind === 'move' ? `Bewegung ${s.n} von ${k.moves}` : k.name;
      chips.innerHTML = '';
      if (s.kiai) chips.append(el('span', { class: 'ans-chip kiai', text: 'Kiai' }));
      if (s.slow) chips.append(el('span', { class: 'ans-chip slow', text: 'langsam' }));
      if (s.cont) chips.append(el('span', { class: 'ans-chip cont', text: 'fließend' }));
      stage.classList.toggle('kiai', !!s.kiai);
      const key = SK.gfx.stanceKey(s.stance);
      // groß: Technik-Grafik, sonst der Stand als Figur; daneben das Fußbild
      const tg = s.kind === 'move' ? techGfx(s.tech) : null;
      picA.innerHTML = tg ? tg.svg : key ? SK.gfx.stanceSideSvg(key.key, key.mirrored, { title: s.stance }) : '';
      picA.classList.toggle('mirror', !!(tg && tg.mirror));
      picB.innerHTML = key ? SK.gfx.stanceSvg(key.key, key.mirrored, { title: s.stance }) : '';
      cStance.textContent = s.stance;
      cTech.textContent = s.kind === 'move' ? s.tech : s.kind === 'name' ? k.name : s.ro;
      cNote.textContent = s.note || '';
      const nx = steps.slice(i + 1).find((x) => x.kind === 'move');
      cNext.textContent = nx ? `Als Nächstes: ${nx.n} · ${nx.stance} – ${nx.tech}` : '';
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
      el('nav', { class: 'crumbs' }, el('a', { href: '#/wissen', text: 'Wissen' }), ' › ', el('a', { href: `#/wissen/${k.id}-ueberblick`, text: k.name })),
      el('h1', { text: `${k.name} – Ansage` }),
      el('p', { class: 'muted', text: 'Die App zählt die Kata auf Japanisch im Rhythmus des Buches: fließende Bewegungen schnell hintereinander, langsame mit langer Pause. Handy hinlegen, Ton an, Start.' }),
      el('div', { class: 'ans-wrap' }, stage,
        el('div', { class: 'ans-controls' }, prevBtn, playBtn, nextBtn),
        track,
        el('div', { class: 'ans-legend muted small' }, el('span', { class: 'lg-kiai', text: 'Kiai' }), el('span', { class: 'lg-slow', text: 'langsam' }), el('span', { class: 'lg-link', text: 'fließend zur nächsten' }))),
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
      el('p', { class: 'src', text: `Ablauf, Kiai, fließende und langsame Bewegungen: ${SK.BOOK_SOURCE}, ab ${SK.bookPages(k.seq[0][3])}. Das Tempo selbst nennt das Buch nicht – es ist frei einstellbar.` })
    );
    buildTrack();
    voiceInfo();
    lockInfo();
    tempoInfo();
    render(0);
    ui();
  };
})();
