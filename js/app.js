/* Router und Ansichten: Wissen, Lexikon, Quiz-Lernpfad, Zufallsmix, Begriffe-Trainer, Wiederholung, Prüfung, Fortschritt, Datenschutz. */
(function () {
  'use strict';
  const { util, store } = SK;
  const { el } = util;
  const app = document.getElementById('app');
  const PASS_LESSON = 0.8;
  const PASS_EXAM = 0.7;
  const ROUND = 10;

  // ---------- Aufbau ----------
  SK.fillGradeLearn();
  const kataUnits = SK.buildKataContent();
  const drillUnit = SK.buildGlossaryContent();
  const units = SK.generalUnits.concat(kataUnits, [drillUnit]);
  const lessonIndex = {};
  units.forEach((u) => u.lessons.forEach((l, i) => (lessonIndex[l.id] = { unit: u, lesson: l, idx: i })));
  const allLessons = units.flatMap((u) => u.lessons);
  const qByLesson = {};
  SK.questions.forEach((q) => (qByLesson[q.lesson] = qByLesson[q.lesson] || []).push(q));
  const qById = Object.fromEntries(SK.questions.map((q) => [q.id, q]));
  const unitOf = (q) => lessonIndex[q.lesson] && lessonIndex[q.lesson].unit;
  const isKataQ = (q) => unitOf(q) && unitOf(q).kind === 'kata';

  store.load();

  // ---------- Hilfen ----------
  const lessonState = (id) => store.data.lessons[id] || null;
  const passed = (id) => !!(lessonState(id) && lessonState(id).passed);
  function unlocked(unit, idx) {
    if (store.data.settings.unlockAll || idx === 0 || unit.kind === 'drill') return true;
    return passed(unit.lessons[idx - 1].id);
  }
  function unitProgress(u) {
    return { done: u.lessons.filter((l) => passed(l.id)).length, total: u.lessons.length };
  }
  // Höchstens eine Frage je Gruppe (z. B. derselbe Begriff); weitere nur, wenn sonst zu wenige da sind.
  function distinct(list, n) {
    const seen = new Set();
    const first = [];
    const rest = [];
    list.forEach((q) => {
      const g = q.grp || q.id;
      (seen.has(g) ? rest : first).push(q);
      seen.add(g);
    });
    return first.concat(rest).slice(0, n);
  }
  // Neue und fällige Fragen zuerst, bereits sicher beantwortete zuletzt.
  function pickRound(list, n) {
    const t = util.today();
    const scored = list.map((q) => {
      const s = store.data.srs[q.id];
      const w = !s ? 6 : s.due <= t ? 7 - s.b : 5 - s.b;
      return { q, w: w + Math.random() * 2 };
    });
    scored.sort((a, b) => b.w - a.w);
    return util.shuffle(distinct(scored.map((s) => s.q), n));
  }
  function setTitle(t) {
    document.title = t ? `${t} – Shotokan Dojo` : 'Shotokan Dojo – Lernen & Quiz';
  }
  function renderTopStats() {
    const d = store.data;
    const box = document.getElementById('topstats');
    box.innerHTML = '';
    box.append(
      el('span', { class: 'stat streak', title: 'Tage in Folge' }, el('span', { class: 'ico-flame', 'aria-hidden': 'true' }), `${store.currentStreak()} Tage`),
      el('span', { class: 'stat xp', title: 'Erfahrungspunkte' }, '★ ', `${d.xp} XP`)
    );
  }
  function setNav(name) {
    document.querySelectorAll('.bottombar a').forEach((a) => a.classList.toggle('active', a.dataset.nav === name));
  }
  function finishView() {
    app.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    renderTopStats();
  }
  // Gleiche Adresse löst kein hashchange aus – dann direkt neu rendern.
  function go(hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  }
  function award(results, bonus) {
    const ok = results.filter((r) => r.ok).length;
    const xp = ok * 10 + (bonus || 0);
    store.data.xp += xp;
    store.touchStreak();
    store.save();
    return { ok, xp, ratio: ok / results.length };
  }

  // ---------- Start ----------
  function viewStart() {
    setNav('');
    setTitle('');
    app.innerHTML = '';
    const due = SK.srs.due().length;
    const read = allLessons.filter((l) => store.data.read[l.id]).length;
    const asked = Object.keys(store.data.asked).filter((id) => qById[id]).length;
    const tile = (href, title, text, cls) => el('a', { class: `tile ${cls || ''}`, href }, el('h3', { text: title }), el('p', { text }));
    app.append(
      el('section', { class: 'hero' }, el('h1', { text: 'Osu! Bereit fürs Training?' }), el('p', { class: 'muted', text: `${SK.questions.length} Fragen · ${allLessons.length} Lektionen · DJKB 9. Kyu bis 3. Dan` })),
      el(
        'div',
        { class: 'tiles' },
        tile('#/wissen', 'Wissen', `Alle Inhalte zum Durcharbeiten – ${read}/${allLessons.length} gelesen`),
        tile('#/quiz', 'Quiz', 'Lernpfad mit Freischalten, Zufallsmix aus allen Fragen', 'primary'),
        tile('#/begriffe', 'Begriffe-Trainer', 'Stände, Techniken & Begriffe – kurz abgefragt'),
        tile('#/zufall', 'Zufallsmix', `${SK.questions.length - asked} Fragen noch nie gestellt`),
        tile('#/review', 'Wiederholen', due ? `${due} Fragen fällig` : 'Heute nichts fällig'),
        tile('#/exam', 'Prüfung', 'Theorieprüfung 9. Kyu bis 3. Dan simulieren')
      ),
      versionLine()
    );
    finishView();
  }

  function versionLine() {
    return el(
      'p',
      { class: 'version' },
      `Version ${SK.VERSION} · Stand ${SK.VERSION_DATE}, ${SK.VERSION_TIME} Uhr · `,
      el('a', { href: '#/datenschutz', text: 'Datenschutz' })
    );
  }

  // ---------- Wissen ----------
  function viewWissenList() {
    setNav('wissen');
    setTitle('Wissen');
    app.innerHTML = '';
    app.append(
      el('h1', { text: 'Wissen' }),
      el('p', { class: 'muted', text: 'Alle Lerninhalte frei zum Durcharbeiten. Das Quiz findest du getrennt unter „Quiz“.' }),
      el('div', { class: 'actions' }, el('a', { class: 'btn primary', href: '#/lexikon', text: 'Lexikon: alle Stände, Techniken & Begriffe' }))
    );
    const section = (title, list, note) => {
      const wrap = el('section', { class: 'unit-section' }, el('h2', { text: title }), note ? el('p', { class: 'muted small', text: note }) : '');
      list.forEach((u) => {
        const read = u.lessons.filter((l) => store.data.read[l.id]).length;
        wrap.append(
          el(
            'details',
            { class: `unit ${u.kind}` },
            el('summary', { class: 'unit-head' }, el('div', {}, el('h3', { text: u.title }), el('p', { class: 'muted small', text: u.desc })), el('div', { class: 'ring', text: `${read}/${u.lessons.length}` })),
            el(
              'ol',
              { class: 'path' },
              u.lessons.map((l, i) =>
                el(
                  'li',
                  {},
                  el(
                    'a',
                    { class: `node ${store.data.read[l.id] ? 'done' : 'open'}`, href: `#/wissen/${l.id}` },
                    el('span', { class: 'dot', text: store.data.read[l.id] ? '✓' : String(i + 1) }),
                    el('span', { class: 'node-title', text: l.title }),
                    el('span', { class: 'node-meta', text: store.data.read[l.id] ? 'gelesen' : '' })
                  )
                )
              )
            )
          )
        );
      });
      return wrap;
    };
    app.append(
      section('Allgemeines Wissen', SK.generalUnits),
      section('Kata-Wissen', kataUnits, 'Ausschließlich aus „Karate-Do Kata Vol. 1“ (JKA).'),
      section('Begriffe', [drillUnit])
    );
    finishView();
  }

  function viewWissen(id) {
    const entry = lessonIndex[id];
    if (!entry) return viewNotFound();
    setNav('wissen');
    const { unit, lesson } = entry;
    setTitle(lesson.title);
    store.data.read[id] = 1;
    store.save();
    const pos = allLessons.indexOf(lesson);
    const prev = allLessons[pos - 1];
    const next = allLessons[pos + 1];
    const learn = el('div', { class: 'learn' });
    learn.innerHTML = lesson.learn;
    const n = (qByLesson[id] || []).length;
    const open = unlocked(unit, entry.idx);
    app.innerHTML = '';
    app.append(
      el('nav', { class: 'crumbs' }, el('a', { href: '#/wissen', text: 'Wissen' }), ' › ', el('span', { text: unit.title })),
      el('h1', { text: lesson.title }),
      learn,
      el(
        'div',
        { class: 'actions' },
        n && open ? el('a', { class: 'btn primary', href: `#/quiz/${id}`, text: `Quiz zu diesem Thema (${n} Fragen)` }) : '',
        n && !open ? el('span', { class: 'muted small', text: 'Quiz noch gesperrt – im Lernpfad zuerst die vorherige Lektion bestehen.' }) : ''
      ),
      el(
        'nav',
        { class: 'pager' },
        prev ? el('a', { class: 'btn', href: `#/wissen/${prev.id}`, text: `‹ ${prev.title}` }) : el('span'),
        next ? el('a', { class: 'btn', href: `#/wissen/${next.id}`, text: `${next.title} ›` }) : el('span')
      )
    );
    finishView();
  }

  function viewLexikon() {
    setNav('wissen');
    setTitle('Lexikon');
    app.innerHTML = '';
    const search = el('input', { type: 'search', class: 'search', enterkeyhint: 'search', placeholder: 'Suchen, z. B. „Kokutsu“ oder „Ferse“', 'aria-label': 'Lexikon durchsuchen' });
    let cat = '';
    const chips = el(
      'div',
      { class: 'chips' },
      [{ id: '', title: 'Alle' }].concat(SK.glossaryCats).map((c) =>
        el('button', {
          class: `chip ${c.id === cat ? 'placed' : ''}`,
          text: c.title,
          onclick: (e) => {
            cat = c.id;
            chips.querySelectorAll('.chip').forEach((b) => b.classList.toggle('placed', b === e.currentTarget));
            filter();
          },
        })
      )
    );
    const list = el('div');
    list.innerHTML = SK.glossaryHtml(SK.glossary);
    const count = el('p', { class: 'muted small' });
    // Bindestriche, Leerzeichen, Groß-/Kleinschreibung und Umlaute ignorieren: „mae geri“ findet „Mae-geri“.
    const norm = (s) => s.toLowerCase().replace(/ß/g, 'ss').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    list.querySelectorAll('.lex-card').forEach((c) => {
      const n = norm(c.dataset.text);
      c.dataset.words = n;
      c.dataset.compact = n.replace(/ /g, '');
    });
    function filter() {
      const tokens = norm(search.value).split(' ').filter(Boolean);
      let shown = 0;
      list.querySelectorAll('.lex-card').forEach((c) => {
        const hit = !tokens.length || c.dataset.compact.includes(tokens.join('')) || tokens.every((t) => c.dataset.words.includes(t));
        const ok = (!cat || c.dataset.cat === cat) && hit;
        c.hidden = !ok;
        if (ok) shown++;
      });
      count.textContent = shown === 1 ? '1 Eintrag' : `${shown} Einträge`;
    }
    search.addEventListener('input', filter);
    // Handy-Tastaturen melden die Lupe zuverlässig nur als Formular-Submit, nicht als keydown.
    const form = el('form', { role: 'search', action: '#' }, search);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      filter();
      search.blur();
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      count.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    app.append(
      el('nav', { class: 'crumbs' }, el('a', { href: '#/wissen', text: 'Wissen' }), ' › ', el('span', { text: 'Lexikon' })),
      el('h1', { text: 'Lexikon' }),
      form,
      chips,
      count,
      list
    );
    filter();
    finishView();
  }

  // ---------- Quiz ----------
  function viewQuizList() {
    setNav('quiz');
    setTitle('Quiz');
    app.innerHTML = '';
    const due = SK.srs.due().length;
    const asked = Object.keys(store.data.asked).filter((id) => qById[id]).length;
    app.append(
      el('h1', { text: 'Quiz' }),
      el(
        'div',
        { class: 'tiles' },
        el('a', { class: 'tile primary', href: '#/zufall' }, el('h3', { text: 'Zufallsmix' }), el('p', { text: `Zufällig aus dem gesamten Pool – ${SK.questions.length - asked} noch nie gestellt` })),
        el('a', { class: 'tile', href: '#/review' }, el('h3', { text: 'Wiederholen' }), el('p', { text: due ? `${due} Fragen fällig` : 'Heute nichts fällig' })),
        el('a', { class: 'tile', href: '#/begriffe' }, el('h3', { text: 'Begriffe-Trainer' }), el('p', { text: 'Stände, Techniken & Begriffe – kurz abgefragt' }))
      ),
      el('p', { class: 'muted small', text: 'Lernpfad: Jede Lektion mit mind. 80 % bestehen, um die nächste freizuschalten.' })
    );
    const section = (title, list) => {
      const wrap = el('section', { class: 'unit-section' }, el('h2', { text: title }));
      list.forEach((u) => wrap.append(unitCard(u)));
      return wrap;
    };
    app.append(section('Allgemeines Wissen', SK.generalUnits), section('Kata-Wissen', kataUnits));
    finishView();
  }

  function unitCard(u) {
    const p = unitProgress(u);
    const card = el('details', { class: `unit ${u.kind}` });
    const head = el('summary', { class: 'unit-head' }, el('div', {}, el('h3', { text: u.title }), el('p', { class: 'muted small', text: u.desc })), el('div', { class: 'ring', text: `${p.done}/${p.total}` }));
    const bar = el('div', { class: 'progress thin' }, el('div', { class: 'progress-bar' }));
    bar.firstChild.style.width = `${(p.done / p.total) * 100}%`;
    const path = el('ol', { class: 'path' });
    u.lessons.forEach((l, i) => {
      const open = unlocked(u, i);
      const st = lessonState(l.id);
      const n = (qByLesson[l.id] || []).length;
      path.append(
        el(
          'li',
          {},
          el(
            open ? 'a' : 'span',
            { class: `node ${passed(l.id) ? 'done' : open ? 'open' : 'locked'}`, href: open ? `#/quiz/${l.id}` : null, 'aria-disabled': open ? null : 'true' },
            el('span', { class: 'dot', text: passed(l.id) ? '✓' : String(i + 1) }),
            el('span', { class: 'node-title', text: l.title }),
            el('span', { class: 'node-meta', text: st ? `${Math.round(st.best * 100)} %` : `${n} Fragen` })
          ),
          el('a', { class: 'node-learn', href: `#/wissen/${l.id}`, text: 'Wissen', title: 'Lerninhalt öffnen' })
        )
      );
    });
    card.append(head, bar, path);
    return card;
  }

  function viewQuiz(id) {
    const entry = lessonIndex[id];
    if (!entry || !unlocked(entry.unit, entry.idx)) return viewNotFound();
    setNav(entry.unit.kind === 'drill' ? 'begriffe' : 'quiz');
    setTitle(`Quiz: ${entry.lesson.title}`);
    const back = entry.unit.kind === 'drill' ? '#/begriffe' : '#/quiz';
    const pool = qByLesson[id] || [];
    // Begriffe-Trainer: höchstens so viele Fragen wie Begriffe, damit kein Begriff doppelt kommt.
    const n = entry.unit.kind === 'drill' ? Math.min(15, new Set(pool.map((q) => q.grp || q.id)).size) : ROUND;
    const qs = pickRound(pool, n);
    SK.runQuiz(app, qs, {
      mode: 'lesson',
      title: `${entry.unit.title} · ${entry.lesson.title}`,
      onExit: () => go(back),
      onFinish: (results) => {
        const ratio = results.filter((r) => r.ok).length / results.length;
        const prev = lessonState(id) || { best: 0, passed: false, runs: 0 };
        const firstPass = !prev.passed && ratio >= PASS_LESSON;
        store.data.lessons[id] = { best: Math.max(prev.best, ratio), passed: prev.passed || ratio >= PASS_LESSON, runs: prev.runs + 1 };
        const r = award(results, (ratio === 1 ? 20 : 0) + (firstPass ? 30 : 0));
        const next = firstPass && entry.unit.kind !== 'drill' ? entry.unit.lessons[entry.idx + 1] : null;
        showResult({ results, ratio: r.ratio, xp: r.xp, pass: ratio >= PASS_LESSON, again: `#/quiz/${id}`, back, next: next ? { href: `#/quiz/${next.id}`, title: next.title } : null });
      },
    });
    renderTopStats();
  }

  // ---------- Zufallsmix ----------
  function scopes() {
    return [
      { id: 'alle', title: 'Alle Fragen', test: () => true },
      { id: 'allgemein', title: 'Allgemeines Wissen', test: (q) => unitOf(q).kind === 'general' },
      { id: 'kata', title: 'Kata-Wissen (alle Kata)', test: (q) => unitOf(q).kind === 'kata' },
      { id: 'begriffe', title: 'Begriffe-Trainer', test: (q) => unitOf(q).kind === 'drill' },
    ].concat(units.map((u) => ({ id: u.id, title: `Thema: ${u.title}`, test: (q) => unitOf(q) === u })));
  }

  function viewZufall(scopeId) {
    setNav('quiz');
    setTitle('Zufallsmix');
    const all = scopes();
    const scope = all.find((s) => s.id === scopeId) || all[0];
    const pool = SK.questions.filter((q) => unitOf(q) && scope.test(q));
    const fresh = pool.filter((q) => !store.data.asked[q.id]);
    app.innerHTML = '';
    const select = el('select', { class: 'search', 'aria-label': 'Bereich wählen' }, all.map((s) => el('option', { value: s.id, text: s.title })));
    select.value = scope.id;
    select.addEventListener('change', () => (location.hash = `#/zufall/${select.value}`));
    const start = (n) => {
      const qs = distinct(util.shuffle(fresh), n);
      SK.runQuiz(app, qs, {
        mode: 'review',
        title: `Zufallsmix · ${scope.title}`,
        onExit: () => go(`#/zufall/${scope.id}`),
        onFinish: (results) => {
          const r = award(results);
          showResult({ results, ratio: r.ratio, xp: r.xp, pass: r.ratio >= PASS_LESSON, again: `#/zufall/${scope.id}`, back: '#/quiz' });
        },
      });
      renderTopStats();
    };
    const bar = el('div', { class: 'progress' }, el('div', { class: 'progress-bar' }));
    bar.firstChild.style.width = `${pool.length ? ((pool.length - fresh.length) / pool.length) * 100 : 0}%`;
    app.append(
      el('nav', { class: 'crumbs' }, el('a', { href: '#/quiz', text: 'Quiz' }), ' › ', el('span', { text: 'Zufallsmix' })),
      el('h1', { text: 'Zufallsmix' }),
      el('p', { class: 'muted', text: 'Zufällige Fragen aus dem gewählten Bereich – es kommen nur Fragen, die dir noch nie gestellt wurden. Ist alles durch, setzt du den Pool zurück und beginnst von vorne.' }),
      select,
      el('section', { class: 'card' }, el('p', {}, el('b', { text: `${fresh.length}` }), ` von ${pool.length} Fragen noch nicht gestellt`), bar),
      fresh.length
        ? el('div', { class: 'actions' }, [10, 20, 50].filter((n, i) => i === 0 || fresh.length > [10, 20, 50][i - 1]).map((n) => el('button', { class: `btn ${n === 10 ? 'primary' : ''}`, text: `${Math.min(n, fresh.length)} Fragen`, onclick: () => start(n) })))
        : el('p', { text: 'Alle Fragen dieses Bereichs wurden bereits gestellt.' }),
      el(
        'div',
        { class: 'actions' },
        el('button', {
          class: 'btn danger',
          text: 'Pool zurücksetzen',
          disabled: fresh.length === pool.length,
          onclick: () => {
            if (!confirm(`Für „${scope.title}“ wieder alle ${pool.length} Fragen als ungestellt markieren? (Lernfortschritt und Wiederholung bleiben erhalten.)`)) return;
            pool.forEach((q) => delete store.data.asked[q.id]);
            store.save();
            viewZufall(scope.id);
          },
        })
      )
    );
    finishView();
  }

  // ---------- Begriffe-Trainer ----------
  function viewBegriffe() {
    setNav('begriffe');
    setTitle('Begriffe-Trainer');
    app.innerHTML = '';
    const total = drillUnit.lessons.reduce((s, l) => s + (qByLesson[l.id] || []).length, 0);
    app.append(
      el('h1', { text: 'Begriffe-Trainer' }),
      el('p', { class: 'muted', text: `Stände, Techniken & Begriffe – kurz abgefragt. Jeder Begriff kommt in beide Richtungen und, wo es eine Grafik gibt, auch als Bildfrage (${total} Fragen).` }),
      el('div', { class: 'actions' }, el('a', { class: 'btn primary', href: '#/zufall/begriffe', text: 'Alle Begriffe gemischt' }), el('a', { class: 'btn', href: '#/lexikon', text: 'Lexikon ansehen' })),
      el(
        'div',
        { class: 'tiles' },
        drillUnit.lessons.map((l) => {
          const st = lessonState(l.id);
          const n = (qByLesson[l.id] || []).length;
          return el('a', { class: 'tile', href: `#/quiz/${l.id}` }, el('h3', { text: l.title }), el('p', { text: `${n} Fragen${st ? ` · bestes Ergebnis ${Math.round(st.best * 100)} %` : ''}` }));
        })
      )
    );
    finishView();
  }

  function showResult({ results, ratio, xp, pass, again, back, next, extra }) {
    app.innerHTML = '';
    const wrong = results.filter((r) => !r.ok);
    const link = (cls, href, text) =>
      el('a', {
        class: cls,
        href,
        text,
        onclick: (e) => {
          e.preventDefault();
          go(href);
        },
      });
    app.append(
      el(
        'section',
        { class: `result ${pass ? 'pass' : 'fail'}` },
        el('div', { class: 'score', text: `${Math.round(ratio * 100)} %` }),
        el('h2', { text: pass ? 'Bestanden – stark!' : 'Noch nicht bestanden – weiter üben!' }),
        el('p', { text: `${results.length - wrong.length} von ${results.length} richtig · +${xp} XP · Serie: ${store.currentStreak()} Tag(e)` }),
        extra || '',
        el(
          'div',
          { class: 'actions' },
          next ? link('btn primary', next.href, `Nächste Lektion: ${next.title}`) : '',
          link(`btn ${next ? '' : 'primary'}`, again, 'Nochmal'),
          link('btn', back, 'Zurück')
        )
      )
    );
    if (wrong.length) {
      const list = el('ol', { class: 'review-list' });
      wrong.forEach((r) =>
        list.append(
          el(
            'li',
            {},
            el('p', { class: 'q', text: r.q.q }),
            r.q.img ? el('img', { class: 'quiz-img small-img', src: r.q.img, alt: '' }) : '',
            el('p', {}, el('span', { class: 'muted', text: 'Richtig: ' }), SK.quizUtil.correctText(r.q)),
            r.q.explain ? el('p', { class: 'small', text: r.q.explain }) : '',
            el('p', { class: 'src', text: `Quelle: ${r.q.src}` })
          )
        )
      );
      app.append(el('section', { class: 'card' }, el('h3', { text: 'Diese Fragen landen in deiner Wiederholung:' }), list));
    }
    finishView();
  }

  // ---------- Wiederholung ----------
  function viewReview() {
    setNav('quiz');
    setTitle('Wiederholen');
    const due = SK.srs.due();
    app.innerHTML = '';
    const seen = Object.keys(store.data.srs).filter((id) => qById[id]);
    const boxes = [1, 2, 3, 4, 5].map((b) => seen.filter((id) => store.data.srs[id].b === b).length);
    app.append(
      el('nav', { class: 'crumbs' }, el('a', { href: '#/quiz', text: 'Quiz' }), ' › ', el('span', { text: 'Wiederholen' })),
      el('h1', { text: 'Wiederholen' }),
      el('p', { class: 'muted', text: 'Karteikasten-Prinzip: Falsch beantwortete Fragen kommen in Fach 1 und sind sofort wieder fällig. Richtige Antworten wandern ein Fach weiter (1, 2, 4, 8, 16 Tage).' }),
      el('div', { class: 'boxes' }, boxes.map((n, i) => el('div', { class: 'box' }, el('b', { text: String(n) }), el('span', { text: `Fach ${i + 1}` }))))
    );
    const start = (ids, title) =>
      SK.runQuiz(app, ids.map((id) => qById[id]), {
        mode: 'review',
        title,
        onExit: () => go('#/review'),
        onFinish: (results) => {
          const r = award(results);
          showResult({ results, ratio: r.ratio, xp: r.xp, pass: r.ratio >= PASS_LESSON, again: '#/review', back: '#/quiz' });
        },
      });
    const actions = el('div', { class: 'actions' });
    if (due.length) actions.append(el('button', { class: 'btn primary', text: `${Math.min(15, due.length)} fällige Fragen üben`, onclick: () => start(due.slice(0, 15), 'Wiederholung') }));
    else actions.append(el('p', { text: 'Heute ist nichts fällig – gut gemacht!' }));
    if (seen.length >= 5) actions.append(el('button', { class: 'btn', text: 'Gemischtes Training (10 gesehene Fragen)', onclick: () => start(util.shuffle(distinct(util.shuffle(seen), 10)), 'Gemischtes Training') }));
    app.append(actions);
    finishView();
  }

  // ---------- Prüfung ----------
  function examQuestions(g) {
    const gi = SK.gradeIndex(g.id);
    const dan = g.id.endsWith('dan');
    const total = dan ? 30 : 20;
    const program = SK.questions.filter((q) => q.g === g.id);
    const kataSet = new Set(g.kata.map((k) => `kata-${k}`));
    const kata = SK.questions.filter((q) => isKataQ(q) && kataSet.has(unitOf(q).id));
    const general = SK.questions.filter((q) => {
      const u = unitOf(q);
      if (!u || u.kind !== 'general' || q.g === g.id) return false;
      const le = lessonIndex[q.lesson];
      const minG = le.lesson.minGrade ? SK.gradeIndex(le.lesson.minGrade) : 0;
      const qg = q.g ? SK.gradeIndex(q.g) : 0;
      return minG <= gi && qg <= gi;
    });
    const pick = [];
    pick.push(...util.sample(program, dan ? 8 : 6));
    pick.push(...util.sample(kata, g.kata.length ? (dan ? 12 : 6) : 0));
    pick.push(...util.sample(general.filter((q) => !pick.includes(q)), total - pick.length));
    return util.shuffle(pick);
  }

  function viewExamList() {
    setNav('exam');
    setTitle('Prüfungssimulation');
    app.innerHTML = '';
    const list = el('div', { class: 'grade-list' });
    SK.grades.forEach((g) => {
      const best = store.data.exams[g.id];
      list.append(
        el(
          'a',
          { class: 'grade', href: `#/exam/${g.id}` },
          el('span', { class: `belt ${g.cls}` }),
          el('span', { class: 'grade-name', text: g.name }),
          el('span', { class: 'muted small', text: g.belt }),
          el('span', { class: 'grade-best', text: best ? `${Math.round(best.best * 100)} %${best.passed ? ' ✓' : ''}` : '' })
        )
      );
    });
    app.append(
      el('h1', { text: 'Prüfungssimulation' }),
      el('p', { class: 'muted', text: 'Theorieprüfung nach DJKB-Prüfungsordnung: Fragen zum Prüfungsprogramm deines Grades, zur Prüfungs-Kata (aus dem JKA-Buch) und zum allgemeinen Wissen. Kein Feedback während der Prüfung – Bestehensgrenze 70 %.' }),
      list
    );
    finishView();
  }

  function viewExamGrade(id) {
    const g = SK.grades.find((x) => x.id === id);
    if (!g) return viewNotFound();
    setNav('exam');
    setTitle(`Prüfung ${g.name}`);
    app.innerHTML = '';
    const dan = id.endsWith('dan');
    app.append(
      el('nav', { class: 'crumbs' }, el('a', { href: '#/exam', text: 'Prüfungen' }), ' › ', el('span', { text: g.name })),
      el('h1', {}, el('span', { class: `belt big ${g.cls}` }), ` ${g.name}`),
      el(
        'section',
        { class: 'card program' },
        el('h3', { text: 'Prüfungsprogramm (Auszug)' }),
        el('p', {}, el('b', { text: 'Kata: ' }), g.examKata),
        el('p', {}, el('b', { text: 'Kumite: ' }), g.kumite),
        el('p', {}, el('b', { text: 'Theorie: ' }), g.theory),
        el('p', {}, el('b', { text: 'Voraussetzung: ' }), g.wait),
        el('details', {}, el('summary', { text: 'Kihon' }), el('ul', {}, g.kihon.map((k) => el('li', { text: k })))),
        el('p', { class: 'src', text: `Quelle: ${SK.sources.po}; ${SK.sources.vo}` })
      ),
      el('div', { class: 'actions' }, el('button', { class: 'btn primary', text: `Prüfung starten (${dan ? 30 : 20} Fragen)`, onclick: () => runExam(g) }))
    );
    finishView();
  }

  function runExam(g) {
    SK.runQuiz(app, examQuestions(g), {
      mode: 'exam',
      title: `Prüfung ${g.name}`,
      onExit: () => go(`#/exam/${g.id}`),
      onFinish: (results) => {
        const ratio = results.filter((r) => r.ok).length / results.length;
        const prev = store.data.exams[g.id] || { best: 0, passed: false };
        store.data.exams[g.id] = { best: Math.max(prev.best, ratio), passed: prev.passed || ratio >= PASS_EXAM, last: util.today() };
        const r = award(results, ratio >= PASS_EXAM ? 50 : 0);
        const cat = (x) => (x.q.g === g.id ? 'Prüfungsprogramm' : isKataQ(x.q) ? 'Kata' : 'Allgemeines Wissen');
        const cats = {};
        results.forEach((x) => {
          const c = cat(x);
          cats[c] = cats[c] || { ok: 0, n: 0 };
          cats[c].n++;
          if (x.ok) cats[c].ok++;
        });
        const table = el(
          'table',
          { class: 'moves' },
          el('tbody', {}, Object.entries(cats).map(([c, v]) => el('tr', {}, el('td', { text: c }), el('td', { text: `${v.ok}/${v.n}` }), el('td', { text: `${Math.round((v.ok / v.n) * 100)} %` }))))
        );
        showResult({ results, ratio, xp: r.xp, pass: ratio >= PASS_EXAM, again: `#/exam/${g.id}`, back: '#/exam', extra: table });
      },
    });
    renderTopStats();
  }

  // ---------- Fortschritt ----------
  function viewStats() {
    setNav('stats');
    setTitle('Fortschritt');
    const d = store.data;
    app.innerHTML = '';
    const done = allLessons.filter((l) => passed(l.id)).length;
    const read = allLessons.filter((l) => d.read[l.id]).length;
    const asked = Object.keys(d.asked).filter((id) => qById[id]).length;
    const statGrid = el(
      'div',
      { class: 'stat-grid' },
      [
        ['XP', d.xp],
        ['Serie', `${store.currentStreak()} Tage`],
        ['Längste Serie', `${d.bestStreak} Tage`],
        ['Lektionen gelesen', `${read}/${allLessons.length}`],
        ['Quiz-Lektionen bestanden', `${done}/${allLessons.length}`],
        ['Fragen gestellt', `${asked}/${SK.questions.length}`],
        ['Trefferquote', d.answered ? `${Math.round((d.correct / d.answered) * 100)} %` : '–'],
      ].map(([k, v]) => el('div', { class: 'stat-card' }, el('b', { text: String(v) }), el('span', { text: k })))
    );
    const unitList = el('ul', { class: 'unit-progress' });
    units.forEach((u) => {
      const p = unitProgress(u);
      const bar = el('div', { class: 'progress thin' }, el('div', { class: 'progress-bar' }));
      bar.firstChild.style.width = `${(p.done / p.total) * 100}%`;
      unitList.append(el('li', {}, el('span', { text: `${u.title} (${p.done}/${p.total})` }), bar));
    });

    const unlockBox = el('input', { type: 'checkbox', id: 'unlockAll' });
    unlockBox.checked = !!d.settings.unlockAll;
    unlockBox.addEventListener('change', () => {
      d.settings.unlockAll = unlockBox.checked;
      store.save();
    });
    const fileInput = el('input', { type: 'file', accept: 'application/json,.json', class: 'visually-hidden', id: 'importFile' });
    fileInput.addEventListener('change', () => {
      const f = fileInput.files[0];
      if (!f) return;
      if (f.size > 5 * 1024 * 1024) return alert('Datei ist zu groß.');
      f.text().then((t) => {
        try {
          store.importJson(t);
          alert('Fortschritt importiert.');
          viewStats();
        } catch (e) {
          alert(`Import fehlgeschlagen: ${e.message}`);
        }
      });
    });

    app.append(
      el('h1', { text: 'Dein Fortschritt' }),
      statGrid,
      el('section', { class: 'card' }, el('h3', { text: 'Quiz-Themen' }), unitList),
      el(
        'section',
        { class: 'card' },
        el('h3', { text: 'Einstellungen & Sicherung' }),
        el('label', { class: 'switch' }, unlockBox, ' Alle Quiz-Lektionen freischalten (für Fortgeschrittene)'),
        el('p', { class: 'muted small', text: 'Der Fortschritt wird nur lokal in diesem Browser gespeichert. Mit Export/Import kannst du ihn auf ein anderes Gerät übertragen.' }),
        el(
          'div',
          { class: 'actions' },
          el('button', {
            class: 'btn',
            text: 'Exportieren',
            onclick: () => {
              const blob = new Blob([store.exportJson()], { type: 'application/json' });
              const a = el('a', { href: URL.createObjectURL(blob), download: `shotokan-dojo-${util.today()}.json` });
              document.body.append(a);
              a.click();
              setTimeout(() => {
                URL.revokeObjectURL(a.href);
                a.remove();
              }, 0);
            },
          }),
          el('label', { class: 'btn', for: 'importFile', text: 'Importieren' }),
          fileInput,
          el('button', {
            class: 'btn danger',
            text: 'Alles zurücksetzen',
            onclick: () => {
              if (confirm('Gesamten Fortschritt unwiderruflich löschen?')) {
                store.reset();
                viewStats();
              }
            },
          })
        )
      ),
      el(
        'section',
        { class: 'card' },
        el('h3', { text: 'Quellen' }),
        el('ul', {}, Object.values(SK.sources).map((s) => el('li', { text: s }))),
        el('p', { class: 'muted small', text: 'Kata-Fragen sind sinngemäße deutsche Zusammenfassungen aus „Karate-Do Kata Vol. 1“ (JKA Shihan-kai, 2003) mit Angabe der gedruckten Buchseiten. Prüfungsangaben ohne Gewähr – maßgeblich ist die jeweils gültige DJKB-Prüfungsordnung.' })
      ),
      versionLine()
    );
    finishView();
  }

  // ---------- Datenschutz ----------
  function viewDatenschutz() {
    setNav('');
    setTitle('Datenschutz');
    app.innerHTML = '';
    const link = (href, text) => el('a', { href, text, target: '_blank', rel: 'noopener noreferrer' });
    app.append(
      el('h1', { text: 'Datenschutz' }),
      el(
        'section',
        { class: 'card' },
        el('h3', { text: 'Privates Projekt' }),
        el('p', { text: 'Diese Seite ist ein privates, nicht kommerzielles Lernprojekt. Es werden keine Cookies, keine Besucherstatistik und keine Inhalte von fremden Servern verwendet.' })
      ),
      el(
        'section',
        { class: 'card' },
        el('h3', { text: 'Hosting' }),
        el('p', {}, 'Die Seite wird über GitHub Pages (GitHub Inc., USA) bereitgestellt. Beim Aufruf verarbeitet GitHub technisch notwendige Daten wie die IP-Adresse, um die Seite auszuliefern und abzusichern. Details: ', link('https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement', 'Datenschutzerklärung von GitHub'), '.')
      ),
      el(
        'section',
        { class: 'card' },
        el('h3', { text: 'Lernfortschritt' }),
        el('p', { text: 'Dein Fortschritt wird ausschließlich lokal in deinem Browser (localStorage) gespeichert und nicht übertragen. Du kannst ihn jederzeit unter „Profil“ → „Alles zurücksetzen“ löschen.' })
      ),
      versionLine()
    );
    finishView();
  }

  function viewNotFound() {
    app.innerHTML = '';
    app.append(el('h1', { text: 'Seite nicht gefunden' }), el('a', { class: 'btn', href: '#/', text: 'Zur Startseite' }));
    finishView();
  }

  // ---------- Router ----------
  function route() {
    if (SK.quizCleanup) SK.quizCleanup();
    const [view, arg] = (location.hash.replace(/^#\/?/, '') || '').split('/').map(decodeURIComponent);
    if (!view) return viewStart();
    if (view === 'wissen') return arg ? viewWissen(arg) : viewWissenList();
    if (view === 'lesson') return viewWissen(arg);
    if (view === 'lexikon') return viewLexikon();
    if (view === 'quiz') return arg ? viewQuiz(arg) : viewQuizList();
    if (view === 'zufall') return viewZufall(arg);
    if (view === 'begriffe') return viewBegriffe();
    if (view === 'review') return viewReview();
    if (view === 'exam') return arg ? viewExamGrade(arg) : viewExamList();
    if (view === 'stats') return viewStats();
    if (view === 'datenschutz') return viewDatenschutz();
    return viewNotFound();
  }
  window.addEventListener('hashchange', route);
  // Grafik-Knöpfe in Lektionen und Lexikon: Fußbild ↔ Seitenansicht, Standbild ↔ Animation
  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.gfx-box .gfx-btn');
    if (!btn) return;
    const box = btn.closest('.gfx-box');
    const views = box.querySelectorAll(':scope > .gfx-view');
    const on = btn.getAttribute('aria-pressed') !== 'true';
    btn.setAttribute('aria-pressed', String(on));
    if (btn.dataset.act === 'side') {
      views[0].hidden = on;
      views[1].hidden = !on;
      btn.textContent = on ? 'Fußbild' : btn.dataset.label;
    } else {
      const anim = box.querySelector(':scope > .gfx-anim');
      anim.innerHTML = on ? SK.gfx.animSvg(box.dataset.gfx) : '';
      anim.hidden = !on;
      views[0].hidden = on;
      btn.textContent = on ? '■ Standbild' : '▶ Bewegung';
    }
  });
  route();

  SK.debug = { units, lessonIndex, qByLesson, examQuestions };
})();
