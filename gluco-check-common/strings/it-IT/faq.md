# Domande Frequenti

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Come posso chiedere a Gluco Check di... ?](#how-do-i-ask-gluco-check-for-)
  - [una metrica specifica](#a-specific-metric)
  - [la mia scelta personale](#my-personal-selection)
  - [metriche multiple](#multiple-metrics)
- [Altre domande che puoi provare (sperimentale)](#other-questions-you-can-try-experimental)
- [Posso usare un'invocazione personalizzata?](#can-i-use-a-custom-invocation)
- [Perchè Nightscout non accetta la mia API secret / token?](#why-is-nightscout-not-accepting-my-api-secret--token)
- [Ho una domanda diversa!](#i-have-a-different-question)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## Come posso chiedere a Gluco Check di... ?

### una metrica specifica

Dì: **Hey Google, chiedi a Gluco Check di leggere la mia [blank]**.  
Sostituisci **[blank]** con il nome di una qualsiasi metrica, OPPURE un sinonimo:

| Metrica                     | Sinonimi                                 |
| --------------------------- | ---------------------------------------- |
| Glicemia                    | glucosio, zucchero, gli                  |
| Carboidrati attivi          | carb, COB, carboidrati                   |
| Insulina attiva             | insulina, IOB                            |
| "Età" del sensore           | sensore                                  |
| "Età" del set di infusione  | set di infusione, cannula, catetere, pod |
| Batteria del microinfusore  | batteria                                 |
| Cartuccia del microinfusore | insulina rimanente, cartuccia            |
| _Tutto_                     | _tutti i valori, tutto_                  |

### la mia scelta personale

Dì: **Ehi Google, parla con Gluco Check** senza specificare una metrica.  
L'assistente leggerà i valori che avrai selezionato su https://glucocheck.app.

### metriche multiple

Say: **Hei Google, chiedi a Gluco Check di leggere la mia _[glicemia]_ e _[età del sensore]_**

## Altre domande che puoi provare (sperimentale)

- Quanto tempo ha il mio sensore? Quanto tempo ha il mio pod?
- Quanti carboidrati attivi ho?
- Quanta insulina rimane?

## Posso usare un'invocazione personalizzata?

Sì!  
Se l'Assistente Google supporta [Routine](https://support.google.com/googlenest/answer/7029585?co=GENIE.Platform%3DAndroid&hl=en) per la tua lingua,  
segui [queste istruzioni](https://glucocheck.app/routines) per creare le tue invocazioni. Per esempio:

| Invece di...                                     | dì:                                   |
| ------------------------------------------------ | ------------------------------------- |
| Ehi Google, chiedi a Gluco Check la mia glicemia | Ehi Google, controlla la mia glicemia |

## Perchè Nightscout non accetta la mia API secret / token?

Le _API secret_ e i _Token_ non sono la stessa cosa.  
Per utilizzare Gluco Check, avrai bisogno di un _token_. Un token ha questo aspetto: `glucocheck-1d2a6bc59`.  
Hai bisogno di aiuto? Visita https://glucocheck.app, fai clic su '_Not sure how to create a token? Continua a leggere!_'

## Ho una domanda diversa!

Non hai trovato una risposta qui? Pubblica la tua domanda in [Discussioni](https://github.com/nielsmaerten/gluco-check/discussions). Siamo felici di aiutarti!
