# Häufig gestellte Fragen

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Wie frage ich Gluco Check nach... ?](#wie-frage-ich-gluco-check-nach-)
  - [einen bestimmten Wert](#einen-bestimmten-wert)
  - [meine persönliche Auswahl](#meine-pers%C3%B6nliche-auswahl)
  - [mehrere Werte](#mehrere-werte)
- [Andere Fragen, die du ausprobieren kannst (experimentell)](#andere-fragen-die-du-ausprobieren-kannst-experimentell)
- [Kann ich einen benutzerdefinierten Aufruf verwenden?](#kann-ich-einen-benutzerdefinierten-aufruf-verwenden)
- [Warum akzeptiert Nightscout nicht meine API Secret / Token?](#warum-akzeptiert-nightscout-nicht-meine-api-secret--token)
- [Ich habe eine andere Frage!](#ich-habe-eine-andere-frage)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Wie frage ich Gluco Check nach... ?

### einen bestimmten Wert

Sage: **Hey Google, frage Gluco Check nach [blank]**.  
Ersetze **[blank]** mit dem Namen eines Wertes ODER eines Synonyms dafür:

| Wert                 | Synonym                             |
| -------------------- | ----------------------------------- |
| Blutzucker           | Glukose, Zucker, BZ                 |
| Aktive Kohlenhydrate | Kohlenhydrate, COB, Kohlenhydrate   |
| Aktives Insulin      | Insulin, IOB                        |
| Sensoralter          | Sensor                              |
| Alter Infusionsset   | Infusionsset, Kanüle, Katheter, Pod |
| Pumpenbatterie       | Akku, Batterie                      |
| Pumpenreservoir      | verbleibendes Insulin, Reservoir    |
| _Alles_              | _alle Werte, alles_                 |

### meine persönliche Auswahl

Sage: **Hey Google, sprich mit Gluco Check** ohne Angabe einer Metrik.  
Assistent liest nun die von dir auf https://glucocheck.app gewählten Werte ein.

### mehrere Werte

Sag: **Hey Google, frage Gluco Check nach meinem _[Blutzucker]_ und _[Sensoralter]_**

## Andere Fragen, die du ausprobieren kannst (experimentell)

- Wie alt ist mein Sensor? Wie alt ist mein Pod?
- Wie viele Kohlenhydrate habe ich?
- Wie viel Restinsulin habe ich?

## Kann ich einen benutzerdefinierten Aufruf verwenden?

Ja!  
Wenn Google Assistant [Routienen](https://support.google.com/googlenest/answer/7029585?co=GENIE.Platform%3DAndroid&hl=en) für deine Sprache unterstützt,  
folge [diesen Anweisungen](https://glucocheck.app/routines) um deine eigenen Anrufe zu erstellen. Zum Beispiel:

| Statt...                                                      | sage                                |
| ------------------------------------------------------------- | ----------------------------------- |
| Hallo Google, bitte Gluco Check um meinen Blutzucker zu lesen | Hey Google, überprüfe meinen Zucker |

## Warum akzeptiert Nightscout nicht meine API Secret / Token?

_API Secrets_ and _Tokens_ sind nicht dasselbe.  
Um Gluco Check zu verwenden, benötigen Sie ein _Token_. Ein Token sieht folgendermaßen aus: `glucocheck-1d2a6bc59`.  
Brauchst du Hilfe? Besuche https://glucocheck.app, klicke '_Nicht sicher, wie man einen Token erstellt? Weiterlesen!_'

## Ich habe eine andere Frage!

Hier keine Antwort gefunden? Schreibe deine Frage in [Diskussionen](https://github.com/nielsmaerten/gluco-check/discussions). Wir helfen gern weiter!
