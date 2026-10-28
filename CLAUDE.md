# Hinweise für Claude

## Git
- Änderungen immer direkt auf `main` committen und pushen – keine Feature-Branches, keine Pull Requests. Das gilt auch dann, wenn die Sitzung einen eigenen Branch (z. B. `ccr-…` oder `claude/…`) vorgibt: dieser Hinweis hat Vorrang.
- Wird eine Sitzung auf einem eigenen Branch gestartet: vor der Arbeit `git checkout main && git pull origin main`, den Sitzungs-Branch lokal löschen und nicht pushen. Ist er schon auf GitHub, ihn dort löschen (oder melden, falls das nicht erlaubt ist).
- Vor dem Push `git fetch origin main` und auf den aktuellen Stand bringen.

## Vor jedem Commit
- `tools/test/validate.html` im Browser (Playwright) laufen lassen – muss „OK“ melden.
- `tools/test/smoke.html` nur direkt vor dem Push laufen lassen, nicht nach jeder Änderung – muss „OK“ melden.
- Bei jeder veröffentlichten Änderung die Version mit `node tools/version.js patch|minor|major` hochzählen (setzt Version, Datum, Uhrzeit und `?v=` in `index.html`). Die Version steht im Commit-Titel, z. B. „… (v1.11.1)“.
- Neue Skripte in `index.html`, `tools/test/validate.html` und `tools/test/smoke.html` gleichermaßen eintragen.

## Kata-Ansage (Bodenkarte) ändern
- Korrekturen an einer bestimmten Stelle einer Kata möglichst in den Daten dieser Kata (`ansage` in `data/kata-*.js`) machen, nicht in den allgemeinen Regeln in `js/kata-ansage.js` (Stände, Ausgleich, Gewichte). Muss doch eine allgemeine Regel geändert werden, vorher sagen, welche Kata und Stände sie betrifft.
- Vor jedem Commit, der `data/kata-*.js` oder `js/kata-ansage.js` ändert, `node tools/ansage-vergleich.js` laufen lassen und dem Nutzer melden, welche Kata und Bewegungen sich gegenüber dem letzten Stand verändert haben – auch Folgeänderungen (ein stehender Fuß wandert in allen Bewegungen mit, in denen er steht).

## Inhalte
- App, Texte und Commit-Nachrichten auf Deutsch.
- Kata-Fragen nur aus „Karate-Do Kata Vol. 1“ (JKA) mit gedruckter Buchseite (`SK.bookSrc`).
- Fragen-IDs entstehen aus Lektion, Fragetext und richtiger Antwort (`SK.qb`). `data/legacy-ids.js` ist eingefroren und wird nicht bearbeitet.
- Das Kata-PDF und `tools/out/` niemals committen.

## Buchwissen (ohne PDF)
- Bei Fragen zum Buch oder neuen Kata-Inhalten zuerst `docs/buch-register.md` lesen: Seitenzählung, Kapitel, Zusammenfassungen der allgemeinen Kapitel, Hinweise des Buches je Bewegung und Ablauftabellen aller zehn Kata. Nur Fakten und eigene Worte ins Repo, keine Abschriften aus dem Buch.
- Die Ablauftabellen im Register werden aus den App-Daten erzeugt: nach Änderungen an `seq` oder `ansage` in `data/kata-*.js` `node tools/register-tabellen.js` laufen lassen.
- Fußstellungen je Bewegung (Kata-Ansage) stehen für alle Kata in `ansage` in `data/kata-*.js`, gewonnen aus den Fußskizzen mit `tools/kata-pdf/` (siehe dortige README). Liegt das PDF wieder vor, immer über `tools/kata-pdf/scans.py` lesen – im PDF sind die Scan-Bilder verschoben und werden beim normalen Rendern abgeschnitten.
