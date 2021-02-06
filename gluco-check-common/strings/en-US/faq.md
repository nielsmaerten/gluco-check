# Frequently Asked Questions
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [How do I ask Gluco Check for... ?](#how-do-i-ask-gluco-check-for-)
  - [a specific metric](#a-specific-metric)
  - [my personal selection](#my-personal-selection)
  - [multiple metrics](#multiple-metrics)
- [Other questions you can try (experimental)](#other-questions-you-can-try-experimental)
- [Can I use a custom invocation?](#can-i-use-a-custom-invocation)
- [Why is Nightscout not accepting my API secret / token?](#why-is-nightscout-not-accepting-my-api-secret--token)
- [I have a different question!](#i-have-a-different-question)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---

## How do I ask Gluco Check for... ?

###  a specific metric

Say: **Hey Google, ask Gluco Check to read my [blank]**.  
Substitute **[blank]** with the name of any metric, OR a synonym:

| Metric           | Synonyms                             |
| ---------------- | ------------------------------------ |
| Blood sugar      | glucose, sugar, BG                   |
| Carbs on board   | carbs, COB, carbohydrates            |
| Insulin on board | insulin, IOB                         |
| Sensor age       | sensor                               |
| Infusion set age | infusion set, cannula, catheter, pod |
| Pump battery     | battery                              |
| Pump reservoir   | insulin remaining, reservoir         |
| *Everything*     | *all values, all of it*              |

### my personal selection

Say: **Hey Google, talk to Gluco Check** without specifying a metric.  
Assistant will now read the values you selected on https://diabase.app.

### multiple metrics

Say: **Hey Google, ask Gluco Check to read my *[blood sugar]* and *[sensor age]***  

## Other questions you can try (experimental)

* How old is my sensor? How old is my pod?
* How many carbs do I have?
* How much insulin do I have left?

## Can I use a custom invocation?

Yes!  
If Google Assistant supports [Routines](https://support.google.com/googlenest/answer/7029585?co=GENIE.Platform%3DAndroid&hl=en) for your language,  
follow [these instructions](https://diabase.app/assets/routines-setup.mp4) to create your own invocations. For example:

| Instead of...                                      | say:                       |
| -------------------------------------------------- | -------------------------- |
| Hey Google, ask Gluco Check to read my blood sugar | Hey Google, check my sugar |

##  Why is Nightscout not accepting my API secret / token?

*API Secrets* and *Tokens* are not the same thing.  
To use Gluco Check, you'll need a *token*. A token looks like this: `glucocheck-1d2a6bc59`.  
Need help? Visit https://diabase.app, click '*Not sure how to create a token? Read on!*'

## I have a different question!

Couldn't find an answer here? Post your question in [Discussions](https://github.com/nielsmaerten/gluco-check/discussions). We're happy to help!
