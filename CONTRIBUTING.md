# Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

### 📖 What's in this document?

- How to set up a dev environment to work on Gluco Check
- An explanation of the project's architecture

### 🙋‍♀️ Who's it for?

- For myself, in case I need to get reacquainted with the project after working on something else for a while
- For you! If you want to contribute to Gluco Check, or want to run it on your own

---

## Setting up your dev environment

### 🔧 Tools

- Yarn 1.x (required)
- Node 12 or higher (required)
- Visual Studio Code (recommended)
- [Firebase Tools] (only for package `webhooks`)
- [Google Actions CLI] (only for package `actions`)

[firebase tools]: https://www.npmjs.com/package/firebase-tools
[google actions cli]: https://developers.google.com/assistant/conversational/df-asdk/actions-sdk/gactions-cli

### 📦 Project setup

In the repo's root folder, run:

```
yarn
```

Gluco Check consists of multiple node packages. Each packages serves a well defined function, and is explained in more detail below.

Running `yarn` installs 3rd party dependencies, and links the packages together (they can depend on each other).

---

## Architecture

### gluco-check-action

This action is built using [Google Actions Builder] and exported to YAML files using the [`gactions`] CLI. Using these YAML files, the CLI can also redeploy the entire action back to Google Cloud.

There are 2 ways to invoke the Action:

- Hey Google, talk to Gluco Check (main invocation)
- Hey Google, ask Gluco Check for my glucose and IOB (deep invocation)

Both invocations will result in the `webhook` being called. In case of deep invocation, the HTTP request will also include the items the user has asked for.

[google actions builder]: https://console.actions.google.com
[`gactions` cli]: https://developers.google.com/assistant/conversational/df-asdk/actions-sdk/gactions-cli

### gluco-check-common

All translated strings live here. The YAML files in `common` should not be changed manually. Instead, [Crowdin] auto-updates them with new translations. To speed up cold starts, the other packages don't directly read the YAML files. Instead, they import JSON files with the same name.

`yarn build` converts the YAML to JSON.

[crowdin]: (https://crowdin.com)

### gluco-check-webhook

There are two webhooks. They are deployed as [Firebase] HTTP functions.

[firebase]: https://firebase.google.com

- **validateUrl**:  
  Used by the web interface to check if the Nightscout URL a user has entered is valid.

- **conversation**:  
  Called by Google Actions. When a request comes in, it is routed to the `core` package for processing. (see further)

Run `yarn deploy` to deploy the webhooks to Firebase.

### gluco-check-core

_(the snippets below are Sequence Diagrams, but GitHub can't display them yet. Open this file in a supported editor like VSCode's Markdown Preview to see them)_

When a user says: _'Ok Google, talk to Gluco Check'_, the Google Assistant invokes our `webhook` to get a response. The incoming HTTP request is transformed into a `Conversation` object by the Actions SDK:

```sequence
User->Google Actions: "'Ok Google, Talk to Gluco Check'"
Google Actions->Webhook: HTTP Request
Webhook->Core: JSON Conversation Object
Note left of Core: Processing...
Core->Webhook: Conversation Response
Webhook->Google Actions: HTTP Response
Google Actions->User: "'103 and stable as of a minute ago'"
```

When the `core` package receives a `Conversation`, it is first routed to the `ConversationDecoder`. The `ConversationDecoder` inspects the request to find out what exactly the user asked for. A user can ask for 1 or more `DiabetesPointers`. Blood sugar, Insulin on board and Sensor Age are all examples of `DiabetesPointers`. From the `DiabetesPointers`, the `ConversationDecoder` builds a `DiabetesQuery` and forwards it to `DiabetesQueryResolver`:

```sequence
Core->ConversationDecoder: Conversation
Note right of ConversationDecoder: Extract requested DiabetesPointer(s)
Note right of ConversationDecoder: 'DiabetesPointers' = iob, glucose, ...
ConversationDecoder->Core: DiabetesQuery
Core->DiabetesQueryResolver: DiabetesQuery
Note left of DiabetesQueryResolver: Processing...
DiabetesQueryResolver->Core: AssistantResponse
```

`DiabetesQueryResolver` looks up the user in Firebase to find the URL to their Nightscout Site. It then uses the Nightscout API to query the requested data. From this, it constructs a `DiabetesSnapshot`. A `DiabetesSnapshot` is the state of the user's diabetes at a certain point in time. It may contains a timestamp, and the values for all `DiabetesPointers` the user has requested.

The `DiabetesSnapshot` is now forwarded to the `ResponseFormatter`, which will turn it into text that the Google Assistant can say back in response to the user's question:

```sequence
Note left of DiabetesQueryResolver: DiabetsQuery comes in...
DiabetesQueryResolver->Firebase: Lookup user
Firebase->DiabetesQueryResolver: UserProfile
DiabetesQueryResolver->Nightscout: Lookup requested data
Nightscout->DiabetesQueryResolver: Nightscout Data
Note right of DiabetesQueryResolver: Builds a DiabetesSnapshot
DiabetesQueryResolver->ResponseFormatter: DiabetesSnapshot
Note left of ResponseFormatter: Builds response in the user's locale
ResponseFormatter->DiabetesQueryResolver: AssistantResponse
```
