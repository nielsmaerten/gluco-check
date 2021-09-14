# Vanliga frågor

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Hur ber jag Gluco Check om ...?](#how-do-i-ask-gluco-check-for-)
  - [ett specifikt mått](#a-specific-metric)
  - [mitt personliga val](#my-personal-selection)
  - [flera mått](#multiple-metrics)
- [Andra frågor du kan prova (experimentellt)](#other-questions-you-can-try-experimental)
- [Kan jag använda en anpassad kallelse?](#can-i-use-a-custom-invocation)
- [Varför accepterar inte Nightscout min API-hemlighet / token?](#why-is-nightscout-not-accepting-my-api-secret--token)
- [Jag har en annan fråga!](#i-have-a-different-question)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Hur ber jag Gluco Check om ...?

### ett specifikt mått

Säg: **Hej Google, fråga Gluco Check för att läsa min [blank]**.  
Ersätt **[blank]** med namnet på valfri statistik, ELLER en synonym:

| Metrisk             | Synonymer                         |
| ------------------- | --------------------------------- |
| Blodsocker          | glukos, socker, BG                |
| Kolhydrater ombord  | kolhydrater, COB, kolhydrater     |
| Insulin ombord      | insulin, IOB                      |
| Sensorålder         | sensor                            |
| Infusionssätt ålder | infusionsset, kanyl, kateter, pod |
| Pumpa batteriet     | batteri                           |
| Pumpbehållare       | insulin kvar, behållare           |
| _Allt_              | _alla värden, allt_               |

### mitt personliga val

Säg: **Hej Google, prata med Gluco Check** utan att ange ett mått.  
Assistenten läser nu de värden du valt på https://glucocheck.app.

### flera mått

Säg: **Hej Google, fråga Gluco Check för att läsa min _[blodsocker]_ och _[sensorålder]_**

## Andra frågor du kan prova (experimentellt)

- Hur gammal är min sensor? Hur gammal är min pod?
- Hur många kolhydrater har jag?
- Hur mycket insulin har jag kvar?

## Kan jag använda en anpassad kallelse?

ja!  
Om Google Assistant stöder [rutiner](https://support.google.com/googlenest/answer/7029585?co=GENIE.Platform%3DAndroid&hl=en) för ditt språk,  
följ [dessa instruktioner](https://glucocheck.app/assets/routines-setup.mp4) att skapa dina egna anrop. Till exempel:

| Istället för...                                            | säga:                         |
| ---------------------------------------------------------- | ----------------------------- |
| Hej Google, fråga Gluco Check för att läsa mitt blodsocker | Hej Google, kolla mitt socker |

## Varför accepterar inte Nightscout min API-hemlighet / token?

_API Secrets_ och _Tokens_ är inte samma sak.  
För att använda Gluco Check behöver du en _symbol_. En symbol ser ut så här: `glukocheck-1d2a6bc59`.  
Behöver du hjälp? Besök https://glucocheck.app, klicka på '_Är du inte säker på hur du skapar en token? Läs vidare!_'

## Jag har en annan fråga!

Hittade du inte svar här? Ställ din fråga i [Diskussioner](https://github.com/nielsmaerten/gluco-check/discussions). Vi hjälper gärna till!
