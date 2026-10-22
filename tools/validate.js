/* Prüft Datenkonsistenz aller Fragen und Kata-Daten. Ergebnis wird als Text ausgegeben. */
(function () {
  'use strict';
  const errors = [];
  const out = [];
  SK.fillGradeLearn();
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

  out.push(`Fragen gesamt: ${SK.questions.length}`);
  out.push(`Kata-Fragen: ${SK.questions.filter((q) => lessons.get(q.lesson) && lessons.get(q.lesson).kind === 'kata').length}`);
  out.push(`Typen: ${['mc', 'multi', 'order'].map((t) => `${t}=${SK.questions.filter((q) => q.type === t).length}`).join(', ')}`);
  Object.entries(perUnit).forEach(([k, v]) => out.push(`  ${k}: ${v}`));
  SK.grades.forEach((g) => out.push(`  Programmfragen ${g.id}: ${SK.questions.filter((q) => q.g === g.id).length}`));
  out.push('');
  out.push(errors.length ? `FEHLER (${errors.length}):\n${errors.join('\n')}` : 'OK – keine Fehler');
  document.getElementById('out').textContent = out.join('\n');
})();
