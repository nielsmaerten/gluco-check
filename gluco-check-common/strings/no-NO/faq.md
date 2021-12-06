# Ofte stilte spørsmål

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Hvordan spør jeg Gluco Check om... ?](#how-do-i-ask-gluco-check-for-)
  - [en bestemt beregning](#a-specific-metric)
  - [mitt personlige valg](#my-personal-selection)
  - [flere beregninger](#multiple-metrics)
- [Andre spørsmål du kan prøve (eksperimentelle)](#other-questions-you-can-try-experimental)
- [Kan jeg bruke en egendefinert frase?](#can-i-use-a-custom-invocation)
- [Hvorfor godtar ikke Nightscout min API-hemmelighet/token?](#why-is-nightscout-not-accepting-my-api-secret--token)
- [Jeg har et annet spørsmål!](#i-have-a-different-question)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Hvordan spør jeg Gluco Check om... ?

### en bestemt beregning

Si: **Hei Google, be Gluco Check om å lese min [blank]**.  
Erstatt **[blank]** med navnet på en beregning, ELLER et synonym:

| Beregning           | Synonymer                           |
| ------------------- | ----------------------------------- |
| Blodsukker          | glukose, sukker, BS                 |
| Karbo om bord       | karbo, KOB, karbohydrater           |
| Insulin om bord     | insulin, IOB                        |
| Sensor alder        | sensor                              |
| Infusjonssett alder | infusjonssett, kanyle, kateter, pod |
| Pumpebatteri        | batteri                             |
| Pumpereservoar      | Gjenstående insulin, reservoar      |
| _Alt_               | _alle verdier, alt sammen_          |

### mitt personlige valg

Si: **Hei Google, snakk med Gluco Check** uten å spesifisere en beregning.  
Assistenten vil nå lese verdiene du valgte på https://glucocheck.app.

### flere beregninger

Si: **Hei Google, be Gluco Check om å lese mitt _[blodsukker]_ og _[sensoralder]_**

## Andre spørsmål du kan prøve (eksperimentelle)

- Hvor gammel er sensoren min? Hvor gammel er poden min?
- Hvor mange karbo har jeg?
- Hvor mye insulin har jeg igjen?

## Kan jeg bruke en egendefinert frase?

Ja!  
Hvis Google Assistant støtter [rutiner](https://support.google.com/googlenest/answer/7029585?co=GENIE.Platform%3DAndroid&hl=en) for ditt språk,  
følg [disse instruksjonene](https://glucocheck.app/routines) for å lage dine egne fraser. For eksempel:

| I stedet for...                                          | si:                                 |
| -------------------------------------------------------- | ----------------------------------- |
| Hei Google, be Gluco Check om å sjekke blodsukkeret mitt | Hei Google, sjekk blodsukkeret mitt |

## Hvorfor godtar ikke Nightscout min API-hemmelighet/token?

_API Secrets_ og _Tokens_ er ikke det samme.  
For å bruke Gluco Check trenger du en _token_. En token ser slik ut: `glucocheck-1d2a6bc59`.  
Trenger du hjelp? Gå til https://glucocheck.app, click '_Not sure how to create a token? Les videre!_'

## Jeg har et annet spørsmål!

Fant du ikke svar her? Publiser ditt spørsmål i [diskusjoner](https://github.com/nielsmaerten/gluco-check/discussions). Vi hjelper deg gjerne!
