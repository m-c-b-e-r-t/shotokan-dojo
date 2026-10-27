# Shotokan Dojo – Lernen & Quiz

Statische Lern- und Quiz-App (Deutsch) zu Shotokan-Karate nach JKA/DJKB: Etikette, Geschichte, Begriffe, Stände, Kihon, Kumite, detailliertes Kata-Wissen und das DJKB-Prüfungsprogramm (9. Kyu bis 5. Dan).

- Kata-Fragen stammen ausschließlich aus „Karate-Do Kata Vol. 1“ (JKA) – mit Angabe der gedruckten Buchseiten.
- Getrennte Bereiche: **Wissen** (alle Inhalte + Lexikon mit Grafiken), **Quiz** (Lernpfad, Zufallsmix aus dem Gesamtpool), **Begriffe-Trainer** (Stände, Techniken, Körperwaffen stumpf abfragen), **Prüfungen** (DJKB-Prüfungsprogramm je Gürtel, unterteilt in Kihon, Kata, Kumite und Theorie).
- **Kata-Ansage** (alle zehn Kata des Buches): zählt die Kata auf Japanisch im Rhythmus des Buches (fließend, langsam, Kiai; wie im Dojo bis 10, dann wieder ab 1), zeigt jede Stellung auf einer Bodenkarte von oben nach der Embusen-Skizze im Buch und hält den Bildschirm an.
- Lernpfad mit Freischalten, XP, Tages-Serie, Wiederholung nach Karteikasten-Prinzip.
- Fortschritt nur lokal im Browser (localStorage), Export/Import unter „Fortschritt“.

## Lokal starten

`index.html` im Browser öffnen – kein Build, kein Server nötig.

## Werkzeuge

- `tools/test/validate.html` – prüft Datenkonsistenz (Fragen, Kata, Prüfungsprogramm); vor jedem Commit.
- `tools/test/smoke.html` – klickt automatisch durch Prüfungsseiten, Lektionen und Quiz; löscht dabei den lokalen Fortschritt und läuft deshalb nur lokal (`file://` oder `localhost`).
- `tools/test/gfx.html` – Vorschau aller Grafiken.
- `tools/version.js` – Versionsnummer setzen (siehe unten).
- `tools/kata-pdf/` – Python-Skripte, die Text und Fußskizzen aus dem Kata-Buch auswerten (siehe README dort).
- `tools/register-tabellen.js` – schreibt die Ablauftabellen der Kata aus den App-Daten in `docs/buch-register.md`.
- `docs/buch-register.md` – Nachschlage-Register zum Buch (Seiten, Kapitel, Hinweise je Bewegung, Abläufe) in eigenen Worten, damit das PDF nicht nötig ist.

## Neue Version veröffentlichen

`node tools/version.js patch` (bzw. `minor`, `major` oder z. B. `1.12.0`) setzt Versionsnummer, Datum und Uhrzeit in `js/core.js` und hängt `?v=<Version>` an alle Dateien in `index.html`, damit Browser nach dem Update keine alten Dateien verwenden. Ohne Argument prüft das Skript, ob `index.html` zur Version passt.

## Fragen-IDs

Fragen-IDs ergeben sich aus Lektion, Fragetext und richtiger Antwort (`SK.qb` in `js/core.js`). Fragen dürfen daher eingefügt, gelöscht und umsortiert werden, ohne dass der gespeicherte Fortschritt bei anderen Fragen landet. Wird Fragetext oder Lösung geändert, gilt die Frage als neu. `data/legacy-ids.js` ist eingefroren und überträgt nur alte Speicherstände (bis v1.10.1, laufende Nummern) einmalig auf die neuen IDs.

## Veröffentlichen auf GitHub Pages

1. In VS Code bei GitHub anmelden und „Publish to GitHub“ wählen (öffentliches Repository).
2. Auf github.com: **Settings → Pages → Branch `main`, Ordner `/ (root)`**.
3. Die Seite ist danach unter `https://<benutzername>.github.io/<repo>/` erreichbar.

Das Kata-PDF und alle daraus extrahierten Texte (`tools/out/`) sind per `.gitignore` ausgeschlossen und dürfen nicht veröffentlicht werden.

## Quellen

- Japan Karate Association: *Karate-Do Kata Vol. 1* (2003)
- DJKB-Prüfungsordnung (Stand Juli 2013), DJKB-Übersichten Prüfungsprogramm Kihon/Kata/Kumite – djkb.com
- Allgemeines Wissen u. a. nach Wikipedia (Shōtōkan, Gichin Funakoshi, Japan Karate Association)

Prüfungsangaben ohne Gewähr – maßgeblich ist die jeweils gültige DJKB-Prüfungsordnung.
