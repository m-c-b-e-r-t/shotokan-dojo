# Shotokan Dojo – Lernen & Quiz

Statische Lern- und Quiz-App (Deutsch) zu Shotokan-Karate nach JKA/DJKB: Etikette, Geschichte, Begriffe, Stände, Kihon, Kumite, DJKB-Prüfungen (9. Kyu bis 3. Dan) und detailliertes Kata-Wissen.

- Kata-Fragen stammen ausschließlich aus „Karate-Do Kata Vol. 1“ (JKA) – mit Angabe der gedruckten Buchseiten.
- Getrennte Bereiche: **Wissen** (alle Inhalte + Lexikon mit Grafiken), **Quiz** (Lernpfad, Zufallsmix aus dem Gesamtpool), **Begriffe-Trainer** (Stände, Techniken, Körperwaffen stumpf abfragen), **Prüfung**.
- Lernpfad mit Freischalten, XP, Tages-Serie, Wiederholung nach Karteikasten-Prinzip, Prüfungssimulation.
- Fortschritt nur lokal im Browser (localStorage), Export/Import unter „Fortschritt“.

## Lokal starten

`index.html` im Browser öffnen – kein Build, kein Server nötig.

Prüfwerkzeuge: `tools/validate.html` (Datenkonsistenz) und `tools/smoke.html` (klickt automatisch durch alle Prüfungen; löscht dabei den lokalen Fortschritt).

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
- DJKB-Prüfungsordnung (Stand Juli 2013), DJKB-Verfahrensordnung (Stand Januar 2024), DJKB-Übersichten Kihon/Kata/Kumite – djkb.com
- Allgemeines Wissen u. a. nach Wikipedia (Shōtōkan, Gichin Funakoshi, Japan Karate Association)

Prüfungsangaben ohne Gewähr – maßgeblich ist die jeweils gültige DJKB-Prüfungsordnung.
