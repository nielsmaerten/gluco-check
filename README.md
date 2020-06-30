[![Code Style: Google](https://img.shields.io/badge/code%20style-google-blueviolet.svg)](https://github.com/google/gts)

# Gluco Check

Gluco Check will be the successor to "Nightscout Assistant" (https://github.com/nielsmaerten/nightscout-assistant)

## Project Goals

- Faster responses
- Easier L10N
- Support for more queries (eg COB, IOB, Sensor age, ...)

## This is a work in progress

No ETA just yet. But feel free to subscribe to the repo for updates :)

## Notes, ToDos, etc

GlucoCheck will consist of a few different node packages:

- _gluco-check-webhook_

  - Google Assistant works by passing an HTTP request to a webhook when a user asks the app a question.  
    The webhook should then answer within 5s, but ideally much faster.
  - So, _gluco-check-webhook_ will be a Firebase Cloud Function listening for those requests.
  - When a request comes in, Google Actions provides a 'conversation' object as a parameter. This will be passed on to the next package: _gluco-check-core_

- _gluco-check-core_ will contain the core logic of the app.  
  It's job is to translate a Conversation object (representing a question asked by a user) into a response that Google Assistant should say back.

- _gluco-check-web_ will be the web interface. This is where users will enter the URL to their nightscout site, set the preferred glucose unit, etc.

- _gluco-check-strings_ will be shared among the packages above, and will contain all localized strings used by the app. This will be the package that's going to be managed by CrowdIn. I intend to use Lerna to share the strings package with other packages without having to resort to actually publishing it to a registry

### Gluco Check Core:

When a Google Actions Conversation object comes in, it will be decoded into a UserQuery. This UserQuery will then represent what the user is actually asking for. This could be:

- just the current glucose level
- the current COB value
- all available values
- (in some future version?) the glucose level of someone else?

Then, the UserQuery should be resolved into a UserReply. But this is basically just speech XML, or a string we can get Google Assistant to say back.

How do we get from Query to Reply? By reaching out to Nightscout**. Depending on the Query, we'll need to do one or more API calls. These calls should then result into a UserSnapshot.

A UserSnapshot represents the diabetes of a person at a certain point in time. It contains things like glucose, cob, etc. We can use a UserSnapshot to build a Reply.

** I'd like to be able to add different glucose sharing services in later versions as well