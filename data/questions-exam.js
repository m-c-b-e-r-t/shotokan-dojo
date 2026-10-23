/* Fragen zu den DJKB-Prüfungen. g = Grad, für den die Frage in der Prüfungssimulation besonders relevant ist. */
(function () {
  'use strict';
  const S = SK.sources;
  const Q = (lesson, src, g) => SK.qb(lesson, src, g ? { g } : null);
  let L;

  // ---------- Gürtel & Fristen ----------
  L = Q('pr-allgemein', S.vo);
  L.mc('Welche Gürtelfarbe gehört im DJKB zum 9. Kyu?', ['Weiß', 'Gelb', 'Orange', 'Grün'], '');
  L.mc('Welche Gürtelfarbe gehört zum 8. Kyu?', ['Gelb', 'Weiß', 'Orange', 'Grün'], '');
  L.mc('Welche Gürtelfarbe gehört zum 7. Kyu?', ['Orange', 'Gelb', 'Grün', 'Violett'], '');
  L.mc('Welche Gürtelfarbe gehört zum 6. Kyu?', ['Grün', 'Orange', 'Violett', 'Blau'], '');
  L.multi('Welche Kyu-Grade tragen im DJKB einen violetten Gürtel?', ['5. Kyu', '4. Kyu'], ['6. Kyu', '3. Kyu'], '');
  L.multi('Welche Kyu-Grade tragen im DJKB einen braunen Gürtel?', ['3. Kyu', '2. Kyu', '1. Kyu'], ['4. Kyu', '5. Kyu'], '');
  L.order('Ordne die Gürtelfarben vom 9. Kyu aufwärts:', ['Weiß', 'Gelb', 'Orange', 'Grün', 'Violett', 'Braun', 'Schwarz'], '');
  L.mc('Wie lange ist die Mindestvorbereitungszeit zum 9. Kyu (ab 13 Jahren)?', ['Mindestens 3 Monate', '1 Monat', '6 Monate', '1 Jahr'], '');
  L.mc('Wie lange ist die Vorbereitungszeit vom 6. zum 5. Kyu (ab 13 Jahren)?', ['4 Monate', '3 Monate', '6 Monate', '10 Monate'], '');
  L.mc('Wie lange ist laut Verfahrensordnung 2024 die Vorbereitungszeit zum 3., 2. und 1. Kyu (ab 13 Jahren)?', ['Jeweils 6 Monate', 'Jeweils 3 Monate', 'Jeweils 4 Monate', 'Jeweils 1 Jahr'], '');
  L.mc('Wie lange ist die Vorbereitungszeit für Kinder bis 12 Jahre zum 3.–1. Kyu?', ['Mindestens 10 Monate', 'Mindestens 3 Monate', 'Mindestens 6 Monate', 'Mindestens 2 Jahre'], '');
  L.mc('Welches Trainingspensum liegt den Vorbereitungszeiten zugrunde?', ['Ununterbrochenes Training mindestens 2-mal wöchentlich', '1-mal im Monat', 'Täglich', 'Keine Vorgabe'], '');
  L.mc('Wann kann eine nicht bestandene Kyu-Prüfung frühestens wiederholt werden?', ['Nach Ablauf eines Monats', 'Sofort am selben Tag', 'Nach einem Jahr', 'Nach 6 Monaten'], '');
  L.mc('Was gilt nach dreimaligem Nichtbestehen desselben Kyu-Grades?', ['Eine weitere Prüfung ist erst in einem Jahr möglich', 'Keine weitere Prüfung mehr möglich', 'Nach einem Monat erneut', 'Man wird zurückgestuft'], '');
  L.mc('Gibt es für Kyu-Prüfungen eine Altersbegrenzung?', ['Nein – für Kinder gelten aber besondere Hinweise', 'Ja, ab 16 Jahren', 'Ja, ab 8 Jahren', 'Ja, bis 60 Jahre'], '');
  L.mc('Wie viele Prüflinge sollen laut Empfehlung gleichzeitig geprüft werden?', ['4–6', '1–2', '10–12', 'Beliebig viele'], '');
  L.mc('Wer sagt in der Prüfung die Prüfungsinhalte an?', ['Der Prüfer', 'Der Prüfling selbst', 'Ein Zuschauer', 'Niemand – alles muss auswendig sein'], '');
  L.mc('Was passiert, wenn jemand direkt zum 8. Kyu antritt, die Leistung aber nicht reicht?', ['Bei ausreichender Leistung kann der 9. Kyu bescheinigt werden', 'Die Prüfung ist automatisch bestanden', 'Man muss ein Jahr warten', 'Man erhält den 7. Kyu'], '');
  L.mc('Welchen Gürtel muss ein Mitglied tragen?', ['Den des zuletzt erworbenen Grades', 'Einen weißen Gürtel', 'Einen beliebigen Gürtel', 'Den Gürtel des angestrebten Grades'], '');
  L.mc('Welche Kyu-Grade bilden die Stufe I der Prüfungsordnung?', ['9., 8. und 7. Kyu', '6., 5. und 4. Kyu', '3., 2. und 1. Kyu', 'Nur der 9. Kyu'], '', S.po);
  L.mc('Welche Kyu-Grade bilden die Stufe II der Prüfungsordnung?', ['6., 5. und 4. Kyu', '9., 8. und 7. Kyu', '3., 2. und 1. Kyu', '4. bis 1. Kyu'], '', S.po);
  L.mc('Was ist für eine Kyu-Prüfung u. a. vorzulegen?', ['Ein gültiger DJKB-Ausweis mit gültiger Jahressichtmarke', 'Ein ärztliches Attest', 'Ein Kata-Video', 'Eine Empfehlung der JKA'], '');

  // ---------- Prüfungs-Kata ----------
  const kataQ = [
    ['9kyu', 'Keine Kata (entfällt)', ['Heian Shodan', 'Taikyoku Shodan als Prüfungs-Kata', 'Tekki Shodan']],
    ['8kyu', 'Heian Shodan', ['Heian Nidan', 'Taikyoku Shodan', 'Tekki Shodan']],
    ['7kyu', 'Heian Nidan', ['Heian Shodan', 'Heian Sandan', 'Tekki Shodan']],
    ['6kyu', 'Heian Sandan', ['Heian Nidan', 'Heian Yondan', 'Bassai Dai']],
    ['5kyu', 'Heian Yondan', ['Heian Sandan', 'Heian Godan', 'Tekki Shodan']],
    ['4kyu', 'Heian Godan', ['Heian Yondan', 'Tekki Shodan', 'Bassai Dai']],
    ['3kyu', 'Tekki Shodan', ['Heian Godan', 'Bassai Dai', 'Tekki Nidan']],
  ];
  kataQ.forEach(([g, right, wrong]) => {
    const grade = SK.grades.find((x) => x.id === g);
    Q('pr-kata', S.po, g).mc(`Welche Kata wird zum ${grade.name} (${grade.belt}) geprüft?`, [right].concat(wrong), '');
  });
  L = Q('pr-kata', S.po, '2kyu');
  L.multi('Welche Kata gehören zu den fünf Sentei-Kata der DJKB-Prüfungsordnung?', ['Bassai Dai', 'Kanku Dai', 'Jion', 'Enpi', 'Hangetsu'], ['Tekki Shodan', 'Gankaku'], '');
  L.mc('Welche Kata wird zum 2. Kyu geprüft?', ['Eine Sentei-Kata nach Wahl des Prüflings', 'Tekki Shodan', 'Heian Godan', 'Eine Kata nach Wahl des Prüfers aus allen Kata'], '');
  L = Q('pr-kata', S.po, '1kyu');
  L.mc('Was gilt für die Kata zum 1. Kyu?', ['Eine Sentei-Kata nach Wahl – auch dieselbe wie zum 2. Kyu ist möglich', 'Es muss eine andere Kata als zum 2. Kyu sein', 'Tekki Nidan ist Pflicht', 'Der Prüfer wählt aus allen Heian'], '');
  L = Q('pr-kata', S.po, '1dan');
  L.mc('Welche Kata werden zum 1. Dan gezeigt?', ['Sentei-Kata nach Wahl und eine vom Prüfer angegebene Kata aus Heian 1–5 oder Tekki Shodan', 'Nur eine Tokui-Kata', 'Drei Sentei-Kata', 'Nur Tekki Shodan bis Sandan'], '');
  L = Q('pr-kata', S.po, '2dan');
  L.multi('Aus welchen Kata kann der Prüfling zum 2. Dan seine Wahl-Kata zeigen?', ['Bassai Sho', 'Kanku Sho', 'Nijushiho', 'Jitte', 'Chinte', 'Meikyo', 'Gankaku', 'Sochin'], ['Unsu', 'Gojushiho Dai'], '');
  L.mc('Aus welchen Kata gibt der Prüfer zum 2. Dan eine Kata an?', ['Heian 1–5, Tekki Shodan, Tekki Nidan und Sentei-Kata', 'Nur Heian 1–5', 'Nur Sentei-Kata', 'Unsu und Gojushiho'], '');
  L = Q('pr-kata', S.po, '3dan');
  L.multi('Welche Kata dürfen zum 3. Dan NICHT als Tokui-Kata gezeigt werden?', ['Unsu', 'Gojushiho Sho', 'Gojushiho Dai'], ['Sochin', 'Nijushiho'], 'Außerdem keine bereits bei einer früheren Dan-Prüfung gezeigte Kata.');
  L.mc('Was bedeutet „Tokui-Kata“?', ['Lieblings-/Spezialkata, frei gewählt', 'Pflichtkata', 'Vom Prüfer gewählte Kata', 'Kata für Kinder'], 'Theoriebegriff zum 1. Kyu.');
  L.mc('Was bedeutet „Sentei-Kata“?', ['Ausgewählte Kata – die festgelegte Auswahl, aus der ab dem 2. Kyu gewählt wird', 'Die fünf Heian-Kata', 'Freie Kata ab 3. Dan', 'Kata für Kinder'], 'Theoriebegriff zum 1. Kyu.');
  L.mc('Was bedeutet „Shitei-Kata“?', ['Vorgeschriebene Pflicht-Kata', 'Frei gewählte Kata', 'Kata mit Partner', 'Wettkampf-Kata ab 3. Dan'], 'Theoriebegriff zum 1. Kyu.');
  Q('pr-kata', S.po, '9kyu').mc('Welche Kata muss der Prüfling zum 9. Kyu (Theorie) vom Ablauf beherrschen?', ['Taikyoku Shodan', 'Heian Shodan', 'Tekki Shodan', 'Keine'], '');
  Q('pr-kata', S.po, '8kyu').multi('Welche Schwerpunkte nennt die Prüfungsordnung für Heian Shodan zum 8. Kyu?', ['Korrekte Zenkutsu- und Kokutsu-dachi-Stellung', 'Renoji-dachi-Stellung', 'Tettsui-uchi'], ['Yoko-geri-keage', 'Nukite'], '');
  Q('pr-kata', S.po, '7kyu').multi('Welche Schwerpunkte nennt die Prüfungsordnung für Heian Nidan zum 7. Kyu?', ['Korrekte Kokutsu-dachi-Stellung', 'Shuto-uke', 'Yoko-geri und Uraken-uchi müssen synchron ausgeführt werden'], ['Kiba-dachi mit Fumikomi', 'Mikazuki-geri'], '');
  L = Q('pr-kata', S.ueb);
  L.order('Ordne die Prüfungs-Kata vom 8. bis zum 3. Kyu:', ['Heian Shodan', 'Heian Nidan', 'Heian Sandan', 'Heian Yondan', 'Heian Godan', 'Tekki Shodan'], '');

  // ---------- Kihon-Programm ----------
  L = Q('pr-kihon', S.po, '9kyu');
  L.mc('Wie oft werden die Kihon-Techniken zum 9. Kyu ausgeführt?', ['Je 2x oder 4x nach Wahl des Prüfers', 'Je 3x', 'Je 5x', 'Je 1x'], '');
  L.mc('Mit welcher Technik beginnt das Kihon-Programm zum 9. Kyu (im Stand)?', ['Choku-zuki in Soto-Hachiji-dachi', 'Oi-zuki in Zk', 'Mae-geri', 'Gedan-barai in Kb'], '');
  L.mc('Wohin kehrt man beim Kihon zum 9. Kyu nach dem Schritt vorwärts zurück?', ['Schritt zurück in Soto-Hachiji-dachi', 'In Kiba-dachi', 'In Seiza', 'In Kokutsu-dachi'], '');
  L.mc('Aus welcher Haltung wird zum 9. Kyu der Age-uke ausgeführt?', ['Aus Jodan-Kamae', 'Aus Gedan-Kamae', 'Aus Shuto-Kamae', 'Aus Choku-zuki-Kamae'], '');
  L = Q('pr-kihon', S.po, '8kyu');
  L.mc('Wie oft werden die Kihon-Techniken ab dem 8. Kyu ausgeführt?', ['Je 3x', 'Je 2x oder 4x', 'Je 5x', 'Je 10x'], '');
  L.mc('Wie lautet die Wendung nach Uchi-uke zum 8. Kyu?', ['Wendung in Kk mit Shuto-uke', 'Wendung in Zk mit Gedan-barai', 'Wendung in Kb mit Gedan-barai', 'Keine Wendung'], '');
  L.mc('Aus welcher Haltung wird zum 8. Kyu Chudan-Mae-geri ausgeführt?', ['Ryo-Yoko-Gedan-Barai-Kamae', 'Chudan-Kamae', 'Jodan-Kamae', 'Shuto-Kamae'], '');
  L.mc('In welchem Stand endet die Wendung nach Mae-geri zum 8. Kyu?', ['Kiba-dachi mit Gedan-barai', 'Zenkutsu-dachi mit Gedan-barai', 'Kokutsu-dachi mit Shuto-uke', 'Heisoku-dachi'], '');
  L.mc('Welcher seitliche Fußtritt wird zum 8. Kyu geprüft?', ['Yoko-geri-kekomi in Kb (beide Richtungen)', 'Yoko-geri-keage', 'Mawashi-geri', 'Ushiro-geri'], '');
  L = Q('pr-kihon', S.po, '7kyu');
  L.mc('Welcher Fußtritt kommt zum 7. Kyu gegenüber dem 8. Kyu im Kihon neu hinzu?', ['Yoko-geri-keage in Kb', 'Mawashi-geri', 'Ushiro-geri', 'Ren-geri'], '');
  L = Q('pr-kihon', S.po, '6kyu');
  L.mc('Welche Kombination folgt zum 6. Kyu auf Soto-uke?', ['Umsetzen in Kb mit Yoko-Empi-Uchi', 'Mae-geri', 'Gyaku-zuki in Zk', 'Shuto-uke in Kk'], '');
  L.mc('Was folgt zum 6. Kyu auf Shuto-uke in Kk?', ['Kizami-Mae-geri', 'Nukite', 'Gyaku-zuki', 'Uraken'], '');
  L.multi('Welche Mae-geri-Varianten gehören zum 6. Kyu?', ['Jodan-Mae-geri (Wendung mit Gedan-barai in Zk)', 'Chudan-Mae-geri (Wendung mit Gedan-barai in Kb)'], ['Ren-geri', 'Mae-geri im Sprung'], '');
  L = Q('pr-kihon', S.po, '5kyu');
  L.mc('Welche Fauststoß-Kombination kommt zum 5. Kyu neu ins Kihon?', ['Sanbon-zuki (Jodan/Chudan/Chudan)', 'Ren-zuki', 'Kagi-zuki', 'Morote-zuki'], '');
  L.mc('Welcher Fußtritt kommt zum 5. Kyu neu hinzu?', ['Mawashi-geri', 'Ushiro-geri', 'Yoko-geri-kekomi', 'Mikazuki-geri'], '');
  L.mc('Wie lautet die Kombination mit Shuto-uke zum 5. Kyu?', ['Rückwärts in Kk mit Shuto-uke / Jodan-Kizami-Mae-geri / Nukite in Zk', 'Vorwärts in Zk mit Shuto-uke / Gyaku-zuki', 'Shuto-uke / Mawashi-geri', 'Shuto-uke / Ushiro-geri'], '');
  L.mc('Was folgt zum 5. Kyu nach Uchi-uke?', ['Jodan-Kizami-zuki / Gyaku-zuki', 'Mae-geri / Gyaku-zuki', 'Yoko-Empi-Uchi', 'Nukite'], '');
  L = Q('pr-kihon', S.po, '4kyu');
  L.mc('In welche Richtung wird Age-uke / Gyaku-zuki zum 4. Kyu ausgeführt?', ['Rückwärts in Zk', 'Vorwärts in Zk', 'Seitwärts in Kb', 'Im Stand'], '');
  L.mc('Was folgt zum 4. Kyu auf Uchi-uke?', ['Jodan-Kizami-zuki / Chudan-Gyaku-zuki', 'Kizami-Mae-geri / Gyaku-zuki', 'Yoko-Empi-Uchi', 'Mawashi-geri'], '');
  L = Q('pr-kihon', S.po, '3kyu');
  L.mc('Welche Ren-geri-Kombination wird zum 3. Kyu geprüft?', ['Chudan-Mae-geri / Zwischenschritt / Mawashi-geri', 'Mawashi-geri / Yoko-geri-kekomi mit gleichem Bein', 'Mae-geri / Ushiro-geri', 'Yoko-geri-keage / Yoko-geri-kekomi'], '');
  L.mc('Was folgt zum 3. Kyu rückwärts auf Uchi-uke?', ['Kizami-Mae-geri / Gyaku-zuki', 'Jodan-Kizami-zuki / Gyaku-zuki', 'Uraken', 'Shuto-uke'], '');
  L = Q('pr-kihon', S.po, '2kyu');
  L.mc('Welcher Fußtritt kommt zum 2. Kyu neu ins Kihon?', ['Ushiro-geri', 'Mawashi-geri', 'Yoko-geri-keage', 'Mikazuki-geri'], '');
  L.mc('Wie lautet die Sonoba-geri-Übung zum 2. Kyu?', ['Mae-geri nach vorne / mit gleichem Bein Yoko-geri-keage zur Seite', 'Mae-geri / Ushiro-geri', 'Mawashi-geri / Yoko-geri-kekomi', 'Mae-geri / Yoko-geri-keage / Ushiro-geri / Mawashi-geri'], '');
  L.mc('Was folgt zum 2. Kyu rückwärts auf Uchi-uke?', ['Kizami-Mae-geri / Kizami-zuki / Gyaku-zuki', 'Gyaku-zuki', 'Jodan-Kizami-zuki / Gyaku-zuki', 'Yoko-Empi-Uchi'], '');
  L = Q('pr-kihon', S.po, '1kyu');
  L.mc('Welche Ren-geri-Kombination wird zum 1. Kyu geprüft?', ['Chudan-Mae-geri / mit gleichem Bein Mawashi-geri', 'Chudan-Mae-geri / Zwischenschritt / Mawashi-geri', 'Mawashi-geri / Yoko-geri-kekomi', 'Mae-geri / Ushiro-geri'], '');
  L.mc('Wie lautet die Sonoba-geri-Übung zum 1. Kyu?', ['Mae-geri nach vorne / mit gleichem Bein Ushiro-geri', 'Mae-geri / Yoko-geri-keage', 'Mae-geri / Yoko-geri-keage / Ushiro-geri', 'Mawashi-geri / Ushiro-geri'], '');
  L.mc('Was folgt zum 1. Kyu auf Age-uke?', ['Mae-geri / hinten absetzen mit Gyaku-zuki in Zk', 'Gyaku-zuki', 'Mawashi-geri / Uraken', 'Yoko-Empi-Uchi'], '');
  L = Q('pr-kihon', S.po, '1dan');
  L.mc('Welche Ren-geri-Kombination wird zum 1. Dan geprüft?', ['Mawashi-geri / mit gleichem Bein Yoko-geri-kekomi', 'Mae-geri / Mawashi-geri', 'Mae-geri / Zwischenschritt / Mawashi-geri', 'Ushiro-geri / Mawashi-geri'], '');
  L.mc('Wie lautet die Sonoba-geri-Übung zum 1. Dan?', ['Mae-geri / Yoko-geri-keage / Ushiro-geri mit gleichem Bein', 'Mae-geri / Yoko-geri-keage', 'Mae-geri / Ushiro-geri', 'Mae-geri / Yoko-geri-keage / Ushiro-geri / Mawashi-geri'], '');
  L.mc('Was folgt zum 1. Dan nach Yoko-geri-keage in Kb?', ['Drehung und mit dem hinteren Bein Yoko-geri-kekomi in Kb', 'Gedan-barai in Zk', 'Ushiro-geri', 'Mae-geri'], '');
  L = Q('pr-kihon', S.po, '2dan');
  L.mc('Wie lautet die Sonoba-geri-Übung zum 2. Dan?', ['Mae-geri, Yoko-geri-keage, Ushiro-geri, Mawashi-geri – alle mit gleichem Bein', 'Mae-geri / Ushiro-geri', 'Mae-geri / Yoko-geri-keage', 'Mawashi-geri / Ushiro-geri'], '');
  L.mc('Womit beginnt die erste Kihon-Kombination zum 2. Dan?', ['Im Stand Jodan-Kizami-zuki, dann vorwärts Sanbon-zuki', 'Oi-zuki aus Gedan-Kamae', 'Age-uke rückwärts', 'Mae-geri aus Chudan-Kamae'], '');
  L = Q('pr-kihon', S.po, '3dan');
  L.mc('Wie ist das Kihon zum 3. Dan geregelt?', ['Der Prüfer gibt 5 verschiedene Reihen aus dem Shodan- und Nidan-Programm an', 'Wie zum 1. Kyu', 'Freies Kihon nach Wahl des Prüflings', 'Kein Kihon'], '');

  // ---------- Kumite-Programm ----------
  L = Q('pr-kumite', S.po, '9kyu');
  L.mc('Welche Kumite-Form wird zum 9. Kyu geprüft?', ['Kihon-Ippon-Kumite', 'Gohon-Kumite', 'Jiyu-Ippon-Kumite', 'Jiyu-Kumite'], '');
  L.multi('Welche Angriffe kommen zum 9. Kyu im Kumite vor?', ['Jodan-Oi-zuki', 'Chudan-Oi-zuki'], ['Chudan-Mae-geri', 'Yoko-geri-kekomi'], '');
  L.multi('Welche Abwehren werden zum 9. Kyu im Kumite gefordert?', ['Age-uke / Chudan-Gyaku-zuki', 'Soto-uke / Chudan-Gyaku-zuki'], ['Shuto-uke / Nukite', 'Gedan-barai / Mae-geri'], '');
  L = Q('pr-kumite', S.po, '8kyu');
  L.mc('Welche Kumite-Form wird zum 8. Kyu geprüft?', ['Gohon-Kumite', 'Kihon-Ippon-Kumite', 'Jiyu-Ippon-Kumite', 'Sanbon-Kumite'], '');
  L = Q('pr-kumite', S.po, '7kyu');
  L.mc('Zum 7. Kyu (Gohon-Kumite): Wie beginnt der Verteidiger bei Soto-uke?', ['Links zurück', 'Rechts zurück', 'Vorwärts', 'Seitlich'], '');
  L.mc('Zum 7. Kyu (Gohon-Kumite): Wie beginnt der Verteidiger bei Age-uke?', ['Rechts zurück', 'Links zurück', 'Vorwärts', 'Mit Sprung'], '');
  L = Q('pr-kumite', S.po, '6kyu');
  L.multi('Welche Angriffe gibt es im Kihon-Ippon-Kumite zum 6. Kyu?', ['Jodan-Oi-zuki', 'Chudan-Oi-zuki', 'Chudan-Mae-geri', 'Chudan-Yoko-geri-kekomi'], ['Mawashi-geri', 'Ushiro-geri'], '');
  L.mc('Was bedeutet beim Kihon-Ippon-Kumite zum 6. Kyu „Sabaki“?', ['Ausweichbewegung leicht aus der Angriffslinie heraus', 'Ein Fußfeger', 'Ein Sprung nach vorne', 'Ein Stampfer'], '');
  L.mc('Welcher Konter folgt zum 6. Kyu bei Soto-uke mit Sabaki nach rechts hinten?', ['Chudan-Yoko-Empi-Uchi in Kb', 'Chudan-Gyaku-zuki', 'Mae-geri', 'Uraken'], '');
  L = Q('pr-kumite', S.po, '4kyu');
  L.mc('Was ist zum 4. Kyu im Kihon-Ippon-Kumite frei?', ['Sabaki, Blocktechniken und Gegenangriffe – je Angriffsstufe 2x unterschiedlich', 'Nichts – alles ist vorgegeben', 'Nur die Angriffe', 'Nur die Distanz'], '');
  L = Q('pr-kumite', S.po, '3kyu');
  L.mc('Was ändert sich zum 3. Kyu bei den Angriffen im Kihon-Ippon-Kumite?', ['Jeder Angriff 1x links und 1x rechts', 'Es gibt nur noch einen Angriff', 'Angriffe nur noch mit Fußtechnik', 'Angriffe frei gewählt'], '');
  L = Q('pr-kumite', S.po, '2kyu');
  L.mc('Welche Kumite-Form wird zum 2. Kyu geprüft?', ['Jiyu-Ippon-Kumite', 'Kihon-Ippon-Kumite', 'Gohon-Kumite', 'Jiyu-Kumite'], '');
  L.mc('Welcher Angriff kommt zum 2. Kyu im Jiyu-Ippon-Kumite neu hinzu?', ['Chudan-Ushiro-geri', 'Jodan-Mawashi-geri', 'Jodan-Kizami-zuki', 'Yoko-geri-keage'], '');
  L.mc('Aus welcher Haltung stehen sich beide Partner im Jiyu-Ippon-Kumite gegenüber?', ['Chudan-Kamae (freie Kampfstellung)', 'Shizentai', 'Seiza', 'Heisoku-dachi'], '');
  L = Q('pr-kumite', S.po, '1kyu');
  L.multi('Welche Angriffe kommen zum 1. Kyu im Jiyu-Ippon-Kumite neu hinzu?', ['Jodan-Kizami-zuki', 'Jodan-Mawashi-geri'], ['Chudan-Ushiro-geri', 'Chudan-Mae-geri'], '');
  L.mc('Wie oft muss der Angreifer zum 1. Kyu mindestens die Ausgangslage wechseln?', ['Mindestens 2x', 'Gar nicht', 'Bei jedem Angriff', 'Genau 1x'], '');
  L.mc('Wie viele Angriffe umfasst das Jiyu-Ippon-Kumite zum 1. Kyu und 1. Dan?', ['7', '5', '4', '2'], '');
  L = Q('pr-kumite', S.po, '1dan');
  L.mc('Was gilt zum 1. Dan für den Wechsel der Ausgangslage im Jiyu-Ippon-Kumite?', ['Ein Wechsel ist möglich', 'Mindestens 3 Wechsel sind Pflicht', 'Wechsel verboten', 'Nur der Verteidiger wechselt'], '');
  L = Q('pr-kumite', S.po, '2dan');
  L.mc('Welche Kumite-Form wird zum 2. Dan grundsätzlich geprüft?', ['Jiyu-Kumite (alternativ Jiyu-Ippon-Kumite je nach Alter)', 'Gohon-Kumite', 'Kihon-Ippon-Kumite', 'Happo-Kumite'], '');
  L = Q('pr-kumite', S.po, '3dan');
  L.mc('Welche Kumite-Form wird zum 3. Dan geprüft?', ['Jiyu-Kumite (alternativ Jiyu-Ippon-Kumite je nach Alter)', 'Kihon-Ippon-Kumite', 'Gohon-Kumite', 'Okuri-Jiyu-Ippon-Kumite'], '');

  // ---------- Theorie ----------
  const theory = [
    ['9kyu', ['Seiza', 'Mokuso', 'Kiritsu'], ['Kime', 'Maai', 'Zanshin']],
    ['8kyu', ['Gohon-Kumite', 'Jodan', 'Kata'], ['Deai', 'Sun-dome', 'Shiai']],
    ['7kyu', ['Shizentai', 'Hanmi', 'Hiki-te'], ['Kime-Waza', 'Suri-ashi', 'Ashi-barai']],
    ['6kyu', ['Dojo', 'Kogeki', 'Uke'], ['Zanshin', 'Maai', 'Happo-Kumite']],
    ['5kyu', ['Sanbon-zuki', 'Soto-uke', 'Uchi-uke'], ['Shiai', 'Deai', 'Tokui-Kata']],
    ['4kyu', ['Kime', 'Kime-Waza'], ['Mokuso', 'Ren-geri', 'Tai-sabaki']],
    ['3kyu', ['Ren-geri', 'Shiai', 'Suri-ashi'], ['Kime', 'Sentei-Kata', 'Hanmi']],
    ['2kyu', ['Maai', 'Deai', 'Kizami-geri'], ['Seiza', 'Kogeki', 'Sun-dome']],
    ['1kyu', ['Zanshin', 'Sonoba-geri', 'Tokui-Kata'], ['Kosa-dachi', 'Hiki-te', 'Happo-Kumite']],
    ['1dan', ['Kosa-dachi', 'Sun-dome', 'Tai-sabaki'], ['Mokuso', 'Kime', 'Shiai']],
  ];
  theory.forEach(([g, right, wrong]) => {
    const grade = SK.grades.find((x) => x.id === g);
    Q('pr-theorie', S.po, g).multi(`Welche Begriffe gehören laut DJKB-Prüfungsordnung zur Theorie zum ${grade.name}?`, right, wrong, `Vollständig: ${grade.theory}`);
  });
  L = Q('pr-theorie', S.po, '2dan');
  L.mc('Welcher Begriff gehört zur Theorie zum 2. Dan?', ['Happo-Kumite', 'Seiza', 'Kime', 'Maai'], '');
  L.mc('Was gehört zum 2. Dan außer der Theorie zusätzlich zum Prüfungsprogramm?', ['Lehrprobe aus den Kyu-Programmen und Kata-Bunkai aus den Sentei-Kata', 'Bruchtest', 'Schriftliche Hausarbeit', 'Wettkampfteilnahme'], '');
  L = Q('pr-theorie', S.po, '3dan');
  L.mc('Woraus besteht die Lehrprobe zum 3. Dan?', ['Aus dem Shodan- und Nidan-Prüfungsprogramm', 'Aus dem 9. Kyu-Programm', 'Aus freien Wettkampftechniken', 'Es gibt keine Lehrprobe'], '');
  L = Q('pr-theorie', S.po, '1dan');
  L.mc('Aus welchen Kata wird zum 1. Dan Kata-Bunkai verlangt?', ['Heian 1–5 und Tekki Shodan', 'Aus den Sentei-Kata', 'Aus Unsu und Gojushiho', 'Keine'], '');

  // ---------- Dan ----------
  L = Q('pr-dan', S.vo, '1dan');
  L.mc('Welches Mindestalter gilt für die Prüfung zum 1. Dan?', ['Vollendetes 16. Lebensjahr (8 Jahre Karatetraining)', '14 Jahre', '18 Jahre', '21 Jahre'], '');
  L.mc('Wie lange ist die Vorbereitungszeit zum 1. Dan?', ['1 Jahr seit der Prüfung zum 1. Kyu', '6 Monate', '2 Jahre', '3 Jahre'], '');
  L.mc('Wer ist für Dan-Prüfungen allein prüfungsberechtigt?', ['Die DJKB A-Lizenz-Prüfer', 'Jeder Dojoleiter', 'C-Lizenz-Prüfer', 'Der Vereinsvorstand'], '');
  L.mc('Was ist Voraussetzung zur Zulassung zum 1. Dan (Lehrgang)?', ['Vollständige Teilnahme an dem Lehrgang, an dem die Prüfung stattfindet', 'Teilnahme an einem Gasshuku in Japan', 'Ein Wettkampfsieg', 'Keine'], '');
  L.mc('Wann ist für neu eingetretene DJKB-Mitglieder eine Dan-Prüfung frühestens möglich?', ['Nach einem Jahr Mitgliedschaft', 'Sofort', 'Nach 3 Monaten', 'Nach 5 Jahren'], '');
  L.mc('Wie spät muss man sich spätestens zu einer Dan-Prüfung anmelden?', ['14 Tage vor dem Prüfungstermin', 'Am Prüfungstag', '1 Tag vorher', '6 Monate vorher'], '');
  L.mc('Wann kann eine nicht bestandene Dan-Prüfung frühestens wiederholt werden?', ['Nach 1 Jahr', 'Nach 1 Monat', 'Nach 6 Monaten', 'Nach 3 Jahren'], '');
  L.mc('Was gilt nach dreimaligem Nichtbestehen desselben Dan-Grades?', ['Keine weitere Prüfung mehr möglich', 'Wiederholung nach einem Jahr', 'Wiederholung nach einem Monat', 'Automatische Zulassung'], '');
  L = Q('pr-dan', S.vo, '2dan');
  L.mc('Welches Mindestalter gilt laut Verfahrensordnung 2024 für den 2. Dan?', ['20 Jahre', '18 Jahre', '25 Jahre', '16 Jahre'], '');
  L.mc('Wie lange ist die Vorbereitungszeit zum 2. Dan, wenn der 1. Dan bereits mit 16 Jahren abgelegt wurde?', ['4 Jahre', '2 Jahre', '3 Jahre', '1 Jahr'], '');
  L.mc('Wie lange ist die reguläre Vorbereitungszeit zum 2. Dan?', ['2 Jahre', '1 Jahr', '3 Jahre', '4 Jahre'], '');
  L.mc('Was ist ab dem 2. Dan zur Zulassung zusätzlich erforderlich?', ['Registrierung des Dan-Grades bei der JKA (JKA Membership Card)', 'Ein Wettkampftitel', 'Eine Trainerlizenz', 'Ein Aufenthalt in Japan'], '');
  L.mc('Welche Lehrgangsteilnahme ist ab dem 2. Dan Voraussetzung?', ['Jährlich mind. 1 Lehrgang mit dem Chefausbilder (oder mehrtägiger Lehrgang ≥ 3 Tage in den letzten 2 Jahren)', 'Keine', 'Ein Lehrgang in Japan', 'Monatlich ein Lehrgang'], '');
  L = Q('pr-dan', S.vo, '3dan');
  L.mc('Welches Mindestalter gilt laut Verfahrensordnung 2024 für den 3. Dan?', ['25 Jahre', '20 Jahre', '28 Jahre', '30 Jahre'], 'Ältere DJKB-Übersichten nennen abweichend 28 Jahre – maßgeblich ist die aktuelle Verfahrensordnung.');
  L.mc('Wie lange ist die Vorbereitungszeit zum 3. Dan?', ['3 Jahre seit der Nidan-Prüfung', '2 Jahre', '4 Jahre', '1 Jahr'], '');
})();
