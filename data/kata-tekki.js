/* Kata-Daten Tekki Shodan. Einzige Quelle: Karate-Do Kata Vol. 1 (JKA). */
(function () {
  'use strict';
  const P = (n) => `${SK.PDF_SOURCE}, PDF-Seite ${n}`;

  SK.kata['tekki-shodan'] = {
    id: 'tekki-shodan', name: 'Tekki Shodan', moves: 29, kiai: [15, 29], firstPage: 66,
    yoi: 'Heisoku-dachi, linke Handfläche auf dem Rücken der rechten Hand vor dem Unterbauch',
    naore: 'Der linke Fuß bleibt, der rechte Fuß geht neben den linken zurück in die Yoi-Position.',
    continuous: [],
    slow: [7, 16, 21],
    seq: [
      [1, 'Hidari Ashi-mae Kosa', 'Kao Migi-muki (Blick nach rechts)', 66, 'linker Fuß kreuzt vor dem rechten'],
      [2, 'Kiba-dachi', 'Migi Tekubi Migi Sokumen Chudan Kake-uke', 67, 'Migi Ashi Fumikomi'],
      [3, 'Kiba-dachi', 'Migi Sokumen Hidari Mae-enpi (Usho Hidari Hiji-ate)', 67],
      [4, 'Kiba-dachi', 'Kao Hidari-muki Ryoken Migi Koshi-kamae', 67],
      [5, 'Kiba-dachi', 'Hidari Sokumen Hidari Gedan-barai', 68],
      [6, 'Kiba-dachi', 'Uken Kagi-zuki', 68],
      [7, 'Migi Ashi-mae Kosa', 'Rechter Fuß kreuzt langsam vor dem linken', 68],
      [8, 'Kiba-dachi', 'Migi Chudan Uchi-uke', 69, 'Hidari Ashi Fumikomi, Kao Shomen-muki'],
      [9, 'Kiba-dachi', 'Hidari Uraken Jodan-uchi + Migi Zenwan Mune-mae Suihei-kamae', 69, 'Teil 1: Hidari Haiwan Jodan Uchi-nagashi-uke + Migi Gedan-uke'],
      [10, 'Kiba-dachi', 'Kao Hidari-muki (Blick nach links)', 70],
      [11, 'Kiba-dachi', 'Hidari Zenwan Hidari Sokumen Chudan-uke', 70, 'Hidari Ashi Namigaeshi'],
      [12, 'Kiba-dachi', 'Kao Migi-muki (Blick nach rechts)', 70],
      [13, 'Kiba-dachi', 'Hidari Zenwan Migi Sokumen Chudan-uke', 71, 'Migi Ashi Namigaeshi'],
      [14, 'Kiba-dachi', 'Kao Hidari-muki Ryoken Migi Koshi-kamae', 71],
      [15, 'Kiba-dachi', 'Saken Hidari Sokumen Chudan-zuki + Uken Kagi-zuki', 72],
      [16, 'Kiba-dachi', 'Hidari Tekubi Hidari Sokumen Chudan Kake-uke', 72],
      [17, 'Kiba-dachi', 'Hidari Sokumen Migi Mae-enpi (Sasho Migi Hiji-ate)', 73],
      [18, 'Kiba-dachi', 'Kao Migi-muki Ryoken Hidari Koshi-kamae', 73],
      [19, 'Kiba-dachi', 'Migi Sokumen Migi Gedan-barai', 73],
      [20, 'Kiba-dachi', 'Saken Kagi-zuki', 74],
      [21, 'Hidari Ashi-mae Kosa', 'Linker Fuß kreuzt langsam vor dem rechten', 74],
      [22, 'Kiba-dachi', 'Hidari Chudan Uchi-uke', 74, 'Migi Ashi Fumikomi, Kao Shomen-muki'],
      [23, 'Kiba-dachi', 'Migi Uraken Jodan-uchi + Hidari Zenwan Mune-mae Suihei-kamae', 75, 'Teil 1: Migi Haiwan Jodan Uchi-nagashi-uke + Hidari Gedan-uke'],
      [24, 'Kiba-dachi', 'Kao Migi-muki (Blick nach rechts)', 75],
      [25, 'Kiba-dachi', 'Migi Zenwan Migi Sokumen Chudan-uke', 75, 'Migi Ashi Namigaeshi'],
      [26, 'Kiba-dachi', 'Kao Hidari-muki (Blick nach links)', 76],
      [27, 'Kiba-dachi', 'Migi Zenwan Hidari Sokumen Chudan-uke', 76, 'Hidari Ashi Namigaeshi'],
      [28, 'Kiba-dachi', 'Kao Migi-muki Ryoken Hidari Koshi-kamae', 76],
      [29, 'Kiba-dachi', 'Uken Migi Sokumen Chudan-zuki + Saken Kagi-zuki', 76],
    ],
    learn: `
      <p>Tekki Shodan hat laut Buch <b>29 Bewegungen</b>. Kiai bei <b>15</b> und <b>29</b> (Doppelfauststoß mit Kagi-zuki).</p>
      <ul>
        <li><b>Yoi</b>: Heisoku-dachi, linke Handfläche auf dem Rücken der rechten Hand vor dem Unterbauch.</li>
        <li>Bewegung 1: Blick nach rechts, Hüfte absenken, linken Fuß sanft über den rechten kreuzen – alle Zehen auf einer Linie.</li>
        <li>Bewegung 2: Kake-uke mit dem Handgelenk (Hakenbewegung); alternativ Schlag mit dem Handrücken (<b>Haishu</b>) auf den Solarplexus.</li>
        <li>Bewegung 3 und 17: Mae-enpi, die offene Hand schlägt gegen den Ellbogen – mit großer Kraft.</li>
        <li>Bewegung 6 und 20: <b>Kagi-zuki</b> – Unterarm vor dem Solarplexus, etwa zwei Fäuste von der Brust (wie Mizunagare-no-kamae).</li>
        <li>Bewegung 7 und 21: Fuß kreuzt <b>langsam und verstohlen</b>.</li>
        <li><b>Namigaeshi</b> (11, 13, 25, 27): Fuß federnd hochziehen, Fußsohle nach oben – fegender Block gegen einen Tritt.</li>
        <li>Bewegung 9 und 23: Uraken trifft <b>Jinchu</b>.</li>
        <li>Blickwechsel (Kao …-muki) scharf ausführen.</li>
        <li>Tekki hieß früher <b>Naihanchi</b>. Charakteristisch ist der Stand: Oberschenkelinnenseiten anspannen, als säße man auf einem Pferd.</li>
      </ul>`,
    facts(L) {
      L.mc('Tekki Shodan: Wie ist die Yoi-Position?', ['Heisoku-dachi, linke Handfläche auf dem Rücken der rechten Hand vor dem Unterbauch', 'Hachiji-dachi, Fäuste vor den Oberschenkeln', 'Kiba-dachi, Fäuste an den Hüften', 'Musubi-dachi, Hände seitlich'], '', P(66));
      L.mc('Tekki Shodan, Bewegung 1: Wie wird der linke Fuß gekreuzt?', ['Sanft über den rechten Fuß, alle Zehen auf einer Linie', 'Hinter dem rechten Fuß mit Sprung', 'Mit Stampfen', 'Weit nach vorne'], '', P(66));
      L.mc('Tekki Shodan, Bewegung 2: Welche Alternative nennt der Point?', ['Schlag mit dem Handrücken (Haishu) auf den Solarplexus', 'Fauststoß Jodan', 'Fußfeger', 'Kopfstoß'], '', P(67));
      L.mc('Was ist HAISHU laut Buch?', ['Der Rücken der offenen Hand mit vier gestreckten Fingern und gebeugtem Daumen', 'Der Handballen', 'Die Handkante', 'Die Faustrückseite'], '', P(67));
      L.mc('Tekki Shodan, Bewegung 3 (Mae-enpi mit Hiji-ate): Mit welcher Intensität wird geschlagen?', ['Mit großer Kraft', 'Langsam und weich', 'Nur angedeutet', 'Mit Pause'], '', P(67));
      L.mc('Tekki Shodan, Kagi-zuki (Bewegung 6): Wie weit ist der Unterarm von der Brust entfernt?', ['Etwa zwei Fäuste', 'Eine Armlänge', 'Er liegt an', 'Etwa vier Fäuste'], 'Die Position entspricht Mizunagare-no-kamae.', P(68));
      L.mc('Tekki Shodan, Bewegung 7: Wie wird der rechte Fuß gekreuzt?', ['Langsam und verstohlen', 'Schnell mit Kiai', 'Mit Sprung', 'Mit Stampfen'], '', P(68));
      L.mc('Tekki Shodan, Bewegung 8: Was soll zusammen ausgeführt werden?', ['Blicken, Blocken und Stampfen', 'Nur Blocken und Kiai', 'Atmen und Schlagen', 'Springen und Drehen'], '', P(69));
      L.mc('Tekki Shodan, Bewegung 9: Worauf zielt der Uraken?', ['Jinchu (Bereich über der Oberlippe)', 'Den Solarplexus', 'Die Schläfe', 'Das Knie'], '', P(69));
      L.mc('Was beschreibt NAMIGAESHI in Tekki Shodan?', ['Fuß federnd bis vor den Unterbauch heben, Sohle nach oben – fegender Block gegen einen Tritt', 'Ein Stampfer auf den Fuß des Gegners', 'Ein Sprung', 'Ein Mae-geri Jodan'], '', P(70));
      L.mc('Wie sollen die Blickwechsel (Kao Hidari-muki / Kao Migi-muki) in Tekki Shodan ausgeführt werden?', ['Scharf und schnell', 'Langsam', 'Mit geschlossenen Augen', 'Mit Kiai'], '', P(70));
      L.mc('Tekki Shodan, Bewegung 15: Was stellt die Technik laut Karate-Do Kyohan dar?', ['Eine der Doppelfaust-Techniken (Morote-zuki)', 'Einen Wurf', 'Einen Fußfeger', 'Einen Hebel'], '', P(72));
      L.mc('Wie hieß Tekki früher?', ['Naihanchi', 'Pin An', 'Wanshu', 'Kushanku'], '', P(77));
      L.mc('Wofür ist Tekki laut Karate-Do Kyohan besonders charakteristisch?', ['Für den Stand – Innenseite der Oberschenkel anspannen wie beim Reiten auf einem Pferd', 'Für viele Sprünge', 'Für viele Fußtritte', 'Für langsame Atembewegungen'], '', P(77));
      L.mc('In welchem Stand wird fast die gesamte Tekki Shodan ausgeführt?', ['Kiba-dachi', 'Zenkutsu-dachi', 'Kokutsu-dachi', 'Neko-ashi-dachi'], '', P(67));
    },
  };
})();
