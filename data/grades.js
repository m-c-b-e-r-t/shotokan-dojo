/* DJKB-Graduierungen 9. Kyu bis 3. Dan.
   Quellen: DJKB-Prüfungsordnung (Stand Juli 2013), DJKB-Verfahrensordnung (Stand Januar 2024),
   DJKB-Übersichten Kihon/Kata/Kumite (djkb.com, Downloads Prüfungswesen). */
(function () {
  'use strict';
  SK.sources = {
    po: 'DJKB-Prüfungsordnung, Stand Juli 2013',
    vo: 'DJKB-Verfahrensordnung für Kyu- und Dan-Prüfungen, Stand Januar 2024',
    ueb: 'DJKB-Übersicht Prüfungsprogramm (Kihon/Kata/Kumite)',
    pdf: 'Karate-Do Kata Vol. 1 (JKA)',
    allg: 'Allgemeines Shotokan-/JKA-Grundwissen (u. a. Wikipedia: Shōtōkan, Gichin Funakoshi, JKA)',
  };

  const SENTEI_BOOK = ['bassai-dai', 'kanku-dai', 'jion', 'enpi'];
  const ALL_BOOK = ['heian-shodan', 'heian-nidan', 'heian-sandan', 'heian-yondan', 'heian-godan', 'tekki-shodan'].concat(SENTEI_BOOK);

  SK.grades = [
    {
      id: '9kyu', name: '9. Kyu', belt: 'Weißgurt', cls: 'belt-white', kata: [], examKata: 'entfällt (Theorie: Ablauf Taikyoku Shodan)',
      wait: 'mind. 3 Monate Training',
      kihon: [
        'im Stand (Soto-Hachiji-Dachi) Choku-Zuki, links und rechts',
        'aus Choku-Zuki-Kamae Schritt vorwärts in Zk mit Oi-Zuki, zurück in Soto-Hachiji-Dachi',
        'aus Jodan-Kamae Schritt vorwärts in Zk mit Age-Uke, zurück',
        'aus Choku-Zuki-Kamae Schritt vorwärts in Zk mit Soto-Uke, zurück',
        'aus Gedan-Barai-Kamae Schritt vorwärts in Zk mit Gedan-Barai, zurück',
      ],
      kumite: 'Kihon-Ippon-Kumite: Jodan- und Chudan-Oi-Zuki; Abwehr Age-Uke bzw. Soto-Uke mit Chudan-Gyaku-Zuki (je 1x rechts, 1x links)',
      theory: 'Musubi-Dachi, Seiza, Mokuso, Mokuso yame, Shomen ni rei, Sensei ni rei, Kiritsu; Etikette An-/Abgrüßen; Ablauf Taikyoku Shodan',
    },
    {
      id: '8kyu', name: '8. Kyu', belt: 'Gelbgurt', cls: 'belt-yellow', kata: ['heian-shodan'], examKata: 'Heian Shodan',
      wait: '3 Monate nach dem 9. Kyu (direkt zum 8. Kyu nach mind. 3 Monaten möglich)',
      kihon: [
        'aus Gedan-Kamae links vorwärts in Zk mit Oi-Zuki, Wendung in Zk mit Gedan-Barai',
        'vorwärts in Zk mit Age-Uke, Wendung in Zk mit Gedan-Barai',
        'vorwärts in Zk mit Soto-Uke, Wendung in Zk mit Gedan-Barai',
        'vorwärts in Zk mit Uchi-Uke, Wendung in Kk mit Shuto-Uke',
        'aus Shuto-Uke-Kamae vorwärts in Kk mit Shuto-Uke, Wendung in Zk mit beidarmigem Gedan-Barai',
        'aus Ryo-Yoko-Gedan-Barai-Kamae vorwärts in Zk mit Chudan-Mae-Geri, Wendung in Kb mit Gedan-Barai',
        'aus Chudan-Kamae vorwärts in Kb mit Yoko-Geri-Kekomi (beide Richtungen)',
      ],
      kumite: 'Gohon-Kumite: 5x Jodan-Oi-Zuki und 5x Chudan-Oi-Zuki; Abwehr 5x Age-Uke bzw. Soto-Uke, dann Chudan-Gyaku-Zuki mit Kiai',
      theory: 'Kihon-Ippon-Kumite, Gohon-Kumite, Jodan, Chudan, Gedan, Kata',
    },
    {
      id: '7kyu', name: '7. Kyu', belt: 'Orangegurt', cls: 'belt-orange', kata: ['heian-nidan'], examKata: 'Heian Nidan',
      wait: '3 Monate',
      kihon: [
        'aus Gedan-Kamae links vorwärts in Zk mit Oi-Zuki, Wendung mit Gedan-Barai in Zk',
        'vorwärts in Zk mit Age-Uke / Soto-Uke, jeweils Wendung mit Gedan-Barai in Zk',
        'vorwärts in Zk mit Uchi-Uke, Wendung mit Shuto-Uke in Kk',
        'aus Shuto-Uke-Kamae vorwärts in Kk mit Shuto-Uke, Wendung mit beidarmigem Gedan-Barai in Zk',
        'aus Chudan-Kamae vorwärts in Zk mit Mae-Geri, Wendung mit Gedan-Barai in Kb',
        'aus Chudan-Kamae vorwärts in Kb mit Yoko-Geri-Keage und mit Yoko-Geri-Kekomi (beide Richtungen)',
      ],
      kumite: 'Gohon-Kumite: Abwehr rechts zurück mit 5x Age-Uke bzw. links zurück mit 5x Soto-Uke, Gegenangriff Chudan-Gyaku-Zuki',
      theory: 'Shizentai, Kiai, Hanmi, Chudan-Kamae, Gedan-Kamae, Shuto-Kamae, Hiki-Te',
    },
    {
      id: '6kyu', name: '6. Kyu', belt: 'Grüngurt', cls: 'belt-green', kata: ['heian-sandan'], examKata: 'Heian Sandan',
      wait: '3 Monate',
      kihon: [
        'Oi-Zuki; Age-Uke/Gyaku-Zuki; Soto-Uke / umsetzen in Kb mit Yoko-Empi-Uchi',
        'Uchi-Uke/Gyaku-Zuki, Wendung mit Shuto-Uke in Kk',
        'Shuto-Uke/Kizami-Mae-Geri in Kk',
        'Jodan-Mae-Geri, Chudan-Mae-Geri, Yoko-Geri-Keage, Yoko-Geri-Kekomi',
      ],
      kumite: 'Kihon-Ippon-Kumite mit Sabaki (Jodan-/Chudan-Oi-Zuki, Chudan-Mae-Geri, Chudan-Yoko-Geri-Kekomi)',
      theory: 'Dojo, Te, Do, Kogeki, Uke',
    },
    {
      id: '5kyu', name: '5. Kyu', belt: 'Violettgurt', cls: 'belt-violet', kata: ['heian-yondan'], examKata: 'Heian Yondan',
      wait: '4 Monate',
      kihon: [
        'Sanbon-Zuki (Jodan/Chudan/Chudan)',
        'rückwärts Soto-Uke / umsetzen in Kb mit Yoko-Empi-Uchi / Tate-Uraken',
        'Uchi-Uke / Jodan-Kizami-Zuki / Gyaku-Zuki',
        'rückwärts in Kk mit Shuto-Uke / Jodan-Kizami-Mae-Geri / Nukite in Zk',
        'Mawashi-Geri, Wendung mit Gedan-Barai in Kb',
      ],
      kumite: 'Kihon-Ippon-Kumite mit Sabaki rechts und links (wie 6. Kyu)',
      theory: 'Kiai, Sanbon-Zuki, Soto-Uke, Uchi-Uke',
    },
    {
      id: '4kyu', name: '4. Kyu', belt: 'Violettgurt', cls: 'belt-violet', kata: ['heian-godan'], examKata: 'Heian Godan',
      wait: '4 Monate',
      kihon: [
        'rückwärts in Zk mit Age-Uke / Gyaku-Zuki',
        'Uchi-Uke / Jodan-Kizami-Zuki / Chudan-Gyaku-Zuki',
        'rückwärts Soto-Uke / Yoko-Empi-Uchi / Tate-Uraken in Kb',
        'vorwärts in Kk mit Shuto-Uke / Kizami-Mae-Geri / Nukite in Zk',
      ],
      kumite: 'Kihon-Ippon-Kumite: Sabaki frei, Blocktechniken frei, Gegenangriffe frei – je Angriffsstufe 2x unterschiedlich',
      theory: 'Kime, Kime-Waza',
    },
    {
      id: '3kyu', name: '3. Kyu', belt: 'Braungurt', cls: 'belt-brown', kata: ['tekki-shodan'], examKata: 'Tekki Shodan',
      wait: '6 Monate',
      kihon: [
        'rückwärts Uchi-Uke / Kizami-Mae-Geri / Gyaku-Zuki',
        'Ren-Geri (Chudan-Mae-Geri / Zwischenschritt / Mawashi-Geri), Wendung mit Gedan-Barai in Kb',
      ],
      kumite: 'Kihon-Ippon-Kumite: Angriffe 1x links und 1x rechts; Sabaki und Gegenangriffe frei',
      theory: 'Ren-Geri, Shiai, Suri-Ashi',
    },
    {
      id: '2kyu', name: '2. Kyu', belt: 'Braungurt', cls: 'belt-brown', kata: SENTEI_BOOK, examKata: 'eine Sentei-Kata nach Wahl: Bassai Dai, Kanku Dai, Jion, Enpi, Hangetsu',
      wait: '6 Monate',
      kihon: [
        'Ushiro-Geri, Wendung mit Gedan-Barai in Kb',
        'Sonoba-Geri: Mae-Geri nach vorne / mit gleichem Bein Yoko-Geri-Keage zur Seite',
      ],
      kumite: 'Jiyu-Ippon-Kumite: Jodan-/Chudan-Oi-Zuki, Chudan-Mae-Geri, Chudan-Yoko-Geri-Kekomi, Chudan-Ushiro-Geri',
      theory: 'Maai, Deai, Jiyu-Ippon-Kumite, Kizami-Geri',
    },
    {
      id: '1kyu', name: '1. Kyu', belt: 'Braungurt', cls: 'belt-brown', kata: SENTEI_BOOK, examKata: 'eine Sentei-Kata nach Wahl (auch dieselbe wie zum 2. Kyu möglich)',
      wait: '6 Monate',
      kihon: [
        'Age-Uke / Mae-Geri / hinten absetzen mit Gyaku-Zuki',
        'Ren-Geri (Chudan-Mae-Geri / mit gleichem Bein Mawashi-Geri)',
        'Sonoba-Geri: Mae-Geri / mit gleichem Bein Ushiro-Geri',
      ],
      kumite: 'Jiyu-Ippon-Kumite mit 7 Angriffen (u. a. Jodan-Kizami-Zuki, Jodan-Mawashi-Geri), mind. 2x Wechsel der Ausgangslage',
      theory: 'Zanshin, Sonoba-Geri, Okuri-Jiyu-Ippon-Kumite, Sentei-Kata, Shitei-Kata, Tokui-Kata',
    },
    {
      id: '1dan', name: '1. Dan (Shodan)', belt: 'Schwarzgurt', cls: 'belt-black', kata: ALL_BOOK, examKata: 'Sentei-Kata nach Wahl + vom Prüfer angegebene Kata aus Heian 1–5 oder Tekki Shodan',
      wait: 'vollendetes 16. Lebensjahr (8 Jahre Karate), 1 Jahr seit dem 1. Kyu',
      kihon: [
        'Sanbon-Zuki aus Gedan-Kamae',
        'Soto-Uke / Yoko-Empi-Uchi / Tate-Uraken-Uchi / Gyaku-Zuki',
        'Ren-Geri (Mawashi-Geri / mit gleichem Bein Yoko-Geri-Kekomi)',
        'Yoko-Geri-Keage / Drehung / mit hinterem Bein Yoko-Geri-Kekomi',
        'Sonoba-Geri: Mae-Geri / Yoko-Geri-Keage / Ushiro-Geri mit gleichem Bein',
      ],
      kumite: 'Jiyu-Ippon-Kumite (Wechsel der Ausgangslage möglich)',
      theory: 'Kosa-Dachi, Sun-Dome, Tai-Sabaki, Ashi-Barai, Nagashi-Uke; Kata-Bunkai aus Heian 1–5 und Tekki Shodan',
    },
    {
      id: '2dan', name: '2. Dan (Nidan)', belt: 'Schwarzgurt', cls: 'belt-black', kata: ALL_BOOK, examKata: 'Prüferwahl aus Heian, Tekki, Sentei-Kata + Kata nach Wahl aus Bassai Sho, Kanku Sho, Nijushiho, Jitte, Chinte, Meikyo, Gankaku, Sochin',
      wait: 'Lebensalter 20 Jahre, 2 Jahre Vorbereitungszeit (4 Jahre, wenn Shodan mit 16)',
      kihon: [
        'im Stand Jodan-Kizami-Zuki / vorwärts Sanbon-Zuki',
        'Age-Uke / Mawashi-Geri / Tate-Uraken / Oi-Zuki',
        'Jodan-Oi-Zuki / Gyaku-Zuki / rückwärts Shuto-Uke / Ushiro-Geri / Gyaku-Zuki',
        'Sonoba-Geri: Mae-Geri, Yoko-Geri-Keage, Ushiro-Geri, Mawashi-Geri mit gleichem Bein',
      ],
      kumite: 'Jiyu-Kumite (alternativ Jiyu-Ippon-Kumite je nach Alter)',
      theory: 'Happo-Kumite; Lehrprobe aus den Kyu-Programmen; Kata-Bunkai aus den Sentei-Kata',
    },
    {
      id: '3dan', name: '3. Dan (Sandan)', belt: 'Schwarzgurt', cls: 'belt-black', kata: ALL_BOOK, examKata: 'Tokui-Kata frei (ohne Unsu, Gojushiho Sho/Dai, keine bereits bei Dan-Prüfung gezeigte) + Prüferwahl aus Sentei, Heian/Tekki 1–3 und Bassai Sho … Sochin',
      wait: 'Lebensalter 25 Jahre, 3 Jahre seit der Nidan-Prüfung',
      kihon: ['Der Prüfer gibt 5 verschiedene Reihen aus dem Shodan- und Nidan-Programm an'],
      kumite: 'Jiyu-Kumite (alternativ Jiyu-Ippon-Kumite je nach Alter)',
      theory: 'Theoriefragen aus Kyu- und Dan-Graden; Lehrprobe aus Shodan-/Nidan-Programm; Kata-Bunkai aus den Sentei-Kata',
    },
  ];

  SK.gradeIndex = (id) => SK.grades.findIndex((g) => g.id === id);
})();
