# Hinweise für Claude

## Git
- Änderungen immer direkt auf `main` committen und pushen – keine Feature-Branches, keine Pull Requests.
- Vor dem Push `git fetch origin main` und auf den aktuellen Stand bringen.

## Vor jedem Commit
- `tools/validate.html` und `tools/smoke.html` im Browser (Playwright) laufen lassen – beide müssen „OK“ melden.
- Bei jeder veröffentlichten Änderung die Version mit `node tools/version.js patch|minor|major` hochzählen (setzt Version, Datum, Uhrzeit und `?v=` in `index.html`). Die Version steht im Commit-Titel, z. B. „… (v1.11.1)“.
- Neue Skripte in `index.html`, `tools/validate.html` und `tools/smoke.html` gleichermaßen eintragen.

## Inhalte
- App, Texte und Commit-Nachrichten auf Deutsch.
- Kata-Fragen nur aus „Karate-Do Kata Vol. 1“ (JKA) mit gedruckter Buchseite (`SK.bookSrc`).
- Fragen-IDs entstehen aus Lektion, Fragetext und richtiger Antwort (`SK.qb`). `data/legacy-ids.js` ist eingefroren und wird nicht bearbeitet.
- Das Kata-PDF und `tools/out/` niemals committen.
