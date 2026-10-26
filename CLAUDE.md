# Hinweise für Claude

## Git
- Änderungen immer direkt auf `main` committen und pushen – keine Feature-Branches, keine Pull Requests. Das gilt auch dann, wenn die Sitzung einen eigenen Branch (z. B. `ccr-…` oder `claude/…`) vorgibt: dieser Hinweis hat Vorrang.
- Wird eine Sitzung auf einem eigenen Branch gestartet: vor der Arbeit `git checkout main && git pull origin main`, den Sitzungs-Branch lokal löschen und nicht pushen. Ist er schon auf GitHub, ihn dort löschen (oder melden, falls das nicht erlaubt ist).
- Vor dem Push `git fetch origin main` und auf den aktuellen Stand bringen.

## Vor jedem Commit
- `tools/validate.html` im Browser (Playwright) laufen lassen – muss „OK“ melden.
- `tools/smoke.html` nur direkt vor dem Push laufen lassen, nicht nach jeder Änderung – muss „OK“ melden.
- Bei jeder veröffentlichten Änderung die Version mit `node tools/version.js patch|minor|major` hochzählen (setzt Version, Datum, Uhrzeit und `?v=` in `index.html`). Die Version steht im Commit-Titel, z. B. „… (v1.11.1)“.
- Neue Skripte in `index.html`, `tools/validate.html` und `tools/smoke.html` gleichermaßen eintragen.

## Inhalte
- App, Texte und Commit-Nachrichten auf Deutsch.
- Kata-Fragen nur aus „Karate-Do Kata Vol. 1“ (JKA) mit gedruckter Buchseite (`SK.bookSrc`).
- Fragen-IDs entstehen aus Lektion, Fragetext und richtiger Antwort (`SK.qb`). `data/legacy-ids.js` ist eingefroren und wird nicht bearbeitet.
- Das Kata-PDF und `tools/out/` niemals committen.
