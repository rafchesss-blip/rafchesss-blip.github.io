# Schachkurs-Quiz

Lernfragen für den Schachkurs, auf Deutsch und Russisch.

**Seite:** https://rafchesss-blip.github.io/schachkurs/

- **Quiz:** 10 Fragen mit je 4 Antworten zum Antippen
- **Schwierige üben:** nur Fragen, die noch nicht sitzen
- **Alle Fragen:** zum Lesen und Lernen, Antwort per Antippen
- **Mein Fortschritt:** ✅ kann ich (2× hintereinander richtig), 🔄 üben, ⭐ neu

Der Fortschritt bleibt im Browser des jeweiligen Geräts gespeichert, ohne Konto.

## Neue Fragen hinzufügen

Alle Fragen stehen in [`fragen.js`](fragen.js). Für ein neues Thema hängst du
unten an `THEMEN` einen Abschnitt an:

```js
  {
    id: "taktik",
    titel: { de: "Taktik", ru: "Тактика" },
    fragen: [
      { id: "t01",
        de: ["Frage auf Deutsch?", "Antwort"],
        ru: ["Вопрос по-русски?", "Ответ"] },
    ],
  },
```

- Jede Frage braucht eine **eigene id**. Daran merkt sich die Seite den
  Fortschritt, also die id später nicht mehr ändern.
- Die falschen Antworten im Quiz sucht die Seite selbst aus den Antworten der
  anderen Fragen aus.
- Ja/Nein-Fragen (Antwort „Ja“ oder „Nein“) bekommen automatisch nur die
  beiden Knöpfe Ja und Nein.

Nach dem Hochladen auf GitHub ist die neue Version nach ein, zwei Minuten online.
