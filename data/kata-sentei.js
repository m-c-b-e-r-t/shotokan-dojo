/* Kata-Daten Bassai Dai, Kanku Dai, Jion, Enpi. Einzige Quelle: Karate-Do Kata Vol. 1 (JKA). */
(function () {
  'use strict';
  const P = (n) => `${SK.PDF_SOURCE}, PDF-Seite ${n}`;

  SK.kata['bassai-dai'] = {
    id: 'bassai-dai', name: 'Bassai Dai', moves: 42, kiai: [19, 42], firstPage: 79,
    yoi: 'Heisoku-dachi, rechte Faust in der leicht gebeugten linken Hand vor dem Unterbauch (Sasho Uken Kafukubu-mae)',
    naore: 'Der rechte Fuß bleibt, der linke Fuß geht neben den rechten zurück in die Yoi-Position.',
    continuous: [[2, 3], [4, 5], [6, 7], [10, 11], [12, 13], [22, 23]],
    slow: [9, 18, 27, 34, 36, 41],
    seq: [
      [1, 'Migi Ashi-mae Kosa-dachi', 'Sasho Soede Migi Chudan Uchi-uke', 79],
      [2, 'Hidari Zenkutsu-dachi', 'Hidari Chudan Uchi-uke', 80],
      [3, 'Hidari Zenkutsu-dachi', 'Migi Chudan Uchi-uke', 80],
      [4, 'Migi Zenkutsu-dachi', 'Hidari Chudan Soto-uke', 81],
      [5, 'Migi Zenkutsu-dachi', 'Migi Chudan Uchi-uke', 81],
      [6, 'Migi Zenkutsu-dachi', 'Migi Chudan Soto-uke', 82, 'zuvor Migi Gedan Sukui-uke'],
      [7, 'Migi Zenkutsu-dachi', 'Hidari Chudan Uchi-uke', 82],
      [8, 'Hachiji-dachi', 'Ryoken Migi Koshi-kamae', 83],
      [9, 'Hachiji-dachi', 'Hidari Tate-shuto Chudan-uke', 83],
      [10, 'Hachiji-dachi', 'Uken Chudan-zuki', 83],
      [11, 'Hidari Hizakutsu', 'Migi Chudan Uchi-uke', 84],
      [12, 'Hachiji-dachi', 'Saken Chudan-zuki', 84],
      [13, 'Migi Hizakutsu', 'Hidari Chudan Uchi-uke', 85],
      [14, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 85],
      [15, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 86],
      [16, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 86],
      [17, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 87],
      [18, 'Hidari Ashi-zenkutsu', 'Ryosho Chudan Tsukami-uke', 87],
      [19, 'Hidari Ashi-dachi', 'Ryosho Tsukamiyose + Migi Sokuto Gedan-kekomi', 88],
      [20, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 88],
      [21, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 89],
      [22, 'Heisoku-dachi', 'Morote Jodan Age-uke', 89],
      [23, 'Migi Zenkutsu-dachi', 'Ryo-kentsui Chudan Hasami-uchi', 90],
      [24, 'Migi Zenkutsu-dachi', 'Uken Chudan-zuki', 90, 'Yori-ashi'],
      [25, 'Heisoku-dachi', 'Migi Sokumen Jodan Uchi-uke + Hidari Sokumen Gedan-uke', 91, 'Teil 1: Hidari Ashi-zenkutsu, Sasho Jodan Nagashi-uke + Migi Shuto Gedan-uchikomi'],
      [26, 'Kiba-dachi', 'Migi Sokumen Migi Gedan-barai', 91],
      [27, 'Kiba-dachi', 'Hidari Tekubi Hidari Sokumen Chudan Kake-uke', 92],
      [28, 'Kiba-dachi', 'Sasho-ni Migi Mae-enpi', 92, 'Teil 1: Hidari Ashi-dachi, Sasho-ni Migi Chudan Mikazuki-geri'],
      [29, 'Kiba-dachi', 'Migi Gedan-uke + Hidari Zenwan Mune-mae-kamae', 93],
      [30, 'Kiba-dachi', 'Hidari Gedan-uke + Migi Zenwan Mune-mae-kamae', 93],
      [31, 'Kiba-dachi', 'Migi Gedan-uke + Hidari Zenwan Mune-mae-kamae', 93],
      [32, 'Migi Ashi-zenkutsu', 'Ryoken Hidari Koshi-kamae', 93],
      [33, 'Migi Ashi-zenkutsu', 'Saken Jodan Uken Gedan Yama-zuki', 94],
      [34, 'Heisoku-dachi', 'Ryoken Migi Koshi-kamae', 94],
      [35, 'Hidari Ashi-zenkutsu', 'Uken Jodan Saken Gedan Yama-zuki', 95],
      [36, 'Heisoku-dachi', 'Ryoken Hidari Koshi-kamae', 95],
      [37, 'Migi Ashi-zenkutsu', 'Saken Jodan Uken Gedan Yama-zuki', 96],
      [38, 'Hidari Hizakutsu', 'Migi Gedan Sukui-uke', 96],
      [39, 'Migi Hizakutsu', 'Hidari Gedan Sukui-uke', 97],
      [40, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 97],
      [41, 'Migi-te Migi-ashi Uho-e', 'Rechte Hand und rechter Fuß nach rechts (90°-Drehung)', 98],
      [42, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 98],
    ],
    learn: `
      <p>Bassai Dai hat laut Buch <b>42 Bewegungen</b>. Kiai bei <b>19</b> (Sokuto Gedan-kekomi) und <b>42</b> (letzter Shuto-uke).</p>
      <ul>
        <li><b>Yoi</b>: Heisoku-dachi, die rechte Faust liegt in der leicht gebeugten linken Hand vor dem Unterbauch (nicht greifen).</li>
        <li>Bewegung 1: Sprungschritt nach vorne in Kosa-dachi, Soede-uchi-uke (Mittelfinger der linken Hand an der Innenseite des rechten Handgelenks); Oberkörper in Hanmi.</li>
        <li>Wechsel von „Nachteil“ zu „Vorteil“ (2→3): Der Name <b>Bassai</b> steht für das Gefühl, eine Festung zu durchbrechen; Fäuste kreuzen sich, eine Faust geht unter dem anderen Arm durch.</li>
        <li>Bewegung 6: <b>Sukui-uke</b> – schöpfend gegen einen Tritt, dann Bein anheben und Gegner aus dem Gleichgewicht bringen.</li>
        <li>8–13 in etwas breiterem <b>Hachiji-dachi</b> bzw. Hizakutsu; Bewegung 9 (Tate-shuto) langsam und kraftvoll.</li>
        <li>18 langsam: Tsukami-uke; 19: Greifen und Heranziehen + Kekomi (Kiai), Ziel knapp über dem Hüftknochen.</li>
        <li>22 → 23 ohne Pause: Morote Age-uke, dann <b>Hasami-uchi</b> (Zangenschlag) – der rechte Fuß gleitet (kein Stampfer).</li>
        <li>33, 35, 37: <b>Yama-zuki</b> („Bergfauststoß“, Form des Schriftzeichens 山); Ziele Jinchu und Myojo (unter dem Bauchnabel).</li>
        <li>38/39: Gedan Sukui-uke in Hizakutsu – Faust tiefer als Ellbogen.</li>
        <li>41: Migi-te Migi-ashi Uho-e – langsam, kraftvoll: Handgelenk greifen und Gegner aus dem Gleichgewicht ziehen.</li>
      </ul>`,
    facts(L) {
      L.mc('Bassai Dai: Wie ist die Yoi-Position?', ['Heisoku-dachi, rechte Faust in der leicht gebeugten linken Hand vor dem Unterbauch', 'Hachiji-dachi, Fäuste vor den Oberschenkeln', 'Heisoku-dachi, rechte Faust vor dem Kinn', 'Heisoku-dachi, linke Hand auf der linken Hüfte'], '', P(79));
      L.mc('Bassai Dai, Yoi: Was gilt für die linke Hand laut Karate-Do Kyohan?', ['Sie ist sanft gebeugt und umgreift die rechte Faust nicht', 'Sie umschließt die Faust fest', 'Sie liegt auf der Hüfte', 'Sie ist zur Faust geballt'], '', P(79));
      L.mc('Bassai Dai, Bewegung 1: Womit beginnt die Kata?', ['Mit einem Sprungschritt nach vorne in Migi Ashi-mae Kosa-dachi', 'Mit einem Schritt zurück in Kokutsu-dachi', 'Mit einem Stampfer in Kiba-dachi', 'Mit einem langsamen Gedan-barai'], '', P(79));
      L.mc('Bassai Dai, Bewegung 1: Wo liegt der Mittelfinger der linken Hand beim Soede-uchi-uke?', ['An der Innenseite des rechten Handgelenks', 'Am rechten Ellbogen', 'An der Stirn', 'An der linken Hüfte'], '', P(79));
      L.mc('Wofür steht laut Karate-Do Kyohan der Name BASSAI?', ['Für das Gefühl, eine Festung zu durchbrechen', 'Für den Blick in den Himmel', 'Für eine fliegende Schwalbe', 'Für einen Tempel'], '', P(80));
      L.mc('Bassai Dai, Bewegungen 2 → 3: Was beschreibt der Referenzpunkt?', ['Wechsel von einer Position des Nachteils (linker Block) in eine Position des Vorteils (rechter Block)', 'Ein Wurf über die Hüfte', 'Eine Ausweichbewegung nach hinten', 'Ein Doppelfauststoß'], '', P(80));
      L.mc('Bassai Dai, Bewegung 6: Was ist SUKUI-UKE?', ['Ein schöpfender Block nach unten mit der Außenseite des Handgelenks gegen einen Tritt', 'Ein Block mit beiden Händen über dem Kopf', 'Ein Handkantenschlag zum Hals', 'Ein Ellbogenschlag'], '', P(82));
      L.mc('Bassai Dai, Bewegungen 8–13: Was gilt für den Hachiji-dachi?', ['Er ist etwas breiter als üblich', 'Er ist schmaler als üblich', 'Er wird auf einem Bein ausgeführt', 'Die Füße sind geschlossen'], '', P(83));
      L.mc('Bassai Dai, Bewegung 9 (Hidari Tate-shuto Chudan-uke): Wie wird sie ausgeführt?', ['Langsam und kraftvoll', 'Schnell mit Kiai', 'Im Sprung', 'Mit Faust'], '', P(83));
      L.mc('Bassai Dai, Bewegung 18 (Ryosho Chudan Tsukami-uke): Wie wird sie ausgeführt?', ['Langsam und kraftvoll', 'Schnell, explosiv', 'Mit Sprung', 'Mit geschlossenen Fäusten'], '', P(87));
      L.mc('Bassai Dai, Bewegung 19: Wohin zielt der Sokuto Gedan-kekomi?', ['Knapp über den Hüftknochen', 'Auf das Kinn', 'Auf den Solarplexus', 'Auf den Fußrücken'], '', P(88));
      L.mc('Bassai Dai, Bewegung 22 (Morote Jodan Age-uke): Was gilt für den Oberkörper?', ['Er ist nicht seitlich (Hanmi), sondern gerade nach vorne gerichtet', 'Er ist vollständig seitlich in Hanmi', 'Er ist nach hinten gedreht', 'Er ist stark vorgebeugt'], '', P(89));
      L.mc('Bassai Dai, Bewegung 23: Was ist Ryo-kentsui Chudan Hasami-uchi?', ['Zangenartiger Schlag mit beiden Hammerfäusten zu beiden Seiten des Bauches', 'Doppelter Fauststoß Jodan', 'Doppelter Handkantenblock', 'Doppelter Ellbogenschlag'], '', P(90));
      L.mc('Bassai Dai, Bewegung 23: Wie bewegt sich der rechte Fuß?', ['Er gleitet nach vorne – kein Stampfen', 'Er stampft auf (Fumikomi)', 'Er bleibt stehen', 'Er springt'], '', P(90));
      L.mc('Bassai Dai, Bewegung 25: Wie werden Teil 1 und Teil 2 ausgeführt?', ['Teil 1 schnell, Teil 2 langsam und kraftvoll', 'Beide schnell', 'Beide langsam', 'Teil 1 langsam, Teil 2 schnell'], '', P(91));
      L.mc('Bassai Dai, Bewegung 27 (Kake-uke): Mit welchem Bild werden die Hände gezogen?', ['Wie beim Spannen eines Bogens', 'Wie beim Werfen', 'Wie beim Klatschen', 'Wie beim Rudern'], '', P(92));
      L.mc('Was bedeutet YAMA-ZUKI?', ['„Bergfauststoß“ – nach der Form des Schriftzeichens für Berg (山)', '„Schwalbenstoß“', '„Wellenstoß“', '„Himmelsstoß“'], '', P(94));
      L.mc('Bassai Dai, Yama-zuki: Welche Ziele nennt der Point?', ['Jinchu (über der Oberlippe) und Myojo (knapp unter dem Bauchnabel)', 'Schläfe und Knie', 'Solarplexus und Kinn', 'Hals und Leiste'], '', P(94));
      L.mc('Bassai Dai, Bewegungen 34 und 36: Wie werden sie ausgeführt?', ['Langsam, Hände und Füße gleichzeitig; Oberkörper nicht in Hanmi', 'Schnell mit Kiai', 'Mit Sprung', 'Mit Stampfer'], '', P(94));
      L.mc('Bassai Dai, Bewegungen 35 und 37: Mit welchem Gefühl wird aufgestampft?', ['Als würde man fest auf den vorderen Fuß des Gegners treten', 'Als würde man springen', 'Als würde man ausweichen', 'Als würde man den Boden fegen'], '', P(95));
      L.mc('Bassai Dai, Gedan Sukui-uke (38/39): Was muss für die Faust gelten?', ['Sie darf nicht höher als der Ellbogen sein', 'Sie muss über Kopfhöhe sein', 'Sie muss an der Hüfte bleiben', 'Sie muss geöffnet sein'], '', P(96));
      L.mc('Bassai Dai, Bewegung 41: Welche Bedeutung hat Migi-te Migi-ashi Uho-e?', ['Handgelenk des Gegners greifen und ihn aus dem Gleichgewicht ziehen', 'Einen Tritt blocken', 'Einen Fauststoß ausführen', 'Einen Sprung vorbereiten'], '', P(98));
    },
  };

  SK.kata['kanku-dai'] = {
    id: 'kanku-dai', name: 'Kanku Dai', moves: 65, kiai: [15, 65], firstPage: 101,
    yoi: 'Hachiji-dachi, offene Hände vor dem Unterbauch, rechte Hand schräg auf der linken (Ryote Kafukubu-mae)',
    naore: 'Drehung im Uhrzeigersinn auf dem rechten Fuß, Sukui mit dem rechten Unterarm, Arme kreuzen vor dem Gesicht, Hachiji-dachi, Fäuste vor den Oberschenkeln.',
    continuous: [[3, 4], [6, 7], [8, 9], [17, 18, 19], [22, 23, 24], [26, 27, 28], [29, 30, 31], [40, 41], [49, 50]],
    slow: [1, 5, 20, 25, 64],
    seq: [
      [1, 'Hachiji-dachi', 'Ryote Hitai-mae-ue', 101],
      [2, 'Hachiji-dachi', 'Ryote Kafukubu-mae', 101],
      [3, 'Migi Kokutsu-dachi', 'Hidari Haiwan Hidari Sokumen Jodan-uke + Usho Mune-mae-kamae', 102],
      [4, 'Hidari Kokutsu-dachi', 'Migi Haiwan Migi Sokumen Jodan-uke + Sasho Mune-mae-kamae', 102],
      [5, 'Hachiji-dachi', 'Hidari Tate-shuto Chudan-uke', 103],
      [6, 'Hachiji-dachi', 'Uken Chudan-zuki', 103],
      [7, 'Hidari Hizakutsu', 'Migi Chudan Uchi-uke', 104],
      [8, 'Hachiji-dachi', 'Saken Chudan-zuki', 104],
      [9, 'Migi Hizakutsu', 'Hidari Chudan Uchi-uke', 105],
      [10, 'Hidari Ashi-dachi', 'Ryoken Hidari Koshi-kamae', 105],
      [11, 'Hidari Ashi-dachi', 'Migi Uraken Jodan Yoko-mawashi-uchi + Migi Yoko-geri-keage', 105],
      [12, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 106],
      [13, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 106],
      [14, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 107],
      [15, 'Migi Zenkutsu-dachi', 'Sasho Chudan Osae-uke + Migi Chudan Shihon-nukite', 107],
      [16, 'Hidari Ashi-zenkutsu', 'Sasho Jodan-uke + Migi Shuto Jodan Soto-mawashi-uchi', 108, 'Gyaku-hanmi; zuvor Hidari Shuto Koho Gedan-barai'],
      [17, 'Hidari Ashi-dachi', 'Migi Jodan Mae-geri-keage', 108],
      [18, 'Migi Kokutsu-dachi', 'Migi Sokumen Jodan Uchi-uke + Hidari Sokumen Gedan-uke', 109],
      [19, 'Hidari Ashi-zenkutsu', 'Sasho Jodan Nagashi-uke + Migi Shuto Gedan-uchikomi', 109],
      [20, 'Hidari Ashi-mae Renoji-dachi', 'Saken Gedan (Uken Migi Koshi)', 110],
      [21, 'Hidari Ashi-zenkutsu', 'Sasho Jodan-uke + Migi Shuto Jodan Soto-mawashi-uchi', 110, 'Gyaku-hanmi'],
      [22, 'Hidari Ashi-dachi', 'Migi Jodan Mae-geri-keage', 111],
      [23, 'Migi Kokutsu-dachi', 'Migi Sokumen Jodan Uchi-uke + Hidari Sokumen Gedan-uke', 111],
      [24, 'Hidari Ashi-zenkutsu', 'Sasho Jodan Nagashi-uke + Migi Shuto Gedan-uchikomi', 112],
      [25, 'Hidari Ashi-mae Renoji-dachi', 'Saken Gedan (Uken Migi Koshi)', 112],
      [26, 'Migi Ashi-dachi', 'Ryoken Migi Koshi-kamae', 113],
      [27, 'Migi Ashi-dachi', 'Hidari Uraken Jodan Yoko-mawashi-uchi + Hidari Yoko-geri-keage', 113],
      [28, 'Hidari Zenkutsu-dachi', 'Sasho-ni Migi Mae-enpi', 113],
      [29, 'Hidari Ashi-dachi', 'Ryoken Hidari Koshi-kamae', 114],
      [30, 'Hidari Ashi-dachi', 'Migi Uraken Jodan Yoko-mawashi-uchi + Migi Yoko-geri-keage', 114],
      [31, 'Migi Zenkutsu-dachi', 'Usho-ni Hidari Mae-enpi', 114],
      [32, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 115],
      [33, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 115],
      [34, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 116],
      [35, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 116],
      [36, 'Hidari Ashi-zenkutsu', 'Sasho Jodan-uke + Migi Shuto Jodan Soto-mawashi-uchi', 117, 'Gyaku-hanmi; zuvor Hidari Shuto Gedan-barai'],
      [37, 'Hidari Ashi-dachi', 'Migi Jodan Mae-geri-keage', 117],
      [38, 'Migi Ashi-mae Kosa-dachi', 'Migi Uraken Tate-mawashi-uchi', 118],
      [39, 'Migi Zenkutsu-dachi', 'Migi Chudan Uchi-uke', 118],
      [40, 'Migi Zenkutsu-dachi', 'Hidari Chudan Gyaku-zuki', 119],
      [41, 'Migi Zenkutsu-dachi', 'Uken Chudan-zuki', 119],
      [42, 'Hidari Ashi-dachi', 'Sasho Soede Migi Jodan Ura-zuki + Migi Hiza-zuchi', 119],
      [43, 'Migi Ashi-zenkutsu', 'Ude-tate (Hände auf dem Boden)', 120],
      [44, 'Migi Kokutsu-dachi', 'Hidari Shuto Gedan-uke + Migi Shuto Mune-mae-kamae', 120, 'tiefer als üblich'],
      [45, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 121],
      [46, 'Hidari Zenkutsu-dachi', 'Hidari Chudan Uchi-uke', 121],
      [47, 'Hidari Zenkutsu-dachi', 'Migi Chudan Gyaku-zuki', 122],
      [48, 'Migi Zenkutsu-dachi', 'Migi Chudan Uchi-uke', 122],
      [49, 'Migi Zenkutsu-dachi', 'Hidari Chudan Gyaku-zuki', 122],
      [50, 'Migi Zenkutsu-dachi', 'Uken Chudan-zuki', 122],
      [51, 'Hidari Ashi-dachi', 'Ryoken Hidari Koshi-kamae', 123],
      [52, 'Hidari Ashi-dachi', 'Migi Uraken Jodan Yoko-mawashi-uchi + Migi Yoko-geri-keage', 123],
      [53, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 123],
      [54, 'Migi Zenkutsu-dachi', 'Sasho Chudan Osae-uke + Migi Chudan Shihon-nukite', 124],
      [55, 'Kiba-dachi', 'Hidari Uraken Hidari Sokumen Jodan Tate-mawashi-uchi', 124],
      [56, 'Kiba-dachi', 'Hidari Kentsui Chudan Uchi-mawashi-uchi', 125, 'Hidari-e Yori-ashi'],
      [57, 'Kiba-dachi', 'Hidari Sokumen Migi Mae-enpi (Sasho Migi Hiji-ate)', 125],
      [58, 'Kiba-dachi', 'Ryoken Hidari Koshi-kamae', 125],
      [59, 'Kiba-dachi', 'Migi Sokumen Migi Gedan-barai', 126],
      [60, 'Kiba-dachi', 'Hidari Zenwan Gedan-uke + Uken Furiage', 126],
      [61, 'Kiba-dachi', 'Uken Otoshi-zuki', 127],
      [62, 'Hachiji-dachi', 'Kaisho Jodan Kosa-uke', 127],
      [63, 'Migi Zenkutsu-dachi', 'Migi Ashi-jiku Migi-mawari (Drehung, Hände gekreuzt)', 127],
      [64, 'Migi Zenkutsu-dachi', 'Ryoken Mune-mae', 128],
      [65, 'Migi Zenkutsu-dachi', 'Nidan-geri + Migi Uraken Tate-mawashi-uchi', 128],
    ],
    learn: `
      <p>Kanku Dai hat laut Buch <b>65 Bewegungen</b>. Kiai bei <b>15</b> (Shihon-nukite) und <b>65</b> (Nidan-geri).</p>
      <ul>
        <li><b>Yoi</b>: Hachiji-dachi, offene Hände vor dem Unterbauch, rechte Hand schräg auf der linken, Daumen leicht auseinander (Ryote Kafukubu-mae).</li>
        <li>Bewegung 1: Hände langsam über die Stirn heben und durch die Öffnung in den Himmel schauen. Die Kata hieß früher <b>Kushanku</b>; der Name <b>Kanku</b> („in den Himmel schauen“) stammt von dieser Bewegung.</li>
        <li>Bewegung 2: Hände reißen auseinander und beschreiben einen großen Kreis – Symbol dafür, keine Waffen zu tragen; Sonne und Schatten, Yin und Yang.</li>
        <li>3+4 schnell; 5 (Tate-shuto) langsam und kraftvoll; 20 und 25 (Renoji-dachi, Gedan) langsam und kraftvoll.</li>
        <li>16/17, 21/22, 36/37: Abwehr am Handgelenk und Unterarm, dann Arm verdrehen und gegen das Ellbogengelenk treten.</li>
        <li>42: Kniestoß (Hiza-zuchi) + Ura-zuki zum Kinn; 43: <b>Ude-tate</b> – Hände am Boden in Form des Schriftzeichens für „acht“, Blick etwa 4 m nach vorne.</li>
        <li>44: Kokutsu-dachi tiefer als üblich.</li>
        <li>55: Arm nach außen verdrehen – entgegengesetzt zur Drehung in Heian Sandan.</li>
        <li>60: Gedan-uke mit Furiage – die rechte Hand hat keine eigene Technikbedeutung.</li>
        <li>62–64: Kaisho Jodan Kosa-uke, Drehung, umgekehrter Armhebel über die Schulter; 64 langsam.</li>
        <li>65: <b>Nidan-geri</b> mit Kiai, Landung in Zenkutsu-dachi mit Uraken.</li>
      </ul>`,
    facts(L) {
      L.mc('Wie hieß Kanku Dai früher?', ['Kushanku', 'Wanshu', 'Naihanchi', 'Pin An'], '', P(101));
      L.mc('Was bedeutet KANKU?', ['In den Himmel schauen', 'Fliegende Schwalbe', 'Festung durchbrechen', 'Eiserner Reiter'], '', P(101));
      L.mc('Kanku Dai, Bewegung 1: Wie wird sie ausgeführt?', ['Hände langsam über die Stirn heben und durch die Öffnung in den Himmel schauen', 'Schneller Doppelblock mit Kiai', 'Sprung nach vorne', 'Stampfer in Kiba-dachi'], '', P(101));
      L.mc('Kanku Dai, Bewegung 2: Welche Bedeutung hat der große Kreis der Hände laut Karate-Do Kyohan?', ['Keine Waffen zu tragen; zwei Teile, die wie Sonne und Schatten bzw. Yin und Yang zusammengehören', 'Den Gegner zu greifen', 'Einen Tritt abzulenken', 'Kraft für den Kiai zu sammeln'], '', P(101));
      L.mc('Kanku Dai, Yoi: Wie liegen die Hände?', ['Offen vor dem Unterbauch, rechte Hand schräg auf der linken, Daumen leicht auseinander', 'Als Fäuste vor den Oberschenkeln', 'Rechte Faust in der linken Hand vor dem Kinn', 'Linke Hand an der Hüfte'], '', P(101));
      L.mc('Kanku Dai, Bewegungen 3 und 4: Wie werden sie ausgeführt?', ['Schnell, in einer fließenden Bewegung', 'Langsam und kraftvoll', 'Mit Kiai', 'Mit Sprung'], '', P(102));
      L.mc('Kanku Dai, Bewegung 5 (Hidari Tate-shuto Chudan-uke): Wie wird sie ausgeführt?', ['Langsam und kraftvoll', 'Schnell mit Kiai', 'Im Sprung', 'Mit geschlossener Faust'], '', P(103));
      L.mc('Kanku Dai, Bewegungen 20 und 25 (Renoji-dachi, Gedan): Wie werden sie ausgeführt?', ['Langsam und kraftvoll', 'Schnell mit Kiai', 'Mit Sprung', 'Mit offenen Händen'], '', P(110));
      L.mc('Kanku Dai, Bewegung 42: Welche Techniken werden kombiniert?', ['Kniestoß (Hiza-zuchi) und Ura-zuki zum Kinn', 'Mae-geri und Oi-zuki', 'Yoko-geri und Uraken', 'Mikazuki-geri und Enpi'], '', P(119));
      L.mc('Kanku Dai, Bewegung 43 (Ude-tate): Wie liegen die Hände?', ['Auf dem Boden, Fingerspitzen nach innen – Form des Schriftzeichens für „acht“', 'Vor der Stirn gekreuzt', 'An den Hüften', 'Hinter dem Rücken'], '', P(120));
      L.mc('Kanku Dai, Bewegung 43: Wohin geht der Blick?', ['Etwa vier Meter nach vorne', 'Auf die eigenen Hände', 'Nach hinten', 'Zur Decke'], '', P(120));
      L.mc('Kanku Dai, Bewegung 43: Was ist laut Karate-Do Kyohan das Besondere?', ['Das Überraschungsmoment durch plötzliches Absenken des Körpers', 'Ein besonders hoher Sprung', 'Ein langsamer Atemzug', 'Ein Wurf'], '', P(120));
      L.mc('Kanku Dai, Bewegung 44: Was gilt für den Kokutsu-dachi?', ['Er ist tiefer als üblich', 'Er ist höher als üblich', 'Er hat keine Breite', 'Er wird auf einem Bein ausgeführt'], '', P(120));
      L.mc('Kanku Dai, Bewegung 55: Wie wird der rechte Arm verdreht – im Vergleich zu Heian Sandan?', ['Nach außen – entgegengesetzt zur Drehung in Heian Sandan', 'Genau wie in Heian Sandan', 'Gar nicht', 'Nur das Handgelenk wird gebeugt'], '', P(124));
      L.mc('Kanku Dai, Bewegung 60: Welche Bedeutung hat die nach oben schwingende rechte Faust (Uken Furiage)?', ['Keine eigene Technik – sie schwingt als Reaktion auf den linken Block mit', 'Ein Jodan-Block', 'Ein Aufwärtshaken', 'Ein Griff zum Kragen'], '', P(126));
      L.mc('Kanku Dai, Bewegungen 62–64: Welche Anwendung beschreibt der Meaning Point?', ['Jodan-Kreuzblock, Drehung und umgekehrter Armhebel über die rechte Schulter', 'Fußfeger und Wurf', 'Doppelter Fauststoß', 'Ausweichen und Kniestoß'], '', P(128));
      L.mc('Kanku Dai, Bewegung 65: Was ist NIDAN-GERI?', ['Doppeltritt im Sprung: linker Mae-geri, dann rechter Jodan-Mae-geri vor der Landung', 'Zwei Yoko-geri nacheinander', 'Mae-geri und Mawashi-geri am Boden', 'Ein Tritt nach hinten'], '', P(128));
      L.mc('Kanku Dai: Wie wird das Ende (Naore) beschrieben?', ['Langsam, Hände und Füße gleichzeitig, ohne die Hüfthöhe zu verändern – Arme schließen sich im großen Kreis', 'Schnell mit Kiai', 'Mit Sprung zurück in Yoi', 'Mit Verbeugung in Seiza'], '', P(129));
    },
  };

  SK.kata['jion'] = {
    id: 'jion', name: 'Jion', moves: 47, kiai: [17, 47], firstPage: 132,
    yoi: 'Heisoku-dachi, rechte Faust vor dem Kinn, von der linken Hand leicht umhüllt (Sasho Uken Shita-ago-mae)',
    naore: 'Der linke Fuß bleibt, der rechte Fuß geht neben den linken zurück in die Ausgangsposition.',
    continuous: [[3, 4], [5, 6], [8, 9], [10, 11], [12, 13], [14, 15], [35, 36, 37]],
    slow: [2, 7, 30, 46],
    seq: [
      [1, 'Migi Zenkutsu-dachi', 'Migi Chudan Uchi-uke + Hidari Gedan-uke', 133],
      [2, 'Hidari Zenkutsu-dachi', 'Ryoken Chudan Kakiwake-uke', 133],
      [3, 'Hidari Ashi-dachi', 'Migi Chudan Mae-geri-keage', 134],
      [4, 'Migi Zenkutsu-dachi', 'Uken Chudan-zuki', 134],
      [5, 'Migi Zenkutsu-dachi', 'Saken Chudan-zuki', 134],
      [6, 'Migi Zenkutsu-dachi', 'Uken Chudan-zuki', 135],
      [7, 'Migi Zenkutsu-dachi', 'Ryoken Chudan Kakiwake-uke', 135],
      [8, 'Migi Ashi-dachi', 'Hidari Chudan Mae-geri-keage', 135],
      [9, 'Hidari Zenkutsu-dachi', 'Saken Chudan-zuki', 136],
      [10, 'Hidari Zenkutsu-dachi', 'Uken Chudan-zuki', 136],
      [11, 'Hidari Zenkutsu-dachi', 'Saken Chudan-zuki', 136],
      [12, 'Hidari Zenkutsu-dachi', 'Hidari Jodan Age-uke', 137],
      [13, 'Hidari Zenkutsu-dachi', 'Migi Chudan Gyaku-zuki', 137],
      [14, 'Migi Zenkutsu-dachi', 'Migi Jodan Age-uke', 138],
      [15, 'Migi Zenkutsu-dachi', 'Hidari Chudan Gyaku-zuki', 138],
      [16, 'Hidari Zenkutsu-dachi', 'Hidari Jodan Age-uke', 139],
      [17, 'Migi Zenkutsu-dachi', 'Migi Chudan Oi-zuki', 139],
      [18, 'Migi Kokutsu-dachi', 'Migi Sokumen Jodan Uchi-uke + Hidari Sokumen Gedan-uke', 140],
      [19, 'Kiba-dachi', 'Uken Kagi-zuki', 140, 'Hidari-e Yori-ashi'],
      [20, 'Hidari Kokutsu-dachi', 'Hidari Sokumen Jodan Uchi-uke + Migi Sokumen Gedan-uke', 141],
      [21, 'Kiba-dachi', 'Saken Kagi-zuki', 141, 'Migi-e Yori-ashi'],
      [22, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 141],
      [23, 'Kiba-dachi', 'Migi Teisho Migi Sokumen Chudan Yoko-uke', 142],
      [24, 'Kiba-dachi', 'Hidari Teisho Hidari Sokumen Chudan Yoko-uke', 142],
      [25, 'Kiba-dachi', 'Migi Teisho Migi Sokumen Chudan Yoko-uke', 143],
      [26, 'Migi Kokutsu-dachi', 'Migi Sokumen Jodan Uchi-uke + Hidari Sokumen Gedan-uke', 143],
      [27, 'Heisoku-dachi', 'Hidari Sokumen Jodan Morote-uke', 144],
      [28, 'Hidari Kokutsu-dachi', 'Hidari Sokumen Jodan Uchi-uke + Migi Sokumen Gedan-uke', 144],
      [29, 'Heisoku-dachi', 'Migi Sokumen Jodan Morote-uke', 145],
      [30, 'Heisoku-dachi', 'Ryoken Ryogawa Gedan-kakiwake', 145],
      [31, 'Migi Ashi-mae Kosa-dachi', 'Gedan Kosa-uke', 145],
      [32, 'Migi Zenkutsu-dachi', 'Ryoken Ryogawa Gedan-kakiwake', 146],
      [33, 'Hidari Zenkutsu-dachi', 'Ryoken Chudan Kakiwake-uke', 146],
      [34, 'Migi Zenkutsu-dachi', 'Ryoken Jodan Kosa-uke', 147],
      [35, 'Migi Zenkutsu-dachi', 'Migi Uraken Jodan-uchi', 147],
      [36, 'Migi Zenkutsu-dachi', 'Saken Chudan Tsuki-uke + Uken Migi Kata-ue-kamae', 148],
      [37, 'Migi Zenkutsu-dachi', 'Migi Uraken Jodan-uchi + Hidari Zenwan Mune-mae Suihei-kamae', 148],
      [38, 'Hidari Zenkutsu-dachi', 'Hidari Chudan Uchi-uke', 148],
      [39, 'Migi Zenkutsu-dachi', 'Migi Chudan Oi-zuki', 149],
      [40, 'Migi Zenkutsu-dachi', 'Migi Chudan Uchi-uke', 149],
      [41, 'Hidari Zenkutsu-dachi', 'Hidari Chudan Oi-zuki', 149],
      [42, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 150],
      [43, 'Kiba-dachi', 'Migi Zenwan Migi Sokumen Chudan Uchiotoshi', 150, 'Migi Ashi Fumikomi'],
      [44, 'Kiba-dachi', 'Hidari Zenwan Hidari Sokumen Chudan Uchiotoshi', 151, 'Hidari Ashi Fumikomi'],
      [45, 'Kiba-dachi', 'Migi Zenwan Migi Sokumen Chudan Uchiotoshi', 151, 'Migi Ashi Fumikomi'],
      [46, 'Kiba-dachi', 'Uken Migi Chichi-mae + Saken Hidari Sokumen Chudan-zuki', 152, 'Hidari-e Yori-ashi'],
      [47, 'Kiba-dachi', 'Saken Hidari Chichi-mae + Uken Migi Sokumen Chudan-zuki', 153, 'Migi-e Yori-ashi'],
    ],
    learn: `
      <p>Jion hat laut Buch <b>47 Bewegungen</b>. Kiai bei <b>17</b> (Oi-zuki) und <b>47</b> (seitlicher Fauststoß in Kiba-dachi).</p>
      <ul>
        <li><b>Yoi</b>: Heisoku-dachi, rechte Faust vor dem Kinn, von der linken Hand leicht umhüllt; Ellbogen leicht gebeugt.</li>
        <li>Bewegung 1: Linker Fuß gleitet zurück – Uchi-uke und Gedan-uke gleichzeitig.</li>
        <li>2 und 7: Kakiwake-uke langsam und kraftvoll, rechte Faust beim Kreuzen oben.</li>
        <li>„In einem Atemzug“ (nach Best Karate): 3+4, 5+6, 8+9, 10+11; ebenso 12+13 und 14+15.</li>
        <li>18–21: Manji-artige Abwehr (Jodan-uchi-uke + Gedan-uke) und <b>Kagi-zuki</b> mit Yori-ashi.</li>
        <li>23–25: <b>Teisho Yoko-uke</b> mit Hüftdrehung; drei gleiche Techniken – Kontrast in Tempo und Kraft.</li>
        <li>30: Gedan-kakiwake langsam. 31–34 (Gedan-, Chudan-, Jodan-Abwehr) sind laut Buch der wichtigste Teil der Kata.</li>
        <li>34: Bei Jodan Kosa-uke ist die vordere Hand immer auf der Seite des vorderen Fußes.</li>
        <li>35–37 schnell und fließend (Uraken, Tsuki-uke, Uraken).</li>
        <li>43–45: <b>Uchiotoshi</b> mit Stampfer; drei gleiche Techniken – Kontrast in Tempo und Kraft.</li>
        <li>46: langsam und kraftvoll – Greifen und seitlicher Fauststoß.</li>
      </ul>`,
    facts(L) {
      L.mc('Jion: Wie ist die Yoi-Position?', ['Heisoku-dachi, rechte Faust vor dem Kinn, von der linken Hand leicht umhüllt', 'Heisoku-dachi, Faust in der Hand vor dem Unterbauch', 'Hachiji-dachi, offene Hände vor dem Unterbauch', 'Heisoku-dachi, linke Hand auf der Hüfte'], '', P(132));
      L.mc('Jion, Bewegung 1: Wie entsteht der Migi Zenkutsu-dachi?', ['Der linke Fuß gleitet nach hinten', 'Der rechte Fuß macht einen Schritt nach vorne', 'Mit einem Sprung', 'Mit Stampfer'], '', P(133));
      L.mc('Jion, Kakiwake-uke (Bewegung 2): Wie wird er ausgeführt?', ['Langsam und kraftvoll mit dynamischer Spannung', 'Schnell mit Kiai', 'Mit offenen Händen', 'Im Sprung'], '', P(133));
      L.mc('Jion: Wie sollen laut Best Karate z. B. die Bewegungen 3 und 4 ausgeführt werden?', ['In einem einzigen Atemzug', 'Mit Pause dazwischen', 'Sehr langsam', 'Mit Kiai bei jeder Technik'], '', P(134));
      L.mc('Jion, Bewegungen 23–25: Womit wird geblockt?', ['Mit dem Handballen (Teisho) seitlich', 'Mit der Handkante', 'Mit dem Ellbogen', 'Mit beiden Fäusten gekreuzt'], '', P(142));
      L.mc('Jion, Bewegungen 23–25 und 43–45: Was gilt für die drei gleichen Techniken?', ['Es soll ein Kontrast in Tempo und Kraft zwischen ihnen bestehen', 'Alle drei exakt gleich', 'Nur die erste mit Kraft', 'Die mittlere mit Kiai'], '', P(143));
      L.mc('Jion, Bewegung 30 (Ryoken Ryogawa Gedan-kakiwake): Wie wird sie ausgeführt?', ['Langsam – Arme hebeln sich nach unten auseinander', 'Schnell mit Kiai', 'Mit Sprung', 'Mit offenen Händen'], '', P(145));
      L.mc('Jion, Bewegung 31: Wie wird Migi Ashi-mae Kosa-dachi erreicht?', ['Mit einem Sprungschritt nach vorne', 'Durch langsames Kreuzen', 'Durch Drehung um 180°', 'Rückwärts'], '', P(145));
      L.mc('Jion: Welche Bewegungen bezeichnet das Buch als den wichtigsten Teil der Kata?', ['31 bis 34 (Abwehr Gedan, Chudan, Jodan)', '1 bis 4', '23 bis 25', '46 und 47'], '', P(147));
      L.mc('Jion, Bewegung 34 (Jodan Kosa-uke): Welche Hand ist vorne?', ['Immer die Hand der Seite des vorderen Fußes – hier die rechte', 'Immer die linke Hand', 'Immer die rechte Hand, egal welcher Fuß vorne ist', 'Die Hände werden nicht gekreuzt'], '', P(147));
      L.mc('Jion, Bewegungen 35–37: Wie werden sie ausgeführt?', ['Schnell, in einer fließenden Bewegung', 'Langsam und kraftvoll', 'Mit Kiai bei jeder Technik', 'Mit Sprung'], '', P(148));
      L.mc('Jion, Bewegungen 43–45: Welche Technik wird mit Stampfer ausgeführt?', ['Zenwan Chudan Uchiotoshi (Unterarm schlägt nach unten)', 'Furi-enpi', 'Gedan-barai', 'Kagi-zuki'], '', P(150));
      L.mc('Jion, Bewegung 46: Wie wird sie ausgeführt und was bedeutet sie?', ['Langsam und kraftvoll – Greifen des Fauststoßes und seitlicher Fauststoß in die Flanke', 'Schnell mit Kiai – doppelter Block', 'Mit Sprung – Doppeltritt', 'Langsam – Atemübung'], '', P(152));
    },
  };

  SK.kata['enpi'] = {
    id: 'enpi', name: 'Enpi', moves: 37, kiai: [15, 36], firstPage: 156,
    yoi: 'Heisoku-dachi, linke Hand an der linken Hüfte, die rechte Faust berührt die linke Handfläche (Sasho Uken Hidari Koshi)',
    naore: 'Der rechte Fuß bleibt, der linke Fuß geht neben den rechten zurück; Hände wie zu Beginn.',
    continuous: [[17, 18]],
    slow: [14, 16, 30, 31, 32, 33],
    seq: [
      [1, 'Migi Ashi Orishiki Hidari Hiza-tate', 'Migi Zenwan Gedan-barai + Hidari Zenwan Suigetsu-mae-kamae', 156, 'Knien auf dem rechten Bein'],
      [2, 'Hachiji-dachi', 'Ryoken Hidari Koshi-kamae', 156],
      [3, 'Migi Ashi-zenkutsu', 'Migi Gedan-barai', 157],
      [4, 'Kiba-dachi', 'Hidari Zenwan Mizunagare-no-kamae', 157],
      [5, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 157],
      [6, 'Hidari Zenkutsu-dachi', 'Migi Jodan Age-zuki', 158],
      [7, 'Migi Ashi-mae Kosa-dachi', 'Saken Gedan-zuki (Uken Hidari Kata-mae-ue)', 158],
      [8, 'Hidari Hizakutsu', 'Migi Gedan-barai', 159],
      [9, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 159],
      [10, 'Hidari Zenkutsu-dachi', 'Migi Jodan Age-zuki', 160],
      [11, 'Migi Ashi-mae Kosa-dachi', 'Saken Gedan-zuki (Uken Hidari Kata-mae-ue)', 160],
      [12, 'Hidari Hizakutsu', 'Migi Gedan-barai', 161],
      [13, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 161],
      [14, 'Kiba-dachi', 'Sasho Hidari Naname-mae-ue', 162],
      [15, 'Hidari Ashi-dachi', 'Migi Tekubi Sasho-uchi', 162],
      [16, 'Kiba-dachi', 'Hidari Tate-shuto Chudan-uke', 163],
      [17, 'Kiba-dachi', 'Uken Chudan-zuki', 163],
      [18, 'Kiba-dachi', 'Saken Chudan-zuki', 164],
      [19, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 164],
      [20, 'Hidari Zenkutsu-dachi', 'Migi Jodan Age-zuki', 164],
      [21, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 165],
      [22, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 165],
      [23, 'Migi Kokutsu-dachi', 'Uken Chudan-zuki', 165],
      [24, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 166],
      [25, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 166],
      [26, 'Hidari Zenkutsu-dachi', 'Migi Jodan Age-zuki', 166],
      [27, 'Migi Ashi-mae Kosa-dachi', 'Saken Gedan-zuki (Uken Hidari Kata-mae-ue)', 167],
      [28, 'Hidari Hizakutsu', 'Migi Gedan-barai', 167],
      [29, 'Hidari Zenkutsu-dachi', 'Hidari Gedan-barai', 168],
      [30, 'Hidari Zenkutsu-dachi', 'Migi Teisho Chudan Oshiage-uke', 168],
      [31, 'Migi Zenkutsu-dachi', 'Migi Teisho Oshiage-uke + Hidari Teisho Oshisage-uke', 169],
      [32, 'Hidari Zenkutsu-dachi', 'Hidari Teisho Oshiage-uke + Migi Teisho Oshisage-uke', 169],
      [33, 'Migi Zenkutsu-dachi', 'Migi Teisho Oshiage-uke + Hidari Teisho Oshisage-uke', 170],
      [34, 'Hidari Kokutsu-dachi', 'Uken Gedan-kamae', 170, 'Yori-ashi gimi ni'],
      [35, 'Migi Ashi-mae Fudo-dachi', 'Usho Gedan Sasho Jodan Tsukami-uke', 171, 'Yori-ashi'],
      [36, 'Hidari Kokutsu-dachi', 'Migi Shuto Chudan-uke', 171, 'zuvor Hidari Kaiten-tobi (Drehsprung)'],
      [37, 'Migi Kokutsu-dachi', 'Hidari Shuto Chudan-uke', 172],
    ],
    learn: `
      <p>Enpi hat laut Buch <b>37 Bewegungen</b>. Kiai bei <b>15</b> (Handgelenk in die Handfläche) und <b>36</b> (Drehsprung).</p>
      <ul>
        <li><b>Yoi</b>: Heisoku-dachi, linke Hand an der linken Hüfte, die rechte Faust berührt die linke Handfläche.</li>
        <li>Bewegung 1: Knien auf dem rechten Bein (<b>Orishiki</b>), linkes Knie aufgestellt – Fegen des gegnerischen Beins, Wurfansatz.</li>
        <li>Die Kata hieß früher <b>Wanshu</b>; <b>Enpi</b> bedeutet „<b>fliegende Schwalbe</b>“ – nach den schnellen Richtungswechseln der Bewegungen 6–8, die mehrfach wiederkehren.</li>
        <li>Age-zuki (6, 10, 20, 26): Block eines linken Jodan-Fauststoßes und gleichzeitiger Stoß zum Kinn.</li>
        <li>Gedan-zuki (7): Ziel ist der Bereich unter dem Bauchnabel (<b>Tanden</b>).</li>
        <li>Hizakutsu mit Gedan-barai (8): sich aus dem Griff am Handgelenk befreien.</li>
        <li>14: linke Hand und linker Fuß bewegen sich langsam und groß gemeinsam; 15: rechtes Handgelenk schlägt in die linke Handfläche (Kiai).</li>
        <li>17+18: <b>Ren-zuki</b>.</li>
        <li>30–33: <b>Teisho</b>-Techniken (Oshiage-/Oshisage-uke) langsam und kraftvoll.</li>
        <li>35: <b>Fudo-dachi</b>; der Raum zwischen Daumen und Zeigefinger heißt „Tigermaul“ (<b>Koko</b>).</li>
        <li>36: Drehsprung wie im Schneidersitz in der Luft, Kiai während des Sprungs – Gegner auf die Schultern heben und werfen.</li>
      </ul>`,
    facts(L) {
      L.mc('Wie hieß Enpi früher?', ['Wanshu', 'Kushanku', 'Naihanchi', 'Pin An'], '', P(159));
      L.mc('Was bedeutet ENPI?', ['Fliegende Schwalbe', 'In den Himmel schauen', 'Festung durchbrechen', 'Tempelglocke'], '', P(159));
      L.mc('Woher kommt laut Karate-Do Kyohan der Name Enpi?', ['Von den schnellen Richtungswechseln (Bewegungen 6–8), die an den Flug einer Schwalbe erinnern', 'Von einem Sprung zu Beginn', 'Von langsamen Kreisbewegungen', 'Vom Ort ihrer Entstehung'], '', P(159));
      L.mc('Enpi: Wie ist die Yoi-Position?', ['Heisoku-dachi, linke Hand an der linken Hüfte, rechte Faust berührt die linke Handfläche', 'Heisoku-dachi, rechte Faust vor dem Kinn', 'Hachiji-dachi, Fäuste vor den Oberschenkeln', 'Heisoku-dachi, Hände vor dem Unterbauch'], '', P(156));
      L.mc('Enpi, Bewegung 1: In welcher Position beginnt die Kata?', ['Kniend auf dem rechten Bein, linkes Knie aufgestellt (Orishiki)', 'Im Sprung', 'In Kiba-dachi mit Stampfer', 'In Neko-ashi-dachi'], '', P(156));
      L.mc('Enpi, Bewegung 1: Was beschreibt der Referenzpunkt nach Karate-Do Kyohan?', ['Das Bein des Gegners fegen, während die linke Hand ihn herunterzieht – Ansatz eines Wurfs', 'Einen Fauststoß zum Kopf', 'Einen Block gegen einen Stock', 'Eine Atemübung'], '', P(156));
      L.mc('Enpi, Bewegung 6 (Migi Jodan Age-zuki): Welche Anwendung nennt der Point?', ['Block eines linken Jodan-Fauststoßes mit dem Unterarm und gleichzeitiger Stoß aufwärts zum Kinn', 'Fußfeger', 'Ellbogenschlag zur Seite', 'Greifen des Fußes'], '', P(158));
      L.mc('Enpi, Bewegung 7: Wohin zielt der Saken Gedan-zuki laut Karate-Do Kyohan?', ['Auf den Bereich unter dem Bauchnabel (Tanden)', 'Auf das Knie', 'Auf den Solarplexus', 'Auf das Kinn'], '', P(158));
      L.mc('Enpi, Bewegung 8 (Hizakutsu, Gedan-barai): Welche Anwendung nennt der Point?', ['Befreiung der gegriffenen linken Faust durch Schlag auf das Handgelenk des Gegners', 'Block eines Mawashi-geri', 'Fußfeger', 'Kniestoß'], '', P(159));
      L.mc('Enpi, Bewegung 14: Wie bewegen sich linke Hand und linker Fuß?', ['Gemeinsam, groß, langsam und dynamisch – die Augen folgen der Handfläche', 'Schnell nacheinander', 'Die Hand bleibt, nur der Fuß bewegt sich', 'Mit Sprung'], '', P(162));
      L.mc('Enpi, Bewegung 15: Was trifft die linke Handfläche?', ['Das rechte Handgelenk (Migi Tekubi Sasho-uchi)', 'Den rechten Fuß', 'Den rechten Ellbogen', 'Das rechte Knie'], '', P(162));
      L.mc('Enpi, Bewegung 16 (Tate-shuto): Wie wird sie ausgeführt?', ['Beide Hände bewegen sich gemeinsam langsam und dynamisch', 'Schnell mit Kiai', 'Mit Sprung', 'Mit Stampfer'], '', P(163));
      L.mc('Enpi, Bewegungen 30–33 (Teisho-Abwehren): Wie werden sie ausgeführt?', ['Langsam und kraftvoll, Hände und Füße im Einklang', 'Schnell und locker', 'Mit Kiai', 'Im Sprung'], '', P(168));
      L.mc('Was bezeichnet KOKO („Tigermaul“) in Enpi, Bewegung 35?', ['Den Raum zwischen Daumen und Zeigefinger', 'Den Handballen', 'Die Faustrückseite', 'Den Fußballen'], '', P(171));
      L.mc('Enpi, Bewegung 35: In welchem Stand wird Tsukami-uke ausgeführt?', ['Migi Ashi-mae Fudo-dachi', 'Kiba-dachi', 'Heisoku-dachi', 'Neko-ashi-dachi'], '', P(171));
      L.mc('Enpi, Bewegung 36: Wann wird der Kiai ausgeführt?', ['Während des Drehsprungs', 'Erst nach der Landung beim Shuto-uke', 'Vor dem Absprung', 'Gar nicht'], '', P(171));
      L.mc('Enpi, Bewegungen 35/36: Welche Anwendung beschreibt der Meaning Point?', ['Gegner am Kragen greifen, Hand zwischen die Beine, auf die Schultern heben und werfen', 'Doppelter Fußfeger', 'Armhebel am Boden', 'Kniestoß zum Kopf'], '', P(171));
    },
  };
})();
