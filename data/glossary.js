/* Lexikon aller Stände, Techniken und Begriffe – Grundlage für Wissen (Lexikon) und Begriffe-Trainer. */
(function () {
  'use strict';
  const G = SK.gfx;
  const PDF = (n) => `${SK.PDF_SOURCE}, PDF-Seite ${n}`;
  const ALLG = SK.sources.allg;
  const PO = SK.sources.po;

  SK.glossaryCats = [
    { id: 'stand', title: 'Stände (Dachi)', ask: 'Welcher Stand ist abgebildet?' },
    { id: 'tsuki', title: 'Fauststoße (Tsuki)', ask: 'Welche Technik ist abgebildet?' },
    { id: 'uchi', title: 'Schläge (Uchi)', ask: 'Mit welchem Schlag wird die markierte Stelle eingesetzt?' },
    { id: 'uke', title: 'Abwehrtechniken (Uke)', ask: 'Welche Abwehr zeigt der Pfeil?' },
    { id: 'geri', title: 'Fußtechniken (Geri)', ask: 'Welche Fußtechnik zeigt die Grafik?' },
    { id: 'waffe', title: 'Körperwaffen', ask: 'Welcher Körperteil ist markiert?' },
    { id: 'kamae', title: 'Haltungen (Kamae)', ask: 'Welche Haltung ist abgebildet?' },
    { id: 'begriff', title: 'Kommandos & Begriffe', ask: 'Welcher Begriff ist abgebildet?' },
  ];

  const st = (key, mirrored) => () => G.stanceSvg(key, mirrored);
  const mv = (key) => () => G.MOVES[key]();
  const wp = (key) => () => G.WEAPONS[key]();

  // [Begriff, Bedeutung, Kategorie, Grafik?, Quelle?]
  const E = [
    ['Musubi-dachi', 'Grußstand: Fersen zusammen, Fußspitzen V-förmig geöffnet', 'stand', st('musubi')],
    ['Heisoku-dachi', 'Geschlossener Stand: Füße parallel und geschlossen', 'stand', st('heisoku')],
    ['Hachiji-dachi', 'Natürlicher Stand: Füße schulterbreit, Fußspitzen leicht nach außen', 'stand', st('hachiji')],
    ['Zenkutsu-dachi', 'Vorwärtsstellung: vorderes Knie gebeugt, hinteres Bein gestreckt, Gewicht vorne', 'stand', st('zenkutsu')],
    ['Kokutsu-dachi', 'Rückwärtsstellung: Gewicht überwiegend auf dem hinteren Bein, hinterer Fuß quer', 'stand', st('kokutsu')],
    ['Kiba-dachi', 'Reiterstellung: breit, Füße parallel, Gewicht gleich verteilt', 'stand', st('kiba')],
    ['Kosa-dachi', 'Kreuzstand: Beine gekreuzt, hinterer Fuß hinter der vorderen Ferse', 'stand', st('kosa')],
    ['Neko-ashi-dachi', 'Katzenfußstand: fast das gesamte Gewicht auf dem hinteren Bein', 'stand', st('neko')],
    ['Fudo-dachi', 'Unbeweglicher Stand: beide Knie gebeugt, Gewicht ausgeglichen (auch Sochin-dachi)', 'stand', st('fudo')],
    ['Hangetsu-dachi', 'Halbmondstand: Knie nach innen gespannt, länger als Sanchin-dachi', 'stand', st('hangetsu')],
    ['Sanchin-dachi', 'Sanduhrstand: kurz, Fußspitzen und Knie nach innen', 'stand', st('sanchin')],
    ['Renoji-dachi', 'L-förmiger Stand', 'stand', st('renoji')],
    ['Teiji-dachi', 'T-förmiger Stand', 'stand', st('teiji')],
    ['Ashi-zenkutsu', 'Kleiner Zenkutsu-dachi (kürzer und schmaler), z. B. in Gyaku-hanmi', 'stand', st('ashizenkutsu'), PDF(4)],
    ['Hizakutsu', 'Knie gebeugt, Technikrichtung anders als die Richtung des Zenkutsu-dachi', 'stand', st('hizakutsu'), PDF(4)],
    ['Ashi-dachi', 'Einbeinstand: Stand auf einem Bein, das andere ist angehoben', 'stand', st('ashidachi'), PDF(19)],
    ['Orishiki', 'Knien auf einem Bein, das andere Knie ist aufgestellt', 'stand', st('orishiki'), PDF(156)],

    ['Choku-zuki', 'Gerader Fauststoß im Stand', 'tsuki'],
    ['Oi-zuki', 'Fauststoß mit der Hand der Seite des vorderen Beins (auch Jun-zuki)', 'tsuki', mv('oi-zuki'), PDF(4)],
    ['Gyaku-zuki', 'Fauststoß mit der Hand der Gegenseite zum vorderen Bein, mit Hüftdrehung', 'tsuki', mv('gyaku-zuki'), PDF(4)],
    ['Kizami-zuki', 'Fauststoß mit der vorderen Hand ohne Schritt', 'tsuki'],
    ['Sanbon-zuki', 'Drei Fauststöße hintereinander (DJKB: Jodan/Chudan/Chudan)', 'tsuki', null, PO],
    ['Ren-zuki', 'Schnelle Folge von Fauststößen', 'tsuki', null, PDF(47)],
    ['Morote-zuki', 'Doppelfauststoß mit beiden Fäusten', 'tsuki', null, PDF(72)],
    ['Kagi-zuki', 'Hakenfauststoß – Unterarm vor dem Solarplexus', 'tsuki', null, PDF(68)],
    ['Ura-zuki', 'Kurzer Fauststoß mit dem Handrücken nach unten', 'tsuki', null, PDF(94)],
    ['Age-zuki', 'Aufwärts gerichteter Fauststoß (z. B. zum Kinn)', 'tsuki', null, PDF(158)],
    ['Yama-zuki', '„Bergfauststoß“: beide Fäuste gleichzeitig, eine Jodan, eine Gedan', 'tsuki', null, PDF(94)],
    ['Otoshi-zuki', 'Fauststoß nach unten', 'tsuki', null, PDF(127)],
    ['Nukite', 'Speerhand-Stoß mit den Fingerspitzen (Shihon-nukite = Tate-nukite)', 'tsuki', wp('nukite'), PDF(21)],

    ['Uraken-uchi', 'Schlag mit dem Faustrücken', 'uchi', wp('uraken')],
    ['Tettsui-uchi', 'Hammerfaustschlag (auch Kentsui-uchi)', 'uchi', wp('tettsui')],
    ['Shuto-uchi', 'Handkantenschlag', 'uchi', wp('shuto')],
    ['Haito-uchi', 'Schlag mit der inneren Handkante (Daumenseite)', 'uchi', wp('haito')],
    ['Enpi-uchi', 'Ellbogenschlag', 'uchi', wp('hiji')],
    ['Furi-enpi', 'Schwingender Ellbogenschlag zur Seite (Heian Sandan)', 'uchi', null, PDF(35)],
    ['Ushiro-enpi', 'Ellbogenstoß nach hinten', 'uchi', null, PDF(37)],
    ['Hasami-uchi', 'Zangenschlag mit beiden Fäusten zu beiden Seiten', 'uchi', null, PDF(90)],
    ['Teisho-uchi', 'Schlag mit dem Handballen', 'uchi', wp('teisho')],

    ['Gedan-barai', 'Abwehr nach unten (fegend)', 'uke', mv('gedan-barai')],
    ['Age-uke', 'Abwehr nach oben (Jodan)', 'uke', mv('age-uke')],
    ['Soto-uke', 'Abwehr von außen nach innen mit der Innenseite des Unterarms', 'uke', mv('soto-uke'), PDF(4)],
    ['Uchi-uke', 'Abwehr von innen nach außen mit der Außenseite des Unterarms', 'uke', mv('uchi-uke'), PDF(4)],
    ['Shuto-uke', 'Handkantenabwehr, meist in Kokutsu-dachi', 'uke'],
    ['Morote-uke', 'Unterstützte Abwehr – zweite Faust am Ellbogen', 'uke', null, PDF(26)],
    ['Juji-uke', 'Gekreuzte Abwehr (auch Kosa-uke)', 'uke', null, PDF(41)],
    ['Kakiwake-uke', 'Abwehr, bei der beide Arme auseinanderdrücken', 'uke', null, PDF(46)],
    ['Nagashi-uke', 'Fließende, ablenkende Abwehr', 'uke'],
    ['Osae-uke', 'Drückende Abwehr nach unten', 'uke', null, PDF(21)],
    ['Kake-uke', 'Hakenabwehr mit dem Handgelenk', 'uke', null, PDF(59)],
    ['Sukui-uke', 'Schöpfende Abwehr gegen einen Tritt', 'uke', null, PDF(82)],
    ['Haiwan-uke', 'Abwehr mit der Rückseite des Unterarms', 'uke', null, PDF(17)],
    ['Tsukami-uke', 'Greifende Abwehr', 'uke', null, PDF(87)],
    ['Tate-shuto-uke', 'Abwehr mit senkrechter Handkante, Arm gestreckt', 'uke', null, PDF(83)],
    ['Teisho-uke', 'Abwehr mit dem Handballen', 'uke', null, PDF(142)],
    ['Uchiotoshi', 'Unterarm schlägt einen Angriff nach unten (Jion)', 'uke', null, PDF(150)],

    ['Mae-geri', 'Fußtritt nach vorne mit dem Fußballen', 'geri', mv('mae-geri')],
    ['Yoko-geri-keage', 'Seitlicher Schnapptritt', 'geri', mv('yoko-geri')],
    ['Yoko-geri-kekomi', 'Seitlicher Stoßtritt mit der Fußkante', 'geri', mv('yoko-geri')],
    ['Mawashi-geri', 'Halbkreisfußtritt', 'geri', mv('mawashi-geri')],
    ['Ushiro-geri', 'Fußtritt nach hinten mit der Ferse', 'geri', mv('ushiro-geri')],
    ['Mikazuki-geri', 'Sicheltritt', 'geri', mv('mikazuki-geri'), PDF(60)],
    ['Fumikomi', 'Stampftritt / Aufstampfen', 'geri', null, PDF(35)],
    ['Namigaeshi', '„Wellenrücklauf“: Fuß federnd hochziehen, fegender Block gegen einen Tritt (Tekki)', 'geri', null, PDF(70)],
    ['Nidan-geri', 'Doppeltritt im Sprung (Kanku Dai)', 'geri', null, PDF(128)],
    ['Hiza-geri', 'Kniestoß', 'geri', wp('hiza')],
    ['Ren-geri', 'Kombination mehrerer Fußtritte', 'geri', null, PO],
    ['Sonoba-geri', 'Fußtritte am Platz (Standübung)', 'geri', null, PO],
    ['Kizami-geri', 'Fußtritt mit dem vorderen Bein', 'geri', null, PO],

    ['Seiken', 'Faustvorderseite (Knöchel von Zeige- und Mittelfinger)', 'waffe', wp('seiken')],
    ['Uraken', 'Faustrücken', 'waffe', wp('uraken')],
    ['Tettsui', 'Hammerfaust – Kleinfingerseite der Faust (auch Kentsui)', 'waffe', wp('tettsui')],
    ['Shuto', 'Handkante (Kleinfingerseite der offenen Hand)', 'waffe', wp('shuto')],
    ['Haito', 'Innere Handkante (Daumenseite)', 'waffe', wp('haito')],
    ['Nukite (Speerhand)', 'Fingerspitzen der gestreckten Hand', 'waffe', wp('nukite')],
    ['Teisho', 'Handballen', 'waffe', wp('teisho')],
    ['Haishu', 'Handrücken der offenen Hand', 'waffe', wp('haishu'), PDF(67)],
    ['Hiji / Enpi', 'Ellbogen', 'waffe', wp('hiji')],
    ['Hiza', 'Knie', 'waffe', wp('hiza')],
    ['Zenwan', 'Unterarm', 'waffe', wp('zenwan')],
    ['Koshi (Josokutei)', 'Fußballen', 'waffe', wp('koshi'), PDF(24)],
    ['Sokuto', 'Fußkante (Außenkante)', 'waffe', wp('sokuto')],
    ['Kakato', 'Ferse', 'waffe', wp('kakato')],
    ['Haisoku', 'Fußrücken / Spann', 'waffe', wp('haisoku')],

    ['Chudan-kamae', 'Kampfhaltung mit den Händen auf mittlerer Höhe', 'kamae', null, PO],
    ['Gedan-kamae', 'Kampfhaltung mit der vorderen Hand in Gedan-barai-Position', 'kamae', null, PO],
    ['Shuto-kamae', 'Kampfhaltung mit Handkanten (wie Shuto-uke)', 'kamae', null, PO],
    ['Koshi-kamae', 'Beide Fäuste an der Hüfte übereinander (Ryoken Koshi-kamae)', 'kamae', null, PDF(19)],
    ['Mizunagare-no-kamae', '„Wasserfluss-Haltung“: Unterarm schräg vor dem Solarplexus, etwa zwei Fäuste entfernt', 'kamae', null, PDF(55)],
    ['Hanmi', 'Halbseitliche Körperhaltung', 'kamae', null, PO],
    ['Gyaku-hanmi', 'Umgekehrt halbseitliche Körperhaltung', 'kamae', null, PDF(24)],
    ['Shizentai', 'Natürliche Haltung', 'kamae', null, PO],
    ['Hikite', 'Zurückziehende Hand zur Hüfte', 'kamae', null, PO],

    ['Yoi', 'Bereit – Bereitschaftsstellung', 'begriff'],
    ['Hajime', 'Beginnen', 'begriff'],
    ['Yame', 'Aufhören', 'begriff'],
    ['Naore', 'Zurück in die Ausgangsstellung', 'begriff'],
    ['Mawatte', 'Wenden', 'begriff'],
    ['Rei', 'Gruß / Verbeugung', 'begriff'],
    ['Seiza', 'Kniender Fersensitz', 'begriff', null, PO],
    ['Mokuso', 'Augen schließen, meditieren', 'begriff', null, PO],
    ['Kiritsu', 'Aufstehen', 'begriff', null, PO],
    ['Kiai', 'Kampfschrei', 'begriff', null, PO],
    ['Kime', 'Konzentration aller Kraft im Treffmoment', 'begriff', null, PO],
    ['Zanshin', 'Wache Aufmerksamkeit nach der Technik', 'begriff', null, PO],
    ['Maai', 'Kampfdistanz', 'begriff', null, PO],
    ['Deai', 'Kontern im Moment des gegnerischen Angriffs', 'begriff', null, PO],
    ['Kogeki', 'Angriff', 'begriff', null, PO],
    ['Suri-ashi', 'Gleitschritt', 'begriff', null, PO],
    ['Yori-ashi', 'Beide Füße gleiten gemeinsam, der Stand bleibt erhalten', 'begriff', null, PDF(38)],
    ['Tai-sabaki', 'Körperausweichbewegung', 'begriff', null, PO],
    ['Sun-dome', 'Technik kurz vor dem Ziel abstoppen', 'begriff', null, PO],
    ['Ashi-barai', 'Fußfeger', 'begriff', null, PO],
    ['Enbusen', 'Bewegungslinie einer Kata', 'begriff', null, PDF(4)],
    ['Bunkai', 'Anwendung / Analyse der Kata-Techniken', 'begriff'],
  ];

  SK.glossary = E.map(([t, de, cat, img, src]) => ({ t, de, cat, img: img || null, src: src || ALLG }));

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  SK.buildGlossaryContent = function () {
    const unit = { id: 'begriffe-trainer', title: 'Begriffe-Trainer', kind: 'drill', desc: 'Was ist das für ein Stand / eine Technik? – alles abgedeckt', lessons: [] };
    SK.glossaryCats.forEach((c) => {
      const items = SK.glossary.filter((e) => e.cat === c.id);
      const lid = `gl-${c.id}`;
      unit.lessons.push({ id: lid, title: c.title, learn: SK.glossaryHtml(items) });
      const svgs = new Map(items.map((e) => [e, e.img ? e.img() : null]));
      items.forEach((e) => {
        const others = items.filter((o) => o !== e);
        const pick = (field) => SK.util.shuffle(others.map((o) => o[field]).filter((v, i, a) => v !== e[field] && a.indexOf(v) === i)).slice(0, 3);
        const id = `gl-${slug(e.t)}`;
        const base = { lesson: lid, type: 'mc', answer: 0, src: e.src };
        SK.questions.push(Object.assign({ id: `${id}-a`, q: `Was ist „${e.t}“?`, options: [e.de].concat(pick('de')), explain: '' }, base));
        SK.questions.push(Object.assign({ id: `${id}-b`, q: `Wie heißt: ${e.de}?`, options: [e.t].concat(pick('t')), explain: '' }, base));
        const svg = svgs.get(e);
        if (svg && !others.some((o) => svgs.get(o) === svg)) {
          SK.questions.push(Object.assign({ id: `${id}-c`, q: c.ask, img: G.dataUri(svg), options: [e.t].concat(pick('t')), explain: e.de }, base));
        }
      });
    });
    return unit;
  };

  SK.glossaryHtml = function (items) {
    return `<div class="lex-grid">${items
      .map(
        (e) => `<article class="lex-card" data-cat="${e.cat}" data-text="${SK.util.esc(`${e.t} ${e.de}`.toLowerCase())}">
          ${e.img ? `<div class="lex-img">${e.img()}</div>` : ''}
          <h4>${SK.util.esc(e.t)}</h4><p>${SK.util.esc(e.de)}</p></article>`
      )
      .join('')}</div>`;
  };
})();
