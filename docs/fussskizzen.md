# Fußskizzen unter den einzelnen Bewegungen

Ergänzung zu `docs/buch-register.md`. Unter fast jeder Bewegung zeigt „Karate-Do Kata Vol. 1“ (JKA) eine kleine Skizze der
Füße. Die Kata-Ansage der App (`ansage` in `data/kata-*.js`) beruht bisher nur auf der Übersichtsskizze am Ende jeder Kata.
Hier stehen die Fakten aus den Einzelskizzen und dem Text dazu: Messwerte und Angaben in eigenen Worten, keine Bilder und
keine Abschriften.

## So sind die Einzelskizzen gezeichnet

- **Ausgefüllter Abdruck:** Platz und Zehenrichtung eines Fußes am Ende der Bewegung. Das breite Ende ist die Zehenseite.
- **Umrandeter Abdruck:** Platz eines Fußes vor der Bewegung.
- **Gepunkteter Pfeil:** Weg eines Fußes. Ein gerader Doppelpfeil hin und zurück zeigt einen Tritt, der wieder
  zurückkommt (z. B. Yoko-geri-keage).
- **Kleiner gebogener Pfeil an einem Abdruck mit Umriss darunter:** Der Fuß dreht sich auf der Stelle. Liegen Umriss und
  Abdruck leicht versetzt, dreht er über Ferse oder Ballen.
- **Nur der Ballen ausgefüllt:** Der Fuß steht auf dem Ballen (Kosa-dachi, Kreuzschritt in Tekki).
- **Zwei parallele kurze Pfeile an beiden Füßen:** Yori-ashi, beide Füße gleiten.
- **Bewegung ohne Skizze:** Der Stand bleibt unverändert.
- Oben in der Skizze ist vorne (Shomen) – wie in der Kata-Ansage. Die Skizzen sind schematisch: Die Abstände sind im
  Verhältnis zur Fußgröße größer als in Wirklichkeit, und der Maßstab wechselt etwas von Kata zu Kata. Richtungen und die
  Lage der Füße zueinander sind verlässlich.
- Manche Bewegungen haben zwei Skizzen (erst Drehen, dann Fußarbeit), z. B. Heian Godan 21 und 23 und Bassai Dai 25, 26 und 28.
  Die Tabellen messen jeweils die letzte Skizze.

## Abgleich mit der Kata-Ansage (Stand App v1.31.10)

Geprüft wurde jede Einzelskizze neben der Stellung der App und der Buchtext je Bewegung. Noch ist nichts davon in die
App übernommen. Wo nichts steht, passen Fußarbeit (welcher Fuß wandert, dreht oder bleibt) und Endstellung. Gemeint ist
immer die App-Stellung nach dem Ausgleich (`SK.ansagePoses`).

### Allgemein (Regeln in `js/kata-ansage.js`)
- **Vorderer Fuß im Zenkutsu-dachi:** In den Skizzen zeigt er im Mittel etwa 14° nach innen, in der App genau in
  Körperrichtung. `shape()` setzt ihn auf die Körperrichtung, wenn er weniger als 30° abweicht. Der hintere Fuß passt
  (Buch etwa 24°, App 22° nach außen). Folge: Wird der vordere Fuß beim nächsten Schritt zum hinteren, dreht er in der
  App oft gar nicht, weil er weniger als 20° dreht (`STILL.deg`). Das Buch zeigt diese Drehung fast immer mit Umriss und
  Pfeil, z. B. Heian Shodan 9, 15–17, Heian Godan 12, Bassai Dai 35, Kanku Dai 15, 43, 54, Jion 14. Betrifft alle Kata
  mit Zenkutsu-dachi.
- **Kreuzschritt in Tekki („Ashi-mae Kosa“, Tekki 1, 7, 21):** Im Buch steht der kreuzende Fuß auf dem Ballen direkt
  neben dem anderen, auf gleicher Höhe, Zehen nach vorne. In der App steht er vor dem anderen (`KOSA_FRONT`), bei Tekki 1
  zusätzlich auf 41° gedreht. Weil das Versetzen auch den stehenden Fuß mitzieht, verschiebt sich in Tekki 2, 8 und 22
  der Fuß, der laut Text am Platz bleibt (um 0,08).
- **Kosa-dachi nach Sprungschritt (Bassai Dai 1, Jion 31, auch Heian Yondan 13):** Im Buch zeigen beide Füße fast gerade
  nach vorne (etwa 0–10°), der hintere steht dicht an der Ferse des vorderen. In der App sind beide etwa 20–30° nach links
  gedreht, der hintere steht weiter weg.
- **Hizakutsu:** Im Buch drehen beide Füße deutlich weiter als in der App:

  | Stelle | Buch | App |
  |---|---|---|
  | Bassai Dai 11 | etwa 285° | 325°/314° |
  | Kanku Dai 7 | etwa 290–300° | 350°/342° |
  | Kanku Dai 9 | etwa 55–67° | 33°/20° |
  | Enpi 28 | etwa 290° | 327°/322° |

  In Bassai Dai 11 dreht laut Skizze auch der linke Fuß, in der App nicht.
- **Kiba-dachi in Tekki:** Im Buch zeigen die Zehen leicht nach innen (etwa 10–15°), in der App parallel (gering).

### Heian Shodan
- 12: Im Buch hat der Stand eine Spurbreite (der rechte Fuß steht rechts vom linken), in der App nicht. Der linke
  hintere Fuß dreht im Buch bis etwa 260°, in der App nur auf 223°.
- 3, 6, 13: In der App deutlich länger als die übrigen Zenkutsu-dachi der Kata, im Buch normal lang.

### Heian Nidan
- 20: Der rechte Standfuß dreht im Buch auf der Stelle, in der App nicht. 21: umgekehrt.
- 23: Der rechte hintere Fuß dreht im Buch bis etwa 300°, in der App nur auf 341°. Im Buch hat der Stand eine
  Spurbreite, in der App nicht.
- 25: In der App deutlich länger als die übrigen Zenkutsu-dachi der Kata. Ohne Spurbreite wie im Buch.

### Heian Sandan
- 7: Der linke Fuß tritt im Buch gerade nach vorne und steht genau vor dem rechten (Fersen auf einer Linie). In der App
  steht er 0,25 seitlich daneben.
- 9: Der Kiba-dachi ist in der App deutlich schmaler als die übrigen der Kata, im Buch normal breit.
- 18: Im Buch hat der Stand eine Spurbreite, in der App nicht.
- 19: Laut Text tritt zuerst der rechte Fuß neben den linken (hüftbreit), dann schiebt sich der linke weiter. In der App
  heißt es „Rechter Fuß bleibt“, und der rechte Fuß bewegt sich nicht.

### Heian Yondan
- 1, 2, 10: In der App deutlich länger als die übrigen gleichen Stände der Kata. 24, 26: deutlich kürzer. Im Buch sind
  alle normal lang.
- 16: Der linke hintere Fuß dreht im Buch bis etwa 100°, in der App bleibt er auf 135°.
- 18: Im Buch gleitet der rechte Fuß genau auf die Linie vor den linken (Richtung 221°, Körper 225°). In der App steht
  er 0,33 seitlich versetzt.

### Heian Godan
- 19 (Kosa-dachi nach dem Sprung): Im Buch zeigen beide Füße quer nach rechts (etwa 90°), in der App 65°.
- 21 und 23: Im Buch je zwei Skizzen, erst Drehen, dann Kokutsu-dachi (der vordere Fuß rückt etwas zurück, der hintere
  dreht quer). Die Endstellung passt.

### Bassai Dai
- 6: Der linke hintere Fuß dreht im Buch bis etwa 90–100°, in der App auf 62°.
- 23: Der rechte vordere Fuß steht im Buch deutlich schräg (etwa 140–150°), in der App auf 180°.
- 24: In der App deutlich kürzer als die übrigen Zenkutsu-dachi der Kata.
- 41: Der rechte Fuß zeigt im Buch etwa 128°, in der App 104°.

### Kanku Dai
- 3: Im Buch gleitet der linke Fuß deutlich nach links, in einen Kokutsu-dachi so lang wie in Heian Nidan 1. In der App
  bleibt er fast am Platz des Hachiji-dachi (von −0,22 nach −0,24).
- 16 und 36 (Ashi-zenkutsu, Gyaku-hanmi): Der linke Fuß zeigt im Buch etwa 215°, in der App 180°. Bei Heian Nidan 16
  hat die App selbst 216°.
- 24: Der linke vordere Fuß bleibt im Buch bei etwa 180°, in der App dreht er auf 211°.
- 29: Laut Text bleibt der linke Fuß am Platz, nur der rechte kommt ans Knie. Der App-Text sagt „linker Fuß rückt einen
  halben Schritt heran“, und der linke Fuß wandert 0,12.
- 45 und 54: In der App deutlich kürzer als die übrigen gleichen Stände der Kata.
- 48: Der rechte vordere Fuß zeigt im Buch etwa 54° (eingedreht), in der App 90°.
- 51: Laut Text und Skizze bleibt der linke Fuß am Platz und dreht nur. In der App wandert er 0,5 („Linker Fuß rückt
  heran“).
- 53: Im Buch steht der rechte Fuß direkt hinter dem linken (Fersen auf einer Linie), in der App seitlich versetzt.
- 56 (Yori-ashi): Im Buch gleiten beide Füße, in der App nur der linke.

### Jion
- 1: Der linke Fuß steht im Buch fast genau hinter dem rechten, in der App mit zu viel Spurbreite. Außerdem ist der Stand
  in der App kürzer als die übrigen.
- 4: Im Buch landet der rechte Fuß schräg links vorne auf der Diagonale (Richtung 320°). In der App steht er gerade vor
  dem linken (2°). Der linke hintere Fuß dreht im Buch bis etwa 270°, in der App bleibt er auf 315°.
- 7: Im Buch steht der rechte Fuß auf der Diagonale vorne (Richtung 45°). Die Zehen zeigen rechts etwa 22°, links
  etwa 3°. In der App: Richtung 71°, Zehen 45° und 25°.
- 9: Der rechte hintere Fuß dreht im Buch bis etwa 80°, in der App bleibt er auf 45°.
- 17 (deutlich): Im Buch gleitet der rechte Fuß weit nach vorne in einen normalen Zenkutsu-dachi. In der App stehen die
  Füße fast nebeneinander: Der rechte steht nur 0,02 vor dem linken und 0,41 daneben.
- 19 (Yori-ashi): Im Buch gleiten beide Füße, in der App nur der linke.
- 22: Im Buch normal lang, in der App nur 0,31 lang, der kürzeste Zenkutsu-dachi der Kata.
- 25 und 45 (Kiba-dachi): in der App 25 deutlich schmaler, 45 deutlich breiter als die übrigen, im Buch gleich.
- 39: Der rechte vordere Fuß zeigt im Buch etwa 79°, in der App 47°.
- 40: In der App deutlich länger als die übrigen Zenkutsu-dachi der Kata.
- 42: Der linke Fuß steht im Buch fast genau vor dem rechten, in der App mit zu viel Spurbreite.
- 46: Im Buch rückt auch der rechte Fuß etwas nach links (Yori-ashi), in der App dreht er nur.

### Enpi
- 2: Im Buch drehen beide Füße nur auf der Stelle (der Stand aus 1 ist schon so breit). Die App verschiebt beide Füße.
- 15: Laut Text und Skizze kommt der rechte Fuß hinter das linke Knie. Die App zeichnet ihn angehoben an der alten
  Stelle, darum sieht 16 („setzt ab“) wie Stillstand aus.
- 22: Laut Text und Skizze tauschen die Füße die Plätze: Der rechte gleitet zurück an die Stelle des linken, dann
  gleitet der linke vor an die Stelle des rechten. Die App bewegt nur den rechten.
- 24: In der App deutlich kürzer als die übrigen Kokutsu-dachi der Kata.
- 29: Im Buch rückt der linke Fuß nur wenig, die App verschiebt ihn um 0,31.
- 31: Laut Text zieht der linke Fuß erst einen halben Schritt zurück, dann gleitet der rechte vor. In der App dreht der
  linke nur.
- 34: Laut Text und Skizze gleiten beide Füße nach vorne (Richtung Shomen). Der App-Text sagt „Leichtes Yori-ashi
  zurück“, und die Füße rücken nach rechts.

## Tabellen

Erzeugt mit `python3 tools/kata-pdf/einzel_register.py` (braucht das PDF, siehe `tools/kata-pdf/README.md`).
- **Zehen links / rechts:** Zehenrichtung der ausgefüllten Abdrücke in Grad (0 = vorne, im Uhrzeigersinn). Welcher Abdruck
  der linke ist, ist der App-Stellung nach zugeordnet. Die Messung ist auf etwa ±10° genau. Bei stark verdeckten
  Abdrücken (Knien in Enpi 1) ist sie unbrauchbar.
- **Rechter Fuß vom linken aus:** Richtung vom linken zum rechten Abdruck in Grad.
- **Abstand:** Abstand der Abdrücke in Fußlängen der Skizze. Weil die Skizzen schematisch sind, ist das nur innerhalb
  einer Kata vergleichbar.
- **Laut Text:** Angaben des Buchtextes zur Fußarbeit, gekürzt und in eigenen Worten.

### Heian Shodan
<!-- einzel:heian-shodan -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 343° / 15° | 88° | 0,6 |  |
| Yoi | 1 | 336° / 28° | 89° | 2,5 |  |
| 1 | 1 | 298° / 327° | 84° | 3,7 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 2 | 1 | 247° / 251° | 287° | 4,0 | linkes Bein trägt, rechter Fuß gleitet vor |
| 3 | 1 | 58° / 75° | 96° | 3,0 | linkes Bein trägt, rechter Fuß gleitet zurück |
| 4 | 1 | 59° / 83° | 103° | 3,8 | rechter Fuß zieht zurück |
| 5 | 1 | 98° / 121° | 246° | 3,5 | rechtes Bein trägt, linker Fuß gleitet vor |
| 6 | 1 | 15° / 20° | 171° | 3,4 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 7 | 1 | 353° / 352° | 31° | 4,0 | rechter Fuß gleitet vor |
| 8 | 1 | 11° / 24° | 154° | 3,6 | linker Fuß gleitet vor |
| 9 | 1 | 353° / 351° | 30° | 3,9 | rechter Fuß gleitet vor |
| 10 | 1 | 99° / 109° | 257° | 3,6 | rechtes Bein trägt, dreht auf der Stelle |
| 11 | 1 | 55° / 77° | 114° | 3,4 | linkes Bein trägt, rechter Fuß gleitet vor |
| 12 | 1 | 260° / 262° | 281° | 2,7 | linkes Bein trägt, rechter Fuß gleitet zurück |
| 13 | 1 | 282° / 294° | 68° | 3,4 | rechtes Bein trägt, linker Fuß gleitet vor |
| 14 | 1 | 206° / 207° | 339° | 2,8 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 15 | 1 | 158° / 180° | 210° | 4,6 | linkes Bein trägt, rechter Fuß gleitet vor |
| 16 | 1 | 193° / 206° | 338° | 4,9 | rechtes Bein trägt, linker Fuß gleitet vor |
| 17 | 1 | 153° / 172° | 200° | 4,1 | linkes Bein trägt, rechter Fuß gleitet vor |
| 18 | 1 | 276° / 351° | 84° | 3,9 | rechtes Bein trägt, dreht auf der Stelle |
| 19 | 1 | 214° / 310° | 323° | 3,7 | linkes Bein trägt, rechter Fuß gleitet vor |
| 20 | 1 | 5° / 83° | 98° | 3,4 | linkes Bein trägt, dreht auf der Stelle |
| 21 | 1 | 49° / 145° | 216° | 3,7 | rechtes Bein trägt, linker Fuß gleitet vor |
| Naore | 1 | 345° / 21° | 92° | 2,3 | rechter Fuß bleibt |
| Rei (Ende) | 1 | 347° / 24° | 93° | 0,6 |  |
<!-- /einzel -->

### Heian Nidan
<!-- einzel:heian-nidan -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 344° / 16° | 90° | 0,6 |  |
| Yoi | 1 | 335° / 27° | 89° | 2,5 |  |
| 1 | 1 | 275° / 3° | 80° | 3,3 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 2 | keine | – | – | – | Stand bleibt |
| 3 | keine | – | – | – | Stand bleibt |
| 4 | 1 | 359° / 89° | 102° | 2,8 | Stand bleibt |
| 5 | keine | – | – | – | Stand bleibt |
| 6 | keine | – | – | – | Stand bleibt |
| 7 | 1 | ein Abdruck 86° | – | – | linker Fuß gleitet, rechtes Knie hoch |
| 8 | 1 | 0° / 87° | 169° | 3,6 |  |
| 9 | 1 | 269° / 355° | 8° | 4,0 | rechter Fuß gleitet vor |
| 10 | 1 | 358° / 90° | 170° | 3,2 | linker Fuß gleitet vor |
| 11 | 1 | 318° / 356° | 17° | 3,3 | rechter Fuß gleitet vor |
| 12 | 1 | 87° / 177° | 259° | 3,5 | rechtes Bein trägt, dreht auf der Stelle |
| 13 | 1 | 42° / 140° | 146° | 3,3 | linkes Bein trägt, rechter Fuß gleitet vor |
| 14 | 1 | 176° / 271° | 274° | 3,4 | linkes Bein trägt, dreht auf der Stelle |
| 15 | 1 | 217° / 316° | 34° | 3,2 | rechtes Bein trägt, linker Fuß gleitet vor |
| 16 | 1 | 201° / 200° | 335° | 1,7 | rechtes Bein trägt, dreht auf der Stelle |
| 17 | 1 | ein Abdruck 174° | – | – |  |
| 18 | 1 | 161° / 176° | 201° | 4,4 |  |
| 19 | 1 | 159° / 164° | 220° | 1,9 | dreht auf der Stelle |
| 20 | 1 | ein Abdruck 179° | – | – |  |
| 21 | 1 | 181° / 206° | 339° | 4,3 |  |
| 22 | 1 | 149° / 178° | 201° | 4,1 | rechter Fuß gleitet vor |
| 23 | 1 | 268° / 297° | 76° | 3,9 | rechtes Bein trägt, dreht auf der Stelle |
| 24 | 1 | 277° / 300° | 317° | 3,5 | rechter Fuß gleitet vor |
| 25 | 1 | 74° / 68° | 90° | 3,6 | linkes Bein trägt, rechter Fuß gleitet |
| 26 | 1 | 66° / 84° | 223° | 3,8 | linker Fuß gleitet vor |
| Naore | 1 | 329° / 36° | 89° | 2,1 | rechter Fuß bleibt |
| Rei (Ende) | 1 | 340° / 26° | 92° | 0,6 |  |
<!-- /einzel -->

### Heian Sandan
<!-- einzel:heian-sandan -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 343° / 16° | 88° | 0,6 |  |
| Yoi | 1 | 337° / 27° | 90° | 2,6 |  |
| 1 | 1 | 278° / 358° | 85° | 3,5 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 2 | 1 | ein Abdruck 269° | – | – | linker Fuß bleibt |
| 3 | keine | – | – | – | Stand bleibt |
| 4 | 1 | 0° / 81° | 97° | 3,2 | linkes Bein trägt, rechter Fuß gleitet zurück |
| 5 | 1 | ein Abdruck 91° | – | – | rechter Fuß bleibt |
| 6 | keine | – | – | – | Stand bleibt |
| 7 | 1 | 7° / 93° | 173° | 4,3 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 8 | 1 | 329° / 350° | 23° | 3,4 | rechter Fuß gleitet vor |
| 9 | 1 | 86° / 90° | 181° | 3,2 | dreht auf der Stelle |
| 10 | 1 | 337° / 349° | 31° | 3,3 | linkes Bein trägt, rechter Fuß gleitet nach links |
| 11 | 1 | ein Abdruck 172° | – | – | rechtes Bein trägt |
| 12 | 1 | 85° / 85° | 180° | 3,9 | stampft auf |
| 13 | keine | – | – | – | dreht auf der Stelle |
| 14 | 1 | 276° / 269° | 359° | 3,7 | stampft auf |
| 15 | keine | – | – | – | dreht auf der Stelle |
| 16 | 1 | 88° / 93° | 181° | 3,0 | stampft auf |
| 17 | keine | – | – | – | dreht auf der Stelle |
| 18 | 1 | 187° / 198° | 340° | 2,7 | rechtes Bein trägt, linker Fuß gleitet nach rechts |
| 19 | 1 | 359° / 3° | 92° | 2,9 | linker Fuß bleibt, dreht auf der Stelle |
| 20 | 1 | 10° / 349° | 91° | 2,8 | Stand bleibt, Abstoß mit dem linken Fuß, beide Füße gleiten nach rechts |
| Naore | 1 | 344° / 25° | 91° | 1,6 | linker Fuß bleibt |
| Rei (Ende) | 1 | 338° / 19° | 90° | 0,6 |  |
<!-- /einzel -->

### Heian Yondan
<!-- einzel:heian-yondan -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 343° / 17° | 90° | 0,6 |  |
| Yoi | 1 | 335° / 26° | 89° | 2,5 |  |
| 1 | 1 | 279° / 1° | 85° | 3,5 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 2 | 1 | 0° / 84° | 97° | 3,5 | Stand bleibt |
| 3 | 1 | 2° / 11° | 156° | 2,9 | rechtes Bein trägt, linker Fuß gleitet vor |
| 4 | 1 | 272° / 358° | 11° | 3,5 | rechter Fuß gleitet vor |
| 5 | 1 | ein Abdruck 356° | – | – | linkes Knie hoch |
| 6 | keine | – | – | – | Stand bleibt |
| 7 | 1 | 281° / 303° | 84° | 2,9 |  |
| 8 | 1 | ein Abdruck 2° | – | – | linker Fuß gleitet, rechtes Knie hoch |
| 9 | keine | – | – | – | Stand bleibt |
| 10 | 1 | 56° / 76° | 97° | 2,9 |  |
| 11 | 1 | 3° / 325° | 91° | 3,2 | Stand bleibt |
| 12 | 1 | ein Abdruck 350° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 13 | 1 | ein Abdruck 339° | – | – |  |
| 14 | 1 | 126° / 234° | 298° | 3,9 | rechtes Bein trägt, dreht auf der Stelle |
| 15 | 1 | ein Abdruck 131° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 16 | 1 | 102° / 125° | 152° | 4,3 |  |
| 17 | keine | – | – | – |  |
| 18 | 1 | 117° / 209° | 221° | 3,2 |  |
| 19 | 1 | ein Abdruck 220° | – | – | rechter Fuß bleibt, linkes Knie hoch |
| 20 | 1 | 216° / 239° | 27° | 4,7 |  |
| 21 | keine | – | – | – |  |
| 22 | 1 | 188° / 261° | 354° | 3,1 | rechtes Bein trägt |
| 23 | 1 | 90° / 178° | 195° | 3,3 | rechter Fuß gleitet vor |
| 24 | 1 | 180° / 273° | 351° | 3,8 | linker Fuß gleitet vor |
| 25 | 1 | ein Abdruck 180° | – | – |  |
| 26 | 1 | 4° / 85° | 172° | 3,9 |  |
| 27 | 1 | 267° / 1° | 10° | 4,0 | rechter Fuß gleitet vor |
| Naore | 1 | 328° / 25° | 89° | 2,0 | linker Fuß bleibt |
| Rei (Ende) | 1 | 338° / 24° | 91° | 0,7 |  |
<!-- /einzel -->

### Heian Godan
<!-- einzel:heian-godan -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 343° / 16° | 88° | 0,6 |  |
| Yoi | 1 | 336° / 29° | 90° | 2,5 |  |
| 1 | 1 | 278° / 354° | 85° | 3,4 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 2 | keine | – | – | – | Stand bleibt |
| 3 | 1 | ein Abdruck 358° | – | – | linker Fuß bleibt |
| 4 | 1 | 355° / 90° | 99° | 3,8 | linker Fuß bleibt, rechter Fuß gleitet nach rechts |
| 5 | keine | – | – | – | Stand bleibt |
| 6 | 1 | ein Abdruck 4° | – | – | rechter Fuß bleibt |
| 7 | 1 | 270° / 359° | 10° | 4,2 | rechter Fuß gleitet vor |
| 8 | 1 | 16° / 25° | 162° | 2,7 | rechtes Bein trägt, linker Fuß gleitet vor |
| 9 | keine | – | – | – |  |
| 10 | keine | – | – | – | Stand bleibt |
| 11 | keine | – | – | – | Stand bleibt |
| 12 | 1 | 337° / 348° | 19° | 3,1 | linkes Bein trägt, rechter Fuß gleitet vor |
| 13 | 1 | 84° / 85° | 180° | 2,8 | linkes Bein trägt, dreht auf der Stelle |
| 14 | keine | – | – | – | Stand bleibt |
| 15 | 1 | ein Abdruck 2° | – | – |  |
| 16 | 1 | 272° / 270° | 0° | 3,1 |  |
| 17 | 1 | ein Abdruck 266° | – | – | dreht auf der Stelle |
| 18 | 1 | 178° / 272° | 343° | 2,4 |  |
| 19 | 1 | ein Abdruck 82° | – | – | Sprung, Abstoß mit dem rechten Fuß |
| 20 | 1 | 120° / 167° | 185° | 3,8 |  |
| 21 | 2 | 3° / 83° | 171° | 4,2 | Stand bleibt |
| 22 | 1 | 84° / 94° | 180° | 0,4 |  |
| 23 | 2 | 272° / 0° | 11° | 3,2 | linkes Bein trägt, rechter Fuß gleitet nach links |
| Naore | 1 | 336° / 12° | 87° | 2,4 | linker Fuß bleibt |
| Rei (Ende) | 1 | 338° / 22° | 90° | 0,7 |  |
<!-- /einzel -->

### Tekki Shodan
<!-- einzel:tekki-shodan -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 345° / 17° | 90° | 0,6 |  |
| Yoi | 1 | ein Abdruck 356° | – | – |  |
| 1 | 1 | ein Abdruck 1° | – | – |  |
| 2 | 1 | 13° / 348° | 91° | 3,0 | linker Fuß bleibt, rechtes Knie hoch, stampft auf |
| 3 | keine | – | – | – | Stand bleibt |
| 4 | keine | – | – | – | Stand bleibt |
| 5 | keine | – | – | – |  |
| 6 | keine | – | – | – | Stand bleibt |
| 7 | 1 | ein Abdruck 13° | – | – |  |
| 8 | 1 | 12° / 344° | 90° | 2,4 | rechter Fuß bleibt, linkes Knie hoch, stampft auf |
| 9 | keine | – | – | – | Stand bleibt |
| 10 | keine | – | – | – |  |
| 11 | 1 | 13° / 345° | 89° | 3,2 | dreht auf der Stelle, stampft auf |
| 12 | keine | – | – | – |  |
| 13 | 1 | 12° / 345° | 90° | 3,2 | dreht auf der Stelle, stampft auf |
| 14 | keine | – | – | – | Stand bleibt |
| 15 | keine | – | – | – | Stand bleibt |
| 16 | keine | – | – | – | Stand bleibt |
| 17 | keine | – | – | – | Stand bleibt |
| 18 | keine | – | – | – | Stand bleibt |
| 19 | keine | – | – | – |  |
| 20 | keine | – | – | – | Stand bleibt |
| 21 | 1 | ein Abdruck 345° | – | – |  |
| 22 | 1 | 12° / 345° | 87° | 2,4 | linker Fuß bleibt, rechtes Knie hoch, stampft auf |
| 23 | keine | – | – | – | Stand bleibt |
| 24 | keine | – | – | – |  |
| 25 | 1 | 13° / 347° | 91° | 3,2 | dreht auf der Stelle |
| 26 | keine | – | – | – |  |
| 27 | 1 | 12° / 346° | 90° | 3,3 | dreht auf der Stelle |
| 28 | keine | – | – | – | Stand bleibt |
| 29 | keine | – | – | – | Stand bleibt |
| Naore | 1 | ein Abdruck 1° | – | – | linker Fuß bleibt |
| Rei (Ende) | 1 | 333° / 24° | 90° | 0,7 |  |
<!-- /einzel -->

### Bassai Dai
<!-- einzel:bassai-dai -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 344° / 16° | 89° | 0,6 |  |
| Yoi | 1 | 357° / 6° | 90° | 0,5 |  |
| 1 | 1 | ein Abdruck 354° | – | – |  |
| 2 | 1 | 202° / 201° | 352° | 4,0 | rechtes Bein trägt, linker Fuß gleitet zurück |
| 3 | keine | – | – | – | Stand bleibt |
| 4 | 1 | 336° / 333° | 15° | 3,6 | linkes Bein trägt |
| 5 | keine | – | – | – | Stand bleibt |
| 6 | 1 | 74° / 75° | 96° | 4,2 | linkes Bein trägt, rechter Fuß gleitet vor |
| 7 | keine | – | – | – | Stand bleibt |
| 8 | 1 | 338° / 17° | 90° | 3,4 |  |
| 9 | keine | – | – | – |  |
| 10 | keine | – | – | – | Stand bleibt |
| 11 | 1 | 288° / 282° | 87° | 3,1 | dreht auf der Stelle |
| 12 | 1 | ein Abdruck 21° | – | – | Stand bleibt |
| 13 | 1 | 78° / 80° | 92° | 3,5 | dreht auf der Stelle |
| 14 | 1 | 272° / 357° | 4° | 4,1 | rechter Fuß gleitet nach links |
| 15 | 1 | 5° / 84° | 172° | 4,2 | linker Fuß gleitet vor |
| 16 | 1 | 268° / 359° | 7° | 4,3 | rechter Fuß gleitet vor |
| 17 | 1 | 358° / 87° | 173° | 4,1 | rechter Fuß gleitet |
| 18 | 2 | ein Abdruck 25° | – | – | Stand bleibt |
| 19 | 1 | ein Abdruck 283° | – | – | rechtes Knie hoch |
| 20 | 1 | 183° / 269° | 354° | 4,3 |  |
| 21 | 1 | 89° / 174° | 187° | 4,3 | rechter Fuß gleitet vor |
| 22 | 1 | 176° / 181° | 269° | 0,5 | linker Fuß bleibt |
| 23 | 1 | 153° / 139° | 181° | 5,6 | linker Fuß bleibt, rechter Fuß gleitet vor, stampft auf |
| 24 | 1 | 164° / 153° | 188° | 4,3 | Stand bleibt, Abstoß mit dem rechten Fuß, beide Füße gleiten vor |
| 25 | 1 | – | – | – | rechtes Bein trägt |
| 26 | 2 | ein Abdruck 278° | – | – | linkes Bein trägt, rechtes Knie hoch, stampft auf |
| 27 | keine | – | – | – | Stand bleibt |
| 28 | 1 | – | – | – |  |
| 29 | keine | – | – | – | Stand bleibt |
| 30 | keine | – | – | – | Stand bleibt |
| 31 | keine | – | – | – | Stand bleibt |
| 32 | 2 | ein Abdruck 161° | – | – |  |
| 33 | keine | – | – | – | Stand bleibt |
| 34 | 1 | 177° / 185° | 268° | 0,5 |  |
| 35 | 1 | 198° / 208° | 354° | 4,3 | linkes Knie hoch, stampft auf |
| 36 | 1 | 173° / 184° | 270° | 0,5 |  |
| 37 | 1 | 157° / 164° | 182° | 4,3 | rechtes Knie hoch, stampft auf |
| 38 | 1 | 288° / 280° | 90° | 4,6 | rechtes Bein trägt, dreht auf der Stelle |
| 39 | 1 | 68° / 60° | 89° | 4,9 | Stand bleibt, dreht auf der Stelle |
| 40 | 1 | 319° / 41° | 50° | 5,3 | rechter Fuß gleitet schräg |
| 41 | 1 | 49° / 128° | 142° | 5,7 | dreht auf der Stelle, rechter Fuß gleitet, linkes Bein trägt |
| 42 | 1 | 319° / 36° | 129° | 5,6 | linker Fuß gleitet nach links |
| Naore | 1 | 351° / 3° | 88° | 0,5 |  |
| Rei (Ende) | 1 | 332° / 28° | 88° | 1,2 |  |
<!-- /einzel -->

### Kanku Dai
<!-- einzel:kanku-dai -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 344° / 17° | 90° | 0,6 |  |
| Yoi | 1 | 336° / 21° | 89° | 3,2 |  |
| 1 | keine | – | – | – | Stand bleibt |
| 2 | keine | – | – | – | Stand bleibt |
| 3 | 1 | 278° / 355° | 81° | 4,0 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 4 | 1 | 2° / 84° | 96° | 4,3 |  |
| 5 | 1 | 336° / 13° | 89° | 4,9 |  |
| 6 | keine | – | – | – | Stand bleibt |
| 7 | 1 | 291° / 303° | 86° | 4,2 | dreht auf der Stelle |
| 8 | 1 | 343° / 15° | 92° | 4,8 | Stand bleibt |
| 9 | 1 | 67° / 54° | 90° | 4,4 | dreht auf der Stelle |
| 10 | 1 | ein Abdruck 77° | – | – | rechtes Knie hoch |
| 11 | keine | – | – | – | Stand bleibt |
| 12 | 1 | 3° / 90° | 175° | 4,2 |  |
| 13 | 1 | 271° / 4° | 6° | 4,1 | rechter Fuß gleitet vor |
| 14 | 1 | 1° / 80° | 171° | 4,2 | linker Fuß gleitet vor |
| 15 | 1 | ein Abdruck 343° | – | – | rechter Fuß gleitet vor |
| 16 | 1 | 217° / 203° | 349° | 3,1 | rechtes Bein trägt |
| 17 | 1 | ein Abdruck 184° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 18 | 1 | 357° / 80° | 174° | 4,0 |  |
| 19 | 1 | 10° / 43° | 176° | 4,1 | rechtes Bein trägt |
| 20 | 1 | 1° / 43° | 167° | 2,0 | rechter Fuß bleibt, linker Fuß zieht zurück |
| 21 | 1 | 5° / 10° | 174° | 2,1 | rechter Fuß bleibt |
| 22 | 1 | ein Abdruck 2° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 23 | 1 | 179° / 273° | 359° | 3,9 |  |
| 24 | 1 | 177° / 215° | 353° | 4,1 | rechtes Bein trägt |
| 25 | 1 | 190° / 219° | 343° | 2,0 | rechter Fuß bleibt, linker Fuß zieht zurück |
| 26 | 1 | ein Abdruck 188° | – | – | linkes Knie hoch |
| 27 | keine | – | – | – | Stand bleibt |
| 28 | 1 | 110° / 107° | 268° | 4,4 |  |
| 29 | 1 | ein Abdruck 174° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 30 | keine | – | – | – | Stand bleibt |
| 31 | 1 | 242° / 245° | 273° | 4,8 |  |
| 32 | 1 | 86° / 181° | 270° | 4,2 | rechtes Bein trägt |
| 33 | 1 | 52° / 137° | 143° | 5,2 | linkes Bein trägt, rechter Fuß gleitet vor |
| 34 | 1 | 178° / 266° | 275° | 4,3 | dreht auf der Stelle |
| 35 | 1 | 241° / 315° | 51° | 5,3 | rechtes Bein trägt, linker Fuß gleitet vor |
| 36 | 1 | 215° / 26° | 346° | 2,9 | rechtes Bein trägt |
| 37 | 1 | ein Abdruck 179° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 38 | 1 | ein Abdruck 171° | – | – |  |
| 39 | 1 | 162° / 167° | 192° | 4,6 | rechter Fuß bleibt, linker Fuß gleitet zurück |
| 40 | keine | – | – | – | Stand bleibt |
| 41 | keine | – | – | – | Stand bleibt |
| 42 | 1 | ein Abdruck 11° | – | – | rechtes Knie hoch |
| 43 | 1 | 336° / 348° | 0° | 4,6 |  |
| 44 | 1 | 181° / 270° | 359° | 3,8 | Stand bleibt |
| 45 | 1 | 86° / 180° | 186° | 3,7 | rechter Fuß gleitet vor |
| 46 | 1 | 293° / 288° | 82° | 4,0 | rechtes Bein trägt, dreht auf der Stelle |
| 47 | keine | – | – | – | Stand bleibt |
| 48 | 1 | 51° / 54° | 102° | 4,8 | linkes Bein trägt |
| 49 | keine | – | – | – | Stand bleibt |
| 50 | keine | – | – | – | Stand bleibt |
| 51 | 1 | ein Abdruck 89° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 52 | keine | – | – | – | Stand bleibt |
| 53 | 1 | 7° / 91° | 176° | 3,8 |  |
| 54 | 1 | 332° / 351° | 9° | 4,5 | linkes Bein trägt, rechter Fuß gleitet vor |
| 55 | 1 | 105° / 86° | 182° | 3,8 | dreht auf der Stelle, linker Fuß gleitet vor |
| 56 | 1 | 93° / 88° | 179° | 4,2 | Abstoß mit dem rechten Fuß, beide Füße gleiten nach links |
| 57 | keine | – | – | – | Stand bleibt |
| 58 | keine | – | – | – | Stand bleibt |
| 59 | keine | – | – | – |  |
| 60 | 1 | 279° / 262° | 3° | 3,8 | rechtes Bein trägt, linkes Knie hoch, stampft auf |
| 61 | keine | – | – | – | Stand bleibt |
| 62 | 1 | 253° / 277° | 359° | 4,3 |  |
| 63 | 1 | 181° / 179° | 186° | 4,3 | dreht auf der Stelle |
| 64 | keine | – | – | – | Stand bleibt, linker Fuß gleitet |
| 65 | 1 | 174° / 162° | 189° | 4,2 |  |
| Naore | keine | – | – | – | rechtes Bein trägt, Drehung auf dem rechten Fuß |
| Rei (Ende) | 1 | 350° / 18° | 87° | 0,7 |  |
<!-- /einzel -->

### Jion
<!-- einzel:jion -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 345° / 18° | 91° | 0,6 |  |
| Yoi | 1 | 354° / 9° | 90° | 0,5 |  |
| 1 | 1 | 334° / 351° | 8° | 4,5 | rechter Fuß bleibt, linker Fuß gleitet zurück |
| 2 | 1 | 356° / 359° | 134° | 4,4 | rechtes Bein trägt |
| 3 | 1 | ein Abdruck 328° | – | – | linker Fuß bleibt, rechtes Knie hoch |
| 4 | 1 | 268° / 303° | 320° | 4,7 |  |
| 5 | keine | – | – | – |  |
| 6 | keine | – | – | – |  |
| 7 | 1 | 3° / 22° | 45° | 4,7 |  |
| 8 | 1 | ein Abdruck 44° | – | – | rechter Fuß bleibt, linkes Knie hoch |
| 9 | 1 | 54° / 81° | 219° | 4,7 |  |
| 10 | keine | – | – | – |  |
| 11 | keine | – | – | – |  |
| 12 | 1 | 17° / 12° | 164° | 4,2 | rechter Fuß bleibt |
| 13 | keine | – | – | – | Stand bleibt |
| 14 | 1 | 327° / 326° | 7° | 5,1 |  |
| 15 | keine | – | – | – | Stand bleibt |
| 16 | 1 | 20° / 26° | 160° | 4,4 |  |
| 17 | 1 | 344° / 355° | 20° | 4,3 | linkes Bein trägt, rechter Fuß gleitet vor |
| 18 | 1 | 89° / 176° | 260° | 4,0 |  |
| 19 | 1 | 177° / 173° | 270° | 4,3 | Abstoß mit dem rechten Fuß, beide Füße gleiten nach links |
| 20 | 1 | 185° / 273° | 278° | 4,0 | linkes Bein trägt |
| 21 | 1 | 178° / 176° | 271° | 4,4 | Abstoß mit dem linken Fuß, beide Füße gleiten nach rechts |
| 22 | 1 | 201° / 214° | 356° | 4,4 | rechtes Bein trägt, linker Fuß gleitet vor |
| 23 | 1 | 95° / 75° | 175° | 3,9 | linkes Bein trägt, rechter Fuß gleitet vor |
| 24 | 1 | 282° / 267° | 0° | 4,1 | rechtes Bein trägt, linker Fuß gleitet vor |
| 25 | 1 | 103° / 78° | 179° | 4,7 | linkes Bein trägt, rechter Fuß gleitet vor |
| 26 | 1 | 270° / 353° | 80° | 3,8 | rechtes Bein trägt, dreht auf der Stelle |
| 27 | 1 | 353° / 2° | 86° | 0,5 |  |
| 28 | 1 | 1° / 90° | 97° | 4,2 | rechter Fuß gleitet nach rechts |
| 29 | 1 | 356° / 1° | 95° | 0,5 |  |
| 30 | keine | – | – | – | Stand bleibt |
| 31 | 1 | ein Abdruck 354° | – | – |  |
| 32 | 1 | ein Abdruck 335° | – | – |  |
| 33 | 1 | 31° / 216° | 168° | 5,3 | linker Fuß gleitet vor |
| 34 | 1 | ein Abdruck 335° | – | – | rechter Fuß gleitet vor |
| 35 | keine | – | – | – |  |
| 36 | keine | – | – | – | Stand bleibt |
| 37 | keine | – | – | – | Stand bleibt |
| 38 | 1 | 123° / 112° | 259° | 5,3 | rechtes Bein trägt, dreht auf der Stelle |
| 39 | 1 | 78° / 79° | 110° | 4,2 | linkes Bein trägt, rechter Fuß gleitet vor |
| 40 | 1 | 253° / 248° | 285° | 4,2 | linkes Bein trägt, rechter Fuß gleitet zurück |
| 41 | 1 | ein Abdruck 294° | – | – | linker Fuß gleitet vor |
| 42 | 1 | 201° / 206° | 349° | 4,5 | rechtes Bein trägt, linker Fuß gleitet nach links |
| 43 | 1 | 92° / 78° | 177° | 4,0 | stampft auf |
| 44 | 1 | 278° / 257° | 1° | 4,0 | rechtes Bein trägt, linkes Knie hoch, stampft auf |
| 45 | 1 | 95° / 90° | 179° | 4,4 | linkes Bein trägt, rechtes Knie hoch, stampft auf |
| 46 | 1 | 5° / 358° | 88° | 4,4 | rechtes Bein trägt, dreht auf der Stelle, Abstoß mit dem rechten Fuß, beide Füße gleiten nach links |
| 47 | 1 | 12° / 355° | 92° | 4,2 | Abstoß mit dem linken Fuß, beide Füße gleiten, beide Füße gleiten nach rechts |
| Naore | 1 | 0° / 10° | 87° | 0,5 | linker Fuß bleibt |
| Rei (Ende) | 1 | ein Abdruck 32° | – | – |  |
<!-- /einzel -->

### Enpi
<!-- einzel:enpi -->
| Nr | Skizzen | Zehen links / rechts | rechter Fuß vom linken aus | Abstand | Laut Text |
|---|---|---|---|---|---|
| Rei | 1 | 343° / 17° | 90° | 0,6 |  |
| Yoi | 1 | 353° / 7° | 93° | 0,5 |  |
| 1 | 1 | 268° / 133° | 83° | 4,2 | rechter Fuß bleibt, linker Fuß gleitet nach links |
| 2 | 1 | 351° / 22° | 92° | 3,3 |  |
| 3 | 1 | 40° / 78° | 97° | 3,6 |  |
| 4 | 1 | 1° / 357° | 91° | 3,7 | Stand bleibt |
| 5 | 1 | 23° / 22° | 159° | 4,3 | rechtes Bein trägt, linker Fuß gleitet vor |
| 6 | keine | – | – | – | Stand bleibt |
| 7 | 1 | ein Abdruck 335° | – | – | rechtes Knie hoch |
| 8 | 1 | 198° / 210° | 348° | 5,1 | rechter Fuß bleibt |
| 9 | 1 | 203° / 202° | 349° | 4,8 | rechtes Bein trägt |
| 10 | keine | – | – | – | Stand bleibt |
| 11 | 1 | ein Abdruck 152° | – | – | rechtes Knie hoch |
| 12 | 1 | 18° / 20° | 165° | 4,5 | rechter Fuß bleibt |
| 13 | 1 | 16° / 22° | 165° | 4,9 | rechtes Bein trägt |
| 14 | 1 | 7° / 352° | 90° | 4,0 | linkes Knie hoch |
| 15 | 1 | ein Abdruck 3° | – | – | linker Fuß bleibt |
| 16 | 1 | 0° / 354° | 89° | 4,0 | linker Fuß bleibt |
| 17 | keine | – | – | – | Stand bleibt |
| 18 | keine | – | – | – | Stand bleibt |
| 19 | 1 | 298° / 292° | 79° | 4,1 | rechter Fuß bleibt |
| 20 | keine | – | – | – | Stand bleibt |
| 21 | 1 | 176° / 261° | 272° | 3,9 | linker Fuß bleibt, rechter Fuß gleitet vor |
| 22 | 1 | 270° / 355° | 82° | 4,1 | rechter Fuß gleitet zurück, linker Fuß gleitet vor |
| 23 | keine | – | – | – | Stand bleibt |
| 24 | 1 | 178° / 260° | 271° | 3,8 | linker Fuß bleibt, rechter Fuß gleitet vor |
| 25 | 1 | 112° / 109° | 257° | 4,2 | rechtes Bein trägt |
| 26 | keine | – | – | – | Stand bleibt |
| 27 | 1 | ein Abdruck 58° | – | – | rechtes Knie hoch |
| 28 | 1 | 287° / 290° | 79° | 4,8 | rechter Fuß bleibt |
| 29 | 1 | 293° / 296° | 80° | 4,7 | rechtes Bein trägt |
| 30 | keine | – | – | – | Stand bleibt |
| 31 | 1 | 334° / 342° | 8° | 4,4 | linker Fuß zieht zurück, rechter Fuß gleitet vor |
| 32 | 1 | 16° / 14° | 167° | 4,3 | linker Fuß gleitet vor |
| 33 | 1 | 336° / 341° | 10° | 4,5 | rechter Fuß gleitet vor |
| 34 | 1 | 274° / 355° | 7° | 3,8 | Abstoß mit dem linken Fuß, beide Füße gleiten |
| 35 | 1 | 335° / 345° | 359° | 4,1 | Abstoß mit dem linken Fuß, beide Füße gleiten |
| 36 | 1 | 277° / 353° | 8° | 3,7 | Sprung |
| 37 | 1 | 353° / 82° | 172° | 4,1 | rechter Fuß gleitet |
| Naore | 1 | ein Abdruck 4° | – | – |  |
| Rei (Ende) | 1 | 331° / 29° | 91° | 1,3 |  |
<!-- /einzel -->
