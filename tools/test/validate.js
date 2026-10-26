/* Prüft Datenkonsistenz aller Fragen und Kata-Daten. Ergebnis wird als Text ausgegeben. */
(function () {
  'use strict';
  const errors = [];
  const out = [];
  const kataUnits = SK.buildKataContent();
  const units = SK.generalUnits.concat(kataUnits, [SK.buildGlossaryContent()]);
  const lessons = new Map();
  units.forEach((u) => u.lessons.forEach((l) => lessons.set(l.id, u)));

  for (const id of SK.kataOrder) {
    const k = SK.kata[id];
    if (k.seq.length !== k.moves) errors.push(`${id}: seq ${k.seq.length} != moves ${k.moves}`);
    k.seq.forEach((r, i) => { if (r[0] !== i + 1) errors.push(`${id}: Nummer ${r[0]} an Position ${i + 1}`); });
    k.kiai.forEach((n) => { if (n < 1 || n > k.moves) errors.push(`${id}: Kiai ${n} ausserhalb`); });
    [...k.continuous.flat(), ...k.slow].forEach((n) => { if (n < 1 || n > k.moves) errors.push(`${id}: Bewegung ${n} ausserhalb`); });
    // Aufteilung für die Bewegungskarten: jede Technik muss Teile ergeben, Höhen nur noch im Label
    k.seq.forEach((r) => {
      const mp = SK.moveParts(r[2]);
      if (!mp) {
        if (!/^(Kao |Jotai|Rechte|Linker|Rechter|Migi Ashi-jiku)/.test(r[2])) errors.push(`${id} ${r[0]}: Technik nicht aufgeteilt: ${r[2]}`);
        return;
      }
      const all = mp.l.concat(mp.r, mp.b, mp.f);
      if (!all.length) errors.push(`${id} ${r[0]}: keine Hand/kein Bein erkannt: ${r[2]}`);
      all.forEach((p) => {
        if (!p.t || /undefined/.test(p.t)) errors.push(`${id} ${r[0]}: leerer Teil: ${r[2]}`);
        if (/(^| )(Jodan|Chudan|Gedan)( |$)/.test(p.t) && p.t !== { J: 'Jodan', C: 'Chudan', G: 'Gedan' }[p.h]) errors.push(`${id} ${r[0]}: Höhe doppelt im Text „${p.t}“`);
        if (/\b(Hidari|Migi)$/.test(p.t)) errors.push(`${id} ${r[0]}: Seitenangabe ohne Technik „${p.t}“`);
      });
    });
  }

  // Kata-Ansage: Zeitplan mit allen Bewegungen, Zeiten steigend, Zählwörter vorhanden
  SK.ansageKata().forEach((id) => {
    const k = SK.kata[id];
    if (!k.ansage.kana || !k.ansage.de) errors.push(`${id}: Ansage ohne Namen (Kana/Lautschrift)`);
    [true, false].forEach((frame) => {
      const tl = SK.ansageTimeline(k, 2, frame);
      const moves = tl.filter((s) => s.kind === 'move');
      if (moves.length !== k.moves) errors.push(`${id}: Ansage hat ${moves.length} statt ${k.moves} Bewegungen`);
      tl.forEach((s, i) => {
        if (i && !(s.t > tl[i - 1].t)) errors.push(`${id}: Ansage-Zeit ${i} nicht steigend`);
        if (!s.kana || !s.de || !s.ro) errors.push(`${id}: Ansage ${i} ohne Zählwort`);
      });
    });
  });
  for (let n = 1; n <= 65; n++) {
    const c = SK.ansageCount(n);
    if (!c.kana || !c.de || !c.kan || /undefined/.test(Object.values(c).join())) errors.push(`Zählwort ${n} fehlerhaft`);
  }

  const ids = new Set();
  const perUnit = {};
  for (const q of SK.questions) {
    if (ids.has(q.id)) errors.push(`doppelte ID ${q.id}`);
    ids.add(q.id);
    const u = lessons.get(q.lesson);
    if (!u) { errors.push(`${q.id}: Lektion ${q.lesson} fehlt`); continue; }
    perUnit[u.title] = (perUnit[u.title] || 0) + 1;
    if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`${q.id}: zu wenige Optionen`);
    if (new Set(q.options).size !== q.options.length) errors.push(`${q.id}: doppelte Optionen: ${q.options.join(' | ')}`);
    if (q.type === 'mc' && !(q.answer >= 0 && q.answer < q.options.length)) errors.push(`${q.id}: answer ungültig`);
    if (q.type === 'mc' && q.options.length < 3) errors.push(`${q.id}: nur ${q.options.length} Optionen`);
    if (q.type === 'multi' && (!q.answer.length || q.answer.some((i) => i >= q.options.length))) errors.push(`${q.id}: multi answer ungültig`);
    if (q.type === 'order' && q.options.length < 3) errors.push(`${q.id}: order zu kurz`);
    if (u.kind === 'kata' && !/, (S\. [\divx]|Vorwort)/.test(q.src)) errors.push(`${q.id}: Kata-Frage ohne Buchseitenangabe (${q.src})`);
    if (q.g && SK.gradeIndex(q.g) < 0) errors.push(`${q.id}: unbekannter Grad ${q.g}`);
  }

  // Prüfungsprogramm: jede Seite braucht Kihon, Kata und Kumite; Kata-Verweise müssen im Buch existieren
  SK.grades.concat([SK.higherDan]).forEach((g) => {
    if (!g.kihon || !g.kihon.items.length || g.kihon.items.some((l) => !Array.isArray(l) || !l.length || l.some((t) => typeof t !== 'string' || !t))) errors.push(`${g.id}: Kihon unvollständig`);
    if (!g.kataProg || !g.kataProg.items.length) errors.push(`${g.id}: Kata fehlt`);
    if (!g.kumite || !g.kumite.form || !(g.kumite.angriff || g.kumite.text)) errors.push(`${g.id}: Kumite unvollständig`);
    (g.kata || []).forEach((k) => { if (!lessons.has(`${k}-ueberblick`)) errors.push(`${g.id}: Kata ${k} nicht im Kata-Wissen`); });
    ((g.kihon && g.kihon.ref) || []).forEach((id) => { if (SK.gradeIndex(id) < 0) errors.push(`${g.id}: Verweis auf unbekannten Grad ${id}`); });
  });

  SK.idCollisions.forEach((id) => errors.push(`${id}: gleiche Frage mit gleicher Lösung mehrfach in der Lektion`));

  out.push(`Fragen gesamt: ${SK.questions.length}`);
  out.push(`Kata-Fragen: ${SK.questions.filter((q) => lessons.get(q.lesson) && lessons.get(q.lesson).kind === 'kata').length}`);
  out.push(`Typen: ${['mc', 'multi', 'order'].map((t) => `${t}=${SK.questions.filter((q) => q.type === t).length}`).join(', ')}`);
  Object.entries(perUnit).forEach(([k, v]) => out.push(`  ${k}: ${v}`));
  out.push(`Kata-Ansage: ${SK.ansageKata().join(', ')}`);
  out.push(`Prüfungsprogramm: ${SK.grades.map((g) => `${g.id} ${g.kihon.items.length} Kihon`).join(', ')}`);
  out.push('');
  out.push(errors.length ? `FEHLER (${errors.length}):\n${errors.join('\n')}` : 'OK – keine Fehler');
  document.getElementById('out').textContent = out.join('\n');
})();
