/* Leitner-System: 5 Fächer, falsch -> Fach 1 (heute fällig), richtig -> nächstes Fach. */
(function () {
  'use strict';
  const { util, store } = SK;
  const INTERVALS = [0, 1, 2, 4, 8, 16];

  SK.srs = {
    record(qid, correct) {
      const s = store.data.srs;
      const cur = s[qid] || { b: 0, due: util.today(), w: 0 };
      if (correct) {
        cur.b = Math.min(5, cur.b + 1);
        cur.due = util.addDays(util.today(), INTERVALS[cur.b]);
      } else {
        cur.b = 1;
        cur.w = (cur.w || 0) + 1;
        cur.due = util.today();
      }
      s[qid] = cur;
    },
    due() {
      const t = util.today();
      const ids = new Set(SK.questions.map((q) => q.id));
      return Object.entries(store.data.srs)
        .filter(([id, v]) => ids.has(id) && v.due <= t)
        .sort((a, b) => a[1].b - b[1].b || (b[1].w || 0) - (a[1].w || 0))
        .map(([id]) => id);
    },
    box(qid) {
      const v = store.data.srs[qid];
      return v ? v.b : 0;
    },
  };
})();
