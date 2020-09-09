# Contributing

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

### 📖 What's in this document?

- How to set up a dev environment to work on Gluco Check
- An explanation of the project's architecture

### 🙋‍♀️ Who's it for?

- For myself, in case I need to get reacquainted with the project after working on something else for a while
- For you! If you want to contribute to Gluco Check, or want to run it on your own.

## 🌱 Setting up your dev environment

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

Running `yarn` installs 3rd party dependencies, and links the packages together (they can depend on each other)

## 🧱 Architecture

### gluco-check-actions

This action is built using [Google Actions Builder] and exported to YAML files using the [`gactions` CLI]. Using these YAML files, the CLI can also redeploy the entire action back to Google Cloud.

There are 2 ways to invoke the Action:

- Hey Google, talk to Gluco Check (main invocation)
- Hey Google, ask Gluco Check for my glucose and IOB (deep invocation)

Both invocations will result in the `webhook` being called. In case of deep invocation, the HTTP request will also include the items the user has asked for.

[google actions builder]: https://console.actions.google.com
[`gactions` cli]: https://developers.google.com/assistant/conversational/df-asdk/actions-sdk/gactions-cli

### gluco-check-common

All translated strings live here.

The YAML files in `common` should not be changed manually. Instead, [Crowdin] auto-updates them with new translations.

To speed up cold starts, the other packages don't directly read the YAML files. Instead, they import JSON files with the same name.

`yarn build` converts the YAML to JSON.  
**Don't forget to rebuild after pulling new translations from Git.**

```
// TODO: Maybe add a git hook to run yarn build after each pull?
```

[crowdin]: (https://crowdin.com)

### gluco-check-webhook

Gluco Check's webhooks are 2 [Firebase Functions]:

[firebase functions]: https://firebase.google.com

##### validateUrl

Used by the web interface to check if the Nightscout URL a user has entered is valid.

##### conversation

Called by Google Actions. When a request comes in, it is routed to the `core` package for processing.

#### Deploying

Run:

```
yarn deploy
```

Note: it's important to run the pre- and post-deploy hooks in `deploy-hooks.js`. Otherwise the `common` and `core` packages won't be available to `webhooks`.  
`yarn build` will run the hooks automatically.

### gluco-check-core

# TODO :)