/* Klickt automatisch durch Lektionen und Prüfungen und protokolliert Fehler. Nur für lokale Tests. */
(function () {
  'use strict';
  const log = [];
  const app = document.getElementById('app');
  const wait = () => new Promise((r) => setTimeout(r, 20));

  async function answerAll(correctly) {
    for (let guard = 0; guard < 100; guard++) {
      const card = app.querySelector('.quiz-card');
      if (!card) return;
      const opts = [...app.querySelectorAll('.option')];
      if (opts.length) {
        opts[0].click();
        if (correctly) {
          opts.forEach((o) => o.classList.contains('selected') && o.click());
          const q = SK.questions.find((x) => x.q === card.querySelector('.quiz-q').textContent);
          const right = q.type === 'mc' ? [q.answer] : q.answer;
          opts.forEach((o) => right.includes(Number(o.dataset.i)) && o.click());
        }
      } else {
        const q = SK.questions.find((x) => x.q === card.querySelector('.quiz-q').textContent);
        for (let i = 0; i < q.options.length; i++) {
          const chip = [...app.querySelectorAll('.order-pool .chip')].find((c) => (correctly ? c.textContent === q.options[i] : true));
          chip.click();
        }
      }
      app.querySelector('.quiz-footer .btn.primary').click();
      const next = app.querySelector('.quiz-footer .btn.primary');
      if (next && app.querySelector('.feedback')) next.click();
    }
  }

  async function run() {
    try {
      for (const g of SK.grades) {
        location.hash = `#/exam/${g.id}`;
        await wait();
        app.querySelector('.actions .btn.primary').click();
        const n = app.querySelector('.quiz-count').textContent;
        await answerAll(true);
        const score = app.querySelector('.result .score');
        log.push(`Prüfung ${g.id}: ${n.split('/')[1]} Fragen, Ergebnis ${score ? score.textContent : 'FEHLT'}`);
      }
      for (const id of ['et-dojo', 'heian-shodan-ueberblick', 'gl-stand', 'gl-waffe']) {
        location.hash = `#/quiz/${id}`;
        await wait();
        await answerAll(true);
        const score = app.querySelector('.result .score');
        log.push(`Lektion ${id}: ${score ? score.textContent : 'FEHLT (gesperrt?)'}`);
      }
      // Letzte Kata-Lektion muss gesperrt sein und mit „alles freischalten“ laufen.
      location.hash = '#/quiz/kanku-dai-ablauf';
      await wait();
      log.push(`Sperre kanku-dai-ablauf: ${app.querySelector('.quiz-card') ? 'FEHLER – nicht gesperrt' : 'gesperrt (erwartet)'}`);
      SK.store.data.settings.unlockAll = true;
      location.hash = '#/quiz/x';
      await wait();
      location.hash = '#/quiz/kanku-dai-ablauf';
      await wait();
      await answerAll(true);
      const unlockedScore = app.querySelector('.result .score');
      log.push(`Lektion kanku-dai-ablauf (freigeschaltet): ${unlockedScore ? unlockedScore.textContent : 'FEHLT'}`);
      SK.store.data.settings.unlockAll = false;
      for (const scope of ['alle', 'kata', 'begriffe']) {
        location.hash = `#/zufall/${scope}`;
        await wait();
        const before = app.querySelector('.card b').textContent;
        app.querySelector('.actions .btn.primary').click();
        await answerAll(true);
        location.hash = `#/zufall/${scope}/x`;
        await wait();
        location.hash = `#/zufall/${scope}`;
        await wait();
        log.push(`Zufall ${scope}: vorher ${before}, nachher ${app.querySelector('.card b').textContent} ungestellt`);
      }
      for (const h of ['#/', '#/wissen', '#/wissen/da-kampf', '#/wissen/heian-godan-b17', '#/lexikon', '#/begriffe', '#/stats']) {
        location.hash = h;
        await wait();
        log.push(`Seite ${h}: ${app.querySelector('h1') ? app.querySelector('h1').textContent : 'FEHLT'}`);
      }
      location.hash = '#/review';
      await wait();
      log.push(`Wiederholung fällig: ${SK.srs.due().length}`);
      const d = SK.store.data;
      log.push(`XP ${d.xp}, Serie ${d.streak}, beantwortet ${d.answered}, richtig ${d.correct}`);
      // Umzug Datenversion 1 → 2: alte laufende Nummern zeigen danach auf dieselbe Frage.
      const old = { version: 1, srs: { 'et-dojo-1': { b: 3, due: '2026-01-01', w: 0 }, 'gl-zenkutsu-dachi-a': { b: 2, due: '2026-01-01', w: 0 } }, asked: { 'et-dojo-2': 1, 'heian-shodan-ueberblick-1': 1 } };
      const m = SK.store.migrate(old);
      const byId = (id) => (SK.questions.find((q) => q.id === id) || {}).q;
      const ok = m.version === 2
        && byId(Object.keys(m.srs)[0]) === 'Was bedeutet „Dojo“?'
        && m.srs['gl-zenkutsu-dachi-a'].b === 2
        && byId(Object.keys(m.asked)[0]) === 'Was bedeutet „Rei“?'
        && Object.keys(m.asked).every((id) => byId(id));
      log.push(`Umzug v1 → v2: ${ok ? 'OK' : `FEHLER ${JSON.stringify(m)}`}`);
      log.push('OK');
    } catch (e) {
      log.push(`FEHLER: ${e.message}\n${e.stack}`);
    }
    document.getElementById('log').textContent = log.join('\n');
    localStorage.removeItem('shotokan-dojo-v1');
  }
  window.confirm = () => true;
  run();
})();
