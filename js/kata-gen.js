/* Erzeugt aus den Kata-Daten Lerneinheiten und Detailfragen (Stand, Technik, Abfolge, Kiai …). */
(function () {
  'use strict';
  const { util } = SK;
  const P = (n) => `${SK.PDF_SOURCE}, PDF-Seite ${n}`;
  const CHUNK = 8;

  const GLOBAL_STANCES = [
    'Hidari Zenkutsu-dachi', 'Migi Zenkutsu-dachi', 'Hidari Kokutsu-dachi', 'Migi Kokutsu-dachi', 'Kiba-dachi',
    'Heisoku-dachi', 'Hachiji-dachi', 'Hidari Ashi-dachi', 'Migi Ashi-dachi', 'Migi Ashi-mae Kosa-dachi',
  ];

  const mirror = (s) =>
    s.replace(/\b(Hidari|Migi|Sasho|Usho|Saken|Uken)\b/g, (m) => ({ Hidari: 'Migi', Migi: 'Hidari', Sasho: 'Usho', Usho: 'Sasho', Saken: 'Uken', Uken: 'Saken' })[m]);

  function distractors(correct, pool, n) {
    const out = [];
    const m = mirror(correct);
    if (m !== correct) out.push(m);
    for (const p of util.shuffle(pool)) {
      if (out.length >= n) break;
      if (p !== correct && !out.includes(p)) out.push(p);
    }
    return out.slice(0, n);
  }

  function numberOptions(correct, max, n) {
    const set = new Set([correct]);
    const near = util.shuffle([-2, -1, 1, 2, 3, -3].map((d) => correct + d).filter((v) => v >= 1 && v <= max));
    for (const v of near) {
      if (set.size > n) break;
      set.add(v);
    }
    while (set.size <= n) set.add(1 + Math.floor(Math.random() * max));
    return [...set].map(String);
  }

  const label = (row) => `${row[1]} – ${row[2]}`;

  function moveTable(k, from, to) {
    const rows = k.seq
      .filter((r) => r[0] >= from && r[0] <= to)
      .map(
        (r) =>
          `<tr${k.kiai.includes(r[0]) ? ' class="kiai"' : ''}><td>${r[0]}</td><td class="st-cell">${SK.gfx.stanceFor(r[1], { mini: true })}<span>${util.esc(r[1])}</span></td><td>${util.esc(r[2])}${k.kiai.includes(r[0]) ? ' <span class="badge">Kiai</span>' : ''
          }${r[4] ? `<br><span class="muted small">${util.esc(r[4])}</span>` : ''}</td></tr>`
      )
      .join('');
    return `<table class="moves"><thead><tr><th>#</th><th>Stand</th><th>Technik</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="muted small">Bei mehrteiligen Bewegungen ist die Endstellung angegeben (im Buch jeweils zuletzt aufgeführt); Zwischenschritte stehen grau darunter.</p>
      <p class="src">Quelle: ${util.esc(SK.PDF_SOURCE)}, ab PDF-Seite ${k.seq.find((r) => r[0] === from)[3]}</p>`;
  }

  function buildKata(k) {
    const unit = { id: `kata-${k.id}`, title: k.name, kind: 'kata', desc: `${k.moves} Bewegungen · Kiai bei ${k.kiai.join(' und ')}`, lessons: [] };
    const stances = [...new Set(k.seq.map((r) => r[1]))];
    const stancePool = [...new Set(stances.concat(GLOBAL_STANCES))];
    const techs = [...new Set(k.seq.map((r) => r[2]))];
    const techCount = {};
    k.seq.forEach((r) => (techCount[r[2]] = (techCount[r[2]] || 0) + 1));

    // Überblick
    const ovId = `${k.id}-ueberblick`;
    unit.lessons.push({
      id: ovId,
      title: 'Überblick',
      learn: `${k.learn}<p><b>Yoi:</b> ${util.esc(k.yoi)}</p><p><b>Naore:</b> ${util.esc(k.naore)}</p>`,
    });
    let L = SK.qb(ovId, P(k.firstPage));
    L.mc(`Wie viele Bewegungen hat ${k.name} laut Buch?`, numberOptions(k.moves, k.moves + 10, 3), '', P(k.firstPage));
    const nonKiai = util.shuffle(k.seq.filter((r) => !k.kiai.includes(r[0])).map((r) => r[0])).slice(0, 3);
    L.multi(
      `Bei welchen Bewegungen wird in ${k.name} ein Kiai ausgeführt?`,
      k.kiai.map((n) => `Bewegung ${n}`),
      nonKiai.map((n) => `Bewegung ${n}`),
      k.kiai.map((n) => `${n}: ${k.seq[n - 1][2]}`).join(' · '),
      P(k.seq[k.kiai[0] - 1][3])
    );
    k.kiai.forEach((n, i) => {
      const row = k.seq[n - 1];
      L.mc(
        `${k.name}: Mit welcher Technik ist der ${i === 0 ? 'erste' : 'zweite'} Kiai verbunden (Bewegung ${n})?`,
        [row[2]].concat(distractors(row[2], techs, 3)),
        '',
        P(row[3])
      );
    });
    L.mc(`${k.name}: Wie ist die Yoi-Position (Bereitschaftsstellung)?`, [k.yoi].concat(
      util.shuffle(Object.values(SK.kata).filter((o) => o.yoi !== k.yoi).map((o) => o.yoi)).filter((v, i, a) => a.indexOf(v) === i).slice(0, 3)
    ), '', P(k.firstPage));
    L.mc(`${k.name}: Wie beginnt die Kata (Bewegung 1)?`, [label(k.seq[0])].concat(distractors(label(k.seq[0]), k.seq.slice(1).map(label), 3)), '', P(k.seq[0][3]));
    const last = k.seq[k.seq.length - 1];
    L.mc(`${k.name}: Mit welcher Bewegung endet die Kata (Bewegung ${last[0]})?`, [label(last)].concat(distractors(label(last), k.seq.slice(0, -1).map(label), 3)), '', P(last[3]));
    k.continuous.forEach((grp) => {
      const others = util.shuffle(
        k.seq.map((r) => r[0]).filter((n) => n + grp.length - 1 <= k.moves && !k.continuous.some((g) => g[0] === n))
      ).slice(0, 3);
      const fmt = (a) => Array.from({ length: grp.length }, (_, i) => a + i).join(' + ');
      L.mc(
        `${k.name}: Welche Bewegungen sollen schnell/fließend zusammenhängend ausgeführt werden?`,
        [fmt(grp[0])].concat(others.map(fmt)),
        '',
        P(k.seq[grp[0] - 1][3])
      );
    });
    if (k.slow.length) {
      const fast = util.shuffle(k.seq.map((r) => r[0]).filter((n) => !k.slow.includes(n))).slice(0, 3);
      L.multi(`${k.name}: Welche dieser Bewegungen werden laut Buch langsam ausgeführt?`, k.slow.slice(0, 3).map((n) => `Bewegung ${n}`), fast.map((n) => `Bewegung ${n}`), k.slow.map((n) => `${n}: ${k.seq[n - 1][2]}`).join(' · '), P(k.seq[k.slow[0] - 1][3]));
    }
    k.facts(L);

    // Bewegungsblöcke
    for (let from = 1; from <= k.moves; from += CHUNK) {
      const to = Math.min(k.moves, from + CHUNK - 1);
      const lid = `${k.id}-b${from}`;
      unit.lessons.push({ id: lid, title: `Bewegungen ${from}–${to}`, learn: moveTable(k, from, to) });
      L = SK.qb(lid, P(k.firstPage));
      for (let n = from; n <= to; n++) {
        const row = k.seq[n - 1];
        const note = row[4] ? ` (${row[4]})` : '';
        L.mc(`${k.name}, Bewegung ${n}: In welchem Stand endet die Bewegung?`, [row[1]].concat(distractors(row[1], stancePool, 3)), `Technik: ${row[2]}${note}`, P(row[3]));
        L.mc(`${k.name}, Bewegung ${n}: Welche Technik?`, [row[2]].concat(distractors(row[2], techs, 3)), `Stand: ${row[1]}${note}`, P(row[3]));
        if (n < k.moves) {
          const nxt = k.seq[n];
          L.mc(
            `${k.name}: Was folgt direkt auf Bewegung ${n} (${row[2]})?`,
            [label(nxt)].concat(distractors(label(nxt), k.seq.map(label).filter((x) => x !== label(row)), 3)),
            `Bewegung ${n + 1}`,
            P(nxt[3])
          );
        }
      }
    }

    // Reihenfolge & Nummern
    const ordId = `${k.id}-ablauf`;
    unit.lessons.push({
      id: ordId,
      title: 'Reihenfolge & Nummern',
      learn: `<p>Hier wird der gesamte Ablauf geprüft: Bewegungsfolgen sortieren und Techniken der richtigen Bewegungsnummer zuordnen.</p>${moveTable(k, 1, k.moves)}`,
    });
    L = SK.qb(ordId, P(k.firstPage));
    for (let s = 1; s + 3 <= k.moves; s += 2) {
      const rows = k.seq.slice(s - 1, s + 3);
      const items = rows.map(label);
      if (new Set(items).size !== items.length) continue;
      L.order(`${k.name}: Bringe die Bewegungen ${s}–${s + 3} in die richtige Reihenfolge.`, items, '', P(rows[0][3]));
    }
    k.seq.forEach((row) => {
      if (techCount[row[2]] !== 1) return;
      L.mc(`${k.name}: In welcher Bewegung wird „${row[2]}“ ausgeführt?`, numberOptions(row[0], k.moves, 3), `Stand: ${row[1]}`, P(row[3]));
    });
    return unit;
  }

  function buildCross() {
    const L = SK.qb('kb-vergleich', P(5));
    const list = SK.kataOrder.map((id) => SK.kata[id]);
    list.forEach((k) => {
      const others = util.shuffle(list.filter((o) => o.moves !== k.moves)).slice(0, 3);
      L.mc(`Welche Kata hat laut Buch ${k.moves} Bewegungen?`, [k.name].concat(others.map((o) => o.name)), '', P(k.firstPage));
    });
    L.order('Ordne die Kata nach Anzahl der Bewegungen (wenigste zuerst): Heian Sandan, Heian Shodan, Tekki Shodan, Bassai Dai, Kanku Dai', ['Heian Sandan (20)', 'Heian Shodan (21)', 'Tekki Shodan (29)', 'Bassai Dai (42)', 'Kanku Dai (65)'], '', P(5));
    L.order('Ordne nach Anzahl der Bewegungen (wenigste zuerst): Heian Godan, Heian Nidan, Heian Yondan, Enpi', ['Heian Godan (23)', 'Heian Nidan (26)', 'Heian Yondan (27)', 'Enpi (37)'], '', P(5));
    L.order('Reihenfolge der Kata im Buch (Inhaltsverzeichnis):', ['Heian Shodan', 'Heian Godan', 'Tekki Shodan', 'Bassai Dai', 'Kanku Dai', 'Jion', 'Enpi'], '', P(5));
    L.mc('Welche Kata beginnt mit einem Sprungschritt in Kosa-dachi?', ['Bassai Dai', 'Heian Shodan', 'Kanku Dai', 'Jion'], '', P(79));
    L.mc('Welche Kata beginnt kniend (Orishiki)?', ['Enpi', 'Jion', 'Tekki Shodan', 'Bassai Dai'], '', P(156));
    L.mc('In welcher Kata stehen die Hände zu Beginn vor dem Kinn (Sasho Uken Shita-ago-mae)?', ['Jion', 'Bassai Dai', 'Enpi', 'Kanku Dai'], '', P(132));
    L.mc('In welcher Kata legt man in Bewegung 43 die Hände auf den Boden (Ude-tate)?', ['Kanku Dai', 'Enpi', 'Bassai Dai', 'Heian Godan'], '', P(120));
    L.mc('Welche Kata enthält einen Drehsprung (Kaiten-tobi) mit Kiai?', ['Enpi', 'Jion', 'Tekki Shodan', 'Heian Sandan'], '', P(171));
    L.mc('Welche Kata enthält Yama-zuki?', ['Bassai Dai', 'Heian Yondan', 'Jion', 'Kanku Dai'], '', P(94));
    L.mc('Welche Kata enthält Namigaeshi?', ['Tekki Shodan', 'Heian Nidan', 'Enpi', 'Kanku Dai'], '', P(70));
    L.mc('Welche Kata enthält Nidan-geri?', ['Kanku Dai', 'Heian Godan', 'Bassai Dai', 'Jion'], '', P(128));
    L.mc('Welche Kata enthält die Teisho-Abwehren Oshiage-uke und Oshisage-uke?', ['Enpi', 'Jion', 'Heian Yondan', 'Tekki Shodan'], '', P(168));
    L.mc('Welche Kata enthält drei Teisho Yoko-uke in Kiba-dachi?', ['Jion', 'Enpi', 'Bassai Dai', 'Heian Godan'], '', P(142));
    L.mc('In welcher Heian-Kata wird gesprungen (Tobikomi mit Kiai)?', ['Heian Godan', 'Heian Yondan', 'Heian Sandan', 'Heian Nidan'], '', P(62));
    L.mc('In welcher Heian-Kata kommt Mikazuki-geri vor?', ['Heian Godan', 'Heian Yondan', 'Heian Nidan', 'Heian Shodan'], '', P(60));
    L.mc('In welcher Heian-Kata kommen Furi-enpi mit Fumikomi vor?', ['Heian Sandan', 'Heian Nidan', 'Heian Godan', 'Heian Shodan'], '', P(35));
    L.mc('In welcher Heian-Kata kommt Kentsui Tate-mawashi-uchi vor (Bewegung 4)?', ['Heian Shodan', 'Heian Nidan', 'Heian Yondan', 'Heian Godan'], '', P(7));
    L.mc('Welche Kata wird fast vollständig in Kiba-dachi ausgeführt?', ['Tekki Shodan', 'Jion', 'Heian Sandan', 'Enpi'], '', P(67));
    L.multi('Welche Kata beginnen laut Buch aus Heisoku-dachi (Yoi)?', ['Tekki Shodan', 'Bassai Dai', 'Jion', 'Enpi'], ['Heian Shodan', 'Kanku Dai'], '', P(66));
    L.multi('Welche früheren Namen nennt das Buch?', ['Heian – Pin An', 'Tekki – Naihanchi', 'Kanku – Kushanku', 'Enpi – Wanshu'], ['Jion – Wankan', 'Bassai – Chinto'], '', P(65));
  }

  SK.buildKataContent = function () {
    const units = [];
    SK.kataIntroQuestions();
    buildCross();
    const intro = SK.kataIntroUnit;
    intro.lessons.push({
      id: 'kb-vergleich',
      title: 'Kata im Vergleich',
      learn: `<table class="moves"><thead><tr><th>Kata</th><th>Bewegungen</th><th>Kiai</th></tr></thead><tbody>${SK.kataOrder
        .map((id) => SK.kata[id])
        .map((k) => `<tr><td>${util.esc(k.name)}</td><td>${k.moves}</td><td>${k.kiai.join(', ')}</td></tr>`)
        .join('')}</tbody></table>`,
    });
    units.push(intro);
    SK.kataOrder.forEach((id) => units.push(buildKata(SK.kata[id])));
    return units;
  };
})();
