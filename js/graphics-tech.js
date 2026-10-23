/* Technik-Grafiken für das Lexikon und den Begriffe-Trainer (baut auf SK.gfx.kit auf). */
(function () {
  'use strict';
  const { person, scene, frame, arm, ghost, FRONT, SIDE, LEG_R, LEG_L, HIKITE_R, HIKITE_L, arrow, hit, foot, FONT, HL, HLS, INK, GHOST } = SK.gfx.kit;

  const far = (p) => Object.assign({}, p, { far: true });
  const leg = (p, ft, o) => Object.assign({ p, w: 15, foot: ft }, o);
  const num = (x, y, n) => `<circle cx="${x}" cy="${y}" r="8" fill="${HL}" stroke="#fff" stroke-width="1.5"/><text x="${x}" y="${y + 3.5}" font-size="10" font-weight="700" text-anchor="middle" fill="#fff" ${FONT}>${n}</text>`;
  const ring = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r || 11}" fill="none" stroke="${HL}" stroke-width="3"/>`;

  // Seitenansicht, Blick nach rechts: die rechte Körperseite ist vorne (near), die linke hinten (far).
  const side = (parts, o) => Object.assign({}, SIDE, o, { parts });
  const S_STAND = [leg([[108, 116], [104, 176], [102, 228]], [120, 232], { far: true }), leg([[110, 116], [112, 176], [114, 228]], [132, 232])];
  const S_ZK = [leg([[106, 116], [72, 172], [38, 226]], [56, 232], { far: true }), leg([[110, 116], [142, 168], [138, 228]], [158, 232])];
  const S_KK = [leg([[104, 116], [82, 168], [86, 228]], [104, 232], { far: true }), leg([[108, 116], [144, 170], [162, 228]], [180, 232])];
  const HIP_FAR = far(arm([[112, 62], [100, 92], [110, 104]]));
  const HIP_NEAR = arm([[112, 62], [102, 92], [114, 104]]);
  const GUARD_FAR = far(arm([[112, 62], [118, 92], [134, 88]]));
  const PUNCH = arm([[112, 62], [146, 66], [182, 68]]);

  // Vorderansicht: rechte Körperseite = im Bild links
  const fr = (parts, legs) => Object.assign({}, FRONT, { parts: (legs || [LEG_R, LEG_L]).concat(parts) });
  const KIBA = [leg([[100, 118], [72, 168], [70, 228]], [62, 234], { under: true }), leg([[120, 118], [148, 168], [150, 228]], [158, 234], { under: true })];
  const F_KK = [leg([[102, 118], [92, 174], [88, 228]], [82, 234], { under: true }), leg([[118, 118], [140, 170], [138, 228]], [148, 234], { under: true })];
  const SHIZEN = [leg([[102, 118], [92, 176], [84, 228]], [78, 234], { under: true }), leg([[118, 118], [128, 176], [136, 228]], [142, 234], { under: true })];

  const S = (label, spec, extra, lines, o) => () => scene(label, 240, spec, extra || '', lines, o);
  const F = (label, spec, extra, lines, o) => () => scene(label, 220, spec, extra || '', lines, o);
  const still = { ghost: false };

  // Seitlicher Tritt (Vorderansicht, Bein zur Bildseite rechts)
  const YOKO = { head: [96, 40], view: 'front', torso: [[80, 62], [114, 56], [121, 118], [97, 122]], belt: [[97, 115], [121, 112]] };
  const yokoBase = [leg([[101, 120], [95, 178], [91, 228]], [85, 234], { under: true }), arm([[82, 66], [66, 96], [84, 100]]), arm([[112, 62], [134, 84], [118, 96]])];
  const MAE_BASE = [far(arm([[112, 62], [128, 90], [142, 80]])), leg([[108, 116], [104, 176], [100, 228]], [118, 232], { far: true }), arm([[112, 62], [104, 96], [118, 106]])];

  const SEIZA = (hands, extra) => ({
    head: [112, 128],
    view: 'side',
    trunk: [[112, 148], [106, 200]],
    parts: [
      leg([[104, 204], [146, 224], [100, 230]], [84, 232], { far: true }),
      far(arm([[112, 154], ...hands])),
      leg([[106, 204], [148, 226], [102, 232]], [86, 234]),
      arm([[112, 154], ...hands], 'open'),
    ].concat(extra || []),
  });
  SEIZA.hands = [[122, 184], [142, 206]];

  const top = (spec, pre, extra, lines, o) => () => scene(spec.label, 220, spec, extra || '', lines, Object.assign({ top: true, ghost: false, pre }, o));

  const T = {
    /* ---------- Tsuki ---------- */
    'choku-zuki': S('Choku-zuki', side([HIP_FAR, ...S_STAND, PUNCH, ghost(HIP_NEAR)]), arrow('M120 92 L174 84') + hit(190, 68), ['seitlich: gerader Fauststoß', 'aus dem Stand, ohne Schritt']),
    'kizami-zuki': S('Kizami-zuki', side([GUARD_FAR, ...S_ZK, arm([[112, 62], [148, 50], [184, 40]]), ghost(arm([[112, 62], [132, 84], [148, 70]]))]), arrow('M154 84 L186 56') + hit(192, 38), ['seitlich: Stoß mit der vorderen Hand,', 'ohne Schritt']),
    'sanbon-zuki': S('Sanbon-zuki', side([HIP_FAR, ...S_ZK, PUNCH]), num(206, 34, 1) + num(204, 68, 2) + num(222, 68, 3), ['seitlich: drei Stöße schnell hintereinander', '1 Jodan · 2 Chudan · 3 Chudan'], still),
    'ren-zuki': S('Ren-zuki', side([far(arm([[112, 62], [146, 72], [180, 76]])), ...S_ZK, HIP_NEAR, ghost(PUNCH)]), num(200, 60, 1) + num(198, 84, 2), ['seitlich: Fauststöße in schneller Folge,', 'die Hände wechseln sich ab']),
    'morote-zuki': S('Morote-zuki', side([far(arm([[112, 62], [148, 74], [182, 80]])), ...S_ZK, arm([[112, 62], [148, 62], [184, 62]])]), '', ['seitlich: beide Fäuste stoßen', 'gleichzeitig nach vorne'], still),
    'kagi-zuki': F('Kagi-zuki', fr([HIKITE_L, arm([[93, 62], [66, 84], [122, 84]]), ghost(HIKITE_R)], KIBA), arrow('M72 102 C90 106 110 104 124 98'), ['von vorne (Kiba-dachi): Hakenstoß,', 'Unterarm waagerecht vor der Brust']),
    'ura-zuki': S('Ura-zuki', side([HIP_FAR, ...S_ZK, arm([[112, 62], [126, 98], [162, 94]]), ghost(HIP_NEAR)]), arrow('M120 116 C136 116 150 112 160 108'), ['seitlich: kurzer Stoß aus nächster Nähe,', 'der Handrücken zeigt nach unten']),
    'age-zuki': S('Age-zuki', side([HIP_FAR, ...S_ZK, arm([[112, 62], [146, 60], [164, 30]]), ghost(HIP_NEAR)]), arrow('M124 108 C154 104 176 72 176 42') + hit(166, 20), ['seitlich: Faust steigt im Bogen', 'nach oben zum Kinn']),
    'yama-zuki': S('Yama-zuki', side([far(arm([[112, 62], [144, 104], [182, 118]])), ...S_ZK, arm([[112, 62], [150, 44], [186, 38]])], { trunk: [[116, 54], [108, 116]] }), '', ['seitlich: beide Fäuste gleichzeitig –', 'eine oben (Jodan), eine unten (Gedan)'], still),
    'otoshi-zuki': S('Otoshi-zuki', side([HIP_FAR, ...S_ZK, arm([[112, 62], [146, 72], [168, 108]]), ghost(arm([[112, 62], [136, 40], [160, 28]]))]), arrow('M170 30 C188 50 188 84 176 104'), ['seitlich: Fauststoß von oben', 'nach unten']),
    nukite: S('Nukite', side([HIP_FAR, ...S_ZK, arm([[112, 62], [148, 70], [180, 74]], 'open'), ghost(HIP_NEAR)]), hit(196, 76), ['seitlich: Stoß mit den Fingerspitzen']),

    /* ---------- Uchi ---------- */
    'uraken-uchi': F('Uraken-uchi', fr([HIKITE_L, arm([[93, 62], [66, 58], [50, 34]]), ghost(arm([[93, 62], [108, 84], [124, 62]]))]), arrow('M120 52 C98 34 76 26 60 26') + hit(44, 30), ['von vorne: Faustrücken schnellt', 'im Bogen nach außen']),
    'tettsui-uchi': F('Tettsui-uchi', fr([HIKITE_L, arm([[93, 62], [70, 88], [60, 118]]), ghost(arm([[93, 62], [86, 30], [104, 10]]))]), arrow('M96 4 C54 10 42 60 52 106') + hit(58, 126), ['von vorne: Hammerfaust schlägt', 'im Bogen nach unten']),
    'shuto-uchi': top({ label: 'Shuto-uchi', head: [110, 150], view: 'top', trunk: [[80, 152], [140, 152]], trunkW: 20, parts: [arm([[82, 152], [70, 108], [100, 66]], 'open'), arm([[138, 152], [146, 172]]), ghost(arm([[82, 152], [50, 150], [62, 126]], 'open'))] }, '', arrow('M44 138 C30 92 58 62 94 56'), ['von oben: Handkante schwingt waagerecht', 'von außen nach innen'], { ghost: true }),
    'haito-uchi': top({ label: 'Haito-uchi', head: [110, 150], view: 'top', trunk: [[80, 152], [140, 152]], trunkW: 20, parts: [arm([[82, 152], [76, 106], [108, 70]], 'open'), arm([[138, 152], [146, 172]]), ghost(arm([[82, 152], [52, 170], [30, 178]], 'open'))] }, '', arrow('M24 166 C16 104 50 70 98 60'), ['von oben: Hand schwingt weit von außen,', 'die Daumenseite trifft'], { ghost: true }),
    'enpi-uchi': S('Enpi-uchi', side([HIP_FAR, ...S_ZK, arm([[112, 62], [150, 60], [120, 52]]), ghost(HIP_NEAR)]), arrow('M122 100 C144 96 154 82 156 70') + hit(166, 58), ['seitlich: der Ellbogen schlägt', 'nach vorne']),
    'furi-enpi': F('Furi-enpi', fr([HIKITE_L, arm([[93, 62], [60, 66], [94, 76]]), ghost(HIKITE_R)], KIBA), arrow('M98 110 C80 106 62 92 52 76') + hit(52, 64), ['von vorne (Kiba-dachi): Ellbogen', 'schwingt zur Seite']),
    'ushiro-enpi': S('Ushiro-enpi', side([GUARD_FAR, ...S_ZK, arm([[112, 62], [80, 88], [108, 96]]), ghost(PUNCH)]), arrow('M176 86 C150 104 110 108 86 104') + hit(72, 88), ['seitlich: Ellbogen stößt nach hinten']),
    'hasami-uchi': F('Hasami-uchi', fr([arm([[93, 62], [62, 74], [76, 56]]), arm([[127, 62], [158, 74], [144, 56]])]), arrow('M42 76 C48 62 58 54 70 52') + arrow('M178 76 C172 62 162 54 150 52'), ['von vorne: beide Fäuste schlagen', 'zangenartig von außen nach innen'], still),
    'teisho-uchi': S('Teisho-uchi', side([HIP_FAR, ...S_ZK, arm([[112, 62], [148, 64], [180, 62]], 'vopen'), ghost(HIP_NEAR)]), arrow('M122 92 L176 80') + hit(190, 68), ['seitlich: Stoß mit dem Handballen']),

    /* ---------- Uke ---------- */
    'shuto-uke': F('Shuto-uke', fr([arm([[127, 62], [134, 92], [112, 92]], 'open'), arm([[93, 62], [70, 96], [70, 56]], 'open'), ghost(arm([[93, 62], [110, 84], [128, 56]], 'open'))], F_KK), arrow('M126 46 C104 36 82 40 72 46'), ['von vorne (Kokutsu-dachi): Handkante,', 'zweite Hand vor dem Solarplexus']),
    'morote-uke': F('Morote-uke', fr([arm([[93, 62], [86, 102], [76, 60]]), arm([[127, 62], [120, 98], [92, 100]])]), ring(90, 100, 12), ['von vorne: die zweite Faust stützt', 'den Arm am Ellbogen'], still),
    'juji-uke': F('Juji-uke', fr([arm([[93, 62], [80, 34], [120, 10]], 'open'), arm([[127, 62], [140, 34], [100, 10]], 'open')]), ring(110, 16, 12), ['von vorne: Handgelenke über', 'dem Kopf gekreuzt (Jodan)'], still),
    'kakiwake-uke': F('Kakiwake-uke', fr([arm([[93, 62], [72, 100], [66, 58]]), arm([[127, 62], [148, 100], [154, 58]]), ghost(arm([[93, 62], [100, 96], [124, 76]])), ghost(arm([[127, 62], [120, 96], [96, 76]]))]), arrow('M100 44 L74 40') + arrow('M120 44 L146 40'), ['von vorne: beide Arme drücken', 'nach außen auseinander']),
    'nagashi-uke': F('Nagashi-uke', fr([HIKITE_L, arm([[93, 62], [86, 88], [118, 42]], 'open')]), arrow('M84 30 C98 20 120 22 134 34'), ['von vorne: offene Hand lenkt den', 'Angriff am Gesicht vorbei'], still),
    'osae-uke': F('Osae-uke', fr([HIKITE_L, arm([[93, 62], [78, 92], [112, 98]], 'open'), ghost(arm([[93, 62], [78, 76], [108, 74]], 'open'))]), arrow('M132 74 L132 104'), ['von vorne: offene Hand drückt', 'den Angriff nach unten']),
    'kake-uke': F('Kake-uke', fr([HIKITE_L, arm([[93, 62], [70, 92], [66, 52]], 'open'), ghost(arm([[93, 62], [104, 90], [118, 64]], 'open'))]), arrow('M118 52 C98 34 72 32 60 46'), ['von vorne: Handgelenk hakt', 'den Angriff ein']),
    'sukui-uke': S('Sukui-uke', side([HIP_FAR, ...S_KK, arm([[112, 62], [132, 104], [162, 98]], 'open')]), arrow('M158 134 C172 122 174 106 170 92'), ['seitlich: Hand schöpft von unten', 'den tretenden Fuß'], still),
    'haiwan-uke': F('Haiwan-uke', fr([arm([[127, 62], [134, 36], [100, 18]]), arm([[93, 62], [66, 54], [60, 22]])]), `<path d="M58 50 L53 26" stroke-width="10" ${HLS}/>`, ['von vorne: Rückseite des Unterarms', 'wehrt seitlich ab'], still),
    'tsukami-uke': F('Tsukami-uke', fr([HIKITE_L, arm([[93, 62], [68, 70], [56, 50]], 'open')]), arrow('M46 46 C48 72 66 92 86 104'), ['von vorne: Hand greift den Angriff', 'und zieht ihn heran'], still),
    'tate-shuto-uke': S('Tate-shuto-uke', side([HIP_FAR, ...S_KK, arm([[112, 62], [150, 66], [184, 64]], 'vopen')]), '', ['seitlich: Arm fast gestreckt,', 'Handkante senkrecht'], still),
    'teisho-uke': F('Teisho-uke', fr([HIKITE_L, arm([[93, 62], [66, 90], [98, 96]], 'vopen')]), arrow('M44 98 L86 98'), ['von vorne: der Handballen wehrt ab'], still),
    uchiotoshi: F('Uchiotoshi', fr([HIKITE_L, arm([[93, 62], [74, 96], [112, 104]]), ghost(arm([[93, 62], [74, 40], [80, 14]]))]), arrow('M70 10 C56 50 72 86 104 96'), ['von vorne: Unterarm schlägt', 'den Angriff nach unten']),

    /* ---------- Geri ---------- */
    'yoko-geri-keage': S('Yoko-geri-keage', Object.assign({}, YOKO, { parts: yokoBase.concat([leg([[117, 118], [156, 96], [190, 64]], [198, 74]), ghost(leg([[117, 118], [150, 102], [128, 150]], [122, 158]))]) }), arrow('M126 164 C168 156 192 118 196 86') + arrow('M212 96 C206 126 186 150 150 160', true) + hit(204, 66), ['von vorne: Bein schnappt seitlich', 'nach oben und sofort zurück']),
    fumikomi: S('Fumikomi', side(MAE_BASE.concat([leg([[110, 116], [144, 170], [150, 226]], [168, 230]), ghost(leg([[110, 116], [148, 100], [140, 152]], [156, 158]))])), arrow('M162 160 L166 212') + hit(150, 232), ['seitlich: Knie hoch, der Fuß', 'stampft kräftig nach unten']),
    namigaeshi: F('Namigaeshi', fr([HIKITE_R, HIKITE_L, leg([[102, 118], [100, 152], [118, 172]], [126, 164]), ghost(LEG_R)], [KIBA[1]]), arrow('M84 222 C88 200 104 184 114 178'), ['von vorne: Fußsohle schnellt nach innen', 'hoch und wieder zurück (Tekki)']),
    'nidan-geri': S('Nidan-geri', { head: [114, 18], view: 'side', trunk: [[112, 40], [108, 104]], parts: [far(arm([[112, 50], [128, 78], [142, 68]])), leg([[106, 104], [138, 100], [120, 140]], [134, 148], { far: true }), arm([[112, 50], [104, 84], [118, 94]]), leg([[108, 104], [150, 92], [190, 72]], [196, 56])] }, arrow('M96 226 L98 166', true) + hit(198, 62), ['seitlich: zwei Tritte im Sprung'], still),
    'hiza-geri': S('Hiza-geri', side([far(arm([[112, 62], [140, 56], [154, 74]])), leg([[108, 116], [104, 176], [100, 228]], [118, 232], { far: true }), leg([[110, 116], [152, 90], [140, 146]], [156, 152]), arm([[112, 62], [144, 60], [160, 78]])]), arrow('M150 176 C164 150 168 120 162 100') + hit(164, 84), ['seitlich: das Knie stößt', 'nach oben'], still),
    'ren-geri': S('Ren-geri', side(MAE_BASE.concat([leg([[108, 116], [148, 96], [184, 70]], [192, 54]), ghost(leg([[108, 116], [152, 116], [194, 112]], [199, 96]))])), num(214, 102, 1) + num(208, 50, 2), ['seitlich: mehrere Tritte hintereinander']),
    'sonoba-geri': S('Sonoba-geri', side(MAE_BASE.concat([leg([[108, 116], [152, 116], [194, 112]], [199, 96]), ghost(leg([[108, 116], [112, 176], [114, 228]], [132, 232]))])), arrow('M138 214 C170 196 190 160 196 124') + arrow('M210 128 C206 170 180 206 150 222', true), ['seitlich: Tritt am Platz – der Fuß kehrt', 'in denselben Stand zurück']),
    'kizami-geri': S('Kizami-geri', side([HIP_FAR, leg([[106, 116], [72, 172], [38, 226]], [56, 232], { far: true }), arm([[112, 62], [132, 86], [150, 76]]), leg([[110, 116], [152, 112], [192, 108]], [197, 92]), ghost(leg([[110, 116], [142, 168], [138, 228]], [158, 232]))]), arrow('M152 218 C178 198 192 150 196 120') + hit(199, 96), ['seitlich: Tritt mit dem vorderen Bein,', 'ohne Schritt']),

    /* ---------- Kamae ---------- */
    'chudan-kamae': S('Chudan-kamae', side([GUARD_FAR, ...S_ZK, arm([[112, 62], [134, 88], [162, 76]])]), '', ['seitlich: Kampfhaltung, Hände', 'auf mittlerer Höhe'], still),
    'gedan-kamae': S('Gedan-kamae', side([GUARD_FAR, ...S_ZK, arm([[112, 62], [134, 100], [158, 124]])]), '', ['seitlich: Kampfhaltung, vordere Faust', 'unten über dem Knie'], still),
    'shuto-kamae': S('Shuto-kamae', side([far(arm([[112, 62], [118, 92], [136, 88]], 'open')), ...S_KK, arm([[112, 62], [138, 80], [160, 62]], 'open')]), '', ['seitlich (Kokutsu-dachi): beide', 'Hände als Handkanten'], still),
    'koshi-kamae': F('Koshi-kamae', fr([arm([[93, 62], [104, 96], [126, 104]]), arm([[127, 62], [140, 94], [130, 114]])]), ring(128, 110, 15), ['von vorne: beide Fäuste übereinander', 'an einer Hüfte'], still),
    'mizunagare-no-kamae': F('Mizunagare-no-kamae', fr([HIKITE_L, arm([[93, 62], [74, 100], [118, 86]])]), '', ['von vorne: Unterarm schräg vor dem', 'Solarplexus, zwei Fäuste entfernt'], still),
    hanmi: top({ label: 'Hanmi', head: [108, 148], view: 'top', trunk: [[80, 132], [136, 164]], trunkW: 20 }, foot(70, 104, 0, 0.5, { side: 'L' }) + foot(138, 200, 60, 0.5, { side: 'R' }), '', ['von oben: Oberkörper halb zur Seite', 'gedreht – vordere Schulter vorne']),
    'gyaku-hanmi': top({ label: 'Gyaku-hanmi', head: [112, 148], view: 'top', trunk: [[82, 164], [138, 132]], trunkW: 20 }, foot(70, 104, 0, 0.5, { side: 'L' }) + foot(138, 200, 60, 0.5, { side: 'R' }), '', ['von oben: Oberkörper zur Gegenseite', 'gedreht – hintere Schulter vorne']),
    shizentai: F('Shizentai', fr([arm([[93, 62], [86, 96], [94, 128]]), arm([[127, 62], [134, 96], [126, 128]])], SHIZEN), '', ['von vorne: natürliche Haltung,', 'Füße etwa schulterbreit'], still),
    hikite: S('Hikite', side([far(PUNCH), ...S_ZK, HIP_NEAR]), arrow('M176 86 C150 106 132 110 124 108') + ring(114, 104), ['seitlich: zurückgezogene Faust', 'an der Hüfte']),

    /* ---------- Begriffe ---------- */
    yoi: F('Yoi', fr([arm([[93, 62], [90, 96], [100, 118]]), arm([[127, 62], [130, 96], [120, 118]])], SHIZEN), '', ['von vorne: Bereitschaftsstellung'], still),
    rei: S('Rei', { head: [136, 42], view: 'side', trunk: [[126, 60], [108, 116]], parts: [far(arm([[124, 64], [124, 96], [122, 122]], 'open')), leg([[106, 116], [106, 176], [106, 228]], [124, 232], { far: true }), leg([[110, 116], [110, 176], [110, 228]], [128, 232]), arm([[124, 64], [126, 96], [124, 124]], 'open')] }, '', ['seitlich: Verbeugung'], still),
    seiza: S('Seiza', SEIZA(SEIZA.hands), '', ['seitlich: kniender Fersensitz'], still),
    mokuso: S('Mokuso', SEIZA([[116, 180], [128, 198]]), `<path d="M116 127 q3 2.5 6 0" stroke="${INK}" stroke-width="1.5" fill="none"/>`, ['seitlich: im Fersensitz,', 'Augen geschlossen'], still),
    kiritsu: S('Kiritsu', SEIZA(SEIZA.hands), arrow('M176 214 L176 110'), ['aus dem Fersensitz aufstehen'], still),
    mawatte: top({ label: 'Mawatte', parts: [] }, foot(80, 100, 0, 0.6, { side: 'L' }) + foot(136, 190, 25, 0.4, { side: 'R' }), arrow('M60 210 C14 150 50 54 150 50') + `<text x="186" y="120" font-size="16" font-weight="700" fill="${HL}" ${FONT}>180°</text>`, ['von oben: Drehung in die', 'Gegenrichtung']),
    kiai: S('Kiai', side([HIP_FAR, ...S_ZK, PUNCH]), `<path d="M132 24 l14 -8 M134 32 l17 0 M132 40 l14 8" stroke="${HL}" stroke-width="3" stroke-linecap="round"/>`, ['seitlich: lauter Schrei', 'im Moment des Treffers'], still),
    'sun-dome': S('Sun-dome', side([HIP_FAR, ...S_ZK, arm([[112, 62], [148, 52], [180, 44]])]), `<circle cx="210" cy="40" r="14" fill="none" stroke="${GHOST}" stroke-width="2.5" stroke-dasharray="4 3"/><path d="M190 30 V54 M195 30 V54" stroke="${HL}" stroke-width="2"/>`, ['seitlich: Technik stoppt kurz', 'vor dem Ziel'], still),
    'ashi-barai': S('Ashi-barai', side([GUARD_FAR, leg([[106, 116], [100, 176], [96, 228]], [114, 232], { far: true }), arm([[112, 62], [134, 88], [160, 78]]), leg([[110, 116], [146, 176], [186, 220]], [194, 208])]), `<path d="M212 150 L214 228 L232 232" stroke="${GHOST}" stroke-width="14" fill="none" stroke-linecap="round" stroke-dasharray="6 4"/>` + arrow('M140 226 L192 226'), ['seitlich: der Fuß fegt das Bein', 'des Gegners weg'], still),
    'yori-ashi': top({ label: 'Yori-ashi', parts: [] }, foot(80, 150, 0, 0, { side: 'L' }) + foot(136, 236, 25, 0, { side: 'R' }) + foot(80, 66, 0, 0.6, { side: 'L' }) + foot(136, 152, 25, 0.4, { side: 'R' }), arrow('M80 124 L80 98') + arrow('M136 210 L136 184'), ['von oben: beide Füße gleiten gemeinsam,', 'der Stand bleibt gleich']),
    'suri-ashi': top({ label: 'Suri-ashi', parts: [] }, foot(80, 130, 0, 0.6, { side: 'L' }) + foot(138, 222, 25, 0, { side: 'R' }) + foot(140, 50, 0, 0.4, { side: 'R' }), arrow('M136 198 C100 160 100 110 138 82'), ['von oben: der Fuß gleitet über den Boden', 'nah am Standbein vorbei nach vorne']),
    'tai-sabaki': top({ label: 'Tai-sabaki', parts: [] }, foot(108, 120, 0, 0, { side: 'L' }) + foot(150, 200, 25, 0, { side: 'R' }) + foot(52, 150, -50, 0.5, { side: 'L' }) + foot(98, 212, -40, 0.5, { side: 'R' }), arrow('M128 30 L128 112') + arrow('M138 172 C118 196 96 186 80 170'), ['von oben: der Körper weicht', 'aus der Angriffslinie aus']),
    maai: () => {
      const k = side([GUARD_FAR, ...S_ZK, arm([[112, 62], [134, 88], [162, 76]])]);
      return scene('Maai', 260, {}, `<g transform="translate(26 47.6) scale(.8)"><g transform="translate(-50 0)">${person(k)}</g><g transform="translate(310 0) scale(-1 1)">${person(k)}</g>${arrow('M96 150 L164 150', false, true)}</g>`, ['Abstand zwischen den Partnern'], still);
    },
    enbusen: () =>
      frame(
        220,
        260,
        'Enbusen',
        `<path d="M40 46 H180 M110 46 V176 M40 176 H180" stroke="#90a4ae" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="110" cy="176" r="9" fill="${HL}"/><text x="110" y="202" font-size="11" text-anchor="middle" fill="#455a64" ${FONT}>Start</text>`,
        ['Linie, auf der sich eine Kata bewegt', '(z. B. Heian Shodan: „工“-Form)']
      ),
  };

  SK.gfx.TECH = T;
})();
